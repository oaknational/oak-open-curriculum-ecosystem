[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../../README.md) / [validation/types](../README.md) / parseSearchResponse

# Function: parseSearchResponse()

## Call Signature

> **parseSearchResponse**(`scope`, `data`): [`ValidationResult`](../type-aliases/ValidationResult.md)\<\{ `buckets`: `object`[]; `scope`: `"all"`; `suggestionCache`: \{ `ttlSeconds`: `number`; `version`: `string`; \}; `suggestions?`: `object`[]; \}\>

Defined in: [packages/sdks/oak-curriculum-sdk/src/validation/types.ts:219](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/validation/types.ts#L219)

Parse search response with type-safe overloads for each scope

### Parameters

#### scope

`"all"`

#### data

`unknown`

### Returns

[`ValidationResult`](../type-aliases/ValidationResult.md)\<\{ `buckets`: `object`[]; `scope`: `"all"`; `suggestionCache`: \{ `ttlSeconds`: `number`; `version`: `string`; \}; `suggestions?`: `object`[]; \}\>

## Call Signature

> **parseSearchResponse**(`scope`, `data`): [`ValidationResult`](../type-aliases/ValidationResult.md)\<\{ `aggregations`: `Record`\<`string`, `unknown`\>; `facets`: \{ `sequences`: `object`[]; \} \| `null`; `results`: `object`[]; `scope`: `"lessons"`; `suggestionCache`: \{ `ttlSeconds`: `number`; `version`: `string`; \}; `suggestions?`: `object`[]; `timedOut`: `boolean`; `took`: `number`; `total`: `number`; \}\>

Defined in: [packages/sdks/oak-curriculum-sdk/src/validation/types.ts:223](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/validation/types.ts#L223)

Parse search response with type-safe overloads for each scope

### Parameters

#### scope

`"lessons"`

#### data

`unknown`

### Returns

[`ValidationResult`](../type-aliases/ValidationResult.md)\<\{ `aggregations`: `Record`\<`string`, `unknown`\>; `facets`: \{ `sequences`: `object`[]; \} \| `null`; `results`: `object`[]; `scope`: `"lessons"`; `suggestionCache`: \{ `ttlSeconds`: `number`; `version`: `string`; \}; `suggestions?`: `object`[]; `timedOut`: `boolean`; `took`: `number`; `total`: `number`; \}\>

## Call Signature

> **parseSearchResponse**(`scope`, `data`): [`ValidationResult`](../type-aliases/ValidationResult.md)\<\{ `aggregations`: `Record`\<`string`, `unknown`\>; `facets`: \{ `sequences`: `object`[]; \} \| `null`; `results`: `object`[]; `scope`: `"units"`; `suggestionCache`: \{ `ttlSeconds`: `number`; `version`: `string`; \}; `suggestions?`: `object`[]; `timedOut`: `boolean`; `took`: `number`; `total`: `number`; \}\>

Defined in: [packages/sdks/oak-curriculum-sdk/src/validation/types.ts:227](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/validation/types.ts#L227)

Parse search response with type-safe overloads for each scope

### Parameters

#### scope

`"units"`

#### data

`unknown`

### Returns

[`ValidationResult`](../type-aliases/ValidationResult.md)\<\{ `aggregations`: `Record`\<`string`, `unknown`\>; `facets`: \{ `sequences`: `object`[]; \} \| `null`; `results`: `object`[]; `scope`: `"units"`; `suggestionCache`: \{ `ttlSeconds`: `number`; `version`: `string`; \}; `suggestions?`: `object`[]; `timedOut`: `boolean`; `took`: `number`; `total`: `number`; \}\>

## Call Signature

> **parseSearchResponse**(`scope`, `data`): [`ValidationResult`](../type-aliases/ValidationResult.md)\<\{ `aggregations`: `Record`\<`string`, `unknown`\>; `facets`: \{ `sequences`: `object`[]; \} \| `null`; `results`: `object`[]; `scope`: `"sequences"`; `suggestionCache`: \{ `ttlSeconds`: `number`; `version`: `string`; \}; `suggestions?`: `object`[]; `timedOut`: `boolean`; `took`: `number`; `total`: `number`; \}\>

Defined in: [packages/sdks/oak-curriculum-sdk/src/validation/types.ts:231](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/validation/types.ts#L231)

Parse search response with type-safe overloads for each scope

### Parameters

#### scope

`"sequences"`

#### data

`unknown`

### Returns

[`ValidationResult`](../type-aliases/ValidationResult.md)\<\{ `aggregations`: `Record`\<`string`, `unknown`\>; `facets`: \{ `sequences`: `object`[]; \} \| `null`; `results`: `object`[]; `scope`: `"sequences"`; `suggestionCache`: \{ `ttlSeconds`: `number`; `version`: `string`; \}; `suggestions?`: `object`[]; `timedOut`: `boolean`; `took`: `number`; `total`: `number`; \}\>

## Call Signature

> **parseSearchResponse**\<`Scope`\>(`scope`, `data`): [`ValidationResult`](../type-aliases/ValidationResult.md)\<`output`\<`object`\[`Scope`\]\>\>

Defined in: [packages/sdks/oak-curriculum-sdk/src/validation/types.ts:235](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/validation/types.ts#L235)

Parse search response with type-safe overloads for each scope

### Type Parameters

#### Scope

`Scope` _extends_ `"all"` \| `"lessons"` \| `"units"` \| `"sequences"`

### Parameters

#### scope

`Scope`

#### data

`unknown`

### Returns

[`ValidationResult`](../type-aliases/ValidationResult.md)\<`output`\<`object`\[`Scope`\]\>\>
