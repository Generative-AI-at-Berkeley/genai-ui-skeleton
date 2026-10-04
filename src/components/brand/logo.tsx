import { css } from "styled-system/css";

/**
 * A plain mark: the brand neutral as a square, the initial in the surface
 * color. Both are tokens, so the mark inverts with the theme instead of
 * vanishing against a dark sidebar.
 */
export function Logo({ size = 22 }: { size?: number }) {
  return (
    <span
      aria-hidden
      style={{ width: size, height: size, fontSize: Math.round(size * 0.55) }}
      className={css({
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        borderRadius: "sm",
        bg: "fg.default",
        color: "app.surface",
        fontWeight: "bold",
        lineHeight: "1",
        letterSpacing: "-0.02em",
      })}
    >
      G
    </span>
  );
}
