# Curriculum Tools/Guidance Separation - Fresh Chat Continuation Prompt

## Project Overview

This is a **10-phase project** to implement clean separation between curriculum data-fetching tools and presentation guidance/instruction tools in the Oak National Academy MCP ecosystem. The goal is to provide deterministic, in-repo authored guidance specifications and playbooks that consuming agents execute without server-side agentic orchestration.

## Current Status

**Phase 2**: 🔄 IN PROGRESS - Author guidance specs and templates in-repo

**Phase 1**: ✅ COMPLETED - OpenAPI schemas and type generation

- PresentationGuidance@v1 module implemented (PresentationSpec, LessonPresentationSpec, SearchResultsPresentationSpec)
- Playbook@v1 module implemented (deterministic execution, clarification loops, template-based prompts)
- All quality gates passed (404 tests across 10 packages)

**Phase 0**: ✅ COMPLETED - Project grounding and scope confirmation

## Immediate Next Task

**Task 11**: Author initial guidance fixtures for `lesson` and `searchResults` (JSON) plus markdown templates; store under a dedicated package or within app resources as appropriate, ensuring they are loaded without network access.

## Key Architectural Principles

### Non-Negotiable Constraints

- ❌ **No server-side agentic workflows**: Playbooks executed by caller/agent
- ✅ **Deterministic execution**: All tools stateless data fetchers and guidance providers
- 🔒 **Type discipline**: All static structures flow from OpenAPI schema via `pnpm type-gen`
- 🧪 **Testing strategy**: Tests use proper mocking, avoid network calls, follow TDD

### Tool Taxonomy

- `data.simple.*` - Direct OpenAPI endpoint facades (single API call)
- `data.complex.*` - Multiple API calls to join/aggregate data
- `guidance.presentation.*` - In-repo authored presentation specs (no API calls)
- `guidance.ontology.*` - Schema-derived metadata (no API calls)
- `playbooks.*` - Playbook retrieval and execution
- `commands.*` - Command registry mapping

## Recovery Instructions

If starting fresh:

1. **Check codebase health**:

   ```bash
   git status
   pnpm i
   pnpm type-gen
   pnpm build
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

3. **Understand Phase 2**: Author guidance fixtures and templates in-repo
   - Create JSON fixtures for `lesson` and `searchResults` presentation specs
   - Create markdown templates for formatting
   - Store in dedicated package/app resources (no network access)
   - Ensure provenance rules and accessibility compliance

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
pnpm type-gen             # Type generation
pnpm build                # Build verification
pnpm type-check           # TypeScript validation
pnpm lint -- --fix        # Code style
pnpm -F @oaknational/oak-curriculum-sdk docs:ai  # Documentation
pnpm format:root          # Code formatting
pnpm test                 # Unit and integration tests
```

## Development Approach

### TDD-First Workflow

1. **Write tests first** using generated types
2. **Define schemas** in OpenAPI specification
3. **Run type-gen** to generate types/validators
4. **Implement** using generated types
5. **Validate** with quality gates

### Key Implementation Patterns

- **In-repo fixtures**: All guidance specs stored locally, no external API calls
- **Template separation**: Prompts referenced by ID, not embedded in code
- **Runtime validation**: Generated Zod validators for all schemas
- **Provenance tracking**: Mandatory source attribution in presentation specs
- **Accessibility compliance**: Built-in accessibility checklist in schemas

## Next Steps for Phase 2

1. **Author guidance fixtures**:
   - Create `lesson-presentation-spec-v1.json`
   - Create `search-results-presentation-spec-v1.json`
   - Include required headings, notices, provenance policy, accessibility checklist

2. **Create markdown templates**:
   - Lesson formatting template
   - Search results formatting template
   - Ensure templates reference PresentationSpec structure

3. **Store appropriately**:
   - Consider dedicated package for guidance resources
   - Or store within app resources directory
   - Ensure no network access required

4. **Review and validate**:
   - Check provenance rules require Oak resource links
   - Verify accessibility checklist items are actionable
   - Run full quality gate sequence

## Questions to Ask Yourself

- **Am I following TDD?** Write tests before implementation
- **Am I using generated types?** No type assertions, use `pnpm type-gen` output
- **Is it deterministic?** No server-side orchestration, caller controls execution
- **Are fixtures in-repo?** No external API calls, all data local
- **Does it preserve types?** Use `as const` data, no type assertions in code
- **Have I run quality gates?** All must pass before proceeding

## Reference Documentation

- **Plan Document**: Complete 10-phase plan with acceptance criteria
- **Context Document**: Living status and recovery information
- **Architecture Document**: Curriculum ontology and entity relationships
- **Agent Guide**: Development practices and constraints
- **Rules Document**: Cardinal rule and type safety requirements
- **Testing Strategy**: Mocking and test isolation guidelines

---

**Ready to continue Phase 2?** Start by reviewing the plan document for Task 11 details, then create the guidance fixtures and templates using the generated types from Phase 1.
