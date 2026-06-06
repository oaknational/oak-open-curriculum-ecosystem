---
fitness_line_target: 400
fitness_line_limit: 525
fitness_char_limit: 35000
fitness_line_length: 200
split_strategy: 'Archive historical session-close summaries to a companion archive file; keep only live operational state and most recent session summary here'
merge_class: index-narrative-tables
---

# Repo Continuity

Repo-level operational index for active thread state. Historical session-close
prose is archived under [`archive/`](archive/), with the latest pre-compaction
source snapshot preserved at
[`archive/repo-continuity-current-state-2026-05-31-foamy-docs-consolidation.md`](archive/repo-continuity-current-state-2026-05-31-foamy-docs-consolidation.md).
Detailed lane histories live in thread records, curator reports, completed
plans, and prior continuity archives; this file should stay a compact pickup
surface.

## Current State

- **EEF-D6 REFLECTION SESSION — BOTH HALVES HANDED OFF (2026-06-06, Dim Fading
  Hush / `1952e2`, claude / Opus 4.8).** EEF D6 architecture corrected to the
  aggregated-tool-family pattern → handed to `Moonlit Orbiting Moon` for execution
  (see `threads/eef.next-session.md` top banner; fresh readiness review owed before
  execution). The NON-EEF meta-work — feedback-mechanisms-must-embody-doctrine
  (lead), routing the planning/execution lessons to their homes, and the
  architecture-pattern record + reviewer retune — handed to a fresh session (see
  `threads/agentic-engineering-enhancements.next-session.md` top banner; lessons
  sourced in `memory/active/napkin.md`). **Working tree uncommitted** (plan, thread,
  napkin, claims/comms edits); commit only on owner request.
- **AGENT IDENTITY / CODEX STATUSLINE DOCS UPDATED; SESSION COMPLETE
  (2026-06-06, Volcanic Blazing Magma / `019e9c`, codex / GPT-5,
  owner-directed).** Documented the current session-name/statusline mechanics in
  `agent-tools/docs/agent-identity.md`: derived identity, statusline rendering,
  and host session title are separate surfaces; Codex `/rename` changes the UI
  label/title when invoked; and the current Codex CLI statusline item allowlist is
  owned by the installed Codex build, with `/statusline` as the product-supported
  inspection path. README quick-reference now points future agents to that note.
  **Working tree uncommitted**: docs + closed-claims archive only. Validation:
  markdownlint, `git diff --check`, and `collaboration-state comms validate` green.
  **Deep consolidation status: not due** — the only new insight was homed directly
  in permanent docs; no napkin rotation, track card, open-question drain, or
  graduation trigger fired. **Next safe step:** commit the current docs/claim-state
  slice if desired; otherwise no open implementation follow-on from this session.
