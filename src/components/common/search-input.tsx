"use client";

import { Search, X } from "lucide-react";
import { useRef, useState } from "react";
import { css } from "styled-system/css";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  width?: string;
}

/** How long to sit on a keystroke before filtering. */
const DEBOUNCE_MS = 200;

/**
 * A search box that keeps the typed text local and reports it on a delay.
 *
 * The delay matters because every reported change re-filters the table. Typing
 * a six-letter name would otherwise re-render the whole list six times, and
 * the input would feel like it was dropping characters.
 */
export function SearchInput({
  value,
  onChange,
  placeholder,
  width = "16rem",
}: SearchInputProps) {
  const [local, setLocal] = useState(value);
  // Tracks the prop as of the last render, so an external reset (the "clear
  // all" pill) can override the typed draft without an effect: this compares
  // against the previous render during the current one, which is the
  // documented way to adjust state in response to a prop change.
  const [syncedValue, setSyncedValue] = useState(value);
  if (value !== syncedValue) {
    setSyncedValue(value);
    setLocal(value);
  }

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const push = (next: string) => {
    setLocal(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => onChange(next), DEBOUNCE_MS);
  };

  return (
    <div
      style={{ width }}
      className={css({
        display: "flex",
        alignItems: "center",
        gap: "1.5",
        height: "8",
        px: "2",
        borderWidth: "1px",
        borderColor: "app.line",
        borderRadius: "sm",
        bg: "app.surface",
        _focusWithin: { borderColor: "gray.a7" },
      })}
    >
      <Search size={13} className={css({ color: "fg.subtle", flexShrink: 0 })} />
      <input
        type="search"
        value={local}
        placeholder={placeholder}
        onChange={(event) => push(event.target.value)}
        className={css({
          flex: 1,
          minWidth: 0,
          bg: "transparent",
          outline: "none",
          textStyle: "table.cell",
          color: "fg.default",
          _placeholder: { color: "fg.subtle" },
          // Safari draws its own clear button on type=search, next to ours.
          "&::-webkit-search-cancel-button": { display: "none" },
        })}
      />
      {local.length > 0 && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => push("")}
          className={css({
            display: "flex",
            color: "fg.subtle",
            cursor: "pointer",
            _hover: { color: "fg.default" },
          })}
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
}
