import { ok, type Result } from '@oaknational/result';

import { evaluateLocalActivation, type LocalActivationManifest } from './activation.js';
import {
  assertDedicatedCodexAuthentication,
  fingerprintTournamentCell,
  type LiveBenchmarkContext,
} from './benchmark-live.js';
import {
  readLocalActivationManifest,
  setManifestEnabled,
  verifyLocalBenchmarkReport,
  type LocalStateError,
} from './local-state.js';
import { removeOwnedHookFromClaudeSettings } from './operator-deactivation.js';
import {
  assertRuntimeIntegrity,
  createOperatorContext,
  operatorFailure,
  requiredHookFingerprint,
  type OperatorOwnedError,
} from './operator-runtime.js';
import { enablePostToolBatchHook } from './settings.js';
import { readClaudeLocalSettings, writeClaudeLocalSettings } from './settings-file.js';

interface OperatorContextInput {
  readonly projectRoot: string;
  readonly environment: Readonly<NodeJS.ProcessEnv>;
}

interface MutatingOperatorInput extends OperatorContextInput {
  readonly output: { readonly writeLine: (message: string) => void };
}

export interface PreparedEnableDependencies {
  readonly installOwnedHook: (
    projectRoot: string,
    manifest: LocalActivationManifest,
  ) => Promise<Result<void, OperatorOwnedError>>;
  readonly persistEnabledManifest: (
    projectRoot: string,
    manifest: LocalActivationManifest,
  ) => Promise<Result<LocalActivationManifest, LocalStateError>>;
  readonly rollbackOwnedHook: (projectRoot: string) => Promise<Result<void, OperatorOwnedError>>;
}

const PREPARED_ENABLE_DEFAULTS: PreparedEnableDependencies = {
  installOwnedHook,
  persistEnabledManifest: (projectRoot, manifest) =>
    setManifestEnabled(projectRoot, manifest, true),
  rollbackOwnedHook: removeOwnedHookFromClaudeSettings,
};

/** Enable only a still-qualified runtime, then mark its manifest enabled. */
export async function enableHookReviewOperator(
  input: MutatingOperatorInput,
): Promise<Result<number, OperatorOwnedError>> {
  const manifest = await loadVerifiedManifest(input.projectRoot);
  if (!manifest.ok) {
    return manifest;
  }
  const preflight = await preflightEnable(input, manifest.value);
  if (!preflight.ok) {
    return preflight;
  }
  const enabled = await completePreparedEnable(input.projectRoot, manifest.value);
  if (!enabled.ok) {
    return enabled;
  }
  input.output.writeLine(`Enabled local PostToolBatch review: ${manifest.value.selectedCellId}`);
  return ok(0);
}

/** Install the prepared hook and compensate if manifest enablement cannot be persisted. */
export async function completePreparedEnable(
  projectRoot: string,
  manifest: LocalActivationManifest,
  dependencyOverrides: Partial<PreparedEnableDependencies> = {},
): Promise<Result<void, OperatorOwnedError>> {
  const dependencies = { ...PREPARED_ENABLE_DEFAULTS, ...dependencyOverrides };
  const hookInstalled = await dependencies.installOwnedHook(projectRoot, manifest);
  if (!hookInstalled.ok) {
    return hookInstalled;
  }
  try {
    const manifestEnabled = await dependencies.persistEnabledManifest(projectRoot, manifest);
    return manifestEnabled.ok
      ? ok(undefined)
      : rollbackAfterManifestFailure(projectRoot, dependencies.rollbackOwnedHook);
  } catch {
    return rollbackAfterManifestFailure(projectRoot, dependencies.rollbackOwnedHook);
  }
}

async function rollbackAfterManifestFailure(
  projectRoot: string,
  rollbackOwnedHook: PreparedEnableDependencies['rollbackOwnedHook'],
): Promise<Result<never, OperatorOwnedError>> {
  try {
    const rolledBack = await rollbackOwnedHook(projectRoot);
    if (rolledBack.ok) {
      return operatorFailure(
        'manifest-write-failed',
        'Unable to enable the activation manifest; installed hook was removed',
      );
    }
  } catch {
    return rollbackFailure();
  }
  return rollbackFailure();
}

function rollbackFailure(): Result<never, OperatorOwnedError> {
  return operatorFailure(
    'enable-rollback-failed',
    'Unable to enable the activation manifest and unable to remove the installed hook',
  );
}

async function loadVerifiedManifest(
  projectRoot: string,
): Promise<Result<LocalActivationManifest, OperatorOwnedError>> {
  const manifest = await readLocalActivationManifest(projectRoot);
  if (!manifest.ok) {
    return operatorFailure('manifest-invalid', 'A valid qualifying benchmark manifest is required');
  }
  const report = await verifyLocalBenchmarkReport(projectRoot, manifest.value);
  return report.ok
    ? ok(manifest.value)
    : operatorFailure(
        'benchmark-report-drift',
        'The qualifying benchmark report is missing or has drifted',
      );
}

async function preflightEnable(
  input: OperatorContextInput,
  manifest: LocalActivationManifest,
): Promise<Result<void, OperatorOwnedError>> {
  const integrity = await assertRuntimeIntegrity(manifest);
  if (!integrity.ok) {
    return operatorFailure(
      'runtime-drift',
      'Pinned runtime executables or adapter deployment have drifted',
    );
  }
  const context = await createOperatorContext(input, manifest);
  if (!context.ok) {
    return operatorFailure(
      'operator-context-failed',
      'Unable to locate required review executables',
    );
  }
  const authentication = await assertDedicatedCodexAuthentication({
    userHome: context.value.userHome,
    sourceEnvironment: context.value.sourceEnvironment,
    codexExecutable: context.value.executables.codex,
  });
  if (!authentication.ok) {
    return operatorFailure(
      'authentication-missing',
      'Dedicated Codex hook authentication is not provisioned',
    );
  }
  return fingerprintStillCurrent(context.value, manifest);
}

async function fingerprintStillCurrent(
  context: LiveBenchmarkContext,
  manifest: LocalActivationManifest,
): Promise<Result<void, OperatorOwnedError>> {
  const fingerprint = await fingerprintTournamentCell(context, manifest.selectedCellId);
  if (!fingerprint.ok) {
    return operatorFailure(
      'fingerprint-failed',
      'Unable to fingerprint the qualified benchmark runtime',
    );
  }
  const decision = evaluateLocalActivation({ ...manifest, enabled: true }, fingerprint.value);
  return decision.enabled
    ? ok(undefined)
    : operatorFailure('fingerprint-drift', 'Benchmark fingerprint has drifted; rerun benchmark');
}

async function installOwnedHook(
  projectRoot: string,
  manifest: LocalActivationManifest,
): Promise<Result<void, OperatorOwnedError>> {
  const settings = await readClaudeLocalSettings(projectRoot);
  if (!settings.ok) {
    return operatorFailure('settings-invalid', 'Claude local settings are invalid or unreadable');
  }
  const fingerprint = requiredHookFingerprint(manifest);
  if (!fingerprint.ok) {
    return invalidSettingsShape();
  }
  const merged = enablePostToolBatchHook(settings.value, fingerprint.value);
  if (!merged.ok) {
    return invalidSettingsShape();
  }
  const written = await writeClaudeLocalSettings(projectRoot, merged.value);
  return written.ok
    ? ok(undefined)
    : operatorFailure('settings-write-failed', 'Unable to write Claude local settings');
}

function invalidSettingsShape(): Result<never, OperatorOwnedError> {
  return operatorFailure(
    'settings-shape-invalid',
    'Claude local hook settings have an incompatible shape',
  );
}
