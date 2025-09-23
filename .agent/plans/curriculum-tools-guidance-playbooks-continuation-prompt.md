# Curriculum Tools/Guidance Separation - Fresh Chat Continuation Prompt

## Project Overview

This is a **10-phase project** to implement clean separation between curriculum data-fetching tools and presentation guidance/instruction tools in the Oak National Academy MCP ecosystem. The goal is to provide deterministic, in-repo authored guidance specifications and playbooks that consuming agents execute without server-side agentic orchestration.

## Current Status

**Phase 2**: 🔄 READY TO START - Create additional schemas and update type-gen process

**Phase 1**: ✅ COMPLETED - OpenAPI schemas and type generation

- PresentationGuidance@v1 module implemented (PresentationSpec, LessonPresentationSpec, SearchResultsPresentationSpec)
- Playbook@v1 module implemented (deterministic execution, clarification loops, template-based prompts)
- All quality gates passed (404 tests across 10 packages)
- **Repo restored** to correct state (no server-specific guidance code)

**Phase 0**: ✅ COMPLETED - Project grounding and scope confirmation

## Immediate Next Task

**Task 11**: Create additional static schema files and update type-gen process to generate guidance tools at compile time.

## Key Architectural Principles

### Non-Negotiable Constraints

- ❌ **No server-side agentic workflows**: Playbooks executed by caller/agent
- ✅ **Deterministic execution**: All tools stateless data fetchers and guidance providers
- 🔒 **Type discipline**: All static structures flow from OpenAPI schema via `pnpm type-gen`
- 🧪 **Testing strategy**: Tests use proper mocking, avoid network calls, follow TDD
- 🔄 **Compile-time generation**: All tools and fixtures generated through established SDK pipeline

### Tool Taxonomy

- `data.simple.*` - Direct OpenAPI endpoint facades (single API call)
- `data.complex.*` - Multiple API calls to join/aggregate data
- `guidance.presentation.*` - Compile-time generated presentation specs (no API calls)
- `guidance.ontology.*` - Schema-derived metadata (no API calls)
- `playbooks.*` - Playbook retrieval and execution
- `commands.*` - Command registry mapping

## Recovery Instructions

If starting fresh:

1. **Check codebase health**:

   ```bash
   git status  # Ensure no server-specific guidance code
   pnpm i
   pnpm type-gen  # Must process additional schemas
   pnpm build     # Must include new generated tools
   pnpm type-check
   pnpm lint -- --fix
   pnpm format:root
   pnpm test
   ```

2. **Review key documents**:
   - 📋 **Plan**: `.agent/plans/curriculum-tools-guidance-playbooks-plan.md`
   - 📊 **Context**: `.agent/plans/curriculum-tools-guidance-playbooks-context.md`
   - 🏛️ **Architecture**: `docs/architecture/curriculum-ontology.md`
   - 📖 **Agent Guide**: `.agent/directives-and-memory/AGENT.md`
   - ⚖️ **Rules**: `.agent/directives-and-memory/rules.md`

3. **Understand Phase 2**: Create additional schemas and update compile-time generation
   - Create additional static schema files (separate from main API schema)
   - Update type-gen process to ingest additional schemas
   - Verify compile-time generation produces all required tools and fixtures
   - Ensure runtime SDK includes new generated tools alongside existing ones

## Available Resources

### Generated Types & Validators

- `PresentationSpec` - Core presentation specification with required fields
- `LessonPresentationSpec` - Lesson-specific presentation rules
- `SearchResultsPresentationSpec` - Search results presentation rules
- `Playbook` - Multi-step process definition
- `PlaybookStep` - Union type for ask/toolCall/aggregate/format steps
- `TemplateRef` - Template reference system

### Quality Gates (run after each phase)

```bash
pnpm i                    # Dependencies
pnpm type-gen             # Type generation (must process additional schemas)
pnpm build                # Build verification (must include new generated tools)
pnpm type-check           # TypeScript validation
pnpm lint -- --fix        # Code style
pnpm -F @oaknational/oak-curriculum-sdk docs:ai  # Documentation
pnpm format:root          # Code formatting
pnpm test                 # Unit and integration tests
```

## Development Approach - CORRECTED

### TDD-First Workflow (Following SDK Pipeline)

1. **Write tests first** using generated types
2. **Schema Definition**: Create additional static schema files (not modify cached schema)
3. **Type Generation**: Update `type-gen` process to ingest additional schemas and generate ALL data structures at compile time
4. **SDK Integration**: Runtime SDK includes all generated tools (existing + new) from compile-time generation
5. **Quality Gates**: Regular quality gate validation

### Key Implementation Patterns - CORRECTED

- **Additional schemas**: Create `additional-schemas/presentation-guidance.json` and `additional-schemas/playbooks.json`
- **Type-gen integration**: Update process to merge additional schemas with main API schema
- **Compile-time generation**: All guidance specs, templates, and tools generated at compile time
- **Runtime SDK**: Includes both existing and new generated components
- **No server code**: MCP servers import runtime SDK exactly as before

## Next Steps for Phase 2

1. **Create additional schemas**:
   - Create `additional-schemas/presentation-guidance.json`
   - Create `additional-schemas/playbooks.json`
   - Define tool schemas for guidance and playbook tools

2. **Update type-gen process**:
   - Modify type-gen to ingest additional schemas
   - Generate MCP tools from additional schemas alongside existing ones
   - Ensure compile-time generation produces guidance fixtures and templates

3. **Verify SDK integration**:
   - Confirm runtime SDK includes new generated tools
   - Test that MCP servers can import and use new tools without modification
   - Validate that guidance fixtures are generated at compile time

4. **Quality gate validation**:
   - Ensure type-gen processes additional schemas
   - Verify build includes new generated tools
   - Confirm all tests pass with new generated components

## Questions to Ask Yourself

- **Am I following TDD?** Write tests before implementation
- **Am I creating additional schemas?** Not modifying cached schema
- **Is type-gen updated?** Does it process additional schemas and generate tools?
- **Are tools compile-time generated?** No server-specific implementation
- **Does runtime SDK include everything?** Both existing and new generated components
- **Have I run quality gates?** All must pass before proceeding, especially type-gen and build

## Reference Documentation

- **Plan Document**: Complete 10-phase plan with acceptance criteria
- **Context Document**: Living status and recovery information
- **Architecture Document**: Curriculum ontology and entity relationships
- **Agent Guide**: Development practices and constraints
- **Rules Document**: Cardinal rule and type safety requirements
- **Testing Strategy**: Mocking and test isolation guidelines

---

**Ready to continue Phase 2?** Start by reviewing the plan document for Task 11 details, then create additional schema files and update the type-gen process to generate guidance tools at compile time.
