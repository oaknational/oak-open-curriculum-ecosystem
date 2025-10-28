# OpenAPI to Zod Schema Generation Library - Requirements Specification

**Version:** 1.0  
**Date:** October 23, 2025  
**Purpose:** Define requirements for a library that generates Zod schemas and type-safe tooling from OpenAPI 3.x specifications

---

## 1. Executive Summary

We require a library that transforms OpenAPI 3.x specifications into:

1. Zod runtime validation schemas
2. TypeScript type definitions
3. Structured endpoint metadata with runtime schema objects
4. MCP tool input/output validation schemas

This library must support our schema-first, build-time type generation architecture where ALL types flow from the OpenAPI specification at compile time.

---

## 2. Core Functional Requirements

### FR-1: OpenAPI Parsing

- **MUST** accept OpenAPI 3.0.x and 3.1.x specifications as input
- **MUST** support both JSON and programmatic `OpenAPIObject` input
- **MUST** handle `$ref` resolution for both internal references and components
- **MUST** support path parameters, query parameters, headers, and request bodies
- **MUST** support multiple response schemas per endpoint (200, 400, etc.)
- **SHOULD** validate OpenAPI document structure before processing

### FR-2: Zod Schema Generation

- **MUST** convert JSON Schema definitions to Zod schema code
- **MUST** generate individual named schemas for all response types
- **MUST** generate parameter schemas for path, query, header, and body parameters
- **MUST** preserve schema descriptions, examples, and validation rules
- **MUST** support all JSON Schema primitive types (string, number, boolean, null, array, object)
- **MUST** support JSON Schema validation keywords (enum, pattern, min/max, required, etc.)
- **MUST** support complex types (oneOf, anyOf, allOf, discriminated unions)
- **MUST** generate strict object schemas by default (`.strict()` or `additionalProperties: false`)
- **SHOULD** support custom schema transformations (e.g., date strings to Date objects)

### FR-3: Endpoint Metadata Extraction

- **MUST** provide a function that returns structured endpoint data
- **MUST** include for each endpoint:
  - HTTP method (GET, POST, etc.)
  - Path pattern (e.g., `/users/{id}`)
  - Operation ID (if defined)
  - Description
  - Parameter definitions with **runtime Zod schema objects** (not just code)
  - Response schema as **runtime Zod schema object**
- **MUST** return runtime Zod schemas that can be used for validation
- **MUST** support querying endpoint data programmatically during build

### FR-4: Code Generation

- **MUST** generate valid TypeScript code
- **MUST** generate ES module syntax (import/export)
- **MUST** include generated file warnings/banners
- **MUST** generate code that passes TypeScript strict mode
- **MUST** produce deterministic output (same input = same output)
- **SHOULD** generate formatted, readable code
- **SHOULD** avoid type assertions (`as`, `!`, etc.)

### FR-5: MCP Tool Schema Generation

- **MUST** generate input validation schemas compatible with MCP JSON Schema format
- **MUST** generate Zod schemas for MCP tool input arguments
- **MUST** generate Zod schemas for MCP tool output payloads
- **MUST** support nested parameter structures (path, query, body)
- **MUST** generate both JSON Schema (for protocol) and Zod (for runtime) variants
- **MUST** include validation error messages and descriptions

---

## 3. API Surface Requirements

### 3.1 Primary Generation Function

```typescript
export async function generateZodClientFromOpenAPI(config: {
  /**
   * OpenAPI document to process
   */
  openApiDoc: OpenAPIObject;

  /**
   * Output file path (for file writing if applicable)
   */
  distPath?: string;

  /**
   * Generation options
   */
  options: {
    /**
     * Export all named schemas in addition to inline schemas
     */
    shouldExportAllSchemas: boolean;

    /**
     * Export TypeScript type definitions alongside Zod schemas
     */
    shouldExportAllTypes: boolean;

    /**
     * How to group/organize generated code
     * 'none' | 'tag' | 'method' | custom
     */
    groupStrategy?: string;

    /**
     * Generate type aliases for inferred types
     */
    withAlias?: boolean;

    /**
     * Additional custom options
     */
    [key: string]: unknown;
  };
}): Promise<string>;
```

**Returns:** Complete TypeScript code as a string containing:

- Zod schema definitions
- Exported schemas object
- Endpoint definitions array (optional, Zodios-compatible)
- Type exports

---

### 3.2 Runtime Endpoint Metadata Function

