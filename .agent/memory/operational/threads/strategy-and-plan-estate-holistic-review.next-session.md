# Next-Session Record — `strategy-and-plan-estate-holistic-review` thread

Holistic work on Oak's **vision, strategy, and planning estate** — three
**separate, co-equal, first-class bodies of work**. The transition this thread
serves: **the repository is moving from an important experiment to an important
product** (owner, 2026-06-17). The relationship between the layers is
**informational dependence, not execution order** (owner, 2026-06-18):

```text
Oak's strategy → our vision → our strategy → our planning
(we align, not fulfil)   (3 streams)   (cohesive system)   (the estate)
```

Each arrow means *what must be known to author the next layer correctly*. Bodies are
co-equal in **importance**; they differ in **work-volume** (the estate restructure is
~80% of the work) and **dependency-direction** — never collapse those axes into
"priority". Re-org is **value-preserving**: express the value encoded in plans more
clearly; never delete ideas. **Scope authority is the controlling plan**
[`vision-strategy-and-plan-estate.plan.md`](../../../plans/product-development-governance/vision-strategy-and-plan-estate.plan.md),
reconceived to this model 2026-06-18.

The 2026-06-15 survey (waves, census, adversarial verification) is the prior
foundation; its report + raw data live in
[`.agent/reports/archive/plan-estate-survey-2026-06-15/`](../../../reports/archive/plan-estate-survey-2026-06-15/README.md)
(archived 2026-06-18; a fresh survey is a Body-3 prerequisite).

## Handoff → Drake hunts Beeswax (successor) — 2026-06-21, Cutter holds Reef closing out

Hi Drake — you inherit the **planning-system / repo-intent-graph design** boundary. This synthesises a long session; per-turn detail is in the Cutter sections below; scope authority is the controlling plan + [`repo-intent-graph.plan.md`](../../../plans/product-development-governance/future/repo-intent-graph.plan.md).

**Landed (working-tree, uncommitted — owner controls push):**

- **V0 `plan` node-schema — authored and survey-ready:** [`plan-node-schema.v0.md`](../../../plans/product-development-governance/plan-node-schema.v0.md) (collection top-level; a `spec` node-type). Decision-complete, explicitly pre-survey. Model: orthogonal axes (kind · Linear-projected execution · disposition · the expiring `gate` that replaced `paused`); typed edges (`serves_strategic_choice`, `derives_from`, `supersedes`/`superseded_by`, `depends_on` blocking/beneficial, `thread`, `projects_to`, `realized_by`, `validated_by`); graph-contract shape (§5); Zod idiom (§6); four-source reconciliation (§7); §8 deferrals; §0 V0→survey→V1 loop incl. the LOCKED-challenge clause.
- **DORA woven at all levels** (owner-directed): `measures.md`, `stream-agentic-framework.md` (FRAME core value), the comparison doc [`dora-2025-and-the-practice.comparison.md`](../../../research/dora-2025-and-the-practice.comparison.md), and the intent-graph plan (§Delivery-performance metrics, §Closing the loop, Stage 4 Actuation).
- **Link checker BUILT + first-hand verified:** `validate-markdown-links` (agent-tools), report-only / non-blocking, fenced-block fix applied, 34 unit tests pass; finds **961 live broken links (314 auto-fixable)**. Remediation deferred → [`agent-tooling/current/markdown-link-remediation.plan.md`](../../../plans/agent-tooling/current/markdown-link-remediation.plan.md).

**Live coordination:**

- **Volcano lifts Gleam (7c6879)** runs the deep plan-estate survey (Stage 2), consuming V0 as the lens. V0 signalled survey-ready on the ArcAngel channel [`2026-06-21-v0-plan-node-schema-...md`](../../../collaboration/rapid-comms/2026-06-21-v0-plan-node-schema-cutter-holds-reef-and-volcano-lifts-gleam.md); n=2 mode (PDR-082). Both paired watchers (canonical comms + ArcAngel) running.
- **Ferret seeks Tunnel** is running a parallel **dedicated curation pass** in `practice-core` (PDRs / principles / CHANGELOG — staged, NOT mine). Do not touch their files; the thread-scoped deep consolidation is theirs.

**What you pick up (nothing blocks the survey):**

- Absorb the survey's taxonomy-grounding + conformance findings — **critically, input-to-verify** — and fold additive refinements into V1 (the §0 loop).
- OWNER-RESERVED, awaiting owner sign-off (survey grounds them): `disposition` + `gate.awaiting` enum values, the folder collapse, the default gate-expiry horizon.
- Build-deferred / owner-gated: the **Stage-4 actuation / evidence-ingestion layer** (the thing that turns the static graph into a running system — connectors Vercel/Sentry/Sonar/GitHub/PostHog + triggers + validated write-back; highest-leverage build after Stage 1); the observe-mode extractor (Stage 1.4); the strategic-choice registry (Stage 1.3); Linear projection. The link-remediation session (planned).

**Loss-scan (from inside my context — minimal, I homed continuously):** little survives un-homed. The one nuance worth flagging that no artefact states plainly: **the consolidation gate is due but owned by Ferret's live curator pass — do not re-run a colliding deep consolidation**; my session's captures (napkin entries, this record) are staged for that pass to absorb. Second: the link-checker has a known minor scope refinement to apply (exclude vendored `.agent/reference-local/` — ~5 files) noted in the remediation lane, not yet done.

**Next safe step:** the survey runs (Volcano) → refines V0 → V1; or Stage-1 build promotion (owner-gated). My claim is closed; nothing retained for handoff beyond this record.

## Where We Are (2026-06-21, Drake hunts Beeswax — implementer pickup; owner-gated V0 calls settled + encoded; survey running; continuity refreshed)

Picked up Cutter's implementer boundary (owner-directed; director-cleared by Vesuvius calls Quench after the PDR-064 Moment-2 transfer). Cutter's handoff (the sections below) read end-to-end before any edit. Claim `6f12eff8` open (implementer; areas `product-development-governance/**` + the markdown-link-remediation plan + the markdown-links validator).

- **Owner-gated items SETTLED.** Owner direction was "settle all user-gated items now"; on the owner's metacognition challenge ("are there really questions?"), the LTAE + answer-is-forced lens showed **none were genuine owner forks** — three were forced by doctrine/architecture, one a cheap default. Resolved and **encoded into [`plan-node-schema.v0.md`](../../../plans/product-development-governance/plan-node-schema.v0.md)**:
  - `disposition` + `gate.awaiting` enum baselines → **owner-signed** (values unchanged; SURVEY-MAY-ADD-VALUES still applies). Doctrine-backed (from the ratified intent-graph plan), so re-asking was friction.
  - Folder collapse (`current`+`active` → one executable home) → **owner-signed**; forced by the schema's own logic (execution-status is Linear-projected, so the folder split stored execution-state — the drift V0 kills). Exact tree survey-grounded.
  - Default gate-expiry horizon → **30 days** (per-gate-overridable). A cheap default set with reasoning, not a menu.
  - §8 trimmed of the now-resolved items; OWNER-RESERVED tags flipped to owner-signed across §2.2/§3.3/§3.4/§3.6/§6. Lint-clean, no broken anchors. Schema (fields/enums/edges) structurally UNCHANGED → survey conformance scoring unaffected.
- **Survey go-ahead GIVEN (owner) → Stage 2 RUNNING.** Volcano lifts Gleam ran Phase-0 (286 plans / 16 collections) then retired to a fresh session; **Hobby wakes Halo** is the survey orchestrator. Self-contained handoff: [`.agent/reports/plan-estate-survey-2026-06-21/01-fresh-session-handoff.md`](../../../reports/plan-estate-survey-2026-06-21/01-fresh-session-handoff.md) (+ `00-method-and-execution-design.md`, `worklist-plans.tsv`). Survey is READ-ONLY (writes only `.agent/reports/`); pre-launch (assumptions-expert proportionality review pending before the ~286×≥3 fan-out, batched across Workflow runs). I re-pair with Hobby: taxonomy-grounding → V1; conformance inventory → restructure work-list.
- **The V0 update was coordinated as a survey HOLD-then-lift** so the survey reads a settled lens (V0 being edited → HOLD → "V0 survey-ready (updated)" → cleared at 10:21Z).
- **Continuity refresh** (this section + `repo-continuity.md`) done under a director lease (Vesuvius owns `.agent/memory/operational/**`).

