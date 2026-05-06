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

Target: `apply Sonar Disposition Policy to remaining hotspots and any
post-re-analysis residual` — after the push from session 2026-05-06,
SonarCloud re-analysis runs against the current branch HEAD; the
zombie HIGH-issue backlog (133 OPEN) is expected to auto-resolve to
FIXED for code that `457fa1f0` already fixed. Next session reviews the
post-re-analysis residual, applies the new
[`docs/governance/sonar-disposition-policy.md`](../../../../docs/governance/sonar-disposition-policy.md)
to the 22 S1313 still TO_REVIEW (deferred from this session), and
addresses any genuine remaining HIGH issues with TDD fixes per the
two-outcome rule.

## Lane State

**Owning plan**:
`.agent/plans/architecture-and-infrastructure/current/main-critical-sonar-rebuild-from-updated-main.plan.md`

**Current objective**: rebuild Sonar remediation from updated main and fix the
current project/main HIGH issues plus security hotspots on the branch. PR-scoped
Sonar is used only to verify the branch does not add regressions.

**Current state** (after session 2026-05-06 by Stormy Drifting Harbour):

- Branch `fix/sonar-fixes-20260506` has commits:
  - `457fa1f0 fix(sonar): remediate quality gate blockers`
  - `b903554b chore(collaboration): close commit window state`
  - `c2f5402b fix(sonar): preserve useful remediation cleanups`
  - `5f6a7ae2 test(http-mcp): pin X-Powered-By absence; SAFE 6 sonar hotspots`
  - Sonar Disposition Policy commit (this session, see commit log).
- Sonar dispositions applied this session: **121 hotspots** moved
  TO_REVIEW → REVIEWED/SAFE with site-specific rationales, raising
  `security_hotspots_reviewed` from 7.1% (11/154) to ~85.7% (132/154).
- 22 S1313 hardcoded-IP hotspots in 3 test files **deliberately
  deferred** to next session: `header-redaction.e2e.test.ts` (2),
  `header-redaction.unit.test.ts` (13),
  `rate-limiter-factory.unit.test.ts` (7). All test fixtures; with the
  new policy in place they apply by class.
- Slice 1 (Sonar high-priority hotspots: 1 RCE + 3 PRNG + 2 weak-crypto)
  shipped with a regression-guard E2E test that pins the X-Powered-By
  absence at the application layer.
- Slice 2 (this session) shipped the
  [Sonar Disposition Policy](../../../../docs/governance/sonar-disposition-policy.md)
  codifying class-level dispositions for 9 hotspot rule classes.
- HIGH-issue backlog: 133 OPEN as queried at session-open; sampling of 6
  files showed all are zombie findings from a stale main-branch
  analysis that pre-dates commit `457fa1f0`. The push from this session
  triggers CI SonarCloud re-analysis; the bulk of the 133 are expected
  to auto-resolve to FIXED.

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

1. Wait for CI SonarCloud re-analysis on the pushed branch to complete.
2. Re-query project/main Sonar HIGH issues — most should now be FIXED.
3. Re-query hotspots — the 22 S1313 should be the only TO_REVIEW
   residual in the test-fixture classes; any new hotspots from this
   branch's commits will appear here.
4. Apply [Sonar Disposition Policy
   §S1313](../../../../docs/governance/sonar-disposition-policy.md#s1313--hardcoded-ip-addresses)
   to the 22 deferred sites: short rationales of the form
   `SAFE per Sonar Disposition Policy §S1313: <file>:<line> — test-
   fixture IP literal driving header-redaction/rate-limit test`.
5. Address any genuine remaining HIGH issues with TDD per the policy's
   two-outcome rule.
6. Run the smallest relevant gates, then root `pnpm check` before
   committing.

**Promotion watchlist**:

- Candidate practice lesson: branch-scoped quality-gate analysis is a
  regression guard, not a backlog source for a branch whose purpose is to fix an
  existing main/project backlog. Treating it as the source creates circular work.
- Candidate practice lesson: once remediation enters core generated/type
  surfaces, stop at the first type-system resistance and reframe the problem
  before chasing errors outward.
- Owner correction reinforced that generated files remain first-class checked
  code; quality-gate exclusion is not a valid route to green.
- Candidate practice lesson (2026-05-06): for a *static analyser's*
  HIGH issues against a moving target, the cure is `push + re-analyse`,
  not manual disposition; for *security hotspots* whose decision
  requires context the analyser cannot see, the cure is human review
  with site-specific rationale; for both, doctrine (a class-level
  policy artefact) compounds where per-site comments do not.
- Candidate practice lesson (2026-05-06): activity-bias diagnostic —
  when a sequence of mechanical tool calls becomes procedurally
  identical, that is the prompt to re-ask the first question, not to
  continue. The simpler shape may be a single durable artefact rather
  than N individual calls.
