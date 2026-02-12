# Oak Open Curriculum Tooling Requirements for Castr

## Intent

Provide canonical inputs for validating `@engraph/castr` against a real, schema-first pipeline. These OpenAPI fixtures are the ground truth for the Oak Open Curriculum API: every generated type, validator, and MCP tool ultimately flows from them. The SDK-decorated schema is the input passed to castr; the original schema is retained for provenance and upstream feedback. OpenAPI 3.0 inputs are preserved alongside OpenAPI 3.1 upgrades used for stricter, fully valid checks. These fixtures define the contract Castr must satisfy for the current systems, not an implementation detail of the harness.

## Negotiation Context

This document represents Oak's initial requirements. It is a starting point for discussion, not a final dictation.

### What's Non-Negotiable (and Why)

| Requirement | Rationale |
|-------------|-----------|
| **Strict object validation** | Oak's MCP tools fail fast on invalid API responses. Unknown keys indicate schema drift that must be caught immediately, not silently ignored. |
| **Deterministic output** | Oak's CI pipeline verifies that `type-gen` produces identical output. Non-determinism causes spurious diffs and broken builds. |
| **Type preservation** | Oak's entire SDK type system depends on literal types flowing from the schema. Widening `'/api/lessons'` to `string` breaks compile-time safety for every consumer. |
| **No invented optionality** | If the schema says required, it's required. Adding `.optional()` "for safety" masks real bugs and violates the schema contract. |

### What's Negotiable

| Area | Oak's Flexibility |
|------|-------------------|
| **File structure** | Oak can adapt to any reasonable output layout. Current structure is not sacred. |
| **API shape** | As long as the required data is accessible, the exact function signatures and export structure are flexible. |
| **Naming conventions** | Prefer configurable hooks, but Oak can adapt to reasonable defaults. |
| **Path format** | Colon (`:id`) vs curly (`{id}`) - Oak can adapt either way if castr has a preference. |
| **Bundle manifest structure** | The current `castr-bundle.schema.json` is a proposal. Open to revision. |
| **Emitter granularity** | Whether Zod/TypeScript/metadata come from one emitter or multiple is flexible. |

### How to Propose Changes

If castr identifies requirements that are problematic, unclear, or could be improved:

1. **Document the concern** - What specific requirement is problematic and why?
2. **Propose an alternative** - What would work better for castr while still meeting Oak's underlying need?
3. **Discuss impact** - Oak will assess whether the alternative satisfies the actual constraint (not just the stated requirement).

The goal is a contract that works well for both sides, not rigid adherence to initial assumptions.

## How Oak Uses Castr Output

Understanding the consumption context helps explain why certain requirements exist.

### MCP Tool Generation

Every OpenAPI endpoint becomes an MCP (Model Context Protocol) tool:

```text
OpenAPI operation → Zod parameter schema → MCP tool input validation
                  → Zod response schema  → MCP tool output validation
```

MCP tools are invoked by AI agents. Invalid responses must fail immediately with clear errors - agents cannot debug silent data corruption.

### Response Validation

Oak's SDK validates every API response at runtime:

```typescript
const response = await client.GET('/lessons/{lesson}');
const validated = LessonSchema.parse(response.data); // Fails fast on invalid data
```

This catches API contract drift before it propagates to consumers. Strict schemas are essential.

### Semantic Search

Generated types feed into Elasticsearch document indexing:

```text
Zod schema → TypeScript type → Document mapper → Elasticsearch index
```

Type safety ensures search documents match the indexed schema exactly.

### Type-Safe SDK Client

The SDK exposes a fully typed API client where paths, methods, parameters, and responses are all typed from the schema:

```typescript
// Types flow from schema - no manual type definitions
const lesson = await sdk.lessons.get({ lesson: 'lesson-slug' });
// lesson is fully typed based on the OpenAPI response schema
```

This is why literal types matter - `'/lessons/{lesson}'` as a literal enables precise type inference.

## Phase 1 Success Criteria

Phase 1 is complete when Oak can:

### Functional Criteria

1. **Replace the adapter** - Remove `openapi-zod-client` and `openapi3-ts` dependencies entirely
2. **Generate equivalent output** - `curriculumZodSchemas.ts` compiles and exports:
   - All component schemas with `.strict()`
   - Endpoints array with correct structure
   - Metadata maps (`OPERATION_ID_BY_METHOD_AND_PATH`, etc.)
