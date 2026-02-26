[**@oaknational/curriculum-sdk v0.8.0**](../../README.md)

---

[@oaknational/curriculum-sdk](../../README.md) / [src](../README.md) / SdkRateLimitError

# Interface: SdkRateLimitError

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/error-types/sdk-error-types.d.ts:65

Rate limit exceeded (HTTP 429).
Caller should wait before retrying.

## Properties

### kind

> `readonly` **kind**: `"rate_limited"`

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/error-types/sdk-error-types.d.ts:66

---

### resource

> `readonly` **resource**: `string`

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/error-types/sdk-error-types.d.ts:67

---

### retryAfterMs

> `readonly` **retryAfterMs**: `number`

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/error-types/sdk-error-types.d.ts:68
