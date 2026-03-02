[**@oaknational/curriculum-sdk v0.8.0**](../../README.md)

---

[@oaknational/curriculum-sdk](../../README.md) / [src](../README.md) / validateCurriculumResponse

# Function: validateCurriculumResponse()

## Call Signature

> **validateCurriculumResponse**(`path`, `method`, `statusCode`, `response`): [`ValidationResult`](../validation/types/type-aliases/ValidationResult.md)\<`unknown`\>

Defined in: [sdks/oak-curriculum-sdk/src/validation/curriculum-response-validators.ts:87](https://github.com/oaknational/oak-mcp-ecosystem/blob/75b5bc735a49141f750685399d9a67677fd4a630/packages/sdks/oak-curriculum-sdk/src/validation/curriculum-response-validators.ts#L87)

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

[`ValidationResult`](../validation/types/type-aliases/ValidationResult.md)\<`unknown`\>

ValidationResult with validated response or validation issues

### Remarks

Only the 200 responses are defined in the original OpenAPI schema, hence the overloads with unknown types

## Call Signature

> **validateCurriculumResponse**\<`P`, `M`\>(`path`, `method`, `statusCode`, `response`): [`ValidationResult`](../validation/types/type-aliases/ValidationResult.md)\<`JsonBody200`\<`P`, `M`\>\>

Defined in: [sdks/oak-curriculum-sdk/src/validation/curriculum-response-validators.ts:93](https://github.com/oaknational/oak-mcp-ecosystem/blob/75b5bc735a49141f750685399d9a67677fd4a630/packages/sdks/oak-curriculum-sdk/src/validation/curriculum-response-validators.ts#L93)

Validates response data for an API operation

### Type Parameters

#### P

`P` _extends_ keyof [`paths`](../interfaces/paths.md)

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

[`ValidationResult`](../validation/types/type-aliases/ValidationResult.md)\<`JsonBody200`\<`P`, `M`\>\>

ValidationResult with validated response or validation issues

### Remarks

Only the 200 responses are defined in the original OpenAPI schema, hence the overloads with unknown types

## Call Signature

> **validateCurriculumResponse**\<`P`\>(`path`, `method`, `statusCode`, `response`): [`ValidationResult`](../validation/types/type-aliases/ValidationResult.md)\<`unknown`\>

Defined in: [sdks/oak-curriculum-sdk/src/validation/curriculum-response-validators.ts:99](https://github.com/oaknational/oak-mcp-ecosystem/blob/75b5bc735a49141f750685399d9a67677fd4a630/packages/sdks/oak-curriculum-sdk/src/validation/curriculum-response-validators.ts#L99)

Validates response data for an API operation

### Type Parameters

#### P

`P` _extends_ keyof [`paths`](../interfaces/paths.md)

### Parameters

#### path

`P`

The API path template (e.g., '/lessons/{lesson}/transcript')

#### method

`AllowedMethodsForPath`\<`P`\>

The HTTP method

#### statusCode

`number`

The HTTP response status code

#### response

`unknown`

The response data to validate

### Returns

[`ValidationResult`](../validation/types/type-aliases/ValidationResult.md)\<`unknown`\>

ValidationResult with validated response or validation issues

### Remarks

Only the 200 responses are defined in the original OpenAPI schema, hence the overloads with unknown types
