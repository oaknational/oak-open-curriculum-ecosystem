/**
 * The two views that are about the corpus rather than about one domain: what an
 * agent can actually see, and what this pass could not render.
 *
 * @packageDocumentation
 */

import type { WorkspaceInputs, WorkspaceItem } from './content-workspace-model.js';
import { GENERATED_BANNER, frontmatter } from './render-domain-page.js';
import { domainSlug } from './content-workspace-config.js';
import { unrenderedItems } from './workspace-counts.js';

const ALLOWLIST_PATH =
  'apps/oak-curriculum-mcp-streamable-http/src/served-surface/served-surface.ts';

function nameList(heading: string, names: readonly string[]): readonly string[] {
  if (names.length === 0) {
    return ['', `### ${heading} (0)`, '', '*None.*'];
  }
  return [
    '',
    `### ${heading} (${String(names.length)})`,
    '',
    ...[...names].sort((left, right) => left.localeCompare(right)).map((name) => `- \`${name}\``),
  ];
}

/**
 * Render the live-versus-dormant view.
 *
 * @remarks
 * The lists are the observation the current-source projection recomputes by
 * walking the running server over an in-memory MCP transport — not a reading of
 * the allowlist file. That distinction matters to a reviewer: it is evidence of
 * what the server registers, not a statement of what it was configured to
 * register.
 */
export function renderServedSurfacePage(inputs: WorkspaceInputs): string {
  return [
    ...frontmatter('register', 'model-behaviour-content-served-surface'),
    '# What an agent sees today',
    '',
    GENERATED_BANNER,
    '',
    'Not everything in this codebase is switched on. Some tools and documents are deliberately ' +
      'retained but not offered to agents — kept so they can be turned back on as a single ' +
      'reviewed change, rather than deleted and rewritten later.',
    '',
    'A **live** surface is one an agent can use right now. A **dormant** surface exists in the ' +
      'code but is not offered, so no agent can reach it and its wording cannot affect anyone ' +
      'until it is switched on.',
    '',
    '[Back to the workspace index](./README.md)',
    '',
    ...renderRegistrationRoots(inputs.current.registrationRoots),
    '## How this is worked out',
    '',
    'One file decides it: `' +
      ALLOWLIST_PATH +
      '` classifies every tool and resource as live or ' +
      'dormant, and the server registers from that one definition. Turning a surface on or off ' +
      'is a one-word change there, reviewed like any other change.',
    '',
    'The live lists above are recorded by starting the server and asking it what it offers, so ' +
      'they are evidence of what is actually registered. The dormant lists are read from that file, ' +
      'and the same run checks that none of those names is offered. The ' +
      '`validate-mcp-content-current-source` check keeps that record honest against the code.',
    '',
  ].join('\n');
}

/**
 * Every registration root the projection observed, each with all four MCP
 * primitives it records — the initialisation instructions, tools, resources
 * and prompts. Nothing observed is dropped: a later root or a newly present
 * capability appears here without a code change, and an empty observation
 * says so rather than rendering nothing.
 */
function renderRegistrationRoots(
  roots: WorkspaceInputs['current']['registrationRoots'],
): readonly string[] {
  if (roots.length === 0) {
    return [
      '## Registration roots',
      '',
      'No registration root was observed by this projection.',
      '',
    ];
  }
  return roots.flatMap((root) => {
    const { initialize, tools, resources, prompts } = root.observation;
    return [
      `## Registration root \`${root.id}\``,
      '',
      `### Instructions sent on connection — ${initialize.instructions}`,
      '',
      '### Tools',
      ...nameList('Live', tools.live),
      ...nameList('Dormant', tools.dormant),
      '',
      '### Documents and other resources',
      ...nameList('Live', resources.live),
      ...nameList('Dormant', resources.dormant),
      '',
      `### Prompts — capability ${prompts.capability}; listing ${prompts.list === 'available' ? 'available' : 'not offered (method not found)'}`,
      '',
    ];
  });
}

function unrenderedRow(item: WorkspaceItem): string {
  const reason =
    item.excerptProvenance === 'baseline-snippet'
      ? 'shown with its audit-baseline wording; current wording not located automatically'
      : 'no text recorded';
  const file = item.sourceFiles[0] ?? item.baselineFile ?? 'unknown';
  const view = `[${item.reviewDomain}](./domains/${domainSlug(item.reviewDomain)}.md)`;
  return `| ${item.id} | ${view} | ${reason} | \`${file}\` |`;
}

/**
 * Render the explicit manifest of items not rendered from current source.
 *
 * @remarks
 * This page exists so coverage gaps are stated rather than absorbed. An empty
 * table is the goal; a shortened corpus never is.
 */
export function renderUnrenderedPage(items: readonly WorkspaceItem[]): string {
  const outstanding = unrenderedItems(items);
  const retired = items.filter((item) => item.status === 'retired').length;
  const inCode = items.length - retired;
  const retiredNote =
    `The ${String(retired)} retired ${retired === 1 ? 'item is' : 'items are'} listed in ` +
    'their review views with their audit-baseline wording, since no current wording exists.';
  const body =
    outstanding.length === 0
      ? [
          `Every one of the ${String(inCode)} items still in the codebase is rendered with the ` +
            `wording the system uses today. ${retiredNote} There is nothing outstanding.`,
        ]
      : [
          `${String(outstanding.length)} of the ${String(inCode)} items still in the codebase ` +
            'are listed in their review view but could not be shown with current wording. They ' +
            'are named here rather than dropped. Each is still reviewable by opening the file ' +
            `named against it. ${retiredNote}`,
          '',
          '| Item | Review view | Why | File to read |',
          '| --- | --- | --- | --- |',
          ...outstanding.map(unrenderedRow),
        ];
  return [
    ...frontmatter('register', 'model-behaviour-content-coverage'),
    '# Items not shown with current wording',
    '',
    GENERATED_BANNER,
    '',
    '[Back to the workspace index](./README.md)',
    '',
    ...body,
    '',
  ].join('\n');
}
