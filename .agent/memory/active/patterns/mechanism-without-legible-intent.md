---
name: Mechanism Without Legible Intent
polarity: anti-pattern
use_this_when: Landing or auditing an enforcement surface (rule, hook, gate, review lens) — ask where its system-level intent is legible; when agents comply with the letter, misattribute the why to a person, or cannot derive the next rule themselves, the mechanism has outrun its intent
category: agent
layer: general
proven_in: The Claude per-user memory-buffer drain (212 feedback entries, 2026-07-03..05) and the owner-ratified reflection of 2026-07-05
proven_date: 2026-07-05
barrier:
  broadly_applicable: true
  proven_by_implementation: false
  prevents_recurring_mistake: "Growing the enforcement corpus (rules, hooks, gates) while the system-level intent stays legible only through enforcement and correction — so agents letter-comply, reconstruct the why inductively as a personality model of the enforcer, and cannot generalise to the next case without a new rule"
  stable: false
---

> **POLARITY: ANTI-PATTERN.** This entry names a *failure mode to avoid*, not a shape to
> repeat. It is the named twin of
> [`passive-guidance-loses-to-artefact-gravity.md`](passive-guidance-loses-to-artefact-gravity.md):
> that pattern is intent without mechanism (guidance that never fires); this one is
> mechanism without legible intent (enforcement that fires reliably but teaches nothing).
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern).

## Principle

Mechanism yields reliability without generalisation; intent yields generalisation
without reliability; the job needs judgment held to account — both, paired. A
mechanism whose system-level intent is illegible still fires, so it looks healthy on
every compliance surface — but agents experience it as arbitrary constraint, comply
with its letter, and reconstruct the missing why inductively. The reconstruction has
a characteristic failure: **system properties get attributed to the enforcer**. When
intent is legible only through enforcement and correction, agents build a
psychological model of whoever corrects them, and file system design as personality.

The cure direction is **generative intent at system level** — a compact set of
generators from which the mechanisms are derivable (the Decision Lenses in
[`principles.md`](../../../directives/principles.md) are the proof shape; the
ADR-200 (`200-intent-as-a-living-idea-graph.md`, a file OCE holds)
idea-graph is the structural home) — **never more prose per mechanism**. The
per-mechanism Why layer already exists and context budgets are owner-ratified; the
gap this pattern names is system-level.

## The Founding Instance

The Claude per-user memory-buffer drain (2026-07-03..05) dispositioned 212
`feedback_*` entries accumulated across ~3 months of sessions. The headline finding,
owner-ratified 2026-07-05: a large fraction were "owner-personality" observations —
agents recording "the owner is like X", "the owner always wants Y" — whose substance,
checked entry by entry, was **Practice intent already realised in named mechanisms**.
The buffer was the system communicating its intent-gap through misfiled memories: the
mechanisms fired correctly for months while the intent stayed illegible enough that
every generation of agents re-derived it inductively and filed it as a person. The
same session had extracted an `owner-working-style.md` executive-memory file; the
owner's reflection reframed it — "all of it applies to the Practice rather than to an
individual; it is essentially a distillation of what the Practice is intended to
convey" — the instance/substrate inversion at the level of doctrine itself.

## Phenotypes

- **Personality-model construction** — the founding instance above; the tell is any
  "owner is like X" observation, which is a homing question about whether X is
  Practice intent (see
  [`design-from-impact-not-the-cowpath.md`](../../../rules/design-from-impact-not-the-cowpath.md)
  §Attribute System Properties to the System).
- **Letter-compliance** — the mechanism is satisfied while the intent is missed; work
  passes every gate and still lands the wrong shape.
- **Rule-corpus inflation** — without the generator legible, every new expression of
  the same intent needs its own new rule; agents cannot derive the next rule
  themselves, so the corpus grows along the enumeration axis.
- **Hook-as-obstacle** — an enforcement surface experienced as friction to route
  around rather than as a carrier of design intent.
- **Wrong-lens reviews** — reviewers apply a mechanism outside its intent's
  preconditions because only the mechanism, not the intent, was legible.

## Countermeasure

At the moment a mechanism lands (rule, hook, gate, review lens), ask: **from which
system-level generator is this derivable, and is that generator legible where agents
actually read?** If the answer is a person's judgment, the intent is not yet
expressed. The economy constraint is binding: intent expression must be *generative,
not enumerative* — a compact generator that makes many mechanisms derivable, never a
per-mechanism essay. The bidirectional pairing gate lives at
[PDR-038](../../../practice-core/decision-records/PDR-038-stated-principles-require-structural-enforcement.md)
§Un-communicated intent at maturity: intent without mechanism and mechanism without
intent are the two halves of the same incompleteness.

## Intent-Layer Seed Material (ADR-200)

The eight working-style assertions the drain surfaced, re-expressed as the
system-level intent statements they always were — each a proto idea-node
(statement + where it is realised) for the ADR-200 intent-layer harvest:

1. **Enforcement is staged: visibility before strict, explicit decision gates before
   large activations.** Realised in ADR-166 (architectural budgets), the
   visibility-before-enforcement layer in plan structure, the evidence-gated
   promotion bar across PDRs.
2. **Capture surfaces wire into existing processes, never parallel tracking — tools
   come into the loop, not alongside it.** Realised in the napkin / distilled /
   consolidate-docs lifecycle.
3. **Emergent patterns formalise through explicit graduation: candidate →
   cross-session validation → permanent home.** Realised in the patterns README
   lifecycle and the pending-graduations register.
4. **Advancement gates on real-world evidence; a pause is a load-bearing planning
   move, not a deferral.** Realised in PDR-026 (owner-directed pause amendment,
   2026-04-26).
5. **Multi-agent coordination is designed as formal, platform-independent protocol
   infrastructure.** Realised in PDR-056, PDR-050, and the collaboration-state
   substrate.
6. **Principles admit no half-measure compromises; hedged framings are refused, not
   negotiated.** Realised in principles §Architectural Excellence / §Strict and
   Complete, `no-hedging-vocabulary`, and the 2026-04-29 doctrine sharpenings.
7. **Destructive incidents are cured through structure — rule, hook, schema, gate —
   never through promised carefulness; capability is preserved by better boundaries,
   not by removing capability.** Realised in PDR-029, metacognition §Cure Shape, and
   the git-safety rule family.
8. **Consolidation surfaces are live observability infrastructure; lifecycle signals
   are acted on, and a stale status field is silent doctrine drift.** Realised in
   `agent-state-observable`, `per-user-memory-is-a-buffer`, and the fitness system.

These statements are already realised — the seed value is the *statements
themselves* becoming first-class intent nodes with `realised_by` edges when the
ADR-200 harvest runs, so the next agent derives them from the system instead of
reconstructing them from corrections.

## Forward References

- [PDR-038](../../../practice-core/decision-records/PDR-038-stated-principles-require-structural-enforcement.md)
  — the bidirectional pairing gate (§Un-communicated intent at maturity is the
  complement this pattern motivated).
- [`passive-guidance-loses-to-artefact-gravity.md`](passive-guidance-loses-to-artefact-gravity.md)
  — the named twin on the other axis.
- ADR-200 (`200-intent-as-a-living-idea-graph.md`, a file OCE holds)
  — the structural home for system-level intent (ideas as first-class nodes;
  documents and mechanisms as realisations).
- [`design-from-impact-not-the-cowpath.md`](../../../rules/design-from-impact-not-the-cowpath.md)
  §Attribute System Properties to the System — the always-on firing surface for the
  personality-model phenotype.
