import { describe, expect, it } from 'vitest';
import { unwrap } from '@oaknational/result';
import { renderServedToolTable, type ServedToolRow } from './served-tool-table.js';

const row = (overrides: Partial<ServedToolRow> & Pick<ServedToolRow, 'name'>): ServedToolRow => ({
  title: 'A Title',
  description: 'A description.',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  ...overrides,
});

describe('renderServedToolTable', () => {
  it('renders one line per tool, in name order, with the count in the header', () => {
    const rendered = unwrap(
      renderServedToolTable([
        row({ name: 'zeta-tool', title: 'Zeta', description: 'Last alphabetically.' }),
        row({ name: 'alpha-tool', title: 'Alpha', description: 'First alphabetically.' }),
      ]),
    );
    const lines = rendered.split('\n');
    expect(rendered).toContain('2 tools served.');
    const toolLines = lines.filter((line) => line.startsWith('- `'));
    expect(toolLines).toEqual([
      '- `alpha-tool` — Alpha — First alphabetically. — readOnlyHint: true; destructiveHint: false; idempotentHint: true; openWorldHint: false',
      '- `zeta-tool` — Zeta — Last alphabetically. — readOnlyHint: true; destructiveHint: false; idempotentHint: true; openWorldHint: false',
    ]);
  });

  it('wraps bare URLs as markdown autolinks, leaving trailing punctuation outside', () => {
    const rendered = unwrap(
      renderServedToolTable([
        row({
          name: 'url-tool',
          description:
            'See https://example.test/docs. Terms at https://example.test/terms, "or https://example.test/more".',
        }),
      ]),
    );
    expect(rendered).toContain(
      'See <https://example.test/docs>. Terms at <https://example.test/terms>, "or <https://example.test/more>".',
    );
  });

  it('passes existing code spans through verbatim, backticks and contents untouched', () => {
    const rendered = unwrap(
      renderServedToolTable([
        row({
          name: 'code-span-tool',
          description:
            'Links follow `https://example.test/lessons/{lessonSlug}` (a template). See https://example.test/docs.',
        }),
      ]),
    );
    expect(rendered).toContain(
      'Links follow `https://example.test/lessons/{lessonSlug}` (a template). See <https://example.test/docs>.',
    );
  });

  it('escapes literal angle brackets outside code spans so they render as text', () => {
    const rendered = unwrap(
      renderServedToolTable([
        row({
          name: 'angle-tool',
          description: 'Suitable for a <track> element; `<code>` stays as-is.',
        }),
      ]),
    );
    expect(rendered).toContain(
      String.raw`Suitable for a \<track\> element; ` + '`<code>` stays as-is.',
    );
  });

  it('flattens multi-line descriptions to one line, collapsing runs of whitespace', () => {
    const rendered = unwrap(
      renderServedToolTable([
        row({
          name: 'multi-line',
          description: 'First line.\n\nSecond line with  double  spaces.\n- a bullet',
        }),
      ]),
    );
    expect(rendered).toContain(
      '- `multi-line` — A Title — First line. Second line with double spaces. - a bullet — readOnlyHint',
    );
  });

  it('names the offending tool when a row misses its title, description, or annotations', () => {
    const missingTitle = renderServedToolTable([row({ name: 'no-title', title: undefined })]);
    expect(missingTitle.ok).toBe(false);
    if (!missingTitle.ok) {
      expect(missingTitle.error).toContain('no-title');
      expect(missingTitle.error).toContain('title');
    }

    const missingDescription = renderServedToolTable([
      row({ name: 'no-description', description: '   ' }),
    ]);
    expect(missingDescription.ok).toBe(false);
    if (!missingDescription.ok) {
      expect(missingDescription.error).toContain('no-description');
    }

    const missingAnnotations = renderServedToolTable([
      row({ name: 'no-annotations', annotations: undefined }),
    ]);
    expect(missingAnnotations.ok).toBe(false);
    if (!missingAnnotations.ok) {
      expect(missingAnnotations.error).toContain('no-annotations');
    }
  });

  it('renders a generated-file banner naming the regeneration command', () => {
    const rendered = unwrap(renderServedToolTable([row({ name: 'only-tool' })]));
    expect(rendered).toContain('# Served tool table (generated)');
    expect(rendered).toContain('generate:tool-table');
    expect(rendered).toContain('Do not edit by hand');
  });
});
