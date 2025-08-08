"use client";

import { useEffect } from "react";

/**
 * Disables noisy console methods in production to hide logs from end users.
 * Leaves console.error enabled by default so real errors are still visible.
 *
 * You can override by setting NEXT_PUBLIC_ENABLE_CONSOLE="true" to keep logs.
 */
export default function ConsoleSilencer() {
  useEffect(() => {
    try {
      const isProduction = process.env.NODE_ENV === "production";
      const allowConsole = process.env.NEXT_PUBLIC_ENABLE_CONSOLE === "true";
      if (!isProduction || allowConsole) return;

      if (typeof window === "undefined" || typeof window.console === "undefined") return;

      const noop = () => {};
      // Preserve error output; silence others
      // eslint-disable-next-line no-console
      console.log = noop;
      // eslint-disable-next-line no-console
      console.info = noop;
      // eslint-disable-next-line no-console
      console.debug = noop;
      // eslint-disable-next-line no-console
      console.warn = noop;
    } catch {
      // fail-safe: never throw during hydration
    }
  }, []);

  return null;
}


