---
id: copilot-cli-identity-and-practice-join
node_type: delivery
name: Copilot CLI identity and deliberate Practice join
overview: "Give local Copilot CLI sessions honest native identity and a useful bootstrap while preserving oak-start-right-team as the deliberate team boundary."
status: ratified
ratified_by: "Jim Cresswell"
ratified_date: 2026-07-24
ratified_where: "PR #529 owner ratification record: https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/529#issuecomment-5079688100"
serves: agent-platform-citizenship
impact_areas:
  - practice-and-estate
tickets:
  - MCP-154
depends_on: []
last_updated: 2026-07-25
---

# Copilot CLI identity and deliberate Practice join

## Dated notes

- **2026-07-25** — Corrected the quick-start/team-start coordination boundary
  and added the explicit cloud disposition for a tracked `sessionStart`
  activation. The ratified identity-and-join outcome is unchanged.

## Goal

A local Copilot CLI process starts with repository context and truthful Copilot
identity, follows the ordinary quick-start collaboration discipline when it
works, and deliberately enters continuous team participation by invoking
`oak-start-right-team`.

## Mechanism

Extend canonical identity and persistence with Copilot as an honest platform,
seed model-visible identity from the documented native session-start event,
and project it through a thin local launcher/bootstrap. Keep identity bootstrap
separate from team enrolment. Ordinary `oak-start-right-quick` still consults
collaboration state and opens bounded work claims/comms before edits, as it
does for every platform; only the team skill starts the continuous heartbeat,
all-channel watcher, and team lifecycle.

**Cloud disposition of the session-start activation.** Repository
`.github/hooks` runs in the Copilot cloud agent as well as the CLI (official
source, verified on this branch), and the local coordination home does not exist
in a cloud job. This node therefore binds two requirements on whatever surface
carries the `sessionStart` activation: the activation MUST NOT assume local
coordination state exists, and if the chosen surface is one the cloud agent also
loads, the activation MUST carry an explicit cloud no-op guard that detects the
cloud execution context and exits cleanly without assigning local-Copilot
identity or touching coordination state. "GitHub Copilot coding-agent or cloud
identity" being out of scope (see Out of scope) states an intention; the guard is
what makes the artefact safe when it is loaded somewhere the intention does not
reach.

This repository plan owns the mechanism and acceptance contract. MCP-154 is
the supplementary Linear projection for execution state, sensitive details,
and evidence that cannot be versioned safely.

## Acceptance criteria (each with a proof)

- **Copilot identity uses Copilot's own documented session signal and remains
  stable across the local session.** Proof: `repo-safe` — identity schema,
  derivation, persistence, and provenance tests.
- **Native startup makes repository and identity context model-visible through
  Copilot CLI's documented output shape.** Proof: `repo-safe` — launcher and
  session-start integration tests with literal fixtures. Before tracked
  activation, a supported-version floor and live capability probe must prove
  that the installed CLI fires `sessionStart` and accepts the required
  `additionalContext` output.
- **The `sessionStart` activation is inert in a cloud-agent execution
  context.** Proof: `repo-safe` — a negative cloud-path fixture exercising the
  activation with the cloud context markers set and no local coordination home
  present, asserting a clean no-op (no identity assignment, no coordination
  write, no non-zero exit, no error output that would fail a cloud job).
  Required whenever the activation lives on a surface the cloud agent also
  loads; where a CLI-only launcher or user-local surface is chosen instead, the
  plan records which official source establishes that and the fixture is not
  owed.
- **Native startup itself creates no claim, heartbeat, watcher, or lifecycle
  registration; subsequent quick-start work uses the standard bounded
  claim/comms discipline without silently becoming a continuously joined
  team seat.** Proof: `repo-safe` — negative bootstrap test plus quick-versus-
  team lifecycle integration tests over isolated coordination homes.
- **`oak-start-right-team` deliberately joins the same coordination home and
  makes the session addressable to existing peers.** Proof: `repo-safe` —
  lifecycle integration test using isolated local state.
- **A real local Copilot CLI session demonstrates stable identity before and
  after deliberate join.** Proof: `owner-held` — acceptance evidence recorded
  by the owner, who runs or observes the local Copilot CLI seat, on MCP-154 and
  the implementation pull request.

## Todos

- **Identity-and-join vertical PR (round budget: at most two review rounds).**
  Extend canonical types, derivation, persistence, and validators together
  with the native session-start projection and joined/non-joined proof. No
  dormant Copilot identity branch lands ahead of its observable host vertical.

## Out of scope

- Automatic team enrolment on every Copilot CLI start.
- GitHub Copilot coding-agent or cloud identity.
- Remote coordination homes or cross-machine transport.
