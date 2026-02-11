[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../../../README.md)

***

[@oaknational/oak-curriculum-sdk](../../../../../README.md) / [types/generated/search/responses.lessons](../README.md) / LessonResultSchema

# Variable: LessonResultSchema

> `const` **LessonResultSchema**: `ZodObject`\<\{ `highlights`: `ZodDefault`\<`ZodArray`\<`ZodString`\>\>; `id`: `ZodString`; `lesson`: `ZodNullable`\<`ZodObject`\<\{ `key_stage`: `ZodEnum`\<\{ `ks1`: `"ks1"`; `ks2`: `"ks2"`; `ks3`: `"ks3"`; `ks4`: `"ks4"`; \}\>; `lesson_title`: `ZodString`; `subject_slug`: `ZodEnum`\<\{ `art`: `"art"`; `citizenship`: `"citizenship"`; `computing`: `"computing"`; `cooking-nutrition`: `"cooking-nutrition"`; `design-technology`: `"design-technology"`; `english`: `"english"`; `french`: `"french"`; `geography`: `"geography"`; `german`: `"german"`; `history`: `"history"`; `maths`: `"maths"`; `music`: `"music"`; `physical-education`: `"physical-education"`; `religious-education`: `"religious-education"`; `rshe-pshe`: `"rshe-pshe"`; `science`: `"science"`; `spanish`: `"spanish"`; \}\>; `year_group`: `ZodOptional`\<`ZodString`\>; \}, `$strict`\>\>; `rankScore`: `ZodNumber`; \}, `$strict`\>

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/search/responses.lessons.ts:26](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/search/responses.lessons.ts#L26)

Schema describing an individual lesson search result entry.
