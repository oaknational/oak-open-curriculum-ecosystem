---
pdr_kind: governance
---

# PDR-072: Knowledge Curation as Autonomic Learning

**Status**: Proposed
**Date**: 2026-05-23
**Related**:
[PDR-014](PDR-014-consolidation-and-knowledge-flow-discipline.md)
(capture, distil, graduate, enforce);
[PDR-046](PDR-046-layered-knowledge-processing.md)
(layered knowledge processing);
[PDR-067](PDR-067-surface-classification-for-fitness-response.md)
(surface classification for fitness-response routing);
[PDR-071](PDR-071-coordinator-allocates-without-gating.md)
(mode separation as a structural property);
[`practice-index.md`](../../practice-index.md) (host adoption and
implementation bridge).

## Context

Practice-bearing repos produce more than product-code deliverables.
They also produce Practice substrate: the durable learning surfaces
that future agents and sibling Practice instances inherit.

When agents consolidate a learning register, distil session notes,
graduate a pattern, repair an index, or turn a repeated friction into a
decision record, that work is sometimes misread as overhead: useful
maintenance around the real work, but not itself output. That frame is
wrong. Knowledge curation is how agents make the Practice learn from
its own work.

The error matters because overhead framing causes teams to under-credit
the work that makes future work cheaper, safer, and more coherent. It
also hides the topology of Practice Core: curated learning travels
across sessions and can travel across repos. A curation pass in one
repo may shape the first decision a sibling Practice instance makes.

## Decision

Treat knowledge curation as an **autonomic learning function** of the
Practice, not as coordination overhead or recovery work.

A Practice-bearing repo has two real output-accounting axes. These are
not PDR-067 fitness-response surface kinds; they are the two categories
of value a session may ship:

1. **Product surface**: product code, content, services, interfaces,
   and other host deliverables for human or system users.
2. **Practice substrate surface**: durable learning that improves future
   agent work, including decision records, rules, patterns, distilled
   doctrine, consolidation of knowledge queues, and repaired indexes.

Throughput is assessed on both axes. A session that ships no product
code can still produce substantial value if it advances the Practice
substrate. A session that ships product code but leaves the work
unexamined by the learning loop has left value unclaimed.

The term **autonomic** names the structural property that healthy
Practice substrate makes right-shaped curation behaviour more likely
under load. Agents converge on pre-handoff syntheses, pattern-file
authoring, consolidation sweeps, and queue-drainage work because the
substrate's surfaces and routines prompt that behaviour. The work may
be directed by an owner or coordinator, but it can also arise when
agents respond to the Practice's feedback structure without a fresh
external instruction.

## Rationale

The knowledge flow already says that agents convert raw experience
into settled knowledge through the Practice. This PDR names the
throughput classification that follows from that mechanism: curation is
output on the Practice-substrate axis.

Product-code output and Practice-substrate output compound
differently. Product output often solves the immediate host problem.
Practice-substrate output changes the conditions under which future
work is done. It can prevent repeated mistakes, shorten future
grounding, make collaboration safer, improve quality-gate response, and
make better defaults available to sibling Practice instances.

Rejected alternatives:

- **Curation as overhead**: treats consolidation, distillation, and
  graduation as a cost around the real work. This undercounts the value
  of the learning loop and encourages teams to defer the very work that
  lets the Practice improve.
- **Curation as recovery**: treats knowledge work as cleanup after a
  failed or messy session. Some curation does repair damage, but the
  category is broader: healthy sessions also produce curation because
  agents have observed something worth preserving.
- **Single-surface throughput**: asks only what product deliverable
  shipped. This collapses the product surface and the Practice
  substrate axis into one accounting line, hiding value that
  compounds outside the immediate product diff.

## Worked Instances

Observed worked instances include:

- A consolidation pass drained an overloaded graduation queue, creating
  room for newly captured concepts without compressing or discarding
  them.
- Multiple agents independently produced boundary-scoped handoff
  syntheses before retirement, showing that Practice routines shaped
  convergent agent behaviour without a separate coordination
  script.
- Repeated commit-message and queueing workarounds emerged across
  agents, turning from individual coping behaviour into a candidate
  substrate default.
- Pattern graduations converted just-observed collaboration behaviour
  into durable teaching material for the next session.

These instances are not merely local anecdotes. Their shared property
is that agents used the Practice substrate to observe work, extract a
reusable concept, and improve a later session's starting conditions.

## Cascade

This PDR names, but does not itself execute, the downstream Core
amendments:

1. `practice.md` should surface the two-output-surface model in the
   conceptual map of what the Practice produces.
2. `practice-lineage.md` should surface autonomic curation as a learned
   principle and propagation property.

Those amendments are separate cycles. This PDR is the principle layer;
the downstream Core edits are canon-surface integration.

This PDR is part of the same structural-property cluster as PDR-071:
PDR-071 names mode separation, and this PDR names curation as
first-class Practice-substrate output.

## Consequences

**Enables**:

- Session reporting can credit product-output throughput and
  Practice-substrate throughput independently.
- Knowledge-curation lanes can be planned, reviewed, and protected as
  substantive work rather than squeezed into leftover context.
- Consolidation and graduation work can be routed as value-producing
  substrate work, not only as cleanup after fitness pressure.
- Sibling Practice instances receive learning as a first-class output,
  not as incidental documentation.

**Costs**:

- Teams must resist the simple "what feature shipped?" accounting
  shortcut.
- Curation work needs the same quality discipline as product work:
  portability, correct home, evidence, and fitness response.
- Over-crediting curation is possible; ordinary formatting, mechanical
  archiving, or unexamined summaries do not become autonomic learning
  merely because they touch knowledge surfaces.

**Forbids**:

- Describing substantive consolidation, distillation, graduation, or
  doctrine repair as mere coordination overhead.
- Treating Practice-substrate output as second-class when it changes
  future work conditions.
- Using "autonomic" as licence to skip evidence. The function is
  autonomic when real substrate structure prompts agents to produce
  reusable learning.

## Falsifiability

This PDR is falsified if knowledge-curation work does not measurably
change future work conditions, does not propagate reusable concepts, or
cannot be distinguished from ordinary administrative cleanup. It is also
falsified if treating curation as first-class output causes teams to
substitute documentation activity for product or substrate progress.
