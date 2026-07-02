import { describe, expect, it } from 'vitest';

import type { Candidate } from '../judgment-schemas.js';
import {
  assembleGroundingLines,
  mapPrompt,
  metaPrompt,
  reducePrompt,
  votePrompt,
} from './prompts.js';

/**
 * The prompt text is behaviour. These tests pin the load-bearing clauses each agent
 * must receive — the actuator grain, the kind rule, the conditional falsifiers — and
 * the branch structure of the vote prompt. (The one-time byte-diff against the retired
 * hand-authored scripts is migration evidence in the Phase-3 commit; these tests carry
 * the contract forward once those scripts are deleted.)
 */

const candidate: Candidate = {
  id: 'C01',
  pattern: 'pre-commit promotes peer-owned files via repo-wide format:root',
  kind: 'recurrence',
  isAbsenceClaim: false,
  supportingWindows: ['w01', 'w08'],
  supportingLeafIds: ['w01-L01', 'w08-L03'],
  groundingCount: 4,
};

const leafById = new Map([
  [
    'w01-L01',
    {
      id: 'w01-L01',
      window: 'w01',
      grounding: [{ napkinDate: '2026-02-16', quote: 'swept peer files' }],
    },
  ],
]);

describe('mapPrompt', () => {
  const prompt = mapPrompt({ window: 'w03', files: ['a.md', 'b.md'] });

  it('names the window, lists every file, and scopes extraction to this window only', () => {
    expect(prompt).toContain('ONE time-contiguous window: w03');
    expect(prompt).toContain('  - a.md\n  - b.md');
    expect(prompt).toContain('Emit ONLY leaves for THIS window.');
  });

  it('carries the actuator-grain and time-point clauses (the v3 extraction fix)', () => {
    expect(prompt).toContain('GRAIN — name the ACTUATOR');
    expect(prompt).toContain('TIME-POINT');
    expect(prompt).toContain(`w03-L01`);
  });
});

describe('reducePrompt', () => {
  const leaves = [
    {
      id: 'w01-L01',
      window: 'w01',
      category: 'motif' as const,
      statement: 'a statement',
      grounding: [{ napkinDate: '2026-02-16', quote: 'q' }],
      confidence: 'high' as const,
    },
  ];
  const prompt = reducePrompt(leaves);

  it('clusters by mechanism with no candidate-count cap, and embeds the leaves verbatim', () => {
    expect(prompt).toContain('CLUSTER BY MECHANISM, NOT THEME');
    expect(prompt).toContain('There is NO target candidate count.');
    expect(prompt).toContain(JSON.stringify(leaves));
  });

  it('carries the kind rule and the bounded representative-leaf-ids instruction', () => {
    expect(prompt).toContain("KIND RULE: `kind` is the PATTERN's type, NEVER a leaf category");
    expect(prompt).toContain('UP TO 10 of the MOST REPRESENTATIVE leaf ids');
  });
});

describe('assembleGroundingLines', () => {
  it('renders each citation as a window-and-date-anchored excerpt line', () => {
    expect(assembleGroundingLines(candidate, leafById)).toBe(
      '  - [w01 2026-02-16] swept peer files',
    );
  });

  it('skips ids with no leaf (missing grounding shows as empty, handled by the prompt fallback)', () => {
    expect(assembleGroundingLines({ ...candidate, supportingLeafIds: ['absent'] }, leafById)).toBe(
      '',
    );
  });
});

describe('votePrompt', () => {
  it('names the lens when dispatched with one, and the even-judgment line when not', () => {
    const base = { candidate, groundingLines: 'g' };
    expect(votePrompt({ ...base, lens: 'base-rate' })).toContain(
      'Judge PRIMARILY through the "base-rate" lens',
    );
    expect(votePrompt({ ...base, lens: undefined })).toContain(
      'Judge across all four tests evenly.',
    );
  });

  it('adds the absence falsifier only for absence claims', () => {
    const absence = votePrompt({
      candidate: { ...candidate, isAbsenceClaim: true },
      lens: undefined,
      groundingLines: 'g',
    });
    expect(absence).toContain('ABSENCE claim');
    expect(votePrompt({ candidate, lens: undefined, groundingLines: 'g' })).not.toContain(
      'ABSENCE claim',
    );
  });

  it.each(['trajectory', 'regime', 'relational-lagged', 'distributional'] as const)(
    'adds the longitudinal partition falsifier for kind %s',
    (kind) => {
      const prompt = votePrompt({
        candidate: { ...candidate, kind },
        lens: undefined,
        groundingLines: 'g',
      });
      expect(prompt).toContain(`LONGITUDINAL claim (kind=${kind})`);
      expect(prompt).toContain('PARTITION across the corpus timeline');
    },
  );

  it('falls back to the explicit no-grounding line (the mass-kill guard is upstream, this names it)', () => {
    expect(votePrompt({ candidate, lens: undefined, groundingLines: '' })).toContain(
      '(no grounding citations were attached)',
    );
  });

  it('never asks the voter for a disposition — routing is deterministic downstream', () => {
    expect(votePrompt({ candidate, lens: undefined, groundingLines: 'g' })).toContain(
      'Do NOT emit any keep/kill/reroute decision',
    );
  });

  it('forbids tool use — the voter judges only from the supplied evidence, in one turn', () => {
    const prompt = votePrompt({ candidate, lens: undefined, groundingLines: 'g' });
    expect(prompt).toContain('you have no tools');
    expect(prompt).toContain('single required structured output call');
  });
});

describe('metaPrompt', () => {
  const baselines = [{ id: 'b1', population: 'emergent' as const, statement: 's' }];
  const dispositioned = [
    {
      id: 'C01',
      pattern: candidate.pattern,
      kind: candidate.kind,
      isAbsenceClaim: false,
      supportingWindows: candidate.supportingWindows,
      disposition: 'keep' as const,
    },
  ];
  const prompt = metaPrompt(dispositioned, baselines);

  it('uses the ∈ verdict-set glyph (the drift the old re-diff discipline missed)', () => {
    expect(prompt).toContain('verdict ∈ subsumes');
  });

  it('embeds baselines and dispositioned candidates verbatim and demands no aggregates', () => {
    expect(prompt).toContain(JSON.stringify(baselines));
    expect(prompt).toContain(JSON.stringify(dispositioned));
    expect(prompt).toContain('Emit NO numbers, fractions, or aggregate recall');
  });

  it('asks for corroboration claims against on-disk homes (the real-world-signal leg)', () => {
    expect(prompt).toContain('claimedHomePaths');
  });

  it('directs the meta agent to verify claimed homes with its read-only search tools', () => {
    expect(prompt).toContain('Verify with Glob/Grep/Read before naming');
  });
});
