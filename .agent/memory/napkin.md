# Napkin

## Session 2026-03-03f — E2E test cleanup (streamable-http)

### What was done
- Investigated intermittent e2e failures in `pnpm check`: `stub-mode.e2e.test.ts`
  (404) and `tool-call-envelope.e2e.test.ts` (401).
- Root cause: `vitest.e2e.config.ts` used `pool: 'forks'` with `singleFork: true`,
  forcing all 24 test files into one process. 12 files used `vi.mock('@clerk/express')`
  — module-level global state that leaks between files in a shared fork.
- Deleted `tool-call-envelope.e2e.test.ts` — fully redundant with
  `tool-call-success.e2e.test.ts` which proves the same behaviour more thoroughly.
  Also used `vi.mock` and tested MCP SDK transport, not product code.
- Removed "returns the full roster from listUniversalTools()" from
  `stub-mode.e2e.test.ts` — duplicate proof covered by `server.e2e.test.ts`
  (line 120) and SDK unit/integration tests. The assertion was a tautology:
  comparing server output against the same function the server uses internally.
- Removed `singleFork: true` / `pool: 'forks'` / `isolate: true` from
  `vitest.e2e.config.ts`, inheriting sane defaults from the base config.
- All 190 remaining tests pass across 23 files.

### Patterns to remember
- `singleFork: true` + `vi.mock` across multiple files = shared-state coupling.
  Module mocks leak between files in a single fork despite `isolate: true`.
- Before fixing a failing test, ask: (1) is the behaviour already proven elsewhere?
  (2) could a unit test prove this with a pure function? (3) are we testing our
  product code or a dependency's transport layer?
- Comparing server output against the same function the server uses internally is
  a tautology — if both have the same bug, the test still passes. Hardcoded
  expected values or schema-anchored fixtures are better.
- 12 of 24 e2e test files use `vi.mock('@clerk/express')` despite
  `dangerouslyDisableAuth: true` being available via DI. The mock is redundant
  when DI is used. This is tech debt for future cleanup.

## Session 2026-03-03e — Execute codegen logger replacement

### What was done
- Executed the codegen-logger-replacement plan: replaced all 49 console.* calls
  across 12 files in code-generation/ and vocab-gen/ with @oaknational/logger.
- Created `create-codegen-logger.ts` factory in code-generation/ (7 entry points).
- vocab-gen/run-vocab-gen.ts creates its own logger inline (single file, different dir).
- Added @oaknational/logger as devDependency in sdk-codegen package.json.
- Updated zodgen e2e test + unit test + integration test to pass logger argument.
- Ran `pnpm lint` — found 43 MORE errors in two other workspaces:
  - oak-curriculum-mcp-stdio: 8 errors, 3 files
  - search-cli: 35 errors, 11 files
- Updated plan to cover full monorepo scope (Phase 3 added for remaining work).

### Mistake: assumed work was confined to one workspace
The plan was scoped to sdk-codegen only. The user correctly pointed out that
no-console violations exist across the entire codebase. Always run `pnpm lint`
(not workspace-scoped lint) to find ALL violations. Quality gate issues are
blocking regardless of location.

### Review findings and fixes
- Mid-point code review: error objects must be preserved in catch blocks — fixed
  all catch handlers to pass error as 2nd arg to logger.error().
- Barney caught: zodgen-core.ts unit/integration tests still passed fakeIO as 3rd
  arg after logger was inserted as 3rd param. Would have caused runtime type error
  at test time. Fixed immediately.
- Code reviewer: verify-docs.ts guard function was inconsistent with rest of
  changeset (not passing err to logger.error). Fixed.
- Cleaned up vocab-gen printHeader to not emit empty-string log lines (structured
  logger generates full JSON envelope for each call).
- Added error logging to run-typedoc.ts child.on('error') handler (was swallowed).

### Patterns to remember
- When inserting a required parameter before an existing optional parameter, ALL
  callers must be updated — including test files that may not be in the target
  directory. Always grep for the function name across the entire workspace.
- Logger.error(message, error?, context?) — 2nd arg is for Error objects (stack
  trace extraction), NOT for plain strings. Use context or inline in message for
  string error details.
- Empty-string log messages (`logger.info('')`) are wasteful with structured loggers
  — each generates a full JSON envelope. Combine or remove.
