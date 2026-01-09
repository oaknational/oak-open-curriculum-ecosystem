/**
 * E2E tests for the benchmark CLI.
 *
 * Tests the complete benchmark system as a running process:
 * - CLI argument parsing
 * - Ground truth registry integration
 * - Output formatting
 * - Correct wiring of all modules
 *
 * Uses benchmark-test-harness.ts which injects a simple fake search function.
 * No network IO, no complex mocks.
 *
 * @see benchmark-test-harness.ts - Test CLI with fake search
 * @see benchmark-main.ts - Core logic with dependency injection
 * @see ADR-078 Dependency Injection for Testability
 * @packageDocumentation
 */

import { describe, it, expect } from 'vitest';
import { spawn } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const thisDir = dirname(fileURLToPath(import.meta.url));
const testHarness = resolve(thisDir, '../evaluation/analysis/benchmark-test-harness.ts');

interface CliResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

/**
 * Runs the benchmark test harness with given arguments.
 *
 * Uses the test harness which has a fake search function injected.
 */
async function runBenchmarkCli(args: readonly string[]): Promise<CliResult> {
  return new Promise((resolve) => {
    const child = spawn('npx', ['tsx', testHarness, ...args], {
      cwd: dirname(testHarness),
      env: process.env,
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data: Buffer) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data: Buffer) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      resolve({
        stdout,
        stderr,
        exitCode: code ?? 1,
      });
    });
  });
}

describe('benchmark CLI E2E', () => {
  describe('--help flag', () => {
    it('displays usage information and exits 0', async () => {
      const result = await runBenchmarkCli(['--help']);

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('Usage:');
      expect(result.stdout).toContain('--all');
      expect(result.stdout).toContain('--subject');
      expect(result.stdout).toContain('--phase');
    });
  });

  describe('argument validation', () => {
    it('exits with error when no filter specified', async () => {
      const result = await runBenchmarkCli([]);

      expect(result.exitCode).toBe(1);
      expect(result.stdout).toContain('No filter');
    });

    it('exits with error for invalid subject', async () => {
      const result = await runBenchmarkCli(['--subject', 'invalid-subject', '--phase', 'primary']);

      expect(result.exitCode).toBe(1);
      expect(result.stdout).toContain('No entries match');
    });
  });

  describe('mock ES mode', () => {
    it('runs benchmark with mock ES and produces valid output', async () => {
      // Run with a specific subject/phase that has ground truths
      const result = await runBenchmarkCli(['--subject', 'maths', '--phase', 'primary']);

      expect(result.exitCode).toBe(0);

      // Verify output structure
      expect(result.stdout).toContain('BENCHMARK RESULTS');
      expect(result.stdout).toContain('Subject');
      expect(result.stdout).toContain('Phase');
      expect(result.stdout).toContain('MRR');
      expect(result.stdout).toContain('NDCG');
      expect(result.stdout).toContain('Zero%');

      // Verify maths/primary appears in results
      expect(result.stdout).toContain('maths');
      expect(result.stdout).toContain('primary');

      // Verify OVERALL summary appears
      expect(result.stdout).toContain('OVERALL:');
    });

    it('runs --all flag with fake search', async () => {
      const result = await runBenchmarkCli(['--all']);

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('BENCHMARK RESULTS');
      expect(result.stdout).toContain('OVERALL:');

      // Should have run multiple entries
      expect(result.stdout).toMatch(/Running benchmark for \d+ entries/);
    }, 30000);

    it('verbose mode shows per-query results', async () => {
      const result = await runBenchmarkCli([
        '--subject',
        'maths',
        '--phase',
        'primary',
        '--verbose',
      ]);

      expect(result.exitCode).toBe(0);

      // Verbose mode shows checkmarks or X marks for each query
      expect(result.stdout).toMatch(/[✓✗]/);
      expect(result.stdout).toContain('MRR:');
    });
  });

  describe('metric calculation', () => {
    it('outputs MRR values in expected format', async () => {
      const result = await runBenchmarkCli(['--subject', 'maths', '--phase', 'primary']);

      expect(result.exitCode).toBe(0);

      // MRR should be a decimal between 0 and 1 in format X.XXX
      expect(result.stdout).toMatch(/MRR=\d\.\d{3}/);
    });

    it('reports zero-hit rate as percentage', async () => {
      const result = await runBenchmarkCli(['--subject', 'maths', '--phase', 'primary']);

      expect(result.exitCode).toBe(0);

      // Zero-hit rate should be in the output (as percentage)
      expect(result.stdout).toMatch(/Zero=\d+\.\d+%/);
    });

    it('reports NDCG values', async () => {
      const result = await runBenchmarkCli(['--subject', 'maths', '--phase', 'primary']);

      expect(result.exitCode).toBe(0);

      // NDCG should be in the output
      expect(result.stdout).toMatch(/NDCG=\d\.\d{3}/);
    });
  });
});
