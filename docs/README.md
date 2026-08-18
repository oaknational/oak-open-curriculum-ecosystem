---
boundary: cross-boundary
doc_role: index
authority: docs-root-navigation
status: active
last_reviewed: 2026-08-07
---

# Documentation for Oak Open Curriculum Ecosystem

**Last Updated**: 2026-08-07
**Status**: Active index

## Getting Started

- **New to everything?** → run `/oak-under-the-hood` in an agent session
  (`$oak-under-the-hood` in Codex) — the orientation lens; it works out whether you
  want a specific answer, an area overview, or a guided walk that can set up
  your machine, reads the live docs, and meets you there
- **Evaluating the project?** → [VISION.md](../VISION.md) for the
  timeless framing: Oak's open curriculum as AI-native infrastructure across
  **three co-equal value streams** — the teacher-facing MCP app, engineering
  tools for the wider ecosystem (SDK, semantic search, curriculum graph,
  evidence surfaces), and the agentic-engineering Practice. Then read the
  latest snapshot in the [reports surface](../.agent/reports/) and the live
  [high-level plan](../.agent/plans-backlog-2026-07/high-level-plan.md)
- **Not a developer?** → [Curriculum Guide](domain/curriculum-guide.md) — Oak's curriculum structure in plain language
- **New to the repo?** → [Root README Quick Start](../README.md#quick-start) for setup, then [CONTRIBUTING.md](../CONTRIBUTING.md) for the development process
- **A developer working with agents?** → [Working with this Repo for Devs](engineering/working-with-this-repo-for-devs.md) — the practical guide: how you direct the work, what the agents do around you, and what keeps the quality honest
- **Wondering what a surface or glyph means?** → [Developer Experience](engineering/developer-experience.md) — session surfaces, feedback loops, and the statusline deep-dive
- **Working with AI?** → Start with the canonical
  [`start-right-quick` shared workflow](../.agent/skills/start-right-quick/shared/start-right.md),
  or invoke the `oak-start-right-quick` platform adapter (`/oak-start-right-quick`
  in Claude Code, Cursor, and Gemini; `$oak-start-right-quick` in Codex). Then
  read [AGENT.md](../.agent/directives/AGENT.md).
- **Need an optional map of the wider agentic corpus?** → [Agentic Engineering Research Lanes & Hub](../.agent/research/agentic-engineering/README.md) — concept-and-deep-dive hub linking canon, deep dives, research, evidence, reports, and docs surfaces
- **Architecture source of truth?** → [ADR index](architecture/architectural-decisions/) — Architectural Decision Records define how the system should work
- **Browsing by section?** → [Foundation](foundation/README.md) · [Governance](governance/README.md) · [Architecture](architecture/README.md) · [Design](design/README.md) · [Engineering](engineering/README.md) · [Operations](operations/README.md) · [Domain](domain/README.md)

## Core Documentation

### Architecture

- [OpenAPI Pipeline](architecture/openapi-pipeline.md) - **THE** architecture doc: how types flow from schema
- [Architecture Decision Records](architecture/architectural-decisions/) — Architectural source of truth (the schema-first generation ADRs below underpin everything in this repo)
- [Design Decision Records](design/README.md) — Decisions about the design system as a designed artefact, graph-structured with typed edges
- [ADR-029](architecture/architectural-decisions/029-no-manual-api-data.md) — No manual API data structures
- [ADR-030](architecture/architectural-decisions/030-sdk-single-source-truth.md) — SDK as single source of truth
- [ADR-031](architecture/architectural-decisions/031-generation-time-extraction.md) — Generation-time extraction
- [ADR-048](architecture/architectural-decisions/048-shared-parse-schema-helper.md) — Shared parsing helper pattern
- [Provider System](architecture/provider-system.md) - Current app-local provider composition and DI boundaries

### Development

- [Root README Quick Start](../README.md#quick-start) — install, verify, and key commands for new contributors
- [CONTRIBUTING.md](../CONTRIBUTING.md) — development process, conventions, and quality expectations
- [Development Workflow](engineering/workflow.md) - Complete lifecycle: branching, TDD, CI, review, merge, release
- [Environment Variables](operations/environment-variables.md) - Complete setup guide
- [Extension Points](engineering/extending.md) - How to add new MCP tools, search indices, SDK helpers
- [Troubleshooting](operations/troubleshooting.md) - Common issues and solutions
- [Tooling](engineering/tooling.md) - Development tools and versions
- [Agent Tools Workspace](../agent-tools/README.md) - Operator CLIs for agent monitoring and session takeover

### Curriculum Data

- [Curriculum Guide](domain/curriculum-guide.md) - **Start here** if you're new to Oak's curriculum: plain-language structure, KS4 complexity, user personas
- [Data Variances](domain/DATA-VARIANCES.md) - **Essential**: Subject/key stage differences, transcript availability, structural patterns
- [Ontology Data](../packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts) (TypeScript source) - Domain model and structural patterns
- [Knowledge Graph](../packages/sdks/oak-sdk-codegen/src/mcp/property-graph-data.ts) (TypeScript source) - Canonical entity-relationship data used by generated tooling

### Engineering Practice

- [Working with this Repo for Devs](engineering/working-with-this-repo-for-devs.md) - The practical guide for developers directing agent sessions
- [How the Agentic Engineering System Works](foundation/agentic-engineering-system.md) - The Practice explained as an integrated engineering system
- [ADR-119](architecture/architectural-decisions/119-agentic-engineering-practice.md) - The formal architectural decision
- [Continuity Practice](../.agent/directives/continuity-practice.md) - Lightweight session handoff, conditional deep consolidation, and surprise capture (moved to directives)
- [**The Practice**](../.agent/practice-core/index.md) - Orientation and entry point for the Practice (agent-facing)
- [Agentic Engineering Research Lanes & Hub](../.agent/research/agentic-engineering/README.md) - Concept-and-deep-dive map for broader corpus discovery

## Code Standards and Testing

- [Development Practice](governance/development-practice.md) - Code standards and workflow
- [TypeScript Practice](governance/typescript-practice.md) - Type safety guidelines
- [Testing Strategy](../.agent/directives/testing-strategy.md) - TDD approach at all levels
- [Safety and Security](governance/safety-and-security.md) - Security measures and privacy protection
- [Accessibility Practice](governance/accessibility-practice.md) - WCAG 2.2 AA compliance, Playwright + axe-core testing
- [Design Token Practice](governance/design-token-practice.md) - DTCG three-tier model, contrast validation, CSS output
- [MCP App Styling](governance/mcp-app-styling.md) - CSS custom properties, host integration, font loading, CSP declarations

## Observability

- [MCP Server Observability Wiring](../apps/oak-curriculum-mcp-streamable-http/docs/observability.md) —
  authoritative per-app guide: auto-instrumentation, per-request span, scope enrichment, Express error handler DI wiring, redaction barrier entry points, source-map upload
- [Sentry Node Library](../packages/libs/sentry-node/README.md) —
  package-level reference for `@oaknational/sentry-node`: modes, shared delegates (hook registry), fixture store, redaction barrier closure
- [Runbook Index](operations/README.md#runbook-index) — all operational runbooks (ES index lifecycle, deploy, release, UAT, ingest), wherever they live; PDR-120
- [Sentry Deployment Runbook](operations/sentry-deployment-runbook.md) — deployment-side runbook
- [Sentry CLI Usage](operations/sentry-cli-usage.md) — `sentry-cli` adoption and `.sentryclirc` composition
- [ADR-143](architecture/architectural-decisions/143-coherent-structured-fan-out-for-observability.md) — observability boundary
- [ADR-160](architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md) — non-bypassable redaction barrier
- [ADR-162](architecture/architectural-decisions/162-observability-first.md) — observability-first principle (five-axis, vendor-independence)

## Search Application

For semantic search specific documentation:

- [Search App README](../apps/oak-search-cli/README.md) - Search application overview
- [Search Architecture](../apps/oak-search-cli/docs/ARCHITECTURE.md) - Search pipeline architecture
- [Ground Truth Protocol](../apps/oak-search-cli/docs/ground-truths/ground-truth-protocol.md) - Baselines and GT process
- [Search Plans](../.agent/plans-backlog-2026-07/semantic-search/) - Roadmap, acceptance criteria, experiments

## Additional Resources

- [GO workflow](../.agent/skills/go/shared/go.md) - Grounding workflow for structured task execution (ACTION/REVIEW cadence)
- [SDK README](../packages/sdks/oak-curriculum-sdk/README.md) - SDK generation and exports
