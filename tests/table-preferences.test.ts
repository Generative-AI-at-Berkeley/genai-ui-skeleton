import { afterEach, describe, expect, it } from "vitest";

import {
  readTablePreferences,
  toHiddenList,
  toVisibilityState,
  writeTablePreferences,
} from "@/lib/table-preferences";

afterEach(() => {
  window.localStorage.clear();
});

describe("visibility conversion", () => {
  it("a hidden column becomes false, everything else stays absent", () => {
    expect(toVisibilityState(["email"])).toEqual({ email: false });
  });

  it("round-trips through toHiddenList", () => {
    const hidden = ["email", "source"];
    expect(toHiddenList(toVisibilityState(hidden)).sort()).toEqual(hidden.sort());
  });

  it("a column explicitly set visible is not in the hidden list", () => {
    expect(toHiddenList({ email: false, name: true })).toEqual(["email"]);
  });
});

describe("readTablePreferences / writeTablePreferences", () => {
  it("returns empty preferences when nothing has been saved", () => {
    expect(readTablePreferences("candidates")).toEqual({ hidden: [], widths: {} });
  });

  it("round-trips a saved preference", () => {
    writeTablePreferences("candidates", { hidden: ["email"], widths: { name: 240 } });

    expect(readTablePreferences("candidates")).toEqual({
      hidden: ["email"],
      widths: { name: 240 },
    });
  });

  it("keeps one table's preferences separate from another's", () => {
    writeTablePreferences("candidates", { hidden: ["email"], widths: {} });
    writeTablePreferences("cycles", { hidden: ["status"], widths: {} });

    expect(readTablePreferences("candidates").hidden).toEqual(["email"]);
    expect(readTablePreferences("cycles").hidden).toEqual(["status"]);
  });

  it("recovers from a corrupted value instead of throwing", () => {
    window.localStorage.setItem("recruitment.table.candidates", "{not json");

    expect(readTablePreferences("candidates")).toEqual({ hidden: [], widths: {} });
  });

  it("recovers from a value shaped differently than expected", () => {
    window.localStorage.setItem(
      "recruitment.table.candidates",
      JSON.stringify({ hidden: 5 }),
    );

    expect(readTablePreferences("candidates")).toEqual({ hidden: [], widths: {} });
  });
});
