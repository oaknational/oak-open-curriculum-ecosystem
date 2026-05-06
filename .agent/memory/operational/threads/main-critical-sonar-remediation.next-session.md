# main-critical-sonar-remediation Next Session

## Thread Identity

Thread: `main-critical-sonar-remediation`  
Branch: `fix/sonar-fixes-20260506`  
Primary plan:
[`main-critical-sonar-rebuild-from-updated-main.plan.md`](../../../plans/architecture-and-infrastructure/current/main-critical-sonar-rebuild-from-updated-main.plan.md)

## Participating Agent Identities

| platform | model | session_id_prefix | agent_name | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| codex | GPT-5 | 019dfd | Silvered Masking Owl | executor | 2026-05-06 | 2026-05-06 |
| codex | GPT-5 | 019dfd | Moonless Vanishing Lantern | evaluator | 2026-05-06 | 2026-05-06 |
| codex | GPT-5 | 019dfd | Ethereal Ascending Twilight | executor | 2026-05-06 | 2026-05-06 |

## Landing Target For Next Session

Target: `continue remote Sonar closure` — local `pnpm check` is green after the
generated MCP executor recovery. Continue from the refreshed plan and current
Sonar evidence without reopening the generated-file exclusion decision.

## Lane State

**Owning plan**:
`.agent/plans/architecture-and-infrastructure/current/main-critical-sonar-rebuild-from-updated-main.plan.md`

**Current objective**: rebuild Sonar remediation from updated main and make
main's current Quality Gate blockers green on the branch.

**Current state**:

- Phase 0 evidence and plan are staged as the first branch artefact.
- Targeted SonarJS detectors are enabled in `packages/core/oak-eslint`, with a
  strict config test for the exact four-rule set.
- Comparator and void-use remediation work has been applied across several
  workspaces.
- Multiple targeted tests had passed before the stop point, including
  `oak-eslint` strict config tests, widget tests, and sdk-codegen MCP schema
  tests.
- The attempted generated MCP executor generic invoker-map refactor has been
  replaced with generator-owned concrete per-tool invocation helpers plus
  literal switch delegation.
- The executor recovery preserved generated flat MCP argument validation and did
  not touch `ToolDescriptor`, `ToolClientForName`, `ToolArgsForName`, or adjacent
  core aliases.
- `pnpm --filter @oaknational/curriculum-sdk test`, `pnpm --filter
  @oaknational/sdk-codegen type-check`, `pnpm --filter @oaknational/sdk-codegen
  lint:fix`, `pnpm --filter @oaknational/sdk-codegen test`, and `pnpm depcruise`
  passed before the final aggregate gate.
- Full root `pnpm check` passed on 2026-05-06 after restarting from the top of
  the canonical sequence.

**Blockers / low-confidence areas**:

- The generated `runtime/execute.ts` cognitive-complexity finding was solved in
  the generator. Do not replace it with a generic invoker map or core type
  broadening.
- Generated files are still shipped code and must stay inside local and remote
  quality-gate scanning. Excluding generated files from Sonar or lint is not an
  acceptable remediation route.
- Security hotspot and duplication closure remain unstarted beyond Phase 0
  evidence.

**Next safe step**:

1. In a fresh session, inspect the current Sonar state and choose the next
   highest-impact remaining blocker from the refreshed remediation plan.
2. Keep generated files in local and remote gates; fix generators and source
   roots rather than excluding checked code.

**Promotion watchlist**:

- The session reinforced a practice lesson: once remediation enters core
  generated/type surfaces, stop at the first type-system resistance and reframe
  the problem before chasing errors outward.
- Owner correction reinforced that generated files remain first-class checked
  code; quality-gate exclusion is not a valid route to green.
