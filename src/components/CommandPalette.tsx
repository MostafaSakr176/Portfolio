import { useEffect, useCallback } from "react";
import { useTheme } from "next-themes";
import {
  ArrowUpRight,
  Briefcase,
  Code2,
  Copy,
  Download,
  FolderGit2,
  Github,
  Linkedin,
  Mail,
  Moon,
  Sun,
  User,
  Send,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { profile, projects, resume, sections } from "@/data/profile";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Icon per section id (section list itself comes from portfolio.json)
const sectionIcons: Record<string, LucideIcon> = {
  about: User,
  skills: Code2,
  projects: FolderGit2,
  experience: Briefcase,
  contact: Send,
};

/**
 * Global ⌘K / Ctrl+K palette: jump to sections, open projects, switch theme,
 * or copy contact details without touching the mouse.
 */
const CommandPalette = ({ open, onOpenChange }: CommandPaletteProps) => {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  // Run the action after the dialog's close animation has started so focus
  // restoration doesn't fight with smooth scrolling.
  const run = useCallback(
    (fn: () => void) => {
      onOpenChange(false);
      setTimeout(fn, 120);
    },
    [onOpenChange]
  );

  const goTo = (id: string) =>
    run(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }));

  const copy = (value: string, label: string) =>
    run(async () => {
      try {
        await navigator.clipboard.writeText(value);
        toast.success(`${label} copied to clipboard`);
      } catch {
        toast.error(`Couldn't copy ${label.toLowerCase()}`);
      }
    });

  const downloadResume = () =>
    run(() => {
      const link = document.createElement("a");
      link.href = resume.url;
      link.download = resume.fileName;
      link.click();
    });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 max-w-xl glass-card [&>button]:hidden">
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <DialogDescription className="sr-only">
          Search for a section, project, or action.
        </DialogDescription>

        <Command className="bg-transparent [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-muted-foreground">
          <CommandInput placeholder="Type a command or search…" />
          <CommandList className="max-h-[360px]">
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup heading="Navigate">
              {sections.map(({ id, label }) => {
                const Icon = sectionIcons[id] ?? Code2;
                return (
                  <CommandItem key={id} value={`go ${label}`} onSelect={() => goTo(id)}>
                    <Icon className="mr-3 h-4 w-4 text-primary" />
                    {label}
                  </CommandItem>
                );
              })}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Projects">
              {projects.map((p) => (
                <CommandItem
                  key={p.title}
                  value={`project ${p.title} ${p.tags.join(" ")}`}
                  onSelect={() =>
                    // Projects without a public URL just jump to the projects section
                    p.live ? run(() => window.open(p.live, "_blank", "noopener,noreferrer")) : goTo("projects")
                  }
                >
                  <span className="mr-3 text-base leading-none">{p.image}</span>
                  {p.title}
                  {p.live && <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground" />}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Actions">
              <CommandItem
                value="toggle theme dark light mode"
                onSelect={() => run(() => setTheme(isDark ? "light" : "dark"))}
              >
                {isDark ? (
                  <Sun className="mr-3 h-4 w-4 text-primary" />
                ) : (
                  <Moon className="mr-3 h-4 w-4 text-primary" />
                )}
                Switch to {isDark ? "light" : "dark"} mode
              </CommandItem>
              <CommandItem value="download resume cv pdf" onSelect={downloadResume}>
                <Download className="mr-3 h-4 w-4 text-primary" />
                Download resume
              </CommandItem>
              <CommandItem value="copy email address" onSelect={() => copy(profile.email, "Email")}>
                <Copy className="mr-3 h-4 w-4 text-primary" />
                Copy email
              </CommandItem>
              <CommandItem
                value="send email mail contact"
                onSelect={() => run(() => (window.location.href = `mailto:${profile.email}`))}
              >
                <Mail className="mr-3 h-4 w-4 text-primary" />
                Send an email
              </CommandItem>
              <CommandItem
                value="open linkedin profile"
                onSelect={() => run(() => window.open(profile.linkedin, "_blank", "noopener,noreferrer"))}
              >
                <Linkedin className="mr-3 h-4 w-4 text-primary" />
                Open LinkedIn
              </CommandItem>
              {profile.github && (
                <CommandItem
                  value="open github profile code"
                  onSelect={() => run(() => window.open(profile.github, "_blank", "noopener,noreferrer"))}
                >
                  <Github className="mr-3 h-4 w-4 text-primary" />
                  Open GitHub
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>

          <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-muted-foreground font-mono">
            <span>↑↓ navigate · ↵ select</span>
            <span>esc close</span>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default CommandPalette;
