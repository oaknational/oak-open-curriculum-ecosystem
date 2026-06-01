import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { runCollaborationStateCli } from '../../src/collaboration-state';
import {
  makeTempCollaborationRepo,
  removeDirectory,
  writeText,
} from '../test-helpers/temp-collaboration-state';

describe('collaboration-state comms validate', () => {
  it('fails loudly and names every invalid true-JSON collaboration file', async () => {
    const repoRoot = await makeTempCollaborationRepo();
    try {
      await writeText(
        join(repoRoot, '.agent/state/collaboration/comms/bad-event.json'),
        '{ "schema_version": "2.0.0", "body": "unterminated',
      );

      const result = await runCollaborationStateCli({
        argv: ['--', 'comms', 'validate', '--repo-root', repoRoot],
        env: {},
      });

      expect(result.exitCode).toBe(2);
      expect(result.stderr).toContain('.agent/state/collaboration/comms/bad-event.json');
      expect(result.stderr).toContain('malformed JSON');
    } finally {
      await removeDirectory(repoRoot);
    }
  });
});
