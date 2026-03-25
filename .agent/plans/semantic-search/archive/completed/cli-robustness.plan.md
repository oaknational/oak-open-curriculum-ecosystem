---
name: "CLI Robustness: Metadata Contract Incident and Closeout"
overview: >
  Superseded supporting evidence lane. Completed robustness work is retained as
  compact incident history while active execution authority moved to
  `semantic-search-recovery-and-guardrails.execution.plan.md`.
todos:
  - id: completed-evidence-baselined
    content: "Consolidate completed Phases 0-3 and legacy-path removal as compact evidence."
    status: completed
  - id: phase-5-red
    content: "Phase 5 RED: prove metadata contract mismatch and alias-state failure mode with deterministic failing checks."
    status: completed
  - id: phase-5-green
    content: "Phase 5 GREEN: align generated metadata schema/types/mapping for `previous_version` and restore successful lifecycle commit path."
    status: cancelled
  - id: phase-5-refactor
    content: "Phase 5 REFACTOR: simplify implementation surface, remove duplication, and lock validation commands."
    status: cancelled
  - id: phase-5-boundary-guardrails
    content: "Phase 5 boundary guardrails: verify read/admin split and prevent boundary regression in incident closeout."
    status: completed
  - id: phase-4-closeout
    content: "Phase 4 closeout: reviewer gates, ADR/docs propagation, full quality gates, and final acceptance checks."
    status: cancelled
  - id: session-handoff-standalone
    content: "Ensure this plan is a standalone next-session entry point with current findings, applied fixes, and explicit remaining obligations."
    status: completed
isProject: false
---

# CLI Robustness: Metadata Contract Incident and Closeout

**Last Updated**: 13 March 2026 (metadata drift evidence + salvage-first sequencing)  
**Status**: Supporting historical evidence lane (superseded)  
**Scope**: `apps/oak-search-cli` command lifecycle, metadata contract integrity, and final robustness closure

Execution authority is now
`semantic-search-recovery-and-guardrails.execution.plan.md`. This plan remains
in `active/` temporarily as supporting incident evidence only.

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

## Historical Closure Snapshot

Execution authority moved to
`semantic-search-recovery-and-guardrails.execution.plan.md`.

This file is retained only as compact evidence of the incident class and
historical fix sequence. Do not execute work from this file. Use it to
cross-check prior observations against the active recovery lane.

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

Use this section only to read historical incident evidence.

1. Re-ground:
   - [`../../../directives/principles.md`](../../../directives/principles.md)
   - [`../../../directives/testing-strategy.md`](../../../directives/testing-strategy.md)
   - [`../../../directives/schema-first-execution.md`](../../../directives/schema-first-execution.md)
2. Confirm execution authority:
   - run incident execution from
     `semantic-search-recovery-and-guardrails.execution.plan.md`, not this file.
3. Use this file only to compare historical evidence with current recovery-lane
   observations.
4. Do not reopen completed historical phases unless a new regression is
   evidenced by command output.

### Carry-forward findings to implement in the recovery lane

These findings are now execution items in
`semantic-search-recovery-and-guardrails.execution.plan.md` (Task 2.3 + Phase 4):

1. Correct test taxonomy:
   - pure/no-mock tests remain `*.unit.test.ts`
   - mocked/IO lifecycle cases are integration tests
2. Remove implementation-constraining test assertions unless they prove an
   explicit external contract.
3. Eliminate test type shortcuts and shape mutation patterns:
   - no `as unknown as`
   - no `Object.*` mutation for ES-like errors
   - use library-native error types directly
4. Keep DI fakes simple, explicit, and behaviour-focused.
5. Enforce comprehensive review cycle after fixes, including all four
   architecture reviewers, with re-review until no unresolved must-fix/high
   findings remain.

Latest evidence:

- 12 March 2026: Baseline + boundary preflight checks were rerun; bootstrap
  `admin validate-aliases` was healthy.
- 12 March 2026: Operator-run `admin versioned-ingest` for
  `v2026-03-12-175109` reached 100% upload (`Bulk upload completed
  successfully`) and then failed at metadata commit with
  `strict_dynamic_mapping_exception` for `previous_version` in strict
  `oak_meta`.
- 12 March 2026: Post-run aliases remained healthy on prior targets; no alias
  corruption observed.
- 12 March 2026: Read-only mapping check showed live `oak_meta` missing
  `previous_version`; staged indexes for `v2026-03-12-175109` remained
  available with expected document counts.
- 13 March 2026: Prioritise mapping reconciliation + salvage promotion of the
  existing staged version before any new full re-ingest.

---

## Done When

This lane is complete as supporting evidence when all checks below are true:

1. Execution ownership is explicitly delegated to
   `semantic-search-recovery-and-guardrails.execution.plan.md`.
2. Historical evidence here remains accurate, concise, and non-contradictory.
3. Incident closure checks are satisfied in the recovery lane, not this file.

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
