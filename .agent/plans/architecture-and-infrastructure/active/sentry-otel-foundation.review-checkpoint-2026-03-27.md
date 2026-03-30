# Sentry + OpenTelemetry Foundation — Review Checkpoint (2026-03-27)

## Scope

This checkpoint records review status for the active **handover bundle**:

1. `.agent/plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md`
2. `.agent/prompts/architecture-and-infrastructure/sentry-otel-foundation.prompt.md`
3. `.agent/plans/architecture-and-infrastructure/active/README.md`
4. `.agent/plans/architecture-and-infrastructure/future/observability-and-quality-metrics.plan.md`
5. `.agent/plans/architecture-and-infrastructure/README.md`
6. `.agent/plans/architecture-and-infrastructure/current/README.md`
7. `.agent/plans/architecture-and-infrastructure/future/README.md`
8. `.agent/prompts/README.md`
9. `.agent/memory/napkin.md`
10. `docs/architecture/architectural-decisions/041-workspace-structure-option-a.md`
11. `docs/architecture/architectural-decisions/117-plan-templates-and-components.md`
12. `docs/architecture/architectural-decisions/143-coherent-structured-fan-out-for-observability.md`

This file is authoritative for whether the handover bundle can be trusted after
session compression. It is not the later runtime-adoption code review record.

## Current Status

**Status: cleared for restart**

The current pushed branch head `44d8d74d` on `feat/full-sentry-otel-support`
contains the Phase 1 blocker-clearance slice plus the follow-up
doc-coherence refresh, and the bundle is now restart-cleared. The first
owner-requested rerun surfaced follow-up architecture, onboarding,
doc-coherence, security, and config-wiring findings; those fixes are now on
the branch. The committed-state refresh then reran `code-reviewer`,
`docs-adr-reviewer`, `onboarding-reviewer`, all four architecture reviewers,
`config-reviewer`, and `security-reviewer` against the refreshed bundle, and no
new findings were recorded. Runtime adoption may now resume from Phase 3.
The purpose of that restart clearance is to resume supportability-driven
runtime adoption, not to reopen the shared-foundation work already closed in
Phase 1 and Phase 2.

Execution-state addendum (2026-03-28):

- `44d8d74dd0f01c56096bebf2ff70779eb494203a` is now the latest pushed
  checkpoint and contains the blocker-clearance slice plus the follow-up
  doc-coherence refresh.
- `ffff1867f96aef0aedbcd80a74e57b7cbd0e8da7` remains the earlier Search CLI
  env-loading branch-hygiene checkpoint; it does not count as observability
  adoption evidence.
- The blocker bundle still includes these closed items:
  - stale logger compatibility teaching removed from active docs/examples
  - `@oaknational/observability` moved to `packages/core/observability`
  - the library boundary model is tiered and now blocks both sibling-path and
    package-specifier imports for forbidden lib-to-lib dependencies, with the
    documented `search-contracts` exception limited to approved
    `@oaknational/sdk-codegen` subpath exports
  - Express request and error helpers apply shared header redaction by default
  - previously reviewed ESLint export-map, kill-switch, invalid-boolean,
    `vi.mock(...)`, and URL-credential findings remain closed
- The focused Phase 1 gates and post-move canary `type-check`s have now been
  rerun and are green again after the boundary/doc remediation edits.
- App lint canaries are also green for the HTTP MCP server, Search CLI, and
  legacy stdio workspaces after the app-boundary rule switched to the
  package-aware `import-x/no-relative-packages` guard plus explicit app/lib
  config-file carve-outs.
- The latest follow-up fixes also cover request-IP/body redaction proof,
  runtime-tooling boundary coverage, JS/Vitest lint-config wiring in the
  HTTP/Search app configs, and restored boundary enforcement for core tests
  while keeping explicit config-file carve-outs.
- The owner-requested reviewer set has already been re-run once for docs,
  onboarding, and architecture. That first pass returned follow-up findings on
  boundary enforcement, ADR drift, restart-state truthfulness, and onboarding
  guidance; those findings are now closed.
- A same-day follow-up rerun attempt after the latest doc-consolidation refresh
  shut down without substantive reviewer output, so the last recorded findings
  and clean passes below remain authoritative.