- **Always run monorepo-wide `pnpm lint`, not workspace-scoped, to find all
  violations.** Quality gates are blocking regardless of workspace.

## Session 2026-03-03d — Implementation plan for codegen logger replacement

### What was done
- Traced all console.* call chains in code-generation/ and vocab-gen/ to build
  a detailed implementation plan for the codegen-logger-replacement plan.
- Original inventory was ~35 calls across ~10 files; actual is 49 calls across
  12 files. Five files were missed: zodgen-core.ts (3), bulkgen.ts (2),
  generate-ai-doc.ts (1), run-typedoc.ts (2), generate-widget-constants.ts (1).
- Updated plan with: exact inventory table, call chain map, logger decision per
  file, 6 ordered implementation tasks (1.0–1.5) grouped by call chain, updated
  risk assessment, expanded references.
- Phase 0 marked complete (inventory verified, call chains traced, approach decided).
- No existing logger instances anywhere in the chain — all 8 entry points need
  new instances, 4 callees receive logger via DI.

### Key decisions
- Shared factory `createCodegenLogger(toolName)` in code-generation/ for the 7
  code-generation entry points. Avoids repeating 5 import + 6 constructor lines
  in each file.
- vocab-gen creates its own logger inline (single file, not worth cross-directory
  import).
- @oaknational/logger goes in devDependencies (build-time scripts, not SDK output).
- Logger interface: `Logger` from `@oaknational/logger`, with `info`, `error`,
  `warn` methods. `UnifiedLogger` constructor needs `minSeverity`,
  `resourceAttributes`, `context`, `stdoutSink`, `fileSink`.

### Patterns to remember
- Logger type is `import type { Logger } from '@oaknational/logger'` — use for
  DI parameter typing in callees.
- `parseLogLevel(env, 'INFO')` provides safe default when LOG_LEVEL unset.
- No vi.spyOn(console) anywhere in sdk-codegen tests — only zodgen.e2e.test.ts
  calls generateZodSchemas directly and needs signature update.
- String-literal console references (in template strings, JSDoc @example) are NOT
  flagged by ESLint no-console — only AST CallExpression nodes.

## Session 2026-03-03c — Plan creation for no-console and ESLint overrides

### What was done
- Created `codegen-logger-replacement.plan.md` in `.agent/plans/developer-experience/`
  from the Cursor plan `.cursor/plans/no-console_eslint_enforcement_d15f0835.plan.md`.
  Covers replacing ~35 console calls in code-generation/ and vocab-gen/ with
  @oaknational/logger instances.
- Updated `eslint-override-removal.plan.md` to reflect current state:
  - Added Session Update (2026-03-03) context
  - Added Category A2 for vocab-gen file-specific structural overrides (3 rules, 6 files)
  - Added Phase 0 (logger replacement) as prerequisite for Phases 1/1b
  - Added Phase 1b for vocab-gen structural overrides
  - Updated "Other workspaces" inventory with current streamable-http, search-cli,
    logger, and root eslint config overrides
  - Added search-cli ground-truths/generation structural overrides
  - Added search-cli `testRules` type cast (eslint-disable comment) as an override
  - Added section documenting legitimate no-console overrides (not targeted for removal)
  - Cross-referenced the new codegen-logger-replacement plan
  - Updated todos, success criteria, and dependencies

### Patterns to remember
- The developer-experience plan directory has no lifecycle subdirectories (active/,
  current/, future/) — plans sit at the top level alongside archive/.
- The eslint-override-removal plan is strategic (Phase 0–4) while the
  codegen-logger-replacement plan is tactical (blocking quality gates now).

## Session 2026-03-03b — no-console ESLint enforcement

### What was done
- Promoted `no-console` from `'warn'` to `'error'` in shared ESLint config
  (`packages/core/oak-eslint/src/configs/recommended.ts` line 89).
- Added scoped `no-console: 'off'` overrides in 7 eslint configs:
  root, sdk-codegen (code-generation/, vocab-gen/, e2e-tests/),
  HTTP app (scripts/, smoke-tests/), STDIO app (bin/, entry points, fallback files),
  search CLI (scripts/, bin/, smoke-tests/, CLI output helpers, logger fallback),
  logger (file-sink.ts).
- Replaced console calls with logger in HTTP app `src/index.ts` (pre-logger
  uses `process.stderr.write`, post-logger uses `bootstrapLog`).
