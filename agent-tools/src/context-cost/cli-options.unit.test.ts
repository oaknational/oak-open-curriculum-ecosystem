import { describe, expect, it } from 'vitest';

import { parseArgs } from './cli-options.js';

describe('parseArgs', () => {
  it('parses one glob with default text output', () => {
    expect(parseArgs(['--glob', '.agent/rules/*.md'])).toStrictEqual({
      ok: true,
      options: { globs: ['.agent/rules/*.md'], json: false, help: false },
    });
  });

  it('accumulates repeated globs', () => {
    expect(parseArgs(['--glob', 'a/*.md', '--glob', 'b/*.md'])).toStrictEqual({
      ok: true,
      options: { globs: ['a/*.md', 'b/*.md'], json: false, help: false },
    });
  });

  it('parses json output', () => {
    expect(parseArgs(['--glob', '*.md', '--json'])).toStrictEqual({
      ok: true,
      options: { globs: ['*.md'], json: true, help: false },
    });
  });

  it('parses long and short help without requiring globs', () => {
    expect(parseArgs(['--help'])).toStrictEqual({
      ok: true,
      options: { globs: [], json: false, help: true },
    });
    expect(parseArgs(['-h'])).toStrictEqual({
      ok: true,
      options: { globs: [], json: false, help: true },
    });
  });

  it('returns an error when no glob is provided', () => {
    const result = parseArgs([]);

    expect(result.ok).toBe(false);
    expect(result.ok ? '' : result.error).toMatch(/^--glob is required/);
  });

  it('returns an error for unknown options', () => {
    const result = parseArgs(['--glob', '*.md', '--unknown']);

    expect(result.ok).toBe(false);
    expect(result.ok ? '' : result.error).toMatch(/^unknown option: --unknown/);
  });

  it('returns an error when a glob value is missing', () => {
    const result = parseArgs(['--glob']);

    expect(result.ok).toBe(false);
    expect(result.ok ? '' : result.error).toMatch(/^--glob requires a value/);
  });

  it('ignores all args after the terminator', () => {
    expect(parseArgs(['--glob', '*.md', '--', 'positional'])).toStrictEqual({
      ok: true,
      options: { globs: ['*.md'], json: false, help: false },
    });
  });
});
