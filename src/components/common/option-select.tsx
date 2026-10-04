"use client";

import { createListCollection } from "@ark-ui/react/collection";
import { Portal } from "@ark-ui/react/portal";
import { useMemo } from "react";

import { Select } from "@/components/ui";

export interface OptionSelectOption {
  value: string;
  label: string;
}

interface OptionSelectProps {
  label: string;
  value: string;
  options: readonly OptionSelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * A plain dropdown for a short, fixed list. Past a dozen options, use
 * SearchSelect: scanning a long list is a search, not a choice.
 */
export function OptionSelect({
  label,
  value,
  options,
  onChange,
  placeholder = "Select",
}: OptionSelectProps) {
  const collection = useMemo(
    () => createListCollection({ items: [...options] }),
    [options],
  );

  return (
    <Select.Root
      size="sm"
      collection={collection}
      value={value ? [value] : []}
      onValueChange={(details) => {
        const next = details.value[0];
        if (next !== undefined) onChange(next);
      }}
      positioning={{ sameWidth: true }}
    >
      <Select.Label>{label}</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder={placeholder} />
          <Select.Indicator />
        </Select.Trigger>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            {collection.items.map((item) => (
              <Select.Item key={item.value} item={item}>
                <Select.ItemText>{item.label}</Select.ItemText>
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
      <Select.HiddenSelect />
    </Select.Root>
  );
}
