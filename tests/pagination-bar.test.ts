import { describe, expect, it } from "vitest";

import { pageNumbers } from "@/components/common/pagination-bar";

describe("pageNumbers", () => {
  it("shows every page when there are few enough", () => {
    expect(pageNumbers(0, 5)).toEqual([0, 1, 2, 3, 4]);
  });

  it("still returns the one page when that is all there is", () => {
    // The bar renders at one page rather than appearing once a list gets long.
    // A control that shows up only sometimes is a control people learn twice.
    expect(pageNumbers(0, 1)).toEqual([0]);
  });

  it("returns nothing to render when there are no pages at all", () => {
    expect(pageNumbers(0, 0)).toEqual([]);
  });

  it("always includes the first and last page", () => {
    const pages = pageNumbers(5, 40);

    expect(pages[0]).toBe(0);
    expect(pages[pages.length - 1]).toBe(39);
  });

  it("keeps the current page in the visible window", () => {
    const pages = pageNumbers(20, 40);

    expect(pages).toContain(20);
  });

  it("collapses the middle with a single gap marker near the start", () => {
    const pages = pageNumbers(0, 40);

    expect(pages.filter((page) => page === null)).toHaveLength(1);
  });

  it("never shows two gaps back to back", () => {
    for (let current = 0; current < 40; current += 1) {
      const pages = pageNumbers(current, 40);
      for (let index = 1; index < pages.length; index += 1) {
        expect(pages[index] === null && pages[index - 1] === null).toBe(false);
      }
    }
  });

  it("does not show a gap adjacent to the edge it would replace", () => {
    // Page 0 is index 0; a gap right after it saves nothing over showing page 1.
    const pages = pageNumbers(0, 40);
    expect(pages[1]).not.toBeNull();
  });

  it("reaching the last page shows the tail run without a trailing gap", () => {
    const pages = pageNumbers(39, 40);

    expect(pages[pages.length - 1]).toBe(39);
    expect(pages[pages.length - 2]).not.toBeNull();
  });

  it("every returned page number is in range", () => {
    for (const current of [0, 1, 15, 38, 39]) {
      const pages = pageNumbers(current, 40);
      for (const page of pages) {
        if (page !== null) {
          expect(page).toBeGreaterThanOrEqual(0);
          expect(page).toBeLessThan(40);
        }
      }
    }
  });

  it("page numbers only increase left to right", () => {
    const pages = pageNumbers(20, 40).filter((page): page is number => page !== null);

    for (let index = 1; index < pages.length; index += 1) {
      expect(pages[index]).toBeGreaterThan(pages[index - 1]);
    }
  });
});
