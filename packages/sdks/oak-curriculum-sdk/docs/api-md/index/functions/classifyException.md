[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../README.md) / [index](../README.md) / classifyException

# Function: classifyException()

> **classifyException**(`error`, `resource`, `resourceType`): [`SdkFetchError`](../type-aliases/SdkFetchError.md)

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/error-types/sdk-error-types.ts:118](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/error-types/sdk-error-types.ts#L118)

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
