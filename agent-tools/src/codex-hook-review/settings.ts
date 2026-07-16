import { isAbsolute } from 'node:path';

import { err, ok, type Result } from '@oaknational/result';
import { z } from 'zod';

import { isJsonObject, type JsonObject } from '../core/json.js';

interface OwnedAsyncCommand extends JsonObject {
  readonly type: 'command';
  readonly command: string;
  readonly args: readonly string[];
  readonly timeout: number;
  readonly async: true;
}

export interface OwnedPostToolBatchFingerprint extends JsonObject {
  readonly hooks: readonly [OwnedAsyncCommand];
}

export interface SettingsMergeError {
  readonly kind:
    | 'invalid-owned-hook-timeout'
    | 'invalid-owned-hook-path'
    | 'invalid-hooks-setting'
    | 'invalid-post-tool-batch-setting';
}

export const CODEX_HOOK_MARKER = '--oak-codex-hook-review-v1';

const ownedCommandSchema = z
  .object({
    type: z.literal('command'),
    command: z.string(),
    args: z.array(z.string()),
    timeout: z.number(),
    async: z.literal(true),
  })
  .strict();

const ownedGroupSchema = z.object({ hooks: z.tuple([ownedCommandSchema]) }).strict();

/** Build the exact no-matcher fingerprint for the owned async PostToolBatch command. */
export function createPostToolBatchFingerprint(
  timeoutSeconds: number,
  adapterEntryPath: string,
  nodeExecutable: string,
): Result<OwnedPostToolBatchFingerprint, SettingsMergeError> {
  if (!Number.isInteger(timeoutSeconds) || timeoutSeconds <= 0) {
    return err({ kind: 'invalid-owned-hook-timeout' });
  }
  if (!isAbsolute(adapterEntryPath) || !isAbsolute(nodeExecutable)) {
    return err({ kind: 'invalid-owned-hook-path' });
  }
  return ok({
    hooks: [
      {
        type: 'command',
        command: nodeExecutable,
        args: [adapterEntryPath, CODEX_HOOK_MARKER],
        timeout: timeoutSeconds,
        async: true,
      },
    ],
  });
}

function isExactFingerprint(
  candidate: JsonObject,
  fingerprint: OwnedPostToolBatchFingerprint,
): boolean {
  const parsed = ownedGroupSchema.safeParse(candidate);
  if (!parsed.success) {
    return false;
  }
  const hook = parsed.data.hooks[0];
  const owned = fingerprint.hooks[0];
  const argsMatch =
    hook.args.length === owned.args.length &&
    hook.args.every((arg, index) => arg === owned.args[index]);
  return (
    hook.type === owned.type &&
    hook.command === owned.command &&
    argsMatch &&
    hook.timeout === owned.timeout &&
    hook.async === owned.async
  );
}

function isOwnedGroup(candidate: JsonObject): boolean {
  if (!Array.isArray(candidate.hooks)) {
    return false;
  }
  return candidate.hooks.some(
    (hook) =>
      isJsonObject(hook) &&
      Array.isArray(hook.args) &&
      hook.args.some((argument) => argument === CODEX_HOOK_MARKER),
  );
}

/** Detect any stable-marker-owned PostToolBatch group, including drifted prior versions. */
export function hasMarkerOwnedPostToolBatchHook(
  settings: JsonObject,
): Result<boolean, SettingsMergeError> {
  const hooks = readHooks(settings);
  if (!hooks.ok) {
    return hooks;
  }
  const postToolBatch = readPostToolBatch(hooks.value);
  return postToolBatch.ok
    ? ok(postToolBatch.value.some((group) => isOwnedGroup(group)))
    : postToolBatch;
}

/** Determine whether the exact owned hook is present without matching similar foreign hooks. */
export function hasPostToolBatchHook(
  settings: JsonObject,
  fingerprint: OwnedPostToolBatchFingerprint,
): Result<boolean, SettingsMergeError> {
  const hooks = readHooks(settings);
  if (!hooks.ok) {
    return hooks;
  }
  const postToolBatch = readPostToolBatch(hooks.value);
  if (!postToolBatch.ok) {
    return postToolBatch;
  }
  return ok(postToolBatch.value.some((group) => isExactFingerprint(group, fingerprint)));
}

function readHooks(settings: JsonObject): Result<JsonObject, SettingsMergeError> {
  if (settings.hooks === undefined) {
    return ok({});
  }
  return isJsonObject(settings.hooks) ? ok(settings.hooks) : err({ kind: 'invalid-hooks-setting' });
}

function readPostToolBatch(hooks: JsonObject): Result<readonly JsonObject[], SettingsMergeError> {
  if (hooks.PostToolBatch === undefined) {
    return ok([]);
  }
  if (!Array.isArray(hooks.PostToolBatch) || !hooks.PostToolBatch.every(isJsonObject)) {
    return err({ kind: 'invalid-post-tool-batch-setting' });
  }
  return ok(hooks.PostToolBatch);
}

/** Add the owned hook once while preserving every unrelated local setting and hook group. */
export function enablePostToolBatchHook(
  settings: JsonObject,
  fingerprint: OwnedPostToolBatchFingerprint,
): Result<JsonObject, SettingsMergeError> {
  const hooks = readHooks(settings);
  if (!hooks.ok) {
    return hooks;
  }
  const postToolBatch = readPostToolBatch(hooks.value);
  if (!postToolBatch.ok) {
    return postToolBatch;
  }
  const unrelated = postToolBatch.value.filter((group) => !isOwnedGroup(group));
  return ok({
    ...settings,
    hooks: { ...hooks.value, PostToolBatch: [...unrelated, fingerprint] },
  });
}

/** Remove every marker-owned version while leaving similar unmarked and foreign hooks untouched. */
export function disablePostToolBatchHook(
  settings: JsonObject,
): Result<JsonObject, SettingsMergeError> {
  const hooks = readHooks(settings);
  if (!hooks.ok) {
    return hooks;
  }
  const postToolBatch = readPostToolBatch(hooks.value);
  if (!postToolBatch.ok) {
    return postToolBatch;
  }
  const retained = postToolBatch.value.filter((group) => !isOwnedGroup(group));
  return ok({ ...settings, hooks: { ...hooks.value, PostToolBatch: retained } });
}
