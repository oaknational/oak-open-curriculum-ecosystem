---
name: "Worktree Pilot — Consolidation and Model Verdict"
status: active
overview: >
  The landing phase of the worktree-pilot exercise: complete the parallel-safe
  lanes the dissolved team left parked, then fold the captured evidence into the
  worktree-per-agent transition plan and render a first-hand verdict on whether
  the Director + worktree-per-agent operating model reduced coordination cost,
  added it, or merely relocated it. The operating model is on trial — see "The
  Operating Model Is On Trial". The Director directs this plan; how to take that
  seat lives in the director brief (director-handoff.md), not here.
lineage:
  serves_thread: agentic-engineering-enhancements
  serves_stream: agent operating substrate / developer-and-agent experience
  strategic_choice: >
    multi-developer transition (one-dev-many-agents -> many-checkouts,
    variable agent density, author-agnostic substrate)
  derives_from: >
    worktree-pilot-coordination.plan.md (active, the pilot this lands);
    worktree-per-agent-transition.plan.md (future, the strategy this feeds);
    the Director/minimum-action operating model (owner-framed 2026-06-24);
    F-83 shared-checkout coupling
todos:
  - id: l-sonar-s8707
    content: "L-Sonar: land Sonar S8707 sites 2-3 + integrated security re-review (one PR to main)"
    status: pending
  - id: l-wsb-d2d5
    content: "L-WS-B: complete WS-B D2-D5 explain effort-orientation surface (branch off main, PR to main)"
    status: pending
  - id: l-data-sources
    content: "L-DATA-SOURCES: author docs/governance/DATA-SOURCES.md (owner-gated on the governance criteria)"
    status: pending
  - id: l-verdict
    content: "L-Verdict: fold the lanes' evidence into the worktree-per-agent plan; write the model verdict; archive pilot"
    status: pending
    depends_on: [l-sonar-s8707, l-wsb-d2d5, l-data-sources]
isProject: false
---

# Worktree Pilot — Consolidation and Model Verdict

> **Lineage (interim oak-plan homing discipline):** this plan serves the
> `agentic-engineering-enhancements` thread under the agent-operating-substrate
> stream; it derives from the multi-developer-transition strategic choice and
> F-83, via the active `worktree-pilot-coordination.plan.md` (the pilot it
> lands) and the future `worktree-per-agent-transition.plan.md` (the strategy it
> feeds). The full vision->strategy->stream->thread->plan chain becomes
> machine-traversable edges under ADR-200's living-idea-graph rewrite; this
> frontmatter `lineage` block is the lightweight interim until those edges land.

**Status**: 🟡 PLANNING — multi-session landing arc
**Scope**: Land the parked parallel-safe pilot lanes, fold their evidence into
the strategy plan, and render a verdict on whether the operating model reduced
coordination cost.

> **Live state lives in the handoff, not here.** Which lane is in flight, branch
> names, commit SHAs, the worktree inventory, and any paused/in-flight status are
> in the `CURRENT HANDOFF STATE` section of the
> [director brief](../../../memory/operational/director-handoff.md). This plan
> carries scope and acceptance only — one fact, one home. A plan that restates
> volatile state goes stale the moment it is written.

---

## End Goal, Mechanism, Means

**End goal** (the outcome this arc must produce):

Two things must be true at the close. First, every lane the dissolved pilot team
left parked is either landed to `main` or cleanly handed off with a durable
record — no orphaned work, no half-merged state. Second, the repo holds a
**first-hand, evidence-backed verdict** on the Director + worktree-per-agent
operating model: a decision-grade statement of whether it *reduced* the
coordination cost an n>=2 window pays, *added* cost, or *relocated* it — folded
into the future `worktree-per-agent-transition.plan.md` so its promotion is
decided on evidence rather than enthusiasm. The model is **on trial** (see the
section below); this arc reaches the verdict, it does not assume it.

**Mechanism** (why this work produces that outcome):

