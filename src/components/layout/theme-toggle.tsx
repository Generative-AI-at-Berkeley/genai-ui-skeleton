"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

import { STORAGE_KEYS } from "@/config/constants";
import { subscribeLocalStorage } from "@/lib/local-store";
import { applyTheme, resolveTheme } from "@/lib/theme";
import { Theme } from "@/types/enums";

interface ThemeToggleProps {
  /** Collapsed sidebar drops the label and keeps the icon. */
  showLabel: boolean;
  className: string;
}

export function ThemeToggle({ showLabel, className }: ThemeToggleProps) {
  // The server has no localStorage, so its snapshot is null. The client
  // snapshot resolves the real theme, including the system preference when
  // nothing is stored, and useSyncExternalStore reconciles the two without a
  // component-owned effect.
  const theme = useSyncExternalStore(
    (onChange) => subscribeLocalStorage(STORAGE_KEYS.theme, onChange),
    resolveTheme,
    () => null,
  );

  const next = theme === Theme.DARK ? Theme.LIGHT : Theme.DARK;

  return (
    <button
      type="button"
      className={className}
      aria-label={`Switch to ${next} mode`}
      onClick={() => applyTheme(next)}
    >
      {theme === Theme.DARK ? <Moon size={16} /> : <Sun size={16} />}
      {showLabel && <span>{theme === Theme.DARK ? "Dark" : "Light"}</span>}
    </button>
  );
}
