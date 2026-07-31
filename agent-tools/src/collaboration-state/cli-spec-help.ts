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
  '--active <path> [--event-id <id>] [--tag <tag>...] [--in-response-to <id>] ' +
  '(--body and --body-file are mutually exclusive; --body-file is the cure ' +
  'for shell-quoting hazards on bodies that contain backticks or dollar signs; ' +
  '--tag is repeatable, accepts ADR-183 namespace ' +
  '[failure-mode, behaviour-note, heartbeat]; ' +
  '--in-response-to threads this event to an antecedent event_id of any kind ' +
  '(e.g. a PDR-064 Moment-2 ack referencing a broadcast pre-position); ' +
  'HEARTBEAT MODE: with --tag heartbeat the body is composed from typed state ' +
  'args instead — --body and --body-file are rejected, and --claim-id <id> ' +
  '--intent-id <id> --branch <branch> --current-cycle-label <label> are required)';

export const commsSendHelp =
  'comms send --title <title> (--body <body> | --body-file <path>) ' +
  '--platform <platform> --model <model> ' +
  '[--comms-dir <dir>] [--output <path>] [--active <path>] [--repo-root <path>] [--now <iso>] ' +
  '[--event-id <id>] [--tag <tag>...] [--in-response-to <id>] ' +
  '(--body and --body-file are mutually exclusive; ' +
  '--body-file reads the file literally and bypasses shell interpretation; ' +
  '--tag is repeatable, accepts ADR-183 namespace ' +
  '[failure-mode, behaviour-note, heartbeat]; ' +
  '--in-response-to threads this event to an antecedent event_id of any kind; ' +
  'HEARTBEAT MODE: with --tag heartbeat the body is composed from typed state ' +
  'args instead — --body and --body-file are rejected, and --claim-id <id> ' +
  '--intent-id <id> --branch <branch> --current-cycle-label <label> are required) ' +
  '(identity seed: PRACTICE_AGENT_SESSION_ID_CLAUDE, ' +
  'PRACTICE_AGENT_SESSION_ID_CURSOR, PRACTICE_AGENT_SESSION_ID_GEMINI, ' +
  'PRACTICE_AGENT_SESSION_ID_CODEX, CODEX_THREAD_ID, Antigravity conversationId, ' +
  'or OAK_AGENT_IDENTITY_OVERRIDE)';

export const commsRenderHelp = 'comms render --comms-dir <dir> --output <path>';

export const commsListHelp =
  'comms list --comms-dir <dir> [--since <iso>] [--tail <n>] ' +
  '(newest-first one-line summary per event: created_at, event_id, ' +
  'author/session_prefix, [kind] (plus any [tags]), and title; --since keeps ' +
  'events at or after the ISO instant (inclusive); default tail 20; read-only, ' +
  'no identity seed required; pass an event_id to `comms show` for the full ' +
  'body)';

export const commsShowHelp =
  'comms show --comms-dir <dir> (<event-id> | --event-id <id>) ' +
  '(prints the full canonical JSON event resolved by id, including its body; ' +
  'the id may be given as a bare positional or via --event-id; ' +
  'read-only; fails non-zero when no event carries the id)';

