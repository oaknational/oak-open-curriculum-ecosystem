[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../README.md) / [index](../README.md) / SdkServerError

# Interface: SdkServerError

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/types/generated/api-schema/error-types/sdk-error-types.ts:43

Server-side error (HTTP 500, 502, 503, 504).
May be transient - caller can decide whether to retry or skip.

## Properties

### kind

> `readonly` **kind**: `"server_error"`

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/types/generated/api-schema/error-types/sdk-error-types.ts:44

---

### message

> `readonly` **message**: `string`

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/types/generated/api-schema/error-types/sdk-error-types.ts:47

---

### resource

> `readonly` **resource**: `string`

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/types/generated/api-schema/error-types/sdk-error-types.ts:46

---

### status

> `readonly` **status**: [`ServerErrorStatus`](../type-aliases/ServerErrorStatus.md)

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/types/generated/api-schema/error-types/sdk-error-types.ts:45
