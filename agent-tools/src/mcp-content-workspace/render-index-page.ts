/**
 * Renders the workspace index — the one path a reviewer opens first.
 *
 * @packageDocumentation
 */

import { AUDIT_REPORT_PATH, REVIEW_DOMAIN_GLOSS, domainSlug } from './content-workspace-config.js';
import type { WorkspaceItem } from './content-workspace-model.js';
import { PAGE_BANNER, frontmatter } from './render-domain-page.js';
import { domainCounts, excerptProvenanceCounts, statusCounts } from './workspace-counts.js';

const AUDIT_REPORT_LINK = `../../../${AUDIT_REPORT_PATH}`;

function domainTable(items: readonly WorkspaceItem[]): readonly string[] {
  return [
    '| Review view | Items | Ours to change | Owned elsewhere | What it covers |',
    '| --- | ---: | ---: | ---: | --- |',
    ...domainCounts(items).map((count) => {
      const gloss = REVIEW_DOMAIN_GLOSS[count.domain] ?? 'Items assigned to this review domain.';
      const link = `[${count.domain}](./domains/${domainSlug(count.domain)}.md)`;
      return `| ${link} | ${String(count.total)} | ${String(count.ownedHere)} | ${String(count.ownedUpstream)} | ${gloss} |`;
    }),
  ];
}

function coverageParagraph(items: readonly WorkspaceItem[]): readonly string[] {
  const status = statusCounts(items);
  const provenance = excerptProvenanceCounts(items);
  const fromCurrent = provenance.get('current-source') ?? 0;
  const retired = status.get('retired') ?? 0;
  return [
    '## What is in here',
    '',
    `**${String(items.length)} items** of content, every one of them listed. ` +
      `${String(fromCurrent)} are shown with the wording the system uses today, read straight ` +
      `from the code. ${String(retired)} have been retired since the audit and are listed with ` +
      'their last known wording so nothing vanishes silently. Anything this pass could not ' +
      'render from current source is named in [unrendered items](./unrendered.md) — the list ' +
      'is never quietly shortened.',
    '',
    `Whether an agent can actually see an item is derived, not declared: see ` +
      '[what an agent sees today](./served-surface.md).',
    '',
  ];
}

const HOW_TO_REVIEW = [
  '## How to review',
  '',
  '1. **Open the view for your area** from the table below. You do not need to read any other view.',
  '2. **Read each item.** Every item shows the words themselves, what they are for, whether an ' +
    'agent can currently see them, and which file they live in.',
  '3. **Check the words against your expertise** — is this accurate, safe, fair, legally sound, ' +
    'and does it say what we want an agent to do?',
  '4. **Raise anything that is wrong.** Each item names the repository that owns its words. For ' +
    'items owned in this repository, an engineer can change the named file. For items owned ' +
    'elsewhere, the change has to be raised in that repository.',
  '',
  'You do not need to read any code to do this. If an item makes no sense without its ' +
    'surroundings, that is itself a finding worth raising.',
  '',
] as const;

function scopeSection(items: readonly WorkspaceItem[]): readonly string[] {
  const outOfScope = items.filter((item) => item.workspaceScope === 'out-upstream-api').length;
  return [
    '## What counts as content here',
    '',
    'In scope: everything this repository controls that reaches an AI agent and can shape how it ' +
      'behaves — the instructions the server sends on connection, every tool and parameter ' +
      'description, guidance documents, error and empty-state messages, attribution, and the ' +
      'human-facing landing and consent copy.',
    '',
    'Not in scope: the curriculum data itself — lesson, quiz, and unit content fetched from the ' +
      'Oak Open Curriculum API. Those are the bytes we pass through, not words we author. Where ' +
      'we wrap that data in a sentence of our own, the sentence is in scope and the data is not.',
    '',
    `${String(outOfScope)} items are served by this system but authored in the Oak Open ` +
      'Curriculum API specification. They are listed in full, marked as owned elsewhere, so the ' +
      'review is complete even where the fix is not local.',
    '',
  ];
}

/** Render the workspace index. */
export function renderIndexPage(items: readonly WorkspaceItem[]): string {
  return [
    ...frontmatter('index', 'model-behaviour-content-navigation'),
    '# Model-behaviour content — the review workspace',
    '',
    PAGE_BANNER,
    '',
    'This is every piece of writing this repository puts in front of an AI agent, in one place, ' +
      'in plain view. It exists so that the people best placed to judge that writing — ' +
      'education, curriculum, legal, safety, and accessibility experts — can read and challenge ' +
      'it without reading any code.',
    '',
    ...coverageParagraph(items),
    ...HOW_TO_REVIEW,
    '## The review views',
    '',
    ...domainTable(items),
    '',
    ...scopeSection(items),
    '## Where this comes from',
    '',
    `This workspace is generated from the content registry recorded in the [MCP agent-facing ` +
      `content audit](${AUDIT_REPORT_LINK}), which is the audit that found and classified every ` +
      'item. The registry holds what each item is; the current-source projection holds where it ' +
      'lives now and whether it is served; the wording is read from the code itself at each ' +
      "item's verified anchor.",
    '',
    'To rebuild it after a content change:',
    '',
    '```bash',
    'pnpm --filter @oaknational/agent-tools build-mcp-content-workspace',
    '```',
    '',
    'The same script run with `--check` fails when these pages have drifted from the registry, ' +
      'so a stale workspace cannot merge unnoticed.',
    '',
  ].join('\n');
}
