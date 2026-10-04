/**
 * Fixed values that are not configuration. Nothing here reads process.env;
 * that is src/config/env.ts, and it is server only.
 */

export const APP_NAME = "GenAI skeleton";

export const ROUTES = {
  overview: "/overview",
  projects: "/projects",
  settings: "/settings",
} as const;

/**
 * Shell geometry. The sidebar collapses to an icon rail rather than vanishing.
 */
export const SIDEBAR_WIDTH = "15rem";
export const SIDEBAR_COLLAPSED_WIDTH = "3.5rem";
export const TOPBAR_HEIGHT = "3.25rem";

/** Browser-local preferences. Per-device UI state, not server state. */
export const STORAGE_KEYS = {
  theme: "skeleton.theme",
  sidebarCollapsed: "skeleton.sidebar-collapsed",
} as const;

/**
 * The browser's only way to the API: this app's own proxy route, which adds
 * the service key server side. See src/app/api/engine/[...path]/route.ts.
 */
export const PROXY_PREFIX = "/api/engine";

export const API_ROUTES = {
  health: "/v1/health",
} as const;
