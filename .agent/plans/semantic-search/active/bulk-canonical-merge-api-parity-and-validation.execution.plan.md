---
name: "Bulk canonical ingestion, merge correctness, API parity, and prod validation"
overview: >
  Treat bulk download JSON as the only canonical curriculum source for indexing;
  do not index subjects absent from bulk. Fix last-write-wins loss for duplicate
  lesson/unit ids via TDD merge. Decide API supplementation using an explicit bulk-vs-API
  field matrix. Validate F1/F2 and subject filters via oak-prod MCP search (read aliases).
todos:
  - id: canon-policy-adr
    content: "Document canonical-bulk policy (missing subjects = out of scope for ingest; no synthetic/API-only subjects in index)."
    status: pending
  - id: merge-lessons-red
    content: "RED: tests for merged lesson docs — same lessonSlug, multiple unitSlug rows → one doc, union unit_ids, deterministic order, conflict detection."
    status: pending
  - id: merge-lessons-green
    content: "GREEN: implement merge layer in bulk adapter before transformBulkLessonToESDoc; single index op per lesson_id."
    status: pending
  - id: merge-units-cross-file
    content: "Assess cross-file merge for same unit_id (optional scope); document or implement if multi-file single-run is required."
    status: pending
  - id: field-inventory-matrix
    content: "Author bulk schema → Search*IndexDoc field matrix; mark mapped, dropped (ADR reason), or gap."
    status: pending
  - id: api-inventory-explicit
    content: "Write explicit inventory of what Oak API supplementation provides today (KS4 context map, category map) vs bulk fields."
    status: pending
  - id: ks4-parity-spike
    content: "Spike: KS4 fields from bulk unit.tier/examBoard/examSubjects/file ks4Options vs enrichLessonDocWithKs4 from API context — parity test definition."
    status: pending
  - id: sequence-thread-naming
    content: "Decide ADR for sequence_ids vs thread slugs on units; optional SDK field additions + codegen."
    status: pending
  - id: validate-f2-pipeline
    content: "Coordinate with F2 plan: after promote, run admin validate-aliases/count and MCP search smoke (subject/thread/category)."
    status: pending
  - id: validate-mcp-f1-f2
    content: "Production validation via oak-prod MCP search tool: F1 threadSlug + F2 category queries from findings register; record evidence."
    status: pending
  - id: validate-mcp-subject-filter
    content: "Regression: subject filter narrows results — cross-check lessons/units scopes with contrasting subjects vs unfiltered."
    status: pending
  - id: refactor-docs-gates
    content: "REFACTOR: INDEXING.md, DATA-VARIANCES cross-links, TSDoc on merge; full quality gates; mine outcomes per ADR-117."
    status: pending
isProject: false
---

# Bulk canonical ingestion, merge correctness, API parity, and production validation

**Last Updated**: 2026-03-21  
**Status**: 🟡 PLANNING (executable — not started)  
**Scope**: Canonical bulk policy, elimination of ES last-write-wins data loss, explicit API role, schema/thread naming follow-up, and validation of prior fixes (including subject filtering) using production MCP search.

**Foundation alignment** (read at kickoff and each phase):

- [@.agent/directives/principles.md](../../directives/principles.md)
- [@.agent/directives/testing-strategy.md](../../directives/testing-strategy.md)
- [@.agent/directives/schema-first-execution.md](../../directives/schema-first-execution.md)

**Related active plan** (operator pipeline and F1/F2 closure — execute first where overlap):

- [f2-closure-and-p0-ingestion.execution.plan.md](./f2-closure-and-p0-ingestion.execution.plan.md)

**Findings register** (reproduction queries and evidence):

- [search-tool-prod-validation-findings-2026-03-15.md](./search-tool-prod-validation-findings-2026-03-15.md)

---

## Context

### Canonical bulk policy (authoritative)

