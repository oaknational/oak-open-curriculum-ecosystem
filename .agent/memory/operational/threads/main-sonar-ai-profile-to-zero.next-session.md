---
fitness_line_target: 400
fitness_line_limit: 700
fitness_char_limit: 45000
fitness_line_length: 100
fitness_content_role: reference
overflow_disposition: 'leave-if-live; else conserve-insight-and-delete — never archive/split/rotate/shard (see continuity-practice.md §Disposition of Continuity Surfaces)'
merge_class: index-narrative-tables
---

# main-sonar-ai-profile-to-zero Next Session

## Thread Identity

Thread: `main-sonar-ai-profile-to-zero`
Primary plan:
[`main-sonar-ai-profile-to-zero.plan.md`](../../../plans/architecture-and-infrastructure/current/main-sonar-ai-profile-to-zero.plan.md)
Supersedes the retired `main-critical-sonar-remediation` lane.

## Participating Agent Identities

| platform | model | session_id_prefix | agent_name | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| claude-code | claude-opus-4-8-1m | 4b038c | Aspen tracks Root | analyst/plan-author | 2026-06-24 | 2026-06-24 |
| claude-code | claude-opus-4-8-1m | c57e0b | Lapwing weaves Downdraft | implementer | 2026-06-24 | 2026-06-25 |
| claude | claude-opus-4-8[1m] | c2b721 | Thyme lifts Compost | team-session-closer | 2026-06-25 | 2026-06-25 |
| claude | claude-opus-4-8 | 3b1f1c | Junk tracks Moorings | implementer | 2026-06-25 | 2026-06-25 |

## Landing Target For Next Session

