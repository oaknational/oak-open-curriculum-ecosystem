import { trustedShellPath } from './trusted-shell-directories';

/**
 * A literal child environment for a smoke that runs real git. `PATH` is here
 * because git's hook runner needs a shell on it; everything else is addressed
 * absolutely. `HOME` points into the smoke's throwaway root and the two
 * `GIT_CONFIG_*` variables silence the machine's real git configuration, so
 * the smoke cannot be steered, or broken, by whoever is running it.
 *
 * @param home - the smoke's throwaway root, used as `HOME`.
 */
export function hermeticGitEnv(home: string): Record<string, string> {
  return {
    PATH: trustedShellPath(),
    HOME: home,
    GIT_CONFIG_GLOBAL: '/dev/null',
    GIT_CONFIG_SYSTEM: '/dev/null',
  };
}
