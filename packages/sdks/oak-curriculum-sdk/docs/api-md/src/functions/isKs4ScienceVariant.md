[**@oaknational/curriculum-sdk v0.8.0**](../../README.md)

---

[@oaknational/curriculum-sdk](../../README.md) / [src](../README.md) / isKs4ScienceVariant

# Function: isKs4ScienceVariant()

> **isKs4ScienceVariant**(`subject`): subject is "physics" \| "chemistry" \| "biology" \| "combined-science"

Defined in: sdks/oak-sdk-codegen/dist/types/generated/search/subject-hierarchy.d.ts:124

Type guard: Check if a subject is a KS4 science variant.

KS4 science variants are: physics, chemistry, biology, combined-science.
Note: 'science' itself is NOT a variant (it's the parent).

## Parameters

### subject

`string`

The subject string to check

## Returns

subject is "physics" \| "chemistry" \| "biology" \| "combined-science"

True if the subject is a KS4 science variant

## Example

```typescript
isKs4ScienceVariant('physics'); // → true
isKs4ScienceVariant('science'); // → false (it's the parent)
isKs4ScienceVariant('maths'); // → false
```
