import { describe, expect, it } from 'vitest';

import { runCollaborationStateCli } from '../../src/collaboration-state/cli';
import { createFakeCollaborationRuntime } from './fake-collaboration-runtime';

/**
 * Composition-root guard for the F-101 supervisor-death cure. `runCollaborationStateCli`
 * is the boundary the bin (`agent-tools-cli.ts`) calls; a wiring gap there once dropped
 * `processIsAlive` so `comms watch --supervisor-pid` threw at runtime (the gap the
 * observation proof surfaced). This test threads a fake probe through that boundary and
 * proves the watcher self-exits cleanly — it turns red if the field is dropped again,
 * because the strict resolver would throw and the run would exit 2.
 */
describe('comms watch --supervisor-pid — composition-root threading (F-101)', () => {
  it('threads processIsAlive so a dead supervisor self-exits the run cleanly (exit 0)', async () => {
    const streamed: string[] = [];
    const fake = createFakeCollaborationRuntime({ processIsAlive: () => false });

    const result = await runCollaborationStateCli({
      argv: [
        '--',
        'comms',
        'watch',
        '--comms-dir',
        '/comms',
        '--agent-name',
        'Watcher Self',
        '--session-prefix',
        'self99',
        '--platform',
        'claude',
        '--model',
        'test',
        '--seen-file',
        '/seen/supervisor.json',
        '--poll-ms',
        '20',
        '--supervisor-pid',
        '999999',
      ],
      env: {},
      stdout: {
        write(chunk: string | Uint8Array): boolean {
          streamed.push(String(chunk));
          return true;
        },
      },
      io: fake.runtime.io,
      waitForCommsChange: fake.runtime.waitForCommsChange,
      processIsAlive: fake.runtime.processIsAlive,
    });

    // Supervisor dead at the first top-of-iteration check → clean self-exit
    // before draining. A dropped processIsAlive would make the strict resolver
    // throw → exitCode 2; exitCode 0 is the regression guard.
    expect(result.exitCode).toBe(0);
    expect(streamed.join('')).toBe('');
  });
});
