import { tmpdir } from 'node:os';

import { describe, expect, it } from 'vitest';

import { realGitExecutor } from '../src/merge-bot/git-executor';

/**
 * The DEFAULT runner binding, proven at the mechanism: a zero-argument
 * `realGitExecutor()` must hand its child file-backed stdio (F-112).
 *
 * This is a spawn-topology contract test under the sanctioned shape in
 * `.agent/directives/testing-strategy.md` §No process spawning in
 * in-process tests: the behaviour under test
 * IS the child-stdio topology of the default binding, and no seam below it
 * can carry the proof — an injected fake proves the injection, not the
 * default, and the volume smoke passes pipe-backed stdio green (F-112
 * poisoning needs a deep hook chain the smoke does not build). This one
 * bounded synthetic child is the place the pipe-backed mutant dies.
 */
describe('realGitExecutor default runner stdio topology (F-112)', () => {
  it('hands the child plain file descriptors, never FIFOs or sockets', async () => {
    const script =
      `const { fstatSync } = require('node:fs');` +
      `const piped = (fd) => { const s = fstatSync(fd); return s.isFIFO() || s.isSocket(); };` +
      `process.exit(piped(1) || piped(2) ? 7 : 0);`;
    const result = await realGitExecutor()(process.execPath, ['-e', script], {
      cwd: tmpdir(),
      env: {},
      onOutput: () => undefined,
    });

    expect(result.status).toBe(0);
    expect(result.signal).toBeNull();
  });

  it('reports a signal-killed capturing-arm child as the 128 sentinel with the signal named', async () => {
    // Exit/signal fidelity of a real child at the capturing arm — the same
    // sanctioned shape: spawnSync is the seam floor, nothing to inject below.
    const result = await realGitExecutor()(
      process.execPath,
      ['-e', `process.kill(process.pid, 'SIGTERM');`],
      { cwd: tmpdir(), env: {} },
    );

    expect(result.status).toBe(128);
    expect(result.signal).toBe('SIGTERM');
  });
});
