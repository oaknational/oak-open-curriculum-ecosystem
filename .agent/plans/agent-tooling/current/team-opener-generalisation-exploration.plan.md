---
name: "Team-Opener Generalisation — Exploration"
overview: >-
  Exploration plan (NOT decision-complete; names decisions and considerations,
  makes none) for generalising the per-thread team-opener prompt
  (`.agent/prompts/connecting-oak-resources/graph-implementation-team.prompt.md`)
  into reusable long-running-team infrastructure. The opener was pasted into
  every session of the 2026-06-10/11 graph marathon (38 agents, seven Directors,
  one contiguous session) and proved load-bearing — yet it lives as per-thread
  prose that partly duplicates the `start-right-team` SKILL and partly extends
  it. This plan frames the decomposition, the candidate homes, and the open
  questions for the owner to walk; it does not pre-decide skill-vs-template. Sits
  in the existing agent-tooling collaboration-plan estate; references rather than
  fragments it.
status: exploration
thread: agent-collaboration-research
date: 2026-06-11
related:
  - "multi-agent-collaboration-protocol.plan.md (the portable protocol estate this extends)"
  - "n-agent-collaboration-experiments.plan.md (the observe-during-real-work discipline this reuses)"
  - "../../../skills/start-right-team/SKILL-CANONICAL.md (the existing team-bootstrap SKILL; the overlap question is central)"
  - "../../../prompts/connecting-oak-resources/graph-implementation-team.prompt.md (the worked-instance opener being generalised)"
  - "../../../reports/graph-team-session-operations-and-experience-2026-06-10-11.md (the evidence base: what worked, what was friction)"
todos:
  - id: x1-decompose-the-opener
    content: >-
      Decompose the worked-instance opener into its layers and classify each as
      reusable-generic / already-in-start-right-team / genuinely-new /
      thread-specific. Candidate layering (the central analysis, to be validated
      against the opener line-by-line): (L1 GENERIC PLATFORM) the worktree-team
      model, the coordination-home convention (one checkout owns
      `.agent/state`, path-parameterised CLIs, pure-diff implementer PRs), the
      three-branch-class branching strategy, the coordination cadence, the
      Director-pure-direction contract; (L2 OVERLAP) what start-right-team
      already carries (First Moves, closeout contract, coordinator two-moments,
      heartbeat/watcher rules) — a crosswalk per `crosswalk-before-reconciling`
      to separate shared-intent / genuine-extension / drift; (L3 THREAD-SPECIFIC)
      plan authority, seat briefs with named files, hard sequencing gates, pinned
      data facts — stays per-thread by construction.
    status: pending
  - id: x2-name-the-home-options
    content: >-
      Name the home options WITHOUT deciding (owner decision; research names,
      does not make). Options surfaced so far, each with its trade: (A) fold the
      generic layer (L1) into the existing `start-right-team` SKILL — single
      bootstrap surface, but risks bloating an already-dense SKILL and conflating
      always-on bootstrap with opt-in worktree-team mechanics; (B) a NEW sibling
      skill (e.g. `start-right-worktree-team`) layering on start-right-team —
      clean separation, but a third start-right variant to maintain and a
      discoverability cost (skill-load budget); (C) skill + per-thread TEMPLATE —
      the generic mechanics graduate to a skill, the thread-specific layer (L3)
      becomes a fill-in-the-blanks template the owner instantiates per team, with
      a generator or checklist; (D) leave as prose, extract only the
      genuinely-new rules (worktree convention, branching strategy) to the
      always-on rule tier and let start-right-team point at them. The skill-load
      budget, the directive-context budget, and the no-moving-targets discipline
      are all constraints on this choice.
    status: pending
  - id: x3-evidence-from-the-marathon
    content: >-
      Mine the worked instance for what the generalisation must preserve and what
      it must fix. Preserve (proven load-bearing this session): the two-moments
      succession, handoff records, the coordination-home single-writer
      convention, Director-serialised merges, the three-loop merge-ask. Fix
      (friction the session surfaced — see the ops report §7): PR-monitoring as a
      hand-rolled per-Director loop (the comment-detection-drop recurred — a
      tooling primitive candidate); the opener clauses that were quoted *at* agents
      to catch live errors (the watcher-rewrite clause, the cadence section) —
      evidence that some opener content is doing rule-enforcement work that may
      belong in the rule tier; the host-health gap (now a rule). Source: the ops
      report + the nine experience registers + this session's napkin blocks.
    status: pending
  - id: x4-graduation-vs-skill-boundary
    content: >-
      Determine which opener content is SKILL-shaped (bootstrap workflow, run
      once per session) vs RULE-shaped (always-on invariant, trigger-loaded) vs
      PDR-shaped (portable practice doctrine). Apply `new-rule-vs-pdr-clause` and
      the directive-context-budget discipline. Hypothesis to test, not assert:
      the branching strategy and coordination-home convention are rule-shaped
      (invariants); the worktree-team bootstrap is skill-shaped (a workflow); the
      Director-pure-direction and two-moments contracts are already PDR-homed and
      the opener only instantiates them.
    status: pending
  - id: x5-owner-walk-and-disposition
    content: >-
      Owner walk: present the decomposition (x1), the home options (x2) with the
      evidence (x3) and the skill/rule/PDR boundary (x4) as an explicit
      question-with-recommended-option set. The owner chooses the home shape;
      this plan then either promotes to decision-complete with an execution track
      or spawns the implementing plan. NO execution until the owner disposes —
      this plan's job is to make the decision walkable, not to pre-empt it.
    status: pending
  - id: x6-team-closeout-needs-branch-to-main-reconciliation
    content: >-
      WORKED INSTANCE 2026-06-11 (owner-named gap): the team closeout needs a
      step a sole-session closeout does not — landing the coordination home's
      PERMANENT output on main. The coordination-home model is forward-only
      (main→branch merges; the branch is "never PR'd"), which created two
      classes of must-reach-main work but a path for only one: implementer work
      reaches main via pure-diff PRs (worked); everything authored ON the
      coordination home — ADRs, PDRs, rules, skills, governance docs, the
      memory/continuity substrate, distilled lessons, experience files — reaches
      main via NOTHING. Seven directors landed continuity waypoints faithfully
      onto a sink branch; at session end the whole arc's doctrine + learning was
      stranded off main (4 ADRs, 3 PDRs, 4 rules, 2 skills, governance docs, 12
      experience files, distilled). Owner: "docs are not secondary artefacts."
      Cure shape (to design, not assert): the team-closeout workflow gains an
      explicit branch→main reconciliation step (the divergence is typically
      conflict-free because the two sides touch disjoint paths — verify with the
      overlap analysis, then merge main→branch and PR branch→main with full CI);
      this is a `session-handoff` Team-Closeout-Owner-mode amendment AND part of
      whatever home x2 chooses. The 2026-06-11 reconciliation (this PR) is the
      first worked instance and its evidence. Cross-ref ADR-197 (coordination
      home owns registry state) which half-describes the boundary this gap sits
      on.
    status: pending
