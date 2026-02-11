[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../../README.md)

***

[@oaknational/oak-curriculum-sdk](../../../../README.md) / [types/generated/search](../README.md) / createSearchUnitsResponse

# Function: createSearchUnitsResponse()

> **createSearchUnitsResponse**(`overrides`): `object`

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc\_src/types/generated/search/fixtures.ts:79

Create a structured units response fixture with defaults and validation.

## Parameters

### overrides

`Partial`\<`Omit`\<[`SearchUnitsResponse`](../responses.units/type-aliases/SearchUnitsResponse.md), `"scope"`\>\> = `{}`

## Returns

`object`

### aggregations

> **aggregations**: `Record`\<`string`, `unknown`\> = `AggregationsSchema`

### facets

> **facets**: \{ `sequences`: `object`[]; \} \| `null`

### results

> **results**: `object`[]

### scope

> **scope**: `"units"`

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