- The committed-state refresh corrected the stale local-only framing in the
  active plan, checkpoint, prompt, indexes, and active napkin memory, then
  reran the belt-and-braces confirmation sweep with no new findings.
- Local runtime-adoption work has now moved beyond the pushed handover state:
  - the HTTP Phase 3 observability wiring plus doc refresh are in the working
    tree
  - the local HTTP slice is not yet reviewer-complete or gate-green
  - this checkpoint still clears the pushed handover bundle for restart, but it
    does not yet certify the in-progress local HTTP implementation changes
  - the active plan and prompt now carry the live TODO list for that local
    stabilisation pass
  - the current local reviewer sweep does not yet add a new handover-bundle
    defect, but it does preserve open local implementation findings in the
    active plan/prompt:
    - startup-seam tests still need simpler DI fakes and less cast-heavy
      harnessing
    - the observability composition suite should be treated as integration
      coverage
    - the new Sentry-node redaction tests must keep moving away from
      implementation-coupled formatting assertions
    - several HTTP app files still need extraction before the repo-root gate
      pass

## Findings Closed in This Refresh

The blocker-clearance close-out surfaced and closed these issues:

1. Restart docs still described blocker remediation as the next step instead of
   the final owner-requested handover rerun and then runtime adoption from the
   blocker-cleared branch state.
2. The active plan still had stale wording that treated logger compatibility
   cleanup and `vi.mock(...)` removal as open.
3. The checkpoint still claimed `pnpm markdownlint:root` was unavailable after
   the workspace refresh.
4. ADR-041 and the architecture index had drifted from the new `core`
   observability placement and the explicit foundation-lib vs adapter-lib
   model.
5. Core-boundary wording still implied that every `packages/core/` package had
   zero external dependencies, which no longer described
   `packages/core/observability`.
6. The tiered lib-boundary helper blocked only sibling-path imports at first;
   it now blocks `@oaknational/<lib>`, `/*`, and `/**` package-specifier forms
   too, with direct unit coverage.
7. Express request logging had optional header redaction, but error logging did
   not. Both helpers now default to shared redaction and still allow explicit
   overrides.
8. Logger, SDK, and governance docs still contained stale stdio wording,
   stale `logger.error(...)` examples, an unsafe `OAK_API_KEY` example, and
   test examples that leaned on `any`.
9. The middleware suite covered helper internals but not the exported wrapper
   functions. Wrapper option plumbing is now exercised directly.
10. The active plan overclaimed the breadth of redaction proof on disk. The
    proof wording now matches the actual tests.
11. `coreTestConfigRules` had disabled all import-boundary checks for core
    tests/config files. Cross-workspace core boundaries now remain active in
    tests, and root config-file allowances are handled explicitly in package
    ESLint configs.

## First Owner-Requested Rerun Findings Now Closed

The first final rerun also found the following issues, and they are now closed
on the current branch:

1. `packages/core/oak-eslint` needed package-specifier-safe enforcement for
   `core`, `libs`, `apps`, and SDK rules, plus direct proof in rule tests.
2. ADR-041 and the architecture index had drifted from ADR-108’s
   `oak-search-sdk` dependency direction.
3. The active plan, prompt, and collection indexes overclaimed restart
   clearance and implied runtime adoption should already resume.
4. The onboarding entry docs mixed `nvm`/`fnm` guidance and used mutating lint
   commands in the quick verification path.
5. Logging guidance overclaimed runtime-adoption phase state, used
   extensionless local-import examples, and lacked an explicit
   `performance.now()` timing proof.

No first-rerun finding is currently believed open, and the committed-state
confirmation rerun recorded in the reviewer matrix below returned no new
findings.

## Reviewer-Matrix Status

Historical handover-bundle reviewer status for the pushed restart-cleared
bundle (`44d8d74d`):

| Reviewer lens | Status |
|---|---|
| `test-reviewer` | Earlier rerun was clean after wrapper coverage/proof-wording fixes; no newer findings recorded yet |
| `type-reviewer` | Earlier rerun was clean after literal-union/doc-example fixes; no newer findings recorded yet |
| `config-reviewer` | Committed-state refresh rerun reported no findings |
| `security-reviewer` | Committed-state refresh rerun reported no findings |
| `mcp-reviewer` | Earlier rerun was clean after stdio MCP wording/doc-link fixes; no newer findings recorded yet |
| `sentry-reviewer` | Earlier rerun was clean after final blocker cleanup; no newer findings recorded yet |

