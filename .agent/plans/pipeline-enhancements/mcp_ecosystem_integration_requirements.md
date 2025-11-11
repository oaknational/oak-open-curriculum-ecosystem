# Schema-First Type & Validator Generator – Client Requirements

This document captures Oak National Academy’s expectations for the shared generator that will ultimately replace both `openapi-typescript` and `openapi-zod-client` within our toolchain. It is written so the upstream `@oaknational/openapi-to-tooling` project can adopt or challenge these requirements whilst remaining vendor-agnostic.

---

## 1. Overview

- **Purpose**: Produce every artefact required by our SDKs and MCP tooling _in one deterministic pass_ from an OpenAPI 3.0/3.1 schema, emitting a strongly typed manifest consumable by both CLI and programmatic users.
- **Scope**: The generator itself must stay neutral. Oak-specific customisations (canonical URLs, legitimate 404s, search fixtures, naming quirks) are supplied through hooks or downstream consumers.
- **Key Inputs**: `OpenAPIObject` from `openapi3-ts`, optional schema transforms, writer selection, hook configuration.
- **Key Outputs**: Types for `openapi-fetch`, derived constants and metadata, decorated schema JSON/TS modules, Zod validators with JSON Schema siblings, OpenAPI client helpers, MCP tool descriptors plus supporting data, and a manifest describing every emitted file.

---

## 2. Core Principles

1. **Single Source of Truth** – All type information, constants, and runtime validation artefacts must originate from the supplied OpenAPI schema.
2. **Single Pass** – Parse the schema once; share an internal IR across every writer (types, metadata, Zod, MCP, client).
3. **Deterministic Output** – Given identical inputs (schema + configuration) the manifest must be byte-for-byte identical and report any warnings deterministically.
4. **Behavioural Guarantees Over Snapshots** – Consumers assert behaviour (type-safety, validation, tool execution) rather than relying on golden files. The generator must therefore expose stable, strongly typed interfaces.
5. **Fail Fast** – Invalid schema constructs, unsupported features, or hook failures must halt generation with actionable diagnostics pointing to the offending schema location.
6. **Documentation Ready** – Artefacts should include TSDoc derived from OpenAPI descriptions wherever practical so downstream documentation tooling has rich context.

---

## 3. Inputs & Configuration

### 3.1 Schema Sources

- Accept schema via:
  - Local file path (JSON/YAML).
  - HTTPS URL (with optional request headers supplied by the caller).
  - Direct `OpenAPIObject`.

### 3.2 Schema Transforms

- Provide a composable transform pipeline:

  ```ts
  type SchemaTransform = (schema: OpenAPIObject) => OpenAPIObject;

  generate({
    schema,
    transforms: [decorateCanonicalUrls, injectLegitimate404Responses],
  });
  ```

- Transforms run before IR construction; each transform receives a deep copy and must return a valid OpenAPI document.

### 3.3 Schema Metadata

- Expose metadata for provenance:

  ```ts
  interface SchemaInfo {
    readonly title: string;
    readonly version: string;
    readonly digest: string; // stable hash of the raw schema
    readonly generatedAt: string; // ISO timestamp
  }
  ```

### 3.4 Writer Selection

- Allow callers to opt into any combination of writers (`types`, `metadata`, `schema-json`, `zod`, `client`, `mcp`). Default is “all”.
- Writers execute against the shared IR and may contribute multiple files to the manifest.

### 3.5 Configuration Model

- Provide a declarative configuration module (e.g. `openapi-tooling.config.ts`) that exports:
  ```ts
  export default defineGeneratorConfig({
    schemaSource: 'schema-cache/api-schema-original.json',
    writers: ['types', 'metadata', 'schema-json', 'zod', 'client', 'mcp'],
    hooks: {
      renameEnum,
      renameTool,
      sampleOverride,
    },
    output: {
      rootDir: 'src/types/generated/api-schema',
    },
  });
  ```
- The configuration helper must validate the shape at compile time, provide defaults, and map 1:1 to the programmatic API.
- CLI usage should accept a `--config` flag to load the same module, keeping automation and interactive runs aligned.

