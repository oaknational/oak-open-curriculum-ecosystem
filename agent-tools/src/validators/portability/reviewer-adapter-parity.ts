/**
 * Reviewer-adapter cross-platform parity checks for the portability validator.
 *
 * Named reviewer agents normally have adapter files on all three supported
 * platforms: Cursor (`.cursor/agents/<name>.md`), Claude Code
 * (`.claude/agents/<name>.md`), and Codex (`.codex/agents/<name>.toml`).
 * Platform-specific seats are encoded in the shared support contract. This
 * module provides the pure function that detects parity gaps given the lists
 * of existing adapter file paths.
 */

import {
  getReviewerAdapterPlatformViolation,
  type ReviewerAdapterPlatform,
} from '../../core/reviewer-adapter-platform-contract.js';
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
 * of the three platform adapter lists. For each canonical name, the function
 * checks whether a corresponding file exists on every applicable platform and
 * emits an issue for each gap or unsupported adapter.
 *
 * Issue messages use the expected file path so that operators can immediately
 * identify what needs to be created.
 *
 * @param options - The three platform adapter file lists.
 * @returns An array of human-readable issue strings; empty means all adapters
 *   are aligned with their declared platform support.
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
    collectReviewerAdapterParityIssue(
      issues,
      agentName,
      'cursor',
      cursorNames,
      `.cursor/agents/${agentName}.md`,
    );
    collectReviewerAdapterParityIssue(
      issues,
      agentName,
      'claude-code',
      claudeNames,
      `.claude/agents/${agentName}.md`,
    );
    collectReviewerAdapterParityIssue(
      issues,
      agentName,
      'codex',
      codexNames,
      `.codex/agents/${agentName}.toml`,
    );
  }

  return issues;
}

function collectReviewerAdapterParityIssue(
  issues: string[],
  agentName: string,
  platform: ReviewerAdapterPlatform,
  agentNames: ReadonlySet<string>,
  adapterPath: string,
): void {
  const hasAdapter = agentNames.has(agentName);
  const violation = getReviewerAdapterPlatformViolation(agentName, platform, hasAdapter);

  if (violation?.kind === 'missing') {
    issues.push(`${adapterPath}: missing reviewer adapter required for cross-platform parity`);
  }
  if (violation?.kind === 'unsupported') {
    issues.push(
      `${adapterPath}: reviewer adapter is unsupported on ${violation.platform} by the shared platform contract`,
    );
  }
}
