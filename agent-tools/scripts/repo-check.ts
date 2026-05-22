import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { pathToFileURL } from 'node:url';

export interface RepoCheckCommandResult {
  readonly status: number | null;
  readonly stdout: string;
  readonly stderr: string;
}

export interface RepoCheckRuntime {
  runInherited(command: string, args: readonly string[]): Promise<number>;
  runCaptured(command: string, args: readonly string[]): RepoCheckCommandResult;
}

export type CheckProfileFailurePhase =
  | 'passed'
  | 'environment'
  | 'turbo-task'
  | 'post-turbo-gate'
  | 'check-command';

export type PostTurboGateStatus =
  | 'not-captured'
  | 'ran'
  | 'skipped-after-turbo-failure'
  | 'not-observed';

export interface CheckProfileEnvironmentEvidence {
  readonly nodeVersion: string;
  readonly platform: NodeJS.Platform;
  readonly arch: string;
  readonly pnpmStorePath: string | null;
  readonly playwrightBrowserCachePath: string;
  readonly playwrightBrowserCacheExists: boolean;
  readonly sandboxNote: string;
}

export interface CheckProfileArtifact {
  readonly command: 'pnpm check';
  readonly startedAt: string;
  readonly finishedAt: string;
  readonly durationMs: number;
  readonly exitCode: number;
  readonly turboDryGraph: string;
  readonly environment: CheckProfileEnvironmentEvidence;
  readonly outputLog?: string;
  readonly failurePhase: CheckProfileFailurePhase;
  readonly postTurboGateStatus: PostTurboGateStatus;
}

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

function usage(): string {
  return [
    'Usage: pnpm agent-tools:repo-check <command>',
    '',
    'Commands:',
    '  markdownlint-staged    Run markdownlint on staged Markdown files only.',
    '  prettier-staged        Run Prettier on staged files only.',
    '  profile [--dry-run] [--capture-output]',
    '                         Capture the pnpm check Turbo graph and, unless dry-run is set, time pnpm check.',
    '                         --capture-output stores pnpm check stdout/stderr beside the profile artifact.',
  ].join('\n');
}

function runInherited(command: string, args: readonly string[]): Promise<number> {
  return new Promise((resolve) => {
    const child = spawn(command, args, { stdio: 'inherit' });
    child.on('close', (code) => resolve(code ?? 1));
    child.on('error', (error) => {
      console.error(`${command}: ${error.message}`);
      resolve(1);
    });
  });
}

function runCaptured(command: string, args: readonly string[]) {
  return spawnSync(command, args, {
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 50,
  });
}

const defaultRuntime: RepoCheckRuntime = {
  runCaptured,
  runInherited,
};

function timestampSlug(): string {
  return new Date().toISOString().replaceAll(/[:.]/g, '-');
}

function profileOutputDir(): string {
  const outputDir = path.resolve(process.cwd(), '.logs', 'check-profiles');
  mkdirSync(outputDir, { recursive: true });
  return outputDir;
}

function writeProfileArtifact(name: string, content: string): string {
  const filePath = path.join(profileOutputDir(), name);
  writeFileSync(filePath, content);
  return path.relative(process.cwd(), filePath);
}

function playwrightBrowserCachePath(): string {
  const configuredPath = process.env.PLAYWRIGHT_BROWSERS_PATH?.trim();

  if (configuredPath !== undefined && configuredPath.length > 0) {
    return configuredPath;
  }

  return path.join(os.homedir(), 'Library', 'Caches', 'ms-playwright');
}

export function collectProfileEnvironmentEvidence(
  runtime: RepoCheckRuntime = defaultRuntime,
): CheckProfileEnvironmentEvidence {
  const pnpmStore = runtime.runCaptured('pnpm', ['store', 'path']);
  const pnpmStorePath = (pnpmStore.status ?? 1) === 0 ? pnpmStore.stdout.trim() : null;
  const browserCachePath = playwrightBrowserCachePath();

  return {
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    pnpmStorePath,
    playwrightBrowserCachePath: browserCachePath,
    playwrightBrowserCacheExists: existsSync(browserCachePath),
    sandboxNote:
      'Playwright/Chromium can fail under restricted macOS sandboxes with Mach-port permission errors; rerun outside the sandbox before classifying as product failure.',
  };
}

export function classifyCheckFailurePhase(input: {
  readonly exitCode: number;
  readonly output?: string;
}): CheckProfileFailurePhase {
  if (input.exitCode === 0) {
    return 'passed';
  }

  const output = input.output ?? '';

  if (
    output.includes('MachPortRendezvous') ||
    output.includes('browserType.launch') ||
    output.includes('Playwright browsers')
  ) {
    return 'environment';
  }

  if (/Failed:\s+@/u.test(output) || /Tasks:\s+\d+\s+successful,\s+\d+\s+total/u.test(output)) {
    return 'turbo-task';
  }

  if (
    output.includes('markdownlint-check:root') ||
    output.includes('format-check:root') ||
    output.includes('subagents:check') ||
    output.includes('portability:check') ||
    output.includes('skills:check') ||
    output.includes('pnpm knip') ||
    output.includes('pnpm depcruise')
  ) {
    return 'post-turbo-gate';
  }

  return 'check-command';
}

