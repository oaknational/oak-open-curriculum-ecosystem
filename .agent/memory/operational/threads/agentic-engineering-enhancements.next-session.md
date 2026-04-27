# Next-Session Record — `agentic-engineering-enhancements` thread

**Last refreshed**: 2026-04-27 (Prismatic Waxing Constellation / codex /
gpt-5.5 — owner-directed intent-to-commit queue implementation plus
`jc-session-handoff` and `jc-consolidate-docs`. The future queue plan was
promoted to current execution, `active-claims` schema v1.3.0 now has a root
advisory `commit_queue`, and `scripts/commit-queue.mjs` verifies FIFO position,
exact staged files, staged fingerprint, and commit subject before durable
history is written. No staging or commit was performed. Final observed staged
index is clear; unrelated dirty work remains outside this claim.)

**Prior refresh**: 2026-04-27 (Fragrant Sheltering Pollen / codex /
gpt-5.5 — `jc-session-handoff` + `jc-consolidate-docs` after dropping the
experimental Codex app-server thread-title adapter. `@oaknational/agent-tools`
gates passed after preserving stable `CODEX_THREAD_ID` naming as the
load-bearing value. A live commit-window collision landed the Codex
stable-name row inside commit `2ccefad4` under another message, then `HEAD`
advanced again to `21abd2d4`; owner directed this to be recorded as concrete
evidence that the next implementation needs a first-class advisory
intent-to-commit queue.)

