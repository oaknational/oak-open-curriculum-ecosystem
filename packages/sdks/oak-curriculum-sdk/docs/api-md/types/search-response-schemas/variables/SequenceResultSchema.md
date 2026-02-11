[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../../README.md) / [types/search-response-schemas](../README.md) / SequenceResultSchema

# Variable: SequenceResultSchema

> `const` **SequenceResultSchema**: `ZodObject`\<\{ `highlights`: `ZodDefault`\<`ZodArray`\<`ZodString`\>\>; `id`: `ZodString`; `sequence`: `ZodOptional`\<`ZodObject`\<\{ `phase_slug`: `ZodOptional`\<`ZodString`\>; `sequence_title`: `ZodOptional`\<`ZodString`\>; `sequence_url`: `ZodOptional`\<`ZodString`\>; `subject_slug`: `ZodOptional`\<`ZodString`\>; \}, `$strict`\>\>; \}, `$strict`\> = `GeneratedSequenceResultSchema`

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/types/search-response-schemas.ts:28

Schema describing an individual sequence search result entry.
