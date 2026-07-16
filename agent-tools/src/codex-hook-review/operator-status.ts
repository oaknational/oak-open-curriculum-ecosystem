import { ok, type Result } from '@oaknational/result';

import {
  compareRuntimeFingerprint,
  evaluateLocalActivation,
  type LocalActivationManifest,
} from './activation.js';
import {
  assertDedicatedCodexAuthentication,
  fingerprintTournamentCell,
  type LiveBenchmarkContext,
} from './benchmark-live.js';
import { readLocalActivationManifest, verifyLocalBenchmarkReport } from './local-state.js';
import {
  createOperatorContext,
  operatorFailure,
  requiredHookFingerprint,
  runtimeIntegrityCurrent,
  type OperatorOwnedError,
} from './operator-runtime.js';
import { hasPostToolBatchHook } from './settings.js';
import { readClaudeLocalSettings } from './settings-file.js';

export interface StatusCommandInput {
  readonly projectRoot: string;
  readonly environment: Readonly<NodeJS.ProcessEnv>;
  readonly output: { readonly writeLine: (message: string) => void };
}

export interface StatusCommandDependencies {
  readonly readManifest: (projectRoot: string) => ReturnType<typeof readLocalActivationManifest>;
  readonly readHookPresence: (
    projectRoot: string,
    manifest: LocalActivationManifest,
  ) => Promise<Result<boolean, OperatorOwnedError>>;
  readonly verifyReport: (
    projectRoot: string,
    manifest: LocalActivationManifest,
  ) => ReturnType<typeof verifyLocalBenchmarkReport>;
  readonly runtimeCurrent: typeof runtimeIntegrityCurrent;
  readonly createContext: typeof createOperatorContext;
  readonly authenticationAvailable: (context: LiveBenchmarkContext) => Promise<boolean>;
  readonly fingerprintCell: typeof fingerprintTournamentCell;
}

const STATUS_COMMAND_DEFAULTS: StatusCommandDependencies = {
  readManifest: readLocalActivationManifest,
  readHookPresence,
  verifyReport: verifyLocalBenchmarkReport,
  runtimeCurrent: runtimeIntegrityCurrent,
  createContext: createOperatorContext,
  authenticationAvailable,
  fingerprintCell: fingerprintTournamentCell,
};

/** Report deployed activation separately from current workspace benchmark-input drift. */
export async function statusHookReviewOperator(
  input: StatusCommandInput,
  dependencies: StatusCommandDependencies = STATUS_COMMAND_DEFAULTS,
): Promise<Result<number, OperatorOwnedError>> {
  const manifest = await dependencies.readManifest(input.projectRoot);
  if (!manifest.ok) {
    return writeStatus(input, `disabled; manifest=${manifest.error.kind}; hook=unknown`);
  }
  const hookPresent = await dependencies.readHookPresence(input.projectRoot, manifest.value);
  if (!hookPresent.ok) {
    return hookPresent;
  }
  return statusWithManifest(input, manifest.value, hookPresent.value, dependencies);
}

async function statusWithManifest(
  input: StatusCommandInput,
  manifest: LocalActivationManifest,
  hookPresent: boolean,
  dependencies: StatusCommandDependencies,
): Promise<Result<number, OperatorOwnedError>> {
  const report = await dependencies.verifyReport(input.projectRoot, manifest);
  if (!report.ok) {
    return writeStatus(
      input,
      `disabled: benchmark-report-${report.error.kind}; hook=${presence(hookPresent)}`,
    );
  }
  const integrity = await dependencies.runtimeCurrent(manifest);
  if (!integrity.ok || !integrity.value) {
    return writeStatus(input, `disabled: runtime-drift; hook=${presence(hookPresent)}`);
  }
  return statusCurrentDeployment(input, manifest, hookPresent, dependencies);
}

async function statusCurrentDeployment(
  input: StatusCommandInput,
  manifest: LocalActivationManifest,
  hookPresent: boolean,
  dependencies: StatusCommandDependencies,
): Promise<Result<number, OperatorOwnedError>> {
  const deployedDecision = evaluateLocalActivation(manifest, manifest.fingerprint);
  if (!deployedDecision.enabled) {
    return writeStatus(
      input,
      `disabled: ${deployedDecision.reason}; hook=${presence(hookPresent)}`,
    );
  }
  if (!hookPresent) {
    return writeStatus(input, 'disabled: hook-missing; hook=absent');
  }
  const context = await dependencies.createContext(input, manifest);
  if (!context.ok) {
    return operatorFailure(
      'operator-context-failed',
      'Unable to locate required review executables',
    );
  }
  if (!(await dependencies.authenticationAvailable(context.value))) {
    return writeStatus(input, 'disabled: authentication-missing; hook=present');
  }
  return statusWorkspaceFingerprint(input, context.value, manifest, dependencies);
}

async function statusWorkspaceFingerprint(
  input: StatusCommandInput,
  context: LiveBenchmarkContext,
  manifest: LocalActivationManifest,
  dependencies: StatusCommandDependencies,
): Promise<Result<number, OperatorOwnedError>> {
  const fingerprint = await dependencies.fingerprintCell(context, manifest.selectedCellId);
  if (!fingerprint.ok) {
    return writeEnabledStatus(input, manifest, 'fingerprint-unavailable');
  }
  const workspace =
    compareRuntimeFingerprint(manifest.fingerprint, fingerprint.value).length === 0
      ? 'current'
      : 'fingerprint-drift';
  return writeEnabledStatus(input, manifest, workspace);
}

async function readHookPresence(
  projectRoot: string,
  manifest: LocalActivationManifest,
): Promise<Result<boolean, OperatorOwnedError>> {
  const settings = await readClaudeLocalSettings(projectRoot);
  if (!settings.ok) {
    return operatorFailure('settings-invalid', 'Claude local settings are invalid or unreadable');
  }
  const fingerprint = requiredHookFingerprint(manifest);
  if (!fingerprint.ok) {
    return invalidSettingsShape();
  }
  const hookPresent = hasPostToolBatchHook(settings.value, fingerprint.value);
  return hookPresent.ok ? ok(hookPresent.value) : invalidSettingsShape();
}

function invalidSettingsShape(): Result<never, OperatorOwnedError> {
  return operatorFailure(
    'settings-shape-invalid',
    'Claude local hook settings have an incompatible shape',
  );
}

async function authenticationAvailable(context: LiveBenchmarkContext): Promise<boolean> {
  return (
    await assertDedicatedCodexAuthentication({
      userHome: context.userHome,
      sourceEnvironment: context.sourceEnvironment,
      codexExecutable: context.executables.codex,
    })
  ).ok;
}

function writeEnabledStatus(
  input: StatusCommandInput,
  manifest: LocalActivationManifest,
  workspace: 'current' | 'fingerprint-drift' | 'fingerprint-unavailable',
): Result<number, OperatorOwnedError> {
  return writeStatus(
    input,
    `enabled on qualified deployment: ${manifest.selectedCellId}; hook=present; workspace=${workspace}`,
  );
}

function writeStatus(
  input: StatusCommandInput,
  message: string,
): Result<number, OperatorOwnedError> {
  input.output.writeLine(message);
  return ok(0);
}

function presence(value: boolean): 'present' | 'absent' {
  return value ? 'present' : 'absent';
}
