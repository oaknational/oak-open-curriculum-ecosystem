import { Buffer } from 'node:buffer';

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
    const read = createSecureIdentityReadPort(ACCEPTING_OPERATIONS);

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
      createSecureIdentityReadPort(operations).readRegularFileNoFollow(INPUT),
    );

    expect(failure.message).toContain(message);
  });

  it('retains both the read/check failure and the mandatory close failure', () => {
    const failure = unwrapErr(
      createSecureIdentityReadPort({
        ...ACCEPTING_OPERATIONS,
        validateBeforeAccept: () => err(new Error('directory drifted')),
        close: () => err(new Error('close failed')),
      }).readRegularFileNoFollow(INPUT),
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
      createSecureIdentityReadPort({
        ...ACCEPTING_OPERATIONS,
        validateBeforeOpen: () => err(new Error('operations must not run')),
      }).readRegularFileNoFollow({
        chainRoot: '/checkout',
        ownerRoot: '/checkout/agent-tools/dist',
        path: '/checkout/agent-tools/dist/link/../member.js',
      }),
    );

    expect(failure.message).toContain('must not contain "." or ".." segments');
  });

  it('rejects lexical escape before consulting injected operations', () => {
    const failure = unwrapErr(
      createSecureIdentityReadPort({
        ...ACCEPTING_OPERATIONS,
        validateBeforeOpen: () => err(new Error('operations must not run')),
      }).readRegularFileNoFollow({
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
        validateIdentityPathObservation(INPUT, {
          components: [
            { path: '/checkout/agent-tools', kind: 'directory' },
            { path: '/checkout/agent-tools/dist', kind: 'directory' },
            { path: '/checkout/agent-tools/dist/src', kind: 'directory' },
            { path: '/checkout/agent-tools/dist/src/member.js', kind: 'file' },
          ],
          canonicalPath: '/checkout/agent-tools/dist/src/member.js',
        }),
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
    const failure = unwrapErr(validateIdentityPathObservation(INPUT, observation));

    expect(failure.message).toContain(message);
  });
});
