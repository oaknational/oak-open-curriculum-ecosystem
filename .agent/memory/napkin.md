# Napkin

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
