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
- **`WIDGET_URI` in auth/public-resources.ts is intentional**: Branch retained
  it per ADR-057 as a harmless no-op during WS3 interim. Reviewers who flag it
  should be told not to remove it.
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
