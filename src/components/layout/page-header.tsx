import { Info } from "lucide-react";
import type { ReactNode } from "react";
import { css } from "styled-system/css";

import { Tooltip } from "@/components/common/tooltip";
import { TOPBAR_HEIGHT } from "@/config/constants";

interface PageHeaderProps {
  title: string;
  /** Primary actions, rendered to the right of the title. */
  actions?: ReactNode;
  /**
   * Short explanation, shown on a small icon rather than printed under the
   * title. A sentence of prose under every header is read once and then just
   * pushes the page down.
   */
  help?: string;
}

/**
 * The bar at the top of every page: title on the left, actions on the right.
 *
 * Deliberately no description line and no small uppercase label above the
 * title. Both read as decoration. See AGENTS.md section 2.
 */
export function PageHeader({ title, actions, help }: PageHeaderProps) {
  return (
    <header
      style={{ minHeight: TOPBAR_HEIGHT }}
      className={css({
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "4",
        flexWrap: "wrap",
        borderBottomWidth: "1px",
        borderColor: "app.line",
        px: { base: "4", lg: "5" },
        py: "2",
        flexShrink: 0,
      })}
    >
      <div
        className={css({ display: "flex", alignItems: "center", gap: "2", minWidth: 0 })}
      >
        <h1
          className={css({ fontSize: "sm", fontWeight: "semibold", lineHeight: "1.3" })}
        >
          {title}
        </h1>
        {help && (
          <Tooltip label={help}>
            <span
              aria-label={help}
              className={css({
                display: "inline-flex",
                color: "fg.subtle",
                cursor: "help",
              })}
            >
              <Info size={13} />
            </span>
          </Tooltip>
        )}
      </div>
      {actions && (
        <div className={css({ display: "flex", gap: "2", alignItems: "center" })}>
          {actions}
        </div>
      )}
    </header>
  );
}

interface PageBodyProps {
  children: ReactNode;
  /**
   * `full` lets a table own the width. `reading` centers a column sized for
   * forms and detail pages, so they do not stretch a line of text across a
   * wide monitor or leave an unexplained gap on the right.
   */
  width?: "full" | "reading";
}

export function PageBody({ children, width = "full" }: PageBodyProps) {
  return (
    <div
      className={css({
        px: { base: "4", lg: "5" },
        py: "4",
        flex: "1",
        minHeight: 0,
        overflowY: "auto",
        // The page owns its own scroll; a nested list that reaches its end must
        // not drag the page with it.
        overscrollBehavior: "contain",
      })}
    >
      <div
        className={css(
          width === "reading"
            ? { maxW: "5xl", mx: "auto", minHeight: "full" }
            : { width: "full", height: "full", minHeight: 0 },
        )}
      >
        {children}
      </div>
    </div>
  );
}
