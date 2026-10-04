import { defineSemanticTokens } from "@pandacss/dev";

/**
 * Shell surfaces.
 *
 * Park UI's bg tokens describe components. These describe the four planes the
 * app is built from, which components sit on top of: the grey canvas, the
 * white content sheet, the sidebar, and the hairlines between them.
 *
 * The light values are the ones the product is designed at. The dark values
 * map onto Radix slate's dark ramp so the theme toggle stays honest.
 */
export const app = defineSemanticTokens.colors({
  canvas: { value: { _light: "#fafafa", _dark: "{colors.gray.dark.1}" } },
  surface: { value: { _light: "#ffffff", _dark: "{colors.gray.dark.2}" } },
  sidebar: { value: { _light: "#fbfbfb", _dark: "{colors.gray.dark.1}" } },

  hover: { value: { _light: "#f5f5f5", _dark: "{colors.gray.dark.4}" } },
  active: { value: { _light: "#ebebeb", _dark: "{colors.gray.dark.5}" } },

  // Two weights of rule: the outer frame of a table, and the lighter line
  // between its rows. Using one weight for both makes dense tables read as a
  // grid instead of a list.
  line: { value: { _light: "#e2e8f0", _dark: "{colors.gray.dark.6}" } },
  lineSoft: { value: { _light: "#f1f5f9", _dark: "{colors.gray.dark.4}" } },
});
