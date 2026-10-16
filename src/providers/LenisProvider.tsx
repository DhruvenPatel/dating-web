// import { useEffect, type ReactNode } from "react";
// import Lenis from "lenis";
// import "lenis/dist/lenis.css";

// export function LenisProvider({ children }: { children: ReactNode }) {
//   useEffect(() => {
//     const lenis = new Lenis({
//       duration: 1.1,
//       smoothWheel: true,
//       easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
//     });

//     let frame = requestAnimationFrame(function loop(time) {
//       lenis.raf(time);
//       frame = requestAnimationFrame(loop);
//     });

//     return () => {
//       cancelAnimationFrame(frame);
//       lenis.destroy();
//     };
//   }, []);

//   return <>{children}</>;
// }

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { lenisRef } from "@/lib/lenis";

export function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Respect the OS "reduce motion" setting: use normal browser scrolling.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenisRef.current = lenis;

    let frame = requestAnimationFrame(function loop(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(loop);
    });

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}