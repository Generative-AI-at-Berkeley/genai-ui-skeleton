import { describe, expect, it } from "vitest";

import { formatCurrency, formatPercent, initials } from "@/lib/format";

describe("formatCurrency", () => {
  it("rounds to whole dollars with separators", () => {
    expect(formatCurrency(12440)).toBe("$12,440");
    expect(formatCurrency(409.6)).toBe("$410");
  });
});

describe("formatPercent", () => {
  it("rounds to a whole percent and never divides by zero", () => {
    expect(formatPercent(12440, 18000)).toBe("69%");
    expect(formatPercent(0, 0)).toBe("0%");
  });
});

describe("initials", () => {
  it("takes at most two letters", () => {
    expect(initials("Priya Raman")).toBe("PR");
    expect(initials("Mei Ling Chen")).toBe("ML");
    expect(initials("  noah  ")).toBe("N");
  });
});
