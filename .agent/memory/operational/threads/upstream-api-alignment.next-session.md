# Thread: upstream-api-alignment

**Purpose**: Bring the Oak Open Curriculum ecosystem into alignment with the evolving
upstream Oak API + bulk export, and establish a repeatable, observable alignment process.
Trigger instance (2026-06-30/07-01): upstream added a `programmes` resource family (5 GET
endpoints + 5 schemas).

## MCP-590 IN FLIGHT — slice 1 shipped as PR #871; slices 2/3 mapped (Wren calls Downdraft 6b29b5, 2026-08-12 ~18:5xZ)

> **SUPERSEDED / SEAT CLOSED (2026-08-13):** the owner carded this lane to the
> Director (**Plover lifts Troposphere**), who ADOPTED Wren's claim (now
> `2d76cc84`) and has driven #871 on to tip `4083977bd` — folding in the
> 2026-08-13 owner ruling that index families stay consistent (`includeRestricted`
> is now REJECTED for index-producing runs via `enforceRestrictedInclusionBoundary`,
> ADR-224). The **authoritative** MCP-590 resume map is now
> `director-handoff §COMPACTION FREEZE 10` (tip `b32ac02f8`): #871 frozen
> mid-round-7; first resume act = the vocab-gen restricted-inclusion guard cure
> (committed generated-corpus exposure), then recount + bot REST merge under the
> owner's standing word; then slice-2 error-envelope PR, slice-3 operational
> rebuild, demo-default flip. **Wren calls Downdraft (6b29b5) is CLOSED** — no
> active claim, all processes stopped, worktree `mcp-590-restricted-switch` left
> for the Director's drive. The block below is Wren's historical snapshot at the
> slice-1 push; the slice-2 error-envelope probe finding it records still stands.

Ticket **MCP-590** (MCP team, First Major Release project, related MCP-204/MCP-100)
realises the ratified Bucket-1 plan. Worked in worktree
`.claude/worktrees/mcp-590-restricted-switch` (branch
`jimcresswell/mcp-590-restricted-exclusion-switch`, off origin/main `d105b4ab2`),
KEPT on disk for slices 2/3.

- **Slice 1 — configurable restricted-exclusion switch (default exclude): SHIPPED
  to review as PR #871** (head `4314a0c05`, jimbot label, Copilot requested;
  MCP-590 → In Review). `includeRestricted?: boolean` (default false = exclude,
  byte-for-byte preserving) on `excludeRestrictedLessons`, threaded through both
  exclusion call sites + the SDK lifecycle service (the `runIngestAndVerify`
  option-narrowing was a silent-drop point — found by full-path tracing, fixed,
  now pinned by a forwarding regression test) + CLI `--include-restricted` on
  `versioned-ingest` and `stage`. ADR-224. Two opus reviewers cleared:
  test-expert PASS (2 coverage gaps closed — `toBulkDataInputs` toggle +
  `createPipelineConfig` default/override); code-expert APPROVE (threading
  complete every hop, default preserved, no other drop site; sandbox `es:ingest`
  `ingest-harness-batch` is the superseded non-filter path). `pnpm check` green.
  **NEXT: reviewer/Copilot convergence → Director-side bot REST merge (never squash).**
- **Slice 2 — MCP error envelope: pickup-verification SETTLED (mcp-expert probe,
  first-hand against the SDK).** `structuredContent` DOES survive on an
  `isError:true` CallToolResult — spec 2025-06-18 places no mutual exclusion; SDK
  `@modelcontextprotocol/sdk@1.30.0` sends the result as-is (base looseObject,
  passthrough), and `validateToolOutput` (server/mcp.js:186-195) never validates
  structuredContent on error (`if(result.isError) return`) with NO outputSchema
  declared in-repo. `formatError` (universal-tool-shared.ts:107-110) RETURNS an
  error (not throw), so the SDK throw-path `createToolError` never fires — the
  drop of `code` is ours to fix. BUILD: `formatError` emits
  `{ content: [humanText, jsonEnvelopeText], isError: true, structuredContent: { error: { code, message, upstreamMessage } } }`
  — nest under `error` (future success-outputSchema safe); MIRROR the JSON into
  `content[1]` because `content` is the only channel guaranteed surfaced on error.
  NOT `_meta` (repo documents it widget-only, "Model never sees _meta"). Callers:
  `formatError` + `universal-tools/executor.ts:55` + `aggregated-fetch/execution.ts:112`.
  Then contract-pin the upstream vocab (brittle `data.cause.includes('blocked')`
  at `classify-error-response.ts:83`).
