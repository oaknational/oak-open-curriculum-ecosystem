# Thread: upstream-api-alignment

**Purpose**: Bring the Oak Open Curriculum ecosystem into alignment with the evolving
upstream Oak API + bulk export, and establish a repeatable, observable alignment process.
Trigger instance (2026-06-30/07-01): upstream added a `programmes` resource family (5 GET
endpoints + 5 schemas).

## Participating agent identities (PDR-027)

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| Vanilla stirs Spore | claude | claude-opus-4-8[1m] | 807471 | implementer | 2026-07-01 | 2026-07-01 |
| Katydid seeks Moonbeam | claude-code | claude-fable-5 | 477cba | status-verifier (drive-by) | 2026-07-06 | 2026-07-06 |
| Swallow guards Tailwind | claude-code | claude-fable-5 | 805902 | implementer — MCP-152/153 concept exploration + execution | 2026-07-26 | 2026-07-26 |
| Birch holds Seedling | claude-code | claude-fable-5 | e48fe2 | implementer — the 2026-08-03 upstream update lane (MCP-462/463/464); continues across a compaction boundary | 2026-08-03 | 2026-08-03 |

**Predecessor (identity fields not fully recorded):** *Bonfire turns Basalt* authored the
plan + process notes and landed WS0 (programmes regen) and WS1 (cached-schema-default,
`79364bbd1`), then handed the successor tasks to Vanilla stirs Spore via the plan's handoff
section (2026-07-01).

## Lane state

- **Owning plan**: [`active/upstream-api-alignment.plan.md`](../../../plans-backlog-2026-07/sdk-and-mcp-enhancements/active/upstream-api-alignment.plan.md);
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
- **2026-07-26 CORRECTION (Swallow guards Tailwind, fleet-verified from git, first-hand)**:
  the canary item below was wrong twice — the test NEVER asserted `limit [100]` (git blame:
  `[10]` since `028dc2171`, 2026-04-10), and the 2026-07-06 "green, cause unestablished" WAS
  establishable from git all along: `f02a7ba1b` (2026-06-30) deliberately aligned offset
  `[50]`→`[0]` with rationale in the commit body. Standing prediction: the next regen turns
  the canary RED on `limit` example `[10]` vs live `[20]` — the correct disposition is a
  documented alignment (the `f02a7ba1b` shape), never a blind expectation edit. Full
  exploration record:
  `.agent/reports/upstream-and-bulk-alignment-concept-exploration-2026-07-26.md`
  (also corrects this record's "bulk schema.json is not committed" item — it IS committed,
  since `2fffb80ff` 2026-07-01, and is never true of its own payload; see the report before
  acting on items 2–3 below).
