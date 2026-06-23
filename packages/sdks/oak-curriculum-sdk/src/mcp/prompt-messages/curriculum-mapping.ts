/**
 * Message generator for the curriculum-mapping prompt.
 *
 * @remarks One module per prompt keeps every generator file within the
 * ESLint max-lines budget as the prompt estate grows. All content is
 * static and added at SDK compile time, complying with schema-first
 * principles.
 */

import type { PromptMessage } from '../mcp-prompt-types.js';

/**
 * Generates messages for the curriculum-mapping prompt — build or audit a
 * curriculum map (a long- or medium-term plan of what is taught and in what
 * order). Derived from the `oak-curriculum-mapper` skill
 * (oaknational/oak-skills): ordering grounded in Oak's threads and
 * prior-knowledge graph with national-curriculum coverage checked, the
 * source skill's attribution carried (Oak data under OGL v3.0).
 *
 * @param args - User-provided arguments (subject, keyStage, optional yearGroup)
 * @returns Messages guiding the model through the map build/audit flow
 */
export function getCurriculumMappingMessages(
  args: Readonly<Record<string, string | undefined>>,
): PromptMessage[] {
  const subject = args.subject ?? 'the subject';
  const keyStage = args.keyStage ?? 'the key stage';
  const yearGroup = args.yearGroup;
  const scopeNote = yearGroup ? ` Focus on ${yearGroup}.` : '';

  return [
    {
      role: 'user',
      content: {
        type: 'text',
        text: `I want to build (or audit) a curriculum map for ${subject} at ${keyStage} — what is taught, in what order.${scopeNote} Ground the order in how Oak National Academy builds concepts over time; the order is the product.

Call get-curriculum-model first for domain definitions and tool guidance. MCP tool names may appear prefixed (e.g. mcp__<id>__get-threads); match them by the suffix.

Workflow:
1. Scope it. Use browse-curriculum or get-subjects to confirm what Oak has for ${subject} at ${keyStage}.
2. Pull the backbone. Use get-threads then get-thread-progressions for the threads in ${subject} and their units ordered across years — threads are the vertical backbone, so the map should advance them coherently rather than presenting disconnected topics.
3. Order the units so every prerequisite is taught before the units that depend on it: take the unit slugs from step 2 and call get-prior-knowledge-graph({ unitSlugs: ["<unit-slug>"] }) to check the dependencies.
4. Check coverage. Use get-units-summary for the national curriculum statements each unit covers; confirm coverage is complete and surface gaps or unintended overlaps.
5. Balance breadth across threads and adjust the weighting.
6. If I gave you an existing map to audit, benchmark it against steps 2-4 and flag, with located evidence: prerequisite-after-dependent breaks, orphan units, coverage gaps, and thread imbalance — most valuable fix first.

Output the map as a table (term/half-term | unit | thread(s) | builds on | national curriculum coverage) with a short rationale for the order, the coverage summary, and what is core versus what I should adapt — the map is a model to localise, not a mandate. KS4 is more complex (tiers and exam boards); science at KS4 must be traversed via sequences (get-sequences), not the flat lessons route. Re-fetch live data rather than trusting cached examples, and render any document with real table headers and a logical reading order (WCAG 2.2 AA).

Attribution: Oak's threads, sequencing, and coverage data are Oak National Academy's, published under the Open Government Licence v3.0 (https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/), which requires attribution — credit Oak National Academy and link to the relevant thread or unit on thenational.academy in anything derived from it. The approach follows Oak's curriculum threads (after Mary Myatt) and Oak's six curriculum principles (Emma McCrea, "Our 6 principles guiding our approach to curriculum", Oak, 2023).`,
      },
    },
  ];
}
