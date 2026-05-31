import { performance } from 'node:perf_hooks';

import { writeLine, writeErrorLine } from '../core/terminal-output.js';

import {
  runCapturedProcess,
  runInheritedProcess,
  writeProfileArtifact,
  buildCheckProfileArtifact,
  collectProfileEnvironmentEvidence,
} from './repo-check-profile.js';

const CHECK_TURBO_TASKS = [
  'sdk-codegen',
  'build',
  'type-check',
  'doc-gen',
  'lint',
  'test',
  'test:widget',
  'test:e2e',
  'test:ui',
  'test:a11y',
  'test:widget:ui',
  'test:widget:a11y',
] as const;

function timestampSlug(): string {
  return new Date().toISOString().replaceAll(/[:.]/g, '-');
}

function turboDryRun(): { readonly exitCode: number; readonly artifactPath: string } {
  const result = runCapturedProcess('pnpm', [
    'exec',
    'turbo',
    'run',
    '--continue',
    ...CHECK_TURBO_TASKS,
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

function runCapturedCheck(): CapturedRunResult {
  const result = runCapturedProcess('pnpm', ['check']);
  const output = `${result.stdout}${result.stderr}`;
  const outputLog = writeProfileArtifact(`check-output-${timestampSlug()}.log`, output);
  process.stdout.write(result.stdout);
  process.stderr.write(result.stderr);
  return { exitCode: result.status ?? 1, output, outputLog };
}

async function writeAndLogProfile(input: {
  readonly dryRunArtifactPath: string;
  readonly startedAt: string;
  readonly durationMs: number;
  readonly exitCode: number;
  readonly output?: string;
  readonly outputLog?: string;
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
  });
  const artifactPath = writeProfileArtifact(
    `check-profile-${timestampSlug()}.json`,
    `${JSON.stringify(profile, null, 2)}\n`,
  );
  writeLine(`repo-check profile: wrote check timing profile to ${artifactPath}`);
}

export async function runProfile(args: readonly string[]): Promise<number> {
  const dryRunOnly = args.includes('--dry-run');
  const captureOutput = args.includes('--capture-output');
  const dryRun = turboDryRun();

  if (dryRun.exitCode !== 0) {
    writeErrorLine(`repo-check profile: Turbo dry graph failed; artifact: ${dryRun.artifactPath}`);
    return dryRun.exitCode;
  }

  if (dryRunOnly) {
    writeLine(`repo-check profile: wrote Turbo dry graph to ${dryRun.artifactPath}`);
    return 0;
  }

  const startedAt = new Date().toISOString();
  const startTime = performance.now();
  const captured = captureOutput ? runCapturedCheck() : null;
  const exitCode =
    captured !== null ? captured.exitCode : await runInheritedProcess('pnpm', ['check']);

  await writeAndLogProfile({
    dryRunArtifactPath: dryRun.artifactPath,
    startedAt,
    durationMs: Math.round(performance.now() - startTime),
    exitCode,
    output: captured?.output,
    outputLog: captured?.outputLog,
  });

  return exitCode;
}
