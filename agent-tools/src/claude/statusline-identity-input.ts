/**
 * Pure input parser for the Claude Code statusline identity adapter.
 *
 * @remarks
 * The Claude Code harness invokes the configured statusline command with a
 * JSON object on stdin. Only the `session_id` field is required to drive the
 * deterministic agent-identity derivation; all other fields are ignored. The
 * statusline is a soft surface — invalid or missing input must short-circuit
 * to a no-op rather than disrupt the session.
 */

/**
 * Plan for the Claude Code statusline adapter.
 */
export type StatuslinePlan =
  | { readonly kind: 'noop' }
  | { readonly kind: 'derive'; readonly seed: string };

/**
 * Translate Claude Code statusline stdin JSON into an execution plan.
 *
 * @param rawJson - The raw JSON text Claude Code passes on stdin.
 * @returns `noop` when the input cannot be used, `derive` with the trimmed
 *   `session_id` seed otherwise.
 *
 * @example
 * ```ts
 * const plan = planStatuslineExecution('{"session_id":"abc-123"}');
 * if (plan.kind === 'derive') {
 *   // spawn agent-identity --seed plan.seed --format display
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

  if (parsed === null || typeof parsed !== 'object') {
    return { kind: 'noop' };
  }
  if (!('session_id' in parsed)) {
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
