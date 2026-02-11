[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../../README.md)

***

[@oaknational/oak-curriculum-sdk](../../../../README.md) / [types/generated/search](../README.md) / SearchMultiScopeBucket

# Interface: SearchMultiScopeBucket

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc\_src/types/generated/search/responses.multi.ts:42

Bucket entry combining scope identifier with its typed result set.

## Properties

### result

> **result**: \{ `aggregations`: `Record`\<`string`, `unknown`\>; `facets`: \{ `sequences`: `object`[]; \} \| `null`; `results`: `object`[]; `scope`: `"lessons"`; `suggestionCache`: \{ `ttlSeconds`: `number`; `version`: `string`; \}; `suggestions?`: `object`[]; `timedOut`: `boolean`; `took`: `number`; `total`: `number`; \} \| \{ `aggregations`: `Record`\<`string`, `unknown`\>; `facets`: \{ `sequences`: `object`[]; \} \| `null`; `results`: `object`[]; `scope`: `"units"`; `suggestionCache`: \{ `ttlSeconds`: `number`; `version`: `string`; \}; `suggestions?`: `object`[]; `timedOut`: `boolean`; `took`: `number`; `total`: `number`; \} \| \{ `aggregations`: `Record`\<`string`, `unknown`\>; `facets`: \{ `sequences`: `object`[]; \} \| `null`; `results`: `object`[]; `scope`: `"sequences"`; `suggestionCache`: \{ `ttlSeconds`: `number`; `version`: `string`; \}; `suggestions?`: `object`[]; `timedOut`: `boolean`; `took`: `number`; `total`: `number`; \}

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc\_src/types/generated/search/responses.multi.ts:44

***

### scope

> **scope**: `"lessons"` \| `"units"` \| `"sequences"`

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc\_src/types/generated/search/responses.multi.ts:43
