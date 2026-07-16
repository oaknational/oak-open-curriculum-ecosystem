import { err, ok, type Result } from '@oaknational/result';

import {
  clearLocalActivationManifest,
  readLocalActivationManifest,
  setManifestEnabled,
} from './local-state.js';
import { type OperatorOwnedError } from './operator-runtime.js';
import { disablePostToolBatchHook, hasMarkerOwnedPostToolBatchHook } from './settings.js';
import { readClaudeLocalSettings, writeClaudeLocalSettings } from './settings-file.js';

export type ActivationManifestDisposition = 'clear' | 'disable';

/** Deactivate the manifest first, then remove every marker-owned Claude hook group. */
export async function deactivateHookReviewState(
  projectRoot: string,
  manifestDisposition: ActivationManifestDisposition,
): Promise<Result<void, OperatorOwnedError>> {
  const manifestDeactivated = await deactivateManifest(projectRoot, manifestDisposition);
  if (!manifestDeactivated.ok) {
    return manifestDeactivated;
  }
  return removeOwnedHookFromClaudeSettings(projectRoot);
}

/** Remove owned hook groups without creating or rewriting marker-free settings. */
export async function removeOwnedHookFromClaudeSettings(
  projectRoot: string,
): Promise<Result<void, OperatorOwnedError>> {
  const settings = await readClaudeLocalSettings(projectRoot);
  if (!settings.ok) {
    return failure('settings-invalid', 'Claude local settings are invalid or unreadable');
  }
  const ownedHookPresent = hasMarkerOwnedPostToolBatchHook(settings.value);
  if (!ownedHookPresent.ok) {
    return invalidSettingsShape();
  }
  if (!ownedHookPresent.value) {
    return ok(undefined);
  }
  const updated = disablePostToolBatchHook(settings.value);
  if (!updated.ok) {
    return invalidSettingsShape();
  }
  const written = await writeClaudeLocalSettings(projectRoot, updated.value);
  return written.ok
    ? ok(undefined)
    : failure('settings-write-failed', 'Unable to write Claude local settings');
}

function invalidSettingsShape(): Result<never, OperatorOwnedError> {
  return failure('settings-shape-invalid', 'Claude local hook settings have an incompatible shape');
}

async function deactivateManifest(
  projectRoot: string,
  disposition: ActivationManifestDisposition,
): Promise<Result<void, OperatorOwnedError>> {
  if (disposition === 'clear') {
    const cleared = await clearLocalActivationManifest(projectRoot);
    return cleared.ok
      ? ok(undefined)
      : failure('manifest-write-failed', 'Unable to clear the activation manifest');
  }
  const manifest = await readLocalActivationManifest(projectRoot);
  if (!manifest.ok) {
    return ok(undefined);
  }
  const disabled = await setManifestEnabled(projectRoot, manifest.value, false);
  return disabled.ok
    ? ok(undefined)
    : failure('manifest-write-failed', 'Unable to disable the activation manifest');
}

function failure(
  kind: OperatorOwnedError['kind'],
  message: string,
): Result<never, OperatorOwnedError> {
  return err({ kind, message });
}
