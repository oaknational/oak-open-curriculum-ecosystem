# Agent Tooling Frictions Register

Live capture of frictions, gaps, and observed failures in the agent tooling
substrate. Each entry has source citation, observed behaviour, expected
behaviour, candidate cure, target surface, and current status.

**This is a capture surface, not an execution plan.** Items mature into:

1. A line on a [`current/`](current/) or [`future/`](future/) plan when they
   fit existing scope, OR
2. A new [`current/`](current/) or [`future/`](future/) plan when they
   justify their own work item, OR
3. A direct fix when the cure is small and obvious enough to land in a peer
   plan's commit cycle.

Owner standing direction (Pelagic, event `2dbd74f6` 2026-05-05): *"any
friction with agent tooling should always be noted so the tooling and
documentation can be improved. This is always true, not just for today's
identity-wordlist work. Agents are both users and authors of the tooling, so
agent-observed friction is first-class user feedback."*

## How To Add an Entry

```markdown
### F-NN — Short title

- **Source**: napkin entry / comms event ID / session reference
- **Surface**: which CLI / file / workflow
- **Observed**: what happened
- **Expected**: what should have happened
- **Candidate cure**: smallest concrete change that resolves the friction
- **Target surface**: agent-tools CLI / docs / rule / plan / ADR / PDR
- **Status**: open / partially-addressed / mitigated / addressed-in-plan-X /
  addressed-in-working-tree-YYYY-MM-DD / addressed-in-existing-behaviour /
  superseded
- **Owner direction status**: standing / session-scoped / unsolicited
```

Keep entries terse. Long-form analysis belongs in the napkin or in a
dedicated plan that this entry points to.

---

## Friction Entries

Status lines are the disposition source of truth. Entries remain in this
section until a consolidation pass moves them; the addressed/mitigated section
below is a cross-reference index, not a second source of truth.

### F-01 — `comms send` rejects `--agent-name`

- **Source**: napkin 2026-05-05 (Deciduous Budding Stamen, `512682`)
- **Surface**: `pnpm agent-tools:collaboration-state -- comms send`
- **Observed**: First invocation failed with `unknown option:
  --agent-name`; identity for writes uses env
  (`PRACTICE_AGENT_SESSION_ID_CURSOR`, `OAK_AGENT_IDENTITY_OVERRIDE`) plus
  `--platform` and `--model`. Discoverability gap: agents reach for
  `--agent-name` because it is the human-meaningful field.
- **Expected**: Either accept `--agent-name` (resolve to seed/prefix) or
  print full help on the unknown flag naming the supported identity inputs.
- **Candidate cure**: Print full help on unknown flag (composes with F-09)
  AND name the supported identity inputs in the help text; consider
  accepting `--agent-name` as an alias resolved against the wordlist.
- **Target surface**: `agent-tools/src/collaboration-state/cli-comms-commands.ts`
- **Status**: addressed-in-working-tree-2026-05-10
- **Review 2026-05-10**: fixed in working tree. `comms send` help now
  names `PRACTICE_AGENT_SESSION_ID_CURSOR` and
  `OAK_AGENT_IDENTITY_OVERRIDE`, and unsupported identity-name flags
  return command help plus the specific unknown-option error.
- **Owner direction**: standing (full-help-on-invalid-flags, F-09)

### F-02 — `claims close` requires `--summary` not `--closure-summary`

- **Source**: napkin 2026-05-05 (Twilit/Ashen, `7cf730`) Surprise 7 (d);
  comms event `a1cf45a2` 2026-05-05
- **Surface**: `pnpm agent-tools:collaboration-state -- claims close`
- **Observed**: Required flag is `--summary`. Agents reach for
  `--closure-summary` (a more semantic name) and fail. Discoverability
  required source-grep to find.
- **Expected**: Help text exposes the canonical flag prominently; either
  rename to `--closure-summary` (more semantic) or accept both names.
- **Candidate cure**: Accept `--closure-summary` as an alias for
  `--summary`; full-help-on-invalid-flag (F-09) ensures next agent
  discovers the canonical name immediately.