---

## 4. Public API & CLI Contracts

### 4.1 Programmatic API

```ts
interface GenerateOptions {
  readonly schema: OpenAPIObject | string | URL;
  readonly transforms?: readonly SchemaTransform[];
  readonly writers?: readonly WriterKind[];
  readonly hooks?: GeneratorHooks;
  readonly outputDir?: string; // optional when caller handles writing
  readonly prettyPrint?: boolean; // toggle for JSON spacing
}

interface GeneratedFile {
  readonly path: string; // relative path
  readonly contents: string; // UTF-8 string
  readonly kind: 'typescript' | 'json' | 'metadata';
}

interface GenerationResult {
  readonly files: readonly GeneratedFile[];
  readonly schemaInfo: SchemaInfo;
  readonly warnings: readonly string[];
}

declare function generate(options: GenerateOptions): Promise<GenerationResult>;
```

- If `outputDir` is supplied the library may provide `writeManifest(result, outputDir)` helper but programmatic consumers must be able to handle file persistence themselves.

### 4.2 CLI

- Mirror the programmatic options via flags (e.g. `--writer`, `--transform`, `--output`, `--hooks-config path/to/config.ts`).
- Support a `--check` mode that parses the schema and runs all validations without writing files.
- Exit codes:
  - `0`: success (warnings may still be printed).
  - `1`: validation/generation failure (diagnostics to stderr).

---

## 5. Writer Responsibilities

### 5.1 Type Suite (`types` writer)

Emit `paths`, `operations`, `components`, and `webhooks` interfaces compatible with `openapi-fetch@^0.15`:

- Path keys must be literal strings matching the schema.
- HTTP method members limited to documented operations; missing methods resolve to `never`.
- `parameters` split into `path`, `query`, `header`, `cookie` objects with optionality reflecting `required`.
- Responses expose numeric status literals (e.g. `200`, `404`), mapping content types to component schemas.
- Normalisation hooks to treat unspecified headers as `headers?: never`, coerce empty parameter objects, and stabilise whitespace.
- Include TSDoc summaries derived from operation/parameter descriptions.

### 5.2 Metadata & Constants (`metadata` writer)

Produce reusable runtime artefacts:

1. **Path Catalogue**
   - `PATHS`, `ValidPath`, `isValidPath`, `AllowedMethods`, `AllowedMethodsForPath`.
   - Runtime helpers for canonical path lookups and conversions (e.g. `toColon`, `toCurly` if exposed).
2. **Operation Metadata**
   - `PATH_OPERATIONS` array capturing `{ path, method, operationId?, parameters, responses }`.
   - `OPERATIONS_BY_ID` map with helpers such as `getOperationIdByPathAndMethod`.
   - Enumerate valid response codes and expose type guards (`isValidResponseCode`, `isErrorResponseCode`).
3. **Enumerated Constants**
   - Detect every `enum`/`const` in components and inline schemas.
   - Emit `const` tuples plus branded type guards (e.g. `KEY_STAGES`, `isKeyStage`).
   - Provide rename/filter hooks to adapt export names.
4. **Request Parameter Map**
   - `REQUEST_PARAMETER_SCHEMAS` keyed by `METHOD:/path` with Zod schemas covering path/query/header/cookie payloads.
   - Ensure `$ref`s are resolved; optional parameters receive `.optional()`.
5. **Response Descriptor Input**
   - Metadata describing success and error responses: `operationId`, `status`, `jsonSchema`, `zodIdentifier`, provenance for wildcard/error fallbacks.

### 5.3 Schema JSON (`schema-json` writer)

- Emit raw (`schema-original.json`) and transformed (`schema-processed.json`) documents with ordered keys.
- Provide a TypeScript module exporting `schema`/`Schema` constants mirroring the processed document.
- Include provenance headers referencing `SchemaInfo`.

### 5.4 Zod Catalogue (`zod` writer)

- Generate a `makeApi` endpoints array equivalent to today’s `curriculumZodSchemas.ts`, covering every operation and documented error response.
- Export helper maps:
  - `OPERATION_ID_BY_METHOD_AND_PATH`.
  - `PRIMARY_RESPONSE_STATUS_BY_OPERATION_ID`.
