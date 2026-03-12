# Semantic Search — Active

Executable plans currently in progress.

| Priority | Plan | Scope | Status |
|---|---|---|---|
| A0 | [cli-robustness.plan.md](./cli-robustness.plan.md) | Fix CLI error handling, teardown guarantees, and process lifecycle robustness | 🔴 Active incident — metadata commit failure after versioned-ingest alias swap |
| A1 | [unified-versioned-ingestion.plan.md](./unified-versioned-ingestion.plan.md) | Unify bulk ingestion, fix layer boundaries, enable blue/green lifecycle (ADR-130) | 🟢 Active |
| A2 | [search-sdk-args-extraction.plan.md](./search-sdk-args-extraction.plan.md) | Move param builders, scope validation, and error formatting into Search SDK | 🟡 Planning |
| A3 | [bulk-metadata-quick-wins.execution.plan.md](./bulk-metadata-quick-wins.execution.plan.md) | Boundary 03 — preserve and widen low-risk bulk lesson/unit metadata for later asset and retrieval work | 🟢 Active |
| A4 | [kg-alignment-audit.execution.plan.md](./kg-alignment-audit.execution.plan.md) | Audit measured overlap between ontology graph entities and search-facing curriculum records before broader graph integration | 🟢 Active |
| A5 | [category-integration-remediation.md](./category-integration-remediation.md) | Wire existing category supplementation infrastructure through the bulk ingestion orchestration layer | 🟡 Planning |
| A6 | [search-cli-sdk-boundary-migration.execution.plan.md](./search-cli-sdk-boundary-migration.execution.plan.md) | Execute strict CLI/SDK capability boundary migration (read/admin), lint fitness enforcement, and duplication removal | ✅ Completed (retained as evidence) |

`semantic-search.prompt.md` is the standalone-ready session entry for the next
session. Follow its incident-first ordering and operator-run ingest protocol.

`bulk-metadata-quick-wins.execution.plan.md` is the standalone-ready session
entry for the current Boundary 03 workstream.

`kg-alignment-audit.execution.plan.md` is the standalone-ready session entry
for the first ontology/search graph-enablement workstream.

`cli-robustness.plan.md` is the active incident lane. Run the re-entry
checkpoint first (`admin validate-aliases`, then metadata schema/mapping
remediation path) before any archive decision.

`search-cli-sdk-boundary-migration.execution.plan.md` is retained as completed
boundary evidence. Boundary doctrine is now anchored in
[ADR-134](../../../../docs/architecture/architectural-decisions/134-search-sdk-capability-surface-boundary.md).

## Reference Documents

- [bulk_data_for_semantic_search.feature_request.md](./bulk_data_for_semantic_search.feature_request.md) — bulk download enhancement requests for the API team

## Archived

- [blue-green-reindex.execution.plan.md](../archive/completed/blue-green-reindex.execution.plan.md) — superseded by `unified-versioned-ingestion.plan.md`; retained for root cause analysis and completed prerequisites
- [short-term-pr-snagging.plan.md](../archive/completed/short-term-pr-snagging.plan.md) — complete. Archived 2026-03-11.

Next queue: [current/README.md](../current/README.md)
Strategic backlog: [future/README.md](../future/README.md)
