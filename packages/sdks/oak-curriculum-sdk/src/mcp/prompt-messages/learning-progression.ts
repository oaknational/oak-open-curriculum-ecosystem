/**
 * Message generator for the learning-progression prompt.
 *
 * @remarks One module per prompt keeps every generator file within the
 * ESLint max-lines budget as the prompt estate grows. All content is
 * static and added at SDK compile time, complying with schema-first
 * principles.
 */

import type { PromptMessage } from '../mcp-prompt-types.js';

/**
 * Generates messages for the learning-progression prompt.
 *
 * @param args - User-provided arguments (concept, subject)
 * @returns Messages guiding the model to map learning progressions via threads
 */
export function getLearningProgressionMessages(
  args: Readonly<Record<string, string | undefined>>,
): PromptMessage[] {
  const concept = args.concept ?? 'the concept';
  const subject = args.subject ?? 'the subject';

  return [
    {
      role: 'user',
      content: {
        type: 'text',
        text: `I want to understand how "${concept}" builds across year groups in ${subject}.

Call get-curriculum-model first for domain definitions and tool guidance.

Please:
1. Use search with scope "threads" to find progression threads: search({ query: "${concept}", scope: "threads", subject: "${subject}" })
2. Take the most relevant thread slug from step 1 and call get-thread-progressions({ threadSlug: "<thread-slug-from-step-1>" }) for that thread's year-ordered unit progression
3. Take the unit slugs of the progression entries from step 2 and call get-prior-knowledge-graph({ unitSlugs: ["<unit-slug-from-step-2>", "<another-unit-slug-from-step-2>"] }) with them for unit-level dependencies
4. Map out:
   - The progression from earliest to latest year group
   - Key prerequisites at each stage
   - How concepts build on previous learning
5. Identify any gaps or conceptual jumps
6. Suggest how to scaffold learning for students who need additional support`,
      },
    },
  ];
}
