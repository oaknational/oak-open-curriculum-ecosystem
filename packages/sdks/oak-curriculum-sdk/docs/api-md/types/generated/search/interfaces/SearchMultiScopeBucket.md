[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../../README.md)

***

[@oaknational/oak-curriculum-sdk](../../../../README.md) / [types/generated/search](../README.md) / SearchMultiScopeBucket

# Interface: SearchMultiScopeBucket

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/search/responses.multi.ts:42](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/search/responses.multi.ts#L42)

Bucket entry combining scope identifier with its typed result set.

## Properties

### result

> **result**: \{ `aggregations`: `Record`\<`string`, `unknown`\>; `facets`: \{ `sequences`: `object`[]; \} \| `null`; `results`: `object`[]; `scope`: `"lessons"`; `suggestionCache`: \{ `ttlSeconds`: `number`; `version`: `string`; \}; `suggestions?`: `object`[]; `timedOut`: `boolean`; `took`: `number`; `total`: `number`; \} \| \{ `aggregations`: `Record`\<`string`, `unknown`\>; `facets`: \{ `sequences`: `object`[]; \} \| `null`; `results`: `object`[]; `scope`: `"units"`; `suggestionCache`: \{ `ttlSeconds`: `number`; `version`: `string`; \}; `suggestions?`: `object`[]; `timedOut`: `boolean`; `took`: `number`; `total`: `number`; \} \| \{ `aggregations`: `Record`\<`string`, `unknown`\>; `facets`: \{ `sequences`: `object`[]; \} \| `null`; `results`: `object`[]; `scope`: `"sequences"`; `suggestionCache`: \{ `ttlSeconds`: `number`; `version`: `string`; \}; `suggestions?`: `object`[]; `timedOut`: `boolean`; `took`: `number`; `total`: `number`; \}

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/search/responses.multi.ts:44](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/search/responses.multi.ts#L44)

***

### scope

> **scope**: `"lessons"` \| `"units"` \| `"sequences"`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/search/responses.multi.ts:43](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/search/responses.multi.ts#L43)