**Plan status: MERGED to `main` via PR #220 (`9e9844015`, 2026-06-24).**
**Sites 1-2 + the S4036 fix MERGED to `main` via PR #223 (`9d2e33bb1`, 2026-06-25, Junk tracks Moorings)
— S8707 sites 1-2 contained, plus S4036 cleared as a replace (`resolveTrustedGit` absolute git path,
fail-loud; `TRUSTED_GIT_PATH` deleted; §S4036 retired to FIX-only). NEXT: site-3 only.**
**Site-3 PAUSED (Thyme lifts Compost's claim `ff3da671`) — `apps/oak-search-cli` analyze-elser-failures
local safe-path helper, then the integrated security-expert re-review, then one PR direct to main.**
Phase 1 (S8707) on branch `fix/sonar-s8707-cli-path-injection` (off `9e9844015`; sites 1-2 now on main via #223):

- **Site 1/3 DONE + green — COMMITTED `1329d787a`** — `assertPathWithinBase`
  validator (`agent-tools/src/core/safe-path.ts`, security-expert GO) wired into
  `ci-turbo-report.ts`; type-check clean, 24/24 tests; full pre-commit gate
  green. A `max-lines` fix extracted the production fs seam to
  `ci-turbo-report-fs.ts`. Phase 1 still lands as one PR direct to main.
- **Site 2/3 DONE — COMMITTED `4c9cfbfc9`** — git-dir containment base
  (`git rev-parse --absolute-git-dir`; repo-root would block every worktree
  commit), gate-green.
- **Branch PUSHED to origin** (orphan mitigation, 2026-06-25). PUSHED-not-merged
  deliberately: coordination is already squash-merged to `main`, the primary tree
  is dirty, and Sonar is a separate thread; push is the zero-risk reversible
  preservation that homes the at-risk work on origin without entangling it in a
  dirty tree or a closed coordination branch.
- **Site 3/3 PENDING** → next team session. Containment base
  `apps/oak-search-cli/diagnostics`.
- **Sites 2-3 handoff record (PDR-063)**:
  [`../../../state/collaboration/handoffs/f2a17e85-55e1-4081-bf9e-a6c4cd69e48b.md`](../../../state/collaboration/handoffs/f2a17e85-55e1-4081-bf9e-a6c4cd69e48b.md).
- **Plan correction (verified first-hand + security-reviewed):** per-site
  containment bases, NOT blanket repo-root — site-1 `.turbo/runs`, site-2
  **git dir** (`git rev-parse --absolute-git-dir`; repo-root would block every
  worktree commit), site-3 `apps/oak-search-cli/diagnostics`. All FIX.

Target (next team session): successor wires site 3 (TDD; sites 1 + 2 already
committed) → security-expert RE-review of integrated sites → workspace gates →
one PR direct to `main` via code-owner review. Then Phase 2 regex strategy.

## Lane State

**Objective**: drive `main`'s Sonar AI quality-profile backlog to **zero** —
fix or genuine-FP only, no suppression, generated files fixed at generator.

**Done this session (2026-06-24, Aspen tracks Root)**:

- Retired the stale `main-critical-sonar-remediation` lane (plan + evidence →
  `plans-old-archive/.../superseded/`; thread record → `retired/` with banner;
  `repo-continuity.md` tables updated).
- Authored this tracking home + the full 48-class triage table; the plan is now
  **DECISION-COMPLETE and owner-approved** (six phases, two owner decisions closed:
  FP-dismissal authorised on first-hand proof; idiom rules enable→autofix→lock-at-error).
- First-hand triage of the three HIGH-priority classes:
  - **S8707 ×3** (agent-CLI path-injection) — all genuine; fix = canonical-path
    validation. Gate-blocking (new vulnerabilities condition).
  - **Regex safety** (S8786 ×15, S5843 ×2, S6035 ×1) — five sub-classes;
    `path-utils.ts` is GENERATED (fix at generator); `semver.ts:33` is a
    vendored canonical pattern (accept/refactor candidate); hand-written sites
    are the per-workspace consolidation targets.
  - **Test integrity** (S2699 BLOCKER, S5914 ×12, S5906 ×34, S6551 ×1).

**Owner decisions — all CLOSED (2026-06-24, plan is DECISION-COMPLETE)**:

- Regex home: **`src/lib/regex/`** per workspace, hand-written sites only (not
  generated / generator-source / vendored). [owner: "agree to all"]
- `semver.ts:33`: **refactor-to-import from `semver`** (not a dismissal). [agreed]
- `S101 ×3`: **FALSE_POSITIVE** — openapi-ts fixed `paths`/`operations` names,
  not renamable; dismissal **authorised on first-hand proof** [AskUserQuestion].
- FP dismissals generally: **authorised on first-hand proof** with site rationale.
- Idiom rules: **enable → autofix → lock at error**.

Residual (non-blocking, resolved first-hand during execution): which exact S8786
sites are linear-safe FPs vs real fixes.

**Coverage note**: HIGH-priority classes read per-site first-hand;
design-MAJOR representative; mechanical-MINOR dispositioned at class level
(per-site confirmation collapses into the fix act). Full per-site first-hand of
every MINOR site is available on request.

**Current state (2026-06-25, Thyme lifts Compost)**: sites 1 + 2 committed
(`1329d787a`, `4c9cfbfc9`) on `fix/sonar-s8707-cli-path-injection`, branch PUSHED
to origin (preserved). Lane PAUSED at the worktree-pilot team closer; site-3 → next
team session.

**Next safe step**: next-team-session successor reads the handoff record
(`handoffs/f2a17e85-…md`) before any edit → checks out the pushed
`fix/sonar-s8707-cli-path-injection` branch → wires site 3 (`apps/oak-search-cli/diagnostics`
base, TDD) → continues security-expert thread `abed0b58a0b03bcb2` for the integrated
re-review of all three sites → workspace gates → one PR direct to `main` via code-owner
review. Then Phase 2 regex strategy.

## Watch (not mine; flagged)

`oak-sdk-codegen` generated/schema files showed as modified mid-session
(parallel process; not this session's edits). Do not stage them in this lane.
