import { Buffer } from 'node:buffer';
import { join } from 'node:path';

import { err, ok, unwrapErr, unwrapOrThrow } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import {
  publishRawExtraction,
  RAW_EXTRACTION_FILE_NAME,
  type AtomicPublicationPort,
  type PreparedPublicationTarget,
} from './atomic-publication.js';

interface Handle {
  readonly identity: 'publication-handle';
}

const HANDLE: Handle = { identity: 'publication-handle' };
const TARGET: PreparedPublicationTarget = { outDirectory: '/repo/evidence' };
const VALUE = {
  z: 1,
  a: { z: false, a: true },
  array: [{ z: 2, a: 1 }, 3],
};

const ACCEPTING_PUBLICATION: AtomicPublicationPort<Handle> = {
  prepareContainedTarget: () => ok(TARGET),
  checkBeforeCreate: () => ok(undefined),
  materialiseDirectory: () => ok(undefined),
  inspectTargetBeforeCreate: () => ok(undefined),
  createExclusive: () => ok(HANDLE),
  write: () => ok(undefined),
  fsync: () => ok(undefined),
  close: () => ok(undefined),
  checkBeforeCommit: () => ok(undefined),
  inspectTargetBeforeCommit: () => ok(undefined),
  rename: () => ok(undefined),
  removeTemp: () => ok(undefined),
};

const PHASE_FAILURES: readonly {
  readonly label: string;
  readonly expectedMessage: string;
  readonly publication: AtomicPublicationPort<Handle>;
}[] = [
  {
    label: 'pre-create containment',
    expectedMessage: 'output containment recheck failed',
    publication: {
      ...ACCEPTING_PUBLICATION,
      checkBeforeCreate: () => err(new Error('outside root before create')),
    },
  },
  {
    label: 'directory materialisation',
    expectedMessage: 'cannot materialise contained output directory',
    publication: {
      ...ACCEPTING_PUBLICATION,
      materialiseDirectory: () => err(new Error('mkdir failed')),
    },
  },
  {
    label: 'pre-create target inspection',
    expectedMessage: 'cannot inspect raw-extraction target',
    publication: {
      ...ACCEPTING_PUBLICATION,
      inspectTargetBeforeCreate: () => err(new Error('lstat failed')),
    },
  },
  {
    label: 'exclusive temp creation',
    expectedMessage: 'cannot exclusively create publication temp file',
    publication: {
      ...ACCEPTING_PUBLICATION,
      createExclusive: () => err(new Error('EEXIST')),
    },
  },
  {
    label: 'temp write',
    expectedMessage: 'publication temp write failed',
    publication: {
      ...ACCEPTING_PUBLICATION,
      write: () => err(new Error('disk full')),
    },
  },
  {
    label: 'temp fsync',
    expectedMessage: 'publication temp write failed',
    publication: {
      ...ACCEPTING_PUBLICATION,
      fsync: () => err(new Error('fsync failed')),
    },
  },
  {
    // A failing containment recheck now surfaces at its EARLIEST phase — the
    // post-materialise assert added for the symlink-window cure — so no bytes
    // are ever written outside a root that stopped being contained.
    label: 'pre-commit containment',
    expectedMessage: 'materialised output directory failed the containment recheck',
    publication: {
      ...ACCEPTING_PUBLICATION,
      checkBeforeCommit: () => err(new Error('directory swapped')),
    },
  },
  {
    label: 'pre-commit target inspection',
    expectedMessage: 'cannot inspect raw-extraction target',
    publication: {
      ...ACCEPTING_PUBLICATION,
      inspectTargetBeforeCommit: () => err(new Error('lstat failed')),
    },
  },
  {
    label: 'atomic rename',
    expectedMessage: 'atomic publication rename failed',
    publication: {
      ...ACCEPTING_PUBLICATION,
      rename: () => err(new Error('rename failed')),
    },
  },
];

