---
pdr_kind: governance
---

# PDR-035: Agent Work Capabilities Belong to the Practice

**Status**: Accepted
**Date**: 2026-04-28
**Related**:
[PDR-009](PDR-009-canonical-first-cross-platform-architecture.md)
(canonical-first agent artefact architecture);
[PDR-010](PDR-010-domain-specialist-capability-pattern.md)
(capability triplets and optional tooling);
[PDR-011](PDR-011-continuity-surfaces-and-surprise-pipeline.md)
(continuity and learning loop);
[PDR-024](PDR-024-vital-integration-surfaces.md)
(Core/repo integration surfaces);
[PDR-027](PDR-027-threads-sessions-and-agent-identity.md)
(thread, session, and identity model);
[PDR-029](PDR-029-perturbation-mechanism-bundle.md)
(agent-work tripwires).

## Context

Practice-bearing repos need mechanisms for agent collaboration,
coordination, work management, direction, lifecycle, identity,
claims, handoff, review routing, state mutation, consolidation, and other
adjacent forms of agent work. These mechanisms are often implemented
through host-specific files, tools, hooks, or platform adapters.

That implementation specificity creates a classification trap. A
capability may be written in one repo's language, use one repo's file
layout, or depend on one platform's hooks, yet still be a Practice
capability that future Practice-bearing repos would otherwise have to
rediscover. Treating the implementation as the owner of the concept
would make the Practice less portable and would strand reusable
governance in phenotype surfaces.

The Codex session-identity slice is a concrete example: a repo may implement
session-start context through Codex hooks, derive names in TypeScript, and
store claims in host-local JSON, but the reusable capability is still Practice
identity and coordination doctrine.

## Decision

Agent-work capabilities are Practice substance by default.

The Practice memotype owns the behavioural contract, vocabulary,
lifecycle, governance rule, and portability expectation for agent
collaboration, coordination, work management, direction, identity,
claims, handoff, review routing, learning flow, command/rule
activation, and adjacent agent-operational mechanisms.

Host repos own only phenotype expressions of those capabilities:
specific files, state instances, tools, hooks, platform wrappers,
schemas, scripts, and local execution plans. A capability being
implemented in TypeScript, Python, Rust, Java, shell, CI, editor
configuration, or any other ecosystem does not transfer conceptual
ownership away from the Practice.

Default classification:

1. If the behaviour governs how agents work, coordinate, are directed,
   record state, manage lifecycle, review, learn, or hand off work,
   classify it as Practice-shaped first.
2. If the behaviour describes one host repo's implementation path,
   command surface, file layout, credentials, platform hook, or
   runtime constraint, classify that part as phenotype.
3. If the boundary is uncertain, preserve the concept as a Practice
   candidate and narrow only the implementation detail to the host.

For session identity, the portable capability is the full identity block and
its lifecycle: derive or obtain it at session start, use the same block for
thread registration and shared-state writes, preserve additive history, and
audit anonymous or stale records before repair. Hook files, title/statusline
text, CLI binaries, and state-file schemas are host phenotype unless and until
their concepts are deliberately promoted.

## Rationale

The reusable unit is the agent-work behaviour, not the language or
folder that first implements it. Without this rule, every repo would
relearn the same coordination, handoff, identity, and state-management
lessons because their local implementation details look different.

The alternative was to let each repo decide whether its agent tooling
was local doctrine or Practice doctrine. That makes portability depend
on hindsight and invites thick host-specific layers. The Practice needs
the opposite default: portable concept first, thin local expression
second.

This also preserves the specificity gradient. The most context-specific
layer may be very local, but it should be the thinnest possible
adapter over a portable behavioural contract.

## Consequences

- New agent-work concepts graduate to PDRs, Practice Core sections,
  canonical rules, skills, commands, or portable patterns before they
  are treated as merely local tooling.
- Host ADRs may document how one repo implements the Practice
  behaviour, but they do not become the source of truth for the
  portable concept.
- Local tools and schemas should cite or clearly reflect the Practice
  decision they implement.
- Platform-specific hooks are acceptable implementation aids, but they should
  stay thin and fail soft unless the Practice has separately accepted a hard
  enforcement point.
- Local plans and state records remain execution and evidence
  surfaces. Settled doctrine in them must be graduated into Practice
  homes or host phenotype ADRs, depending on scope.
- Implementations remain optional by host. A Practice-bearing repo may
  choose a different stack or no tool at all for a capability that is
  unnecessary there, provided the portable Practice contract remains
  understandable.

## Notes

Host repos may record their local implementation boundary in ADRs,
READMEs, or state documentation. Those records are phenotype context:
useful for that repo, but not substitutes for the portable Practice
decision.