- **Target surface**: `agent-tools/src/collaboration-state/cli-claim-commands.ts`
- **Status**: addressed-in-working-tree-2026-05-10
- **Review 2026-05-10**: fixed in working tree. `claims close` accepts
  `--closure-summary` as an alias for `--summary`, and help documents
  the alias.

### F-03 — `claims close` error names wrong option as missing

- **Source**: napkin 2026-05-05 (Dawnlit, `0ddc89`) Observation 4
- **Surface**: `pnpm agent-tools:collaboration-state -- claims close`
- **Observed**: First attempt failed with "missing required option
  --active" while passing `--active`; the actual culprit was the
  un-recognised `--kind closed` argument (closure kind is hardcoded to
  'explicit' in the implementation, not a CLI param). The error message
  named the wrong option as missing rather than naming the unknown
  option.
- **Expected**: Error message names the actually-unrecognised flag (e.g.
  *"unknown option: --kind"*) rather than reporting a downstream
  required-option failure.
- **Candidate cure**: CLI parser surfaces unknown-flag errors before
  required-flag-validation errors; full-help-on-invalid-flag (F-09)
  composes with this.
- **Target surface**: `agent-tools/src/collaboration-state/cli-options.ts`
  or shared CLI parser layer
- **Status**: addressed-in-existing-cli-validation
- **Review 2026-05-10**: addressed for the reported shape. The current
  parser rejects globally unknown flags before required-option validation,
  and `runCollaborationStateCli` has regression coverage for unknown
  options before missing required options.

### F-04 — `claims open` `--file` vs `--area-pattern` ambiguity

- **Source**: napkin 2026-05-05 (Twilit/Ashen, `7cf730`) Surprise 7 (e)
- **Surface**: `pnpm agent-tools:collaboration-state -- claims open`
- **Observed**: `--file` (singular, repeatable) vs `--area-pattern`
  (singular, only-when-no-files) shape is unclear from the help text
  alone; agents have to source-grep to understand the constraint.
- **Expected**: Help text states the cardinality and mutual-exclusion
  constraints in a single line per flag; an example shows both shapes.
- **Candidate cure**: Help-text amendment with cardinality, repeatability,
  and mutual-exclusion clearly stated; add canonical examples.
- **Target surface**: `agent-tools/src/collaboration-state/cli-claim-commands.ts`
  - `agent-tools/README.md`
- **Status**: addressed-in-working-tree-2026-05-10
- **Review 2026-05-10**: fixed in working tree. Command help states
  repeatability and mutual exclusion for `--file` and `--area-pattern`;
  `agent-tools/README.md` now includes canonical `claims open --file`
  and `claims open --area-pattern` examples.

### F-05 — `comms render` chokes on a single malformed event JSON

- **Source**: napkin 2026-05-05 (Twilit/Ashen, `7cf730`) Surprise 7 (f);
  observed during Gnarled's escape-sequence bug blocking
  `shared-comms-log.md` regeneration repo-wide
- **Surface**: `pnpm agent-tools:collaboration-state -- comms render`
- **Observed**: A single malformed `comms-events/*.json` file aborts the
  entire render, blocking shared-comms-log.md regeneration for every
  agent in the repo.
- **Expected**: Per-file recovery — log the malformed file, skip it, and
  render the rest; emit a non-zero exit with a clear error summary so the
  fault is visible without blocking the substrate.
- **Candidate cure**: `--skip-malformed` flag (default on) plus
  per-file try/catch with error summary at the end.
- **Target surface**: `agent-tools/src/collaboration-state/cli-comms-commands.ts`
- **Status**: open
- **Review 2026-05-10**: still open. `readCommsEvents` parses each JSON
  file directly in sequence; one parse or schema error still aborts the
  entire render.
