/**
 * Message generator for the continue-progression prompt.
 *
 * @remarks One module per prompt keeps every generator file within the
 * ESLint max-lines budget as the prompt estate grows. All content is
 * static and added at SDK compile time, complying with schema-first
 * principles.
 */

import type { PromptMessage } from '../mcp-prompt-types.js';

/**
 * Generates messages for the continue-progression prompt — the position-anchored
 * entry point. The teacher states where their class is (subject, year group,
 * what was just covered) and the workflow resolves the next step from Oak's
 * curriculum sequence, checks readiness via the prior-knowledge graph,
 * anticipates the upcoming misconceptions, then chains into the
 * lesson-planning prompt for the resolved topic — planning substance stays
 * single-sourced there (the S3 reconciliation discipline: extend/merge,
 * never a third planning surface).
 *
 * @param args - User-provided arguments (subject, yearGroup, justCovered,
 *   optional classNotes)
 * @returns Messages guiding the model through the position→next workflow
 */
export function getContinueProgressionMessages(
  args: Readonly<Record<string, string | undefined>>,
): PromptMessage[] {
  const subject = args.subject ?? 'the subject';
  const yearGroup = args.yearGroup ?? 'the year group';
  const justCovered = args.justCovered ?? 'the last topic we covered';
  const classNotes = args.classNotes;
  const classNotesLine = classNotes ? `\n\nNotes on how the class did: ${classNotes}` : '';
  const classNotesCheck = classNotes
    ? ' Check the list against my class notes above and flag anything they may not have secured.'
    : '';

  return [
    {
      role: 'user',
      content: {
        type: 'text',
        text: `I teach ${subject} to ${yearGroup}. My class just finished "${justCovered}". Plan what comes next, building on what they have covered.${classNotesLine}

Call get-curriculum-model first for domain definitions and tool guidance. MCP tool names may appear prefixed (e.g. mcp__<id>__get-thread-progressions); match them by the suffix.

Workflow:
1. Resolve the position. Use search with scope "units" to find the Oak unit matching "${justCovered}" in ${subject}: search({ query: "${justCovered}", scope: "units", subject: "${subject}" }). If the unit is unclear, search scope "lessons" too, keeping the subject filter and narrowed by the search tool's "year" parameter — pass the year number (for example, year: 4 for "Year 4") so results match ${yearGroup}. If more than one unit plausibly matches, present each candidate with its unit and learning thread and ask me to confirm my class's position — never select silently. Note the confirmed unit's slug and the thread it belongs to.
2. Derive what comes next. Take the thread slug from step 1 and call get-thread-progressions({ threadSlug: "<thread-slug-from-step-1>" }) for the year-ordered unit progression; the unit that follows my class's confirmed position is the candidate next step. KS4 is more complex (tiers and exam boards); science at KS4 must be traversed via sequences (get-sequences), not the flat lessons route.
3. Check readiness. Take the next unit's slug from step 2 and call get-prior-knowledge-graph({ unitSlugs: ["<next-unit-slug-from-step-2>"] }) — its assumed prior knowledge is exactly what my class should now have secured. Present it as a checkable readiness list, each item phrased so I can verify it against what we actually covered.${classNotesCheck}
4. Anticipate misconceptions. Call get-misconception-graph({ unitSlugs: ["<next-unit-slug-from-step-2>"] }) — the tool takes exactly one anchor mode per call — and summarise the recorded misconceptions and teacher responses for the upcoming content, so I plan around the errors pupils actually make.
5. Build the lesson. Continue with the lesson-planning prompt workflow for the resolved next topic rather than restating it here — planning substance stays in lesson-planning. Use the next unit's teaching year from step 2 for that workflow, since the progression can place the next unit on a different year than my class label; if that year differs from ${yearGroup}, tell me and let me decide which year to plan for. Carry the readiness list and the misconceptions from steps 3-4 into that plan, attribution intact.

The next step is a recommendation grounded in Oak's published sequence, not a mandate — present the reasoning and any near alternatives from the thread; the teaching decision is mine to make.

Attribution: Oak's threads, sequencing, prior-knowledge, and misconception data are Oak National Academy's, published under the Open Government Licence v3.0 (https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/), which requires attribution — credit Oak National Academy and link to the relevant thread or unit on thenational.academy in anything derived from it.`,
      },
    },
  ];
}
