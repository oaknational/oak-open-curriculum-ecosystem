# Documentation for Oak MCP Ecosystem

## 🚀 Getting Started

- **New to the repo?** → [Developer Onboarding](development/onboarding.md) – first-stop checklist covering setup, workspace walkthroughs, and key concepts
- **Quick start?** → [Quick Start Guide](quick-start.md) - Zero-setup path to productive changes
- **Working with AI?** → [AI Agent Guide](agent-guidance/ai-agent-guide.md) - Essential patterns and practices

## Core Documentation

### Architecture

- [OpenAPI Pipeline](architecture/openapi-pipeline.md) - **THE** architecture doc: how types flow from schema
- [Architecture Decision Records](architecture/architectural-decisions/) - All architectural decisions
- [Provider System](architecture/provider-system.md) - Multi-provider MCP architecture

### Development

- [Developer Onboarding](development/onboarding.md) - First-stop checklist for new contributors
- [Environment Variables](development/environment-variables.md) - Complete setup guide
- [Troubleshooting](development/troubleshooting.md) - Common issues and solutions
- [Tooling](development/tooling.md) - Development tools and versions

### Curriculum Data

- [Data Variances](data/DATA-VARIANCES.md) - **Essential**: Subject/key stage differences, transcript availability, structural patterns
- [Ontology Data](../packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts) - Domain model and structural patterns
- [Knowledge Graph](../packages/sdks/oak-curriculum-sdk/src/mcp/knowledge-graph-data.ts) - Entity relationships

### Usage

- [API Reference](usage/api-reference.md) - Resources, tools, and prompts reference

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

- [GO.md](../GO.md) - Grounding document for maintaining focus and quality
- [SDK README](../packages/sdks/oak-curriculum-sdk/README.md) - SDK generation and exports
