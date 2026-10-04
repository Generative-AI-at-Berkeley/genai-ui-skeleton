import { describe, expect, it } from "vitest";

import { PROJECTS, projectTotals } from "@/lib/demo-data";
import { ProjectStatus } from "@/types/enums";

describe("projectTotals", () => {
  it("adds up the demo rows", () => {
    const totals = projectTotals(PROJECTS);

    // Members: 6 + 4 + 5 + 3 + 4 + 2 + 5 + 3 = 32
    // Budget: 4000 + 2500 + 3000 + 1500 + 2000 + 1000 + 2500 + 1500 = 18000
    // Spent: 2350 + 2280 + 2875 + 410 + 1120 + 300 + 2465 + 640 = 12440
    expect(totals).toEqual({
      projects: 8,
      members: 32,
      budget: 18000,
      spent: 12440,
      byStatus: {
        [ProjectStatus.ACTIVE]: 4,
        [ProjectStatus.AT_RISK]: 1,
        [ProjectStatus.PAUSED]: 1,
        [ProjectStatus.SHIPPED]: 2,
      },
    });
  });

  it("counts every status as zero for an empty list", () => {
    expect(projectTotals([]).byStatus[ProjectStatus.PAUSED]).toBe(0);
  });
});
