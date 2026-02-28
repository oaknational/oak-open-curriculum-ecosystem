---
prompt_id: onboarding-rerun
title: "M1 Release — Remaining Gates"
type: handover
status: active
last_updated: 2026-02-28
---

# M1 Release — Remaining Gates

Session entry point. This prompt and the release plan together define
the full scope of work.

## Context

MCP search quality fixes (M1-S001a/b, S002, S003, S005) are code-complete
with TDD. All quality gates green. Year normalisation implemented at
generator level with four-layer schema synchronisation.

**M1-S001a reindex not yet done** — the code populates `thread_semantic`
but the 164 live ES documents still lack the field. ELSER leg remains
dead until reindex.

M1-S008 (`callTool` overload type mismatch) identified and tracked. P3,
no runtime impact.

## Top priorities for this session

### 1. Reindex to populate `thread_semantic` (P1)

Code fix complete. Run the search CLI ingest command against the live ES
deployment to populate the field across all 164 thread documents. Verify
via EsCurric `platform_core_get_document_by_id` that `thread_semantic`
is present on sample documents.

### 2. Remaining M0 gates

- Final secrets and PII sweep (`pnpm secrets:scan:all`)
- Manual sensitive-information review (human)
- Merge `feat/semantic_search_deployment` to `main`
- Make repository public on GitHub

### 3. Open P3 items (non-blocking)

- **M1-S004**: Parameter naming inconsistency (`threadSlug` vs bare)
- **M1-S006**: `get-rate-limit` returns 0/0/0 on preview (upstream)
- **M1-S008**: `callTool` overloads type mismatch (type-safety debt)

## Getting started

1. Read the release plan:
   [release-plan-m1.plan.md](../plans/release-plan-m1.plan.md)
   — §Top Priorities for Next Session and §MCP Tool Exploration Findings
2. Read [rules.md](../directives/rules.md),
   [testing-strategy.md](../directives/testing-strategy.md), and
   [schema-first-execution.md](../directives/schema-first-execution.md)
3. Read [distilled.md](../memory/distilled.md) and
   [napkin.md](../memory/napkin.md)

## EsCurric tools

The Elasticsearch Serverless deployment is accessible via the
`user-EsCurric` MCP server. Key tools for investigation:

- `platform_core_execute_esql` — run ES|QL queries directly
- `platform_core_get_document_by_id` — fetch full document source
  (use index `oak_threads`, IDs are thread slugs like `algebra`)
- `platform_core_get_index_mapping` — check index mappings
- `platform_core_list_indices` — list indices (pattern `*oak*`)

Note: `platform_core_search` (natural language) requires an LLM
connector that may not be configured. Use `execute_esql` instead.

## Reference

- Release plan: `.agent/plans/release-plan-m1.plan.md`
- Onboarding tracker: `.agent/plans/developer-experience/onboarding-simulations-public-alpha-readiness.md`
- M0 milestone: `.agent/milestones/m0-open-private-alpha.md`
- Code patterns: `.agent/memory/code-patterns/README.md`
- Session transcript: `.cursor/projects/Users-jim-code-oak-oak-mcp-ecosystem/agent-transcripts/8b4b3ea0-9ca6-4b11-bbc0-4ad50bafdb00.txt`
