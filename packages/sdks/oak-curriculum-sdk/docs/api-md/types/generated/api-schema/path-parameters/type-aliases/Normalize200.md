[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../../../README.md)

***

[@oaknational/oak-curriculum-sdk](../../../../../README.md) / [types/generated/api-schema/path-parameters](../README.md) / Normalize200

# Type Alias: Normalize200\<R\>

> **Normalize200**\<`R`\> = `200` *extends* keyof `R` ? `R` & `object` : `"200"` *extends* keyof `R` ? `Omit`\<`R`, `"200"`\> & `object` : `never`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/path-parameters.ts:87](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/path-parameters.ts#L87)

## Type Parameters

### R

`R`
