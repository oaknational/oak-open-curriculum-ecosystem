import { describe, expect, it } from 'vitest';

import { readExecutor } from '../src/merge-bot/merge';

/**
 * The read-path executor's env split, proven at the mechanism: the child a
 * `readExecutor` spawns must observe the PINNED read environment — no token
 * of any kind, host pinned — regardless of what the base environment
 * carries (F-156).
 *
 * This is a spawn-topology-class contract test under the sanctioned shape
 * in `.agent/directives/testing-strategy.md` §No process spawning in
 * in-process tests: the behaviour under test IS what the CHILD observes,
 * and no seam below it can carry the proof — `readEnv`'s pure unit pins
 * prove the constructed object, not that the executor hands it to the
 * child. A refactor dropping the `env:` option from the executor leaves
 * every pure pin green and silently re-opens F-156; this one bounded
 * synthetic child is where that mutant dies.
 */
describe('readExecutor child environment (F-156)', () => {
  it('the child observes the pinned token-free env, whatever the base carried', () => {
    // A fully literal base (ADR-078: no ambient process.env in tests) — the
    // child is exec'd by absolute path and reads nothing else from it.
    const run = readExecutor({
      PATH: '/usr/bin',
      GH_TOKEN: 'stale-app-token',
      GITHUB_TOKEN: 'ambient-actions-token',
      GH_HOST: 'ghe.example.com',
      GH_ENTERPRISE_TOKEN: 'enterprise-secret',
      GITHUB_ENTERPRISE_TOKEN: 'legacy-secret',
    });
    const raw = run(
      process.execPath,
      [
        '-e',
        `process.stdout.write(
           JSON.stringify({
             ghToken: process.env.GH_TOKEN ?? null,
             githubToken: process.env.GITHUB_TOKEN ?? null,
             ghHost: process.env.GH_HOST ?? null,
             ghEnterprise: process.env.GH_ENTERPRISE_TOKEN ?? null,
             githubEnterprise: process.env.GITHUB_ENTERPRISE_TOKEN ?? null,
           }),
         );`,
      ],
      { encoding: 'utf8' },
    );
    // Node drops undefined-valued env entries at spawn, so null here is a
    // true removal observed from INSIDE the child, not an object-shape
    // claim about the constructed env.
    expect(JSON.parse(String(raw))).toEqual({
      ghToken: null,
      githubToken: null,
      ghHost: 'github.com',
      ghEnterprise: null,
      githubEnterprise: null,
    });
  });
});
