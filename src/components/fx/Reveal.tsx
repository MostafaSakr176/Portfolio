import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Pixel offset the element travels from */
  x?: number;
  y?: number;
  blur?: boolean;
}

/**
 * Scroll-triggered fade/slide (with optional blur-in). Runs once.
 */
const Reveal = ({ children, className, delay = 0, x = 0, y = 28, blur = true }: RevealProps) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, x, y, filter: blur ? "blur(8px)" : "blur(0px)" }}
    whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

export default Reveal;
