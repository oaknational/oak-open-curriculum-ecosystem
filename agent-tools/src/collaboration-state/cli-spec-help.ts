/**
 * Help / usage strings for the collaboration-state CLI command specs.
 *
 * Extracted from `cli-specs.ts` so the spec table stays pure wiring and the
 * help text — which grows with every discoverability fix (frictions register
 * F-09 family) — has a home that can expand without pushing the spec table
 * past its `max-lines` ceiling. Each constant is the exact string returned by
 * `<topic> <action> --help` and prepended to command-error output, so the
 * CLI-level help tests in
 * `tests/collaboration-state/collaboration-state.unit.test.ts` are the
 * behavioural contract for this content.
 */

export const identityPreflightHelp =
  'identity preflight --platform <platform> --model <model> [--active <path>] [--now <iso>]';

export const identityAuditHelp =
  'identity audit --now <iso> --active <path> --closed <path> ' +
  '--thread-record <path> --shared-log <path>';

export const commsAppendHelp =
  'comms append --comms-dir <dir> --now <iso> --created-at <iso> ' +
  '--title <title> (--body <body> | --body-file <path>) ' +
  '--platform <platform> --model <model> ' +
  '--active <path> [--event-id <id>] [--tag <tag>...] ' +
  '(--body and --body-file are mutually exclusive; --body-file is the cure ' +
  'for shell-quoting hazards on bodies that contain backticks or dollar signs; ' +
  '--tag is repeatable, accepts ADR-183 namespace ' +
  '[failure-mode, behaviour-note, heartbeat]; ' +
  'HEARTBEAT MODE: with --tag heartbeat the body is composed from typed state ' +
  'args instead — --body and --body-file are rejected, and --claim-id <id> ' +
  '--intent-id <id> --branch <branch> --current-cycle-label <label> are required)';

export const commsSendHelp =
  'comms send --title <title> (--body <body> | --body-file <path>) ' +
  '--platform <platform> --model <model> ' +
  '[--comms-dir <dir>] [--output <path>] [--active <path>] [--repo-root <path>] [--now <iso>] ' +
  '[--event-id <id>] [--tag <tag>...] (--body and --body-file are mutually exclusive; ' +
  '--body-file reads the file literally and bypasses shell interpretation; ' +
  '--tag is repeatable, accepts ADR-183 namespace ' +
  '[failure-mode, behaviour-note, heartbeat]; ' +
  'HEARTBEAT MODE: with --tag heartbeat the body is composed from typed state ' +
  'args instead — --body and --body-file are rejected, and --claim-id <id> ' +
  '--intent-id <id> --branch <branch> --current-cycle-label <label> are required) ' +
  '(identity seed: PRACTICE_AGENT_SESSION_ID_CLAUDE, ' +
  'PRACTICE_AGENT_SESSION_ID_CURSOR, PRACTICE_AGENT_SESSION_ID_GEMINI, ' +
  'PRACTICE_AGENT_SESSION_ID_CODEX, CODEX_THREAD_ID, Antigravity conversationId, ' +
  'or OAK_AGENT_IDENTITY_OVERRIDE)';

export const commsRenderHelp = 'comms render --comms-dir <dir> --output <path>';

export const commsListHelp =
  'comms list --comms-dir <dir> [--tail <n>] ' +
  '(newest-first one-line summary per event: created_at, event_id, ' +
  'author/session_prefix, [kind] (plus any [tags]), and title; default tail ' +
  '20; read-only, no identity seed required; pass an event_id to `comms show` ' +
  'for the full body)';

export const commsShowHelp =
  'comms show --comms-dir <dir> --event-id <id> ' +
  '(prints the full canonical JSON event resolved by id, including its body; ' +
  'read-only; fails non-zero when no event carries the id)';

export const commsMigrateHelp =
  'comms migrate --events-dir <dir> --lifecycle-dir <dir> ' +
  '--messages-dir <dir> --comms-dir <dir>';

export const commsValidateHelp = 'comms validate [--repo-root <path>]';

export const commsInboxHelp =
  'comms inbox --comms-dir <dir> --seen-file <path> ' +
  '--platform <platform> --model <model> ' +
  '[--session-prefix <prefix>] ' +
  '(emits every relevant event — broadcast, group, directed, observed, lifecycle — ' +
  'with self-exclusion only)';

