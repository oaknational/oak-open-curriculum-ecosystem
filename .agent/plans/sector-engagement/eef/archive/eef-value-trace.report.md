# EEF user-value trace

> **What this is.** The end-to-end trace the
> [`eef-value-trace.codex-brief.md`](../plans/sector-engagement/eef/current/eef-value-trace.codex-brief.md)
> commissions: follow the value the EEF data already holds, hop by hop, to the
> teacher, and name every place the **plan** fails to carry it across. Authored
> 2026-05-31. Grounded by direct read of the corpus
> (`packages/sdks/graph-corpus-sdk/src/eef-strands/eef-toolkit.external-data.ts`,
> 30 strands), `strand-lookup.ts`, the controlling plan
> (`eef-graph-tool-completion.plan.md`, 1796 lines), and the predecision report.

## Governing stance (held throughout)

The EEF data is the fixed whole truth. It is never missing, thin, partial, or
insufficient *for the plan's purpose* — it is what it is, and it carries inherent
value, including EEF's own honest "insufficient evidence" labels. Every finding
below lands on the **plan**, in one of three shapes:

- **over-claim** — the plan assumes value the data does not provide → correct the
  plan down to the real value;
- **under-surface** — a tool/schema/contract drops value the data does provide →
  correct the plan/tool to surface it;
- **over-build** — a deliverable builds machinery beyond what surfacing the data's
  value requires → cut or shrink it. The verdict lands on the plan; the data is
  never called thin.

The findings are owner-facing plan corrections, not silent rewrites. The owner
ratifies which land and when.

---

## Q1 — What value are we providing, to whom?

**The teacher**, adapting or assembling an Oak lesson under time pressure — the
ratified first scenario is the Sunday-night cover lesson (plan 394–397). The
concrete benefit: EEF calibrates *how* the Oak material is adapted with
population-level evidence per pedagogical approach — months of additional
progress, implementation cost, evidence strength, key findings, mechanisms, and
honest caveats.

**The value the data holds at this hop.** Each strand carries, as fixed literal
values: `headline.{impact_months, cost_rating, cost_label, evidence_strength_rating,
evidence_strength_label, headline_summary}`, `definition.{short, full}`,
`key_findings`, `effectiveness.{summary, mechanisms}`, `behind_the_average`
(incl. `by_phase`, `by_subject`, `moderating_factors`),
`closing_the_disadvantage_gap`, `implementation.{key_considerations,
common_pitfalls, digital_technology_application}`, `related_strands`,
`related_guidance_reports`, `tags`, `update_history`, and
`school_context_relevance` (phases, key stages, priorities, `pp_relevance`,
`implementation_requirements`, `behind_the_average_by_phase`, `applications`,
`number_of_studies`). The corpus also holds `meta.caveats` (9 corpus-level
caveats), `methodology` (the impact/cost/evidence scales and the
effect-size→months table), `school_context_schema`, and `uk_context`.

The plan's ratified value claim (plan 399–404) — *"EEF turns curriculum retrieval
into evidence-calibrated lesson adaptation, while preserving professional
judgement and uncertainty"* — is well aligned with what the data provides.

### Findings

- **F1 [under-surface; resolved in the live plan] — V1 must carry the data's full
  per-strand evidence.** This report originally found V1 open and blocking D3's
  output schema. The live plan has since folded the correction into the canonical
  `## Value And Impact` surface: V1 is owner-ratified as the teacher-facing field
  set, including `key_findings`, `effectiveness.mechanisms`,
  `behind_the_average` (incl. `behind_the_average_by_phase`),
  `implementation.common_pitfalls`, the relevant `meta.caveats`, and
  `related_guidance_reports` (see F8). Remaining D1 work is the evidence term
  contract, not re-opening V1. Grounded in corpus strand fields + plan
  `Teacher-facing evidence field set (V1)`.

---

## Q2 — Why does EEF provide it (what Oak alone does not)?

Oak answers *what to teach*; EEF answers *how to teach, and what the evidence says
about a teaching decision* (plan 338–339). Oak's lesson material cannot, by
itself, tell a teacher that task-focused feedback outperforms praise
(`eef-tl-feedback.behind_the_average.moderating_factors`, corpus 548–552), that
metacognition is +8 months for very low cost on extensive evidence
(`eef-tl-metacognition-and-self-regulation.headline`, corpus 830–837), or that
matching teaching to "learning styles" has no supporting evidence
(`eef-tl-learning-styles.key_findings`, corpus 733–738).