- Provide a `buildSchemaCollection` (or equivalent) returning a map of `operationId_status` → `ZodSchema`, with sanitised keys and hookable rename logic.
- Produce JSON Schema siblings for each request/response validator (to align with runtime JSON Schema requirements).
- Expose runtime guards (e.g. `isCurriculumSchemaName`) as part of the generated module where appropriate.

### 5.5 Client Helpers (`client` writer)

- Emit runtime modules:

  ```ts
  export type ApiClient = OpenApiClient<paths>;
  export type ApiPathClient = OpenApiPathBasedClient<paths>;
  export function createApiClient(options: ClientOptions): ApiClient;
  export function createPathClient(options: ClientOptions): ApiPathClient;
  ```

- Support injection of base URL, fetch implementation, and middleware registration.
- Keep runtime code minimal; rely on generated metadata for validation.

### 5.6 MCP Artefacts (`mcp` writer)

- Provide data for downstream MCP tool generation:
  - Tool descriptors keyed by deterministic names.
  - Zod schemas for tool args/results referencing the shared catalogue.
  - Operation iterator exposing `path`, `method`, `operationId`, parameter summaries, and response summaries (with JSON Schema payloads).
  - Sample payload utilities capable of producing realistic example data, handling cycles gracefully.
  - Tool naming helper with rename hook (default behaviour mirrors current `generateMcpToolName`).
- Return structured folders in the manifest (`contract`, `runtime`, `aliases`, `stubs`, `data`) or clearly documented manifest paths so consumers can recreate today’s structure if desired.

---

## 6. Hook & Extension Surface

Provide a `GeneratorHooks` interface with at minimum:

- `renameEnum(enumId, values)`: adjust exported constant/type names.
- `renameTool(path, method, operationId)`: customise tool names.
- `schemaCollectionRename(originalKey)`: override schema collection identifiers.
- `sampleOverride({ schema, operationId, status })`: supply bespoke sample data.
- `onWarning(message, context)`: intercept non-fatal issues.

Hooks must be optional, pure, and receive exhaustive context so they can operate deterministically.

---

## 7. Validation & Quality Strategy

### 7.1 Structural Guarantees (library responsibility)

- Cross-check that every documented response with JSON content yields a corresponding entry in the response metadata.
- Ensure request parameter maps cover each operation’s declared parameters.
- Detect naming clashes or hook collisions and surface them as actionable errors.
- Deduplicate schemas deterministically (e.g. inline response schema numbering).

### 7.2 Behavioural Expectations (consumer responsibility, enabled by generator)

- Compile integration fixtures with `openapi-fetch` using the generated type suite.
- Validate requests/responses at runtime using generated Zod/JSON Schema artefacts.
- Exercise MCP tool execution paths to prove parameter validation, client invocation, and result typing.
- Proofs must not rely on byte-for-byte diffs; they target behaviour.

### 7.3 Determinism Testing

- Library CI: run the generator twice on the same fixture schema and assert identical manifests.
- Provide a utility to compare manifests ignoring file ordering permutations (should normally match order exactly).

### 7.4 Diagnostics

- Errors should include: schema pointer (JSON Pointer), brief description, suggested mitigation.
- Warnings should explain downstream impact and respect the `onWarning` hook for centralised handling.

### 7.5 Cross-Schema Validation

- Maintain reference fixtures for at least one non-Oak schema (e.g. minimal CRUD spec) and verify the generator can emit artefacts and pass structural assertions without Oak-specific hooks.
- Document expected hook coverage for vendor-neutral consumers and record outcomes of cross-spec runs in CI.

### 7.6 Quality Metrics

- Capture generation latency, coverage percentages, and CI gate durations in a published dashboard.
- Run `pnpm docs:verify` and Lighthouse audits on generated documentation/examples, targeting ≥ 95 % accessibility.
- Record onboarding dry-run durations to ensure new adopters can integrate the generator in fewer than four hours.

---

