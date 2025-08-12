/**
 * MCP tool handler implementation
 * Integrates MCP tools with curriculum organ
 */

import type { Logger } from '@oaknational/mcp-moria';
import type { CurriculumOrganContract, OrganSearchLessonsParams } from '../../../chorai/stroma';
import {
  validateKeyStage,
  validateSubject,
  validateLessonSlug,
} from '../validators/tool-validators';

/**
 * MCP operation error for consistent error handling
 */
export class McpOperationError extends Error {
  readonly operation: string;
  readonly cause?: unknown;

  constructor(message: string, operation: string, cause?: unknown) {
    super(message);
    this.name = 'McpOperationError';
    this.operation = operation;
    this.cause = cause;
  }
}

/**
 * Helper to check if value has property
 */
function hasProperty<K extends PropertyKey>(obj: unknown, key: K): obj is Record<K, unknown> {
  return typeof obj === 'object' && obj !== null && key in obj;
}

/**
 * Type guard for search lessons parameters
 */
function isSearchLessonsParams(params: unknown): params is ToolParameters['oak-search-lessons'] {
  return hasProperty(params, 'query') && typeof params.query === 'string';
}

/**
 * Type guard for get lesson parameters
 */
function isGetLessonParams(params: unknown): params is ToolParameters['oak-get-lesson'] {
  return hasProperty(params, 'lessonSlug') && typeof params.lessonSlug === 'string';
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
 * Handle search lessons tool
 */
async function handleSearchLessons(
  params: unknown,
  curriculumOrgan: CurriculumOrganContract,
): Promise<unknown> {
  if (!isSearchLessonsParams(params)) {
    throw new Error('Invalid parameters for oak-search-lessons');
  }
  const searchLessonsParams: OrganSearchLessonsParams = {
    q: params.query,
  };

  // Validate and add optional parameters
  if (params.keyStage) {
    searchLessonsParams.keyStage = validateKeyStage(params.keyStage);
  }

  if (params.subject) {
    searchLessonsParams.subject = validateSubject(params.subject);
  }

  return await curriculumOrgan.searchLessons(searchLessonsParams);
}

/**
 * Handle get lesson tool
 */
async function handleGetLesson(
  params: unknown,
  curriculumOrgan: CurriculumOrganContract,
): Promise<unknown> {
  if (!isGetLessonParams(params)) {
    throw new Error('Invalid parameters for oak-get-lesson');
  }
  const validatedSlug = validateLessonSlug(params.lessonSlug);
  return await curriculumOrgan.getLesson(validatedSlug);
}

/**
 * Execute tool based on name
 */
async function executeToolOperation<T extends ToolName>(
  toolName: T,
  params: ToolParameters[T],
  curriculumOrgan: CurriculumOrganContract,
): Promise<unknown> {
  switch (toolName) {
    case 'oak-search-lessons':
      return await handleSearchLessons(params, curriculumOrgan);
    case 'oak-get-lesson':
      return await handleGetLesson(params, curriculumOrgan);
    case 'oak-list-key-stages':
      return await curriculumOrgan.listKeyStages();
    case 'oak-list-subjects':
      return await curriculumOrgan.listSubjects();
    default: {
      const exhaustiveCheck: never = toolName;
      throw new Error(`Unknown tool: ${String(exhaustiveCheck)}`);
    }
  }
}

/**
 * Creates MCP tool handler that integrates with curriculum organ
 */
export function createToolHandler(curriculumOrgan: CurriculumOrganContract, logger: Logger) {
  const toolLogger = logger.child ? logger.child({ component: 'mcp-tool-handler' }) : logger;

  return async function handleTool<T extends ToolName>(
    toolName: T,
    params: ToolParameters[T],
  ): Promise<unknown> {
    toolLogger.debug('Executing tool', { toolName, params });

    try {
      return await executeToolOperation(toolName, params, curriculumOrgan);
    } catch (error) {
      toolLogger.error('Tool execution failed', { toolName, error });
      throw new McpOperationError(`MCP tool ${toolName} failed`, toolName, error);
    }
  };
}
