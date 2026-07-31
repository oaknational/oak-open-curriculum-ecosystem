export const commsAppendOptions = [
  'comms-dir',
  'now',
  'created-at',
  'title',
  'body',
  'body-file',
  'platform',
  'model',
  'active',
  'event-id',
  'tag',
  'claim-id',
  'intent-id',
  'branch',
  'current-cycle-label',
  'in-response-to',
] as const;

export const commsSendOptions = [
  'title',
  'body',
  'body-file',
  'platform',
  'model',
  'comms-dir',
  'output',
  'active',
  'repo-root',
  'now',
  'event-id',
  'tag',
  'claim-id',
  'intent-id',
  'branch',
  'current-cycle-label',
  'in-response-to',
] as const;

export const commsWatchOptions = [
  'comms-dir',
  'seen-file',
  'repo-root',
  'platform',
  'model',
  'agent-name',
  'session-prefix',
  'poll-ms',
  'max-events-per-drain',
  'step-timeout-ms',
  'heartbeat-file',
  'heartbeat-interval-ms',
  'no-heartbeat',
  'seed-from-now',
  'no-auto-seed',
  'supervisor-pid',
  'exclude-tag',
] as const;

export const commsInboxOptions = [
  'comms-dir',
  'seen-file',
  'platform',
  'model',
  'agent-name',
  'session-prefix',
] as const;

export const commsDirectOptions = [
  'comms-dir',
  'to-agent-name',
  'to-id',
  'to-platform',
  'to-model',
  'to-session-prefix',
  'kind',
  'subject',
  'body',
  'body-file',
  'platform',
  'model',
  'active',
  'event-id',
  'now',
  'in-response-to',
  'tag',
] as const;

export const commsReplyOptions = [
  'comms-dir',
  'to-event-id',
  'kind',
  'body',
  'body-file',
  'platform',
  'model',
  'active',
  'subject',
  'event-id',
  'now',
  // The concept-gate refusal prescribes adding a capture tag; replyComms
  // applies the exemption from options.tags, so the dispatcher must accept
  // --tag here or the prescribed recovery path is not executable.
  'tag',
] as const;

export const claimsOpenOptions = [
  'active',
  'repo-root',
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
  'role',
] as const;

export const claimsCloseOptions = [
  'active',
  'repo-root',
  'closed',
  'claim-id',
  'summary',
  'closure-summary',
  'now',
  'platform',
  'model',
] as const;

export const commsAssertWatcherLiveOptions = [
  'comms-seen-dir',
  'heartbeat-file',
  'repo-root',
  'agent-name',
  'session-prefix',
  'platform',
  'model',
] as const;

export const claimsAdoptOptions = ['active', 'repo-root', 'claim-id', 'platform', 'model'] as const;

export const claimsSetHandoffOptions = ['active', 'repo-root', 'claim-id', 'path'] as const;
