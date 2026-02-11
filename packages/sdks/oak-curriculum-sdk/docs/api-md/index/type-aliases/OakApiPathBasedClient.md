[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../README.md) / [index](../README.md) / OakApiPathBasedClient

# Type Alias: OakApiPathBasedClient

> **OakApiPathBasedClient** = `OpenApiPathBasedClient`\<[`paths`](../../types/generated/api-schema/api-paths-types/interfaces/paths.md)\>

Defined in: [packages/sdks/oak-curriculum-sdk/src/client/oak-base-client.ts:51](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/client/oak-base-client.ts#L51)

The base OpenAPI-Fetch path-based client.

Use this client for accessing paths as properties of the client.
This uses an object proxy to access the paths, which causes some
performance overhead. For most use cases the convenience outweighs
the performance cost.
