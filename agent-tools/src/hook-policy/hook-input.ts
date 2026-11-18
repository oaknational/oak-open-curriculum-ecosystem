import { isAbsolute } from 'node:path';

import { isJsonObject, type JsonObject } from '../core/json.js';

import { parseApplyPatchContent } from './apply-patch-content.js';
import type { ContentChange } from './types.js';

/**
 * Parse JSON text from Claude's hook stdin payload.
 */
export function parseHookInput(hookInputText: string): unknown {
  try {
    return JSON.parse(hookInputText);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown JSON parse failure.';
    throw new Error(`Claude PreToolUse hook input was not valid JSON: ${message}`, {
      cause: error,
    });
  }
}

/**
 * Resolve the tool input object from various Claude hook payload shapes.
 */
function resolveInput(hookInput: unknown): JsonObject {
  if (!isJsonObject(hookInput)) {
    throw new Error('Claude PreToolUse hook input was not an object.');
  }
  if (isJsonObject(hookInput.tool_input)) {
    return hookInput.tool_input;
  }
  if (isJsonObject(hookInput.toolInput)) {
    return hookInput.toolInput;
  }
  return hookInput;
}

/**
 * Extract incoming content, prior-content references, and the target file path
 * from a Claude Edit or Write tool payload.
 *
 * For Edit: `new_string` is the incoming content; `old_string` is the prior;
 * `file_path` (when present) anchors path-scoped checks.
 *
 * For Write: `content` is the incoming content; `file_path` is both the
 * scope anchor AND the prior-content reference. The extraction step never
 * reads the file itself — the read is delegated to the caller.
 *
 * The hook blocks patterns that are being ADDED — present in the new content
 * but absent from the prior content. This allows edits that preserve an
 * already-present pattern without blocking.
 */
export function extractContentChange(hookInput: unknown): ContentChange {
  const input = resolveInput(hookInput);

  if (typeof input.new_string === 'string') {
    const prior = typeof input.old_string === 'string' ? input.old_string : '';
    const filePathInfo: { filePath?: string } =
      typeof input.file_path === 'string' ? { filePath: input.file_path } : {};
    return { newContent: input.new_string, priorContent: prior, ...filePathInfo };
  }

  if (typeof input.content === 'string') {
    if (typeof input.file_path === 'string') {
      return {
        newContent: input.content,
        priorContent: '',
        filePath: input.file_path,
        priorFilePath: input.file_path,
      };
    }
    return { newContent: input.content, priorContent: '' };
  }

  throw new Error('Claude PreToolUse hook input did not include writable content.');
}

/**
 * Extract every content change carried by a PreToolUse payload.
 *
 * Claude's Edit/Write payloads carry `tool_input` as an object and yield
 * exactly one change. Copilot CLI's inherited-hook route (observed live
 * 2026-07-25, CLI 1.0.75) presents `tool_name: "Edit"` with `tool_input` as a
 * raw `apply_patch` program string covering one or more files; every file
 * section in that program is a change the policy must evaluate. A payload
 * that matches neither shape, or a structurally invalid patch program,
 * throws — the guard's fail-closed path.
 */
export function extractContentChanges(hookInput: unknown): readonly ContentChange[] {
  if (isJsonObject(hookInput) && typeof hookInput.tool_input === 'string') {
    const parsed = parseApplyPatchContent(hookInput.tool_input);
    if (!parsed.ok) {
      throw new Error(`PreToolUse apply_patch payload was invalid: ${parsed.error.message}`, {
        cause: parsed.error,
      });
    }
    return parsed.value;
  }
  return [extractContentChange(hookInput)];
}

/**
 * Resolve final new/prior content using an injected prior-content reader.
 *
 * A moved file's whole content enters its destination, so the source's text and
 * the move's added lines are all new there, against an empty prior: the hunks
 * alone would show a pure move as no change at all, and a removed line must not
 * mask an identical line that stays. The guard never applies the patch, so a
 * move that also removes a marker is refused too (fail closed). A source with no
 * absolute place, or one that cannot be read, throws rather than pass unread
 * content.
 */
export function resolveContentPair(
  change: ContentChange,
  readPriorContent: (filePath: string) => string | null,
): { newContent: string; priorContent: string } {
  if (change.movedFromPath !== undefined) {
    const source = isAbsolute(change.movedFromPath) ? readPriorContent(change.movedFromPath) : null;
    if (source === null) {
      throw new Error('apply_patch move source could not be placed and read; failing closed.');
    }
    return { newContent: [source, change.newContent].join('\n'), priorContent: '' };
  }
  if (change.priorFilePath === undefined) {
    return { newContent: change.newContent, priorContent: change.priorContent };
  }

  return {
    newContent: change.newContent,
    priorContent: readPriorContent(change.priorFilePath) ?? '',
  };
}

/**
 * Read all text from a stream.
 */
export async function readStreamText(stdin: AsyncIterable<string | Buffer>): Promise<string> {
  let text = '';

  for await (const chunk of stdin) {
    text += chunk.toString();
  }

  return text;
}
