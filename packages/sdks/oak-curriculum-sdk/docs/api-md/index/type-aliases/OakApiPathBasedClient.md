[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../README.md) / [index](../README.md) / OakApiPathBasedClient

# Type Alias: OakApiPathBasedClient

> **OakApiPathBasedClient** = `OpenApiPathBasedClient`\<[`paths`](../../types/generated/api-schema/api-paths-types/interfaces/paths.md)\>

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/client/oak-base-client.ts:51

The base OpenAPI-Fetch path-based client.

Use this client for accessing paths as properties of the client.
This uses an object proxy to access the paths, which causes some
performance overhead. For most use cases the convenience outweighs
the performance cost.
