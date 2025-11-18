# Curriculum Tools, Guidance and Playbooks - Living Context

## Overview

This document tracks the living context for implementing the curriculum tools/guidance separation plan. It enables efficient recovery of context and ease of picking up work in fresh conversations.

## Current Status

**Phase 0 (Project grounding and scope confirmation)** ✅ COMPLETED

- All quality gates passed
- Understanding confirmed: no server-side agentic workflows, caller runs playbooks, all types via type-gen, tests avoid network
- Foundation established for clean separation between data tools and guidance tools

**Phase 1 (SDK: OpenAPI schemas and type generation)** ✅ COMPLETED

- ✅ PresentationGuidance@v1 module fully implemented with PresentationSpec, LessonPresentationSpec, and SearchResultsPresentationSpec
- ✅ Playbook@v1 module implemented with deterministic execution, clarification loops, and template-based prompts
- ✅ All schemas reviewed for minimal expressiveness and type safety
- ✅ Full quality gate sequence passed (build, type-check, lint, format, markdownlint, tests)

## Key Principles Confirmed

### Architectural Constraints

- **No server-side agentic workflows**: Playbooks executed by caller/agent
- **Deterministic execution**: All tools stateless data fetchers and guidance providers
- **Type discipline**: All static structures flow from OpenAPI schema via `pnpm type-gen`
- **Testing strategy**: Tests use proper mocking, avoid network calls, follow TDD

### Tool Taxonomy

- `data.simple.*` - Direct OpenAPI endpoint facades (single API call)
- `data.complex.*` - Multiple API calls to join/aggregate data
- `guidance.presentation.*` - Compile-time generated presentation specs (no API calls)
- `guidance.ontology.*` - Schema-derived metadata (no API calls)
- `playbooks.*` - Playbook retrieval and execution
- `commands.*` - Command registry mapping

## Phase 1: SDK Schema Design

### PresentationGuidance@v1 Module

**Status**: ✅ COMPLETED

**Components**:

- `PresentationSpec` - Core presentation specification
- `LessonPresentationSpec` - Lesson-specific presentation rules
- `SearchResultsPresentationSpec` - Search results presentation rules

**Key Fields**:

- `requiredHeadings` - Mandatory documentation sections
- `requiredNotices` - Required legal/attribution notices
- `templates` - Reusable presentation templates
- `linkPolicy` - External linking rules
- `provenancePolicy` - Source attribution requirements
- `accessibilityChecklist` - Accessibility compliance items

### Design Constraints

- **Minimal yet expressive**: Schema should be concise but cover all presentation needs
- **Type preservation**: Use `as const` data in fixtures, no type assertions in code
- **Runtime validation**: Generated Zod validators for all schemas
- **Version management**: Clear versioning strategy (`v1` initially)

## Implementation Approach - CORRECTED

### Development Workflow (Following Established SDK Pipeline)

1. **TDD First**: Write tests before implementation
2. **Schema Definition**: Define additional static schema files (not modify cached schema)
3. **Type Generation**: Update `type-gen` process to ingest additional schemas and generate ALL data structures, types, validators, and tools at compile time
4. **SDK Integration**: Runtime SDK includes all generated tools (existing + new) from compile-time generation
5. **Quality Gates**: Regular quality gate validation

### Critical Correction: Compile-Time Generation Required

**WRONG Approach (Previously Attempted)**:

- ❌ Modify cached API schema directly
- ❌ Put guidance fixtures in server directories
- ❌ Create server-side loaders
- ❌ Break the type-gen → compile-time scripts → runtime SDK chain

**CORRECT Approach**:

- ✅ Create additional static schema files (`additional-schemas/presentation-guidance.json`, `additional-schemas/playbooks.json`)
- ✅ Update type-gen process to merge additional schemas with main API schema
- ✅ All guidance fixtures, templates, and tools generated at compile time through SDK pipeline
- ✅ Runtime SDK includes both existing and new generated components
- ✅ MCP servers import runtime SDK exactly as before (no server-specific guidance code)

### Quality Gates (must pass after each phase)

- `pnpm i` - Dependencies
- `pnpm type-gen` - Type generation (must process additional schemas)
- `pnpm build` - Build verification (must include new generated tools)
- `pnpm type-check` - TypeScript validation
- `pnpm lint -- --fix` - Code style
- `pnpm -F @oaknational/oak-curriculum-sdk docs:ai` - Documentation
- `pnpm format:root` - Code formatting
- `pnpm test` - Unit and integration tests

## Key Stakeholders

