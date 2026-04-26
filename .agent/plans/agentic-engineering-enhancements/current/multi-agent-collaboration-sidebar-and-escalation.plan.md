---
name: Multi-Agent Collaboration Sidebar and Escalation
overview: >
  Second split from paused WS3. Preserve the existing sidebar, timeout, and
  owner-escalation design as a separate evidence-gated plan that extends the
  lightweight decision-thread surface only if real usage proves it is needed.
todos:
  - id: ws3b-promotion-evidence
    content: "WS3B GATE: inspect WS3A decision-thread evidence and owner direction before promoting sidebar work."
    status: paused-evidence-gated
  - id: ws3b-red-sidebar-schema
    content: "WS3B RED: add failing schema fixtures for sidebar request, acceptance, exchange, timeout, and resolution paths."
    status: pending
  - id: ws3b-green-sidebar-protocol
    content: "WS3B GREEN: extend the conversation schema and directive/rule guidance with sidebar protocol semantics."
    status: pending
  - id: ws3b-green-escalation-surface
    content: "WS3B GREEN: add the explicit owner-escalation surface and consolidate-docs visibility."
    status: pending
  - id: ws3b-validation-and-harvest
    content: "WS3B CLOSE: validate schema/docs, capture a sidebar operational seed, and hand evidence to WS5 harvest."
    status: pending
isProject: false
---

# Multi-Agent Collaboration Sidebar and Escalation

**Last Updated**: 2026-04-26
**Status**: PROMOTION GATE SATISFIED 2026-04-26; awaiting implementation
capacity. Owner direction landed in the same session as the
phase-transition observation (see § Promotion Gate Satisfied below).
**Parent Plan**:
[`multi-agent-collaboration-protocol.plan.md`](multi-agent-collaboration-protocol.plan.md)
**Prerequisite Plan**:
[`multi-agent-collaboration-decision-thread-and-claim-history.plan.md`](../archive/completed/multi-agent-collaboration-decision-thread-and-claim-history.plan.md)

## Context

The original WS3 bundled two different ideas:

1. an async conversation file for structured overlap decisions
2. a tighter sidebar mechanism with timeouts and owner escalation

The WS5 evidence harvest showed that shared communication log + claims
coordination is already useful, but did not show that the heavier sidebar
mechanism is the next necessary implementation. WS3A now owns the
evidence, claim-history, observability, and lightweight decision-thread
slice. This plan preserves the full sidebar design as a separate,
promotion-gated workstream.

## Promotion Gate

Do not start implementation until one of these happens:

- the owner explicitly promotes sidebar work after reviewing WS3A
  evidence
- at least one real decision thread records that async coordination was
  too slow or ambiguous and a tighter exchange would have prevented
  delay or confusion
- repeated decision-thread evidence shows the same class of unresolved
  peer coordination issue across three sessions

The absence of sidebar demand is valid evidence. If WS3A decision threads
resolve real overlaps cleanly, this plan can remain paused or be retired.

## Promotion Gate Satisfied — 2026-04-26

The first criterion fired: **owner explicitly promoted further agent
collaboration work** after reviewing the 2026-04-26 evidence accumulated
on `feat/otel_sentry_enhancements`:

> "All of this is also evidence that agents need to be able to discuss
> and make joint decisions and agree on how those decisions will be
> recorded, by whom, and how they will be acted on, and by whom. This is
> sufficient evidence to justify the further agent collaboration work."
>
> "At the moment the system as a whole seems to be able to handle two
> agents on well separated threads reasonably well, but three agents
> whose threads occasionally touch has caused multiple clashes... this
> is a clear phase transition point."

### Evidence summary

In a 90-minute window the branch carried three concurrent agent
identities (Sturdy Otter, Codex, Frolicking Toast) with overlapping
touch areas. The session produced:

- **Three lock-contention events** at 15:36, 15:43, 15:59.
- **A small taxonomy of three commit-time clash types** — A
  substitution (commit `8f44a941`), B disappearance (`b014ca20`), C
  accretion (`9af63a84`) — recorded as evidence in
  [`intent-to-commit-and-session-counter.plan.md`](../future/intent-to-commit-and-session-counter.plan.md)
  (the commit-window defence).
