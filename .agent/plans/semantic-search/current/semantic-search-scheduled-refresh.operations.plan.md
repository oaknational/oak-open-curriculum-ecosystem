---
name: "Semantic Search Scheduled Refresh Operations"
overview: "Deliver incremental-first refresh with full re-ingest fallback, per-document fingerprinting, Bulk API partial-update optimisation for semantic_text fields, and measurable gates."
supersedes: "semantic-search-nightly-full-reingest.operations.plan.md"
todos:
  - id: phase-0-contract
    content: "Phase 0 RED: Define operational invariants, diff model, and prove failure modes."
    status: pending
  - id: phase-1-fingerprint
    content: "Phase 1 GREEN: Implement per-document fingerprinting and diff computation."
    status: pending
  - id: phase-2-incremental
    content: "Phase 2 GREEN: Implement incremental update path with Bulk API partial-update optimisation."
    status: pending
  - id: phase-3-automation
    content: "Phase 3 GREEN: Implement scheduler entrypoint with decision logic, lock, and retry policy."
    status: pending
  - id: phase-4-observability
    content: "Phase 4 GREEN: Add telemetry, SLOs, and alerting."
    status: pending
  - id: phase-5-refactor-docs
    content: "Phase 5 REFACTOR: Consolidate runbooks, README guidance, ADR, and ownership model."
    status: pending
  - id: phase-6-closeout
    content: "Phase 6 closeout: reviewer passes and full quality gates."
    status: pending
---

# Semantic Search Scheduled Refresh Operations

**Last Updated**: 2026-03-13
**Status**: PLANNING
**Scope**: Deliver a deterministic scheduled refresh service using incremental
updates as the primary path, with full re-ingest as a mandatory fallback for
mapping changes and recovery.
**Supersedes**: `semantic-search-nightly-full-reingest.operations.plan.md`

---

## Document Authority

- `semantic-search.prompt.md` is the session bootstrap and lane-ordering authority.
- `semantic-search-recovery-and-guardrails.execution.plan.md` owns recovery
  lifecycle invariants and the lock contract this plan consumes.
- This plan is the execution authority for scheduled-refresh design and delivery.
- ADR-136 remains doctrine authority for incremental-refresh behaviour.

---

## Deliverable Boundary

This plan delivers:

- per-document fingerprinting and diff computation
- incremental update path using Bulk API partial-update optimisation
- full re-ingest path (retained as fallback/mandatory for mapping changes)
- decision logic that selects the correct path per run
- invariants, safety gates, and failure escalation
- telemetry and alerts
- runbooks and escalation

This plan does **not** provision scheduler infrastructure directly. Scheduling
configuration is an environment-owner responsibility after this plan's outputs
are proven.

---

## Execution Context

Doctrine and long-lived design rationale are canonical in
`docs/architecture/architectural-decisions/136-incremental-refresh-bulk-api-partial-update-doctrine.md`.
This plan focuses on executable sequencing, acceptance criteria, and closeout.

Execution starts only after recovery-lane prerequisites are proven:

1. metadata-alias coherence restored
2. `previous_version` present in live `oak_meta` mapping
3. alias health validated across all six families
4. distributed lifecycle lock contract operational

The scheduled refresh automation must not start from a drifted baseline.

---

## Foundation Alignment Commitment

Before each phase:

1. Re-read `.agent/directives/principles.md`
2. Re-read `.agent/directives/testing-strategy.md`
3. Re-read `.agent/directives/schema-first-execution.md`
4. Re-ask: **Could it be simpler without compromising quality?**

---

## Non-Goals

- Provisioning cron/CI scheduler resources directly.
- Cross-cluster or snapshot-driven orchestration assumptions.
- Allowing unattended promote without preflight and postcheck evidence.
- CDC-style streaming ingestion from an upstream event bus.

---

## Execution Model (Condensed)

Authoritative doctrine lives in ADR-136. This plan enforces it through
executable tasks and acceptance gates.

Two-path model:

1. Full re-ingest (`stage -> validate -> promote`) for mapping changes, missing
   baseline, periodic baseline refresh, or recovery.
2. Incremental update for bounded deltas when invariants and mapping hash checks
   pass.

Execution constraints:

- incremental bulk updates omit all `semantic_text` fields on metadata-only
  updates
- Update API (`_update` endpoint) is prohibited for this lane
- incremental writes target aliases (`require_alias=true`)
- fingerprint generation/diffing must use canonical Bulk `_id` identity mapping
- on incremental failure, escalate deterministically to full re-ingest

---

## Failure Mode Classification and Escalation

All failure modes escalate to full re-ingest as the recovery path. This is the
simplest model and avoids complex partial-failure reconciliation.

| Failure | Classification | Action |
|---|---|---|
| Fingerprint comparison fails | Non-critical | Fall back to full re-ingest |
| Mapping hash mismatch | Mandatory full | Full re-ingest (new indexes required) |
| Bulk partial update returns document errors | Retryable | Retry failed docs per ADR-096; if persistent, full re-ingest |
| Bulk delete returns errors | Retryable | Retry; if persistent, full re-ingest |
| Post-update count validation fails | Active incident | Full re-ingest to known-good state |
| Incremental update leaves inconsistent state | Active incident | Alias-swap to previous-version indexes, then full re-ingest |
| Fingerprint write fails after successful live mutation | Active incident | Full re-ingest to re-establish both index state and fingerprint baseline |
| One or more index families fail during incremental update | Active incident | Alias-swap rollback to previous-version indexes for all families, then full re-ingest. Do not update fingerprint for any family |
| Bulk download fails or returns partial/corrupt data | Ops precondition | Abort before diff computation; no mutation attempted. Retry download or alert |
| Fingerprint parseable but semantically corrupt (wrong hashes/IDs) | Active incident | Detected by aggregate hash validation mismatch; fall back to full re-ingest |
| Previous-version indexes missing (deleted or cleaned up) | Ops precondition | Block incremental path; force full re-ingest to re-establish rollback baseline |
| Lock expires during long incremental run | Active incident | Define lock TTL longer than maximum expected run duration; implement lock renewal. If expired mid-run, halt and triage |
| Lock renewal fails during long run | Active incident | Halt immediately; do not continue mutations; release lock if still held; triage before retry |
| Full re-ingest repeatedly fails (3+ consecutive within 24 h) | Escalation | Alert, human triage, cluster/storage health checks. Previous-version indexes remain live; search continues on last successful ingest |
| Lock acquisition fails | Blocked | Wait and retry; do not proceed |
| Preflight invariant failure | Ops precondition | Fix precondition; do not proceed |

### Rollback for incremental updates

1. Record alias targets before incremental update begins.
2. Previous-version indexes from the last full re-ingest are retained.
3. On failure: atomic alias swap to previous-version indexes using a single
   multi-action Aliases API call (all six aliases swap together). Do not
   issue separate per-alias swaps, which risk partial rollback on mid-call
   failure.
4. Then: full re-ingest from current bulk data to restore clean state.

**Invariant**: Previous-version indexes must not be deleted until the next
successful full re-ingest completes.

**Commit boundary**: Fingerprint baseline persistence is part of the
operational commit boundary. If the live index mutation succeeds but the
fingerprint write fails, the system is in an inconsistent state where
successive incremental runs will re-apply the same changes or miss them.
Recovery: treat a failed fingerprint write after successful live mutation as
an operational incident requiring immediate full re-ingest to re-establish
both the index state and fingerprint baseline from a clean starting point.

---

## TDD Execution Plan

### Phase 0 — RED: Operational Contract and Preconditions

#### Task 0.1 — Define invariant checklist

Required invariants (carried forward and extended):

1. `oak_meta` mapping contains `previous_version`.
2. Metadata version equals live alias target version.
3. All six aliases are healthy before any update.
4. Single-run lock exists (no overlapping lifecycle jobs).
5. Alias swap actions enforce `must_exist=true`.
6. Mapping hash matches between generated and live (for incremental path).
7. Partial updates to documents with `semantic_text` fields MUST use the Bulk
   API `update` action, never the Update API (`_update` endpoint).
8. Previous-version indexes must exist before incremental path is allowed.
   If missing, force full re-ingest to re-establish rollback baseline.
9. Stored fingerprint integrity: validate `aggregate_hash` matches
   recomputed value from stored per-document hashes before applying
   incremental updates. Mismatch triggers full re-ingest.
