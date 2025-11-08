# Schema-First Type & Validator Generator – Client Requirements

## 1. Context

- This document captures additional client-side requirements for a reworked, general-purpose successor to `openapi-zod-client` with the working title `@oaknational/openapi-to-tooling`.
- The library MUST remain vendor-agnostic. Any Oak-specific behaviour will be layered on top in the consuming repository.
- The upstream `@oaknational/openapi-to-tooling` project already maintains its own requirements; this specification supplements them so that the generator can fully replace both `openapi-typescript` and the existing Zod generation steps in a single pass.
- The generator MUST ingest an OpenAPI 3.0 and 3.1 schema once and emit, in one run, every artefact required by our SDK: TypeScript types for `openapi-fetch`, compile-time constants, derived type guards, request/response metadata, Zod validators, and the inputs we use to build MCP tool definitions.
- The generator MUST rely on `openapi3-ts@latest` as the canonical TypeScript type library for representing OpenAPI structures internally and in exported typings.

## 2. Terminology

- **Raw schema** – the OpenAPI JSON supplied to the generator.
- **Decorated schema** – an optional schema variant created by client-provided hooks (e.g. adding canonical URL fields or 404 responses). The generator MUST accept hooks but MUST NOT bake in Oak-specific logic.
- **Artefacts** – the files and module strings emitted by the generator (types, constants, Zod schemas, clients, metadata JSON, etc.).

## 3. High-Level Pipeline Requirements

1. **Single Pass** – Parsing the schema MUST occur once per invocation. Types, constants, Zod definitions, metadata, and client code MUST be produced without re-reading the schema or issuing a second command.
2. **Deterministic Output** – Given identical input schema + configuration, the generator MUST emit byte-for-byte identical artefacts.
3. **Offline Friendly** – The generator MUST accept an in-memory schema object so that our pipeline can operate offline/CI with cached schemas.
4. **Modular Writers** – The generator MUST allow callers to opt into subsets of artefacts (e.g. `types`, `zod`, `metadata`, `client`) while still sharing the parsed schema core.
5. **Programmatic & CLI Access** – Provide an API: `generate({ schema, outputDir, decorators?, writers?, hooks? })` returning a manifest of files. The CLI MUST mirror the API options.
6. **Fail Fast with Actionable Errors** – Validation failures, unsupported constructs, or writer errors MUST abort generation immediately with clear messages that identify the offending schema location.

## 4. Schema Ingestion & Normalisation Contracts

- Accept schema sources via:
  - File path (local JSON/YAML).
  - URL (HTTP GET with optional headers supplied by the caller).
  - Direct object (`OpenAPIObject`).
- Offer hooks:

  ```ts
  type SchemaTransform = (schema: OpenAPIObject) => OpenAPIObject;
  generate({ schema, transforms: [decorateCanonicalUrls, ensureResponses] });
  ```

- Provide metadata exposed to writers:

  ```ts
  interface SchemaInfo {
    readonly title: string;
    readonly version: string;
    readonly digest: string; // stable hash of the source
    readonly generatedAt: string; // ISO timestamp
  }
  ```

- Guarantee whitespace and key ordering stability when serialising schemas back to JSON/TS.

## 5. Type Emission Contracts

### 5.1 `paths` Interface (OpenAPI-Fetch Contract)

- The generator MUST emit a module exporting:

  ```ts
  export interface paths {
    "/example/{id}": {
      parameters: {
        path: { id: string };
        query?: { filter?: string };
        header?: never;
        cookie?: never;
      };
      get: operations["getExample".
    };
  }
  export interface operations { /* ... */ }
  export interface components { /* ... */ }
  export interface webhooks { /* ... */ }
  ```

- Requirements:
  1. Route keys MUST be literal strings exactly as present in the schema.
  2. HTTP method members MUST only include methods defined in the schema; missing methods MUST resolve to `never`.
  3. `parameters` MUST honour shared + operation-specific parameters, decomposed into `path`, `query`, `header`, `cookie` objects.
  4. `responses` MUST expose referenced schemas under `components["schemas"]` lookups, preserving numeric status codes (e.g. `200`, `404`) as number literal keys.
  5. Header maps WITHOUT concrete definitions MUST be emitted as `headers?: never;` (configurable hook) to satisfy `openapi-fetch` type expectations.
  6. The exported interfaces MUST be tree-shakeable and purely type-level (no runtime code).

### 5.2 Built-in Output Normalisation

