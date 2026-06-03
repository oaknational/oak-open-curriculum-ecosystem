# ADR-189: Audience-Led Agent Capability Taxonomy

**Status**: Accepted 2026-06-03
**Date**: 2026-06-03
**Related**:
[PDR-051](../../../.agent/practice-core/decision-records/PDR-051-vendor-agnostic-skills-standardisation.md)
(vendor-agnostic skills standardisation — owns repo-working skill
packaging and adapter generation; this ADR scopes that doctrine to
the repo-working category rather than the whole capability estate);
[PDR-010](../../../.agent/practice-core/decision-records/PDR-010-domain-specialist-capability-pattern.md)
(specialist capability triplets and agent classification);
[ADR-125](125-agent-artefact-portability.md)
(canonical content / platform adapter model — the packaging
mechanics this taxonomy treats as implementation detail).

## Context

The repo uses **skills** as a Practice workflow term, while adjacent
work serves two further audiences: developers using Oak technical
services, and teachers or educators using Oak curriculum support
through AI hosts. Platform packaging also uses `SKILL.md`, which can
make the host mechanism look like the concept. Without a ratified
taxonomy, three leakage modes recur: Practice governance vocabulary
appearing in user-facing products, packaging mechanics (`SKILL.md`,
adapters, repo paths) becoming user-facing language, and developer
guidance being framed as teacher workflow or vice versa.

The vocabulary itself is defined in
[`agent-capability-vocabulary.md`](../../../.agent/memory/executive/agent-capability-vocabulary.md);
the application pass is owned by the
[skills-classification-taxonomy plan](../../../.agent/plans/discovery/future/skills-classification-taxonomy.plan.md);
the supporting ecosystem survey is the
[skills-distribution-channels report](../../../.agent/plans/discovery/future/skills-distribution-channels-suggestions.report.md).

## Decision

Oak distinguishes three categories of agent-readable workflow and
knowledge surface, named by audience:

1. **Repo-working skills** — Practice-governed workflows for agents
   working in this repo.
2. **Oak developer capabilities** — guidance for developers and
   agents using Oak APIs, SDKs, MCP, search, graph, and data
   services correctly.
3. **Curriculum assistance capabilities** — teacher- and
   educator-facing assistance powered by Oak curriculum data.

`SKILL.md`, Agent Skills packages, MCP tools/resources/prompts, and
plugin bundles are **packaging or runtime mechanisms**. They never
determine the durable category name.

The taxonomy has a second, orthogonal **distribution axis**: where a
capability is deployed, independent of who it serves.

- **Repo-internal** — lives under this repo's `.agent/` canonical
  surface with generated platform adapters, consumed by agents
  working here.
- **Distributable** — published for installation or loading by
  external systems (skills libraries, discovery indexes, MCP apps,
  plugin marketplaces).
- **Both** — a capability, or distinct versions of one, may be
  dual-homed: a repo-internal version and a distributed version of
  the same capability are expected, not anomalous.

Audience names the category; the distribution axis names the
deployment locus; packaging remains mechanism. The three are
recorded independently.

## Consequences

- Unqualified "skill" is reserved for repo-working Practice
  workflows and platform skill packages; developer-facing guidance
  is a "developer capability" and teacher-facing guidance is a
  "curriculum assistance capability" even when either is later
  packaged as a platform skill.
- Teacher-facing copy never exposes repo-working or platform
  mechanics (`SKILL.md`, adapters, Practice, repo workflows).
- PDR-051 remains the packaging doctrine for the repo-working
  category only; it is not the capability doctrine for the other
  two categories.
- Plugin bundles and host skill formats are generated packaging
  artifacts (adapter targets), not the source taxonomy.
- New agent-readable surfaces are named by the boundary tests in
  the executive vocabulary (who benefits, what authority travels,
  what vehicle delivers), with audience deciding the name and the
  vehicle recorded as packaging.
- Inventory and audit work records audience and distribution locus
  as separate columns; "repo-internal", "distributable", and "both"
  are all legitimate values, and dual-homed versions of one
  capability do not force a category change on either side.

## Validation

1. This file exists at
   `docs/architecture/architectural-decisions/189-audience-led-agent-capability-taxonomy.md`
   and the ADR index README includes the ADR-189 entry.
2. The three categories, the distribution axis, and the principle
   that packaging mechanics do not determine the conceptual category
   are stated in `.agent/memory/executive/agent-capability-vocabulary.md`
   (§Canonical Categories, §Distribution Axis, §Naming Rules).
3. The skills-classification-taxonomy plan cites this ADR as the
   ratification of its previously blocking prerequisite.
