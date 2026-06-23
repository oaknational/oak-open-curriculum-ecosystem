import { describe, expect, it } from 'vitest';

import {
  categoryLabel,
  parsePatternEntry,
  type PatternEntry,
  renderPatternIndex,
  spliceIndexSection,
} from './validate-patterns-index-helpers.js';

const FILE = (fm: Record<string, string>): string =>
  ['---', ...Object.entries(fm).map(([k, v]) => `${k}: ${v}`), '---', '', 'body'].join('\n');

describe('parsePatternEntry', () => {
  it('reads name, category, use_this_when and polarity, stripping quotes', () => {
    const entry = parsePatternEntry(
      'x.md',
      FILE({
        name: '"Quoted Name"',
        polarity: 'anti-pattern',
        category: 'code',
        use_this_when: 'a thing happens',
      }),
    );
    expect(entry).toEqual({
      filename: 'x.md',
      name: 'Quoted Name',
      category: 'code',
      useThisWhen: 'a thing happens',
      isAntiPattern: true,
    });
  });

  it('treats use_this_when as optional (the corpus is not uniform)', () => {
    expect(parsePatternEntry('y.md', FILE({ name: 'N', category: 'code' }))).toEqual({
      filename: 'y.md',
      name: 'N',
      category: 'code',
      useThisWhen: undefined,
      isAntiPattern: false,
    });
  });

  it('falls back to the first H1 when name is absent', () => {
    const content = `---\ncategory: agent\n---\n\n# Derived From Heading\n\nbody`;
    expect(parsePatternEntry('h.md', content)).toEqual({
      filename: 'h.md',
      name: 'Derived From Heading',
      category: 'agent',
      useThisWhen: undefined,
      isAntiPattern: false,
    });
  });

  it('reports a parse error only when category (the section key) is missing', () => {
    expect(parsePatternEntry('y.md', FILE({ name: 'N' }))).toEqual({
      filename: 'y.md',
      reason: 'missing frontmatter key: category',
    });
  });

  it('reports a parse error when there is no frontmatter', () => {
    expect(parsePatternEntry('z.md', 'no frontmatter here')).toEqual({
      filename: 'z.md',
      reason: 'no frontmatter block',
    });
  });
});

describe('categoryLabel', () => {
  it('title-cases hyphenated category keys', () => {
    expect(categoryLabel('code')).toBe('Code');
    expect(categoryLabel('test-architecture')).toBe('Test Architecture');
  });
});

describe('renderPatternIndex', () => {
  it('groups by category in canonical order, sorts by name, and counts each section', () => {
    const entries: PatternEntry[] = [
      {
        filename: 'b.md',
        name: 'Beta',
        category: 'code',
        useThisWhen: 'b case',
        isAntiPattern: false,
      },
      {
        filename: 'a.md',
        name: 'Alpha',
        category: 'code',
        useThisWhen: 'a case.',
        isAntiPattern: true,
      },
      {
        filename: 'p.md',
        name: 'Pee',
        category: 'process',
        useThisWhen: 'p case',
        isAntiPattern: false,
      },
    ];
    expect(renderPatternIndex(entries)).toBe(
      [
        '## Pattern Index',
        '',
        '### Code (2)',
        '',
        '- **Alpha** *(anti-pattern)* -- Use this when: a case. → [a.md](a.md)',
        '- **Beta** -- Use this when: b case. → [b.md](b.md)',
        '',
        '### Process (1)',
        '',
        '- **Pee** -- Use this when: p case. → [p.md](p.md)',
        '',
      ].join('\n'),
    );
  });

  it('omits the "Use this when" clause for an entry without the hint', () => {
    const entries: PatternEntry[] = [
      { filename: 'h.md', name: 'Hint-less', category: 'code', isAntiPattern: false },
    ];
    expect(renderPatternIndex(entries)).toContain('- **Hint-less** → [h.md](h.md)');
  });

  it('places an unknown category after the known ones', () => {
    const entries: PatternEntry[] = [
      { filename: 'n.md', name: 'N', category: 'novel', useThisWhen: 'n', isAntiPattern: false },
      { filename: 'c.md', name: 'C', category: 'code', useThisWhen: 'c', isAntiPattern: false },
    ];
    const out = renderPatternIndex(entries);
    expect(out.indexOf('### Code')).toBeLessThan(out.indexOf('### Novel'));
  });
});

describe('spliceIndexSection', () => {
  it('replaces from the Pattern Index heading to EOF, preserving the preamble', () => {
    const readme = '# Title\n\nintro\n\n## Pattern Index\n\n### Old (1)\n\n- stale\n';
    const generated = '## Pattern Index\n\n### Code (1)\n\n- fresh\n';
    expect(spliceIndexSection(readme, generated)).toBe(
      '# Title\n\nintro\n\n## Pattern Index\n\n### Code (1)\n\n- fresh\n',
    );
  });
});
