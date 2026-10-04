# genai-ui-skeleton

A barebones Next.js app shell for GenAI at Berkeley projects. It has the sidebar, page header, theme toggle, a data table, a side panel, and the Park UI components, with three demo pages that show each one in use. Fork it, delete the demo pages, and build your own views on the same parts.

Stack: Next.js 16 (App Router), React 19, Panda CSS with the Park UI preset, Ark UI, TanStack Table and Query, Lucide icons, Vitest.

## Run it

```bash
pnpm install
cp .env.example .env.local   # optional, only needed once you have a backend
pnpm dev                     # http://localhost:3000
```

`pnpm install` runs `panda codegen`, which writes `styled-system/`. Run it again after changing `panda.config.ts` or anything in `src/theme/`.

| Command             | What it does                                                  |
| ------------------- | ------------------------------------------------------------- |
| `pnpm dev`          | Dev server on port 3000                                       |
| `pnpm build`        | Panda codegen, then a production build                        |
| `pnpm lint`         | eslint                                                        |
| `pnpm lint:content` | Fails on banned characters and words in prose (see AGENTS.md) |
| `pnpm typecheck`    | Codegen, Next route types, then `tsc`                         |
| `pnpm test`         | Vitest                                                        |
| `pnpm check`        | All of the above. Run before you commit.                      |

## What is in it

| Page     | Shows                                                                                                                                                                                                          |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Overview | Page header with help tooltip and actions, sections, stat cards, status badges, every button variant, menu, searchable select, checkbox, tabs, empty, loading, and error states, code block, and a dialog form |
| Projects | DataTable with sorting, paging, resizing, and column visibility. Search and status filter in the header. A row click opens a side panel that pushes the table over instead of covering it                      |
| Settings | Form fields in a reading-width column: input, select, textarea, checkbox. A live API status check through the proxy route                                                                                      |

The demo rows live in `src/lib/demo-data.ts`. Overview totals are computed from them, so the numbers on both pages always agree.

## Add a page

1. Add the route to `ROUTES` in `src/config/constants.ts`.
2. Add a `NavItem` in `src/config/nav.ts`. The first item of the first section is where `/` redirects.
3. Create `src/app/<route>/page.tsx` that renders a view from `src/components/<feature>/`.
4. Start the view with `PageHeader`, then put content inside `PageBody`. The shell never scrolls; `PageBody` does.

## Add a table

Use `DataTable` from `src/components/common/data-table.tsx` with a `tableId` no other table uses. Column widths and hidden columns are saved per `tableId` in local storage. Pass `fillHeight` and wrap it in a flex column with a bounded height so the pagination bar stays on screen. `src/components/demo/projects-view.tsx` is the example.

## Call a backend

The browser never calls your API directly. It calls `/api/engine/<path>`, and `src/app/api/engine/[...path]/route.ts` forwards to `API_BASE_URL` with `SERVICE_API_KEY` as a bearer token, server side.

1. Set `API_BASE_URL` (and `SERVICE_API_KEY` if your API wants one) in `.env.local`.
2. Add the path to `API_ROUTES` and a typed method to `apiClient` in `src/lib/api-client.ts`, with its response type in `src/types/api.ts`.
3. Add a key to `src/lib/query-keys.ts` and a hook in `src/hooks/`. `use-health.ts` is the pattern.

## Folder layout

| Folder                   | Holds                                                              |
| ------------------------ | ------------------------------------------------------------------ |
| `src/app/`               | Routes, the root layout, and the proxy route                       |
| `src/components/ui/`     | Park UI components. Restyle them in `src/theme/recipes/`, not here |
| `src/components/common/` | Shared app parts: data table, side panel, states, badges, inputs   |
| `src/components/layout/` | App shell, page header and body, theme toggle                      |
| `src/components/demo/`   | The demo pages. Delete when you start your own                     |
| `src/config/`            | Constants, nav, and env (server only)                              |
| `src/hooks/`             | Server state hooks                                                 |
| `src/lib/`               | API client, query keys, formatting, local storage helpers          |
| `src/theme/`             | Colors, recipes, and text styles                                   |
| `src/types/`             | Enums and API response types                                       |

Rules for code and copy are in [AGENTS.md](AGENTS.md).
