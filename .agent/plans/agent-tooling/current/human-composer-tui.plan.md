---
name: "Human Composer TUI — Owner→Agents Mini-Slack Surface"
overview: >
  Add a composer surface to the collaboration TUI so the human owner can send
  broadcasts, group messages, directed messages, replies, and sync events to
  the agent team without leaving the dashboard. Write-side companion to
  `cost-of-collaboration.plan.md §P8` (read-only dashboard) and storage
  sibling to `comms-watch-storage-redesign.plan.md` (cache + receipt-state
  primitive). Closes gaps G1–G10 surfaced by the 2026-05-25 review-and-
  consistency fan-out.
todos:
  - id: ws0-owner-doctrine-decision
    content: "WS0 — Owner doctrine decision: ratify Path A (schema extension with `author_kind: \"agent\" | \"owner\"`) over Path B (privileged agent-identity wrapper; rejected as in-band signalling) and Path C (new event kind; rejected as duplicating cross-kind operations). PDR-083 draft authored on ratification. Decision gate, not a code cycle."
    status: pending
  - id: ws1-cycle-1
    content: "WS1 cycle 1: composer-state pure state machine — failing unit test (accepts body + audience + kind; emits well-formed comms-event JSON on send; rejects empty body / empty audience / self-only audience) + product code at `agent-tools/src/collaboration-state/composer-state.ts`. One commit. Tree green at end."
    status: pending
    depends_on: [ws0-owner-doctrine-decision]
  - id: ws1-cycle-2
    content: "WS1 cycle 2: write-side adapter — failing integration test (composer-state plugged into a fake `writeCommsEvent` adapter writes a parseable event file with correct narrative-kind shape) + adapter wiring in CLI composition. One commit."
    status: pending
    depends_on: [ws1-cycle-1]
  - id: ws2-cycle-1
    content: "WS2 cycle 1: composer pane Ink/React component — failing component test (renders body input, audience picker stub, send button; keyboard handlers route to composer-state) + product code at `agent-tools/src/collaboration-state/tui-composer-pane.ts`. One commit."
    status: pending
    depends_on: [ws1-cycle-2]
  - id: ws3-cycle-1
    content: "WS3 cycle 1: roster builder — failing unit test (reads active-claims; deduplicates by (agent_name, session_id_prefix); filters stale/inactive; includes synthetic '*' broadcast row) + product code at `agent-tools/src/collaboration-state/roster-builder.ts`. One commit."
    status: pending
    depends_on: [ws1-cycle-1]
  - id: ws3-cycle-2
    content: "WS3 cycle 2: multi-select audience picker pane — failing component test (picker mounts roster; supports multi-select; emits selected audience array including '*' resolution semantics) + product code; wire into composer pane. One commit."
    status: pending
    depends_on: [ws2-cycle-1, ws3-cycle-1]
  - id: ws4-cycle-1
    content: "WS4 cycle 1: owner-identity resolver — failing unit test ($XDG_CONFIG_HOME/oak/practice/owner.json read; missing-file triggers prompt path; malformed file logs warning + prompt fallback; --owner-as CLI override wins) + product code at `agent-tools/src/collaboration-state/owner-identity.ts`. One commit."
    status: pending
    depends_on: [ws1-cycle-1]
  - id: ws4-cycle-2
    content: "WS4 cycle 2: TUI startup gate — failing integration test (TUI start with missing owner config opens prompt; submitted prompt writes config; composer-state `from` resolves to owner-identity on send). One commit."
    status: pending
    depends_on: [ws4-cycle-1, ws2-cycle-1]
  - id: ws5-cycle-1
    content: "WS5 cycle 1: reply mode — failing test (composer opens in reply mode against a selected event; recipient is swapped from `from`/`to`; `in_response_to` populated; subject defaults to `re: <source>`) + composer-state reply-entry path + UI hotkey on focused event row. One commit."
    status: pending
    depends_on: [ws2-cycle-1]
  - id: ws6-cycle-1
    content: "WS6 cycle 1: sync-kind composer — failing test (accepts ≥2 distinct agent participants from roster + title + body; emits valid ADR-184 sync event with `author_kind: \"owner\"` and `author.owner_id` per Path A; participants are agents only — owner is NOT a participant; rejects <2 distinct agent participants; does NOT enforce author-in-participants when `author_kind === \"owner\"` per ADR-184 owner-composition amendment 2026-05-25) + composer-state sync mode + UI hotkey. One commit."
    status: pending
    depends_on: [ws3-cycle-2, ws4-cycle-1]
  - id: ws7-cycle-1
    content: "WS7 cycle 1: channel taxonomy renderer extension — failing test (events where `author_kind === \"owner\"` render with `[OWNER]` label in text-mode and a distinct visual stripe in interactive mode; snapshot and component proof) + renderer extension. One commit."
    status: pending
    depends_on: [ws0-owner-doctrine-decision, ws1-cycle-2]
  - id: ws8-cycle-1
    content: "WS8 cycle 1: receipt-state reader — failing test (per-event seen-agent count from seen-state storage; renders 'seen by X/Y' affordance next to recently-sent owner events; falls back to legacy `comms-seen/` location if `comms-watch-storage-redesign.plan.md` WS2 has not landed, with technical-debt log entry) + product code. One commit."
    status: pending
    depends_on: [ws1-cycle-2, ws3-cycle-1]
  - id: ws9-cycle-1
    content: "WS9 cycle 1 (OPTIONAL follow-on): `comms owner-author` CLI subcommand — failing integration test + thin wrapper around composer-state for scripted owner messaging outside the TUI. One commit. Defer if bandwidth-constrained."
    status: pending
    depends_on: [ws1-cycle-2]
  - id: ws10-docs
    content: "WS10: documentation propagation — update `.agent/reference/comms-watch-mechanism.md` (or sibling) with owner-author semantics; update `agent-tools/` README; update `start-right-team` SKILL if owner-composer touch points apply. One commit; reviewer dispatch (`docs-adr-expert` + `onboarding-expert`)."
    status: pending
    depends_on: [ws1-cycle-2, ws2-cycle-1, ws3-cycle-2, ws4-cycle-2, ws5-cycle-1, ws6-cycle-1, ws7-cycle-1, ws8-cycle-1]
