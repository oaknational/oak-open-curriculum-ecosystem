---
name: "Sector reusable components adoption contract"
overview: "Partner-facing contract for external reuse of Oak's reusable sector-component fabric anchored in docs/foundation/VISION.md canonical inventory-playbooks inputs, differentiated from upstream API access and Oak-hosted deployments."
status: current
specialist_reviewer: "docs-adr-reviewer, architecture-reviewer-betty"
isProject: false
last_updated: 2026-04-30
related_plans:
  - "../future/oak-openapi-monorepo-integration.plan.md"
  - "../knowledge-graph-adoption/future/oak-knowledge-graph-external-adoption.plan.md"
todos:
  - id: t1-maintain-cross-links
    content: "Keep README ↔ Vision ↔ sector-engagement roadmap claims aligned when canonical inventory evolves."
    status: pending
  - id: t2-first-adopter-profile
    content: "Name first external adoption profile(s) MAT / edtech / research / public sector and prioritise playbook sections."
    status: pending
  - id: t3-supported-vs-experimental-matrix
    content: "Define supported, experimental, and reference-only classifications per component inventory line with packaging and versioning notes."
    status: pending
  - id: t4-phase-4-playbook
    content: "Draft adoption playbook scaffold that references this contract and links to KG external adoption brief when graphs are central."
    status: pending
---

# Sector Reusable Components — Partner Adoption Contract

**Status**: Current — planning and documentation authority
**Lane**: `sector-engagement/current/`
**Collection**: `sector-engagement/`
**Purpose**: Tie partner-facing reuse claims and sector playbooks (roadmap Phase
4) to one canonical enumeration of reusable fabric.

Execution of implementation work remains owned by engineering collections (`sdk-and-mcp-enhancements`, `semantic-search`,
`knowledge-graph-integration`, `developer-experience`, and so forth). This
plan owns the **meaning** external organisations should assign to reuse and the **evidence gates** before those claims harden publicly.

---

## Authoritative canon

The reusable sector-component inventory and per-line intent live in foundation
Vision, section **What We Deliver** — repeatable components designed to shorten
sector innovation loops:

[docs/foundation/VISION.md — What We Deliver](../../../docs/foundation/VISION.md#what-we-deliver)

That section is **normative documentation** until superseded explicitly. README
summaries must not invent additional official component sets without aligning
them back here.

Distinct from that inventory:

| Layer | Meaning for partners |
| --- | --- |
| **Oak Open Curriculum upstream API** | Open licence data contracts and HTTP access — Oak-hosted; reproducible curriculum content without adopting this repo's toolchain. |
| **Hosted Oak surfaces** | Oak-run deployments (such as references in repo docs under `oaknational.dev`) — product usage, distinct from cloning pipeline patterns. |
| **Reusable components (this thread)** | Source, configuration, scaffolding, conventions, Practice: adopt, fork, or template from this repository according to maturity labels yet to be defined in playbook work. |

---

## Relationship To Adjacent Threads

1. **[Future: Oak OpenAPI monorepo integration](../future/oak-openapi-monorepo-integration.plan.md)** — Repo topology affects **how**
   partners depend on pipelines and artefacts; inventory entries stay valid descriptions of intent even if packaging paths evolve.
2. **[Future: Oak knowledge graph external adoption](../knowledge-graph-adoption/future/oak-knowledge-graph-external-adoption.plan.md)** — Applies when KG assets,
   ontology exports, graph projections, or MCP graph resources dominate the adoption story.
3. **`developer-experience/` publishing** — When components become `@oaknational`
   packages, this contract inherits version and support semantics from those lanes.

Sector playbooks SHOULD cross-link KG adoption when graphs are centre-frame so
ontology governance narratives are not duplicated inconsistently.

---

## Partner-Facing Claims Discipline

Until `t3-supported-vs-experimental-matrix` closes:

1. Prefer **enumeration from Vision**: name only what appears under What We Deliver's reusable component list unless this plan is amended.
2. Separate **capabilities primitives** (the three shipped product lanes in README) from **component reuse** narratives (fabric for other codebases) — downstream marketing MUST mirror that split.
3. Never imply production support tiers not decided by Oak-owner policy.

---

## Success Signals Toward Phase 4 Playbooks

Phase 4 in [roadmap.md](../roadmap.md) closes when a partner-facing thread ships
a playbook, adoption decision, explicit no-go, or engineering hand-off with
external acceptance criteria grounded in observable reuse.

Promotion criteria for escalating this contract into executable engineering:

1. First external adoption profile locked (`t2`).
2. Maturity matrix drafted (`t3`).
3. Playbook skeleton reviewed against Vision inventory (`t4`).

---

## Validation (planning artefacts only)

When this file or Vision inventory cross-links move:

```bash
pnpm exec markdownlint README.md docs/foundation/VISION.md \
  .agent/plans/sector-engagement/current/sector-reusable-components-adoption.plan.md
pnpm format:root
git diff --check
```