**Honest insufficiency and negative findings are first-class value.** The data
tells a teacher where *not* to spend effort:
`eef-tl-aspiration-interventions` (`impact_months: null`,
`evidence_strength_label: 'Insufficient'`, *"raising aspirations alone has little
to no impact"*, corpus 282–301); `eef-tl-learning-styles` (null / Insufficient,
debunked, corpus 721–738). The plan honours this — it requires the assistant to
make weak/partial/absent evidence explicit (plan 419–423). That is correct and
necessary; surfacing EEF's own `'Insufficient'` label *is* surfacing value.

### Findings

- **F2 [under-surface] — confirm the in-scope teacher set keeps the
  myth-/insufficiency-bearing classroom strands.** The plan scopes
  *school-policy / leadership* strands to a follow-on (plan 366–373:
  reducing class size, teaching assistants, setting/streaming, performance pay,
  summer schools, extending school time). `eef-tl-learning-styles` and
  `eef-tl-aspiration-interventions` are **classroom** myths/uncertainties, not
  policy — their "don't waste effort" value is among the highest a cover-lesson
  assistant can give. *Correction:* D1 explicitly confirms these classroom
  insufficiency strands are in the teacher-facing set, so the scope split does not
  silently drop them. Grounded in corpus 282–308, 714–739; plan 366–373.

---

## Q3 — How does it work? (the hops)

The workflow (plan 349–364; D3 default workflow, plan ~944–956): Oak's own tools
raise a pedagogical signal → the agent names the pedagogical move → the EEF tool
returns the evidence on that move (queried by finite EEF keys) → the assistant
adapts the Oak material, caveats preserved.

**Hop 1 — Oak raises a signal.** Every signal source the plan names exists as a
callable Oak tool today (verified against the live MCP server + SDK):
`get-misconception-graph`, `get-prior-knowledge-graph`, `get-lessons-quiz`,
`get-lessons-transcript`, `get-lessons-summary`, `search`. The workflow's first
hop is buildable on real tools. ✓

**Hop 2 — name the pedagogical move.** Agent reasoning (not a tool), optionally
guided by the user-facing prompt (plan 353–358).

**Hop 3 — EEF returns evidence on the move.** The EEF tool's inputs are finite
corpus keys: a strand (approach), an EEF priority, a key stage / phase, and the
impact/cost/evidence leverage selectors (plan 341–347, D3 920–925). Worked,
fully-grounded value paths:

- Misconception signal → move *correct the misconception* → carriers
  `eef-tl-feedback` (impact 6 / cost 1 / Extensive; mechanism *"Can correct
  misconceptions before they become embedded"*, corpus 542; caveat: task/process
  feedback effective, self/praise least, corpus 548–552) and
  `eef-tl-metacognition-and-self-regulation` (impact 8, corpus 830–837). At key
  stage: feedback is KS1–KS4 with `behind_the_average_by_phase` primary 7 /
  secondary 5 (corpus 590–597). The value reaches the teacher whole.
- Weak-prerequisite signal → move *mastery / oral language* → `eef-tl-mastery-learning`
  (impact 5 / cost 1 / **Limited** evidence — the caveat is itself the value,
  corpus 747–753) and `eef-tl-oral-language-interventions` (impact 6 / Extensive,
  EYFS–KS2, corpus 1042–1088).

**Hop 4 — adapt Oak material, caveats preserved** (plan 387–388, 419–423).

### Findings

- **F3 [over-claim] — two workflow examples name EEF "strands" that the corpus
  does not contain.** Plan 353–357 reads *"misconception → metacognition, explicit
  instruction, feedback"* and *"a quiz → EEF retrieval-practice / feedback."* The
  30-strand corpus has **no `explicit instruction` strand and no
  `retrieval-practice` strand** (verified against the full strand list). Because
  the EEF tool's inputs are finite *strand keys* (plan 341–347, 920–925), an
  example that names a non-existent approach mis-instructs the implementer about
  what keys exist — the same class of error as the retired topic→strand join.
  *Correction (down to the real value):* keep "explicit instruction" and
  "retrieval practice" as agent-side *move* vocabulary, but map each example move
  to the real strand id(s) that carry its evidence — e.g. quiz →
  `eef-tl-feedback` + `eef-tl-metacognition-and-self-regulation`; misconception →
  `eef-tl-feedback` + `eef-tl-metacognition-and-self-regulation` +
  `eef-tl-reading-comprehension-strategies`. Make explicit in the plan that the
  *move* names are not EEF keys; only strand ids / priorities / phases are.
  Grounded: corpus strand list (30, neither present); plan 353–357, 341–347.

