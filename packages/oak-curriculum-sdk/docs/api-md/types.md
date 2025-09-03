# Type Aliases

### HttpMethod

```ts
type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';
```

Source: [packages/oak-curriculum-sdk/src/validation/types.ts:38](https://github.com/oaknational/oak-mcp-ecosystem/blob/5c74925867cd05b4f30b2d5a8afe0f46e7bbb743/packages/oak-curriculum-sdk/src/validation/types.ts#L38)

HTTP methods supported by validation

### OakApiClient

```ts
type OakApiClient = OpenApiClient<paths>;
```

Source: [packages/oak-curriculum-sdk/src/client/oak-base-client.ts:17](https://github.com/oaknational/oak-mcp-ecosystem/blob/5c74925867cd05b4f30b2d5a8afe0f46e7bbb743/packages/oak-curriculum-sdk/src/client/oak-base-client.ts#L17)

The base OpenAPI-Fetch client.

Use this client for maximum performance.

### OakApiPathBasedClient

```ts
type OakApiPathBasedClient = OpenApiPathBasedClient<paths>;
```

Source: [packages/oak-curriculum-sdk/src/client/oak-base-client.ts:27](https://github.com/oaknational/oak-mcp-ecosystem/blob/5c74925867cd05b4f30b2d5a8afe0f46e7bbb743/packages/oak-curriculum-sdk/src/client/oak-base-client.ts#L27)

The base OpenAPI-Fetch path-based client.

Use this client for accessing paths as properties of the client.
This uses an object proxy to access the paths, which causes some
performance overhead. For most use cases the convenience outweighs
the performance cost.

### ValidationResult

```ts
type ValidationResult = <reflection>(…) | <reflection>(…)
```

Source: [packages/oak-curriculum-sdk/src/validation/types.ts:12](https://github.com/oaknational/oak-mcp-ecosystem/blob/5c74925867cd05b4f30b2d5a8afe0f46e7bbb743/packages/oak-curriculum-sdk/src/validation/types.ts#L12)

Result type for validation operations
Discriminated union for type-safe error handling
