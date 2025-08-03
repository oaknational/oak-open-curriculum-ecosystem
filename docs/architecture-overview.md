# Architecture Overview

This document provides a high-level overview of the Oak Notion MCP Server architecture. For detailed architectural documentation, see the [High Level Architecture](./architecture/high-level-architecture.md) document.

## System Purpose

The Oak Notion MCP Server provides read-only access to Notion workspaces through the Model Context Protocol (MCP), enabling AI assistants to query and analyze Notion content safely and efficiently.

## Core Architecture

The system follows a clean, layered architecture with two main components:

### 1. Oak MCP Core Framework (~3,050 LoC)

A generic, reusable MCP implementation framework that provides:

- Protocol handling and request/response management
- Error classification and handling
- Logging abstractions
- Runtime abstractions for cross-platform support
- Type definitions for the MCP protocol

### 2. Oak Notion MCP Implementation (<1,000 LoC)

The Notion-specific implementation built on top of the framework:

- Notion API integration through clean adapters
- Resource definitions for Notion content
- Tools for searching and querying Notion
- Business logic for data transformation

## Key Architectural Principles

1. **Pure Functions First** - Maximum business logic as side-effect-free functions
2. **Dependency Inversion** - All I/O operations are injected
3. **Clear Boundaries** - Well-defined interfaces between layers
4. **Type Safety** - Strict TypeScript with Zod validation at boundaries
5. **Privacy by Design** - Automatic PII scrubbing for sensitive data

## Architectural Patterns

### Current: Layered Architecture

```
MCP Client → Protocol Layer → Business Logic → Notion Adapter → External APIs
```

### Future Vision: Cellular Architecture

Inspired by biological systems, evolving toward:

- **Cells**: Self-contained modules with clear interfaces
- **Tissues**: Groups of similar cells working together
- **Organs**: Complete functional systems
- **Organism**: The complete application

### Long-term: Ecosystem Architecture

When scaling to multiple MCP servers:

- Each server as an independent organism
- Shared environment (build tools, types, events)
- Indirect communication through the environment
- oak-mcp-core as a keystone species

## Quick Links

- [High Level Architecture](./architecture/high-level-architecture.md) - Detailed architecture documentation
- [Architecture Decision Records](./architecture/architectural-decisions/) - All architectural decisions
- [API Reference](./usage/api-reference.md) - Technical API documentation
- [Onboarding Journey](./development/onboarding-journey.md) - Getting started guide

## Architecture Decision Records

Key architectural decisions are documented as ADRs:

### Core Decisions

- [ADR-001: ESM-Only Package](./architecture/architectural-decisions/001-esm-only-package.md)
- [ADR-002: Pure Functions First](./architecture/architectural-decisions/002-pure-functions-first.md)
- [ADR-006: Cellular Architecture Pattern](./architecture/architectural-decisions/006-cellular-architecture-pattern.md)
- [ADR-009: Mathematical Foundation](./architecture/architectural-decisions/009-mathematical-foundation-for-architecture.md)

### Implementation Decisions

- [ADR-003: Zod for Validation](./architecture/architectural-decisions/003-zod-for-validation.md)
- [ADR-004: Abstract Notion SDK](./architecture/architectural-decisions/004-no-direct-notion-sdk-usage.md)
- [ADR-005: Automatic PII Scrubbing](./architecture/architectural-decisions/005-automatic-pii-scrubbing.md)

[View all ADRs →](./architecture/architectural-decisions/)

## For AI Agents

If you're an AI agent working with this codebase, start with the [AI Agent Guide](./agent-guidance/ai-agent-guide.md) for specific guidance on navigating and modifying the codebase effectively.
