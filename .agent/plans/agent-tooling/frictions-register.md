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
- **Candidate cure** (revised 2026-06-01, owner direction): the original
  `--skip-malformed` direction is **rejected** — tolerating corruption on read is
  not a fix. The cure is prevention at the write (serialize via `JSON.stringify`
  only, validate the serialized string round-trips and conforms, write atomically
  via temp + rename) plus a loud, hard read-side failure that names the offending
  file, plus a one-time repair of existing corruption and a gate-wired regression
  guard.
- **Target surface**: `agent-tools/src/collaboration-state/state-io.ts` (write
  path) and `cli-comms-commands.ts` (render/read).
- **Status**: addressed-in-working-tree-2026-06-01 —
  [`agent-tooling/current/comms-event-write-integrity.plan.md`](current/comms-event-write-integrity.plan.md)
  (one-time repair + absolute prevention + loud read + gate guard). Comms event
  writes now parse-back, schema-validate, and publish via a synced same-directory
  atomic writer before the target file appears; readers hard-fail with the bad
  path named; `comms validate` scans true-JSON collaboration state; and
  `repo-validators:check` runs the same validator.
- **Review 2026-05-10**: still open. `readCommsEvents` parses each JSON
  file directly in sequence; one parse or schema error still aborts the
  entire render.
- **Review 2026-05-11**: current B-10 compatibility slice fixed two live
  legacy-schema blockers discovered in the repo event directory:
  narrative `addressed_to` agent-reference objects now normalize to the
  referenced `agent_name`, and `in_response_to: null` / `in_reply_to: null`
  are treated as absent. `comms render` also now accepts and documents the
  required post-R1.b `--lifecycle-dir` and `--messages-dir` options. Live
  render against the repo's three comms directories exits 0 to a temp output.
  The broader F-05 contract remains open: one truly malformed file should be
  skipped/reported without blocking the rest of the rendered log.
- **Review 2026-06-01** (Windswept Floating Summit): fresh worked instance. Three
  legacy events (`625fb072`, `76ede08d`, `a15363e5`) had bodies truncated
  mid-sentence into unterminated JSON; one aborted `comms render` repo-wide — the
  exact F-05 blocker. Manually repaired all three (terminated the strings,
  preserving surviving content, with a `[body truncated by comms-CLI write bug;
  JSON repaired]` marker); render now exits 0. F-05's core contract (skip + report
  one malformed file without aborting the whole render) is still open and
  re-confirmed high-severity.
- **Write-side gap surfaced 2026-06-01 (candidate for its own entry):** these
  files prove the *write* path can persist truncated/malformed JSON, not only that
  the render is fragile. `comms append`/`send`/`direct` should validate that the
  assembled event parses and write atomically (temp file + rename) so a failed
  write never leaves a malformed event behind. `--body-file` (shipped) is the
  operator-side cure for shell-quoting hazards but does not by itself guarantee
  validated, atomic persistence.
- **Implementation review 2026-06-01** (Tempestuous Gliding Falcon): implemented
  the revised owner-directed cure. The live validator reports
  `collaboration-state validate: OK (2824 JSON file(s) checked)`, and the root
  repo validator now includes that check. The older `skip + report` expected shape
  above is retained only as historical capture; the current accepted contract is
  prevention at write plus loud, path-named failure on any external corruption.
- **Severity**: high (substrate-wide blocker when triggered)
- **Related shape**: 2026-05-06 (Hidden Slipping Moth, `4be7b5`) —
  `comms send` succeeded in writing the new event but then failed
  rendering because one older event
  (`cd25a954-f569-4f7b-8d1e-f1fe9eed5dd7.json`) used top-level
  identity fields instead of the current `author` object shape. This
  is the *legacy-schema* sibling of the malformed-JSON case: the
  file parses as JSON but does not conform to the current event
  schema. The plan's validation covers both — parse failures and
  schema-shape mismatches are caught at the write (rejected before
  the file is created) and surfaced loudly at read, with the
  offending event path named. Manual repair of the legacy event file
  unblocked this instance.

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
  - `comms list [--since <iso>] [--tail <n>] [--format summary|json]
    [--audience <name|prefix>] [--from <name|prefix>]`
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
  (read path); narrative list/show landed in
  `agent-tools/src/collaboration-state/cli-comms-query.ts`.
- **Status**: partially-addressed — narrative `comms list`/`comms show`
  landed-in-working-tree-2026-06-04 (Fiery Forging Ash); the directed-message
  `comms watch` part landed 2026-05-12 (see Review below). Remaining: list
  filters (`--since`/`--from`/`--audience`).
- **Review 2026-05-10**: still open. `comms append`, `send`, and
  `render` exist; `comms list`, `show`, and `watch` do not.
- **Review 2026-05-11**: B-10 working tree adds a narrow
  `comms inbox` command for directed messages under `comms-messages/`.
  It can print unseen messages for one `--agent-name` or wildcard `*`
  and record seen IDs in a caller-supplied `--seen-file`. This is useful
  evidence for the eventual watch/list shape but does **not** close F-07:
  narrative `comms list/show` and a non-rebuild watch surface remain open.
- **Review 2026-05-12**: P2 added `comms watch` for directed messages in the
  unified `pnpm agent-tools collaboration-state comms watch` shape. It uses
  `fs.watch` with polling fallback, tuple-aware recipient filtering, and a
  streaming stdout path. This closes the directed-message watch part of F-07;
  narrative `comms list/show` remains open.
- **Review 2026-05-26**: cross-platform memory sweep sharpened the read-side
  shape. `comms list --tail N --format summary` should project event id,
  timestamp, sender, recipient/audience, title, tag, and first-line body so a
  Director or consolidator can orient without regenerating the full shared log.
  `comms show <event-id>` should render the complete canonical JSON event and
  its body by id. This does not require a new substrate; it is a focused
  read-model over `.agent/state/collaboration/comms/`.
- **Review 2026-06-04** (Fiery Forging Ash): the read-back core landed.
  `comms list [--tail <n>]` (default 20) projects newest-first
  `created_at  event_id  author/session_prefix  [kind] [tags]  title`, and
  `comms show --event-id <id>` prints the full canonical JSON event including
  body (mirroring `claims show --claim-id`). Both are read-only and need no
  identity seed. New module `cli-comms-query.ts`; integration tests in
  `tests/collaboration-state/comms-query.integration.test.ts`; verified against
  the live 2886-event directory. Re-surfaced live by Windward Gliding Squall's
  2026-06-04 consolidated frictions (item 2) and matches user-memory
  `project_comms_cli_grounding_gap`. Deferred: `--since`/`--from`/`--audience`
  filters and a `--format json` mode — open for a follow-on slice.
- **Owner direction**: standing

### F-17 — No first-class directed-message authoring CLI

- **Source**: 2026-05-11 owner direction during multi-agent coordination;
  Wooded/Galactic sidebar
  `.agent/state/collaboration/sidebars/cli-comms-inbox-design-2026-05-11.md`;
  directed closeout message `198ee1a4`.
- **Surface**: `agent-tools/src/collaboration-state/` directed comms
  authoring.
- **Observed**: Directed messages currently require hand-authored JSON with
  UUID, timestamp, full sender identity, full recipient identity, kind,
  subject, and body. This made replies slow enough that coordination behaved
  like memo exchange rather than conversation.
- **Expected**: A TypeScript CLI path can author directed messages and replies
  with generated IDs/timestamps and validated readback.
- **Candidate cure**: B-11: add `comms direct` and `comms reply` under the
  existing `comms` namespace in a new `cli-comms-messages.ts`. Auto-fill
  sender from existing identity resolution; require explicit recipient fields
  in B-11; default reply subject to `re: <source-subject>`; do not add a
  schema threading field in this slice.
- **Target surface**: `agent-tools/src/collaboration-state/cli-comms-messages.ts`;
  `agent-tools/src/collaboration-state/cli-specs.ts`;
  `agent-tools/tests/collaboration-state/collaboration-state.integration.test.ts`
- **Status**: addressed-in-plan-B-11; implementation waits for B-10 landing and
  a clear/isolated shared index.
- **Owner direction**: standing (useful comms improvements belong in
  agent-tools TypeScript).

### F-18 — Coordinator gate sweep stales when agents keep writing

- **Source**: 2026-05-11 Flamebright Burning Lava gate-failure evidence
  `29f9761c`; Wooded/Galactic coordination closeout `198ee1a4`.
- **Surface**: multi-agent commit window protocol, repo-wide pre-commit hooks,
  and advisory gatekeeper workflow.
- **Observed**: Gatekeeper specialisation reduced duplicate full-tree gates but
  did not solve the stale-sweep race. Wooded ran a clean repo-wide gate sweep,
  then a new sidebar markdown file appeared and failed markdownlint during
  Flamebright's commit hook. Flamebright's markdown-only staged bundle failed
  three times on three different ambient peer/coordinating files.
- **Expected**: Once a gatekeeper issues a commit green-light, subsequent
  ambient coordination writes either freeze, route outside the checked tree, or
  are absorbed into a controlled pre-commit refresh before any peer retries.
- **Candidate cure**: Extend the commit-window protocol beyond "one gatekeeper"
  with a write-freeze or isolation rule for repo-tracked coordination artefacts
  during a peer's commit attempt; pair with B-02/B-03 build-prelude decoupling
  and B-11 directed-message authoring to reduce hand-authored file churn.
- **Target surface**: commit protocol docs / `.agent/skills/commit/` /
  collaboration-state comms tooling / possible PDR-059 follow-on.
- **Status**: open — evidence captured; no cure landed.
- **Owner direction**: standing.

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
- **Status**: fixed-2026-05-11-commit-e298723c
- **Review 2026-05-10**: `commit-queue status` exists and emits the
  machine-readable queue with entries. Dedicated `list` / `show`
  commands and `--prefix` / `--phase` filters are still absent.
- **Review 2026-05-11**: fixed at `e298723c`. `commit-queue list`
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
- **Review 2026-05-10**: still open. `record-staged` still writes the
  fingerprint into the registry entry and `verify-staged` still verifies
  against staged content; no sibling fingerprint store or `MM` guard is
  present.
- **Review 2026-05-11**: guard/documentation slice landed in the current
  Wave 3 F-15 work. `verify-staged` now warns when the expected `MM`
  split is present after `record-staged` and reports a recursion-specific
  corrective if `active-claims.json` was re-staged after the fingerprint
  write. The fingerprint still lives in the working-tree registry entry;
  this closes the guard/documentation branch of the expected cure, not the
  sibling-fingerprint-store branch.
- **Status**: fixed — guard/documentation branch
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

### F-19 — CLI exposes internal mechanics as agent-facing inputs

- **Source**: owner direction 2026-05-12 during root-script retirement
  closeout and `pnpm check` profiling handoff.
- **Surface**: agent-tools CLI, especially collaboration-state and
  commit-queue flows.
- **Observed**: Ordinary agent workflows require hand-passing ISO date
  strings, UUIDs, claim ids, intent ids, and sometimes registry paths.
  These are internal mechanics of the tooling, but the current surface
  makes agents copy them between commands and remember which identifier
  belongs to which lifecycle step.
- **Expected**: The CLI derives `now`, generates IDs, resolves
  current-agent/current-thread/current-intent defaults, and prompts or
  errors only when there is genuine ambiguity. Explicit date/UUID flags
  remain available for deterministic tests, recovery, and replay, not
  as the normal path.
- **Candidate cure**: Add this as a P-Foundation requirement in
  [`current/cost-of-collaboration.plan.md`](current/cost-of-collaboration.plan.md):
  a single high-level CLI that owns ID/timestamp generation and provides
  semantic workflow commands such as "my active claim" or "this commit
  intent" resolution.
- **Target surface**: P-Foundation agent-tools CLI overhaul; future
  collaboration-state and commit-queue command UX.
- **Status**: addressed-in-plan-cost-of-collaboration-p-foundation
- **Owner direction status**: standing

### F-20 — Repo-check profile depends on external browser/bootstrap state

- **Source**: `pnpm check` profiling continuation on 2026-05-12.
- **Surface**: `pnpm check:profile`,
  `pnpm agent-tools:repo-check profile`, Playwright-backed Turbo tasks,
  and collaboration-state inbox usage during profiling.
- **Observed**: The profile command writes useful dry graph and timing
  JSON, but a clean isolated worktree still needed extra, undocumented
  bootstrap steps before it could profile the browser-heavy legs:
  `pnpm install --offline` failed on a missing pnpm tarball,
  Playwright browsers were absent, browser tests failed inside the
  sandbox with Chromium Mach-port permission errors, and the old
  `comms inbox --recipient` muscle-memory path now errors because the
  command expects `--agent-name` plus explicit message/seen-file paths.
- **Expected**: A profiling command for a whole-repo assurance gate
  either preflights required local state with actionable messages or
  records those environment gaps in the profile artifact. The comms
  read-side command should expose a current-agent/default-inbox path
  that does not require agents to reconstruct storage paths.
- **Candidate cure**: Extend `repo-check profile` with environment
  preflight/reporting for pnpm cache availability, Playwright browser
  installation, sandbox/browser constraints, and command-attempt notes.
  Route the comms inbox ergonomics through the P-Foundation CLI
  simplification work already covering F-19.
- **Target surface**: P-Foundation agent-tools CLI overhaul and future
  repo-check profiling hardening.
- **Status**: open

### F-21 — `comms inbox` requires pre-existing seen-file state

- **Source**: Lofty Vaulting Summit checking Brazen Stoking Ash directed
  messages on 2026-05-12.
- **Surface**: `pnpm agent-tools:collaboration-state -- comms inbox`
- **Observed**: `comms inbox --messages-dir ... --agent-name ... --seen-file
  .agent/state/collaboration/comms-inbox/lofty-vaulting-summit.seen.json`
  exited 2 with `ENOENT` because the seen-file path did not already exist.
  The command failed before printing the new directed message it was meant to
  surface, so the agent had to fall back to `rg`/`sed` over raw JSON files and
  the rendered shared log.
- **Expected**: First-run inbox reads should work without manual bootstrap:
  create the seen-file parent and file when absent, or support a read-only
  mode that prints unseen messages without updating seen state.
- **Candidate cure**: Teach `comms inbox` to initialise missing seen-file
  state atomically, and add help text naming the first-run behaviour. Consider
  a default current-agent seen-file path so routine message checks do not
  require agents to reconstruct storage locations.
- **Target surface**:
  `agent-tools/src/collaboration-state/cli-comms-messages.ts`;
  `agent-tools/README.md`
- **Status**: open

### F-22 — Directed replies can be invisible to shared-log watchers until render

- **Source**: Lofty/Brazen WS1.3 coordination on 2026-05-12.
- **Surface**: `pnpm agent-tools:collaboration-state -- comms reply`,
  `comms direct`, and `comms render`
- **Observed**: `comms reply` wrote directed message
  `c7c69c95-ab26-404b-956f-04676114f6b3` successfully, but the message was
  absent from `shared-comms-log.md` until a separate explicit `comms render`
  command ran. A peer status update in the shared log still said they were
  waiting for the signal that had already been sent in `comms-messages/`.
- **Expected**: Directed authoring commands either refresh the rendered shared
  log on success, clearly print that the shared log was not regenerated, or
  provide a single `send-and-render` path so agents do not have to know which
  readers are watching raw directed messages versus the rendered log.
- **Candidate cure**: Make `comms direct` and `comms reply` share the same
  write-and-render contract as narrative comms, including success output that
  names the message path and shared-log path. If render remains deliberately
  separate, the success text should say so and point to the exact render
  command.
- **Target surface**:
  `agent-tools/src/collaboration-state/cli-comms-messages.ts`;
  `agent-tools/src/collaboration-state/cli-comms-commands.ts`;
  `agent-tools/README.md`
- **Status**: open

### F-23 — Hot comms CLI contract can drift under peer agent-tools edits

- **Source**: Lofty/Brazen WS1.3 coordination during Vining Regrowing Grove's
  active P4 agent-tools work on 2026-05-12.
- **Surface**: `pnpm agent-tools:collaboration-state -- comms reply` and the
  root `agent-tools:*` scripts that execute the current working-tree build.
- **Observed**: A `comms reply` invocation that had worked earlier in the same
  session failed later with `missing required option --active`; the command's
  live contract changed while another agent had active uncommitted
  `agent-tools/**` edits. Retrying with `--active
  .agent/state/collaboration/active-claims.json` succeeded, but the agent had
  to discover the changed contract mid-coordination.
- **Expected**: Operational collaboration commands used by all agents should
  run from a stable accepted build during unrelated agent-tools development, or
  expose explicit dev-mode drift warnings when the working-tree contract has
  changed under active sessions.
