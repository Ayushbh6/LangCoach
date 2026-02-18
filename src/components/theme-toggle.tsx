"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-10 w-10 rounded-md border-2 border-slate-900 bg-white opacity-0" />
    );
  }

  return (
    <button
      type="button"
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-md border-2 border-slate-900 bg-white text-slate-900 shadow-[3px_3px_0px_rgba(15,23,42,1)] transition-all hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none dark:border-slate-100 dark:bg-slate-950 dark:text-slate-100 dark:shadow-[3px_3px_0px_rgba(248,250,252,1)]"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
