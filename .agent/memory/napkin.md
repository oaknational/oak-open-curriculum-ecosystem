## Session 2026-03-31 — Deep Merge Review & Remediation

### What Was Done

- Invoked 6 specialist reviewers (code, architecture×2, test, MCP, security)
  on the merged codebase. All confirmed merge is architecturally sound.
- Read all 52 auto-merged files line-by-line across 3 parallel agents.
- Fixed 6 findings: eslint-disable + type assertions, stale TSDoc, duplicate
  file, weak assertions, missing OAuth redaction keys, optional observability.
- Discovered 3 characterisation tests were dead — naming excluded them from
  vitest include pattern. Renamed and activated (8 new tests running).
- Updated integration test fake to handle async observability-wrapped handlers.

### Key Observations

- **Dead tests are worse than no tests**: `*.characterisation.test.ts` didn't
  match vitest's `*.unit.test.ts` / `*.integration.test.ts` include pattern.
  These "safety net" tests had NEVER run. When activated, one immediately
  caught a real assertion error (`toHaveBeenCalledOnce()` was wrong — the spy
  is called 8 times across tools, resources, and prompts). Always check the
  vitest config when adding new test file naming conventions.
- **`vi.fn()` (bare) satisfies any function type**: The `Mock<(...args: any) => any>`
  type from vitest is assignable to any function signature, avoiding the need
  for type assertions in test fakes. This is the cleanest pattern for recording
  servers in characterisation/integration tests.
- **`void` return trick for narrow interfaces**: A function returning
  `RegisteredResource` is assignable to a function returning `void` in
  TypeScript. Defining `ResourceRegistrar` with `void` return lets both
  `McpServer` and `vi.fn()` satisfy it without assertions.
- **Complementary branches merge cleanly**: The two branches (observability
  addition vs widget deletion) don't intersect at the behaviour level — only
  at the type/parameter level. This is why zero "semantically correct but
  behaviourally wrong" issues were found across 52 auto-merged files.

## Session 2026-03-31 — Merge Execution & OpenAI Remnant Cleanup

### What Was Done
- Executed `git merge --no-ff origin/main` bringing 3 commits: Sentry/OTel
  observability foundation, release 1.2.0, and release 1.3.0.
- Resolved 6 conflicts: 4 trivial doc conflicts, 1 semantic keystone
  (`register-resources.ts`), 1 mechanical (`pnpm-lock.yaml`).
- Removed all OpenAI-era remnants: `WIDGET_URI` from public resources,
  `deriveWidgetDomain`, `widgetDomain` field, renamed `WidgetResourceOptions`
  to `ResourceRegistrationOptions`.
- Updated 4 test files to reflect widget URI no longer being public.
- Invoked code-reviewer and test-reviewer; fixed stale TSDoc comment.
- All gates pass (559 unit/integration tests, 152/155 E2E tests — 3 expected
  RED specs for WS3 Phase 2-3).

### Key Observations
- **Pre-commit formatting catch**: `pnpm format:root` was needed for
  `handlers-mcp-span.characterisation.test.ts` — auto-merged content from
  main had inconsistent formatting. Always run `pnpm format:root` after merge.
- **Cascading test updates**: Removing `WIDGET_URI` from `PUBLIC_RESOURCE_URIS`
  required updating 4 test files (1 unit, 2 integration, 1 E2E) to flip
  expectations from "auth bypassed" to "auth required." Test changes outnumber
  production changes ~3:1 for this type of behavioural shift.
- **WS3 RED specs are E2E-only**: Confirmed the red specs only fail in the
  `test:e2e` suite, not during `pnpm check`'s in-process tests. This is by
  design — `*.e2e.test.ts` files don't block commits.
- **`register-json-resources.ts` remains inert**: Zero call sites, confirmed.
  Consolidation deferred to post-merge follow-up.
- **`displayHostname` is NOT widget-specific**: Used for static content routes
  and asset download URLs. Correctly retained when removing `deriveWidgetDomain`.

## Session 2026-03-31 — Second-Round Plan Review (7 reviewers, observability focus)

### What Was Done
- Invoked 7 specialist sub-agents on the merge plan with explicit observability
  completeness remit: MCP reviewer, security reviewer, 4 architecture reviewers
  (Barney, Betty, Fred, Wilma), and code reviewer.
- Addressed ~30 findings (including minor) across all reviewers.
- Consolidated post-merge follow-ups into structured categories.

### Key Observations
- **5/7 reviewer convergence on `register-json-resources.ts`**: Barney, Betty,
  Fred, Wilma, and Code reviewer independently flagged the same duplicate file.
  Cross-reviewer volume at this level is a strong signal — promoted from "assess
  whether" to "consolidate — confirmed duplicate."
- **Security reviewer found pre-existing gaps in main**: OAuth form-encoded
  redaction and auth data in logs are pre-existing in main's observability code,
  not introduced by the merge. The merge plan correctly scopes them as post-merge
  follow-ups rather than merge blockers.
- **Fred's ADR-057 deviation framing**: Instead of "consider removing WIDGET_URI,"
  frame it as a conscious, documented deviation with a restoration deadline. This
  is more actionable than a vague "consider" and creates accountability.
- **Barney on Phase 8b**: Creating a new multi-platform complex-merge skill is
  overbuilt. The genuinely new learning is a small extension to existing guidance.
  Prefer updating existing docs over creating new abstractions.
- **"No low-risk files"**: User explicitly corrected the assumption that some
  auto-merged files are low-risk. All auto-merges need deep evaluation. Caution
  over speed, architectural excellence over expediency.

