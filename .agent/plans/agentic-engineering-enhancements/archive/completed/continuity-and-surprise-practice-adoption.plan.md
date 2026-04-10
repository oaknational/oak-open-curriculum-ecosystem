---
name: Continuity and Surprise Practice Adoption
overview: >
  Adopt continuity surfaces, lightweight session handoff, conditional deep
  consolidation, and a formal surprise pipeline as repo-local practice.
todos:
  - id: phase-0-baseline
    content: "Phase 0: Capture the pre-rollout continuity baseline."
    status: completed
  - id: phase-1-design
    content: "Phase 1: Define the doctrine contract in ADR-150 and governance guidance."
    status: completed
  - id: phase-2-integration
    content: "Phase 2: Integrate session-handoff, continuity contract, GO alignment, and surprise capture."
    status: completed
  - id: phase-3-pilot
    content: "Phase 3: Use the MCP App lane as the live evidence source for resumptions, GO sessions, and deep consolidations."
    status: completed
  - id: phase-4-rollout
    content: "Phase 4: Decide promote/adjust/reject and create the outgoing portable note only if the evidence supports promotion."
    status: completed
---

# Continuity and Surprise Practice Adoption

**Last Updated**: 2026-04-03
**Status**: ✅ COMPLETE
**Scope**: Repo-local continuity practice, session handoff, GO cadence, and
surprise capture for the MCP App workstream

**Closure note**: The evidence window closed on 2026-04-03 with an explicit
`promote` call. This plan delivered the repo-local rollout and the outgoing
portable note; the same-day Practice Core promotion was recorded separately as
the follow-on promotion step, not as silent scope drift inside Wave 1.

---

## Context

This repository already has strong institutional-memory and consolidation
machinery, but ordinary session resumption still depended on a heavier closeout
pattern than the MCP App lane needs. The old `wrap-up` surface bundled plan
updates, review, deep consolidation, commit, and push into one end-of-session
ritual. In practice it was unused, and it blurred the line between lightweight
continuity and deep convergence.

The session surfaced a clearer model:

- continuity is an engineering property, not a model-memory claim
- ordinary session end needs a lightweight handoff contract
- deep consolidation must stay intact, but only run on explicit triggers
- surprise and correction are high-value learning signals that deserve an
  explicit capture and promotion path
- `GO` has value as an execution cadence, not as a handoff substitute

Wave 1 adopted those ideas inside this repository without mutating
`.agent/practice-core/*` during the rollout itself. The later same-day Practice
Core promotion happened only after the evidence log closed with an explicit
`promote` decision.

## Goal

Make the next session recover orientation quickly and truthfully by:

- defining continuity surfaces in permanent doctrine
- replacing `wrap-up` with a lightweight `session-handoff` workflow
- moving the continuity contract into the MCP App continuation prompt
- keeping `consolidate-docs` as the deep convergence workflow, but only when
  it is actually due
- formalising surprise capture so corrections can graduate through existing
  memory and doctrine surfaces

## Non-Goals

- No claims about model consciousness or inner continuity
- No Practice Core mutation inside the Wave 1 rollout itself; any later
  promotion requires an explicit follow-on decision
- No new reviewer or specialist in wave 1
- No automatic promotion of surprises straight to permanent doctrine
- No default full consolidation at every session end

---

## Phase 0 — Baseline Audit

### Task 0.1: Capture the pre-rollout continuity baseline

- Output: [continuity-adoption-baseline.md](../../../analysis/continuity-adoption-baseline.md)
- Completed work:
  - inventoried the old handoff and consolidation surfaces
  - documented which continuity signals were trapped in deep consolidation
  - recorded why ordinary session recovery was heavier than it needed to be
- Validation:
  - baseline doc exists
  - baseline names the current handoff surfaces, consolidation surfaces, trapped
    signals, and recovery pain points

### Task 0.2: Lock the numbering and doctrine constraints

- Output: this plan plus ADR numbering check
- Completed work:
  - re-checked the ADR directory and live active/current plans at implementation
    time
  - confirmed `ADR-147`, `ADR-148`, and `ADR-149` are reserved by the frontend
    practice plan, so the first safe free slot for this work is `ADR-150`
