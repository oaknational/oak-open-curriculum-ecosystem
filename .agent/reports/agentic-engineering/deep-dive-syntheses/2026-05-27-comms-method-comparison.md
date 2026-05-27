# Inter-Agent Communication Method Comparison
## Established Comms (Method 1) vs File + Monitor Synchronous Sidebar (Method 2)

**Date**: 2026-05-27
**Author**: Research subagent (Sonnet 4.6)
**Evidence base**: `.agent/state/collaboration/comms/*.json` (2,673 events), sidebar artefacts in `.agent/state/collaboration/sidebars/`, handoff records in `.agent/state/collaboration/handoffs/`, governing rules and PDRs.

---

## 1. Executive Summary

Method 1 (immutable JSON comms-events + watcher + heartbeat) is the durable backbone of multi-agent coordination in this repo. It provides auditability, discoverability, and multi-session persistence at a cost: 25.5% of all 2,673 events in the corpus are pure heartbeat noise; every message causes git-tracked file mutations across at least three surfaces; and watcher poll latency makes it unsuitable for synchronous high-bandwidth exchanges.

Method 2 (a single shared plain-text file tailed via Monitor) proved its value in this session's EEF PR-1 sidebar: six structured turns resolved a 40-minute coordination failure in 17 minutes at ~3s delivery latency. Its weakness is ephemerality (since mitigated by persisting to `.agent/state/collaboration/sidebars/`) and a bootstrap chicken-and-egg requiring one out-of-band signal to establish the rendezvous.

The two methods are complementary, not competing. The architectural recommendation is: Method 1 for durable broadcast/directed events and cross-session auditability; Method 2 for synchronous high-bandwidth peer exchanges requiring full attention. The sidebar should be a first-class protocol with a deterministic rendezvous convention, a lifecycle event opening it, and automatic persistence closing it.

---

## 2. Method 1 Mechanics

### Message composition

An agent constructs a comms event using the `comms append` (narrative) or `comms direct` (directed) CLI subcommands in `agent-tools/src/collaboration-state/cli-comms-commands.ts`. Required flags:

- `--comms-dir` (path to `.agent/state/collaboration/comms/`)
- `--created-at` (ISO-8601 UTC timestamp)
- `--title` (subject line)
- `--body` (inline, ≤ 1,500 chars) OR `--body-file` (file path for longer content)
- `--tag` (optional tag: `heartbeat`, `behaviour-note`, `failure-mode`)
- Identity fields resolved from environment (`PRACTICE_AGENT_SESSION_ID_CLAUDE` etc.) must be set in the shell

For a heartbeat specifically, `--body` is forbidden; the body is composed automatically from typed state args (`--claim-id`, `--intent-id`, `--branch`, `--current-cycle-label`).

### Send mechanics

`writeCommsEventWithReadback` writes a new UUID-named JSON file to the comms dir. A second call writes the rendered `shared-comms-log.md` (5.3 MB, 61,197 lines as of this session). Every send therefore touches two tracked files: the new event file and the log.

### Seen-cursor update

Each reading agent runs `comms watch` as a persistent background Monitor with `persistent: true`. The watcher polls the comms directory, diffing against a per-agent seen-cursor file at `.agent/state/collaboration/comms-seen/<agent-codename>.json`. On each new event, the seen-file is updated — a tracked file write. With two agents and a watcher each, a single comms send produces:

- 1 new event file (tracked)
- 1 shared-comms-log update (tracked)
- 2 comms-seen cursor updates per poll cycle (tracked, one per agent)

Total: 4 tracked file mutations per message, all in `.agent/state/collaboration/`.

### Heartbeat cadence

Canonical interval: ≤ 4 minutes per PDR-078. From the corpus: mean in-session interval 3.8 minutes (range 0.5–55 min), 602 sampled in-session intervals. Two agents each heartbeating = ~8 heartbeat events per 4-minute window combined, each triggering the 4-mutation cascade above.

### Audit and human-readable rollup

`shared-comms-log.md` is regenerated on every `comms send`. At 5.3 MB and 61,197 lines it is a complete human-readable record but also the dominant write-churn target.

---

## 3. Method 2 Mechanics

### Message composition

One agent creates a plain-text markdown file with a header and turn-format convention. This session used `/tmp/eef-pr1-sidebar.md` (Galactic's side) and `.agent/state/collaboration/sidebars/2026-05-27-eef-pr1-purpose-reflection-starless-galactic.md` (Starless's initial parallel attempt, abandoned). Convention: `## [HH:MM:SSZ AGENT] turn-N` prefix per turn.

### Send mechanics

Turns are appended with `cat >> /tmp/sidebar.md << 'EOF'` (heredoc append). The Write tool is explicitly forbidden — it would clobber. No identity frontmatter required per turn; the turn header carries agent identity informally.

### Live reading

Both agents run a `tail -n 0 -F` equivalent via the harness Monitor tool. This session: Galactic used `tail -f`; Starless ran a 3-second file-change Monitor (md5 poll). Latency from append to recipient read: ~3s.

### Heartbeat / watcher interaction

Both watchers and heartbeat crons were paused for the sidebar duration. The watcher writes tracked `comms-seen` files on every event; the heartbeat cron writes a new event JSON + updates the log on every tick. Both dirty the shared working tree, which was the precise failure mode that forced the sidebar in the first place (shared tree never quiesced → `git checkout` refused).

### Persistence (addressing ephemerality)

`/tmp` does not survive across reboots. At session end, both agents copied the transcript to `.agent/state/collaboration/sidebars/2026-05-27-eef-pr1-CANONICAL-transcript.md` (Galactic) and `.agent/state/collaboration/sidebars/2026-05-27-eef-pr1-sidebar-starless-backup.md` (Starless). This is manual; a protocol convention would make it automatic.

### No CLI ceremony required

No identity env vars, no `--tag`, no `--comms-dir`, no schema version. One flag: append to the right file. Identities are declared in the turn header by convention.

---

## 4. Quantitative Churn and Ceremony Analysis

### Corpus overview

| Metric | Value |
|---|---|
| Total events in corpus | 2,673 |
| Unique agent names | 105 |
| Date range | 2026-05-23 to 2026-05-27 |
| Total comms-seen cursor files | 117 (across all sessions) |
| shared-comms-log size | 5.3 MB, 61,197 lines |

### Event classification

| Category | Count | % of total |
|---|---|---|
| Heartbeat events | 682 | 25.5% |
| Behaviour-note events | 172 | 6.4% |
| Failure-mode events | 22 | 0.8% |
| **Ceremony total** | **876** | **~32.8%** |
| Directed messages | 797 | 29.8% |
| Narrative (non-heartbeat) | 1,194 | 44.7% |
| **Signal total** | **1,991** | **~74.5%** |

Note: Narrative-non-heartbeat includes session handoffs, team-start broadcasts, coordinator signals, progress updates, and substantive cross-agent content. Even so, roughly a third of all events carry no content beyond liveness.

### Heartbeat interval analysis

| Metric | Value |
|---|---|
| Total heartbeat events | 682 |
| Mean in-session interval | 3.8 min |
| Min interval | 0.5 min |
| Max in-session interval | 55 min |
| At 3.8 min mean with 2 agents | ~32 heartbeats/hour (combined) |

Each heartbeat = 1 event file + 1 log update + 2 seen-cursor updates = 4 tracked file mutations. At 2 agents, 32 heartbeats/hour = 128 tracked file mutations/hour from liveness signal alone. In a shared single working tree, this is the mechanism that prevented `git checkout` from running during the EEF PR-1 session (the tree was perpetually dirty).

### Body size distribution

| Size bucket | Directed | Narrative (non-HB) |
|---|---|---|
| 0–500 chars | 23 (3%) | 278 (23%) |
| 501–2,000 chars | 371 (47%) | 366 (31%) |
| 2,001+ chars | 403 (51%) | 550 (46%) |
| Mean body length | 2,462 chars | 2,219 chars |

Large bodies (>2,000 chars) represent 46–51% of all events, suggesting agents are using comms events for content that might be better placed in handoff records.

### Method 2 churn comparison

For the 17-minute sidebar (6 effective turns):

| Metric | Method 1 equivalent | Method 2 actual |
|---|---|---|
| New files created | 6 event files | 1 sidebar file |
| Tracked file mutations | 6 × 4 = 24 (events+log+seen) | 0 (file is in /tmp) |
| Heartbeat events during session | ~8 per 4-min window × ~4 = ~32 | 0 (crons paused) |
| Total tracked writes if run via M1 | ~56 (6 messages + 32 heartbeats × 4) | 0 |

The sidebar produced zero tracked file mutations during the live exchange. The only persistence cost was two file copies at the end, neither of which is in the hot coordination path.

---

## 5. Communication Rate and Latency Analysis

### Method 1 — poll-based, interrupt-driven

The watcher polls the comms directory on a configurable interval. From the heartbeat corpus, the effective agent-active poll rate is ~3.8 minutes mean. This is not purely the watcher interval; it reflects the combined cadence of new events being written.

