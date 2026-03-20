---
prompt_id: codegen-error-response-implementation
title: "Codegen Error Response — Implementation Session"
type: execution
status: complete
last_updated: 2026-03-20
---

# Codegen Error Response — Implementation Session

## Ground yourself

1. `.agent/directives/AGENT.md`
2. `.agent/plans/semantic-search/current/codegen-schema-error-response-adaptation.plan.md`
   — **read the full plan**. It contains complete investigation findings,
   root-cause analysis for both bugs, and the phased TDD execution sequence.
   Do not re-investigate — go straight to implementation.

## What happened

The upstream OpenAPI schema now documents error responses (400, 401, 404) on
all 26 endpoints using `$ref` to `components/schemas` with dotted names
(`error.BAD_REQUEST`, `error.UNAUTHORIZED`, `error.NOT_FOUND`).
`pnpm sdk-codegen` fails. This is a Cardinal Rule breach.

Investigation (2026-03-19) identified **two bugs**:

**Bug 2 (fix first)** — Dotted component names from `$ref` are passed through
unsanitised. The emitter would generate `curriculumSchemas.error.BAD_REQUEST`
(invalid JS property access) instead of `curriculumSchemas.error_BAD_REQUEST`
(the sanitised Zod registry key). The `sanitizeIdentifier` function exists in
`shared.ts` but is only applied to inline schemas, not component schemas.

**Bug 1** — The cross-validator's `collectExpectedResponseKeys` does not
generate `*:{status}` expected keys to match the wildcard entries the
response-map builder intentionally creates. The emitter and descriptor helpers
already handle wildcards correctly — only the cross-validator was left behind.

## Implementation sequence (TDD)

### Phase 1 — Bug 2: Component name sanitisation

Files:

- `packages/sdks/oak-sdk-codegen/code-generation/typegen/response-map/build-response-map.unit.test.ts`
- `packages/sdks/oak-sdk-codegen/code-generation/typegen/response-map/build-response-map.ts`
- `packages/sdks/oak-sdk-codegen/code-generation/typegen/response-map/shared.ts`

Steps:

1. **RED**: Add unit test — schema with `$ref: '#/components/schemas/error.BAD_REQUEST'`,
   assert `componentName` in resulting entries is `error_BAD_REQUEST` (sanitised)
2. **GREEN**: Apply `sanitizeIdentifier` to the component name returned by
   `getJsonResponseInfo` when `source === 'component'`. The simplest place is
   in `collectResponses` in `build-response-map.ts`, after the `getJsonResponseInfo`
   call returns a component source.
3. **Verify**: Run `pnpm test -F @oaknational/sdk-codegen` — existing tests pass

### Phase 2 — Bug 1: Cross-validator wildcard awareness

Files:

- `packages/sdks/oak-sdk-codegen/code-generation/typegen/validation/cross-validate.unit.test.ts`
- `packages/sdks/oak-sdk-codegen/code-generation/typegen/validation/cross-validate.ts`

Steps:

4. **RED**: Add unit test — schema with two operations both having 404 → same
   `$ref` component. Response-map entries include per-operation 404s AND a
   `*:404` wildcard. Assert `crossValidateResponseMap` does **not** throw.
5. **RED**: Add inverse test — schema with two operations having 404 → different
   components. Response-map entries include a `*:404` wildcard. Assert it
   **does** throw (wildcards are only valid when all operations share the same
   component).
6. **GREEN**: In `collectExpectedResponseKeys`, after walking all operations,
   detect status codes where every operation references the same component
   schema. For those, add `*:{status}` to the expected set.
7. **Verify**: Run `pnpm test -F @oaknational/sdk-codegen` — all tests pass

### Phase 3 — Regenerate and verify

8. `pnpm sdk-codegen` — confirm generation succeeds against live schema
9. `pnpm build` — confirm downstream compilation (expect clean)
10. `pnpm check` — full gate passage

### Phase 4 — Authority docs

11. Mark the plan as complete
12. Update the semantic-search prompt's prerequisite gate

## Key files reference

| File | Role |
|------|------|
| `code-generation/typegen/response-map/build-response-map.ts` | Builder — lines 62-93 do wildcard consolidation |
| `code-generation/typegen/response-map/shared.ts` | `sanitizeIdentifier`, `getJsonResponseInfo`, `extractComponentNameFromRef` |
| `code-generation/typegen/validation/cross-validate.ts` | `collectExpectedResponseKeys` (line 76), `crossValidateResponseMap` (line 56) |
| `code-generation/typegen/response-map/emit-response-validators.ts` | Emitter — `buildSchemaExpression` (line 159), `getWildcardRecord` (line 84) |
| `code-generation/typegen/response-map/build-response-descriptor-helpers.ts` | Descriptor helpers — wildcard merge at lines 19-49 |
| `code-generation/zodgen-core.ts` | Zod generation — `sanitizeSchemaKeys` / `renameInlineSchema` |

All paths are relative to `packages/sdks/oak-sdk-codegen/`.

## Constraints

- TDD at all levels. No type shortcuts (`as`, `any`, `!`).
- Fixes must be general — future error status codes must work without changes.
- Do not touch search-cli ingestion code — separate session.
- All reviewer findings are blocking.
- Cardinal Rule acceptance criterion: `pnpm sdk-codegen && pnpm build` succeeds.
