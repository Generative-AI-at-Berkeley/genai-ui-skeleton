import { readLocalStorage, writeLocalStorage } from "@/lib/local-store";

/**
 * Which columns a table shows, and how wide they are.
 *
 * Per device rather than per account, and stored under a table's own id, so
 * hiding six columns on the candidates table does not touch the extraction
 * console. A recruiter who sets a table up should not have to set it up again
 * tomorrow, which is the whole reason this is persisted at all.
 */

export interface TablePreferences {
  hidden: string[];
  widths: Record<string, number>;
}

const EMPTY: TablePreferences = { hidden: [], widths: {} };

function key(tableId: string): string {
  return `recruitment.table.${tableId}`;
}

/**
 * Read a table's saved preferences, falling back to the columns it ships
 * hidden.
 *
 * `defaultHidden` applies only when nothing has been saved for this table. Once
 * someone has touched the column menu their choice is the whole answer, so a
 * column they deliberately turned on does not switch itself back off.
 */
export function readTablePreferences(
  tableId: string,
  defaultHidden: readonly string[] = [],
): TablePreferences {
  const raw = readLocalStorage(key(tableId));
  if (raw === null) return { hidden: [...defaultHidden], widths: {} };

  // Stored preferences outlive the code that wrote them. A column that no
  // longer exists, or a shape from an older version, must not throw on read.
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return EMPTY;

    const { hidden, widths } = parsed as Partial<TablePreferences>;
    return {
      hidden: Array.isArray(hidden) ? hidden.filter((id) => typeof id === "string") : [],
      widths: typeof widths === "object" && widths !== null ? widths : {},
    };
  } catch {
    return EMPTY;
  }
}

export function writeTablePreferences(
  tableId: string,
  preferences: TablePreferences,
): void {
  writeLocalStorage(key(tableId), JSON.stringify(preferences));
}

/** TanStack holds visibility as "id -> is visible", the inverse of what is stored. */
export function toVisibilityState(hidden: string[]): Record<string, boolean> {
  return Object.fromEntries(hidden.map((id) => [id, false]));
}

export function toHiddenList(visibility: Record<string, boolean>): string[] {
  return Object.entries(visibility)
    .filter(([, visible]) => !visible)
    .map(([id]) => id);
}
