"use client";

import {
  type ColumnDef,
  type ColumnSizingState,
  type PaginationState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Portal } from "@ark-ui/react/portal";
import { ArrowDown, ArrowUp, ChevronRight, ChevronsUpDown, Columns3 } from "lucide-react";
import { type ReactNode, useState } from "react";
import { css } from "styled-system/css";

import { PaginationBar } from "@/components/common/pagination-bar";
import { EmptyState, ErrorState, LoadingRows } from "@/components/common/states";
import { Button, Checkbox, Popover, Table } from "@/components/ui";
import {
  readTablePreferences,
  toHiddenList,
  toVisibilityState,
  writeTablePreferences,
} from "@/lib/table-preferences";

/**
 * One width for every column unless someone drags it.
 *
 * Sized so a row of columns fills the frame rather than huddling on the left,
 * and so no column is sized to its longest value: a single long cell used to
 * decide the width for every row under it. Content that does not fit scrolls
 * inside its own cell instead.
 */
const DEFAULT_COLUMN_WIDTH = 180;
const MIN_COLUMN_WIDTH = 120;
const MAX_COLUMN_WIDTH = 640;
const DEFAULT_PAGE_SIZE = 25;

/**
 * A column with this id is pinned to the right edge and never scrolls away.
 *
 * Actions are the one column you always need reachable. On a table wide enough
 * to scroll sideways, unpinned buttons end up somewhere off the right of the
 * screen, so the row you can see is the row you cannot act on.
 */
export const ACTIONS_COLUMN_ID = "actions";

/**
 * The width a row-action column takes. A single icon button in a fixed,
 * non-stretching column, so the actions do not eat width the data columns
 * could use.
 */
export const ACTIONS_COLUMN_WIDTH = 64;

/**
 * A checkbox column is a fixed control, not data. Without this it inherits the
 * table's 120px minimum width and then stretches, which is the "big empty
 * column" a checkbox would be sitting at the left of.
 */
export const SELECT_COLUMN_ID = "select";
const SELECT_COLUMN_WIDTH = 40;

/** Sticky to the right edge, opaque, and following the row's hover state. */
const pinnedRight = css({
  position: "sticky",
  right: 0,
  zIndex: 2,
  bg: "app.surface",
  borderLeftWidth: "1px",
  borderColor: "app.line",
  // The cell paints its own background, so it would otherwise stay white while
  // the rest of the row highlights.
  "tr:hover &": { bg: "app.hover" },
});

const pinnedRightHeader = css({
  position: "sticky",
  right: 0,
  // Above the body's pinned cells as well as the scrolling header cells.
  zIndex: 4,
  bg: "app.canvas",
  borderLeftWidth: "1px",
  borderColor: "app.line",
});

interface DataTableProps<TRow> {
  /** Identifies this table's saved column preferences. Stable across renders. */
  tableId: string;
  data: TRow[];
  // TanStack's column helper produces columns whose value type varies per
  // column, which is exactly what `any` means here. There is no narrower type
  // that still lets one table hold a string column and a number column.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<TRow, any>[];
  initialSorting?: SortingState;
  /** Rows become clickable, and gain a chevron, only when this is given. */
  onRowClick?: (row: TRow) => void;
  /**
   * Columns this table ships hidden. Applies only until someone opens the
   * column menu, after which their choice is the whole answer.
   */
  defaultHiddenColumns?: readonly string[];
  pageSize?: number;
  /**
   * Fill the parent's height and scroll only the rows, so the pagination bar
   * stays on screen. The parent has to be a flex column with a bounded height;
   * without that the frame grows to its content and this changes nothing.
   */
  fillHeight?: boolean;
  /**
   * Width of the pinned row-action column. A single menu button needs far less
   * than a row of four buttons, and forcing one width for both clips the four.
   */
  actionsWidth?: number;
  isPending?: boolean;
  isError?: boolean;
  errorTitle?: string;
  errorMessage?: string;
  empty: {
    title: string;
    description: string;
    action?: ReactNode;
  };
}

/**
 * The one table in the app: sorting, paging, column visibility, and resizing.
 *
 * Every state renders inside the same bordered frame, so a page does not
 * resize as its query moves from loading to loaded, and a failed fetch never
 * leaves a blank box.
 *
 * A schema with twenty fields makes twenty columns, which will not fit on any
 * screen. Rather than truncating and hoping, the table scrolls sideways, any
 * column can be hidden, and any column can be dragged wider.
 */
