import { describe, expect, it } from 'vitest';

import { fingerprintInvocationSha256 } from '../../src/codex-hook-review/invocation-fingerprint.js';

describe('review invocation fingerprint', () => {
  it('preserves the ordered JSON SHA-256 wire contract', () => {
    expect(
      fingerprintInvocationSha256({
        command: '/opt/codex',
        args: ['-a', 'never', 'exec'],
        cwd: '/private/review',
        env: { HOME: '/private/home', NO_COLOR: '1' },
      }),
    ).toBe('d6fa66d4c7a9bffca7aeb935e83cbdf4598a91148e56a16f9b3aedbbb8742c2c');
  });
});
