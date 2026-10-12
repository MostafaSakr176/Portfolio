import Reveal from "./Reveal";
import TextReveal from "./TextReveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

const SectionHeading = ({ eyebrow, title, description, align = "left" }: SectionHeadingProps) => (
  <div className={`mb-12 ${align === "center" ? "text-center" : ""}`}>
    <Reveal y={12} blur={false}>
      <p className="text-primary font-mono text-sm mb-2 inline-flex items-center gap-3">
        <span className="h-px w-8 bg-primary/60" aria-hidden="true" />
        {eyebrow}
      </p>
    </Reveal>
    <TextReveal
      as="h2"
      text={title}
      className="text-3xl md:text-5xl font-bold tracking-tight block"
    />
    {description && (
      <Reveal delay={0.2} className={align === "center" ? "mx-auto max-w-md" : "max-w-xl"}>
        <p className="text-muted-foreground mt-4">{description}</p>
      </Reveal>
    )}
  </div>
);

export default SectionHeading;
