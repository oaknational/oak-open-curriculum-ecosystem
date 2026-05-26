---
agent_name: Torrid Firing Spark
session_id_prefix: 5054f8
platform: claude
model: claude-opus-4-7
claim_id: 2f6d1d40-c3f8-4d78-b604-bfd8bebb7157
created_at: 2026-05-26T00:00:00Z
last_updated_at: 2026-05-26T00:00:00Z
purpose: pre-compaction freeze before B2 (CLI body-length gate); same-session resume, not cross-agent handoff
supersedes_handoff: .agent/state/collaboration/handoffs/torrid-firing-spark-2026-05-25-lane-b.md
---

# Torrid Firing Spark — Lane B → B2 Pre-Compaction Handoff (PDR-063)

## Context for post-compaction resume

This handoff is for the SAME session resuming post-compaction. Owner direction at session boundary: *"prepare for compaction with a session handoff, after compaction you will carry on with B2"*. No new agent picks up; my own future-self does.

The previous handoff record at `torrid-firing-spark-2026-05-25-lane-b.md` covered the FIRST compaction window (mid-extraction). It is now superseded by this record — the extraction is complete, B1+B3 landed, B2 is the remaining session item.

---

## Section 1 — Current edit state

### Landed on `docs/agent-collaboration-enhancements` (committed)

Three commits sit on top of Feathered's A1 (`97f06e16`):

- **`499518ce`** — `refactor(agent-tools): extract hook-policy guard to workspace src/ tree`
  - 5-module decomposition under `agent-tools/src/hook-policy/`:
    - `types.ts` — interfaces + Zod schemas (`ScopedContentBlockSchema`, `PreToolUseDenyResponseSchema`)
    - `matchers.ts` — pure pattern matching; `probeLineForRegex` extracted for complexity
    - `hook-input.ts` — Claude payload parsing (uses `isJsonObject` from collaboration-state/json)
    - `policy-loader.ts` — policy.json I/O; Zod schema replaces `isValidScopedBlockEntry`
    - `check-blocked-content.ts` — orchestrator + barrel re-exports + self-exec
  - Tests moved to `agent-tools/tests/hook-policy/`; stale assertions repaired (hedging-vocab filter, SHA include_paths, WS4 inline-code data-shape, empty-write stubs, JSON.parse safe-narrowing via Zod schema parse)
  - `package.json` `check-blocked-content` script invokes from `agent-tools/src/hook-policy/`
  - 9 files changed, 740 insertions, 661 deletions

- **`ecc1e834`** — `feat(hooks): add menu-framing scoped_blocks for owner-decision phrasings`
  - 3 entries in `.agent/hooks/policy.json`: `for owner verdict` / `for owner decision` / `for owner ratification`
  - Dropped `for owner approval` per assumptions-expert finding (false-positive risk in legitimate governance prose)
  - Parametrised regression test in `agent-tools/tests/hook-policy/scoped-blocks-menu-framing.unit.test.ts` — 15 tests (5 per phrase)

- **`29ebda41`** — `feat(rules): add ping-before-escalate retirement-broadcast discipline`
  - `.agent/rules/ping-before-escalate.md` canonical rule
  - `.claude/rules/ping-before-escalate.md` + `.cursor/rules/ping-before-escalate.mdc` pointers
  - `RULES_INDEX.md` entry between `per-user-memory-is-a-buffer` and `plan-body-first-principles-check`
  - All three reviewer findings applied: ADR-186 Markdown link, name-based git grep (no canonical email), PDR-078 §4 exemption ref

### Feathered's A1 (already in main)

Commit `97f06e16` — `feat(agent-tools): heartbeat emitter typed-origin gate (A1 / PDR-078 §5)`. Modifies the comms CLI to reject free-form `--body` for `--tag heartbeat` and require typed state args. This is the architectural pattern B2 extends — the same trust-boundary principle, applied to body length rather than typed-vs-free-form composition.

### Working tree (uncommitted, NOT mine)

These were in the working tree at session open and remain untouched by my work. They are someone else's concern:

- `agent-tools/README.md` (modified)
- `agent-tools/src/practice-fitness/*.ts` (multiple modified)
- `.agent/HUMANS.md`, `.agent/directives/AGENT.md`, `.agent/memory/*`, `.agent/practice-index.md`, `.agent/rules/no-hedging-vocabulary.md`, `.agent/rules/stage-by-explicit-pathspec.md`, `.agent/skills/*/SKILL-CANONICAL.md` (continuity/memory drift — not my scope)

Do NOT touch these in B2. They belong to whichever agent owns the relevant claims.

### Comms-event substrate (uncommitted, untracked)

A drift of session comms-events accumulated in `.agent/state/collaboration/comms/` plus `comms-seen/` files. These are session-state, not B2 substance. A future state-drain commit (chore class) will absorb them, but it is NOT in B2's scope.

### Quality-gate state at handoff

- `pnpm --filter @oaknational/agent-tools type-check` — EXIT 0
- `pnpm --filter @oaknational/agent-tools lint` — EXIT 0
- `pnpm --filter @oaknational/agent-tools test` — 642/642 PASS
- Full `pnpm check` via pre-commit hook on commit `29ebda41` — 90/90 turbo tasks PASS (90 cached, FULL TURBO)

---

## Section 2 — In-flight reasoning (B2 plan)

### What B2 does

B2 is the **CLI body-length gate** — the third instance of the worked cure-pattern *"CLI accepts malformed argv; downstream consumers fail with unhelpful errors"* (the other two instances: A1 typed-origin gate landed today; the `--now` ISO-timestamp validation gap captured in failure-mode event `b797cc73` and pending separate enforcement).

The cure shape: reject `--body` argv (and the equivalent `--body-file` resolved content) when the resulting comms-event body exceeds 1500 characters, on all four comms verbs (`append`, `send`, `direct`, `reply`). Surface a clear error naming the size, the limit, and the recommended remediation (split into multiple events, or use a body-file with a smaller payload).

Why 1500: the comms-event substrate is meant to be scannable. Bodies over ~1500 chars are signals of substrate misuse — long bodies belong in handoff records, plan files, or PDRs, with the comms event pointing to them.

### Files to touch (B2 scope)

Per the plan brief at `.agent/plans/agent-tooling/current/n2-and-coordination-efficiency-program-2026-05-25.plan.md` §"Next session — n=2 ENFORCEMENT BUNDLE":

1. **`agent-tools/src/collaboration-state/cli-comms-commands.ts`** — the verb dispatcher. Read it first to understand A1's post-landing shape; the body-length check belongs in the path AFTER body resolution (`--body` literal OR `--body-file` content) and BEFORE the comms event is written. Single gate function, called from each verb handler.
2. **`agent-tools/src/collaboration-state/cli-comms-messages.ts`** — error-message vocabulary. Add the body-length-exceeded message string. Keep it co-located with other CLI vocabulary for consistency with A1.
3. **`agent-tools/src/collaboration-state/cli-spec-options.ts`** — options spec. Probably no change needed unless A1 added structure that B2 should extend; check after reading.

### Regression-test surface (B2 scope)

New tests in `agent-tools/tests/collaboration-state/` (or per existing convention) covering:

- `append` verb — body over 1500 chars rejected; under 1500 chars accepted
- `send` verb — same
- `direct` verb — same
- `reply` verb — same
- `--body-file` path resolves content, then the same size check applies (rejection on resolved content exceeding 1500 chars, regardless of file-path length)
- The error message names the actual size, the 1500 limit, and the remediation hint
- Edge cases: body of exactly 1500 chars accepted; body of 1501 rejected; empty body accepted

Each verb needs at least one passing-shape test and one rejecting-shape test, plus the boundary cases. Aim for ~10-12 new tests total.

### Architectural pattern to follow

Feathered's A1 (`97f06e16`) is the model — typed argv constraint at the trust boundary, error message that names exactly which input was wrong. Read A1's implementation first to maintain stylistic + structural consistency. Specifically:

- Where A1 declared `HEARTBEAT_STATE_ARG_KEYS` and `composeHeartbeatBodyFromOptions`, B2 might declare `MAX_COMMS_BODY_LENGTH = 1500` (named constant, not magic number) and a `validateCommsBodyLength(body): Result<void, BodyLengthError>` (or throwing equivalent matching the existing code style).
- A1's gate fires BEFORE the body composition; B2's gate fires AFTER body resolution (`--body` literal or `--body-file` content) and BEFORE event write. Both share the principle: *validate at the trust boundary, name the failure surface specifically*.

