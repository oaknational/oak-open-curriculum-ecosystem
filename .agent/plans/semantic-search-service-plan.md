# Semantic Search Service Plan (Implementation)

Role: This is the detailed implementation plan for the Semantic Search App/API. It translates the strategic direction in `high-level-plan.md` into concrete phases, tasks, and acceptance criteria, and tracks current status and next priorities. It pairs with the living context file `semantic-search-service-continuation-prompt.md` which preserves day‑to‑day working context.

Scope: Design and implement a **hybrid lexical + semantic search service** for the Oak Open Curriculum that complements the API’s current search endpoints. The service indexes Oak content into **Elasticsearch Serverless**, exposes **structured** and **natural‑language** search endpoints, and provides admin tooling and a small demo UI.

> The original goals (MCP alignment, SDK rigour, strict typing) remain first‑class.

Note: all workspaces must have cohesive and consistent tooling configuration.

---

## Document relationships

- Strategic direction: `high-level-plan.md` (item 3)
- Implementation detail and tracking: this plan
- Living context for rapid restart: `semantic-search-service-continuation-prompt.md`

---

## Objectives

- Deliver a high‑quality search experience supporting natural‑language queries and structured filters (subject, keyStage, minimum lessons) with reliable highlights.
- Keep the Oak Curriculum API as the single source of truth via the official SDK; never call raw HTTP.
- Use Elasticsearch Serverless with three indices: `oak_lessons` (full transcripts + `lesson_semantic`), `oak_units` (unit metadata), `oak_unit_rollup` (short per‑lesson passages + `unit_semantic`).
- Provide two endpoints: `POST /api/search` (structured, LLM‑free) and `POST /api/search/nl` (LLM optional; returns 501 if disabled).
- Publish an auto‑generated OpenAPI schema for public, non‑admin endpoints; expose corresponding MCP tools.
- Ship a minimal demo UI and an Admin page (index/rollup), and later apply Oak Components with strong accessibility.

---

## Current status (at a glance)

- Workspace: `apps/oak-open-curriculum-semantic-search` (Next.js 15, React 19, TS strict)
- Implemented: ES setup scripts; `/api/search`, `/api/search/nl`, `/api/index-oak`, `/api/rebuild-rollup` and SDK‑parity routes; OpenAPI at `/api/openapi.json` with `/api/docs` UI; core hybrid‑search module (`src/lib/hybrid-search/*`); OpenAPI registration split; strict linting with Zod validation; official ES types; relative imports; App Router type‑check config.
- UI/Health: Search page with shared header/theme; Styled Components SSR; `/healthz` covers ES/SDK/LLM.
- Admin: `/admin` for ES setup, indexing, rollup with streaming output.
- Tests: theming unit/integration added (SSR cookie hint, system subscription, ThemeSelect
  interaction); basic RRF present; hybrid‑search and OpenAPI tests pending.
- Build: Workspaces build; Next app imports SDK dist; ESLint issues addressed in UI.
- SDK docs: TypeDoc hardened (`treatValidationWarningsAsErrors: true`); suppression removed; helper
  type exports completed (incl. `PathGroupingKeys`); curated entry points retained; verification
  derives expected Markdown pages from the generated index to match curated surfaces. Root `doc-gen`
  runs docs across workspaces; SDK and Search doc‑gen are green.
- Rebase: Completed onto `origin/feat/semantic_search`; resolved conflicts by removing/regenerating
  generated docs; branch pushed.
- Search docs: Authored docs updated (`SETUP.md`, `ARCHITECTURE.md`, `ROLLUP.md`, `SDK-ENDPOINTS.md`);
  docs structure clarified (authored vs generated); workspace `doc-gen` verified green.

---

## Near‑term priorities (ranked)

### Immediate next tasks

1. SDK docs: reach zero warnings and enforce a baseline in CI. Focus: verify clean runs after
   exports/bridges; finish TSDoc on curated API surfaces.
