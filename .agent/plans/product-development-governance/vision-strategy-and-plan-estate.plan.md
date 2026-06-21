---
plan_id: vision-strategy-and-plan-estate
title: "Vision, Strategy, and Plan-Estate — Thread Governance"
type: governance-execution
status: active
lifecycle: active
thread: strategy-and-plan-estate-holistic-review
last_updated: 2026-06-20
related:
  - VISION.md
  - .agent/plans/high-level-plan.md
  - .agent/plans/curriculum-mcp-path-to-ga/roadmap.md
  - .agent/plans/curriculum-mcp-path-to-ga/launch-readiness-framework.md
  - .agent/reports/archive/plan-estate-survey-2026-06-15/README.md
todos:
  - id: vision-foundation
    content: "Vision body — VISION.md is the full two-part vision (authored 2026-06-20): Part 1 serves Oak's mission (the app for teachers + the tools for the ecosystem, two of Oak's three goals); Part 2 is the agent-first product-creation-and-curation transformation, stated with the amplifier-not-replacement ethic. Mission verbatim; the three value streams are present, grouped into the two parts; VISION.md links the strategy corpus. Alignment TO Oak lives in the strategy, not restated in the vision. Owner is the final editor of the vision."
    status: completed
  - id: strategy-decisions-preserved
    content: "Strategy body — decisions preserved from the 2026-06-17 ratification: K1–K3 (the MCP-app stream's production-readiness keystones, §14.2 correction), value-stream taxonomy depth = hybrid, README names all three streams. value-and-impact.md is archived as an input the strategy corpus (Body 2) absorbs."
    status: completed
  - id: strategy-corpus
    content: "Strategy body (REFACTORED to README-index + detail files 2026-06-20; diagnosis and granularity SETTLED; per-stream how-we-win and won't-do SIGNED OFF 2026-06-20) — docs/strategy/ is now a stable README-index over detail files (diagnosis, alignment-and-streams, three stream-*, measures). Diagnosis SETTLED (owner): 'deliver Oak's rigour at reach and at pace' (unified hook + per-stream edges). Granularity SETTLED (owner): per-stream choices (APP-*/TOOLS-*/FRAME-*, ecosystem may decompose to SDK/search/graph/EEF). The strategic-choice-ID contract relocated to Body 3 (governance owns the contract; strategy lists the choices). Per-stream how-we-win and won't-do SIGNED OFF (owner, 2026-06-20). Still open: measures (Oak grounds the targets). Search/graph (a false dichotomy), the internal-transformation alignment rationale, and the vision tripwire-2 pass were resolved 2026-06-20. A living strategy (PDR-018): adopt-and-iterate-from-practice."
    status: in_progress
  - id: estate-restructure
    content: "Plan-estate body (core, large — informationally depends on the strategy's structure) — read every plan, extract permanent documentation, archive complete plans, extract-and-archive completed work from partial plans, rewrite survivors to a common standard, pull scattered concepts into new plans, delete with disposition. New thread/plan boundaries derived FROM the strategy. Value-preserving via recorded dispositions (supersession mappings per the consolidation discipline, never a standalone ledger)."
    status: blocked
  - id: estate-restructure-prep
    content: "Plan-estate body, prerequisite deliverables — the **plan standard** (= the `plan` node-schema #1, delivered by the repo-intent-graph plan Stage 1 — the smallest slice that unlocks the survey and restructure) and a **fresh deep survey** of every plan and plan-adjacent surface (conformance + traceability inventory). Owner sequencing (2026-06-20, vision→strategy→planning flow): the strategy (Body 2) is authored FIRST; although the read+extract slice is informationally independent, both prerequisites' traceability elements depend on the strategy's strategic-choice shape, so they follow Body 2 — now signed off (2026-06-20), so these are startable. Then read every plan, extract permanent documentation, archive genuinely-complete. See §'Body 3 — Approach (the how)'."
    status: pending
  - id: estate-hygiene
    content: "Estate hygiene (independent — no informational dependence on vision/strategy) — re-anchor dead VISION references; fix the editorial-tone vision path; clear the dead PR-76 blocker; remediate reachability/openers/stale-executables after re-verifying current counts."
    status: pending
---

# Vision, Strategy, and Plan-Estate — Thread Governance

The plan-of-record for the `strategy-and-plan-estate-holistic-review` thread:
moving this repository **from an important experiment to an important product**.
It owns the model, sequencing, acceptance, and traceability for three **separate,
co-equal, first-class bodies of work** — the vision, the strategy, and the plan
estate. It contains none of their content: the vision lives in `VISION.md`, the
strategy in `docs/strategy/`, the plan estate in `.agent/plans/`. This file points
to those homes and governs how they derive from one another.

The thread's continuity record is the pickup surface that points here; it is not an
authority for scope. This file is.

## The Informational-Dependence Model (replaces the temporal DAG)

```text
Oak's strategy  →  Our vision  →  Our strategy  →  Our planning
(we ALIGN,         (the change:    (cohesive            (the estate,
 not fulfil)        3 streams       across AND within     reorganised
                    servicing       the streams-as-       around the
                    Oak)            a-system)             strategy)
```

Each arrow is **informational dependence, not execution order**: the downstream
layer cannot be authored *correctly* without the information in the layer above —
you cannot plan without knowing the strategy, cannot strategise without a clear
vision, cannot set the vision without knowing Oak's strategy. It says nothing about
when work happens or which body matters more.

**The discipline the arrows impose is coherence and traceability, not a freeze.**
Every plan must be justifiable by a strategic choice; every strategic choice by a
vision element; every vision element by alignment to Oak's strategy. Correctness is
checked by reading **upward**, continuously. Work authored ahead of its upstream is
marked provisional and re-derived when the upstream changes.

### Hold the axes apart

This thread's recurring error has been collapsing independent axes into a single
"priority" scalar. They are distinct and must stay distinct:

- **Importance** — all three bodies of work are equally important; all three value
  streams are of equal importance.
- **Work-volume** — the estate restructure is likely ~80% of the thread's work.
  That is volume, not importance, and not "later".
- **Dependency-direction** — the strategy informs the restructure's structure. Being
  prerequisite does not make the foundation lesser; being downstream does not make
  the restructure a mere consequence.
- **Informational-need vs timing** — the restructure's *new boundaries* need the
  strategy; reading plans and extracting their permanent documentation does not.

Any statement that ranks, orders, or sequences is a trigger to ask **which axis is
actually being asserted** before acting on it.

## Oak's strategy — the top informational anchor (align, not fulfil)

Our vision exists to **service Oak's strategy**. We are **not** responsible for
fulfilling Oak's strategy; our work must **align with and support** it. Oak's
strategy is read first-hand from the owner-provided local reference
(`.agent/reference-local/`, inform-only — never quoted, linked, or copied into the
repo). Our repo expresses an **original derivation** of how we relate to it, never a
restatement.

The stream → Oak-goal alignment (authored in full in the strategy corpus):

- **Teachers** (Oak goal) ← the **MCP-app** stream.
- **Ecosystem — edtech, AI, others** (Oak goal) ← the **engineering-tools** stream
  **and** the **agentic-engineering framework** stream (an openly-documented
  framework those engineers adopt, *and* the engine that builds the other two).
