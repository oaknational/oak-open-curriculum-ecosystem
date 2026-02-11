[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../../README.md) / [types/search-response-guards](../README.md) / sequenceUnitsSchema

# Variable: sequenceUnitsSchema

> `const` **sequenceUnitsSchema**: `ZodArray`\<`ZodUnion`\<readonly \[`ZodObject`\<\{ `canonicalUrl`: `ZodOptional`\<`ZodString`\>; `title`: `ZodOptional`\<`ZodString`\>; `units`: `ZodArray`\<`ZodUnion`\<readonly \[`ZodObject`\<\{ `categories`: `ZodOptional`\<...\>; `threads`: `ZodOptional`\<...\>; `unitOptions`: `ZodArray`\<...\>; `unitOrder`: `ZodNumber`; `unitTitle`: `ZodString`; \}, `$strict`\>, `ZodObject`\<\{ `categories`: `ZodOptional`\<...\>; `threads`: `ZodOptional`\<...\>; `unitOrder`: `ZodNumber`; `unitSlug`: `ZodString`; `unitTitle`: `ZodString`; \}, `$strict`\>\]\>\>; `year`: `ZodUnion`\<readonly \[`ZodNumber`, `ZodString`\]\>; \}, `$strict`\>, `ZodObject`\<\{ `canonicalUrl`: `ZodOptional`\<`ZodString`\>; `examSubjects`: `ZodArray`\<`ZodUnion`\<readonly \[`ZodObject`\<\{ `examSubjectSlug`: `ZodOptional`\<...\>; `examSubjectTitle`: `ZodString`; `tiers`: `ZodArray`\<...\>; \}, `$strict`\>, `ZodObject`\<\{ `examSubjectSlug`: `ZodOptional`\<...\>; `examSubjectTitle`: `ZodString`; `units`: `ZodArray`\<...\>; \}, `$strict`\>\]\>\>; `title`: `ZodOptional`\<`ZodString`\>; `year`: `ZodNumber`; \}, `$strict`\>, `ZodObject`\<\{ `canonicalUrl`: `ZodOptional`\<`ZodString`\>; `tiers`: `ZodArray`\<`ZodObject`\<\{ `tierSlug`: `ZodString`; `tierTitle`: `ZodString`; `units`: `ZodArray`\<`ZodUnion`\<readonly \[..., ...\]\>\>; \}, `$strict`\>\>; `title`: `ZodOptional`\<`ZodString`\>; `year`: `ZodNumber`; \}, `$strict`\>\]\>\> = `rawCurriculumSchemas.SequenceUnitsResponseSchema`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/search-response-guards.ts:20](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/search-response-guards.ts#L20)

Schema for sequence units response derived from the OpenAPI specification.
