# Next-session brief — EEF user-value trace

**For**: a fresh session (any platform). Self-contained; read this in full before
starting. **Authored**: 2026-05-31 at owner direction; re-cut the same day to make
the governing frame unmissable. **Scope owner**: the `eef` thread.

## The governing frame — read this first; it controls everything below

The EEF Teaching and Learning Toolkit data is the **source of truth**. It is a
complete, authoritative body of evidence that already provides a real, specific
value: rigorous population-level evidence about teaching and school approaches,
with honest caveats, expressed on EEF's own native axes — the approach (a strand),
the EEF priority, the key stage / phase, and the impact / cost / evidence-strength
leverage. That value exists in the data now, whole.

We hold three things: **Oak API tools, Oak search tools, and the EEF data.** We are
building tools for the EEF data. Every tool exists for one reason: **to provide
user value** — to make an AI assistant measurably more useful to a teacher.

The plan is the **map for surfacing the value of that truth into our user-facing
tools.** The plan is downstream of the data. So the direction of correction is
fixed and one-way:

> **We do not twist the EEF data to fit the plan. We correct the plan to surface
> the value the data provides.**

This is the discipline the whole trace serves. The data never falls short of the
plan; where they disagree, the plan is wrong. The data is whole — it is never
missing, thin, partial, or insufficient *for the plan's purpose*. If you ever
write "the data lacks X", "the corpus doesn't carry Y", or "the data doesn't
support Z", you have inverted the frame — turn the sentence around. Every finding
takes one of three shapes, and all three correct the **plan**, never the data:

- **The plan over-claims** — it assumes a value the data does not provide (the
  retired topic→strand join is the worked example: EEF is not topic-indexed).
  Correct the plan down to the value the data does provide — that value is always
  real. Surface it; and where a deliverable builds past what surfacing it
  requires, cut the deliverable.
- **The plan under-surfaces** — a tool, schema, or contract drops or hides value
  the data does provide (for example a projection that discards key findings,
  mechanisms, or caveats). Correct the plan and the tool to surface it.
- **The plan over-builds** — a deliverable builds machinery that is not what
  surfacing the data's value requires, or duplicates value an existing Oak tool
  already surfaces. Correct the plan by cutting or shrinking the deliverable. The
  verdict lands on the plan: "this build is more than surfacing the value
  requires." Never justify a cut by calling the data's value thin or partial — the
  data is whole; only the plan can over-build.

## Why this session exists

The earlier design keyed an EEF tool on curriculum `subject`/`key_stage`/`topic`
and tried to match those to EEF strands. That could never deliver value: EEF
strands are pedagogical approaches and school decisions, not topic-indexed
content, so the join the tool needed was never in the data. The fault was in the
**tool design**, not the data. The 2026-05-31 reframe corrected the **plan** to
surface what the data actually provides — relevance by **pedagogical move** on
EEF's finite native axes.

Had we traced the value the data provides, end to end, before committing a tool
shape, we would have seen the original tool was surfacing nothing. This session
does that trace deliberately, as a standing guard: follow the value the data
already holds all the way to the teacher, and correct the plan wherever it fails
to carry that value across.

## The trace to perform

Walk the user journey end to end and, at each step, grounded in the real corpus
and the real Oak tools, answer:

1. **What value are we providing, to whom?** Name the teacher, the moment, and the
   concrete benefit the EEF evidence brings.
2. **Why does EEF provide it?** What does the EEF evidence add that Oak material
   alone does not?
3. **How does it work?** The workflow: Oak's tools (including the misconception and
   prior-knowledge graphs, the lesson's quiz and text) surface a pedagogical signal
   → the agent names the pedagogical move → the EEF tool returns the evidence on
   that move → the assistant adapts the Oak material with caveats preserved. Trace
   each hop and show **how the value the data holds reaches the user** through it:
   which real strand carries the evidence for that move, what that evidence says,
   at which key stage, with which caveats — read from the corpus, not the plan's
   description of it.
4. **How do we build it?** Map the value path onto the deliverables (D2 typed
   foundation → D4/D5 graph + ops → D6 MCP surface → D7 proof) and the graph
   foundation. For each deliverable, confirm it is necessary to carry the value to
   the user, and that the set together is sufficient to surface it.
5. **What steps do we need to take to achieve the build?** The concrete sequence,
   with the value the data provides re-confirmed at each step before that step
   commits a contract or a tool shape.
6. **How do we know we have succeeded?** The value proof — what observable teacher
   outcome, measured how, against the EEF data as the independent ground truth.

## What a finding looks like

Every finding is a **plan correction**, expressed as one of the three shapes above
(over-claim → correct the plan down to the real value; under-surface → correct the
plan/tool to surface the value; over-build → cut or shrink the deliverable that
builds past what surfacing the value requires). Ground each finding in a specific
strand id + field, or a specific plan line, so it is checkable. Name each as an owner-facing
plan correction. Do not engineer around a mismatch, and never alter, augment,
reshape, or "fill in" the EEF data — it is the fixed truth the plan must serve.

Keep the reframed frame intact: EEF relevance is by pedagogical move on EEF's
finite native axes; `subject`/`topic` are Oak's domain and are simply not EEF
inputs. Describe what the EEF tool takes; do not re-litigate that boundary.

## Read first

- `eef-graph-tool-completion.plan.md` — the plan being traced; `## Value And
  Impact` (especially "What EEF is, and how relevance works") is the value root.
- `eef-graph-predecision-research.report.md` — the code-grounded detail layer
  (seams, candidate forms, considerations) beneath the plan.
- `packages/sdks/graph-corpus-sdk/src/eef-strands/eef-toolkit.external-data.ts` —
  **the source of truth.** Read the strands to see the value the data provides
  (impact, cost, evidence strength, key findings, mechanisms, caveats,
  `school_context_relevance`, `related_strands`).
- `packages/sdks/graph-corpus-sdk/src/eef-strands/strand-lookup.ts` — the typed
  foundation derived from the corpus.
- `.agent/memory/operational/threads/eef.next-session.md` — thread state.

## Output

A value-trace document (under `.agent/reports/` per the reports convention, or in
the thread, owner's call) that walks the six questions and, for each hop:

- states the value the EEF data provides at that hop and how it reaches the user;
- names every plan correction needed — each as an over-claim, under-surface, or
  over-build fix, grounded in a strand field or plan line.

It also states whether the plan's deliverables are necessary and sufficient to
carry the value to the teacher. The trace **informs** the plan; it does not
silently rewrite it. The owner ratifies which corrections land and when.

## Boundaries

- No implementation code.
- Do not reopen the reframe or the data-shape doctrine; trace value within them.
- Never alter, augment, reshape, or work around the EEF data; it is the fixed
  source of truth the plan must serve.
- Findings are plan corrections surfaced for the owner, not silent plan rewrites.
