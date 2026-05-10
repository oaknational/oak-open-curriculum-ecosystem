# Next-session opener — `.agent/commands/` retirement (Phase 1)

Branch: `feat/mcp-graph-support-foundation`. Owning plan:
[`.agent/plans/agent-tooling/current/agent-commands-retirement.plan.md`](../../plans/agent-tooling/current/agent-commands-retirement.plan.md).

Prior session (Iridescent Dancing Nebula, 2026-05-10) landed Wave 2 Item 1
(`fae57312`) and stopped after surveying revealed full `.agent/commands/`
retirement is a 3–4 hour properly-scoped workstream rather than a Wave 2
punch-list tail. Plan-file landed (`3ecbc4dc`) with full plan-time reviewer
findings + four tracked follow-ups; handoff committed (`64527495`).

## What you're starting

**Phase 1: Validator + runtime probe + pre-existing drift fixes.** Single
commit. ~60–90 min focused work.

This commit lands FIRST so the gate is never red on a committed state.
After Commit 1, `pnpm portability:check` must transition from currently-
failing to passing.

## Owner-locked decisions (DO NOT re-open)

- Two-surface contract: `.claude/skills/jc-<id>/` + `.agents/skills/jc-<id>/`
- `jc-` prefix on adapter directories
- `SKILL-CANONICAL.md` filename for canonicals
- `.cursor/.gemini/.codex/.windsurf/skills` retired (Wave 1)
- `.cursor/commands/` + `.gemini/commands/` retired (ADR-125 §2026-05-09)
- `.agent/commands/` retired (PDR-051 + ADR-125 §2026-05-09)
- `.agent/commands/experiments/` content (`collaborate.md`, `step-back.md`,
  `think.md`) — owner-confirmed delete as stale
- `.claude/settings.json` permission additions — fix in Commit 1 alongside
  validator refactor (owner-confirmed)
- Live-plan + memory drift (~50 references) — track as documentation
  drift, do NOT fix in this plan

## Phase 1 work (concrete file list)

### `scripts/validate-portability.ts`

- Remove **Check 1** (Command adapter → canonical exists) — commands retired
- Remove **Check 2** (Cross-platform command count consistency) — commands retired
- Fix **Check 3b** line 247: `SKILL.md` → `SKILL-CANONICAL.md`
- Fix **Check 4** line 264: `SKILL.md` → `SKILL-CANONICAL.md`
- Update **Check 6**: drop canonical commands branch; keep canonical skills orphan detection
- Fix **Check 9b** lines 421, 427: `SKILL.md` → `SKILL-CANONICAL.md`
- Fix **Check 9b**: drop `.cursor/skills` from `skillAdapterPlatforms` (retired surface)
- Fix **Check 12** line 500: stop reading `.claude/commands` (retired); read `.claude/skills/jc-*` instead
- Update `stats` line 521: drop canonical commands count

### `agent-tools/src/core/health-probe-shared.ts`

- Remove `COMMANDS_DIR`, `CURSOR_COMMANDS_DIR`, `CLAUDE_COMMANDS_DIR`, `GEMINI_COMMANDS_DIR`
- Remove `listCanonicalCommandNames`, `listCommandAdapterNames`, `listPortableCommandAdapterNames`
- Remove `SUPERSEDED_COMMANDS`

### `agent-tools/src/core/health-probe-parity.ts`

- Delete `evaluateCommandAdapterParity`, `collectCommandAdapterParityDetails`
- Update `evaluateParityChecks` return list (drop `command-adapter-parity`)

### `scripts/validate-fitness-vocabulary.unit.test.ts`

- Update fixture path at line 43:
  `.agent/commands/consolidate-docs.md` → `.agent/skills/consolidate-docs/SKILL-CANONICAL.md`

### `.claude/settings.json`

- Add 30 missing `Skill(jc-*)` + `Skill(jc-*:*)` permission entries.
  Identify the missing set by running `pnpm portability:check 2>&1 |
  grep "no Skill(jc-" | wc -l` before and after.

## TDD discipline for Phase 1

The validator and health-probe changes are logic changes. Tests stand
in for review where they exist; where they don't, the acceptance command
output IS the falsifiability check.

- `pnpm portability:check` — must exit 0
- `pnpm skills:check` — must still exit 0
- `pnpm test --filter @oaknational/agent-tools` — health-probe tests
  must still pass; if `evaluateCommandAdapterParity` was test-covered
  (current grep says no), the test deletions land in the same commit
- `pnpm type-check` — full monorepo

## Reviewer dispatch (post-Commit 1)

- `code-expert` — gateway (mandatory)
- `architecture-expert-fred` — doctrine boundary cure (mandatory; his
  prior WARN cures here)
- `config-expert` — `validate-portability.ts` is a quality gate; line
  247/264 + Check 1/2/12 fixes change gate correctness semantics
- `test-expert` — focused; `validate-fitness-vocabulary.unit.test.ts`
  fixture update

`docs-adr-expert` is not yet relevant — that triggers in Commit 3.

## Pause-and-assess after Commit 1

The plan has Commits 2 (inline + delete) and 3 (ADRs + live docs)
queued. Pause after Commit 1 lands and reviewer dispatch settles.
Honestly report elapsed time and remaining budget. If it fits, continue
to Commit 2; if not, stop and hand off — the `feedback_no_speed_pressure`
and `feedback_ground_state_before_planning` rules apply.

## Auxiliary context

- Plan-time code-expert dispatch transcript was at agentId
  `a49d706db87f87853` (cached at
  `~/.claude/projects/<project>/<session>/subagents/agent-a49d706db87f87853.jsonl`
  if recovery needed).
- `pnpm portability:check` output before Phase 1: failing with two
  pre-existing issue families (skills-lock drift + .claude/settings.json
  missing perms). After Phase 1: must exit 0.
- Wave 2 Items 3–6 are independent agent-tools quality work; queue as
  a separate plan after retirement lands.

## Recommended session start

1. `/jc-start-right-thorough` to ground.
2. Read this opener + the owning plan.
3. Open Phase 1 in `agent-commands-retirement.plan.md`; mark its todo `in_progress`.
4. Begin with `scripts/validate-portability.ts` — it is the largest
   change surface and validates the gate.

## Suggested rename

After session intent is clear:

```text
/rename <agent-name> - agent-commands-retirement Phase 1
```
