# Semantic Search — Active

Executable plans currently in progress.

| Priority | Plan | Scope | Status |
|---|---|---|---|
| A0 | [cli-robustness.plan.md](./cli-robustness.plan.md) | Fix CLI error handling, teardown guarantees, and process lifecycle robustness; re-run dry-run validation | 🟢 Active (current) |
| A1 | [unified-versioned-ingestion.plan.md](./unified-versioned-ingestion.plan.md) | Unify bulk ingestion, fix layer boundaries, enable blue/green lifecycle (ADR-130) | 🟢 Active |
| A2 | [search-sdk-args-extraction.plan.md](./search-sdk-args-extraction.plan.md) | Move param builders, scope validation, and error formatting into Search SDK | 🟡 Planning |
| A3 | [bulk-metadata-quick-wins.execution.plan.md](./bulk-metadata-quick-wins.execution.plan.md) | Boundary 03 — preserve and widen low-risk bulk lesson/unit metadata for later asset and retrieval work | 🟢 Active |
| A4 | [kg-alignment-audit.execution.plan.md](./kg-alignment-audit.execution.plan.md) | Audit measured overlap between ontology graph entities and search-facing curriculum records before broader graph integration | 🟢 Active |
| A5 | [category-integration-remediation.md](./category-integration-remediation.md) | Wire existing category supplementation infrastructure through the bulk ingestion orchestration layer | 🟡 Planning |
| A6 | [short-term-pr-snagging.plan.md](./short-term-pr-snagging.plan.md) | Immediate PR snagging pass with evidence-first item triage, blocker-first fixes, and explicit thread closure outcomes | 🟡 Planning |

`unified-versioned-ingestion.plan.md` is the standalone-ready session entry for
the blue/green lifecycle integration. It supersedes the predecessor plan
and incorporates all 16 reviewer findings as planned work.

`bulk-metadata-quick-wins.execution.plan.md` is the standalone-ready session
entry for the current Boundary 03 workstream.

`kg-alignment-audit.execution.plan.md` is the standalone-ready session entry
for the first ontology/search graph-enablement workstream.

`short-term-pr-snagging.plan.md` is the standalone-ready session entry for the
PR #67 snagging pass, with companion handover prompt
`../../../prompts/semantic-search/pr-67-snagging-triage.prompt.md`.

`cli-robustness.plan.md` is the current active re-entry lane to re-validate the
dry-run execution path and confirm no-hang lifecycle guarantees.

## Reference Documents

- [bulk_data_for_semantic_search.feature_request.md](./bulk_data_for_semantic_search.feature_request.md) — bulk download enhancement requests for the API team

## Archived

- [blue-green-reindex.execution.plan.md](../archive/completed/blue-green-reindex.execution.plan.md) — superseded by `unified-versioned-ingestion.plan.md`; retained for root cause analysis and completed prerequisites

Next queue: [current/README.md](../current/README.md)
Strategic backlog: [future/README.md](../future/README.md)
