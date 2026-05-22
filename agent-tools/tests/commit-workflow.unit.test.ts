import { describe, expect, it } from 'vitest';

import {
  createStagedBundleFingerprint,
  runCommitWorkflow,
  type CommitIntent,
  type CommitQueueAgentId,
  type CommitQueueClaim,
  type CommitQueueRegistry,
} from '../src/commit-queue';
import {
  type CommitWorkflowDependencies,
  type CommitWorkflowGitCommitResult,
  type CommitWorkflowProcessResult,
} from '../src/commit-queue/commit-workflow';
import { type StagedBundle } from '../src/commit-queue/types';

const agentId: CommitQueueAgentId = {
  agent_name: 'Tempestuous Spiralling Thermal',
  platform: 'claude',
  model: 'claude-opus-4-7',
  session_id_prefix: '9205b8',
};

const claimId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const intentId = '11111111-1111-4111-8111-111111111111';
const subject = 'feat(commit-queue): land workflow primitive';
const queuedAt = '2026-05-22T12:00:00Z';
const expiresAt = '2026-05-22T12:15:00Z';

const stagedNameStatus = 'M\tagent-tools/src/commit-queue/commit-workflow.ts\n';
const stagedPatch =
  'diff --git a/agent-tools/src/commit-queue/commit-workflow.ts b/agent-tools/src/commit-queue/commit-workflow.ts\n';
const stagedNameOnly = 'agent-tools/src/commit-queue/commit-workflow.ts\n';
const stagedFingerprint = createStagedBundleFingerprint({
  nameStatus: stagedNameStatus,
  patch: stagedPatch,
});

function matchingStagedBundle(): StagedBundle {
  return {
    stagedNameOnly,
    stagedNameStatus,
    stagedPatch,
    worktreeShortStatus: 'M  agent-tools/src/commit-queue/commit-workflow.ts\n',
  };
}

function divergedStagedBundle(): StagedBundle {
  const divergedNameStatus =
    'M\tagent-tools/src/commit-queue/commit-workflow.ts\nA\tunexpected/added.ts\n';
  return {
    stagedNameOnly: 'agent-tools/src/commit-queue/commit-workflow.ts\nunexpected/added.ts\n',
    stagedNameStatus: divergedNameStatus,
    stagedPatch:
      'diff --git a/agent-tools/src/commit-queue/commit-workflow.ts b/agent-tools/src/commit-queue/commit-workflow.ts\ndiff --git a/unexpected/added.ts b/unexpected/added.ts\n',
    worktreeShortStatus:
      'M  agent-tools/src/commit-queue/commit-workflow.ts\nA  unexpected/added.ts\n',
  };
}

function queuedIntent(overrides: Partial<CommitIntent> = {}): CommitIntent {
  return {
    intent_id: intentId,
    claim_id: claimId,
    agent_id: agentId,
    files: ['agent-tools/src/commit-queue/commit-workflow.ts'],
    commit_subject: subject,
    queued_at: queuedAt,
    updated_at: queuedAt,
    expires_at: expiresAt,
    phase: 'queued',
    staged_bundle_fingerprint: stagedFingerprint,
    staged_name_status: stagedNameStatus,
    ...overrides,
  };
}

function gitClaim(overrides: Partial<CommitQueueClaim> = {}): CommitQueueClaim {
  return {
    claim_id: claimId,
    agent_id: agentId,
    areas: [{ kind: 'git', patterns: ['index/head'] }],
    intent_to_commit: intentId,
    ...overrides,
  };
}

function initialRegistry(intent: CommitIntent = queuedIntent()): CommitQueueRegistry {
  return {
    schema_version: '1.3.0',
    claims: [gitClaim()],
    commit_queue: [intent],
  };
}

interface RegistryHolder {
  current: CommitQueueRegistry;
  readonly transformations: number;
}

function holderFor(initial: CommitQueueRegistry): RegistryHolder {
  const holder: { current: CommitQueueRegistry; transformations: number } = {
    current: initial,
    transformations: 0,
  };
  return holder;
}

interface FakeDepsInput {
  readonly holder: RegistryHolder;
  readonly stagedBundles: readonly StagedBundle[];
  readonly advisoryResult?: CommitWorkflowProcessResult;
  readonly gitCommitResult?: CommitWorkflowGitCommitResult;
  readonly nowSequence?: readonly string[];
}

interface FakeDepsCallLog {
  readonly stagedBundleCalls: { current: number };
  readonly advisoryCalls: { current: number };
  readonly gitCommitCalls: { current: number };
  readonly nowCalls: { current: number };
  readonly transformationCalls: { current: number };
}