2. Documentation excellence (Search workspace): complete README; thorough TSDoc on adapters, lib, routes, UI; author Onboarding, Quick Start, Troubleshooting; draft Reuse guide (REST vs GraphQL adapters). Status: README and authored docs updated; docs structure clarified; `doc-gen` implemented and green.
3. Resolve all quality gates at the repo root (install → type‑gen → build → type‑check → lint →
   doc-gen → format → markdownlint → test → test:e2e).
4. Add tests for `hybrid-search/{lessons,units}.ts` (fusion, filters, highlights, rollup fallback) and OpenAPI builder.

### Follow‑on tasks

5. Vercel deploy + environment wiring + smoke `/api/docs` and `/api/search`.
6. Oak‑ify the UI using Oak Components (retain Structured/NL tabs; strong accessibility).
7. MCP exposure from OpenAPI for the two search endpoints only (admin endpoints stay excluded by default).

---

## Theming and accessibility (Next.js App Router + styled‑components)

Comparison to current state

- Current: `app/lib/Providers.tsx` uses `OakThemeProvider`/`OakGlobalStyle` with `oakDefaultTheme`
  only; `app/ui/useThemeMode.ts` mutates `document.documentElement.dataset` and persists
  preferences client‑side; `ThemeSelect.tsx` calls the client hook.
- Target: keep `OakThemeProvider` at the root, select `oakLightTheme`/`oakDarkTheme` from a typed
  ThemeContext, and hydrate with a server‑read cookie so the very first render matches the theme,
  avoiding flicker and hydration issues.

Approach

- Base theme: use `@oaknational/oak-components` `OakThemeProvider` + `OakGlobalStyle`.
- Dark mode: if Oak Components exposes a dark theme, adopt it. Otherwise derive an `oakDarkTheme`
  by deep‑merging palette/semantic colours while leaving spacing/typography/breakpoints intact.
  Keep tokens centralised in `app/ui/theme/{tokens,light,dark}.ts` with strong typing.
- Provider: create a Client Provider (under App Router) that exposes ThemeContext and renders
  `OakThemeProvider` with either `oakLightTheme` or `oakDarkTheme`.
- SSR: in `app/layout.tsx` (server), read the theme cookie via `cookies()` and pass the initial
  mode to the provider so the first client paint already matches the chosen theme (or system).
  No ad‑hoc DOM writes for theming.
- Server markup: set `data-theme-mode` on `<html>` from the cookie so server markup and hydration
  match without an inline script; CSS always includes both themes.
- System mode: if no stored preference exists, default to `system` and compute from
  `prefers-color-scheme`.
- Persistence: write both a cookie (server hint) and `localStorage` (client convenience).
- Toggle: accessible header control (System/Light/Dark) with explicit label, `aria-pressed`, and
  clear state announcements.
- Accessibility: ensure focus outlines are visible and themed; validate colour contrast (WCAG AA);
  respect `prefers-reduced-motion`.

Acceptance criteria (theming)

1. UI toggle selects theme (System/Light/Dark).
2. Default is “System” when no preference exists.
3. System mode respects `prefers-color-scheme`.
4. Preference persists (cookie + localStorage) and restores.
5. Zero hydration errors and zero theme flash on first load/navigation (SSR initial mode).
6. Current theme always applied to Oak Components and custom UI.
7. Aligns with Next.js/React best practice (providers/context, no ad‑hoc DOM writes).
8. Pure unit tests: mode→theme mapping, persistence utilities.
9. Component tests: provider + toggle behaviour, SSR initialisation path.
10. WCAG AA contrast for both themes; themed focus outline.
11. `prefers-reduced-motion` respected where animations exist.
12. No inline hydration scripts; server renders correct theme via cookie + system defaults.

Application structure conventions

- `app/ui/themes/`
  - `tokens.ts` (design tokens), `light.ts`, `dark.ts` (typed Oak theme variants)
- `app/lib/theme/`
  - `ThemeContext.tsx` (client provider + mapping + persistence utils)
- `app/ui/components/`
  - `atoms/` and `molecules/` should be minimal since Oak Components provides primitives; prefer
    using Oak Components directly. Add `organisms/` for page‑level composites specific to this app.
