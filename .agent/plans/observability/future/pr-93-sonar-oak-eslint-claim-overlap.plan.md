---
name: "PR 93 Sonar oak-eslint Claim-Overlap Follow-Up"
status: strategic-brief
overview: >
  Resolve the PR 93 Sonar TODO-comment findings in oak-eslint only after
  Silvered Hiding Silhouette's paused claim is unpaused, closed, or
  explicitly coordinated.
depends_on:
  - "../current/pr-93-sonar-quality-gate-resolution.plan.md"
promotion_trigger: >
  Silvered Hiding Silhouette claim 588160cf-d8c7-41b7-b7ac-ecaa870acfa6
  is closed, the paused Claude session is unpaused and coordinates the
  change, or the owner explicitly authorises another agent to work in
  the claimed oak-eslint area.
---

# PR 93 Sonar oak-eslint Claim-Overlap Follow-Up

**Status**: Strategic - blocked on paused-claim coordination
**Last Updated**: 2026-05-05

## Why this plan exists

PR 93 Sonar reports three `typescript:S1135` findings in the `oak-eslint`
configuration area. Two are in
`packages/core/oak-eslint/src/configs/strict.unit.test.ts`, which is
currently owned by Silvered Hiding Silhouette's fresh paused claim for
step-07 real-IO inventory work. The main PR 93 Sonar plan therefore leaves
these findings untouched and records this separate follow-up.

## Scope

- `packages/core/oak-eslint/src/configs/strict.ts`
- `packages/core/oak-eslint/src/configs/strict.unit.test.ts`

## Intended Fix

Reword the comments/examples that use the exact TODO-like token Sonar flags,
without changing rule behavior or test intent.

Expected shape:

- Replace the strict config documentation example with neutral wording such
  as "placeholder", "fix", and "later".
- Reword the strict unit-test comments that mention the Vitest pending-test
  spelling or the literal blocked marker so Sonar does not classify the
  comments as work items.

## Validation

```bash
pnpm --filter @oaknational/eslint-plugin-standards test
pnpm --filter @oaknational/eslint-plugin-standards type-check
```

After this lands, re-query Sonar PR 93 and confirm the three `oak-eslint`
issues are gone or record any remaining finding with the new line number.

## Non-Goals

- No behavioral change to the strict config.
- No changes to the `no-real-io-in-tests` rule or allowlist work.
- No edits while Silvered's paused claim remains fresh unless explicitly
  coordinated.