- **Owner-flagged correction** twice in two separate exchanges that the
  problem is not just lock contention but also the absence of agent-to-
  agent discussion and joint commitment.

### Phase transition observation

The phase transition lives in the count of touching threads, not the
count of agents. Two-agent / well-separated-thread parallel work was
fine; three-agent / touching-thread parallel work crossed a threshold
where async-only signalling stopped preventing collisions. The
collaboration protocol must add a synchronous-discussion mechanism (this
plan's sidebar) and a joint-decision-with-role-assignment mechanism (a
sibling future plan; see Related below) to scale further.

### Related new future plan

A sibling future plan was authored in the same session capturing the
joint-decision dimension of the owner's promotion direction:

- [`joint-agent-decision-protocol.plan.md`](../future/joint-agent-decision-protocol.plan.md)
  — discuss → decide → record → act, with explicit role assignment at
  each phase. WS3B sidebar provides the canonical discussion surface
  this sibling plan builds on.

The two plans are complementary, not competing: WS3B is the discussion
mechanism, joint-decision is the commitment mechanism. They may land
in either order, but joint-decision reads cleaner with WS3B sidebar
already in place.

### Why not auto-execute now

Promotion gate satisfaction is a green light, not a start signal.
Implementation capacity for this branch is committed elsewhere
(observability lanes; PR-87 quality remediation; learning-before-fitness
consolidation). This plan moves to `current/` execution when the owner
sequences it; until then it remains in `current/` paused with the gate
satisfied so the next implementer can pick it up without re-deriving
the promotion case.

## Goal

Add an optional, short-lived sidebar protocol for moments when async
decision threads are too slow and both agents want focused peer exchange.
The protocol remains advisory and platform independent.

## Non-Goals

- Do not make sidebars mandatory for overlap.
- Do not use sidebars as a lock, refusal mechanism, or permission gate.
- Do not replace owner questions. Owner escalation is a last move when
  peer agreement fails, not a default routing path.
- Do not implement platform-native chat/team features as the canonical
  mechanism.

## Target Shape

### Sidebar Entry Kinds

Extend the WS3A decision-thread schema with:

- `sidebar_request` - one agent proposes a focused sidebar on a concrete
  decision-thread topic
- `sidebar_message` - accepted sidebar exchange message
- `sidebar_resolution` - closure with agreement, agreed-disagree,
  timeout, owner escalation, or declined request

The schema must preserve all WS3A entry kinds and remain additive unless
the implementation records a deliberate versioned migration.

### Sidebar Protocol

Design carried forward from the original WS3 plan:

- **Trigger**: a topic where async exchange through the shared
  communication log or decision-thread file is too slow and a tighter
  exchange is desired.
- **Mutual acceptance**: either agent may propose; both must accept
  before the sidebar is open. Declining has no penalty.
- **Parallel sidebars allowed**: different topics may have different
  sidebars. The protocol does not force one global agent-pair sidebar.
- **Focused exchange**: sidebars are turn-by-turn, topic-bound, and
  should end with a recorded resolution.
- **Default timeout**: 10 turn-pairs or 30 minutes of owner-real-time,
  whichever comes first, unless the sidebar records a different local
  bound.
- **Resolution paths**: agreement, agreed-disagree, declined request,
  timeout, unresponsive peer, or owner escalation.

### Owner Escalation Surface

If peer agreement fails after a sidebar, create an explicit escalation
surface under `.agent/state/collaboration/escalations/`.

Each escalation should include:

- escalation ID and timestamp
- decision-thread ID and sidebar entry IDs
- agents involved
- divergence summary
- concrete question for the owner
- proposed resolutions offered by each agent
- owner resolution and closure reference when available

`consolidate-docs` should surface active escalations visibly until they
are resolved. A hidden note inside a decision thread is not enough.

## Workstreams

### WS3B GATE - Promotion Evidence

Tasks:

1. Read the WS3A closure evidence and decision-thread examples.
2. Inspect any real decision threads created after WS3A.
3. Confirm owner direction or the evidence trigger before implementation.
4. Record the promotion rationale in this plan.

Acceptance:

- Sidebar work has an evidence-backed reason to exist now.
- If evidence is absent, this plan remains paused without shame or
  workaround.

### WS3B RED - Sidebar Schema Fixtures

Tasks:

1. Add failing fixtures for request, acceptance, focused exchange,
   declined request, timeout, and owner-escalated resolution.
2. Add or extend validation for escalation files.
3. Confirm the targeted validation fails before implementation.

Acceptance:

- Failing tests/validation describe the desired sidebar behaviour.
- Failures are specific to missing sidebar/escalation support.

### WS3B GREEN - Sidebar Protocol

Tasks:

1. Extend the conversation schema with `sidebar_*` kinds.
2. Update `.agent/directives/agent-collaboration.md`.
3. Update `.agent/rules/respect-active-agent-claims.md`.
4. Update any start-right or session-handoff guidance only if sidebar
   discovery needs to happen at those points.

Acceptance:

- Sidebars are optional and mutually accepted.
- Decline and timeout paths are documented.
- Parallel sidebars are allowed by design.
- The protocol remains advisory and platform independent.

### WS3B GREEN - Escalation Surface

Tasks:

1. Add `.agent/state/collaboration/escalations/` and a versioned schema.
2. Add sample active and resolved escalation files.
3. Wire `consolidate-docs` to surface active escalations.
4. Document owner-resolution write-back into the decision thread.

Acceptance:

- Active escalations are visible during normal consolidation.
- Owner resolution is recorded in structured state and cited from the
  decision thread.
- Escalations cannot be confused with ordinary async messages.

### WS3B CLOSE - Validation and Harvest Seed

Minimum validation:

```bash
jq empty .agent/state/collaboration/active-claims.json
jq empty .agent/state/collaboration/closed-claims.archive.json
pnpm exec markdownlint --dot \
  .agent/plans/agentic-engineering-enhancements/current/multi-agent-collaboration-sidebar-and-escalation.plan.md \
  .agent/plans/agentic-engineering-enhancements/archive/completed/multi-agent-collaboration-decision-thread-and-claim-history.plan.md \
  .agent/directives/agent-collaboration.md \
  .agent/rules/respect-active-agent-claims.md
git diff --check
```

Add schema validation commands if schema tooling exists or is introduced.
Run `pnpm portability:check` if platform adapters are touched.

Operational seed:

- Did a real sidebar reach `sidebar_resolution` without becoming a
  blocking gate or default owner escalation?

The seed feeds the parent plan's WS5 harvest. A finding that no sidebar
was needed remains valid evidence.

## Reviewer Routing

- `assumptions-reviewer` - promotion legitimacy, timeout
  proportionality, and whether sidebar demand is real.
- `docs-adr-reviewer` - schema, state-vs-memory boundary, and
  owner-escalation discoverability.
- `architecture-reviewer-wilma` - deadlock and hidden-coupling risks
  around parallel sidebars, timeouts, and escalation visibility.

## Risks

| Risk | Mitigation |
| --- | --- |
| Sidebar becomes a required permission step | Keep the directive explicit: sidebars are optional, advisory, and mutually accepted. |
| Agents open sidebars and never close them | Require timeout fixtures, resolution entries, and consolidate-docs visibility. |
| Owner escalation becomes the default path | Require peer attempt evidence before escalation and surface active escalations visibly. |
| Multiple sidebars create deadlock | Allow parallel topic-bound sidebars; do not enforce a single global peer sidebar. |
| Platform-native chat becomes the hidden system | Keep canonical state in repo-owned Markdown/JSON and treat platform features as optional convenience only. |

## Completion Rule

This plan is complete only after the promotion gate is satisfied, sidebar
and escalation schemas validate, directive/rule guidance is updated, and
an operational seed is left for WS5. Until then, its correct state is
paused, not partially implemented.
