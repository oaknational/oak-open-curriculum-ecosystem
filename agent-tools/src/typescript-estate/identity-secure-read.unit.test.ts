import { Buffer } from 'node:buffer';
import path from 'node:path';

import { err, ok, unwrapErr, unwrapOrThrow } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import {
  createSecureIdentityReadPort,
  validateIdentityPathObservation,
  type ContainedIdentityRead,
  type IdentityNodeObservation,
  type IdentitySecureFilePort,
} from './identity-secure-read.js';

interface Handle {
  readonly identity: 'member-handle';
}

const HANDLE: Handle = { identity: 'member-handle' };
const LEAF_NODE: IdentityNodeObservation = { kind: 'file', device: 7, inode: 42 };
const INPUT: ContainedIdentityRead = {
  chainRoot: '/checkout',
  ownerRoot: '/checkout/agent-tools/dist',
  path: '/checkout/agent-tools/dist/src/member.js',
};
const BYTES = Buffer.from('export {};\n');

// Fixtures are POSIX-form, so the path flavour is pinned to `path.posix`
// throughout: the flavour seam makes each platform's rules provable from any
// host, and the win32 rows below prove the Windows-specific behaviour.

const ACCEPTING_OPERATIONS: IdentitySecureFilePort<Handle> = {
  canonicalRealpath: (path) => ok(path),
  validateBeforeOpen: () => ok(LEAF_NODE),
  openNoFollow: () => ok(HANDLE),
  readRegularDescriptor: () => ok(BYTES),
  validateBeforeAccept: () => ok(undefined),
  close: () => ok(undefined),
};

describe('secure identity read orchestration', () => {
  it('returns bytes only after both validation phases and a regular no-follow descriptor read', () => {
    const read = createSecureIdentityReadPort(ACCEPTING_OPERATIONS, path.posix);

    const bytes = unwrapOrThrow(read.readRegularFileNoFollow(INPUT));

    expect(Buffer.from(bytes).toString()).toBe('export {};\n');
  });

  it.each([
    {
      label: 'before-open validation',
      operations: {
        ...ACCEPTING_OPERATIONS,
        validateBeforeOpen: () => err(new Error('symlink before open')),
        openNoFollow: () => err(new Error('open must not run')),
      },
      message: 'symlink before open',
    },
    {
      label: 'no-follow open',
      operations: {
        ...ACCEPTING_OPERATIONS,
        openNoFollow: () => err(new Error('O_NOFOLLOW refused member')),
      },
      message: 'cannot open identity member',
    },
    {
      label: 'regular descriptor read',
      operations: {
        ...ACCEPTING_OPERATIONS,
        readRegularDescriptor: () => err(new Error('not a regular descriptor')),
      },
      message: 'not a regular descriptor',
    },
    {
      label: 'before-accept validation',
      operations: {
        ...ACCEPTING_OPERATIONS,
        validateBeforeAccept: () => err(new Error('symlink after read')),
      },
      message: 'symlink after read',
    },
  ])('preserves a failure from $label', ({ operations, message }) => {
    const failure = unwrapErr(
      createSecureIdentityReadPort(operations, path.posix).readRegularFileNoFollow(INPUT),
    );

    expect(failure.message).toContain(message);
  });

  it('retains both the read/check failure and the mandatory close failure', () => {
    const failure = unwrapErr(
      createSecureIdentityReadPort(
        {
          ...ACCEPTING_OPERATIONS,
          validateBeforeAccept: () => err(new Error('directory drifted')),
          close: () => err(new Error('close failed')),
        },
        path.posix,
      ).readRegularFileNoFollow(INPUT),
    );

    expect(failure).toBeInstanceOf(AggregateError);
    expect(failure).toMatchObject({
      message: `cannot safely close identity member '${INPUT.path}'`,
      errors: [{ message: 'directory drifted' }, { message: 'close failed' }],
    });
  });

  it('rejects a dot-segment member path before consulting injected operations', () => {
    // A `..` through a symlinked component would be collapsed lexically by
    // the normalised comparisons while the observed component chain skips the
    // symlink itself — so dot segments are refused outright, never resolved.
    const failure = unwrapErr(
      createSecureIdentityReadPort(
        {
          ...ACCEPTING_OPERATIONS,
          validateBeforeOpen: () => err(new Error('operations must not run')),
        },
        path.posix,
      ).readRegularFileNoFollow({
        chainRoot: '/checkout',
        ownerRoot: '/checkout/agent-tools/dist',
        path: '/checkout/agent-tools/dist/link/../member.js',
      }),
    );

    expect(failure.message).toContain('must not contain "." or ".." segments');
  });

  it('rejects lexical escape before consulting injected operations', () => {
    const failure = unwrapErr(
      createSecureIdentityReadPort(
        {
          ...ACCEPTING_OPERATIONS,
          validateBeforeOpen: () => err(new Error('operations must not run')),
        },
        path.posix,
      ).readRegularFileNoFollow({
        chainRoot: '/checkout',
        ownerRoot: '/checkout/agent-tools/dist',
        path: '/checkout/outside.js',
      }),
    );

    expect(failure.message).toContain('escapes owning root');
  });
});

