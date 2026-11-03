import path from 'node:path';

import { isErr, isOk } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { loadCorpus, type CorpusFileSystem } from './plan-corpus-loading.js';
import {
  parseImpactAreasRegistry,
  recomputeChoiceRegistry,
  type ChoiceRegistry,
} from './plan-corpus-registries.js';
import { type ParsedPlanFile } from './plan-corpus-types.js';
import { validateCorpus, validatePlanFile } from './validate-plan-corpus-helpers.js';

const README = [
  '| Stream | Choice IDs | Status |',
  '| --- | --- | --- |',
  '| MCP app | `APP-*` | Signed off |',
  '| Agentic framework | `FRAME-*` | Signed off |',
].join('\n');

const STREAMS = ['- **FRAME-1 — The Practice as a meta-learning loop.**', 'Choices: APP-1, APP-2.'];

const IMPACT_AREAS_DOC = [
  '# Impact areas — the closed registry',
  '',
  '| Area | What it covers |',
  '| --- | --- |',
  '| `served-surface` | The served surface |',
  '| `guidance-content` | Guidance and its pipeline |',
  '| `practice-and-estate` | The estate itself |',
].join('\n');

function choiceRegistry(): ChoiceRegistry {
  const result = recomputeChoiceRegistry(README, STREAMS);
  if (isErr(result)) {
    expect.fail('registry recompute should succeed for the fixture corpus');
  }
  return result.value;
}

function impactAreas(): ReadonlySet<string> {
  const result = parseImpactAreasRegistry(IMPACT_AREAS_DOC);
  if (isErr(result)) {
    expect.fail('impact-areas registry parse should succeed for the fixture doc');
  }
  return result.value;
}

function planDoc(frontmatterLines: readonly string[]): string {
  return ['---', ...frontmatterLines, '---', '', '# Body', ''].join('\n');
}

const STRATEGIC_LINES = [
  'id: fixture-release',
  'node_type: strategic',
  'name: Fixture release',
  'overview: One-line scope.',
  'status: sketch',
  'ratified_by: null',
  'ratified_date: null',
  'ratified_where: null',
  'serves: FRAME-1',
  'impact_areas:',
  '  - served-surface',
  'gate_expiry_default: P3D',
  'last_updated: 2026-07-23',
];

const DELIVERY_LINES = [
  'id: fixture-lane',
  'node_type: delivery',
  'name: Fixture lane',
  'overview: One-line scope.',
  'status: sketch',
  'ratified_by: null',
  'ratified_date: null',
  'ratified_where: null',
  'serves: fixture-release',
  'impact_areas:',
  '  - served-surface',
  '  - guidance-content',
  'tickets:',
  '  - MCP-101',
  'last_updated: 2026-07-23',
];

function replaceLine(lines: readonly string[], prefix: string, replacement: string): string[] {
  return lines.map((line) => (line.startsWith(prefix) ? replacement : line));
}

function dropLine(lines: readonly string[], prefix: string): string[] {
  return lines.filter((line) => !line.startsWith(prefix));
}

/** Apply a complete ratification stamp to a fixture's lines. */
function ratified(lines: readonly string[]): string[] {
  return replaceLine(
    replaceLine(
      replaceLine(
        replaceLine(lines, 'status:', 'status: ratified'),
        'ratified_by:',
        'ratified_by: The Owner',
      ),
      'ratified_date:',
      'ratified_date: 2026-07-23',
    ),
    'ratified_where:',
    'ratified_where: decisions register D23',
  );
}

/** Remove the tickets block from a fixture's lines entirely. */
function ticketless(lines: readonly string[]): string[] {
  return dropLine(dropLine(lines, 'tickets:'), '  - MCP-');
}

function parsedFixture(path: string, lines: readonly string[]): ParsedPlanFile {
  const result = validatePlanFile(path, planDoc(lines));
  if (isErr(result)) {
    expect.fail(
      `fixture '${path}' should pass file-level validation: ${result.error.messages.join('; ')}`,
    );
  }
  return { path, node: result.value };
}

