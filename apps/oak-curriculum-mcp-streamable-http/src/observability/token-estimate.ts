/**
 * Pure token-estimation helpers for the outbound token health metric.
 *
 * Everything the MCP server sends to an invoking agent consumes that
 * agent's context window (ADR-058 addendum, 2026-06-10), so outbound
 * payload sizes are a standing health signal. These helpers produce the
 * numbers the observability seams record: sizes and estimates only,
 * never payload content.
 *
 * The chars/4 heuristic matches the practice-fitness baseline tokenizer
 * (~10–15% accuracy band against real tokenizers for English prose and
 * JSON) — sufficient for a health metric. If per-model precision is ever
 * needed, this module is the swap point.
 *
 * Both functions are total: a metrics helper must never throw on a
 * response path.
 */

/**
 * Estimated token count for a size count: `ceil(size / 4)`.
 *
 * The unit is whichever size the calling seam measures — serialised-JSON
 * **characters** at the handler seam (`measureCallToolResult`) or wire
 * **bytes** at the transport seam (`attachResponseByteCounter`). The /4
 * heuristic is the same for both; the two scopes measure different
 * things and their estimates must never be summed (see the plan's
 * Measurement Scopes section).
 *
 * Negative and non-finite inputs map to 0 — a measurement gap is
 * recorded as zero rather than poisoning span attributes with NaN.
 */
export function estimateTokensFromChars(size: number): number {
  if (!Number.isFinite(size) || size <= 0) {
    return 0;
  }
  return Math.ceil(size / 4);
}

/**
 * The serialised-JSON character length of a value, as a total function.
 *
 * Returns `undefined` for `undefined` input (it has no JSON form) and
 * `undefined` — never a throw — for unstringifiable values (circular
 * references, BigInt). Callers omit the metric field when the length is
 * unknowable instead of failing the response.
 */
export function safeJsonChars(value: unknown): number | undefined {
  if (value === undefined) {
    return undefined;
  }
  try {
    const text: string | undefined = JSON.stringify(value);
    return text === undefined ? undefined : text.length;
  } catch {
    return undefined;
  }
}
