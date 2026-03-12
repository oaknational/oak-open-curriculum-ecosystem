---
name: "CLI Robustness: Metadata Contract Incident and Closeout"
overview: >
  Refreshed executable plan for the active CLI robustness lane. Completed
  robustness work is retained as compact evidence, while remaining execution
  focuses on Phase 5 metadata schema/mapping remediation and Phase 4 closeout
  gates.
todos:
  - id: completed-evidence-baselined
    content: "Consolidate completed Phases 0-3 and legacy-path removal as compact evidence."
    status: completed
  - id: phase-5-red
    content: "Phase 5 RED: prove metadata contract mismatch and alias-state failure mode with deterministic failing checks."
    status: completed
  - id: phase-5-green
    content: "Phase 5 GREEN: align generated metadata schema/types/mapping for `previous_version` and restore successful lifecycle commit path."
    status: in_progress
  - id: phase-5-refactor
    content: "Phase 5 REFACTOR: simplify implementation surface, remove duplication, and lock validation commands."
    status: pending
  - id: phase-5-boundary-guardrails
    content: "Phase 5 boundary guardrails: verify read/admin split and prevent boundary regression in incident closeout."
    status: completed
  - id: phase-4-closeout
    content: "Phase 4 closeout: reviewer gates, ADR/docs propagation, full quality gates, and final acceptance checks."
    status: in_progress
  - id: session-handoff-standalone
    content: "Ensure this plan is a standalone next-session entry point with current findings, applied fixes, and explicit remaining obligations."
    status: completed
isProject: false
---

# CLI Robustness: Metadata Contract Incident and Closeout

**Last Updated**: 12 March 2026 (operator-run ingest protocol integrated)  
**Status**: Active incident lane (Phase 5) with closeout in progress (Phase 4)  
**Scope**: `apps/oak-search-cli` command lifecycle, metadata contract integrity, and final robustness closure

---

## Outcome

Close the active CLI robustness incident by restoring a successful blue/green
metadata commit path, then complete reviewer/documentation/quality-gate closure
without re-expanding this plan into historical narrative.

---

## Why This Refresh Exists

The previous plan captured all implementation history in detail. That was useful
during broad execution, but it now obscures the only remaining obligations:

1. Fix the metadata contract mismatch (`previous_version`) causing strict mapping
   write failure in `oak_meta`.
2. Complete formal closeout (reviewers, ADR/docs propagation, and full gates).

This refreshed plan keeps completed work as evidence only, and makes remaining
execution deterministic.

---

## Completed Evidence (Compact)

The following remains complete and should not be re-opened unless regression is
proven:

1. CLI process lifecycle hardening applied:
   - async command completion path established
   - explicit process termination behaviour established
   - file sink shutdown integrated before exit
2. Resource lifecycle hardening applied:
   - ES client lifecycle wrapper pattern introduced
   - cleanup in `finally` pathways established
   - ingest command local Oak client teardown established
3. Fail-fast preconditions introduced before expensive resource creation.
4. Legacy unsafe command path removed:
   - `admin ingest` no longer registered under admin commands.
5. Operational validation reached production-like ingest run, which exposed the
   remaining metadata contract mismatch at commit time.

Evidence source remains this active lane plus strategic incident summary in
[`../../high-level-plan.md`](../../high-level-plan.md).

---

## Session Findings Integrated (11 March 2026)

This plan now includes outcomes from a full deep-dive `code-reviewer` pass and
targeted architecture passes (`barney`, `fred`, `betty`, `wilma`), with fixes
applied between invocations.

### Findings addressed in code

1. Ingest/verification lifecycle correctness:
   - ES client lifecycle fixed in `operations/ingestion/verify-ingestion.ts`
     (single client + `finally` close).
   - dead runtime-input path removed; flow now explicit.
2. Env/schema boundary tightening:
   - `src/lib/env.ts` now composes canonical schema from `src/env.ts` instead of
     maintaining duplicate field definitions.
   - `parseEnv` now returns `Result` (no throw-based parse contract).
3. CLI contract/operational surface alignment:
   - `package.json` `es:ingest` now points to `admin versioned-ingest`.
   - docs and E2E command-boundary coverage aligned with
     `admin versioned-ingest` + `admin stage`.
4. Reliability hardening from architecture findings:
   - pass-through commands now fail fast when script path is missing and use an
     explicit timeout.
   - `--min-doc-count` now validates non-negative integer input (no `NaN`
     bypass path).
   - bulk-dir resolution now handles unreadable directory errors deterministically.
5. Drift/duplication cleanup:
   - orphaned local zero-hit HTTP/persistence implementation removed from CLI
     workspace where not used by runtime command surface.
   - `Object.*` suppression points replaced with type-safe helpers where touched.