describe('parseImpactAreasRegistry', () => {
  it('collects backtick-quoted area names from the registry table', () => {
    expect([...impactAreas()].sort((a, b) => a.localeCompare(b))).toEqual([
      'guidance-content',
      'practice-and-estate',
      'served-surface',
    ]);
  });

  it('refuses a vacuous registry (no areas found)', () => {
    expect(isErr(parseImpactAreasRegistry('no table here'))).toBe(true);
  });
});

describe('validatePlanFile — the D23 contract', () => {
  it('accepts a conformant sketch strategic node', () => {
    expect(isOk(validatePlanFile('s.plan.md', planDoc(STRATEGIC_LINES)))).toBe(true);
  });

  it('accepts a conformant sketch delivery plan', () => {
    expect(isOk(validatePlanFile('d.plan.md', planDoc(DELIVERY_LINES)))).toBe(true);
  });

  it('rejects the V0 node_type vocabulary — the contract is replaced, not bridged', () => {
    const result = validatePlanFile(
      'p.plan.md',
      planDoc(replaceLine(STRATEGIC_LINES, 'node_type:', 'node_type: plan')),
    );
    expect(isErr(result)).toBe(true);
  });

  it('rejects an unknown frontmatter key (closed shape)', () => {
    const result = validatePlanFile('p.plan.md', planDoc([...DELIVERY_LINES, 'kind: executable']));
    if (isOk(result)) {
      expect.fail('should reject');
    }
    expect(result.error.messages.join('\n')).toContain('kind');
  });

  it('requires a complete ratification stamp when status is ratified', () => {
    const result = validatePlanFile(
      'p.plan.md',
      planDoc(replaceLine(STRATEGIC_LINES, 'status:', 'status: ratified')),
    );
    if (isOk(result)) {
      expect.fail('should reject');
    }
    const joined = result.error.messages.join('\n');
    expect(joined).toContain('ratified_by');
    expect(joined).toContain('ratified_where');
  });

  it('accepts a ratified plan whose stamp is complete', () => {
    const lines = [
      ...replaceLine(
        replaceLine(
          replaceLine(
            replaceLine(STRATEGIC_LINES, 'status:', 'status: ratified'),
            'ratified_by:',
            'ratified_by: The Owner',
          ),
          'ratified_date:',
          'ratified_date: 2026-07-23',
        ),
        'ratified_where:',
        'ratified_where: decisions register D23',
      ),
    ];
    expect(isOk(validatePlanFile('p.plan.md', planDoc(lines)))).toBe(true);
  });

  it("requires superseded_by when status is 'superseded'", () => {
    const result = validatePlanFile(
      'p.plan.md',
      planDoc(replaceLine(DELIVERY_LINES, 'status:', 'status: superseded')),
    );
    if (isOk(result)) {
      expect.fail('should reject');
    }
    expect(result.error.messages.join('\n')).toContain('superseded_by');
  });

  it('requires gate_expiry_default on strategic nodes and forbids it elsewhere', () => {
    const missing = validatePlanFile(
      's.plan.md',
      planDoc(dropLine(STRATEGIC_LINES, 'gate_expiry_default:')),
    );
    if (isOk(missing)) {
      expect.fail('strategic without tempo should reject');
    }
    expect(missing.error.messages.join('\n')).toContain('gate_expiry_default');

    const forbidden = validatePlanFile(
      'd.plan.md',
      planDoc([...DELIVERY_LINES, 'gate_expiry_default: P3D']),
    );
    if (isOk(forbidden)) {
      expect.fail('delivery with tempo should reject');
    }
    expect(forbidden.error.messages.join('\n')).toContain('gate_expiry_default');
  });

  it('rejects a malformed gate_expiry_default duration', () => {
    const result = validatePlanFile(
      's.plan.md',
      planDoc(replaceLine(STRATEGIC_LINES, 'gate_expiry_default:', 'gate_expiry_default: 3 days')),
    );
    expect(isErr(result)).toBe(true);
  });

  it('rejects a sub-day gate_expiry_default (the grammar is day-scale by design)', () => {
    const result = validatePlanFile(
      's.plan.md',
      planDoc(replaceLine(STRATEGIC_LINES, 'gate_expiry_default:', 'gate_expiry_default: PT12H')),
    );
    expect(isErr(result)).toBe(true);
  });

  it('requires serves on strategic and delivery nodes', () => {
    const strategic = validatePlanFile('s.plan.md', planDoc(dropLine(STRATEGIC_LINES, 'serves:')));
    expect(isErr(strategic)).toBe(true);
    const delivery = validatePlanFile('d.plan.md', planDoc(dropLine(DELIVERY_LINES, 'serves:')));
    expect(isErr(delivery)).toBe(true);
  });

  it('requires impact_areas on every node', () => {
    const lines = DELIVERY_LINES.filter(
      (line) =>
        !line.startsWith('impact_areas') &&
        !line.startsWith('  - served') &&
        !line.startsWith('  - guidance'),
    );
    expect(isErr(validatePlanFile('d.plan.md', planDoc(lines)))).toBe(true);
  });

  it('rejects a malformed ticket reference', () => {
    const result = validatePlanFile(
      'd.plan.md',
      planDoc(replaceLine(DELIVERY_LINES, '  - MCP-101', '  - ticket 101')),
    );
    expect(isErr(result)).toBe(true);
  });

  it('accepts a RATIFIED ticketless delivery plan — tickets are optional visibility metadata', () => {
    // The 2026-08-07 amendment: plan validity is repo-internal; no
    // ticket-existence obligation exists at any level.
    const result = validatePlanFile('d.plan.md', planDoc(ratified(ticketless(DELIVERY_LINES))));
    expect(isOk(result)).toBe(true);
  });

  it('rejects an owner gate without an absolute expiry', () => {
    const result = validatePlanFile(
      'd.plan.md',
      planDoc([
        ...DELIVERY_LINES,
        'owner_gates:',
        '  - awaiting: owner-decision',
        '    clears_when: The protocol is agreed',
      ]),
    );
    if (isOk(result)) {
      expect.fail('should reject');
    }
    expect(result.error.messages.join('\n')).toContain('expires');
  });

  it('rejects an unknown owner-gate awaiting value (closed enum)', () => {
    const result = validatePlanFile(
      'd.plan.md',
      planDoc([
        ...DELIVERY_LINES,
        'owner_gates:',
        '  - awaiting: vibes',
        '    clears_when: Never',
        '    expires: 2026-07-26',
      ]),
    );
    expect(isErr(result)).toBe(true);
  });

  it('fails closed on a file with no frontmatter block', () => {
    const result = validatePlanFile('p.plan.md', '# Just a body\n');
    if (isOk(result)) {
      expect.fail('should reject');
    }
    expect(result.error.messages[0]).toContain('no YAML frontmatter');
  });

  it('fails closed on unparseable YAML', () => {
    expect(isErr(validatePlanFile('p.plan.md', planDoc(['id: [unclosed'])))).toBe(true);
  });
});