- **Next safe step** (#291 is merged; these are live):
  1. ~~Canary verification item~~ — RESOLVED by the 2026-07-26 correction above (cause
     established from git; prediction + disposition rule recorded there).
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
  refresh is `pnpm sdk-codegen:refresh` (fetches with `--force` and rebuilds; MCP-130).
- **Promotion watchlist**: the MCP pagination-header contract (ADR candidate); the
  fluency-premature-done-claim recurrence (doctrine-traction / action-time-structural-interrupt).

## 2026-07-27 — Bulk ingest feasibility (definitive, first-hand; Swallow guards Tailwind)

- **June (2026-06-10) bulk data: 30/30 files PASS the strict gate** (`bulkDownloadFileSchema`,
  every file) — ingest possible today with current code. **Fresh 2026-07-27 data: 0/32 FAIL**,
  every failure `unrecognized_keys` only (zero type changes, zero missing required fields —
  purely additive drift): lessons +3 keys (`oakUrl`, `canonicalUrl`, `restricted`), units up to
  +10 (`canonicalUrl`, `subjectSlug`, `examSubjects`, `categories`, `examBoard`, `tier`,
  `pathway`, `pathwaySlug`, `unitOptionGroup`, `programmeFactors`).
- `programmeFactors` is in the July data but NOT declared in `schema.json` (which is
  byte-identical to June) — a new inverted upstream defect (data ahead of schema); MCP-205
  carries it. The July data otherwise FIXES the June schema/payload contradiction (required
  `oakUrl`/`canonicalUrl`/`subjectSlug` now populated) and populates `restricted: true` on
  3,372 lessons, reconciling 100% with the check-restricted endpoints on the served set.
- Reasonable-minimum bridge to ingest July data (owner-requested determination, recorded on
  MCP-153): declare the 13 fields in the existing hand-authored templates (12 transcribed from
  `schema.json`, `programmeFactors` as explicitly-undeclared `z.unknown().optional()` with the
  defect documented), keep `.strict()`, regen + test updates + the filter-at-ingest exclusion
  (owner ruling on MCP-204: restricted lessons do not enter the index; revisit post-submission).
  One small PR, hours-class. NOT the rework — MCP-203 (schema-derived types) remains the cure.
- Data homes: both datasets live in worktree `mcp-203-bulk-rework` (June archive at
  `apps/oak-search-cli/bulk-downloads-archive-2026-06/`, fresh at `bulk-downloads/` incl. the
  updated tracked `manifest.json` riding that lane); the primary checkout's `bulk-downloads/`
  is the untouched June original.

## 2026-07-27 ~14:35Z — LANE COMPLETE through promotion (Swallow guards Tailwind, 805902)

MCP-152 → MCP-226 → MCP-153 arc fully delivered: PRs #584, #588, #589 merged to main;
restricted-lesson filter live at every generation surface; graph artifacts regenerated
(3,372 records / 2,641 slugs excluded); search re-indexed on the 2026-07-27 snapshot and
PROMOTED (v2026-07-27-132106 serving from 13:36Z, owner-carded go; restricted findable
0/2,641, was 2,348; rshe-pshe 329 live; March generation retained unaliased = rollback).
MCP-153 closed Done. Verification evidence + diagnosis trail on MCP-153/MCP-263.

Remainders (tracked, not this claim's intent): MCP-263 one authed live smoke of the
deployed MCP search tools (app reads the same primary aliases; confirmation not risk);
MCP-265 ground-truth re-truing (17/89 expectations upstream-restricted; two hard-zero
queries explained; add the fail-loud guard). Post-submission sequenced: MCP-203, MCP-205
(+MCP-252 anomaly counters), MCP-213, MCP-214/215, MCP-253.

Ops: worktree mcp-203-bulk-rework on jimcresswell/mcp-153-ingest-run at origin/main
(clean, no commits); both datasets in its bulk-downloads{,-archive-2026-06}; Redis
container oak-search-redis left running; ES MCP access arrives at next session restart
(owner-added) — prefer it over the curl+env path for future index work.

## 2026-08-03 — the upstream update lane (Birch holds Seedling, e48fe2): LIVE at a compaction boundary

THE CONTROLLING RESUME MAP is the delivery plan node
[`upstream-update-lane-completion`](../../../plans/delivery/upstream-update-lane-completion.plan.md)
— read it FIRST at any pickup; this entry is the thread-level index.

State frozen at the boundary (~10:55Z, gates re-trued ~11:00Z): MCP-462
delivered to review as draft PR #735 (head `bcdc62373`, bot-authored,
52 files) — Matt (`mantagen`) assignee + requested reviewer per the
owner's pass-to-Matt word; Copilot requested; MCP-462 In Progress.
MCP-463 (ADR-222 interim bulk truing + the untracked-data freshness
check) is the next act, sequenced after #735 merges — ALL owner-wait
legs were CLEARED by owner word at the boundary ("clear all wait for
owner legs now"): the truing executes autonomously under gateway
reviewers. ADR-222 phase 2 (full derivation) and the invoker next-page
signal proceed at their NAMED gate — release completion, per ADR-222's
own phasing — which is sequencing, not an owner-wait. MCP-464 (keywords silent
default-20 heads-up) is with Aakesh. ADR-222 landed at `612e60fe0`; the
2026-08-03 owner rulings (Matt-priority ticket carve-out, keep+re-pin
card, type-changes-discussed-first, the ratified source-derived-test
shape) are verbatim in the napkin's 2026-08-03 entries and enacted
in PR #735. Interleave results (Wyvern lifts Kindling, 1da2b1, n=2 pair
at owner word, 2026-08-03 ~13:00Z): the KeywordsResponseSchema promotion
question closed as a NO-OP — the newly named schema exists only in
generated files; every keyword-shaped type outside them (keyword-graph
corpus, lesson vocabulary, bulk lesson keywords, search index docs)
models a different surface, so no consumer hand-duplicates it. The
rendered-wholes frozen-at date now emits from its generator
(render-wholes.mjs); the first dated regen also trued a stale
paragraph (the download-asset fonts tip removed upstream at
cb8281a89). The lane claim `186e6899` is RETAINED; the seat continues
post-compaction, solo (fleet quiesced, Director dark, blockers card the
owner). This entry supersedes the item-2 "bulk schema.json is not
committed / author the future plan" framing above: ADR-222 now governs,
and the item-3 pagination-header P1 remains open, post-release.

## 2026-08-04 — Galaxy weaves Latitude (5baf4e), successor seat, session close

Seat chain: Birch holds Seedling (e48fe2) → Galaxy weaves Latitude
(5baf4e, owner-called PDR-063 adoption 13:02Z, claim relabelled honest
as 72b7aad7, closed at session end). Delivered: the owner-tasked all-PR
comment triage (rev 2, fleet-verified —
`.agent/reports/pr-comment-triage-2026-08-04.md` + conserved fleet
result JSON); #754 merged; the pnpm 11.20.0 pin completed
(owner-directed). Responsibility passed WHOLE to Petrel holds
Turbulence (a0892f) by owner word, including pushing and merging the
coordination branch and the report §1 agent-seat items (#751 ADR-163
contradiction cure, #737 record-integrity cures, #746 findings 3+4,
ADR-168 held until Matt answers on #749). Owner-attention items:
report §4. The day's incident record (pnpm store-binding; two stacked
workarounds; owner rulings) lives in the napkin 2026-08-04 entries,
MCP-498 (rewritten), and the comms stream; a retrospective is proposed
at owner word.
