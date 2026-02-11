[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../../../README.md)

***

[@oaknational/oak-curriculum-sdk](../../../../../README.md) / [types/generated/api-schema/path-parameters](../README.md) / ResponseForPathAndMethod

# Type Alias: ResponseForPathAndMethod\<P, M\>

> **ResponseForPathAndMethod**\<`P`, `M`\> = [`PathOperation`](PathOperation.md)\[`"path"`\] *extends* `P` ? [`PathOperation`](PathOperation.md)\[`"method"`\] *extends* `M` ? [`PathOperation`](PathOperation.md)\[`"responses"`\] : `never` : `never`

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc\_src/types/generated/api-schema/path-parameters.ts:1755

## Type Parameters

### P

`P` *extends* [`ValidPath`](ValidPath.md)

### M

`M` *extends* [`AllowedMethodsForPath`](AllowedMethodsForPath.md)\<`P`\>
