import { archiveClaims, closeClaim, heartbeatClaim, openClaim } from './cli-claim-commands.js';
import { listClaims, mineClaims, showClaim, statusClaims } from './cli-claim-query-commands.js';
import { appendComms, renderComms, sendComms } from './cli-comms-commands.js';
import { resolveIdentity } from './cli-identity.js';
import { auditIdentity } from './cli-identity-audit.js';
import { type Options } from './cli-options.js';
import { appendJsonEntry, checkState, writeJsonBody } from './cli-json-commands.js';
import { type CollaborationStateEnvironment } from './types.js';

export interface CommandSpec {
  readonly handler: CliHandler;
  readonly help: string;
  readonly options: ReadonlySet<string>;
  readonly allowsFiles?: boolean;
}

type CliHandler = (
  options: Options,
  env: CollaborationStateEnvironment,
) => Promise<string> | string;

export const specs: Readonly<Record<string, CommandSpec>> = {
  'identity:preflight': commandSpec({
    help: 'identity preflight --platform <platform> --model <model>',
    options: ['platform', 'model'],
    handler: (options, env) => `${JSON.stringify(resolveIdentity(options, env), null, 2)}\n`,
  }),
  'identity:audit': commandSpec({
    help:
      'identity audit --now <iso> --active <path> --closed <path> ' +
      '--thread-record <path> --shared-log <path>',
    options: ['now', 'active', 'closed', 'thread-record', 'shared-log'],
    handler: (options) => auditIdentity(options),
  }),
  'comms:append': commandSpec({
    help:
      'comms append --events-dir <dir> --now <iso> --created-at <iso> ' +
      '--title <title> --body <body> --platform <platform> --model <model> [--event-id <id>]',
    options: ['events-dir', 'now', 'created-at', 'title', 'body', 'platform', 'model', 'event-id'],
    handler: appendComms,
  }),
  'comms:send': commandSpec({
    help:
      'comms send --title <title> --body <body> --platform <platform> --model <model> ' +
      '[--events-dir <dir>] [--output <path>] [--repo-root <path>] [--now <iso>] [--event-id <id>]',
    options: [
      'title',
      'body',
      'platform',
      'model',
      'events-dir',
      'output',
      'repo-root',
      'now',
      'event-id',
    ],
    handler: sendComms,
  }),
  'comms:render': commandSpec({
    help: 'comms render --events-dir <dir> --output <path>',
    options: ['events-dir', 'output'],
    handler: (options) => renderComms(options),
  }),
  'claims:open': commandSpec({
    help:
      'claims open --active <path> --thread <thread> --area-kind <kind> ' +
      '--intent <text> --now <iso> --platform <platform> --model <model> ' +
      '[--file <path>...] [--area-pattern <pattern>] [--claim-id <id>] [--ttl-seconds <n>]',
    options: [
      'active',
      'thread',
      'area-kind',
      'area-pattern',
      'intent',
      'now',
      'platform',
      'model',
      'claim-id',
      'ttl-seconds',
      'notes',
    ],
    allowsFiles: true,
    handler: openClaim,
  }),
  'claims:heartbeat': commandSpec({
    help: 'claims heartbeat --active <path> --claim-id <id> --now <iso>',
    options: ['active', 'claim-id', 'now'],
    handler: (options) => heartbeatClaim(options),
  }),
  'claims:close': commandSpec({
    help:
      'claims close --active <path> --closed <path> --claim-id <id> ' +
      '--summary <text> --now <iso> --platform <platform> --model <model>',
    options: ['active', 'closed', 'claim-id', 'summary', 'now', 'platform', 'model'],
    handler: closeClaim,
  }),
  'claims:archive-stale': commandSpec({
    help:
      'claims archive-stale --active <path> --closed <path> --now <iso> ' +
      '--platform <platform> --model <model>',
    options: ['active', 'closed', 'now', 'platform', 'model'],
    handler: archiveClaims,
  }),
  'claims:list': commandSpec({
    help: 'claims list --active <path> [--now <iso>]',
    options: ['active', 'now'],
    handler: (options) => listClaims(options),
  }),
  'claims:mine': commandSpec({
    help: 'claims mine --active <path> --platform <platform> --model <model> [--now <iso>]',
    options: ['active', 'platform', 'model', 'now'],
    handler: mineClaims,
  }),
  'claims:show': commandSpec({
    help: 'claims show --active <path> --claim-id <id> [--now <iso>]',
    options: ['active', 'claim-id', 'now'],
    handler: (options) => showClaim(options),
  }),
  'claims:status': commandSpec({
    help: 'claims status --active <path> [--now <iso>]',
    options: ['active', 'now'],
    handler: (options) => statusClaims(options),
  }),
  'conversation:append': commandSpec({
    help: 'conversation append --file <path> --entry-json <json>',
    options: ['file', 'entry-json'],
    handler: (options) => appendJsonEntry(options),
  }),
  'escalation:open': commandSpec({
    help: 'escalation open --file <path> --body-json <json>',
    options: ['file', 'body-json'],
    handler: (options) => writeJsonBody(options),
  }),
  'escalation:close': commandSpec({
    help: 'escalation close --file <path> --body-json <json>',
    options: ['file', 'body-json'],
    handler: (options) => writeJsonBody(options),
  }),
  'check:': commandSpec({
    help: 'check [--active <path>] [--closed <path>] [--events-dir <dir>]',
    options: ['active', 'closed', 'events-dir'],
    handler: (options) => checkState(options),
  }),
};

function commandSpec(input: {
  readonly help: string;
  readonly options: readonly string[];
  readonly allowsFiles?: boolean;
  readonly handler: CliHandler;
}): CommandSpec {
  return {
    help: input.help,
    options: new Set(input.options),
    allowsFiles: input.allowsFiles,
    handler: input.handler,
  };
}
