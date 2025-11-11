# Semantic Search Plans

Navigation hub for all semantic search planning documentation.

## Overview

The semantic search system provides powerful search capabilities across Oak's curriculum data, integrating with Elasticsearch for hybrid search (semantic + lexical), faceted navigation, and intelligent suggestions. This planning directory documents the architecture, implementation strategy, and ongoing work.

## Quick Links

- [High-Level Overview](./semantic-search-overview.md) - Current state, goals, dependencies, timeline
- [Search Service (Backend)](./search-service/index.md) - API routes, Elasticsearch, ingestion, schema-first migration
- [Search UI (Frontend)](./search-ui/index.md) - React components, theme, testing, user experience

## Key Documents

### Active Planning

- **semantic-search-overview.md** - High-level strategy, MCP integration, phase timeline
- **search-service/** - Backend implementation (API, Elasticsearch, ingestion)
- **search-ui/** - Frontend implementation (components, theme, UX)

### Reference Materials

- **search-schema-inventory.md** - Catalogue of runtime schemas to migrate
- **search-migration-map.md** - Migration sequence and dependencies
- **search-generator-spec.md** - SDK type-gen requirements

### Archive

- **archive/** - Completed plans, historical documents, superseded work

## Architecture Context

### Cardinal Rule Compliance

All static data structures, types, type guards, Zod schemas, and validators **MUST** flow from the Open Curriculum OpenAPI schema via type-gen. Running `pnpm type-gen` must be sufficient to align all workspaces with schema changes.

### Ontology Integration

The semantic search implementation is guided by the comprehensive curriculum ontology documented in `docs/architecture/curriculum-ontology.md`, which defines:

- **Core entities**: Programme, Unit, Lesson, Thread, Sequence, Subject
- **Relationships**: Hierarchical and cross-cutting connections
- **Enumerated fields**: Phase, KeyStage, Year, Tier, ExamBoard, ContentGuidance
- **Official Oak API alignment**: Definitions from official glossary and ontology diagrams

### MCP Integration (Future)

Post Phase 1, semantic search will integrate with MCP via:

- Type-gen time generation of search tool definitions
- Aggregated tools refactor (prerequisite)
- Configuration-driven endpoint composition
- Zero hand-written runtime logic

## Current Status

**Phase 1: Schema-First Migration and Ontology Integration**

- Status: Planning Complete → Implementation Starting
- Goal: Move all search schemas to type-gen, add ontology fields (threads, programme factors, unit types)
- Prerequisites: Cardinal rule architecture, ontology documentation (✅ COMPLETE)

## Dependencies

- Curriculum ontology: `docs/architecture/curriculum-ontology.md` (✅ COMPLETE)
- Schema-first execution: `.agent/directives-and-memory/schema-first-execution.md`
- Testing strategy: `docs/agent-guidance/testing-strategy.md`
- Cardinal rule: `.agent/directives-and-memory/rules.md`

## Navigation

For detailed implementation plans:

- Backend work → [search-service/index.md](./search-service/index.md)
- Frontend work → [search-ui/index.md](./search-ui/index.md)
- Historical context → [archive/](./archive/)