10. Bulk download integrity: validate downloaded data before diff computation.
    Validation includes manifest completeness (all expected files present),
    JSON parse success for each file, and per-family document count sanity
    checks. Partial or corrupt downloads abort the run before any mutation.

**Acceptance Criteria**

1. Invariants are codified as executable checks.
2. Failures have explicit remediation guidance.
3. Job halts before any mutation if any invariant fails.

#### Task 0.1b — Benchmark full re-ingest cost

Measure current full re-ingest runtime, ELSER inference volume, and
Serverless metering cost. Define a stop/go threshold: if incremental
savings are marginal (e.g. less than 30% reduction in inference volume for
the typical delta size), abandon the incremental path and retain ADR-130 as
the sole refresh model.

**Acceptance Criteria**

1. Baseline measurements documented (runtime, inference requests, cost).
2. Projected incremental savings quantified for typical delta sizes.
3. Go/no-go decision recorded before Phase 1 begins.

#### Task 0.1c — Lint-time enforcement of Update API prohibition

Add a static-analysis check (custom ESLint rule)
that prohibits `esClient.update()` / `client.update()` calls in the search
CLI and SDK admin codepaths. This enforces the hard invariant from ADR-136
at lint time, not just via tests.

**Acceptance Criteria**

1. Direct Update API calls in search/admin code are flagged by the linter.
2. The check runs as part of the standard `pnpm lint` gate.
3. False positives (e.g. unrelated `update` methods) are documented.

#### Task 0.2 — Prove diff model with test fixtures

Create test fixtures that exercise all five diff classifications (new, removed,
unchanged, metadata-only, semantic change) across at least two index families
(one with `semantic_text`, one without).

**Acceptance Criteria**

1. Unit tests exist for each classification.
2. Tests prove that metadata-only changes produce `update` actions without
   `semantic_text` fields.
3. Tests prove that semantic changes produce `index` actions with all fields.

#### Task 0.3 — Prove mapping-change detection

**Acceptance Criteria**

1. Mapping hash computation is deterministic.
2. Any field addition, analyser change, or `semantic_text` configuration change
   produces a different mapping hash.
3. Mapping hash mismatch triggers mandatory full re-ingest path.

---

### Phase 1 — GREEN: Per-Document Fingerprinting

#### Task 1.1 — Implement fingerprint generation

Implement fingerprint computation in the transform pipeline:

- Deterministic JSON serialisation of each transformed document.
- SHA-256 per document (content hash).
- SHA-256 of semantic source text per document (semantic hash) for families
  with `semantic_text` fields.
- Mapping hash from generated ES mapping definitions.
- Aggregate hash from sorted per-document hashes.

**Acceptance Criteria**

1. Fingerprint generation is deterministic across repeated runs on unchanged
   input.
2. Any content change in a document changes its content hash.
3. A change to semantic source text changes the semantic hash.
4. A metadata-only change does NOT change the semantic hash.

**Deterministic Validation**

```bash
cd apps/oak-search-cli
# Generate fingerprint twice on unchanged data
pnpm tsx bin/oaksearch.ts admin fingerprint --bulk-dir ./bulk-downloads
pnpm tsx bin/oaksearch.ts admin fingerprint --bulk-dir ./bulk-downloads
# Expected: identical output both times
```

#### Task 1.2 — Implement diff computation

Pure function: given two fingerprints, produce a classified diff.

**Acceptance Criteria**

1. All five document-level classifications are produced correctly.
2. Mapping hash mismatch produces a "mandatory full re-ingest" signal.
3. Empty diff (all unchanged) produces a "skip" signal.
4. Diff output includes per-family summary counts.

---

### Phase 2 — GREEN: Incremental Update Path

#### Task 2.1 — Implement Bulk API payload builder for incremental updates

Build NDJSON payload from classified diff:

- `update` actions for metadata-only changes, with `semantic_text` fields
  omitted from the `doc` object.
- `index` actions for semantic changes and new documents, with all fields.
- `delete` actions for removed documents.

Schema-aware field omission must come from a canonical SDK-admin utility (or
equivalent SDK-exported contract), not CLI-local hardcoded family maps.

**Acceptance Criteria**

1. Unit tests prove that `update` payloads do not contain `semantic_text`
   field names.
