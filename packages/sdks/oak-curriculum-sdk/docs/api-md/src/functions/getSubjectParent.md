[**@oaknational/curriculum-sdk v0.8.0**](../../README.md)

---

[@oaknational/curriculum-sdk](../../README.md) / [src](../README.md) / getSubjectParent

# Function: getSubjectParent()

> **getSubjectParent**(`subject`): [`ParentSubjectSlug`](../type-aliases/ParentSubjectSlug.md)

Defined in: sdks/oak-sdk-codegen/dist/types/generated/search/subject-hierarchy.d.ts:141

Get the parent subject for any subject.

For science variants (physics, chemistry, biology, combined-science),
returns 'science'. For all other subjects, returns the subject itself.

## Parameters

### subject

A valid subject slug (AllSubjectSlug)

`"art"` | `"citizenship"` | `"computing"` | `"cooking-nutrition"` | `"design-technology"` | `"english"` | `"french"` | `"geography"` | `"german"` | `"history"` | `"maths"` | `"music"` | `"physical-education"` | `"religious-education"` | `"rshe-pshe"` | `"science"` | `"spanish"` | `"physics"` | `"chemistry"` | `"biology"` | `"combined-science"`

## Returns

[`ParentSubjectSlug`](../type-aliases/ParentSubjectSlug.md)

The parent subject slug (ParentSubjectSlug)

## Example

```typescript
getSubjectParent('physics'); // → 'science'
getSubjectParent('maths'); // → 'maths'
getSubjectParent('science'); // → 'science'
```