isProject: false
---

# Human Composer TUI — Owner→Agents Mini-Slack Surface

**Last Updated**: 2026-05-25
**Status**: 📋 EXECUTABLE / QUEUED — WS0 owner ratification required before
WS1+ implementation.
**Scope**: Write-side companion to the existing read-only collaboration
TUI (`cost-of-collaboration.plan.md §P8`). Closes gaps G1–G10 surfaced by
the 2026-05-25 review-and-consistency fan-out (4 reviewers under the
`start-right-thorough` session; findings recorded in this branch's
commits `38c9cb41` → `bec4b6ae`).

---

## Context

The collaboration TUI landed (`cdfb8959` + `2791be3c` + `6e804485`)
renders agent-to-agent comms as a human-observer dashboard but is
explicitly read-only by P8 acceptance:

> *"the interactive TUI is for human observers. Agents should keep using
> structured commands and text snapshots unless a human explicitly asks
> them to report what the TUI shows."*
> — `cost-of-collaboration.plan.md §P8 Concrete shape` (L1261)

The owner therefore cannot author messages to agents from the TUI. Owner
directions today flow via per-platform chat (Claude Code window, Cursor
Composer, Codex terminal) and are then narrated into comms-events by an
agent if the team needs to see them. This is an N+1 indirection: many
small directions become lossy when not all are narrated, and the team
loses the unified view that the TUI is otherwise providing.

The comms-event substrate **already supports** group targeting and
sync coordination. `.agent/state/collaboration/comms-event.schema.json`
defines:

- `narrative.audience: string[]` with `"*"` wildcard for all-agents and
  named-agent strings for targeted broadcast.
- `narrative.addressed_to: string` for soft single-recipient routing.
- `narrative.in_response_to: event_id` for threading.
- `directed.from` / `directed.to` for point-to-point.
- `sync.participants: agent_id[]` (ADR-184) for multi-agent synchronous
  coordination, with required ≥2 distinct agent participants. The
  author-must-be-participant invariant is conditional on
  `author_kind === "agent"` (ADR-184 owner-composition amendment
  2026-05-25); for owner-authored sync, the owner originates the
  multi-agent coordination loop but is not a participant.
- `tags: string[]` (ADR-183) for namespace routing.
- `urgency` (ADR-184) composes with every kind.

The schema substrate is ready. The missing pieces are the **owner-as-
author identity shape** (a doctrine question, WS0) and the **TUI write
surface** itself (WS1–WS10).

### Gap origin

This plan covers the ten gaps surfaced by the
`start-right-thorough` review on 2026-05-25 (after the consolidation arc
closed):

| Gap | Description | Workstream(s) |
|---|---|---|
| G1 | TUI is read-only by P8 acceptance | WS1+WS2 (composer) |
| G2 | No human-owner identity in the comms schema | WS0 (doctrine) |
| G3 | `comms direct` infers `from` from agent env; no owner path | WS4+WS9 |
| G4 | No group-target picker UI | WS3 |
| G5 | Reply-from-TUI threading not designed | WS5 |
| G6 | Channel taxonomy doesn't distinguish owner-authored events | WS7 |
| G7 | No owner identity persistence design | WS4 |
| G8 | No sync-kind composer affordance | WS6 |
| G9 | Receipt / read state for owner messages is unwritten | WS8 |
| G10 | Owner-direction-as-comms-event channel is unspecified | WS0 |

