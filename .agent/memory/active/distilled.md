---
fitness_line_target: 120
fitness_line_limit: 180
fitness_char_limit: 12000
fitness_line_length: 100
drain_strategy: "Extract settled entries to permanent docs (ADRs, PDRs, governance, READMEs)"
merge_class: curated-learning-register
fitness_content_role: drainable-buffer
fitness_rationale: >-
  Lowered 2026-05-25 after owner-requested processing through `oak-consolidate-docs`.
  The active file carries the conservation role, graduation pointers, and held
  validation entries. Falsifiability: if future napkin rotations add high-signal
  learning that has no stable permanent home, preserve it first and revise the
  envelope by substance rather than trimming the lesson.
---

# Distilled Cross-Session Lessons

Refined cross-session lessons, conserved between napkin rotation and graduation to
a permanent home. Each entry earns its place by being specific, actionable,
non-obvious, and terse.

Entries below are staged cross-session lessons whose substance is conserved but
whose final home is not yet fixed (a graduation candidate surfaced to the owner, or
a single-instance technique awaiting a second instance). New napkin rotations append
below.

## Parsing interleaved/parallel tool output: key by a stable prefix, cross-check sums

When parsing stateful logs from a parallel/interleaved runner (e.g. `turbo` running
tasks concurrently, with CR line-endings), "nearest-header" file attribution is unsafe:
interleaving and CR endings can misattribute lines, producing phantom aggregates (a
"307 warnings in one file" that was really a misparse — the workspace's true total was
77). Cure: key the stateful parse by the **stable workspace/task prefix** the runner
emits, and **cross-check** per-file sums against the gate's authoritative per-workspace
totals as an independent checksum. Single-instance debugging tactic (2026-06-19, Siren
mends Rudder); staged for a second instance to confirm the general shape before
graduating to a pattern. Sibling: [`tool-output-framing-bias`](patterns/tool-output-framing-bias.md).

## An indiscriminate-rule warning count is a set of cause-classes, not N independent problems

When a broad/indiscriminate lint or analysis rule reports a large count (e.g. ~1000
no-throw warnings), the count is NOT N independent problems — it is a handful of
cause-classes (code-type × cause × meta-cause). Lead with the holistic landscape, not
piecemeal per-site next-steps; distrust per-site classifications (they proved unreliable —
mislabels happen). The remediation reshape that follows is investigation-first (survey the
cause-classes) rather than convert-all. Single-instance lesson (2026-06-19, Siren mends
Rudder, no-throw remediation; the owner had to drag the landscape out before the reshape);
staged for a second instance before graduating to a pattern. Sibling:
[`tool-output-framing-bias`](patterns/tool-output-framing-bias.md) and the parsing-interleaved
entry above (both: the shape of the aggregate misleads).

## Decision locus: product strategy is the owner's; engineering/architecture is collaborative

Calibrated by the owner across the strategy sessions (2026-06-20). Two loci, distinct:
**product-level** strategy (diagnosis / how-we-win / measures / feature shaping) is the
owner's — input and questions stay valuable, but I do not decide; **engineering strategy /
architecture / technical approach** is **collaborative, case-by-case** — propose, reason,
push for long-term excellence, never go passive. The failure mode **oscillates**:
over-claim (deciding product strategy from partial grounding) ↔ over-suppress (marking
owner-owned substance "deferred" and doing zero analysis — abdication, not deference). The
stable point is neither pole: it is the **read-gate** (gate every substantive claim on
"have I read the source this rests on?") plus **locus-awareness**, never silence. Source:
2026-06-20 (Kayak seeks Coral, owner re-calibration). Refines `user-collaboration.md`
§Risk-and-Decisions; sibling: [[passive-guidance-loses-to-artefact-gravity]],
[[feedback_ground_convenient_claims]].

## For an intent-alignment check, source intent from the principal — records are a drift-prone projection

When asked whether a big apparatus (plan, schema, survey, pipeline, restructure) will deliver
the owner's *intent*, do not reconstruct "the intent" from the records and grade the apparatus
against that. The records are a projection authored across many sessions each grounding on the
last, so records and apparatus can be internally consistent yet *collectively adrift* from the
principal — a circular check. Elicit the intent from the principal (what success looks like;
the feared failure); treat records as hypothesis-to-verify against that source. A
context-isolated reader can verify artefact *consistency*, never intent-*fidelity*. Reading
records *feels* like grounding — that fluency is the tripwire to re-ground at the source. The
same pathology can sit one level down in the apparatus (measuring the model, not the intent);
pair every form/conformance acceptance with a substance gate. Source 2026-06-21 (Ganymede
herds Penumbra); worked artefact: `vision-strategy-and-plan-estate.plan.md` Body-3 substance
re-aim. Graduation candidate: PDR. Sibling: [[passive-guidance-loses-to-artefact-gravity]].

## Decision records state current truth, not a journey

Fold a change into an ADR/PDR as its **current state** — rewrite the affected clauses to
say what is true now. Do not add "previously X, now refines to Y" amendment narrative; git
history is the provenance of the change. Applied 2026-06-22 (Orbit rides Horizon) folding the
PDR-112 memotype clarification as current-state. Distinct from
[[no-moving-targets-in-permanent-docs]] (that bans drifting *values*; this bans journey
*narrative*). Graduation candidate: a rule operationalising ADR/PDR authoring conventions.
Source: prior-session owner correction, promoted from the per-user buffer.

## Knowledge surfaces are curated suggestions to a judging agent, not control-flow

A skill, register, or routing pointer is read by a judging agent that decides what serves the
moment — it is guidance, not a branch the system must execute. So a skill suggesting another
skill carries no loop/cycle risk, and a reviewer's *lens* (the frame it judges from) matters
as much as its facts. Applied 2026-06-22 framing onboard-me Branch F's primer hand-off as
"a suggestion to your judgement, not a gate". Graduation candidate: PDR clause or pattern.
Source: prior-session owner correction, promoted from the per-user buffer.

## Preserve the value-rationale (why-it-matters) at handoff, not only the what and how

A plan's user stories carry *why it matters* — the most easily lost and most valuable layer.
At completion and handoff, analyse each served story's disposition and conserve its *why*
into the permanent home (skill description/body, ADR/PDR Context, README purpose lines), not
only the *what* (acceptance met) and *how* (mechanism). Partially homed in PDR-011 (grounded
execution knowledge) and the consolidate/handoff value-rationale step; this is the sharper
standalone formulation. Source: prior-session owner correction, promoted from the per-user
buffer.
