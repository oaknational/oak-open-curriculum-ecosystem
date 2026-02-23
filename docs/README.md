# Documentation for Oak MCP Ecosystem

## Getting Started

- **New to the repo?** → [Developer Onboarding](development/onboarding.md) — canonical onboarding path (first-stop checklist covering setup, workspace walkthroughs, and key concepts)
- **Quick start?** → [Quick Start Guide](quick-start.md) — Zero-setup path to productive changes
- **Vision and strategy?** → [VISION.md](VISION.md) — why this repository exists, what it delivers, and how we measure impact
- **Working with AI?** → Start with [`start-right` command](../.cursor/commands/jc-start-right.md), [`start-right` prompt](../.agent/prompts/start-right.prompt.md), or [`start-right` skill](../.agent/skills/start-right/SKILL.md), then use [AI Agent Guide](agent-guidance/ai-agent-guide.md)
- **Architecture source of truth?** → [ADR index](architecture/architectural-decisions/) — 115+ Architectural Decision Records define how the system should work

## Core Documentation

### Architecture

- [OpenAPI Pipeline](architecture/openapi-pipeline.md) - **THE** architecture doc: how types flow from schema
- [Architecture Decision Records](architecture/architectural-decisions/) - Architectural source of truth
- [ADR-029](architecture/architectural-decisions/029-no-manual-api-data.md) - No manual API data structures
- [ADR-030](architecture/architectural-decisions/030-sdk-single-source-truth.md) - SDK as single source of truth
- [ADR-031](architecture/architectural-decisions/031-generation-time-extraction.md) - Generation-time extraction
- [ADR-048](architecture/architectural-decisions/048-shared-parse-schema-helper.md) - Shared parsing helper pattern
- [Provider System](architecture/provider-system.md) - Multi-provider MCP architecture

### Development

- [Developer Onboarding](development/onboarding.md) - First-stop checklist for new contributors
- [Development Workflow](development/workflow.md) - Complete lifecycle: branching, TDD, CI, review, merge, release
- [Environment Variables](development/environment-variables.md) - Complete setup guide
- [Extension Points](development/extending.md) - How to add new MCP tools, search indices, SDK helpers
- [Troubleshooting](development/troubleshooting.md) - Common issues and solutions
- [Tooling](development/tooling.md) - Development tools and versions

### Curriculum Data

- [Curriculum Guide](curriculum-guide.md) - **Start here** if you're new to Oak's curriculum: plain-language structure, KS4 complexity, user personas
- [Data Variances](data/DATA-VARIANCES.md) - **Essential**: Subject/key stage differences, transcript availability, structural patterns
- [Ontology Data](../packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts) - Domain model and structural patterns
- [Knowledge Graph](../packages/sdks/oak-curriculum-sdk/src/mcp/property-graph-data.ts) - Entity relationships

### Agentic Engineering Practice

- [Practice Explanation (for humans)](development/onboarding.md#12-the-agentic-engineering-practice) - What the AI sub-agents do, when they run, and what is expected of human developers
- [ADR-119](architecture/architectural-decisions/119-agentic-engineering-practice.md) - The formal architectural decision
- [practice.md](../.agent/directives/practice.md) - Full map of the practice system

## AI Agent Guidance

Comprehensive documentation for AI agents working with this codebase:

- [AI Agent Guide](agent-guidance/ai-agent-guide.md) - Primary guide for AI agents
- [Development Practice](agent-guidance/development-practice.md) - Code standards and workflow
- [TypeScript Practice](agent-guidance/typescript-practice.md) - Type safety guidelines
- [Testing Strategy](../.agent/directives/testing-strategy.md) - TDD approach at all levels
- [Safety and Security](agent-guidance/safety-and-security.md) - Security measures and privacy protection

## Search Application

For semantic search specific documentation:

- [Search App README](../apps/oak-search-cli/README.md) - Search application overview
- [Search Architecture](../apps/oak-search-cli/docs/ARCHITECTURE.md) - Search pipeline architecture
- [Ground Truth Protocol](../apps/oak-search-cli/docs/ground-truths/ground-truth-protocol.md) - Baselines and GT process
- [Search Plans](../.agent/plans/semantic-search/) - Roadmap, acceptance criteria, experiments

## Additional Resources

- [GO.md](../.agent/prompts/GO.md) - Grounding prompt for structured task execution (ACTION/REVIEW cadence)
- [SDK README](../packages/sdks/oak-curriculum-sdk/README.md) - SDK generation and exports
