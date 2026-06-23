/**
 * Message generator for the explore-curriculum prompt.
 *
 * @remarks One module per prompt keeps every generator file within the
 * ESLint max-lines budget as the prompt estate grows. All content is
 * static and added at SDK compile time, complying with schema-first
 * principles.
 */

import type { PromptMessage } from '../mcp-prompt-types.js';

/**
 * Generates messages for the explore-curriculum prompt.
 *
 * @param args - User-provided arguments (topic, optional subject)
 * @returns Messages guiding the model to use explore-topic for broad discovery
 */
export function getExploreCurriculumMessages(
  args: Readonly<Record<string, string | undefined>>,
): PromptMessage[] {
  const topic = args.topic ?? 'the topic';
  const subject = args.subject;

  const subjectParam = subject ? `, subject: "${subject}"` : '';

  return [
    {
      role: 'user',
      content: {
        type: 'text',
        text: `I want to explore what Oak has about "${topic}".

Call get-curriculum-model first for domain definitions and tool guidance.

Please:
1. Use explore-topic to search across lessons, units, and threads in parallel: explore-topic({ query: "${topic}"${subjectParam} })
2. Review the topic map and summarise what is available
3. For the most relevant results, drill down using search with a specific scope
4. If there are learning threads, note how the topic develops across year groups
5. Suggest next steps based on what you find`,
      },
    },
  ];
}
