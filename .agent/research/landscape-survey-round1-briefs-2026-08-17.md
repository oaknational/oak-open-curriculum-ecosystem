# Landscape survey — round-1 briefs for owner review

The fleet-design package for `workspace-taxonomy-landscape-survey`
round 1, presented before any walker runs (owner's word, 2026-08-17:
"Show me the briefs first"). Nothing below executes until the owner
clears it.

## 1. The walker brief (template, verbatim skeleton)

> You are designing how a TypeScript monorepo estate should be
> organised into units of code — what makes two things separate units,
> where units live, how they are named, and how the rules are
> enforced. You have never seen this estate's current plans or
> analyses, and you must not seek them out.
>
> FORBIDDEN (reading any invalidates your run — say so if you do):
> anything under `.agent/research/`, `.agent/plans/`,
> `.agent/reports/`, `.agent/memory/`, any worktree checkout, any file
> whose name mentions census, inventory, basis, reorganisation,
> taxonomy, or deconstruction; PR bodies and git log messages.
>
> YOUR STARTING FRAME: {PERSONA}. YOUR CONSTRAINT: {CONSTRAINT}.
> YOUR GROUNDING: {GROUNDING}.
>
> TASK: produce a complete organisational proposal — the questions
> your design answers, the minimal set of independent classifications
> it rests on, the concrete carrier for each (directory level, name
> convention, manifest field, enforcement rule, derived from the
> dependency graph), the tree or layout it implies, and your
> classification of the {PROBE SET}. Take {k} deliberate revision
> steps: after your first complete proposal, apply {k} perturbations
> (merge/split a classification, swap a carrier, re-home a probe case,
> change your set's size by one, invert a layout level), keeping each
> change only if it improves your design against your own stated
> questions. Report the trajectory, not just the endpoint.

Walker-visible text never mentions axes by any established name, prior
proposals, workspace counts, or target shapes. `{k}` = 3 in round 1.

## 2. The factorial seed pool

Draw = persona × constraint × grounding; pairwise-distinct verified
before dispatch; draws logged in the archive.

**Personas (16)**: research librarian; warehouse logistics designer;
biological taxonomist; database normalisation theorist; city zoning
planner; supply-chain auditor; legal-code drafter; game-modding
platform architect; package-registry operator; OS filesystem designer;
electrical-grid engineer; museum collections curator; air-traffic
controller; publishing-house managing editor; mycologist; naval
architect.

**Constraints (12)**: no lifecycle/clock concept permitted; tree depth
≤ 1 (flat); exactly seven classifications; exactly two; generated
artefacts may not live in version control; optimise only for
AI-agent token economics; optimise only for a future 5-team human org;
every rule must be machine-checkable or discarded; the estate must
split into ≥2 repositories; nothing may be renamed (organise by
metadata only); licensing is the primary lens; assume the estate
doubles in size within two years.

**Groundings (3)**: (a) repo-direct — walker reads the live repo
(tree, manifests, configs, source); (b) facts-sheet — walker receives
only the neutral facts sheet (§5) with no directory vocabulary; (c)
requirements-only — walker receives only the decision needs (§3.1)
and scale numbers.

## 3. The scorecard rubric (schema-forced, applied by every walker and scorer)

### 3.1 Fitness dimensions (0–5 each, evidence required)

1. **Boundary fitness** — does the proposal's minting rule respect the
   measured co-change record (the 12-month pair data in
   `workspace-basis-regrounding-2026-08-17.md`)? Splits it implies
   across ≥85% co-change pairs score low; boundaries matching
   measured independence score high.
2. **Governance answerability** — can import direction, edit rights,
   licence/travel, regeneration, and membership each be answered by
   reading ONE declared thing?
3. **Enforcement honesty** — proportion of the proposal's rules that
   are recomputable by an instrument vs declared-only vs vigilance.
4. **Carrier economy** — contested or unstable classifications sit on
   cheap carriers (fields, names) not expensive ones (tree levels);
   at most two classifications spend tree levels.
5. **Agent economics** — config surface per unit, path
   predictability (guess-without-listing), fence legibility (can a
   rule be stated as one glob?).
6. **Change robustness** — cost to revise the organisation itself
   later; absorbs the five future classes (second curriculum
   upstream, new product app, npm extraction, new commodity adapter,
   second demo team) without re-rooting.
7. **Migration realism** — bounded, sequenceable cost from today's
   actual tree.

**Validity bar (round 1, deliberately loose)**: forced-fit on at most
3 of the 12 probe hard cases; no dimension scored 0 with the walker's
own admission. **Novelty weight 0.6** in the round-1 selection score
(anneals down in later rounds).

**Rubric escapes**: a walker may declare a decision need the rubric
misses; escapes are archived and routed to the owner, never absorbed
silently.

### 3.2 Probe set

The 12 hard cases (stated neutrally in walker text — e.g. "a spec
snapshot fetched from an external service and a bulk dataset from the
same service, refreshed on different schedules"), plus a stratified
sample of 8 current workspaces spanning size, licence class, and
authorship mix.

## 4. Archive descriptors (the landscape's coordinates)

cell = (basis cardinality | primary tree carrier: role / family /
stratum / clock / authorship / flat / other | tree depth 0–3+ |
generated-in-git: yes / no / partial | unit of description | repo
count). One elite per cell; every entry records its distance from
every previously visited cell. Prior-round proposals (the four panel
proposals, both syntheses, the cold pass, today's live tree) enter as
ordinary archive points with no privileged status.

## 5. The neutral facts sheet (grounding b)

Scale: ~10,800 tracked files, TypeScript ESM, pnpm + turbo build
graph, ~5,900 commits/year, 308 multi-unit commits/year. External
services: one proper-noun curriculum platform (spec + bulk + live
queries, one credential, measured refresh rates 29/7/year), one
commodity search cluster, auth/observability/deploy commodities.
Licence classes: MIT code, OGL curriculum content, reserved brand
assets — coexisting, never mixable in one unit. Workforce: primarily
AI agents under human ownership. Product surfaces: an MCP curriculum
server, a search CLI, two demo apps, agent tooling, design system.
Generated artefact classes: spec-derived types (regenerates ~29×/yr),
search contracts (~16×/yr), bulk schemas (~7×/yr), mined corpus data
(24MB, ~19×/yr), an embedded widget (~18×/yr). Measured co-change
pair data and clock rates available on request as raw numbers.
(No directory names, no workspace counts, no axis vocabulary.)

## 6. Round-1 shape and budget

- **48 walkers**: 16 personas × 3 groundings, constraints drawn to
  make every draw pairwise-distinct; 6 of the 48 run cross-vendor via
  codex-dialogues for prior de-correlation (availability checked at
  launch; shortfall reported, never silently substituted).
- **Walker tier**: low-power by design (the owner's MCMC intent) —
  haiku-tier models, low effort, ~12–18k tokens each.
- **Reduce**: one clustering reducer builds the archive (descriptor
  extraction, cell assignment, novelty distances) + one validity
  scorer pass; mid tier.
- **Round-1 budget**: ≤ 1.1M tokens all-in. Proposed whole-survey cap
  (rounds 2–3 + zoom + final adjudication): 3.5M tokens — the owner
  sets or amends this number.
- **After round 1 the owner sees**: the archive map (cells populated,
  elites per cell, the wildest viable outliers verbatim), rubric
  escapes, and the round-2 annealing proposal — before round 2 spends.

## 7. Exit and kill

Survey exits when two consecutive rounds mint no new above-threshold
cell AND the top basin is stable — or at the budget cap. Kill switch:
any round may be stopped mid-flight; the archive is committed after
every round, so no partial round loses knowledge.
