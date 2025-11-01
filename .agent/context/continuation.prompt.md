# Continuation Prompt: Oak MCP Ecosystem

Use this prompt to spin up a fresh chat and regain the current working context quickly.

## Startup Checklist

1. Read:
   - `@.agent/context/context.md`
   - `@.agent/directives-and-memory/rules.md`
   - `@.agent/directives-and-memory/schema-first-execution.md`
   - `@docs/agent-guidance/testing-strategy.md`
   - `@.agent/plans/mcp-oauth-implementation-plan.md`
2. Summarise the current state (≤4 sentences) – highlight mock coverage, refreshed documentation, bypass audit outcome, and pending quality gates.
3. List the top three priorities (`pnpm qg` at repo root, `pnpm smoke:dev:auth`, log outcomes – unless direction changes).
4. Confirm with user which priority (or alternative) to pick up.

_Remember to apply the "could it be simpler?" first-question rule and maintain TDD discipline._

## Current Highlights

- Two-tier auth testing: `trace:oauth` for one-off Clerk validation; mocks everywhere else (unit/integration/E2E/smoke).
- Mock fixtures + tests are in place (`auth-scenarios.*`, `mock-clerk-middleware.*`, `auth-enforcement.e2e.test.ts`).
- New `smoke:dev:auth` (local-stub-auth mode) exercises auth enforcement on running server with stub tools.
- Outstanding work: rerun repo-level quality gate, execute `pnpm smoke:dev:auth`, and log both results.

## Resuming Clerk OAuth Work

- Review `.agent/plans/mcp-oauth-implementation-plan.md` & `context.md` for latest status and quality-gate expectations.
- Execute quality gates: `pnpm qg` (repo root) and `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:auth`.
- Record outcomes in the plan/context documents and flag any regressions.

## Quality Gate Reminder

- Post-changes, run `pnpm qg` (repo root) followed by `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:auth` (stub-auth mode).
- Manual `pnpm smoke:dev:live:auth` remains optional for real Clerk validation; not part of CI/CD.

## Archives

Legacy quick-start snippets and historical prompts are stored in `.agent/context/archive/prompts/continuation.prompt.archive.md`.
