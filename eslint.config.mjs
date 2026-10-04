import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Panda's generated output. We do not own this code.
    "styled-system/**",
  ]),
  {
    // Park UI writes these files, and re-writes them when you run
    // `@park-ui/cli add`. An empty interface extending another is its
    // deliberate pattern for a named prop type that can diverge later.
    // Editing them to satisfy the linter just loses the change next time.
    files: ["src/components/ui/**/*.tsx"],
    rules: {
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },
]);

export default eslintConfig;
