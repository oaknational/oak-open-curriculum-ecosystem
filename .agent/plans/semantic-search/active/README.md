# Semantic Search — Active

Executable plans currently in progress.

| Priority | Plan | Scope | Status |
|---|---|---|---|
| A0 | [unified-versioned-ingestion.md](./unified-versioned-ingestion.md) | Unify bulk ingestion, fix layer boundaries, enable blue/green lifecycle (ADR-130) | 🟢 Active |
| A1 | [search-sdk-args-extraction.plan.md](./search-sdk-args-extraction.plan.md) | Move param builders, scope validation, and error formatting into Search SDK | 🟡 Planning |
| A2 | [bulk-metadata-quick-wins.execution.plan.md](./bulk-metadata-quick-wins.execution.plan.md) | Boundary 03 — preserve and widen low-risk bulk lesson/unit metadata for later asset and retrieval work | 🟢 Active |
| A3 | [kg-alignment-audit.execution.plan.md](./kg-alignment-audit.execution.plan.md) | Audit measured overlap between ontology graph entities and search-facing curriculum records before broader graph integration | 🟢 Active |
| — | [blue-green-reindex.execution.plan.md](./blue-green-reindex.execution.plan.md) | SUPERSEDED — historical record (root cause analysis, completed prerequisites) | ⬜ Superseded |

`unified-versioned-ingestion.md` is the standalone-ready session entry for
the blue/green lifecycle integration. It supersedes the predecessor plan
and incorporates all 9 reviewer findings as planned work.

`bulk-metadata-quick-wins.execution.plan.md` is the standalone-ready session
entry for the current Boundary 03 workstream.

`kg-alignment-audit.execution.plan.md` is the standalone-ready session entry
for the first ontology/search graph-enablement workstream.

Next queue: [current/README.md](../current/README.md)
Strategic backlog: [future/README.md](../future/README.md)
