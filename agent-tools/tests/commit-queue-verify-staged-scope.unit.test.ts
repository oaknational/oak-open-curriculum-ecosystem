import { describe, expect, it } from 'vitest';

import {
  createStagedBundleFingerprint,
  type CommitIntent,
  type CommitQueueAgentId,
} from '../src/commit-queue';
import { verifyStagedBundle } from '../src/commit-queue/core.js';
import { getStagedBundleScoped } from '../src/commit-queue/git.js';

const writerA: CommitQueueAgentId = {
  agent_name: 'Stormbound Kiting Squall',
  platform: 'claude',
  model: 'claude-opus-4-7',
  session_id_prefix: 'ddbea2',
};

const COMMIT_SUBJECT_A = 'feat(commit-queue): verify-staged adopts scoped fingerprint';
const FINGERPRINT_CHANGED_REASON = 'staged bundle fingerprint changed since it was recorded';

function intentForA(files: readonly string[]): CommitIntent {
  return {
    intent_id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    claim_id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    agent_id: writerA,
    files,
    commit_subject: COMMIT_SUBJECT_A,
    queued_at: '2026-05-22T15:00:00Z',
    updated_at: '2026-05-22T15:00:00Z',
    expires_at: '2026-05-22T16:00:00Z',
    phase: 'staging',
  };
}

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

function intentWithRecordedFingerprint(
  files: readonly string[],
  snapshot: IndexSnapshot,
): CommitIntent {
  const bundle = getStagedBundleScoped({
    repoRoot: '/fake/repo',
    pathspec: files,
    runGit: fakeRunGitFor(snapshot),
  });
  const fingerprint = createStagedBundleFingerprint({
    nameStatus: bundle.stagedNameStatus,
    patch: bundle.stagedPatch,
  });
  return {
    ...intentForA(files),
    staged_bundle_fingerprint: fingerprint,
    staged_name_status: bundle.stagedNameStatus,
  };
}

