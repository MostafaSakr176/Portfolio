import { motion, type Variants } from "framer-motion";

interface TextRevealProps {
  text: string;
  className?: string;
  /** Applied to each word's inner element (use for gradient text) */
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  /** Animate on scroll into view (default) or immediately on mount */
  trigger?: "view" | "mount";
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

const container = (delay: number, stagger: number): Variants => ({
  hidden: {},
  visible: { transition: { delayChildren: delay, staggerChildren: stagger } },
});

const word: Variants = {
  hidden: { y: "110%", opacity: 0, rotate: 4 },
  visible: {
    y: "0%",
    opacity: 1,
    rotate: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * Masked, staggered word-by-word reveal. Screen readers get the full string
 * through aria-label while the animated spans are hidden from them.
 */
const TextReveal = ({
  text,
  className = "",
  wordClassName = "",
  delay = 0,
  stagger = 0.08,
  trigger = "view",
  as = "span",
}: TextRevealProps) => {
  const Tag = motion[as];
  const words = text.split(" ");

  const triggerProps =
    trigger === "mount"
      ? { initial: "hidden", animate: "visible" }
      : {
          initial: "hidden",
          whileInView: "visible",
          viewport: { once: true, margin: "-80px" },
        };

  return (
    <Tag
      aria-label={text}
      className={className}
      variants={container(delay, stagger)}
      {...triggerProps}
    >
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          aria-hidden="true"
          className="inline-block overflow-hidden align-bottom pb-[0.18em] -mb-[0.18em]"
        >
          <motion.span variants={word} className={`inline-block ${wordClassName}`}>
            {w}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
};

export default TextReveal;
