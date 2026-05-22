---
name: Structurally-Identical New Function Drops at Pre-Authoring
polarity: pattern
category: planning
status: provisional
discovered: 2026-05-22
proven_in: "Two instances in one plan (commit-queue-intent-scope-discipline Cycles 1.1 + 1.2). Both proposed NEW *scoped* variants of existing functions (createScopedStagedBundleFingerprint, verifyScopedStagedBundle). Pre-authoring reviewer dispatch in both cycles converged on 'structurally identical to the existing function — migration is on the read seam, not on the downstream function'. Both new-function proposals dropped at pre-authoring; both cycles landed simpler than planned. Third instance from a different author/plan would strengthen the pattern."
---

> **POLARITY: PATTERN.** A pre-authoring check that drops duplicate function proposals before any code is written.

# Structurally-Identical New Function Drops at Pre-Authoring

When a plan proposes a NEW parallel function (`fooScoped`, `fooV2`,
`fooEnhanced`) that mirrors an existing function's signature, the
plan's pre-authoring step asks one question: **does the proposed
new function's signature differ structurally from the existing
one?**

If **no**, the migration is on the read seam (or some other
upstream concern), not on the downstream function. Drop the new
function before any code is authored; thread the upstream change
through the existing function instead.

If **yes**, the new function genuinely carries new behaviour and
the proposal stands.

## The Diagnostic

Compare the proposed and existing signatures side by side:

- Same input type? Same output type? Same exceptions thrown?
- Does the new function's body necessarily mention something the
  existing function's body cannot?
- Does any caller need to choose between the two at the call
  site, or would every caller switch wholesale?

If the answers are *yes / no / no*, the new function is a
structural duplicate. The upstream concern (typically a
schema-narrowing or a read-source change) belongs upstream of the
existing function, not in a parallel function.

## Cross-References

- `.agent/rules/pre-execution-code-expert-review-per-loop-cycle.md` —
  the gateway where this check fires.
- `.agent/skills/oak-plan/` — the plan-authoring surface that
  benefits from this check.
- `.agent/memory/operational/pending-graduations.md` 2026-05-22 —
  the original capture entry remains until the third-instance
  trigger fires from a different author or plan.
