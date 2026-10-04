import type { ReactNode } from "react";
import { css } from "styled-system/css";

const shell = css({
  px: "6",
  py: "12",
  textAlign: "center",
});

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

/**
 * Empty and error states say what happened and what to do next. No mascot
 * voice, no jokes, no emoji. See AGENTS.md section 1.
 *
 * None of these draw their own border. They render inside the table frame, so
 * the page does not resize as a query moves from loading to empty to loaded.
 */
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className={shell}>
      <p className={css({ fontSize: "sm", fontWeight: "medium", color: "fg.default" })}>
        {title}
      </p>
      <p
        className={css({
          textStyle: "table.cell",
          color: "fg.muted",
          mt: "1.5",
          mx: "auto",
          maxW: "sm",
        })}
      >
        {description}
      </p>
      {action && <div className={css({ mt: "5" })}>{action}</div>}
    </div>
  );
}

export function ErrorState({ title, message }: { title: string; message: string }) {
  return (
    <div className={shell}>
      <p className={css({ fontSize: "sm", fontWeight: "medium", color: "fg.error" })}>
        {title}
      </p>
      <p
        className={css({
          textStyle: "table.cell",
          color: "fg.muted",
          mt: "1.5",
          mx: "auto",
          maxW: "md",
        })}
      >
        {message}
      </p>
    </div>
  );
}

/** Placeholder rows at the height the real rows will be, to stop the jump. */
export function LoadingRows({ rows = 6 }: { rows?: number }) {
  return (
    <div>
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className={css({
            height: "9",
            borderBottomWidth: "1px",
            borderColor: "app.lineSoft",
            bg: "app.canvas",
            opacity: 0.6,
            _last: { borderBottomWidth: 0 },
          })}
        />
      ))}
    </div>
  );
}
