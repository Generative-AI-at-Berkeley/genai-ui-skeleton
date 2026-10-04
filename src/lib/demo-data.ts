import { ProjectStatus } from "@/types/enums";

/**
 * Placeholder rows for the demo pages. Replace with a query hook once there is
 * an API. Totals on the overview page are computed from this list, never typed
 * in, so they always agree with the table.
 */

export interface Project {
  id: string;
  name: string;
  lead: string;
  status: ProjectStatus;
  members: number;
  budget: number;
  spent: number;
  /** ISO date of the last update. */
  updated: string;
  summary: string;
}

export const PROJECTS: Project[] = [
  {
    id: "prj-101",
    name: "Course notes assistant",
    lead: "Priya Raman",
    status: ProjectStatus.ACTIVE,
    members: 6,
    budget: 4000,
    spent: 2350,
    updated: "2026-09-30",
    summary: "Answers questions over lecture slides with citations to the slide number.",
  },
  {
    id: "prj-102",
    name: "Lab protocol parser",
    lead: "Daniel Okafor",
    status: ProjectStatus.AT_RISK,
    members: 4,
    budget: 2500,
    spent: 2280,
    updated: "2026-09-28",
    summary: "Turns PDF lab protocols into structured steps. Spend is close to budget.",
  },
  {
    id: "prj-103",
    name: "Speech to slides",
    lead: "Mei Chen",
    status: ProjectStatus.SHIPPED,
    members: 5,
    budget: 3000,
    spent: 2875,
    updated: "2026-09-12",
    summary:
      "Generates a slide outline from a recorded talk. Demoed at the September meeting.",
  },
  {
    id: "prj-104",
    name: "Grant matcher",
    lead: "Lucas Romero",
    status: ProjectStatus.ACTIVE,
    members: 3,
    budget: 1500,
    spent: 410,
    updated: "2026-10-01",
    summary: "Ranks open grants against a lab's past publications.",
  },
  {
    id: "prj-105",
    name: "Eval suite",
    lead: "Aisha Bello",
    status: ProjectStatus.ACTIVE,
    members: 4,
    budget: 2000,
    spent: 1120,
    updated: "2026-10-02",
    summary: "Shared prompt regression tests every project can run in CI.",
  },
  {
    id: "prj-106",
    name: "Campus events bot",
    lead: "Noah Whitfield",
    status: ProjectStatus.PAUSED,
    members: 2,
    budget: 1000,
    spent: 300,
    updated: "2026-08-21",
    summary: "Paused until the events calendar API is back up.",
  },
  {
    id: "prj-107",
    name: "Paper summarizer",
    lead: "Sofia Martins",
    status: ProjectStatus.SHIPPED,
    members: 5,
    budget: 2500,
    spent: 2465,
    updated: "2026-09-05",
    summary: "Weekly digest of new arXiv papers for each research group.",
  },
  {
    id: "prj-108",
    name: "Office hours triage",
    lead: "Ethan Park",
    status: ProjectStatus.ACTIVE,
    members: 3,
    budget: 1500,
    spent: 640,
    updated: "2026-09-29",
    summary: "Groups office hours questions so TAs answer duplicates once.",
  },
];

export interface ProjectTotals {
  projects: number;
  members: number;
  budget: number;
  spent: number;
  byStatus: Record<ProjectStatus, number>;
}

export function projectTotals(projects: readonly Project[]): ProjectTotals {
  const byStatus = Object.fromEntries(
    Object.values(ProjectStatus).map((status) => [status, 0]),
  ) as Record<ProjectStatus, number>;
  let members = 0;
  let budget = 0;
  let spent = 0;
  for (const project of projects) {
    members += project.members;
    budget += project.budget;
    spent += project.spent;
    byStatus[project.status] += 1;
  }
  return { projects: projects.length, members, budget, spent, byStatus };
}