3. **Pass existing tests** - Oak's SDK test suite passes without modification (other than import paths)
4. **Maintain determinism** - Running castr twice produces identical output

### Validation Process

1. **Fixture validation** - Castr bundle passes `verify-castr-fixtures.ts` checks
2. **Integration test** - Oak replaces adapter imports with castr output, runs full test suite
3. **Type check** - `pnpm type-check` passes across all Oak workspaces
4. **Runtime validation** - Sample API responses validate against generated Zod schemas

### What "Done" Looks Like

Oak can run:

```bash
# Generate from castr
castr generate api-schema-sdk.json -o generated/

# Copy output to Oak SDK
cp generated/*.ts oak-curriculum-sdk/src/types/generated/zod/

# Full quality gate passes
pnpm format && pnpm type-check && pnpm lint && pnpm test && pnpm build
```

No errors, no manual patches, no type assertions added.

## Core Principles (Non-Negotiable)

These principles MUST be upheld by all castr outputs. See `oak-principles.md` for detailed examples and rationale.

### Cardinal Rule

If the upstream OpenAPI schema changes, then running the type generation pipeline MUST be sufficient to bring all consuming workspaces into alignment with the new schema. No manual intervention, no type assertions, no widening.

### Type Discipline

1. **Zero type loss** - Type information flows from the schema through to all consumers. Types are NEVER widened (e.g., literal `'/api/path'` must not become `string`).
2. **No type shortcuts** - Generated code must not use `as`, `any`, `!`, `Record<string, unknown>`, or any construct that disables the type system.
3. **Single source of truth** - Types are defined ONCE and derived from the schema. No duplication, no parallel definitions.
4. **Strict validation** - Object schemas MUST reject unknown keys (fail fast). No `.passthrough()` or `.loose()` equivalents.
5. **Deterministic output** - Identical input must produce byte-for-byte identical output across runs.

### What Castr Must NOT Do

- Invent optionality that does not exist in the schema
- Provide fallback behaviours that mask schema violations
- Widen types to accommodate implementation convenience
- Silently ignore schema constructs it does not understand

## Phased Integration

### Phase 1: Replace openapi-zod-client (Current Target)

The immediate goal is to replace the `openapi-zod-client` dependency in Oak's adapter package. This adapter currently:

1. Wraps `openapi-zod-client` which produces Zod v3 output
2. Transforms Zod v3 → Zod v4 via regex replacements
3. Depends on `openapi3-ts` for OpenAPI type definitions

**Phase 1 deliverable**: Castr produces Zod v4 output directly, eliminating the need for the adapter's v3→v4 transformation layer. The adapter can remain in place initially while Castr output is validated side-by-side against the existing pipeline. Adapter removal is a subsequent step once validation is complete.

### Future Phases (Not Yet Specified)

- Replace `openapi-typescript` for TypeScript type generation
- Generate MCP tool scaffolding directly
- Emit JSON Schema validators alongside Zod
- Produce endpoint metadata maps

These future phases will be specified once Phase 1 is validated.

## Phase 1: Detailed Requirements

### Current System Analysis

Oak currently uses an adapter package that wraps `openapi-zod-client`. This adapter exports two functions:

#### 1. `generateZodSchemasFromOpenAPI`

**Consumed by**: `type-gen/zodgen-core.ts`
**Produces**: `curriculumZodSchemas.ts`

This function generates the complete Zod schemas file containing:

```typescript
// 1. Component schemas (from #/components/schemas)
export const Widget = z.object({ id: z.string(), name: z.string().optional() }).strict();
export const schemas = { Widget, ... };

// 2. Endpoints array with inline schemas
export const endpoints: readonly Endpoint[] = [
  {
    method: 'get',
    path: '/widgets/:id',              // Colon format, NOT curly braces
    description: 'Operation description',
    requestFormat: 'json',
    response: Widget,                   // Reference to component schema OR inline z.object(...)
    errors: [{ status: 404, schema: ErrorSchema }],
    parameters: [
      { name: 'id', type: 'Path', schema: z.string() },
      { name: 'filter', type: 'Query', schema: z.string().optional() },
    ],
  },
];

// 3. Helper maps (currently post-processed in zodgen-core.ts)
const OPERATION_ID_BY_METHOD_AND_PATH = {
  'get /widgets/:id': 'getWidget',
} as const;

const PRIMARY_RESPONSE_STATUS_BY_OPERATION_ID = {
  getWidget: '200',
} as const;

// 4. Schema collection builder
export const curriculumSchemas = buildCurriculumSchemas(endpoints);
export type CurriculumSchemaName = keyof typeof curriculumSchemas;
```