- **Bulk JSON** (`apps/oak-search-cli/bulk-downloads/`, schema: `schema.json`) is the **canonical** curriculum source for search indexing.
- **Subjects that do not appear in bulk** (missing files or absent from the manifest) are **not indexed** — we do not fabricate or backfill subjects from the API for ingest. Gaps are **out of scope** for that ingest run unless bulk is updated upstream.
- **API supplementation** is allowed only when **specific fields or relationships** required by `Search*IndexDoc` or product contracts **cannot** be populated from bulk alone. The API must not replace bulk truth; it **augments** or **aggregates** where bulk is incomplete for those fields.

### Problem: last-write-wins is a bug

Bulk `lessons[]` is a **flattened** list: the same `lessonSlug` can appear on **multiple rows** (different `unitSlug`). The current bulk path emits **one ES document per row** with `units: [single]` and indexes with `_id: lesson_id`, so **later rows overwrite earlier rows** — **navigational and thread context is lost**. This violates “preserve ALL information” and must be fixed with **TDD** (merge before index).

### What the API gives us today (explicit)

Source: [`apps/oak-search-cli/src/adapters/api-supplementation.ts`](../../../../apps/oak-search-cli/src/adapters/api-supplementation.ts) and call sites in [`hybrid-data-source.ts`](../../../../apps/oak-search-cli/src/adapters/hybrid-data-source.ts).

| Mechanism | What it fetches | What it produces | Used for |
|-----------|------------------|------------------|----------|
| `buildKs4SupplementationContext` | `getSubjectSequences`, per-sequence `getSequenceUnits` | `UnitContextMap` — aggregated KS4 context per **unit slug** (tiers, exam boards, exam subjects, ks4 options) | `enrichLessonDocWithKs4` / `enrichUnitDocWithKs4` on bulk-generated docs |
| `fetchCategoryMapForSequences` + `buildCategoryMap` | Sequence/units API responses | `CategoryMap` — categories per unit for **`unit_topics`** when bulk categories are insufficient | Unit (and rollup) enrichment via `categoryMap` in bulk transformers |

Bulk schema **already includes** unit-level `tier`, `examBoard`, `pathway`, `examSubjects`, `categories`, and file-level `ks4Options`. **Hypothesis**: API KS4 enrichment may become **redundant** once we map bulk → `Ks4DocumentFields` with parity tests — **not proven until the spike completes**.

### Naming debt: threads vs sequences in ES

Unit documents expose `sequence_ids` but the builder fills them from **unit thread** slugs (same as `thread_slugs`). This is misleading for “programme sequence” language. Address under a small ADR or field-rename workstream after merge correctness.

---

## Non-goals (YAGNI)

- Indexing subjects or lessons that **only** exist in the API and never in bulk (contradicts canonical policy).
- Large refactors outside `oak-search-cli` / SDK contracts unless schema-first execution requires new fields.
- Replacing MCP search with CLI-only validation — both **CLI** and **MCP** evidence are valuable; MCP proves teacher-facing tool paths.

---

## Workstream A — Merge duplicate lesson rows (TDD)

### RED

- Fixture: two `Lesson` rows, same `lessonSlug`, different `unitSlug` → expect **one** `SearchLessonsIndexDoc` with **both** units in `unit_ids` / `unit_titles` / `unit_urls`, correct `unit_count`.
- Conflict case: same slug, divergent transcript or title → test encodes **fail-fast** or agreed policy (decide in implementation; default lean: fail with diagnostic).

### GREEN

- Pure merge function: `BulkDownloadFile` → grouped by `lessonSlug` → merged `CreateLessonDocParams` → `buildLessonDocument` once per slug.
- Bulk ops: one `{ index: { _id: lesson_id } }` per lesson after merge.

### REFACTOR

- Semantic summary text should reflect **all** units where required.
- Update [`apps/oak-search-cli/docs/INDEXING.md`](../../../../apps/oak-search-cli/docs/INDEXING.md): row count vs unique `lesson_id`.

**Quality gates**: See [.agent/plans/templates/components/quality-gates.md](../../templates/components/quality-gates.md) after code changes.

