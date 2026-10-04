"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { css } from "styled-system/css";

interface PaginationBarProps {
  pageIndex: number;
  pageCount: number;
  /** Range currently shown, one-based and inclusive. */
  first: number;
  last: number;
  total: number;
  onGoTo: (pageIndex: number) => void;
  /** The column control, rendered in the same bar rather than above the table. */
  actions?: ReactNode;
}

/** How many numbered buttons to show before collapsing the middle. */
const WINDOW = 7;

/**
 * Page numbers, not just arrows.
 *
 * A recruiter on page 9 of 40 needs to get to page 30 without clicking next
 * twenty one times. The window collapses with an ellipsis rather than
 * rendering forty buttons, and the first and last page are always reachable
 * because those are the two people actually jump to.
 */
export function PaginationBar({
  pageIndex,
  pageCount,
  first,
  last,
  total,
  onGoTo,
  actions,
}: PaginationBarProps) {
  const pages = pageNumbers(pageIndex, pageCount);
  // One page still renders the bar, showing "1" and the range. A control that
  // appears only once a list gets long is a control people learn twice.
  const single = pageCount <= 1;

  return (
    <div
      className={css({
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "3",
        flexWrap: "wrap",
        px: "3",
        py: "2",
        borderTopWidth: "1px",
        borderColor: "app.line",
        bg: "app.canvas",
      })}
    >
      <span className={css({ textStyle: "table.header", color: "fg.muted" })}>
        {total === 0 ? "Nothing to show" : `${first} to ${last} of ${total}`}
      </span>

      <div className={css({ display: "flex", alignItems: "center", gap: "1" })}>
        {actions}
        <button
          type="button"
          aria-label="Previous page"
          disabled={single || pageIndex === 0}
          onClick={() => onGoTo(pageIndex - 1)}
          className={arrow}
        >
          <ChevronLeft size={14} />
        </button>

        {pages.map((page, index) =>
          page === null ? (
            <span
              // Two gaps can appear, so the index is what makes them distinct.
              key={`gap-${index}`}
              className={css({ px: "1", textStyle: "table.header", color: "fg.subtle" })}
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              aria-label={`Page ${page + 1}`}
              aria-current={page === pageIndex ? "page" : undefined}
              onClick={() => onGoTo(page)}
              className={page === pageIndex ? currentPage : otherPage}
            >
              {page + 1}
            </button>
          ),
        )}

        <button
          type="button"
          aria-label="Next page"
          disabled={single || pageIndex >= pageCount - 1}
          onClick={() => onGoTo(pageIndex + 1)}
          className={arrow}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

/**
 * Which page numbers to render. `null` is an ellipsis.
 *
 * Exported for its own test: off-by-one errors here are invisible until
 * someone is on the last page of a long list.
 */
export function pageNumbers(pageIndex: number, pageCount: number): Array<number | null> {
  if (pageCount <= WINDOW) {
    return Array.from({ length: pageCount }, (_, index) => index);
  }

  const pages: Array<number | null> = [0];

  // Keep the current page centred where possible, clamped so the window never
  // runs past either end.
  let start = Math.max(1, pageIndex - 1);
  let end = Math.min(pageCount - 2, pageIndex + 1);

  if (pageIndex <= 2) {
    start = 1;
    end = 3;
  } else if (pageIndex >= pageCount - 3) {
    start = pageCount - 4;
    end = pageCount - 2;
  }

  if (start > 1) pages.push(null);
  for (let page = start; page <= end; page += 1) pages.push(page);
  if (end < pageCount - 2) pages.push(null);

  pages.push(pageCount - 1);
  return pages;
}

const baseButton = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  height: "7",
  minWidth: "7",
  px: "1.5",
  borderRadius: "sm",
  borderWidth: "1px",
  textStyle: "table.header",
  cursor: "pointer",
} as const;

const arrow = css({
  ...baseButton,
  borderColor: "app.line",
  color: "fg.muted",
  _hover: { bg: "app.hover", color: "fg.default" },
  _disabled: { opacity: 0.4, cursor: "not-allowed", _hover: { bg: "transparent" } },
});

const currentPage = css({
  ...baseButton,
  borderColor: "blue.9",
  bg: "blue.a3",
  color: "blue.11",
  fontWeight: "medium",
});

const otherPage = css({
  ...baseButton,
  borderColor: "app.line",
  color: "fg.muted",
  _hover: { bg: "app.hover", color: "fg.default" },
});
