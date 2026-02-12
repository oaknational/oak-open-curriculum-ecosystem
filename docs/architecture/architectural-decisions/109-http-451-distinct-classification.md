# ADR-109: HTTP 451 as Distinct Error Classification

**Status**: Accepted (supersedes earlier draft that collapsed 451 into `not_found`)
**Date**: 2026-02-12
**Related**: [ADR-088: Result Pattern](./088-result-pattern-for-error-handling.md), [ADR-092: Transcript Cache Categorization](./092-transcript-cache-categorization.md)

## Context

The Oak Curriculum API returns HTTP 451 (Unavailable For Legal Reasons) for transcripts restricted under Third Party Content (TPC) licensing. This affects MFL lessons (French, German, Spanish) and some maths lessons (e.g. `pythagoras-theorem`).

An earlier implementation collapsed 451 into the `not_found` (404) classification. This was a lazy shortcut that destroyed semantic information. HTTP 404 and HTTP 451 have fundamentally different meanings:

| Status | Meaning                                   | Implication                                                                                |
| ------ | ----------------------------------------- | ------------------------------------------------------------------------------------------ |
| 404    | Resource does not exist                   | May be created in future; "not found" messaging                                            |
| 451    | Resource exists but is legally restricted | Permanent legal restriction; "legally restricted" messaging; audit/compliance implications |

Collapsing them erases the distinction at the classification boundary, making it impossible for downstream consumers to differentiate the two for caching, messaging, observability, or audit purposes.

## Decision

**Classify HTTP 451 as `legally_restricted` — a distinct error kind, separate from `not_found`.**

The `classifyHttpError` function in the generated error types template gives each status its own branch:

```typescript
if (status === 404) {
  return { kind: 'not_found', resource, resourceType };
}
if (status === 451) {
  return { kind: 'legally_restricted', resource, resourceType };
}
```

### Type System

```typescript
export type SdkFetchError =
  | SdkNotFoundError // 404
  | SdkLegallyRestrictedError // 451
  | SdkServerError // 5xx
  | SdkRateLimitError // 429
  | SdkNetworkError
  | SdkValidationError;
```

### Shared Properties

Both `not_found` and `legally_restricted` are:

- **Permanent**: will not resolve on retry
- **Recoverable in ingestion context**: skip and continue, do not crash
- **Cached**: stored in transcript cache to prevent repeated API calls

### Distinct Properties

| Property         | `not_found`    | `legally_restricted`            |
| ---------------- | -------------- | ------------------------------- |
| Cache status     | `not_found`    | `legally_restricted`            |
| Log message      | "not found"    | "legally restricted"            |
| HTTP status      | 404            | 451                             |
| Semantic meaning | Does not exist | Exists but legally inaccessible |

## Consequences

### Positive

- Cache entries preserve the reason for unavailability (observability)
- Log messages accurately describe the situation
- Exhaustive `switch` on `SdkFetchError` forces consumers to consider both cases
- Audit trails can distinguish legal restrictions from missing resources

### Negative

- One more variant in the `SdkFetchError` union (minor complexity increase)
- Consumers with exhaustive `switch` statements must add a `legally_restricted` case

## Verification

Unit tests in `type-gen/typegen/error-types/classify-http-error.unit.test.ts` verify:

- `classifyHttpError(404, ...)` returns `{ kind: 'not_found' }`
- `classifyHttpError(451, ...)` returns `{ kind: 'legally_restricted' }`
- The two kinds are distinct (explicitly asserted)
- `isRecoverableError` treats both as recoverable
- `formatSdkError` produces distinct messages for each
