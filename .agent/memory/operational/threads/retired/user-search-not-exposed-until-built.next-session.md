---
fitness_line_target: 700
fitness_line_limit: 1100
fitness_char_limit: 70000
fitness_line_length: 100
fitness_content_role: reference
overflow_disposition: 'leave-if-live; else graduate, then archive to a dated file proven byte-identical — never before full processing, never split/shard (see continuity-practice.md §Disposition of Continuity Surfaces)'
merge_class: index-narrative-tables
---
> **RETIRED — thread completed 2026-07-08.**
> The gating landed on main — `OAK_CURRICULUM_MCP_USER_SEARCH_ENABLED` (default
> OFF) and `runtimeConfig.userSearchEnabled` are live in the MCP server (verified
> by artefact presence 2026-07-08; the session's original SHAs were orphaned by
> later merge history, so the record's "push pending" note is stale). Retained as
> continuity history; not a live lane. Not listed in `repo-continuity.md` Active
> or Paused threads.

# Thread: user-search-not-exposed-until-built

**Purpose**: Stop the unbuilt user-search MCP App tools (`user-search` +
`user-search-query`) appearing in the model-visible `tools/list`, by gating
their registration behind an opt-in flag (default OFF) until the MCP App
user-search experience is built.

## Participating agent identities (PDR-027)

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| Foehn calls Headwind | claude-code | claude-opus-4-8[1m] | 5e1832 | implementer | 2026-06-23 | 2026-06-23 |

## Lane state

- **Owning plan**:
  [`current/user-search-not-exposed-until-built.plan.md`](../../../../plans-backlog-2026-07/sdk-and-mcp-enhancements/current/user-search-not-exposed-until-built.plan.md)
  (✅ COMPLETE — ready to archive per ADR-117).
- **Current objective**: COMPLETE.
- **Current state**:
  - **Cycle 1 `ac0a98c5b`** — opt-in flag `OAK_CURRICULUM_MCP_USER_SEARCH_ENABLED`
    (default OFF) gating both user-search tools in the **app** (`handlers.ts`
    `registerTools`, via `USER_SEARCH_FLAG_GATED_TOOL_NAMES`, mirroring EEF). Field
    `userSearchEnabled` on the three runtime-config interfaces, resolved with
    `resolveOptInFlag`. Gate proven both ways by the `registerTools` spy integration
    test; the flag engine itself is not re-tested. env.ts JSDoc carries the var +
    three-stage lifecycle note.
  - **Cycle 2 `906cca9b3`** — e2e proof that `tools/list` omits both names at the
    default (OFF) and includes them when ON. e2e fixture default flipped to
    production-honest OFF; `createStubbedHttpApp` gained a `userSearchEnabled` option;
    the tests that exercise the user-search surface opt in explicitly.
  - **Plan corrections `ff26bcf69`** — gate location (app, not SDK), posture
    (`useStubTools` opt-in, not EEF kill-switch), and test shape (gate, not engine)
    corrected first-hand before execution.
  - Gates: full pre-commit green on all three commits; 760 src + 145 e2e + type-check green.
- **Blockers / low-confidence areas**: none. (ws-docs README-table item dropped — no
  such table exists; env.ts JSDoc is the canonical home.)
- **Next safe step**: **push** (owner-gated) — branch `docs/planning-and-validation` is
  ahead of origin. After push, archive the plan per ADR-117 and retire this thread.
- **Promotion watchlist**: the "gate unbuilt MCP tools at the app layer; opt-in posture;
  test the gate not the engine" findings and the shared-tree required-field-ripple +
  bursty-commit-window lessons are held in `napkin.md` (2026-06-23, Foehn calls Headwind).
