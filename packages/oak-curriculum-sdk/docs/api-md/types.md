# Type Aliases

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
