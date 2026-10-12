import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, Mail, MapPin, Phone, Check, Copy } from "lucide-react";
import { toast } from "sonner";
import SectionHeading from "@/components/fx/SectionHeading";
import Reveal from "@/components/fx/Reveal";
import Magnetic from "@/components/fx/Magnetic";
import { profile } from "@/data/profile";

const fieldClass =
  "w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all";

const info = [
  { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}`, copy: true },
  { icon: Phone, label: "Phone", value: profile.phone, href: `tel:${profile.phone}`, copy: true },
  { icon: MapPin, label: "Location", value: profile.location },
] as const;

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // No backend: hand the message off to the visitor's mail client
    const subject = encodeURIComponent(`Portfolio message from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: "", email: "", message: "" });
    }, 3000);
  };

  const copy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied to clipboard`);
    } catch {
      toast.error(`Couldn't copy ${label.toLowerCase()}`);
    }
  };

  return (
    <section id="contact" className="section-padding">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          align="center"
          eyebrow="05. Contact"
          title="Get in touch"
          description="I'm always open to new opportunities and interesting projects. Let's build something great together."
        />

        <div className="grid md:grid-cols-2 gap-12">
          {/* Info */}
          <div className="space-y-4">
            {info.map((item, i) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.label} x={-30} y={0} delay={i * 0.1}>
                  <div className="group flex items-center gap-4 rounded-2xl border border-transparent p-3 -m-3 hover:border-border hover:bg-secondary/40 transition-colors">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                      <Icon size={18} className="text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      {"href" in item ? (
                        <a
                          href={item.href}
                          className="block truncate text-foreground hover:text-primary transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-foreground">{item.value}</p>
                      )}
                    </div>
                    {"copy" in item && (
                      <button
                        type="button"
                        onClick={() => copy(item.value, item.label)}
                        aria-label={`Copy ${item.label.toLowerCase()}`}
                        className="rounded-lg p-2 text-muted-foreground opacity-0 group-hover:opacity-100 focus-visible:opacity-100 hover:text-primary hover:bg-primary/10 transition-all"
                      >
                        <Copy size={16} />
                      </button>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Form */}
          <Reveal x={30} y={0} delay={0.15}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                aria-label="Name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={fieldClass}
              />
              <input
                type="email"
                placeholder="Email"
                aria-label="Email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={fieldClass}
              />
              <textarea
                placeholder="Message"
                aria-label="Message"
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className={`${fieldClass} resize-none`}
              />
              <Magnetic strength={0.2}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-medium text-primary-foreground transition-shadow duration-300 hover:shadow-[var(--glow-primary)]"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={submitted ? "sent" : "send"}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18 }}
                      className="inline-flex items-center gap-2"
                    >
                      {submitted ? (
                        <>
                          <Check size={18} /> Opening your email app…
                        </>
                      ) : (
                        <>
                          <Send size={18} /> Send Message
                        </>
                      )}
                    </motion.span>
                  </AnimatePresence>
                </button>
              </Magnetic>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Contact;
