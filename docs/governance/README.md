---
boundary: B1-Governance
doc_role: index
authority: governance-navigation
status: active
last_reviewed: 2026-02-25
---

# Governance Documentation

This repository contains more governance documentation than a typical codebase. That is intentional: this project is built through agentic engineering, where AI agents are primary contributors alongside human engineers. The repository is not just code — it is the project context. Rules, quality gates, testing strategy, and architectural decisions are explicit because they must be discoverable by any contributor, human or AI, without external instruction.

If this is your first time here, the 5-minute reading path is:

1. [Development Practice](./development-practice.md) — coding standards and workflow
2. [TypeScript Practice](./typescript-practice.md) — type safety approach
3. [Safety and Security](./safety-and-security.md) — security guidelines
4. [ADR index](../architecture/architectural-decisions/) — the architectural source of truth

## Contents

- [Development Practice](./development-practice.md) — Best practices for development in this project
- [Continuity Practice](./continuity-practice.md) — Lightweight session handoff, deep consolidation triggers, and surprise pipeline guidance
- [Safety and Security](./safety-and-security.md) — Critical safety guidelines and security considerations
- [Testing Strategy](../../.agent/directives/testing-strategy.md) — **MOVED**: Comprehensive TDD approach at all levels (now in directives)
- [TypeScript Practice](./typescript-practice.md) — TypeScript-specific guidelines and patterns
- [Understanding Agent References](./understanding-agent-references.md) — How to interpret and use agent-specific references
- [Curriculum Tools, Guidance and Playbooks](./curriculum-tools-guidance-and-playbooks.md) — Categories, tags, and domain playbooks
- [Accessibility Practice](./accessibility-practice.md) — WCAG 2.2 AA compliance, Playwright + axe-core, theme-aware testing
- [Design Token Practice](./design-token-practice.md) — DTCG JSON source format, three-tier model, CSS custom properties output
- [MCP App Styling](./mcp-app-styling.md) — CSS custom properties, SDK variable bridges, font loading, CSP declarations

## Key Principles

1. **Safety First** — Always prioritise security and data privacy
2. **Pure Functions** — Maximise pure, testable functions
3. **Clear Boundaries** — Respect architectural layers and interfaces
4. **Type Safety** — Use TypeScript's type system effectively
5. **Test Coverage** — Write comprehensive tests for all changes

## Starting Point

New AI agents should read [AGENT.md](../../.agent/directives/AGENT.md) first; it links to rules, testing strategy, and all directives. Human contributors should start with the [root README](../../README.md) and [quick-start guide](../foundation/quick-start.md).
