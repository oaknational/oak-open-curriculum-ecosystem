import { unwrapErr, unwrapOrThrow } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import type { AuxiliaryReadRecord } from './document-model.js';
import type { TrackedTreeEntry } from './git-snapshot.js';
import {
  type AuxiliaryReadObservation,
  type AuxiliaryReadSemanticInput,
  validateAuxiliaryReadSemantics,
} from './semantic-auxiliary-validation.js';

const EMPTY_SHA256 = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
const A_SHA256 = 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb';

const ALPHA_TREE: TrackedTreeEntry = {
  path: 'config/a.json',
  treeEntry: {
    mode: '100644',
    type: 'blob',
    object: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    size: 0,
  },
};
const BETA_TREE: TrackedTreeEntry = {
  path: 'config/b.yaml',
  treeEntry: {
    mode: '100644',
    type: 'blob',
    object: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
    size: 1,
  },
};
const SOURCE_TREE: TrackedTreeEntry = {
  path: 'source.ts',
  treeEntry: {
    mode: '100644',
    type: 'blob',
    object: 'cccccccccccccccccccccccccccccccccccccccc',
    size: 1,
  },
};

const ALPHA_READ: AuxiliaryReadRecord = {
  path: 'config/a.json',
  treeEntry: {
    mode: '100644',
    type: 'blob',
    object: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    size: 0,
  },
  byteCount: 0,
  contentSha256: EMPTY_SHA256,
};
const BETA_READ: AuxiliaryReadRecord = {
  path: 'config/b.yaml',
  treeEntry: {
    mode: '100644',
    type: 'blob',
    object: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
    size: 1,
  },
  byteCount: 1,
  contentSha256: A_SHA256,
};
const SOURCE_READ: AuxiliaryReadRecord = {
  path: 'source.ts',
  treeEntry: {
    mode: '100644',
    type: 'blob',
    object: 'cccccccccccccccccccccccccccccccccccccccc',
    size: 1,
  },
  byteCount: 1,
  contentSha256: A_SHA256,
};

const ALPHA_OBSERVATION: AuxiliaryReadObservation = {
  path: 'config/a.json',
  treeEntry: {
    mode: '100644',
    type: 'blob',
    object: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    size: 0,
  },
  bytes: new Uint8Array(),
};
const BETA_OBSERVATION: AuxiliaryReadObservation = {
  path: 'config/b.yaml',
  treeEntry: {
    mode: '100644',
    type: 'blob',
    object: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
    size: 1,
  },
  bytes: new Uint8Array([97]),
};
const SOURCE_OBSERVATION: AuxiliaryReadObservation = {
  path: 'source.ts',
  treeEntry: {
    mode: '100644',
    type: 'blob',
    object: 'cccccccccccccccccccccccccccccccccccccccc',
    size: 1,
  },
  bytes: new Uint8Array([97]),
};

const VALID_INPUT: AuxiliaryReadSemanticInput = {
  assertedReads: [ALPHA_READ, BETA_READ],
  observedReads: [ALPHA_OBSERVATION, BETA_OBSERVATION],
  treeEntries: [ALPHA_TREE, BETA_TREE, SOURCE_TREE],
  maxTotalAuxiliaryBlobBytes: 1,
};

describe('validateAuxiliaryReadSemantics', () => {
  it('recomputes one complete ordered ledger from pinned bytes and tree entries', () => {
    expect(unwrapOrThrow(validateAuxiliaryReadSemantics(VALID_INPUT))).toBeUndefined();
  });

  it.each([
    {
      name: 'an unordered asserted ledger',
      input: { ...VALID_INPUT, assertedReads: [BETA_READ, ALPHA_READ] },
      message: 'asserted auxiliary reads are not strictly path ordered',
    },
    {
      name: 'an unordered observed cache',
      input: { ...VALID_INPUT, observedReads: [BETA_OBSERVATION, ALPHA_OBSERVATION] },
      message: 'observed auxiliary reads are not strictly path ordered',
    },
    {
      name: 'a missing observed read',
      input: { ...VALID_INPUT, observedReads: [ALPHA_OBSERVATION] },
      message: 'auxiliary read ledger does not equal the successful read cache',
    },
    {
      name: 'a TypeScript path omitted from any caller assertion',
      input: {
        ...VALID_INPUT,
        assertedReads: [SOURCE_READ],
        observedReads: [SOURCE_OBSERVATION],
      },
      message: "auxiliary read 'source.ts' is in the TypeScript denominator",
    },
    {
      name: 'a nonregular indexed entry',
      input: {
        ...VALID_INPUT,
        treeEntries: [
          {
            path: 'config/a.json',
            treeEntry: { ...ALPHA_TREE.treeEntry, mode: '120000' },
          },
          BETA_TREE,
          SOURCE_TREE,
        ],
      },
      message: "auxiliary read 'config/a.json' is not an indexed regular blob",
    },
    {
      name: 'a byte-count mismatch',
      input: { ...VALID_INPUT, assertedReads: [ALPHA_READ, { ...BETA_READ, byteCount: 2 }] },
      message: "auxiliary read 'config/b.yaml' byteCount does not equal pinned bytes",
    },
    {
      name: 'a digest mismatch',
      input: {
        ...VALID_INPUT,
        assertedReads: [ALPHA_READ, { ...BETA_READ, contentSha256: EMPTY_SHA256 }],
      },
      message: "auxiliary read 'config/b.yaml' digest does not equal pinned bytes",
    },
    {
      name: 'a run-wide byte excess',
      input: { ...VALID_INPUT, maxTotalAuxiliaryBlobBytes: 0 },
      message: 'auxiliary read bytes exceed the run-wide limit',
    },
  ] satisfies readonly {
    readonly name: string;
    readonly input: AuxiliaryReadSemanticInput;
    readonly message: string;
  }[])('rejects $name', ({ input, message }) => {
    expect(unwrapErr(validateAuxiliaryReadSemantics(input)).message).toBe(message);
  });
});
