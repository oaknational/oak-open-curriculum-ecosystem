# oak-curriculum-hub

Oak-styled web UI over the live curriculum **search** (Elasticsearch Serverless
via `oak-search-sdk`) and **content** (Open Curriculum REST API via
`oak-curriculum-sdk`) stacks, built as a full-fidelity reproduction of a Claude
Design export. **Demo by Heather W**, re-platformed from the original HTML
prototype and wired to the live SDKs.

This is a `demos/`-tier workspace at **full repo standards** — strict
TypeScript, the shared full-strict ESLint ruleset, TDD, and WCAG 2.2 AA (see
the [demos tier README](../README.md)). The original brief is
[`PROJECT-BRIEF.md`](PROJECT-BRIEF.md) (historical — paths in it predate the
`demos/` placement).

## Structure

| Path                                      | Role                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/`, `components/`, `lib/`, `scripts/` | The Next.js app — source, block components, data seams, and the re-runnable export extractors.                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `tools/`                                  | App-local evidence + verification tooling (live-demo capture, canonical-target rendering, the export/live section arms, the 320px reflow gate, the token-fidelity audit, and the fidelity-review CLI — the app's composition root over the shared package's orchestrator). The shared core comes from [`@oaknational/fidelity-review`](../../packages/libs/fidelity-review/README.md) — its README's §Modules is the authoritative list. Strict TypeScript run via the `tool:*` package scripts, e.g. `pnpm --filter @oaknational/oak-curriculum-hub tool:fidelity`. |
| `fidelity-register.json`                  | **Tracked disposition register** — every export↔demo divergence the fidelity review surfaces gets a recorded judgment (`fix` / `deliberate` / `investigate` / `matched` / `superseded`) with evidence and rationale. Read by `tool:fidelity`; the seed of the ingestion pipeline's divergence register.                                                                                                                                                                                                                                                              |
| `claude-design-canonical-export/`         | **Untracked vendor reference** — the Claude Design canonical export this app visual-matches; its `_ds/*` token files are also the authority the token-fidelity audit reads. Generated vendor output with non-openly-licensed Oak brand assets; deliberately outside git (see `.gitignore`). Re-obtain a fresh copy via the claude-design MCP (`mcp__claude-design__*` — list the project, read its files) or a Claude Design export download.                                                                                                                        |
| `demo-evidence/`                          | **Untracked, regenerable output** — visual-fidelity captures, the fidelity report (`fidelity-report/index.html` — side-by-side export \| live \| diff per pair with dispositions), and audit results produced by `tools/`; recreate on demand with `tool:fidelity`.                                                                                                                                                                                                                                                                                                  |

## Quick start

```bash
pnpm install                                        # from the monorepo root
cp .env.example .env.local                          # in this directory; fill in the values below
pnpm -C demos/oak-curriculum-hub dev   # http://localhost:3010
```

Required env: `ELASTICSEARCH_URL`, `ELASTICSEARCH_API_KEY`, `OAK_API_KEY`,
`SEARCH_INDEX_TARGET` (optional `SEARCH_INDEX_VERSION`). Without credentials
the app still boots — the search route returns `503` and the UI shows a
"search backend not configured" state.

### Dev-server discipline (hard-won; all verified in-repo)

- **`next dev` daemonises when its wrapper detaches** — killing the wrapper
  task leaves the server listening as an orphan. After ANY teardown, verify
  the port actually released: `lsof -iTCP:3010 -sTCP:LISTEN`. Prefer the
  attached pipe form for session-scoped servers.
- **Stale `.next/types` after a teardown race breaks the ESTATE type-check**
  (`.next/types/validator.ts` referencing a missing module) — the gitignored
  build output is an input to the pre-push turbo type-check. Regenerate via
  `pnpm --filter @oaknational/oak-curriculum-hub build`; never delete.
- **Captures**: any check against a progressively-enhanced page must pin
  which enhancement state it measures — the `hydration-state-pinning`
  pattern in `.agent/memory/active/patterns/` is CANONICAL for the full
  gotcha list. The two you will hit first: use `localhost`, not
  `127.0.0.1` (the latter never hydrates here), and wait on
  `domcontentloaded`, never `networkidle` (the HMR websocket keeps
  networkidle from firing).

## Pages

| Route                             | Content source                                                                                |
| --------------------------------- | --------------------------------------------------------------------------------------------- |
| `/`                               | Hub: two-search (live Elasticsearch + local static) and destination cards                     |
| `/course`                         | The 214-block Oak Course, generated from the canonical export, rendered as a paginated player |
| `/standards`                      | Quality-standards browse + detail (685 standards, local data)                                 |
| `/rubrics`, `/exemplars`, `/wiki` | Sections reproduced from the export                                                           |
| `/lesson/[slug]`                  | Live lesson detail: summary, quizzes, assets via the REST SDK                                 |

## The two data planes

Both backends hold secrets, so both are server-side only; the browser sees
only our own routes and server-rendered pages.

- **Discovery plane** — `GET /api/search?q=` (the only API route). The route
  handler is built by `lib/search-handler.ts` over `lib/search-core.ts` (a
  dependency-injected seam with contract tests); `lib/search-client.ts` is the
  only file that touches `@oaknational/oak-search-sdk/read`.
- **Content plane** — `lib/curriculum.ts` is the only file that touches
  `@oaknational/curriculum-sdk`. The lesson page calls it server-side
  directly; there is no `/api/lesson` route. Asset downloads link out to
  `thenational.academy` (the API's asset URL is an authenticated endpoint,
  not a browser-usable signed URL).

Local content (`lib/course/oak-course.json`, `lib/data/quality-standards.json`)
is DATA, not code: committed JSON produced from the canonical export (untracked
vendor reference — see §Structure) by re-runnable generators in `scripts/`.
The zod schemas (`lib/blocks/schema.ts`, `lib/course/schema.ts`,
`lib/quality-standards-types.ts`) are the single source of truth: the
generators validate against them before writing, and the loaders
(`lib/course/load-course.ts`, `lib/data/load-quality-standards.ts`)
re-validate the committed JSON at module initialisation. The JSON is
committed, so the app builds without the export present; re-running the
generators requires re-obtaining it. The small training-course index
(`lib/static-training-courses.ts`, 21 rows) stays a hand-vendored typed
literal.

## Licence

This demo needs no separate licence — it is covered by the repository's root licences:

- **Code** — [`LICENCE`](../../LICENCE) (MIT).
- **Oak curriculum content** (live search + lesson data, and the quality-standards data) —
  [`LICENCE-DATA.md`](../../LICENCE-DATA.md), which places curriculum content under the Open
  Government Licence v3.0. Attribution is required:
  _"Contains public sector information licensed under the Open Government Licence v3.0."_
- **Oak brand assets** (fonts, logos, token sources) — the MIT licence covers source code only
  and grants no trademark or brand rights; the asset-bearing vendor reference material is
  deliberately untracked (see §Structure), and this is Oak's own repository, so no separate
  grant is made or needed.

The root [`LICENCE`](../../LICENCE) and [`LICENCE-DATA.md`](../../LICENCE-DATA.md) are the
authoritative terms.
