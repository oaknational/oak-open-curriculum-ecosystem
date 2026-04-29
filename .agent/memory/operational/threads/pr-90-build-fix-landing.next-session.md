# Next-Session Record — `pr-90-build-fix-landing` thread

**Last refreshed**: 2026-04-29 (Solar Threading Star / claude-code /
claude-opus-4-7-1m / `6d68d6` — Phases 0–5 of the closure plan executed.
Five commits landed and pushed: `b8540657` TS-invocation alignment across
CI/docs/research (5 surfaces; Phase 0 audit caught 2 sibling drift sites the
handoff missed); `78718b3b` Sonar mechanical sweep of 12 OPEN/CONFIRMED issues
across 4 `scripts/validate-*` files; `532b0871` removal of duplicate H3 in
archived napkin (post-push Cursor Bugbot finding); `bdcf21ae` local-detection
gate for `node scripts/X.{mjs,ts,js}` patterns (10 unit + 1 integration test,
+11 tests under `pnpm test:root-scripts`); plus the Phase 5 commit enabling
markdownlint MD024 with `siblings_only: true` and fixing the 3 sibling-level
duplicates surfaced. The owner's external-detection principle ("where an
external system catches a problem, ask if it could be caught locally and
either implement it or raise with effort/risk/ROI") drove Phases 4 and 5;
both gaps caught externally on this PR are now closed by local quality gates.
All required CI gates green on PR-90: test ✓, SonarCloud Code Analysis ✓
(0 OPEN/CONFIRMED, 50 FIXED), CodeQL ✓, Cursor Bugbot ✓, Vercel ✓. Practice
fitness: SOFT-only (0 hard, 0 critical, 19 soft). Outstanding precondition
is owner manual MCP server validation — agent-completable work for this PR
is done.)

## Thread Identity

`pr-90-build-fix-landing` — single-PR closure thread for PR #90
(`fix/build_issues` → `main`). Multi-session by construction: the branch
already accumulated work from Verdant Swaying Fern, Verdant Regrowing Pollen,
Ethereal Illuminating Comet, Nebulous Weaving Dusk, and now Solar Threading
Star. The thread persists until the PR merges or is explicitly closed.

## Participating Agent Identities

| Agent name | Platform | Model | Session id prefix | Role | First session | Last session |
| --- | --- | --- | --- | --- | --- | --- |
| `Verdant Swaying Fern` | `claude` | `claude-opus-4-7` | `c34d50` | `ts6-migration-executor` | 2026-04-29 | 2026-04-29 |
| `Verdant Regrowing Pollen` | `claude` | `claude-opus-4-7` | `b3812b` | `ts6-closeout-and-vercel-unblock` | 2026-04-29 | 2026-04-29 |
| `Ethereal Illuminating Comet` | `claude-code` | `claude-opus-4-7-1m` | `05f2e9` | `e2e-test-deletion-and-adr-167` | 2026-04-29 | 2026-04-29 |
| `Solar Threading Star` | `claude-code` | `claude-opus-4-7-1m` | `6d68d6` | `pr-90-landing-closure-and-machine-local-paths-rule` | 2026-04-29 | 2026-04-29 |

Identity discipline remains additive per
[PDR-027](../../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md):
new sessions add rows; matching platform/model/agent_name updates
`last_session`.

---

## Landing Target (per PDR-026)

**This session (Solar Threading Star)**: closure plan executed end-to-end.
Phases 0–3 complete; PR-90 is in agent-completable terminal state. Outstanding
gate is owner manual MCP server validation only.

Evidence (commits, all pushed to `fix/build_issues`):

- `b8540657` — `fix(build): align ts-script invocation pattern across ci, docs, and research`
- `78718b3b` — `chore(sonar): mechanical sweep of 12 quality-gate issues across validate-* scripts`
- `532b0871` — `chore(napkin): remove duplicate heading in archived 2026-04-29 napkin`
- `bdcf21ae` — `test(scripts): add local detection gate for stale node scripts/X.{mjs,ts,js} patterns`
- _(Phase 5 commit pending push)_ — enable markdownlint MD024 with `siblings_only: true`; fix 3 sibling-level duplicate-heading violations

PR-90 verification:

- All required CI gates green: <https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/90>
- Sonar PR analysis: <https://sonarcloud.io/dashboard?id=oaknational_oak-open-curriculum-ecosystem&pullRequest=90> — 0 OPEN/CONFIRMED, 50 FIXED.
- Closure comment with local-detection register: <https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/90#issuecomment-4346625386>
- Follow-up comment with sharper MD024 finding: <https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/90#issuecomment-4346657905>
- Plan: `.agent/plans/architecture-and-infrastructure/current/pr-90-landing-closure.plan.md`
- Active claim `21943b5a` to be closed at session-handoff.

## Next Landing Target

**Owner-only remaining**: squash-merge PR-90 to `main`.

Owner manual MCP server validation **confirmed** by the owner on
2026-04-29 (after the `54832c91` push, with all CI gates green). All
agent-completable work for this thread is done. The thread closes
when the squash-merge lands; pending that, no further agent action is
required on this thread.