### User Directives (overriding reviewer recommendations)

- **Complex merge skill must be created**: User overrode Barney's recommendation
  to simplify Phase 8b. The skill wraps the full 7-phase merge workflow and is
  worth the investment even if merges don't recur frequently.
- **No OpenAI remnants survive the merge**: WIDGET_URI, deriveWidgetDomain,
  widgetDomain, WidgetResourceOptions name — all removed during the merge, not
  deferred. "No exceptions." This overrides the previous ADR-057 interim retention
  and the scope-creep deferral.
- **Secrets in logs are blocking**: OAuth form-encoded redaction gap and auth
  success handler PII are pre-existing in main but must be fixed before
  deployment. Promoted from follow-up to blocking pre-deployment gate.

## Session 2026-03-31 — Napkin rotation (distillation)

Archived `napkin-2026-03-31.md` covering sessions 2026-03-24 to 2026-03-31.

Key new insight not yet in distilled.md (distilled at ceiling):

- **RED specs belong in E2E, not unit tests**: The pre-commit hook runs
  `pnpm turbo run type-check lint test` (in-process only). E2E tests run
  separately via `pnpm test:e2e`. RED specs that specify future behaviour
  should be `*.e2e.test.ts` so they don't block commits during the RED phase.
- **Assert effects, not constants**: Test `WIDGET_TOOL_NAMES.size > 0` asserts
  a constant value. Test "at least one tool in tools/list has
  `_meta.ui.resourceUri`" asserts product behaviour through the protocol. The
  latter survives refactoring; the former is fragile and tests configuration.

## Session 2026-03-31 — WS3 Phase 1: Delete Legacy Widget Framework

**Completed**: Deleted 22 legacy files (14 source + 7 tests + 1 E2E), updated
3 files, fixed 4 reviewer findings. Renamed B3 Hybrid to
`preserve-schema-examples.ts` for semantic clarity.

Key observations:

- **Single coupling point deletion**: The entire legacy widget subgraph
  connected to the live system through one import in `register-resources.ts`.
  Severing that single import made 14 files instantly dead code. This is the
  payoff of narrow dependency chains.
- **Multi-reviewer convergence**: MCP, code, test, and architecture reviewers
  all found different facets of the same interim state. MCP reviewer confirmed
  protocol compliance; architecture reviewer wanted YAGNI cleanup of auth
  bypass; test reviewer found vacuous passes and process.env violation. Each
  perspective was valuable — no single reviewer caught everything.
- **Semantic naming > mechanism naming**: `overrideToolsListHandler` tells you
  HOW; `preserveSchemaExamplesInToolsList` tells you WHY. The latter makes the
  call site self-documenting and explains the module's removal condition.
- **Interim state requires explicit documentation**: When a resource is
  temporarily unregistered but its auth bypass entry persists, every affected
  file needs a comment explaining the gap and the restoration plan.
- **`preserve-schema-examples.ts` root cause and Zod 4 opportunity**: The
  pipeline is OpenAPI → Zod → JSON Schema. In Zod 3, `examples` had no
  representation and was lost. **Zod 4 fixes this**: `.meta({ examples })`
  attaches arbitrary metadata that `z.toJSONSchema()` preserves. The override
  could be eliminated if: (a) sdk-codegen attaches examples via `.meta()`, and
  (b) the MCP SDK's internal converter honours `.meta()`. Investigate both
  before Phase 3 `registerAppTool` adaptation.

## Session 2026-03-31 — Merge Planning (main → feat/mcp_app_ui)

### What Was Done
- Thorough pre-merge analysis following `docs/engineering/pre-merge-analysis.md`
  7-phase process. Produced a comprehensive merge plan with observability gap
  analysis, call-chain contract verification, and sub-agent plan review.
- Invoked 4 sub-agent reviewers (architecture-barney, architecture-wilma,
  mcp-reviewer, code-reviewer) on the plan before execution.
- Aborted a stale in-progress merge from earlier research to restore clean state.
- Plan moved from `.cursor/plans/` to canonical repo location.

### Patterns to Remember
- **"Take main as base, remove only" beats "take branch, add back"**: For the
  keystone conflict, starting from main's version and removing widget code
  preserves observability wrapping by default. The reverse (starting from branch
  and adding wrapping) risks accidentally omitting wrappers.
- **Characterisation tests are necessary but not sufficient**: `toHaveBeenCalled()`
  proves a spy was invoked at least once, not that every call site was wrapped.
  Always pair with the "preserve by default" approach above.
- **Async wrappers break sync test fakes**: `wrapResourceHandler` returns
  `async (...args) => Promise<T>`, but `register-resources.integration.test.ts`
  fake throws on Promise-returning callbacks. Do NOT add observability to that
  test without also upgrading the fake to async-aware.
- **`WIDGET_URI` was removed from auth/public-resources.ts**: Per user directive,
  no OpenAI-era remnants survive the merge. Tests updated to expect auth required
  for widget URIs. Phase 2-3 will re-add when fresh React MCP App is scaffolded.
- **`git merge --abort` wipes staged changes**: Any uncommitted staged files
  (the merge plan and session prompt were staged but not committed) are lost
  when aborting. Always commit planning artefacts before attempting a merge.
- **Sub-agent plan review before merge execution**: Having 4 specialist reviewers
  validate the merge plan caught 3 blocking issues (application.ts seam
  promotion, merge-state hygiene, async wrapper incompatibility) that would
  have caused problems during execution.
- **`register-json-resources.ts` exists on main**: New file that partially
  duplicates `register-resources.ts`. Do not wire it into keystone resolution —
  flag for post-merge tidy-up.
