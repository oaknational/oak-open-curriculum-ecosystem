/**
 * Renders one content item as the block a reviewer reads.
 *
 * @remarks
 * The block answers four questions in the order a non-engineer asks them: what
 * does it say, what is it for, can an agent see it, and where do I go to change
 * it. Everything else is provenance, kept below the fold of the answer.
 *
 * @packageDocumentation
 */

import type { ContentAuthority } from '../mcp-content-current-source/current-source-model.js';
import type { WorkspaceItem } from './content-workspace-model.js';
import { servedStatusLabel } from './derive-served-status.js';

/** Where a reviewer must go to change these words. */
const AUTHORITY_LABEL: Readonly<Record<ContentAuthority, string>> = {
  workspace: 'This repository — the words are authored here.',
  'upstream-api':
    'The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.',
  'upstream-skills':
    'Oak Skills, in the `oaknational/oak-skills` repository. The workflow here is adapted from a named skill; the authoritative pedagogy lives there.',
  'external-third-party':
    'The EEF Teaching and Learning Toolkit — external material. Cite it, do not rewrite it; the Oak framing around it is ours to review.',
};

/** How the item has changed since the audit baseline. */
function revisionSentence(item: WorkspaceItem): string {
  switch (item.revision) {
    case 'unchanged': {
      return 'Unchanged since the audit baseline.';
    }
    case 'modified': {
      return 'The wording has changed since the audit baseline.';
    }
    case 'relocated': {
      return `Moved since the audit baseline (it was in \`${item.baselineFile ?? 'an earlier file'}\`).`;
    }
    case 'expanded': {
      return 'Expanded since the audit baseline.';
    }
    case 'added': {
      return 'Added after the audit baseline.';
    }
    default: {
      return 'Retired — these words were removed from the codebase after the audit baseline.';
    }
  }
}

/**
 * Neutralise Markdown emphasis characters in text quoted from the registry.
 *
 * @remarks
 * Item titles and intents carry code identifiers — `_No parameters_`,
 * `snake_case` names — where an underscore or asterisk is a literal character,
 * never emphasis. Left raw, a pair of them silently italicises the heading and
 * fails the Markdown gate. Escaping renders the character unchanged.
 */
function escapeEmphasis(text: string): string {
  return text.replaceAll(/[_*]/g, String.raw`\$&`);
}

/** A fence longer than any backtick run inside the excerpt. */
function fenceFor(excerpt: string): string {
  const longestRun = [...excerpt.matchAll(/`+/g)].reduce(
    (longest, match) => Math.max(longest, match[0].length),
    0,
  );
  return '`'.repeat(Math.max(3, longestRun + 1));
}

function excerptBlock(item: WorkspaceItem): readonly string[] {
  if (item.excerptProvenance === 'none') {
    return ['*No text is recorded for this item; see the source file below.*'];
  }
  const fence = fenceFor(item.excerpt);
  const heading =
    item.excerptProvenance === 'current-source'
      ? '**What it says now:**'
      : '**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):';
  const lines = [heading, '', `${fence}text`, item.excerpt, fence];
  if (item.excerptTruncated) {
    lines.push('', '*Shown in part only — read the full text in the source file below.*');
  }
  return lines;
}

function sourceSentence(item: WorkspaceItem): string {
  if (item.sourceFiles.length === 0) {
    return `- **Where it lives:** nowhere — retired (it was in \`${item.baselineFile ?? 'an earlier file'}\`).`;
  }
  const paths = item.sourceFiles.map((file) => `\`${file}\``).join(', ');
  return `- **Where it lives:** ${paths}`;
}

function optionalLines(item: WorkspaceItem): readonly string[] {
  const lines: string[] = [];
  if (item.registrationSelectors.length > 0) {
    const selectors = item.registrationSelectors.map((name) => `\`${name}\``).join(', ');
    lines.push(`- **Reaches an agent through:** ${selectors}`);
  }
  if (item.flags.length > 0) {
    lines.push(`- **Flagged for a closer look:** ${item.flags.join(', ')}`);
  }
  return lines;
}

/** Render one item as a Markdown section. */
export function renderItem(item: WorkspaceItem): string {
  return [
    `### ${item.id} — ${escapeEmphasis(item.title)}`,
    '',
    ...excerptBlock(item),
    '',
    `**What it is for:** ${escapeEmphasis(item.behaviouralIntent)}`,
    '',
    `- **Can an agent see it?** ${servedStatusLabel(item.status)}`,
    ...optionalLines(item),
    sourceSentence(item),
    `- **Who owns the words:** ${AUTHORITY_LABEL[item.authority]}`,
    `- **Since the audit baseline:** ${revisionSentence(item)}`,
    `- **Kind of surface:** ${item.surfaceType} · **Impact tier:** ${item.impactTier}`,
  ].join('\n');
}