---

## End Goal

From a single TUI session, the human owner can:

1. **Observe** agent collaboration (existing P8 read surface, unchanged).
2. **Broadcast** to all agents (`audience: ["*"]`).
3. **Group message** a selected subset (`audience: [name, name, …]`).
4. **Direct message** one agent.
5. **Reply** within an existing thread (recipient + `in_response_to`
   inherited from the focused event).
6. **Start a sync** event (ADR-184 kind) with ≥2 participants selected
   from the roster.

Owner-authored events render with a visually distinct channel label so
any reader (human or agent) can tell them apart from agent-authored
events. Owner identity persists across TUI sessions via a configured
shape that is not coupled to per-platform agent identity.

---

## Mechanism

The schema's existing `narrative` (with `audience: string[]`) and `sync`
(ADR-184, with `participants`) kinds carry the routing. The composer is
a new Ink/React pane in the existing TUI; the implementation lives in
`agent-tools/src/collaboration-state/` alongside the existing P8
modules. Owner identity resolves from a config file at
`$XDG_CONFIG_HOME/oak/practice/owner.json` (mirroring the XDG-cache
pattern from `comms-watch-storage-redesign.plan.md` WS2). The channel
taxonomy renderer extends to recognise owner-authored events and apply
an `[OWNER]` label (text mode) or distinct visual stripe (interactive
mode).

The composer is a **pure state machine** (`composer-state.ts`) with no
IO. Production filesystem/env/clock/id wiring lives only in CLI
composition adapters. This matches the DI/no-IO repair already applied
to P5 (per `cost-of-collaboration.plan.md §P5` Completion correction
2026-05-13).

---

## Assumptions (load-bearing; PDR-026 falsifiability)

Three architectural assumptions underlie this plan. Each is named so a
future reviewer or executor can falsify it before WS1 implementation
lands:

1. **Owner identity persistence via XDG config is correct**. The same
   pattern as `comms-watch-storage-redesign.plan.md` WS2 for cache.
   *Falsifiability*: WS4 test suite verifies XDG resolution + fallback
   path on missing/malformed config + `--owner-as` flag override.

2. **Path A (schema extension with `author_kind`) is owner-ratified**,
   and ADR-184 admits owner-as-author for sync events via the
   owner-composition amendment 2026-05-25. This plan recommends Path A;
   the owner ratifies at WS0. If the owner directs Path C (new event
   kind) instead, WS1–WS7 file scopes shift, the ADR-184
   owner-composition amendment becomes inert (sync stays agent-only),
   and the workstream structure remains. Path B (privileged
   agent-identity wrapper) is rejected as in-band signalling per
   architectural-excellence discipline and is NOT a valid alternative.
   *Falsifiability*: WS0 records the decision before WS1 starts; the
   PDR-083 draft documents the rejected alternatives and references the
   ADR-184 owner-composition amendment.

3. **Roster from active-claims is the right recipient source**.
   Active-claims drives currently-engaged agents; closed-claim agents
   are out of recipient scope (an owner re-engaging a closed agent
   happens via per-platform chat, not the TUI). The roster honours the
   stale/inactive status classifications from P4.
   *Falsifiability*: WS3 test verifies stale/inactive filtering and `*`
   broadcast resolves against the active-only roster.

If any assumption fails empirically during execution, the plan is held
and re-architected — not patched with workarounds.

---

## Means (workstreams)

### WS0 — Owner doctrine decision: `author_kind` schema extension

**This is a decision gate, not a code-bearing workstream.**

**Question**: How should owner-authored comms-events be represented in
the substrate so readers can distinguish them from agent-authored
events?

**Recommendation (Path A — schema extension with `author_kind`)**:

Extend `.agent/state/collaboration/comms-event.schema.json` with an
optional `author_kind: "agent" | "owner"` discriminator at every kind's
author position. Owner authors carry `owner_id: {owner_name, source}`
instead of `agent_id` (or alongside, schema author's choice during
ratification). Existing readers tolerate the new field per
additive-extension discipline (PDR-049 + PDR-050: readers ignore
unknown fields).

**Rationale**:

- Honest representation of the substrate. Humans are not agents; the
  schema should say so.
- Composes cleanly with existing kinds. `narrative`, `directed`, and
  `sync` all gain an `author_kind` field; `lifecycle` is system-
  authored, no owner case.
