import { archiveClaims, closeClaim, heartbeatClaim, openClaim } from './cli-claim-commands.js';
import { adoptClaim, setHandoffClaim } from './cli-claim-handoff-commands.js';
import { assertWatcherLive } from './cli-comms-assert-watcher-live.js';
import {
  activeAgents,
  listClaims,
  mineClaims,
  showClaim,
  statusClaims,
} from './cli-claim-query-commands.js';
import { appendComms, migrateComms, renderComms } from './cli-comms-commands.js';
import { sendComms } from './cli-comms-send.js';
import { inboxComms } from './cli-comms-inbox.js';
import { listComms, peerLivenessComms, showComms } from './cli-comms-query.js';
import { directComms, replyComms } from './cli-comms-messages.js';
import { validateComms } from './cli-comms-validate.js';
import { watchComms } from './cli-comms-watch.js';
import { preflightIdentity } from './cli-identity.js';
import { auditIdentity } from './cli-identity-audit.js';
import { commandSpec, type CommandSpec } from './cli-spec-factory.js';
import { appendJsonEntry, checkState, writeJsonBody } from './cli-json-commands.js';
import { collaborationTui } from './tui/cli.js';
import {
  claimsAdoptOptions,
  claimsCloseOptions,
  claimsOpenOptions,
  claimsSetHandoffOptions,
  commsAppendOptions,
  commsAssertWatcherLiveOptions,
  commsDirectOptions,
  commsInboxOptions,
  commsReplyOptions,
  commsSendOptions,
  commsWatchOptions,
} from './cli-spec-options.js';
import {
  checkHelp,
  claimsActiveAgentsHelp,
  claimsAdoptHelp,
  claimsArchiveStaleHelp,
  claimsCloseHelp,
  claimsHeartbeatHelp,
  claimsListHelp,
  claimsMineHelp,
  claimsOpenHelp,
  claimsSetHandoffHelp,
  claimsShowHelp,
  claimsStatusHelp,
  commsAppendHelp,
  commsAssertWatcherLiveHelp,
  commsDirectHelp,
  commsInboxHelp,
  commsListHelp,
  commsMigrateHelp,
  commsPeerLivenessHelp,
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
export const specs: Readonly<Record<string, CommandSpec>> = {
  'identity:preflight': commandSpec({
    help: identityPreflightHelp,
    options: ['platform', 'model', 'active', 'now'],
    handler: (options, env, runtime) => preflightIdentity(options, env, runtime),
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
  'comms:peer-liveness': commandSpec({
    help: commsPeerLivenessHelp,
    options: ['comms-dir', 'now'],
    handler: peerLivenessComms,
  }),
  'comms:migrate': commandSpec({
    help: commsMigrateHelp,
    options: ['events-dir', 'lifecycle-dir', 'messages-dir', 'comms-dir'],
    handler: migrateComms,
  }),
  'comms:validate': commandSpec({
    help: commsValidateHelp,
    options: ['repo-root'],
    handler: (options) => validateComms(options, process.cwd()),
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
  'comms:assert-watcher-live': commandSpec({
    help: commsAssertWatcherLiveHelp,
    options: commsAssertWatcherLiveOptions,
    handler: assertWatcherLive,
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
  'claims:adopt': commandSpec({
    help: claimsAdoptHelp,
    options: claimsAdoptOptions,
    handler: adoptClaim,
  }),
  'claims:set-handoff': commandSpec({
    help: claimsSetHandoffHelp,
    options: claimsSetHandoffOptions,
    handler: setHandoffClaim,
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
