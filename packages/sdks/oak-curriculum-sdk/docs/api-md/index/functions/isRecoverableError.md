[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../README.md) / [index](../README.md) / isRecoverableError

# Function: isRecoverableError()

> **isRecoverableError**(`error`): `boolean`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/error-types/sdk-error-types.ts:163](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/error-types/sdk-error-types.ts#L163)

Type guard to check if error is recoverable (should skip, not crash).
404 and 5xx errors are recoverable in ingestion context.

## Parameters

### error

[`SdkFetchError`](../type-aliases/SdkFetchError.md)

## Returns

`boolean`
