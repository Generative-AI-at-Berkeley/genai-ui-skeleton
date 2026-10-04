"use client";

import { Portal } from "@ark-ui/react/portal";
import { Tooltip as ArkTooltip } from "@ark-ui/react/tooltip";
import type { ReactNode } from "react";
import { css } from "styled-system/css";

interface TooltipProps {
  label: ReactNode;
  children: ReactNode;
}

/**
 * A real tooltip, not a `title` attribute.
 *
 * The native title waits about a second, renders in the OS chrome, and cannot
 * be styled, so on a small icon it reads as "nothing happened". This shows on a
 * short delay next to the thing being hovered.
 *
 * Ark's Root renders no element of its own, so wrapping a control here does not
 * insert a node into a flex row and change its spacing.
 */
export function Tooltip({ label, children }: TooltipProps) {
  return (
    <ArkTooltip.Root openDelay={150} closeDelay={50} positioning={{ placement: "top" }}>
      <ArkTooltip.Trigger asChild>{children}</ArkTooltip.Trigger>
      <Portal>
        <ArkTooltip.Positioner>
          <ArkTooltip.Content
            className={css({
              // The app's own floating surface, not `gray.12` with white text:
              // that scale flips to near-white in dark mode, so the white text
              // landed on a near-white bubble.
              bg: "app.surface",
              color: "fg.default",
              borderWidth: "1px",
              borderColor: "app.line",
              boxShadow: "sm",
              px: "2",
              py: "1",
              borderRadius: "sm",
              textStyle: "table.header",
              maxW: "20rem",
              zIndex: 2000,
            })}
          >
            {label}
          </ArkTooltip.Content>
        </ArkTooltip.Positioner>
      </Portal>
    </ArkTooltip.Root>
  );
}
