# Oak Curriculum SDK — AI Reference

Generated: 2025-08-13T15:00:54.127Z

This single-file document is intended for AI agents. It contains the public API surface of the SDK, usage examples, and programmatic exports. For detailed human-oriented docs, see files under `docs/api/`.

## Quickstart

### Create clients

```ts
import { createOakClient, createOakPathBasedClient } from '@oaknational/oak-curriculum-sdk';

const apiKey = 'YOUR_API_KEY';
const client = createOakClient(apiKey);
const pathClient = createOakPathBasedClient(apiKey);
```

### Call an endpoint (method-based)

```ts
const res = await client.GET('/lessons/{lesson}/transcript', {
  params: { path: { lesson: 'lesson-slug' } },
});
if (res.error) throw res.error;
console.log(res.data);
```

### Call an endpoint (path-based)

```ts
const res2 = await pathClient['/lessons/{lesson}/transcript'].GET({
  params: { path: { lesson: 'lesson-slug' } },
});
console.log(res2.data);
```

### Programmatic tool generation

```ts
import { toolGeneration, schema } from '@oaknational/oak-curriculum-sdk';

for (const op of toolGeneration.PATH_OPERATIONS) {
  const { pathParams, toMcpToolName } = toolGeneration.parsePathTemplate(op.path, op.method);
  console.log(op.operationId, toMcpToolName(), pathParams);
}
```

## References

### createApiClient

## Interfaces

### ValidatedClientOptions

Options for the validated client wrapper

### ValidationIssue

Validation issue details

## Type aliass

### HttpMethod

```ts
type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';
```

Source: [validation/types.ts:38](https://github.com/oaknational/oak-mcp-ecosystem/blob/3e902bf53424c4a2a132b6d3a7906bfaca9e8c33/packages/oak-curriculum-sdk/src/validation/types.ts#L38)

HTTP methods supported by validation

### OakApiClient

```ts
type OakApiClient = OpenApiClient<paths>;
```

Source: [client/oak-base-client.ts:17](https://github.com/oaknational/oak-mcp-ecosystem/blob/3e902bf53424c4a2a132b6d3a7906bfaca9e8c33/packages/oak-curriculum-sdk/src/client/oak-base-client.ts#L17)

The base OpenAPI-Fetch client.

Use this client for maximum performance.

### OakApiPathBasedClient

```ts
type OakApiPathBasedClient = OpenApiPathBasedClient<paths>;
```

Source: [client/oak-base-client.ts:27](https://github.com/oaknational/oak-mcp-ecosystem/blob/3e902bf53424c4a2a132b6d3a7906bfaca9e8c33/packages/oak-curriculum-sdk/src/client/oak-base-client.ts#L27)

The base OpenAPI-Fetch path-based client.

Use this client for accessing paths as properties of the client.
This uses an object proxy to access the paths, which causes some
performance overhead. For most use cases the convenience outweighs
the performance cost.

### ValidationResult

```ts
type ValidationResult = <reflection>(…) | <reflection>(…)
```

Source: [validation/types.ts:12](https://github.com/oaknational/oak-mcp-ecosystem/blob/3e902bf53424c4a2a132b6d3a7906bfaca9e8c33/packages/oak-curriculum-sdk/src/validation/types.ts#L12)

Result type for validation operations
Discriminated union for type-safe error handling

## Variables

### apiSchemaUrl

### apiUrl

### toolGeneration

Programmatic tool generation exports: pre-generated metadata and helpers.

Includes:

- `PATH_OPERATIONS` and `OPERATIONS_BY_ID` (operation metadata)
- `PARAM_TYPE_MAP` (curated parameter schemas)
- `parsePathTemplate` (path template utility)
- Allowed value constants (`KEY_STAGES`, `SUBJECTS`, `allowedMethods`)

Example:

````ts
```ts
import { toolGeneration } from '@oaknational/oak-curriculum-sdk';

for (const op of toolGeneration.PATH_OPERATIONS) {
  const { toMcpToolName } = toolGeneration.parsePathTemplate(op.path, op.method);
  console.log(op.operationId, toMcpToolName());
}
````

````

## Functions

### createOakClient

```ts
function createOakClient(apiKey: string): OakApiClient
````

Create an Oak API client using the OpenAPI-Fetch style interface.

Environment-agnostic: The SDK core never reads environment variables.
Always pass the API key explicitly.

### createOakPathBasedClient

```ts
function createOakPathBasedClient(apiKey: string): OakApiPathBasedClient;
```

Create an Oak API client using the path-indexed interface.

Environment-agnostic: The SDK core never reads environment variables.
Always pass the API key explicitly.

### validateRequest

```ts
function validateRequest(
  path: string,
  method: HttpMethod,
  args: unknown,
): ValidationResult<unknown>;
```

Validates request parameters against the schema for the given path and method
Uses generated schemas from the endpoints file

### validateResponse

```ts
function validateResponse(
  path: string,
  method: HttpMethod,
  statusCode: number,
  response: unknown,
): ValidationResult<Record<string, unknown>>;
```

Validates response data for an API operation
