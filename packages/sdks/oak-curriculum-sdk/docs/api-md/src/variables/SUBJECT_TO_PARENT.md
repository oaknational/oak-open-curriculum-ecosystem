[**@oaknational/curriculum-sdk v0.8.0**](../../README.md)

---

[@oaknational/curriculum-sdk](../../README.md) / [src](../README.md) / SUBJECT_TO_PARENT

# Variable: SUBJECT_TO_PARENT

> `const` **SUBJECT_TO_PARENT**: `object`

Defined in: sdks/oak-sdk-codegen/dist/types/generated/search/subject-hierarchy.d.ts:32

Maps every valid subject (including KS4 variants) to its parent subject.

For most subjects, parent === subject. Only science has children:

- physics → science
- chemistry → science
- biology → science
- combined-science → science
- science → science

## Type Declaration

### art

> `readonly` **art**: `"art"`

### biology

> `readonly` **biology**: `"science"`

### chemistry

> `readonly` **chemistry**: `"science"`

### citizenship

> `readonly` **citizenship**: `"citizenship"`

### combined-science

> `readonly` **combined-science**: `"science"`

### computing

> `readonly` **computing**: `"computing"`

### cooking-nutrition

> `readonly` **cooking-nutrition**: `"cooking-nutrition"`

### design-technology

> `readonly` **design-technology**: `"design-technology"`

### english

> `readonly` **english**: `"english"`

### french

> `readonly` **french**: `"french"`

### geography

> `readonly` **geography**: `"geography"`

### german

> `readonly` **german**: `"german"`

### history

> `readonly` **history**: `"history"`

### maths

> `readonly` **maths**: `"maths"`

### music

> `readonly` **music**: `"music"`

### physical-education

> `readonly` **physical-education**: `"physical-education"`

### physics

> `readonly` **physics**: `"science"`

### religious-education

> `readonly` **religious-education**: `"religious-education"`

### rshe-pshe

> `readonly` **rshe-pshe**: `"rshe-pshe"`

### science

> `readonly` **science**: `"science"`

### spanish

> `readonly` **spanish**: `"spanish"`

## Example

```typescript
SUBJECT_TO_PARENT['physics']; // → 'science'
SUBJECT_TO_PARENT['maths']; // → 'maths'
SUBJECT_TO_PARENT['science']; // → 'science'
```
