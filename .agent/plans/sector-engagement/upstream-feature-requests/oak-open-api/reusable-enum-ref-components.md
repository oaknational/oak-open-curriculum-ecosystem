# Register shared enums as reusable component schemas (`$ref`)

**Upstream**: `oak-openapi` (Oak Open Curriculum API). Canonical intake: the
`oak-openapi` `docs/requests/` folder. **Do not edit `oak-openapi` from this
repo** — hand this over.
**Status**: open
**Priority**: low (consumer maintainability / generated-type quality)
**Affected**: every operation using a shared enum — subject slugs first; key
stage slugs next.

## Problem

Shared enums are inlined at every use site instead of being defined once as a
named OpenAPI component and referenced by `$ref`. Each `z.enum(...)` call emits a
fresh inline union into the published spec, so the same long list is repeated
across many operations and reproduced in every consumer that generates types from
the spec.

## Evidence

- The value list already has a single source upstream — `subjectSlugs` in
  `oak-openapi` `src/lib/keyStageAndSubjects.ts`.
- It is re-wrapped inline at each site, e.g. `z.enum(subjectSlugs as [string])` in
  `oak-openapi` `src/lib/handlers/subjects/schemas/responses/allSubjectsResponse.schema.ts`
  and in each `subject` parameter schema (e.g.
  `questionsForKeyStageAndSubjectRequest.schema.ts`).
- Downstream symptom in this repo: the subject-slug union appears **8 times** in
  the generated
  `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/api-paths-types.ts`
  (one `AllSubjectsResponseSchema` array plus seven inline `subject:` path
  parameters). SonarCloud flags it as `typescript:S4323` ("Replace this union type
  with a type alias"). The consumer cannot fix this — the generated types are a
  faithful projection of the spec — so the issue is currently **accepted** on
  PR #131 and tracked here pending the upstream change.

## Suggested approach

Define each shared enum once as a named component schema and reference it by
`$ref` everywhere it is used. With the current Zod-based schema layer this means
giving the enum a stable component id once and reusing the same schema object
across the response and all parameters, instead of re-calling `z.enum(subjectSlugs)`
at each site, so the emitted spec carries a single `components.schemas.SubjectSlug`
definition plus `$ref`s. Apply the same treatment to `keyStageSlugs`.

## Impact

A smaller, DRY OpenAPI document; consumers get a reusable named type (e.g.
`SubjectSlug`) instead of a repeated inline union, and the duplication quality
signal clears at its source. **Backwards compatibility**: structurally
non-breaking — the value domain at each site is unchanged; only the spec's
internal representation moves from inline union to named component + `$ref`.
