---
plan_id: deep-plan-estate-survey
title: 'Deep Plan-Estate Survey — multi-angle, critically-verified inventory and analysis'
type: governance-delivery
status: future
lifecycle: future
thread: strategy-and-plan-estate-holistic-review
last_updated: 2026-06-21
related:
  - ./repo-intent-graph.plan.md
  - ../vision-strategy-and-plan-estate.plan.md
  - ../../../../docs/architecture/architectural-decisions/117-plan-templates-and-components.md
  - ../../../practice-core/decision-records/PDR-018-planning-discipline.md
  - ../../../memory/operational/threads/README.md
  - ../../../../docs/strategy/README.md
  - ../../../reports/archive/plan-estate-survey-2026-06-15/README.md
---

# Deep Plan-Estate Survey — multi-angle, critically-verified inventory and analysis

> **Strategic brief for a separate, dedicated session (`future/`).** This is the decision-complete
> method for Stage 2 of the [repo-intent-graph plan](./repo-intent-graph.plan.md): the fresh deep
> survey that grounds the intent-graph contract, produces the restructure work-list, and surfaces
> cross-cutting patterns. The method is fixed here; **the findings are not presupposed.** Promote to
> `current/` and run when the prerequisite lens exists (see §Prerequisites).

## Problem and intent

The 2026-06-15 survey is dated and framing-invalidated; the estate has grown ~33% to ~550
non-archive docs. We need a **fresh, deep, multi-angle survey** that a single reader could not
produce — one that reads every plan from several viewpoints, verifies every load-bearing claim
against the source, and looks for patterns *between* documents, not only within them. Its purpose is
threefold and must not collapse to one: **(a) ground the intent-graph taxonomy** (which node/edge
types empirically exist — the survey-gated input to the contract); **(b) produce the restructure
work-list** (per-document classification + traceability resolution); **(c) surface cross-cutting
patterns** (across plans, groups, threads, and adjacent document groups) that only a relational read
reveals. It presupposes none of these outcomes — it discovers them.

## End goal, mechanism, and means

- **End goal.** A future human-agent team holds a complete, evidence-cited, critically-verified
  picture of the plan estate and its relationships — enough to ratify the intent-graph taxonomy, to
  restructure without losing value, and to trust the picture because every load-bearing claim was
  verified against the source, not asserted by a single agent.
- **Mechanism.** Many independent viewpoints over the same material, each blind to the others until
  synthesis, with an adversarial verification gate before any finding is accepted — so coverage is
  broad, bias is diluted, and no unverified claim enters the record. Dynamic workflows fan the reads
  out and pipeline each document through read → specialist → verify without a barrier.
- **Means.** A discovery pass; a per-document deep read by at least three agents each; a set of
  cross-cutting relational passes; a synthesis with a completeness critic that loops until dry. See
  §Method.

## Scope

- **In scope (the survey discovers the exact set; do not assume it).** Every plan (`*.plan.md`),
  every plan-adjacent surface (roadmaps, indexes, READMEs, research, openers, templates) under
  `.agent/plans/`; and the adjacent document groups the relational passes need: ADRs
  (`docs/architecture/architectural-decisions/`), PDRs (`.agent/practice-core/decision-records/`),
  the strategy corpus (`docs/strategy/`), reports (`.agent/reports/`), and the
  continuity/thread/memory surfaces (`.agent/memory/`).
- **Out of scope.** Restructuring, archiving, rewriting, or moving anything — this survey reads,
  classifies, and analyses only; the restructure is Stage 3. Authoring the final taxonomy — the
  survey *grounds* it; ratification is the repo-intent-graph plan's.

## Method

### Pass 0 — discovery (build the work-list first)

Enumerate the full target set before reading deeply, multi-modally so no surface is missed: by
directory walk, by glob (`*.plan.md`, `roadmap.md`, `*.research.md`, `README.md`), by frontmatter
presence/absence, and by reachability from the root index. Emit the work-list as structured data
(path, collection, lane, has-frontmatter, declared type). **Log every surface the discovery dropped
or could not classify** — silent truncation reads as "covered everything" when it did not.

