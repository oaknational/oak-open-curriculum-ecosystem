---
id: workspace-taxonomy-landscape-survey
node_type: delivery
name: "Workspace taxonomy landscape survey — stochastic search far from the worn path"
overview: "Industrialise variation over the workspace-taxonomy solution space: many cheap randomised walker agents from de-correlated starting points, an annealing schedule, a quality-diversity archive of distinct viable basins, and a sliding model-tier ladder that zooms into promising regions — the primary search instrument for a target architecture, with no incumbent carrying privileged status."
status: sketch
serves: workspace-reorganisation-programme
impact_areas:
  - practice-and-estate
tickets: []
depends_on:
  - plan: workspace-classification-census
    kind: beneficial
owner_gates: []
last_updated: 2026-08-17
---

# Workspace taxonomy landscape survey

## Why this node exists

The owner's ask, verbatim (2026-08-17, direct to the lane seat): "once a
basis set is defined, can we run some sort of light weight MMMC-ish
process, start a lot of low power agents in various random points, see
where they get to, throw in some annealing, and some higher-power agents
on sliding scale to zoom into the landscape like we do with large
datasets? The further away from the worn path and established
assumptions we can get here, the more useful it will be".

The need is demonstrated, not hypothetical: the same day's basis
adjudication found that four proposer agents given four different first
principles still "recognised" an identical eight-axis candidate sheet in
near-identical order — one-shot panels sample the worn path however the
priors vary — and that the panel's strongest convergence evidence was
partly an echo of the owner's own earlier vocabulary. Panels select;
they do not explore. This node is the deliberate variation engine the
estate's selection instruments lack.

The owner then sharpened the mandate (2026-08-17, verbatim): "the
entire point of the current efforts is to stand back and ask the hard
questions about whether we arrived at the right target architecture...
we do know that the original target architecture was WRONG". This
survey is therefore the PRIMARY search for a target architecture, not a
check on a settled one: no incumbent — not the 66-entry inventory, not
the round-2 taxonomy, not any prior synthesis — carries privileged
status or deference weight in any walker brief, scorecard, or zoom
stage. Prior proposals enter the archive as ordinary points. The
independent evidence record that grounds the scorecard is
`.agent/research/workspace-basis-regrounding-2026-08-17.md`.

## Goal

A committed map of the workspace-taxonomy solution landscape: an archive
of structurally distinct, honestly scored candidate bases and layouts —
far-from-incumbent regions deliberately over-sampled — sufficient for
the owner to either re-confirm the settled v1 basis as the best-known
basin or move to a better one, before any reorganisation tranche makes
the choice expensive to revisit.

## Mechanism

The owner's MCMC-and-annealing framing, given a quality-diversity
skeleton (an elites archive per landscape region, in the MAP-Elites
family) because the deliverable is a MAP of basins, not one optimum.
Orchestrated as Workflow fan-outs; model tiers per stage.

1. **State**: a candidate is a structured artefact — axes, basis with
   carrier assignments, and classifications for a fixed probe set (the
   twelve hard cases plus a stratified sample of current workspaces) —
   comparable and scoreable by schema.
2. **De-correlated starts**: each low-power walker draws a factorial
   random seed: persona (a large pool far beyond software — taxonomy,
   logistics, zoning, registry design, archival science...), constraint
   injection ("no lifecycle concept", "tree depth ≤ 1", "exactly seven
   axes", "generated artefacts banned from git", "optimise only for
   agent token economics"...), and grounding level (repo-grounded vs
   facts-sheet-only). Walkers are FORBIDDEN the census/basis corpus —
   the anchor-avoidance mechanism proven by the 2026-08-17
   cold-generation pass. Draws are checked pairwise-distinct before
   dispatch; a fraction of walkers run cross-vendor (codex-dialogues
   MCP) to de-correlate model priors, priced separately.
3. **Moves**: a walker takes k perturbation steps from its start —
   merge/split an axis, swap a carrier, re-home a hard case, change
   cardinality ±1, invert a tree level — re-scoring each step and
   reporting its endpoint trajectory, not just the endpoint.