```typescript
export function getZodiosEndpointDefinitionList(
  openApiDoc: OpenAPIObject,
  options: {
    shouldExportAllSchemas: boolean;
    shouldExportAllTypes: boolean;
    groupStrategy?: string;
    withAlias?: boolean;
  },
): EndpointContext;

interface EndpointContext {
  /**
   * Array of endpoint definitions with runtime Zod schemas
   */
  endpoints: EndpointDefinition[];

  /**
   * Named schemas extracted from components
   */
  schemas?: Record<string, z.ZodTypeAny>;

  /**
   * Additional metadata
   */
  [key: string]: unknown;
}

interface EndpointDefinition {
  /**
   * HTTP method in lowercase
   */
  method: string;

  /**
   * Path pattern from OpenAPI (e.g., /users/{id})
   */
  path: string;

  /**
   * Operation description
   */
  description?: string;

  /**
   * Request format
   */
  requestFormat: 'json' | 'form-data' | 'form-url';

  /**
   * Runtime Zod schema for response validation
   */
  response: z.ZodTypeAny;

  /**
   * Parameter definitions with runtime Zod schemas
   */
  parameters?: ParameterDefinition[];

  /**
   * Operation ID from OpenAPI
   */
  operationId?: string;
}

interface ParameterDefinition {
  /**
   * Parameter name
   */
  name: string;

  /**
   * Parameter location
   */
  type: 'Path' | 'Query' | 'Header' | 'Body';

  /**
   * Runtime Zod schema object (NOT a string)
   * Must be usable for validation and code generation
   */
  schema: z.ZodTypeAny;

  /**
   * Description from OpenAPI
   */
  description?: string;

  /**
   * Whether parameter is required
   */
  required?: boolean;
}
```

**Critical Requirements:**

- `parameters[].schema` **MUST** be a runtime Zod schema object
- The schema object **MUST** be serializable to TypeScript code
- The schema object **MUST** support `.safeParse()` and other Zod methods

---

### 3.3 Schema Conversion Utilities (Optional but Helpful)

```typescript
/**
 * Convert a JSON Schema object to a Zod schema object
 */
export function jsonSchemaToZodSchema(schema: JSONSchema7): z.ZodTypeAny;

/**
 * Convert a JSON Schema object to Zod TypeScript code
 */
export function jsonSchemaToZodCode(
  schema: JSONSchema7,
  options?: { name?: string; export?: boolean },
): string;

/**
 * Serialize a runtime Zod schema to TypeScript code
 */
export function zodSchemaToCode(schema: z.ZodTypeAny, options?: { name?: string }): string;
```

---

## 4. Input/Output Specifications

### 4.1 Input: OpenAPI Document

```typescript
interface OpenAPIObject {
  openapi: string; // '3.0.0' | '3.0.1' | '3.1.0'
  info: InfoObject;
  paths: PathsObject;
  components?: ComponentsObject;
  servers?: ServerObject[];
  // ... other OpenAPI properties
}
```

**Requirements:**

- Must use `openapi3-ts` or compatible types
- Must support both `paths` being optional (per spec) and required (for validation)

### 4.2 Output: Generated Code Structure

**Example structure the library should generate:**

```typescript
import { z } from 'zod';

// Named schema exports
export const UserSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
  })
  .strict();

export type User = z.infer<typeof UserSchema>;

// Endpoints array (Zodios compatible)
export const endpoints = [
  {
    method: 'get',
    path: '/users/:id',
    description: 'Get user by ID',
    requestFormat: 'json',
    parameters: [
      {
        name: 'id',
        type: 'Path',
        schema: z.string().uuid(),
      },
    ],
    response: UserSchema,
  },
  // ... more endpoints
];

// Schema collection
export const schemas = {
  User: UserSchema,
  // ... more schemas
};
```

---

## 5. Use Cases

### UC-1: Build-Time Type Generation

**Actor:** SDK Build Process  
**Goal:** Generate types and schemas at compile time from OpenAPI spec

**Flow:**

1. Load OpenAPI specification from JSON file
2. Call `generateZodClientFromOpenAPI()`
3. Post-process generated code (add custom exports, metadata)
4. Write to `src/types/generated/` directory
5. TypeScript compiler builds type definitions

**Success Criteria:**

- Generated code compiles without errors
- Running twice produces identical output
- All API endpoints have corresponding schemas

