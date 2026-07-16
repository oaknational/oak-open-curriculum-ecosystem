import { createHash, randomUUID } from 'node:crypto';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

import {
  ensureGuardedDirectory,
  readGuardedRegularFile,
  removeGuardedRegularFile,
  writeGuardedAtomic,
} from './guarded-local-io.js';
import { LeaseDirectoryStore, safeLstat } from './lease-directory.js';

export const REVIEW_LEASE_STALE_AFTER_MS = 10_000;

export interface ReviewLease {
  readonly generation: string;
  readonly generationPath: string;
  readonly leaseDirectory: string;
  readonly ownerToken: string;
  readonly stateDirectory: string;
}

export type LeaseStart =
  | { readonly kind: 'acquired'; readonly lease: ReviewLease }
  | { readonly kind: 'invalidated-only'; readonly generation: string }
  | { readonly kind: 'busy'; readonly generation: string }
  | { readonly kind: 'unavailable' };

export interface LeaseClock {
  readonly nowMilliseconds: () => number;
  readonly monotonicNanoseconds: () => bigint;
  readonly uniqueToken: () => string;
}

export interface LeaseStateLimits {
  readonly maxGenerationFiles: number;
  readonly maxStateEntries: number;
}

const productionClock: LeaseClock = {
  nowMilliseconds: Date.now,
  monotonicNanoseconds: process.hrtime.bigint,
  uniqueToken: randomUUID,
};
const productionLimits: LeaseStateLimits = {
  maxGenerationFiles: 256,
  maxStateEntries: 512,
};

export class FileReviewLeaseCoordinator {
  readonly #clock: LeaseClock;
  readonly #directories: LeaseDirectoryStore;
  readonly #limits: LeaseStateLimits;

  constructor(clock: LeaseClock = productionClock, limits: LeaseStateLimits = productionLimits) {
    this.#clock = clock;
    this.#directories = new LeaseDirectoryStore(clock, REVIEW_LEASE_STALE_AFTER_MS);
    this.#limits = limits;
  }

  async begin(input: {
    readonly projectRoot: string;
    readonly sessionId: string;
    readonly invokeReview: boolean;
  }): Promise<LeaseStart> {
    const state = await ensureGuardedDirectory(input.projectRoot, [
      { name: '.claude' },
      { name: 'logs' },
      { name: 'codex-review-state', mode: 0o700 },
    ]);
    if (!state.ok) {
      return { kind: 'unavailable' };
    }
    const stateDirectory = state.value;
    const sessionKey = createHash('sha256').update(input.sessionId).digest('hex').slice(0, 20);
    const recorded = await this.#recordGeneration(stateDirectory, sessionKey);
    if (recorded === undefined) {
      return { kind: 'unavailable' };
    }
    const hasCapacity = await this.#trimStateDirectory(stateDirectory, recorded.generationPath);
    if (!input.invokeReview) {
      return { kind: 'invalidated-only', generation: recorded.generation };
    }
    if (!hasCapacity) {
      return { kind: 'busy', generation: recorded.generation };
    }
    const leaseDirectory = join(stateDirectory, `${sessionKey}.lease`);
    const ownerToken = this.#clock.uniqueToken();
    if (!(await this.#directories.acquire(leaseDirectory, ownerToken))) {
      return { kind: 'busy', generation: recorded.generation };
    }
    return {
      kind: 'acquired',
      lease: {
        generation: recorded.generation,
        generationPath: recorded.generationPath,
        leaseDirectory,
        ownerToken,
        stateDirectory,
      },
    };
  }

  async isCurrent(lease: ReviewLease): Promise<boolean> {
    const generation = await readGuardedRegularFile(lease.generationPath, 256);
    return generation.ok && generation.value.content.toString('utf8') === lease.generation;
  }

  async release(lease: ReviewLease): Promise<void> {
    await this.#directories.release(lease.leaseDirectory, lease.ownerToken);
  }

  async #recordGeneration(
    stateDirectory: string,
    sessionKey: string,
  ): Promise<{ readonly generation: string; readonly generationPath: string } | undefined> {
    const timestamp = this.#clock.monotonicNanoseconds().toString().padStart(20, '0');
    const generation = `${timestamp}-${this.#clock.uniqueToken()}`;
    const generationPath = join(stateDirectory, `${sessionKey}.generation`);
    const written = await writeGuardedAtomic(generationPath, generation, 0o600, this.#pathToken());
    if (!written.ok) {
      return undefined;
    }
    return { generation, generationPath };
  }

  async #trimStateDirectory(stateDirectory: string, currentGenerationPath: string) {
    let entries = await readdir(stateDirectory);
    if (entries.length > this.#limits.maxStateEntries) {
      await Promise.all(entries.map((entry) => this.#removeExpiredArtifact(stateDirectory, entry)));
      const generations = await generationFiles(stateDirectory, await readdir(stateDirectory));
      const removable = oldestRemovableGenerations(
        generations,
        currentGenerationPath,
        this.#limits.maxGenerationFiles,
      );
      await Promise.all(removable.map(removeGuardedRegularFile));
      entries = await readdir(stateDirectory);
    }
    return entries.length < this.#limits.maxStateEntries;
  }

  async #removeExpiredArtifact(stateDirectory: string, entry: string): Promise<void> {
    const path = join(stateDirectory, entry);
    if (entry.endsWith('.lease')) {
      await this.#directories.retireIfStale(path);
      return;
    }
    if (entry.endsWith('.tmp') || entry.endsWith('.stale')) {
      await this.#directories.removeArtifactIfStale(path);
    }
  }

  #pathToken(): string {
    return createHash('sha256').update(this.#clock.uniqueToken()).digest('hex').slice(0, 16);
  }
}

async function generationFiles(stateDirectory: string, entries: readonly string[]) {
  const candidates = await Promise.all(
    entries
      .filter((entry) => entry.endsWith('.generation'))
      .map(async (entry) => {
        const path = join(stateDirectory, entry);
        const details = await safeLstat(path);
        return details === undefined || !details.isFile() || details.isSymbolicLink()
          ? undefined
          : { path, mtimeMs: details.mtimeMs };
      }),
  );
  return candidates.filter((candidate) => candidate !== undefined);
}

function oldestRemovableGenerations(
  generations: readonly { readonly path: string; readonly mtimeMs: number }[],
  currentGenerationPath: string,
  maximum: number,
): string[] {
  const ordered = [...generations].sort((left, right) => left.mtimeMs - right.mtimeMs);
  let excess = Math.max(0, ordered.length - maximum);
  return ordered.flatMap((candidate) => {
    if (excess === 0 || candidate.path === currentGenerationPath) {
      return [];
    }
    excess -= 1;
    return [candidate.path];
  });
}
