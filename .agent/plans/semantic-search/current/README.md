# Semantic Search — Current (Next Up)

Queued work that is next to execute in post-merge sequencing.

When work starts, promote the selected plan into `../active/`.

## Queue

| Priority | Plan | Scope | Status |
|---|---|---|---|
| P0 | [m2-public-alpha-auth-rate-limits.execution.plan.md](./m2-public-alpha-auth-rate-limits.execution.plan.md) | Canonical blocker execution for production Clerk migration + OAuth proxy edge rate limits | 📋 Ready |
| P1 | [keyword-definition-assets.execution.plan.md](./keyword-definition-assets.execution.plan.md) | Boundary 03 — promote lesson keyword definitions into first-class, provenance-aware curriculum assets | 📋 Ready after active bulk metadata quick wins |
| P2 | [thread-sequence-semantic-surfaces.execution.plan.md](./thread-sequence-semantic-surfaces.execution.plan.md) | Boundary 04 — enrich thin thread/sequence documents with derived semantic and suggestion surfaces | 📋 Ready after P1 |
| P3 | [kg-integration-quick-wins.plan.md](./kg-integration-quick-wins.plan.md) | Provision an isolated ontology-backed Neo4j lane and deliver the remaining bounded Neo4j + Elasticsearch quick wins after the active alignment audit | 📋 Parent plan, partially promoted |

Milestone boundary:
`P0` is the remaining Milestone 2 blocker. The bulk metadata quick-win plan has
already been promoted to `active/` as an independent semantic-search stream.
`P1`-`P2` are the remaining roadmap Phase 4 / Milestone 3 follow-on items and
depend on that active bulk-metadata work completing first.

This means public-release readiness does **not** gate the active bulk metadata
workstream. `P0` remains important, but it is a separate release-readiness
track rather than a prerequisite for Boundary 03 execution.

Strategic source backlog: [future/README.md](../future/README.md)  
In-progress execution: [active/README.md](../active/README.md)
