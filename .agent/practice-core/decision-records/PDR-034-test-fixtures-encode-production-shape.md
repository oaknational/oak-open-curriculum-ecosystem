---
pdr_kind: governance
---

# PDR-034: Test Fixtures Encode Production Shape, Not the Code's Expectation

**Status**: Accepted
**Date**: 2026-04-26
**Related**:
[PDR-020](PDR-020-check-driven-development.md)
(check-driven development — fixtures that disagree with production
defeat the check; this PDR closes a specific failure mode of
fixture authorship);
[PDR-031](PDR-031-build-vs-buy-attestation.md)
(build-vs-buy attestation — fixtures for vendor integrations
anchor to vendor-documented or vendor-captured values, not to
internal models of what the vendor "should" return).

## Context

Tests are intended to catch the case where the production code
disagrees with reality. They cannot serve that purpose if the
fixture and the production code agree on the *wrong* contract.
When fixture and code share an incorrect understanding, the test
suite passes and the bug ships.

Empirical instance (2026-04-26 on
oak-open-curriculum-ecosystem): Vercel's `VERCEL_BRANCH_URL`
environment variable was assumed by both production code and test
fixtures to be a full URL with scheme
(`https://feat-x-poc-oak.vercel.thenational.academy`). Production
code called `new URL(branchUrl).hostname` and test fixtures
provided URL-shaped strings. Both agreed; tests passed; the
preview build silently broke for ~5 commits because the real
Vercel value is **hostname only** (no scheme), and `new URL()`
threw on the bare hostname at runtime. The test suite could not
catch this because the fixture encoded the code's
*expectation* rather than the *production reality*.

The failure mode is not a bug in the test framework or the
production code. It is a bug in **fixture authorship**: the
fixture was authored without checking what the vendor actually
emits. The author and reviewer both inherited the same incorrect
model of the vendor's contract.

The same failure mode is symmetric across every fixture that
encodes a value owned by a system outside this code's trust
boundary: vendor environment variables, vendor API responses,
vendor webhook payloads, OAuth provider claims, third-party
schema fragments, captured browser headers, IPC message shapes
from runtimes the project does not own.

## Decision

**Test fixtures that encode values owned by a system outside this
code's trust boundary MUST anchor to captured real production
values OR to vendor-documented contract values, with a date-stamped
citation to the source.**

Two anchor types, both acceptable:

### Documented anchor

When the vendor's official documentation specifies the value's
shape, the fixture matches the documentation literally. The
fixture's TSDoc comment cites the documentation URL with the
date the documentation was checked.

```typescript
// Vercel docs (https://vercel.com/docs/environment-variables/system-environment-variables, 2026-04-26):
// VERCEL_BRANCH_URL is a hostname only, no scheme.
const VERCEL_BRANCH_URL_FIXTURE = 'feat-x-poc-oak.vercel.thenational.academy';
```

### Captured anchor

When the vendor's official documentation is silent or imprecise,
the fixture is captured from a real deployment. The fixture's
TSDoc comment names the deployment ID and the date of capture.

```typescript
// Captured from Vercel deployment dpl_FtjdEbwRN2qwM1m78hzoQoEDG95R (2026-04-25):
const SENTRY_RELEASE_FIXTURE = 'poc-oak-open-curriculum-mcp-git-feat-otelsentryenhancements';
```

### Forbidden

Fixtures that encode the *code's expectation* of what the vendor
should return, without a documentation or capture anchor, are
forbidden. They produce the failure mode this PDR exists to
prevent.

```typescript
// FORBIDDEN — no documentation anchor, no capture anchor; encodes
// the code's expectation rather than the vendor's reality.
const VERCEL_BRANCH_URL_FIXTURE = 'https://feat-x-poc-oak.vercel.thenational.academy';
```

## Consequences

### Positive

- Tests can catch the case they exist to catch: production code
  disagreeing with reality. The fixture is no longer pinning
  reality to the code's expectation.
- Future readers of the fixture see *why* the value has its
  current shape (documentation cite or capture cite), so when the
  vendor's contract changes, the cite makes the fixture's
  obsolescence visible.
- Reviewers gain a concrete fixture-authorship checklist: every
  vendor-bordering fixture has a date-stamped anchor or it is a
  finding.

### Negative

- Authoring a vendor-bordering fixture requires a documentation
  check or a real-deployment capture. Both are cheap individually
  but neither is free.
- Captured anchors gradually go stale as deployments age. The
  date-stamp makes staleness visible; review at consolidation can
  re-capture if the source no longer exists.

### Neutral

- This PDR does not require fixtures to be exhaustive or to cover
  every vendor edge case. The anchor discipline applies to whatever
  shape the fixture chooses to encode; comprehensiveness is a
  separate question.
- Fixtures for values owned by *this* code's trust boundary
  (internal types, derived values, in-process state) do not need
  external anchors. The discipline applies specifically to the
  trust-boundary case.

## Adopter Scope

**Genotype** (per PDR-019). This PDR applies across every Practice-
bearing repo that authors tests against vendor-bordering values.
The specific vendors and capture mechanisms vary per repo; the
"anchor to documented or captured production reality, with a
date-stamped citation" discipline is invariant.

## Notes

- This PDR operationalises principles.md §Test Data Anchoring at
  the fixture-authorship level. The principle "Tests that agree
  with code on the wrong contract are worse than no tests" is now
  enforceable as "fixtures crossing trust boundaries MUST cite a
  documentation or capture anchor".
- A future ESLint rule could mechanise the cite check (every
  `fixture` / `_FIXTURE` constant in test files MUST have a
  preceding TSDoc with either a URL or a deployment ID); tracked
  as a pending-graduations register candidate.
- The captured `VERCEL_BRANCH_URL` instance is reflected in
  `apps/oak-curriculum-mcp-streamable-http/src/runtime-config.ts`
  fixture comments after the 2026-04-26 fix.
