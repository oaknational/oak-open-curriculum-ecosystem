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
- Archived incident authorities:
  - `.agent/plans/semantic-search/archive/completed/semantic-search-recovery-and-guardrails.execution.plan.md`
  - `.agent/plans/semantic-search/archive/completed/semantic-search-ingest-runbook.md`
- These archived plans capture phase closure, reviewer roster, quality-gate
  closure, and incident stop/go sequencing.
- This document is the evergreen operational reference for lifecycle ingest.

## Prerequisites

- Elasticsearch Serverless credentials configured (see
  [environment variables](./environment-variables.md))
- Bulk data downloaded to `apps/oak-search-cli/bulk-downloads/`
- Working directories:
  - repo root for workspace-wide validation commands (`pnpm sdk-codegen`, `pnpm build`, `pnpm type-check`)
  - `apps/oak-search-cli` for `oaksearch` admin commands

## Operator-Agent Command Contract

When running ingest in an agentic workflow:

1. The agent runs all non-ingest checks and prepares exact commands.
2. The operator runs `admin versioned-ingest` directly.
3. The agent monitors output, classifies failures, and drives remediation.

## Validation and Ingest Sequence

### Step 0.5 — Capture immutable baseline evidence pack

Run from `apps/oak-search-cli`:

```bash
RUN_TS="$(date +%Y%m%d-%H%M%S)"
INDEX_TARGET="${INDEX_TARGET:-primary}" # set to sandbox for sandbox recovery
EVIDENCE_DIR="recovery-evidence/${RUN_TS}-phase0-baseline"
mkdir -p "${EVIDENCE_DIR}"
pnpm tsx bin/oaksearch.ts admin validate-aliases > "${EVIDENCE_DIR}/validate-aliases.txt"
pnpm tsx bin/oaksearch.ts admin meta get > "${EVIDENCE_DIR}/meta-get.txt"
pnpm tsx bin/oaksearch.ts admin count > "${EVIDENCE_DIR}/count.txt"
cat <<'EOF' > "${EVIDENCE_DIR}/baseline-summary.md"
staged_version: <replace-after-count-analysis>
live_alias_version: <replace-after-validate-aliases-analysis>
previous_version_in_mapping: <replace-after-mapping-check>
mapping_contract_match: <replace-after-generated-vs-live-contract-check>
EOF
```

Run from repo root:

```bash
# Run in the same shell as the first Step 0.5 block.
: "${EVIDENCE_DIR:?Set EVIDENCE_DIR from Step 0.5 first block}"
set -a && source ".env" && set +a
curl -sS -H "Authorization: ApiKey ${ELASTICSEARCH_API_KEY}" \
  "${ELASTICSEARCH_URL}/oak_meta/_mapping" \
  > "apps/oak-search-cli/${EVIDENCE_DIR}/oak-meta-mapping.json"
curl -sS -H "Authorization: ApiKey ${ELASTICSEARCH_API_KEY}" \
  "${ELASTICSEARCH_URL}/_cat/indices/oak_*_v*?h=index,docs.count&format=json" \
  > "apps/oak-search-cli/${EVIDENCE_DIR}/versioned-index-counts.json"
jq --arg target "${INDEX_TARGET}" '
  map(
    select(
      ($target == "sandbox" and (.index | test("_sandbox_v")))
      or
      ($target == "primary" and ((.index | test("_sandbox_v")) | not))
    )
  )
' "apps/oak-search-cli/${EVIDENCE_DIR}/versioned-index-counts.json" \
  > "apps/oak-search-cli/${EVIDENCE_DIR}/target-versioned-index-counts.json"
```

Go conditions:

- Baseline evidence includes alias state, metadata document, metadata mapping,
  and six-family counts in one timestamped evidence directory.
- `baseline-summary.md` records `staged_version`, `live_alias_version`,
  `previous_version_in_mapping`, and `mapping_contract_match`.
- `staged_version` is derived from `target-versioned-index-counts.json`, not
  from `admin count` output (which reflects live alias targets).

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

