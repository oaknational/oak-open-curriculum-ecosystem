# Next-Session Record — `oak-kg-ontology-planning-review` thread

> **DEEP REVIEW COMPLETE · DECISIONS RATIFIED · ESTATE CLEANED — 2026-06-04**
> (Tempestuous Vaulting Gust / `d61788`, claude / Opus 4.8, owner-directed). The deep review of the
> Oak Curriculum Ontology + our estate is done; six owner decisions ratified; the KG/ontology plan
> estate de-cluttered from 22 live surfaces to 10. Authoritative synthesis:
> [`oak-kg-ontology-deep-review-2026-06-04.md`](../../../reports/oak-kg-ontology-deep-review-2026-06-04.md).

## Ratified decisions (owner, 2026-06-04)

1. **Threads first** — build the ontology thread surface (`onto-threads`), a tool **distinct** from the
   bulk-derived thread tooling (`bulk-threads`); not forced to match; combine later.
2. **Serving = TTL → substrate** (live `graph-ingest` Turtle path; ADR-173 **Accepted**).
3. **Cross-source lesson/unit deferred** — verified (OpenAPI spec + bulk export + ontology): no shared
   identity key exists publicly. Only the **thread** join works (content-slug both sides).
4. **Bulk and ontology stay separate / complementary.**
5. **Integration = pinned release-download** of the ontology TTL.
6. **Source-prefix naming convention** (ADR-157, amended): `onto-*`, `bulk-*`, `oakapi-*`,
   `oaksearch-*`, `eef-*` mark **source only**; NC is authority/content metadata, never a prefix.
   **Migrated incrementally** — existing names keep until next touched.

## Next safe step (the fresh session's first move)

1. **Start-right**, then read the deep-review report (it carries the grounded facts — do not re-derive).
2. **Author the `onto-threads` executable plan** (`/oak-plan`): build the `graph-corpus-sdk` Oak
   Curriculum Ontology Threads adapter (`curric:Thread` + `curric:includesThread` inverse edge) over a
   **pinned TTL release**, then the `onto-threads` resource + `onto-get-thread-content` tool (onto-*
   convention; supersedes the old `oak-kg-*` names). Surface per ADR-179. The real blocker is the
   missing Threads adapter (graph-stack WS4.2), not EEF.
3. **Incremental hygiene** (not blocking, owner sanctioned "don't change everything at once"):
   graph-estate-consolidation **t8** owns link-reconciliation for the ~23 referrers to the archived
   plans; three surviving plans have light reshape pending (oak-kg-threads-surface dead spine-ref;
   nc-knowledge-taxonomy-surface ADR-173 ingest-path note; extending-graph-support-tooling `c5`
   onto/bulk-threads split).

## Estate state after cleanup (2026-06-04)

Live KG/ontology surfaces (10): `current/graph-estate-consolidation`; `active/graph-stack` +
`agent-guidance-consolidation`; `future/oak-kg-threads-surface` (lead), `nc-knowledge-taxonomy-surface`,
`cross-source-journeys`, `oak-misconceptions-graph-features`, `graph-tools-value-redesign`,
`extending-graph-support-tooling`; `README`. Archived 2026-06-04 (graph-estate-consolidation t9):
8 superseded/complete plans + 4 consolidated oak-kg stubs (→ README backlog). The 4 empty oak-kg
surface stubs now live as a forward backlog in the README, not per-surface files.

## Blockers / external dependencies

- **Slug bridge — owner-raised, not gating.** Lesson/unit cross-source needs an upstream ontology
  `curric:slug` property (the ontology generates its data upstream; we consume, we cannot add it). The
  owner is asking the ontology team where to make the change. This does **not** gate `onto-threads` or
  any current work. If/when the slug ships, lesson/unit cross-source unblocks (promotion trigger in the
  README).
- Ontology is **v0.1, unstable** — design to the coupling constraints in the report (depend on the
  structural model + `oakcurric:` numeric IRIs; never on `natcurric:` label-IRIs or data completeness).

## Scope guardrails

- Review + planning context; the next step authors a plan, not the implementation itself.
- **Separate from** the bulk-derived `graph-tools-value-redesign` (parked behind EEF D6+D7) — do not
  expand it or fold the two concerns together.
- The six decisions above are ratified and may be built against.

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| `Twilit Cascading Supernova` | `claude` | `Opus 4.8` | `bb53a9` | `thread-opener-brief-only` | 2026-06-04 | 2026-06-04 |
| `Tempestuous Vaulting Gust` | `claude` | `Opus 4.8` | `d61788` | `deep-reviewer + estate-cleanup` | 2026-06-04 | 2026-06-04 |
