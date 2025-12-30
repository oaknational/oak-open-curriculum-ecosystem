# Schemas Endpoint RFC: Validation Bundle for SDK Type-Gen

## Purpose

Provide a schema bundle endpoint that exposes the API's internal Zod validators (and related metadata) so downstream tooling can reuse the exact runtime validation logic at type-generation time. This avoids OpenAPI -> Zod round-trips, enables optional validation in generated tooling (including MCP tools), and keeps the API as the source of truth.

This RFC expands item 12 in `05-medium-priority-requests.md`.

## Goals

- Publish a stable, cacheable bundle of validators for build-time consumption.
- Keep OpenAPI as the primary contract while allowing first-class validation reuse.
- Support optional use of validators in SDK runtime wrappers and tool generation.
- Preserve deterministic outputs so `pnpm type-gen` can reliably regenerate code.

**User impact:** SDK/MCP engineers can reuse exact API validators; API consumers get optional runtime checks without schema drift.

## Non-goals

- Replace OpenAPI as the primary contract for the SDK pipeline.
- Require consumers to use Zod at runtime (validators are optional).
- Introduce compatibility layers or multiple sources of truth.

## Proposed API Shape

Bundle-only is the v1 plan. Single-schema endpoints can be added later if we prove the need.

### Endpoint

- `GET /api/v0/schemas` (bundle, v1)
- Optional later: `GET /api/v0/schemas/{schemaName}` (single schema)

### Response (bundle)

```json
{
  "version": "v0",
  "generatedAt": "2025-01-05T12:00:00Z",
  "openapi": {
    "url": "https://open-api.thenational.academy/api/v0/swagger.json",
    "etag": "\"abc123\"",
    "sha256": "..."
  },
  "schemas": {
    "LessonSummaryResponse": {
      "zodSource": "export const lessonSummaryResponseSchema = z.object({ ... })",
      "jsonSchema": { "type": "object", "properties": { } },
      "typeScript": "export interface LessonSummaryResponse { ... }",
      "tags": ["lesson", "response"]
    }
  }
}
```

### Response (single schema)

```json
{
  "schemaName": "LessonSummaryResponse",
  "zodSource": "export const lessonSummaryResponseSchema = z.object({ ... })",
  "jsonSchema": { "type": "object", "properties": { } },
  "typeScript": "export interface LessonSummaryResponse { ... }",
  "tags": ["lesson", "response"]
}
```

### Caching

- Support `ETag` and `If-None-Match` for the bundle.
- Consider `Cache-Control: public, max-age=...` if the API deploy cadence permits.

## SDK Type-Gen Integration (Proposed)

1. Fetch OpenAPI as today.
2. Fetch `/api/v0/schemas` if available.
3. Validate that the schema bundle matches the OpenAPI metadata (etag/sha).
4. Write Zod validator modules into the generated SDK output.
5. Expose validators via opt-in exports; runtime wrappers can choose to validate.

## Rationale

- The API already defines Zod schemas and uses them to generate OpenAPI.
- Consuming applications currently rehydrate Zod from OpenAPI, losing fidelity.
- A bundle endpoint allows the SDK build process to use the same validators the API uses, while keeping a single source of truth.

## Open Questions

- What should the compatibility rule be if OpenAPI and Zod sources diverge?
- Which Zod version should be guaranteed by the API, and how is it versioned?
- Should the bundle expose TS, JS, or both (ESM/CJS)?
- Is JSON Schema required for every validator, or should it be optional?
- What is the maximum acceptable payload size for the bundle?

## Success Criteria

- `pnpm type-gen` can optionally consume `/schemas` without breaking determinism.
- SDK consumers can opt into runtime validation with exact API behaviour.
- Tool generators can use validators for argument/response checking when needed.
