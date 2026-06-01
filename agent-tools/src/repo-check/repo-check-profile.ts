import { spawn, spawnSync, type SpawnSyncReturns } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { writeErrorLine } from '../core/terminal-output.js';

export type {
  RepoCheckCommandResult,
  RepoCheckRuntime,
  CheckProfileFailurePhase,
  PostTurboGateStatus,
  CheckProfileEnvironmentEvidence,
  CheckProfileArtifact,
} from './repo-check-types.js';

import type {
  RepoCheckRuntime,
  CheckProfileFailurePhase,
  PostTurboGateStatus,
  CheckProfileEnvironmentEvidence,
  CheckProfileArtifact,
} from './repo-check-types.js';

export function runInheritedProcess(command: string, args: readonly string[]): Promise<number> {
  return new Promise((resolve) => {
    const child = spawn(command, args, { stdio: 'inherit' });
    child.on('close', (code) => resolve(code ?? 1));
    child.on('error', (error) => {
      writeErrorLine(`${command}: ${error.message}`);
      resolve(1);
    });
  });
}

export function runCapturedProcess(
  command: string,
  args: readonly string[],
): SpawnSyncReturns<string> {
  return spawnSync(command, args, { encoding: 'utf8', maxBuffer: 1024 * 1024 * 50 });
}

export const defaultRuntime: RepoCheckRuntime = {
  runCaptured: runCapturedProcess,
  runInherited: runInheritedProcess,
};

function profileOutputDir(): string {
  const outputDir = path.resolve(process.cwd(), '.logs', 'check-profiles');
  mkdirSync(outputDir, { recursive: true });
  return outputDir;
}

export function writeProfileArtifact(name: string, content: string): string {
  const filePath = path.join(profileOutputDir(), name);
  writeFileSync(filePath, content);
  return path.relative(process.cwd(), filePath);
}

function resolvePlaywrightCachePath(): string {
  const configured = process.env.PLAYWRIGHT_BROWSERS_PATH?.trim();
  return configured !== undefined && configured.length > 0
    ? configured
    : path.join(os.homedir(), 'Library', 'Caches', 'ms-playwright');
}

export function collectProfileEnvironmentEvidence(
  runtime: RepoCheckRuntime = defaultRuntime,
): CheckProfileEnvironmentEvidence {
  const pnpmStore = runtime.runCaptured('pnpm', ['store', 'path']);
  const pnpmStorePath = (pnpmStore.status ?? 1) === 0 ? pnpmStore.stdout.trim() : null;
  const browserCachePath = resolvePlaywrightCachePath();
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

function isEnvironmentFailure(output: string): boolean {
  return (
    output.includes('MachPortRendezvous') ||
    output.includes('browserType.launch') ||
    output.includes('Playwright browsers')
  );
}

function isTurboTaskFailure(output: string): boolean {
  return /Failed:\s+@/u.test(output) || /Tasks:\s+\d+\s+successful,\s+\d+\s+total/u.test(output);
}

function isPostTurboGateFailure(output: string): boolean {
  return (
    output.includes('markdownlint-check:root') ||
    output.includes('format-check:root') ||
    output.includes('subagents:check') ||
    output.includes('portability:check') ||
    output.includes('skills:check') ||
    output.includes('pnpm knip') ||
    output.includes('pnpm depcruise')
  );
}

export function classifyCheckFailurePhase(input: {
  readonly exitCode: number;
  readonly output?: string;
}): CheckProfileFailurePhase {
  if (input.exitCode === 0) {
    return 'passed';
  }
  const output = input.output ?? '';
  if (isEnvironmentFailure(output)) {
    return 'environment';
  }
  if (isTurboTaskFailure(output)) {
    return 'turbo-task';
  }
  if (isPostTurboGateFailure(output)) {
    return 'post-turbo-gate';
  }
  return 'check-command';
}

function outputContainsPostTurboMarker(output: string): boolean {
  return (
    output.includes('markdownlint-check:root') ||
    output.includes('format-check:root') ||
    output.includes('subagents:check') ||
    output.includes('portability:check') ||
    output.includes('skills:check')
  );
}

export function profilePostTurboGateStatus(input: {
  readonly outputCaptured: boolean;
  readonly failurePhase: CheckProfileFailurePhase;
  readonly output?: string;
}): PostTurboGateStatus {
  if (!input.outputCaptured) {
    return 'not-captured';
  }
  if (input.output !== undefined && outputContainsPostTurboMarker(input.output)) {
    return 'ran';
  }
  if (input.failurePhase === 'turbo-task') {
    return 'skipped-after-turbo-failure';
  }
  return 'not-observed';
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
    ...(input.outputLog === undefined ? {} : { outputLog: input.outputLog }),
    failurePhase,
    postTurboGateStatus: profilePostTurboGateStatus({
      outputCaptured: input.output !== undefined,
      output: input.output,
      failurePhase,
    }),
  };
}
