---
name: Semantic Search Ingest Runbook (Operator-Run)
last_updated: 2026-03-14
status: active
---

# Semantic Search Ingest Runbook (Operator-Run)

This runbook is the operational execution guide for proving first successful
alias lifecycle ingest in the active semantic-search incident lane.

**Proof window gate**: treat this runbook as blocked until
`semantic-search-recovery-and-guardrails.execution.plan.md` Phase 2
guardrail tests and Task 2.3 remediation tranche are complete.

Reviewer finding traceability for this lane:

- Authoritative findings register: `semantic-search-recovery-and-guardrails.execution.plan.md`
  under **Reviewer Findings Register (round 1, 2026-03-14)**.
- Findings are actionable by default; reject only when incorrect with explicit
  rationale/evidence in that register.
- Active must-fix IDs referenced by this runbook: `R1`, `R5`, `R6`, `R9`.

## Document Authority

- `semantic-search.prompt.md` is the session bootstrap and lane-ordering authority.
- `semantic-search-recovery-and-guardrails.execution.plan.md` is the execution authority for recovery tasks and phase closure.
- This runbook is the operator checklist for stop/go sequencing and failure triage while the recovery lane is active.
- `cli-robustness.plan.md` is supporting historical incident evidence only.

## Authoritative Inputs

- `./semantic-search-recovery-and-guardrails.execution.plan.md`
- `../../../prompts/semantic-search/semantic-search.prompt.md`
- `./cli-robustness.plan.md` (supporting evidence only)
- `../archive/completed/search-cli-sdk-boundary-migration.execution.plan.md` (completed lane evidence)
- `../../../../docs/architecture/architectural-decisions/134-search-sdk-capability-surface-boundary.md`

## Operator-Agent Command Contract

1. Agent runs all non-ingest checks and prepares exact commands.
2. Operator runs ingest (`admin versioned-ingest`) directly.
3. Agent monitors ingest output, classifies failures, and drives remediation.

`admin versioned-ingest` must not be started by the agent unless the operator
explicitly requests an override in the active session.

## Deterministic Stop-Go Sequence

### Step 0 - Baseline

Run from repository root:

```bash
git status --short
git branch --show-current
ls -1 .agent/plans/semantic-search/active
```

Go condition:

- Active incident lane is `semantic-search-recovery-and-guardrails.execution.plan.md`.
- `cli-robustness.plan.md` remains supporting evidence only.
- Boundary evidence lane remains completed.
- Pre-lock period acknowledged: before lease guardrails are active, one and only
  one operator-run lifecycle command sequence may execute at a time.

### Step 0.5 - Capture immutable Phase 0 evidence pack

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

Go condition:

- Baseline evidence includes alias state, metadata document, metadata mapping,
  and six-family counts in one timestamped evidence directory.
- `baseline-summary.md` records staged candidate version, live alias version,
  and whether `previous_version` exists in mapping using those exact keys:
  `staged_version`, `live_alias_version`, `previous_version_in_mapping`.
- `staged_version` is selected from `target-versioned-index-counts.json`, not from
  `admin count` output (which reflects live alias targets).
- Evidence capture context is still valid in this shell (`EVIDENCE_DIR` set).

### Step 1 - Boundary Guardrail Health

Run from repository root:

```bash
pnpm --filter @oaknational/search-cli lint
pnpm --filter @oaknational/oak-search-sdk lint
```

Go condition:

- No blocking boundary regressions in lint output.

### Step 2 - Bootstrap Alias Health Check (Allowed Exception)

Run from `apps/oak-search-cli`:

```bash
pnpm tsx bin/oaksearch.ts admin validate-aliases
pnpm tsx bin/oaksearch.ts admin meta get
pnpm tsx bin/oaksearch.ts admin count
```

Go condition:

- All expected aliases report healthy with concrete target indexes.

### Step 3 - Pre-Ingest Validation

Run from `apps/oak-search-cli`:

