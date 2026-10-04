import { STORAGE_KEYS } from "@/config/constants";
import { readLocalStorage, writeLocalStorage } from "@/lib/local-store";
import { Theme } from "@/types/enums";

/**
 * Theme lives on the document element as a class, because that is the
 * condition Park UI compiles its dark tokens against (`.dark &`). Nothing in
 * the app reads a media query directly.
 *
 * The stored value is the user's explicit choice. Absence of a stored value
 * means "follow the system", which is why readStoredTheme can return null
 * rather than defaulting to light here.
 */

export function readStoredTheme(): Theme | null {
  const stored = readLocalStorage(STORAGE_KEYS.theme);
  return stored === Theme.DARK || stored === Theme.LIGHT ? stored : null;
}

export function systemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? Theme.DARK
    : Theme.LIGHT;
}

export function resolveTheme(): Theme {
  return readStoredTheme() ?? systemTheme();
}

export function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle("dark", theme === Theme.DARK);
  document.documentElement.style.colorScheme = theme;
  writeLocalStorage(STORAGE_KEYS.theme, theme);
}

/**
 * Runs before first paint, inlined in <head>.
 *
 * Without this the server sends light markup and the client corrects it on
 * mount, which a dark-mode user sees as a white flash. Kept as a string
 * because it has to execute before React exists.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem(${JSON.stringify(
  STORAGE_KEYS.theme,
)});var d=s?s==="dark":matchMedia("(prefers-color-scheme: dark)").matches;if(d){document.documentElement.classList.add("dark");}document.documentElement.style.colorScheme=d?"dark":"light";}catch(e){}})();`;
