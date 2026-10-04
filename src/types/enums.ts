/**
 * Every status and kind the UI compares against. When a backend exists, this
 * mirrors its enums by hand. No string literals elsewhere.
 */

export const ProjectStatus = {
  ACTIVE: "active",
  AT_RISK: "at_risk",
  PAUSED: "paused",
  SHIPPED: "shipped",
} as const;

export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus];

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  [ProjectStatus.ACTIVE]: "Active",
  [ProjectStatus.AT_RISK]: "At risk",
  [ProjectStatus.PAUSED]: "Paused",
  [ProjectStatus.SHIPPED]: "Shipped",
};

export const Theme = {
  LIGHT: "light",
  DARK: "dark",
} as const;

export type Theme = (typeof Theme)[keyof typeof Theme];
