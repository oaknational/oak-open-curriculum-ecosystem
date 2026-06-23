/**
 * Message generator for the lesson-planning prompt.
 *
 * @remarks One module per prompt keeps every generator file within the
 * ESLint max-lines budget as the prompt estate grows. All content is
 * static and added at SDK compile time, complying with schema-first
 * principles.
 */

import type { PromptMessage } from '../mcp-prompt-types.js';

/**
 * Generates messages for the lesson-planning prompt — the complete
 * lesson-build workflow. Derived from the `oak-lesson-builder` skill
 * (oaknational/oak-skills): plan and build a teachable lesson grounded in
 * Oak's live curriculum data and six curriculum principles, with the
 * source skill's attribution carried (Oak data under OGL v3.0).
 *
 * @param args - User-provided arguments (topic, yearGroup)
 * @returns Messages guiding the model through the full lesson-build flow
 */
export function getLessonPlanningMessages(
  args: Readonly<Record<string, string | undefined>>,
): PromptMessage[] {
  const topic = args.topic ?? 'the topic';
  const yearGroup = args.yearGroup ?? 'the year group';

  return [
    {
      role: 'user',
      content: {
        type: 'text',
        text: `I'm planning a lesson on "${topic}" for ${yearGroup}. Help me build a complete, teachable lesson the way Oak National Academy does — grounded in Oak's live curriculum data and its six curriculum principles.

Call get-curriculum-model first for domain definitions, concept relationships, and tool usage guidance. MCP tool names may appear prefixed (e.g. mcp__<id>__get-lessons-summary); match them by the suffix.

Workflow:
1. Place the lesson. Use search with scope "lessons" to find Oak's analogue for "${topic}" for ${yearGroup} — narrow by the search tool's "year" parameter (lessons scope), passing the year number (for example, year: 4 for "Year 4") so results match the year group. Select the most relevant lesson, note the learning thread it belongs to, then take its unit slug and call get-prior-knowledge-graph({ unitSlugs: ["<unit-slug>"] }) to confirm the prior knowledge the lesson should assume.
2. Specify the knowledge. Pull the selected lesson's summary (get-lessons-summary) as a model and benchmark, and its transcript (get-lessons-transcript) for the content delivery: draft one "I can…" pupil outcome, 3-5 precise key learning points, and keywords with pupil-facing definitions (get-keywords supplements the lesson's own list). Match Oak's precision.
3. Anticipate misconceptions from real data. Use get-misconception-graph plus the lesson summary's documented misconceptions; plan a diagnostic question and the teacher response around the errors pupils actually make, not guessed ones.
4. Sequence for learning. Open with retrieval of the prior knowledge from step 1; teach in chunks with worked examples; check understanding after each chunk.
5. Assess. Use get-lessons-quiz as the model: a starter quiz on the prerequisites and an exit quiz on the key learning points, with distractors that target the misconceptions so a wrong answer is diagnostic.
6. Gather resources. Get available assets (get-lessons-assets) and use download-asset to generate clickable download links for any assets I want. Components are optional and the data is live — check availability rather than assuming.

Assemble the lesson with: the pupil outcome; where it sits (thread and prior knowledge); key learning points; keywords; the lesson sequence; misconceptions to plan for; the starter quiz and exit quiz; resources and adaptation notes. Keep the same ambitious outcome for all pupils and vary the support, not the destination. Carry through any contentGuidance and supervisionLevel from the lesson summary.

The built lesson is a high-quality starting point, not a script — mark what is core and what I should adapt for my pupils; the teaching decisions are mine. If you produce slides, worksheets, or quizzes, meet WCAG 2.2 AA (alt text, heading and reading order, contrast).

Attribution: the lesson data is Oak National Academy's, published under the Open Government Licence v3.0 (https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/), which requires attribution — credit Oak National Academy and link to the lesson or unit on thenational.academy in anything derived from it. The Oak name and logo are trademarks, not covered by the OGL. This workflow follows Oak's six curriculum principles (Emma McCrea, "Our 6 principles guiding our approach to curriculum", Oak, 2023).`,
      },
    },
  ];
}
