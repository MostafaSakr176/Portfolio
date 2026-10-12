import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useFinePointer } from "@/hooks/use-fine-pointer";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees */
  max?: number;
  onClick?: () => void;
  role?: string;
  tabIndex?: number;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

/**
 * Card with a 3D tilt and a cursor-following glare. Falls back to a plain
 * card on touch devices or when reduced motion is requested.
 */
const TiltCard = ({
  children,
  className = "",
  max = 8,
  onClick,
  role,
  tabIndex,
  onKeyDown,
}: TiltCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const enabled = fine && !reduce;

  // Normalised pointer position in [-0.5, 0.5]
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 180, damping: 18, mass: 0.5 };
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [max, -max]), spring);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-max, max]), spring);

  const glareX = useTransform(px, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(py, [-0.5, 0.5], [0, 100]);
  const glare = useMotionTemplate`radial-gradient(360px circle at ${glareX}% ${glareY}%, hsl(var(--primary) / 0.14), transparent 60%)`;
  const glareOpacity = useMotionValue(0);

  const onMove = (e: React.PointerEvent) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const onEnter = () => enabled && glareOpacity.set(1);
  const onLeave = () => {
    px.set(0);
    py.set(0);
    glareOpacity.set(0);
  };

  return (
    <motion.div
      ref={ref}
      role={role}
      tabIndex={tabIndex}
      onKeyDown={onKeyDown}
      onClick={onClick}
      onPointerMove={onMove}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      style={
        enabled
          ? { rotateX, rotateY, transformPerspective: 900, transformStyle: "preserve-3d" }
          : undefined
      }
      className={`relative ${className}`}
    >
      {enabled && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
          style={{ background: glare, opacity: glareOpacity }}
        />
      )}
      {children}
    </motion.div>
  );
};

export default TiltCard;