- Tests
  - `__tests__/unit/theme/*.test.ts` for pure functions (mapping, persistence, system detection)
  - `__tests__/components/theme/*.test.tsx` for provider/SSR/toggle behaviour (React Testing Library)

References

- styled-components Theming: https://styled-components.com/docs/advanced#theming
- Next.js providers (App Router): https://nextjs.org/docs/app/getting-started/server-and-client-components#context-providers
- React Context usage: https://react.dev/reference/react/useContext#usage
- Oak Components: https://components.thenational.academy/?path=/docs/introduction--docs

---

## Documentation work (teaching & reuse focus)

Objectives

- Teach hybrid search with Elasticsearch Serverless and the Oak SDK clearly and concisely.
- Favour reusability of patterns across products, including a future GraphQL/Hasura backend.

Scope and deliverables

- README: purpose, architecture overview, structured vs NL flows, screenshots.
- Quick Start: env, dev server, index/rollup, sample queries; link to API docs.
- Admin guidance: `x-api-key` safeguards, `/healthz`.
- TSDoc pass on: `src/lib/hybrid-search/*`, `src/lib/openapi*`, `src/adapters/*`, `app/api/*`, `app/ui/*`.
- Generated docs: `doc-gen` implemented mirroring the SDK (TypeDoc HTML + JSON).
- Onboarding and Troubleshooting: ES auth/indices, LLM disabled behaviour, Next/SDK integration, common errors.
- Reuse guide: componentise search flows; outline REST vs GraphQL/Hasura variations and adapter seams; document rollup strategy.

Acceptance for Documentation

- README gives a newcomer enough to run, index, search, and understand architecture in ≤15 minutes
- TSDoc present on all exported functions/types in target modules; examples compile
- Generated docs build without warnings in SDK and (if added) the search workspace
- Onboarding/Quick Start/Troubleshooting cover top 10 likely issues
- Reuse guide outlines migration to alternative backends with concrete adapter seams

---

## Deliverables

1. **Indices & mappings** (serverless): scripts to create/update synonyms and mappings (`scripts/setup.sh`).
2. **Indexing routes**: `GET /api/index-oak`, `GET /api/rebuild-rollup` (admin‑guarded via `x-api-key`).
3. **Search routes**: `POST /api/search` (structured) and `POST /api/search/nl` (natural language).
4. **SDK parity routes**: `POST /api/sdk/search-lessons`, `POST /api/sdk/search-transcripts`.
5. **OpenAPI schema**: `GET /api/openapi.json` generated from Zod schemas; optional `/docs` UI.
6. **MCP tools**: tool manifest generated from OpenAPI (search structured, search NL). Admin tools are off by default.
7. **UI pages**: `/search` (demo), `/admin` (index/rollup/status), with Oak Components & theming.
8. **Docs**: updated `docs/SETUP.md`, `docs/ARCHITECTURE.md`, `docs/ROLLUP.md`, `docs/SDK-ENDPOINTS.md`, plus a short MCP/OpenAPI guide.
9. **Tests**: basic unit/integration for parsing, fusion, and endpoint validation.

---

## Quality gates (repo standard)

- Use British spelling throughout documentation and code comments.
- Always run, from repo root, in this exact order (none optional):
  - `pnpm i`
  - `pnpm type-gen`
  - `pnpm build`
  - `pnpm type-check`
  - `pnpm lint -- --fix`
  - `pnpm -F @oaknational/oak-curriculum-sdk doc-gen`
  - `pnpm -C apps/oak-open-curriculum-semantic-search doc-gen` (once added)
  - `pnpm format`
  - `pnpm markdownlint`
  - `pnpm test`
  - `pnpm test:e2e`
- After each fix, restart the sequence from the beginning to catch regressions.
- No `any`, no unsafe type assertions; validate external inputs with Zod and SDK guards.
- Keep admin endpoints guarded by `x-api-key` and never expose admin MCP tools by default.

---

## Repository integration & tooling parity

