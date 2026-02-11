[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../README.md) / [index](../README.md) / SdkServerError

# Interface: SdkServerError

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/error-types/sdk-error-types.ts:43](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/error-types/sdk-error-types.ts#L43)

Server-side error (HTTP 500, 502, 503, 504).
May be transient - caller can decide whether to retry or skip.

## Properties

### kind

> `readonly` **kind**: `"server_error"`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/error-types/sdk-error-types.ts:44](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/error-types/sdk-error-types.ts#L44)

---

### message

> `readonly` **message**: `string`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/error-types/sdk-error-types.ts:47](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/error-types/sdk-error-types.ts#L47)

---

### resource

> `readonly` **resource**: `string`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/error-types/sdk-error-types.ts:46](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/error-types/sdk-error-types.ts#L46)

---

### status

> `readonly` **status**: [`ServerErrorStatus`](../type-aliases/ServerErrorStatus.md)

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/error-types/sdk-error-types.ts:45](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/error-types/sdk-error-types.ts#L45)
