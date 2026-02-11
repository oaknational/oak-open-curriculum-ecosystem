[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../../README.md) / [validation/types](../README.md) / ValidationIssue

# Interface: ValidationIssue

Defined in: [packages/sdks/oak-curriculum-sdk/src/validation/types.ts:34](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/validation/types.ts#L34)

## Properties

### code?

> `optional` **code**: `"custom"` \| `"invalid_type"` \| `"unrecognized_keys"` \| `"invalid_union"` \| `"too_big"` \| `"too_small"` \| `"invalid_format"` \| `"not_multiple_of"` \| `"invalid_key"` \| `"invalid_element"` \| `"invalid_value"` \| `"VALIDATION_ERROR"` \| `"UNKNOWN_OPERATION"` \| `"NO_SCHEMA_FOR_STATUS"`

Defined in: [packages/sdks/oak-curriculum-sdk/src/validation/types.ts:37](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/validation/types.ts#L37)

---

### details?

> `optional` **details**: `object`

Defined in: [packages/sdks/oak-curriculum-sdk/src/validation/types.ts:38](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/validation/types.ts#L38)

#### expected?

> `optional` **expected**: `string`

#### received?

> `optional` **received**: `string`

---

### message?

> `optional` **message**: `string`

Defined in: [packages/sdks/oak-curriculum-sdk/src/validation/types.ts:36](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/validation/types.ts#L36)

---

### path

> **path**: readonly (`string` \| `number`)[]

Defined in: [packages/sdks/oak-curriculum-sdk/src/validation/types.ts:35](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/validation/types.ts#L35)
