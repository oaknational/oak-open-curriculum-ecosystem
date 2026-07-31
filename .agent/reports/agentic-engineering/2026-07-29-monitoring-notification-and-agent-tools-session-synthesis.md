# From seeing to waking — monitoring, notification, and agent-tools synthesis

**Date:** 2026-07-29

**Seat:** Europa stirs Void (`codex` / `GPT-5`, session prefix `019fad`)

**Scope:** the Europa boundary of the 2026-07-29 Oak team session

**Primary tickets:** MCP-360 (delivered) and MCP-373 (successor work)

**Authority:** evidence and proposals only where explicitly marked; repository
doctrine, accepted plans, Linear, merged Git history, and live collaboration
state retain their own authority.

## Review contract

This report preserves what happened, what changed in our understanding, what
tooling now exists, and what remains. It is deliberately more complete than a
normal handoff because the owner asked for the whole session to be written up.

Review should test four things:

1. Every delivered-state claim is tied to merged or current repository truth.
2. Observation, interpretation, proposal, and accepted work are not blurred.
3. The next executor can resume MCP-373 without replaying this investigation.
4. The publication-boundary custody statement matches the collaboration
   registry and composes cleanly with the final closeout event.

It does **not** declare MCP-373 implemented, turn sub-agent recommendations into
ratified design, or claim that an open documentation PR is already on `main`.

## Outcome in one page

The session began with a deceptively simple requirement: do not merely detect
new team messages; alert the reasoning loop when they arrive. That distinction
became the organising fact of the lane.

MCP-360 delivered the first verified, session-scoped Codex notification path:

- `comms watch` can be armed without hand-assembling the coordination-home and
  seen-file paths;
- its default source and F-95 watcher-presence guards agree on the primary
  coordination home;
- watcher protocol schema `0.2.0` binds the heartbeat to its absolute comms
  source;
- the reproducible Codex `NOTIFY` composition is documented as a root watcher
  plus a distinct relay child;
- a directed external event proved watcher → relay → root notification without
  a manual poll or user prompt.

