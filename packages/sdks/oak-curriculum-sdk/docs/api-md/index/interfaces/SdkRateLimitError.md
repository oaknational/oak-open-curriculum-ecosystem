[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../README.md) / [index](../README.md) / SdkRateLimitError

# Interface: SdkRateLimitError

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/error-types/sdk-error-types.ts:57](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/error-types/sdk-error-types.ts#L57)

Rate limit exceeded (HTTP 429).
Caller should wait before retrying.

## Properties

### kind

> `readonly` **kind**: `"rate_limited"`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/error-types/sdk-error-types.ts:58](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/error-types/sdk-error-types.ts#L58)

---

### resource

> `readonly` **resource**: `string`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/error-types/sdk-error-types.ts:59](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/error-types/sdk-error-types.ts#L59)

---

### retryAfterMs

> `readonly` **retryAfterMs**: `number`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/error-types/sdk-error-types.ts:60](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/error-types/sdk-error-types.ts#L60)
