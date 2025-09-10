# Semantic Search Service Plan (Updated)

Scope: Design and implement a **hybrid lexical + semantic search service** for the Oak Open Curriculum that complements the APIs’s current search endpoints. The service indexes Oak content into **Elasticsearch Serverless**, exposes **structured** and **natural‑language** search endpoints, and provides admin tooling and a small demo UI.

> This update preserves the intent of the placeholder plan while detailing concrete phases, deliverables, and acceptance criteria. The original goals (MCP alignment, SDK rigor, strict typing) remain first‑class.

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

## Acceptance Criteria

- **Serverless ES ready**: three indices exist with configured analyzers, `semantic_text` fields, and synonyms; smoke query succeeds.
- **Indexing works end‑to‑end**: calling `/api/index-oak` + `/api/rebuild-rollup` populates ES; no duplicate explosion; reasonable doc counts.
- **Hybrid search**: for representative queries, BM25 + semantic results are fused via RRF; snippets are present.
- **LLM optionality**: `/api/search` requires no LLM; `/api/search/nl` returns 501 if LLM disabled, otherwise produces sensible structured queries.
- **OpenAPI**: `/api/openapi.json` reflects all public endpoints and schemas; valid under an OpenAPI validator.
- **MCP**: tools can be loaded from OpenAPI; non‑admin tools enabled by default; admin tools require explicit opt‑in.
- **UI**: a basic Oak‑styled page demonstrates both search modes; admin page can trigger indexing/rollups with feedback.

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
  - `/_synonyms/oak-syns` → present (lowercase entries; analyzer uses `lowercase` + `synonym_graph`).
  - `oak_lessons`, `oak_units`, `oak_unit_rollup` → mappings include `semantic_text` and `term_vector` where expected.
  - Optional: smoke queries (`_search`) for empty indices.

**Notes**

- Synonyms are case‑insensitive due to the analyzer chain. Re‑PUT to update; close/open index to refresh analyzers if needed.

### Phase 2 — Make service work locally & test

**Tasks**

- Fill `.env.local`:
  - Required: `ELASTICSEARCH_URL`, `ELASTICSEARCH_API_KEY`, `OAK_API_KEY` (or `OAK_API_BEARER`), `SEARCH_API_KEY`.
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

**Definition of Done**

- Local responses return results with expected shapes; highlights appear for transcripts/rollups; error codes are informative.

### Phase 3 — Host on Vercel & test remotely

**Tasks**

- Create Vercel project for the workspace (Node runtime).
- Set env vars in Vercel (Production/Preview):
  - Required: `ELASTICSEARCH_URL`, `ELASTICSEARCH_API_KEY`, `OAK_API_KEY` (or `OAK_API_BEARER`), `SEARCH_API_KEY`.
  - Optional: `AI_PROVIDER` (`openai`/`none`), `OPENAI_API_KEY`.
- Deploy and run:
  - Admin routes via curl with `x-api-key`.
  - `/api/search` and `/api/search/nl` smoke tests.
- Observability:
  - Enable logs; confirm ES connectivity and response times.

**Definition of Done**

- Remote index/rollup succeed; remote search returns results; latency acceptable.

### Phase 4 — Basic UI page (demo)

**Tasks**

- Add `/search` page with two tabs: **Structured** and **Natural language**.
  - Structured: Subject + KeyStage selects (populated via SDK allowed values), query text, minLessons slider, size.
  - NL: single text box.
  - Results list: title, subject/keyStage, highlight snippets, badges for score/source (lex/sem fused info optional).
- Call the corresponding endpoints; handle loading/error states.

**Definition of Done**

- A non‑designer can demo: (a) KS4 Geography "mountains" units ≥3 lessons, and (b) the same via NL.

### Phase 5 — MCP exposure + prompts + OpenAPI

**Tasks**

- **OpenAPI**: generate `/api/openapi.json` from Zod schemas using `@asteasolutions/zod-to-openapi`.
  - Include: `/api/search` (structured), `/api/search/nl`, `/api/sdk/search-lessons`, `/api/sdk/search-transcripts`.
  - Exclude or mark **admin** routes by default; if included, flag `x-requires-api-key`.
  - Optional: serve `/docs` using Redoc or Swagger UI for human browsing.
- **MCP tools**: derive tool definitions from `openapi.json`.
  - Expose: `searchStructured`, `searchNaturalLanguage`, `sdkSearchLessons`, `sdkSearchTranscripts`.
  - Keep `indexOak`/`rebuildRollup` tools disabled by default; enable only in trusted agents.
- **Prompt helpers** (optional): ship a few example prompts (e.g., “Find KS4 Geography units with ≥3 lessons on mountains”).

**Definition of Done**

- A generic MCP client can load tools from the OpenAPI and execute structured/NL search.

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

### Phase 7 — Oak Components & theming

**Tasks**

- Install and integrate `@oaknational/oak-components`.
  - Apply theme provider at app root; follow the usage guide.
  - Replace basic UI controls with Oak Components (Tabs, Inputs, Buttons, Badges, Tables).
  - Ensure accessible labels and keyboard navigation.
- Style search results and admin controls to align with Oak design.

**Definition of Done**

- Search and Admin pages look/feel like Oak products; components pass accessibility checks.

---

## Dependencies / Notes (preserved & updated)

- Align with repository rules for **strict typing**, validation, and test isolation; no `any`.
- Prefer **SDK types/guards** for subject/keyStage validation.
- Keep LLM usage limited to **NL parsing** (optional); structured endpoint must not require LLM.
- Maintain idempotent index scripts; synonyms are updateable; prefer aliasing for future blue/green swaps.

## References (preserved + added)

- High-Level Plan item 3; existing `docs/` on testing & TypeScript.
- Elasticsearch Serverless docs; semantic search (`semantic_text`), RRF guidance.
- Oak Components: npm package & Storybook.
- Project docs: `docs/SETUP.md`, `docs/ARCHITECTURE.md`, `docs/ROLLUP.md`, `docs/SDK-ENDPOINTS.md`.
- Endpoints to expose in OpenAPI/MCP: `/api/search`, `/api/search/nl`, `/api/sdk/search-lessons`, `/api/sdk/search-transcripts` (admin endpoints optional).
