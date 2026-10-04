"use client";

import { createListCollection } from "@ark-ui/react/collection";
import { Portal } from "@ark-ui/react/portal";
import { useMemo, useState } from "react";
import { css } from "styled-system/css";

import { Combobox } from "@/components/ui";

export interface SearchSelectOption {
  value: string;
  label: string;
  /** A short marker shown before the label, such as a rank number. */
  leading?: string;
  /** A count or short note shown at the trailing edge of the row. */
  hint?: string;
  /** Indented one level, for an option nested under the one above it. */
  nested?: boolean;
}

interface SearchSelectProps {
  label: string;
  value: string;
  options: SearchSelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  width?: string;
  /** Shows the label above the field. Hidden by default, for toolbars. */
  showLabel?: boolean;
  disabled?: boolean;
  placement?: "bottom-start" | "top-start";
}

/**
 * A dropdown you can type into.
 *
 * A plain select stops working once a company has a few hundred cycles or
 * roles: scanning a list that long is not a choice, it is a search. Open it and
 * type to filter, so picking a scope or a schema stays one gesture no matter
 * how much data sits behind it.
 *
 * The input is controlled here rather than by Ark so that opening the menu
 * clears it for a fresh search and closing it restores the selected label.
 * Without that, clicking the field puts a text cursor in the middle of the
 * current value and the next keystroke corrupts it.
 */
export function SearchSelect({
  label,
  value,
  options,
  onChange,
  placeholder,
  width = "12rem",
  showLabel = false,
  disabled = false,
  placement = "bottom-start",
}: SearchSelectProps) {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);

  const selected = options.find((option) => option.value === value);

  const collection = useMemo(() => {
    const needle = open ? input.trim().toLowerCase() : "";
    const items =
      needle === ""
        ? options
        : options.filter((option) => option.label.toLowerCase().includes(needle));

    return createListCollection({
      items,
      itemToString: (item) => item.label,
      itemToValue: (item) => item.value,
    });
  }, [options, open, input]);

  return (
    <Combobox.Root
      size="sm"
      collection={collection}
      value={value ? [value] : []}
      inputValue={open ? input : (selected?.label ?? "")}
      open={open}
      openOnClick
      positioning={{ placement, sameWidth: true }}
      disabled={disabled}
      onValueChange={(details) => {
        const next = details.value[0];
        if (next === undefined) return;
        onChange(next);
        setInput(options.find((option) => option.value === next)?.label ?? "");
      }}
      onInputValueChange={(details) => setInput(details.inputValue)}
      onOpenChange={(details) => {
        setOpen(details.open);
        setInput("");
      }}
      lazyMount
      unmountOnExit
      className={css({ width })}
    >
      <Combobox.Label className={showLabel ? labelStyle : srOnlyLabel}>
        {label}
      </Combobox.Label>
      <Combobox.Control>
        <Combobox.Input
          placeholder={placeholder ?? label}
          onClick={() => setOpen(true)}
        />
        <Combobox.IndicatorGroup>
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.Empty>No matches.</Combobox.Empty>
            <Combobox.List>
              {collection.items.map((item) => (
                <Combobox.Item key={item.value} item={item}>
                  <Combobox.ItemText
                    className={css({
                      display: "flex",
                      alignItems: "center",
                      gap: "2",
                      width: "full",
                      pl: item.nested ? "3" : "0",
                      color: item.nested ? "fg.muted" : "fg.default",
                    })}
                  >
                    {item.leading && (
                      <span
                        className={css({
                          color: "fg.subtle",
                          flexShrink: 0,
                          width: "1rem",
                          textAlign: "right",
                          fontVariantNumeric: "tabular-nums",
                        })}
                      >
                        {item.leading}
                      </span>
                    )}
                    <span className={css({ flex: "1", truncate: true })}>
                      {item.label}
                    </span>
                    {item.hint && (
                      <span className={css({ color: "fg.subtle", flexShrink: 0 })}>
                        {item.hint}
                      </span>
                    )}
                  </Combobox.ItemText>
                  <Combobox.ItemIndicator />
                </Combobox.Item>
              ))}
            </Combobox.List>
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  );
}

const labelStyle = css({ textStyle: "table.header", color: "fg.subtle" });
const srOnlyLabel = css({ srOnly: true });
