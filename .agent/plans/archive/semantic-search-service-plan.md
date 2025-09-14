# Archived: Semantic Search Service Plan (Implementation)

This document has been superseded and split into:

- `semantic-search-api-plan.md`
- `semantic-search-ui-plan.md`
- `semantic-search-documentation-plan.md`

The original contents follow for historical reference.

---

```1:452:.agent/plans/semantic-search-service-plan.md
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
- Search docs: Authored docs updated (`SETUP.md`, `ARCHITECTURE.md`, `ROLLUP.md`, `SDK-ENDPOINTS.md`);
  docs structure clarified (authored vs generated); workspace `doc-gen` verified green.

---

## Near‑term priorities (ranked)

### Immediate next tasks

1. SDK docs: reach zero warnings and enforce a baseline in CI. Focus: verify clean runs after
   exports/bridges; finish TSDoc on curated API surfaces.
2. Documentation excellence (Search workspace): complete README; thorough TSDoc on adapters, lib, routes, UI; author Onboarding, Quick Start, Troubleshooting; draft Reuse guide (REST vs GraphQL adapters). Status: README and authored docs updated; docs structure clarified; `doc-gen` implemented and green.
3. Resolve all quality gates at the repo root `pnpm qg`.
4. Add tests for `hybrid-search/{lessons,units}.ts` (fusion, filters, highlights, rollup fallback) and OpenAPI builder.

### Follow‑on tasks

5. Vercel deploy + environment wiring + smoke `/api/docs` and `/api/search`.
6. Oak‑ify the UI using Oak Components (retain Structured/NL tabs; strong accessibility).
7. MCP exposure from OpenAPI for the two search endpoints only (admin endpoints stay excluded by default).

---

## Theming and accessibility (Next.js App Router + styled‑components)

... existing code ...
```