- Removed `console.warn` from SDK `request-validators.ts` — redundant with
  returned `ValidationResult`.
- Removed `logValidationFailure` from SDK `curriculum-response-validators.ts` —
  SDK should not own logging (distilled.md). Validation failures carry trace info;
  app layer is responsible for observability.
- Removed debug `console.log` from 3 test files (handlers.integration.test.ts,
  response-validation.integration.test.ts, aggregated-tool-widget.unit.test.ts).
- All 60 quality gates pass.

### Mistake: misclassifying codegen as non-product-code
I added `no-console: 'off'` overrides for `code-generation/` and `vocab-gen/`
in the sdk-codegen workspace, treating them as "build scripts". The user
corrected this: these directories contain the code that **builds the SDK** —
they are product code and should use a logger, not console overrides. The user
removed the overrides. Remaining work: replace ~35 console calls in these
directories with a build-time logger.

### Patterns to remember
- `console.error(...)` inside JS template literal strings (e.g.
  `widget-cta/js-generator.ts`) is NOT flagged by ESLint's `no-console` —
  only AST CallExpression nodes are detected.
- JSDoc `@example` blocks containing `console.log` are NOT flagged either.
- search-cli had 3 additional files needing overrides beyond the plan: `cli.ts`,
  `ingest-cli-program.ts`, and `logger.ts` (fallback console in src/lib/).
- Removing debug `console.log` from tests may leave unused variables (e.g.
  `backticks` in widget test) — always check for orphaned declarations.
- **Code that generates code is product code.** Do not classify codegen
  directories as "build scripts" deserving blanket ESLint overrides. They
  need the same quality standards as any other product code.

## Session 2026-03-03a — Milestone restructuring and repo public

### What was done
- Located the MCP HTTP app front page implementation (TypeScript, not
  standalone HTML).
- Updated landing page title from "Internal Alpha" to "Invite Only
  Public Alpha".
- Restructured all milestones after user confirmed:
  - Repo is now public at `curriculum-mcp-alpha.oaknational.dev`
  - Access control is Option E (Oak emails + explicit allowlist on dev
    Clerk instance) — production Clerk deferred to M2
  - M0: Open Private Alpha — marked COMPLETE
  - M1: Invite-Only Alpha — now ACTIVE (dev Clerk + allowlist)
  - M2: renamed from "Extension Surfaces" to "Open Public Alpha"
    (prod Clerk, social providers, public sign-up, edge rate limiting)
  - M3: renamed from "Tech Debt & Hardening" to "Public Beta"
    (operational hardening, extension surfaces, observability, tech debt)
- Updated M0, M1, M2, M3 milestone files, milestones README, and
  high-level plan.

### Key decisions
- Production Clerk is deferred to M2 (Open Public Alpha) because the
  dev Clerk allowlist is sufficient for invite-only access and adding
  users via the Clerk Dashboard UI is straightforward.
- Operational gates (monitoring, alerting, incident response, canonical
  host enforcement) pushed to M3 (Public Beta). Only edge rate limiting
  on OAuth proxy endpoints kept for M2 — unauthenticated endpoints need
  protection before public sign-up.
- Extension surfaces (MCP-app extension, OpenAPI app extension) moved
  from M2 to M3 (Public Beta).

### Patterns to remember
- Landing page HTML is composed in TypeScript under
  `apps/oak-curriculum-mcp-streamable-http/src/landing-page/` and served
  from the root route `/`.
- Milestone files live at `.agent/milestones/m{n}-*.md` but the filenames
  do not always match the milestone name after renames (e.g.
  `m2-extension-surfaces.md` now contains "Open Public Alpha"). This is
  acceptable — the file is the canonical content, not the filename.
- GitHub App ("Oak Release Bot") + `actions/create-github-app-token@v1`
  is the pattern for semantic-release pushing to protected branches.
  Secrets: `RELEASE_APP_ID` and `RELEASE_APP_PRIVATE_KEY`. The app is
  added as a bypass actor in the `main` branch ruleset. Confirmed
  working 2026-03-03.
- `persist-credentials: false` on `actions/checkout` is essential when
  using a custom token — otherwise git uses the default `GITHUB_TOKEN`
  which cannot bypass branch protection.
