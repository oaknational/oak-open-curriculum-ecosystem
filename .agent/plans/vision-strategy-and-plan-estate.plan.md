---
plan_id: vision-strategy-and-plan-estate
title: "Vision, Strategy, and Plan-Estate — Thread Governance"
type: governance-execution
status: active
lifecycle: active
thread: strategy-and-plan-estate-holistic-review
last_updated: 2026-06-18
related:
  - VISION.md
  - .agent/plans/high-level-plan.md
  - .agent/plans/curriculum-mcp-path-to-ga/roadmap.md
  - .agent/plans/curriculum-mcp-path-to-ga/launch-readiness-framework.md
  - .agent/reports/archive/plan-estate-survey-2026-06-15/README.md
todos:
  - id: vision-foundation
    content: "Vision body — VISION.md states the change, three co-equal streams, mission verbatim (committed d4f6e0293). DONE as the change-statement. Its alignment TO Oak's strategy is expressed in the strategy corpus, not restated in the vision."
    status: completed
  - id: strategy-decisions-preserved
    content: "Strategy body — decisions preserved from the 2026-06-17 ratification: K1–K3 (the MCP-app stream's production-readiness keystones, §14.2 correction), value-stream taxonomy depth = hybrid, README names all three streams. value-and-impact.md is archived as an input the strategy corpus (Body 2) absorbs."
    status: completed
  - id: strategy-corpus
    content: "Strategy body (UNDERWAY) — author the cohesive system-strategy at docs/strategy/: shared diagnosis (the experiment→product central challenge), the streams-as-system map (how the three reinforce each other), guiding choices + what-we-will-not-do + measures, and the Oak-strategy alignment (stream→Oak-goal map; schools as a deliberate non-goal; the four pillars as constraints; align-not-fulfil boundary). K1–K3 repositioned inside the app's section; release-readiness requirements as named hand-offs. Leadership-grade; stands on its own merit."
    status: in_progress
  - id: estate-restructure
    content: "Plan-estate body (core, large — informationally depends on the strategy's structure) — read every plan, extract permanent documentation, archive complete plans, extract-and-archive completed work from partial plans, rewrite survivors to a common standard, pull scattered concepts into new plans, delete with disposition. New thread/plan boundaries derived FROM the strategy. Value-preserving via recorded dispositions (supersession mappings per the consolidation discipline, never a standalone ledger)."
    status: blocked
  - id: estate-restructure-prep
    content: "Plan-estate body, strategy-independent slice (runnable now) — reading every plan and extracting its permanent documentation to its durable home (ADRs/docs) does NOT informationally depend on the final strategy; the new BOUNDARIES do. Begin the read+extract+archive-genuinely-complete pass in parallel; defer new-boundary rehoming and rewrite-to-standard until the strategy structure exists."
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

## Body 1 — Vision (DONE as the change-statement)

`VISION.md` (root) states the change, three co-equal streams, mission verbatim
(`d4f6e0293`). It is a vision: the change + why + a map to the how. It does **not**
restate Oak's strategy or contain the alignment — that is the strategy's job. The
only residual is a forward pointer to the strategy corpus once it exists (the
"strategic goals — in development" placeholder).

**Acceptance (met):** `VISION.md` names three co-equal streams; mission verbatim;
README front matter consistent; strategy placeholder present.

## Body 2 — Strategy (UNDERWAY; home: `docs/strategy/`)

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
vision, value-preserving. The owner-stated scope:

- **All work clearly supports the strategy.** Every surviving plan traces to a
  strategic choice.
- **Organised around the strategy and vision** — a new structure; **thread/plan
  boundaries will change** (expected and required).
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

**Value-preservation is mechanised:** every plan removed or moved carries a **recorded
disposition** — `re-housed` (new lane), `extracted` (concept captured in a named live
plan/doc), `superseded` (named successor), or `archived`. The disposition is a supersession
mapping on the archived artefact or in the receiving archive's README (the consolidation
discipline — never a standalone ledger). A removal without a recorded disposition is a defect.

This body becomes its **own executable plan** (own home, workstreams, TDD-not-
applicable proof contract) when it begins; this governance file scopes it until then.
It also resolves the **permanent home** of the governance file and related plans
(`high-level-plan.md`, the strategy corpus, `curriculum-mcp-path-to-ga/`) and removes
the survey-flagged ungated collection.

**Acceptance (outcome-level):** a new structure applied; every plan traces to a
strategic choice and is reachable through the index chain; every plan read and its
permanent documentation extracted; complete plans archived; partial plans' completed
work extracted and archived; survivors rewritten to the common standard; this plan
and related plans have a decided home; the ungated collection no longer exists; every
removed/moved item has a recorded disposition (supersession mapping; zero unaccounted removals).

## Estate Hygiene (independent — no informational dependence)

Off the model entirely; runnable now:

- Re-anchor the dead `VISION.md` What-We-Deliver references (the survey / thread
  record is authoritative for the exact file list).
- Fix the stale `editorial-tone.md` vision path.
- Clear the dead PR-76 blocker in `sdk-and-mcp-enhancements/active/ws3-phase-5-…`
  (PR #76 merged 2026-04-10).
- Remediate reachability / session-openers / stale-executables **after** re-verifying
  the current counts (survey figures dated 2026-06-15).

## Disposition of Superseded Prior Work

The reconception invalidated the *framing* of several artefacts produced under the old
2A/2B/2C model. This is the forward register of what that requires, so no redo work is
silent. Disposition records follow the consolidation discipline — a supersession mapping
on the archived artefact (or in the receiving archive README), never a standalone ledger.

| Artefact | Status under the new model | Disposition & owning body |
| --- | --- | --- |
| `VISION.md` | Valid (the change-statement) | Keep. Add a forward pointer to the strategy corpus when it exists (Body 2). |
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

Outstanding (genuinely needs the settled strategy):

8. **The new estate structure** and the **permanent home** of this governance file
   and related plans (Body 3).

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

- **No estate restructuring before Body 2 (strategy) is settled** — the
  structure-dependent restructure only. Hygiene and the read+extract prep are exempt.
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

See [`templates/components/lifecycle-triggers.md`](templates/components/lifecycle-triggers.md).
This file is the session-entry and work-shape surface for the thread; register the
claim on touched files before editing; run the consolidation workflow at each body
closure; refresh the thread record as state changes, keeping scope authority here.

## Provisional Home

This file lives at `.agent/plans/vision-strategy-and-plan-estate.plan.md` (the
planning root, alongside `high-level-plan.md`) **provisionally**, linked from the root
README and recorded as a temporary second root exception in the reachability
invariant. Its permanent home is decided by Body 3. When decided, move this file and
update all cross-references in a clean break.
