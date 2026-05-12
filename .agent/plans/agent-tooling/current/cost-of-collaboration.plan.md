---
name: cost of collaboration — agent-tools improvement plan
overview: Unified single-source-of-truth plan for improving agent-tools so that multi-agent collaboration windows produce more substance than coordination overhead. Subsumes primary-agent-tooling-enhancements.plan.md and lifts the structural insights from the 2026-05-11 four-agent session (Wooded / Galactic / Flamebright / Sparking Charring Ash) into P-ordered workstreams. The single guiding metric is **cost-per-coordination-event in agent-count-aware terms** — a protocol that works at N=1 may be fatal at N=4.
todos:
  - id: ws-p0-staged-only-gates
    content: Reshape the pre-commit hook to gate against staged content only (lint-staged or equivalent), with the full turbo suite moved to CI. Load-bearing pre-condition for every other multi-agent workstream.
    status: pending
  - id: ws-p1-comms-direct-and-reply
    content: Implement B-11 directed-message authoring CLI (`comms direct` + `comms reply`) per the locked sidebar design at `.agent/state/collaboration/sidebars/cli-comms-inbox-design-2026-05-11.md`.
    status: pending
  - id: ws-p2-comms-watch
    content: Add `comms watch` with `fs.watch` + polling fallback to replace 30s bash poll loops. Sub-second new-message latency for any agent that runs the watch as a long-lived process.
    status: pending
  - id: ws-p3-commit-queue-enforcement
    content: Promote the commit queue from advisory predictor to enforced pre-stage gate. Refuse `git add` (via a commit-queue CLI guard wrapping `git add`, or a stage-time precondition check) when no active intent matches the staged file set. Note Git/Husky have no native `pre-stage` hook lifecycle; the enforcement lives in the agent-tools CLI or a wrapper, not in a hook of that name.
    status: pending
  - id: ws-p4-identity-disambiguation
    content: Make `(agent_name, platform, session_id_prefix)` the routing key in claim and comms writes; refuse a write whose tuple collides with an existing live identity.
    status: pending
  - id: ws-p5-unified-comms-format
    content: Collapse the three-directory split (`comms-events/`, `comms-lifecycle/`, `comms-messages/`) and the three `$defs` into a single shape with a `kind` discriminant. Owner-relayed direction "ONE comms format used everywhere, no legacy lingering."
    status: pending
  - id: ws-p6-coordination-artefact-isolation
    content: Isolate coordination artefacts (sidebars, comms-events, monitor telemetry) from gate-visible repo state. Either separate branch/worktree or gitignored space.
    status: pending
  - id: ws-p7-async-sync-mode-awareness
    content: Add work-shape awareness to the polling/watch protocol so design (sub-second), execution (minutes), and monitoring (hour+) each get the right cadence.
    status: pending
  - id: ws-subsumed-residual
    content: Carry forward the residual non-subsumed workstreams from primary-agent-tooling-enhancements.plan.md (comms render resilience F-05 finishing pass, identity-build-isolation split, register closeout).
    status: pending
isProject: false
---

# Cost-of-Collaboration — Agent-Tools Improvement Plan

## One-line framing

Owner standing direction: *"lowering the cost of collaboration will increase
the rate of innovation and advancement"* (2026-05-11). Every workstream in
this plan is evaluated against the single metric **cost-per-coordination-
event in agent-count-aware terms**.

## Scope

This is the single source of truth for agent-tools improvement work. It
subsumes:

- [`primary-agent-tooling-enhancements.plan.md`](primary-agent-tooling-enhancements.plan.md)
  — the pre-2026-05-11 workstream split. The completed work (shared CLI
  discoverability via F-01/F-02/F-04/F-09/F-12/F-13) remains landed; the
  remaining workstreams are re-homed inside this plan's P-order.
- The 19-entry [frictions register](../frictions-register.md) — remains
  the source of truth for issue inventory. This plan's workstreams point
  at the relevant friction IDs.
- The locked sidebar design for B-11 directed-message authoring at
  `.agent/state/collaboration/sidebars/cli-comms-inbox-design-2026-05-11.md`.