export const commsPeerLivenessHelp =
  'comms peer-liveness --comms-dir <dir> [--now <iso>] ' +
  '(F-75: classifies each peer from the PDR-078 heartbeat event stream — ' +
  'active <4m / offline 4-10m / retired >=10m, most-stale-first; read-only, ' +
  'no identity seed; --now defaults to the real wall clock and is accepted ' +
  'only for deterministic tests/replay. Pull side of peer heartbeat-silence ' +
  'detection — see liveness-heartbeat-cron.md for the Monitor/poll alert ' +
  'recipe; treat output as input-to-verify, never an auto-retirement verdict)';

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
  'comms watch [--comms-dir <dir>] [--seen-file <path>] [--repo-root <path>] ' +
  '--platform <platform> --model <model> ' +
  '[--session-prefix <prefix>] ' +
  '[--poll-ms <n>] [--max-events-per-drain <n>] [--step-timeout-ms <n>] ' +
  '[--heartbeat-file <path>] [--heartbeat-interval-ms <n>] [--no-heartbeat] ' +
  '[--seed-from-now] [--no-auto-seed] [--supervisor-pid <pid>] [--exclude-tag <tag>...] ' +
  '(emits every relevant event — broadcast, group, directed, observed, lifecycle — ' +
  '--comms-dir and --seen-file are an explicit pair: provide both, or omit both ' +
  'to derive the comms directory and this identity’s cursor from the primary ' +
  'coordination home (--repo-root is the explicit home override); the watcher ' +
  'creates the comms directory and seen-file parent before arming; ' +
  'with self-exclusion plus the sanctioned repeatable --exclude-tag mechanism ' +
  '(F-146; ADR-183 namespace tags only; an excluded event still marks seen; ' +
  'directed and group events always surface; a multi-tag event with any ' +
  'non-excluded tag leaks through; excluding heartbeat REQUIRES pairing with the ' +
  'comms peer-liveness poll per the watcher rule) — hand-rolled filtering remains ' +
  'forbidden; max-events-per-drain bounds EACH drain pass, never the lifetime ' +
  '(every successful pass advances the seen-file cursor and the watcher keeps ' +
  'running; the bound caps the batch emitted per pass, not the unseen-set read; it ' +
  'replaces the retired lifetime-budget flag max-events — always pass it, because ' +
  'an unbounded pass over a large backlog re-creates the drain-deadline wedge); ' +
  'the watcher runs until its --supervisor-pid dies, so ALWAYS pass the pid — ' +
  'without it and without a composing timeout wrapper the process has no orderly ' +
  'exit path of its own; every orderly exit ends with the line ' +
  '"--- WATCHER EXIT --- reason=<supervisor-gone|fatal-step> emitted_count=<n>"; ' +
  'step-timeout-ms (default 60000) is the per-step deadline on ' +
  'drain/emit/markSeen — a step that hangs past it makes the watcher exit non-zero (fail-loud, ' +
  'kind=timeout, NO exit line) instead of silently muting; ' +
  'the liveness heartbeat is ON BY DEFAULT at <seen-file>.heartbeat.json ' +
  '(default interval 30000ms) so a staleness consumer can classify a frozen watcher — ' +
  'pass --heartbeat-file to relocate it or --no-heartbeat to disable it; ' +
  'auto-seed-on-empty default seeds the seen-file with current events so a fresh ' +
  'watcher starts forward from now rather than replaying full history; ' +
  'pass --no-auto-seed to replay the full event history on an empty seen-file; ' +
  'pass --seed-from-now to force a seed regardless of existing seen-file content; ' +
  'pass --supervisor-pid <pid> to self-exit when that process (the agent session) ' +
  'is gone — the F-101 crash/SIGKILL orphan cure: the watcher checks the pid once ' +
  'per poll cycle and exits within one cycle of the supervisor dying, curing the ' +
  'false-liveness orphan that GNU timeout group-kill misses on a harsh agent death)';

export const commsAssertWatcherLiveHelp =
  'comms assert-watcher-live (--platform <platform> --model <model> | --agent-name <name>) ' +
  '[--session-prefix <prefix>] [--comms-seen-dir <dir>] [--heartbeat-file <path>] ' +
  '[--repo-root <path>] ' +
  "(F-95 move-1 check: exits non-zero with a fix instruction unless this session's comms watcher " +
  'heartbeat is live AND its identity matches this session. Freshness is judged against the real ' +
  'wall clock. Identity is derived from --platform/--model (plus the env session seed), or ' +
  'overridden with --agent-name; the heartbeat resolves from the session codename under the ' +
  'primary coordination home unless --comms-seen-dir or --heartbeat-file overrides it)';

export const commsDirectHelp =
  'comms direct --comms-dir <dir> --to-agent-name <name> --to-id <uuid-v5> ' +
  '--to-platform <platform> --to-model <model> --to-session-prefix <prefix> --kind <kind> ' +
  '--subject <subject> (--body <body> | --body-file <path>) ' +
  '--platform <platform> --model <model> ' +
  '--active <path> [--event-id <id>] [--now <iso>] [--in-response-to <id>] [--tag <tag>...] ' +
  '(--body and --body-file are mutually exclusive; --body-file reads the file ' +
  'literally and bypasses shell interpretation; --in-response-to threads this ' +
  'message to an antecedent event_id of any kind; --tag is repeatable, accepts ' +
  'ADR-183 namespace [failure-mode, behaviour-note, heartbeat])';

