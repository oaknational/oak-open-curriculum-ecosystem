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

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { getPromptMessages } from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import { wrapPromptHandler } from '@oaknational/sentry-mcp';
import {
  findLessonsArgsSchema,
  lessonPlanningArgsSchema,
  exploreCurriculumArgsSchema,
  learningProgressionArgsSchema,
} from './prompt-schemas.js';
import type { HttpObservability } from './observability/http-observability.js';

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
 * Each prompt is registered with:
 * - An `argsSchema` for type-safe argument validation
 * - A callback that receives validated arguments directly
 * - Message generation delegated to the SDK's `getPromptMessages()`
 *
 * @param server - MCP server instance
 * @param observability - Observability for prompt handler tracing
 *
 * @example
 * ```typescript
 * const server = new McpServer({ name: 'curriculum', version: '1.0.0' });
 * registerPrompts(server, observability);
 * ```
 */
export function registerPrompts(server: PromptRegistrar, observability: HttpObservability): void {
  const mcpObservation = observability.createMcpObservationOptions();

  for (const prompt of PROMPT_REGISTRATIONS) {
    const handler = (args: Readonly<Record<string, string | undefined>>) =>
      formatPromptResponse(prompt.name, args);

    server.registerPrompt(
      prompt.name,
      {
        title: prompt.title,
        description: prompt.description,
        argsSchema: prompt.argsSchema,
      },
      wrapPromptHandler(prompt.name, handler, mcpObservation),
    );
  }
}