### Findings still open (tracked for closeout)

1. Full singleton ES-client migration remains open in legacy areas (mixed
   patterns still exist: composition-root client ownership vs module singleton).
2. Reviewer sequence is partially complete (code + architecture passes done);
   test/type/docs/elastic specialist passes still required for formal closeout.
3. Metadata contract incident closure is still the primary gate:
   strict-mapping `previous_version` failure path must be proven closed via
   Phase 5 lifecycle validation.

---

## Active Incident Statement

`admin versioned-ingest` can complete bulk upload and still fail during metadata
commit due to strict mapping rejection of `previous_version` in `oak_meta`.

This indicates a schema/type/mapping contract drift, not an operational retry
problem. Per schema-first practice, remediation must happen at the source-of-truth
generation layer and flow through generated artefacts.

---

## Non-Goals

- Rewriting completed Phases 0-3 implementation.
- Reintroducing removed legacy command paths.
- Adding compatibility fallbacks for missing metadata fields.
- Broad architectural changes outside the metadata contract lane.
- Deferring quality gates or reviewer findings.
- Widening read-only/default consumer surfaces to include admin/write capability.
- Reintroducing duplicate retrieval semantics via experiment-specific bypasses.

---

## Foundation Alignment Commitments

Before each remaining phase task:

1. Re-read:
   - [`../../../directives/principles.md`](../../../directives/principles.md)
   - [`../../../directives/testing-strategy.md`](../../../directives/testing-strategy.md)
   - [`../../../directives/schema-first-execution.md`](../../../directives/schema-first-execution.md)
2. Ask: **Could it be simpler without compromising quality?**
3. Enforce:
   - no compatibility layers
   - no type shortcuts
   - fail fast with explicit errors
   - one proof per claim

---

## Remaining Workstream

### Phase 5 — Metadata Contract Remediation (RED/GREEN/REFACTOR)

#### Phase 5 RED (Completed)

**Intent**: Prove current failure mode is reproducible and contract-based.

**Completed checks**:

1. `versioned-ingest` reached full bulk completion but failed metadata commit.
2. Failure class captured: strict dynamic mapping rejection for
   `previous_version`.
3. Alias health was non-final and required remediation path completion.

**RED exit condition**: Failure is explained as contract drift, not transport or
transient runtime instability.

#### Phase 5 GREEN (In Progress)

**Objective**: Align metadata contract end-to-end so lifecycle commit succeeds.

#### Task 5.1: Verify authoritative metadata contract sources and flow

Confirm and document where the following are generated and linked:

- metadata document type shape (including `IndexMetaDoc` or equivalent)
- strict `oak_meta` mapping descriptor
- generated SDK/runtime artefacts that write metadata

**Acceptance criteria**:

1. A single source-of-truth path is identified for each artefact.
2. Manual edits to generated outputs are explicitly avoided.
3. Contract field ownership for `previous_version` is explicit and traced from
   generator source to generated artefacts.

#### Task 5.2: Align runtime-applied mapping with generator-backed contract

Where `previous_version` already exists in generated artefacts, ensure runtime
mapping application and lifecycle metadata write paths consume that contract
consistently under strict mapping constraints.

**Acceptance criteria**:

1. Generated outputs include `previous_version` consistently.
2. No fallback dynamic-mapping workaround is introduced.
3. No parallel compatibility model is created.

#### Task 5.3: Regenerate and verify artefact coherence

Run generation/build flow and confirm no drift remains between contract layers.

**Deterministic validation commands**:

```bash
pnpm sdk-codegen
pnpm build
pnpm type-check
```

**Acceptance criteria**:

1. Generation completes cleanly.
2. Build/type-check pass with aligned contract outputs.
3. No manual post-generation edits are required.

#### Task 5.4: Re-run lifecycle validation chain

Execute the operational sequence to prove incident resolution:

```bash
pnpm tsx bin/oaksearch.ts admin validate-aliases
pnpm tsx bin/oaksearch.ts admin versioned-ingest
pnpm tsx bin/oaksearch.ts admin validate-aliases
```

Execution protocol:

1. Agent may run non-ingest checks (for example `validate-aliases`) and prepare command context.
2. Operator starts `admin versioned-ingest` independently for direct observation.
3. Agent monitors output/evidence and drives remediation or closeout actions.

**Acceptance criteria**:

1. `versioned-ingest` exits with code `0`.
2. Metadata commit succeeds without strict mapping exception.
3. Rollback swaps can be built (or are not required) with no alias corruption path.
4. Alias validation reports healthy alias state after ingest, with each expected
   alias resolving to a concrete target index.

#### Task 5.5: Validate rollback/alias failure branch is closed

