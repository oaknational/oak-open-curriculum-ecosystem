/**
 * Message generators for MCP prompt responses.
 *
 * Each function produces an array of messages that guide the model
 * to use the appropriate tools in the correct order for a workflow.
 *
 * @remarks Extracted from mcp-prompts.ts to keep file sizes within
 * ESLint max-lines limits. All content is static and added at SDK
 * compile time, complying with schema-first principles.
 */

import type { PromptArgs } from './mcp-prompts.js';

/**
 * Message content for prompt responses.
 */
interface PromptMessageContent {
  readonly type: 'text';
  readonly text: string;
}

/**
 * Message in a prompt response.
 */
export interface PromptMessage {
  readonly role: 'user' | 'assistant';
  readonly content: PromptMessageContent;
}

/**
 * Generates messages for the find-lessons prompt.
 *
 * @param args - User-provided arguments (topic, optional keyStage)
 * @returns Messages guiding the model to search with scope "lessons"
 */
export function getFindLessonsMessages(args: PromptArgs): PromptMessage[] {
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

/**
 * Generates messages for the lesson-planning prompt.
 *
 * @param args - User-provided arguments (topic, yearGroup)
 * @returns Messages guiding the model through a full lesson planning flow
 */
export function getLessonPlanningMessages(args: PromptArgs): PromptMessage[] {
  const topic = args.topic ?? 'the topic';
  const yearGroup = args.yearGroup ?? 'the year group';

  return [
    {
      role: 'user',
      content: {
        type: 'text',
        text: `I'm planning a lesson on "${topic}" for ${yearGroup}. Please help me gather materials.

Call get-curriculum-model first for domain definitions, concept relationships, and tool usage guidance.

Steps:
1. Use search with scope "lessons" to search for lessons on "${topic}" appropriate for ${yearGroup}
2. Select the most relevant lesson
3. Get the lesson summary for learning objectives and keywords
4. Get the lesson transcript to understand the content delivery
5. Get quiz questions for assessment ideas
6. Get available assets (slides, worksheets)
7. Use download-asset to generate clickable download links for any assets the user wants

Please provide:
- Learning objectives from the lesson
- Key vocabulary/keywords
- A summary of the lesson structure
- Quiz questions that could be used for assessment
- Clickable download links for requested resources (use download-asset)`,
      },
    },
  ];
}

/**
 * Generates messages for the explore-curriculum prompt.
 *
 * @param args - User-provided arguments (topic, optional subject)
 * @returns Messages guiding the model to use explore-topic for broad discovery
 */
export function getExploreCurriculumMessages(args: PromptArgs): PromptMessage[] {
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

/**
 * Generates messages for the learning-progression prompt.
 *
 * @param args - User-provided arguments (concept, subject)
 * @returns Messages guiding the model to map learning progressions via threads
 */
export function getLearningProgressionMessages(args: PromptArgs): PromptMessage[] {
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
2. Use get-thread-progressions for the full progression graph
3. Use get-prerequisite-graph for unit-level dependencies
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
