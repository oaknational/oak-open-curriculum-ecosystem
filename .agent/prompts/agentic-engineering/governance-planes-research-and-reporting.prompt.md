---
prompt_id: governance-planes-research-and-reporting
title: "Practice-Aligned Direction Findings: Plan-Surface Integration"
type: handover
status: active
last_updated: 2026-04-20
---

# Practice-Aligned Direction Findings: Plan-Surface Integration

## What This Prompt Is Now

This prompt was originally seeded for broad direction-of-travel
research (governance planes, practice-methodology ecosystem, adjacent
enablers, cross-lane survey). **That research has landed.** Five
durable artefacts were produced on 2026-04-20 — see "Artefacts
already produced" below.

The next session is the **integration session**: examine the existing
`agentic-engineering-enhancements/` plans surface and decide how to
integrate the eight high-impact uplift candidates the analysis
baseline named, **without** churning the plans surface into low-signal
work.

This prompt is therefore a **handover from the research phase to the
plan-surface phase**. Read scope is everything the previous session
produced plus the existing plans surface. Write scope is research,
analysis, planning, and discovery routing only — no doctrine edits.

## Artefacts already produced (read these first)

The previous session landed five direction-of-travel artefacts and
six routing updates. Read in this order:

### Analysis baseline (start here)

- `.agent/analysis/practice-aligned-direction-and-gap-baseline.md`
  — analysis-grade comparison matrix mapping ecosystem direction-of-
  travel signals to repo-local Practice intentions, with two matrices
  (signal × intention; lane × signal coverage), explicit
  status-legend reuse with the governance-concepts baseline,
  what-not-to-import discipline, and **eight high-impact next-step
  candidates** ordered by evidence strength × repo readiness. **This
  is the load-bearing input for plan-surface integration.**

### Cross-lane synthesis

- `.agent/research/agentic-engineering/cross-lane-direction-survey.md`
  — Slice C umbrella that re-routes Slice A/B/D evidence by lane,
  with per-lane routing recommendations. Use this when scoping which
  lane each candidate belongs to.

### Reconnaissance notes (drill into where needed)

- `.agent/research/agentic-engineering/governance-planes-and-supervision/governance-plane-direction-of-travel.md`
  — Slice A trajectory analysis for 15 governance-plane projects
  with five cross-project trajectory patterns and per-project
  repo-local implications.
- `.agent/research/agentic-engineering/operating-model-and-platforms/agents-md-skills-and-plugins-direction-of-travel.md`
  — Slice B reconnaissance: AGENTS.md, Agent Skills, plugin
  marketplaces, AAIF stewardship.
- `.agent/research/agentic-engineering/operating-model-and-platforms/adjacent-enablers-direction-of-travel.md`
  — Slice D reconnaissance: evals, context engineering, agent-native
  observability, agent-native code review, agent-native VCS.

### Companion baseline (read once for shape and vocabulary)

- `.agent/analysis/governance-concepts-and-mechanism-gap-baseline.md`
  — pre-existing baseline whose status legend the new baseline
  re-uses. Pair-read when the question is "is a deferred mechanism
  now applicable?".

## The eight uplift candidates

Carried forward from the analysis baseline. Ordered by evidence
strength × repo readiness; **not** by importance.

1. **Reviewer-systems cluster** (3 candidates, single owner): expand
   `reviewer-gateway-upgrade.plan.md` scope to cover (i)
   machine-readable reviewer-suggestion artefact, (ii) per-team
   learning loop, (iii) RFC 9728 PRM audit. Single coherent uplift,
   high signal density.
2. **Inspect scorer comparison note**: short comparison note (not
   adoption) of repo's inline evidence-check shape against Inspect's
   named, composable scorer surface. Routes to safety-evidence lane.
3. **Vocabulary-alignment pass on continuity lane**: rename
   mechanism surfaces (napkin, distilled) externally with the
   ecosystem-shared "compaction", "structured note-taking",
   "just-in-time retrieval" terms. No behaviour change.
4. **Cross-platform surface matrix refresh**: collapse the surface
   matrix's columns onto the convergent primitives (AGENTS.md,
   Agent Skills, plugin marketplaces). Routes to operating-model
   lane.
5. **ADR-124 / ADR-125 amendment scope check**: scope-only check on
   (i) optional plugin-format wrappers for the Practice five-file
   package, (ii) plugin-manifest implementation extensions on
   Layer 1 vs Layer 2.
6. **MCP-governance deep dive (downstream plan candidate)**: MCP
   `2025-11-25` is the highest-signal substrate change for this repo.
7. **Backstage catalog model layer comparison note (low priority)**:
   short comparison against the repo's schema-first execution rule
   and OpenAPI-driven type generation.
8. **Agent-VCS commit-attribution ADR scope check**: scope-only
   check on whether agent-authored commits should grow explicit
   attribution metadata.

## The top unresolved question (frame for this session)

> Is the existing `agentic-engineering-enhancements/` plans surface
> sized to absorb these eight uplift candidates without churning into
> low-signal work?

