/**
 * Agent guidance: adapting a lesson grounded in EEF Toolkit evidence.
 *
 * Creation-oriented guidance (retained; served only when the allowlist
 * turns it live). The workflow instructs the agent to convert free-form
 * topic/year-group input into finite EEF tool inputs, ground options in
 * the EEF evidence, and preserve caveats and attribution. The agent is
 * the only reasoner (ADR-191).
 */

import type { AgentGuidanceResource } from './guidance-resource-types.js';

export const ADAPT_LESSON_GUIDANCE: AgentGuidanceResource = {
  name: 'guidance-adapt-lesson',
  uri: 'docs://oak/guidance/adapt-lesson.md',
  title: 'Agent guidance: adapt a lesson with EEF evidence',
  description:
    'Workflow guidance for the assistant: adapt an Oak lesson grounded in EEF Teaching and Learning Toolkit evidence, presenting evidence-calibrated options with caveats and attribution intact.',
  mimeType: 'text/markdown',
  annotations: { priority: 0.4, audience: ['assistant'] },
  lastModified: '2026-09-02T00:00:00Z',
};

export const ADAPT_LESSON_GUIDANCE_MARKDOWN = `# Adapt a lesson with EEF evidence — agent workflow guidance

Follow this workflow when a teacher is adapting a lesson on a topic for a
year group and wants it grounded in the EEF Teaching and Learning Toolkit
evidence. Substitute the teacher's own topic and year group where the
placeholders appear.

Call \`get-curriculum-model\` first for domain definitions and tool
guidance. MCP tool names may appear prefixed
(e.g. \`mcp__<id>__get-eef-evidence\`); match them by the suffix.

## Workflow

1. Use \`search\` (scope \`"lessons"\`) to find the Oak material for the
   topic, narrowed to the year group: the search tool filters lessons by
   year group through its \`year\` parameter — pass the year number (for
   example, \`year: 4\` for "Year 4"), not a key stage, so results match
   the year group. Then get the lesson summary, transcript, and quiz.
2. Surface the pedagogical signals: take the lesson slug of the lesson you
   selected in step 1 and call
   \`get-misconception-graph({ lessonSlugs: ["<lesson-slug-from-step-1>"] })\`
   — it returns the recorded misconceptions (with teacher responses) for
   that lesson; read them alongside the quiz and transcript. For the
   prerequisite gaps, take the unit slug of the same lesson and call
   \`get-prior-knowledge-graph({ unitSlugs: ["<unit-slug-from-step-1>"] })\`
   — it returns the unit's stated prior knowledge (the assumed statements).
3. Name the pedagogical move each signal raises (this is your reasoning,
   not EEF data). Pick the real EEF strands for those moves from the
   strand index in the \`eef://interpretation\` resource — convert your
   free-form reasoning into the finite strand ids and axis values the tool
   accepts at the boundary.
4. Call \`get-eef-evidence\` with those finite inputs. Read
   \`eef://interpretation\` when applying the evidence so you interpret
   impact, cost, evidence strength, and caveats faithfully.
5. Give the teacher the adapted lesson as evidence-calibrated options and
   trade-offs — not a single recommendation or selection, with a short
   rationale for each. The decision is theirs to make.

## Attribution and caveats

Preserve attribution and caveats: cite EEF for the evidence
(organisation, the EEF page link, and the named authors), and credit Oak
National Academy under the Open Government Licence v3.0 for any reproduced
Oak material, linking to the lesson. If you produce slides, worksheets, or
quizzes, meet WCAG 2.2 AA (alt text, heading/reading order, contrast).
`;
