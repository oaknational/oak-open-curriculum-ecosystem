[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../../../README.md)

***

[@oaknational/oak-curriculum-sdk](../../../../../README.md) / [types/generated/search/parsed-query](../README.md) / SearchParsedQuerySchema

# Variable: SearchParsedQuerySchema

> `const` **SearchParsedQuerySchema**: `ZodObject`\<\{ `intent`: `ZodEnum`\<\{ `lessons`: `"lessons"`; `units`: `"units"`; \}\>; `keyStage`: `ZodOptional`\<`ZodEnum`\<\{ `ks1`: `"ks1"`; `ks2`: `"ks2"`; `ks3`: `"ks3"`; `ks4`: `"ks4"`; \}\>\>; `minLessons`: `ZodOptional`\<`ZodNumber`\>; `subject`: `ZodOptional`\<`ZodEnum`\<\{ `art`: `"art"`; `citizenship`: `"citizenship"`; `computing`: `"computing"`; `cooking-nutrition`: `"cooking-nutrition"`; `design-technology`: `"design-technology"`; `english`: `"english"`; `french`: `"french"`; `geography`: `"geography"`; `german`: `"german"`; `history`: `"history"`; `maths`: `"maths"`; `music`: `"music"`; `physical-education`: `"physical-education"`; `religious-education`: `"religious-education"`; `rshe-pshe`: `"rshe-pshe"`; `science`: `"science"`; `spanish`: `"spanish"`; \}\>\>; `text`: `ZodDefault`\<`ZodString`\>; \}, `$strict`\>

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc\_src/types/generated/search/parsed-query.ts:14

Structured output of the natural language parser.