export function profilePostTurboGateStatus(input: {
  readonly outputCaptured: boolean;
  readonly failurePhase: CheckProfileFailurePhase;
  readonly output?: string;
}): PostTurboGateStatus {
  if (input.outputCaptured) {
    if (
      input.output?.includes('markdownlint-check:root') === true ||
      input.output?.includes('format-check:root') === true ||
      input.output?.includes('subagents:check') === true ||
      input.output?.includes('portability:check') === true ||
      input.output?.includes('skills:check') === true
    ) {
      return 'ran';
    }

    if (input.failurePhase === 'turbo-task') {
      return 'skipped-after-turbo-failure';
    }

    return 'not-observed';
  }

  return 'not-captured';
}

export function buildCheckProfileArtifact(input: {
  readonly startedAt: string;
  readonly finishedAt: string;
  readonly durationMs: number;
  readonly exitCode: number;
  readonly turboDryGraph: string;
  readonly environment: CheckProfileEnvironmentEvidence;
  readonly outputLog?: string;
  readonly output?: string;
}): CheckProfileArtifact {
  const failurePhase = classifyCheckFailurePhase({
    exitCode: input.exitCode,
    output: input.output,
  });

  return {
    command: 'pnpm check',
    startedAt: input.startedAt,
    finishedAt: input.finishedAt,
    durationMs: input.durationMs,
    exitCode: input.exitCode,
    turboDryGraph: input.turboDryGraph,
    environment: input.environment,
    ...(input.outputLog !== undefined ? { outputLog: input.outputLog } : {}),
    failurePhase,
    postTurboGateStatus: profilePostTurboGateStatus({
      outputCaptured: input.output !== undefined,
      output: input.output,
      failurePhase,
    }),
  };
}

function turboDryRun(): { readonly exitCode: number; readonly artifactPath: string } {
  const result = runCaptured('pnpm', [
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

async function runProfile(args: readonly string[]): Promise<number> {
  const dryRunOnly = args.includes('--dry-run');
  const captureOutput = args.includes('--capture-output');
  const dryRun = turboDryRun();

  if (dryRun.exitCode !== 0) {
    console.error(`repo-check profile: Turbo dry graph failed; artifact: ${dryRun.artifactPath}`);
    return dryRun.exitCode;
  }

  if (dryRunOnly) {
    console.log(`repo-check profile: wrote Turbo dry graph to ${dryRun.artifactPath}`);
    return 0;
  }

  const startedAt = new Date().toISOString();
  const startTime = performance.now();
  let exitCode: number;
  let output: string | undefined;
  let outputLog: string | undefined;

  if (captureOutput) {
    const result = runCaptured('pnpm', ['check']);
    exitCode = result.status ?? 1;
    output = `${result.stdout}${result.stderr}`;
    outputLog = writeProfileArtifact(`check-output-${timestampSlug()}.log`, output);
    process.stdout.write(result.stdout);
    process.stderr.write(result.stderr);
  } else {
    exitCode = await runInherited('pnpm', ['check']);
  }

  const durationMs = Math.round(performance.now() - startTime);
  const finishedAt = new Date().toISOString();

  const profile = buildCheckProfileArtifact({
    startedAt,
    finishedAt,
    durationMs,
    exitCode,
    turboDryGraph: dryRun.artifactPath,
    environment: collectProfileEnvironmentEvidence(),
    outputLog,
    output,
  });

  const artifactPath = writeProfileArtifact(
    `check-profile-${timestampSlug()}.json`,
    `${JSON.stringify(profile, null, 2)}\n`,
  );
  console.log(`repo-check profile: wrote check timing profile to ${artifactPath}`);
  return exitCode;
}

function stagedFiles(runtime: RepoCheckRuntime): readonly string[] {
  const result = runtime.runCaptured('git', [
    'diff',
    '--cached',
    '--name-only',
    '--diff-filter=ACMR',
  ]);

  if ((result.status ?? 1) !== 0) {
    throw new Error(result.stderr.trim() || 'git diff failed while discovering staged files');
  }

  return result.stdout
    .split(/\r?\n/u)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

function stagedMarkdownFiles(runtime: RepoCheckRuntime): readonly string[] {
  return stagedFiles(runtime).filter((entry) => entry.endsWith('.md'));
}

export async function runMarkdownlintStaged(
  runtime: RepoCheckRuntime = defaultRuntime,
): Promise<number> {
  const files = stagedMarkdownFiles(runtime);

  if (files.length === 0) {
    console.log('repo-check markdownlint-staged: no staged Markdown files');
    return 0;
  }

  return runtime.runInherited('pnpm', ['exec', 'markdownlint', '--dot', ...files]);
}

export async function runPrettierStaged(
  runtime: RepoCheckRuntime = defaultRuntime,
): Promise<number> {
  const files = stagedFiles(runtime);

  if (files.length === 0) {
    console.log('repo-check prettier-staged: no staged files');
    return 0;
  }

  return runtime.runInherited('pnpm', [
    'exec',
    'prettier',
    '--check',
    '--ignore-unknown',
    ...files,
  ]);
}

async function main(): Promise<void> {
  const [command, ...args] = process.argv.slice(2);

  if (command === 'markdownlint-staged') {
    process.exit(await runMarkdownlintStaged());
  }

  if (command === 'prettier-staged') {
    process.exit(await runPrettierStaged());
  }

  if (command === 'profile') {
    process.exit(await runProfile(args));
  }

  console.error(usage());
  process.exit(1);
}

function isCliEntryPoint(): boolean {
  const entryPoint = process.argv[1];

  if (entryPoint === undefined) {
    return false;
  }

  return import.meta.url === pathToFileURL(path.resolve(entryPoint)).href;
}

if (isCliEntryPoint()) {
  await main();
}