**Next safe step:** the survey emits the taxonomy-grounding (→ V1 additive refinements) and the conformance inventory (→ the Stage-3 restructure work-list); assess them first-hand and fold additive refinements into **V1**. Stage-1 build (extractor / registry / validator) remains **OWNER-GATED**. Working tree uncommitted; owner controls push.

**Team (2026-06-21 window):** Drake hunts Beeswax (implementer), Vesuvius calls Quench (director), Hobby wakes Halo (survey orchestrator) live; Cutter holds Reef, Volcano lifts Gleam, Ferret seeks Tunnel retired cleanly.

## Where We Are (2026-06-21, Cutter holds Reef — `plan` node-schema V0 authored; the `paused` state replaced by an expiring gate, owner-ratified)

Authored **V0 of node-schema #1** — the `plan` node-type's contract, the lens the deep survey
needs. Solo docs session (empty claims, stale comms); claim opened on the
`product-development-governance/**` plan area, role implementer.

- **Deliverable:** [`plan-node-schema.v0.md`](../../../plans/product-development-governance/plan-node-schema.v0.md)
  at the collection top level (a `spec` node-type, **not** a plan — ADR-117 reserves `future/` for
  strategic plans, and a frontmatter-and-edge contract is reference material). Decision-complete as
  V0, explicitly pre-survey: every field/enum/edge stated definitely, each tagged
  LOCKED / SURVEY-MAY-ADD / OWNER-RESERVED. It reconciles **PDR-018 + ADR-117 + templates + the
  emergent reality** (first-hand census: ≈30+ `status:` values conflating four axes; `type:` a
  14-value free label; `isProject` in no doctrine; 38/284 plans with no frontmatter).
- **The four sources reconciled:** overloaded `status:` → orthogonal axes; `type:` → closed
  `node_type: plan` + `kind`; `lifecycle:`/`isProject` dropped; `foundational_adr` → the
  `derives_from` edge; PDR-018's blocking/beneficial → a typed property on the `depends_on` edge;
  execution-status is **not stored** (Linear-projected via `projects_to`, which kills `current`↔`active` drift).
- **Owner design decision this session (ratified):** the `hold: paused` axis is a fundamentally bad
  idea — it is the indefinite-holding-state the repo's `no-hedging-vocabulary` doctrine forbids, and
  it smuggles execution-state into the durable layer. **Replaced by an expiring `gate`**
  (`awaiting` + `clears_when` + mandatory absolute `expires`); plan-on-plan blocks use the
  `depends_on` blocking edge. An expired gate is drift the observe-mode extractor surfaces for a
  forced decision (renew / resolve / dispose); never auto-cancels. Maps word-for-word onto the
  doctrine ("named dependencies and an owner-agreed gate, or removed by owner decision") and reuses
  the claims/queue/heartbeat TTL-staleness idiom.
- **OWNER-RESERVED (verdict recorded, sign-off pending, survey-grounds):** the closed enum *values*
  for `disposition` and `gate.awaiting`; the default gate-expiry horizon; the `current`+`active`
  **folder collapse**. (`kind` values and `depends_on` blocking/beneficial are locked — doctrine-backed.)
- **Plan updated:** [`repo-intent-graph.plan.md`](../../../plans/product-development-governance/future/repo-intent-graph.plan.md)
  records V0's existence + location, the **V0 → survey → V1 sequencing**, and the gate model (the
  earlier `paused`+reason sketch is replaced). No extractor/registry/validator built — those are
  Stage 1.3/1.4, owner-gated.

- **DORA folded into the planning-systems design (owner-directed, same session).** Read the DORA
  2026 ROI report + the 2025 State of AI-assisted Software Development + the metrics guide / capability
  catalogue first-hand. Owner direction: **DORA metrics considered at all levels of the planning-systems
  design**, for the repo's **two products — the MCP app, and the Practice / agentic framework (FRAME)**.
  Encoded in the intent-graph plan (new §Delivery-performance metrics + a boundary line) and node-schema
  V0 (new §5.4): two altitudes (literal DORA for the app; DORA-*shape* not bands for the Practice);
  the five metrics attach via the reserved `product`/`product-increment` node-types, `evidence` edges
  (Vercel/Sentry), `projects_to` (Linear throughput state), and native planned-vs-rework attribution
  (`serves_strategic_choice`+`kind`+`disposition`); metrics are a Pillar-1 projection. Deeper ambition
  (design intent, not built): the seven DORA AI-capabilities map closely onto the repo, so the graph can
  instrument capabilities AND outcomes — the FRAME measurement story. **Build gated** (no extractor/dashboard);
  CFR already seeded in `observability-and-quality-metrics.plan.md`. Adjacent follow-ons offered, not yet made:
  the strategy corpus's open "measures" item, and extending the observability plan to the full DORA five.
- **DORA follow-ons + comparison landed (owner-directed, continued).** (1) `docs/strategy/measures.md`:
  added DORA delivery metrics (both products) as the in-repo leading signal, distinct from Oak-grounded
  impact; the AICM seven + VSM-flow as the FRAME measures shape (targets stay Oak-grounded). (2)
  `observability-and-quality-metrics.plan.md`: extended the CFR seed to the full DORA five + sources
  (git/Vercel/Sentry) and intent-graph attribution. (3) **Same-repo thesis** sharpened in the intent-graph
  plan with the concrete toolchain — GitHub (change), Linear (intent/execution via `projects_to`),
  and Sentry with OTEL spans (runtime/incident) — the toolchain-observability DORA's logs-based
  metrics need, intrinsic here. (4) **V0 updates** (ask 4): added the `realized_by` edge (intent→realization join key — the one
  real schema gap the DORA work surfaced; edge LOCKED, endpoints survey-may-refine), role-named the
  `product`/`product-increment` registry entries, noted the toolchain. Core model unchanged. (5) Authored
  [`.agent/research/dora-2025-and-the-practice.comparison.md`](../../../research/dora-2025-and-the-practice.comparison.md)
  — convergence-and-divergence; key honest gaps: **user-centric focus is a link not a loop** (the report's
  make-or-break for team performance; internal substrate is distant from teachers) and **no continuous
  accuracy/usefulness/cost instrumentation** (which the DORA-metric work closes). (6) Owner reframe:
  **the strategy/intent/planning system is becoming a significant part of the Practice's core value** —
  reflected in the intent-graph plan's FRAME section (plumbing → product). Read the full 2025 report
  pp. 1–96 first-hand. Offered, not yet made: landing the core-value reframe in `stream-agentic-framework.md`.
- **Loop-closure + transition design (owner-directed, continued).** Four converging asks resolved into
  one structural move — *wire evidence back into the graph*. (1) **User-value loop** (link → loop): the
  `validated_by` returning edge attaches user-value evidence (usage / teacher feedback / EEF / Oak-impact)
  to `strategic-choice`/`product-increment`; a validator flags choices with delivered increments but no
  returned evidence; completes the VSM idea→customer flow the graph truncated at delivery. (2)
  **Continuous-measurement gap map + uniform closure**: have = fitness (ADR-144) + per-change gates; gaps =
  delivery (DORA five), output accuracy (gate-fail + rework trend), usefulness (the loop), cost-per-value
  (token/seat via `realized_by`), AICM capability proxies — all Pillar-1 projections over graph + `evidence`
  edges; no separate stack. (3) **Multi-dev transition** (owner: one-dev-many-agents NOW → many checkouts,
  1–2 devs at varying times, variable agent density inc. minimal): design constraints = author-agnostic,
  versioned-substrate-as-continuity, graceful degradation; dissolves the topology divergence (DORA
  team-performance becomes directly applicable). (4) **Value called out** in `stream-agentic-framework.md`
  (the system measures its own delivery natively — FRAME core value) + measures line. Encoded across the
  intent-graph plan (new §Closing the loop), node-schema V0 (§5.5 + `validated_by` + author-agnostic in §1),
  and the comparison doc (§3 now "designed-for"). All build-gated. See [[project_multi_developer_transition]].
