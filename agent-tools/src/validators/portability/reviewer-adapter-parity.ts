/**
 * Reviewer-adapter cross-platform parity checks for the portability validator.
 *
 * Every named reviewer agent must have adapter files on all three supported
 * platforms: Cursor (`.cursor/agents/<name>.md`), Claude Code
 * (`.claude/agents/<name>.md`), and Codex (`.codex/agents/<name>.toml`).
 * This module provides the pure function that detects parity gaps given the
 * lists of existing adapter file paths.
 */

import { stripDirAndExtension } from './portability-constants.js';

/**
 * Options for {@link getReviewerAdapterParityIssues}.
 */
export interface ReviewerAdapterParityIssuesOptions {
  /**
   * Relative paths of all `.cursor/agents/<name>.md` files present in the
   * repo.
   */
  cursorAgentFiles: string[];
  /**
   * Relative paths of all `.claude/agents/<name>.md` files present in the
   * repo.
   */
  claudeAgentFiles: string[];
  /**
   * Relative paths of all `.codex/agents/<name>.toml` files present in the
   * repo.
   */
  codexAgentFiles: string[];
}

/**
 * Returns all portability issues caused by missing reviewer adapter files.
 *
 * A canonical reviewer adapter name is any name that appears in at least one
 * of the three platform adapter lists.  For each canonical name, the function
 * checks whether a corresponding file exists on every platform and emits an
 * issue for each gap.
 *
 * Issue messages use the expected file path so that operators can immediately
 * identify what needs to be created.
 *
 * @param options - The three platform adapter file lists.
 * @returns An array of human-readable issue strings; empty means all adapters
 *   are present on all three platforms.
 */
export function getReviewerAdapterParityIssues({
  cursorAgentFiles,
  claudeAgentFiles,
  codexAgentFiles,
}: ReviewerAdapterParityIssuesOptions): string[] {
  const issues: string[] = [];

  const cursorNames = new Set(cursorAgentFiles.map((f) => stripDirAndExtension(f, '.md')));
  const claudeNames = new Set(claudeAgentFiles.map((f) => stripDirAndExtension(f, '.md')));
  const codexNames = new Set(codexAgentFiles.map((f) => stripDirAndExtension(f, '.toml')));

  const canonicalNames = [...new Set([...cursorNames, ...claudeNames, ...codexNames])].sort(
    (a, b) => a.localeCompare(b),
  );

  for (const agentName of canonicalNames) {
    if (!cursorNames.has(agentName)) {
      issues.push(
        `.cursor/agents/${agentName}.md: missing reviewer adapter required for cross-platform parity`,
      );
    }
    if (!claudeNames.has(agentName)) {
      issues.push(
        `.claude/agents/${agentName}.md: missing reviewer adapter required for cross-platform parity`,
      );
    }
    if (!codexNames.has(agentName)) {
      issues.push(
        `.codex/agents/${agentName}.toml: missing reviewer adapter required for cross-platform parity`,
      );
    }
  }

  return issues;
}
