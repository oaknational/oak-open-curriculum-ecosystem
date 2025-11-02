<!-- markdownlint-disable -->

# MCP Streamable HTTP Observability Plan

**Status**: Phase 1 – logging consolidation & instrumentation design  
**Last Reviewed**: 2025-11-02  
**Scope**: `apps/oak-curriculum-mcp-streamable-http`, `apps/oak-curriculum-mcp-stdio`, `packages/libs/logger`

## Snapshot

- The ad-hoc TRACE flag is retired; debug verbosity now flows purely through `LOG_LEVEL`. Remaining trace helpers will be deleted in favour of standard logging.
- The HTTP server wraps the shared logger, but the stdio server still ships its own bespoke implementation. We will migrate both onto an enhanced `@oaknational/mcp-logger` that supports opt-in file sinks and runtime-configured destinations.
- Hosted deployments (Vercel) must default to stdout-only logging, while the stdio server must default to file-only logging so its stdout remains reserved for MCP protocol frames. Configuration must remain simple and well documented.
- Goal: deliver shared logging primitives that satisfy both runtime requirements, expose structured examples/docs, and unblock deeper transport instrumentation for diagnosing hosted timeouts.

## Phase Outline

| Phase   | Focus                     | Definition of Done                                                                                                                                                                                |
| ------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Phase 1 | Logging consolidation     | Shared logger gains opt-in file sink support (doc+tsdoc examples); HTTP and stdio servers consume the shared implementation; legacy trace module removed; configuration documented.               |
| Phase 2 | Transport instrumentation | Integration tests stub `StreamableHTTPServerTransport` to simulate slow responses and errors, asserting structured logs. Implementation wires timing/error hooks and leverages the shared logger. |
| Phase 3 | Documentation & rollout   | README / Vercel config / `.env.example` updated; SDK logging guidance added; quality gates rerun; deployment observations captured.                                                               |

## Tranches & SMART Tasks (Phase 1)

### Tranche 1 – Retire Trace Middleware

| Task                            | Acceptance Criteria                                                                                                           | Implementation Steps                                                                    | Validation                                                                                                                            |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1 Delete trace module         | `trace-mcp-flow.*` removed; build succeeds with no missing imports; docs contain no trace references                          | Remove files; update `index.ts`, tests, and smoke scripts; regenerate typings as needed | `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http lint && type-check`; content search confirms absence of `TRACE` prefix |
| 1.2 Replace residual trace logs | All former trace calls routed through `logger.debug`; no `[TRACE]` literals remain unless part of message content requirement | Audit logging statements; rewrite to concise debug messages; update tests/snapshots     | `pnpm vitest run apps/oak-curriculum-mcp-streamable-http/src/**/*.test.ts`; grep to confirm absence of `[TRACE]`                      |

### Tranche 2 – Enhance Shared Logger

| Task                                                          | Acceptance Criteria                                                                                                                          | Implementation Steps                                                                                       | Validation                                                                                                                 |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| 2.1 Implement configurable sinks in `@oaknational/mcp-logger` | New factory exposes stdout-only and file-only modes; file sink initialises path safely; tsdoc includes example snippets for HTTP/stdio usage | Extend logger package with optional sink config, including env-driven defaults; add tsdoc + README section | `pnpm --filter @oaknational/mcp-logger lint && test`; run generated docs (`pnpm --filter @oaknational/mcp-logger doc-gen`) |
| 2.2 Document configuration                                    | Authored docs and `.env.example` entries describe `LOG_LEVEL`, `MCP_STREAMABLE_HTTP_FILE_LOGS`, and stdio-specific flags                     | Update logging package docs + app READMEs; ensure instructions highlight Vercel vs local differences       | `pnpm markdownlint:root`; manual review for clarity                                                                        |

### Tranche 3 – Adopt Shared Logger in Apps

| Task                            | Acceptance Criteria                                                                                          | Implementation Steps                                                                                    | Validation                                                                                             |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| 3.1 Migrate streamable HTTP app | Local logger module deleted; app imports shared helper; unit tests cover stdout default & optional file sink | Replace logger wiring, adjust tests, update env schema                                                  | `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http lint && test && type-check`             |
| 3.2 Migrate stdio app           | Stdio app relies solely on shared helper configured for file-only logging; stdout remains clean              | Replace logger wiring in stdio server; remove bespoke code; add/adjust tests for file logging behaviour | `pnpm --filter @oaknational/oak-curriculum-mcp-stdio lint && test`; manual run to confirm stdout empty |
| 3.3 Configuration parity        | `.env.example`, docs, and deployment guides reflect new logger usage across both apps                        | Synchronise env samples, docs, and scripts                                                              | `pnpm markdownlint:root`; manual doc review                                                            |

## Upcoming Work (Phase 2)

- Create `handlers.integration.test.ts` to drive transport timing/error instrumentation.
- Implement request duration measurement, transport hook logging, and session metadata emission via the shared logger.
- Evaluate SDK-level logging enhancements once server-side visibility improves.

## Phase 3 Checklist

- Update app docs & env samples for the unified logger configuration.
- Document logging usage patterns in the SDK (tsdoc + authored guide).
- Run `pnpm qg` and smoke suites; capture outcomes here.
- Observe hosted deployments post-release and note follow-up actions.

## Deliverables

- Shared logging package supporting configurable sinks with extensive tsdoc & authored documentation.
- HTTP and stdio servers consuming the shared logger without bespoke implementations.
- Legacy trace code removed; debug logging governed entirely by `LOG_LEVEL`.
- Transport instrumentation tests & implementation (Phase 2).
- Updated project documentation for logging configuration.

## Risks & Mitigations

- **Risk**: Stdio server logging to stdout breaks the protocol.  
  **Mitigation**: Default the shared helper to file-only mode for stdio and cover with tests.
- **Risk**: File logging unsupported on Vercel.  
  **Mitigation**: Keep HTTP default to stdout only; make file sink opt-in via documented flag.
- **Risk**: Configuration complexity.  
  **Mitigation**: Provide simple env-driven toggles and detailed examples in docs/tsdoc.

## References

- Logging utilities: `packages/libs/logger`
- Stdio server wiring: `apps/oak-curriculum-mcp-stdio/src/app/wiring.ts`
- HTTP server wiring: `apps/oak-curriculum-mcp-streamable-http/src/index.ts`
- MCP transport reference: `@modelcontextprotocol/sdk/server/streamableHttp`
- Testing strategy: `apps/oak-curriculum-mcp-streamable-http/TESTING.md`

---

_For historical Clerk/OAuth work, consult `.agent/plans/archive/mcp-oauth-implementation-plan.archive.md`._
