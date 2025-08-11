/**
 * MCP tool definitions for Oak Curriculum API
 * Defines the interface between MCP and curriculum organ
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { TOOL_SCHEMA_ENUMS } from '../validators/tool-validators';

/**
 * Search lessons tool definition
 */
export const searchLessonsTool: Tool = {
  name: 'oak-search-lessons',
  description: 'Search for lessons in the Oak Curriculum',
  inputSchema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Search query text',
      },
      keyStage: {
        type: 'string',
        enum: [...TOOL_SCHEMA_ENUMS.keyStages],
        description: 'Optional key stage filter',
      },
      subject: {
        type: 'string',
        enum: [...TOOL_SCHEMA_ENUMS.subjects],
        description: 'Optional subject filter',
      },
    },
    required: ['query'],
  },
};

/**
 * Get lesson tool definition
 */
export const getLessonTool: Tool = {
  name: 'oak-get-lesson',
  description: 'Get detailed information about a specific lesson',
  inputSchema: {
    type: 'object',
    properties: {
      lessonSlug: {
        type: 'string',
        description: 'The unique slug identifier for the lesson',
      },
    },
    required: ['lessonSlug'],
  },
};

/**
 * List key stages tool definition
 */
export const listKeyStages: Tool = {
  name: 'oak-list-key-stages',
  description: 'List all available key stages',
  inputSchema: {
    type: 'object',
    properties: {},
  },
};

/**
 * List subjects tool definition
 */
export const listSubjects: Tool = {
  name: 'oak-list-subjects',
  description: 'List all available subjects',
  inputSchema: {
    type: 'object',
    properties: {},
  },
};

/**
 * All available MCP tools
 */
export const tools = [searchLessonsTool, getLessonTool, listKeyStages, listSubjects] as const;

/**
 * Export tool names type
 */
export type ToolName = (typeof tools)[number]['name'];