The pilot was deliberately bounded and reversible so the operating model could be
*observed under load* and then *judged*. The landing work is not incidental: it is
the final stretch where the model's costs and benefits are most visible —
cross-session Implementer handoffs, Director routing under fast-moving reality,
succession, and the prose-only cures the pilot leaned on. Completing the work
first-hand is what generates the decisive observations; consolidating them into
the strategy plan is what turns observation into a promotion decision.

**Means** (the work, as four lanes — three parallel-safe producers and one
consumer):

- **L-Sonar** — Sonar S8707 sites 2-3 plus the integrated security re-review;
  one PR direct to `main`.
- **L-WS-B** — WS-B D2-D5, the explain effort-orientation surface; branches off
  `main`, PR to `main`.
- **L-DATA-SOURCES** — author `docs/governance/DATA-SOURCES.md`; owner-gated on
  the suitability / last-reviewed / removal criteria (a new governance policy
  ADR-157 omits).
- **L-Verdict** — fold the lanes' coordination-cost evidence into the future
  `worktree-per-agent-transition.plan.md`, write the model verdict, archive the
  pilot. This is the only lane that depends on the others, because it consumes
  their evidence.

The three producer lanes are **largely independent and parallel-safe**: none
gates another. Only L-Verdict depends on them — it cannot reach a decision-grade
verdict before the lanes it adjudicates have run. (The coordination→main merges
the dissolved team had parked are **done**: PRs #221 and #222 landed to `main`,
release 1.35.0; that session is complete context, not a forward lane.)

---

## The Operating Model Is On Trial

This is the load-bearing framing of the whole arc, so it is stated once, here,
and referenced from elsewhere.

The pilot introduced a three-agent, cross-session operating contract: a
long-lived **Director** (minimum action — routes, absorbs compressed verdicts,
writes load-bearing continuity; runs no gates, edits no source) presiding over
ephemeral **Implementers** isolated in their own git worktrees. The role doctrine
is [PDR-117](../../../practice-core/decision-records/PDR-117-director-and-implementer-roles.md);
how an agent takes the Director seat is the
[director brief](../../../memory/operational/director-handoff.md). Neither is
re-derived here.

What this plan must NOT do is treat the model as settled and merely execute it.
The pilot is the evidence-gathering step for the future
[worktree-per-agent-transition.plan.md](../future/worktree-per-agent-transition.plan.md);
that plan's promotion turns on whether the coordination overhead the
commit-window protocol exists to manage *drops measurably*. So this arc carries an
adjudication obligation alongside its execution obligation: in the final fold it
asks **did the Director/worktree model reduce coordination cost, add it, or
relocate it?** — and answers from first-hand observation of this arc's own
sessions, not from the pilot's optimistic self-report.

The honest null hypotheses the verdict must be able to defend or reject:

- **Worktree isolation null:** worktrees added setup/disk cost and bring-up
  friction (F-85..F-93) that outweighed the F-83 collisions they prevented.
- **Director model null:** the Director seat was a routing tax and a succession
  hazard (the false-liveness heartbeat; the premature-takeover collision) that a
  flat peer arrangement would not have paid.
- **Prose-cure null:** the model's safeguards were doctrine-only (prose rules,
  not mechanical gates). Director diligence already failed once on a prose-only
  rule, so the verdict must judge whether the prose cures held *under load*, not
  merely whether the rules were written down.

The verdict is decision-grade only if it engages these nulls with evidence from
this arc, not only the pilot's prior run.

---

## Design Principles

1. **Adjudicate, do not assume.** The model's value is the open question; the
   verdict produces a model observation, not just a status.
2. **Land or cleanly park — never orphan.** Each lane ends merged or handed off
   with a durable record; no half-merged state.
3. **State volatile facts once, in the brief.** SHAs, claims, branch names, and
   the worktree inventory live in the director brief's `CURRENT HANDOFF STATE`;
   this plan references, never duplicates.
4. **Evidence is first-hand.** The verdict rests on observations from this arc's
   own sessions, read first-hand, not on the pilot's self-report relayed.

**Non-Goals** (YAGNI):

- Re-authoring PDR-117 or the director brief — both exist; this plan references
  them.
