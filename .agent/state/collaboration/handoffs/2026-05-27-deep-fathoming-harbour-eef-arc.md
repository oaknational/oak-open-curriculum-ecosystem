---
agent_name: Deep Fathoming Harbour
session_id_prefix: cef0b8
seed_digest: b3eadceb443d6810dc170ac4fa979c5818e30b1c03c9829fc1cbfc394e597124
platform: claude
model: claude-opus-4-7
created_at: 2026-05-27
last_updated_at: 2026-05-27
classification: pre-compaction-handoff
trigger: owner-requested compaction after EEF increments B + E landed
---

# Handoff — EEF Delivery Arc (post-B/E, continuing F → C/D → G → H)

Self-contained continuation brief. Read the meta-plan
`.agent/plans/sector-engagement/eef/current/eef-delivery-restructure.plan.md`
(increments A–H, the corrected Part 3 focus design, the resolved decisions) —
it is the durable roadmap. This record carries the live state + grounded facts
so F does not need re-grounding.

## Owner directives in force (this session)

1. **Do it ALL, properly** — the full B→H arc, no half-depth. "There is no
   different depth."
2. **Avoid unproductive ceremony** — minimal process/comms overhead.
3. **Comms ceremony minimal** — agent `Nebulous Threading Prism` (codex, prefix
   019e6b) is co-active on the `agentic-engineering-enhancements` thread
   (closed-claims archive curation + repo-continuity consolidation). Do NOT
   start comms monitors/heartbeats/ceremonial events. Collision-safety only.
   **Nebulous owns and is mid-edit on these files — never stage/commit them:**
   `.agent/memory/active/napkin.md`, `.agent/memory/operational/repo-continuity.md`,
   `.agent/memory/operational/threads/agentic-engineering-enhancements.next-session.md`,
   `.agent/state/collaboration/closed-claims.archive.json`,
   `.agent/state/collaboration/shared-comms-log.md`,
   `.agent/state/collaboration/active-claims.json`, and Nebulous's curator-pass
   file. My EEF work has ZERO file overlap with Nebulous.
4. **LTAE + verify before treating anything as an "open question"** — run every
   apparent open question through the long-term-architectural-excellence lens
   and verify the premise against real code/data. Most dissolve. Do NOT quiz the
   owner on decisions that doctrine + verification force. (This is how the
   "focus enum gap" question dissolved — see below.)

## Landed this session (branch feat/graph-foundations, primary checkout)

- **22351110** — Phase 0: PDR-085 Proposed→**Accepted**; meta-plan corrected to
  the data-derived focus design + resolved decisions.
- **01f5b402** — merge of `feat/eef-explore-evidence` into
  `feat/graph-foundations` (consolidation). Tree green (91/91). Pushed.
- **PR #122 OPEN** (feat/graph-foundations → main) — replacement vehicle, honest
  WIP description. **PR #121 CLOSED** with a pointer to #122. The `oak-wt-eef`
  worktree is now redundant (branch merged) — left intact, not removed.
- **9554ffbc** — increments **B + E**: feature flag `OAK_CURRICULUM_MCP_EEF_ENABLED`
  co-gating the EEF tool + prompt (default OFF). All gates green; co-gating
  integration test + e2e flag-ON HTTP assertion pass. B = co-gating TSDoc note
  on the EEF prompt in `mcp-prompts.ts`.

## NEXT STEP 1 — review B + E (not yet done; deferred to post-compaction)

Run on commit **9554ffbc** (and the consolidation): `code-expert` (gateway),
`type-expert` (the `eefEnabled` addition to the `RuntimeConfig` discriminated
union), `test-expert` (co-gating test shape — atomic landing, describe-vs-audit),
`mcp-expert` (prompt+tool co-gating registration correctness). B+E is committed
locally but NOT pushed and gate-1a is NOT closed, so this is real-time review,
not backfill. Critically re-verify findings against real code before acting
(specialist reviewers over-escalate).

## NEXT STEP 2 — increment F (the value tool) — DO NOT delegate the selection boundary

F is the high-judgment increment. Keep the selection-vs-ranking boundary in the
main thread (gate-1a = SELECTION + projection only; the scoring engine and
recommend/explain/compare tools stay gate-1b).

**Grounded facts (verified this session — re-verify only if acting changes them):**

- **Focus vocabulary is data-derived, NO crosswalk.** The EEF snapshot
  self-describes its controlled vocabulary in the top-level
  `school_context_schema` block of
  `packages/sdks/graph-corpus-sdk/src/eef-strands/eef-toolkit.ts` (currently
  STRIPPED by Zod in `strand-schema.ts`). Its `priorities.enum` is the
  authoritative 15-value vocabulary: `closing_disadvantage_gap`,
  `improving_reading`, `improving_writing`, `improving_maths`, `improving_oracy`,
  `improving_behaviour`, `improving_attendance`, `improving_send_provision`,
  `teacher_retention`, `curriculum_development`,
  `metacognition_and_self_regulation`, `effective_use_of_tas`,
  `parental_engagement`, `transition_support`, `post_covid_recovery`.
