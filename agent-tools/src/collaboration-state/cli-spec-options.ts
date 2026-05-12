export const commsAppendOptions = [
  'events-dir',
  'now',
  'created-at',
  'title',
  'body',
  'platform',
  'model',
  'active',
  'event-id',
] as const;

export const commsSendOptions = [
  'title',
  'body',
  'platform',
  'model',
  'events-dir',
  'output',
  'active',
  'repo-root',
  'now',
  'event-id',
] as const;

export const commsWatchOptions = [
  'messages-dir',
  'agent-name',
  'seen-file',
  'session-prefix',
  'poll-ms',
  'max-events',
] as const;

export const commsDirectOptions = [
  'messages-dir',
  'to-agent-name',
  'to-platform',
  'to-model',
  'to-session-prefix',
  'kind',
  'subject',
  'body',
  'platform',
  'model',
  'active',
  'event-id',
  'now',
] as const;

export const commsReplyOptions = [
  'messages-dir',
  'to-event-id',
  'kind',
  'body',
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
