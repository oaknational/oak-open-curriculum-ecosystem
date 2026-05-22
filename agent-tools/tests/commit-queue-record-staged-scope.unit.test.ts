import { describe, expect, it } from 'vitest';

import {
  createStagedBundleFingerprint,
  type CommitIntent,
  type CommitQueueAgentId,
  type CommitQueueClaim,
  type CommitQueueRegistry,
} from '../src/commit-queue';
import { recordStagedBundle } from '../src/commit-queue/core.js';
import { getStagedBundleScoped } from '../src/commit-queue/git.js';

const writerA: CommitQueueAgentId = {
  agent_name: 'Stormbound Kiting Squall',
  platform: 'claude',
  model: 'claude-opus-4-7',
  session_id_prefix: 'ddbea2',
};

function intentForA(): CommitIntent {
  return {
    intent_id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    claim_id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    agent_id: writerA,
    files: ['agent-tools/src/commit-queue/core.ts', 'agent-tools/src/commit-queue/git.ts'],
    commit_subject: 'feat(commit-queue): scope record-staged to intent.files',
    queued_at: '2026-05-22T15:00:00Z',
    updated_at: '2026-05-22T15:00:00Z',
    expires_at: '2026-05-22T16:00:00Z',
    phase: 'staging',
  };
}

function gitClaim(): CommitQueueClaim {
  return {
    claim_id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    agent_id: writerA,
    areas: [{ kind: 'git', patterns: ['index/head'] }],
  };
}

function emptyRegistry(): CommitQueueRegistry {
  return {
    schema_version: '1.3.0',
    commit_queue: [intentForA()],
    claims: [gitClaim()],
  };
}

/**
 * Index snapshots model the git index content for each file at a moment in
 * time. The fake runGit below honours a pathspec by filtering the snapshot.
 *
 * The system-state invariants under test do not depend on real git
 * semantics for `--name-only`, `--name-status`, and `--full-index --binary`;
 * the canned output below is sufficient to prove that scoped reads return
 * only in-scope content, which is what fingerprint stability depends on.
 */
interface IndexFile {
  readonly nameStatus: string;
  readonly patch: string;
}

interface IndexSnapshot {
  readonly [path: string]: IndexFile;
}

function inScopeFilesFor(snapshot: IndexSnapshot, args: readonly string[]): readonly string[] {
  const dashDashIndex = args.indexOf('--');
  const allFiles = Object.keys(snapshot).sort((a, b) => a.localeCompare(b));
  const pathspec = dashDashIndex === -1 ? allFiles : args.slice(dashDashIndex + 1);
  return pathspec.filter((file) => file in snapshot);
}

type FakeGitRenderer = (files: readonly string[], snapshot: IndexSnapshot) => string;

function shapeKeyFor(args: readonly string[]): string {
  if (args[0] === 'status' && args.includes('--short')) {
    return 'status-short';
  }
  if (args[0] !== 'diff' || !args.includes('--cached')) {
    return 'unsupported';
  }
  if (args.includes('--name-only')) {
    return 'diff-name-only';
  }
  if (args.includes('--full-index')) {
    return 'diff-patch';
  }
  if (args.includes('--name-status')) {
    return 'diff-name-status';
  }
  return 'unsupported';
}

const fakeGitRenderers: Readonly<Record<string, FakeGitRenderer>> = {
  'diff-name-only': (files) => files.map((file) => `${file}\n`).join(''),
  'diff-name-status': (files, snapshot) =>
    files.map((file) => snapshot[file]?.nameStatus ?? '').join(''),
  'diff-patch': (files, snapshot) => files.map((file) => snapshot[file]?.patch ?? '').join(''),
  'status-short': (files) => files.map((file) => `M  ${file}\n`).join(''),
};

function fakeRunGitFor(snapshot: IndexSnapshot): (args: readonly string[]) => string {
  return (args) => {
    const shapeKey = shapeKeyFor(args);
    const renderer = fakeGitRenderers[shapeKey];
    if (renderer === undefined) {
      throw new Error(`fake runGit received unexpected args: ${JSON.stringify(args)}`);
    }
    return renderer(inScopeFilesFor(snapshot, args), snapshot);
  };
}