**Prior refresh**: 2026-04-27 (Composer / cursor — `jc-session-handoff` after
Cursor composer identity: `.cursor/hooks.json` + `oak-session-identity.mjs`
(`session_id` → `OAK_AGENT_SEED`, derived display name, `user_message`,
gitignored `.cursor/oak-composer-session.local.json` with
`suggestedComposerTabTitle`). Docs/rules/tests updated. Official
[Hooks](https://cursor.com/docs/hooks) `sessionStart` output has no tab-title
field — human rename or future Cursor API. Working tree; commit
owner-gated.)

**Prior refresh**: 2026-04-27 (Celestial Waxing Eclipse / codex / GPT-5 —
lightweight handoff after answering whether deterministic Codex names can be
shown in a title/status surface. The session confirmed `CODEX_THREAD_ID`
remains the stable seed, this thread title is now set to
`Celestial Waxing Eclipse`, and official CLI/TUI surfaces support `/title`
and `/statusline`. Owner asked to use the CLI/TUI surfaces, so
`~/.codex/config.toml` now sets `terminal_title` and `status_line` entries
that include `thread-title` / `session-id`. Prefer a first-class
rename/title API when Codex exposes one in the IDE host.)

**Prior refresh**: 2026-04-27 (Pelagic Washing Sail / codex / gpt-5 —
lightweight session handoff before serious intent-to-commit queue work.
This session completed the collaboration-doc fitness split, fixed the live
ADR-144 vocabulary failure, left Vining Bending Root a cross-vendor
shared-log note about vocabulary-transition TTLs/examples, and created a
15-minute heartbeat to check for pickup. Owner then promoted
`intent_to_commit` implementation with a correction: the next slice must
make queue order first-class, not just add claim metadata. Claim
`9eb22ec4-e10b-4867-9b1f-67ba12978c9b` was opened for queue work but
closed as an explicit handoff before schema/protocol implementation.)

**Prior refresh**: 2026-04-27 (Riverine Navigating Hull / claude-code /
claude-opus-4-7-1m — executed Phase 8 (Claude Code platform alignment
review) of `agent-identity-derivation.plan.md`. Reviewed the deterministic
identity implementation, PDR-027 amendment, start-right updates, and platform
status table; verified Claude Code's statusline contract via the official
docs; wired the Claude statusline through `.claude/settings.json` →
`.claude/scripts/statusline-identity.mjs` → built
`agent-tools/dist/src/claude/statusline-identity.js` adapter (the adapter
itself plus its unit-tested input parser landed in `3a5e3d81`).
End-to-end smoke test confirmed: real session-id JSON on stdin produces the
deterministic display name; missing/invalid input exits 0 silently.
Plan Phase 8 marked complete; agent-identity plan moved to status
🟢 COMPLETE; Codex/Cursor wrapper rows remain documented gaps. Active
claim `6078ec9e-3f26-4a73-ba9d-7cb5fb6bb9df` covers this work and will be
closed before the commit window closes.)

**Prior refresh**: 2026-04-26 (Codex / codex / GPT-5 — completed
requested `jc-session-handoff` plus `jc-consolidate-docs` after the
deterministic identity pass. Identity implementation landed as
`3a5e3d81` with commit-window closeout `ed256e6f`; this handoff opened
an explicit collaboration-doc fitness remediation lane for the remaining
hard practice-fitness findings. Active claim
`dd837ddf-d373-40a3-ad6b-450f7becf91d` covers this closeout and will be
closed before handoff completes.)

**Prior refresh**: 2026-04-26 (Codex / codex / GPT-5 — implemented the
owner-approved deterministic agent identity pass after preserving the
coordination consolidation as separate history. Added `agent-tools`
core `deriveIdentity(seed, options?)`, built `agent-identity` CLI,
workspace/root scripts, unit/E2E tests, docs, PDR-027 amendment,
start-right and `register-identity-on-thread-join` guidance, and napkin
archive/update. Personal-email fallback was removed; overrides are
type-total; platform wrapper installation is deferred. Active claim
`211f1f4f-7085-47d1-b7d3-09d309807b13` closed explicitly; active claims
registry is empty. Open follow-up: Phase 8 asks a Claude Code agent to
review Claude Code/update-config/statusline alignment and cross-platform
wrapper status for Claude, Codex, Cursor, and any other active agent
platform.)

**Prior refresh**: 2026-04-26 (Codex / codex / GPT-5 — implemented
owner-approved coordination architecture consolidation. Conversation
schema v1.1.0 now supports sidebars and joint decisions; escalation
schema and `escalations/` directory exist; start-right, session-handoff,
consolidate-docs, collaboration rules, directives, and state indexes now
surface sidebars, escalations, and joint-decision obligations. Intent-to-
commit/session-counter remains separate future work. Active claim
`e3ea9c06-f985-4fd4-b920-aa0c8e4f0e71` closed explicitly; active claims
registry is empty.)

**Prior refresh**: 2026-04-26 (Frolicking Toast / claude-code /
claude-opus-4-7-1m — session handoff after the owner-directed
chunked landing closed cleanly. Two commit-window claims opened and
closed today (`4535f2ff` umbrella for the 6-chunk landing, then
`eecc4c6b` for the agent-comms-log file rename); active-claims
registry now empty. Seven commits landed — `e37a5795`, `38472766`,
`9925ad59`, `9bd91f81`, `564e284f`, `31564f24`, `f3e05afb` — covering
the commit-window protocol foundation, plans, Practice Core
learning-first correction, memory patterns, observability L-IMM full
closure, cross-thread continuity record, and the rename. The session
self-applied the commit-window protocol that chunk 1 implemented;
two pre-commit footguns surfaced (commitlint subject-case rule on
identifier-leading subjects; markdownlint MD004 on `+` bullets) and
were caught inside the commit window before history rewrote.)

**Prior refresh**: 2026-04-26 (Codex / codex / GPT-5 — session handoff after
owner correction that same-branch friction is the collaboration experiment.
Frolicking Toast's commit-steward claim remains active; Codex had no open
claim to close.)

**Prior refresh**: 2026-04-26 (Codex / codex / GPT-5 — session handoff for
WS3B/joint-decision status reconciliation. Active claim closes explicitly;
deep consolidation is marked due, not run.)

**Prior refresh**: 2026-04-26 (Codex / codex / GPT-5 — WS3B and
joint-decision status reconciled. Three-agent phase-transition evidence
satisfied the WS3B gate and introduced a future joint-decision protocol.)

**Prior refresh**: 2026-04-26 (Codex / codex / GPT-5 — commit-bundle
evidence taxonomy reflected. The future intent-to-commit plan now treats
substitution, disappearance, and accretion as distinct staged-bundle integrity
failures.)

**Prior refresh**: 2026-04-26 (Codex / codex / GPT-5 — lock-wait nuance
captured. Claude Monitor / Codex shell wait / Cursor shell wait are noted
as physical lock guards, not substitutes for commit-window claims.)

**Prior refresh**: 2026-04-26 (Codex / codex / GPT-5 — commit-window
protocol pass. The git index/head transaction window is now represented as
a short-lived active-claim area before staging or committing.)

**Prior refresh**: 2026-04-26 (Codex / codex / GPT-5 — learning-first
fitness correction added after WS4A closeout. Napkin rotated to
`archive/napkin-2026-04-26.md`; high-signal learnings distilled even though
that intentionally creates fitness pressure. Consolidation / Practice /
ADR-144 surfaces now say learning preservation outranks fitness limits.)

**Prior refresh**: 2026-04-26 (Composer / cursor — `jc-session-handoff`
only: MCP Apps widget allowlist + `ToolMeta` + universal-tools test
behaviour work documented in `repo-continuity.md`; type-check debt called
out for next session. No plan-body edits. Date normalised from a
future-dated `2026-04-27` entry during the WS4A lifecycle pass.)

**Prior refresh**: 2026-04-26 (Codex / codex / GPT-5 — owner-directed
WS3 plan split. The former bundled "conversation file + sidebar"
workstream is now two split plan files: WS3A
[`multi-agent-collaboration-decision-thread-and-claim-history.plan.md`](../../../plans/agentic-engineering-enhancements/archive/completed/multi-agent-collaboration-decision-thread-and-claim-history.plan.md)
for evidence provision, protocol observability, durable claim-closure
history, and lightweight decision threads; WS3B
[`multi-agent-collaboration-sidebar-and-escalation.plan.md`](../../../plans/agentic-engineering-enhancements/current/multi-agent-collaboration-sidebar-and-escalation.plan.md)
for sidebar / timeout / owner-escalation mechanics. Its promotion gate is
satisfied as of 2026-04-26; implementation has not started. Parent plan,
current README, roadmap,
napkin, and collaboration log were reconciled. WS3B still must not
auto-resume. Session handoff refreshed repo-continuity and marked deep
consolidation due, not run, because `repo-continuity.md` is hard in
practice fitness.)

**Prior refresh**: 2026-04-26 (Cursor / GPT-5.5 / Codex — documentation-only:
public-API **consumer boundary** in `docs/architecture/openapi-pipeline.md`
(no direct Hasura / materialised views / internal Oak DB from this
monorepo); **Issue 1** refresh in
`.agent/plans/external/ooc-issues/oak-open-curriculum-api-issues-2026-04-23.md`
(threads endpoints: observed/expected/impact/reproduce + informational
`oak-openapi` GraphQL entry-point note); **stale** annotation on
`.agent/reports/oak-openapi-bug-report-2026-03-07.md` Issue 2 list-query
snippet; `repo-continuity` invariants + deep-consolidation status updated.)

**Prior refresh**: 2026-04-26 (Codex / codex / GPT-5 — session handoff
after collaboration terminology and platform-independence refresh. The
former "embryo" vocabulary has been replaced on live surfaces with
**shared communication log/system** language. Owner's platform-independence
note is now integrated as a plan constraint and napkin principle:
platform-specific agent-team features may help build or inspect the
system, but the repo-owned markdown/JSON/rules/commands/skills/hooks
surfaces must be sufficient to operate fully. Stale evidence-gate language
updated: the 2026-04-25 shared-communication-log entries now appear to
meet the 3+ coordination-event inspection threshold, but this does **not**
auto-resume WS3+; next step is owner-directed WS5 evidence harvest /
resumption review. Handoff note: repo-continuity was not updated because
Sharded Stroustrup has an active claim on that file.)

**Prior refresh**: 2026-04-25 (Fresh Prince / claude-code /
claude-opus-4-7-1m — **WS1 of the multi-agent collaboration protocol
landed as a single atomic commit `a5d33519`** on
`feat/otel_sentry_enhancements`. 20 files, 881 insertions, 165
deletions. All pre-commit gates green first try (lint, markdownlint,
prettier-check, knip, depcruise, type-check, test, portability-check).
Surfaces installed: structured `active-claims.json` + JSON Schema
authority + `closed-claims.archive.json`; new tripwire rule
`register-active-areas-at-session-open` with three platform adapters;
operational entry `collaboration-state-conventions.md` carrying
schema-field provenance and `freshness_seconds` rationale; new
`consolidate-docs § 7e` stale-claim audit step; both `start-right`
skills updated. Pre-landing reviewer dispatch (Fred,
config-reviewer, assumptions-reviewer, docs-adr-reviewer) absorbed three
MAJORs (schema additive-only/additionalProperties reconciliation;
observable-artefact requirement on no-overlap claims; `freshness_seconds`
default rationale) and several proportionate MINORs. Self-application
pilot landed: a single Fresh Prince claim opened-and-closed within the
WS1 commit, archived as the founding entry in
`closed-claims.archive.json`. **Coordination event**: parallel
`Jiggly Pebble` (`claude-code` / `claude-opus-4-7-1m`,
observability-sentry-otel thread, PR-87 quality-finding analysis)
appended their own shared-communication-log entry mid-session declaring areas
explicitly NOT including WS1 surfaces. Protocol functioning
bidirectionally, again. **Next**: WS2 of the protocol is already
landed (`293742cd`); WS3 (conversation file + sidebar mechanism) is the
next workstream and is unblocked, but is not the current priority —
deployed-state observability validation remains the owner's stated
focus per `repo-continuity.md`.

**Prior refresh**: 2026-04-25 (Jiggly Pebble / claude-code /
claude-opus-4-7-1m — **WS0 of the multi-agent collaboration protocol
landed as a single atomic commit `63c66c88`** on
`feat/otel_sentry_enhancements`. **WS0 seed fired same-day**: parallel
observability-thread agent (Codex / codex / GPT-5) appended their own
signed entry to the shared communication log `.agent/state/collaboration/shared-comms-log.md`
during my session-handoff, declaring their packaging boundary. Their
commit `d9cb54e8` then landed preserving every Jiggly Pebble plan /
thread / experience / napkin edit exactly as their shared-communication-log
entry promised. The protocol is functioning bidirectionally on day one.
34 files, 760 insertions, 22 deletions.
Directive rename (`collaboration.md` → `user-collaboration.md`), new
sibling `agent-collaboration.md` directive, four canonical rules with
12 platform-adapter mirrors, `.agent/state/` bootstrap with shared
communication log + first signed entry, executive memory channel-card,
13-surface cross-reference sweep (1 deferred — see Coordination event
below), bidirectional citation between
`dont-break-build-without-fix-plan.md` and
`gate-recovery-cadence.plan.md`, `consolidate-docs.md` step 7d for
citation audit. Pre-landing reviewer dispatch
(`docs-adr-reviewer` + `assumptions-reviewer`) absorbed two BLOCKING
(broken ADR paths; markdownlint MD053) and three proportionate MAJORs
(consult-decide observability via "log your decision"; fast-path
overhead reconciliation to "minimum overhead — one read, one write";
concrete-now 24-hour bridge for "recent"). Deferred MAJORs (citation
archival drift) and MINORs recorded for follow-up. All pre-commit
gates green on first attempt. **Coordination event**: parallel
Codex/GPT-5 agent on observability thread held in-flight edits to
`observability-sentry-otel.next-session.md`; my two sweep edits on
that file backed out and surfaced in the shared communication log for parallel
agent integration. The protocol's first real coordination test —
applied to itself — passed via the shared communication log, not via mechanical
refusal. **Next**: WS1 (promote shared signals to structured claims registry
with `active-claims.json` + `register-active-areas-at-session-open`
rule) is unblocked.)

**Prior refresh**: 2026-04-25 (Codex / codex / GPT-5 — sidecar
markdown-code-block rule added during observability handoff. Canonical rule
landed at `.agent/rules/markdown-code-blocks-must-have-language.md` with
Claude/Codex/Cursor adapters; MD040 is explicit in `.markdownlint.json`;
root entrypoints were kept in canonical heading + AGENT pointer shape per
session-handoff entrypoint-drift discipline. `pnpm portability:check`,
targeted markdownlint, `pnpm markdownlint-check:root`, Prettier check, and
`git diff --check` pass.)

**Prior refresh**: 2026-04-25 (Jazzy / claude-code / claude-sonnet-4-6
— authored the
[`multi-agent-collaboration-protocol.plan.md`](../../../plans/agentic-engineering-enhancements/current/multi-agent-collaboration-protocol.plan.md)
to install structural infrastructure for parallel agents working on
the same repo without clashing. Plan is 1349 lines, six workstreams
(WS0–WS5), Wilma-reviewed adversarially with 14 findings absorbed
(2 BLOCKING, 7 MAJOR, 7 MINOR — full disposition table in the plan).
Owner direction settled the central design commitment 2026-04-25 in
discussion: **"knowledge and communication, not mechanical refusals"** —
mechanical refusals would be routed around at the cost of
architectural excellence. WS0 (directive rename `collaboration` →
`user-collaboration` + new `agent-collaboration` directive + shared
communication log + three foundational rules + state-vs-memory split +
executive memory entry + platform-adapter audit) is the foundation,
ready to start in a fresh session. No commits made this session for
this plan — file is untracked in working tree; owner directed cold
start for WS0 in a fresh session to avoid context-pollution from
this design discussion. Plan is additive to (and references) the
active
[`gate-recovery-cadence.plan.md`](../../../plans/observability/active/gate-recovery-cadence.plan.md)
in the parallel observability thread.

**Prior refresh**: 2026-04-24 (Codex / cursor / GPT-5.5 — session
handoff after grouped commits landed AGENT homing, hard-fitness
clearance, search-cli smoke DI, and focused observability boundary-plan
state). The latest committed session implemented:
[`agent-entrypoint-content-homing.plan.md`](../../../plans/agentic-engineering-enhancements/current/agent-entrypoint-content-homing.plan.md),
created the Phase 0 evidence ledger, slimmed AGENT into an entrypoint, and
cleared all hard fitness findings reported by
`pnpm practice:fitness:informational`.

The prior Codex handoff clarified the knowledge-flow role model, amended
PDR-014, updated the patterns README, and created two queued repo plans:
[`agent-entrypoint-content-homing.plan.md`](../../../plans/agentic-engineering-enhancements/current/agent-entrypoint-content-homing.plan.md)
and
[`knowledge-role-documentation-restructure.plan.md`](../../../plans/agentic-engineering-enhancements/current/knowledge-role-documentation-restructure.plan.md).

---

## Thread Identity

- **Thread**: `agentic-engineering-enhancements`
- **Thread purpose**: Practice and documentation-structure improvements,
  especially knowledge-flow roles, directive fitness pressure, and durable
  homing of agent-entrypoint content.
- **Branch**: `feat/otel_sentry_enhancements` (parallel practice lane;
  not the branch-primary product thread)

## Participating Agent Identities

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| `Codex` | `codex` | `GPT-5` | *`unknown`* | `practice-docs-consolidation; markdown-code-block-rule; collab-terminology-handoff; WS5-evidence-harvest-review; WS3-plan-split; session-handoff; WS3A-RED-fixtures; WS3A-claim-history-GREEN; WS3A-handoff; WS3A-decision-thread-GREEN; WS3A-observability-and-close; WS3A-handoff-consolidation; next-session-start-statement; final-session-handoff; WS4A-lifecycle-integration; WS4A-plan-state-cleanup; reviewer-norm-correction; consolidate-docs-closeout; learning-before-fitness-correction; commit-window-protocol; lock-wait-nuance; commit-bundle-evidence-taxonomy; ws3b-joint-decision-status-reconciliation; same-branch-friction-metacognition; session-handoff-under-active-commit-claim; deterministic-agent-identity-implementation; identity-session-handoff-consolidation` | 2026-04-24 | 2026-04-26 |
| `Codex` | `cursor` | `GPT-5.5` | *`unknown`* | `grouped-commit-closeout; openapi-pipeline-api-boundary; ooc-issues-1-threads; bug-report-2026-03-07-stale-callout; session-handoff` | 2026-04-24 | 2026-04-26 |
| `Composer` | `cursor` | `Composer` | *`unknown`* | `mcp-apps-widget-metadata; user-search-query-no-widget-uri; testing-strategy-integration-tests; session-handoff; cursor-sessionstart-hook-identity-mirror-docs-tests` | 2026-04-26 | 2026-04-27 |
| `Jazzy` | `claude-code` | `claude-sonnet-4-6` | *`unknown`* | `multi-agent-collaboration-protocol-plan-author-wilma-review-absorbed` | 2026-04-25 | 2026-04-25 |
| `Jiggly Pebble` | `claude-code` | `claude-opus-4-7-1m` | *`unknown`* | `multi-agent-collaboration-protocol-WS0-foundation-landed-as-63c66c88` | 2026-04-25 | 2026-04-25 |
| `Fresh Prince` | `claude-code` | `claude-opus-4-7-1m` | *`unknown`* | `multi-agent-collaboration-protocol-WS1-landed-as-a5d33519; pending-graduations promotion pass landed as f1f28e85 (PDR-029 v2 + PDR-015 + PDR-018 + register hygiene + validator extension)` | 2026-04-25 | 2026-04-25 |
| `Sturdy Otter` | `claude-code` | `claude-opus-4-7-1m` | *`unknown`* | `ws3a-ws4a-backlog-cleanup-13-commits-under-3-agent-contention (382ba258..36364988); learning-before-fitness-application; intent-to-commit-and-session-counter-future-plan (9af63a84, d9c65f04); joint-agent-decision-protocol-future-plan-and-WS3B-promotion-gate-satisfied (6769a1f9); phase-transition-evidence-recorded; clash-taxonomy-A-substitution-B-disappearance-C-accretion-named` | 2026-04-26 | 2026-04-26 |
| `Frolicking Toast` | `claude-code` | `claude-opus-4-7-1m` | *`unknown`* | `chunked-commit-stewardship-under-active-claim-4535f2ff; commit-window-protocol-self-application; consolidation-graduation-pass-7be10d3b-7-doctrine-entries-graduated-cb358e8d-local-push-deferred-on-parallel-track-lint-coupling` | 2026-04-26 | 2026-04-26 |
| `Riverine Navigating Hull` | `claude-code` | `claude-opus-4-7-1m` | `c32a7d1d` | `agent-identity-derivation-phase-8-claude-code-platform-alignment-review-and-statusline-wiring` | 2026-04-27 | 2026-04-27 |
| `Celestial Waxing Eclipse` | `codex` | `GPT-5` | `019dcd` | `codex-thread-id-discovery-and-agent-identity-seed-wiring; codex-title-statusline-display-surface-investigation` | 2026-04-27 | 2026-04-27 |
| `Pelagic Washing Sail` | `codex` | `gpt-5` | `019dca9c` | `collaboration-fitness-vocabulary-cross-vendor-note-commit-queue-handoff-and-closeout` | 2026-04-27 | 2026-04-27 |
| `Fragrant Sheltering Pollen` | `codex` | `gpt-5.5` | `019dcda0` | `owner-directed-codex-app-server-rollback-agent-tools-gates-and-commit-queue-evidence` | 2026-04-27 | 2026-04-27 |
| `Prismatic Waxing Constellation` | `codex` | `gpt-5.5` | `019dcd` | `owner-directed-intent-to-commit-queue-implementation` | 2026-04-27 | 2026-04-27 |

Identity discipline remains additive per
[PDR-027](../../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md):
new sessions add rows; matching platform/model/agent_name updates
`last_session`.

---

## Landing Target (per PDR-026)

**Latest session landed as uncommitted queue implementation and closeout
(2026-04-27 Prismatic Waxing Constellation, intent-to-commit queue
implementation):**

- owner-directed queue work is implemented in the working tree, but not staged
  or committed. This session deliberately avoided the git index because it did
  not hold a fresh `git:index/head` claim;
- promoted
  [`intent-to-commit-queue.execution.plan.md`](../../../plans/agentic-engineering-enhancements/current/intent-to-commit-queue.execution.plan.md)
  as the executable current plan and updated the future source plan with the
  `2ccefad4` turn-race evidence;
- added active-claims schema v1.3.0 with root `commit_queue`, optional claim
  `intent_to_commit` pointer, and repo-owned helper
  `scripts/commit-queue.mjs` for enqueue, phase, staged-fingerprint capture,
  exact staged-bundle verification, and completion cleanup;
- updated commit, start-right, active-claim, collaboration, consolidation, and
  cross-vendor wrapper guidance. The queue is advisory FIFO discovery, not a
  lock or refusal mechanism, and session-count TTL remains future-only;
- validation passed: targeted queue unit tests, `pnpm test:root-scripts`,
  JSON parse checks, markdownlint, vocabulary, fitness strict-hard,
  `git diff --check`, and targeted Prettier. Direct file-level ESLint on the
  new `.mjs` helper hit the repo's typed-rule parser-services limitation; the
  recorded root validation path is `pnpm test:root-scripts`;
- final observed staged index is clear. A previous staged bundle was observed
  during this session under another active claim, and unrelated dirty work
  remains. The next landing must re-check active claims, queue order, and
  `git diff --cached --name-status` before touching the index.

**Prior latest session landed as closeout and next-session opener
(2026-04-27 Fragrant Sheltering Pollen, Codex rollback and queue-evidence
handoff):**

- owner corrected the previous direction: drop the experimental Codex
  app-server title-mutation approach because stable names from
  `CODEX_THREAD_ID` provide the load-bearing value;
- removed the app-server implementation scope from the working tree and kept
  the stable identity documentation row. `@oaknational/agent-tools` gates
  passed: build, type-check, lint, lint:fix, unit tests, e2e tests, plus an
  identity smoke test printing `Fragrant Sheltering Pollen`;
- a short-lived `index/head` commit-window claim still collided with live
  shared-index activity. Commit `2ccefad4` contains the Codex stable-name doc
  row under another agent's scripts-fix message, and `HEAD` advanced again to
  `21abd2d4` during inspection. The session did not amend or rewrite shared
  history;
- owner directed this collision to be recorded as evidence for the
  intent-to-commit queue. Next implementation re-attempts by adding ordered
  `commit_queue` mechanics plus exact staged-bundle verification. Falsifiability:
  inspect `intent-to-commit-and-session-counter.plan.md`, the shared log entry
  for claim `a980a5e8-5b5a-4bb0-84d5-99358bfd7014`, and `git show 2ccefad4`.

**Prior latest session landed as closeout and next-session opener
(2026-04-27 Pelagic Washing Sail, Codex handoff/consolidation):**

- `jc-session-handoff` and `jc-consolidate-docs` ran before serious
  commit-queue implementation, per owner direction;
- active claim `72b0e57c-4167-4407-b2ac-db1e4231619a` was opened for
  closeout surfaces and closed explicitly in collaboration state;
- strict-hard fitness pressure in `napkin.md` and `repo-continuity.md` was
  remediated without deleting live learning;
- Vining did not visibly pick up the shared-log vocabulary TTL/examples note
  at the first heartbeat check, which is now recorded as WS5 evidence that
  broadcast logs need directed channel/ack protocols for targeted requests;
- no queue schema, API, workflow, staging, or commit work was started.
  Next session re-attempts by promoting/updating the intent-to-commit plan
  around a first-class ordered advisory queue, then implementing schema and
  workflow v1.3. Falsifiability: inspect active/closed claims, the shared log,
  this thread record, and the future plan before touching schemas.

**Latest session landed as committed identity support plus handoff evidence
(2026-04-27 Celestial Waxing Eclipse, Codex display-surface handoff):**

- deterministic Codex identity seeding from `CODEX_THREAD_ID` already landed
  in `ff119d44` and collaboration claim closeouts landed in `701c3185`;
- this handoff set the current Codex thread title to
  `Celestial Waxing Eclipse`, and `~/.codex/session_index.jsonl` carries the
  same thread name;
- official CLI/TUI title/statusline configuration exists, but no supported
  IDE-extension setting for a deterministic custom session name was found in
  local extension settings;
- owner asked to use the CLI/TUI surfaces anyway. `~/.codex/config.toml` now
  sets `terminal_title = ["spinner", "project-name", "thread-title",
  "git-branch"]` and `status_line = ["model-with-reasoning", "git-branch",
  "thread-title", "session-id", "context-remaining", "five-hour-limit",
  "weekly-limit"]`. Falsifiability: inspect `~/.codex/config.toml`, the
  Codex IDE extension package configuration, and official Codex CLI/TUI
  slash-command docs before wiring any display adapter.

**Latest session landed as uncommitted documentation/state edits
(2026-04-27 Pelagic Washing Sail, pre-commit-queue handoff):**

- collaboration-doc fitness remediation is implemented in the working tree:
  high-frequency doctrine stays in the directive/conventions files while
  detailed lifecycle recipes live in `collaboration-state-lifecycle.md`;
- `practice:vocabulary` was fixed by translating the shared-log ADR-144
  phrase from retired wording to the current three-zone vocabulary;
- a cross-vendor shared-log note to Vining Bending Root records the
  vocabulary-transition TTL/examples idea; a thread heartbeat checks
  periodically for pickup evidence;
- serious `intent_to_commit` implementation was deliberately paused for this
  handoff. Next session re-attempts by amending/promoting the existing plan
  around an explicit ordered commit queue, then implementing schema/workflow
  v1.3. Falsifiability: inspect `active-claims.json` for no remaining
  Pelagic queue-work claim, inspect this thread record's Next Safe Step, and
  check the future plan's owner-direction note before editing schemas.

**Latest session landed as uncommitted documentation/state edits
(2026-04-26 Codex, same-branch friction handoff):**

- owner corrected Codex's initial safety framing: separate worktrees /
  branches would hide the same-branch coordination friction this experiment is
  meant to reveal;
- napkin, repo-continuity, this thread record, the observability thread
  record, and the shared communication log now capture the operating
  principle: same-branch overlap is allowed, but commit windows, path
  ownership, and shared-surface handoffs must be visible before staging /
  committing;
- Frolicking Toast's active commit-steward claim
  `4535f2ff-0420-4bde-bfb8-af0db656e359` remains open; Codex had no matching
  active claim to close; no decision-thread update was needed.

**Prior latest session landed as uncommitted documentation/state edits
(2026-04-26 Codex, session handoff):**

- repo-continuity and this thread record now reflect current HEAD
  `e4705169`, the WS3B gate-satisfied / not-implemented state, and this
  session's handoff;
- collaboration lifecycle is closed explicitly into
  `closed-claims.archive.json`;
- consolidation gate is marked due for hard `distilled.md` fitness pressure
  and pattern / phase-transition convergence, but `jc-consolidate-docs` was
  not run inside this lightweight handoff.

**Prior latest session landed as uncommitted documentation/state edits
(2026-04-26 Codex, WS3B and joint-decision status reconciliation):**

- current README, roadmap, parent MAC plan, repo-continuity, and this thread
  record now reflect that WS3B's promotion gate is satisfied but
  implementation has not started;
- future README now lists the newly recorded
  `joint-agent-decision-protocol.plan.md`;
- no staging, commit, hook automation, or WS3B mechanism was started.

**Prior latest session landed as uncommitted documentation/state edits
(2026-04-26 Codex, commit-bundle evidence taxonomy):**

- future intent-to-commit plan now treats three staged-bundle integrity
  failures as promotion-threshold evidence: substitution, disappearance, and
  accretion;
- napkin captures that the durable unit is the full bundle: agent intent,
  intended pathspecs, staged diff, and commit subject;
- no staging, commit, hook automation, or WS3B mechanism was started.

**Prior latest session landed as uncommitted documentation/state edits
(2026-04-26 Codex, lock-wait nuance):**

- commit skill now states Claude may use Monitor to wait for
  `.git/index.lock`, while Codex/Cursor should use a bounded shell wait unless
  a custom monitor exists;
- the note explicitly preserves the distinction: lock waits are physical
  guards, while `git:index/head` active claims and shared-log entries are the
  coordination layer;
- no staging, commit, hook automation, or WS3B mechanism was started.

**Prior latest session landed as uncommitted documentation/state edits
(2026-04-26 Codex, commit-window protocol refinement):**

- git index/head is now an explicit short-lived active-claim area
  (`git:index/head`) before staging or committing;
- the commit skill, start-right workflows, collaboration rules, state
  schemas, state README, consolidation audit, channel card, founding
  collaboration pattern, repo-continuity, and napkin carry the protocol;
- platform commit adapters now point agents at the same canonical
  commit-window-aware skill;
- no WS3B sidebar/timeout/owner-escalation mechanics or hook automation
  were started.

**Prior latest session landed as uncommitted documentation/state edits
(2026-04-26 Codex, learning-first correction after WS4A closeout):**

- owner correction applied: fitness limits, including hard and critical
  signals, must never suppress capture, distillation, graduation, or useful
  writing;
- outgoing napkin archived to
  [`napkin-2026-04-26.md`](../../active/archive/napkin-2026-04-26.md), and
  high-signal entries distilled into `distilled.md`;
- `consolidate-docs`, PDR-014, ADR-144, Practice Core, repo-continuity, and
  this thread record now say learning comes first and fitness pressure routes
  follow-up structure work.

**Prior latest session landed as uncommitted documentation/state edits
(2026-04-26 Codex, WS4A plan-state cleanup and consolidation closeout):**

- parent MAC plan and roadmap now distinguish the completed WS3 evidence
  harvest from remaining post-WS4A observation / seed harvest work;
- stale WS3/WS4 wording, per-WS seed counts, and stale-conversation wording
  were corrected after `docs-adr-reviewer` findings;
- reviewer governance now says specialist sub-agent review is preferred
  evidence for substantive work, while findings require disposition and
  only blocking findings / hard gate failures block closure;
- `agent-collaboration.md` now says existing owner questions are distinct
  from the deferred WS3B file-backed owner-escalation surface;
- napkin date hygiene corrected the future-dated Composer entry from
  2026-04-27 to 2026-04-26.

**Prior latest session landed as uncommitted documentation/state edits
(2026-04-26 Codex, WS4A lifecycle integration):**

- start-right quick/thorough now explicitly read active claims, the
  shared communication log, and WS3A decision-thread files before edits;
- session-handoff now closes own active claims into the closed-claims
  archive and updates relevant decision threads before the consolidation
  gate;
- plan templates now include a lifecycle-trigger component and tiered
  simple-plan/work-shape requirement;
- Practice Core, PDR-024, ADR-119, ADR-124, practice-index, roadmap,
  current-plan index, and documentation-sync log now treat collaboration
  state as a first-class Practice surface;
- `invoke-code-reviewers.md` now distinguishes reviewer dispatch from
  peer collaboration state;
- WS3B sidebar, timeout, and owner-escalation gate is satisfied;
  implementation remains a separate pass.

**Prior session landed as uncommitted documentation/state edits
(2026-04-26 Codex, WS3A complete):**

- codified the WS5 harvest baseline and RED fixtures for claim-history
  and decision-thread surfaces;
- added `closed-claims.schema.json`, migrated `closed-claims.archive.json`
  to v1.1.0 with structured `closure` metadata, and updated claim-close
  guidance across the directive, rules, state conventions, and
  `consolidate-docs`;
- self-applied the new closure path: the WS3A claim-history claim is in
  `closed-claims.archive.json` with `closure.kind: "explicit"`;
- validation: claim-history JSON/Ajv/closure checks and decision-thread
  jq/file-dir/Ajv checks passed, along with targeted markdownlint,
  `git diff --check`, and `pnpm practice:fitness:informational`. The only
  hard fitness finding remains `repo-continuity.md`, already marked for
  separate deep consolidation.
- added `conversation.schema.json`,
  `.agent/state/collaboration/conversations/`, open/closed examples, and
  GREEN conversation fixtures preserving the RED filenames as history;
- updated collaboration guidance for when to use the shared log, an
  active claim, a decision thread, the napkin, and the thread record;
- wired `consolidate-docs § 7e` to report active/stale claims, recent
  closures, open/stale decision threads, unresolved decision requests,
  evidence-bundle gaps, and schema validation;
- marked `ws3a-refactor-observability` and `ws3a-validation-and-handoff`
  complete in the WS3A plan and refreshed current-plan/roadmap status;
- WS3B sidebar, timeout, and owner-escalation surfaces remain unimplemented;
  their promotion gate is satisfied.

**Prior session landed as uncommitted documentation/state edits
(2026-04-26 Codex):**

- renamed the live "embryo" terminology to **shared communication log/system**
  across the plan, directive, rules, state docs, memory cards, and handoff
  surfaces;
- integrated owner direction on platform independence into the protocol plan,
  `agent-collaboration.md`, `distilled.md`, and the napkin;
- refreshed the collaboration plan, roadmap, current-plan index, and this
  thread record from "evidence still accumulating" to "evidence threshold
  appears met; owner-directed harvest required";
- superseded the stale `temp-agent-collaboration-continuation.md` note;
- validation: `jq empty .agent/state/collaboration/active-claims.json` passed;
  `git diff --check` passed; `pnpm practice:fitness:informational` has only
  the unrelated/claimed `repo-continuity.md` hard finding remaining;
  `pnpm markdownlint-check:root` passed once, then a final rerun picked up
  Sharded's claimed PR-87 plan MD018 issue and was left untouched.

**Prior session landed as artefacts, not a commit**:

- separated continuity strategy/process from operational state:
  [`continuity-practice.md`](../../../directives/continuity-practice.md)
  now carries doctrine; [`repo-continuity.md`](../repo-continuity.md)
  carries active state;
- updated [`session-handoff.md`](../../../commands/session-handoff.md)
  with the role-boundary check that prevents those surfaces from
  muddying again;
- clarified testing-family roles by making
  [`testing-patterns.md`](../../../../docs/engineering/testing-patterns.md)
  the governed recipe companion to
  [`testing-strategy.md`](../../../directives/testing-strategy.md);
- amended
  [PDR-014](../../../practice-core/decision-records/PDR-014-consolidation-and-knowledge-flow-discipline.md)
  with knowledge-artefact roles and bidirectional knowledge flow;
- updated [`patterns/README.md`](../../active/patterns/README.md) to name
  the empirical-to-normative flow from observed practice into recipes,
  rules, principles, scanners, and decision records;
- created the two queued plans listed in the header.

**Latest session landed as grouped commits**:

- `9c866634` — `test(search-cli): inject smoke env through vitest context`;
- `fa069efe` — `chore(agents): update cursor reviewer model metadata`;
- `ccc2ca46` — `docs(practice): home agent directives and testing doctrine`;
- `015ac99b` — `docs(continuity): record plan handoff state`;
- implemented the AGENT homing plan and marked its todos complete;
- added the AGENT source-to-target ledger under plan evidence;
- moved durable reviewer, agent-tool, artefact, command, and commit detail to
  their role homes and slimmed AGENT to an entrypoint;
- cleared `principles.md` hard pressure by delegating detailed testing doctrine
  and repo topology to their durable homes;
- cleared `testing-strategy.md` hard pressure by moving worked TDD examples to
  [`testing-tdd-recipes.md`](../../../../docs/engineering/testing-tdd-recipes.md);
- aligned `no-global-state-in-tests.md` with the no-read/no-write
  `process.env` contract.
- review follow-up removed the remaining smoke-test `process.env` read by
  injecting validated smoke config from `vitest.smoke.config.ts`, restored the
  "assert effects, not constants" testing principle, and corrected the moved
  TDD recipe examples.
- after analysing the streamable-http `pnpm check` blocker, created
  [`mcp-local-startup-release-boundary.plan.md`](../../../plans/observability/active/mcp-local-startup-release-boundary.plan.md)
  and removed the arbitrary observability plan-density limit that had
  misrouted the plan on first placement. The plan has since been promoted to
  active, Phase 0 evidence has landed, and Phase 1 RED evidence now makes
  Phase 2 GREEN the next observability step.

Deferral honesty: the AGENT and hard-fitness work has landed in commits. The
local startup/release-boundary plan is deliberately unimplemented; it is a
queued follow-up, not hidden completion.

---

## Session Shape and Grounding

At session open, read in order:

1. [`repo-continuity.md`](../repo-continuity.md), especially Active Threads,
   Next Safe Step, and Deep Consolidation Status.
2. This thread record.
3. The current plan that the owner names, or
   [`knowledge-role-documentation-restructure.plan.md`](../../../plans/agentic-engineering-enhancements/current/knowledge-role-documentation-restructure.plan.md)
   if continuing documentation-role work.
4. [`PDR-014`](../../../practice-core/decision-records/PDR-014-consolidation-and-knowledge-flow-discipline.md)
   for knowledge-artefact roles.
5. [`AGENT.md`](../../../directives/AGENT.md) and any target homes named
   in the active plan.

Before editing, update this identity table per the additive rule and run:

```bash
pnpm practice:fitness:informational
nl -ba .agent/directives/AGENT.md
```

---

## Lane State

### Owning Plans

- Primary (active multi-workstream lane):
  [`multi-agent-collaboration-protocol.plan.md`](../../../plans/agentic-engineering-enhancements/current/multi-agent-collaboration-protocol.plan.md)
  — WS0 landed `63c66c88`; WS1 landed `a5d33519`; WS2 landed
  `293742cd`. WS3 is split: WS3A is complete and archived, WS3B sidebar /
  escalation is implemented, WS4A lifecycle integration is complete, and WS5
  remains observation/harvest work.
- Completed split plan:
  [`multi-agent-collaboration-decision-thread-and-claim-history.plan.md`](../../../plans/agentic-engineering-enhancements/archive/completed/multi-agent-collaboration-decision-thread-and-claim-history.plan.md)
  — WS3A evidence provision, protocol observability, durable claim-closure
  history, and lightweight decision threads.
- Implemented sibling plan:
  [`multi-agent-collaboration-sidebar-and-escalation.plan.md`](../../../plans/agentic-engineering-enhancements/current/multi-agent-collaboration-sidebar-and-escalation.plan.md)
  — WS3B sidebar, timeout, owner-escalation, and joint-decision mechanics.
- Completed identity plan:
  [`agent-identity-derivation.plan.md`](../../../plans/architecture-and-infrastructure/archive/completed/agent-identity-derivation.plan.md)
  — repo-owned core/CLI/docs landed in `3a5e3d81`+`ed256e6f`; Phase 8
  Claude Code statusline wiring landed in this session; archived 2026-04-27.
- Fitness remediation:
  [`collaboration-doc-fitness-remediation.plan.md`](../../../plans/agentic-engineering-enhancements/current/collaboration-doc-fitness-remediation.plan.md)
  — implemented in the working tree; validate/land separately from queue
  work.
- Active queue implementation plan:
  [`intent-to-commit-queue.execution.plan.md`](../../../plans/agentic-engineering-enhancements/current/intent-to-commit-queue.execution.plan.md)
  — implemented in the working tree; land only after a fresh active-claim,
  queue, and staged-bundle check.
- Strategic source / follow-up:
  [`intent-to-commit-and-session-counter.plan.md`](../../../plans/agentic-engineering-enhancements/future/intent-to-commit-and-session-counter.plan.md)
  — promoted for queue implementation; `session_counter` remains future-only
  unless a real primitive lands in the same pass.
- Earlier completed work:
  [`agent-entrypoint-content-homing.plan.md`](../../../plans/agentic-engineering-enhancements/current/agent-entrypoint-content-homing.plan.md)
- Follow-on:
  [`knowledge-role-documentation-restructure.plan.md`](../../../plans/agentic-engineering-enhancements/current/knowledge-role-documentation-restructure.plan.md)
- Context:
  [`practice-and-process-structural-improvements.plan.md`](../../../plans/agentic-engineering-enhancements/current/practice-and-process-structural-improvements.plan.md)

### Current Objective

**WS4A lifecycle integration, coordination consolidation, deterministic
identity, collaboration-doc fitness remediation, cross-vendor shared-log
handoff evidence, and the owner-directed intent-to-commit queue are complete
or captured in the working tree (refreshed 2026-04-27).**
WS0 (`63c66c88`), WS1 (`a5d33519`), WS2 (`293742cd`), WS3A, the
owner-approved lifecycle wiring pass, and the `git:index/head`
coordination refinement are reflected in documentation/state surfaces.
WS3B is implemented; WS5 now means post-WS4A/WS3B real-session
observation / seed harvest.

The current experiment deliberately keeps agents on the same branch so
coordination frictions remain visible. Do not convert that into a worktree
avoidance rule; convert it into observable communication: claims, shared-log
notes, decision-thread handshakes when needed, and strict commit-window
announcements.

**Resumption gate**: the later 2026-04-25 shared-communication-log entries
appear to satisfy the original 3+ coordination-event inspection threshold, but
that evidence was used to split and complete WS3A, then to justify the
narrow WS4A lifecycle pass. Later three-agent phase-transition evidence
satisfied the WS3B gate; owner direction then implemented WS3B plus
joint-decision integration. It does not resume WS5 automatically.

**Inspection points**: `/jc-consolidate-docs` § 7e now audits open/stale
claims, recent closures, decision-thread state, sidebars, joint decisions,
active escalations, unresolved decisions, evidence-bundle gaps, and schema
validation.

### Current State

- WS3A RED, claim-history GREEN, decision-thread GREEN, protocol-observability
  refactor, and validation/handoff are complete.
- WS4A lifecycle integration is complete across start-right,
  session-handoff, plan templates, Practice Core, ADR-119, ADR-124, and
  practice-index surfaces.
- Commit-window coordination is implemented across commit skill, start-right,
  collaboration rules, active/closed-claim schemas, state README,
  consolidation audit, channel card, founding pattern, and continuity
  surfaces.
- WS3B sidebar/escalation and joint-agent decision integration is
  implemented across conversation schema v1.1.0, escalation schema,
  fixtures, start-right, session-handoff, consolidate-docs,
  collaboration rules, directives, channel card, state README, and state
  conventions.
- Deterministic identity is implemented in `agent-tools` with a built
  `agent-identity` CLI, tests, docs, PDR-027 amendment, start-right guidance,
  and platform-wrapper status table. Phase 8 Claude Code platform alignment
  review is complete: `.claude/settings.json` →
  `.claude/scripts/statusline-identity.mjs` →
  `agent-tools/dist/src/claude/statusline-identity.js` is live; the platform
  status table marks Claude Code as **Wired**. Codex `CODEX_THREAD_ID`
  seeding landed in `ff119d44`. Cursor composer uses experimental project
  `sessionStart` hook wiring (`OAK_AGENT_SEED`, mirror file, docs); official
  Hooks output still lacks a programmatic Composer tab-title field.
- Collaboration-doc fitness remediation is implemented in the working tree.
  Later strict-hard checks should distinguish those target docs from any
  unrelated concurrent WIP pressure.
- Intent-to-commit queue v1.3.0 is implemented in the working tree:
  active-claims carries root `commit_queue`, `scripts/commit-queue.mjs` can
  enqueue/phase/record/verify/complete intents, and commit/start-right/docs
  surface advisory FIFO order plus exact staged-bundle verification. It is not
  staged or committed yet.
- Cross-vendor shared-log communication has a live proof point and a limit:
  Codex left Vining a repo-context-specific future-design note with no
  platform bridge, but the first heartbeat found no visible pickup. Treat the
  log as durable discovery; use sidebars, decision threads,
  acknowledgements, or queue mechanics for directed obligations.
- `intent_to_commit` is now owner-directed work and implemented as a minimal
  ordered advisory queue, not only claim metadata.
- Codex display-surface investigation is complete for this session:
  repo-owned identity derivation uses `CODEX_THREAD_ID`. The experimental
  app-server title-mutation adapter was dropped because stable session names
  already provide the useful identity value.
- A live commit-window collision on 2026-04-27 proved the current
  `git:index/head` claim protocol is observable but not ordering. The queue
  implementation adds advisory turn order before staging/hooks.
- The completed WS3A split plan lives in
  [`archive/completed/multi-agent-collaboration-decision-thread-and-claim-history.plan.md`](../../../plans/agentic-engineering-enhancements/archive/completed/multi-agent-collaboration-decision-thread-and-claim-history.plan.md).
- `repo-continuity.md` has been compacted from an overgrown historical surface
  into a live-state index; the pre-compaction body is archived at
  `../archive/repo-continuity-session-history-2026-04-26.md`.
- The owner-requested Practice-integration / lifecycle-automation
  exploration has been implemented as the narrow WS4A lifecycle pass; no
  automation hooks were started.

### Blockers / Low-Confidence Areas

- Full branch gates are not claimed green; current repo state includes separate
  MCP/SDK TypeScript debt outside the completed practice-thread passes.
- Practice fitness for the collaboration directive/conventions was remediated
  in the working tree. Re-run strict-hard before landing because other agents
  are also editing the branch.
- The strict `--exactOptionalPropertyTypes` probe is clean for identity files
  but still reports the pre-existing optional typing issue in
  `agent-tools/src/bin/codex-reviewer-resolve.ts`.
- Re-check active claims before staging or follow-on edits. Same-branch
  overlap is allowed for the experiment, but silent staging / committing over
  another fresh claim is the failure mode being studied.
- Final observed staged index in this closeout is clear. Earlier in the
  session, staged files were observed under another active claim, so the next
  session must treat staged-index state as volatile and re-check it directly.
- Do not continue into soft-fitness work unless the owner asks for it.
- Keep using PDR-014 role boundaries; do not answer soft pressure with
  opportunistic trimming.
- Assumptions review already challenged the implementation plan. Future
  refinements should use `docs-adr-reviewer` for schema/docs coherence
  and `architecture-reviewer-wilma` for deadlock/hidden-coupling risks.

### Next Safe Step

**No WS3A, WS4A, commit-window, WS3B sidebar/escalation, joint-decision,
deterministic-identity core, Claude Code statusline wiring, or Codex
thread-id seeding remains open. Continue to treat same-branch coordination as
the live experiment: claims, sidebars, joint decisions, escalations, and now
the proposed commit queue should make friction visible rather than hiding it.**

Choose the lane deliberately:

1. **Intent-to-commit queue landing** — re-run start-right grounding and
   active-claim checks, then open a fresh `git:index/head` claim and self-apply
   the new queue helper before staging. Stage only the queue implementation
   pathspecs, record and verify the exact staged bundle plus subject with
   `scripts/commit-queue.mjs`, commit, and clear the queue entry. Do not use
   session-count TTL.
2. **Collaboration-doc fitness remediation landing** — validate and land the
   already-implemented split separately once the git index is clear.
3. **Strict exact-optional cleanup** — fix the pre-existing
   `codex-reviewer-resolve.ts` optional typing issue.
4. **First real sidebar / joint-decision seed** — when a real overlap uses
   `sidebar_*` or `joint_decision*` entries, capture whether it reached
   resolution without becoming a permission gate or default owner
   escalation.
5. **MCP / SDK dirty work** — run targeted type-checks and resolve the
   `ToolMeta` / `listUniversalTools` TypeScript debt.
6. **Observability branch-primary** — read the
   [`sentry-preview-validation-and-quality-triage.plan.md`](../../../plans/observability/current/sentry-preview-validation-and-quality-triage.plan.md)
   executable brief before validation/triage work.
7. **Lifecycle integration follow-up** — only if owner-directed, observe
   whether the new start-right / handoff / template lifecycle triggers are
   actually used in the next few sessions. Do not add hooks without evidence;
   first real sidebar/joint-decision usage should feed WS5 observation.
8. **Codex/Cursor identity display follow-up** — Codex automatic seeding is
   wired; CLI/TUI title/statusline surfaces exist, but no supported IDE
   custom-title setting was found. Cursor composer `session_id` seeds the repo
   hook; **tab title** still requires manual rename from mirror or a future
   Cursor API — track product requests separately from repo derivation.
9. **Other agentic engineering work** — pick an owner-directed queued plan.
   WS3B implementation is no longer background work; it has landed.

### Active Track Links

- None. No tactical track card is active for this thread.

### Promotion Watchlist

- If the AGENT implementation reveals a new stable rule for platform
  entrypoints, update the existing pending PDR-014 register item rather
  than creating a duplicate candidate.
- If hard-fitness remediation uncovers a general compression discipline
  beyond the existing pending item, route it through ADR-144,
  practice-verification, or `consolidate-docs` step 9 as appropriate.
- Treat Codex-to-Vining pickup through the shared communication log as WS5
  collaboration evidence. If Vining replies or acts, record it in the parent
  multi-agent collaboration plan rather than creating a new surface.
- Treat the first successful self-application commit using
  `scripts/commit-queue.mjs` as the trigger to graduate queue doctrine into
  the relevant PDR/collaboration-state governance surface.
