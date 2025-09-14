# Type Aliases

### DocKeyStage

```ts
type DocKeyStage = KeyStage;
```

Source: packages/sdks/oak-curriculum-sdk/src/types/doc-bridges.ts:17

Key stage literal type.

### DocSubject

```ts
type DocSubject = Subject;
```

Source: packages/sdks/oak-curriculum-sdk/src/types/doc-bridges.ts:14

Subject slug literal type.

### HttpMethod

```ts
type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';
```

Source: [packages/sdks/oak-curriculum-sdk/src/validation/types.ts:39](https://github.com/oaknational/oak-mcp-ecosystem/blob/56d1f8976c67e51376482d69f4666684c5a5ead7/packages/sdks/oak-curriculum-sdk/src/validation/types.ts#L39)

HTTP methods supported by validation

### OakApiClient

```ts
type OakApiClient = OpenApiClient<OakApiPaths>;
```

Source: [packages/sdks/oak-curriculum-sdk/src/client/oak-base-client.ts:17](https://github.com/oaknational/oak-mcp-ecosystem/blob/56d1f8976c67e51376482d69f4666684c5a5ead7/packages/sdks/oak-curriculum-sdk/src/client/oak-base-client.ts#L17)

The base OpenAPI-Fetch client.

Use this client for maximum performance.

### OakApiPathBasedClient

```ts
type OakApiPathBasedClient = OpenApiPathBasedClient<OakApiPaths>;
```

Source: [packages/sdks/oak-curriculum-sdk/src/client/oak-base-client.ts:27](https://github.com/oaknational/oak-mcp-ecosystem/blob/56d1f8976c67e51376482d69f4666684c5a5ead7/packages/sdks/oak-curriculum-sdk/src/client/oak-base-client.ts#L27)

The base OpenAPI-Fetch path-based client.

Use this client for accessing paths as properties of the client.
This uses an object proxy to access the paths, which causes some
performance overhead. For most use cases the convenience outweighs
the performance cost.

### OpenApiPathsMap

```ts
type OpenApiPathsMap = paths;
```

Source: packages/sdks/oak-curriculum-sdk/src/types/doc-bridges.ts:11

OpenAPI `paths` map used by the Oak API clients.

### SubjectSlug

```ts
type SubjectSlug = Subject;
```

Source: [packages/sdks/oak-curriculum-sdk/src/types/search-index.ts:11](https://github.com/oaknational/oak-mcp-ecosystem/blob/56d1f8976c67e51376482d69f4666684c5a5ead7/packages/sdks/oak-curriculum-sdk/src/types/search-index.ts#L11)

Alias used by downstream apps.

### ToolExecutionResult

```ts
type ToolExecutionResult = <reflection>(…) | <reflection>(…)
```

Source: [packages/sdks/oak-curriculum-sdk/src/mcp/execute-tool-call.ts:58](https://github.com/oaknational/oak-mcp-ecosystem/blob/56d1f8976c67e51376482d69f4666684c5a5ead7/packages/sdks/oak-curriculum-sdk/src/mcp/execute-tool-call.ts#L58)

Result type for tool execution.

### ValidationResult

```ts
type ValidationResult = <reflection>(…) | <reflection>(…)
```

Source: [packages/sdks/oak-curriculum-sdk/src/validation/types.ts:13](https://github.com/oaknational/oak-mcp-ecosystem/blob/56d1f8976c67e51376482d69f4666684c5a5ead7/packages/sdks/oak-curriculum-sdk/src/validation/types.ts#L13)

Result type for validation operations
Discriminated union for type-safe error handling