export const commsReplyHelp =
  'comms reply --comms-dir <dir> --to-event-id <id> --kind <kind> ' +
  '(--body <body> | --body-file <path>) --platform <platform> --model <model> ' +
  '--active <path> [--subject <subject>] [--event-id <id>] [--now <iso>] [--tag <tag>...] ' +
  '(the reply threads to --to-event-id by construction — in_response_to is set ' +
  'from the resolved source and there is no --in-response-to on this verb; ' +
  '--body and --body-file are mutually exclusive; --body-file reads the file ' +
  'literally and bypasses shell interpretation; --tag is repeatable, accepts the ' +
  'ADR-183 namespace — a reply quoting a pathogen to correct it needs a capture ' +
  'tag to pass the comms concept gate, incl. when the inherited "re:" subject ' +
  'quotes one)';

export const claimsOpenHelp =
  'claims open --active <path> --thread <thread> ' +
  '--area-kind <files|workspace|plan|adr|git> ' +
  '--intent <text> --platform <platform> --model <model> ' +
  '[--file <path>...] [--area-pattern <pattern>...] [--claim-id <id>] ' +
  '[--ttl-seconds <n>] [--role <role>] [--now <iso>] ' +
  '(--now defaults to the current time when omitted — F-89) ' +
  '(use either repeatable --file or repeatable --area-pattern, not both; ' +
  'refuses to open into a populated registry while blind to comms — F-95 — ' +
  'unless this session has a live comms watcher at the canonical comms-seen ' +
  'location; solo sessions are exempt; no path override, by design)';

export const claimsHeartbeatHelp = 'claims heartbeat --active <path> --claim-id <id> --now <iso>';

export const claimsAdoptHelp =
  'claims adopt --active <path> --claim-id <id> --platform <platform> --model <model> ' +
  '(rewrites the claim agent_id to the adopting identity in place; PDR-063 pickup)';

export const claimsSetHandoffHelp =
  'claims set-handoff --active <path> --claim-id <id> --path <path> ' +
  '(records a handoff-record pointer under .agent/state/collaboration/handoffs/; PDR-063 step 3)';

export const claimsCloseHelp =
  'claims close --active <path> [--closed <path>] --claim-id <id> ' +
  '--summary <text> --now <iso> --platform <platform> --model <model> ' +
  '[--closure-summary <text> alias for --summary]';

export const claimsArchiveStaleHelp =
  'claims archive-stale --active <path> [--closed <path>] --now <iso> ' +
  '--platform <platform> --model <model>';

export const claimsListHelp = 'claims list --active <path> [--now <iso>]';

export const claimsMineHelp =
  'claims mine --active <path> --platform <platform> --model <model> [--now <iso>]';

export const claimsShowHelp = 'claims show --active <path> --claim-id <id> [--now <iso>]';

export const claimsStatusHelp = 'claims status --active <path> [--now <iso>]';

export const claimsActiveAgentsHelp =
  'claims active-agents --active <path> [--closed <path>] [--now <iso>]';

export const claimsWorkStateHelp =
  'claims work-state [--active <path>] [--closed <path>] [--comms-dir <dir>] [--now <iso>] ' +
  '[--repo-root <path>] (derived cross-worktree view: one row per git worktree, bound to its ' +
  'agent via the heartbeat branch, with claim intent and a last-seen recency that is ' +
  'INPUT-TO-VERIFY, not claim freshness; an agent on a branch with no matching worktree does not ' +
  'appear; --active/--comms-dir default to the coordination home)';

export const tuiHelp =
  'tui [--format <tui|text>] [--repo-root <path>] [--active <path>] ' +
  '[--closed <path>] [--comms-dir <dir>] [--now <iso>] [--poll-ms <n>]';

export const conversationAppendHelp = 'conversation append --file <path> --entry-json <json>';

export const escalationOpenHelp = 'escalation open --file <path> --body-json <json>';

export const escalationCloseHelp = 'escalation close --file <path> --body-json <json>';

export const checkHelp = 'check [--active <path>] [--closed <path>] [--comms-dir <dir>]';
