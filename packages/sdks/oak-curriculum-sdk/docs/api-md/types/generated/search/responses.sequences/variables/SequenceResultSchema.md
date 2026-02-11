[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../../../README.md)

***

[@oaknational/oak-curriculum-sdk](../../../../../README.md) / [types/generated/search/responses.sequences](../README.md) / SequenceResultSchema

# Variable: SequenceResultSchema

> `const` **SequenceResultSchema**: `ZodObject`\<\{ `highlights`: `ZodDefault`\<`ZodArray`\<`ZodString`\>\>; `id`: `ZodString`; `sequence`: `ZodOptional`\<`ZodObject`\<\{ `phase_slug`: `ZodOptional`\<`ZodString`\>; `sequence_title`: `ZodOptional`\<`ZodString`\>; `sequence_url`: `ZodOptional`\<`ZodString`\>; `subject_slug`: `ZodOptional`\<`ZodString`\>; \}, `$strict`\>\>; \}, `$strict`\>

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/search/responses.sequences.ts:24](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/search/responses.sequences.ts#L24)

Schema describing an individual sequence search result entry.
