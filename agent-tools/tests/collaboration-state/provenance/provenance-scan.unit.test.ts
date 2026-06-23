import { err, ok, type Result } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import {
  collectKnownEventIds,
  findKnownEventTokens,
  runProvenanceCheck,
  type ProvenanceCheckReport,
  type ProvenanceScanError,
  type ProvenanceScanIo,
} from '../../../src/collaboration-state/provenance/provenance-scan';

/** Narrow a Result to its Ok value, failing the test with the error otherwise. */
function expectOk(
  result: Result<ProvenanceCheckReport, ProvenanceScanError>,
): ProvenanceCheckReport {
  if (!result.ok) {
    expect.fail(`expected Ok, got Err: ${JSON.stringify(result.error)}`);
  }
  return result.value;
}

describe('collectKnownEventIds', () => {
  it('reduces comms event filenames to their lowercased 8-hex id prefixes', () => {
    const ids = collectKnownEventIds([
      '2ff03ded-b708-4796-8712-d4f3ca3ab781.json',
      '86E94E54-F184-42B9-BC4D-8FC099766916.json',
    ]);
    expect([...ids].sort((a, b) => a.localeCompare(b))).toEqual(['2ff03ded', '86e94e54']);
  });

  it('ignores entries that are not .json event files', () => {
    const ids = collectKnownEventIds(['.gitkeep', 'manifest.jsonl', 'README.md']);
    expect([...ids]).toEqual([]);
  });

  it('ignores .json names whose stem is not an 8-hex-prefixed id', () => {
    // A non-UUID JSON file living beside events must not be mistaken for an event.
    const ids = collectKnownEventIds(['active-claims.json', 'not-an-event.json']);
    expect([...ids]).toEqual([]);
  });
});

describe('findKnownEventTokens', () => {
  const known = new Set(['2ff03ded', '3cc1fb93', '86e94e54']);

  it('returns only those 8-hex tokens in the text that are known event ids', () => {
    const text = 'See events 2ff03ded and 3cc1fb93; deadbeef is an 8-hex token but not an event.';
    expect([...findKnownEventTokens(text, known)].sort((a, b) => a.localeCompare(b))).toEqual([
      '2ff03ded',
      '3cc1fb93',
    ]);
  });

  it('matches the 8-hex prefix of a full-UUID citation', () => {
    const text = 'event `86e94e54-f184-42b9-bc4d-8fc099766916` anchors the framing';
    expect([...findKnownEventTokens(text, known)]).toEqual(['86e94e54']);
  });

  it('does not match a longer hex run such as a git SHA even if it starts with a known prefix', () => {
    // 86e94e54... continues past 8 hex chars, so the bounded token never matches.
    const text = 'commit 86e94e54f18442b9bc4d8fc099766916abcdef01';
    expect([...findKnownEventTokens(text, known)]).toEqual([]);
  });
});

/** Build an in-memory IO so the orchestration is exercised with no filesystem. */
function fakeIo(input: {
  eventsByDir: Readonly<Record<string, readonly string[]>>;
  docsByRoot: Readonly<Record<string, readonly string[]>>;
  textByPath: Readonly<Record<string, string>>;
}): ProvenanceScanIo {
  return {
    listEventFilenames: (dir) => ok(input.eventsByDir[dir] ?? []),
    listDocPaths: (root) => ok(input.docsByRoot[root] ?? []),
    readText: (path) =>
      Object.hasOwn(input.textByPath, path)
        ? ok(input.textByPath[path] ?? '')
        : err(`no such file: ${path}`),
    exists: (path) => Object.hasOwn(input.textByPath, path),
  };
}

