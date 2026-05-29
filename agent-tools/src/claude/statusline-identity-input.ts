/**
 * Pure input parser for the Claude Code statusline adapter.
 *
 * @remarks
 * The Claude Code harness invokes the configured statusline command with a
 * JSON object on stdin. This parser validates that boundary with explicit type
 * guards and extracts the fields the statusline renders (session id for the
 * agent-identity seed, working directory for git queries, model name, and
 * context-window usage). The statusline is a soft surface: empty input, invalid
 * JSON, or a non-object payload short-circuits to a no-op; individual malformed
 * fields are tolerated and simply render as absent segments.
 *
 * @packageDocumentation
 */

import { isPlainObject, nonBlankString } from '../core/json-narrowing.js';

/**
 * Fields extracted from the statusline stdin payload.
 */
export interface StatuslineInputs {
  /** `session_id` — seed for the deterministic agent-identity name. */
  readonly seed: string | undefined;
  /** `workspace.current_dir` (or top-level `cwd`) — base for git queries. */
  readonly cwd: string | undefined;
  /** `model.display_name`. */
  readonly model: string | undefined;
  /** `context_window.used_percentage`. */
  readonly usedPercentage: number | undefined;
}

/**
 * Plan for the Claude Code statusline adapter.
 */
export type StatuslinePlan =
  | { readonly kind: 'noop' }
  | { readonly kind: 'render'; readonly inputs: StatuslineInputs };

/** Expected top-level shape of the statusline stdin payload. */
interface StatuslinePayload {
  readonly session_id?: unknown;
  readonly cwd?: unknown;
  readonly workspace?: unknown;
  readonly model?: unknown;
  readonly context_window?: unknown;
}

/** Expected shape of a nested object field (`workspace`, `model`, `context_window`). */
interface NestedField {
  readonly current_dir?: unknown;
  readonly display_name?: unknown;
  readonly used_percentage?: unknown;
}

/**
 * Translate Claude Code statusline stdin JSON into an execution plan.
 *
 * @param rawJson - The raw JSON text Claude Code passes on stdin.
 * @returns `noop` when the payload is empty, invalid JSON, or not a JSON
 *   object; otherwise `render` with whatever fields could be extracted. Each
 *   field is narrowed from `unknown` through an explicit guard, so a malformed
 *   field renders as absent rather than failing the whole parse.
 *
 * @example
 * ```ts
 * const plan = planStatuslineExecution('{"session_id":"abc-123"}');
 * if (plan.kind === 'render') {
 *   // derive identity from plan.inputs.seed, gather git, render
 * }
 * ```
 */
export function planStatuslineExecution(rawJson: string): StatuslinePlan {
  if (rawJson.length === 0) {
    return { kind: 'noop' };
  }

  const payload = parsePayload(rawJson);
  if (payload === undefined) {
    return { kind: 'noop' };
  }

  return {
    kind: 'render',
    inputs: {
      seed: nonBlankString(payload.session_id),
      cwd: workspaceDir(payload.workspace) ?? nonBlankString(payload.cwd),
      model: modelName(payload.model),
      usedPercentage: contextUsage(payload.context_window),
    },
  };
}

/** Parse stdin JSON to the expected payload shape, or `undefined` if unusable. */
function parsePayload(rawJson: string): StatuslinePayload | undefined {
  try {
    const parsed: unknown = JSON.parse(rawJson);
    return isStatuslinePayload(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

/** Extract the working directory from the nested `workspace` object. */
function workspaceDir(value: unknown): string | undefined {
  return isNestedField(value) ? nonBlankString(value.current_dir) : undefined;
}

/** Extract the display name from the nested `model` object. */
function modelName(value: unknown): string | undefined {
  return isNestedField(value) ? nonBlankString(value.display_name) : undefined;
}

/** Extract the context-window usage from the nested `context_window` object. */
function contextUsage(value: unknown): number | undefined {
  return isNestedField(value) ? finiteNumber(value.used_percentage) : undefined;
}

function isStatuslinePayload(value: unknown): value is StatuslinePayload {
  return isPlainObject(value);
}

function isNestedField(value: unknown): value is NestedField {
  return isPlainObject(value);
}

/** Narrow an unknown value to a finite number, or `undefined`. */
function finiteNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}