- Renderers branch on `author_kind` at the channel-taxonomy boundary
  (WS7) — one decision point, not scattered convention checks.

**Alternatives considered and rejected**:

- **Path B — privileged agent-identity wrapper**. Owner authors as an
  agent-identity tuple with reserved values (e.g., `platform: "owner"`,
  `model: "human"`). **Rejected**: in-band signalling via reserved
  values is a known architectural anti-pattern; the substrate would
  call a human an agent, then readers would need convention-only checks
  to detect the lie. Per `feedback_no_cheap_cure_option`, the
  zero-schema-change framing is not a valid trade-off here.
- **Path C — new event kind**. Introduce `owner-direction` as a fourth
  event kind. **Rejected (defaultable)**: cleanest separation but
  cross-kind operations (reply, threading) need duplication; sync events
  with mixed owner+agent participants lose coherence. The owner may
  reframe to Path C during WS0 ratification if they prefer
  kind-separation; the plan body adjusts WS1–WS7 file scopes accordingly.

**Acceptance**:

- Owner ratification artefact recorded: a comms-event tagged
  `owner-direction:human-composer-doctrine` OR explicit chat ratification
  preserved in the agentic-engineering-enhancements thread record.
- PDR-083 draft authored at `.agent/practice-core/decision-records/PDR-083-owner-as-comms-author.md`
  with the ratified path, the alternatives, and the additive-extension
  contract.
- The schema file change is NOT in WS0 — it lands in WS1 cycle 1 as
  part of the composer-state test fixture, per TDD pair discipline.

---

### WS1 — Composer primitive: state machine + write-side adapter

**TDD cycle 1** (one commit):

1. **Failing test** at
   `agent-tools/tests/collaboration-state/composer-state.unit.test.ts`:
   - Composer accepts a body string, an audience array, and an event
     kind discriminator; emits a well-formed comms-event JSON shape on
     `send` action.
   - Rejects: empty body; empty audience; self-only audience (when
     `from === audience[0]`); body exceeding a configurable length.
   - State transitions: `idle → drafting → sending → sent` and
     `idle → drafting → cancelled`.
   - No IO: composer-state takes a clock + id-source via injected
     dependencies.
2. **Product code**:
   `agent-tools/src/collaboration-state/composer-state.ts` — pure
   state machine. `Pick`-typed dependency surface; tests substitute a
   tiny fake per the pattern established in `comms-watch-auto-seed.ts`.

**TDD cycle 2** (one commit):

1. **Failing integration test**: composer-state plugged into a fake
   `writeCommsEvent` adapter writes a parseable event file under a
   tempdir; readback through the existing comms reader produces the
   expected event shape.
2. **Product code**: write-side adapter at
   `agent-tools/src/collaboration-state/composer-write-adapter.ts`;
   wired into CLI composition (not into the pure state machine).

**Acceptance**:

- Composer state machine accepts/rejects per the test contract.
- Write adapter produces an event file readable by the existing reader.

**Files**: New: `composer-state.ts`, `composer-state.unit.test.ts`,
`composer-write-adapter.ts`, `composer-write-adapter.integration.test.ts`.

---

### WS2 — Composer pane: Ink/React UI

**TDD cycle 1** (one commit):

1. **Failing component test**: composer pane renders body input,
   audience picker stub (filled by WS3), and send button; keyboard
   handlers route to composer-state actions (typing → `setBody`;
   enter on send → `send`; esc → `cancel`).
2. **Product code**:
   `agent-tools/src/collaboration-state/tui-composer-pane.tsx` — Ink
   component. No direct IO; consumes composer-state via prop.
3. **Integration**: mount the pane in the TUI app with injected
   composer-state + fake write adapter; assert the adapter is called
   with the expected event after user keystrokes.

**Acceptance**:

- Composer pane renders all three elements.
- Keyboard handlers wire correctly to composer-state.
- React/Ink `act(...)` warnings are absent from the new test surface
  (per the P8 hardening discipline carried in `cost-of-collaboration.plan.md
  §P8 2026-05-13 deep continuation update`).

**Files**: New: `tui-composer-pane.tsx`, component test.

---

### WS3 — Recipient picker: roster from active-claims

**TDD cycle 1** (one commit):

1. **Failing unit test**: roster-builder reads `active-claims.json`,
   produces a deduplicated `(agent_name, session_id_prefix)` roster
   excluding stale/inactive identities (per the P4 status
   classifications consumed by the existing P8 surface); returns
   `*`-broadcast as a synthetic top-row option.
2. **Product code**:
   `agent-tools/src/collaboration-state/roster-builder.ts` — pure
   function with injected IO.

**TDD cycle 2** (one commit):

