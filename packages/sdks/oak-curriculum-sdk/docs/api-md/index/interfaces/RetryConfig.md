[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../README.md) / [index](../README.md) / RetryConfig

# Interface: RetryConfig

Defined in: [packages/sdks/oak-curriculum-sdk/src/config/retry-config.ts:22](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/config/retry-config.ts#L22)

Configuration for SDK request retry with exponential backoff.
Automatically retries transient failures (429, 503) with increasing delays.
Supports per-status-code retry limits for conservative retries on 404/500.

## Properties

### backoffMultiplier

> `readonly` **backoffMultiplier**: `number`

Defined in: [packages/sdks/oak-curriculum-sdk/src/config/retry-config.ts:30](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/config/retry-config.ts#L30)

Backoff multiplier. Default: 2 (exponential)

---

### enabled

> `readonly` **enabled**: `boolean`

Defined in: [packages/sdks/oak-curriculum-sdk/src/config/retry-config.ts:24](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/config/retry-config.ts#L24)

Enable/disable retry. Default: true

---

### initialDelayMs

> `readonly` **initialDelayMs**: `number`

Defined in: [packages/sdks/oak-curriculum-sdk/src/config/retry-config.ts:28](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/config/retry-config.ts#L28)

Initial backoff delay in ms. Default: 1000ms

---

### maxDelayMs

> `readonly` **maxDelayMs**: `number`

Defined in: [packages/sdks/oak-curriculum-sdk/src/config/retry-config.ts:32](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/config/retry-config.ts#L32)

Maximum backoff delay in ms. Default: 60000ms (1 minute)

---

### maxRetries

> `readonly` **maxRetries**: `number`

Defined in: [packages/sdks/oak-curriculum-sdk/src/config/retry-config.ts:26](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/config/retry-config.ts#L26)

Maximum retry attempts. Default: 3

---

### retryableStatusCodes

> `readonly` **retryableStatusCodes**: readonly `number`[]

Defined in: [packages/sdks/oak-curriculum-sdk/src/config/retry-config.ts:34](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/config/retry-config.ts#L34)

HTTP status codes that trigger retry. Default: [429, 503]

---

### statusCodeMaxRetries?

> `readonly` `optional` **statusCodeMaxRetries**: `Readonly`\<`Partial`\<`Record`\<`number`, `number`\>\>\>

Defined in: [packages/sdks/oak-curriculum-sdk/src/config/retry-config.ts:40](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/config/retry-config.ts#L40)

Per-status-code maximum retries. Overrides `maxRetries` for specific codes.
Example: `{ 404: 2, 500: 2 }` limits 404/500 to 2 retries while others use `maxRetries`.