- **Evidence-ingestion requirement made explicit (owner-directed).** Added intent-graph plan
  §"From structure to system — the evidence-ingestion requirement": the typed graph + edges +
  projections are *structure* (inert); it becomes an effective agentic-first product-creation system
  only with the **actuation layer** — connectors drawing directly from **Vercel / Sentry / Sonar /
  GitHub / PostHog**, **triggers** (event-driven + scheduled) driving agentic analysis, and validated
  **write-back** to the graph. The *how* is explicitly TBD (owner-gated; candidate for its own plan —
  highest-leverage build after Stage 1). PostHog = the user-value loop's concrete signal. Reflected in
  V0 §5.5 and the comparison doc §3. **Link-tooling finding (owner Q):** there is **no** standing gate
  that checks every internal markdown link resolves — markdownlint MD051 checks only *same-file*
  fragment anchors; `validate-reference-direction` resolves links only to police *direction* over
  *policed doctrine* (excludes backticked paths), not estate-wide existence; the "274 links checked"
  was a one-off manual audit. I've been manually `[ -f ]`-checking all session. **One-off scan this
  session:** 0 broken links in my edited files; ~436 flagged across the live (non-archive) surface
  out of 5,734 (a naive check — some are root-relative `/…` paths the quick checker mishandles, but
  many are genuine, e.g. ADR-119 → `../../VISION.md`, stale since VISION moved to root). Offered (not
  built): a `validate-markdown-links` repo-validator (resolve every internal link and cross-file
  fragment; handle the repo's root-relative convention; respect the backtick and ephemeral-archive
  exclusions; add at warn first given the existing backlog, then triage, then escalate to error).
