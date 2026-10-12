import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useFinePointer } from "@/hooks/use-fine-pointer";

interface MagneticProps {
  children: ReactNode;
  /** 0–1: how far the element follows the cursor */
  strength?: number;
  className?: string;
}

/**
 * Wraps a child so it is subtly pulled toward the cursor while hovered.
 */
const Magnetic = ({ children, strength = 0.35, className = "" }: MagneticProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduce = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  const enabled = fine && !reduce;

  const onMove = (e: React.PointerEvent) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      style={enabled ? { x: sx, y: sy } : undefined}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  );
};

export default Magnetic;
