/**
 * Pure input parser for the Cursor CLI status-line identity adapter.
 *
 * @remarks
 * Cursor CLI invokes the configured status-line command with a JSON object on
 * stdin. Only the `session_id` field is required to drive the deterministic
 * agent-identity derivation; all other fields are ignored. The status line is
 * a soft surface: invalid or missing input must short-circuit to a no-op rather
 * than disrupt the session.
 */

/**
 * Plan for the Cursor CLI status-line adapter.
 */
export type CursorStatuslinePlan =
  | { readonly kind: 'noop' }
  | { readonly kind: 'derive'; readonly seed: string };

/**
 * Translate Cursor CLI status-line stdin JSON into an execution plan.
 *
 * @param rawJson - The raw JSON text Cursor CLI passes on stdin.
 * @returns `noop` when the input cannot be used, `derive` with the trimmed
 *   `session_id` seed otherwise.
 *
 * @example
 * ```ts
 * const plan = planCursorStatuslineExecution('{"session_id":"abc-123"}');
 * if (plan.kind === 'derive') {
 *   // spawn agent-identity --seed plan.seed --format display
 * }
 * ```
 */
export function planCursorStatuslineExecution(rawJson: string): CursorStatuslinePlan {
  const parsed = parseStatuslineJson(rawJson);
  if (parsed === undefined) {
    return { kind: 'noop' };
  }

  const candidate = parsed.session_id;
  if (typeof candidate !== 'string') {
    return { kind: 'noop' };
  }

  const trimmed = candidate.trim();
  if (trimmed.length === 0) {
    return { kind: 'noop' };
  }

  return { kind: 'derive', seed: trimmed };
}

function parseStatuslineJson(rawJson: string): { readonly session_id?: unknown } | undefined {
  if (rawJson.length === 0) {
    return undefined;
  }

  try {
    const parsed: unknown = JSON.parse(rawJson);
    return hasSessionIdShape(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function hasSessionIdShape(value: unknown): value is { readonly session_id?: unknown } {
  return value !== null && typeof value === 'object';
}
