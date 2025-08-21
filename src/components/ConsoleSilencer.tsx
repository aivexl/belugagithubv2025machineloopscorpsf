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
      // Do not silence by default. Only silence if explicitly requested via env.
      const shouldSilence = process.env.NEXT_PUBLIC_SILENCE_CONSOLE === "true";
      if (!shouldSilence) return;

      if (typeof window === "undefined" || typeof window.console === "undefined") return;

      const noop = () => {};
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
    } catch {
      // fail-safe
    }
  }, []);

  return null;
}


