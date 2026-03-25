---
name: Turbo Boundary Triage Plan
overview: Triage the turbo-and-codegen-boundary-fix plan into NOW (minimum to unblock merge, fix B2 test coupling) and LATER (fold B1 resolution + full boundary separation into the workspace decomposition strategic plan, and make it discoverable).
todos:
  - id: b2-extract-reader
    content: Extract extractSubjectPhase from reader.ts into reader-utils.ts to break transitive generated-type dep
    status: completed
  - id: b2-extract-vocab-gen
    content: Extract createPipelineConfig/formatPipelineResult from vocab-gen.ts into vocab-gen-config.ts
    status: completed
  - id: b2-assess-analysis-report
    content: Assess analysis-report-generator deps (both locations) -- extract type-only file or accept turbo override
    status: completed
  - id: b2-assess-synonym-export
    content: Assess synonym-export.integration.test.ts -- narrow import or accept turbo override
    status: completed
  - id: verify-clean-check
    content: Run pnpm clean && pnpm check to verify all tests pass after B2 fixes
    status: completed
  - id: update-turbo-plan
    content: "Update turbo-and-codegen-boundary-fix plan: mark B2 fixed, add deferral section for B1 pointing to decomposition plan"
    status: completed
  - id: update-decomposition-plan
    content: Add B1 test list + turbo override removal as acceptance criteria to the decomposition plan
    status: completed
  - id: discoverability
    content: "Improve decomposition plan discoverability: update architecture-and-infrastructure README, distilled.md, turbo plan cross-refs"
    status: completed
isProject: false
---

# Turbo Boundary Triage: NOW vs LATER

## Situation

The [turbo-and-codegen-boundary-fix plan](/.agent/plans/semantic-search/archive/completed/turbo-and-codegen-boundary-fix.plan.md) conflates two scopes:

- **Phase 1 (turbo pipeline fixes)** -- DONE. Verified locally, ready to merge.
- **Phase 2 (sdk-codegen boundary separation)** -- a large architectural refactoring that overlaps heavily with the existing [workspace decomposition strategic plan](/.agent/plans/architecture-and-infrastructure/codegen/future/sdk-codegen-workspace-decomposition.md).

The turbo override `@oaknational/sdk-codegen#test.dependsOn: ["^build", "sdk-codegen"]` currently makes tests pass, but Phase 2 as written proposes workspace splitting that is the decomposition plan's scope.

## Decision: Split NOW from LATER

### NOW -- Unblock merge on `feat/es_index_update`

The minimum viable work to merge this branch with tests passing AND unnecessary coupling removed:

**1. Phase 1 turbo fixes (DONE)**
Already applied and verified. No further action.

**2. Fix B2 tests -- extract pure functions from transitively-coupled modules (5 tests)**

These tests target genuinely pure functions but fail because their module file transitively imports generated types. The fix is cheap, correct regardless of future decomposition, and removes real coupling:

- `**reader.unit.test.ts`** -- extract `extractSubjectPhase` from `src/bulk/reader.ts` into a new `src/bulk/reader-utils.ts` (or similar) that has no generated-type imports. Update the test import. `reader.ts` continues to import and re-export if needed.
- `**vocab-gen.unit.test.ts`** -- extract `createPipelineConfig` and `formatPipelineResult` from `vocab-gen/vocab-gen.ts` into `vocab-gen/vocab-gen-config.ts`. These are pure config/format helpers with no generated-type dependency.
- `**analysis-report-generator.unit.test.ts` (both locations: `src/bulk/generators/` and `vocab-gen/generators/`)** -- the coupling is via the `ExtractedData` type from `processing.ts`/`vocab-gen-core.ts`. Two options:
  - (a) Extract a minimal type-only file (`extracted-data-types.ts`) that defines `ExtractedData` without pulling in the generated bulk barrel, OR
  - (b) Accept these as "resolved by turbo override" if the type dependency is intrinsic (the function signatures use generated types). Check at implementation time.
- `**synonym-export.integration.test.ts`** -- integration test that ties to synonym data modules. If the transitive dep can be broken by narrowing the import to curated synonym data only (not the full barrel), do so. Otherwise, this is a B1-equivalent that lives with the turbo override.

**3. Accept the turbo override as temporary (B1 tests)**

The 4 Category B1 tests intentionally test generated output (`classifyHttpError`, `SUBJECT_TO_PARENT`, `SCOPES_SUPPORTED`, bulk Zod schemas). Their coupling is real and intended -- they test that generated code works correctly. The turbo override `@oaknational/sdk-codegen#test.dependsOn: ["^build", "sdk-codegen"]` accurately declares this dependency.

The proper resolution is workspace decomposition (LATER), which places generated output in a separate workspace where `^build` provides the ordering naturally.

**4. Verify `pnpm clean && pnpm check` passes**

After B2 extractions, confirm the full clean-build-test cycle works with the turbo override.

**5. Update the turbo plan status**

Mark Phase 2a as "temporary override accepted", B2 as "fixed", and add a clear deferral note pointing to the decomposition plan for Phase 2b/2c.

### LATER -- Integrate into workspace decomposition plan

All remaining Phase 2 items from the turbo plan fold into [sdk-codegen-workspace-decomposition.md](/.agent/plans/architecture-and-infrastructure/codegen/future/sdk-codegen-workspace-decomposition.md):

- **B1 test resolution** -- workspace split places generated output downstream of generators; B1 tests move with their tested code to the generated-output workspace. The `^build` dependency handles ordering naturally. No turbo override needed.
- **Phase 2b (design decision)** -- split axis, workspace naming, dependency topology. Already analysed in the decomposition plan.
- **Phase 2c (implementation)** -- workspace creation, file moves, import migration, turbo override removal. Already scoped in the decomposition plan.
- **Remove the turbo override** -- becomes redundant once workspaces are split.

The decomposition plan already covers all of this. What needs to happen is:

1. Add the B1 test list and their destination (from the turbo plan's Appendix A) as input to the decomposition plan
2. Add the turbo override removal as an explicit acceptance criterion

### Discoverability -- Make the decomposition plan findable

The decomposition plan at `.agent/plans/architecture-and-infrastructure/codegen/future/` is currently referenced only from:

- The turbo plan (Phase 2, Prior Art section)
- The codegen README
- An archived napkin

To make it discoverable:

1. **Add to architecture-and-infrastructure README** -- the `codegen/` row says "Post-M1" but doesn't name the plan or link it directly
2. **Add a "Deferred Work" section to the turbo plan** with an explicit pointer
3. **Cross-reference from distilled.md** -- the existing entry mentions both plans but could be clearer about the relationship
4. **Consider promotion trigger** -- M1 is complete, so the decomposition plan's promotion trigger (M1 merged, CI green on main, owner approval) may be partially satisfied. Update the status in the plan.

## What We Are NOT Doing Now

- No workspace splitting (that is the decomposition plan's scope)
- No import path migration across consumer workspaces
- No new ADRs (the decomposition plan will write ADR-108 updates)
- No renaming (vocab-gen to graph-gen etc. -- folded into decomposition)
- No generator consolidation (folded into decomposition)

## Risks

- **B2 extraction may reveal deeper coupling** -- if `ExtractedData` or similar types are intrinsically generated, some B2 tests may need to remain under the turbo override. Check at implementation time; accept override if extraction is not clean.
- **Decomposition plan staleness** -- it was written 2026-03-02 and references M1 as a prerequisite. M1 is now complete. The plan needs a freshness pass during promotion.
