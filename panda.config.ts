import { app } from "@/theme/colors/app";
import { blue as blueBuckets } from "@/theme/colors/blue";
import { gray as grayBuckets } from "@/theme/colors/gray";
import { green } from "@/theme/colors/green";
import { red as redBuckets } from "@/theme/colors/red";
import { recipes, slotRecipes } from "@/theme/recipes";
import { textStyles } from "@/theme/text-styles";
import { defineConfig } from "@pandacss/dev";
import pandaPreset from "@pandacss/preset-panda";
import { createPreset } from "@park-ui/panda-preset";
import blue from "@park-ui/panda-preset/colors/blue";
import slate from "@park-ui/panda-preset/colors/slate";

// Accent and gray match the brand from the collaboration deck: #2A85FF blue on a
// dark neutral. Radix "blue" and "slate" are the closest built-in palettes.
// AGENTS.md section 2 forbids introducing a third brand color.
//
// Listing `presets` explicitly replaces Panda's default, so pandaPreset has to be
// named here or the spacing and typography scales disappear.
export default defineConfig({
  preflight: true,
  include: ["./src/**/*.{js,jsx,ts,tsx}"],
  exclude: [],
  jsxFramework: "react",

  presets: [
    pandaPreset,
    createPreset({ accentColor: blue, grayColor: slate, radius: "sm" }),
  ],

  theme: {
    extend: {
      // Local recipe overrides win over the ones the Park UI preset ships, and
      // must match the component source in src/components/ui.
      recipes,
      slotRecipes,
      textStyles,
      semanticTokens: {
        colors: {
          app: app,
          green: green,
          // Merged into the preset's own gray/blue/red raw scales rather than
          // replacing them, since those still hold the numbered tokens
          // (gray.9, blue.a3, ...) these buckets are built from. See
          // palette-buckets.ts for why this exists at all.
          gray: grayBuckets,
          blue: blueBuckets,
          red: redBuckets,
        },
      },
    },
  },

  plugins: [
    {
      name: "Remove Panda Preset Colors",
      hooks: {
        // Park UI ships Radix colors. Dropping Panda's own color tokens stops the
        // two systems fighting over the same token names.
        "preset:resolved": ({ utils, preset, name }) =>
          name === "@pandacss/preset-panda"
            ? utils.omit(preset, ["theme.tokens.colors", "theme.semanticTokens.colors"])
            : preset,
      },
    },
  ],

  // A palette chosen at runtime (a status map, say) is invisible to Panda's
  // static extraction, so its classes would never be generated. Listing the
  // palettes here generates them all. A new palette needs its bucket in
  // theme/colors/ and a line here.
  staticCss: {
    css: [{ properties: { colorPalette: ["gray", "blue", "red", "green"] } }],
  },

  outdir: "styled-system",

  globalCss: {
    ":root": {
      // Park UI's default focus ring is a saturated blue that reads as a bug
      // against this palette. A neutral ring is just as visible and does not
      // compete with the brand blue on the control itself.
      "--global-color-focus-ring": "var(--colors-gray-8)",
      "--focus-ring-width": "1px",
      "--focus-ring-offset": "1px",
    },
  },
});
