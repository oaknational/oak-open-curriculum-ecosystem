/**
 * Read a sub-agent template's declaration from the frontmatter block at its head.
 *
 * A template without a block is `undeclared` (the adapter leg refuses to render until one
 * is written); a block that does not
 * close, is not YAML, or fails the declaration schema is a refusal naming the template. A
 * role whose Claude block names `body: system-prompt` is read with the template's System
 * prompt block beside it (`system-prompt-block.ts`), or refused when the template has none it
 * can carry whole.
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@oaknational/result';
import { parse as parseYaml } from 'yaml';

import { FRONTMATTER_FENCE_LINE } from '../rule-declarations/frontmatter-lines.js';

import { parseSubagentDeclaration, type SubagentDeclaration } from './subagent-declaration.js';
import { systemPromptBlock } from './system-prompt-block.js';

/** What the head of a template carries. */
export type TemplateHead =
  | { readonly kind: 'undeclared' }
  | { readonly kind: 'declared'; readonly declaration: SubagentDeclaration };

/**
 * Read the declaration at the head of a template's text.
 *
 * @param name - The template's basename without `.md`.
 * @param text - The template's full text.
 * @returns The head, or the refusal.
 */
export function readSubagentDeclaration(name: string, text: string): Result<TemplateHead, string> {
  const lines = text.split('\n');
  if (lines[0] !== FRONTMATTER_FENCE_LINE) {
    return ok({ kind: 'undeclared' });
  }
  const closing = lines.indexOf(FRONTMATTER_FENCE_LINE, 1);
  if (closing === -1) {
    return err(`${name}: frontmatter block never closes`);
  }
  let value: unknown;
  try {
    value = parseYaml(lines.slice(1, closing).join('\n'));
  } catch (cause: unknown) {
    return err(
      `${name}: frontmatter is not YAML (${cause instanceof Error ? cause.message : String(cause)})`,
    );
  }
  const declaration = parseSubagentDeclaration(name, value);
  if (!declaration.ok) {
    return declaration;
  }
  return withSystemPrompt(name, declaration.value, lines.slice(closing + 1).join('\n'));
}

/** The declaration with the System prompt block its Claude body names, or the refusal. */
function withSystemPrompt(
  name: string,
  declaration: SubagentDeclaration,
  markdown: string,
): Result<TemplateHead, string> {
  if (declaration.kind !== 'role' || declaration.claude?.body !== 'system-prompt') {
    return ok({ kind: 'declared', declaration });
  }
  const systemPrompt = systemPromptBlock(markdown);
  return systemPrompt === undefined
    ? err(
        `${name}: claude.body names the System prompt block, and the template carries none it can carry whole (one blockquote with text in it under "## System prompt", closed by a blank line or a heading, and no second quote in that section)`,
      )
    : ok({ kind: 'declared', declaration: { ...declaration, systemPrompt } });
}
