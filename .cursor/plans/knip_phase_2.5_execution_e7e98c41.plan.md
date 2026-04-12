---
name: Knip Phase 2.5 Execution
overview: Present evidence-based options for 4 Phase 2.5 follow-ups, several of which have materially different ground truth than the plan assumed. Each needs an owner decision before implementation.
todos:
  - id: decide-auth-helpers
    content: "Owner decision on 2.5.1: (a) wire into production, (b) delete as dead code, or (c) defer"
    status: completed
  - id: resolve-gt-barrels
    content: "2.5.2: Document rationale for barrel hierarchy. Track archive deletion as separate future plan."
    status: completed
  - id: decide-schema-emitter
    content: "Owner decision on 2.5.3: (a) decide correct API surface then fix emitters + regenerate, (b) wire schemas into consumers, or (c) defer with documented risk"
    status: completed
  - id: decide-cli-barrel
    content: "Owner decision on 2.5.4: (a) close as no-action, (b) extend barrel, or (c) close with future follow-up"
    status: completed
  - id: implement-decisions
    content: Implement all 4 owner decisions
    status: completed
  - id: verify-gates
    content: Verify pnpm knip exits 0 and pnpm check passes after all changes
    status: completed
isProject: false
---

# Knip Phase 2.5: Follow-up Evidence and Options

**Parent**: [knip-triage-and-remediation.plan.md](apps/oak-search-cli/ground-truths/generation/generate-ground-truth-types.ts)
**Child plan**: [knip-phase-2.5-follow-ups.plan.md](.agent/plans/architecture-and-infrastructure/active/knip-phase-2.5-follow-ups.plan.md)
**Branch**: `feat/gate_hardening_part1` at `3ff932e5`

---

## Plan Corrections (investigation vs assumptions)

Three of four follow-ups have materially different ground truth than the plan assumed:

- **2.5.1**: Plan says "consolidate duplicated code" -- but no duplication remains. The two surviving functions are **only consumed by tests**, not production code.
- **2.5.2**: Plan says "54 barrels across 16 subjects" -- actual count is **39 barrels**. Structure is hand-maintained, not generator-driven.
- **2.5.4**: Plan says "zero importers" -- actual count is **17 importers**. The barrel is actively used. Not dead-on-arrival at all.

---

## Follow-up 2.5.1: Auth Response Helpers

### Evidence

- `auth-response-helpers.ts` (~87 lines) exports 2 functions: `createAuthLogContext` and `handleAuthSuccess`
- `mcp-auth.ts` exports 1 function: `mcpAuth` (Express middleware) with 7 private helpers (`sendMissingAuthResponse`, `extractBearerToken`, etc.)
- **No cross-imports** between the two files
- **No duplication** -- the 8 duplicated functions were already deleted in Phase 2
- **Critical finding**: `createAuthLogContext` and `handleAuthSuccess` are **only called by their own test files** -- zero production consumers
- **Reviewer finding (Barney)**: Auth success logging **already exists** in production at `check-mcp-client-auth.ts` (lines 124-129), which logs `clientId`, `scopeCount`, `hasUserContext` on successful tool auth. The helpers are not just dead -- they are **redundant** with live production code.
- **Test reviewer finding**: The helper tests prove behaviour of unwired code. Per testing-strategy.md, they do not prove anything useful about live product behaviour. Both test files (`create-auth-log-context.unit.test.ts`, `auth-response-helpers.unit.test.ts`) should be deleted with the helpers.

### Options

- **(a) Delete as dead code**: Both functions have zero production consumers and are redundant with existing auth logging in `check-mcp-client-auth.ts`. Per principles.md: "If product code is only used in tests, delete it." Clean deletion -- helpers and their test files go together.
- **(b) Defer**: Accept the status quo. The helpers are harmless (87 lines, knip-clean). Low urgency.

**Recommendation**: (a) delete. The functions are not just unused -- the capability they represent is already live in `check-mcp-client-auth.ts`. Wiring them in would create a second success-logging boundary.

---

## Follow-up 2.5.2: Ground-Truth Barrel Hierarchy

### Owner Decision

