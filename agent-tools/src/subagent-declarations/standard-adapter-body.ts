/**
 * The two parts of the standard role-adapter body a declaration deviates from, measured
 * across the estate's adapters on 2026-09-14: the canonical title (the template name in
 * title case) and the closing prose (one fixed paragraph pair per platform; twenty-five
 * Cursor, twenty-one Claude and twenty-five Codex adapters carry exactly these). The rest
 * of the skeleton (the frontmatter key order and the `name` field, the platform's own
 * pre-pointer line, the one-line pointer sentence ending in a stop, Cursor `readonly`,
 * Codex `sandbox_mode`, `approval_policy` and the instructions block form, the registry
 * entry shape) is constant across every adapter, is not declared, and is the generator's
 * to hold (closure item 6, 2b-ii). A declaration carries only deviations from what is here. The
 * Gemini entries are the generator's own, measured from nothing (no hand-kept Gemini adapter
 * ever existed): the Claude wording with the platform named. A Claude adapter whose body is
 * its template's System prompt block carries no title, pre-pointer line or pointer, and
 * closes with the provenance comment here in place of the standard closing.
 *
 * @packageDocumentation
 */

import type { SubagentPlatform } from './declaration-scalars.js';
import type { MarkdownPlatform } from './subagent-declaration.js';

/** The closing prose a standard role adapter carries after its pointer, per platform. */
export const STANDARD_CLOSINGS: Readonly<Record<SubagentPlatform, string>> = {
  cursor: [
    'This file is a thin Cursor adapter. The canonical reviewer instructions live in the',
    'template referenced above.',
    '',
    'Mode: Observe, analyse and report. Do not modify code.',
  ].join('\n'),
  claude: [
    'This file is a thin Claude Code adapter. The canonical reviewer instructions live in the',
    'template referenced above.',
    '',
    'Mode: Observe, analyse and report. Do not modify code.',
  ].join('\n'),
  codex: [
    'This file is a thin Codex adapter. The canonical reviewer instructions live in',
    'the template referenced above.',
    '',
    'Mode: Observe, analyse and report. Do not modify code.',
  ].join('\n'),
  gemini: [
    'This file is a thin Gemini CLI adapter. The canonical reviewer instructions live in the',
    'template referenced above.',
    '',
    'Mode: Observe, analyse and report. Do not modify code.',
  ].join('\n'),
};

/**
 * The one line a Markdown adapter carries between its title and its pointer, per platform,
 * measured across the 29 Cursor and 29 Claude adapters on 2026-09-14 (one shape each); a
 * Codex adapter carries nothing before its pointer. The generator renders no other line
 * there (the #77 round-two findings): a declaration has no place to carry one.
 */
export const STANDARD_PRE_POINTER: Readonly<Record<MarkdownPlatform | 'gemini', string>> = {
  cursor: '**All file paths in this document are relative to the repository root.**',
  claude: 'All file paths are relative to the repository root.',
  gemini: 'All file paths are relative to the repository root.',
};

/**
 * The closing a Claude adapter carries after its System prompt body: an HTML comment naming
 * the block's home, since the body has no pointer to name it, and that the file is generated.
 *
 * @param templatePath - The template's repo-relative path.
 */
export function systemPromptClosing(templatePath: string): string {
  return [
    `<!-- Generated from the System prompt block of ${templatePath},`,
    'carried verbatim because this role does not read its template. Edit the template',
    'and run pnpm portability:fix; never edit this file. -->',
  ].join('\n');
}

/** The title a standard adapter carries: the adapter name in title case. */
export function canonicalAdapterTitle(name: string): string {
  return name
    .split('-')
    .map((word) => `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`)
    .join(' ');
}
