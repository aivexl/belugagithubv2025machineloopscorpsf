"use client";

 import React, { useEffect, useMemo, useState } from "react";
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
		switch (range) {
			case "24h":
				// Use 5-minute data for maximum precision in 24h view
				return { days: 1, interval: "" }; // Empty interval = 5-minute data
			case "30d":
				// Use hourly data for 30d for better precision than daily
				return { days: 30, interval: "hourly" };
			case "1y":
				return { days: 365, interval: "daily" };
			case "7d":
		default:
				return { days: 7, interval: "hourly" };
		}
	}, [range]);

	useEffect(() => {
		let cancelled = false;
		async function fetchData() {
			setLoading(true);
			setError(null);
			try {
				const [btcRes, ethRes] = await Promise.all([
					fetch(`/api/coingecko/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}&interval=${interval}`),
					fetch(`/api/coingecko/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=${days}&interval=${interval}`),
				]);
				if (!btcRes.ok || !ethRes.ok) throw new Error("Failed to fetch market chart");
				const btcData = await btcRes.json();
				const ethData = await ethRes.json();

				const normalizeToPct = (prices) => {
					if (!prices || prices.length === 0) return [];
					const base = prices[0][1] || 0;
					if (!base) return prices.map((p) => [p[0], 0]);
					return prices.map((p) => [p[0], ((p[1] / base) - 1) * 100]);
				};

                let btcPct = normalizeToPct(btcData.prices);
                let ethPct = normalizeToPct(ethData.prices);
                
                // Precision-focused smoothing: minimal for 24h/30d, moderate for longer ranges
                const smooth = (arr, window) => {
                    if (!arr || !window || window <= 1) return arr || [];
                    if (arr.length <= window) return arr;
                    const half = Math.floor(window / 2);
                    return arr.map((_, i) => {
                        let sum = 0, cnt = 0, t = 0;
                        for (let j = i - half; j <= i + half; j++) {
                            const k = Math.min(arr.length - 1, Math.max(0, j));
                            sum += arr[k][1];
                            t += arr[k][0];
                            cnt++;
                        }
                        return [Math.round(t / cnt), sum / cnt];
                    });
                };
                
                // Ultra-minimal smoothing for precision ranges
                const windowByRange = range === '24h' ? 1 : range === '30d' ? 1 : range === '7d' ? 5 : 9;
                btcPct = smooth(btcPct, windowByRange);
                ethPct = smooth(ethPct, windowByRange);

                if (!cancelled) setSeries({ btc: btcPct, eth: ethPct });
			} catch (e) {
				if (!cancelled) {
					setError("Unable to load BTC/ETH chart");
					// Fallback demo data (flat lines) - use static timestamps to avoid hydration mismatch
					const baseTime = 1700000000000; // Fixed timestamp
					const mk = Array.from({ length: 24 }, (_, i) => [baseTime + i * 3600_000, i - 12]);
					setSeries({ btc: mk, eth: mk.map(([t, v]) => [t, v * 0.6]) });
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		}

		fetchData();
		return () => {
			cancelled = true;
		};
	}, [days, interval]);

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
			const isPrecisionMode = range === '24h' || range === '30d';
			
			if (isPrecisionMode) {
				// Ultra-precision mode: preserve every data point with minimal interpolation
				let d = `M ${mpts[0][0]} ${mpts[0][1]}`;
				
				// For very short segments or high precision, use direct lines
				if (mpts.length > 100 || range === '24h') {
					// Direct linear connections for maximum precision
					for (let i = 1; i < mpts.length; i++) {
						d += ` L ${mpts[i][0]} ${mpts[i][1]}`;
					}
				} else {
					// Minimal curve smoothing that preserves data integrity
					for (let i = 0; i < mpts.length - 1; i++) {
						const p1 = mpts[i];
						const p2 = mpts[i + 1];
						const p3 = mpts[i + 2] || p2;
						
						// Calculate control point for gentle curve
						const tension = 0.05; // Ultra-minimal tension for precision
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
							className={`px-2 py-0.5 rounded text-[11px] border ${range===r? 'bg-blue-600 text-white border-blue-500':'bg-transparent text-gray-300 border-gray-700 hover:border-gray-600'}`}
						>
							{r.toUpperCase()}
						</button>
					))}
                    <span className="hidden sm:inline text-[11px] text-gray-400">{today?.toLocaleDateString('en-US',{ day:'2-digit', month:'short', year:'numeric' }) || ''}</span>
				</div>
			</div>
			<div className="relative">
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


