---
name: Ecosystem progress and direction summary
overview: Write a short, multi-paragraph formal synthesis of the Oak Open Curriculum Ecosystem's work to date, current focus, intended impact, and next directions, drawing across vision, milestone roadmap, observability strategy, knowledge-graph and pedagogy lanes, agentic engineering enhancements, and Practice propagation.
todos:
  - id: skim-adjacent
    content: Skim sdk-and-mcp-enhancements, semantic-search, user/dev-experience roadmaps and M2/M3 milestone files for accurate adjacent-thread paragraphs
    status: completed
  - id: draft-report
    content: Draft .agent/reference/work-to-date/oak-ecosystem-progress-and-direction-2026-04-20.md to the structure above (frontmatter, 7 sections, ~800–1,200 words)
    status: completed
  - id: self-review
    content: Self-review for British spelling, link correctness, brevity, and that adjacent threads are grounded in real plan surfaces
    status: completed
  - id: offer-reviewers
    content: After landing, offer optional docs-adr-reviewer / assumptions-reviewer pass
    status: completed
isProject: false
---

# Ecosystem progress and direction summary

## Output

A single new dated report:

- `.agent/reference/work-to-date/oak-ecosystem-progress-and-direction-2026-04-20.md`

Tone: formal report, mixed-audience (technical edtech / AI / engineering leadership), British spelling, no emojis. Length: short — roughly 800–1,200 words across multi-paragraph sections, not a monolithic wall.

Cite key surfaces with full-path markdown links, including [docs/foundation/VISION.md](docs/foundation/VISION.md), [.agent/plans/high-level-plan.md](.agent/plans/high-level-plan.md), [docs/foundation/strategic-overview.md](docs/foundation/strategic-overview.md), [docs/foundation/agentic-engineering-system.md](docs/foundation/agentic-engineering-system.md), and the relevant collection READMEs.

## Document structure

Working title: *Oak Open Curriculum Ecosystem — Progress and Direction (April 2026)*

