# Castr Expected Outputs

This document provides concrete examples of the outputs Oak expects from castr, derived from analysing the current adapter and its consumers.

## Example: Widget API

Given this OpenAPI fragment:

```json
{
  "openapi": "3.0.3",
  "paths": {
    "/widgets/{id}": {
      "get": {
        "operationId": "getWidget",
        "summary": "Get a widget by ID",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": { "type": "string" }
          },
          {
            "name": "include",
            "in": "query",
            "required": false,
            "schema": {
              "type": "string",
              "enum": ["metadata", "history"]
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/Widget" }
              }
            }
          },
          "404": {
            "description": "Not found",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/ErrorEnvelope" }
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
        "required": ["id", "name"],
        "properties": {
          "id": { "type": "string" },
          "name": { "type": "string" },
          "description": { "type": "string" }
        }
      },
      "ErrorEnvelope": {
        "type": "object",
        "required": ["message", "code"],
        "properties": {
          "message": { "type": "string" },
          "code": { "type": "string", "enum": ["NOT_FOUND", "INVALID_REQUEST"] }
        }
      }
    }
  }
}
```

## Expected Zod Output

### Component Schemas

```typescript
import { z } from 'zod';

/**
 * Widget schema from #/components/schemas/Widget
 */
export const Widget = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
}).strict();

/**
 * ErrorEnvelope schema from #/components/schemas/ErrorEnvelope
 */
export const ErrorEnvelope = z.object({
  message: z.string(),
  code: z.enum(['NOT_FOUND', 'INVALID_REQUEST']),
}).strict();

/**
 * All component schemas
 */
export const schemas = {
  Widget,
  ErrorEnvelope,
} as const;
```

### Key Points

1. **`.strict()`** - All object schemas MUST use `.strict()` to reject unknown keys
2. **`.optional()`** - Non-required properties get `.optional()`
3. **`z.enum()`** - OpenAPI enums become Zod enums with literal values
4. **`as const`** - Collections use `as const` to preserve literal types

## Expected Endpoints Output

```typescript
/**
 * Endpoint interface for type safety
 */
interface Endpoint {
  readonly method: string;
  readonly path: string;
  readonly description?: string;
  readonly requestFormat?: string;
  readonly response: z.ZodType;
  readonly errors?: readonly {
    readonly status: number;  // Integer, not string
    readonly description?: string;
    readonly schema: z.ZodType;
  }[];
  readonly parameters?: readonly {
    readonly name: string;
    readonly type: 'Path' | 'Query' | 'Header' | 'Cookie';
    readonly schema: z.ZodType;
  }[];
}

/**
 * All API endpoints
 */
export const endpoints: readonly Endpoint[] = [
  {
    method: 'get',
    path: '/widgets/:id',  // Note: COLON format, not curly braces
    description: 'Get a widget by ID',
    requestFormat: 'json',
    response: Widget,
    errors: [
      {
        status: 404,
        description: 'Not found',
        schema: ErrorEnvelope,
      },
    ],
    parameters: [
      {
        name: 'id',
        type: 'Path',
        schema: z.string(),
      },
      {
        name: 'include',
        type: 'Query',
        schema: z.enum(['metadata', 'history']).optional(),
      },
    ],
  },
] as const;
```

### Key Points

1. **Path format** - `/widgets/:id` not `/widgets/{id}`
2. **Status as integer** - `404` not `"404"`
3. **Parameter types** - `'Path'`, `'Query'`, etc. (capitalised)
4. **Optional parameters** - Schema includes `.optional()` for non-required params

## Expected Metadata Maps

