---
plan_id: vision-strategy-and-plan-estate
title: "Vision → Strategy → Plan-Estate"
type: governance-execution
status: active
lifecycle: active
thread: strategy-and-plan-estate-holistic-review
last_updated: 2026-06-17
related:
  - VISION.md
  - .agent/plans/high-level-plan.md
  - .agent/plans/curriculum-mcp-path-to-ga/roadmap.md
  - .agent/plans/curriculum-mcp-path-to-ga/launch-readiness-framework.md
  - .agent/reports/plan-estate-survey-2026-06-15/README.md
todos:
  - id: p1-vision-finalise
    content: "Phase 1 — Vision finalised as three co-equal value streams; committed d4f6e0293"
    status: completed
  - id: p1-readme-headline
    content: "Phase 1 residual — README headline/strapline names all three streams (owner editorial choice)"
    status: pending
  - id: p2a-align-impact
    content: "Phase 2A — Align on impact: a value/impact articulation per stream (articulated here, measured by Oak); settle K1–K3 AND the value-stream taxonomy depth as part of this step"
    status: pending
  - id: p2b-gap-analysis
    content: "Phase 2B — Value-stream redundancy and gap analysis, at the taxonomy depth settled in 2A (not assumed to be three)"
    status: pending
  - id: p2c-execution-spine
    content: "Phase 2C — Execution spine for all value streams (only after 2A and 2B)"
    status: pending
  - id: p2-integrate-surfaces
    content: "Phase 2 (folds into 2A–2C) — Reconcile high-level-plan strategic goal to three streams; fill the VISION strategy placeholder; record each release-readiness requirement as a tracked hand-off with named external accountability"
    status: pending
  - id: p3-estate-restructure
    content: "Phase 3 (gated on 1+2) — DAG-driven restructure, value-preserving via a disposition ledger; remove the survey-flagged ungated collection; define the permanent home for this plan and related plans"
    status: blocked
  - id: estate-hygiene
    content: "Estate hygiene (NOT strategy-gated; runnable now) — re-anchor dead VISION references; fix the editorial-tone vision path; clear the dead PR-76 blocker; remediate reachability/openers/stale-executables after re-verifying current counts"
    status: pending
---

# Vision → Strategy → Plan-Estate

The controlling plan for the `strategy-and-plan-estate-holistic-review` thread:
the work of moving this repository **from an important experiment to an important
product**. It owns the scope, sequencing, acceptance, and gating for three layers
— vision, strategy, plan estate — that until now have been driven off a continuity
record and a survey report with no plan of record. This file is that plan of
record; the thread's continuity record is the pickup surface that points here, not
an authority for scope.

It is linked directly from the root [`plans/README.md`](README.md) and recorded in
the reachability invariant as a **temporary second root exception** (alongside
`high-level-plan.md`) pending Phase 3. Defining its own permanent home — and the
home of related plans — is the `p3-estate-restructure` deliverable: the plan
governs the restructure that decides where it lives, so it must not pretend the
planning-root location is settled.

## End Goal

A coherent **vision** → a practical, measurable **strategy** organised around
delivering the vision's impact → a **plan estate** re-organised to serve the
strategy. The transition is **value-preserving**: understand the value encoded in
plans and express it more clearly and discoverably; never delete ideas.

## Mechanism

- **A dependency DAG forces derivation, not drift.** Each layer derives from the
  one above. Building any layer before the one it depends on produces a layer that
  looks settled but encodes a stale or absent parent.
- **Impact is made explicit, not instrumented here.** Per owner §14.2, the
  deliverable is a value/impact *articulation* connected to Oak's measurement
  capability — not in-repo instrumentation.
- **The estate models the discipline it imposes.** The thread whose job is to
  leave no plan ungated must itself be a gated, value-preserving plan. This file
  closes that gap.

## The Dependency DAG

```text
VISION  ──gates──▶  STRATEGY  ──gates──▶  PLAN ESTATE
(three streams)     (impact + spine)      (structure serves strategy)
```

Each arrow is a gate: the downstream layer does not begin substantive work until
the upstream layer's acceptance is met. (Pure estate *hygiene* — dead links, a
merged-PR blocker — is **not** downstream of strategy and is not on this DAG; see
Estate Hygiene.)

