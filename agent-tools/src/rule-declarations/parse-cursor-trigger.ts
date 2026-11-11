/**
 * Read a hand-kept Cursor rule trigger (`.cursor/rules/<rule>.mdc`).
 *
 * A trigger carries `description`, optionally `alwaysApply` and optionally `globs`; nothing
 * else. `alwaysApply` is reported as it is written — `undefined` when the line is absent —
 * because absence is a fact the reconciliation lists, not a value to assume.
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@oaknational/result';

import { splitCommaList } from './comma-list.js';
import { readFrontmatterLines } from './frontmatter-lines.js';

/** What a Cursor trigger declares. */
export interface CursorTrigger {
  readonly description: string;
  /** `true`, `false`, or `undefined` when the trigger carries no `alwaysApply` line. */
  readonly alwaysApply: boolean | undefined;
  /** The globs the trigger attaches to; empty when it carries none. */
  readonly globs: readonly string[];
}

const CURSOR_KEYS: ReadonlySet<string> = new Set(['description', 'alwaysApply', 'globs']);

/**
 * Parse a Cursor trigger's frontmatter.
 *
 * @param text - The `.mdc` file text.
 * @returns The trigger, or the reason it could not be read.
 *
 * @example
 * ```ts
 * parseCursorTrigger('---\ndescription: d\nalwaysApply: true\n---\n\nRead and follow ...');
 * // { ok: true, value: { description: 'd', alwaysApply: true, globs: [] } }
 * ```
 */
export function parseCursorTrigger(text: string): Result<CursorTrigger, string> {
  const block = readFrontmatterLines(text, CURSOR_KEYS);
  if (!block.ok) {
    return block;
  }
  if (block.value === undefined) {
    return err('no frontmatter block');
  }
  const description = block.value.get('description');
  if (description === undefined) {
    return err('no description');
  }
  if (description.length === 0) {
    return err('description is empty');
  }
  const alwaysApply = parseAlwaysApply(block.value.get('alwaysApply'));
  if (!alwaysApply.ok) {
    return alwaysApply;
  }
  const globsValue = block.value.get('globs');
  const globs = globsValue === undefined ? ok([]) : splitCommaList(globsValue);
  if (!globs.ok) {
    return globs;
  }
  return ok({ description, alwaysApply: alwaysApply.value, globs: globs.value });
}

function parseAlwaysApply(value: string | undefined): Result<boolean | undefined, string> {
  if (value === undefined) {
    return ok(undefined);
  }
  if (value === 'true') {
    return ok(true);
  }
  if (value === 'false') {
    return ok(false);
  }
  return err(`alwaysApply must be true or false, got "${value}"`);
}