4. **Scorecard**: fitness scores against the owner's governing DECISION
   NEEDS (boundaries, placement, dependency direction, edit rights,
   licensing/travel, navigation, agent economics, carrier change-cost)
   and the measured independent record (git co-change and clock-tick
   data, live-mechanism facts, per
   `workspace-basis-regrounding-2026-08-17.md`) — requirements and
   measurements, never any prior proposal's solutions, so the rubric
   does not smuggle the worn path back in. Walkers may also propose
   decision needs the rubric missed; rubric-escapes route to the owner,
   never silently absorbed.
5. **Archive and descriptors**: candidates land in an elites archive
   keyed by structural descriptors (basis cardinality, primary tree
   carrier, tree depth, generated-in-git?, unit-of-description,
   repo-count). One best candidate per cell survives; distance from the
   incumbent's cell is recorded on every entry.
6. **Annealing**: early rounds run a high novelty weight and a loose
   validity bar (wild candidates survive); later rounds tighten
   validity and shift weight toward fitness. If descriptor diversity
   collapses in any round, the next round reheats (novelty weight back
   up, fresh factorial draws).
7. **The zoom (sliding scale)**: cheap walkers survey coarsely;
   mid-tier agents refine the most interesting cells (novel AND
   scoring); the top few basins get high-tier deep adjudication —
   full hard-case classification, carrier pricing, ratification-conflict
   audit — and then enter the estate's EXISTING selection machinery
   (adversarial verification, architecture expert panel) as challengers
   to the incumbent. New machinery generates; ratified machinery
   selects.
8. **Exit criteria** (named before the loop runs): stop when two
   consecutive rounds mint no new above-threshold archive cell AND the
   top basin's score is stable across those rounds, or at the hard
   budget cap, whichever first. Fleet-design review fires before the
   first paid round per `fleet-design-review-before-expensive-fleets`.

## Acceptance criteria

1. The archive artefact is committed with its scorecard data: every
   entry scored by the same schema-forced rubric, descriptors recorded,
   pairwise structural distinctness machine-checked. Proof: repo-safe —
   a validator recomputes distinctness and score-schema conformance.
2. At least the top three non-incumbent basins carry a completed
   high-tier adjudication and an adversarial verification verdict.
   Proof: repo-safe — the per-basin verdicts committed beside the
   archive.
3. A comparison statement — settled basis vs best challenger basins,
   with evidence and a falsifier per claim — is delivered at an owner
   card. Proof: owner-held — the card answer recorded in this plan's
   amendment trail.
4. Every rubric-escape (a governing decision need the rubric missed) is
   either adopted into the rubric with a re-score or routed to the
   owner by name. Proof: repo-safe — the escape register in the archive
   artefact shows a disposition per row.

## Out of scope

- Executing any reorganisation or amending the settled basis — the
  survey informs a re-ratification card; the owner disposes.
- Building a permanent generic landscape-survey instrument beyond what
  this run needs (`consolidate-at-second-consumer`; the generalisation
  candidate is recorded, not built).
- Re-running the census or re-opening its judged classifications.

## Budget shape

Named at fleet-design review, before the first paid round; the working
estimate is order 40–60 low-tier walkers, 6–10 mid-tier refinements,
2–3 high-tier adjudications plus reducers. The cap is set there and the
loop's exit criteria bind to it.

## Todos

1. Fleet-design review: walker seed pool, move kernel, scorecard rubric,
   descriptor set, annealing schedule, budget cap.
2. Probe set frozen (twelve hard cases + stratified sample) and the
   facts-sheet for ungrounded walkers authored.
3. Round 1 (survey) → archive; round 2+ per annealing schedule.
4. Zoom stages; existing selection machinery over the top basins.
5. Comparison statement; owner card; archive committed; escapes
   dispositioned.

## Amendment trail

- (none yet — born sketch, 2026-08-17)