describe('validateCorpus — cross-file resolution', () => {
  function corpus(): ParsedPlanFile[] {
    return [
      parsedFixture('strategic/fixture-release.plan.md', STRATEGIC_LINES),
      parsedFixture('delivery/fixture-lane.plan.md', DELIVERY_LINES),
    ];
  }

  it('accepts a coherent corpus', () => {
    expect(validateCorpus(corpus(), choiceRegistry(), impactAreas())).toEqual([]);
  });

  it('accepts a ratified ticketless delivery plan beside a ticketed strategic sibling — no ticket-existence obligation at any level (2026-08-07 amendment)', () => {
    // Red-proof by history: this exact corpus failed under the removed
    // derived-anchoring rule (the ticketed strategic node anchored the
    // subtree, rejecting its ratified ticketless delivery plan).
    const files = [
      parsedFixture('strategic/fixture-release.plan.md', [
        ...STRATEGIC_LINES,
        'tickets:',
        '  - MCP-101',
      ]),
      parsedFixture('delivery/fixture-lane.plan.md', ratified(ticketless(DELIVERY_LINES))),
    ];
    expect(validateCorpus(files, choiceRegistry(), impactAreas())).toEqual([]);
  });

  it('rejects an empty corpus — never a vacuous green', () => {
    const failures = validateCorpus([], choiceRegistry(), impactAreas());
    expect(failures.length).toBeGreaterThan(0);
    expect(failures[0]?.messages.join('\n')).toContain('empty');
  });

  it('rejects a strategic node whose serves does not resolve against the published choice registry', () => {
    const files = [
      parsedFixture(
        'strategic/fixture-release.plan.md',
        replaceLine(STRATEGIC_LINES, 'serves:', 'serves: FRAME-999'),
      ),
    ];
    const failures = validateCorpus(files, choiceRegistry(), impactAreas());
    expect(failures.map((f) => f.messages.join('\n')).join('\n')).toContain('does not resolve');
  });

  it('rejects a delivery plan whose serves names no strategic node in the corpus', () => {
    const files = [
      parsedFixture(
        'delivery/fixture-lane.plan.md',
        replaceLine(DELIVERY_LINES, 'serves:', 'serves: no-such-node'),
      ),
    ];
    const failures = validateCorpus(files, choiceRegistry(), impactAreas());
    expect(failures.map((f) => f.messages.join('\n')).join('\n')).toContain('no strategic node');
  });

  it('rejects an impact_areas member absent from the closed registry', () => {
    const files = [
      parsedFixture('strategic/fixture-release.plan.md', [
        ...dropLine(dropLine(STRATEGIC_LINES, 'impact_areas:'), '  - served-surface'),
        'impact_areas:',
        '  - rogue-area',
      ]),
    ];
    const failures = validateCorpus(files, choiceRegistry(), impactAreas());
    expect(failures.map((f) => f.messages.join('\n')).join('\n')).toContain('rogue-area');
  });

  it('rejects a depends_on edge naming a plan id absent from the corpus', () => {
    const files = [
      parsedFixture('strategic/fixture-release.plan.md', STRATEGIC_LINES),
      parsedFixture('delivery/fixture-lane.plan.md', [
        ...DELIVERY_LINES,
        'depends_on:',
        '  - plan: ghost-plan',
        '    kind: blocking',
      ]),
    ];
    const failures = validateCorpus(files, choiceRegistry(), impactAreas());
    expect(failures.map((f) => f.messages.join('\n')).join('\n')).toContain('ghost-plan');
  });

  it('rejects duplicate plan ids across the corpus', () => {
    const files = [
      parsedFixture('strategic/one.plan.md', STRATEGIC_LINES),
      parsedFixture('strategic/two.plan.md', STRATEGIC_LINES),
    ];
    const failures = validateCorpus(files, choiceRegistry(), impactAreas());
    expect(failures.map((f) => f.messages.join('\n')).join('\n')).toContain('duplicate');
  });
});