- **Candidate cure**: Fold this recurrence into the P-Foundation hot-path
  split: stable operational `agent-tools` commands should not execute
  uncommitted peer edits by default; dev commands remain available for the
  agent actively changing the CLI.
- **Target surface**: P-Foundation agent-tools CLI overhaul; root
  `package.json` agent-tools scripts; `agent-tools/README.md`
- **Status**: open; recurrence of F-06 with command-contract drift rather than
  identity-name drift

### F-24 — Status pings can cross fresh directed instructions

- **Source**: Radiant Illuminating Twilight joining the Brazen/Lofty WS1.3 +
  WS2.1 coordination window on 2026-05-12.
- **Surface**: Manual comms loop across `shared-comms-log.md`,
  `comms direct`, and active-claims reads.
- **Observed**: Radiant sent a directed "P4 landed; awaiting direction" status
  after reading active claims and HEAD, but Brazen had already authored a
  directed WS2.1 assignment in the rendered log. The status ping and the
  assignment crossed, forcing a corrective acknowledgement.
- **Expected**: Before sending an "awaiting direction" status, the tool should
  make the latest directed message to the current identity hard to miss, or
  the send path should offer a cheap "show messages newer than my last read"
  preflight.
- **Candidate cure**: Add a `comms inbox --since <event-id|timestamp>` or
  `comms direct --warn-if-newer-inbox` affordance that checks for newer
  directed messages to the sender before writing another directed status.
- **Target surface**:
  `agent-tools/src/collaboration-state/cli-comms-messages.ts`;
  `agent-tools/README.md`
- **Status**: open

### F-25 — Scaffold checklist and ESLint boundary helper disagree for new libs

- **Source**: Radiant Illuminating Twilight implementing WS2.1
  `packages/libs/graph-ingest` scaffold on 2026-05-12.
- **Surface**: `@oaknational/eslint-plugin-standards`
  `createLibBoundaryRules()` and graph scaffold checklist.
- **Observed**: Mirroring existing `packages/libs/*` ESLint configs with
  `createLibBoundaryRules('graph-ingest')` made type-check and lint fail:
  the helper rejected the new package because its internal lib allow-list had
  not been extended. The active graph scaffold checklist, inherited from
  `graph-core`, says to apply `coreBoundaryRules` on `src/**/*.ts`, so Radiant
  switched to that posture without editing oak-eslint.
- **Expected**: A new-workspace scaffold recipe should say exactly whether to
  extend the boundary helper's package allow-list or use a tier-neutral
  boundary rule. The first focused lint run should not be the discovery point.
- **Candidate cure**: Add a scaffold helper or checklist row that routes by
  workspace tier: core packages use `coreBoundaryRules`; libs either use an
  updated generated lib allow-list or a documented graph-substrate exception.
- **Target surface**:
  `packages/core/oak-eslint/src/*boundary*`;
  `.agent/plans/connecting-oak-resources/knowledge-graph-integration/active/graph-stack.plan.md`
- **Status**: open

### F-26 — `pnpm install` can stop on a non-TTY modules-purge prompt

- **Source**: Radiant Illuminating Twilight adding the WS2.1 workspace on
  2026-05-12.
- **Surface**: root `pnpm install` after `pnpm install --lockfile-only` and a
  new workspace package.
- **Observed**: `pnpm install` exited with
  `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY` because it wanted confirmation
  to recreate `node_modules`. Re-running with
  `--config.confirmModulesPurge=false` succeeded and created workspace-local
  links.
- **Expected**: The repo should expose a non-interactive workspace-refresh
  command for agents adding a workspace, or the scaffold checklist should name
  the required pnpm flag.
- **Candidate cure**: Add a root script or checklist note for new-workspace
  sessions: `pnpm install --config.confirmModulesPurge=false` after the
  package is created and before focused workspace gates.
- **Target surface**: root `package.json`; graph scaffold checklist; onboarding
  command docs
- **Status**: open

### F-27 — "P4 landed" did not prove the advertised root knip blocker cleared

- **Source**: Brazen/Lofty/Radiant coordination after Vining Regrowing Grove's
  P4 commit `1bb369a5` on 2026-05-12.
- **Surface**: active-claims closure, shared-comms ordering, and root
  `pnpm knip`.
- **Observed**: After P4 landed and Vining's claims disappeared, Radiant reran
  root `pnpm knip`; it still reported the same unused exports previously named
  as P4-owned blockers (`sameAgentRoutingKey`, `ActiveClaimSummary`,
  `ActiveCommitQueueSummary`, `ClosedClaimSummary`). Agents had already begun
  treating the P4 landing as likely unblock evidence.
- **Expected**: A coordination unblock should cite the exact gate rerun that
  proves the named blocker cleared, not only the commit SHA or claim closure.
- **Candidate cure**: Commit-close or coordinator-GO messages that unblock a
  peer on a named gate should include a required `gate_proof` line with the
  command and result. If absent, downstream agents should treat the unblock as
  hypothesis and rerun the gate before staging.
- **Target surface**: commit-queue completion guidance; comms templates;
  `agent-tools` active-agent/queue summaries
- **Status**: open

### F-28 — Directed STOP can arrive after an irreversible commit hook starts

- **Source**: Brazen/Lofty/Radiant WS1.3 + WS2.1 coordination on
  2026-05-12.
- **Surface**: directed comms, minute/poll-based message checks, and
  long-running `git commit` / pre-commit hook execution.
- **Observed**: Brazen sent a STOP after discovering root `pnpm knip` was still
  red, but Lofty's `git commit` was already inside the pre-commit hook. Lofty
  attempted to interrupt when the message became visible, but stdin was already
  closed through the exec wrapper and the commit completed at `87e21125`.
- **Expected**: A STOP coordination message should have a delivery path whose
  latency and interrupt semantics match the criticality of an active
  commit-window correction, or the commit-window protocol should include a
  final "new STOP messages?" check immediately before invoking `git commit`.
- **Candidate cure**: Extend commit-queue `phase pre_commit` or
  `verify-staged` with an optional directed-message freshness check for the
  committing identity and coordinator. Longer term, a sidecar `comms watch`
  mode could emit a visible interrupt when a `coordination-correction` or
  `STOP`-classified message targets an agent with an active `git:index/head`
  claim.
- **Target surface**: `agent-tools` commit-queue pre-commit phase;
  `comms watch`; commit skill recipe
- **Status**: open

### F-29 — Rebase instructions are unsafe in a dirty shared worktree

- **Source**: Radiant Illuminating Twilight following Brazen's WS2.1 GO on
  2026-05-12.
- **Surface**: commit-window handoff instructions and sandbox approval review.
- **Observed**: Brazen's GO said to run `git fetch && git pull --rebase`.
  `git fetch` required elevated permission because it writes `.git/FETCH_HEAD`.
  `git pull --rebase` was then rejected by the approval reviewer because the
  shared worktree had many modified and untracked collaboration-state files
  outside Radiant's WS2.1 scope. The safer evidence path was to verify local
  `HEAD` already contained the required SHAs (`87e21125` and `730766ad`) and
  proceed with install plus gates from that base.
- **Expected**: Commit-window handoff instructions should distinguish clean
  worktree sync from dirty shared-worktree verification, especially when the
  required commits are already ancestors of local `HEAD`.
- **Candidate cure**: Add a "dirty shared worktree" variant to the commit
  protocol: run `git fetch`, verify required SHAs with
  `git merge-base --is-ancestor`, report if origin is behind/ahead, and avoid
  pull/rebase unless the owner explicitly approves broad worktree mutation.
- **Target surface**: commit skill recipe; coordinator GO template; sandbox
  escalation guidance
- **Status**: open

### F-30 — Heartbeat command gives little recovery help for stale syntax

- **Source**: Radiant Illuminating Twilight refreshing WS2.1 claims on
  2026-05-12.
- **Surface**: `agent-tools` claims heartbeat CLI.
- **Observed**: Radiant first used the older positional path shape
  `claims heartbeat .agent/state/collaboration/active-claims.json --claim-id …`.
  The CLI returned `unknown argument` without showing the required current
  shape: `claims heartbeat --active <path> --claim-id <id> --now <iso>`.
- **Expected**: A rejected heartbeat invocation should either print the command
  usage or accept the older positional form as a compatibility alias.
- **Candidate cure**: Reuse the "show full help on invalid args" treatment for
  write-side claim commands, and consider a deprecation shim for the old
  positional `active-claims.json` argument.
- **Target surface**: `agent-tools` claims heartbeat parser/help text
- **Status**: open

### F-32 — `comms send/direct/reply/append --body "..."` silently corrupts bodies containing backticks or dollar signs

- **Source**: cross-session pattern. At least three independent
  instances captured in `.agent/memory/active/napkin.md`: Cirrus
  Circling Plume 2026-05-21 archive entry "shell command-substitution
  from markdown backticks in double-quoted body argument"; Ferny
  Swaying Leaf 2026-05-22 (event `0ce0b26b` lost the words `tags` and
  `fast_bootstrap_eligible` to backtick-eval in `--body`); Foamy
  Snorkelling Jetty 2026-05-22 ("`comms reply` CLI body parsing
  failure modes are layered" — failed twice on backticks inside
  markdown code fences). Stratospheric Gusting Squall has an earlier
  documented instance. Pending-graduations entry titled "CLI body
  backtick-shell-substitution cure pattern is a 3+ instance cross-
  session shape" tracks the cross-session graduation status.
- **Surface**: `agent-tools/src/collaboration-state/cli-comms-commands.ts`
  `appendComms` / `sendComms`; `cli-comms-messages.ts` `directComms` /
  `replyComms`.
- **Observed**: a double-quoted `--body "..."` argument allows the
  shell to evaluate backtick-wrapped spans as command substitution
  and dollar-prefixed tokens as variable expansion BEFORE the CLI
  receives the body. The resulting comms event is silently truncated
  or corrupted; the agent receiving the event sees stripped or
  replaced text. Same hazard on `--body "$(cat tmp-file)"`: the file
  contents are substituted, and backticks within the substituted
  content are then evaluated by the outer double quotes.
- **Expected**: comms event bodies should reach the CLI verbatim,
  regardless of whether they contain shell-special characters.
  Authoring a body should not require knowing the shell's quoting
  rules.