That work merged in
[PR #631](https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/631)
at exact head `58324ee0b896d996b39939268f11b1a5c67813db`, merge commit
`34e88477bd8dd0c35d9f0a75f616141f7a7d76c1`, at
`2026-07-29T16:34:46Z`.

The owner then asked that the remaining hand-rolled monitoring recipes be
recorded and, where sensible, turned into standard agent tooling. MCP-373 now
holds those recipes. This session investigated their implementation boundary
but intentionally did not start code: the recipes span three distinct state
machines plus a stateless watcher-arming composition. They should not be
collapsed into one unreviewable monitor.

One proposed implementation sequence is:

1. finish coordination-home read defaulting, then add
   `comms peer-liveness --watch`;
2. add a one-claim `claims heartbeat-loop`;
3. implement the already-planned `agent-tools pr watch` over the canonical PR
   state model;
4. re-ground the older watcher-command-emitter plan against MCP-360 before
   deciding what emission remains useful.

At terminal closeout, MCP-373 is deliberately **not complete**. Its researched
pickup ground is this report, its Linear issue, and the plans cited below.

## The session as it happened

### 1. Start-right and the alert challenge

Europa entered as an Oak team member, grounded in the repository, established
the live identity and collaboration home, opened the MCP-360 lane, and armed
the root-identity watcher. A distinct child relay, Cutter rides Sandbar, was
then used to test the host notification boundary.

The first important correction was conceptual: watcher stdout is not an alert.
A live process, a fresh heartbeat, or an advancing cursor proves only parts of
the path. The owner-facing requirement was that new information cause a
reasoning turn.

Lynx guards Whisper sent directed event
`b6a4103c-e7fe-4ac6-9447-0a102d55dbbd` at
`2026-07-29T11:43:23.686Z`. The root was woken through watcher → relay → root
without a root manual poll or user prompt. The dated observation is recorded
in
`.agent/memory/executive/cross-platform-agent-surface-matrix.md`; the operating
procedure is canonical in
`.agent/rules/use-monitor-for-event-driven-wake.md`.

This split is intentional:

- the root watcher owns the root identity's cursor, source-bound heartbeat, and
  F-95 attestation;
- the relay has its own identity and cursor and owns host notification;
- the relay must never impersonate the root or satisfy the root's liveness
  gate.

### 2. MCP-360 was shaped, implemented, reviewed, and merged

MCP-360 was sized as a coherent coordination-home slice rather than the whole
historical migration. Its delivered surface is represented by these completed
items in
`.agent/plans-backlog-2026-07/agent-tooling/current/coordination-home-cli-path-defaulting.plan.md`:

- WS1a — default the atomic watch path pair;
- WS2a — default claims registry paths;
- WS3 — bind F-95 to the canonical primary-home heartbeat;
- WS4a — migrate watcher doctrine and record the Codex notification
  composition.

The implementation reached a reviewed exact head and merged as PR #631. The
GitHub PR record reports 57 changed files, 2,250 additions, and 741 deletions.
Its
load-bearing behaviour is:

- omitting both watch paths resolves the primary coordination home and derives
  the exact-display-name cursor;
- supplying only one path is rejected;
- supplying an explicit pair remains an intentional override;
- both required parent directories are created;
- `PRACTICE_COORDINATION_HOME` is carried through production command
  composition;
- watcher heartbeat protocol `0.2.0` records the absolute
  `watched_comms_dir`;
- `assert-watcher-live` and the claims-open guard require both identity and
  source equivalence;
- protocol fixtures and validators are strict rather than permissive mirrors;
- canonical docs teach the one-invocation watcher and the Codex relay.

The remaining coordination-home plan items are still pending:

- WS1b — default `comms inbox`, `list`, `show`, and `peer-liveness` reads;
- WS2b — default the still-required direct/reply and commit-queue paths, after
  re-deriving the live command set;
- WS4b — migrate remaining invocations after their commands support defaults;
- WS5 — reconcile the plan estate and close the F-41 worktree-coordination
  friction tail.

“MCP-360 merged” therefore means its accepted slice is complete. It does not
mean the entire coordination-home migration is complete.

### 3. Temporary lane swap

At the owner's direction, Europa and Osprey hunts Drift temporarily exchanged
lanes.

Europa handed the live MCP-360 implementation and its exact evidence to Osprey.
Osprey finished the PR lifecycle and the merge. Europa adopted the MCP-366
brand-removal lane and made one narrow custody cure: commit
`cdf28fc2c6477cff6350fc2ae92e3e5ccbb8b150` removed three obsolete tombstone
lines. The commit is now an ancestor of the current MCP-366 branch and was
absorbed into Osprey's continuing work; Europa retained no brand claim.

When the owner swapped the lanes back, Osprey returned MCP-373 with an explicit
zero-state note: no implementation or hidden design work had accrued during
the exchange. Europa resumed MCP-373 only to investigate and prepare its
handoff. This matters because the absence of code is not missing custody:
there genuinely was no MCP-373 implementation to transfer.

### 4. MCP-373 was investigated, not implemented

MCP-373 records four working recipes:

1. an F-75 peer-heartbeat-silence and retirement delta poll;
2. a 240-second dual-surface claim heartbeat;
3. the canonical all-channels watcher arming wrapper;
4. a PR settle watch.

Two read-only architecture passes were commissioned. Their recommendations are
evidence for the next executor, not ratified decisions:

- the CLI architecture pass analysed peer-liveness and heartbeat-loop
  boundaries;
- the PR-state pass analysed the settle watcher against the existing `pr
  state` code and D2 plan.

Together they showed that the original “make a CLI wrapper” frame was too
coarse. The three monitors each have their own state, reset semantics, failure
policy, and terminal condition. Watcher arming is instead a stateless
command/setup composition. Shared primitives are useful; a mega-loop is not.

No MCP-373 product files, tests, branch implementation, or delivery PR were
created in this session.

## Concept exploration — how the frame changed

### Movement 1: raw observation

The owner asked for background processes that would both detect and **alert**
on new messages. Existing practice often used “watching” to cover several
different facts: a process existed, a cursor moved, output was printed, or an
agent eventually noticed.

The harm was not theoretical. A directed grant could already be marked seen
while the reasoning loop remained unaware. That happened during the MCP-360
handoff: Osprey's cursor consumed a key grant, but cognition did not act on it;
the relay alerted Europa, who relayed the exact grant. The transport worked and
the human-visible work still nearly stalled.

### Movement 2: the boundaries separate

The path is at least five independently testable layers:

| Layer | Question | Evidence that counts |
| --- | --- | --- |
| Source | Did the event exist in the intended coordination home? | Exact event and source |
| Process | Is the watcher alive? | Supervisor/process and fresh heartbeat |
| Delivery | Did the right cursor advance? | Cursor and source-bound heartbeat |
| Notification | Did the host wake the reasoning loop? | External event caused a new turn |
| Cognition | Was the information used? | Content-bearing reply or changed action |

Outbound liveness adds two more related surfaces: comms heartbeat emission and
claim-registry freshness. Current rules require every tick to update both
separately observable surfaces using one derived timestamp. The later Slice B
proposal packages and failure-handles that invariant; it does not introduce it.

The useful invariant is:

> A monitor may claim only the layer it directly attests.

A process cannot certify cognition. A cursor cannot certify notification. A
relay cannot certify the root's delivery cursor. A fresh registry heartbeat
cannot certify a comms event was emitted.

### Movement 3: the mechanism becomes compositional

The working Codex composition uses two observers because the host boundaries
are different:

```text
canonical comms source
  ├─ root watcher → root cursor + source-bound heartbeat → F-95 delivery proof
  └─ relay watcher → relay child → collaboration message → root wake
                                                    └─ root response → absorption proof
```

This is not needless duplication: the two processes carry different
identities, cursors, and evidence obligations. They should be started and
stopped as a pair, but never conflated.

The same compositional rule applies to MCP-373. Put scheduling, clocks,
transition emission, and retry/failure plumbing in shared code where that
reduces drift. Keep peer retirement, claim heartbeat, and PR settlement as
explicit state machines; keep watcher arming an explicit stateless command/setup
composition.

### Movement 4: a falsifiable successor shape

Each proposed slice below states why it exists and what would falsify the
shape.

#### Slice A — read defaults plus peer-liveness watch

**Proposal:** complete coordination-home WS1b, expose a structured
peer-liveness report, and then add `comms peer-liveness --watch` with a
transition-silent initial baseline and semantic transition emission.

Here, **transition-silent** means the initial snapshot emits no semantic
transition event. Whether it emits one operational status line remains an
implementation choice.

**Warrant:** the current one-shot reader is the right domain boundary, but
hand-written shell dedup used rendered lines containing changing ages and
generated false “new retirement” noise.

**Falsifier:** if the structured reader cannot expose a stable routing key
without duplicating liveness classification, pause and fix the reader boundary;
do not parse prose output.

Open design choices for the implementation plan:

- lifetime `SEEN` versus a rolling previous-state set;
- whether the transition-silent baseline also suppresses operational output or
  emits one status line;
- whether explicit claim closure suppresses a later retirement transition;
- whether errors terminate, retry with a typed transition, or both.

#### Slice B — dual-surface heartbeat loop

**Proposal:** add `claims heartbeat-loop --claim-id <id>` as a supervised,
single-claim process. At each tick, derive one timestamp, attempt both the
comms event and registry update, and surface partial failure in-band.

**Warrant:** two independently hand-authored commands drift, and a mid-seat
model string mismatch has already allowed watch/assert while making `comms
send` fail.

**Falsifier:** if one process cannot attempt both legs without hiding one
failure or violating the collaboration use-case boundaries, retain a thin
supervisor over two typed in-process use cases rather than creating a false
atomic transaction.

The loop must derive the model string verbatim from the live claim/registry,
not from remembered platform shorthand. It must bind to a supervisor, stream
stderr, and stop before claim closure.

#### Slice C — canonical PR settle watch

**Proposal:** first extend and validate D1's canonical `pr state` model with
the missing readiness inputs named below, including exact-head named-workflow
presence. Then implement the already-planned D2 `agent-tools pr watch <n...>`
over that model. Emit an initial transition-silent baseline, semantic
transitions, an explicit `HEAD_CHANGED` epoch reset, NDJSON, `--until`, and
distinct terminal exit codes.

**Warrant:** the repository already owns a typed PR-state reader. The legacy
top-level `pr-watch` helper captures and displays `mergeable` and
`mergeStateStatus`, and folds returned check runs and status contexts,
including Vercel when present, into generic pass/fail/pending buckets. But its
`isAllGreen` predicate declares success too weakly: one generic passing status,
no failing or pending statuses, and no open threads. It does not independently
require combined-status or Vercel presence, ignores the captured mergeability
fields, hard-codes the check floor at one, and has no named-workflow-presence
leg for CI-silent runs.

**Falsifier:** if live GitHub response shapes cannot be represented without
weakening the existing typed boundary, update and validate D1 first. Do not
bolt unvalidated JSON parsing onto the loop.

The ready conjunction should retain every input leg in the snapshot:

- exact-head paginated check runs;
- combined commit status, including Vercel;
- unresolved review threads;
- positive mergeability while preserving `mergeStateStatus`;
- a configurable positive check floor;
- exact-head named workflow runs, so a missing trigger cannot look like
  perpetual settlement.

The implementation still needs first-hand validation of current GitHub API
shapes. The read-only architecture pass did not perform that live check.

#### Slice D — watcher command emission

**Proposal:** re-ground
`.agent/plans-backlog-2026-07/agent-tooling/current/coordination-watcher-canonicalisation.plan.md`
against merged MCP-360 before implementation.

**Warrant:** the plan predates source-bound watcher schema `0.2.0`, path
defaulting, and the certified Codex relay. Its WS2 currently assumes the older
explicit-path command shape.

**Falsifier:** if the one-invocation canonical rule is already sufficiently
stable and executable, do not add an emitter merely to reproduce it. Keep only
the parts that eliminate a demonstrated drift class, including any still-valid
work for the co-equal ArcAngel rapid-communication channel.

## Tooling state and sharp edges

### What now works

- Canonical `comms watch` path omission from a linked worktree.
- Atomic explicit path override.
- Parent-directory creation.
- Source-bound watcher heartbeat schema `0.2.0`.
- F-95 identity **and** source equivalence.
- Codex watcher → relay → root notification, with a dated external proof.
- A durable operating recipe in
  `.agent/rules/use-monitor-for-event-driven-wake.md`.
- A platform declaration in
  `.agent/memory/executive/cross-platform-agent-surface-matrix.md`.

### What does not yet work or remains unproved

1. **`assert-watcher-live --agent-name` deterministic false-negative.**
   `agent-tools/src/collaboration-state/cli-self-identity.ts` puts the named
   form into override derivation, while
   `agent-tools/src/collaboration-state/active-agent-routing.ts` compares the
   resulting UUID. A live heartbeat rejected by the named form passed with the
   live platform/model/session-prefix tuple against the same source. The safe
   successor acceptance is:

   - resolve the canonical live identity named by `--agent-name`, or remove or
     constrain the ambiguous form;
   - regression-test both forms against the same heartbeat;
   - preserve strict source binding;
   - distinguish unknown/ambiguous identity from stale/foreign watcher.

   This finding is related to, but distinct from, MCP-380's same-name cursor
   collision and MCP-383's model-string binding drift. A separate Linear issue
   was **not** created during this wrap because the external-write safety gate
   required a more explicit user instruction. Lynx guards Whisper, the session
   Director and MCP-373's at-rest owner, receives the routing action in the
   terminal handoff.

2. **Model spelling differs across commands.** Watcher routing tolerates a
   mid-seat model-string mismatch because the UUID remains the routing signal;
   `comms send` checks the fuller tuple and can fail. MCP-383 owns the broader
   inconsistency. Heartbeat-loop code must read the live registered spelling
   verbatim and expose stderr.

3. **A rebuild can strand old processes.** An in-memory schema `0.1.0`
   watcher becomes incompatible after `dist` is rebuilt to the stricter
   `0.2.0` validator. Long-running watchers must be rearmed after a build that
   changes their wire protocol.

4. **Relay liveness is session-scoped.** The Codex relay is not a daemon and
   is not self-rearming. Its child, exec session, 3600-second backstop, and
   cursor all need deliberate custody. A fresh session must reproduce and
   re-prove the path; yesterday's heartbeat is not today's notification proof.

5. **A seen cursor is not cognition.** Tooling can prove source, process,
   delivery, and notification. Absorption still needs an external observer or
   a content-bearing response. This boundary should remain explicit rather
   than be “solved” by inventing a self-certification.

## Proposed successor pickup

The following pickup sequence is proposed guidance for MCP-373, not ratified
direction:

1. Read MCP-373 and this report.
2. Re-read the live source before treating any command or option in the Linear
   recipe as current.
3. Start with `coordination-home-cli-path-defaulting.plan.md` WS1b and the
   structured `peer-liveness` domain code.
4. Author one PR-shaped plan for Slice A; do not claim all of MCP-373.
5. Keep each test and its production cycle in the same commit.
6. Route the `--agent-name` assertion defect to a separate issue before
   implementation, unless the Director identifies an existing exact owner.
7. Treat Slice C as D2 of
   `.agent/plans-v0-sketch-2026-07-21/practice/pr-state-instrumentation.plan.md`,
   not as a new third PR-monitor implementation.
8. Re-ground the watcher-canonicalisation plan only when Slice D is picked up.

## Custody and terminal disposition

- MCP-360: complete and merged through PR #631.
- MCP-373: implementation pending; researched handoff only. Europa emitted
  heartbeat-end event `00795f07-9c5f-475a-8b20-011c1ae81ce9`, then explicitly
  closed claim `8e9ea0d9-5c09-445a-b0d5-0a934c4a9ee1` at
  `2026-07-29T18:25:22Z`.
- MCP-373 at rest: Director-held by Lynx guards Whisper under the Director's
  acknowledgement `d40b4234-50a6-4cd0-9c20-9bf9089ae56c`. The
  `--agent-name` defect-routing action is included in the final direct handoff.
- MCP-366 brand work: returned to Osprey; Europa's small commit absorbed.
- Documentation delivery: this report and the formation letter are published
  from `jimcresswell/mcp-373-monitoring-session-synthesis`. The PR metadata and
  final handoff carry the exact review URL rather than making this report's
  first commit self-referential.
- Active workstream claims at publication: none for Europa. The only
  publication-time claim is the short-lived `git:index/head` commit window;
  its closure belongs to the post-commit terminal event.
- Background processes at publication: no heartbeat cron was running. The root
  watcher's one-hour backstop expired during wrap and F-95 correctly blocked
  the commit claim; it was rearmed before the claim opened. The root watcher
  and relay intentionally remain live through the final closeout broadcast.
  Their stop and exit verification are terminal-event evidence, because a
  report cannot both record and precede the act that stops its own alert path.
- Canonical team-session synthesis: Director-owned; this is the Europa
  boundary report, not a rewrite of peer-owned napkin or repo-wide continuity
  state.

## Knowledge-safety and loss scan

### What a first pass would otherwise lose

- The two architecture reports are recommendations, not accepted design.
- GitHub API shapes for the settle watcher were not live-validated.
- “MCP-360 complete” is a bounded slice, not completion of every
  coordination-home workstream.
- The brand commit was absorbed by another lane; it is not stray Europa work.
- MCP-373 accumulated no implementation during either side of the lane swap.

### What a second pass would otherwise lose

- The user's original promise was alerting plus a reproducible setup, not
  monitor ceremony for its own sake.
- The confirmed `--agent-name` defect needs its own owner, but no external
  ticket was authorised by the safety gate during wrap.
- Source, process, delivery, notification, and cognition are separate truth
  layers; the write-up must not compress them back into “watcher works”.
- Stopping the heartbeat loop before claim closure and stopping both incoming
  watchers at terminal exit are part of correctness, not housekeeping.

### Fixed point and external bound

A same-context loss scan cannot certify its own completeness. A fresh reader
can catch ambiguity and unsupported claims, but cannot reconstruct facts that
were never recorded. Relay filtering also deliberately omits heartbeat noise,
and sub-agent reports are bounded views.

A third pass would only re-find the already named classes: authority blur,
unverified external shapes, slice-versus-workstream completion, swapped-lane
custody, missing notification layers, and terminal process state. Recursion
closes here.
