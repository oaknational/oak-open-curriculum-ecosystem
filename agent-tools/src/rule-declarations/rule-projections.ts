/**
 * A rule's two hand-kept projections, read and parsed together: the Cursor trigger
 * (`.cursor/rules/<name>.mdc`) and the Claude adapter (`.claude/rules/<name>.md`). The sweep
 * derives a declaration from them for a rule not yet declared; a deleted or malformed
 * projection refuses the sweep. A declared rule's projections are generated and are not read
 * here.
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@oaknational/result';

import { parseClaudeRuleAdapterPaths } from './parse-claude-rule-adapter.js';
import { type CursorTrigger, parseCursorTrigger } from './parse-cursor-trigger.js';
import { readSource, type SweepFs } from './sweep-fs.js';

/** The parsed projections of one rule. */
export interface RuleProjections {
  readonly cursor: CursorTrigger;
  readonly claudePaths: readonly string[];
}

/**
 * Read and parse a rule's two projections.
 *
 * @param repoRoot - Absolute path of the repository root.
 * @param name - The rule basename.
 * @param sweepFs - The file-system port.
 * @returns The projections, or the refusal naming the projection and its cause.
 */
export async function readRuleProjections(
  repoRoot: string,
  name: string,
  sweepFs: SweepFs,
): Promise<Result<RuleProjections, string>> {
  const triggerPath = `.cursor/rules/${name}.mdc`;
  const triggerText = await readSource(repoRoot, triggerPath, sweepFs);
  if (!triggerText.ok) {
    return triggerText;
  }
  const cursor = parseCursorTrigger(triggerText.value);
  if (!cursor.ok) {
    return err(`${triggerPath}: ${cursor.error}`);
  }
  const adapterPath = `.claude/rules/${name}.md`;
  const adapterText = await readSource(repoRoot, adapterPath, sweepFs);
  if (!adapterText.ok) {
    return adapterText;
  }
  const claude = parseClaudeRuleAdapterPaths(adapterText.value);
  if (!claude.ok) {
    return err(`${adapterPath}: ${claude.error}`);
  }
  return ok({ cursor: cursor.value, claudePaths: claude.value });
}
