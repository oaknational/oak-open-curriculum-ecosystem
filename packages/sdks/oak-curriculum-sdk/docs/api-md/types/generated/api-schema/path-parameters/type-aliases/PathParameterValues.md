[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../../../README.md)

***

[@oaknational/oak-curriculum-sdk](../../../../../README.md) / [types/generated/api-schema/path-parameters](../README.md) / PathParameterValues

# Type Alias: PathParameterValues

> **PathParameterValues** = `{ [K in keyof typeof PATH_PARAMETERS as typeof PATH_PARAMETERS[K] extends readonly unknown[] ? K : never]: typeof PATH_PARAMETERS[K] extends readonly unknown[] ? typeof PATH_PARAMETERS[K][number] : never }`

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc\_src/types/generated/api-schema/path-parameters.ts:199

Type for path parameter values