- Rate limiting for unauthenticated OAuth proxy endpoints will be done
  in Cloudflare (traffic control layer), not in application code.

## Session 2026-03-02m — Consolidate and archive release artefacts

### What changed
User confirmed release completion and requested `/jc-consolidate-docs` for:
- `release-plan-m1.plan.md`
- `session-continuation.prompt.md`

Both files were archived. Durable release-governance content was extracted from
the release plan into permanent engineering documentation:
- `docs/engineering/milestone-release-runbook.md` (new)

### Permanent documentation extraction
The extracted runbook captures settled, reusable structure:
- release control model (R0-R5)
- mandatory gate template (G1-G8)
- snagging protocol and severity model (P0-P3)
- go/no-go inputs and decision record template
- controlled rollout and rollback controls
- exit-criteria template

### Cross-reference repairs
Updated active docs to point at archived release artefacts:
- milestones docs
- high-level plan
- codegen architecture docs
- post-merge tidy-up plan
- completed-plans index

### Caution
Archive docs are historical. When archiving files, fix references from active
docs, but avoid rewriting older archive narratives unless needed to prevent
broken links in the newly archived artefact.

## Session 2026-03-02l — Strategic plan restructuring

### What changed
Semantic search branch merged. User restructured milestone sequence:
- M0 (Open Private Alpha): COMPLETE — branch merged, repo ready to go public
- M1: renamed from "Open Public Alpha" to "Invite-Only Alpha" — production
  Clerk with Oak emails + explicit invites, Sentry NOT required
- M2: "Extension Surfaces" — MCP-app extension first, then OpenAPI app
  extension in addition (was previously part of old M2 "Post-Alpha Enhancements")
- M3: "Tech Debt & Hardening" — absorbs old M2 (enforcement, guards) and
  old M3 (mutation testing, observability, supply chain)

### Files updated
- `high-level-plan.md` — full milestone rewrite
- `release-plan-m1.plan.md` — M1 redefined, M0 marked complete, gates updated
- `merge-readiness.plan.md` — archived to `sdk-and-mcp-enhancements/archive/completed/`
- `completed-plans.md` — merge-readiness entry added
- `sdk-and-mcp-enhancements/active/README.md` — removed merge-readiness reference

### Key distinction: invite-only vs public alpha
The invite-only alpha has the same functional requirements as the old public
alpha EXCEPT: (1) access is restricted to Oak emails + explicit Clerk invites
instead of anyone with an email, and (2) Sentry does not need to be fully
configured. The production Clerk migration IS required.

### Extension surfaces sequence
User was explicit about order: MCP-app extension FIRST (native MCP for
Claude etc.), THEN OpenAPI app extension IN ADDITION (not replacing). This
is a shift from the previous plan which had the extension work as one stream
in a broader "post-alpha enhancements" milestone.

## Session 2026-03-02j — Release workflow fix

### Root cause: release workflow never worked
The `release.yml` workflow has failed on every single run since creation (~20+
runs). Root cause: `pnpm -C packages/sdks/oak-curriculum-sdk build` bypasses
Turborepo entirely, building only the SDK without its workspace dependencies.
The `tsup` step succeeds (esbuild resolves source files directly) but
`tsc --emitDeclarationOnly` fails because `.d.ts` files from dependencies
(`sdk-codegen`, `result`, `logger`, `type-helpers`) don't exist yet.

### Fix applied
- Changed to `pnpm build` — builds entire repo via Turbo in dependency order,
  consistent with CI workflow and with repo-level versioning
- Added `TURBO_TOKEN`/`TURBO_TEAM` env vars for remote cache (CI already had
  these; both workflows trigger on push to main)

### Pattern: never bypass Turborepo in CI
`pnpm -C <path> <script>` runs a script directly in one workspace, skipping
Turbo's `dependsOn` graph. In a monorepo where packages depend on each other's
build artefacts, always use `pnpm turbo <task>` (optionally with `--filter`)
to ensure the dependency graph is respected.

## Session 2026-03-02g — Consolidation

