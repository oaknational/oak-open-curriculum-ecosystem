---
name: "Semantic Search Recovery and Guardrails"
overview: "Recover lifecycle integrity, salvage staged data safely, and harden code plus operations so metadata/alias drift cannot recur."
todos:
  - id: phase-0-baseline
    content: "Phase 0 RED: Re-establish live truth and prove current failure modes with deterministic evidence."
    status: completed
  - id: phase-1-recovery-green
    content: "Phase 1 GREEN: Implement safe recovery path and salvage promotion with metadata-alias coherence enforced."
    status: completed
  - id: phase-2-guardrails-green
    content: "Phase 2 GREEN: Add code-level invariant checks, lifecycle preflight gates, and alias-swap safety hardening."
    status: in_progress
  - id: phase-3-refactor-docs
    content: "Phase 3 REFACTOR: Consolidate docs, ADR updates, and runbook propagation."
    status: pending
  - id: phase-4-closeout
    content: "Phase 4 closeout: specialist reviews and full quality gates."
    status: pending
---

# Semantic Search Recovery and Guardrails

**Last Updated**: 2026-03-15  
**Status**: 🟢 IN PROGRESS  
**Scope**: Recover the broken Elasticsearch lifecycle state and implement permanent guardrails across code, tests, docs, and operations.

---

## Context

The current incident is not only a failed ingest commit. It is a lifecycle integrity problem:

1. `oak_meta` mapping is strict and missing `previous_version`.
2. Generated mapping and generated metadata schema already include `previous_version`.
3. Alias state and metadata state have drifted (`oak_meta.version` does not match live alias targets).
4. Staged version index families exist and are salvageable, but promotion is unsafe without coherence repair.

### Root Cause Summary

- **Primary drift**: `oak_meta` is created idempotently and existing mappings are not reconciled when generated mappings evolve.
- **Secondary drift**: lifecycle flow trusts metadata as previous-version truth even when alias targets have moved.
- **Guardrail gap**: lifecycle preflight does not fail fast on mapping drift and metadata-alias mismatch.

## Document Authority

- This plan is the execution authority for recovery tasks and phase closure.
- `semantic-search.prompt.md` is the session bootstrap and lane-ordering authority.
- `semantic-search-ingest-runbook.md` is the operator-run stop/go checklist for ingest, promote, and triage sequencing.
- `cli-robustness.plan.md` is supporting historical incident evidence only.

---

## Foundation Alignment Commitment

Before each phase:

1. Re-read `.agent/directives/principles.md`
2. Re-read `.agent/directives/testing-strategy.md`
3. Re-read `.agent/directives/schema-first-execution.md`
4. Ask: **Could it be simpler without compromising quality?**
5. Enforce: no compatibility layers, no type shortcuts, fail-fast diagnostics

---

## Non-Goals

- Rebuilding unrelated semantic-search streams.
- Introducing fallback dynamic mapping behaviour.
- Accepting metadata-alias drift as an operational norm.
- Reducing guardrails to docs-only without runtime enforcement.

---

## Execution Dependencies

Blocking prerequisites before Phase 0:

1. Repo-root `.env` resolves `ELASTICSEARCH_URL` and `ELASTICSEARCH_API_KEY`.
2. Operator can run admin lifecycle commands in `apps/oak-search-cli`.
3. Recovery evidence directory exists under `apps/oak-search-cli/recovery-evidence/`.
4. No concurrent lifecycle run is active while lock guardrails are not yet landed.

Entry criteria between phases:

- **Phase 0 -> Phase 1**: immutable baseline evidence pack exists and proves mapping/metadata/alias state.
- **Phase 1 -> Phase 2**: incident is closed (promote complete, postchecks healthy, no open alias-corruption branch).
- **Phase 2 -> Phase 3**: invariant and lock guardrail tests are green at
  unit+integration levels and Task 2.3 remediation is complete. Phase 3 may
  start before Phase 2 closeout gates are complete, but only after those
  conditions are met.
- **Phase 3 -> Phase 4**: docs and ADR surfaces are aligned with implementation and lane ordering.

---

## Cross-Phase Mandatory Review Loop

This review loop is mandatory before new implementation work, independent of
phase ordering:

1. Run the full reviewer roster defined in Phase 4 Task 4.1 in read-only mode.
2. Implement findings by default; reject only as incorrect with written
   rationale and evidence.
3. Re-run affected reviewers iteratively until no unresolved must-fix/high
   findings remain.

This section is the canonical owner of the "next-session start" review loop.
Prompt and runbook references must point here rather than restating policy.

---

## TDD Execution Plan

### Phase 0 - RED: Baseline and Failure Proofs

#### Task 0.1 - Capture deterministic live baseline

**Acceptance Criteria**

1. Alias health and targets captured.
2. `oak_meta` document captured.
3. `oak_meta` mapping captured.
4. Staged candidate counts captured for all six index families.
5. Evidence is written to one timestamped directory and never edited in place.

**Deterministic Validation**

Execute `semantic-search-ingest-runbook.md` Step 0.5 exactly as written.

**Task Complete When**

- The four command outputs above are captured in `${EVIDENCE_DIR}` and a short
  `baseline-summary.md` records candidate staged version, live alias version,
  and mapping presence/absence for `previous_version` using those exact keys:
  `staged_version`, `live_alias_version`, `previous_version_in_mapping`.
- `staged_version` is derived from `target-versioned-index-counts.json`, not from
  `admin count` output (which reports live alias targets only).

#### Task 0.2 - Prove missing guardrails in code/tests

**Acceptance Criteria**

1. Tests exist that fail when metadata version disagrees with live aliases.
2. Tests exist that fail when lifecycle preflight sees missing `previous_version` mapping.
3. Tests exist that fail when alias swap action results contain partial failures.
4. RED evidence explicitly records expected failing assertions and non-zero exit.

**Deterministic Validation**

```bash
# RED proof: this phase is complete only when these commands fail for the new
# guardrail tests before implementation lands.
pnpm --filter @oaknational/oak-search-sdk test
pnpm --filter @oaknational/search-cli test
```

**Task Complete When**

- At least one new guardrail test fails in each affected workspace with a
  failure message matching the intended invariant breach.

