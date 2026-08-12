import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { commsWatchPathsFromHome } from '../../src/collaboration-state/comms-watch-paths';

const PRIMARY = '/workspace/oak';
const AGENT_NAME = 'Europa stirs Void';
// Both paths are host-joined onto the home (the seen FILE segment is appended
// with a literal '/'), so the expectations are derived in host form —
// identical to the POSIX literals on POSIX.
const PRIMARY_COMMS = join(PRIMARY, '.agent/state/collaboration/comms');
const PRIMARY_SEEN = `${join(PRIMARY, '.agent/state/collaboration/comms-seen')}/${AGENT_NAME}.json`;

describe('commsWatchPathsFromHome', () => {
  it('builds the comms directory and identity cursor from one resolved home', () => {
    expect(commsWatchPathsFromHome(PRIMARY, AGENT_NAME)).toStrictEqual({
      commsDir: PRIMARY_COMMS,
      seenFile: PRIMARY_SEEN,
    });
  });
});
