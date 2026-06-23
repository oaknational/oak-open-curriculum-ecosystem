/**
 * Pure helpers for the WS7 archive-move manifest ledger
 * (`comms-archive/manifest.jsonl`, ADR-199 §Decision item 3).
 *
 * @remarks
 * Kept IO-free so the crash-resilience contract is unit-testable: a manifest
 * whose final line was truncated by a crash mid-append (precisely the failure the
 * execute path is designed to recover from) MUST be readable — a malformed line
 * carries no id and is skipped, never thrown. The `node:fs` read that consumes
 * this lives in `archive-move-node.ts`.
 *
 * @packageDocumentation
 */

/**
 * The `event_id` of a manifest JSONL row, or `null` when the line is empty,
 * truncated, not an object, or carries no string `event_id`. Never throws — a
 * crash-truncated final line resolves to `null` rather than bricking the reader.
 */
export function manifestRowEventId(line: string): string | null {
  if (line.trim() === '') {
    return null;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(line);
  } catch {
    return null;
  }
  if (
    typeof parsed === 'object' &&
    parsed !== null &&
    'event_id' in parsed &&
    typeof parsed.event_id === 'string'
  ) {
    return parsed.event_id;
  }
  return null;
}
