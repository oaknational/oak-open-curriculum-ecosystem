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
| claude-code | claude-opus-4-7-1m | 228bc5 | Stormy Drifting Harbour | executor | 2026-05-06 | 2026-05-06 |

## Landing Target For Next Session

Target: `recover from incorrect PR-scoped turn, then fix main Sonar backlog` —
first remove the broken local generated MCP executor/generator experiment from
the working tree, then resume remediation against the project/main HIGH issues
and security hotspots. PR #97 Sonar is a regression guard, not the source of the
worklist.

## Lane State

**Owning plan**:
`.agent/plans/architecture-and-infrastructure/current/main-critical-sonar-rebuild-from-updated-main.plan.md`

**Current objective**: rebuild Sonar remediation from updated main and fix the
current project/main HIGH issues plus security hotspots on the branch. PR-scoped
Sonar is used only to verify the branch does not add regressions.

**Current state**:

- Branch `fix/sonar-fixes-20260506` has been pushed and draft PR #97 exists.
- Commits already pushed:
  - `457fa1f0 fix(sonar): remediate quality gate blockers`
  - `b903554b chore(collaboration): close commit window state`
- GitHub checks after the first push: tests passed; SonarCloud failed; Vercel
  and analysis checks passed; CodeQL skipped.
- The previous plan framing incorrectly treated PR-scoped Sonar findings as the
  primary remediation source. Owner corrected this as circular: a branch cannot
  be opened to fix its own Sonar findings because branch findings only exist
  after the branch introduces work.
- Correct backlog source is the project/main Sonar state: current project-wide
  HIGH issues and security hotspots.
- Corrective evidence gathered during the pause:
  - Project-wide open HIGH issues: 133.
  - Project-wide security hotspots: 154 total, 143 `TO_REVIEW`, 11 `REVIEWED`.
  - Since-leak/new-code hotspots: 18 total, 7 `TO_REVIEW`, 11 `REVIEWED`.
  - PR #97 open issues: 5; PR gate red on `new_violations`,
    `new_security_hotspots_reviewed`, and duplicated-lines density.
- Local working tree is dirty. The broken/unwanted experiment is the generated
  MCP executor/generator refactor in:
  - `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/generate-execute-file.ts`
  - `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/generate-execute-file.unit.test.ts`
  - `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/mcp-tool-generator.unit.test.ts`
  - `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/runtime/execute.ts`
- The local dirty set also includes smaller PR-issue fixes. Fresh session must
  inspect them separately and keep only changes that advance the project/main
  HIGH or hotspot backlog.

**Blockers / low-confidence areas**:

- The generated MCP executor refactor is broken local work and must be removed
  first. It was not committed or pushed.
- Generated files are still shipped code and must stay inside local and remote
  quality-gate scanning. Excluding generated files from Sonar or lint is not an
  acceptable remediation route.
- Do not change core MCP tool aliases or descriptor types without owner
  participation.
- Sonar issues are either fixed or marked false positive when genuinely false.
  They are never accepted as a pressure-release move.
- Security hotspots are fixed when unsafe, or marked `SAFE` only with exact
  site-specific rationale. `ACKNOWLEDGED` requires explicit owner acceptance of
  residual risk.

**Next safe step**:

1. In a fresh session, inspect `git status --short` and the local dirty diff.
2. Revert/remove the broken generated MCP executor/generator experiment while
   preserving this corrective handoff documentation.
3. Re-query project/main Sonar HIGH issues and security hotspots.
4. Choose the first remediation slice from that main/project backlog.
5. Run the smallest relevant gates, then root `pnpm check` before committing.

**Promotion watchlist**:

- Candidate practice lesson: branch-scoped quality-gate analysis is a
  regression guard, not a backlog source for a branch whose purpose is to fix an
  existing main/project backlog. Treating it as the source creates circular work.
- Candidate practice lesson: once remediation enters core generated/type
  surfaces, stop at the first type-system resistance and reframe the problem
  before chasing errors outward.
- Owner correction reinforced that generated files remain first-class checked
  code; quality-gate exclusion is not a valid route to green.
