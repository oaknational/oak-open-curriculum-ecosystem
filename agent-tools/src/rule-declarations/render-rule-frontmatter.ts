/**
 * Render a rule declaration as the YAML frontmatter block a canonical rule carries.
 *
 * The block is valid YAML in a fixed key order — `classification`, `description`, `trigger`,
 * `globs` — with descriptions kept on one line (quoted when plain YAML could not carry them)
 * and globs as a list. Rendering is deterministic, so a regeneration of an unchanged
 * declaration is byte-identical.
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@oaknational/result';
import { stringify } from 'yaml';

import { FRONTMATTER_FENCE_LINE } from './frontmatter-lines.js';
import type { RuleClassification, RuleDeclaration } from './rule-declaration.js';

const FENCE = `${FRONTMATTER_FENCE_LINE}\n`;

/**
 * Render the frontmatter block for a declaration.
 *
 * @param declaration - The rule declaration.
 * @returns The block, fences included, ending in a newline.
 *
 * @example
 * ```ts
 * renderRuleFrontmatter({ name: 'r', classification: 'core', description: 'd' });
 * // '---\nclassification: core\ndescription: d\n---\n'
 * ```
 */
export function renderRuleFrontmatter(declaration: RuleDeclaration): string {
  const body = stringify(frontmatterFields(declaration), { lineWidth: 0 });
  return `${FENCE}${body}${FENCE}`;
}

/** The block's fields in the order they are written; `globs` only when the rule has any. */
interface RuleFrontmatterFields {
  readonly classification: RuleClassification;
  readonly description: string;
  readonly trigger?: string;
  readonly globs?: readonly string[];
}

function frontmatterFields(declaration: RuleDeclaration): RuleFrontmatterFields {
  if (declaration.classification === 'core') {
    return { classification: 'core', description: declaration.description };
  }
  const scoped: RuleFrontmatterFields = {
    classification: 'situational',
    description: declaration.description,
    trigger: declaration.trigger,
  };
  return declaration.globs.length > 0 ? { ...scoped, globs: declaration.globs } : scoped;
}

/**
 * Place a frontmatter block above a rule's text, separated by one blank line.
 *
 * @param ruleText - The rule file's current text.
 * @param frontmatter - The rendered block from {@link renderRuleFrontmatter}.
 * @returns The new file text, or a refusal when the rule already carries a block.
 */
export function prependRuleFrontmatter(
  ruleText: string,
  frontmatter: string,
): Result<string, string> {
  if (ruleText.startsWith(FENCE)) {
    return err('already carries a frontmatter block');
  }
  return ok(`${frontmatter}\n${ruleText}`);
}
