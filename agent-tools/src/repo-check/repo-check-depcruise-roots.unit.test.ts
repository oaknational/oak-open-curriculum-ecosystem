import { isErr, unwrap, unwrapErr } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { cruiseRootsFromWorkspaceManifest } from './repo-check-depcruise-roots.js';

describe('cruiseRootsFromWorkspaceManifest', () => {
  it('reads each first path segment once, in manifest order, across plain, globbed and nested entries', () => {
    const roots = cruiseRootsFromWorkspaceManifest(
      [
        'packages:',
        '  - agent-tools',
        '  - jcdotnet',
        '  - tooling/*',
        '  # a comment between entries',
        '  - "tooling/result"',
        '  - packages/core/result',
        "  - 'packages/design/*'",
        'minimumReleaseAge: 1440',
        '',
      ].join('\n'),
    );
    expect(unwrap(roots)).toStrictEqual(['agent-tools', 'jcdotnet', 'tooling', 'packages']);
  });

  it('skips a negated entry, which narrows resolution and names no root', () => {
    const roots = cruiseRootsFromWorkspaceManifest('packages:\n  - apps/*\n  - "!apps/retired"\n');
    expect(unwrap(roots)).toStrictEqual(['apps']);
  });

  it('refuses text that is not a workspace manifest', () => {
    const roots = cruiseRootsFromWorkspaceManifest('onlyBuiltDependencies:\n  - esbuild\n');
    expect(isErr(roots)).toBe(true);
    expect(unwrapErr(roots)).toContain('no packages list');
  });

  it('refuses an entry whose first segment is a glob, which names no directory', () => {
    const roots = cruiseRootsFromWorkspaceManifest('packages:\n  - "*"\n');
    expect(unwrapErr(roots)).toContain("'*' names no directory");
  });

  it('refuses an entry whose first segment leaves the repository', () => {
    const roots = cruiseRootsFromWorkspaceManifest('packages:\n  - tooling/*\n  - ../outside/*\n');
    expect(unwrapErr(roots)).toContain("'../outside/*' leaves the repository");
  });

  it('refuses a manifest that is not YAML, naming the parse error', () => {
    const roots = cruiseRootsFromWorkspaceManifest('packages: [\n');
    expect(unwrapErr(roots)).toContain('not YAML');
  });
});
