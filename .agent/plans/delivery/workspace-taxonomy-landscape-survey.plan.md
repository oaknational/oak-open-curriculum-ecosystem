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

1. ~~Probe set frozen (twelve hard cases + stratified sample) and the
   facts-sheet for ungrounded walkers authored.~~ Done — carried into
   the committed 1b briefs with identities stable.
2. ~~Round 1a (survey) → archive.~~ Done — 46/48 walkers, archive at
   `round-1-raw.json`, lessons banked.
3. Round 1b (challenger): instrument committed and decision-complete;
   fleet-design review with frame-challenger, codex-availability
   probe, then owner launch word after the PR-889 closeout.
4. Combined 1a+1b harvest report: archive map, per-tier attractor
   verdict, elites and outliers verbatim, escapes, descriptor-mismatch
   findings, round-2 proposal (annealing + move kernel decisions live
   there, not in 1b).
5. Zoom stages; existing selection machinery over the top basins.
6. Comparison statement; owner card; archive committed; escapes
   dispositioned.

## Amendment trail

- **2026-08-17 — round 1b decision-complete; full instrument authored
  and committed during the GitHub-incident hold.** Owner direction
  (verbatim): "please start working towards all required artefacts to
  run the 1b fleet, we need decision complete plan, a reasoning
  document detailed our decisions, including the things we decided not
  to do and why, we need the scripts, we need fleet design documents".
  Delivered, all committed before launch: walker-visible briefs
  (`.agent/research/landscape-survey-round1b-briefs-2026-08-17.md`),
  operational fleet spec
  (`.agent/research/landscape-survey-round1b-fleet-design-2026-08-17.md`),
  design rationale with the roads not taken
  (`.agent/research/landscape-survey-round1b-design-rationale-2026-08-17.md`),
  the runnable workflow script and the mechanically regenerated
  falsifier packet (both under the survey report home). Same day the
  owner added the codex CLI arms ("A few Sol ultra, many Terra medium?
  Not instead of but in addition to?"): +12 terra-medium seats
  mirroring the haiku constraint-grade arm and +3 sol-ultra seats
  (baseline, rich persona, falsifier), probed live via headless
  `codex exec` before being designed in. The fleet-design review then
  ran per the rule — assumptions-expert and frame-challenger (both
  opus) plus a cricket — and its absorbed cures reshaped the round:
  the ADR-041/README blindness leak closed (class-level FORBIDDEN
  list, grounding-a allowlist with per-path read logging and a
  listings cap, READ-NOTHING seal on all non-repo groundings); a
  de-ontologised free-form arm and decoy-estate stimulus controls
  added; falsifiers given the power to return "sound" and one
  falsifier re-aimed at the instrument itself; requirement variants
  re-cut to differ in concern cardinality (3/7/12, balanced 6/6/6);
  B2 replication baselines making grounding-b the attractor test's
  n=2 headline column; grade-3 carrier-ban seats at opus and fable;
  bounded/owned/reaped discipline on every CLI spawn; and the
  falsifier packet inlined so no falsifier holds repository access.
  The fleet is now 64 walkers + 4 decoy controls + 5 falsifier-arm
  seats + 4 synthesis seats; combined cap ~3.25M tokens, PRESENTED to
  the owner at the launch-word gate. Launch gates remaining, in
  order: end-to-end relay smoke on both vendor paths with the real
  schemas; the zero-cost 1a ADR-041-echo probe over the committed
  archive; the mechanical baseline (co-change + import-graph
  partitions injected as `origin=mechanical` corpus entries); the
  owner's launch word after the PR-889 closeout ("Let's get 889
  sorted before we run round 1b").
  Committing the entire walker-visible instrument BEFORE launch also
  cures 1a's knowledge-preservation miss (its walker texts lived only
  in the session-persisted script; 1b's probe texts were reconstructed
  from archive echoes with identities held stable).
- **2026-08-17 — round-1a lessons folded; round 1b is a challenger, not
  an extension.** Round 1a ran (46/48 walkers; archive committed at the
  report home) and its probes exposed three instrument limits: the
  model-prior question undischarged (40/46 walkers one model), a
  missing unseeded baseline arm, and probable rubric leakage (the
  six-item decision-needs list correlating with the 5-6 classification
  mode). Owner rulings absorbed verbatim into
  `.agent/research/fleet-design-lessons-2026-08-17.md`: the
  persona-uptake gradient (Haiku constraints-only with graded
  stringency; persona depth scales with tier) and the
  challenge-not-extend requirement ("1a is an interesting point in the
  landscape... but we know it is biased and twisted in ways that
  surprised us"). Round 1b therefore adds: per-tier unseeded baselines
  (prior fingerprints), tier-matched seeding, rubric-blinded prose
  requirements in two variants, a falsification arm attacking 1a's
  dominant elite verbatim, independent re-reduction by a different
  tier with a comparator stage, parser-not-transcriber cross-vendor
  relays, in-prompt read caps, and no walker self-scores. Budget
  estimates now price read traffic; 1a's overshoot (~3.5M vs ≤1.1M
  estimated) is recorded.
- (born sketch, 2026-08-17)
