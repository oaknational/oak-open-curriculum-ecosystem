/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool Groupings
 * 
 * Groups tools by method and parameter signature.
 * Preserves full relationship between tool names, paths, methods, and parameters.
 */

// Import schema for type extraction
import { schema } from "./api-schema";

/**
 * Tool groupings data structure
 * Contains all tool metadata organized by parameter signature
 */
const TOOL_GROUPINGS_DATA = {
  GET_NO_PARAMS: {
    'oak-get-subjects': {
      toolName: 'oak-get-subjects' as const,
      path: '/subjects' as const,
      method: 'GET' as const,
      pathParams: [
      ] as const,
      queryParams: [
      ] as const,
      grouping: 'GET_NO_PARAMS' as const,
    },
    'oak-get-key-stages': {
      toolName: 'oak-get-key-stages' as const,
      path: '/key-stages' as const,
      method: 'GET' as const,
      pathParams: [
      ] as const,
      queryParams: [
      ] as const,
      grouping: 'GET_NO_PARAMS' as const,
    },
    'oak-get-threads': {
      toolName: 'oak-get-threads' as const,
      path: '/threads' as const,
      method: 'GET' as const,
      pathParams: [
      ] as const,
      queryParams: [
      ] as const,
      grouping: 'GET_NO_PARAMS' as const,
    },
    'oak-get-changelog': {
      toolName: 'oak-get-changelog' as const,
      path: '/changelog' as const,
      method: 'GET' as const,
      pathParams: [
      ] as const,
      queryParams: [
      ] as const,
      grouping: 'GET_NO_PARAMS' as const,
    },
    'oak-get-changelog-latest': {
      toolName: 'oak-get-changelog-latest' as const,
      path: '/changelog/latest' as const,
      method: 'GET' as const,
      pathParams: [
      ] as const,
      queryParams: [
      ] as const,
      grouping: 'GET_NO_PARAMS' as const,
    },
    'oak-get-rate-limit': {
      toolName: 'oak-get-rate-limit' as const,
      path: '/rate-limit' as const,
      method: 'GET' as const,
      pathParams: [
      ] as const,
      queryParams: [
      ] as const,
      grouping: 'GET_NO_PARAMS' as const,
    },
  },
  GET_WITH_ALL_PARAMS: {
    'oak-get-sequences-units': {
      toolName: 'oak-get-sequences-units' as const,
      path: '/sequences/{sequence}/units' as const,
      method: 'GET' as const,
      pathParams: [
        'sequence',
      ] as const,
      queryParams: [
        'year',
      ] as const,
      grouping: 'GET_WITH_ALL_PARAMS' as const,
    },
    'oak-get-sequences-assets': {
      toolName: 'oak-get-sequences-assets' as const,
      path: '/sequences/{sequence}/assets' as const,
      method: 'GET' as const,
      pathParams: [
        'sequence',
      ] as const,
      queryParams: [
        'year',
        'type',
      ] as const,
      grouping: 'GET_WITH_ALL_PARAMS' as const,
    },
    'oak-get-key-stages-subject-assets': {
      toolName: 'oak-get-key-stages-subject-assets' as const,
      path: '/key-stages/{keyStage}/subject/{subject}/assets' as const,
      method: 'GET' as const,
      pathParams: [
        'keyStage',
        'subject',
      ] as const,
      queryParams: [
        'type',
        'unit',
      ] as const,
      grouping: 'GET_WITH_ALL_PARAMS' as const,
    },
    'oak-get-lessons-assets': {
      toolName: 'oak-get-lessons-assets' as const,
      path: '/lessons/{lesson}/assets' as const,
      method: 'GET' as const,
      pathParams: [
        'lesson',
      ] as const,
      queryParams: [
        'type',
      ] as const,
      grouping: 'GET_WITH_ALL_PARAMS' as const,
    },
    'oak-get-key-stages-subject-lessons': {
      toolName: 'oak-get-key-stages-subject-lessons' as const,
      path: '/key-stages/{keyStage}/subject/{subject}/lessons' as const,
      method: 'GET' as const,
      pathParams: [
        'keyStage',
        'subject',
      ] as const,
      queryParams: [
        'unit',
        'offset',
        'limit',
      ] as const,
      grouping: 'GET_WITH_ALL_PARAMS' as const,
    },
    'oak-get-sequences-questions': {
      toolName: 'oak-get-sequences-questions' as const,
      path: '/sequences/{sequence}/questions' as const,
      method: 'GET' as const,
      pathParams: [
        'sequence',
      ] as const,
      queryParams: [
        'year',
        'offset',
        'limit',
      ] as const,
      grouping: 'GET_WITH_ALL_PARAMS' as const,
    },
    'oak-get-key-stages-subject-questions': {
      toolName: 'oak-get-key-stages-subject-questions' as const,
      path: '/key-stages/{keyStage}/subject/{subject}/questions' as const,
      method: 'GET' as const,
      pathParams: [
        'keyStage',
        'subject',
      ] as const,
      queryParams: [
        'offset',
        'limit',
      ] as const,
      grouping: 'GET_WITH_ALL_PARAMS' as const,
    },
  },
  GET_WITH_PATH_PARAMS: {
    'oak-get-lessons-transcript': {
      toolName: 'oak-get-lessons-transcript' as const,
      path: '/lessons/{lesson}/transcript' as const,
      method: 'GET' as const,
      pathParams: [
        'lesson',
      ] as const,
      queryParams: [
      ] as const,
      grouping: 'GET_WITH_PATH_PARAMS' as const,
    },
    'oak-get-lessons-assets-by-type': {
      toolName: 'oak-get-lessons-assets-by-type' as const,
      path: '/lessons/{lesson}/assets/{type}' as const,
      method: 'GET' as const,
      pathParams: [
        'lesson',
        'type',
      ] as const,
      queryParams: [
      ] as const,
      grouping: 'GET_WITH_PATH_PARAMS' as const,
    },
    'oak-get-subject-detail': {
      toolName: 'oak-get-subject-detail' as const,
      path: '/subjects/{subject}' as const,
      method: 'GET' as const,
      pathParams: [
        'subject',
      ] as const,
      queryParams: [
      ] as const,
      grouping: 'GET_WITH_PATH_PARAMS' as const,
    },
    'oak-get-subjects-sequences': {
      toolName: 'oak-get-subjects-sequences' as const,
      path: '/subjects/{subject}/sequences' as const,
      method: 'GET' as const,
      pathParams: [
        'subject',
      ] as const,
      queryParams: [
      ] as const,
      grouping: 'GET_WITH_PATH_PARAMS' as const,
    },
    'oak-get-subjects-key-stages': {
      toolName: 'oak-get-subjects-key-stages' as const,
      path: '/subjects/{subject}/key-stages' as const,
      method: 'GET' as const,
      pathParams: [
        'subject',
      ] as const,
      queryParams: [
      ] as const,
      grouping: 'GET_WITH_PATH_PARAMS' as const,
    },
    'oak-get-subjects-years': {
      toolName: 'oak-get-subjects-years' as const,
      path: '/subjects/{subject}/years' as const,
      method: 'GET' as const,
      pathParams: [
        'subject',
      ] as const,
      queryParams: [
      ] as const,
      grouping: 'GET_WITH_PATH_PARAMS' as const,
    },
    'oak-get-key-stages-subject-units': {
      toolName: 'oak-get-key-stages-subject-units' as const,
      path: '/key-stages/{keyStage}/subject/{subject}/units' as const,
      method: 'GET' as const,
      pathParams: [
        'keyStage',
        'subject',
      ] as const,
      queryParams: [
      ] as const,
      grouping: 'GET_WITH_PATH_PARAMS' as const,
    },
    'oak-get-lessons-quiz': {
      toolName: 'oak-get-lessons-quiz' as const,
      path: '/lessons/{lesson}/quiz' as const,
      method: 'GET' as const,
      pathParams: [
        'lesson',
      ] as const,
      queryParams: [
      ] as const,
      grouping: 'GET_WITH_PATH_PARAMS' as const,
    },
    'oak-get-lessons-summary': {
      toolName: 'oak-get-lessons-summary' as const,
      path: '/lessons/{lesson}/summary' as const,
      method: 'GET' as const,
      pathParams: [
        'lesson',
      ] as const,
      queryParams: [
      ] as const,
      grouping: 'GET_WITH_PATH_PARAMS' as const,
    },
    'oak-get-units-summary': {
      toolName: 'oak-get-units-summary' as const,
      path: '/units/{unit}/summary' as const,
      method: 'GET' as const,
      pathParams: [
        'unit',
      ] as const,
      queryParams: [
      ] as const,
      grouping: 'GET_WITH_PATH_PARAMS' as const,
    },
    'oak-get-threads-units': {
      toolName: 'oak-get-threads-units' as const,
      path: '/threads/{threadSlug}/units' as const,
      method: 'GET' as const,
      pathParams: [
        'threadSlug',
      ] as const,
      queryParams: [
      ] as const,
      grouping: 'GET_WITH_PATH_PARAMS' as const,
    },
  },
  GET_WITH_QUERY_PARAMS: {
    'oak-get-search-transcripts': {
      toolName: 'oak-get-search-transcripts' as const,
      path: '/search/transcripts' as const,
      method: 'GET' as const,
      pathParams: [
      ] as const,
      queryParams: [
        'q',
      ] as const,
      grouping: 'GET_WITH_QUERY_PARAMS' as const,
    },
    'oak-get-search-lessons': {
      toolName: 'oak-get-search-lessons' as const,
      path: '/search/lessons' as const,
      method: 'GET' as const,
      pathParams: [
      ] as const,
      queryParams: [
        'q',
        'keyStage',
        'subject',
        'unit',
      ] as const,
      grouping: 'GET_WITH_QUERY_PARAMS' as const,
    },
  },
} as const;

