# Semantic Search — Active

Executable plans currently in progress.

| Priority | Plan | Scope | Status |
|---|---|---|---|
| A0 | [unified-versioned-ingestion.plan.md](./unified-versioned-ingestion.plan.md) | Unify bulk ingestion, fix layer boundaries, enable blue/green lifecycle (ADR-130) | 🟢 Active |
| A1 | [search-sdk-args-extraction.plan.md](./search-sdk-args-extraction.plan.md) | Move param builders, scope validation, and error formatting into Search SDK | 🟡 Planning |
| A2 | [bulk-metadata-quick-wins.execution.plan.md](./bulk-metadata-quick-wins.execution.plan.md) | Boundary 03 — preserve and widen low-risk bulk lesson/unit metadata for later asset and retrieval work | 🟢 Active |
| A3 | [kg-alignment-audit.execution.plan.md](./kg-alignment-audit.execution.plan.md) | Audit measured overlap between ontology graph entities and search-facing curriculum records before broader graph integration | 🟢 Active |
| A4 | [category-integration-remediation.md](./category-integration-remediation.md) | Wire existing category supplementation infrastructure through the bulk ingestion orchestration layer | 🟡 Planning |

`unified-versioned-ingestion.plan.md` is the standalone-ready session entry for
the blue/green lifecycle integration. It supersedes the predecessor plan
and incorporates all 16 reviewer findings as planned work.

`bulk-metadata-quick-wins.execution.plan.md` is the standalone-ready session
entry for the current Boundary 03 workstream.

`kg-alignment-audit.execution.plan.md` is the standalone-ready session entry
for the first ontology/search graph-enablement workstream.

## Reference Documents

- [bulk-downloads-data-gaps.md](./bulk-downloads-data-gaps.md) — bulk download enhancement requests for the API team

## Archived

- [blue-green-reindex.execution.plan.md](../archive/completed/blue-green-reindex.execution.plan.md) — superseded by `unified-versioned-ingestion.plan.md`; retained for root cause analysis and completed prerequisites

Next queue: [current/README.md](../current/README.md)
Strategic backlog: [future/README.md](../future/README.md)