#### 2. `getEndpointDefinitions`

**Consumed by**: `type-gen/typegen-core.ts`
**Produces**: Structured data for `request-parameter-map.ts`

Returns endpoint metadata with **Zod code as strings** (not actual Zod objects):

```typescript
interface EndpointDefinition {
  method: string;           // 'get', 'post', etc.
  path: string;             // '/widgets/:id' (colon format)
  description?: string;
  requestFormat?: string;
  response: string;         // Zod v4 code as STRING, e.g., "z.object({ id: z.string() })"
  errors?: { status: string | number; description?: string; schema: string }[];
  parameters?: { name: string; type: string; schema: string }[];
}
```

The consuming code (`emit-request-validator-map.ts`) writes these strings directly into generated files:

```typescript
export const REQUEST_PARAMETER_SCHEMAS = {
  "GET:/widgets/:id": z.object({
    "id": z.string(),
  }),
} as const;
```

### Castr Phase 1 Output Requirements

Castr must produce outputs that can replace both adapter functions. The exact file structure is not prescribed, but the following data must be available:

#### Required: Component Schemas

- All `#/components/schemas/*` as Zod v4 schemas
- Object schemas MUST use `.strict()` (reject unknown keys)
- Exported individually AND as a collected object

#### Required: Endpoints Array

Each endpoint must include:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `method` | `string` | Yes | Lowercase: `'get'`, `'post'`, etc. |
| `path` | `string` | Yes | **Colon format**: `/widgets/:id` not `/widgets/{id}` |
| `operationId` | `string` | Yes | From OpenAPI `operationId` |
| `description` | `string` | No | From OpenAPI operation description |
| `requestFormat` | `string` | No | e.g., `'json'` |
| `response` | `ZodSchema` | Yes | Primary success response schema (usually 200) |
| `errors` | `array` | No | Non-2xx responses with status and schema |
| `parameters` | `array` | No | Path, query, header parameters |

#### Required: Parameter Schema Strings

For `request-parameter-map.ts` generation, castr must also provide parameter schemas as **code strings** that can be written to files. This could be:

- A separate export with stringified schemas
- A serialization utility
- A separate emitter output

#### Required: Metadata Maps

```typescript
// Operation ID lookup by method and path
OPERATION_ID_BY_METHOD_AND_PATH: Record<`${method} ${colonPath}`, operationId>

// Primary success status by operation
PRIMARY_RESPONSE_STATUS_BY_OPERATION_ID: Record<operationId, statusCode>
```

#### Suggestion: Schema Collection Utilities

The current system builds a `curriculumSchemas` collection that maps sanitised keys to Zod schemas. This includes:

- Component schemas with sanitised names
- Response schemas keyed by `${operationId}_${status}`
- Error schemas keyed similarly

Castr could provide utilities or structured data to construct this collection, but the exact API is flexible.

### What Castr Does NOT Need To Do

- Emit `openapi-fetch` compatible types (that is a separate phase)
- Match the exact file structure of current outputs
- Preserve current naming conventions (but must be configurable)
- Support Zodios or any specific HTTP client
- Maintain backwards compatibility with current adapter API

## Contents

### OpenAPI Fixtures

- `api-schema-original.json` - Upstream OpenAPI schema as returned by the Oak API (no local decoration)
- `api-schema-sdk.json` - SDK-enhanced OpenAPI schema with `canonicalUrl` fields and legitimate 404 responses documented
- `api-schema-original-3.1.json` - OpenAPI 3.1 version of the upstream schema (no local decoration)
- `api-schema-sdk-3.1.json` - OpenAPI 3.1 version of the SDK-enhanced schema

### Contract Schemas

- `castr-bundle.schema.json` - JSON Schema contract for castr bundle manifests
- `castr-bundle.sample.json` - Example castr bundle manifest with placeholder values

### Tooling

- `verify-castr-fixtures.ts` - Verification harness for the fixtures and optional castr bundle manifests

### Principles Documentation

- `oak-principles.md` - Complete type discipline principles (self-contained, no external dependencies)
- `expected-outputs.md` - Concrete examples of expected castr output with validation checklist

## How these schemas are acquired and processed

### Original schema (upstream truth)

The original schema is fetched from the Oak National Academy Open API:

- **Source URL**: `https://open-api.thenational.academy/api/v0/swagger.json`
- **Authentication**: Requires `OAK_API_KEY` header
- **Format**: OpenAPI 3.0.x
- **Caching**: Cached locally for CI/offline use

The cached `api-schema-original.json` in this directory is the canonical snapshot.

### SDK schema (local enhancement)

The SDK schema applies Oak-specific enhancements to the original:

1. **Canonical URL injection** - Response schemas for resources with web pages receive a `canonicalUrl` property
   - Most resources: `canonicalUrl: string`
   - Thread responses: `canonicalUrl: null` (threads have no site URL)

2. **Legitimate 404 documentation** - The `/lessons/{lesson}/transcript` endpoint documents a 404 response (some lessons have no transcript)

These enhancements are applied programmatically; castr receives the already-enhanced `api-schema-sdk.json`.

### OpenAPI 3.1 fixtures (castr upgrade expectations)

`api-schema-original-3.1.json` and `api-schema-sdk-3.1.json` are the strict counterparts to the 3.0 fixtures. They reflect the required castr upgrade step:

- `openapi` is upgraded to `3.1.0` and `jsonSchemaDialect` is set to draft 2020-12.
- `nullable: true` is replaced with JSON Schema null unions (for example, `type: ["object", "null"]`).
- No other semantic changes are applied; these are behavioural expectations, not formatting or ordering constraints.
The verification harness does not attempt upgrades or normalisation; castr is responsible for producing these 3.1 outputs.

## Potential avenues for use (automated checks)

- **IR determinism**: parse `api-schema-sdk.json` and assert stable, sorted IR output across runs.
- **Emitter parity**: emit Zod v4 and TypeScript from castr and compare structural parity against the SDK artefacts.
- **Endpoint map validation**: ensure method + path -> operationId and response status mappings match SDK outputs.
- **Decoration checks**: verify `canonicalUrl` injection and the transcript 404 response are present only in the SDK schema.
- **Round-trip safety**: OpenAPI -> OpenAPI output must preserve semantics against the SDK schema (byte equivalence is not required).

## Contract files

- `castr-bundle.schema.json` defines a required manifest that points to emitter outputs for automated checks (OpenAPI output is mandatory).

## Requirements (Oak contract)

### Input Requirements

- Castr consumes the SDK-decorated schema (`api-schema-sdk.json`), not the upstream original.
- OpenAPI 3.0.x is allowed as input, but castr must upgrade to fully valid OpenAPI 3.1.x internally.

### Output Requirements

- OpenAPI output must be valid 3.1.x; normalisation is expected, byte equivalence is not.
- Output must be strict: object schemas reject unknown keys and fail fast with explicit errors.
- Output must preserve schema semantics and operation coverage (no data loss).
- Ordering must be deterministic for schema and endpoint registries.
- Bundle manifest is required for validation runs.
- Response status codes SHOULD be integers (not strings) except for `"default"`.

### Zod Output Requirements (Phase 1)

- Zod v4 syntax only (no v3 constructs)
- All object schemas MUST use `.strict()`
- No `.passthrough()` or `.loose()` - unknown keys must cause validation errors
- Enum schemas from OpenAPI enums
- Optional fields use `.optional()`
- Nullable fields use `.nullable()` (Zod v4 style)
- Array schemas preserve item type information
- Union schemas from `oneOf`/`anyOf`

### TypeScript Output Requirements (Future Phase)

- Export `paths`, `components`, and `operations` types
- Types must be compatible with typed HTTP clients (specifics TBD)
- Literal string types for paths, not `string`
- Numeric literal types for status codes, not `number`

## Invariant checks (non-exhaustive, non-formatting)

Endpoints are complete and deterministic:

- Every OpenAPI operation is present in `endpoints.json`.
- No extra operations appear in `endpoints.json`.
- Endpoints are sorted by `method + path`.

Schema registry integrity:

- All schema references in endpoints resolve to `schemas.json`.
- Object schemas are explicitly strict (`additionalProperties: false` or `unevaluatedProperties: false`).
- Schemas are sorted by name.

Response completeness:

- Every response entry includes either `schemaRef` or `jsonSchema`.

Lossless OpenAPI output:

- `emit.openapi` must preserve schema semantics and operation coverage against `api-schema-sdk.json` (byte stability is not required).

## Verification harness

The `verify-castr-fixtures.ts` script validates:

1. **Fixture presence** - OpenAPI schema files exist and are valid OpenAPI 3.x
2. **SDK decoration** - `canonicalUrl` properties present in SDK schema, absent from original
3. **404 documentation** - Transcript endpoint 404 response present in SDK schema
4. **Bundle structure** - When a castr bundle is provided, validates all required fields and file references

### Running the harness

```bash
# Verify fixtures only
tsx verify-castr-fixtures.ts

# Verify fixtures in a specific directory
tsx verify-castr-fixtures.ts --dir /path/to/fixtures

# Verify a castr bundle output
tsx verify-castr-fixtures.ts --bundle /path/to/castr-bundle.json

# Strict mode: require all bundle files to exist (not just schema shape)
tsx verify-castr-fixtures.ts --strict-sample
```

### Output

- **stderr**: Human-readable summary (eslint-style counts + failures)
- **stdout**: Full JSON report with all check results

Exit codes: `0` = all checks passed, `1` = one or more checks failed

## Suggestions for Improvement (Not Requirements)

These are opportunities identified from analysing the current system. Castr is free to adopt, adapt, or ignore these suggestions.

### Suggestion 1: Unified Schema + Validator Output

The current system generates Zod schemas that are then referenced by other generated files. A unified output could provide:

```typescript
// Single import for all schema needs
import {
  // Component schemas
  Widget,
  ErrorEnvelope,
  // Endpoint metadata
  endpoints,
  // Lookup maps
  OPERATION_ID_BY_METHOD_AND_PATH,
  PRIMARY_RESPONSE_STATUS_BY_OPERATION_ID,
  // Collection builder (or pre-built collection)
  curriculumSchemas,
} from '@castr/generated/oak-curriculum';
```

### Suggestion 2: JSON Schema Alongside Zod

The current response-map includes `jsonSchema` for each response, used by MCP tooling. Castr could emit JSON Schema validators alongside Zod:

```typescript
interface ResponseDescriptor {
  zodSchema: z.ZodType;
  jsonSchema: JsonSchema;  // Fully dereferenced, ready for MCP
}
```

### Suggestion 3: Code String Serialization

For emitting schemas into generated files, provide a utility:

```typescript
// Instead of regex-based stringification
const schemaCode = castr.toCodeString(Widget);
// Returns: "z.object({ id: z.string(), name: z.string().optional() }).strict()"
```

### Suggestion 4: Configurable Naming

The current system sanitises schema names (replacing special chars with `_`). A naming hook would help:

```typescript
castr.generate({
  schema: openApiDoc,
  naming: {
    schema: (name) => sanitizeIdentifier(name),
    operation: (operationId) => operationId,
  },
});
```

### Suggestion 5: Path Format Configuration

Support both OpenAPI `{param}` and colon `:param` formats:

```typescript
castr.generate({
  pathFormat: 'colon',  // or 'curly' for OpenAPI style
});
```

## Integration Prerequisites

Before castr can be integrated into Oak's type generation pipeline:

1. **SDK workspace separation** — Oak's type-gen code must be extracted into a dedicated generation workspace (separate from the runtime SDK). This is Step 1 of the [4-workspace decomposition](../../pipeline-enhancements/sdk-workspace-separation-plan.md) defined in [ADR-108](../../../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md). After separation, Castr becomes a dependency of the Generic Pipeline workspace (WS1).

2. **Side-by-side validation** — The existing `openapi-zod-client-adapter` can remain in place initially while Castr output is validated against the fixtures in this directory. This allows comparison of the two pipelines before committing to the switch.

3. **Adapter removal** (subsequent step) — Once Castr outputs are validated and the quality gate chain passes with Castr output, Oak's current `openapi-zod-client-adapter` and its `openapi-zod-client` + `openapi3-ts` dependencies will be removed.

## Local castr checkout

Target path for local development: `~/code/personal/castr` (repo: `git@github.com:EngraphCode/castr.git`).

## Refresh guidance

These are static snapshots. Refresh only when the upstream schema changes and the contract must move in lockstep; update the 3.0 and 3.1 fixtures together.

## Related Documentation

### Castr Contract Documents (this directory)

- `expected-outputs.md` - Concrete examples of expected castr output with validation checklist
- `oak-principles.md` - Type discipline principles castr must uphold (self-contained reference)
- `castr-bundle.schema.json` - JSON Schema for bundle manifests
- `verify-castr-fixtures.ts` - Verification harness
