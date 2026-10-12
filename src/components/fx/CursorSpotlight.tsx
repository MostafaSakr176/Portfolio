import { useEffect } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useFinePointer } from "@/hooks/use-fine-pointer";

/**
 * A soft radial light that trails the cursor across the whole page.
 * Only mounted for mouse/trackpad users who haven't asked for reduced motion.
 */
const CursorSpotlight = () => {
  const fine = useFinePointer();
  const reduce = useReducedMotion();

  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const sx = useSpring(x, { stiffness: 120, damping: 24, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 120, damping: 24, mass: 0.6 });

  useEffect(() => {
    if (!fine || reduce) return;
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [fine, reduce, x, y]);

  const background = useMotionTemplate`radial-gradient(520px circle at ${sx}px ${sy}px, hsl(var(--primary) / 0.09), transparent 70%)`;

  if (!fine || reduce) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30"
      style={{ background }}
    />
  );
};

export default CursorSpotlight;