1. **Failing component test**: multi-select picker pane mounts the
   roster; supports keyboard multi-select (space toggles; enter
   confirms); emits the selected audience array.
2. **Product code**:
   `agent-tools/src/collaboration-state/tui-audience-picker.tsx` — Ink
   multi-select component. Wired into the composer pane (replaces the
   WS2 picker stub).

**Acceptance**:

- Roster excludes stale/inactive agents per P4 classification.
- `*` row resolves to all-active-agents at send time.
- Multi-select keyboard UX works (component test).

**Files**: New: `roster-builder.ts`, `tui-audience-picker.tsx`, tests.

---

### WS4 — Owner identity persistence

**TDD cycle 1** (one commit):

1. **Failing unit test** for `owner-identity-resolver`:
   - Reads `$XDG_CONFIG_HOME/oak/practice/owner.json`.
   - Missing file → returns `unconfigured` sentinel.
   - Malformed JSON → logs warning + returns `unconfigured` sentinel.
   - Well-formed file → returns parsed `OwnerIdentity` shape.
   - `--owner-as <name>` CLI flag wins over config file.
2. **Product code**:
   `agent-tools/src/collaboration-state/owner-identity.ts`.

**TDD cycle 2** (one commit):

1. **Failing integration test**: TUI startup with `unconfigured`
   sentinel opens a one-time owner-identity prompt pane; submitted
   prompt writes the config file via atomic temp+rename; composer-state
   `from` resolves to the configured owner identity on subsequent send.
2. **Product code**: startup-prompt component + composer-state `from`
   injection.

**Acceptance**:

- XDG path resolution mirrors `comms-watch-storage-redesign.plan.md` WS2
  pattern (defaults to `$HOME/.config` on macOS when XDG unset).
- Config file uses atomic write (no `appendFile` per the wilma finding
  carried into the storage-redesign plan).
- `--owner-as` override does not write the config file (one-shot session
  identity).

**Files**: New: `owner-identity.ts`, `tui-owner-prompt.tsx`, tests.

---

### WS5 — Reply / thread context inheritance

**TDD cycle 1** (one commit):

1. **Failing test**: composer opened in reply mode against a selected
   event:
   - For `directed`: recipient is swapped (`to` ← `source.from`).
   - For `narrative`: audience defaults to `[source.from.agent_name]`
     (single-recipient soft routing).
   - `in_response_to: source.event_id` populated.
   - Subject defaults to `re: <source.subject>` (composer prefills).
2. **Product code**: composer-state reply-entry path + UI hotkey on a
   focused event row (`r` to reply).

**Acceptance**:

- Reply mode preserves source-event context.
- Hotkey-driven entry into reply mode works from any focused event row.

**Files**: Extend `composer-state.ts`, `tui-composer-pane.tsx`; add a
hotkey-handler integration test.

---

### WS6 — Sync-kind composer

**TDD cycle 1** (one commit):

1. **Failing test** per ADR-184 sync-kind requirements (with
   owner-composition amendment 2026-05-25):
   - Sync-composer accepts ≥2 distinct agent participants from the
     roster + title + body.
   - Emits valid `sync`-kind event: `kind: "sync"`,
     `author_kind: "owner"`, `author.owner_id: {...}` per Path A,
     `participants: [agent_id, …]` (agents only — owner is NOT a
     participant), urgency field optional.
   - Rejects <2 distinct agent participants (self-only or single-agent
     participants lists).
   - Does NOT enforce author-in-participants when
     `author_kind === "owner"` (per ADR-184 owner-composition amendment).
2. **Product code**: composer-state sync mode + UI hotkey (`s` to enter
   sync mode); audience picker reused as participants picker (no
   `*` row in sync context — sync is always targeted; owner does not
   self-add since they are not a participant under the amendment).

**Acceptance**:

- Sync events validate per ADR-184 (with owner-composition amendment).
- UI distinguishes sync mode visually from narrative/directed modes.

**Files**: Extend composer-state; sync-mode test cases.

---

### WS7 — Channel taxonomy: `[OWNER]` label / visual stripe

**TDD cycle 1** (one commit):

1. **Failing test**: channel-taxonomy renderer applies an `[OWNER]`
   label (text mode) and a distinct visual stripe (interactive mode)
   to events where `author_kind === "owner"`. Snapshot tests for both
   modes; component test for interactive.
2. **Product code**: extend the existing channel-taxonomy renderer in
   `agent-tools/src/collaboration-state/` (location confirmed at WS7
   start by reading P8 source).

**Acceptance**:

- Owner-authored events visually distinct in both render modes.
- Agent-authored events render unchanged.

**Files**: Extend channel-taxonomy renderer + tests.

---

