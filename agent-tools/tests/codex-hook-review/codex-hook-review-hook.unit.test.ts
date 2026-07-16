import { describe, expect, it } from 'vitest';

import { runCodexHookReviewBin } from '../../src/bin/codex-hook-review-hook.js';

describe('runCodexHookReviewBin', () => {
  it('writes one fixed advisory JSON line from the production composition', async () => {
    const writes: string[] = [];

    await runCodexHookReviewBin({
      runProduction: async () => ({
        hookSpecificOutput: {
          hookEventName: 'PostToolBatch',
          additionalContext: 'Codex advisory review: first change has a security concern.',
        },
      }),
      write: (text) => writes.push(text),
    });

    expect(writes).toStrictEqual([
      '{"hookSpecificOutput":{"hookEventName":"PostToolBatch","additionalContext":' +
        '"Codex advisory review: first change has a security concern."}}\n',
    ]);
  });

  it('writes exactly {} when production composition rejects', async () => {
    const writes: string[] = [];

    await runCodexHookReviewBin({
      runProduction: () => Promise.reject(new Error('private failure detail')),
      write: (text) => writes.push(text),
    });

    expect(writes).toStrictEqual(['{}\n']);
  });
});
