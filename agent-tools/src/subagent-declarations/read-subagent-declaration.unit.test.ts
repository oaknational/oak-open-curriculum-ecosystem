import { unwrapErr } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { readSubagentDeclaration } from './read-subagent-declaration.js';

describe('readSubagentDeclaration', () => {
  it('reads a template with no block as undeclared', () => {
    expect(readSubagentDeclaration('alpha', '## Delegation Triggers\n\nBody.\n')).toStrictEqual({
      ok: true,
      value: { kind: 'undeclared' },
    });
  });

  it('reads the block at the head of a template as its declaration', () => {
    expect(
      readSubagentDeclaration(
        'alpha',
        '---\ndescription: Alpha reviews a.\nclaude:\n  color: pink\n---\n\n# Alpha\n',
      ),
    ).toStrictEqual({
      ok: true,
      value: {
        kind: 'declared',
        declaration: {
          kind: 'role',
          name: 'alpha',
          description: 'Alpha reviews a.',
          claude: { color: 'pink' },
        },
      },
    });
  });

  it("carries the template's System prompt block, unquoted, when the Claude body names it: the one blockquote under that heading, its blank quote lines kept as paragraph breaks", () => {
    const template = [
      '---',
      'description: Voter judges.',
      'claude:',
      '  tools: none',
      '  body: system-prompt',
      '---',
      '',
      '# Voter',
      '',
      '> A quote outside the section.',
      '',
      '## System prompt',
      '',
      'The Claude adapter carries this block verbatim.',
      '',
      '### Note',
      '',
      '> You are a voter.',
      '>',
      '> Judge only from the supplied evidence.',
      '',
      '## Delegation triggers',
      '',
      '> A quote after the section.',
      '',
    ].join('\n');
    expect(readSubagentDeclaration('voter', template)).toStrictEqual({
      ok: true,
      value: {
        kind: 'declared',
        declaration: {
          kind: 'role',
          name: 'voter',
          description: 'Voter judges.',
          claude: { tools: 'none', body: 'system-prompt' },
          systemPrompt: 'You are a voter.\n\nJudge only from the supplied evidence.',
        },
      },
    });
  });

  const HEAD = '---\ndescription: Voter.\nclaude:\n  tools: none\n  body: system-prompt\n---\n';
  const promptOf = (body: readonly string[]) =>
    readSubagentDeclaration('voter', `${HEAD}${body.join('\n')}`);
  const REFUSAL = /^voter: claude\.body /u;

  it('reads the System prompt heading outside code fences only: a fenced example of the heading is not the section', () => {
    const fenced = ['', '```markdown', '## System prompt', '', '> Fenced example.', '```', ''];
    expect(promptOf([...fenced, '## System prompt', '', '> The real prompt.', ''])).toMatchObject({
      ok: true,
      value: { declaration: { systemPrompt: 'The real prompt.' } },
    });
  });

  it('closes a fence only on a line of its own character, at least as long, with nothing but whitespace after it', () => {
    const real = ['## System prompt', '', '> The real prompt.', ''];
    const example = ['## System prompt', '', '> Fenced.'];
    const trailing = ['', '```markdown', '```not-a-close', ...example, '```  ', '', ...real];
    const shorter = ['', '````markdown', '```', ...example, '````', '', ...real];
    const other = ['', '```markdown', '~~~', ...example, '```', '', ...real];
    for (const body of [trailing, shorter, other]) {
      expect(promptOf(body)).toMatchObject({
        ok: true,
        value: { declaration: { systemPrompt: 'The real prompt.' } },
      });
    }
  });

  it('carries the real quote beside a fenced example of one, before it or after it: a fenced line is never a quote', () => {
    const fencedExample = ['```markdown', '> An example.', '```', ''];
    const real = ['> The real prompt.', ''];
    for (const body of [
      [...fencedExample, ...real],
      [...real, ...fencedExample],
    ]) {
      expect(promptOf(['', '## System prompt', '', ...body])).toMatchObject({
        ok: true,
        value: { declaration: { systemPrompt: 'The real prompt.' } },
      });
    }
  });

  it('carries a quote that a heading closes on the next line: a lower one inside the section, or the one that ends it', () => {
    for (const heading of ['### Next', '## Next']) {
      expect(promptOf(['', '## System prompt', '', '> Closed.', heading, ''])).toMatchObject({
        ok: true,
        value: { declaration: { systemPrompt: 'Closed.' } },
      });
    }
  });

  it('refuses a Claude body naming the System prompt block when the template carries none', () => {
    expect(unwrapErr(promptOf(['', '# Voter', '', '> A quote.', '']))).toMatch(REFUSAL);
    expect(
      unwrapErr(
        promptOf(['', '## System prompt', '', 'Prose only.', '', '## Next', '', '> Late.', '']),
      ),
    ).toMatch(REFUSAL);
  });

  it('refuses a System prompt block with no text in it: bare quote markers, or only whitespace after them', () => {
    const section = ['', '## System prompt', ''];
    expect(unwrapErr(promptOf([...section, '>', '']))).toMatch(REFUSAL);
    expect(unwrapErr(promptOf([...section, '>', '>   ', '> ', '']))).toMatch(REFUSAL);
  });

  it('refuses a System prompt block it cannot carry whole: a lazy continuation line after the quote, or a second quote in the section', () => {
    const section = ['', '## System prompt', '', '> Line one'];
    expect(unwrapErr(promptOf([...section, 'lazy continuation', '']))).toMatch(REFUSAL);
    expect(unwrapErr(promptOf([...section, 'lazy continuation', '> after', '']))).toMatch(REFUSAL);
    expect(
      unwrapErr(promptOf([...section, '', 'Between.', '', '> A second quote.', '', '## Next', ''])),
    ).toMatch(REFUSAL);
  });

  it('refuses a block that never closes, is not YAML, or fails the schema, naming the template', () => {
    expect(readSubagentDeclaration('alpha', '---\ndescription: a\n\n# Alpha\n')).toStrictEqual({
      ok: false,
      error: 'alpha: frontmatter block never closes',
    });
    const notYaml = readSubagentDeclaration('alpha', '---\ndescription: a: b: c\n---\n');
    expect(notYaml.ok ? '' : notYaml.error.startsWith('alpha: frontmatter is not YAML')).toBe(true);
    expect(
      readSubagentDeclaration('alpha', '---\ndescription: a\nsummary: b\n---\n'),
    ).toStrictEqual({ ok: false, error: 'alpha: Unrecognized key: "summary"' });
  });
});
