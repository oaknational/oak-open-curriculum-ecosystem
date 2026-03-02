[**@oaknational/curriculum-sdk v0.8.0**](../../README.md)

---

[@oaknational/curriculum-sdk](../../README.md) / [src](../README.md) / isAllSubject

# Function: isAllSubject()

> **isAllSubject**(`value`): value is "art" \| "citizenship" \| "computing" \| "cooking-nutrition" \| "design-technology" \| "english" \| "french" \| "geography" \| "german" \| "history" \| "maths" \| "music" \| "physical-education" \| "religious-education" \| "rshe-pshe" \| "science" \| "spanish" \| "physics" \| "chemistry" \| "biology" \| "combined-science"

Defined in: sdks/oak-sdk-codegen/dist/types/generated/search/subject-hierarchy.d.ts:158

Type guard: Check if a string is a valid subject (including KS4 variants).

This validates against all 21 subjects (17 canonical + 4 KS4 variants).
Use this for validating bulk data subject values.

## Parameters

### value

`string`

The string to check

## Returns

value is "art" \| "citizenship" \| "computing" \| "cooking-nutrition" \| "design-technology" \| "english" \| "french" \| "geography" \| "german" \| "history" \| "maths" \| "music" \| "physical-education" \| "religious-education" \| "rshe-pshe" \| "science" \| "spanish" \| "physics" \| "chemistry" \| "biology" \| "combined-science"

True if the value is a valid AllSubjectSlug

## Example

```typescript
isAllSubject('physics'); // → true (KS4 variant)
isAllSubject('maths'); // → true (canonical)
isAllSubject('invalid'); // → false
```
