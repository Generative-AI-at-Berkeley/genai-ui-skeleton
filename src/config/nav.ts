import { FolderKanban, LayoutDashboard, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { ROUTES } from "@/config/constants";

/**
 * The ordered definition of the sidebar, and the source of the landing route.
 * Both come from this list so reordering the nav moves the landing route too.
 */

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** A predicate rather than a prefix, so a detail route lights up one entry. */
  isActive: (pathname: string) => boolean;
}

export interface NavSection {
  label: string;
  items: readonly NavItem[];
}

const OVERVIEW: NavItem = {
  label: "Overview",
  href: ROUTES.overview,
  icon: LayoutDashboard,
  isActive: (pathname) => pathname.startsWith(ROUTES.overview),
};

const PROJECTS: NavItem = {
  label: "Projects",
  href: ROUTES.projects,
  icon: FolderKanban,
  isActive: (pathname) => pathname.startsWith(ROUTES.projects),
};

const SETTINGS: NavItem = {
  label: "Settings",
  href: ROUTES.settings,
  icon: Settings,
  isActive: (pathname) => pathname.startsWith(ROUTES.settings),
};

export const NAV_SECTIONS: readonly NavSection[] = [
  { label: "Workspace", items: [OVERVIEW, PROJECTS] },
  { label: "Configuration", items: [SETTINGS] },
];

/** Where "/" sends someone. The first entry of the first section, always. */
export const LANDING_ROUTE = NAV_SECTIONS[0].items[0].href;
