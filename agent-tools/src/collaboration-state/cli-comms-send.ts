import { randomUUID } from 'node:crypto';
import { join } from 'node:path';

import { appendComms } from './cli-comms-commands.js';
import { resolveCoordinationHomeForOptions } from './cli-coordination-home.js';
import { optional, required, type Options } from './cli-options.js';
import { type CliRuntime } from './cli-runtime.js';
import { sharedCommsLogPathFor } from './comms-use-cases.js';
import { type CollaborationStateEnvironment } from './types.js';

const DEFAULT_COMMS_DIR = '.agent/state/collaboration/comms';

/**
 * One-shot convenience wrapper: append a comms event — narrative, or the
 * ADR-186 lifecycle heartbeat shape when `--tag heartbeat` selects
 * heartbeat mode — resolving canonical collaboration paths from the repo
 * root when the caller does not pass them explicitly. The append renders
 * the shared log beside the comms directory as part of the write.
 */
export async function sendComms(
  options: Options,
  env: CollaborationStateEnvironment,
  runtime: CliRuntime,
): Promise<string> {
  const nowIso = optional(options, 'now') ?? new Date().toISOString();
  const eventId = optional(options, 'event-id') ?? randomUUID();
  const defaults = commsSendDefaults(options, nowIso, eventId, runtime);
  const resolvedOptions = withDefaults(options, defaults);
  await appendComms(resolvedOptions, env, runtime);

  return formatCommsSendResult(resolvedOptions, eventId);
}

// `withDefaults` merges only the `values` Map; `tags`, `files`, and
// `areaPatterns` arrays pass through unchanged on the spread.

/** Build metadata defaults and lazily resolve only missing shared-state paths. */
export function commsSendDefaults(
  options: Options,
  nowIso: string,
  eventId: string,
  runtime: CliRuntime,
): Readonly<Record<string, string>> {
  const eventDefaults = {
    now: nowIso,
    'created-at': nowIso,
    'event-id': eventId,
  };
  if (['comms-dir', 'active'].every((key) => options.values.has(key))) {
    return eventDefaults;
  }

  const repoRoot = resolveCoordinationHomeForOptions(options, runtime);
  return {
    'comms-dir': join(repoRoot, DEFAULT_COMMS_DIR),
    ...eventDefaults,
    active: join(repoRoot, '.agent/state/collaboration/active-claims.json'),
  };
}

export function formatCommsSendResult(options: Options, eventId: string): string {
  return `${JSON.stringify(commsSendResult(options, eventId), null, 2)}\n`;
}

function commsSendResult(
  options: Options,
  eventId: string,
): Readonly<{
  readonly event_id: string;
  readonly event_path: string;
  readonly shared_log_path: string;
}> {
  return {
    event_id: eventId,
    event_path: join(required(options, 'comms-dir'), `${eventId}.json`),
    shared_log_path: sharedCommsLogPathFor(required(options, 'comms-dir')),
  };
}

function withDefaults(options: Options, defaults: Readonly<Record<string, string>>): Options {
  const values = new Map(options.values);
  for (const key in defaults) {
    if (!values.has(key)) {
      values.set(key, defaults[key] ?? '');
    }
  }

  return { ...options, values };
}
