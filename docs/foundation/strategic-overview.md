---
title: Strategic Overview
status: active
last_reviewed: 2026-03-12
---

# Strategic Overview

> **Last updated**: 12 March 2026

This document is a reading guide for technical leaders evaluating this
repository. It connects the strategic vision to the delivery roadmap and
explains how the engineering system enables the pace and quality of delivery.

**Reading time**: ~10 minutes for this document; ~30 minutes for the full
reading path.

## The Reading Path

Each document builds on the previous one. Read them in order:

1. **This document** — context, reading guide, and evidence summary
2. [**VISION.md**](VISION.md) — what this repository delivers, why it
   matters, and how impact compounds
3. [**High-level plan**](../../.agent/plans/high-level-plan.md) — milestone
   sequence, blocking dependencies, and current status (focus on the
   Milestone Sequence and State Progression sections; the remainder is
   operational execution detail)
4. [**Beyond Beta**](#beyond-beta-from-initial-release-to-ongoing-product) —
   what is needed to sharpen the initial public beta into a sustained product
   (section below)

Supporting material (optional, for deeper dives):

- [How the Agentic Engineering System Works](agentic-engineering-system.md) —
  the Practice explained as an integrated engineering system
- [ADR index](../architecture/architectural-decisions/) — 130+ architectural
  decisions documenting every significant design choice
- [Curriculum Guide](../domain/curriculum-guide.md) — Oak's curriculum
  structure in plain language

---

## Where We Are

Two milestones are complete. Two remain.

| Milestone              | Status   | What it delivered                                                                                                                          |
| ---------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| M0: Open Private Alpha | Complete | Repository public on GitHub; SDK, MCP servers, and search infrastructure available to external developers                                  |
| M1: Invite-Only Alpha  | Complete | Live server at `curriculum-mcp-alpha.oaknational.dev`; v1.0.0 released; Oak staff and invited users accessing curriculum via AI assistants |
| M2: Open Public Alpha  | **Next** | Reliable search (ES re-index), unified MCP Apps infrastructure with branding, knowledge graph alignment, Sentry + OTel foundation          |
| M3: Public Beta        | Planned  | Production authentication (Clerk), exemplar interactive UI, alerting and operational hardening                                             |

M0 and M1 were delivered by a single developer using agentic engineering
practices — from first commit to live, authenticated, publicly accessible
server in approximately eight months, with the final two milestones (repository
public and server live) completing within days of each other in early March 2026.

The [high-level plan](../../.agent/plans/high-level-plan.md) contains the full
milestone detail, blocking dependencies, and current execution state.

---

## How Agentic Engineering Enables This

This repository is built entirely by AI agents directed by a single engineer.
Every line of code, configuration, test, and documentation was authored by
agents. The human role is system design: defining architectural constraints,
quality gates, and reviewer workflows; then providing direction and corrective
feedback.

This is not a claim about AI replacing developers. It is a claim about
**leverage**: one engineer with the right engineering system can sustain the
velocity and quality normally associated with a small team.

### The Practice — Evidence

The engineering system that makes this possible is called **the Practice**. It
is a self-reinforcing system of principles, specialist reviewers, quality gates,
and institutional memory. Key evidence:

| Indicator                      | Value  | What it demonstrates                                                                                                                                                     |
| ------------------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Architectural Decision Records | 130+   | Every significant design choice is documented, reasoned, and permanent                                                                                                   |
| Specialist reviewer agents     | 21     | Targeted review coverage: architecture (4 lenses), types, tests, security, config, docs, MCP, Elasticsearch, and more                                                    |
| Quality gates                  | 11     | sdk-codegen, build, type-check, lint, format, markdownlint, test, test:ui, test:e2e, smoke, subagents:check — all blocking, always                                       |
| TypeScript source files        | ~1,900 | Across 14 workspaces (3 apps, 3 SDKs, 5 core packages, 2 libraries, 1 agent-tools workspace)                                                                             |
| Test files                     | ~380   | Unit, integration, and E2E tests; TDD at all levels is a non-negotiable rule                                                                                             |
| Total commits                  | ~170   | Focused, well-structured history from July 2025 to present                                                                                                               |
| Self-improving                 | Yes    | The Practice contains a learning loop that captures mistakes, distils patterns, and graduates them into permanent governance — including improvements to the loop itself |

The Practice is also **portable**. It travels between repositories via a
[plasmid exchange mechanism](../architecture/architectural-decisions/124-practice-propagation-model.md),
carrying its learning loop to new contexts. Different repos stress-test it
against different work, and learnings flow back.

For the full engineering explanation, see
[How the Agentic Engineering System Works](agentic-engineering-system.md).

---

## Handoff Readiness

The repository is designed for handoff to teams of mixed experience levels.

### What is already in place

- **Progressive disclosure documentation**: root README → Quick Start →
  workspace READMEs → ADRs → TSDoc. Each layer adds depth without requiring
  the previous layer to be exhaustive.
- **Schema-first architecture**: the Cardinal Rule ensures that when the
  upstream OpenAPI schema changes, running `pnpm sdk-codegen` brings all
  workspaces into alignment automatically. New developers do not need to
  understand the full type derivation chain to make changes safely.
- **Quality gates as safety net**: 11 blocking gates catch regressions within
  seconds. Pre-commit hooks enforce format, lint, type-check, and test before
  code reaches the repository. A developer can make a change, run the gates,
  and have high confidence it is correct — regardless of their experience
  level.
- **Specialist reviewers**: the 21 sub-agent reviewers provide targeted
  feedback that would otherwise require senior engineer review. They are
  invoked automatically after non-trivial changes.
- **Comprehensive ADR history**: 130+ ADRs mean that "why was it done this
  way?" is almost always answerable by searching the ADR index.
- **AI agent onboarding**: agents ground themselves via the `start-right`
  workflow, which loads principles, testing strategy, and schema-first
  directive before any work begins. This means AI-assisted development works
  out of the box for new team members using Claude, Cursor, or other
  MCP-capable tools.

### What would strengthen handoff further

- **Contribution guidelines for external contributors** — currently Oak
  team-only; broadening this is a natural M3 activity
- **Runbook for operational tasks** — deployment, index lifecycle, Clerk
  management; partially covered by workspace READMEs but not unified
- **Onboarding simulation** — the onboarding path has been tested through
  four automated simulation runs; a fresh human walkthrough would validate
  assumptions

---

## Beyond Beta: From Initial Release to Ongoing Product

The high-level plan defines what is needed to reach public beta (M3). This
section addresses what is needed to sharpen that initial release into a
**sustained product** — one that can be operated, maintained, and evolved by a
team rather than a single engineer.

### Operational maturity

- **Production observability foundation**: Sentry + OTel integration is now an
  M2 blocker for the canonical runtimes. Once in place, the team has shared
  structured logging, error tracking, trace correlation, and MCP Insights
  instrumentation from day one. The collection entry point is:
  [architecture-and-infrastructure/README.md](../../.agent/plans/architecture-and-infrastructure/README.md).
- **Monitoring and alerting**: sign-up velocity, API quota consumption, abuse
  pattern detection, and search quality regression alerts. These build on the
  Sentry/OTel foundation.
- **Index lifecycle management**: the blue-green index swapping
  ([ADR-130](../architecture/architectural-decisions/130-blue-green-index-swapping.md))
  is already implemented. Ongoing product operation requires documented
  runbooks for re-indexing, bulk data refresh, and index health checks.

### Team scaling

- **The Practice scales with the team**: quality gates, specialist reviewers,
  and the learning loop are not dependent on any individual. New team members
  (human or AI) ground themselves through the same `start-right` workflow and
  are governed by the same rules.
- **Mixed experience levels are accommodated**: the schema-first architecture
  means that type safety is structural, not dependent on developer discipline.
  The quality gates catch common mistakes. The ADR history provides
  architectural context.
- **Code ownership boundaries are clear**: the monorepo structure (apps, SDKs,
  core, libs) provides natural ownership boundaries. ESLint architectural
  rules enforce dependency direction.

### Product evolution

- **MCP Apps as the interaction surface**: M3 delivers the exemplar UI
  (`user_search` tool with React components). This establishes the pattern for
  all future interactive curriculum experiences within AI platforms.
- **Knowledge graph integration**: the KG alignment audit (M2/M3) determines
  the integration path — whether through Elasticsearch projections, separate
  Neo4j provisioning, or explanation-first graph augmentation. This is the
  foundation for richer curriculum navigation.
- **Extension surfaces**: the MCP Apps standard migration
  ([roadmap](../../.agent/plans/sdk-and-mcp-enhancements/roadmap.md)) unifies
  all platform support (ChatGPT, Claude, Cursor, generic MCP hosts) behind a
  single server. New capabilities are added once and available everywhere.
- **Search quality as a continuous discipline**: the ground-truth benchmarking
  framework and evaluation harness are already operational. Ongoing product
  quality means expanding ground-truth coverage and monitoring MRR regression.

### What is explicitly not needed

- **No on-call or bespoke incident response** — standard internal processes
  apply
- **No separate infrastructure team** — the Vercel deployment model and
  Elasticsearch Serverless mean infrastructure is managed, not operated
- **No rewrite** — the codebase is production-grade today; the path forward is
  incremental delivery of M2 and M3 blocking work

---

## Summary

This repository delivers typed curriculum access, AI-agent integration, and
semantic search as reusable infrastructure for Oak's mission. Two milestones
are complete; two remain. The agentic engineering practice that built it is
the same system that governs ongoing work — and it scales with the team.

The full picture:

- **Why** → [VISION.md](VISION.md)
- **What and when** → [High-level plan](../../.agent/plans/high-level-plan.md)
- **How** → [The Practice](agentic-engineering-system.md)
