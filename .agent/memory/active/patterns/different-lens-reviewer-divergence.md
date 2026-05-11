---
name: "Different-Lens Reviewer Divergence"
polarity: pattern
category: agent
status: proven
discovered: 2026-05-11
proven_in: "Graduation-candidates-drain session (2026-05-11) — two phases × three reviewers each (betty + docs-adr + assumptions; fred + betty + docs-adr) returned structurally distinct findings every time; no two reviewers in the same phase surfaced the same concern. The divergence was the value, not noise. Earlier instance: Dusky Masking Cloak 2026-05-11 graph execution-prep step 2 noted the same shape (betty vs code-expert on Inc.1 decomposition — different lens, different gap)."
---

> **POLARITY: PATTERN.** This entry names a *shape to repeat*, not a failure mode to avoid.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern) for the polarity discipline.

# Different-Lens Reviewer Divergence

When multiple reviewers are dispatched in parallel against the same
artefact, the **expected outcome is divergent findings**, not
convergent ones. Each reviewer carries a distinct lens; the lenses
catch different gaps; the union of findings is the coverage. Reading
divergence as redundancy-failure or noise is the failure mode — it
discards the value the dispatch was designed to deliver.

## Pattern

Multi-reviewer dispatch is **multi-lens coverage**, not redundant
validation. Three observations make the pattern operational:

1. **Each reviewer has a named lens.** `architecture-expert-betty`
   reads for cohesion, coupling, change-cost trade-offs.
   `architecture-expert-fred` reads for principles-first ADR
   compliance and import-direction correctness.
   `architecture-expert-wilma` reads for resilience and failure
   modes. `assumptions-expert` reads for load-bearing-but-untested
   premises. `docs-adr-expert` reads for documentation quality and
   cross-reference coherence. `code-expert` reads for correctness
   and maintainability. Each lens has a different fovea; what is
   sharp under one is peripheral under another.
2. **Divergence is the signal.** When three reviewers return three
   structurally distinct findings, the dispatch has done its job —
   each lens caught a gap the others would have missed. Convergence
   on the same finding is a separate signal (depth-of-concern
   indicator: ≥2 lenses seeing the same thing means the concern is
   load-bearing, not lens-specific), but divergence is the default
   expectation, not a failure of dispatch.
3. **Substance-ripeness is measured per lens.** A two-reviewer
   dispatch where one returns GO and one returns GO WITH CONDITIONS
   is not "ambiguous"; it is the two-lens reading. The conditions
   from the GO-WITH-CONDITIONS lens are real findings, not lens-
   noise to be averaged away against the GO lens.

## When This Matters

- **High-stakes governance edits** (ADR amendments, PDR authoring,
  matrix changes). The risk of a single-lens miss is largest exactly
  where the artefact carries the most weight. Dispatch ≥3 reviewers
  with deliberately different lenses; treat divergent findings as
  the dispatch's primary product.
- **Cross-boundary artefacts** (boundary between substrate and
  consumer; boundary between portable doctrine and host
  implementation). The boundary surface is where lens differences
  carry the most signal — one lens reads from the substrate side,
  another from the consumer side, a third from the principles side.
- **Pre-emptive landings** (acting on substance ripeness before the
  literal trigger threshold is reached). Multi-lens convergence on
  the substance-ripeness reading is the legitimacy check; multi-lens
  divergence on the same reading is a request to wait for stronger
  signal.

## When This Does Not Apply

- **Single-lens artefacts.** A trivial formatting fix or a
  type-signature tweak does not need multi-lens dispatch; one
  appropriately-routed reviewer is sufficient. Multi-lens dispatch
  on trivial work is reviewer-budget waste, not coverage.
- **Confirmation-seeking dispatches.** Sending three reviewers with
  the explicit framing "tell me this is fine" produces low-quality
  convergence regardless of lens. The pattern requires open
  briefs — see `non-leading-reviewer-prompts`.

## Related

- [`non-leading-reviewer-prompts`](non-leading-reviewer-prompts.md) —
  prompt shape; divergence requires open prompts, leading prompts
  produce false convergence regardless of lens.
- [`route-reviewers-by-abstraction-layer`](route-reviewers-by-abstraction-layer.md) —
  which reviewer to pick; this pattern is about what to expect from
  dispatching several of them in parallel.
- [`reviewer-widening-is-always-wrong`](reviewer-widening-is-always-wrong.md) —
  scope discipline; divergence is about *finding-set* coverage, not
  about reviewers widening their own scopes.
- PDR-shaped general form: candidate for graduation if the same
  divergence-as-coverage shape recurs across multiple repos in the
  Practice network. Until then, this is a repo-local instance.

## Falsifiability

The pattern is falsified if a multi-reviewer dispatch returns
convergent findings (same gap surfaced by all reviewers) on a
non-trivial artefact and the convergence is *not* a depth-of-concern
indicator. The 2026-05-11 graduation-candidates-drain instance had
six dispatches across two phases; in zero cases did two reviewers
return the same finding by accident. If a future multi-reviewer
dispatch on comparably high-stakes work returns three identical
findings, the pattern's lens-divergence claim needs revisiting.