// Types derived from the data structure
export type ToolGroupingsData = typeof TOOL_GROUPINGS_DATA;
export type GroupingKey = keyof ToolGroupingsData;
export type ToolName = {
  [K in GroupingKey]: keyof ToolGroupingsData[K]
}[GroupingKey];

/**
 * Extract exact metadata types from schema based on tool name
 * These types ensure all fields are fully constrained by the tool name
 */
type ExtractPathForTool<T extends ToolName> = {
  [K in keyof typeof schema.paths]: {
    [M in keyof typeof schema.paths[K]]:
      typeof schema.paths[K][M] extends { operationToolName: T }
        ? K
        : never
  }[keyof typeof schema.paths[K]]
}[keyof typeof schema.paths];

type ExtractMethodForTool<T extends ToolName> = {
  [K in keyof typeof schema.paths]: {
    [M in keyof typeof schema.paths[K]]:
      typeof schema.paths[K][M] extends { operationToolName: T }
        ? Uppercase<M & string>
        : never
  }[keyof typeof schema.paths[K]]
}[keyof typeof schema.paths];

type ExtractMetadataForTool<T extends ToolName> = {
  [K in keyof typeof schema.paths]: {
    [M in keyof typeof schema.paths[K]]:
      typeof schema.paths[K][M] extends { operationToolMetadata: infer Meta }
        ? Meta extends { name: T }
          ? Meta
          : never
        : never
  }[keyof typeof schema.paths[K]]
}[keyof typeof schema.paths];

