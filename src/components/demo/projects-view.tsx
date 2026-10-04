"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { type ReactNode, useMemo, useState } from "react";
import { css } from "styled-system/css";

import { DataTable } from "@/components/common/data-table";
import { SearchInput } from "@/components/common/search-input";
import { SearchSelect } from "@/components/common/search-select";
import { Section } from "@/components/common/section";
import { SidePanel } from "@/components/common/side-panel";
import { StatusBadge } from "@/components/common/status-badge";
import { PageBody, PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui";
import { PROJECTS, type Project, projectTotals } from "@/lib/demo-data";
import { formatCurrency, formatPercent, initials } from "@/lib/format";
import { PROJECT_STATUS_LABEL, ProjectStatus } from "@/types/enums";

const ALL_STATUSES = "all";

const STATUS_OPTIONS = [
  { value: ALL_STATUSES, label: "All statuses" },
  ...Object.values(ProjectStatus).map((status) => ({
    value: status,
    label: PROJECT_STATUS_LABEL[status],
    hint: String(projectTotals(PROJECTS).byStatus[status]),
  })),
];

const column = createColumnHelper<Project>();

const numeric = css({ fontVariantNumeric: "tabular-nums" });

const COLUMNS = [
  column.accessor("name", { header: "Project" }),
  column.accessor("lead", {
    header: "Lead",
    cell: (info) => (
      <span className={css({ display: "inline-flex", alignItems: "center", gap: "2" })}>
        <Avatar name={info.getValue()} />
        {info.getValue()}
      </span>
    ),
  }),
  column.accessor("status", {
    header: "Status",
    cell: (info) => <StatusBadge status={info.getValue()} />,
  }),
  column.accessor("members", {
    header: "Members",
    size: 120,
    cell: (info) => <span className={numeric}>{info.getValue()}</span>,
  }),
  column.accessor("budget", {
    header: "Budget",
    size: 120,
    cell: (info) => <span className={numeric}>{formatCurrency(info.getValue())}</span>,
  }),
  column.accessor("spent", {
    header: "Spent",
    size: 120,
    cell: (info) => <span className={numeric}>{formatCurrency(info.getValue())}</span>,
  }),
  column.accessor("updated", {
    header: "Updated",
    size: 130,
    cell: (info) => <span className={numeric}>{info.getValue()}</span>,
  }),
];

export function ProjectsView() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>(ALL_STATUSES);
  const [selected, setSelected] = useState<Project | null>(null);

  const rows = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return PROJECTS.filter(
      (project) =>
        (status === ALL_STATUSES || project.status === status) &&
        (needle === "" ||
          project.name.toLowerCase().includes(needle) ||
          project.lead.toLowerCase().includes(needle)),
    );
  }, [search, status]);

  return (
    // The panel is a flex sibling of the page, so opening it narrows the table
    // instead of covering it.
    <div className={css({ display: "flex", flex: 1, minHeight: 0 })}>
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minWidth: 0,
        })}
      >
        <PageHeader
          title="Projects"
          help="A DataTable with sorting, paging, column visibility, and resizing. Click a row to open the side panel."
          actions={
            <>
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search projects or leads"
              />
              <SearchSelect
                label="Status"
                value={status}
                options={STATUS_OPTIONS}
                onChange={setStatus}
                width="11rem"
              />
            </>
          }
        />
        <PageBody>
          <div
            className={css({ display: "flex", flexDirection: "column", height: "full" })}
          >
            <DataTable
              tableId="demo.projects"
              data={rows}
              columns={COLUMNS}
              initialSorting={[{ id: "updated", desc: true }]}
              onRowClick={setSelected}
              fillHeight
              empty={{
                title: "No projects match",
                description:
                  "Clear the search or pick another status to see more projects.",
                action: (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSearch("");
                      setStatus(ALL_STATUSES);
                    }}
                  >
                    Clear filters
                  </Button>
                ),
              }}
            />
          </div>
        </PageBody>
      </div>

      <SidePanel
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.name ?? ""}
        description={selected?.summary}
        footer={
          <Button size="sm" variant="outline" onClick={() => setSelected(null)}>
            Close
          </Button>
        }
      >
        {selected && <ProjectDetail project={selected} />}
      </SidePanel>
    </div>
  );
}

function ProjectDetail({ project }: { project: Project }) {
  const remaining = project.budget - project.spent;
  const rows: [string, ReactNode][] = [
    ["Lead", project.lead],
    ["Status", <StatusBadge key="status" status={project.status} />],
    ["Members", project.members],
    ["Budget", formatCurrency(project.budget)],
    [
      "Spent",
      `${formatCurrency(project.spent)} (${formatPercent(project.spent, project.budget)})`,
    ],
    ["Remaining", formatCurrency(remaining)],
    ["Updated", project.updated],
    ["ID", project.id],
  ];

  return (
    <Section title="Details">
      <dl
        className={css({
          display: "grid",
          gridTemplateColumns: "7rem 1fr",
          textStyle: "table.cell",
          "& > *": {
            py: "2",
            borderBottomWidth: "1px",
            borderColor: "app.lineSoft",
          },
        })}
      >
        {rows.map(([label, value]) => (
          <div key={label} className={css({ display: "contents" })}>
            <dt className={css({ color: "fg.muted" })}>{label}</dt>
            <dd className={numeric}>{value}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

function Avatar({ name }: { name: string }) {
  return (
    <span
      aria-hidden
      className={css({
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "5",
        height: "5",
        borderRadius: "sm",
        bg: "gray.a3",
        color: "fg.muted",
        fontSize: "10px",
        fontWeight: "semibold",
        flexShrink: 0,
      })}
    >
      {initials(name)}
    </span>
  );
}
