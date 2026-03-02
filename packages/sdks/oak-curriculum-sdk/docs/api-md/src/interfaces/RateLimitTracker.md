[**@oaknational/curriculum-sdk v0.8.0**](../../README.md)

---

[@oaknational/curriculum-sdk](../../README.md) / [src](../README.md) / RateLimitTracker

# Interface: RateLimitTracker

Defined in: [sdks/oak-curriculum-sdk/src/client/middleware/rate-limit-tracker.ts:17](https://github.com/oaknational/oak-mcp-ecosystem/blob/75b5bc735a49141f750685399d9a67677fd4a630/packages/sdks/oak-curriculum-sdk/src/client/middleware/rate-limit-tracker.ts#L17)

## Methods

### getRequestCount()

> **getRequestCount**(): `number`

Defined in: [sdks/oak-curriculum-sdk/src/client/middleware/rate-limit-tracker.ts:19](https://github.com/oaknational/oak-mcp-ecosystem/blob/75b5bc735a49141f750685399d9a67677fd4a630/packages/sdks/oak-curriculum-sdk/src/client/middleware/rate-limit-tracker.ts#L19)

#### Returns

`number`

---

### getRequestRate()

> **getRequestRate**(): `number`

Defined in: [sdks/oak-curriculum-sdk/src/client/middleware/rate-limit-tracker.ts:20](https://github.com/oaknational/oak-mcp-ecosystem/blob/75b5bc735a49141f750685399d9a67677fd4a630/packages/sdks/oak-curriculum-sdk/src/client/middleware/rate-limit-tracker.ts#L20)

#### Returns

`number`

---

### getStatus()

> **getStatus**(): [`RateLimitInfo`](RateLimitInfo.md)

Defined in: [sdks/oak-curriculum-sdk/src/client/middleware/rate-limit-tracker.ts:18](https://github.com/oaknational/oak-mcp-ecosystem/blob/75b5bc735a49141f750685399d9a67677fd4a630/packages/sdks/oak-curriculum-sdk/src/client/middleware/rate-limit-tracker.ts#L18)

#### Returns

[`RateLimitInfo`](RateLimitInfo.md)

---

### reset()

> **reset**(): `void`

Defined in: [sdks/oak-curriculum-sdk/src/client/middleware/rate-limit-tracker.ts:21](https://github.com/oaknational/oak-mcp-ecosystem/blob/75b5bc735a49141f750685399d9a67677fd4a630/packages/sdks/oak-curriculum-sdk/src/client/middleware/rate-limit-tracker.ts#L21)

#### Returns

`void`
