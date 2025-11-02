# Context: Oak MCP Ecosystem

**Updated**: 2025-11-02  
**Branch**: `feat/oauth_support`

## Current Focus

- Consolidate logging across the streamable HTTP and stdio servers by enhancing `@oaknational/mcp-logger` to support configurable sinks (stdout-only vs file-only) and rich tsdoc/documentation.
- Delete the legacy trace middleware and standardise on `LOG_LEVEL`-driven debug logging.
- Prepare to instrument the Streamable HTTP transport once logging is unified.

## State Snapshot

- Trace-specific flags/environment have been removed; some helper code remains and will be purged next.
- The HTTP server currently wraps the shared logger with bespoke file-sink logic; the stdio server still uses its own logger implementation. Both will migrate onto the enhanced shared logger to reduce duplication and ensure consistent behaviour.
- Hosted deployments (Vercel) must default to stdout logging; stdio deployments must default to file logging. Config needs to stay simple and well documented.

## Active Work Streams

1. **Shared logger enhancement**
   - Add opt-in file sink support (path override, append mode) to `packages/libs/logger`.
   - Supply tsdoc-rich helpers and authored docs covering HTTP vs stdio usage.

2. **App adoption**
   - Remove `trace-mcp-flow` and the HTTP app’s bespoke logger, refactoring to the shared helper.
   - Update the stdio server to use the helper in file-only mode, deleting local logging code.

3. **Transport instrumentation (next)**
   - Once logging is unified, add tests that stub the transport to capture timing/errors, then implement logging hooks.

## Immediate Next Steps

1. Delete the trace module and adjust imports/tests to rely solely on `logger.debug`.
2. Implement shared logger enhancements with documentation.
3. Refactor HTTP and stdio servers onto the shared helper, updating tests.

## Quality Gate Reminder

- After refactors, run `pnpm qg` and `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:auth`; record outcomes in the plan.

## References

- Plan: `.agent/plans/mcp-oauth-implementation-plan.md`
- Logging utilities: `packages/libs/logger`
- Stdio logger wiring: `apps/oak-curriculum-mcp-stdio/src/app/wiring.ts`
- HTTP logger wiring: `apps/oak-curriculum-mcp-streamable-http/src/index.ts`