- **F4 [under-surface] — "at which key stage" needs the phase-differentiated
  fields, not just the headline average.** The brief's Q3 asks the evidence "at
  which key stage." The data answers this precisely:
  `behind_the_average_by_phase` (feedback primary 7 / secondary 5, corpus 590–597;
  homework primary 2 / secondary 5, corpus 672–679; one-to-one primary 6 /
  secondary 4; peer-tutoring primary 5 / secondary 7) and `applications`
  (feedback written 5 / oral 7, corpus 598–605). *Correction:* V1 / the output
  schema include `behind_the_average_by_phase` and `applications` where present, so
  the evidence answers *at which key stage*. Grounded: corpus fields above; plan
  343 ("key stage / phase" axis).

---

## Q4 — How do we build it? Are the deliverables necessary and sufficient?

Verdicts per deliverable, against the single test: *is this what surfacing the
data's value to the teacher requires, and is the set together sufficient?*

- **D2 typed raw foundation — NECESSARY.** Verbatim impact/cost/evidence/caveats
  can only reach the teacher unwidened if types flow from the `as const` corpus
  (Decisions 4/5; plan 813–901). Necessary, and a necessary part of sufficiency.

- **D3 MCP surface — NECESSARY.** The tool + interpretation resource + prompt is
  how the value reaches an AI host (plan 903–1067). Necessary.

- **D4 / D5 graph layer — NECESSARY (owner-ratified foundation).** The graph tools
  are the deliberate, ratified substrate for Oak's open-education data sources; EEF
  is the first consumer and pathfinder, with the misconception,
  prerequisite-knowledge, and Oak-ontology sources to follow (plan D4). EEF's
  operations — fetch a strand by id, filter by EEF-native axis (priority, key
  stage / phase, impact/cost), follow `related_strands` one hop — are specified
  against the shared graph-core primitives with `TNodeId = EefStrandId` carrying
  the exact ids through inputs, results, and errors (plan D4/D5). The corpus's
  exact-id relationships (`StrandByStrandId[Id]`, `related_strands` endpoints) are
  preserved by the graph-native view. Necessary; in scope; settled.

- **D6 MCP composition — NECESSARY.** [under-surface] D6 wires `outputSchema`
  through to `registerTool`/`registerAppTool` (`handlers.ts:185-196`) so the
  `structuredContent` carrying the evidence validates and reaches the host — the
  last hop that puts the value in front of the teacher. The plan already requires
  this (plan 1297–1302); the trace confirms it is load-bearing for value, not just
  protocol hygiene.

- **D7 value proof — NECESSARY; widen the proof to cover honest limits (F7).**

- **F8 [under-surface] — guidance reports are teacher value the payload carries.**
  `related_guidance_reports` (on 7 strands — e.g.
  `eef-tl-feedback → "Teacher Feedback to Improve Pupil Learning"`, corpus 556–561)
  are the teacher's route to EEF's deeper guidance. *Correction (resolved, landed
  in D4):* model them as a `guidance_report` node kind with a typed strand→report
  edge, deduplicated — the same report is shared by `eef-tl-one-to-one-tuition`
  (corpus 987–991) and `eef-tl-teaching-assistant-interventions` (corpus
  1759–1763), so it is one node with an edge from each strand. This gives the
  teacher a navigable per-strand route to the deeper guidance and is the
  heterogeneous node-kind + typed-edge pattern the graph foundation carries.

**Sufficiency.** With V1 closed to the full field set (F1/F4), the guidance-report
disposition surfacing (F8), and the outputSchema path extended (D6), the full set
D2 → D3 → D4 → D5 → D6 → D7 is **sufficient** to carry EEF's value to the teacher
on the ratified graph foundation.

---

## Q5 — What steps, in what sequence?

The plan's order is sound: D0 (done) → D1 (value) → D2 → D3 → D4 → D5 → D6 → D7,
re-confirming value before each contract locks.

- **F5 [sequencing; resolved for V1, still relevant as D3 guard] — V1 is the
  lynchpin.** D3's output schema could not finalise before V1. The live plan has
  now resolved V1 with the full teacher-value field set — headline, key findings,
  mechanisms, phase-differentiated impact, caveats, guidance reports — so D3
  binds the output schema to the ratified value set, not to the deleted cap. The
  remaining guard is that D3/D6 must keep using that ratified set rather than
  reopening or shrinking it.

- **F6 [reconcile at D1] — the "leverage lens" and the "no teacher-replacing
  selection" rule meet here.** The data fully supports the *"high-impact for low
  effort"* lens (plan 344–345): every strand has `impact_months` + `cost_rating` +
  `evidence_strength_rating` (e.g. metacognition 8/1/4, reading-comprehension
  7/1/3, feedback 6/1/4). But V3 forbids teacher-replacing selection/ranking (plan
  425–428). *Correction:* D1 states the lens surfaces impact/cost/evidence as
  comparable **facts and options**, never as a ranked "do this." A real line to
  hold, not a fault — name it so D3 builds the lens as sortable facts, not a
  recommendation.