The `ground-truth-archive/` is a poorly removed remnant of the old approach -- the newer `ground-truth/` model IS the canonical system. However, deleting the archive and rewiring the evaluation pipeline is significant work (18 consumer files, type system migration, evaluation pipeline changes). This is tracked as a **separate future plan**: [ground-truth-archive-retirement.plan.md](../../.agent/plans/architecture-and-infrastructure/future/ground-truth-archive-retirement.plan.md).

### Phase 2.5 Action

For Phase 2.5, keep the barrel hierarchy as-is (knip is clean). Document the rationale: the barrels serve the evaluation pipeline pending archive retirement. The future plan is the authoritative source for the deletion work.

---

## Follow-up 2.5.3: Schema-Emitter Regeneration Footgun

### Evidence

- **Committed generated files** were **hand-trimmed** in Phase 2 (violating "never edit generated files, edit generators"): `ground-truth-schemas.ts` only exports `validateGroundTruthQuery`; `lesson-slugs-by-subject.ts` only exports `ALL_LESSON_SLUGS`, `TOTAL_LESSON_SLUG_COUNT`, `getSubjectForSlug`
- **Emitter source** (`schema-emitter.ts`, `type-emitter.ts`) **still generates** the full set: 6 exported Zod schemas, inferred types, `AnyLessonSlugSchema`, `isValidLessonSlug`, branded types, exported `SLUG_TO_SUBJECT`, etc.
- **Emitter unit tests** still assert the full old export surface (e.g. `toContain('export const RelevanceScoreSchema')`)
- **Regeneration footgun**: Running the generator will reintroduce ~12 unused exports, breaking knip and the blocking gate
- `TOTAL_LESSON_COUNT` / `GENERATED_AT` as standalone exports are **already removed** from the manifest generator
- **Consumer analysis**: Only `validateGroundTruthQuery`, `ALL_LESSON_SLUGS`, `TOTAL_LESSON_SLUG_COUNT`, `getSubjectForSlug`, `BULK_DATA_MANIFEST`, and `SUBJECT_PHASE_COUNT` are consumed (all by `validate-ground-truth.ts`)
- **ADR-085** and **ADR-098** describe Zod schema validation discipline but require only `validateGroundTruthQuery`, not exported individual schema constants
- **No active plans** call for wiring the currently unused schemas into production
- **Reviewer finding (assumptions)**: The correct framing is not "match the hand-trimmed output" but "decide the correct API surface, then fix the emitter to generate it." The schemas remain as internal `const` declarations -- only the `export` keyword is removed. Re-exporting is a one-line emitter change if a future need arises.
- **Reviewer finding (Barney)**: Preserve-for-future is the wrong instinct for an app-local, single-consumer generator with a blocking knip gate. Keep internal building blocks; remove dead public surface.
- **Reviewer finding (test)**: Emitter tests currently prove the emitter "correctly generates dead code." After narrowing, tests should assert the consumed contract, not the old export surface.
- **Reviewer finding (test)**: `ground-truths/README.md` documents imports like `RelevanceScoreSchema` that won't exist after the fix -- docs need updating.

### The real question (owner directive)

Before editing the generators: are the unused Zod schemas (`RelevanceScoreSchema`, `QueryCategorySchema`, `QueryPrioritySchema`, `KeyStageSchema`, `GroundTruthQuerySchema`, `AnyLessonSlugSchema`) **dead code**, or **useful infrastructure** that belongs to a future plan and should be wired rather than removed?

**Evidence for dead**: Zero production consumers. ADR-085/098 require only `validateGroundTruthQuery`. No active plan references direct schema imports. `validate-ground-truth.ts` uses `validateGroundTruthQuery` internally, not the individual schemas.

**Evidence for useful**: The schemas encode real domain validation (relevance scores, query categories, key stages). ADR-085 describes "Zod schema validation discipline." If anyone wants to compose validators (e.g., validate just a key stage or query category independently), these schemas would be the building blocks.

**Key nuance**: The schemas are NOT being deleted -- they remain as internal `const` declarations inside the generated file. Only the `export` keyword is removed. Re-exporting is trivial if a future consumer needs direct access.

