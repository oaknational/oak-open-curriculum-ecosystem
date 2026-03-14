---
title: Elasticsearch Ingest Lifecycle
status: active
last_reviewed: 2026-03-14
---

# Elasticsearch Ingest Lifecycle

Operational procedure for running blue/green index lifecycle ingestion using
the Search CLI. See [ADR-130](../architecture/architectural-decisions/130-blue-green-index-swapping.md)
for the architectural decision behind this approach.

## Document Authority

- `semantic-search.prompt.md` controls session bootstrap and lane selection.
- `semantic-search-recovery-and-guardrails.execution.plan.md` controls phase
  closure, reviewer roster, and quality-gate closure.
- `semantic-search-ingest-runbook.md` controls active incident stop/go and
  failure-branch sequencing.
- This document is the evergreen operational reference for lifecycle ingest.

## Prerequisites

- Elasticsearch Serverless credentials configured (see
  [environment variables](./environment-variables.md))
- Bulk data downloaded to `apps/oak-search-cli/bulk-downloads/`
- Working directory: `apps/oak-search-cli`

## Operator-Agent Command Contract

When running ingest in an agentic workflow:

1. The agent runs all non-ingest checks and prepares exact commands.
2. The operator runs `admin versioned-ingest` directly.
3. The agent monitors output, classifies failures, and drives remediation.

## Validation and Ingest Sequence

### Step 1 — Pre-ingest alias health check

```bash
pnpm tsx bin/oaksearch.ts admin validate-aliases
pnpm tsx bin/oaksearch.ts admin meta get
```

Go conditions:

- All expected aliases report healthy with concrete target indexes.
- Metadata/alias coherence holds before ingest (`oak_meta.version` equals the
  current live alias target version).

### Step 1.5 — Metadata mapping gate (read-only)

Run from repository root:

```bash
set -a && source ".env" && set +a
curl -sS -H "Authorization: ApiKey ${ELASTICSEARCH_API_KEY}" \
  "${ELASTICSEARCH_URL}/oak_meta/_mapping"
```

Go condition:

- Live `oak_meta` mapping is reconciled to the generated metadata contract.
- `properties.previous_version` is a sentinel check, not the only contract
  check.
- Required generated metadata fields are present and correctly typed:
  `version`, `ingested_at`, `subjects`, `key_stages`, `duration_ms`,
  `doc_counts`, `previous_version`.
- If any required generated metadata field is missing, stop and reconcile
  mapping contract drift before ingest/promote.
- Reconcile in place only with additive `PUT _mapping` changes. If drift needs
  non-additive mapping changes, switch to new-index/reindex flow.

### Step 2 — Operator-run ingest

```bash
pnpm tsx bin/oaksearch.ts admin versioned-ingest
```

Success criteria:

- Command exits `0`
- Metadata commit succeeds under strict mapping
- No `strict_dynamic_mapping_exception` for `previous_version`

### Step 2a — Optional staged-then-promote flow

Use when you need a controlled checkpoint between ingest and promotion:

```bash
pnpm tsx bin/oaksearch.ts admin stage --bulk-dir ./bulk-downloads
pnpm tsx bin/oaksearch.ts admin promote --target-version <version>
```

### Step 3 — Post-ingest validation

```bash
pnpm tsx bin/oaksearch.ts admin validate-aliases
pnpm tsx bin/oaksearch.ts admin meta get
pnpm tsx bin/oaksearch.ts admin count
```

Success criteria:

- Aliases resolve to the newly promoted version's target indexes.
- `oak_meta.version` matches the promoted version.
- `oak_meta.previous_version` matches the pre-promote live alias version.
- If alias action-level results are available, they must report no partial
  failures (`errors: false` and all action statuses successful).
- For count-based checks, allow refresh visibility delay (retry for up to
  30 seconds before classifying failure).

## Failure Classification

| Failure point                                           | Classification                    | Action                                                                                                                         |
| ------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Alias validation fails before ingest                    | Ops precondition                  | Fix connectivity/auth/cluster health first                                                                                     |
| Ingest fails on metadata contract                       | Schema-first contract drift       | Trace generator → mapping → runtime write path; run `pnpm sdk-codegen && pnpm build && pnpm type-check`                        |
| Lease acquisition fails (held by another run)           | Active lease contention           | Stop and wait for lease holder to finish or TTL expiry; then run readback triage (`validate-aliases`, `meta get`, `count`) before retry |
| Promote/rollback/versioned-ingest fails after mutation starts | Ambiguous lifecycle state with active lease | Stop immediately; run mandatory readback (`validate-aliases`, `meta get`, `count`) before retry or rollback. Do not run parallel lifecycle mutation while triage is in progress. |
| Alias action partial failures surfaced (`errors: true`) | Alias swap partial success hazard | Treat as incident immediately; run readback triage and do not accept top-level acknowledgement alone                           |
| Post-ingest alias health fails                          | Active incident                   | Repair alias targets before any docs/reviewer/gate closeout                                                                    |

## Salvage Promotion Preconditions

When upload completes but metadata commit fails, salvage promote is allowed only
after these checks:

0. Phase 0 evidence pack exists (timestamped directory with baseline summary
   and versioned index inventory). Use the incident runbook for the capture
   sequence and staged-version selection procedure.
1. Version inventory is filtered to the active target (primary vs sandbox) to
   avoid cross-target candidate selection.
2. Alias health is confirmed.
3. `oak_meta` mapping is reconciled to the generated metadata contract and the
   evidence summary records `mapping_contract_match: true`.
4. Metadata/alias coherence is repaired and read back (`oak_meta.version`
   equals live alias target version).
5. Candidate staged version selection is deterministic and evidenced.

## Document Count Reference

`_cat/indices` reports inflated doc counts because ELSER `semantic_text`
chunking creates nested Lucene documents (~15x for lessons). Use `admin count`
for true parent document counts:

```bash
pnpm tsx bin/oaksearch.ts admin count
```

Expected approximate counts: 12,746 lessons, 1,671 units.

## Post-Success Closeout

After a successful lifecycle migration:

1. Run specialist reviewer passes:
   - `architecture-reviewer-barney`
   - `architecture-reviewer-betty`
   - `architecture-reviewer-fred`
   - `architecture-reviewer-wilma`
   - `code-reviewer`
   - `test-reviewer`
   - `type-reviewer`
   - `docs-adr-reviewer`
   - `elasticsearch-reviewer`
   - `security-reviewer`
2. Implement findings by default. Reject only when incorrect, with written
   rationale and evidence.
3. Re-run affected reviewers until no unresolved must-fix/high findings remain.
4. If a reviewer invocation fails (timeout, tool error, empty output), retry
   once; then escalate with written evidence. Do not skip reviewer coverage.
5. Propagate ADR/docs updates.
6. Run full quality gate sequence from repo root with restart-on-fix:

```bash
pnpm secrets:scan:all
pnpm clean
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm doc-gen
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm subagents:check
pnpm portability:check
pnpm test
pnpm test:ui
pnpm test:e2e
pnpm smoke:dev:stub
```

If any gate fails, fix and restart the sequence from `pnpm secrets:scan:all`.