Explicitly verify the previous compound failure path is no longer reachable:

- metadata write failure
- rollback swap build failure
- missing alias target (for example `oak_lessons`)

**Acceptance criteria**:

1. No run emits "Cannot build rollback swaps" for healthy-state ingest.
2. No run emits "alias currently has no target index" for expected aliases.
3. Any non-zero exit in this area is accompanied by deterministic remediation
   guidance and preserved error cause context.

#### Phase 5 REFACTOR (Pending)

After GREEN passes:

1. Remove any temporary investigative scaffolding.
2. Consolidate duplicated contract declarations at generator/source layer only.
3. Ensure plan references remain concise and single-source.

**Acceptance criteria**:

1. No duplicate contract definitions remain, validated by searching for
   `previous_version` declarations in generator and generated mapping/type files.
2. Validation command set matches exactly:
   - `pnpm tsx bin/oaksearch.ts admin validate-aliases`
   - `pnpm tsx bin/oaksearch.ts admin versioned-ingest`
   - `pnpm tsx bin/oaksearch.ts admin validate-aliases`
3. No temporary investigative files or debug-only branches remain in this lane.

#### Task 5.6: Boundary guardrail verification (Completed)

Boundary checks required by CLI/SDK doctrine have been completed and validated.

**Acceptance criteria**:

1. Non-admin CLI modules must not import admin/write SDK surfaces.
2. Admin/write pathways remain explicitly scoped to admin commands.
3. No imports from SDK internal modules are introduced in this lane.
4. No new CLI-local duplication of canonical retrieval/preprocessing logic is
   introduced as part of incident remediation.
5. ADR-134 boundary doctrine is explicitly proven before lane closeout:
   - non-admin CLI modules must not import `@oaknational/oak-search-sdk/admin`
   - app code must not import SDK internal/deep paths
   - boundary lint checks (from the boundary lane enforcement) are green

**Progress snapshot (12 March 2026)**:

- SDK capability surfaces split into explicit `@oaknational/oak-search-sdk/read` and
  `@oaknational/oak-search-sdk/admin` subpaths.
- CLI imports migrated to capability surfaces across `search`, `observe`, and `admin`
  module families.
- Search CLI lint rules now encode boundary blocking behaviour for read-only module
  families plus deep/internal path restrictions.
- Fixture-backed integration proofs validate positive/negative import policy cases.
- Boundary lane closeout plan marks ADR-134 enforcement and docs/gates complete.

---

### Phase 4 — Review and Documentation Closeout (Partially in progress; formal closeout pending)

Reviewer pre-passes are already in progress. Formal closeout completion tasks
(docs propagation and full gate completion) require Phase 5 REFACTOR complete.

#### Task 4.1: Reviewer gate sequence (In Progress)

Run specialist reviews appropriate to this lane:

- `code-reviewer`
- `architecture-reviewer-barney`
- `architecture-reviewer-wilma`
- `test-reviewer`
- `type-reviewer`
- `docs-adr-reviewer`
- `elasticsearch-reviewer` (metadata mapping/ingest contract touches Elasticsearch)

**Acceptance criteria**:

1. Findings are captured explicitly.
2. Blocking findings are addressed before completion.
3. Residual risk, if any, is clearly stated.

**Progress integrated (11 March 2026)**:

- completed: deep `code-reviewer` pass + follow-up re-review
- completed: `architecture-reviewer-barney`
- completed: `architecture-reviewer-fred`
- completed: `architecture-reviewer-betty`
- completed: `architecture-reviewer-wilma`
- pending for this lane after metadata remediation: incident-focused
  `test-reviewer`, `type-reviewer`, `docs-adr-reviewer`, `elasticsearch-reviewer`

#### Task 4.2: ADR and docs propagation

Ensure lifecycle-management and incident-resolution documentation is consistent:

1. Confirm ADR index and target ADR entries are current.
2. Update
   `docs/architecture/architectural-decisions/130-blue-green-index-swapping.md`
   with the metadata contract incident lesson, or create a successor ADR if the
   change scope exceeds ADR-130.
3. Update CLI workspace documentation where behaviour/commands changed, and
   explicitly document read vs admin capability boundaries for operational
   commands.
4. Keep architecture claims in one authoritative location and link from others.

**Acceptance criteria**:

1. No documentation drift across plan/ADR/README surfaces.
2. Closeout notes are concise and verifiable.

#### Task 4.3: Full quality gates (one gate at a time)

Run full gate sequence with restart-on-fix discipline:

```bash
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm doc-gen
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm subagents:check
pnpm portability:check
pnpm secrets:scan:all
pnpm test
pnpm test:e2e
pnpm test:ui
pnpm smoke:dev:stub
```

