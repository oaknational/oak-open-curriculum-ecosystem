import { execFile } from 'node:child_process';
import { resolve } from 'node:path';
import { promisify } from 'node:util';

import { build, formatMessages, type BuildOptions } from 'esbuild';

const execFileAsync = promisify(execFile);
const outputPath = resolve('dist/codex-hook-review-hook.bundle.mjs');

const buildOptions: BuildOptions = {
  entryPoints: [resolve('dist/src/bin/codex-hook-review-hook.js')],
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node24',
  outfile: outputPath,
  logLevel: 'silent',
};

async function buildHookBundle(): Promise<boolean> {
  try {
    const result = await build(buildOptions);
    if (result.warnings.length > 0) {
      const warnings = await formatMessages(result.warnings, { kind: 'warning', color: false });
      process.stderr.write(
        `Codex hook bundle build rejected esbuild warnings:\n${warnings.join('')}`,
      );
      return false;
    }
    await execFileAsync(process.execPath, ['--check', outputPath]);
    return true;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`Codex hook bundle build failed: ${message}\n`);
    return false;
  }
}

if (!(await buildHookBundle())) {
  process.exitCode = 1;
}