| Failure point                                                 | Classification                              | Action                                                                                                                                                                           |
| ------------------------------------------------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Alias validation fails before ingest                          | Ops precondition                            | Fix connectivity/auth/cluster health first                                                                                                                                       |
| Ingest fails on metadata contract                             | Schema-first contract drift                 | Trace generator → mapping → runtime write path; run `pnpm sdk-codegen && pnpm build && pnpm type-check`                                                                          |
| Lease acquisition fails (held by another run)                 | Active lease contention                     | Stop and wait for lease holder to finish or TTL expiry; then run readback triage (`validate-aliases`, `meta get`, `count`) before retry                                          |
| Promote/rollback/versioned-ingest fails after mutation starts | Ambiguous lifecycle state with active lease | Stop immediately; run mandatory readback (`validate-aliases`, `meta get`, `count`) before retry or rollback. Do not run parallel lifecycle mutation while triage is in progress. |
| Alias action partial failures surfaced (`errors: true`)       | Alias swap partial success hazard           | Treat as incident immediately; run readback triage and do not accept top-level acknowledgement alone                                                                             |
| Post-ingest alias health fails                                | Active incident                             | Repair alias targets before any docs/reviewer/gate closeout                                                                                                                      |

## Salvage Promotion Preconditions

When upload completes but metadata commit fails, salvage promote is allowed only
after these checks:

0. Phase 0 evidence pack exists (timestamped directory with baseline summary
   and versioned index inventory).
1. Candidate staged version selection is deterministic and evidenced by this rule:
   - candidate appears in all six index families in the phase-0 evidence pack
   - candidate is newer than current live alias version
   - if multiple candidates qualify, choose the lexicographically greatest
2. Version inventory is filtered to the active target (primary vs sandbox) to
   avoid cross-target candidate selection.
3. Alias health is confirmed.
4. `oak_meta` mapping is reconciled to the generated metadata contract and the
   evidence summary records `mapping_contract_match: true`.
5. Metadata/alias coherence is repaired and read back (`oak_meta.version`
   equals live alias target version).

### Incident-only salvage promote procedure

Use this procedure only after a metadata commit failure where upload reached the
versioned indexes successfully.

```bash
# 1) Run from repo root: rebuild and validate generated contract
pnpm sdk-codegen
pnpm build
pnpm type-check

# 2) Run from apps/oak-search-cli with EVIDENCE_DIR already set from Step 0.5
cd apps/oak-search-cli
: "${EVIDENCE_DIR:?Set EVIDENCE_DIR from Step 0.5 first block}"
STAGED_VERSION="$(awk -F': ' '/staged_version/ {print $2}' "${EVIDENCE_DIR}/baseline-summary.md")"
set -a && source "../../.env" && set +a

# 3) Verify staged index family counts for the candidate version
for INDEX in $(jq -r --arg version "${STAGED_VERSION}" '.[] | .index | select(test("_" + $version + "$"))' "${EVIDENCE_DIR}/target-versioned-index-counts.json"); do
  curl -sS -H "Authorization: ApiKey ${ELASTICSEARCH_API_KEY}" \
    "${ELASTICSEARCH_URL}/${INDEX}/_count"
done

# 4) Promote and perform mandatory readbacks
pnpm tsx bin/oaksearch.ts admin promote --target-version "${STAGED_VERSION}"
pnpm tsx bin/oaksearch.ts admin validate-aliases
pnpm tsx bin/oaksearch.ts admin meta get
for _ in 1 2 3 4 5 6; do
  pnpm tsx bin/oaksearch.ts admin count && break
  sleep 5
done
```

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
pnpm format:root
pnpm markdownlint:root
pnpm subagents:check
pnpm portability:check
pnpm lint:fix
pnpm test
pnpm test:e2e
pnpm test:ui
pnpm smoke:dev:stub
```

If any gate fails, fix and restart the sequence from `pnpm secrets:scan:all`.

Migration completion gate:

- Do not mark migration complete until blue/green deploy success evidence is
  recorded: deploy environment, commit SHA, cutover success, and post-deploy
  health/smoke checks.
