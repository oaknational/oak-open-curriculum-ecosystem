[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../../README.md)

***

[@oaknational/oak-curriculum-sdk](../../../../README.md) / [types/generated/search](../README.md) / SearchFacetsSchema

# Variable: SearchFacetsSchema

> `const` **SearchFacetsSchema**: `ZodObject`\<\{ `sequences`: `ZodDefault`\<`ZodArray`\<`ZodObject`\<\{ `hasKs4Options`: `ZodBoolean`; `keyStage`: `ZodEnum`\<\{ `ks1`: `"ks1"`; `ks2`: `"ks2"`; `ks3`: `"ks3"`; `ks4`: `"ks4"`; \}\>; `keyStageTitle`: `ZodOptional`\<`ZodString`\>; `lessonCount`: `ZodNumber`; `phaseSlug`: `ZodString`; `phaseTitle`: `ZodString`; `sequenceSlug`: `ZodString`; `sequenceUrl`: `ZodOptional`\<`ZodString`\>; `subjectSlug`: `ZodEnum`\<\{ `art`: `"art"`; `citizenship`: `"citizenship"`; `computing`: `"computing"`; `cooking-nutrition`: `"cooking-nutrition"`; `design-technology`: `"design-technology"`; `english`: `"english"`; `french`: `"french"`; `geography`: `"geography"`; `german`: `"german"`; `history`: `"history"`; `maths`: `"maths"`; `music`: `"music"`; `physical-education`: `"physical-education"`; `religious-education`: `"religious-education"`; `rshe-pshe`: `"rshe-pshe"`; `science`: `"science"`; `spanish`: `"spanish"`; \}\>; `unitCount`: `ZodNumber`; `units`: `ZodDefault`\<`ZodArray`\<`ZodObject`\<\{ `unitSlug`: `ZodString`; `unitTitle`: `ZodString`; \}, `$strip`\>\>\>; `years`: `ZodDefault`\<`ZodArray`\<`ZodString`\>\>; \}, `$strip`\>\>\>; \}, `$strip`\>

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/zod/search/output/sequence-facets.ts:33](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/zod/search/output/sequence-facets.ts#L33)

Facet collection returned by the hybrid search endpoints.
