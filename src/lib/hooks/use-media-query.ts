"use client";

import { useEffect, useState } from "react";

/**
 * useMediaQuery — escucha cambios de media query. SSR-safe (devuelve `false`
 * en el primer render del cliente para evitar hydration mismatch).
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

/** Helper: ¿estamos en viewport mobile? (<= 767px). */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 767px)");
}