- Validation:
  - no new ADR file collides with live reservations

---

## Phase 1 — Policy and Design Contract

### Task 1.1: Define the normative continuity doctrine

- Outputs:
  - [ADR-150](../../../../docs/architecture/architectural-decisions/150-continuity-surfaces-session-handoff-and-surprise-pipeline.md)
  - [continuity-practice.md](../../../../docs/governance/continuity-practice.md)
- Completed work:
  - defined the three continuity surfaces: operational, epistemic, and
    institutional
  - defined the split-loop model: `session-handoff` every session;
    `consolidate-docs` only on triggers
  - defined the surprise pipeline: capture -> distil -> graduate -> enforce
- Validation:
  - ADR and governance doc agree on the split-loop model and continuity
    contract fields
  - governance index and ADR index link to the new doctrine surfaces

### Task 1.2: Define the continuity contract

- Output:
  - continuity contract fields encoded in
    [session-continuation.prompt.md](../../../prompts/session-continuation.prompt.md)
- Completed work:
  - fixed the continuity contract field set:
    `Workstream`, `Active plans`, `Current state`, `Current objective`,
    `Hard invariants / non-goals`, `Recent surprises / corrections`,
    `Open questions / low-confidence areas`, `Next safe step`,
    `Deep consolidation status`
- Validation:
  - prompt contains a dedicated `Live continuity contract` section near the top
  - contract is explicitly operational only; active plans remain authoritative

---

## Phase 2 — Workflow Integration

### Task 2.1: Replace `wrap-up` with `session-handoff`

- Outputs:
  - [session-handoff.md](../../../commands/session-handoff.md)
  - platform adapters:
    `.cursor/commands/jc-session-handoff.md`,
    `.claude/commands/jc-session-handoff.md`,
    `.gemini/commands/jc-session-handoff.toml`,
    `.agents/skills/jc-session-handoff/SKILL.md`
- Completed work:
  - deleted the canonical `wrap-up` surface and its thin adapters
  - added the canonical `session-handoff` workflow and its adapters
  - added a consolidation gate so `session-handoff` can escalate into
    `jc-consolidate-docs` when the deeper loop is clearly warranted and
    bounded
- Validation:
  - no live wrapper points at `.agent/commands/wrap-up.md`
  - `session-handoff` updates the continuity contract, plan/prompt next-action
    state, napkin surprises, and the consolidation gate outcome

### Task 2.2: Keep deep consolidation intact, but conditional

- Output: [consolidate-docs.md](../../../commands/consolidate-docs.md)
- Completed work:
  - reframed `consolidate-docs` as the deep convergence workflow
  - added an explicit trigger checklist and a redirect to `session-handoff`
    when the checklist does not fire
  - aligned it with `session-handoff` so the lighter workflow can escalate
    into deep convergence when the trigger is clear
- Validation:
  - all original deep responsibilities remain present
  - the doc no longer implies that full consolidation is the default
    end-of-session path

### Task 2.3: Re-ground `GO` around continuity

- Outputs:
  - [go.md](../../../skills/go/shared/go.md)
  - discoverability updates in prompt and practice indexes
- Completed work:
  - made `GO` start from `start-right-quick`, the latest continuity contract,
    and the active MCP App plan set
  - clarified that `GO` is a mid-session execution cadence
  - clarified that ordinary closeout goes through `session-handoff`
- Validation:
  - no live discoverability index points at a non-existent `.agent/prompts/GO.md`
  - `GO`, `session-handoff`, and `consolidate-docs` describe compatible roles

### Task 2.4: Formalise surprise capture

- Output: [napkin skill](../../../skills/napkin/SKILL.md)
- Completed work:
  - made surprise capture explicit and structured
  - allowed both negative and positive surprise
- Validation:
  - the napkin skill defines the capture shape:
    expected -> actual -> why expectation failed -> behaviour change

---

## Phase 3 — Pilot and Evidence