- Building the `claims adopt/transfer`/`set-handoff` CLI primitive. The `claims`
  CLI has no native way to adopt a retained claim or set `handoff_record_path`
  on an existing claim (PDR-063 step 3); this arc *encounters* that friction at
  every Implementer handoff but its cure is a tooling-backlog item (see
  Dependencies → Beneficial), not a deliverable here.
- Promoting the future worktree-per-agent plan — this arc *feeds* its promotion
  with evidence; the promotion decision is the owner's and is separate.
- The explain canonical-refinements decomposition — a separate follow-on in its
  own family, not bundled into this consolidation. (DATA-SOURCES.md is in scope
  as L-DATA-SOURCES, owner-gated on its governance criteria.)

---

## Session Discipline

See [`../../templates/components/session-discipline.md`](../../templates/components/session-discipline.md).
The four disciplines apply to every session in this plan.

1. **Template-not-contract:** this plan is shaped as lanes, not a fixed session
   count. The three producer lanes may run in any order, in parallel, or be split
   across seats; only L-Verdict must follow them. The lanes are load-bearing; any
   session count is a projection.
2. **Mid-arc checkpoints:** each producer lane closes with a model observation
   recorded for L-Verdict to consume — not a separate ceremony, but the evidence
   the lane owes (did Director routing / the worktree handoff / the prose cures
   help, tax, or relocate the cost?). L-Verdict *is* the terminal checkpoint.
3. **Context-budget thresholds:** a session stops at the next natural boundary
   when wall-clock reaches ~30 minutes of continuous agent work or context
   reaches three-quarters of the window. **Plan-specific amendment:** the Director
   seat carries cross-session context; a re-spun deep-context Director does NOT
   reset its budget, so a security- or quality-critical lane (L-Sonar especially)
   gets a genuinely fresh Implementer seat, never a re-spin of a spent one.
4. **Metacognition at session open:** each session opens with the inherited-framing
   check; invoke `/oak-metacognition` if the answer is uncertain. Most load-bearing
   on the producer lanes, where the "is the model helping?" framing is freshest
   and most at risk of being assumed rather than tested.

---

## Lifecycle Triggers

See [`../../templates/components/lifecycle-triggers.md`](../../templates/components/lifecycle-triggers.md).

- **Session entry:** the Director rehydrates from the director brief (seat
  procedure + `CURRENT HANDOFF STATE`) and runs its readiness self-check before
  claiming authority. An Implementer runs `start-right-quick` and reads its lane's
  handoff record first-hand.
- **Work-shape declaration:** each session names its landing target (one PR or one
  clean handoff). The Director routes durable lanes, not real-time pickups.
- **Pre-edit coordination:** register touched areas in `active-claims.json` via
  explicit `--active`; arm the all-channels comms watcher as the first move, before
  any coordination — it is constitutive of team membership, not optional ceremony.
- **During work:** verify a target agent's current state right before routing it;
  route nothing to an agent told to close out — route to its successor. Verify a
  PR's inline review comments first-hand, not just `gh pr checks`.
- **Session handoff:** close own claims; refresh the director brief's
  `CURRENT HANDOFF STATE`; stop the Director heartbeat at stand-down (false-liveness
  risk — but see the outage caveat under Risk Assessment). A retiring Implementer
  freezes at a clean boundary with a durable record.
- **Consolidation:** run `/oak-consolidate-docs` after each landing session; the
  full evidence fold is L-Verdict itself.

---

## Lanes: Targets and Acceptance

Acceptance is stated as outcomes — what is true after the lane lands — with a
deterministic check where one exists, plus the model observation each producer
lane owes to L-Verdict.

### L-Sonar — Sonar S8707 sites 2-3 (security lane to main)

**Landing target:** one PR merged to `main` clearing all three S8707 sites.

**Acceptance (outcomes):**

1. SonarQube `tssecurity:S8707` shows zero open instances on the project and the
   `new_vulnerabilities_severity` condition is no longer ERROR (verify via the
   SonarQube quality-gate status, not the local diff).
