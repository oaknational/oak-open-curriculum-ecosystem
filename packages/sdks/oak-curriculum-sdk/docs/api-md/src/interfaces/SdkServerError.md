[**@oaknational/curriculum-sdk v0.8.0**](../../README.md)

---

[@oaknational/curriculum-sdk](../../README.md) / [src](../README.md) / SdkServerError

# Interface: SdkServerError

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/error-types/sdk-error-types.d.ts:53

Server-side error (HTTP 500, 502, 503, 504).
May be transient - caller can decide whether to retry or skip.

## Properties

### kind

> `readonly` **kind**: `"server_error"`

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/error-types/sdk-error-types.d.ts:54

---

### message

> `readonly` **message**: `string`

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/error-types/sdk-error-types.d.ts:57

---

### resource

> `readonly` **resource**: `string`

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/error-types/sdk-error-types.d.ts:56

---

### status

> `readonly` **status**: [`ServerErrorStatus`](../type-aliases/ServerErrorStatus.md)

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/error-types/sdk-error-types.d.ts:55
