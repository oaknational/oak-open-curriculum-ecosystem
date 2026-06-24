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

## Landing Target For Next Session

Target: **owner-authorised execution start** — open a dedicated branch (not
`chore/paperwork`), then ship Phase 1 (S8707 CLI canonical-path validation) as
the first small PR. Then Phase 2 regex strategy.

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

**Next safe step**: owner authorises execution → branch → Phase 1.

## Watch (not mine; flagged)

`oak-sdk-codegen` generated/schema files showed as modified mid-session
(parallel process; not this session's edits). Do not stage them in this lane.
