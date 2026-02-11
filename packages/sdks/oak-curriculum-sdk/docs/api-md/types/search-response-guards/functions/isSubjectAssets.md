[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../../README.md) / [types/search-response-guards](../README.md) / isSubjectAssets

# Function: isSubjectAssets()

> **isSubjectAssets**(`v`): v is \{ assets: \{ label: string; type: "slideDeck" \| "exitQuiz" \| "exitQuizAnswers" \| "starterQuiz" \| "starterQuizAnswers" \| "supplementaryResource" \| "video" \| "worksheet" \| "worksheetAnswers"; url: string \}\[\]; attribution?: string\[\]; canonicalUrl?: string; lessonSlug: string; lessonTitle: string \}\[\]

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/types/search-response-guards.ts:91

Type guard for subject assets response.

## Parameters

### v

`unknown`

Value to check

## Returns

v is \{ assets: \{ label: string; type: "slideDeck" \| "exitQuiz" \| "exitQuizAnswers" \| "starterQuiz" \| "starterQuizAnswers" \| "supplementaryResource" \| "video" \| "worksheet" \| "worksheetAnswers"; url: string \}\[\]; attribution?: string\[\]; canonicalUrl?: string; lessonSlug: string; lessonTitle: string \}\[\]

true if v is a valid SubjectAssets array
