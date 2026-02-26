[**@oaknational/curriculum-sdk v0.8.0**](../../README.md)

---

[@oaknational/curriculum-sdk](../../README.md) / [src](../README.md) / OakApiPathBasedClient

# Type Alias: OakApiPathBasedClient

> **OakApiPathBasedClient** = `OpenApiPathBasedClient`\<[`paths`](../interfaces/paths.md)\>

Defined in: [sdks/oak-curriculum-sdk/src/client/oak-base-client.ts:78](https://github.com/oaknational/oak-mcp-ecosystem/blob/75b5bc735a49141f750685399d9a67677fd4a630/packages/sdks/oak-curriculum-sdk/src/client/oak-base-client.ts#L78)

The base OpenAPI-Fetch path-based client.

Use this client for accessing paths as properties of the client.
This uses an object proxy to access the paths, which causes some
performance overhead. For most use cases the convenience outweighs
the performance cost.
