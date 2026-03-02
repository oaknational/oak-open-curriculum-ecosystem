# MOVED — See `semantic-search-ui-continuation-prompt.md`

_Last updated: 2025‑09‑14 (Europe/London)_

This file has been superseded for the UI track. Please see
`semantic-search-ui-continuation-prompt.md` for the current, cohesive UI
continuation prompt. The theming approach is formalised in ADR‑045
(`docs/architecture/architectural-decisions/045-hybrid-theming-bridge-for-oak-components.md`).

---

## TL;DR (current state)

- Workspace: `apps/oak-search-cli` (Next.js 15, React 19, TS strict)
- Search model: Hybrid retrieval (BM25 + `semantic_text`) fused via RRF.
- Indices (Elasticsearch Serverless): `oak_lessons` (transcripts + `lesson_semantic`), `oak_units` (metadata), `oak_unit_rollup` (per‑lesson passages + `unit_semantic`).
- Endpoints: `POST /api/search` (structured, LLM‑free), `POST /api/search/nl` (501 if LLM disabled); admin: `GET /api/index-oak`, `GET /api/rebuild-rollup`; SDK parity: `POST /api/sdk/search-lessons`, `POST /api/sdk/search-transcripts`.
- OpenAPI: `/api/openapi.json` and `/api/docs`.
- SDK: All data via `@oaknational/oak-curriculum-sdk`; runtime guards validate Subject/KeyStage; docs include generated types; TypeDoc hardened with `treatValidationWarningsAsErrors: true`; helper exports completed (incl. `PathGroupingKeys`); verification aligns to curated surfaces; doc‑gen green.
- ES client: Official `@elastic/elasticsearch`.
- UI/Health: Search page with header/nav/theme; SSR‑first theming in place (cookie → `data-theme-mode`, client provider, system subscription); tests cover SSR hint, system preference updates, and ThemeSelect interaction; `/healthz` covers ES/SDK/LLM.

---

## ENV (server‑side)

- `ELASTICSEARCH_URL`, `ELASTICSEARCH_API_KEY`
- `OAK_API_KEY`
- `SEARCH_API_KEY` (admin routes)
- Optional LLM: `AI_PROVIDER=openai`, `OPENAI_API_KEY`

LLM optionality: `/api/search` never requires OpenAI. `/api/search/nl` returns `{ error: "LLM_DISABLED" }` with 501 when off.

---

## Files of interest

- Indexing & search: `app/api/index-oak/route.ts`, `app/api/rebuild-rollup/route.ts`, `src/lib/hybrid-search/{index,lessons,units,types}.ts`, `src/lib/run-hybrid-search.ts`, `app/api/search/route.ts`, `app/api/search/nl/route.ts`, `src/lib/query-parser.ts`, `src/lib/elastic-http.ts`, `src/lib/es-client.ts`, `src/lib/rrf.ts`, `src/adapters/{oak-adapter-sdk,sdk-guards}.ts`.
- OpenAPI: `src/lib/openapi.ts`, `src/lib/openapi.register.ts`, `app/api/openapi.json/route.ts`, `app/api/docs/page.tsx`.
- Docs: `docs/SETUP.md`, `docs/ARCHITECTURE.md`, `docs/ROLLUP.md`, `docs/SDK-ENDPOINTS.md`.

---

## Rebase status

Completed. Rebased `feat/semantic_search` onto remote; resolved generated‑doc conflicts by deletion/regeneration; outdated remote approach superseded; pushed successfully.

---

## Immediate next tasks

- SDK docs: TSDoc pass across curated API surfaces; maintain zero‑warning baseline.
- Search workspace: finish authored docs (README, Onboarding, Quick Start, Troubleshooting, Reuse guide) and TSDoc across adapters/lib/routes/UI.
- Tests: add hybrid‑search fusion/filter/highlight tests; add OpenAPI builder tests.
- Ops: Vercel deploy plan and env wiring; smoke `/api/docs` and `/api/search`.

---

## Invariants / non‑negotiables

- **SDK‑first**: All Oak data via `@oaknational/oak-curriculum-sdk`
- **Strict typing**: Zod + SDK guards; avoid unsafe assertions
- **No transcript duplication** in units: use rollup index
- **Security**: Admin endpoints guarded by `x-api-key`

---

## Handy commands

- Create indices (serverless):
  - `ELASTICSEARCH_URL=… ELASTICSEARCH_API_KEY=… pnpm -C apps/oak-search-cli run elastic:setup`
- Index + rollup:
  - `curl -H "x-api-key: $SEARCH_API_KEY" http://localhost:3000/api/index-oak`
  - `curl -H "x-api-key: $SEARCH_API_KEY" http://localhost:3000/api/rebuild-rollup`
- OpenAPI & docs: schema `/api/openapi.json`, UI `/api/docs`.
- Docs (root): `pnpm docs` runs docs across workspaces.
- Root doc generation: `pnpm doc-gen` runs doc generation across relevant workspaces.
- SDK docs: `pnpm -F @oaknational/oak-curriculum-sdk doc-gen`.
- Search docs: `pnpm -C apps/oak-search-cli doc-gen`.

---

## Preserved context & decisions

- Import strategy: Search workspace imports the SDK via package root (built dist) for consistency
  with other workspaces and hassle-free Next.js builds. Dev-time source imports can be restored later
  via a controlled alias and `transpilePackages` if needed.
- Logger strategy: `@oaknational/mcp-logger` ships a bundled runtime entry while keeping
  extensionless source imports for app builds; avoids ESM resolution issues in tests/child processes
  and compiles cleanly in Next.
- Notion e2e: use shared `@oaknational/mcp-env` `loadRootEnv` to find repo root and load `.env`.
- SDK docs pipeline: generated types included. A sanitiser copies sources into `packages/sdks/oak-curriculum-sdk/docs/_typedoc_src` and removes problematic JSDoc tags before TypeDoc runs. Entry points for generated `paths` and `path-parameters` are explicitly included in TypeDoc configs.
- Remaining TypeDoc warnings: Currently from generated helper symbols (e.g. MCP tool param aliases). Target: zero warnings by either documenting a minimal set of helpers or excluding non-exported internals from verification while retaining real, browsable docs.
- Testing policy: No real network calls in unit/integration tests. Stub SDK/ES calls. End-to-end tests should only exercise STDIO.
- UI/Accessibility: Keep high-contrast, legible defaults; prefer semantic HTML and labelled controls; preserve keyboard navigation.
- Security: Admin routes require `x-api-key`; never expose admin MCP tools by default.

---

## Next steps (short)

1. SDK docs: zero warnings; commit.
2. Search docs: author README, Onboarding, Quick Start, Troubleshooting; commit. (Docs structure clarified; doc-gen implemented.)
3. TSDoc pass across adapters, lib, routes, UI; commit.
4. Full quality gate from repo root; fix regressions; commit.
5. Consider factoring a shared docs‑pipeline in `packages/libs/docs-pipeline`; adopt in SDK and Search.

- Search examples:
  - Structured: `POST /api/search` with `{ scope, text, subject, keyStage, minLessons }`
  - NL: `POST /api/search/nl` with `{ q }`
