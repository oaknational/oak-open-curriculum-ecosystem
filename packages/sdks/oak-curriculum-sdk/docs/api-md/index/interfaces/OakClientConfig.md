[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../README.md) / [index](../README.md) / OakClientConfig

# Interface: OakClientConfig

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/client/oak-base-client.ts:27

Configuration for the Oak API client.

## Properties

### apiKey

> `readonly` **apiKey**: `string`

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/client/oak-base-client.ts:29

Oak API key for authentication

---

### rateLimit?

> `readonly` `optional` **rateLimit**: `Partial`\<[`RateLimitConfig`](RateLimitConfig.md)\>

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/client/oak-base-client.ts:31

Optional rate limit configuration (defaults to 10 req/sec)

---

### retry?

> `readonly` `optional` **retry**: `Partial`\<[`RetryConfig`](RetryConfig.md)\>

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/client/oak-base-client.ts:33

Optional retry configuration (defaults to 3 retries with exponential backoff)