- **REPLACE the invented `focus` enum** (`EEF_EXPLORE_FOCUSES` in the tool's
  `tool-definition.ts`: `closing_disadvantage_gap, metacognition, literacy,
  numeracy, behaviour, feedback`) with `EEF_PRIORITIES` derived from the data.
  The invented enum is a defect (replace-don't-bridge, schema-first). Also update
  the EEF prompt's `focus` argument description in `mcp-prompts.ts` (line ~129,
  still carries the invented vocab) AND the local `focus` describe text in the
  app `prompt-schemas.ts` (`eefEvidenceGroundedLessonPlanArgsSchema`).
- **Model `school_context_schema`** in `strand-schema.ts` instead of stripping
  it; derive `EEF_PRIORITIES` (and validate `key_stage` against the data's
  `key_stage.enum` = `EYFS, KS1, KS2, KS3, KS4, KS5`). This IS the "strict
  SchoolContextSchema" the plan referenced — derive from the data's self-
  description.
- **Selection (loader-level):** `loadEefCorpus` (`loader.ts`) returns the full
  `strands` array (verified loader.ts:106) + `strandIds` (119). Seed-select by
  `most_relevant_priorities` (vs `focus`) and `most_relevant_key_stages` (vs
  `keyStage`) where `school_context_relevance` is present (17/30 strands). For
  the **13 strands without it**, graceful fallback by `subject`/`topic`/`tags`
  (verify the 13 carry usable `tags`). Never make a strand unreachable due to an
  absent optional field. Do NOT un-stub `enumerateNodes` (YAGNI).
- **Projection:** implement the `NodeProjection` applier (a no-op today — VERIFY
  in graph-view.ts / wherever projection lives). `manifest()` + `subgraph()` are
  LIVE; `summary/getNode/enumerateNodes/neighbours/findByTag` are NotImplementedYet
  (verify before relying).
- **Budget: MEASURE, don't trust.** Inherited estimate "30 full ≈ 16k, projected
  ≈ 3.4k" is UNVERIFIED — measure the real token count across the FULL
  CallToolResult (`structuredContent` + `content[1]` JSON mirror + citations +
  edges + envelope); must be **< 10k**. Record the worked estimate before F is
  considered landed.
- **F acceptance:** integration test on real EEF data; relevant projected
  sub-graph for a real context; <10k measured; `CitationsSchema.parse` passes;
  `_meta.attribution` set; `pnpm freshness:check` green. State: LANDED, flag OFF.

## NEXT STEP 3 — C + D (gate-1b, parallel, non-blocking)

C = ChatGPT structuredContent-only spike (decision note). Research already done
in the meta-plan §"Reference — MCP client output limits": dual-emit is the safe
gate-1a path; structured-content-only is a documented RISK for ChatGPT.
D = `formatGraphToolResponse` seam (structured-content-only), depends on C; 10
existing `formatToolResponse` callers unchanged.

## NEXT STEP 4 — G (gate-1a closure) then H (release)

- G: supersede `eef-first-feature.plan.md`; ADR-123 inventory amendment + the
  no-dead-code bullet (ONLY now true once tool+prompt ship); ff5 evidence;
  reachability indexing. **Note: the EEF branch already edited
  `docs/architecture/architectural-decisions/123-mcp-server-primitives-strategy.md`
  — check whether it prematurely added an EEF delivery claim and reconcile against
  the Definition of Delivery (no claim before delivery).** docs-adr-expert review.
- H: bring to flip-ready; verify a real MCP-client round-trip + ≥1 telemetry span
  (local/preview with flag ON). **The production `OAK_CURRICULUM_MCP_EEF_ENABLED=true`
  flip is the ONE genuine owner lever — surface it, do not flip prod autonomously
  (and likely no direct prod-env access anyway; no Vercel CLI).**

## Commit/coordination mechanics

- Pre-commit gates the FULL tree but the staged prettier/markdownlint are
  staged-only. Substrate/fitness gates are NOT in pre-commit. Stage by explicit
  pathspec (`git add apps/oak-curriculum-mcp-streamable-http/ packages/sdks/...`)
  — NEVER `git add -A` (would capture Nebulous's files). Check `.git/index.lock`
  before each commit; if present, surface to owner, do NOT delete or wait-loop.
- Do NOT run repo-wide `format:root`/`markdownlint:root` (would reformat
  Nebulous's dirty files). Format individual files with `pnpm exec prettier
  --write <file>`.
- `rg` in this shell mangles matched terms (renders hits as "n") — use `grep`
  or the Read tool, not `rg`, for searches.
- The Edit tool requires a Read-tool read of a file first (Bash `cat`/`sed`
  does not count) — Read then Edit.

## Tasks (in-session tracker)

Task 1 Phase 0 done; task 2 Phase 1 done; task 3 B done; task 4 E done; task 5 F
(next); task 6 C+D; task 7 G; task 8 H. F blocks G blocks H.

— Deep Fathoming Harbour (cef0b8)