function fakeDeps(input: FakeDepsInput): {
  readonly deps: CommitWorkflowDependencies;
  readonly calls: FakeDepsCallLog;
} {
  const stagedBundleCalls = { current: 0 };
  const advisoryCalls = { current: 0 };
  const gitCommitCalls = { current: 0 };
  const nowCalls = { current: 0 };
  const transformationCalls = { current: 0 };
  const advisory: CommitWorkflowProcessResult = input.advisoryResult ?? {
    exitCode: 0,
    stderr: '',
  };
  const gitCommit: CommitWorkflowGitCommitResult = input.gitCommitResult ?? {
    exitCode: 0,
    stderr: '',
    sha: 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
  };
  const nowSequence: readonly string[] = input.nowSequence ?? [
    '2026-05-22T12:05:00Z',
    '2026-05-22T12:05:01Z',
    '2026-05-22T12:05:02Z',
  ];

  const deps: CommitWorkflowDependencies = {
    readRegistry: async () => input.holder.current,
    transformRegistry: async (transform) => {
      transformationCalls.current += 1;
      input.holder.current = transform(input.holder.current);
    },
    getStagedBundle: () => {
      const bundle = input.stagedBundles[stagedBundleCalls.current];
      stagedBundleCalls.current += 1;
      if (bundle === undefined) {
        throw new Error(
          `getStagedBundle called more times (${stagedBundleCalls.current}) than fixtures provided`,
        );
      }
      return bundle;
    },
    runAdvisoryOrchestrator: async () => {
      advisoryCalls.current += 1;
      return advisory;
    },
    runGitCommit: async () => {
      gitCommitCalls.current += 1;
      return gitCommit;
    },
    nowIso: () => {
      const value = nowSequence[Math.min(nowCalls.current, nowSequence.length - 1)];
      nowCalls.current += 1;
      return value;
    },
  };

  return {
    deps,
    calls: { stagedBundleCalls, advisoryCalls, gitCommitCalls, nowCalls, transformationCalls },
  };
}

describe('runCommitWorkflow — successful commit landing', () => {
  it('removes the queued intent from the registry and reports the resulting SHA when staged tree matches and git commit succeeds', async () => {
    const holder = holderFor(initialRegistry());
    const { deps, calls } = fakeDeps({
      holder,
      stagedBundles: [matchingStagedBundle(), matchingStagedBundle()],
    });

    const result = await runCommitWorkflow({ intentId, deps });

    expect(result).toStrictEqual({
      ok: true,
      intentId,
      sha: 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
      advisoryExitCode: 0,
    });
    expect(holder.current.commit_queue).toStrictEqual([]);
    expect(calls.gitCommitCalls.current).toBe(1);
  });

  it('verifies the staged bundle twice — once before the advisory orchestrator and once after — to catch tree widening during the advisory pass', async () => {
    const holder = holderFor(initialRegistry());
    const { deps, calls } = fakeDeps({
      holder,
      stagedBundles: [matchingStagedBundle(), matchingStagedBundle()],
    });

    await runCommitWorkflow({ intentId, deps });

    expect(calls.stagedBundleCalls.current).toBe(2);
    expect(calls.advisoryCalls.current).toBe(1);
  });

  it('clears the queued intent_to_commit field on the owning claim when the commit lands so the claim is ready for closure', async () => {
    const holder = holderFor(initialRegistry());
    const { deps } = fakeDeps({
      holder,
      stagedBundles: [matchingStagedBundle(), matchingStagedBundle()],
    });

    await runCommitWorkflow({ intentId, deps });

    const claim = holder.current.claims.find((entry) => entry.claim_id === claimId);
    expect(claim).toBeDefined();
    expect(claim?.intent_to_commit).toBeUndefined();
  });
});

describe('runCommitWorkflow — advisory polarity is preserved', () => {
  it('proceeds with the git commit attempt even when the advisory orchestrator exits non-zero, and surfaces the advisory exit code on success', async () => {
    const holder = holderFor(initialRegistry());
    const { deps, calls } = fakeDeps({
      holder,
      stagedBundles: [matchingStagedBundle(), matchingStagedBundle()],
      advisoryResult: {
        exitCode: 7,
        stderr: 'practice:fitness:strict-hard reported HARD breaches',
      },
    });

    const result = await runCommitWorkflow({ intentId, deps });

    expect(result).toStrictEqual({
      ok: true,
      intentId,
      sha: 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
      advisoryExitCode: 7,
    });
    expect(calls.gitCommitCalls.current).toBe(1);
    expect(holder.current.commit_queue).toStrictEqual([]);
  });
});