1. **Framing** — one paragraph: what the repository is, the leverage thesis (turn Oak's open curriculum into AI-native infrastructure), the dual identity (product + agentic engineering exemplar), and that everything is MIT-licensed open source so the wider education, edtech, and AI sectors benefit.
2. **What we have delivered (M0 + M1)** — clustered, not bullet-listed:
   - **Product surfaces shipped**: schema-driven Curriculum SDK, hybrid semantic search on Elasticsearch Serverless with its own SDK, standards-compliant MCP server (HTTP + stdio) live at `curriculum-mcp-alpha.oaknational.dev`, MCP Apps UI extension surface, Clerk-based authn/z. Reference baselines: MRR 0.983 on lessons; 41 ground truths across 4 indices; v1.0.0 released; one infrastructure investment now serves teachers (in their AI clients) *and* edtech developers (in their dev environments).
   - **Engineering exemplar**: monorepo with strict layered architecture (apps → libs → core, no library-to-library imports), 160+ ADRs, 21 specialist sub-agent reviewers, 11 always-blocking quality gates, schema-first cardinal rule, local adapters around every third-party integration (Sentry, Elasticsearch, Clerk) so the system degrades gracefully and provider switches are cheap, and a dedicated onboarding flow.
   - **The Practice**: agentic engineering framework spanning research → planning → development → validation → release, with control loops (gates, reviewers, rules), learning loops (napkin → distilled → ADRs/governance via `jc-consolidate-docs`), continuity mechanisms across multiple time horizons, and a portable Practice Core that travels between repos via plasmid exchange so improvements are local *and* distributed.
3. **What we are doing now (M2 in flight)** — short paragraphs around the four open lanes:
   - Sentry + OpenTelemetry foundation under the five-axis observability principle (engineering, product, usability, accessibility, security — [ADR-162](docs/architecture/architectural-decisions/162-observability-first.md)) — runtime complete, deployment evidence bundle remaining; this and the user-facing search experience are the two M2 / public-alpha blockers.
   - The exemplar MCP App UI for self-directed semantic search, demonstrating both the product and the MCP Apps standard.
   - First-pass knowledge graph alignment audit, with a deliberate direct-use-first decision before any commitment to Neo4j or Stardog as a serving platform.
   - Continuous expansion of the Practice itself: governance-plane concept integration, operational-awareness surface separation, hallucination/evidence guards, mutation testing, Reviewer Gateway upgrade, and a growing roster of specialist capability triplets (Elasticsearch, Sentry, Clerk shipped or in flight; Express, cyber/web-API security, privacy/GDPR, OOCE, planning, TDD, DevX queued).
4. **Adjacent threads beyond the seed list** — paragraph each, deliberately broader than what was provided:
   - **Open education knowledge surfaces** — composing Oak with EEF Toolkit evidence and education-skills surfaces.
   - **Aila relationship** — explicit complementarity (shared retrieval, shared KG path, shared safety patterns) rather than overlap.
   - **Continuity and institutional memory** — the napkin / distilled / ADR / patterns / experience layering as the answer to "where does institutional knowledge live when agents do most of the coding?".
   - **Plan governance** — plan classes, lifecycles (`future/` → `current/` → `active/` → `archive/`), promotion/demotion triggers, and the observability *plan-density invariant* as evidence that we govern planning capacity, not only code.
5. **Impact and value** — short paragraph mapping to the three orders of effect from the vision (safe delivery → enablement → outcomes at scale), and the leverage argument: one infrastructure investment serving multiple downstream tools, internal and external. Reference the open licence as a force multiplier.
6. **Next directions** — concise paragraphs:
   - Closing M2 (observability evidence + user-facing search) → public alpha.
   - M3 / public beta blocked principally on production Clerk migration, exemplar UI hardening, operational alerting, and PostHog integration (already researched and planned).
   - Promote search to be reusable from the upstream Oak API to unlock content discovery.
   - Continue evolving the Practice and expanding the specialist roster; deepen continuity systems; nurture the cross-repo Practice ecosystem.
7. **What lives in the backlog (and why that's healthy)** — a short closing paragraph: the large body of multi-year research (product, engineering, agentic interactions) is governed — nothing is promoted to a plan without activation triggers, and multiple plan classes have their own validation mechanisms. The repo is designed to be self-explanatory; readers are invited to "ask the repo about itself".

## Source coverage (read before drafting)

Already read this session:

- [docs/foundation/VISION.md](docs/foundation/VISION.md), [docs/foundation/strategic-overview.md](docs/foundation/strategic-overview.md), [docs/foundation/agentic-engineering-system.md](docs/foundation/agentic-engineering-system.md)
- [.agent/plans/high-level-plan.md](.agent/plans/high-level-plan.md), [.agent/milestones/README.md](.agent/milestones/README.md)
- [.agent/plans/knowledge-graph-integration/README.md](.agent/plans/knowledge-graph-integration/README.md), [.agent/plans/observability/README.md](.agent/plans/observability/README.md), [.agent/plans/agentic-engineering-enhancements/README.md](.agent/plans/agentic-engineering-enhancements/README.md)
- The seed input at [.agent/reference/work-to-date/work-to-date-note-2026-04-20.md](.agent/reference/work-to-date/work-to-date-note-2026-04-20.md)

To skim before writing (≤5 short reads) so the "adjacent threads" paragraphs are accurate, not invented:

- [.agent/plans/sdk-and-mcp-enhancements/roadmap.md](.agent/plans/sdk-and-mcp-enhancements/roadmap.md)
- [.agent/plans/semantic-search/roadmap.md](.agent/plans/semantic-search/roadmap.md)
- [.agent/plans/user-experience/roadmap.md](.agent/plans/user-experience/roadmap.md) and [.agent/plans/developer-experience/roadmap.md](.agent/plans/developer-experience/roadmap.md)
- [.agent/milestones/m2-extension-surfaces.md](.agent/milestones/m2-extension-surfaces.md) and [.agent/milestones/m3-tech-debt-and-hardening.md](.agent/milestones/m3-tech-debt-and-hardening.md)

## Constraints

- British spelling, no emojis, no markdown tables in the body (per the user's stated preferences elsewhere); use prose paragraphs and modest bullet lists where they aid scanning.
- Multi-paragraph but short — resist the temptation to mirror every plan; cluster meaningfully.
- All file references as full-path markdown links.
- Add a YAML frontmatter block (`title`, `status: active`, `last_reviewed: 2026-04-20`, `audience`) consistent with other reports in [.agent/reports/](.agent/reports/).

## Out of scope (this turn)

- No edits to canonical docs (VISION, high-level-plan, milestones).
- No code or config changes.
- No new ADRs or rules.
- No invocation of sub-agent reviewers — this is a single short narrative, not an architectural change. Optional follow-up review by `docs-adr-reviewer` and/or `assumptions-reviewer` can be offered after the draft lands if you want a second pass.
