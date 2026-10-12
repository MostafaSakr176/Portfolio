import mostafa from "@/assets/mostafasakr.png";
import SectionHeading from "@/components/fx/SectionHeading";
import Reveal from "@/components/fx/Reveal";
import TiltCard from "@/components/fx/TiltCard";
import CountUp from "@/components/fx/CountUp";
import { about, profile } from "@/data/profile";
import { getIcon } from "@/lib/icons";

const { paragraphs, chips, stats } = about;

const About = () => (
  <section id="about" className="section-padding">
    <div className="max-w-6xl mx-auto">
      <SectionHeading eyebrow="01. About Me" title="Get to know me" />

      <div className="grid md:grid-cols-3 gap-12 items-center">
        {/* Portrait */}
        <Reveal x={-40} y={0}>
          <TiltCard max={6} className="group mx-auto max-w-sm md:max-w-none">
            <div className="relative rounded-2xl p-[2px] overflow-hidden">
              {/* Rotating gradient border */}
              <div
                aria-hidden="true"
                className="absolute -inset-[100%] animate-spin-slow motion-reduce:animate-none opacity-70 group-hover:opacity-100 transition-opacity"
                style={{
                  background:
                    "conic-gradient(from 0deg, hsl(var(--primary)), transparent 30%, hsl(200 80% 55%), transparent 70%, hsl(var(--primary)))",
                }}
              />
              <img
                src={mostafa}
                alt={`Portrait of ${profile.name}`}
                loading="lazy"
                className="relative w-full h-full object-cover rounded-[calc(1rem-2px)] bg-background"
              />
            </div>
          </TiltCard>
        </Reveal>

        {/* Content */}
        <div className="space-y-6 text-xl md:col-span-2">
          {paragraphs.map((text, i) => (
            <Reveal key={i} delay={0.1 * (i + 1)}>
              <p className="text-muted-foreground leading-relaxed">{text}</p>
            </Reveal>
          ))}

          <Reveal delay={0.1 * (paragraphs.length + 1)}>
            <div className="flex flex-wrap gap-3 pt-2">
              {chips.map(({ icon, label }) => {
                const Icon = getIcon(icon);
                return (
                  <div
                    key={label}
                    className="flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm text-muted-foreground"
                  >
                    <Icon size={15} className="text-primary" />
                    {label}
                  </div>
                );
              })}
            </div>
          </Reveal>

          <dl className="grid grid-cols-3 gap-4 pt-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={0.35 + i * 0.1} y={20}>
                <div className="glass-card p-4 md:p-5 text-center !rounded-2xl hover:border-primary/30 transition-colors">
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <CountUp
                      to={s.value}
                      suffix={s.suffix}
                      delay={0.35 + i * 0.1}
                      className="block text-3xl md:text-4xl font-bold text-gradient"
                    />
                    <span className="mt-1 block text-xs md:text-sm text-muted-foreground" aria-hidden="true">
                      {s.label}
                    </span>
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </div>
  </section>
);

export default About;
