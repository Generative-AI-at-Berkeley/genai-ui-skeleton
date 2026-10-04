import { menuAnatomy } from "@ark-ui/react/anatomy";
import { defineSlotRecipe } from "@pandacss/dev";

export const menu = defineSlotRecipe({
  className: "menu",
  slots: menuAnatomy.keys(),
  base: {
    content: {
      "--menu-z-index": "zIndex.dropdown",

      // Opaque, not the 2% alpha `gray.surface.bg` tint: a menu floats over
      // page content, so anything translucent shows the table through it.
      bg: "app.surface",
      borderRadius: "l3",
      boxShadow: "md",
      display: "flex",
      flexDirection: "column",
      maxH: "min(var(--available-height), {sizes.96})",
      minWidth: "max(var(--reference-width), {sizes.40})",
      outline: "0",
      overflow: "hidden",
      overflowY: "auto",
      position: "relative",
      zIndex: "calc(var(--menu-z-index) + var(--layer-index, 0))",
      _open: {
        animationStyle: "slide-fade-in",
        animationDuration: "fast",
      },
      _closed: {
        animationStyle: "slide-fade-out",
        animationDuration: "faster",
      },
    },
    item: {
      alignItems: "center",
      borderRadius: "l2",
      display: "flex",
      flex: "0 0 auto",
      outline: "0",
      textAlign: "start",
      textDecoration: "none",
      userSelect: "none",
      width: "100%",
      _highlighted: {
        bg: "app.hover",
      },
      _disabled: {
        layerStyle: "disabled",
      },
    },
    trigger: {
      _focusVisible: {
        focusVisibleRing: "outside",
      },
    },
    itemGroupLabel: {
      color: "fg.subtle",
      display: "flex",
      fontWeight: "medium",
      px: "2",
      py: "1",
      textStyle: "table.header",
    },
    itemIndicator: {
      justifyContent: "flex-end",
      display: "flex",
      flex: "1",
      _checked: {
        _icon: {
          // Not colorPalette-relative like the rest of this app's interactive
          // colors, on purpose: a menu is neutral chrome, not a place to read
          // colorPalette from a runtime prop nothing here ever sets.
          color: "gray.plain.fg",
        },
      },
    },
  },
  defaultVariants: {
    size: "md",
  },

  variants: {
    size: {
      xs: {
        content: { p: "1", gap: "0.5", textStyle: "sm" },
        item: { px: "1", minH: "8", gap: "2", _icon: { boxSize: "3.5" } },
        itemGroup: { gap: "0.5" },
        itemGroupLabel: { px: "1" },
        separator: { mx: "-1", my: "0.5" },
      },
      sm: {
        content: { p: "1", gap: "0.5", textStyle: "sm" },
        item: { px: "1.5", minH: "9", gap: "2", _icon: { boxSize: "4" } },
        itemGroup: { gap: "0.5" },
        itemGroupLabel: { px: "1.5" },
        separator: { mx: "-1.5", my: "0.5" },
      },
      md: {
        content: { p: "1", gap: "0.5", textStyle: "md" },
        item: { px: "2", minH: "10", gap: "2", _icon: { boxSize: "4" } },
        itemGroup: { gap: "0.5" },
        itemGroupLabel: { px: "2" },
        separator: { mx: "-2", my: "0.5" },
      },
      lg: {
        content: { p: "1", gap: "0.5", textStyle: "md" },
        item: { px: "2.5", minH: "11", gap: "2", _icon: { boxSize: "4.5" } },
        itemGroup: { gap: "0.5" },
        itemGroupLabel: { px: "2.5" },
        separator: { mx: "-2.5", my: "0.5" },
      },
      xl: {
        content: { p: "1", gap: "1", textStyle: "lg" },
        item: { px: "3", minH: "12", gap: "3", _icon: { boxSize: "5" } },
        itemGroup: { gap: "1" },
        itemGroupLabel: { px: "3" },
        separator: { mx: "-3", my: "0" },
      },
    },
  },
});