- **Schools** (Oak goal) ← **deliberately not served by this repo**. This is an
  explicit, owner-confirmed strategic non-goal (2026-06-18), revisited later only as
  another explicit decision, never by drift.

Oak's four pillars are **constraints** our strategy honours, articulated in the
corpus (not restated here).

## The three value streams are a system, not three tracks

The streams are **not orthogonal** — they reinforce each other:

- The **agentic-engineering framework** is the delivery engine: it builds the other
  two faster and more safely, and is itself a value stream others adopt.
- The **engineering tools** (SDK, semantic search, curriculum graph, evidence
  surfaces) are the foundation the **MCP app** stands on.
- The **MCP app** proves the foundation and reaches teachers.

The strategy must be **cohesive across and within** the streams — the cross-stream
cohesion carried at the portfolio tier, each stream's section explicitly
interdependent. A strategy that treats the streams as independent misses the point.

## Body 1 — Vision (full two-part vision authored 2026-06-20)

`VISION.md` (root) is the full vision, in two parts that hold each other up:

1. **Serving Oak's mission** — Oak's curriculum made AI-native for two of Oak's
   three goals: the MCP app for **teachers**, and the engineering tools for the
   **ecosystem**. (Schools is Oak's work elsewhere — served by omission, not a
   stated non-goal.) The web and AI assistants are framed as **two co-equal,
   complementary channels** (AI has a place in both); this repo delivers the
   AI-assistant channel.
