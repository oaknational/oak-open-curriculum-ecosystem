# PDR-002: Pedagogical Reinforcement in Foundational Practice Docs

**Status**: Accepted
**Date**: 2026-04-17
**Related**: [PDR-003](PDR-003-sub-agent-protection-of-foundational-practice-docs.md)
(operational enforcement of this decision).

## Context

The Practice maintains a small set of foundational documents that
agents read at session start and treat as authoritative: the agent
entry point (orientation), the principles document (what is
forbidden, what is required), the testing-strategy document (how
tests are structured and classified), and related pedagogical
directives.

Across these files, certain rules deliberately appear more than
once. A testing rule may appear in the principles document
(framed as *why this constraint exists*) and again in the
testing-strategy document (framed as *how tests are structured to
honour the constraint*). A quality-gate rule may appear in the
agent entry point (framed as *what to do at session start*) and
again in the principles document (framed as *what is forbidden*).

This repetition reads, to a scoped documentation-optimisation pass,
as duplication. Sub-agent consolidation passes have on multiple
occasions attempted to deduplicate these co-occurrences in the
name of concision or fitness compression. Each such attempt has
measurably weakened the doctrine the foundational documents are
meant to enforce.

The pressure to deduplicate is structural. Sub-agents and
mechanical compression tools optimise for surface metrics — lines
removed, characters saved, duplicate strings eliminated. They do
not observe the pedagogical mechanism: a rule encountered through
two different frames on two different reads is internalised more
reliably than a rule encountered once. The repetition is the
doctrine, not an accident of drafting.

## Decision

Repetition of rules across foundational Practice documents is
deliberate pedagogical reinforcement. It is an invariant of those
documents' shape, not a defect to be compressed out.

Consolidation, fitness management, and documentation cleanup
operations MUST NOT deduplicate rules across foundational Practice
documents. When volume pressure arises on a foundational document,
the permitted responses are:

1. Refine the existing rule statement within the same document
   (sharpen wording, remove genuinely redundant text within that
   document).
2. Split the document along its `split_strategy` if one exists.
3. Graduate content to a permanent home outside the foundational
   set (a governance document, a host-repo ADR, a rule file), in
   which case the foundational document retains a terse statement
   of the rule and the graduated home carries the elaboration.
4. Raise the fitness target with explicit rationale recorded at
   the frontmatter level.

Cross-document deduplication of reinforced rules is not one of the
permitted responses.

## Rationale

Foundational documents are read at **different operational
moments** with **different mental frames**:

- The agent entry point is read at session start, under time
  pressure, by an agent orienting itself.
- The principles document is read when an agent is about to make
  a decision that might violate a constraint.
- The testing-strategy document is read when an agent is about to
  write or classify a test.

A rule that governs all three moments benefits from appearing in
all three documents, each time in the local frame. The first
encounter primes recognition; the second encounter confirms the
rule is load-bearing; the third encounter strengthens retention.
A single-instance rule, even when perfectly worded, is routinely
missed under frame-switching pressure.

This argument is pedagogical, not mechanical. It cannot be
validated by counting duplicate strings. It is validated by the
rule's actual behaviour across many sessions: rules that appear
in multiple foundational documents are violated less often than
rules of equivalent severity that appear in only one.

## Consequences

**Required**:

- Consolidation passes and fitness-management responses treat
  cross-document reinforcement as invariant.
- Any new rule that governs multiple operational frames is
  considered for reinforced placement in each relevant
  foundational document at the time the rule is authored, not
  deferred and then duplicated later.
- When an agent observes apparent duplication across foundational
  documents, the default presumption is deliberate reinforcement,
  not accidental repetition.

**Forbidden**:

- Scoped documentation-optimisation passes (particularly those
  executed by sub-agents with narrow context) MUST NOT cross the
  foundational-document boundary when deduplicating.
- Fitness compression MUST NOT resolve by cross-document
  deduplication of reinforced rules.

**Accepted cost**:

- Foundational documents carry higher volume than strict
  non-redundancy would permit. This is the intended trade.
- Fitness thresholds on foundational documents need to be sized
  for reinforcement density, not minimum information content.

## Notes

This PDR names the doctrine that is operationally enforced by
PDR-003 (Sub-Agent Protection of Foundational Practice Docs).
PDR-003 operates on the permissions dimension (who may edit);
PDR-002 operates on the substance dimension (what the content
should look like). Together they close the loop.

### Host-local context (this repo only, not part of the decision)

In the repo where this PDR was authored, the foundational documents
referenced are `.agent/directives/AGENT.md` (the agent entry
point), `.agent/directives/principles.md`, and
`.agent/directives/testing-strategy.md`. The specific fitness
thresholds on those files, and any repo-local decision to raise
them in support of this doctrine, are host-local concerns and
belong in a host-repo ADR or the host repo's fitness-function
notes. They are not part of this PDR's substance.