```bash
pnpm tsx bin/oaksearch.ts admin validate-aliases
pnpm tsx bin/oaksearch.ts admin meta get
```

Go condition:

- Alias state remains healthy immediately before ingest.
- Metadata/alias coherence is healthy (`oak_meta.version` equals current live
  alias target version) before `admin versioned-ingest`.
- Phase 0 evidence pack and stop/go criteria are already satisfied.

### Step 3.5 - Metadata Mapping Gate (Read-only)

Run from repo root (read-only):

```bash
set -a && source ".env" && set +a
curl -sS -H "Authorization: ApiKey ${ELASTICSEARCH_API_KEY}" \
  "${ELASTICSEARCH_URL}/oak_meta/_mapping"
```

Go condition:

- Live `oak_meta` mapping is reconciled to the generated metadata contract.
- `properties.previous_version` is treated as a sentinel check, not the only
  contract check.
- Required metadata fields are present and correctly typed:
  `version`, `ingested_at`, `subjects`, `key_stages`, `duration_ms`,
  `doc_counts`, `previous_version`.
- If any required generated metadata field is missing, stop here and execute
  mapping reconciliation before any further ingest/promote attempts.
- Mapping reconciliation may use additive `PUT _mapping` changes only. If drift
  requires non-additive mapping changes, stop and switch to new-index/reindex
  workflow.

### Step 4 - Operator Ingest

Run by operator from `apps/oak-search-cli`:

```bash
pnpm tsx bin/oaksearch.ts admin versioned-ingest
```

Go condition:

- Command exits `0`.
- Metadata commit succeeds under strict mapping.
- No `strict_dynamic_mapping_exception` path for `previous_version`.

### Step 5 - Post-Ingest Validation

Run from `apps/oak-search-cli`:

```bash
pnpm tsx bin/oaksearch.ts admin validate-aliases
pnpm tsx bin/oaksearch.ts admin meta get
pnpm tsx bin/oaksearch.ts admin count
```

Go condition:

- All aliases healthy after ingest.
- Aliases resolve to target indexes for the newly promoted version.
- `oak_meta.version` matches promoted version.
- `oak_meta.previous_version` matches pre-promote live alias version.
- For count-based checks, allow refresh visibility delay (retry readback up to
  30 seconds in 5-second intervals before classifying failure).

## Failure Branches

### Branch A - Alias Validation Fails Before Ingest

Stop the lifecycle chain. Classify failure:

- connectivity/auth/cluster health issue -> fix ops precondition first
- metadata contract evidence -> switch to schema/mapping remediation

### Branch B - Ingest Fails on Metadata Contract

Treat as schema-first contract drift and trace ownership:

1. generator source
2. generated mapping and index-document types
3. runtime mapping application and metadata write path

Then re-run coherence checks from repo root:

```bash
pnpm sdk-codegen
pnpm build
pnpm type-check
```

If upload reached 100% before metadata write failure, run salvage checks before
another full ingest:

1. Validate aliases remain healthy on prior targets.
2. Verify candidate staged version indexes exist and have expected `_count`
   values for all six curriculum index families.
3. Confirm `oak_meta` mapping contains `previous_version`.
4. Repair metadata/alias coherence before any promote:
   - run `admin validate-aliases` and `admin meta get`
   - reconcile `oak_meta.version` to current live alias target version
   - read back and confirm coherence
5. Derive one staged candidate version from evidence using this deterministic rule:
   - present in all six index families
   - newer than live alias version
   - if multiple remain, choose lexicographically greatest
6. Validate staged-version freshness:
   - if `baseline-summary.md` reflects a previous run, regenerate Stage 0.5
     evidence and re-derive `staged_version` before promote.
7. Attempt promote only after steps 1-6 pass:

