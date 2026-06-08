# Reference the EEF evidence surface as "evidence-informed" grounding

**Upstream**: `oak-skills` (Oak Agent Skills library). **Do not edit `oak-skills`
from this repo** — hand this over to the skills maintainers.
**Status**: open (blocked on the EEF surface shipping live in the Oak Curriculum MCP)
**Priority**: medium (closes the deepest evidence-grounding gap in the skills)
**Affected**: `skills/oak-curriculum-principles-mcp-enabled`, `skills/oak-lesson-builder`.
**Context**: the oak-skills-side half of the EEF↔skills reciprocal announcement
analysed in the educator-experience synthesis seed,
[`external-facing-skills-and-mcp-surfaces-review.report.md`](../../user-experience/educator-end-users/external-facing-skills-and-mcp-surfaces-review.report.md).

## Problem

The MCP now exposes an EEF Teaching and Learning Toolkit surface — the
`get-eef-evidence` tool, the `eef://interpretation` resource, and the
`adapt-lesson` prompt — which is the deepest "evidence-informed" grounding Oak
has (research-derived impact, cost, and evidence-strength per pedagogical
strand). The skills do not reference it:

- `oak-curriculum-principles-mcp-enabled` maps its **Evidence-informed** principle
  to `get-misconception-graph` + teacher tips only.
- `oak-lesson-builder` calls a lesson "evidence-informed" and lists tool grounding
  per component, but never the EEF surface.

This is correct *today* — the EEF surface is feature-flagged and not yet released.
The request is to wire it in **once it is live**.

## Evidence

- `oak-skills` `skills/oak-curriculum-principles-mcp-enabled/SKILL.md` — the
  "Evidence-informed" row of the principle→tool table names only
  `get-misconception-graph` and teacher tips.
- `oak-skills` `skills/oak-lesson-builder/SKILL.md` — the build workflow and
  component→tool table cite misconception and prior-knowledge grounding but no EEF
  evidence step.
- This repo: the EEF surface is the `get-eef-evidence` aggregated tool, the
  `eef://interpretation` resource, and the `adapt-lesson` prompt, gated behind
  `OAK_CURRICULUM_MCP_EEF_ENABLED` (now default-on in this repo's MCP app).

## Suggested approach

Once the EEF surface is released in the deployed Oak Curriculum MCP:

1. In `oak-curriculum-principles-mcp-enabled`, add the EEF surface to the
   **Evidence-informed** principle's grounding: `get-eef-evidence` (+ the
   `eef://interpretation` resource for faithful interpretation).
2. In `oak-lesson-builder`, add an evidence step that retrieves EEF evidence for
   the chosen pedagogical moves and presents it as calibrated options, preserving
   EEF caveats and attribution.
3. Reuse the existing skills conventions already aligned with the EEF surface:
   "options not selections / a model, not a mandate"; attribute the source (EEF
   for the evidence, Oak under OGL v3.0 for Oak material); and the WCAG 2.2 AA
   floor for produced artefacts.

## Impact

The skills route teachers to research-graded evidence for pedagogical choices —
the missing half of "evidence-informed" — without changing the deterministic,
agent-reasons-only contract (the agent selects strands; the tool returns facts).
The `adapt-lesson` prompt is the natural workflow entry point.
