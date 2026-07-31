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

  it('accepts a RATIFIED ticketless delivery plan at file level — the ticket rule is corpus-level', () => {
    // The 2026-07-31 amendment: the requirement binds only within
    // anchored subtrees, a serves-edge question answered in
    // validateCorpus, never by single-file shape.
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

describe('validateCorpus — execution-anchor consistency (the 2026-07-31 amendment)', () => {
  function renamed(lines: readonly string[], id: string): string[] {
    return replaceLine(lines, 'id:', `id: ${id}`);
  }

  function joinedFailures(files: ParsedPlanFile[]): string {
    return validateCorpus(files, choiceRegistry(), impactAreas())
      .map((failure) => `${failure.path}: ${failure.messages.join('\n')}`)
      .join('\n');
  }

  it('rejects a ratified ticketless delivery plan in an anchored subtree, naming the evidence', () => {
    const failures = validateCorpus(
      [
        parsedFixture('strategic/fixture-release.plan.md', STRATEGIC_LINES),
        parsedFixture(
          'delivery/sibling-with-ticket.plan.md',
          renamed(DELIVERY_LINES, 'fixture-sibling'),
        ),
        parsedFixture(
          'delivery/ticketless.plan.md',
          ratified(ticketless(renamed(DELIVERY_LINES, 'fixture-ticketless'))),
        ),
      ],
      choiceRegistry(),
      impactAreas(),
    );
    expect(failures).toEqual([
      { path: 'delivery/ticketless.plan.md', messages: [expect.stringContaining('anchored')] },
    ]);
    expect(failures[0]?.messages[0]).toContain('delivery/sibling-with-ticket.plan.md');
    expect(failures[0]?.messages[0]).toContain('MCP-101');
  });

  it('accepts a ratified ticketless delivery plan when nothing in its subtree names a ticket', () => {
    const files = [
      parsedFixture('strategic/fixture-release.plan.md', STRATEGIC_LINES),
      parsedFixture('delivery/ticketless.plan.md', ratified(ticketless(DELIVERY_LINES))),
    ];
    expect(validateCorpus(files, choiceRegistry(), impactAreas())).toEqual([]);
  });

  it('accepts a ratified ticketed delivery plan in an anchored subtree', () => {
    const files = [
      parsedFixture('strategic/fixture-release.plan.md', STRATEGIC_LINES),
      parsedFixture('delivery/ticketed.plan.md', ratified(DELIVERY_LINES)),
    ];
    expect(validateCorpus(files, choiceRegistry(), impactAreas())).toEqual([]);
  });

  const EXEMPT_STATUS_SHAPES: Record<string, (lines: readonly string[]) => string[]> = {
    sketch: (lines) => [...lines],
    archived: (lines) => replaceLine(lines, 'status:', 'status: archived'),
    superseded: (lines) => [
      ...replaceLine(lines, 'status:', 'status: superseded'),
      'superseded_by: fixture-successor',
    ],
  };

  it.each(['sketch', 'archived', 'superseded'])(
    'leaves a %s ticketless delivery plan unbound even in an anchored subtree — the binding is at ratification',
    (status) => {
      const files = [
        parsedFixture('strategic/fixture-release.plan.md', STRATEGIC_LINES),
        parsedFixture(
          'delivery/sibling-with-ticket.plan.md',
          renamed(DELIVERY_LINES, 'fixture-sibling'),
        ),
        parsedFixture(
          `delivery/${status}-ticketless.plan.md`,
          EXEMPT_STATUS_SHAPES[status](ticketless(renamed(DELIVERY_LINES, 'fixture-exempt'))),
        ),
      ];
      expect(validateCorpus(files, choiceRegistry(), impactAreas())).toEqual([]);
    },
  );

  it("treats the strategic node's own tickets as anchoring evidence for its subtree", () => {
    const joined = joinedFailures([
      parsedFixture('strategic/fixture-release.plan.md', [
        ...STRATEGIC_LINES,
        'tickets:',
        '  - MCP-150',
      ]),
      parsedFixture('delivery/ticketless.plan.md', ratified(ticketless(DELIVERY_LINES))),
    ]);
    expect(joined).toContain('delivery/ticketless.plan.md');
    expect(joined).toContain('strategic/fixture-release.plan.md');
  });

  it("prefers the governing node's own ticket as the witness over a serving plan's", () => {
    const failures = validateCorpus(
      [
        parsedFixture('strategic/fixture-release.plan.md', [
          ...STRATEGIC_LINES,
          'tickets:',
          '  - MCP-150',
        ]),
        parsedFixture(
          'delivery/a-sibling-with-ticket.plan.md',
          renamed(DELIVERY_LINES, 'fixture-sibling'),
        ),
        parsedFixture(
          'delivery/ticketless.plan.md',
          ratified(ticketless(renamed(DELIVERY_LINES, 'fixture-ticketless'))),
        ),
      ],
      choiceRegistry(),
      impactAreas(),
    );
    expect(failures[0]?.messages[0]).toContain('strategic/fixture-release.plan.md names MCP-150');
  });

  it('accepts a live ticketless plan whose only ticketed siblings are archived — archiving the last live ticketed plan is the de-anchor act', () => {
    const files = [
      parsedFixture('strategic/fixture-release.plan.md', STRATEGIC_LINES),
      parsedFixture(
        'archive/archived-with-ticket.plan.md',
        replaceLine(renamed(DELIVERY_LINES, 'fixture-archived'), 'status:', 'status: archived'),
      ),
      parsedFixture(
        'delivery/ticketless.plan.md',
        ratified(ticketless(renamed(DELIVERY_LINES, 'fixture-ticketless'))),
      ),
    ];
    expect(validateCorpus(files, choiceRegistry(), impactAreas())).toEqual([]);
  });

  it('keeps a subtree anchored when the live ticketed witness merely moves path — de-anchoring is the status transition, never a relocation', () => {
    const failures = validateCorpus(
      [
        parsedFixture('strategic/fixture-release.plan.md', STRATEGIC_LINES),
        parsedFixture(
          'archive/moved-but-live-with-ticket.plan.md',
          renamed(DELIVERY_LINES, 'fixture-moved'),
        ),
        parsedFixture(
          'delivery/ticketless.plan.md',
          ratified(ticketless(renamed(DELIVERY_LINES, 'fixture-ticketless'))),
        ),
      ],
      choiceRegistry(),
      impactAreas(),
    );
    expect(failures.map((failure) => failure.path)).toEqual(['delivery/ticketless.plan.md']);
    expect(failures[0]?.messages[0]).toContain(
      'archive/moved-but-live-with-ticket.plan.md names MCP-101',
    );
  });

  it('counts a live ticketed runbook serving the subtree as anchoring evidence', () => {
    const runbookLines = [
      'id: fixture-runbook',
      'node_type: runbook',
      'name: Fixture runbook',
      'overview: One-line scope.',
      'status: sketch',
      'ratified_by: null',
      'ratified_date: null',
      'ratified_where: null',
      'serves: fixture-release',
      'impact_areas:',
      '  - served-surface',
      'tickets:',
      '  - MCP-131',
      'last_updated: 2026-07-23',
    ];
    const failures = validateCorpus(
      [
        parsedFixture('strategic/fixture-release.plan.md', STRATEGIC_LINES),
        parsedFixture('runbooks/fixture-runbook.plan.md', runbookLines),
        parsedFixture(
          'delivery/ticketless.plan.md',
          ratified(ticketless(renamed(DELIVERY_LINES, 'fixture-ticketless'))),
        ),
      ],
      choiceRegistry(),
      impactAreas(),
    );
    expect(failures.map((failure) => failure.path)).toEqual(['delivery/ticketless.plan.md']);
    expect(failures[0]?.messages[0]).toContain('runbooks/fixture-runbook.plan.md names MCP-131');
  });

  it('scopes anchoring to each subtree, never the whole corpus', () => {
    const failures = validateCorpus(
      [
        parsedFixture('strategic/fixture-release.plan.md', STRATEGIC_LINES),
        parsedFixture(
          'delivery/sibling-with-ticket.plan.md',
          renamed(DELIVERY_LINES, 'fixture-sibling'),
        ),
        parsedFixture(
          'delivery/anchored-ticketless.plan.md',
          ratified(ticketless(renamed(DELIVERY_LINES, 'fixture-caught'))),
        ),
        parsedFixture(
          'strategic/fixture-second.plan.md',
          renamed(STRATEGIC_LINES, 'fixture-second-release'),
        ),
        parsedFixture(
          'delivery/unanchored-ticketless.plan.md',
          ratified(
            ticketless(
              replaceLine(
                renamed(DELIVERY_LINES, 'fixture-free'),
                'serves:',
                'serves: fixture-second-release',
              ),
            ),
          ),
        ),
      ],
      choiceRegistry(),
      impactAreas(),
    );
    expect(failures.map((failure) => failure.path)).toEqual([
      'delivery/anchored-ticketless.plan.md',
    ]);
  });

  it('reports only the serves failure when a ticketless plan serves no known subtree', () => {
    const failures = validateCorpus(
      [
        parsedFixture(
          'delivery/orphan.plan.md',
          ratified(ticketless(replaceLine(DELIVERY_LINES, 'serves:', 'serves: no-such-node'))),
        ),
      ],
      choiceRegistry(),
      impactAreas(),
    );
    expect(failures).toHaveLength(1);
    expect(failures[0]?.messages).toHaveLength(1);
    expect(failures[0]?.messages[0]).toContain('no strategic node');
  });

  it('treats an explicit empty tickets list exactly like an absent one, as subject and as evidence', () => {
    const emptyTickets = replaceLine(
      dropLine(DELIVERY_LINES, '  - MCP-101'),
      'tickets:',
      'tickets: []',
    );
    const files = [
      parsedFixture('strategic/fixture-release.plan.md', STRATEGIC_LINES),
      parsedFixture('delivery/empty-evidence.plan.md', renamed(emptyTickets, 'fixture-empty')),
      parsedFixture(
        'delivery/empty-subject.plan.md',
        ratified(renamed(emptyTickets, 'fixture-subject')),
      ),
    ];
    expect(validateCorpus(files, choiceRegistry(), impactAreas())).toEqual([]);
  });

  it('binds delivery plans only — a ratified ticketless runbook in an anchored subtree carries no obligation', () => {
    const runbookLines = ratified([
      'id: fixture-runbook',
      'node_type: runbook',
      'name: Fixture runbook',
      'overview: One-line scope.',
      'status: sketch',
      'ratified_by: null',
      'ratified_date: null',
      'ratified_where: null',
      'serves: fixture-release',
      'impact_areas:',
      '  - served-surface',
      'last_updated: 2026-07-23',
    ]);
    const files = [
      parsedFixture('strategic/fixture-release.plan.md', STRATEGIC_LINES),
      parsedFixture(
        'delivery/sibling-with-ticket.plan.md',
        renamed(DELIVERY_LINES, 'fixture-sibling'),
      ),
      parsedFixture('runbooks/fixture-runbook.plan.md', runbookLines),
    ];
    expect(validateCorpus(files, choiceRegistry(), impactAreas())).toEqual([]);
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
