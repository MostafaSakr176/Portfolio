import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { Briefcase, ChevronDown, GraduationCap, MapPin } from "lucide-react";
import SectionHeading from "@/components/fx/SectionHeading";
import Reveal from "@/components/fx/Reveal";
import TiltCard from "@/components/fx/TiltCard";
import { education, experiences, type Experience as ExperienceItem } from "@/data/profile";

/**
 * One timeline card. The intro (paragraph, or first bullet when there is no
 * paragraph) is always visible; the remaining bullets expand on demand so the
 * timeline stays balanced even for bullet-heavy roles.
 */
const ExperienceCard = ({ exp, id }: { exp: ExperienceItem; id: string }) => {
  const [expanded, setExpanded] = useState(false);

  const bullets = exp.highlights ?? [];
  const lead = exp.description ?? bullets[0];
  const rest = exp.description ? bullets : bullets.slice(1);

  return (
    <TiltCard max={4} className="glass-card p-6 hover:border-primary/30 transition-colors duration-300">
      <span className="inline-flex items-center gap-2 text-xs font-mono text-primary">
        {exp.duration}
        {exp.current && (
          <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] uppercase tracking-wider">
            Current
          </span>
        )}
      </span>

      <h3 className="text-lg font-semibold mt-1">{exp.title}</h3>

      <p className="text-sm text-primary/80">
        {exp.company}
        {exp.sector && <span className="text-muted-foreground"> · {exp.sector}</span>}
      </p>
      {exp.location && (
        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground/80">
          <MapPin size={12} aria-hidden="true" />
          {exp.location}
        </p>
      )}

      {lead && <p className="mt-3 text-sm text-muted-foreground">{lead}</p>}

      {rest.length > 0 && (
        <>
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.ul
                id={id}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                {rest.map((item, i) => (
                  <li key={i} className="mt-3 flex gap-3 text-sm text-muted-foreground">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-controls={id}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full text-xs font-mono text-primary hover:text-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary transition-colors"
          >
            {expanded ? "Show less" : `Show ${rest.length} more`}
            <ChevronDown
              size={14}
              className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
            />
          </button>
        </>
      )}
    </TiltCard>
  );
};

const Experience = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // The glowing line fills as the timeline scrolls through the viewport
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 75%", "end 55%"],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  return (
    <section id="experience" className="section-padding">
      <div className="max-w-4xl mx-auto">
        <SectionHeading eyebrow="04. Experience" title="Where I've worked" />

        <div className="relative" ref={timelineRef}>
          {/* Track (positioned by CSS only, so it stays centered on x = 1rem / 50%) */}
          <div
            aria-hidden="true"
            className="absolute left-4 md:left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-border"
          />
          {/* Progress: the wrapper owns the position, the inner motion element owns the scale */}
          <div
            aria-hidden="true"
            className="absolute left-4 md:left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5"
          >
            <motion.div
              style={{
                scaleY: reduce ? 1 : fill,
                originY: 0,
                background: "linear-gradient(to bottom, hsl(var(--primary)), hsl(200 80% 55%))",
                boxShadow: "0 0 12px hsl(var(--primary) / 0.6)",
              }}
              className="h-full w-full"
            />
          </div>

          {experiences.map((exp, i) => {
            const leftSide = i % 2 === 0;
            return (
              <div
                key={`${exp.company}-${exp.duration}`}
                className={`relative flex items-start mb-12 ${leftSide ? "md:flex-row-reverse" : ""}`}
              >
                {/* Dot: the wrapper is centered on the line with CSS; only the inner element animates */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                    className="relative w-full h-full rounded-full bg-secondary border-2 border-primary flex items-center justify-center"
                  >
                    {exp.current && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full bg-primary/40 animate-ping motion-reduce:hidden"
                      />
                    )}
                    <Briefcase size={14} className="relative text-primary" />
                  </motion.div>
                </div>

                {/* Content */}
                <div
                  className={`ml-16 md:ml-0 md:w-[calc(50%-2rem)] ${
                    leftSide ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"
                  }`}
                >
                  <Reveal x={leftSide ? -40 : 40} y={0}>
                    <ExperienceCard exp={exp} id={`exp-${i}`} />
                  </Reveal>
                </div>
              </div>
            );
          })}
        </div>

        {/* Education */}
        <div className="mt-8">
          <Reveal y={12} blur={false}>
            <h3 className="mb-6 flex items-center gap-3 font-mono text-sm text-primary">
              <span className="h-px w-8 bg-primary/60" aria-hidden="true" />
              Education
            </h3>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-2">
            {education.map((edu, i) => (
              <Reveal key={`${edu.institution}-${edu.duration}`} delay={i * 0.12}>
                <TiltCard
                  max={4}
                  className="glass-card h-full p-6 hover:border-primary/30 transition-colors duration-300"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <GraduationCap size={20} className="text-primary" />
                    </span>
                    <div>
                      <span className="text-xs font-mono text-primary">{edu.duration}</span>
                      <h4 className="mt-1 text-lg font-semibold">{edu.institution}</h4>
                      <p className="text-sm text-muted-foreground">{edu.degree}</p>
                      {edu.location && (
                        <p className="mt-1 text-xs text-muted-foreground/80">{edu.location}</p>
                      )}
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
