"use client";

import { useEffect } from "react";

/**
  * Disables console output in production to hide logs and API details from end users.
  * This silences log/info/debug/warn/error in production. Enable logs by setting
  * NEXT_PUBLIC_ENABLE_CONSOLE="true".
 */
export default function ConsoleSilencer() {
  useEffect(() => {
    try {
      const isProduction = process.env.NODE_ENV === "production";
      const allowConsole = process.env.NEXT_PUBLIC_ENABLE_CONSOLE === "true";
      if (!isProduction || allowConsole) return;

      if (typeof window === "undefined" || typeof window.console === "undefined") return;

      const noop = () => {};
      // Silence all console outputs in production (including errors)
      // eslint-disable-next-line no-console
      console.log = noop;
      // eslint-disable-next-line no-console
      console.info = noop;
      // eslint-disable-next-line no-console
      console.debug = noop;
      // eslint-disable-next-line no-console
      console.warn = noop;
      // eslint-disable-next-line no-console
      console.error = noop;

      // Prevent default browser logging for global errors and unhandled rejections
      const onWindowError = (e: ErrorEvent) => {
        try { e.preventDefault?.(); } catch {}
        return false;
      };
      const onUnhandledRejection = (e: PromiseRejectionEvent) => {
        try { e.preventDefault?.(); } catch {}
        return false;
      };
      window.addEventListener('error', onWindowError, { capture: true });
      window.addEventListener('unhandledrejection', onUnhandledRejection, { capture: true } as any);

      return () => {
        try {
          window.removeEventListener('error', onWindowError, { capture: true } as any);
          window.removeEventListener('unhandledrejection', onUnhandledRejection, { capture: true } as any);
        } catch {}
      };
    } catch {
      // fail-safe: never throw during hydration
    }
  }, []);

  return null;
}