Post-merge work (out-of-scope for this thread but raised in the PR-90
closure register at <https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/90#issuecomment-4346625386>):

1. **Workflow + markdown TS-invocation lint** — root-script test that greps
   `.github/workflows/*.yml` and authored markdown for `node scripts/*` and
   asserts canonical `pnpm exec tsx scripts/<script>.ts` form. ~20 min effort,
   very high ROI; closes the class of drift this PR cleaned up.
2. **`markdownlint` MD024 re-enable** — currently globally disabled in
   `.markdownlint.json` (`"no-duplicate-heading": false`). Probable config:
   `siblings_only: true` to permit patterned repeated headings under different
   parents. ~10 min effort + impact-scoped enable; closes the duplicate-heading
   detection gap that Cursor Bugbot caught twice on this PR.
3. **`eslint-plugin-sonarjs` rule activation** — owned by the existing
   multi-phase plan
   [`sonarjs-activation-and-sonarcloud-backlog.plan.md`](../../../plans/architecture-and-infrastructure/current/sonarjs-activation-and-sonarcloud-backlog.plan.md).
   The 12 Sonar fixes landed in `78718b3b` reduce the activation backlog.

## Session Shape and Grounding Order

1. Read [`repo-continuity.md`](../repo-continuity.md) — especially
   `§ Active Threads` and the most recent refresh entries (Verdant
   Regrowing Pollen + Solar Threading Star).
2. Read this thread record.
3. Read the closure plan
   [`pr-90-landing-closure.plan.md`](../../../plans/architecture-and-infrastructure/current/pr-90-landing-closure.plan.md).
4. Re-read `principles.md` (especially §Architectural Excellence Over
   Expediency, §Consistent Naming, §No warning toleration), and
   `testing-strategy.md` (Phase 2 Sonar fixes preserve test behaviour).
5. Re-check live PR state via `gh pr checks 90` and Sonar via
   `sonar list issues -p oaknational_oak-open-curriculum-ecosystem --pull-request 90 --format json`
   — Sonar reanalyses on push and may take a few minutes.

## Standing Decisions

- **Single-PR scope discipline**: no new architectural rules added in
  this PR. ADR-168 is the architectural source for workspace-script
  rules; future refinements (vitest-config-base coupling, local-vs-CI
  invocation gap) belong in separate plans.
- **Cursor Bugbot finding on `.agent/memory/active/napkin.md:174` is
  delegated** to whichever agent owns the napkin at consolidation time.
  Solar Threading Star did not edit it (off-scope for PR #90).
- **TS-script invocation pattern**: `pnpm exec tsx scripts/<script>.ts`
  is the canonical form across CI, docs, and examples. The `node
  scripts/*.mjs` pattern is retired; any drift surfaced by future audits
  must be converted in lockstep.
- **Squash-merge intent**: PR #90 is intended for squash-merge per the
  prior session handoff. Squash commit message authored at merge time.

## Lane State

### Owning Plan

[`pr-90-landing-closure.plan.md`](../../../plans/architecture-and-infrastructure/current/pr-90-landing-closure.plan.md)

### Current Objective

Close PR #90 quality gates without expanding scope. Two coherent
workstreams (TS-invocation pattern consistency + Sonar mechanical sweep)
plus one owner gate (MCP manual validation).

### Current State

- Vercel preview: green (verified by Verdant Regrowing Pollen).
- CI `test` job: failing on two `.mjs` references in `.github/workflows/ci.yml`.
- Sonar gate: failing with 12 OPEN/CONFIRMED issues.
- CodeQL, Vercel: passing.
- Cursor Bugbot: one finding (`.agent/memory/active/napkin.md:174` —
  delegated, not in scope for this thread).

### Blockers / Low-Confidence Areas

- **Owner gate**: MCP manual validation is required before merge. Cannot
  be agent-validated. Surface as PR comment with all evidence; do not
  attempt to gate on it.
- **Sonar reanalysis lag**: Sonar reanalyses on each push and may take
  several minutes; CI verification waits on this.
- **Local-vs-CI invocation gap**: CI invokes `ci-turbo-report.ts` and
  `ci-schema-drift-check.ts` which are not run by `pnpm test`. This is a
  structural smell flagged in the closure plan's "Future Enhancements (Out
  of Scope)" section. Belongs to a separate plan.

### Next Safe Step

Execute Phase 0 audit (one repo-wide grep), then Phase 1 single-commit
TS-invocation sweep. Wait for CI green before starting Phase 2.

### Active Track Links

None.

### Promotion Watchlist

- If Phase 0 audit finds additional drift sites beyond the three named,
  scope expansion is in-plan (one commit covers all sites consistently).
- If Sonar fixes change behaviour (not purely mechanical), pause and
  invoke `code-reviewer` before committing — fix is not mechanical and
  warrants individual TDD treatment.
- If CI surfaces additional `.mjs`-pattern failures after Phase 1 push,
  treat as in-scope sibling drift and fix in a follow-up commit before
  Phase 2.