- **Severity**: high (substrate-wide blocker when triggered)
- **Related shape**: 2026-05-06 (Hidden Slipping Moth, `4be7b5`) —
  `comms send` succeeded in writing the new event but then failed
  rendering because one older event
  (`cd25a954-f569-4f7b-8d1e-f1fe9eed5dd7.json`) used top-level
  identity fields instead of the current `author` object shape. This
  is the *legacy-schema* sibling of the malformed-JSON case: the
  file parses as JSON but does not conform to the current event
  schema. The `--skip-malformed` cure should extend to schema-shape
  mismatches, not only parse failures, with a migration warning
  surfacing the offending event path. Manual repair of the legacy
  event file unblocked this instance.

### F-06 — Build-on-each-CLI-invocation causes identity drift mid-session

- **Source**: napkin 2026-05-05 (Twilit/Ashen, `7cf730`) Surprise 3;
  user-memory `feedback_use_built_agent_tools_only.md`; comms disclosure
  `59feb7e5`
- **Surface**: `pnpm agent-tools:*` scripts in root `package.json`
- **Observed**: Every CLI invocation runs `pnpm -s build && node
  dist/...`. Mid-session, while another agent was refactoring
  `agent-tools/src/core/agent-identity/wordlists.ts` into per-group
  files, the same `--seed` reproducibly resolved to a different
  display name (Twilit Beaming Aurora → Ashen Banking Bellows, same
  `7cf730` prefix). Owner-stated cure: *"all agents use only the
  built agent tools, so that development work can happen on them
  without causing this issue again"*.
- **Expected**: Identity-derivation reads from a stable, owner-authorised
  built artefact; in-flight refactors do not propagate to live sessions
  until explicitly accepted.
- **Candidate cure**: (a) split `pnpm agent-tools:*` scripts into
  `:built` (no rebuild) and `:dev` (rebuild) variants; (b) prefer
  `:built` everywhere except deliberate development; (c) consider
  pinning identity-derivation against a versioned wordlist file or
  embedding the wordlist hash into the `agent_id` for traceability.
- **Target surface**: root `package.json` agent-tools scripts;
  `agent-tools/src/core/agent-identity/`
- **Status**: open
- **Review 2026-05-10**: still open. Root `agent-tools:*` scripts still
  delegate to workspace scripts whose operational CLIs rebuild before
  execution.
- **Owner direction**: standing
- **Related plan**: ties into `current/agent-infrastructure-portability-remediation.plan.md`

### F-07 — No `comms list/show` CLIs (no `comms watch` either)

- **Source**: napkin 2026-05-05 (Twilit/Ashen, `7cf730`) Surprise 7 (a)
  and (h); comms event `a1cf45a2`; owner aside *"I notice you are using
  Python to access the logs... if this indicates a lacking agent tooling
  tool, please make a note"*
- **Surface**: `agent-tools/src/collaboration-state/cli-comms-commands.ts`
- **Observed**: Throughout coordinator workflows, agents had to fall
  back to inline Python (`python3 -c 'import json; ...'`) to:
  - List comms-events newer than a timestamp filtered by author or
    audience
  - Read individual comms-event bodies
- **Expected**: Structured CLI affordances for these reads.
- **Candidate cure**: Add three commands:
  - `comms list [--since <iso>] [--audience <name|prefix>] [--from <name|prefix>]`
  - `comms show <event-id>`
  - `comms watch [--since <iso>] [--audience <name|prefix>]
    [--from <name|prefix>]` — optional non-blocking streaming layer for
    platforms with `Monitor`/background-shell support; pure-Node
    directory polling avoids OS-specific deps. Owner sharpening:
    *"if the polling and/or streaming can be non-blocking that could
    be a very powerful comms mechanism. It would have to be optional,
    so platforms that don't fully support background services or
    polling can still use the comms surfaces"*.
- **Asymmetric design**: substrate (JSON files) is portable; `comms
  list` is the always-available poll for non-streaming platforms;
  `comms watch` is the optional streaming layer.
- **Target surface**: `agent-tools/src/collaboration-state/cli-comms-commands.ts`
- **Status**: open
- **Review 2026-05-10**: still open. `comms append`, `send`, and
  `render` exist; `comms list`, `show`, and `watch` do not.
- **Owner direction**: standing

