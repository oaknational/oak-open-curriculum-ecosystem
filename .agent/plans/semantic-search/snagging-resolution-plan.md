# OpenAI Connector Alias Retirement Plan

## Mission

Decommission the legacy `/openai_connector` alias from the Streamable HTTP MCP server without losing any functionality currently exposed via `/mcp`. The resulting deployment must present a single `/mcp` surface with full tool coverage, consistent Accept-header enforcement, and updated smoke/e2e coverage. Remote verification targets the preview already live at `https://poc-oak-open-curriculum-mcp-git-feat-searchuxcontinuation.vercel.thenational.academy/mcp` (auto-refreshes ~5 minutes after each push).

## Acceptance Criteria

1. No application code, tests, or documentation references `/openai_connector`.
2. `/mcp` continues to expose the complete tool set, including the aggregated search and fetch tools, with identical behaviour and metadata.
3. Local stub, local live, remote preview, and production deployments pass the Streamable HTTP smoke suite without alias-related warnings.
4. Documentation (README, architecture notes, deprecation guide) reflects the removal and provides a migration note.
5. Remote smoke harness accepts both positional and `--remote-base-url` flag inputs (via `commander`) so preview checks remain ergonomic post-removal.
6. The remote smoke tests are fully green and, when taken alongside the E2E tests, confirm that the remote deployment is fully and correctly operational.

## Phase 1 – Inventory and Design Confirmation

### Implementation Tasks

1. Catalogue all references to `/openai_connector` across source, tests, docs, and deployment scripts using `rg`, recording the current hits (index/auth wiring, OpenAI connector module, smoke assertions, E2E coverage, README + architecture docs, and the deprecation note).
2. Verify which handlers, auth guards, or logging paths are alias-specific (`registerOpenAiConnectorHandlers`, bearer bypass for `REMOTE_MCP_ALLOW_NO_AUTH_OPENAI`, smoke assertion warnings, etc.).
3. Confirm – via `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools.ts` and the existing `/mcp` E2E suite – that the tool catalogue already includes the OpenAI facade tools so removing the alias does not drop coverage.

### Validation

- Document findings (affected files, remaining consumers if any) in the plan context.
- No code changes yet—pure analysis.

## Phase 2 – Runtime Removal

### Implementation Tasks

1. Delete alias registration from `apps/oak-curriculum-mcp-streamable-http/src/index.ts` (remove additional transport wiring) and drop the `openai/connector.ts` module if nothing else consumes it.
2. Remove `registerOpenAiConnectorHandlers` usage, migrating any reusable logic into the primary MCP registration only if absolutely necessary to preserve behaviour parity.
3. Update auth middleware (`auth.ts`) to drop alias-specific branches (including `REMOTE_MCP_ALLOW_NO_AUTH_OPENAI`) and ensure bypass logic still complies with the testing strategy.
4. Ensure health endpoints, Accept enforcement (`ensureMcpAcceptHeader`), and logging still behave for `/mcp` once the alias routes disappear.

### Validation

- `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http lint`
- `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http type-check`

## Phase 3 – Tests, Harnesses, and Docs

### Implementation Tasks

1. Update Vitest suites (`e2e-tests/server.e2e.test.ts`, any alias-focused specs) to remove `/openai_connector` probes while retaining `/mcp` aggregated tool assertions.
2. Adjust smoke harness modules (`smoke-tests/smoke-assertions/health.ts`, `validation.ts`, `tools.ts`, and shared types) so only `/mcp` is exercised, expect 404s for legacy routes, and tighten remote warning copy.
3. Refresh documentation: README, architecture ADRs, open connector deprecation note—replace references with a migration note, highlight the removal date, and confirm developer guidance references `/mcp` only.
4. Regenerate any recorded analysis snapshots or fixtures impacted by the removal, ensuring logs reference the single `/mcp` surface.

### Validation

- `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test`
- `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:stub`
- `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:live`
- Remote preview check: `SMOKE_REMOTE_BASE_URL=<preview>/mcp pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:remote`

## Phase 4 – CLI Ergonomics (Commander Adoption)

### Implementation Tasks

1. Introduce `commander` in `smoke-tests/smoke-remote.ts` (and any shared CLI helpers) so `--remote-base-url` and future flags are parsed reliably; add the dependency in `package.json`.
2. Maintain support for the existing positional argument to avoid breaking scripts, covering both styles in tests.
3. Add unit coverage (or integration smoke harness tests) that exercises both the positional and flag styles, ensuring `SmokeSuiteOptions` stay schema-aligned.

### Validation

- `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http lint`
- `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:remote -- --remote-base-url <preview-url>`
- `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:remote -- <preview-url>`

## Phase 5 - Burden of Proof

We need to prove that the remote deployment is fully and correctly operational. The E2E tests and remote smoke tests are already in place, we need to make sure that they are

1. sufficient to prove that the remote deployment is fully and correctly operational.
2. Fully green.

Phase 5 point 1 above requires further investigation and planning before we can proceed, flag this to the user at the appropriate time. Confirm the preview domain (`https://poc-oak-open-curriculum-mcp-git-feat-searchuxcontinuation.vercel.thenational.academy/mcp`) serves the latest build before running the burden-of-proof checks.

## Phase 6 – Final Verification

### Implementation Tasks

1. Run the full quality gates: `pnpm qg`.
2. Run remote smoke against the latest preview deployment and confirm it is fully green (via both commander flag and positional invocation).

### Validation

- Confirm `pnpm qg` green.
- Remote smoke run against the preview deployment (flag + positional) is fully green.
- Context log updated with the removal summary and any follow-up actions.
