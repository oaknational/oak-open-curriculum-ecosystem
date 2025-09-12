# Type Aliases

### HttpMethod

```ts
type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';
```

Source: [packages/sdks/oak-curriculum-sdk/src/validation/types.ts:39](https://github.com/oaknational/oak-mcp-ecosystem/blob/397e22ddfdb378154f31034236a71503064dd11b/packages/sdks/oak-curriculum-sdk/src/validation/types.ts#L39)

HTTP methods supported by validation

### OakApiClient

```ts
type OakApiClient = OpenApiClient<paths>;
```

Source: [packages/sdks/oak-curriculum-sdk/src/client/oak-base-client.ts:17](https://github.com/oaknational/oak-mcp-ecosystem/blob/397e22ddfdb378154f31034236a71503064dd11b/packages/sdks/oak-curriculum-sdk/src/client/oak-base-client.ts#L17)

The base OpenAPI-Fetch client.

Use this client for maximum performance.

### OakApiPathBasedClient

```ts
type OakApiPathBasedClient = OpenApiPathBasedClient<paths>;
```

Source: [packages/sdks/oak-curriculum-sdk/src/client/oak-base-client.ts:27](https://github.com/oaknational/oak-mcp-ecosystem/blob/397e22ddfdb378154f31034236a71503064dd11b/packages/sdks/oak-curriculum-sdk/src/client/oak-base-client.ts#L27)

The base OpenAPI-Fetch path-based client.

Use this client for accessing paths as properties of the client.
This uses an object proxy to access the paths, which causes some
performance overhead. For most use cases the convenience outweighs
the performance cost.

### ValidationResult

```ts
type ValidationResult = <reflection>(…) | <reflection>(…)
```

Source: [packages/sdks/oak-curriculum-sdk/src/validation/types.ts:13](https://github.com/oaknational/oak-mcp-ecosystem/blob/397e22ddfdb378154f31034236a71503064dd11b/packages/sdks/oak-curriculum-sdk/src/validation/types.ts#L13)

Result type for validation operations
Discriminated union for type-safe error handling