2. Unit tests prove that `index` payloads contain all fields.
3. NDJSON output is valid and parseable.
4. The `semantic_text` omission contract is sourced from SDK-owned metadata, not
   duplicated in CLI orchestration code.

#### Task 2.2 — Implement incremental update execution

Wire the payload builder into the existing `dispatchBulk` / `uploadAllChunks`
infrastructure.

**Acceptance Criteria**

1. Incremental update uses the same chunking, retry, and rate-limiting as full
   ingest.
2. Document-level errors are classified and retried per ADR-096.
3. Persistent failures trigger escalation signal (fall back to full re-ingest).
4. Post-update count validation runs against live indexes.

**Deterministic Validation**

```bash
cd apps/oak-search-cli
pnpm tsx bin/oaksearch.ts admin validate-aliases
pnpm tsx bin/oaksearch.ts admin incremental-update --bulk-dir ./bulk-downloads
pnpm tsx bin/oaksearch.ts admin validate-aliases
pnpm tsx bin/oaksearch.ts admin count
```

---

### Phase 3 — GREEN: Scheduler Entrypoint and Decision Logic

#### Task 3.1 — Implement path selection logic

Implement the decision tree from the architecture section as a pure function:

Input: current fingerprint, stored fingerprint, mapping hash comparison,
periodic refresh configuration.

Output: `skip` | `incremental` | `full-reingest` with reason.

**Acceptance Criteria**

1. All decision branches are covered by unit tests.
2. Missing fingerprint baseline produces `full-reingest`.
3. Mapping hash mismatch produces `full-reingest`.
4. Periodic refresh due produces `full-reingest`.
5. All unchanged produces `skip`.
6. Any changes with matching mapping hash produces `incremental`.

#### Task 3.2 — Implement scheduler entrypoint

Orchestration sequence:

1. Acquire lock (TTL must exceed maximum expected run duration; renew at
   50% of TTL; if renewal fails, halt immediately). Lock renewal must be
   decoupled from the main execution thread so a stalled main thread does
   not continue renewing.
   **Note**: The recovery-and-guardrails plan (Task 2.2) owns the lock
   contract, including TTL, renewal, and takeover semantics.
2. Preflight invariants (including previous-version index existence and
   download integrity).
3. Bulk data download.
4. Generate new fingerprint.
5. Path selection (skip / incremental / full-reingest).
6. Execute selected path.
7. If incremental fails: escalate to full re-ingest.
8. Postchecks (alias health, counts).
9. Update stored fingerprint (only on success).
10. Release lock.

**Acceptance Criteria**

1. Sequence is deterministic and idempotent per run ID.
2. Promote never runs when stage validation fails (full path).
3. Incremental updates never start when preflight invariants fail.
4. Fingerprint is updated only after successful completion.
5. Lock release follows the same semantics as the recovery-and-guardrails plan.

#### Task 3.3 — Retry and abort policy

- Preflight failure: no retry.
- Incremental bulk transient failures: retry per ADR-096.
- Incremental persistent failure: escalate to full re-ingest (one attempt).
- Full re-ingest stage failure: retry per ADR-096 inside stage.
- Promote failure or timeout: no automatic retry; readback triage, human
  decision.
- Unchanged fingerprint: classify as successful skip.

**Acceptance Criteria**

1. Retry policy is encoded in automation logic, not prose only.
2. Non-retryable classes are explicit.
3. Escalation from incremental to full is automatic and logged.
4. Failed runs produce concise incident payload.

---

### Phase 4 — GREEN: Observability and SLOs

#### Task 4.1 — Emit run telemetry

Per-run fields:

- Run ID, started/ended timestamps.
- Path selected (skip / incremental / full-reingest) with reason.
- For incremental: counts by classification (unchanged, metadata-only, semantic,
  new, removed) per index family.
- For full: staged version, promoted version, previous version.
- Per-index-family counts.
- Preflight status, update/promote status, cleanup failures.

**Acceptance Criteria**

1. Telemetry is emitted for every run, including skips and failures.
2. Payload distinguishes incremental from full paths.
3. Telemetry schema is documented and versioned.

#### Task 4.2 — Define and wire alerts

Minimum alerts:

