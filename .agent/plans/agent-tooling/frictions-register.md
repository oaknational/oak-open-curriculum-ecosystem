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
- **Status**: open / mitigated / addressed-in-plan-X / superseded
- **Owner direction status**: standing / session-scoped / unsolicited
```

Keep entries terse. Long-form analysis belongs in the napkin or in a
dedicated plan that this entry points to.

---

## Open Frictions

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
- **Status**: open
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
- **Status**: open

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
- **Status**: open

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
- **Status**: open

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
- **Severity**: high (substrate-wide blocker when triggered)

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
- **Status**: partially-addressed-in-33aeec40 — confirm against
  Fronded's `feat(agent-tools): improve collaboration cli ergonomics`
  bundle whether the gap is closed; if not, list as open.

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
- **Status**: open
- **Owner direction**: standing

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
    [--phase <queued|staging|pre_commit|abandoned|complete>]`
  - `commit-queue show <intent-id>`
- **Candidate cure**: Add the two commands above.
- **Target surface**: `agent-tools/src/commit-queue/cli.ts`
- **Status**: partially-addressed-in-33aeec40 — confirm against Fronded's
  `feat(agent-tools): improve collaboration cli ergonomics` bundle
  whether the gap is closed; if not, list as open.

---

## Mitigated / Addressed Frictions

*(none yet — first capture pass)*

---

## Cross-Cutting Themes

These run across multiple individual frictions and may justify their own
plan if the pattern continues:

1. **Discoverability** (F-01, F-02, F-03, F-04, F-09): agents repeatedly
   reach for semantic flag names that don't exist; full-help-on-invalid
   (F-09) is the structural cure for the whole class.
2. **Read-side CLI gaps** (F-07, F-08, F-11): the substrate has good
   write-side CLIs but agents fall back to Python for reads. The shape of
   the missing read commands is consistent (`list` + `show` + optional
   `watch`).
3. **In-flight refactor isolation** (F-06): development changes to
   agent-tools should not propagate to live sessions without explicit
   acceptance; this is a build/release boundary issue, not a CLI issue.
4. **Identity as a first-class concept** (F-10): name, prefix, seed,
   wordlist version — these need a single coherent identity model that
   tools can rely on.

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
