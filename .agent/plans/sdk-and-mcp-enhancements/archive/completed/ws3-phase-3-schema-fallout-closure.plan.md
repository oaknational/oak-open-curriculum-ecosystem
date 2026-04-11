---
name: "WS3 Phase 3 Schema Fallout Closure"
overview: "Close the regenerated lesson-summary schema fallout by aligning SDK validator fixtures and search-cli lesson-summary fixtures with required canonicalUrl and oakUrl fields."
parent_plan: "ws3-phase-3-canonical-contracts-and-runtime.plan.md"
isProject: false
todos:
  - id: phase-0-foundation
    content: "Phase 0: Re-ground the generated lesson-summary contract and keep this work separate from canonical-url-enforcement."
    status: completed
  - id: phase-1-sdk-fixtures
    content: "Phase 1: Fix curriculum-sdk lesson-summary validator fixtures for required canonicalUrl and oakUrl."
    status: completed
  - id: phase-2-search-cli-fixtures
    content: "Phase 2: Align search-cli SearchLessonSummary fixtures, helpers, and sandbox data with the regenerated schema."
    status: completed
  - id: phase-3-closure
    content: "Phase 3: Run closure validation and feed the result back into the wider WS3 Phase 3 gate/reviewer pass."
    status: completed
---

# WS3 Phase 3 Schema Fallout Closure

**Last Updated**: 2026-03-31  
**Status**: ✅ COMPLETE  
**Scope**: Fix the required `canonicalUrl`/`oakUrl` lesson-summary fallout in
the SDK validator tests and `oak-search-cli` fixtures without changing runtime
contracts or policy plans.

---

## Context

The regenerated OpenAPI schema now requires both `canonicalUrl` and `oakUrl`
on `/lessons/{lesson}/summary` responses.

That change exposed two distinct closure failures:

1. **`curriculum-sdk` validator fixtures drifted from the generated schema**
   - Evidence: `packages/sdks/oak-curriculum-sdk/src/validation/response-validators.unit.test.ts`
     has 4 failures.
   - Root cause: lesson-summary fixtures still model the old response shape.
2. **`oak-search-cli` lesson-summary fixtures drifted from `SearchLessonSummary`**
   - Evidence: `apps/oak-search-cli` type-check fails, and several helper tests
     still build lesson summaries without `oakUrl`.
   - Root cause: helper fixtures and sandbox fixture JSON were not updated when
     the generated lesson-summary contract changed.

This is **not** the queued
`current/canonical-url-enforcement.plan.md` work. That queued plan is about
future validation policy and ingestion enforcement. This active plan is only
about strict fixture and helper alignment with the already-generated contract.

## Closure Record (2026-03-31, late evening)

### Phase 0: Re-grounded the contract

- Confirmed the generated lesson-summary contract is the only source of truth
- Kept this work separate from `current/canonical-url-enforcement.plan.md`

### Phase 1: Closed `curriculum-sdk` validator fixture drift

- Updated `/lessons/{lesson}/summary` validator fixtures so valid cases include
  both required URL fields
- Tightened the negative case so it isolates the intended invalid field rather
  than failing early on missing URLs
- Added explicit negative-path coverage for missing `canonicalUrl` and
  `oakUrl`

### Phase 2: Closed `oak-search-cli` lesson-summary fixture drift

- Updated every touched lesson-summary helper and direct fixture literal to
  supply the generated required fields
- Centralised helper validation by parsing shared builders with the generated
  lesson-summary schema
- Aligned sandbox lesson-summary JSON with the regenerated contract

### Phase 3: Wider closure hand-off completed

- Stage 1 widget-resource validation remained green
- Targeted SDK and Search CLI validation passed
- Wider reviewer pass completed in the parent closure flow
- `pnpm check` and `pnpm qg` are both green on the current tree

## Non-Goals

- No OpenAPI, codegen, or runtime contract changes
- No URL-enforcement policy work
- No host-behaviour or MCP transport changes
- No reviewer pass until the wider Phase 3 closure is ready

## Foundation Recommitment

Before each phase:

1. Re-read `.agent/directives/principles.md`
2. Re-read `.agent/directives/testing-strategy.md`
3. Re-read `.agent/directives/schema-first-execution.md`
4. Reconfirm that this is fixture alignment only, not a policy redesign

## Resolution Plan

### Phase 0: Re-ground the contract

Confirm from the generated schema that lesson summary responses require both
`canonicalUrl` and `oakUrl`, then keep the scope separate from the queued
canonical URL enforcement plan.

**Acceptance criteria**

1. The generated lesson-summary schema is the only source of truth for this work
2. This plan does not introduce policy or runtime changes
3. The queued `current/canonical-url-enforcement.plan.md` remains untouched

**Deterministic validation**

```bash
rg -n "LessonSummaryResponseSchema|oakUrl|canonicalUrl" \
  packages/sdks/oak-sdk-codegen/src/types/generated/zod/curriculumZodSchemas.ts \
  packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/api-schema-base.ts
```

### Phase 1: Fix `curriculum-sdk` validator fixtures

Update the `/lessons/{lesson}/summary` fixtures in
`packages/sdks/oak-curriculum-sdk/src/validation/response-validators.unit.test.ts`
so every valid lesson-summary fixture contains both required URL fields. Update
the invalid-array test so those required fields are present and the failure
isolates `lessonKeywords`.

**Acceptance criteria**

1. The four failing validator tests pass
2. The invalid-array test fails for the intended field, not a missing URL field
3. No runtime validator behaviour changes

**Deterministic validation**

```bash
pnpm --dir packages/sdks/oak-curriculum-sdk exec vitest run \
  src/validation/response-validators.unit.test.ts
pnpm --dir packages/sdks/oak-curriculum-sdk test
```

### Phase 2: Fix `oak-search-cli` lesson-summary fixtures

Update every local lesson-summary helper or direct `SearchLessonSummary`
literal so the new required fields are centralised and consistent. This
includes the minimal mock fixture, helper builders, and sandbox lesson-summary
JSON.

Primary files:

- `apps/oak-search-cli/src/lib/index-batch-generator.unit.test.ts`
- `apps/oak-search-cli/src/lib/indexing/document-transforms.unit.test.ts`
- `apps/oak-search-cli/src/lib/indexing/document-transform-helpers.unit.test.ts`
- `apps/oak-search-cli/src/lib/indexing/lesson-planning-snippets.unit.test.ts`
- `apps/oak-search-cli/src/lib/indexing/semantic-summary-generator.unit.test.ts`
- `apps/oak-search-cli/fixtures/sandbox/lesson-summaries.json`

**Acceptance criteria**

1. `apps/oak-search-cli` type-check passes
2. Search CLI tests that parse lesson summaries pass with the new required fields
3. Fixture helpers keep the new fields centralised rather than duplicating ad hoc literals

**Deterministic validation**

```bash
pnpm --dir apps/oak-search-cli type-check
pnpm --dir apps/oak-search-cli test
```

### Phase 3: Closure hand-off to WS3 Phase 3

Once the schema fallout is green, hand control back to the wider WS3 Phase 3
closure flow for reviewers and full repo gates.

**Acceptance criteria**

1. Stage 1 widget-resource closure remains green
2. Stage 2 schema fallout is green in both workspaces
3. The wider Phase 3 plans and prompt can truthfully state the blocker order
4. Wider closure gates and reviewers can complete without schema fallout noise

**Deterministic validation**

```bash
pnpm --dir apps/oak-curriculum-mcp-streamable-http exec vitest run \
  src/register-resources.integration.test.ts \
  src/register-resources-observability.integration.test.ts
pnpm --dir apps/oak-curriculum-mcp-streamable-http type-check
pnpm --dir packages/sdks/oak-curriculum-sdk exec vitest run \
  src/validation/response-validators.unit.test.ts
pnpm --dir apps/oak-search-cli type-check
```

## Exit Criteria

1. The SDK validator fixture failures are resolved
2. `oak-search-cli` lesson-summary fixture drift is resolved
3. No runtime or policy contracts changed
4. The wider WS3 Phase 3 closure can proceed to reviewers and `pnpm check`
5. The wider closure has now completed with green `pnpm qg`
