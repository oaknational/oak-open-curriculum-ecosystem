# Continuation Prompt: Oak MCP Observability

Use this prompt to rehydrate context quickly when resuming work on logging consolidation and transport diagnostics.

## Startup Checklist

1. Read:
   - `@.agent/context/context.md`
   - `@.agent/directives-and-memory/rules.md`
   - `@.agent/directives-and-memory/schema-first-execution.md`
   - `@docs/agent-guidance/testing-strategy.md`
   - `@.agent/plans/mcp-oauth-implementation-plan.md`
2. Summarise the current state (≤4 sentences) – highlight logging consolidation goals, removal of trace helpers, and upcoming transport instrumentation.
3. List the top three actionable priorities (see below) and confirm where to begin.
4. Ask “could it be simpler without compromising quality?” before proposing implementation work.

## Current Highlights

- Trace logging is being replaced by standard `logger.debug`; remaining trace helpers will be deleted imminently.
- The shared logger will gain configurable sinks (stdout for HTTP by default, file for stdio by default) plus thorough documentation/tsdoc.
- Transport instrumentation tests will follow once both servers consume the enhanced logger.

## Immediate Priorities

1. Remove `trace-mcp-flow` and update the HTTP server/tests to rely solely on `logger.debug`.
2. Enhance `@oaknational/mcp-logger` with optional file sinks, tsdoc-rich helpers, and authored docs; ensure configuration covers HTTP vs stdio needs.
3. Refactor the streamable HTTP and stdio servers to use the shared helper, then plan the transport instrumentation tests.

## Quality Gate Reminder

- After migrating both servers, run `pnpm qg` and `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:auth`; record outcomes in the plan.
- Optional follow-up: observe Vercel logs to confirm stdout-only defaults and document findings.

## Archives

Legacy prompts remain in `.agent/context/archive/prompts/continuation.prompt.archive.md` if historical context is required.
