---
plan_id: eef-delivery-restructure
name: "EEF Delivery Restructure — Definition of Delivery + gate-1a rebuild"
overview: >-
  Owning meta-plan for the EEF First Feature restructure around the new
  Definition of Delivery doctrine. Establishes what counts as delivered
  (value received by a named beneficiary; LANDED vs RELEASED), restores
  sub-graph selection as a gate-1a requirement, sets a 10k output budget,
  adds a basic feature flag co-gating the EEF tool + prompt, and corrects
  every plan/ADR surface so no false-delivery claim survives. Decomposed
  into delivery increments A–H, each named by beneficiary and delivery state.
type: cross-collection-coordination-spine
status: current
parent_plans:
  - "../../../graph-mvp-arc.plan.md"
  - "./eef-first-feature.plan.md"
sibling_plans:
  - "./eef-evidence-corpus.plan.md"
  - "../../../connecting-oak-resources/knowledge-graph-integration/active/graph-stack.plan.md"
specialist_reviewer: "code-expert, docs-adr-expert, assumptions-expert, mcp-expert, type-expert, test-expert"
isProject: false
todos:
  - id: inc-a-doctrine
    content: >-
      Definition of Delivery doctrine — directive + PDR-085 + index wiring.
      Beneficiary: dev-human + dev-agent. State: LANDED. **DONE — committed
      27956bb6 on feat/graph-foundations** (directive .agent/directives/
      definition-of-delivery.md, PDR-085, practice-index Directives row,
      decision-records README, AGENT.md Essential Links). PDR-085 Status:
      Accepted (owner-elevated 2026-05-27).
    status: completed
    depends_on: []
  - id: inc-b-prompt-disposition
    content: >-
      EEF prompt latent-dead-code disposition — TSDoc note in mcp-prompts.ts
      naming the co-gating requirement; keep generator+test as substrate.
      Beneficiary: dev. State: LANDED. Branch: feat/graph-foundations
      (post-consolidation).
    status: pending
    depends_on: []
  - id: inc-c-chatgpt-spike
    content: >-
      ChatGPT structured-content-only verification spike — does ChatGPT
      consume a structuredContent-only result (no content[] mirror)? Gate-1b
      gate for the graph-tool category; NON-blocking for gate-1a (dual-emit
      is the safe path). Beneficiary: dev. State: LANDED (decision note).
    status: pending
    depends_on: []
  - id: inc-d-graph-formatter
    content: >-
      formatGraphToolResponse seam (structured-content-only) — gate-1b,
      spike-gated by inc-c. 10 existing formatToolResponse callers unchanged.
      Beneficiary: dev-agent. State: LANDED.
    status: pending
    depends_on: [inc-c-chatgpt-spike]
  - id: inc-e-feature-flag
    content: >-
      Basic feature-flag implementation — OAK_CURRICULUM_MCP_EEF_ENABLED in
      BaseEnvSchema → toBooleanFlag → eefEnabled on SharedRuntimeFields;
      co-gate EEF tool (filter out of registerTools) + prompt (add to
      register-prompts PROMPT_REGISTRATIONS); registration-gating is NEW
      logic (useStubTools only gates the executor path). New co-gating
      integration test + fix the broken every-universal-tool-registered
      assertion. Beneficiary: dev. State: LANDED. Branch:
      feat/graph-foundations (post-consolidation).
    status: pending
    depends_on: []
  - id: inc-f-selection-tool
    content: >-
      EEF substrate + tool with selection + projection (the value PR) — model
      school_context_schema (stop stripping) + derive EEF_PRIORITIES; REPLACE
      the invented `focus` enum with EEF_PRIORITIES (schema-first, no
      crosswalk); loader-level seed selection (most_relevant_priorities /
      most_relevant_key_stages where present, graceful subject/topic/tags
      fallback for the 13 universal strands); implement the NodeProjection
      applier (no-op today — verify); tool returns a relevant projected
      sub-graph measured <10k across the FULL CallToolResult incl content[1].
      Beneficiary: dev + dev-agent. State: LANDED (flag OFF). Ex-"open
      questions" resolved (Part 3). Depends on inc-e. Branch:
      feat/graph-foundations (post-consolidation).
    status: pending
    depends_on: [inc-e-feature-flag]
  - id: inc-g-closure-restructure
    content: >-
      Gate-1a closure ceremony + surface restructure — supersede
      eef-first-feature.plan.md; ADR-123 inventory amendment + no-dead-code
      bullet (only true once tool+prompt ship); ff5 evidence; reachability
      indexing. Beneficiary: dev + dev-agent. State: LANDED. Depends on
      inc-f. (Forward-looking false-claim retraction is pulled earlier — see
      §Sequencing note.)
    status: pending
    depends_on: [inc-f-selection-tool]
  - id: inc-h-release
    content: >-
      Release EEF to end users — OAK_CURRICULUM_MCP_EEF_ENABLED=true in
      production; verify real MCP-client round-trip + telemetry span.
      Beneficiary: end user. State: RELEASED. Owner-timed (open decision 5);
      LANDED-only is a valid resting state. Depends on inc-g.
    status: pending
    depends_on: [inc-g-closure-restructure]
