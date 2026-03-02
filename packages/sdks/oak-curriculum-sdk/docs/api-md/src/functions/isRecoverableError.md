[**@oaknational/curriculum-sdk v0.8.0**](../../README.md)

---

[@oaknational/curriculum-sdk](../../README.md) / [src](../README.md) / isRecoverableError

# Function: isRecoverableError()

> **isRecoverableError**(`error`): `boolean`

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/error-types/sdk-error-types.d.ts:114

Type guard to check if error is recoverable (should skip, not crash).
404, 451, and 5xx errors are recoverable in ingestion context.

## Parameters

### error

[`SdkFetchError`](../type-aliases/SdkFetchError.md)

## Returns

`boolean`
