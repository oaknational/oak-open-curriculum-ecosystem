import { createHash } from 'node:crypto';
import { type Stats } from 'node:fs';
import { lstat, mkdir, rename, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { readGuardedRegularFile } from './guarded-local-io.js';

const OWNER_FILE = 'owner';
const TRANSITION_FILE = 'transition';

interface LeaseSnapshot {
  readonly directoryDevice: number;
  readonly directoryInode: number;
  readonly freshnessMtimeMs: number;
  readonly ownerDevice?: number;
  readonly ownerInode?: number;
  readonly ownerToken?: string;
}

interface LeaseDirectoryClock {
  readonly nowMilliseconds: () => number;
  readonly uniqueToken: () => string;
}

export class LeaseDirectoryStore {
  readonly #clock: LeaseDirectoryClock;
  readonly #staleAfterMs: number;

  constructor(clock: LeaseDirectoryClock, staleAfterMs: number) {
    this.#clock = clock;
    this.#staleAfterMs = staleAfterMs;
  }

  async acquire(leaseDirectory: string, ownerToken: string): Promise<boolean> {
    if (await this.#install(leaseDirectory, ownerToken)) {
      return true;
    }
    const tombstone = await this.#move(leaseDirectory, undefined, true);
    if (tombstone === undefined) {
      return false;
    }
    await rm(tombstone, { recursive: true, force: true });
    return this.#install(leaseDirectory, ownerToken);
  }

  async release(leaseDirectory: string, ownerToken: string): Promise<void> {
    const tombstone = await this.#move(leaseDirectory, ownerToken, false);
    if (tombstone !== undefined) {
      await rm(tombstone, { recursive: true, force: true });
    }
  }

  async retireIfStale(leaseDirectory: string): Promise<void> {
    const tombstone = await this.#move(leaseDirectory, undefined, true);
    if (tombstone !== undefined) {
      await rm(tombstone, { recursive: true, force: true });
    }
  }

  async removeArtifactIfStale(path: string): Promise<void> {
    const details = await safeLstat(path);
    if (details !== undefined && this.#isStale(details.mtimeMs)) {
      await rm(path, { recursive: true, force: true });
    }
  }

  async #install(leaseDirectory: string, ownerToken: string): Promise<boolean> {
    try {
      await mkdir(leaseDirectory, { mode: 0o700 });
      await writeFile(join(leaseDirectory, OWNER_FILE), ownerToken, { flag: 'wx', mode: 0o600 });
      return (await this.#readSnapshot(leaseDirectory))?.ownerToken === ownerToken;
    } catch {
      return false;
    }
  }

  async #move(
    leaseDirectory: string,
    expectedOwner: string | undefined,
    staleOnly: boolean,
  ): Promise<string | undefined> {
    const expected = await this.#readSnapshot(leaseDirectory);
    if (expected === undefined || !this.#moveAllowed(expected, expectedOwner, staleOnly)) {
      return undefined;
    }
    const claim = this.#clock.uniqueToken();
    if (!(await this.#claimTransition(leaseDirectory, claim))) {
      return undefined;
    }
    if (!(await this.#claimIsCurrent(leaseDirectory, expected, claim))) {
      await this.#removeOwnedTransition(leaseDirectory, claim);
      return undefined;
    }
    return this.#moveClaimedDirectory(leaseDirectory, expected, claim);
  }

  async #moveClaimedDirectory(
    leaseDirectory: string,
    expected: LeaseSnapshot,
    claim: string,
  ): Promise<string | undefined> {
    const tombstone = `${leaseDirectory}.${this.#pathToken()}.stale`;
    if (!(await tryRename(leaseDirectory, tombstone))) {
      await this.#removeOwnedTransition(leaseDirectory, claim);
      return undefined;
    }
    const moved = await this.#readSnapshot(tombstone);
    if (moved !== undefined && sameLeaseSnapshot(expected, moved)) {
      return tombstone;
    }
    await tryRename(tombstone, leaseDirectory);
    return undefined;
  }

  #moveAllowed(snapshot: LeaseSnapshot, expectedOwner: string | undefined, staleOnly: boolean) {
    if (expectedOwner !== undefined) {
      return snapshot.ownerToken === expectedOwner;
    }
    return !staleOnly || this.#isStale(snapshot.freshnessMtimeMs);
  }

  async #claimTransition(leaseDirectory: string, claim: string): Promise<boolean> {
    const transitionPath = join(leaseDirectory, TRANSITION_FILE);
    if (await tryWriteExclusive(transitionPath, claim)) {
      return true;
    }
    const details = await safeLstat(transitionPath);
    if (details === undefined || !this.#isStale(details.mtimeMs)) {
      return false;
    }
    const discardedPath = `${leaseDirectory}.${this.#pathToken()}.stale`;
    if (!(await tryRename(transitionPath, discardedPath))) {
      return false;
    }
    await rm(discardedPath, { force: true });
    return tryWriteExclusive(transitionPath, claim);
  }

  async #claimIsCurrent(
    leaseDirectory: string,
    expected: LeaseSnapshot,
    claim: string,
  ): Promise<boolean> {
    const confirmed = await this.#readSnapshot(leaseDirectory);
    return (
      confirmed !== undefined &&
      sameLeaseSnapshot(expected, confirmed) &&
      (await this.#ownsTransition(leaseDirectory, claim))
    );
  }

  async #ownsTransition(leaseDirectory: string, claim: string): Promise<boolean> {
    const transition = await readGuardedRegularFile(join(leaseDirectory, TRANSITION_FILE), 256);
    return transition.ok && transition.value.content.toString('utf8') === claim;
  }

  async #removeOwnedTransition(leaseDirectory: string, claim: string): Promise<void> {
    if (await this.#ownsTransition(leaseDirectory, claim)) {
      await rm(join(leaseDirectory, TRANSITION_FILE), { force: true });
    }
  }

  async #readSnapshot(leaseDirectory: string): Promise<LeaseSnapshot | undefined> {
    const directory = await safeLstat(leaseDirectory);
    if (directory === undefined || !directory.isDirectory()) {
      return undefined;
    }
    const owner = await readOwner(join(leaseDirectory, OWNER_FILE));
    return {
      directoryDevice: directory.dev,
      directoryInode: directory.ino,
      freshnessMtimeMs: owner?.mtimeMs ?? directory.mtimeMs,
      ...(owner === undefined
        ? {}
        : { ownerDevice: owner.device, ownerInode: owner.inode, ownerToken: owner.token }),
    };
  }

  #isStale(mtimeMs: number): boolean {
    return this.#clock.nowMilliseconds() - mtimeMs > this.#staleAfterMs;
  }

  #pathToken(): string {
    return createHash('sha256').update(this.#clock.uniqueToken()).digest('hex').slice(0, 16);
  }
}

export async function safeLstat(path: string): Promise<Stats | undefined> {
  try {
    return await lstat(path);
  } catch {
    return undefined;
  }
}

async function readOwner(path: string) {
  const owner = await readGuardedRegularFile(path, 256);
  return owner.ok
    ? {
        token: owner.value.content.toString('utf8'),
        device: owner.value.stats.dev,
        inode: owner.value.stats.ino,
        mtimeMs: owner.value.stats.mtimeMs,
      }
    : undefined;
}

async function tryWriteExclusive(path: string, content: string): Promise<boolean> {
  try {
    await writeFile(path, content, { flag: 'wx', mode: 0o600 });
    return true;
  } catch {
    return false;
  }
}

async function tryRename(from: string, to: string): Promise<boolean> {
  try {
    await rename(from, to);
    return true;
  } catch {
    return false;
  }
}

function sameLeaseSnapshot(left: LeaseSnapshot, right: LeaseSnapshot): boolean {
  return (
    left.directoryDevice === right.directoryDevice &&
    left.directoryInode === right.directoryInode &&
    left.ownerDevice === right.ownerDevice &&
    left.ownerInode === right.ownerInode &&
    left.ownerToken === right.ownerToken
  );
}
