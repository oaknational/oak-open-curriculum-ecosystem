[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../README.md) / [index](../README.md) / isRecoverableError

# Function: isRecoverableError()

> **isRecoverableError**(`error`): `boolean`

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/types/generated/api-schema/error-types/sdk-error-types.ts:163

Type guard to check if error is recoverable (should skip, not crash).
404 and 5xx errors are recoverable in ingestion context.

## Parameters

### error

[`SdkFetchError`](../type-aliases/SdkFetchError.md)

## Returns

`boolean`
