# Frictions register, the entries settled as verified on 2026-09-30

Moved byte-identical from `.agent/memory/operational/frictions-register.md` §Friction Entries on 2026-09-30 by the two-estate consolidation (Hawthorn binds Bracken, b3f117), by the lifecycle in `continuity-practice.md` §Disposition of Continuity Surfaces: each entry was read whole by an analyst, its cure verified in the tree at the surface it names, the verification re-read by the seat, and any lesson it carried written into a permanent home before the move. The register's §Settled entries keeps one index row per id.

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
- **Target surface**: commit protocol docs / `.agent/skills/change-custody/commit/` /
  collaboration-state comms tooling / possible PDR-059 follow-on.
- **Status**: open — evidence captured; no cure landed.
- **Owner direction**: standing.
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
  protocol documentation in `.agent/skills/change-custody/commit/SKILL-CANONICAL.md`
  Pre-Commit Validation section and a CLI warning in `verify-staged`
  if active-claims.json shows `MM` after `record-staged`.
- **Target surface**: `agent-tools/src/commit-queue/`;
  `.agent/skills/change-custody/commit/SKILL-CANONICAL.md`; commit-queue CLI help
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
  [`current/skills-standardisation-and-adapter-generator.plan.md`](../../plans-backlog-2026-07/agent-tooling/current/skills-standardisation-and-adapter-generator.plan.md) —
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
  [`current/cost-of-collaboration.plan.md`](../../plans-backlog-2026-07/agent-tooling/current/cost-of-collaboration.plan.md):
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
- **Long-form analysis**:
  [`comms-watch-drain-timeout-analysis-2026-06-29.md`](../../reports/comms-watch-drain-timeout-analysis-2026-06-29.md)
  (Kraken spins Headland; adversarially verified, sources re-checked first-hand) —
  confirms the per-cycle full-dir O(total) read+parse+validate against source, and
  **corrects the cause**: a busy session's drain-deaths at ~2600 files were per-file
  I/O contention under host load (corpus +1.28% while the exceeded deadline tripled),
  NOT corpus size (the size→death link was FH-retracted — `kern.boottime`-confounded).
  So cure (c) "dir-size-scaled budget" aims at the wrong variable; the lesson is keep
  budgets SHORT + fail-fast-restart. The safe incremental-read home is
  [`comms-watch-storage-redesign.plan.md`](../../plans-backlog-2026-07/agent-tooling/current/comms-watch-storage-redesign.plan.md)
  WS2's mtime-watermark, not a naive `created_at` cursor (the seen-set does not backstop
  unread files → silent-miss).
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
### F-67 — Forename-keyed `/tmp` filenames collide across same-forename agents

- **Source**: distilled; graduation drain 2026-06-16 (Skunk hunts Crescent) — quorum-rescued from a reject.
- **Surface**: `/tmp` scratch-file naming in multi-agent shared-checkout sessions.
- **Observed**: forename-keyed `/tmp` filenames (e.g. `/tmp/skunk-foo.txt`) collide across agents that share a forename in the naming wordlist, clobbering each other's temp files.
- **Expected**: temp-file names are agent-unique within a shared checkout.
- **Candidate cure**: identity-qualified temp names — `<forename>-<surname-word>-<purpose>-<date>` or include the `session_id_prefix`; optionally an agent-tools temp-path helper that returns an identity-qualified scratch path.
- **Target surface**: agent temp-file naming convention; optional agent-tools scratch-path helper.
- **Status**: open.
- **Owner direction status**: unsolicited.
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
### F-91 — session shell cwd resets to the primary checkout after every command (worktree commands silently run in the shared tree)

