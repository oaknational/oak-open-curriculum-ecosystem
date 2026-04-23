import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveEnv } from '@oaknational/env-resolution';
import { z } from 'zod';
import {
  assertConfiguredSentryBuildOutput,
  createConfiguredSentryBuildGateEnv,
} from './sentry-configured-build-gate.js';

const packageRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const ConfiguredSentryBuildGateSchema = z.object({
  SENTRY_AUTH_TOKEN: z
    .string()
    .trim()
    .min(
      1,
      '[build:sentry:configured] SENTRY_AUTH_TOKEN is required to exercise the configured Sentry esbuild-plugin path.',
    ),
  VERCEL_ENV: z.string().optional(),
  VERCEL_GIT_COMMIT_REF: z.string().optional(),
  VERCEL_GIT_COMMIT_SHA: z.string().optional(),
});

function loadConfiguredSentryBuildGateProcessEnv(): NodeJS.ProcessEnv {
  const envResult = resolveEnv({
    schema: ConfiguredSentryBuildGateSchema,
    processEnv: process.env,
    startDir: packageRoot,
  });

  if (!envResult.ok) {
    throw new Error(envResult.error.message);
  }

  return createConfiguredSentryBuildGateEnv(envResult.value);
}

const env = loadConfiguredSentryBuildGateProcessEnv();
const result = spawnSync(process.execPath, ['--import', 'tsx', 'esbuild.config.ts'], {
  cwd: packageRoot,
  env,
  encoding: 'utf8',
});

if (result.stdout) {
  process.stdout.write(result.stdout);
}

if (result.stderr) {
  process.stderr.write(result.stderr);
}

if (result.error) {
  throw result.error;
}

if (result.status !== 0) {
  const signalSuffix = result.signal ? ` (signal: ${result.signal})` : '';
  throw new Error(
    `[build:sentry:configured] esbuild.config.ts exited with status ${String(result.status)}${signalSuffix}.`,
  );
}

const combinedOutput = [result.stdout, result.stderr].filter(Boolean).join('\n');
assertConfiguredSentryBuildOutput(combinedOutput);

process.stdout.write(
  '[build:sentry:configured] Verified configured Sentry esbuild-plugin path using representative preview-style Vercel env.\n',
);
