import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { performance } from 'node:perf_hooks';

const CHECK_TURBO_TASKS = [
  'sdk-codegen',
  'build',
  'type-check',
  'doc-gen',
  'lint:fix',
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
    '  profile [--dry-run]    Capture the pnpm check Turbo graph and, unless dry-run is set, time pnpm check.',
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
  const exitCode = await runInherited('pnpm', ['check']);
  const durationMs = Math.round(performance.now() - startTime);
  const finishedAt = new Date().toISOString();

  const profile = {
    command: 'pnpm check',
    startedAt,
    finishedAt,
    durationMs,
    exitCode,
    turboDryGraph: dryRun.artifactPath,
  };
  const artifactPath = writeProfileArtifact(
    `check-profile-${timestampSlug()}.json`,
    `${JSON.stringify(profile, null, 2)}\n`,
  );
  console.log(`repo-check profile: wrote check timing profile to ${artifactPath}`);
  return exitCode;
}

function stagedMarkdownFiles(): readonly string[] {
  const result = runCaptured('git', ['diff', '--cached', '--name-only', '--diff-filter=ACMR']);

  if ((result.status ?? 1) !== 0) {
    throw new Error(result.stderr.trim() || 'git diff failed while discovering staged files');
  }

  return result.stdout
    .split(/\r?\n/u)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0 && entry.endsWith('.md'));
}

async function runMarkdownlintStaged(): Promise<number> {
  const files = stagedMarkdownFiles();

  if (files.length === 0) {
    console.log('repo-check markdownlint-staged: no staged Markdown files');
    return 0;
  }

  return runInherited('pnpm', ['exec', 'markdownlint', '--dot', ...files]);
}

async function main(): Promise<void> {
  const [command, ...args] = process.argv.slice(2);

  if (command === 'markdownlint-staged') {
    process.exit(await runMarkdownlintStaged());
  }

  if (command === 'profile') {
    process.exit(await runProfile(args));
  }

  console.error(usage());
  process.exit(1);
}

await main();
