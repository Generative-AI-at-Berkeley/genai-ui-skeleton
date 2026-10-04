import { describe, expect, it } from "vitest";

import { ROUTES } from "@/config/constants";
import { LANDING_ROUTE, NAV_SECTIONS } from "@/config/nav";

describe("nav definition", () => {
  it("derives the landing route from the first nav entry", () => {
    // The point of deriving it: reordering the sidebar must move the landing
    // route with it, rather than stranding users on a hardcoded path.
    expect(LANDING_ROUTE).toBe(NAV_SECTIONS[0].items[0].href);
  });

  it("points every entry at a route the app defines", () => {
    const known = Object.values(ROUTES);

    for (const section of NAV_SECTIONS) {
      for (const item of section.items) {
        expect(known).toContain(item.href);
      }
    }
  });

  it("marks exactly one entry active for any of its own routes", () => {
    const items = NAV_SECTIONS.flatMap((section) => section.items);

    for (const item of items) {
      const active = items.filter((candidate) => candidate.isActive(item.href));
      expect(active).toEqual([item]);
    }
  });

  it("keeps a detail route under the section it belongs to", () => {
    const items = NAV_SECTIONS.flatMap((section) => section.items);
    const active = items.filter((item) => item.isActive(`${ROUTES.projects}/prj-101`));

    expect(active.map((item) => item.label)).toEqual(["Projects"]);
  });
});
