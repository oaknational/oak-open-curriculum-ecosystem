---
prompt_id: codegen-error-response-adaptation
title: "Codegen Error Response Adaptation"
type: execution
status: active
last_updated: 2026-03-19
---

# Codegen Error Response Adaptation

## Entry documents (read in order)

1. `.agent/directives/AGENT.md`
2. `.agent/plans/semantic-search/current/codegen-schema-error-response-adaptation.plan.md`
   — **this is the source of truth**; the plan contains full investigation
   findings, root-cause analysis, and the phased TDD execution sequence.

## Context

The upstream OpenAPI schema (version `0.6.0-e9319ab...`) now documents error
responses (400, 401, 404) across all 26 endpoints using `$ref` to
`components/schemas` (`error.BAD_REQUEST`, `error.UNAUTHORIZED`,
`error.NOT_FOUND`). `pnpm sdk-codegen` fails at the response-map
cross-validation step. This is a Cardinal Rule breach — it blocks all
quality gates across the entire repository.

Branch: `feat/es_index_update`.

## Investigation Complete — Two Bugs Identified

Investigation was completed on 2026-03-19. Two distinct bugs were found:

**Bug 1 — Cross-validator does not expect wildcard entries.** The response-map
builder intentionally consolidates shared error responses into wildcard entries
(`*:400`, `*:401`, `*:404`). The emitter and descriptor helpers already handle
these. Only the cross-validator's `collectExpectedResponseKeys` was not updated
to generate matching `*:` expected keys.

**Bug 2 — Dotted component names break the emitter.** The upstream uses
`error.BAD_REQUEST` etc. as component schema names (dots in names). The `$ref`
extractor passes these through raw, so the emitter would generate
`curriculumSchemas.error.BAD_REQUEST` (invalid property access) instead of
`curriculumSchemas.error_BAD_REQUEST` (the sanitised key the Zod registry
uses). The `sanitizeIdentifier` function exists in `shared.ts` but is only
applied to inline schemas, not component schemas.

**Downstream type errors** (`SearchScopeWithAll`, `rrf-query-helpers`) are
stale-type cascades — they will resolve after successful regeneration. No
targeted downstream fixes expected.

## Required work sequence

Bug 2 must be fixed **first** — Bug 1's wildcard detection depends on
correct (sanitised) component names for its "same component" check.

1. **Phase 1 — Bug 2: Component name sanitisation** (TDD):
   - RED: Unit test with dotted `$ref` names, assert sanitised `componentName`
   - GREEN: Apply `sanitizeIdentifier` to component names in the builder
   - Verify existing response-map tests pass

2. **Phase 2 — Bug 1: Cross-validator wildcard awareness** (TDD):
   - RED: Unit test with shared error responses + wildcard entries, assert no throw
   - RED: Inverse test — different components per status, assert throw on wildcards
   - GREEN: Implement wildcard-aware expected-key collection
   - Verify existing cross-validator tests pass

3. **Phase 3 — Regenerate and verify**:
   - `pnpm sdk-codegen` — confirm generation succeeds (live schema)
   - `pnpm build` — confirm downstream compilation
   - `pnpm check` — full gate passage

4. **Phase 4 — Update authority docs**:
   - Mark the codegen adaptation plan as complete
   - Update the semantic-search prompt's prerequisite gate

## Decoupling

`SDK_CODEGEN_MODE=ci pnpm sdk-codegen` uses the cached schema (no error
responses) and passes today. Both fixes can be developed and tested entirely
with synthetic schemas in unit tests, then validated against the live schema
in Phase 3.

## Constraints

- TDD at all levels. No type shortcuts.
- Do not expand scope beyond making `pnpm sdk-codegen` and `pnpm check` pass.
- Do not touch search-cli ingestion code — that is a separate session.
- All reviewer findings are blocking.
