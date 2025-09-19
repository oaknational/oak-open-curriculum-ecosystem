# Canonical URL Upstream Migration Plan

## Intent

Move canonical URL generation from consuming applications into the SDK core, ensuring all API responses automatically include canonical URLs. This eliminates manual URL generation in applications and provides consistent, context-aware URL generation across all SDK usage.

**Impact**: Any application using the Oak Curriculum SDK will automatically receive canonical URLs for curriculum resources without additional code, improving developer experience and ensuring consistency.

## Notes

- This plan follows TDD principles: tests first, then implementation
- All tests must focus on behaviour, not implementation details
- No compatibility layers: old approaches are replaced directly
- Pure functions: all URL generation logic is pure
- Fail fast: broken fallbacks removed immediately
- Self-reviews replace sub-agent reviews as per GO.md
- Every third task includes grounding to stay focused

## Todo List

### Phase 1: TDD Foundation - Write Failing Tests First

**ACTION:** Write unit tests for updated URL generation behaviour

- Test that URL generation returns correct canonical URLs for lessons with valid slugs
- Test that URL generation returns correct canonical URLs for sequences with valid slugs
- Test that URL generation returns undefined for units without required context
- Test that URL generation returns undefined for subjects without required context
- Test that URL generation logs warnings when context is missing
- File: `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/routing/url-helpers.unit.test.ts`

**REVIEW:** Self-review: Verify tests prove URL generation behaviour, not implementation details

**ACTION:** Write unit tests for response augmentation behaviour

- Test that response augmentation adds canonicalUrl field to lesson responses
- Test that response augmentation adds canonicalUrl field to sequence responses
- Test that response augmentation adds canonicalUrl field to unit responses with context
- Test that response augmentation adds canonicalUrl field to subject responses with context
- Test that response augmentation omits canonicalUrl when context is missing
- Test that response augmentation logs warnings when context is missing
- File: `packages/sdks/oak-curriculum-sdk/src/response-augmentation.unit.test.ts`

**REVIEW:** Self-review: Verify tests prove response augmentation behaviour, not implementation details

**ACTION:** Write integration tests for SDK response pipeline behaviour

- Test that lesson API responses include canonical URLs automatically
- Test that sequence API responses include canonical URLs automatically
- Test that unit API responses include canonical URLs when context is available
- Test that subject API responses include canonical URLs when context is available
- Test that API responses omit canonical URLs when context is missing
- Test that API responses maintain existing data structure while adding canonical URLs
- File: `packages/sdks/oak-curriculum-sdk/src/response-validation.integration.test.ts`

**REVIEW:** Self-review: Verify integration tests prove SDK response pipeline behaviour, not implementation details

**QUALITY-GATE:** Run `pnpm test` to ensure all new tests fail (Red phase of TDD)

### Phase 2: Update URL Generation - Remove Broken Fallbacks

**ACTION:** Update URL helpers generator to remove fallback patterns behaviour

- Remove fallback URL patterns for units and subjects from `generateCanonicalUrl()`
- Add warning logging for missing context instead of generating invalid URLs
- Update `generateCanonicalUrl()` to require context for units/subjects
- File: `packages/sdks/oak-curriculum-sdk/scripts/typegen/routing/generate-url-helpers.ts`

**REVIEW:** Self-review: Verify fallback patterns are removed and warning logging is added

**ACTION:** Regenerate URL helpers with updated logic

- Run `pnpm type-gen` to regenerate URL helpers
- Verify generated code matches expected behaviour
- File: `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/routing/url-helpers.ts`

**REVIEW:** Self-review: Verify generated code is correct and follows pure function principles

**QUALITY-GATE:** Run `pnpm type-gen && pnpm build && pnpm type-check` to ensure regeneration works

### Phase 3: Create Response Augmentation - Pure Function

**ACTION:** Create pure function for response augmentation behaviour

- Implement `augmentResponseWithCanonicalUrl(response, path, method): ResponseWithCanonicalUrl`
- Extract context from response data for units and subjects
- Generate canonical URLs using context-aware functions
- Handle missing context with warning logging
- File: `packages/sdks/oak-curriculum-sdk/src/response-augmentation.ts`

**REVIEW:** Self-review: Verify function is pure and handles all content types correctly

**ACTION:** Create response augmentation types behaviour

- Define `ResponseWithCanonicalUrl` type
- Define context extraction types
- Update exports in SDK index
- File: `packages/sdks/oak-curriculum-sdk/src/types/response-augmentation.ts`