- **Slice 3 — rebuild + promote** from the fresh 2026-08-12 bundle
  (`apps/oak-search-cli/bulk-downloads/`) via `admin versioned-ingest` (or
  `stage`→`promote`). Owner-carded alias swap (MCP-153 precedent); confirm
  rshe-pshe presence.

Claim (upstream-api-alignment thread; areas sdk-codegen/bulk + vocab-gen +
search-cli indexing/admin) OPEN. Comms watcher was stopped at the compaction
freeze — re-arm at resume. The block below is the pre-implementation pickup record.

## BUCKET-1 RATIFIED, BUCKETS 2/3 SKETCHES — 2026-08-12 ~17:3xZ (owner decision card; Wren calls Downdraft 6b29b5)

The three Bucket plans were authored, validated (`validate-plan-corpus` OK),
assumptions-expert-reviewed (READY-WITH-NOTES, all 11 notes folded), and
presented to the owner as a ratification card. **Owner answer: "Ratify Bucket 1
only."**

- **`lesson-search-freshness-and-error-envelope` (Bucket 1): RATIFIED** (status
  ratified; `ratified_by: Jim Cresswell`, `ratified_date: 2026-08-12`,
  `ratified_where` points here). Decision-complete, no open owner gates; a seat
  (TBD) picks it up nowish. Encodes the owner rulings below: restricted-exclusion
  as a documented configurable switch (default exclude); structured
  `{code, message, upstreamMessage}` MCP error envelope; error-vocabulary contract
  tests; no fallback.
- **`lesson-retrieval-boundary-differentiation` (Bucket 2) and
  `lesson-search-index-automation` (Bucket 3): remain SKETCHES** (unratified) — to
  be ratified later, closer to their pickup (owner's explicit choice to keep the
  future roadmap provisional). Both serve `first-major-release` and depend on
  Bucket 1 (Bucket 2 blocking, Bucket 3 beneficial).
- **PICKUP = THIS SEAT (Wren calls Downdraft 6b29b5)** — owner card 2026-08-12
  ~17:3xZ: "This seat picks it up." **POST-COMPACTION RESUME TASK: implement
  Bucket 1** in a fresh worktree; first slice = the documented, configurable
  restricted-exclusion switch (default exclude). **Machinery verified first-hand
  2026-08-12 (do NOT re-derive):**
  - Restricted filter is HARDCODED —
    `packages/sdks/oak-sdk-codegen/src/bulk/restricted-lesson-filter.ts`
    (`excludeRestrictedLessons` / `excludeRestrictedLessonsFromFile`, no param),
    unconditional at the TWO exclusion sites
    `apps/oak-search-cli/src/lib/indexing/bulk-ingestion.ts:136` and
    `packages/sdks/oak-sdk-codegen/vocab-gen/vocab-gen.ts:176`; the `admin verify`
    expected-count is DERIVED (`run-versioned-ingest.ts:78-79`), tracks the switch.
    Pinning test: `restricted-lesson-exclusion.integration.test.ts`.
  - MCP error `code` dropped at `formatError`
    (`packages/sdks/oak-curriculum-sdk/src/mcp/universal-tool-shared.ts:107`); two
    callers `universal-tools/executor.ts:55` + `aggregated-fetch/execution.ts:112`;
    the `structuredContent` channel exists (SDK 1.30.0, already used on the SUCCESS
    path). Classifier `classify-error-response.ts` (brittle
    `data.cause.includes('blocked')` at :83 is the unpinned contract surface).
  - Rebuild uses `admin versioned-ingest` (or `admin stage` → `admin promote`),
    NOT the stale `INGESTION-GUIDE.md`; bundle at `apps/oak-search-cli/bulk-downloads/`
    (manifest `downloadedAt` 2026-08-12T10:50Z, restricted flags present).
  - The plan body carries the four ACs + the one pickup-verification (does the
    transport carry `structuredContent` on `isError:true`, and do clients read it
    on error results — probe before committing the shape). Doc the choice in a
    short ADR (ADR-093/140 neighbours), not the runbook.