- **Source**: Swordfish tracks Driftwood (`4fe4cf`), 2026-06-24 worktree-pilot WS-B team-start (relayed to Director Snowdrop calls Topsoil `f07539`)
- **Surface**: harness Bash-tool cwd behaviour under the worktree-per-agent model
- **Observed**: an Implementer session intended to operate in its worktree has its shell cwd reset to the primary checkout after every command. A bare `pnpm test` (or any worktree-scoped command) therefore runs in the **shared primary tree** — the exact F-83 coupling worktrees exist to dissolve — unless every command is cd-prefixed or uses absolute paths. Compounds F-87 (no launch-in-worktree) and F-90 (no worktree bring-up).
- **Expected**: a worktree-bound session keeps its cwd in the worktree across commands, so worktree-scoped work cannot accidentally touch the primary tree.
- **Candidate cure**: a worktree-aware launcher that pins cwd to the worktree for the session; until then, a documented hard rule that every worktree command is cd-prefixed or absolute-pathed, surfaced in the worktree-per-agent transition plan.
- **Target surface**: launch tooling / `worktree-per-agent-transition.plan.md` (operating discipline)
- **Status**: open — worktree-transition evidence
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
- **Status**: partially-addressed — the **derived read-view** landed 2026-06-28 (PR #286, merge commit `39526a7e1`; feature `9a4274667` "derive cross-worktree work-state view"), projecting git ground truth (worktree/branch) + watcher-mtime liveness as a single read surface rather than asking agents to author it. The **decision-class unified registry REMAINS OPEN** (whether/how to build the authoritative agent-work-state model that reconciles or retires the divergent surfaces — the register names the decision, it does not make it). Strongly related to F-10 (identity model), F-69 (stale-state sweep — liveness reconciliation), F-95 (watcher-presence gate — same liveness signal), and the `worktree-per-agent-transition` plan. Resolves Decision Lens #4 ("would it be simpler if the system changed?") with **yes**.
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
### F-101 — Comms watchers outlive their agent and accumulate as orphan processes (no self-termination)

- **Source**: Hawthorn rides Foliage (`a1fb02`) + owner, 2026-06-27 — at owner-directed retirement, a clean-shutdown check found ~44 `comms watch` processes on the host and required manually proving none were orphaned Hawthorn watchers (the Monitor task had ended cleanly, but several watchers had been stopped/re-armed during the session). Owner: "we are accumulating dead watchers."
- **Surface**: `pnpm agent-tools:collaboration-state -- comms watch` run via the host's persistent background mechanism (`Monitor` on Claude Code); the [`comms-all-channels-watcher`](../../rules/comms-all-channels-watcher.md) rule; host process cleanup on session end.
- **Observed**: a watcher is a long-running process spawned per session and often re-armed several times. When the agent session ends — or the supervising wrapper is killed but the node grandchild is reparented (pnpm → node, SIGTERM not forwarded) — the watcher process can linger indefinitely. It consumes host resources and, because it keeps writing the F-95 heartbeat file, signals **false liveness** for an agent that has retired. Across a multi-agent day these accumulate, and disambiguating live from dead watchers (per agent) becomes manual and error-prone.
- **Cure shipped (basic)**: wrap the canonical watcher invocation in GNU `timeout`/`gtimeout` (default 3600 s) — see the [`comms-all-channels-watcher`](../../rules/comms-all-channels-watcher.md) canonical command and the README `timeout` prerequisite. Every watcher self-terminates after a fixed period; a live agent re-arms it on the Monitor exit-notification (the `--seen-file` cursor means no events are missed, only delayed by the re-arm), while a dead agent does not — so orphans cannot outlive the timeout. Runs un-guarded if coreutils is absent (no hard break). Dogfood-verified by re-arming the watcher under the wrapper — which caught a real bug: the first cut used a `${VAR:+$VAR 3600}` prefix that **zsh does not word-split** (it tried to exec a binary literally named `timeout 3600`, exit 127); fixed to a `set -- …; [ -n "$TB" ] && set -- "$TB" 3600 "$@"; exec "$@"` argv build that is zsh-safe, portable, and graceful.
- **Robust follow-up (the owner's "stay-alive signal" model)**: a renewable **lease** — the watcher self-terminates if an agent-renewed lease file goes stale beyond a TTL, the lease renewed automatically by a `Stop` hook so the agent's turn-completion is the stay-alive signal. This removes the basic timeout's periodic re-arm gap and ties watcher lifetime directly to agent liveness (and makes the F-95 heartbeat truthful again, since the watcher can no longer outlive its agent). **Superseded for the orphan problem by the supervisor-death cure shipped in PR #270 (see Status); retained here as the owner's original model and as a still-valid alternative if the `--supervisor-pid` mechanism ever needs a turn-completion complement.**
- **Caveat (both cures)**: `timeout` signals only its direct child; verify the pnpm wrapper forwards SIGTERM to the node watcher, else invoke node directly under `timeout` or use process-group termination — otherwise the node grandchild can still orphan when the wrapper is signalled.
- **Target surface**: [`comms-all-channels-watcher`](../../rules/comms-all-channels-watcher.md) (wrapped command — basic cure shipped here); `agent-tools/src/collaboration-state/cli-comms-commands.ts` (a future `--lease-file` / `--lease-ttl-ms` flag); the host hook layer (`Stop` hook lease renewal). Relates to F-95 (watcher-presence gate — same false-liveness signal) and F-99 (observer mode — same watcher lifecycle).
- **Status**: ADDRESSED 2026-06-28 (PR #270 `feat(agent-tools): self-exit orphaned comms watchers on supervisor death`, commit `b46089fe4`, squash-merged to `main`). `comms watch --supervisor-pid <pid>` makes the watcher self-exit within one poll cycle of the supervising agent process dying — closing the crash/SIGKILL orphan path that GNU `timeout`'s group-kill misses (clean teardown already group-kills; proven no-regression). This **supersedes the lease-on-`Stop`-hook follow-up above for the orphan problem specifically** (supervisor-death detection ties watcher lifetime to agent liveness more directly than a renewed lease). **NARROW** — NOT superseded, still open: process-group termination (the SIGTERM-forwarding caveat below) and the F-43 stale-process census remain separate concerns. Residual operational friction observed this session: the basic 3600s `timeout` and the 60s drain step-timeout still fire under multi-agent comms volume (re-arm-on-notification + `--step-timeout-ms 180000` are the interim mitigations).
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
### F-104 — F-95 watcher-presence gate false-negatives despite a live heartbeat file

- **Source**: Hawthorn rides Foliage (`a1fb02`) post-#259 handoff, 2026-06-27 — flagged
  for capture-if-not-homed; this is the inverse of the F-95 gate it created.
- **Surface**: the F-95 watcher-presence gate — `comms assert-watcher-live` (move-1
  check) and the `claims open` blind-write backstop; `cli-comms-assert-watcher-live.ts`
  / `claims-open-watcher-gate.ts`.
- **Observed**: with the all-channels watcher re-armed (`--heartbeat-file <seen>.heartbeat.json
  --heartbeat-interval-ms 30000`) and the heartbeat file present at the exact path the gate
  names with a *fresh mtime*, `claims open` still refused with "no comms watcher heartbeat …
  watcher not running." A live, event-delivering watcher could not open a claim — a gate
  false-negative.
- **Expected**: when a fresh heartbeat file exists at the path the gate inspects, the gate
  passes; a live watcher is never reported as absent.
- **Candidate cure**: not root-caused. Two hypotheses — (a) the gate's freshness window is
  tighter than the file mtime, or (b) a path-derivation mismatch on the spaced display-name
  (the F-88 quoting/filesystem-id family). Re-arm a watcher, confirm the heartbeat path the
  watcher writes vs the path the gate reads, and reconcile.
- **Target surface**: `agent-tools/src/collaboration-state/cli-comms-assert-watcher-live.ts`,
  `claims-open-watcher-gate.ts`. Adjacent to F-95 (the gate), F-99, and F-88 (display-name
  vs filesystem-id).
- **Status**: open — captured from handoff; not root-caused.
- **Owner direction status**: standing (record-all-frictions, event `2dbd74f6`).
### F-107 — PreToolUse hook substring-blocks SAFE, non-destructive git forms

- **Source**: team-tooling session 2026-06-28 (multiple agents: `git switch -c` used in place of a
  blocked `git checkout -b`; `git restore --staged`; `git reset -- <paths>`; merge-in used in place
  of a blocked `git push --force-with-lease`); graduated by Quoll's dedicated consolidation
  2026-06-29. Broader sibling of F-102 (push `-f` substring) and F-103.
- **Surface**: the `PreToolUse` policy hook (`.agent/hooks/policy.json`) substring matcher, at the
  hook-policy CODE level (distinct from the `hook-policy-substring-discipline` rule, which governs
  agent-authored CONTENT).
- **Observed**: the substring matcher blocks legitimately non-destructive git operations because a
  forbidden substring appears: `git checkout -b <new> <start>` (creates a branch on a clean tree —
  safe; blocked by `git checkout`); `git restore --staged <path>` (index-only unstage — safe;
  blocked by `git restore`); `git reset -- <paths>` (unstage — safe; blocked by `git reset`);
  `git push --force-with-lease` (blocked by `git push --force`). Agents pay a re-edit each time and
  must rediscover the safe forms.
- **Expected**: the hook distinguishes destructive from non-destructive forms by parsing the git
  subcommand + flags, not by substring.
- **Candidate cure**: parse-don't-substring at the hook-policy level — allow `git switch -c`,
  `git restore --staged` (when `--worktree`/`-W` absent), `git reset -- <paths>` (index-only),
  `git -C <wt> -c core.editor=true rebase`; keep blocking the genuinely-destructive forms. Interim:
  document the safe forms so agents reach for them directly (`switch -c`, `restore --staged`,
  merge-in not force-push).
- **Target surface**: `.agent/hooks/policy.json` matcher; the safe-form documentation.
- **Status**: open.
- **Owner direction status**: standing (record-all-frictions, event `2dbd74f6`).
### F-114 — `commit-queue verify-staged` cannot represent a staged rename

- **Source**: napkin 2026-07-03 (Mistral seeks Jetstream) — a staged `git mv` during the
  F-112 landing.
- **Surface**: `commit-queue` intent/staged bundle comparison (`verify-staged`,
  pathspec-scoped commit).
- **Observed**: a staged rename records an `R100\told\tnew` name-status line which the
  bundle comparison parses as one path, so an intent naming both rename sides fails
  verify ("missing: <old>") and an intent naming only the new side would split the
  rename at pathspec-commit time.
- **Expected**: a staged rename verifies against an intent naming both sides (or the
  documented canonical side) and commits atomically.
- **Candidate cure**: teach the bundle parser and pathspec narrowing the `R` name-status
  entry shape. Lossless workaround used this instance: two workflow commits (add the
  copy, then delete the original) — proper-path, no bypass.
- **Target surface**: `agent-tools/src/` commit-queue staged-bundle parsing.
- **Status**: open.
- **Owner direction status**: standing (record-all-frictions).
### F-115 — comms-seen heartbeat path derivation diverges: CLI uses the display name verbatim; the rule doc and legacy files model kebab-case

- **Source**: napkin 2026-07-03 (Mistral seeks Jetstream); corroborated by rescued
  discovery candidate C140 (2026-07-02 salvage — coordination surfaces keying on display
  name corrupt under rename/same-name sessions; instances post-date the PDR-027
  name-plus-UUID amendment, a fires-despite-home signal at the tooling layer).
- **Surface**: `comms assert-watcher-live`, the `claims open` F-95 backstop, the
  `comms-all-channels-watcher` rule §Seen-file convention, `comms-seen/` legacy files.
- **Observed**: the CLI derives the heartbeat path from the DISPLAY name verbatim
  (`Mistral seeks Jetstream.json.heartbeat.json`) while the rule doc's convention section
  and every pre-existing seen-file model kebab-case (`vanilla-stirs-spore.json`).
  `claims open` has no path override by design, so a kebab-case-armed watcher passes
  assert (via `--heartbeat-file`) yet still blocks the claim.
- **Expected**: one convention, derived in one place, keyed on the stable identity (the
  PDR-027 UUID or a deterministic slug), not the mutable display name.
- **Candidate cure**: either the CLI kebab-cases (and migrates legacy files) or the rule
  doc + legacy files adopt display-name — decided once, with the rename-stability
  argument favouring a UUID-anchored or slug-derived path. Working cure until then: arm
  the watcher with the display-name `--seen-file` (quoted).
- **Target surface**: `agent-tools/src/collaboration-state/` seen-path derivation +
  `comms-all-channels-watcher.md` §Seen-file convention.
- **Status**: open.
- **Owner direction status**: standing (record-all-frictions).
### F-118 — comms-watcher heartbeat path convention: the assert derives the display-codename path; kebab seen-files fail the liveness check

- **Source**: Sardine spins Estuary, 2026-07-03 (n=2 re-entry) — three watcher
  restarts before `assert-watcher-live` went green.
- **Surface**: `comms watch` + `comms assert-watcher-live` + the `claims open`
  comms-blind refusal gate (all key on the heartbeat location).
- **Observed**: `assert-watcher-live` derives the expected heartbeat from the
  session display codename verbatim — `comms-seen/Sardine spins
  Estuary.json.heartbeat.json` (spaces, capitals) — while a watcher started
  with a kebab-case `--seen-file` writes its heartbeat elsewhere, so the
  assert reports "watcher not running" against a running watcher. Peer
  sessions' seen-files in the same directory are kebab-case
  (`vanilla-stirs-spore.json`), so the convention is inconsistent across
  sessions or the assert derivation changed. Adjacent paper cut: `comms send`
  accepts no `--kind` / `--session-prefix` flags (title/body/platform/model +
  `--tag` only); nearby examples drift from the live CLI surface.
- **Expected**: one canonical seen-file/heartbeat naming, derived by a single
  shared function in the watcher, the assert, and the claims gate — or
  `comms watch` defaults its seen-file to the assert's derived path so
  conformance is automatic.
- **Workaround (verified)**: start the watcher with the display-name seen-file
  (`--seen-file ".../comms-seen/<Display Name>.json"`), or pass
  `--heartbeat-file` explicitly to the assert.
- **Candidate cure**: shared path-derivation function consumed by watcher,
  assert, and claims gate; align legacy kebab files at the next curator pass.
- **Target surface**: `agent-tools/src/collaboration-state/` comms watch /
  assert-watcher-live path derivation.
- **Status**: open.
- **Owner direction status**: standing (record-all-frictions).

---
### F-161 — no tool mints the coordination successor-branch name

- **Source**: owner question 2026-08-17 ("why is the branch name missing
  its uuid, are we missing a rule, and tool?") after the Director cut
  `coordination/estate-2026-08-17` by following the fold skill's literal
  (wrong-since-birth) name form.
- **Surface**: coordination-fold ceremony step 9; no agent-tools action
  exists for it.
- **Observed**: the convention — `coordination/<utc-date>-<sha6 of the
  post-fold tip>` — is deliberate owner policy (multi-checkout
  collision safety on a real repo) and WAS automated as a mechanical
  recipe (`date -u +%F` + `git rev-parse --short=6 origin/main`), but
  the recipe was carried in continuity records only; the skill's step 9
  named a different, wrong form since the skill's birth. Automation
  that lives outside the doctrine home is invisible to a
  literal-reading seat — the same failure class as F-162's session
  (hand-rolling what is already built).
- **Expected**: the doctrine home carries the automation. Cured
  same day: the recipe one-liner now lives verbatim in the skill's
  step 9.
- **Candidate cure (optional hardening)**: lift the recipe into a named
  action beside the merge-bot's REST-merge helper (which holds the
  merge sha at the right moment), so the mint is one command with a
  typed refusal on a dirty premise.
- **Target surface**: `.agent/skills/coordination-fold/SKILL-CANONICAL.md`
  (done); `agent-tools/src/merge-bot/` (optional).
- **Status**: mitigated 2026-08-17 (recipe in the skill); named action
  optional.