/**
 * Fully constrained tool metadata interface
 * All fields are determined by the tool name T and grouping G
 */
interface ToolMetadata<T extends ToolName, G extends GroupingKey> {
  toolName: T;
  path: ExtractPathForTool<T>;
  method: ExtractMethodForTool<T>;
  pathParams: ExtractMetadataForTool<T> extends { pathParams: infer P } ? P : readonly [];
  queryParams: ExtractMetadataForTool<T> extends { queryParams: infer Q } ? Q : readonly [];
  grouping: G;
}

/**
 * Type-level filtering - only include tools valid for this grouping
 */
type ToolsForGrouping<G extends GroupingKey> = {
  [T in ToolName as T extends keyof ToolGroupingsData[G] ? T : never]: ToolMetadata<T, G>;
};

/**
 * The complete type structure with bidirectional constraints
 */
type ToolGroupingStructure = {
  [G in GroupingKey]: ToolsForGrouping<G>;
};

/**
 * Export the fully typed TOOL_GROUPINGS
 * Type annotation ensures all fields match schema constraints
 */
export const TOOL_GROUPINGS: ToolGroupingStructure = TOOL_GROUPINGS_DATA;

export type ToolGroupings = typeof TOOL_GROUPINGS;

/**
 * Type guard for tool names
 * Proves at runtime that a value is a valid tool name
 */
export function isToolName(value: unknown): value is ToolName {
  if (typeof value !== "string") return false;
  for (const group of Object.values(TOOL_GROUPINGS)) {
    if (value in group) return true;
  }
  return false;
}