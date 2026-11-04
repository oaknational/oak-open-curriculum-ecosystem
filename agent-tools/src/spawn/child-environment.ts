import { pnpmSpawnEnvironment } from './pnpm-env.js';

/** What decides a spawned child's environment. */
export interface ChildEnvironmentInput {
  /** Whether the child is the trusted pnpm, which runs in a scrubbed environment. */
  readonly pnpm: boolean;
  /** The spawning process's environment. */
  readonly ambient: NodeJS.ProcessEnv;
  /** Variables the caller adds. */
  readonly extra: Readonly<Record<string, string>> | undefined;
  readonly platform: NodeJS.Platform;
}

/**
 * The environment a child is spawned with, or `undefined` to inherit this
 * process's. Extra variables join the ambient ones before a pnpm child's
 * corepack scrub (`pnpm-env.ts`), so a caller's variable reaches the child
 * and can never bring back a corepack variable the scrub removes.
 */
export function childEnvironment(input: ChildEnvironmentInput): NodeJS.ProcessEnv | undefined {
  const merged = input.extra === undefined ? input.ambient : { ...input.ambient, ...input.extra };
  if (input.pnpm) {
    return pnpmSpawnEnvironment(merged, input.platform);
  }

  return input.extra === undefined ? undefined : merged;
}
