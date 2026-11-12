---
id: copilot-cli-local-comms-and-lifecycle
node_type: delivery
name: Copilot CLI local communications and lifecycle
overview: "Connect a deliberately joined local Copilot CLI session to the existing file-backed comms, wake, watcher recovery, handoff, and retirement lifecycle."
status: ratified
ratified_by: "Jim Cresswell"
ratified_date: 2026-07-24
ratified_where: "PR #529 owner ratification record: https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/529#issuecomment-5079688100"
serves: agent-platform-citizenship
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
last_updated: 2026-10-02
---

# Copilot CLI local communications and lifecycle

## Dated notes

- **2026-07-25** — Added the cloud no-op requirement for tracked lifecycle
  activation and corrected wake/recovery evidence. The ratified local
  communications outcome remains unchanged.
- **2026-09-21** — The owner's word, relayed by a seat (Zephyr guards
  Leeward): "Frost is having to build a comms monitor solution as they go,
  please make sure their approach is recorded, so we can encode it as official
  GitHub Copilot agent support in the Practice". The field evidence is the
  report of that date: a scheduled prompt starts reasoning (observed); a
  tracked command's completion delivers a notification (observed), and
  whether that notification starts reasoning from idle is a separate claim,
  unproven for the waiter; a stream line wakes nothing.

## Goal

A deliberately joined local Copilot CLI session can hear, answer, monitor, hand
off, and retire alongside local Claude and Codex sessions on the existing
coordination substrate, without adding a remote transport.

## Mechanism

Reuse the canonical comms CLI and shared local coordination home. Convert the
one-shot all-channel watcher completion into Copilot CLI's native local
notification path, re-arm after each wake, and retain turn-boundary drain plus
seen-file gap sweep as recovery. The standard claim, heartbeat, handoff, and
retirement lifecycle remains authoritative.

**Cloud disposition of the notification activation.** Repository
`.github/hooks` runs in the Copilot cloud agent as well as the CLI (official
source, verified on this branch), and the local coordination home does not
exist in a cloud job. This is the same dual-execution property that ruled
`.github/hooks/*.json` out as a policy-activation home for MCP-150. This node
therefore binds two requirements on whatever surface carries the notification
activation: the activation MUST NOT assume a coordination home exists, and if
the chosen surface is one the cloud agent also loads, the activation MUST
carry an explicit cloud no-op guard that detects the cloud execution context
and exits cleanly without touching coordination state. "Cloud wake is out of
scope" (see Out of scope) states an intention; the guard is what makes the
artefact safe when it is loaded somewhere the intention does not reach.

The minimum shippable shape without the beneficial projections node uses the
already discoverable team skill and comms CLI after identity/join has landed.
Native projections improve discovery but supply no required communications
runtime primitive.

This repository plan owns the wake, burst, cursor, and cleanup contracts.
MCP-156 is the supplementary Linear projection for execution state, sensitive
details, and evidence that cannot be versioned safely.

## Acceptance criteria (each with a proof)

- **A joined Copilot CLI session sends and receives directed and broadcast
  events on the existing local comms substrate.** Proof: `repo-safe` — isolated
  multi-session comms integration tests.
- **A directed event wakes the intended idle local session and not unrelated
  sessions, then the watcher re-arms.** Proof: `repo-safe` — notification,
  self-exclusion, and re-arm integration tests. Before tracked activation, a
  supported-version floor and live capability probe must prove the installed
  CLI's `notification` event and the selected completion notification shape.
- **The notification activation is inert in a cloud-agent execution context.**
  Proof: `repo-safe` — a fixture exercising the activation with no coordination
  home present and with the cloud context markers set, asserting a clean no-op
  (no coordination write, no non-zero exit, no error output that would fail a
  cloud job). Required whenever the activation lives on a surface the cloud
  agent also loads; where the chosen surface is CLI-only, the plan records
  which official source establishes that and the fixture is not owed.
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
  local notification to one-shot watch, re-arm, turn-boundary drain, and gap
  recovery with failure-injection tests.
- **Lifecycle-proof PR (round budget: at most two review rounds).** Prove
  claims, heartbeat, peer liveness, handoff, retirement, and live CLI
  acceptance as one closing story.

## Out of scope

- Cross-machine routing, a hosted bridge, or a new communications protocol.
- GitHub Copilot coding-agent or cloud wake.
- Polling as the primary transport; bounded periodic drain is recovery only.
