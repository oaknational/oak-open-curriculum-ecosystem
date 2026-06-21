import { readdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

/**
 * Consolidation guard for F-41 (the silent cwd-fallback root-finder). This test
 * scans the real `collaboration-state/` source tree, so it is an integration
 * test, not a unit test. Its job is to refuse the regression: the pre-fix bug
 * was a hand-rolled `findCollaborationRepoRoot` that silently returned the start
 * dir on a missed sentinel, duplicated across `cli-comms-send.ts` and
 * `tui/config.ts`. The consolidation deleted both in favour of the single
 * throwing {@link resolveCoordinationHome}; this guard fails if either copy —
 * or any new silent finder by that name — reappears.
 */
function collaborationStateSourceFiles(): readonly string[] {
  const root = dirname(fileURLToPath(import.meta.url));
  const files: string[] = [];
  const walk = (dir: string): void => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = resolve(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.name.endsWith('.ts') && !entry.name.includes('.test.ts')) {
        files.push(full);
      }
    }
  };
  walk(root);
  return files;
}

describe('coordination-home consolidation (F-41)', () => {
  it('leaves no silent findCollaborationRepoRoot root-finder in any source file', () => {
    const offenders = collaborationStateSourceFiles().filter((file) =>
      readFileSync(file, 'utf8').includes('function findCollaborationRepoRoot'),
    );
    expect(offenders).toStrictEqual([]);
  });
});
