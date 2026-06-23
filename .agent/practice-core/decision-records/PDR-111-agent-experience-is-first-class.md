---
pdr_kind: pattern
---

# PDR-111: Agent Experience Is a First-Class Practice Optimisation Principle

**Status**: Accepted
**Date**: 2026-06-21
**Related**:
[PDR-035](PDR-035-agent-work-capabilities-belong-to-the-practice.md)
(agent-work capabilities belong to the Practice — the substrate this PDR
optimises is Practice substance);
[PDR-060](PDR-060-tooling-friction-is-first-class-user-feedback.md)
(tooling friction is first-class user feedback — the capture half of the
loop this PDR names the optimisation target of);
[PDR-036](PDR-036-friction-as-structural-finding.md)
(friction as structural finding — a friction signals incomplete structure);
[PDR-055](PDR-055-cli-affordance-set-discipline.md)
(CLI affordance-set and API-surface-design discipline — one operational
instance of optimising AX);
[PDR-098](PDR-098-doctrine-traction-firing-detection-response.md)
(doctrine-traction firing/detection/response — the mechanism class AX cures prefer).

## Context

A Practice where agents both author and use the tooling has a property a
human-only Practice does not: the **substrate the work happens in** — the
coordination CLIs, the comms and claims surfaces, the watchers, the quality
gates, the harness and its context behaviour — is itself a product, and its
users are agents. PDR-060 already named one consequence (agent-observed
friction is first-class user feedback and must be captured). But capture is
only half a loop. The other half has never been named as doctrine: that the
quality of that substrate — its discoverability, safety, determinism, and
ease of correct use — is a **first-class thing the Practice optimises for**,
on the same footing as the quality of the product the Practice ships.

A friction-capture backlog (PDR-060) makes the gap concrete: a Practice that
captures agent-observed tooling friction accumulates a backlog that is, by
construction, an AX backlog — nearly every entry is an agent reporting that the
substrate served it poorly. Yet capture alone leaves no concept that names
*agent experience* as the thing those signals are evidence about, no principle
that ranks AX cures by leverage, and no doctrine that makes AX a standing
concern reviewers and designers must weigh. Without this principle, AX exists
only as scattered symptoms and a capture discipline, never as a first-class
optimisation target.

## Decision

**Agent Experience (AX) — the quality of the substrate agents work in for the
agents using it — is a first-class Practice optimisation principle.** The
Practice treats the agent-facing substrate as a product with agent users, and
optimises its experience deliberately, not only by reacting to reported pain.

Operational corollaries:

1. **AX is a measured first-class concern, not a residual.** The substrate's
   discoverability (can an agent invoke it correctly the first time),
   safety (can a correct-looking invocation corrupt state), determinism (does
   the same call behave the same way across sessions and worktrees), and
   liveness (do awareness surfaces actually fire) are tracked and improved as
   product qualities, not patched only when an agent complains.

2. **AX cures are ranked by leverage, and prefer structural over per-instance.**
   An indiscriminate friction count is a set of cause-classes, not N
   independent bugs. The cure that retires a *class* (a conformance guard, a
   generated invocation, a shared resolver) outranks N per-site patches. This
   is the structural-cure-over-doc-patch shape applied to the substrate.

3. **AX is a standing review lens.** Whenever substrate work (a CLI, a comms
   or claims surface, a watcher, a gate, a hook) is designed or reviewed, its
   AX impact is weighed explicitly: does this make the substrate easier or
   harder for the agent using it; is any friction it reveals captured; is the
   cure structural. The lens is operationalised by an always-applied
   review-lens rule in the host adapter.

4. **The drain is part of AX, not only the capture.** A friction faithfully
   captured but never cured is a standing AX cost. The Practice owes the
   capture→cure loop a *visible, mechanised drain*, not only a capture
   discipline (PDR-060) — so AX debt cannot silently accumulate.

## Rationale

**Why this is portable Practice doctrine, not repo-local.** Any
Practice-bearing repo where agents author and use their own tooling re-derives
the same claim: the substrate is a product, its users are agents, and its
experience is a first-class quality. The doctrine is independent of which
tools, platforms, or host language. Adopter scope: any agent-bearing Practice.

**Why it is not an ADR.** AX is about how the Practice operates and what it
optimises for — the agents-as-users epistemology — not about any one host's
product architecture. The specific host instruments (a host's coordination CLI,
its validators tier, its watcher implementation) are host adoption concerns that
ride on top, recorded on the host's own ADR and bridge surface.

**Why it is not (only) a rule.** The substance here is the *principle* — that
AX is first-class. The behavioural cure (weigh AX impact at design/review
time) is downstream; a host's always-applied review-lens rule operationalises
that slice. A principle this broad spans multiple cures (capture, structural
design, drain mechanisation, review) and so is doctrine, not one always-applied
modifier.

**Why it generalises rather than duplicates PDR-060.** PDR-060 is the *capture*
discipline (friction is feedback, route it durably). PDR-111 is the *target*:
the thing that feedback is evidence about and that the Practice optimises. They
compose — capture without an optimisation target is a backlog that only grows;
an optimisation target without capture is blind.

## Consequences

### Required

- Substrate work is designed and reviewed with AX impact weighed explicitly
  (the review-lens rule).
- AX cures are sized to cause-classes and prefer structural retirement of a
  class over per-instance patches.
- The capture→cure loop carries a visible, mechanised drain so AX debt is not
  silently accumulated; a captured friction has a routable home or an explicit
  deferral.

### Forbidden

- Treating the agent-facing substrate as a second-class internal tool whose
  rough edges are acceptable because "agents will cope."
- Closing a substrate change as done on functional correctness alone, with no
  consideration of whether it made the substrate easier or harder to use
  correctly.
- Letting captured friction accumulate without a home or a recorded
  disposition (the drain-gap failure mode).

### Accepted cost

- Substrate changes carry a small additional review dimension (AX impact). The
  cost is amortised across every agent who later uses the surface; the cost of
  *not* weighing it is recurrent friction re-discovered session after session.

## Source

Graduates the agent-experience principle from a worked cause-class analysis of
an agent-tooling friction backlog (owner-directed). The cause-class method and
the drain-gap finding are the worked evidence; this PDR names the principle they
are evidence for. Host adoption — the analysis report, the always-applied
review-lens rule, and the implementation plan — is recorded on the host's own
surfaces, not here, per Practice-Core portability.
