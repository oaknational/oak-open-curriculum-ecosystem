#!/usr/bin/env node

/**
 * Commit-Skill Pre-Commit Gate Orchestrator
 *
 * Runs the commit skill's pre-`git commit` validation sequence as a single
 * composed gate: fitness (`practice:fitness:strict-hard`), vocabulary
 * (`practice:vocabulary`), then commit message validation
 * (`scripts/check-commit-message.sh`). Exits with the first non-zero exit
 * code; exit 0 means every gate passed and the commit may proceed.
 *
 * Doctrinal anchors:
 * - PDR-038 §2026-05-04 amendment — un-enforced doctrine at maturity is a
 *   net liability; fitness and vocabulary are stated principles paired with
 *   structural enforcement at this surface.
 * - PDR-044 — memetic immune system, innate-immunity layer; fast,
 *   deterministic write-time detection at the commit boundary.
 * - ADR-144 — three-zone fitness vocabulary consistency.
 *
 * The orchestrator is dependency-injected so the wiring shape can be unit
 * tested without spawning real sub-processes.
 *
 * Exit codes:
 *   0   every gate passed
 *   ≠0  the first failing gate's exit code
 *
 * Argument forwarding: all CLI arguments are forwarded verbatim to the
 * commit-message check (e.g. `-F .git/COMMIT_EDITMSG`, `-m "subject"`).
 */

import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Result of running a single gate sub-process.
 */
export interface GateResult {
  readonly exitCode: number;
  readonly stderr: string;
}

/**
 * Result of running the full commit-skill gate sequence.
 */
export type CommitSkillGatesResult =
  | { readonly ok: true }
  | {
      readonly ok: false;
      readonly failedGate: 'fitness' | 'vocabulary' | 'message';
      readonly exitCode: number;
      readonly stderr: string;
    };

/**
 * Pure orchestrator: drives the three gates in order and short-circuits on
 * the first failure. Caller injects the gate implementations; the runtime
 * entry binds real spawn-based implementations.
 *
 * @param input - the three injected gate functions
 * @returns the orchestrator outcome
 */
export async function runCommitSkillGates(input: {
  readonly fitnessGate: () => Promise<GateResult>;
  readonly vocabularyGate: () => Promise<GateResult>;
  readonly messageCheck: () => Promise<GateResult>;
}): Promise<CommitSkillGatesResult> {
  const fitness = await input.fitnessGate();
  if (fitness.exitCode !== 0) {
    return {
      ok: false,
      failedGate: 'fitness',
      exitCode: fitness.exitCode,
      stderr: fitness.stderr,
    };
  }

  const vocabulary = await input.vocabularyGate();
  if (vocabulary.exitCode !== 0) {
    return {
      ok: false,
      failedGate: 'vocabulary',
      exitCode: vocabulary.exitCode,
      stderr: vocabulary.stderr,
    };
  }

  const message = await input.messageCheck();
  if (message.exitCode !== 0) {
    return {
      ok: false,
      failedGate: 'message',
      exitCode: message.exitCode,
      stderr: message.stderr,
    };
  }

  return { ok: true };
}

interface SpawnOptions {
  readonly command: string;
  readonly args: readonly string[];
  readonly cwd: string;
}

async function runProcess(options: SpawnOptions): Promise<GateResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(options.command, options.args, {
      cwd: options.cwd,
      stdio: ['ignore', 'inherit', 'pipe'],
    });

    const stderrChunks: Buffer[] = [];
    child.stderr.on('data', (chunk: Buffer) => {
      stderrChunks.push(chunk);
      process.stderr.write(chunk);
    });

    child.on('error', (error) => {
      reject(error);
    });

    child.on('close', (code, signal) => {
      const stderr = Buffer.concat(stderrChunks).toString('utf8');
      if (code === null && signal !== null) {
        resolve({ exitCode: 128, stderr });
        return;
      }
      resolve({ exitCode: code ?? 0, stderr });
    });
  });
}

function describeFailure(failure: Extract<CommitSkillGatesResult, { readonly ok: false }>): string {
  const headers: Record<typeof failure.failedGate, string> = {
    fitness: 'practice:fitness:strict-hard (PDR-038 §2026-05-04 amendment)',
    vocabulary: 'practice:vocabulary (ADR-144)',
    message: 'scripts/check-commit-message.sh',
  };

  return `commit-skill gate "${failure.failedGate}" failed (${headers[failure.failedGate]}); exit ${failure.exitCode}`;
}

async function main(forwardedArgs: readonly string[]): Promise<number> {
  const repoRoot = process.cwd();
  const messageCheckScript = path.join(repoRoot, 'scripts', 'check-commit-message.sh');

  const result = await runCommitSkillGates({
    fitnessGate: async () =>
      runProcess({
        command: 'pnpm',
        args: ['practice:fitness:strict-hard'],
        cwd: repoRoot,
      }),
    vocabularyGate: async () =>
      runProcess({
        command: 'pnpm',
        args: ['practice:vocabulary'],
        cwd: repoRoot,
      }),
    messageCheck: async () =>
      runProcess({
        command: messageCheckScript,
        args: [...forwardedArgs],
        cwd: repoRoot,
      }),
  });

  if (result.ok) {
    return 0;
  }

  process.stderr.write(`${describeFailure(result)}\n`);
  return result.exitCode;
}

const currentFilePath = fileURLToPath(import.meta.url);

if (process.argv[1] === currentFilePath) {
  const exitCode = await main(process.argv.slice(2));
  process.exit(exitCode);
}
