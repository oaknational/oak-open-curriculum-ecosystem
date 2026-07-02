# Agentic design-panel protocol (v1 — the founding worked instance)

*Author: Wren stirs Rainbow (claude / claude-opus-4-8[1m] / 093458) — 2026-06-29.*
*Status: GRADUATED — the portable doctrine is
[PDR-123](../../practice-core/decision-records/PDR-123-agentic-design-panel-protocol.md)
(2026-07-02, promoted on first instance). This report remains the founding instance
record and effectiveness assessment; future applications record theirs the same way and
refine PDR-123 in place.*

## What this is

A protocol for using a panel of agents to **design** something well — distinct from
using agents to *implement* (workflow fan-out over a work-list) or to *analyse* (the
corpus-analysis method). The shape: **independent parallel generators → adversarial
critique → orchestrator synthesis**, with the orchestrator (the context-holder)
owning the synthesis because only it holds the problem first-hand.

## The model as first run (v1 of the protocol)

For the corpus-analysis v2 design: 4 parallel facet designers (Opus, one facet each —
deterministic boundary, adversary ensemble, typed-baseline recall, the substrate
question) + 1 adversarial critic (Opus, charged with the First Question / YAGNI /
principle-conformance over the combined output) → the orchestrator synthesised and made
the final cut. Each designer was given the shared evidence + the governing principles,
and required to return a `simplerAlternativeConsidered` and a `whatNotToDo`. Cost: 5
Opus agents at `effort: high` ≈ cheap (~350k tokens, ~4 min).

## Effectiveness assessment (first-hand, this session)

**What worked:**

- **The adversarial critic was load-bearing, by a wide margin.** It caught real
  over-engineering (a single-consumer union-find engine; a blind-typing pass that
  *manufactured* the circularity it then defended against; an internally-contradictory
  tripwire) AND caught what the panel collectively missed (the real-world-signal close,
  "the unit test is the fix", the human-review surface). Several catches the
  orchestrator would plausibly have missed solo.
- **Independent parallel drafts** were deep and grounded; sharing the evidence +
  principles made designs *assessable* (they cited specifics) rather than vibes.
- **Synthesis stayed with the context-holder** — correct: subagents reason over
  artefacts; only the orchestrator held the run results first-hand.

**What was weak:**

- **Generators over-elaborated in a *correlated* way.** All four gold-plated.
  "Design facet X deeply" rewards thoroughness, so each proposed-then-justified
  elaboration; the `simplerAlternativeConsidered` field was acknowledged then rejected.
  The First Question was only *enforced* by the critic, not built into the generators.
- **The facet cut was not MECE.** Two facets were "the same move applied twice";
  another's contribution re-described a third's. Overlap cost effort and created DRY
  violations the critic had to merge.
- **One critic is itself a single point of judgment** — ironic for a protocol about
  defeating single-judgment error. The orchestrator had to assess the critic with no
  independent check.

## The improved protocol (apply next, refine again)

1. **Restraint-by-default generators.** Brief each designer to **default to the
   simplest shape and earn every addition against an *observed* failure**, not to
   "design deeply" and justify elaboration afterward. The default posture is minimal;
   additions carry their evidence.
2. **MECE facet cut, or an explicit merge step.** Cut facets to be orthogonal; where
   overlap is expected, add a synthesis/merge stage rather than discovering DRY
   violations in the critique.
3. **A diverse-lens critic *ensemble*, not one critic — more critics, not more
   designers.** This is the protocol eating its own dogfood: the expensive error in
   *design* is shipping an over-engineered or principle-violating design, so rigour
   concentrates on critique. Use ≥2 critics with **distinct lenses** — e.g.
   simplicity/YAGNI, completeness/"what's-missing", principle-conformance — aggregated
   by the orchestrator. The single highest-value change over v1: the marginal critic
   beats the marginal designer.
4. **Separate generation from judgment; mechanise what is mechanical.** The orchestrator
   synthesises (judgment), but structural checks can be semi-deterministic — e.g.
   "do any two facets propose the same artefact?" is a near-mechanical duplicate-detect
   that need not wait for a critic.
5. **The eat-own-dogfood symmetry.** A design panel and the artefact it designs often
   share architecture — fan-out generation → adversarial validation → synthesis — and
   the **same lessons govern both**: the adversary/critic is the heart; rigour belongs
   where the expensive error lives; separate broad generation from judgment; aggregate
   deterministically. When designing an agentic system, check whether the design
   *process* should adopt the same shape the *product* is adopting (this run chose a
   diverse-lens validation ensemble for the product; the protocol adopts the same for
   the process).

## When to use / when not

Use for genuine design decisions with a wide solution space where independent
perspectives + adversarial pruning beat one-pass-iterated. Do **not** use for trivial or
already-decided shapes (proportionality — the panel is cheap but not free, and a panel
over a forced answer is theatre).

## Graduation path

Apply on the next substantive design (the owner's "other places"), record its
effectiveness assessment the same way, and after ≥2 instances confirm the improved
protocol, graduate it to a reference runbook (PDR-120) or a Practice pattern. **Registered
in `pending-graduations.md`** (owner-directed — work in reports is easy to lose; the
register is the actively-drained anti-loss home), with its **self-improving property**
named: each application is itself a generation+critique that yields not only the design
but a refined protocol-for-running-panels, so the protocol improves itself on each use.
Until graduation, this report is the substance home and the register is the tracker.
