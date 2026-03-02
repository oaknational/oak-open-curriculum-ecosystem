[**@oaknational/curriculum-sdk v0.8.0**](../../README.md)

---

[@oaknational/curriculum-sdk](../../README.md) / [src](../README.md) / RetryConfig

# Interface: RetryConfig

Defined in: [sdks/oak-curriculum-sdk/src/config/retry-config.ts:22](https://github.com/oaknational/oak-mcp-ecosystem/blob/75b5bc735a49141f750685399d9a67677fd4a630/packages/sdks/oak-curriculum-sdk/src/config/retry-config.ts#L22)

Configuration for SDK request retry with exponential backoff.
Automatically retries transient failures (429, 503) with increasing delays.
Supports per-status-code retry limits for conservative retries on 404/500.

## Properties

### backoffMultiplier

> `readonly` **backoffMultiplier**: `number`

Defined in: [sdks/oak-curriculum-sdk/src/config/retry-config.ts:30](https://github.com/oaknational/oak-mcp-ecosystem/blob/75b5bc735a49141f750685399d9a67677fd4a630/packages/sdks/oak-curriculum-sdk/src/config/retry-config.ts#L30)

Backoff multiplier. Default: 2 (exponential)

---

### enabled

> `readonly` **enabled**: `boolean`

Defined in: [sdks/oak-curriculum-sdk/src/config/retry-config.ts:24](https://github.com/oaknational/oak-mcp-ecosystem/blob/75b5bc735a49141f750685399d9a67677fd4a630/packages/sdks/oak-curriculum-sdk/src/config/retry-config.ts#L24)

Enable/disable retry. Default: true

---

### initialDelayMs

> `readonly` **initialDelayMs**: `number`

Defined in: [sdks/oak-curriculum-sdk/src/config/retry-config.ts:28](https://github.com/oaknational/oak-mcp-ecosystem/blob/75b5bc735a49141f750685399d9a67677fd4a630/packages/sdks/oak-curriculum-sdk/src/config/retry-config.ts#L28)

Initial backoff delay in ms. Default: 1000ms

---

### maxDelayMs

> `readonly` **maxDelayMs**: `number`

Defined in: [sdks/oak-curriculum-sdk/src/config/retry-config.ts:32](https://github.com/oaknational/oak-mcp-ecosystem/blob/75b5bc735a49141f750685399d9a67677fd4a630/packages/sdks/oak-curriculum-sdk/src/config/retry-config.ts#L32)

Maximum backoff delay in ms. Default: 60000ms (1 minute)

---

### maxRetries

> `readonly` **maxRetries**: `number`

Defined in: [sdks/oak-curriculum-sdk/src/config/retry-config.ts:26](https://github.com/oaknational/oak-mcp-ecosystem/blob/75b5bc735a49141f750685399d9a67677fd4a630/packages/sdks/oak-curriculum-sdk/src/config/retry-config.ts#L26)

Maximum retry attempts. Default: 3

---

### retryableStatusCodes

> `readonly` **retryableStatusCodes**: readonly `number`[]

Defined in: [sdks/oak-curriculum-sdk/src/config/retry-config.ts:34](https://github.com/oaknational/oak-mcp-ecosystem/blob/75b5bc735a49141f750685399d9a67677fd4a630/packages/sdks/oak-curriculum-sdk/src/config/retry-config.ts#L34)

HTTP status codes that trigger retry. Default: [429, 503]

---

### statusCodeMaxRetries?

> `readonly` `optional` **statusCodeMaxRetries**: `Readonly`\<`Partial`\<`Record`\<`number`, `number`\>\>\>

Defined in: [sdks/oak-curriculum-sdk/src/config/retry-config.ts:40](https://github.com/oaknational/oak-mcp-ecosystem/blob/75b5bc735a49141f750685399d9a67677fd4a630/packages/sdks/oak-curriculum-sdk/src/config/retry-config.ts#L40)

Per-status-code maximum retries. Overrides `maxRetries` for specific codes.
Example: `{ 404: 2, 500: 2 }` limits 404/500 to 2 retries while others use `maxRetries`.
