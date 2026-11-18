/**
 * Integration tests for the collaboration records leg (both claim registries,
 * each classified before it is validated, then both thread directories) read
 * through injected in-memory reads. Tests never use or create IO
 * (`testing-strategy.md` §Philosophy). The fake reads model `readFile`'s
 * documented contract: a present file resolves with its text, and a path with
 * no file rejects with code `ENOENT`. No schema is registered, and every
 * present surface here fails before schema validation, so none is consulted.
 */
import { err, ok } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { type InstanceTierProbe } from './instance-tier.js';
import { evaluateCollaborationRecords } from './live-collaboration-records.js';
import { type SubstrateReads } from './live-reads.js';
import {
  ACTIVE_CLAIMS_PATH,
  CLOSED_CLAIMS_PATH,
  CONVERSATIONS_ROOT,
  ESCALATIONS_ROOT,
} from './live-types.js';
import { createPracticeSubstrateReport } from './report.js';

type FileRead = () => Promise<string>;

const present =
  (text: string): FileRead =>
  () =>
    Promise.resolve(text);

const absent: FileRead = () =>
  Promise.reject(Object.assign(new Error('ENOENT: no such file or directory'), { code: 'ENOENT' }));

const CONVERSATION = `${CONVERSATIONS_ROOT}thread.json`;
const NO_THREADS = { [CONVERSATIONS_ROOT]: [], [ESCALATIONS_ROOT]: [] };
const NO_SCHEMAS = { getSchema: () => undefined };

function inMemoryReads(
  files: Readonly<Record<string, FileRead>>,
  listings: Readonly<Record<string, readonly string[]>>,
): SubstrateReads {
  return {
    readText: (repoPath) => files[repoPath](),
    listJsonFiles: (root) => Promise.resolve(listings[root]),
  };
}

function ignoring(ignored: readonly string[]): InstanceTierProbe {
  return ok(new Set(ignored));
}

describe('evaluateCollaborationRecords', () => {
  it('reports each absent, ignored claim registry as one informational finding', async () => {
    const findings = await evaluateCollaborationRecords({
      reads: inMemoryReads(
        { [ACTIVE_CLAIMS_PATH]: absent, [CLOSED_CLAIMS_PATH]: absent },
        NO_THREADS,
      ),
      schemas: NO_SCHEMAS,
      probe: ignoring([ACTIVE_CLAIMS_PATH, CLOSED_CLAIMS_PATH]),
    });

    expect(findings).toStrictEqual([
      expect.objectContaining({
        id: 'instance-tier-surface-absent',
        surface: 'collaboration-active-claims',
        evidence: [ACTIVE_CLAIMS_PATH],
      }),
      expect.objectContaining({
        id: 'instance-tier-surface-absent',
        surface: 'collaboration-closed-claims',
        evidence: [CLOSED_CLAIMS_PATH],
      }),
    ]);
  });

  it('reports an absent registry the repository would track as a blocking missing surface with its path', async () => {
    const findings = await evaluateCollaborationRecords({
      reads: inMemoryReads(
        { [ACTIVE_CLAIMS_PATH]: absent, [CLOSED_CLAIMS_PATH]: absent },
        NO_THREADS,
      ),
      schemas: NO_SCHEMAS,
      probe: ignoring([CLOSED_CLAIMS_PATH]),
    });

    expect(findings).toStrictEqual([
      expect.objectContaining({
        id: 'missing-surface',
        surface: 'collaboration-active-claims',
        evidence: [ACTIVE_CLAIMS_PATH],
      }),
      expect.objectContaining({
        id: 'instance-tier-surface-absent',
        surface: 'collaboration-closed-claims',
      }),
    ]);
  });

  it('validates a registry that is present, even one the rules ignore, with no absence finding', async () => {
    const findings = await evaluateCollaborationRecords({
      reads: inMemoryReads(
        { [ACTIVE_CLAIMS_PATH]: present('not json'), [CLOSED_CLAIMS_PATH]: absent },
        NO_THREADS,
      ),
      schemas: NO_SCHEMAS,
      probe: ignoring([ACTIVE_CLAIMS_PATH, CLOSED_CLAIMS_PATH]),
    });

    expect(findings).toStrictEqual([
      expect.objectContaining({
        id: 'invalid-json',
        surface: 'collaboration-active-claims',
        evidence: [ACTIVE_CLAIMS_PATH],
      }),
      expect.objectContaining({
        id: 'instance-tier-surface-absent',
        surface: 'collaboration-closed-claims',
      }),
    ]);
  });

  it("leaves the other registry's and the thread directories' findings in the result when the probe fails on one registry", async () => {
    const findings = await evaluateCollaborationRecords({
      reads: inMemoryReads(
        {
          [ACTIVE_CLAIMS_PATH]: absent,
          [CLOSED_CLAIMS_PATH]: present('not json'),
          [CONVERSATION]: present('not json'),
        },
        { [CONVERSATIONS_ROOT]: [CONVERSATION], [ESCALATIONS_ROOT]: [] },
      ),
      schemas: NO_SCHEMAS,
      probe: err({ kind: 'git-failed', status: 128, stderr: 'fatal: not a git repository\n' }),
    });

    expect(findings).toStrictEqual([
      expect.objectContaining({
        id: 'live-reader-failure',
        surface: 'collaboration-active-claims',
        evidence: [ACTIVE_CLAIMS_PATH],
      }),
      expect.objectContaining({
        id: 'invalid-json',
        surface: 'collaboration-closed-claims',
        evidence: [CLOSED_CLAIMS_PATH],
      }),
      expect.objectContaining({
        id: 'invalid-json',
        surface: 'collaboration-conversations',
        evidence: [CONVERSATION],
      }),
    ]);
  });

  it("rejects with the read's own error when a registry read fails for a reason other than absence", async () => {
    const denied = Object.assign(new Error('EACCES: permission denied'), { code: 'EACCES' });

    await expect(
      evaluateCollaborationRecords({
        reads: inMemoryReads(
          { [ACTIVE_CLAIMS_PATH]: () => Promise.reject(denied), [CLOSED_CLAIMS_PATH]: absent },
          NO_THREADS,
        ),
        schemas: NO_SCHEMAS,
        probe: ignoring([ACTIVE_CLAIMS_PATH, CLOSED_CLAIMS_PATH]),
      }),
    ).rejects.toBe(denied);
  });

  it('gives a report that is ok on a fresh checkout, where the records read only informational', async () => {
    const findings = await evaluateCollaborationRecords({
      reads: inMemoryReads(
        { [ACTIVE_CLAIMS_PATH]: absent, [CLOSED_CLAIMS_PATH]: absent },
        NO_THREADS,
      ),
      schemas: NO_SCHEMAS,
      probe: ignoring([ACTIVE_CLAIMS_PATH, CLOSED_CLAIMS_PATH]),
    });

    expect(createPracticeSubstrateReport(findings).ok).toBe(true);
  });
});
