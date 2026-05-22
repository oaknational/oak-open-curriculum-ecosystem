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

## Two dispatch shapes — fan-from-brief vs fan-from-verdict

A cycle's reviewer dispatch shape depends on whether the plan
already names the per-cycle reviewer set. Two distinct shapes apply,
and the choice between them is the decision the dispatching agent
makes at cycle-open:

### Fan-from-brief (named-set cycles)

When the controlling plan names a per-cycle reviewer set explicitly
(e.g., `eef-first-feature.plan.md` §"Per-cycle reviewer set" lists
"type-expert + test-expert mandatory" for `t12-citation-shape`), the
plan-named reviewers are dispatched **in parallel from cycle-open**,
alongside code-expert's pre-execution review.

Code-expert still runs — but as the **architectural reviewer** of the
planned cycle scope, not as the **router** for which specialists to
call. Code-expert's verdict can still surface NEW specialists the
plan-named set missed (escalation); existing plan-named reviewers do
not wait on code-expert's verdict.

### Fan-from-verdict (unknown-scope cycles)

When the controlling plan does NOT name the per-cycle reviewer set
(remediation passes over unstructured finding sets, exploratory
cycles, cross-workspace investigations, or any cycle where the
appropriate specialists cannot be determined at brief-time),
code-expert is briefed first as the **router**. Specialists named in
code-expert's verdict are dispatched after the verdict is absorbed.

### Decision rule

At cycle-open, the dispatching agent checks the controlling plan's
per-cycle reviewer specification:

- **Named** → fan-from-brief.
- **Contingent / unknown / "as code-expert determines"** → fan-from-verdict.

The choice is recorded in the cycle's coordination report alongside
the reviewer roster.

### Why both shapes

Fan-from-verdict is the safer default for unknown scopes — code-expert
prevents wasted specialist dispatches that return "not applicable".
But for named-set cycles, fan-from-verdict adds a wall-clock hop
without adding signal: code-expert is rubber-stamping the plan's
named set, not discovering it. Fan-from-brief eliminates the hop while
preserving code-expert's architectural review function.

The two shapes share the rule's core commitment: code-expert runs
twice per cycle (pre-execution + post-execution), regardless of
which dispatch shape applies.

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

**Two-dispatch-shape amendment (2026-05-22, Mistbound Slipping Night)**:
graduated from `.agent/memory/operational/pending-graduations.md`
candidate `reviewer-dispatch-two-shapes`. Worked-instance: t12-citation-shape
cycle where plan named "type-expert + test-expert mandatory" — the
serialised hop through code-expert as router was wall-clock cost
without signal gain. The fan-from-brief shape preserves code-expert's
architectural review role while parallelising the named-set specialists
from cycle-open.

## Cross-references

- Parent rule: [`invoke-code-experts.md`](invoke-code-experts.md) —
  reviewer roster, delegation snapshot, depth taxonomy, reporting
  requirements, and the post-execution gateway review this rule
  composes with.
- Cadence skill: [`start-right-team`](../skills/start-right-team/SKILL-CANONICAL.md)
  §"First Moves" and §"Maintain The Team Cadence" — the cycle-step
  ordering this rule slots into.
