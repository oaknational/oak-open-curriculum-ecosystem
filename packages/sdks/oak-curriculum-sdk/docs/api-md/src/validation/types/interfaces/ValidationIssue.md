[**@oaknational/curriculum-sdk v0.8.0**](../../../../README.md)

---

[@oaknational/curriculum-sdk](../../../../README.md) / [src/validation/types](../README.md) / ValidationIssue

# Interface: ValidationIssue

Defined in: [sdks/oak-curriculum-sdk/src/validation/types.ts:34](https://github.com/oaknational/oak-mcp-ecosystem/blob/75b5bc735a49141f750685399d9a67677fd4a630/packages/sdks/oak-curriculum-sdk/src/validation/types.ts#L34)

## Properties

### code?

> `optional` **code**: `"invalid_type"` \| `"too_big"` \| `"too_small"` \| `"invalid_format"` \| `"not_multiple_of"` \| `"unrecognized_keys"` \| `"invalid_union"` \| `"invalid_key"` \| `"invalid_element"` \| `"invalid_value"` \| `"custom"` \| `"VALIDATION_ERROR"` \| `"UNKNOWN_OPERATION"` \| `"NO_SCHEMA_FOR_STATUS"`

Defined in: [sdks/oak-curriculum-sdk/src/validation/types.ts:37](https://github.com/oaknational/oak-mcp-ecosystem/blob/75b5bc735a49141f750685399d9a67677fd4a630/packages/sdks/oak-curriculum-sdk/src/validation/types.ts#L37)

---

### details?

> `optional` **details**: `object`

Defined in: [sdks/oak-curriculum-sdk/src/validation/types.ts:38](https://github.com/oaknational/oak-mcp-ecosystem/blob/75b5bc735a49141f750685399d9a67677fd4a630/packages/sdks/oak-curriculum-sdk/src/validation/types.ts#L38)

#### expected?

> `optional` **expected**: `string`

#### received?

> `optional` **received**: `string`

---

### message?

> `optional` **message**: `string`

Defined in: [sdks/oak-curriculum-sdk/src/validation/types.ts:36](https://github.com/oaknational/oak-mcp-ecosystem/blob/75b5bc735a49141f750685399d9a67677fd4a630/packages/sdks/oak-curriculum-sdk/src/validation/types.ts#L36)

---

### path

> **path**: readonly (`string` \| `number`)[]

Defined in: [sdks/oak-curriculum-sdk/src/validation/types.ts:35](https://github.com/oaknational/oak-mcp-ecosystem/blob/75b5bc735a49141f750685399d9a67677fd4a630/packages/sdks/oak-curriculum-sdk/src/validation/types.ts#L35)
