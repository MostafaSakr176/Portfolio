import { useEffect, useState } from "react";

/**
 * Tracks which section is currently crossing the middle band of the viewport.
 */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      // Thin band around the vertical center of the viewport
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));

    const onScroll = () => {
      if (window.scrollY < 200) setActive("");
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join("|")]);

  return active;
}
