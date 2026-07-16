import { err, ok } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import {
  resolveReviewPath,
  type ReviewPathEntryKind,
  type ReviewPathInspection,
} from '../../src/codex-hook-review/path.js';

const projectRoot = '/workspace/oak';

function inspectionFor(
  absoluteTarget: string,
  targetKind: ReviewPathEntryKind = 'file',
  entries: ReadonlyMap<string, ReviewPathEntryKind> = new Map(),
): ReviewPathInspection {
  return {
    lstat: async (absolutePath) => {
      const configured = entries.get(absolutePath);
      if (configured !== undefined) {
        return ok(configured);
      }
      return ok(absolutePath === absoluteTarget ? targetKind : 'directory');
    },
  };
}

describe('resolveReviewPath', () => {
  it('rejects relative and raw parent-traversal paths before inspection', async () => {
    const inspection: ReviewPathInspection = {
      lstat: async () => err(new Error('inspection must not run')),
    };

    await expect(
      resolveReviewPath({ projectRoot, filePath: 'src/example.ts', tool: 'Edit' }, inspection),
    ).resolves.toStrictEqual(err(new Error('Review path must be an absolute path')));
    await expect(
      resolveReviewPath(
        { projectRoot, filePath: '/workspace/oak/src/../src/example.ts', tool: 'Edit' },
        inspection,
      ),
    ).resolves.toStrictEqual(
      err(new Error('Review path must not contain a parent traversal segment')),
    );
  });

  it('normalises an absolute in-repo file path', async () => {
    const inspection = inspectionFor('/workspace/oak/src/example.ts');

    await expect(
      resolveReviewPath(
        { projectRoot, filePath: '/workspace/oak/src/example.ts', tool: 'Edit' },
        inspection,
      ),
    ).resolves.toStrictEqual(ok('src/example.ts'));
  });

  it('rejects traversal and sibling-prefix paths before inspection', async () => {
    const inspection: ReviewPathInspection = {
      lstat: async () => err(new Error('inspection must not run')),
    };

    await expect(
      resolveReviewPath(
        { projectRoot, filePath: '/workspace/oak-private/secret.ts', tool: 'Edit' },
        inspection,
      ),
    ).resolves.toStrictEqual(
      err(new Error('Review path must resolve to a file inside the project root')),
    );
  });

  it.each([
    '.git/config',
    'node_modules/pkg/index.js',
    'vendor/pkg/source.ts',
    'dist/output.js',
    'GENERATED/client.ts',
    '.env',
    '.ENV.local',
    '.envrc',
    '.direnv/cache',
    'config/production.env',
    '.claude/settings.local.json',
    '.claude/logs/hook.jsonl',
    '.agent/memory/active/napkin.md',
    '.npmrc',
    'config/credentials.json',
    'certs/server.PEM',
    'pnpm-lock.yaml',
    'Cargo.lock',
    'assets/logo.png',
    'data/events.JSONL',
    'public/app.min.js',
  ])('rejects excluded path %s', async (filePath) => {
    const inspection = inspectionFor(`/workspace/oak/${filePath}`);

    await expect(
      resolveReviewPath(
        { projectRoot, filePath: `${projectRoot}/${filePath}`, tool: 'Edit' },
        inspection,
      ),
    ).resolves.toStrictEqual(err(new Error('Review path is excluded from model review')));
  });

  it('rejects a symbolic-link ancestor', async () => {
    const entries = new Map<string, ReviewPathEntryKind>([['/workspace/oak/src', 'symbolic-link']]);
    const inspection = inspectionFor('/workspace/oak/src/example.ts', 'file', entries);

    await expect(
      resolveReviewPath(
        { projectRoot, filePath: '/workspace/oak/src/example.ts', tool: 'Edit' },
        inspection,
      ),
    ).resolves.toStrictEqual(err(new Error('Review path must not contain a symbolic link')));
  });

  it('rejects a symbolic-link target', async () => {
    const inspection = inspectionFor('/workspace/oak/src/example.ts', 'symbolic-link');

    await expect(
      resolveReviewPath(
        { projectRoot, filePath: '/workspace/oak/src/example.ts', tool: 'Edit' },
        inspection,
      ),
    ).resolves.toStrictEqual(err(new Error('Review path must not contain a symbolic link')));
  });

  it('allows only a missing Write target after existing non-symlink ancestors', async () => {
    const inspection = inspectionFor('/workspace/oak/src/new.ts', 'missing');

    await expect(
      resolveReviewPath(
        { projectRoot, filePath: '/workspace/oak/src/new.ts', tool: 'Write' },
        inspection,
      ),
    ).resolves.toStrictEqual(ok('src/new.ts'));
    await expect(
      resolveReviewPath(
        { projectRoot, filePath: '/workspace/oak/src/new.ts', tool: 'Edit' },
        inspection,
      ),
    ).resolves.toStrictEqual(err(new Error('Edit review path must already exist')));
  });

  it('rejects a missing ancestor for a Write target', async () => {
    const entries = new Map<string, ReviewPathEntryKind>([['/workspace/oak/src', 'missing']]);
    const inspection = inspectionFor('/workspace/oak/src/new.ts', 'missing', entries);

    await expect(
      resolveReviewPath(
        { projectRoot, filePath: '/workspace/oak/src/new.ts', tool: 'Write' },
        inspection,
      ),
    ).resolves.toStrictEqual(err(new Error('Review path ancestor must already exist')));
  });

  it('preserves an inspection failure as a Result error', async () => {
    const inspection: ReviewPathInspection = {
      lstat: async () => err(new Error('lstat denied')),
    };

    await expect(
      resolveReviewPath(
        { projectRoot, filePath: '/workspace/oak/src/example.ts', tool: 'Edit' },
        inspection,
      ),
    ).resolves.toStrictEqual(err(new Error('lstat denied')));
  });

  it('rejects the project root, a null byte, and a relative root', async () => {
    const inspection = inspectionFor('/workspace/oak/src/example.ts');

    await expect(
      resolveReviewPath({ projectRoot, filePath: '/workspace/oak', tool: 'Edit' }, inspection),
    ).resolves.toStrictEqual(
      err(new Error('Review path must identify a file below the project root')),
    );
    await expect(
      resolveReviewPath(
        { projectRoot, filePath: '/workspace/oak/src/\u0000secret.ts', tool: 'Edit' },
        inspection,
      ),
    ).resolves.toStrictEqual(err(new Error('Review path must not contain a null byte')));
    await expect(
      resolveReviewPath(
        { projectRoot: 'workspace/oak', filePath: '/workspace/oak/src/file.ts', tool: 'Edit' },
        inspection,
      ),
    ).resolves.toStrictEqual(err(new Error('Project root must be an absolute path')));
  });
});
