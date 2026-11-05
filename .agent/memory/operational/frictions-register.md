---
fitness_line_target: 1200
fitness_line_limit: 1800
fitness_char_limit: 130000
fitness_line_length: 100
fitness_content_role: reference
fitness_rationale: >-
  Set 2026-09-19 with the four-part lifecycle (continuity-practice.md §Disposition of
  Continuity Surfaces). The limits describe the register's function, a working list of
  OPEN frictions plus the recently settled, not its size on the day (4,545 lines, most of
  them settled entries that no consolidation step had ever moved). A reading past the
  limit is the signal that settled entries await the graduate-then-archive step.
overflow_disposition: 'leave-if-live (open, partially addressed, or cited by a live lane); else graduate, then archive to a dated file proven byte-identical — never before full processing, never split/shard (see continuity-practice.md §Disposition of Continuity Surfaces)'
merge_class: mostly-append-register
---

# Agent Tooling Frictions Register

Live capture of frictions, gaps, and observed failures in the agent tooling
substrate. Each entry has source citation, observed behaviour, expected
behaviour, candidate cure, target surface, and current status.

**This is a capture surface, not an execution plan.** Items mature into:

1. A line on a [`current/`](../../plans-backlog-2026-07/agent-tooling/current/) or [`future/`](../../plans-backlog-2026-07/agent-tooling/future/) plan when they
   fit existing scope, OR
2. A new [`current/`](../../plans-backlog-2026-07/agent-tooling/current/) or [`future/`](../../plans-backlog-2026-07/agent-tooling/future/) plan when they
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

An entry that states what code does is a claim: read the code first, and say in the entry what
was read. An entry that names an incident is asked the disclosure question before it is written:
would this be the first tracked pointer to private material? (2026-10-01: a security review of
drafted entries found one such pointer and five claims the code did not bear out.)

From F-218 the two estates (JC.net and OCE) share one id space: a new entry takes
the next number after the highest in either register, so an entry both estates
carry has one id and the same bytes.

---

## Friction Entries

Status lines are the disposition source of truth. Entries remain in this
section until a consolidation pass moves them; §Settled entries, archived, below, keeps one
index row per moved id so citations resolve, and the archive keeps the text. The 2026-09-30 move by
the two-estate consolidation is `archive/frictions-register-settled-2026-09-30.md`, 55 entries, each
verified in the tree by an analyst and re-read by the seat.

An entry with no Status line is open: no cure is recorded for it. Where an entry's own text
records a cure, its Status line says so.

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
- **Review 2026-09-30**: LIVE against the fixed claim:
  `agent-tools/src/commit-queue/options.ts:62-66` still throws a bare unknown-option error while the
  collaboration-state and core parsers print full help.

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
- **Review 2026-09-30**: LIVE: the owner-directed plan home for the deferred `--event-spec` and
  sanitisation options exists under neither `.agent/plans/` nor the agent-tooling backlog.
- **Same friction**: also filed as F-48, F-149, F-152 (an inline comms body meets the shell before the tool does); read them together, and
  count them once.

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
  [`current/skills-standardisation-and-adapter-generator.plan.md`](../../plans-backlog-2026-07/agent-tooling/current/skills-standardisation-and-adapter-generator.plan.md)
  (§Reality Reconciliation); generator + validator.
- **Status**: recorded — review deferred to a later session (owner direction
  2026-06-14). Gap ledger lives in the owning plan's §Reality Reconciliation.
  Partially addressed 2026-09-09 on the Oak line (MCP-706, ADR-125 amendment of
  2026-09-09), carried in at the 1.185.0 sync of 2026-09-17: the spec-portable
  fields `license`, `compatibility`, `metadata` and `allowed-tools` pass through,
  quoted, to both adapter surfaces, and a malformed spec field refuses the
  canonical; the prefix applies to every canonical, so `metadata.owned` (quoted
  `"true"`) is declared metadata rather than the trigger. Still open from the
  2026-06-14 observation: the owned/ingested consistency check and `claude-*`
  hoisting.
- **Owner direction status**: standing (agent-observed tooling friction is
  first-class user feedback); review-timing session-scoped (deferred 2026-06-14).

---

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
- **Expected**: **liveness and freshness are SEPARATE signals** (ratified
  2026-06-27, PDR-118 §4: "its freshness window is retired as a liveness signal and
  survives only as claim-TTL housekeeping, never read as alive"). Freshness
  (`claimed_at + freshness_seconds`) stays a staleness predicate for consolidation/
  archival; **liveness is PDR-078 event-recency** — any event (heartbeat or
  substantive) from the role within the staleness threshold. The bug is that
  liveness *consumers* read the freshness field; the fix is to point them at
  event-recency, **not** to fold heartbeat into freshness (that re-conflates).
- **Candidate cure**: move every liveness consumer off `freshness_status` onto a
  PDR-078 event-recency signal **WITH the PDR-118 OQ5 consumer-absent fallback**
  (when heartbeats are suspended — solo / n=2 / live-conductor, PDR-078 §4 — an
  actively-claimed agent falls back to claim-presence + direct observation, so it
  is NOT read dead). **A naive event-recency swap is unsafe**: it reads a
  heartbeat-exempt n=2/solo peer as dead and would permit the blind claim the
  watcher-gate exists to prevent (the F-95 founding failure). This makes the code
  fix **decision-class** — it needs the OQ5 composed mechanism, not a unilateral
  swap (tracked in `cost-of-collaboration.plan.md` §Team-session-readiness as the
  "composed liveness" item).
- **Consumers to fix (grounded 2026-06-28)**: `active-agents.ts` `visibilityStatus`
  (l.146-165) + `liveAgentIdentities` (l.226-237, filters `freshness_status ===
  'fresh'`); `claims-open-watcher-gate.ts` (l.37-39, the live-agent test);
  `cli-claim-query-commands.ts`; the TUI `operator-value.ts` / `snapshot.ts`
  `visibility_status` consumers. Plus F-98's stale cure-text ("liveness is the
  watcher heartbeat mtime" — mtime proves only watcher-presence, not agent
  liveness).
- **Target surface**: agent-tools collaboration-state claims freshness + the
  liveness consumers above; the schema field comments are corrected (2026-06-28).
- **Status**: open (behavioural mitigation: freshness_status is input-to-verify
  against the heartbeat stream); the structural code fix is gated on the OQ5
  composed-liveness design.
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
- **Same friction**: also filed as F-32, F-149, F-152 (an inline comms body meets the shell before the tool does); read them together, and
  count them once.

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
- **Instance, 2026-09-29** (the Director): the `prettier-tracked` step of the coordination sync's
  push gate failed with prettier refusing explicitly listed generated SDK files; it passed
  standalone in the same tree and on retry; whether a gate ran beside it is unrecorded.

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
- **Same friction**: also filed as F-154 (the negation-contrast tombstone has no structural detector); read them together, and
  count them once.

### F-66 — BSD `sed -i ''` transient siblings race directory watchers

- **Source**: distilled (2026-06-11→12); graduation drain 2026-06-16 (Skunk hunts Crescent) — quorum-rescued from a reject.
- **Surface**: BSD `sed -i ''` run over files inside a watched directory (FSEvents / comms watchers / Monitor tails).
- **Observed**: BSD `sed -i ''` creates transient `.!nnnnn!file` siblings during the in-place edit; these trip directory watchers, producing spurious wakes/noise.
- **Expected**: an in-place edit over a watched dir does not emit watcher events for transient scratch files.
- **Candidate cure**: pause or expect-noise on watchers before in-place sweeps over watched dirs; or write-to-temp-outside-the-watched-dir then rename in; or prefer the Edit tool. Watcher poll-loops should filter `.!*!*` / `*.tmp-*` transient names.
- **Target surface**: agent sweep discipline; watcher transient-name filtering.
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

### F-71 — `pnpm agent-tools:*` wrapper buries the CLI's own error behind `ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL`