Historical committed-state handover confirmation rerun results:

| Reviewer lens | Status |
|---|---|
| `code-reviewer` | Committed-state refresh rerun reported no findings |
| `docs-adr-reviewer` | Committed-state refresh rerun reported no findings |
| `onboarding-reviewer` | Committed-state refresh rerun reported no findings |
| `architecture-reviewer-barney` | Committed-state refresh rerun reported no findings |
| `architecture-reviewer-fred` | Committed-state refresh rerun reported no findings |
| `architecture-reviewer-betty` | Committed-state refresh rerun reported no findings |
| `architecture-reviewer-wilma` | Committed-state refresh rerun reported no findings |

Current local implementation reviewer sweep (2026-03-28, working tree only):

| Reviewer lens | Status |
|---|---|
| `mcp-reviewer` | Clean — no MCP-facing regression found in the current local HTTP Phase 3 diff |
| `config-reviewer` | Findings — local `@oaknational/sentry-node` type-check is currently red; direct `@sentry/node` dependency missing in the HTTP app; docs had drifted from the real local validation state |
| `test-reviewer` | Findings — `check-mcp-client-auth.unit.test.ts` still uses `vi.mock(...)`; the new startup seam and observability tests still violate the DI-only testing bar; the new Sentry-node redaction tests remain implementation-coupled |
| `code-reviewer` | Findings — the local slice is not yet approvable because of the broken Sentry-node test file, missing bootstrap handled-error capture, stale phase-completion wording, and non-compliant tests |
| `security-reviewer` | Findings — `/mcp` sanitisation still fails open in one transaction-derived path; the docs had overstated local security cleanliness before this consolidation refresh |
| `sentry-reviewer` | Findings — non-throwing failure spans are still marked OK; later async route errors can bypass handled-error capture; bootstrap failures still are not captured; init order may weaken auto-instrumentation |

Current local implementation issues to keep visible:

1. `packages/libs/sentry-node/src/runtime.unit.test.ts` currently breaks local
   `@oaknational/sentry-node` `type-check` because the new test code references
   `SentryErrorEvent` / `SentryBreadcrumb` without declaring them.
2. `/mcp` sanitisation can still fail open in a transaction-derived path, so
   raw headers/body data may survive into Sentry when the route match comes
   from `event.transaction` rather than `request.url`.
3. The current HTTP span abstraction still records non-throwing
   timeout/network/upstream failure outcomes as successful spans.
4. Later Express async route failures can still bypass the handled-error
   boundary because the only custom error middleware is mounted too early in
   the route stack.
5. Bootstrap failures are still flushed but not captured via the handled-error
   path that the current docs describe.
6. `apps/oak-curriculum-mcp-streamable-http/src/check-mcp-client-auth.unit.test.ts`
   still uses `vi.mock(...)` and remains non-compliant with the repo testing
   strategy / ADR-078.
7. `apps/oak-curriculum-mcp-streamable-http/src/observability/http-observability.unit.test.ts`
   still behaves like integration coverage, bypasses product registration
   paths, and constrains exact intermediate shape.
8. `apps/oak-curriculum-mcp-streamable-http/src/server-runtime.unit.test.ts`
   still uses cast-heavy scaffolding and does not prove the
   `startApp` / `createApp(...)` forwarding contract with simple DI fakes.
9. The HTTP workspace imports `@sentry/node` directly but still does not
   declare it as a direct dependency.
10. The current entrypoint still initialises Sentry only after importing the
    broader module graph, which may weaken automatic live-mode instrumentation.
11. The new Sentry-node redaction tests are still too coupled to intermediate
    payload shape and need stable-contract proof instead.
12. The current local docs must keep reflecting those open issues and must not
    describe the local HTTP Phase 3 slice as clean or complete while they
    remain open.

Closed during the current doc-consolidation pass:

1. `apps/oak-curriculum-mcp-streamable-http/README.md` no longer teaches the
   removed `ENABLE_LOCAL_AS` / `LOCAL_AS_JWK` demo-AS troubleshooting path.
2. `pnpm practice:fitness:informational` now passes again after trimming
   `distilled.md` back to its current line-count ceiling.

