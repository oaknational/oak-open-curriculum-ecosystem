---
prompt_id: onboarding-rerun
title: "M1 Release — Suggest Pipeline and Final Gates"
type: handover
status: active
last_updated: 2026-02-28
---

# M1 Release — Suggest Pipeline and Final Gates

Session entry point. This prompt and the release plan together define
the full scope of work.

## Context

All M1 code work is complete except M1-S009 (suggest pipeline). All 32
MCP tools validated (2026-02-28). Post-validation quality fixes done:
M1-S004 (param normalisation), M1-S006 (rate-limit docs), text-less
thread search.

## Top priorities for this session

### 1. Complete the suggest pipeline in the search SDK (M1-S009)

The SDK's `suggest()` uses only ES completion (matches from start of
each input). `"frac"` does not match `"Adding fractions"`. This is an
incomplete implementation — the CLI already solves it with `bool_prefix`
on `search_as_you_type` fields. Fix at source: complete the SDK, then
refactor CLI to consume it.

**Principle**: search logic belongs in the SDK. CLI and MCP are consumers.
Do not duplicate search behaviour in consumers.

- Extend `suggest()` in `packages/sdks/oak-search-sdk/src/retrieval/suggestions.ts`
  to run `bool_prefix` on `.sa`, `._2gram`, `._3gram` sub-fields
- Extract scope-specific `boolPrefixFields` and filter-building from
  CLI's `scope-config.ts` into the SDK
- Merge and deduplicate results from completion + `bool_prefix`
- `SuggestClient` interface may need extending for regular search calls
- Refactor CLI (`apps/oak-search-cli/src/lib/suggestions/`) to consume
  the SDK's `suggest()` instead of its local pipeline
- Reference: CLI implementation in `apps/oak-search-cli/src/lib/suggestions/index.ts`

### 2. Exclude `get-lessons-assets-by-type` from MCP tools (M1-S003)

Remote MCP server cannot trigger client-side downloads.
`get-lessons-assets` provides download URLs.

- Add `/lessons/{lesson}/assets/{type}` to `SKIPPED_PATHS` in
  `mcp-tool-generator.ts`
- Remove `GET_LESSONS_ASSETS_BY_TYPE_WARNING` from `tool-description.ts`
- Run `pnpm sdk-codegen` to regenerate (32 → 31 tools)
- Run tests to verify

### 3. Remaining M0 gates

- Final secrets and PII sweep (`pnpm secrets:scan:all`)
- Manual sensitive-information review (human)
- Merge `feat/semantic_search_deployment` to `main`
- Make repository public on GitHub

### 4. Known limitations (not bugs)

- M1-S007 (prerequisite sub-graphs) deferred post-merge.

## Getting started

1. Read the release plan:
   [release-plan-m1.plan.md](../plans/release-plan-m1.plan.md)
   — §Top Priorities for Next Session and §M1-S009 detail
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
