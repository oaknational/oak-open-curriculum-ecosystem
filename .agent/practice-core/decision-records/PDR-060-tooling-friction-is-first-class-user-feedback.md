---
pdr_kind: pattern
---

# PDR-060: Tooling Friction Is First-Class User Feedback

**Status**: Accepted
**Date**: 2026-05-14
**Related**:
[PDR-011](PDR-011-continuity-surfaces-and-surprise-pipeline.md)
(surprise pipeline — the capture mechanism this PDR's substance flows
through);
[PDR-014](PDR-014-consolidation-and-knowledge-flow-discipline.md)
(consolidation flow — the surface that distils captured friction into
durable doctrine);
[PDR-035](PDR-035-agent-work-capabilities-belong-to-the-practice.md)
(Practice-owned agent capabilities — the doctrine that makes
agent-tooling a Practice concern in the first place);
[ADR-131](../../../docs/architecture/architectural-decisions/131-self-reinforcing-improvement-loop.md)
(self-reinforcing improvement loop — the architectural realisation
this PDR's substance feeds).

## Context

In a Practice where agents both **author** and **use** the tooling
that operationalises the Practice's capabilities, the conventional
user/author distinction collapses. A human-only Practice can rely on
*users* reporting friction to *authors* through external channels —
support tickets, retros, surveys. A Practice where agents are both
sides has no such external channel: friction observed by an agent
disappears unless the agent itself routes it into a durable surface.

The owner stated this directly on 2026-05-05 (comms-event
`9a249c-tooling-feedback-standing-note`, Pelagic Swimming Rudder
session): *"any friction with agent tooling should always be noted
so the tooling and documentation can be improved. This is not limited
to this identity-wordlist session. Agents are both users and authors
of the tooling, so agent-observed friction is first-class user feedback
and should be routed into the relevant plan, docs, napkin, or tooling
backlog rather than left only in chat."*

Without a permanent home, the standing direction quietly decays
between sessions. The 2026-05-14 graduation triage confirmed the
doctrine had no entry in `.agent/directives/`, `.agent/rules/` (as
primary home), `.agent/practice-core/`, `distilled.md`, or
`docs/governance/` — it was observed in practice but unmoored from
any canonical surface.

## Decision

Agent-observed friction with any agent-tooling surface is **first-class
user feedback** in this Practice, and routes into one or more of
**napkin / plan / docs / tooling-backlog**, never chat-only.

The doctrine has three operational corollaries:

1. **Capture, not just observe.** When a session encounters friction
   — a CLI error message that omits help text, a script that rebuilds
   on every invocation, a flag whose accepted values are
   undocumented, a hook that fires on the wrong condition — the
   observation lands in a durable surface in the same session, not in
   the conversational stream that disappears at session close.
2. **The capture surface follows the substance.** Single-instance
   observations land in the napkin per `capture-practice-tool-feedback`
   rule shape. Multi-instance or doctrine-shaped substance graduates
   to `distilled.md` and then to a permanent home (rule, directive,
   PDR, or tooling-backlog plan).
3. **Chat is not a capture surface.** A friction observation that
   lives only in the session transcript is functionally lost. If the
   conversational context does not have time for a full capture, the
   minimum surface is a one-line napkin entry naming the friction;
   distillation can happen later. The discipline is *that* capture
   happens, not that capture is well-shaped on first pass.

## Rationale

**Why this is portable Practice doctrine, not repo-local.** Any
Practice-bearing repo where agents both author and use the tooling
would re-derive the same claim: friction observed by an agent has
no external reporting channel; without an internal capture discipline,
the friction signal is lost. The doctrine is independent of which
tools, which platforms, or which host language. Adopter scope: any
repo running an agent-bearing Practice.

**Why it is not an ADR.** The doctrine is not about *this repo's
product architecture*. It is about *how the Practice operates* — the
agents-as-users-and-authors epistemology — and travels to any
adopting repo.

**Why it is not (only) a rule.** A rule is an always-applied
behavioural cure that operationalises doctrine. The substance here
is the doctrine itself: the claim that the user/author distinction
collapses for agents. The behavioural cure ("route into plan / docs
/ napkin / tooling-backlog, not chat-only") is downstream;
[`capture-practice-tool-feedback.md`](../../rules/capture-practice-tool-feedback.md)
already operationalises a slice of the cure for Practice-tool
feedback specifically. A sibling rule or rule amendment may
operationalise the wider agent-tooling slice — that is rule-level
work *downstream* of this PDR, not a substitute for it.

## Consequences

### Required

- Friction observations land in a durable surface in the session that
  observed them, even if the surface is a one-line napkin entry.
- Consolidation passes treat captured friction as first-class input
  alongside napkin observations and pending-graduations entries.
- Sessions that *consume* agent-tooling actively look for friction to
  capture; the absence of capture is not evidence that no friction
  occurred.

### Forbidden

- Leaving friction observations only in the conversational stream.
- Treating friction observations as side-comments that "the owner
  will see anyway" — owner-presence is not a capture surface.
- Reframing friction observations as out-of-scope to avoid capture
  ("yes that's broken but it's not what I'm working on"); the capture
  takes a line, the reframe takes a paragraph.

### Accepted cost

- Capture overhead inside sessions that hit friction. The cost is
  one to three lines per observation; the cost of *not* capturing is
  recurrent re-discovery of the same friction across sessions.

## Notes

The existing rule [`capture-practice-tool-feedback.md`](../../rules/capture-practice-tool-feedback.md)
operationalises this PDR for the Practice-tool slice (the Practice
itself plus host-local Practice-capability implementations). A
sibling rule or an amendment broadening that rule's scope may land
to operationalise the wider agent-tooling slice — that work follows
this PDR; it is not a substitute for it.

Source comms-event: `9a249c-tooling-feedback-standing-note`
(Pelagic Swimming Rudder, 2026-05-05). Original capture: 2026-05-14
graduation-triage pass (Salty Swimming Hull session;
`pending-graduations.md` entry now graduated).
