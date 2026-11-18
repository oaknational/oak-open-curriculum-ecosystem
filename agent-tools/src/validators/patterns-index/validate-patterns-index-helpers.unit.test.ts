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
        layer: 'general',
      }),
    );
    expect(entry).toEqual({
      filename: 'x.md',
      name: 'Quoted Name',
      category: 'code',
      useThisWhen: 'a thing happens',
      isAntiPattern: true,
      layer: 'general',
    });
  });

  it('treats use_this_when as optional (the corpus is not uniform)', () => {
    expect(
      parsePatternEntry('y.md', FILE({ name: 'N', category: 'code', layer: 'general' })),
    ).toEqual({
      filename: 'y.md',
      name: 'N',
      category: 'code',
      useThisWhen: undefined,
      isAntiPattern: false,
      layer: 'general',
    });
  });

  it('falls back to the first H1 when name is absent', () => {
    const content = `---\ncategory: agent\nlayer: general\n---\n\n# Derived From Heading\n\nbody`;
    expect(parsePatternEntry('h.md', content)).toEqual({
      filename: 'h.md',
      name: 'Derived From Heading',
      category: 'agent',
      useThisWhen: undefined,
      isAntiPattern: false,
      layer: 'general',
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

describe('parsePatternEntry layer contract', () => {
  it('refuses a pattern that declares no layer', () => {
    expect(parsePatternEntry('z.md', FILE({ name: 'Z', category: 'code' }))).toEqual({
      filename: 'z.md',
      reason: 'missing frontmatter key: layer',
    });
  });

  it('refuses a layer outside the closed set', () => {
    expect(
      parsePatternEntry('z.md', FILE({ name: 'Z', category: 'code', layer: 'universal' })),
    ).toEqual({
      filename: 'z.md',
      reason: 'unknown layer "universal" (expected one of general, family, contextual)',
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
        layer: 'general',
      },
      {
        filename: 'a.md',
        name: 'Alpha',
        category: 'code',
        useThisWhen: 'a case.',
        isAntiPattern: true,
        layer: 'general',
      },
      {
        filename: 'p.md',
        name: 'Pee',
        category: 'process',
        useThisWhen: 'p case',
        isAntiPattern: false,
        layer: 'family',
      },
    ];
    expect(renderPatternIndex(entries)).toBe(
      [
        '## Pattern Index',
        '',
        '### Code (2)',
        '',
        '- **Alpha** *(anti-pattern, general)* -- Use this when: a case. → [a.md](a.md)',
        '- **Beta** *(general)* -- Use this when: b case. → [b.md](b.md)',
        '',
        '### Process (1)',
        '',
        '- **Pee** *(family)* -- Use this when: p case. → [p.md](p.md)',
        '',
      ].join('\n'),
    );
  });

  it('omits the "Use this when" clause for an entry without the hint', () => {
    const entries: PatternEntry[] = [
      {
        filename: 'h.md',
        name: 'Hint-less',
        category: 'code',
        isAntiPattern: false,
        layer: 'general',
      },
    ];
    expect(renderPatternIndex(entries)).toContain('- **Hint-less** *(general)* → [h.md](h.md)');
  });

  it('places an unknown category after the known ones', () => {
    const entries: PatternEntry[] = [
      {
        filename: 'n.md',
        name: 'N',
        category: 'novel',
        useThisWhen: 'n',
        isAntiPattern: false,
        layer: 'general',
      },
      {
        filename: 'c.md',
        name: 'C',
        category: 'code',
        useThisWhen: 'c',
        isAntiPattern: false,
        layer: 'general',
      },
    ];
    const out = renderPatternIndex(entries);
    expect(out.indexOf('### Code')).toBeLessThan(out.indexOf('### Novel'));
  });

  it('renders an empty corpus as one sentence with no blank-line run', () => {
    expect(renderPatternIndex([])).toBe(
      '## Pattern Index\n\n*No repo-local pattern instances yet; the index fills as pattern files are authored here.*\n',
    );
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