export const commsWatchHelp =
  'comms watch --comms-dir <dir> --seen-file <path> ' +
  '--platform <platform> --model <model> ' +
  '[--session-prefix <prefix>] ' +
  '[--poll-ms <n>] [--max-events <n>] [--step-timeout-ms <n>] ' +
  '[--heartbeat-file <path>] [--heartbeat-interval-ms <n>] [--no-heartbeat] ' +
  '[--seed-from-now] [--no-auto-seed] ' +
  '(emits every relevant event — broadcast, group, directed, observed, lifecycle — ' +
  'with self-exclusion only; step-timeout-ms (default 60000) is the per-step deadline on ' +
  'drain/emit/markSeen — a step that hangs past it makes the watcher exit non-zero (fail-loud) ' +
  'instead of silently muting; the liveness heartbeat is ON BY DEFAULT at <seen-file>.heartbeat.json ' +
  '(default interval 30000ms) so a staleness consumer can classify a frozen watcher — ' +
  'pass --heartbeat-file to relocate it or --no-heartbeat to disable it; ' +
  'auto-seed-on-empty default seeds the seen-file with current events so a fresh ' +
  'watcher starts forward from now rather than replaying full history; ' +
  'pass --no-auto-seed to replay the full event history on an empty seen-file; ' +
  'pass --seed-from-now to force a seed regardless of existing seen-file content)';

export const commsDirectHelp =
  'comms direct --comms-dir <dir> --to-agent-name <name> --to-id <uuid-v5> ' +
  '--to-platform <platform> --to-model <model> --to-session-prefix <prefix> --kind <kind> ' +
  '--subject <subject> (--body <body> | --body-file <path>) ' +
  '--platform <platform> --model <model> ' +
  '--active <path> [--event-id <id>] [--now <iso>] [--tag <tag>...] ' +
  '(--body and --body-file are mutually exclusive; --body-file reads the file ' +
  'literally and bypasses shell interpretation; --tag is repeatable, accepts ' +
  'ADR-183 namespace [failure-mode, behaviour-note, heartbeat])';

export const commsReplyHelp =
  'comms reply --comms-dir <dir> --to-event-id <id> --kind <kind> ' +
  '(--body <body> | --body-file <path>) --platform <platform> --model <model> ' +
  '--active <path> [--subject <subject>] [--event-id <id>] [--now <iso>] ' +
  '(--body and --body-file are mutually exclusive; --body-file reads the file ' +
  'literally and bypasses shell interpretation)';

export const claimsOpenHelp =
  'claims open --active <path> --thread <thread> ' +
  '--area-kind <files|workspace|plan|adr|git> ' +
  '--intent <text> --now <iso> --platform <platform> --model <model> ' +
  '[--file <path>...] [--area-pattern <pattern>...] [--claim-id <id>] ' +
  '[--ttl-seconds <n>] [--role <role>] ' +
  '(use either repeatable --file or repeatable --area-pattern, not both)';

export const claimsHeartbeatHelp = 'claims heartbeat --active <path> --claim-id <id> --now <iso>';

export const claimsCloseHelp =
  'claims close --active <path> --closed <path> --claim-id <id> ' +
  '--summary <text> --now <iso> --platform <platform> --model <model> ' +
  '[--closure-summary <text> alias for --summary]';

export const claimsArchiveStaleHelp =
  'claims archive-stale --active <path> --closed <path> --now <iso> ' +
  '--platform <platform> --model <model>';

export const claimsListHelp = 'claims list --active <path> [--now <iso>]';

export const claimsMineHelp =
  'claims mine --active <path> --platform <platform> --model <model> [--now <iso>]';

export const claimsShowHelp = 'claims show --active <path> --claim-id <id> [--now <iso>]';

export const claimsStatusHelp = 'claims status --active <path> [--now <iso>]';

export const claimsActiveAgentsHelp =
  'claims active-agents --active <path> [--closed <path>] [--now <iso>]';

export const tuiHelp =
  'tui [--format <tui|text>] [--repo-root <path>] [--active <path>] ' +
  '[--closed <path>] [--comms-dir <dir>] [--now <iso>] [--poll-ms <n>]';

export const conversationAppendHelp = 'conversation append --file <path> --entry-json <json>';

export const escalationOpenHelp = 'escalation open --file <path> --body-json <json>';

export const escalationCloseHelp = 'escalation close --file <path> --body-json <json>';

export const checkHelp = 'check [--active <path>] [--closed <path>] [--comms-dir <dir>]';
