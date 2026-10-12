import { motion, useScroll, useSpring } from "framer-motion";

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  // Spring smoothing removes jitter from wheel/trackpad scrolling
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX, transformOrigin: "0%" }}
      className="fixed top-0 left-0 right-0 h-0.5 z-[60]"
    >
      <div className="h-full w-full" style={{ background: "var(--gradient-primary)" }} />
    </motion.div>
  );
};

export default ScrollProgress;