## Phase 1 — Vision (DONE)

The vision is finalised and committed (`d4f6e0293`): three co-equal value streams
(teacher-facing MCP app; ecosystem engineering tools; the agentic-engineering
framework that delivers AI-enhanced innovation), mission verbatim, change → why →
map-to-how. README front matter realigned to three streams.

**Acceptance (met):** `VISION.md` names three co-equal streams; mission verbatim;
strategy placeholder present; README front matter consistent.

**Residual (owner editorial choice):** the README headline (`:8`) and strapline
(`:6`) still frame the repo around the ecosystem stream alone; they should name all
three. Owner's call; not blocking.

## Phase 2 — Strategy Layer (NEXT)

Create the **missing** strategy documents and **integrate** the existing strategy
surfaces, organised around delivering the vision's impact. The internal method is
owner-set (survey §14/§15) and **must not be flattened into "write the strategy
docs"**:

- **2A — Align on impact (do first).** Author a value/impact articulation **per
  value stream**: what value and impact each intends to create, why it matters, how
  we attempt it — connected to Oak's measurement capability. Articulated here,
  measured by Oak; **not** in-repo instrumentation. Two settlements happen inside
  2A because both define the shape everything downstream consumes:
  - **K1–K3** (K1 *is* an impact definition): ratify, revise, or correct, and
    reconcile the surfaces — **five** documents assert them as owner-decided/ratified
    (launch-readiness framework, high-level-plan, the path-to-GA roadmap, the
    milestone-redefinition stub, and the readiness assessment report) while **three**
    record them as agent input (`repo-continuity.md`, the survey §12/§14, and the
    thread record). Strip the in-repo-instrumentation language from K1 to match §14.2.
  - **Value-stream taxonomy depth** — whether the sub-capabilities (SDK, search,
    graph, EEF) sit under the three streams or are treated as streams in their own
    right. This decision sets the granularity 2B runs at.
- **2B — Value-stream redundancy and gap analysis**, run **at the taxonomy depth
  settled in 2A** — not assumed to be three. The survey flagged SDK/search/graph/EEF
  as the sub-capabilities with no execution spine; a gap analysis at too coarse a
  granularity would return a false "no gaps". Re-verify the survey's empirical counts
  have not decayed before relying on them (see Currency Discipline).
- **2C — Execution spine.** Only after 2A and 2B: design the execution spine /
  milestone structure for all streams. Do not jump to the spine first.

Integrate the existing surfaces **into the step that consumes each** (not as a
fourth peer step): reconcile the `high-level-plan.md` strategic goal (currently
ecosystem-primitives-centric, predating three streams) to the three streams; fill
the `VISION.md` strategy placeholder and link the resulting corpus. **Fold in the
release-readiness requirements** (algorithmic-transparency reporting; privacy and
T&Cs; AI-output quality/safety evals; the lesson-level data-availability gate; host
UX; go-to-market/school support) — several owned **outside this repository**. For
those, the deliverable is a **tracked hand-off with a named external
accountability**, not in-repo resolution; the repo cannot assign an external owner.

**Acceptance (outcome-level):** a value/impact articulation exists per stream;
K1–K3 and the taxonomy depth are owner-settled and recorded consistently across
every surface; a spine exists for every stream with named acceptance per milestone;
the `VISION.md` placeholder links a real strategy corpus; every release-readiness
requirement has a tracked hand-off with named accountability.

## Phase 3 — Plan-Estate Restructure (GATED on Phase 1 + 2)

A new directory structure driven by the settled strategy and vision,
value-preserving. Deliverables:

- **Define the permanent home** for this plan and related plans (`high-level-plan.md`,
  the new strategy corpus, `curriculum-mcp-path-to-ga/`). The provisional planning-root
  location and its temporary invariant exception are resolved here.
- **Remove the survey-flagged ungated collection** (survey §4): every plan it holds
  is either re-housed in a live lane with a named dependency and an owner-agreed gate,
  or its concept is extracted and the item deleted. The collection ceases to exist.

**Value-preservation is mechanised, not aspired.** Every plan removed or moved gets
a **disposition-ledger** entry — `re-housed` (with the new lane), `extracted`
(concept captured in a named live plan/doc), or `superseded` (by a named successor).
"No idea lost" is proven by the ledger holding an entry for every removal; a removal
without a ledger entry is a defect.