### WS8 — Receipt state: cross-touchpoint with `comms-watch-storage-redesign`

**Dependency note**: `comms-watch-storage-redesign.plan.md` WS2 lands
the mtime-watermark storage primitive. WS8 reads from that primitive to
show per-event seen-state counts. If WS2 has not landed when this plan
executes WS8, WS8 reads the legacy `.agent/state/collaboration/comms-seen/`
location as a fallback with an explicit technical-debt log entry; the
cleanup happens when `comms-watch-storage-redesign` WS3 unblocks (which
itself blocks on the comms research plan completion per owner standing
direction 2026-05-25).

**TDD cycle 1** (one commit):

1. **Failing test**: receipt-state-reader counts per-event seen-agents
   from the seen-state storage (new primitive if available, legacy
   location otherwise); renders a "seen by X/Y" affordance next to
   recently-sent owner events.
2. **Product code**:
   `agent-tools/src/collaboration-state/receipt-state-reader.ts` + UI
   integration in the composer pane's sent-event display row.

**Acceptance**:

- Seen-state count renders accurately against the active roster.
- Fallback path works under legacy storage.

**Files**: New `receipt-state-reader.ts`; UI extension.

---

### WS9 — `comms owner-author` CLI subcommand (OPTIONAL follow-on)

**Defer if bandwidth-constrained.** WS9 enables scripted owner
messaging (shell aliases, dotfiles automation) outside the TUI.

**TDD cycle 1** (one commit):

1. **Failing integration test**: `pnpm agent-tools:collaboration-state
   -- comms owner-author --audience '*' --body 'standup in 5'` writes
   a parseable narrative event with owner authorship.
2. **Product code**: thin CLI wrapper around composer-state; reads
   owner identity from config or `--owner-as` flag.

**Acceptance**:

- CLI subcommand writes valid owner-authored events.
- Helpful error surfaces when owner identity unconfigured.

---

### WS10 — Documentation propagation

**Depends on all WS1–WS8 landing.**

**Cycle** (one commit):

- Update `.agent/state/collaboration/reference/comms-watch-mechanism.md`
  (or sibling reference doc; confirm location at WS10 start) with
  owner-author semantics, `author_kind` shape, and composer-pane
  invocation.
- Update `agent-tools/` README with the composer command surface.
- Update `start-right-team` SKILL if owner-composer touch points apply
  to the team-session bootstrap.
- Reviewer dispatch: `docs-adr-expert` (reference doc alignment) +
  `onboarding-expert` (new agent path through the docs).

**Acceptance**:

- Reference doc matches implementation.
- README mentions the new composer surface.
- Reviewers' findings absorbed.

---

## Prerequisite Classification

- **Blocking**: WS0 owner doctrine decision before any WS1+ code
  cycle. Without WS0 ratification, the composer-state test fixture
  cannot specify the event shape.
- **Blocking (transitive via WS8)**:
  `comms-watch-storage-redesign.plan.md` WS2 for the new storage
  primitive. WS8 can proceed against the legacy location with a
  named technical-debt log entry if WS2 has not landed.
- **Beneficial**: `cost-of-collaboration.plan.md §P8 p8-attention-state`
  slice (unread/seen triage in the read view). Composes naturally
  with WS8 receipt-state but does not block it. Minimum shippable
  without: WS8 renders receipt-state independently; the unread/seen
  indicator on the read side remains a P8 concern.
- **Read-dependency**: ADR-184 (sync kind + urgency field for WS6);
  PDR-076a/b (agent identity tuple — owner identity sits alongside,
  not within); PDR-027 (session identity discipline for WS3 roster);
  ADR-183 (tag namespace for owner-event tagging).

No other external blockers. No beneficial-only prerequisites.

---

## Acceptance Criteria (whole plan)

The plan is `complete` when ALL of the following hold:

| Acceptance id | Proof level | Deterministic proof |
|---|---|---|
| `HC-A1` | E2E + manual TTY smoke | Owner can compose and send a broadcast (`audience: ["*"]`) from the TUI; agents observing the comms stream see the event. |
| `HC-A2` | E2E | Owner can compose a group message to a selected subset; only selected agents see it via audience routing. |
| `HC-A3` | E2E | Owner can compose a directed message to one agent. |
| `HC-A4` | integration | Reply mode inherits recipient + `in_response_to` from the focused event. |
| `HC-A5` | integration + value-proxy | Sync mode validates ≥2 distinct agent participants per ADR-184 (with owner-composition amendment 2026-05-25); emits a valid sync event with `author_kind: "owner"` and owner-not-in-participants. |
| `HC-A6` | component + snapshot | Owner-authored events render with `[OWNER]` label / visual stripe in both text and interactive modes. |
| `HC-A7` | integration | Owner identity persists across TUI sessions via XDG config; `--owner-as` flag overrides. |
| `HC-A8` | integration + value-proxy | Receipt-state ("seen by X/Y") visible for recently-sent owner events. |
| `HC-A9` | non-code | PDR-083 draft authored, owner-ratified, and Accepted. |