### Options

- **(a) Decide API surface, fix emitters, regenerate**: Confirm the correct public contract (schemas internal, only `validateGroundTruthQuery` + helpers exported). Fix `schema-emitter.ts` and `type-emitter.ts` to generate that contract. Update emitter unit tests to assert the new contract. Regenerate. Update `ground-truths/README.md`. Schemas remain as internal building blocks.
- **(b) Wire schemas into consumers**: If the schemas are genuinely useful infrastructure, wire them into production code (e.g., expose `GroundTruthQuerySchema` for use in future tooling). Then the emitter is correct as-is, just needs the hand-trimmed files regenerated.
- **(c) Defer with documented risk**: The footgun is dormant as long as nobody reruns the generator. Document the drift. Low urgency if regeneration is rare.

**Recommendation**: (a) -- with the understanding that schemas remain as internal building blocks, not deleted. The fix is in the generators (never edit generated files). The emitter tests should prove the consumed contract, not the old export surface.

---

## Follow-up 2.5.4: `cli/shared/index.ts` Barrel

### Evidence

- **17 CLI modules** import from `../shared/index.js` -- barrel is **actively used**, not dead-on-arrival
- The barrel re-exports from 7 modules: `create-cli-sdk`, `output`, `validators`, `pass-through`, `with-es-client`, `with-loaded-cli-env`, `validate-ingest-env`
- **Hybrid usage**: several files import from the barrel AND make deep imports for `buildSearchSdkConfig` and `WithEsClientDeps` (not in the barrel)
- **2 modules not in barrel**: `build-search-sdk-config.ts` and `resolve-bulk-dir.ts` are imported directly by 8+ files each
- The barrel has existed since 2026-03-02 and was recently trimmed during Phase 2

### Plan Correction

The Phase 2.5 plan characterisation ("dead-on-arrival barrel with zero importers") is **factually incorrect**. This may have been true at an earlier snapshot or may have been a misread of knip output (which may have flagged unused *re-exports from* the barrel, not the barrel itself).

### Options

- **(a) Close as no-action -- plan was wrong**: The barrel is alive and well with 17 consumers. No remediation needed. Update the plan to note the correction.
- **(b) Extend barrel for consistency**: Add `buildSearchSdkConfig`, `resolveBulkDirFromInputs`, and type `WithEsClientDeps` to the barrel to eliminate mixed import patterns. Optional consistency improvement.
- **(c) Close and note optional consistency follow-up**: Mark resolved; record the consistency opportunity as a future low-priority item.

**Recommendation**: (a) close as no-action. The barrel works, is consumed, and knip is clean. The hybrid imports are a minor consistency issue, not an architectural problem.

---

## Summary of Recommendations

| Follow-up | Plan assumption | Actual | Recommendation |
|-----------|----------------|--------|----------------|
| 2.5.1 Auth helpers | Duplicated code needs consolidation | No duplication; helpers are dead AND redundant with live code | **(a) Delete** -- helpers, tests, and file |
| 2.5.2 GT barrels | 54 excessive barrels | Old system remnant; 18 consumer files need migration | **Keep for now**; archive deletion tracked as [future plan](../../.agent/plans/architecture-and-infrastructure/future/ground-truth-archive-retirement.plan.md) |
| 2.5.3 Schema emitter | Generator emits unused exports | Hand-trimmed generated files diverge from emitter source | **(a) Fix generators**, de-export schemas, regenerate |
| 2.5.4 CLI/shared barrel | Dead-on-arrival, zero importers | 17 importers, actively used | **(a) Close** as no-action |

## Decisions (all resolved)

- **2.5.1**: Delete helpers + tests. Auth success logging already lives in `check-mcp-client-auth.ts`.
- **2.5.2**: Keep barrel hierarchy pending archive retirement (separate future plan). The archive is a poorly removed remnant but migration is significant work.
- **2.5.3**: Fix generators (never edit generated files). De-export schemas (keep as internal building blocks). Regenerate. Update docs.
- **2.5.4**: Close as no-action. Plan was wrong; barrel is alive with 17 consumers.
