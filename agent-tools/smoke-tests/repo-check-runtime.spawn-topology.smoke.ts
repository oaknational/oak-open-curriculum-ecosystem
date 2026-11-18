import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

import { spawnInheritedProcess } from '../src/repo-check/repo-check-runtime';

/**
 * The one sanctioned spawn-topology contract: how an inherited-stdio child's
 * end is reported, and that a caller handed a process-group kill ends the
 * child by the signal it names. Real spawns of the running Node binary with
 * `-e`, no git, no global state (`process.execPath` passes through the
 * trusted-target resolver unchanged).
 *
 * A smoke, never a test: it spawns processes, which the testing directive
 * keeps out of every test tier, and its process-group leg signals a negative
 * PID, a POSIX operation the family's Windows leg (which runs the unit suite
 * alone) cannot perform. The smoke runner is the POSIX surface that owns it.
 */
async function main(): Promise<void> {
  assert.deepEqual(
    await spawnInheritedProcess(process.execPath, ['-e', 'process.exit(3)']),
    { status: 3, signal: null },
    'an exit status is reported with no signal',
  );

  assert.deepEqual(
    await spawnInheritedProcess(process.execPath, ['-e', 'process.kill(process.pid, "SIGTERM")']),
    { status: null, signal: 'SIGTERM' },
    'a signal death is reported by its signal, with no status',
  );

  // The child compares real paths itself, since process.cwd() reports the
  // resolved path. The directory is this smoke's own, read from no ambient
  // environment.
  const cwd = fileURLToPath(new URL('.', import.meta.url));
  const cwdProbe =
    `const { realpathSync } = require('node:fs');` +
    `process.exit(realpathSync(process.cwd()) === realpathSync(${JSON.stringify(cwd)}) ? 0 : 5)`;
  assert.deepEqual(
    await spawnInheritedProcess(process.execPath, ['-e', cwdProbe], { cwd }),
    { status: 0, signal: null },
    'the child runs in the requested working directory',
  );

  const envProbe = `process.exit(process.env.GATE_TOPOLOGY_PROBE === 'handed' ? 0 : 7)`;
  assert.deepEqual(
    await spawnInheritedProcess(process.execPath, ['-e', envProbe], {
      extraEnv: { GATE_TOPOLOGY_PROBE: 'handed' },
    }),
    { status: 0, signal: null },
    'the child is given the extra environment variables it is handed',
  );

  const blocked = 'setTimeout(() => process.exit(9), 30_000)';
  const answers: string[] = [];
  assert.deepEqual(
    await spawnInheritedProcess(process.execPath, ['-e', blocked], {
      processGroup: { onSpawn: (killGroup) => answers.push(killGroup('SIGHUP')) },
    }),
    { status: null, signal: 'SIGHUP' },
    'the group kill handed to the caller ends the child by the signal it names',
  );
  assert.deepEqual(answers, ['signalled'], 'the group kill reports that it signalled');
}

await main();
