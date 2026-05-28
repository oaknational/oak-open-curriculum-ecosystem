/**
 * Pure input parser for the Claude Code statusline adapter.
 *
 * @remarks
 * The Claude Code harness invokes the configured statusline command with a
 * JSON object on stdin. This parser validates that boundary with a Zod schema
 * and extracts the fields the statusline renders (session id for the
 * agent-identity seed, working directory for git queries, model name, and
 * context-window usage). The statusline is a soft surface: empty, unparseable,
 * or non-object input short-circuits to a no-op; individual malformed fields
 * are tolerated and simply render as absent segments.
 *
 * @packageDocumentation
 */

import { z } from 'zod';

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

/**
 * Schema for the statusline stdin payload. Unknown keys are stripped; each
 * known field falls back to `undefined` when malformed so one bad field never
 * blanks the whole statusline. A non-object payload fails the parse entirely.
 */
function buildStatuslinePayloadSchema() {
  return z.object({
    session_id: z.string().optional().catch(undefined),
    cwd: z.string().optional().catch(undefined),
    workspace: z
      .object({ current_dir: z.string().optional().catch(undefined) })
      .optional()
      .catch(undefined),
    model: z
      .object({ display_name: z.string().optional().catch(undefined) })
      .optional()
      .catch(undefined),
    context_window: z
      .object({ used_percentage: z.number().optional().catch(undefined) })
      .optional()
      .catch(undefined),
  });
}

const statuslinePayloadSchema = buildStatuslinePayloadSchema();

/**
 * Translate Claude Code statusline stdin JSON into an execution plan.
 *
 * @param rawJson - The raw JSON text Claude Code passes on stdin.
 * @returns `noop` when the payload is empty, unparseable, or not a JSON object;
 *   otherwise `render` with whatever fields could be extracted.
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

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawJson);
  } catch {
    return { kind: 'noop' };
  }

  const result = statuslinePayloadSchema.safeParse(parsed);
  if (!result.success) {
    return { kind: 'noop' };
  }

  const payload = result.data;
  return {
    kind: 'render',
    inputs: {
      seed: normaliseString(payload.session_id),
      cwd: normaliseString(payload.workspace?.current_dir) ?? normaliseString(payload.cwd),
      model: normaliseString(payload.model?.display_name),
      usedPercentage: payload.context_window?.used_percentage,
    },
  };
}

function normaliseString(value: string | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
}
