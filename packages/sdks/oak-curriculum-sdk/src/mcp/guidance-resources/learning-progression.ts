/**
 * Agent guidance: understanding how a concept builds across year groups.
 *
 * Navigation guidance (the served live-set): grounds the assistant's
 * progression analysis in Oak's thread and prior-knowledge graph tools.
 */

import type { AgentGuidanceResource } from './guidance-resource-types.js';

export const LEARNING_PROGRESSION_GUIDANCE: AgentGuidanceResource = {
  name: 'guidance-learning-progression',
  uri: 'docs://oak/guidance/learning-progression.md',
  title: 'Agent guidance: learning progression',
  description:
    "Workflow guidance for the assistant: understand how a concept builds across year groups by walking progression threads and checking each unit's stated prior knowledge.",
  mimeType: 'text/markdown',
  annotations: { priority: 0.4, audience: ['assistant'] },
  lastModified: '2026-09-02T00:00:00Z',
};

export const LEARNING_PROGRESSION_GUIDANCE_MARKDOWN = `# Learning progression — agent workflow guidance

Follow this workflow when a teacher wants to understand how a concept
builds across year groups in a subject. Substitute the teacher's own
concept and subject where the placeholders appear.

Call \`get-curriculum-model\` first for domain definitions and tool guidance.

1. Use \`search\` with scope \`"threads"\` to find progression threads:
   \`search({ query: "<concept>", scope: "threads", subject: "<subject>" })\`.
2. Take the most relevant thread slug from step 1 and call
   \`get-thread-progressions({ threadSlug: "<thread-slug-from-step-1>" })\`
   for that thread's year-ordered unit progression.
3. Take the unit slugs of the progression entries from step 2 and call
   \`get-prior-knowledge-graph({ unitSlugs: ["<unit-slug-from-step-2>",
   "<another-unit-slug-from-step-2>"] })\` with them for each unit's
   stated prior knowledge.
4. Map out:
   - The progression from earliest to latest year group
   - Key prerequisites at each stage
   - How concepts build on previous learning
5. Identify any gaps or conceptual jumps.
6. Suggest how to scaffold learning for students who need additional
   support.
`;