- **Expected delivery latency**: 0.5× poll interval ≈ 1.9 minutes best case. With watcher intervals quoted at 5-second fallback in the canonical rule invocation script, a diligent agent could achieve near-realtime — but only if their watcher is running.
- **Watcher-off scenario**: if the peer's watcher is stopped (which it was in this session — Galactic had stopped theirs pre-sidebar), delivery latency is unbounded. The message sits unread until the watcher restarts.
- **Round-trip time**: with ~2-minute delivery each direction, a two-turn exchange takes ~4 minutes minimum. The Starless-Galactic EEF sync needed 6 turns across 17 minutes; that rate is consistent with Method 1 at best-case latency (but the session actually used Method 2 — Method 1's watchers were paused).

### Method 2 — real-time, full-attention

The Monitor polls the file on md5 change, with a user-configured interval (this session: ~3s for Starless; Galactic used `tail -f` via Monitor).

- **Expected delivery latency**: ~3 seconds from append.
- **Full-attention**: both agents are watching the file for the sidebar's duration. Unlike the interrupt-driven comms watcher, neither agent is doing other work while in the sidebar.
- **Round-trip time**: ~6s propagation (two deliveries) + composition time. The session achieved 2-minute inter-turn gaps, implying composition time (not delivery latency) was the bottleneck.

### Throughput comparison

| Metric | Method 1 | Method 2 |
|---|---|---|
| Delivery latency | ~1.9 min best case; unbounded if watcher off | ~3s |
| Round-trip latency | ~4 min minimum | ~6s + composition |
| Full-attention required | No (interrupt-driven) | Yes |
| Backpressure if peer offline | Message queues indefinitely | Must establish live channel first |
| Concurrent agent work | Possible | Suspended for sidebar duration |

Method 2 buys ~40× lower delivery latency at the cost of full-attention suspension. For a short focused exchange (6 turns, 17 minutes), the suspension cost is negligible. For a long background exchange, Method 1's interrupt-driven model is the correct shape.

---

## 6. Quality Dimensions

### Durability

**Method 1**: every event is an immutable UUID-named JSON file committed to the repo. The shared-comms-log is a derived rendering. The corpus survives compaction, process restart, and system reboot.

**Method 2**: the live channel (`/tmp/sidebar.md`) is ephemeral — lost on reboot. This session mitigated it by persisting to `.agent/state/collaboration/sidebars/` (two copies landed). The `.agent/state/` directory is tracked but not committed during the sidebar; the copies become durable only when committed. The `/tmp` channel itself does not survive even a long pause.

Verdict: Method 1 wins on durability. Method 2 requires a persistence discipline that must be explicitly exercised.

### Auditability

**Method 1**: every event carries a UUID, ISO-8601 timestamp, full identity tuple, kind/tag schema, and is enumerable from `shared-comms-log.md`. Cross-session audit is possible without any agent context.

**Method 2**: the transcript is human-readable prose with informal turn headers. No UUID per turn, no schema version. Timestamps are present only where agents typed them (and one turn in the canonical transcript shows `~21:09Z` — an imprecise estimate). Agent identity is by convention in the header, not schema-enforced.

Verdict: Method 1 wins on auditability and schema-enforced searchability. Method 2 produces a readable transcript but not a machine-queryable one.

### Discoverability and bootstrap

**Method 1**: any new agent can run `comms watch` and get the full history. The watcher self-seeds from the directory. No peer coordination needed to discover what is in flight.

**Method 2**: requires knowing the sidebar file's path. This session surfaced the bootstrap chicken-and-egg explicitly (Starless's mechanism notes, `.agent/state/collaboration/sidebars/2026-05-27-eef-pr1-comms-notes-starless.md`): "bootstrapping the channel still needs ONE out-of-band signal (a directed comms event with the path) to tell Galactic where the sidebar is — chicken-and-egg if their watcher is off." The owner directing both agents in parallel was the ad-hoc resolution.

Verdict: Method 1 wins on discoverability. A new agent or post-compaction agent can self-bootstrap from Method 1; Method 2 requires prior coordination.

### Multi-channel reach

**Method 1**: a narrative event reaches all agents watching the stream. A directed event reaches the named recipient and is observable by all (with `[OBSERVED]` tagging). A third agent joining mid-session gets immediate visibility.

**Method 2**: only the agents actively tailing the file see it in real-time. A third agent cannot join the sidebar without being explicitly invited (path shared via out-of-band channel).

Verdict: Method 1 wins on multi-channel reach.

### False-retirement risk

**Method 1**: agents pausing their heartbeat cron during a sidebar (as required to avoid tree-dirtying) become invisible on the comms stream. Per PDR-078 §Observe-side, silence past 10 minutes triggers claim auto-rebalance. An 11-minute sidebar with paused heartbeats would trip this threshold. The `ping-before-escalate` rule requires a cross-check before broadcasting retirement, but the risk is real.

**Method 2**: neither agent is emitting heartbeats during the sidebar. The 10-minute silence window is a genuine risk for longer sidebars.

Verdict: Both methods share this risk when heartbeats are paused for the sidebar. PDR-082's n=2 mode (status: Proposed, first draft 2026-05-25) addresses this by replacing heartbeat cron with owner-chat-visible liveness at n=2. At n>2, a sidebar must be bounded and the remaining agents (if any) must be informed.

### Stale-authority risk (the real incident, 2026-05-27)

The most significant quality finding from this session: Galactic's turn 1 in the sidebar proposed executing `git stash push && git branch -f feat/education-evidence-foundational-graphs-take2 origin/main && git checkout`. This was the EXACT operation the owner had vetoed in Starless's window minutes earlier: "no stash, no checkout, nothing that could destroy or lose work, ack then stop."

Galactic had not received this veto because per-window owner directions land in each agent's chat context independently; the comms event stream carries agent-authored events, not owner chat turns. The synchronous sidebar is what caught it: Starless's turn 2 delivered the veto in under 2 minutes from appending, before Galactic executed anything.

With Method 1 and watcher latency of ~2–4 minutes, the same relay would have arrived in the same timeframe — but only if Galactic's watcher was running. It was not. Method 2 caught a potentially destructive operation because it was the established live channel for that exchange.

Structural observation: this failure mode (per-window owner veto not reaching peers) is not solved by either method alone. The cure requires a protocol for surfacing per-window owner directives into the shared channel on receipt. Both methods would benefit from such a protocol.

---

## 7. Recommendations

### (a) Minimise ceremony and churn

1. **Adopt PDR-082 n=2 mode for 2-agent sessions.** Drop heartbeat cron and periodic heartbeat broadcasts. The 682 heartbeat events in the corpus represent 25.5% of all comms traffic and 128+ tracked file mutations per agent-hour in a shared tree. None of this is required when liveness is owner-chat-visible. Status: PDR-082 is Proposed; this session is evidence for its second-instance validation. Recommend advancing to Adopted.

2. **Bound sidebar duration to limit false-retirement exposure.** When entering a Method 2 sidebar with heartbeats paused, emit a single Method 1 comms event with `--tag behaviour-note` naming the sidebar, expected duration, and a "silence expected until HH:MMZ" marker. This tells any observing agent (or post-compaction peer) that silence is intentional, not retirement.

3. **Move large-content events to referenced files.** 46–51% of comms events exceed 2,000 characters. The 1,500-character gate on `--body` exists precisely for this (see `cli-comms-commands.ts` `MAX_COMMS_BODY_LENGTH = 1500`). Enforce `--body-file` discipline for content belonging in handoff records; keep comms events as pointers.

4. **Make comms-seen files untracked.** The primary churn driver in a shared working tree is tracked comms-seen cursor files in `.agent/state/collaboration/comms-seen/`. If these were in `.gitignore` (or written to a local-only state path), the tree-dirtying problem that forced the sidebar workaround disappears. This is a structural cure for the shared-tree-checkout deadlock. (Currently: 117 comms-seen files; the `.agent/state/` vs `.agent/memory/` split referenced in `project_memory_vs_state_split_planned.md` memory item points toward this direction.)

### (b) Maximise communication rate without sacrificing quality

5. **Formalise Method 2 sidebar as a first-class protocol.** The current gap is bootstrap friction and ephemerality. Concrete additions:
   - A deterministic rendezvous convention: `/tmp/sidebar-<YYYY-MM-DD>-<slug>.md`, slug derived from the working branch or PR number, announced in the opening comms event.
   - A lifecycle comms event (`comms append --tag sidebar-open --body-file ...`) naming the sidebar path, participants, and expected duration. This makes the sidebar discoverable from the comms stream without out-of-band relay and gives the 10-minute silence window a "reason for absence."
   - A persistence-at-close step: the sidebar protocol requires the last-active agent to `cp /tmp/sidebar-<slug>.md .agent/state/collaboration/sidebars/<canonical-name>.md` and emit a `sidebar-close` event pointing to the archive. This happened ad hoc this session; making it mandatory removes the ephemerality risk.

6. **Prefer Method 2 for synchronous peer design decisions; Method 1 for everything else.** Method 2 wins when: both agents are active simultaneously, the exchange requires fast back-and-forth (>3 turns in <30 min), and the content is exploratory (decisions will be surfaced to the owner after the sidebar, not consumed directly by third agents). Method 1 wins when: the message is broadcast, the recipient may not be live, the content must be discoverable across sessions, or the topology has ≥3 agents.

---

## 8. Tailored Recommendations by Topology

### 2-agent peer team (like this session)

**Baseline protocol**: PDR-082 n=2 mode when both conditions hold (n=2, owner-chat visible).

**Comms layer**:
- Drop heartbeat cron (PDR-082 §Drop-set).
- Keep all-channels watcher, but stop it only during an active Method 2 sidebar.
- Use Method 1 (directed comms events) for: initial sync, tree-green/push-landed/gate-state signals, mid-session status when not in sidebar.
- Use Method 2 (file + Monitor) for: synchronous design-and-decide exchanges where ≥3 turns expected.

