# AGENTS.md

Rules for any agent or human writing code in this repo. CI enforces the parts that can be enforced mechanically (`pnpm lint:content`), and reviewers enforce the rest.

## 1. Writing rules (UI copy, docs, comments, commit messages)

The goal is text that reads like a competent engineer wrote it in a hurry, not text that reads like it was generated.

**Never use these characters:**

| Banned                 | Use instead                          |
| ---------------------- | ------------------------------------ |
| `—` em dash            | A period. Start a new sentence.      |
| `–` en dash            | "to" for ranges, as in "2 to 3 days" |
| `…` ellipsis character | Three periods, or nothing            |
| `“ ” ‘ ’` curly quotes | Straight quotes                      |

**Never use these words.** They are the strongest tell of generated text:

`leverage`, `utilize`, `seamless`, `seamlessly`, `robust`, `delve`, `dive in`, `unlock`, `elevate`, `streamline`, `empower`, `harness`, `realm`, `landscape`, `tapestry`, `testament`, `crucial`, `vital`, `comprehensive`, `cutting-edge`, `state-of-the-art`, `game-changer`, `revolutionize`, `supercharge`, `effortless`, `intuitive` (as a marketing adjective), `journey` (unless a literal user flow), `it's not just X, it's Y`, `let's dive into`.

**Sentence construction:**

- One idea per sentence. Aim for 20 words.
- No sentence may open with "Whether you're", "In today's", "As we", "Simply put", or "At its core".
- Do not end a section with a summary sentence that restates the section.
- Do not write "Note that" or "It's worth noting that". Just say the thing.
- Comments explain why, never what. `# increment i` is banned. `# The webhook sender retries for 24h, so this must be idempotent` is good.

**UI copy specifically:**

- Sentence case for every button, label, heading, and menu item. "Add project", not "Add Project".
- No exclamation points anywhere in the product.
- No emoji in the product. Not in buttons, not in empty states, not in toasts.
- Error messages say what broke and what to do. "Could not reach the API. Check that the backend is running on port 8000." Not "Oops! Something went wrong."
- Empty states describe the state and the next action. No mascot voice, no jokes.

## 2. Visual rules

Park UI on Panda CSS is the design system. Do not add a second UI library, and do not hand-roll a component that Park UI already ships. If the UI calls a backend, never put a rule in the UI that the backend does not also enforce.

**Banned outright:**

- Purple-to-blue gradients, or any gradient on a button, card, or background. Flat fills only.
- Glassmorphism, backdrop blur, frosted panels.
- Drop shadows for decoration. Shadows only to signal true elevation, meaning dialogs and popovers.
- Rounding everything to `full`. Use the configured radius token.
- Emoji as icons. Lucide only, which is Park UI's default.
- Animated gradient borders, glow effects, "shimmer" loading text.

**Required:**

- Light mode is the product. Dark exists behind the toggle in the sidebar footer and must keep working. Never hardcode a color: use the `app.*` shell tokens, which carry their dark counterparts.
- Brand colors: `#2A85FF` blue as accent, `#1D1D1D` as the dark neutral. Do not introduce a third.
- Density over whitespace. The dense type scale is `table.header` (11px) and `table.cell` (13px).
- Every table goes through `components/common/data-table.tsx`, with a unique `tableId`.
- A panel beside content is `components/common/side-panel.tsx`, which pushes rather than covers. No backdrops, no portals.
- The shell is one viewport tall and never scrolls itself. `PageBody` owns the scroll.
- The sidebar and the landing route come from `src/config/nav.ts`.
- `colorPalette.*` tokens only resolve once something sets `colorPalette`. `button.ts` and `badge.ts` default it for this reason. A new palette needs its bucket in `theme/colors/` and an entry in `staticCss` in `panda.config.ts`.
- The browser never calls a backend directly. It calls `/api/engine/*`, the proxy route that adds `SERVICE_API_KEY` server side. A key in the client bundle is a key anyone can read.
- Every status or kind is a `const` object in `src/types/enums.ts`, with a label map. No string literals elsewhere.
- Env is read only in `src/config/env.ts`, which is server only.

## 3. Before you commit

Run `pnpm check`. It runs eslint, the content lint, type checks, tests, and a production build. If it does not pass, the work is not done.
