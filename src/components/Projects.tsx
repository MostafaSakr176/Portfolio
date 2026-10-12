import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ExternalLink, Github, X } from "lucide-react";
import SectionHeading from "@/components/fx/SectionHeading";
import Reveal from "@/components/fx/Reveal";
import TiltCard from "@/components/fx/TiltCard";
import { leadText, projects, type Project } from "@/data/profile";

const allTags = [...new Set(projects.flatMap((p) => p.tags))];

/** Cards show at most this many tags; the rest appear in the project details. */
const MAX_CARD_TAGS = 4;

const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

/**
 * Card header: a screenshot of the live site, or the emoji tile when a project
 * has no preview (or the image fails to load).
 */
const ProjectThumb = ({ project }: { project: Project }) => {
  const [failed, setFailed] = useState(false);

  if (!project.preview || failed) {
    return (
      <div className="flex items-start justify-between mb-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-3xl transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
          {project.image}
        </div>
        <ArrowUpRight
          size={20}
          className="text-muted-foreground opacity-0 -translate-x-2 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-primary"
        />
      </div>
    );
  }

  return (
    <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-xl border border-border bg-secondary">
      <img
        src={project.preview}
        alt={`Preview of the ${project.title} website`}
        width={1440}
        height={900}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
      />
      {project.live && (
        <span className="absolute left-2 top-2 rounded-full bg-background/75 px-2.5 py-0.5 font-mono text-[10px] text-foreground/90 backdrop-blur-sm">
          {hostOf(project.live)}
        </span>
      )}
      <span
        aria-hidden="true"
        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-background/75 text-muted-foreground opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 group-hover:text-primary"
      >
        <ArrowUpRight size={16} />
      </span>
    </div>
  );
};

/** Larger preview for the project popup, styled as a browser window that links to the live site. */
const BrowserFrame = ({ project }: { project: Project }) => {
  const [failed, setFailed] = useState(false);
  if (!project.preview || failed) return null;

  const content = (
    <>
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-border bg-background/60 px-3 py-2">
        <span className="flex gap-1.5" aria-hidden="true">
          <i className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <i className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
          <i className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
        </span>
        <span className="mx-auto max-w-full truncate rounded-md bg-secondary px-3 py-0.5 font-mono text-[11px] text-muted-foreground">
          {project.live ? hostOf(project.live) : project.title}
        </span>
        <span className="w-[42px]" aria-hidden="true" />
      </div>
      <img
        src={project.preview}
        alt={`Preview of the ${project.title} website`}
        width={1440}
        height={900}
        decoding="async"
        onError={() => setFailed(true)}
        className="aspect-[16/10] w-full object-cover object-top transition-transform duration-700 ease-out group-hover/frame:scale-[1.03]"
      />
    </>
  );

  const className =
    "group/frame mt-5 block overflow-hidden rounded-xl border border-border bg-secondary shadow-lg";

  return project.live ? (
    <a
      href={project.live}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${project.title} live site`}
      className={className}
    >
      {content}
    </a>
  ) : (
    <div className={className}>{content}</div>
  );
};

const Projects = () => {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<Project | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const filtered = filter === "All" ? projects : projects.filter((p) => p.tags.includes(filter));

  const open = (project: Project) => {
    lastFocused.current = document.activeElement as HTMLElement;
    setSelected(project);
  };
  const close = () => {
    setSelected(null);
    lastFocused.current?.focus?.();
  };

  // Modal: Escape to close, lock body scroll, move focus to the close button
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [selected]);

  return (
    <section id="projects" className="section-padding">
      <div className="max-w-6xl mx-auto">
        <SectionHeading eyebrow="03. Projects" title="Things I've built" />

        {/* Filters */}
        <Reveal y={12} blur={false}>
          <div className="flex flex-wrap gap-2 mb-10" role="group" aria-label="Filter projects by technology">
            {["All", ...allTags].map((tag) => {
              const isActive = filter === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setFilter(tag)}
                  aria-pressed={isActive}
                  className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="filter-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: "var(--gradient-primary)" }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{tag}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Grid */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.title}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                <TiltCard
                  role="button"
                  tabIndex={0}
                  onClick={() => open(project)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      open(project);
                    }
                  }}
                  className="glass-card p-6 h-full cursor-pointer group hover:border-primary/30 transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <ProjectThumb project={project} />
                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  {project.subtitle && (
                    <p className="text-xs font-mono text-muted-foreground/80 mt-0.5">{project.subtitle}</p>
                  )}
                  <p className="text-sm text-muted-foreground mt-2 mb-4 line-clamp-3">{leadText(project)}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.slice(0, MAX_CARD_TAGS).map((tag) => (
                      <span key={tag} className="text-xs font-mono px-2 py-1 rounded bg-secondary text-primary">
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > MAX_CARD_TAGS && (
                      <span
                        className="text-xs font-mono px-2 py-1 rounded bg-secondary text-muted-foreground"
                        title={project.tags.slice(MAX_CARD_TAGS).join(", ")}
                      >
                        +{project.tags.length - MAX_CARD_TAGS}
                      </span>
                    )}
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <p className="sr-only" aria-live="polite">
          Showing {filtered.length} {filtered.length === 1 ? "project" : "projects"}
        </p>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-background/80 backdrop-blur-md"
            onClick={close}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-title"
              initial={{ scale: 0.88, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              className="glass-card p-6 md:p-8 max-w-2xl w-full relative max-h-[88vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                ref={closeRef}
                onClick={close}
                aria-label="Close project details"
                className="absolute top-4 right-4 rounded-full p-1 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-4 pr-8">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
                  {selected.image}
                </div>
                <div>
                  <h3 id="project-title" className="text-2xl font-bold">
                    {selected.title}
                  </h3>
                  {selected.subtitle && (
                    <p className="text-sm font-mono text-muted-foreground/80 mt-0.5">{selected.subtitle}</p>
                  )}
                </div>
              </div>

              {/* key= resets the image-error state when switching projects */}
              <BrowserFrame key={selected.title} project={selected} />

              {selected.description && (
                <p className="text-muted-foreground mt-5">{selected.description}</p>
              )}
              {selected.highlights && selected.highlights.length > 0 && (
                <ul className="mt-4 space-y-3">
                  {selected.highlights.map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mb-6" />
              <div className="flex flex-wrap gap-2 mb-6">
                {selected.tags.map((tag) => (
                  <span key={tag} className="text-xs font-mono px-2 py-1 rounded bg-secondary text-primary">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-4">
                {selected.github && (
                  <a
                    href={selected.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-foreground hover:bg-accent transition-colors text-sm"
                  >
                    <Github size={16} /> Code
                  </a>
                )}
                {selected.live && (
                  <a
                    href={selected.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-primary-foreground text-sm hover:shadow-[var(--glow-primary)] transition-shadow"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    <ExternalLink size={16} /> Live Demo
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
