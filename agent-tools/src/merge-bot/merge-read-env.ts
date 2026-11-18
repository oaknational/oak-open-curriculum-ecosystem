import { execFileSync } from 'node:child_process';

import type { GhCommandExecutor } from '../pr-watch/gh.js';

/**
 * The child environment for a READ-path gh call: pinned host, stripped
 * enterprise fallbacks, and NO token of any kind — reads run on the
 * session's own gh auth (keyring OAuth), writes on the minted token via
 * fetch. The split is the estate's standing identity discipline made
 * structural, and it is what keeps the `gh agent-task` review-run probe
 * alive: that surface refuses app installation tokens outright (F-156 —
 * the merge arm's first live firing died on exactly this, the probe
 * inheriting the minted GH_TOKEN). A stale ambient GH_TOKEN is stripped
 * for the same determinism the old write-path injection had: the read
 * identity is the keyring, never whatever token happened to be in the
 * environment. The host stays pinned (security H1): an ambient GH_HOST
 * would steer reads to another host while the merge PUT stays pinned to
 * api.github.com by construction (`merge-github-api.ts`) — the reading
 * and the act must run against the same host. Split from `merge.ts` at
 * the seam that file's size gate asked for when the records class arrived.
 */
export function readEnv(
  baseEnv: Readonly<Record<string, string | undefined>>,
): Record<string, string | undefined> {
  return {
    ...baseEnv,
    GH_HOST: 'github.com',
    GH_ENTERPRISE_TOKEN: undefined,
    GITHUB_ENTERPRISE_TOKEN: undefined,
    GH_TOKEN: undefined,
    GITHUB_TOKEN: undefined,
  };
}

/** Wraps an executor so every read-path gh call runs on the keyring, host-pinned. */
export function readExecutor(
  baseEnv: Readonly<Record<string, string | undefined>>,
): GhCommandExecutor {
  return (file, args, options) => execFileSync(file, args, { ...options, env: readEnv(baseEnv) });
}
