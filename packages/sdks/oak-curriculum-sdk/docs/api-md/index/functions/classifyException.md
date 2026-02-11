[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../README.md) / [index](../README.md) / classifyException

# Function: classifyException()

> **classifyException**(`error`, `resource`, `resourceType`): [`SdkFetchError`](../type-aliases/SdkFetchError.md)

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/types/generated/api-schema/error-types/sdk-error-types.ts:118

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
