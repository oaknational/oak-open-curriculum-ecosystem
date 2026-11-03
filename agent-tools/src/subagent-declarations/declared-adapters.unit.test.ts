import { describe, expect, it } from 'vitest';

import { declaredAdaptersFrom } from './declared-adapters.js';

const role = (name: string, platforms?: string): string =>
  `---\ndescription: ${name} reviews.\n${platforms === undefined ? '' : `platforms:\n${platforms}`}---\n\n## Delegation Triggers\n`;

describe('declaredAdaptersFrom', () => {
  it('reduces a role to every surface and a declared subset to that subset, in template order', () => {
    const declared = declaredAdaptersFrom([
      { name: 'beta', text: role('beta', '  - gemini\n') },
      { name: 'alpha', text: role('alpha') },
    ]);
    expect(declared).toStrictEqual({
      ok: true,
      value: [
        { name: 'beta', platforms: ['gemini'] },
        { name: 'alpha', platforms: ['cursor', 'claude', 'codex', 'gemini'] },
      ],
    });
  });

  it('reduces a fan-out to its variants, each on its own platforms', () => {
    const fanOut = [
      '---',
      'variants:',
      '  - name: cricket-high',
      '    platforms:',
      '      - cursor',
      '      - claude',
      '    description: High.',
      '  - name: cricket-low',
      '    platforms:',
      '      - codex',
      '    description: Low.',
      '---',
      '',
      '## Delegation Triggers',
      '',
    ].join('\n');
    expect(declaredAdaptersFrom([{ name: 'cricket', text: fanOut }])).toStrictEqual({
      ok: true,
      value: [
        { name: 'cricket-high', platforms: ['cursor', 'claude'] },
        { name: 'cricket-low', platforms: ['codex'] },
      ],
    });
  });

  it('refuses an empty template set: no adapter is declared, so no parity can be read', () => {
    expect(declaredAdaptersFrom([])).toStrictEqual({
      ok: false,
      error: '.agent/sub-agents/templates: no templates, so no adapter is declared',
    });
  });

  it('refuses an adapter name two templates render, naming both', () => {
    const fanOut = [
      '---',
      'variants:',
      '  - name: alpha-high',
      '    platforms:',
      '      - cursor',
      '    description: High.',
      '---',
      '',
    ].join('\n');
    expect(
      declaredAdaptersFrom([
        { name: 'alpha-high', text: role('alpha-high') },
        { name: 'alpha', text: fanOut },
      ]),
    ).toStrictEqual({
      ok: false,
      error:
        '.agent/sub-agents/templates/alpha.md: renders alpha-high, which .agent/sub-agents/templates/alpha-high.md also renders; the generator refuses that set',
    });
  });

  it('refuses on the first template with no declaration, naming it repo-relative', () => {
    const refused = declaredAdaptersFrom([
      { name: 'alpha', text: role('alpha') },
      { name: 'gamma', text: '## Delegation Triggers\n' },
    ]);
    expect(refused).toStrictEqual({
      ok: false,
      error: '.agent/sub-agents/templates/gamma.md: no declaration in its frontmatter',
    });
  });

  it("refuses on a declaration that does not read, carrying the reader's reason", () => {
    const refused = declaredAdaptersFrom([{ name: 'delta', text: '---\ndescription: [\n---\n' }]);
    expect(refused.ok).toBe(false);
    if (!refused.ok) {
      expect(refused.error.startsWith('.agent/sub-agents/templates/delta.md: delta: ')).toBe(true);
    }
  });
});
