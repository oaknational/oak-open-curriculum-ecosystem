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
- `guidance.presentation.*` - In-repo authored presentation specs (no API calls)
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

## Implementation Approach

### Development Workflow

1. **TDD First**: Write tests before implementation
2. **Schema Definition**: Define OpenAPI schemas first
3. **Type Generation**: Run `pnpm type-gen` to generate types/validators
4. **Implementation**: Implement tools using generated types
5. **Quality Gates**: Regular quality gate validation

### Quality Gates (must pass after each phase)

- `pnpm i` - Dependencies
- `pnpm type-gen` - Type generation
- `pnpm build` - Build verification
- `pnpm type-check` - TypeScript validation
- `pnpm lint -- --fix` - Code style
- `pnpm -F @oaknational/oak-curriculum-sdk docs:ai` - Documentation
- `pnpm format:root` - Code formatting
- `pnpm test` - Unit and integration tests

## Key Stakeholders

- **Curriculum Data Tools**: Provide factual curriculum information
- **Guidance Tools**: Provide presentation and formatting instructions
- **Playbook System**: Orchestrate complex multi-step operations
- **Command Registry**: Enable discoverable command mapping

## Critical Success Factors

1. **Clean Separation**: Clear boundaries between data and guidance
2. **Type Safety**: All schemas generated from OpenAPI, no type assertions
3. **Deterministic Execution**: No server-side orchestration, caller controls execution
4. **Testability**: Pure functions with proper mocking, TDD approach
5. **Documentation**: Self-documenting code and clear guidance specifications

## Recovery Context

If this conversation is lost, resume from:

1. Check current git branch and status
2. Run quality gates to ensure codebase health
3. Review this context document and plan document
4. Continue with Phase 2 implementation (guidance specs, templates, and metadata strategy)
5. Follow TDD approach: write tests first, then implement
6. Use generated types from PresentationSpec and Playbook schemas

## Current Implementation Status

**Phase 2**: 🔄 IN PROGRESS - Author guidance specs and templates in-repo

**Next Action**: Task 11 - Author initial guidance fixtures for `lesson` and `searchResults` (JSON) plus markdown templates

**Architectural Foundation Ready**:

- ✅ OpenAPI schemas defined and type-generated
- ✅ PresentationGuidance@v1 and Playbook@v1 modules complete
- ✅ All quality gates passing
- ✅ Tool taxonomy established

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

**Phase 2**: 🔄 IN PROGRESS - Author guidance specs and templates in-repo

**Immediate Next Task**: Task 11 - Author initial guidance fixtures for `lesson` and `searchResults` (JSON) plus markdown templates

**Phase 2 Structure**:

- Task 11: Author guidance fixtures and markdown templates (in-repo, no network access)
- Task 12: Review provenance rules and accessibility checklist
- Task 13: Grounding check
- Task 14: Quality gate validation

**Key Architectural Foundations Established**:

1. ✅ **Clean Data/Guidance Separation**: Presentation guidance and playbook orchestration separated from curriculum data tools
2. ✅ **Type Safety**: All schemas generated from OpenAPI, no type assertions, comprehensive Zod validation
3. ✅ **Deterministic Execution**: No server-side agentic workflows, caller controls execution
4. ✅ **Template-Based Design**: Prompts and formatting referenced by templates, not embedded in code
5. ✅ **TDD Foundation**: Tests written first, proper mocking, no network calls in unit tests

**Ready for Phase 2 Implementation**:

- ✅ OpenAPI schemas defined and type-generated (PresentationSpec, Playbook)
- ✅ Generated types and validators available
- ✅ Quality gates passing (404 tests across 10 packages)
- 🔄 Ready to author guidance fixtures and templates in-repo