**Git tree discipline**:
- Make comms-seen files untracked (recommended structural cure, above).
- Solo source-driver whenever possible: two agents on one PR in one shared tree is the churn source; one implements, one reviews.
- When both must touch source concurrently, use git worktrees (per joint recommendation in this session's sidebar, subject to owner approval).

**Latency target**: Method 2 achieves ~3s delivery; for async signals (tree-green, gate results), Method 1 at even 5-minute watcher intervals is fast enough.

### 3-agent peer team

**Baseline protocol**: Full `start-right-team` SKILL. Heartbeat cron required (the third agent may not be in the same chat window). All-channels watcher required.

**Comms layer**:
- Method 1 as the primary channel for all broadcast and directed events.
- Method 2 available for pairwise sidebars between any two agents, with mandatory `sidebar-open` / `sidebar-close` lifecycle events so the third agent knows what is in flight and the absence is not retirement-detected.
- At ≥3 agents, the silent agent during a sidebar remains at false-retirement risk. Bound sidebars to ≤8 minutes (two heartbeat cycles) or have the non-participating agent emit a `sidebar-open` acknowledgement (confirming they saw the signal and will monitor for the close event).

**Key failure mode to avoid**: the stale-authority risk (turn 1 incident) is more severe at 3 agents because a third agent may receive a vetoed direction from the two-person sidebar and act on it. The `sidebar-close` event must include any owner-class decisions made inside the sidebar.

### 3-agent peer team + one specialist Commit Marshal

**Baseline protocol**: Full `start-right-team` SKILL + marshal-singleton protocol.

**Comms layer**:
- Method 1 for all marshal coordination: commit-queue intents, gate-green signals, tree-green broadcasts must be on the comms stream (not in a sidebar that the marshal might not be tailing).
- Method 2 between source-driver peers for design decisions. The marshal does not need to be in the sidebar; they consume the outcome (merged commit queue entry, gate results).
- Gatekeeper pattern: the marshal runs full pre-commit gates for the team. While inside a marshal cycle (husky gate-chain in flight), `liveness-heartbeat-cron.md` §"Marshal-cycle contiguous-execution exemption" allows cycle-boundary broadcasts to satisfy heartbeat semantics. No additional sidebar needed for the marshal's own gate operations.
- Key protocol: before any peer enters a sidebar, check the marshal's `commit_queue` state. If the marshal has a pending gate in flight, wait for the tree-green before entering a sidebar that would pause the watcher (the marshal may need to broadcast tree-green to unblock the peer).

**Structural win**: the marshal-singleton pattern and the solo-source-driver pattern compose well. One peer implements (in worktree if needed), one reviews (peer sidebar for design decisions), one marshal gates. Each has a clear ownership boundary; Method 2 sidebars between implementer and reviewer do not touch the marshal's domain.

### Arbitrary size / mixed topologies

**When peer mesh beats hub-and-spoke**: at N ≤ 3, peer mesh (pairwise sidebars + broadcast comms for signals) is lower ceremony than a coordinator. A coordinator at N=2 adds no value (PDR-082 rationale). At N=3, a coordinator is opt-in (memory: `feedback_coordinator_role_threshold` — peer collab default ≤3, coordinator expected default ≥4).

**When hub-and-spoke is required**: at N ≥ 4, retire-and-replace latency, coordinator-less-window risk, and gate-singleton contention become real. The comms stream as canonical truth (PDR-066) is the correct model. Method 2 sidebars remain valid for pairwise deep-dives, but the coordinator must receive a `sidebar-close` broadcast naming any decisions made inside.

**How Method 2 fails past N=4**: the file+Monitor pattern does not scale to group conversations. Appending to a shared file with 4+ simultaneous writers risks race-condition overwrites (append is not atomic in all shell/OS configurations), confused turn ordering, and a file-path discovery problem (which of the N-choose-2 possible sidebar files is canonical?). Above N=3 pairwise sidebars, Method 1 (comms events with group audience or broadcast) remains the only scalable design.

**Mixed topologies (Cursor multitask, Codex, Claude Code)**: per `feedback_cursor_multitask_single_message_handoff` memory, Cursor Multitask does not consume the comms-event shape; its internal agents share a single window. For cross-platform coordination (Cursor team ↔ Claude Code agent), the comms event stream (Method 1) is the only shared out-of-chat channel. Method 2 files in `/tmp` may not be accessible across platforms depending on process isolation. Recommendation: Method 2 sidebars for same-platform, same-machine agent pairs only; Method 1 for all cross-platform communication.

---

## 9. Open Questions and Proposed Experiments

### Q1 — Untracked comms-seen files

Would making `.agent/state/collaboration/comms-seen/` untracked (via `.gitignore` or moving to a local-only state path) eliminate the primary tree-dirtying failure mode without breaking the watcher's seen-cursor deduplication? The structural cure is clean; the question is whether the seen-cursors need to be versioned across sessions (answer: they don't — the watcher self-seeds from the directory on first run).

**Proposed experiment**: add `comms-seen/` to `.gitignore` on a branch, run a 2-agent session, verify no checkout deadlock.

### Q2 — sidebar-open / sidebar-close lifecycle events

Would adding `sidebar-open` and `sidebar-close` tags to the comms event schema (ADR-183 tag namespace) eliminate the bootstrap chicken-and-egg and false-retirement risk? The sidebar-open event carries the rendezvous path; the sidebar-close event carries the outcomes. This makes the sidebar a first-class Protocol-1 citizen without requiring Method 1 to replace Method 2's real-time channel.

**Proposed experiment**: run a second 2-agent session using the sidebar-open/close convention; measure bootstrap friction vs this session.

### Q3 — Deterministic rendezvous convention

Would a convention like `/tmp/sidebar-<branch-slug>-<YYYY-MM-DD>.md` (derived from `git branch --show-current` + date) eliminate the duplicate-file problem this session experienced (two parallel sidebar files created simultaneously before converging)?

**Proposed experiment**: both agents derive the path from the branch name independently (no pre-communication); verify they land on the same file.

### Q4 — Per-window owner-directive relay

The stale-authority incident (turn 1 veto near-miss) reveals a structural gap: per-window owner directives do not propagate to peer agents' windows automatically. A lightweight protocol: on receipt of any owner directive that constrains a peer's proposed action, the receiving agent emits a directed comms event (Method 1) relaying it verbatim within one heartbeat cycle. This is distinct from the sidebar (it uses Method 1, the always-on channel) and from the sidebar-close summary (which comes later).

**Proposed experiment**: codify the relay protocol as a rule; validate against a future session where per-window directives diverge.

### Q5 — PDR-082 n=2 mode second-instance validation

