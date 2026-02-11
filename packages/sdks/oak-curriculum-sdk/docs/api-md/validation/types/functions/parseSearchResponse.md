[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../../README.md) / [validation/types](../README.md) / parseSearchResponse

# Function: parseSearchResponse()

## Call Signature

> **parseSearchResponse**(`scope`, `data`): [`ValidationResult`](../type-aliases/ValidationResult.md)\<\{ `buckets`: `object`[]; `scope`: `"all"`; `suggestionCache`: \{ `ttlSeconds`: `number`; `version`: `string`; \}; `suggestions?`: `object`[]; \}\>

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/validation/types.ts:219

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

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/validation/types.ts:223

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

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/validation/types.ts:227

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

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/validation/types.ts:231

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

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/validation/types.ts:235

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
