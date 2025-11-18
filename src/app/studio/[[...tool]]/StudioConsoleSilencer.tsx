"use client";

import { useEffect } from 'react';

export default function StudioConsoleSilencer() {
	useEffect(() => {
		const originalError = console.error;
		const originalWarn = console.warn;

		console.error = (...args: unknown[]) => {
			try {
				const message = args.map(String).join(' ');
				if (
					message.includes('Failed to fetch version for package') ||
					(message.includes('sanity') && message.includes('Failed to fetch'))
				) {
					return;
				}
			} catch {}
			originalError.apply(console, args as any);
		};

		console.warn = (...args: unknown[]) => {
			try {
				const message = args.map(String).join(' ');
				if (message.includes('Failed to fetch version for package')) {
					return;
				}
			} catch {}
			originalWarn.apply(console, args as any);
		};

		return () => {
			console.error = originalError;
			console.warn = originalWarn;
		};
	}, []);

	return null;
}



