last_updated: 2026-05-27 (authored from the approved Claude meta-plan
  prancy-shimmying-crystal; Increment A landed at 27956bb6)
---

# EEF Delivery Restructure — Owning Meta-Plan

## Context

The EEF First Feature reached a state where activity was repeatedly mistaken
for delivery: commits merged, a PR opened, gate-1a called "complete", plan
todos checked — while value reached **no one**. Root cause (owner-named): the
absence of a **Definition of Delivery** grounded in *value received by a named
beneficiary*, not *artefacts produced*. This is a direction change, not a tweak.

Three corrections drive the restructure:

1. **Sub-graph SELECTION for large graphs was always a requirement.** Its
   removal (the 2026-05-21 "whole-graph at gate-1a" reframe, recorded as
   "planning amendments only, NO product code") was never ratified. The
   "sequencing change, not a scope reduction" claim must be retracted.
2. **The Definition of Delivery doctrine** (Increment A, landed) reclassifies
   the prior EEF state: the prompt was latent dead code, gate-1a was not
   "complete", and whole-graph was a failed agent-hop (~16k tokens the
   orchestrating model could not ingest within budget).
3. **No non-functional partial features reachable by production users.**
   Interdependent surfaces (a prompt and the tool it calls) are co-gated so
   partial surfacing is impossible by construction.

### Verified current state (origin/main + PR #121 worktree, triple-checked)

- The EEF prompt `eef-evidence-grounded-lesson-plan` is defined+routed in the
  SDK (`mcp-prompts.ts`) but **NOT served in production** — the app's
  `PROMPT_REGISTRATIONS` (`register-prompts.ts`) has 4 hardcoded entries and
  never iterates `MCP_PROMPTS`. It is **latent dead code**, not a live prod
  defect.
- The EEF tool `eef-explore-evidence-for-context` exists **only on PR #121**.
  Merging #121 as-is would register a **live tool with no co-registered
  prompt** — the opposite orphan.
- The substrate (`graph-corpus-sdk/src/eef-strands/`) is an `export {}` stub
  on main; adapter/loader/freshness/schema live only on PR #121.
- `GraphView`: `manifest()` + `subgraph(rootIds, depth)` are LIVE;
  `summary/getNode/enumerateNodes/neighbours/findByTag` are `NotImplementedYet`.
- Feature-flag plumbing exists (`OAK_CURRICULUM_MCP_USE_STUB_TOOLS` →
  `toBooleanFlag` → `RuntimeConfig`) but gates the executor path, **NOT
  registration** — registration-gating is new logic.
- Token facts: 30 full strands ≈ 16k tokens (over budget); 30 tight-projected
  ≈ 3.4k (under). Selection is a value/relevance requirement; projection
  handles raw budget; citations + dual-emission add weight that
  selection+projection keep under 10k. **The `NodeProjection` applier is
  accepted-but-not-applied today — implementing it is in F's scope.**
- Seed-data: `school_context_relevance` is preserved as an untyped open record
  today (`z.record(z.string(), z.unknown())`), present on 17/30 strands. Its
  structure is **self-described** by the snapshot's top-level
  `school_context_schema` block (stripped by Zod today). The authoritative
  `focus` vocabulary is that block's `priorities.enum` (15 values: e.g.
  `improving_maths`, `improving_reading`, `improving_behaviour`,
  `metacognition_and_self_regulation`, …) — **NOT** the invented gate-1a
  `focus` enum (`numeracy`/`literacy`/`feedback`/…). F models
  `school_context_schema`, derives `EEF_PRIORITIES`, and replaces the invented
  enum (Part 3 correction). The earlier "numeracy maps to nothing / rename to
  mathematics / crosswalk" framing was an artefact of not reading the data's
  self-description.

