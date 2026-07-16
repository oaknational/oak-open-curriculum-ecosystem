/**
 * Strict, privacy-preserving parsing for Claude PostToolBatch hook input.
 *
 * @packageDocumentation
 */

import { isAbsolute, relative, resolve, sep } from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

import { isPlainObject, nonBlankString } from '../core/json-narrowing.js';
import {
  containsNullByte,
  isPotentialSuccessResponse,
  isWriteSuccess,
  safeToolFilePath,
} from './hook-input-policy.js';
import { normalizeToolResponse } from './hook-response.js';
import { type HookChange } from './types.js';

/** Sanitised context and source changes extracted from a Claude hook event. */
export interface ParsedPostToolBatchInput {
  readonly sessionId: string;
  readonly agentId?: string;
  readonly changes: readonly HookChange[];
  readonly unsupportedToolResponse?: true;
}

/** Explicit inputs for parsing the hook stdin boundary. */
export interface ParsePostToolBatchInputOptions {
  readonly rawInput: string;
  readonly projectDir: string;
}

interface RawHookEvent {
  readonly hook_event_name?: unknown;
  readonly session_id?: unknown;
  readonly cwd?: unknown;
  readonly agent_id?: unknown;
  readonly tool_calls?: unknown;
}

interface RawToolCall {
  readonly tool_name?: unknown;
  readonly tool_input?: unknown;
  readonly tool_response?: unknown;
}

interface RawEditInput {
  readonly file_path?: unknown;
  readonly old_string?: unknown;
  readonly new_string?: unknown;
}

interface RawWriteInput {
  readonly file_path?: unknown;
  readonly content?: unknown;
}

interface ParsedContext {
  readonly sessionId: string;
  readonly agentId?: string;
}

interface ExtractedChanges {
  readonly changes: readonly HookChange[];
  readonly unsupportedToolResponse: boolean;
}

const isRawHookEvent = (value: unknown): value is RawHookEvent => isPlainObject(value);
const isRawToolCall = (value: unknown): value is RawToolCall => isPlainObject(value);
const isRawEditInput = (value: unknown): value is RawEditInput => isPlainObject(value);
const isRawWriteInput = (value: unknown): value is RawWriteInput => isPlainObject(value);

/** Parse and validate one raw JSON document received on Claude hook stdin. */
export function parsePostToolBatchInput({
  rawInput,
  projectDir,
}: ParsePostToolBatchInputOptions): Result<ParsedPostToolBatchInput, Error> {
  if (!isAbsolute(projectDir)) {
    return err(new Error('CLAUDE_PROJECT_DIR must be an absolute path'));
  }
  const parsed = parseJson(rawInput);
  if (!parsed.ok) {
    return parsed;
  }
  if (!isRawHookEvent(parsed.value) || parsed.value.hook_event_name !== 'PostToolBatch') {
    return err(new Error('Claude hook input must be a PostToolBatch event'));
  }
  const context = parseContext(parsed.value, projectDir);
  if (!context.ok) {
    return context;
  }
  if (!Array.isArray(parsed.value.tool_calls)) {
    return err(new Error('Claude PostToolBatch input must include a tool_calls array'));
  }
  const extracted = extractChanges(parsed.value.tool_calls);
  if (!extracted.ok) {
    return extracted;
  }
  return ok(toParsedInput(context.value, extracted.value));
}

function toParsedInput(
  context: ParsedContext,
  extracted: ExtractedChanges,
): ParsedPostToolBatchInput {
  return extracted.unsupportedToolResponse
    ? { ...context, changes: extracted.changes, unsupportedToolResponse: true }
    : { ...context, changes: extracted.changes };
}

function parseJson(rawInput: string): Result<unknown, Error> {
  try {
    const parsed: unknown = JSON.parse(rawInput);
    return ok(parsed);
  } catch {
    return err(new Error('Claude hook input is not valid JSON'));
  }
}

