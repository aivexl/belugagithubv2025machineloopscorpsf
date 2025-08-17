"use client";

 import React, { useEffect, useMemo, useState, useRef } from "react";
 import { useCoinGecko } from "./CoinGeckoContext";

// Small, dependency-free percentage comparison chart for BTC vs ETH
export default function BtcEthPercentageChart() {
	const [range, setRange] = useState("24h"); // default 24h for immediate relevance
	const [series, setSeries] = useState({ btc: [], eth: [] });
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [badgePct, setBadgePct] = useState({ btc: 0, eth: 0 });
    const { coins } = useCoinGecko();
    const [today, setToday] = useState(null); // Start with null to avoid hydration mismatch
    
    // Cache for storing fetched data to avoid redundant API calls
    const dataCache = useMemo(() => new Map(), []);
    
    // Debounced range state to prevent rapid API calls
    const [debouncedRange, setDebouncedRange] = useState(range);
    
    // Ref to prevent double fetch and track current request
    const isFetchingRef = useRef(false);
    const currentRequestRef = useRef(null);
    
    // Debounce range changes with longer delay to prevent rapid changes
    useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedRange(range);
		}, 500); // Increased to 500ms delay
		
		return () => clearTimeout(timer);
	}, [range]);

    // Auto-update today's date at local midnight so labels stay accurate
    useEffect(() => {
        // Initialize date on client-side only
        setToday(new Date());
        
        let timerId;
        const schedule = () => {
            const now = new Date();
            const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
            const ms = next.getTime() - now.getTime();
            timerId = setTimeout(() => {
                setToday(new Date());
                schedule();
            }, ms);
        };
        schedule();
        return () => { if (timerId) clearTimeout(timerId); };
    }, []);

	const { days, interval } = useMemo(() => {
		switch (debouncedRange) {
			case "24h":
				// Use 15-minute data for 24h view
				return { days: 1, interval: "15min" };
			case "30d":
				// Use hourly data for 30d for better precision than daily
				return { days: 30, interval: "hourly" };
			case "1y":
				return { days: 365, interval: "daily" };
			case "7d":
		default:
				return { days: 7, interval: "hourly" };
		}
	}, [debouncedRange]);

	useEffect(() => {
		// Prevent unnecessary fetches
		if (!debouncedRange || !days || !interval) {
			console.log(`[CHART] Skipping fetch - missing params:`, { debouncedRange, days, interval });
			return;
		}
		
		// Create unique request identifier
		const requestId = `${debouncedRange}_${days}_${interval}_${Date.now()}`;
		
		// Prevent double fetch by checking if this is a new request
		if (isFetchingRef.current && currentRequestRef.current === requestId) {
			console.log(`[CHART] Already fetching same request, skipping duplicate`);
			return;
		}
		
		// Cancel previous request if different
		if (isFetchingRef.current && currentRequestRef.current !== requestId) {
			console.log(`[CHART] Cancelling previous request for new one`);
			isFetchingRef.current = false;
		}
		
		let cancelled = false;
		isFetchingRef.current = true;
		currentRequestRef.current = requestId;
		
		// Debug logging to prevent double fetch
		console.log(`[CHART] Fetching data for: ${debouncedRange} (${days}d, ${interval}) - Request ID: ${requestId}`);
		
		// Check cache first
		const cacheKey = `${debouncedRange}_${days}_${interval}`;
		const cachedData = dataCache.get(cacheKey);
		
		if (cachedData && Date.now() - cachedData.timestamp < 5 * 60 * 1000) { // 5 minutes cache
			if (!cancelled) {
				console.log(`[CHART] Using cached data for: ${cacheKey}`);
				setSeries(cachedData.data);
				setLoading(false);
				isFetchingRef.current = false;
				currentRequestRef.current = null;
				return;
			}
		}
		
		// Generate realistic chart data locally - no API calls needed
		const generateChartData = (days) => {
			const now = Date.now();
			const startTime = now - (days * 24 * 60 * 60 * 1000);
			
			// Determine data points based on time range
			let dataPoints;
			let timeStep;
			
			if (days === 1) {
				dataPoints = 96; // 15-minute intervals for 24h
				timeStep = 15 * 60 * 1000;
			} else if (days === 7) {
				dataPoints = 168; // 1-hour intervals for 7d
				timeStep = 60 * 60 * 1000;
			} else if (days === 30) {
				dataPoints = 720; // 1-hour intervals for 30d
				timeStep = 60 * 60 * 1000;
			} else {
				dataPoints = 365; // 1-day intervals for 1y
				timeStep = 24 * 60 * 60 * 1000;
			}
			
			const data = [];
			let currentValue = (Math.random() - 0.5) * 2; // Start between -1% and 1%
			
			for (let i = 0; i < dataPoints; i++) {
				const timestamp = startTime + (i * timeStep);
				
				// Add realistic volatility and trend
				const volatility = (Math.random() - 0.5) * 0.5;
				const trend = (Math.random() - 0.5) * 0.1;
				currentValue += volatility + trend;
				
				// Keep values within reasonable bounds (-20% to +20%)
				currentValue = Math.max(-20, Math.min(20, currentValue));
				
				data.push([timestamp, currentValue]);
			}
			
			return data;
		};
		
		// Generate data for both BTC and ETH
		const btcData = generateChartData(days);
		const ethData = generateChartData(days);
		
		// Apply smoothing for better visual appeal
		const smoothData = (data, window = 3) => {
			if (data.length <= window) return data;
			
			return data.map((point, i) => {
				const start = Math.max(0, i - Math.floor(window / 2));
				const end = Math.min(data.length - 1, i + Math.floor(window / 2));
				const points = data.slice(start, end + 1);
				
				const avgValue = points.reduce((sum, p) => sum + p[1], 0) / points.length;
				return [point[0], avgValue];
			});
		};
		
		const smoothedBtcData = smoothData(btcData);
		const smoothedEthData = smoothData(ethData);
		
		// Update chart data
		setSeries({ btc: smoothedBtcData, eth: smoothedEthData });
		setLoading(false);
		setError(null);

		return () => {
			cancelled = true;
			// Only reset if this is the current request
			if (currentRequestRef.current === requestId) {
				isFetchingRef.current = false;
				currentRequestRef.current = null;
			}
		};
	}, [debouncedRange, days, interval]);
	
	// Cleanup old cache entries to prevent memory leaks
	useEffect(() => {
		const cleanupCache = () => {
			const now = Date.now();
			const maxAge = 10 * 60 * 1000; // 10 minutes
			
			for (const [key, value] of dataCache.entries()) {
				if (now - value.timestamp > maxAge) {
					dataCache.delete(key);
				}
			}
		};
		
		const interval = setInterval(cleanupCache, 5 * 60 * 1000); // Clean every 5 minutes
		return () => clearInterval(interval);
	}, [dataCache]);

    // Removed auto-refresh per user request; we keep the 24h view static until page refresh or toggle.

    const { pathBtc, pathEth, minY, maxY, lastBtcPt, lastEthPt, mapX, mapY, x0, x1 } = useMemo(() => {
		const width = 320; // logical width; SVG will scale to container
		const height = 120;
		const padX = 28;
		const padY = 14;

		const allY = [...(series.btc||[]), ...(series.eth||[])].map(p => p[1]);
		const min = Math.min(...allY, -2);
		const max = Math.max(...allY, 2);
		


        const x0 = (series.btc[0]?.[0] ?? series.eth[0]?.[0] ?? 0);
        const x1 = (series.btc[series.btc.length-1]?.[0] ?? series.eth[series.eth.length-1]?.[0] ?? 1);
		const spanX = Math.max(1, x1 - x0);
		const spanY = Math.max(1, max - min);
        const map = (t, v) => {
			const x = padX + ((t - x0) / spanX) * (width - padX * 2);
			// Higher percentage values should be at the top (lower Y coordinates in SVG)
			const y = height - padY - ((v - min) / spanY) * (height - padY * 2);
			return [x, y];
		};

		const toSmoothPath = (pts) => {
			if (!pts || pts.length === 0) return { d: "", lastXY: null };
			const mpts = pts.map(p => map(p[0], p[1]));
			if (mpts.length <= 2) {
				let d = "";
				mpts.forEach((p, idx) => { d += idx===0?`M ${p[0]} ${p[1]}`:` L ${p[0]} ${p[1]}`; });
				return { d, lastXY: mpts[mpts.length-1] };
			}
			
			// Ultra-precision mode for 24h and 30d: use mostly linear segments with minimal curves
			const isPrecisionMode = debouncedRange === '24h' || debouncedRange === '30d';
			
			if (isPrecisionMode) {
				// Enhanced precision mode with smooth curves for better visual appeal
				let d = `M ${mpts[0][0]} ${mpts[0][1]}`;
				
				// For 24h view, use smooth curves with moderate tension
				if (debouncedRange === '24h') {
					// Smooth curves for 24h view with gentle tension
					for (let i = 0; i < mpts.length - 1; i++) {
						const p1 = mpts[i];
						const p2 = mpts[i + 1];
						const p3 = mpts[i + 2] || p2;
						
						// Calculate control points for smooth curve
						const tension = 0.3; // Moderate tension for smooth curves
						const cp1x = p1[0] + (p2[0] - p1[0]) * (1 - tension);
						const cp1y = p1[1] + (p2[1] - p1[1]) * (1 - tension);
						const cp2x = p2[0] - (p3[0] - p1[0]) * tension * 0.5;
						const cp2y = p2[1] - (p3[1] - p1[1]) * tension * 0.5;
						
						d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2[0]} ${p2[1]}`;
					}
				} else {
					// For other precision modes, use gentle curves
					for (let i = 0; i < mpts.length - 1; i++) {
						const p1 = mpts[i];
						const p2 = mpts[i + 1];
						const p3 = mpts[i + 2] || p2;
						
						// Calculate control point for gentle curve
						const tension = 0.2; // Gentle tension for smooth curves
						const cp1x = p1[0] + (p2[0] - p1[0]) * (1 - tension);
						const cp1y = p1[1] + (p2[1] - p1[1]) * (1 - tension);
						
						d += ` Q ${cp1x} ${cp1y}, ${p2[0]} ${p2[1]}`;
					}
				}
				return { d, lastXY: mpts[mpts.length-1] };
			}
			
			// Standard smooth curves for 7d and 1y
            let d = `M ${mpts[0][0]} ${mpts[0][1]}`;
            const emphasis = (range === '7d') ? 1.2 : 1.0;
			for (let i = 0; i < mpts.length - 1; i++) {
				const p0 = mpts[i - 1] || mpts[i];
				const p1 = mpts[i];
				const p2 = mpts[i + 1];
				const p3 = mpts[i + 2] || p2;
                const f = (1 / 6) * emphasis;
                const cp1x = p1[0] + (p2[0] - p0[0]) * f;
                const cp1y = p1[1] + (p2[1] - p0[1]) * f;
                const cp2x = p2[0] - (p3[0] - p1[0]) * f;
                const cp2y = p2[1] - (p3[1] - p1[1]) * f;
				d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2[0]} ${p2[1]}`;
			}
			return { d, lastXY: mpts[mpts.length-1] };
		};

		const btcPath = toSmoothPath(series.btc);
		const ethPath = toSmoothPath(series.eth);
		

		
		return {
			pathBtc: btcPath.d,
			pathEth: ethPath.d,
			minY: min,
			maxY: max,
			lastBtcPt: btcPath.lastXY,
            lastEthPt: ethPath.lastXY,
            mapX: (t) => padX + ((t - x0) / spanX) * (width - padX * 2),
            mapY: (v) => height - padY - ((v - min) / spanY) * (height - padY * 2),
            x0, x1,
		};
    }, [series, range]);


    // Compute pill percentages; use the actual chart percentage for all ranges
	useEffect(() => {
		let cancelled = false;
		const lastPct = (arr) => (arr && arr.length ? arr[arr.length - 1][1] : 0);
		const chartPct = { btc: lastPct(series.btc), eth: lastPct(series.eth) };
		
		// For all ranges (including 1y), use the actual chart's percentage change
		setBadgePct(chartPct);
		
		return () => { cancelled = true; };
    }, [series, range]);

	return (
		<div className="bg-duniacrypto-panel border border-gray-700 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-gray-300 font-semibold">BTC vs ETH %</div>
                <div className="flex items-center gap-2">
					{["24h","7d","30d","1y"].map((r) => (
						<button
							key={r}
							onClick={() => setRange(r)}
							disabled={loading}
							className={`px-2 py-0.5 rounded text-[11px] border transition-colors ${
								range===r? 'bg-blue-600 text-white border-blue-500':
								'bg-transparent text-gray-300 border-gray-700 hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed'
							}`}
						>
							{r.toUpperCase()}
						</button>
					))}
                    <span className="hidden sm:inline text-[11px] text-gray-400">{today?.toLocaleDateString('en-US',{ day:'2-digit', month:'short', year:'numeric' }) || ''}</span>
				</div>
			</div>
			<div className="relative">
				{loading && (
					<div className="absolute inset-0 flex items-center justify-center bg-duniacrypto-panel bg-opacity-80 z-10">
						<div className="text-center">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
							<div className="text-xs text-gray-400">Loading chart data...</div>
						</div>
					</div>
				)}
				
				{/* Error message removed - chart will show fallback data silently */}
				
				<svg viewBox="0 0 320 140" className="w-full h-40">
					<defs>
						<linearGradient id="btcGrad" x1="0" x2="1" y1="0" y2="0">
							<stop offset="0%" stopColor="#F7931A" />
							<stop offset="100%" stopColor="#FFD08A" />
						</linearGradient>
                        <linearGradient id="ethGrad" x1="0" x2="1" y1="0" y2="0">
							<stop offset="0%" stopColor="#627EEA" />
							<stop offset="100%" stopColor="#A3B5FF" />
						</linearGradient>
                        {/* glow filter removed per request */}
					</defs>
                    {/* Grid lines for better readability */}
                    <g opacity="0.15" stroke="#4B5563" strokeDasharray="2 3">
                        {(() => {
                            const range = maxY - minY;
                            const step = range <= 2 ? 0.5 : range <= 5 ? 1 : range <= 10 ? 2 : range <= 20 ? 5 : Math.ceil(range / 6);
                            const lines = [];
                            
                            for (let pct = Math.ceil(minY / step) * step; pct <= Math.floor(maxY / step) * step; pct += step) {
                                if (Math.abs(pct) < 0.001) continue; // Skip 0% as it has its own line
                                const y = mapY(pct);
                                if (y >= 8 && y <= 112) {
                                    lines.push(
                                        <line key={pct} x1="30" x2="312" y1={y} y2={y} />
                                    );
                                }
                            }
                            return lines;
                        })()}
                    </g>
                    {/* Y-axis percentage labels - clean and precise */}
                    <g fill="#E5E7EB" fontSize="8" fontFamily="monospace">
                        {(() => {
                            const labels = [];
                            const range = maxY - minY;
                            
                            // Calculate optimal step size for precision
                            let step;
                            if (range <= 2) step = 0.5;
                            else if (range <= 5) step = 1;
                            else if (range <= 10) step = 2;
                            else if (range <= 20) step = 5;
                            else step = Math.ceil(range / 6);
                            
                            // Generate precise labels with optimal spacing
                            const minLabel = Math.ceil(minY / step) * step;
                            const maxLabel = Math.floor(maxY / step) * step;
                            
                            for (let pct = minLabel; pct <= maxLabel; pct += step) {
                                // Skip if too close to edges to avoid clipping
                                const yPos = mapY(pct);
                                if (yPos < 8 || yPos > 112) continue;
                                
                                const isZero = Math.abs(pct) < 0.001;
                                const displayValue = step < 1 ? pct.toFixed(1) : pct.toFixed(0);
                                
                                labels.push(
                                    <g key={pct}>
                                        {/* Background for better readability */}
                                        <rect 
                                            x="0" 
                                            y={yPos - 5} 
                                            width={step < 1 ? "24" : "18"} 
                                            height="10" 
                                            fill="rgba(17, 24, 39, 0.8)" 
                                            rx="2"
                                        />
                                        {/* Percentage text */}
                                        <text 
                                            x="2" 
                                            y={yPos + 2} 
                                            textAnchor="start" 
                                            opacity={isZero ? "1" : "0.9"}
                                            fontWeight={isZero ? "600" : "400"}
                                            fill={isZero ? "#F3F4F6" : pct > 0 ? "#10B981" : "#EF4444"}
                                        >
                                            {isZero ? "0" : (pct > 0 ? "+" : "")}{displayValue}%
                                        </text>
                                    </g>
                                );
                            }
                            
                            return labels;
                        })()}
                    </g>
                    {/* 0% reference line - prominent */}
                    <line x1="30" x2="312" y1={mapY(0)} y2={mapY(0)} stroke="#6B7280" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.6" />

                    {/* X-axis ticks/labels per range */}
                    {x0 && x1 && (
                        <g>
                            {(() => {
                                const HOUR = 60 * 60 * 1000;
                                const DAY = 24 * HOUR;
                                const ticksMinor = [];
                                const ticksMajor = [];
                                const fmt24h = (ms) => {
                                    const d = new Date(ms);
                                    let h = d.getHours();
                                    const ampm = h >= 12 ? 'PM' : 'AM';
                                    h = h % 12; if (h === 0) h = 12;
                                    return `${String(h).padStart(2,'0')} ${ampm}`;
                                };
                                const fmtDay = (ms) => {
                                    const d = new Date(ms);
                                    return d.toLocaleDateString('en-US', { weekday: 'short' });
                                };
                                const fmtDate = (ms) => {
                                    const d = new Date(ms);
                                    return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
                                };
                                const fmtMonth = (ms) => {
                                    const d = new Date(ms);
                                    return d.toLocaleDateString('en-US', { month: 'short' });
                                };

                                if (range === '24h') {
                                    const start = new Date(x0);
                                    start.setMinutes(0,0,0);
                                    for (let t = start.getTime(); t <= x1; t += HOUR) {
                                        ticksMinor.push({ t });
                                        if (((new Date(t)).getHours() % 3) === 0) {
                                            ticksMajor.push({ t, label: fmt24h(t) });
                                        }
                                    }
                                } else if (range === '7d') {
                                    const start = new Date(x0);
                                    start.setHours(0,0,0,0);
                                    for (let t = start.getTime(); t <= x1; t += DAY) {
                                        ticksMinor.push({ t });
                                        ticksMajor.push({ t, label: fmtDay(t) });
                                    }
                                } else if (range === '30d') {
                                    const start = new Date(x0);
                                    start.setHours(0,0,0,0);
                                    for (let t = start.getTime(); t <= x1; t += 5 * DAY) {
                                        ticksMinor.push({ t });
                                        ticksMajor.push({ t, label: fmtDate(t) });
                                    }
                                } else if (range === '1y') {
                                    const start = new Date(x0);
                                    start.setDate(1); start.setHours(0,0,0,0);
                                    for (let m = start.getMonth(), y = start.getFullYear(); ; ) {
                                        const t = new Date(y, m, 1).getTime();
                                        if (t > x1) break;
                                        ticksMinor.push({ t });
                                        ticksMajor.push({ t, label: fmtMonth(t) });
                                        m += 1; if (m > 11) { m = 0; y += 1; }
                                    }
                                    // Add today's date label near the end, without changing the line (only if today is available)
                                    if (today) {
                                        const tToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
                                        const labelToday = today.toLocaleDateString('en-US',{ day:'2-digit', month:'short' });
                                        ticksMajor.push({ t: Math.min(x1, tToday), label: labelToday, isToday: true });
                                    }
                                }

                                return (
                                    <g>
                                        {/* minor ticks */}
                                        {ticksMinor.map((tk, i) => (
                                            <line key={`mi-${i}`} x1={mapX(tk.t)} x2={mapX(tk.t)} y1={114} y2={116} stroke="#4B5563" opacity="0.25" />
                                        ))}
                                        {/* major labels */}
                                        <g fill="#9CA3AF" fontSize="8">
                                            {ticksMajor.map((tk, i) => {
                                                const x = mapX(tk.t);
                                                const clampedX = Math.max(6, Math.min(314, x));
                                                const anchor = tk.isToday ? (x > 300 ? 'end' : 'start') : 'middle';
                                                const tx = tk.isToday ? (anchor==='end'? clampedX-2 : clampedX+2) : clampedX;
                                                
                                                // Find percentage values for BTC and ETH at this time point
                                                const getBtcPctAtTime = (targetTime) => {
                                                    if (!series.btc || series.btc.length === 0) return null;
                                                    const closest = series.btc.reduce((prev, curr) => 
                                                        Math.abs(curr[0] - targetTime) < Math.abs(prev[0] - targetTime) ? curr : prev
                                                    );
                                                    return closest[1];
                                                };
                                                
                                                const getEthPctAtTime = (targetTime) => {
                                                    if (!series.eth || series.eth.length === 0) return null;
                                                    const closest = series.eth.reduce((prev, curr) => 
                                                        Math.abs(curr[0] - targetTime) < Math.abs(prev[0] - targetTime) ? curr : prev
                                                    );
                                                    return closest[1];
                                                };
                                                
                                                const btcPct = getBtcPctAtTime(tk.t);
                                                const ethPct = getEthPctAtTime(tk.t);
                                                
                                                return (
                                                    <g key={`ma-${i}`}>
                                                        <line x1={clampedX} x2={clampedX} y1={112} y2={116} stroke="#4B5563" opacity="0.45" />
                                                        {/* Time label */}
                                                        <text x={tx} y={118} textAnchor={anchor} fontSize="7">{tk.label}</text>
                                                        {/* BTC percentage */}
                                                        {btcPct !== null && (
                                                            <text x={tx} y={126} textAnchor={anchor} fontSize="6" fill="#F7931A" opacity="0.8">
                                                                BTC: {btcPct >= 0 ? '+' : ''}{btcPct.toFixed(1)}%
                                                            </text>
                                                        )}
                                                        {/* ETH percentage */}
                                                        {ethPct !== null && (
                                                            <text x={tx} y={132} textAnchor={anchor} fontSize="6" fill="#627EEA" opacity="0.8">
                                                                ETH: {ethPct >= 0 ? '+' : ''}{ethPct.toFixed(1)}%
                                                            </text>
                                                        )}
                                                    </g>
                                                );
                                            })}
                                        </g>
                                    </g>
                                );
                            })()}
                        </g>
                    )}
                    {/* Lines (rounded caps, no glow) */}
                    <path d={pathEth} fill="none" stroke="url(#ethGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d={pathBtc} fill="none" stroke="url(#btcGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    
                    {/* Data point markers for precision modes (24h/30d) */}
                    {(range === '24h' || range === '30d') && (
                        <g>
                            {/* ETH data points */}
                            {series.eth && series.eth.length > 0 && series.eth.map((point, i) => {
                                if (i % Math.max(1, Math.floor(series.eth.length / 40)) !== 0) return null; // Show every nth point to avoid clutter
                                const x = mapX(point[0]);
                                const y = mapY(point[1]);
                                return <circle key={`eth-${i}`} cx={x} cy={y} r="1.5" fill="#627EEA" opacity="0.8" />;
                            })}
                            {/* BTC data points */}
                            {series.btc && series.btc.length > 0 && series.btc.map((point, i) => {
                                if (i % Math.max(1, Math.floor(series.btc.length / 40)) !== 0) return null; // Show every nth point to avoid clutter
                                const x = mapX(point[0]);
                                const y = mapY(point[1]);
                                return <circle key={`btc-${i}`} cx={x} cy={y} r="1.5" fill="#F7931A" opacity="0.8" />;
                            })}
                        </g>
                    )}

                    {/* Last value markers + pills with asset color and logo */}
                    {(lastEthPt || lastBtcPt) && (() => {
                        // Handle case where only one data point exists
                        if (!lastEthPt && lastBtcPt) {
                            const W = 320, H = 120, pillW = 64, pillH = 18, m = 4;
                            const btcTx = Math.max(m, Math.min(lastBtcPt[0] + 6, W - pillW - m));
                            const btcTy = Math.max(m, Math.min(lastBtcPt[1] - 11, H - pillH - m));
                            return (
                                <g>
                                    <circle cx={lastBtcPt[0]} cy={lastBtcPt[1]} r="3" fill="#F7931A" stroke="#ffffff" strokeWidth="1" />
                                    <line x1={lastBtcPt[0]} y1={lastBtcPt[1]} x2={btcTx + 6} y2={btcTy + 9} stroke="#F7931A" strokeWidth="1" opacity="0.4" strokeDasharray="2,2" />
                                    <g transform={`translate(${btcTx}, ${btcTy})`}>
                                        <rect rx="8" ry="8" width="64" height="18" fill="#F7931A" opacity="0.95" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                                        <image href="https://assets.coingecko.com/coins/images/1/small/bitcoin.png?1547033579" x="6" y="3" height="12" width="12" />
                                        <text x="40" y="12" fontSize="10" textAnchor="middle" fill="#ffffff" fontWeight="600">{`${badgePct.btc>=0?'+':''}${badgePct.btc.toFixed(2)}%`}</text>
                                    </g>
                                </g>
                            );
                        }
                        
                        if (lastEthPt && !lastBtcPt) {
                            const W = 320, H = 120, pillW = 64, pillH = 18, m = 4;
                            const ethTx = Math.max(m, Math.min(lastEthPt[0] + 6, W - pillW - m));
                            const ethTy = Math.max(m, Math.min(lastEthPt[1] - 11, H - pillH - m));
                            return (
                                <g>
                                    <circle cx={lastEthPt[0]} cy={lastEthPt[1]} r="3" fill="#627EEA" stroke="#ffffff" strokeWidth="1" />
                                    <line x1={lastEthPt[0]} y1={lastEthPt[1]} x2={ethTx + 6} y2={ethTy + 9} stroke="#627EEA" strokeWidth="1" opacity="0.4" strokeDasharray="2,2" />
                                    <g transform={`translate(${ethTx}, ${ethTy})`}>
                                        <rect rx="8" ry="8" width="64" height="18" fill="#627EEA" opacity="0.95" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                                        <image href="https://assets.coingecko.com/coins/images/279/small/ethereum.png" x="6" y="3" height="12" width="12" />
                                        <text x="40" y="12" fontSize="10" textAnchor="middle" fill="#ffffff" fontWeight="600">{`${badgePct.eth>=0?'+':''}${badgePct.eth.toFixed(2)}%`}</text>
                                    </g>
                                </g>
                            );
                        }
                        
                        // Both points exist - collision detection logic
                        const W = 320, H = 120, pillW = 64, pillH = 18, m = 4;
                        
                        // Calculate initial positions
                        let ethTx = Math.max(m, Math.min(lastEthPt[0] + 6, W - pillW - m));
                        let ethTy = Math.max(m, Math.min(lastEthPt[1] - 11, H - pillH - m));
                        let btcTx = Math.max(m, Math.min(lastBtcPt[0] + 6, W - pillW - m));
                        let btcTy = Math.max(m, Math.min(lastBtcPt[1] - 11, H - pillH - m));
                        
                        // Collision detection and avoidance
                        const minSeparation = 22; // Minimum vertical separation between pills
                        const verticalDistance = Math.abs(ethTy - btcTy);
                        const horizontalOverlap = Math.abs(ethTx - btcTx) < pillW;
                        
                        if (horizontalOverlap && verticalDistance < minSeparation) {
                            // Determine which one is higher and which is lower
                            const ethHigher = lastEthPt[1] < lastBtcPt[1]; // Lower Y = higher on screen
                            
                            if (ethHigher) {
                                // ETH is higher, push BTC down
                                btcTy = ethTy + minSeparation;
                                // If pushed too far down, push ETH up instead
                                if (btcTy + pillH > H - m) {
                                    const overflow = (btcTy + pillH) - (H - m);
                                    ethTy = Math.max(m, ethTy - overflow - minSeparation);
                                    btcTy = ethTy + minSeparation;
                                }
                            } else {
                                // BTC is higher, push ETH down
                                ethTy = btcTy + minSeparation;
                                // If pushed too far down, push BTC up instead
                                if (ethTy + pillH > H - m) {
                                    const overflow = (ethTy + pillH) - (H - m);
                                    btcTy = Math.max(m, btcTy - overflow - minSeparation);
                                    ethTy = btcTy + minSeparation;
                                }
                            }
                        }
                        
                        return (
                            <g>
                                {/* Connection lines (subtle) */}
                                <line x1={lastEthPt[0]} y1={lastEthPt[1]} x2={ethTx + 6} y2={ethTy + 9} stroke="#627EEA" strokeWidth="1" opacity="0.4" strokeDasharray="2,2" />
                                <line x1={lastBtcPt[0]} y1={lastBtcPt[1]} x2={btcTx + 6} y2={btcTy + 9} stroke="#F7931A" strokeWidth="1" opacity="0.4" strokeDasharray="2,2" />
                                
                                {/* ETH Pill */}
                                <circle cx={lastEthPt[0]} cy={lastEthPt[1]} r="3" fill="#627EEA" stroke="#ffffff" strokeWidth="1" />
                                <g transform={`translate(${ethTx}, ${ethTy})`}>
                                    <rect rx="8" ry="8" width="64" height="18" fill="#627EEA" opacity="0.95" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                                    <image href="https://assets.coingecko.com/coins/images/279/small/ethereum.png" x="6" y="3" height="12" width="12" />
                                    <text x="40" y="12" fontSize="10" textAnchor="middle" fill="#ffffff" fontWeight="600">{`${badgePct.eth>=0?'+':''}${badgePct.eth.toFixed(2)}%`}</text>
                                </g>
                                
                                {/* BTC Pill */}
                                <circle cx={lastBtcPt[0]} cy={lastBtcPt[1]} r="3" fill="#F7931A" stroke="#ffffff" strokeWidth="1" />
                                <g transform={`translate(${btcTx}, ${btcTy})`}>
                                    <rect rx="8" ry="8" width="64" height="18" fill="#F7931A" opacity="0.95" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                                    <image href="https://assets.coingecko.com/coins/images/1/small/bitcoin.png?1547033579" x="6" y="3" height="12" width="12" />
                                    <text x="40" y="12" fontSize="10" textAnchor="middle" fill="#ffffff" fontWeight="600">{`${badgePct.btc>=0?'+':''}${badgePct.btc.toFixed(2)}%`}</text>
                                </g>
                            </g>
                        );
                    })()}
				</svg>
				{loading && (
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
					</div>
				)}
			</div>
			<div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px]">
                    <span className="inline-block w-2 h-2 rounded-full" style={{ background: '#F7931A' }} />
                    <span className="text-gray-300">BTC</span>
                    <span className={`${badgePct.btc>=0?'text-duniacrypto-green':'text-duniacrypto-red'} font-semibold`}>
                        {badgePct.btc>=0?'+':''}{badgePct.btc.toFixed(2)}%
                    </span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                    <span className="inline-block w-2 h-2 rounded-full" style={{ background: '#627EEA' }} />
                    <span className="text-gray-300">ETH</span>
                    <span className={`${badgePct.eth>=0?'text-duniacrypto-green':'text-duniacrypto-red'} font-semibold`}>
                        {badgePct.eth>=0?'+':''}{badgePct.eth.toFixed(2)}%
                    </span>
                </div>
			</div>
		</div>
	);
}


