/**
 * Agent guidance: planning the next step from where a class is.
 *
 * Creation-oriented guidance (retained; served only when the allowlist
 * turns it live). The teacher states their position (subject, year group,
 * what was just covered) and the workflow resolves the next step from
 * Oak's curriculum sequence, checks readiness via each unit's stated prior
 * knowledge, anticipates the upcoming misconceptions, then plans the resolved
 * topic grounded in the lesson's own summary, transcript, and quiz.
 */

import type { AgentGuidanceResource } from './guidance-resource-types.js';

export const CONTINUE_PROGRESSION_GUIDANCE: AgentGuidanceResource = {
  name: 'guidance-continue-progression',
  uri: 'docs://oak/guidance/continue-progression.md',
  title: 'Agent guidance: continue the progression',
  description:
    "Workflow guidance for the assistant: plan the next step from where the teacher's class is — resolve the next unit from Oak's sequence, build a checkable readiness list, and anticipate the misconceptions to plan around.",
  mimeType: 'text/markdown',
  annotations: { priority: 0.4, audience: ['assistant'] },
  lastModified: '2026-07-23T00:00:00Z',
};

export const CONTINUE_PROGRESSION_GUIDANCE_MARKDOWN = `# Continue the progression — agent workflow guidance

Follow this workflow when a teacher states their position — the subject
they teach, the year group, and what their class just covered (optionally
with notes on how the class did) — and wants to plan what comes next,
building on what the class has covered. Substitute the teacher's own
subject, year group, and just-covered topic where the placeholders appear.

Call \`get-curriculum-model\` first for domain definitions and tool
guidance. MCP tool names may appear prefixed
(e.g. \`mcp__<id>__get-thread-progressions\`); match them by the suffix.

## Workflow

1. **Resolve the position.** Use \`search\` with scope \`"units"\` to find
   the Oak unit matching the just-covered topic in the subject:
   \`search({ query: "<justCovered>", scope: "units", subject: "<subject>" })\`.
   If the unit is unclear, search scope \`"lessons"\` too, keeping the
   subject filter and narrowed by the search tool's \`year\` parameter —
   pass the year number (for example, \`year: 4\` for "Year 4") so results
   match the year group. If more than one unit plausibly matches, present
   each candidate with its unit and learning thread and ask the teacher to
   confirm their class's position — never select silently. Note the
   confirmed unit's slug and the thread it belongs to.
2. **Derive what comes next.** Take the thread slug from step 1 and call
   \`get-thread-progressions({ threadSlug: "<thread-slug-from-step-1>" })\`
   for the year-ordered unit progression; the unit that follows the
   class's confirmed position is the candidate next step. KS4 is more
   complex (tiers and exam boards); science at KS4 must be traversed via
   sequences (\`get-sequences\`), not the flat lessons route.
3. **Check readiness.** Take the next unit's slug from step 2 and call
   \`get-prior-knowledge-graph({ unitSlugs: ["<next-unit-slug-from-step-2>"] })\`
   — its assumed prior knowledge is exactly what the class should now have
   secured. Present it as a checkable readiness list, each item phrased so
   the teacher can verify it against what the class actually covered. If
   the teacher gave class notes, check the list against them and flag
   anything the class may not have secured.
4. **Anticipate misconceptions.** Call
   \`get-misconception-graph({ unitSlugs: ["<next-unit-slug-from-step-2>"] })\`
   — the tool takes exactly one anchor mode per call — and summarise the
   recorded misconceptions and teacher responses for the upcoming content,
   so the teacher plans around the errors pupils actually make.
5. **Build the lesson.** Plan the resolved next topic grounded in Oak's
   own materials: pull the selected lesson's summary
   (\`get-lessons-summary\`) as the model, its transcript
   (\`get-lessons-transcript\`) for content delivery, and its quiz
   (\`get-lessons-quiz\`) for assessment shape. Use the next unit's
   teaching year from step 2, since the progression can place the next
   unit on a different year than the class label; if that year differs
   from the teacher's year group, say so and let the teacher decide which
   year to plan for. Carry the readiness list and the misconceptions from
   steps 3-4 into the plan, attribution intact.

The next step is a recommendation grounded in Oak's published sequence,
not a mandate — present the reasoning and any near alternatives from the
thread; the teaching decision is the teacher's to make.

## Attribution

Oak's threads, sequencing, prior-knowledge, and misconception data are Oak
National Academy's, published under the Open Government Licence v3.0
(https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/),
which requires attribution — credit Oak National Academy and link to the
relevant thread or unit on thenational.academy in anything derived from
it.
`;
