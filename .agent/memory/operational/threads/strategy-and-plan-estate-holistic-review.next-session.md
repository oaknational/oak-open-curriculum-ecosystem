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
  with at most minor upward adjustments from lower-level insights. **Strategy first**, then the plan
  standard + deep survey, then the restructure.
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

**▶ Body 2 STRUCTURE is now authored** (`docs/strategy/README.md`, provisional); the next
moves are: (a) **read the owner's incoming materials**, then (b) **settle the DEFERRED
decisions with the owner — diagnosis and granularity first** (they gate the choice set), then
how-we-win / won't-do / measures, and (c) **fill the per-stream substance** and refine the
two-part vision (owner is final editor). The opener
[`define-strategy-content.prompt.md`](../../../prompts/strategy-and-plan-estate/define-strategy-content.prompt.md)
still carries the scoped brief and ground sources; the structure it asked for now exists.

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
   enforcement-as-structural-cure, and the five open discussions — is recorded in the controlling plan
   §"Body 3 — Approach (the how)" (2026-06-20 plan discussion).

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
