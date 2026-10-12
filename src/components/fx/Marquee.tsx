import { techStack } from "@/data/profile";

/**
 * Infinite, seamless tech-stack ticker. The list is rendered twice and the
 * track slides by exactly 50% so the loop has no visible jump.
 */
const Marquee = () => {
  const items = [...techStack, ...techStack];

  return (
    <section
      aria-label="Technologies I work with"
      className="relative border-y border-border/60 py-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
    >
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none">
        {items.map((tech, i) => (
          <span
            key={`${tech}-${i}`}
            aria-hidden={i >= techStack.length}
            className="mx-6 flex items-center gap-6 font-mono text-sm md:text-base text-muted-foreground whitespace-nowrap"
          >
            {tech}
            <span className="h-1.5 w-1.5 rounded-full bg-primary/60" aria-hidden="true" />
          </span>
        ))}
      </div>
    </section>
  );
};

export default Marquee;
