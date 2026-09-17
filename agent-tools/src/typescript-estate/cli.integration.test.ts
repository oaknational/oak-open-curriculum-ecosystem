import { describe, expect, it, vi } from 'vitest';

import { runTypeScriptEstateCli } from './cli.js';

describe('runTypeScriptEstateCli integration', () => {
  it('passes the exact ref, output directory, cwd, and environment to extraction', async () => {
    const extract = vi.fn().mockResolvedValue({
      outputPath: '/repo/evidence/raw-extraction.json',
      commit: 'a'.repeat(40),
      denominator: 3618,
    });

    const result = await runTypeScriptEstateCli({
      args: ['extract', '--ref', '--help', '--out', '.agent/reports/review'],
      cwd: '/repo',
      env: { LANG: 'C' },
      runtime: { extract },
    });

    expect(result.exitCode).toBe(0);
    expect(extract).toHaveBeenCalledWith({
      inputRef: '--help',
      outDirectory: '.agent/reports/review',
      cwd: '/repo',
      env: { LANG: 'C' },
    });
  });

  it('returns help without invoking extraction', async () => {
    const extract = vi.fn();
    const result = await runTypeScriptEstateCli({
      args: ['--help'],
      cwd: '/repo',
      env: {},
      runtime: { extract },
    });

    expect(result).toMatchObject({ exitCode: 0, stderr: '' });
    expect(extract).not.toHaveBeenCalled();
  });

  it.each([
    [['scan'], "expected action 'extract'"],
    [['extract', '--ref', 'HEAD'], 'missing --out'],
    [['extract', '--ref', 'HEAD', '--ref', 'main', '--out', 'evidence'], 'duplicate flag --ref'],
    [['extract', '--unknown', 'x', '--out', 'evidence'], 'invalid argument'],
  ] as const)('refuses invalid arguments %j', async (args, message) => {
    const result = await runTypeScriptEstateCli({
      args,
      cwd: '/repo',
      env: {},
      runtime: { extract: vi.fn() },
    });

    expect(result.exitCode).toBe(2);
    expect(result.stderr).toContain(message);
  });
});