**REVIEW:** Self-review: Verify types are comprehensive and follow type safety principles

**QUALITY-GATE:** Run `pnpm build && pnpm type-check` to ensure new code compiles

### Phase 4: Integrate into SDK Core - Update Response Pipeline

**ACTION:** Update response validation to include canonical URL generation behaviour

- Modify `validateResponse()` to automatically augment responses
- Integrate canonical URL generation into response pipeline
- Apply to ALL API responses automatically
- File: `packages/sdks/oak-curriculum-sdk/src/response-validation.ts`

**REVIEW:** Self-review: Verify integration maintains existing behaviour while adding canonical URLs

**ACTION:** Update OpenAPI schema generation to include canonicalUrl field behaviour

- Modify schema generation to include `canonicalUrl?: string` in response types
- Update all response schemas to include this field
- Regenerate all types via `pnpm type-gen`
- File: `packages/sdks/oak-curriculum-sdk/scripts/typegen/`

**REVIEW:** Self-review: Verify schema changes are comprehensive and consistent

**QUALITY-GATE:** Run `pnpm type-gen && pnpm build && pnpm type-check` to ensure schema updates work

### Phase 5: Remove Manual URL Generation - No Compatibility

**ACTION:** Remove manual URL generation from HTTP MCP server behaviour

- Delete `maybeAugmentWithCanonicalUrl()` function
- Remove manual canonical URL generation code
- Update to rely on SDK's automatic URL generation
- File: `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts`

**REVIEW:** Self-review: Verify manual URL generation is completely removed

**ACTION:** Remove manual URL generation from OpenAI connector behaviour

- Remove manual canonical URL generation code
- Update to rely on SDK's automatic URL generation
- File: `packages/sdks/oak-curriculum-sdk/src/types/generated/openai-connector/index.ts`

**REVIEW:** Self-review: Verify manual URL generation is completely removed

**ACTION:** Update E2E tests to expect canonical URLs in all responses

- Test that lesson responses include canonical URLs in the expected format
- Test that unit responses include canonical URLs when context is available
- Test that subject responses include canonical URLs when context is available
- Test that sequence responses include canonical URLs
- Test that responses maintain correct data structure with canonical URLs
- File: `packages/sdks/oak-curriculum-sdk/e2e-tests/scripts/openai-connector/index.ts`

**REVIEW:** Self-review: Verify E2E tests prove canonical URL behaviour in real system

**QUALITY-GATE:** Run `pnpm test` to ensure all tests pass (Green phase of TDD)

### Phase 6: Validation and Cleanup - Complete Migration

**ACTION:** Run full quality gates to validate migration behaviour

- Run `pnpm i` to ensure dependencies are correct
- Run `pnpm type-gen` to regenerate all types
- Run `pnpm build` to ensure everything compiles
- Run `pnpm type-check` to verify type safety
- Run `pnpm format` to ensure code is formatted correctly
- Run `pnpm lint -- --fix` to fix any linting issues
- Run `pnpm test` to run all tests
- Run `pnpm test:e2e` to run e2e tests

**REVIEW:** Self-review: Verify all quality gates pass and migration is complete

**ACTION:** Delete dead code and unused imports

- Remove any unused URL generation functions
- Remove any unused imports
- Clean up any remaining manual URL generation code
- File: Various files across the codebase

**REVIEW:** Self-review: Verify all dead code is removed and codebase is clean

**GROUNDING:** Read GO.md and follow all instructions

**ACTION:** Verify canonical URLs work in all consuming applications

- Test that HTTP MCP server responses include canonical URLs for all supported content types
- Test that OpenAI connector responses include canonical URLs for all supported content types
- Test that semantic search app works correctly with canonical URLs (if applicable)
- Test that all applications return responses in the expected format with canonical URLs
- Verify that no manual URL generation code remains in any application

**REVIEW:** Self-review: Verify all applications demonstrate correct canonical URL behaviour

**QUALITY-GATE:** Run final `pnpm test && pnpm test:e2e` to ensure everything works

## Success Criteria

- All API responses automatically include canonical URLs in the correct format
- Applications receive canonical URLs without any additional code changes
- Missing context results in warnings being logged, not invalid URLs being generated
- All tests prove the correct behaviour of canonical URL generation
- All tests pass and follow TDD principles
- Code follows pure function principles
- Type safety is maintained throughout
- Quality gates pass completely
