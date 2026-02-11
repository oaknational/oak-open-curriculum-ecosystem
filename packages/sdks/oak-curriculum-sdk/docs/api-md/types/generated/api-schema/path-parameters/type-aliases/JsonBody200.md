[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../../../README.md)

***

[@oaknational/oak-curriculum-sdk](../../../../../README.md) / [types/generated/api-schema/path-parameters](../README.md) / JsonBody200

# Type Alias: JsonBody200\<P, M\>

> **JsonBody200**\<`P`, `M`\> = [`NormalizedResponsesFor`](NormalizedResponsesFor.md)\<`P`, `M`\> *extends* infer NR ? `NR` *extends* `never` ? `never` : `200` *extends* keyof `NR` ? `"content"` *extends* keyof `NR`\[`200`\] ? `NR`\[`200`\]\[`"content"`\] *extends* infer C ? `"application/json"` *extends* keyof `C` ? `C`\[`"application/json"`\] : `never` : `never` : `never` : `never` : `never`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/path-parameters.ts:95](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/path-parameters.ts#L95)

## Type Parameters

### P

`P` *extends* [`ValidPath`](ValidPath.md)

### M

`M` *extends* [`AllowedMethodsForPath`](AllowedMethodsForPath.md)\<`P`\>