describe('publishRawExtraction', () => {
  it('returns the canonical bytes and fixed final target after every phase succeeds', () => {
    const result = unwrapOrThrow(publish(ACCEPTING_PUBLICATION));

    // outputPath is a real filesystem path handed back to callers, so it is
    // host-joined; the expectation derives the same form.
    expect(result.outputPath).toBe(join('/repo', 'evidence', RAW_EXTRACTION_FILE_NAME));
    expect(Buffer.from(result.bytes).toString()).toBe(
      '{\n  "a": {\n    "a": true,\n    "z": false\n  },\n  "array": [\n    {\n      "a": 1,\n      "z": 2\n    },\n    3\n  ],\n  "z": 1\n}\n',
    );
  });

  it.each([
    {
      label: 'schema validation',
      result: publishRawExtraction({
        invokingGitRoot: '/repo',
        outDirectory: 'evidence',
        value: VALUE,
        maxSerializedOutputBytes: 4096,
        tempToken: 'run-1',
        validate: () => err(new Error('schema rejected value')),
        publication: preparationMustNotRun(),
      }),
      code: 'VALIDATION_FAILED',
    },
    {
      label: 'exact byte limit',
      result: publishRawExtraction({
        invokingGitRoot: '/repo',
        outDirectory: 'evidence',
        value: VALUE,
        maxSerializedOutputBytes: 1,
        tempToken: 'run-1',
        validate: () => ok(VALUE),
        publication: preparationMustNotRun(),
      }),
      code: 'RESOURCE_LIMIT',
    },
    {
      label: 'temp-token validation',
      result: publishRawExtraction({
        invokingGitRoot: '/repo',
        outDirectory: 'evidence',
        value: VALUE,
        maxSerializedOutputBytes: 4096,
        tempToken: '../escape',
        validate: () => ok(VALUE),
        publication: preparationMustNotRun(),
      }),
      code: 'PUBLICATION_FAILED',
    },
  ])('does not reach target preparation when $label fails', ({ result, code }) => {
    const failure = unwrapErr(result);

    expect(failure.code).toBe(code);
    expect(failure.cause).not.toMatchObject({ message: 'preparation must not run' });
  });

  it.each(PHASE_FAILURES)(
    'preserves the typed failure from $label',
    ({ publication, expectedMessage }) => {
      const failure = unwrapErr(publish(publication));

      expect(failure.code).toBe('PUBLICATION_FAILED');
      expect(failure.message).toBe(expectedMessage);
      expect(failure.cause).toBeInstanceOf(Error);
    },
  );

  it.each([
    {
      label: 'before temp creation',
      publication: {
        ...ACCEPTING_PUBLICATION,
        inspectTargetBeforeCreate: () => ok('symlink' as const),
        createExclusive: () => err(new Error('temp creation must not run')),
      },
    },
    {
      label: 'before atomic commit',
      publication: {
        ...ACCEPTING_PUBLICATION,
        inspectTargetBeforeCommit: () => ok('symlink' as const),
        rename: () => err(new Error('rename must not run')),
      },
    },
  ])('refuses a symlink final target $label', ({ publication }) => {
    const failure = unwrapErr(publish(publication));

    expect(failure.code).toBe('PUBLICATION_FAILED');
    expect(failure.message).toContain('symlink');
  });

  it('retains both write and close causes, then retains cleanup failure as well', () => {
    const failure = unwrapErr(
      publish({
        ...ACCEPTING_PUBLICATION,
        write: () => err(new Error('write failed')),
        close: () => err(new Error('close failed')),
        removeTemp: () => err(new Error('cleanup failed')),
      }),
    );

    expect(failure.code).toBe('PUBLICATION_FAILED');
    expect(failure.cause).toBeInstanceOf(AggregateError);
    expect(failure.cause).toMatchObject({
      message: 'publication temp write failed; temp cleanup also failed',
      errors: [
        {
          message: 'write and close both failed',
          errors: [{ message: 'write failed' }, { message: 'close failed' }],
        },
        { message: 'cleanup failed' },
      ],
    });
  });
});

function publish(publication: AtomicPublicationPort<Handle>) {
  return publishRawExtraction({
    invokingGitRoot: '/repo',
    outDirectory: 'evidence',
    value: VALUE,
    maxSerializedOutputBytes: 4096,
    tempToken: 'run-1',
    validate: () => ok(VALUE),
    publication,
  });
}

function preparationMustNotRun(): AtomicPublicationPort<Handle> {
  return {
    ...ACCEPTING_PUBLICATION,
    prepareContainedTarget: () => err(new Error('preparation must not run')),
  };
}
