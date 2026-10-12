import { useState, useEffect, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowDown, ArrowRight, Command, Github, Linkedin, Mail } from "lucide-react";
import NeuralBackground from "@/components/fx/NeuralBackground";
import TextReveal from "@/components/fx/TextReveal";
import Magnetic from "@/components/fx/Magnetic";
import { profile, heroRoles as roles } from "@/data/profile";

const isMac = () =>
  typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

interface HeroProps {
  onOpenPalette: () => void;
}

const Hero = ({ onOpenPalette }: HeroProps) => {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter (skipped entirely when reduced motion is requested)
  useEffect(() => {
    if (reduce) return;

    const currentRole = roles[roleIndex];

    if (!isDeleting && text === currentRole) {
      const hold = setTimeout(() => setIsDeleting(true), 1800);
      return () => clearTimeout(hold);
    }

    if (isDeleting && text === "") {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
      return;
    }

    const timeout = setTimeout(
      () =>
        setText(
          isDeleting
            ? currentRole.substring(0, text.length - 1)
            : currentRole.substring(0, text.length + 1)
        ),
      isDeleting ? 35 : 75
    );
    return () => clearTimeout(timeout);
  }, [text, isDeleting, roleIndex, reduce]);

  // Parallax: content drifts and fades as the hero scrolls away; orbs counter-move
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const orbA = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);
  const orbB = useTransform(scrollYProgress, [0, 1], ["0%", "45%"]);

  const shownRole = reduce ? roles[0] : text;
  const modKey = isMac() ? "⌘" : "Ctrl";

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <NeuralBackground />
        <motion.div
          style={{ y: reduce ? 0 : orbA }}
          className="absolute top-1/4 left-1/4 w-96 h-96"
        >
          <motion.div
            animate={reduce ? undefined : { x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full rounded-full opacity-30 blur-2xl"
            style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.45), transparent 70%)" }}
          />
        </motion.div>
        <motion.div
          style={{ y: reduce ? 0 : orbB }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80"
        >
          <motion.div
            animate={reduce ? undefined : { x: [0, -20, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full rounded-full opacity-25 blur-2xl"
            style={{ background: "radial-gradient(circle, hsl(200 80% 55% / 0.45), transparent 70%)" }}
          />
        </motion.div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      <motion.div
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative z-10 text-center px-6 max-w-4xl"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-primary font-mono text-sm md:text-base mb-4"
        >
          Hello, I'm
        </motion.p>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
          <TextReveal text="Mostafa" trigger="mount" delay={0.35} className="text-foreground" />{" "}
          <TextReveal
            text="Sakr"
            trigger="mount"
            delay={0.5}
            wordClassName="text-gradient"
          />
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-xl md:text-2xl text-muted-foreground mb-10 h-8"
          aria-label={`${profile.role}`}
        >
          <span className="font-mono" aria-hidden="true">
            {shownRole}
          </span>
          {!reduce && (
            <span className="animate-pulse text-primary" aria-hidden="true">
              |
            </span>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10"
        >
          <Magnetic>
            <a
              href="#projects"
              className="group inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-medium text-primary-foreground transition-shadow duration-300 hover:shadow-[var(--glow-primary)]"
              style={{ background: "var(--gradient-primary)" }}
            >
              View Projects
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-medium border border-primary text-primary hover:bg-primary/10 transition-colors duration-300"
            >
              Contact Me
            </a>
          </Magnetic>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="flex justify-center gap-6">
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-muted-foreground hover:text-primary hover:-translate-y-0.5 transition-all duration-200"
            >
              <Linkedin size={22} />
            </a>
            {profile.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-muted-foreground hover:text-primary hover:-translate-y-0.5 transition-all duration-200"
              >
                <Github size={22} />
              </a>
            )}
            <a
              href={`mailto:${profile.email}`}
              aria-label="Email"
              className="text-muted-foreground hover:text-primary hover:-translate-y-0.5 transition-all duration-200"
            >
              <Mail size={22} />
            </a>
          </div>

          <button
            type="button"
            onClick={onOpenPalette}
            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-4 py-1.5 text-xs font-mono text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
          >
            <Command size={13} />
            Press <kbd className="rounded bg-secondary px-1.5 py-0.5">{modKey}</kbd>
            <kbd className="rounded bg-secondary px-1.5 py-0.5">K</kbd> to explore
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        aria-label="Scroll to About section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={reduce ? undefined : { y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowDown className="text-muted-foreground" size={20} />
        </motion.div>
      </motion.a>
    </section>
  );
};

export default Hero;