### Distillation performed
Archived `napkin-2026-03-02.md` (943 lines, sessions 2026-02-28 through
2026-03-02). Extracted 10 new entries to distilled.md:
- Barrel export requirement (runtime `undefined` from missing exports)
- `pnpm vocab-gen` vs `pnpm sdk-codegen` distinction
- 23 generated vs 7 aggregated MCP tools (always distinguish)
- Zod `.passthrough()` → `.loose()` deprecation
- Typed call arrays beat `vi.fn().mock.calls`
- SDK should not own logging (app layer observability)
- Simplify ruthlessly when blocking a merge
- Read MCP tool descriptors before calling

distilled.md: 158 → ~175 lines (ceiling 200).

### Fitness function status
| Document | Lines | Ceiling | Status |
|---|---|---|---|
| AGENT.md | 165 | 200 | OK (83%) |
| rules.md | 134 | 200 | OK (67%) |
| testing-strategy.md | 393 | 400 | Near (98%) |
| schema-first-execution.md | 39 | 100 | OK (39%) |
| typescript-practice.md | 113 | 150 | OK (75%) |
| development-practice.md | 108 | 150 | OK (72%) |
| troubleshooting.md | 162 | 200 | OK (81%) |
| CONTRIBUTING.md | 401 | 400 | Over (100%) |
| distilled.md | ~175 | 200 | OK (88%) |
| practice.md | 216 | 250 | OK (86%) |
| practice-lineage.md | 321 | 320 | Over (100%) |
| practice-bootstrap.md | 391 | 400 | Near (98%) |

Persistent ceilings: CONTRIBUTING.md (401/400, 1 over) and
practice-lineage.md (321/320, 1 over). Both noted in prior sessions.
practice-bootstrap.md grew with the practice-index template addition.

## Session 2026-03-02k — Test isolation investigation

### Correlation middleware transient failure
`correlation/middleware.integration.test.ts` test #3 ("includes X-Correlation-ID
in response headers") failed in the full suite but passes in isolation and on
re-run. Root cause: vitest.config.ts for unit/integration tests uses default
thread pool without `isolate: true`. Intermittent, not reproducible.

### Orphaned E2E test at src/index.e2e.test.ts
`src/index.e2e.test.ts` is excluded from BOTH vitest configs:
- `vitest.config.ts` excludes `src/**/*.e2e.test.ts`
- `vitest.e2e.config.ts` only includes `e2e-tests/**/*.e2e.test.ts`
Never ran in CI or `pnpm test`. My earlier claim it was "pre-existing failure"
was wrong — it was never part of the suite. File calls `createApp()` which
could attempt network IO — should not exist in `src/` as an E2E test.

### Mistake: diagnosing without evidence
I claimed a test was "pre-existing on the base branch" without properly verifying
it was actually part of the test suite. Should have checked vitest config
include/exclude patterns FIRST.

### Test audit findings (applied)
- Orphaned test at wrong location (`src/index.e2e.test.ts`) was excluded from
  both vitest configs — dead code providing false confidence
- 10 header-redaction tests in middleware integration test duplicated 53 unit
  tests at the wrong level — collapsed to 1 proving integration only
- 5 logging-shape tests inspecting `mock.calls` with silent `if` guards were
  testing implementation (log format) not behaviour (HTTP response). Silent
  conditional assertions (`if (call?.[1])`) can pass while proving nothing
- Type-only test violated "Do not test types"
- Nested vitest asymmetric matchers (`expect.objectContaining` with inner
  `expect.stringMatching`) trigger `no-unsafe-assignment` — restructure to
  explicit type guards on captured call arguments
- `slowRequestThresholdMs` now injectable to eliminate 2.1s real delay in tests

## Session 2026-03-02i — Context hint audit

### Investigation: do aggregated tool responses hint at get-curriculum-model?
Traced the full hint propagation chain. Five reinforcing layers exist:
1. Tool descriptions (tools/list) — all aggregated tools reference get-curriculum-model
2. Tool responses (structuredContent.oakContextHint) — via formatToolResponse default
3. Server instructions (MCP initialize) — SERVER_INSTRUCTIONS mentions it
4. Generated tool descriptions — PREREQUISITE text
5. Generated tool responses — conditional on requiresDomainContext