```typescript
/**
 * Operation ID lookup by method and path
 */
export const OPERATION_ID_BY_METHOD_AND_PATH = {
  'get /widgets/:id': 'getWidget',
} as const;

/**
 * Primary success status by operation ID
 */
export const PRIMARY_RESPONSE_STATUS_BY_OPERATION_ID = {
  getWidget: '200',
} as const;

/**
 * Get operation ID for a method/path combination
 */
export function getOperationIdForEndpoint(
  method: string,
  path: string,
): string | undefined {
  const key = `${method.toLowerCase()} ${path}` as keyof typeof OPERATION_ID_BY_METHOD_AND_PATH;
  return OPERATION_ID_BY_METHOD_AND_PATH[key];
}

/**
 * Get primary success status for an operation
 */
export function getPrimaryStatusForOperation(
  operationId: string,
): string | undefined {
  return PRIMARY_RESPONSE_STATUS_BY_OPERATION_ID[
    operationId as keyof typeof PRIMARY_RESPONSE_STATUS_BY_OPERATION_ID
  ];
}
```

## Expected Schema Collection

```typescript
/**
 * Schema collection type
 */
export type SchemaCollection = Record<string, z.ZodType>;

/**
 * Build the complete schema collection from endpoints
 */
function buildSchemaCollection(endpoints: readonly Endpoint[]): SchemaCollection {
  const collection: Record<string, z.ZodType> = {};
  
  // Add component schemas
  for (const [name, schema] of Object.entries(schemas)) {
    collection[name] = schema;
  }
  
  // Add response schemas keyed by operationId_status
  for (const endpoint of endpoints) {
    const operationId = getOperationIdForEndpoint(endpoint.method, endpoint.path);
    if (!operationId) continue;
    
    const primaryStatus = getPrimaryStatusForOperation(operationId);
    if (primaryStatus) {
      collection[`${operationId}_${primaryStatus}`] = endpoint.response;
    }
    
    for (const error of endpoint.errors ?? []) {
      collection[`${operationId}_${error.status}`] = error.schema;
    }
  }
  
  return collection;
}

export const schemaCollection = buildSchemaCollection(endpoints);
```

## Expected Parameter Schema Strings (for code generation)

When generating `request-parameter-map.ts`, the consuming code needs Zod schemas as **strings**:

```typescript
export const REQUEST_PARAMETER_SCHEMAS = {
  "GET:/widgets/:id": z.object({
    "id": z.string(),
    "include": z.enum(["metadata", "history"]).optional(),
  }),
} as const;
```

Castr must provide either:

1. A serialization utility: `toCodeString(schema) => string`
2. Pre-stringified schemas in the endpoint definitions
3. A separate emitter output for request parameter maps

## Type Preservation Examples

### Enum Preservation

```yaml
# OpenAPI
schema:
  type: string
  enum: [ks1, ks2, ks3, ks4]
```

```typescript
// CORRECT: Literal enum type preserved
z.enum(['ks1', 'ks2', 'ks3', 'ks4'])
// Type: "ks1" | "ks2" | "ks3" | "ks4"

// WRONG: Type widened to string
z.string()
// Type: string (UNACCEPTABLE)
```

### Path Parameter Preservation

```yaml
# OpenAPI
/lessons/{lesson}/transcript
```

```typescript
// CORRECT: Path as literal
path: '/lessons/:lesson/transcript' as const

// WRONG: Path as string
path: '/lessons/:lesson/transcript' // Type: string (loses literal)
```

### Status Code Preservation

```yaml
# OpenAPI
responses:
  200:
    description: Success
  404:
    description: Not found
```

```typescript
// CORRECT: Status as literal number
{ status: 200 }  // Type: 200
{ status: 404 }  // Type: 404

// ACCEPTABLE: Status as string for "default"
{ status: 'default' }

// WRONG: Status as wide number
{ status: 200 as number }  // Type: number (UNACCEPTABLE)
```

## Validation Checklist

For Phase 1 integration, verify:

- [ ] All component schemas exported with `.strict()`
- [ ] Endpoints array with colon-format paths
- [ ] Response schemas reference component schemas (not duplicated)
- [ ] Error schemas included with integer status codes
- [ ] Parameter schemas with correct `type` field
- [ ] Optional parameters use `.optional()` in schema
- [ ] Enum values preserved as literals
- [ ] Metadata maps with `as const`
- [ ] Deterministic output (run twice, diff is empty)
