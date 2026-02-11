[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../../../README.md)

***

[@oaknational/oak-curriculum-sdk](../../../../../README.md) / [types/generated/api-schema/path-parameters](../README.md) / ValidPathAndParameters

# Type Alias: ValidPathAndParameters\<K\>

> **ValidPathAndParameters**\<`K`\> = `{ [P in ValidPath as P extends keyof paths ? P : never]?: ValidParameterCombination<P, K> }`

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc\_src/types/generated/api-schema/path-parameters.ts:253

## Type Parameters

### K

`K` *extends* [`PathGroupingKeys`](PathGroupingKeys.md)
