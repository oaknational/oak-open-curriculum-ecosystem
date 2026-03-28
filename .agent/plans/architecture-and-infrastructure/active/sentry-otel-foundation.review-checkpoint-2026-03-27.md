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
12. `docs/architecture/architectural-decisions/141-coherent-structured-fan-out-for-observability.md`

This file is authoritative for whether the handover bundle can be trusted after
session compression. It is not the later runtime-adoption code review record.

## Current Status

**Status: clean owner-requested handover confirmation rerun pending**

The current local worktree on `feat/full-sentry-otel-support` above the pushed
checkpoint `ffff1867` retains the Phase 1 blocker-clearance slice, but the
bundle is not yet restart-cleared. The first owner-requested rerun surfaced
follow-up architecture, onboarding, doc-coherence, security, and config-wiring
findings; those fixes are now in the local worktree and the clean
confirmation rerun still needs to be recorded before runtime adoption resumes.

Execution-state addendum (2026-03-28):

- `ffff1867` remains the latest pushed ancestor. The blocker-clearance slice is
  local worktree state above it.
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
  guidance; a clean rerun is still required after fixes.
- A same-day follow-up rerun attempt after the latest doc-consolidation refresh
  shut down without substantive reviewer output, so the last recorded findings
  and clean passes below remain authoritative.
- `code-reviewer` has already run once against the refreshed bundle without
  findings. The remaining open review work is the clean confirmation rerun for
  the owner-requested handover lenses plus any specialist lenses reopened by
  the latest fixes.

## Findings Closed in This Refresh

The blocker-clearance close-out surfaced and closed these issues:

1. Restart docs still described blocker remediation as the next step instead of
   the final owner-requested handover rerun and then runtime adoption from the
   local descendant of `ffff1867`.
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
in the current local worktree:

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

No first-rerun finding is currently believed open; the remaining work is the
clean confirmation rerun recorded in the reviewer matrix below.

## Reviewer-Matrix Status

Specialist rechecks completed against the refreshed worktree:

| Reviewer lens | Status |
|---|---|
| `test-reviewer` | Earlier rerun was clean after wrapper coverage/proof-wording fixes; no newer findings recorded yet |
| `type-reviewer` | Earlier rerun was clean after literal-union/doc-example fixes; no newer findings recorded yet |
| `config-reviewer` | Latest rerun found JS/Vitest ignore-carve-out regressions in app configs; fixes landed, clean confirmation pending |
| `security-reviewer` | Latest rerun found request-IP/body/header redaction gaps; fixes landed, clean confirmation pending |
| `mcp-reviewer` | Earlier rerun was clean after stdio MCP wording/doc-link fixes; no newer findings recorded yet |
| `sentry-reviewer` | Earlier rerun was clean after final blocker cleanup; no newer findings recorded yet |

Final owner-requested handover re-review still to record here:

| Reviewer lens | Status |
|---|---|
| `code-reviewer` | Reran once against the refreshed bundle; no findings |
| `docs-adr-reviewer` | Latest rerun found stale checkpoint wording, a phantom ADR-117 scope entry, and napkin restart-state drift; fixes landed, clean confirmation still pending |
| `onboarding-reviewer` | Latest rerun found remaining `pnpm lint:fix` drift in README/quick-start onboarding paths; fixes landed, clean confirmation still pending |
| `architecture-reviewer-barney` | Latest rerun found missing direct `@oaknational/observability` app dependencies; fix landed, clean confirmation still pending |
| `architecture-reviewer-fred` | Latest rerun reported no findings |
| `architecture-reviewer-betty` | Latest rerun reported no findings |
| `architecture-reviewer-wilma` | Latest rerun reported no findings |

## Validation Status

Current validation status after the current remediation and doc-consolidation
edits:

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

## Exit Condition for This Checkpoint

Not yet satisfied.

This checkpoint returns to **cleared for restart** once:

1. the owner-requested final handover reviewers have rerun against this
   refreshed bundle,
2. any findings from that pass are fixed or explicitly rejected, and
3. affected validations are rerun where needed.

## Still Required Later

1. When HTTP and Search CLI runtime adoption resumes, rerun the broader
   implementation reviewer matrix against that new code, not just this
   handover bundle.
2. Sentry-specific code review must still consult current official Sentry and
   OpenTelemetry documentation at implementation time.
3. If future shared-package changes reopen any focused Phase 1 gate, re-green
   the foundation surface before runtime adoption continues.