---

# Team-Opener Generalisation — Exploration

> **Status: EXPLORATION.** This plan frames a decision for the owner; it does
> not make one. Per `research-outputs-name-not-make-decisions`, the deliverable
> is a walkable decision surface (decomposition + home options + evidence), not
> a chosen design. The owner's line: *"we don't have to decide now, but we do
> need an agent collaboration thread improvement plan to explore it."*

## Problem

The team-opener prompt
([`graph-implementation-team.prompt.md`](../../../prompts/connecting-oak-resources/graph-implementation-team.prompt.md))
was **pasted into every session** of the 2026-06-10/11 graph marathon — a
contiguous run of 38 agents across seven Directors. It was not documentation
the agents read once; it was live, load-bearing infrastructure that carried the
team shape, the coordination conventions, the branching strategy, the cadence,
and the seat briefs into each session's context. Clauses from it were quoted
*at* agents mid-session to catch live errors (the watcher-rewrite
comment-detection-drop fired exactly as its clause warned).

But it lives as a **per-thread prose artefact** with two structural problems:

1. **It partly duplicates the `start-right-team` SKILL** (First Moves, closeout
   contract, coordinator two-moments) and partly **extends** it (the
   worktree-team model, the coordination-home convention, the branching
   strategy) — with no crosswalk telling a reader which is which.
2. **It mixes three altitudes** in one document: generic collaboration platform,
   the relationship to existing bootstrap doctrine, and thread-specific
   instantiation (named files, sequencing gates, pinned data facts). The generic
   layers are reusable; the thread-specific layer is not; nothing separates them.

The next long-running team will need the same generic infrastructure. Re-pasting
and re-editing a 140-line prose opener per thread is the artefact-gravity failure
mode the practice already names elsewhere.

## Why this is exploration, not execution

The obvious answer — "make it a skill" — is the owner's own hypothesis, and it
is probably *part* of the answer, but the real question is a decomposition: a
single prose artefact is doing the work of (at least) a skill, a set of rules,
and a per-thread template, and the existing `start-right-team` SKILL already owns
some of it. Deciding "skill" without the decomposition would either bloat
start-right-team or spawn a third start-right variant — both real costs against
the skill-load and directive-context budgets. The decomposition (todo x1) and the
skill/rule/PDR boundary (todo x4) are the load-bearing analysis; the home choice
(x2) is the owner's, informed by them.

## Evidence base (already in hand)

This session IS the worked instance, and its record is unusually complete:

- The **operations and experience report**
  ([`graph-team-session-operations-and-experience-2026-06-10-11.md`](../../../reports/graph-team-session-operations-and-experience-2026-06-10-11.md))
  — §2 names the continuity machinery that carried the session (the preserve
  list); §3 + §7 name the friction and the tooling backlog (the fix list).
- The **nine experience registers** (`.agent/experience/2026-06-11-*.md`) — the
  subjective texture of operating inside the choreography, including which parts
  felt like ceremony and which earned their keep.
- The **opener itself** — the artefact under generalisation.

No new data-gathering is required to start x1; the analysis is a read of
artefacts that already exist.

## Relationship to the existing estate

This plan does NOT fragment the collaboration-plan estate
(`consolidate-estate-decouple-execution`). It sits alongside
[`multi-agent-collaboration-protocol.plan.md`](multi-agent-collaboration-protocol.plan.md)
(the portable protocol) and
[`n-agent-collaboration-experiments.plan.md`](n-agent-collaboration-experiments.plan.md)
(the observe-during-real-work discipline), and references the
[`start-right-team` SKILL](../../../skills/start-right-team/SKILL-CANONICAL.md) as
the bootstrap surface whose overlap with the opener is the central question. If
x1 finds the right move is to amend an existing plan rather than stand this one
up as decision-complete, that is a valid outcome — the exploration is the point.

## Non-goals

- Choosing the home (skill / sibling skill / skill+template / rules). Owner's, at
  x5.
- Any source or artefact change before x5 disposes. This plan reads and frames.
- Re-opening the protocol doctrine (PDR-063/064/078) — those are settled and the
  opener only instantiates them; the generalisation carries them forward
  unchanged.
