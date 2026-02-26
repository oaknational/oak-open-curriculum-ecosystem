[**@oaknational/curriculum-sdk v0.8.0**](../../README.md)

---

[@oaknational/curriculum-sdk](../../README.md) / [src](../README.md) / classifyException

# Function: classifyException()

> **classifyException**(`error`, `resource`, `resourceType`): [`SdkFetchError`](../type-aliases/SdkFetchError.md)

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/error-types/sdk-error-types.d.ts:105

Classify a caught exception into a typed error.

## Parameters

### error

`unknown`

The caught error

### resource

`string`

Resource identifier (slug)

### resourceType

[`ResourceType`](../type-aliases/ResourceType.md)

Type of resource being fetched

## Returns

[`SdkFetchError`](../type-aliases/SdkFetchError.md)
