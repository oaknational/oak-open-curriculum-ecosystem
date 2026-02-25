---
boundary: B1-Governance
doc_role: index
authority: governance-navigation
status: active
last_reviewed: 2026-02-25
---

# Governance Documentation

This directory contains documentation for AI agents and human developers working with the Oak MCP ecosystem. The canonical agent entry point is [AGENT.md](../../.agent/directives/AGENT.md); these documents provide supplementary guidance.

## Contents

- [Development Practice](./development-practice.md) - Best practices for development in this project
- [Safety and Security](./safety-and-security.md) - Critical safety guidelines and security considerations
- [Testing Strategy](../../.agent/directives/testing-strategy.md) - **MOVED**: Comprehensive TDD approach at all levels (now in directives)
- [TypeScript Practice](./typescript-practice.md) - TypeScript-specific guidelines and patterns
- [Understanding Agent References](./understanding-agent-references.md) - How to interpret and use agent-specific references

## Purpose

These documents help AI agents and developers:

- Understand the project's architectural principles
- Follow established coding standards
- Maintain code quality and safety
- Make informed decisions about implementation approaches
- Navigate the codebase effectively

## Key Principles

1. **Safety First** - Always prioritise security and data privacy
2. **Pure Functions** - Maximise pure, testable functions
3. **Clear Boundaries** - Respect architectural layers and interfaces
4. **Type Safety** - Use TypeScript's type system effectively
5. **Test Coverage** - Write comprehensive tests for all changes

## Starting Point

New AI agents should read [AGENT.md](../../.agent/directives/AGENT.md) first; it links to rules, testing strategy, and all directives.
