"use client";

import { useLayoutEffect } from "react";

export function ThemeBoot() {
  useLayoutEffect(() => {
    try {
      const stored = localStorage.getItem("portfolio-theme");
      document.documentElement.dataset.theme = "dark";
    } catch {
      document.documentElement.dataset.theme = "light";
    }
  }, []);

  return null;
}