**This is the question the integration session must answer first.**
Picking up any candidate before answering it risks the planning
surface accumulating low-signal scope. The framing question for the
session is therefore not "which candidate should we adopt?" but
"what is the right shape of the plans surface to absorb the
candidates that justify adoption?".

## Scope

This is a **plan-surface examination + integration-routing** session.

- ✅ Read and assess every plan in
  `.agent/plans/agentic-engineering-enhancements/`
  (current, future, archive/completed, and any research / plan-
  shaped notes at the lane root)
- ✅ Map each of the eight candidates to: (a) an existing plan that
  could absorb it cleanly, (b) a future plan that would be created
  to hold it, or (c) an explicit "defer with named trigger
  condition" decision
- ✅ Surface plans-surface scope-and-sequencing observations to the
  user as a numbered decision list
- ✅ Update plan files only with status / next-step / scope deltas
  the user explicitly approves
- ✅ Tighten discovery-routing surfaces if scope changes warrant it
- ❌ Do not adopt any candidate without owner approval
- ❌ Do not promote any candidate to doctrine (ADR, PDR, Practice
  Core, deep dive, `/docs/**`)
- ❌ Do not create new plans without owner approval
- ❌ Do not edit product code

## Ground First

Read and internalise:

1. `.agent/directives/AGENT.md`
2. `.agent/directives/principles.md`
3. `.agent/memory/distilled.md`
4. `.agent/memory/napkin.md` (the 2026-04-20 entry on
   practice-aligned project-directions research is the immediate
   context)

Then read the artefacts under "Artefacts already produced" above —
**baseline first**, then cross-lane survey, then reconnaissance notes
as needed.

Then read the existing plans surface:

- `.agent/plans/agentic-engineering-enhancements/README.md`
- `.agent/plans/agentic-engineering-enhancements/current/` (every
  active plan)
- `.agent/plans/agentic-engineering-enhancements/future/` (every
  parked plan)
- `.agent/plans/agentic-engineering-enhancements/archive/completed/`
  (skim — needed only when an existing plan is being re-opened or
  cited)
- `.agent/plans/agentic-engineering-enhancements/*.research.md` and
  any other research-shaped lane-root notes

Then read the planning conventions:

- `.agent/plans/README.md` (or equivalent plans-lane README)
- ADR-124 (practice propagation) and ADR-125 (artefact portability)
  — relevant when candidates 4, 5 are scoped

## Required Working Posture

Inherited from the research session, still binding here:

- Distinguish at every paragraph between **external concept**,
  **repo-local mechanism**, **inference**, **recommendation**.
- Apply the first question repeatedly: **could this be simpler
  without losing quality?** When in doubt, prefer "no new plan;
  expand an existing one" over "spin up a new plan".
- Do not promote a candidate just because the research session
  surfaced it. Each adoption needs an owner ruling against the
  scope-and-sequencing question above.
- When a candidate's adoption surface is genuinely absent today
  ("defer with watch" candidates from the baseline — untrusted
  persistence, durable interop tasks, policy-engine perimeter,
  dirty-file pre-commit), explicitly record the **trigger
  condition** the next session will look for, rather than queueing
  the candidate.

## Expected Outputs

Minimum expected shape:

1. **Plan-surface scope-and-sequencing analysis**
   - One ordered list of observations about the existing plans
     surface (over-scoped plans, under-specified plans, plan-shape
     drift, archive candidates, etc.).
   - One mapping of each of the eight candidates to one of:
     (a) absorbed by existing plan `<plan-name>` with named scope
     delta; (b) candidate for a new future plan `<proposed name>`;
     (c) defer with explicit trigger condition.

2. **Plan updates** (only owner-approved deltas)
   - Status, next-step, or scope updates to existing plans.
   - No new plans created without owner approval.

3. **Routing-surface updates** (if scope changes warrant)
   - Plans-lane README routing updates.
   - Cross-links from baseline / cross-lane survey into any plan
     that absorbs a candidate.

## Closeout Standard

At the end of the session:

- State what landed (plan-surface decisions, scope deltas,
  defer-with-trigger candidates, new plans if any).
- List the artefacts created or updated, grouped by lane / plan.
- Separate evidence from inference explicitly.
- Name the **next** most important unresolved question.
- Say whether the work changed only plans / discovery surfaces, or
  whether owner-approved next steps have begun any doctrine /
  product-code follow-up.
- Update `.agent/memory/napkin.md` with surprises and watchlist
  candidates.

## Out of Scope (explicit fences)

Inherited from the research session:

- No edits to ADRs, `/docs/**`, Practice Core, directives,
  principles, or any platform-adapter canonical content.
- No code changes; no quality-gate runs beyond markdownlint where
  required by the practice fitness rules.
- No promotion of speculative findings into doctrine; promotion
  happens through future planning, not in this session.

Added for this session specifically:

- No new plan created without owner approval. Spinning up a new
  plan is itself the kind of churn this session is meant to assess.
- No silent adoption of a candidate. Every adoption needs an
  explicit owner ruling.
