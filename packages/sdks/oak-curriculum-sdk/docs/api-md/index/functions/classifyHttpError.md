[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../README.md) / [index](../README.md) / classifyHttpError

# Function: classifyHttpError()

> **classifyHttpError**(`status`, `resource`, `resourceType`, `message`): [`SdkFetchError`](../type-aliases/SdkFetchError.md)

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/types/generated/api-schema/error-types/sdk-error-types.ts:92

Classify an HTTP response status into a typed error.

## Parameters

### status

`number`

HTTP status code

### resource

`string`

Resource identifier (slug)

### resourceType

[`ResourceType`](../type-aliases/ResourceType.md)

Type of resource being fetched

### message

`string`

Error message from response

## Returns

[`SdkFetchError`](../type-aliases/SdkFetchError.md)
