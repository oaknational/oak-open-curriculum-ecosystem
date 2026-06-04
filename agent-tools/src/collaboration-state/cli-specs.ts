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
import { listComms, showComms } from './cli-comms-query.js';
import { directComms, replyComms } from './cli-comms-messages.js';
import { validateComms } from './cli-comms-validate.js';
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
  commsInboxOptions,
  commsReplyOptions,
  commsSendOptions,
  commsWatchOptions,
} from './cli-spec-options.js';
import {
  checkHelp,
  claimsActiveAgentsHelp,
  claimsArchiveStaleHelp,
  claimsCloseHelp,
  claimsHeartbeatHelp,
  claimsListHelp,
  claimsMineHelp,
  claimsOpenHelp,
  claimsShowHelp,
  claimsStatusHelp,
  commsAppendHelp,
  commsDirectHelp,
  commsInboxHelp,
  commsListHelp,
  commsMigrateHelp,
  commsRenderHelp,
  commsReplyHelp,
  commsSendHelp,
  commsShowHelp,
  commsValidateHelp,
  commsWatchHelp,
  conversationAppendHelp,
  escalationCloseHelp,
  escalationOpenHelp,
  identityAuditHelp,
  identityPreflightHelp,
  tuiHelp,
} from './cli-spec-help.js';
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
    help: identityPreflightHelp,
    options: ['platform', 'model', 'active', 'now'],
    handler: (options, env) => preflightIdentity(options, env),
  }),
  'identity:audit': commandSpec({
    help: identityAuditHelp,
    options: ['now', 'active', 'closed', 'thread-record', 'shared-log'],
    handler: (options) => auditIdentity(options),
  }),
  'comms:append': commandSpec({
    help: commsAppendHelp,
    options: commsAppendOptions,
    handler: appendComms,
  }),
  'comms:send': commandSpec({
    help: commsSendHelp,
    options: commsSendOptions,
    handler: sendComms,
  }),
  'comms:render': commandSpec({
    help: commsRenderHelp,
    options: ['comms-dir', 'output'],
    handler: renderComms,
  }),
  'comms:list': commandSpec({
    help: commsListHelp,
    options: ['comms-dir', 'tail'],
    handler: listComms,
  }),
  'comms:show': commandSpec({
    help: commsShowHelp,
    options: ['comms-dir', 'event-id'],
    handler: showComms,
  }),
  'comms:migrate': commandSpec({
    help: commsMigrateHelp,
    options: ['events-dir', 'lifecycle-dir', 'messages-dir', 'comms-dir'],
    handler: migrateComms,
  }),
  'comms:validate': commandSpec({
    help: commsValidateHelp,
    options: ['repo-root'],
    handler: (options) => validateComms(options),
  }),
  'comms:inbox': commandSpec({
    help: commsInboxHelp,
    options: commsInboxOptions,
    handler: inboxComms,
  }),
  'comms:watch': commandSpec({
    help: commsWatchHelp,
    options: commsWatchOptions,
    handler: watchComms,
  }),
  'comms:direct': commandSpec({
    help: commsDirectHelp,
    options: commsDirectOptions,
    handler: directComms,
  }),
  'comms:reply': commandSpec({
    help: commsReplyHelp,
    options: commsReplyOptions,
    handler: replyComms,
  }),
  'claims:open': commandSpec({
    help: claimsOpenHelp,
    options: claimsOpenOptions,
    allowsFiles: true,
    handler: openClaim,
  }),
  'claims:heartbeat': commandSpec({
    help: claimsHeartbeatHelp,
    options: ['active', 'claim-id', 'now'],
    handler: heartbeatClaim,
  }),
  'claims:close': commandSpec({
    help: claimsCloseHelp,
    options: claimsCloseOptions,
    handler: closeClaim,
  }),
  'claims:archive-stale': commandSpec({
    help: claimsArchiveStaleHelp,
    options: ['active', 'closed', 'now', 'platform', 'model'],
    handler: archiveClaims,
  }),
  'claims:list': commandSpec({
    help: claimsListHelp,
    options: ['active', 'now'],
    handler: listClaims,
  }),
  'claims:mine': commandSpec({
    help: claimsMineHelp,
    options: ['active', 'platform', 'model', 'now'],
    handler: mineClaims,
  }),
  'claims:show': commandSpec({
    help: claimsShowHelp,
    options: ['active', 'claim-id', 'now'],
    handler: showClaim,
  }),
  'claims:status': commandSpec({
    help: claimsStatusHelp,
    options: ['active', 'now'],
    handler: statusClaims,
  }),
  'claims:active-agents': commandSpec({
    help: claimsActiveAgentsHelp,
    options: ['active', 'closed', 'now'],
    handler: activeAgents,
  }),
  'tui:': commandSpec({
    help: tuiHelp,
    options: ['format', 'repo-root', 'active', 'closed', 'comms-dir', 'now', 'poll-ms'],
    handler: (options, _env, runtime) => collaborationTui(options, runtime),
  }),
  'conversation:append': commandSpec({
    help: conversationAppendHelp,
    options: ['file', 'entry-json'],
    handler: appendJsonEntry,
  }),
  'escalation:open': commandSpec({
    help: escalationOpenHelp,
    options: ['file', 'body-json'],
    handler: writeJsonBody,
  }),
  'escalation:close': commandSpec({
    help: escalationCloseHelp,
    options: ['file', 'body-json'],
    handler: writeJsonBody,
  }),
  'check:': commandSpec({
    help: checkHelp,
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
