import { afterEach, describe, expect, it, vi } from "vitest";

import { STORAGE_KEYS } from "@/config/constants";
import { readStoredTheme, resolveTheme } from "@/lib/theme";
import { Theme } from "@/types/enums";

/** Stands in for the system preference, which jsdom does not implement. */
function mockSystemPrefersDark(prefersDark: boolean) {
  vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: prefersDark }));
}

afterEach(() => {
  window.localStorage.clear();
  vi.unstubAllGlobals();
});

describe("theme resolution", () => {
  it("returns null when the user has never chosen", () => {
    expect(readStoredTheme()).toBeNull();
  });

  it("ignores a stored value that is not a theme", () => {
    window.localStorage.setItem(STORAGE_KEYS.theme, "chartreuse");

    expect(readStoredTheme()).toBeNull();
  });

  it("prefers an explicit choice over the system preference", () => {
    mockSystemPrefersDark(true);
    window.localStorage.setItem(STORAGE_KEYS.theme, Theme.LIGHT);

    expect(resolveTheme()).toBe(Theme.LIGHT);
  });

  it("follows the system when nothing is stored", () => {
    mockSystemPrefersDark(true);

    expect(resolveTheme()).toBe(Theme.DARK);
  });

  it("resolves to light for a system that does not prefer dark", () => {
    mockSystemPrefersDark(false);

    expect(resolveTheme()).toBe(Theme.LIGHT);
  });
});
