import { defineSemanticTokens } from "@pandacss/dev";

/**
 * The five interaction buckets the button, badge, select, menu, and card
 * recipes read through paths like `{name}.solid.bg` or
 * `colorPalette.outline.border`: solid (filled), subtle (soft fill), surface
 * (bordered fill), outline (bordered, no fill), and plain (text only).
 *
 * The preset this repo installs (@park-ui/panda-preset 0.43.1) only ships the
 * raw numbered Radix scale for a palette (`gray.1`..`gray.12`, `gray.a1`..
 * `gray.a12`) plus a flat alias set (`colorPalette.a7`, `.text`, `.default`).
 * It never generates this bucket shape for any palette, including the ones
 * this app is built on. The recipes reference the bucket shape anyway, which
 * is why an outline button's border and a dropdown's background used to
 * render as literal, invalid CSS: the token they named did not exist, so the
 * browser silently dropped the whole declaration.
 *
 * This builds the bucket shape by reference into an existing raw scale, so
 * the actual colors still come from that palette's Radix ramp and repaint
 * correctly in dark mode along with everything else built on it.
 */
export function paletteBuckets(scale: "gray" | "blue" | "red") {
  const step = (n: number | `a${number}`) => `{colors.${scale}.${n}}`;

  return defineSemanticTokens.colors({
    solid: {
      bg: {
        DEFAULT: { value: step(9) },
        hover: { value: step(10) },
      },
      fg: { DEFAULT: { value: "white" } },
    },
    subtle: {
      bg: {
        DEFAULT: { value: step("a3") },
        hover: { value: step("a4") },
        active: { value: step("a5") },
      },
      fg: { DEFAULT: { value: step(11) } },
    },
    surface: {
      bg: {
        DEFAULT: { value: step("a2") },
        hover: { value: step("a3") },
        active: { value: step("a3") },
      },
      border: {
        DEFAULT: { value: step("a6") },
        hover: { value: step("a7") },
      },
      fg: { DEFAULT: { value: step(11) } },
    },
    outline: {
      border: { DEFAULT: { value: step("a7") } },
      bg: {
        hover: { value: step("a2") },
        active: { value: step("a3") },
      },
      fg: { DEFAULT: { value: step(11) } },
    },
    plain: {
      bg: {
        hover: { value: step("a3") },
        active: { value: step("a4") },
      },
      fg: { DEFAULT: { value: step(11) } },
    },
  });
}