- The generator MUST provide configuration that covers the adjustments we currently make downstream (e.g. treating unspecified headers as `headers?: never`, flattening empty parameter objects, coercing numeric HTTP status keys to numeric literals).
- Default output MUST already be compatible with `openapi-fetch` so no consumer-side regex or AST manipulation is required.
- Optional transformation hooks MAY be supplied for advanced use-cases, but consumers MUST NOT be forced to post-process to achieve baseline compatibility.

### 5.3 Typedoc Generation

- All emitted TypeScript modules MUST include TSDoc derived from the upstream OpenAPI spec (operation summaries, descriptions, parameter docs, schema descriptions, etc.).
- Documentation MUST be stable between runs and deduplicated where possible to avoid diff churn.

## 6. Derived Constants & Type Guards

The generator MUST produce—or provide structured data for us to emit—the following artefacts. They MUST be derived entirely from the same schema run to preserve correctness.

### 6.1 Path Catalogue Module

Expected exports (names are configurable but defaults SHOULD match below for minimal integration work):

```ts
export type ValidPath = keyof paths;
export const PATHS = {
  '/example': '/example',
  '/example/{id}': '/example/{id}',
} as const;

export type RawPaths = schemaBase['paths'];
export const apiPaths: RawPaths = schemaBase.paths;

export type AllowedMethods = keyof RawPaths[keyof RawPaths];
export const allowedMethods: AllowedMethods[]; // derived list
export function isAllowedMethod(value: string): value is AllowedMethods {
  const stringAllowedMethods: readonly string[] = allowedMethods;
  return stringAllowedMethods.includes(value);
}
```

- `schemaBase` refers to the decorated runtime schema (see §7).
- `allowedMethods` MUST include only HTTP verbs present on at least one path.
- Type helpers MUST compile when consumed with the generated `paths` interface.

### 6.2 Operation Metadata

- Provide structured metadata enabling the generator to emit:

  ```ts
  export const PATH_OPERATIONS = [...];
  export const OPERATIONS_BY_ID = { /* operationId -> PathOperation */ } as const;
  export function getOperationIdByPathAndMethod(path: string, method: string): OperationId | undefined;
  ```

- Each entry MUST include `path`, `method`, `operationId?`, `parameters`, and `responses` (or references).
- The metadata MUST also expose the set of numeric and string HTTP status codes discovered so we can build `RESPONSE_CODES`.

### 6.3 Enumerated Constants & Guards

- Automatically detect enums across the schema (component enums, inline enums, parameter enums, `const` values) and emit:

  ```ts
  export const KEY_STAGES = ['ks1', 'ks2'] as const;
  export type KeyStage = (typeof KEY_STAGES)[number];
  export function isKeyStage(value: string): value is KeyStage;
  ```

- Provide configuration to rename, filter, or exclude enum exports, but the default behaviour MUST surface all schema-defined enumerations.

### 6.4 Request Parameter Schema Map

- Provide Zod-ready metadata reused in §8 or emit the module directly:

  ```ts
  import { z } from "zod";
  import type { AllowedMethods, ValidPath } from "./path-parameters";

  export const REQUEST_PARAMETER_SCHEMAS = {
    "GET:/example/{id}": z.object({ id: z.string() }),
  } as const;

  export function getRequestParameterSchema(method: AllowedMethods, path: ValidPath) { ... }
  ```

- Each schema MUST expand `$ref`ed parameter schemas, include `.optional()` when `required !== true`, and support primitive arrays via `z.array`.

### 6.5 Response Validator Map Input

- Emit metadata describing success + error schemas for each operation, suitable for runtime validators.
- Minimum fields per entry: `operationId`, `path`, `method`, `successStatusCodes`, `errorStatusCodes`, `zodRef`, and `jsonSchema` (fully dereferenced JSON Schema object or pointer).

## 7. Runtime Schema Modules

- Emit the decorated schema as both JSON and TS modules:

  ```ts
  export const schema = { ... } as const;
  export type Schema = typeof schema;
  ```

- Provide `schema-original.json` (raw) and `schema-processed.json` (decorated) for traceability.
- Include provenance comment header citing `SchemaInfo`.

## 8. Zod Artefacts (Single-Pass Output)

