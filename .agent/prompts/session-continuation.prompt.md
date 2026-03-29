---
prompt_id: session-continuation
title: "Session Continuation"
type: workflow
status: active
last_updated: 2026-03-29
---

# Session Continuation

## Ground First

1. Read `.agent/directives/AGENT.md` and `.agent/directives/principles.md`
2. Read this prompt fully before acting
3. Read the active plan: `.agent/plans/architecture-and-infrastructure/active/ci-consolidation-and-gate-parity.plan.md`

## Next Session Priorities (in order)

### 1. Commit and push the completed CI consolidation slice

Phases 4 and 5 are now implemented locally as one coherent CI change.

**Reporter implemented (TDD)**:

- `scripts/ci-turbo-report.mjs`
- `scripts/ci-turbo-report.unit.test.ts`
- `scripts/ci-turbo-report.integration.test.ts`

The reporter:

- accepts an optional summary path or discovers the latest `.turbo/runs/*.json`
- parses Turbo output into a typed internal shape
- counts pass/fail from `tasks[].execution.exitCode`, not top-level
  `execution.success`
- writes markdown to stdout and GitHub annotations to stderr
- tolerates missing `logFile` entries in task records

**Workflow implemented** in `.github/workflows/ci.yml`:

- non-Turbo checks stay as separate steps
- `pnpm exec playwright install --with-deps chromium` runs before any
  possible `test:ui`
- Turbo gates run in one batch via:
  `pnpm exec turbo run build type-check lint test test:e2e test:ui smoke:dev:stub --summarize --log-order=grouped --continue`
- final reporter step uses `if: always()` and appends to
  `$GITHUB_STEP_SUMMARY`

**Local verification already green (2026-03-29)**:

- `pnpm format-check:root`
- `pnpm markdownlint-check:root`
- `pnpm subagents:check`
- `pnpm portability:check`
- `pnpm test:root-scripts`
- `pnpm exec vitest run --config vitest.config.ts scripts/ci-turbo-report.unit.test.ts scripts/ci-turbo-report.integration.test.ts`
- `pnpm exec turbo run type-check lint test test:ui test:e2e smoke:dev:stub --continue --summarize --log-order=grouped`

Working tree now includes:

- `.github/workflows/ci.yml`
- `scripts/ci-turbo-report.mjs`
- `scripts/ci-turbo-report.unit.test.ts`
- `scripts/ci-turbo-report.integration.test.ts`
- this prompt
- the active CI plan

Create **one complete CI commit** from this slice, push it, then verify
GitHub CI on the PR.

### 2. Phase 3: eslint-disable remediation (~87 directives)

Active plan: `.agent/plans/architecture-and-infrastructure/active/ci-consolidation-and-gate-parity.plan.md`
— has the categorised inventory with approved remediation strategies.
Also address the plan's "Known Issues from Code Review" section.

Resume Phase 3 in this exact order:

1. Collapse `packages/sdks/oak-sdk-codegen/vocab-gen/generators/` into
   the bulk pipeline first.
2. Remove generator emitters that write `eslint-disable` into generated
   files before regenerating outputs.
3. Define one shared generated-data contract:
   `data.json` + `types.ts` + `index.ts`.
4. Reimplement the prerequisite-graph loader TDD-first, using
   `stash@{0}` as reference only.
5. Roll the same JSON + typed loader pattern across the remaining large
   generated datasets.
6. Move logger remediation ahead of broad fake cleanup.
7. Clean easy DI fake cases first, then extract a narrow
   `McpToolRegistrar` interface in streamable-http and remove the
   related config override.

**Then scale the JSON data pattern** — proof of concept for prerequisite
graph is stashed (`git stash list` — index 0 at time of writing:
"WIP: prerequisite graph JSON proof of concept"). The pattern:
generators produce `.json` data + `types.ts` interfaces + `index.ts`
typed loader. JSON imports type-check against explicit interfaces
without assertions (validated). Apply to all large generated data files
(vocabulary-graph 107K, misconception-graph 103K, nc-coverage 52K,
prerequisite-graph 18K, thread-progression 1.5K).

JSON loader edge cases to handle:

- `readonly` arrays in `types.ts` are advisory — JSON import produces
  mutable arrays. If immutability is a correctness requirement, use
  `Object.freeze` on the loaded data.
- Literal-typed fields (e.g. `'prerequisiteFor'`) cannot be used in
  interfaces backed by JSON imports — use `string` instead.
- `types.ts` and the generator's runtime output must stay structurally
  in sync. Add a `satisfies` check in generator tests to catch drift.

**Then tackle the other categories** (each has test obligations — update
or write tests FIRST before changing product code):

- Logger: replace custom `json-sanitisation.ts` (292 lines, WeakSet,
  Object.entries) with off-the-shelf stringify library + replacer.
  Verify library signature is `(value: unknown) => string`, not `any`.
  Error normalisation: accept `unknown`, narrow internally.
  Existing logger tests anchor the RED phase.
- Test fakes: narrow interfaces via DI (ADR-078). Specific files:
  - `apps/oak-curriculum-mcp-stdio/src/test-helpers/fakes.ts` (3 casts)
    — define `MinimalOakApiClient`, `MinimalMcpServer` (or
    `McpToolRegistrar` for the `registerTool` overload problem)
  - `packages/libs/logger/src/test-helpers/fakes.ts` (3 casts)
    — define `MinimalRequest`, `MinimalResponse`
  - `packages/sdks/oak-curriculum-sdk/src/test-helpers/fakes.ts` (1 cast)
    — define minimal path-based client interface
  - `apps/oak-curriculum-mcp-streamable-http/eslint.config.ts` override
    — chosen path: extract `McpToolRegistrar` narrow interface and
    remove the override, not keep it as the end state