function parseContext(event: RawHookEvent, projectDir: string): Result<ParsedContext, Error> {
  const sessionId = nonBlankString(event.session_id);
  if (sessionId === undefined) {
    return err(new Error('Claude PostToolBatch input must include a session_id'));
  }
  const cwd = nonBlankString(event.cwd);
  if (cwd === undefined || !isAbsolute(cwd)) {
    return err(new Error('Claude PostToolBatch input must include an absolute cwd'));
  }
  if (!isInsideOrEqual(projectDir, cwd)) {
    return err(new Error('Claude PostToolBatch cwd must be inside CLAUDE_PROJECT_DIR'));
  }
  if (event.agent_id === undefined) {
    return ok({ sessionId });
  }
  const agentId = nonBlankString(event.agent_id);
  if (agentId === undefined) {
    return err(new Error('Claude PostToolBatch agent_id must be a non-blank string'));
  }
  return ok({ sessionId, agentId });
}

function isInsideOrEqual(rootPath: string, candidatePath: string): boolean {
  const relativePath = relative(resolve(rootPath), resolve(candidatePath));
  return (
    relativePath.length === 0 ||
    !(relativePath === '..' || relativePath.startsWith(`..${sep}`) || isAbsolute(relativePath))
  );
}

function extractChanges(toolCalls: readonly unknown[]): Result<ExtractedChanges, Error> {
  const changes: HookChange[] = [];
  let unsupportedToolResponse = false;
  for (const [index, value] of toolCalls.entries()) {
    if (!isRawToolCall(value) || nonBlankString(value.tool_name) === undefined) {
      return err(new Error(`Claude hook tool_calls[${index}] must be an object with a tool_name`));
    }
    if (!isKnownChangeTool(value.tool_name)) {
      continue;
    }
    const response = normalizeToolResponse(value.tool_response);
    if (response.kind === 'unsupported') {
      unsupportedToolResponse = true;
      continue;
    }
    const change = extractChange(value, index, response.text);
    if (!change.ok) {
      return change;
    }
    if (change.value !== undefined) {
      changes.push(change.value);
    }
  }
  return ok({ changes, unsupportedToolResponse });
}

function isKnownChangeTool(toolName: unknown): toolName is HookChange['tool'] {
  return toolName === 'Edit' || toolName === 'Write';
}

function extractChange(
  toolCall: RawToolCall,
  index: number,
  response: string,
): Result<HookChange | undefined, Error> {
  if (toolCall.tool_name === 'Edit') {
    if (!isPotentialSuccessResponse(response, 'Edit')) {
      return ok(undefined);
    }
    return extractEdit(toolCall, index, response);
  }
  if (toolCall.tool_name === 'Write') {
    if (!isPotentialSuccessResponse(response, 'Write')) {
      return ok(undefined);
    }
    return extractWrite(toolCall, index, response);
  }
  return ok(undefined);
}

function extractEdit(
  toolCall: RawToolCall,
  index: number,
  response: string,
): Result<HookChange | undefined, Error> {
  const value = toolCall.tool_input;
  if (!isRawEditInput(value)) {
    return err(new Error(`Claude hook tool_calls[${index}] has an invalid Edit tool_input`));
  }
  const filePath = safeToolFilePath(value.file_path);
  if (
    filePath === undefined ||
    typeof value.old_string !== 'string' ||
    typeof value.new_string !== 'string'
  ) {
    return err(new Error(`Claude hook tool_calls[${index}] has an invalid Edit tool_input`));
  }
  const successPrefix = `The file ${filePath} has been updated successfully.`;
  if (!response.startsWith(successPrefix)) {
    return ok(undefined);
  }
  if (containsNullByte(filePath, value.old_string, value.new_string)) {
    return ok(undefined);
  }
  return ok({ tool: 'Edit', filePath, oldText: value.old_string, newText: value.new_string });
}

function extractWrite(
  toolCall: RawToolCall,
  index: number,
  response: string,
): Result<HookChange | undefined, Error> {
  const value = toolCall.tool_input;
  if (!isRawWriteInput(value)) {
    return err(new Error(`Claude hook tool_calls[${index}] has an invalid Write tool_input`));
  }
  const filePath = safeToolFilePath(value.file_path);
  if (filePath === undefined || typeof value.content !== 'string') {
    return err(new Error(`Claude hook tool_calls[${index}] has an invalid Write tool_input`));
  }
  if (!isWriteSuccess(response, filePath)) {
    return ok(undefined);
  }
  if (containsNullByte(filePath, value.content)) {
    return ok(undefined);
  }
  return ok({ tool: 'Write', filePath, content: value.content });
}