export function DataTable<TRow>({
  tableId,
  data,
  columns,
  initialSorting = [],
  onRowClick,
  defaultHiddenColumns = [],
  pageSize = DEFAULT_PAGE_SIZE,
  fillHeight = false,
  actionsWidth = ACTIONS_COLUMN_WIDTH,
  isPending = false,
  isError = false,
  errorTitle = "Could not load this list",
  errorMessage = "Check that the backend is running on port 8000.",
  empty,
}: DataTableProps<TRow>) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  // Read once on mount. The server has no localStorage, so the lazy initializer
  // has to be safe to call there: readTablePreferences returns empty rather
  // than throwing when there is no window.
  const [preferences, setPreferences] = useState(() =>
    typeof window === "undefined"
      ? { hidden: [...defaultHiddenColumns], widths: {} }
      : readTablePreferences(tableId, defaultHiddenColumns),
  );

  const columnVisibility: VisibilityState = toVisibilityState(preferences.hidden);
  const columnSizing: ColumnSizingState = preferences.widths;

  const persist = (next: { hidden?: string[]; widths?: Record<string, number> }) => {
    setPreferences((current) => {
      const merged = { ...current, ...next };
      writeTablePreferences(tableId, merged);
      return merged;
    });
  };

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination, columnVisibility, columnSizing },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: (updater) => {
      const next = typeof updater === "function" ? updater(columnVisibility) : updater;
      persist({ hidden: toHiddenList(next) });
    },
    onColumnSizingChange: (updater) => {
      const next = typeof updater === "function" ? updater(columnSizing) : updater;
      persist({ widths: next });
    },
    columnResizeMode: "onChange",
    defaultColumn: {
      size: DEFAULT_COLUMN_WIDTH,
      minSize: MIN_COLUMN_WIDTH,
      maxSize: MAX_COLUMN_WIDTH,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const frame = css({
    borderWidth: "1px",
    borderColor: "app.line",
    borderRadius: "l2",
    bg: "app.surface",
    overflow: "hidden",
    ...(fillHeight
      ? { display: "flex", flexDirection: "column", flex: "1", minHeight: 0 }
      : {}),
  });

  // A pinned actions column already opens the row through its menu, so the
  // chevron column would be a second, redundant affordance taking width.
  const hasActionsColumn = table
    .getVisibleLeafColumns()
    .some((column) => column.id === ACTIONS_COLUMN_ID);

  // When the frame is wider than the columns, one column has to absorb the
  // difference. It used to be every column in proportion, which turned a 40px
  // checkbox column into a 97px one. The last data column absorbs it instead,
  // and every other column keeps the width it declared.
  const visibleColumns = table.getVisibleLeafColumns();
  const lastColumnId = visibleColumns.at(-1)?.id;
  const flexibleColumnId =
    lastColumnId === ACTIONS_COLUMN_ID ? visibleColumns.at(-2)?.id : lastColumnId;

  if (isPending) {
    return (
      <div className={frame}>
        <LoadingRows />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={frame}>
        <ErrorState title={errorTitle} message={errorMessage} />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={frame}>
        <EmptyState {...empty} />
      </div>
    );
  }

  const first = pagination.pageIndex * pagination.pageSize + 1;
  const last = Math.min(first + pagination.pageSize - 1, data.length);

  return (
    <div className={frame}>
      {/* Scrolls in both directions on its own. A wide schema pushes columns
            sideways here rather than widening the page, and a long list scrolls
            under a header that stays put. */}
      <div
        className={css(
          fillHeight
            ? { overflow: "auto", flex: 1, minHeight: 0, overscrollBehavior: "contain" }
            : {
                overflow: "auto",
                maxHeight: "calc(100dvh - 18rem)",
                overscrollBehavior: "contain",
              },
        )}
      >
        {/* minWidth, not width: the table stretches to fill the frame when
              its columns total less, and scrolls sideways when they total
              more. Setting width alone leaves a gap on the right. */}
        <Table.Root
          size="sm"
          columnBorder
          // Fixed layout so a declared width is the width. Without it the
          // browser distributes the leftover frame across every column, which
          // is what made the 40px checkbox column render 114px wide.
          style={{
            minWidth: "100%",
            width: table.getCenterTotalSize(),
            tableLayout: "fixed",
          }}
        >
          <Table.Head>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Row key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const direction = header.column.getIsSorted();
                  const sortable = header.column.getCanSort();
                  const pinned = header.column.id === ACTIONS_COLUMN_ID;

                  return (
                    <Table.Header
                      key={header.id}
                      whiteSpace="nowrap"
                      color="fg.subtle"
                      position="relative"
                      className={pinned ? pinnedRightHeader : undefined}
                      style={
                        pinned
                          ? {
                              width: actionsWidth,
                              maxWidth: actionsWidth,
                            }
                          : header.column.id === SELECT_COLUMN_ID
                            ? {
                                width: SELECT_COLUMN_WIDTH,
                                maxWidth: SELECT_COLUMN_WIDTH,
                              }
                            : header.column.id === flexibleColumnId
                              ? undefined
                              : { width: header.getSize() }
                      }
                    >
                      {sortable ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className={css({
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "1.5",
                            cursor: "pointer",
                            color: "inherit",
                            font: "inherit",
                            maxWidth: "full",
                            truncate: true,
                            _hover: { color: "fg.default" },
                          })}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {direction === "asc" && <ArrowUp size={11} />}
                          {direction === "desc" && <ArrowDown size={11} />}
                          {direction === false && (
                            <ChevronsUpDown
                              size={11}
                              className={css({ opacity: 0.35 })}
                            />
                          )}
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}

                      {header.column.getCanResize() && !pinned && (
                        // Sits on the column's trailing edge. onMouseDown
                        // rather than a click, because a resize starts on
                        // press and must not also sort the column.
                        <span
                          role="presentation"
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          onDoubleClick={() => header.column.resetSize()}
                          className={css({
                            position: "absolute",
                            top: 0,
                            right: 0,
                            height: "full",
                            width: "3px",
                            cursor: "col-resize",
                            userSelect: "none",
                            touchAction: "none",
                            _hover: { bg: "blue.9" },
                          })}
                        />
                      )}
                    </Table.Header>
                  );
                })}
                {onRowClick && !hasActionsColumn && (
                  <Table.Header width="8" aria-label="Open" />
                )}
              </Table.Row>
            ))}
          </Table.Head>

          <Table.Body>
            {table.getRowModel().rows.map((row) => (
              <Table.Row
                key={row.id}
                onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                className={
                  onRowClick
                    ? css({ cursor: "pointer", _hover: { bg: "app.hover" } })
                    : undefined
                }
              >
                {row.getVisibleCells().map((cell) => {
                  const pinned = cell.column.id === ACTIONS_COLUMN_ID;

                  return (
                    <Table.Cell
                      key={cell.id}
                      whiteSpace="nowrap"
                      className={pinned ? pinnedRight : undefined}
                      style={
                        pinned
                          ? {
                              width: actionsWidth,
                              maxWidth: actionsWidth,
                            }
                          : cell.column.id === SELECT_COLUMN_ID
                            ? {
                                width: SELECT_COLUMN_WIDTH,
                                maxWidth: SELECT_COLUMN_WIDTH,
                              }
                            : cell.column.id === flexibleColumnId
                              ? undefined
                              : {
                                  width: cell.column.getSize(),
                                  maxWidth: cell.column.getSize(),
                                }
                      }
                    >
                      {/* Ellipsis at rest, scrollable on hover. A value too
                            long for its column stays readable by scrolling
                            rather than widening every row under it, but
                            `overflow: auto` suppresses `text-overflow`, so a
                            cell that was always scrollable clipped its text
                            mid-word with nothing to say it had been cut. */}
                      <div
                        className={css({
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          scrollbarWidth: "none",
                          "&::-webkit-scrollbar": { display: "none" },
                          _hover: { overflowX: "auto", textOverflow: "clip" },
                          _focusWithin: { overflowX: "auto", textOverflow: "clip" },
                        })}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    </Table.Cell>
                  );
                })}
                {onRowClick && !hasActionsColumn && (
                  <Table.Cell width="8" color="fg.subtle">
                    <ChevronRight size={14} />
                  </Table.Cell>
                )}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </div>

      <div className={css({ flexShrink: 0 })}>
        <PaginationBar
          pageIndex={pagination.pageIndex}
          pageCount={table.getPageCount()}
          first={first}
          last={last}
          total={data.length}
          onGoTo={(pageIndex) => table.setPageIndex(pageIndex)}
          actions={<ColumnMenu table={table} />}
        />
      </div>
    </div>
  );
}

interface ColumnMenuProps {
  // The table instance's generic is not useful here, and naming it would force
  // every caller to thread its row type through for no benefit.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: any;
}

/** Show and hide columns. The list comes from the table, so it is never stale. */
function ColumnMenu({ table }: ColumnMenuProps) {
  const columns = table
    .getAllLeafColumns()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((column: any) => column.getCanHide());

  const hiddenCount = columns.filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (column: any) => !column.getIsVisible(),
  ).length;

  return (
    <Popover.Root positioning={{ placement: "bottom-end" }}>
      <Popover.Trigger asChild>
        <Button variant="outline" size="xs">
          <Columns3 size={13} />
          Columns
          {hiddenCount > 0 && (
            <span className={css({ color: "fg.subtle" })}>{hiddenCount} hidden</span>
          )}
        </Button>
      </Popover.Trigger>
      {/* Portalled: this popover hangs off a bar inside the table's own
          `overflow: hidden` frame, which would otherwise clip it. */}
      <Portal>
        <Popover.Positioner>
          <Popover.Content className={css({ width: "15rem", p: "1" })}>
            <div className={css({ maxHeight: "18rem", overflowY: "auto" })}>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {columns.map((column: any) => (
                <Checkbox.Root
                  key={column.id}
                  size="sm"
                  checked={column.getIsVisible()}
                  onCheckedChange={() => column.toggleVisibility()}
                  className={css({
                    px: "2",
                    py: "1.5",
                    width: "full",
                    borderRadius: "sm",
                    cursor: "pointer",
                    _hover: { bg: "app.hover" },
                  })}
                >
                  <Checkbox.Control>
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                  <Checkbox.Label
                    className={css({ textStyle: "table.cell", truncate: true })}
                  >
                    {typeof column.columnDef.header === "string"
                      ? column.columnDef.header
                      : column.id}
                  </Checkbox.Label>
                  <Checkbox.HiddenInput />
                </Checkbox.Root>
              ))}
            </div>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}