- **Pre-survey readiness + link-checker built (owner-directed, continued).** **V0 is survey-ready:**
  wired the survey brief to the concrete lens (`plan-node-schema.v0.md` added to `related` + named in
  Prerequisites) and rounded out V0 §8 (`realized_by` endpoints / `validated_by` / the ingestion layer
  = survey-exposed). Verdict on "does V0 need updates before Volcano surveys": only that wiring +
  completeness — **no structural change**, because V0 is provisional BY DESIGN (the brief's "let the
  estate speak; the lens is not a verdict"); over-polishing pre-survey would be premature. **Ingestion
  layer specified + discoverable:** promoted to a named **Stage 4 — Actuation** in the intent-graph
  staging spine (per source: Vercel/Sentry/Sonar/GitHub/PostHog → connectors + triggers + validated
  write-back). **Link checker BUILT** (subagent, verified first-hand — ran the tests + validator + gate
  myself): `validate-markdown-links` in agent-tools — pure helpers + 31 unit tests (pass), report-only
  (`BLOCKING=false`, exit 0; `repo-validators:check` still exit 0), root-relative `/` handled correctly.
  Found **980 broken live links (322 auto-fixable unique-basename, 658 manual)**; ~5 source files are
  vendored `reference-local` (minor scope refinement to apply: exclude reference-local). **Remediation
  deferred** to a planned session:
  [`agent-tooling/current/markdown-link-remediation.plan.md`](../../../plans/agent-tooling/current/markdown-link-remediation.plan.md).
  Test-expert reviewing the suite (verdict pending). **Volcano lifts Gleam** not yet registered; will
  open an ArcAngel channel for V0-handoff coordination — I'll pair-watch ArcAngel + the canonical comms.
- **n=2 coordination live + link-checker corrected (owner-directed, continued).** Volcano lifts Gleam
  (7c6879) opened the ArcAngel channel + posted n=2 team-start (PDR-082); consumer verdict on V0 = sound
  lens. **Both paired monitors now running** (canonical all-channels comms watcher + ArcAngel tail,
  persistent) — the owner caught that I'd committed to watching but hadn't armed them. Responded on
  ArcAngel: **signalled V0 survey-ready** (owner-reserved enum values don't gate the survey — they're
  survey-grounded), confirmed scope-division (plan-only conformance; adjacent surfaces by reserved
  node-type) and DORA/`realized_by` as finalised. **V0 update from Volcano's input:** added a §0 clause
  licensing the survey to flag estate-evidence *against* a LOCKED decision as an owner re-ratification
  candidate (the lens must not suppress a real signal). **Link-checker: test-expert review reconciled
  critically** — it found a real product defect (fenced ``` code blocks not stripped → false-positive
  links) which I **fixed via TDD** (fence-tracking + 3 boundary tests; 34 tests pass; broken count
  980→961); and it corrected MY error (the missing CLI integration test is doctrine-sanctioned per the
  validator-script rule, not a gap). Validator still report-only/non-blocking.

**Next safe step:** unchanged from Plover — the **deep-survey session** now has its lens (V0); or
**Stage-1 build** promotion (owner-gated). Working tree uncommitted; owner controls push.

## Where We Are (2026-06-21, Plover wakes Sundog — open-mind review done; intent-graph vision ratified; plans updated, NOT executed)

Owner-directed open-mind review of the strategy/vision/plan estate. The review **confirmed the
strategy and revalidated the signed bets (no re-decision)**, ran the **vision tripwire-2 pass (no
major upstream change)**, and revalidated the controlling plan — then opened into ratifying a larger
frame and updating the plans. **No build started** (owner: "update the plans, don't start yet").

**Owner decisions ratified (controlling plan §Owner Decisions 20–22):**

- **Search/graph external-vs-internal-reuse — a FALSE DICHOTOMY; settled.** The layered architecture
  (generic primitives → reusable libraries → app-specific services → apps, separated by degree of
  coupling) means search/graph are built for general reuse, internal AND external in one build; the
  generic layers are shared, publicly-releasable infrastructure. Confirmed first-hand: `graph-core` /
  `graph-project` / `search-contracts` are general (transport-agnostic), `graph-corpus-sdk` /
  `oak-search-sdk` are the Oak instances — `graph-ingest`'s own description says "Oak-specific corpus
  mapping belongs in graph-corpus-sdk". It does **not** gate the restructure; remaining prerequisites
  are the plan standard + the fresh survey only.
- **Internal-transformation alignment — settled.** Oak getting better at delivering Oak's goals;
  internal improvement maps to / amplifies the external goals; the vision already carries it.
- **Repo intent graph — VISION RATIFIED ("all of it").** The plan estate is one corpus of a typed,
  agentic-first memory and intent graph: six pillars (one schema generated → indexes are projections;
  on the generic graph substrate; dual human/agent legibility; authority as typed edges; intent
  preservation; external systems as typed edges). Whole contract shape ratified up front; build staged
  node-type by node-type. **The plan standard is the `plan` node-schema (#1).** Schema-first applies as
  a **second domain** (the Cardinal Rule names the OpenAPI spec; the same discipline applies here).
  Taxonomy survey-gated; the `suggestions/` are input-to-verify (ChatGPT-synthesis, convergent).

**Artefacts authored (all `future/`, NOT executable — owner-gated):**

- [`future/repo-intent-graph.plan.md`](../../../plans/product-development-governance/future/repo-intent-graph.plan.md)
  — the ratified design + staging. **Stage 1 = the smallest slice** that unlocks the plan work without
  compromising the vision: ratify the contract v1 (docs) + the `plan` node-schema (#1) + the
  strategic-choice registry + an observe-mode plan extractor (over `graph-core`, via `repo-validators`).
  Stage 2 = the deep survey; Stage 3 = the restructure; Stage 4+ = grow the graph, external projection
  gated on a live consumer. Carries the **plan-state model** (orthogonal axes — kind/readiness, live
  execution-status [Linear-projected], terminal-disposition, hold; plan ≈ Linear Project; enum values +
  folder collapse ratified at Stage 1, survey-grounded).
- [`future/deep-plan-estate-survey.plan.md`](../../../plans/product-development-governance/future/deep-plan-estate-survey.plan.md)
  — decision-complete brief for the deep-survey **session**: ≥3 agents per plan (holistic + specialist),
  cross-cutting relational passes (across plans / groups / plans↔threads / plans↔doc-groups), an
  **adversarial verification gate (no finding accepted unverified)**, dynamic-workflow orchestration,
  loop-until-dry completeness. Method fixed; findings not presupposed.

**Editorial pass (applied; working-tree, owner controls push):** TPC expanded (third-party content); MCP + GA expanded on first
use across VISION + the corpus; OWA dropped; vendor-collaboration de-duplicated; MCP-protocol
first-mentions link to the MCP intro and MCP-app first-mentions to the MCP Apps overview (owner-provided
URLs); the MCP app made concrete ("Oak inside ChatGPT, Claude, and Gemini"); stream links added in the
root README + VISION; **streams↔threads clarified** (different axes; many-to-many through plans — strategy
README §spine).

**Grounded knowledge for the next executor (verify-don't-trust paid off):**

- Conformance figures are UNVERIFIED: a subagent's "58% no frontmatter" scanned ALL `.md`; my first-hand
  `*.plan.md` scan = 38/282 (~13.5%); the controlling plan's "38%" reconciles with neither. The fresh
  survey measures them — do not design against any figure.
- Two thread-flagged editorial items (release-channel Gemini; OWA expand-on-first-use) were already fixed
  in the live files when checked — the thread's flags were stale.
- External MCP URLs are owner-provided; resolution not independently verified.

**Next safe step (two openers exist):** (1) the **deep-survey session** per its brief — needs the `plan`
node-schema lens (a v0 draft suffices; the survey grounds the v1); (2) **Stage-1 build** — promote
`repo-intent-graph` Stage 1 to `current/` (**OWNER-GATED**). Editorial batch done. Owner controls push.

## Where We Are (2026-06-20, Juniper stirs Taproot — handoff received; Body-3 under-spec resolutions encoded)

Picked up the thread from Kiln guards Patina (owner-directed succession). Handoff verified
first-hand: commit `8fc0f95ca` (diagnosis and granularity settled, README-index refactor,
per-stream bets owner-signed-off, pupil decontamination), Kiln's claim released, working tree
clean bar this session's artefacts. The owner **signed off the per-stream how-we-win and won't-do
bets**, then delegated the plan's Body-3 design ("you decide what excellent looks like") and asked
to resolve the under-specified areas.

- **Body-3 under-spec resolutions encoded** in the controlling plan §"Body 3 — Approach ›
  Resolved" (owner-accepted): a metadata spine (concrete layout survey-gated, not re-foldered); a
  canonical machine-readable strategic-choice registry as the validator's source of truth (thin
  slice, extends `repo-validators`, built at Body-3 execution); as-touched rubric migration;
  archive-by-default deletion with a reviewer value-capture gate; per-stream granularity made
  decomposition-ready; the governance file's thin-index role post-Body-3.
- **Sign-off staleness flipped** across the plan (frontmatter, Body-2 bullets, owner-framings,
  Owner Decisions 16–17); the strategy corpus was already fresh.
- **Sequencing re-derived:** the plan standard, the fresh survey, and the read-and-extract slice
  are **startable now** (Body 2 signed); the structure-dependent restructure still gates on the
  search/graph external-vs-internal-reuse decision.

**Next safe step (owner-directed open-mind review — the plan's next-steps predate the last few days'
work, 2026-06-20):** (1) **strategy review** — revalidate the corpus and the signed bets, update where
appropriate; (2) **vision review** (tripwire-2, now due); (3) **step back and revalidate the remainder of
the plan** with an open mind — review, revalidate, possibly rewrite, rather than executing the encoded
next-steps as-is. Body-3 prep (plan standard + fresh survey) is startable but is itself subject to this
revalidation. Estate hygiene: the 2 dead VISION-reference re-anchors landed this session;
reachability/openers remain survey-gated. Still owner/Oak: the search/graph reuse decision, the measure
targets, the internal-transformation alignment rationale. **Uncommitted `README.md` and
`docs/strategy/README.md` refinements (unclear provenance — not this session's authorship) to assess in
the vision review.**

## Where We Are (2026-06-20, Kiln guards Patina — diagnosis + granularity settled; corpus refactored; per-stream proposals; pupils decontaminated)

Continued the refinement, owner-directed. The owner settled the two shape-determining decisions,
then directed applying them across the docs plus a session handoff. Key moves and corrections:

- **Diagnosis SETTLED (owner):** *"deliver Oak's rigour at reach and at pace"* — the unified hook
  (rigour = the value; reach = where teachers and the ecosystem now work; pace = agent-first), with
  per-stream edges. Adopt-and-iterate-from-practice (a living strategy). **Hook lifted into `VISION.md`**
  (owner-directed).
- **Granularity SETTLED (owner): per-stream choices** (`APP-`/`TOOLS-`/`FRAME-`; ecosystem may decompose
  to SDK/search/graph/EEF). A plan → one choice → stream → goal; threads serve goals selectively (a graph,
  not a strict tree — independently corroborated by the imported graph suggestions; convergence, not
  authority).
- **Corpus refactored to a README-index + 6 detail files** (diagnosis, alignment-and-streams, three
  `stream-*`, measures); the ID **contract** relocated to controlling-plan **Body 3** (governance owns the
  contract; the strategy lists the choices). The structure FOLLOWS the substance — settling shape before
  refactoring was the owner's correction (I'd planned it backwards).
- **Per-stream how-we-win / won't-do / measures = PROPOSED** (not deferred). Owner correction: "I didn't
  agree to anything being deferred… do valid, thoughtful analysis and make suggestions; sign-off is mine."
  Each stream now carries proposed bets + won't-do + measure candidates; the **owner is actively shaping
  them** in the stream files.
- **Pupil decontamination (owner correction):** pupils were repeatedly elevated to a component (amplifier
  "three levels"; a vision "for pupils" boundary) against the owner's standing "this isn't about pupils" —
  the semantic prior education=students overrode it. Removed: the amplifier is now **two levels** (the
  teacher; our own teams), the vision pupil-boundary is gone. Pupils remain only in Oak's verbatim mission
  and the external compliance gates (K2 / ICO Children's Code / safeguarding). Applied across `VISION.md`,
  the strategy corpus, the controlling plan, and continuity.
- **Owner edits in-flight (their sign-off — respected, not reverted):** K3 surface scope now
  ChatGPT/Claude/Gemini; per-stream won't-do/how-we-win wording refined in the stream files.
- **Gates:** my non-stream edits pass markdownlint + repo-validators; prettier aligned the README. The full
  `pnpm check` and a final format pass run once the owner's in-flight stream-file edits settle (tree in
  flux). Working tree uncommitted; owner controls push.

**Next:** owner finishes shaping / signs off the proposed per-stream choices, won't-do, and measure
candidates; then the **full vision tripwire pass** (tripwire 2, once how-we-win is signed off); then the
**plan standard** + a **fresh deep survey**, then the restructure (Body 3). Flags for the owner's eye:
`stream-mcp-app.md` release-channel hand-off row still reads ChatGPT/Claude (K3 now adds Gemini); "OWA"
acronym in a won't-do bullet (expand on first use per editorial-tone).

## Where We Are (2026-06-20, Fennel tracks Chlorophyll — two-part vision authored + strategy structure scaffolded)

A read-only reflection session that the owner then opened to authoring. The owner ratified a
**two-part vision** and **three streams as the strategy's first organising principle**, and
asked to get the current position into the repo **before introducing new materials**. All
other agents' claims are **stale** (owner-confirmed); this session's claim is the only live one.

- **Vision authored — `VISION.md` is now the full two-part vision** (owner is final editor):
  - **Part 1 — serving Oak's mission:** the MCP app for **teachers** + the engineering tools
    for the **ecosystem** (two of Oak's three goals; schools served by omission). The **web and
    AI assistants are two co-equal, complementary channels** — they don't compete, AI has a
    place in both, and this repo delivers the AI-assistant channel.
  - **Part 2 — agent-first product creation and curation:** across the **full product
    lifecycle**, stated with the **amplifier-not-replacement** ethic — the human expert leads,
    the system amplifies, at three levels (pupil ← teacher ← our own teams). Outward face (open,
    freely available framework; exemplar) + inward face (Oak's own transformation) both present.
  - The **three value streams persist**, grouped into the two parts; vision = two-part narrative,
    strategy = three-stream organising principle (same system, two zooms). Do not collapse to a ranking.
- **Strategy structure authored — `docs/strategy/README.md`** (provisional, PDR-018): three
  streams as first organising principle, portfolio tier, Oak-alignment derivation (stream→goal,
  schools non-goal, four pillars as constraints, align-not-fulfil), streams-as-system map,
  per-stream sections (app carries K1–K3 + a release-readiness hand-offs table), the
  **strategic-choice-ID contract** (stable/additive/resolvable), and a **measures checkpoint**.
- **Settled this session (build on, do not re-open):** curation = full iterative lifecycle;
  **curriculum ownership is external** (repo is a delivery + build mechanism, not the curriculum
  owner); "open educational data beyond Oak's" is **aligned** with Oak's ecosystem goal (read
  first-hand in `reference-local/oak.md`); Python SDK to follow TypeScript.
- **DEFERRED to the owner (with sharp questions in the corpus):** the **diagnosis** (3 candidate
  framings offered); strategic-choice **granularity** (recommend per-stream; gates the choice set);
  per-stream **how-we-win** and **won't-do**; **measures** (Oak analytics/research input);
  search/graph/EEF **external-vs-internal-reuse**; the **internal-transformation alignment rationale**.
- **EEF / point-4 clarified (later in session, owner-prompted):** the EEF integration is the
  **concrete proof of the ecosystem-convenor posture** (owner point 4) — an external organisation's
  openly licensed materials brought together with Oak's — **not aspirational** (this corrects the
  earlier "point 4 is homeless" read). Made explicit and **source-linked** in `VISION.md`,
  `docs/strategy/README.md`, and the root `README.md`.
- **Root README updated (owner-directed, "vital"):** the primary human entrypoint now surfaces the
  **two-part vision + the strategy at a glance** — a Vision-and-strategy pointer near the top, a
  Strategy entry in the non-technical evaluator start-list, and a two-part headline — and spells out
  and links the EEF source. Three co-equal streams still named (Owner Decision 3 preserved).
- **Continuity deep-updated:** controlling plan (Body 1 + Body 2 + Owner Decisions 8–13 +
  Disposition VISION row), **`repo-continuity.md`** (strategy-lane entry rewritten + an agentic-state
  bullet + the Active-Threads row), and this record.
- **Agentic state handled (owner-directed):** claims clean — `active-claims.json` holds only this
  session's live claim; prior-session claims archived; commit queue empty; no stale session crons.
  Stale decision-thread / sidebar / handoff surfaces remain from retired sessions; clearing them is a
  conservation-gated curator-pass (conserve substance first), surveyed and deferred — not blind-deleted.
- **Incoming materials read + reflected (2026-06-20):** the 6 imported docs (governed-document-graph
  ×2, service-authority, context-preservation, repo-intent proposal, gap report) are **suggestions /
  explorations**, not authority. Verdicts: **strong corroboration** of the existing model; **graphs →
  adopt a thin slice** (typed-relationship vocabulary + `product_increment` + a two-edge
  `serves_strategic_choice`/reachability observe-graph = Body-3 enforcement sharpened) and **defer the
  full typed-graph cathedral**; **service-authority → forward design** (Linear + Figma are real
  near-term needs — team forming, designer incoming — define the edge vocabulary when that work lands;
  home = a directive/ADR, not the strategy corpus). Owner was in the originating conversation; that
  does not make the analysis correct — question-and-validate stands.
- **Relocation (owner-directed, 2026-06-20):** new collection
  `.agent/plans/product-development-governance/` — the **agreed active controlling plan** at its top
  (the authority), the 6 imported docs in **`suggestions/`** (subordinate; the 4 overclaiming `active`
  statuses downgraded to `proposed`), a collection `README.md` encoding the authority gradient. The
  **fitness-system-closure findings** doc rehomed to `agentic-engineering-enhancements/current/`
  beside its backbone plan (sibling-in-location-not-subject). All inbound + internal references rewired
  and **verified 0-broken** (274 links checked); the 4 pre-existing broken links flagged sit in dated
  archived records, not this move's regression.
- **Working tree (uncommitted; owner controls commit):** the relocation (7 `git mv`s + new collection
  README) plus `VISION.md`, `docs/strategy/README.md`, root `README.md`, `repo-continuity.md`,
  `plans/README.md`, `high-level-plan.md`, the prompt opener, two archive files, `open-questions.md`,
  both thread records. Gates re-greened (markdownlint + prettier + repo-validators). Claim
  `strategy-and-plan-estate-holistic-review` open (implementer).

## Where We Are (2026-06-20, Kayak seeks Coral — plan-estate approach recorded; strategy inputs captured)

This session: a critical assessment of the thread (first-hand + a 7-agent verify/adversarial workflow),
then — on owner direction — **recorded the plan-estate restructure approach** in the controlling plan
§"Body 3 — Approach (the how)" and **captured owner strategy inputs** in Body 2. Records corrected for
accuracy (owner: all records accurate at all times).

- **Flow reaffirmed (owner):** vision → strategy → planning, each enhanced/created/restructured in turn,
  with upstream updates as needed — minor ones folded in, **major upstream changes surfaced and flagged
  to the owner, never suppressed** (owner correction 2026-06-20; "at most minor" was never owner-said).
  **Strategy first**, then the plan standard + deep survey, then the restructure.
- **Body-3 approach recorded:** two anchors (the strategy's enumerable strategic choices; a ratified
  plan standard / conformance rubric); two new prerequisite deliverables (the **plan standard** and a
  **fresh deep survey** of every plan + plan-adjacent surface); bidirectional traceability; enforcement
  as the structural cure. Structural decisions left **OPEN** (not pre-judged) — controlling plan §Body 3.
- **Strategy inputs captured (owner, 2026-06-20):** cost not critical / must not dominate architectural
  excellence / funding out of scope; teachers already use AI hosts, we bring Oak's rigour (source
  materials + agent guidance; future host-vetting moderation service); the **teacher is the safety
  layer**, nothing aimed at students; how-we-win + won't-do + granularity all **DEFERRED** to near-term
  discussion; measures defined/measured with Oak analytics + research experts. Full text: controlling
  plan §Body 2 "Strategy inputs ratified by the owner (2026-06-20)".
- **Records corrected:** survey figure is 149/355 (not 153/363); editorial-tone path + PR-76 blocker
  already fixed (`564ef6e39`); sequencing updated to strategy-first.
- **Compliance & release constraints recorded (2026-06-20):** the production-blocking compliance set
  (ATRS [gov.uk], detailed DPIA, ICO Children's Code, safeguarding, independent AI-output evals) is
  tracked in the [compliance lane](../../../plans/compliance/roadmap.md) §"Statutory & Release-Blocking
  Compliance"; the gate-ownership map and two release constraints — **vendor-collaboration release
  channel** (not unilateral; vendors aware + agreed) and **marketing blocked on TPC-risk mitigation** —
  are in the controlling plan §Body 2; **ICO ↔ target-audience** is cross-referenced bidirectionally
  (launch-readiness K2 ↔ §B3). All are inputs Body 2 folds in as named hand-offs.
- **Next (owner-driven):** react to / shape the diagnosis; set strategic-choice granularity; then
  how-we-win and won't-do. **Decision locus:** product-level strategy is the **owner's** call (input and
  questions stay valuable); **engineering strategy / architecture decisions are collaborative,
  case-by-case** — proposed and discussed, not forbidden. The session failure was over-claiming from
  partial grounding, cured by the read-gate, not by going passive.
- **Working tree:** controlling plan + this record + repo-continuity (strategy lane) edited (uncommitted;
  owner controls commit/push). Two changes left untouched as not-mine: a pre-existing `repo-continuity.md`
  no-throw-lane edit, and an untracked `fitness-system-closure-and-role-routing.plan.md` (agentic lane).

## Where We Are (2026-06-18, Asteroid calls Meridian — approach reconceived to the informational model)

- **Branch:** `docs/planning-and-validation`. Scope authority is the controlling plan.
- **The strategy-layer discussion the prior session gated (Q-002) HAPPENED (2026-06-18).**
  It reshaped the approach. The controlling plan was reconceived from a three-phase temporal
  DAG to the **four-layer informational-dependence model** above, with **three separate,
  co-equal, first-class bodies of work** (vision / strategy / plan estate). Load-bearing
  corrections the owner made:
  - **Oak has its own strategy; our vision services it** (we align, not fulfil). Oak's strategy
    is the missing top layer — read first-hand from `.agent/reference-local/` (inform-only:
    never quoted/linked/copied; original derivation only). The stream→Oak-goal map:
    teachers←MCP-app; ecosystem(edtech/AI)←engineering-tools **and** the agentic framework;
    **schools←deliberately not served by this repo** (explicit non-goal, revisited only by a
    future explicit decision).
  - **The three streams are a SYSTEM** — framework builds the other two; tools are the foundation
    the app stands on; app proves the foundation. Strategy is **cohesive across AND within**, and
    all three streams are co-equal.
  - **vision→strategy→planning is informational dependence** — coherence and traceability read
    upward; it says nothing about execution order.
  - **The MCP app carries additional alpha→beta→production requirements** (a property of that
    stream, not a ranking); **K1–K3 are its production-readiness keystones**.
- **Phase 1 (Vision) DONE** as the change-statement — `VISION.md`, three co-equal streams,
  mission verbatim (`d4f6e0293`); README names all three.
- **Decisions preserved (not deleted), framing corrected:** K1–K3 (now the app's readiness
  keystones, §14.2 correction), hybrid taxonomy depth, README-names-three. `2a-decisions.md` is
  **archived** (`.agent/plans/archive/`, 2026-06-18; decisions preserved in the controlling plan).
  `value-and-impact.md` is **also archived** (`.agent/plans/archive/`); Body 2 absorbs its
  value-articulation prose from the archived copy. The strategy layer is **three co-equal bodies**
  on the informational model — the within-ecosystem gap analysis (SDK/search/graph/EEF, hybrid
  depth) and the milestone structure are aspects of Body 3, not a separate strategy phase.

## Order — the informational model (SUPERSEDES the 2026-06-17 A→B→C and the prior Phase 1/2/3)

The three bodies are **co-equal in importance**. The arrows are informational, not a schedule:

1. **Vision** (`VISION.md`) — DONE as the change-statement; its alignment to Oak lives in the
   strategy, not the vision.
2. **Strategy** (new home: **`docs/strategy/`**) — UNDERWAY. The cohesive system-strategy:
   diagnosis, Oak-alignment, streams-as-system map, choices + won't-do + measures per stream,
   K1–K3 inside the app section, release-readiness as named hand-offs. Leadership-grade; stands
   on its own merit.
3. **Plan-estate restructure** (`.agent/plans/`) — core, ~80% of the work, **not an addendum**.
   Its *new boundaries* informationally depend on the strategy; its *read + permanent-doc
   extraction + archive-complete* slice does **not** and can proceed in parallel.

**The only gate is informational:** the restructure's new boundaries need the settled strategy.
Reading/extraction/hygiene are independent and runnable now.

## Framing decisions ratified with the owner this session (load-bearing)

1. **The repository is a *means* to Oak's *ends*.** The vision enables Oak's
   mission; it does not restate or own it. Oak's mission is quoted **verbatim**
   (do not paraphrase it — "supporting teachers to teach, and enabling pupils to
   access" is precise teacher-agency language; an earlier paraphrase
   "helping teachers teach" was wrong and was corrected).
2. **Three co-equal value streams — none secondary** (settled 2026-06-17; the
   vision names all three): (a) an MCP app that puts Oak inside the AI assistants
   teachers already use; (b) engineering tools (SDK, semantic search, curriculum
   graph, MCP, evidence surfaces) for the wider ecosystem to build with Oak's
   curriculum data; (c) the agentic-engineering framework that delivers AI-enhanced
   innovation (the Practice as a value stream in its own right, per owner §14.1).
   One body of infrastructure, three co-equal delivery fronts. **Refined 2026-06-18:
   the streams are a SYSTEM, not orthogonal — framework builds the other two; tools
   are the foundation the app stands on; app proves the foundation. Each services an
   Oak strategic goal (teachers / ecosystem×2); schools is a deliberate non-goal.**
3. **A vision states the change + why + a map to the how.** It delegates
   explanations and commitments (deliverables inventory, measurement, integrations,
   positioning, licensing) to other documents and *points* to them — it does not
   contain them. (The earlier "meandering explanations and commitments" draft was
   the failure to make it a vision.)
4. **Audience = Oak** (leadership deciding to back this as a product, and the
   delivery team); external developers / sector / ecosystem are beneficiaries
   described within, not co-addressees.
5. **Editorial voice** applies to the vision, the strategy, and the public-facing
   parts of the README — **never to plans or developer-facing docs** (it interferes
   with transmission of understanding to builders). The teacher-protagonist
   "you" mechanic is for teacher-facing copy; strategic/internal docs use the
   voice *qualities* in Oak's "we" voice.

## Artefacts landed 2026-06-17 (vision session — Ocelot / Tempest / Squall)

- **`VISION.md`** — rewritten + moved to root + content-fixed.
- **`.agent/directives/editorial-tone.md`** — NEW directive, derived from the
  `oak-tone-of-voice` skill in the sibling `oak-skills` repo: the three
  principles, British terminology, anti-patterns, self-edit checklist, the
  **application boundary** (apply to vision/strategy/public-README; not to
  plans/dev), and an **audience palette** organised on the **build-vs-decide axis**
  (builders want capability/contracts; leaders want value/impact/cost) — owner
  confirmed "builders and leaders" over splitting edtech/AI. Wired into `AGENT.md`.
- **VISION reference sweep** — all LIVE references repointed to root `VISION.md`
  (README, docs/README, docs/foundation/README, AGENT.md, onboard-me skill,
  curriculum-guide, ADR-008/119/194, two reports, the sector-engagement thread,
  and — per owner direction lifting the gate for hygiene — the live sector /
  developer-experience / discovery / architecture plans). **31 historical records**
  (archives, raw survey data, dated evidence, napkins, `.cursor/plans`) left
  untouched per archive discipline.
- **AGENT.md** — `[vision]` path fixed; editorial-tone trigger added; the
  `## Oak Open Curriculum Cardinal Rule` heading typo (missing space) fixed.
- **README** — public narrative aligned to the vision and given the editorial
  voice in earlier passes (developer sections left plain).

## Artefacts landed 2026-06-18 (approach reconception + residue purge — Asteroid)

- **Controlling plan reconceived** to the four-layer informational model with three co-equal
  first-class bodies; strategy homed at `docs/strategy/`; K1–K3 positioned as the app's readiness
  keystones; schools non-goal stated; a Disposition of Superseded Prior Work register; Body 2 made
  executable (editorial-voice + measures-are-an-Oak-input guards, enforceable in acceptance/proof/risk).
- **`2a-decisions.md` AND `value-and-impact.md` archived** to `.agent/plans/archive/`, each with a
  supersession mapping (Body 2 absorbs their useful content from the archive); references repointed.
- **Survey report archived** (`2026-06-15` dated record → `.agent/reports/archive/`, owner-directed
  2026-06-18) with a supersession mapping: the empirical map and reusable method are preserved as a
  dated input; a **fresh estate survey is a Body-3 prerequisite** before relying on counts.
  `high-level-plan.md` "primitives" goal superseding-callout.
- **Consumer-walk residue purge** (the rejected framing did not survive at any entry point):
  `repo-continuity.md` (strategy bullet + K1–K3 paragraph + thread-table row + a stale duplicate
  "Step A (align on impact)" bullet), `docs/README.md` (evaluator entry — old "modular building
  blocks" framing), `plans/README.md` (stale "Phase 3"), the readiness-report link.
- **`open-questions.md` Q-002 RESOLVED** with the outcome.
- **napkin** — captured the method lesson: a reframing is delivered by a consumer walk of every
  entry point, not by phrase-sweeps.

## Pending doc refinements (adversarial loss-scan, 2026-06-17 — not yet applied)

Surfaced by the context loss-scan; left unapplied (owner-taste or deferred),
captured so they survive a fresh context:

- **README headline** — DONE (2026-06-17): owner ratified "name all three streams";
  the headline (`:8`) and strapline (`:6`) now name all three in the editorial voice.
- The 7-agent delta-workflow output is ephemeral (`/tmp`); its headlines are in
  §Delta above and the raw is re-derivable from git state.

## K1–K3 AUTHORITY ISSUE — RESOLVED (owner-ratified 2026-06-17)

The decided-vs-input contradiction is closed. The owner ratified K1–K3 on
**2026-06-17** as the **MCP-app stream's** keystones, with the §14.2 correction to K1
(value-proof articulated here and measured by Oak, not instrumented in-repo) and K3
scoped to the app's real dependency set (whole-estate only at portfolio level). The
five "decided" surfaces (`launch-readiness-framework.md`, `high-level-plan.md`,
`roadmap.md`, the milestone-redefinition stub, the readiness assessment report) plus
`repo-continuity.md` are reconciled to the ratified wording; the dated survey report
§12/§14 is left as a dated input (Non-Goal: not edited). Authoritative wording **now
lives in the controlling plan** (§Owner Decisions); the
[2a-decisions brief](../../../plans/archive/vision-strategy-and-plan-estate.2a-decisions.md) (archived) is a
**superseded input** (decisions preserved, framing corrected 2026-06-18). K1–K3 remain the
MCP-app stream's production-readiness keystones.

## Delta since the 2026-06-15 survey (re-grounded first-hand 2026-06-17; empirical figures dated)

- The estate churned ~82 commits on `docs/planning-and-validation`, **dominated by
  the Practice/substrate value stream** (PDR-096–101, decision-debt machinery,
  fitness made report-only, owner-gated-vocabulary purge, `distilled.md` drained).
  This is the deliberate inward value stream (owner §14), not a defect.
- Strategy surfaces received **scaffolding-wiring only** (date bumps, framework +
  stub pointers); **no substantive forward movement.** Survey hygiene findings are
  **UNCHANGED** (re-verified 2026-06-20): the real archived-survey figure is
  **149/355 (42%) unlinked** — the earlier "153/363" was a mis-transmission (153 is the
  survey's future-doc count). 59 stale executables, 14 session-openers, missing lane
  READMEs, the reachability-CI-validator plan still `decision-incomplete`. The estate has
  since grown ~33% to ~550 non-archive docs, so counts are measured again by the fresh deep
  survey, not trusted from the dated figures.
- Product/user-value gaps **unchanged**: widget **search UI not started**
  (brand-banner-only); **no production-Clerk execution plan**; Cloudflare gate
  unpromoted; the WS3-Phase-5 plan's dead PR-76 blocker is now **cleared** (`564ef6e39`,
  2026-06-17). (The value/impact articulation was since authored 2026-06-17 and is now a
  **superseded input** pending Body 2 — see Where We Are; the rest remain unverified-since-survey.)
- Survey-framing correction: the README front door reads **"Invite-Only Alpha"**
  (not "private alpha"), one milestone behind the M2 tracker. (A survey
  "missing-README" collection finding was a labelling artefact; its disposition is
  an open owner decision — detail in the survey report §4.)

## RELEASE-READINESS / DUE-DILIGENCE REQUIREMENTS (abstracted; fold into the estate)

From an owner-provided private source (abstracted — **no PII, no named people or
institutes**; not exhaustive, use judgement). These are go-live gates for the
**MCP-app value stream**, several owned **outside this repository** — the estate
structuring must include plans/owners for them:

- **Algorithmic transparency / compliance** — a public-body algorithmic
  transparency reporting obligation must be completed before release.
- **Privacy policy & Terms/Conditions** — decided and published (reuse an existing
  Oak product's, or author new).
- **AI output quality & safety evals** — independent stress-testing of the MCP's
  AI outputs against Oak's quality and safety benchmarks before release.
- **Data-availability gate** — the curriculum data the API needs must actually be
  served (close the data gap, e.g. a missing materialised view at lesson level); a
  hard go-live prerequisite.
- **UX** — the teacher interaction experience within the host product considered;
  for a text/tool MCP the UX is largely the host interface, UI is optional and can
  be disruptive, minimal branding + link-back is the current baseline; the
  design-system work may apply.
- **Go-to-market / distribution / school support** — launch enablement and
  discoverability (teachers will not auto-discover or self-install), and messaging
  / positioning alongside Oak's other AI offerings.

**(2026-06-20) Ownership verified first-hand & tracked:** privacy and host-UX are owned
in-repo (`app-submission-standards` WS2; `mcp-app-extension-migration` WS3/WS4). **ATRS,
detailed DPIA, ICO Children's Code, safeguarding, and independent AI-output evals** are
external/tracked **production-release blockers**, now recorded in the
[compliance lane](../../../plans/compliance/roadmap.md) §"Statutory & Release-Blocking
Compliance" and
[launch-readiness §B1/§B3](../../../plans/curriculum-mcp-path-to-ga/launch-readiness-framework.md);
the lesson-level data MV and MCP-app GTM remain discussions. The **ICO Children's Code ↔
target-audience** question ("nothing aimed at students") is cross-linked bidirectionally
(launch-readiness K2 ↔ §B3) and is an open compliance discussion. Full gate map: controlling
plan §Body 2. **Release constraints (owner, 2026-06-20):** the release channel is **not
unilateral** — the MCP server can be served by us, but app-like packaging + promotion in
ChatGPT/Claude **require vendor collaboration** (vendors aware + **agreed** to support
packaging and audience reach); and **marketing is blocked until the TPC risk** (lesson-level
content / the data-availability area) **is sufficiently mitigated**. Both recorded in the
controlling plan §Body 2 and launch-readiness K3.

## Next (fresh context starts here)

> **Superseded by the 2026-06-20 Juniper stirs Taproot section at the top.** The strategy
> refinement below is largely complete: corpus refactored, diagnosis and granularity settled,
> per-stream bets signed off, editorial pass done, and the Body-3 under-spec resolutions encoded.
> The live next-safe-step is the **vision tripwire-2 pass**, then **Body-3 prep** (plan standard +
> fresh survey). The grounding order below remains valid.

**▶ Body 2 STRUCTURE is authored; the next session refines it.** Opener:
[`strategy-and-vision-refinement.prompt.md`](../../../prompts/strategy-and-plan-estate/strategy-and-vision-refinement.prompt.md)
(the prior `define-strategy-content.prompt.md` is superseded; the structure it asked for now exists).
Scope-locked next moves (owner-directed 2026-06-20):

1. **Refactor the strategy corpus to README-index + detail files** (owner convention: README = stable
   index/summary, detail in separate files); move the strategic-choice-ID *mechanics* to the
   governance layer (strategy lists the choices, governance owns the contract).
2. **Settle the DEFERRED decisions with the owner — diagnosis and granularity first** (they gate the
   choice set, the IDs, and Body 3), then per-stream how-we-win / won't-do / measures; balance the
   app-heavy corpus across the three streams (the framework stream needs its internal-transformation content).
3. **Editorial-voice pass** on the leadership-facing prose.
4. **Vision re-review per the controlling plan's §Vision review tripwires** — any MAJOR upstream need is
   flagged to the owner, never suppressed ("at most minor" was never an owner constraint).

Detail lives in the controlling plan (Body 1 §"Vision review tripwires" + candidate major updates;
Body 2 §"Remaining at the strategy level").

**Read the controlling plan first** —
[`vision-strategy-and-plan-estate.plan.md`](../../../plans/product-development-governance/vision-strategy-and-plan-estate.plan.md),
reconceived 2026-06-18 to the four-layer informational model and three first-class bodies.
It is the scope authority; this record is the pickup surface.

The Q-002 strategy-layer discussion is **resolved** (the model + bodies above) and Q-002 in
`open-questions.md` is marked resolved with that outcome. In order:

1. **Author the strategy corpus (Body 2) at `docs/strategy/`** — the cohesive system-strategy:
   diagnosis of the experiment→product challenge; the Oak-strategy alignment as an *original
   derivation* (stream→goal map; schools deliberate non-goal; four pillars as constraints;
   align-not-fulfil) — read Oak's strategy first-hand from `.agent/reference-local/`
   (**inform-only: never quote/link/copy**); the streams-as-system map; per-stream choices +
   won't-do + measures; K1–K3 inside the app section as its readiness keystones; the
   release-readiness requirements (below) as named hand-offs. Absorb `value-and-impact.md` and the
   2a rationale — both from `.agent/plans/archive/` — as inputs. Leadership-grade.
2. **After the strategy — the plan standard (Anchor B) + a fresh deep survey, then the read+extract pass.**
   Owner sequencing (2026-06-20, vision→strategy→planning, each level in turn): although the read+extract
   slice is informationally independent, both prerequisites' traceability elements depend on the strategy's
   strategic-choice shape, so they follow Body 2. Then read every plan, extract its permanent documentation
   to its durable home, archive genuinely-complete; do **not** assert new boundaries (those need Body 2).
3. **Estate hygiene:** the dead VISION `§What We Deliver` references remain open in 3 live files.
   The editorial-tone vision path and the PR-76 blocker are **already fixed** (`564ef6e39`, 2026-06-17).
   Remediate reachability/openers/stale-executables after the fresh deep survey measures the counts again.
4. **Then Body 3 (estate restructure) proper** — once the strategy structure exists: new
   boundaries, rehoming, rewrite-to-standard, scattered-concepts→new-plans, deletions with
   disposition. Authored as its own executable plan. The within-ecosystem gap analysis (the old
   "2B") is part of **Body 3**, run at the **hybrid** depth (SDK/search/graph/EEF). The old
   2A/2B/2C phases are dissolved — see the controlling plan's Disposition section. The
   **approach (the how)** — the plan standard, the deep survey, the bidirectional traceability spine,
   enforcement-as-structural-cure, and the Body-3 design (the five prior open discussions, now
   **resolved** 2026-06-20) — is recorded in the controlling plan §"Body 3 — Approach".

The estate restructure (Body 3) is **core and ~80% of the work, not an addendum**; only its
new-boundary work is informationally gated on the strategy. Full scope: the plan.

## Method carried forward

- Long analytical sessions **narrow and over-claim** — this session took ~6 owner
  re-framings (experiment→product, question-the-order, co-equality-not-tension,
  vision-is-not-a-kitchen-sink, mission-verbatim-not-paraphrased). Self-ask on a
  cadence: *still at the right altitude? has the newest input reframed it? am I
  over-claiming? is this "tension/conflation" an owner judgement or my unverified
  frame?*
- **An agent-sourced claim of product "tension/conflation" is a product judgement
  the owner owns** — default to co-equal-by-design until the owner names a real
  tension. (The §13 conflation claim was the trap.)
- **Authoritative/mission language is quoted exactly, never smoothed for prose.**
- Treat all agent-produced inputs (sub-agent reviewers, survey waves, K1–K3) as
  **input-to-verify**; validate load-bearing claims first-hand.
- **Scope from the goal, not from the pointer (2026-06-18).** This session's recurring failure:
  examining exactly what the owner pointed at — the plan, then 2a, then the survey, then this
  record — and declaring done, instead of stepping back to ask *given the goal, what is the
  complete set of surfaces that relevantly sit in this context?* and verifying all of them. The
  owner had to point at each surface in turn. Cure (generative metacognition): before declaring
  any verification done, derive the full relevant surface set from the goal and walk it — the
  consumer-walk discipline applied to **verification**, not only to framing residue.

## Participating agent identities

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| Baobab lifts Topsoil | claude-code | claude-opus-4-8 | 3be248 | surveyor-synthesist | 2026-06-15 | 2026-06-15 |
| Ocelot binds Curfew | claude-code | claude-opus-4-8[1m] | c9423b | vision-author + estate-rewiring | 2026-06-17 | 2026-06-17 |
| Tempest spins Spire | claude-code | claude-opus-4-8[1m] | 94a5c5 | controlling-plan author + review-synthesis + hygiene | 2026-06-17 | 2026-06-17 |
| Squall spins Stratus | claude-code | claude-opus-4-8[1m] | 8b8770 | Phase-2A ratification gate + decision recording + K1–K3 reconciliation | 2026-06-17 | 2026-06-17 |
| Asteroid calls Meridian | claude-code | claude-opus-4-8[1m] | 2297c9 | Q-002 strategy-layer discussion + approach reconception to the informational model | 2026-06-18 | 2026-06-18 |
| Kayak seeks Coral | claude-code | claude-opus-4-8[1m] | 551a7f | critical assessment + plan-estate approach recording + strategy-input capture + records-accuracy + handoff | 2026-06-20 | 2026-06-20 |
| Fennel tracks Chlorophyll | claude-code | claude-opus-4-8[1m] | 6dd550 | strategy reflection + two-part vision authoring + strategy-structure scaffolding + continuity deep-update | 2026-06-20 | 2026-06-20 |
| Kiln guards Patina | claude-code | claude-opus-4-8[1m] | 0c90b2 | diagnosis + granularity settling + README-index refactor + per-stream proposals + pupil-decontamination + handoff | 2026-06-20 | 2026-06-20 |
| Juniper stirs Taproot | claude-code | claude-opus-4-8[1m] | 8afc21 | handoff pickup from Kiln; encoded owner-accepted Body-3 under-spec resolutions and the sign-off staleness flip into the controlling plan | 2026-06-20 | 2026-06-20 |
| Plover wakes Sundog | claude-code | claude-opus-4-8[1m] | f91f5e | open-mind strategy/vision/plan-estate review; vision tripwire-2 pass; resolved search/graph (false dichotomy) + internal-alignment, encoded across the corpus and controlling plan | 2026-06-20 | 2026-06-20 |
| Cutter holds Reef | claude-code | claude-opus-4-8[1m] | cef45f | authored `plan` node-schema V0 (node-schema #1, the survey lens); reconciled PDR-018 + ADR-117 + templates + emergent reality; replaced the `paused` state with an expiring gate (owner-ratified) | 2026-06-21 | 2026-06-21 |
| Drake hunts Beeswax | claude-code | claude-opus-4-8[1m] | 89a5e2 | implementer pickup of Cutter's boundary; settled + encoded the four owner-gated V0 governance calls (enum baselines, folder collapse, 30-day gate-expiry); survey HOLD-then-lift; continuity refresh (repo-continuity + this record) | 2026-06-21 | 2026-06-21 |
