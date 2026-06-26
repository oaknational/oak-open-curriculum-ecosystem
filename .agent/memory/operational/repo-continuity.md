---
fitness_line_target: 400
fitness_line_limit: 525
fitness_char_limit: 35000
fitness_line_length: 100
fitness_content_role: reference
overflow_disposition: 'leave-if-live; else conserve-insight-and-delete — never archive/split/rotate/shard (see continuity-practice.md §Disposition of Continuity Surfaces)'
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

**Director handoff:** the next Director's single pick-up point — role procedure,
the readiness self-check before claiming authority, current state, and the live
todo list — is [`director-handoff.md`](director-handoff.md).

## Current State

- **Knowledge-substrate consolidation — PR #226 (2026-06-25, Zephyr mends Bluff).** Register
  intents sharpened (pending-graduations = learned-doctrine-awaiting-a-home; open-questions =
  strategic open questions) with belongs/does-not-belong examples; the homing destinations table
  now names every surface; ripe distilled lessons graduated to patterns / rules /
  `sonar-disposition-policy`; napkin rotated. **Owner taxonomy captured:** the substrate has three
  tracking tiers — **memory** (portable knowledge, tracked), **repo state** (repo-specific but
  checkout-portable: continuity surfaces, tracked), **local state** (per-checkout: claims/comms,
  git-ignored) — and only local state is git-ignored. Continuity surfaces are repo state, correctly
  tracked; the future plan
  [`continuity-surfaces-are-state-not-memory.plan.md`][continuity-state-plan] now captures naming
  these tiers in doctrine (no file migration). **Next safe step: merge PR #226** (green; all bot
  findings addressed; owner-authorised). Residual signals (reported, not chased): `distilled`
  prose-width and `principles.md` char-limit are owner-limit tensions; `repo-continuity` /
  `director-handoff` are HARD as repo-state continuity surfaces (live work content; not chased).
- **Operating model: SOLO, no Director seat** (owner direction 2026-06-25). Worktree-pilot CLOSED OUT,
  team DISSOLVED — PRs #221–#225 all MERGED to main (release 1.35.2); S8707 sites 1-2 + S4036 landed via
  #223; F-94/F-95 via #225. The Director-model *verdict* (did the pilot's model work) is owned by the
  [worktree-pilot plan](../../plans/agentic-engineering-enhancements/current/worktree-pilot-consolidation-and-model-verdict.plan.md)
  §L-Verdict; `director-handoff.md` is largely dormant and reducible under solo. **Live:** S8707 **site-3**
  remains (`apps/oak-search-cli` analyze-elser-failures; `main-sonar-ai-profile-to-zero` thread); the
  **DATA-SOURCES** governance criteria (open); F-96/F-97 tooling backlog; and the stale dissolved-team
  claims in `active-claims.json` to clear (curator pass). Full pickup: [`director-handoff.md`](director-handoff.md).
- **Strategy / plan-estate rewrite — LIVE primary lane** (thread
  [`strategy-and-plan-estate-holistic-review`](threads/strategy-and-plan-estate-holistic-review.next-session.md)).
  [`ADR-200`](../../../docs/architecture/architectural-decisions/200-intent-as-a-living-idea-graph.md)
  (intent as a living idea-graph — **Accepted**) +
  [`ADR-201`](../../../docs/architecture/architectural-decisions/201-external-systems-evidence-integration.md)
  (external-evidence — **Proposed**) + the executable plans are committed; **progression GO**. **Next safe
  step (owner-directed top priority): WS2** — author the idea-node JSON Schema + decide id-minting; the
  **WS4 thin-slice-proof is a HARD GATE** before the full harvest (WS6). V0 = the form new plans take;
  forward V0-bridge work is unblocked. Read ADR-200 + the thread record first.
