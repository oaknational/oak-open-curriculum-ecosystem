# Phase 3: Iterative Root Cause Diagnosis - Starting Prompt

**Context:** We're diagnosing a deployment hang in the Vercel-hosted MCP HTTP server. Phases 1 and 2 are complete (instrumentation + built-server harness). Now we need to find and fix the root cause.

## Critical Finding from Vercel Logs

Analysis of production logs reveals:

- ✅ **Bootstrap succeeds**: All "Creating app #1/2/3" logs present
- ✅ **Auth setup completes**: Clerk middleware registered, OAuth routes configured
- ❌ **All requests hang during handling**: Every request shows `responseStatusCode: -1`, `durationMs: -1`
- ❌ **Affects ALL routes**: `/`, `/healthz`, `/mcp`, favicons

**Conclusion**: The hang is NOT in bootstrap—it's in the Express middleware chain or route handlers.

## Your Mission

Use the built-server harness with iterative diagnosis to:

1. **Reproduce the hang locally** with auth-enabled configuration
2. **Add request-level instrumentation** to trace middleware execution
3. **Identify the exact location** where requests hang (last log before timeout)
4. **Form and test hypotheses** through measurement → analysis → theory → instrument → test cycles
5. **Implement and validate the fix**

## Required Reading

**Essential Context:**

- `@.agent/context/HANDOFF.md` - Project overview and current status
- `@.agent/context/continuation.prompt.md` - Full technical history
- `@.agent/plans/mcp-streamable-http-runtime-diagnostics-plan.md` - This plan (updated with Phase 3 details)

**Rules & Practices:**

- `@.agent/directives-and-memory/rules.md` - Code standards and practices
- `@docs/agent-guidance/testing-strategy.md` - TDD approach

**Harness Documentation:**

- `@apps/oak-curriculum-mcp-streamable-http/README.md` - Production Diagnostics section
- `@docs/development/production-debugging-runbook.md` - Local Production Build Testing

## Starting Point - Phase 3 Iteration 1

### Hypothesis

Clerk middleware or global middleware is blocking without calling `next()`, causing all requests to hang.

### Measure

```bash
cd apps/oak-curriculum-mcp-streamable-http
pnpm build
ENV_FILE=.env.harness.auth-enabled pnpm prod:harness
# In another terminal:
pnpm prod:requests
```

### Expected Outcome

If the hang reproduces locally:

- Harness should timeout or hang
- Logs should show bootstrap complete, but request never finishes
- Identify last log entry before hang

### Next Steps Based on Results

**If hang reproduces:**

1. Add request entry/exit logging to ALL middleware
2. Add logging before/after each `next()` call
3. Re-run to see where logs stop
4. That's your culprit

**If hang does NOT reproduce:**

1. Try `ENV_FILE=.env.harness.auth-enabled` with REAL Clerk keys (not placeholders)
2. Check if hang is Vercel-specific (serverless context, cold start, bundling)
3. Add logging around Clerk SDK initialization

## Tools Available

- **Harness scripts**: `prod:harness`, `prod:requests`, `prod:diagnostics`
- **Config scenarios**: auth-enabled, auth-disabled, missing-clerk (in `config/` directory)
- **Phase 1 instrumentation**: Bootstrap and auth timing logs already in place
- **Request runner**: Automated test sequence with timing and exit codes

## Quality Gate Requirements

After any code changes:

1. `pnpm build` - Must succeed
2. `pnpm type-check` - No type errors
3. `pnpm lint -- --fix` - Auto-fix and pass
4. `pnpm test:all` - All tests pass
5. Harness validation with all 3 scenarios

## Key Constraints

- Never use type assertions (`as`, `any`, `!`, `Record<string, unknown>`)
- All types flow from OpenAPI schema via compile-time generation
- Use type guards to narrow `unknown` to specific types
- Follow TDD: red → green → refactor
- Commit after each successful validation cycle

## Success Criteria

- [ ] Hang reproduced locally with harness
- [ ] Root cause identified through iterative instrumentation
- [ ] Fix implemented and tested
- [ ] All 3 harness scenarios pass (auth-enabled, auth-disabled, missing-clerk)
- [ ] All quality gates remain green
- [ ] Documentation updated with findings

---

**Ready to start?** Read the required documents above, then begin with Iteration 1: Measure step.
