---
name: "Search contract follow-up (lessons threadSlug + optional prod smoke)"
overview: >
  Add a lessons field-integrity test mirroring the sequence category contract,
  and document an optional production search smoke procedure that is not part
  of the standard CI suite.
todos:
  - id: lesson-threadslug-field-integrity
    content: "Add oak-search-sdk field-integrity test: threadSlug → term(thread_slugs) aligned with SEARCH_FIELD_INVENTORY (lessons)."
    status: pending
  - id: optional-prod-smoke-artefacts
    content: "Add documented optional prod smoke (queries/matrix + how to run); wire optional package script; exclude from default CI."
    status: pending
---

# Search contract follow-up

**Status**: 🔴 EXECUTING via [pre-reingest-remediation.execution.plan.md](../active/pre-reingest-remediation.execution.plan.md) (promoted to pre-reingest blocking 2026-03-22)
**Depends on**: Work items consolidated into the active remediation plan; this document serves as the source specification for S4/S5

## Why this exists

Ingest and retrieval already validate many contracts via `@oaknational/search-contracts`, indexing integration tests, and `search-field-integrity.integration.test.ts` (sequences `category` ↔ `category_titles`). Two gaps remain:

1. **Symmetry**: Lessons do not yet have a **field-integrity** test that pins `threadSlug` → `term` on `thread_slugs` to the inventory entry (mapping `keyword`, same pattern as sequence category).
2. **Production smoke**: Operators need a **repeatable, documented** way to sanity-check search correctness against **live** Elasticsearch after promote — without adding flaky or secret-dependent steps to **standard CI**.

## Task 1 — Lessons `threadSlug` field-integrity test

**Goal**: One integration test in `packages/sdks/oak-search-sdk/src/retrieval/` that:

- Builds a **lesson** search request with `threadSlug` set (and minimal other params), using the same mock-search pattern as `search-field-integrity.integration.test.ts`.
- Asserts the filter includes `{ term: { thread_slugs: '<slug>' } }` (or the bool-wrapped form consistent with `buildFourWayRetriever`).
- Asserts `SEARCH_FIELD_INVENTORY` has the `lessons` / `thread_slugs` entry and that `mappingType` matches expectations (`keyword`).

**Implementation note**: `searchLessons` lives in `create-retrieval-service.ts`; either extract a testable helper or assert on captured `EsSearchRequest` from a thin wrapper — mirror the existing field-integrity test style (not the exact ES query/mapping semantics, since lessons use `term` on `keyword` while sequences use `match_phrase` on `text`).

**Quality gates**: Normal package gates (`pnpm test` in `oak-search-sdk`); **is** part of standard CI once merged.

## Task 2 — Optional production search smoke (documented, not default CI)

**Goal**: A **human- or scheduled-job-runnable** smoke path that validates “prod search behaves” using real credentials / MCP / HTTP — **not** `pnpm test`.

### Deliverables

1. **Documentation** — canonical home is
   [`apps/oak-search-cli/docs/INDEXING.md`](../../../../apps/oak-search-cli/docs/INDEXING.md)
   (add a short *Optional production search smoke* section). Session prompts and
   plans may link to it but must not duplicate the procedure.

   The doc must include:
   - **Prerequisites** (e.g. prod MCP enabled, or `ELASTICSEARCH_*` / Oak API as applicable — follow whatever the repo already documents for prod operators).
   - **Query matrix**: at minimum F1/F2 reproduction JSON from the findings register (lessons `threadSlug`, sequences `category` nonsense → zero hits after good ingest), plus one baseline per scope if useful.
   - **Interpretation**: remind readers that SDK `total` may reflect **page length**, not ES `hits.total`; prefer comparing result IDs or using queries designed to prove narrowing.
   - **Explicit exclusion**: “This procedure is **not** part of `pnpm test` or the default GitHub Actions workflow.”

2. **Optional package script** (e.g. `pnpm smoke:prod:search` at repo root or under `apps/oak-search-cli`):
   - May shell out to MCP, `curl`, or a small `tsx` script — **must not** run in default CI.
   - If added to `package.json`, document that CI workflows **do not** invoke it (no change to `.github/workflows/*` required beyond verifying the new script is absent from required jobs).

### Acceptance criteria

- [ ] Doc exists and is linked from `semantic-search` active README or F2 plan “supporting documents”.
- [ ] No new required CI step; optional script is clearly labeled in `package.json` `scripts` comment or adjacent README.

## Relationship to other artefacts

- **Findings register**: [search-tool-prod-validation-findings-2026-03-15.md](../active/search-tool-prod-validation-findings-2026-03-15.md) — optional smoke should reference the same JSON shapes for continuity.
- **Field inventory**: `packages/libs/search-contracts` — source of truth for inventory assertions in Task 1.

## Completion

When both tasks are done: mark todos `done`, add a short line to `../active/README.md` or archive this plan under `../archive/completed/` if the team prefers a closed execution record.
