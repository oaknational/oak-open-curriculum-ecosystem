/**
 * Per-tool-result size measurement — the handler half of the outbound
 * token health metric.
 *
 * The transport byte counter records total wire size; this measurement
 * records the per-field split (content vs structuredContent vs _meta)
 * that the wire level cannot see — the diagnostic for dual-shape
 * duplication cost (every field is model-visible in at least one major
 * MCP client, so each field's size is a real context-window cost
 * somewhere). All fields are serialised-JSON character counts, so the
 * units are uniform across fields and tools.
 *
 * Total by construction: absent or unstringifiable fields measure 0 and
 * nothing throws — a metrics helper must never break a response path.
 * Numbers only; payload content is never recorded.
 */

import { estimateTokensFromChars, safeJsonChars } from './token-estimate.js';

/** The per-field size split for one CallToolResult. */
export interface ToolResultSizeMeasurement {
  /** Serialised-JSON chars of the content block array (0 when absent). */
  readonly contentChars: number;
  /** Serialised-JSON chars of structuredContent (0 when absent). */
  readonly structuredChars: number;
  /** Serialised-JSON chars of _meta (0 when absent). */
  readonly metaChars: number;
  /** Sum of the three field measurements. */
  readonly totalChars: number;
  /** chars/4 token estimate over totalChars. */
  readonly tokensEst: number;
}

/**
 * Structural minimum of a CallToolResult the measurement reads. Broad on
 * purpose: auth-error responses and every tool's success shape satisfy it.
 */
export interface MeasurableToolResult {
  readonly content?: unknown;
  readonly structuredContent?: unknown;
  readonly _meta?: unknown;
  readonly isError?: unknown;
}

/** Measures one outbound tool result; see the module doc for semantics. */
export function measureCallToolResult(result: MeasurableToolResult): ToolResultSizeMeasurement {
  const contentChars = safeJsonChars(result.content) ?? 0;
  const structuredChars = safeJsonChars(result.structuredContent) ?? 0;
  const metaChars = safeJsonChars(result._meta) ?? 0;
  const totalChars = contentChars + structuredChars + metaChars;
  return {
    contentChars,
    structuredChars,
    metaChars,
    totalChars,
    tokensEst: estimateTokensFromChars(totalChars),
  };
}
