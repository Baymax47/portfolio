"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("portfolio-theme", onStoreChange);
  return () => window.removeEventListener("portfolio-theme", onStoreChange);
}

function readTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function getServerTheme(): Theme {
  return "light";
}

export function ThemeToggle({ variant = "pill" }: { variant?: "pill" | "icon" }) {
  const theme = useSyncExternalStore(subscribe, readTheme, getServerTheme);

  function toggle() {
    const next: Theme = readTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("portfolio-theme", next);
    } catch {
      /* Storage can be blocked. The choice still applies for this view. */
    }
    window.dispatchEvent(new Event("portfolio-theme"));
  }

  const label = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-pressed={theme === "dark"}
        aria-label={label}
        className="theme-icons grid h-12 w-12 place-items-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] shadow-[var(--shadow)]"
      >
        <Sun size={18} className="theme-sun" aria-hidden="true" />
        <Moon size={18} className="theme-moon" aria-hidden="true" />
      </button>
    );
  }

  return (
    <div className="bento-card theme-card slot-theme">
      <button
        type="button"
        onClick={toggle}
        role="switch"
        aria-checked={theme === "dark"}
        aria-label={label}
        className="theme-switch"
      >
        <span className="theme-knob theme-icons">
          <Sun size={18} className="theme-sun" aria-hidden="true" />
          <Moon size={18} className="theme-moon" aria-hidden="true" />
        </span>
      </button>
    </div>
  );
}
