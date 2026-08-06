/**
 * Renders one per-review-domain view — the page a named reviewer opens.
 *
 * @remarks
 * The domain view is the unit of review the audit report's §7 decision 2 asks
 * for ("a variety of reviews, by content intent and audience"), realised as a
 * view rather than a separate workspace per §12.2. Within a view, items are
 * split by *who owns the words*, because that decides where a reviewer's edit
 * has to be made.
 *
 * @packageDocumentation
 */

import { REVIEW_DOMAIN_GLOSS } from './content-workspace-config.js';
import type { WorkspaceItem } from './content-workspace-model.js';
import { renderItem } from './render-item.js';

/** Frontmatter shared by every generated page. */
export function frontmatter(role: 'index' | 'register', authority: string): readonly string[] {
  return [
    '---',
    'boundary: B1-Governance',
    `doc_role: ${role}`,
    `authority: ${authority}`,
    'status: active',
    'last_reviewed: 2026-08-06',
    '---',
    '',
  ];
}

/** The banner every page carries, so no reader mistakes this for an approval. */
export const GENERATED_BANNER =
  '> **Generated file — do not edit by hand.** It is rebuilt from the content registry by ' +
  '`pnpm --filter @oaknational/agent-tools build-mcp-content-workspace`. ' +
  'Editing a page here changes nothing an agent sees; change the source file each item names.';

/**
 * The banner plus the standing honesty note, as one blockquote.
 *
 * @remarks
 * One block, not two: two blockquotes separated by a blank line is a Markdown
 * ambiguity the lint gate rejects, and the two notes belong together anyway —
 * "generated" and "not yet approved" are the same warning to a reader.
 */
export const PAGE_BANNER = [
  GENERATED_BANNER,
  '>',
  '> **Nothing here has been approved yet.** This workspace exists so the content *can* be ' +
    'reviewed. Wording that appears here is what the system says today, not what anyone has ' +
    'signed off.',
].join('\n');

/** How to see the history of any item, stated once per page. */
const CHANGE_HISTORY_NOTE = [
  '<details>',
  '<summary>How to read an item, and how to see every change made to it</summary>',
  '',
  'Each item is quoted at the passage the audit recorded for it. For some items that is a whole ' +
    'document; for others it is one sentence inside a larger file, because that sentence is what ' +
    'was catalogued as a separate piece of content. When an item reads as a fragment, open the ' +
    'file named against it to see it in place — and say so, because a passage that cannot be ' +
    'judged without its surroundings is a finding in itself.',
  '',
  "Each item names the file its words live in. To read that file's full history — every " +
    'change, who made it, and when — run this at the root of the repository, replacing the ' +
    'path with the one the item names:',
  '',
  '```bash',
  'git log -p --follow -- packages/sdks/oak-curriculum-sdk/src/mcp/orientation-guidance.ts',
  '```',
  '',
  '</details>',
].join('\n');

function ownershipSection(
  heading: string,
  guidance: string,
  items: readonly WorkspaceItem[],
): readonly string[] {
  if (items.length === 0) {
    return [];
  }
  return [
    '',
    `## ${heading} (${String(items.length)})`,
    '',
    guidance,
    '',
    // One joined block, not one array entry per item: a trailing blank entry
    // per item would meet the next section's leading blank and double up.
    items.map((item) => renderItem(item)).join('\n\n'),
  ];
}

/** The ownership-grouped body shared by full and split domain views. */
function renderOwnershipSections(items: readonly WorkspaceItem[]): readonly string[] {
  const present = items.filter((item) => item.status !== 'retired');
  return [
    ...ownershipSection(
      'Words owned in this repository',
      'These are ours to change. An edit here is a normal change to this repository, reviewed like any other.',
      present.filter((item) => item.authority === 'workspace'),
    ),
    ...ownershipSection(
      'Words owned elsewhere',
      'These reach agents through this system but are authored somewhere else. Each item names the repository that owns it; raise changes there, not here.',
      present.filter((item) => item.authority !== 'workspace'),
    ),
    ...ownershipSection(
      'Retired',
      'These existed at the audit baseline and have since been removed. They are listed so nothing disappears without a trace.',
      items.filter((item) => item.status === 'retired'),
    ),
  ];
}

function statusSentence(items: readonly WorkspaceItem[]): string {
  const live = items.filter((item) => item.status === 'live').length;
  const dormant = items.filter((item) => item.status === 'dormant').length;
  const retired = items.filter((item) => item.status === 'retired').length;
  return (
    `**${String(items.length)} items.** Of those, ${String(live)} are traced to a surface an ` +
    `agent can reach today, ${String(dormant)} to a surface that is retained but switched off, ` +
    `and ${String(retired)} no longer exist in the codebase. The rest live in code that ships, ` +
    'but this pass has not traced which registered surface carries them — each says so.'
  );
}

function pageHead(
  title: string,
  intro: string,
  items: readonly WorkspaceItem[],
  backLink: string,
): readonly string[] {
  return [
    ...frontmatter('register', 'model-behaviour-content-review'),
    `# ${title}`,
    '',
    PAGE_BANNER,
    '',
    intro,
    '',
    statusSentence(items),
    '',
    backLink,
    '',
    CHANGE_HISTORY_NOTE,
  ];
}

/** Plain-English gloss for a domain. */
export function domainGloss(domain: string): string {
  return REVIEW_DOMAIN_GLOSS[domain] ?? 'Items assigned to this review domain.';
}

/** Render a whole review domain as one page. */
export function renderDomainPage(domain: string, items: readonly WorkspaceItem[]): string {
  return [
    ...pageHead(
      `${domain} — content review view`,
      domainGloss(domain),
      items,
      '[Back to the workspace index](../README.md)',
    ),
    ...renderOwnershipSections(items),
  ].join('\n');
}

/** Render one surface-type slice of a domain that was too large for one page. */
export function renderSurfacePage(
  domain: string,
  surfaceType: string,
  items: readonly WorkspaceItem[],
  domainPageHref: string,
): string {
  return [
    ...pageHead(
      `${surfaceType} — part of the ${domain} review view`,
      `${domainGloss(domain)}\n\nThis page holds only the **${surfaceType}** items of that view, ` +
        'so it can be reviewed in one sitting.',
      items,
      `[Back to the ${domain} view](${domainPageHref}) · [Back to the workspace index](../README.md)`,
    ),
    ...renderOwnershipSections(items),
  ].join('\n');
}
