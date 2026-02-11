[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../../README.md)

***

[@oaknational/oak-curriculum-sdk](../../../../README.md) / [types/generated/search](../README.md) / createSearchMultiScopeResponse

# Function: createSearchMultiScopeResponse()

> **createSearchMultiScopeResponse**(`overrides`): `object`

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc\_src/types/generated/search/fixtures.ts:129

Create a multi-scope response fixture with defaults and validation.

## Parameters

### overrides

`Partial`\<`Omit`\<[`SearchMultiScopeResponse`](../type-aliases/SearchMultiScopeResponse.md), `"scope"`\>\> = `{}`

## Returns

`object`

### buckets

> **buckets**: `object`[]

### scope

> **scope**: `"all"`

### suggestionCache

> **suggestionCache**: `object`

#### suggestionCache.ttlSeconds

> **ttlSeconds**: `number`

#### suggestionCache.version

> **version**: `string`

### suggestions?

> `optional` **suggestions**: `object`[]
