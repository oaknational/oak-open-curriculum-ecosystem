[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../../README.md)

***

[@oaknational/oak-curriculum-sdk](../../../../README.md) / [types/generated/search](../README.md) / SearchNaturalLanguageRequestSchema

# Variable: SearchNaturalLanguageRequestSchema

> `const` **SearchNaturalLanguageRequestSchema**: `ZodObject`\<\{ `includeFacets`: `ZodOptional`\<`ZodBoolean`\>; `keyStage`: `ZodOptional`\<`ZodEnum`\<\{ `ks1`: `"ks1"`; `ks2`: `"ks2"`; `ks3`: `"ks3"`; `ks4`: `"ks4"`; \}\>\>; `minLessons`: `ZodOptional`\<`ZodNumber`\>; `phaseSlug`: `ZodOptional`\<`ZodString`\>; `q`: `ZodString`; `scope`: `ZodOptional`\<`ZodEnum`\<\{ `all`: `"all"`; `lessons`: `"lessons"`; `sequences`: `"sequences"`; `units`: `"units"`; \}\>\>; `size`: `ZodOptional`\<`ZodNumber`\>; `subject`: `ZodOptional`\<`ZodEnum`\<\{ `art`: `"art"`; `citizenship`: `"citizenship"`; `computing`: `"computing"`; `cooking-nutrition`: `"cooking-nutrition"`; `design-technology`: `"design-technology"`; `english`: `"english"`; `french`: `"french"`; `geography`: `"geography"`; `german`: `"german"`; `history`: `"history"`; `maths`: `"maths"`; `music`: `"music"`; `physical-education`: `"physical-education"`; `religious-education`: `"religious-education"`; `rshe-pshe`: `"rshe-pshe"`; `science`: `"science"`; `spanish`: `"spanish"`; \}\>\>; \}, `$strict`\>

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/search/natural-requests.ts:12](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/search/natural-requests.ts#L12)

Zod schema describing the natural language search body.
