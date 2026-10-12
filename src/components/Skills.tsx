import { motion } from "framer-motion";
import SectionHeading from "@/components/fx/SectionHeading";
import Reveal from "@/components/fx/Reveal";
import TiltCard from "@/components/fx/TiltCard";
import { skillCategories } from "@/data/profile";
import { getIcon } from "@/lib/icons";

const Skills = () => (
  <section id="skills" className="section-padding">
    <div className="max-w-6xl mx-auto">
      <SectionHeading eyebrow="02. Skills" title="Technologies I work with" />

      <div className="grid md:grid-cols-3 gap-8">
        {skillCategories.map((category, ci) => {
          const Icon = getIcon(category.icon);
          return (
            <Reveal key={category.title} delay={ci * 0.12}>
              <TiltCard className="glass-card p-6 h-full hover:border-primary/30 transition-colors duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="text-primary" size={20} />
                  </span>
                  <h3 className="text-lg font-semibold">{category.title}</h3>
                </div>

                <ul className="flex flex-wrap gap-2">
                  {category.skills.map((skill, si) => (
                    <motion.li
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8, y: 8 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{
                        type: "spring",
                        stiffness: 320,
                        damping: 22,
                        delay: ci * 0.12 + si * 0.05 + 0.15,
                      }}
                      whileHover={{ y: -3 }}
                      className="cursor-default rounded-full border border-border bg-secondary/60 px-3 py-1.5 font-mono text-xs md:text-sm text-foreground/90 transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                    >
                      {skill}
                    </motion.li>
                  ))}
                </ul>
              </TiltCard>
            </Reveal>
          );
        })}
      </div>
    </div>
  </section>
);

export default Skills;