- **Knowledge-as-graph two-altitude research** landed (ADR-200 amended: realisation edges + family-
  entailment). The missing **content-structure graph** + renderers-as-projections is open question **Q-009**
  (owned by the incoming engineer's brief + owner); report `knowledge-as-graph-two-altitudes-2026-06-23.md`.
- **Practice↔IDE integration plane** — feasibility report landed; **owner decisions pending** (report §11)
  - a HARD deep-docs-read prerequisite before any build; promote to a thread on owner GO. See §Open
  Owner-Decision Items.
- **Onboarding-improvement arc** — PR #199 **merged** (2026-06-12). Follow-ons open: B2/B3 risk-register
  seeding; the ask-the-repo search decision (B1 awaits owner cost bands; B6 at the M2 gate).
- **Evals pickup — QUEUED, owner-directed**:
  [`skill-evals-pilot-start-right-quick.plan.md`](../../plans/agentic-engineering-enhancements/current/skill-evals-pilot-start-right-quick.plan.md);
  the assurance regime (test/evaluate/assure + harm-keyed tiers) is homed in `principles.md` §Agentic
  Quality + `validation-strategy.md`.
- **OWNER ROADMAP (owner direction 2026-06-12, sequenced "not all at once") — the forward agenda:**
  (1) organise the comms-research follow-ons; (2) naming v3 — DECISION-COMPLETE plan
  [`agent-naming-schema-v3.plan.md`](../../plans/agent-tooling/current/agent-naming-schema-v3.plan.md)
  (thread [`agent-naming`][agent-naming]; shape C decided; Phase-1 era-pinning cure lands first —
  full detail in §Next Safe Steps › Agent Naming); (3) protocols/skills for examining production
  issues in Sentry; (4) organise the Sentry logging improvements those discoveries surface;
  (5) refine the PostHog plan ([`mcp-product-analytics` thread](threads/paused/mcp-product-analytics.next-session.md));
  (6) plan integration of the oak-api repo into this ecosystem repo; (7) organise the EEF
  data-surfacing follow-ons
  ([gap research](../../plans/sector-engagement/eef/reference/eef-data-surfacing-gap-research-2026-06-12.md));
  (8) identify high-impact graphs latent in the bulk data not yet extracted; (9) apply the new
  graph-tool capabilities to the `oak-curriculum-ontology` sibling repo; (10) build the user-facing
  hybrid-search experience — update the
  [08-experience-surfaces cluster](../../plans/semantic-search/future/08-experience-surfaces-and-extensions/README.md)
  intent and integrate into the active
  [`mcp-app-extension-migration.plan.md`](../../plans/sdk-and-mcp-enhancements/active/mcp-app-extension-migration.plan.md)
  WS3 rebuild (this item is that intent's owner-agreed gate); (11) keep the plan-discovery surfaces
  current (`plans/README.md`, `high-level-plan.md`, `good-first-issues.md`, `completed-plans.md`)
  and analyse then retire `plans/notes/`; (12) the path-sweep code-class follow-on (remaining
  OS-temp-path carriers, enumerable via `git grep -lF '/tmp/' -- '*.ts' '*.sh'`, plus the
  no-machine-local-paths CI validator; behaviour changes get their own TDD cycles, never a sweep sed).
  **Open action:** `docs/graph-team-direction-2026-06-10` carries two unmerged commits (`ae5372e2c`,
  `c9ff6bb49` — Dawnlit's first-wave snagging evidence); merging it is an open owner/Director action,
  reconcile the napkin/eef-record content on merge.
- **Output-schemas plan — 🟢 DECISION-COMPLETE (owner-ratified 2026-06-09).**
  [`output-schemas-for-mcp-tools.plan.md`](../../plans/sdk-and-mcp-enhancements/current/output-schemas-for-mcp-tools.plan.md):
  every MCP tool `outputSchema` = `composeEnvelopeSchema(payloadSchema)` (EEF tie type-level, never
  `satisfies`-on-value). Its execution gate (graph-tools settle) is met. **Next:** execution routing —
  open Director/owner call. (Cross-cutting: verify load-bearing specialist claims first-hand until the
  specialist-agent overhaul lands.)
- **OAK-PROD MCP snagging — write-up landed, fixes deferred.** The structuredContent-only
  `get-eef-evidence` success is invisible to the Cursor harness:
  [snag register](../../plans/sdk-and-mcp-enhancements/current/oak-prod-mcp-snagging-2026-06-11.plan.md).
  **Next:** run S0 (non-Cursor client probe) per §6, then S1 to owner.
- **no-throw remediation — RESHAPED 2026-06-19; READY (survey-first); PAUSED for the strategy thread.**
  Controlling plan is now
  [`no-throw-remediation.plan.md`](../../plans/architecture-and-infrastructure/current/no-throw-remediation.plan.md)
  (thread [`eslint-no-throw-result-migration`](threads/eslint-no-throw-result-migration.next-session.md)),
  **superseding the convert-all framing** of `no-throw-statement-result-migration.plan.md`. The owner
  reopened the work: the ~1000-warning count is an indiscriminate-rule artefact (~6 cause-classes, not
  1000 problems; ~1/3 tests, ~189 generated from ~10 templates, ~400/811 flagged false-positive by the
  prior analysis), and the per-site labels proved unreliable (3 mis-labels in one session). The plan is
  **investigation-first**: WS0 fresh holistic cause-survey → WS1 review fixes-to-date (hacks vs real) →
  WS2 test-quality triage (priority) → WS3 generator causes (F-74-gated) → WS4 reassess gate (reopens D6).
  Reviewed READY by assumptions-expert + test-expert (folded). **4 conversions landed so far** (`1556b9191`
  Merlin; `93beffcfe`/`304b68f8d`/`61bdbc3e4` Siren mends Rudder) — all full-gate-green, ~5 src throws of
  ~1000. **Unpushed — owner controls push.** **Resume from the remediation plan's WS0** after the strategy
  work; full resumable state in the thread record.
- **Current product focus**: `eef` graph-tooling rebuild is the only active product lane. The
  `agentic-engineering-enhancements` activity is a temporary knowledge-curation lane — its live
  WS1→2b→2c→WS2 feedback-mechanism work lives in its thread record, not a product thread.
- **Collaboration-state lifecycle**: `.agent/state/` files are live signal
  sources, not long-term documentation. Outside explicit owner-directed research
  windows, process useful substance into memory/docs/plans and clear stale state.
- **Agentic state (2026-06-21, two sessions)**: Ferret seeks Tunnel ran a dedicated
  knowledge-curation pass + handoff, then promoted three graduations (PDR-107; the culture Active
  Principle; the README-index doc convention) and backfilled the PDR index (multiple commits on
  `docs/planning-and-validation`, **NOT pushed** — `git log` is authoritative; re-verify via `@{u}`).
  **EXECUTED — practice-lineage clarity-of-purpose restructure** (lineage → the evolution record,
  855→283 lines; §Learned Principles + the what-it-is/how-to-apply duplicates evacuated by intent;
  PDR-108/109/110 authored + PDR-002/024 amended; 0 broken refs; docs-adr-expert-assessed, folded
  first-hand). **18 files committed by the Director, Vesuvius calls Quench** as `e30b987c0`
  (owner-directed; full-tree knip green after the markdown-links validator was wired, comms
  `90a0f532`); this continuity handoff is the paired Commit B. **NOT pushed** (owner controls push).
  Brief:
  [`current/practice-lineage-principle-graduation.plan.md`](../../plans/agentic-engineering-enhancements/current/practice-lineage-principle-graduation.plan.md).
  The **multi-agent window settled to n=2 owner-visible** (2026-06-21, owner-directed — the Director role
  was dissolved). Cast at this continuity write: **Anvil lifts Solder** (34f6b3) holds survey
  orchestration, **GO-gated** (survey state unchanged — AEE 70/70 Pass-1; remaining = 15 collections +
  70-AEE back-fill + Pass-2/3); the **V1-fold / Stage-3 lane is UNHELD** (its holder Saffron holds Sepal
  retired this session after delivering the design — see the strategy thread record's pickup state). Full
  rotations this window, all clean no-gap handoffs: survey **Pinnace → Aardvark turns Whisper → Anvil**;
  V1-fold **Ganymede herds Penumbra → Saffron holds Sepal** (Ganymede committed the substance re-aim
  `14877e8d0`+`61489ce7e`; Saffron authored + hardened the Pass-2 substance specs `2a4df5423`+`e0456a56c`,
  ran the orphan-commit + stale-state archive-move cleanup, fixed the watcher doctrine bug). Aardvark
  landed the `coordination-watcher-canonicalisation` monitor-fix plan then retired. The Director chain
  Cutter holds Reef → Vesuvius calls Quench →
  **Birch tracks Arbor** ran (PDR-064 two-moments each); Birch coordinated two clean role rotations
  (Drake→Ganymede, Hobby→Pinnace), folded continuity, then retired as the owner dissolved the seat at n=2.
  Earlier cast (Cutter, Ferret, Volcano, Drake, Hobby, Vesuvius) all retired cleanly. **No Director unless
  the owner re-establishes one** (n=2 = PDR-082 owner-visible / consumer-absent). Commit queue empty; owner
  controls push.
  Stale decision-thread / sidebar / handoff surfaces under `.agent/state/collaboration/` remain
  from retired sessions — clearing them is a conservation-gated curator-pass, deferred.
- **Agent Experience (AX) made first-class (2026-06-21, Nova wakes Genesis)**: owner-directed AX
  pass over the 82-entry [`frictions-register.md`](../../plans/agent-tooling/frictions-register.md).
  Landed (gate-green, committed — SHA in thread record): the
  [cause-class report](../../reports/agent-experience-cause-class-analysis-2026-06-21.md) (82
  frictions → 8 cause-classes; the drain-gap; the #1 cure is **already homed** in
  `agent-tools-cli-ergonomics.plan.md`); **PDR-111** (AX is a first-class Practice principle —
  portable, host adoption in the bridge index); the always-on `agent-experience-review-lens` rule;
  a `principles.md` standing-concern line; and the umbrella
  [`agent-experience-improvement.plan.md`](../../plans/agent-tooling/current/agent-experience-improvement.plan.md)
  (DRIVES the homed cli-ergonomics + watcher plans; OWNS the structural drain-fix validator,
  F-41 path-safety, gate-coverage, disposition ledger). Two `future/` briefs (corpus survey; F-75).
  **Next safe step** below (§Agent Experience). Owner controls push. Detail: `agentic` thread record top.
- **Plan-estate relocation (2026-06-20, owner-directed)**: the controlling plan + the merged imported
  analysis docs moved off the planning root into a new `.agent/plans/product-development-governance/`
  collection — controlling plan at the top (authority), the 6 imports in `suggestions/` (subordinate,
  statuses downgraded to `proposed`). The `fitness-system-closure-and-role-routing.findings.md` rehomed
  to `agentic-engineering-enhancements/current/` beside its backbone plan. References rewired and
  verified 0-broken. Detail + the incoming-materials verdicts (graphs: thin slice; service-authority:
  forward-design) live in the strategy thread record.
- **Incoming planning cluster (merged from remote 2026-06-20, not yet integrated)**: a broad
  repo-intent / service-authority / governed-document-graph / context-preservation set of sibling
  documents now lives in [`.agent/plans/`](../../plans/). Integration and comparison are pending —
  protocol in [`fitness-system-closure-and-role-routing.findings.md`](../../plans/agentic-engineering-enhancements/current/fitness-system-closure-and-role-routing.findings.md) §11.
- **Fitness-system doctrine (agentic lane)**: the Closure & Role-Routing design landed as a findings
  record + backbone plan (`547d889c9`); next is the plan's WS0 (PDR-106 + ADR-144 amendment) and the
  §11 comparison. Detail in the `agentic-engineering-enhancements` thread record.

## Active Threads

A **thread** is the continuity unit. Full identity tables and lane state live in
each thread record; this table is the repo-level index.

| Thread | Purpose | Record | Latest identity |
| --- | --- | --- | --- |
| `agentic-mechanisms-discovery` | Web-based agent discovery mechanisms for Oak data and tools | [record][agentic-mechanisms-discovery] | claude / Opus 4.8 / Zephyrous Buffeting Falcon / skills-lane-relocated-to-educator-end-users / 2026-06-08 (prior identities: thread record) |
| `agentic-engineering-enhancements` | Practice continuity and temporary curation | [record][agentic] | claude / claude-opus-4-8[1m] / Seal hunts Offing / fix-before-tooling — F-94 + F-95 MERGED to main (PR #225, e95fb9594); register + live continuity surfaces corrected to fixed; branch continuity-only, 22 ahead/5 behind main, rebase declined / 2026-06-25 ← claude / claude-opus-4-8[1m] / Thyme lifts Compost / team-session-closer — worktree-pilot closed out, team dissolved; guiding plan + director-handoff restructured; orphan branches pushed; F-94–97 captured / 2026-06-25 ← claude-code / Opus 4.8 / Magnolia spins Mulch / 2026-06-23 — MCPJam integration + curriculum-MCP validation + evals doctrine (position report + QUEUED skill-evals-pilot); host-rebinding settled → ADR-122/158 + Host→403 test (thread next step UNCHANGED = WS-1) ← claude / Opus 4.8 (1M) / Petrel stirs Wingspan / 2026-06-22 dedicated consolidation (napkin rotated, 667-line content archived; PDR-113; forced-answer + bottom-up + decision-records graduations; F-83) + the F-84 fix landed (decision-debt false-green: detector `f056285fb` + register reformat `ea633117a`); thread next step UNCHANGED = WS-1 / 2026-06-22 (prior seats: Perseus turns Horizon (substrate de-anon `9abcd7679`), Oyster weaves Surf (WS-3 F-41), Nova wakes Genesis, Ferret seeks Tunnel (PDR-107/108/109/110), Finch binds Halo, Drake lifts Obsidian, Siren guards Reef, Tulip spins Xylem; full history in thread record) |
| `eslint-no-throw-result-migration` | Migrate every throw to Result (ADR-088); drive the ~1000 warnings to zero; promote the rule. In execution on `docs/planning-and-validation`; cheap WS2 done, residue is design-laden (tier map in record) | [record](threads/eslint-no-throw-result-migration.next-session.md) | claude / Opus 4.8 (1M) / Siren mends Rudder / execution — observability+graph-core+logger landed (`93beffcfe`,`304b68f8d`,`61bdbc3e4`) / 2026-06-19 (prior: Merlin spins Cirrus `1556b9191`; Vanilla weaves Undergrowth, plan-author) |
| `statusline-enhancements` | Claude Code statusline: Oak-mark, session-shape indicators, logo swap; lane in two `current/` plans (session-state, logo-modularisation). Live detail + the `feat/comms-research` divergence to reconcile: thread record | [record][statusline] | claude-code / Opus 4.8 / Vole calls Hollow / live-logo-swap-and-plan-harden / 2026-06-16 (prior identities: thread record) |
| `agent-naming` | PDR-027 display-name derivation: versioned schema registry, session-hook identity surfaces, wordlist eras (v2 landed; v3 + era-pinning cure queued) | [record][agent-naming] | claude / Opus 4.8 / Squall hunts Troposphere / thread-open + v3-plan-author / 2026-06-13 (prior identities: thread record) |
| `strategy-and-plan-estate-holistic-review` | **REFRAMED 2026-06-22 ([ADR-200](../../../docs/architecture/architectural-decisions/200-intent-as-a-living-idea-graph.md)): planning-estate REWRITE on a living idea-graph.** Ideas are the fundamental node; the graph is the authoritative machine-readable SSOT (JSON + JSON Schema, built on `graph-core`); documents (vision/strategy/stream/thread/plan) are the co-equal human-navigable embodiment connected by frontmatter edges. The prior survey / Pass-1 / Stage-2 / conformance framing is **SUPERSEDED** (survey corpus archived to `reports/archive/`). Vision + strategy stand. ADR-200 (value/family/vocab/two-direction no-loss) + ADR-201 (Proposed, external-evidence) + the plans **COMMITTED** (`e33a278f9`); the `no-agent-substrate-access` eslint rule adopted + fixed + committed (`a3ca73f1a`); **progression GO**. Next: **WS2** idea-node schema + id-minting (WS1 graph-stack survey DONE, result in ADR-200 §Open; **WS4 thin-slice-proof is a hard gate** before the full harvest WS6). Thread-record curate-and-conserve + the dedicated consolidation (napkin rotation, PDR-113) are **DONE** (this session + Petrel stirs Wingspan). V0 = the form new plans take (the V0-bridge unblocks forward work now). Read ADR-200 + the thread record first. | [record](threads/strategy-and-plan-estate-holistic-review.next-session.md) | claude-code / Opus 4.8 (1M) / **Perseus lifts Umbra** / two-altitude knowledge-as-graph research + ADR-200 realisation-edge & family-entailment amendments (owner-directed) / 2026-06-23 ← claude-code / Opus 4.8 (1M) / **Pelican stirs Buoy** (2026-06-22 — reflected on the starter; curated this thread record; truth-fixed the rewrite plan + repo-continuity; next = WS2) ← **Cinder holds Warmth** (2026-06-22 EOD — architecture converged + committed: ADR-200/201 + plans + adopted eslint rule; progression GO) ← **Cosmos calls Infinity** (survey orchestrator; Pass-1 228/286, 6 collections; doc 08 runbook; window-2 closeout, claim closed) + **V1-fold UNHELD** (Saffron holds Sepal retired ← Ganymede herds Penumbra; design delivered) / n=2 owner-visible — Director seat DISSOLVED (chain Cutter→Vesuvius→Birch tracks Arbor, all retired) / 2026-06-21 (prior seats: Anvil lifts Solder, Pinnace hunts Marsh, Aardvark turns Whisper, Drake hunts Beeswax, Hobby wakes Halo, …Plover wakes Sundog — full table in thread record) |
| `orientation-skills-family` | Teaching-surface family: a portable agentic-AI primer (lead-in) plus the **one** repo-bound orientation lens (`/oak-explain`) across the PDR-112 portability seam | [record][orientation] | claude-code / Opus 4.8 (1M) / Zenith lifts Firmament / **UNIFICATION IMPLEMENTED 2026-06-23** — WS0–WS6; two lenses → one `/oak-explain` (mode discerned; setup distinct; primer + PDR-112 seam unchanged; PDR-112 NOT amended); 3 mid-flight owner directions folded (clean break / minimise-unique-info / the name); ADR-202; live owner walk done; committed `ca40d98ce` (+ plan-estate archives `689fb9133`/`7ceb1382d`); push-pending / 2026-06-23 (prior: Skipper tracks Reef (plan author), Orbit rides Horizon, Bora lifts Downdraft) |
| `reasoning-grammar` | Structured-reasoning capability: the portable grammar-of-thinking reference + the thin `oak-reason` skill (outward pair to `oak-metacognition`), wired into the metacognition directive, `oak-plan`, and start-right | [record](threads/reasoning-grammar.next-session.md) | claude / Opus 4.8 (1M) / Orbit rides Horizon / **COMPLETE** — landed `3b9836d89`; push pending (owner) / 2026-06-22 |
| `user-search-not-exposed-until-built` | Gate the unbuilt user-search MCP App tools off `tools/list` behind an opt-in flag (default OFF) until the experience ships | [record](threads/user-search-not-exposed-until-built.next-session.md) | claude-code / Opus 4.8 (1M) / Foehn calls Headwind / **COMPLETE** — Cycle 1 `ac0a98c5b`, Cycle 2 `906cca9b3`, plan fixes `ff26bcf69`; push pending (owner) / 2026-06-23 |
| `main-sonar-ai-profile-to-zero` | Drive `main`'s Sonar AI quality-profile backlog (398 issues, 48 rule classes) to **zero** — fix or genuine-FP only, no suppression. Owner-directed: deliberately-adopted profile. High-priority lanes: `tssecurity:S8707` agent-CLI path-injection, regex-safety (`S8786`/`S5843`/`S6035`) via per-workspace regex consolidation, test-integrity (`S2699`/`S5914`). Supersedes the retired `main-critical-sonar-remediation` lane | [record][main-sonar-zero] | claude / claude-opus-4-8 / Junk tracks Moorings / implementer — S8707 sites 1-2 + S4036 MERGED to main via PR #223 (`9d2e33bb1`); site-3 only remains (Thyme's paused claim `ff3da671`) / 2026-06-25 ← claude / claude-opus-4-8[1m] / Thyme lifts Compost / S8707 site-2 committed (`4c9cfbfc9`) + branch pushed; PAUSED / 2026-06-25 ← claude-code / Opus 4.8 (1M) / Aspen tracks Root / thread-open + first-hand triage / 2026-06-24 |

## Paused Threads

Paused threads retain their next-session records and identity history; they are
not the current session-priority lane. Reactivation is owner-directed.

| Thread | Purpose | Record | Latest identity |
| --- | --- | --- | --- |
| `eef` | EEF graph-tooling rebuild — D0–D7 delivered & shipped (v1.16.0); D7 proof dropped as overkill (paused 2026-06-19) | [record][eef] | claude / Fable 5 / Thyme wakes Canopy / record-condensation / 2026-06-12 (prior identities, 30+ seats: thread record) |
| `school-data-search` | Oak School Data Search service (POC MVP): deep review complete, build-ready (paused 2026-06-19) | [record][school-data-search] | claude / Opus 4.8 / Fiery Sparking Caldera / deep-review-and-refinement / 2026-06-04 (prior identities: thread record) |
| `semantic-search` | Search data foundations: upstream-schema alignment, bulk sourcing, minimal-adaptation arc (paused 2026-06-19) | [record][semantic-search] | claude / Opus 4.8 / Moonlit Waxing Nebula / upstream-realignment-specialist / 2026-06-03 |
| `oak-kg-ontology-planning-review` | Plan the `oak-kg`/ontology work via a deep review of the Oak Curriculum Ontology repo (opened, not started; paused 2026-06-19) | [record][oak-kg-ontology] | claude / Opus 4.8 / Twilit Cascading Supernova / thread-opener-brief-only / 2026-06-04 |
| `connecting-oak-resources` | Oak resource graph substrate for EEF | [record][connecting] | claude / Opus 4.8 / Galactic Glowing Prism / jc4-plan-authoring (kg collection) / 2026-06-02 (prior: Opalescent Cascading Planet, Stellar Waning Planet, Silvered Lurking Mask, all 2026-06-02) |
| `branch-fitness-and-push-cadence` | Small-PR, push-often, branch-fitness, PR/Sonar protocol substrate | [record][branch-fitness] | Pelagic Snorkelling Sextant / codex / GPT-5 / Cycle 1 substrate capture / 2026-05-24 |
| `mcp-product-analytics` | MCP product analytics design and Path-to-GA Programme | [record][mcp-analytics] | Stellar Glowing Satellite / claude / claude-opus-4-7 / Programme landed + amendments / 2026-05-26 |
| `observability-sentry-otel` | Sentry/OTel integration | [record][observability] | Umbral Creeping Night / claude-code / opus-4.7 / 2026-05-10 |
| `exploring-open-education-resources` | Third-party OER | [record][oer] | Gnarled / claude-code / 2026-05-01 |
| `sector-engagement` | External adoption | [record][sector] | claude-code / Fable 5 / Forge turns Basalt / dfe-data-sdk-seed-authoring / 2026-06-12 (prior: Squally / cursor / 2026-04-30) |
| `architectural-budget-system` | Architectural budget | [record][budget] | Nebulous / codex / 2026-04-29 |
| `cloudflare-mcp-security-and-token-economy-plans` | Cloudflare MCP | [record][cloudflare] | Glassy / codex / 2026-04-28 |

## Next Safe Steps

### Comms-Corpus Research — RETIRED 2026-06-14

Thread concluded: WS0–WS7 complete, PR #208 merged to main (`a6b14a8a3`). Retired record:
[`threads/retired/agent-collaboration-research.next-session.md`](threads/retired/agent-collaboration-research.next-session.md)
(carries the candidate-themes research substrate + the WS7 closeout conserved findings). Findings
homed in **PDR-094** + **ADR-199**, the `reports/agentic-engineering/` WS2–WS6 synthesis, and the
rightsizing keystone M4; the deep-convergence pass that was deferred here ran as this dedicated
consolidation (2026-06-14). **Standing residual** (not a reopened lane): the coordination-tier
curator-pass — ~1,707 comms events past the 7d window await body-read disposition before the next
archive-move RUN, fired by retention-window elapse via `consolidate-docs` step 3a / `oak-curator-pass`;
the work-list + verification recipe live in the retired record's §"WS7 Closeout — Conserved Findings".

### Agent Naming (v3 + era-pinning cure)

Thread [`agent-naming`][agent-naming]; controlling plan
[`agent-naming-schema-v3.plan.md`](../../plans/agent-tooling/current/agent-naming-schema-v3.plan.md)
(DECISION-COMPLETE / QUEUED, `current/`). v2 merged (PR #189). **Next safe
step**: execute **Phase 1 (WS1, era-pinning cure)** off a fresh branch from
`main` — the P1 single-valued-identity fix (hooks pin the era
`OAK_AGENT_NAMING_SCHEMA_ID`, not the rendered name). It ships independently and
is the owner-ordered prerequisite for v3 activation. Phases 2 (C wordlist
curation, owner taste review BLOCKING) and 3 (v3 registry entry + activation)
follow. Orientation: read the thread record, then the plan, then re-grep the
`OAK_AGENT_IDENTITY_OVERRIDE` consumer set (plan-body first-principles check).

### Agent Experience (AX) Improvement — WS-3 F-41 LANDED; next highest-impact item

Umbrella plan
[`agent-experience-improvement.plan.md`](../../plans/agent-tooling/current/agent-experience-improvement.plan.md)
(`current/`), evidence
[report](../../reports/agent-experience-cause-class-analysis-2026-06-21.md), doctrine PDR-111.

**WS-3 (F-41 path-safety) is DONE** (2026-06-21, Oyster weaves Surf): `resolveCoordinationHome` resolves the
**primary checkout** via `git worktree list`, so any worktree seat shares one coordination home — commits
`b5408291d` + `c90150ffa` + `4fd640089` (closing F-41 across comms AND commit-queue defaults), gate-green.
A forward-only merge (`ed0c7f3b2`) then integrated the other checkout's 2 pushed commits (explain-repo
skill + `jc-`→`oak-` sweep); local is **0 behind** (fully integrated), `pnpm check` green, NOT pushed
(owner controls push; the branch merges to `main` the normal way — a PR with squash-and-merge — when its
work is done). B2 (the CLI-tail
default-via-home migration) deferred → [`future/coordination-home-explicit-targeting-migration.plan.md`](../../plans/agent-tooling/future/coordination-home-explicit-targeting-migration.plan.md).

**Next safe step (owner-chosen 2026-06-22): WS-1 — the CLI-ergonomics conformance guard.** Execute
[`agent-tools-cli-ergonomics.plan.md`](../../plans/agent-tooling/current/agent-tools-cli-ergonomics.plan.md)
from **Phase 0** (the convention-audit + scope-ratification gate) → WS6 (the PDR-055 cl.10 conformance
guard). Retires the largest cause-class (~19 frictions, Class A); the driven plan is already
`READY FOR EXECUTION`. The umbrella sequences it; the driven plan owns its own cycles.

Subsequent AX items (not this session): **WS-4** (the `frictions-register` drain validator that recomputes
integrity against fs/git + a generated routing index → **WS-6** disposition ledger — the systemic spine);
**WS-2** (watcher liveness + canonicalisation — firsthand `drain`-timeout watcher deaths observed
2026-06-21); and **WS-3 B2** (the deferred F-41 CLI tail, reframed to the git-resolved home).

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

### Agentic-Engineering Curation

1. The latest dedicated consolidation is 2026-06-18 (Wisteria spins Bark): bulk done (continuity
   processed to rest, napkin graduated to 5 patterns, PDR-104 best-effort policy, 7c/7e audits,
   PDR-098 recurrence-capture wired into consolidate-docs step 7). The remainder is owner-scoped to
   a fresh session — full pickup: [`agentic` thread record][agentic] §NEXT-SESSION PICKUP.
2. The relative-link integrity item is accepted as a future validator lane, not
   implemented tooling; promote the plan only on its recorded trigger.
3. Comms-event rotation is the retention-gated curator-pass (ADR-199 / PDR-094; the comms-corpus
   research is RETIRED — see §Next Safe Steps › Comms-Corpus Research): archive-move events past
   their class window, gated on absorption + provenance. Analysis is never gated; fitness is routing
   evidence only — never archive, split, shard, or rename unprocessed content to improve scores.

### Connecting-Oak / PR History

Before resuming paused graph-substrate work, re-check current PR, CI, Sonar,
CodeQL, active claims, commit queue, and git state. Do not rely on historical
issue counts in archived prose.

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

1. MCP product analytics execution-plan promotion is deferred. Production PostHog
   capture still needs the legal/privacy gates named in the exploration record.
2. Monorepo workspace topology is held by owner decision (2026-05-09) until after
   the graph MVP implementation tranche, unless the owner reopens it.
3. MCP launch-readiness: ratify the impact-first Stage 1–4 ladder (assessment report §8) →
   promote the launch-readiness-and-milestone-redefinition stub. K1–K3 keystones are ratified
   and absorbed by the strategy corpus.
4. External-facing capability corpus: decide source-of-truth topology and first-tranche scope
   — these gate Direction A `t0` / plugin-package `w0`
   ([`external-facing-capability-distribution.plan.md`](../../plans/user-experience/educator-end-users/current/external-facing-capability-distribution.plan.md)).
5. Native-MCP-auth build-vs-buy: adopt / adopt-partial decision on the
   [spike](../../plans/security-and-privacy/future/native-mcp-sdk-auth-build-vs-buy.md).
6. Upstream/SDK forks: endpoint-style cross-refs in MCP tool descriptions; Q-010 (repair vs
   retire the orphaned `oak-curriculum-sdk` typedoc estate).
7. Curriculum graph estate — single-team proposal: whether to bring the Open Curriculum Ecosystem,
   the Open Curriculum API, the Curriculum Ontology, and Atomic Concepts under one team for ~6 months.
   See [`curriculum-graph-estate-synthesis-2026-06-22.md`](../../reports/curriculum-graph-estate-synthesis-2026-06-22.md);
   an SLT brief is held local (reference-local, not version-controlled).

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
- No machine-local paths anywhere in the repo, ever (PII) — enforced by the
  `validate-no-machine-local-paths` repo-validator + the `machine-local-path`
  write-hook (`.agent/rules/no-machine-local-paths.md`).

[main-sonar-zero]: threads/main-sonar-ai-profile-to-zero.next-session.md
[mcp-analytics]: threads/paused/mcp-product-analytics.next-session.md
[observability]: threads/paused/observability-sentry-otel.next-session.md
[agentic]: threads/agentic-engineering-enhancements.next-session.md
[connecting]: threads/paused/connecting-oak-resources.next-session.md
[oer]: threads/paused/exploring-open-education-resources.next-session.md
[budget]: threads/paused/architectural-budget-system.next-session.md
[cloudflare]: threads/paused/cloudflare-mcp-security-and-token-economy-plans.next-session.md
[sector]: threads/paused/sector-engagement.next-session.md
[eef]: threads/paused/eef.next-session.md
[oak-kg-ontology]: threads/paused/oak-kg-ontology-planning-review.next-session.md
[school-data-search]: threads/paused/school-data-search.next-session.md
[semantic-search]: threads/paused/semantic-search.next-session.md
[agentic-mechanisms-discovery]: threads/agentic-mechanisms-discovery.next-session.md
[branch-fitness]: threads/paused/branch-fitness-and-push-cadence.next-session.md
[statusline]: threads/statusline-enhancements.next-session.md
[agent-naming]: threads/agent-naming.next-session.md
[orientation]: threads/orientation-skills-family.next-session.md
[continuity-state-plan]: ../../plans/agentic-engineering-enhancements/future/continuity-surfaces-are-state-not-memory.plan.md
