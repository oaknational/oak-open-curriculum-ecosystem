import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

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

export { defaultRuntime, runCapturedProcess, runInheritedProcess } from './repo-check-runtime.js';

import { lastStartedLeg, startedLegs, type CheckLeg } from './repo-check-check-legs.js';
import { defaultRuntime } from './repo-check-runtime.js';

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

/** Whether a leg runs after the chain's last turbo leg; false when no leg runs turbo. */
function isAfterLastTurboLeg(leg: CheckLeg, legs: readonly CheckLeg[]): boolean {
  const lastTurboIndex = legs.findLastIndex((candidate) => candidate.turboTasks.length > 0);
  return lastTurboIndex >= 0 && legs.indexOf(leg) > lastTurboIndex;
}

/**
 * Classify a `pnpm check` run by the leg it stopped in: the last leg whose
 * own start line the output carries (`repo-check-check-legs.ts` says why a
 * substring of a leg name cannot discriminate).
 */
export function classifyCheckFailurePhase(input: {
  readonly exitCode: number;
  readonly output?: string;
  readonly legs: readonly CheckLeg[];
}): CheckProfileFailurePhase {
  if (input.exitCode === 0) {
    return 'passed';
  }
  const output = input.output ?? '';
  if (isEnvironmentFailure(output)) {
    return 'environment';
  }
  const failedLeg = lastStartedLeg(output, input.legs);
  if (failedLeg === undefined) {
    return 'check-command';
  }
  if (failedLeg.turboTasks.length > 0) {
    return 'turbo-task';
  }
  return isAfterLastTurboLeg(failedLeg, input.legs) ? 'post-turbo-gate' : 'check-command';
}

/** Whether the post-turbo legs ran, read from their own start lines. */
export function profilePostTurboGateStatus(input: {
  readonly outputCaptured: boolean;
  readonly failurePhase: CheckProfileFailurePhase;
  readonly output?: string;
  readonly legs: readonly CheckLeg[];
}): PostTurboGateStatus {
  if (!input.outputCaptured) {
    return 'not-captured';
  }
  const postTurboLegStarted =
    input.output !== undefined &&
    startedLegs(input.output, input.legs).some((leg) => isAfterLastTurboLeg(leg, input.legs));
  if (postTurboLegStarted) {
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
  readonly legs: readonly CheckLeg[];
}): CheckProfileArtifact {
  const failurePhase = classifyCheckFailurePhase({
    exitCode: input.exitCode,
    output: input.output,
    legs: input.legs,
  });
  const failedLeg =
    input.exitCode === 0 || input.output === undefined
      ? undefined
      : lastStartedLeg(input.output, input.legs);
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
    ...(failedLeg === undefined ? {} : { failedLeg: failedLeg.name }),
    postTurboGateStatus: profilePostTurboGateStatus({
      outputCaptured: input.output !== undefined,
      output: input.output,
      failurePhase,
      legs: input.legs,
    }),
  };
}
