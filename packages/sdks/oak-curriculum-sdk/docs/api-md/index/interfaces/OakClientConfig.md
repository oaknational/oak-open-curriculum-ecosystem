[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../README.md) / [index](../README.md) / OakClientConfig

# Interface: OakClientConfig

Defined in: [packages/sdks/oak-curriculum-sdk/src/client/oak-base-client.ts:27](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/client/oak-base-client.ts#L27)

Configuration for the Oak API client.

## Properties

### apiKey

> `readonly` **apiKey**: `string`

Defined in: [packages/sdks/oak-curriculum-sdk/src/client/oak-base-client.ts:29](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/client/oak-base-client.ts#L29)

Oak API key for authentication

---

### rateLimit?

> `readonly` `optional` **rateLimit**: `Partial`\<[`RateLimitConfig`](RateLimitConfig.md)\>

Defined in: [packages/sdks/oak-curriculum-sdk/src/client/oak-base-client.ts:31](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/client/oak-base-client.ts#L31)

Optional rate limit configuration (defaults to 10 req/sec)

---

### retry?

> `readonly` `optional` **retry**: `Partial`\<[`RetryConfig`](RetryConfig.md)\>

Defined in: [packages/sdks/oak-curriculum-sdk/src/client/oak-base-client.ts:33](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/client/oak-base-client.ts#L33)

Optional retry configuration (defaults to 3 retries with exponential backoff)
