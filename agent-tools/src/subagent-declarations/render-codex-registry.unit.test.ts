import { unwrapErr } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { renderCodexRegistry, splitCodexRegistry } from './render-codex-registry.js';
import type { FanOutDeclaration, RoleDeclaration } from './subagent-declaration.js';

/**
 * The Codex registry (closure item 6, 2b-ii, slice A2): `.codex/config.toml` is a hand-kept
 * head (the host's own settings) followed by one `[agents."<name>"]` block per Codex adapter.
 * The head is kept verbatim; the blocks are rendered from the declarations, sorted by name,
 * each carrying the adapter's description and its config file. The registry tail admits
 * nothing but blocks, so a foreign line there refuses rather than being dropped.
 */

const HEAD = ['file_opener = "cursor"', '', '[features]', 'multi_agent = true', '', ''].join('\n');

const REGISTRY = `${HEAD}${[
  '[agents."zeta"]',
  'description = "Zeta."',
  'config_file = "agents/zeta.toml"',
  '',
  '[agents."alpha"]',
  'description = "Old alpha."',
  'config_file = "agents/alpha.toml"',
  '',
].join('\n')}`;

const ALPHA: RoleDeclaration = { kind: 'role', name: 'alpha', description: 'Alpha reviews a.' };
const ZETA: RoleDeclaration = { kind: 'role', name: 'zeta', description: 'Zeta.' };
const CRICKET: FanOutDeclaration = {
  kind: 'fan-out',
  name: 'cricket',
  variants: [
    {
      name: 'cricket-low',
      platforms: ['cursor', 'codex'],
      description: 'Fast low-effort check.',
      codex: { model: 'gpt-x', effort: 'low' },
    },
    {
      name: 'cricket-high',
      platforms: ['cursor', 'claude'],
      description: 'Fast high-effort check.',
    },
  ],
};

const EXPECTED = `${HEAD}${[
  '[agents."alpha"]',
  'description = "Alpha reviews a."',
  'config_file = "agents/alpha.toml"',
  '',
  '[agents."cricket-low"]',
  'description = "Fast low-effort check."',
  'config_file = "agents/cricket-low.toml"',
  '',
  '[agents."zeta"]',
  'description = "Zeta."',
  'config_file = "agents/zeta.toml"',
  '',
].join('\n')}`;

