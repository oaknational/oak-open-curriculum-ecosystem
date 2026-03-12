---
boundary: cross-boundary
doc_role: index
authority: docs-root-navigation
status: active
last_reviewed: 2026-02-25
---

# Documentation for Oak Open Curriculum Ecosystem

**Last Updated**: 2026-02-25  
**Status**: Active index

## Getting Started

- **New to this project? Not a developer?** → [VISION](foundation/VISION.md) for what this project delivers and why, then the [Curriculum Guide](domain/curriculum-guide.md) for a plain-language introduction to Oak's curriculum structure
- **New to the repo?** → [Quick Start Guide](foundation/quick-start.md) — architecture, setup, key concepts, and development workflows
- **Vision and strategy?** → [foundation/VISION.md](foundation/VISION.md) — why this repository exists, what it delivers, and how we measure impact
- **Working with AI?** → Start with [`start-right-quick` command](../.cursor/commands/jc-start-right-quick.md), shared workflow ([`start-right.md`](../.agent/skills/start-right-quick/shared/start-right.md)), or skill ([`start-right-quick/SKILL.md`](../.agent/skills/start-right-quick/SKILL.md)), then [AGENT.md](../.agent/directives/AGENT.md)
- **Architecture source of truth?** → [ADR index](architecture/architectural-decisions/) — Architectural Decision Records define how the system should work

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
- [The Practice](../.agent/practice-core/index.md) - Orientation and entry point for the practice system (agent-facing)

## Code Standards and Testing

- [Development Practice](governance/development-practice.md) - Code standards and workflow
- [TypeScript Practice](governance/typescript-practice.md) - Type safety guidelines
- [Testing Strategy](../.agent/directives/testing-strategy.md) - TDD approach at all levels
- [Safety and Security](governance/safety-and-security.md) - Security measures and privacy protection

## Search Application

For semantic search specific documentation:

- [Search App README](../apps/oak-search-cli/README.md) - Search application overview
- [Search Architecture](../apps/oak-search-cli/docs/ARCHITECTURE.md) - Search pipeline architecture
- [Ground Truth Protocol](../apps/oak-search-cli/docs/ground-truths/ground-truth-protocol.md) - Baselines and GT process
- [Search Plans](../.agent/plans/semantic-search/) - Roadmap, acceptance criteria, experiments

## Additional Resources

- [GO.md](../.agent/prompts/GO.md) - Grounding prompt for structured task execution (ACTION/REVIEW cadence)
- [SDK README](../packages/sdks/oak-curriculum-sdk/README.md) - SDK generation and exports