### UC-2: Request Parameter Validation

**Actor:** Type Generator  
**Goal:** Generate request parameter validators for all endpoints

**Flow:**

1. Load OpenAPI specification
2. Call `getZodiosEndpointDefinitionList()`
3. Iterate over `endpoints` array
4. For each endpoint, extract `parameters` array
5. Serialize `parameter.schema` to TypeScript code
6. Generate `REQUEST_PARAMETER_SCHEMAS` constant

**Success Criteria:**

- Each endpoint has a parameter schema
- Schemas include path, query, and header parameters
- Generated code validates requests correctly

### UC-3: MCP Tool Input Schema Generation

**Actor:** Tool Generator  
**Goal:** Generate MCP-compatible tool input schemas

**Flow:**

1. For each operation in OpenAPI spec
2. Extract parameters (path, query, body)
3. Generate nested structure: `{ params: { path: {...}, query: {...} } }`
4. Generate both JSON Schema (for MCP protocol) and Zod (for runtime validation)
5. Include descriptions and validation rules

**Success Criteria:**

- Input schema matches MCP JSON Schema format
- Zod schema validates the same structure
- Invalid inputs are rejected with helpful messages

### UC-4: Response Validation

**Actor:** API Client  
**Goal:** Validate API responses match OpenAPI specification

**Flow:**

1. Make API request
2. Receive response data
3. Look up response schema by method + path
4. Call `schema.safeParse(data)`
5. Handle validation result

**Success Criteria:**

- Valid responses pass validation
- Invalid responses fail with detailed error messages
- TypeScript types match validated data

---

## 6. Non-Functional Requirements

### NFR-1: Performance

- **MUST** process a 500-endpoint OpenAPI spec in < 5 seconds
- **SHOULD** support incremental generation for large specs
- **SHOULD** cache parsed schemas to avoid recomputation

### NFR-2: Reliability

- **MUST** produce deterministic output (no randomness)
- **MUST** handle malformed OpenAPI gracefully with clear error messages
- **MUST** validate output code is syntactically correct
- **SHOULD** include comprehensive error handling

### NFR-3: Maintainability

- **MUST** be written in TypeScript with strict mode enabled
- **MUST** include comprehensive type definitions
- **MUST** follow our type-safety rules (no `as`, `any`, `!`)
- **SHOULD** have unit tests for core functionality
- **SHOULD** include integration tests with real OpenAPI specs

### NFR-4: Compatibility

- **MUST** work with Node.js >= 22.0.0
- **MUST** support ES modules (ESM)
- **MUST** be compatible with Zod >= 3.0
- **MUST** work with `openapi3-ts` types
- **SHOULD** have minimal dependencies

### NFR-5: Documentation

- **MUST** include API documentation for all exported functions
- **MUST** include examples for common use cases
- **SHOULD** include migration guide if replacing existing library
- **SHOULD** document limitations and edge cases

---

## 7. Constraints and Assumptions

### Constraints

1. Generated code must use Zod 3.x API
2. Must integrate with existing type generation pipeline
3. Cannot introduce breaking changes to generated output structure
4. Must support both file output and in-memory string return

### Assumptions

1. OpenAPI documents are valid and pre-validated
2. All referenced components are defined in the same document
3. Generated code will be formatted by Prettier post-generation
4. Build system uses `pnpm` and `tsx`

---

## 8. Future Requirements

### FR-Future-1: Streaming Generation

Support generating large schemas in streaming fashion to avoid memory issues

### FR-Future-2: Plugin System

Allow custom transformations and schema enhancers via plugins

### FR-Future-3: Multiple Output Formats

Support generating Yup, io-ts, or other validation libraries

### FR-Future-4: Incremental Updates

Only regenerate changed schemas when OpenAPI spec is partially updated

### FR-Future-5: Enhanced MCP Integration

Generate complete MCP tool definitions with handlers and documentation

---

## 9. Acceptance Criteria

The library is considered acceptable if:

1. ✅ Can replace `openapi-zod-client` with no changes to generated output structure
2. ✅ Successfully generates schemas for all 500+ endpoints in Oak Curriculum API
3. ✅ Generated code passes TypeScript strict mode compilation
4. ✅ Generated code passes all ESLint rules including custom boundary rules
5. ✅ All existing tests continue to pass
6. ✅ `pnpm type-gen` completes without errors
7. ✅ Runtime validation works correctly for all endpoints
8. ✅ MCP tools validate input and output correctly
9. ✅ Build time does not increase by more than 10%
10. ✅ Generated code size does not increase by more than 20%

