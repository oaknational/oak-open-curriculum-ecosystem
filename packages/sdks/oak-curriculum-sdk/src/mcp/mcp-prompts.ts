/**
 * MCP prompts for Oak Curriculum server.
 *
 * Prompts are user-initiated workflow templates that guide interactions
 * with the MCP server. They appear as slash commands or suggested actions
 * in MCP clients.
 *
 * @remarks Static content per schema-first principles.
 */

/**
 * Prompt argument definition for MCP registration.
 */
interface PromptArgument {
  /** Argument name (used in template) */
  readonly name: string;
  /** Description of what this argument is for */
  readonly description: string;
  /** Whether this argument is required */
  readonly required: boolean;
}

/**
 * Prompt definition for MCP registration.
 */
export interface McpPrompt {
  /** Unique prompt name (used for prompts/get) */
  readonly name: string;
  /** Human-readable description */
  readonly description: string;
  /** Arguments that can be provided when invoking the prompt */
  readonly arguments?: readonly PromptArgument[];
}

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
interface PromptMessage {
  readonly role: 'user' | 'assistant';
  readonly content: PromptMessageContent;
}

/**
 * MCP prompts for common curriculum workflows.
 *
 * These prompts provide guided interactions for teachers using
 * the Oak Curriculum MCP server.
 */
export const MCP_PROMPTS: readonly McpPrompt[] = [
  {
    name: 'find-lessons',
    description:
      'Find curriculum lessons on a specific topic. Searches across all subjects and key stages to find relevant lessons.',
    arguments: [
      {
        name: 'topic',
        description:
          'The topic or concept to search for (e.g., "photosynthesis", "fractions", "World War 2")',
        required: true,
      },
      {
        name: 'keyStage',
        description: 'Optional: Filter by key stage (e.g., "ks1", "ks2", "ks3", "ks4")',
        required: false,
      },
    ],
  },
  {
    name: 'lesson-planning',
    description:
      'Gather materials for planning a lesson on a topic, including objectives, transcript, quiz questions, and resources.',
    arguments: [
      {
        name: 'topic',
        description: 'The topic for the lesson (e.g., "adding fractions", "the water cycle")',
        required: true,
      },
      {
        name: 'yearGroup',
        description: 'The year group (e.g., "Year 4", "Year 9")',
        required: true,
      },
    ],
  },
  {
    name: 'progression-map',
    description:
      'Map how a concept develops across years in a subject, showing progression from early learning to GCSE.',
    arguments: [
      {
        name: 'concept',
        description: 'The concept thread to explore (e.g., "number", "forces", "grammar")',
        required: true,
      },
      {
        name: 'subject',
        description: 'The subject area (e.g., "maths", "science", "english")',
        required: true,
      },
    ],
  },
] as const;

/**
 * Prompt arguments are string values that may or may not be provided.
 *
 * This type accurately reflects that accessing a key may return undefined.
 */
export type PromptArgs = Readonly<Record<string, string | undefined>>;

/**
 * Generates prompt messages for a given prompt name and arguments.
 *
 * Returns an array of messages that guide the model to use the appropriate
 * tools in the correct order for the workflow.
 *
 * @param promptName - Name of the prompt to get messages for
 * @param args - Arguments provided by the user (may be partially filled)
 * @returns Array of prompt messages, or empty array if prompt not found
 */
export function getPromptMessages(promptName: string, args: PromptArgs): PromptMessage[] {
  switch (promptName) {
    case 'find-lessons':
      return getFindLessonsMessages(args);
    case 'lesson-planning':
      return getLessonPlanningMessages(args);
    case 'progression-map':
      return getProgressionMapMessages(args);
    default:
      return [];
  }
}

/**
 * Generates messages for the find-lessons prompt.
 */
function getFindLessonsMessages(args: PromptArgs): PromptMessage[] {
  const topic = args.topic ?? 'the topic';
  const keyStage = args.keyStage;

  const keyStageNote = keyStage ? ` Focus on ${keyStage} content.` : '';

  return [
    {
      role: 'user',
      content: {
        type: 'text',
        text: `I want to find lessons about "${topic}".${keyStageNote}

Please:
1. Use the search tool to find lessons matching this topic${keyStage ? ` with keyStage: "${keyStage}"` : ''}
2. Review the results and identify the most relevant lessons
3. For the top 3-5 lessons, provide a brief summary of what each covers
4. Suggest which lesson might be best for different learning objectives`,
      },
    },
  ];
}

/**
 * Generates messages for the lesson-planning prompt.
 */
function getLessonPlanningMessages(args: PromptArgs): PromptMessage[] {
  const topic = args.topic ?? 'the topic';
  const yearGroup = args.yearGroup ?? 'the year group';

  return [
    {
      role: 'user',
      content: {
        type: 'text',
        text: `I'm planning a lesson on "${topic}" for ${yearGroup}. Please help me gather materials.

Steps:
1. Search for lessons on "${topic}" that are appropriate for ${yearGroup}
2. Select the most relevant lesson
3. Get the lesson summary for learning objectives and keywords
4. Get the lesson transcript to understand the content delivery
5. Get quiz questions for assessment ideas
6. Get available assets (slides, worksheets)

Please provide:
- Learning objectives from the lesson
- Key vocabulary/keywords
- A summary of the lesson structure
- Quiz questions that could be used for assessment
- Links to any downloadable resources`,
      },
    },
  ];
}

/**
 * Generates messages for the progression-map prompt.
 */
function getProgressionMapMessages(args: PromptArgs): PromptMessage[] {
  const concept = args.concept ?? 'the concept';
  const subject = args.subject ?? 'the subject';

  return [
    {
      role: 'user',
      content: {
        type: 'text',
        text: `I want to understand how the concept of "${concept}" develops across years in ${subject}.

Please:
1. Use get-threads to find threads related to "${concept}" in ${subject}
2. Use get-threads-units to get the units in the relevant thread
3. Map out the progression showing:
   - What is taught at each stage
   - How concepts build on previous learning
   - Key prerequisites and dependencies
4. Identify any gaps or jumps in the progression
5. Suggest how to scaffold learning for students who need support`,
      },
    },
  ];
}