describe('splitCodexRegistry', () => {
  it('keeps the head verbatim up to the first agents block', () => {
    expect(splitCodexRegistry('.codex/config.toml', REGISTRY)).toStrictEqual({
      ok: true,
      value: HEAD,
    });
  });

  it('is a fixpoint of the render: a registry that starts with a block has an empty head, and a rendered registry splits to the head it was rendered from', () => {
    const blocksFirst = REGISTRY.slice(HEAD.length);
    expect(splitCodexRegistry('.codex/config.toml', blocksFirst)).toStrictEqual({
      ok: true,
      value: '',
    });
    const rendered = renderCodexRegistry('', [ALPHA]);
    expect(rendered.ok).toBe(true);
    const again = splitCodexRegistry('.codex/config.toml', rendered.ok ? rendered.value : '');
    expect(again).toStrictEqual({ ok: true, value: '' });
    const fromHead = renderCodexRegistry(HEAD, [ALPHA]);
    expect(
      splitCodexRegistry('.codex/config.toml', fromHead.ok ? fromHead.value : ''),
    ).toStrictEqual({ ok: true, value: HEAD });
  });

  it('admits an escaped block field in the tail, leaving the render to judge it; a comment line there refuses', () => {
    const escaped = `${HEAD}[agents."alpha"]\ndescription = "Says \\"hi\\"."\nconfig_file = "agents/alpha.toml"\n`;
    expect(splitCodexRegistry('.codex/config.toml', escaped)).toStrictEqual({
      ok: true,
      value: HEAD,
    });
    expect(splitCodexRegistry('.codex/config.toml', `${REGISTRY}# a note\n`).ok).toBe(false);
  });

  it('reads a config with no registry as all head, closed by a blank line for the blocks to follow', () => {
    expect(splitCodexRegistry('.codex/config.toml', 'file_opener = "cursor"\n')).toStrictEqual({
      ok: true,
      value: 'file_opener = "cursor"\n\n',
    });
    expect(splitCodexRegistry('.codex/config.toml', '')).toStrictEqual({
      ok: true,
      value: '',
    });
  });

  it('refuses a line in the registry tail that is not an agents block line, naming it', () => {
    const foreign = `${REGISTRY}\n[mcp_servers.docs]\nurl = "x"\n`;
    expect(splitCodexRegistry('.codex/config.toml', foreign)).toStrictEqual({
      ok: false,
      error:
        '.codex/config.toml: line "[mcp_servers.docs]" sits in the registry tail, which the declarations render whole; write a block line in the rendered shape with its block complete, or move a foreign section above the first agents block; refusing to regenerate the sub-agent adapters',
    });
  });

  it('reads an agents header written loosely (leading whitespace, an inline comment) as the tail start and refuses it as foreign, never as head', () => {
    for (const header of ['  [agents."alpha"]', '[agents."alpha"] # kept by hand']) {
      const loose = `${HEAD}${header}\ndescription = "Alpha."\nconfig_file = "agents/alpha.toml"\n`;
      expect(splitCodexRegistry('.codex/config.toml', loose)).toStrictEqual({
        ok: false,
        error: `.codex/config.toml: line "${header}" sits in the registry tail, which the declarations render whole; write a block line in the rendered shape with its block complete, or move a foreign section above the first agents block; refusing to regenerate the sub-agent adapters`,
      });
    }
  });

  it('admits a block field only in its place inside a block: a stray field after a block, a field repeated, the fields misordered, a header with no fields, each refuse naming the line out of place', () => {
    const block = '[agents."alpha"]\ndescription = "Alpha."\nconfig_file = "agents/alpha.toml"\n';
    const cases: readonly (readonly [string, string])[] = [
      [`${block}\ndescription = "Stray."\n`, 'description = "Stray."'],
      [
        `[agents."alpha"]\ndescription = "Alpha."\ndescription = "Twice."\n`,
        'description = "Twice."',
      ],
      [
        `[agents."alpha"]\nconfig_file = "agents/alpha.toml"\ndescription = "Alpha."\n`,
        'config_file = "agents/alpha.toml"',
      ],
      [`${block}\n[agents."beta"]\n`, '[agents."beta"]'],
    ];
    for (const [tail, line] of cases) {
      expect(splitCodexRegistry('.codex/config.toml', `${HEAD}${tail}`)).toStrictEqual({
        ok: false,
        error: `.codex/config.toml: line "${line}" sits in the registry tail, which the declarations render whole; write a block line in the rendered shape with its block complete, or move a foreign section above the first agents block; refusing to regenerate the sub-agent adapters`,
      });
    }
    expect(splitCodexRegistry('.codex/config.toml', `${HEAD}${block}\n\n${block}`).ok).toBe(true);
  });
});

describe('renderCodexRegistry', () => {
  it('renders one block per Codex adapter, sorted by name, after the head verbatim; a variant with no Codex adapter has no block', () => {
    expect(renderCodexRegistry(HEAD, [ZETA, CRICKET, ALPHA])).toStrictEqual({
      ok: true,
      value: EXPECTED,
    });
  });

  it("carries a role's Codex description in its block in place of the role description, and refuses one a TOML basic string cannot carry verbatim", () => {
    const rendered = renderCodexRegistry(HEAD, [
      { ...ALPHA, codex: { description: 'Alpha on Codex.' } },
    ]);
    expect(rendered.ok).toBe(true);
    const registry = rendered.ok ? rendered.value : '';
    expect(registry).toContain('Alpha on Codex.');
    expect(registry).not.toContain(ALPHA.description);
    expect(
      unwrapErr(renderCodexRegistry(HEAD, [{ ...ALPHA, codex: { description: 'Says "hi".' } }])),
    ).toMatch(/^\.codex\/config\.toml: /u);
  });

  it('refuses a description a TOML basic string cannot carry verbatim, naming the registry', () => {
    expect(renderCodexRegistry(HEAD, [{ ...ALPHA, description: 'Says "hi".' }])).toStrictEqual({
      ok: false,
      error:
        '.codex/config.toml: the description of alpha carries a character a TOML basic string cannot carry verbatim (a double quote, a backslash or a control character); refusing to render it',
    });
  });
});