describe('verify-staged scope invariant: writer A is independent of writer B', () => {
  it('reports the staged content unchanged when a peer re-stages a file outside writer A scope', () => {
    const writerAFiles = [
      'agent-tools/src/commit-queue/core.ts',
      'agent-tools/src/commit-queue/git.ts',
    ];
    const writerAContent = {
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
      ...writerAContent,
      'agent-tools/src/bin/commit-queue.ts': {
        nameStatus: 'M\tagent-tools/src/bin/commit-queue.ts\n',
        patch: 'diff bin/commit-queue.ts (writer B, v1)\n',
      },
    };
    const snapshotAfter: IndexSnapshot = {
      ...writerAContent,
      'agent-tools/src/bin/commit-queue.ts': {
        nameStatus: 'M\tagent-tools/src/bin/commit-queue.ts\n',
        patch: 'diff bin/commit-queue.ts (writer B, v2 — peer re-staged)\n',
      },
      'agent-tools/src/bin/collaboration-state.ts': {
        nameStatus: 'A\tagent-tools/src/bin/collaboration-state.ts\n',
        patch: 'diff collaboration-state.ts (writer B newly staged)\n',
      },
    };

    const intent = intentWithRecordedFingerprint(writerAFiles, snapshotBefore);
    const bundleAfter = getStagedBundleScoped({
      repoRoot: '/fake/repo',
      pathspec: intent.files,
      runGit: fakeRunGitFor(snapshotAfter),
    });

    const result = verifyStagedBundle({
      intent,
      stagedNameOnly: bundleAfter.stagedNameOnly,
      stagedNameStatus: bundleAfter.stagedNameStatus,
      stagedPatch: bundleAfter.stagedPatch,
      worktreeShortStatus: bundleAfter.worktreeShortStatus,
      commitSubject: COMMIT_SUBJECT_A,
    });

    expect(result.ok).toBe(true);
  });

  it('signals that the staged content has changed when writer A re-stages an in-scope file', () => {
    const writerAFiles = [
      'agent-tools/src/commit-queue/core.ts',
      'agent-tools/src/commit-queue/git.ts',
    ];
    const writerBContent = {
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
      ...writerBContent,
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
      ...writerBContent,
    };

    const intent = intentWithRecordedFingerprint(writerAFiles, snapshotBefore);
    const bundleAfter = getStagedBundleScoped({
      repoRoot: '/fake/repo',
      pathspec: intent.files,
      runGit: fakeRunGitFor(snapshotAfter),
    });

    const result = verifyStagedBundle({
      intent,
      stagedNameOnly: bundleAfter.stagedNameOnly,
      stagedNameStatus: bundleAfter.stagedNameStatus,
      stagedPatch: bundleAfter.stagedPatch,
      worktreeShortStatus: bundleAfter.worktreeShortStatus,
      commitSubject: COMMIT_SUBJECT_A,
    });

    expect(result.ok).toBe(false);
    expect(result.ok === false ? result.reason : '').toBe(FINGERPRINT_CHANGED_REASON);
  });

  it('signals that the staged content has changed when an overlapping-scope peer re-stages a shared file', () => {
    const sharedFile = 'agent-tools/src/commit-queue/git.ts';
    const writerAFiles = ['agent-tools/src/commit-queue/core.ts', sharedFile];
    const snapshotBefore: IndexSnapshot = {
      'agent-tools/src/commit-queue/core.ts': {
        nameStatus: 'M\tagent-tools/src/commit-queue/core.ts\n',
        patch: 'diff core.ts (writer A)\n',
      },
      [sharedFile]: {
        nameStatus: `M\t${sharedFile}\n`,
        patch: 'diff git.ts (shared, content v1)\n',
      },
    };
    const snapshotAfter: IndexSnapshot = {
      'agent-tools/src/commit-queue/core.ts': {
        nameStatus: 'M\tagent-tools/src/commit-queue/core.ts\n',
        patch: 'diff core.ts (writer A)\n',
      },
      [sharedFile]: {
        nameStatus: `M\t${sharedFile}\n`,
        patch: 'diff git.ts (shared, content v2 — overlapping peer re-staged)\n',
      },
    };

    const intent = intentWithRecordedFingerprint(writerAFiles, snapshotBefore);
    const bundleAfter = getStagedBundleScoped({
      repoRoot: '/fake/repo',
      pathspec: intent.files,
      runGit: fakeRunGitFor(snapshotAfter),
    });

    const result = verifyStagedBundle({
      intent,
      stagedNameOnly: bundleAfter.stagedNameOnly,
      stagedNameStatus: bundleAfter.stagedNameStatus,
      stagedPatch: bundleAfter.stagedPatch,
      worktreeShortStatus: bundleAfter.worktreeShortStatus,
      commitSubject: COMMIT_SUBJECT_A,
    });

    expect(result.ok).toBe(false);
    expect(result.ok === false ? result.reason : '').toBe(FINGERPRINT_CHANGED_REASON);
  });
});

describe('getStagedBundleScoped: boundary behaviour on empty pathspec', () => {
  it('returns an empty bundle when called with an empty pathspec, regardless of index content', () => {
    const snapshot: IndexSnapshot = {
      'agent-tools/src/commit-queue/core.ts': {
        nameStatus: 'M\tagent-tools/src/commit-queue/core.ts\n',
        patch: 'diff core.ts\n',
      },
      'agent-tools/src/commit-queue/git.ts': {
        nameStatus: 'M\tagent-tools/src/commit-queue/git.ts\n',
        patch: 'diff git.ts\n',
      },
    };

    const bundle = getStagedBundleScoped({
      repoRoot: '/fake/repo',
      pathspec: [],
      runGit: fakeRunGitFor(snapshot),
    });

    expect(bundle.stagedNameOnly).toBe('');
    expect(bundle.stagedNameStatus).toBe('');
    expect(bundle.stagedPatch).toBe('');
  });
});
