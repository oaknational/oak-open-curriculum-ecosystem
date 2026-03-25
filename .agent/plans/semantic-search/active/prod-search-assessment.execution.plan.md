---
name: "Production Search Assessment"
overview: >
  Verify F1/F2 filter fixes and overall search quality in production
  via the prod MCP server after the current PR is merged and deployed.
status: "Blocked — CI hanging, needs diagnosis before merge"
branch: "feat/es_index_update"
todos:
  - id: ci-hang-diagnosis
    content: "Diagnose GitHub CI hang: add logging to identify which step/process is not exiting, then fix."
    status: pending
  - id: prod-assessment
    content: "Assess production search via the prod MCP server (project-0-oak-mcp-ecosystem-oak-prod) after PR merge and deployment."
    status: pending
---

# Production Search Assessment

## Status

**Blocked** — GitHub CI is hanging indefinitely. Must diagnose and fix
before the PR can merge.

### CI hang (2026-03-25)

The CI job at
<https://github.com/oaknational/oak-open-curriculum-ecosystem/actions/runs/23537232656/job/68515429186?pr=68>
hangs and never completes. Previous attempts to fix this (`TURBO_DAEMON=false`,
`--concurrency=1`) were reverted because they addressed symptoms rather than
root cause. The actual cause is unknown.

**Next step**: add logging/timing to the CI workflow steps to identify which
step or child process is not exiting. Without this observability we are
guessing.

## Context

The `feat/es_index_update` branch contains all code fixes for F1 (`threadSlug`)
and F2 (`category`) findings, plus a versioned re-ingest
(v2026-03-24-091112, 15,910 parent docs). Production deployment
(`curriculum-mcp-alpha.oaknational.dev`) is currently built from an older
commit that predates these fixes. Once the PR is merged and deployed, the
production MCP server will serve from the corrected code and re-ingested data.

## Prerequisites

- CI hang diagnosed and fixed
- PR merged to `main`
- Vercel production deployment complete (automatic on merge)

## Task: Assess production search via the prod MCP server

Use the `search` tool on `project-0-oak-mcp-ecosystem-oak-prod` to verify
F1 and F2 findings are resolved, then do a broader quality spot-check.

### F1 verification (threadSlug)

```json
{
  "scope": "lessons",
  "query": "fraction",
  "subject": "maths",
  "keyStage": "ks2",
  "threadSlug": "number-fractions",
  "size": 10
}
```

**Pass**: `total > 0` and results contain lessons with `number-fractions`
in `thread_slugs`.

### F2 verification (category)

```json
{
  "scope": "sequences",
  "query": "maths",
  "category": "nonexistentzzz",
  "size": 10
}
```

**Pass**: `total = 0` and empty hits array (category filter is active).

Positive control:

```json
{
  "scope": "sequences",
  "query": "science",
  "category": "Biology",
  "size": 10
}
```

**Pass**: results returned with matching category.

### Broader spot-check

- Lessons: subject, keyStage, highlight filters
- Units: basic query
- Threads: queryless with subject filter
- Sequences: phaseSlug filter
- Suggest: context requirement enforced

### On completion

1. Update the findings register
   ([archive](../archive/completed/search-tool-prod-validation-findings-2026-03-15.md))
   with final dispositions and evidence.
2. Archive this plan to `archive/completed/`.
3. Update `active/README.md`.

## Reference

- Findings register: [search-tool-prod-validation-findings-2026-03-15.md](../archive/completed/search-tool-prod-validation-findings-2026-03-15.md)
- F2 closure plan (archived): [f2-closure-and-p0-ingestion.execution.plan.md](../archive/completed/f2-closure-and-p0-ingestion.execution.plan.md)
- MCP server: `project-0-oak-mcp-ecosystem-oak-prod`
- `total` caveat: `total` reflects page cardinality (result array length),
  not ES `hits.total`