#### Phase 0 Closeout Gate (RED evidence)

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
pnpm test # expected non-zero for new RED guardrail tests; capture failure output
pnpm test:e2e
pnpm test:ui
pnpm smoke:dev:stub
```

If any gate fails, fix and restart this sequence from `pnpm secrets:scan:all`.

---

### Phase 1 - GREEN: Safe Recovery and Salvage

#### Task 1.1 - Add explicit recovery command sequence support

Implement CLI-admin-supported, deterministic recovery flow:

1. read-only preflight
2. mapping reconciliation (additive `put mapping`)
3. metadata-alias coherence repair
4. deterministic staged-version selection and salvage promote
5. hard postchecks
6. ambiguous-state triage branch for any promote timeout/failure before unlock or retry

Preflight command order is authoritative in
`semantic-search-ingest-runbook.md` Steps 0 to 3.5.

**Acceptance Criteria**

1. Recovery sequence is executable without manual hidden steps.
2. Metadata repair is explicit and validated before promotion.
3. Promote and `versioned-ingest` both fail fast if coherence is not established.
4. Any failure after swap/write runs immediate readback (`validate-aliases`, `meta get`, `count`) before any retry, rollback, or lock release.
5. Selected staged version is derived from the Phase 0 evidence pack using one deterministic rule.
6. Metadata/alias coherence is read back and proven before promote.
7. Mapping reconciliation validates the full generated `oak_meta` metadata
   contract (with `previous_version` as a sentinel, not as the only check).
8. Reconciliation is limited to additive `PUT _mapping` changes; any
   non-additive drift triggers new-index/reindex workflow rather than
   in-place patching.

**Deterministic staged-version selection rule**

Select exactly one candidate version using this rule, in order:

1. Candidate appears in all six index families in Phase 0 evidence.
2. Candidate is newer than current live alias version.
3. If multiple candidates qualify, choose the lexicographically greatest
   version string and record the reason in evidence notes.
4. Before promote, `oak_meta.version` must equal the current live alias target
   version and `previous_version_in_mapping` must be `true`.
5. Candidate completeness must be proven with `_count` checks on concrete staged
   indexes for all six families before promote.

**Deterministic Validation**

Execute `semantic-search-ingest-runbook.md` Branch B salvage sequence exactly
as written.

**Task Complete When**

- Promote succeeds for `${STAGED_VERSION}` with healthy postchecks and no
  undocumented manual remediation step.
- Alias action results are fully successful (`errors: false`) when surfaced; if
  action-level status is unavailable, treat the operation as provisional and
  require immediate readback triage before closeout.

#### Task 1.2 - Close incident using salvage-first path

**Acceptance Criteria**

1. Aliases end on promoted staged version.
2. `oak_meta.version` equals promoted version.
3. `oak_meta.previous_version` equals pre-promote live version.
4. No alias corruption branch remains open.
5. Post-mutation failure branch is deterministic and executed before unlock/retry.

**Post-mutation triage branch predicate and commands**

Trigger triage immediately if any promote step times out, exits non-zero, or
returns partial alias-action failures.

```bash
cd apps/oak-search-cli
pnpm tsx bin/oaksearch.ts admin validate-aliases
pnpm tsx bin/oaksearch.ts admin meta get
pnpm tsx bin/oaksearch.ts admin count
```

No retry, rollback, or lock release is allowed before these readbacks complete.

**Deterministic Validation**

```bash
cd apps/oak-search-cli
pnpm tsx bin/oaksearch.ts admin validate-aliases
pnpm tsx bin/oaksearch.ts admin meta get
pnpm tsx bin/oaksearch.ts admin count
```

**Task Complete When**

- `validate-aliases` is healthy, metadata versions are coherent, and triage
  protocol is proven in evidence.

#### Phase 1 Closeout Gate (required)

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

If any gate fails, fix and restart this sequence from `pnpm secrets:scan:all`.

---

### Phase 2 - GREEN: Permanent Guardrails

#### Task 2.1 - Lifecycle invariant enforcement in SDK/CLI

Implement fail-fast invariants:

- metadata version must match live alias target version before promote
- required `oak_meta` mapping fields must be present before write paths
- alias swap API calls must set `must_exist=true`
- alias swap API response must reject any partial-success action list (`errors: true` or non-200 action result)

**Acceptance Criteria**

1. Invariant failures return explicit remediation guidance.
2. No silent continuation on incoherent state.
3. Coverage added at unit + integration levels.
4. RED tests are promoted to GREEN with no test skips or compatibility paths.

**Deterministic Validation**

```bash
pnpm --filter @oaknational/oak-search-sdk type-check
pnpm --filter @oaknational/oak-search-sdk lint
pnpm --filter @oaknational/oak-search-sdk test
pnpm --filter @oaknational/search-cli test
```

**Task Complete When**

- Guardrail behaviour is enforced in runtime code and proven by passing unit and
  integration tests in both SDK and CLI.

#### Task 2.2 - Operational lock and concurrency guardrail

Define and implement a distributed Elasticsearch-backed lease for lifecycle operations, not a process-local lock:

- acquire via `_create` (or `op_type=create`) on a dedicated lock document
- include `run_id`, holder, `acquired_at`, and `expires_at`
- renew/release with `if_seq_no` and `if_primary_term`

**Contract ownership**: This recovery lane owns the lifecycle lock contract.
TTL, renewal, expiry takeover, and resource-kind disambiguation are recovery
invariants. Downstream automation (scheduled refresh) consumes this contract.

**Acceptance Criteria**

1. Concurrent lifecycle invocations are blocked deterministically.
2. Lock supports configurable TTL with `expires_at` and renewal via
   `if_seq_no`/`if_primary_term`.
3. Lock renewal failure halts the run immediately.
4. Error message explains active lock holder and retry strategy.
5. Lock release semantics are documented and tested.
6. In-memory locks, local temp files, and CI-local mutexes are rejected as invalid implementations.
7. Expired lease takeover is deterministic and OCC-protected (read incumbent, prove expiry, delete with OCC, reacquire).
8. Lease bootstrap disambiguates resource kind (`index` vs `alias` vs `data_stream`) and fails fast on non-index collisions.
9. Lock ownership boundary is explicit: concurrency primitives live in the SDK
   admin boundary, with CLI orchestrating usage rather than owning lock semantics.
10. Lock end-state error precedence is deterministic: lease release failures are
    surfaced when lease state may remain held.

**Deterministic Validation**

```bash
pnpm --filter @oaknational/oak-search-sdk type-check
pnpm --filter @oaknational/oak-search-sdk lint
pnpm --filter @oaknational/oak-search-sdk test
pnpm --filter @oaknational/search-cli type-check
pnpm --filter @oaknational/search-cli lint
pnpm --filter @oaknational/search-cli test
```

**Task Complete When**

- A concurrent second lifecycle attempt is rejected deterministically while the
  first holder keeps a valid lease, and renewal failure halts execution.
- Expired-lock takeover semantics are documented: read lock, fail when
  unexpired, and replace only with OCC (`if_seq_no`/`if_primary_term`) once
  expiry is proven.
- Lock semantics are exposed through canonical SDK admin surfaces so all admin
  consumers (not only the CLI) inherit the same concurrency guarantees.

#### Task 2.3 - Test taxonomy, behaviour-proof quality, and type discipline remediation

Apply the currently-known correctness findings to the lifecycle/admin/retrieval
test surfaces before further feature work in this lane.

**Mandatory review-loop reference**

Apply `Cross-Phase Mandatory Review Loop` before new implementation work in this
task scope.

**Remaining scope required for Phase 2 -> Phase 3 entry**

1. Reclassify misnamed tests so unit tests remain pure/no-mock:
   - move IO/mocked cases out of `*.unit.test.ts` into
     `*.integration.test.ts` where required
   - keep only pure-function tests in unit files
2. Remove implementation-constraining assertions unless they prove an explicit
   external contract:
   - avoid brittle `toHaveBeenCalledWith(...)` and JSON-string payload checks
     when behaviour-level assertions are sufficient
3. Eliminate type shortcuts in tests:
   - remove `as unknown as ...` in retrieval test helpers/mocks
   - remove `Object.*` mutation patterns used to fabricate ES-like errors
   - prefer library-native error types (`errors.ResponseError`) and
     compile-time-safe helper builders
4. Keep DI simple:
   - fakes must stay injected through function/deps boundaries
   - avoid complex fake factories that hide product behaviour behind test logic
5. Apply architecture findings on boundary simplification:
   - remove duplicated metadata-contract ownership across CLI and SDK admin
     lanes so one canonical owner remains
   - remove alias-only fake ingest shims by tightening lifecycle dependency
     contracts for alias-only operations

**Acceptance Criteria**

1. Unit tests that remain under `*.unit.test.ts` contain no mocks and no IO.
2. Integration tests prove product behaviour and do not over-constrain
   implementation details.
3. No `as unknown as`, `Object.assign`, `Object.*`, or ad-hoc error-like shape
   mutation remains in touched test files.
4. Test fixtures and fakes are simple, injected, and focused on contract
   behaviour at module boundaries.
5. Updated tests pass and maintain meaningful failure messages.

**Deterministic Validation**

```bash
pnpm --filter @oaknational/search-cli type-check
pnpm --filter @oaknational/search-cli lint
pnpm --filter @oaknational/search-cli test
pnpm --filter @oaknational/oak-search-sdk type-check
pnpm --filter @oaknational/oak-search-sdk lint
pnpm --filter @oaknational/oak-search-sdk test
```

**Task Complete When**

- All known findings in the active lifecycle/retrieval test surfaces are either
  implemented or explicitly rejected as incorrect with written rationale and
  evidence.
- Test taxonomy and behavioural-proof standards match
  `.agent/directives/testing-strategy.md` and `.agent/directives/principles.md`.

#### Reviewer Findings Register (round 1, 2026-03-14)

Disposition rule for this register: findings are **actionable by default**.
Items may be marked `rejected_as_incorrect` only with written rationale and
evidence in this section.

| ID | Reviewer source(s) | Severity | Disposition | Required action |
|---|---|---|---|---|
| R1 | `architecture-reviewer-wilma`, `code-reviewer` | blocker | actionable | In `packages/sdks/oak-search-sdk/src/admin/lifecycle-promote.ts`, on post-swap alias validation failure, run rollback to original targets before returning error; add integration coverage for rollback-on-validation-failure and CRITICAL rollback-failure branch. |
| R2 | `architecture-reviewer-barney`, `architecture-reviewer-betty`, `architecture-reviewer-fred` | high | actionable | Move distributed lifecycle lease ownership from CLI to SDK admin boundary (`packages/sdks/oak-search-sdk/src/admin/**`), export canonical admin lease surface, and make CLI orchestrate consumption only. |
| R3 | `architecture-reviewer-barney`, `architecture-reviewer-betty`, `architecture-reviewer-fred` | high | actionable | Remove duplicate metadata mapping-contract ownership from CLI; consolidate canonical mapping-contract enforcement in SDK admin metadata write path; keep one owner for metadata contract invariants. |
| R4 | `architecture-reviewer-barney`, `architecture-reviewer-fred` | high | actionable | Remove alias-only `noOpIngest` compatibility shim in `apps/oak-search-cli/src/cli/admin/admin-lifecycle-alias-commands.ts` by tightening lifecycle dependency contracts for alias-only operations. |
| R5 | `elasticsearch-reviewer`, `security-reviewer`, `architecture-reviewer-wilma` | high | actionable | Make lease renewal failure a hard stop for mutating lifecycle operations and prevent releasing lock before required post-mutation triage when mutation started and operation failed. |
| R6 | `elasticsearch-reviewer` | high | actionable | Enforce metadata/alias coherence precondition before promote/versioned-ingest/rollback mutation paths: fail fast unless `oak_meta.version` matches live alias target version. |
| R7 | `test-reviewer`, `type-reviewer` | high | actionable | Complete Task 2.3 test taxonomy/type discipline fixes: rename misclassified `*.unit.test.ts` files to `*.integration.test.ts`, split mixed unit/integration test files, remove `as unknown as`, remove `Object.*` mutation patterns in touched tests. |
| R8 | `code-reviewer` | high | actionable | Update legacy metadata write path in `apps/oak-search-cli/src/lib/elasticsearch/setup/ingest-output.ts` to preserve `previous_version` lineage and avoid regression under strict metadata contract evolution. |
| R9 | `docs-adr-reviewer`, `architecture-reviewer-fred`, `security-reviewer` | high | actionable | Align docs/ADR with implemented runtime semantics: remove stale pre-lock wording, document active lease behaviour and recovery guidance, and ensure phase-status sequencing reflects phase-entry gates. |

Rejected-as-incorrect findings:

- None currently. Any future rejection must include: finding ID, rationale,
  counter-evidence, and approving owner decision.

#### Phase 2 Closeout Gate (required)

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

If any gate fails, fix and restart this sequence from `pnpm secrets:scan:all`.

---

### Phase 3 - REFACTOR: Documentation and ADR Propagation

#### Task 3.1 - Update canonical docs

Required surfaces:

- `docs/operations/elasticsearch-ingest-lifecycle.md`
- `apps/oak-search-cli/README.md`
- semantic-search prompt and lane indices where entry ordering changed

**Acceptance Criteria**

1. Recovery sequence is documented as stop/go steps with abort conditions.
2. Guardrail invariants are documented in operator and developer language.
3. No contradictory flow remains in active plans, roadmap, or prompt.

**Deterministic Validation**

```bash
pnpm markdownlint:root
```

Task-level deterministic validation is markdownlint; semantic consistency and
cross-doc doctrine alignment are validated in Phase 4 via `docs-adr-reviewer`
and full reviewer convergence.

**Task Complete When**

- The listed docs are updated and mutually consistent with phase ordering,
  guardrails, and operator protocol.

#### Task 3.2 - ADR update/new ADR

Document lifecycle invariants and metadata-alias coherence doctrine in ADR updates, including:

- update to [ADR-130](../../../../docs/architecture/architectural-decisions/130-blue-green-index-swapping.md) atomicity language to require `must_exist=true`
- explicit doctrine that metadata version must match live alias version before promote

**Acceptance Criteria**

1. ADR index updated.
2. Decision records include rationale, alternatives rejected, and validation criteria.

**Deterministic Validation**

```bash
pnpm markdownlint:root
```

Task-level deterministic validation is markdownlint; semantic consistency and
cross-doc doctrine alignment are validated in Phase 4 via `docs-adr-reviewer`
and full reviewer convergence.

**Task Complete When**

- ADR updates are linked from the ADR index and contain explicit doctrine for
  alias/metadata coherence and `must_exist=true` swap semantics.

#### Phase 3 Closeout Gate (required)

Gate sequence duplication note: this command sequence is intentionally repeated
per phase for self-contained execution. If it changes, update each phase
closeout gate copy.

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

If any gate fails, fix and restart this sequence from `pnpm secrets:scan:all`.

---

### Phase 4 - Closeout

#### Task 4.1 - Specialist reviewer passes

Required reviewers:

- `code-reviewer`
- `test-reviewer`
- `type-reviewer`
- `docs-adr-reviewer`
- `elasticsearch-reviewer`
- `security-reviewer`
- `architecture-reviewer-barney`
- `architecture-reviewer-betty`
- `architecture-reviewer-fred`
- `architecture-reviewer-wilma`

**Acceptance Criteria**

1. All required reviewers are invoked in read-only mode after implementation.
2. Blocking findings are resolved or explicitly owner-triaged with evidence.
3. Reviewer outputs are reflected in docs/tests/code before final gates.
4. Owner-triaged means: implemented, or explicitly rejected as incorrect with
   written rationale and evidence. It does not mean backlog deferral.
5. Reviewer cycle is iterative: re-run affected reviewers after fixes until no
   unresolved must-fix/high findings remain.
6. Architecture reviewers must explicitly assess boundary direction,
   simplification opportunities, coupling risk, and operational resilience.
7. If a reviewer invocation fails (timeout, tool error, or empty output), treat
   it as blocking: retry once, then escalate with written evidence if it fails
   again. Do not skip reviewer coverage.

**Deterministic Validation**

Run all required reviewers via the Task tool (`readonly: true`) and capture the
result links in session notes before gate execution.

Recommended reviewer order:

1. `architecture-reviewer-barney`
2. `architecture-reviewer-betty`
3. `architecture-reviewer-fred`
4. `architecture-reviewer-wilma`
5. `code-reviewer`
6. `test-reviewer`
7. `type-reviewer`
8. `docs-adr-reviewer`
9. `elasticsearch-reviewer`
10. `security-reviewer`

**Task Complete When**

- Reviewer roster completed with no unresolved blocking findings.

#### Task 4.2 - Full quality gates (one gate at a time)

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

If any gate fails, fix and restart this sequence from `pnpm secrets:scan:all`.

**Closeout Criteria**

1. Recovery succeeds on live environment with recorded evidence.
2. New invariants prevent recurrence of the same drift class.
3. All quality gates pass.
4. Documentation and ADR surfaces are consistent and discoverable.
5. Migration completion includes successful blue/green deploy evidence:
   deploy target, commit SHA, cutover confirmation, and post-deploy
   health/smoke checks.

---

## Evidence Trail

Canonical evidence location for this lane. Other docs should link here instead
of embedding session-state narratives.

### Phase 0 Baseline

- Evidence directory path(s)
- `baseline-summary.md` key values
- Mapping snapshot and versioned count snapshots

### Recovery Execution

- Ingest/promote command outputs and exit codes
- Alias/meta/count readbacks for each mutation attempt
- Failure-branch classification notes (if any)

### Reviewer Cycle

- Reviewer invocation records (all required specialists)
- Finding dispositions and rationale/evidence for any rejection
- Re-review closure notes

### Blue/Green Deploy Proof

- Deploy target/environment
- Commit SHA
- Cutover confirmation
- Post-deploy health/smoke checks

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Fixing mapping without metadata coherence repair | Wrong rollback lineage | Make metadata-alias coherence a hard precondition |
| Partial alias swap accepted as success | Hidden live corruption | Parse and reject partial action results |
| Concurrent jobs interleave lifecycle operations | Non-deterministic alias/meta state | Enforce lock + documented operator protocol |
| Guardrails documented but not enforced | Regression recurrence | Implement runtime preflight checks + tests |

---

## References

- `.agent/directives/principles.md`
- `.agent/directives/testing-strategy.md`
- `.agent/directives/schema-first-execution.md`
- `docs/operations/elasticsearch-ingest-lifecycle.md`
- `.agent/plans/semantic-search/archive/completed/cli-robustness.plan.md`