2. Sites 2 and 3 each ship with a containment test that FAILS without the fix
   (TDD-proven), per-site base verified first-hand.
3. The integrated security-expert re-review passed on the dispatch/path seams,
   real-time (no backfill).
4. The PR merged via @jimCresswell code-owner review; the branch is an ancestor
   of `main`.

**Model observation owed:** did the Director's routing of this solo lane (and any
fast-window re-routing churn) *reduce* the Implementer's coordination load or *add*
a routing tax? Cite the comms stream.

### L-WS-B — WS-B D2-D5 (explain effort-orientation surface)

**Landing target:** D2-D5 complete and landed (branch off `main`, PR to `main`),
or explicitly descoped at the embedded pre-ship gate with an owner decision
recorded.

**Acceptance (outcomes):**

1. The explain effort-orientation surface is discoverable and followable by an AI
   assistant against the REAL MCP server (verified by exercising the resource on
   live sources, not fixtures), with zero curriculum-domain leakage — the
   effort/ecosystem-domain firewall holds.
2. The single-sourcing drift-guard test passes (canonical behaviour sections
   fingerprinted; divergence fails the gate).
3. The pre-ship gate is satisfied: the new expert audiences and the DATA-SOURCES
   governance pointer are either worked in OR descoped with an owner decision
   recorded — not silently dropped.
4. The Director inspected the actual committed body first-hand at the D2 review
   boundary (not a relayed verdict).

**Model observation owed:** did the worktree + durable-handoff hand a cold pickup
a working surface, or did the budget-not-reset / claims-adopt frictions tax the
handoff? Cite the handoff record and the comms stream.

### L-DATA-SOURCES — DATA-SOURCES governance artefact

**Landing target:** `docs/governance/DATA-SOURCES.md` authored and landed, or the
owner decision on its criteria recorded if the artefact is deferred.

**Acceptance (outcomes):**

1. The artefact records, per data source, the suitability / last-reviewed /
   removal criteria — the governance policy ADR-157 omits.
2. The criteria themselves are owner-decided (this is a new governance policy, not
   an agent call); the lane does not invent them.

**Owner gate:** the suitability/last-reviewed/removal criteria are an owner
decision (surfaced under Dependencies → Blocking). The lane drafts structure and
candidates; it does not set the policy unilaterally.

### L-Verdict — Evidence fold and model verdict

**Landing target:** the verdict written into the future plan; the pilot archived.

**Acceptance (outcomes):** see the arc-wide acceptance below — L-Verdict IS the
arc's terminal acceptance.

**Depends on:** L-Sonar, L-WS-B, L-DATA-SOURCES (the verdict consumes this arc's
own observations from the lanes it adjudicates).

**Evidence captured for the verdict (2026-06-29 arc — input, not yet adjudicated).**
The model-verdict decision is owner-routed to a fresh-context synthesis session;
these observations are conserved here so that session weighs them first-hand:

- **Shared-primary-checkout co-residence is the single upstream cause behind a
  cluster of symptoms otherwise filed separately.** When an Implementer built in
  the shared primary checkout rather than its own worktree, four downstream harms
  followed from one root: (a) a whole-tree pre-commit gate self-block (one
  session's WIP blocking another's commit — the F-83 class); (b) misattribution
  (a peer read a stale claim name and attributed WIP to the wrong agent); (c) a
  lost claim (heads-down with no heartbeat → orphan-rebalanced away); (d) index-lock
  contention. Each was originally attributed locally; together they point at the
  shared checkout. This is the strongest single piece of evidence *for* the
  worktree-per-agent transition — every symptom is one the transition dissolves.