Goal: Fully integrate the workspace into the monorepo with consistent tooling and commands, while retaining Next.js/React specific lint rules where appropriate.

Tasks

- Turbo wiring
  - Ensure `turbo.json` pipelines include this workspace for `build`, `lint`, `type-check`, `test`, and `format` where applicable
  - Add appropriate `outputs` for Next.js build (`.next/**`) and cacheable tasks
- Scripts parity (workspace `package.json`)
  - Rename `typecheck` → `type-check` to match root convention
  - Ensure presence of: `dev`, `build`, `start`, `lint`, `type-check`, `format` (if used), and any `test` scripts
  - Keep Elasticsearch scripts under `run elastic:*`; document in README
- ESLint
  - Extend the repo’s base `eslint.config.base.ts` and top-level `eslint.config.ts`.
  - Preserve Next.js and React rules via `next` plugin/presets; do not relax repo standards.
  - Adopt architectural boundary rules enforced by `eslint-rules/`.
- TypeScript configs
  - Use `tsconfig.json` for build/runtime with strict options
  - Add/align `tsconfig.lint.json` so lint/type-check use the lint tsconfig per repo standard; set `jsx: react-jsx` and include DOM libs
  - Do not use TS path aliases in this workspace; use relative imports everywhere (also in Vitest)
- Prettier / formatting
  - Honour root Prettier configuration and include `format` in gates when applicable
- Docs
  - Update this plan and the workspace README to reflect root-run quality gates and consistent commands

Acceptance

- Root-run gates succeed using the full, ordered sequence listed above
- `turbo run build` includes this workspace; incremental caches work on CI and locally
- ESLint applies both repo standards and Next.js/React specific rules without conflicts

---

## Acceptance criteria

- **Serverless ES ready**: three indices exist with configured analyzers, `semantic_text` fields, and synonyms; smoke query succeeds.
- **Indexing works end‑to‑end**: calling `/api/index-oak` + `/api/rebuild-rollup` populates ES; no duplicate explosion; reasonable doc counts.
- **Hybrid search**: for representative queries, BM25 + semantic results are fused via RRF; snippets are present; code resides in `src/lib/hybrid-search/` with tests.
- **LLM optionality**: `/api/search`; `/api/search/nl` returns 501 if LLM disabled, otherwise produces sensible structured queries.
- **OpenAPI**: `/api/openapi.json` reflects all public endpoints and schemas; valid under an OpenAPI validator.
- **MCP**: tools can be loaded from OpenAPI; non‑admin tools enabled by default; admin tools require explicit opt‑in.
- **UI**: a basic Oak‑styled page demonstrates both search modes; admin page can trigger indexing/rollups with feedback.
- **Docs**: SDK and Search app docs build cleanly (zero warnings). Search app README/onboarding/quick-start/troubleshooting complete and accurate.

---

## Security

- Admin routes require header `x-api-key: ${SEARCH_API_KEY}`; rate‑limit externally if exposed beyond a private network.
- Only server code reads sensitive env vars. Natural‑language search is disabled unless `AI_PROVIDER=openai` and `OPENAI_API_KEY` are set.
- No raw HTTP calls to Oak: the official SDK is the single access path.

---

## Implementation plan (phased)

### Phase 1 — Create indices (Serverless ES)

**Tasks**

- Ensure env vars: `ELASTICSEARCH_URL`, `ELASTICSEARCH_API_KEY`.
- Run setup script to upsert synonyms and create indices (idempotent):

```bash
ELASTICSEARCH_URL=... ELASTICSEARCH_API_KEY=... \
pnpm -C apps/oak-open-curriculum-semantic-search run elastic:setup
```

- Verify:
  - `/_synonyms/oak-syns` → present (lowercase entries; analyser uses `lowercase` + `synonym_graph`).
  - `oak_lessons`, `oak_units`, `oak_unit_rollup` → mappings include `semantic_text` and `term_vector` where expected.
  - Optional: smoke queries (`_search`) for empty indices.

**Notes**

