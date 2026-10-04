/**
 * Every query key in the app, in one place. Two spellings of one key are two
 * caches, and an invalidation that matches neither.
 */
export const queryKeys = {
  health: ["health"] as const,
} as const;
