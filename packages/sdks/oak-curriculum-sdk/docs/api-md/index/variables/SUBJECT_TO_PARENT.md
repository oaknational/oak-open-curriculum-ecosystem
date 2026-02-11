[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../README.md) / [index](../README.md) / SUBJECT_TO_PARENT

# Variable: SUBJECT_TO_PARENT

> `const` **SUBJECT_TO_PARENT**: `object`

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/types/generated/search/subject-hierarchy.ts:33

Maps every valid subject (including KS4 variants) to its parent subject.

For most subjects, parent === subject. Only science has children:

- physics → science
- chemistry → science
- biology → science
- combined-science → science
- science → science

## Type Declaration

### art

> `readonly` **art**: `"art"` = `"art"`

### biology

> `readonly` **biology**: `"science"` = `"science"`

### chemistry

> `readonly` **chemistry**: `"science"` = `"science"`

### citizenship

> `readonly` **citizenship**: `"citizenship"` = `"citizenship"`

### combined-science

> `readonly` **combined-science**: `"science"` = `"science"`

### computing

> `readonly` **computing**: `"computing"` = `"computing"`

### cooking-nutrition

> `readonly` **cooking-nutrition**: `"cooking-nutrition"` = `"cooking-nutrition"`

### design-technology

> `readonly` **design-technology**: `"design-technology"` = `"design-technology"`

### english

> `readonly` **english**: `"english"` = `"english"`

### french

> `readonly` **french**: `"french"` = `"french"`

### geography

> `readonly` **geography**: `"geography"` = `"geography"`

### german

> `readonly` **german**: `"german"` = `"german"`

### history

> `readonly` **history**: `"history"` = `"history"`

### maths

> `readonly` **maths**: `"maths"` = `"maths"`

### music

> `readonly` **music**: `"music"` = `"music"`

### physical-education

> `readonly` **physical-education**: `"physical-education"` = `"physical-education"`

### physics

> `readonly` **physics**: `"science"` = `"science"`

### religious-education

> `readonly` **religious-education**: `"religious-education"` = `"religious-education"`

### rshe-pshe

> `readonly` **rshe-pshe**: `"rshe-pshe"` = `"rshe-pshe"`

### science

> `readonly` **science**: `"science"` = `"science"`

### spanish

> `readonly` **spanish**: `"spanish"` = `"spanish"`

## Example

```typescript
SUBJECT_TO_PARENT['physics']; // → 'science'
SUBJECT_TO_PARENT['maths']; // → 'maths'
SUBJECT_TO_PARENT['science']; // → 'science'
```
