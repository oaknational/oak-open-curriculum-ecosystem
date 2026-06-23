/**
 * Message generator for the find-lessons prompt.
 *
 * @remarks One module per prompt keeps every generator file within the
 * ESLint max-lines budget as the prompt estate grows. All content is
 * static and added at SDK compile time, complying with schema-first
 * principles.
 */

import type { PromptMessage } from '../mcp-prompt-types.js';

/**
 * Generates messages for the find-lessons prompt.
 *
 * @param args - User-provided arguments (topic, optional keyStage)
 * @returns Messages guiding the model to search with scope "lessons"
 */
export function getFindLessonsMessages(
  args: Readonly<Record<string, string | undefined>>,
): PromptMessage[] {
  const topic = args.topic ?? 'the topic';
  const keyStage = args.keyStage;

  const keyStageNote = keyStage ? ` Focus on ${keyStage} content.` : '';
  const keyStageParam = keyStage ? `, keyStage: "${keyStage}"` : '';

  return [
    {
      role: 'user',
      content: {
        type: 'text',
        text: `I want to find lessons about "${topic}".${keyStageNote}

Before searching, call get-curriculum-model for a complete understanding of the curriculum domain model and available tools.

Please:
1. Use search with scope "lessons" to find lessons matching this topic: search({ query: "${topic}", scope: "lessons"${keyStageParam} })
2. Review the results and identify the most relevant lessons
3. For the top 3-5 lessons, provide a brief summary of what each covers
4. Suggest which lesson might be best for different learning objectives
5. Use fetch to get full details for the most promising lesson`,
      },
    },
  ];
}
