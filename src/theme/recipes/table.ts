import { defineSlotRecipe } from "@pandacss/dev";

export const table = defineSlotRecipe({
  className: "table",
  slots: ["root", "body", "cell", "foot", "head", "header", "row", "caption"],
  base: {
    root: {
      borderCollapse: "collapse",
      fontVariantNumeric: "lining-nums tabular-nums",
      textAlign: "start",
      verticalAlign: "top",
      width: "full",
    },
    cell: {
      alignItems: "center",
      color: "fg.muted",
      textAlign: "start",
      textOverflow: "ellipsis",
      textStyle: "sm",
      whiteSpace: "nowrap",
      overflow: "hidden",
      boxShadow: "inset 0 -1px 0 0 var(--shadow-color)",
      shadowColor: "border",
      _pinned: {
        bg: "inherit",
        boxShadow: "inset 0 -1px 0 0 var(--shadow-color)",
        overflow: "unset",
        position: "sticky",
        shadowColor: "border",
        zIndex: 1,
      },
    },
    row: {
      _last: { "& td": { boxShadow: "none" } },
    },
    header: {
      textAlign: "left",
      verticalAlign: "middle",
      // Opaque, always. A header cell with no background of its own lets rows
      // scroll through it the moment the header is sticky, which reads as the
      // column names going translucent and being overwritten by values.
      bg: "app.canvas",
      boxShadow: "inset 0 -1px 0 0 var(--shadow-color)",
      shadowColor: "border",
      _pinned: {
        position: "sticky",
        bg: "app.canvas",
        zIndex: 3,
      },
    },
    head: {
      color: "fg.muted",
      fontWeight: "semibold",
      textAlign: "start",
      whiteSpace: "nowrap",
      textStyle: "xs",
    },
    caption: {
      color: "fg.subtle",
      fontWeight: "medium",
    },
    foot: {
      fontWeight: "medium",
      "& td": {
        boxShadow: "inset 0 1px 0 0 var(--shadow-color)!",
        shadowColor: "border",
      },
    },
  },
  defaultVariants: {
    size: "md",
    variant: "plain",
  },
  variants: {
    variant: {
      surface: {
        header: { bg: "gray.surface.bg.hover" },
        row: { bg: "gray.surface.bg" },
      },
      plain: {},
    },
    striped: {
      true: {
        row: { "&:nth-of-type(odd) td": { bg: "gray.surface.bg.hover" } },
      },
    },
    interactive: {
      true: {
        body: { "& tr": { _hover: { bg: "app.hover" } } },
      },
    },
    columnBorder: {
      true: {
        header: {
          "&:not(:last-of-type)": {
            borderInlineEndWidth: "1px",
            borderColor: "app.lineSoft",
          },
        },
        cell: {
          "&:not(:last-of-type)": {
            borderInlineEndWidth: "1px",
            borderColor: "app.lineSoft",
          },
        },
      },
    },
    stickyHeader: {
      true: {
        // Sticky goes on the cells, not on the row group. A position:sticky
        // <thead> does not paint its own background over rows passing under it,
        // and a <tr> cannot be a containing block for one either, so the offset
        // applied while the rows still showed through.
        header: {
          position: "sticky",
          top: "var(--table-sticky-offset, 0)",
          zIndex: 3,
        },
      },
    },
    size: {
      // Density over whitespace: AGENTS.md section 2 says recruiters scan
      // tables, so this is the default every data table in the app uses.
      // md stays defined for the rare case a table needs breathing room.
      sm: {
        root: { textStyle: "sm" },
        head: { textStyle: "table.header" },
        header: { px: "3", py: "2" },
        cell: { textStyle: "table.cell", px: "3", py: "2" },
      },
      md: {
        root: { textStyle: "sm" },
        header: { px: "3", py: "3" },
        cell: { px: "3", py: "3" },
      },
    },
  },
});
