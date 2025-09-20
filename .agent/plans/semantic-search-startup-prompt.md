# Semantic Search API - New Chat Startup Prompt

## Context & Mission

You are working on the **Oak Open Curriculum Semantic Search API** project. This is a hybrid lexical + semantic search service for Oak educational content using Elasticsearch Serverless and Next.js API routes on Vercel.

**Current Status**: Implementation Phase - Cloud Data Population  
**Next Major Milestone**: Implement chunked indexing endpoints for Vercel deployment

## Essential Reading (MANDATORY - Read in Order)

### 1. Repository Rules & Standards

- **`.agent/directives-and-memory/rules.md`** - Core development rules, TDD requirements, type safety, quality gates
- **`docs/agent-guidance/testing-strategy.md`** - Testing philosophy, TDD approach, test types and definitions

### 2. Project Plans

- **`.agent/plans/semantic-search-api-plan.md`** - Main implementation plan with phases and deliverables
- **`.agent/plans/semantic-search-api-context.md`** - Comprehensive living context document

### 3. Development Workflow

- **`GO.md`** - Development process and todo list management (replace sub-agent reviews with self-reviews)

## Current Project State

### ✅ Completed

- Core search implementation with BM25 + semantic fusion
- All API endpoints implemented (`/api/search`, `/api/search/nl`, etc.)
- Elasticsearch setup and mapping scripts
- SDK integration with Oak Curriculum API
- OpenAPI generation and MCP integration
- Quality gates passing (lint, type-check, test, build)

### 🚧 Current Phase: Cloud Data Population

**Problem**: The existing `/api/index-oak` endpoint tries to fetch all Oak content (~10,000+ lessons) in a single request, which exceeds Vercel's 300s execution limit and would thrash local bandwidth.

**Solution**: Implement chunked indexing system with:

- `POST /api/index-oak-chunked` - Process data in manageable chunks
- `POST /api/index-oak-bulk` - Orchestrate full population across chunks
- `GET /api/index-oak-status` - Monitor progress and completion

## Immediate Next Steps

1. **Familiarize yourself** with the rules and testing strategy
2. **Read both plan documents** to understand the full scope
3. **Formulate a detailed action plan** for implementing chunked indexing
4. **Follow GO.md process** to create a structured todo list
5. **Begin implementation** using TDD approach

## Key Technical Context

### Architecture

- **Backend**: Next.js API routes on Vercel (Node.js runtime)
- **Search Engine**: Elasticsearch Serverless with 3 indices (`oak_lessons`, `oak_units`, `oak_unit_rollup`)
- **Data Source**: Oak Curriculum API via official SDK
- **Search Method**: BM25 + semantic search fused with RRF

### Environment Variables

```env
ELASTICSEARCH_URL=https://your-elasticsearch-url-here
ELASTICSEARCH_API_KEY=your_elasticsearch_api_key_here
OAK_API_KEY=your_oak_api_key_here
SEARCH_API_KEY=your_search_api_key_here
AI_PROVIDER=openai                    # Optional LLM support
OPENAI_API_KEY=your_openai_api_key_here
```

### Key Files

```text
apps/oak-open-curriculum-semantic-search/
├── app/api/
│   ├── search/route.ts              # Structured search
│   ├── search/nl/route.ts           # Natural language search
│   ├── index-oak/route.ts           # Legacy single-shot indexing
│   └── rebuild-rollup/route.ts      # Rollup index rebuild
├── src/lib/
│   ├── hybrid-search/               # Core search logic
│   ├── index-oak.ts                 # Indexing orchestration
│   └── elastic-http.ts              # ES client wrapper
```

## Development Rules (CRITICAL)

### TDD Requirements

- **ALWAYS write tests FIRST** (Red → Green → Refactor)
- **Unit tests** for pure functions (no I/O, no side effects, no mocks)
- **Integration tests** for code units working together (simple mocks injected as arguments)
- **E2E tests** for running systems (separate processes, real I/O)

### Code Quality

- **Never disable checks** - fix root causes, never work around issues
- **No type shortcuts** - avoid `as`, `any`, `!`, `Record<string, unknown>`
- **Preserve type information** - use literal types, not broad `string`/`number`
- **Pure functions first** - single responsibility, no side effects
- **Fail fast** - helpful error messages, no silent failures

### Quality Gates (Run After Changes)

```bash
pnpm format
pnpm type-check
pnpm lint -- --fix
pnpm test
pnpm build
```

## Current Challenge: Vercel Execution Limits

**Problem**: Vercel Pro has 300s max duration per function. Fetching all Oak content (10,000+ lessons with full transcripts) exceeds this limit.

**Approach**:

1. **Chunked processing** - Process data in small batches (e.g., 50 lessons per chunk)
2. **Recursive orchestration** - Use `/api/index-oak-bulk` to coordinate chunked calls
3. **Progress tracking** - Monitor completion status and handle failures
4. **Idempotent operations** - Safe to retry failed chunks

## Success Criteria

- [ ] Chunked indexing endpoints implemented and tested
- [ ] Cloud-based data population completes successfully
- [ ] Progress monitoring provides accurate status
- [ ] All quality gates pass
- [ ] Search functionality verified with populated data
- [ ] Documentation updated

## Getting Started

1. **Read the mandatory documents** listed above
2. **Run quality gates** to verify current state: `pnpm qg`
3. **Examine the existing code** in `apps/oak-open-curriculum-semantic-search/`
4. **Create a detailed todo list** following GO.md process
5. **Start with TDD** - write tests for chunked indexing endpoints first

## Important Notes

- **This is a cloud-first approach** - data population happens in Vercel, not locally
- **Bandwidth considerations** - avoid fetching large datasets locally
- **Resilient design** - handle failures gracefully with retry mechanisms
- **Progress visibility** - provide real-time status updates for long operations

## Questions to Consider

- How can we break down the indexing process into optimal chunk sizes?
- What progress tracking mechanism will provide the best user experience?
- How can we ensure failed chunks can be retried without data corruption?
- What error handling and logging will help with debugging cloud issues?

---

**Remember**: Follow TDD religiously, maintain type safety, and always run quality gates. The goal is to create a robust, cloud-based data population system that works within Vercel's constraints while providing excellent developer and user experience.