## 8. Acceptance Criteria

1. `generate({ schema, writers: 'all' })` produces types, metadata, schema JSON/TS, Zod catalogue, client helpers, and MCP artefacts in one execution.
2. All artefacts compile and type-check inside the Oak Curriculum SDK without manual patches.
3. Existing behavioural tests (request validation, response validation, MCP execution) pass using the new generator outputs with no golden-file adjustments beyond configuration hooks.
4. Generator validated against at least one non-Oak schema, exercising structural assertions and documenting hook requirements (if any).
5. Deterministic manifest verified in CI for fixture schemas.
6. CLI mirrors the programmatic API and supports `--check` mode.
7. Hooks cover Oak’s current customisations (canonical URLs, legitimate 404s, naming overrides, sample injection).
8. TSDoc is emitted for generated modules, enabling Typedoc/markdown generation without edits.

---

## 9. Non-Goals

- Embedding Oak-specific schema decorations in the core library (these stay in transforms).
- Maintaining compatibility layers for legacy generators.
- Generating CommonJS or hybrid module formats (ESM-only is acceptable).
- Producing HTML/Markdown documentation directly (Typedoc-ready comments are sufficient).

---

## 10. Outstanding Questions

1. Should the manifest support incremental regeneration (e.g. only write changed files) or always emit full content?
2. How should hooks be defined/discovered in CLI mode—TS config files, JSON descriptors, or dynamic imports?
3. Do we require first-class support for additional schema dialects (e.g. JSON:API overlays), or is OpenAPI 3.x the only target?

---

## 11. Example (Illustrative)

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
              "application/json": { "schema": { "$ref": "#/components/schemas/Widget" } }
            }
          },
          "404": {
            "description": "Not Found",
            "content": {
              "application/json": { "schema": { "$ref": "#/components/schemas/ErrorEnvelope" } }
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
      },
      "ErrorEnvelope": {
        "type": "object",
        "required": ["message", "code"],
        "properties": {
          "message": { "type": "string" },
          "code": { "type": "string", "enum": ["NOT_FOUND", "UNAUTHORISED"] }
        }
      }
    }
  }
}
```

Expected artefact fragments:

```ts
// types/paths.ts
export interface paths {
  '/widgets/{id}': {
    parameters: {
      path: { id: string };
      query?: never;
      header?: never;
      cookie?: never;
    };
    get: operations['getWidget'];
  };
}
```

```ts
// metadata/path-parameters.ts
export const PATHS = {
  '/widgets/{id}': '/widgets/{id}',
} as const;
export type ValidPath = keyof typeof PATHS;
export const allowedMethods = ['get'] as const;
export function getOperationIdByPathAndMethod(
  path: ValidPath,
  method: 'get',
): 'getWidget' | undefined {
  return method === 'get' && path === '/widgets/{id}' ? 'getWidget' : undefined;
}
```

```ts
// zod/widgets.ts
export const endpoints = makeApi([
  {
    method: 'get',
    path: '/widgets/:id',
    response: WidgetSchema,
    errors: [{ status: 404, schema: ErrorEnvelopeSchema }],
    parameters: [{ name: 'id', in: 'path', schema: z.string(), required: true }],
  },
]);
export const PRIMARY_RESPONSE_STATUS_BY_OPERATION_ID = { getWidget: '200' } as const;
```

```ts
// mcp/data/tools/get-widget.ts (conceptual)
export const getWidgetToolDescriptor = {
  name: 'get-widget',
  summary: 'Fetch details for a widget by id.',
  toolZodSchema: z.object({ id: z.string() }),
  invoke: async (client, { id }) => client.GET('/widgets/{id}', { params: { path: { id } } }),
  validateOutput: (result) => makeResponseValidator('getWidget', result),
};
```

These fragments demonstrate the breadth of artefacts expected from a single generator invocation while leaving room for implementation detail to evolve.

---

## 12. Revision History

- **08/11/2025** – Complete rewrite to align with the `@oaknational/openapi-to-tooling` integration plan, emphasising manifest-driven output, behavioural validation, and hook-based customisation.
