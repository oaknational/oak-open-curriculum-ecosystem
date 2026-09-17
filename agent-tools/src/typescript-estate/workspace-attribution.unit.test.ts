import { unwrapErr, unwrapOrThrow } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import type { WorkspaceRecord } from './file-model.js';
import { attributeWorkspace } from './workspace-attribution.js';

const WORKSPACES: readonly WorkspaceRecord[] = [
  { root: 'packages/a', name: 'a', manifestPath: 'packages/a/package.json' },
  {
    root: 'packages/a/nested',
    name: 'nested',
    manifestPath: 'packages/a/nested/package.json',
  },
  { root: 'packages/b', name: 'b', manifestPath: 'packages/b/package.json' },
];

describe('attributeWorkspace', () => {
  it('selects the unique deepest containing workspace root', () => {
    expect(unwrapOrThrow(attributeWorkspace('packages/a/nested/src/index.ts', WORKSPACES))).toEqual(
      WORKSPACES[1],
    );
    expect(unwrapOrThrow(attributeWorkspace('packages/a/src/index.ts', WORKSPACES))).toEqual(
      WORKSPACES[0],
    );
  });

  it('returns null outside every admitted root and respects segment boundaries', () => {
    expect(unwrapOrThrow(attributeWorkspace('other/src/index.ts', WORKSPACES))).toBeNull();
    expect(unwrapOrThrow(attributeWorkspace('packages/ab/src/index.ts', WORKSPACES))).toBeNull();
  });

  it('returns a defensive workspace record', () => {
    const workspace = unwrapOrThrow(attributeWorkspace('packages/a/src/index.ts', WORKSPACES));

    expect(workspace).not.toBe(WORKSPACES[0]);
    expect(workspace).toEqual(WORKSPACES[0]);
  });

  it('fails the complete run on an equal-depth attribution ambiguity', () => {
    const ambiguous: readonly WorkspaceRecord[] = [
      { root: 'packages/a', name: 'first', manifestPath: 'packages/a/package.json' },
      { root: 'packages/a', name: 'second', manifestPath: 'other/a/package.json' },
    ];

    expect(unwrapErr(attributeWorkspace('packages/a/src/index.ts', ambiguous))).toMatchObject({
      code: 'SNAPSHOT_INVALID',
    });
  });
});
