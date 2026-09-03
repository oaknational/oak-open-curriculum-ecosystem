/**
 * Agent guidance: building or auditing a curriculum map.
 *
 * Creation-oriented guidance (retained; served only when the allowlist
 * turns it live). Derived from the \`oak-curriculum-mapper\` skill
 * (oaknational/oak-skills): ordering grounded in Oak's threads and
 * stated prior knowledge with national-curriculum coverage checked, the
 * source skill's attribution carried (Oak data under OGL v3.0).
 */

import type { AgentGuidanceResource } from './guidance-resource-types.js';

export const CURRICULUM_MAPPING_GUIDANCE: AgentGuidanceResource = {
  name: 'guidance-curriculum-mapping',
  uri: 'docs://oak/guidance/curriculum-mapping.md',
  title: 'Agent guidance: curriculum mapping',
  description:
    "Workflow guidance for the assistant: build or audit a curriculum map — unit order across a year or key stage — grounded in Oak's threads, the prior knowledge each unit states it assumes, and national-curriculum coverage.",
  mimeType: 'text/markdown',
  annotations: { priority: 0.4, audience: ['assistant'] },
  lastModified: '2026-09-02T00:00:00Z',
  _meta: {
    provenance:
      'Derived from the oak-curriculum-mapper skill (oaknational/oak-skills); keep the two in step.',
  },
};

export const CURRICULUM_MAPPING_GUIDANCE_MARKDOWN = `# Curriculum mapping — agent workflow guidance

Follow this workflow when a teacher wants to build (or audit) a curriculum
map for a subject at a key stage — what is taught, in what order — with the
order grounded in how Oak National Academy builds concepts over time; the
order is the product. Substitute the teacher's own subject, key stage, and
(if named) year group where the placeholders appear.

Call \`get-curriculum-model\` first for domain definitions and tool
guidance. MCP tool names may appear prefixed
(e.g. \`mcp__<id>__get-threads\`); match them by the suffix.

## Workflow

1. **Scope it.** Use \`browse-curriculum\` or \`get-subjects\` to confirm
   what Oak has for the subject at the key stage.
2. **Pull the backbone.** Use \`get-threads\` then
   \`get-thread-progressions\` for the threads in the subject and their
   units ordered across years — threads are the vertical backbone, so the
   map should advance them coherently rather than presenting disconnected
   topics.
3. **Order the units** so every prerequisite is taught before the units
   that depend on it: take the unit slugs from step 2 and call
   \`get-prior-knowledge-graph({ unitSlugs: ["<unit-slug>"] })\` for each
   unit's stated prior knowledge, and check the statements are met by
   earlier units.
4. **Check coverage.** Use \`get-units-summary\` for the national
   curriculum statements each unit covers; confirm coverage is complete
   and surface gaps or unintended overlaps.
5. **Balance breadth** across threads and adjust the weighting.
6. **If auditing an existing map**, benchmark it against steps 2-4 and
   flag, with located evidence: prerequisite-after-dependent breaks,
   orphan units, coverage gaps, and thread imbalance — most valuable fix
   first.

## Output

Output the map as a table (term/half-term | unit | thread(s) | builds on |
national curriculum coverage) with a short rationale for the order, the
coverage summary, and what is core versus what the teacher should adapt —
the map is a model to localise, not a mandate. KS4 is more complex (tiers
and exam boards); science at KS4 must be traversed via sequences
(\`get-sequences\`), not the flat lessons route. Re-fetch live data rather
than trusting cached examples, and render any document with real table
headers and a logical reading order (WCAG 2.2 AA).

## Attribution

Oak's threads, sequencing, and coverage data are Oak National Academy's,
published under the Open Government Licence v3.0
(https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/),
which requires attribution — credit Oak National Academy and link to the
relevant thread or unit on thenational.academy in anything derived from
it. The approach follows Oak's curriculum threads (after Mary Myatt) and
Oak's six curriculum principles (Emma McCrea, "Our 6 principles guiding
our approach to curriculum", Oak, 2023).
`;
