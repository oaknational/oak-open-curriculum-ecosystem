# Continuation Prompt: Oak MCP Ecosystem

**Use this prompt in a fresh chat session to resume work efficiently.**

---

## Context Loading Prompt

```text
I'm working on the Oak MCP Ecosystem repository. This is a monorepo implementing
Model Context Protocol (MCP) servers that expose Oak's open curriculum data to
AI assistants.

Please read these foundational documents first:

1. @.agent/context/context.md - Current state summary
2. @.agent/directives-and-memory/rules.md - All repository rules (MUST follow)
3. @.agent/directives-and-memory/schema-first-execution.md - Schema-first mandate
4. @docs/agent-guidance/testing-strategy.md - TDD and testing definitions
5. @.agent/plans/high-level-plan.md - Strategic priorities

After reading these, please:
1. Summarize the current state in 3-4 sentences
2. List the top 3 priorities
3. Ask me which priority I want to focus on, OR if I have a different task

Remember:
- ALWAYS follow TDD (Red → Green → Refactor)
- ALL types flow from OpenAPI schema via `pnpm type-gen` (Cardinal Rule)
- NEVER use type shortcuts (`as`, `any`, `!`, `Record<string, unknown>`)
- Favor detail and specificity over brevity (slow and steady wins)
```

---

## Quick Start for Specific Priorities

### If Resuming OAuth Implementation

```text
I want to begin implementing the Clerk OAuth 2.1 integration plan.

Please read:
1. @.agent/plans/mcp-oauth-implementation-plan.md - Comprehensive implementation plan
2. @.agent/reference-docs/clerk-build-mcp-server.md - Clerk MCP guide

Current status:
- Plan is complete, validated, and production-ready
- Branch `feat/oauth_support` exists with updated plan
- Ready to begin Phase 0: Clerk Configuration

Please:
1. Summarize the plan's 3 phases
2. Confirm understanding of Phase 0 tasks (2.5 hours, 5 tasks)
3. Ask if I'm ready to begin Phase 0.1: Configure Clerk Project
```

### If Resuming Ontology Work

```text
I want to work on the Curriculum Ontology MCP Resource.

Please read:
1. @.agent/plans/curriculum-ontology-resource-plan.md - Implementation plan
2. @docs/architecture/curriculum-ontology.md - Current ontology definition
3. @.agent/research/SEQUENCE_VS_PROGRAMME_SUMMARY.md - Key findings
4. @.agent/plans/mcp-aggregated-tools-type-gen-refactor-plan.md - Prerequisite

Current status:
- Ontology refined (Programmes ≠ Sequences, Threads elevated)
- Waiting on Data Team for formal sequence/programme definitions
- Aggregated tools refactor is a BLOCKER (not yet started)

Please:
1. Explain the blocker (aggregated tools refactor)
2. Ask if I want to:
   a) Implement the aggregated tools refactor first (unblocks ontology), OR
   b) Create a shimmed ontology resource (interim solution), OR
   c) Wait for Data Team definitions before proceeding
```

### If Resuming API Wishlist Work

```text
I want to continue work on the Upstream API Metadata Wishlist.

Please read:
1. @.agent/plans/upstream-api-metadata-wishlist.md - 15 enhancement items

Current status:
- Wishlist complete with 15 items
- Includes OpenAPI best practices (Item #15 with 7 sections A-G)
- Includes programme variant metadata (Item #5 - high priority)
- Includes type standardisation with $ref (Item #10)
- Document ready to share with API team

Please:
1. Summarize the top 5 highest-priority items
2. Ask if I want to:
   a) Share this with the API team now, OR
   b) Add more items to the wishlist, OR
   c) Create implementation plan for specific items
```

### If Starting New Work

