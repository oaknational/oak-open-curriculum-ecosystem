---
agent_name: Starless Prowling Mask
id: a81f75bf-c3ce-52b2-a356-31b74d70aaf5
platform: claude
model: claude-opus-4-7
session_id_prefix: 13c7d5
created_at: 2026-05-27T14:35:00Z
last_updated_at: 2026-05-27T14:35:00Z
classification: pre-compaction-handoff
trigger: owner-directed-compaction
peer: Galactic Dancing Constellation (7efeec) — LIVE, reviewer
---

# Pre-compaction Handoff #3 — Starless → post-compaction Starless

Owner directed compaction after commits 2 + 3 landed and before commit 4.
Resume the EEF value-PR. **Read the ARC channel first** (see below) — the
owner-directed betty/wilma panel findings will be waiting there.

## Git state (verify on resume)

- **My worktree**: `/Users/jim/code/oak/oak-wt-eef`, branch `feat/eef-explore-evidence`.
  - **Commit 1** `52972ad6` — type relocation (landed earlier session).
  - **Commit 2** `6ef9e65d` — `EefStrandsGraphView` adapter (WS4.5) + item G depcruise rule.
  - **Commit 3** `6ba7b5a0` — Zod loader + freshness + schema (real-data e2e proven).
  - Worktree deps BUILT; zod added to graph-corpus-sdk. Tree clean post-commit-3.
- **Shared primary**: `/Users/jim/code/oak/oak-open-curriculum-ecosystem`, `feat/graph-foundations`.
  Run all comms / collaboration-state CLI ONLY from here (item O: worktree resolves stale state).
- I hold `oak-wt-eef` (one writer per worktree). Galactic is read-only there.

## FIRST on resume — read the ARC channel + absorb panel findings

1. **ARC rapid-comms channel** (owner moved it here): `.agent/state/collaboration/experiments/agent-rapid-communication-and-gellings/README.md`.
   Tail it: `tail -n 0 -F <that path>` from the primary tree. Read turns ≥30.
2. **Owner-directed consolidated panel** is running via Galactic (turn 29): architecture-expert-betty
   (cohesion/coupling of the corpus/adapter/loader/freshness composition — the FIRST external-evidence-corpus
   pattern, repeats for Threads + future corpora) + architecture-expert-wilma (failure modes: 3-boundary
   fail-closed loader, disjoint error union, freshness edges, subgraph termination, build-order race item H,
   re-parse-per-call). **Findings route to me to ABSORB before commit 4** (de-risk the substrate before the
   tool builds on it). If findings landed during compaction, absorb them first.

## Coordination (roles fixed by owner)

- **Galactic = reviewer**, I = driver. Galactic accepted commit 2 (read-only) + reviewed commit 3
  (type+test, both findings absorbed). For commit 4 Galactic runs **mcp-expert + (type or test) + security-expert**
  (the teacher-input trust boundary). Full panel at PR-open per the 80% discipline.
- Galactic's cure PR #119 MERGED. Their EEF lane is review-only.
- **Register ledger**: I own it (driver owns the ledger). I deferred the commits 2+3 ledger lines +
  follow-ons to a single batch write at PR-open (avoid per-commit shared-tree churn). Do that at PR.

## The remaining value path

**Commit 4 — the `eef-explore-evidence-for-context` MCP tool** (the teacher-facing surface; in
`oak-curriculum-sdk`, a DIFFERENT package from commits 2-3). The value-PR-completing commit.

### Commit-4 blueprint (mapped via Explore agent — do not re-derive)

**CREATE:**

- `packages/sdks/oak-curriculum-sdk/src/mcp/evidence-corpus/tools/eef-explore-evidence-for-context.ts`
  — tool-def + input schema + validation + execution (follow the `aggregated-explore/` analog:
  `tool-definition.ts` exports `*_TOOL_DEF` + `*_INPUT_SCHEMA`; `validation.ts` exports
  `validate*Args(input): {ok:true,value}|{ok:false,message}`; execution calls `loadEefCorpus`,
  runs `subgraph`, builds the envelope).
- its `.unit.test.ts` — real-data end-to-end (load real corpus → tool returns real subgraph +
  citation/caveat envelope). **Do NOT assert strand counts** (bundle may update — corpus plan §639-651);
  assert envelope shape (non-empty citation tuple, `_meta.attribution` populated, `data_version` present).

**MODIFY (registration):**

1. `oak-curriculum-sdk/package.json` — add `"@oaknational/graph-corpus-sdk": "workspace:*"` to dependencies
   (the deferred dep from commit 1 lands HERE).