This plan does NOT re-execute work that has already landed (B-10 compat
shims landed at `0be469a9`; F-15 fingerprint-recursion guard landed at
`70e746a3`). It re-frames the *remaining* and *newly-named* work in a
single P-ordered list.

## Structural insights driving the P-order

The 2026-05-11 four-agent session (Wooded / Galactic / Flamebright /
Sparking Charring Ash) generated convergent evidence across four
independent napkin entries. Five load-bearing insights:

1. **Pre-commit gates scanning ambient tree, not staged content, is the
   single load-bearing defect blocking every multi-agent protocol.** No
   coordination discipline survives a snapshot that goes stale the moment
   any peer agent writes another file.
2. **Peer-pair sidebars beat coordinator+helpers for design.** Helpers
   are for parallel execution of decided work; design requires dialogue
   between comparable agents.
3. **Information density per turn > round-trip latency.** Coordination
   cost compounds geometrically with agent count, not linearly.
4. **Coordination artefacts are tree-state mutations.** A coordinator
   who writes 31 directed messages adds 31 files; each can trip a gate.
5. **The advisory predictor is the protocol's weakest joint.** Anything
   that *can* be skipped *will* be skipped under pressure. Commit queue,
   claim registry, comms protocol — each is advisory; each was skipped
   by at least one agent in this session.

The P-order below sorts strictly by which insight each workstream
addresses, with P0 being the load-bearing prerequisite.

## Standing constraints

- **Block all multi-agent collaboration windows on Workstream P0 landing.**
  This is non-negotiable. Without staged-only gates, no amount of agent
  discipline produces reliable commits in multi-writer windows.
- **Test-first per the TDD-as-design directive.** Every bug-fix slice
  lands the failing test in the same atomic commit as the fix.
- **Schema-first per the schema-first-execution directive.** Type flow
  from schema; no widening; compat at boundary; strict at write.
- **No advisory-only protocols going forward.** Any new protocol layer
  must include a structural enforcement path or it does not land.
- **Capture-as-you-go.** Insights, frictions, and corrections land in
  the napkin during the session, not after.

## Workstreams

### P0 — Staged-only pre-commit gates

**Hypothesis**: pre-commit hook scans the entire working tree (staged

- unstaged + untracked) at hook-fire time. In a continuous-write
multi-agent window this guarantees gate failures on files that have
nothing to do with the committing agent's staged content. The fix is
to gate against staged content only and move repo-wide gates to CI.

**Evidence**: three serial deadlock iterations on 2026-05-11 — knip on
peer-unstaged code, prettier on peer-unstaged code, markdownlint on
coordinator-authored file written after the gatekeeper sweep. See
[`feedback_pre_commit_hook_must_gate_staged_only`](../../../../.claude/projects/-Users-jim-code-oak-oak-open-curriculum-ecosystem/memory/feedback_pre_commit_hook_must_gate_staged_only.md)
(claude-code agent-local memory; cross-platform mirror under owner
direction if required).

**Concrete shape**:

- Introduce `lint-staged` (or equivalent staged-list-derived runner)
  for prettier, markdownlint, ESLint-on-changed-files, format.
- Move full turbo `type-check + lint + test` to CI only.
- For knip and depcruise (graph-shaped, need consistent project state):
  decide whether they run pre-push or CI-only; do not run pre-commit.
- Regression test: a working-tree scenario where Agent A has unstaged
  violations and Agent B's staged-clean commit succeeds.

**Acceptance**:

- Multi-writer scenario passes its regression test.
- Documented hook runtime drops by >50% on a representative commit.
- The agent-tools test suite passes unchanged.
- Existing CI surfaces the gates that moved out of pre-commit.

**Routing**: this is a `.husky/pre-commit` + `package.json` change, NOT
inside agent-tools/src. The fix lives at the repo root. It should not
be bundled with agent-tools workspace changes.

**Risk**: lint-staged maintenance shape; existing turbo orchestration
of pre-commit gates needs preserving in CI. Some gates (knip, depcruise)
may need their own staged-aware variant — that is the slice's design
problem.

---

### P1 — `comms direct` + `comms reply` (B-11)