Key finding: hints all reference the **tool** (get-curriculum-model), not the
**resource** (curriculum://model). The resource exists as dual exposure but
is not referenced in any hint text.

### ChatGPT doesn't support Resources or Prompts
ChatGPT supports: Tools, DCR, Apps. NOT Resources, NOT Prompts.
- curriculum://model resource (priority 1.0, audience assistant) is invisible to ChatGPT
- All 4 MCP prompts are invisible to ChatGPT
- Claude Desktop/Claude.ai support both

### Widget-side levers rejected
Widget is created per tool call (many times), not once per session. So
widget-initiated callTool or ui/update-model-context on load would fire
repeatedly and be wasteful/noisy. Widget-side levers need session-level
gating to be viable.

### outputSchema gap
MCP SDK 1.27.0 supports outputSchema (type: "object" only) but ZERO tools
in the codebase use it. Created future plan at
`.agent/plans/sdk-and-mcp-enhancements/future/output-schemas-for-mcp-tools.plan.md`.
SDK restriction to `type: "object"` is a known issue (modelcontextprotocol#1906).

### Strengthened oakContextHint wording
Changed from passive "For optimal results..." to directive "If you have not
called get-curriculum-model yet, do so before your next tool call..." —
model reads structuredContent verbatim per OpenAI Apps SDK reference.

## Session 2026-03-02h — Post-dedup consolidation

### What happened
Updated codegen architecture plans (README, analysis, decomposition,
reviewer findings) to reflect the M1 graph data dedup work. Updated
release plan current state and top priorities — ESLint OOM is done,
remaining gates are next. Updated session-continuation prompt title and
content. Deleted three completed cursor plans (onboarding fixes, MCP
prompts cleanup, graph dedup OOM) after verifying no documentation
needed extraction — all permanent docs were created during
implementation.

### Plan deletion assessment
All three plans were pure execution instructions. The onboarding plan's
eslint-disable audit (P2-9) is a point-in-time snapshot, not permanent
docs. The MCP prompts plan already created ADR-123 and updated READMEs
in Phase 4. The graph dedup plan's architecture is captured in the
codegen architecture plans.

### Fitness function status (unchanged)
Same as session 2026-03-02g. CONTRIBUTING.md (401/400) and
practice-lineage.md (321/320) remain 1 over ceiling. distilled.md at
176/200.

## Session 2026-03-03b — Codegen logger replacement Phase 3

### Mistake: wrote unit tests with vi.mock and incomplete Logger mock
Created `file-reporter.unit.test.ts` using `vi.mock('node:fs')` — directly
violates ADR-078. Also created `startup.unit.test.ts` with a `loggerMock`
that only had `info`/`error` — `Logger` interface requires 6 methods.
Both files were also misnamed as `.unit.test.ts` when they test IO
integration points.

**Lesson**: Before writing ANY test, check:
1. Is the function under test pure? If no → integration test, not unit.
2. Does the test need `vi.mock`? If yes → refactor product code for DI.
3. Does the mock satisfy the FULL interface? Use `satisfies Type` to verify.

### Pattern: createLoggerMock with satisfies
```typescript
function createLoggerMock() {
  return {
    trace: vi.fn(), debug: vi.fn(), info: vi.fn(),
    warn: vi.fn(), error: vi.fn(), fatal: vi.fn(),
  } satisfies Logger;
}
```
This catches missing methods at compile time.

### Pattern: DI for IO functions
`appendToLogFile` needed `AppendToLogFileDeps` interface with
production defaults — same pattern as `StartupLoggerDependencies`.
Default param keeps production callers clean, tests inject fakes.

### Error chain preservation
- `logger.error(msg, error)` — pass `error` directly, even for unknown.
  Logger.error accepts `unknown` as 2nd param. Don't filter with
  `error instanceof Error ? error : undefined` — that discards info.
- `new Error(String(error))` — always add `{ cause: error }` to preserve
  the original thrown value in the cause chain.

### Don't double-timestamp structured logger messages
When writing to both a structured logger AND a plain-text file, keep
them separate: pass raw `message` to logger (it adds its own timestamp),
pass manually-timestamped `fileLogLine` to file write only.

### Pre-config errors go to stderr, not logger
Before RuntimeConfig is validated, no logger is available (or the logger
may route to stdout). Always use `process.stderr.write` for pre-config
failures — consistent across oaksearch.ts, cli.ts, ingest.ts.

### Phase 3.2 approach: process.stdout.write for CLI output
For CLI user-facing output functions, using `process.stdout.write` /
`process.stderr.write` is cleaner than wrapping in a structured logger.
Preserves exact behavior, no JSON/timestamp added to terminal output.
