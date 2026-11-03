import { readFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';

import { err, type Result } from '@oaknational/result';
import { z } from 'zod';

import { runFileBackedChild } from '../core/file-backed-child.js';
import { writeLine, writeErrorLine } from '../core/terminal-output.js';
import { resolvePnpm } from '../spawn/pnpm-path.js';

import {
  runCapturedProcess,
  runInheritedProcess,
  writeProfileArtifact,
  buildCheckProfileArtifact,
  collectProfileEnvironmentEvidence,
} from './repo-check-profile.js';
import { readCheckLegs, type CheckLeg } from './repo-check-check-legs.js';

/** The part of the root manifest the profile reads. */
const RootScriptsSchema = z.object({ scripts: z.record(z.string(), z.string()) });

/**
 * The root `check` legs, read from the manifest in the working directory,
 * which the `repo-check` script sets to the repository root.
 */
function readRootCheckLegs(): Result<readonly CheckLeg[], Error> {
  let manifest: unknown;
  try {
    manifest = JSON.parse(readFileSync('package.json', 'utf8'));
  } catch (error: unknown) {
    return err(
      new Error(
        `cannot read the root package.json: ${error instanceof Error ? error.message : String(error)}`,
      ),
    );
  }
  const parsed = RootScriptsSchema.safeParse(manifest);
  if (!parsed.success) {
    return err(new Error('the root package.json has no scripts object of strings'));
  }
  return readCheckLegs(parsed.data.scripts);
}

/** The distinct turbo tasks the check legs run, in chain order. */
function checkTurboTasks(legs: readonly CheckLeg[]): readonly string[] {
  return [...new Set(legs.flatMap((leg) => leg.turboTasks))];
}

function timestampSlug(): string {
  return new Date().toISOString().replaceAll(/[:.]/g, '-');
}

function turboDryRun(turboTasks: readonly string[]): {
  readonly exitCode: number;
  readonly artifactPath: string;
} {
  const result = runCapturedProcess('pnpm', [
    'exec',
    'turbo',
    'run',
    '--continue',
    ...turboTasks,
    '--dry=json',
  ]);
  const artifactPath = writeProfileArtifact(
    `check-turbo-graph-${timestampSlug()}.json`,
    result.stdout.length > 0 ? result.stdout : result.stderr,
  );
  return { exitCode: result.status ?? 1, artifactPath };
}

interface CapturedRunResult {
  readonly exitCode: number;
  readonly output: string;
  readonly outputLog: string;
}

/**
 * Run `pnpm check` with its output captured through files, not pipes. A
 * pipe-backed capture kills the chain: run through `spawnSync` pipes,
 * `pnpm check` died of SIGPIPE at the depcruise to secrets:scan handover
 * (the F-112 class `core/file-backed-child.ts` exists for). Both streams share
 * one capture file, so the transcript keeps the order a terminal would show;
 * it is replayed to stdout and kept for classification. A signal death is
 * named on stderr and reaches the artifact as the 128 exit sentinel.
 */
async function runCapturedCheck(): Promise<CapturedRunResult | Error> {
  const pnpm = resolvePnpm(process.env);
  if (!pnpm.ok) {
    return pnpm.error;
  }
  const transcript: Buffer[] = [];
  const result = await runFileBackedChild({
    command: pnpm.value.file,
    args: [...pnpm.value.leadingArgs, 'check'],
    cwd: process.cwd(),
    env: pnpm.value.env,
    combinedOutput: true,
    replaySinks: {
      stdout: {
        write: (content) => {
          transcript.push(content);
          return process.stdout.write(content);
        },
      },
      stderr: process.stderr,
    },
  });
  if (result.signal !== null) {
    writeErrorLine(`repo-check profile: pnpm check was killed by ${result.signal}`);
  }
  const output = Buffer.concat(transcript).toString('utf8');
  const outputLog = writeProfileArtifact(`check-output-${timestampSlug()}.log`, output);
  return { exitCode: result.exitCode, output, outputLog };
}

async function writeAndLogProfile(input: {
  readonly dryRunArtifactPath: string;
  readonly startedAt: string;
  readonly durationMs: number;
  readonly exitCode: number;
  readonly output?: string;
  readonly outputLog?: string;
  readonly legs: readonly CheckLeg[];
}): Promise<void> {
  const profile = buildCheckProfileArtifact({
    startedAt: input.startedAt,
    finishedAt: new Date().toISOString(),
    durationMs: input.durationMs,
    exitCode: input.exitCode,
    turboDryGraph: input.dryRunArtifactPath,
    environment: collectProfileEnvironmentEvidence(),
    outputLog: input.outputLog,
    output: input.output,
    legs: input.legs,
  });
  const artifactPath = writeProfileArtifact(
    `check-profile-${timestampSlug()}.json`,
    `${JSON.stringify(profile, null, 2)}\n`,
  );
  writeLine(`repo-check profile: wrote check timing profile to ${artifactPath}`);
}

export async function runProfile(args: readonly string[]): Promise<number> {
  const dryRunOnly = args.includes('--dry-run');
  const legs = readRootCheckLegs();
  if (!legs.ok) {
    writeErrorLine(`repo-check profile: ${legs.error.message}`);
    return 1;
  }
  const dryRun = turboDryRun(checkTurboTasks(legs.value));

  if (dryRun.exitCode !== 0) {
    writeErrorLine(`repo-check profile: Turbo dry graph failed; artifact: ${dryRun.artifactPath}`);
    return dryRun.exitCode;
  }

  if (dryRunOnly) {
    writeLine(`repo-check profile: wrote Turbo dry graph to ${dryRun.artifactPath}`);
    return 0;
  }

  return timeCheckRun({
    captureOutput: args.includes('--capture-output'),
    dryRunArtifactPath: dryRun.artifactPath,
    legs: legs.value,
  });
}

/** Run `pnpm check`, captured or inherited, and write its timing profile. */
async function timeCheckRun(input: {
  readonly captureOutput: boolean;
  readonly dryRunArtifactPath: string;
  readonly legs: readonly CheckLeg[];
}): Promise<number> {
  const startedAt = new Date().toISOString();
  const startTime = performance.now();
  const captured = input.captureOutput ? await runCapturedCheck() : null;
  if (captured instanceof Error) {
    writeErrorLine(`repo-check profile: ${captured.message}`);
    return 1;
  }
  const exitCode =
    captured === null ? await runInheritedProcess('pnpm', ['check']) : captured.exitCode;

  await writeAndLogProfile({
    dryRunArtifactPath: input.dryRunArtifactPath,
    startedAt,
    durationMs: Math.round(performance.now() - startTime),
    exitCode,
    output: captured?.output,
    outputLog: captured?.outputLog,
    legs: input.legs,
  });

  return exitCode;
}
