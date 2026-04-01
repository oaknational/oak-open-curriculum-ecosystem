---
name: URL Remediation Snagging
overview: "Address all findings from the architectural review of the URL naming collision remediation: fix stale plan references, eliminate URL pattern duplication, correct import direction bypass, update stale documentation, and add missing test coverage."
todos:
  - id: phase-0-verify
    content: "Phase 0: Verify generateOakUrlWithContext is re-exported from curriculum-sdk and lesson delegation is type-safe"
    status: completed
  - id: phase-1-lesson-delegate
    content: "Task 1.1: Refactor generateLessonOakUrl to delegate to generateOakUrlWithContext"
    status: completed
  - id: phase-1-import-fix
    content: "Task 1.2: Fix import direction in bulk-rollup-builder.ts (sdk-codegen -> curriculum-sdk)"
    status: completed
  - id: phase-1-decorator-test
    content: "Task 1.3: Add missing decorator test for schemas without properties key"
    status: completed
  - id: phase-1-subject-tsdoc
    content: "Task 1.4: Add @remarks TSDoc to generateSubjectProgrammesUrl explaining deliberate non-delegation"
    status: completed
  - id: phase-1-see-ref
    content: "Task 1.5: Add @see ADR-145 to oak-url-convenience.ts module TSDoc"
    status: completed
  - id: phase-2-enforcement-plan
    content: "Task 2.1: Update 4 stale file references in canonical-url-enforcement.plan.md"
    status: completed
  - id: phase-2-readme
    content: "Task 2.2: Remove stale canonical-url-generator.ts references from indexing README"
    status: completed
  - id: phase-2-adr097
    content: "Task 2.3: Update 2 stale file references in ADR-097"
    status: completed
  - id: phase-3-gates
    content: "Task 3.1: Run full quality gate suite"
    status: completed
  - id: phase-3-review
    content: "Task 3.2: Invoke code-reviewer sub-agent for gateway review"
    status: completed
isProject: false
---

# URL Remediation Snagging Fixes

**Template**: quality-fix-plan-template (quality improvement, tech debt)
**Lane**: `active/` (executing now)
**Scope**: Address all findings from the sub-agent architectural review of the completed URL naming collision remediation

---

## Context

The URL naming collision remediation (ADR-145) is complete and verified. Seven specialist reviewers identified residual issues across three priority tiers. This plan addresses all of them.

## Issue Inventory

### High Priority

1. **Stale enforcement plan references** -- The queued [canonical-url-enforcement.plan.md](packages/sdks/oak-curriculum-sdk/src/oak-url-convenience.ts) references `canonical-url-generator.ts` and `canonical-url-generator.unit.test.ts` at lines 59, 73, 130, 192. These files were renamed and relocated to `oak-url-convenience.ts` in the SDK during the remediation. The plan will fail if executed as-is.
2. **URL pattern duplication in convenience functions** -- `generateLessonOakUrl` in [oak-url-convenience.ts](packages/sdks/oak-curriculum-sdk/src/oak-url-convenience.ts) (line 45) constructs the URL via template literal instead of delegating to `generateOakUrlWithContext('lesson', ...)`. This duplicates the URL pattern that the generated code owns as single source of truth.

### Medium Priority

1. **Import direction bypass** -- [bulk-rollup-builder.ts](apps/oak-search-cli/src/adapters/bulk-rollup-builder.ts) (line 21) imports `generateOakUrlWithContext` directly from `@oaknational/sdk-codegen/api-schema` instead of from `@oaknational/curriculum-sdk`. Apps should consume SDK public API, not reach into codegen internals.
2. **Stale README in indexing module** -- [apps/oak-search-cli/src/lib/indexing/README.md](apps/oak-search-cli/src/lib/indexing/README.md) references `canonical-url-generator.ts` on lines 38 and 237 as if it still exists in this directory. It was relocated to the SDK.
3. **Stale ADR-097 references** -- [ADR-097](docs/architecture/architectural-decisions/097-context-enrichment-architecture.md) references `canonical-url-generator.ts` on lines 90 and 119. These should point to `oak-url-convenience.ts` in the SDK.
4. **Missing decorator test case** -- The [schema-separation-decorators.unit.test.ts](packages/sdks/oak-sdk-codegen/code-generation/schema-separation-decorators.unit.test.ts) lacks a test for schemas with no `properties` key (e.g. `allOf`/`oneOf` composites). The decorator should handle this gracefully.