describe('runCommitWorkflow — verify-staged-before guards the staged tree', () => {
  it('transitions the intent to abandoned with notes naming verify-staged-before when the recorded fingerprint no longer matches the staged tree, and does not attempt git commit', async () => {
    const holder = holderFor(initialRegistry());
    const { deps, calls } = fakeDeps({
      holder,
      stagedBundles: [divergedStagedBundle()],
    });

    const result = await runCommitWorkflow({ intentId, deps });

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.stage).toBe('verify-staged-before');
    expect(result.intentId).toBe(intentId);

    const intent = holder.current.commit_queue.find((entry) => entry.intent_id === intentId);
    expect(intent?.phase).toBe('abandoned');
    expect(intent?.notes).toMatch(/^commit-workflow verify-staged-before failure: /);
    expect(calls.gitCommitCalls.current).toBe(0);
    expect(calls.advisoryCalls.current).toBe(0);
  });
});

describe('runCommitWorkflow — verify-staged-after catches tree widening during advisory pass', () => {
  it('transitions the intent to abandoned with notes naming verify-staged-after when the advisory orchestrator left the tree wider than the recorded fingerprint, and does not attempt git commit', async () => {
    const holder = holderFor(initialRegistry());
    const { deps, calls } = fakeDeps({
      holder,
      stagedBundles: [matchingStagedBundle(), divergedStagedBundle()],
    });

    const result = await runCommitWorkflow({ intentId, deps });

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.stage).toBe('verify-staged-after');

    const intent = holder.current.commit_queue.find((entry) => entry.intent_id === intentId);
    expect(intent?.phase).toBe('abandoned');
    expect(intent?.notes).toMatch(/^commit-workflow verify-staged-after failure: /);
    expect(calls.advisoryCalls.current).toBe(1);
    expect(calls.gitCommitCalls.current).toBe(0);
  });
});

describe('runCommitWorkflow — git commit hook-chain refusal', () => {
  it('transitions the intent to abandoned with notes carrying the git-commit stderr when the hook chain refuses the commit', async () => {
    const holder = holderFor(initialRegistry());
    const { deps } = fakeDeps({
      holder,
      stagedBundles: [matchingStagedBundle(), matchingStagedBundle()],
      gitCommitResult: { exitCode: 1, stderr: 'husky/pre-commit failed: lint surface red' },
    });

    const result = await runCommitWorkflow({ intentId, deps });

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.stage).toBe('git-commit');
    expect(result.reason).toContain('husky/pre-commit failed: lint surface red');

    const intent = holder.current.commit_queue.find((entry) => entry.intent_id === intentId);
    expect(intent?.phase).toBe('abandoned');
    expect(intent?.notes).toMatch(/^commit-workflow git-commit failure: /);
  });
});

describe('runCommitWorkflow — unknown intent id', () => {
  it('reports load-intent failure without mutating the registry when the intent id is not in the queue', async () => {
    const holder = holderFor(initialRegistry());
    const { deps, calls } = fakeDeps({
      holder,
      stagedBundles: [],
    });

    const result = await runCommitWorkflow({
      intentId: 'ffffffff-ffff-4fff-8fff-ffffffffffff',
      deps,
    });

    expect(result).toStrictEqual({
      ok: false,
      stage: 'load-intent',
      reason: 'unknown intent_id: ffffffff-ffff-4fff-8fff-ffffffffffff',
    });
    expect(holder.current.commit_queue.length).toBe(1);
    expect(calls.transformationCalls.current).toBe(0);
    expect(calls.gitCommitCalls.current).toBe(0);
  });
});

describe('runCommitWorkflow — audit-trail phase transition', () => {
  it('transitions the intent through pre_commit before removing it from the queue on success', async () => {
    const holder = holderFor(initialRegistry());
    const observedPhases: string[] = [];
    const { deps } = fakeDeps({
      holder,
      stagedBundles: [matchingStagedBundle(), matchingStagedBundle()],
    });

    const wrappedTransform = deps.transformRegistry;
    const wrappedDeps: CommitWorkflowDependencies = {
      ...deps,
      transformRegistry: async (transform) => {
        await wrappedTransform(transform);
        const intent = holder.current.commit_queue.find((entry) => entry.intent_id === intentId);
        if (intent !== undefined) {
          observedPhases.push(intent.phase);
        } else {
          observedPhases.push('<removed>');
        }
      },
    };

    await runCommitWorkflow({ intentId, deps: wrappedDeps });

    expect(observedPhases).toStrictEqual(['pre_commit', '<removed>']);
  });
});