- **COLLABORATION-IS-VALUE-CONTINGENT RULE + START-RIGHT-TEAM IMPROVEMENTS LANDED;
  COMMIT WARDEN WITHDRAWN; SESSION COMPLETE (2026-06-06, Pearly Sailing Fjord / `50e03b`,
  claude / Opus 4.8, owner-directed).** Took over commit-warden from Dusky, then
  (owner-directed) homed the principle "all collaboration functionality is contingent and
  conditional on providing value" as an always-on rule
  ([`collaboration-is-value-contingent.md`](../../rules/collaboration-is-value-contingent.md),
  `da25dcda`) — the awareness / behaviour / ceremony classifier + consumer test — applied
  across the `start-right-team` SKILL (First Moves, commit-warden role definition,
  role-definitions, cadence, singleton-role handoff), `liveness-heartbeat-cron`, and
  `comms-all-channels-watcher`. Dual-reviewed (docs-adr + assumptions); the heartbeat
  value-contingency is a working hypothesis on PDR-082's (Proposed) second-instance path,
  NOT a standalone exemption (PDR-078 Accepted forbids pre-empting its exemption set). Also
  landed `2c294b6f` (warden monitoring = awareness) + `c1dfd5c5` (warden-handoff capture).
  Commit warden **withdrawn** (claim `5f2cd3cd` closed, seat vacant, owner-conducted).
  Branch ahead of origin, unpushed (owner's call). **Next safe step: none on this lane** —
  out-of-scope follow-ons in pending-graduations (graduate the live-owner-conductor
  heartbeat exemption via PDR-082 second-instance → PDR-078 §4; consider a portable
  value-contingency PDR if a third surface needs it).
- **MCP TEST ESTATE + OBSERVABILITY SINKS PLANS → BOTH DECISION-COMPLETE; Tidal
  thread handoff absorbed (2026-06-06, Soaring Darting Cliff / `4ac3e4`, claude /
  Opus 4.8, owner-directed).** Took over Tidal Plumbing Atoll's MCP test-harness
  thread as a *collaborative* handoff (Tidal concurred with every fold, no pullbacks,
  then stood down; both handed-off plans are mine). Drove
  [`unified-mcp-server-test-harness.plan.md`](../../plans/sdk-and-mcp-enhancements/current/unified-mcp-server-test-harness.plan.md)
  and
  [`observability-sinks-decoupling.plan.md`](../../plans/observability/current/observability-sinks-decoupling.plan.md)
  to `🟢 DECISION-COMPLETE`. **Test-harness**: 4 readiness reviewers folded
  (assumptions/mcp/test/security); the carried `wrapMcpServerWithSentry`-under-Sentry-off
  question is RESOLVED — not a defect (off-mode noops `sdk.init`; fresh `McpServer`
  per request). **Sinks**: 4 reviewers (sentry/architecture/config/docs-adr) surfaced
  two real gaps, both closed by reshape — (1) the `SENTRY_MODE` bridge does NOT exist
  (`refineLegacySentryMode` hard-rejects), so a new C2b builds it in env-resolution
  before C3; (2) C2 settled as a standalone OTel `NodeTracerProvider`
  (true vendor-independence — the forced excellence answer per principles.md, not a
  Sentry-coupled cheap cure) + an ADR-171 amendment. Execution stays owner-scheduled
  (test-harness WS1 gated on EEF D6; sinks gated on the relevant feature branch(es)
  merging). Commit warden during the window: Dusky → **Pearly Sailing Fjord**.
- **Current product focus**: `eef` graph-tooling rebuild is the only active
  product lane. The `agentic-engineering-enhancements` activity in this window is
  a temporary knowledge-curation lane, not a product implementation thread.
- **Collaboration-state lifecycle**: `.agent/state/` files are live signal
  sources, not long-term documentation. Outside explicit owner-gated research
  windows, process useful substance into memory/docs/plans and clear stale state.

## Active Threads

A **thread** is the continuity unit. Full identity tables and lane state live in
each thread record; this table is the repo-level index.

| Thread | Purpose | Record | Latest identity |
| --- | --- | --- | --- |
| `eef` | EEF graph-tooling rebuild | [record][eef] | claude / Opus 4.8 / Zephyrous Kiting Squall / d6-readiness-regrounding / 2026-06-06 (prior: Floating Darting Cloud d7-golive-plan-edit 2026-06-06, Dusky Dimming Candle author-d6-execution-plan 2026-06-06, Masked Creeping Lantern eef-deep-review-resolutions-adr191 2026-06-05, Dim Dimming Threshold eef-d5-execution 2026-06-05, Prismatic Twinkling Planet eef-d5-fresh-dual-review 2026-06-04, Windward Gliding Squall eef-d5-plan-authoring 2026-06-04, Shadowed Creeping Secret eef-d4-ratify 2026-06-04, Burnished Glowing Spark 2026-06-04, Lacustrine Swimming Beacon 2026-06-03, Seaworthy Swimming Sextant 2026-06-03, Galactic Glowing Prism + Opalescent Cascading Planet + Stellar Waning Planet + Silvered Lurking Mask 2026-06-02) |
| `oak-kg-ontology-planning-review` | Plan the `oak-kg`/ontology work, starting with a deep review of the Oak Curriculum Ontology repo (separate concern from the bulk-derived graph redesign) | [record][oak-kg-ontology] | claude / Opus 4.8 / Twilit Cascading Supernova / thread-opener-brief-only / 2026-06-04 — **opened, not started; deep review is a fresh session** |
| `agentic-mechanisms-discovery` | Web-based agent discovery mechanisms for Oak data and tools | [record][agentic-mechanisms-discovery] | claude / Opus 4.8 / Blustery Lifting Gale / skills-taxonomy-and-distribution / 2026-06-03 (prior: Umbral Whispering Silhouette 2026-06-01) |
| `agentic-engineering-enhancements` | Practice continuity and temporary curation | [record][agentic] | codex / GPT-5 / Volcanic Blazing Magma / identity-statusline-docs / 2026-06-06 (prior: Lanternlit Passing Mask 2026-06-05, Hidden Hiding Dusk 2026-06-04, Arboreal Sprouting Branch 2026-06-04, Opalescent Illuminating Prism 2026-06-03, Lacustrine Swimming Beacon, Ashen Burning Magma, Solar Glowing Meteor, Stratospheric Buffeting Breeze, Lofty Sweeping Falcon, Shaded Veiling Mirror) |
| `repo-professionalism-assessment` | Repo professionalism / engineering-quality report → planability triage | [record][repo-professionalism-assessment] | codex / GPT-5 / Airy Whirling Wing / report-author-and-planability-router / 2026-06-03 |
| `school-data-search` | Oak School Data Search service (POC MVP): briefs → report → plan → gate walk → **deep review complete** → build | [record][school-data-search] | claude / Opus 4.8 / Fiery Sparking Caldera / deep-review-and-refinement / 2026-06-04 (prior: Mossy Whispering Bark 2026-06-04, Furnace Roasting Brazier + Hushed Lurking Mask 2026-06-03) |
| `semantic-search` | Search data foundations: upstream-schema alignment, bulk sourcing, minimal-adaptation arc | [record][semantic-search] | claude / Opus 4.8 / Moonlit Waxing Nebula / upstream-realignment-specialist / 2026-06-03 |

## Paused Threads

Paused threads retain their next-session records and identity history; they are
not the current session-priority lane. Reactivation is owner-directed.

| Thread | Purpose | Record | Latest identity |
| --- | --- | --- | --- |
| `connecting-oak-resources` | Oak resource graph substrate for EEF | [record][connecting] | claude / Opus 4.8 / Galactic Glowing Prism / jc4-plan-authoring (kg collection) / 2026-06-02 (prior: Opalescent Cascading Planet, Stellar Waning Planet, Silvered Lurking Mask, all 2026-06-02) |
| `branch-fitness-and-push-cadence` | Small-PR, push-often, branch-fitness, PR/Sonar protocol substrate | [record][branch-fitness] | Pelagic Snorkelling Sextant / codex / GPT-5 / Cycle 1 substrate capture / 2026-05-24 |
| `mcp-product-analytics` | MCP product analytics design and Path-to-GA Programme | [record][mcp-analytics] | Stellar Glowing Satellite / claude / claude-opus-4-7 / Programme landed + amendments / 2026-05-26 |
| `observability-sentry-otel` | Sentry/OTel integration | [record][observability] | Umbral Creeping Night / claude-code / opus-4.7 / 2026-05-10 |
| `main-critical-sonar-remediation` | Sonar remediation | [record][main-critical] | Stormy / claude-code / 2026-05-06 |
| `exploring-open-education-resources` | Third-party OER | [record][oer] | Gnarled / claude-code / 2026-05-01 |
| `sector-engagement` | External adoption | [record][sector] | Squally / cursor / 2026-04-30 |
| `architectural-budget-system` | Architectural budget | [record][budget] | Nebulous / codex / 2026-04-29 |
| `cloudflare-mcp-security-and-token-economy-plans` | Cloudflare MCP | [record][cloudflare] | Glassy / codex / 2026-04-28 |
| `agent-collaboration-research` | Comms-corpus pattern research | [record][collab-research] | Twilit Orbiting Satellite / routing-sunset execution landed; research vector owner-gated / 2026-05-29 |

## Next Safe Steps

### School Data Search

All nine owner gates decided 2026-06-04, plus a high-stakes verification pass
(reopened/resolved three: G-1 F-C→F-B; G-6 NI register + Scotland geospatial;
coordinates dropped). **Deep review complete (2026-06-04, Fiery Sparking
Caldera): sound, faithful, build-ready** — refinements committed `1839e9b8`
(WS9 reuses `@oaknational/logger` stdio-only + `@oaknational/observability`;
new WS11 access-gated value-proof school-picker page; canonical-ID a tested
invariant + per-nation sourceId-identity check at WS4; England/GIAS
front-loaded; change_events/import-run-inspection deferred post-go; report §6
reframed; C-10 path fixed). **WS-D1 / G-8 DONE (2026-06-04): the 4-workspace
bundle is ratified** (contracts + sdk [data/ingest/search modules] + client +
apps/api under a new top-level `school-data-search/` tier; auth in apps/api;
authored boundary rules — betty + fred reviewed/validated, 6-way split
rejected; see the
[decomposition doc](../../plans/school-data-search/current/school-data-search-wsd1-decomposition.md)).
**Next: ADR-041 amendment (school-data-search/ tier matrix row + authored
boundary rules) + draft ADR-190 (F-B produced-spec) → `docs-adr-expert`;
promote to `active/`; begin WS1+.** Carry the verification discipline +
licensing guardrail. See the
[`school-data-search` thread record][school-data-search].

### Agentic Mechanisms Discovery

1. Treat the parent plan
   [`agentic-mechanisms-discovery.plan.md`](../../plans/discovery/future/agentic-mechanisms-discovery.plan.md)
   as the layer map for skills, MCP Server Cards, MCP runtime discovery, A2A,
   registry metadata, and generic AI discovery proposals.
2. Resume executable work from
   [`agent-readiness-discovery-hub.plan.md`](../../plans/discovery/current/agent-readiness-discovery-hub.plan.md),
   starting with `ar1-refresh-standards-and-live-estate`.
3. Keep Web Bot Auth in Phase 1 as a decision-ledger and security-evidence
   bridge; the future child plan owns any later enabled-control rollout.
4. Do not implement gated `future/` endpoints or metadata until the owner
   explicitly promotes the relevant child plan.

### Repo Professionalism Assessment

1. Start from the report:
   [`oak-repo-professionalism-engineering-quality-report-2026-06-03.md`](../../reports/oak-repo-professionalism-engineering-quality-report-2026-06-03.md).
2. Treat the plan-index links added 2026-06-03 as routing evidence, not
   execution authority. The report is an assessment input, not a plan.
3. Decide Q-005 in
   [`open-questions.md`](open-questions.md#q-005--can-the-repo-professionalism-assessment-be-cut-into-practical-plans):
   can a practical plan be made, and if yes, should it be one cross-cutting
   plan or separate plans under architecture/quality gates, DevX,
   agentic-engineering, and agent-tooling?
4. If plan work is justified, create or route it through the owning collection
   indexes; if not, record the no-plan verdict and retire this thread with a
   banner.

### EEF Graph-Tooling Rebuild

**NEXT SAFE STEP (2026-06-06): EXECUTE D6** — the D6 execution plan is authored
(Dusky Dimming Candle) and **independently re-grounded ready to execute**
(Zephyrous Kiting Squall, 2026-06-06: every grounded fact / D3–D4 contract / corpus
claim verified first-hand; verdict **GO**; six execution-precision refinements
folded in + committed `93ee593f`; landing-page flag-gating owner-relaxed as low
impact; the ADR-123 concern retracted as a pre-redesign fossil). Run **G0 first**,
then `c0` + the atomic `c1`–`c6`, per
[`eef-d6-execution.plan.md`](../../plans/sector-engagement/eef/current/eef-d6-execution.plan.md).
Open execution-time items (not blockers — G0/TDD surface them) + the full verdict
are in the `eef` next-session record banner. **D5 LANDED green as one commit (`2e9021ff`; Dim Dimming
Threshold, 2026-06-05)** — graph-core generic query layer + graph-native EEF view
(`inspectStrand`/`evidenceForMove`/envelope); the `d5-graph-construction-methods`
todo is `completed`; the runtime `projection?` param was dropped by owner decision
(see the `eef` thread banner + the D4 "Projection deferred" amendment). The
graph-tools-value-redesign lane stays parked on EEF D6 + D7. The numbered history
below is retained for context.

**Post-D5 deep review (2026-06-05, Masked Creeping Lantern) — resolutions landed:**
`NodeProjection`/`DeepKeyPath` removed (no consumer); status currency +
strategy-brief reconciliation (crosswalk — shared-intent kept, server-scoring
superseded, §5 orthogonal); **ADR-191 ratified** (deterministic data surface; the
agent is the only reasoner — Decision 10 promoted repo-wide); contributor-
attribution/PII policy codified (`documentation-hygiene` §2 + `ATTRIBUTION.md`;
personal emails only in `package.json`). Substantive set landed via `10c5aeac` +
`0d99dc00` (Jim Cresswell); ADR-191 file + PII-sweep remainder + handoff committed
this session.

1. Re-ground in the `eef` thread banner and current git state.
2. D0 (fixed-data doctrine + validator removal + estate decontamination) and D1
   (teacher value contract) are complete and committed (`ce9745c7`, `f8548985`).
   The live plan reads as positive design, carried by one invariant: every tool,
   resource, prompt, graph operation, and handler is implemented with real
   graph-derived logic and tests, or it is absent. `EEF_TOOLKIT_DATA` is the only
   source of truth; relevance is by pedagogical move on EEF-native finite axes,
   and the value intersects Oak's misconception/prior-knowledge tools at the
   workflow level.
3. The two reviews (whole-plan + D2) are COMPLETE (2026-06-01, Windswept Floating
   Summit). The plan was corrected and enhanced: graph-view status truth, V1
   source-path fixes, optionality made first-class with verified corpus
   cardinalities, Decision 10 (deterministic data; the agent is the only reasoner),
   and a rewritten `## Sequencing` carrying the seam taxonomy + the "seams compose,
   never reconciled" law.
4. **D2 IS COMPLETE (2026-06-01, Lunar Transiting Eclipse, commit `9019bb86`,
   green + reviewed by code/type/test experts).** The typed raw-corpus foundation
   is built in `graph-corpus-sdk` (`EefStrand`/`EefStrandId`/`EefStrandById`/
   `isValidStrandKey`, raw domains, declared-vs-observed divergence, related-strand
   edges, corpus provenance); the old list-shaped EEF surface was removed across
   three workspaces; `OAK_CURRICULUM_MCP_EEF_ENABLED` is a dormant seam for D6. The
   source-path table is at `eef/current/eef-d2-source-path-table.md`.
5. **Contamination-correction arc (2026-06-01, commits `fb7ad234`, `70ccbef8`,
   `75b0734a`).** A fabricated key-stage→phase concept (the corpus holds phase and
   key-stage as two independent fields with no mapping) reached the canonical plan
   from a deleted prompt and was caught by the owner; removed, then an independent
   grounding audit + tombstone disposition pass cleared it. Lesson in Claude
   auto-memory (`harvest-from-deleted-is-contamination-vector`). The cite-or-tag
   corpus-grounding discipline is now a real `trigger-loaded` rule
   ([`.agent/rules/eef-corpus-grounding.md`](../../rules/eef-corpus-grounding.md));
   the stopgap doc was retired (graduated 2026-06-01).
6. **D3 (MCP tool/resource/prompt contract) is the next plan deliverable** —
   owner-ratified, `mcp-expert` SDK-registration verification pending. The D3/D4
   PENDING reviewers fire against the ratified D3/D4 outputs once those exist.
   **This session (2026-06-01, Dawnlit Dancing Satellite)** reviewed the whole plan
   and D3 with every corpus claim grounded against `EEF_TOOLKIT_DATA` (all
   cardinalities, the phase/key-stage independence, and the divergence verified
   exact; no fabrication). Applied post-D2 currency truth-fixes to the plan (D2
   `completed`; the never-built `EefKeyStage`/`EefPriority` replaced with the real
   projection inventory; already-removed surfaces corrected) and added the missing
   attribution rows to the source-path table. A session-built `field-cardinality.ts`
   projection was **backed out** (owner-directed) as a zero-consumer surface
   restating an inherent type fact — the floor/sparse split **is** `keyof EefStrand`,
   carried by the corpus type, derived at D6 from the graph-native view via the
   `satisfies` tie; there is no separate structure to build. The thread banner now
   carries an explicit GOOD/GREAT quality bar. **D3 is advanced to ratifiable
   output (2026-06-02, Seaworthy Swimming Sextant)**: the whole-plan and D3
   reviews ran (4-lens refutation workflow, findings applied), the declared-only
   filter-exclusions edit is applied in D3, and the contract + SDK/app
   verification record are authored in
   [`eef-d3-mcp-contract.md`](../../plans/sector-engagement/eef/current/eef-d3-mcp-contract.md)
   with all four D3 PENDING reviewers run and their conditions applied. An
   owner-directed adversarial audit (2026-06-03) removed three author-invented
   surfaces; a pinned-target mcp-expert re-pass returned SIGN-OFF. **The
   review-then-ratify gate CLOSED 2026-06-03 (Lacustrine Swimming Beacon):
   D3 is owner-ratified + committed (`a0fd7b0f`). **D4 (graph capability shape)
   is now AUTHORED + RATIFIABLE (2026-06-04, Burnished Glowing Spark, committed
   `ca927e40`):** owner decision B made EEF a homogeneous strand graph (guidance
   reports inline; nine bound names → eight); the fundamental heterogeneous
   node/edge model is deferred-and-homed in the migration plan. **That migration
   plan was OVERHAULED → value-driven redesign and renamed
   `graph-tools-value-redesign.plan.md` (2026-06-04, Twilit Cascading Supernova);
   the `graph-migration-plan-overhaul.plan.md` metaplan is COMPLETED.** The
   node/edge model is now scoped there as one-bulk-graph + views with a deliberate
   identity model. **D4 + the whole EEF plan were REVIEWED and D4 OWNER-RATIFIED
   (2026-06-04, Shadowed Creeping Secret): 11 review corrections applied, the EEF
   and value-redesign plans verified coherent (manifest disposition mirrored both
   ways), the `d4` todo flipped to `completed`. D5 — build the new graph-core query
   layer (`GraphView<TNode, TNodeId, TEdgeType>`, `subgraph` only) + the EEF
   strand-view fresh — is the next safe step.** The redesign stays parked on EEF
   D6 + D7. See the `eef` thread banner.** **(Update 2026-06-04, Prismatic
   Twinkling Planet): the FRESH DUAL-REVIEW of the D5 plan + parent is DONE —
   verdict READY WITH CONDITIONS; all conditions C1–C8 owner-resolved and folded in
   (keep `projection?` + implement/test; per-graph depth-ceiling factory input; D4
   doc-fix in both places; C3–C7 clarifications). Every empirical claim was
   re-grounded first-hand; four adversarial attacks on the load-bearing claims were
   rejected as false-positives. NEXT: **execute D5** — build the new graph-core
   query layer (`GraphView<TNode, TNodeId, TEdgeType>`, `subgraph` only with
   `projection?` retained) + the graph-native EEF view fresh as TDD cycles, landing
   as ONE green commit, per the condition-folded `eef-d5-execution.plan.md`. The
   graph-tools-value-redesign lane stays parked on EEF D6 + D7.**
7. **Graph-estate-consolidation: t2–t5+t7 EXECUTED and pushed at `c3b78eec`;
   scoped t8 verification PASSED (2026-06-02, Opalescent Cascading Planet)**.
   The estate reads true in one pass: eleven plans archived with banners +
   index entries, the four misconception feature plans consolidated into
   `kg/future/oak-misconceptions-graph-features.plan.md`, both
   assumptions-expert park-header conditions honoured at the t4 move,
   the KG README rewritten, `graph-stack.plan.md` re-framed per ADR-173,
   surviving live references de-linked. `t6` + the full `t8` close are the
   only remaining graph-estate items and stay D7-gated (the `t8` todo is
   `pending` by design). **The Judgement-call-4 unified substrate-migration
   plan is AUTHORED (2026-06-02, Galactic Glowing Prism):**
   `kg/future/graph-tools-value-redesign.plan.md`, parked on the named
   promotion trigger EEF D6 + D7. **The next step in the ratified one-thread
   order is EEF D3 per item 6.**
8. The seam-mapping taxonomy + "seams compose" law is a candidate for a reusable
   plan template/archetype (owner-confirmed intent); tracked in
   [`pending-graduations.md`](pending-graduations.md).

### Agentic-Engineering Curation

1. The 2026-06-03 docs bundles are committed (`a0fd7b0f`, `88d8da9d`,
   `6379f1e4`, `422e57e0`); current curation is Opalescent's dedicated pass.
2. `napkin.md` has been processed through the Opalescent item-level ledger and
   preserved as `active/archive/napkin-2026-06-03-opalescent-curation.md`.
   The PDF-only ChatGPT report-normalisation protocol graduated into the
   canonical skill and pattern; the pre-archive ledger tripwire graduated into
   the consolidation/handoff skills. Remaining register items are owner-gated
   or trigger-gated.
3. The abandoned commit-queue residue entries in `active-claims.json` remain a
   secondary cleanup signal; do not treat them as current commit authority.
4. The relative-link integrity item is accepted as a future validator lane, not
   implemented tooling; promote the plan only on its recorded trigger.
5. Comms-event rotation remains paused until a dedicated comms research plan
   exists.

### Docs Consolidation Repair

1. For a later ordinary continuation, use
   [`codex-docs-consolidation.brief.md`](codex-docs-consolidation.brief.md).
2. Treat fitness as routing evidence only; do not archive, split, shard, rename,
   pointer-replace, or move unprocessed content to improve scores.
3. Continue item-level dispositions from active buffers and the canonical
   [`pending-graduations.md`](pending-graduations.md). Owner-gated items remain
   there until their trigger fires.
4. Comms-event rotation remains paused until a dedicated comms research plan
   exists.

### Connecting-Oak / PR History

Before resuming paused graph-substrate work, re-check current PR, CI, Sonar,
CodeQL, active claims, commit queue, and git state. Do not rely on historical
issue counts in archived prose.

### Agent Tooling (collaboration CLI + PreToolUse guard) — LANDED + PUSHED

Both WIP lanes have landed and pushed (verified 2026-06-06, Starlit Scattering
Twilight curation pass — the prior "uncommitted, commit when greenlit" framing was
stale): Fiery's collaboration-state CLI (F-35 `--tag heartbeat` help + F-07
`comms list`/`show`) in `562b97f3`; Skyward's PreToolUse guard
fail-open-on-unbuilt-artefact (+ the pure `decideMissingGuardArtifact`) in
`89ec8dcf`. No open next step. Owner-gated residuals are tracked in
`pending-graduations.md`: the ADR-167 exit-0-log amendment (recommended not needed)
and F-36 (pnpm-wrapper porcelain-stdout) + F-07 list-filters
(owner-directed-optional).

### MCP Test Estate + Observability Sinks (both DECISION-COMPLETE 2026-06-06)

Both plans are `🟢 DECISION-COMPLETE`, execution owner-scheduled. Neither has a
dedicated thread record yet — the session-level home is the § Current State entry +
this section; create a thread record when execution is scheduled.

1. **Test estate** —
   [`unified-mcp-server-test-harness.plan.md`](../../plans/sdk-and-mcp-enhancements/current/unified-mcp-server-test-harness.plan.md):
   WS0 (built-server smoke harness) + WS3 (network-free e2e rebalance) are
   EEF-independent and executable now; WS1 (= EEF D7) is gated on EEF D6 landing.
   Cross-plan: sequence WS3's live-executor consolidation BEFORE the MCP slice of
   `no-io-test-boundary-and-di-recovery.plan.md` (collision risk, per the plan's
   §Cross-Plan Coordination).
2. **Observability sinks** —
   [`observability-sinks-decoupling.plan.md`](../../plans/observability/current/observability-sinks-decoupling.plan.md):
   C1+C2 (atomic: forcing-function test + standalone OTel `NodeTracerProvider`, adds
   `@opentelemetry/sdk-trace-node` + amends ADR-171) → C2b (build the `SENTRY_MODE`
   bridge in env-resolution + reconcile the sink-enum) → C3 (migrate consumers) → C4
   (renames) → C5 (close). Execution gated on the relevant feature branch(es) merging.

## Open Owner-Decision Items

1. `pending-graduations.md` contains owner-gated doctrine and follow-up decisions;
   process only when a trigger fires or the owner directs.
2. MCP product analytics execution-plan promotion is deferred. Production PostHog
   capture still needs the legal/privacy gates named in the exploration record.
3. Monorepo workspace topology remains parked until after the graph MVP
   implementation tranche unless the owner reopens it.
4. Comms-event lifecycle research is owner-gated; do not rotate the event corpus
   from calendar age alone.

## Repo-Wide Invariants / Non-Goals

Each invariant below has a canonical home; this section is a resume aid, not the
authority.

- Comms-log rotation is paused until a dedicated comms research plan exists.
- No compatibility layers; replace, do not bridge.
- Distinct architectural layers live in distinct workspaces.
- TDD at all levels; tests prove product behaviour, not file presence.
- Strict validation happens only at boundaries.
- No `process.env` read/write in test files or setup files.
- `--no-verify` requires fresh per-invocation owner authorisation.
- No warning toleration.
- Owner direction beats plan.
- Curriculum data in this monorepo comes through the published Oak Open
  Curriculum HTTP API and generated SDK.
- Knowledge preservation is absolute; fitness warnings route work, not deletion.
- Shared memory/state files are always writable and commit-includable when dirty.

[main-critical]: threads/main-critical-sonar-remediation.next-session.md
[mcp-analytics]: threads/mcp-product-analytics.next-session.md
[observability]: threads/observability-sentry-otel.next-session.md
[agentic]: threads/agentic-engineering-enhancements.next-session.md
[connecting]: threads/connecting-oak-resources.next-session.md
[oer]: threads/exploring-open-education-resources.next-session.md
[budget]: threads/architectural-budget-system.next-session.md
[cloudflare]: threads/cloudflare-mcp-security-and-token-economy-plans.next-session.md
[sector]: threads/sector-engagement.next-session.md
[eef]: threads/eef.next-session.md
[oak-kg-ontology]: threads/oak-kg-ontology-planning-review.next-session.md
[school-data-search]: threads/school-data-search.next-session.md
[semantic-search]: threads/semantic-search.next-session.md
[agentic-mechanisms-discovery]: threads/agentic-mechanisms-discovery.next-session.md
[repo-professionalism-assessment]: threads/repo-professionalism-assessment.next-session.md
[collab-research]: threads/agent-collaboration-research.next-session.md
[branch-fitness]: threads/branch-fitness-and-push-cadence.next-session.md
