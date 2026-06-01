---
name: "EEF Standalone Evidence Workflows"
overview: "Seed for a follow-on plan covering EEF MCP-app workflows that deliver teacher value without intersecting Oak's curriculum tools — for example a standalone 'what does the evidence say about this approach' decision-support flow, an impact/cost leverage browser, or myth-busting on debunked approaches (learning styles, ability streaming). Captured 2026-05-31 while reframing the teacher cover-lesson plan, which is scoped to the Oak-lesson-adaptation workflow. This plan must be led by clear teacher value for the standalone case."
type: seed
status: future
thread: eef
related_plans:
  - "../current/eef-graph-tool-completion.plan.md"
isProject: false
todos:
  - id: establish-standalone-value
    content: "Establish the teacher value of EEF used on its own, away from an Oak lesson: which decisions a teacher makes where the evidence base alone (approach, priority, impact/cost, evidence strength, caveats, debunked-approach honesty) is the whole value. Output is a ratified value statement, not a tool design."
    status: pending
    depends_on: []
  - id: shape-standalone-workflows
    content: "Once value is ratified, shape the MCP-app workflows that deliver it (prompts, tool calls, resources) reusing the deterministic EEF tool and interpretation resource the teacher plan builds. Name where these differ from the Oak-intersection workflow."
    status: pending
    depends_on: [establish-standalone-value]
---

# EEF Standalone Evidence Workflows (seed)

## Why this plan exists

The teacher cover-lesson plan
([`../current/eef-graph-tool-completion.plan.md`](../current/eef-graph-tool-completion.plan.md))
proves EEF value through the **Oak-lesson-adaptation workflow**: Oak's tools
surface a pedagogical signal, the agent names the move, EEF supplies the evidence.

There is separate, valid value in EEF workflows that **do not** intersect Oak's
curriculum tools at all — a teacher asking the evidence base directly ("is
collaborative learning worth it for this age group?", "what is high-impact for low
effort?", "does catering to learning styles help?"). These run on EEF's own data
and axes, with no Oak lesson in the loop.

This is captured here so it is not lost, and kept out of the teacher plan so each
workflow is led by its own clear value rather than bundled in by association.

## The gate

Do not design these workflows until their teacher value is established and
ratified. When they are built, they reuse the deterministic EEF tool and the
interpretation resource the teacher plan delivers — they do not need a new graph
or data layer.
