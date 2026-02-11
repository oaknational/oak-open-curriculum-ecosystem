[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../README.md) / [index](../README.md) / RetryConfig

# Interface: RetryConfig

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/config/retry-config.ts:22

Configuration for SDK request retry with exponential backoff.
Automatically retries transient failures (429, 503) with increasing delays.
Supports per-status-code retry limits for conservative retries on 404/500.

## Properties

### backoffMultiplier

> `readonly` **backoffMultiplier**: `number`

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/config/retry-config.ts:30

Backoff multiplier. Default: 2 (exponential)

---

### enabled

> `readonly` **enabled**: `boolean`

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/config/retry-config.ts:24

Enable/disable retry. Default: true

---

### initialDelayMs

> `readonly` **initialDelayMs**: `number`

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/config/retry-config.ts:28

Initial backoff delay in ms. Default: 1000ms

---

### maxDelayMs

> `readonly` **maxDelayMs**: `number`

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/config/retry-config.ts:32

Maximum backoff delay in ms. Default: 60000ms (1 minute)

---

### maxRetries

> `readonly` **maxRetries**: `number`

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/config/retry-config.ts:26

Maximum retry attempts. Default: 3

---

### retryableStatusCodes

> `readonly` **retryableStatusCodes**: readonly `number`[]

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/config/retry-config.ts:34

HTTP status codes that trigger retry. Default: [429, 503]

---

### statusCodeMaxRetries?

> `readonly` `optional` **statusCodeMaxRetries**: `Readonly`\<`Partial`\<`Record`\<`number`, `number`\>\>\>

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/config/retry-config.ts:40

Per-status-code maximum retries. Overrides `maxRetries` for specific codes.
Example: `{ 404: 2, 500: 2 }` limits 404/500 to 2 retries while others use `maxRetries`.
