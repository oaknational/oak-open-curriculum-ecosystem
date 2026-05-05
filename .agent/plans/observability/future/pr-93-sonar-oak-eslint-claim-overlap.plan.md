---
name: "PR 93 Sonar oak-eslint Claim-Overlap Follow-Up"
status: completed
overview: >
  Disposition the PR 93 Sonar TODO-comment findings in oak-eslint after
  owner direction clarified they are false positives over gate
  documentation, not outstanding work.
depends_on:
  - "../current/pr-93-sonar-quality-gate-resolution.plan.md"
completion_evidence: >
  Owner authorised false-positive disposition on 2026-05-05; Sonar PR 93
  re-query reported new_violations=0 after the three issue keys were marked
  false positive.
---

# PR 93 Sonar oak-eslint Claim-Overlap Follow-Up

**Status**: Completed - false-positive disposition applied in Sonar
**Last Updated**: 2026-05-05

## Why this plan exists

PR 93 Sonar reported three `typescript:S1135` findings in the `oak-eslint`
configuration area. Two are in
`packages/core/oak-eslint/src/configs/strict.unit.test.ts`, which is
currently owned by Silvered Hiding Silhouette's paused claim for step-07
real-IO inventory work. The main PR 93 Sonar plan therefore left these
findings untouched and recorded this separate follow-up.

Owner direction on 2026-05-05 classified all three findings as false
positives. The flagged tokens are not outstanding TODOs; they are
documentation/test examples describing how the strict ESLint gate catches
TODO-like suppression rationales and pending-test mechanisms.

## Scope

- `packages/core/oak-eslint/src/configs/strict.ts`
- `packages/core/oak-eslint/src/configs/strict.unit.test.ts`

## Sonar Disposition

The following Sonar issues were marked false positive:

- `AZ3z3KojDfG0f886A-h6` —
  `packages/core/oak-eslint/src/configs/strict.ts`.
- `AZ3z3Ko0DfG0f886A-h8` —
  `packages/core/oak-eslint/src/configs/strict.unit.test.ts`.
- `AZ3z3Ko0DfG0f886A-h7` —
  `packages/core/oak-eslint/src/configs/strict.unit.test.ts`.

Rationale: these occurrences are gate documentation/fixtures. They describe
the exact token class the strict config rejects, rather than recording work
to be completed.

## Validation

No code change was made. Sonar PR 93 was re-queried after disposition:
`new_violations=0`, security hotspots `0`; the remaining quality-gate failure
is duplicated-lines density.

## Non-Goals

- No behavioral change to the strict config.
- No changes to the `no-real-io-in-tests` rule or allowlist work.
- No edits while Silvered's paused claim remains fresh unless explicitly
  coordinated.
