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

## Goals

- Deliver a high‑quality search experience that supports **teachers’ natural language** queries and **structured filters** (subject, keyStage, minimum lessons) with reliable highlights.
- Keep the **source of truth** as the Oak Curriculum API via the **Oak Curriculum SDK**; no raw HTTP.
- Use **Elasticsearch Serverless** with:
  - `oak_lessons` (full transcript + `lesson_semantic`),
  - `oak_units` (unit metadata),
  - `oak_unit_rollup` (short per‑lesson passages + `unit_semantic`).
- Provide **two search endpoints**:
  - **Structured:** `POST /api/search` (LLM‑free, deterministic),
  - **Natural language:** `POST /api/search/nl` (LLM optional; returns 501 if disabled).
- Publish an **auto‑generated OpenAPI schema** for all non‑SDK passthrough endpoints; use it to expose **MCP tools** (and optional prompt helpers).
- Ship a minimal **UI** to demo structured vs NL search, with an **Admin** page to trigger indexing and rollups.
- Apply **Oak Components** + theming to “Oakify” the UI.

---

## Current status (at a glance)

- Workspace: `apps/oak-open-curriculum-semantic-search` (Next.js 15, React 19, TS strict)
- Implemented:
  - Elasticsearch Serverless scripts: synonyms + three indices mappings
  - API routes: `/api/search` (structured), `/api/search/nl` (NL, LLM optional), `/api/index-oak`, `/api/rebuild-rollup`, SDK parity routes
  - OpenAPI: `/api/openapi.json` with Redoc UI at `/api/docs`
  - Core search logic refactored into `src/lib/hybrid-search/` module:
    - `index.ts` orchestrator, `lessons.ts`, `units.ts`, `types.ts`; shim re-export at `src/lib/run-hybrid-search.ts`
  - OpenAPI registrations split to `src/lib/openapi.register.ts`; `src/lib/openapi.ts` simplified, avoids unsafe assertions
  - Type-aware linting enabled; SDK parity routes validate bodies with Zod
  - Official Elasticsearch client types adopted; removed custom generic shapes
  - TS path aliases removed; imports are relative (incl. Vitest)
  - Type-check configured for App Router: `tsconfig.lint.json` uses `jsx: react-jsx` and includes DOM libs
- UI/Health: Canonical search page at `/` with shared header (logo home link, nav links, theme selector); theme SSR hint via cookie + early script; Styled Components SSR wired; `/healthz` reports ES/SDK/LLM with correct status codes
- Admin: New `/admin` page to run ES setup, indexing, and rollup with streaming output
- Tests: basic RRF unit test exists; hybrid-search and OpenAPI tests pending
- Build status: Monorepo builds succeed for packages; Next.js workspace fails the build on strict ESLint violations (in-progress fixes)
- Rebase: Completed onto `origin/main` (conflicts resolved; types/tools regenerated)

---

## Merge strategy: Rebase

Status: Completed. `feat/semantic_search` is rebased onto `origin/main` and aligned with SDK/MCP changes. Lockfile was re-resolved via `pnpm i`. Resolved hotspots included ESLint configs, SDK typegen outputs, response mapping, `turbo.json`, and workspace wiring.

---

## Near‑term priorities (ranked)

0. Resolve linting issues in the semantic search app per `/.agent/directives-and-memory/rules.md` and `/docs/agent-guidance/typescript-practice.md`
1. Resolve all other quality gates to the highest possible standards (install → type-gen → build → type-check → lint → docs:all → format → markdownlint → test → test:e2e) until green
2. Commit and push the branch; then review and plan next steps
3. Add unit tests for `hybrid-search/{lessons,units}.ts` (fusion, filters, highlights, rollup fallback) and OpenAPI builder
4. Vercel deploy + environment wiring + smoke `/api/docs` and `/api/search`
5. Oakify the UI using Oak Components (retain Structured/NL tabs; strong a11y)
6. MCP exposure from OpenAPI (non‑admin tools by default)

---

## Deliverables

1. **Indices & mappings** (serverless): scripts to create/update synonyms and mappings (`scripts/setup.sh`).
2. **Indexing routes**: `GET /api/index-oak`, `GET /api/rebuild-rollup` (admin‑guarded via `x-api-key`).
3. **Search routes**: `POST /api/search` (structured) and `POST /api/search/nl` (natural language).
4. **SDK parity routes**: `POST /api/sdk/search-lessons`, `POST /api/sdk/search-transcripts`.
5. **OpenAPI schema**: `GET /api/openapi.json` generated from Zod schemas; optional `/docs` UI.
6. **MCP tools**: tool manifest generated from OpenAPI (search structured, search NL, index, rollup; admin tools off by default).
7. **UI pages**: `/search` (demo), `/admin` (index/rollup/status), with Oak Components & theming.
8. **Docs**: updated `docs/SETUP.md`, `docs/ARCHITECTURE.md`, `docs/ROLLUP.md`, plus a short MCP/OpenAPI guide.
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
  - `pnpm -F @oaknational/oak-curriculum-sdk docs:all`
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
  - Extend the repo’s base `eslint.config.base.ts` and top-level `eslint.config.ts`
  - Preserve Next.js and React rules via `next` plugin/presets; do not relax repo standards
  - Adopt architectural boundary rules enforced by `eslint-rules/`
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

## Acceptance Criteria

- **Serverless ES ready**: three indices exist with configured analyzers, `semantic_text` fields, and synonyms; smoke query succeeds.
- **Indexing works end‑to‑end**: calling `/api/index-oak` + `/api/rebuild-rollup` populates ES; no duplicate explosion; reasonable doc counts.
- **Hybrid search**: for representative queries, BM25 + semantic results are fused via RRF; snippets are present; code resides in `src/lib/hybrid-search/` with tests.
- **LLM optionality**: `/api/search`; `/api/search/nl` returns 501 if LLM disabled, otherwise produces sensible structured queries.
- **OpenAPI**: `/api/openapi.json` reflects all public endpoints and schemas; valid under an OpenAPI validator.
- **MCP**: tools can be loaded from OpenAPI; non‑admin tools enabled by default; admin tools require explicit opt‑in.
- **UI**: a basic Oak‑styled page demonstrates both search modes; admin page can trigger indexing/rollups with feedback.

---

## Security

- Admin routes require header `x-api-key: ${SEARCH_API_KEY}`; rate‑limit externally if exposed beyond a private network.
- Only server code reads sensitive env vars. Natural‑language search is disabled unless `AI_PROVIDER=openai` and `OPENAI_API_KEY` are set.
- No raw HTTP calls to Oak: the official SDK is the single access path.

---

## Implementation Plan (Phased)

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

- Test NL search (if LLM enabled):

```bash
curl -X POST http://localhost:3000/api/search/nl \
  -H 'content-type: application/json' \
  -d '{ "q":"ks4 geography units about mountains with at least 3 lessons" }'
```

- Add basic tests (Vitest) for: query struct validation, RRF fusion determinism, highlight presence.

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

## Dependencies and Notes

- Align with repository rules for **strict typing**, validation, and test isolation; no `any`.
- Prefer **SDK types/guards** for subject/keyStage validation.
- Keep LLM usage limited to **NL parsing** (optional); structured endpoint must not require LLM.
- Maintain idempotent index scripts; synonyms are updatable; prefer aliasing for future blue/green swaps.

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
