[**@oaknational/curriculum-sdk v0.8.0**](../../../../README.md)

---

[@oaknational/curriculum-sdk](../../../../README.md) / [src/types/search-response-guards](../README.md) / subjectSequencesSchema

# Variable: subjectSequencesSchema

> `const` **subjectSequencesSchema**: `ZodArray`\<`ZodObject`\<\{ `canonicalUrl`: `ZodOptional`\<`ZodString`\>; `keyStages`: `ZodArray`\<`ZodObject`\<\{ `keyStageSlug`: `ZodString`; `keyStageTitle`: `ZodString`; \}, `$strict`\>\>; `ks4Options`: `ZodUnion`\<readonly \[`ZodObject`\<\{ `slug`: `ZodString`; `title`: `ZodString`; \}, `$strict`\>, `ZodNull`\]\>; `phaseSlug`: `ZodString`; `phaseTitle`: `ZodString`; `sequenceSlug`: `ZodString`; `years`: `ZodArray`\<`ZodNumber`\>; \}, `$strict`\>\> = `rawCurriculumSchemas.SubjectSequenceResponseSchema`

Defined in: [sdks/oak-curriculum-sdk/src/types/search-response-guards.ts:17](https://github.com/oaknational/oak-mcp-ecosystem/blob/75b5bc735a49141f750685399d9a67677fd4a630/packages/sdks/oak-curriculum-sdk/src/types/search-response-guards.ts#L17)

Schema for subject sequences derived from the OpenAPI specification.
