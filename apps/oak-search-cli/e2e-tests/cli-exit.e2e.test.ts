/**
 * E2E tests for CLI process exit behaviour.
 *
 * @remarks
 * These tests verify that the CLI exits cleanly in all scenarios:
 * - Success path: `--help` exits with code 0
 * - Error path: unknown subcommand exits with code 1
 * - Precondition failure: `admin stage --bulk-dir ./does-not-exist`
 *   exits with code 1 and helpful error (no TCP connections created)
 *
 * @see ADR-133 CLI Resource Lifecycle Management
 */
import { describe, it, expect } from 'vitest';
import { childProcessEnv } from '../src/lib/env.js';
import { spawn } from 'child_process';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const currentDir = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(currentDir, '..');
const cliEntryPoint = resolve(appRoot, 'bin/oaksearch.ts');

/** Maximum time (ms) to wait for the CLI process to exit. */
const EXIT_TIMEOUT_MS = 5000;

/**
 * Spawn the CLI and capture output within a timeout.
 *
 * @param args - CLI arguments to pass
 * @param envOverrides - Additional environment variables
 * @returns Promise resolving to stdout, stderr, and exitCode
 */
function runCli(
  args: string[],
  envOverrides: Record<string, string> = {},
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  return new Promise((resolve, reject) => {
    const child = spawn('npx', ['tsx', cliEntryPoint, ...args], {
      cwd: appRoot,
      env: {
        ...childProcessEnv(),
        ELASTICSEARCH_URL: 'http://localhost:9200',
        ELASTICSEARCH_API_KEY: 'placeholder',
        SEARCH_API_KEY: 'placeholder',
        SEARCH_INDEX_TARGET: 'primary',
        ...envOverrides,
      },
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data: Buffer) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data: Buffer) => {
      stderr += data.toString();
    });

    const timeout = setTimeout(() => {
      child.kill('SIGKILL');
      reject(
        new Error(
          `CLI process did not exit within ${EXIT_TIMEOUT_MS}ms.\n` +
            `stdout: ${stdout}\nstderr: ${stderr}`,
        ),
      );
    }, EXIT_TIMEOUT_MS);

    child.on('close', (exitCode) => {
      clearTimeout(timeout);
      resolve({ stdout, stderr, exitCode: exitCode ?? 1 });
    });
  });
}

describe('CLI process exit behaviour', () => {
  it('exits cleanly with code 0 for --help', async () => {
    const result = await runCli(['--help']);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('oaksearch');
  });

  it('exits with code 1 for unknown subcommand', async () => {
    const result = await runCli(['nonexistent-command']);

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('unknown command');
  });

  it('exits with code 1 and helpful error for invalid bulk dir', async () => {
    const result = await runCli(['admin', 'stage', '--bulk-dir', './does-not-exist'], {
      OAK_API_KEY: 'placeholder',
    });

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('Bulk download directory not found');
    expect(result.stderr).toContain('bulk:download');
  });
});