2. **The agent-first transformation** — how Oak builds and curates digital products
   across the whole lifecycle, agent-first, stated with the **amplifier-not-
   replacement** ethic: the human expert leads, the system amplifies, at two levels
   (the teacher, with our product; our own teams, with agents). Its outward face (open, freely available
   framework; exemplar) and inward face (Oak's own transformation) are both present.

The **three value streams persist**, grouped into the two parts; the vision is the
two-part narrative, and the **strategy's first organising principle is the three
streams** (the same picture at two zooms). The vision states the change + why + a map
to the how; it does **not** restate Oak's strategy or contain the alignment — that's
the strategy's job — and it now links the strategy corpus.

**Acceptance (met):** `VISION.md` is the two-part vision; all three streams present;
mission verbatim; amplifier ethic stated; two-channel framing present; `VISION.md`
links the strategy corpus. Owner remains the final editor of the vision.

### Vision review tripwires

The vision is authored ahead of the settled strategy (PDR-018), so it is re-reviewed at
defined points — not once. A lower layer may surface a **major** upstream need, and when
it does it is **flagged to the owner, never suppressed** ("at most minor" was never an
owner constraint — owner correction 2026-06-20). Re-review the vision when any of these
fires:

1. **Diagnosis + granularity settle** — the strategy's central framing may reshape a
   vision element.
2. **Body 2 (strategy) is fully authored** — the alignment derivation may surface an
   upward gap.
3. **Body 3 (estate restructure) lands** — a reorganised estate may reveal a vision gap
   or an over-claim.
4. **The team forms / Linear, Figma, and a designer arrive** — the solo→team shift and
   the service/operating model may change how the transformation is framed.
5. **The ICO Children's Code ruling / target-audience decision lands** — a compliance gate
   (de-facto child access), tracked in the app stream's release-readiness hand-offs and the
   compliance lane; re-check the **K2 audience boundary** against the ruling. The vision no
   longer carries a pupil-facing boundary — pupils are not a component of this work.
6. **The imported "repo as durable intent substrate" thesis is accepted or rejected** —
   if accepted, the vision may need to name it.
7. **Standing tripwire** — any session, on any thread, that surfaces a major vision-level
   need flags it to the owner immediately; it is never folded silently or deferred into
   invisibility.

**Vision updates this session (2026-06-20, Kiln guards Patina — owner-directed):** the
*rigour at reach and at pace* hook was lifted into the vision; and the **pupil contamination
was removed** — pupils had been repeatedly elevated to a component (the amplifier "three
levels", a "for pupils" boundary) against the owner's standing "this isn't about pupils", so
the amplifier is now **two levels** (the teacher; our own teams) and the pupil-facing boundary
is gone. Pupils remain only in Oak's verbatim mission and the external compliance gates (K2,
ICO Children's Code, safeguarding). **Candidates still open (owner decides):** whether the
vision should name the **repo-as-intent-substrate / operating-model** thesis; and whether the
**organisational transformation** (educating Oak, the team-learns-then-disperses rollout,
internal reuse) belongs more explicitly in the vision or stays strategy-level.

## Body 2 — Strategy (STRUCTURE AUTHORED; home: `docs/strategy/README.md`)

**Structure landed 2026-06-20 (Fennel tracks Chlorophyll):** `docs/strategy/README.md`
now carries the proper structure with the **three value streams as its first
organising principle** (owner-set), under a portfolio tier. Settled inputs are
authored (Oak-alignment derivation; streams-as-system map; K1–K3 inside the app
section; the release-readiness hand-offs table; the strategic-choice-ID contract;
the measures checkpoint shape). At that point the owner-owned substance was still open with
sharp questions (diagnosis, per-stream how-we-win, won't-do, granularity, measures); the
progress below and the Owner Decisions record how each has since settled or signed off — only
the measure *targets* remain an Oak input. The corpus is a **living strategy** (PDR-018),
refined on owner input and read against incoming materials.

**Strategy-level progress (2026-06-20 — owner-directed, this session "Kiln guards Patina"):**

- **README-as-index refactor — DONE.** `docs/strategy/README.md` is now a stable index +
  leadership-editorial summary over detail files (`diagnosis.md`, `alignment-and-streams.md`,
  three `stream-*.md`, `measures.md`), split on natural seams per the over-structuring guard
  (flat files, no `streams/` subdirectory — a subdir would make the corpus *look* balanced
  while content stayed app-heavy).
- **Diagnosis — SETTLED (owner):** *"deliver Oak's rigour at reach and at pace"* — the
  unified hook (rigour = the value; reach = where teachers and the ecosystem now work; pace =
  agent-first), with per-stream edges (`diagnosis.md`). It is the spine the corpus hangs
  from. Owner steer: adopt it, apply it, learn in practice, iterate when practice teaches —
  a living strategy, not an artefact to perfect in the abstract.
- **Strategic-choice granularity — SETTLED (owner): per-stream choices**
  (`APP-*`/`TOOLS-*`/`FRAME-*`; the ecosystem may decompose to SDK/search/graph/EEF). A plan
  resolves to one choice → its stream → an Oak goal; threads serve goals selectively, so the
  map is a graph, not a strict tree (a framing the imported graph suggestions independently
  corroborate — convergence raises confidence; their proposals remain information, not goals).
- **Separate strategy from mechanics — DONE.** The strategic-choice-ID *contract*
  (stable/additive/resolvable, the `serves_strategic_choice` field, the validator) is
  relocated to **§"Body 3 — Approach"** (below); the strategy lists the choices, governance
  owns the contract. Routed to *this* controlling plan (the authority), **not** the
  `status: future` `suggestions/governed-repo-document-graph.plan.md` input.
- **Per-stream how-we-win and won't-do — SIGNED OFF (owner, 2026-06-20).** Each stream's
  grounded bets (`APP-1–4`, `TOOLS-1–4`, `FRAME-1–4`) and won't-do lists are owner-signed-off;
  the README registry and Open Decisions table record the sign-off. (Authored as
  analysis-and-suggestion per the owner's standing correction — don't defer, propose — with the
  sign-off the owner's to give, now given.)
- **Balance the streams — done.** The framework stream carries its inward-transformation
  body (the Practice meta-learning loop; internal reuse; the rollout flagged as the owner's)
  plus four proposed bets — peer weight with the app, not a thin placeholder.
- **Measures — proposed candidates (Oak grounds the targets).** Each stream's candidate
  signal is proposed; the actual target is Oak's analytics/research to ground.
- **Vision hook lifted (owner-directed).** *"Deliver Oak's rigour at reach and at pace"* is
  now stated in `VISION.md`.
- **Pupil decontamination (owner correction 2026-06-20).** Pupils had been repeatedly
  elevated as a component (the amplifier "three levels"; a "for pupils" vision boundary)
  against the owner's standing "this isn't about pupils"; removed — the amplifier is now two
  levels, the vision pupil-boundary is gone, and pupils remain only in Oak's verbatim mission
  and the external compliance gates (K2, ICO Children's Code, safeguarding). Applied across
  `VISION.md`, the strategy corpus, and this plan.
- **Editorial-voice pass — done on the index summary** (unmistakably leadership-editorial,
  per acceptance); the proposed per-stream prose carries the voice too.
- **Assistant-list principle vs K3 — preserved and explicit** in `stream-mcp-app.md`: no
  favourites (ChatGPT, Claude, Gemini and others; the teacher's choice) is kept distinct from
  K3's ratified *initial release surface* (ChatGPT, Claude, and Gemini — owner-updated
  2026-06-20).

**Still genuinely open (owner decides / Oak grounds):** the measure *targets* (Oak
analytics/research). The search/graph question (a false dichotomy), the
internal-transformation-alignment rationale, and the vision tripwire-2 pass were all resolved
2026-06-20 (Owner Decisions 20–21; tripwire-2 found no major upstream vision change).

A cohesive, leadership-grade **system-strategy** that stands on its own merit (an
asset Oak leadership could read to understand and back this work) **and** is the
foundation the estate restructure derives its structure from. Conception settled
2026-06-18: **choices + measures** — diagnosis, guiding choices (where to play / how
to win / what we will not do), and measurable outcomes. Structure: **portfolio tier +
per-stream sections**, cohesive across and within. The **`editorial-tone.md` directive
applies** (vision / strategy / public-README are in its scope): write in Oak's "we" voice
to the leadership audience, not plain developer-doc prose.

Contents:

- **Diagnosis** — the central challenge of the experiment→product transition.
- **Oak-strategy alignment** — the stream→goal map above, the schools non-goal, the
  four pillars as constraints, the align-not-fulfil boundary (original derivation).
- **The streams-as-system map** — how the three reinforce each other.
- **Per-stream strategy** — for each stream: its choices, what it will not do, and
  its measures. **The measurable signals are an Oak input** — propose candidates, but
  *what is actually measurable* needs owner/Oak grounding, not agent invention (impact is
  measured by Oak, not in-repo); surface it as an owner checkpoint where the signal isn't
  already known. The MCP-app section carries **K1–K3 repositioned as that stream's
  production-readiness keystones** (alpha→beta→production), and the release-readiness
  requirements (compliance/ATRS, evals, the lesson-level data gate, host UX,
  go-to-market/school-support) as **named hand-offs with accountability** — several
  owned outside this repo, so the deliverable is a tracked hand-off, not in-repo
  resolution.

**Decisions preserved from the 2026-06-17 ratification** (the decisions stand; the
framing around them is corrected): K1–K3 as the MCP-app stream's keystones (§14.2
correction — value-proof articulated here and measured by Oak, not instrumented
in-repo); hybrid taxonomy depth; README names all three. `2a-decisions.md` has been
**archived** (`.agent/plans/archive/`, 2026-06-18) — its decisions are preserved here,
its framing superseded. `value-and-impact.md` is likewise **archived**
(`.agent/plans/archive/`, 2026-06-18); Body 2 absorbs its value-articulation prose
from the archived copy.

**Strategy inputs ratified by the owner (2026-06-20, this session)** — load-bearing
framings for Body 2 authoring; build on these, do not re-open them:

- **Cost efficiency** matters but is **not critical** and must **not dominate
  architectural-excellence decisions in any way**; **funding is out of scope** (the
  project is funded). The diagnosis and choices must not centre cost or sustainability.
- **AI-host framing (positive, not defensive):** teachers are **already using** the AI
  hosts in their work. Our move is to bring Oak's high-quality rigour to that — as
  (1) source materials and (2) agent guidance — and, in future, (3) a response-moderation
  service the host can vet its responses against. We raise the quality of an existing
  behaviour; we do not introduce a new risk vector.
- **The teacher is the safety layer.** The critically-aware expert teacher takes what we
  present and handles it appropriately; teachers are **not conduits**, and **nothing in
  the app is directly aimed at students**. This sharpens ADR-194 (teacher-as-expert): the
  direct safety mechanism is the expert teacher, not app-level child-safety controls.
- **How we win** — the per-stream bets are **signed off** (owner, 2026-06-20); the "we have
  the advantages" discussion resolved into the signed `APP`/`TOOLS`/`FRAME` choices.
- **What we will not do** — the per-stream won't-do lists are **signed off** (owner, 2026-06-20).
- **Strategic granularity** (the traceability-target shape) is **settled — per-stream choices**
  (owner, 2026-06-20); it flows straight into the plan-traceability spine.
- **Measures** are **critically important** and will be defined and measured with Oak's
  **analytics and research experts** — reinforcing that measures are an Oak input, never
  agent-invented.

**Further owner framings (2026-06-20, vision/strategy-structure session)** — settled this
session; build on these:

- **Two-part vision; three-stream strategy.** The vision is two parts (serve the mission;
  the agent-first transformation); the **three value streams are the strategy's first
  organising principle**. Both express the same system — do not collapse them into a ranking.
- **Two co-equal, complementary delivery channels.** Teachers reach Oak through **the web
  and AI assistants**; the channels **complement, not compete**, and **AI has a place in
  both**. This repo delivers the AI-assistant channel. (Supersedes any "the app matters more
  than the web / native apps" framing — the relationship is complementary co-equality.)
- **Curation = the full, iterative product lifecycle** — agent-first applies to building
  *and* maintaining/curating digital products and services, not just to code.
- **Curriculum ownership is external** — this repo is a delivery mechanism and a build
  toolset, not the curriculum owner. Oak owns the curriculum.
- **Amplifier, not replacement** — agent-first amplifies our people; it does not replace
  them. The human-expert-leads ethic runs at **two levels** — the teacher (with our product)
  and our own teams (with agents); pupils are not a level (the repo deliberately doesn't
  centre pupils — owner correction 2026-06-20, superseding the earlier "three levels"
  framing). State it confidently, never as a defensive hedge.
- **"Open educational data, not only Oak's"** is **aligned** with Oak's ecosystem goal
  (innovative, safe tools from *open content and data*, generically) — not a boundary breach.
- **Python SDK to follow** the TypeScript SDK (future, named).

**Release-readiness gate ownership (verified first-hand 2026-06-20)** — input for Body 2's
named hand-offs. "Owned" = a live in-repo plan drives it; "external/tracked" = executed
outside the repo and tracked in the [compliance lane](../compliance/roadmap.md); "discussion"
= no owner yet, surface as a hand-off:

- **Privacy policy / T&Cs surfacing** — *owned in-repo* (`app-submission-standards` WS2 +
  `compliance/roadmap` Phase 1); the legal decide-and-publish step is external.
- **Host UX** — *owned in-repo* (`mcp-app-extension-migration` WS3/WS4).
- **ATRS, detailed DPIA, ICO Children's Code, safeguarding assessment, independent
  AI-output safety/quality evals** — *external/tracked*, **production-release blockers**
  (compliance lane + [launch-readiness](../curriculum-mcp-path-to-ga/launch-readiness-framework.md)
  §B1/§B3); most executed by experts outside the repo.
- **Lesson-level data-availability (the API's missing materialised view)** and **MCP-app
  go-to-market / school support** — *discussion* (no owner yet).

The **ICO Children's Code** question is **cross-linked to the target-audience decision**
(teachers/curriculum leaders; nothing aimed at students — launch-readiness K2 ↔ §B3); that
link is load-bearing and must not be lost.

**Release & distribution constraints (owner, 2026-06-20)** — load-bearing for the app
stream's strategy:

- **The release channel is not unilateral.** We can make the **MCP server** available
  ourselves, but proper **app-like packaging and promotion** (connectors and apps across
  ChatGPT, Claude, and Gemini, even-handedly — never favouring one provider) **require
  collaboration with the AI vendors**. The vendors are **aware and have
  agreed** to support that packaging and to support us reaching the appropriate audience. So
  the **release channel and some promotion channels are an external-collaboration
  dependency** — de-risked by the vendors' agreement, but not something we can do alone. A
  vital product / digital-service constraint; the GTM/distribution hand-off carries it
  (launch-readiness K3 names the ChatGPT, Claude, and Gemini surfaces).
- **Marketing is gated on TPC-risk mitigation.** The app **cannot be marketed** until the
  **TPC risk** is sufficiently mitigated (TPC — the owner's term; relates to lesson-level
  content served by the API, the same area as the data-availability / missing-MV gate). The
  marketing go-ahead is downstream of that mitigation.

**Acceptance (outcome-level):** a `docs/strategy/` corpus exists that a leadership
reader can follow, **written in the editorial voice**; the Oak-alignment (stream→goal,
schools non-goal, pillars) is derived and explicit; the streams-as-system map is stated;
each stream has choices + what-it-will-not-do + measures (**measures owner/Oak-grounded,
not agent-invented**); K1–K3 sit inside the app's section as its readiness keystones;
every release-readiness requirement has a named hand-off; `VISION.md`'s placeholder
links the corpus.

## Body 3 — Plan-Estate Restructure (core, large; informationally depends on Body 2)

Not an addendum — **core to the success of the whole repo and project**, and likely
~80% of the thread's work. A new estate organised around the settled strategy and
vision, value-preserving — and, above all, an **effective body of planning that *will
achieve* the intended strategic outcomes**, not merely aligned to them (owner, 2026-06-21).
The owner-stated scope:

- **All work clearly supports the strategy, and the strategy is fully served.** Every
  surviving plan traces to a strategic choice (alignment); AND every strategic choice has
  *adequate serving plans* to achieve it — identified gaps are **closed with authored new
  plans**, not deferred as discussions (completeness/effectiveness).
- **Organised on the `stream → thread → plan` hierarchy** — a new structure with **threads
  as a co-equal intermediate layer**, not merely plan-boundaries-that-shift: the restructure
  **defines the new thread set** from the strategy, sites every plan in a thread, and maps
  threads to streams/goals. Thread and plan boundaries will change (expected and required).
- **Easy to navigate, easy to understand, highly structured.**
- **Read every plan.** Extract its permanent documentation to its durable home
  (ADRs/docs).
- **Archive complete plans.** Extract-and-archive the completed work from partial
  plans.
- **Rewrite survivors to a common standard.**
- **Extract scattered concepts** currently spread across plans into new, coherent
  plans.
- Plans will **move, be rewritten, archived, and some deleted.**

**Informational split (honours the model):** the *new boundaries, rehoming, and
rewrite-to-standard* depend on the strategy's structure and wait for Body 2. The
*read + permanent-documentation-extraction + archive-genuinely-complete* slice does
**not** — it can proceed in parallel now (`estate-restructure-prep`), so the volume
de-risks without the structure-dependent work jumping ahead of the strategy.

**Value-preservation is mechanised at the idea level:** the survey captures every plan's
ideas at idea-granularity (good / speculative / bad, with provenance), and every idea
removed, re-homed, or isolated carries a **recorded disposition** — `re-housed` (new lane),
`extracted` (idea captured in a named live plan/doc), `superseded` (named successor),
`isolated` (speculative, moved outside the estate), or `archived`. The disposition is a
supersession mapping on the archived artefact or in the receiving archive's README (the
consolidation discipline — never a standalone ledger). A removal without a recorded
disposition is a defect, and the **no-loss audit** (see Acceptance) — run by a dedicated,
independent parallel session — turns the dispositions into a verifiable proof that no useful
information, structure, or relationship was lost.

This body becomes its **own executable plan** (own home, workstreams, TDD-not-
applicable proof contract) when it begins; this governance file scopes it until then. When that executable plan exists,
**this file becomes the thin controlling/index plan** for the `product-development-governance`
collection — the informational-dependence model, cross-body coherence, the Owner Decisions
record, and the index to the executable plans — and does **not** duplicate Body 3's content
(the over-structuring guard, applied to itself; resolved 2026-06-20).
It also resolves the **permanent home** of the governance file and related plans
(`high-level-plan.md`, the strategy corpus, `curriculum-mcp-path-to-ga/`) and removes
the survey-flagged ungated collection.

**Acceptance (outcome-level):** a new structure applied on the `stream → thread → plan`
hierarchy (a directory tree for humans + frontmatter typed edges for agents — both, two
co-equal audiences); **the new thread set is defined and every plan sits in a thread that
maps to a stream/goal**; every plan traces to a strategic choice and is reachable through
the index chain; **every strategic choice has adequate serving plans and every identified
gap is closed with an authored new plan** — the corpus is an *effective* plan-of-action that
achieves the outcomes, not merely an aligned one; every plan read and its
permanent documentation extracted; complete plans archived; partial plans' completed
work extracted and archived; survivors rewritten to the common standard; this plan
and related plans have a decided home; the ungated collection no longer exists; every
removed/moved item has a recorded disposition (supersession mapping; zero unaccounted removals).
**Form-conformance is necessary but not sufficient — the substance gate:** beyond
traceability, reachability, schema-conformance, and recorded dispositions, a reviewer
confirms with evidence that (a) every surviving plan's *content is good*, not merely present
and conformant (the survey's content-quality verdict on each plan's ideas); (b) the corpus *effectively implements* each
strategic choice — adequate serving plans that will achieve it, gaps closed with authored new
plans (the Pass-2 effectiveness verdict), effective not merely aligned; and (c) the bad is
genuinely gone from the live estate. A restructure that passes the form checks but fails this
gate is not done. **No-loss is proven independently, not asserted (owner, 2026-06-21):** a **dedicated primary
agent runs a full parallel session** — concurrent with the restructure, owning no restructure
edits itself — to **prove no loss of useful information, structure, or relationships**, and
**reports back to the owner**. Scope is the whole estate, not just ideas: every removed /
archived / extracted / isolated idea's salvage value conserved in a named live home; the
estate's *structure* preserved or deliberately changed-and-recorded; and the *relationships*
(the typed inter-plan / inter-idea edges) preserved or deliberately changed-and-recorded. It
is an independent adversarial proof — not the restructuring agent marking its own homework.

### Body 3 — Approach (the *how*) — recorded 2026-06-20

The Body-3 design, owner-accepted 2026-06-20 (refined in practice per PDR-018, the living
strategy). With the strategy now signed off, the structural decisions below are **resolved at
the principle level** in §"Resolved" — they define how the restructure reaches a **cohesive
standard of excellence and discovery** across every plan, and make two prerequisite
deliverables first-class. The one concrete that needs the estate read first — the collection
layout — is explicitly gated on the fresh survey, not pre-judged.

**The graph mechanism is owned by the [repo-intent-graph plan](future/repo-intent-graph.plan.md)
(owner-ratified 2026-06-21).** The plan estate is one corpus of a typed, agentic-first memory and
intent graph; this section records the **estate-restructure** approach that consumes that graph.
Body 3's two anchors are delivered by that plan's **Stage 1** (the smallest slice): the `plan`
node-schema (node-schema #1 = the plan standard, Anchor B) and the strategic-choice registry
(Anchor A's target). The survey (Stage 2) and the restructure (Stage 3) follow. The schema,
registry, validator, and observe→warn→enforce mechanics live in that plan, not here.

**Two anchors, both gating the per-plan rewrite:**

- **Anchor A — the strategy** (Body 2), structured to expose an *enumerable, stable set
  of strategic choices* (with IDs) as the traceability targets every surviving plan
  resolves to.
- **Anchor B — the plan node-schema** (= the plan standard, **node-schema #1** of the repo
  intent graph; delivered by the [repo-intent-graph plan](future/repo-intent-graph.plan.md)
  Stage 1): the strict frontmatter-and-edge contract for the `plan` node-type, consolidated
  from PDR-018 + ADR-117 + `templates/`, covering the canonical frontmatter (incl. the
  `serves_strategic_choice` edge), the end-goal/mechanism/means body shape, a closed status
  vocabulary, size guidance, and inter-plan structure. Grounded need: the doctrine exists but
  is unapplied — the minimal documented frontmatter (ADR-117 §6 documents only `name`/`overview`/`todos`) against a much wider, unvalidated emergent key set,
  two parallel status vocabularies, and no validator (exact conformance percentages are
  unverified — the fresh survey measures them). The schema ships with enforcement
  (observe→warn→enforce), generated not hand-maintained, not as more doctrine.

**Two prerequisite deliverables, now explicit:**

1. **The plan standard (Anchor B).**
2. **A fresh deep survey of every plan and plan-adjacent surface** — the 2026-06-15
   survey expanded from census/reachability into a **conformance-and-traceability
   inventory** (per-plan standard-conformance and traceability resolution) **plus an
   idea-granular substance inventory** — each plan's constituent ideas classified
   good / speculative / bad with `file:line` evidence and provenance, plus a per-plan
   content-quality verdict. The two inventories are the work-list the **two-pass
   consolidation** consumes: the conformance inventory scopes plan-level
   rewrite-to-standard; the substance inventory drives the idea-level
   decompose-and-re-compose.
   (2026-06-15 figures are stale — the estate has grown ~33% to ~550 non-archive docs;
   the qualitative debt is unchanged, re-verified 2026-06-20: the real survey figure was
   **149/355 unlinked**, 59 stale executables, 14 openers, 3 missing lane READMEs, a
   stalled reachability-remediation plan.)

**Sequence — vision → strategy → planning (owner, 2026-06-20).** Each level is enhanced
in turn. Lower-level insights can require upstream updates: minor ones are folded in, and
any **major** upstream change is **surfaced and flagged to the owner, never suppressed**
(owner correction 2026-06-20 — "at most minor" was never an owner constraint). Body 2
(strategy) is authored before the plan standard and the deep survey: although the
read+extract slice is informationally independent, both prerequisites' *traceability*
elements need the strategy's strategic-choice shape. **Body 2 is now signed off (2026-06-20), so
the plan standard, the fresh survey, and the read+extract slice are all startable.** The
search/graph-reuse question that once gated the structure-dependent restructure is **resolved**
(a false dichotomy — Owner Decision 20); the restructure's only remaining gate is informational
(the settled strategy + the fresh survey's inventory).

**Traceability is bidirectional.** plans→strategy validates that every surviving plan
serves a strategic choice (→ vision element → Oak goal). strategy→plans *produces the
discussions-to-be-had*: a strategic choice with no serving plan is a discussion to
schedule (build / hand-off / defer), not an orphan defect. The spine surfaces both the
deletions and the gaps.

**The strategic-choice-ID contract** (relocated from the strategy corpus 2026-06-20 — the
strategy *lists* the choices, governance *owns* the contract). The IDs the strategy
enumerates per stream (`APP-*`, `TOOLS-*` — the ecosystem may decompose to
`SDK-*`/`SEARCH-*`/`GRAPH-*`/`EEF-*` — and `FRAME-*`; granularity = **per-stream choices**,
owner-set 2026-06-20) are a contract, not decoration: **stable** (once published, an ID
isn't renumbered or reused), **additive** (new choices get new IDs; the space grows without
breaking existing references — the same discipline as versioning a public API), and
**resolvable** (every legitimate plan traces to exactly one choice; a choice with no serving
plan is a discussion to schedule, not an orphan defect — as above). The
`serves_strategic_choice` frontmatter field and the validator below enforce it.

**The registry is the validator's source of truth — canonical structured data, not prose**
(resolved 2026-06-20). The enumerable choice set lives as a single machine-readable registry
(`id`, `stream`, Oak goal, `status`, optional sub-IDs); the strategy README's choice table is a
*projection* of it, so the human-readable list cannot drift from what the validator checks (the
generated-from-source cure, not a doc-patch). The validator extends the existing
`repo-validators` workspace rather than new standalone tooling, and resolves each plan's
`serves_strategic_choice` against the registry. It is kept to the **thin slice** the incoming
graph analysis recommended — the choice nodes plus the two `serves_strategic_choice` /
reachability edges — not a typed-graph cathedral. The registry file and validator are **built at
Body-3 execution**, gated on the plan standard and the fresh survey; this entry fixes their
design, not their build.

**The consolidation is two-pass, and the atomic unit is the IDEA, not the plan**
(owner, 2026-06-21). A plan is a mixed container — one plan can hold a good idea, two bad
ones, and a speculative aside — so classifying at the plan level structurally forces either
residue (keep the plan, keep its bad ideas) or loss (bin the plan, lose its good idea). The
restructure therefore curates at the idea level, in two passes over the deep-survey
inventory:

- **Pass 1 — decompose and sort.** Using the survey's idea-granular inventory (each plan's
  constituent ideas classified `good | speculative | bad` with `file:line` evidence and
  provenance), extract every idea into one of three buckets: **good** → extracted,
  provenance-tracked, staged for re-composition; **speculative** → the isolated home
  *outside* the planning estate; **bad** → removed via archive-with-disposition, with the
  no-loss audit verifying the bad bucket holds no good or speculative idea.
- **Pass 2 — re-compose.** Assemble the good bucket into new, strategy-aligned plans
  organised `stream → thread → plan` by the strategic choice and visionary value each idea
  serves; under-served choices get authored new plans (the *remix* — completeness, not merely
  alignment). Every re-composed idea traces to its source (provenance), so Pass 2 authors a
  new corpus without losing or distorting the ideas it carries.

The seam (owner-confirmed): the **survey identifies** ideas read-only (its idea-inventory);
the **consolidation extracts, sorts, and re-composes** (it owns the mutation). It is a
reviewed multi-agent pipeline, judgment-heavy throughout — idea classification,
idea-extraction (the value-loss risk; knowledge-preservation is absolute), re-composition,
and traceability assignment.

**Enforcement is the structural cure, not optional polish.** A validator (reachability +
frontmatter conformance + traceability resolving to a real choice) wired into CI,
warn-first per the new-rule convention then blocking. A reachability-remediation plan
already exists but has been stalled since 2026-05-19; reconcile the enforcement work with
it. Without enforcement the restructure re-drifts — the frozen hygiene debt and the
unenforced reachability invariant already prove the failure mode.

**Resolved (2026-06-20, owner-accepted — estate/engineering structure is the collaborative
lane the owner delegated "you decide what excellent looks like"; product-level items stay with
the owner / Oak):**

1. **Dual structure — a directory hierarchy AND frontmatter edges, for two co-equal audiences**
   (owner, reaffirmed 2026-06-21; specified early — it was never either/or). The estate is
   organised **both** ways:
   - **Directory hierarchy `stream → thread → plan` — for HUMAN navigation.** Plans live under
     their thread, threads under their stream; the tree itself expresses the strategy's shape so
     a person can navigate it.
   - **Frontmatter typed edges — for AGENT navigation.** `serves_strategic_choice`, `thread`, and
     the wider graph carry the relationships a single tree cannot (plan → choice → stream → goal;
     threads serve goals selectively), plus a generated strategy→plans index.

   The graph carries what the tree can't; the tree gives humans the stream/thread structure.
   PDR-018's reject-moves-for-symmetry does **not** bar this — a stream/thread hierarchy is
   purposeful dual-audience navigation, not cosmetic symmetry. **The exact directory layout and
   the thread set are decided against the fresh survey** (Anchor B's inventory), never leaned on
   before the estate is read.
2. **Granularity — per-stream choices (owner-set), made decomposition-ready.** The registry
   carries `APP-*`/`TOOLS-*`/`FRAME-*`, with optional `SDK-*`/`SEARCH-*`/`GRAPH-*`/`EEF-*`
   sub-IDs; a plan resolves to the finest *published* ID. Sub-IDs are additive granularity along
   the layered architecture, introduced when a finer distinction earns its keep — not a fork
   gated on any external-vs-internal decision (settled as a false dichotomy, Owner Decision 20).
   The shape accommodates decomposition without building it speculatively (closed-shape optionality).
3. **Rubric strictness and migration — as-touched, not big-bang.** A judgment-heavy rewrite
   cannot be big-banged, and retrofitting ~550 docs at once is high-risk; survivors reach the
   standard as the per-plan pass processes them. New plans conform from creation (the validator
   blocks them); existing plans warn until the pass lands them, then global blocking (warn-first
   convention; the escalation to global blocking is a separate later decision).
4. **Idea-level trichotomy and the three buckets (owner, 2026-06-21).** Curation sorts
   *ideas*, not plans, into three buckets with fixed homes: **good** → kept and remixed into the
   re-composed corpus; **bad** → removed from the live estate via archive-with-disposition (out
   of `.agent/plans/`'s live tree; recoverable record; not relabelled or rehomed within the
   estate); **speculative** → preserved but isolated in a dedicated home *outside* the planning
   estate (proposed `.agent/speculative/`, distinct from `future/`, which holds real
   strategic-but-not-yet-executable plans). Embedded speculative *sections* of an otherwise-good
   plan are extracted to that home, never silently dropped. Knowledge-preservation stays
   absolute: a reviewer confirms value-capture **before** any removal of a non-trivial idea, and
   the no-loss audit (above) proves every good and speculative idea reached a named live home.
   Hard-delete is reserved for zero-value duplicates and empty shells.

**Stays with the owner / Oak (not settled here):** the **strategy measures** (Oak
analytics/research grounds the targets). (The search/graph question and the
internal-transformation alignment rationale were settled 2026-06-20 — Owner Decisions 20 and 21.)

## Estate Hygiene (independent — no informational dependence)

Off the model entirely; runnable now:

- Re-anchor the dead `VISION.md` What-We-Deliver references (the survey / thread
  record is authoritative for the exact file list).
- Fix the stale `editorial-tone.md` vision path.
- Clear the dead PR-76 blocker in `sdk-and-mcp-enhancements/active/ws3-phase-5-…`
  (PR #76 merged 2026-04-10).
- Remediate reachability / session-openers / stale-executables **after** re-verifying
  the current counts (survey figures dated 2026-06-15).
- Concrete stragglers found 2026-06-20 (pre-existing, not this thread's regression — route to
  the reachability-remediation lane): `.agent/prompts/README.md` carries 6 stale prompt-index
  links (`gt-review.md`, `semantic-search/*.prompt.md`, `codegen-*.prompt.md` — prompts retired
  earlier); the archived `reports/archive/plan-estate-survey-2026-06-15/README.md` and
  `plans/archive/vision-strategy-and-plan-estate.value-and-impact.md` carry pre-existing broken
  `../`-depth links (left per archive discipline — dated frozen records).

## Disposition of Superseded Prior Work

The reconception invalidated the *framing* of several artefacts produced under the old
2A/2B/2C model. This is the forward register of what that requires, so no redo work is
silent. Disposition records follow the consolidation discipline — a supersession mapping
on the archived artefact (or in the receiving archive README), never a standalone ledger.

| Artefact | Status under the new model | Disposition & owning body |
| --- | --- | --- |
| `VISION.md` | Full two-part vision (authored 2026-06-20) | Done — two parts authored; links the strategy corpus; owner is final editor. |
| Controlling plan (this file) | Reconceived 2026-06-18 | Done. |
| `2a-decisions.md` | Decisions preserved, framing superseded | **Archived 2026-06-18** with a supersession mapping (decisions → this plan §Owner Decisions; rationale → Body 2). |
| `value-and-impact.md` | Superseded input | **Archived 2026-06-18** (`.agent/plans/archive/`) with a supersession mapping; Body 2 absorbs the value-articulation prose from the archived copy. |
| Survey report (2026-06-15) | Empirical map dated; strategy framing invalidated | **Archived 2026-06-18** (`.agent/reports/archive/`) with a supersession mapping; empirical map and reusable method preserved as a dated input. A **fresh estate survey is a Body-3 prerequisite** before relying on counts. |
| `high-level-plan.md` | "Primitives" goal predates the streams | Superseding callout added 2026-06-18; reconciled to the strategy during Body 3. |
| Readiness assessment report (2026-06-15) | Valid app-readiness content (no rejected framing) | Absorb into the app section of the strategy corpus (Body 2). |
| `launch-readiness-framework.md` | Valid (K1–K3 definitions live here) | Keep; it is the app stream's readiness home, consumed by Body 2. |
| `roadmap.md`, milestone-redefinition stub | Execution-coordination; touched by the restructure | Reconcile to the strategy during Body 3. |
| Continuity surfaces, `open-questions` Q-002 | Corrected / resolved 2026-06-18 | Done. |

**The two genuinely *new* redo deliverables this created, now explicit and sequenced:**
the **strategy corpus** (Body 2 — the proper home that absorbs value-and-impact, the 2a
rationale, and the readiness report), and a **fresh estate survey** (a Body 3 prerequisite,
because the 2026-06-15 survey is both dated and framing-invalidated). Both are owned by an
existing body; neither is left implicit.

## Could it be simpler? (the over-structuring guard)

The structure is deliberately minimal: one governance file, one strategy corpus
(sections, not a plan-per-stream), `VISION.md`, and one restructure executable plan
authored when Body 2 lands. Rejected as over-structuring: a plan per stream's
strategy; a separate plan per restructure sub-task; one mega-plan holding all content.
If any layer here earns its keep only by symmetry, collapse it.

## Owner Decisions

Settled (2026-06-17 / 2026-06-18):

1. **K1–K3** — the MCP-app stream's production-readiness keystones (§14.2 correction).
2. **Taxonomy depth — hybrid** (ecosystem decomposes to SDK/search/graph/EEF) — the
   granularity for the **Body-3 estate gap analysis**.
3. **README — names all three streams.**
4. **Strategy conception — choices + measures; structure — portfolio + per-stream.**
5. **Strategy home — `docs/strategy/`.**
6. **Schools — a deliberate non-goal for this repo.**
7. **Vision, strategy, plans — three separate, co-equal, first-class bodies.**

Settled (2026-06-20):

8. **Vision shape — two parts** (serve Oak's mission; the agent-first transformation),
   with the **three value streams as the strategy's first organising principle**.
9. **Two co-equal, complementary delivery channels** — the web and AI assistants; AI in
   both; this repo delivers the AI-assistant channel.
10. **Curation = the full, iterative product lifecycle** (agent-first applies to build and
    maintain, not just code); **curriculum ownership is external** to this repo.
11. **Amplifier, not replacement** — the human-expert-leads ethic at **two levels** (the
    teacher, with our product; our own teams, with agents); stated confidently. *(Corrected
    2026-06-20: the earlier "three levels (pupil ← …)" wrongly elevated pupils, who are not a
    component of this work — owner direction.)*
12. **"Open educational data beyond Oak's"** is aligned with Oak's ecosystem goal, not a
    boundary breach.
13. **Owner is the final editor of the vision**; engineering/estate structure is
    collaborative; product-strategy substance (diagnosis, how-we-win, won't-do, measures)
    is the owner's.
14. **Diagnosis — settled:** *"deliver Oak's rigour at reach and at pace"* (rigour = the
    value; reach = where teachers and the ecosystem now work; pace = agent-first) — the
    unified hook with per-stream edges. Adopt-and-iterate-from-practice (a living strategy).
15. **Strategic-choice granularity — per-stream choices** (`APP-*`/`TOOLS-*`/`FRAME-*`; the
    ecosystem may decompose to SDK/search/graph/EEF). A plan → one choice → stream → goal;
    threads serve goals selectively (a graph, not a strict tree). The ID *contract* lives in
    governance (§"Body 3 — Approach").
16. **Per-stream how-we-win and won't-do — signed off** (owner, 2026-06-20). The 12 bets
    (`APP-1–4`, `TOOLS-1–4`, `FRAME-1–4`) and the won't-do lists are the working strategy; the
    strategy corpus records the sign-off. Refined in practice per PDR-018 (the living strategy).
17. **Body-3 design resolutions** (owner-accepted 2026-06-20 — the delegated "you decide what
    excellent looks like" lane; recorded in §"Body 3 — Approach › Resolved"): a metadata spine
    (concrete layout survey-gated), a canonical machine-readable strategic-choice registry as the
    validator's source of truth, as-touched rubric migration, archive-by-default deletion with a
    reviewer value-capture gate, and the governance file's thin-index role once Body 3 spawns its
    executable plan.
Outstanding (needs a further owner decision / Oak):

18. **The new estate structure** and the **permanent home** of this governance file and
    related plans — resolved when the Body-3 executable plan is authored.
19. **Strategy measures** — Oak analytics/research grounds the targets (the one remaining
    product-strategy input).

Settled (2026-06-21):

20. **Search/graph — "external vs internal-reuse" is a false dichotomy; settled** (owner,
    2026-06-20/21). Built for general reuse — internal and external are the same build — via the
    layered architecture (generic primitives → reusable libraries → application-specific
    services → apps, separated by degree of coupling); the generic layers are shared,
    publicly-releasable infrastructure, the Oak bindings sit in the SDKs. It does **not** gate
    the restructure: search/graph plans assign to streams by layer (general mechanism → TOOLS;
    Oak application → APP; internal reuse → FRAME-3), and any SDK/search/graph/EEF sub-IDs are
    additive. The remaining restructure prerequisites are the plan standard and the fresh survey.
21. **Internal-transformation alignment — settled** (owner, 2026-06-20/21): Oak getting better at
    delivering Oak's goals. Internal improvement maps onto and amplifies the external goals, and
    the outward framework serves the ecosystem goal directly — no separate rationale is needed
    (the vision already carries it). Closes the item the vision tripwire-2 pass surfaced.
22. **Repo intent graph — vision ratified ("all of it"); the plan standard is node-schema #1;
    staged build** (owner, 2026-06-21). The plan estate is one corpus of a typed, agentic-first
    memory and intent graph — six pillars: one schema generated (indexes are projections), built
    on the generic graph substrate, dual human/agent legibility, authority as typed edges, intent
    preservation, and external systems as typed edges. The whole contract shape is ratified up
    front; the build is staged node-type by node-type (observe→warn→enforce). The **plan standard
    is the `plan` node-schema (#1)**, delivered by the
    [repo-intent-graph plan](future/repo-intent-graph.plan.md) Stage 1 — the smallest slice that
    unlocks the Body-3 survey and restructure without compromising the vision. Schema-first
    applies as a **second domain** (the Cardinal Rule names the OpenAPI spec; the same
    generated-from-schema discipline applies here). Taxonomy survey-gated; the `suggestions/` docs
    held as input-to-verify.

## Inputs and Authorities

Work only from the latest understanding. Authorities, in informational order:

- **Oak's strategy** — from `.agent/reference-local/` (inform-only; original
  derivation only, never quoted/linked/copied).
- **`VISION.md`** — the change and the three streams.
- **Owner direction (2026-06-17 / 2026-06-18)** — the corrected model, the
  streams-as-system, the bodies, the homes, the schools non-goal.
- **ADR-119** (the Practice), **PDR-018** (planning discipline — narrative-first on
  multi-workstream work; end-goal/mechanism/means; blocking-vs-beneficial;
  DECISION-COMPLETE readiness gate), **ADR-117** (document hierarchy — facts
  authoritative in one place).
- **The 2026-06-15 survey report** (archived, `.agent/reports/archive/`) — the empirical
  map only (census, reachability, dependencies); dated, so re-verify via a fresh survey
  before relying on the counts.

The thread record is continuity, not scope authority. The `high-level-plan.md`
strategic goal ("world-class primitives and modular building blocks") **predates the
three streams and is not a source of truth** — Body 2 supersedes it.

## Non-Goals

- **No structure-dependent estate restructuring before its gates clear.** Body 2 is signed off
  and the search/graph question is settled (2026-06-20 — a false dichotomy, see Owner Decision
  20), so the remaining gates are just the **plan standard** and the **fresh survey**. Hygiene
  and the read+extract prep are exempt and **startable now**.
- **No quoting, linking, or copying the local Oak reference** — derive only.
- **No in-repo impact instrumentation** — articulate in the strategy, measure at Oak.
- **No idea deletion** — value-preserving; every removal carries a disposition.
- **No rewriting the survey report's dated findings** — its empirical map is a dated
  2026-06-15 record, re-derived by a *fresh* survey, not edited. The report is archived
  (`.agent/reports/archive/`) with a supersession mapping; its dated content is preserved
  as-is for re-derivation, not rewritten (owner-directed 2026-06-18).
- **No re-litigating settled framings** — three co-equal streams; mission verbatim;
  streams-as-system; schools a deliberate non-goal.
- **No serving Oak's schools goal** until a future explicit decision.

## Proof Contract

**Non-code** governance work; TDD/schema-first clauses are **not-applicable** here and
re-checked if a body grows a code surface. Each claim is proven by the named
`non-code` artefact and a **deterministic** observation:

| Acceptance id | Proof |
| --- | --- |
| `vision-foundation` | `VISION.md` at `d4f6e0293` states three co-equal streams; mission verbatim; README consistent |
| `strategy-decisions-preserved` | K1–K3, hybrid depth, README-three recorded and carried into the corpus |
| `strategy-corpus` | `docs/strategy/` corpus exists, in the editorial voice; Oak-alignment (stream→goal, schools non-goal, pillars) derived; streams-as-system map present; each stream has choices + won't-do + measures (measures owner/Oak-grounded, not invented); K1–K3 inside the app section; every release-readiness requirement has a named hand-off; `VISION.md` links the corpus |
| `estate-restructure` | new structure applied; every plan traces to a strategic choice and is reachable; survivors rewritten to standard; complete archived; partial-completed extracted+archived; home decided; ungated collection gone; **every removed/moved item has a recorded disposition (supersession mapping)** |
| `estate-restructure-prep` | every plan read; permanent documentation extracted to its durable home; genuinely-complete plans archived — all with recorded dispositions; no new boundaries asserted ahead of the strategy |
| `estate-hygiene` | dead VISION anchors repointed; editorial-tone path fixed; PR-76 blocker cleared; reachability re-counted and remediated |

A landed slice or session close is not completion unless the parent scope's
acceptance is proven.

## Risks

| Risk | Mitigation |
| --- | --- |
| Strategy authored as goal-list or impact-only, not choices+measures | the corpus acceptance requires diagnosis, what-we-won't-do, and measures per stream — an impact-only doc fails its proof |
| Streams strategised as independent tracks | cohesion across-and-within is an acceptance condition; the streams-as-system map is required |
| Measures invented by the agent rather than Oak-grounded | measures are an Oak input; acceptance requires owner/Oak grounding; surface an owner checkpoint where the signal isn't already known |
| Strategy corpus authored in plain dev-doc voice | the editorial-tone directive applies to the strategy; "in the editorial voice" is an acceptance and proof condition |
| The app silently re-acquires "first / more important" framing | the framing corrections are an explicit non-goal and a proof condition |
| Restructure deletes value while "restructuring" | recorded disposition (supersession mapping per the consolidation discipline) — every removal carries one or it is a defect |
| Restructure delivers theater — form without substance | the corpus becomes conformant, traceable, navigable, and fully dispositioned while content curation never happens and it only superficially implements the strategy. Mitigation: the substance gate (content-quality + per-choice effectiveness reviewer-confirmed; form-conformance necessary-not-sufficient); idea-level curation, not plan-level relabelling |
| Re-composition (Pass 2) drifts from the source ideas | Pass 2 authors new plans from extracted ideas; mitigation: every re-composed idea traces to its source (provenance), the no-loss audit proves each good/speculative idea reached a named live home, and the substance gate confirms faithful carriage |
| Over-structuring the approach itself | the could-it-be-simpler guard; collapse any layer that earns its keep only by symmetry |
| New boundaries asserted before the strategy exists | the informational split — boundary work waits for Body 2; only read+extract+archive proceeds early |
| Survey counts decay before Body 3 | re-verify counts before relying on them |
| A framing not grounded in the current authorities | ground every framing in Oak's strategy, `VISION.md`, owner direction, or the survey's empirical map before using it |

## ADR Trigger

No ADR now (this plan makes no architectural decision). **But** if Body 3 changes the
plan-lane *convention* — retires a lane, introduces a new top-level taxonomy, or
amends the reachability invariant beyond this plan's temporary exception — raise an
ADR amending ADR-117 rather than merely applying it.

## Foundation Alignment and First-Principles Check

- `principles.md`, `testing-strategy.md`, `schema-first-execution.md` — read at the
  start of any body that grows a code surface; these bodies produce docs/governance,
  so TDD/schema-first are **not-applicable** and re-checked if that changes.
- `plan-body-first-principles-check` fires before each body: re-derive whether the
  named move still serves the vision's impact and whether the surfaces have changed.
- First Question, before each decision: **could it be simpler without compromising
  quality and impact?** — and **would it be simpler if the system changed?**

## Lifecycle Triggers

See [`templates/components/lifecycle-triggers.md`](../templates/components/lifecycle-triggers.md).
This file is the session-entry and work-shape surface for the thread; register the
claim on touched files before editing; run the consolidation workflow at each body
closure; refresh the thread record as state changes, keeping scope authority here.

## Home

This file lives at
`.agent/plans/product-development-governance/vision-strategy-and-plan-estate.plan.md`
— it anchors the `product-development-governance` collection as its agreed, active
controlling plan. The imported analysis documents that informed this thread are
subordinate **suggestions** under [`suggestions/`](suggestions/), not co-authorities;
see the [collection README](README.md). Moved here from the planning root 2026-06-20
(owner-directed placement — the root location was a convenience, not an intent);
all cross-references were updated in the same change. This supersedes the earlier
"provisional root exception" note: the home is now decided.
