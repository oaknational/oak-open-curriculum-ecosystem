[**@oaknational/curriculum-sdk v0.8.0**](../../README.md)

---

[@oaknational/curriculum-sdk](../../README.md) / [src](../README.md) / validateRequest

# Function: validateRequest()

> **validateRequest**\<`P`\>(`path`, `method`, `args`): [`ValidationResult`](../validation/types/type-aliases/ValidationResult.md)\<`unknown`\>

Defined in: [sdks/oak-curriculum-sdk/src/validation/request-validators.ts:79](https://github.com/oaknational/oak-mcp-ecosystem/blob/75b5bc735a49141f750685399d9a67677fd4a630/packages/sdks/oak-curriculum-sdk/src/validation/request-validators.ts#L79)

Validates request parameters against the schema for the given path and method
Uses generated schemas from the endpoints file

## Type Parameters

### P

`P` _extends_ keyof [`paths`](../interfaces/paths.md)

## Parameters

### path

`P`

The API path (e.g., "/lessons/{lesson}/transcript")

### method

`AllowedMethodsForPath`\<`P`\>

The HTTP method

### args

`unknown`

The request parameters to validate

## Returns

[`ValidationResult`](../validation/types/type-aliases/ValidationResult.md)\<`unknown`\>

Validation result with success/failure status

## Remarks

consider if we can further narrow the return type
