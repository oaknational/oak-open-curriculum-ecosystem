[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../../../README.md)

***

[@oaknational/oak-curriculum-sdk](../../../../../README.md) / [types/generated/api-schema/path-parameters](../README.md) / PathParameterValues

# Type Alias: PathParameterValues

> **PathParameterValues** = `{ [K in keyof typeof PATH_PARAMETERS as typeof PATH_PARAMETERS[K] extends readonly unknown[] ? K : never]: typeof PATH_PARAMETERS[K] extends readonly unknown[] ? typeof PATH_PARAMETERS[K][number] : never }`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/path-parameters.ts:198](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/path-parameters.ts#L198)

Type for path parameter values
