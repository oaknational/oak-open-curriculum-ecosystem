---
id: copilot-cli-local-comms-and-lifecycle
node_type: delivery
name: Copilot CLI local communications and lifecycle
overview: "Connect a deliberately joined local Copilot CLI session to the existing file-backed comms, wake, watcher recovery, handoff, and retirement lifecycle."
status: ratified
ratified_by: "Jim Cresswell"
ratified_date: 2026-07-24
ratified_where: "Owner in-session word 'Implement the plan', relayed by Director Forge rides Brimstone in collaboration event 444463f6-d93f-41c1-81c5-a39b3205338f"
serves: first-class-copilot-cli-practice-citizenship
impact_areas:
  - practice-and-estate
tickets:
  - MCP-156
depends_on:
  - plan: copilot-cli-identity-and-practice-join
    kind: blocking
  - plan: copilot-cli-practice-projections
    kind: beneficial
owner_gates: []
last_updated: 2026-07-24
---

# Copilot CLI local communications and lifecycle

## Goal

A deliberately joined local Copilot CLI session can hear, answer, monitor, hand
off, and retire alongside local Claude and Codex sessions on the existing
coordination substrate, without adding a remote transport.

## Mechanism

Reuse the canonical comms CLI and shared local coordination home. Convert the
one-shot all-channel watcher completion into Copilot CLI's native local
notification path through the CLI-only inline hooks block in
`.github/copilot/settings.json`, re-arm after each wake, and retain
turn-boundary drain plus seen-file gap sweep as recovery. Repository hooks
under `.github/hooks/` are forbidden because cloud agent also loads them. The
standard claim, heartbeat, handoff, and retirement lifecycle remains
authoritative.

The tracked wake entry is an inert runtime-gating shim. Before joining team
comms, the launcher checks the installed host against the tested version floor
and an executable probe proving that `notification` dispatches
`shell_completed` and consumes returned context; the shim repeats the actual
version and event-shape check whenever invoked. An unsupported or failed host
starts no watcher, registers no wake lifecycle, returns no injected comms
context, and is refused team join. It therefore cannot claim local comms
support merely because the tracked entry exists.

The minimum shippable shape without the beneficial projections node uses the
already discoverable team skill and comms CLI after identity/join has landed.
Native projections improve discovery but supply no required communications
runtime primitive.

Detailed wake, burst, cursor, and cleanup contracts live in MCP-156.

## Acceptance criteria (each with a proof)

- **The supported launcher and committed wake shim activate comms only after the
  installed CLI meets the tested version floor and an executable probe proves
  the relied-upon `notification`/`shell_completed` request and returned-context
  shapes.** Proof: `repo-safe` — supported, unsupported, missing-event,
  version-mismatch, and malformed-context fixtures plus launcher-refusal,
  no-side-effect, and per-invocation runtime-gate tests.
- **A joined Copilot CLI session sends and receives directed and broadcast
  events on the existing local comms substrate.** Proof: `repo-safe` — isolated
  multi-session comms integration tests.
- **A directed event wakes the intended idle local session and not unrelated
  sessions, then the watcher re-arms.** Proof: `repo-safe` — notification,
  self-exclusion, and re-arm integration tests.
- **Watcher restart resumes from the durable seen-file cursor and gap-sweeps
  missed events without replay storms.** Proof: `repo-safe` — crash/restart,
  burst, ordering, duplicate, and cursor-advancement tests.
- **Claims and heartbeats remain fresh while active, and handoff/retirement
  stops session-owned lifecycle state.** Proof: `repo-safe` — lifecycle and
  stale-cleanup integration tests.
- **A real local Copilot CLI acceptance seat demonstrates wake, reply, recovery,
  handoff, and retirement.** Proof: `owner-held` — evidence recorded on MCP-156
  and the implementation pull request by the owner, who runs or observes the
  local Copilot CLI seat.

## Todos

- **Wake-and-drain PR (round budget: at most two review rounds).** Wire native
  local notification to one-shot watch only after its version/probe gate
  passes, then prove re-arm, turn-boundary drain, and gap recovery with
  failure-injection tests.
- **Lifecycle-proof PR (round budget: at most two review rounds).** Prove
  claims, heartbeat, peer liveness, handoff, retirement, and live CLI
  acceptance as one closing story.

## Out of scope

- Cross-machine routing, a hosted bridge, or a new communications protocol.
- GitHub Copilot coding-agent or cloud wake.
- Polling as the primary transport; bounded periodic drain is recovery only.
