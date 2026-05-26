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
] as const;

export const commsWatchOptions = [
  'comms-dir',
  'seen-file',
  'platform',
  'model',
  'agent-name',
  'session-prefix',
  'poll-ms',
  'max-events',
  'heartbeat-file',
  'heartbeat-interval-ms',
  'seed-from-now',
  'no-auto-seed',
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
] as const;

export const claimsOpenOptions = [
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
] as const;

export const claimsCloseOptions = [
  'active',
  'closed',
  'claim-id',
  'summary',
  'closure-summary',
  'now',
  'platform',
  'model',
] as const;
