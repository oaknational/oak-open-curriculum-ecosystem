# Agent Guidance Documentation

This directory contains documentation for AI agents and human developers working with the Oak MCP ecosystem. The canonical agent entry point is [AGENT.md](../../.agent/directives/AGENT.md); these documents provide supplementary guidance.

## Contents

- [AI Agent Guide](./ai-agent-guide.md) - Lighter companion to AGENT.md: task management, workflow patterns, success checklist
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

New AI agents should read [AGENT.md](../../.agent/directives/AGENT.md) first, then consult the [AI Agent Guide](./ai-agent-guide.md) for workflow patterns.
