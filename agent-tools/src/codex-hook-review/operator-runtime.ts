import { homedir } from 'node:os';

import { err, ok, type Result } from '@oaknational/result';

import { type LocalActivationManifest } from './activation.js';
import { type LiveBenchmarkContext } from './benchmark-live.js';
import { resolveFingerprintExecutables } from './fingerprint.js';
import { verifyAdapterDeployment, verifyRuntimeExecutablePins } from './runtime-integrity.js';
import { createPostToolBatchFingerprint, type OwnedPostToolBatchFingerprint } from './settings.js';

const CODEX_HOOK_TIMEOUT_SECONDS = 6;

interface OperatorContextInput {
  readonly projectRoot: string;
  readonly environment: Readonly<NodeJS.ProcessEnv>;
}

export interface OperatorOwnedError {
  readonly kind:
    | 'operator-context-failed'
    | 'manifest-invalid'
    | 'benchmark-report-drift'
    | 'runtime-drift'
    | 'authentication-missing'
    | 'fingerprint-failed'
    | 'fingerprint-drift'
    | 'settings-invalid'
    | 'settings-shape-invalid'
    | 'settings-write-failed'
    | 'manifest-write-failed'
    | 'enable-rollback-failed';
  readonly message: string;
}

export interface OperatorRuntimeError {
  readonly kind:
    | 'executable-resolution-failed'
    | 'invalid-hook-fingerprint'
    | 'runtime-integrity-check-failed'
    | 'runtime-drift';
}

export async function createOperatorContext(
  input: OperatorContextInput,
  manifest?: LocalActivationManifest,
): Promise<Result<LiveBenchmarkContext, OperatorRuntimeError>> {
  if (manifest !== undefined) {
    return ok({
      projectRoot: input.projectRoot,
      userHome: homedir(),
      sourceEnvironment: input.environment,
      executables: {
        node: manifest.executables.node.path,
        claude: manifest.executables.claude.path,
        codex: manifest.executables.codex.path,
        gitleaks: manifest.executables.gitleaks.path,
      },
    });
  }
  const resolved = await resolveFingerprintExecutables(input.environment);
  if (!resolved.ok) {
    return err({ kind: 'executable-resolution-failed' });
  }
  return ok({
    projectRoot: input.projectRoot,
    userHome: homedir(),
    sourceEnvironment: input.environment,
    executables: resolved.value,
  });
}

export function requiredHookFingerprint(
  manifest: Pick<LocalActivationManifest, 'deployment' | 'executables'>,
): Result<OwnedPostToolBatchFingerprint, OperatorRuntimeError> {
  const fingerprint = createPostToolBatchFingerprint(
    CODEX_HOOK_TIMEOUT_SECONDS,
    manifest.deployment.entryPath,
    manifest.executables.node.path,
  );
  if (!fingerprint.ok) {
    return err({ kind: 'invalid-hook-fingerprint' });
  }
  return ok(fingerprint.value);
}

export async function assertRuntimeIntegrity(
  manifest: LocalActivationManifest,
): Promise<Result<void, OperatorRuntimeError>> {
  const current = await runtimeIntegrityCurrent(manifest);
  if (!current.ok) {
    return current;
  }
  return current.value ? ok(undefined) : err({ kind: 'runtime-drift' });
}

export async function runtimeIntegrityCurrent(
  manifest: LocalActivationManifest,
): Promise<Result<boolean, OperatorRuntimeError>> {
  const [deploymentCurrent, executablesCurrent] = await Promise.all([
    verifyAdapterDeployment(manifest.deployment),
    verifyRuntimeExecutablePins(manifest.executables),
  ]);
  if (!deploymentCurrent.ok || !executablesCurrent.ok) {
    return err({ kind: 'runtime-integrity-check-failed' });
  }
  return ok(deploymentCurrent.value && executablesCurrent.value);
}

export function operatorFailure(
  kind: OperatorOwnedError['kind'],
  message: string,
): Result<never, OperatorOwnedError> {
  return err({ kind, message });
}
