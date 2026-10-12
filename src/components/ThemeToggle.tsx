import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-9 h-9 rounded-lg border border-border bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
      aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : "Toggle theme"}
    >
      {mounted ? (
        isDark ? <Sun size={18} /> : <Moon size={18} />
      ) : (
        <span className="w-[18px] h-[18px]" />
      )}
    </button>
  );
};

export default ThemeToggle;
