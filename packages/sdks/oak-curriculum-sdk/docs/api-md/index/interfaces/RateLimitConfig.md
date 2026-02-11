[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../README.md) / [index](../README.md) / RateLimitConfig

# Interface: RateLimitConfig

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/config/rate-limit-config.ts:14

Configuration for SDK request rate limiting.
Prevents overwhelming the API with too many requests.

## Properties

### enabled

> `readonly` **enabled**: `boolean`

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/config/rate-limit-config.ts:16

Enable/disable rate limiting. Default: true

---

### maxRequestsPerSecond

> `readonly` **maxRequestsPerSecond**: `number`

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/config/rate-limit-config.ts:20

Maximum requests per second. Default: 10

---

### minRequestInterval

> `readonly` **minRequestInterval**: `number`

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/config/rate-limit-config.ts:18

Minimum milliseconds between requests. Default: 100ms (10 req/sec)