1. Freshness breach (no successful refresh within agreed window).
2. Alias health failure.
3. Metadata-alias coherence drift.
4. Repeated incremental failures escalating to full.
5. Full re-ingest failure.

Alerting must use Kibana Alerts or external platform alerting; Watcher is out
of scope for Serverless.

**Acceptance Criteria**

1. Alerts route to owned channel/on-call.
2. Alert payload links to remediation runbook.
3. False-positive suppressions are documented and time-bound.

---

### Phase 5 — REFACTOR: Documentation and Ownership

#### Task 5.1 — Update operational docs

Required surfaces:

- `docs/operations/elasticsearch-ingest-lifecycle.md`
- `apps/oak-search-cli/README.md`
- Semantic-search prompt/plan indices for scheduler entrypoint.

**Acceptance Criteria**

1. Both paths (incremental and full) are documented with stop/go steps.
2. Failure escalation is documented in operator language.
3. Ownership and human override rules are explicit.

#### Task 5.2 — ADR and governance touchpoints

ADR-136 is the single doctrine record for this work. Additional ADRs should
only be created if a decision clearly stands alone outside the scheduled
refresh context (e.g. a reusable lock abstraction adopted by other systems).

Update ADR-136 as needed to reflect implementation learnings. Topics
currently captured in ADR-136: Bulk API partial-update semantics,
fingerprint-driven diffing, Update API prohibition, `require_alias=true`,
scripted update prohibition, full re-ingest fallback.

**Acceptance Criteria**

1. ADR-136 reflects the implemented design accurately.
2. ADR index references remain correct.
3. Elastic documentation citations are verified against implementation-date
   docs.
4. No new ADRs created unless a decision clearly transcends scheduled refresh
   scope.

---

### Phase 6 — Closeout

#### Task 6.1 — Specialist reviewer passes

Required reviewers:

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
- `release-readiness-reviewer`

#### Task 6.2 — Full quality gates

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

**Closeout Criteria**

1. At least one end-to-end scheduled dry run succeeds using incremental path.
2. At least one end-to-end scheduled dry run succeeds using full re-ingest path.
3. Escalation from incremental to full is proven in a failure-injection test.
4. Alerts trigger and route correctly during injected failure tests.
5. Documentation remains coherent across roadmap/prompt/active index.

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Partial update silently drops semantic_text fields | Stale embeddings served | Post-update semantic search spot-check in validation |
| Fingerprint computation is non-deterministic | False-positive diffs trigger unnecessary work | Deterministic JSON serialisation; test with repeated runs |
| Incremental failure corrupts live index | Degraded search until recovery | Previous-version indexes retained; alias-swap rollback |
| Mapping hash miss (hash doesn't capture a relevant change) | Incremental applied when full required | Hash includes all mapping definition content |
| Scheduler overlap | Alias/meta corruption risk | Enforced distributed lock and overlap rejection |
| Accumulated drift from many incremental runs | Subtle data quality issues | Periodic mandatory full re-ingest baseline |
| Full re-ingest repeatedly fails | Cannot refresh data; search serves stale content | Previous-version indexes remain live; alert and escalate to human triage |
| Lock expires mid-run | Concurrent lifecycle operations possible | TTL exceeds max run duration; renewal mechanism; halt if expired |
| Corrupt fingerprint baseline | Incorrect incremental diffs | Aggregate hash validation before incremental path |

---

## References

- [Elastic: Ingest data with semantic\_text fields](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/semantic-text-ingestions)
- [Elastic: Aliases](https://www.elastic.co/docs/manage-data/data-store/aliases)
- [Elastic: Serverless comparison](https://www.elastic.co/docs/deploy-manage/deploy/elastic-cloud/differences-from-other-elasticsearch-offerings)
- `.agent/directives/principles.md`
- `.agent/directives/testing-strategy.md`
- `.agent/directives/schema-first-execution.md`
- `docs/operations/elasticsearch-ingest-lifecycle.md`
- `docs/architecture/architectural-decisions/130-blue-green-index-swapping.md`
- `docs/architecture/architectural-decisions/136-incremental-refresh-bulk-api-partial-update-doctrine.md`
- `docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md`
- `.agent/plans/semantic-search/active/semantic-search-recovery-and-guardrails.execution.plan.md`
