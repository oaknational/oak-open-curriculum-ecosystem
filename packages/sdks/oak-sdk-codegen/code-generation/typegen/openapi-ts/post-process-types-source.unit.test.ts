/**
 * Characterisation of `postProcessTypesSource` over every JSDoc shape it
 * rewrites in openapi-typescript's output. Written green against the
 * original regexes so their linear-time replacements are provably
 * behaviour-preserving (`tdd-for-refactoring`).
 */
import { describe, expect, it } from 'vitest';

import { postProcessTypesSource } from './post-process-types-source.js';

function lines(...parts: readonly string[]): string {
  return parts.join('\n');
}

describe('postProcessTypesSource: JSDoc tag stripping', () => {
  it('strips a single-line @description tag, keeping the text', () => {
    const input = lines('/** @description The lesson slug */', 'slug: string;');

    expect(postProcessTypesSource(input)).toBe(lines('/** The lesson slug */', 'slug: string;'));
  });

  it('strips an @description tag on a continuation line of a block comment', () => {
    const input = lines('/**', ' * @description The lesson slug', ' * @example maths', ' */');

    expect(postProcessTypesSource(input)).toBe(
      lines('/**', ' * The lesson slug', ' * @example maths', ' */'),
    );
  });

  it('keeps the indentation of an indented @description continuation line', () => {
    const input = lines('        /**', '         * @description Indented text', '         */');

    expect(postProcessTypesSource(input)).toBe(
      lines('        /**', '         * Indented text', '         */'),
    );
  });

  it('blanks a bare @constant continuation line', () => {
    const input = lines('/**', ' * Fixed value', ' * @constant', ' */');

    expect(postProcessTypesSource(input)).toBe(lines('/**', ' * Fixed value', '', ' */'));
  });

  it('blanks a single-line @constant comment', () => {
    const input = lines('    /** @constant */', '    kind: "lesson";');

    expect(postProcessTypesSource(input)).toBe(lines('', '    kind: "lesson";'));
  });

  it('blanks an @enum continuation line with its braced type', () => {
    const input = lines('/**', ' * The key stage', ' * @enum {string}', ' */');

    expect(postProcessTypesSource(input)).toBe(lines('/**', ' * The key stage', '', ' */'));
  });

  it('blanks a single-line @enum comment', () => {
    const input = lines('    /** @enum {string} */', '    keyStage: "ks1" | "ks2";');

    expect(postProcessTypesSource(input)).toBe(lines('', '    keyStage: "ks1" | "ks2";'));
  });

  it('leaves @constant and @enum alone when text follows them on the line', () => {
    const input = lines('/**', ' * @constant true', ' * @enum {string} more', ' */');

    expect(postProcessTypesSource(input)).toBe(
      lines('/**', ' * @constant true', String.raw` * @enum \{string\} more`, ' */'),
    );
  });

  it('rewrites each tag line on its own line, leaving the lines around it in place', () => {
    const input = lines(
      '/**',
      ' * @description A lesson',
      ' * @constant',
      ' * @enum {string}',
      ' * @example maths',
      ' */',
    );

    expect(postProcessTypesSource(input)).toBe(
      lines('/**', ' * A lesson', '', '', ' * @example maths', ' */'),
    );
  });

  it('keeps a blank line that precedes a stripped tag line', () => {
    const input = lines('/**', ' * Fixed value', '', ' * @constant', ' */');

    expect(postProcessTypesSource(input)).toBe(lines('/**', ' * Fixed value', '', '', ' */'));
  });

  it('is linear over a run of whitespace-only lines', () => {
    const input = `${' '.repeat(5000)}\n * @constant\n`;

    const started = performance.now();
    postProcessTypesSource(input);

    expect(performance.now() - started).toBeLessThan(200);
  });
});

describe('postProcessTypesSource: other rewrites', () => {
  it('replaces non-breaking spaces and the unknown headers map', () => {
    const input = lines('headers: {', '    [name: string]: unknown;', '};', 'a b');

    expect(postProcessTypesSource(input)).toBe(lines('headers?: never;', 'a b'));
  });

  it('escapes TSDoc-unsafe characters in comments and restores inline tags', () => {
    const input = String.raw`/** {@link Other} returns Map<string, {id}> and "\n" */`;

    expect(postProcessTypesSource(input)).toBe(
      String.raw`/** {@link Other} returns Map\<string, \{id\}\> and "\\n" */`,
    );
  });
});