---

## 10. Evaluation Criteria for Existing Libraries

When evaluating external libraries, score each criterion:

| Criterion                      | Weight | Score (0-5) | Notes |
| ------------------------------ | ------ | ----------- | ----- |
| Supports OpenAPI 3.1           | High   |             |       |
| Generates runtime Zod schemas  | High   |             |       |
| Provides endpoint metadata API | High   |             |       |
| Handles all JSON Schema types  | High   |             |       |
| Active maintenance             | Medium |             |       |
| TypeScript-first               | Medium |             |       |
| Minimal dependencies           | Low    |             |       |
| Good documentation             | Low    |             |       |

**Minimum passing score:** 32/40

---

## 11. Decision Matrix

| Option                                    | Pros                                                          | Cons                                                              | Recommendation                           |
| ----------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------- | ---------------------------------------- |
| Keep `openapi-zod-client`                 | Already integrated                                            | Limited control, uses Handlebars templates, extra post-processing | Only if no better alternative            |
| Alternative library (e.g., `openapi-zod`) | Community maintained, possibly more features                  | May not match exact API surface                                   | Evaluate against criteria                |
| Internal workspace                        | Complete control, no external dependencies, tailored to needs | Maintenance burden, time investment                               | Recommended if no library scores > 32/40 |

---

## 12. References

- Current implementation: `packages/sdks/oak-curriculum-sdk/type-gen/zodgen-core.ts`
- Parameter validator: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/validation/emit-request-validator-map.ts`
- Generated output example: `packages/sdks/oak-curriculum-sdk/src/types/generated/zod/curriculumZodSchemas.ts`
- Tool descriptor contract: `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/contract/tool-descriptor.contract.ts`

---

## Appendix A: Current Library Issues

Issues with `openapi-zod-client` that motivate replacement:

1. **Template dependency** - Relies on Handlebars templates from node_modules
2. **Heavy post-processing** - Requires extensive string manipulation of output
3. **Type casting required** - Forces `as` assertion for `paths` property
4. **Outdated dependencies** - Uses older OpenAPI type definitions
5. **Limited customization** - Cannot easily modify schema generation logic
6. **Code quality** - Generates schemas with `.passthrough()` instead of `.strict()`

---

## Appendix B: Example Parameter Schema Serialization

The library must support serializing runtime Zod schemas to code. Example:

**Input (runtime Zod schema):**

```typescript
const schema = z.object({
  keyStage: z.union([z.literal('ks1'), z.literal('ks2')]),
  subject: z.string(),
});
```

**Output (TypeScript code string):**

```typescript
"z.object({ keyStage: z.union([z.literal(\"ks1\"), z.literal(\"ks2\")]), subject: z.string() })";
```

This serialization is critical for the `emitRequestValidatorMap` function.

---

## Appendix C: Current Usage Summary

### Two Functions Consumed from `openapi-zod-client`

#### 1. `generateZodClientFromOpenAPI`

- **File:** `packages/sdks/oak-curriculum-sdk/type-gen/zodgen-core.ts`
- **Purpose:** Generate complete Zod schema file with endpoint definitions
- **Current options:**
  ```typescript
  {
    shouldExportAllSchemas: true,
    shouldExportAllTypes: true,
    groupStrategy: 'none',
    withAlias: false,
  }
  ```
- **Template:** Uses `src/templates/default.hbs` from `openapi-zod-client` package
- **Post-processing:** Heavy string manipulation to add custom exports

#### 2. `getZodiosEndpointDefinitionList`

- **File:** `packages/sdks/oak-curriculum-sdk/type-gen/typegen-core.ts`
- **Purpose:** Extract runtime endpoint metadata with Zod schemas
- **Returns:** Object with `endpoints` array containing:
  - `method`, `path`, `description`
  - `parameters[]` with `name`, `type`, and **runtime `schema` object**
  - `response` as runtime Zod schema
- **Usage:** Parameters are serialized to code for `REQUEST_PARAMETER_SCHEMAS`

---

**Document Status:** Complete v1.0  
**Next Steps:**

1. Evaluate existing alternatives against criteria
2. If no suitable alternative, plan internal workspace implementation
3. Create proof-of-concept with small OpenAPI spec
4. Validate against full Oak Curriculum API spec
