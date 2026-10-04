"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";
import { css } from "styled-system/css";

import { Tooltip } from "@/components/common/tooltip";
import { IconButton } from "@/components/ui";

interface SidePanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  /** Width when open. The collapse animates between this and 0. */
  width?: string;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * A panel that pushes the content beside it, rather than covering it.
 *
 * No backdrop and no portal: this renders as an ordinary flex sibling next to
 * whatever it was placed beside, so the page under it stays exactly as
 * interactive as it was before the panel opened. That is deliberate. A drawer
 * with a dimming backdrop blocks the rest of the page the same way a centered
 * dialog does, which is the thing this shape exists to not be.
 *
 * Always mounted, width animated between 0 and `width`, rather than mounted
 * only while open: an unmount plus a fixed-width remount cannot animate,
 * it can only pop.
 */
export function SidePanel({
  open,
  onClose,
  title,
  description,
  width = "26rem",
  children,
  footer,
}: SidePanelProps) {
  return (
    <div
      aria-hidden={!open}
      style={{ width: open ? width : 0 }}
      className={css({
        flexShrink: 0,
        overflow: "hidden",
        borderLeftWidth: "1px",
        borderColor: open ? "app.line" : "transparent",
        transition: "width 180ms ease, border-color 180ms ease",
      })}
    >
      {/* Fixed to the open width regardless of the wrapper's current width, so
          content reflows only once, at the end of the collapse, not throughout it. */}
      <div
        style={{ width }}
        className={css({ display: "flex", flexDirection: "column", height: "full" })}
      >
        <div
          className={css({
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "3",
            p: "4",
            borderBottomWidth: "1px",
            borderColor: "app.line",
          })}
        >
          <div className={css({ minWidth: 0 })}>
            <h2 className={css({ fontSize: "sm", fontWeight: "semibold" })}>{title}</h2>
            {description && (
              <p className={css({ textStyle: "table.cell", color: "fg.muted", mt: "1" })}>
                {description}
              </p>
            )}
          </div>
          <Tooltip label="Close">
            <IconButton variant="ghost" size="sm" aria-label="Close" onClick={onClose}>
              <X size={16} />
            </IconButton>
          </Tooltip>
        </div>

        <div className={css({ flex: 1, minHeight: 0, overflowY: "auto", p: "4" })}>
          {children}
        </div>

        {footer && (
          <div
            className={css({
              display: "flex",
              justifyContent: "flex-end",
              gap: "2",
              p: "4",
              borderTopWidth: "1px",
              borderColor: "app.line",
            })}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