### Low Priority

1. **TSDoc `@see` reference gap** -- The module-level TSDoc in [oak-url-convenience.ts](packages/sdks/oak-curriculum-sdk/src/oak-url-convenience.ts) (line 16) references only ADR-047 but should also reference ADR-145 (which partially supersedes ADR-047 for the naming collision).
2. `**generateSubjectProgrammesUrl` does not delegate to generated code** -- This function in [oak-url-convenience.ts](packages/sdks/oak-curriculum-sdk/src/oak-url-convenience.ts) (line 141) builds the URL via template literal. However, the generated `urlForSubject` has *different semantics* (takes an array of key stages and selects the preferred one), so this is not a simple delegation. Instead, document the deliberate difference with a TSDoc `@remarks` note.

---

## Design Decisions

### Lesson URL: delegate, do not duplicate

`generateLessonOakUrl` can trivially delegate to `generateOakUrlWithContext('lesson', lessonSlug)` since the generated `urlForLesson` has identical semantics (single slug in, single URL out). The null return case cannot happen for lessons but should be handled defensively.

### Subject programmes URL: document, do not force-delegate

The generated `urlForSubject` takes `keyStageSlugs` (an array) and uses heuristics to select a preferred key stage. The convenience function `generateSubjectProgrammesUrl` takes a single explicit `keyStageSlug`. These have genuinely different interfaces. Forcing delegation would require either:

- Wrapping the single slug in an array (lossy: the heuristic might select a different key stage)
- Adding a new generated function (over-engineering for a known-stable pattern)

The correct action is to add a `@remarks` TSDoc explaining why this function does not delegate, referencing `urlForSubject` and the semantic difference.

### Import direction: re-export from SDK

`bulk-rollup-builder.ts` should import `generateOakUrlWithContext` from `@oaknational/curriculum-sdk` (which already re-exports it). This is a one-line import path change.

---

## Non-Goals (YAGNI)

- Refactoring `generateSubjectProgrammesUrl` to delegate to generated code (semantic mismatch)
- Adding new generated URL helpers for the subject programmes case
- Modifying the enforcement plan beyond fixing stale references (it remains queued)

---

## Phase 0: Verify Assumptions

### Task 0.1: Confirm `generateOakUrlWithContext` is exported from curriculum-sdk

Verify that `@oaknational/curriculum-sdk` re-exports `generateOakUrlWithContext` so the import redirect in `bulk-rollup-builder.ts` is valid.

**Validation**: Check [packages/sdks/oak-curriculum-sdk/src/index.ts](packages/sdks/oak-curriculum-sdk/src/index.ts) for the re-export.

### Task 0.2: Confirm `urlForLesson` in generated code handles plain slugs

Verify that calling `generateOakUrlWithContext('lesson', 'some-slug')` returns a string (never null) so the delegation in `generateLessonOakUrl` is type-safe.

**Validation**: Check the generated [url-helpers.ts](packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/routing/url-helpers.ts) -- `urlForLesson` always returns `string`, confirmed.

---

## Phase 1: Code Fixes

### Task 1.1: Refactor `generateLessonOakUrl` to delegate

**File**: [oak-url-convenience.ts](packages/sdks/oak-curriculum-sdk/src/oak-url-convenience.ts)

Replace the template literal with delegation to `generateOakUrlWithContext('lesson', lessonSlug)`. The return type is `string | null` but lessons always produce a string, so assert non-null with a fail-fast guard.