**Acceptance (outcome-level):** a new structure is applied; every plan is gated and
reachable through the index chain; this plan and related plans have a decided home;
the survey-flagged ungated collection no longer exists; **every removed/moved item
has a disposition-ledger entry** (zero unaccounted removals).

## Estate Hygiene (NOT strategy-gated — runnable now)

These items depend on **nothing** in the vision or strategy, so they are off the
DAG and not trapped behind the Phase 3 gate (the owner's gate is on *restructuring*,
not hygiene):

- Re-anchor the dead `VISION.md` What-We-Deliver references to the README's own
  inventory table. (Exact file list: the survey / thread-record outdated-content
  note is authoritative; do not half-enumerate here.)
- Fix the stale `editorial-tone.md` vision path (points at the pre-move location).
- Clear the dead PR-76 blocker in `sdk-and-mcp-enhancements/active/ws3-phase-5-…`
  (PR #76 merged 2026-04-10 per survey §8).
- Remediate reachability / session-openers / stale-executables — **after
  re-verifying the current counts** (the survey's figures are dated 2026-06-15).

**Acceptance:** dead VISION anchors repointed; editorial-tone path fixed; PR-76
blocker cleared; reachability re-counted and remediated.

## Owner Decisions To Settle (named, not made)

Decisions 1, 2, and 4 are drafted as decision-ready options in the companion
[`vision-strategy-and-plan-estate.2a-decisions.md`](vision-strategy-and-plan-estate.2a-decisions.md);
the owner ratifies them next session — the plan settles nothing on their behalf.

1. **K1–K3** — ratify, revise, or correct (Phase 2A).
2. **Value-stream taxonomy depth** — sub-capabilities under the three streams, or
   streams in their own right (Phase 2A; sets 2B's granularity).
3. **The new directory structure** and the **permanent home** of this plan and
   related plans (Phase 3).
4. **The README headline** editorial choice (Phase 1 residual).

## Inputs and Authorities — With Currency Discipline

Work **only from the latest understanding**. Surfaces here carry deprecated
concepts that read as current:

- The 2026-06-15 **survey report** is the input for its **empirical map only** (the
  census, reachability, dependency data). Its **strategic framing** (§11/§13:
  inward-skew, two-products tension, proof-of-value-as-in-repo-instrumentation) is
  **owner-superseded by §14** — do not re-import it. The estate is a deliberate
  multi-value-stream portfolio, not a skew. The survey's §15 next-session note tells
  the reader to "ground in VISION §How We Measure Impact + §Three Orders" — those
  sections were **deleted** in the vision rewrite; that instruction is stale.
- Do **not** re-introduce **evicted vision concepts** as current: the deleted vision
  sections (What We Deliver, How We Measure Impact, Three Orders of Effect, Two
  Audiences) were removed on purpose. "Three orders of effect" is a causal-chain
  concept and is **not** the value-stream taxonomy (which is three streams).
- The **thread record** is continuity (pickup state) and is being refreshed; it is
  **not** an authority for scope — this plan is. Re-verify it has been refreshed to
  three streams before treating any framing in it as current.
- Authorities: `VISION.md` (committed), owner §14/§15 corrections, ADR-119 (the
  Practice), the `editorial-tone.md` directive, and the survey's empirical data.

## Non-Goals

- **No estate restructuring before Phase 1 + 2 are done** (the gate). Pure hygiene
  is exempt — it is not restructuring.
- **No in-repo impact instrumentation** — articulate here, measure at Oak.
- **No idea deletion** — value-preserving; every removal carries a disposition.
- **No editing the survey report** — the survey run is complete; treat its empirical
  map as a dated 2026-06-15 input to re-verify, not a surface to edit.
- **No re-litigating settled framings** — three co-equal streams; mission verbatim.

## Prerequisites

- Phase 2 — `blocking` on Phase 1 (met).
- Phase 3 — `blocking` on Phase 1 and Phase 2.
- Phase 2A **drafting** — `beneficial` on owner availability: the decision-ready
  articulation (naming the K1–K3 and taxonomy-depth options) proceeds **now**
  without the owner. Only the **settled** state — K1–K3 and taxonomy depth ratified
  — is `blocking` on owner availability.
- Estate hygiene — no strategy prerequisite; `beneficial` only on a current
  reachability re-count before the remediation step.

## Proof Contract

**Non-code** governance work; TDD cycles do not apply (no product code lands), so
those clauses are recorded **not-applicable** here and re-checked if a phase grows a
code surface. Each completion claim is proven by the named `non-code` artefact and a
**deterministic** observation:

| Acceptance id | Proof |
| --- | --- |
| `p1-vision-finalise` | `VISION.md` at `d4f6e0293` states three co-equal streams; README consistent |
| `p1-readme-headline` | README `:6`/`:8` name all three streams (owner-approved) |
| `p2a-align-impact` | a value/impact articulation exists per stream; grep the five named keystone surfaces — K1–K3 stated identically or consistently qualified across all; taxonomy depth recorded |
| `p2b-gap-analysis` | gap analysis runs at the settled taxonomy depth; each overlap / under-served stream named with evidence |
| `p2c-execution-spine` | a spine exists for every stream; each milestone names its own acceptance |
| `p2-integrate-surfaces` | high-level-plan goal reconciled to three streams; VISION placeholder links the corpus; every release-readiness requirement has a tracked hand-off with named accountability |
| `p3-estate-restructure` | new structure applied; every plan reachable through the index chain; this plan + related plans have a decided home; **every removed/moved item has a disposition-ledger entry** — zero unaccounted removals |
| `estate-hygiene` | dead VISION anchors repointed; editorial-tone path fixed; PR-76 blocker cleared; reachability re-counted and remediated |

A landed slice or session close is not completion unless the parent scope's
acceptance is proven.

## Risks

| Risk | Mitigation |
| --- | --- |
| Strategy authored doc-first, skipping align-on-impact | 2A is a hard gate before 2C; 2C proof requires per-milestone acceptance, so a doc-existence spine fails its proof |
| Gap analysis at the wrong granularity returns false "no gaps" | 2B granularity is bound to the 2A taxonomy-depth decision, not hard-coded to three |
| Deprecated framings re-imported from the survey | Currency Discipline; empirical map only, §11/§13 owner-superseded |
| Phase 3 deletes value while "restructuring" | disposition ledger — every removal carries a recorded disposition or it is a defect |
| K1–K3 left unsettled, strategy built on contradiction | settle K1–K3 inside 2A; proof greps the five surfaces for consistency |
| Survey counts decay before Phase 2B/3 | re-verify counts before relying on them |

## ADR Trigger

No ADR is required now (this plan makes no architectural decision; K1–K3 and the
directory structure are owner/execution decisions). **But** if Phase 3 changes the
plan-lane *convention* — retires a lane, introduces a new top-level taxonomy, or
amends the reachability invariant beyond this plan's temporary exception — rather
than merely applying ADR-117, raise an ADR amending ADR-117.

## Foundation Alignment and First-Principles Check

- `principles.md`, `testing-strategy.md`, `schema-first-execution.md` — read at the
  start of each phase. TDD/schema-first apply where a phase produces code; these
  phases produce docs/governance and none, so those clauses are **not-applicable**
  here and re-checked if a phase grows a code surface.
- `plan-body-first-principles-check` fires before each phase: re-derive whether the
  named move still serves the vision's impact, and whether the surfaces have changed
  since this plan was written.
- First Question, before each decision: **could it be simpler without compromising
  quality?**

## Lifecycle Triggers

See [`templates/components/lifecycle-triggers.md`](templates/components/lifecycle-triggers.md).
This plan is the session-entry and work-shape surface for the thread; register the
claim on touched files before editing; run the consolidation workflow at each phase
closure; refresh the thread record (continuity) as state changes, keeping scope
authority in this plan.

## Provisional Home

This plan lives at `.agent/plans/vision-strategy-and-plan-estate.plan.md` (the
planning root, alongside `high-level-plan.md`) **provisionally**, linked from the
root README and recorded as a temporary second root exception in the reachability
invariant. Its permanent home is decided by `p3-estate-restructure`. When decided,
move this file and update all cross-references in a clean break.
