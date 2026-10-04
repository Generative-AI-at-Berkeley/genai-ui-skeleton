/**
 * Local Park UI recipe overrides.
 *
 * The Park UI CLI writes the individual recipe files here and appends an import
 * line to this file, but it leaves the wiring to us. These two objects are what
 * panda.config.ts registers under theme.extend. Without them Panda falls back to
 * the preset's own recipe versions, whose slots do not match the component
 * source the CLI generated, and the build breaks in confusing ways.
 *
 * When you add a component with `pnpm dlx @park-ui/cli add <name>`, add its
 * export to the matching object below, then run `pnpm exec panda codegen`.
 * A recipe built with defineSlotRecipe goes in slotRecipes, everything else in
 * recipes.
 */

import { absoluteCenter } from "./absolute-center";
import { badge } from "./badge";
import { button } from "./button";
import { card } from "./card";
import { checkbox } from "./checkbox";
import { combobox } from "./combobox";
import { dialog } from "./dialog";
import { field } from "./field";
import { group } from "./group";
import { heading } from "./heading";
import { input } from "./input";
import { menu } from "./menu";
import { popover } from "./popover";
import { select } from "./select";
import { skeleton } from "./skeleton";
import { spinner } from "./spinner";
import { table } from "./table";
import { tabs } from "./tabs";
import { text } from "./text";
import { textarea } from "./textarea";

/** Single part components. */
export const recipes = {
  absoluteCenter,
  badge,
  button,
  group,
  heading,
  input,
  skeleton,
  spinner,
  text,
  textarea,
};

/** Multi part components, built with defineSlotRecipe. */
export const slotRecipes = {
  card,
  checkbox,
  combobox,
  dialog,
  field,
  menu,
  popover,
  select,
  table,
  tabs,
};