- **Operational corollary for the verdict / strategy plan:** an Implementer's
  source build belongs in its **own worktree from the first edit** — claim and
  open the worktree *before* the first source edit, never the shared
  primary/coordination checkout. (Whether this becomes standing doctrine depends
  on the model verdict; captured here as the lane's evidence, not yet ratified.)

---

## Acceptance Criteria (Arc-Wide, Outcome-Based)

"Done" for the whole arc means all of the following are observably true:

1. **No parked lane remains.** Sonar S8707 cleared on `main`; WS-B D2-D5 landed or
   owner-descoped at its gate; DATA-SOURCES landed or its criteria owner-decided.
   Verify each against `main` / SonarQube / the live MCP server, not a local
   branch.
2. **The strategy plan carries this arc's evidence.** The future
   [worktree-per-agent-transition.plan.md](../future/worktree-per-agent-transition.plan.md)
   §Strategic Acceptance Criteria / Success Signals and §Promotion Trigger are
   updated with first-hand evidence from this arc: F-83 incident count,
   coordination-home coherence confirmation, and the claims-ergonomics frictions
   linked to their backlog home. The next reader sees "condition met on <date>,
   evidence: <pointer>", not "in progress".
3. **The model verdict is written, decision-grade, and load-tested.** A named
   section in the future plan states whether the Director + worktree model
   **reduced, added, or relocated** coordination cost, engaging all three null
   hypotheses (worktree-isolation; Director-model; **prose-cure**) with evidence
   from this arc's sessions. It explicitly assesses whether the doctrine-only
   (prose) cures held under load — not merely whether the lanes shipped — since
   Director diligence already failed once on a prose-only rule. The verdict either
   advances the strategy plan to "promotion-ready, owner-sequenced" or names the
   specific cost that blocks promotion; it does not leave the question open.
4. **The pilot is archived clean.** The active
   `worktree-pilot-coordination.plan.md` is closed with an archival note pointing
   to the graduated evidence in the future plan; the director brief's
   `CURRENT HANDOFF STATE` reflects the dissolved, landed end-state.

This is NOT "all lanes completed." It is: every lane landed, the strategy plan
evidence-backed, and the on-trial model adjudicated against its nulls.

---

## Quality Gates

**Per-lane gates** (after each landing commit, on the worktree that owns it):

```bash
pnpm portability:check       # path/reference integrity (catches machine-local paths)
pnpm markdownlint:root       # doctrine/plan doc cleanliness
pnpm format:root             # style consistency
```

**Lane-specific gates:**

```bash
# L-Sonar: the workspace pre-commit gate on the touched workspace, then the
#   SonarQube quality-gate status on the PR before declaring the lane clear.
# L-WS-B: exercise the explain resource against the REAL MCP server, not the
#   fixtures, before accepting D-cycle acceptance. Confirm the aggregate gate
#   actually ran the suites the change touches (a green aggregate certifies only
#   the suites it runs; test:smoke / test:experiment are not in it).
```

A successful push already ran the full gate; do not re-offer a confirmation run
to prove green.

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Verdict collapses to "the model worked" without engaging the nulls | Med | High | Acceptance criterion 3 requires all three nulls addressed with this-arc evidence; metacognition at session open guards the assumption |
| Prose-only cures judged solely by "the rule was written", not by whether they held under load | Med | High | Acceptance criterion 3 mandates assessing the prose cures under load; the prose-cure null is a first-class hypothesis the verdict must engage |
| Volatile state leaks into this plan and goes stale | Med | Med | Volatile facts live only in the director brief's CURRENT HANDOFF STATE; this plan references, never duplicates |
| Cold WS-B pickup taxed by claims-adopt friction | High | Low | Friction is named (Non-Goals + Dependencies); durable handoff record + warm worktree carry the cold pickup; L-WS-B records the tax for L-Verdict |
| Fast-window re-routing churn orphans work | Med | Med | Verify target agent's current state right before routing; route durable lanes not pickups; route around closing-out agents to successors |
| **Liveness during a model-availability outage** (out of scope here, unresolved) | Med | High | "Stop your heartbeat at stand-down" cures only the *graceful* case. In a model-availability outage the session's Monitors die with it: it cannot re-arm or stop its own heartbeat, leaving a stale-but-"active" liveness signal that misleads a successor. The team went down in exactly such an outage this pilot and had to be re-spun. The graceful-case cure does NOT cover the outage case. This is an **open architectural question for the owner** — a structural liveness/dead-man's-switch primitive (external staleness reaping, not self-stop) — named here, not silently treated as cured; the durable model-level home is PDR-118 open question 6. |

---

## Dependencies

**Blocking:**

- Owner decision on the DATA-SOURCES suitability / last-reviewed / removal
  criteria before L-DATA-SOURCES can author the policy (new governance, ADR-157
  omits it).
- Owner signal to launch the WS-B D2-D5 Implementer (L-WS-B).
- @jimCresswell code-owner review on every PR to `main` (the standing merge gate;
  no `--admin`, no clean agent self-merge).

**Beneficial (smooths, not required for minimum shippable shape):**

- The `claims adopt` / `claims set-handoff` CLI primitive (`claims adopt
  --claim-id`, `claims set-handoff --claim-id --path`) — would remove the handoff
  friction this arc works around at every Implementer handoff; absent it, durable
  handoff records + fresh seats suffice. **Not yet in the agent-tooling frictions
  register** (`.agent/plans/agent-tooling/frictions-register.md`, verified
  first-hand 2026-06-25 — no F-NN entry covers it); recording it there is itself a
  beneficial next step.
- A start-right **watcher-presence fail-fast gate** — fail session-open if no live
  comms watcher is armed. The prose rule ("arm the watcher as the first move") was
  skipped once in this pilot; a mechanical gate makes the omission structurally
  impossible rather than relying on diligence. **Not yet in the register**
  (verified first-hand 2026-06-25).
- A **lint-incremental / handoff-commit** cure for the markdownlint-blocked
  continuity-buffer commit wall — the consolidation commit stalls when ambient
  markdown lint failures block the buffer commit. **Not yet in the register**
  (verified first-hand 2026-06-25).
- A comprehensive PR monitor covering state + reviewDecision + inline review
  comments — would catch the inline-comment blind spot automatically; absent it,
  the standing "verify inline comments first-hand" lesson covers it.

**Related plans:**

- [worktree-per-agent-transition.plan.md](../future/worktree-per-agent-transition.plan.md)
  (future) — the strategy this arc feeds; its promotion evidence consumes this
  arc's verdict (its §Strategic Acceptance Criteria / Success Signals and
  §Promotion Trigger).