describe('identity path observation validation', () => {
  it('accepts the exact directory chain, regular leaf, and canonical lexical path', () => {
    expect(
      unwrapOrThrow(
        validateIdentityPathObservation(
          INPUT,
          {
            components: [
              { path: '/checkout/agent-tools', kind: 'directory' },
              { path: '/checkout/agent-tools/dist', kind: 'directory' },
              { path: '/checkout/agent-tools/dist/src', kind: 'directory' },
              { path: '/checkout/agent-tools/dist/src/member.js', kind: 'file' },
            ],
            canonicalPath: '/checkout/agent-tools/dist/src/member.js',
          },
          path.posix,
        ),
      ),
    ).toBeUndefined();
  });

  it.each([
    {
      label: 'symlink ancestor',
      observation: {
        components: [
          { path: '/checkout/agent-tools', kind: 'directory' as const },
          { path: '/checkout/agent-tools/dist', kind: 'directory' as const },
          { path: '/checkout/agent-tools/dist/src', kind: 'symlink' as const },
          { path: '/checkout/agent-tools/dist/src/member.js', kind: 'file' as const },
        ],
        canonicalPath: '/checkout/agent-tools/dist/src/member.js',
      },
      message: 'symlink',
    },
    {
      label: 'nonregular leaf',
      observation: {
        components: [
          { path: '/checkout/agent-tools', kind: 'directory' as const },
          { path: '/checkout/agent-tools/dist', kind: 'directory' as const },
          { path: '/checkout/agent-tools/dist/src', kind: 'directory' as const },
          { path: '/checkout/agent-tools/dist/src/member.js', kind: 'other' as const },
        ],
        canonicalPath: '/checkout/agent-tools/dist/src/member.js',
      },
      message: 'not a file',
    },
    {
      label: 'canonical redirect',
      observation: {
        components: [
          { path: '/checkout/agent-tools', kind: 'directory' as const },
          { path: '/checkout/agent-tools/dist', kind: 'directory' as const },
          { path: '/checkout/agent-tools/dist/src', kind: 'directory' as const },
          { path: '/checkout/agent-tools/dist/src/member.js', kind: 'file' as const },
        ],
        canonicalPath: '/outside/member.js',
      },
      message: 'outside its exact lexical owner',
    },
  ])('refuses a $label observation', ({ observation, message }) => {
    const failure = unwrapErr(validateIdentityPathObservation(INPUT, observation, path.posix));

    expect(failure.message).toContain(message);
  });
});

