/**
 * MCP tool handler implementation
 * Integrates MCP tools with curriculum organ
 */

import type { Logger } from '@oaknational/mcp-moria';
import type { CurriculumOrgan } from '../../curriculum';
import type { SearchLessonsParams } from '../../../chorai/stroma';
import {
  validateKeyStage,
  validateSubject,
  validateLessonSlug,
} from '../validators/tool-validators';

/**
 * MCP operation error for consistent error handling
 */
export class McpOperationError extends Error {
  constructor(
    message: string,
    public readonly operation: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'McpOperationError';
  }
}

/**
 * MCP tool name type
 */
export type ToolName =
  | 'oak-search-lessons'
  | 'oak-get-lesson'
  | 'oak-list-key-stages'
  | 'oak-list-subjects';

/**
 * Tool parameter types
 */
export interface ToolParameters {
  'oak-search-lessons': {
    query: string;
    keyStage?: string;
    subject?: string;
  };
  'oak-get-lesson': {
    lessonSlug: string;
  };
  'oak-list-key-stages': Record<string, never>;
  'oak-list-subjects': Record<string, never>;
}

/**
 * Creates MCP tool handler that integrates with curriculum organ
 */
export function createToolHandler(curriculumOrgan: CurriculumOrgan, logger: Logger) {
  const toolLogger = logger.child({ component: 'mcp-tool-handler' });

  return async function handleTool<T extends ToolName>(
    toolName: T,
    params: ToolParameters[T],
  ): Promise<unknown> {
    toolLogger.debug('Executing tool', { toolName, params });

    try {
      switch (toolName) {
        case 'oak-search-lessons': {
          const searchParams = params as ToolParameters['oak-search-lessons'];
          const searchLessonsParams: SearchLessonsParams = {
            q: searchParams.query,
          };

          // Validate and add optional parameters
          if (searchParams.keyStage) {
            searchLessonsParams.keyStage = validateKeyStage(searchParams.keyStage);
          }

          if (searchParams.subject) {
            searchLessonsParams.subject = validateSubject(searchParams.subject);
          }

          return await curriculumOrgan.searchLessons(searchLessonsParams);
        }

        case 'oak-get-lesson': {
          const lessonParams = params as ToolParameters['oak-get-lesson'];
          const validatedSlug = validateLessonSlug(lessonParams.lessonSlug);
          return await curriculumOrgan.getLesson(validatedSlug);
        }

        case 'oak-list-key-stages': {
          return await curriculumOrgan.listKeyStages();
        }

        case 'oak-list-subjects': {
          return await curriculumOrgan.listSubjects();
        }

        default: {
          const exhaustiveCheck: never = toolName;
          throw new Error(`Unknown tool: ${exhaustiveCheck}`);
        }
      }
    } catch (error) {
      toolLogger.error('Tool execution failed', { toolName, error });
      throw new McpOperationError(`MCP tool ${toolName} failed`, toolName, error);
    }
  };
}