### Pass 1 — per-document deep read (at least three agents per plan)

Every plan is read by **≥3 agents**: one **holistic**, then **specialist viewpoints chosen by
content signal**, with a floor that guarantees at least three reads.

- **Holistic reader (always).** Returns a structured finding: purpose; end-goal/mechanism/means
  (present? coherent?); lifecycle state (and whether folder-lane and frontmatter agree); authority
  (what it owns; is it cited as authority it should not hold?); traceability candidates (which
  strategic choice / ADR / thread it serves); health (staleness, dead links, superseded framing);
  value; and a **classification recommendation** with evidence.
- **Specialist viewpoints (routed by content signal).** Test/TDD/proof-contract content →
  `test-expert`; architecture/boundaries/dependency-direction → an architecture reviewer;
  auth/PII/secrets/trust-boundary → `security-expert`; types/schema/codegen → `type-expert`;
  tooling/config/gates → `config-expert`; docs/ADR/onboarding surfaces → `docs-adr-expert` /
  `onboarding-expert`; plan-readiness/proportionality/blocking-legitimacy → `assumptions-expert`. A
  **conformance reader** scores the plan against the `plan` node-schema (the lens). If content
  signals yield fewer than two specialists, add the conformance reader and `assumptions-expert` to
  reach the floor of three reads.
- **Adversarial verification gate (before any finding is accepted).** An independent agent attempts
  to **refute** each load-bearing finding against the source (especially "complete", "superseded",
  "orphaned", "duplicate", "dead"), defaulting to refuted on uncertainty. A finding survives only if
  the refutation fails. **No finding enters the record unverified** — this is the owner's standing
  rule made structural, not advisory.

### Pass 2 — cross-cutting relational passes (the additional surveys)

Each is its own multi-agent sweep, blind to the others until synthesis, and each finding is
adversarially verified as in Pass 1:

- **Across plans.** Duplication, contradiction, drift, vocabulary inconsistency, the two-status-system
  divergence, and emergent-frontmatter-key sprawl.
- **Across groups of plans (collections).** Collection coherence; lifecycle-lane correctness; over- or
  under-structuring; missing or stale collection READMEs/roadmaps.
- **Plans ↔ threads.** Does every plan map to a thread? Orphan plans; threads with no plan; thread
  lifecycle vs plan lifecycle agreement; continuity records cited as scope authority.
- **Plans ↔ adjacent document groups.** Plans ↔ ADRs (architectural claims without an ADR; ADRs with
  no consuming plan); plans ↔ strategic choices (every plan serves a choice → vision → goal; every
  choice has a serving plan, else a discussion-to-schedule, not an orphan defect); plans ↔ reports
  (evidence links); plans ↔ memory/continuity; plans ↔ the standard (conformance).

### Pass 3 — synthesis and completeness critic

Aggregate the verified findings into the outputs below. A final **completeness critic** asks: *what
is missing — a document group not swept, a claim not verified, a relational angle not run, a surface
the discovery dropped?* Whatever it finds becomes the next round. **Loop until two consecutive
critic rounds surface nothing new** (loop-until-dry; a simple one-pass survey misses the tail).

## Orchestration (dynamic workflows)

Run with dynamic multi-agent orchestration — on Claude Code the **Workflow tool**, or the
platform's equivalent multi-agent primitive — not a single linear agent:

- **Per-document:** `pipeline(plans, holisticRead, specialistFanOut, adversarialVerify)` — each plan
  flows read → specialists → verify with no barrier, so wall-clock is the slowest single chain, not
  the sum.
- **Cross-cutting:** `parallel` over the relational passes (they need the full per-document result
  set, so a barrier here is correct), each pass itself fanning out and verifying.
- **Completeness:** a loop-until-dry around the critic.
- **Every structured finding uses a schema** (StructuredOutput), so aggregation is validated, not
  parsed from prose. Scale honestly: the estate is ~550 docs (an estimate; Pass 0 measures the actual count) × ≥3
