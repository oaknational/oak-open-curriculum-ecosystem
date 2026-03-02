/**
 * E2E tests for bulk ingestion retry CLI flags.
 *
 * @remarks
 * These tests verify that the CLI accepts and processes the new retry-related flags:
 * - --max-retries: Maximum document-level retry attempts
 * - --retry-delay: Base delay for exponential backoff
 * - --no-retry: Disable document-level retry
 *
 * Tests use dry-run mode to avoid network IO, verifying SYSTEM behavior
 * (CLI parsing, argument validation) while integration tests verify CODE behavior.
 *
 * @see ADR-070 SDK Rate Limiting and Retry (pattern reuse)
 * @see .agent/plans/semantic-search/active/elser-retry-robustness.md
 */
import { describe, it, expect } from 'vitest';
import { spawn } from 'child_process';
import { existsSync, renameSync } from 'node:fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { childProcessEnv } from '../src/lib/env';

const currentDir = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(currentDir, '..');

const ENV_FILE_NAMES = ['.env.local', '.env'] as const;

/**
 * Spawn a CLI process and capture output.
 *
 * @param args - CLI arguments
 * @param envOverrides - Additional environment values for the child process
 * @returns Promise resolving to `{ stdout, stderr, exitCode }`
 */
function runCli(
  args: string[],
  envOverrides: Record<string, string> = {},
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  return new Promise((resolve) => {
    const child = spawn('npx', ['tsx', 'src/lib/elasticsearch/setup/ingest.ts', ...args], {
      cwd: appRoot,
      env: {
        ...childProcessEnv(),
        // Set required environment values without relying on .env files
        ELASTICSEARCH_URL: 'http://localhost:9200',
        ELASTICSEARCH_API_KEY: 'test-elasticsearch-api-key',
        OAK_API_KEY: 'test-oak-api-key',
        SEARCH_API_KEY: 'test-search-api-key',
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

    child.on('close', (exitCode) => {
      resolve({ stdout, stderr, exitCode: exitCode ?? 1 });
    });
  });
}

/**
 * Temporarily hide `.env.local` / `.env` in app root to prove CLI does not
 * depend on env files when required process env values are present.
 */
async function withHiddenEnvFiles(
  run: () => Promise<void>,
  suffix = `e2e-hidden-${Date.now().toString()}`,
): Promise<void> {
  const moved: { from: string; to: string }[] = [];

  try {
    for (const fileName of ENV_FILE_NAMES) {
      const from = join(appRoot, fileName);
      if (!existsSync(from)) {
        continue;
      }
      const to = join(appRoot, `${fileName}.${suffix}`);
      renameSync(from, to);
      moved.push({ from, to });
    }
    await run();
  } finally {
    for (const { from, to } of moved.reverse()) {
      if (existsSync(to)) {
        renameSync(to, from);
      }
    }
  }
}

describe('Bulk Retry CLI Flags E2E', () => {
  it('prints help and exits 0 without env files', async () => {
    await withHiddenEnvFiles(async () => {
      const { stdout, stderr, exitCode } = await runCli(['--help']);

      expect(exitCode).toBe(0);
      const output = stdout + stderr;
      expect(output).toContain('--max-retries');
      expect(output).not.toContain('Environment not loaded');
    });
  });

  /**
   * Test: CLI should accept --max-retries flag.
   *
   * Given: CLI invoked with --help
   * Expected: Help text includes --max-retries documentation
   */
  it('accepts --max-retries flag', async () => {
    const { stdout, stderr } = await runCli(['--help']);

    // Help text should include --max-retries documentation
    expect(stdout + stderr).toContain('--max-retries');
  });

  /**
   * Test: CLI should accept --retry-delay flag.
   *
   * Given: CLI invoked with --help
   * Expected: Help text includes --retry-delay documentation
   */
  it('accepts --retry-delay flag', async () => {
    const { stdout, stderr } = await runCli(['--help']);

    // Help text should include --retry-delay documentation
    expect(stdout + stderr).toContain('--retry-delay');
  });

  /**
   * Test: CLI should accept --no-retry flag.
   *
   * Given: CLI invoked with --help
   * Expected: Help text includes --no-retry documentation
   */
  it('accepts --no-retry flag', async () => {
    const { stdout, stderr } = await runCli(['--help']);

    // Help text should include --no-retry documentation
    expect(stdout + stderr).toContain('--no-retry');
  });

  /**
   * Test: --max-retries should validate numeric input.
   *
   * Given: CLI invoked with --max-retries abc (non-numeric)
   * Expected: CLI should reject with validation error
   */
  it('validates --max-retries is numeric', async () => {
    const { stdout, stderr, exitCode } = await runCli(['--dry-run', '--max-retries', 'abc']);

    // Should fail with validation error
    expect(exitCode).not.toBe(0);
    // Error may be in stdout (JSON log) or stderr
    const output = stdout + stderr;
    expect(output).toMatch(/must be.*non-negative integer|invalid/i);
  });

  /**
   * Test: CLI help includes retry configuration documentation.
   *
   * Given: CLI invoked with --help
   * Expected: Help text documents retry configuration options
   */
  it('includes retry configuration in help text', async () => {
    const { stdout, stderr } = await runCli(['--help']);

    const output = stdout + stderr;

    // Should include retry-related documentation
    expect(output).toContain('Retry Configuration');
    expect(output).toContain('--max-retries');
    expect(output).toContain('--retry-delay');
    expect(output).toContain('--no-retry');
  });

  /**
   * Test: Dry-run with retry flags logs expected configuration.
   *
   * Given: CLI invoked with --dry-run --max-retries 5 (bulk mode is default)
   * Expected: Dry-run output shows retry configuration
   */
  it('dry-run logs retry configuration', async () => {
    const { stdout, stderr } = await runCli([
      '--dry-run',
      '--max-retries',
      '5',
      '--retry-delay',
      '2000',
    ]);

    // Dry-run should succeed
    // Note: This test may fail if bulk-downloads dir doesn't exist,
    // but it validates the CLI accepts the flags
    const output = stdout + stderr;

    // Should show configuration
    expect(output).toMatch(/max.*retries.*5/i);
    expect(output).toMatch(/retry.*delay.*2000/i);
  });
});