`HC-A9` is `complete` when the PDR is in `Accepted` status. All other
acceptance ids require their proof artefact in the test suite or a
documented manual smoke pass.

---

## Non-Goals

- **Web UI**. The TUI is the surface; a browser front-end is out of
  scope. If a future need surfaces, a separate plan in `agent-tooling/future/`.
- **Multi-owner support**. Single owner identity per session. Multi-
  owner shapes are out of scope.
- **Owner-authored lifecycle events**. Lifecycle remains
  system-authored.
- **Authentication / authorisation**. The TUI runs on the owner's local
  machine; no remote auth is in scope. The owner identity contract is
  trust-by-config, not crypto.
- **Markdown rendering** in the message body. Plain text only at
  landing; markdown is a polish pass for a follow-on slice.
- **Message editing / deletion**. Events are immutable per existing
  schema discipline; corrections are new events with `in_response_to`.
- **Notification / alert mechanisms** beyond what the existing watcher
  emits.
- **Direct integration with per-platform chat surfaces** (Claude Code,
  Cursor Composer, Codex terminal). The TUI is independent of those
  surfaces; a bridge is out of scope.

---

## Risks

- **Schema migration cost (Path A)**. Every existing reader must
  tolerate the optional `author_kind` field. *Mitigation*:
  additive-extension discipline per PDR-049 + PDR-050; readers ignore
  unknown fields. The schema validator is updated in WS1 cycle 1 to
  recognise but not require the field.
- **TUI interaction-state complexity grows**. Composer + roster +
  reply + sync modes interact across panes. *Mitigation*:
  composer-state is a pure module with explicit transitions; TUI panes
  are thin renderers consuming the state. Same DI/no-IO discipline
  that the P5 repair installed.
- **Owner config divergence across machines**. If the owner uses
  multiple machines, identity drifts. *Mitigation*: explicit
  `--owner-as <name>` CLI flag overrides; owner can sync config via
  dotfiles repo. Designing that sync is out of plan scope.
- **WS0 ratification delay**. The doctrine question is owner-gated.
  If owner is bandwidth-constrained, WS1+ is blocked. *Mitigation*:
  the plan ships with a clear Path A recommendation + rejected
  alternatives; ratification is a low-cost owner action (chat-level
  ack or PDR-draft review).

---

## Foundation Alignment

- **ADR-184 (comms-event sync kind + urgency)** — WS6 composer
  consumes; the `participants` validation contract lives in ADR-184.
- **PDR-076a / PDR-076b (agent identity tuple)** — owner identity is
  a **parallel** structure; this plan does NOT modify PDR-076. WS0's
  PDR-083 sits alongside, naming the boundary between agent-identity
  (PDR-076) and owner-identity (PDR-083).
- **PDR-027 (threads, sessions, agent identity)** — owner identity has
  its own persistence shape distinct from agent session identity. WS4
  cites PDR-027 to explain the parallel structure.
- **PDR-049 + PDR-050 (additive-extension discipline)** — readers
  ignoring unknown fields makes the Path A schema extension safe.
- **ADR-183 (comms-event tag namespace)** — owner events may carry
  tags; existing namespace applies. WS0 PDR-083 names whether new
  owner-specific tags are needed; default no.
- **`metacognition.md §Cure Shape — Structural, Not Doc-Patch`** —
  WS10 doc updates are FORCED by WS1–WS9 implementation, not patched
  separately.
- **`principles.md § Code Quality + Local broken code never leaves`** —
  each cycle ends with workspace gates green.

---

## Plan-Body First-Principles Check

Per `.agent/rules/plan-body-first-principles-check.md`: this rule fires
BEFORE executing any cycle's tests, implementation, or doctrine moves.

- **Shape**: the proposed workstreams match the work shape. The
  composer-state machine, picker, identity resolver, reply/sync modes,
  renderer, and receipt-state reader each correspond to a distinct
  fault line. No invented serial dependencies; WS3/WS4 are
  parallel-safe with WS1 cycle 1.
- **Landing path**: each cycle is one commit; tests + product code
  land together; workspace gates green at end of each.
- **Vendor literal**: no vendor SDK calls; Ink + React are Oak-internal
  via `@oaknational/oak-design-ink`. No vendor-shape literals to verify.

---

## Readiness Reviewers