```bash
cd apps/oak-search-cli
: "${EVIDENCE_DIR:?Set EVIDENCE_DIR from Step 0.5 first block}"
STAGED_VERSION="$(awk -F': ' '/staged_version/ {print $2}' "${EVIDENCE_DIR}/baseline-summary.md")"
set -a && source "../../.env" && set +a
for INDEX in $(jq -r --arg version "${STAGED_VERSION}" '.[] | .index | select(test("_" + $version + "$"))' "${EVIDENCE_DIR}/target-versioned-index-counts.json"); do
  curl -sS -H "Authorization: ApiKey ${ELASTICSEARCH_API_KEY}" \
    "${ELASTICSEARCH_URL}/${INDEX}/_count";
done
pnpm tsx bin/oaksearch.ts admin promote --target-version "${STAGED_VERSION}"
pnpm tsx bin/oaksearch.ts admin validate-aliases
pnpm tsx bin/oaksearch.ts admin meta get
for _ in 1 2 3 4 5 6; do
  pnpm tsx bin/oaksearch.ts admin count && break
  sleep 5
done
```

### Branch C - Post-Ingest Alias Health Fails

Treat as active incident, not closeout. Repair alias target health, then re-run
validation before any docs/reviewer/gate closeout work.

### Branch D - Promote timeout/failure after mutation begins

If promote times out or exits non-zero:

1. Stop immediately (no retry/rollback/unlock yet).
2. Run mandatory readback triage:

```bash
cd apps/oak-search-cli
pnpm tsx bin/oaksearch.ts admin validate-aliases
pnpm tsx bin/oaksearch.ts admin meta get
pnpm tsx bin/oaksearch.ts admin count
```

3. Decide retry/rollback only after readback evidence is captured.
4. If alias action-level results are surfaced and report partial failure
   (`errors: true` or failed action status), treat this as an immediate incident
   regardless of top-level acknowledgement.

## Post-Success Closeout Order (Do Not Reorder)

1. Recovery plan Phase 2 guardrails (tests first, then implementation).
2. Recovery plan Phase 3 docs/ADR propagation.
3. Recovery plan Phase 4 specialist reviewers:
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
4. Full one-gate-at-a-time quality sequence from repo root.

### Next Session Remediation Focus (Before New Ingest Attempts)

Use the authoritative remediation scope in recovery plan **Task 2.3** and the
authoritative reviewer/gate closure in recovery plan **Phase 4**. This runbook
does not duplicate those lists to avoid drift.

When recording remediation and re-review outcomes, tag notes with finding IDs
from the register (`R1` to `R9`) so status remains traceable across prompt,
runbook, and execution plan.

## Evidence Requirements (First Successful Migration)

Required evidence set:

1. Pre-ingest `validate-aliases` output.
2. Operator-run `versioned-ingest` output with exit code.
3. Post-ingest readback set: `validate-aliases`, `meta get`, `count`.
4. Confirmation that `previous_version` strict mapping failure path is absent.
5. Phase 0 evidence directory path plus `baseline-summary.md`.
6. Confirmation alias targets are concrete and healthy after ingest.

## Current Execution Snapshot (13 March 2026)

Observed in this session:

1. Baseline captured on branch `feat/es_index_update`.
2. Boundary guardrail lint checks pass (no blocking errors).
3. Bootstrap alias validation passes; all aliases healthy.
4. Operator ingest run for `v2026-03-12-175109` reached 100% upload and logged
   `Bulk upload completed successfully`, then failed on metadata commit with:
   `strict_dynamic_mapping_exception` for dynamic introduction of
   `previous_version` in strict `oak_meta`.
5. Read-only mapping check confirmed live `oak_meta` mapping does not yet
   include `previous_version`.
6. Alias validation remains healthy and still points to prior targets.
7. Candidate staged version indexes for `v2026-03-12-175109` exist with
   expected true parent `_count` values across all six index families.

Immediate next action:

- Continue the recovery lane from Phase 2 guardrails using the rebuilt
  lifecycle lease and strict mapping-contract checks, then complete
  docs/ADR closeout and full-gate verification before the next full
  operator-run lifecycle proof.
