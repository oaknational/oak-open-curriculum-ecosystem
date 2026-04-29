# Next-Session Record — `pr-90-build-fix-landing` thread

**Last refreshed**: 2026-04-29 (Solar Threading Star / claude-code /
claude-opus-4-7-1m / `6d68d6` — thread registered at session open after
grounding the failing CI surface and Sonar gate, completing metacognition,
and authoring the closure plan. No code yet edited; session paused before
execution per owner direction.)

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
| `Solar Threading Star` | `claude-code` | `claude-opus-4-7-1m` | `6d68d6` | `pr-90-landing-closure-planner` | 2026-04-29 | 2026-04-29 |

Identity discipline remains additive per
[PDR-027](../../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md):
new sessions add rows; matching platform/model/agent_name updates
`last_session`.

---

## Landing Target (per PDR-026)

**This session (Solar Threading Star)**: planning landing only — author the
PR #90 closure plan and register the thread. Plan landed at
[`pr-90-landing-closure.plan.md`](../../../plans/architecture-and-infrastructure/current/pr-90-landing-closure.plan.md).
No code edits committed.

Evidence:

- Plan: `.agent/plans/architecture-and-infrastructure/current/pr-90-landing-closure.plan.md`
- Active claim: `21943b5a-555f-429e-85af-20709ef9afea` in
  `.agent/state/collaboration/active-claims.json`
- Comms event: `853b358d-bb36-4774-9ce0-3bb9be612588.json`
- Failing CI: <https://github.com/oaknational/oak-open-curriculum-ecosystem/actions/runs/25107898664>
- Sonar PR analysis: <https://sonarcloud.io/dashboard?id=oaknational_oak-open-curriculum-ecosystem&pullRequest=90>

## Next Landing Target

Execute the plan in three phases:

1. **Phase 0** — Repo-wide grep audit confirming no TS-invocation drift
   sites beyond the three named (ci.yml × 2, build-system.md, research
   example).
2. **Phase 1** — Single commit aligning CI + docs + research example on
   `pnpm exec tsx scripts/<script>.ts`.
3. **Phase 2** — Single commit applying 12 mechanical Sonar fixes
   (S2871×2, S7735×4, S7778, S7780×3, S7781, S6557).
4. **Phase 3** — Full quality-gate sweep, CI/Sonar verification, post PR
   comment surfacing MCP manual validation as owner precondition.

Owner-only precondition before merge: manual MCP server validation. Agent
must surface this explicitly; do not gate on it.

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
