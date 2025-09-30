# ADR-048: Shared `parseSchema` Helper for Request & Response Validation

## Status

Accepted

## Context

The Oak Curriculum SDK generates extensive Zod schemas from the OpenAPI contract. Historically each consumer (SDK validation modules, Semantic Search, MCP servers) called `schema.safeParse` directly and applied ad-hoc transformations. This led to:

- Repeated helper implementations across packages.
- Occasional drift between request parameter validation and response validation.
- Inconsistent `ValidationResult` shapes, making logging and plan reviews harder.

We now expose a single shared helper, `parseSchema`, that wraps `schema.safeParse` and returns a uniform `ValidationResult`. Downstream helpers (`parseWithCurriculumSchema`, `parseEndpointParameters`, `parseSearchResponse`, `parseSearchSuggestionResponse`) delegate to it.

## Decision

1. Export `SchemaInput` and `SchemaOutput` type utilities so `parseSchema` can infer the generated `_input`/`_output` types automatically.
2. Implement `parseSchema(schema, data)` once in `packages/sdks/oak-curriculum-sdk/src/validation/types.ts`, returning `{ ok: true, value }` or `{ ok: false, issues, trace }`.
3. Route all validation through that helper:
   - Curriculum responses (`parseWithCurriculumSchema`, `parseWithCurriculumSchemaInstance`).
   - Request parameter maps (`parseEndpointParameters`).
   - Search responses and suggestions (`parseSearchResponse`, `parseSearchSuggestionResponse`).
4. Prohibit direct calls to `schema.safeParse` in consumers; instead import the helpers from the SDK.
5. Document the pattern in workspace READMEs and contributor guidelines so new features adopt it by default.

## Scope

- **Inputs**: Request parameter objects (path/query/body) use `parseEndpointParameters`, which delegates to `parseSchema`.
- **Responses**: Curriculum and search responses use `parseWithCurriculumSchema` / `parseSearchResponse`, again delegating to `parseSchema`.
- **Suggestions**: `parseSearchSuggestionResponse` shares the same helper.

If we introduce new request payloads or response types, they should extend the same pattern.

## Consequences

- A single validation pathway eliminates duplicated helper logic.
- Errors surface consistent `ValidationResult` objects, simplifying logging and plan reviews.
- Future schema changes only require `pnpm type-gen`; no consumer needs to adjust type assertions or helper signatures.
- Documentation now references the shared helper (root README, SDK README, onboarding guide, contributor guide).

## Implementation Notes

- Helper lives in `packages/sdks/oak-curriculum-sdk/src/validation/types.ts`.
- Re-exported via `packages/sdks/oak-curriculum-sdk/src/validation/index.ts` for consumers.
- Tests covering request/response validation (`request-validators.unit.test.ts`, `search-response-validators.unit.test.ts`, etc.) exercise the new helpers.

## Follow-up

- Update or create helpers when new request payloads appear (e.g. admin ingestion APIs) rather than embedding validation inline.
- Ensure new workspaces import the SDK helpers before shipping.
