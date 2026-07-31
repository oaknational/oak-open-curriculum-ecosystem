/**
 * Extraction utilities for the `developer_instructions` block in Codex
 * adapter TOML files.
 *
 * Responsibilities:
 * - Reading the parsed top-level `developer_instructions` string.
 * - Extracting the de-duplicated sorted set of canonical `.agent/...` paths
 *   referenced inside that block.
 *
 * TOML basic-string decoding and registration parsing live in the sibling
 * module `validate-subagents-codex-toml.ts`.
 *
 * All functions are stateless and free of I/O — callers supply content as
 * strings.
 */

import type { TopLevelTomlBasicStringReader } from '../../core/toml-top-level-basic-string.js';

/**
 * Matches backtick-delimited `.agent/...` paths referenced inside developer
 * instructions, e.g. the path in a line like:
 * `read .agent/sub-agents/templates/foo.md`.
 *
 * Captures the path in group 1.
 */
const CANONICAL_PATH_REGEX = /`(\.agent\/[^`]+)`/gu;

// ---------------------------------------------------------------------------
// Developer instructions extraction
// ---------------------------------------------------------------------------

/**
 * Reads the top-level `developer_instructions` string from parsed adapter TOML.
 *
 * Returns an empty string when the field is absent or empty, so callers can
 * treat a falsy return value as "instructions not present".
 *
 * @param readValue - Reader for decoded top-level TOML string values.
 * @returns The trimmed developer instructions body, or `""` if absent.
 */
export function readCodexDeveloperInstructions(readValue: TopLevelTomlBasicStringReader): string {
  return readValue('developer_instructions')?.trim() ?? '';
}

// ---------------------------------------------------------------------------
// Canonical path extraction
// ---------------------------------------------------------------------------

/**
 * Extracts the de-duplicated, sorted set of canonical `.agent/...` paths
 * referenced inside a developer instructions string.
 *
 * A canonical path reference is any backtick-delimited path beginning with
 * `.agent/`, such as `.agent/sub-agents/templates/code-expert.md`.
 *
 * @param developerInstructions - The developer instructions body, as returned
 *   by {@link readCodexDeveloperInstructions}.
 * @returns A sorted array of unique `.agent/...` path strings.
 */
export function extractCanonicalPaths(developerInstructions: string): string[] {
  const paths = new Set<string>();
  for (const match of developerInstructions.matchAll(CANONICAL_PATH_REGEX)) {
    if (match[1] !== undefined) {
      paths.add(match[1]);
    }
  }
  return [...paths].toSorted((left, right) => left.localeCompare(right));
}