describe('getStagedBundleScoped', () => {
  it('reads only the files matching the intent pathspec, omitting out-of-scope files', () => {
    const snapshot: IndexSnapshot = {
      'agent-tools/src/commit-queue/core.ts': {
        nameStatus: 'M\tagent-tools/src/commit-queue/core.ts\n',
        patch: 'diff core.ts (writer A)\n',
      },
      'agent-tools/src/commit-queue/git.ts': {
        nameStatus: 'M\tagent-tools/src/commit-queue/git.ts\n',
        patch: 'diff git.ts (writer A)\n',
      },
      'agent-tools/src/bin/commit-queue.ts': {
        nameStatus: 'M\tagent-tools/src/bin/commit-queue.ts\n',
        patch: 'diff bin/commit-queue.ts (writer B)\n',
      },
    };

    const bundle = getStagedBundleScoped({
      repoRoot: '/fake/repo',
      pathspec: ['agent-tools/src/commit-queue/core.ts', 'agent-tools/src/commit-queue/git.ts'],
      runGit: fakeRunGitFor(snapshot),
    });

    expect(bundle.stagedNameOnly).toBe(
      'agent-tools/src/commit-queue/core.ts\nagent-tools/src/commit-queue/git.ts\n',
    );
    expect(bundle.stagedNameStatus).toBe(
      'M\tagent-tools/src/commit-queue/core.ts\nM\tagent-tools/src/commit-queue/git.ts\n',
    );
    expect(bundle.stagedPatch).toBe('diff core.ts (writer A)\ndiff git.ts (writer A)\n');
    expect(bundle.stagedNameOnly).not.toContain('bin/commit-queue.ts');
    expect(bundle.stagedPatch).not.toContain('writer B');
  });
});

