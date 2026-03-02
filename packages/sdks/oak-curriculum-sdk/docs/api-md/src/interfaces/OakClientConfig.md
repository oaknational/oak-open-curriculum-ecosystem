[**@oaknational/curriculum-sdk v0.8.0**](../../README.md)

---

[@oaknational/curriculum-sdk](../../README.md) / [src](../README.md) / OakClientConfig

# Interface: OakClientConfig

Defined in: [sdks/oak-curriculum-sdk/src/client/oak-base-client.ts:46](https://github.com/oaknational/oak-mcp-ecosystem/blob/75b5bc735a49141f750685399d9a67677fd4a630/packages/sdks/oak-curriculum-sdk/src/client/oak-base-client.ts#L46)

Configuration for the Oak API client.

## Properties

### apiKey

> `readonly` **apiKey**: `string`

Defined in: [sdks/oak-curriculum-sdk/src/client/oak-base-client.ts:48](https://github.com/oaknational/oak-mcp-ecosystem/blob/75b5bc735a49141f750685399d9a67677fd4a630/packages/sdks/oak-curriculum-sdk/src/client/oak-base-client.ts#L48)

Oak API key for authentication

---

### logger?

> `readonly` `optional` **logger**: `Logger`

Defined in: [sdks/oak-curriculum-sdk/src/client/oak-base-client.ts:60](https://github.com/oaknational/oak-mcp-ecosystem/blob/75b5bc735a49141f750685399d9a67677fd4a630/packages/sdks/oak-curriculum-sdk/src/client/oak-base-client.ts#L60)

Logger for SDK diagnostics (e.g. response augmentation warnings).

When provided, the consuming app's logger is used for middleware
diagnostics so the SDK never reads `process.env` directly (ADR-078).
When absent, augmentation warnings are silently discarded.

---

### rateLimit?

> `readonly` `optional` **rateLimit**: `Partial`\<[`RateLimitConfig`](RateLimitConfig.md)\>

Defined in: [sdks/oak-curriculum-sdk/src/client/oak-base-client.ts:50](https://github.com/oaknational/oak-mcp-ecosystem/blob/75b5bc735a49141f750685399d9a67677fd4a630/packages/sdks/oak-curriculum-sdk/src/client/oak-base-client.ts#L50)

Optional rate limit configuration (defaults to 10 req/sec)

---

### retry?

> `readonly` `optional` **retry**: `Partial`\<[`RetryConfig`](RetryConfig.md)\>

Defined in: [sdks/oak-curriculum-sdk/src/client/oak-base-client.ts:52](https://github.com/oaknational/oak-mcp-ecosystem/blob/75b5bc735a49141f750685399d9a67677fd4a630/packages/sdks/oak-curriculum-sdk/src/client/oak-base-client.ts#L52)

Optional retry configuration (defaults to 3 retries with exponential backoff)