- Synonyms are case‑insensitive due to the analyser chain. Re‑PUT to update; close/open index to refresh analysers if needed.

### Phase 2 — Make service work locally & test

**Tasks**

- Fill `.env.local`:
  - Required: `ELASTICSEARCH_URL`, `ELASTICSEARCH_API_KEY`, `OAK_API_KEY`, `SEARCH_API_KEY`.
  - Optional LLM: `AI_PROVIDER=openai`, `OPENAI_API_KEY=…`; set `AI_PROVIDER=none` to disable.
- Start dev server:

```bash
pnpm -C apps/oak-open-curriculum-semantic-search dev
```

- Index + rollup:

```bash
curl -H "x-api-key: $SEARCH_API_KEY" http://localhost:3000/api/index-oak
curl -H "x-api-key: $SEARCH_API_KEY" http://localhost:3000/api/rebuild-rollup
```

- Test structured search (LLM‑free):

```bash
curl -X POST http://localhost:3000/api/search \
  -H 'content-type: application/json' \
  -d '{ "scope":"units","text":"mountains","subject":"geography","keyStage":"ks4","minLessons":3 }'
```

- Test NL search:

```bash
curl -X POST http://localhost:3000/api/search/nl \
  -H 'content-type: application/json' \
  -d '{ "q":"ks4 geography units about mountains with at least 3 lessons" }'
```

- Add tests (Vitest) for: query struct validation, RRF fusion determinism, highlight presence. Cover important edge cases.

Status: indexing/search endpoints implemented; basic RRF test present; more tests pending.

**Definition of Done**

- Local responses return results with expected shapes; highlights appear for transcripts/rollups; error codes are informative.

### Phase 3 — Host on Vercel & test remotely

**Tasks**

- Create Vercel project for the workspace (Node runtime).
- Set env vars in Vercel (Production/Preview):
  - Required: `ELASTICSEARCH_URL`, `ELASTICSEARCH_API_KEY`, `OAK_API_KEY` , `SEARCH_API_KEY`.
  - Optional: `AI_PROVIDER` (`openai`/`none`), `OPENAI_API_KEY`.
- Deploy and run:
  - Admin routes via curl with `x-api-key`.
  - `/api/search` and `/api/search/nl` smoke tests.
- Observability:
  - Enable logs; confirm ES connectivity and response times.

**Definition of Done**

- Remote index/rollup succeed; remote search returns results; latency acceptable.

Status: pending.

### Phase 4 — Basic UI page (demo)

**Tasks**

- Add `/search` page with two tabs: **Structured** and **Natural language**.
  - Structured: Subject + KeyStage selects (populated via SDK allowed values), query text, minLessons slider, size.
  - NL: single text box.
  - Results list: title, subject/keyStage, highlight snippets, badges for score/source (lex/sem fused info optional).
- Call the corresponding endpoints; handle loading/error states.

**Definition of Done**

- A non‑designer can demo: (a) KS4 Geography "mountains" units ≥3 lessons, and (b) the same via NL.

Status: pending.

### Phase 5 — MCP exposure + prompts + OpenAPI

**Tasks**

- **OpenAPI**: generate `/api/openapi.json` from Zod schemas using `@asteasolutions/zod-to-openapi`.
  - Include: `/api/search` (structured), `/api/search/nl`, `/api/sdk/search-lessons`, `/api/sdk/search-transcripts`.
  - Exclude or mark **admin** routes by default; if included, flag `x-requires-api-key`.
  - Optional: serve `/docs` using Redoc or Swagger UI for human browsing.
- **MCP tools**: derive tool definitions from `openapi.json`.
  - Expose: `searchStructured`, `searchNaturalLanguage`, `sdkSearchLessons`, `sdkSearchTranscripts`.
  - Keep `indexOak`/`rebuildRollup` tools disabled by default; enable only in trusted agents.
- **Prompt helpers** (optional): ship a few example prompts.

**Definition of Done**

- A generic MCP client can load tools from the OpenAPI and execute structured/NL search.

