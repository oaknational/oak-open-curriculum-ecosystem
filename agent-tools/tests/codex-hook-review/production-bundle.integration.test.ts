import { fileURLToPath } from 'node:url';

import { build } from 'esbuild';
import { describe, expect, it } from 'vitest';

describe('production hook bundle boundary', () => {
  it('excludes calibration and held-out tournament corpus literals', async () => {
    const result = await build({
      entryPoints: [
        fileURLToPath(new URL('../../src/bin/codex-hook-review-hook.ts', import.meta.url)),
      ],
      bundle: true,
      platform: 'node',
      format: 'esm',
      target: 'node24',
      write: false,
      logLevel: 'silent',
    });
    const output = result.outputFiles[0]?.text;

    expect(result.warnings).toStrictEqual([]);
    expect(output).toContain('--oak-codex-hook-review-v1');
    expect(output).not.toContain('cal-easy-concern-config-01');
    expect(output).not.toContain('held-hard-concern-agent-01');
  });
});
