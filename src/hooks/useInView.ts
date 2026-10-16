import { useEffect, useRef } from "react";

// Calls onEnter when the returned ref's element scrolls near the viewport.
// Re-arms whenever `enabled` flips back to true, so short lists keep loading.
export function useInView(onEnter: () => void, enabled: boolean) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onEnter();
      },
      { rootMargin: "300px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onEnter, enabled]);

  return ref;
}