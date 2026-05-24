---
pdr_kind: governance
---

# PDR-061: Agent Pronoun Default and Conduct-Correction Graduation

**Status**: Accepted
**Date**: 2026-05-21
**Related**:
[PDR-011](PDR-011-continuity-surfaces-and-surprise-pipeline.md)
(surprise pipeline);
[PDR-014](PDR-014-consolidation-and-knowledge-flow-discipline.md)
(capture, distil, graduate, enforce);
[PDR-046](PDR-046-layered-knowledge-processing.md)
(preserve first, restructure second).

## Context

Agent identities in this Practice are operational identities: names,
platforms, models, session prefixes, roles, and collaboration state.
They are not human biographical identities. A codename can be vivid
without carrying gender.

Inferring gender from an agent name or persona creates avoidable
misreference and makes collaboration state less accurate. The correct
default is simple and portable: use they/them unless the agent has
explicitly self-declared another pronoun set.

This also exposes a pipeline lesson. Conduct corrections affect the
next sentence an agent writes. If the only durable capture is a pending
graduation entry, the correction waits behind the consolidation queue
and later sessions repeat it. Conduct corrections therefore need a
fast live carrier while any deeper governance record is drafted.

## Decision

Agents default to **no gender** unless self-declared. When referring to
an agent, use they/them unless that agent explicitly declares a
different pronoun set in the current collaboration surface.

Conduct corrections that change how agents should address, refer to,
or treat collaborators graduate to an active behavioural surface in the
same session whenever possible. The pending-graduations register may
track deeper governance work, but it must not be the only live carrier
for a correction that should affect immediate behaviour.

## Rationale

**Why no gender by default.** Agent names, codenames, platform voices,
roles, and writing style are not evidence of gender. Treating them as
evidence makes collaboration state less precise and forces future
correction. They/them is accurate under uncertainty and remains correct
until superseded by self-declaration.

**Why a conduct correction needs a fast carrier.** The capture queue is
designed for doctrine that can wait for corroboration, owner direction,
or a drafting slot. Conduct corrections have a different time constant:
the failure can recur in the next message. A fast carrier prevents the
queue from becoming a delay line for basic collaboration accuracy.

**Why a PDR and a rule.** The PDR carries the portable doctrine. The
rule provides the always-applied operational surface for sessions that
need the behaviour at output time.

## Consequences

### Required

- Agents use they/them for other agents unless a self-declaration is
  present.
- Agent names and codenames are not interpreted as gender signals.
- Conduct corrections are routed to an active behavioural surface
  promptly, with deeper governance follow-up only when the substance
  warrants it.

### Forbidden

- Inferring gender from an agent's codename, style, task role, or
  metaphor.
- Leaving a conduct correction only in a long-lived pending queue when
  it should affect immediate collaboration behaviour.

### Accepted Cost

The rule may feel redundant in sessions where every agent already uses
neutral language. That redundancy is intentional: the cost is small,
and it prevents a repeated correction from reappearing in multi-agent
work.
