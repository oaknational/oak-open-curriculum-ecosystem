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

## Context

The upstream OpenAPI schema now documents error responses (400, 401, 404)
across endpoints. `pnpm sdk-codegen` fails at the response-map
cross-validation step. This is a Cardinal Rule breach — it blocks all
quality gates across the entire repository.

The 404 transcript decorator conflict has already been resolved (transcript
entry removed from `ENDPOINTS_WITH_LEGITIMATE_404S` in a prior session).
The remaining issue is the response-map cross-validation rejecting wildcard
`*:400`, `*:401`, `*:404` entries.

Branch: `feat/es_index_update`.

## Required work sequence

1. **Investigate** (read-only, no mutations):
   - Read the cached upstream schema
     (`packages/sdks/oak-sdk-codegen/schema-cache/api-schema-original.json`)
     to understand the shape of the new error responses. Are they on
     individual operations, shared via `components/responses`, or both?
   - Read the response-map builder
     (`packages/sdks/oak-sdk-codegen/code-generation/typegen/response-map/build-response-map.ts`)
     to understand how and why it generates the `*:` wildcard prefix.
   - Read the cross-validator
     (`packages/sdks/oak-sdk-codegen/code-generation/typegen/validation/cross-validate.ts`)
     to understand how `collectExpectedResponseKeys` builds its set and why
     the wildcard entries don't match.
   - Present findings and proposed fix approach before writing code.

2. **Fix the codegen** (TDD):
   - Write RED tests proving the desired cross-validation behaviour when
     error responses are present in the schema.
   - Implement the fix. The plan lists three options — choose based on
     investigation findings.
   - The fix must be general: if the upstream adds more error status codes
     in future, `pnpm sdk-codegen` must handle them without manual changes.

3. **Regenerate and fix downstream**:
   - Run `pnpm sdk-codegen` — confirm generation succeeds.
   - Run `pnpm build` — fix any downstream type errors from regenerated types.
   - The `curriculum-sdk` had a `SearchScopeWithAll` indexing error and the
     `oak-search-sdk` had a type predicate issue. These may resolve once
     codegen regenerates, or may need targeted fixes.

4. **Run full gates**:
   - `pnpm check` must pass end-to-end.
   - The Cardinal Rule acceptance criterion: `pnpm sdk-codegen && pnpm build`
     succeeds cleanly.

5. **Update authority docs**:
   - Mark the codegen adaptation plan as complete.
   - Update the semantic-search prompt's Step 3 gate to reflect that the
     prerequisite is now met.

## Constraints

- TDD at all levels. No type shortcuts.
- Do not expand scope beyond making `pnpm sdk-codegen` and `pnpm check` pass.
- Do not touch search-cli ingestion code — that is a separate session.
- All reviewer findings are blocking.