Status: OpenAPI implemented; MCP tool surfacing pending.

### Phase 6 — Admin page (UI)

**Tasks**

- Add `/admin` page (server‑only actions, guarded by `x-api-key` entered in a secure UI field or using an admin‑only environment).
- Actions:
  - Index now (calls `/api/index-oak`).
  - Rebuild rollup (calls `/api/rebuild-rollup`).
  - Show last run status (simple log panel or counts read back from ES).
- Optional: progress indicator (client‑side polling with timestamps).

**Definition of Done**

- An authorized operator can reindex and rebuild via UI and see basic outcomes/failures.

Status: pending.

### Phase 7 — Oak Components & theming

**Tasks**

- Install and integrate `@oaknational/oak-components`.
  - Apply theme provider at app root; follow the usage guide.
  - Replace basic UI controls with Oak Components (Tabs, Inputs, Buttons, Badges, Tables).
  - Ensure accessible labels and keyboard navigation.
- Style search results and admin controls to align with Oak design.

**Definition of Done**

- Search and Admin pages look/feel like Oak products; components pass accessibility checks.

Status: pending.

---

## Dependencies and notes

- Align with repository rules for **strict typing**, validation, and test isolation; no `any`.
- Prefer **SDK types/guards** for subject/keyStage validation.
- Keep LLM usage limited to **NL parsing** (optional); structured endpoint must not require LLM.
- Maintain idempotent index scripts; synonyms are updatable; prefer aliasing for future blue/green swaps.

### Preserved context (decisions)

- SDK import policy: package-root imports (built dist) across workspaces for consistency and reliable Next.js builds; optional dev-time source alias can be reinstated later with `transpilePackages`.
- Docs pipeline: include generated types in TypeDoc; sanitise generated JSDoc; explicitly include minimal generated entry points; enforce zero-warning baseline in CI.
- Tests: avoid network I/O; stub SDK/ES clients; end-to-end tests limited to STDIO.
- Accessibility: strong defaults; labelled inputs; keyboard navigation; avoid regressions during Oak Components introduction.

### Near‑term execution checklist

1. SDK docs: reduce warnings to zero; commit.
2. Search app docs: write README, Onboarding, Quick Start, Troubleshooting, Reuse guide; commit. Status: README and core authored docs updated; pipeline added.
3. TSDoc pass across adapters/lib/routes/UI; commit.
4. Full quality gate from repo root; fix regressions; commit.
5. Evaluate a shared `packages/libs/docs-pipeline` and, if justified, extract and adopt for SDK and Search.

### Proposal: shared docs pipeline

- Create (later) `packages/libs/docs-pipeline` with small, pure TypeScript helpers to:
  - prepare sources (sanitise JSDoc, copy curated entry points),
  - run TypeDoc (HTML/JSON),
  - render AI/Markdown outputs,
  - verify outputs (presence and zero‑warning policy).
- Replace duplicated scripts in SDK/Search with CLI wrappers from the shared library.
- Enforce a zero‑warning baseline via CI for both workspaces.

## Risks and mitigations

- Rate limits from Oak API → index in batches; jitter/backoff; add lightweight progress logs.
- Transcript size / ES payloads → keep rollup snippets ~300 chars/lesson; avoid large bulk batches.
- Serverless quirks → prefer small request bodies; test on preview deploys before demos.

## References

- High-Level Plan item 3; existing `docs/` on testing & TypeScript.
- Elasticsearch Serverless docs; semantic search (`semantic_text`), RRF guidance.
- Oak Components: npm package & Storybook.
- Project docs: `docs/SETUP.md`, `docs/ARCHITECTURE.md`, `docs/ROLLUP.md`, `docs/SDK-ENDPOINTS.md`.
- Endpoints to expose in OpenAPI/MCP: `/api/search`, `/api/search/nl`, `/api/sdk/search-lessons`, `/api/sdk/search-transcripts` (admin endpoints optional).

Links:

- Oak Components docs/Storybook: [components.thenational.academy](https://components.thenational.academy/?path=/docs/introduction--docs)
