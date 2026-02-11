[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../README.md) / [index](../README.md) / validateRequest

# Function: validateRequest()

> **validateRequest**\<`P`\>(`path`, `method`, `args`): [`ValidationResult`](../../validation/types/type-aliases/ValidationResult.md)\<`unknown`\>

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/validation/request-validators.ts:79

Validates request parameters against the schema for the given path and method
Uses generated schemas from the endpoints file

## Type Parameters

### P

`P` _extends_ keyof [`paths`](../../types/generated/api-schema/api-paths-types/interfaces/paths.md)

## Parameters

### path

`P`

The API path (e.g., "/lessons/{lesson}/transcript")

### method

[`AllowedMethodsForPath`](../../types/generated/api-schema/path-parameters/type-aliases/AllowedMethodsForPath.md)\<`P`\>

The HTTP method

### args

`unknown`

The request parameters to validate

## Returns

[`ValidationResult`](../../validation/types/type-aliases/ValidationResult.md)\<`unknown`\>

Validation result with success/failure status

## Remarks

consider if we can further narrow the return type