### Order to apply (post-compaction)

1. **Re-confirm git state**: `git log --oneline -6` shows `29ebda41` → `ecc1e834` → `499518ce` → `97f06e16` → `87232086`. If the chain is different (e.g. new commits from peers), surface to owner before proceeding.
2. **Run baseline gate**: `pnpm --filter @oaknational/agent-tools type-check && pnpm --filter @oaknational/agent-tools lint && pnpm --filter @oaknational/agent-tools test`. Expect all green.
3. **Read Feathered's A1 commit**: `git show 97f06e16 -- agent-tools/src/collaboration-state/cli-comms-commands.ts agent-tools/src/collaboration-state/cli-spec-options.ts` to absorb the pattern. Pay attention to where A1 inserted its gate in the verb-dispatch path.
4. **Read current state of the three target files** to understand A1's post-landing shape.
5. **Dispatch reviewers in parallel (sonnet, foreground)**:
   - `type-expert`: confirm the gate's type shape (`MAX_COMMS_BODY_LENGTH` constant, error type, Result vs throw) matches A1's conventions and the workspace's rules (use-result-pattern, no-type-shortcuts).
   - `test-expert`: verify the planned test shape is TDD-honest (atomic landing — test + product code in one commit; not audit-shaped).
   - `code-expert`: gateway review naming any additional specialists.
6. **TDD execution**: write the test for each verb FIRST (test fails on the current code path), then implement the gate (test passes), then atomic-land. Apply this per verb so the commit history shows the bridge between intent and implementation.
7. **Apply reviewer findings**.
8. **Stage by explicit pathspec**: `git add agent-tools/src/collaboration-state/cli-comms-commands.ts agent-tools/src/collaboration-state/cli-comms-messages.ts agent-tools/src/collaboration-state/cli-spec-options.ts agent-tools/tests/collaboration-state/<new test files>`. No `git add -A` / `.` / `--all`.
9. **Commit** with subject ≤89 chars, e.g. `feat(comms): reject --body argv over 1500 chars on all comms verbs (B2)`.
10. **Final broadcast** to Feathered (or whoever is on the team) naming the SHA and the completion of the n=2 enforcement bundle.

### Reviewer findings prior session (already absorbed)

All four reviewers from B1+B3 returned during the pre-compaction-1 cycle. Their findings have been applied to the now-landed commits. NO open reviewer findings carry into B2.

---

## Section 3 — Decisions made (this session, pre-B2)

