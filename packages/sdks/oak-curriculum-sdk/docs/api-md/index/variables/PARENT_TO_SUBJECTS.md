[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../README.md) / [index](../README.md) / PARENT_TO_SUBJECTS

# Variable: PARENT_TO_SUBJECTS

> `const` **PARENT_TO_SUBJECTS**: `object`

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/types/generated/search/subject-hierarchy.ts:114

Maps parent subjects to all their children (including themselves).

Useful for understanding what subjects fall under a parent.

- 'science' → ['science', 'physics', 'chemistry', 'biology', 'combined-science']
- All other subjects → [self]

## Type Declaration

### art

> `readonly` **art**: readonly \[`"art"`\]

### citizenship

> `readonly` **citizenship**: readonly \[`"citizenship"`\]

### computing

> `readonly` **computing**: readonly \[`"computing"`\]

### cooking-nutrition

> `readonly` **cooking-nutrition**: readonly \[`"cooking-nutrition"`\]

### design-technology

> `readonly` **design-technology**: readonly \[`"design-technology"`\]

### english

> `readonly` **english**: readonly \[`"english"`\]

### french

> `readonly` **french**: readonly \[`"french"`\]

### geography

> `readonly` **geography**: readonly \[`"geography"`\]

### german

> `readonly` **german**: readonly \[`"german"`\]

### history

> `readonly` **history**: readonly \[`"history"`\]

### maths

> `readonly` **maths**: readonly \[`"maths"`\]

### music

> `readonly` **music**: readonly \[`"music"`\]

### physical-education

> `readonly` **physical-education**: readonly \[`"physical-education"`\]

### religious-education

> `readonly` **religious-education**: readonly \[`"religious-education"`\]

### rshe-pshe

> `readonly` **rshe-pshe**: readonly \[`"rshe-pshe"`\]

### science

> `readonly` **science**: readonly \[`"science"`, `"physics"`, `"chemistry"`, `"biology"`, `"combined-science"`\]

### spanish

> `readonly` **spanish**: readonly \[`"spanish"`\]

## Example

```typescript
PARENT_TO_SUBJECTS['science']; // → ['science', 'physics', 'chemistry', 'biology', 'combined-science']
PARENT_TO_SUBJECTS['maths']; // → ['maths']
```
