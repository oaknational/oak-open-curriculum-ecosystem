[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../../README.md)

***

[@oaknational/oak-curriculum-sdk](../../../../README.md) / [types/generated/search](../README.md) / createSearchSequencesResponse

# Function: createSearchSequencesResponse()

> **createSearchSequencesResponse**(`overrides`): `object`

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc\_src/types/generated/search/fixtures.ts:104

Create a structured sequences response fixture with defaults and validation.

## Parameters

### overrides

`Partial`\<`Omit`\<[`SearchSequencesResponse`](../responses.sequences/type-aliases/SearchSequencesResponse.md), `"scope"`\>\> = `{}`

## Returns

`object`

### aggregations

> **aggregations**: `Record`\<`string`, `unknown`\> = `AggregationsSchema`

### facets

> **facets**: \{ `sequences`: `object`[]; \} \| `null`

### results

> **results**: `object`[]

### scope

> **scope**: `"sequences"`

### suggestionCache

> **suggestionCache**: `object`

#### suggestionCache.ttlSeconds

> **ttlSeconds**: `number`

#### suggestionCache.version

> **version**: `string`

### suggestions?

> `optional` **suggestions**: `object`[]

### timedOut

> **timedOut**: `boolean`

### took

> **took**: `number`

### total

> **total**: `number`
