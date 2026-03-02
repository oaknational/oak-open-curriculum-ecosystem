[**@oaknational/curriculum-sdk v0.8.0**](../../README.md)

---

[@oaknational/curriculum-sdk](../../README.md) / [src](../README.md) / classifyHttpError

# Function: classifyHttpError()

> **classifyHttpError**(`status`, `resource`, `resourceType`, `message`): [`SdkFetchError`](../type-aliases/SdkFetchError.md)

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/error-types/sdk-error-types.d.ts:97

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
