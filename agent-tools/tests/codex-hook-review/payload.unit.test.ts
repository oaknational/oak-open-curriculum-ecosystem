import { err, ok } from '@oaknational/result';
import { extname } from 'node:path';
import { describe, expect, it } from 'vitest';

import { buildReviewPayload } from '../../src/codex-hook-review/payload.js';
import { type ReviewPathInspection } from '../../src/codex-hook-review/path.js';

const projectRoot = '/workspace/oak';
const regularFiles: ReviewPathInspection = {
  lstat: async (absolutePath) => ok(extname(absolutePath).length === 0 ? 'directory' : 'file'),
};

describe('buildReviewPayload', () => {
  it('returns an explicit skip for an empty reviewable batch', async () => {
    await expect(
      buildReviewPayload({ projectRoot, changes: [] }, regularFiles),
    ).resolves.toStrictEqual(ok({ kind: 'skip', reason: 'no-reviewable-changes' }));
  });

  it('builds the bounded model payload from normalised source changes', async () => {
    await expect(
      buildReviewPayload(
        {
          projectRoot,
          changes: [
            {
              tool: 'Edit',
              filePath: '/workspace/oak/src/edit.ts',
              oldText: 'before',
              newText: 'after',
            },
            {
              tool: 'Write',
              filePath: '/workspace/oak/src/write.ts',
              content: 'export {};',
            },
          ],
        },
        regularFiles,
      ),
    ).resolves.toStrictEqual(
      ok({
        kind: 'review',
        payload: {
          version: 1,
          changes: [
            {
              operation: 'edit',
              path: 'src/edit.ts',
              before: 'before',
              after: 'after',
            },
            { operation: 'write', path: 'src/write.ts', content: 'export {};' },
          ],
        },
      }),
    );
  });

  it('returns a typed skip above the change-count limit', async () => {
    await expect(
      buildReviewPayload(
        {
          projectRoot,
          changes: [
            { tool: 'Write', filePath: '/workspace/oak/one.ts', content: '1' },
            { tool: 'Write', filePath: '/workspace/oak/two.ts', content: '2' },
            { tool: 'Write', filePath: '/workspace/oak/three.ts', content: '3' },
            { tool: 'Write', filePath: '/workspace/oak/four.ts', content: '4' },
          ],
        },
        regularFiles,
      ),
    ).resolves.toStrictEqual(ok({ kind: 'skip', reason: 'too-many-changes' }));
  });

  it('rejects an ineligible source path', async () => {
    await expect(
      buildReviewPayload(
        {
          projectRoot,
          changes: [
            {
              tool: 'Write',
              filePath: '/workspace/oak/src/../secret.ts',
              content: 'secret',
            },
          ],
        },
        regularFiles,
      ),
    ).resolves.toStrictEqual(
      err(new Error('Review path must not contain a parent traversal segment')),
    );
  });

  it('returns a typed skip above the serialised UTF-8 byte limit', async () => {
    await expect(
      buildReviewPayload(
        {
          projectRoot,
          changes: [
            {
              tool: 'Write',
              filePath: '/workspace/oak/src/large.ts',
              content: '\u20ac'.repeat(1400),
            },
          ],
        },
        regularFiles,
      ),
    ).resolves.toStrictEqual(ok({ kind: 'skip', reason: 'payload-too-large' }));
  });
});