**Acceptance criteria**:

1. All gates pass.
2. Any gate-induced file changes are committed to the same remediation scope.
3. No checks are disabled or bypassed.

---

## Risk Register (Remaining Scope)

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Metadata field added in wrong layer | Medium | High | Enforce generator/source-of-truth update first; no manual generated edits |
| Alias appears healthy while metadata contract still drifts | Low | High | Require full three-command validation sequence including post-ingest alias check |
| Rollback path still broken under metadata edge cases | Medium | High | Add explicit rollback-branch validation and alias-target assertions in Phase 5 |
| Mixed ES client ownership patterns persist in legacy paths | Medium | Medium | Complete migration to composition-root ownership and remove singleton dependency surface |
| Admin/write capability leaks into default read paths | Medium | High | Enforce explicit read/admin boundary checks and command-surface verification before closeout |
| Experiment support reintroduces retrieval duplication | Medium | Medium | Require experiments to compose SDK extension seams; block duplicate canonical logic in CLI |
| Documentation diverges from delivered behaviour | Medium | Medium | Run docs closeout after GREEN, before marking done |
| Reviewer feedback uncovers boundary issues late | Medium | Medium | Run reviewer sequence immediately after GREEN, before final gates |

---

## Next Session Bootstrap (Standalone Entry Point)

Use this section first in the next session before touching implementation.

1. Re-ground:
   - [`../../../directives/principles.md`](../../../directives/principles.md)
   - [`../../../directives/testing-strategy.md`](../../../directives/testing-strategy.md)
   - [`../../../directives/schema-first-execution.md`](../../../directives/schema-first-execution.md)
2. Confirm current lane objective:
   - close Phase 5 metadata contract incident (`previous_version` strict mapping
     failure path and coupled alias rollback branch)
3. Run deterministic incident validation sequence:

```bash
pnpm tsx bin/oaksearch.ts admin validate-aliases
pnpm tsx bin/oaksearch.ts admin versioned-ingest
pnpm tsx bin/oaksearch.ts admin validate-aliases
```

   - Operator executes `admin versioned-ingest`; agent monitors and analyses output.

4. If Phase 5 GREEN/REFACTOR acceptance criteria pass, continue directly to:
   - pending reviewer gates (`test-reviewer`, `type-reviewer`,
     `docs-adr-reviewer`, `elasticsearch-reviewer`)
   - Task 4.2 docs/ADR propagation
   - Task 4.3 full gate sequence
5. Do not reopen completed historical phases unless a new regression is
   evidenced by command output.

---

## Done When

This lane is complete only when all checks below are true:

1. `versioned-ingest` completes with exit code `0`.
2. Metadata write succeeds under strict mapping with `previous_version` present.
3. Pre/post alias validation confirms healthy alias state.
4. Reviewer findings are resolved or explicitly documented as non-blocking by the
   project owner.
5. ADR/docs propagation is complete and consistent.
6. Full quality gate sequence passes without bypasses.
7. Read-only/default and admin/write boundaries are verified in this lane.
8. No new boundary regressions are introduced while resolving metadata incident.
9. ADR-134 compliance is confirmed by boundary enforcement checks before closure
   (this lane cannot close while known boundary doctrine violations remain open).

---

## Key Files (Remaining Work Focus)

| File or Area | Role in Remaining Work |
|---|---|
| `apps/oak-search-cli/src/lib/elasticsearch/setup/` | Metadata schema/mapping and ingest contract touchpoints |
| `apps/oak-search-cli/src/cli/admin/` | Lifecycle command validation execution path |
| `packages/sdks/oak-sdk-codegen/code-generation/typegen/search/field-definitions/observability.ts` | Generator source for metadata field definitions |
| `packages/sdks/oak-sdk-codegen/src/types/generated/search/es-mappings/oak-meta.ts` | Generated strict mapping including metadata fields |
| `packages/sdks/oak-sdk-codegen/src/types/generated/search/index-documents.ts` | Generated metadata document type contract |
| `docs/architecture/architectural-decisions/` | ADR propagation and index consistency |
| `apps/oak-search-cli/README.md` | CLI behaviour/documentation closeout |

---

## References

- [`../../../directives/principles.md`](../../../directives/principles.md)
- [`../../../directives/testing-strategy.md`](../../../directives/testing-strategy.md)
- [`../../../directives/schema-first-execution.md`](../../../directives/schema-first-execution.md)
- [`../../high-level-plan.md`](../../high-level-plan.md)
- [`./unified-versioned-ingestion.plan.md`](./unified-versioned-ingestion.plan.md)
- Historical diagnostic context has been consolidated into canonical semantic-search
  active plans and ADR-134; no platform-local plan dependency remains.