- **Source**: this session (Merlin spins Cirrus, `5e7419`), 2026-06-19.
- **Surface**: `pnpm agent-tools:collaboration-state -- <bad-subcommand>` (the documented canonical invocation).
- **Observed**: An invalid subcommand (`comms recent`) returned a multi-line pnpm recursive-run stack (`ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL ... Exit status 2 ... [ELIFECYCLE]`) that hid the actual CLI message. The CLI's own usage/error text only became visible by bypassing pnpm and calling `node agent-tools/dist/src/bin/agent-tools.js …` directly — which an agent should not have to discover. The rule corpus documents the pnpm form, so the noisy path is the documented path.
- **Expected**: The agent-tools CLI's own usage/error text surfaces cleanly through the pnpm wrapper on a bad subcommand/flag.
- **Candidate cure**: Have the `agent-tools:*` package scripts exec the bin without pnpm's recursive-run wrapper (direct `node …` in the script), or document the direct-`node` invocation as the canonical interactive form for read commands.
- **Target surface**: `agent-tools/package.json` scripts; `use-built-agent-tools-cli` rule / `comms-all-channels-watcher` rule docs.
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
- **Status**: ADDRESSED 2026-06-28 (PR #273 `feat(agent-tools): comms peer-liveness for heartbeat-silence detection`, squash-merged `0be09bf05`). Ships a pure `peerHeartbeatLiveness` classifier over the PDR-078 heartbeat comms-event stream (active <4m / offline 4-10m / retired ≥10m) + a standalone `comms peer-liveness` command + a documented poll/Monitor alert recipe in `liveness-heartbeat-cron.md`; real-content-proven (read a retired peer at ~28m). The standalone read-surface + poll-recipe IS the shipped alert mechanism. **NARROW** — the in-loop **push** integration (`comms watch --alert-stale-peers`) was deliberately deferred as a thin follow-on consumer of the same pure function (keeps the event-watcher free of timer/absence concerns); F-44 (freshness must read the heartbeat stream) remains the related open consumer-fix, gated on the OQ5 composed-liveness decision.
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
- **Same friction**: also filed as F-92 (the heartbeat mode requires a title its help does not name); read them together, and
  count them once.

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

---

### F-86 — pnpm script wrapper echoes `$ …` command lines to stdout, unusable for a Monitor watcher

- **Source**: Snowdrop calls Topsoil (`f07539`), 2026-06-24 worktree-pilot bootstrap
- **Surface**: `pnpm agent-tools:collaboration-state` (and sibling root scripts) under the `Monitor` tool
- **Observed**: the pnpm wrapper prints two `$ …` command-echo lines to stdout before the real output. The `Monitor` tool treats every stdout line as an event, so arming the canonical `comms watch` via the pnpm script emits spurious notifications. Had to bypass with a direct `node agent-tools/dist/src/bin/agent-tools.js …` invocation, which sits in tension with `use-built-agent-tools-cli` preferring the pnpm script.
- **Expected**: the canonical CLI invocation produces clean stdout (events only) so it composes with a background watcher without a documented bypass.
- **Candidate cure**: a quiet entrypoint or `--silent`-clean wrapper for watch/stream commands, or bless the direct-node invocation for Monitor in the rule.
- **Target surface**: root `package.json` scripts / `use-built-agent-tools-cli` rule / `comms-all-channels-watcher` rule
- **Status**: open
- **Owner direction status**: standing (record-all-frictions, event `2dbd74f6`)

### F-90 — fresh git worktree has no `node_modules` / `agent-tools/dist`; gates and the CLI cannot run there until bring-up

- **Source**: Juno tracks Apogee (`d58962`), 2026-06-24 worktree-pilot WS-A team-start (relayed to Director Snowdrop calls Topsoil `f07539`)
- **Surface**: `git worktree add` lifecycle / worktree-per-agent operating model
- **Observed**: a newly created worktree shares the `.git` object store but NOT `node_modules` or build outputs. Consequence: (a) gates (`pnpm test` etc.) cannot run in the worktree until `pnpm install` there; (b) the `agent-tools` CLI cannot run from the worktree at all (no `dist`), so an agent must run the whole coordination plane (comms/claims/heartbeat) from the PRIMARY checkout, relying on comms auto-resolve, while doing source work and gates in the worktree.
- **Expected**: a worktree is usable for its workstream (gates + CLI) shortly after creation without a manual, undocumented bring-up dance.
- **Candidate cure**: a documented worktree bring-up step (`pnpm install` in the worktree, and either build agent-tools there or bless running the CLI from primary); longer term, a worktree-aware launcher that primes `node_modules`/`dist` (or shares them safely) on creation. Pairs with F-87 (launch-in-worktree) and F-85 (claims `--active`).
- **Target surface**: `worktree-per-agent-transition.plan.md` (lifecycle / bring-up) / launch tooling
- **Status**: ADDRESSED for the spawn-created path 2026-06-28 (PR #272 `feat(agent-tools): build spawned worktrees at creation (spawn-flow 1B)`, squash-merged `4b84ea702`). `agent spawn` now installs + builds the worktree at creation (build-at-spawn) — the worktree-aware-launcher priming the candidate cure named — so a spawn-created worktree is immediately usable for gates and the CLI. **NARROW** — a *manually* `git worktree add`-ed tree still needs bring-up; F-90 closes by construction as the spawn tool becomes the paved path for worktree creation (F-87 launch-in-worktree, in progress on the spawn-flow lane: 1C–1E + Phase 2). Pairs with F-91 (cwd-pinning), which remains open.
- **Owner direction status**: standing (record-all-frictions, event `2dbd74f6`)

### F-92 — `comms send --tag heartbeat` still requires `--title`, but the HEARTBEAT MODE help does not say so

- **Source**: Snowdrop calls Topsoil (`f07539`), 2026-06-24 worktree-pilot heartbeat bring-up
- **Surface**: `agent-tools` `comms send --tag heartbeat`
- **Observed**: the help's HEARTBEAT MODE clause lists `--claim-id / --intent-id / --branch / --current-cycle-label` as required and says the body is composed from typed state args — implying those are the only required inputs. But `--title` is also still required; omitting it fails with `missing required option --title`. Every agent arming a heartbeat hits this on the first attempt.
- **Expected**: heartbeat mode either composes the title from typed args (as it composes the body), or the HEARTBEAT MODE help names `--title` in the required list.
- **Candidate cure**: compose the canonical `Heartbeat: <agent_name> (<prefix>) — <cycle>` title from the identity tuple + `--current-cycle-label` when `--title` is absent in heartbeat mode; failing that, add `--title` to the documented required set.
- **Also — rule-text drift (2026-06-27, Hearth tracks Tallow + Hawthorn, first-hand)**: the two heartbeat-emit surfaces disagree on `--created-at`. `comms send --tag heartbeat` *rejects* `--created-at` (`unknown option`); `comms append --tag heartbeat` *accepts* it. But `liveness-heartbeat-cron.md` §Loop hygiene tells every agent to "pass a single timestamp to both `--now` and `--created-at`" — correct for `comms append`, wrong for `comms send`. An agent copying the rule onto `comms send` hits the rejection, then the missing-`--title` failure, before its first heartbeat emits (a silently-failing heartbeat loop reads as retirement to peers). Cure: correct the rule's §Loop hygiene + §Canonical-invocation to match the live surface it names (no `--created-at` for `comms send`; `--title` required), or unify the two heartbeat-emit surfaces' arg handling.
- **Also — the canonical loop omits the CLAIM heartbeat refresh (2026-06-27, Hawthorn 7d-audit + Hearth, first-hand)**: `liveness-heartbeat-cron.md`'s canonical loop emits the *comms* heartbeat each tick but never runs `claims heartbeat`, so the open claim's mechanical `heartbeat_at` is never refreshed and diverges from comms-liveness — a live Director read mechanically STALE at ~5h while heartbeating every ~4min (the F-98 claim-vs-comms split; a `ping-before-escalate` cross-check is what prevents a false retirement-detection). Cure: the canonical heartbeat loop must refresh BOTH per tick — emit the comms heartbeat AND run `claims heartbeat` for the open claim — and the rule's §Loop hygiene / §Canonical-invocation must name the claim refresh, so the mechanical liveness check agrees with reality. **Recurrence-confirmed 2026-07-15** (Barnacle calls Spray Director tenure: registry read `stale` for ~15h during continuous 4-min comms heartbeats; peer-caught at succession, not self-detected — the incident a pending-graduations 2026-07-15 capture initially duplicated before being routed here).
- **Target surface**: `agent-tools/src/collaboration-state/` comms-send heartbeat-mode arg handling + help text; `.agent/rules/liveness-heartbeat-cron.md` §Loop hygiene / §Canonical invocation
- **Status**: open
- **Owner direction status**: standing (record-all-frictions, event `2dbd74f6`)
- **Same friction**: also filed as F-76 (the heartbeat mode requires a title its help does not name); read them together, and
  count them once.

### F-93 — `comms send --body` 1500-char limit has no clean home for a long directed coordination steer

- **Source**: Snowdrop calls Topsoil (`f07539`), 2026-06-24 worktree-pilot WS-B steer
- **Surface**: `agent-tools` `comms send --body`
- **Observed**: a substantive directed steer (a reshaped-scope correction to a peer) exceeded the 1500-char `--body` limit. The error directs longer content to `--body-file` "stored in a handoff record, plan file, or PDR" — but a live coordination steer is none of those (handoff records are for retirement; plans/PDRs are not steer surfaces). The 1500 limit is by-design for scannability, but the overflow guidance has no natural durable home for steer-class content, forcing either ad-hoc shortening or a misfiled artefact.
- **Expected**: a clean path for an occasionally-long directed steer — either a higher directed-event body ceiling, or a blessed steer/handoff body location that is not a plan/PDR.
- **Candidate cure**: allow `--body-file` from an ephemeral coordination scratch location for `directed` events, or raise the directed-event ceiling above broadcast (directed steers are point-to-point, not stream-scannability-sensitive in the same way).
- **Target surface**: `agent-tools` comms-send body-length policy / directed-event handling
- **Status**: open (low severity; by-design tension)
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
- **Review 2026-09-30**: LIVE against its own drift: the pre-commit ran `markdownlint-staged` on the
  friction date (since 2026-05-12) and `.husky/pre-push:63-64` still lints every tracked Markdown
  file, so the per-committer or touched-lines scope asked for never landed.

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

### F-105 — Heartbeat loop label is frozen at arm-time, so a working agent reads as stalled

- **Source**: team-tooling session 2026-06-28 (Pangolin, Avocet, Dormouse, ~Bandicoot — 3-4
  instances); graduated by Quoll's dedicated consolidation 2026-06-29.
- **Surface**: the `liveness-heartbeat-cron` loop (`comms append/send --tag heartbeat
  --current-cycle-label <label>`).
- **Observed**: the loop's `--current-cycle-label` (and `--title`) are frozen at loop-start. An
  agent that goes heads-down on a fix after a lane transition without relabelling keeps emitting a
  stale label (e.g. "awaiting routing") while actively working — so the Director reads it as a
  likely-stalled/dead seat and nearly fires a rescue (it drove ≥2 receipt-checks this session).
- **Expected**: the heartbeat's lane/cycle label reflects what the agent is actually doing, without
  relying on the agent to remember to relabel at every transition.
- **Candidate cure**: cheap/now — relabel-at-transition (a named step of every lane change, already
  in the rule's loop-hygiene). Deeper (3-4 instances = strong signal) — **derive the label from the
  live claim's current cycle, not a frozen loop arg**, so it cannot go stale while the agent is
  active. Quasar's worked local cure: the loop reads `--current-cycle-label`/`--title` from a small
  file the agent rewrites at each transition.
- **Target surface**: `agent-tools/src/collaboration-state/` heartbeat composition; the
  `liveness-heartbeat-cron` rule loop-hygiene.
- **Status**: open. Distinct from F-44 (freshness≠liveness) and F-30 (stale syntax recovery).
- **Owner direction status**: standing (record-all-frictions, event `2dbd74f6`).
- **Instance, 2026-09-29** (a seat, OCE): a loop held the lane's claim id as a literal; when PR
  296's door closed the claim, every beat was refused into the loop's own log while the stream
  read silent. Cured by reading the id from a file each tick; JC's rule copy lacks that clause.

### F-106 — CLI help strings are a hand-maintained doc-drift surface; generate them from the spec table

- **Source**: team-tooling session 2026-06-28 (Lichen F-89: hand-edited `claimsOpenHelp` to mirror
  the option allowlist + a new default); the `--title`-in-heartbeat-mode help omissions; graduated
  by Quoll's dedicated consolidation 2026-06-29.
- **Surface**: `agent-tools/src/collaboration-state/cli-spec-help.ts` (~25 hand-written help
  strings).
- **Observed**: each command's help string must track its options + defaults + required/optional
  shape **by hand**; the help comment even states CLI-help tests are "the behavioural contract".
  Every option/default change risks a help string drifting from the spec (the recurring class
  behind F-35 and the heartbeat-`--title` omissions).
- **Expected**: help text cannot drift from the implementation because it is derived from it.
- **Candidate cure**: generate the help string FROM the option spec + a per-option default/required
  flag (the metacognition cure-shape: generate the doc from the implementation, don't patch the
  copy). Consolidates the recurring help-drift instances into one structural fix.
- **Target surface**: `agent-tools/src/collaboration-state/cli-spec-help.ts`, the CLI spec table.
- **Status**: open.
- **Owner direction status**: standing (record-all-frictions, event `2dbd74f6`).

### F-109 — `claims close` ergonomics: non-obvious required flags + closed registry is `closed-claims.archive.json`

- **Source**: Director closeout 2026-06-29 (Trawler mends Buoy, at the PDR-064 handover to Falcon
  wakes Stratus).
- **Surface**: `pnpm agent-tools:collaboration-state -- claims close`.
- **Observed**: a reasonable relinquish (`claims close --active <path> --claim-id <id> --platform
  --model --now`) exits 2 with no actionable hint; `close` additionally requires `--closed <path>`
  AND `--summary <text>`. The `--closed` guess `closed-claims.json` then ENOENTs — the registry is
  actually `closed-claims.archive.json`. So the relinquish failed twice before succeeding, after the
  closeout broadcast had already asserted "claim relinquished" (a false-statement window). (This
  checkout's agent-tools predates F-108's "default `--closed` to coordination home", so `--closed`
  was mandatory.)
- **Expected**: `claims close --claim-id <id>` resolves `--active`/`--closed` from the coordination
  home by default (as F-85/F-108 did for `--active`), derives a default summary, and on a missing
  required flag prints the exact missing-flag fix rather than a bare exit 2.
- **Candidate cure**: extend the F-108 coordination-home default to `claims close` (`--closed` →
  `closed-claims.archive.json`); make `--summary` optional with a derived default; emit an
  actionable usage line on exit 2. Same F-41/F-85 relative-path + discoverability class.
- **Corroboration (2026-07-02, Rosemary stirs Bracken)**: two further asymmetries in the same
  surface — `claims close` requires `--now` while `claims open` defaults it (the F-89 fix landed
  one-sided), and a `--summary` containing an apostrophe exits 2 through the pnpm wrapper (no
  `--summary-file` escape; use apostrophe-free summaries meanwhile). Fold both into the cure:
  default `--now` on close as on open; add a `--summary-file` option or fix the wrapper quoting.
- **Target surface**: `agent-tools/src/collaboration-state/` claims-close arg-parsing + path
  defaulting.
- **Status**: open.
- **Owner direction status**: standing (record-all-frictions); owner-directed capture at this closeout.

### F-110 — `gh` calls must route through a rate-limit-aware agent-tools command (batch + jitter + backoff)

- **Source**: owner direction 2026-06-29 (Falcon deep-closeout) — the owner raised a fleet-wide
  shared-resource broker as "a new concept in agent tooling." NB the triggering incident was
  **misdiagnosed**: a `403` on a `gh` GraphQL call was initially read as 5,000-budget exhaustion, but the
  evidence (`rate_limit` showing the *unauthenticated* signature `core.limit 60` / `graphql.limit 0`, and
  the authenticated budget ~94% free minutes later) showed it was a **transient unauthenticated/token
  blip**, not volume. So this entry is a **forward capability for genuine fleet shared-limit pressure**,
  not the cure for that incident.
- **Surface**: every direct `gh` / `gh api` / `gh api graphql` invocation across the agent estate —
  PR-checks polling, reviewThreads queries, merge, update-branch. The 5,000/hr authenticated budget is
  **shared** across all agents AND the Cursor/Sonar/Copilot bots — so genuine many-agent load will hit it.
- **Observed**: tight `gh` polling is real (a `Monitor` polling `gh pr checks` every 30 s; repeated
  `reviewThreads` queries) and is poor hygiene with no shared budget-governor — independent polling loops
  would collectively pressure the shared budget under genuine fleet load, with no graceful degradation.
  (It did NOT cause the 2026-06-29 incident, which was the transient-auth blip above — but it is the
  class of behaviour the broker exists to govern.) **Immediate operational lesson** (separate from the
  broker): read the `rate_limit` SIGNATURE — `limit 60` / `graphql.limit 0` means *unauthenticated*, not
  *budget exhausted*; on a 401/unauthenticated signature, check `gh auth status` and retry, never assume
  volume.
- **Expected**: a single agent-tools command/wrapper that all `gh` access routes through, providing:
  (a) **request batching** (one GraphQL query for checks + reviewThreads + state instead of three REST
  calls; batch multi-PR queries); (b) **jitter** on poll cadences so fleet calls don't align;
  (c) **exponential backoff with respect for the `Retry-After` / `X-RateLimit-Reset` headers** (sleep to
  reset, never hot-retry a 403); (d) **shared-budget awareness** — read `rate_limit` and back off as the
  remaining budget falls, reserving headroom; (e) **a long-poll/event alternative to 30 s `gh pr checks`
  loops** (the Monitor pattern should consume this, not raw `gh`).
- **Candidate cure**: `agent-tools gh <subcommand>` (or a `gh-budget` guard lib) wrapping the calls the
  Director/merge flows use most (`pr-status` = checks+threads+state in one GraphQL round-trip;
  `pr-merge`; `pr-update-branch`), with the backoff/jitter/budget-reservation logic centralised and
  tested. Replace the `pr-watch` / CI-check Monitor poll loops with it. Pairs with the existing
  "no PR monitor covers inline comments + terminal state" friction (one budgeted poller serves both).
- **NEW CONCEPT — fleet-wide shared-resource broker (owner direction, 2026-06-29).** The cure is bigger
  than a per-agent backoff wrapper: a tool that **collates requests from multiple agents** and serves
  them from **shared resource pools with shared limits** (one fleet budget, not per-agent ceilings).
  **The shared budget/pool STATE lives in the PRIMARY CHECKOUT** — the same coordination-home locus as
  `active-claims.json`, resolved via `git worktree list` (`resolveCoordinationHome`, the F-41/F-85
  lineage) — so every agent and worktree reads/writes ONE shared ledger instead of each polling blind.
  Budget reservation is read from that ledger (back off as the *shared* remaining falls; reserve
  headroom for higher-priority callers). The primitive **generalises beyond `gh`** to any shared
  rate-limited resource (the LLM API, Sonar, Vercel), with `gh` as the first consumer. This is a new
  multi-agent capability — a **candidate for its own plan/PDR**, not only a friction fix.
- **Target surface**: `agent-tools/src/` (a new fleet shared-resource broker + a `gh` budget-aware
  client over it; shared-ledger state under the primary-checkout coordination home) + the `pr-watch`
  command + the Monitor recipes in the Director brief.
- **Status**: open.
- **Owner direction status**: standing (owner-directed 2026-06-29 — "batch those requests via an
  agent-tools command with rate-limit handling, jitter, exponential backoff"; expanded same day — "a
  tool that collates requests from multiple agents and uses shared resource pools and limits; the
  'shared' part needs to live in the primary checkout").

### F-111 — Claude Bash-tool execution environment: sandbox silently blanks `.agent/memory/` content reads; the shell is zsh, not bash

- **Source**: Flare hunts Obsidian, 2026-06-30 (WS1 corpus run) — burned ~3 false-empty grep rounds;
  the two causes compounded and masked each other. Re-confirmed 2026-07-02 (this pass reads
  platform-memory files with the sandbox disabled).
- **Surface**: any Bash-tool content read (`cat`, `grep`, `sed -n`) over `.agent/memory/**` (and
  per-user `~/.claude/projects/**/memory/**`) in a sandboxed Claude Code session; any shell snippet
  written assuming bash semantics.
- **Observed**: (a) sandboxed `cat`/`grep` on those paths return **0 lines with exit 0 — no error**;
  `ls` (metadata) and the Read tool are unaffected, so the failure looks like empty files.
  (b) The shell is **zsh**: unquoted `$var` does NOT word-split (`cat $files` passes one joined
  string → "No such file"), and `local -n` namerefs are unsupported; cures are zsh arrays and
  `${(P)name}`.
- **Expected**: content reads either succeed or fail loudly; shell snippets behave per POSIX/bash
  assumptions or the dialect is surfaced.
- **Workaround (verified)**: use the Read tool for those paths, or pass
  `dangerouslyDisableSandbox: true` for corpus greps; write zsh-safe constructs (quote expansions,
  arrays over namerefs).
- **Candidate cure**: a documented "harness execution environment" note wherever corpus/memory
  tooling is described (the corpus-analysis tooling README carries a copy for its own recipes);
  candidate detector: a wrapper that stats the file first and fails loud on a 0-line read of a
  non-empty file.
- **Status**: open (documentation-level; behaviour is the platform's).

### F-113 — `commit-queue enqueue`/`guard` usage text omits required `--id`; `guard` error names the claim kind but not the re-enqueue cure

- **Source**: napkin 2026-07-03 (Mistral seeks Jetstream, F-112 execution session) — each
  omission cost one retry.
- **Surface**: `pnpm agent-tools:commit-queue -- enqueue` and `-- guard`.
- **Observed**: both commands require `--id` (the PDR-027 UUID, PDR-076a) but their usage
  text omits it — "missing required --id" surfaces only on failure. Separately, `guard`
  binds to the INTENT's claim, so an intent enqueued against a files-boundary claim fails
  guard; the error names the claim kind but not the cure (re-enqueue the intent against
  the `git:index/head` claim).
- **Expected**: usage text lists every required flag; the guard error names the
  re-enqueue-against-commit-window-claim cure.
- **Candidate cure**: add `--id` to both usage strings; extend the guard claim-kind error
  with the one-line cure. F-72..F-80 option-surface sibling.
- **Target surface**: `agent-tools/src/` commit-queue arg-parsing usage/error strings.
- **Status**: open.
- **Owner direction status**: standing (record-all-frictions).

### F-116 — `commit-queue guard` rejects the commit-window claim when its area-pattern is spelled `git:index/head`

- **Source**: napkin 2026-07-03 (Vega mends Oblivion, ws1b landing) — cost one claim
  close/reopen cycle.
- **Surface**: `claims open` (area shape) × `commit-queue guard` (`claimCoversGitIndexHead`,
  `agent-tools/src/commit-queue/guard.ts`).
- **Observed**: the guard matches `area.kind === 'git'` AND normalized patterns containing
  exactly `index/head`; a claim opened with `--area-pattern "git:index/head"` (the label the
  commit skill's prose uses throughout) fails with "is not an active git:index/head claim" —
  the error repeats the very label that caused the mismatch.
- **Second facet (2026-08-03 on the primary; 2026-09-07 in a worktree)**: the guard also
  refuses an intent enqueued under a files/lane claim, or under a window claim scoped
  `index/head@<worktree>`, with the same message, because it requires an ACTIVE claim on
  the bare `git:index/head` label OWNED by the enqueuer; on the shared primary the working
  flow is request the window, `claims adopt` at the grant, then enqueue. Under the owner's
  2026-09-07 ruling worktree lanes do not use the queue at all (F-169).
- **Expected**: either the guard accepts the composed `git:index/head` spelling, or
  `claims open` normalises it, or the error names the cure ("open the claim with
  --area-kind git --area-pattern index/head").
- **Candidate cure**: normalise the `git:` prefix off patterns under `kind: git` at
  claims-open or guard time; extend the guard error with the exact open command. Skill-side
  mitigation landed 2026-07-03 (the commit skill now states the flag spelling at the
  ceremony step).
- **Target surface**: `agent-tools/src/commit-queue/guard.ts` + claims-open normalisation;
  commit skill (mitigated).
- **Status**: open (skill-side mitigated 2026-07-03).
- **Owner direction status**: standing (record-all-frictions).

### F-117 — `commit-queue enqueue --claim-id` rejects a mistyped UUID with an opaque `unknown claim_id`

- **Source**: napkin 2026-05-22 window, rescued via the 2026-07-02 discovery run's
  unclustered-leaf stratum (w10-L10), dispositioned 2026-07-03 (Gust hunts Headwind).
- **Surface**: `commit-queue enqueue` (claim-id validation).
- **Observed**: copying a claim UUID assembled from the first half of one claim id and the
  second half of another produces a plausible-looking but nonexistent UUID; enqueue fails
  with only `unknown claim_id`, and finding the transposition took manual character-level
  string comparison against the registry.
- **Expected**: the error names the nearest active claim id(s) (prefix match or edit
  distance) or at least echoes the active claim ids for the agent's identity, so a
  near-miss is visible without manual diffing.
- **Candidate cure**: on unknown claim_id, list the caller's active claim ids in the error;
  optionally flag a close prefix match as a likely copy error.
- **Target surface**: `agent-tools/src/commit-queue/` claim resolution error path.
- **Status**: open.
- **Owner direction status**: standing (record-all-frictions).

### F-162 — pr-watch all-green exit ignores merge and review state

- **Source**: Director seat, 2026-08-17, first pr-watch arm after the
  hand-rolled-watcher correction.
- **Surface**: `pnpm agent-tools pr-watch <n> --watch`.
- **Observed**: `pr-watch 890 --watch` exited on ALL GREEN (every check
  passed, every thread resolved) while the PR stood
  `merge=CONFLICTING/DIRTY` and `review=CHANGES_REQUESTED` — the state
  where a watch is most wanted. The watch declared green and ended on a
  PR that cannot merge.
- **Expected**: ALL GREEN requires mergeable and no standing
  change-request; or a `--hold-until-merged` mode that exits only on
  merged/closed.
- **Candidate cure**: extend the exit predicate with mergeStateStatus
  and reviewDecision; keep the current predicate available behind a flag
  for callers that genuinely only care about checks+threads.
- **Target surface**: `agent-tools/src/pr-watch/`.
- **Status**: open.

### F-181 — a relative `PRACTICE_STATUSLINE_LOG_FILE` (earlier `OAK_STATUSLINE_LOG_FILE`) follows the seat's cwd into foreign repositories

- **Source**: Sandpiper weaves Updraft (`a96287`) 2026-09-12, found by free-play
  over the session's own material, then verified first-hand
- **Surface**: `.claude/settings.local.json` env block →
  `.claude/scripts/statusline-identity.mjs` → the agent-tools statusline adapter
- **Observed**: the variable is set to the RELATIVE path `.logs/statusline.log`,
  so it resolves against whatever cwd the statusline child inherits rather than
  against the project. Two foreign checkouts received it in one morning: a
  third-party clone in a session scratchpad, and — the one that matters —
  `visitors/pedagogy-library`, which is a SATELLITE REPOSITORY WITH ITS OWN GIT
  AND ITS OWN REMOTE. That repo does not ignore the path: `git -C
  visitors/pedagogy-library status --short` reports `?? .logs/`, and
  `check-ignore` exits non-zero. The file there is 12,080 bytes written
  2026-09-12 08:53–08:54 by session `2de3685d`, and each line is a raw
  statusline payload carrying an absolute home path, a transcript path, and
  cost and rate-limit telemetry.
- **Expected**: session instrumentation writes inside the project that owns the
  session, never into a directory the seat merely visited. A satellite repo's
  working tree is another repository's surface.
- **Why it matters beyond tidiness**: the payload content is exactly the class
  `no-machine-local-paths` exists to keep out of version control (absolute
  `/Users/<name>/…` paths are PII by that rule's own reasoning), and the
  estate's validator cannot see it — `validate-no-machine-local-paths` scans
  THIS repository's tracked files, so a sibling repo's untracked working tree is
  structurally outside its reach. One `git add -A` in the visitor commits
  another session's telemetry to a different remote.
- **Candidate cure**: make the path absolute at its source — resolve it from
  `CLAUDE_PROJECT_DIR` (already used by the shim two lines above) or from the
  `project_dir` the statusline payload itself carries, rather than leaving a
  bare relative path in the env block. Unsetting it is the zero-cost
  alternative; it is an opt-in diagnostic, not a required surface.
- **Target surface**: the statusline log-path resolution (adapter), plus the
  machine-local settings entry that supplies it
- **Status**: open (read 2026-10-01). The variable is now `PRACTICE_STATUSLINE_LOG_FILE`, and the
  tracked resolver (`resolveDebugLogConfig` in `agent-tools/src/claude/statusline-debug-log.ts`,
  both estates) returns any `*.log` value as the path unresolved. The cure is the estate's change
  and does not wait on the owner's settings edit: resolve a relative value against the payload's
  `project_dir`, or refuse it with the existing invalid-config warning. F-217 records the same
  defect from its other side (the `.logs` directories it plants).
- **Owner direction status**: unsolicited
- **Instance, 2026-09-24** (Zephyr guards Leeward, `281e44`; Marten mends Shadow,
  `74fc02`): the statusline's relative log path wrote `.logs/statusline.log` inside
  the skill tree and the incoming Box, and the pre-push skill-adapter check refused
  the push; the two cures stand as written (a fixed log path, or the adapter check
  skipping dot-directories).
- **Instances, 2026-09-29** (the Director): the relative log path planted `.logs` under
  `.agent/rules` and `.agent/skills`, and two push validators refused them; both are recorded
  whole as F-217, which is this entry's class.

### F-182 — instruments that answer about themselves rather than about their input

- **Source**: Nettle guards Pistil (`2de368`) and Sandpiper weaves Updraft
  (`a96287`), 2026-09-12; the owed row recorded on pull request 135 as issue
  comment 5644730066 and landed here
- **Surface**: `prettier --check` (the trigger instance), with two siblings
  named below
- **Observed**: over a path `.prettierignore` excludes, `prettier --check`
  prints `All matched files use Prettier code style!` **while matching zero
  files**. The success sentence is byte-identical to a real pass and nothing in
  it distinguishes a clean input set from an empty one. Two seats read that line
  and believed it the same day; `prettier --file-info <path>` answers truthfully
  (`{"ignored": true, "inferredParser": null}`).
- **The class, which is the point of the row**: the same shape fired twice more
  within about 48 hours on unrelated tools — BSD `xargs` silently rejecting `-a`
  so a zero-hit sweep read as a clean sweep (2026-09-10), and a `comms send
  --body` whose backtick spans were eaten by the shell while the command still
  reported success (2026-09-12, corrected as comms event `5b58b189`). In each
  case the instrument reported on ITSELF — it ran, it exited zero, it printed
  its success string — and said nothing about whether its input reached it.
- **Expected**: a seat can tell, from a check's own output, whether the check
  had anything to check.
- **Candidate cure**: no new rule (`rules-have-no-exceptions`,
  `new-rule-vs-pdr-clause`). The portable discipline is to pair any
  zero-or-green result with a known-hit control before believing it, and to
  prefer the interrogating form of a tool where one exists (`--file-info` over
  `--check`; reading a written record back over trusting a write's exit code).
  Where a gate in this estate reports over a possibly-empty set, printing the
  matched-file COUNT alongside the verdict converts the vacuous pass into a
  visible one.
- **Target surface**: rule or doctrine home for the discipline; individually,
  any estate-owned check that can report success over an empty input set
- **Status**: open
- **Owner direction status**: standing (agent-observed tooling friction is
  first-class user feedback, Pelagic event `2dbd74f6`)

### F-183 — a peer seat reached the owner's GitHub credential for pull-request writes

- **Source**: Nettle guards Pistil (`2de368`), 2026-09-12, reading pull request 135's
  comment authorship and review-request timeline after the second seat's handback
- **Surface**: `gh` under the keyring credential; the bot-identity rule's row for PR
  comments and review requests
- **Observed**: two issue comments (5644831605, the handback; 5644834828, its correction)
  and one Copilot review request (08:41:59Z) on pull request 135 are attributed to the
  owner's GitHub account. The text of both comments self-identifies as the agent, so the
  shared-credential rule is met; the bot route (`merge-bot mint-token --scope
  pull-request-work`, exported as `GH_TOKEN` before the `gh` call) was not taken. The
  seat's own handback names none of this. Whether the bot path was unavailable to that
  seat (no `.github/merge-bot.json` at its checkout, an unreadable key) or simply untaken
  is not known; the seat had closed before the question could be put.
- **Expected**: every pull-request write from a seat displays as the bot; a seat that
  cannot mint stops and says so, rather than falling through to the human credential.
- **Candidate cure**: none new — the rule already carries the assign-first form and the
  tripwires. The gap is observational: nothing at the seat's boundary told it which
  identity a `gh` write would carry. The interrogating form exists (`GH_TOKEN="" gh auth
  status` names the human); pairing it with the mint at session open is the discipline.
- **Target surface**: `bot-identity-on-third-party-systems` (the arming-time check), and
  the second seat's own record if it resumes
- **Status**: open
- **Owner direction status**: standing (bot identity for all pushes, PRs and comments;
  reaching for the operator's credential outside the action map's rows is never permitted)

- **Instances, 2026-09-24** (Swallow holds Drift, `516619`; Marten mends Shadow,
  `74fc02`): three GitHub writes in one day under the owner's default `gh`
  credential (`gh pr edit --body-file`, a plain `git push`, a bare `gh pr comment`),
  each cured by re-posting as the bot. The structural cure is a PreToolUse guard that
  refuses a `gh` write with no `GH_TOKEN` in the command; PR G's redesign
  (segment-aware match on `shell-words.ts`, closed default) is the Director's verdict.
- **Instance, 2026-09-26** (Myrtle turns Canopy, under the Director's ruling 8): PR G's branch and
  worktree were deleted after its 229-line patch was verified, so the guard's only copy is the
  gitignored `.agent/state/collaboration/handoffs/74fc02-pr-g-gh-write-guard-uncommitted-2026-09-24.patch`.

## Settled entries, archived

Every settled entry (cured, or superseded by an owner ruling) was graduated, then archived on
2026-09-20 by the lifecycle in `continuity-practice.md` §Disposition of Continuity Surfaces:
each was read whole, its cure verified at the source it names, and any lesson it carried
checked for a home before the move. The full pre-curation register, byte-identical to the file
at `SHA:d1564cff9`, is `.agent/memory/operational/archive/frictions-register-2026-09-20.md`
(blob `42b7d373d`); the entry text lives there. The rows below keep every archived id
resolvable from this file, because doctrine cites frictions by id.

| Id | Title | Disposition, as verified 2026-09-20 |
| --- | --- | --- |
| F-01 | `comms send` rejects `--agent-name` | cured: the help names the identity env inputs (`cli-spec-help.ts`) |
| F-02 | `claims close` `--closure-summary` alias | cured: alias accepted and documented |
| F-03 | `claims close` error named the wrong option | cured: unknown options are refused before required-option checks (unit test) |
| F-04 | `claims open` `--file` vs `--area-pattern` | cured: help states repeatability and mutual exclusion |
| F-05 | `comms render` aborted on one malformed event | cured: validated atomic writes, loud path-named read failure, `comms validate` (`cli-comms-validate.ts`) |
| F-11 | no `commit-queue list/show` | cured 2026-05-11 (`e298723c`): both commands with filters |
| F-12 | `--area-kind` values undiscoverable | cured: enumerated in help and in the error |
| F-13 | `comms send` printed no event id | cured: `event_id` and `event_path` returned |
| F-14 | repeated `--area-pattern` overwritten | cured: `areaPatterns` repeatable, with regression coverage |
| F-35 | heartbeat mode hidden from `--help` | cured: `HEARTBEAT MODE` documented in `cli-spec-help.ts` |
| F-70 | no `comms list --since` | cured 2026-06-28 (PR #278) |
| F-72 | `claims active-agents` required `--active` | cured by F-85's coordination-home default (PR #274) |
| F-73 | heartbeat mode requires a claim | cured as documentation: the standby contract is PDR-078 §4's consumer-absent exemption (`liveness-heartbeat-cron` §Exemptions) |
| F-77 | `comms append` could not thread a broadcast | cured 2026-06-28 (PR #279): `--in-response-to` |
| F-79 | `comms list` rejected `--now` | cured 2026-06-28 (PR #281): accepted and ignored (`cli-specs.ts`) |
| F-80 | `comms show` needed `--event-id` | cured 2026-06-28 (PR #283): positional id accepted |
| F-84 | decision-debt count read 0 with live items | cured 2026-06-22 (`f056285fb`): non-canonical entries reported as malformed (`item-count.ts`) |
| F-85 | `claims` commands required `--active` | cured 2026-06-28 (PR #274): `claim-active-path.ts` defaults to the coordination home |
| F-89 | `claims open` required `--now` | cured 2026-06-28 (PR #276): `claim-now-default.ts`; the CLI-wide defaulting audit is F-109's |
| F-94 | no `claims adopt` or `set-handoff` | cured 2026-06-25 (`e95fb9594`, PR #225) |
| F-95 | no watcher-presence gate | cured 2026-06-25 (`e95fb9594`, PR #225): `comms assert-watcher-live` and the `claims open` backstop; F-104 and F-174 record the gate's own defects |
| F-108 | `--closed` had no coordination-home default | cured 2026-06-28 (PR #285, `7d8a1db3a`); this id was assigned inside F-72 and F-85 and never had an entry of its own |
| F-112 | `commit-queue commit` died at the depcruise→turbo handover | cured 2026-07-03 (`b2ae96898`) and, on the push path, 2026-08-07: file-backed child stdio (`agent-tools/src/core/file-backed-child.ts`; pattern `file-backed-stdio-for-spawned-gate-children`) |
| F-132 | guard rejected `git:index/head@<worktree>` | superseded by scope (owner ruling 2026-09-07: worktree lanes do not use the queue; the commit skill carries it) |
| F-139 | guard rejected the `index/head@<worktree>` pattern | superseded by scope, as F-132 |
| F-146 | `comms watch` had no heartbeat exclusion | cured 2026-07-20: `--exclude-tag` (`cli-options.ts`; the watcher rule §Sanctioned tag exclusion) |
| F-147 | the knip leg passed when knip crashed | cured 2026-07-21: both hooks call `pnpm knip:gate` and fail closed |
| F-156 | `merge-bot merge` injected the app token into the OAuth-only probe | cured 2026-08-08 (PR #823): the read path runs token-free (`merge.ts`) |
| F-163 | abandoned commit-queue intents had no drain | superseded 2026-08-17 by the owner's QUEUE-LOCAL ruling: the per-intent `commit-queue/` store (MCP-612) |
| F-169 | the queue serialised commit windows across worktrees | superseded by scope (owner ruling 2026-09-07); the host bound on concurrent full gates is `no-unbounded-host-load` item 6 |
| F-06 | Build-on-each-CLI-invocation causes identity drift mid-session | verified 2026-09-30: agent-tools/package.json:22-39 run `cd .. && node agent-tools/dist/src/bin/agent-tools.js ...` with no build step and .agent/rules/use-built-agent-too… |
| F-17 | No first-class directed-message authoring CLI | verified 2026-09-30: agent-tools/src/collaboration-state/cli-comms-messages.ts:35 directComms and :83 replyComms; agent-tools/README.md:313 documents comms direct and comm… |
| F-18 | Coordinator gate sweep stales when agents keep writing | verified 2026-09-30: .agent/state coordination tier is untracked-by-design (docs/architecture/architectural-decisions/199-comms-event-rotation-phenotype.md:297), .husky/pr… |
| F-10 | Identity routing should use (name, prefix) pair | verified 2026-09-30: superseded by PDR-076a (name, id) routing: .agent/rules/register-identity-on-thread-join.md:156 §Identity Routing Uses (name, id); (name, prefix) Is T… |
| F-15 | Commit-queue fingerprint recursion when claim file is in staged set | verified 2026-09-30: both branches landed: agent-tools/src/commit-queue/active-claims-recursion.ts:6-9 (since registry schema 1.4.0 the queue and its fingerprint live in t… |
| F-16 | Skills/commands surface sprawl across five vendor adapter trees | verified 2026-09-30: canonical SKILL-CANONICAL.md filename (66 canonicals under .agent/skills), exactly two adapter surfaces (.agents/skills, .claude/skills), .agent/comma… |
| F-19 | CLI exposes internal mechanics as agent-facing inputs | verified 2026-09-30: superseded by F-85/F-89: agent-tools/src/collaboration-state/claim-now-default.ts:26 resolveNow defaults --now, agent-tools/src/collaboration-state/cl… |
| F-20 | Repo-check profile depends on external browser/bootstrap state | verified 2026-09-30: agent-tools/src/repo-check/repo-check-profile.ts:46-60 collectProfileEnvironmentEvidence records pnpm store path, Playwright browser cache presence an… |
| F-21 | `comms inbox` requires pre-existing seen-file state | verified 2026-09-30: agent-tools/src/collaboration-state/cli-io-production.ts:116-119 readSeenIdsFile reads an absent seen-file as the empty set; agent-tools/README.md:334… |
| F-22 | Directed replies can be invisible to shared-log watchers until render | verified 2026-09-30: agent-tools/src/collaboration-state/cli-comms-messages.ts:130 writes directed messages into the canonical comms dir that comms inbox, watch and list r… |
| F-23 | Hot comms CLI contract can drift under peer agent-tools edits | verified 2026-09-30: superseded by F-06's cure: agent-tools/package.json:24 runs the built dist without rebuilding and .agent/rules/use-built-agent-tools-cli.md:3 names th… |
| F-24 | Status pings can cross fresh directed instructions | verified 2026-09-30: superseded by the mandatory all-channels watcher (.agent/rules/comms-all-channels-watcher.md §Action, agent-tools/src/collaboration-state/cli-comms-wa… |
| F-25 | Scaffold checklist and ESLint boundary helper disagree for new libs | verified 2026-09-30: packages/libs/graph-ingest/eslint.config.ts:22 uses createLibBoundaryRules('graph-ingest'); packages/core/oak-eslint/src/configs/base.ts:6-28 document… |
| F-27 | "P4 landed" did not prove the advertised root knip blocker cleared | verified 2026-09-30: superseded by .agent/rules/verify-dont-trust.md:47-52 (only the gate's own command output proves a requirement; "landed" is a routing hint, not proof)… |
| F-29 | Rebase instructions are unsafe in a dirty shared worktree | verified 2026-09-30: superseded by .agent/rules/worktree-residency.md (each seat commits from its own worktree) and .agent/rules/never-use-git-to-remove-work.md:122-125 (c… |
| F-30 | Heartbeat command gives little recovery help for stale syntax | verified 2026-09-30: superseded by F-09's collaboration-state cure: agent-tools/src/collaboration-state/cli.ts:239 prepends the command's full help (claims heartbeat inclu… |
| F-33 | `/remember` compression can write assistant-prose contamination | verified 2026-09-30: surface gone: no .remember directory and no /remember plugin reference anywhere outside the register |
| F-31 | Commit-msg hook depends on unpinned `pnpm dlx commitlint` | verified 2026-09-30: .husky/commit-msg:9 runs `pnpm exec commitlint --strict --edit "$1"` from the repo-pinned dependency graph; no dlx in .husky or agent-tools |
| F-34 | Legacy routing diagnostics flood watcher reads | verified 2026-09-30: surface gone: no [routing-legacy-fallback] diagnostic remains in agent-tools/src; legacy prefix routing was removed at the PDR-076a Phase 3 sunset (.a… |
| F-36 | `pnpm agent-tools:*` wrapper preamble pollutes captured stdout | verified 2026-09-30: pnpm's silent flag suppresses the wrapper preamble and the estate captures through it (.agent/skills/change-custody/commit/SKILL-CANONICAL.md:410 `AGE… |
| F-38 | Literal control bytes in source need a mechanical pre-commit screen | verified 2026-09-30: agent-tools/src/encoding/check-encoding-tables.ts:14-15 rejects every C0 control except TAB, LF, CR; encoding:check runs at pre-push, CI and pnpm chec… |
| F-39 | Wrap-aware continuation-line lint for the MD004 list-marker trap | verified 2026-09-30: authoring-reflex clause landed at docs/governance/development-practice.md:359-369 (a wrapped line beginning with a list marker trips MD004/MD032; neve… |
| F-41 | Collaboration-CLI relative-path + git-common-dir resolution | verified 2026-09-30: agent-tools/src/collaboration-state/coordination-home.ts:65-78 resolves the PRIMARY worktree from the porcelain output of git worktree list and names … |
| F-43 | Comms-watch zombie-process residuals (kill-tree, census, dir-scaled budget) | verified 2026-09-30: superseded by F-101: .agent/rules/comms-all-channels-watcher.md:138-152 makes --supervisor-pid mandatory (self-exit within one poll of supervisor deat… |
| F-45 | Untracked-by-design registry/dirs do not self-init | verified 2026-09-30: guidance branch landed: agent-tools/src/collaboration-state/state-file-seeds.ts:1-8 turns a first-read ENOENT into an actionable error carrying the ex… |
| F-46 | commit-queue write-command help must expose the full identity tuple | verified 2026-09-30: agent-tools/src/commit-queue/args.ts:51-57 usage lists --id <uuid-v5> for enqueue and guard beside name, platform, model and session prefix |
| F-47 | Platform identity-seed observability (absent seed → invisible session) | verified 2026-09-30: identity preflight command (agent-tools/src/collaboration-state/cli-specs.ts:75, agent-tools/src/collaboration-state/cli-identity.ts:28 preflightIdent… |
| F-49 | CLI-UX residuals: pnpm wrapper masks usage text; check-commit-message flag is `-F` | verified 2026-09-30: agent-tools/src/commit-advisories/check-commit-message.ts:56-60 usage names -F <file> and -m, unknown flags are a usage error (:74); the topic wrapper… |
| F-50 | Relative-link + anchor resolution check missing from the gate tier | verified 2026-09-30: agent-tools/src/validators/markdown-links/validate-markdown-links-helpers.ts:11-13 resolves relative links and cross-file anchors; validate-markdown-l… |
| F-52 | `evaluateParityChecks` lacks focused unit coverage | verified 2026-09-30: agent-tools/src/core/health-probe-parity.unit.test.ts:14-39 exercises the pure seams reviewerAdapterParityOf and evaluateReviewerRegistrationParityFro… |
| F-54 | Pre-commit hook omits `portability:check` / `skills:check` | verified 2026-09-30: ADR-121 coverage matrix rows docs/architecture/architectural-decisions/121-quality-gate-surfaces.md:54-55 record portability:check and skills:check as… |
| F-56 | collaboration-state operator-UX backlog (residual) | verified 2026-09-30: claims work-state (agent-tools/src/collaboration-state/cli-specs.ts:213) reports the operator's position, claims active-agents (:208) and comms peer-l… |
| F-58 | Readers of untracked-by-design `.agent/state` paths must tolerate absence | verified 2026-09-30: superseded by the fresh-clone seeding decision (agent-tools/src/collaboration-state/state-file-seeds.ts:1-8: absence is never silently empty, the read… |
| F-59 | commit-queue `-- commit` workflow spawn/capture defect (P1) | verified 2026-09-30: superseded by F-112: agent-tools/src/commit-queue/commit-workflow-runtime.ts:9-14 captures the advisory child's streams to files and replays them (run… |
| F-61 | PreToolUse safety hooks must run prebuilt artefacts, not `pnpm exec tsx` | verified 2026-09-30: .claude/settings.json hooks run node .claude/hooks/run-pretooluse-guard.mjs (the dist shim); package.json:122 postinstall runs agent-tools/src/bootstr… |
| F-64 | Editing an append-only channel file with the Edit tool re-emits the whole channel to watchers | verified 2026-09-30: .agent/reference/arc-rapid-communication.md:155-162 states the contract: append with one short >> redirection; tail -F treats an inode swap or truncat… |
| F-65 | Mixed time bases (UTC comms vs local mtimes) manufacture phantom liveness gaps | verified 2026-09-30: .agent/rules/liveness-heartbeat-cron.md:307-316 (liveness arithmetic is tool-computed, UTC-vs-UTC, always; compute ages with comms peer-liveness or da… |
| F-67 | Forename-keyed `/tmp` filenames collide across same-forename agents | verified 2026-09-30: surface superseded: the per-session scratchpad is the temp home (.agent/rules/worktree-hygiene.md:308-309, per-seat stderr sinks and scratch output li… |
| F-82 | canonical `comms watch` Monitor filter `^\[` silently swallows every event (reference-shape drifted from emit format) | verified 2026-09-30: point-fix landed: .agent/rules/use-monitor-for-event-driven-wake.md:301-306 names the mid-line tag and the corrected filter anchored on ^--- NEW with … |
| F-83 | Whole-tree pre-commit gate makes a clean commit hostage to peers' in-flight WIP on a shared checkout | verified 2026-09-30: structural cure landed: .agent/rules/worktree-residency.md:3 (lane agents reside in their worktree) and worktree-hygiene.md:297; .husky/pre-commit:24 … |
| F-87 | no launch-in-worktree mechanism; worktree agents start in the primary checkout | verified 2026-09-30: nothing missing in tree: agent spawn launches in the worktree (agent-tools/src/spawn/launch-command.ts) and worktree-residency.md:3 with the residency… |
| F-88 | `comms-seen` filenames embed the display name with spaces (quoting footgun) | verified 2026-09-30: superseded by the convention decision: .agent/rules/comms-all-channels-watcher.md:100-101 and :126-130 fix the seen-file as comms-seen/<exact display … |
| F-91 | session shell cwd resets to the primary checkout after every command (worktree commands silently run in the shared tree) | verified 2026-09-30: cure landed: .agent/rules/worktree-residency.md:3,26 (session-level cwd residency; a Shell cwd was reset line is a violation signal) and worktree-hygi… |
| F-97 | No PR monitor covers inline review comments and PR terminal state together | verified 2026-09-30: agent-tools/src/pr-watch/cli.ts:238-241: pr-watch reports CI, review and mergeable state, comments and unresolved review threads, exiting on merged/cl… |
| F-98 | No authoritative agent↔worktree↔branch↔liveness registry; the binding is split across divergent, partly-authored surfaces | verified 2026-09-30: the decision the entry said it only named is made: .agent/practice-core/decision-records/PDR-118-agent-work-state-model.md (Accepted) and claims work-… |
| F-99 | All-channels comms watcher has no observer/low-engagement mode; a passive role pays a per-heartbeat context tax | verified 2026-09-30: comms watch --exclude-tag (agent-tools/src/collaboration-state/cli-spec-options.ts:57); .agent/rules/comms-all-channels-watcher.md:64-82 names comms w… |
| F-101 | Comms watchers outlive their agent and accumulate as orphan processes (no self-termination) | verified 2026-09-30: comms watch --supervisor-pid (cli-spec-options.ts:56; cli-comms-watch.ts:55-60); the canonical command at .agent/rules/comms-all-channels-watcher.md:1… |
| F-102 | The `git push` hook substring-matches `-f` from later commands in the same compound | verified 2026-09-30: the Bash guard now segments the command (agent-tools/src/hook-policy/blocked-patterns.ts:93 segmentCommand) and matches pattern tokens in order within… |
| F-103 | markdownlint-cli2 lints git-ignored `.agent/state/**` files, blocking pre-push on non-committed transients | verified 2026-09-30: package.json:88 markdownlint-check:root runs repo-check markdownlint-tracked (agent-tools/src/repo-check/repo-check-gates.ts:208-216 lints every track… |
| F-104 | F-95 watcher-presence gate false-negatives despite a live heartbeat file | verified 2026-09-30: superseded by F-118, which root-causes the same false-negative to seen-path derivation; one derivation now serves watcher, assert and claims gate (com… |
| F-107 | PreToolUse hook substring-blocks SAFE, non-destructive git forms | verified 2026-09-30: the guard matches tokens within a shell segment via argv option tables (blocked-patterns.ts:135-142; argv-tables-git.ts:62-66 separates force-with-lea… |
| F-114 | `commit-queue verify-staged` cannot represent a staged rename | verified 2026-09-30: agent-tools/src/commit-queue/git.ts:42-44 reads staged changes rename-explicit (--no-renames) so an intent names both sides and the rename commits ato… |
| F-115 | comms-seen heartbeat path derivation diverges: CLI uses the display name verbatim; the rule doc and legacy files model kebab-case | verified 2026-09-30: the convention is decided once for the exact display name (.agent/rules/comms-all-channels-watcher.md:126-130) and derived in comms-watch-paths.ts:30;… |
| F-118 | comms-watcher heartbeat path convention: the assert derives the display-codename path; kebab seen-files fail the liveness check | verified 2026-09-30: one derivation serves all three consumers: comms-watch-paths.ts:30 resolveCanonicalCommsWatchPaths used by cli-comms-assert-watcher-live.ts, claims-op… |
| F-161 | no tool mints the coordination successor-branch name | verified 2026-09-30: the optional action landed: agent-tools/src/coordination/cli.ts ships coordination successor-name; .agent/skills/coordination-fold/SKILL-CANONICAL.md:… |

Ids that head no entry: F-81 (a napkin candidate of 2026-06-21, cited by F-82 and theme 6, never
registered) and F-171 (never assigned).

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

- Concrete CLI/code changes → [`current/`](../../plans-backlog-2026-07/agent-tooling/current/) executable plan
  (often a workstream addition to existing collaboration-state plans)
- Standalone tooling capability → [`future/`](../../plans-backlog-2026-07/agent-tooling/future/) strategic brief
- PDR/ADR amendments → not handled here; the PDR/ADR sits in
  `.agent/practice-core/decision-records/` or
  `docs/architecture/architectural-decisions/`. This register tracks the
  candidate trigger only.

When an item is addressed by a commit, update its `Status` line with the
commit SHA and the closing plan reference.

### F-119 — `claims open` writes rows with no `status` field, so status-keyed jq probes silently miss live claims

- **Source**: Mistral holds Cumulus, 2026-07-04 (memory-drain Stratum C) — a
  `jq 'select(.status=="active")'` over `active-claims.json` returned nothing
  while a live claim existed; cost one failed close and a registry probe.
  Conserved from that session's napkin capture at the 2026-07-04 rotation.
- **Surface**: `claims open` (row shape) vs ad-hoc registry reads (jq probes,
  peer scripts, glance surfaces).
- **Observed**: active rows carry no `status` key (reads as `null`); rows in
  `closed-claims.archive.json` DO carry status-like closure fields, so an
  agent generalising from the archive shape filters the active registry on a
  key that never matches and concludes no claims exist — the blind spot is
  silent (empty result, exit 0).
- **Expected**: either active rows carry an explicit `status: "active"` at
  open time, or the schema/docs state plainly that liveness is the row's
  presence in `active-claims.json` (and freshness is `claimed_at`/
  `heartbeat_at`), never a status key.
- **Workaround (verified)**: select on presence — match by
  `agent_id.session_id_prefix` or filter `.status == null or .status ==
  "active"`; treat presence-in-file as the liveness signal.

### F-120 — `git merge` leaves a stale agent-tools dist that fail-CLOSES the Bash guard and bricks the worktree (recurrence-confirmed)

- **Source**: napkin 2026-07-06 (Cricket lifts Echo `2fffa2`) + a corroborating
  same-day instance (Wyvern seeks Clinker). Already documented in three places
  before it recurred — `policy.json` line 151, the `c2e2181bd` commit message,
  and the Cricket napkin entry — a live `passive-guidance-loses-to-artefact-gravity`
  demonstration: passive docs did not fire at the merge action-moment.
- **Surface**: `git merge` + `.claude/hooks/run-pretooluse-guard.mjs` →
  `agent-tools/dist/src/hook-policy/check-blocked-patterns.js` (the dist is
  gitignored, so it is not carried in the merge).
- **Observed**: a merge that brings hook-policy SOURCE changes runs the
  `pre-merge-commit` hook, NOT `pre-commit`, so the dist is not rebuilt. The
  stale compiled guard then fail-CLOSES on the new policy field (e.g. a new
  `match: "regex"` kind its old schema rejects), bricking EVERY Bash command —
  including the rebuild that would fix it. Recurred within hours (two instances
  same day). Compounded: the fail-closed crash path leaves NO entry in
  `.claude/logs/hook-errors.log` (only the fail-OPEN degrade path logs), so a
  future brick is invisible in the log meant to record it.
- **Expected**: a merge changing hook-policy source rebuilds the dist before the
  guard runs; the guard fails OPEN on a whole-schema parse miss (not only on an
  unknown match KIND); and the fail-closed path logs. (Any F-124-style
  pre-resolved-binary cure must not recreate this class: a decoupled copy needs
  atomic refresh after rebuild.)
- **Candidate cure**: a `.husky/pre-merge-commit` hook that rebuilds agent-tools
  dist when the merge touched hook-policy source; OR extend the guard fail-open
  to an unknown top-level schema shape; OR guard-runner self-heal (rebuild on a
  schema-parse failure). Plus: log the fail-closed crash path in the guard runner.
- **Recovery (verified, Bash-bricked)**: with non-Bash tools only — Edit the one
  new policy enum back to a value the old schema accepts → Bash unblocks →
  rebuild dist → Edit the policy back.
- **Target surface**: `.husky/pre-merge-commit` (new) and/or
  `agent-tools/src/hook-policy` fail-open logic + `run-pretooluse-guard.mjs` logging.
- **Status**: open — recurrence-confirmed (PDR-098; two instances same day),
  structural cure not yet built.
- **Owner direction status**: standing (Pelagic `2dbd74f6` — agent-tooling
  friction is first-class user feedback).

### F-121 — `comms append --in-response-to` accepts any string; a fabricated event id ships a dangling threading edge

- **Source**: hygiene-Implementer closeout 2026-07-02 (Thyme guards Dewfall, curriculum-hub-demo);
  worked instance: comms event `625eba5d` shipped `in_response_to` pointing at a non-existent id (a
  uuid suffix typed from memory), corrected by follow-up event `aeb611d8`.
- **Surface**: `pnpm agent-tools:collaboration-state -- comms append --in-response-to <id>`.
- **Observed**: `comms reply` validates `--to-event-id` against the store (a wrong id fails loud:
  "directed message not found"), but `append` writes whatever `--in-response-to` string it is given
  — the F-77 threading edge machine readers rely on (e.g. PDR-064 Moment-2 acknowledgements) can be
  silently dangling.
- **Expected**: symmetric validation — append resolves the antecedent id against the comms dir and
  refuses (with the near-miss prefix if one matches) when it does not exist.
- **Candidate cure**: a resolve-or-refuse check in the append path mirroring reply's lookup; accept
  a full id only (prefix expansion could mis-thread). One unit + one CLI integration test per the
  comms-concept-gate test shapes.
- **Target surface**: `agent-tools/src/collaboration-state/cli-comms-commands.ts` (append options
  resolution).
- **Second instance + widened surface (2026-07-30, MCP-393 closing build)**: `comms direct
  --in-response-to` (added that day) inherits the same non-validation, and the directed ack is now a
  rule-recommended path for routine acknowledgements — so the fabricated-id class rides a busier
  road. Same-day worked instance of the class on the append side: a codex seat threaded an
  acknowledgement (event `922bbbfa`) to a wrong id remembered from watcher output (which renders no
  ids) and shipped a correction event (`ffd7c635`). Design question any cure must answer before landing: ADR-199 rotation moves
  archived events out of `comms/`, so a VALID antecedent can be unresolvable at write time — the
  guard needs an archived-antecedent stance (refuse, warn, or resolve-through-archive), which is
  plausibly why this friction has stayed open.
- **Status**: open.
- **Owner direction status**: standing (record-all-frictions); captured at session closeout.
- **Third instance, 2026-09-24** (event 7985ac9b): append accepted a reply threaded to the
  correspondent's author id, and two misthreaded events followed (f59b1c24, 224f2e4c); both
  estates' `cli-comms-commands.ts` (line 208) still pass `--in-response-to` on unchecked.

### F-122 — `claims close` fails ENOENT rather than creating the untracked closed-claims archive container

- **Source**: doctrine-PR session 2026-07-06 (Zodiac herds Spectrum) + recurrence same day
  (Hyena spins Lamplight — "ENOENT recurrence confirmed").
- **Surface**: `pnpm agent-tools:collaboration-state -- claims close --closed <path>`.
- **Observed**: `closed-claims.archive.json` is untracked-tier and absent on a fresh disk
  (post the untrack of `.agent/state/`); `claims close` fails ENOENT instead of creating the
  container, so a fresh checkout cannot close a claim without knowing the empty-container
  shape by hand (`{"schema_version": "1.3.0", "claims": []}`).
- **Expected / candidate cure**: `claims close` auto-creates the empty container ONLY when
  `--closed` resolves to the canonical/default path; for any non-canonical explicit path it
  fails with the empty-container shape printed in the error (or requires an explicit
  `--create` flag), and creates the file only — never `mkdir -p` arbitrary parents. Blind
  auto-create would make a typo'd path fork the untracked closed-claims history silently
  (the archive is the canonical historical record, unlike F-120's derived build output).
- **Target surface**: `agent-tools/src/collaboration-state/` claims-close path.
- **Status**: open — recurrence-confirmed (two sessions, same day).
- **Owner direction status**: standing (record-all-frictions).

### F-123 — `claims open` can crash AFTER writing the claim (exit 1, claim landed)

- **Source**: PR-295 merge session closeout 2026-07-06 (Hyena spins Lamplight, loss-scan yield).
- **Surface**: `pnpm agent-tools:collaboration-state -- claims open`.
- **Observed**: exit 1 with a Node uncaught-exception footer AFTER the JSON output, while the
  claim had landed in the registry — an agent reading the exit code and retrying mints a
  duplicate claim. Corollary (same yield): a write-path command is never a probe — a
  diagnostic claims-open "probe" wrote a junk claim that then needed closing.
- **Expected / candidate cure**: fix the post-write crash; until then, doctrine is read the
  registry, never the exit code, before retrying any claims write.
- **Target surface**: `agent-tools/src/collaboration-state/` claims-open path.
- **Status**: open.
- **Owner direction status**: standing (record-all-frictions).

### F-124 — a repo-wide gate that rebuilds `agent-tools/dist` task-reclaims persistent Monitors; inner restart loops cannot recover a whole-task reclaim

- **Source**: curriculum-hub sessions 2026-07-01 (Deneb + Typhoon — a ~2h fleet blind gap,
  owner-caught); cure directions routed to the tooling lane on comms `31a99250`.
- **Surface**: `Monitor(persistent)` tasks shelling out to `pnpm agent-tools:*` during any
  gate that rebuilds `agent-tools/dist` (owner commit, `pnpm check`).
- **Observed**: the rebuild can reclaim the whole Monitor task; an inner `while true` loop
  only recovers an inner-command exit (dist transiently absent), not a task-level reclaim —
  the watcher/heartbeat is dead until manual re-arm, and in-window silence reads as
  retirement.
- **Candidate cures** (from the routed comms event): decouple monitors from a live
  `agent-tools/dist` during rebuilds (pre-resolved binary / copy); OR a task-level supervisor
  re-arming the whole task; OR don't rebuild dist under live monitors. Interim protocol
  (ratified in-window): after any repo-wide gate, re-arm watcher + heartbeat + post a
  catch-up sweep; treat in-window silence as reclaim, not retirement.
- **Status**: open.
- **Owner direction status**: standing (record-all-frictions).
- **Instances, 2026-09-24 and 2026-09-25** (the Director, JC; seats, OCE): push and fold-commit
  gates from the primary rebuilt `agent-tools/dist` under live readers with no broadcast, four in
  an hour (JC) and about twenty minutes at load 16 (OCE); no rule or hook announces a push's gate.
- **Read 2026-10-01**: The instances add a candidate cure: the pre-commit and pre-push hooks, run
  in the primary, post the start and result events of `check-singleton-per-window` themselves
  (`gate-slot`, now in both pre-push hooks, limits concurrent gates and posts nothing).

### F-125 — cwd drift breaks root pnpm scripts and whole-estate gate runs; the cure is location-independent root-level gate scripts

- **Source**: recurrence ledger — 7 instances in one session (Peregrine, 2026-07-02) even
  under an adopted vigilance cure; ×4 (Galago), ×3 (Hyena stirs Lamplight), plus the
  Monitor-loop variant (heartbeat restarted from a workspace cwd fails root scripts —
  false-liveness risk).
- **Observed**: `cd demos/…` in one command silently breaks the next repo-root `pnpm
  agent-tools:*` call ("command not found"), and a "full gate" run from the wrong cwd reads
  alien whole-estate failures as lane failures. Vigilance ("always prefix cd") demonstrably
  leaks under load — PDR-089 class.
- **Candidate cure**: root-level location-independent gate scripts (e.g. `pnpm demo:gates`)
  that own their own `cd`; Monitor loops carry an explicit `cd` to the repo root inside the
  loop — in any committed template resolve it via `git rev-parse --show-toplevel`, never a
  literal path (`no-machine-local-paths`).
- **Status**: open — structural cure not built; three independent data points recorded.
  Further recurrences: 2026-07-06 (Zenith, ~10 min after re-registering the friction);
  2026-07-08 (Pelican closeout: `ERR_PNPM_RECURSIVE_EXEC "command not found"` on a root
  script from a workspace cwd — a confusing error for a cwd problem). Recurrence under
  full awareness keeps proving the cure must be structural.
- **Owner direction status**: standing (record-all-frictions).

### F-126 — semantic-merge losslessness proof is hand-rolled every time; wants a verifier command

- **Source**: PR-304 shepherding 2026-07-06 (Cricket lifts Echo — owner asked that ad-hoc
  scripts be noted for graduation into agent-tools); used 3× in that merge and again at the
  PR-295 resolver-fleet merge.
- **Observed**: the skill-mandated losslessness proof (preserve clean sides via
  `git show :1:/:2:/:3:`, then `comm -23` heading sets and identity-row key sets against the
  merged file — an empty miss-set IS the proof) is exactly where a silent drop could hide
  when done by hand; `comm` needs sorted inputs (newest-first lists silently cut the newest
  rows).
- **Expected**: the skill's mandated losslessness proof runs as one command per merged file.
- **Candidate cure**: `agent-tools memory-merge verify --base --mine --theirs --merged`
  emitting per-merge_class miss-sets, so the mandated proof step is one command. A scaffold
  for `index-narrative-tables` (extract-conflict-region / splice-resolved-block, then run the
  verifier) would remove the fiddly part while leaving the semantic judgment hand-authored.
- **Target surface**: `agent-tools` CLI (new `memory-merge` command family).
- **Status**: open — tooling candidate.
- **Owner direction status**: standing (capture-practice-tool-feedback).

### F-127 — PR review-thread state needs GraphQL every time; wants `agent-tools pr review-threads <n>`

- **Source**: PR-304 shepherding 2026-07-06 (Cricket lifts Echo; scratch `parse_threads.py`).
- **Observed**: every PR shepherd under `pr-comments-resolve-and-recheck` needs the
  resolved/unresolved worklist, which only GraphQL `reviewThreads` exposes (REST does not
  carry resolved state); each session re-rolls the same query + parser.
- **Expected**: the resolved/unresolved review-thread worklist for any PR is one command.
- **Candidate cure**: `agent-tools pr review-threads <n>` emitting the worklist
  (thread id, path, resolved state, author, first line), consumed by the pr-lifecycle skill.
- **Target surface**: `agent-tools` CLI (new `pr` command family).
- **Status**: open — tooling candidate.
- **Owner direction status**: standing (capture-practice-tool-feedback).

### F-128 — the lint config estate is not self-linted (root-level config files sit outside every workspace lint run)

- **Source**: Sonar Phase 5B session 2026-07-06 (Katydid seeks Moonbeam): the two S7772
  survivors were the root `eslint.config.ts` itself (bare `path`/`url` imports); root `lint`
  is `turbo run lint` (per-workspace) + shell lint, so root-level TS config files are outside
  every lint boundary.
- **Expected**: root-level config files (`eslint.config.ts` and siblings) are covered by a
  lint gate like any other TypeScript in the estate.
- **Candidate cure**: a root lint leg (or a root pseudo-workspace lint entry) that lints the
  root config estate; wire into `pnpm check`.
- **Target surface**: root `package.json` scripts + the lint gate topology.
- **Status**: open. Diagnosis also recorded at
  `docs/engineering/quality-tooling-mcp-coupling.md` §ESLint↔Sonar divergence.
- **Owner direction status**: standing (record-all-frictions).

### F-129 — comms concept gate: two next-cycle residuals from the founding review

- **Source**: hygiene-Implementer closeout 2026-07-02 (Thyme guards Dewfall), conserving the
  founding reviewer ruling's next-cycle set; the fail-closed-on-partial-policy half was
  hardened 2026-07-06 (ADR-210 §Decision item 5) — these two remain.
- **Observed / expected**: (1) a gate refusal on an unattended cron heartbeat presents as a
  dead agent — refusals need routing to a visible surface or documenting in the heartbeat
  lane; (2) small test pins owed: tag-exactness ("failure-mode-analysis" still gates), the
  `as const` tuple for the concept list, and calling `scanLinesForRegex` directly instead of
  the empty-prior trick.
- **Target surface**: `agent-tools/src/collaboration-state/comms-concept-gate.ts` + its tests.
- **Status**: open.
- **Owner direction status**: standing (record-all-frictions).

### F-130 — no mechanical merge-ready check exists; "checks green" gets declared as "merge-ready" despite the loaded rule

- **Source**: Wildfire herds Sulphur session closeout 2026-07-06; worked instance: PR #315
  declared "fully green — ready for your merge" from the CI checks table alone while a
  High-Severity Bugbot review thread sat UNRESOLVED — the owner caught it, not the author.
  The `pr-comments-resolve-and-recheck` rule (always-loaded) states green-checks-insufficient
  plainly and lost to completion fluency anyway; recurrence class also seen on the #310 arc
  (Bugbot merge-ready-definition miss).
- **Surface**: any agent declaring PR readiness; `gh pr checks` output read as merge-readiness.
- **Observed**: doctrine exists (rule + pr-lifecycle skill) but nothing FIRES mechanically at
  the declaration instant; the failure is passive-guidance-loses-to-artefact-gravity.
- **Expected**: a recomputable check per validators-must-recompute: merge-ready = required
  checks green AND GraphQL reviewThreads unresolved == 0 AND no pending bot reviews AND Sonar
  QG passed, evaluated at the declaration instant.
- **Candidate cure**: `pnpm agent-tools:pr-merge-ready <number>` (gh + GraphQL; exits non-zero
  with the named blockers); the rule's Binding-moment clause (added 2026-07-06) then requires
  citing its green output in any merge-ready declaration. One unit + one CLI integration test.
- **Target surface**: `agent-tools/src/` (new small module beside the collaboration-state CLI).
- **Status**: open.
- **Owner direction status**: emerged from an owner correction ("you have a real mental block
  around conversation thread resolution being a merge blocker"); rule clause landed same day.
- **Instance, 2026-09-26** (seats, both streams): a CLEAN reading of PR 250 was of the head the
  legs answered on, the owner then changed the PR, and the stale CLEAN was relayed until a
  correction named it; the candidate command would also print the head sha and draft state read.

### F-131 — a harness-timeout kill of `git commit` orphans the pre-commit hook chain as a whole-tree lint fleet

- **Source**: Wildfire herds Sulphur 2026-07-06; worked instances: two consecutive `git commit`
  invocations killed at the Bash tool's timeout (2m, then 10m under load) left their husky
  pre-commit chains (turbo → per-workspace eslint) running detached; the orphans stacked into
  a load-average-94 host with 0.5% CPU idle, starving the very chains that followed, and one
  kill left deleted-but-not-regenerated generated SDK files in the worktree (repaired by
  forward `git show HEAD:<p> > <p>` writes, never `git restore`).
- **Surface**: `git commit` via the Bash tool in any session; husky pre-commit → pnpm → turbo
  process tree.
- **Observed**: SIGTERM at the timeout kills the shell but not the detached descendants; the
  fleet is invisible to the session that spawned it and unattributable to peers reading `ps`.
- **Expected**: a commit invocation that either survives (background, no timeout kill) or dies
  atomically with its whole process tree.
- **Candidate cure**: (a) session craft, immediate: run `git commit` as a background task
  (no timeout kill) — worked same session; (b) structural: the commit-skill/queue workflow
  wraps the hook chain in a process-group kill guard (`setsid` + trap, or the F-101
  supervisor-pid pattern the comms watcher already uses) so an interrupted commit reaps its
  tree; (c) the load-check-before-heavy-chain step from the cross-estate one-heavy-chain
  agreement becomes a commit-skill preflight.
- **Target surface**: `.agent/skills/change-custody/commit/SKILL-CANONICAL.md` + the commit-queue workflow's
  spawn path (`runInheritedProcess`).
- **Status**: open.
- **Owner direction status**: captured at session closeout under record-all-frictions.
- **The Director's bound on an orphan instance, 2026-09-06** (event 81234225, on c1c4101b): an
  intent orphaned by external termination is cured by
  "a process-group trap or pid-liveness on the intent, never a guard-side valve"; cure (c) fires at the first two-chain host-load reading.

### F-133 — the `commit-queue commit` workflow verifies staged state against the PRIMARY checkout, so worktree seats structurally cannot ride it

- **Source**: R0a tranche-1 landing 2026-07-06 (Stoat rides Gloaming, 432a41), formally
  registered 2026-07-07 (Leopard spins Moonrise, b07d1d) per execution-record §5.7;
  mechanism conserved from abandoned intent `e38f8da0`'s notes before queue hygiene.
- **Observed**: the workflow's verify-staged step reads `git diff --cached` against the
  primary checkout's index, so a PDR-117 worktree seat's staged bundle reads as all-missing
  and the workflow refuses — a structural repo-topology mismatch, NOT a recurrence of the
  F-112 stdio class (the bundle landed cleanly via plain `git commit` in the worktree with
  full hooks green, e.g. `23fd4d907`).
- **Expected**: the queue workflow resolves git state against the tree the intent's seat
  operates in, so worktree seats can ride the same ceremony as primary-checkout seats.
- **Candidate cure**: resolve the git cwd from the claim's worktree scope (F-132's cure
  supplies the scope) or from an explicit `--worktree` intent field; verify-staged and the
  inner commit then run against that tree.
- **Target surface**: `agent-tools/src/commit-queue/commit-workflow.ts` (verify-staged + spawned git cwd).
- **Status**: open. Same sanctioned workaround as F-132. **Recurrence 2026-07-08**
  (Salamander weaves Warmth, 4960fe, sack-plan-refinement worktree on feat/slack-apps):
  identical mechanism — enqueue/record-staged anchored to the primary registry correctly,
  verify-staged read the primary's empty index, intent `34b176e4` self-abandoned
  ("missing: all 9"); landed via the sanctioned plain pathspec commit (`4e684f193`, full
  hooks green). Second independent seat hitting it strengthens the cure's priority.
- **Owner direction status**: standing (record-all-frictions).

### F-134 — root `pnpm build` does not build `@oaknational/result` (turbo graph gap)

- **Source**: Pelican calls Spray closeout 2026-07-08, discovered while root-causing the
  broken-by-construction `pnpm check` (the `clean` → `repo-validators:check` ordering
  defect, fixed the same day by moving validators after the turbo build leg).
- **Observed**: after `pnpm clean`, a root `pnpm build` leaves `@oaknational/result`'s
  `dist/` absent — tsx-invoked consumers importing `@oaknational/result/dist` die with
  `ERR_MODULE_NOT_FOUND` until something else builds the package. CI masks it (its
  pipeline builds explicitly), so the gap only bites local whole-chain runs.
- **Expected**: root `pnpm build` produces a complete built estate — every workspace any
  gate leg imports at runtime.
- **Candidate cure**: add the missing turbo graph edge (or include the package in the
  root build scope); a regression probe is a post-clean root build followed by
  `test -d packages/libs/result/dist`.
- **Target surface**: `turbo.json` / root build task scope.
- **Status**: open.
- **Owner direction status**: standing (record-all-frictions).

### F-135 — `comms inbox` rejects `--since`; the watcher rule's mandated gap sweep has no compliant tool shape (OWNER PRIORITY)

- **Source**: owner directive 2026-07-08 (comms event d84ebf3a; relayed to the resonance
  estate the same hour — the priority covers BOTH estates).
- **Observed**: the comms-all-channels-watcher rule mandates a post-arm foreground sweep
  "covering the window from BEFORE session open" via an inbox-shaped read, but
  `comms inbox` rejects `--since` (exit 2). The compliant fallbacks are a full-history
  replay or a hand-rolled jq time-filter — the exact hand-rolled-filter class the rule
  itself warns against.
- **Expected**: `pnpm agent-tools:collaboration-state -- comms inbox --since <iso>` lists
  every event (all channels, self-excluded) since the timestamp.
- **Candidate cure**: add `--since` to the inbox command; the owning lane is the
  CLI-ergonomics plan (`agent-tools-cli-ergonomics.plan.md`) — this friction is that
  plan's highest-priority item by owner direction.
- **Target surface**: `agent-tools/src/collaboration-state/` (inbox command).
- **Status**: open — OWNER PRIORITY. Second instance 2026-09-03 (Buzzard lifts
  Eyrie, 326bcb, relayed at a boundary): the post-arm gap sweep had to read the
  whole inbox or rely on the seen-file cursor; the ask now includes
  `comms list --since` parity (folded here from a duplicate entry at the
  2026-09-06 consolidation).
- **Owner direction status**: owner-directed 2026-07-08.

### F-136 — practice-core CONTENT has no portability scanner (`portability:check` covers adapters only)

- **Source**: PDR-101 quorum over the 2026-07-08 consolidation batch (two seats
  independently): a new PDR shipped with host-adapter paths and host-local context, and
  no mechanical gate could catch it — `portability:check` validates skills/rules adapter
  parity, never Core file content. Existing PDRs carry the same leakage (precedent
  compounding, unguarded).
- **Observed**: `practice-core-portability` is a governance claim with no scanner
  (`governance-claim-needs-a-scanner` class): host paths (`.agent/...`), plan filenames,
  and seat names inside `practice-core/**` dangle in any adopting repo and nothing fires.
- **Expected**: a repo-validator scans `practice-core/**` for host-path/host-context
  fingerprints (path prefixes, plan-filename shapes) with a per-file allow for the
  bridge-index surfaces that are host-facing by design.
- **Candidate cure**: `validate-core-portability` in the repo-validators estate; per
  PDR-126 it lands at error with the existing leakage fixed or explicitly dispositioned
  in the same landing.
- **Target surface**: `agent-tools/src/validators/` (new validator).
- **Status**: open — tooling candidate.
- **Owner direction status**: standing (record-all-frictions).
- **Instance, 2026-09-25** (Copilot, in both estates): PDR-142 line 73 carried a session prefix
  and a comms event id, which PDR-079's portability rule bars ("event UUIDs, intent UUIDs, session
  identifiers"); cured by hand in both, and the candidate validator would refuse both forms.

### F-137 — staged RENAMES cannot ride the commit-queue workflow (name-only verify vs both-sides pathspec)

- **Source**: the 2026-07-08 dedicated-consolidation landing (Corsair guards Channel,
  ecdd12); two `git mv` thread-record retirements in the bundle.
- **Observed**: two structural mismatches compose. (1) `verify-staged` compares the intent
  list against `git diff --cached --name-only`, which reports a rename as the NEW path
  only — an intent listing both sides reads "missing: <old>", an intent listing the new
  side only passes verify but then (2) the workflow's inner pathspec-scoped `git commit`
  builds a temporary index in which the old path's deletion (absent from the pathspec) is
  not included, so the pre-commit hook's `git ls-files` still lists the old path and the
  machine-local-paths validator dies ENOENT opening it. Same repo-topology class as
  F-132/F-133, different axis (rename semantics, not worktree scope).
- **Expected**: the workflow accepts a bundle containing staged renames — verify-staged
  understands rename records (old→new as one entry) and the inner commit's pathspec
  carries both sides.
- **Candidate cure**: read the staged set via `git diff --cached --name-status -M` and
  normalise `R` records to (old,new) pairs in both verify-staged and the spawned commit
  argv.
- **Target surface**: `agent-tools/src/commit-queue/commit-workflow.ts`.
- **Status**: open. Sanctioned workaround (per the F-132/F-133 precedent in the commit
  skill): plain `git commit -F <msg> -- <paths incl. both rename sides>` with first-hand
  staged-set verification, full hooks.
- **Owner direction status**: standing (record-all-frictions).

### F-138 — commit-queue reuses the coordination-home root for worktree git operations

- **Source**: napkin 2026-07-13 "Sloop holds Lagoon (5fbef7), part 2" (full trace); intent
  `dc13fba5` abandonment notes; claim closure `bf3fe8e2`; commit body `SHA:e888ccb01`
- **Surface**: `agent-tools commit-queue` (record-staged / verify-staged / commit) and
  `collaboration-state claims open` relative-path handling, invoked from a git worktree
- **Observed**: from a worktree, `claims open` ENOENTs on the relative `--active` path
  (registry absent — untracked tier, ADR-199); `commit-queue` enqueue/show reach the
  PRIMARY registry, but `record-staged` fingerprinted an EMPTY staged set
  (`staged_name_status: ""`) while the worktree index held the file, so the commit
  workflow failed verify-staged-before ("missing: …napkin.md") and auto-abandoned the
  intent. There is no split between two schemes: one root (the coordination home) is
  supplied for both, and it is wrong for git operations whenever the invoking tree is a
  worktree.
  Adjacent capture: piping the workflow through `| tail` masked the non-zero exit
  (background-task false-green).
- **Expected**: one resolution scheme for both surfaces — operate fully against the
  invoking worktree's index (registry still at the coordination home), or refuse loudly at
  enqueue time when cwd is a worktree.
- **Candidate cure**: split the two roots at the CLI boundary — `runCommitQueueTopic`
  collapses both concerns into `repoRoot: resolveCoordinationHome(input.cwd)`
  (`agent-tools/src/bin/agent-tools-cli-topics.ts:34`), and the staged reads / workflow git
  calls are already pinned to that root (`commit-queue/git.ts` `runGit` uses
  `cwd: repoRoot`), so the registry root must stay the coordination home while a separate
  git-worktree root carries the invoking cwd. Fixing inside `runCommitWorkflow` alone
  cannot recover the worktree. Until cured, add a worktree-detection guard that errors
  with the plain-path instruction. (Mechanism VERIFIED against source at the PR 355
  review round, 2026-07-13: single-root reuse, not a resolution split.)
- **Target surface**: agent-tools CLI (`commit-queue` workflow deps); compose with the
  `coordination-home-cli-path-defaulting` plan (F-41 family) rather than a parallel fix
- **Status**: fixed-2026-07-14 at `SHA:8c6b1d157` (branch
  `fix/f138-commit-queue-two-root-split`) — the two-root split landed as the candidate cure
  named below prescribed. Mechanism: `runCommitQueueTopic` collapsed the registry root and
  the git root into one `repoRoot`. Cure: `CommitQueueCliInput` now carries BOTH roots —
  `repoRoot` (coordination home, registry only) plus a required lazy `resolveGitRoot`
  thunk (`agent-tools/src/commit-queue/git-root.ts`, `git rev-parse --show-toplevel` from
  the invoking cwd) consumed by every staged read, verification, the advisory
  orchestrator, and the inner `git commit`; when no git root is derivable the CLI refuses
  loudly — no fallback to the coordination home, because the fallback IS this defect. The
  primary checkout is the degenerate case (both roots coincide; prior behaviour
  preserved). Evidence: RED-first regression suite
  (`agent-tools/smoke-tests/commit-queue-worktree.smoke.ts` — real scratch primary +
  linked worktree; pre-fix it reproduced `staged_name_status: ""`, the
  "missing: …" auto-abandon, and the guard case's silent exit 0), then GREEN; and the fix
  commit itself was landed via the repaired ceremony FROM the
  `f138-two-root-split` linked worktree against the shared primary registry (intent
  `8cd528f0`, claim `12fdfcee`). The `claims open`/comms relative-path face of this entry
  (and the F-41 composition edge) remains open — the cure here is commit-queue-scoped.
- **Owner direction status**: standing (friction capture is the register's standing owner
  direction, lines 16-20; only the unusually detailed trace depth was a session-scoped ask,
  2026-07-13)
- **Corroboration (2026-07-13T17:42Z) + the missing composition edge**: an independent
  seat (Phosphor holds Tallow, codex 019f5c, comms event at the same timestamp) hit the same
  empty-index failure within hours and proposed a `PRACTICE_COORDINATION_HOME` binding.
  Source-verified: the binding is structurally INERT for commit-queue today — the env var
  is injected at the composition edge by design (ADR-078;
  `agent-tools/src/collaboration-state/coordination-home.ts` never reads `process.env`) and `runCommitQueueTopic` calls `resolveCoordinationHome(input.cwd)`
  WITHOUT passing the declared home (`agent-tools/src/bin/agent-tools-cli-topics.ts:34`). That missing wire is
  a SEPARATE composition gap, not the cure: wiring it would still yield the single
  `repoRoot` consumed by both the registry (`agent-tools/src/commit-queue/cli.ts:41`) and
  the staged git reads (`cli.ts:140,174`) — the cure remains the two-root split named in
  the candidate cure above. `--registry` IS accepted on every subcommand including
  `enqueue`/`commit` (`agent-tools/src/commit-queue/options.ts`), but it pins only the registry — the git
  reads still follow the unwired root — so neither surface alone re-roots a worktree
  invocation. The plain-commit interim path above stands.

### F-140 — watcher and inbox share a cursor, conflating delivery with acknowledgement

- **Source**: Phosphor holds Tallow closeout event `d8a305ec` and the durable ARC
  record in
  `.agent/collaboration/rapid-comms/2026-07-14-vision-strategy-planning-estate-phosphor-holds-tallow-and-phosphor-weaves-embers.md`;
  mechanism verified against `cli-comms-watch.ts`, `cli-comms-inbox.ts`, and
  `cli-io-production.ts` on 2026-07-14.
- **Surface**: `pnpm agent-tools:collaboration-state -- comms watch` and
  `comms inbox` when invoked with the same `--seen-file`.
- **Observed**: the watcher emits an event and then appends its id to `seenFile`; a later
  foreground inbox reads that same file and reports `no new comms events`, even when the
  agent has not personally inspected or interpreted the event. Transport delivery is
  therefore presented as if it proved cognitive acknowledgement.
- **Expected**: passive delivery/liveness, foreground delivery, and deliberate
  acknowledgement after inspection remain independently observable; any one may advance
  without erasing the others' unread or unacknowledged sets.
- **Interim guidance**: give foreground delivery checks an independent seen file, or run
  a direct time-window/corpus sweep, then record acknowledgement separately after
  inspection. Do not interpret `no new comms events` on either auto-advanced cursor as
  proof of personal review.
- **Candidate cure**: separate transport delivery, foreground delivery, and explicit
  acknowledgement at the CLI boundary. `watch` advances only transport state; `inbox`
  advances only foreground-delivery state; a distinct acknowledgement action advances
  cognition state only after the caller confirms inspection. F-135's `--since` sweep
  selects the foreground review set but does not itself acknowledge it; the caller applies
  the explicit acknowledgement action after reviewing that set. Derive and document all
  canonical state paths from the agent identity so callers do not hand-roll cursor names.
- **Target surface**: `agent-tools/src/collaboration-state/cli-comms-watch.ts`,
  `agent-tools/src/collaboration-state/cli-comms-inbox.ts`, cursor-path helpers,
  and the watcher rule invocation.
- **Status**: open — first observed instance; compose the cure with F-135.
- **Owner direction status**: session-scoped Director route under the standing
  record-all-frictions direction.

### F-141 — refound-freeze executed a full freeze on an attempted `--help` interface probe

- **Evidence**: comms failure-mode event 2026-07-14 (Cedar rides Undergrowth, 270379); napkin
  entry "2026-07-14 — Cedar rides Undergrowth"; first-hand mechanism trace of
  `parseFreezeArgs` + `core/cli-arg-parser.ts` `scanArgs`.
- **Surface**: `pnpm --filter @oaknational/agent-tools refound-freeze -- --help` (pnpm forwards
  the `--` literally), and any entry sharing the rule-plus-out parser.
- **Observed**: `scanArgs` treats `--` as a stop-terminator and silently swallows every
  following token; the freeze parser registered no `--help` flag; the probe therefore ran the
  FULL S0 conservation event (679 files copied into the invoking checkout — an isolated
  worktree, so no shared state was harmed) instead of printing help.
- **Expected**: a state-writing tool refuses tokens it does not understand and offers a
  run-nothing interface-description path; probing an interface must never execute the action.
- **Cure (landed with this entry)**: `refound-freeze-args.ts` — the parser refuses any argv
  containing `--` ("takes no positional arguments"), registers `--help`/`-h`, and both
  rule-plus-out entries (`refound-freeze`, `refound-merge-recheck`) short-circuit on the help
  verdict before any preparation or write; unit-contract suite (help, terminator, and value-guard cases); live probes green in both
  directions (the original footgun invocation now exits 1; `--help` prints usage and writes
  nothing).
- **Residual class (recorded follow-up — the deferral's condition)**: the ten remaining
  refounding entries (batch-status, claim-census, default-ledger, inventory,
  plant-challenge-canary, plant-orphan, residue, sweep, tile, verify-freeze) register no
  `--help` and share `scanArgs`' stop-at-`--` swallow — `-- --help` still executes a default
  run on each today (report/proof writers; rerunnable, low-mass). The structural cure lives in
  the SHARED scanner (`core/cli-arg-parser.ts`): spec-driven `--`/positional refusal
  (default-refuse for tools with no positionals) + help registration across the entries, and a
  closed-shape help verdict (`{kind:'help'} | {kind:'run'; …}`) so an entry that forgets the
  short-circuit cannot compile — per consolidate-at-second-consumer, the estate pass is the
  consolidation moment; this commit's per-tool pre-check is deliberately the first consumer.
  The swallow class also reaches non-refounding `scanArgs` consumers (context-cost,
  session-metadata, plan-state) — audit their help coverage in the same pass. Further recorded
  follow-ups from the 2026-07-14 gateway review of the G3.3 out-subtraction cycle: (1) the
  out∩sweep overlap — `out`-class subtraction applies to the `in` enumeration only; an `out`
  class overlapping a sweep glob is still silently inert (no ratified instance today) — either
  extend subtraction to the sweep enumeration test-first or refuse out/sweep overlaps at rule
  parse; (2) the unreachable empty-set check in the merge-recheck helpers (pre-existing dead
  code) — delete it.
- **Status**: cure landed for the conservation-event pair; class sweep open.
- **Owner direction status**: Director-ruled in-scope for the r1 seat (directed event
  2026-07-14 ~09:43Z), sequenced after the G2/G3 sitting packet.

### F-142 — a passive comms watcher's seen-cursor is not a cognition cursor

- **Evidence**: napkin entry 2026-07-14 "Phosphor holds Tallow (019f5c): visibility-estate
  closeout and recursive loss scan" (candidate: transport cursor is not a cognition cursor);
  comms directed event `7d0cf7bd-6300-4464-b5a0-770ee54ce4b6` (Quasar mends Umbra, Director,
  naming this "a real find" and committing to route it here).
- **Surface**: the all-channels comms watcher's seen-file cursor
  (`comms-all-channels-watcher.md`), shared by both the persistent background watcher AND any
  later foreground `comms inbox`-shaped personal check.
- **Observed**: the persistent watcher consumed a Director-addressed directed event and
  advanced the shared seen cursor. A later foreground inbox read, performed by the same
  agent to personally inspect and interpret messages, found "no new comms events" against
  that already-advanced cursor — even though the agent itself had never read or interpreted
  the event's content. A passive transport process can prove delivery/liveness (the event was
  received, the watcher is alive); it cannot prove cognitive acknowledgement (a human or agent
  actually read and understood it). The two are currently the same cursor, so proving one
  silently reads as proving the other.
- **Expected**: a required personal message-check (the two-minute self-check cadence, or any
  "did you see X" verification) should be answerable from a cursor that only advances on
  actual cognitive inspection, independent of what the background transport has already
  consumed.
- **Candidate cure**: separate the transport cursor (what the background watcher has drained)
  from a cognition cursor (what the agent has personally read and interpreted) — either a
  second, agent-owned seen-file advanced only by an explicit personal-read action, or a
  direct time-window/corpus sweep that does not consult the transport cursor at all.
- **Status**: open — single confirmed instance; not yet cured or estate-scoped.
- **Owner direction status**: standing (record-all-frictions); Director committed to routing
  this entry in the same directed event.

### F-143 — `commit-queue -- commit` races a concurrent peer's file six-for-six; direct `git commit` passed clean twice, immediately

- **Evidence**: napkin entry 2026-07-14 "Dolphin weaves Reef (ffedcf): full session handoff,
  loss-scan, and recursive metaloss" (first-order loss scan); six consecutive terminal failures
  observed first-hand in one sitting, each with identical stack traces, interleaved with two
  clean direct-invocation passes.
- **Surface**: `agent-tools commit-queue -- commit` (the composite verify-staged →
  advisory-orchestrator → phase → verify-staged-again → `git commit` workflow) vs. a plain
  `bash .husky/pre-commit` or `git commit` invocation of the identical hook chain.
- **Observed**: staging and committing a 32-file bundle (a dedicated-consolidation closeout) on
  a shared primary checkout while a second, unidentified live session was actively renaming/
  recreating one tracked file
  (`.agent/reports/oak-reusable-curriculum-architecture/drafts/oak-reusable-curriculum-architecture-cross-estate-reflection.md`).
  Six consecutive `commit-queue -- commit` attempts all crashed at the identical point: the
  pre-commit hook's `validate-no-machine-local-paths` step ran `git ls-files -z`, got back a
  path that was at that instant absent from disk, and `readFileSync` threw (the validator's
  designed fail-loud behaviour on a tracked-but-unreadable file — not itself the defect).
  Standalone re-runs of the same validator, seconds before and after each failure, consistently
  passed clean. Running `bash .husky/pre-commit` directly (bypassing the commit-queue tool)
  passed the FULL hook chain, twice, on the first try each time, including this exact
  validator step. A subsequent plain `git commit -F <msgfile>` (same staged tree, same hooks)
  also succeeded immediately.
- **Expected**: if the underlying hook chain is equally likely to hit a genuine external race at
  any given moment, direct and tool-mediated invocations should fail at roughly comparable rates
  — six-for-six via one path against two-for-two clean via the other, on the same tree, in the
  same few minutes, is a bigger asymmetry than "bad luck" comfortably explains.
- **Candidate cure**: **unconfirmed hypothesis, not yet source-verified** — the
  `commit-queue -- commit` workflow's composite chain (verify-staged, the advisory orchestrator's
  own fitness/vocab/message sub-checks, a phase transition, a second verify-staged, THEN the real
  `git commit` which re-runs the full hook chain a second time) plausibly takes meaningfully
  longer wall-clock time than a single direct hook invocation, widening whatever window a
  concurrently-active peer process needs to touch the vulnerable file. Reproduction recipe for
  the next investigator: stage a bundle, have a second process repeatedly rename/recreate one
  tracked file in a tight loop, run `commit-queue -- commit` several times back-to-back against
  one direct `git commit` under the same conditions, and compare failure rates plus wall-clock
  timing of each path to the point where `validate-no-machine-local-paths` executes.
- **Target surface**: `agent-tools/src/commit-queue/` workflow composition (the `commit` action
  specifically), or — if the timing hypothesis is falsified — the shared-checkout concurrency
  model itself (multiple live sessions on one working tree with no file-level staging isolation
  outside the advisory `git:index/head` claim).
- **Status**: open — mechanism unconfirmed, reproduction recipe recorded, workaround identified
  (a plain `git commit` on a pre-verified staged tree is a legitimate fallback when the
  commit-queue tool itself — not the underlying gates — is the thing failing repeatedly).
- **Owner direction status**: standing (record-all-frictions).

### F-144 — `commit-queue -- record-staged` dies with `spawnSync <system-git> ENOBUFS` on a large staged bundle

- **Source**: Zodiac turns Solstice (`019f65`), 2026-07-15 r1-S1 deterministic lane, first-hand.
- **Observed**: with a ~49 MB five-file staged bundle (996,181 inserted lines), `record-staged`
  crashed at `spawnSync <system-git> ENOBUFS` — the child-process output buffer overflowed on a
  git invocation whose stdout scales with staged content. Intent `31a1df9a` was marked abandoned
  with that evidence; the commit then landed through the documented explicit-pathspec fallback
  (message prevalidated, hooks enabled).
- **Expected**: the commit-queue tooling either streams (or raises `maxBuffer` on) git output it
  consumes, or degrades gracefully with a clear too-large-bundle message naming the fallback.
- **Candidate cure**: switch the affected `execFileSync` call (commit-queue `git.ts`
  `runGit`, which buffers `git diff --cached --full-index --binary` under a 32 MiB
  `maxBuffer` via `STAGED_PATCH_BUFFER_BYTES`) to a streaming spawn, or raise that explicit
  `maxBuffer` to the tool's declared bundle ceiling; add the ceiling to the tool's help
  text. (The observed error string can still name `spawnSync` — Node surfaces it from the
  underlying call — but the call site is `execFileSync`.)
- **Target surface**: `agent-tools` commit-queue `record-staged` implementation.
- **Status**: open — workaround proven (explicit-pathspec commit path).
- **Owner direction status**: standing (record-all-frictions).

### F-145 — the PreToolUse blocked-patterns hook has no per-instance owner-authorisation valve

- **Source**: Schooner guards Whirlpool (`82a9df`), 2026-07-15 residue disposition sweep, first-hand.
- **Observed**: the owner gave express per-instance permission for four proven-conserved
  `git stash drop` operations — the exact escape `never-use-git-to-remove-work.md` §"A Block Is
  a Question, Never a Detour" names ("proceed only on express per-instance instruction"). The
  hook still blocked every agent invocation: verified that `hook-policy` (policy.json, the guard
  runner, `check-blocked-patterns`) implements no authorisation mechanism at all. Every route
  around it is separately banned (substring evasion, sibling commands, temporary policy edits),
  so the rule's own express-permission path is mechanically unreachable for agents — the owner
  had to run the four commands personally via `!`.
- **Expected**: an owner's express per-instance instruction should have a mechanical meaning.
- **Candidate cure**: a designed one-shot authorisation valve — an owner-written authorisation
  file naming the exact command (and optionally a use-by time), consumed and invalidated by the
  guard on first match, logged to the comms stream. Preserves the stop-and-surface moment (the
  agent still stops and asks; the owner still explicitly authorises) while making the rule's
  documented escape real. Never a policy-pattern removal (gate-off-fix-gate-on is banned).
- **Target surface**: `agent-tools/src/hook-policy/` guard runner + `.agent/hooks/policy.json`
  schema; `never-use-git-to-remove-work.md` §Block-Is-a-Question gains the valve's usage note.
- **Status**: open.
- **Owner direction status**: standing (record-all-frictions).

### F-150 — `pnpm install --ignore-scripts` in a fresh worktree silently disarms ALL git hooks

- **Source**: Forge rides Brimstone's unit-1 delegate (AIP-159 fix-forward worktree),
  2026-07-21T07:08Z broadcast, first-hand; detected and manually mitigated in-lane.
- **Observed**: `pnpm install --ignore-scripts` skips the husky `prepare` lifecycle
  script, so `.husky/_` is never materialised in the fresh worktree — and git then
  SILENTLY SKIPS EVERY HOOK: pre-commit and pre-push ran as no-ops (push exit 0,
  fully ungated). No warning at any layer; the gates simply do not exist in that
  working copy. (Ironic composition: `--ignore-scripts` is itself the cure Sonar
  recommends for CI installs — the security posture and the gate posture collide.)
- **Mitigation used**: the delegate installed the husky shims and re-ran the full
  pre-push suite manually to exit 0 over the already-pushed tree.
- **Expected**: gate absence fails loud. Candidate cures: (a) the fresh-worktree
  setup path (start-right §8, worktree-hygiene) gains a mandatory
  `[ -d .husky/_ ]` verification before any commit ("verify `.husky/_` exists
  before trusting any gate"); (b) a repo-validator that recomputes
  hook-materialisation (hooksPath resolves + `_` shims present) so a hookless
  working copy cannot read green; (c) CI remains the backstop but is not the
  cure — the contract is local-gates-bind.
- **Status**: open. Cure (a) is a step of `set-up-worktree-lane` in both estates (its `.husky/_`
  check). Cure (b), a recomputing check on the commit and push path, exists in neither estate's
  agent-tools (no `hooksPath` reader found; read 2026-10-01).
- **Instance, 2026-09-27** (a seat, JC PR 231's first push): a fresh worktree's first install
  failed at postinstall and the second ran no husky prepare, so `.husky/_` was absent and the push
  ran ungated; the pre-open review widened cure (b) to git's own HEAD, objects and refs tests.

### F-148 — a suspended session's heartbeat Monitor keeps emitting: false liveness from an autonomous emitter

- **Source**: Heron seeks Bluff (`ef3eb0`) failure-mode capture 2026-07-20T12:01:43Z
  (their seat harness-suspended ~10:53–11:57Z while the heartbeat loop emitted on
  schedule); corroborated first-hand by the Director (a 14-min unacked directed
  contract against steady heartbeats).
- **Observed**: heartbeat loops run in the platform's background-task layer,
  independent of the reasoning loop — a suspended session heartbeats indefinitely,
  asserting liveness the seat does not have. A live instance of the PDR-078 §6
  heartbeat-only-stall class with a NEW generator (suspended harness, not stalled
  agent), sibling of F-44 freshness≠liveness.
- **Expected**: liveness signals should degrade when the reasoning loop stops.
- **Candidate cure**: observe-side (proven live): direct-ping + bounded-declared-default
  is THE detection — weight substantive-response over heartbeat-presence; peers treat
  heartbeats-during-suspension as an expected false-positive class. Emit-side
  (substrate work): the heartbeat loop carries a staleness self-check against its own
  session's last reasoning activity and stands down when stale.

### F-149 — comms send/direct inline `--body` dies on shell interpretation; the failure hides behind filters

- **Source**: repeated seat instances 2026-07-15 → 2026-07-20 (multi-line inline
  bodies failing exit 2, once writing a junk probe event to the canonical stream;
  the class re-bit the Director's own seat twice on 2026-07-20 and a grep-filtered
  send failed silently, caught only by an inbox verification read).
- **Observed**: multi-line or metacharacter-bearing inline `--body` argv fails
  shell interpretation (or the CLI's concept gate) in ways that pipes and filters
  swallow; the send did not land while the ceremony read as done.
- **Expected**: the body path should be quoting-hazard-free by construction.
- **Standing agent cure**: ALWAYS `--body-file` for anything beyond a short single
  line; capture the send's exit in-band (`SEND_EXIT:$?`, per the
  `exit-codes-in-band-never-piped` rule) and verify the event landed on the
  stream before claiming it sent.
- **Candidate structural cure**: the CLI rejects multi-line inline `--body` with
  a fix-instruction pointing at `--body-file` (fail-loud at the boundary instead
  of downstream), and prints the written `event_id` on every send path
  (`comms direct` currently prints none).
- **Same friction**: also filed as F-32, F-48, F-152 (an inline comms body meets the shell before the tool does); read them together, and
  count them once.

### F-186 — `turbo run lint` returns a cached green that never ran the new linter

- **Id note (2026-09-16)**: filed as F-150 on 2026-07-25, a number the
  `pnpm install --ignore-scripts` friction above already held; the collision
  was noticed on 2026-07-30 and left. Renumbered to the next free id at the
  2026-09-16 dedicated consolidation. Dated records that cite "F-150" for the
  turbo-lint cache (the 2026-07-31 corpus data under
  `.agent/reports/agentic-engineering/comms-corpus-knowledge-transfer/data/`)
  mean this entry; the 2026-07-23 napkin's F-150 is the `--ignore-scripts`
  entry, which keeps the number, and the 2026-07-30 records cite the collision
  itself.
- **Source**: Cygnus weaves Vastness (41a8c5), MCP-151 majors sweep 2026-07-25,
  bumping `eslint-plugin-unicorn` 70 → 72 (PR #550).
- **Observed**: after the bump, `pnpm exec turbo run lint` reported
  `FULL TURBO`, 47/47 cached, exit 0 — in under three seconds, having executed
  no rule against the new plugin. The lint task's cache key does not account
  for the resolved version of the plugins the config loads. `--force` produced
  a real run (47/47, 0 cached, 45s), also green, but the default green was
  evidence of nothing.
- **Expected**: a gate that cannot have run should not report pass. Changing
  the linter must invalidate the lint cache.
- **Standing agent cure**: any dependency change that touches a linter, its
  plugins, or its config must be gated with `turbo run lint --force`, and the
  PR should state the cached-vs-forced task counts so a reviewer can see the
  run really happened.
- **Candidate structural cure**: add `pnpm-lock.yaml` (or the resolved plugin
  set) to the `lint` task's `inputs` in `turbo.json`, so a plugin bump busts
  the cache by construction. Same question worth asking of `type-check` and
  `test`, which are equally blind to a toolchain-only change.

### F-151 — the major-version guard blocks prose, and its own fix-instruction is unfollowable

- **Source**: Cygnus weaves Vastness (41a8c5), MCP-151 majors sweep 2026-07-25
  (`@semantic-release/*` commit, PR #551).
- **Observed**: `prevent-accidental-major-version` uppercases the whole commit
  message and substring-matches `BREAKING CHANGES`, so an ordinary sentence
  describing an upstream dependency's release — "the stated breaking changes
  are the module format and the two floors" — is rejected as a release-major
  footer. The guard's own error text then advises *"document breaking changes
  in the commit body (without the BREAKING CHANGE footer)"*, which its matcher
  makes impossible: any wording of that advice trips it.
- **Expected**: the guard should catch the conventional-commits **footer**,
  which is what semantic-release's analyzer actually reads, and leave prose
  alone.
- **Standing agent cure**: never write the phrase in a commit body; describe
  upstream majors as "what the major alters" or similar. Never reach for
  `--no-verify` — the guard is right about the risk, only wrong about the
  match.
- **Candidate structural cure**: anchor the match the way the analyzer does —
  a line beginning `BREAKING CHANGE:` / `BREAKING-CHANGE:` (optionally after
  the blank line that starts the footer block) — rather than a bare substring
  anywhere in the message. Then correct the advice line, which currently
  describes behaviour the code does not permit.

### F-152 — comms send/direct with a long inline --body exits 2 writing nothing; --body-file lands the identical body

- **Source**: Sycamore herds Xylem (028dc4), two first-person instances
  2026-07-30 (~07:10Z cricket-tally direct, ~07:34Z ruling-relay direct);
  third instance same hour at Possum weaves Midnight (d5848b), their
  07:41Z ACK broadcast's process note — cross-seat, same signature.
- **Observed**: `collaboration-state -- comms direct|send` with an inline
  `--body` of roughly ≥1.5KB fails with bare `[ELIFECYCLE] Command failed
  with exit code 2` through the pnpm wrapper and writes NO event file (a
  true failure, not false-silence — state-read verified zero events each
  time). Re-sending the byte-identical body via `--body-file` succeeds
  first try. Short inline bodies land fine.
- **Expected**: inline `--body` and `--body-file` should have identical
  capacity, or the CLI should refuse long inline bodies with a named
  error naming the `--body-file` path, not a bare usage-class exit 2.
- **Mitigation (proven, three instances)**: write the body to a scratch
  file and pass `--body-file`; on any ambiguous outcome, read the comms
  dir for own-events-since-timestamp BEFORE retrying (retry is a write).
- **Candidate structural cure**: reproduce with a controlled body-length
  bisect to find the boundary and the failing layer (shell argv limits vs
  pnpm arg forwarding vs CLI parsing); then either fix the intake or add
  the named refusal. Route: agent-tooling backlog; evidence lives in this
  entry's three instances and the two seats' napkin notes.
- **Same friction**: also filed as F-32, F-48, F-149 (an inline comms body meets the shell before the tool does); read them together, and
  count them once.

### F-153 — first new-shape comms event poisons all stale-dist readers (strict parsers + poison-pill drain)

- **First observed**: 2026-07-30 ~11:34:35Z, Possum weaves Midnight
  (d5848b), post-merge live probe of PR #651 (event `34285ab9`, the
  store's first `in_response_to`-carrying directed event).
- **Observed**: every reader running the primary checkout's pre-#651
  dist refused the event (`Unrecognized key: "in_response_to"` — Zod
  strict), and `comms watch`'s drain retried the unparseable file every
  tick, delivering NOTHING behind it: this seat's watcher error-stormed
  until harness-killed; the Director's heartbeat stopped the same
  minute. Presents at OTHER seats as peer silence, not as self-error.
- **Expected**: per ADR-220/PDR-049/050, readers that do not understand
  an additive optional field ignore it; a bad file should not silence
  the stream behind it.
- **Mitigation (proven)**: rebuild the primary dist (already owed under
  use-built-agent-tools-cli §Sequencing whenever main merges into
  coordination), re-arm watchers on the SAME cursor — zero events lost
  (the poison blocks the cursor; it never skips). Until every seat's
  dist is rebuilt, do not write new-shape events.
- **Candidate structural cures** (routed to Director, event `d62642e7`,
  submission-day cut respected): (1) ADR-220 post-merge amendment naming
  reader-rebuild sequencing as a consequence of additive evolution on a
  strict substrate; (2) drain quarantine-vs-fail-loud design decision
  for unparseable files; (3) test doctrine: schema-touching changes must
  exercise the old-reader × new-event compat cell (no rebuild-everything
  suite can reach it).

### F-154 — negation-contrast tombstone detection has no enforcement layer (structural form exceeds the innate hook)

- **Source**: Gull lifts Nimbus (`3da0ae`), 2026-08-07 curator pass;
  Director verdict event 2026-08-07T10:51Z (policy.json probed at the
  Director seat: zero hits for the tombstone class). Substance carried
  from `no-tombstones-for-removed-ideas` §Why This Rule Is Strict, whose
  tracking pointer previously named the pending-graduations register — a
  drainable buffer — and dangled when the 2026-07-20 drain discharged
  rows without verifying inbound pointers.
- **Observed**: the negation-contrast memorial form ("DELETED, not
  reshaped", "X rather than Y", "built fresh, never a bridge") is a
  STRUCTURAL pattern — a negation bound to a dead concept — not a fixed
  literal. A naive literal block on "never" / "rather than" / "instead
  of" would have an unacceptable false-positive rate, so the write-time
  innate-immunity hook (`.agent/hooks/policy.json`) carries no entry for
  the class, and the reflex recurs at write time, including inside
  tombstone-removal work itself (corpus-proven recursive instances,
  2026-05→06).
- **Expected**: an enforcement increment for the structural form — a
  smarter detector (negation verb within clause distance of a
  removed-concept referent) or an output-time review pass — plus, at
  most, a narrow set of genuinely high-signal banner literals in the
  innate hook.
- **Candidate cure / promotion trigger**: design the structural detector
  as agent-tooling work (route: agent-tooling backlog). Promotes to a
  plan when a seat takes the lane or when a fresh corpus instance shows
  the reflex landing on a permanent doc despite the rule tier.
- **Status**: OPEN. The rule's §Why This Rule Is Strict now points here;
  a future drain of any register this row migrates to re-trues that
  pointer first (the generator this row's own history proves).
- **Same friction**: also filed as F-63 (the negation-contrast tombstone has no structural detector); read them together, and
  count them once.

### F-155 — the prose-width hard limit fires on markdown headings, which are structurally unwrappable

- **Source**: Wisteria lifts Verdure (`c4294f`), 2026-08-06 branch reconciliation,
  first-hand; homed from the napkin at the 2026-08-07 consolidation slice.
- **Observed**: the fitness prose-width check (100 chars) is applied to markdown
  HEADINGS. A heading cannot be wrapped — the only compliant fix is rewriting the
  heading text, so a carried section title over 100 chars has NO compliant
  lossless fix. Two carried napkin headings from another seat read as hard
  findings while being faithful verbatim carriage.
- **Expected**: width discipline on prose lines; headings judged by a rule that
  acknowledges their unwrappability (a heading carve-out, or a re-title-at-
  processing convention).
- **Candidate cure / promotion trigger**: a heading exemption (or separate
  threshold) in the width check. Promotes when a seat takes the fitness-tooling
  lane, or when a third faithful-carriage instance reads as a hard finding.
- **Status**: OPEN. Interim practice: carry foreign headings unaltered; the pass
  that processes them re-titles or drains them (the 2026-08-06 reconciliation's
  own convention).

### F-157 — commit-queue inner pathspec commit dropped four staged-new files from a 118-path intent

- **Source**: Wren calls Downdraft (6b29b5) 2026-08-09 ~12:5xZ, PR #836
  landing; intent `ae26a40a` (registry-verified to contain the four
  paths); session transcript holds the full sequence.
- **Observed**: the `commit-queue -- commit` workflow's inner
  pathspec-scoped `git commit` produced commit `2fa212021` containing 111
  of the intent's 118 paths — exactly the four staged-new
  `packages/core/workspace-config/src/*` modules were dropped while their
  seven staged-new sibling package files (README, configs, manifest)
  landed. Not gitignored (`git check-ignore` exit 1); present in the
  enqueue list; `record-staged`/verify raised nothing; workflow exited 0.
  The tree stayed green (hooks run on the working tree), so the defect
  was invisible until a content check of the commit itself.
- **Expected**: the inner commit carries every intent path, or the
  workflow fails loudly naming the paths it could not commit; exit 0
  with a partial commit is the worst outcome (a green lie).
- **Mitigation (applied)**: follow-up commit `39a891df4` landed the four
  files; standing discipline adopted at this seat — after EVERY
  commit-queue landing, verify the commit content (`git show --stat`)
  against the intent, never the exit code alone.
- **Candidate structural cure**: reproduce with a staged-new-files intent
  in a scratch repo; suspect the pathspec-argv handling for A-status
  entries in the spawned `git commit -- <paths>`; then fix the intake or
  add a post-commit intent-vs-commit diff that fails the workflow on any
  dropped path. Route: agent-tooling backlog.

### F-158 — full `pnpm check` green minutes before the same tree's pre-commit turbo run found 24 type-check tasks red

- **Source**: Wren calls Downdraft (6b29b5) 2026-08-09 ~12:4xZ, PR #836
  landing (check task `b77b2u17n` exit 0 at ~12:36Z; commit-hook task
  `bt8nbsjww` exit 1 at ~12:40Z, 49 cached / 24 type-check misses that
  then failed with real TS2883 errors, reproduced directly).
- **Observed**: `pnpm check` (secrets → clean → full turbo suite →
  validators → knip → depcruise → format) exited 0; nothing edited the
  worktree afterwards except `git add`; the commit hook's turbo run then
  cache-missed 24 type-check tasks and failed them. The red was REAL
  (`pnpm --filter @oaknational/result type-check` reproduced TS2883
  standalone), meaning the check's green verdict for those tasks was
  computed against different effective inputs.
- **Expected**: two turbo runs over an unchanged tree agree; a green
  full-suite check is trustworthy for the commit that follows it.
- **Mitigation**: treat the hook as the verdict of record; on any
  check-vs-hook divergence, reproduce the failing task directly before
  trusting either.
- **Candidate structural cure**: diff the two runs' task hash inputs
  (turbo `--dry=json` env + input capture at both invocation sites —
  check script vs husky hook environment); suspects are env-var
  divergence in hashed `env` keys or `$TURBO_DEFAULT$` input-set
  divergence between invocations. Route: agent-tooling backlog.

### F-159 — Claude Code TUI silently switches session model at quota exhaustion; no resume-time lineage check exists

- **Source**: Director seat (b10c37) 2026-08-10, owner-confirmed: the TUI
  began switching models when the Fable quota ran out instead of stopping.
  The Director seat (registry lineage `claude-fable-5`) ran the whole
  post-compaction day on Opus 4.8; Swordfish's F-92 heartbeat collision
  the same morning was the same class caught by accident.
- **Observed**: a seat's session model can differ from its registered
  lineage with NO surfaced signal. The day's error profile split exactly
  along the enforcement boundary: every mechanical guard (hooks,
  ratchets, skills:check, merge-bot refusal ladder, F-95) held
  model-independently; prose-recorded judgement disciplines
  (deciding-surface reads, re-read-before-declaring, value-lens-first)
  regressed to error types not seen for months.
- **Expected**: a seat knows and surfaces its own model discontinuity at
  resume, the way the git triad surfaces branch/head state.
- **Mitigation**: at every resume/start-right, compare the session's
  declared model against the claims registry row; mismatch = surface
  loudly to the owner before substantive work.
- **Candidate structural cure**: a resume-time lineage check in
  start-right (session model vs `agent_id.model` on held claims), and a
  graduation sweep over the prose-only judgement disciplines to identify
  which have earned mechanical enforcement (the day's evidence: prose is
  vigilance; only enforcement is structure). Route: agent-tooling backlog
  - PDR-014 graduation pipeline.

### F-160 — comms watcher quiet config dies at the drain-step deadline on a large event directory

- **Observed**: 2026-08-11 ~09:1xZ (this seat, Fable 5): the
  heartbeat-excluded watcher exited fail-loud with `step "drain"
  exceeded 60000ms deadline` over a comms directory of ~3,600 event
  files while several gate suites ran concurrently on the host. This is
  the same fast-death the 2026-08-10 seat hit twice with the quiet
  config and recorded cause-unknown before falling back to the noisy
  full-stream config. The initial read at capture — that the default
  per-step deadline, not the exclusion mechanism, was the binding
  constraint — was FALSIFIED the same day by the probes below: 180s
  died identically while the full stream survived at 60s, isolating
  the EXCLUSION PATH as the implicated mechanism. Preserved here as
  falsified history; the probe entries below carry the live cause.
- **Expected**: a drain pass over the live event directory completes
  comfortably inside the step deadline at any realistic directory size.
- **Mitigation attempt FALSIFIED same day**: `--step-timeout-ms 180000`
  died identically within ~30 minutes (drain exceeded 180s). Deadline
  size is not the constraint. The discriminating evidence: the
  FULL-STREAM config drained the same directory all morning on the
  default 60s deadline with zero deaths; both quiet-config arms died
  within the hour. The defect lives on the exclusion path — leading
  hypothesis: excluded events do not durably advance the seen cursor,
  so each drain rescans a growing heartbeat backlog until the scan
  outlives any deadline.
- **Working mitigation**: run the full-stream config (no
  `--exclude-tag`) and absorb the heartbeat wake noise; ticketed as
  MCP-548 for a code-level cure (exclusion must advance the cursor
  exactly as emission does). The curator-pass archive cadence (PDR-094)
  remains the companion pressure valve — ~3,600 live events means the
  archive pass is overdue. Route: agent-tooling backlog.

### F-164 — `pr-watch --watch` is silent across head and check transitions and exits ALL-GREEN on a conflicting, changes-requested PR

- **Observed**: 2026-08-17 (Director seat): `pr-watch 890 --watch` exited
  on ALL-GREEN (checks passed, threads resolved) while the PR sat
  CONFLICTING + CHANGES_REQUESTED — the one state where the watch is most
  wanted. 2026-09-02 (Luna seeks Twilight, 5c0ddc): armed as a Monitor on
  #945, it emitted nothing across two pushes and a full green check run
  (~30 minutes); its silence was indistinguishable from "no change", and a
  60 s `gh pr view` poll emitting only on reviewDecision / mergeStateStatus
  / head change, terminating on MERGED/CLOSED, caught the owner's merge
  within a minute. 2026-09-06 (Finch binds Sundog, 47f9d2): `pr-watch 58
  --watch --interval 60` under a Monitor emitted nothing for 33 minutes
  across three reviewer submissions, six threads and two failing checks;
  replaced by a direct `gh` read poll. The consolidation seat the same day
  armed a 60 s change-emitting `gh` poll from the start (head, merge state,
  review decision, check rollup, unresolved-thread count) and never the
  tool. 2026-09-16 (Zephyr guards Leeward, 281e44), a fourth instance:
  `pnpm --silent agent-tools:pr-watch 149 --watch --interval 60` under a
  Monitor, piped through `grep --line-buffered`, emitted only pnpm's echo line
  for ten minutes while the checks moved from 0 to 19 passing. The silence was
  read as "still waiting" until a blocking wait timed out and a one-shot
  `pr-watch 149` showed 19 passed, 1 pending, 0 failed. Replaced by a
  background `gh pr checks 149 --watch --interval 60`, which ends with the
  checks and returns their exit code. OCE's pr-lifecycle SKILL prescribed the `--watch` form as the supervised watch until its 2026-09-16 consolidation (`63b544464`, an OCE commit) replaced it with a compound GraphQL watch loop that ends only on MERGED or CLOSED; JC.net's copy of the skill still prescribes the `--watch` form (read 2026-10-01), and the tool still wants correcting.
- **Expected**: one line per head change and per check-state transition; a
  heartbeat line at a fixed cadence so a dead watcher is visible; ALL-GREEN
  requires mergeable plus no standing change-request, or a
  `--hold-until-merged` mode.
- **Route**: agent-tooling backlog (the watch-commands node).
- **Cause, read at the fifth instance, 2026-09-29** (Nova turns Penumbra): a Monitor on PR 311's
  `--watch` read zero lines in 30 minutes; `runPrWatchTopic` hands `runPrWatchCli` an
  `OutputBuffer` and returns its text at exit (`agent-tools-cli-topics.ts`, both estates).
- **Read 2026-10-01**: The candidate cure, unbuilt in both estates (the topic still hands the command an `OutputBuffer`), is to pass `process.stdout` and `process.stderr` when `--watch` is set; the seat's workaround calls `runPrWatchCli` from dist with the real streams.

### F-165 — `claims open` has no amend verb; a mis-named area path forces close + reopen

- **Observed**: 2026-09-02 (Luna seeks Twilight, 5c0ddc): a claim's areas
  named a run-record path that broke the archive's filename convention
  (`YYYY-MM-DD-<target>.md`); the only honest cure was close + reopen,
  recorded in the closure summary. 2026-09-06 (Juno seeks Apogee, a693fb): a
  Director-approved extension of a consolidation claim to four more paths
  was close + reopen again (38ec1aaf → bf754a27), the handoff record
  re-attached by hand and the heartbeat loop restarted on the new id.
- **Expected**: `claims amend --area` (or an equivalent single-row edit)
  that preserves the claim id and history.
- **Route**: agent-tooling backlog.

### F-166 — the PDR-078 §4 consumer-absent exemption has no re-arm trigger when fleet composition changes

- **Observed**: 2026-09-03, this seat (Kiln mends Firelight, `3b47e6`,
  Director). The registry read this claim `stale`
  (`fresh_until 2026-09-02T20:22:26Z`) for roughly seventeen hours of
  continuous, comms-visible work. Caught by the INCOMING Director
  (Civet calls Crypt, `2a5c71`) at its arrival grounding, not by this
  seat and not by any check this seat ran.
- **Cause, which is a gap rather than a lapse**: the heartbeat was
  correctly stood down under the PDR-078 §4 consumer-absent exemption
  when the only peer (Willow holds Compost, a PR Review Warden) closed
  out and relinquished its claim. The exemption is sound and the
  stand-down was right at that moment. But **the exemption has a
  suspend condition and no resume condition**: nothing in the rule, the
  tooling, or any check fires when a consumer reappears. The seat that
  suspends the heartbeat is exactly the seat that will not notice the
  fleet changing under it, because suspending it removed its own
  reason to look.
- **Expected**: a seat holding a claim either emits a heartbeat, or has
  a live reason not to that is re-evaluated when the fleet changes.
- **Why it matters more than a stale field looks**: this is the F-92
  shape (comms live, registry stale) arriving through a *legitimate*
  exemption rather than through forgetting, which makes it invisible to
  the F-92 cures. A successor arriving on the registry alone reads a
  stale row and may take the seat over a live Director — which PDR-117
  names as the takeover trap. It did not happen here only because the
  incoming seat cross-checked comms and refused to treat the stale row
  as licence.
- **Candidate cures, none built** (route to the agent-tooling backlog,
  not fixed here): a claims-side check that reports a claim whose
  `heartbeat_at` has lapsed while its agent is emitting non-heartbeat
  comms events; or a re-arm prompt on the team-start/closeout events
  that change fleet size, since those are the exact moments the
  exemption's premise flips; or making the exemption's suspension carry
  an explicit resume trigger in the rule text so a seat writes one down
  when it suspends.
- **Interim discipline for any seat applying the exemption**: treat a
  peer's team-start broadcast as a re-arm trigger, and re-check the
  exemption's premise at every fleet-composition change rather than
  once at stand-down.
- **Provenance**: identified by Civet calls Crypt during PDR-064
  handover grounding and framed by it, correctly, as a tooling gap
  rather than this seat's lapse. Recorded here at its suggestion.
- **Adjacent mechanism, observed the same day and cured by the same
  family of triggers**: a correctly-conducted PDR-064 handover *always*
  emits heartbeat failures in the window between the successor adopting
  the claim in place and the predecessor stopping its heartbeat. Once
  `b5b2744b` belonged to Civet calls Crypt, this seat's comms leg could
  not succeed by construction — the guard refuses a heartbeat anchored
  to another seat's claim (PDR-078 §4 / F-73), which is right. Measured
  twice, at 13:22:25Z and 15:05:36Z, each landing as
  `HEARTBEAT-COMMS-LEG-FAILED`. The hazard is diagnostic, not
  operational: a reader seeing those lines without the adjacent Moment 2
  event diagnoses a dying seat, and the loudest signal in a clean
  handover is a false alarm. Two candidate cures: have the heartbeat
  loop detect that its own claim has changed owner and exit reporting
  `superseded` rather than `failed`; or have Moment 2's adoption stamp
  the predecessor's loop so the failure text names the successor. Same
  re-arm/stand-down trigger family as the gap above, so it is recorded
  here rather than as its own friction.
- **Id note (2026-09-10)**: filed as F-161 by a seat working a checkout
  156 commits behind `main`, where F-161 was already taken ("no tool mints
  the coordination successor-branch name"). Renumbered to F-166 at the
  convergence merge. The collision is itself an instance of the staleness
  this register exists to catch.

### F-185 — `merge-bot merge` cannot read review-run liveness and degrades the verdict to SILENT-WAIT

- **Observed**: 2026-09-02 (Finch calls Pinnacle, c91bd4, PR #908 on the
  canonical line; conserved as received); reproduced 2026-09-06 (Juno seeks
  Apogee, a693fb, PRs #59, #60 and #61 on this line). The review-run leg
  reads `gh agent-task view … --json id,completedAt,pullRequestNumber,pullRequestUrl`
  through the boundary parser in `agent-task-fields.ts`; when the view
  returns `pullRequestNumber` and `pullRequestUrl` as null the parse fails
  and the leg degrades to a typed `unavailable` (the verdict evidence
  carries `review-run liveness unavailable: … expected number, received
  null`), so WAITING-REVIEW-RUN-LIVE is unreachable. With the runs
  unreadable the most-blocking leg reads SILENT-WAIT-RUNS-UNREADABLE for a
  reviewer that was requested and SILENT-WAIT-NO-REVIEWER for one that was
  not (the docs-only class requests none — the state these instances saw);
  the tool polls neither, so the seat retries by hand.
- **Expected**: the view parser tolerates null `pullRequestNumber` /
  `pullRequestUrl` (a run not yet bound to a pull request is a live run, not
  an unreadable surface), so a running reviewer reaches the wait-class
  verdict the tool polls; the cure sits in `agent-task-fields.ts`, not in a
  new hosting-service integration.
- **Route**: agent-tooling backlog (pr-watch review-runs leg, consumed by
  merge-bot).
- **Id note (2026-09-15)**: filed as F-166 on this line; renumbered to F-185 at the upstream
  sync of `c67d33c`, where the upstream line's F-166 (the PDR-078 §4 re-arm trigger, above)
  holds the number.

### F-167 — Copilot's automatic review does not bind a tip that is only a merge commit of the base

- **Observed**: 2026-09-02 (Finch calls Pinnacle, c91bd4, PR #908; conserved
  as received, not reproduced). After a "merge base in, then land" push,
  Copilot posted no review on the merge-only tip, so the Copilot leg read
  OWED until it was requested explicitly. The 2026-08-11 finding "Copilot
  does not auto-re-review on push" is the sibling; this narrows it to
  merge-only tips.
- **Expected**: the landing chain's docs-only class (pr-lifecycle item 5)
  expects no Copilot leg by repository configuration; on other classes the
  expected set still comes from that configuration, so after an update
  merge the chain requests the configured review explicitly, or the
  quiet-window timeout settles the leg as the settlement contract provides
  — a merge-only tip never removes a configured reviewer from the set.
- **Route**: pr-lifecycle worked instance.

### F-168 — `merge-bot merge`'s 45-minute poll budget outlives a 10-minute background-shell bound

- **Observed**: 2026-09-02 (Finch calls Pinnacle, c91bd4; the 2026-08-12 entry
  "merge-bot polls outlive the Bash default" is the earlier form); met by
  design 2026-09-06 (Juno seeks Apogee, a693fb): the chains run under a
  persistent monitor with a retry loop. The tool's poll loop (30 s × 90)
  outlives a harness background task's maximum bound, so a chain started as
  a background shell is killed before the tool's own budget ends; the
  tool's non-wait refusals (SILENT-WAIT, THREADS-OPEN) also return at once,
  so a landing needs an outer loop.
- **Expected**: the tool documents that it must run under a session-length
  monitor, or takes a `--wait-for-reviewer` mode that polls SILENT-WAIT too.
- **Route**: merge-bot documentation; the landing-loop shape in the
  pr-lifecycle skill.

### F-170 — the liveness heartbeat loop has no consumer-absence exit

- **Observed**: 2026-09-05/06 (Finch binds Sundog, 47f9d2: about 240
  heartbeat events overnight with no consumer after the lead closed at
  16:40Z; Buzzard lifts Eyrie, 326bcb, the same night's seed). The two-leg
  loop beats every four minutes until a seat stops it by hand; the registry
  already shows when the seat is alone (one claim), which is PDR-078 §4's
  consumer-absent condition.
- **Expected**: the loop reads the registry each tick and, after N
  consecutive ticks with no other live claim, SUSPENDS emission (with a
  heartbeat-end event) while keeping its registry read alive as a
  lightweight detector, resuming emission the tick a consuming peer's
  claim appears — PDR-078 §4's consumer-absent exemption is self-healing by
  contract, so an exit that leaves no detector would show the new peer a
  silent active seat and open the retirement protocol at ten minutes. A
  seat beating for an owner watching the stream is not a consumer by the
  exemption's own text.
- **Route**: agent-tooling backlog (heartbeat mode); the liveness rule's
  exemption already names the condition.

### F-172 — a failed pre-commit step leaves a fresh intent that blocks the next enqueue

- **Observed**: 2026-09-06 (Juno seeks Apogee, a693fb). A guard refusal
  (the window claim opened under the wrong label, F-132) left the enqueued
  intent fresh; the retry's guard then refused on "multiple fresh matching
  commit-queue intents" until both were moved to `abandoned` by hand with
  `phase --intent-id … --phase abandoned`. There is no `abandon` verb and
  the ceremony had no failure branch that abandoned its own intent.
- **Expected**: `guard` failure abandons the intent it was guarding (or a
  documented `abandon` verb exists), and the ceremony's failure branches
  call it.
- **Route**: agent-tooling backlog (commit-queue); the commit skill's
  ceremony text.

### F-173 — the liveness readers cannot see a paused seat: retired at ten minutes, claim swept at freshness expiry

- **Observed**: 2026-09-06 (Juno seeks Apogee, a693fb; raised by the Codex
  connector on the rules PR and verified in the tree). `peer-liveness.ts`
  classifies from heartbeat events only (retired at or above ten minutes)
  and never reads a heartbeat-end that names an owner-word stand-down; the
  stale-claim sweep archives a retained claim once `freshness_seconds`
  (four hours by default) expires. Two claims whose last heartbeat fell on
  the declared sleep day of 2026-08-19 were archived as `stale` by the
  2026-09-02 fold, handoff records intact. The liveness rule's paused-seat
  bullet now states this; the promise "no reader retires a paused seat"
  holds for peers reading the stream, not for the tools.
- **Expected**: a machine-readable paused state — a claim field set by the
  stand-down (with the owner-word event id) that the liveness classifier
  reports as `paused` and the stale sweep skips until the claim's own
  declared resume horizon, or until the seat closes it.
- **Route**: agent-tools backlog (collaboration-state: claims + peer-liveness),
  beside F-170.
- **Instances, 2026-09-28 and 2026-09-29** (Nova turns Penumbra): a live seat with no open claim
  in an estate read as silent there, since a heartbeat send refuses a sender with no active claim
  row; it followed PR 287's landing in OCE and recurred on JC's stream the next day.
- **Read 2026-10-01**: The paused state this entry expects extends to a claimless standby seat,
  read from the team-start registration and the watcher's live assertion.

### F-174 — `assert-watcher-live` keys on the display name alone

- **Observed**: 2026-09-02 (Kiln holds Slag, 1447f4; verified in
  `cli-comms-assert-watcher-live.ts`: `codename = self.agent_name`, platform
  and model never compared). A watcher armed as `claude / claude-fable-5`
  against a registry row of `claude-code / claude-fable-5-1` asserted green;
  the first `comms send` under the shorter tuple was refused. The F-95 gate
  accepted a lookalike key.
- **Expected**: the move-1 assert checks the full identity tuple against the
  registry row; an arm whose platform/model has no row is refused.
- **Route**: agent-tooling backlog (collaboration-state), beside F-95; the
  watcher rule's arm template derives arm and assert from one
  `identity preflight` read.
- **Note (2026-10-02)**: read against the code again: the routing key now compares `id` alone
  (`active-agent-routing.ts` lines 53–62), not the display name; platform and model are still
  never compared (F-292 carries the mechanism).

### F-175 — content-audit review modules can pin one path twice; the last spread wins silently

- **Observed**: 2026-09-02 ~18:4xZ (the pagination-echo lane's second
  catch-up merge). After the merge two review modules pinned
  `mcp-tools/runtime/execute.ts` with different hashes;
  `CURRENT_SOURCE_DELTA_REVIEWS` spreads the modules in order, so the later
  pin won, the earlier was dead code and the validator stayed green. Cured
  by one owner per path (the generated-runtime module).
- **Expected**: the aggregator refuses a path pinned in more than one
  module, as the truth-set builder's `requireNoDuplicates` refuses
  duplicate ids.
- **Route**: agent-tooling backlog (content-audit); until then a merge that
  touches two review modules greps the pinned paths for duplicates before
  trusting a green validator.
- **Status**: addressed (the entry's own text: cured by one owner per path).

### F-176 — workflow fan-outs launch without a per-stage budget or a pilot measurement

- **Observed**: 2026-09-03 (the wrap workflow's dedupe barrier over 160 raw
  learnings was still generating after fourteen minutes and would have fed
  about 300 verification agents; the lead stopped the run and synthesised by
  hand, so the verify and synthesis stages never ran). 2026-09-06/07 (Juno
  seeks Apogee, a693fb): two mapping fleets of 110 planned legs spent about
  8.1M tokens at 82k–171k per leg, with a verify phase of 41 legs returning
  one result; the fleet-design rule's design-review threshold bound nothing
  at launch.
- **Expected**: a launch carries a pilot-measured per-leg cost times N and a
  stage budget the script enforces (the workflow API's `budget`); a stage
  whose fan-out depends on an earlier stage's output caps that output
  before it fans out.
- **Route**: the fleet-design rule (cost model, pilot as step 0, yield
  sample; the 2026-09-07 napkin block carries the full defect list); the
  wrap skill's workflow template carries a stage budget.

### F-177 — pr-lifecycle's in-loop step-back did not fire on a prose-class PR; corrected out of band

- **Observed**: 2026-09-03 (PR #50, a prose-class report): eleven review
  rounds, 28 findings each cured in its own push with a fresh monitor; the
  shepherd's own round-four step-back comment did not stop the curing; the
  owner's manual invocation of the pr-lifecycle, proportionality and
  metacognition skills did. Filed under PDR-140 clause 8: an out-of-band
  cognitive-skill invocation correcting a running PR loop is a defect
  against pr-lifecycle.
- **Observed AGAIN**: 2026-09-11 (PR #132, a mixed code/records changeset;
  Nettle guards Pistil, 2de368). Five-plus settled rounds, sixteen findings,
  every one read as cure-worthy and cured in its own push; PDR-132's
  two-round budget passed without the budget-exceeded record or the
  generator question; the step-back's four-round arm true throughout and
  never evaluated. The correction was again the owner's manual invocation —
  `metacognition`, `pr-lifecycle`, `proportionality`, `plan`, the same set
  as 2026-09-03 plus one. No tally existed either time.
- **Expected**: the tally built at PR-open reads step-back-mandatory at the
  fourth settled round and the settlement budget refuses a fifth cure push.
- **Why the first filing did not cure it, and THE CURE IS ALREADY RATIFIED.** The
  expectation above presupposes a tally, and nothing makes one exist: item 2 says
  "build the tally, or the trigger cannot fire", which is advice, and advice is what
  fails under load — the same generator this estate has been curing everywhere else
  by building gates. Twice now the shepherd was mid-loop, each finding individually
  valid, with no artefact counting anything.

  The instrument that would end it is
  [`pr-tally`](../../plans/delivery/pr-tally.plan.md), owner-ratified 2026-09-08
  ("pr-tally, ratified") and NOT BUILT: `pnpm agent-tools pr-tally --pr <n>`, building
  the tally by the commit each review binds to, printing one row per settled round with
  raised and cure-worthy counts and the mechanical step-back verdict. The plan already
  cites the 2026-09-08 instance of this friction as its own motivation. So this entry
  adds nothing to the design and points at it: what the recurrence contributes is
  EVIDENCE OF PRIORITY — the plan has now been ratified and unbuilt through two full
  recurrences, on 2026-09-03 and 2026-09-11.

  Recorded because the wrong turn is itself an instance of the register's subject: the
  first version of this bullet specified a rival `pr rounds` command with a different
  data flow, written without checking whether the estate had already planned the work.
  It had, and the ratified plan is more complete — body findings, Codex badge blocks,
  signed machine-readable bar markers for dispositions, the reviewer-leg predicate. Two
  incompatible specifications for one job is worse than none (Copilot, PR #134).

- **Route**: `pr-lifecycle` §The review-round state machine (items 2 and
  4), under the skills claim; the build routes to the ratified `pr-tally` plan.
- **Instance, 2026-09-21** (Zephyr guards Leeward, `281e44`): the owner invoked
  metacognition twice in one day to correct a running pull-request loop; PDR-140
  clause 8 files that as a defect against `pr-lifecycle`, never a usage pattern.

### F-178 — `git branch -d` refuses a branch merged into HEAD when its configured upstream lacks it

- **Observed**: 2026-09-06 (Flounder turns Estuary, c5cc2c; the standing
  prune under worktree-hygiene §6). Seventy-eight merged local branches
  deleted with plain `-d`; two merged into HEAD refused —
  `sync/upstream-2026-09-02` on its upstream (git's `-d` test is merge into
  the configured upstream, HEAD only when none is set) and `heads/pr834head`
  on its name (message unrecorded).
- **Expected**: the rule's proof (ancestor of the freshly fetched base)
  deletes the branch.
- **Route**: worktree-hygiene §6 prune paragraph — after the ancestry
  proof, `git branch --unset-upstream <branch>` then `-d`; the name case
  recorded verbatim at the next prune; never `-D`.

### F-179 — sub-agent reports truncate in transit when the return payload is large

- **Observed**: 2026-09-06 ~13:4xZ (Juno seeks Apogee, a693fb; three Sonnet
  extractors over ~58k-byte comms windows): one report arrived whole, two
  arrived cut in the tool result with no marker separating a short report
  from a truncated one.
- **Expected**: a report arrives whole or fails loudly.
- **Route**: dispatch briefs name a scratchpad file as the deliverable and
  return its path; the dispatcher reads the file and spot-reads every kept
  leaf against the source (the owner's method word, 2026-09-06: write
  intermediate findings to disk).

### F-180 — the heartbeat cannot tell "alive and turning" from "alive but stalled": absorption-dark seats read green

- **Observed**: 2026-09-06 (Finch binds Sundog 17:25–19:23Z and
  19:53–20:40Z; Juno seeks Apogee 20:13–20:39Z) and 2026-09-07 (Juno: a
  Director directed event of 12:37Z read at 16:1xZ). Heartbeat fresh, cycle
  label unchanged, no event: the seat's background-shell watcher wrote the
  events to a file and no harness turn ran. The Director's detector
  (heartbeat-fresh, cycle-unchanged, no-event) found each case by hand.
- **Expected**: the heartbeat carries the seat's last TURN time, written by
  the turn and not by the loop, so "emit fresh, turn old" reads on the
  stream within one cadence; the watcher runs in the Monitor shape that
  wakes the seat per event (the use-monitor rule), never as a background
  shell.
- **Route**: agent-tooling backlog (collaboration-state heartbeat) beside
  F-170 and F-173; the liveness rule's PROGRESS-stall diagnostic; the
  watcher rule names the background-shell watcher as the anti-pattern.
- **A second detector from the founding instance, 2026-09-06** (Finch binds Sundog, d32c227a, not
  decided): a seat in a long external wait declares it in its cycle label with a deadline, "so
  silence past the deadline is the alarm, not the heartbeat"; no turn stamp exists in agent-tools.

### F-184 — the root `test` task's inputs omit the root registry files its tests read, so the pre-push cache replays a stale pass

- **Observed**: 2026-09-07 (a693fb). An edit to `RULES_INDEX.md` (an
  explaining cell on a new core row) passed every local gate — the pre-push
  log read `@oaknational/agent-tools:test: cache hit, replaying logs` —
  then failed CI's `rules-index-classification` test cold; one CI cycle and
  one extra push on a terminal PR. The task declares only package-local
  inputs (`$TURBO_DEFAULT$`, `**/*.ts`, `vitest.config.ts`).
- **Expected**: every root file a package's tests read is declared among
  that task's inputs (`$TURBO_ROOT$/RULES_INDEX.md`, the form
  `tsconfig.base.json` already uses), so a root-file edit invalidates the
  cache and the classification test runs on push.
- **Route**: a one-line `turbo.json` change per root file the tests read,
  as its own config change with the classification test as proof;
  `build-system.md` §Caching carries the interim discipline (run the
  dedicated test directory before pushing an edited registry file).
- **Instances, 2026-09-25 and 2026-09-27** (seats, OCE): agent-tools test tasks omitted
  `.husky/refuse-commit-on-main.sh` and `.agent/hooks/policy.json`, so an edit to either alone
  replayed a cached pass; each was cured by one `$TURBO_ROOT$` input line (PR 272 for the policy).
- **Status**: open (read 2026-10-01): this entry's own file is still absent: `turbo.json` (last
  changed 2026-09-30) lists `.agent/hooks/policy.json` for `agent-tools#test` and `#test:e2e` and
  the commit guard for `#test:e2e`, but no `$TURBO_ROOT$/RULES_INDEX.md`, so the entry stays open;
  three root files in one class point to a check that fails when a cached task's tests read a root
  path its inputs omit (JC's agent-tools test tasks are `cache: false`).

### F-187 — three identity and link-validator defects a transplant seat found, verified and never cured

- **Observed**: reported 2026-09-12 by Cauldron herds Lustre (880ff9) from
  the `jimcresswell.net` transplant, verified the same day by Nettle guards
  Pistil (2de368), and re-verified at source on 2026-09-16 at the dedicated
  consolidation, all three still present:
  1. `agent-tools/src/claude/session-identity-hook.ts` builds
     `additionalContext` (whose text says "PRACTICE_AGENT_SESSION_ID_CLAUDE is
     set in $CLAUDE_ENV_FILE") before the `envFile === undefined` early return,
     so a session with no env file is told the variable is set.
  2. `agent-tools/src/collaboration-state/collaboration-seed.ts` reads no
     `CLAUDE_CODE_SESSION_ID`, which every Claude Code Bash shell carries and
     which equals the seed; the harness-native source list goes from
     `CLAUDE_CODE_REMOTE_SESSION_ID` to `CODEX_THREAD_ID` (PDR-027's source
     list would change with it).
  3. `agent-tools/src/validators/markdown-links/validate-markdown-links.ts`
     ignores only the root-anchored `.agent/reference-local/**`, so a nested
     private checkout under another `reference-local/` directory is walked as a
     link source.
- **Expected**: the hook claims only what it wrote; a Claude seat resolves its
  seed without a hook artefact; every `reference-local/` directory is outside
  the validator's sources.
- **Route**: one small source lane, TDD per defect, reviewed by code-expert;
  it was routed on 2026-09-12 as "a small source lane after #136/#138" and no
  seat took it. The same lane carries two more uncured rows of the transplant
  findings register (estate-coordination thread record, §"2026-09-13 10:0xZ"),
  both still present on 2026-09-17: T13, the bare `readFile` of
  `docs/strategy/README.md` in `validate-plan-corpus.ts` (ENOENT instead of the
  fail-closed message), and T21, the env-file line appended on every
  SessionStart with no presence check (`session-identity-hook.ts` plans it,
  `.claude/hooks/practice-session-identity.mjs` appends it).

### F-188 — no check refuses a drain tombstone left in a drainable buffer

- **Observed**: 2026-09-16 dedicated consolidation. `pending-graduations.md`
  carried five HTML comments of the form "Register drained to empty at the …
  consolidation … The commits and the homes are the record" (drains of
  2026-07-20, 08-07, 08-14, 09-06, 09-09), although
  `permanent-doc-is-the-consolidation-record` names that form a tombstone and
  a seat had removed the same form from `distilled.md` on 2026-09-10 after two
  review rounds (#111, #115). The class recurred in a sibling buffer despite its
  home.
- **Expected**: a drained buffer carries its header prose and nothing else,
  and a check says so at commit time rather than a reviewer at round three.
- **Route**: the practice-fitness validator is the candidate home, keyed on
  the `fitness_content_role: drainable-buffer` designation the four live
  buffers carry (`napkin.md`, `distilled.md`, `open-questions.md`,
  `pending-graduations.md`) — not `item-count.ts`, which parses only the
  concept-counted register (`fitness_item_count: required`, today
  `pending-graduations.md` alone) and so would miss the `distilled.md`
  instance; a refusal of a drain-comment shape there is the candidate cure. Falsifier: if
  no such comment is written in the three months after the five are removed,
  the check is dead weight.

### F-189 — this repository's gate-script names and PDR-008's differ, item 9 of the Practice verification fails on it, and the right names for the ecosystem are undecided

- **Observed**: 2026-09-12 (a peer's report, checked with `jq`), re-read on 2026-09-17 at the
  dedicated consolidation. PDR-008 (Accepted 2026-04-18) fixes the aggregate gate names: bare
  names verify, `:fix` applies, `check` is the one exception as the mutating alias of
  `check:fix`, and `check:ci` is the non-mutating CI form; §Per-ecosystem adaptation says names
  travel verbatim, "not `format-check`". `practice-verification.md` item 9 checks for that set.
  The root `package.json` here defines `check` as the non-mutating aggregate and `fix` as the
  mutating one, has no `check:fix` and no `check:ci`, spells `type-check` for `typecheck`, and
  runs mutating commands under bare names (`format:root` writes, `markdownlint:root` runs
  `--fix`) beside `format-check:root`. The divergence is wider than `check`.
- **Expected**: PDR-008 §Accepted cost: "Existing repos that use non-canonical names pay a
  one-time rename cost." (Its "flagged as deviations needing rationale" clause covers names a
  repository adds later, not existing ones.) The two name sets differ and nothing has been
  renamed; whether PDR-008's set or another is the one every repository should carry is the
  owner's open decision (the Reading below).
- **Reading, corrected by the owner (2026-09-17)**: the Core text is not stale; item 9 failing
  here is the check doing its job. The first framing of this entry ("this host never adopted
  PDR-008's names; this host renames, or the Core drops its exception") was wrong, the owner
  said: this repository's `package.json` names have not changed in a very long time, and the
  question is not one of consolidation or of one repository conforming. The question is which
  names are RIGHT for the Practice ecosystem as a whole, decided once, and then standardised
  across every Practice repository; this repository's long-stable names are one input to that
  decision, PDR-008's tables are another. A rename's footprint, wherever it lands, is read at
  decision time with `git grep -lP 'pnpm check(?![:\w-])' HEAD`, never from a count carried
  here. At the #153 tip (2026-09-17) the CI workflow, PR template, directives, skills and docs
  held 33 files; the name also runs through rules, the hook policy, the root README,
  CONTRIBUTING and SECURITY, app and package docs, Cursor rules, PDR-082, and typed agent-tools
  source and tests (`repo-check`, the check/CI parity validator); records under memory, plans
  and reports name it hundreds of times more and stay as history.
- **The seat's verdict through the decision lenses (2026-09-19, at the owner's word "run it
  through the decision matrix"; for the owner to ratify)**: both sides move. PDR-008's Rule 1
  (a bare name verifies; mutation carries `:fix`) is the strict, safe rule. Its Rule 4 makes
  `check` a mutating alias and gives one warrant, that the aggregate is "typed tens of times
  per day"; the owner's 2026-09-14 ruling (the commit runs the gates; never run them separately)
  removed that warrant, and an exception whose reason is gone is an escape hatch the strict lens
  removes. So the ecosystem set is PDR-008 without Rule 4: `check` verifies, `fix` mutates, and
  `check:ci` goes, since `check` is already CI-safe (one name, one concept; simpler). That is
  this repository's existing `check` and `fix`. This repository breaks Rule 1 in three other
  places and renames them: `format:root` writes and `markdownlint:root` fixes under bare names
  beside `format-check:root` and `markdownlint-check:root`, and `type-check` is spelled against
  the Core's `typecheck`. The direction is the safe one: a mutating `check` that becomes a
  verifying one fails loudly, never silently changes a tree. Limit: only this repository's
  scripts were read; a Practice repository whose hooks rely on `check` mutating needs its own
  look before the amendment lands. Falsifier: such a repository exists and the change breaks it
  silently.
- **Route**: the owner ratifies or corrects the verdict; then the Core exchange amends PDR-008
  (Rule 4 withdrawn, `check:ci` retired, the tables re-read), and a standardisation lane runs
  in each Practice repository whose names differ, this one included.

### F-190 — the client-side guards name `main` and `master`; this fork's default branch is `engraph`

- **Observed**: 2026-09-17, truing #152's description. `.husky/refuse-commit-on-main.sh`
  refuses a commit only on `main`, and `agent-tools/src/merge-bot/push-cli.ts`
  (`DEFAULT_BRANCH_NAMES`) refuses a push to `main` and `master` by name. This fork's default branch is `engraph`, so neither refuses a
  local commit or a bot push aimed at it. The remote covers the push: `engraph`'s branch rules
  carry `pull_request`, `non_fast_forward`, `deletion`, `required_status_checks` and
  `copilot_code_review` (read 2026-09-17).
- **Expected**: the guards read the repository's default branch rather than a literal name, so
  a local commit on the default branch is refused before it has to be undone.
- **Route**: a small source lane (carried code, cure-worthy here under the peer-fork model):
  the commit guard and the push command's `DEFAULT_BRANCH_NAMES` resolve the default branch from `origin/HEAD` or
  configuration, with a unit test on each.
- **Status**: partially-addressed — the push half: `merge-bot push`
  (`agent-tools/src/merge-bot/push-target-branch.ts`) refuses the branch `origin/HEAD` names, in
  any case, as well as `main` and `master`, and writes only `refs/heads/<branch>`. The commit
  half: `.husky/refuse-commit-on-main.sh` refuses `main` and `master`, in any case, and the
  branch `origin/HEAD` names, proven by `agent-tools/smoke-tests/branch-guard.smoke.ts` over a
  real repository. Residual, observed and not cured: `.husky/pre-rebase`'s `--update-refs` range
  check names only `refs/heads/main`; its smallest cure is to loop that leg over `main`,
  `master` and the `guard_default_branch` the sourced guard leaves in scope, with a real
  `git rebase` leg in the smoke, and the commit skill's binding sentence still names `main`
  alone (both routed to the follow-on, 2026-09-26).
- **Instances, 2026-09-25 and 2026-09-26** (a routed decision-table row; Copilot on PR 246, round
  three): `branch-touched-files` defaults `--base` to `origin/main` (`cli.ts:111`, and its rule's
  line), and the commit guard passes when `origin/HEAD` names a ref outside `refs/remotes/origin/`.
- **Read 2026-10-01**: Both cures read the default branch from `origin/HEAD`, failing closed on a
  malformed one, or from the PR's target; the JC twin of PR 246's guard is the JC guard entry of
  this consolidation (G049).

### F-191 — the context-usage instrument refuses this seat's model and is not named where the 30 % rule fires

- **Observed**: 2026-09-17, the dedicated consolidation's second context. The
  `directive-file-context-budget` rule gates directive edits on context usage below 30 %, and
  the seat had to decide whether the directive pass fitted after a fold's review rounds. It
  looked for a reading, found `agent-tools context-cost` (which estimates a fileset, not a
  session) and the transcript's bytes (3.47 MB since the compaction boundary, dominated by
  metadata and persisted tool output), estimated from what it had loaded, and moved the pass to
  a fresh context. An instrument existed that it did not find: `agent-tools session-metadata
  --vendor claude --model <id> --session-id <id>` reads a session's context occupancy from the
  vendor transcript, and the Claude statusline already reads the platform's
  `context_window.used_percentage`. The #153 pre-publication pass found both. The command
  refuses this seat's model id (`unknown model: claude-opus-5[1m] (no window size registered)`,
  `agent-tools/src/session-metadata/window-registry.ts`); read against the same-size
  `claude-opus-4-8[1m]` entry after the compaction it gave 29.5 % used.
- **Expected**: the budget a rule gates on is readable at the moment the rule fires, from the
  rule's own text, so the decision rests on a reading, not a guess in either direction.
- **Route**: a small source lane registering the Opus 5 window sizes (the bare id and its
  `[1m]` variant) and `claude-fable-5-1` (this seat's model from 2026-09-17 18:3xZ, also
  refused: `unknown model: claude-fable-5-1`; the owner's word the same day is that its window
  is 1M) in `window-registry.ts`. The rule now names the command
  (`directive-file-context-budget` §Reading the Figure, 2026-09-19) and consolidate-until-done's
  step 7 cites the rule (its §Sequencing); the registry lane stands.
- **Second observation, 2026-09-19 15:41Z**: the first reading after a compaction gave 69 %
  and the next, one turn later, 11 %. `usage.ts` `parseLatestUsage` returns the latest
  transcript line carrying a usage object, and straight after a compaction that line is the
  compaction call itself, which carried the whole pre-compaction context. Expected: the
  reading names the turn it came from, or skips a compaction call's usage line, so a seat
  gating on the figure does not hand off on a stale one. It rides the same source lane.
- **Instances, 2026-09-23 to 2026-09-25** (four entries, three seats): the
  registry has no window for `claude-opus-5-5[1m]` (the seats read the meter with
  `claude-opus-4-8[1m]` as a stand-in, and their records carried the command without
  the reason) nor for `claude-fable-5-1` (this pass, which estimated instead). The
  owed lane registers both; `agent-tools/src/session-metadata/window-registry.ts`.
  A fifth instance the same day: `session-metadata` exits 2, "unknown model", for
  `claude-fable-5-1`, so a Fable seat cannot read its own context figure (Geyser rides
  Pewter, 2026-09-25); the registry's nearest row is `claude-fable-5` at 200,000.
- **Status**: partially-addressed. `claude-fable-5-1` is registered at 1,000,000 in
  `agent-tools/src/session-metadata/window-registry.ts` (2026-09-30). The Opus 5 rows
  (`claude-opus-5`, `claude-opus-5[1m]`, `claude-opus-5-5[1m]`) are in JC.net's registry and not in
  this one. The second observation (the compaction call's usage line) has not been re-read. Neither
  estate registers the bare `claude-opus-5-5` (JC.net has `claude-opus-5`, `claude-opus-5[1m]` and
  `claude-opus-5-5[1m]`; OCE has none of the three), so a seat on that id is refused in both (read
  2026-10-01).
- **Sixth instance, 2026-09-28** (Myrtle turns Canopy): `session-metadata` printed nothing for
  `claude-fable-5-1`, so the directive context-budget check rested on an estimate (about 357k
  tokens of a window of at least 1M); the model was registered two days later.

- **Second estate (2026-10-02)**: JC.net's window registry registers both the Fable 5.1 and the
  Opus 5 windows; this estate's registers Fable 5.1 (beside its Fable 5, Opus 4.x, Sonnet 4.6 and
  Haiku 4.5 rows) and none of the Opus 5 ids (checked at the fold, 2026-10-02, Efreet lifts Scorch,
  7adb15).

### F-192 — a mid-session model change collides with the seat's live identity in the comms route

- **Observed**: 2026-09-17 ~18:36Z. The owner switched this seat's model from Opus 5 to
  Fable 5.1 at a compaction boundary. `identity preflight` resolves the same agent id under
  both labels (the id is seeded from the session, not the model), and `comms watch` and
  `assert-watcher-live` accepted the new label, but `comms append --model claude-fable-5-1`
  was refused: "identity route Zephyr guards Leeward / id:5180aeb6… collides with live
  identity Zephyr guards Leeward / claude-code / claude-opus-5 / 281e44-031 / id:5180aeb6…".
  The seat kept the old label for its comms, claims and commit ceremony for the rest of the
  session, so every record of the session names Opus 5 while the model was Fable 5.1.
- **Expected**: one seat, one identity; the model label is a fact about the seat that may
  change within a session, and the collision check keys on the id, so a label change under the
  same id is a relabel, not a second identity. The route accepts it and the later events carry
  the new label.
- **Route**: the shared guard (`assertNoLiveIdentityRoutingCollision` in
  `agent-tools/src/collaboration-state/active-agents.ts`, called by the identity write guard
  behind the comms and identity commands and by the `claims open` gate; it routes on the id and
  refuses when the model strings differ) treats a matching id with a
  different model label as the same identity (a relabel event on the stream, not a refusal);
  the claims rows and the heartbeat file carry the current label. Until then a seat whose model
  changes mid-session keeps its opening label on the coordination surfaces and records the
  change in its records, as this seat did.
- **Instances, 2026-09-26 and 2026-09-27**: after the owner switched a seat's model at compaction
  the route refused the new tuple and the seat re-took eight claims with `claims adopt` (same id);
  the harness moved a seat from `claude-fable-5-1` to `claude-opus-5-5` mid-session, continuous.

### F-193 — the operator-profile push leg checks the working tree, not the commits it pushes

- **Observed**: 2026-09-17, raised by Codex at #153's round three and verified at source.
  `operator-profile-sync.ts` `nonConformingDocuments()` reads the profile report over the
  current documents; `operator-profile-git-push.ts` `pushAhead()` pushes every commit the branch
  is ahead by, and `pushFirst()` (the no-upstream case) pushes `HEAD` the same way. An earlier
  unpushed commit that carried a credential-shaped line, since removed
  from the working tree, passes the check and is pushed with its history. PDR-141 decision 11
  claimed the refusal covered anything pushed; the decision is narrowed to what the mechanism
  delivers in the successor's first records commit.
- **Expected**: the push leg refuses when any commit it is about to push carries a
  credential-shaped line (the pushed-commit secret scan the repository's pre-push hook runs is
  the shape), so the profile repository's history never carries one.
- **Route**: a code lane in `agent-tools` (TDD over injected git output, with cases for both
  push paths, `pushAhead()` and the no-upstream `pushFirst()`: every commit the outgoing ref
  introduces is scanned before the push, and the refusal names the commit); then PDR-141
  decision 11 is re-widened to match. PDR-141 itself names no host record; this entry is the
  host's tracker for the lane.

### F-195 — git hung three times on the fsmonitor socket on 2026-09-17; cause measured 2026-09-19, monitor off for the shared clone by the owner's ruling of 2026-09-23

- **Observed**: 2026-09-17 ~15:59Z to ~16:13Z, three git commands slept on the fsmonitor
  daemon's unix socket on this machine: a commit in a trial worktree (twelve minutes), this
  seat's `git add` on the primary (ten minutes, holding `.git/index.lock`), and a `git status`
  on the primary ("could not read IPC response"). `core.fsmonitor` and `core.untrackedcache`
  are true in this clone's local `.git/config`; no tracked file or commit sets them, and git
  keeps no history of its config, so who enabled them and when is unknown. What changed that
  day: four linked worktrees were created between 15:36Z and 15:49Z (their directory birth
  times), each starting its own daemon (five are running, one per worktree), each followed by a
  dependency install writing a very large `node_modules` tree inside the watched root. All three
  hangs fell within twenty-five minutes of that; this seat saw none in the three days before,
  with one worktree and one daemon.
- **Reading**: an install floods the daemon with file events (FSEvents reports ignored paths
  too), and a git command waiting on the daemon's socket blocks until it catches up. This fits
  the timing and known daemon behaviour under heavy ignored-directory churn. It has not been
  reproduced here: two processes sleeping in one window name no cause.
- **Route**: one bounded observation at the next worktree install: time `git status` with and
  without `-c core.fsmonitor=false` while the install runs, and record it. If the daemon is the
  cause, the cure is the owner's choice between disabling it for this clone and keeping
  installs out of watched roots; until then every ceremony stages with
  `git -c core.fsmonitor=false`.
- **Cured 2026-09-19 ~19:42Z** by Dynamo turns Temper (2a4c8a) at the owner's word, after a
  lens pass and a second opinion (comms events `a924faaf`, `c82ce1de`): the monitor unset in
  the clone's shared configuration, five daemons stopped, none respawned on the next status
  (0.04 s). Read back by this seat at 19:4xZ (`git config --local --get core.fsmonitor`
  returns nothing; `pgrep` finds no daemon). The measurement that settled it: bursts of files
  in an ignored directory block a read-only `git status` for as long as the burst lasts (9.8 s
  at 100,000 files, up to 24.5 s at 400,000), never more than 0.15 s with the monitor off, and
  with no load the monitor saves nothing (0.04 to 0.11 s without it). Added datum, the same
  day: this seat's read-only `git diff --cached` on the primary slept ten minutes while the
  churn ran in a DIFFERENT worktree, so the event backlog is host-wide. The per-call flag is
  retired from the ceremonies. The guard (one assertion in the commit queue's guard step, one
  line in the worktree-lane skill) and a bounded enumeration of other unwarranted ambient
  settings are the sketch node `warranted-means-in-the-operating-environment`.
- **Status**: cured on this host; the guard is open.
- **Recurrence and ruling, 2026-09-23**: a pre-push hung seventeen minutes in
  `git ls-files -z` at 0 % CPU on the fsmonitor daemon; the per-command cure
  `GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.fsmonitor GIT_CONFIG_VALUE_0=false` let a
  commit pass in ninety seconds; that evening the owner ruled fsmonitor OFF for the
  shared clone (`core.fsmonitor=false` in the clone config, two daemons stopped). Plain
  `git status` is instant since.

### F-194 — the `SHA:` prefix rule is unenforced, and the in-scope records carry hundreds of bare shas

- **Observed**: 2026-09-19, raised by Codex at #155's round two. `sha-prefix-in-collaboration-content`
  requires `SHA:` before every commit sha written into the napkin, the thread records and
  `repo-continuity.md`. At the #155 tip those surfaces held about 285 backticked bare shas
  beside about 130 prefixed ones (read with `grep -oE` over the four files), including every
  fold entry this seat wrote on 2026-09-16 and 17. No gate reads the rule: the gitleaks
  allowlist it exists for matches `<word>: <40-hex>`, which a backticked short sha never trips,
  so nothing refuses the bare form. The shas #155 introduced were prefixed in its second
  settlement push; the older ones stand.
- **Expected**: a rule that says MUST is read by something at write time, or it says SHOULD.
- **Route**: a validator row (the markdown records' sha form) in the repo validators, with the
  existing bare shas converted in one mechanical sweep in the same lane; until then a seat
  writing a sha into these surfaces prefixes it.
- **Instances, 2026-09-26 and 2026-09-29** (Copilot on PR 211's fold; Copilot on JC PR 268):
  four bare commit hashes in the napkin and records, then a plan-node merge commit without its
  prefix and a mistyped OCE head, each cured by a settlement push after a sweep.
- **Read 2026-10-01**: The rule's `globs` in both estates list only
  `.agent/state/collaboration/**` and `.agent/collaboration/**`, so it does not load when the
  napkin, a thread record or a plan node is written; widening them to its in-scope list rides with
  the validator row.

### F-196 — the stale-claims sweep reads a live seat as stale when its loop bumps comms only

- **Observed**: 2026-07-23, in a dedicated consolidation's stale-claims sweep (Magma mends
  Sulphur, `639530`); registered 2026-09-20 when the thread record that was its only home was
  curated. `claims archive-stale` judges liveness by the claim's own `heartbeat_at`, or
  `claimed_at` where there is none (`isClaimStale`, `collaboration-state/claims.ts`). A live
  Director seat whose cadence loop posted comms heartbeats but never ran `claims heartbeat`
  read as stale, and the sweep offered its claim for archiving.
- **Expected**: one liveness reading per seat. A seat that is visibly live on the comms stream
  is live to the claims sweep as well, or the sweep says which signal it read.
- **Route**: a claims-tooling candidate (the sweep consults the seat's newest comms heartbeat
  beside the claim's, or the heartbeat command bumps both). The seat-side cure is already
  practice: a seat that holds a claim runs `claims heartbeat` on it
  (`liveness-heartbeat-cron`). One instance.

### F-197 — a smoke check's ten-second wall-clock wait failed a push on a loaded host

- **Observed**: 2026-09-20 ~13:4xZ (Zephyr guards Leeward, `281e44`). A push's gates ran beside
  another seat's push gates on the same host, and `smoke:comms-watch-coordination-home` failed
  with "watcher did not exit within 10 seconds"; it passed alone a minute later and the push
  passed on retry. The bound is a `setTimeout` of `10_000` and a `Date.now() + 10_000`
  deadline in `agent-tools/smoke-tests/comms-watch-coordination-home.smoke.ts`.
- **Expected**: `testing-strategy.md` §Smoke Checks has a smoke check prove completion by
  events. With two gate runs side by side now the owner's ruled shape
  (`no-unbounded-host-load` item 6), a fixed wall-clock wait inside a gate is a source of
  phantom reds.
- **Route**: an agent-tools candidate (wait on the watcher's exit event, with a bound sized as
  a hang detector and not as an expected duration). One instance.
- **Recurred** 2026-09-24, four more instances. The first was #179's first push (Zephyr guards
  Leeward, `281e44`). Three were pre-push runs by Blazar lifts Corona (`b65a9a`): PR 188's first
  settlement push, and PR 189's sync push twice. Every run failed with the same message while
  the host's one-minute load average stood above 20, and each passed alone (3 of 3) or on a
  retry once the load fell below 12. PR 179 changed nothing under `agent-tools`. With five
  instances across two seats, this is a pattern.
- **Instance, 2026-09-25** (a code-expert finding, event c17c34d7): the 180 s backstop
  (`WATCHER_HANG_BACKSTOP_MS = 180_000`) is not above the watcher's worst self-exit, three 60 s
  steps plus `pollMs`; JC derives it (`4 * SMOKE_STEP_TIMEOUT_MS + SMOKE_POLL_MS`), the port.

### F-198 — the merge door does not read the Codex connector's summary comment or its reaction

- **Observed**: 2026-09-24 ~12:45Z (Blazar lifts Corona, `b65a9a`), OCE PR 189. The Codex connector
  reported a clean review of the tip `ebe3123` through two transports. It edited its
  `codex-pull-request-review-summary` comment to "✅ Completed" with the commit in a table cell,
  and it put a 👍 reaction on the pull request. `merge-bot merge` refused with
  UNCLASSIFIED-EVIDENCE: the summary comment was "edited after creation", and the connector's
  quota comment "names no reviewed commit". The documented cure, a fresh `@codex review`, then
  bounced on the usage limit, as a comment. A quota notice counts as SKIPPED only when posted
  as a tip-bound review, so both OCE PR 188 and PR 189 stayed held on a vendor quota. The Director
  ruled to hold them rather than merge outside the door.
- **Expected**: the door reads each reporting transport a configured reviewer uses, under the
  owner's 2026-09-16 comment-evidence ruling. It reads the summary comment's commit and status
  cells as a tip-bound result, and a quota notice posted as a comment as the same
  scope-declared SKIPPED marker it honours as a review.
- **Route**: a merge-bot candidate. The door is shared by both estates, so the cure is portable.
- **Second instance, 2026-10-01** (Crucible binds Slag, first-hand): on OCE pull requests 299,
  313, 309 and 310 the connector reacted with a thumbs-up within about three minutes of each
  head and posted no review; it posted a review only where it had a finding (319). The seat
  read the silence as absence and wrote "unavailable" on three pull requests, each since
  corrected. The door's leg computation reads reviews and not the reaction, so a head the
  connector found nothing on cannot settle that leg. Two instances: a pattern.
- **Summary-comment instances, 2026-09-27 and 2026-09-28** (seats, OCE; the Director): the doors
  of OCE PRs 267, 268 and 264 held because Codex recorded each clean run only by editing its
  summary comment, posting a review object only with findings; 264 landed after PR 274's cure.
- **Status**: open (read 2026-10-01): the summary-comment arm is cured in OCE by `SHA:c85d4d8e8`
  (2026-09-28, PR 274, "the connector's own edit of its summary is its report"; OCE `pr-lifecycle`
  reads "unedited or last edited by its author"); JC's pr-watch and merge-bot carry no editor-aware
  reading (read 2026-10-01), so the arm stays open there; the quota-notice-as-comment arm and the
  reaction arm of the 2026-10-01 instance stay open in both.

### F-199 — the commit queue's `commit` command runs `git commit` without `--author`, so a ceremony commit on the primary is bot-authored

- **Observed**: 2026-09-25 ~11:44Z (Myrtle turns Canopy, `bf4957`), commit `SHA:c34823b5d` on
  the primary checkout, made by `commit-queue -- commit --intent-id … --message-file …` exactly
  as the commit skill's move 3 prescribes. The landed commit's author is the bot, and so is its
  committer. The bot-identity rule requires `--author="Jim Cresswell <…>"` on every commit
  (author the owner's authority, committer the acting bot), and the skill's linked-worktree
  path states the flag; the queue's commit command has no author option and passes none
  (`agent-tools/src/commit-queue/`, no author in its git call). Three commits by another seat
  on 2026-09-24/25 were bot-authored because the flag was forgotten by hand (the napkin's
  2026-09-24 and 2026-09-25 entries); this one followed the documented primary-checkout
  ceremony and could not have carried it.
- **Expected**: the queue's commit command takes `--author`, so the ceremony the skill
  prescribes produces the author and committer split the rule requires; until it does, the
  skill's move 3 names the substitute (`verify-staged`, then
  `git commit --author=… -F <message> -- <paths>`, then `complete`).
- **Route**: a small agent-tools code cure, and one sentence in the commit skill's move 3. One
  instance by the ceremony path; four bot-authored commits in two days across two seats.

### F-200 — the commit tool read an empty staged set seconds after `git add` filled it, three dates, cause unread

- **Observed**: 2026-09-20 (a ceremony lost its staging before the guard, no lock
  file involved), 2026-09-21 (twice in a row on the same two files; a traced copy of
  the ceremony then committed them) and 2026-09-23 (three runs each ended with the
  index empty although `record-staged` makes no index-writing git call), all Zephyr
  guards Leeward (`281e44`) on the primary checkout. The one trace showed the seat's
  own status read rewriting the index; a concurrent writer to the shared index is the
  untested candidate for the rest.
- **Expected**: a refusal "staged files do not match" is read as what the tool READ,
  which the queue's own record keeps (`staged_name_status`), before anything touches
  the index; the cause is traced with the commit skill's trace instrument before a
  writer is named.
- **Route**: the commit skill names the read (2026-09-25); the trace instrument's
  bytes are in the seat-instruments report of 2026-09-23. Three instances, one seat.

### F-201 — the merge door does not refuse a merge whose tip lacks an attested deletion sweep

- **Observed**: the merge-base deletion sweep ran after the door, not before, twice
  (Zephyr guards Leeward, 2026-09-21; Blazar lifts Corona, 2026-09-24), although the
  door's own output says to run it first. The door prints a note only
  (`agent-tools/src/merge-bot/merge-cli.ts`).
- **Expected**: the door refuses without an attested sweep on the tip, the same shape as
  the review-cost gate refusing at the push without the recorded budget, which did
  catch a seat the same day.
- **Route**: a merge-bot candidate. Two instances, two seats.
- **Instances, 2026-09-24 and 2026-09-25** (Siren herds Rudder, JC PR 178; Swallow holds Drift,
  OCE PR 214): each deletion sweep ran after the merge; every deleted line was read afterwards and
  no silent revert found. Both estates' `merge-cli.ts` still print only the note.

### F-202 — `merge-bot push` under redirection writes nothing while the pre-push runs

- **Observed**: 2026-09-23 (Blazar lifts Corona) and 2026-09-24 (Swallow holds Drift):
  the push's output file stayed empty through the pre-push hook and after the transfer,
  so the log alone read as stalled while `tsc` was busy, and the owner saw the stall
  before the seat ("Your push is stuck, and you couldn't tell, that is a tooling or
  tool use failure", 2026-09-23). The pre-push hook's output did not reach the
  captured log.
- **Expected**: the push reports progress on a cadence and its exit code in band; until
  it does, a gate-bearing push runs under an event-driven watch, progress is read from
  the process tree and the outcome from the remote tip.
- **Route**: merge-bot; the commit skill names the reading (2026-09-25). Two instances.

### F-203 — the review-cost survey prices an unreviewed settlement push at 0, so the gate fails open

- **Observed**: 2026-09-25 (Marten mends Shadow, `74fc02`): eight of one session's
  fourteen pull requests carried settlement pushes no reviewer reviewed, priced at 0;
  on two the declared budget was spent in full and the gate read 0, so a third push
  after two unreviewed ones would pass. The ledger's column definition counts reviewed
  heads only.
- **Expected**: the gate counts pushes to the pull request after open, not only
  reviewed heads.
- **Route**: the review-cost gate (agent-tools review-cost); the ledger rows for #197
  to #210 carry the readings. One session.

### F-204 — the comms archive harness takes no curator disposition for non-heartbeat events

- **Observed**: `comms-archive-move` builds its ledger from the tier policy alone:
  heartbeats move as `routine`; every other event past its window surfaces as
  "awaiting curator disposition" with no input by which a pass records one, so the
  substantive-event move ran as a hand script at each rotation (2026-08-14 and
  2026-09-25) or not at all (four rotations between).
- **Expected**: the harness reads a pass's recorded sweep (a "swept through T" line
  or a disposition file) and moves the covered events under the same provenance gate.
- **Route**: agent-tools `collaboration-state/archive`; the hand mover's shape is the
  spec. One class, five rotations.

### F-205 — the workspace census `check` is in no gate and its facts stale on any commit under `.agent/`

- **Observed**: 2026-09-20 (Dynamo turns Temper, `2a4c8a`): the check failed on the
  default branch with twenty stale facts entries; it runs in no gate, and its facts
  count files under `.agent/`, so any commit there stales it.
- **Expected**: the check either runs in a gate over facts that a records commit
  cannot stale, or its file counts are derived at read time.
- **Route**: the census plan's own lane. One instance.

### F-206 — a shared channel append has no compare-and-swap on the channel's last heading

- **Observed**: 2026-09-23 (Zephyr guards Leeward): a wrap entry composed from an
  earlier read was appended nineteen seconds after a peer's entry landed, without a
  re-read, so a claim of absence went into four records. 2026-09-25 (Swallow holds
  Drift): a whole-file write replaced a partner's header written seconds earlier.
- **Expected**: the channel append takes an expected-last-heading argument and refuses
  when the channel has moved since the author read it; opening is an append.
- **Route**: agent-tools (the channel append); the ARC protocol names the discipline
  (2026-09-25). Two instances, two seats.

### F-207 — the PreToolUse policy's argv matcher reads prose inside heredocs and event bodies as git commands

- **Observed**: 2026-09-25, two seats. A comms-event body that advised a peer to "restore the
  file to the branch's bytes" refused the whole Bash call as a git-restore shape, and neither
  the event nor the ARC entry went out (Swallow holds Drift, `516619`). A python heredoc that
  edited rule prose naming `git`, a push and a short flag was refused as a forced push, and a
  second attempt was refused for a machine-local path in the script text (Myrtle turns Canopy,
  `bf4957`). The discipline rule (`hook-policy-substring-discipline`) already prices the
  write-time substitution; the cost today was two lost rounds and one near-miss.
- **Expected**: the matcher parses command words (the git token and its subcommand as parsed
  argv), never substrings of heredoc bodies or quoted arguments; a heredoc body is content, not
  command.
- **Route**: `agent-tools/src/hook-policy/` (the argv matcher, `argv-nested.ts`,
  `shell-words.ts`). Four instances, two seats, one day: the third and fourth at 21:1xZ,
  two commands whose prose or queue text said "push" and which later carried a bare `-f`
  on a process lookup (`pgrep -f`), each refused as a forced push (Myrtle turns Canopy,
  `bf4957`). The matcher pairs the word with any later bare `-f` token in the command,
  whatever its host; the substitution is a script file for the edit and no bare `-f`
  after the word. The fifth and sixth on 2026-09-26 at about 10:36Z (Swallow holds Drift,
  `516619`): a `git add -- "$F"` was refused as `git add -A` when a `cat -A` sat later on the
  same command line, and as `git add .` when a `git diff … -- .` did; the matcher pairs the
  staging verb with any later `-A` or bare `.` token in the command. The substitution is one git
  write per command line, with neither token beside it. A seventh (2026-09-26 10:3xZ, Myrtle
  turns Canopy, on resume): a queue-loading command whose text said push and ended with a
  runner check by `pgrep -f`; the general form of the substitution is a process listing piped
  to `grep`, and the rule for the hand is no bare `-f`, `-A` or `.` token anywhere after the
  verb the matcher pairs it with, whatever the tool that takes it.
  An eighth (2026-09-26 12:47Z, Swallow holds Drift, `516619`): a command line carrying `merge-bot
  push` and, later, `gh api … -F body=@file` was refused as `git push -f`; the matcher reads the
  uppercase `-F` as the flag too, case-folded. The substitution is the push and the replies on
  separate command lines, and `--field` in place of `-F` where a line must also say push.
  A ninth (2026-09-26 15:03Z, Swallow holds Drift, `516619`), twice in five minutes: a heredoc
  writing a TypeScript file whose warning text said "git remote add <name> <url>, then git push
  <name>) to restore the destination-scoped range" was refused as `git restore`, the
  worktree-destruction class, and the register entry describing that refusal was refused the same
  way; the words `git` and `restore` on one line of prose are enough. The substitution is the
  Write and Edit tools for any file content that speaks of git, and prose that keeps the two words
  apart.
- **Instance, 2026-09-25** (a seat, OCE): the guard refused a command whose text held a
  force-push or wildcard-staging shape as an argument to a checker, so an execpolicy transcript
  ran from a cases file as data; a `pgrep -f` after the push word was refused the same day.
- **Status**: open (read 2026-10-01): the scanner its Route names has changed: the code can segment
  a command line (`segmentCommand`, `blocked-patterns.ts`) and drop here-document bodies, but only
  for policy entries declared `match: argv`, and neither estate's `policy.json` declares one: the
  git entries still match by token subsequence over the whole command, as F-225, F-251 and F-262
  record. This entry is open. (An earlier reading here, and the archive rows for F-102 and F-107,
  called it addressed; a code read on 2026-10-01 corrected that.) Lines 8 and 122 of
  `hook-policy-substring-discipline` in both estates still call the policy "a substring-matcher" and
  say `git push --force-with-lease` "is blocked by the `--force` substring". JC's open case of the
  compound-command class is F-225.

- **Second estate (2026-10-02)**: JC.net's hook policy handles heredoc bodies (14 lines of its
  `agent-tools/src/hook-policy` name them). This estate's `agent-tools/src/hook-policy/` names none,
  but its `agent-tools/src/shell/shell-words.ts` carries the heredoc scan (`skipHeredocBodies`,
  `readHeredocOperator`, `scanHeredoc`), reached only through `match: argv` entries, of which
  `policy.json` declares none (checked at the fold, 2026-10-02, Efreet lifts Scorch, 7adb15): the
  gap is policy configuration, not missing code.

### F-208 — the hub demo's CI build fails on a Turbopack font module that a re-run resolves

- **Source**: check-in 21 (Director, 2026-09-25); PR 225's CI run `36185664112`.
- **Surface**: the `CI` workflow's `build` job, step "Build (sdk-codegen + build)", running
  `pnpm run build` in `demos/oak-curriculum-hub` (Next.js with Turbopack).
- **Observed**: 2026-09-25 20:25Z, PR 225's push (head `6e1809f70`, a docs-only sync merge)
  failed the `build` job with "Module not found: Can't resolve
  '@vercel/turbopack-next/internal/font/google/font'"; `run-quality-gates` went red behind it.
  The same run's attempt 2, re-run at 20:47Z under the operator's own `gh` auth, passed with no
  change to the tree. The bot (`el-graphael[bot]`) cannot re-run a workflow: the re-run call
  returns "Resource not accessible by integration", so a flaked run costs a seat the operator's
  credentials or a no-op push. One instance today; a second run on the same step is the trigger
  for a cure lane.
- **Expected**: a build of an unchanged tree is deterministic; a docs-only push never reaches a
  font-module resolution failure, and a seat can re-run a flaked job under the bot's identity.
- **Candidate cure**: pin the hub demo's font loading so the Turbopack internal module is not
  resolved at build (the `next/font/google` import path, or the demo's build flag), and give
  the bot app the `actions: write` permission so `merge-bot` can re-run a failed job.
- **Target surface**: `demos/oak-curriculum-hub` (its font import and build config); the
  GitHub App's permissions; `agent-tools` merge-bot (a `rerun` verb once the permission exists).
- **Status**: open, six instances on docs-only heads (pull requests 225, 240, 264, 282, 272 and
  288, 2026-09-25 to 2026-09-28). The re-run call was refused to the bot at the first instance
  ("Resource not accessible by integration"); on 2026-09-28 the failed jobs re-ran as the bot
  (run 36456432908), so whether the bot can re-run is to be confirmed at the next flake. No
  live plan node names the hub's font cure. This line's history: recorded 2026-09-25 as an
  observation, the second instance read 2026-09-26. The second failure of the same step arrived on PR 240's
  settlement push `c312a6930` (run `36193715549`, 2026-09-25 21:50Z): the hub build inside
  the `unit-tests` job failed on the Lexend Google-font module, on a docs-only PR, with no
  network error, and `run-quality-gates` went red behind it. The trigger this entry named has
  fired; the cure lane is a Director question (the exchange seat's resume report, event
  `4a423185`). The owner merged PR 240 red under the ruleset bypass at 10:35Z on 2026-09-26,
  so engraph's own push CI on the final tip is the check that tells whether the step fails
  on the default branch; a red run there is the first cure lane.
- **Owner direction status**: session-scoped (the Director's assignment to record it; the
  App permission is the owner's).
- **Third instance, 2026-09-27**: PR 264 (the coordination successor's draft, records only) failed
  `unit-tests` and `run-quality-gates` at 12:48Z on the same module; the failed jobs re-run at 13:19Z
  under the owner's gh credential (`gh run rerun --failed`) passed by 13:31Z with no change to the
  branch (the Director, check-in 38). Three instances in three days on docs-only heads; the cure
  stays a re-run until the hub build's font resolution is made hermetic, a code change for a seat.
- **Fourth instance, 2026-09-28**: PR 282's browser-tests job failed in the hub build when
  Turbopack (Next.js 16.3.0) could not fetch the Lexend faces; it passed on other heads (Myrtle
  turns Canopy).
- **Fifth and sixth instances, 2026-09-27 and 2026-09-28** (Myrtle turns Canopy): PR 272 went
  green only on a re-run, and PR 288's build failed on a synced head with PR 282's twelve Lexend
  "Module not found" errors; the failed jobs then re-ran as the bot (run 36456432908).
- **Read 2026-10-01**: The seat routed a cure to the Director on 2026-09-28 (event 12d60f6d):
  vendor the Lexend faces through `next/font/local` in `demos/oak-curriculum-hub/app/layout.tsx`,
  which still imports Lexend from `next/font/google` (read 2026-10-01).

### F-209 — no CI check runs commitlint over a pull request's commits

- **Source**: the pre-execution code-expert review of the `merge-bot commit` wrapper (PR 241's
  condition 8), and the Director's ruling (2026-09-25, about 22:05Z).
- **Surface**: `.github/workflows/`, which runs no commitlint; the commit message is checked
  only by the local `commit-msg` hook (`commitlint --strict` and the major-version guard).
- **Observed**: 2026-09-25. A commit made with its hooks skipped reaches a pull request with
  an unchecked message: a Codex seat's `git commit -F m --no-verify` (allowed by prefix under
  PR 241's rules until the wrapper lands), or any environment carrying `HUSKY=0` or a
  `core.hooksPath` set through `GIT_CONFIG_*`. The pre-push chain re-checks the code but not the
  message, and no CI job does either.
- **Expected**: a pull request's commit messages are checked where no local environment can
  skip the check, for every actor.
- **Candidate cure**: a CI job that runs `commitlint --strict` (and the major-version guard)
  over the pull request's commit range, as a required status check.
- **Target surface**: `.github/workflows/` and the default branch's required checks.
- **Status**: open, an observation (recorded 2026-09-25). The trigger that opens a cure lane:
  the first commit on the default branch whose message fails `commitlint --strict`, or the
  wrapper's landing slipping past the Codex seat's first unattended commit.
- **Owner direction status**: session-scoped (the Director's assignment to record it).

### F-210 — the search CLI's smoke check is run by no CI task

- **Source**: Codex's review of PR 217 (comment 4111807938, 2026-09-26 15:23Z), reading
  tdd-as-design's landing sentence literally against the estate's tasks.
- **Surface**: `apps/oak-search-cli/vitest.smoke.config.ts` (`test:smoke`, which needs
  `ELASTICSEARCH_URL` and `ELASTICSEARCH_API_KEY`); `.github/workflows/`, which names no smoke
  task; `turbo.json`, which has no `test:smoke` task.
- **Observed**: 2026-09-26. `testing-strategy.md` §Smoke Checks says each smoke check is run by
  a CI-gated task, never by the commit; this one is run by nothing, so the artefact-viability
  proof it names has no runner, and a reader of the landing sentence meets a check no landing
  can establish.
- **Expected**: every smoke check runs in a CI-gated task with its credentials, or is retired
  with its reason recorded.
- **Candidate cure**: a workflow job holding the Elasticsearch secrets that runs the search
  CLI's `test:smoke` on the default branch's push or on a schedule; or the check's retirement.
- **Target surface**: `.github/workflows/` and `turbo.json`.
- **Status**: open, an observation (recorded 2026-09-26); a code lane for the Director's
  routing. The directive sentence itself is joint text, settled through the exchange (the
  second estate's PR 216, ba177801c) as "every test and check the landing's gates run".
- **Owner direction status**: session-scoped (this seat's record of a reviewer's finding).

### F-211 — a seat's heartbeat loop attests a seat the harness is not waking

- **Source**: this seat's own night, 2026-09-26 21:54Z to 2026-09-27 09:05Z: PR 245's leg wait (a
  background shell loop under the harness) completed with LEGS-IN at about 21:54Z and the seat
  received no wake for it; the seat's heartbeat loop (a shell process the seat started, beating
  every 240 s) ran on, so every liveness read said live; Siren's ping at 22:5xZ over the session
  socket arrived at 09:05Z with the owner's next message, when the door ran in two minutes.
- **Surface**: the heartbeat loops the seats run as shell processes (`heartbeat-loop.sh` shapes in
  each seat's scratchpad; `liveness-heartbeat-cron`), the harness's background-task wake, the slot
  rule's "a slot whose holder has no heartbeat for twenty minutes is free".
- **Observed**: 2026-09-27. A slot held by a seat whose harness was asleep stayed held for eleven
  hours because the freeing condition reads the heartbeat, and the heartbeat was a process, not
  the seat. `ping-before-escalate` was followed and could not wake a harness that was not polling.
- **Expected**: a liveness signal that the seat's own turns emit, so that its absence means the
  seat is not acting; and a slot-freeing condition that reads acting (an event on the stream from
  the holder) rather than beating.
- **Candidate cure**: (a) the heartbeat rule distinguishes a process beat from a turn beat and the
  slot rule reads the turn beat (a holder silent on the stream for N minutes is free for the door
  under ruling 3, heartbeat or not); (b) a background wait's completion re-sent to the seat by a
  second channel (a comms event the wait itself emits, so the watcher wakes the seat) instead of
  relying on the harness's task notification alone.
- **Target surface**: `.agent/rules/liveness-heartbeat-cron.md`, PDR-078 §4, the landing-slot
  bullet in `pr-lifecycle` §Phase 7, the seats' wait scripts (`wait-legs.sh` shapes).
- **Status**: open, an observation with one instance of the stall (recorded 2026-09-27). Cure (b), a
  comms event on completion, is practice in several seats' wait scripts (not in agent-tools); cure
  (a) is unapplied in both estates' landing-slot bullet (read 2026-10-01).
- **Owner direction status**: session-scoped (this seat's own record).
- **Cure (b) in use, 2026-09-28**: a seat's own leg wait for PR 282 emitted its result as a
  comms event so the watcher woke the seat (Myrtle turns Canopy). It lives in that seat's wait
  script, not in agent-tools; cure (a) stays open.
- **Further cure (b) instances, 2026-09-27 to 2026-09-29** (seats, OCE): leg and eval waits
  emitted their own completion events in at least seven runs; cure (a) is unapplied, as both
  `pr-lifecycle` copies free a slot only when "heartbeat and state lines stop for twenty minutes".

### F-212 — agent-tools' test:e2e rebuilds `dist` while lint and type-check may read it

- **Source**: the config-expert read of J6's N6 (the discovered smoke runner, commit 1c0cf14c4 on
  `feat/exchange-j6-smoke-runner`), 2026-09-28; accepted on that read by the Director's word of
  22:1xZ, recorded here so the next tooling lane finds it.
- **Surface**: `agent-tools/package.json` `test:e2e` (its in-task `pnpm -s build`); `turbo.json`'s
  `@oaknational/agent-tools#lint` and `#type-check` tasks; `agent-tools/tsconfig.json` and
  `tsconfig.lint.json`, which include `smoke-tests/`; the three smokes that import `../dist/`;
  `.husky/pre-push` and the root `check`, which can schedule the three tasks together.
- **Observed**: 2026-09-28. The in-task `tsc` rewrites every `dist` file (no `incremental`) while
  lint and type-check may read `dist` `.d.ts` files in parallel. Before N6, eight smoke scripts in
  the hand chain each rebuilt; N6 builds once before the runner, so the window shrinks from eight
  rebuilds to one. CI's `browser-tests` job never schedules the three together.
- **Expected**: no gate task writes an output another concurrently scheduled task reads.
- **Candidate cure**: `test:e2e` depends on turbo's `build` and drops its in-task build, or the
  smokes stop importing `dist` and the tsconfigs stop including `smoke-tests/`.
- **Target surface**: `turbo.json` (`test:e2e` `dependsOn`), `agent-tools/package.json`.
- **Status**: open, an observation (recorded 2026-09-28), accepted as it stands; for the next
  tooling lane.
- **Owner direction status**: session-scoped (a reviewer's finding, accepted by the Director).

### F-213 — a dependency bin named `uname` sends every pnpm shim into an unbounded fork chain

- **Source**: the J3 install-time shellcheck slice's security read, a scratch-project probe on
  2026-09-29 near 00:24Z; the host peaked near 2,450 processes and a peer's gate failed with fork
  EAGAIN.
- **Surface**: pnpm's generated bin shims (`node_modules/.bin/*`) on a lifecycle script's `PATH`.
- **Observed**: pnpm writes each bin as a `/bin/sh` shim that runs `` `uname -a` ``, `dirname` and
  `sed` to detect Cygwin. A lifecycle script's `PATH` puts `node_modules/.bin` first, so when a
  dependency ships a bin named `uname`, the shim's own `uname -a` resolves to the shim: each
  level forks a subshell that runs it again, a chain of `/bin/sh` processes until fork fails. A bin
  named `dirname` or `sed` does the same, and it reaches every shim, the root `postinstall`'s
  `tsx` included.
- **Expected**: no shim resolves to itself; a fork burst on the host is traced to its shape at once.
- **Candidate cure**: pnpm's shim template is upstream's. Here, dependency review names any bin
  that shadows a POSIX tool, and the shellcheck installer runs with the dependency bin
  directories off its `PATH` (`agent-tools/src/bootstrap/shellcheck-provision.ts`). Reading a
  burst: `ps -o pid,ppid,command` showing a chain of `/bin/sh …/node_modules/.bin/<tool>` is this
  shape; stopping the chain's root ends it.
- **Target surface**: pnpm's cmd-shim template upstream; dependency review.
- **Status**: mitigated for the shellcheck installer (2026-09-29); open upstream; one instance.
- **Owner direction status**: unsolicited.

### F-214 — the docs validators' entry decisions have no automated boundary proof

- **Source**: Copilot's overview observation on the lineage's PR 301 (review 5347139525,
  2026-09-29), Routed by the exchange seat (Myrtle turns Canopy, bf4957); the napkin entry of
  2026-09-29 ~02:4xZ on the port's description-after-product shape.
- **Surface**: `agent-tools/src/validators/core-adr-citations/validate-core-adr-citations.ts`
  (`refuse`, `reportCitations`, `main`); the same import-time shape in
  `validate-no-machine-local-paths.ts` and `validate-identity-naming.ts`; the smokes under
  `agent-tools/smoke-tests/`, which prove only each entry's green path.
- **Observed**: 2026-09-29. Each entry runs at import over the tree it lives in, so no cell can
  reach its exit mappings (a finding to exit 1 with its report; a refusal reason to exit 2); the
  helpers are the tested part. On PR 301 the Core ADR-citation validator's `readCore` went behind
  a seam (`read-core.ts`, five cells over injected readers) and the two mappings were observed by
  hand and recorded in the body.
- **Expected**: every exit status a gate can return is proven by a cell, so a regression in the
  entry's mapping cannot turn a refusal into a green pass while the helper cells stay green.
- **Candidate cure**: each entry's decision becomes a pure function over injected readers and
  writers (`run(readers, out): number`), the import-time line reduced to
  `process.exitCode = run(live)`; one cell per exit status per validator; the smokes keep the
  green path. One lane for the family; the second estate takes the same shape with the port-back.
- **Target surface**: agent-tools CLI (the three validators named; the pattern for the rest).
- **Status**: open, an observation (recorded 2026-09-29), sequenced after the exchange's residue.
- **Owner direction status**: session-scoped (a reviewer's observation, routed by the seat).

### F-215 — the health probe in `core` imports the sub-agent declarations module

- **Source**: Copilot's round-two thread on the lineage's PR 305 (review on 3f5751944,
  2026-09-29), Routed by the exchange seat (Myrtle turns Canopy, bf4957); the code-expert's
  pre-execution read of the same PR named it first as a port-back candidate.
- **Surface**: `agent-tools/src/core/health-probe-parity.ts` (its imports of
  `../subagent-declarations/adapter-spec.js`, `declaration-scalars.js` and
  `declared-adapters.js`); the same file on the second estate, byte for byte.
- **Observed**: 2026-09-29. The probe's adapter parity reads the templates' declarations as its
  platform truth, so the first `core/*.ts` module now imports a feature module: an edge no
  dependency-cruiser rule forbids but which inverts the layering the tree otherwise keeps
  (`core` below the feature modules). The edge arrived with the port of the second estate's
  generator (N1's second slice) under the same-bytes rule, so it is the second estate's shape
  as well.
- **Expected**: `core` imports nothing from a feature module; the probe reads its platform
  truth through an injected reader or from a module that sits above both.
- **Candidate cure**: move the probe's parity out of `core` (beside the declarations, or into
  a `health-probe` module above both), or have the composition root inject the declared
  adapters into a pure `core` check; one change on both estates as the same bytes, with a
  dependency-cruiser rule that refuses the edge afterwards.
- **Target surface**: agent-tools `core` and the health probe; the second estate's twin.
- **Status**: open, an observation (recorded 2026-09-29), sequenced after the exchange's residue.
- **Owner direction status**: session-scoped (a reviewer's observation, routed by the seat).

### F-216 — the parity probe's surface listing and the no-follow read's host arm are proven by observation only

- **Source**: Copilot's round three on the second estate's PR 271 (review 5348585306,
  2026-09-29, two threads on the pure-sync tip), Routed by the exchange seat (Myrtle turns
  Canopy, bf4957); the same bytes landed here as PR 305's settlement one and late cure.
- **Surface**: `agent-tools/src/core/health-probe-parity.ts` (`evaluateReviewerAdapterParity`,
  the live composition that lists the four surfaces after the declaration read succeeded) and
  `agent-tools/src/core/no-follow-read.ts` (`pathEntryIsDescriptorFileSync`, the host arm that
  composes `lstatSync`); the same two files on the second estate.
- **Observed**: 2026-09-29. The short-circuit that keeps a declaration refusal from listing any
  surface lives in the composition, which the testing strategy leaves to observation; the pure
  seam's cells would pass with or without it. The host arm's five cells describe the pure
  identity check and never reach the `lstat` branch on a host that enforces no-follow; the
  lineage's Windows leg observed it, the second estate has no such leg.
- **Expected**: both behaviours described by a cell with no IO and no query assertion: the seam
  takes the surface listing as a thunk it calls only after a successful read, described by
  relation (a refusal returns the refusal whatever the surfaces would hold); the host arm takes
  its probes injected (the `ReadProbes` pattern of `validators/operator-profile`), each branch
  described over a fake host.
- **Candidate cure**: one joint design on both estates as the same bytes (the seam's signature
  and the probes' injection change shared files), with the cells; sequenced with the exchange's
  residue, after J2.
- **Target surface**: agent-tools core (the health probe; the no-follow read); the second
  estate's twin.
- **Status**: open, an observation (recorded 2026-09-29), sequenced after the exchange's residue.
- **Owner direction status**: session-scoped (a reviewer's observation, routed by the seat).

### F-217 — the local statusline settings plant `.logs` directories under whatever cwd the statusline runs from; two validators refuse them (2026-09-29)

Observed twice on 2026-09-29 by the Director: `.agent/rules/.logs` refused by the portability validator at the 00:0xZ fold push, and `.agent/skills/.logs` refused by the skills adapter validator at the 11:3xZ push ("no readable SKILL-CANONICAL.md"). Both directories held one gitignored statusline log written by the owner's local statusline settings, whose log path is relative (`.logs/statusline.log`). Cure each time: the log relocated to the Director's scratchpad with its bytes kept, the empty directory removed, the push re-run green. The generator is the relative path in the local settings; an absolute path or a home-directory path ends the class. Class: host artefact, not a content defect.

### F-218 — the shared atomic writer takes caller-supplied paths with no link check (2026-10-01)

- **Source**: a review finding on the coordination fold of 2026-10-01 (the pattern
  `cli-writer-boundary-discipline` claimed an `lstat` seam the writer does not have), verified
  against the code in both estates by two seats (Crucible binds Slag; Hazel tracks Trunk) and
  then by `security-expert`, which traced each flag.
- **Surface**: the collaboration-state CLIs' path flags (`cli-claim-commands.ts`,
  `cli-comms-commands.ts`, `cli-json-commands.ts`, through `state-io.ts`) and the writer they
  reach, `agent-tools/src/collaboration-state/atomic-file.ts`.
- **Observed**: `--active`, `--closed`, `--comms-dir`, `--output` and `--file` reach the atomic
  writer with no containment or link check, and nothing under `collaboration-state/` calls
  `resolveWriteTargetWithinRepo` (`core/flag-path-resolve.ts`). The writer replaces a link
  planted at the target and follows a link in any parent directory. The JSON writers refuse a
  path that is not a named state file or state directory; `--output` has no such gate and
  replaces any file with the rendered log, the worst case. `--seen-file` reaches `appendFile`,
  which writes through a link. `--event-id` is checked only for being non-empty and becomes a
  file name.
- **Expected**: every writer under a caller-supplied path carries the pattern's three cells
  (name validated, atomic write, no link followed).
- **Severity**: hardening. To use the gap an attacker has to choose the CLI's arguments or plant
  a link in the coordination state directory, so is already acting as the user or steering an
  agent.
- **Candidate cure**: resolve every path flag through `resolveWriteTargetWithinRepo` at the
  spec-wiring boundary, on the resolved path with defaults included, with the coordination home
  as the base (a worktree seat's `--active` resolves to the primary checkout); cover
  `--output`, `--file` and `--seen-file`; give `--event-id` a closed grammar. Test first, the
  same bytes in both estates.
- **Target surface**: agent-tools CLI (`collaboration-state`).
- **Status**: open
- **Owner direction status**: standing
- **Instance, 2026-09-28** (architecture-expert-fred's routed item on OCE PR 291; JC lane B's
  board item of 2026-09-13): `atomic-file.ts` has three product importers in both estates, so
  the no-follow seam lands with its move to `core/`, a test and a header, one same-bytes change.

### F-219 — a comms event written without a render during the pre-push gate fails the push: the generated log is stale (2026-10-01)

- **Source**: Crucible binds Slag, first-hand, the push of the coordination fold on 2026-10-01.
- **Surface**: JC.net's pre-push `practice-substrate check`, reached through `pnpm check` (in OCE the script `practice:substrate:check` exists and no hook calls it); `collaboration-state -- comms append`.
- **Observed**: the check renders the comms log from the event files and refuses when the rendered text differs from `shared-comms-log.md` on disk (`live-shared-comms-log.ts`); it makes no age test. `comms send` appends and then renders (`cli-comms-send.ts`, both estates), so a send leaves the log current. The log goes stale for a writer that does not render (`comms append`) and in a race between two renders (the instances of 2026-09-26 and 2026-09-27 below). Which writer made the 2026-10-01 instance stale was not read. Cost: one full gate run. Cure used: `comms render`, then push again. Asking peers to hold `comms send` during a gate is not needed (a reviewer's finding on OCE's pull request 318, verified in the code).
- **Expected**: a push does not depend on an untracked, generated file that another seat's
  write can invalidate mid-gate.
- **Candidate cure**: the check writes the rendered log back before comparing (the repair is deterministic), or the file on disk stops being an input; `comms append` renders.
- **Target surface**: agent-tools CLI (`practice-substrate`, `collaboration-state`).
- **Status**: open
- **Owner direction status**: standing
- **Instances, 2026-09-26 and 2026-09-27** (the Director and a seat, JC): the pre-push check
  refused twice on a stale `shared-comms-log.md`; read first-hand at 11:38Z, two sends in one
  second each rendered without the other's event until the next send, a race a render lock cures.

### F-220 — `claims close` requires `--now` and the directed comms commands require both paths, where their siblings default them (2026-10-01)

- **Source**: a review finding on the coordination fold and Crucible binds Slag's first-hand
  runs, 2026-10-01.
- **Surface**: `agent-tools/README.md`; `collaboration-state -- comms direct`, `comms reply`,
  `claims close`.
- **Observed**: `comms direct` and `comms reply` require `--active` and `--comms-dir`; only
  `comms send`, `comms watch` and `comms validate` resolve the coordination home, as the README
  says since the fold. The README's sentence "`--now` defaults to the wall clock" is unscoped:
  `claims open` defaults it and `claims close` requires it. Read in both estates' source on
  2026-10-01.
- **Expected**: the directed commands and `claims close` take the same defaults as `comms send`
  and `claims open`.
- **Candidate cure**: wire the send defaults into the directed commands and default `--now` on
  every claims command, test first, both estates; until then the README scopes the sentence.
- **Target surface**: agent-tools CLI (`collaboration-state`).
- **Status**: open
- **Owner direction status**: standing

### F-221 — `codex-exec` reads lines through `node:readline`, which splits on U+2028 and U+2029 (2026-10-01)

- **Source**: the code review of the arc-metrics port, reported by Crucible binds Slag,
  2026-10-01. The same defect in `arc-metrics/file-system-node.ts` is cured in both estates.
- **Surface**: `agent-tools/src/codex-exec/cli.ts`.
- **Observed**: a line reader built on `node:readline` treats the Unicode line and paragraph
  separators as line ends, so a JSON line holding either is split and dropped.
- **Expected**: one entry per newline-terminated line, whatever the entry holds.
- **Candidate cure**: the line splitter arc-metrics now uses, shared by both readers, test first.
- **Target surface**: agent-tools CLI (`codex-exec`).
- **Status**: open
- **Owner direction status**: standing

### F-222 — the local gates read the shared working tree, so a peer's uncommitted hunk blocks a commit or a push (2026-09-28)

- **Source**: five comms events of 2026-09-28 across both estates, grouped at the second
  two-estate consolidation: a push from the primary failing the link validator on another
  workspace's uncommitted edits; two seats' records hunks in the same two files; a seat saving a
  peer's hunks as a patch and rewriting the files to stage only its own; a second commit racing
  the index during a gate.
- **Surface**: the pre-commit and pre-push hooks in a shared primary checkout.
- **Observed**: `respect-active-agent-claims` §Shared-state files already says a claim never
  blocks a write or an inclusion, and `stage-by-explicit-pathspec` covers the staging. The
  waits and rewrites recurred with both loaded, because the gates read the tree and not what
  ships.
- **Expected**: the pre-push gate judges the pushed commit and the pre-commit gate judges the
  index, so a peer's uncommitted work cannot fail either.
- **Candidate cure**: run the pre-push validators against a clean checkout of the pushed commit;
  the commit-queue ceremony prints the never-block-inclusion line when its pathspec names a
  shared-state file holding another seat's hunks.
- **Target surface**: hooks; agent-tools CLI (`commit-queue`).
- **Status**: open
- **Owner direction status**: standing
- **Further instance, 2026-10-01** (Hazel tracks Trunk, JC.net): the pre-push link check failed a
  coordination-branch push on two Markdown files in a gitignored analysis directory, copies of
  the other estate's register synced there as scratch. The gate reads ignored files as well as
  a peer's uncommitted ones. Cure used: the copies were renamed to a non-Markdown extension.

### F-223 — nothing refuses a process kill by name (2026-09-29)

- **Source**: a seat's incident line, 2026-09-29: stopping its own push with `pkill` by name
  also ended the Director's hook shell in the other estate.
- **Surface**: the PreToolUse Bash policy (`agent-tools/src/hook-policy`).
- **Observed**: `no-unbounded-host-load` says "Kill by the pids recorded at launch, never by
  command text", and `comms-all-channels-watcher` forbids a `pkill -f` pattern. The kill by
  name recurred after both; no hook checks it.
- **Expected**: the moment of the kill carries the rule.
- **Candidate cure**: a Bash policy check that refuses `pkill`, `killall` and a
  `pgrep … | xargs kill` pipeline and prints the kill-by-recorded-pid line.
- **Target surface**: agent-tools hook policy.
- **Status**: open
- **Owner direction status**: standing
- **Earlier instance, 2026-09-27** (a seat, OCE): stopping its own processes, a seat swept the
  process table for "sleep 240" and signalled a sleep in the Director's pulse loop (one early
  tick). The 2026-09-29 kill was read from both sides; its napkin entry was owed to the successor.

### F-224 — OCE's branch-guard smoke's PATH is narrower than the trusted-git allowlist (2026-09-26)

- **Source**: a seat's first-hand confirmation on OCE PR 246, round 4 (Swallow holds Drift),
  2026-09-26; accepted as a follow-up when the settlement budget was spent.
- **Surface**: `agent-tools/smoke-tests/trusted-shell-directories.ts` (`trustedShellPath`).
- **Observed**: the smoke's PATH on POSIX is `/usr/bin:/bin`, while `resolveTrustedGit` in
  `agent-tools/src/core/trusted-git.ts` also admits `/opt/homebrew/bin/git` and
  `/usr/local/bin/git`. On a host with git only there, the smoke's pass cases fail closed.
- **Expected**: the smoke can find any git the allowlist admits.
- **Candidate cure**: the smoke's PATH gains the directory of the resolved trusted git, joined
  with the platform's delimiter; both estates carry the same list.
- **Target surface**: agent-tools smoke tests.
- **Status**: open
- **Owner direction status**: standing

### F-225 — the Bash policy reads a force push across a whole compound command (2026-10-01)

- **Source**: Crucible binds Slag, first-hand, 2026-10-01.
- **Surface**: the PreToolUse Bash policy in JC.net (`agent-tools/src/hook-policy`); OCE's twin
  is not checked.
- **Observed**: a compound command holding `gh api graphql -f query=…`, the word "push" inside
  a pull request title, and "git" in prose was refused as a force push. No push was present.
  Cure used: the text goes in files and `-F query=@file` replaces `-f query=`.
- **Expected**: the matcher judges one simple command at a time
  (`hook-policy-substring-discipline`).
- **Candidate cure**: split the command line into simple commands before matching, and match
  `-f` only as an argument of a `git push`.
- **Target surface**: agent-tools hook policy.
- **Status**: open
- **Owner direction status**: standing
- **Ported**: from JC.net's register on 2026-10-02; the entry above is JC.net's reading at its own
  date. Checked against this estate's code on 2026-10-02: OCE's hook policy carries the force-push
  patterns and has the segmenting step (`segmentCommand` in `shell/shell-words.ts`, argv mode), but
  no `match: argv` entry in `policy.json` engages it (checked at the fold, 2026-10-02, Efreet lifts
  Scorch, 7adb15); the refusal was not re-run. See F-207 for the same matcher reading prose.

### F-227 — four real-filesystem integration tests time out at five seconds on the Windows job (2026-10-01)

- **Source**: Crucible binds Slag, first-hand, the fold of 2026-10-01.
- **Surface**: the `windows-basic` CI job; `tests/protocol-conformance/node-io.integration.test.ts`
  and `tests/skills-adapter-generate/carriage.integration.test.ts`.
- **Observed**: the four tests ran 5.0 to 7.6 s against vitest's default 5 s limit and failed
  on a head that changed four docs files; the re-run passed.
- **Expected**: a test that does real IO is not judged against a wall clock (the owner's word
  on smoke suites, 2026-09-29).
- **Candidate cure**: move the IO behind the injected seam these tests already have elsewhere,
  as the testing directive asks.
- **Target surface**: agent-tools tests.
- **Status**: open
- **Owner direction status**: standing
- **Earlier instance, 2026-09-26** (Myrtle turns Canopy): PR 221's `windows-basic` job failed with
  `refound-tile.integration.test.ts` at 6038 ms against the 5000 ms default (run 36237551167),
  unrelated to the PR's files; the test sets no timeout of its own.

### F-228 — no command formats or lints a computed file list, so seats pass an unquoted variable (2026-09-30)

- **Source**: the napkin, 2026-09-30 (Hawthorn binds Bracken); the gotchas entry of 2026-09-03 is
  the first instance.
- **Surface**: `prettier` and `markdownlint` run by hand over a shell variable under zsh.
- **Observed**: an unquoted variable holding a file list reaches the tool as one argument. On
  2026-09-03 prettier exited 2 and markdownlint linted the whole tree; on 2026-09-30 prettier
  printed "0 files" above a clean verdict. The gotchas file carried the lesson for four weeks
  before the second instance.
- **Expected**: a seat lints exactly the files it changed with one command.
- **Candidate cure**: a root script that takes paths on stdin (or lints the files changed
  against a base ref) and prints the count of files it read; until then, `xargs`.
- **Target surface**: root package scripts.
- **Status**: open
- **Owner direction status**: standing

### F-229 — a unit test pins text inside an agent document, and the docs pre-flight does not run it (2026-09-30)

- **Source**: the JC.net napkin, 2026-09-30T17:06Z (Hawthorn binds Bracken): a records edit to
  the Sif annex failed its pre-commit.
- **Surface**: `agent-tools/tests/skills/the-codex-dialogues-probe-lockstep.unit.test.ts`.
- **Observed**: the test refuses a version literal beside `codex mcp-server` or the CLI name in
  the annex, which may only reference the version pin. `pnpm check:docs` does not run it, so a
  records edit that passes the docs pre-flight fails at the commit's full gate.
- **Expected**: a records edit is judged by the docs pre-flight alone, or the pre-flight names
  the tests that read documents.
- **Candidate cure**: the owner assigned the cure to the exchange seat on 2026-10-01; either
  the pinned fact moves out of prose into the data the test already reads, or the docs
  pre-flight runs the document-reading tests.
- **Target surface**: agent-tools tests; root package scripts.
- **Status**: open
- **Owner direction status**: standing

### F-230 — the divergence measure names a directory neither estate has and skips three shared trees (2026-10-01)

- **Source**: the second two-estate consolidation, 2026-10-01 (Hazel tracks Trunk): the docs
  check refused the rule's scope list for citing `.agent/reviewers/`.
- **Surface**: the measuring script in the 2026-09-30 retrospective report, which
  `cross-estate-work-must-reduce-divergence` makes the measure.
- **Observed**: the script's scope lists `.agent/reviewers/`, which neither estate has. The
  reviewer templates are under `.agent/sub-agents/`, which it does not read; it does not read
  `.agent/memory/active/patterns/` or `.agent/reference/` either, both shared doctrine.
- **Expected**: the measure covers every shared doctrine tree, from one tracked command.
- **Candidate cure**: the owed `agent-tools` divergence command takes its scope from the rule
  and adds the three trees; the first run with the wider scope sets a new baseline and is
  reported beside the old one.
- **Target surface**: agent-tools CLI; the rule's clause 1.
- **Status**: open
- **Owner direction status**: standing

### F-231 — boundary records sit uncommitted on a cited precedent with no live owner word (2026-09-15)

- **Source**: twenty comms events in both estates, 2026-09-15 to 2026-09-30, grouped at the second
  two-estate consolidation (2026-10-01); the owner's word for compaction boundary 6, relayed by
  the Director (Wick binds Temper) on 2026-09-26 at 11:04Z, is "commit and push post-compaction".
- **Surface**: the boundary block and resume step of `session-handoff`;
  `precedence-is-not-approval`, whose trigger list names "the shape of a prior owner
  intervention".
- **Observed**: after that word, seats left boundary records uncommitted on the primary citing
  "the owner's precedent", "the Director's precedent" or "the compaction precedent" at five later
  boundaries (2026-09-26, 2026-09-28, 2026-09-29), each traced to the one word, so their commit
  and push became the resume's first act. On 2026-09-26 a usage limit cut a seat's records commit
  and push promised "before the stop" (OCE). Earlier boundaries left records on a local branch or
  for a later seat to commit (2026-09-15, 2026-09-24, 2026-09-25).
- **Expected**: a boundary's records are committed by pathspec before the stop unless the owner's
  word at that boundary says otherwise, and the resume finds any that were not.
- **Candidate cure**: the boundary block takes a field "records: committed <sha> | uncommitted
  under the owner's word at this boundary <quote, time>", so a precedent with no live word reads
  empty; the resume step lists uncommitted records on the primary with their authoring seat.
- **Target surface**: `session-handoff` (boundary block, resume step).
- **Status**: open; five instances after the rule's home date (2026-09-12) cite a precedent.
- **Owner direction status**: standing

### F-232 — a proven-superseded local branch has no permitted delete command (2026-09-25)

- **Source**: seats' comms events in OCE, 2026-09-25 to 2026-09-28 (Swallow holds Drift and
  Myrtle turns Canopy among them), grouped at the second two-estate consolidation.
- **Surface**: the standing prune in `worktree-hygiene` §6 (both estates); `git branch -d`; JC's
  `merge-bot retire` (`agent-tools/src/merge-bot/retire-*.ts`); the harness classifier and the
  seat's Bash guard.
- **Observed**: §6 deletes a branch that "landed by squash or is content-superseded" once its
  content proof is recorded, but `git branch -d` refuses such a branch as not fully merged, and the harness's permission layer refuses `git branch -D` and `git update-ref -d` (OCE's `.claude/settings.json` deny list names both; neither estate's hook policy has such an entry). In
  five instances proven branches were held for the owner's word; one was cleared on 2026-09-28
  at the owner's word ("Delete it by the forced path on this word (Recommended)") by removing
  the loose ref file. JC's `merge-bot retire` deletes only a tip that is an ancestor of the
  default branch (`retire-decision.ts`); OCE has no retire command.
- **Expected**: the prune policy names one admissible route for the proven class, so a proven
  branch is deleted without routing to the owner.
- **Candidate cure**: `merge-bot retire` accepts a content-superseded local branch, recomputing
  the per-file content proof against a freshly fetched base and recording it before its
  compare-and-swap `update-ref -d`; OCE takes the command; §6 names it.
- **Target surface**: agent-tools CLI (`merge-bot retire`); `worktree-hygiene` §6, both estates.
- **Status**: open; five instances (OCE). Distinct from F-178, a merged branch whose configured
  upstream lacks it.
- **Owner direction status**: standing

### F-233 — the WIP limit is hand-counted, and prepared work waits outside a pull request (2026-09-26)

- **Source**: comms events in both estates, 2026-09-26 to 2026-09-29: the Director's rulings of
  2026-09-26 and 2026-09-27, a landing post of 2026-09-27, and seats' pause closeouts.
- **Surface**: the work-in-progress limit in `pr-lifecycle` (both estates), with the owner's words
  "The total number of allowed PRs not including coordination PRs is the number of implementer agents, in this case three"
  and the sentence "While the count is full, a seat prepares without a worktree or a commit".
- **Observed**: no command in either estate's agent-tools computes the count. On 2026-09-27 a
  count included a coordination PR until a first-hand read; on 2026-09-28, at 3 of 3, one seat
  pushed a branch as the bot with no PR "so the bytes are safe" and another pushed a branch with
  no PR; on 2026-09-29 J8 B2 and B3 were committed in a worktree and held unpushed. The owner's
  word quoted by the Director on 2026-09-27 is
  "All useful work must be pushed and in a PR or merged".
- **Expected**: the count is computed, and a first push or a new lane worktree meets the limit at
  the moment it acts.
- **Candidate cure**: an agent-tools command that counts open PRs across the team's repositories
  less those whose head is under `coordination/`, for check-in, landing and slot lines to quote;
  a command that makes a branch's first push and opens its draft PR in one step, refusing at the
  limit with the pr-lifecycle sentence; `set-up-worktree-lane` runs the same check.
- **Target surface**: agent-tools CLI; `pr-lifecycle`; `set-up-worktree-lane`.
- **Status**: open; four instances.
- **Owner direction status**: standing
- **Further instance, 2026-10-01** (Hazel tracks Trunk, both estates): with its own pull request
  open, the consolidation seat cut, committed and pushed two more branches and cut a third,
  with the sentence "While the count is full, a seat prepares without a worktree or a commit"
  loaded. The text did not hold; five instances.
- **The owner's word on the count, 2026-09-29** (recorded in OCE's estate-coordination thread,
  two days after the limit landed, with seventeen pull requests open under the label
  "residual"): "There are WIP limits for very good reasons."

### F-234 — commitlint refuses the message only after the pre-commit gate has run (2026-09-26)

- **Source**: comms events in both estates, 2026-09-26 to 2026-09-29, from seats (Myrtle turns
  Canopy among them) and the Director; nine refusals or warnings.
- **Surface**: `.husky/commit-msg` (commitlint), which git runs after `.husky/pre-commit`; the
  commit-queue workflow (`agent-tools/src/commit-queue/commit-workflow.ts`); the seats' records
  ceremony; `pnpm agent-tools:check-commit-message`.
- **Observed**: the commit-queue workflow runs the message check before `git commit` only as an advisory (`commit-workflow.ts` calls the advisory orchestrator, whose result does not block), so a header
  over length, a subject in the wrong case, or a body line opening with a word and a colon or a
  hash-prefixed PR number (read as a footer) is refused after the full gate. A push then carried
  only another seat's commit (2026-09-26), and a records ceremony ended exit 2 at an unchanged
  tip four times (2026-09-28 and 2026-09-29). The commit skill says the message is "validated by
  `pnpm agent-tools:check-commit-message` before `git commit` is invoked"; seats ran it by hand
  after a refusal. JC's commit-msg hook runs commitlint without `--strict`, so a warning passes
  there (one shipped on 2026-09-28); OCE's runs `--strict`.
- **Expected**: a message refusal costs no gate run and needs no seat to remember the step.
- **Candidate cure**: the commit paths (the commit-queue workflow, the records ceremony, OCE's
  designed `merge-bot commit --message-file`) run `check-commit-message` on the message file
  before any staging or gate and name the offending line; a commit refused at the hook prints
  "NOT COMMITTED: tip unchanged at <sha>"; JC's commit-msg hook takes `--strict`.
- **Target surface**: agent-tools CLI (`commit-queue`); `.husky/commit-msg`.
- **Status**: open; nine instances. F-209 covers commitlint in CI, not this order.
- **Owner direction status**: standing
- **Further instance, 2026-10-01** (Hazel tracks Trunk): one message body with a line opening
  "rule: re-arm" passed JC.net's `check-commit-message` and was refused by OCE's as a footer
  with no leading blank line; the same day a commit chained after the check with `;` ran on a
  refused header. Ten and eleven.

### F-235 — a stale `.git/index.lock` from a seat's own interrupted git child blocks the primary (2026-09-25)

- **Source**: comms events of 2026-09-25 (OCE, Swallow holds Drift) and 2026-09-28 (JC, Siren
  herds Rudder and Nova turns Penumbra; OCE, Nova turns Penumbra), grouped at the second
  two-estate consolidation.
- **Surface**: the commit skill's Foreign index lock section; `.agent/hooks/policy.json` (both
  estates).
- **Observed**: three stale 0-byte locks with no live holder, each left by the seat's own
  interrupted git child: a merge-bot push's pre-push hook (OCE primary, 2026-09-25), a heartbeat
  stopped mid-cycle (JC primary, 2026-09-28, git blocked from 17:11Z to 17:15Z) and a build
  backgrounded inside one shell call (an OCE worktree, 2026-09-28). The skill's premise "A
  foreign lock means another agent is mid-commit" fitted none. Two were removed without the
  owner's word, one on the Director's no-objection (2026-09-25) and one recorded afterwards as a
  deviation (2026-09-28); the third went with its worktree under the owner's word,
  "Yes, remove it (Recommended)". Neither policy file names `index.lock`.
- **Expected**: the moment a seat reaches for the lock carries the skill's direction and names the
  likely own-child causes.
- **Candidate cure**: a Bash policy entry refusing `rm`, `unlink` or `mv` of a path ending
  `index.lock` (argv patterns, not a substring), whose reappraisal names the Foreign index lock
  section, the own-child causes and the route to the owner through the Director, lock untouched.
- **Target surface**: agent-tools hook policy; the commit skill's foreign-lock premise.
- **Status**: open; three instances, two removals without the owner's word.
- **Owner direction status**: standing; the skill cites the owner's direction of 2026-05-03

### F-236 — a commit on the shared primary carries a peer's staged or uncommitted hunks (2026-09-25)

- **Source**: comms events in both estates, 2026-09-25 to 2026-09-29, grouped at the second
  two-estate consolidation; the 2026-09-28 events in the same blocks are F-222's sources.
- **Surface**: commit and records scripts staging by pathspec on a primary checkout several seats
  commit from; `stage-by-explicit-pathspec`.
- **Observed**: staging a shared file by pathspec took a peer's uncommitted edits with it: the
  napkin (OCE, 2026-09-25), the review-cost ledger and napkin (OCE, 2026-09-27), and a 13-line
  plan-node hunk through a records script's fixed pathspec (JC, 2026-09-29). On 2026-09-29 two
  failed commits left files staged in JC's primary index: a seat's register rows (its
  102-character header refused by commitlint) rode the Director's commit, and the Director's
  napkin stayed staged after a pre-commit failure. The rule says "staging a file captures its
  WHOLE uncommitted state"; F-222 holds the other face, a peer's hunk failing a gate.
- **Expected**: a commit carries only what its author's own change produced.
- **Candidate cure**: records and commit scripts stage from the patch they applied, with
  `git apply --cached` as one JC records script now does; the commit path checks the message
  before any `git add`; a pre-commit check refuses an index holding paths outside the commit's
  pathspec and lists any staged hunk in a shared live file the seat's patch did not produce (the
  rule's Structural-Enforcement Candidate, shape 1).
- **Target surface**: agent-tools CLI (`commit-queue`); hooks; `stage-by-explicit-pathspec`.
- **Status**: open; five instances.
- **Owner direction status**: standing; the rule marks its structural-enforcement choice as
  owner-direction-shaped

### F-237 — commit and push chains report an outcome not read from the repository (2026-09-26)

- **Source**: comms events in both estates, 2026-09-26 to 2026-09-29: the Director's own
  corrections (JC) and seats' gate-done lines (OCE).
- **Surface**: hand-composed commit, push and sign chains; the seats' records ceremony (gate
  notice, queued records commit, gate done), which no agent-tools module in either estate names.
- **Observed**: two JC push runs carried nothing, one through an index lock and one through a
  missing message file (2026-09-26); a "rotation done" line went out against an unmoved head
  after an index-lock test failed silently (2026-09-27); a chain masked an exit and signed two
  threads before its push landed (2026-09-28). In OCE a ceremony's entry script reported end 0
  over a refused push (2026-09-28, cured in that seat's script), and gate-done lines reported
  exit 1 or 2 at tips that already held the commit, once at a tip already reported exit 0, with
  the gate events posted twice (2026-09-26, 2026-09-29). The in-band exit-codes rule names "a
  gate-runner helper that owns capture" as future tooling.
- **Expected**: the reported outcome is computed from the repository: HEAD moved, the remote tip
  equals HEAD, one gate event each.
- **Candidate cure**: an agent-tools landing command that records HEAD before the commit, refuses
  when HEAD did not move, reads the remote tip back after the push and exits non-zero unless it
  equals HEAD, naming the failing step; signing and "done" lines chain on its exit, and the
  records ceremony becomes that tracked command.
- **Target surface**: agent-tools CLI.
- **Status**: open; seven instances.
- **Owner direction status**: standing

### F-238 — the Cricket frame is assembled by hand and omits or misstates plan items (2026-09-26)

- **Source**: the Director's check-in frames of 2026-09-26 and the suite judges' readings, five
  comms events in both estates.
- **Surface**: `cricket` §Build one identical frame, field 1 (both estates).
- **Observed**: one frame left P7 out of READING and NEXT and did not compute the plan's
  §Verification measures (four NARROWED readings); a later frame did not say P7, P6 and P10(a)
  were done (five judges); check-in 31 reported P7 "not started" when it had landed in JC pull
  request 214 and OCE 249 (CONTRADICTED 6, all on that line). Field 1 asks for "the governing
  plan node's todo lines, quoted verbatim with the file and commit they were read at".
- **Expected**: the frame's sources carry every named item of the governing plan node with its
  true status, so the judges spend no verdicts on omissions.
- **Candidate cure**: a frame-assembly command that renders the SOURCES block from the plan node,
  each todo line verbatim with file and commit and each todo's landed PR or holding seat looked
  up.
- **Target surface**: agent-tools CLI; `cricket`.
- **Status**: open; three instances, one seat, one day.
- **Owner direction status**: standing

### F-239 — the pre-push chain reads no commit message or added path against the privacy directive (2026-10-01)

- **Source**: a privacy review of the push path, read against the code on 2026-10-01.
- **Surface**: `.husky/pre-push`; `privacy.md` rule 1, rule 7 and §Private editorial material.
- **Observed**: `.husky/pre-push` runs `pnpm check` and the site's end-to-end suite; no step reads
  the pushed range's commit messages or added paths against the privacy directive. Rule 1 names
  commit messages as a carrier; rule 7's whole-document read names plans and records, not commit
  messages. A branch's first push publishes its commits and their messages, and under merge
  commits a later commit leaves an earlier one in history.
- **Expected**: a pushed range's commit messages and added paths are read against the privacy
  directive before a branch's first push.
- **Candidate cure**: rule 7 extends to the pushed range's commit messages; a pre-push check
  refuses an added path under the ignored private boundaries and holds the first push of a branch
  adding files under `linkedin/` until a recorded privacy-review line exists. The check carries
  path families only, never a term list: a list of private names in a public hook identifies
  what it guards, and no scan reads meaning.
- **Target surface**: `.husky/pre-push`; agent-tools CLI; `privacy.md`.
- **Status**: open.
- **Owner direction status**: standing
- **Ported**: from JC.net's register on 2026-10-02; the entry above is JC.net's reading at its own
  date. Checked against this estate's code on 2026-10-02: OCE's `.husky/pre-push` has no step that
  reads commit messages or added paths against the privacy directive.

### F-240 — nothing makes a ruling name the primary surface it read (2026-09-28)

- **Source**: the Director's own corrections of 2026-09-28 on both streams, which count them as
  the sixth and seventh read-the-primary-surface instances against that seat in one window.
- **Surface**: the clause in `verify-dont-trust` that a ruling
  "names what was read: the file's blob at the default branch's tip (never a checkout on a coordination branch), the API response, the run list"
  (both estates, from 2026-09-26); ruling-bearing comms sends.
- **Observed**: a review verdict read the coordination branch's copy of the exchange register
  before the convergence merge, not origin/main; a ruling rested on an unread premise about a
  deployed entry point; a lift rested on a review's state, not its body (all 2026-09-28, each
  corrected by a later event).
- **Expected**: a ruling names its primary surface at the moment it is sent.
- **Candidate cure**: a ruling-bearing comms send takes a `--read` argument per primary surface (a
  path at the default-branch blob sha, an API response, a run id), and the comms CLI refuses a
  ruling without one.
- **Target surface**: agent-tools CLI (`collaboration-state` comms); `verify-dont-trust`.
- **Status**: open; three instances recorded here, seven by the seat's own count.
- **Owner direction status**: standing

### F-241 — a machine-local path written into a channel file blocks another seat's commit (2026-09-25)

- **Source**: seats' comms events of 2026-09-25 (OCE, 11:23Z and 15:24Z) and 2026-09-26.
- **Surface**: tracked ARC channel files; `validate-no-machine-local-paths` (OCE's pre-commit hook; in JC.net it runs at pre-push through `pnpm check`);
  the comms concept gate's path-scoped `machine-local-path` concept (`comms-concept-gate.ts`,
  both estates).
- **Observed**: temporary-directory prefixes written into a pairing channel by two seats sat in
  the tracked file until another seat's commit and coordination-branch push were refused by the
  validator; two commit tries failed before the prefixes were replaced by a placeholder (twice
  on 2026-09-25, the second after a scratchpad-guard bullet landed in
  `important-state-not-in-temp-files` that day). By the source's read, the concept gate checks
  comms events only.
- **Expected**: the writer meets the refusal when the channel is written.
- **Candidate cure**: extend the concept gate's `machine-local-path` concept, or a write hook, to
  ARC channel appends.
- **Target surface**: agent-tools CLI (`collaboration-state`); hooks.
- **Status**: open; two instances, one day.
- **Owner direction status**: standing; the no-machine-local-paths principle is the owner's
  ruling of 2026-06-12

### F-242 — pr-watch counts a seat's reply as a review round when its signature shape differs (2026-09-26)

- **Source**: seats' comms events of 2026-09-26 (OCE), one by the seat whose replies carried the
  earlier shape.
- **Surface**: `SIGNATURE_SUFFIX` in `agent-tools/src/pr-watch/reviewer-legs.ts` (both
  estates); `identify-as-agent-under-shared-credentials`.
- **Observed**: the reader takes a bot-account reply as signed only when its last line starts
  with an em dash and ends with the session prefix, so "— <agent-name> (<prefix>), an agent"
  reads as unsigned and counts as a review round. The rule placed the prefix last at 12:41Z; at
  15:32Z a seat's PR 255 reply lacked the signed line, a peer caught it, and one comment edit as
  the bot cured it.
- **Expected**: the replying seat learns of an unsigned reply from the watch, not from a peer.
- **Candidate cure**: pr-watch names in its own output each bot-account reply whose last line
  begins with an em dash but fails `SIGNATURE_SUFFIX`, as a seat reply read as unsigned.
- **Target surface**: agent-tools CLI (`pr-watch`).
- **Status**: open; one instance after the rule's home.
- **Owner direction status**: standing

### F-243 — nothing lists unanswered ACK-REQUESTED events, so the Director answers them late (2026-09-27)

- **Source**: the Director's recorded defects of 2026-09-27 on both streams.
- **Surface**: the comms CLI (`collaboration-state`); `directed-routing-requires-absorption-ack`;
  `use-monitor-for-event-driven-wake`.
- **Observed**: a seat's ACK-REQUESTED question was answered 36 minutes late and another seat's
  routing request and ping sat about eighteen minutes, because OCE's stream was not read
  between check-ins. The wake rule says nothing makes the seat "READ the buffer between wakes";
  no agent-tools source in either estate handles ACK-REQUESTED. The cure applied was by hand,
  "every wake now reads directed events first".
- **Expected**: the reading order at each wake is the tool's, not the seat's memory.
- **Candidate cure**: a wake-time line from the comms CLI listing ACK-REQUESTED directed events
  addressed to the reader with no threaded reply, oldest first with their age; the Director's
  bootstrap arms one Monitor-backed `comms watch` per directed estate stream.
- **Target surface**: agent-tools CLI (`collaboration-state` comms); the Director's bootstrap.
- **Status**: open; two instances, one seat, one day.
- **Owner direction status**: standing

### F-244 — a script switched the shared primary's branch under a peer's unpushed commit (2026-09-27)

- **Source**: the Director's recorded defect and a seat's lesson, 2026-09-27, on both streams.
- **Surface**: the Director's settlement script (untracked); the shared-checkout clause of
  `worktree-hygiene`; `.agent/hooks/policy.json` (both estates).
- **Observed**: at 15:58Z the script switched OCE's primary to PR 265's branch between
  Swallow holds Drift's commit and push; the push read the switched branch and moved nothing
  (exit 1, up to date), and the seat pushed at 16:07Z. The rule reads
  "Never switch or create a branch (`git checkout`, `git switch`, `checkout -b`) in a checkout you do not exclusively own without explicit approval";
  the policy files block only the `git checkout --` and
  `git checkout HEAD` forms, and a switch inside a script is out of the Bash guard's sight.
- **Expected**: a push reads the branch its committer left.
- **Candidate cure**: settlement and other Director scripts become tracked agent-tools commands
  that run in their own worktree and refuse to switch the primary's branch outside the fold
  rotation; a policy entry refuses `git switch` and `git checkout <branch>` in the primary
  outside the fold; `merge-bot push` refuses when HEAD's branch is not the one the seat committed
  on.
- **Target surface**: agent-tools CLI (`merge-bot push`); hook policy.
- **Status**: open; one instance, no work lost.
- **Owner direction status**: standing

### F-245 — the review-cost refusal names an owner raise where PDR-140 rebudgets by recorded decision (2026-09-27)

- **Source**: comms events of 2026-09-27: the Director's owner-card line, a seat's question to the
  owner, and the Director's withdrawal (event 3229a975).
- **Surface**: the BUDGET-EXHAUSTED refusal in `agent-tools/src/review-cost/cost.ts` (line 179);
  PDR-140's step-back clause.
- **Observed**: PR 250's budget line blocked its sync and cure push; the Director put a raise to 4
  on the owner card and a seat asked the owner, while PR 250's three reviewed cures sat
  uncommitted in a worktree, until the Director withdrew the line and ruled the rebudget the
  lane's recorded decision. The refusal reads "or the budget is raised on the pull request by the
  owner"; PDR-140 says "rebudget by recorded decision (one further settlement push with its
  reason in the working notes)".
- **Expected**: the refusal names the route the PDR gives.
- **Candidate cure**: the BUDGET-EXHAUSTED message names PDR-140's rebudget: the lane edits the
  body's budget line and records its reason, once per PR on records-class work.
- **Target surface**: agent-tools CLI (`review-cost`).
- **Status**: open; one instance. JC has no review-cost gate.
- **Owner direction status**: standing

### F-246 — no tracked push re-requests reviews, so legs stay bound to the old head (2026-09-29)

- **Source**: a seat's lesson of 2026-09-29 (OCE, PR 312), seen on the legs Monitor.
- **Surface**: settlement pushes; the configured-legs passage of `pr-lifecycle`; `merge-bot`
  (both estates).
- **Observed**: a hand-written settlement script pushed without the Copilot and `@codex review`
  re-requests, so both legs stayed bound to the old head until the seat saw it on the legs
  Monitor. `pr-lifecycle` says Copilot "reviews the FIRST push and any tip the bot explicitly
  requests it on"; no merge-bot source in either estate requests a review.
- **Expected**: every settlement push re-requests each available configured leg on the new tip.
- **Candidate cure**: the tracked push step of the door (the merge-bot front door or a settlement
  command) re-requests every available configured leg on the new tip as the bot after it pushes;
  the legs Monitor's bound-to-old-head reading stays as the check that it ran.
- **Target surface**: agent-tools CLI (`merge-bot`).
- **Status**: open, an observation (one instance).
- **Owner direction status**: standing

### F-247 — a template-filled broadcast posted with an unfilled placeholder token (2026-09-28)

- **Source**: the Director's ROTATION line of 2026-09-28 00:37Z (JC), corrected by a follow-up
  event.
- **Surface**: `comms send` (`collaboration-state`, both estates); `coordination-fold` step 10.
- **Observed**: the ROTATION line left `{BASE9}` where the successor's base sha belonged in its
  second mention. The fold skill says "A broadcast filled from a template by substitution is
  re-read whole before posting, not only at its placeholders"; the send path has no
  template-token check in either estate.
- **Expected**: a substituted broadcast cannot post with a hole.
- **Candidate cure**: the comms send path refuses a body still carrying an unfilled
  `{UPPER_CASE}` token and names it.
- **Target surface**: agent-tools CLI (`collaboration-state` comms send).
- **Status**: open, an observation (one instance).
- **Owner direction status**: standing

### F-248 — the landing slot is a posted line, so two holders can take it (2026-09-28)

- **Source**: the Director's lesson (JC stream, check-in 64) and a seat's friction line (Nova
  turns Penumbra, OCE), both 2026-09-28.
- **Surface**: the slot turn of `pr-lifecycle` ("slot taken" to "slot released" on the
  coordination stream), both estates; no landing-slot code in either estate's agent-tools
  (`gate-slot` is the host gate limit).
- **Observed**: two go-lines issued at once named no holder, so PRs 281 and 282 were both synced
  (JC); after PR 291's release at 23:14:57Z, #293's take and 291's retake came 43 seconds apart,
  both merges polling (OCE).
- **Expected**: a second take is refused while the slot is held, naming the holder.
- **Candidate cure**: a slot state the comms CLI computes from the stream's "slot taken" and "slot
  released" lines, or an atomic claim, refusing a second take or go-line while one is unreleased.
- **Target surface**: agent-tools CLI (`collaboration-state`); `pr-lifecycle`.
- **Status**: open; two instances, one day.
- **Owner direction status**: standing

### F-249 — the Codex seat rules let `git commit -F m --no-verify` skip the hooks (2026-09-26)

- **Source**: the Director's order of 2026-09-26 (event bce7a2ea); the merge-bot commit wrapper
  design report of 2026-09-26; the Director's first-hand refutation of a Codex P2 on 2026-09-27.
- **Surface**: `.codex/rules/seat-landing.rules` (OCE; JC has no `.codex/rules`).
- **Observed**: a `prefix_rule` allows `["git", "commit"]`, and the forbidding rule matches
  `--amend`, `--no-verify` or `-n` only in the third position, so `git commit -F message.txt
  --no-verify` is allowed and skips every hook. The wrapper that would replace the allow,
  `merge-bot commit`, is designed (`.agent/reports/agentic-engineering/` report of 2026-09-26,
  its scrub table carrying `GIT_COMMON_DIR`) and unbuilt; `GIT_CONFIG` does not
  redirect `core.hooksPath` (the report cites Git 2.43.0), so it stays out of the table. A later
  `--amend` passes the same way. F-209 names the wrapper only as its trigger; CI's commitlint
  there is the compensating control.
- **Expected**: a Codex seat's commit runs the repository's hooks whatever the flag order.
- **Candidate cure**: build `merge-bot commit` to the design, then the sync, stage and worktree
  wrappers in the Director's order, each replacing its `git` allow rule.
- **Target surface**: agent-tools CLI (`merge-bot`); `.codex/rules/seat-landing.rules`.
- **Status**: open; the gap is live by the rules' text (read 2026-10-01), with no recorded use.
- **Owner direction status**: standing

### F-251 — the Bash guard's git entries match whitespace tokens, so a glued redirection hides a flag (2026-09-27)

- **Source**: OCE's security-reviewed scanner cure in PR 261 (merged 2026-09-27); read against
  both estates' live policy by security-expert on 2026-10-01.
- **Surface**: `.agent/hooks/policy.json` and `agent-tools/src/hook-policy` (`blocked-patterns.ts`,
  `shell-words.ts`), both estates; OCE's scanner under `agent-tools/src/shell`.
- **Observed**: neither estate's `policy.json` has a `match: argv` entry, so `git reset --hard`
  and its siblings are matched by a whitespace tokeniser (`tokenizeCommand`), where
  `--hard>/dev/null` is one token and passes. JC's word scanner also keeps an unquoted `<` or `>`
  inside the preceding word (its one-character operators are the pipe, the semicolon, the
  ampersand, newline and the parentheses; unchanged since 2026-09-12). OCE cured its scanner in
  PR 261, with a literal-last-character state after a security review, and its live guard does
  not use that scanner either.
- **Expected**: a flag glued to a redirection is matched as the flag.
- **Candidate cure**: port PR 261's scanner to JC, then move the git entries to `match: argv` in
  both estates (the same change as the nested-script entry), under a security-expert review.
- **Target surface**: agent-tools hook policy; `policy.json`, both estates.
- **Status**: open; the gap is live by the code (read 2026-10-01). Hardening: the matcher's own
  doc calls it accident prevention.
- **Owner direction status**: standing

### F-252 — OCE's watcher lacks the `--poll-ms` bound and the fs-watch lint guard JC landed (2026-09-25)

- **Source**: PR 190's queued watcher follow-ups, offered as a joint set by the exchange seats on
  2026-09-25 (events 09f9a852 and c17c34d7); read against both estates on 2026-10-01.
- **Surface**: `agent-tools/src/collaboration-state/cli-options.ts`; `agent-tools/eslint.config.ts`
  (OCE).
- **Observed**: JC bounds timer options at `MAX_TIMER_DELAY_MS = 2 ** 31 - 1` and restricts fs
  watch imports in collaboration-state ("The collaboration-state runtime polls on a plain timer;
  no fs watch."); OCE has neither, so a `--poll-ms` above 2^31-1, which Node clamps to 1 ms, spins
  the loop, and a return of the fs-watch stall has no regression guard.
- **Expected**: both estates carry the same watcher guards.
- **Candidate cure**: port JC's bytes for both, with their tests; the wait-seam rename and the
  remaining F-101 test from the same set follow as the exchange schedules them.
- **Target surface**: agent-tools CLI and lint config (OCE).
- **Status**: open.
- **Owner direction status**: standing

### F-254 — test files set global fake timers against `no-global-state-in-tests` (2026-09-25)

- **Source**: the exchange seats' joint set K4, 2026-09-25 (OCE events 20cc0c88 and 252fb4ce);
  counted in both estates on 2026-10-01.
- **Surface**: `agent-tools/tests/collaboration-state/comms-watch-errors.unit.test.ts` and
  `comms-watch-loop-deadlines.unit.test.ts` (both estates); in OCE also four
  `packages/libs/logger` tests and three `packages/sdks/oak-curriculum-sdk` tests.
- **Observed**: these files call `vi.useFakeTimers` or `vi.setSystemTime` (2 in JC, 9 in OCE),
  which `no-global-state-in-tests` and the testing strategy forbid; by the source's read no lint
  rule refuses either call.
- **Expected**: time enters a test through an injected clock or scheduler.
- **Candidate cure**: inject a clock in each file, each estate's change its own slice; then a
  `no-restricted-properties` entry at error in the test preset.
- **Target surface**: agent-tools tests; OCE's logger and SDK tests; the lint test preset.
- **Status**: open.
- **Owner direction status**: standing

### F-255 — the merge-bot push credential helper is unscoped and admits ambient git config (2026-09-25)

- **Source**: Swallow holds Drift's PR 239 dispositions, 2026-09-25 (events 0b9d9046 and
  0f5b343d, condition 7), deferred to a credential-narrowing follow-up; read against both estates
  on 2026-10-01.
- **Surface**: `agent-tools/src/merge-bot/git-credential-chain.ts` (both estates);
  `agent-tools/src/core/git-remote-url.ts` (both estates since JC.net pull request 279, 2026-10-01).
- **Observed**: the push clears `credential.helper` and sets its own with no `github.com` scope,
  so a `pushInsteadOf` can redirect the token; `http.*` config and `GIT_CONFIG_*` reach the push;
  and remote URLs with default ports are refused, failing closed (its unit test expects
  `ssh://git@github.com:22/acme/widgets.git` to read no repository).
- **Expected**: the token reaches only github.com, and no ambient config steers the push.
- **Candidate cure**: scope the helper to github.com; pin proxy, TLS verification and extra
  headers on the push argv, since `http.*` and `url.*.pushInsteadOf` also live in config files;
  drop `GIT_CONFIG_*`, `GIT_SSL_NO_VERIFY` and the proxy variables from the push environment;
  compare the host of `git remote get-url --push` with github.com before the token file is
  staged; accept default ports. One change in both estates under a security-expert review.
- **Target surface**: agent-tools CLI (`merge-bot`, `core`).
- **Status**: open; a review finding, no incident. It needs write access to git config or the
  push environment on the host.
- **Owner direction status**: standing

### F-257 — the push secret scan's name-scoped exclusion trusts tracking refs fetched before a URL rewrite (2026-09-26)

- **Source**: Copilot on OCE PR 257's synced head, 2026-09-26, pre-existing; dispositioned as a
  follow-up for the secret-scan lane and carried by Swallow holds Drift's lane, which then closed
  (events f007a5e7 and 4f858cd8).
- **Surface**: `agent-tools/src/secret-scan/compute-push-scan-ranges.ts` (both estates).
- **Observed**: the exclusion `--not --remotes=<name>` trusts a remote's tracking refs, so refs
  fetched before a `remote.<name>.url` rewrite can exclude commits the new destination did not
  receive, and those go unscanned. By the source's grep, only OCE's review-cost ledger row #257
  and a thread record hold the finding.
- **Expected**: the scan excludes only commits the destination holds.
- **Candidate cure**: take the exclusion from the destination's live ref advertisement
  (`git ls-remote` on the URL git passes the hook), excluding only advertised tips present
  locally; a failed read prints the DEGRADED warning. Test first, the same bytes in both estates,
  after JC takes OCE's URL scoping.
- **Target surface**: agent-tools CLI (`secret-scan`).
- **Status**: open; a review finding, no incident.
- **Owner direction status**: standing

### F-258 — the corpus-analysis checkpoint reader resolves a relative path against the working directory (2026-09-29)

- **Source**: Codex's P1 on PR 311, 2026-09-29, reported by Nova turns Penumbra, judged not a
  regression and named as a follow-up (JC event c8e26024; item 5 of JC's exchange register J8
  row).
- **Surface**: `agent-tools/src/corpus-analysis/post-run/checkpoint-io.ts` (both estates).
- **Observed**: the file documents "A RELATIVE flag path resolves against the invocation working
  directory", while core's `resolveReadPathWithinRepo` (`flag-path-resolve.ts`) anchors a
  relative path at the repo root, as the other agent-tools CLIs do.
- **Expected**: one resolution rule for relative flag paths across the CLIs.
- **Candidate cure**: route `makeCheckpointReader` through `resolveReadPathWithinRepo`.
- **Target surface**: agent-tools CLI (`corpus-analysis`).
- **Status**: open; one review finding.
- **Owner direction status**: standing

### F-259 — tree-reading validators resolve their root through `CLAUDE_PROJECT_DIR`, scanning the primary from a worktree (2026-09-28)

- **Source**: Copilot on JC PR 239, routed by Nova turns Penumbra (event e7afa526) and
  acknowledged by the Director (event 488766da), 2026-09-28; the same seat's finding in OCE's
  smoke runner that day.
- **Surface**: `resolveRepoRoot` in `agent-tools/src/core/repo-root.ts` (both estates) and its
  default callers.
- **Observed**: `resolveRepoRoot` takes `CLAUDE_PROJECT_DIR` before walking up from the caller,
  so a tree-reading gate run in a linked worktree by a session opened in the primary scans the
  primary's tree and can report the wrong tree green. Each found site was cured locally with
  `projectDir: undefined` (the smoke runner among them); 26 JC and 46 OCE source files still call
  `resolveRepoRoot(import.meta.url)` with the default (counted 2026-10-01). The route reached only
  an archived napkin.
- **Expected**: a validator reads the tree it runs in.
- **Candidate cure**: walk up from the caller's own file by default, with the harness leg an
  explicit option for hooks; proven by a smoke with a decoy `CLAUDE_PROJECT_DIR`.
- **Target surface**: agent-tools CLI (`core`, validators).
- **Status**: open; two instances, one day.
- **Owner direction status**: standing

### F-261 — inline eslint rule-off comments pass unreported, and some workspaces compose no test shape (2026-09-25)

- **Source**: a seat's review finding on JC PR 196 (OCE event 0a513742) and the OCE exchange
  seat's acknowledgement (event cc15b5bf), 2026-09-25; config-expert found the OCE half that day.
- **Surface**: the `no-eslint-disable` rule (JC `tooling/eslint/src/rules/`, OCE
  `packages/core/oak-eslint/src/rules/`); JC's `jcdotnet/eslint.config.ts`; OCE's `oak-eslint`
  and workspace-config self-bootstrap configs.
- **Observed**: the rule's pattern matches only `eslint-disable` directives, so an inline
  `/* eslint <rule>: "off" */` comment switches a rule off unreported, and neither estate sets
  `noInlineConfig`. JC's site config composes no test-shape config, so no vitest skip, only or
  todo rule reaches its tests (JC's plugin half was cured on 2026-09-25); by config-expert's
  finding, OCE's self-bootstrap configs compose neither tier.
- **Expected**: a rule is turned off only where a reviewed config says so, and every workspace's
  tests meet the test-shape rules.
- **Candidate cure**: the rule also reports `eslint` configuration comments, or the configs set
  `linterOptions.noInlineConfig`; compose the test shape in JC's site config and in OCE's
  self-bootstrap configs.
- **Target surface**: lint configs and the `no-eslint-disable` rule, both estates.
- **Status**: open; one review finding per estate.
- **Owner direction status**: standing

### F-262 — the Bash guard's default-mode git entries do not read a quoted `bash -c` script (2026-09-27)

- **Source**: Nova turns Penumbra, OCE event 160ab4ab, 2026-09-27, recorded outside PR 261's
  scope.
- **Surface**: `agent-tools/src/hook-policy` (`argv-nested.ts`, `argument-matcher.ts`);
  `.agent/hooks/policy.json` (both estates).
- **Observed**: the argv mode re-reads an interpreter's script (`argument-matcher.ts`), but no
  entry in either policy uses it. The git entries ("git push --force" and its siblings) carry no
  mode, match by token subsequence over whitespace tokens, and miss `bash -c 'git push --force'`,
  where the quotes stay on the tokens (read in the code 2026-10-01).
- **Expected**: a git shape inside a nested script is refused as it is at top level.
- **Candidate cure**: move the git entries to `match: argv`, giving one reader that also cures
  the glued-redirection entry, after checking the argv tables cover every git entry, including
  `git --no-verify` with no subcommand.
- **Target surface**: agent-tools hook policy.
- **Status**: open; one recorded gap, no incident.
- **Owner direction status**: standing

### F-263 — a merge-bot unit test runs the real `git check-ref-format` (2026-09-25)

- **Source**: Swallow holds Drift, 2026-09-25 (OCE event 6fbf1cc5), named as later test debt
  outside PR 239.
- **Surface**: `agent-tools/src/merge-bot/push-args.unit.test.ts` (both estates).
- **Observed**: the test runs git on purpose as the oracle for ref legality ("real `git
  check-ref-format` runs here, unfaked"), so a unit test does IO.
- **Expected**: unit tests do no IO; the oracle cases live in an integration test.
- **Candidate cure**: keep the oracle cases as one integration test and give the unit tests an
  injected ref-format check.
- **Target surface**: agent-tools tests.
- **Status**: open; known test debt.
- **Owner direction status**: standing

### F-265 — OCE's agent-tools lint runs without `--max-warnings 0`, so warnings ship (2026-09-28)

- **Source**: a triage by Nova turns Penumbra, 2026-09-28 (event 0f809cae), graduating the flag
  into the recovery lane.
- **Surface**: the `lint` script in `agent-tools/package.json` (OCE `eslint .`; JC
  `eslint --max-warnings 0 .`).
- **Observed**: with the flag, lint fails on the `no-real-io-in-tests` warnings in five
  integration test files (six counted by the seat, seven outside the allowlist in a later gate
  log), so the flag waits on their cure; by the source's grep no plan file names that lane.
- **Expected**: a warning fails the lint, as `no-warning-toleration` asks and JC's script does.
- **Candidate cure**: cure the warnings and add the flag in one PR.
- **Target surface**: `agent-tools/package.json`; the five test files.
- **Status**: open.
- **Owner direction status**: standing

### F-266 — the merge door fails fast when its first poll reads `mergeable=UNKNOWN` (2026-09-24)

- **Source**: Siren herds Rudder, 2026-09-24 (JC events 539272ad and 05528fd1); two instances.
- **Surface**: `retryLabel` in `agent-tools/src/merge-bot/merge-cli.ts` (both estates).
- **Observed**: right after main moved, the first merge call for PR 180 and for a later PR exited
  1 with "mergeability not yet computed (mergeable=UNKNOWN)", and the re-run merged; the first
  refusal was also lost behind a tail filter. `retryLabel` retries a `ReadingUnavailableError`
  only when `poll > 1`, treating a first-poll failure as a broken environment, while the message
  from `pr-watch/state-gh.ts` itself says "re-run in a few seconds".
- **Expected**: an UNKNOWN mergeability reading retries within the poll budget on any poll.
- **Candidate cure**: classify the UNKNOWN reading as a wait, retried from poll 1, leaving other
  first-poll failures to fail fast.
- **Target surface**: agent-tools CLI (`merge-bot`).
- **Status**: open; two instances, one seat.
- **Owner direction status**: standing

### F-267 — the harness's auto-mode classifier refuses the persistent comms watcher (2026-09-29)

- **Source**: a seat's comms events e2324698 (2026-09-29) and 30d92cfd (2026-09-30), JC; two
  instances.
- **Surface**: the all-channels watcher launch under Claude Code's auto-mode permission check;
  `.claude/settings.json`, which names no allow rule for the watcher in either estate.
- **Observed**: the classifier denied the watcher; the seat read the stream by hand at its
  boundaries, the F-95 gate then refused `claims open`, and the lane ran claimless on broadcasts.
- **Expected**: the watcher arms in auto mode.
- **Candidate cure**: a project allow rule for the watcher's launch command, verified first-hand
  in an auto-mode session.
- **Target surface**: harness settings (`.claude/settings.json`).
- **Status**: open; two instances, one seat.
- **Owner direction status**: standing

### F-268 — a reviewer's read-only brief does not bind its Bash tool (2026-09-25)

- **Source**: a seat's disclosure, 2026-09-25 (OCE event ed4cd678); one instance.
- **Surface**: the sub-agent templates' tool sets (`.agent/sub-agents/templates/
  assumptions-expert.md` declares Read, Grep, Glob, Bash, WebFetch and WebSearch in both estates).
- **Observed**: an assumptions-expert review dispatched under a read-only brief ran
  `codex features list` on three releases and one logged-out `codex exec` that sent one
  unauthenticated request to the vendor (401, no model turn); the seat judged it within the
  owner's standing Codex permission. The template's "read-only review" mode disallows only Write,
  Edit and NotebookEdit.
- **Expected**: a review that is not to execute or reach the network says so in its tool set.
- **Candidate cure**: a read-only declaration variant without Bash and the web tools, used when a
  brief is read-only.
- **Target surface**: sub-agent declarations and templates.
- **Status**: open, an observation (one instance).
- **Owner direction status**: standing

### F-269 — OCE's transaction lock is not reclaimed when its holder died before writing `owner.json` (2026-09-24)

- **Source**: the exchange seat's finding, 2026-09-24 (event 25512039; batch three's second
  concept, event 309ae8fa); read against both estates on 2026-10-01.
- **Surface**: `removeStaleLock` in `agent-tools/src/collaboration-state/transaction-lock.ts`
  (OCE).
- **Observed**: `removeStaleLock` returns when the owner metadata is unreadable, so a lock whose
  holder died before writing it is not reclaimed at any age. JC's copy reads the lock directory's
  modified time and passes it to `isStaleLock`, reclaiming an ownerless lock by age (the work of
  JC's `commit-as-the-full-local-gate` plan).
- **Expected**: an ownerless lock is reclaimed by age in both estates.
- **Candidate cure**: take JC's bytes with their tests.
- **Target surface**: agent-tools CLI (`collaboration-state`, OCE).
- **Status**: open.
- **Owner direction status**: standing

### F-270 — the PreCompact log writer retightens a pre-existing file and then appends (2026-09-25)

- **Source**: the exchange seats' agreed joint cure, 2026-09-25 (events 2a33cf89, 26fc7185 and
  4aac9303), recorded only as a continuity line.
- **Surface**: OCE `agent-tools/src/core/owner-only-append.ts` (step 6, `fchmod`); JC
  `agent-tools/src/bin/claude-pre-compact-observe-hook.ts` (`fchmodSync`, then `appendFileSync`).
- **Observed**: both writers set a pre-existing log to 0o600 and then write, so a descriptor
  another account opened while the mode admitted it still reads the later bytes.
- **Expected**: "before any byte is written, refuse or replace a pre-existing file whose mode
  admits another account" (the joint cure's words).
- **Candidate cure**: one writer. JC takes OCE's `core/owner-only-append.ts` and its hook calls
  it (JC's writer has no no-follow flag and no owner, link-count or same-file check); the mode
  refusal lands at the `fstat` step, refusing when `mode & 0o077` is non-zero, before `fchmod`.
  Refuse; do not replace.
- **Target surface**: agent-tools CLI (`core`, the PreCompact hook).
- **Status**: open; a design finding, no incident.
- **Owner direction status**: standing

### F-271 — the schema-drift runner has no injectable seam and reads the live schema unbounded (2026-09-04)

- **Source**: a seat's routing, 2026-09-04 (events 1a25c9fd and a77022b4), carried in the
  2026-09-25 comms decision table.
- **Surface**: `agent-tools/src/ci/ci-schema-drift-check.ts` (OCE; JC has no
  `agent-tools/src/ci`).
- **Observed**: the module calls `await main()` at top level (line 156), so no test reaches its
  decisions, and reads the live schema with `response.json()` and no byte bound (line 109).
- **Expected**: the runner's decisions are testable through injected ports, and the fetch is
  bounded.
- **Candidate cure**: give `main` injected fetch and output ports and cap the body at a declared
  byte bound.
- **Target surface**: agent-tools CLI (`ci`, OCE).
- **Status**: open; no incident.
- **Owner direction status**: standing

### F-272 — merge-bot's `--expect` grammar admits the `unknown` login of a deleted account (2026-09-20)

- **Source**: a security read of 2026-09-20 (event 9000d6ce), hardening items 2 to 4, carried in
  the 2026-09-25 comms decision table.
- **Surface**: `EXPECT_GRAMMAR` in `agent-tools/src/merge-bot/merge-args.ts` (both estates);
  pr-watch's login reading.
- **Observed**: the grammar accepts `unknown`, the login pr-watch gives a deleted account's
  comment (`harvest-fields.ts` in JC, `state-fields.ts` in OCE), so an operator who
  declared it would count such a comment; the same read named a `[bot]` suffix trap, Unicode
  format characters passing the sanitiser, and a code-unit slice; those three were not re-read on
  2026-10-01, and JC's `pr-watch/printable.ts` drops format characters today.
- **Expected**: no expected-reviewer declaration can match a sentinel login.
- **Candidate cure**: carry a deleted author as a value the login grammar cannot match (null or
  a tagged variant), so no denylist is needed; the grammar refusing `unknown` is then defence in
  depth. One lane, both estates.
- **Target surface**: agent-tools CLI (`merge-bot`, `pr-watch`).
- **Status**: open; a security read, no incident.
- **Owner direction status**: standing

### F-273 — a Copilot finding in the review body under "Findings: None" is invisible to a wait that counts threads (2026-10-01)

- **Source**: Crucible binds Slag (OCE pull request 322, two rounds) and Hazel tracks Trunk
  (JC.net pull request 281, rounds two and three), first-hand, 2026-10-01.
- **Surface**: Copilot's review overview comment; `pr-watch` and the seats' wait scripts; the
  merge door's grounds line.
- **Observed**: the overview prints "Findings: None" and lists items under "Previously missed"
  or in its summary sentence, with no review thread. A wait that counts unresolved threads
  reports a clean round. The door prints "tally body findings (SKILL item 2) before reading
  this round as zero-finding" and OCE's door does not read the body itself; JC.net's reads the tip-bound body for its headline verdict and suppressed count and holds on those (`suppressed-hold.ts`), and reads no "Previously missed" item.
- **Expected**: a round's body items are counted with its threads.
- **Candidate cure**: `pr-watch` reads the tip-bound review body for "Previously missed" and
  file-and-line items and reports their count beside the thread count; the door refuses a
  zero-finding reading while that count is above zero and no signed disposition names them.
- **Target surface**: agent-tools CLI (`pr-watch`, `merge-bot`).
- **Status**: open; four rounds on two pull requests, two seats.
- **Owner direction status**: standing

### F-274 — nothing flags a gendered pronoun for an agent at the moment it is written (2026-09-29)

- **Source**: the owner's word of 2026-09-29, at the end of a compaction order, recorded in OCE's
  estate-coordination thread and a handoff record: "STOP assigning gender to agents, I am sick
  of having to say that".
- **Surface**: `agents-default-no-gender` (both estates); the comms CLI, thread records, handoff
  records and commit messages.
- **Observed**: the rule was loaded and the owner still had to say it again; nothing reads the
  text a seat writes about another seat.
- **Expected**: the miswrite is caught at the write.
- **Candidate cure**: a validator over agent-authored records that flags he, she, him, her, his
  or hers in a sentence naming a registered seat identity (human referents stay out of scope),
  run by the record-append tool and the commit-msg hook.
- **Target surface**: agent-tools CLI (`collaboration-state`); `.husky/commit-msg`.
- **Status**: open; homed and recurred.
- **Owner direction status**: standing

### F-275 — a turn can end on a question to the owner, or a block on the owner, with no card (2026-08-19)

- **Source**: two owner words in OCE's records. Absorbed 2026-08-19: "never, EVER proclaim you
  are not going to do anything because you are blocked on me without raising a user card". At
  the end of a compaction order, 2026-09-17: "And when I say cards, I mean use the user question
  UI".
- **Surface**: `present-verdicts-not-menus` and `route-blocks-and-questions-to-director` (both
  estates), which name the question tool; the harness's turn end.
- **Observed**: both rules say a question reaches the owner as a card, never as prose, and
  questions still end turns as prose. On 2026-10-01 the consolidation seat held fourteen
  questions in report text with the owner away, because a card holds the turn until answered
  and `unattended-seats-never-prompt` forbids stopping on a prompt; it sent one push
  notification instead.
- **Expected**: the turn end carries the rule: a card when the owner is present, a push
  notification when the owner is away, and the question in the report text in both cases.
- **Candidate cure**: a Stop hook that refuses to end a turn whose final text carries an
  owner-directed question or a claim to be blocked on the owner when the turn made neither an
  AskUserQuestion call nor a push notification.
- **Target surface**: harness hooks; agent-tools hook policy.
- **Status**: open; homed and recurred.
- **Owner direction status**: standing

### F-276 — a pull request can be readied, and a test change committed, with no expert verdict on record (2026-09-29)

- **Source**: the owner's words of 2026-09-29 and 2026-09-30, recorded in JC.net's thread and
  handoff records: "use the testing expert and code expert subagent reviewers, you have clearly
  been decreasing the quality of the repo, breaking rules, creating rework and wasting time";
  "nothing about that test information was new, it is ALL written down in directives, in rules,
  in the test expert, so WHY were bad, wasteful tests written?"; and, of a test that pinned a
  setting, "And we never test for configuration."
- **Surface**: `invoke-code-experts`, `testing-strategy` and `test-immediate-fails` (both estates) and JC.net's `invoke-test-expert` (OCE has no such rule); the ready-for-review step of `pr-lifecycle`; the commit
  path.
- **Observed**: every rule the tests broke was loaded. Tests of configuration and of call
  sequences were written and committed with no reviewer run, three times in two days in one
  lane (2026-09-29 and 2026-09-30).
- **Expected**: the reviewer rules fire where the work leaves the seat.
- **Candidate cure**: the ready-for-review step, or a pull-request body check, refuses a body
  with no code-expert verdict line, and no test-expert line where test paths changed; the
  commit path refuses a commit staging test files, test helpers or test config whose message
  carries no test-expert verdict line; the test-expert checklist names fakes that branch on
  their own call arguments and assertions on our own configuration literals.
- **Target surface**: agent-tools CLI (`commit-queue`, `pr-watch`); `pr-lifecycle`; the
  test-expert template.
- **Status**: open; homed and recurred. The no-IO half is the no-IO test boundary plan's lint
  rule.
- **Owner direction status**: standing

### F-277 — OCE's merge door does not hold on Copilot's suppressed findings (2026-09-14)

- **Source**: the owner's standing word, recorded in OCE's continuity records: "ALWAYS fetch and
  analyse the suppressed Copilot comments along with the normal comments"; JC.net's hold landed
  from the owner's card of 2026-09-14.
- **Surface**: `pr-watch` and `merge-bot` (OCE); `pr-lifecycle`'s Copilot review policy.
- **Observed**: JC.net's door holds a round as SUPPRESSED-FINDINGS-OPEN until each suppressed
  finding carries a signed disposition. OCE's `pr-lifecycle` still says its door "does NOT yet
  consume the tally or disposition state" (read 2026-10-01), so in OCE the harvest depends on
  the skill passage being read.
- **Expected**: a tip-bound review body's suppressed count holds the merge in both estates.
- **Candidate cure**: port JC.net's hold (`suppressed-hold.ts`, the pr-watch state and its
  tests) and the skill sentence to OCE.
- **Target surface**: agent-tools CLI (`pr-watch`, `merge-bot`, OCE).
- **Status**: open.
- **Owner direction status**: standing

### F-278 — nothing stops a commit or a push after the owner's stop word (2026-09-29)

- **Source**: the owner's correction of 2026-09-29 to a Director, recorded in OCE's
  estate-coordination thread: "I said acknowledge and stop, not do a bunch of jobs then commit".
- **Surface**: `owner-signal-interpretation` §Stop Words Are Freezes (both estates); the Bash
  guard.
- **Observed**: the freeze reading was homed and the seat still ran jobs and committed after an
  acknowledge-and-stop word.
- **Expected**: the first write after a stop-class word meets the word.
- **Candidate cure**: a PreToolUse check on `git commit` and `git push` that, when the owner's
  latest prompt carries a stop-class instruction (acknowledge, stop, hold, pause), refuses once
  with a message quoting that prompt.
- **Target surface**: agent-tools hook policy.
- **Status**: open; homed and recurred (one instance after the home).
- **Owner direction status**: standing

### F-279 — a handoff record can be written without the assumption ledger PDR-063 asks for (2026-09-25)

- **Source**: the owner's word at two boundaries on 2026-09-25, recorded in OCE's handoff
  records: "Identify assumptions and highlight them".
- **Surface**: `session-handoff` (the record step) and the handoff record's shape, both estates;
  PDR-063.
- **Observed**: the ledger was written at those boundaries because the owner asked for it by
  name; the PDR clause is not in front of the seat when the record is written.
- **Expected**: the record's shape carries the ledger.
- **Candidate cure**: the handoff record shape gains an assumption-ledger heading, and the
  record step's check refuses a record without one.
- **Target surface**: `session-handoff`; agent-tools CLI (`collaboration-state`).
- **Status**: open.
- **Owner direction status**: standing
- **Instance, read 2026-10-01**: neither estate holds a `handoff-record.schema.json` or a worked
  example: the second tranche of the handoff-record decision (OCE's ADR-182), which was to land
  them, never landed, so PDR-063's four sections are the only statement of the record's shape and no
  check reads a record against it.

### F-280 — OCE's agent-tools smoke suites spawn processes and worktrees on every pre-push (2026-10-01)

- **Source**: the owner's word of 2026-10-01 on the agent-tools smoke suites (the runner runs 31 `*.smoke.ts` files in OCE and 39 in JC.net, read 2026-10-01; the record gave 40 and 53, the directories' file counts), recorded in OCE's continuity record: "is not acceptable, make a note that we need to
  move those into real tests with no IO and with DI".
- **Surface**: `agent-tools/smoke-tests/` and the pre-push hook (OCE). JC.net's no-IO test boundary plan does not yet name the conversion: its step 3 takes `smoke-tests/` out of the rule's scope by location.
- **Observed**: each push runs the suites, which create worktrees and child processes; OCE has
  no plan node that owns their conversion.
- **Expected**: each smoke is a no-IO test over injected fakes, or moves to validation.
- **Candidate cure**: convert suite by suite, test first, the same shape as JC.net's plan step;
  the owner assigned the code lanes to the implementer seat on 2026-10-01.
- **Target surface**: agent-tools tests (OCE).
- **Status**: open.
- **Owner direction status**: standing

### F-281 — the conformance run retains vendor output as it arrives; the redaction is decided and unbuilt (2026-09-11)

- **Source**: the owner's card answer of 2026-09-12, recorded in OCE's estate-coordination
  thread record: "redact at boundary, but do not touch any .env files".
- **Surface**: the MCP conformance run's retained output (OCE).
- **Observed**: the run keeps vendor output as it arrives. The decision is option C, redaction
  at the retention boundary as a property of the output's shape; an implementation that reads
  real secret values from env files to match against output is forbidden by the same word,
  because it would make the redactor a second secret-handling surface. A filesystem-type
  allowlist was refused.
- **Expected**: retained output is redacted at the boundary.
- **Candidate cure**: the delivery node the decision names. The owner paused it on 2026-09-12
  until the issue recurs, and said not to author the node speculatively.
- **Target surface**: agent-tools conformance tooling (OCE).
- **Status**: decided, unbuilt, paused by the owner until a retention incident recurs.
- **Owner direction status**: standing

### F-282 — the context meter's first read after a compaction describes the compaction call (2026-10-02)

- **Source**: this session's own readings on 2026-10-02 (63.9 % then 28.9 %; 0 % then 17 %), and
  `agent-tools/src/session-metadata/usage.ts`, read the same day in both estates.
- **Surface**: `agent-tools session-metadata`.
- **Observed**: `parseLatestUsage` returns the input and cache tokens of the latest transcript
  line that carries a usage object. A read made inside a turn therefore reports the previous
  assistant message, and the first read after a compaction reports the compaction call itself
  (the whole pre-compaction context) or a line with zero input. A thread-record entry carried
  63.9 % as the seat's context when the true figure was under 30 %, and a directive edit was
  nearly priced on it.
- **Expected**: a read that cannot describe the present context says so.
- **Candidate cure**: ignore usage lines at or before the transcript's latest compaction
  boundary and zero-sum usage lines, and print "no reading since the compaction" with a
  distinct exit until an assistant turn has been recorded after it. Until then the seat reads
  the meter twice, a few calls apart (PDR-052 directive floor).
- **Target surface**: agent-tools session-metadata (both estates).
- **Status**: open.
- **Owner direction status**: unsolicited

### F-283 — nothing sizes a file before a seat reads it whole (2026-10-02)

- **Source**: this session on 2026-10-02: a ledger of long rows, a plan block and two
  directory and grep listings were read unbounded within two hours of the seat writing "every
  listing gets a bound" into its napkin.
- **Surface**: the harness's file read and shell tools; the seat's habit.
- **Observed**: the read tool stopped the ledger read at its cap of 25,000 tokens, which is
  itself 2.5 % of the seat's context for one call; a directory listing and a grep for file
  names have no cap. The written lesson did not change the next read.
- **Expected**: a seat learns a file's size before it spends context on it.
- **Candidate cure**: a PreToolUse advisory that prints a file's byte size when a whole-file
  read is asked of a file over a threshold, and a shell habit the tool-facts reference now
  states (a line count or a heading list first).
- **Target surface**: hook policy (advisory), tool-facts reference.
- **Status**: open.
- **Owner direction status**: unsolicited

### F-284 — an SDK comment says an empty zod shape closes a tool's input schema; the conversion's default mode says otherwise (2026-10-02)

- **Source**: the consolidation seat on 2026-10-02, while curing a review finding on OCE's
  TypeScript gotchas.
- **Surface**: OCE's curriculum SDK, the no-input tool's definition module
  (`aggregated-curriculum-model/definition.ts`), and the MCP TypeScript SDK's zod
  compatibility module.
- **Observed**: the definition's TSDoc says an empty `ZodRawShape` produces
  `{ "type": "object", "additionalProperties": false }` through the SDK's `z.toJSONSchema()`. A
  probe on the workspace's zod 4.4.3 emits `additionalProperties: false` for an empty object
  with `io: 'output'` and omits it with `io: 'input'`. The MCP SDK's compatibility module
  passes `io: opts?.pipeStrategy ?? 'input'`. The served schema was not read.
- **Expected**: the comment states what the wire carries, proven by one observation of the
  served `tools/list`.
- **Candidate cure**: read the served `inputSchema` of the no-input tool once; if it is open,
  make the shape strict or true the comment.
- **Target surface**: OCE's curriculum SDK (a code lane).
- **Status**: open; routed to the code lanes.
- **Owner direction status**: unsolicited

### F-285 — the review-cost gate did not list the last settlement head of two pull requests (2026-10-02)

- **Source**: the consolidation seat on 2026-10-02, reading the gate after three merges to
  write their ledger rows.
- **Surface**: OCE's review-cost gate (the agent-tools topic that prices a pull request's
  rounds).
- **Observed**: for pull request 329 the gate reported "rounds 2 (opening plus 1 settlement)"
  and listed two heads, where the pull request has three commits and its third was the second
  settlement push. For 330 it reported "rounds 1 (opening plus 0 settlement)" and listed one
  head, where a second commit was its one settlement push. For 331 it listed all three heads.
  In both missed cases the last push changed directive files only; whether that is the cause
  was not read from the gate's code.
- **Expected**: every pushed head after the opening is a priced round, or the gate says which
  heads it leaves out and why.
- **Candidate cure**: read the gate's round enumeration against these two pull requests; cure
  the enumeration or document the exclusion in its output.
- **Target surface**: OCE's agent-tools review-cost gate (a code lane).
- **Status**: open; routed to the code lanes. Two instances.
- **Owner direction status**: unsolicited

### F-286 — the commit-queue guard serialises one estate-wide queue and refuses scoped index/head labels that the commit skill still describes (2026-10-02)

- **Source**: a claim set aside at the records reading of 2026-10-02 (the two-estate thread
  record's write-list entry), code-checked in both estates the same day; every line named
  below was read.
- **Surface**: `agent-tools/src/commit-queue/core.ts`, `guard.ts`; the commit skill
  (`.agent/skills/change-custody/commit/SKILL-CANONICAL.md`).
- **Observed**: `getFreshEntriesAhead` (core.ts lines 38–56) returns every fresh active entry ahead
  of an intent in one global queue and the guard refuses with "fresh queue entries ahead" (guard.ts
  64–73); `claimCoversGitIndexHead` accepts only a git-kind area whose patterns include the bare
  `index/head` (guard.ts 130–135). The skill's merge-path text still tells a worktree seat to claim
  `git:index/head@<worktree-name>`, which the same skill's scope ruling (worktree lanes commit by
  pathspec with no queue; F-132, F-139 and F-169 superseded by scope) and the guard refuse.
- **Expected**: the skill describes the queue's scope once, and its instruction agrees with what
  the guard accepts.
- **Candidate cure**: rewrite the skill's merge-path lines to the scope ruling; the guard stands.
- **Target surface**: the commit skill (docs).
- **Status**: open; a doctrine lane.
- **Owner direction status**: unsolicited

### F-287 — `agent spawn` builds before it opens the draft pull request, and a failed build leaves the worktree unbuilt with no pull request (2026-10-02)

- **Source**: a claim set aside at the records reading of 2026-10-02 (the two-estate thread
  record's write-list entry), code-checked in both estates the same day; every line named
  below was read.
- **Surface**: `agent-tools/src/spawn/cli.ts`, `build.ts`, `create.ts`.
- **Observed**: `prepareWorktree` runs the build (cli.ts lines 114–129) and returns on error before
  `openPr`; the `@remarks` at 103–107 say so. Neither `build.ts` nor `cli.ts` removes the worktree
  on failure; the resume path (create.ts 190–197) rebuilds and, per cli.ts 98–100, skips opening
  the pull request.
- **Expected**: a lane whose build fails still has its draft pull request, or its worktree is
  removed and the failure says so.
- **Candidate cure**: open the draft before the build, or remove the worktree on build failure and
  report it; the resume path opens the pull request when none exists.
- **Target surface**: agent-tools spawn (a code lane).
- **Status**: open.
- **Owner direction status**: unsolicited

### F-288 — `baseBranchOf` strips the first path segment of a base branch name, right for `origin/<branch>` and wrong for a base with no remote prefix (2026-10-02)

- **Source**: a claim set aside at the records reading of 2026-10-02 (the two-estate thread
  record's write-list entry), code-checked in both estates the same day; every line named
  below was read.
- **Surface**: `agent-tools/src/spawn/open-pr.ts` lines 32–34 (`base.replace(/^[^/]+\//u, '')`).
- **Observed**: `origin/release/1.0` becomes `release/1.0`; `release/1.0` becomes `1.0`.
- **Expected**: a base given without a remote is used as given.
- **Candidate cure**: strip the segment only when it names a configured remote.
- **Target surface**: agent-tools spawn (a code lane).
- **Status**: open.
- **Owner direction status**: unsolicited

### F-289 — the 250-line `max-lines` error leaves a file at 249 lines one line of headroom, and nothing reports near-cap files (2026-10-02)

- **Source**: a claim set aside at the records reading of 2026-10-02 (the two-estate thread
  record's write-list entry), code-checked in both estates the same day; every line named
  below was read.
- **Surface**: the ESLint recommended configuration's `max-lines: ['error', 250]` (JC.net
  `tooling/eslint/src/configs/recommended.ts`; OCE `packages/core/oak-eslint/src/configs/recommended.ts`);
  `agent-tools/src`.
- **Observed**: files at 249 lines in both estates (`pr-watch/index.ts`, `merge-bot/push-cli.ts`,
  `collaboration-state/cli-comms-watch.ts`, and others); the next one-line edit pays an extraction.
- **Expected**: a near-cap file is known before the edit that trips the cap.
- **Candidate cure**: a warn tier at about 230 beside the error at 250, or a repo-check that lists
  files within ten lines of the cap.
- **Target surface**: the lint configuration (a code lane).
- **Status**: open (low).
- **Owner direction status**: unsolicited

### F-290 — `ClaimArea.kind` is a closed five-value union in the collaboration-state types, parser and schema, and a plain string where the commit queue reads the same claims (2026-10-02)

- **Source**: a claim set aside at the records reading of 2026-10-02 (the two-estate thread
  record's write-list entry), code-checked in both estates the same day; every line named
  below was read.
- **Surface**: `agent-tools/src/collaboration-state/types.ts` line 30, `state-parsers.ts` 204–215,
  `cli-claim-areas.ts` 33–38, `schemas/active-claims.schema.json` 301–303;
  `agent-tools/src/commit-queue/types.ts` 40–43.
- **Observed**: a sixth kind is refused with "unsupported claim area kind" at every
  collaboration-state boundary; the commit queue's `CommitQueueClaimArea.kind` is `string`,
  compared against the literal `'git'`.
- **Expected**: one declared set of kinds, read through one type, extended in one place.
- **Candidate cure**: export the union from the collaboration-state types and import it in the
  commit queue.
- **Target surface**: agent-tools types (a code lane).
- **Status**: open.
- **Owner direction status**: unsolicited

### F-291 — `worktree-hygiene` §8 says `comms watch` needs `--comms-dir` passed explicitly from a worktree; the CLI defaults it and refuses it alone (2026-10-02)

- **Source**: a claim set aside at the records reading of 2026-10-02 (the two-estate thread
  record's write-list entry), code-checked in both estates the same day; every line named
  below was read.
- **Surface**: `.agent/rules/worktree-hygiene.md` §8; `agent-tools/src/collaboration-state/comms-watch-paths.ts`
  lines 69–84, `cli-spec-help.ts` 104–105.
- **Observed**: the rule's sentence is true for `comms list` and `comms inbox`
  (`required(options, 'comms-dir')`) and false for `comms watch`, where `--comms-dir` and
  `--seen-file` are accepted only as a pair and both omitted default to the coordination home.
- **Expected**: the rule says what each command takes.
- **Candidate cure**: one clause in §8 for `watch`.
- **Target surface**: the rule (docs).
- **Status**: open; a doctrine lane.
- **Owner direction status**: unsolicited

### F-292 — `comms watch` and the claims commands take `--platform` and `--model` as free text, and nothing compares the watcher's tuple with the registry row's (2026-10-02)

- **Source**: a claim set aside at the records reading of 2026-10-02 (the two-estate thread
  record's write-list entry), code-checked in both estates the same day; every line named
  below was read.
- **Surface**: `cli-identity.ts` lines 12–26, `cli-self-identity.ts` 73–87, `identity.ts` 77–107,
  `active-agent-routing.ts` 53–62, `watcher-presence.ts` 86–92, all under
  `agent-tools/src/collaboration-state/`.
- **Observed**: `resolveIdentity` copies the caller's `--platform` and `--model` into the tuple while
  `id` and `session_id_prefix` derive from the seed; `sameAgentRoutingKey` compares `id` only and
  `presentIfThisSession` uses it, so `assert-watcher-live` never compares platform or model (the
  mechanism behind F-174).
- **Expected**: an arm whose platform or model differs from the registry row for the same `id` is
  refused or reported.
- **Candidate cure**: compare the tuple in `presentIfThisSession` and name the difference in the
  assert's output.
- **Target surface**: agent-tools collaboration-state (a code lane), beside F-174.
- **Status**: open.
- **Owner direction status**: unsolicited

### F-293 — no authoring-time check requires the agent attribution trailer or the bot signature on a commit or a GitHub write (2026-10-02)

- **Source**: a claim set aside at the records reading of 2026-10-02 (the two-estate thread
  record's write-list entry), code-checked in both estates the same day; every line named
  below was read.
- **Surface**: `commitlint.config.mjs`, `.husky/commit-msg`, `.agent/hooks/policy.json`; the rule
  `identify-as-agent-under-shared-credentials` §Enforcement.
- **Observed**: commitlint extends the conventional configuration only; the commit-msg hook runs the
  version guard and commitlint; no `Co-Authored-By` or signature check exists in the hooks, the lint
  or the agent tools; the rule says "There is no write-time hook today".
- **Expected**: a missing trailer or signature is caught where the commit or the write is authored.
- **Candidate cure**: a commitlint rule for the trailer on agent-authored commits; a check for the
  signature line in the bot's write path.
- **Target surface**: commit hooks and agent-tools (a code lane).
- **Status**: open; the rule records the gap.
- **Owner direction status**: unsolicited

### F-294 — `verify-vendor-call-shapes-at-plan-author-time` fires on a plan body and names the plan author; a brief authored outside a plan is not covered (2026-10-02)

- **Source**: a claim set aside at the records reading of 2026-10-02 (the two-estate thread
  record's write-list entry), code-checked in both estates the same day; every line named
  below was read.
- **Surface**: `.agent/rules/verify-vendor-call-shapes-at-plan-author-time.md` lines 8–10.
- **Observed**: the fire condition reads "When a plan body pins the call shape of an external
  dependency … the plan author MUST verify"; the file has no clause for a brief, a dispatch packet
  or a prompt, and a pre-authored brief that pinned a vendor call shape went unchecked (the records
  reading's instance).
- **Expected**: any authored text that pins a vendor call shape for another seat to execute is
  checked at its authoring.
- **Candidate cure**: extend the fire condition to briefs and dispatch packets.
- **Target surface**: the rule (docs).
- **Status**: open; a doctrine lane.
- **Owner direction status**: unsolicited

### F-295 — the pre-commit markdown-links validator walks the gitignored session directory under `.agent/state/collaboration/` (2026-10-02)

- **Source**: Hazel tracks Trunk, first-hand, the records commit of 18:2xZ on the coordination
  branch of 2026-10-02 (refused once; landed on the rerun as SHA:8e2b84150).
- **Surface**: `agent-tools/src/validators/markdown-links/validate-markdown-links.ts`, run by the
  pre-commit repo-validator chain.
- **Observed**: the validator scanned 4,708 files, among them two scratch copies of the exchange
  plan under the gitignored `comms-analysis-*/session-*/` directory (`.agent/state/collaboration/
  .gitignore`, the `comms-analysis-*/` line), whose relative link resolves from the plan's own
  directory and not from the copy's; it refused the commit as BLOCKING on two broken links in files
  no commit carries. Cost: one commit-queue window abandoned and its claim closed, the copies
  removed by hand in both estates and the scratchpad, one gate rerun.
- **Expected**: a pre-commit validator reads the tracked universe (`git ls-files`), never the
  working tree's ignored directories; a file no commit can carry cannot refuse a commit.
- **Candidate cure**: compute the validator's universe from `git ls-files` (JC.net's markdownlint
  configuration states the discipline: the universe is the tracked tree, computed from `git
  ls-files`, and the configuration declares only ownership), or honour `.gitignore` in the walk;
  JC.net's copy of the validator is read for the same walk before the cure is scoped.
- **Target surface**: the validator (code).
- **Status**: open; a code lane.

### F-296 — `session-metadata` derives the transcript directory from the working directory's project path, so a linked worktree reads nothing (2026-10-14)

- **Source**: the consolidation seat's notebook blocks of 2026-10-14 (on lane
  `docs/consolidation-3` in a linked worktree, working this estate non-resident), the same day in
  both estates.
- **Surface**: `agent-tools session-metadata` (the project-directory derivation in its usage
  reader).
- **Observed**: from a lane worktree the command looked under a worktree-named project directory
  and failed ENOENT; the seat read the context meter from the transcript's newest assistant usage
  under the primary's project directory instead.
- **Expected**: the command reads the session's transcript wherever the session runs, from a
  linked worktree included.
- **Candidate cure**: a `--project-dir` option, defaulting to the primary checkout's project
  directory when the working directory is a linked worktree (`git rev-parse --git-common-dir`).
- **Target surface**: agent-tools session-metadata (both estates).
- **Status**: open; the gotchas reference carries the workaround.
- **Owner direction status**: unsolicited (a seat's tool friction).

### F-297 — `commit-queue complete` accepts an intent the guard refused, so a chained ceremony records a landing that never happened (2026-10-17)

- **Source**: the reviewer seat's napkin block of 2026-10-17T14-15Z (Walrus seeks Maelstrom,
  9585cc), on the primary checkout of this estate; registered at the wrap of 2026-10-19.
- **Surface**: `agent-tools commit-queue` (`complete`).
- **Observed**: the guard refused the records intent (the window claim named was the lane's files
  claim, not the bare `git:index/head` claim the ceremony opens first); the seat's chained
  `complete` then closed the refused intent 11090648 as if a commit had landed, a false queue
  record corrected only in the napkin.
- **Expected**: `complete` refuses an intent that never reached `pre_commit` or carries no commit,
  naming the phase it found, so a chain cannot record a landing that did not happen.
- **Candidate cure**: `complete` reads the intent's phase and refuses (exit 2) unless the phase is
  `pre_commit` with the staged fingerprint verified, or a commit SHA is supplied and
  `git cat-file -e` finds it; a refused guard moves its intent to `abandoned` itself (the F-172
  shape), so the seat's chain has nothing left to complete.
- **Target surface**: agent-tools commit-queue (both estates).
- **Status**: open.
- **Owner direction status**: unsolicited (a seat's tool friction).