- Authored code: extract functions, split modules for max-lines/complexity.
- Miscellaneous: `typeSafeEntries` for Object.\* (safe for closed types;
  note: index-signature types widen literal keys), wrap async for
  no-misused-promises, narrow types for no-restricted-types.
- Promote `no-eslint-disable` from `warn` to `error` when count hits zero.
- Also: `scripts/check-blocked-patterns.unit.test.ts` has IO-touching
  tests misclassified as unit tests — split to integration test file.

### 3. Phase 6: Documentation

Update ADR-065, build-system.md quality gate surface table,
testing-strategy.md (Playwright naming, test deletion criteria),
principles.md (ESLint enforcement mechanism). Invoke `docs-adr-reviewer`.

### 4. MCP App work continues

WS3 (widget client migration) is unblocked but deferred behind the CI
commit and the next eslint-remediation slice. Widget Playwright tests
and renderer integration tests were deleted (2026-03-29) as dead code.
New tests will be written TDD against the replacement widget. For MCP
spec research, start with the MCP migration plan's "First Action"
section after the higher-priority work is complete.

---

## Branch State

Branch: `feat/mcp_app` at commit `88617d15`.
Uncommitted:

- `.github/workflows/ci.yml`
- `scripts/ci-turbo-report.mjs`
- `scripts/ci-turbo-report.unit.test.ts`
- `scripts/ci-turbo-report.integration.test.ts`
- `.agent/prompts/session-continuation.prompt.md`
- `.agent/plans/architecture-and-infrastructure/active/ci-consolidation-and-gate-parity.plan.md`

Stash 0: prerequisite graph JSON proof of concept.
Treat it as **reference only**. Do not apply it wholesale.

## Known Issues

- CI lint/local lint parity issue (PR #70) should be resolved by the CI
  consolidation. Local full-batch verification is green; confirm after
  pushing. If CI still fails, investigate turbo cache and ESLint
  resolution differences rather than changing product code first.

## Work Stream Status

- **WS1** (ADR + codegen contract): **complete** (2026-03-26)
- **WS2** (app runtime migration): **complete** (2026-03-26)
- **Runtime boundary simplification**: **ALL PHASES COMPLETE** (2026-03-28)
- **WS3** (widget client + branding): **deferred** until the CI commit and
  the next eslint-remediation slice are complete
- **WS4** (search UI for humans): **blocked by** WS3
- **Output schemas**: `.agent/plans/sdk-and-mcp-enhancements/current/output-schemas-for-mcp-tools.plan.md`

## Key Decisions (Settled)

- **Hard cutover, no compatibility layers**
- **No type aliases** — use SDK types directly
- **React for all UI** — `@modelcontextprotocol/ext-apps/react` hooks
- **ext-apps SDK v1.3.2**
- **eslint-disable is BANNED** — `@oaknational/no-eslint-disable` rule
  enforces at `warn` (promotes to `error` after remediation)
- **CI path** — one complete CI commit, not an intermediate partial
  workflow commit
- **Generated data → JSON + typed loader** — not TypeScript chunk splitting
- **Vocab-gen → bulk pipeline** — consolidate before scaling
- **Stash usage** — reference only, then reimplement TDD-first
- **Streamable HTTP test seam** — extract a narrow `McpToolRegistrar`
  interface rather than keeping the config override
- **CI gate source of truth for this pass** — workflow-local gates, not
  a new root `ci:check` script

## Rules

- TDD at all levels — write tests FIRST
- Schema-first — types flow from OpenAPI via `pnpm sdk-codegen`
- No compatibility layers — delete the old, do not wrap it
- No `as`, `any`, `!`, `Record<string, unknown>` — validate at boundaries
- ALL reviewer findings are blocking — no exceptions
- NEVER disable any checks — EVER, for ANY reason
- Invoke code-reviewer + specialists after each piece of work
- Use off-the-shelf libraries, not custom plumbing

## Key References

### CI and eslint-disable

- Active CI plan: `.agent/plans/architecture-and-infrastructure/active/ci-consolidation-and-gate-parity.plan.md`
- Quality gate hardening (future): `.agent/plans/architecture-and-infrastructure/future/quality-gate-hardening.plan.md`
- CI workflow: `.github/workflows/ci.yml`
- no-eslint-disable rule: `packages/core/oak-eslint/src/rules/no-eslint-disable.ts`
- no-eslint-disable tests: `packages/core/oak-eslint/src/rules/no-eslint-disable.unit.test.ts`
- ESLint recommended config (rule severity): `packages/core/oak-eslint/src/configs/recommended.ts`
- Content hook + tests: `scripts/check-blocked-content.mjs`, `scripts/check-blocked-content.unit.test.ts`, `scripts/check-blocked-content.integration.test.ts`
- Pattern hook (note: IO tests need splitting to integration file): `scripts/check-blocked-patterns.unit.test.ts`
- Hook policy: `.agent/hooks/policy.json`

### MCP App

- MCP migration plan: `.agent/plans/sdk-and-mcp-enhancements/active/mcp-app-extension-migration.plan.md`
- ADR-141: `docs/architecture/architectural-decisions/141-mcp-apps-standard-primary.md`
- MCP Apps spec: <https://modelcontextprotocol.io/extensions/apps/overview>

## Quality Gates

Full verification: `pnpm check` (includes clean, build, all gates).
Read-only check: `pnpm qg` (no build, no auto-fix).
Auto-fix: `pnpm fix` (format, markdownlint, lint:fix).
