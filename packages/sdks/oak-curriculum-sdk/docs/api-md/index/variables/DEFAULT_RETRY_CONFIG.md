[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../README.md) / [index](../README.md) / DEFAULT_RETRY_CONFIG

# Variable: DEFAULT_RETRY_CONFIG

> `const` **DEFAULT_RETRY_CONFIG**: `Readonly`\<[`RetryConfig`](../interfaces/RetryConfig.md)\>

Defined in: [packages/sdks/oak-curriculum-sdk/src/config/retry-config.ts:49](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/config/retry-config.ts#L49)

Default retry configuration.
Exponential backoff: 1s, 2s, 4s (max 3 attempts).
Retries 429 (rate limit) and 503 (service unavailable).
