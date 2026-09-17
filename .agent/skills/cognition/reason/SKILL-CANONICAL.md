---
name: reason
classification: active
description: >-
  Structured outward reasoning for analysis, planning, decisions, diagnosis, and design — a
  direct-trial-first gate, a decision-relevant value-of-information stop gate, and five firing
  moves (name the kind, frame the problem not the solution, surface the warrant, decide for
  reversibility, stress-test) that point to the full grammar of thinking for depth. The outward
  pair to oak-metacognition's inward reflection. Use when facing a gnarly problem, choice, or
  analysis; especially when investigation or options keep proliferating and you must decide
  whether to build and observe, keep analysing, stop, or escalate.
---

# Reason

**Governance**: The outward, structured-thinking pair to
[`metacognition`](../metacognition/SKILL-CANONICAL.md) — metacognition reflects on the thinker
(inward, "am I about to do the right thing?"); this disciplines the thinking (outward, "how do I
structure this problem well?"). It actuates the deep
[grammar of thinking](../../../reference/grammar-of-thinking.md): this skill carries the few moves
that fire on everyday work; the reference is the depth behind them and the yardstick for complex
rewrites and high-stakes planning. Grounded in PDR-029 (the perturbation-mechanism bundle that ratified the metacognition prompt)
and PDR-035 (agent-work capabilities are Practice substance).

## Use When

You are structuring a problem, argument, analysis, plan, or decision and want it to come out
well. Distinct from its neighbours: not reflecting on whether you are about to do the right
thing (`metacognition`), and not authoring a repo plan artefact (`oak-plan`, which *uses* these
moves). Fires on analysis / decision / diagnosis / design work — not every turn.

## The Direct Trial Gate

Before writing a plan, opening a broad scan, creating a benchmark matrix, or asking another agent
to explore alternatives, classify the **actual build-and-observe path**. If it is all of the
following, the default verdict is **RUN**:

- within the current user / owner authority, with required claims, approvals, and authorised
  spend; no read-only, exploration-only, plan-only, or explicit no-action instruction applies;
- a two-way door that can be removed or abandoned;
- contained away from production, third parties, and irreplaceable data;
- bounded by a fixed time, spend or process count, with a kill path and cleanup; and
- directly observable at the point where it could succeed or fail.

This gate never broadens authority. A missing approval or contrary instruction cannot time out into
permission. Before launch, name the live decision, the success and failure observations, the fixed
budget, and the terminal exit each observation triggers; cheap activity without a
decision-flipping observation is still ceremony.

When those preconditions hold, the implementation is the experiment. Do only the minimum preflight
needed to exclude secrets / PII exposure, security, legal or policy violations, destructive or
external side effects, unauthorised or unbounded spend, and missing containment or cleanup. Default
budget for those checks: ten minutes or three targeted evidence checks, whichever comes first.
Extending that budget requires naming the concrete irreversible harm the next check can prevent.
Quality, compatibility, and performance uncertainty are normally what the trial is for, not
reasons to delay it.

Prefer evidence in this order:

1. the smallest real end-to-end execution;
2. a proxy probe that isolates the same decision-flipping fact;
3. static analysis or architectural argument.

A proxy earns precedence only when it is materially cheaper than the real trial **and** can change
the decision, or when the real trial cannot yet be safely contained. Never build an assurance
apparatus to decide whether to build something when the minimal build-and-observe path is cheaper.
If cumulative inquiry reaches the estimated cost or elapsed time of the direct trial, it has
already lost its warrant: RUN, STOP, or ESCALATE immediately.

For adversarial pairing, the checker asks one question before first contact with reality: **name a
concrete stop-risk or a materially cheaper decision-flipping proxy; otherwise say RUN**. It may
tighten containment, but it may not create a new architecture branch. A pre-measurement startup
failure permits one narrow repair-and-rerun only when the cause is concrete and local and the
repair does not weaken a decision-relevant safety constraint or change a variable material to the
declared observation. Otherwise start a newly labelled bounded run; never silently change the
decision-relevant system.

## The Investigation Stop Gate

Before opening or extending an investigation, name the live decision it can change. Apply
**decision-relevant value of information** as a qualitative stopping rule — do not invent false
precision:

> `P(new evidence changes the decision) × value of the better decision`
> must materially exceed `investigation cost + delay / opportunity cost`.

Force the comparison with four questions:

1. What live decision can this question change?
2. What concrete observation would flip that decision?
3. Would the flip have material impact now or on the critical path?
4. Is there a cheaper safe, reversible experiment that would expose the fact directly?

If there is no named decision or decision-flipping result, the impact is immaterial, or a safe
probe is cheaper than more analysis, **stop investigating**. Act on the sufficient evidence or run
the probe. If the owner's purpose is genuinely to understand an unshaped concept rather than make
a live decision, route to `oak-concept-exploration` with its own bounded purpose; do not disguise
open exploration as decision research. This combines value of information and decision
sensitivity with bounded-rationality satisficing and real-options logic: seek enough evidence for
the next safe reversible move, not certainty about every branch.

Predeclare an investigation budget — a timebox, an evidence count, or one adversarial pass — and
its exit test. At the boundary choose exactly one:

- **RUN** — execute the smallest safe reversible probe;
- **STOP** — act on sufficient evidence or abandon the low-value question;
- **ESCALATE** — freeze the proposed action and route it only when the unresolved uncertainty
  blocks an irreversible or high-blast-radius action, or a privacy, security, legal, or
  unbounded-cost boundary.

There is no `CONTINUE`: an expired budget never self-extends. After `ESCALATE`, only the accountable
decision owner may open a fresh bounded investigation by naming the live decision, the evidence
that can flip it, its material expected value, the new budget, and its exit test. Safety
verification narrows to the blocking uncertainty; it does not license another general architecture
branch.

## The Five Moves

Run the moves that bite; skip what the work does not need. Each is a question that forces work,
not a box to tick.

1. **Name the kind of thing.** What mode is this — describing, explaining, evaluating,
   predicting, deciding, planning? What kind of system — simple, complicated, complex, or
   chaotic; technical, human, or institutional (classify by *behaviour*, not the nouns)? At what
   altitude is the real question — detail, mechanism, system, strategy, or values? Most confusion
   is a mode, system, or altitude mismatch.
2. **Frame the problem, not the solution.** State it as gap + who it harms + the mechanism (your
   causal hypothesis) + constraints + what success looks like — *before* any option. If your
   statement already contains a solution ("we need X"), you have skipped the problem.
3. **Surface the warrant — and its falsifier.** For the key claim or chosen option, what unstated
   assumption carries the weight? What observation would surprise you if it were wrong? The real
   disagreement and the real risk both live in the warrant. The commonest warrant gap at
   doctrine-application time: a sound general rule applied by surface analogy — state the rule's
   *precondition* out loud and verify the situation's actual structure meets it before asserting
   the finding (a motion rule whose trigger is unattended motion does not fire on self-limiting
   script-driven motion; a single-source-of-truth rule whose trigger is a living surface does not
   fire on a frozen snapshot).
4. **Decide proportionately to reversibility and stakes.** One-way door or two-way? Reversible →
   move and learn; irreversible → preserve options and reason harder. Apply the Investigation Stop
   Gate before opening a scan or fan-out. What is the cheapest probe that resolves the key
   uncertainty? What is the cost of waiting versus acting, and who bears the downside? For a
   design investigation, compare a broad light scan with a runnable spike; read the few
   load-bearing files yourself (the registry, the entry points, the SSOT) only when that scan can
   change the named decision more cheaply than the spike. Never deepen by default. Calibrate
   caution the same way: cheap-to-check reversible uncertainty ("is it built? is this claim true?") →
   verify eagerly first-hand; an expensive-to-reverse decision resting on an *inferred* (not
   measured) signal → first MEASURE the signal if it can be measured (converting the case back
   to eager first-hand verification); only if it genuinely cannot, route the decision to the
   Director (PDR-117) with your verdict attached — never to the owner as an open question.
   Repeated option-oscillation is the tell that evidence has not forced a choice.
5. **Stress-test before committing.** Are you climbing the reliability ladder too fast (a few
   observations → a model → an identity)? What is the strongest version of the alternative? Quick
   scan for the common failures: premature solution, hidden values dressed as technical, evidence
   theatre, abstraction drift, local optimisation.

## The Success Test

This skill has paid its way only if it **changed a framing, surfaced a warrant, or altered a
decision** — never if it merely produced a filled-in template. A pass that only restates what you
were already going to do is a failed pass: return to the move that bites and let it do real work.
It has also failed if it prolonged inquiry without naming the decision it could flip, or if it
analysed past the point where a cheaper safe experiment would produce the needed evidence.

For depth on any move — the reliability ladder, system classification, feedback and leverage,
decision-under-uncertainty, fallacies as diagnostics — read
[the grammar of thinking](../../../reference/grammar-of-thinking.md). That reference is also the
yardstick to read against for complex rewrites and high-stakes planning.
