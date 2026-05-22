# Pre-Execution Code-Expert Review Per /loop Cycle

Composes with [`invoke-code-experts.md`](invoke-code-experts.md) and the
[`start-right-team`](../skills/start-right-team/SKILL-CANONICAL.md) skill's
"First Moves" and "Maintain The Team Cadence" sections. The reviewer roster,
delegation snapshot, depth taxonomy, and reporting requirements come from
`invoke-code-experts.md`; this rule binds those mechanics to a specific
cadence step in /loop cycle execution.

## Rule

**On every /loop cycle, `code-expert` is dispatched twice: once
pre-execution (before the implementer fan-out runs), and once
post-execution (as the gateway before commit). Two review moments per
cycle, never one.**

The pre-execution dispatch is mandatory. A cycle that fans out
implementers without a returned pre-execution review is a procedural
defect, not a faster path.

## When (cadence position)

The pre-execution moment lands between two existing cadence points in
`start-right-team` SKILL §"First Moves":

1. The "next cycle is ready" decision point — plan / file scope / risk
   surface is settled enough to dispatch implementers.
2. **(Pre-execution review fires here.)**
3. Sub-agent implementer fan-out dispatch.

The implementer fan-out does not dispatch until the pre-execution
reviewer has returned. The post-execution gateway review continues
unchanged: after the implementer bundle is back, before commit, exactly
as `invoke-code-experts.md` §"Timing Tiers" already describes.

## What the pre-execution reviewer returns

The pre-execution `code-expert` reads the planned dispatch and returns
explicit verdicts that shape the implementer fan-out:

- **Per-site disposition** when the cycle is a remediation pass over a
  finding set (e.g. SonarQube issues, lint findings, test failures):
  `FIX`, `FALSE_POSITIVE`, `DEFER`, or `SPLIT` with rationale per site.
- **Per-cluster grouping** when sites cluster by rule, file, or
  architectural concern — the reviewer names the clusters and any
  ordering or batching that matters.
- **Per-cycle structural feedback** when the cycle is feature work
  rather than remediation: scope tightening, file-set adjustments,
  risk-surface naming (architectural-judgement / mechanical / refactor
  / vendor-shape / etc.), and any missing reviewer specialists the
  fan-out should add.

The implementer fan-out brief incorporates the pre-execution verdicts
before dispatch. Sites called `FALSE_POSITIVE` do not enter the fan-out
brief. Sites called `DEFER` or `SPLIT` are routed per the reviewer's
rationale.

## Why two moments, not one

The gateway-only pattern catches problems after implementers have
already committed effort — wasted implementer cycles, re-work on
already-touched files, fan-out shapes that no longer match the reviewer
verdict. The pre-execution pattern lets the reviewer shape the dispatch
itself, when the cost of redirection is minimal.

`invoke-code-experts.md` §"Timing Tiers" already contemplates
intention-review at design-pressure checkpoints; this rule makes that
moment mandatory and per-cycle inside /loop cadence, rather than
discretionary by change-class.

## How (dispatch mechanics)

The pre-execution review uses the same sub-agent dispatch mechanism as
the post-execution gateway review (see
[`invoke-code-experts.md` §"Invocation"](invoke-code-experts.md)). The
dispatching agent supplies a brief naming:

- The planned dispositions or scope summary for the cycle.
- The file scope the implementer fan-out will touch.
- The dispatch's risk surface (architectural-judgement / mechanical /
  refactor / vendor-shape / etc.).
- Review depth (`focused` or `deep` per `invoke-code-experts.md`).

The reviewer returns the per-site or per-cluster verdicts described
above. The dispatching agent absorbs the verdicts into the implementer
fan-out brief before dispatch.

## Reporting

Per `invoke-code-experts.md` §"Coverage Tracking" and §"Reporting
Requirement", every cycle's cadence report records both review
invocations explicitly. Omitting the pre-execution review is the
same kind of defect as omitting the gateway review.

## Source attribution

Owner-directed 2026-05-22; worked-instance evidence Shaded Whispering
Dusk Lane A Cycle 6 (broadcast 2026-05-22T12:40:27Z — pre-execution
reviewer dispatched as plan-mandated gateway, reviewer called FIX vs
FALSE_POSITIVE per S7787 site with rationale before any implementer
fan-out ran).

## Cross-references

- Parent rule: [`invoke-code-experts.md`](invoke-code-experts.md) —
  reviewer roster, delegation snapshot, depth taxonomy, reporting
  requirements, and the post-execution gateway review this rule
  composes with.
- Cadence skill: [`start-right-team`](../skills/start-right-team/SKILL-CANONICAL.md)
  §"First Moves" and §"Maintain The Team Cadence" — the cycle-step
  ordering this rule slots into.
