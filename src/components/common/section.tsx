import type { ReactNode } from "react";
import { css } from "styled-system/css";

interface SectionProps {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}

/** A titled block inside a page. Flat, no card chrome: density over decoration. */
export function Section({ title, actions, children }: SectionProps) {
  return (
    <section className={css({ display: "flex", flexDirection: "column", gap: "2" })}>
      <div
        className={css({
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "2",
        })}
      >
        <h2 className={css({ textStyle: "table.header", color: "fg.muted" })}>{title}</h2>
        {actions}
      </div>
      {children}
    </section>
  );
}

/** Monospace block for YAML and JSON. Scrolls inside itself. */
export function CodeBlock({
  children,
  maxHeight = "32rem",
}: {
  children: string;
  maxHeight?: string;
}) {
  return (
    <pre
      style={{ maxHeight }}
      className={css({
        fontFamily: "mono",
        fontSize: "12px",
        lineHeight: "1.55",
        bg: "app.canvas",
        borderWidth: "1px",
        borderColor: "app.line",
        borderRadius: "md",
        p: "3",
        overflow: "auto",
        whiteSpace: "pre",
      })}
    >
      {children}
    </pre>
  );
}
