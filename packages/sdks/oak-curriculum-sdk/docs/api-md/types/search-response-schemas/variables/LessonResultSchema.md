[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../../README.md) / [types/search-response-schemas](../README.md) / LessonResultSchema

# Variable: LessonResultSchema

> `const` **LessonResultSchema**: `ZodObject`\<\{ `highlights`: `ZodDefault`\<`ZodArray`\<`ZodString`\>\>; `id`: `ZodString`; `lesson`: `ZodNullable`\<`ZodObject`\<\{ `key_stage`: `ZodEnum`\<\{ `ks1`: `"ks1"`; `ks2`: `"ks2"`; `ks3`: `"ks3"`; `ks4`: `"ks4"`; \}\>; `lesson_title`: `ZodString`; `subject_slug`: `ZodEnum`\<\{ `art`: `"art"`; `citizenship`: `"citizenship"`; `computing`: `"computing"`; `cooking-nutrition`: `"cooking-nutrition"`; `design-technology`: `"design-technology"`; `english`: `"english"`; `french`: `"french"`; `geography`: `"geography"`; `german`: `"german"`; `history`: `"history"`; `maths`: `"maths"`; `music`: `"music"`; `physical-education`: `"physical-education"`; `religious-education`: `"religious-education"`; `rshe-pshe`: `"rshe-pshe"`; `science`: `"science"`; `spanish`: `"spanish"`; \}\>; `year_group`: `ZodOptional`\<`ZodString`\>; \}, `$strict`\>\>; `rankScore`: `ZodNumber`; \}, `$strict`\> = `GeneratedLessonResultSchema`

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/types/search-response-schemas.ts:22

Schema describing an individual lesson search result entry.