describe('runProvenanceCheck', () => {
  const baseDirs = {
    eventsByDir: {
      comms: [
        '2ff03ded-aaaa-4000-8000-000000000000.json',
        '5fbf6f92-bbbb-4000-8000-000000000000.json',
      ],
      'comms-archive': ['c7d65a58-cccc-4000-8000-000000000000.json'],
    },
    docsByRoot: { adr: ['adr/199.md'], pdr: ['pdr/094.md'] },
  } as const;

  it('reports no violations when every cited candidate is covered by the digest', () => {
    const report = expectOk(
      runProvenanceCheck(
        {
          eventDirs: ['comms', 'comms-archive'],
          docRoots: ['adr', 'pdr'],
          digestPath: 'digest.md',
          candidateEventIds: ['2ff03ded', '5fbf6f92'],
        },
        fakeIo({
          ...baseDirs,
          textByPath: {
            'adr/199.md': 'cites 2ff03ded',
            'pdr/094.md': 'cites 5fbf6f92',
            'digest.md': 'covers 2ff03ded and 5fbf6f92',
          },
        }),
      ),
    );
    expect(report.violations).toEqual([]);
    expect(report.citedEventIds).toEqual(['2ff03ded', '5fbf6f92']);
    expect(report.coveredEventIds).toEqual(['2ff03ded', '5fbf6f92']);
  });

  it('flags a cited event in the candidate move-set that the digest does not cover', () => {
    const report = expectOk(
      runProvenanceCheck(
        {
          eventDirs: ['comms', 'comms-archive'],
          docRoots: ['adr', 'pdr'],
          digestPath: 'digest.md',
          candidateEventIds: ['2ff03ded', '5fbf6f92'],
        },
        fakeIo({
          ...baseDirs,
          textByPath: {
            'adr/199.md': 'cites 2ff03ded and 5fbf6f92',
            'pdr/094.md': '',
            'digest.md': 'covers only 2ff03ded',
          },
        }),
      ),
    );
    expect(report.violations).toEqual(['5fbf6f92']);
  });

  it('does not flag a cited-but-uncovered event that is not in the candidate move-set (stays live)', () => {
    const report = expectOk(
      runProvenanceCheck(
        {
          eventDirs: ['comms', 'comms-archive'],
          docRoots: ['adr'],
          digestPath: 'digest.md',
          candidateEventIds: ['c7d65a58'],
        },
        fakeIo({
          ...baseDirs,
          textByPath: { 'adr/199.md': 'cites 2ff03ded', 'digest.md': '' },
        }),
      ),
    );
    expect(report.violations).toEqual([]);
  });

  it('treats an absent digest as zero coverage (fail-closed)', () => {
    const report = expectOk(
      runProvenanceCheck(
        {
          eventDirs: ['comms'],
          docRoots: ['adr'],
          digestPath: 'digest.md',
          candidateEventIds: ['2ff03ded'],
        },
        fakeIo({
          eventsByDir: { comms: ['2ff03ded-aaaa-4000-8000-000000000000.json'] },
          docsByRoot: { adr: ['adr/199.md'] },
          textByPath: { 'adr/199.md': 'cites 2ff03ded' }, // no digest.md key => exists() false
        }),
      ),
    );
    expect(report.coveredEventIds).toEqual([]);
    expect(report.violations).toEqual(['2ff03ded']);
  });

  it('does not count an 8-hex doc token that is not a known event id as a citation', () => {
    const report = expectOk(
      runProvenanceCheck(
        {
          eventDirs: ['comms'],
          docRoots: ['adr'],
          digestPath: 'digest.md',
          candidateEventIds: ['2ff03ded'],
        },
        fakeIo({
          eventsByDir: { comms: ['2ff03ded-aaaa-4000-8000-000000000000.json'] },
          docsByRoot: { adr: ['adr/199.md'] },
          textByPath: { 'adr/199.md': 'deadbeef is 8-hex but not an event', 'digest.md': '' },
        }),
      ),
    );
    expect(report.citedEventIds).toEqual([]);
    expect(report.violations).toEqual([]);
  });

  it('returns a typed Err when a doc root cannot be read (fail-closed, never a false pass)', () => {
    const io: ProvenanceScanIo = {
      listEventFilenames: () => ok(['2ff03ded-aaaa-4000-8000-000000000000.json']),
      listDocPaths: () => err('EACCES: permission denied'),
      readText: () => ok(''),
      exists: () => false,
    };
    const result = runProvenanceCheck(
      {
        eventDirs: ['comms'],
        docRoots: ['adr'],
        digestPath: 'digest.md',
        candidateEventIds: ['2ff03ded'],
      },
      io,
    );
    if (result.ok) {
      expect.fail('expected Err when a permanent-doc root is unreadable');
    }
    expect(result.error.kind).toBe('doc-root-unreadable');
  });

  it('returns a typed Err when an event directory cannot be read (fail-closed)', () => {
    const io: ProvenanceScanIo = {
      listEventFilenames: () => err('ENOENT: comms dir missing'),
      listDocPaths: () => ok([]),
      readText: () => ok(''),
      exists: () => false,
    };
    const result = runProvenanceCheck(
      { eventDirs: ['comms'], docRoots: ['adr'], digestPath: 'digest.md', candidateEventIds: [] },
      io,
    );
    if (result.ok) {
      expect.fail('expected Err when an event directory is unreadable');
    }
    expect(result.error.kind).toBe('event-dir-unreadable');
  });

  it('returns a typed Err when an individual permanent-doc file cannot be read (fail-closed)', () => {
    const io: ProvenanceScanIo = {
      listEventFilenames: () => ok(['2ff03ded-aaaa-4000-8000-000000000000.json']),
      listDocPaths: () => ok(['adr/199.md']),
      readText: (path) => (path === 'adr/199.md' ? err('EACCES: permission denied') : ok('')),
      exists: () => false,
    };
    const result = runProvenanceCheck(
      {
        eventDirs: ['comms'],
        docRoots: ['adr'],
        digestPath: 'digest.md',
        candidateEventIds: ['2ff03ded'],
      },
      io,
    );
    if (result.ok) {
      expect.fail('expected Err when a permanent-doc file is unreadable');
    }
    expect(result.error.kind).toBe('doc-unreadable');
  });

  it('returns a typed Err when the digest exists but cannot be read (fail-closed)', () => {
    const io: ProvenanceScanIo = {
      listEventFilenames: () => ok(['2ff03ded-aaaa-4000-8000-000000000000.json']),
      listDocPaths: () => ok(['adr/199.md']),
      readText: (path) =>
        path === 'digest.md' ? err('EACCES: permission denied') : ok('cites 2ff03ded'),
      exists: (path) => path === 'digest.md',
    };
    const result = runProvenanceCheck(
      {
        eventDirs: ['comms'],
        docRoots: ['adr'],
        digestPath: 'digest.md',
        candidateEventIds: ['2ff03ded'],
      },
      io,
    );
    if (result.ok) {
      expect.fail('expected Err when the digest is unreadable');
    }
    expect(result.error.kind).toBe('digest-unreadable');
  });
});
