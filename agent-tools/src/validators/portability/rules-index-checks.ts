/**
 * The Codex project-document byte budget for the rules index.
 *
 * `RULES_INDEX.md` is rendered from the rule declarations and compared byte for byte by the
 * projection leg (`rule-projection-validation.ts`), which already answers for its presence
 * and its rows. What the rendered bytes cannot answer for themselves is whether Codex will
 * load them whole: Codex imposes a project-document size budget, and an index past it risks
 * truncation and silent rule-load failure. This module keeps that one check.
 */

import type { EntryRead } from './directory-listing.js';
import { DEFAULT_CODEX_PROJECT_DOC_MAX_BYTES, RULES_INDEX_PATH } from './portability-constants.js';

/**
 * Options for the budget check.
 */
interface RulesIndexPortabilityIssuesOptions {
  /** Full text content of the rules index Markdown file. */
  rulesIndexContent: string;
  /**
   * Maximum allowed byte size for the rules index.
   * Defaults to {@link DEFAULT_CODEX_PROJECT_DOC_MAX_BYTES}.
   */
  maxBytes?: number;
}

/**
 * Returns the portability issues of the rules index that its rendered bytes cannot answer
 * for: today, the Codex project-document byte budget.
 *
 * @param opts - The index text and the configurable limit.
 * @returns An array of human-readable issue strings; empty means no issues.
 */
function getRulesIndexPortabilityIssues(opts: RulesIndexPortabilityIssuesOptions): string[] {
  const rulesIndexPath = RULES_INDEX_PATH;
  const maxBytes = opts.maxBytes ?? DEFAULT_CODEX_PROJECT_DOC_MAX_BYTES;
  const byteSize = Buffer.byteLength(opts.rulesIndexContent, 'utf8');
  return byteSize > maxBytes
    ? [`${rulesIndexPath}: ${byteSize} bytes exceeds Codex project-doc budget ${maxBytes}`]
    : [];
}

/**
 * The budget issues for a typed, no-follow read of the index (`rule-surface-fs.ts`): only
 * text is measured. An absent, linked or unreadable index is the projection leg's refusal
 * already, so it is neither reported twice nor read through here (the #74 round-two
 * finding, 2026-09-14: the entry point's second reader followed a link the leg had refused).
 *
 * @param read - The index as the typed reader found it.
 * @param maxBytes - The budget; the Codex default when absent.
 * @returns The issues; empty when the index is within budget or was not read as text.
 */
export function rulesIndexBudgetIssues(read: EntryRead, maxBytes?: number): string[] {
  return read.kind === 'text'
    ? getRulesIndexPortabilityIssues({ rulesIndexContent: read.text, maxBytes })
    : [];
}
