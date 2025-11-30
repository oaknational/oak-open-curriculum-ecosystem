/**
 * Validation and execution for the get-help tool.
 *
 * This module handles input validation and dispatches to the
 * appropriate help content generator.
 */

import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { getToolSpecificHelp, getGeneralHelp } from './help-content.js';

/**
 * Input parameters for get-help tool.
 */
interface GetHelpInput {
  /** Optional tool name to get specific help for */
  readonly tool_name?: string;
}

/**
 * Type guard for valid help input object.
 *
 * Uses proper type narrowing without type assertions.
 *
 * @param value - Value to check
 * @returns True if value is a valid GetHelpInput
 */
function isValidHelpInput(value: unknown): value is GetHelpInput {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  // Check tool_name property if present - TypeScript narrows after 'in' check
  if ('tool_name' in value) {
    if (typeof value.tool_name !== 'string') {
      return false;
    }
  }
  return true;
}

/**
 * Validation result for help input.
 */
type HelpValidationResult =
  | { readonly ok: true; readonly value: GetHelpInput }
  | { readonly ok: false; readonly message: string };

/**
 * Validates input for the get-help tool.
 *
 * @param input - Raw input from tool invocation
 * @returns Validation result with typed value or error message
 */
export function validateHelpArgs(input: unknown): HelpValidationResult {
  if (input === undefined || input === null) {
    return { ok: true, value: {} };
  }
  if (!isValidHelpInput(input)) {
    return { ok: false, message: 'Invalid input: expected object with optional tool_name string' };
  }
  return { ok: true, value: input };
}

/**
 * Runs the get-help tool, returning tool usage guidance.
 *
 * If tool_name is provided, returns specific help for that tool.
 * Otherwise returns general server guidance including all categories,
 * workflows, and tips.
 *
 * @param input - Optional input parameters
 * @returns CallToolResult containing help as JSON text
 */
export function runHelpTool(input: GetHelpInput): CallToolResult {
  if (input.tool_name) {
    return getToolSpecificHelp(input.tool_name);
  }

  return getGeneralHelp();
}