## OWNER RULINGS + POST-COMPACTION TASK 2026-08-12 ~14:4xZ — MCP lesson-retrieval (relayed via Wren calls Downdraft 6b29b5 at the #865 wrap)

Skua binds Vortex's MCP lesson-retrieval investigation
(`.agent/reports/mcp-lesson-retrieval-gap-analysis-2026-08-12.md`) reached the
owner, who ruled via decision cards. The "missing vs not allowed" frame is the
upstream response convention (404 = missing / unknown slug; 400 plus a "not
available" message = not-allowed / copyright-restricted; a deliberate anti-leak
policy — status conflated, message-differentiated; realised fully only on
`/assets`).

**RULINGS (2026-08-12):**

- **Index inclusion policy: KEEP RESTRICTED LESSONS OUT — for now.** Document the
  choice; make it CONFIGURABLE so it is cheap to revisit. The Bucket-1 index
  rebuild proceeds with restricted EXCLUDED behind a documented config switch,
  not a hard exclusion.
- **Degraded-summary fallback (Bucket 3 candidate): DROP IT.** No fallback ever;
  the MCP layer only explains unavailability and points at the website.
- **Reporter reply + API-team items: NOTE, MAKE DISCOVERABLE, BACKLOG.** Do NOT
  send the reporter reply or raise API-team items yet. Keep the findings
  discoverable (Skua's report is the record); start compiling a BACKLOG for WHEN
  THE API CODE MOVES into the repo (ties to the upstream-API-as-workspace RFC).
  Backlog items: transcript-500 and quiz-silent-empty unknown-slug defects; the
  KS4-science summary collateral (era-2 subject gate 404s every KS4-science-only
  lesson); optional message-differentiation and spec-enumeration; the OWA/Hasura
  view-history data question.
- **#865 bar (separate lane): ACCEPT the residual** — recorded in
  `workspace-config-isolation.next-session.md`, not this lane.

**POST-COMPACTION TASK (owner, ordered AFTER the compaction):** produce a
**DECISION-COMPLETE PLAN for Bucket 1**, to be picked up NOWISH by a seat (TBD),
PLUS follow-on future plans for Buckets 2 and 3. Source: Skua's report §"What the
MCP layer CAN handle".

- **Bucket 1 (decision-complete, nowish):** (1) rebuild the search index from the
  fresh 2026-08-12 bundle with restricted EXCLUDED behind a documented config
  switch (owner ruling) — restores ogl-compatible freshness and is the falsifier
  for the unproven 2026-07-27 drop; (2) preserve error structure through the MCP
  envelope (`{code, message, upstreamMessage}`; the SDK's
  `classify-error-response.ts` already classifies, the MCP result flattens it to
  prose); (3) contract-pin the upstream error vocabulary (rides with 2).
- **Bucket 2 (follow-on plan):** `fetch` 404 enrichment via the check-restricted
  oracle; a coherence canary (`probe-lesson-availability.ts` is its seed).
- **Bucket 3 (follow-on plan):** automatic index updates (scheduled
  download/ingest/alias-swap plus a reconciliation gate and a vintage stamp). NO
  degraded fallback (dropped by ruling).

Skua binds Vortex (the investigator) closed out; the picking-up seat is TBD,
owner-assigned. This block is the discoverable pickup for that seat.

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

## 2026-08-03 ~08:45Z — BINDING lane constraint (owner word, verbatim-critical; Magnetar binds Oblivion, 74d914)

Owner, on the spec-alignment findings: "please be very careful before chasing
any type issues, there are correct and non-trivial approaches here, and I
will work with you to identify and apply them." BINDING on the lane: the
type-layer legs (the z.toJSONSchema examples round-trip contract, the
KeywordsResponseSchema promotion's generated types, anything in the zod/
openapi-zod-client-adapter layer) are OWNER-COLLABORATIVE — identified and
applied WITH him, never autonomously cured. The non-type legs (override
re-evaluation needs the live-API semantics probe first; served-tool-table
artefact regen) wait for routing. The probe worktree (upstream-spec-probe,
refreshed cache + regen uncommitted) is the lane's opening state; this
constraint rides any routing brief VERBATIM. (Homed from the napkin at the
2026-08-07 consolidation; the constraint was captured 2026-08-03 and had no
thread-record presence until now.)

## 2026-08-12T12:24:52Z — owner-private direction paper delivered (Foundry tracks Shimmer, ead103)

An owner-directed leadership direction paper was drafted, peer-reviewed
(four ARC review rounds with Skua binds Vortex, fact-safety FINAL
12:24Z, plus two independent prose-expert passes), revised through six
owner-directed rounds, and delivered to `.agent/reference-local/`
(gitignored; the owner holds it). The owner classified the paper's
content PRIVATE (2026-08-12): tracked surfaces carry generic lessons
only (napkin, this record); the collaboration dialogue and reviews are
conserved beside the paper in reference-local. OPEN owner question
(non-blocking, routed to Jim by Skua): does the internal decision-paper
class sit inside editorial-tone.md's contractions-always scope? Whichever
way, the answer belongs in editorial-tone.md's scope list.

## 2026-08-12T12:30:26Z — contractions question DISCHARGED (owner ruling; Foundry tracks Shimmer, ead103)

Owner, 2026-08-12, verbatim: "contractions are fine, but editorial flow is
more important". Applied to the paper as a flow-first pass (contractions
where they ease reading; emphatic uncontracted forms kept for weight).
The paper (reference-local, owner-private) is final. Curation candidate
for the next editorial-tone.md touch: add a
scope-list clause for the internal decision-paper class recording this
ruling (flow governs; contractions permitted, not mandated), so the next
author doesn't have to ask — the reviewer's original suggestion, now with
the owner's answer to encode.

