import { archiveClaims, closeClaim, heartbeatClaim, openClaim } from './cli-claim-commands.js';
import {
  activeAgents,
  listClaims,
  mineClaims,
  showClaim,
  statusClaims,
} from './cli-claim-query-commands.js';
import { appendComms, migrateComms, renderComms, sendComms } from './cli-comms-commands.js';
import { inboxComms } from './cli-comms-inbox.js';
import { directComms, replyComms } from './cli-comms-messages.js';
import { watchComms } from './cli-comms-watch.js';
import { preflightIdentity } from './cli-identity.js';
import { auditIdentity } from './cli-identity-audit.js';
import { type Options } from './cli-options.js';
import { type CliRuntime } from './cli-runtime.js';
import { appendJsonEntry, checkState, writeJsonBody } from './cli-json-commands.js';
import { collaborationTui } from './tui/cli.js';
import {
  claimsCloseOptions,
  claimsOpenOptions,
  commsAppendOptions,
  commsDirectOptions,
  commsReplyOptions,
  commsSendOptions,
  commsWatchOptions,
} from './cli-spec-options.js';
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
  runtime: CliRuntime,
) => Promise<string> | string;

export const specs: Readonly<Record<string, CommandSpec>> = {
  'identity:preflight': commandSpec({
    help: 'identity preflight --platform <platform> --model <model> [--active <path>] [--now <iso>]',
    options: ['platform', 'model', 'active', 'now'],
    handler: (options, env) => preflightIdentity(options, env),
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
      'comms append --comms-dir <dir> --now <iso> --created-at <iso> ' +
      '--title <title> --body <body> --platform <platform> --model <model> ' +
      '--active <path> [--event-id <id>]',
    options: commsAppendOptions,
    handler: appendComms,
  }),
  'comms:send': commandSpec({
    help:
      'comms send --title <title> --body <body> --platform <platform> --model <model> ' +
      '[--comms-dir <dir>] [--output <path>] [--active <path>] [--repo-root <path>] [--now <iso>] ' +
      '[--event-id <id>] (identity seed: PRACTICE_AGENT_SESSION_ID_CLAUDE, ' +
      'PRACTICE_AGENT_SESSION_ID_CURSOR, PRACTICE_AGENT_SESSION_ID_CODEX, CODEX_THREAD_ID, ' +
      'or OAK_AGENT_IDENTITY_OVERRIDE)',
    options: commsSendOptions,
    handler: sendComms,
  }),
  'comms:render': commandSpec({
    help: 'comms render --comms-dir <dir> --output <path>',
    options: ['comms-dir', 'output'],
    handler: renderComms,
  }),
  'comms:migrate': commandSpec({
    help:
      'comms migrate --events-dir <dir> --lifecycle-dir <dir> ' +
      '--messages-dir <dir> --comms-dir <dir>',
    options: ['events-dir', 'lifecycle-dir', 'messages-dir', 'comms-dir'],
    handler: migrateComms,
  }),
  'comms:inbox': commandSpec({
    help: 'comms inbox --comms-dir <dir> --agent-name <name> --seen-file <path>',
    options: ['comms-dir', 'agent-name', 'seen-file'],
    handler: inboxComms,
  }),
  'comms:watch': commandSpec({
    help:
      'comms watch --comms-dir <dir> --agent-name <name> --seen-file <path> ' +
      '[--session-prefix <prefix>] [--poll-ms <n>] [--max-events <n>]',
    options: commsWatchOptions,
    handler: (options, _env, runtime) => watchComms(options, runtime),
  }),
  'comms:direct': commandSpec({
    help:
      'comms direct --comms-dir <dir> --to-agent-name <name> --to-platform <platform> ' +
      '--to-model <model> --to-session-prefix <prefix> --kind <kind> ' +
      '--subject <subject> --body <body> --platform <platform> --model <model> ' +
      '--active <path> [--event-id <id>] [--now <iso>]',
    options: commsDirectOptions,
    handler: directComms,
  }),
  'comms:reply': commandSpec({
    help:
      'comms reply --comms-dir <dir> --to-event-id <id> --kind <kind> ' +
      '--body <body> --platform <platform> --model <model> ' +
      '--active <path> [--subject <subject>] [--event-id <id>] [--now <iso>]',
    options: commsReplyOptions,
    handler: replyComms,
  }),
  'claims:open': commandSpec({
    help:
      'claims open --active <path> --thread <thread> ' +
      '--area-kind <files|workspace|plan|adr|git> ' +
      '--intent <text> --now <iso> --platform <platform> --model <model> ' +
      '[--file <path>...] [--area-pattern <pattern>...] [--claim-id <id>] ' +
      '[--ttl-seconds <n>] (use either repeatable --file or repeatable --area-pattern, not both)',
    options: claimsOpenOptions,
    allowsFiles: true,
    handler: openClaim,
  }),
  'claims:heartbeat': commandSpec({
    help: 'claims heartbeat --active <path> --claim-id <id> --now <iso>',
    options: ['active', 'claim-id', 'now'],
    handler: heartbeatClaim,
  }),
  'claims:close': commandSpec({
    help:
      'claims close --active <path> --closed <path> --claim-id <id> ' +
      '--summary <text> --now <iso> --platform <platform> --model <model> ' +
      '[--closure-summary <text> alias for --summary]',
    options: claimsCloseOptions,
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
    handler: listClaims,
  }),
  'claims:mine': commandSpec({
    help: 'claims mine --active <path> --platform <platform> --model <model> [--now <iso>]',
    options: ['active', 'platform', 'model', 'now'],
    handler: mineClaims,
  }),
  'claims:show': commandSpec({
    help: 'claims show --active <path> --claim-id <id> [--now <iso>]',
    options: ['active', 'claim-id', 'now'],
    handler: showClaim,
  }),
  'claims:status': commandSpec({
    help: 'claims status --active <path> [--now <iso>]',
    options: ['active', 'now'],
    handler: statusClaims,
  }),
  'claims:active-agents': commandSpec({
    help: 'claims active-agents --active <path> [--closed <path>] [--now <iso>]',
    options: ['active', 'closed', 'now'],
    handler: activeAgents,
  }),
  'tui:': commandSpec({
    help:
      'tui [--format <tui|text>] [--repo-root <path>] [--active <path>] ' +
      '[--closed <path>] [--comms-dir <dir>] [--now <iso>]',
    options: ['format', 'repo-root', 'active', 'closed', 'comms-dir', 'now'],
    handler: collaborationTui,
  }),
  'conversation:append': commandSpec({
    help: 'conversation append --file <path> --entry-json <json>',
    options: ['file', 'entry-json'],
    handler: appendJsonEntry,
  }),
  'escalation:open': commandSpec({
    help: 'escalation open --file <path> --body-json <json>',
    options: ['file', 'body-json'],
    handler: writeJsonBody,
  }),
  'escalation:close': commandSpec({
    help: 'escalation close --file <path> --body-json <json>',
    options: ['file', 'body-json'],
    handler: writeJsonBody,
  }),
  'check:': commandSpec({
    help: 'check [--active <path>] [--closed <path>] [--comms-dir <dir>]',
    options: ['active', 'closed', 'comms-dir'],
    handler: checkState,
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