describe('loadCorpus — corpus discovery', () => {
  it('collects a plan file under any subdirectory — directory names carry no archive semantics', async () => {
    const plansRoot = path.join('/repo', '.agent/plans');
    const fileSystem: CorpusFileSystem = {
      readdir: (dir) => {
        if (dir === plansRoot) {
          return Promise.resolve([{ name: 'archive', isDirectory: true }]);
        }
        if (dir === path.join(plansRoot, 'archive')) {
          return Promise.resolve([{ name: 'moved.plan.md', isDirectory: false }]);
        }
        return Promise.resolve([]);
      },
      readFile: () => Promise.resolve(planDoc(STRATEGIC_LINES)),
    };
    const corpus = await loadCorpus('/repo', fileSystem);
    expect(corpus.fileFailures).toEqual([]);
    expect(corpus.parsed.map((file) => file.path)).toEqual([
      path.join('.agent/plans', 'archive', 'moved.plan.md'),
    ]);
  });
});

describe('validatePlanFile — fenced yaml must parse', () => {
  const FENCE = '`'.repeat(3);
  const FRONTMATTER = [
    '---',
    'id: pins-a-workflow',
    'node_type: delivery',
    'name: "Pins a workflow file"',
    'overview: "A node whose fenced yaml is the file a seat copies verbatim."',
    'status: sketch',
    'serves: some-strategic-node',
    'impact_areas:',
    '  - practice-and-estate',
    'last_updated: 2026-09-11',
    '---',
    '',
  ];

  function nodeWithRunLine(runLine: string): string {
    return [
      ...FRONTMATTER,
      `${FENCE}yaml`,
      'name: Upstream mirror',
      'jobs:',
      '  mirror:',
      '    steps:',
      '      - name: Report in sync',
      runLine,
      FENCE,
      '',
    ].join('\n');
  }

  it('accepts a node whose fenced yaml parses', () => {
    const outcome = validatePlanFile(
      '.agent/plans/delivery/pins.plan.md',
      nodeWithRunLine('        run: |\n          echo "In sync: nothing to do."'),
    );

    expect(isOk(outcome)).toBe(true);
  });

  it('rejects the exact shape that pinned a non-loading workflow on 2026-09-11', () => {
    // A single-line `run:` value carrying a colon-space inside a plain scalar.
    // Two owner-ratified nodes pinned this; neither workflow could have loaded,
    // and only a seat that chose to run a parser caught it.
    const outcome = validatePlanFile(
      '.agent/plans/delivery/pins.plan.md',
      nodeWithRunLine('        run: echo "In sync: main equals the parent."'),
    );

    expect(isErr(outcome)).toBe(true);
    if (isErr(outcome)) {
      expect(outcome.error.messages.join(' ')).toContain('fenced yaml block 1 does not parse');
    }
  });

  /**
   * The same broken `run:` line, inside every other ordinary Markdown fence an
   * author reaches for. Each is legal Markdown rendering a YAML block, so a
   * check reading one literal spelling hands back the false green it exists to
   * remove.
   */
  const BODY = [
    'name: Upstream mirror',
    'jobs:',
    '  mirror:',
    '    steps:',
    '      - name: Report in sync',
    '        run: echo "In sync: main equals the parent."',
  ];
  const TILDE = '~'.repeat(3);
  const LONG_FENCE = '`'.repeat(4);

  const otherFenceSpellings: readonly (readonly [string, readonly string[]])[] = [
    ['the yml info string', [`${FENCE}yml`, ...BODY, FENCE]],
    ['a tilde fence', [`${TILDE}yaml`, ...BODY, TILDE]],
    ['an indented fence', [`   ${FENCE}yaml`, ...BODY.map((line) => `   ${line}`), `   ${FENCE}`]],
    ['a four-backtick fence', [`${LONG_FENCE}yaml`, ...BODY, LONG_FENCE]],
    ['an info string carrying a title', [`${FENCE}yaml title="ci.yml"`, ...BODY, FENCE]],
  ];

  for (const [spelling, lines] of otherFenceSpellings) {
    it(`reads ${spelling} as a yaml block, so the same defect cannot pass under it`, () => {
      const outcome = validatePlanFile(
        '.agent/plans/delivery/pins.plan.md',
        [...FRONTMATTER, ...lines, ''].join('\n'),
      );

      expect(isErr(outcome)).toBe(true);
      if (isErr(outcome)) {
        expect(outcome.error.messages.join(' ')).toContain('fenced yaml block 1 does not parse');
      }
    });
  }

  /**
   * Blocks OUTSIDE the contract. A pinned file goes in a top-level fence; a
   * YAML block nested in a blockquote or a list item is illustrative prose,
   * not a file a seat copies, so it is neither read nor refused. These cases
   * put that boundary on the record as a decision rather than an accident — an
   * earlier form of this check refused them, which took five review rounds and
   * produced two false positives on valid documents before it turned out the
   * CLAIM was the defect, not the coverage.
   */
  const nestedBlocks: readonly (readonly [string, readonly string[]])[] = [
    ['a blockquote', [`> ${FENCE}yaml`, ...BODY.map((line) => `> ${line}`), `> ${FENCE}`]],
    ['a bullet-list marker', [`- ${FENCE}yaml`, ...BODY.map((l) => `  ${l}`), `  ${FENCE}`]],
    ['an ordered-list marker', [`1. ${TILDE}yml`, ...BODY.map((l) => `   ${l}`), `   ${TILDE}`]],
    [
      'a list inside a blockquote',
      [`> - ${FENCE}yaml`, ...BODY.map((l) => `>   ${l}`), `>   ${FENCE}`],
    ],
    // CommonMark reads a four-space-indented line at top level as an indented
    // CODE block, so its text is literal and not a fence at all. Telling that
    // apart from a fence indented inside a list item needs container state,
    // which is why guessing was the wrong move (Copilot, round 7).
    ['a four-space indent', [`    ${FENCE}yaml`, ...BODY.map((l) => `    ${l}`), `    ${FENCE}`]],
  ];

  for (const [container, lines] of nestedBlocks) {
    it(`neither reads nor refuses a yaml block inside ${container}`, () => {
      const outcome = validatePlanFile(
        '.agent/plans/delivery/pins.plan.md',
        [...FRONTMATTER, ...lines, ''].join('\n'),
      );

      expect(isOk(outcome)).toBe(true);
    });
  }

  const proseMentioningAFence: readonly (readonly [string, string])[] = [
    ['a sentence', `Pin the workflow in a ${FENCE}yaml block at the top level.`],
    ['a dated line', `2026-09-11: ${FENCE}yaml is the required spelling.`],
    ['a list item of prose', `- see the ${FENCE}yaml example above`],
  ];

  for (const [shape, line] of proseMentioningAFence) {
    it(`leaves ${shape} that merely mentions a fence alone`, () => {
      const outcome = validatePlanFile(
        '.agent/plans/delivery/pins.plan.md',
        [...FRONTMATTER, line, ''].join('\n'),
      );

      expect(isOk(outcome)).toBe(true);
    });
  }

  it('a non-yaml fence is left alone — the check reads YAML blocks, not every block', () => {
    const outcome = validatePlanFile(
      '.agent/plans/delivery/pins.plan.md',
      [...FRONTMATTER, `${FENCE}bash`, 'echo "In sync: not yaml at all"', FENCE, ''].join('\n'),
    );

    expect(isOk(outcome)).toBe(true);
  });

  it('a fence nested inside a longer fence does not close it, so the outer block parses as one', () => {
    // A node pinning a file that itself contains a fence must open a longer
    // run. Treating the inner fence as the closer would slice the block in two
    // and parse a fragment.
    const outcome = validatePlanFile(
      '.agent/plans/delivery/pins.plan.md',
      [
        ...FRONTMATTER,
        `${LONG_FENCE}yaml`,
        'name: Upstream mirror',
        'description: |',
        `  ${FENCE}`,
        '  an embedded fence',
        `  ${FENCE}`,
        LONG_FENCE,
        '',
      ].join('\n'),
    );

    expect(isOk(outcome)).toBe(true);
  });
});