reads — large; batch within the concurrency cap
  and **log any coverage bound** (top-N, sampling, no-retry) rather than letting it read as full
  coverage.

## Critical-analysis discipline (non-negotiable)

Per the owner's standing direction and the ratified intent-graph pillars: **every subagent response,
claim, and source is input-to-verify.** The orchestrator never synthesises an unverified claim. Check
sources first-hand (read the cited lines); adversarially verify load-bearing findings (majority-refute
kills); cite `file:line` for every claim; reconcile divergent counts by re-deriving, never by
averaging. A subagent's confident summary is a claim, not a finding. This discipline is the reason the
survey is trustworthy; it is not optional polish.

## Outputs (structured, evidence-cited, in `.agent/reports/`)

Authored under a dated `.agent/reports/` survey directory; nothing presupposed:

1. **Conformance-and-traceability inventory** — per document: classification
   (keep / rewrite / archive-complete / extract-then-archive / rehome / new-for-gap), traceability
   resolution, health, and the verifying evidence. Structured data, the restructure's work-list.
2. **Cross-cutting pattern findings** — one section per relational angle, each finding verified.
3. **Taxonomy grounding** — the document types and relationship edges that empirically exist, with
   frequency and evidence — the survey-gated input that refines the intent-graph contract.
4. **Coverage ledger** — what was read, by how many agents, what was dropped or bounded, and why.

## Prerequisites

- **The `plan` node-schema as the conformance lens** — `blocking` for the conformance dimension;
  a draft v0 lens suffices to start (the survey refines it). Minimum shippable shape without the
  final schema: run the holistic + specialist + relational passes against a draft lens and mark
  conformance findings provisional.
- **The strategic-choice registry** — `blocking` for the plans↔choices traceability pass (the
  resolution target). Already signed off (the 12 bets).
- **The observe-mode plan extractor** — `beneficial`, not `blocking`: it adds a deterministic
  mechanical-conformance pass; the qualitative and relational passes proceed without it.

## Boundaries and non-goals

- **Reads and classifies; does not restructure.** No moves, archives, rewrites, or deletions.
- **Presupposes no outcomes.** It does not assume the taxonomy, the classifications, the collection
  shape, or the patterns; it discovers them. The draft node-schema is a lens, not a verdict.
- **Trusts no subagent unverified.** See §Critical-analysis discipline.
- **No PII** in any output.

## Strategic acceptance criteria

- Pass 0 enumerated the full target set, with a coverage ledger naming every dropped/unclassified
  surface.
- Every plan has ≥3 verified agent reads and a classification with evidence.
- Every cross-cutting relational angle has run and been verified.
- The completeness critic looped to dry (two clean rounds).
- The four outputs exist as dated reports, structured and `file:line`-cited; the taxonomy grounding
  is usable to refine the contract; the inventory is usable as the restructure work-list.
- No unverified claim appears in any output.

## Risks

| Risk | Mitigation |
| --- | --- |
| Subagents over-claim ("complete"/"orphaned"/"dead") | Adversarial verification gate; default-refuted on uncertainty; first-hand source check |
| Scale (~550 × ≥3) silently truncated | Concurrency-capped fan-out; coverage ledger; log every bound; loop-until-dry |
| The draft lens biases the taxonomy | Lens is explicitly provisional; let the estate speak; the taxonomy is an output, not an input |
| Divergent counts across agents | Re-derive, never average; cite the derivation |
| Findings stay in chat, not the repo | Outputs are dated reports; the survey is not done until they are authored |

## Promotion trigger (→ `current/`)

Promote and run when the `plan` node-schema lens exists (ratified, or a v0 draft) and the
strategic-choice registry is available. At promotion, finalise the finding schemas, the specialist
routing table, the workflow scripts, and the report directory; readiness-review with
`assumptions-expert` (proportionality of the agent fan-out) and `docs-adr-expert`.
