import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Command, Download, Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useActiveSection } from "@/hooks/use-active-section";
import { resume, sections } from "@/data/profile";

interface NavbarProps {
  onOpenPalette: () => void;
}

const sectionIds = sections.map((s) => s.id);

const Navbar = ({ onOpenPalette }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const active = useActiveSection(sectionIds);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on Escape
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const paletteButton = (
    <button
      type="button"
      onClick={onOpenPalette}
      aria-label="Open command palette"
      className="inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-border bg-secondary/50 text-xs font-mono text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
    >
      <Command size={14} />
      <span className="hidden lg:inline">
        Search <kbd className="ml-1 opacity-70">⌘K</kbd>
      </span>
    </button>
  );

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-card border-0 border-b border-border/50 rounded-none" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16">
        <a href="#" className="text-xl font-bold font-mono text-gradient" aria-label="Back to top">
          {"<Sakr />"}
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <ul className="flex items-center gap-1">
            {sections.map((link) => {
              const isActive = active === link.id;
              return (
                <li key={link.id} className="relative">
                  <a
                    href={`#${link.id}`}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative z-10 block px-3 py-1.5 text-sm rounded-full transition-colors duration-200 ${
                      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </a>
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-primary/10 border border-primary/20"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </li>
              );
            })}
          </ul>
          <a
            href={resume.url}
            download={resume.fileName}
            className="inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-primary/40 text-sm text-primary hover:bg-primary/10 transition-colors"
          >
            <Download size={14} />
            Resume
          </a>
          {paletteButton}
          <ThemeToggle />
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-3">
          <ThemeToggle />
          <button
            className="text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-card border-t border-border/50 rounded-none overflow-hidden"
          >
            <ul className="flex flex-col p-6 gap-4">
              {sections.map((link, i) => (
                <motion.li
                  key={link.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <a
                    href={`#${link.id}`}
                    onClick={() => setMobileOpen(false)}
                    className={`transition-colors ${
                      active === link.id ? "text-primary" : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * sections.length }}
              >
                <a
                  href={resume.url}
                  download={resume.fileName}
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center gap-2 text-primary"
                >
                  <Download size={16} />
                  Download Resume
                </a>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
