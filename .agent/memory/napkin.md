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
