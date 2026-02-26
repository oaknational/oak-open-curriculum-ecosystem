[**@oaknational/curriculum-sdk v0.8.0**](../../README.md)

---

[@oaknational/curriculum-sdk](../../README.md) / [src](../README.md) / DEFAULT_RETRY_CONFIG

# Variable: DEFAULT_RETRY_CONFIG

> `const` **DEFAULT_RETRY_CONFIG**: `Readonly`\<[`RetryConfig`](../interfaces/RetryConfig.md)\>

Defined in: [sdks/oak-curriculum-sdk/src/config/retry-config.ts:49](https://github.com/oaknational/oak-mcp-ecosystem/blob/75b5bc735a49141f750685399d9a67677fd4a630/packages/sdks/oak-curriculum-sdk/src/config/retry-config.ts#L49)

Default retry configuration.
Exponential backoff: 1s, 2s, 4s (max 3 attempts).
Retries 429 (rate limit) and 503 (service unavailable).
