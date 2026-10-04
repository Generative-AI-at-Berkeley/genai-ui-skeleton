"use client";

import { Portal } from "@ark-ui/react/portal";
import { Download, MoreHorizontal } from "lucide-react";
import { type ReactNode, useState } from "react";
import { css } from "styled-system/css";

import { SearchSelect } from "@/components/common/search-select";
import { CodeBlock, Section } from "@/components/common/section";
import { EmptyState, ErrorState, LoadingRows } from "@/components/common/states";
import { StatusBadge } from "@/components/common/status-badge";
import { Tooltip } from "@/components/common/tooltip";
import { NewProjectDialog } from "@/components/demo/new-project-dialog";
import { PageBody, PageHeader } from "@/components/layout/page-header";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  IconButton,
  Menu,
  Skeleton,
  Tabs,
} from "@/components/ui";
import { PROJECTS, projectTotals } from "@/lib/demo-data";
import { formatCurrency, formatPercent } from "@/lib/format";
import { PROJECT_STATUS_LABEL, ProjectStatus } from "@/types/enums";

const totals = projectTotals(PROJECTS);

const LEAD_OPTIONS = PROJECTS.map((project) => ({
  value: project.id,
  label: project.lead,
  hint: project.name,
}));

const StateTab = {
  EMPTY: "empty",
  LOADING: "loading",
  ERROR: "error",
} as const;

export function OverviewView() {
  const [lead, setLead] = useState(PROJECTS[0].id);
  const [notify, setNotify] = useState(true);

  return (
    <>
      <PageHeader
        title="Overview"
        help="Every shared component on one page. Copy from here when building a new view."
        actions={
          <>
            <Button size="sm" variant="outline">
              <Download size={14} />
              Export
            </Button>
            <NewProjectDialog />
          </>
        }
      />
      <PageBody>
        <div className={css({ display: "flex", flexDirection: "column", gap: "6" })}>
          <Section title="Totals">
            <div
              className={css({
                display: "grid",
                gridTemplateColumns: { base: "1fr 1fr", md: "repeat(4, 1fr)" },
                gap: "3",
              })}
            >
              <Stat label="Projects" value={String(totals.projects)} />
              <Stat label="Members" value={String(totals.members)} />
              <Stat label="Budget" value={formatCurrency(totals.budget)} />
              <Stat
                label="Spent"
                value={formatCurrency(totals.spent)}
                note={`${formatPercent(totals.spent, totals.budget)} of budget`}
              />
            </div>
          </Section>

          <Section title="Status">
            <div className={css({ display: "flex", flexWrap: "wrap", gap: "4" })}>
              {Object.values(ProjectStatus).map((status) => (
                <div
                  key={status}
                  className={css({ display: "flex", alignItems: "center", gap: "2" })}
                >
                  <StatusBadge status={status} />
                  <span
                    className={css({
                      textStyle: "table.cell",
                      color: "fg.muted",
                      fontVariantNumeric: "tabular-nums",
                    })}
                  >
                    {totals.byStatus[status]}
                  </span>
                </div>
              ))}
              <Badge size="sm" variant="outline">
                {totals.projects} total
              </Badge>
            </div>
          </Section>

          <Section title="Controls">
            <div
              className={css({
                display: "flex",
                flexWrap: "wrap",
                alignItems: "flex-end",
                gap: "3",
              })}
            >
              <Button size="sm" variant="solid">
                Primary
              </Button>
              <Button size="sm" variant="outline">
                Outline
              </Button>
              <Button size="sm" variant="subtle">
                Subtle
              </Button>
              <Button size="sm" variant="plain">
                Plain
              </Button>
              <Button size="sm" variant="outline" loading loadingText="Saving">
                Save
              </Button>
              <Button size="sm" variant="outline" disabled>
                Disabled
              </Button>

              <Menu.Root positioning={{ placement: "bottom-end" }}>
                <Tooltip label="More actions">
                  <Menu.Trigger asChild>
                    <IconButton size="sm" variant="outline" aria-label="More actions">
                      <MoreHorizontal size={15} />
                    </IconButton>
                  </Menu.Trigger>
                </Tooltip>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content>
                      <Menu.Item value="rename">Rename</Menu.Item>
                      <Menu.Item value="duplicate">Duplicate</Menu.Item>
                      <Menu.Separator />
                      <Menu.Item value="archive">Archive</Menu.Item>
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>

              <SearchSelect
                label="Project lead"
                value={lead}
                options={LEAD_OPTIONS}
                onChange={setLead}
                width="14rem"
                showLabel
              />

              <Checkbox.Root
                size="sm"
                checked={notify}
                onCheckedChange={(details) => setNotify(details.checked === true)}
              >
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Label>Email me weekly totals</Checkbox.Label>
                <Checkbox.HiddenInput />
              </Checkbox.Root>
            </div>
          </Section>

          <Section title="States">
            <Tabs.Root size="sm" defaultValue={StateTab.EMPTY}>
              <Tabs.List>
                <Tabs.Trigger value={StateTab.EMPTY}>Empty</Tabs.Trigger>
                <Tabs.Trigger value={StateTab.LOADING}>Loading</Tabs.Trigger>
                <Tabs.Trigger value={StateTab.ERROR}>Error</Tabs.Trigger>
                <Tabs.Indicator />
              </Tabs.List>
              <Tabs.Content value={StateTab.EMPTY}>
                <Frame>
                  <EmptyState
                    title="No projects yet"
                    description="Projects you create show up here with their lead, budget, and status."
                    action={<NewProjectDialog />}
                  />
                </Frame>
              </Tabs.Content>
              <Tabs.Content value={StateTab.LOADING}>
                <Frame>
                  <LoadingRows rows={4} />
                </Frame>
                <div
                  className={css({
                    display: "flex",
                    flexDirection: "column",
                    gap: "2",
                    mt: "3",
                  })}
                >
                  <Skeleton height="4" width="60%" />
                  <Skeleton height="4" width="40%" />
                </div>
              </Tabs.Content>
              <Tabs.Content value={StateTab.ERROR}>
                <Frame>
                  <ErrorState
                    title="Could not load projects"
                    message="The API did not answer. Check that it is running and that API_BASE_URL in .env.local points at it."
                  />
                </Frame>
              </Tabs.Content>
            </Tabs.Root>
          </Section>

          <Section title="Code block">
            <CodeBlock maxHeight="12rem">
              {JSON.stringify(
                {
                  status: PROJECT_STATUS_LABEL[ProjectStatus.ACTIVE],
                  members: totals.members,
                  budget: totals.budget,
                  spent: totals.spent,
                },
                null,
                2,
              )}
            </CodeBlock>
          </Section>
        </div>
      </PageBody>
    </>
  );
}

function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <Card.Root>
      <Card.Body className={css({ p: "3", gap: "1" })}>
        <span className={css({ textStyle: "table.header", color: "fg.muted" })}>
          {label}
        </span>
        <span
          className={css({
            fontSize: "xl",
            fontWeight: "semibold",
            fontVariantNumeric: "tabular-nums",
          })}
        >
          {value}
        </span>
        {note && (
          <span className={css({ textStyle: "table.cell", color: "fg.subtle" })}>
            {note}
          </span>
        )}
      </Card.Body>
    </Card.Root>
  );
}

/** The same bordered frame DataTable draws, so states preview at their real size. */
function Frame({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        borderWidth: "1px",
        borderColor: "app.line",
        borderRadius: "l2",
        bg: "app.surface",
        overflow: "hidden",
        mt: "3",
      })}
    >
      {children}
    </div>
  );
}
