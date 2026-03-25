---
prompt_id: semantic-search
title: "Semantic Search Session Entry Point"
type: handover
status: active
last_updated: 2026-03-25-evening
---

# Semantic Search — Session Entry Point

This is a working handover document. Keep it concise and operational.

---

## Current State (2026-03-25, evening)

**Branch**: `feat/es_index_update`

All code fixes, re-ingest, and CI blockers are resolved. CI build, lint,
and type-check pass. One remaining failure: `@oaknational/agent-tools#test`
(4 tests timing out at 5000ms in CI) — unrelated to search work.

### CI blockers resolved (2026-03-25)

Two CI blockers were diagnosed and fixed in this session:

1. **Test hang**: `eslint-boundary.integration.test.ts` used programmatic
   ESLint with TypeScript `projectService`, creating open handles that
   prevented vitest workers from exiting in CI (`CI=true` -> graceful exit
   mode). Deleted the test (redundant with `pnpm lint`). Added
   "no process spawning in in-process tests" rule to `principles.md`
   and `testing-strategy.md`.
2. **Lint cache poisoning**: `turbo.json` inputs for lint/test/type-check
   enumerated specific directories but missed `evaluation/`, `operations/`,
   etc. A previous CI run cached a failing lint result (1091
   `import-x/no-unresolved` errors). Fixed by switching all relevant turbo
   task inputs to `**/*.ts`, invalidating stale cache entries.

### What's done

- **F1** (`threadSlug`): stale index, not a code defect. Re-ingest
  (v2026-03-24-091112) resolved.
- **F2** (`category`): code fix complete (commit `2c6e6b51`). Re-ingest
  populates corrected data.
- **Pre-reingest remediation**: all 5 issues (S1-S5) resolved, CLI-SDK
  boundary enforcement complete (2026-03-23).
- **Re-ingest**: v2026-03-24-091112 staged + promoted, 15,910 parent docs
  across 5 index types.
- **Turbo pipeline fixes**: phantom tasks eliminated, cache keys fixed,
  B2 pure-function extractions done. B1 deferred to workspace decomposition.
- **CI test hang**: root-caused and fixed (eslint-boundary test deleted).
- **CI lint cache**: turbo.json inputs fixed (`**/*.ts`), stale cache busted.
- **Quality gates**: build, lint, type-check pass in CI. Tests pass except
  agent-tools timeout (pre-existing, unrelated).

### What's next

1. **Resolve or triage agent-tools test timeout** -- 4 tests timing out at
   5000ms in CI. Likely pre-existing/flaky, unrelated to search work.
2. **Merge PR** once CI is green.
3. **Assess production search** via the prod MCP server
   (`project-0-oak-mcp-ecosystem-oak-prod`) after Vercel deployment.

Active plan:

[prod-search-assessment.execution.plan.md](../../plans/semantic-search/active/prod-search-assessment.execution.plan.md)

---

## Active Authority

- **Single active plan**:
  [prod-search-assessment.execution.plan.md](../../plans/semantic-search/active/prod-search-assessment.execution.plan.md)
- Findings register (archived, referenced by active plan):
  [search-tool-prod-validation-findings-2026-03-15.md](../../plans/semantic-search/archive/completed/search-tool-prod-validation-findings-2026-03-15.md)
- Permanent contracts:
  [ADR-134](../../../docs/architecture/architectural-decisions/134-search-sdk-capability-surface-boundary.md) (CLI-SDK boundary),
  [ADR-139](../../../docs/architecture/architectural-decisions/139-sequence-semantic-contract-and-ownership.md) (sequence semantic),
  [ADR-140](../../../docs/architecture/architectural-decisions/140-search-ingestion-sdk-boundary.md) (ingestion SDK boundary)
- Session bootstrap: this prompt

---

## Key Facts

- **`total` in search responses**: reflects page cardinality (result array
  length), not ES `hits.total`.
- **`validate-aliases` vs freshness**: green alias health means alias
  topology is correct, not that data matches the latest bulk. See
  [`apps/oak-search-cli/docs/INDEXING.md`](../../../apps/oak-search-cli/docs/INDEXING.md).
- **Sequence retrieval**: SDK-owned 2-way RRF (BM25 + ELSER on
  `sequence_semantic`). [ADR-139](../../../docs/architecture/architectural-decisions/139-sequence-semantic-contract-and-ownership.md)
  is the permanent contract.
- **CLI entry point**: `apps/oak-search-cli/bin/oaksearch.ts`.
- **MCP server**: `project-0-oak-mcp-ecosystem-oak-prod`

---

## Session Start Sequence

### Step 1: Ground

- [start-right-quick](../../skills/start-right-quick/shared/start-right.md)
  (or thorough for complex work)
- [AGENT.md](../../directives/AGENT.md)
- [principles.md](../../directives/principles.md)

### Step 2: Execute the active plan

Resume the single active plan — production search assessment after PR merge.

### Step 3: Keep authority documents in sync

When execution state changes materially, update:

- This prompt (current state)
- The active plan (task status and evidence)

---

## Ingest Safety Policy

- Do not run ingest/promote commands until the execution plan records explicit
  readiness-gate closure.
- For operator-run ingest:
  1. agent prepares exact command and pre-check context;
  2. operator runs command independently;
  3. agent monitors output and proposes remediation.
- Agent does not start ingest commands unless explicitly requested in-session.

---

## Lane Indexes

- [Active Plans](../../plans/semantic-search/active/README.md)
- [Current Queue](../../plans/semantic-search/current/README.md)
- [Roadmap](../../plans/semantic-search/roadmap.md)
- [Archive](../../plans/semantic-search/archive/completed/README.md)