```text
I have a new task: [describe your task]

Please:
1. Read @.agent/context/context.md for current state
2. Read @.agent/directives-and-memory/rules.md for Cardinal Rule and other rules
3. Search for related existing plans in .agent/plans/
4. Check if this aligns with current priorities in @.agent/plans/high-level-plan.md
5. Ask clarifying questions before proceeding
```

---

## Decision Points

Use these questions to guide the new chat session:

### Priority Selection

- **OAuth**: "Begin Clerk OAuth 2.1 implementation (Phase 0)"
- **Ontology**: "Work on curriculum ontology resource"
- **Semantic Search**: "Continue semantic search integration"
- **API Wishlist**: "Refine or share API enhancement proposals"
- **Other**: "I have a different task: [describe]"

### Approach Selection (if ambiguous)

- **TDD or not?** Always TDD for production code
- **Test first or code first?** Tests first (Red → Green → Refactor)
- **Detail level?** Maximum detail (slow and steady, no ambiguity)
- **Commit frequency?** After each logical step (atomic commits)

### Quality Gates

- **Run after each change**: `pnpm format:root && pnpm type-check && pnpm lint && pnpm test`
- **Before commit**: All quality gates must pass
- **Before PR**: Full test suite + build successful

---

## Common Pitfalls to Avoid

### Type System

- ❌ DON'T: Use `as`, `any`, `!`, `Record<string, unknown>`
- ✅ DO: Use type guards, narrow types, preserve type information

### Testing

- ❌ DON'T: Write tests after code (TDD violation)
- ✅ DO: Red (failing test) → Green (passing code) → Refactor

### Schema-First

- ❌ DON'T: Hand-author types, schemas, or validators
- ✅ DO: Generate from OpenAPI at `pnpm type-gen` time

### Commit Hygiene

- ❌ DON'T: Skip git hooks, force push, commit without tests
- ✅ DO: Atomic commits, all hooks run, all tests pass

---

## Emergency Procedures

### If Quality Gates Fail

1. **Don't commit** - Fix issues first
2. Read error messages carefully
3. Run individual checks to isolate: `pnpm type-check`, `pnpm lint`, `pnpm test`
4. Fix root cause (don't work around with `@ts-ignore` or similar)

### If Tests Fail

1. Check if you wrote test BEFORE code (TDD)
2. If test is failing because code doesn't exist yet: **This is correct** (Red phase)
3. If test is failing after you wrote code: Debug and fix
4. If you can't fix: Ask for help, don't skip the test

### If Cardinal Rule Violated

1. **Stop immediately**
2. Ask: "Should this type/schema come from OpenAPI at `pnpm type-gen` time?"
3. If yes: Move it to type-gen
4. If no: Justify why it's an exception (rare)

---

## Success Criteria

You're on the right track if:

- ✅ All quality gates passing before every commit
- ✅ Writing tests BEFORE code (TDD)
- ✅ No type shortcuts or workarounds
- ✅ Atomic, focused commits
- ✅ Clear acceptance criteria for each task
- ✅ Maximum detail in plans and documentation

---

## Quick Reference

**Monorepo Tool**: `turbo` + `pnpm`  
**Test Framework**: `vitest`  
**Type System**: TypeScript (strict mode)  
**Linting**: ESLint (custom boundary rules in `eslint-rules/`)  
**Formatting**: Prettier  
**MCP SDK**: `@modelcontextprotocol/sdk`  
**Deployment**: Vercel (Express apps)

**Key Command**: `pnpm type-gen` - Regenerates all types from OpenAPI schema (run after upstream schema changes)

---

## When In Doubt

1. **Read the rules**: `.agent/directives-and-memory/rules.md`
2. **Check the plan**: `.agent/plans/high-level-plan.md`
3. **Ask questions**: Don't guess, clarify before proceeding
4. **Go slow**: Favor detail and certainty over speed
5. **Stay aligned**: Cardinal Rule, Schema-First, TDD - always

---

**Ready to continue!** 🚀

Select a priority above, or describe your task, and let's proceed with maximum clarity and quality.
