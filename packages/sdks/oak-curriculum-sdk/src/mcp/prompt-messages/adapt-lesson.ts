/**
 * Message generator for the adapt-lesson prompt.
 *
 * @remarks One module per prompt keeps every generator file within the
 * ESLint max-lines budget as the prompt estate grows. All content is
 * static and added at SDK compile time, complying with schema-first
 * principles.
 */

import type { PromptMessage } from '../mcp-prompt-types.js';

/**
 * Generates messages for the adapt-lesson prompt — the evidence-grounded lesson
 * adaptation workflow (EEF Toolkit). Evidence-grounding is how Oak adapts
 * lessons; the prompt instructs the agent to convert the free-form topic/year
 * group into finite EEF tool inputs, ground options in the EEF evidence, and
 * preserve caveats and attribution. The agent is the only reasoner (ADR-191).
 *
 * @param args - User-provided arguments (topic, yearGroup)
 * @returns Messages guiding the model through evidence-grounded adaptation
 */
export function getAdaptLessonMessages(
  args: Readonly<Record<string, string | undefined>>,
): PromptMessage[] {
  const topic = args.topic ?? 'the topic';
  const yearGroup = args.yearGroup ?? 'the year group';

  return [
    {
      role: 'user',
      content: {
        type: 'text',
        text: `I'm adapting a lesson on "${topic}" for ${yearGroup} and want it grounded in the EEF Teaching and Learning Toolkit evidence.

Call get-curriculum-model first for domain definitions and tool guidance. MCP tool names may appear prefixed (e.g. mcp__<id>__get-eef-evidence); match them by the suffix.

Workflow:
1. Use search (scope "lessons") to find the Oak material for "${topic}", narrowed to ${yearGroup}: the search tool filters lessons by year group through its "year" parameter — pass the year number (for example, year: 4 for "Year 4"), not a key stage, so results match ${yearGroup}. Then get the lesson summary, transcript, and quiz.
2. Surface the pedagogical signals: take the lesson slug of the lesson you selected in step 1 and call get-misconception-graph({ lessonSlugs: ["<lesson-slug-from-step-1>"] }) — it returns the recorded misconceptions (with teacher responses) for that lesson; read them alongside the quiz and transcript. For the prerequisite gaps, take the unit slug of the same lesson and call get-prior-knowledge-graph({ unitSlugs: ["<unit-slug-from-step-1>"] }) — it returns the bounded prior-knowledge subgraph for that unit.
3. Name the pedagogical move each signal raises (this is your reasoning, not EEF data). Pick the real EEF strands for those moves from the strand index in the eef://interpretation resource — convert your free-form reasoning into the finite strand ids and axis values the tool accepts at the boundary.
4. Call get-eef-evidence with those finite inputs. Read eef://interpretation when applying the evidence so you interpret impact, cost, evidence strength, and caveats faithfully.
5. Give me the adapted lesson as evidence-calibrated options and trade-offs — not a single recommendation or selection, with a short rationale for each. The decision is mine to make.

Preserve attribution and caveats: cite EEF for the evidence (organisation, the EEF page link, and the named authors), and credit Oak National Academy under the Open Government Licence v3.0 for any reproduced Oak material, linking to the lesson. If you produce slides, worksheets, or quizzes, meet WCAG 2.2 AA (alt text, heading/reading order, contrast).`,
      },
    },
  ];
}
