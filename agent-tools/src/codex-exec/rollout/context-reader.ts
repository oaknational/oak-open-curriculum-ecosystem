import { err, ok, type Result } from '@oaknational/result';
import { isDeepStrictEqual } from 'node:util';

import {
  parseThreadSettings,
  parseTurnContext,
  type JsonRecord,
  type RecordedTurnContext,
} from './record-shapes.js';
import type { ReaderState } from './reader-state.js';
import { invalidRecord, invalidTurnOrder, type RolloutReadError } from './rollout-types.js';

function settingsMatchContext(state: ReaderState, context: RecordedTurnContext): boolean {
  const comparable = {
    cwd: context.cwd,
    model: context.model,
    effort: context.effort,
    approvalsReviewer: context.approvalsReviewer,
    approvalPolicy: context.approvalPolicy,
    permissionProfile: context.permissionProfile,
    workspaceRoots: context.workspaceRoots,
  };
  return state.resumedSettings.every((settings) => isDeepStrictEqual(settings, comparable));
}

function validateResumedSettings(
  state: ReaderState,
  context: RecordedTurnContext,
  line: number,
): Result<void, RolloutReadError> {
  if (state.turns.length !== 2) {
    return ok(undefined);
  }
  if (state.resumedSettings.length === 0) {
    return invalidTurnOrder(line, 'resumed turn_context lacks applied thread settings');
  }
  if (!settingsMatchContext(state, context)) {
    return err({ kind: 'applied-settings-mismatch', line });
  }
  return ok(undefined);
}

/** Attach one recorded turn context and compare resumed settings before output is accepted. */
export function readContext(
  payload: JsonRecord,
  state: ReaderState,
  line: number,
): Result<void, RolloutReadError> {
  const context = parseTurnContext(payload);
  if (context === undefined) {
    return invalidRecord(line, 'turn_context has an unknown or missing required field');
  }
  const active = state.active;
  if (active === undefined || active.complete || active.context !== undefined) {
    return invalidTurnOrder(line, 'turn_context has no active turn or is duplicated');
  }
  if (context.turnId !== active.turnId) {
    return invalidTurnOrder(line, 'turn_context turn id differs from task_started');
  }
  const settingsValidation = validateResumedSettings(state, context, line);
  if (!settingsValidation.ok) {
    return settingsValidation;
  }
  active.context = context;
  return ok(undefined);
}

/** Record settings applied between turns, bound to the session thread. */
export function readThreadSettings(
  payload: JsonRecord,
  state: ReaderState,
  line: number,
): Result<void, RolloutReadError> {
  if (typeof payload['thread_id'] !== 'string' || payload['thread_id'] !== state.threadId) {
    return err({ kind: 'settings-thread-id-mismatch', line });
  }
  if (state.turns.length !== 1 || !state.active?.complete) {
    return invalidTurnOrder(line, 'thread settings were not applied between turns');
  }
  const settings = parseThreadSettings(payload['thread_settings']);
  if (settings === undefined) {
    return invalidRecord(line, 'thread_settings_applied has unknown required settings');
  }
  state.resumedSettings.push(settings);
  return ok(undefined);
}
