[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../README.md) / [index](../README.md) / DEFAULT_RATE_LIMIT_CONFIG

# Variable: DEFAULT_RATE_LIMIT_CONFIG

> `const` **DEFAULT_RATE_LIMIT_CONFIG**: `Readonly`\<[`RateLimitConfig`](../interfaces/RateLimitConfig.md)\>

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/config/rate-limit-config.ts:29

Default rate limit configuration.
Conservative defaults to avoid 429 errors from the Oak API.
10 requests per second = 100ms minimum interval.
