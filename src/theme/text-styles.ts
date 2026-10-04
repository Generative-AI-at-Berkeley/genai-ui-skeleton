import { defineTextStyles } from "@pandacss/dev";

/**
 * The dense end of the type scale.
 *
 * Panda's `sm` is 14px, which is a comfortable reading size and the wrong size
 * for a table a recruiter scans fifty rows of. These two are the sizes the
 * data surfaces use: 11px headers over 13px cells.
 */
export const textStyles = defineTextStyles({
  "table.header": {
    value: {
      fontSize: "0.6875rem",
      fontWeight: "500",
      lineHeight: "1.4",
      letterSpacing: "0.01em",
    },
  },
  "table.cell": {
    value: {
      fontSize: "0.8125rem",
      fontWeight: "400",
      lineHeight: "1.45",
    },
  },
});
