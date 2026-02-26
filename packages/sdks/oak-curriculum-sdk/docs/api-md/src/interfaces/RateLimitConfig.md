[**@oaknational/curriculum-sdk v0.8.0**](../../README.md)

---

[@oaknational/curriculum-sdk](../../README.md) / [src](../README.md) / RateLimitConfig

# Interface: RateLimitConfig

Defined in: [sdks/oak-curriculum-sdk/src/config/rate-limit-config.ts:14](https://github.com/oaknational/oak-mcp-ecosystem/blob/75b5bc735a49141f750685399d9a67677fd4a630/packages/sdks/oak-curriculum-sdk/src/config/rate-limit-config.ts#L14)

Configuration for SDK request rate limiting.
Prevents overwhelming the API with too many requests.

## Properties

### enabled

> `readonly` **enabled**: `boolean`

Defined in: [sdks/oak-curriculum-sdk/src/config/rate-limit-config.ts:16](https://github.com/oaknational/oak-mcp-ecosystem/blob/75b5bc735a49141f750685399d9a67677fd4a630/packages/sdks/oak-curriculum-sdk/src/config/rate-limit-config.ts#L16)

Enable/disable rate limiting. Default: true

---

### maxRequestsPerSecond

> `readonly` **maxRequestsPerSecond**: `number`

Defined in: [sdks/oak-curriculum-sdk/src/config/rate-limit-config.ts:20](https://github.com/oaknational/oak-mcp-ecosystem/blob/75b5bc735a49141f750685399d9a67677fd4a630/packages/sdks/oak-curriculum-sdk/src/config/rate-limit-config.ts#L20)

Maximum requests per second. Default: 10

---

### minRequestInterval

> `readonly` **minRequestInterval**: `number`

Defined in: [sdks/oak-curriculum-sdk/src/config/rate-limit-config.ts:18](https://github.com/oaknational/oak-mcp-ecosystem/blob/75b5bc735a49141f750685399d9a67677fd4a630/packages/sdks/oak-curriculum-sdk/src/config/rate-limit-config.ts#L18)

Minimum milliseconds between requests. Default: 100ms (10 req/sec)
