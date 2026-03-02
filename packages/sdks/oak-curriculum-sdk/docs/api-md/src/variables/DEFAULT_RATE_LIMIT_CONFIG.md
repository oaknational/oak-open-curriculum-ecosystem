[**@oaknational/curriculum-sdk v0.8.0**](../../README.md)

---

[@oaknational/curriculum-sdk](../../README.md) / [src](../README.md) / DEFAULT_RATE_LIMIT_CONFIG

# Variable: DEFAULT_RATE_LIMIT_CONFIG

> `const` **DEFAULT_RATE_LIMIT_CONFIG**: `Readonly`\<[`RateLimitConfig`](../interfaces/RateLimitConfig.md)\>

Defined in: [sdks/oak-curriculum-sdk/src/config/rate-limit-config.ts:29](https://github.com/oaknational/oak-mcp-ecosystem/blob/75b5bc735a49141f750685399d9a67677fd4a630/packages/sdks/oak-curriculum-sdk/src/config/rate-limit-config.ts#L29)

Default rate limit configuration.
Conservative defaults to avoid 429 errors from the Oak API.
10 requests per second = 100ms minimum interval.