### Task 3.1: Use the MCP App lane as the evidence source

- Outputs:
  - [continuity-adoption-evidence.md](../../../analysis/continuity-adoption-evidence.md)
  - updates to
    [session-continuation.prompt.md](../../../prompts/session-continuation.prompt.md)
- Completed work:
  - first evidence entry recorded on 2026-04-02 during a
    `session-handoff` closeout that escalated into
    `jc-consolidate-docs`
  - evidence window closed on 2026-04-03 with an explicit `promote`
    decision after lightweight handoff, `GO`, and deep-consolidation
    behaviour all proved stable enough to teach
  - the evidence log preserves the judgement-call nuance: the original
    resumption quota was still below target, but the pattern was already
    directionally stable and the user chose to promote
- Evidence window:
  - first 5 real MCP App resumptions after rollout
  - first 3 `GO`-driven execution sessions
  - first 2 deep consolidations after rollout
- Capture per session:
  - continuity contract produced: yes/no
  - recovered objective, invariants, and next safe step: yes/no
  - deep consolidation correctly skipped or triggered: yes/no
  - surprises captured with a promotion target: yes/no
- Validation:
  - evidence log has dated entries with explicit pass/fail calls, not anecdotes

### Task 3.2: Calibrate after real usage

- Output: decision recorded in the evidence log
- Outcome: `promote` chosen on 2026-04-03
- Decision choices:
  - `promote`
  - `adjust`
  - `reject`
- Validation:
  - the decision cites actual MCP App evidence, not preference

---

## Phase 4 — Rollout and Portability

### Task 4.1: Promote when the evidence holds

- Outputs:
  - `.agent/practice-context/outgoing/continuity-handoff-and-surprise-pipeline.md`
  - follow-on Practice Core promotion recorded separately in
    `.agent/practice-core/*`
- Completed work:
  - evidence ended with `promote`, so the outgoing portable note was created
  - the same-day follow-on promotion moved the continuity doctrine into the
    portable Practice Core after the rollout plan had proved the behaviour
- Validation:
  - the outgoing note is portable by design rather than repo-specific
    narration
  - the later Practice Core promotion happened only after an explicit
    `promote` decision and is recorded separately from the rollout pass

---

## Quality Gates

Run at minimum:

```bash
pnpm markdownlint:root
pnpm practice:fitness
pnpm portability:check
```

Use `pnpm check` when broader merge-readiness proof is needed.

## Foundation Alignment

- [principles.md](../../../directives/principles.md) — first question,
  simplicity, no speculative machinery
- [testing-strategy.md](../../../directives/testing-strategy.md) — evidence and
  proof discipline
- [schema-first-execution.md](../../../directives/schema-first-execution.md) —
  no schema changes here, but still part of the grounding contract

## Documentation Propagation

- ADR created: `ADR-150`
- Governance doc created:
  [continuity-practice.md](../../../../docs/governance/continuity-practice.md)
- Indexes updated:
  - ADR index README
  - governance README
  - collection README/current index/roadmap
  - prompt and practice indexes

## Consolidation

Do not treat this plan as a reason to run `jc-consolidate-docs` by default.
Use `session-handoff` for ordinary session end. It now includes a
consolidation gate that can escalate into `jc-consolidate-docs` when the
trigger checklist clearly passes. Deep convergence is still not the default.

## Risk Assessment

| Risk | Impact | Mitigation |
|---|---|---|
| Continuity contract duplicates plan authority | Drift between prompt and plan | Keep the prompt operational-only and keep plans authoritative |
| `session-handoff` becomes another heavy closeout ritual | Ordinary session recovery stays slow | Keep the command lightweight by default and allow escalation only when the consolidation gate is clearly triggered and the deeper work is already well-bounded |
| Deep consolidation gets weakened by the split-loop change | Stable insights stop graduating | Preserve the existing `consolidate-docs` responsibilities verbatim and add trigger clarity rather than reducing scope |
| Surprise capture becomes noisy journalling | Signal quality drops | Use the structured surprise format and keep promotion standards unchanged |