2. `src/mcp/universal-tools/types.ts` — add `'eef-explore-evidence-for-context'` to `AggregatedToolName` union.
3. `src/mcp/universal-tools/definitions.ts` — import the def + schema; add entry to `AGGREGATED_TOOL_DEFS`
   (typed `satisfies Record<AggregatedToolName,...>` — union + map must update together).
4. `src/mcp/universal-tools/executor.ts` — import validate+run; write `handleEefExploreTool`; add to
   `AGGREGATED_HANDLERS`.
5. `docs/architecture/architectural-decisions/123-*.md` — amend Tools table (+this tool) AND Prompts table
   (+`eef-evidence-grounded-lesson-plan`, already in MCP_PROMPTS but not the ADR). Flag ADR-123 enumeration
   debt (Betty's verdict) for forward refactor before a 2nd corpus.
6. Re-check `./mcp/*` export wildcard (register item I) now the tool lands under `mcp/`.

**CONVENTIONS (exact):**

- Tool name kebab, `eef-*` prefix (ADR-157/175).
- `description`: multi-paragraph, interpolate `AGGREGATED_EEF_EVIDENCE_GUIDANCE` from
  `evidence-corpus/eef-evidence-guidance.ts`.
- input schema: `z.ZodRawShape` with `.describe()` + `.meta({examples})` per field.
- `_meta`: `{ securitySchemes:[...], attribution: EEF_ATTRIBUTION }` (from `source-attribution.ts`).
  Attribution on the ENVELOPE, `_meta.attribution` NOT `_meta.source`, NOT per-citation.
- response: `formatToolResponse({summary,data,status,timestamp,toolName,annotationsTitle})` from
  `universal-tool-shared.ts`. `data.citations` MUST be `Citations` (non-empty readonly tuple, each
  `Citation` has non-empty `caveats` tuple — `citation-shape.ts`). If subgraph returns no strands →
  return an ERROR, not an empty-citation response (the tuple is a compile-time non-empty constraint).
- telemetry: construct `EvidenceCorpusSpanConfig<ExploreSpanAttrs>` (name `'evidence_corpus.explore'`)
  INLINE at the instrumentation site (no helper at gate-1a); attrs include phase/subject/key_stage/
  focus?/result_count/latency_ms. Pass to the Sentry runtime via deps.
- phase uses the canonical `EefPhase` (`early_years|primary|secondary`) from graph-corpus-sdk.
- prompts register separately (`MCP_PROMPTS` array + `getPromptMessages` switch) — the prompt is
  already registered; the tool only needs the AGGREGATED_TOOL_DEFS path.

**GOTCHAS:** non-empty citation/caveat tuples are compile-time (not just runtime); `AggregatedToolName`
is a hand-maintained union (update with the map); `_meta.attribution` not `_meta.source`; security-expert
review required (teacher-context input is the new trust boundary).

### After commit 4

- Open the value-PR (`feat/eef-explore-evidence` → main). **Rebase onto latest origin/main first**
  (PR #119 + a release merged after my base 037d0f7e).
- Full consolidated review panel at PR-open (no-backfill = before merge).
- Write the register ledger (commits 2-4 VER lines + the 3 follow-ons) in one batch.
- `pr3-gate-1a-closure` is a separate closeout (acceptance bundle, release-readiness go/no-go).

## Open follow-ons to carry (not commit-4-blocking)

1. `school_context_relevance` sub-field modelling when a surface first consumes it (currently open record).
2. Projection: shared applier must land in `graph-core` BEFORE a 2nd adapter ships `projection`.
3. eslint: `createSdkBoundaryRules` has no `graph-corpus-sdk` role → ADR-179 direction only enforced at
   depcruise (item G). Galactic folding into their item-O thread.
4. WS4.5-class fitness check (verify plan LANDED claims vs code) — recur-proofs plan drift.

## 80%-delivery discipline (still in force)

Plan: `.agent/plans/sector-engagement/eef/current/eef-value-delivery-discipline-2026-05-27.md`.
Per-commit ledger: VER≥0.80 | ≤2 novel reviewers (panel at PR) | new-artefacts=0 | value-advance Y.
Commits 2+3 held ~0.85 VER, 2 reviewers each, 0 new artefacts, advanced every commit. Owner asked for a
ledger check-in at each commit boundary — keep doing that. Commit 4 legitimately takes mcp+security+1
(it's the PR-completing commit + a real trust boundary).

— Starless Prowling Mask (13c7d5)