Before marking this plan `READY FOR EXECUTION` (post-WS0 ratification):

- `assumptions-expert` — plan-readiness, proportionality,
  WS0-decision completeness, falsifiability of the three named
  assumptions.
- `architecture-expert-wilma` — adversarial probe on owner identity
  shape, schema migration interactions, interaction-state coupling
  under concurrent agent traffic.
- `architecture-expert-betty` — cohesion/coupling between
  composer-state and the existing P8 surfaces; boundary integrity with
  `cost-of-collaboration.plan.md` and `comms-watch-storage-redesign.plan.md`.
- `type-expert` — discriminated-union shape for `author_kind` at the
  parser boundary; ensure schema-first-execution invariant holds.
- `accessibility-expert` — TUI composer keyboard navigation, focus
  traps, screen-reader semantics for the picker pane.

Reviewer dispatch happens at WS0 closure + WS1 execution start, NOT now.

---

## Learning Loop

Plan completion (all WSes landed + acceptance criteria met) triggers a
closeout pass that:

- Runs `consolidate-docs` if any of its triggers fire (likely:
  a plan / milestone has closed).
- Updates `.agent/memory/operational/threads/agentic-engineering-enhancements.next-session.md`
  to record the mini-Slack write surface completion.
- Extracts owner-composer interaction patterns into napkin →
  distilled → graduated as appropriate.

---

## Lifecycle Triggers

- **On WS0 ratification**: PDR-083 draft authored in
  `.agent/practice-core/decision-records/`. Optional companion ADR if
  the owner directs a phenotype-bound decision (e.g., specific
  XDG path location).
- **On WS2 landing**: composer pane visible; surface preview in napkin
  so a future agent debugging the UX has the landing window documented.
- **On WS6 landing**: sync mode usable; update ADR-184's "Local
  Phenotypes" section if appropriate.
- **On all WSes landed**: plan archives to
  `.agent/plans/agent-tooling/archive/completed/` with a
  supersession-mapping entry in the archive's README.

---

## Cross-references

- **Read-side companion**: [`cost-of-collaboration.plan.md`](cost-of-collaboration.plan.md)
  §P8 — collaboration TUI dashboard (read-only). This plan is the
  write-side companion; both consume the same comms-event substrate.
- **Sibling storage plan**: [`comms-watch-storage-redesign.plan.md`](comms-watch-storage-redesign.plan.md)
  — receipt-state (WS8) reads from the storage primitive landed by
  that plan's WS2. WS3 of that plan (cleanup) is BLOCKED on the comms
  research plan; the dependency does not block this plan.
- **Agent-side ergonomics (distinct)**:
  [`../future/agent-coordination-cli-ergonomics-and-request-correlation.plan.md`](../future/agent-coordination-cli-ergonomics-and-request-correlation.plan.md)
  — agent-facing CLI ergonomics and cross-thread request correlation.
  That plan is **agent-side**; this plan is **owner-side**. They are
  parallel-safe.
- **Strategic origin**: 2026-05-25 review-and-consistency fan-out under
  `start-right-thorough` (commits `38c9cb41` → `bec4b6ae`). Four
  reviewers (assumptions-expert, architecture-expert-wilma,
  architecture-expert-betty, docs-adr-expert) flagged the human-composer
  gap during a gap-analysis turn on this branch.
- **Schema source**: [`.agent/state/collaboration/comms-event.schema.json`](../../../state/collaboration/comms-event.schema.json)
  (`narrative.audience`, ADR-184 `sync.participants`).
- **Doctrine landing target**: PDR-083 (proposed, authored at WS0
  closure) in `.agent/practice-core/decision-records/`.

---

## Out of Scope This Plan

- **Read-side TUI improvements** (continue under
  `cost-of-collaboration.plan.md §P8` remaining slices:
  `p8-attention-state`, `p8-reader-resilience`,
  `p8-hot-path-boundary-review`).
- **Storage primitive redesign** (under
  `comms-watch-storage-redesign.plan.md`).
- **Heartbeat-cron mechanism** (deferred under the archived
  `practice-infrastructure-hardening-program.plan.md`; no immediate new
  home).
- **Sync coordination protocol semantics** beyond the schema-level event
  (ADR-184 carries the substrate; richer sync protocol semantics live in
  agent-collaboration doctrine, not in this plan).

---

— Plan authored 2026-05-25 by Hushed Stalking Shade (`bc0a07`,
claude-opus-4-7) following the 2026-05-25 review-and-consistency fan-out
that surfaced gaps G1–G10. The plan body emerged from the
`start-right-thorough` session's gap-analysis turn; the design gate
(WS0) is the only owner-blocking precondition before WS1 implementation
can begin.