1. **Architectural cure direction**: scripts complicated enough to need tests live as workspace tools (5-module decomposition for hook-policy: types / matchers / hook-input / policy-loader / orchestrator). Not 7 modules (over-engineered per consolidate-at-third-consumer); not 2 modules (under-fitted per max-lines 250). 5 is the genuinely-cohesive shape: each module handles a distinct concern with multiple cross-module consumers.
2. **Zod at trust boundaries**: `ScopedContentBlockSchema` replaces hand-rolled 47-line `isValidScopedBlockEntry` (complexity 20 → 1). `PreToolUseDenyResponseSchema` provides schema-driven test validation (no type assertions). Type-expert C's concern about Zod on hot-path is valid for production runtime; test surfaces don't share that concern.
3. **"for owner approval" dropped from B1**: per assumptions-expert false-positive risk in legitimate governance prose. Three remaining phrases (verdict / decision / ratification) carry the menu-adjudication semantic precisely.
4. **B3 rule fixes**: ADR-186 Markdown link (was plain prose), name-based git grep (agents have no canonical email), PDR-078 §4 exemption-ref clause added to §Trigger.
5. **NO revert path taken**: the assumptions-expert recommendation to revert the extraction was reconsidered after owner direction "never revert; don't use scripts; back out half way through is bad; everything should be in the workspace; long-term architectural excellence ONLY". Extraction completed; minimum-cure 2-file split replaced with cohesive 5-module split.
6. **Tests moved to tests/hook-policy/**: previously colocated in scripts/, which vitest's include glob excluded — so the 600+ lines of tests never ran. Now they do. Stale assertions repaired in the same commit (in line with the cures they were written to verify).
7. **package.json invocation**: `pnpm exec tsx agent-tools/src/hook-policy/check-blocked-content.ts`. The `scripts/` directory is no longer the canonical home for this hook entrypoint. Other scripts in `agent-tools/scripts/` (check-blocked-patterns, ci-turbo-report, validate-*) remain ad-hoc — separate migration plan(s) cover those.

---

## Section 4 — Decisions deferred (NOT in B2 scope)

1. **Other agent-tools scripts**: `check-blocked-patterns.ts`, `ci-turbo-report.ts`, `validate-fitness-vocabulary.ts`, `validate-portability.ts`, `validate-subagents.ts` — all carry implicit-any debt + complexity violations hidden because `scripts/` is outside the workspace's strict lint scope. Separate migration plans cover these (the `scripts-validator-family-workspace-migration` plan for the validate-* family; agent-tools/scripts/ might need a sibling plan or be folded into it).
2. **tsconfig.json `scripts/**/*.ts` include**: tried in this session and reverted because it surfaced cascading debt across other scripts. Belongs in the migration plan that covers each script.
3. **`--now` ISO-timestamp validation cure**: third worked instance of the CLI-malformed-argv cure-pattern. Captured as failure-mode comms event `b797cc73`. Separate enforcement, NOT in B2's scope.
4. **`HEARTBEAT_TAG` constant export** (architecture-expert-fred finding from A1): defer until third consumer per consolidate-at-third-consumer. Currently one consumer.
5. **Result-pattern migration in comms CLI** (code-expert finding from A1): cross-file concern beyond A1/B2 scope; track as follow-up enforcement.
6. **Comms event substrate drain**: ~10 untracked comms events + comms-seen files + shared-comms-log.md updates accumulated this session. A future chore-class commit absorbs them; B2 itself should NOT touch this state.
7. **Heartbeat cron restart**: heartbeats were paused for compaction-1 and never restarted; per-broadcast progress reporting + cycle-boundary broadcasts covered the team-cadence requirement. For B2 post-compaction, restart only if the session extends beyond a few cycles; the cadence requirement is *visibility*, which gatekeeper-cycle broadcasts already provide for short windows.

---

## Post-compaction resume checklist

1. **Read this handoff record end-to-end.**
2. **Verify branch + git state**: `git status` shows current branch `docs/agent-collaboration-enhancements`. `git log --oneline -6` shows the four landed commits (`29ebda41`, `ecc1e834`, `499518ce`, `97f06e16`) plus older history. If new commits from peers appear, surface to owner.
3. **Re-baseline the gate**: `pnpm --filter @oaknational/agent-tools type-check`, `lint`, `test`. Expect all green.
4. **Check comms stream for new events**: `ls -t .agent/state/collaboration/comms/ | head -10` — look for any peer activity since the Lane B landed broadcast (`cad040fe-19e0-47ce-b7b6-dba0c355de2f`).
5. **Read Feathered's A1**: `git show 97f06e16 -- agent-tools/src/collaboration-state/` to absorb the pattern.
6. **Plan + dispatch reviewers** per Section 2's order.
7. **Execute B2 with TDD discipline** (tests fail → implement → tests pass → commit atomically).
8. **Final broadcast** + claim closure when B2 lands.

---

## Standing constraints (carry forward post-compaction)

- All quality gates blocking, always — including lint and type-check.
- No type assertions (`as`, `!`, `as unknown`) — oldest rule. Type predicates + Zod parse are the valid narrowing mechanisms.
- No `Record<string, unknown>` — use `JsonObject` from `collaboration-state/json` or domain-specific types.
- No `@ts-expect-error`, no `eslint-disable`, no `eslint-ignore`.
- Stage by explicit pathspec — no `git add -A` / `.` / `--all`.
- No `--no-verify` without fresh owner authorisation per individual commit.
- TDD-for-refactoring: tests stay green throughout; test + product code in one commit.
- Use specialist sub-agents (sonnet by default per Opus quota memory) throughout; multiple reviewers with diverse briefs when the path is non-obvious.
