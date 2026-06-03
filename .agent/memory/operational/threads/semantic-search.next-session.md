# Next-Session Record — semantic-search

Thread: `semantic-search` — the search service's data foundations:
upstream-schema alignment, bulk-data sourcing, ingestion architecture, and
the schema-change minimal-adaptation arc. Record created 2026-06-03 when the
lane gained multi-session future work (PDR-027: a thread record earns
existence at multi-session scope, not before).

## Participating agent identities

| platform | model | session_id_prefix | agent_name | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| claude | Opus 4.8 | e756f7 | Moonlit Waxing Nebula | upstream-realignment-specialist | 2026-06-03 | 2026-06-03 |

## Current Continuation

- Branch: `feat/graph-tooling-tidyup` (shared working branch, unpushed —
  pushing is the owner's call).
- Invocation pointer: `start-right-quick`, then this record.
- Owning plans:
  - [`schema-change-minimal-adaptation.plan.md`](../../../plans/sdk-and-mcp-enhancements/current/schema-change-minimal-adaptation.plan.md)
    — owner-ratified ("yes to all", 2026-06-03); queued, executes after or
    parallel to EEF D4 on owner scheduling.
  - [`bulk-schema-driven-code-generation.md`](../../../plans/semantic-search/future/02-schema-authority-and-codegen/bulk-schema-driven-code-generation.md)
    — promotion APPROVED; physical move to an executable lane at its
    executing session.
  - [`schema-resilience-and-response-architecture.plan.md`](../../../plans/sdk-and-mcp-enhancements/active/schema-resilience-and-response-architecture.plan.md)
    — OQ1 SETTLED (`.strict()` everywhere stands); live scope is the
    drift-health endpoint + diagnostic extra-field failure classification.
- Completed (2026-06-03, Moonlit Waxing Nebula): the upstream sequences API
  realignment (`c924d4b3`; plan archived-pending in
  `sdk-and-mcp-enhancements/current/`), the bulk-data population feature
  request (`2b746ef9`, owner hands upstream 2026-06-04 with the
  `/api/bulk/schema` companion ask), the minimal-adaptation lane authoring
  (`dc399f3f`), ratification recording (`790fc098`), the strictness
  settlement (`23e50d9a`), and the continuity closeout (`f1de69cc`).
- Current state: estate green against the live upstream schema (every
  commit's pre-commit online codegen re-proves alignment). The search index
  CANNOT yet be built purely from bulk — `tiers`/`exam_subjects`/
  `unit_topics` come only from `getSequenceUnits` (the single remaining
  ingestion API call); bulk-only is blocked upstream on field population.
- Blockers / low-confidence areas: none in-repo. The upstream population
  request's timeline is external; when it lands, two items become
  executable (bulk-only supplementation deletion; bulk-schema-driven
  codegen with a live verification surface).
- Next safe step: owner-scheduled. When this lane next runs:
  (1) if upstream population has landed — re-run the field-population
  census, then execute the bulk-only deletion (replace-dont-bridge) and
  promote/execute the bulk-codegen plan; (2) otherwise — execute
  `schema-change-minimal-adaptation` todos in order (the two-tier Cardinal
  Rule ADR first; it is doctrine and needs owner review).
- Promotion watchlist: `bulk-schema-driven-code-generation.md` (approved,
  awaiting its executing session).