describe('identity path observation validation — path flavours', () => {
  const WIN_INPUT: ContainedIdentityRead = {
    chainRoot: String.raw`C:\checkout`,
    ownerRoot: String.raw`C:\checkout\agent-tools\dist`,
    path: String.raw`C:\checkout\agent-tools\dist\member.js`,
  };

  it('win32: accepts an observation echoing forward-slash separator forms', () => {
    expect(
      unwrapOrThrow(
        validateIdentityPathObservation(
          WIN_INPUT,
          {
            components: [
              { path: 'C:/checkout/agent-tools', kind: 'directory' },
              { path: 'C:/checkout/agent-tools/dist', kind: 'directory' },
              { path: 'C:/checkout/agent-tools/dist/member.js', kind: 'file' },
            ],
            canonicalPath: 'C:/checkout/agent-tools/dist/member.js',
          },
          path.win32,
        ),
      ),
    ).toBeUndefined();
  });

  // Drive letters are case-insensitive on Windows unconditionally, and their
  // case varies by which API produced the path, so this difference is noise.
  it('win32: accepts a drive-letter case difference', () => {
    expect(
      unwrapOrThrow(
        validateIdentityPathObservation(
          WIN_INPUT,
          {
            components: [
              { path: String.raw`c:\checkout\agent-tools`, kind: 'directory' },
              { path: String.raw`c:\checkout\agent-tools\dist`, kind: 'directory' },
              { path: String.raw`c:\checkout\agent-tools\dist\member.js`, kind: 'file' },
            ],
            canonicalPath: String.raw`c:\checkout\agent-tools\dist\member.js`,
          },
          path.win32,
        ),
      ),
    ).toBeUndefined();
  });

  // Case sensitivity on Windows is per-directory, not global: a directory can
  // opt in via `fsutil file setCaseSensitiveInfo`, and anything created under
  // WSL interop already has. `C:\checkout` and `C:\CHECKOUT` can therefore be
  // different directories, so treating them as one would accept an
  // observation outside the owner — the failure this validation exists to
  // catch. Over-refusal is the safe direction.
  it('win32: refuses a component-case difference — case sensitivity is per-directory', () => {
    const failure = unwrapErr(
      validateIdentityPathObservation(
        WIN_INPUT,
        {
          components: [
            { path: String.raw`C:\CHECKOUT\agent-tools`, kind: 'directory' },
            { path: String.raw`C:\CHECKOUT\agent-tools\dist`, kind: 'directory' },
            { path: String.raw`C:\CHECKOUT\agent-tools\dist\member.js`, kind: 'file' },
          ],
          canonicalPath: String.raw`C:\CHECKOUT\agent-tools\dist\member.js`,
        },
        path.win32,
      ),
    );

    expect(failure.message).toBeTruthy();
  });

  it('win32: still refuses a genuine canonical redirect outside the owner', () => {
    const failure = unwrapErr(
      validateIdentityPathObservation(
        WIN_INPUT,
        {
          components: [
            { path: String.raw`C:\checkout\agent-tools`, kind: 'directory' },
            { path: String.raw`C:\checkout\agent-tools\dist`, kind: 'directory' },
            { path: String.raw`C:\checkout\agent-tools\dist\member.js`, kind: 'file' },
          ],
          canonicalPath: String.raw`C:\outside\member.js`,
        },
        path.win32,
      ),
    );

    expect(failure.message).toContain('outside its exact lexical owner');
  });

  it('win32: refuses drive-relative rooted inputs — they resolve against the current drive', () => {
    const failure = unwrapErr(
      validateIdentityPathObservation(
        INPUT,
        {
          components: [],
          canonicalPath: INPUT.path,
        },
        path.win32,
      ),
    );

    expect(failure.message).toContain('fully qualified');
  });

  it('posix: refuses a case-only canonical difference — POSIX stays case-sensitive', () => {
    const failure = unwrapErr(
      validateIdentityPathObservation(
        INPUT,
        {
          components: [
            { path: '/checkout/agent-tools', kind: 'directory' },
            { path: '/checkout/agent-tools/dist', kind: 'directory' },
            { path: '/checkout/agent-tools/dist/src', kind: 'directory' },
            { path: '/checkout/agent-tools/dist/src/member.js', kind: 'file' },
          ],
          canonicalPath: '/checkout/agent-tools/dist/src/Member.js',
        },
        path.posix,
      ),
    );

    expect(failure.message).toContain('outside its exact lexical owner');
  });
});
