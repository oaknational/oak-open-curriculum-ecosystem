[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../README.md) / [index](../README.md) / DEFAULT_RETRY_CONFIG

# Variable: DEFAULT_RETRY_CONFIG

> `const` **DEFAULT_RETRY_CONFIG**: `Readonly`\<[`RetryConfig`](../interfaces/RetryConfig.md)\>

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/config/retry-config.ts:49

Default retry configuration.
Exponential backoff: 1s, 2s, 4s (max 3 attempts).
Retries 429 (rate limit) and 503 (service unavailable).
