import { describe, expect, it } from 'vitest';

import { extractBodyFindings } from '../../src/pr-tally/findings.js';

const COPILOT = 'copilot-pull-request-reviewer';
const CODEX = 'chatgpt-codex-connector';

const copilotSuppressed = (items: readonly string[], missed?: number) => `### 🟡 Changes recommended

Two findings.

<details>
<summary>Review details</summary>

### Suppressed comments (${items.length})
${missed === undefined ? '' : `\n**Previously missed (${missed})** — in code that hasn't changed since the last review.\n`}
${items.map((anchor, index) => `**${anchor}**\n* Finding ${index + 1} text.\n\`\`\`\nsnippet\n\`\`\``).join('\n')}

- **Files reviewed:** 3/3 changed files
- **Comments generated:** 0 new
</details>`;

describe('extractBodyFindings — findings from review bodies, by the reviewer’s own markers', () => {
  it('reads each Copilot suppressed item as one finding keyed by its ordinal, with its anchor', () => {
    const body = copilotSuppressed(['docs/a.md:12', 'docs/a.md:12', 'src/b.ts:3'], 1);
    const result = extractBodyFindings({ author: COPILOT, body });
    expect(result.manual).toBe(false);
    expect(result.items.map((item) => [item.key, item.path, item.line])).toStrictEqual([
      ['item 1 of 3', 'docs/a.md', 12],
      ['item 2 of 3', 'docs/a.md', 12],
      ['item 3 of 3', 'src/b.ts', 3],
    ]);
    expect(result.items.map((item) => item.substance)).toStrictEqual([
      'Finding 1 text.',
      'Finding 2 text.',
      'Finding 3 text.',
    ]);
  });

  it('reads a Copilot body with no suppressed block as boilerplate: zero items, never manual', () => {
    const body = `### 🟢 Approval recommended\n\nAll good.\n\n<details>\n- **Comments generated:** 0 new\n</details>`;
    expect(extractBodyFindings({ author: COPILOT, body })).toStrictEqual({
      items: [],
      manual: false,
    });
  });

  it('surfaces a Copilot block whose items do not add up to its declared count as manual', () => {
    const body = copilotSuppressed(['docs/a.md:1']).replace(
      'Suppressed comments (1)',
      'Suppressed comments (2)',
    );
    expect(extractBodyFindings({ author: COPILOT, body }).manual).toBe(true);
  });

  it('reads Codex badge-and-heading items as findings keyed by heading, and its summary as boilerplate', () => {
    const items = [
      '**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  Verify before routing**\n\nBody one.',
      '**<sub><sub>![P1 Badge](https://img.shields.io/badge/P1-orange?style=flat)</sub></sub>  Keep doctrine on the branch**\n\nBody two.',
    ].join('\n\n');
    const withItems = extractBodyFindings({ author: CODEX, body: items });
    expect(withItems.manual).toBe(false);
    expect(withItems.items.map((item) => [item.key, item.path, item.line])).toStrictEqual([
      ['Verify before routing', null, null],
      ['Keep doctrine on the branch', null, null],
    ]);
    const summary =
      '\n### 💡 Codex Review\n\nHere are some automated review suggestions for this pull request.\n';
    expect(extractBodyFindings({ author: CODEX, body: summary })).toStrictEqual({
      items: [],
      manual: false,
    });
  });

  it('surfaces an unstructured body from any other reviewer as manual, and an empty one as nothing', () => {
    expect(
      extractBodyFindings({ author: 'claude', body: 'Two issues: the parser and the docs.' }),
    ).toStrictEqual({ items: [], manual: true });
    expect(extractBodyFindings({ author: 'claude', body: '  \n' })).toStrictEqual({
      items: [],
      manual: false,
    });
  });

  it('surfaces a Codex body whose headings repeat as manual: one line would disposition both', () => {
    const badge =
      '**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  Same heading**';
    expect(
      extractBodyFindings({ author: CODEX, body: `${badge}\n\nOne.\n\n${badge}\n\nTwo.` }),
    ).toStrictEqual({ items: [], manual: true });
  });
});

describe('Codex items are read by their fixed parts', () => {
  const badge =
    '**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>';
  const none = { items: [], manual: false };

  it('reads an item whose closing bold is followed by whitespace, and none without a closing bold or a space after the badge', () => {
    expect(
      extractBodyFindings({ author: CODEX, body: `${badge}  Trailing space**  ` }).items.map(
        (item) => item.key,
      ),
    ).toStrictEqual(['Trailing space']);
    expect(extractBodyFindings({ author: CODEX, body: `${badge}  No closing bold` })).toStrictEqual(
      none,
    );
    expect(extractBodyFindings({ author: CODEX, body: `${badge}Unspaced**` })).toStrictEqual(none);
    expect(
      extractBodyFindings({
        author: CODEX,
        body: `**<sub><sub>![Px Badge](u)</sub></sub>  Heading**`,
      }),
    ).toStrictEqual(none);
  });

  /**
   * A heading is required. The one-regex reader accepted a badge line that
   * closed its bold over whitespace alone as an item with an empty key.
   */
  it('reads a badge line with a whitespace-only heading as no item', () => {
    expect(extractBodyFindings({ author: CODEX, body: `${badge}   **` })).toStrictEqual(none);
  });

  /**
   * Before the cure the item pattern re-scanned from every sub closer and
   * across every run of whitespace: this line, 512 closers each followed by
   * 512 spaces (268,326 characters, no closing bold), took 15.0 s on the
   * authoring host (2026-10-28, quiet, measured once), past the harness's
   * timeout; the fixed-part reader reads it in milliseconds. No ceiling is
   * asserted (testing-strategy, no wall-clock ceilings in gated tests).
   */
  it('reads a badge line of 512 sub closers and 262,144 spaces as no item', () => {
    const line = `**<sub><sub>![P1 Badge](u)</sub></sub>${`</sub></sub>${' '.repeat(512)}`.repeat(512)}`;
    expect(extractBodyFindings({ author: CODEX, body: line })).toStrictEqual(none);
  });
});
