import { join } from 'node:path';

import { afterEach, assert, describe, expect, it } from 'vitest';

import {
  FileReviewLeaseCoordinator,
  REVIEW_LEASE_STALE_AFTER_MS,
  type LeaseClock,
} from '../../src/codex-hook-review/lease.js';
import { CodexHookReviewRealFileSystem } from '../test-helpers/codex-hook-review-real-filesystem.js';

const fileSystem = new CodexHookReviewRealFileSystem();

afterEach(async () => {
  await fileSystem.cleanup();
});

describe('FileReviewLeaseCoordinator', () => {
  it('allows one review and lets a later event invalidate it without queuing', async () => {
    const root = await fileSystem.temporaryRoot('codex-review-lease-');
    const clock = fakeClock();
    const coordinator = new FileReviewLeaseCoordinator(clock);
    const first = await coordinator.begin(reviewInput(root, true));
    const second = await coordinator.begin(reviewInput(root, true));

    expect(first.kind).toBe('acquired');
    expect(second.kind).toBe('busy');
    assert(first.kind === 'acquired');
    expect(await coordinator.isCurrent(first.lease)).toBe(false);
  });

  it('lets a subagent write invalidate the active review without invoking another', async () => {
    const root = await fileSystem.temporaryRoot('codex-review-lease-');
    const coordinator = new FileReviewLeaseCoordinator(fakeClock());
    const active = await coordinator.begin(reviewInput(root, true));
    const subagent = await coordinator.begin(reviewInput(root, false));

    expect(subagent.kind).toBe('invalidated-only');
    assert(active.kind === 'acquired');
    expect(await coordinator.isCurrent(active.lease)).toBe(false);
  });

  it('does not replace a lease before the stale threshold', async () => {
    const root = await fileSystem.temporaryRoot('codex-review-lease-');
    const clock = fakeClock();
    const coordinator = new FileReviewLeaseCoordinator(clock);
    const active = await coordinator.begin(reviewInput(root, true));
    assert(active.kind === 'acquired');

    expect((await coordinator.begin(reviewInput(root, true))).kind).toBe('busy');
  });

  it('allows exactly one concurrent contender to reclaim a stale lease', async () => {
    const root = await fileSystem.temporaryRoot('codex-review-lease-');
    const clock = fakeClock();
    const coordinator = new FileReviewLeaseCoordinator(clock);
    const active = await coordinator.begin(reviewInput(root, true));
    assert(active.kind === 'acquired');
    const staleSeconds = (clock.nowMilliseconds() - REVIEW_LEASE_STALE_AFTER_MS - 1) / 1_000;
    await fileSystem.setTimes(join(active.lease.leaseDirectory, 'owner'), staleSeconds);

    const contenders = await Promise.all([
      coordinator.begin(reviewInput(root, true)),
      coordinator.begin(reviewInput(root, true)),
    ]);

    expect(
      contenders.map((result) => result.kind).sort((left, right) => left.localeCompare(right)),
    ).toEqual(['acquired', 'busy']);
    await coordinator.release(active.lease);
    expect((await coordinator.begin(reviewInput(root, true))).kind).toBe('busy');
  });

  it('bounds generations and stale work artefacts while preserving a live lease', async () => {
    const root = await fileSystem.temporaryRoot('codex-review-lease-');
    const clock = fakeClock();
    const coordinator = new FileReviewLeaseCoordinator(clock, {
      maxGenerationFiles: 3,
      maxStateEntries: 8,
    });
    const active = await coordinator.begin(reviewInput(root, true));
    assert(active.kind === 'acquired');
    const staleSeconds = (clock.nowMilliseconds() - REVIEW_LEASE_STALE_AFTER_MS - 1) / 1_000;
    await Promise.all(
      ['one', 'two', 'three', 'four'].map(async (name) => {
        const path = join(active.lease.stateDirectory, `${name}.generation`);
        await fileSystem.writeText(path, name);
        await fileSystem.setTimes(path, staleSeconds);
      }),
    );
    await createStaleFile(
      join(active.lease.stateDirectory, 'orphan.generation.token.tmp'),
      staleSeconds,
    );
    await createStaleDirectory(
      join(active.lease.stateDirectory, 'orphan.lease.token.stale'),
      staleSeconds,
    );
    await createStaleDirectory(
      join(active.lease.stateDirectory, 'orphan-empty.lease'),
      staleSeconds,
    );

    const invalidation = await coordinator.begin({
      projectRoot: root,
      sessionId: 'another-session',
      invokeReview: false,
    });
    const entries = await fileSystem.entries(active.lease.stateDirectory);

    expect(invalidation.kind).toBe('invalidated-only');
    expect(entries.length).toBeLessThanOrEqual(8);
    expect(entries.filter((entry) => entry.endsWith('.generation')).length).toBeLessThanOrEqual(3);
    expect(entries.some((entry) => entry.endsWith('.tmp'))).toBe(false);
    expect(entries.some((entry) => entry.endsWith('.stale'))).toBe(false);
    expect(entries).not.toContain('orphan-empty.lease');
    expect((await coordinator.begin(reviewInput(root, true))).kind).toBe('busy');
  });

  it.each(['.claude', 'codex-review-state'] as const)(
    'rejects a linked %s directory without writing through it',
    async (linkedDirectory) => {
      const root = await fileSystem.temporaryRoot('codex-review-lease-');
      const outside = await fileSystem.temporaryRoot('codex-review-lease-target-');
      if (linkedDirectory === '.claude') {
        await fileSystem.createSymbolicLink(outside, join(root, '.claude'));
      } else {
        const logs = join(root, '.claude', 'logs');
        await fileSystem.createDirectory(logs, { recursive: true });
        await fileSystem.createSymbolicLink(outside, join(logs, 'codex-review-state'));
      }

      const result = await new FileReviewLeaseCoordinator(fakeClock()).begin(
        reviewInput(root, true),
      );

      expect(result).toStrictEqual({ kind: 'unavailable' });
      expect(await fileSystem.entries(outside)).toEqual([]);
    },
  );
});

function reviewInput(projectRoot: string, invokeReview: boolean) {
  return { projectRoot, sessionId: '../../abc123', invokeReview } as const;
}

function fakeClock(): LeaseClock {
  let tick = 1n;
  return {
    nowMilliseconds: () => 20_000,
    monotonicNanoseconds: () => tick++,
    uniqueToken: () => `token-${tick++}`,
  };
}

async function createStaleFile(path: string, staleSeconds: number): Promise<void> {
  await fileSystem.writeText(path, 'abandoned');
  await fileSystem.setTimes(path, staleSeconds);
}

async function createStaleDirectory(path: string, staleSeconds: number): Promise<void> {
  await fileSystem.createDirectory(path);
  await fileSystem.setTimes(path, staleSeconds);
}
