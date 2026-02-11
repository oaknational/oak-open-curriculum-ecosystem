[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../../README.md)

***

[@oaknational/oak-curriculum-sdk](../../../../README.md) / [types/generated/search](../README.md) / SearchSequenceIndexDocSchema

# Variable: SearchSequenceIndexDocSchema

> `const` **SearchSequenceIndexDocSchema**: `ZodObject`\<\{ `category_titles`: `ZodOptional`\<`ZodArray`\<`ZodString`\>\>; `doc_type`: `ZodString`; `key_stages`: `ZodOptional`\<`ZodArray`\<`ZodString`\>\>; `phase_slug`: `ZodOptional`\<`ZodString`\>; `phase_title`: `ZodOptional`\<`ZodString`\>; `sequence_id`: `ZodString`; `sequence_semantic`: `ZodOptional`\<`ZodString`\>; `sequence_slug`: `ZodString`; `sequence_title`: `ZodString`; `sequence_url`: `ZodString`; `subject_slug`: `ZodEnum`\<\{ `art`: `"art"`; `citizenship`: `"citizenship"`; `computing`: `"computing"`; `cooking-nutrition`: `"cooking-nutrition"`; `design-technology`: `"design-technology"`; `english`: `"english"`; `french`: `"french"`; `geography`: `"geography"`; `german`: `"german"`; `history`: `"history"`; `maths`: `"maths"`; `music`: `"music"`; `physical-education`: `"physical-education"`; `religious-education`: `"religious-education"`; `rshe-pshe`: `"rshe-pshe"`; `science`: `"science"`; `spanish`: `"spanish"`; \}\>; `subject_title`: `ZodOptional`\<`ZodString`\>; `title_suggest`: `ZodOptional`\<`ZodObject`\<\{ `contexts`: `ZodOptional`\<`ZodObject`\<\{ `phase`: `ZodOptional`\<`ZodArray`\<`ZodString`\>\>; `subject`: `ZodOptional`\<`ZodArray`\<`ZodString`\>\>; \}, `$strict`\>\>; `input`: `ZodArray`\<`ZodString`\>; `weight`: `ZodOptional`\<`ZodNumber`\>; \}, `$strict`\>\>; `unit_slugs`: `ZodOptional`\<`ZodArray`\<`ZodString`\>\>; `years`: `ZodOptional`\<`ZodArray`\<`ZodString`\>\>; \}, `$strict`\>

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/search/index-documents.ts:244](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/search/index-documents.ts#L244)