### F-08 — No `claims list/show` CLIs

- **Source**: napkin 2026-05-05 (Twilit/Ashen, `7cf730`) Surprise 7 (b);
  comms event `a1cf45a2`
- **Surface**: `agent-tools/src/collaboration-state/cli-claim-commands.ts`
- **Observed**: To find claims by `session_id_prefix`, by name, by
  thread, or by kind, agents have to grep + Python. Lifecycle visibility
  gap.
- **Expected**: Structured query commands.
- **Candidate cure**: Add:
  - `claims list [--prefix <p>] [--name <n>] [--thread <t>]
    [--kind files|git|workspace|...]`
  - `claims show <claim-id>`
- **Target surface**: `agent-tools/src/collaboration-state/cli-claim-query-commands.ts`
  (already exists per Fronded's bundle 33aeec40 — verify scope)
- **Status**: partially-addressed-in-33aeec40
- **Review 2026-05-10**: `claims list`, `claims show`, `claims mine`,
  and `claims status` exist. The requested list filters
  (`--prefix`, `--name`, `--thread`, `--kind`) are still absent.

### F-09 — Invalid flags MUST print FULL help

- **Source**: user-memory `feedback_agent_tool_help_on_invalid_flags.md`;
  napkin 2026-05-05 (Twilit/Ashen, `7cf730`) Surprise 7
- **Surface**: every agent-tools CLI
- **Observed**: Single-line error responses on invalid flags are
  insufficient — agents do not learn the canonical flag set without
  re-running with `--help`.
- **Expected**: Every CLI, on flag-validation failure, prints the FULL
  help text, then the specific error message.
- **Candidate cure**: Shared CLI helper that wraps the parser to emit
  full help on `unknown option`, `missing required option`, and
  `mutually-exclusive option` errors.
- **Target surface**: `agent-tools/src/core/cli/` (or wherever the
  shared CLI helper lives) — applied across all `agent-tools/src/*/cli*.ts`
- **Status**: addressed-for-collaboration-state-in-working-tree-2026-05-10
- **Review 2026-05-10**: fixed for the `collaboration-state` CLI in the
  working tree. Command-specific validation and handler errors now return
  full command help plus the specific error; other `agent-tools` CLIs
  still need the convention when their friction entries require it.
- **Owner direction**: standing
- **Recurrence**: 2026-05-06 (Clouded Lifting Aerie, `1e2244`) —
  `claims open` rejected my command three times in succession with
  one missing-required-option error each (`--platform`, then
  `--thread`, then `--area-kind`, then `--now`, then `--active`).
  Each rejection emitted a single-line error; full help only
  appeared after I asked `claims open --help` directly. Five
  round-trips to compose one valid invocation. F-09's cure
  (full-help-on-invalid-flag) would have surfaced the entire
  required-flag set on the first failure.

### F-10 — Identity routing should use (name, prefix) pair

- **Source**: napkin 2026-05-05 (Twilit/Ashen, `7cf730`) Surprise 3;
  user-memory `feedback_identity_routing_uses_name_and_prefix_pair.md`
- **Surface**: PDR-027 (Per-Session Identity), and any reader of
  `comms-events/`, `active-claims.json`, `commit_queue` entries
- **Observed**: Names can change within a session (wordlist refactor;
  derive bug; explicit rename). Prefixes are stable for a session but
  not 1:1 with names. Routing solely by name produces wrong-recipient
  events; routing solely by prefix loses the human-readable signal.
- **Expected**: Treat `(agent_name, session_id_prefix)` as the routing
  key. Name mismatches with the same prefix are information signals
  (drift) not errors. Prefix mismatches with the same name are
  cross-session continuity.
- **Candidate cure**: PDR-027 amendment naming the pair-keying;
  collaboration-state code uses both fields when matching; tools surface
  drift as a distinct signal class.
- **Target surface**: `.agent/practice-core/decision-records/PDR-027-*.md`
  amendment; `agent-tools/src/collaboration-state/state-io.ts` matchers
- **Status**: open (PDR amendment candidate)
- **Review 2026-05-10**: still open. `sameAgent`-based ownership checks
  exist for `claims mine`; no broader documented pair-key routing model
  has landed here.
- **Owner direction**: standing

### F-11 — No `commit-queue list/show` CLIs

- **Source**: napkin 2026-05-05 (Twilit/Ashen, `7cf730`) Surprise 7 (c);
  comms event `a1cf45a2`
- **Surface**: `agent-tools/src/commit-queue/cli.ts`
- **Observed**: Agents need to inspect queue entries by agent or status
  to coordinate around the index/head commit window; no CLI affordance
  exists for this.
- **Expected**:
  - `commit-queue list [--prefix <p>]
    [--phase <queued|staging|pre_commit|abandoned>]
    [--agent-name <agent-name-prefix>]
    [--queue-status <active|expired|abandoned>]`
  - `commit-queue show --intent-id <intent-id>`
  - Completed intents leave the active queue and are not filterable by
    lifecycle phase.
- **Candidate cure**: Add the two commands above.
- **Target surface**: `agent-tools/src/commit-queue/cli.ts`
- **Status**: addressed-in-working-tree-2026-05-11
- **Review 2026-05-10**: `commit-queue status` exists and emits the
  machine-readable queue with entries. Dedicated `list` / `show`
  commands and `--prefix` / `--phase` filters are still absent.
- **Review 2026-05-11**: fixed in working tree. `commit-queue list`
  emits filtered queue entries with `--prefix`, `--phase`,
  `--agent-name`, and `--queue-status` filters, while
  `commit-queue show --intent-id <id>` emits one exact entry and fails
  clearly for an unknown intent. `commit-queue status` remains the
  aggregate view.

### F-12 — `claims open --area-kind` accepted values not discoverable

- **Source**: napkin 2026-05-05 (Deep Rolling Archipelago, `02f5f5`) Surprise
  on PR-93 PR-description claim attempt with `--area-kind external`; second
  worked instance Riverine Fishing Rudder (`b89da0`) 2026-05-05 reaching for
  `--area-kind file` (singular) before discovering the canonical value is
  `files` (plural)
- **Surface**: `pnpm agent-tools:collaboration-state -- claims open`
- **Observed**: Help text shows `--area-kind <kind>` without enumerating the
  accepted values. Agents reach for intuitive shapes (`external`, `file`,
  `shared-state`) and hit `unsupported area kind: <value>` without any hint
  of the canonical set. Discovery requires source-grep against
  `parseAreaKind` in
  `agent-tools/src/collaboration-state/cli-claim-commands.ts`. The accepted
  set is `files | workspace | plan | adr | git`.
- **Expected**: Help text enumerates accepted `--area-kind` values inline.
  Error path on unsupported value lists the accepted set.
  Full-help-on-invalid-flag (F-09) composes with this.
- **Candidate cure**: Inline enumeration in CLI help (e.g.
  `--area-kind <files|workspace|plan|adr|git>`) AND on-error message that
  lists accepted values. Same pattern applies to other closed enums in
  `cli-options.ts` — generalise as a discoverability convention.
- **Target surface**: `agent-tools/src/collaboration-state/cli-claim-commands.ts`
  and `cli-options.ts`
- **Status**: addressed-in-working-tree-2026-05-10
- **Review 2026-05-10**: fixed in working tree. `claims open` help now
  enumerates `--area-kind <files|workspace|plan|adr|git>`, and the
  unsupported-kind error lists the accepted values.
- **Owner direction**: standing (full-help-on-invalid-flags, F-09)

### F-13 — `comms send` does not print event-id and path on success

- **Source**: comms event `bdf1c973` (Vining Growing Meadow, `92cb10`,
  2026-05-05 session-close note); reaffirmed 2026-05-05 by
  Riverine Fishing Rudder (`b89da0`) needing `ls -lt comms-events/` to
  confirm landing
- **Surface**: `pnpm agent-tools:collaboration-state -- comms send`
- **Observed**: Successful invocation produces no observable confirmation
  that the event was written or where. Agents fall back to listing the
  events directory by mtime to verify the write landed. Failure messages
  are also frequently truncated by the shell pipeline (echo of long --body
  argument visually consumes the error tail).
- **Expected**: A single line on success printing the event id and the
  written path, e.g. `Wrote event <event_id> to <events_dir>/<event_id>.json`.
  Owner-flagged shape suggested at session close: discoverability of write
  outcome should be loop-closing.
- **Candidate cure**: Print the success line. Composes with F-09 (full
  help on invalid flags) and the broader CLI-discoverability theme.
- **Target surface**: `agent-tools/src/collaboration-state/cli-comms-commands.ts`
- **Status**: addressed-in-working-tree-2026-05-10
- **Review 2026-05-10**: fixed in working tree. `sendComms` returns
  structured JSON containing `event_id`, `event_path`, and
  `shared_log_path`.

### F-14 — `claims open` silently overwrites repeated `--area-pattern`

- **Source**: napkin 2026-05-06 (Masked Stalking Veil, `019dfc`);
  owner correction after session closeout: manual claim edits are tooling
  friction and need preservation.
- **Surface**: `pnpm agent-tools:collaboration-state -- claims open`
- **Observed**: A closeout claim was opened with six repeated
  `--area-pattern` flags. The command succeeded and printed a claim, but
  the authored claim retained only the final pattern
  (`.agent/state/collaboration/comms-events`). The earlier five patterns
  were silently overwritten, so the coordination record understated the
  files being touched. I manually edited `active-claims.json` to restore
  the intended pattern list before proceeding.
- **Why it happened**: the CLI presents `--area-pattern <pattern>` as an
  option but does not make its cardinality explicit. I assumed it behaved
  like other repeatable path flags (`--file`). The option parser appears
  to store `area-pattern` as a scalar value, so repeated occurrences use
  last-write-wins semantics rather than accumulating. Because the command
  exits 0, this is easy to miss unless the agent inspects the emitted JSON.
- **Expected**: Either repeated `--area-pattern` accumulates all supplied
  patterns, or the CLI rejects multiple occurrences with an explicit error
  and help text. Silent last-write-wins is the unsafe shape because it
  produces plausible but incomplete coordination state.
- **Candidate cure**: Treat `--area-pattern` as repeatable in the parser
  and tests, mirroring `--file`; update help text to state cardinality
  (`repeatable`) and include a multi-pattern example. If single-pattern is
  intentional, add duplicate-flag detection that exits non-zero and prints
  the supported shape. Add a regression test asserting multi-pattern claim
  creation preserves every supplied pattern.
- **Target surface**: `agent-tools/src/collaboration-state/cli-options.ts`;
  `agent-tools/src/collaboration-state/cli-claim-commands.ts`;
  `agent-tools/tests/collaboration-state/collaboration-state.unit.test.ts`
- **Status**: addressed-in-working-tree-2026-05-10
- **Review 2026-05-10**: fixed in working tree by adding repeatable
  `areaPatterns` parsing, exact-one validation for `--file` vs
  `--area-pattern`, help text that states repeatability/mutual exclusion,
  and regression coverage for both repeated-pattern preservation and mixed
  source rejection. `agent-tools/README.md` now includes a multi-pattern
  `--area-pattern` example.
- **Landing trigger**: after commit, replace this working-tree status with
  `addressed-in-<commit-sha>`.
- **Owner direction**: standing (agent-tooling friction is first-class user
  feedback)
- **Recurrence**: 2026-05-06 (Clouded Lifting Aerie, `1e2244`) — same
  shape reproduced cleanly. Six `--area-pattern` flags supplied to
  `claims open`; the persisted claim retained only the final pattern
  (`.agent/state/collaboration/**`). The first five patterns were
  silently overwritten. Manual edit of `active-claims.json` restored
  the intended pattern list. Confirms F-14 is still unmitigated; the
  cure ("treat `--area-pattern` as repeatable, mirroring `--file`")
  remains the right shape and is worth prioritising — every
  multi-area claim opener pays the manual-repair tax.
- **Recurrence**: 2026-05-07 (Embered Roasting Flame, `019e03`) —
  reproduced again while opening the Sonar remediation claim. Four
  repeated `--area-pattern` flags were supplied; the persisted claim
  retained only the final pattern (`.agent/state/collaboration/**`).
  Manual edit of `active-claims.json` restored the missing
  `packages/sdks/oak-sdk-codegen/**`, `packages/core/oak-eslint/**`,
  and thread-record patterns. Owner direction in-session: log this as a
  bug to fix.

### F-15 — Commit-queue fingerprint recursion when claim file is in staged set

- **Source**: napkin 2026-05-06 (Hidden Slipping Moth, `4be7b5`),
  Surprise 2 — observed during the
  no-moving-targets rule extension commit attempt.
- **Surface**: `pnpm agent-tools:commit-queue -- record-staged` /
  `verify-staged` interaction with `.agent/state/collaboration/active-claims.json`
  when active-claims.json is itself part of the staged bundle (which
  it must be, because the queue entry lives there).
- **Observed**: The commit-skill protocol
  (claim → enqueue → stage → record-staged → verify-staged → commit)
  fails to converge when active-claims.json is in the staged set.
  `record-staged` writes `staged_bundle_fingerprint` into the
  working-tree active-claims.json, creating an `MM` split (staged
  content has no fingerprint; working-tree has one). Re-staging
  active-claims.json to "include the fingerprint" then breaks
  `verify-staged` because the staged content now differs from what
  was hashed. Every record-staged + re-stage iteration shifts the
  fingerprint; the loop never converges.
- **Workflow that works**: stage all files including active-claims.json
  with the queue entry but no fingerprint. Run `record-staged` once.
  Do NOT re-stage active-claims.json afterwards. `verify-staged`
  reads the fingerprint from working-tree and recomputes from staged;
  they match because staged has not moved. Commit; the fingerprint
  never needs to land in history.
- **Why it happened**: The fingerprint is a hash of staged content
  written into a file that is itself staged. The protocol design
  assumes the fingerprint can be recorded after staging, but the
  obvious "record then re-stage to capture the recording" loop is
  the trap, because re-staging the recording invalidates the
  recorded value.
- **Expected**: Either (a) the fingerprint lives outside the staged
  bundle (separate state file or external store), or (b) the
  commit-queue tooling explicitly documents the "stage → record →
  do not re-stage" contract in the SKILL body and CLI help, with a
  guard that detects re-staging of active-claims.json after
  record-staged and warns.
- **Candidate cure**: (a) refactor fingerprint storage to a sibling
  file (`active-claims.fingerprint`) that is gitignored or carries
  its own claim-window discipline; (b) failing that, add explicit
  protocol documentation in `.agent/skills/commit/SKILL-CANONICAL.md`
  Pre-Commit Validation section and a CLI warning in `verify-staged`
  if active-claims.json shows `MM` after `record-staged`.
- **Target surface**: `agent-tools/src/commit-queue/`;
  `.agent/skills/commit/SKILL-CANONICAL.md`; commit-queue CLI help
  text.
- **Status**: open
- **Review 2026-05-10**: still open. `record-staged` still writes the
  fingerprint into the registry entry and `verify-staged` still verifies
  against staged content; no sibling fingerprint store or `MM` guard is
  present.
- **Severity**: high (every commit that includes active-claims.json
  in its staged bundle hits this; the workflow-that-works is not
  documented anywhere agents would find it before failing)
- **Related**: this is sibling to F-12 (area-kind values not
  discoverable) and F-13 (event-id not surfaced) — all three are
  *protocol-self-modifies-its-state-file* recursion shapes that the
  current tooling exposes without protocol-level documentation.

### F-16 — Skills/commands surface sprawl across five vendor adapter trees

- **Source**: 2026-05-09 owner direction; primary-source verification of
  agent-skills.io spec + per-vendor docs (Claude Code, Cursor, Codex,
  Gemini CLI); inventory of `.agent/skills/` (37 canonical),
  `.agents/skills/` (47 — 37 dups + 10 mis-shaped `jc-*` command-as-skill
  entries), `.cursor/skills/` (37), `.claude/skills/` (37), plus 12
  canonical commands with mirrored adapters (10 in `.claude/`, 10 in
  `.cursor/`, 29 in `.gemini/` due to `review-*` fan-out)
- **Surface**: `.agent/skills/`, `.agent/commands/`, all `<platform>/skills/`,
  all `<platform>/commands/`; `pnpm portability:check`
- **Observed**: Single canonical skill body lives at the same filename
  as discoverable adapters, causing duplicate registrations on
  platforms that scan multiple paths. Five adapter surfaces emit
  per-platform copies that drift over time. Custom commands are a
  parallel surface that duplicates skills. Manual edits to adapters
  occur to clear validation issues, propagating drift.
- **Expected**: One canonical source of truth (non-discoverable
  filename, non-discoverable directory), exactly the two adapter
  surfaces every documented platform requires
  (`.agents/skills/` + `.claude/skills/`), generated deterministically
  with no manual edits, with commands subsumed into the skills surface.
- **Candidate cure**:
  [`current/skills-standardisation-and-adapter-generator.plan.md`](current/skills-standardisation-and-adapter-generator.plan.md) —
  PDR-051 doctrine, ADR-125 amendment, generator CLI, validator
  extension, mass migration, custom command retirement.
- **Target surface**:
  [PDR-051](../../practice-core/decision-records/PDR-051-vendor-agnostic-skills-standardisation.md),
  [ADR-125 (amended 2026-05-09)](../../../docs/architecture/architectural-decisions/125-agent-artefact-portability.md),
  `agent-tools/src/skills-adapter-generate/`,
  `scripts/validate-portability.ts`,
  `docs/engineering/skills-adapter-generation.md`.
- **Status**: addressed-in-plan-skills-standardisation-and-adapter-generator
- **Review 2026-05-10**: no status change. The entry already routes to
  the skills standardisation plan; this pass did not re-scope that work.
- **Owner direction**: standing — pre-requisite for top-quality agent work

---

## Mitigated / Addressed Frictions

- F-03 — addressed by current CLI validation ordering.
- F-14 — addressed in the 2026-05-10 working tree; replace with commit
  SHA after landing.

---

## Cross-Cutting Themes

These run across multiple individual frictions and may justify their own
plan if the pattern continues:

1. **Discoverability** (F-01, F-02, F-04, F-09, F-12, F-13): agents repeatedly
   reach for semantic flag names that don't exist; full-help-on-invalid
   (F-09) is the structural cure for the whole class.
2. **Read-side CLI gaps** (F-07, F-08, F-11): the substrate has some
   read-side coverage (`claims list/show/mine/status`,
   `commit-queue status`) but agents still lack filtered list/show/watch
   affordances and fall back to Python for narrower reads.
3. **In-flight refactor isolation** (F-06): development changes to
   agent-tools should not propagate to live sessions without explicit
   acceptance; this is a build/release boundary issue, not a CLI issue.
4. **Identity as a first-class concept** (F-10): name, prefix, seed,
   wordlist version — these need a single coherent identity model that
   tools can rely on.
5. **Scalar-vs-repeatable flag ambiguity** (F-04, F-12): when path
   or enum flags are visually similar but differ in repeatability,
   agents infer behaviour from neighbouring flags. Help text and parser
   semantics need to make cardinality impossible to miss.

---

## Routing Notes

Items in this register that mature into their own plans should be moved
into the appropriate lifecycle directory:

- Concrete CLI/code changes → [`current/`](current/) executable plan
  (often a workstream addition to existing collaboration-state plans)
- Standalone tooling capability → [`future/`](future/) strategic brief
- PDR/ADR amendments → not handled here; the PDR/ADR sits in
  `.agent/practice-core/decision-records/` or
  `docs/architecture/architectural-decisions/`. This register tracks the
  candidate trigger only.

When an item is addressed by a commit, update its `Status` line with the
commit SHA and the closing plan reference.
