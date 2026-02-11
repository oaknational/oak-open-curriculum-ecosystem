[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../../../README.md)

***

[@oaknational/oak-curriculum-sdk](../../../../../README.md) / [types/generated/api-schema/path-parameters](../README.md) / ValidPathAndParameters

# Type Alias: ValidPathAndParameters\<K\>

> **ValidPathAndParameters**\<`K`\> = `{ [P in ValidPath as P extends keyof paths ? P : never]?: ValidParameterCombination<P, K> }`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/path-parameters.ts:252](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/path-parameters.ts#L252)

## Type Parameters

### K

`K` *extends* [`PathGroupingKeys`](PathGroupingKeys.md)