---

## Q6 — How do we know we succeeded?

D7's value proxy (plan 1373–1391): an MCP-client E2E round trip plus a
scenario-level assertion that a known strand's exact corpus values (caveat text,
evidence strength, cost, impact) appear **verbatim** in the assistant-facing
payload, sourced through the typed chain (not duplicated fixture text), plus
telemetry. Measured against the EEF data as independent ground truth. This is the
right shape of proof.

### Findings

- **F7 [under-surface in the proof] — prove the honest-limits value, not only the
  high-impact value.** D7 currently pins "a known real strand's exact corpus
  values" (plan 1373–1380); the natural choice is a high-impact strand. The value
  the brief and plan most distinctively claim includes *honest insufficiency*
  (plan 419–423). *Correction:* the D7 verbatim assertion also exercises an
  `Insufficient`/`null`-impact strand (e.g. `eef-tl-aspiration-interventions` or
  `eef-tl-learning-styles`), proving the "don't waste effort" caveat reaches the
  teacher intact. And assert the **absence** of teacher-replacing/single-answer
  language (V3, plan 425–428) — the value contract's negative space is part of
  "succeeded." Grounded: corpus 282–308, 714–739; plan 419–428.

---

## Deliberate non-surfacings (data affordances the plan correctly declines)

Named so they stay conscious decisions, not drift:

- **`school_context_schema` + `recommend_for_context`** (corpus 1824–1926). The
  data carries a context-recommendation affordance taking rich school context
  (`pp_percentage`, `ofsted_grade`, `attainment`, `workforce`, a 15-value
  `priorities` enum). The plan deliberately does **not** build a recommender
  (V3; non-goals plan 1616–1619) — the teacher is the expert. Correct and
  intentional. The per-strand `school_context_relevance` *is* surfaced (as the
  axis-relevance the workflow uses); the corpus-level recommender engine is not.
  Consistent.
- **`uk_context`** (PP funding rates, national averages, KS→year mapping, corpus
  1927–1966) and the **school-policy strands** (reducing class size, performance
  pay, setting/streaming, repeating-a-year at `impact_months: -2`, etc.) are
  school-*leader* value, scoped to the follow-on leadership plan (plan 366–373).
  The corpus stays whole; this plan surfaces the classroom-pedagogy slice. Sound.

---

## Summary of plan corrections for owner ratification

| # | Shape | Correction | Ground |
|---|---|---|---|
| F1 | under-surface; resolved in live plan | V1 closed to the full per-strand evidence field set | corpus fields; live plan V1 section |
| F2 | under-surface | Confirm classroom insufficiency/myth strands (learning-styles, aspiration) stay teacher-facing | corpus 282–308, 714–739; plan 366–373 |
| F3 | over-claim; resolved in live plan | Workflow examples now map agent-side move vocabulary ("explicit instruction", "retrieval-practice") to real strand ids; move names ≠ EEF keys | corpus strand list; live plan D1/D3 workflow text |
| F4 | under-surface | Include `behind_the_average_by_phase` + `applications` so "at which key stage" is answered | corpus 590–605, 672–679; plan 343 |
| F8 | under-surface | Model `related_guidance_reports` as a second `guidance_report` node kind + typed strand→report edge (deduplicated; shared across strands) — landed in D4 | corpus 556–561, 987–991, 1759–1763 |
| F5 | sequencing; resolved for V1 | D3 locks its output schema to the resolved V1 field set (with F1/F4/F8), not the deleted cap | live plan V1 + D3 |
| F6 | reconcile (D1) | Build the leverage lens as comparable facts/options, never a ranked recommendation (V3) | plan 344–345 vs 425–428 |
| F7 | under-surface (proof) | D7 also proves verbatim honest-insufficiency + absence of teacher-replacing language | corpus 282–308; plan 419–428 |

**Overall.** The 2026-05-31 reframe holds: relevance is by pedagogical move on
EEF's native axes throughout, with no topic-indexed residue. The live plan now
folds in the value-trace corrections for V1, classroom insufficiency/myth strands,
real-strand workflow examples, phase/application fields, guidance-report nodes,
the leverage-lens non-recommendation rule, and D7 honest-limits proof. None is a
correction to the data. The data is whole; the plan is what moves. The remaining
D1 discussion is the nature and standard of the evidence term contract.
