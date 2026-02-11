[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../../README.md)

***

[@oaknational/oak-curriculum-sdk](../../../../README.md) / [types/generated/search](../README.md) / createSearchLessonsResponse

# Function: createSearchLessonsResponse()

> **createSearchLessonsResponse**(`overrides`): `object`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/search/fixtures.ts:54](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/search/fixtures.ts#L54)

Create a structured lessons response fixture with defaults and validation.

## Parameters

### overrides

`Partial`\<`Omit`\<[`SearchLessonsResponse`](../responses.lessons/type-aliases/SearchLessonsResponse.md), `"scope"`\>\> = `{}`

## Returns

`object`

### aggregations

> **aggregations**: `Record`\<`string`, `unknown`\> = `AggregationsSchema`

### facets

> **facets**: \{ `sequences`: `object`[]; \} \| `null`

### results

> **results**: `object`[]

### scope

> **scope**: `"lessons"`

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
