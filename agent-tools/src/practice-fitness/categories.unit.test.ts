import { describe, expect, it } from 'vitest';

import {
  categorizeFitnessFile,
  formatFitnessResultsByCategory,
  groupFitnessResultsByCategory,
} from './categories.js';
import type { FitnessResult } from './evaluate.js';
import type { FitnessContentRole, FitnessZone } from './model.js';

function makeResult(
  filename: string,
  contentRole: FitnessContentRole,
  overallZone: FitnessZone = 'healthy',
): FitnessResult {
  return {
    filename,
    contentText: 'body',
    totalLines: 1,
    totalChars: 4,
    estimatedTokens: 1,
    maxProseLen: 1,
    maxProseLineNum: 1,
    proseViolationCount: 0,
    proseViolations: [],
    targetLines: null,
    limitLines: null,
    limitChars: null,
    maxProseLineWidth: null,
    targetTokens: null,
    limitTokens: null,
    contentRole,
    lineZone: null,
    charZone: null,
    proseZone: null,
    tokenZone: null,
    overallZone,
    zoneMessages: [],
    configurationFindings: [],
  };
}

describe('categorizeFitnessFile', () => {
  it('classifies any drainable-buffer role as a drainable buffer, whatever its path', () => {
    expect(categorizeFitnessFile('.agent/memory/active/napkin.md', 'drainable-buffer')).toBe(
      'drainable-buffer',
    );
    expect(
      categorizeFitnessFile('.agent/memory/operational/pending-graduations.md', 'drainable-buffer'),
    ).toBe('drainable-buffer');
  });

  it('classifies the structural tiers by path', () => {
    expect(categorizeFitnessFile('.agent/practice-core/practice.md', 'reference')).toBe(
      'practice-core',
    );
    expect(categorizeFitnessFile('.agent/directives/principles.md', 'reference')).toBe(
      'repo-doctrine',
    );
    expect(categorizeFitnessFile('.agent/memory/operational/repo-continuity.md', 'reference')).toBe(
      'operational-memory',
    );
  });

  it('classifies non-.agent reference files as project documentation', () => {
    expect(categorizeFitnessFile('docs/governance/development-practice.md', 'reference')).toBe(
      'project-documentation',
    );
    expect(categorizeFitnessFile('CONTRIBUTING.md', 'reference')).toBe('project-documentation');
  });
});

describe('groupFitnessResultsByCategory', () => {
  it('returns non-empty groups in the owner-specified order (buffers → other → doctrine → core)', () => {
    const results = [
      makeResult('.agent/practice-core/practice.md', 'reference'),
      makeResult('docs/governance/development-practice.md', 'reference'),
      makeResult('.agent/memory/active/napkin.md', 'drainable-buffer'),
      makeResult('.agent/directives/principles.md', 'reference'),
      makeResult('.agent/memory/operational/repo-continuity.md', 'reference'),
    ];

    const groups = groupFitnessResultsByCategory(results);

    expect(groups.map((group) => group.category)).toStrictEqual([
      'drainable-buffer',
      'operational-memory',
      'project-documentation',
      'repo-doctrine',
      'practice-core',
    ]);
  });

  it('omits empty categories', () => {
    const groups = groupFitnessResultsByCategory([
      makeResult('.agent/memory/active/napkin.md', 'drainable-buffer'),
    ]);

    expect(groups.map((group) => group.category)).toStrictEqual(['drainable-buffer']);
  });

  it('orders files within a category worst-zone first (critical → hard → soft → healthy)', () => {
    const groups = groupFitnessResultsByCategory([
      makeResult('.agent/directives/healthy.md', 'reference', 'healthy'),
      makeResult('.agent/directives/hard.md', 'reference', 'hard'),
      makeResult('.agent/directives/soft.md', 'reference', 'soft'),
      makeResult('.agent/directives/critical.md', 'reference', 'critical'),
    ]);

    expect(groups[0]?.results.map((result) => result.filename)).toStrictEqual([
      '.agent/directives/critical.md',
      '.agent/directives/hard.md',
      '.agent/directives/soft.md',
      '.agent/directives/healthy.md',
    ]);
  });
});

describe('formatFitnessResultsByCategory', () => {
  it('renders a counted header per non-empty category, in display order', () => {
    const rendered = formatFitnessResultsByCategory([
      makeResult('.agent/directives/principles.md', 'reference'),
      makeResult('.agent/memory/active/napkin.md', 'drainable-buffer'),
    ]);

    expect(rendered).toContain('Drainable buffers (1):');
    expect(rendered).toContain('Repo doctrine (1):');
    expect(rendered).toContain('.agent/memory/active/napkin.md');
    // Buffers are rendered before repo doctrine.
    expect(rendered.indexOf('Drainable buffers')).toBeLessThan(rendered.indexOf('Repo doctrine'));
  });
});
