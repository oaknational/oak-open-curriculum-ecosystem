/**
 * MCP Prompts Registration
 *
 * Registers workflow prompts with the MCP server. Prompts are user-initiated
 * templates that guide common interactions with the curriculum tools.
 *
 * Prompts appear as slash commands or suggested actions in MCP clients,
 * helping users initiate structured workflows for common curriculum tasks.
 *
 * ## Zod Version Compatibility
 *
 * This module uses Zod schemas for prompt argument validation via the
 * MCP SDK's `registerPrompt()` method. The MCP SDK v1.23.0+ supports
 * both Zod v3.25+ and Zod v4 through its peer dependency configuration.
 *
 * @see {@link MCP_PROMPTS} - Prompt definitions from SDK
 * @see https://modelcontextprotocol.io/specification/draft/server/prompts
 *
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getPromptMessages } from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import {
  findLessonsArgsSchema,
  lessonPlanningArgsSchema,
  exploreCurriculumArgsSchema,
  learningProgressionArgsSchema,
  eefEvidenceGroundedLessonPlanArgsSchema,
} from './prompt-schemas.js';

/**
 * The EEF prompt registration — co-gated with the
 * `eef-explore-evidence-for-context` tool behind `OAK_CURRICULUM_MCP_EEF_ENABLED`.
 * Added to the served set only when the flag is enabled; the two surfaces are
 * one delivery unit (Definition of Delivery, criterion 4).
 */
const EEF_PROMPT_REGISTRATION = {
  name: 'eef-evidence-grounded-lesson-plan',
  title: 'EEF Evidence-Grounded Lesson Plan',
  description:
    'Design a lesson plan grounded in EEF Toolkit evidence: combines 2-3 evidence-backed approaches drawn from a typed subgraph of EEF strands, with caveats and implementation guidance, into a structured pedagogical sequence.',
  argsSchema: eefEvidenceGroundedLessonPlanArgsSchema,
} as const;

const PROMPT_REGISTRATIONS = [
  {
    name: 'find-lessons',
    title: 'Find Lessons',
    description:
      'Find curriculum lessons on a specific topic. Searches across all subjects and key stages.',
    argsSchema: findLessonsArgsSchema,
  },
  {
    name: 'lesson-planning',
    title: 'Lesson Planning',
    description:
      'Gather materials for planning a lesson on a topic, including objectives and resources.',
    argsSchema: lessonPlanningArgsSchema,
  },
  {
    name: 'explore-curriculum',
    title: 'Explore Curriculum',
    description:
      'Explore what Oak has on a topic across the whole curriculum. Searches lessons, units, and threads in parallel.',
    argsSchema: exploreCurriculumArgsSchema,
  },
  {
    name: 'learning-progression',
    title: 'Learning Progression',
    description:
      'Understand how a concept builds across year groups by searching progression threads and mapping dependencies.',
    argsSchema: learningProgressionArgsSchema,
  },
] as const;

/**
 * Formats SDK prompt messages for MCP response structure.
 *
 * @param promptName - Name of the prompt to get messages for
 * @param args - Arguments object with string values (optional fields may be undefined)
 * @returns MCP-compatible messages structure
 */
function formatPromptResponse(
  promptName: string,
  args: Readonly<Record<string, string | undefined>>,
) {
  const messages = getPromptMessages(promptName, args);
  return {
    messages: messages.map((m) => ({
      role: m.role,
      content: { type: 'text' as const, text: m.content.text },
    })),
  };
}

/** Narrow interface — only `registerPrompt` is used. */
interface PromptRegistrar {
  readonly registerPrompt: McpServer['registerPrompt'];
}

/**
 * Registers MCP prompts for common curriculum workflows.
 *
 * The four base prompts are always registered. The EEF prompt is registered
 * only when `eefEnabled` is true — co-gated with the
 * `eef-explore-evidence-for-context` tool so the prompt+tool unit surfaces
 * together or not at all (Definition of Delivery, criterion 4).
 *
 * Each prompt is registered with an `argsSchema` for type-safe argument
 * validation, a callback that receives validated arguments directly, and
 * message generation delegated to the SDK's `getPromptMessages()`.
 *
 * @param server - MCP server instance (only `registerPrompt` is used)
 * @param eefEnabled - when true, also register the co-gated EEF prompt
 *
 * @example
 * ```typescript
 * const server = new McpServer({ name: 'curriculum', version: '1.0.0' });
 * registerPrompts(server, runtimeConfig.eefEnabled);
 * ```
 */
export function registerPrompts(server: PromptRegistrar, eefEnabled: boolean): void {
  const registrations = eefEnabled
    ? [...PROMPT_REGISTRATIONS, EEF_PROMPT_REGISTRATION]
    : PROMPT_REGISTRATIONS;

  for (const prompt of registrations) {
    const handler = (args: Readonly<Record<string, string | undefined>>) =>
      formatPromptResponse(prompt.name, args);

    server.registerPrompt(
      prompt.name,
      {
        title: prompt.title,
        description: prompt.description,
        argsSchema: prompt.argsSchema,
      },
      handler,
    );
  }
}
