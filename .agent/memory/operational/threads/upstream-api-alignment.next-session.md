# Thread: upstream-api-alignment

**Purpose**: Bring the Oak Open Curriculum ecosystem into alignment with the evolving
upstream Oak API + bulk export, and establish a repeatable, observable alignment process.
Trigger instance (2026-06-30/07-01): upstream added a `programmes` resource family (5 GET
endpoints + 5 schemas).

## Participating agent identities (PDR-027)

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| Vanilla stirs Spore | claude | claude-opus-4-8[1m] | 807471 | implementer | 2026-07-01 | 2026-07-01 |

**Predecessor (identity fields not fully recorded):** *Bonfire turns Basalt* authored the
plan + process notes and landed WS0 (programmes regen) and WS1 (cached-schema-default,
`79364bbd1`), then handed the successor tasks to Vanilla stirs Spore via the plan's handoff
section (2026-07-01).

## Lane state

- **Owning plan**: [`active/upstream-api-alignment.plan.md`](../../../plans/sdk-and-mcp-enhancements/active/upstream-api-alignment.plan.md);
  living notes [`reports/upstream-api-alignment-notes-2026-06-30.md`](../../../reports/upstream-api-alignment-notes-2026-06-30.md).
- **Current objective**: adapt the repo to the changed upstream API spec (programmes family)
  and graduate the repeatable process. **PR #291 MERGED 2026-07-01T10:25Z** — the
  post-merge next-safe-steps below are live.
- **Landed state**: #291 (branch `feat/upstream-api-alignment`) merged with all checks
  green, all review conversations resolved. Six session commits:
  - WS0 programmes regen + WS1 cached-schema-default (`79364bbd1`, predecessor).
  - WS2 semantic schema-drift check (`df2dbeabd`) — pure `evaluateSchemaDrift`, canonical
    compare, fetch abort-timeout, warn-only CI + pre-push. Live-verified "up to date".
  - WS4 programmes discoverability (`4f4a7ea3a`) + injected `TOOL_DESCRIPTION_ADDITIONS` map
    with the full-form-slug clarification note (`874af6fd8`).
  - Review triage — 6 bot findings fixed (`757720329`) + codegen refresh-hint env-var form
    (`0dc71a9f7`).
  - WS6 runbook graduation (`5dec179ce`) → permanent
    [`docs/engineering/upstream-api-alignment-runbook.md`](../../../../docs/engineering/upstream-api-alignment-runbook.md),
    registered in the Runbook Index; report de-duped to the worked instance.
  - **WS3 (bulk types schema-derivation) MOVED OUT** to its own future plan. **WS5 (committed
    live smoke lane) DEFERRED** (owner-confirmed 2026-07-01).
- **Blockers / low-confidence areas**: none blocking.
- **Next safe step** (#291 is merged; these are live):
  1. **Pre-existing RED gate on `main` — upstream pagination-examples drift.** `pnpm check`
     fails on `@oaknational/sdk-codegen test`: `meta-examples-roundtrip.integration.test.ts`
     asserts `offset.examples [50]` / `limit [100]` but gets `[0]` — the upstream OpenAPI
     spec's pagination examples changed under us (owner-diagnosed 2026-06-30). Owner-routed:
     fix in a fresh session in a worktree off latest `main`. Do NOT blind-fix the test
     expectation (`[50]`→`[0]`) — that masks the real upstream drift; treat it as an
     alignment-runbook instance (regen against the live spec, then reconcile).
  2. **Author the `bulk-types-schema-derivation` future plan — it does NOT yet exist.** The
     runbook and the active plan both reference it as future; the bulk types are still
     template-authored (a schema-first violation) and the bulk `schema.json` is not committed.
  3. **MCP pagination-header gap (P1, ADR-shaped — this item is the owning record).** The MCP
     invoker reduces the HTTP response to `{ httpStatus, payload }` and `callTool` returns only
     `{ status, data }`, so the generated `Link: rel="next"` guidance is unusable for ALL
     paginated tools — agents stop after page 1 or hunt for metadata that never arrives,
     silently truncating multi-page curriculum data. The fork for the ADR (a design session,
     not a per-tool fix): **expose the next-page signal IN the tool result** (a
     `nextPageToken`/`nextOffset` the invoker lifts from the `Link` header or offset math), or
     **strip the Link-header sentences at the generator** for every paginated tool. Pre-existing
     and systemic, surfaced during the #291 review triage (2026-07-01). Do not re-solve per-tool.
  4. Comms-routing CLI fix — the F-41-tail plan
     (`agent-tooling/current/coordination-home-cli-path-defaulting.plan.md`) awaits pickup on
     the **primary checkout**.
- **Grounded execution facts** (verified first-hand 2026-07-01, conserve for the next
  alignment pass): `SubjectProgrammesResponseSchema = z.array(z.string())` —
  `get-subjects-programmes` returns a FLAT array of full-form programme slugs
  (`english-secondary-year-7`), NOT objects with factors; per-programme factors come from
  `get-programmes`. The upstream description's `y7` slug example and "grouped by key stage"
  phrasing are loose (the endpoint's own schema `example` uses full-form) — clarified via the
  injected `TOOL_DESCRIPTION_ADDITIONS` map, never by editing generated output. Root
  `sdk-codegen` is a turbo wrapper, so a bare `--online` flag is eaten by turbo — the online
  refresh is `SDK_CODEGEN_MODE=online pnpm sdk-codegen`.
- **Promotion watchlist**: the MCP pagination-header contract (ADR candidate); the
  fluency-premature-done-claim recurrence (doctrine-traction / action-time-structural-interrupt).
