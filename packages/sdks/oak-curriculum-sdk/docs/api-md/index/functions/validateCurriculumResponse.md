[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../README.md) / [index](../README.md) / validateCurriculumResponse

# Function: validateCurriculumResponse()

## Call Signature

> **validateCurriculumResponse**(`path`, `method`, `statusCode`, `response`): [`ValidationResult`](../../validation/types/type-aliases/ValidationResult.md)\<`unknown`\>

Defined in: [packages/sdks/oak-curriculum-sdk/src/validation/curriculum-response-validators.ts:87](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/validation/curriculum-response-validators.ts#L87)

Validates response data for an API operation

### Parameters

#### path

`string`

The API path template (e.g., '/lessons/{lesson}/transcript')

#### method

`string`

The HTTP method

#### statusCode

`number`

The HTTP response status code

#### response

`unknown`

The response data to validate

### Returns

[`ValidationResult`](../../validation/types/type-aliases/ValidationResult.md)\<`unknown`\>

ValidationResult with validated response or validation issues

### Remarks

Only the 200 responses are defined in the original OpenAPI schema, hence the overloads with unknown types

## Call Signature

> **validateCurriculumResponse**\<`P`, `M`\>(`path`, `method`, `statusCode`, `response`): [`ValidationResult`](../../validation/types/type-aliases/ValidationResult.md)\<[`JsonBody200`](../../types/generated/api-schema/path-parameters/type-aliases/JsonBody200.md)\<`P`, `M`\>\>

Defined in: [packages/sdks/oak-curriculum-sdk/src/validation/curriculum-response-validators.ts:93](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/validation/curriculum-response-validators.ts#L93)

Validates response data for an API operation

### Type Parameters

#### P

`P` _extends_ keyof [`paths`](../../types/generated/api-schema/api-paths-types/interfaces/paths.md)

#### M

`M` _extends_ `"get"` \| `"put"` \| `"post"` \| `"delete"` \| `"options"` \| `"head"` \| `"patch"` \| `"trace"`

### Parameters

#### path

`P`

The API path template (e.g., '/lessons/{lesson}/transcript')

#### method

`M`

The HTTP method

#### statusCode

`200`

The HTTP response status code

#### response

`unknown`

The response data to validate

### Returns

[`ValidationResult`](../../validation/types/type-aliases/ValidationResult.md)\<[`JsonBody200`](../../types/generated/api-schema/path-parameters/type-aliases/JsonBody200.md)\<`P`, `M`\>\>

ValidationResult with validated response or validation issues

### Remarks

Only the 200 responses are defined in the original OpenAPI schema, hence the overloads with unknown types

## Call Signature

> **validateCurriculumResponse**\<`P`\>(`path`, `method`, `statusCode`, `response`): [`ValidationResult`](../../validation/types/type-aliases/ValidationResult.md)\<`unknown`\>

Defined in: [packages/sdks/oak-curriculum-sdk/src/validation/curriculum-response-validators.ts:99](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/validation/curriculum-response-validators.ts#L99)

Validates response data for an API operation

### Type Parameters

#### P

`P` _extends_ keyof [`paths`](../../types/generated/api-schema/api-paths-types/interfaces/paths.md)

### Parameters

#### path

`P`

The API path template (e.g., '/lessons/{lesson}/transcript')

#### method

[`AllowedMethodsForPath`](../../types/generated/api-schema/path-parameters/type-aliases/AllowedMethodsForPath.md)\<`P`\>

The HTTP method

#### statusCode

`number`

The HTTP response status code

#### response

`unknown`

The response data to validate

### Returns

[`ValidationResult`](../../validation/types/type-aliases/ValidationResult.md)\<`unknown`\>

ValidationResult with validated response or validation issues

### Remarks

Only the 200 responses are defined in the original OpenAPI schema, hence the overloads with unknown types