## Part 1 — Definition of Delivery doctrine (Increment A — LANDED 27956bb6)

Delivery = value received by a named beneficiary, not artefacts produced. Six
criteria (named beneficiary; real value integrity-intact; reachable in their
real environment; whole for its unit; observable signal of receipt — can-receive
not did-receive-at-scale; no regression of others' value). Two states: LANDED
(dev/agent, may be gated OFF) vs RELEASED (end user, gate ON), with a feature
flag as the seam. Delivery chains fail at the weakest hop. Pointed not-delivery
list (merged code / green gate / open PR / checked todo / branch code /
registered-but-orphaned surface are NOT delivery).

Homes: `.agent/directives/definition-of-delivery.md` (repo-bound) + PDR-085
(portable mirror) + practice-index Directives row + decision-records README +
AGENT.md anchor. PDR-085 Status: **Accepted** (owner-elevated 2026-05-27, after
the first application exercised the doctrine on this EEF gate-1a delivery plan).

## Part 2 — Delivery-increment decomposition

See frontmatter `todos` (A–H) for beneficiary / state / dependencies. Critical
value path: **E → F → G → H**. First value-delivering increment: **F at
LANDED**. C→D is a parallel gate-1b track and does NOT block F — gate-1a uses
the existing dual-emit `formatToolResponse` (the safe, maximally-compatible
shape); the spike gates only the structured-content-**only** optimization. A
and B are parallel with the value path.

## Part 3 — Seed selection (the restored requirement)

Loader-level seed selection over the corpus `strands` (`loadEefCorpus` returns
the full `strands` array — verified `loader.ts:106,119`), then
`subgraph(seeds, depth)`, then a tight `NodeProjection`. **`enumerateNodes`
stays stubbed** — loader-level filtering is sufficient (YAGNI).

**Focus vocabulary — derived from the data, not invented (correction
2026-05-27).** The EEF snapshot self-describes its controlled vocabulary in the
top-level `school_context_schema` block (currently stripped by Zod). Its
`priorities.enum` is the authoritative 15-value vocabulary:
`closing_disadvantage_gap`, `improving_reading`, `improving_writing`,
`improving_maths`, `improving_oracy`, `improving_behaviour`,
`improving_attendance`, `improving_send_provision`, `teacher_retention`,
`curriculum_development`, `metacognition_and_self_regulation`,
`effective_use_of_tas`, `parental_engagement`, `transition_support`,
`post_covid_recovery`. The tool's `focus` parameter and the strand
`most_relevant_priorities` field both draw their value space from this enum
(`EEF_PRIORITIES`) — schema-first, **no crosswalk, no invented values**. The
gate-1a tool ships an invented `focus` enum
(`numeracy`/`literacy`/`feedback`/`behaviour`/`metacognition`) that is a defect
to **replace** (replace-don't-bridge), not bridge.

F-scope prerequisites (both grounded in the data's self-description):

1. Model `school_context_schema` in the strand schema instead of stripping it;
   derive `EEF_PRIORITIES` (and validate `key_stage` against the data's
   `key_stage.enum`). This *is* the "strict `SchoolContextSchema`" the plan
   referenced — the data describes itself, so the schema is derived, not
   hand-invented.
2. Implement the `NodeProjection` applier (a no-op today — verify at F).

**Selection over the full corpus (graceful degradation).** Seed-select by
`most_relevant_priorities` (vs `focus`) and `most_relevant_key_stages` (vs
`keyStage`) where `school_context_relevance` is present (17/30 strands —
verified); for the 13 strands without it, fall back to `subject`/`topic`/`tags`
matching. No strand is silently unreachable because an OPTIONAL field is
absent. Relevance *ordering* among selected strands is gate-1b ranking's
concern, not gate-1a selection's.

### Ex-"open questions" — resolved by LTAE + verification (not owner menus)

1. **`focus` enum** — RESOLVED: derive from data (`EEF_PRIORITIES`), replace
   the invented enum. Schema-first + replace-don't-bridge force this; the
   "numeracy maps to nothing" framing was an artefact of not reading
   `school_context_schema`.
2. **13 universal strands** — RESOLVED: include with fallback seeding; never
   make data unreachable due to an absent optional field.
3. **`enumerateNodes`** — RESOLVED: loader-level filtering; do not un-stub
   (YAGNI; `loadEefCorpus` exposes `strands`).
4. **PDR-085** — RESOLVED: Accepted (owner-elevated 2026-05-27).
5. **Release timing (H)** — RESOLVED default: LANDED-only is the honest resting
   state; the production flag-flip is the one genuine owner lever, surfaced at
   H.

## Part 4 — Basic feature-flag implementation

1. Declare `OAK_CURRICULUM_MCP_EEF_ENABLED: z.enum(['true','false']).optional()`
   in `BaseEnvSchema` (`apps/oak-curriculum-mcp-streamable-http/src/env.ts`).
2. Map via `toBooleanFlag` to `runtimeConfig.eefEnabled`
   (`runtime-config-from-validated-env.ts`), **default OFF**; add `readonly
   eefEnabled: boolean` to `SharedRuntimeFields` (`runtime-config-support.ts`).
3. Co-gate registration (two operations): **tool = filter out** of the
   `registerTools` path in `handlers.ts` when `!eefEnabled`; **prompt = add
   in** — thread `eefEnabled` into `registerPrompts` (`register-prompts.ts`)
   and conditionally add the EEF entry (first wiring, as a gated unit).
4. New co-gating integration test (OFF ⇒ neither in served lists; ON ⇒ both);
   update the existing `handlers-tool-registration.integration.test.ts`
   every-universal-tool assertion (breaks at flag-default-OFF).

## Part 5 — Documentation / surface restructure

**Supersede, don't rewrite** `eef-first-feature.plan.md`. New gate-1a contract:
selection + projection + 10k budget + feature-flag precondition + LANDED/RELEASED
acceptance; retracts "sequencing change, not scope reduction".

Surfaces + invalidated claims: `eef-first-feature.plan.md` (retract L109-110;
ff4 "t10 ✓"; ff6 add selection; substrate-dep "LANDED"); `eef-evidence-corpus.plan.md`
(gate-grouping defers selection to gate-1b; t10 status:completed);
`graph-mvp-arc.plan.md` (gate-1a omits selection; "no scope reduction");
`please-do-a-deep-mighty-peach.plan.md`; `feat-mcp-graph-support-foundation-meta.md`
(stale: last_updated 2026-05-22, missing this plan + please-do-a-deep-mighty-peach
in related_plans); `graph-combinatorial-arc.plan.md` (gate-1a-closure
precondition). Thread `eef.next-session.md`: annotate the 2026-05-21 entry as
the unratified selection-removal.

**ADR actions (intent vs status discipline):** ADR-123 *amend* — add EEF
tool+prompt AND fix the now-false "no dead code" bullet (**only at G, after F
ships** — adding to the inventory before shipping is itself a false-delivery
claim). ADR-173 *narrow status note* — adapter is a WS4.5 stub pending gate-1a;
do NOT retract (ADR records topology intent). ADR-157 *no gate-1a amendment*
(its eef-* resources are gate-1b). ADR-175/179 *no edits* — reaffirm in closure
narrative only.

### Sequencing note (eating our own dog food)

Part 5 splits by the Definition of Delivery: **forward restructure** (rewrite
the gate-1a contract; retract the false `t10 ✓` / `WS4.5 LANDED` / "sequencing
not scope reduction" claims; supersede eef-first-feature; repoint plans at the
doctrine; thread annotation; ADR-173 status note) is pulled EARLY (before the
EEF increments) so the continuity surface carries the correct frame across any
compaction. **Backward closure** (ADR-123 inventory amendment, gate-1a-closed
marking, ff5 evidence) waits for inc-g, after F ships — adding delivery claims
before delivery is forbidden by the doctrine.

## Critical files

- `.agent/directives/definition-of-delivery.md`, PDR-085, practice-index,
  decision-records/README, AGENT.md (Increment A — landed)
- `apps/oak-curriculum-mcp-streamable-http/src/{env.ts,runtime-config-from-validated-env.ts,runtime-config-support.ts,handlers.ts,register-prompts.ts}` (E)
- `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tool-shared.ts` (D; 10 callers)
- `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.ts` (B)
- `packages/sdks/graph-corpus-sdk/src/eef-strands/{loader.ts,graph-view.ts,strand-schema.ts}` (F)
- `packages/sdks/oak-curriculum-sdk/src/mcp/evidence-corpus/tools/eef-explore-evidence-for-context/` (F)
- The plan/ADR surfaces in Part 5

## Verification

- **A:** fresh-session read-path reaches the directive from AGENT.md; PDR-085
  portability (zero repo paths). **Done.**
- **E:** integration test — flag OFF hides EEF tool+prompt; ON shows both.
- **F:** integration test on real EEF data — relevant projected sub-graph for a
  real context; **<10k tokens measured across the ENTIRE CallToolResult**
  (`structuredContent` + `content[1]` full JSON copy + citations/edges/envelope);
  record a worked combined-budget estimate before F merges; `CitationsSchema.parse`
  passes; `_meta.attribution = EEF_ATTRIBUTION`; `pnpm freshness:check` green.
- **H:** production MCP round-trip via a real client; ≥1 telemetry span.
- **G:** docs-adr-expert confirms no surviving false-delivery claim; ADR-123
  enumerates the EEF tool+prompt.

## Owner decisions — RESOLVED (2026-05-27, LTAE + verification)

All five "open questions" were run through the long-term-architectural-
excellence lens and verified against the data/code; four were never open
questions — they were forced by doctrine once the premise was verified. See
Part 3 §"Ex-open questions" for the full record. Summary:

1. `focus` enum — **derive from data** (`EEF_PRIORITIES` from
   `school_context_schema.priorities.enum`); replace the invented enum. No
   crosswalk (schema-first + replace-don't-bridge).
2. The 13 universal strands — **include** with graceful subject/topic/tags
   fallback seeding.
3. `enumerateNodes` — **loader-level** filtering; do not un-stub (YAGNI).
4. PDR-085 — **Accepted** (owner-elevated 2026-05-27).
5. Release timing (H) — **LANDED-only is the resting state**; the production
   flag-flip is the one genuine owner lever, surfaced at H.

## Reviewer pass (code-expert + docs-adr-expert + assumptions-expert)

The approved meta-plan was reviewed by all three; findings critically reviewed
before applying. Applied: AGENT.md anchor; PDR-085 README index; F-scope
schema + projection-applier; feature-flag seam sharpening; per-ADR actions;
full-CallToolResult budget. Rejected/resolved: "C-spike silently invalidates F"
(downgraded — dual-emit is safe); PDR-085 number (confirmed 085). Deferred to
in-cycle: type-expert (RuntimeConfig + school_context schema) and test-expert
(registration assertion + co-gating test) at E and F.

## Reference — MCP client output limits (researched 2026-05-27)

Grounds the 10k budget (Part 1/criterion 2) and the dual-emit-vs-structured-only
decision (Part 2 C/D). Preserved so increments C/E/F do not re-derive it.

- **Claude Code (verified from `code.claude.com/docs/en/mcp`):** warns when MCP
  tool output exceeds **10,000 tokens**; **25,000-token** default hard cap
  (`MAX_MCP_OUTPUT_TOKENS` raises it); over the cap, output is **persisted to
  disk and replaced with a file reference** (so the model never sees the data).
  Per-tool override: `_meta["anthropic/maxResultSizeChars"]` up to **500,000
  chars** (text only). → The 10k budget sits at/under the *warning* threshold so
  a graph tool never even warns.
- **ChatGPT (OpenAI Apps SDK docs, via mcp-expert — not personally re-verified):**
  the model sees **both** `content` and `structuredContent`; OpenAI says "trim
  `structuredContent` to what the model truly needs"; the connector path
  documents returning `structuredContent` AND a JSON-string `content` mirror
  "for compatibility" → **structured-content-only is a documented RISK for
  ChatGPT**. This is exactly what increment C must verify before D adopts it.
- **Claude Code dropping `content[]` when `structuredContent` is present
  (v2.0.21+):** GitHub-issue-sourced (issues #55677, #15412), closed-not-planned
  — **UNVERIFIED**; do not treat as settled.
- **Decision grounding:** dual-emit (keep `content[]`) is the *safe,
  maximally-compatible* gate-1a path — both clients receive usable data;
  structured-content-only is a gate-1b *optimization* gated by C. F's budget
  check must measure the FULL `CallToolResult` (both representations).

## Provenance

Authored from the owner-approved Claude meta-plan (codename
`prancy-shimmying-crystal`). Brought into the repo 2026-05-27 so the roadmap
survives compaction. Branch coordination (updated 2026-05-27, Deep Fathoming
Harbour): Increment A + the plan restructure landed in the primary checkout on
`feat/graph-foundations`. Per owner direction the `feat/eef-explore-evidence`
worktree branch is merged back into `feat/graph-foundations`, PR #121 is closed,
and a single new PR is opened for `feat/graph-foundations`; all subsequent
increments (B–H) land on `feat/graph-foundations` in the primary checkout. The
focus-vocabulary correction (Part 3) supersedes the earlier "focus enum gaps /
crosswalk" framing.
