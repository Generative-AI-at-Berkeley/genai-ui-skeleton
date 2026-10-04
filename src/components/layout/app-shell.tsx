"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useSyncExternalStore } from "react";
import { css, cx } from "styled-system/css";

import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import {
  APP_NAME,
  SIDEBAR_COLLAPSED_WIDTH,
  SIDEBAR_WIDTH,
  STORAGE_KEYS,
} from "@/config/constants";
import { LANDING_ROUTE, NAV_SECTIONS, type NavItem } from "@/config/nav";
import {
  readLocalStorage,
  subscribeLocalStorage,
  writeLocalStorage,
} from "@/lib/local-store";

interface AppShellProps {
  children: ReactNode;
}

/**
 * Nav on the left, a content sheet on the right, both locked to the viewport.
 *
 * The shell itself never scrolls. It is exactly one viewport tall, and the two
 * panes scroll independently inside it. Letting the page scroll instead makes
 * the content sheet run off the bottom of the screen, which turns the rounded
 * corner into a shape that just ends somewhere below the fold.
 */
export function AppShell({ children }: AppShellProps) {
  // The server has no localStorage, so it renders expanded. useSyncExternalStore
  // reconciles the real preference on the client without an effect setting
  // state after mount, which is the pattern React's hooks lint flags.
  const collapsed = useSyncExternalStore(
    (onChange) => subscribeLocalStorage(STORAGE_KEYS.sidebarCollapsed, onChange),
    () => readLocalStorage(STORAGE_KEYS.sidebarCollapsed) === "true",
    () => false,
  );

  const toggle = () => {
    writeLocalStorage(STORAGE_KEYS.sidebarCollapsed, String(!collapsed));
  };

  return (
    <div
      className={css({
        display: "flex",
        height: "100dvh",
        overflow: "hidden",
        bg: "app.sidebar",
      })}
    >
      <Sidebar collapsed={collapsed} onToggle={toggle} />

      <main
        className={css({
          flex: "1",
          minWidth: 0,
          display: "flex",
          pt: "2",
          pr: "2",
          pb: "2",
        })}
      >
        <div
          className={css({
            flex: "1",
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            // The sheet does not scroll. PageBody inside it owns the scroll, so
            // the page header sitting above PageBody stays put. When the sheet
            // scrolled too, the header was inside the scroller and slid away,
            // which is the "scrolled past the nav" bug.
            overflow: "hidden",
            overscrollBehavior: "contain",
            bg: "app.surface",
            borderWidth: "1px",
            borderColor: "app.line",
            borderRadius: "xl",
          })}
        >
          {children}
        </div>
      </main>
    </div>
  );
}

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      style={{ width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH }}
      className={css({
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        height: "100dvh",
        px: "2",
        py: "3",
        gap: "5",
        transition: "width 160ms ease",
      })}
    >
      {/* Logo left, collapse toggle right. The toggle stays in the same corner
          in both states so it does not move out from under the cursor. */}
      <div
        className={css({
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          gap: "2",
          px: "2",
          flexShrink: 0,
        })}
      >
        {!collapsed && (
          <NextLink
            href={LANDING_ROUTE}
            className={css({
              display: "flex",
              alignItems: "center",
              gap: "2.5",
              color: "fg.default",
              minWidth: 0,
            })}
          >
            <Logo />
            <span
              className={css({
                fontSize: "sm",
                fontWeight: "semibold",
                letterSpacing: "-0.01em",
                whiteSpace: "nowrap",
              })}
            >
              {APP_NAME}
            </span>
          </NextLink>
        )}

        <button
          type="button"
          className={iconButton}
          onClick={onToggle}
          aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
          title={collapsed ? "Expand navigation" : "Collapse navigation"}
        >
          {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
        </button>
      </div>

      <nav
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: "4",
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
        })}
      >
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <p
                className={css({
                  px: "2",
                  pb: "1",
                  textStyle: "table.header",
                  color: "fg.subtle",
                })}
              >
                {section.label}
              </p>
            )}

            <div
              className={css({ display: "flex", flexDirection: "column", gap: "0.5" })}
            >
              {section.items.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  collapsed={collapsed}
                  active={item.isActive(pathname)}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: "2",
          flexShrink: 0,
        })}
      >
        <div
          className={css({
            display: "flex",
            alignItems: "center",
            gap: "1",
            justifyContent: collapsed ? "center" : "flex-start",
            px: collapsed ? "0" : "2",
          })}
        >
          <ThemeToggle showLabel={false} className={iconButton} />
        </div>
      </div>
    </aside>
  );
}

const iconButton = css({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  height: "7",
  width: "7",
  flexShrink: 0,
  borderRadius: "sm",
  color: "fg.muted",
  cursor: "pointer",
  _hover: { bg: "app.active", color: "fg.default" },
});

interface NavLinkProps {
  item: NavItem;
  collapsed: boolean;
  active: boolean;
}

function NavLink({ item, collapsed, active }: NavLinkProps) {
  const Icon = item.icon;

  return (
    <NextLink
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={cx(
        css({
          display: "flex",
          alignItems: "center",
          gap: "2.5",
          height: "9",
          // Equal padding both sides. The highlight is a full-width band
          // inside the sidebar's own gutter, not a pill floating against the
          // right edge.
          px: "2",
          borderRadius: "sm",
          fontSize: "0.8125rem",
          whiteSpace: "nowrap",
          justifyContent: collapsed ? "center" : "flex-start",
          color: "fg.default",
          _hover: { bg: "app.active" },
        }),
        active ? css({ bg: "app.active", fontWeight: "medium" }) : undefined,
      )}
    >
      <Icon
        size={17}
        className={cx(
          css({ flexShrink: 0 }),
          active ? css({ color: "fg.default" }) : css({ color: "fg.muted" }),
        )}
      />
      {!collapsed && item.label}
    </NextLink>
  );
}
