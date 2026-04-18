---
pdr_kind: governance
---

# PDR-016: Claim Propagation and Reference Quality

**Status**: Accepted
**Date**: 2026-04-18
**Related**:
[PDR-007](PDR-007-promoting-pdrs-and-patterns-to-first-class-core.md)
(new Core contract);
[PDR-013](PDR-013-grounding-and-framing-discipline.md)
(grounding before framing; this PDR governs what happens when a
grounded claim propagates onward).

## Context

Claims, counters, external references, and cross-document pointers
all propagate through the Practice. Each propagation step creates
an opportunity for information to degrade — either by drift from
source, by false confidence in quality signals, or by reference
quality that is lower than the content's substance warrants. Four
failure modes emerge:

1. **Claims propagated without source verification**. A technical
   claim originates in one session, gets cited in a plan, then in
   an ADR, then in a PDR. Each citation step treats the prior
   document as authority; none re-verify against the original
   source. The claim drifts from its evidence; when the evidence
   changes, the cascade does not update.

2. **Monotonic counters treated as quality indicators**. Two
   versions of a document each carry a sequence number (v12 vs
   v13). The higher number is treated as the newer or better
   version. In fact, the counters are independent — nothing
   guarantees that v13 has the changes from v12 or is a
   successor at all. The counter provides no quality information;
   treating it as such leads to the wrong version being used.

3. **Comments about external library behaviour degrade silently**.
   A code comment asserts what an external library does
   ("`foo()` returns null on timeout"). The library updates its
   behaviour; the comment remains. The comment is now wrong but
   reads as documented truth. Comments about externals are
   particularly prone to this because they describe behaviour
   outside the repo's control.

4. **Reference quality mismatched to content substance**. A
   reference can be an **opaque pointer** (a number, an ID), a
   **descriptive name** (a short label), or the **exported
   concept** (enough substance to understand without following
   the pointer). Portable content must travel with substance, not
   with pointers; host-local content can use pointers because
   the receiver has access. Mismatching the level of reference to
   the context breaks portability silently.

Underlying cause: references and propagation are cheap to produce
but fragile to maintain. Without explicit discipline, the fragility
compounds: each propagation step degrades the claim slightly; over
time the degradation is invisible but material.

## Decision

**Verify claims at each propagation step. Treat monotonic counters
as identifiers, never as quality indicators. Comments about external
behaviour are deprecated in favour of grounded references.
Reference quality matches portability: substance travels; pointers
stay local.**

### Verify before propagating

Every technical claim written into a plan, TSDoc, ADR, PDR, or
governance document cites its evidence. Before writing a claim,
verify the claim against the original source — not against a
secondary document that cites the claim. Secondary citations are
pointers; primary sources are evidence.

Practically:

- When citing an SDK behaviour, read the SDK's current
  documentation; do not cite a prior ADR that described the
  behaviour.
- When citing a configuration value or contract, read the current
  configuration file; do not cite a comment about it.
- When citing a metric or measurement, cite the measurement
  itself (with the date and conditions); do not cite a prior
  summary.

### Monotonic counters are not quality indicators

When comparing two versions of an artefact that each carry a
sequence counter (v12 vs v13, snapshot 5 vs snapshot 6), the
counter provides **no** information about which is newer, better,
or successor. Counters are identifiers only.

Quality requires additional evidence: a timestamp, a successor
link, a history, or a direct comparison. Without such evidence,
neither counter answers "which should I use?"

This applies to schema versions, dataset snapshots, report
revisions, and any other artefact where independent generation
produces independent counters.

### Comments about externals degrade

Code comments that describe the behaviour of an external library,
especially comments asserting what the library does NOT support,
degrade silently. The external changes; the comment does not.

Mitigations:

- **Prefer tests** over comments for documenting external
  behaviour. Tests fail when the behaviour changes; comments
  become wrong silently.
- **Prefer links to current docs** over inline comments about
  external behaviour. A link stays fresh; a comment goes stale.
- **If a comment is necessary**, name the version of the external
  at which the comment was verified, so future readers can
  check.