- **Curriculum Data Tools**: Provide factual curriculum information (existing, generated at compile time)
- **Guidance Tools**: Provide presentation and formatting instructions (new, generated at compile time)
- **Playbook System**: Orchestrate complex multi-step operations (new, generated at compile time)
- **Command Registry**: Enable discoverable command mapping (generated at compile time)

## Critical Success Factors

1. **Clean Separation**: Clear boundaries between data and guidance
2. **Type Safety**: All schemas generated from OpenAPI, no type assertions
3. **Deterministic Execution**: No server-side orchestration, caller controls execution
4. **Testability**: Pure functions with proper mocking, TDD approach
5. **Documentation**: Self-documenting code and clear guidance specifications
6. **Compile-Time Generation**: All tools and fixtures generated through established SDK pipeline

## Recovery Context

If this conversation is lost, resume from:

1. Check current git branch and status (ensure no server-specific guidance code)
2. Run quality gates to ensure codebase health
3. Review this context document and plan document
4. Continue with Phase 2 implementation (additional schemas and compile-time generation)
5. Follow TDD approach: write tests first, then implement
6. Use generated types from PresentationSpec and Playbook schemas
7. Verify all tools are generated at compile time, not implemented in servers

## Current Implementation Status

**Phase 2**: 🔄 READY TO START - Create additional schemas and update type-gen process

**Correct Next Steps**:

1. ✅ **Phase 1 schemas defined** (PresentationSpec, Playbook)
2. ✅ **Repo restored** to correct state (no server-specific guidance code)
3. 🔄 **Phase 2**: Create additional static schema files and update type-gen process
4. 🔄 **Phase 3**: Verify compile-time generation produces all required tools and fixtures
5. 🔄 **Phase 4**: Ensure MCP servers can import and use new generated tools

**Architectural Foundation Ready**:

- ✅ OpenAPI schemas defined (PresentationSpec, Playbook)
- ✅ Repo restored to correct state
- ✅ Tool taxonomy established
- ✅ Understanding of correct compile-time generation approach

## Recent Changes

### Phase 0 Completion

- ✅ Quality gates all passed (404 tests across 10 packages)
- ✅ Enhanced curriculum ontology diagram with functional groupings
- ✅ Confirmed all architectural constraints and principles
- ✅ Established foundation for clean data/guidance separation

### Phase 1 Completion ✅

- ✅ **PresentationGuidance@v1 Module**: Added comprehensive schema for presentation specifications
  - `PresentationSpec`: Core specification with required headings, notices, templates, link policy, provenance policy, and accessibility checklist
  - `LessonPresentationSpec`: Specialized requirements for lesson content presentation
  - `SearchResultsPresentationSpec`: Specialized requirements for search result presentation
- ✅ **Playbook@v1 Module**: Added deterministic execution framework
  - `Playbook`: Multi-step process definition with inputs, questions, and outputs
  - `PlaybookStep`: Union type supporting ask, toolCall, aggregate, and format steps
  - `TemplateRef`: Clean separation of templates from playbook logic
  - Support for clarification loops and conditional execution
- ✅ **Schema Design Principles**: All schemas are minimal yet expressive, preserve type information, and follow type safety rules
- ✅ **Quality Gates**: Full sequence passed (build, type-check, lint, format, markdownlint, tests)

## Next Steps

**Phase 2**: 🔄 READY TO START - Create additional schemas and update type-gen process

**Correct Phase 2 Structure**:

- **Task 11**: Create additional static schema files (`additional-schemas/presentation-guidance.json`, `additional-schemas/playbooks.json`)
- **Task 12**: Update type-gen process to ingest additional schemas and generate tools from them
- **Task 13**: Verify compile-time generation produces guidance fixtures and templates
- **Task 14**: Confirm runtime SDK includes new generated tools alongside existing ones
- **Task 15**: Grounding check and quality gate validation

**Key Architectural Foundations Established**:

1. ✅ **Clean Data/Guidance Separation**: Presentation guidance and playbook orchestration separated from curriculum data tools
2. ✅ **Type Safety**: All schemas generated from OpenAPI, no type assertions, comprehensive Zod validation
3. ✅ **Deterministic Execution**: No server-side agentic workflows, caller controls execution
4. ✅ **Template-Based Design**: Prompts and formatting referenced by templates, not embedded in code
5. ✅ **TDD Foundation**: Tests written first, proper mocking, no network calls in unit tests
6. ✅ **Correct Understanding**: All tools and fixtures must be generated at compile time through SDK pipeline

**Ready for Phase 2 Implementation**:

- ✅ OpenAPI schemas defined (PresentationSpec, Playbook)
- ✅ Repo restored to correct state (no server-specific guidance code)
- ✅ Understanding of correct compile-time generation approach
- 🔄 Ready to implement additional schemas and update type-gen process
