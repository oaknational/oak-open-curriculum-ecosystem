[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../README.md) / [index](../README.md) / RateLimitTracker

# Interface: RateLimitTracker

Defined in: [packages/sdks/oak-curriculum-sdk/src/client/middleware/rate-limit-tracker.ts:17](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/client/middleware/rate-limit-tracker.ts#L17)

## Methods

### getRequestCount()

> **getRequestCount**(): `number`

Defined in: [packages/sdks/oak-curriculum-sdk/src/client/middleware/rate-limit-tracker.ts:19](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/client/middleware/rate-limit-tracker.ts#L19)

#### Returns

`number`

---

### getRequestRate()

> **getRequestRate**(): `number`

Defined in: [packages/sdks/oak-curriculum-sdk/src/client/middleware/rate-limit-tracker.ts:20](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/client/middleware/rate-limit-tracker.ts#L20)

#### Returns

`number`

---

### getStatus()

> **getStatus**(): [`RateLimitInfo`](RateLimitInfo.md)

Defined in: [packages/sdks/oak-curriculum-sdk/src/client/middleware/rate-limit-tracker.ts:18](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/client/middleware/rate-limit-tracker.ts#L18)

#### Returns

[`RateLimitInfo`](RateLimitInfo.md)

---

### reset()

> **reset**(): `void`

Defined in: [packages/sdks/oak-curriculum-sdk/src/client/middleware/rate-limit-tracker.ts:21](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/client/middleware/rate-limit-tracker.ts#L21)

#### Returns

`void`