- [worktree-pilot-coordination.plan.md](./worktree-pilot-coordination.plan.md)
  (active) — the pilot this arc lands and archives.

---

## Foundation Alignment

At the start of each session:

1. Read `.agent/directives/principles.md` — Core principles, especially the
   Second Question ("would this be simpler if the system changed?") that resolved
   the worktree direction in the first place.
2. Read the [director brief](../../../memory/operational/director-handoff.md) seat
   procedure and `CURRENT HANDOFF STATE`; run the readiness self-check before
   claiming authority.
3. Read [PDR-117](../../../practice-core/decision-records/PDR-117-director-and-implementer-roles.md)
   for the role contract.
4. Ask: "Could the remaining work land more simply if the model changed — and is
   that itself evidence for the verdict?"

---

## Lifecycle Triggers (this plan's own)

- **Refinement:** a producer lane that splits, reorders, or reveals new scope
  records the change here; the lane shape, not a session count, is load-bearing.
- **Archival:** when L-Verdict lands — the verdict is written into the future plan
  and the pilot is archived. This plan then archives alongside, its evidence
  having graduated into the strategy plan.
- **Escalation to a new plan:** if the verdict is "the model added net cost," the
  follow-on is an owner decision about whether to abandon or reshape the model —
  a new strategic artefact, not a continuation of this one.

---

## Consolidation

After each landing session, run `/oak-consolidate-docs` to graduate settled
content, rotate the napkin, and refresh the director brief's `CURRENT HANDOFF
STATE`. L-Verdict is the dedicated consolidation pass: the pilot's napkin entries,
PDR candidates (the pre-authority-transfer verification gate; the
keep-going-until-complete-then-pause primitive; the Director loop-exit criteria),
and the worktree/Director evidence all fold to their permanent homes there.
