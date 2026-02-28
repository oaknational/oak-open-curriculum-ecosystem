---
prompt_id: onboarding-rerun
title: "M1 Release — Verify and Ship"
type: handover
status: active
last_updated: 2026-02-28
---

# M1 Release — Verify and Ship

Session entry point. This prompt and the release plan together define
the full scope of work.

## Context

All M1 code work is complete. Full bulk reindex ran successfully on
2026-02-28: 16,443 documents indexed (12,864 lessons, 1,664 units,
164 threads, 30 sequences, 57 facets). 26 initial ELSER failures,
all recovered in a single retry round. `thread_semantic` should now
be populated on all 164 thread documents.

Chunk delay increased from 7001ms to 8000ms (ADR-096 revised) for
headroom as the dataset grows.

**Verification not yet done** — the reindex completed but nobody has
confirmed via EsCurric that `thread_semantic` is present or that
thread search now returns results.

## Top priorities for this session

### 1. Verify reindex and validate all 32 MCP tools (P1)

Full validation plan in the release plan §Top Priorities for Next Session.
In brief:

1. Verify via EsCurric that `thread_semantic` is present on all 164 docs
2. Validate thread search and explore-topic (M1-S001a/b)
3. Validate all other MCP tools (discovery, sequence, lesson, thread,
   browse, fetch, changelog, search scopes)
4. Validate M1-S002 year normalisation, M1-S003 binary warning, M1-S005
   scope limitations

### 2. Remaining M0 gates

- Final secrets and PII sweep (`pnpm secrets:scan:all`)
- Manual sensitive-information review (human)
- Merge `feat/semantic_search_deployment` to `main`
- Make repository public on GitHub

### 3. Open P3 items (non-blocking)

- **M1-S004**: Parameter naming inconsistency (`threadSlug` vs bare)
- **M1-S006**: `get-rate-limit` returns 0/0/0 on preview (upstream)

## Getting started

1. Read the release plan:
   [release-plan-m1.plan.md](../plans/release-plan-m1.plan.md)
   — §Top Priorities for Next Session and §MCP Tool Exploration Findings
2. Read [rules.md](../directives/rules.md),
   [testing-strategy.md](../directives/testing-strategy.md), and
   [schema-first-execution.md](../directives/schema-first-execution.md)
3. Read [distilled.md](../memory/distilled.md) and
   [napkin.md](../memory/napkin.md)

## Ingest CLI reference

The CLI defaults to bulk ingestion from `./bulk-downloads`. Key commands:

| Command | Purpose |
|---|---|
| `pnpm bulk:download` | Download bulk curriculum data |
| `pnpm es:ingest` | Full ingestion (all indexes, bulk default) |
| `pnpm es:ingest -- --index threads` | Reindex threads only |
| `pnpm es:ingest -- --api --all` | Full ingestion via live API |
| `pnpm es:ingest -- --dry-run` | Preview without writing to ES |

Flags: `--index <kind>` (repeatable), `--verbose`, `--incremental`,
`--bulk-dir <path>`, `--api`, `--subject <slug>`, `--all`, `--key-stage <ks>`.

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
- ADR-093: Bulk-first ingestion strategy (revised 2026-02-28)
- Code patterns: `.agent/memory/code-patterns/README.md`
