import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

/**
 * E2E: the `oaksearch` CLI as a running system over its stdio protocol channel.
 *
 * The runner harness boots the BUILT CLI (`node dist/bin/oaksearch.js`) as the
 * system under test and asserts on its argv → stdout/stderr/exit-code
 * contract — the protocol channel for a command-line system. Network-free by
 * construction: `--version`, `--help`, and unknown-command handling never reach
 * Elasticsearch or the network (config-load failure is non-fatal by design —
 * see `bin/oaksearch.ts`, which keeps `--help`/`--version` working without a
 * validated environment). Live-Elasticsearch behaviour is smoke-test territory,
 * not E2E (see `vitest.e2e.config.ts`).
 *
 * The build is a precondition (turbo `test:e2e` dependsOn `build`); the test
 * itself performs no filesystem or network IO — it only drives the system and
 * asserts on the response.
 */

const BUILT_CLI = resolve(dirname(fileURLToPath(import.meta.url)), '../dist/bin/oaksearch.js');

interface CliRun {
  readonly status: number | null;
  readonly stdout: string;
  readonly stderr: string;
}

function runCli(args: readonly string[]): CliRun {
  // Array args, no shell: there is no quoting or command-injection surface.
  const result = spawnSync(process.execPath, [BUILT_CLI, ...args], { encoding: 'utf8' });
  return { status: result.status, stdout: result.stdout ?? '', stderr: result.stderr ?? '' };
}

describe('oaksearch CLI contract (e2e)', () => {
  it('reports a semantic version and exits 0 for --version', () => {
    const { status, stdout } = runCli(['--version']);

    expect(status).toBe(0);
    expect(stdout.trim()).toMatch(/^\d+\.\d+\.\d+/);
  });

  it('prints usage naming every top-level command and exits 0 for --help', () => {
    const { status, stdout } = runCli(['--help']);

    expect(status).toBe(0);
    expect(stdout).toContain('Usage: oaksearch');
    for (const command of ['search', 'admin', 'eval', 'observe']) {
      expect(stdout).toContain(command);
    }
  });

  it('rejects an unknown command with a non-zero exit and a stderr diagnostic', () => {
    const { status, stderr } = runCli(['definitely-not-a-real-command']);

    expect(status).not.toBe(0);
    expect(stderr).toContain('unknown command');
  });
});