- **Avoid "X does NOT support Y"** comments entirely. Negative
  claims about externals are the highest-degradation category —
  they stay wrong the longest without visible signal.

### Three levels of reference quality

Every reference to content from another context is at one of
three quality levels:

| Level | Example | When appropriate |
|---|---|---|
| **Opaque pointer** | ADR-162, ticket #4719 | Host-local only; receiver has access |
| **Descriptive name** | "the Observability-First ADR", "the rate-limiter ticket" | Local-with-hint; slightly more portable but still requires receiver access |
| **Exported concept** | "vendor-independent observability — structured event information must persist when the primary sink is unavailable" | Portable; the substance travels with the reference |

Portable content (practice-core/ files, PDRs, patterns travelling
via exchange) must use **exported concepts**. Opaque pointers in
portable content break on arrival — the receiving repo has no
way to resolve the pointer.

Host-local content (repo-internal plans, ADRs, code) may use
opaque pointers because the receiver has access. A descriptive
name is better than an opaque pointer even locally (more
readable), but either is acceptable.

## Rationale

**Why verify before propagate.** Secondary citations inherit the
correctness of their source. If the source was wrong or has
changed, every downstream citation inherits the error. Verifying
at each step catches drift early; accepting secondary citations
as authority propagates drift silently.

**Why counters are not quality indicators.** Two independent
generations of the same artefact produce independent counters. A
higher counter means "generated later by this pipeline"; it does
not mean "better" or "newer than the other version." Treating the
counter as a quality signal is the common case and the wrong one;
the correct signal is a timestamp, a successor link, or direct
comparison.

**Why comments about externals degrade.** The comment is in the
repo; the external is outside the repo. Nothing couples the comment
to the external's current behaviour. A test couples; a link to
current docs couples; a comment with a version-asserted-at tag
couples. A bare comment does not.

**Why reference quality matches portability.** Portable content
travels to repos that do not have the source the pointer references.
An opaque pointer in portable content is a broken reference on
arrival. The substance has to travel with the reference or the
reference is degraded into noise.

Alternatives rejected:

- **Cite secondary sources for convenience.** Fast; propagates
  drift.
- **Treat counters as newer-is-better.** Intuitive; wrong.
- **Comment freely about externals.** Easy; degrades silently.
- **Use opaque pointers uniformly.** Compact; breaks portable
  content.

## Consequences

### Required

- Every technical claim in a permanent document cites its evidence
  at the point of writing (verified at that moment).
- Artefacts that carry sequence counters disclose that the counter
  is an identifier, not a quality signal, where confusion is
  plausible.
- External-behaviour documentation uses tests, linked current docs,
  or version-asserted-at comments — not bare comments.
- Portable content uses exported-concept references; host-local
  content may use opaque pointers or descriptive names.

### Forbidden

- Citing another document as authority for a technical claim
  without re-verifying against the original source.
- Treating higher counter value as "newer" or "better" without
  additional evidence.
- Bare comments about external library behaviour, especially
  negative claims about what an external does not support.
- Opaque pointers (bare IDs) in portable content that must travel
  to receivers without access to the referenced artefact.

### Accepted cost

- Verification at each propagation step is slower than citation
  chains. Justified by drift avoidance.
- Writing exported-concept references is more work than writing
  opaque pointers. Justified by portability.

## Notes

### Host-local context (this repo only)

Proven instances retained with `related_pdr: PDR-016`:

- `.agent/memory/patterns/verify-before-propagating.md` — originated
  from repeated incidents where claims were cited through citation
  chains without primary-source verification.
- `.agent/memory/patterns/monotonic-counter-is-not-quality-indicator.md`
  — originated from comparing independently-generated schema
  versions where the higher counter was incorrectly assumed to be
  the newer/better one.
- `.agent/memory/patterns/comments-about-externals-degrade.md` —
  originated from discovered stale comments about SDK behaviour
  that no longer matched current library versions.
- `.agent/memory/patterns/three-levels-of-reference-quality.md` —
  originated from Practice Core portability review where opaque
  pointers were found in portable content.