**Hypothesis**: hand-authoring a JSON file with UUID, ISO timestamp,
full identities, kind, subject, body for every directed message imposes
a ~60s per-turn floor. With four agents and multiple threads that floor
caps coordination at ~1 decision per minute.

**Evidence**: 31 hand-authored directed messages in the 2026-05-11
session; observed friction at F-obs-A in comms-event `37ea0341`
authored 2026-05-11T19:52:42Z.

**Design**: locked in
[`.agent/state/collaboration/sidebars/cli-comms-inbox-design-2026-05-11.md`](../../../state/collaboration/sidebars/cli-comms-inbox-design-2026-05-11.md)
across Turn 1 + Turn 2 + Turn 3 + joint decision. Summary:

- New file `agent-tools/src/collaboration-state/cli-comms-messages.ts`
  (NOT in `cli-comms-inbox.ts` which stays read-side only).
- `comms direct --messages-dir --to-agent-name --to-platform --to-model
  --to-session-prefix --kind --subject --body [--event-id] [--now]`.
- `comms reply --messages-dir --to-event-id --kind --body [--subject]
  [--event-id] [--now]` with auto-swap of `from`/`to` from the source
  event, subject-convention threading (`re: <source>`), no schema
  change.
- Input-time validation + parser-readback after write.
- Both auto-fill `from` via existing identity-from-env resolution.
- Output: `wrote directed message <event_id> to <path>`.

**Test-first cycle (locked in sidebar)**:

1. Integration test for `comms direct` round-trip through
   `readDirectedCommsMessages`.
2. Implement minimal writer/composer.
3. Add `comms reply` test using direct as fixture source.
4. Implement reply path.

**Acceptance**:

- Both subcommands ship in one atomic commit each (or one combined
  commit; implementer's call as long as TDD-as-design holds).
- Sidebar joint-decision survives implementation pass without
  re-opening locked questions.
- Reduces a coordination round-trip from ~60s authoring + 30s poll to
  ~1 CLI call + 30s poll.

**Routing**: claim area `agent-tools/src/**`. Implementer: Galactic
Transiting Orbit when their session resumes, or any next agent who
picks up the agent-tooling lane.

**Deferred follow-ons (NOT in B-11, tracked here for visibility)**:

- F-obs-A.1 — identity lookup ergonomic. `comms direct` should accept
  `--to-agent-name <name>` alone and auto-resolve platform/model/prefix
  from `active-claims.json`. Warn-then-write if not registered. Slice
  follow-on after B-11 stabilises.
- F-obs-A.2 — bulk inbox-from-stdin reply. Pipe `comms inbox` to a
  bulk-replier for `coordination-ack`-style fanout.

---

### P2 — `comms watch` with fs.watch

**Hypothesis**: 30s poll cadence is too slow for dialogue and wasteful
for idle. Filesystem-event latency (sub-second with `fs.watch`) is the
right floor; polling is the right fallback for filesystems where watch
is unreliable.

**Evidence**: peer sidebar at 30s polls produced one productive design
exchange per minute — adequate, but the cost compounded across the four
agents in the broader window. Galactic's session-close findings
(directed comms-message
`198ee1a4-85d9-4313-af7a-bd3e2e49a9d3.json` under
`.agent/state/collaboration/comms-messages/`): "the comms inbox
monitor command is useful but still rebuild-heavy because the package
script runs build before each poll."

**Design** (from sidebar Turn 2 + Turn 3):

- Node-native `fs.watch` + polling fallback. Do not introduce chokidar.
- Long-running CLI process; one line per new event to stdout; pipe to
  any consumer (Claude Code Monitor, Codex session log, etc.).
- Filter by recipient (agent_name + session_id_prefix tuple) or
  audience routing.
- Injected polling-interval / fake source for tests to avoid fragile
  fs timing.

**Acceptance**:

- Sub-second median latency from message write to consumer notification
  under fs.watch.
- Polling fallback exercised in test suite.
- Replaces the bash poll-loop pattern documented in
  `feedback_periodic_comms_check`.

**Routing**: same claim area as P1; sits next to or inside
`cli-comms-inbox.ts`.

---

### P3 — Enforced commit queue

**Hypothesis**: the commit queue is currently advisory. Anything that
can be skipped will be skipped under pressure. Sparking Charring Ash
skipped it on 2026-05-11 ("queue-list-only read, not active-claims
read"; "`git add` before enqueue") and immediately hit the predicted
collision (`.git/index.lock`). The fix is structural enforcement.

**Evidence**: Sparking Charring Ash napkin entry 2026-05-11; the
`feedback_no_lock_wait_loops` memory referenced "Owner-flagged future
option: 'committing claims' in the shared log" — this is that work.

**Concrete shape**:

- A commit-queue CLI guard invoked before any `git add` (Git/Husky
  have no native `pre-stage` hook; enforcement lives in the
  agent-tools CLI wrapping `git add`, or in a documented precondition
  check that the `jc-commit` skill runs before staging). The guard
  reads `active-claims.json`, finds an active `git:index/head` claim
  belonging to the current identity matching the staged file set; if
  none, refuses with a clear error naming the queue-enqueue command.
- Skill `jc-commit` updates to ensure the enqueue step runs before any
  `git add` invocation. Already documented; needs enforcement teeth.
- Friction F-08 and F-11 referenced in the existing primary plan are
  related; ensure their workstreams compose with this enforcement.

**Acceptance**:

- Regression test: an agent that tries to `git add` without an open
  intent fails with the expected error.
- An agent with an open intent matching the stage proceeds normally.
- Concurrent stage attempts by two agents claim-collide on the
  registry, not on `.git/index.lock`.

**Routing**: hook + agent-tools CLI; touches the same area as P0 and
shares review surface.

---

### P4 — Identity disambiguation

**Hypothesis**: the current `(agent_name)`-based routing reproduces
"two-people-named-John" failures. The session demonstrated this
directly: two "Wooded Spreading Thicket" sessions co-existed (one
claude-code, one cursor monitor), and the comms-log filtering
collapsed.

**Evidence**: shared-comms-log entries from 2026-05-11T20:06–20:15Z
where a cursor-Wooded telemetry process and the claude-code Wooded
coordinator both wrote under the same `agent_name`. Identity-routing
fragility.

**Concrete shape**:

- All claim writes refuse if `(agent_name, platform, session_id_prefix)`
  matches a live claim by another identity tuple.
- All directed-message writes use the full tuple for `from` and `to`;
  reads can match on any subset but routing key is the tuple.
- Identity preflight (`identity preflight --platform <p> --model <m>`)
  must produce a unique tuple; collisions force a wordlist re-seed
  rather than reuse.

**Acceptance**:

- Two sessions with the same name on different platforms can co-exist
  without comms-log filter collapse.
- A re-used `session_id_prefix` triggers a clear preflight error.

**Routing**: `agent-tools/src/collaboration-state/identity*` files and
the wordlist resolver. Composes with F-13 (identity routing
expectations) from the existing primary plan.

---

### P5 — Unified comms format

**Hypothesis**: three sibling directories (`comms-events/`,
`comms-lifecycle/`, `comms-messages/`) with three `$defs` (narrative,
lifecycle, directed) is duplicate structure. Each agent has to know
which directory for which event family; each parser consumes from three
locations; renderers handle three families. The B-10 compat shims that
landed at `0be469a9` patch the renderer-side compatibility surface; the
underlying duplication remains.

**Evidence**: owner-relayed direction via Flamebright 2026-05-11T20:05Z:
"ONE comms format used everywhere, no legacy lingering." Galactic's
directed comms-message
`198ee1a4-85d9-4313-af7a-bd3e2e49a9d3.json` (under
`.agent/state/collaboration/comms-messages/`) session-close finding
number 4: "in this shared working tree, any
new uncommitted coordination artefact after a clean gate sweep can
invalidate a peer commit. Gatekeeper specialisation alone is
insufficient without either commit isolation or a queue protocol that
freezes/absorbs post-sweep artefacts."

**Concrete shape**:

- One canonical schema with `kind` discriminant (narrative / lifecycle
  / directed); one directory; one parser surface.
- Migration: one-shot normaliser moves existing events into the unified
  location and shape. Deletes the B-10 tolerant-read shims as part of
  the migration cycle (architecture-expert-fred's standing condition
  from the B-10 review).
- Retire the three-`$defs` schema; replace with one schema and a
  discriminant.
- ADR or PDR records the consolidation decision and the deletion of
  the three-directory shape.

**Acceptance**:

- Single directory, single parser, single renderer path.
- All historical events readable through the new path post-migration.
- The B-10 compat helpers (`optionalNullableString`,
  `optionalStringOrLegacyAgentName`) deleted in the same migration
  commit.
- Renderer no longer sensitive to legacy optional-field shapes (the
  source data is normalised).

**Routing**: schema authority + parser + renderer + migration script.
Large slice; design phase needs its own peer sidebar before
implementation. Should NOT be attempted concurrently with active
multi-agent traffic — schedule for a single-agent window or a coordinated
pause.

---

### P6 — Coordination-artefact isolation

**Hypothesis**: sidebars, comms-events, comms-messages, monitor
telemetry, and napkin updates live in the same tree as code. Every
write to them mutates the gatekeeper's tree-state and can trip a gate.
A coordinator necessarily writes coordination artefacts; therefore the
coordinator is necessarily a tree-state polluter under the current
shape.

**Evidence**: iteration 3 of the 2026-05-11 deadlock was triggered by
**my own** sidebar file failing markdownlint. The defect was authored
by the coordinator role itself.

**Concrete shape** (options to design under P5's umbrella or as its own
slice):

- (a) Separate branch / worktree for coordination artefacts. Comms,
  sidebars, monitor telemetry, claims state all live on a coordination
  branch that doesn't share gates with feature work.
- (b) Gitignore the coordination directory tree; persist via a separate
  ledger (sqlite, JSONL append-only file, or external store).
- (c) Make the pre-commit gates blind to specific directories (e.g.,
  `prettier --check . --ignore-path .prettierignore-with-coord-dirs`).
- (d) Combination — gates blind in pre-commit, full check in CI nightly
  hygiene.

**Acceptance**:

- A coordinator writing 31+ artefacts in a session does not block any
  peer agent's commit.
- Coordination artefacts remain durable and readable.

**Routing**: depends on (a)–(d) choice; design sidebar required.

---

### P7 — Async/sync mode awareness

**Hypothesis**: design work needs sub-second latency; execution work
tolerates minute-scale polls; monitoring tolerates hour-scale. Currently
every channel is fixed-cadence regardless of work shape.

**Evidence**: the productive sidebar at 30s polls was constrained;
background monitors at 30s polls were noisy. The right cadence is
work-shape-dependent.

**Concrete shape**:

- `comms watch` (P2) supports `--mode design|execution|monitor` with
  appropriate cadence defaults.
- Inbox shape: directed messages in `--mode design` poll sub-second;
  in `--mode monitor` poll every 5–30 minutes.
- Eventual: protocol-level mode hint on directed messages so receiver
  knows expected response cadence.

**Acceptance**:

- Sidebar-shaped conversations at sub-second latency without coordinator
  manual cadence selection.
- Monitor processes contribute negligible telemetry volume.

**Routing**: builds on P2; should not land before P2 stabilises.

---

### Subsumed-residual workstreams (from primary plan)

These are the not-yet-landed workstreams from the prior
[`primary-agent-tooling-enhancements.plan.md`](primary-agent-tooling-enhancements.plan.md)
that this plan absorbs. Status updates and acceptance criteria already
documented there; this section is a routing cross-reference only.

Supersession mapping (per `consolidate-docs § Plan supersession
discipline`): each prior `todos:` id from
[`primary-agent-tooling-enhancements.plan.md`](primary-agent-tooling-enhancements.plan.md)
mapped verbatim to its new owner P-workstream and acceptance lane.

| Prior id (verbatim) | New owner | Acceptance lane | Rationale |
| --- | --- | --- | --- |
| `collaboration-read-apis` | P1 (write-side) + already-landed read | P1 acceptance + commit `0be469a9` for read-side in HEAD | Read-side landed implicitly in Galactic's B-10 commit; write-side is value-bearing remainder. |
| `comms-render-resilience` | P5 | P5 acceptance | F-05's malformed-file contract is structurally subsumed by the unified-format migration that removes legacy shapes. |
| `commit-queue-safety` | P3 + F-15 already landed at `70e746a3` | P3 acceptance | Residual is exactly P3's enforcement scope (refuse `git add` without active intent). |
| `identity-build-isolation` | P4 | P4 acceptance | Build-isolation (F-08) and routing (F-13) unify under identity-tuple correctness. |
| `register-closeout` | All P-workstreams (closeout-per-slice) | Each P-workstream's own closeout step | Operational, not a slice — runs at end of every slice. |
| `shared-cli-discoverability` (completed) | Already landed in working tree | n/a | Closed before this plan; listed for verbatim completeness. |

Cross-cutting friction-IDs explicitly routed: **F-05** → P5; **F-06,
F-07, F-10** → P1 write-side; **F-08** → P4; **F-13** → P4; **F-15**
→ already landed at `70e746a3`; **F-16** → routed to
[`skills-standardisation-and-adapter-generator.plan.md`](skills-standardisation-and-adapter-generator.plan.md)
per the prior plan's own routing line; **B-02, B-03** → P3 enforcement
work.

No verbatim id is dropped without a destination; no destination is
named without an acceptance lane.

## Sequencing

Strict P-order. P0 is the load-bearing prerequisite. Do not start any
P1+ workstream as part of a multi-agent window until P0 lands.

Single-agent windows can implement P1 (B-11), P2, and P5 design phase
in parallel with P0 if claim areas don't overlap. The implementing
agent must declare the work as "single-agent-window only" in their
opening commitment and refuse co-active multi-agent collaboration until
P0 lands.

## Validation

Each workstream defines its own acceptance. The plan-level validation:

- After P0 lands, repeat the 2026-05-11 multi-writer scenario with two
  agents (no need for four): one with unstaged coordination artefacts,
  one with a staged-clean commit. Commit succeeds.
- After P1 lands, a coordination round-trip drops from 4-tool-call
  hand-authored JSON to 1 CLI call.
- After P3 lands, an agent skipping the queue at `git add` time fails
  with a clear error citing the queue command.
- After P5 lands, the three comms directories are gone; the renderer
  no longer carries compat shims.

## Owner-direction status

- "lowering the cost of collaboration will increase the rate of
  innovation and advancement" — **standing**.
- "everything has ground to a halt, because everyone ends up waiting
  for everyone" — **standing for the 2026-05-11 architectural reset**;
  block multi-agent windows on P0.
- "ONE comms format used everywhere, no legacy lingering" — **standing**;
  P5 carries this.
- "the intense partner sidebar is going a lot better than the
  coordinator and helpers topology" — **standing observation**;
  reflected in the structural insights and in the
  [`peer-sidebar-beats-coordinator-helpers`](../../../../.claude/projects/-Users-jim-code-oak-oak-open-curriculum-ecosystem/memory/feedback_peer_sidebar_beats_coordinator_helpers.md)
  feedback memory.
- "any genuinely useful improvements to the agent tools CLI should be
  noted for implementation" — **standing**; comms-event `37ea0341`
  captures the F-obs observations.

## Pointer to prior plan

[`primary-agent-tooling-enhancements.plan.md`](primary-agent-tooling-enhancements.plan.md)
is **subsumed by this plan** as of 2026-05-11. Its completed
workstreams remain landed in working tree; its remaining workstreams are
cross-referenced under "Subsumed-residual workstreams" above. The prior
plan should be archived to `archive/` after this plan's first review
pass; until then it is retained as a back-pointer for any agent reading
older napkin/comms references.

## Pointer to design artefact

The locked B-11 design lives in
[`.agent/state/collaboration/sidebars/cli-comms-inbox-design-2026-05-11.md`](../../../state/collaboration/sidebars/cli-comms-inbox-design-2026-05-11.md).
Treat the joint-decision section at the foot of that file as P1's
binding scope until implementation lands.
