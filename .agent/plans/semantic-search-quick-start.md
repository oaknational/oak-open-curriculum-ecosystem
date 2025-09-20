# Quick Start Prompt for New Chat

Copy and paste this into a new chat to begin work on the Oak Open Curriculum Semantic Search API:

---

## Mission

Implement chunked indexing endpoints for the Oak Open Curriculum Semantic Search API to enable cloud-based data population within Vercel's execution limits.

## MANDATORY Reading (in order):

1. `.agent/directives-and-memory/rules.md` - Core development rules, TDD requirements
2. `docs/agent-guidance/testing-strategy.md` - Testing philosophy and TDD approach
3. `.agent/plans/semantic-search-api-plan.md` - Main implementation plan
4. `.agent/plans/semantic-search-api-context.md` - Comprehensive project context
5. `GO.md` - Development process (replace sub-agent reviews with self-reviews)

## Current State

- ✅ Core search implementation complete
- ✅ All API endpoints implemented
- ✅ Quality gates passing
- 🚧 **NEXT**: Implement chunked indexing for cloud data population

## Key Challenge

Vercel has 300s execution limit. Current `/api/index-oak` tries to fetch 10,000+ lessons at once, which exceeds this limit and would thrash local bandwidth.

## Solution Required

Implement these new endpoints:

- `POST /api/index-oak-chunked` - Process data in small chunks
- `POST /api/index-oak-bulk` - Orchestrate full population
- `GET /api/index-oak-status` - Monitor progress

## Development Rules

- **TDD**: Write tests FIRST (Red → Green → Refactor)
- **Pure functions**: Single responsibility, no side effects
- **Type safety**: No `as`, `any`, `!`, or `Record<string, unknown>`
- **Quality gates**: Run `pnpm qg` after changes

## First Steps

1. Read all mandatory documents above
2. Run `pnpm qg` to verify current state
3. Follow GO.md to create structured todo list
4. Start with TDD for chunked indexing endpoints

**Project Location**: `apps/oak-open-curriculum-semantic-search/`
**Current Phase**: Cloud Data Population Implementation

---
