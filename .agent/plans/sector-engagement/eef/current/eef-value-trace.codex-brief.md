# Next-session brief — EEF user-value trace

**For**: a fresh session (any platform). Self-contained; read this in full before
starting. **Authored**: 2026-05-31 at owner direction, after the EEF value reframe
landed in the plan. **Scope owner**: the `eef` thread.

## Why this session exists

The EEF plan was reframed on 2026-05-31. The earlier design keyed an EEF tool on
curriculum `subject`/`key_stage`/`topic` and tried to match those to EEF strands.
That could never work: EEF strands are pedagogical approaches and school
decisions, not topic-indexed content — the data never supported the envisioned
join. **Had we traced the user journey and its value end to end first, we would
have seen the tools as designed were never possible.** This session does that
trace now, deliberately, as a standing guard against building tools the data
cannot support.

This is a value-trace, not implementation. Trace the provision of user value
through the whole plan and confirm the corpus actually supports each step.

## The trace to perform

Walk the user journey end to end and answer, at each step, grounded in the real
corpus and the real Oak tools:

1. **What value are we providing, to whom?** Name the teacher, the moment, and the
   concrete benefit.
2. **Why does EEF provide it?** What does evidence-calibration add that Oak
   material alone does not?
3. **How does it work?** The workflow: Oak's tools (including the misconception
   and prior-knowledge graphs) surface a pedagogical signal → the agent names the
   pedagogical move → the EEF tool returns the evidence on that move → the
   assistant adapts the Oak material with caveats preserved. Trace each hop and
   confirm the **data supports it**: does a real strand actually carry usable
   evidence for that move, at that key stage, with honest caveats?
4. **How do we build it?** Map the value path onto the deliverables (D2 typed
   foundation → D4/D5 graph + ops → D6 MCP surface → D7 proof) and the graph
   foundation. Confirm each deliverable is necessary to the value and sufficient
   together.
5. **What steps do we need to take to achieve the build?** The concrete sequence,
   with the data-support checkpoint built into each.
6. **How do we know we have succeeded?** The value proof — what observable teacher
   outcome, measured how, against what independent ground truth.

## The discipline (the reason for the trace)

At every hop, the question is "does the data support this value?" not "can we
build this tool." If a hop assumes a capability the corpus does not carry
(e.g. topic-level relevance, per-pupil claims, guarantees), surface it as a value
gap, not an engineering task. The reframe already caught one such gap; expect
others. Name them for the owner; do not engineer around them.

Keep the reframed frame: EEF relevance is by pedagogical move on EEF-native
finite axes; subject/topic are Oak's domain and simply not EEF inputs (no need to
mention or guard them — describe what the EEF tool does take).

## Read first

- `eef-graph-tool-completion.plan.md` — the reframed plan; `## Value And Impact`
  (especially "What EEF is, and how relevance works") is the value root.
- `eef-graph-predecision-research.report.md` — the code-grounded detail layer
  (seams, candidate forms, risk register).
- `packages/sdks/graph-corpus-sdk/src/eef-strands/eef-toolkit.external-data.ts` —
  the real corpus: read enough strands to ground the data-support checks.
- `packages/sdks/graph-corpus-sdk/src/eef-strands/strand-lookup.ts` — the typed
  foundation.
- `.agent/memory/operational/threads/eef.next-session.md` — thread state.

## Output

A value-trace document (under `.agent/reports/` per the reports convention, or in
the thread, owner's call) that walks the six questions, flags every value gap
where the data does not support an assumed step, and names whether the plan's
deliverables are necessary and sufficient for the traced value. Do not edit the
plan in this session unless the owner directs; the trace informs the plan, it does
not silently rewrite it.

## Boundaries

- No implementation code.
- Do not reopen the reframe or the data-shape doctrine; trace value within them.
- Surface value gaps as owner decisions, not engineering work-arounds.
