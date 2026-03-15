/**
 * E2E coverage for public lifecycle ingestion CLI boundaries.
 *
 * Exercises the public `oaksearch admin` command surface rather than internal
 * implementation script paths.
 */
import { describe, it, expect } from 'vitest';
import { spawn } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { childProcessEnv } from '../src/lib/env';

const currentDir = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(currentDir, '..');

function runCli(
  args: readonly string[],
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  return new Promise((resolveRun) => {
    const child = spawn('pnpm', ['exec', 'tsx', 'bin/oaksearch.ts', ...args], {
      cwd: appRoot,
      env: {
        ...childProcessEnv(),
        ELASTICSEARCH_URL: 'http://localhost:9200',
        ELASTICSEARCH_API_KEY: 'test-elasticsearch-api-key',
        OAK_API_KEY: 'test-oak-api-key',
        SEARCH_API_KEY: 'test-search-api-key',
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
    child.on('close', (exitCode) => {
      resolveRun({ stdout, stderr, exitCode: exitCode ?? 1 });
    });
  });
}

describe('admin lifecycle ingestion command surface', () => {
  it('exposes versioned-ingest on public CLI boundary', async () => {
    const { stdout, stderr, exitCode } = await runCli(['admin', 'versioned-ingest', '--help']);
    expect(exitCode).toBe(0);
    const output = stdout + stderr;
    expect(output).toContain('versioned-ingest');
    expect(output).toContain('--bulk-dir');
  });

  it('exposes stage on public CLI boundary', async () => {
    const { stdout, stderr, exitCode } = await runCli(['admin', 'stage', '--help']);
    expect(exitCode).toBe(0);
    const output = stdout + stderr;
    expect(output).toContain('stage');
    expect(output).toContain('--bulk-dir');
  });

  it('does not expose removed legacy admin ingest command', async () => {
    const { stdout, stderr, exitCode } = await runCli(['admin', 'ingest']);
    expect(exitCode).not.toBe(0);
    const output = stdout + stderr;
    expect(output).toContain("unknown command 'ingest'");
  });
});