describe('record-staged scope invariant: writer A is independent of writer B', () => {
  it("writer A's recorded fingerprint is stable when writer B's out-of-scope stage drifts", () => {
    const intent = intentForA();
    const writerAFiles = {
      'agent-tools/src/commit-queue/core.ts': {
        nameStatus: 'M\tagent-tools/src/commit-queue/core.ts\n',
        patch: 'diff core.ts (writer A, content v1)\n',
      },
      'agent-tools/src/commit-queue/git.ts': {
        nameStatus: 'M\tagent-tools/src/commit-queue/git.ts\n',
        patch: 'diff git.ts (writer A, content v1)\n',
      },
    } as const;
    const snapshotBefore: IndexSnapshot = {
      ...writerAFiles,
      'agent-tools/src/bin/commit-queue.ts': {
        nameStatus: 'M\tagent-tools/src/bin/commit-queue.ts\n',
        patch: 'diff bin/commit-queue.ts (writer B, content v1)\n',
      },
    };
    const snapshotAfter: IndexSnapshot = {
      ...writerAFiles,
      'agent-tools/src/bin/commit-queue.ts': {
        nameStatus: 'M\tagent-tools/src/bin/commit-queue.ts\n',
        patch: 'diff bin/commit-queue.ts (writer B, content v2 — peer re-staged)\n',
      },
      'agent-tools/src/bin/collaboration-state.ts': {
        nameStatus: 'A\tagent-tools/src/bin/collaboration-state.ts\n',
        patch: 'diff collaboration-state.ts (writer B, newly staged)\n',
      },
    };

    const bundleBefore = getStagedBundleScoped({
      repoRoot: '/fake/repo',
      pathspec: intent.files,
      runGit: fakeRunGitFor(snapshotBefore),
    });
    const fingerprintBefore = createStagedBundleFingerprint({
      nameStatus: bundleBefore.stagedNameStatus,
      patch: bundleBefore.stagedPatch,
    });

    const bundleAfter = getStagedBundleScoped({
      repoRoot: '/fake/repo',
      pathspec: intent.files,
      runGit: fakeRunGitFor(snapshotAfter),
    });
    const fingerprintAfter = createStagedBundleFingerprint({
      nameStatus: bundleAfter.stagedNameStatus,
      patch: bundleAfter.stagedPatch,
    });

    expect(fingerprintAfter).toBe(fingerprintBefore);
  });

  it("writer A's recorded fingerprint changes when writer A's own in-scope stage drifts", () => {
    const intent = intentForA();
    const writerBFile = {
      'agent-tools/src/bin/commit-queue.ts': {
        nameStatus: 'M\tagent-tools/src/bin/commit-queue.ts\n',
        patch: 'diff bin/commit-queue.ts (writer B, stable)\n',
      },
    } as const;
    const snapshotBefore: IndexSnapshot = {
      'agent-tools/src/commit-queue/core.ts': {
        nameStatus: 'M\tagent-tools/src/commit-queue/core.ts\n',
        patch: 'diff core.ts (writer A, content v1)\n',
      },
      'agent-tools/src/commit-queue/git.ts': {
        nameStatus: 'M\tagent-tools/src/commit-queue/git.ts\n',
        patch: 'diff git.ts (writer A, content v1)\n',
      },
      ...writerBFile,
    };
    const snapshotAfter: IndexSnapshot = {
      'agent-tools/src/commit-queue/core.ts': {
        nameStatus: 'M\tagent-tools/src/commit-queue/core.ts\n',
        patch: 'diff core.ts (writer A, content v2 — own re-stage)\n',
      },
      'agent-tools/src/commit-queue/git.ts': {
        nameStatus: 'M\tagent-tools/src/commit-queue/git.ts\n',
        patch: 'diff git.ts (writer A, content v1)\n',
      },
      ...writerBFile,
    };

    const bundleBefore = getStagedBundleScoped({
      repoRoot: '/fake/repo',
      pathspec: intent.files,
      runGit: fakeRunGitFor(snapshotBefore),
    });
    const fingerprintBefore = createStagedBundleFingerprint({
      nameStatus: bundleBefore.stagedNameStatus,
      patch: bundleBefore.stagedPatch,
    });

    const bundleAfter = getStagedBundleScoped({
      repoRoot: '/fake/repo',
      pathspec: intent.files,
      runGit: fakeRunGitFor(snapshotAfter),
    });
    const fingerprintAfter = createStagedBundleFingerprint({
      nameStatus: bundleAfter.stagedNameStatus,
      patch: bundleAfter.stagedPatch,
    });

    expect(fingerprintAfter).not.toBe(fingerprintBefore);
  });

  it('recordStagedBundle stores the scoped fingerprint when fed scoped staged content', () => {
    const intent = intentForA();
    const registry = emptyRegistry();
    const snapshot: IndexSnapshot = {
      'agent-tools/src/commit-queue/core.ts': {
        nameStatus: 'M\tagent-tools/src/commit-queue/core.ts\n',
        patch: 'diff core.ts\n',
      },
      'agent-tools/src/commit-queue/git.ts': {
        nameStatus: 'M\tagent-tools/src/commit-queue/git.ts\n',
        patch: 'diff git.ts\n',
      },
      'agent-tools/src/bin/commit-queue.ts': {
        nameStatus: 'M\tagent-tools/src/bin/commit-queue.ts\n',
        patch: 'diff bin/commit-queue.ts (peer)\n',
      },
    };

    const scopedBundle = getStagedBundleScoped({
      repoRoot: '/fake/repo',
      pathspec: intent.files,
      runGit: fakeRunGitFor(snapshot),
    });

    const updatedRegistry = recordStagedBundle({
      registry,
      intentId: intent.intent_id,
      nowIso: '2026-05-22T15:05:00Z',
      stagedNameStatus: scopedBundle.stagedNameStatus,
      stagedPatch: scopedBundle.stagedPatch,
    });

    const updatedIntent = updatedRegistry.commit_queue.find(
      (entry) => entry.intent_id === intent.intent_id,
    );

    const expectedFingerprint = createStagedBundleFingerprint({
      nameStatus: scopedBundle.stagedNameStatus,
      patch: scopedBundle.stagedPatch,
    });

    expect(updatedIntent?.staged_bundle_fingerprint).toBe(expectedFingerprint);
    expect(updatedIntent?.staged_name_status).toBe(scopedBundle.stagedNameStatus);
    expect(updatedIntent?.staged_name_status).not.toContain('bin/commit-queue.ts');
    expect(updatedIntent?.staged_name_status).not.toContain('peer');
  });
});
