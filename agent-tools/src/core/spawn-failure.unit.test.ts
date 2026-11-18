import { describe, expect, it } from 'vitest';

import { describeSpawnFailure } from './spawn-failure.js';

describe('describeSpawnFailure', () => {
  it('reads ETIMEDOUT as the hang backstop firing, naming the bound', () => {
    const line = describeSpawnFailure(
      'collaboration-state comms watch',
      { code: 'ETIMEDOUT', message: 'spawnSync node ETIMEDOUT' },
      180_000,
    );

    expect(line).toBe(
      'collaboration-state comms watch did not finish within the 180000 ms hang backstop',
    );
  });

  it('reads any other coded error as a launch failure carrying the code and message', () => {
    const line = describeSpawnFailure(
      'collaboration-state comms watch',
      { code: 'ENOENT', message: 'spawnSync node ENOENT' },
      180_000,
    );

    expect(line).toBe(
      'collaboration-state comms watch failed to run (ENOENT): spawnSync node ENOENT',
    );
  });

  it('reads an error without a code as a launch failure that says so', () => {
    const line = describeSpawnFailure(
      'collaboration-state comms watch',
      { message: 'boom' },
      180_000,
    );

    expect(line).toBe('collaboration-state comms watch failed to run (no code): boom');
  });
});
