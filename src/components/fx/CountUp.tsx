import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

interface CountUpProps {
  to: number;
  suffix?: string;
  delay?: number;
  duration?: number;
  className?: string;
}

/**
 * Counts from 0 to `to` when scrolled into view. Writes straight to the DOM
 * node so the animation never triggers React re-renders.
 */
const CountUp = ({ to, suffix = "", delay = 0, duration = 1.6, className }: CountUpProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (reduce) {
      node.textContent = `${to}${suffix}`;
      return;
    }
    if (!inView) return;

    const controls = animate(0, to, {
      duration,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        node.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduce, to, suffix, delay, duration]);

  return (
    <span ref={ref} className={className}>
      {`0${suffix}`}
    </span>
  );
};

export default CountUp;