- **Candidate cure** (ranked by leverage; option 1 LANDED 2026-05-22):
  1. **`--body-file <path>` flag** [LANDED — this entry's commit]:
     read body from a file path; the shell only parses the path, not
     the contents. Backwards-compatible, mutually exclusive with
     `--body`. Implemented at `cli-comms-commands.ts::resolveCommsBody`
     and wired through all four comms commands. Tests in
     `tests/collaboration-state/collaboration-state.integration.test.ts`.
     README §"Comms body input: `--body` vs `--body-file`" carries
     the user-facing guidance.
  2. **`--event-spec <path>` flag** [DEFERRED]: accept an entire event
     spec as a JSON file (title + body + platform + model + recipient
     fields), lifting all fields out of the shell-argv layer. More
     robust shape for programmatic/templated workflows. Not load-
     bearing if `--body-file` is in place; useful as a follow-on if
     the templated-event use case grows.
  3. **Write-time body sanitisation / warning** [DEFERRED]: detect
     likely shell-corruption signals at CLI write time (unbalanced
     backticks in received body, body suspiciously shorter than
     typical, absent expected delimiter tokens) and warn or refuse.
     Belt-and-braces — does not prevent the corruption, only catches
     it after the body has already been eaten. False positives
     possible.
- **Target surface**: `agent-tools/src/collaboration-state/cli-comms-*.ts`
  for code changes; `agent-tools/README.md §"CLI Norms"` for caller
  guidance; `.agent/memory/operational/pending-graduations.md` for
  cross-session trigger trace.
- **Status**: option 1 (`--body-file`) addressed in working tree
  2026-05-22 (Ferny Swaying Leaf, this entry's commit). Options 2 and
  3 remain DEFERRED — open for future agents whose work surfaces a
  second instance of templated-event need (for option 2) or audit
  drift in dispatched bodies (for option 3).
- **Owner direction status**: standing (owner stated 2026-05-22:
  "make sure the other options are included in the appropriate,
  discoverable plan surface").

### F-33 — `/remember` compression can write assistant-prose contamination

- **Source**: curator handoff
  `.agent/state/collaboration/handoffs/curator-role-handoff-2026-05-24-vining-to-breezy.md`
  §§3.5 and 5.1; pending-graduations entry
  "`/remember` plugin write-time contract gap".
- **Surface**: external `/remember` plugin `ndc` pipeline (`now.md` →
  `today-YYYY-MM-DD.md`) and `.remember/logs/memory-2026-05-24.log`.
- **Observed**: daily compressed `.remember` files contained Claude assistant
  draft prose interleaved with legitimate waypoint summaries; the same audit
  found `[ndc] ERROR: produced empty result` at 10:09:39 on 2026-05-24.
- **Expected**: plugin-managed capture buffers preserve waypoint-summary shape;
  empty or assistant-prose output is rejected before write or recorded as a
  structured validation failure.
- **Candidate cure**: upstream write-time output validation for the compression
  contract: reject empty output, detect assistant-prose contamination, and keep
  the previous valid buffer state when validation fails.
- **Target surface**: upstream `/remember` plugin contract or issue; this
  repo-local entry is the routing pointer and evidence index, not the buffer
  mutation site.
- **Status**: open — routed from pending-graduations 2026-05-24; external
  plugin implementation still required.
- **Owner direction status**: standing (curators must not mutate plugin-managed
  buffers directly; route the contract gap).

### F-31 — Commit-msg hook depends on unpinned `pnpm dlx commitlint`

- **Source**: Radiant Illuminating Twilight attempting the WS2.1 graph-ingest
  commit on 2026-05-12.
- **Surface**: `.husky/commit-msg` and
  `agent-tools/scripts/check-commit-message.sh`.
- **Observed**: The real `git commit` passed staged prettier,
  markdownlint-staged, shell lint, and full turbo, then failed in
  `commit-msg`. The hook invokes `pnpm dlx commitlint --edit`, which resolved
  `commitlint@21.0.1` and then failed fetching unpublished
  `@commitlint/message@21.0.1` from the npm registry. Local
  `pnpm exec commitlint` resolved the repo-pinned `@commitlint/cli@21.0.0`
  and validated the same wrapped message successfully.
- **Expected**: Commit-message validation should use the repo-pinned
  dependency graph and should not depend on the latest external `commitlint`
  package at commit time.
- **Candidate cure**: Change the hook and the preflight helper to use
  `pnpm exec commitlint --edit <file>` from the repo root. Keep the message
  check isolated, but bind it to the lockfile rather than a live dlx resolve.
- **Target surface**: `.husky/commit-msg`;
  `agent-tools/scripts/check-commit-message.sh`; commit skill recipe
- **Status**: open

### F-34 — Legacy routing diagnostics flood watcher reads

- **Source**: Hidden Dimming Threshold 2026-05-27 start-right-team bootstrap;
  active napkin source archived as
  `.agent/memory/active/archive/napkin-2026-05-27-hidden-dimming-threshold-curation.md`.
- **Surface**: `pnpm agent-tools:collaboration-state -- comms watch` and
  `comms inbox` classification over historical legacy events.
- **Observed**: `comms watch --seed-from-now` and `comms inbox` can flood
  stdout with `[routing-legacy-fallback]` diagnostics while classifying older
  legacy events, even when the caller only needs quiet all-channel monitoring
  for the current session.
- **Expected**: Watcher/inbox output keeps new-event signal readable. Legacy
  fallback diagnostics remain available for audit, but do not drown the
  operational stream by default.
- **Candidate cure**: Add diagnostic throttling or an explicit diagnostics
  mode for legacy fallback rendering, preserving the audit path while keeping
  watcher output suitable for start-right-team liveness.
- **Target surface**: `agent-tools/src/collaboration-state/comms-relevant-events.ts`
  and comms watch/inbox rendering.
- **Status**: open
- **Owner direction status**: standing (agent-observed tooling friction is
  first-class user feedback).

### F-35 — `comms append`/`send --help` hides the `--tag heartbeat` typed-arg mode

- **Source**: Windward Gliding Squall (`ab2bcd`) 2026-06-04 broadcast comms
  event `fa7eb7df`; owner-relayed in-session.
- **Surface**: `pnpm agent-tools:collaboration-state -- comms append --help`
  (and the mirrored `comms send` path).
- **Observed**: The `--help` usage line lists `(--body | --body-file)` as
  required and `--tag` as accepting `[failure-mode, behaviour-note, heartbeat]`,
  but does NOT surface that `--tag heartbeat` switches modes: it REJECTS
  `--body`/`--body-file` and instead REQUIRES the typed state args
  `--claim-id --intent-id --branch --current-cycle-label`. A heartbeat Monitor
  built from `--help` plus the `liveness-heartbeat-cron` rule prose passed
  `--body` and failed every cycle (exit 2) until the agent ran it manually to
  read the (excellent) runtime error. The exact flag names lived only in the
  runtime error, not in `--help`.
- **Expected**: `comms append --help` reveals the heartbeat-mode flag set so an
  agent building a heartbeat loop from `--help` alone composes a valid
  invocation first time.
- **Candidate cure**: document the heartbeat mode inline in the `comms append`
  AND `comms send` help strings (both route `--tag heartbeat` through the same
  typed-state body composer in `comms-heartbeat-cli.ts`). A static inline note
  beats a dynamic branch — an agent reading `--help` with no flags sees both
  modes.
- **Target surface**:
  `agent-tools/src/collaboration-state/cli-specs.ts` (help wiring) →
  help strings extracted to
  `agent-tools/src/collaboration-state/cli-spec-help.ts`;
  regression tests in
  `agent-tools/tests/collaboration-state/collaboration-state.unit.test.ts`.
- **Status**: addressed-in-working-tree-2026-06-04 (Fiery Forging Ash) —
  `comms append`/`send --help` now document `HEARTBEAT MODE` with the typed
  state args and the `--body`/`--body-file` rejection; help text extracted to a
  dedicated module so the spec table stays under its `max-lines` ceiling as
  help text grows; CLI-level help tests assert both commands. Pending commit;
  replace with `addressed-in-<commit-sha>` after landing.
- **Owner direction status**: standing (F-09 discoverability family —
  agent-observed tooling friction is first-class user feedback).

### F-36 — `pnpm agent-tools:*` wrapper preamble pollutes captured stdout

- **Source**: Windward Gliding Squall (`ab2bcd`) 2026-06-04 consolidated
  frictions (item 3), directed event `50299513`.
- **Surface**: `pnpm agent-tools:collaboration-state -- <cmd>` (the root
  `agent-tools:*` script wrappers).
- **Observed**: The pnpm wrapper prints two `$ ...` preamble lines (the
  `--filter` line and the `cd .. && node agent-tools/dist/...` recipe) ahead of
  the command's real stdout. Capturing a machine-readable value (e.g. a
  returned `event_id`) needs `tail -n +3` or filtering, which is brittle for
  scripting.
- **Expected**: A scriptable path that emits only the command's own stdout.
- **Candidate cure**: a `--quiet`/`--porcelain` mode emitting only
  machine-readable output, and/or document the direct
  `node agent-tools/dist/src/bin/agent-tools.js ...` invocation for scripting
  (the direct invocation is already clean — it is what the all-channels
  watcher and these read commands use — but it is not advertised for
  scripting). Sibling to F-06 / F-23 (the build-prelude / hot-path family);
  route through the same hot-path split rather than per-command.
- **Target surface**: root `package.json` agent-tools scripts;
  `agent-tools/README.md` §"CLI Norms"; possibly the P-Foundation hot-path
  split named in F-19/F-23.
- **Status**: open.
- **Owner direction status**: standing (agent-observed tooling friction is
  first-class user feedback).

---

### F-37 — Shipped skills generator diverges from PDR-051 §Required

- **Source**: skills audit 2026-06-14 (this session); owner direction to record
  gaps and defer review.
- **Surface**: `agent-tools/src/skills-adapter-generate/` (generator + checker);
  `.agent/skills/*/SKILL-CANONICAL.md` frontmatter; `scripts/validate-portability.ts`.
- **Observed**: PDR-051's core landed (canonical filename, two surfaces, drift
  gate, command retirement) but in a reduced form: generator emits only
  `{name, description}`; no owned/ingested consistency check (`lock.ts` present
  but unwired); `metadata.owned` on 2 of ~22 owned skills; no bytewise
  supporting-file copy; no `claude-*` hoisting; a non-spec top-level
  `classification` key is silently dropped. `skills-lock.json` is empty (no
  ingested skills), so the owned/ingested apparatus is wholly unexercised.
  The owning plan was never reconciled — todos read `pending` while the code shipped.
- **Expected**: either the implementation satisfies PDR-051 §Required, or
  PDR-051 is amended to record the deferred/YAGNI scope, and the plan reflects
  reality.
- **Candidate cure**: a dedicated review/analysis session (owner-deferred
  2026-06-14) decides amend-PDR-down vs close-gaps-as-defects; the plan's
  §Reality Reconciliation gap ledger is the input.
- **Target surface**: PDR-051; the owning plan
  [`current/skills-standardisation-and-adapter-generator.plan.md`](current/skills-standardisation-and-adapter-generator.plan.md)
  (§Reality Reconciliation); generator + validator.
- **Status**: recorded — review deferred to a later session (owner direction
  2026-06-14). Gap ledger lives in the owning plan's §Reality Reconciliation.
- **Owner direction status**: standing (agent-observed tooling friction is
  first-class user feedback); review-timing session-scoped (deferred 2026-06-14).

---

### F-38 — Literal control bytes in source need a mechanical pre-commit screen

- **Source**: comms events `4fd66dc5` (Sylvan, 2026-06-10) + `f305c720`
  (Prismatic, PR-180 cycle); `distilled.md` §Curation enforcement. Migrated from
  `pending-graduations.md` 2026-06-15 (consolidation; FIRED second instance).
- **Surface**: repo-validator / lint tier; any Edit-tool write of escape-bearing
  source.
- **Observed**: a literal `0x1F` separator fooled a reviewer AND a first-hand
  verifier (invisible in diff/grep); an Edit-tool write later materialised an
  escape sequence as a literal `0x1F` byte in a dedup key. Both caught only by
  ad-hoc `cat -v` / `od` vigilance, which the cross-experience synthesis names as
  the non-durable mechanism.
- **Expected**: a mechanical gate rejects control bytes `< 0x20` (other than
  tab/newline/CR) in tracked text/source files.
- **Candidate cure**: a control-byte scan at the repo-validator or lint tier.
- **Target surface**: `agent-tools/src/validators/` (or lint tier).
- **Status**: open (behavioural cure live in `distilled.md`; structural gate
  unbuilt).
- **Owner direction status**: standing.

### F-39 — Wrap-aware continuation-line lint for the MD004 list-marker trap

- **Source**: pre-position `0f36d756` item 6 + Arboreal napkin entry + a
  commit-gate instance; FIVE instances, four authors. Migrated from
  `pending-graduations.md` 2026-06-15.
- **Surface**: markdownlint MD004; authoring of ~100-char-wrapped prose.
- **Observed**: reflowing wide prose wraps a continuation line so it starts with
  a list-marker character (`+`, `-`, or `*` followed by a space), and MD004 reads
  it as an inconsistent list marker. Reword cures are vigilance-shaped; the
  commit-gate catch was mechanical.
- **Expected**: wrap output cannot silently acquire markdown list semantics.
- **Candidate cure**: an authoring-reflex clause (audit wrap output for
  accidental markdown semantics) OR a wrap-aware continuation-line check at the
  lint tier.
- **Target surface**: markdownlint config / a wrap-aware lint check; authoring
  guidance.
- **Status**: open.
- **Owner direction status**: standing.

### F-40 — Coverage-matrix-vs-implementation drift validator (ADR-121)

- **Source**: Lanternlit curation pass (ADR-121/hook drift fix `6f280f9f`).
  Migrated from `pending-graduations.md` 2026-06-15 (was "routed 2026-06-11 —
  agent-tools implementation lane"; no plan home found, so captured here).
- **Surface**: ADR-121 §Coverage matrix vs `.husky/pre-commit` +
  `.github/workflows/ci.yml`.
- **Observed**: the pre-commit hook silently drifted from ADR-121's coverage
  matrix (omitted knip + depcruise, added build). Doc-to-doc drift was reconciled
  and the matrix single-sourced in ADR-121, but the matrix still duplicates the
  *implementation*.
- **Expected**: the documented coverage matrix is verified by the implementation
  and fails loudly on the next drift.
- **Candidate cure**: a repo-validator that parses ADR-121 §Coverage matrix and
  asserts each surface column matches the live hook/CI command sets.
- **Target surface**: `agent-tools/src/validators/coverage-matrix-matches-hooks`.
- **Status**: open.
- **Owner direction status**: standing.

### F-41 — Collaboration-CLI relative-path + git-common-dir resolution

- **Source**: `pending-graduations.md` "due" item (Scorched/Prismatic/Nebulous/
  Tempest — six instances 2026-06-11/12). Migrated 2026-06-15.
- **Surface**: collaboration-state claims/comms/commit-queue write commands
  (`--active`/`--closed`/`--comms-dir`/`--seen-file`).
- **Observed**: relative paths from a stale or worktree cwd crash
  (MODULE_NOT_FOUND / FileNotFoundError) or — worse — write to the WRONG registry
  behind a true-looking proof line (the wrapped-exit-codes false-green pattern).
  commit-queue write commands expose NO registry path option, so a worktree seat
  resolves its own registry from cwd and is locked out of the shared queue
  (`enqueue` rejected a valid shared-registry claim as unknown).
- **Expected**: write commands resolve the coordination home across worktrees
  (e.g. via the git common dir) or refuse relative paths loudly, naming
  shell-cwd persistence (any prior `cd`) as the trigger.
- **Candidate cure**: resolve registry/comms paths against a discovered
  repo/coordination-home root; commit-queue write commands gain a registry path
  option.
- **Target surface**: agent-tools collaboration-state path resolution. (Verified
  2026-06-15: `collaboration-state-write-safety.plan.md` does NOT carry this.)
- **Status**: open.
- **Owner direction status**: standing.

### F-42 — Comms `reply`/`show` need git-style event-id prefix resolution

- **Source**: `pending-graduations.md` "due" item (Prismatic 62d747c4 +
  pre-position 0f36d756 item 4). Migrated 2026-06-15.
- **Surface**: collaboration-state comms reply/show.
- **Observed**: an 8-char event-id prefix exits 2 loud, while the corpus
  circulates short prefixes (titles, sweep output, napkin citations), so agents
  naturally carry them.
- **Expected**: the CLI resolves unambiguous event-id prefixes against the comms
  dir, erroring loudly only on ambiguity.
- **Candidate cure**: prefix resolution in comms reply/show.
- **Target surface**: agent-tools comms reply/show.
- **Status**: open.
- **Owner direction status**: standing.

### F-43 — Comms-watch zombie-process residuals (kill-tree, census, dir-scaled budget)

- **Source**: `pending-graduations.md` "due" item (pre-position 0f36d756 item 7,
  Nebulous, the 120s-death-at-14:16Z, and the Director lingering-process audit).
  Migrated 2026-06-15.
- **Surface**: collaboration-state comms watch + its supervising Monitor/cron.
- **Observed**: the fail-loud drain-timeout emits WATCHER ERROR but the node
  process does NOT exit — dead watchers linger as zombie co-writers on the same
  seen-file/heartbeat-file (three writers on one file; two orphans survived a
  stood-down session), and zombie drains plausibly feed the I/O load that kills
  subsequent drains. A fixed step-timeout loses to a growing comms dir under
  concurrent load.
- **Expected**: a timed-out watcher exits cleanly; no zombie co-writers; drain
  budget scales to dir size (or comms-dir archival reduces load).
- **Candidate cure**: THREE residuals — (a) supervisor kill-tree; (b)
  stale-process census (ps for prior watchers on the same seen-file before any
  same-seen-file restart); (c) dir-size-scaled drain budget. The timeout→
  EXIT-NON-ZERO path is covered by `comms-watch-hang-hardening.plan.md` c1
  (pending landing); that plan's §Non-goals DELIBERATELY scopes out
  supervisor/harness (kill-tree) and uses a fixed budget — so (a)/(b)/(c) are
  genuinely unhomed.
- **Target surface**: agent-tools comms watch supervisor + restart guidance; the
  comms-corpus archival path is owner-gated (preservation pause).
- **Status**: open (partial: timeout-exit in comms-watch-hang-hardening c1).
- **Owner direction status**: standing.

### F-44 — `claims list` freshness_status ignores the live heartbeat stream (SAFETY)

- **Source**: Snapper binds Coral (`0beea7`) successor-in-waiting grounding
  2026-06-15; comms behaviour-note `9e3b5b01`.
- **Surface**: collaboration-state claims list / claims status.
- **Observed**: freshness_status is computed from `claimed_at + freshness_seconds`
  alone, ignoring the agent's live heartbeat comms-event stream. A demonstrably
  live agent (heartbeating every ~4 min, recent commit) was reported "stale". An
  agent trusting `freshness_status: stale` would conclude a live peer is dead and
  barge into its active claim — the exact collision `respect-active-agent-claims`
  exists to prevent.
- **Expected**: freshness incorporates the latest heartbeat for that
  agent/claim. (`consolidate-docs` step 7e already says "use heartbeat_at if
  present and more recent" — but neither the claim's heartbeat_at field nor
  `claims list` reflects the actual heartbeat events.)
- **Candidate cure**: heartbeat append updates the claim's heartbeat_at, OR
  `claims list` joins the comms heartbeat stream by claim_id/session and reports
  freshness from the most recent of {claimed_at, heartbeat_at, last heartbeat
  event}.
- **Target surface**: agent-tools collaboration-state claims freshness.
- **Status**: open (behavioural mitigation: freshness_status is input-to-verify
  against the heartbeat stream).
- **Owner direction status**: standing.

### F-45 — Untracked-by-design registry/dirs do not self-init

- **Source**: Rigel binds Meridian (`b475ee`) + Snapper (`0beea7`) 2026-06-15
  bootstrap; napkin frictions.
- **Surface**: collaboration-state claims open/close; comms watcher seen-file dir.
- **Observed**: active-claims.json and closed-claims.archive.json are
  untracked-by-design (ADR-199/PDR-094), so absent on fresh instance-state — the
  EXPECTED fresh state. The first `claims open` dies ENOENT exit 2 (no auto-init,
  no guidance); `claims close` dies ENOENT on absent closed-claims.archive.json
  the same way. Recovery needs reading the schema source and hand-writing the
  empty registry. Sibling: the comms-seen parent dir needs a manual `mkdir -p`.
- **Expected**: write commands self-init an empty registry when the file is
  absent (absence is the expected fresh state), or a `claims init` exists, or
  ENOENT re-throws guidance naming the cure; same self-init for the comms-seen
  dir.
- **Candidate cure**: self-init on absent untracked-by-design registry/dir.
- **Target surface**: agent-tools collaboration-state write commands + comms
  watch seen-dir.
- **Status**: open.
- **Owner direction status**: standing.

### F-46 — commit-queue write-command help must expose the full identity tuple

- **Source**: `pending-graduations.md` (Lofty/Lacustrine closeouts; routed
  2026-06-11, no plan home found). Migrated 2026-06-15 (like F-40).
- **Surface**: collaboration-state commit-queue enqueue/guard.
- **Observed**: enqueue/guard require identity `--id` (UUID), but usage text
  displayed agent name/platform/model/session-prefix and omitted the UUID field —
  avoidable closeout friction.
- **Expected**: write-command help/validation shows every required identity
  field including the UUID.
- **Candidate cure**: help text + validation enumerate the full identity tuple.
- **Target surface**: agent-tools commit-queue UX.
- **Status**: open.
- **Owner direction status**: standing.

### F-47 — Platform identity-seed observability (absent seed → invisible session)

- **Source**: `pending-graduations.md` (Ashen 2026-06-02; Cirrus 2026-05-31;
  routed 2026-06-11 identity-observability lane; trigger fired 2026-06-04, second
  instance). Migrated 2026-06-15.
- **Surface**: platform host hooks / agent-tools identity; Cursor especially
  (`PRACTICE_AGENT_SESSION_ID_CURSOR`).
- **Observed**: a Cursor session whose `PRACTICE_AGENT_SESSION_ID_CURSOR` was
  absent from the shell could not claim or broadcast, so a broad sweep was
  invisible to active-claims/comms — a host hook/environment gap, not an agent
  behaviour failure. Two instances, different agents.
- **Expected**: a machine-level check surfaces a missing/unresolvable identity
  seed at session open.
- **Candidate cure**: an identity-seed preflight/observability check at the
  host-hook layer.
- **Target surface**: agent-tools identity preflight + platform hooks.
- **Status**: open.
- **Owner direction status**: standing.

### F-48 — Shell-significant collaboration-CLI arguments need a structural affordance

- **Source**: `pending-graduations.md` (longitudinal napkin review F2; multiple
  instances — comms backticks, unquoted `**` claim patterns, unquoted globs).
  Migrated 2026-06-15.
- **Surface**: collaboration-state comms/claims args the shell expands before the
  CLI validates.
- **Observed**: markdown backticks in comms bodies, unquoted `**` claim patterns,
  and unquoted active-claim/comms globs repeatedly mis-expand; the shell expands
  before the CLI can validate.
- **Expected**: shell-significant args cannot silently mis-expand.
- **Candidate cure**: `--area-pattern-file` / `--body-file` (the latter
  DELIVERED for bodies), quote-safe help examples, wrapper defaults, or another
  structural affordance — not a prose reminder.
- **Target surface**: agent-tools collaboration-state CLI UX.
- **Status**: partially-addressed (`--body-file` delivered for comms bodies;
  pattern/glob args remain).
- **Owner direction status**: standing.

### F-49 — CLI-UX residuals: pnpm wrapper masks usage text; check-commit-message flag is `-F`

- **Source**: Snapper (`0beea7`) + Rigel (`b475ee`) 2026-06-15.
- **Surface**: `pnpm agent-tools:*` recursive wrapper; check-commit-message.
- **Observed**: (a) `pnpm agent-tools:collaboration-state <bad subcommand/flag>`
  dies `ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL` exit 2, masking the CLI's own helpful
  usage/error text (visible only when calling the dist binary directly). (b)
  check-commit-message `--file` exits 2; the flag is `-F`.
- **Expected**: the wrapper passes the CLI's stderr usage text through on
  non-zero exit; flag naming is discoverable/consistent.
- **Candidate cure**: wrapper stderr pass-through; `-F` documented or `--file`
  aliased.
- **Target surface**: agent-tools pnpm scripts + check-commit-message help.
- **Status**: open (low priority).
- **Owner direction status**: standing.

### F-50 — Relative-link + anchor resolution check missing from the gate tier

- **Source**: `pending-graduations.md` (Scorched candidate 0d8138; PR 177 shipped
  three off-by-one `../../../` report links through a 103-task green pre-push
  chain, caught by a review bot not a gate). Migrated 2026-06-15.
- **Surface**: markdownlint / repo-validators gate tier.
- **Observed**: markdownlint checks style, never link resolution, so dead
  relative links and bad anchors ride a green gate chain. Once-fix landed
  fe35219d8; the recur-proof cure is unbuilt.
- **Expected**: a relative-link + anchor resolution check fails loudly in the
  gate tier on a dead link.
- **Candidate cure**: a link-resolution + anchor check at the
  repo-validators/markdownlint tier (sibling of F-38/F-40 unbuilt gate checks).
- **Target surface**: `agent-tools/src/validators/` or markdownlint tier.
- **Status**: open.
- **Owner direction status**: standing.

### F-51 — Worktree vocab-gen needs the gitignored bulk-downloads (symlink setup)

- **Source**: `pending-graduations.md` (Prismatic closeout 62d747c4 / event
  f305c720; worked once, PR-180 cycle). Migrated 2026-06-15.
- **Surface**: worktree setup for `apps/oak-search-cli` vocab-gen; team-opener
  §Worktree setup (Director-owned prompt file).
- **Observed**: vocab-gen in a worktree needs
  `apps/oak-search-cli/bulk-downloads` (gitignored, machine-local); symlinking
  the data files from the primary checkout into the worktree skeleton works and
  stays git-invisible. The drafted opener line was handed to the Director but its
  landing is unverified. Sibling gotcha: turbo FULL-TURBO replay on sdk-codegen
  masked that `data.json` is written by vocab-gen — know the generator→task
  mapping before assuming a regen ran.
- **Expected**: the team opener documents the worktree bulk-downloads symlink
  step; the generator→task mapping is discoverable.
- **Candidate cure**: add the symlink line to the team-opener §Worktree setup;
  document the vocab-gen→data.json mapping.
- **Target surface**: team-opener prompt (Director-owned) / build-system docs.
- **Status**: open.
- **Owner direction status**: standing.

### F-52 — `evaluateParityChecks` lacks focused unit coverage

- **Source**: `pending-graduations.md` Legacy Backlog (2026-05-10
  commands-retirement reviewer follow-up). Migrated 2026-06-15.
- **Surface**: `agent-tools/src/core/health-probe-parity.ts`.
- **Observed**: `evaluateParityChecks` is only exercised through the composed
  health-probe path; no focused unit coverage for reviewer-adapter and
  registration parity.
- **Expected**: focused unit tests over the parity evaluator at a pure seam.
- **Candidate cure**: add a unit test cycle for `evaluateParityChecks`.
- **Target surface**: `agent-tools` test suite.
- **Status**: open.
- **Owner direction status**: standing.

### F-53 — `getSkillPermissionIssues` live skill-dir test path uncovered

- **Source**: `pending-graduations.md` Legacy Backlog (2026-05-10
  commands-retirement reviewer follow-up). Migrated 2026-06-15.
- **Surface**: `validate-portability-helpers` / `getSkillPermissionIssues`.
- **Observed**: live calls use `claudeCommandFiles: []` plus `claudeSkillDirs`,
  while existing tests still cover only command-file inputs.
- **Expected**: tests cover the live skill-dir path.
- **Candidate cure**: helper cleanup + test cycle for the skill-dir path.
- **Target surface**: `agent-tools` portability helpers + tests.
- **Status**: open.
- **Owner direction status**: standing.

### F-54 — Pre-commit hook omits `portability:check` / `skills:check`

- **Source**: `pending-graduations.md` Legacy Backlog (2026-05-10
  commands-retirement config review). Migrated 2026-06-15.
- **Surface**: `.husky/pre-commit` vs ADR-121 coverage matrix.
- **Observed**: `.husky/pre-commit` does not run `pnpm portability:check` or
  `pnpm skills:check`; pre-push and full `pnpm check` cover adjacent routes, so
  adapter/portability drift can pass the commit gate.
- **Expected**: the commit gate covers portability/skills drift, or ADR-121
  documents the deliberate omission.
- **Candidate cure**: add the two checks to pre-commit, or an ADR-121 amendment
  (pairs with F-40 coverage-matrix validator).
- **Target surface**: `.husky/pre-commit` / ADR-121.
- **Status**: open.
- **Owner direction status**: standing.

### F-55 — Comms write-side must refuse self-only addressing (two-participant invariant)

- **Source**: `pending-graduations.md` Legacy Backlog (owner direction
  2026-05-21: "private messages must have at least two participants"). Migrated
  2026-06-15.
- **Surface**: `agent-tools/src/collaboration-state/comms-messages.ts`.
- **Observed**: the read-side `classifyEventForAgent` self-excludes correctly,
  but the write-side does NOT refuse a narrative event whose
  `addressed_to === author.agent_name`, nor a directed event whose `from === to`.
- **Expected**: a write-side validator refuses self-only addressing at write
  time.
- **Candidate cure**: a write-side validator (single function plus unit tests).
- **Target surface**: `agent-tools` comms message construction.
- **Status**: open (owner-directed).
- **Owner direction status**: standing.

### F-56 — collaboration-state operator-UX backlog (residual)

- **Source**: `pending-graduations.md` Legacy Backlog (2026-05-12 Volcanic
  distilled-stage; cost-of-collaboration P5/P8). Migrated 2026-06-15.
- **Surface**: collaboration-state CLI operator ergonomics.
- **Observed**: residual UX gaps beyond those already captured — a
  protocol-position command (report current intent/phase/next action); built-CLI
  smoke must cover help paths and real read/write paths; a missing `--seen-file`
  should mean an empty seen set (not an error); directed-message targeting needs
  discoverable presence from fresh claims and recent comms. (Already covered
  elsewhere: `--active` default = F-41; long-content `--body-file` DELIVERED
  2026-06-11; pnpm-wrapper / flag UX = F-49.)
- **Expected**: the operator can self-locate and the CLI defaults safely.
- **Candidate cure**: route through the cost-of-collaboration P5/P8 lane or
  split into tool tickets.
- **Target surface**: agent-tools collaboration-state CLI.
- **Status**: open.
- **Owner direction status**: standing.

### F-57 — Generated-adapter/doc drift check missing from the blocking commit gate

- **Source**: `pending-graduations.md` (2026-06-07 Eclipsed Watching Veil; the
  `oak-consolidate-until-done` adapter drift `a4c4c047` that red-lit `pnpm check`
  yet landed committed). Migrated 2026-06-15.
- **Surface**: `.husky/pre-commit` vs generator-vs-source checks.
- **Observed**: `skills-adapter-generate --check` (and sibling generator-vs-
  source checks) live only in the comprehensive `pnpm check`, not the blocking
  commit gate, so generated-doc/adapter drift can land committed (doctrine
  without mechanism, in the gate-config domain).
- **Expected**: the blocking commit gate runs the generated-adapter drift check,
  mirroring the knip+depcruise→pre-commit fix that closed the prior ADR-121
  drift class.
- **Candidate cure**: wire `skills-adapter-generate --check` into
  `.husky/pre-commit` (pairs with F-40 / F-54).
- **Target surface**: `.husky/pre-commit` / ADR-121 / build-system.md.
- **Status**: open.
- **Owner direction status**: standing.

### F-58 — Readers of untracked-by-design `.agent/state` paths must tolerate absence

- **Source**: `pending-graduations.md` (2026-06-14 Whirlwind WS7;
  `validate-collaboration-state` crashed ENOENT twice in CI on a fresh clone;
  fixed reactively `356e76f59` + `7da12a82f`). Migrated 2026-06-15.
- **Surface**: any reader of untracked `.agent/state/collaboration/` paths
  (validators, comms watcher, statusline scans, curator tooling).
- **Observed**: the WS7 untrack created a standing hazard class — a now-untracked
  path is absent in a fresh clone; the validator was fixed reactively but the
  class is unswept.
- **Expected**: every reader treats an absent untracked path as the clean empty
  state, not a fault.
- **Candidate cure**: a one-pass audit of all readers of untracked `.agent/state`
  paths for absence-tolerance (plus a shared `readDirOrEmpty` /
  `optionalWhenAbsent` helper); candidate rule "untracked-by-design readers
  tolerate absence". Sibling of F-45 (write-side self-init).
- **Target surface**: agent-tools readers + ADR-199 consequences note.
- **Status**: open.
- **Owner direction status**: standing.

### F-59 — commit-queue `-- commit` workflow spawn/capture defect (P1)

- **Source**: Marlin weaves Marsh carry-forward (2026-06-14 napkin). Migrated
  2026-06-16 during napkin rotation.
- **Surface**: collaboration-state commit-queue `-- commit` workflow.
- **Observed**: the commit-queue `-- commit` workflow fails while the standalone
  `git commit -F … -- <files>` passes — captured hook output dies at the
  depcruise line; the defect is in the workflow's spawn/capture environment, not
  the tree/hooks/message.
- **Expected**: the commit-queue commit workflow succeeds wherever the standalone
  commit does.
- **Candidate cure**: investigate the workflow's spawn/capture environment
  (hook-output capture / process spawn).
- **Target surface**: agent-tools commit-queue commit workflow.
- **Status**: open (P1; no plan home yet).
- **Owner direction status**: standing.

### F-60 — non-reproducing pre-push failures under concurrent worktree gate runs

- **Source**: `pending-graduations.md` (2026-06-11/12; two lanes hit
  non-reproducing pre-push failures). Migrated 2026-06-16 (decision-debt drain).
- **Surface**: pre-push gate under concurrent worktree gate runs.
- **Observed**: two lanes in one window hit non-reproducing pre-push failures;
  suspect a shared turbo cache under concurrent gate runs across worktrees.
- **Expected**: the pre-push gate is deterministic across concurrent worktrees.
- **Candidate cure**: capture the full log and do one clean re-run before treating
  a pre-push red as content-rooted; investigate per-worktree turbo cache isolation.
- **Target surface**: build-system / turbo config investigation.
- **Status**: open (escalates if a third lane hits it).
- **Owner direction status**: standing.

### F-61 — PreToolUse safety hooks must run prebuilt artefacts, not `pnpm exec tsx`

- **Source**: `pending-graduations.md` (2026-05-31, commit `1851eed`). Migrated
  2026-06-16 (decision-debt drain).
- **Surface**: PreToolUse safety hooks.
- **Observed**: per-call TS recompile (~1-2s via `pnpm exec tsx`) blows the 5s
  hook timeout under concurrent load, so the guard fails OPEN.
- **Expected**: hooks run prebuilt artefacts well within the timeout.
- **Candidate cure**: invoke `node dist/...` directly; guarantee `dist` via the
  install lifecycle (postinstall + pre-commit build).
- **Target surface**: PreToolUse hook execution; candidate ADR
  (hook-execution-from-prebuilt-artefacts).
- **Status**: partially-addressed — `validate-pretooluse-guard-routing` now asserts
  guards route through the shim; verify the dist-build lifecycle guarantee closes
  the fail-open window fully.
- **Owner direction status**: standing.

### F-62 — relocating tsx-invoked entry points silently breaks knip's entry config

- **Source**: `pending-graduations.md` (2026-05-31 knip failure). Migrated
  2026-06-16 (decision-debt drain).
- **Surface**: `knip.config.ts` entry globs.
- **Observed**: relocating tsx-invoked entry points (`scripts/` → `src/`) made the
  whole dependency graph read as unused.
- **Expected**: entry-point relocations do not silently break knip.
- **Candidate cure**: update the `knip.config.ts` entry list on any entry-point
  relocation; candidate discipline "knip entry config tracks entry-point moves".
- **Target surface**: `knip.config.ts` + an entry-relocation checklist.
- **Status**: open (discipline note).
- **Owner direction status**: standing.

### F-63 — negation-contrast tombstone form needs a structural detector

- **Source**: `pending-graduations.md` (2026-05-31;
  `no-tombstones-for-removed-ideas.md` §"Why This Rule Is Strict"). Migrated
  2026-06-16 (decision-debt drain).
- **Surface**: no-tombstones enforcement (write-time PreToolUse policy +
  output-time review).
- **Observed**: the negation-contrast form of tombstoning ("X, not Y"; "built
  fresh, never a bridge") is a *structural* pattern, not a fixed literal; the
  write-time hook carries only high-signal literals, and a naive block on
  "never" / "rather than" / "instead of" false-positives unacceptably.
- **Expected**: the negation-contrast form is detectable without unacceptable
  false positives.
- **Candidate cure**: a smarter structural detector OR an output-time review pass.
- **Target surface**: no-tombstones enforcement tooling.
- **Status**: open (trigger: a viable low-false-positive detector design OR owner
  direction).
- **Owner direction status**: standing.

### F-64 — Editing an append-only channel file with the Edit tool re-emits the whole channel to watchers

- **Source**: napkin 2026-06-16 (Snapper binds Coral closeout); routed here at the
  graduation drain (Skunk hunts Crescent, 2026-06-16) — the sibling of the
  markdownlint MD004 friction (F-39) the same closeout routed.
- **Surface**: ArcAngel / `.agent/collaboration/rapid-comms/` append-only channel
  files, written with the Edit tool; `tail -F` channel watchers.
- **Observed**: appending to an append-only channel file via the Edit tool rewrites
  the file (new inode / full-content write), so a `tail -F` watcher re-emits the
  entire channel rather than only the appended line. The append reads as a flood to
  every channel monitor.
- **Expected**: an append lands as one new line; watchers see only the delta.
- **Candidate cure**: append to channel files with a shell `>>` redirect (true
  append, preserves the inode), never the Edit tool; document the `>>` contract on
  the rapid-comms channel surface so the next agent finds it before failing.
- **Target surface**: `.agent/collaboration/rapid-comms/README.md` (append contract);
  `comms-all-channels-watcher` rule if a watcher-side note is warranted.
- **Status**: open (trigger: a documented `>>` append contract on the channel surface).
- **Owner direction status**: session-scoped (closeout routing direction).

### F-65 — Mixed time bases (UTC comms vs local mtimes) manufacture phantom liveness gaps

- **Source**: distilled (2026-06-11 window); graduation drain 2026-06-16 (Skunk hunts Crescent) — quorum-rescued from a reject.
- **Surface**: comms-event `created_at` (UTC) compared against filesystem mtimes (local display time) during agent liveness / gap reasoning.
- **Observed**: comparing UTC `created_at` against local mtimes manufactures phantom gaps — two independent successor-bootstrap misreads inferred a dead team / a retirement from a ~1-hour display offset.
- **Expected**: all time comparisons resolve in a single base before any liveness/gap inference.
- **Candidate cure**: derive "now" with `date -u` FIRST; compare all timestamps in UTC; never infer liveness from mtime display time. Consider a comms-CLI `--age`/`--since` helper that emits ages in UTC so agents do not hand-compare bases.
- **Target surface**: agent time-reasoning discipline; optional comms-CLI age/since projection.
- **Status**: open.
- **Owner direction status**: unsolicited.

### F-66 — BSD `sed -i ''` transient siblings race directory watchers

- **Source**: distilled (2026-06-11→12); graduation drain 2026-06-16 (Skunk hunts Crescent) — quorum-rescued from a reject.
- **Surface**: BSD `sed -i ''` run over files inside a watched directory (FSEvents / comms watchers / Monitor tails).
- **Observed**: BSD `sed -i ''` creates transient `.!nnnnn!file` siblings during the in-place edit; these trip directory watchers, producing spurious wakes/noise.
- **Expected**: an in-place edit over a watched dir does not emit watcher events for transient scratch files.
- **Candidate cure**: pause or expect-noise on watchers before in-place sweeps over watched dirs; or write-to-temp-outside-the-watched-dir then rename in; or prefer the Edit tool. Watcher poll-loops should filter `.!*!*` / `*.tmp-*` transient names.
- **Target surface**: agent sweep discipline; watcher transient-name filtering.
- **Status**: open.
- **Owner direction status**: unsolicited.

### F-67 — Forename-keyed `/tmp` filenames collide across same-forename agents

- **Source**: distilled; graduation drain 2026-06-16 (Skunk hunts Crescent) — quorum-rescued from a reject.
- **Surface**: `/tmp` scratch-file naming in multi-agent shared-checkout sessions.
- **Observed**: forename-keyed `/tmp` filenames (e.g. `/tmp/skunk-foo.txt`) collide across agents that share a forename in the naming wordlist, clobbering each other's temp files.
- **Expected**: temp-file names are agent-unique within a shared checkout.
- **Candidate cure**: identity-qualified temp names — `<forename>-<surname-word>-<purpose>-<date>` or include the `session_id_prefix`; optionally an agent-tools temp-path helper that returns an identity-qualified scratch path.
- **Target surface**: agent temp-file naming convention; optional agent-tools scratch-path helper.
- **Status**: open.
- **Owner direction status**: unsolicited.

### F-68 — `commit-queue enqueue` prints the intent_id as a bare UUID on the last line, not JSON

- **Source**: napkin; 2026-06-17 (Squall spins Stratus); graduation drain 2026-06-18 (Wisteria spins Bark).
- **Surface**: `pnpm agent-tools:collaboration-state -- commit-queue -- enqueue` stdout.
- **Observed**: the command prints the new `intent_id` as a **bare UUID on the last line**, not as JSON. A `grep '"intent_id"'` returns empty (no JSON key), tempting a re-enqueue that creates a duplicate intent — which then fails the next `guard`. Correct capture is `tail -1`.
- **Expected**: labelled or JSON output (e.g. `intent_id=<uuid>` or a `--format json`) so the id is parseable without positional assumptions — consistent with PDR-055 universal CLI API-surface-design consistency.
- **Candidate cure**: emit the intent_id as a labelled/JSON field; align with the agent-tools-cli-ergonomics conformance guard (PDR-055).
- **Target surface**: `collaboration-state commit-queue enqueue` output; `agent-tools-cli-ergonomics.plan.md`.
- **Status**: open.
- **Owner direction status**: unsolicited.

### F-69 — No automatic cleanup for stale collaboration state (claims / seen-files / heartbeats); a gitignore gap lets a mis-placed seen-file get committed

- **Source**: loss-scan / owner-asked; 2026-06-18 (Wisteria spins Bark).
- **Surface**: `.agent/state/collaboration/` — `active-claims.json` (claims + `commit_queue`), `comms-seen/` (per-agent seen-files + `*.heartbeat.json` watcher-liveness), and mis-placed seen-files at the `collaboration/` root.
- **Observed**: cleanup of stale collaboration state is manual and recurring. This session alone: 3 abandoned commit-queue intents hand-cleared; a claim-close hand-rolled (four schema-fix iterations because `claims close` was not reached for); 31 stale `comms-seen/` files (seen-files + heartbeats from ended sessions, several 200–400 KB) accumulated with no sweep. Separately, Bluebell's watcher placed its seen-file at the `collaboration/` ROOT (not `comms-seen/`), so it escaped the gitignore and was committed (`380ca25db`). The recurrence (three manual state-toil instances in one session) is the signal that a mechanism is owed.
- **Expected**: stale claims, seen-files, and heartbeats are cleaned automatically; a mis-placed watcher artefact is still ignored, never committed.
- **Candidate cure**: a **session-open mechanical sweep** (start-right hook). State-staleness has a surface signature (timestamps), so it is the occupiable mechanical-fire + surface-detect + archive-response quadrant (PDR-098) — unlike semantic pathogens, a deterministic sweep works. The sweep runs the existing `collaboration-state claims archive-stale` AND archives/removes `comms-seen/` seen-files + heartbeats whose heartbeat mtime is past N× the watcher interval (dead watchers). The pieces already exist (`claims archive-stale`; the `liveness-heartbeat-cron` retirement signal) — the gap is the mechanical firing surface. Plus: broaden `.gitignore` (`*-seen.json` / `*.heartbeat.json` anywhere under `.agent/state/collaboration/`) and enforce the seen-file → `comms-seen/` placement so a mis-placed one cannot be committed.
- **Target surface**: a new `collaboration-state` sweep subcommand (or an extended `archive-stale`) wired into the start-right session-open hook; `.gitignore`; the watcher seen-file path resolution.
- **Status**: open.
- **Owner direction status**: owner-asked 2026-06-18 ("how can we make sure these are handled automatically?").

---

### F-70 — `comms list` has no time/`--since` filter, and there is no `comms recent`

- **Source**: this session (Merlin spins Cirrus, `5e7419`), 2026-06-19.
- **Surface**: `pnpm agent-tools:collaboration-state -- comms list`.
- **Observed**: To read events since session-open I reached for `comms recent --limit N` (does not exist) then `comms list --since <iso>` (`unknown option for comms list: --since`). The only narrowing knob is `--tail <n>`, so situational catch-up is "tail a guessed N and eyeball timestamps". For a session opening hours into a thread, the natural query is "everything since `<iso>`", which the CLI cannot express.
- **Expected**: A `--since <iso>` (and/or `--until`) filter on `comms list`, or a `comms recent` alias, so an agent can read exactly the window between session-open and watcher-arm without over-/under-reading.
- **Candidate cure**: Add `--since`/`--until` ISO filters to `comms list`; optionally a `comms recent` alias for `list --since <session-open>`.
- **Target surface**: `agent-tools/src/collaboration-state/cli-comms-commands.ts`.
- **Status**: open.
- **Owner direction status**: standing (owner 2026-06-19: "keep a clear record of all comms issues and other tooling frustrations so that we can fix them"; reinforces Pelagic `2dbd74f6`).

### F-71 — `pnpm agent-tools:*` wrapper buries the CLI's own error behind `ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL`

- **Source**: this session (Merlin spins Cirrus, `5e7419`), 2026-06-19.
- **Surface**: `pnpm agent-tools:collaboration-state -- <bad-subcommand>` (the documented canonical invocation).
- **Observed**: An invalid subcommand (`comms recent`) returned a multi-line pnpm recursive-run stack (`ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL ... Exit status 2 ... [ELIFECYCLE]`) that hid the actual CLI message. The CLI's own usage/error text only became visible by bypassing pnpm and calling `node agent-tools/dist/src/bin/agent-tools.js …` directly — which an agent should not have to discover. The rule corpus documents the pnpm form, so the noisy path is the documented path.
- **Expected**: The agent-tools CLI's own usage/error text surfaces cleanly through the pnpm wrapper on a bad subcommand/flag.
- **Candidate cure**: Have the `agent-tools:*` package scripts exec the bin without pnpm's recursive-run wrapper (direct `node …` in the script), or document the direct-`node` invocation as the canonical interactive form for read commands.
- **Target surface**: `agent-tools/package.json` scripts; `use-built-agent-tools-cli` rule / `comms-all-channels-watcher` rule docs.
- **Status**: open.
- **Owner direction status**: standing (owner 2026-06-19, as F-70).

### F-72 — `claims active-agents` requires an explicit `--active <path>` to the canonical claims file

- **Source**: this session (Merlin spins Cirrus, `5e7419`), 2026-06-19.
- **Surface**: `collaboration-state claims active-agents`.
- **Observed**: Run without args it errors `missing required option --active`; the agent must pass `--active .agent/state/collaboration/active-claims.json` — the single canonical, well-known location every other reader already assumes. The required-flag forces the agent to know and re-type the path that the tool could default to.
- **Expected**: `--active` defaults to `.agent/state/collaboration/active-claims.json` (overridable), matching how the watcher/inbox default their comms-dir from convention.
- **Candidate cure**: Default `--active` (and the optional `--closed`) to the canonical paths; keep the flags as overrides.
- **Target surface**: `agent-tools/src/collaboration-state/cli-claims-commands.ts`.
- **Status**: open.
- **Owner direction status**: standing (owner 2026-06-19, as F-70).

### F-73 — Heartbeat mode requires a claim, so pre-claim roles (successor-in-waiting / standby / scout) cannot emit a liveness heartbeat

- **Source**: this session (Merlin spins Cirrus, `5e7419`), 2026-06-19.
- **Surface**: `collaboration-state comms send --tag heartbeat` (and `comms append`).
- **Observed**: Heartbeat mode rejects `--body` and *requires* `--claim-id --intent-id --branch --current-cycle-label`. A `start-right-team` agent in a legitimate pre-claim state — successor-in-waiting (this session), `standby`, or `scout` per the skill's own role vocabulary — has no claim/intent/branch yet, so it cannot emit a typed heartbeat to signal "alive, not yet on a lane". The only liveness signals available pre-claim are a narrative broadcast and owner chat-visibility; the typed heartbeat surface is closed to exactly the roles whose presence is least otherwise visible.
- **Expected**: A pre-claim agent can emit a heartbeat with an honest no-claim lane label (e.g. `cycle=successor-in-waiting` / `standby`), without inventing a claim.
- **Candidate cure**: Allow `--tag heartbeat` with a lane/cycle label but no claim-id when the agent has no open claim (typed state becomes `{cycle: <label>, claim: none}`); or document that pre-claim liveness uses a narrative event and the consumer-absent exemption, so the gap is intentional rather than a discoverability trap.
- **Target surface**: `agent-tools/src/collaboration-state/cli-comms-commands.ts`; `liveness-heartbeat-cron` rule.
- **Status**: open.
- **Owner direction status**: standing (owner 2026-06-19, as F-70).

### F-74 — A full `pnpm build` in a fresh worktree fetches live upstream OpenAPI schema and dirties generated SDK files

- **Source**: this session (Merlin spins Cirrus, `5e7419`), 2026-06-19.
- **Surface**: `pnpm build` (turbo) → `@oaknational/sdk-codegen` build step.
- **Observed**: The first full build in a fresh off-main worktree regenerated `oak-sdk-codegen` generated files — `schema-cache/api-schema-original.json` version bumped (`0.7.0-69d2b6c…` → `0.7.0-f7c18ea…`, incl. a `/sequences/{slug}` → `/sequences/{sequence}` path-param rename) plus the generated types/zod. The build fetched a **fresher upstream schema live** rather than consuming the committed schema-cache, so a build that should be deterministic against the branch base instead pulled in upstream-spec drift owned by a different lane (`fix/align_with_upstream_api_spec`). On a migration branch this forces excluding the drift by explicit pathspec on every commit, and makes `pnpm build` non-deterministic w.r.t. the committed base (a real hazard for WS1, which regenerates codegen — upstream changes would silently contaminate the migration).
- **Expected**: A plain `pnpm build` uses the committed schema-cache and is deterministic; fetching fresh upstream is an explicit opt-in step (e.g. `pnpm sdk-codegen` with a fetch flag), never a side effect of `build`.
- **Candidate cure**: Make the sdk-codegen build step consume the committed schema-cache only; gate the live upstream fetch behind an explicit command/flag. Failing that, document `pnpm build`'s upstream non-determinism so migrations exclude codegen drift by pathspec.
- **Target surface**: `packages/sdks/oak-sdk-codegen` build pipeline; `docs/engineering/build-system.md`.
- **Status**: open.
- **Owner direction status**: standing (owner 2026-06-19, as F-70).

### F-75 — No standard surface alerts on PEER heartbeat-silence (silently-retired-peer detection)

- **Source**: comms event `9e3b5b01` FRICTION 4 residual (Snapper binds Coral, `0beea7`,
  2026-06-15); surfaced for folding but never reached the register (claim contention at capture).
- **Surface**: `agent-tools collaboration-state comms watch`; the liveness-heartbeat substrate
  (`liveness-heartbeat-cron`, `ping-before-escalate`).
- **Observed**: `comms watch` emits a line per *event*, not on *absence*. There is no standard
  mechanism that fires when a PEER's heartbeat goes silent, so detecting a silently-retired peer
  (heartbeat stops, no explicit close) currently needs a manual re-check or a bespoke poll loop —
  the exact gap that tempted a fork (correctly recorded, not forked, per `use-built-agent-tools-cli`).
- **Expected**: An optional, standard "alert on peer heartbeat-staleness" surface — e.g. a
  `comms watch --alert-stale-peers` mode (or a `claims`/heartbeat-aware monitor) that emits when a
  tracked peer's most-recent heartbeat exceeds a staleness multiple of its interval.
- **Candidate cure**: Add a staleness-watch affordance over the heartbeat stream; it interacts with
  F-44 (freshness must read the heartbeat stream to be correct) — both want `claims`/`comms` to
  treat the latest heartbeat event as the liveness source of truth.
- **Target surface**: `agent-tools/src/collaboration-state/` comms-watch / heartbeat read path.
- **Status**: open.
- **Owner direction status**: standing (agent-observed tooling friction is first-class user feedback).

---

### F-76 — Heartbeat mode still requires `--title`, but the help text implies it does not

- **Source**: Vesuvius calls Quench (`92cefc`), 2026-06-21 director session.
- **Surface**: `agent-tools collaboration-state comms append --tag heartbeat`.
- **Observed**: The heartbeat-mode help reads "the body is composed from typed state args instead
  … and `--claim-id` `--intent-id` `--branch` `--current-cycle-label` are required" but does NOT
  name `--title`. First heartbeat attempt with all four typed args failed `Error: missing required
  option --title`.
- **Expected**: Either auto-compose the title in heartbeat mode (the `liveness-heartbeat-cron` rule
  already fixes the exact subject format `Heartbeat: <agent_name> (<prefix>) — <lane>`, derivable
  from identity + `--current-cycle-label`), or name `--title` as required in the heartbeat-mode help
  clause.
- **Candidate cure**: Auto-derive the heartbeat title from identity + cycle label when `--title` is
  omitted in heartbeat mode (removes a redundant arg AND guarantees the canonical format).
- **Target surface**: `agent-tools/src/collaboration-state/cli-comms-commands.ts`.
- **Status**: open.
- **Owner direction status**: standing (record-all-frictions, owner 2026-06-21).

### F-77 — `comms reply` cannot reference a broadcast/narrative event; no way to set `in_response_to` on an `append`

- **Source**: Vesuvius calls Quench (`92cefc`), 2026-06-21 director session.
- **Surface**: `agent-tools collaboration-state comms reply` / `comms append`.
- **Observed**: PDR-064 Moment 2 (coordinator active-acknowledgement) should reference the Moment-1
  pre-positioning event via `in_response_to`. The pre-positioning is a `narrative` broadcast, but
  `comms reply --to-event-id <broadcast-id>` failed `directed message not found` — `reply` only
  resolves `directed` events. There is no `--in-response-to` option on `comms append`, so a
  broadcast acknowledgement can only reference its antecedent in prose (title/body), losing the
  machine-readable edge.
- **Expected**: A clean way to set `in_response_to` when acknowledging a broadcast — either let
  `comms reply` reference any event kind, or add `--in-response-to <id>` to `comms append`.
- **Candidate cure**: Add `--in-response-to <id>` to `comms append` (broadest fix; serves PDR-064
  Moment 2 and any broadcast→broadcast threading).
- **Target surface**: `agent-tools/src/collaboration-state/cli-comms-commands.ts`; interacts with
  PDR-064.
- **Status**: open.
- **Owner direction status**: standing (record-all-frictions, owner 2026-06-21).

### F-78 — `check-commit-message` is not an `agent-tools` subcommand; only reachable via the pnpm script

- **Source**: Vesuvius calls Quench (`92cefc`), 2026-06-21 director session.
- **Surface**: `agent-tools` CLI vs `pnpm agent-tools:check-commit-message`.
- **Observed**: `node agent-tools/dist/src/bin/agent-tools.js check-commit-message …` fails
  `unknown topic: check-commit-message`. The message check is reachable only via the separate
  `pnpm agent-tools:check-commit-message` script (a `tsx` invocation of
  `agent-tools/src/commit-advisories/check-commit-message.ts`). Every other check used this session
  (`collaboration-state`, `commit-queue`) is an `agent-tools` subcommand, so the inconsistency is a
  discoverability trap.
- **Expected**: `check-commit-message` reachable as an `agent-tools` subcommand (consistent surface),
  or the commit skill clearly stating it is pnpm-script-only.
- **Candidate cure**: Register `check-commit-message` (and the advisories orchestrator) as
  `agent-tools` subcommands alongside `commit-queue`.
- **Target surface**: `agent-tools/src/bin/agent-tools.ts` topic registry.
- **Status**: open.
- **Owner direction status**: standing (record-all-frictions, owner 2026-06-21).

### F-79 — `comms list` rejects `--now`; option surface inconsistent across comms subcommands

- **Source**: Vesuvius calls Quench (`92cefc`), 2026-06-21 director session.
- **Surface**: `agent-tools collaboration-state comms list`.
- **Observed**: `comms list --now <iso>` failed `unknown option for comms list: --now`, although
  `--now` is required on `comms append`/`reply`. An agent carrying a `$NOW` from prior comms calls
  naturally passes it and hits a hard error on a read-only command.
- **Expected**: Read-only subcommands accept-and-ignore `--now` (or the option surface is documented
  per-subcommand at a glance).
- **Candidate cure**: Accept-and-ignore `--now` on read-only comms subcommands; composes with F-09
  (full help on invalid flag).
- **Target surface**: `agent-tools/src/collaboration-state/cli-comms-commands.ts`.
- **Status**: open.
- **Owner direction status**: standing (record-all-frictions, owner 2026-06-21).

### F-80 — `comms show` needs `--event-id <id>`, not a positional id, while `comms list` prints bare ids

- **Source**: Vesuvius calls Quench (`92cefc`), 2026-06-21 director session.
- **Surface**: `agent-tools collaboration-state comms show`.
- **Observed**: `comms list` prints bare event ids per line, inviting `comms show <id>`, but
  `comms show <id>` fails `unknown argument: <id>` — the id must be passed as `--event-id <id>`.
  Small but a repeated stumble when triaging events from a `list` output.
- **Expected**: `comms show` accepts a positional event-id (the obvious shape given `list`'s output),
  or errors with "did you mean --event-id?".
- **Candidate cure**: Accept a positional event-id on `comms show` as an alias for `--event-id`.
- **Target surface**: `agent-tools/src/collaboration-state/cli-comms-commands.ts`.
- **Status**: open.
- **Owner direction status**: standing (record-all-frictions, owner 2026-06-21).

---

### F-82 — canonical `comms watch` Monitor filter `^\[` silently swallows every event (reference-shape drifted from emit format)

- **Source**: Aardvark turns Whisper (`3c3b32`), 2026-06-21 survey-orchestration session; owner-detected ("monitors failing to fire").
- **Surface**: `agent-tools collaboration-state comms watch` (the Monitor pipe filter) plus the reference-shape filters in `.agent/rules/comms-all-channels-watcher.md` (§"Fallback shape" / portable script) and `.agent/rules/use-monitor-for-event-driven-wake.md` (§"Reference Shape (Comms Watcher)").
- **Observed**: a watcher armed with the documented filter `grep --line-buffered -E '^\['` delivered ZERO notifications for ~10 events over ~50 min while the watcher process stayed healthy (heartbeat fresh, seen-file advancing — drain + markSeen ran, so the liveness self-check passed). The failure was SILENT: swallowed lines are indistinguishable from an idle stream. Cause, verified first-hand: the `comms watch` emit's first line is `--- NEW [BROADCAST] EVENT ---` — the channel tag is MID-line, not a leading `[`, so the `^\[` anchor never matches. The rule text claims the tag is "on its first line" — true as a substring, false as a line-prefix.
- **Expected**: copying the documented watcher invocation produces a working watcher; OR the filter structurally cannot drift from the emit format because one source owns both.
- **Candidate cure** (structural, per metacognition §"Cure Shape — Structural, Not Doc-Patch" + owner direction this session): the CLI EMITS the canonical Monitor watch invocation — e.g. `comms watch-command --platform <p>` returns the exact ready-to-run command string with the seen-file path derived from identity, the self-prefix, and the filter matched to the CLI's OWN current emit format; the agent runs it verbatim, so filter and format co-vary in one codebase (DRY, deterministic, drift-proof). Composable simplification: make `comms watch` emit ONE concise line per event by default (`--- NEW [TAG] :: <title>`), `--verbose` for the body — then no filter is needed at all. Point-fix (necessary now, but a once-cure): correct the `^\[` reference shape in the two rule files to `^--- NEW`-anchored, or pipe-less.
- **Target surface**: `agent-tools/src/collaboration-state/cli-comms-commands.ts` (emit format + a watch-command emitter); `.agent/rules/comms-all-channels-watcher.md` and `.agent/rules/use-monitor-for-event-driven-wake.md` (reference-shape point-fix).
- **Sibling**: F-81 (napkin candidate — rapid-comms `tail -F` whole-file re-dump + no self-exclusion). Both are watcher-config frictions where the agent hand-authors a watch whose correctness depends on a format/behaviour the CLI owns. The generated-invocation cure addresses the class (see Cross-Cutting Theme 6).
- **Status**: open; this session re-armed correctly (filter tested against a real event first-hand) as the interim.
- **Owner direction status**: standing (record-all-frictions, owner 2026-06-21); the owner explicitly proposed the generated-watch-command cure this session.

---

### F-83 — Whole-tree pre-commit gate makes a clean commit hostage to peers' in-flight WIP on a shared checkout

- **Source**: Cosmos calls Infinity (`survey` Pass-1) + Petrel herds Altitude, 2026-06-21/22 — both on the shared, actively-churning `docs/planning-and-validation` branch.
- **Surface**: `.husky/pre-commit` (the turbo `build type-check lint test` gate) and `pnpm repo-validators:check`, both of which run over the WHOLE working tree, not just the staged set; turbo additionally hashes the working tree.
- **Observed**: on a shared single checkout, a peer's *uncommitted* edits red-gate an unrelated clean commit. Concrete incidents: a docs-only survey commit re-ran a peer's `agent-tools/**` workspace gate because turbo hashed the peer's dirty tree (a peer mid-TDD-RED blocked the docs commit); a clean commit blocked twice by other agents' untracked mid-flight work (a peer's gap-ledger test, then an untracked ADR with a wrong-direction citation). Explicit-pathspec staging keeps the staged CONTENT disjoint, but the GATE still couples through the working tree.
- **Expected**: a committer's gate evaluates the committer's own staged set (or their own workspace), so one agent's in-flight WIP cannot block another's unrelated clean commit on a shared checkout.
- **Candidate cure**: structural — **separate `git worktrees` per concurrent agent** (the [`project_multi_developer_transition`] direction), so each agent's tree is independent. Interim — commit during a peer's broadcast `tree-green` window; if blocked, HOLD the conserved artefact on disk and retry at the next tree-green, never bypass the gate. Pairs with the gatekeeper-specialisation pattern (one agent runs the whole-repo gate sweep per window; others queue intents) for the single-checkout case.
- **Target surface**: the multi-developer/worktree transition; `.husky/pre-commit` + `repo-validators:check` scope (staged-vs-tree); the `check-singleton-per-window` / gatekeeper coordination doctrine.
- **Status**: open (structural cure is the worktree transition; interim is tree-green-window committing).
- **Owner direction status**: standing (record-all-frictions, owner 2026-06-21).

---

### F-84 — pending-graduations decision-debt count reads 0 regardless of live items (fenced entries are stripped before counting)

- **Source**: Petrel stirs Wingspan, 2026-06-22 dedicated-consolidation first-hand loss-scan — observed the fitness report show `Live decision-debt: 0` while two `status: pending` items were live in the register.
- **Surface**: `agent-tools/src/practice-fitness/item-count.ts` (`stripFencedBlocks` + `parseRegisterItems`) vs the entry format in `.agent/memory/operational/pending-graduations.md`.
- **Observed** (regex read first-hand): the canonical entry format is **unambiguous** in the code — `INLINE_ENTRY = /` + "`" +`\[(captured:…)\]`+ "`" + `/g`, i.e. a **backtick-wrapped square-bracket inline block** `` `[captured: … | status: …]` `` placed in prose. The parser also calls `stripFencedBlocks` (removes ` ``` `/`~~~` fenced blocks by design, so a documented schema *example* is not miscounted). The register's live entries drifted to a **` ```text `-fenced, bare pipe-field** shape (no backtick-bracket wrapper; the convention its own header wrongly documents as "a fenced bracket"). These conform to *neither* matcher: they are stripped as fences AND lack the `` `[…]` `` wrapper. So they are invisible → decision-debt reads **0 while live items exist** — a **false-green** on the buffer's *primary* health signal and the `consolidate-until-done` completion gate. The non-conformance is **silent**: the only malformed-detector (`LEGACY_BLOCK_MARKER`) catches the OLD multi-bullet shape, not the fenced-pipe-field shape, so these entries raise no finding. The same parse failure also disabled the **dwell** anti-starvation signal: `oldestLiveItemAgeDays` operates on parsed items, so it read null — the bug killed *both* the decision-debt count AND the oldest-undecided-item alarm, leaving a live item with no surfacing at all (both signals returned the moment the entries were reformatted to canonical form).
- **Expected**: a non-conforming entry-shaped block raises a loud `malformed` finding (as the legacy shape does) instead of being silently uncounted; the documented entry format and the parser agree.
- **Diagnosis (bug, not interpretation)**: the count of 0 is "correct" for zero *conforming* entries — the validator computes correctly, but the input does not conform and the non-conformance is silent. The only interpretive call ("which format is canonical?") is settled by the regex (inline `` `[…]` ``); the header is simply wrong, and making the validator count fenced blocks instead would reintroduce the schema-example miscount the fence-strip exists to prevent.
- **Cure** (two parts): (1) **data/doc** — reformat the live entries to the canonical inline `` `[captured: … | status: …]` `` and fix the header instruction; this alone makes the count correct. (2) **TDD validator hardening** (the recurrence-proof, architecturally-right cure per `verify-gate-fails-on-known-bad` + metacognition §Cure-Shape): add malformed-detection for an entry-shaped block (carries `captured:` … `| status:`) that is fenced or otherwise not in canonical form — RED (a fenced entry yields no finding today) → GREEN (it yields a `malformed` finding), mirroring `LEGACY_BLOCK_MARKER`. Converts the silent false-green into a loud conformance failure.
- **Target surface**: `agent-tools/src/practice-fitness/item-count.ts` (the malformed-detector); `.agent/memory/operational/pending-graduations.md` header + entry format; the `pending-graduations-schema-and-count-fitness` plan.
- **Status**: ADDRESSED (2026-06-22) — `validateRegisterItems` now flags an entry-shaped block lacking the canonical `[…]` wrapper as `malformed` (commit `f056285fb`, TDD), so the silent miscount is a loud `⚠ non-conformant entries` report line; the two live register entries were reformatted to canonical wrapped-inline form, and the count now reads 2 (soft) — the true decision-debt — instead of a false 0. The recurrence-proof cure (the detector) and the data fix both landed.
- **Owner direction status**: unsolicited (surfaced by the loss-scan; record-all-frictions standing).

### F-85 — `claims` commands need an explicit `--active` and do not resolve the coordination home (fragment from worktrees)

- **Source**: Snowdrop calls Topsoil (`f07539`), 2026-06-24 worktree-pilot bootstrap
- **Surface**: `agent-tools/src/collaboration-state/cli-claim-commands.ts`, `cli-specs.ts`
- **Observed**: `claims open|close|list|heartbeat` take a **required** `--active <path>` with no default and no `--repo-root` option. `comms` subcommands auto-resolve the coordination home to the primary checkout via `resolveCoordinationHome`; claims do not. From a linked worktree a relative `--active` writes a worktree-local `active-claims.json` invisible to peers — coordination silently fragments (the F-41 failure mode, but for claims rather than comms).
- **Expected**: claims resolve the same shared primary home as comms with no per-call ceremony, so a worktree-isolated agent's claims are visible to the team by default.
- **Candidate cure**: wire `resolveCoordinationHome(cwd)` as the `--active` default (with `--repo-root`/`--active` as the explicit escape hatch), mirroring `cli-comms-send.ts` / `cli-comms-validate.ts`.
- **Target surface**: `agent-tools/src/collaboration-state/cli-claim-commands.ts` (+ option defaulting)
- **Status**: open — blocking-class for the worktree-per-agent transition; workaround in use (Implementers pass an absolute `--active` to the primary checkout)
- **Owner direction status**: standing (record-all-frictions, event `2dbd74f6`)

### F-86 — pnpm script wrapper echoes `$ …` command lines to stdout, unusable for a Monitor watcher

- **Source**: Snowdrop calls Topsoil (`f07539`), 2026-06-24 worktree-pilot bootstrap
- **Surface**: `pnpm agent-tools:collaboration-state` (and sibling root scripts) under the `Monitor` tool
- **Observed**: the pnpm wrapper prints two `$ …` command-echo lines to stdout before the real output. The `Monitor` tool treats every stdout line as an event, so arming the canonical `comms watch` via the pnpm script emits spurious notifications. Had to bypass with a direct `node agent-tools/dist/src/bin/agent-tools.js …` invocation, which sits in tension with `use-built-agent-tools-cli` preferring the pnpm script.
- **Expected**: the canonical CLI invocation produces clean stdout (events only) so it composes with a background watcher without a documented bypass.
- **Candidate cure**: a quiet entrypoint or `--silent`-clean wrapper for watch/stream commands, or bless the direct-node invocation for Monitor in the rule.
- **Target surface**: root `package.json` scripts / `use-built-agent-tools-cli` rule / `comms-all-channels-watcher` rule
- **Status**: open
- **Owner direction status**: standing (record-all-frictions, event `2dbd74f6`)

### F-87 — no launch-in-worktree mechanism; worktree agents start in the primary checkout

- **Source**: Snowdrop calls Topsoil (`f07539`), 2026-06-24 worktree-pilot bootstrap
- **Surface**: agent session launch / worktree-per-agent operating model
- **Observed**: Implementer sessions intended for a worktree start in the primary checkout and must manually `cd` into their worktree before any work. Nothing binds a session to its worktree at launch; a forgotten `cd` runs the work (and gate builds) in the shared primary tree — the exact F-83 coupling worktrees exist to dissolve.
- **Expected**: an agent assigned a worktree begins with its working directory already in that worktree.
- **Candidate cure**: a worktree-aware launcher or a documented mandatory cd-first step in the worktree-per-agent transition; longer term, session-identity-keyed worktree creation on session open.
- **Target surface**: `worktree-per-agent-transition.plan.md` (lifecycle) / launch tooling
- **Status**: open — worktree-transition evidence
- **Owner direction status**: standing (record-all-frictions, event `2dbd74f6`)

### F-88 — `comms-seen` filenames embed the display name with spaces (quoting footgun)

- **Source**: Snowdrop calls Topsoil (`f07539`), 2026-06-24 worktree-pilot bootstrap
- **Surface**: `.agent/state/collaboration/comms-seen/<agent_name>.json`; `comms watch` / `comms inbox` `--seen-file`
- **Observed**: the seen-file convention is the full agent display name with spaces (e.g. `Snowdrop calls Topsoil.json`), so every watcher/inbox invocation must quote the path; an unquoted path silently mis-parses into the wrong file and the watcher re-emits every event each poll.
- **Expected**: a seen-file name that needs no quoting and cannot silently split on whitespace.
- **Candidate cure**: consume the lowercase-kebab `slug` already minted at `agent-tools/src/core/agent-identity/derive.ts:23` for the seen-file/heartbeat **filename** instead of the display `agent_name` (display-name ≠ filesystem-id). Single derivation point: `commsSeenFileForCodename(agent_name, …)` (`claims-open-watcher-gate.ts:67`) + `cli-comms-assert-watcher-live.ts:31` (`codename = self.agent_name`). Keep the display name in event *content*; only the *filesystem identifier* becomes machine-safe.
- **Not a per-agent hot-patch** (2026-06-27, Oyster spins Coral, first-hand): switching one agent's file to kebab breaks only that agent, because peers' live watchers + the F-95/`claims open` gates all key on the spaced `agent_name` form right now — which is itself the proof the entrenched convention cannot be opted out of per-agent. Needs the structural CLI fix landed with a dual-read backward-compat migration of the 88 existing files, when the multi-agent window is quiet.
- **Target surface**: `agent-tools` comms-seen path derivation (the `commsSeenFileForCodename` derivation point) / `comms-all-channels-watcher` rule convention text
- **Status**: open
- **Owner direction status**: standing (record-all-frictions, event `2dbd74f6`)

### F-89 — `claims open` requires `--now`; inconsistent timestamp-defaulting across the CLI

- **Source**: Snowdrop calls Topsoil (`f07539`), 2026-06-24 worktree-pilot bootstrap
- **Surface**: `agent-tools/src/collaboration-state/cli-claim-commands.ts` (`claims open`)
- **Observed**: `claims open` fails with `missing required option --now`, forcing a `date -u` substitution on every call. Timestamp-defaulting is inconsistent across the CLI (cf. F-79 where `comms list` *rejects* `--now`).
- **Expected**: interactive invocations default `--now` to the current time, with the explicit flag retained for deterministic/replay use.
- **Candidate cure**: default `--now` to `new Date().toISOString()` at the composition edge when the flag is absent; keep it overridable. Audit the whole CLI for one consistent timestamp-defaulting policy.
- **Target surface**: `agent-tools/src/collaboration-state/` command option defaulting (CLI-wide)
- **Status**: open
- **Owner direction status**: standing (record-all-frictions, event `2dbd74f6`)

### F-90 — fresh git worktree has no `node_modules` / `agent-tools/dist`; gates and the CLI cannot run there until bring-up

- **Source**: Juno tracks Apogee (`d58962`), 2026-06-24 worktree-pilot WS-A team-start (relayed to Director Snowdrop calls Topsoil `f07539`)
- **Surface**: `git worktree add` lifecycle / worktree-per-agent operating model
- **Observed**: a newly created worktree shares the `.git` object store but NOT `node_modules` or build outputs. Consequence: (a) gates (`pnpm test` etc.) cannot run in the worktree until `pnpm install` there; (b) the `agent-tools` CLI cannot run from the worktree at all (no `dist`), so an agent must run the whole coordination plane (comms/claims/heartbeat) from the PRIMARY checkout, relying on comms auto-resolve, while doing source work and gates in the worktree.
- **Expected**: a worktree is usable for its workstream (gates + CLI) shortly after creation without a manual, undocumented bring-up dance.
- **Candidate cure**: a documented worktree bring-up step (`pnpm install` in the worktree, and either build agent-tools there or bless running the CLI from primary); longer term, a worktree-aware launcher that primes `node_modules`/`dist` (or shares them safely) on creation. Pairs with F-87 (launch-in-worktree) and F-85 (claims `--active`).
- **Target surface**: `worktree-per-agent-transition.plan.md` (lifecycle / bring-up) / launch tooling
- **Status**: open — worktree-transition evidence
- **Owner direction status**: standing (record-all-frictions, event `2dbd74f6`)

### F-91 — session shell cwd resets to the primary checkout after every command (worktree commands silently run in the shared tree)

- **Source**: Swordfish tracks Driftwood (`4fe4cf`), 2026-06-24 worktree-pilot WS-B team-start (relayed to Director Snowdrop calls Topsoil `f07539`)
- **Surface**: harness Bash-tool cwd behaviour under the worktree-per-agent model
- **Observed**: an Implementer session intended to operate in its worktree has its shell cwd reset to the primary checkout after every command. A bare `pnpm test` (or any worktree-scoped command) therefore runs in the **shared primary tree** — the exact F-83 coupling worktrees exist to dissolve — unless every command is cd-prefixed or uses absolute paths. Compounds F-87 (no launch-in-worktree) and F-90 (no worktree bring-up).
- **Expected**: a worktree-bound session keeps its cwd in the worktree across commands, so worktree-scoped work cannot accidentally touch the primary tree.
- **Candidate cure**: a worktree-aware launcher that pins cwd to the worktree for the session; until then, a documented hard rule that every worktree command is cd-prefixed or absolute-pathed, surfaced in the worktree-per-agent transition plan.
- **Target surface**: launch tooling / `worktree-per-agent-transition.plan.md` (operating discipline)
- **Status**: open — worktree-transition evidence
- **Owner direction status**: standing (record-all-frictions, event `2dbd74f6`)

### F-92 — `comms send --tag heartbeat` still requires `--title`, but the HEARTBEAT MODE help does not say so

- **Source**: Snowdrop calls Topsoil (`f07539`), 2026-06-24 worktree-pilot heartbeat bring-up
- **Surface**: `agent-tools` `comms send --tag heartbeat`
- **Observed**: the help's HEARTBEAT MODE clause lists `--claim-id / --intent-id / --branch / --current-cycle-label` as required and says the body is composed from typed state args — implying those are the only required inputs. But `--title` is also still required; omitting it fails with `missing required option --title`. Every agent arming a heartbeat hits this on the first attempt.
- **Expected**: heartbeat mode either composes the title from typed args (as it composes the body), or the HEARTBEAT MODE help names `--title` in the required list.
- **Candidate cure**: compose the canonical `Heartbeat: <agent_name> (<prefix>) — <cycle>` title from the identity tuple + `--current-cycle-label` when `--title` is absent in heartbeat mode; failing that, add `--title` to the documented required set.
- **Also — rule-text drift (2026-06-27, Hearth tracks Tallow + Hawthorn, first-hand)**: the two heartbeat-emit surfaces disagree on `--created-at`. `comms send --tag heartbeat` *rejects* `--created-at` (`unknown option`); `comms append --tag heartbeat` *accepts* it. But `liveness-heartbeat-cron.md` §Loop hygiene tells every agent to "pass a single timestamp to both `--now` and `--created-at`" — correct for `comms append`, wrong for `comms send`. An agent copying the rule onto `comms send` hits the rejection, then the missing-`--title` failure, before its first heartbeat emits (a silently-failing heartbeat loop reads as retirement to peers). Cure: correct the rule's §Loop hygiene + §Canonical-invocation to match the live surface it names (no `--created-at` for `comms send`; `--title` required), or unify the two heartbeat-emit surfaces' arg handling.
- **Also — the canonical loop omits the CLAIM heartbeat refresh (2026-06-27, Hawthorn 7d-audit + Hearth, first-hand)**: `liveness-heartbeat-cron.md`'s canonical loop emits the *comms* heartbeat each tick but never runs `claims heartbeat`, so the open claim's mechanical `heartbeat_at` is never refreshed and diverges from comms-liveness — a live Director read mechanically STALE at ~5h while heartbeating every ~4min (the F-98 claim-vs-comms split; a `ping-before-escalate` cross-check is what prevents a false retirement-detection). Cure: the canonical heartbeat loop must refresh BOTH per tick — emit the comms heartbeat AND run `claims heartbeat` for the open claim — and the rule's §Loop hygiene / §Canonical-invocation must name the claim refresh, so the mechanical liveness check agrees with reality.
- **Target surface**: `agent-tools/src/collaboration-state/` comms-send heartbeat-mode arg handling + help text; `.agent/rules/liveness-heartbeat-cron.md` §Loop hygiene / §Canonical invocation
- **Status**: open
- **Owner direction status**: standing (record-all-frictions, event `2dbd74f6`)

### F-93 — `comms send --body` 1500-char limit has no clean home for a long directed coordination steer

- **Source**: Snowdrop calls Topsoil (`f07539`), 2026-06-24 worktree-pilot WS-B steer
- **Surface**: `agent-tools` `comms send --body`
- **Observed**: a substantive directed steer (a reshaped-scope correction to a peer) exceeded the 1500-char `--body` limit. The error directs longer content to `--body-file` "stored in a handoff record, plan file, or PDR" — but a live coordination steer is none of those (handoff records are for retirement; plans/PDRs are not steer surfaces). The 1500 limit is by-design for scannability, but the overflow guidance has no natural durable home for steer-class content, forcing either ad-hoc shortening or a misfiled artefact.
- **Expected**: a clean path for an occasionally-long directed steer — either a higher directed-event body ceiling, or a blessed steer/handoff body location that is not a plan/PDR.
- **Candidate cure**: allow `--body-file` from an ephemeral coordination scratch location for `directed` events, or raise the directed-event ceiling above broadcast (directed steers are point-to-point, not stream-scannability-sensitive in the same way).
- **Target surface**: `agent-tools` comms-send body-length policy / directed-event handling
- **Status**: open (low severity; by-design tension)
- **Owner direction status**: standing (record-all-frictions, event `2dbd74f6`)

### F-94 — `claims` CLI has no adopt/transfer and cannot set `handoff_record_path`

- **Source**: Director-handoff "Known friction" (`.agent/memory/operational/director-handoff.md`), 2026-06-25 worktree-pilot Director succession (PDR-063 mid-cycle handoff).
- **Surface**: `agent-tools/src/collaboration-state/cli-claim-commands.ts` (`claims open|close|list|heartbeat`); no `claims adopt` / `claims set-handoff` subcommand.
- **Observed**: a PDR-063 mid-cycle handoff requires the outgoing Director to retain a claim for the successor and the successor to adopt it, but the CLI has no `claims adopt --claim-id <id>` (transfer ownership of an existing claim) and no `claims set-handoff --claim-id <id> --path <path>` (record the `handoff_record_path` on a claim). Worked instance 2026-06-25: reusing `--claim-id` on `claims open` to "transfer" a claim created a DUPLICATE active-claims row (two rows sharing one `claim_id`) rather than transferring ownership — recovery was to close all rows and open fresh (`f2a17e85` → `d8533d0d`). Hand-editing `active-claims.json` to set the handoff path or transfer ownership is unsafe in a busy multi-writer window.
- **Expected**: an outgoing role-holder can hand a claim to a successor and set its handoff-record path through the CLI, without duplicate rows or hand-edits.
- **Candidate cure**: add `claims adopt --claim-id <id>` (rewrites the holding agent identity on an existing row, no new row) and `claims set-handoff --claim-id <id> --path <path>` subcommands; the PDR-063 substrate is the sibling design (ADR-182).
- **Target surface**: `agent-tools/src/collaboration-state/cli-claim-commands.ts`, `cli-specs.ts`; PDR-063 / ADR-182.
- **Status**: fixed-2026-06-25-commit-e95fb9594 — `claims adopt` + `claims set-handoff` landed (PR #225); no duplicate-row workaround.
- **Owner direction status**: standing (record-all-frictions, event `2dbd74f6`)

### F-95 — No start-right watcher-presence fail-fast gate

- **Source**: Director-handoff "Known friction" (`.agent/memory/operational/director-handoff.md`), 2026-06-25 worktree-pilot session.
- **Surface**: session-open / `start-right-team` (`oak-start-right-team`); `.agent/rules/comms-all-channels-watcher.md` (prose rule only).
- **Observed**: the "arm the all-channels comms watcher as move 1" rule is prose, backed by agent diligence rather than a mechanical gate. Worked instance 2026-06-25: an implementer skipped arming the watcher under ceremony-aversion ("read-only / n=2 / minimal"), went blind to a simultaneous identical-branch claim, and never re-armed. Nothing failed fast to catch the missing watcher.
- **Expected**: starting team work without a live comms watcher fails fast at session-open, so the constitutive team-visibility rule is enforced mechanically rather than relied on as diligence.
- **Candidate cure**: a session-open / `start-right-team` check that detects no live comms watcher (no fresh `*.heartbeat.json` for this session's watcher under `.agent/state/collaboration/comms-seen/`) and fails fast / refuses to proceed until one is armed. Distinct from F-69's session-open stale-state *sweep* — this is a watcher-presence *gate*.
- **Target surface**: `oak-start-right-team` skill / a session-open check; `.agent/rules/comms-all-channels-watcher.md` (prose → backed by a gate). Relates to F-69 (adjacent session-open hook).
- **Status**: fixed-2026-06-25-commit-e95fb9594 — watcher-presence gate landed (PR #225): `comms assert-watcher-live` move-1 check (A) + `claims open` blind-write backstop (B), solo-exempt. Broader than the original candidate cure (move-1 check only).
- **Owner direction status**: standing (record-all-frictions, event `2dbd74f6`)

### F-96 — Continuity-buffer handoff commit blocked by markdownlint

- **Source**: Director-handoff "Known friction" (`.agent/memory/operational/director-handoff.md`), 2026-06-25 worktree-pilot Director handoff.
- **Surface**: `.husky/pre-commit` markdownlint gate over shared multi-agent continuity buffers (`.agent/memory/active/napkin.md`, `distilled.md`, registers, director-handoff, repo-continuity).
- **Observed**: a mid-arc Director handoff commit can hit a markdownlint wall because the shared continuity buffers it must touch carry pre-existing MD trips from other agents' writes. The only path to land the handoff commit is then a full dedicated-consolidation pass (rotate + lint the whole buffer set) before any handoff commit can land — the handoff is held hostage to the entire buffer set's pre-existing lint debt rather than just its own clean files.
- **Expected**: a handoff commit can land its own clean files without first clearing the whole buffer set's pre-existing lint debt.
- **Candidate cure**: a lint-incremental / per-committer-scope path (lint only the committer's own changed files, or only the lines this commit touches) so a clean handoff commit is not blocked by debt it did not introduce. Distinct from F-83's structural cure (per-agent worktrees) in that it targets the handoff-commit unblock specifically.
- **Target surface**: `.husky/pre-commit` markdownlint scope (changed-files vs whole-tree); relates to F-83 (whole-tree pre-commit gate hostage) and F-39 (markdownlint MD004 wrap).
- **Status**: open — captured for the next team session; interim cure is the dedicated consolidation pass (rotate + lint, then commit).
- **Owner direction status**: standing (record-all-frictions, event `2dbd74f6`)

### F-97 — No PR monitor covers inline review comments and PR terminal state together

- **Source**: Director-handoff "Known friction" (`.agent/memory/operational/director-handoff.md`), 2026-06-25 worktree-pilot session (the PR #220 / #222 inline-finding blind spot).
- **Surface**: PR-watch / PR-monitor tooling; `gh pr checks` (covers check-status only).
- **Observed**: no single monitor surfaces a PR's inline review comments together with its terminal state (merged / closed / review-decision). `gh pr checks` shows check status but is blind to inline bot/reviewer findings; the standing workaround is to poll `gh pr view N --json state,reviewDecision`, `gh api repos/.../pulls/N/comments`, and `gh pr view N --json comments` by hand. The cost is a Director can miss an inline finding (the PR #220 / #222 Proto-finding blind spot) when relying on the check-status view alone.
- **Expected**: one monitor watches a PR for both new inline review comments and its terminal/review-decision state, with fail-loud notification.
- **Candidate cure**: extend a PR-watch command to poll inline review comments (`pulls/N/comments`) and review-decision/terminal state alongside check status, surfacing new inline findings as events.
- **Target surface**: agent-tools PR-watch / PR-monitor command.
- **Status**: open — secondary to F-94/95/96; captured for the next team session.
- **Owner direction status**: standing (record-all-frictions, event `2dbd74f6`)

### F-98 — No authoritative agent↔worktree↔branch↔liveness registry; the binding is split across divergent, partly-authored surfaces

- **Source**: Seal hunts Offing (`8210d6`), 2026-06-25 — surfaced by an owner probe ("what worktree are you on? how did you know?") during the F-94/F-95 fix-before session, which exposed that an agent cannot determine its own work-location from recorded state, only from carried belief.
- **Surface**: the whole agent-work-state estate — `active-claims.json` (`.agent/state/collaboration/active-claims.json`), the comms heartbeat event stream, the watcher heartbeats (`.agent/state/collaboration/comms-seen/*.heartbeat.json`), and `git worktree list`.
- **Observed**: there is **no single authoritative surface** that binds a running agent's `(PDR-027 identity → worktree → branch → liveness)`. The four facts are scattered, each surface missing a piece, and the closest thing to a registry records the binding as **authored free-text**, not **derived ground truth**:

  | Surface | identity | branch / worktree | liveness | maintenance |
  | --- | --- | --- | --- | --- |
  | `active-claims.json` (the de-facto "active agents" registry) | ✅ structured | ❌ only as free-text inside `intent` (by convention) | ⚠️ `freshness_status` = `claimed_at + window`, **not** true liveness | mechanical **only when** an agent calls the `claims` CLI (agent-driven, not automatic) |
  | comms heartbeat events (`comms send --tag heartbeat --branch …`) | ✅ | ✅ `--branch` is structured | ✅ per-emit | append-only **event stream**, not a current-state table |
  | watcher heartbeat (`comms-seen/*.heartbeat.json`) | ✅ | ❌ none | ✅ **true** liveness (mtime, 30 s cadence) | genuinely mechanical, but per-agent and branch-blind |
  | `git worktree list` | ❌ none | ✅ branch + worktree path | n/a | git-maintained ground truth, but **no agent binding** |

  Worked instances this session, all first-hand: (1) asked "which worktree am I on", I could not answer from any recorded surface — the shell `cwd` resets to the primary checkout after every command, and nothing records the agent→worktree binding, so I re-derived it from `git worktree list` + a branch name I was carrying in context (not grounded). (2) The dead `agent-tooling-pr-watch` claim read `freshness_status: fresh` while its watcher heartbeat had been stale ~3.35 h — claim freshness is not liveness. (3) `grep` confirmed `branch` is absent from `active-claims.schema.json` and `types.ts`; the only structured `branch` lives on heartbeat **events**, and the watcher heartbeat carries no branch.
- **Expected**: an agent (and its peers, and the owner) can read a **single authoritative, mechanically-maintained surface** that answers, for every live agent, "who, on which worktree, on which branch, last alive when" — and an agent can deterministically assert its own binding rather than carry it as unverified belief.
- **Impact**: this is the substrate of the worktree-per-agent transition (the strategic root of the pilot: many checkouts, variable agent density, author-agnostic substrate — `[[project_multi_developer_transition]]`). Without the binding being observable: collision-avoidance degrades (two agents can take the same branch — the F-95 founding failure's cousin); `freshness`-based liveness misleads (stale "fresh" claims); handoff/adoption (F-94) and the watcher gate (F-95) all resolve work-location from convention, not from a queried fact; and the owner cannot glance at who-is-where.
- **Candidate cure** (the owner's explicit framing 2026-06-25: *we can change what we record, how, and when we update it; divergent/redundant surfaces are licence to build a better system* — so this is NOT "add a `branch` field to the claim schema", which would deepen the divergence):
  - **Derive, do not author** (`principles.md` §Context Specificity Gradient — *generated state beats authored state; authored state is a pressure signal*). Branch/worktree are git ground truth (`git worktree list`); liveness is the watcher heartbeat mtime. The registry should **project** these, not ask agents to retype them into `intent`.
  - **Decompose at the tension, do not collapse** (`principles.md` §Decompose at the Tension). Three genuinely distinct signals must be preserved: *claimed intent* (mutable, agent-asserted — "I intend to work here"), *observed liveness* (mechanical — "a process is alive"), and *git ground truth* (worktree/branch). A naive unification that flattens them loses signal; the cure unifies the **read surface** while keeping the three sources distinct.
  - **Replace, do not bridge** (`principles.md` §No escape hatches / §No legacy surfaces). Do not add a fifth surface or a free-text convention on top; make **one** surface authoritative and reconcile or retire the others (the heartbeat event stream, the free-text `intent` branch, the freshness-as-liveness conflation).
  - **Strict and complete** (`principles.md` §Strict and Complete): close the `freshness ≠ liveness` gap — a registry of live agents must reflect *actual* liveness (heartbeat mtime), not a time-window that outlives a dead process by hours.
  - **Practice-owned, host-implemented** (`principles.md` §Context Specificity Gradient): agent identity / coordination / liveness are Practice-owned capabilities; the doctrine belongs in practice-core, the implementation in `agent-tools`. Relates to the F-10 "identity as a first-class concept" theme and the `agent-state-observable` rule.
  - This cure is **larger than a CLI tweak** and should graduate to a plan (and likely an ADR/PDR for the agent-work-state model) rather than be patched in the register; the register entry **names** the decision, it does not make it.
- **Target surface**: a redesigned agent-work-state model — candidate home `agent-tools/src/collaboration-state/` for the projection/reconcile logic + a practice-core doctrine record; `active-claims.json` and the heartbeat/watcher surfaces are the inputs to reconcile or subsume. Decision-gated, not yet built.
- **Status**: open — decision-class (whether/how to build the unified registry). Strongly related to F-10 (identity model), F-69 (stale-state sweep — liveness reconciliation), F-95 (watcher-presence gate — same liveness signal), and the `worktree-per-agent-transition` plan. Resolves Decision Lens #4 ("would it be simpler if the system changed?") with **yes**.
- **Owner direction status**: owner-directed capture 2026-06-25 ("capture it as a friction, in great detail; we can change what/how/when we record, and build a better system from divergent surfaces").

---

### F-99 — All-channels comms watcher has no observer/low-engagement mode; a passive role pays a per-heartbeat context tax

- **Source**: Chinook turns Halo (`cdc2e6`), 2026-06-27 — Director-in-Waiting session under owner direction "keep actions to the absolute minimum necessary, preserve context, stay abreast of developments". Armed the canonical all-channels watcher to stay abreast, then stopped it within minutes once the re-invocation cost showed.
- **Surface**: `pnpm agent-tools:collaboration-state -- comms watch`; the [`comms-all-channels-watcher`](../../rules/comms-all-channels-watcher.md) rule; the host re-invocation per emitted event (`Monitor` on Claude Code).
- **Observed**: the watcher emits one notification per new event with self-exclusion only — the rule mandates "emit everything; apply relevance triage in agent reasoning, not at the watcher boundary". On the host each emitted event re-invokes the agent, which reads its whole context. In an n=3+ window heartbeats alone (~4-min cadence × 3–4 agents ≈ 1/min) dominate the stream; for a **passive observer** (Director-in-Waiting, standby, or any non-claim-holding role) every heartbeat wake is pure context drain with zero actionable content, and triaging "in reasoning" still pays the full re-invocation cost *before* the triage.
- **Expected**: a passive/observer session can stay abreast of *developments* (directed, narrative, non-heartbeat broadcasts, lifecycle) without a per-heartbeat re-invocation tax.
- **Candidate cure**: add an **opt-in observer consume-mode** to `comms watch` that suppresses `tag:heartbeat` events (and optionally `[OBSERVED]` cross-traffic) at the *notification* boundary, OR a digest mode collapsing liveness pings into a periodic summary. Scope it to roles that are **not** active claim-holders so the all-channels emit-everything default — the only safe mode for active participants (the F-95/2026-05-22 founding failure) — is preserved. This is the same value-contingency PDR-082 n=2 (drops heartbeats when the consumer is chat-visible) and the PDR-078 §4 consumer-absent exemption already recognise: heartbeat *consumption* is value-contingent, but the current watcher offers no dial for it.
- **Target surface**: `agent-tools/src/collaboration-state/cli-comms-watch.ts` (the `comms watch` command + its notification-boundary filter; `cli-comms-commands.ts` holds only the `append`/`render`/`migrate` subcommands); [`comms-all-channels-watcher`](../../rules/comms-all-channels-watcher.md) (name the observer-mode exception); possibly [`collaboration-is-value-contingent`](../../rules/collaboration-is-value-contingent.md) doctrine. Relates to F-95 (watcher presence) and F-98 (agent-work-state registry) — same heartbeat signals, different concern (consumption cost, not presence or binding).
- **Status**: open
- **Owner direction status**: owner-directed capture 2026-06-27 ("note it in the napkin and the tooling frustration register").

---

### F-100 — No workspace-creation skill, and no per-category config canon; new-workspace scaffolding is manual and error-prone

- **Source**: Alder tracks Topsoil, 2026-06-26 — creating `packages/core/safe-path` (the SSOT extraction of `assertPathWithinBase` for PR #242). Owner-directed need (2026-06-26).
- **Surface**: new-workspace creation across the monorepo; per-workspace `package.json` / `tsconfig*.json` / `tsup.config.ts` / `vitest.config.ts` / `eslint.config.ts` / README / `src/index.ts`; `pnpm-workspace.yaml`; config-expert.
- **Observed**: scaffolding `safe-path` was manual and error-prone — mirror a sibling's full config set, **register in the EXPLICIT `pnpm-workspace.yaml` list (NOT a glob — easy to miss; missed on the first `pnpm install`, owner had to prompt)**, wire `workspace:*` deps into consumers, confirm turbo auto-discovery, run config-expert to catch divergences. Separately, config shapes diverge across workspaces with no agreed per-category canon — the `default` export condition is split 11-omit / 7-have, and config-expert wrongly called adding it a "MUST" (it is not; some packages legitimately ship without it, e.g. `type-helpers`).
- **Expected**: (a) a detailed workspace-creation skill, templated per workspace kind (core util / lib / sdk / app), that generates all config from the canonical sibling, registers in `pnpm-workspace.yaml`, wires deps, and verifies turbo + the config-expert patterns; (b) an agreed per-category config canon so new packages are consistent by construction and config-expert checks against the canon, not ad-hoc.
- **Candidate cure**: author the workspace-creation skill (templates per kind); precede it with an analyse-categorise-and-standardise pass over every workspace (assign a category, diff each against a per-category canonical template, decide principled vs accidental divergence under strict + LTAE). The two pair: the categorisation defines the canon the skill instantiates.
- **Target surface**: a new `.agent/skills/` workspace-creation skill + a config-categorisation analysis/plan; `pnpm-workspace.yaml`; per-category config templates.
- **Status**: open
- **Owner direction status**: owner-directed (2026-06-26) — both the skill and the categorisation.

---

### F-101 — Comms watchers outlive their agent and accumulate as orphan processes (no self-termination)

- **Source**: Hawthorn rides Foliage (`a1fb02`) + owner, 2026-06-27 — at owner-directed retirement, a clean-shutdown check found ~44 `comms watch` processes on the host and required manually proving none were orphaned Hawthorn watchers (the Monitor task had ended cleanly, but several watchers had been stopped/re-armed during the session). Owner: "we are accumulating dead watchers."
- **Surface**: `pnpm agent-tools:collaboration-state -- comms watch` run via the host's persistent background mechanism (`Monitor` on Claude Code); the [`comms-all-channels-watcher`](../../rules/comms-all-channels-watcher.md) rule; host process cleanup on session end.
- **Observed**: a watcher is a long-running process spawned per session and often re-armed several times. When the agent session ends — or the supervising wrapper is killed but the node grandchild is reparented (pnpm → node, SIGTERM not forwarded) — the watcher process can linger indefinitely. It consumes host resources and, because it keeps writing the F-95 heartbeat file, signals **false liveness** for an agent that has retired. Across a multi-agent day these accumulate, and disambiguating live from dead watchers (per agent) becomes manual and error-prone.
- **Cure shipped (basic)**: wrap the canonical watcher invocation in GNU `timeout`/`gtimeout` (default 3600 s) — see the [`comms-all-channels-watcher`](../../rules/comms-all-channels-watcher.md) canonical command and the README `timeout` prerequisite. Every watcher self-terminates after a fixed period; a live agent re-arms it on the Monitor exit-notification (the `--seen-file` cursor means no events are missed, only delayed by the re-arm), while a dead agent does not — so orphans cannot outlive the timeout. Runs un-guarded if coreutils is absent (no hard break). Dogfood-verified by re-arming the watcher under the wrapper — which caught a real bug: the first cut used a `${VAR:+$VAR 3600}` prefix that **zsh does not word-split** (it tried to exec a binary literally named `timeout 3600`, exit 127); fixed to a `set -- …; [ -n "$TB" ] && set -- "$TB" 3600 "$@"; exec "$@"` argv build that is zsh-safe, portable, and graceful.
- **Robust follow-up (the owner's "stay-alive signal" model)**: a renewable **lease** — the watcher self-terminates if an agent-renewed lease file goes stale beyond a TTL, the lease renewed automatically by a `Stop` hook so the agent's turn-completion is the stay-alive signal. This removes the basic timeout's periodic re-arm gap and ties watcher lifetime directly to agent liveness (and makes the F-95 heartbeat truthful again, since the watcher can no longer outlive its agent).
- **Caveat (both cures)**: `timeout` signals only its direct child; verify the pnpm wrapper forwards SIGTERM to the node watcher, else invoke node directly under `timeout` or use process-group termination — otherwise the node grandchild can still orphan when the wrapper is signalled.
- **Target surface**: [`comms-all-channels-watcher`](../../rules/comms-all-channels-watcher.md) (wrapped command — basic cure shipped here); `agent-tools/src/collaboration-state/cli-comms-commands.ts` (a future `--lease-file` / `--lease-ttl-ms` flag); the host hook layer (`Stop` hook lease renewal). Relates to F-95 (watcher-presence gate — same false-liveness signal) and F-99 (observer mode — same watcher lifecycle).
- **Status**: open — basic timeout cure shipped; lease+hook follow-up pending.
- **Owner direction status**: owner-directed (2026-06-27) — "write it up as a friction; implement the basic timeout version; add GNU `timeout` install instructions to the root README."

### F-102 — The `git push` hook substring-matches `-f` from later commands in the same compound

- **Source**: Pulsar calls Ether (`ce6ba6`), 2026-06-27 — a compound `git push … ; gh api … -f t=… -f b=…` was blocked by the `never-use-git-to-remove-work` hook as `"git push -f" is a history-destruction operation`, although the actual push carried no `-f`; the `-f` came from the later `gh api` flags in the same command string.
- **Surface**: the Bash PreToolUse guard's blocked-pattern matcher for `git push -f` / force-push; any compound shell command that pairs a plain `git push` with later `-f`-flagged tools (`gh api -f`, etc.).
- **Observed**: the matcher scans the whole command string, so `push` and a later `-f` co-occurring trip the force-push rule even when they belong to different sub-commands. A [[hook-policy-substring-discipline]] false-positive: the concept (no force-push) is correct; the match is over-broad.
- **Cure (workaround)**: isolate `git push` in its own Bash call, separate from any `-f`-flagged command. **Candidate durable cure**: tighten the matcher to require `-f`/`--force` as an argument *to* `git push` (token-adjacent), not anywhere in the string.
- **Target surface**: the Bash blocked-pattern guard config (force-push entry); `validate-policy-reappraisal` already requires a reappraisal direction on the entry. Relates to F-96 (over-broad lint/guard scope).
- **Status**: open — workaround known; matcher-tightening pending.

### F-103 — markdownlint-cli2 lints git-ignored `.agent/state/**` files, blocking pre-push on non-committed transients

- **Source**: Pulsar calls Ether (`ce6ba6`), 2026-06-27 — the pre-push full markdownlint (`markdownlint-check:root`) failed on git-ignored handoff records under `.agent/state/collaboration/handoffs/` (transient coordination files never committed), blocking a push whose committed content was clean.
- **Surface**: `markdownlint-cli2` config globs (`.agent/**/*.md` with `!`-excludes) vs git-ignore; the pre-commit gate is staged-only (`markdownlint-staged`) but pre-push runs whole-tree, which globs the filesystem (markdownlint-cli2 does not honour `.gitignore` by default).
- **Observed**: instance-tier untracked-by-design files (ADR-199/PDR-094) are still in lint scope, so a transient handoff's lint debt blocks an unrelated push. The interim fix is to make the transients lint-clean (editing files that are not even committed) — backwards.
- **Cure (durable, owner-surfaced)**: add a `!.agent/state/**` (or `gitignore: true`) exclude to the markdownlint-cli2 config so the lint scope matches the tracked surface. The config already excludes specific `.agent/state/` files (`shared-comms-log.md`, `cross-worktree-work-state.md`) — generalise it.
- **Target surface**: the markdownlint-cli2 config (`.markdownlint-cli2.*`); the `markdownlint-check:root` / `markdownlint:root` scripts. Relates to F-96 (over-broad gate scope), F-83 (whole-tree pre-commit hostage).
- **Status**: open — durable config cure identified, owner-surfaced.

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
6. **Hand-authored watcher invocation drifts from the surface it watches**
   (F-81, F-82): agents hand-type the Monitor watch command — filter,
   seen-file path, self-exclusion — whose correctness depends on an emit
   format or file-write behaviour the CLI owns. The filter silently swallows
   every event (F-82) or the `tail -F` re-dumps the whole file on rewrite
   (F-81). Structural cure: the CLI emits the canonical, identity-derived
   watch invocation (and/or a one-line-per-event default emit), so the config
   is generated, deterministic, and DRY, and cannot drift from the format it
   selects. Owner-proposed 2026-06-21.
7. **Divergent agent-work-state surfaces — authored where they should be derived**
   (F-98, relates F-10, F-69, F-95): the `(identity → worktree → branch → liveness)`
   binding is split across `active-claims.json`, the heartbeat event stream, the
   watcher heartbeats, and `git worktree list` — each holding a fragment, none
   authoritative, with branch held as free-text `intent` and "liveness" conflated
   with a claim's freshness window. Structural cure: one mechanically-maintained
   surface that **projects** git ground truth (worktree/branch) and watcher-mtime
   liveness rather than asking agents to author them, preserving the distinct
   claimed/observed/ground-truth signals. Owner-directed 2026-06-25; rises to a
   plan + likely an agent-work-state ADR/PDR.

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