## Validation Status

Historical pushed-state validation status for the restart-cleared handover
bundle:

1. `@oaknational/eslint-plugin-standards`: `lint`, `test`, `type-check`,
   `build`
2. `@oaknational/logger`: `lint`, `test`, `type-check`
3. `@oaknational/env`: `lint`, `test`, `type-check`
4. `@oaknational/observability`: `lint`, `test`, `type-check`
5. `@oaknational/sentry-node`: `lint`, `test`, `type-check`
6. `@oaknational/sentry-mcp`: `lint`, `test`, `type-check`

Post-move canary checks now pass:

1. `pnpm --filter @oaknational/sdk-codegen type-check`
2. `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http type-check`
3. `pnpm --filter @oaknational/search-cli type-check`

Workspace/documentation fitness checks now pass:

1. `pnpm markdownlint:root`
2. `pnpm practice:fitness`
3. `git diff --check`

Additional app lint canaries also pass:

1. `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http lint`
2. `pnpm --filter @oaknational/search-cli lint`
3. `pnpm --filter @oaknational/oak-curriculum-mcp-stdio lint`

Notes:

- `@oaknational/oak-curriculum-mcp-streamable-http lint` currently exits 0 with
  pre-existing warning-level `@typescript-eslint/consistent-type-assertions`
  findings in tests.
- `pnpm markdownlint:root`, `pnpm practice:fitness`, and `git diff --check`
  were rerun after the latest plan/prompt/index wording refreshes and still
  pass.

Current local implementation validation state (2026-03-28, working tree only):

1. `@oaknational/sentry-node`
   - `test` now passes
   - `type-check` is red until the missing `SentryErrorEvent` /
     `SentryBreadcrumb` aliases are restored in `src/runtime.unit.test.ts`
   - `lint` is also red in that same new test area with one
     `max-statements` error and two `no-unsafe-assignment` errors
2. `@oaknational/oak-curriculum-mcp-streamable-http`
   - `test` initially hit sandbox `listen EPERM`, but the escalated rerun
     still failed with 24 suite-load errors caused by missing generated
     `oak-sdk-codegen/dist` module imports
   - `test:e2e` also fails with 21 suite-load errors caused by the same
     missing generated `oak-sdk-codegen/dist` modules
   - `type-check` fails in `src/server-runtime.unit.test.ts`,
     `src/tool-auth-checker.ts`, and `src/validation-logger.ts`
   - `lint` fails with 107 errors / 126 warnings across the HTTP app and test
     surface
3. Repo-root documentation hygiene gates now pass:
   - `pnpm markdownlint:root`
   - `pnpm practice:fitness`
   - `git diff --check`
4. The full implementation reviewer set has now returned active findings from
   `sentry-reviewer`, `security-reviewer`, `config-reviewer`,
   `test-reviewer`, and `code-reviewer`; only `mcp-reviewer` is currently
   clean on the local diff.
5. Therefore this checkpoint still clears the pushed handover bundle for
   restart, but it does **not** certify the current local HTTP runtime
   implementation as green.

## Exit Condition for This Checkpoint

Satisfied.

This checkpoint is now **cleared for restart** because:

1. the owner-requested committed-state handover reviewers reran against this
   refreshed bundle,
2. no new findings were recorded in that pass, and
3. the refreshed documentation fitness checks still pass.

## Still Required Later

1. Finish the current local HTTP stabilisation pass:
   - restore the missing generated `oak-sdk-codegen/dist` module surface so
     the HTTP test suites can load again
   - test-strategy cleanup with simple DI fakes only
   - lint-driven extractions in the HTTP app and new Sentry-node tests
   - truthful plan/prompt/checkpoint/index updates as the live TODO list
     changes
2. Keep the current reviewer findings visible across the active plan, prompt,
   and checkpoint until they are fixed or explicitly superseded.
3. After the gate-report checkpoint, resume the HTTP fix pass and rerun the
   broader implementation reviewer matrix against the runtime code, not just
   this handover bundle.
4. Rerun the full repo-root quality gates after substantive fixes land.
5. Sentry-specific code review must still consult current official Sentry and
   OpenTelemetry documentation at implementation time.
6. If future shared-package changes reopen any focused Phase 1 gate, re-green
   the foundation surface before runtime adoption continues.