## 2026-08-12T12:33Z — lesson-retrieval analysis lane CLOSED (Skua binds Vortex, 027610, claude-code/claude-fable-5)

Owner-directed analysis of a third-party bug report, complete. The
authoritative record is
`.agent/reports/mcp-lesson-retrieval-gap-analysis-2026-08-12.md` (landed in
this closeout's docs commit): three findings — the upstream subject-gate
collateral (all KS4-science-only lesson summaries 404 since PR #309,
2026-07-22; intent evidence says financial-education blocking, collateral
unadjudicated), the restricted-content availability semantics (the
reporter's 8 = 8/8 restricted; the search-index gap = the restricted class,
34/34 in science), and undifferentiated summary-404 semantics (the
response-code convention — 404 missing / 400+"not available" restricted —
is realised fully only on /assets; /quiz silent-200-empty and /transcript
500 mishandle the missing half). Our-side work is bucketed in the report
(Now / Next / Invest); the bucket-1 index rebuild is gated on ONE owner
decision — whether restricted lessons' metadata is indexed (recommended
yes, flagged). Upstream items are held as questions-with-evidence, not
filed bugs, per owner scepticism: the KS4 collateral question, the
transcript-500 + quiz-silent-empty defects, optional message-differentiation
restoration and spec vocabulary enumeration. The reporter reply is
sketched in the report. Principal-checkout bulk data refreshed 2026-08-12
at owner word (34 files, rshe-pshe new, schema unchanged, type-check
green); the probe script `apps/oak-search-cli/scripts/probe-lesson-availability.ts`
demonstrates the three availability classes in one run. Both lane claims
released at close; no work in flight; next actions are all owner-decision-
gated and enumerated in the report's routing section.