- The generator MUST emit, in the same run:
  1. A `zod` module exporting `makeApi` endpoints identical in functionality to today’s `curriculumZodSchemas.ts`.
  2. Helper maps:

     ```ts
     export const OPERATION_ID_BY_METHOD_AND_PATH = { 'get /example': 'getExample' } as const;
     export const PRIMARY_RESPONSE_STATUS_BY_OPERATION_ID = { getExample: '200' } as const;
     ```

  3. Functions:

     ```ts
     export const endpoints = makeApi(...);
     export type ApiEndpoints = typeof endpoints;
     export function buildSchemaCollection(endpoints: ApiEndpoints): Record<string, ZodSchema>;
     ```

- Rename hooks MUST exist so callers can map inline schema identifiers to consumer-specific names.
- The Zod catalogue MUST include both success (`response`) and error (`errors`) schemas for every documented status.
- For every operation the generator MUST emit Zod validators for all request channels (path, query, header, cookie, request body) and each documented response status. Where vendor extensions provide explicit schemas, those MUST take precedence; otherwise they MUST be derived from the OpenAPI definitions.
- Matching JSON Schema definitions MUST be exposed for each generated validator so downstream tooling (including MCP) can rely on either representation.
- The generator MUST support injecting additional schemas derived from endpoints (e.g. synthesising changelog aliases).

## 9. Client Generation

- Emit `createClient` + `createPathClient` wrappers around `openapi-fetch`, parametrised with the generated `paths` interface.
- The runtime module MUST export:

  ```ts
  export type ApiClient = OpenApiClient<paths>;
  export type ApiPathClient = OpenApiPathBasedClient<paths>;
  export function createApiClient(opts: ClientOptions): ApiClient;
  ```

- Allow middleware registration, base URL override, and custom fetch implementation via options.

## 10. Output Manifest & File Writing

- The generator API MUST return a manifest:

  ```ts
  interface GeneratedFile {
    readonly path: string; // relative path we should write
    readonly contents: string; // UTF-8 string
    readonly kind: 'typescript' | 'json' | 'declaration' | 'metadata';
  }
  interface GenerationResult {
    readonly files: GeneratedFile[];
    readonly schemaInfo: SchemaInfo;
    readonly warnings: string[];
  }
  ```

- CLI invocation MUST write files to disk respecting this manifest and fail atomically on error (no partial writes without notice).

## 11. MCP Tooling Support

To continue generating MCP tool definitions that match current behaviour, the generator MUST expose structured data enabling downstream MCP writers to remain schema-derived.

### 11.1 Operation Iterator Contract

- Provide a consumable iterator or array:

  ```ts
  interface OperationSummary {
    readonly path: string;
    readonly method: "get" | "post" | ...;
    readonly operationId: string;
    readonly summary?: string;
    readonly description?: string;
    readonly parameters: readonly ParameterSummary[];
    readonly responseSchemas: readonly ResponseSummary[];
  }
  ```

- `ParameterSummary` MUST include:
  - `in`: parameter location.
  - `name`.
  - `schema`: dereferenced JSON Schema object.
  - `required`, `description`, `enumValues`, `defaultValue` (if primitive).
- `ResponseSummary` MUST include:
  - `status`: numeric or string status key.
  - `contentType`: e.g. `application/json`.
  - `schema`: dereferenced schema or `$ref` pointer.
  - `jsonSchema`: JSON Schema (draft configurable) suitable for runtime validation.

### 11.2 Sample Payload Utilities

- Expose a helper that, given a schema object, returns a representative sample (compatible with our current `sampleSchemaObject`). This MUST handle cycles defensively and fail gracefully with descriptive errors.

### 11.3 Tool Naming Guidance

- Provide a deterministic helper for converting `path + method` into a tool name (configurable via callback) so consumers can mirror the existing `generateMcpToolName` behaviour.

### 11.4 Generated Artefact Expectations

Downstream MCP tooling will continue to generate:

- Type-only definitions (parameter and response types) per tool.
- Runtime handler scaffolding (execute/lib/index modules).
- Tool descriptor contracts.

To support this, the generator MUST ensure:

1. Operation summaries expose enough metadata to construct parameter Zod schemas aligned with request parameter maps and to derive JSON Schema validators.
2. Response summaries include success schema references and JSON Schema objects so stub payloads can be sampled consistently and validated offline.
3. The MCP artefact writer can emit JSON Schema validators for tool inputs and outputs and cross-reference the SDK Zod validators where appropriate.
4. Hooks exist to request alias maps (e.g. canonical tool names vs operation IDs).