### Task 1.2: Fix import direction in `bulk-rollup-builder.ts`

**File**: [bulk-rollup-builder.ts](apps/oak-search-cli/src/adapters/bulk-rollup-builder.ts)

Change line 21 from:

```typescript
import { generateOakUrlWithContext } from '@oaknational/sdk-codegen/api-schema';
```

to:

```typescript
import { generateOakUrlWithContext } from '@oaknational/curriculum-sdk';
```

### Task 1.3: Add missing decorator test case

**File**: [schema-separation-decorators.unit.test.ts](packages/sdks/oak-sdk-codegen/code-generation/schema-separation-decorators.unit.test.ts)

Add a test for a schema with no `properties` key (e.g. using `allOf`). Verify the decorator handles it gracefully without throwing.

### Task 1.4: Add `@remarks` TSDoc to `generateSubjectProgrammesUrl`

**File**: [oak-url-convenience.ts](packages/sdks/oak-curriculum-sdk/src/oak-url-convenience.ts)

Add a `@remarks` block explaining why this function does not delegate to the generated `urlForSubject` (semantic difference: single key stage vs array with heuristic selection).

### Task 1.5: Update module-level `@see` reference

**File**: [oak-url-convenience.ts](packages/sdks/oak-curriculum-sdk/src/oak-url-convenience.ts)

Add `@see ADR-145 Oak URL Naming Collision Remediation` alongside the existing ADR-047 reference.

---

## Phase 2: Documentation Fixes

### Task 2.1: Update enforcement plan stale references

**File**: [canonical-url-enforcement.plan.md](.agent/plans/sdk-and-mcp-enhancements/current/canonical-url-enforcement.plan.md)

Update all four stale references to `canonical-url-generator.ts`:

- Line 59: update ingestion bulk path description to reference `oak-url-convenience.ts` in the SDK
- Line 73: update target flow diagram
- Line 130: update test specification file reference
- Line 192: update implementation file reference

Also update the plan's `Last Updated` date.

### Task 2.2: Update indexing README

**File**: [apps/oak-search-cli/src/lib/indexing/README.md](apps/oak-search-cli/src/lib/indexing/README.md)

- Line 38: remove the `canonical-url-generator.ts` entry from "Shared Utilities" and note that URL generation now lives in `@oaknational/curriculum-sdk` (`oak-url-convenience.ts`)
- Line 237: remove the `canonical-url-generator.ts` row from the Key Files Reference table

### Task 2.3: Update ADR-097 stale file references

**File**: [ADR-097](docs/architecture/architectural-decisions/097-context-enrichment-architecture.md)

- Line 90: update `canonical-url-generator.ts` to reference `oak-url-convenience.ts` in `@oaknational/curriculum-sdk`
- Line 119: same update in the Implementation section

---

## Phase 3: Quality Gates and Review

### Task 3.1: Quality gates

Run the full quality gate suite one gate at a time:

```bash
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
```

### Task 3.2: Sub-agent review

Invoke `code-reviewer` for a gateway review of all changes. Focus areas:

- Import direction correctness
- URL pattern single-source-of-truth compliance
- Documentation accuracy

---

## Risk Assessment


| Risk                                                                       | Likelihood | Impact | Mitigation                                                       |
| -------------------------------------------------------------------------- | ---------- | ------ | ---------------------------------------------------------------- |
| `generateOakUrlWithContext('lesson', ...)` returns null for some edge case | Very low   | Medium | Fail-fast guard with descriptive TypeError                       |
| Changing import path in bulk-rollup-builder breaks resolution              | Low        | Low    | The re-export already exists; type-check will catch any mismatch |
| Documentation changes introduce formatting issues                          | Low        | Low    | markdownlint gate catches formatting                             |


---

## Consolidation

After all work is complete and quality gates pass, run `/jc-consolidate-docs`
to graduate settled content and update the napkin.