---

## Workstream B — Field matrix and API necessity

1. **Matrix** (spreadsheet or markdown table): each bulk `$defs` / top-level field → target index field or “not indexed”.
2. **KS4 parity spike**: compare `extractKs4DocumentFields` from **API-derived** `AggregatedUnitContext` vs **bulk-derived** mapping for the same unit slugs (deterministic fixtures).
3. **Categories**: if bulk `unit.categories` matches product needs for `unit_topics` / faceting, document **removal or optional** API category fetch.
4. **Decision**: list **residual API calls** with justification, or declare **bulk-only** for ingest with ADR update.

---

## Workstream C — Schema-first follow-ups (optional sequencing)

- Add explicit **`sequence_slug`** (or equivalent) on documents if faceting by downloadable line is required — **schema-first**: field definitions in SDK → `pnpm sdk-codegen` → reset index → re-ingest.
- Resolve **`sequence_ids` vs `thread_slugs`** naming per ADR.

---

## Workstream D — Validate previous fixes (F1, F2, subject filtering)

**Precondition**: Read aliases point at promoted versioned indexes (see F2 plan Phase 2–3). The **oak-prod MCP** `search` tool queries the same Elasticsearch **read aliases** as production search (e.g. `oak_lessons`); alias health is confirmed with `admin validate-aliases` after promote.

### D.1 — Tie to F2 closure

Complete **operator stage → validate → promote** from [f2-closure-and-p0-ingestion.execution.plan.md](./f2-closure-and-p0-ingestion.execution.plan.md) before treating MCP results as proof of new data.

### D.2 — MCP reproduction queries (from findings register)

Use tool: **`search`** on server **oak-prod** (curriculum MCP). Exact JSON payloads are in the findings register and F2 plan Task 3.1; minimum checks:

| Check | Scope | Intent |
|-------|--------|--------|
| **F1** | `lessons` | `threadSlug` filter returns `total > 0` for known maths KS2 fraction query |
| **F2** | `sequences` | Nonsense `category` returns `total = 0` (filter not no-op) |
| **Subject filter** | `lessons` / `units` | Same query with `subject: maths` vs `subject: science` → disjoint or strongly shifted slugs; `total` consistent with indexed bulk subjects |

Record **before/after** only if a before baseline still exists; post-promote, **after** is sufficient for “fix verified”.

### D.3 — CLI cross-check (optional but recommended)

```bash
pnpm tsx apps/oak-search-cli/bin/oaksearch.ts admin validate-aliases
pnpm tsx apps/oak-search-cli/bin/oaksearch.ts admin count
pnpm tsx apps/oak-search-cli/bin/oaksearch.ts search lessons "photosynthesis"
```

Align MCP outcomes with `admin count` and alias targets from F2.

---

## Risk assessment

| Risk | Mitigation |
|------|------------|
| Merge changes transcript/semantic hashing | Golden tests + conflict policy |
| KS4 bulk mapping diverges from API for edge exam-board sequences | Parity tests on representative units per ADR-080 |
| Schema rename breaks clients | Version bump + coordinated SDK release |
| MCP validation without promote tests stale aliases | Run F2 promote first; validate `targetIndex` in `validate-aliases` |

---

## Success signals

- One lesson document per `lesson_id` with **full** unit union from bulk.
- Written matrix: bulk coverage + **explicit** residual API surface (or none).
- F1/F2/subject-filter checks pass on MCP **after** promote, with evidence logged in findings register.
- Permanent docs updated (ADR / INDEXING) and plan mined per [ADR-117](../../../../docs/architecture/architectural-decisions/117-plan-templates-and-components.md).

---

## Completion

When done: extract durable behaviour to ADRs and [`apps/oak-search-cli/docs/INDEXING.md`](../../../../apps/oak-search-cli/docs/INDEXING.md); archive this plan to `archive/completed/`; update [completed-plans.md](../completed-plans.md) and [active/README.md](./README.md); run `/jc-consolidate-docs`.