Acceptance test for this requirement: Using only the generator output and a minimal consumer harness, we MUST be able to recreate the current MCP tool bundle byte-for-byte (modulo naming customisation) without referencing Oak-specific logic inside the generator.

## 12. Example (Self-Contained)

_Input schema excerpt_

```json
{
  "openapi": "3.1.0",
  "info": { "title": "Example API", "version": "1.0.0" },
  "paths": {
    "/widgets/{id}": {
      "get": {
        "operationId": "getWidget",
        "parameters": [
          { "name": "id", "in": "path", "required": true, "schema": { "type": "string" } }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/Widget" }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "Widget": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "name": { "type": "string" }
        },
        "required": ["id"]
      }
    }
  }
}
```

_Expected artefact fragments_

```ts
// paths.ts
export interface paths {
  '/widgets/{id}': {
    parameters: { path: { id: string }; query?: never; header?: never; cookie?: never };
    get: operations['getWidget'];
  };
}

export interface operations {
  getWidget: {
    parameters: {
      /* ... */
    };
    responses: {
      200: {
        content: { 'application/json': components['schemas']['Widget'] };
      };
    };
  };
}
```

```ts
// path-parameters.ts
export const PATHS = {
  "/widgets/{id}": "/widgets/{id}"
} as const;
export type ValidPath = keyof paths;
export const allowedMethods = ["get"] as const;
export type JsonBody200<P extends ValidPath, M extends AllowedMethodsForPath<P>> = /* ... */;
```

```ts
// zod.ts
export const OPERATION_ID_BY_METHOD_AND_PATH = {
  'get /widgets/:id': 'getWidget',
} as const;
export const endpoints = makeApi([
  {
    method: 'get',
    path: '/widgets/:id',
    response: z.object({ id: z.string(), name: z.string().optional() }),
    parameters: [{ name: 'id', schema: z.string(), in: 'path', required: true }],
  },
]);
```

## 13. Acceptance Criteria

1. Running `generate({...})` with our production schema produces all existing artefacts (types, constants, Zod, client, metadata) in one execution with no manual patches.
2. The emitted `paths` interface compiles with `openapi-fetch@^0.15` and enforces request/response typing identical to the current SDK.
3. Zod endpoints map exactly to the generated operations, including error responses, and expose helper maps for operation ID and status lookups.
4. Zod validators exist for every request channel and response status; JSON Schema validators (where required) align with the same definitions.
5. Request parameter schema maps, enumerated constants, and Typedoc content match schema-derived expectations without manual intervention.
6. MCP tool generation reimplemented purely against the new generator output matches current behaviour (verified via integration tests), including JSON Schema + Zod validators for tool IO.
7. Deterministic output confirmed by running the generator twice and diffing results (no differences).
8. CLI exit codes and error messages remain actionable (non-zero on validation failure, descriptive message emitted, pointing to schema locations where possible).

## 14. Validation Strategy

- Unit tests within the new library SHOULD validate:
  - Schema ingestion hooks.
  - Type output vs known snapshots.
  - Zod generation for nested refs, unions, nullable fields.
  - JSON Schema generation for request and response validators.
- Integration tests SHOULD:
  - Generate all artefacts for a fixture schema (mirroring the Example above) and assert against stored snapshots.
  - Run `openapi-fetch` type checks using the emitted `paths` interface in a dummy project.
  - Execute downstream MCP tool generation to confirm contracts.
  - Validate representative requests/responses against both generated Zod and JSON Schema validators to ensure parity.
- Provide a CLI smoke test (`generate --check`) that parses a schema and validates the manifest without writing files.

## 15. Non-Goals

- The generator will NOT ship Oak-specific decorators or naming conventions; those remain in this repository via configuration hooks.
- Backward compatibility with `openapi-zod-client` CLI flags is optional; alignment is encouraged but not required if it conflicts with these requirements.
- CommonJS output is explicitly out of scope; the published package MUST be ESM-only with standard build artefacts suitable for npm consumption.
- HTML/Markdown documentation emission is not required; documentation obligations are satisfied via generated TSDoc comments.

## 16. Outstanding Questions

1. Should JSON Schema output target a specific draft (e.g. 2020-12) or be configurable per consumer?
2. What is the expected shape of diagnostic metadata when generation aborts (structured object vs formatted string)?
3. How should extremely long descriptions be handled in generated TSDoc (truncate, wrap, or leave verbatim)?

---

This document may be shared with the upstream generator project to guide implementation. All examples are self-contained and reference no Oak-specific code.
