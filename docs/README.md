---
boundary: cross-boundary
doc_role: index
authority: docs-root-navigation
status: active
last_reviewed: 2026-04-19
---

# Documentation for Oak Open Curriculum Ecosystem

**Last Updated**: 2026-04-19
**Status**: Active index

## Getting Started

- **Evaluating the project?** → [Strategic Overview](foundation/strategic-overview.md) — vision, roadmap, engineering approach, and handoff readiness in one reading path
- **Not a developer?** → [Curriculum Guide](domain/curriculum-guide.md) — Oak's curriculum structure in plain language
- **New to the repo?** → [Quick Start Guide](foundation/quick-start.md) — architecture, setup, key concepts, and development workflows
- **Working with AI?** → Start with the canonical [`start-right-quick` shared workflow](../.agent/skills/start-right-quick/shared/start-right.md) (or invoke it via your platform: `/jc-start-right-quick` in Cursor and Claude Code, `jc-start-right-quick` skill in Codex, `/jc-start-right-quick` in Gemini), then [AGENT.md](../.agent/directives/AGENT.md).
- **Need an optional map of the wider agentic corpus?** → [Agentic Engineering Hub](../.agent/reference/agentic-engineering/README.md) — index-only discovery hub linking canon, deep dives, research, evidence, reports, and docs surfaces
- **Architecture source of truth?** → [ADR index](architecture/architectural-decisions/) — Architectural Decision Records define how the system should work
- **Browsing by section?** → [Foundation](foundation/README.md) · [Governance](governance/README.md) · [Architecture](architecture/README.md) · [Engineering](engineering/README.md) · [Operations](operations/README.md) · [Domain](domain/README.md)

## Core Documentation

### Architecture

- [OpenAPI Pipeline](architecture/openapi-pipeline.md) - **THE** architecture doc: how types flow from schema
- [Architecture Decision Records](architecture/architectural-decisions/) — Architectural source of truth (the schema-first generation ADRs below underpin everything in this repo)
- [ADR-029](architecture/architectural-decisions/029-no-manual-api-data.md) — No manual API data structures
- [ADR-030](architecture/architectural-decisions/030-sdk-single-source-truth.md) — SDK as single source of truth
- [ADR-031](architecture/architectural-decisions/031-generation-time-extraction.md) — Generation-time extraction
- [ADR-048](architecture/architectural-decisions/048-shared-parse-schema-helper.md) — Shared parsing helper pattern
- [Provider System](architecture/provider-system.md) - Current app-local provider composition and DI boundaries

### Development

- [Quick Start Guide](foundation/quick-start.md) - Architecture, setup, and development workflows for new contributors
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

- [How the Agentic Engineering System Works](foundation/agentic-engineering-system.md) - The Practice explained as an integrated engineering system
- [ADR-119](architecture/architectural-decisions/119-agentic-engineering-practice.md) - The formal architectural decision
- [Continuity Practice](governance/continuity-practice.md) - Lightweight session handoff, conditional deep consolidation, and surprise capture
- [**The Practice**](../.agent/practice-core/index.md) - Orientation and entry point for the Practice (agent-facing)
- [Agentic Engineering Hub](../.agent/reference/agentic-engineering/README.md) - Index-only source-lanes and deep-dives map for broader corpus discovery

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
- [Search Plans](../.agent/plans/semantic-search/) - Roadmap, acceptance criteria, experiments

## Additional Resources

- [GO workflow](../.agent/skills/go/shared/go.md) - Grounding workflow for structured task execution (ACTION/REVIEW cadence)
- [SDK README](../packages/sdks/oak-curriculum-sdk/README.md) - SDK generation and exports