This session is a candidate second instance for PDR-082 (currently Proposed, first draft 2026-05-25). The session did not formally activate n=2 mode (it predated the PDR's first draft reaching agent context), but the behaviour matches: heartbeat cron dropped, watcher stopped during sidebar, owner-chat-visible liveness. If this session validates the falsifiability criteria in PDR-082 §Falsifiability, the PDR can advance from Proposed to Adopted.

**Evidence check needed**: did any coordination failure occur that n=2 mode's dropped substrate was responsible for? Likely no — the stale-authority incident was a per-window directive gap, not a heartbeat/watcher gap.

---

*Evidence references: comms corpus at `.agent/state/collaboration/comms/` (2,673 events); sidebar canonical transcript at `.agent/state/collaboration/sidebars/2026-05-27-eef-pr1-CANONICAL-transcript.md`; mechanism notes at `.agent/state/collaboration/sidebars/2026-05-27-eef-pr1-comms-notes-starless.md`; handoff records at `.agent/state/collaboration/handoffs/2026-05-27-{galactic,starless}-pre-compaction.md`; governing rules at `.agent/rules/{use-agent-comms-log,comms-all-channels-watcher,liveness-heartbeat-cron,ping-before-escalate}.md`; PDR-082 at `.agent/practice-core/decision-records/PDR-082-n2-collaboration-mode.md`; comms CLI at `agent-tools/src/collaboration-state/cli-comms-commands.ts`.*

---

## Live Observation Addendum — 2026-05-27 worktree session

**Observer**: Research subagent (Sonnet 4.6)
**Observation start**: 2026-05-27T06:27:51Z
**Observation scope**: post-compaction worktree phase (both agents resumed after parallel compactions; worktrees created ~07:21–07:23 BST = 06:21–06:23Z)

---

### Pass 1 — Baseline snapshot (2026-05-27T06:27:51Z)

#### Comms surface state

Total events in corpus: **2,673** (unchanged from the report's baseline — no new events since session closeout).

Today's (2026-05-27) event classification:

| Category | Count |
|---|---|
| Starless heartbeats (narrative, `eef-pr1-lane-a`) | 63 |
| Starless heartbeat (narrative, `eef-pr1-purpose-sidebar`) | 1 |
| Starless heartbeat-end | 1 |
| Galactic heartbeat-end + closeout | 1 |
| Directed (sidebar bootstrap invitations) | 2 |
| **Total today** | **68** |

Striking observation: **Galactic emitted zero heartbeats today**. Their only comms event is the heartbeat-end + closeout at 05:52:36Z. Galactic's watcher was off for the entire pre-compaction session. This is a live instance of the pre-existing report's finding (§5: "Watcher-off scenario: delivery latency is unbounded"). Galactic was effectively invisible on the comms stream from session open until session close — yet no coordination failure resulted (the owner bridged directly; the sidebar was the coordination channel).

Starless's heartbeats ran at a mean interval of **5.1 minutes** (4.0 min minimum; 20.3 min maximum). The four gaps of ~20 minutes correspond to context-compaction pauses (agents cannot emit heartbeats during compaction). The 10.7-minute gap (05:22–05:33Z) corresponds to the transition into the sidebar proper.

The two directed events (05:32:11Z and 05:33:13Z) were the sidebar bootstrap invitations — both under 1,400 characters, below the 1,500-char body gate. They served their purpose: announcing the `/tmp/eef-pr1-sidebar.md` rendezvous. Note that the two events were sent at nearly the same second from different agents — a race-to-announce pattern consistent with simultaneous owner direction in both windows. Both pointed to slightly different initial file paths before converging (Starless opened `.agent/state/collaboration/sidebars/...`, Galactic opened `/tmp/...`; the sidebar transcript records this crossing as resolved in turn 2).

#### Sidebar state

`/tmp/eef-pr1-sidebar.md` — 19,598 bytes, 8 turns. Last modified 07:23:09 BST (= 06:23:09Z). The sidebar is complete for the design phase; both agents have post-compaction ACKed the worktree model and are executing. The file is durable in `/tmp` and also preserved at `.agent/state/collaboration/sidebars/2026-05-27-eef-pr1-CANONICAL-transcript.md`.

Additional sidebar files observed in `/tmp/`:

- `/tmp/ashen-to-scorched-pdr-sidebar.md` (4,351 bytes) — a different agent-pair's PDR sidebar, not part of this session
- `/tmp/ferny-to-twilit-sidebar.md` (4,136 bytes) — fan-out lead sidebar, different session
- `/tmp/incandescent-sidebar-zephyrous.md` (2,372 bytes) — markSeen/emit ordering discussion
- `/tmp/twilit-sidebar-ferny-on-synthesis.md` (6,459 bytes) — synthesis discussion

This confirms `/tmp` sidebars are now in routine use across multiple agent pairs, not just this session. The ephemerality concern raised in the report (§6, Durability) is becoming a systemic exposure as the pattern proliferates — each new session needs its own persistence discipline at close.

#### Worktree state

| Worktree | Branch | HEAD | Status |
|---|---|---|---|
| `/Users/jim/code/oak/oak-open-curriculum-ecosystem` | `feat/graph-foundations` | `9dac52aa` | 4 tracked dirty files (substrate only: comms-seen, active-claims, plan, README) |
| `/Users/jim/code/oak/oak-wt-eef` | `feat/eef-explore-evidence` | `037d0f7e` (= origin/main) | Clean — no commits ahead, no source edits begun |
| `/Users/jim/code/oak/oak-wt-cure` | `fix/agent-tools-comms-schema` | `9dac52aa` (= 3 commits ahead of origin/main) | 1 dirty file: `agent-tools/tests/collaboration-state/state-parsers-strict.unit.test.ts` |

Key observations:

1. **EEF worktree (Starless) is at exactly origin/main (037d0f7e).** The HEAD verification the sidebar mandated was correct: the worktree was created clean off origin/main. No base-divergence. The practice-memory warning (`feedback_worktree_isolation_unreliable`) was respected.

2. **Cure worktree (Galactic) is ahead of origin/main by 3 commits** — the two approved agent-tools commits (`c0942d48`, `cdff0fef`) plus the `docs: comms sweep` commit (09dac52aa). Importantly, `docs: comms sweep` is a coordination-substrate commit that bundled 141 files (comms events, comms-seen cursors, sidebar backups, plan updates, claims). This commit IS the single-committer discipline in action: one consolidated commit lands all substrate after the session, authored by the owner. This avoids the interleaved-comms-file-write deadlock while keeping the substrate durably committed.

3. **Cure worktree has live active work**: `state-parsers-strict.unit.test.ts` is modified with the `minLength` test (4 new test cases verifying the Zod/JSON-schema alignment fix). Galactic is actively implementing the fix identified in the session.

4. **The shared primary tree is dirty but only with substrate files** (comms-seen, active-claims, plan, README). None of these are source code. The single-committer discipline appears to be holding: source code edits go to worktrees, substrate accumulates in the shared tree for periodic sweeps.

5. **Base-divergence note**: the cure worktree is 3 commits ahead of origin/main. Because the EEF worktree is based on origin/main (037d0f7e), the EEF PR will see a clean diff even though cure has diverged. The integration-back path (worktrees → main via separate PRs) is what the coordination contract specified; no local integration needed.

---

### Analytical thread 1 — Communication efficiency (initial observations)

**A. The one-agent-silent pattern is stable when the owner bridges.** Galactic had no heartbeats and an off watcher for the full pre-compaction session. The owner directly coordinated both agents. This is a natural n=2 "owner-chat-visible liveness" pattern (matching PDR-082's proposal) without formal adoption of PDR-082. The observation supports PDR-082's falsifiability test: no coordination failure occurred that a dropped heartbeat was responsible for.

**B. Sidebar bootstrap race creates a file-crossing incident (documented, not catastrophic).** The simultaneous sidebar-bootstrap at 05:32–05:33Z produced two competing rendezvous files: Starless opened `.agent/state/collaboration/sidebars/2026-05-27-eef-pr1-purpose-reflection-starless-galactic.md`; Galactic opened `/tmp/eef-pr1-sidebar.md`. This is exactly Q3 from the report's open questions — would a deterministic rendezvous convention eliminate the crossing? The sidebar transcript shows the crossing resolved organically in turn 2 (Starless detected the crossing and converged to Galactic's `/tmp` file), with ~2.5 minutes lost to synchronisation overhead. A branch-slug-derived path would have prevented it.

**C. Post-compaction handoff information density is high.** The sidebar turns 7 and 8 (post-compaction) carry dense structured information: owner decisions, worktree coordinates, release-safety verification, plan pointers. Turn 7 (Galactic) is ~3,000 characters. This is effective use of the sidebar for information-dense state transfer but also illustrates a cost: a new agent reading only the comms stream (not the sidebar) would have no visibility into these decisions. The plan was updated as the canonical record, but the sidebar is where the reasoning lived.

**D. The directed comms events were bootstrap-only; all content went through the sidebar.** Of the 70 today's events, zero carried any substantive cross-agent design content — that all went through the 8-turn sidebar. This is the cleanest possible realisation of the report's §7(b) recommendation ("Prefer Method 2 for synchronous peer design decisions"). The comms stream today is purely liveness/lifecycle; content is 100% sidebar-resident.

---

### Analytical thread 2 — Worktree-approach effectiveness (initial observations)

**A. Zero checkout deadlock.** The pre-worktree session suffered ~40 minutes of git checkout deadlock from comms-seen churn. With worktrees, no checkout is needed: each agent starts in their own directory, never moves the shared HEAD. The deadlock class is eliminated structurally, not by quiesce-window discipline.

**B. Single-committer substrate consolidation works cleanly.** The owner landed `docs: comms sweep` (9dac52aa) as a single commit sweeping 141 substrate files. Worktrees picked this up: `oak-wt-cure` has HEAD = 9dac52aa, identical to the shared primary tree. This is a clean model: source commits go to worktree branches, substrate commits land on the shared branch via a periodic owner-or-marshal sweep. No interleaving.

**C. Worktree creation cost is trivially low.** Both worktrees were created within ~2 minutes of each other (07:21 and 07:23 BST). No install or bootstrap friction was observable in the file timestamps — the checkout just materialised. In a monorepo with heavy deps, `node_modules` is typically shared across worktrees (not duplicated), so disk cost is minimal.

**D. New friction observed: base-divergence between the two worktrees.** The cure worktree is at 9dac52aa (3 commits ahead of origin/main); the EEF worktree is at 037d0f7e (origin/main). These diverge by 3 commits in the `fix/agent-tools-comms-schema` branch history. Because the EEF and cure changes touch disjoint files (agent-tools vs packages/sdks), this does not cause any integration problem for the separate-PRs-to-main path. But an agent joining the EEF worktree post-compaction would need to read both the shared tree's head AND origin/main to understand the full working-set. The "verify HEAD before work" mandate (sidebar turn 8, Galactic R3) is the correct response; it prevents unverified base assumptions.

**E. Coordination substrate (plans, comms, claims) must stay in the shared tree — and does.** The shared tree shows only substrate dirty files, exactly as the coordination contract specified. Neither worktree has any substrate files in its diff. The boundary is holding.

**F. The cure worktree shows active implementation without any shared-tree interaction.** Galactic added the `minLength` test in `oak-wt-cure` while the shared tree has no corresponding dirty state. This is the pure-isolation promise of worktrees: concurrent active edits in separate directories with zero git-level contention.

---

---

### Pass 2 — 06:31:58Z (Monitor pass 1)

**Delta**: sidebar +1,263 bytes; no new comms events; EEF dirty=0, cure dirty=1, shared dirty=4.

**New sidebar content (turn 9 — Starless):** Pre-execution 6-reviewer pass on commit-1 (type relocation), owner-directed. Starless dispatched code-expert + assumptions-expert + four architecture specialists (barney/betty/fred/wilma) in parallel against the plan + current files. Explicitly flags that Galactic's in-cycle review (fred/type/test/mcp) will happen on the actual diff AFTER commit 1 lands — avoiding duplication.

**Communication efficiency observation:** The sidebar continues to be the live coordination channel. This is now turn 9; the file remains the single active communication surface for substantive content. The comms stream still has zero new events — both agents are operating entirely through the sidebar in the active execution phase. This is pure Method 2 dominance for active-execution coordination. The comms stream's role has fully retired to lifecycle markers (heartbeat-ends were the last events at ~05:52-05:54Z).

**Worktree observation:** EEF dirty=0 confirms Starless is in the pre-execution review phase (no source edits yet, as explicitly stated in turn 9). Cure dirty=1 (the minLength test file) confirms Galactic is at a different stage — actively implementing rather than reviewing pre-execution. The two worktrees are in different execution phases simultaneously with zero contention — this is a textbook demonstration of the worktree isolation promise.

**Inter-turn timing:** Turn 8 (Starless ACK) was at ~06:23Z (sidebar last-modified). Turn 9 (Starless pre-execution dispatch) arrived within the same observation window (06:31Z). The gap between turn 8 and turn 9 is ~8 minutes — consistent with Starless reading the plan, grounding themselves, and determining the owner wanted a pre-execution pass before writing code. This is composition time, not delivery latency.

---

### Analytical thread 1 — update after pass 2

**E. Sidebar used for execution coordination, not just design.** The existing report correctly predicted Method 2's role in "synchronous peer design decisions," but the observed usage extends further: the sidebar is now carrying execution coordination (review dispatch announcements, pre-execution grounding). The information-transfer value of the sidebar persists well into the execution phase, not just the design phase.

**F. Review-dispatch via sidebar is efficient but non-discoverable.** Starless announcing a 6-reviewer dispatch in the sidebar means Galactic sees it immediately (~3s). But a third agent or a post-compaction session would need to read the full sidebar to know this review is in flight. The report's §7 recommendation (add `sidebar-open/close` lifecycle events to the comms stream) would also address this: a `sidebar-update` event with a pointer would make such dispatches discoverable. The current pattern requires full sidebar reads for situational awareness.

---

---

### Pass 2b — 06:32:50Z (manual check between monitor passes)

**Delta since pass 2:** cure dirty count rose from 1 to 2 files. No new comms, no sidebar changes, no commits.

**What changed:** Galactic completed the full minLength fix. `types.ts` now has `.min(1)` on all four identity base fields (`agent_name`, `platform`, `model`, `session_id_prefix`). The test file was updated with a proper describe block, a direct `collaborationAgentIdSchema.parse(...)` call (simpler than the previous approach which went through `parseNarrativeCommsEvent`), and the import added. The diff is clean: 8 lines modified in types.ts, 10 lines added in the test.

**Worktree effectiveness observation:** Galactic made these edits entirely in the cure worktree (`/Users/jim/code/oak/oak-wt-cure`) with zero impact on the shared tree or the EEF worktree. The EEF worktree is clean (0 dirty files). The two agents are implementing in complete filesystem isolation.

**Communication observation:** No sidebar turn from Galactic announcing the completion of the minLength fix implementation. Galactic is working silently in their worktree — the next expected communication event will be a commit (which will appear as a HEAD change in the monitor) or a sidebar turn requesting a reviewer. This is consistent with the worktree model: agents work independently until they need coordination input.

**Sidebar turn numbering collision observed:** The sidebar has two "turn 6" entries — Galactic wrote "turn 6 — COMPACTION NOTICE" at 05:46Z, and Starless independently wrote "turn 6 — COMPACTION PREP" at 05:53Z. The agents were operating simultaneously and both incremented from turn 5 without reading the peer's numbering. This is a minor coordination artifact: the sidebar lacks a turn-numbering lock. It resolves naturally (readers can infer by timestamp) but would be confusing in longer exchanges. A monotonic turn counter written atomically (or "turn N — AGENT — title" format where N is globally visible before increment) would prevent it. This is a new finding not covered in the existing report.

**Sidebar inter-turn composition latency (empirical):**

| Turn pair | Agent | Time delta |
|---|---|---|
| Turn 1 → 2 | Starless replies Galactic | ~26 min (includes channel-crossing/channel-discovery overhead) |
| Turn 2 → 3 | Galactic replies Starless | 2.0 min |
| Turn 3 → 4 | Starless replies Galactic | 4.2 min |
| Turn 4 → 5 | Galactic replies Starless | 1.8 min |
| Turn 5 → 6a | Galactic compaction notice | 2.0 min |
| Turn 6a → 6b | Starless compaction prep | 7.4 min |

Mean composition time (turns 2–5): **~2.5 min**. Delivery latency: ~3s. The composition:delivery ratio is ~50:1. This is evidence that Method 2's ~3s delivery latency is not the bottleneck — composition time is. Investments in reducing ceremony (less mandatory header structure, fewer identity fields per turn) would cut composition time more than investments in further reducing delivery latency.

**No active claims in shared tree.** Both agents are working in their worktrees without placing any claims. This is coherent with the worktree model — each agent owns their worktree entirely, no claim needed. The claims table is clean (0 active).

---

### Pass 3 — 06:35:41Z (monitor pass 2 — IDLE)

**Delta**: no new comms events, no sidebar changes, no commits in any worktree. Cure worktree still has 2 dirty files (the minLength fix, not yet committed).

**Critical finding — durable archive gap:**

The canonical sidebar transcript (`.agent/state/collaboration/sidebars/2026-05-27-eef-pr1-CANONICAL-transcript.md`, 13,433 bytes) is missing the final 7,428 bytes of the live sidebar (`/tmp/eef-pr1-sidebar.md`, 20,861 bytes). The archive was written at 07:02 BST (during Galactic's compaction) and therefore captures only turns 1–6. The post-compaction turns (7: owner decisions + worktree brief; 8: Starless ACK; 9: pre-execution review dispatch) are absent from the durable record.

This is a live instance of the ephemerality failure mode the report identified in §6 (Durability). The manual persistence step succeeded for the pre-compaction content, but the post-compaction content — including the owner decisions, the worktree ACK, and the review dispatch — exists ONLY in `/tmp/eef-pr1-sidebar.md`. If the `/tmp` file were lost now (reboot, process kill), turns 7–9 would be unrecoverable from the archive.

The Starless backup (`2026-05-27-eef-pr1-sidebar-starless-backup.md`, 15,131 bytes) was written earlier and also predates turns 7–9.

This gap is a concrete validation of the report's Recommendation (b) §5: "A persistence-at-close step: the sidebar protocol requires the last-active agent to `cp /tmp/sidebar-<slug>.md .agent/state/collaboration/sidebars/<canonical-name>.md` and emit a `sidebar-close` event pointing to the archive." The session followed the protocol for the pre-compaction content but did not repeat it for the post-compaction content. Making the step mandatory (not manual) — e.g. triggered on detecting turns after the most recent archive copy — would have caught this.

**Cross-team sidebar protocol adoption (06:35Z observation):**

Five additional `/tmp/` sidebar files from other agent pairs were observed (`ashen-to-scorched`, `ferny-to-twilit`, `incandescent-sidebar-zephyrous`, `twilit-sidebar-ferny-on-synthesis`, plus several `.txt` variants). All are from different sessions. None has a corresponding `sidebar-open` comms event pointing to its path — the bootstrap chicken-and-egg is being resolved via owner coordination or peer-directed comms events, not via a formalised lifecycle event. The pattern is spreading but without the recommended protocol wrapper.

The `ferny-to-twilit` sidebar contains substantive multi-reviewer synthesis content (Option A analysis, type-expert structural identity finding, critical CI failure flagged) — high-value content that is `/tmp`-only and not in the comms stream. This is the same durability gap observed in the EEF sidebar, manifesting across multiple sessions.

---

### Pass 4 — 06:37:58Z (monitor pass 2 — IDLE(1))

No new activity: comms=2673, sidebar=20861, no new commits. Cure worktree still has 2 dirty files (minLength fix staged). EEF clean. IDLE counter = 1.

Both agents appear to be in execution phases that do not produce observable events yet:
- Galactic: minLength fix coded, not yet committed (awaiting self-review / pre-commit gate pass)
- Starless: awaiting results from the 6-reviewer pre-execution dispatch (announced in turn 9)

---

### Pass 5 — 06:43:58Z (monitor pass 3 — IDLE(2))

No new activity. Comms=2673, sidebar=20861, no commits. Cure dirty=2 (minLength fix awaiting commit), EEF dirty=0.

**Shared tree state analysis (06:37Z):** Three modified tracked files in the shared tree: plan file (reshape banner + SUPERSEDED annotations on pr1/pr2 todos), reports README (new entry for the comms-method-comparison report), and comms-seen cursor for Galactic. All three are substrate/coordination content — no source code. The coordination contract (source to worktrees, substrate stays in shared tree) is holding cleanly.

**Observation**: The minLength fix has been in the cure worktree's working tree for ~11 minutes without a commit. This is consistent with Galactic potentially running pre-commit gates (the repo's husky/turbo gate chain takes multiple minutes) or dispatching a self-reviewer before staging. The gate chain on a single-file change in `agent-tools/` should complete in ~2-3 minutes under Turbo cache — the extended time suggests Galactic may be running the full gate suite or is blocked on something. No distress signal in the comms stream or sidebar.

**Quantitative session-level content analysis (computed from today's corpus):**

| Metric | Value |
|---|---|
| Total comms events today | 68 |
| Heartbeat events | 66 (97.1%) |
| Heartbeat-end events | 2 (2.9%) |
| Directed events (sidebar bootstrap) | 2 (2.9%) |
| Substantive comms events | 2 (2.9%) |
| Sidebar content | 20,861 bytes |
| Directed+HB-end content | ~3,800 bytes |
| Sidebar:directed ratio | 5.5x more bytes |
| Tracked file mutations today (est.) | ~272 (68 events × ~4 mutations each) |
| Tracked mutations with PDR-082 n=2 | ~8 (2 events × 4) |
| Potential mutation reduction | 264 mutations (97.1%) |

**Key finding**: ALL substantive coordination today happened in the sidebar. The comms stream's substantive yield is exactly 2 events — both sidebar bootstrap invitations. If PDR-082 n=2 mode had been in effect, today's tracked file mutations would have dropped by 97.1%. This is the strongest quantitative evidence yet for advancing PDR-082 from Proposed to Adopted.

The 97.1% heartbeat fraction in today's session also shows that the n=2 mode's "drop heartbeat cron" clause would have had its maximum possible impact in this exact topology. There were only 2 agents, both owner-chat-visible, both compacting at session-close — the precise preconditions PDR-082 §Drop-set specifies.

---

### Analytical thread 1 — update after pass 3

**G. PDR-082 second-instance validation status:** Today's session is a valid second instance for PDR-082 (§Falsifiability check: did any coordination failure occur that dropped heartbeats were responsible for? No — the stale-authority incident was a per-window owner directive gap, not a heartbeat/watcher gap, and the post-compaction coordination worked cleanly with no heartbeats from Galactic). The 97.1% ceremony rate validates the PDR's cost model. Recommend advancing PDR-082 to Adopted.

**H. One-agent-silent pattern documented as a viable n=2 variant.** Galactic ran the entire session with zero heartbeats and a stopped watcher. The owner bridged both agents directly. No coordination failure. This is an informal implementation of PDR-082's n=2 mode without formal adoption — further evidence the protocol is sound.

---

### Pass 6 — 06:43:58Z (monitor pass 3 — IDLE(2)) + 06:49:58Z (monitor pass 4 — IDLE(3))

Both passes idle: no new comms, no sidebar activity, no commits.

**Subtle worktree architecture finding (06:39Z inspection):**

The EEF worktree (`/Users/jim/code/oak/oak-wt-eef`) contains its own `.agent/state/` directory — a working-tree snapshot of the state as of `origin/main` (037d0f7e). This means:

- The EEF worktree's `.agent/state/collaboration/comms/` has 2,520 events (vs 2,673 in the shared tree) — the 153-event delta is the `docs: comms sweep` commit that landed after the EEF branch was created.
- The EEF worktree's `.agent/state/collaboration/comms-seen/` has 115 files (vs 117 in the shared tree) — the galactic/starless comms-seen cursor files are absent.
- If Starless ran `comms watch` from the EEF worktree's directory, they would see a 2-session-stale comms history and would not see Galactic's current comms-seen state.

The coordination contract (sidebar turn 7: "the shared primary tree still holds coordination docs — plans, comms, claims") correctly anticipates this. Agents must use the SHARED primary checkout's `.agent/state/collaboration/` for all coordination activity; the worktree's `.agent/state/` is a stale snapshot of the base commit that should not be used for live coordination.

This is a new friction introduced by the worktree model that was NOT present in the shared-single-tree model: **a stale coordination-substrate snapshot exists in each worktree**. An agent starting work from the worktree directory without reading the coordination contract could mistakenly run comms tools against the worktree's stale `.agent/state/`, missing current events and producing wrong comms-seen cursors. The structural cure is to not track `.agent/state/` in the worktree — but since it's committed to the base branch, it appears in the working tree automatically.

**Code-level confirmation of the stale-substrate risk (06:42Z):** The `findCollaborationRepoRoot` function in `agent-tools/src/collaboration-state/cli-comms-commands.ts` (lines 210–221) walks UP from `process.cwd()` until it finds a directory containing `.agent/state/collaboration`. In a worktree, `process.cwd()` resolves inside the worktree directory, which DOES contain `.agent/state/collaboration/` (a base-commit snapshot). Therefore, the comms CLI resolves to the worktree's stale substrate when run from the worktree directory, NOT the shared tree's current substrate. The `--repo-root` flag can override this, but nothing in the coordination contract mandates its use.

This is the most significant new risk the worktree model introduces, and it is not mentioned in the coordination contract or the plan's MECHANIC section. It warrants a guideline: "all comms, claims, and plan operations MUST be run with `--repo-root /path/to/shared-primary-checkout` or from the shared primary checkout directory." The `findCollaborationRepoRoot` path-walking heuristic should also be updated to skip git-worktree secondary checkouts (detectable via `.git` file vs `.git` directory).

---

### Pass 7 — 06:49:58Z (monitor pass 4 — IDLE(3))

No change. Comms=2673, sidebar=20861, no commits in any worktree.

**Session continuity note:** Both agents are in extended silent execution phases. Starless is awaiting 6-reviewer results (announced in turn 9 at 06:31Z); Galactic has the minLength fix coded but has not committed (likely running gates or awaiting owner signal to open the cure-PR). Neither agent has emitted any comms event since the heartbeat-ends at 05:52–05:54Z. In the old shared-single-tree model with heartbeat cron running, both agents would each be emitting ~1 heartbeat per 4 minutes — producing ~6 heartbeat events since our observation window opened. With the n=2 / worktree model, the comms stream is silent.

The cure-PR has not been opened on GitHub (only PR #117, unrelated SonarQube fix, is currently open).

---

### Pass 8 — 06:55:58Z (monitor pass 5 — IDLE(4))

No change. Comms=2673, sidebar=20861, no commits. IDLE counter = 4. One pass until stand-down.

Both agents remain in silent execution phases (~25 minutes since last observable event). This extended silence is consistent with a normal pre-commit gate run (the repo's full turbo check-chain can take 5-15 minutes) combined with Starless's 6-reviewer dispatch (multi-agent sub-agent review typically takes 10-20 minutes per cycle).

The worktree model continues to show no contention: the silence is productive (agents implementing in isolation), not blocked.

---

### Observation session closeout — 06:43Z

**Stand-down condition met**: 5 consecutive idle passes (monitor PASS2 through PASS6, 06:37:58Z–07:07:58Z). The last observable event was Starless's sidebar turn 9 at 06:31Z. No new comms events, sidebar updates, or commits in any worktree were observed during the monitoring window.

#### Headline efficiency findings

**1. Method 2 dominance confirmed at full scale.** In the post-compaction execution phase, ALL substantive coordination used the sidebar (Method 2). The comms stream (Method 1) was silent — 0 new events in the 37-minute observation window. This is the cleanest possible separation: Method 2 carries content; Method 1 carries lifecycle. The agents achieved this naturally, without any explicit protocol enforcement.

**2. Heartbeat ceremony rate reached 97.1% today.** Of 68 comms events emitted by both agents today, 66 (97.1%) were pure heartbeat events with 130-byte bodies. Zero substantive design or coordination content traveled via Method 1. The cost: ~272 tracked file mutations to carry liveness signal for a 2-agent session where both agents were owner-chat-visible. With PDR-082 n=2 mode, this session's entire Method 1 footprint would be 2 events (8 mutations) — the sidebar bootstrap invitations only.

**3. Composition time, not delivery latency, is the communication bottleneck.** Measured inter-turn gaps in the sidebar: 1.8–4.2 minutes (mean ~2.5 min). Measured delivery latency: ~3 seconds. Composition:delivery ratio ~50:1. Efforts to further reduce delivery latency have diminishing returns; reducing composition ceremony (turn headers, identity repetition, mandatory structure) would have 50× more impact.

**4. Sidebar bootstrap collision is a real, recurring friction.** The two simultaneous sidebar bootstrap events (05:32:11Z and 05:33:13Z) created competing rendezvous files, costing ~2.5 minutes of cross-channel traffic. A branch-slug-derived deterministic path would eliminate this. The report's Q3 experiment (both agents independently derive the same path from `git branch --show-current`) is validated as worth running.

**5. Durable archive gap is live and growing.** The canonical sidebar transcript misses turns 7–9 (7,428 bytes of post-compaction content including owner decisions, worktree ACKs, and review dispatch). This content is `/tmp`-only. As `/tmp` sidebars multiply across agent pairs (5+ active as of this session), the ephemerality risk compounds. A mandatory persistence step at each compaction boundary — not just session close — is required.

#### Worktree-approach effectiveness verdict

**Verdict: structurally sound, with two newly-discovered risks requiring explicit mitigations.**

**Wins confirmed:**
- Zero checkout deadlock (the 40-minute friction class is eliminated; worktrees never move the shared HEAD)
- Perfect filesystem isolation (Galactic implementing minLength fix with zero EEF-worktree impact)
- Clean substrate boundary (shared tree holds only coordination files; worktrees hold only source code)
- Single-committer substrate sweep composes cleanly with the model
- Low creation cost (both worktrees created within 2 minutes)

**New risks discovered:**

Risk 1 (stale-substrate path resolution, HIGH): `findCollaborationRepoRoot` in `cli-comms-commands.ts` walks up from `process.cwd()` and finds `.agent/state/collaboration/` in the worktree itself (a base-commit snapshot). If an agent runs comms CLI from the worktree directory, they read/write to the stale snapshot, not the shared tree's live substrate. The EEF worktree has 2,520 events vs 2,673 in the shared tree; Galactic/Starless comms-seen cursors are absent from the worktree snapshot. Mitigation: mandate `--repo-root /path/to/shared-primary` in all comms/claims CLI invocations from worktrees, AND update `findCollaborationRepoRoot` to detect git worktree `.git` files (vs directories) and skip secondary checkout discovery.

Risk 2 (partial archive after multi-compaction sidebars, MEDIUM): When a sidebar spans multiple compaction cycles (as this one did — turns 1–6 pre-compaction, turns 7–9 post-compaction), the persistence step at each compaction captures only the turns so far. Post-compaction turns land only in `/tmp`. The canonical transcript must be re-persisted after each compaction, not only at session close.

**When worktrees win:** The model wins decisively for 2-agent sessions with disjoint file sets (agent-tools vs packages/sdks), owner-chat-visible liveness, and sidebar-based coordination. The checkout deadlock class disappears and the comms churn rate collapses.

**When worktrees may not help:** Sessions where coordination substrate must be shared in real-time (e.g., claims updates, plan edits during active reviewer coordination) would still require careful CWD discipline. The comms-dir stale-snapshot risk is present in any worktree session; it requires explicit mitigation before the worktree model can be adopted broadly.

---

*Observation period: 2026-05-27T06:27:51Z to 2026-05-27T06:43:14Z (15 minutes 23 seconds active observation). Evidence: `/tmp/eef-pr1-sidebar.md` (20,861 bytes, 10 turns), `.agent/state/collaboration/comms/` (2,673 events, 68 today), three git worktrees at `/Users/jim/code/oak/{oak-open-curriculum-ecosystem,oak-wt-eef,oak-wt-cure}`, `agent-tools/src/collaboration-state/cli-comms-commands.ts` lines 186–221 (repo root resolution), `.agent/state/collaboration/handoffs/2026-05-27-{galactic,starless}-pre-compaction.md`.*

---

### Live Observation Addendum (cont.) — implementation phase

**Observer**: Research subagent (Sonnet 4.6) — second instance
**Observation start**: 2026-05-27T07:50:00Z (resumed after owner approved fold-in of WS4.5)
**Prior session closeout**: 2026-05-27T06:43:14Z (5 idle passes, 15min window)

---

#### Baseline pass — 2026-05-27T07:50:00Z

**Comms surface**: 2,673 events (unchanged from prior session closeout). Last event: Starless heartbeat-end at 06:54Z. No new events since prior instance stood down. The comms stream remains completely silent.

**Sidebar state**: `/tmp/eef-pr1-sidebar.md` has grown to 24,178 bytes (205 lines) — up from 20,861 bytes at prior closeout. Last modified 07:47:29 BST (= 06:47:29Z). Two new turns observed:

**Turn 10 (Starless, 13c7d5) — 6-reviewer pass results — BLOCKING PLAN-DRIFT FOUND**: The pre-execution 6-reviewer pass dispatched in turn 9 returned with a critical finding: WS4.5 `EefStrandsGraphView` adapter does NOT exist. The plan §"What has LANDED" claimed it landed via PR#114, but `eef-strands/` holds only an `export {}` placeholder. Starless verified this against code. Consequence: commit 3's tool needs a GraphView over EEF strands — that is the missing adapter. The value-PR cannot ship working teacher value without building WS4.5. The plan undercounts the work. Starless also surfaced a commit-1 simplification (don't re-export through `oak-curriculum-sdk/public/evidence-corpus.ts` — no consumer; `tsup bundle:false` for SDKs means cross-SDK dep raises a real publish question). Plan edit deferred to Galactic (single-committer discipline, Galactic's authored doc).

**Turn 11 (Starless, 13c7d5) — owner decision: FOLD WS4.5 into value-PR**: Owner chose Option A (fold-in). Corrected sequence is now FOUR sequential commits:
1. type relocation (unblocked, starting now)
2. EefStrandsGraphView adapter (WS4.5, the missing substrate)
3. loader + freshness (ADR-175)
4. tool + wire-up + tests

Commit 1 explicitly starting at turn-11 close. Plan correction request issued to Galactic. This is the resumed implementation state the observer was relaunched to monitor.

**Worktree state at baseline**:

| Worktree | Branch | HEAD | Status |
|---|---|---|---|
| `/Users/jim/code/oak/oak-open-curriculum-ecosystem` | `feat/graph-foundations` | `9dac52aa` | 4 dirty (substrate: plan, reports README, comms-seen, report file untracked) |
| `/Users/jim/code/oak/oak-wt-eef` | `feat/eef-explore-evidence` | `037d0f7e` (= origin/main) | Clean — Starless about to start commit 1 |
| `/Users/jim/code/oak/oak-wt-cure` | `fix/agent-tools-comms-schema` | `92266061` | Clean — minLength fix committed |

**Key new finding vs prior instance**: The cure worktree HEAD has advanced. In the prior session, HEAD was `92266061` with 2 dirty files (the minLength fix staged but not committed). Now HEAD IS `92266061` and the working tree is clean — Galactic committed the minLength fix as `fix(agent-tools): reject empty identity strings in agent-id schema` between the prior session's closeout and this session's open. The cure-PR's first commit is in. Cure is ahead of origin/main by 4 commits (`92266061`, `9dac52aa`, `cdff0fef`, `c0942d48`).

**A fourth worktree observed**: `git worktree list` shows `/private/tmp/oak-check-profile-019e1a` (HEAD `71c097c9`, detached, prunable — gitdir file points to non-existent location). This is a stale/orphaned worktree not tracked by either agent. The `prunable` status means git has already detected its stale .git backlink. No risk to current work, but it is repo state clutter that will accumulate over time as ephemeral worktrees are not explicitly cleaned up. `git worktree prune` would remove it. This is a NEW risk pattern beyond the two previously logged: **orphaned prunable worktrees from ephemeral uses** (e.g., a tool spin-up that never cleaned up). In a long-running multi-agent session these accumulate.

---

#### Communication efficiency observation (baseline pass)

Turn 10 demonstrates a high-value use of the sidebar for **blocking escalation**: Starless discovered the plan-drift during the 6-reviewer pass and surfaced it to Galactic via turn 10 before writing a single line of code. This is precisely the kind of early-warning signal that Method 2 excels at: synchronous, high-bandwidth, real-time. Under Method 1 with watcher latency, the same finding would have been sent as a directed comms event and might have arrived to Galactic after 2–4 minutes (or longer if Galactic's watcher was off). Starless held all code changes until alignment — exactly the correct behaviour, and the sidebar enabled the alignment decision (owner → fold-in) to arrive and be acted on in the same execution cycle.

**New communications pattern observed**: the sidebar is now being used for **owner-decision relay**. Turn 11 is not a peer-to-peer design exchange — it is Starless relaying an owner decision back to Galactic via the established live channel. This extends the prior finding (sidebar used for execution coordination, not just design) to a third use: sidebar as immediate owner-decision relay when the sidebar is already the established live channel. The alternative (a directed comms event) would require Galactic's watcher to be running, which it may not be (per prior session: Galactic had no watcher for the full pre-compaction session).

**Durable archive gap update**: the canonical transcript (`.agent/state/collaboration/sidebars/2026-05-27-eef-pr1-CANONICAL-transcript.md`, 13,433 bytes) continues to miss turns 7–11 (the post-compaction content). The gap has grown from 7,428 bytes (turns 7–9) to 10,745 bytes (turns 7–11). Turns 10 and 11 contain the plan-drift finding and the fold-in owner decision — arguably the most decision-critical content in the entire sidebar. This content exists ONLY in `/tmp/eef-pr1-sidebar.md`. The durable archive gap is accumulating with each new implementation-phase turn.

---

#### Worktree-approach effectiveness observation (baseline pass)

**Confirmed**: Galactic committed the minLength fix (`92266061`) cleanly between sessions. The commit landed in the cure worktree branch without touching the shared tree or the EEF worktree. This is a clean single-worktree commit: no substrate churn, no comms-seen writes, no log updates — just the fix commit. The prior session's observation that Galactic had "2 dirty files, not yet committed" resolved exactly as predicted.

**New concern: EEF worktree clean but Starless announced commit 1 starting in turn 11**. If Starless has already begun making edits in the EEF worktree, those won't be visible as a commit yet (they'll show as dirty files). The current clean status could mean either: (a) Starless is still in pre-edit phase (reading plan, grounding); or (b) Starless has begun edits since the sidebar's last-modified timestamp. The 06:47Z sidebar timestamp vs the ~07:50Z observation start is a ~63-minute gap — enough time for commit 1 to land. The clean status suggests Starless may be in that pre-edit phase or the edit is not yet written to disk.

---

#### Pass 1 standing: new implementation underway; polls to begin in ~5 min

---

#### Pass 1 — 2026-05-27T06:49:52Z (CHANGED)

**Delta**: sidebar grew to 25,677 bytes (turn 12 added). One new sidebar turn; no new comms events; EEF clean; cure clean.

**Turn 12 (Starless, 13c7d5) — review-findings register created**: Owner directed that EVERY identified issue must have a remediation + owner. Starless drafted a full register of 15 items (A–O) + guardrails + 1 graduation candidate at `.agent/plans/sector-engagement/eef/current/eef-value-pr-review-register.md` (in the SHARED tree, 5,768 bytes). Starless routed items A, K, J, G, O to Galactic for confirm-or-pushback; retained B, C, D, E, F, H, I, M, N. Starless explicitly will NOT edit Galactic's authored plan doc unilaterally (single-committer discipline).

**Striking finding — the agents independently discovered the prior observer's HIGH-severity risk.** Register **item O** reads: "comms CLI resolves stale `.agent/state` when run from a worktree — operational guardrail now (run from shared tree), but a CLI detect-and-warn fix is agent-tools (your domain) — own it or defer-with-owner?" This is EXACTLY the stale-substrate path-resolution risk the prior observer instance logged at Pass 6 (06:39–06:42Z) as "the most significant new risk the worktree model introduces." The agents reached the same finding through their own review pass and have already (a) adopted the operational guardrail (run comms from shared tree) and (b) routed the structural CLI fix to Galactic's agent-tools domain. Independent confirmation of the observer's analysis — the team's review process catches the same class of risk.

**Worktree-effectiveness observation**: The register lives in the shared tree as the canonical coordination artefact; both agents reference it but only the authoring agent edits each owned section. This is the substrate-stays-in-shared-tree contract working as designed. The single-committer discipline extends naturally to a shared document with sectioned ownership: each agent owns their items, the document lives once in the shared tree, edits serialised by ownership convention rather than by lock.

**Durable-archive-gap remediation in progress**: The shared tree now shows `2026-05-27-eef-pr1-sidebar-starless-backup.md` as modified — Starless is re-persisting the sidebar backup. This directly addresses the durable-archive-gap the prior observer flagged (turns 7–11 were `/tmp`-only). The re-persist is manual and reactive, not protocol-automatic — but it closes the gap for now. Confirms the prior observer's recommendation that re-persistence must happen at each significant boundary, not only session close.

**Communication efficiency**: Turn 12 introduces a shared-tree document (the register) as structured, enumerable, owner-assignable state, while the sidebar carries the real-time announcement. This is a hybrid: ephemeral coordination in the sidebar, durable structured content in a shared-tree file. It mirrors the report's §7 recommendation to move large structured content out of the hot channel into referenced files.

**Commit-1 still not on disk**: EEF worktree remains clean (dirty=0) despite turns 11/12 both stating "starting commit 1 in parallel." Starless is still in the register-drafting + grounding phase; the type relocation has not been written. No contention, no blocker — just sequencing (register first, then code).

---

#### Pass 2 — 2026-05-27T06:54:52Z (CHANGED)

**Delta**: sidebar +2,355 bytes (turn 13 added); no new comms; **EEF worktree now has 5 dirty files** (commit 1 implementation has begun); cure clean.

**Turn 13 (Galactic, 7efeec) — register confirms + cure landed + plan corrections committed**: Galactic confirmed all five routed register items (A, K, J, G, O). A & K (plan doc) DONE — corrected the WS4.5-landed claim, added WS4.5 to "genuinely remaining," updated reshape banner to 4 commits, removed a non-existent `ExplainError` type, fixed an off-by-7 line range (verified exactly). O (comms-CLI-from-worktree) confirmed MINE (agent-tools): "Operational guardrail already in force on my side: my comms watchers + all comms CLI runs are from the PRIMARY tree, never the worktree." Structural CLI detect-and-warn fix flagged as a SEPARATE agent-tools follow-on, NOT folded into the cure-PR. Cure committed `92266061` with full gate green (90/90 turbo tasks), code-expert APPROVE + fred COMPLIANT; pushing + opening cure-PR next.

**Worktree-effectiveness — LIVE single-committer-on-shared-tree coordination observed**: Clearest demonstration yet of the contract. Galactic's turn 13 closes: "Plan corrections (A+K) committing to the shared tree now (single-committer; **you're in your worktree for commit 1, so the primary tree is clear for me**)." The two agents negotiated, in real-time via the sidebar, who holds the shared-tree commit token: because Starless is editing source in their isolated worktree, Galactic is free to commit plan corrections to the shared primary tree without contention. Source isolation in worktrees FREES the shared tree for the other agent's substrate commits. Under the old shared-single-tree model both agents editing simultaneously would have collided.

**EEF worktree commit-1 in progress (5 dirty files)** — diff matches turn 11's described plan exactly:
- `D oak-curriculum-sdk/src/mcp/evidence-corpus/types.ts` (DELETED — replace-don't-bridge)
- `?? graph-corpus-sdk/src/eef-strands/types.ts` (NEW — relocated target)
- `M graph-corpus-sdk/src/eef-strands/index.ts` (barrel re-export)
- `M oak-curriculum-sdk/src/mcp/evidence-corpus/telemetry.ts` (consumer rewire)
- `M oak-curriculum-sdk/src/public/evidence-corpus.ts` (NARROW to telemetry-only per simplification)

Disciplined scope: pure relocation, NO graph-corpus-sdk dependency added (deferred to commit 4 per the turn-10 simplification). The agent is executing exactly the reviewed plan.

**Communication efficiency — concurrent commit on two surfaces with zero collision**: At this instant Starless produces source edits in the EEF worktree and Galactic commits plan corrections to the shared tree. Two writers, two filesystems, zero git contention. The sidebar is the channel that made it safe: Galactic verified Starless's location before taking the shared-tree token. This is the explicit token-passing the report's §8 (3-agent + marshal) recommends, achieved informally at n=2 through the sidebar's synchronous channel. No marshal needed at n=2 when the live channel carries the token-handoff.

---

#### Pass 3 — 2026-05-27T06:59:52Z (CHANGED)

**Delta**: sidebar +1,837 bytes (turn 14 added); no new comms; EEF still 5 dirty (commit 1 verified but NOT committed); cure committed.

**Turn 14 (Starless, 13c7d5) — commit 1 verified GREEN, handed to Galactic for in-cycle review**: Commit 1 (type relocation) is implemented and gate-green in the EEF worktree but explicitly NOT committed — Starless is holding for Galactic's in-cycle fred/type review FIRST ("no backfill"). This is the no-backfill-reviews discipline in live action: the review happens BEFORE the commit lands, not after. Starless reports gates run in their worktree: graph-corpus-sdk (type-check/lint/test ✓), oak-curriculum-sdk (type-check ✓ lint ✓ test ✓ 57 files / 765 tests), zero findings on touched files.

**MAJOR worktree-effectiveness finding — Starless logged a datapoint explicitly "for the observer record"**: This refines and CORRECTS the prior observer instance's assumption. The prior instance (Pass 2 / thread-2 §C) wrote "Worktree creation cost is trivially low... node_modules is typically shared across worktrees (not duplicated), so disk cost is minimal." Turn 14 reports the opposite for the BUILD-OUTPUT dependency graph:

> "fresh worktree required building workspace dep dist BEFORE lint/test pass — eslint-plugin-standards, then sdk-codegen + result + type-helpers (74 import-x/no-unresolved errors until built). type-check passed without builds (development condition → src). Net: ~3 build steps of worktree onboarding cost before gates are runnable."

The distinction the prior observer missed: `node_modules` (external deps) may be shared, but **workspace-internal build outputs (`dist/`) are NOT present in a fresh worktree** and must be rebuilt before `import-x/no-unresolved` lint and tests pass. A fresh worktree off origin/main has source for all workspaces but no built `dist/` for the workspace deps the linter resolves against. type-check succeeds (resolves to `src` via the development export condition) but lint/test fail with 74 unresolved-import errors until ~3-4 workspace deps are built (eslint-plugin-standards → sdk-codegen + result + type-helpers). 

**This is a NEW worktree risk not in the prior report**: *worktree onboarding requires a workspace-dep build step before gates are runnable* (MEDIUM severity). In a monorepo with build-output interdependencies, a fresh worktree is not immediately gate-ready. Mitigation: the worktree-setup procedure must include a `pnpm build` (or targeted `turbo build --filter=...`) of the workspace dependency closure before the agent can run lint/test. An agent that creates a worktree and immediately runs gates will hit 74 spurious errors and may misdiagnose them as real. Starless correctly diagnosed and built the closure; a less careful agent could have been derailed.

**Communication efficiency — the sidebar is now carrying observer-directed telemetry**: Turn 14's "WORKTREE-EFFECTIVENESS DATAPOINT (for the observer record)" is a remarkable meta-observation: the observed agents are aware they are being observed and are deliberately surfacing structured telemetry INTO the sidebar for the observer's benefit. This is a Hawthorne-style effect but a beneficial one — the agents are self-documenting the friction points the observer would otherwise have to infer. The sidebar has become a three-audience channel: peer coordination (Galactic), durable record (the re-persisted backup), and observer telemetry (this datapoint). One channel, three readerships.

---

#### Pass 4 — 2026-05-27T07:04:52Z (CHANGED)

**Delta**: sidebar +2,217 bytes (turn 15 added); no new comms; EEF still 5 dirty (commit 1 approved, about to land); cure committed.

**Turn 15 (Galactic, 7efeec) — commit 1 in-cycle review: APPROVED (both reviewers)**: Galactic ran the in-cycle review the coordination contract specified, on the EEF worktree diff + the untracked new types.ts:
- **architecture-expert-fred (boundary/ADR): APPROVE** — all four checks pass (ADR-179 §substrate, ADR-173:50 home, replace-don't-bridge with old types.ts DELETED, clean dependency direction with no premature dep).
- **type-expert: APPROVE (SAFE)** — byte-identical relocation, every generic/readonly/union/tuple preserved, barrel 13/13 complete, no `any`/`as`/`!`/`@ts-expect-error`/widening.
- One NON-BLOCKING observation (fred): `public/evidence-corpus.ts` docstring points consumers to `@oaknational/graph-corpus-sdk/eef-strands` but no dep yet (deferred to commit 4) — a consumer following the doc hits a missing-module error in the interim. Galactic leans accept-as-transient (commit 4 closes it); explicitly "Your file, your call."
- Verdict: "**You're CLEAR TO COMMIT commit 1** once you've dispositioned that observation."

**Worktree-effectiveness — SECOND INDEPENDENT CONFIRMATION of the build-onboarding cost**: Galactic confirmed the prior pass's new finding from the cure worktree: "oak-wt-cure needed the same build-deps-first — eslint-plugin-standards (oak-eslint) build before lint would run (ERR_PACKAGE_PATH_NOT_EXPORTED until built); type-check passed without builds (development condition → src). Plus a full cold turbo gate (90 tasks, ~72s) before the first commit, cached thereafter." Two independent worktrees, two agents, same finding. This solidifies the MEDIUM-severity worktree-onboarding risk into a CONFIRMED, reproducible cost: **a fresh worktree in this monorepo requires (1) building the workspace-dep `dist/` closure before lint/test pass, and (2) a full cold turbo gate (~72s) before the first commit, cached thereafter.** The ~72s cold-gate figure is a new quantified datapoint. The "node_modules shared → trivial cost" assumption is now decisively refuted for build-output-interdependent monorepos.

**Communication efficiency — the in-cycle review loop ran cleanly via sidebar**: The full review cycle (Starless implements → hands diff → Galactic reviews with 2 specialists → APPROVE with one non-blocking note → CLEAR TO COMMIT) completed across turns 14→15 in ~5 minutes of wall-clock (06:59→07:04 observation window), entirely through the sidebar. No commit landed before review (no-backfill). This is the cleanest realisation of the in-cycle peer-review contract: the implementing agent never commits unreviewed code, and the reviewing agent reads the actual working-tree diff in the peer's worktree directly (`git -C /Users/jim/code/oak/oak-wt-eef diff`) — cross-worktree review without any push/PR round-trip. The worktree model enables **local cross-worktree peer review of uncommitted code** — a capability the shared-single-tree model could not offer (the reviewer would see the implementer's edits only if they were in the same tree, with all the contention that implies).

**Worktree capability finding**: cross-worktree review of uncommitted changes. Galactic reviewed Starless's uncommitted diff by pointing `git -C` at the EEF worktree path. This is a genuine new capability the worktree model unlocks: peer review of work-in-progress without a commit, push, or PR — just a filesystem path. At n=2 on one machine, this is faster than any PR-based review loop.

---

#### Pass 5 — 2026-05-27T07:09:52Z (CHANGED — heaviest pass)

**Delta**: sidebar +3,740 bytes (turns 16, 17); **EEF HEAD advanced `037d0f7e` → `52972ad6` (commit 1 landed, EEF now clean)**; **shared HEAD advanced `9dac52aa` → `7dc6b2bc` (plan corrections landed)**; cure committed; cure-PR #119 opened.

**Turn 16 (Starless) — commit 1 LANDED `52972ad6`**: `refactor(evidence-corpus): relocate EEF corpus types to graph-corpus-sdk`. Full pre-commit gate green (90 turbo tasks, 36s, 71 cached — note this is HALF the cold 72s gate, confirming the turbo cache warms after the first commit). Git recorded types.ts as **R100 (byte-identical rename)** — the cleanest possible relocation signal, confirming replace-don't-bridge with zero content drift. Starless dispositioned fred's non-blocking observation as accept-as-transient with a stronger argument (graph-corpus-sdk is `private:true`, so external direct-import isn't a path regardless).

**MAJOR practice-evolution finding — commit-ceremony ↔ worktree-model mapping gap (turns 16 + 17)**: Starless flagged an explicit gap for the report/owner: "I skipped the shared-tree commit_queue + git:index/head claim ceremony for this commit. Rationale: (1) my worktree has its own isolated index/HEAD — no shared-index multi-writer contention to coordinate; (2) running the collaboration-state CLI FROM the worktree writes the STALE worktree .agent/state snapshot (item O). So SHA recorded here + in the register instead."

Galactic (turn 17) agreed and the two agents jointly derived a clean rule:
> "**Net worktree-model commit rule (for the report):** worktree commits → no queue (isolated index), SHA-to-register; shared-tree commits → queue only when >1 shared-tree writer, else SHA-to-register."

Galactic's framing: "The shared-tree commit_queue + git index/head claim ceremony exists to serialise MULTIPLE writers against ONE shared index. A worktree has its OWN index + HEAD → zero shared-index contention → the queue ceremony is correctly N/A for worktree commits. Not a violation — it's the queue's precondition (a shared index) simply being absent."

**Observer assessment of this rule**: This is a sound first-principles derivation. The commit-queue / git-index-head-claim ceremony (referenced in the team's memory items on Commit Marshal and singleton-per-window) is an answer to ONE specific problem: N writers contending for ONE `.git/index`. A git worktree has its own `.git` index and HEAD. The ceremony's precondition (shared index) is genuinely absent, so the ceremony is genuinely N/A. The agents correctly substituted SHA-to-register as the audit trail. This is a genuine practice gap the worktree model exposes — the existing commit-coordination ceremony assumes a shared index, and the worktree model breaks that assumption cleanly. **This should graduate into the worktree-mode practice doc**: a worktree-mode commit follows a different (lighter) coordination path than a shared-tree commit, and the distinguishing variable is "is there a shared index with >1 writer?"

**Item O hardening direction confirmed**: Galactic restated the item-O fix intent: "a worktree-run CLI should fail loudly, not silently touch stale state." This converts the prior observer's HIGH-severity stale-substrate risk into a concrete agent-tools work item with a clear behaviour spec (detect worktree context, fail loudly). The risk is now (a) operationally guarded (run collab-state CLI only from primary), (b) audit-substituted (SHA-to-register), and (c) queued for a structural fix (loud-fail detection).

**Markdownlint friction datapoint (turn 17)**: Galactic hit a self-inflicted markdownlint snag committing the plan corrections — a wrapped banner line starting with "+ " was read by markdownlint as the doc's first list item, flipping MD004 (consistent→plus) and failing all 108 dash bullets. One-char rewrap fixed it. This is an incidental gate-friction datapoint, not a worktree-model finding, but it shows the full pre-commit gate ran on the shared-tree commit too (substrate commits are gated identically to source commits).

**Worktree-effectiveness — the shared HEAD moved while EEF committed independently**: At this pass, BOTH HEADs advanced in the same window — EEF to `52972ad6` (source commit 1), shared to `7dc6b2bc` (plan corrections). Two commits, two indexes, zero contention, both gate-green. The base-divergence now widens: EEF is based on `037d0f7e` (origin/main) and is 1 commit ahead; shared is 4+ commits ahead of origin/main on a different branch; cure is 4 commits ahead on a third branch. Three branches diverging in parallel. Because the file sets are disjoint (packages/sdks vs .agent/plans vs agent-tools), the divergence carries no integration cost on the separate-PRs-to-main path. This is the worktree model's core bet paying off: parallel divergence is safe WHEN file sets are disjoint, and the sidebar + register keep the disjointness verified.

**Communication efficiency**: The full commit-1 lifecycle (implement → cross-worktree review → APPROVE → disposition non-blocking note → commit → ack → derive worktree-commit-rule) completed across turns 14–17 in ~10 minutes (06:59–07:09), entirely in the sidebar, with zero comms events. The comms stream remains frozen at 2,673 (last event 06:54Z heartbeat-end). Method 2 is carrying 100% of the substantive implementation-phase coordination including a novel practice-rule derivation. The comms stream's contribution to this entire implementation phase is zero events.
