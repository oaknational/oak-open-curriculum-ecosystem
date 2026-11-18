import { describe, expect, it } from 'vitest';

import { prependRuleFrontmatter, renderRuleFrontmatter } from './render-rule-frontmatter.js';

describe('renderRuleFrontmatter', () => {
  it('renders a core declaration with classification then description', () => {
    expect(
      renderRuleFrontmatter({ name: 'r', classification: 'core', description: 'Plain words.' }),
    ).toBe('---\nclassification: core\ndescription: Plain words.\n---\n');
  });

  it('renders a situational declaration with trigger and a globs list, in that order', () => {
    expect(
      renderRuleFrontmatter({
        name: 'r',
        classification: 'situational',
        description: 'd',
        trigger: 'surface:test-authoring',
        globs: ['**/*.test.*', 'e2e/**/*'],
      }),
    ).toBe(
      [
        '---',
        'classification: situational',
        'description: d',
        'trigger: surface:test-authoring',
        'globs:',
        '  - "**/*.test.*"',
        '  - e2e/**/*',
        '---',
        '',
      ].join('\n'),
    );
  });

  it('omits globs on a situational declaration that has none', () => {
    expect(
      renderRuleFrontmatter({
        name: 'r',
        classification: 'situational',
        description: 'd',
        trigger: 'session:team',
        globs: [],
      }),
    ).toBe('---\nclassification: situational\ndescription: d\ntrigger: session:team\n---\n');
  });

  it('quotes a description that plain YAML could not carry, on one line', () => {
    const rendered = renderRuleFrontmatter({
      name: 'r',
      classification: 'core',
      description: 'Apply the lens: usable first time, no # tricks.',
    });
    expect(rendered).toBe(
      '---\nclassification: core\ndescription: "Apply the lens: usable first time, no # tricks."\n---\n',
    );
  });
});

describe('prependRuleFrontmatter', () => {
  it('places the block, then one blank line, then the rule text unchanged', () => {
    expect(
      prependRuleFrontmatter('# Title\n\nBody.\n', '---\nclassification: core\n---\n'),
    ).toEqual({
      ok: true,
      value: '---\nclassification: core\n---\n\n# Title\n\nBody.\n',
    });
  });

  it('refuses a rule that already carries a frontmatter block', () => {
    expect(
      prependRuleFrontmatter('---\nx: 1\n---\n# T\n', '---\nclassification: core\n---\n'),
    ).toEqual({ ok: false, error: 'already carries a frontmatter block' });
  });
});
