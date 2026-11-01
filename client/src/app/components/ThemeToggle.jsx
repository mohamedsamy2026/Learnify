"use client";

import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "learnify-theme";

// Light / Dark switch. Only toggles the "dark" class on <html>
// and remembers the choice. The initial theme is applied by a
// tiny script in layout.js so there is no flash on load.
export default function ThemeToggle() {
  function toggleTheme() {
    const root = document.documentElement;
    const isDark = root.classList.toggle("dark");

    try {
      localStorage.setItem(
        STORAGE_KEY,
        isDark ? "dark" : "light"
      );
    } catch {
      // Storage may be unavailable; the theme still applies.
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      className="fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-ink shadow-[0_8px_24px_rgba(15,42,74,0.18)] transition-colors duration-200 hover:border-brand hover:text-brand"
    >
      <Moon size={19} className="dark:hidden" />
      <Sun size={19} className="hidden dark:block" />
    </button>
  );
}
