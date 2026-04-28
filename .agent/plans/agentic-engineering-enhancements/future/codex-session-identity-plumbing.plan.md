# Codex Session Identity Plumbing

**Status**: 📋 STRATEGIC / FUTURE  
**Domain**: Agentic Engineering Enhancements  
**Parent**:
[`register-identity-on-thread-join.md`](../../../rules/register-identity-on-thread-join.md);
[`agent-identity.md`](../../../../agent-tools/docs/agent-identity.md);
[`collaboration-state-write-safety.plan.md`](../current/collaboration-state-write-safety.plan.md)

Strategic follow-up. Execution decisions are finalised only if this is
promoted to `current/` or `active/`.

## Problem and Intent

The collaboration-state write-safety slice fixed deterministic Codex identity
for the safe shared-state write path: `CODEX_THREAD_ID` now derives
`agent_name` and `session_id_prefix` through
`pnpm agent-tools:collaboration-state -- identity preflight`.

That does not yet make Codex identity consistently available everywhere a
session needs it. Codex can still appear as `Codex` / `unknown` in thread
identity rows, legacy state, manual docs edits, title/status surfaces, and any
workflow that bypasses the collaboration-state helper. The remaining work is
to make deterministic Codex session identity the default across Codex entry,
thread registration, shared-state writes, and any verified Codex display
surface.

Intent: close the gap between "the helper can derive the name" and "Codex
sessions naturally operate under that name."

## Domain Boundaries and Non-Goals

In scope:

- Codex session identity derivation from `CODEX_THREAD_ID`.
- Thread identity row registration for Codex sessions.
- Start-right defaults and command guidance so Codex sessions use the derived
  identity before any non-trivial edit.
- Safe repair path for existing `Codex` / `unknown` rows and state entries,
  without rewriting historical evidence blindly.
- Agent-tools JSON output or wrapper support that emits the full PDR-027
  identity block plus seed source.
- Verified Codex title/statusline or hook integration if a real supported
  surface exists.

Out of scope:

- Renaming historical entries without evidence that they belong to a specific
  Codex thread id.
- Depending on undocumented or unstable Codex host behaviour.
- Treating title/statusline polish as correctness. Correctness is the
  deterministic identity used in state and thread records.
- Reopening the broader collaboration-state transaction or comms-event design.

## Dependencies and Sequencing Assumptions

- The write-safety plan must land first, because it provides the reliable
  identity-preflight command and shared-state mutation path.
- Use `CODEX_THREAD_ID` as the current portable Codex seed when available.
- If Codex later exposes a documented session-start or session-end hook, treat
  it as an integration option, not as a prerequisite for identity correctness.
- Coordinate with the existing agent-tools identity implementation rather than
  creating a second naming algorithm.

## Candidate Direction

1. Extend or wrap `agent-tools:agent-identity` so Codex entry workflows can
   request the full collaboration identity block:
   `agent_name`, `platform`, `model`, `session_id_prefix`, and `seed_source`.
2. Add Codex-specific start-right guidance that prefers this full identity
   preflight for thread registration, not only shared-state writes.
3. Add a small validator/report command that finds live `Codex` / `unknown`
   entries in thread records and collaboration state, groups them by evidence,
   and distinguishes safe repairs from historical rows that must remain
   unchanged.
4. If a verified Codex display surface exists, wire the derived identity into
   that surface as a convenience. Keep state identity authoritative.
5. Add tests that prove:
   - `CODEX_THREAD_ID` derives the expected identity block;
   - Codex entry workflows reject anonymous identity when the seed exists;
   - existing historical `Codex` / `unknown` rows are reported rather than
     silently rewritten;
   - title/statusline or hook integration is skipped cleanly when unsupported.

## Success Signals

- A fresh Codex session can register in a thread record without manually
  inventing an `agent_name`.
- New Codex state writes and thread identity rows use the same derived
  `agent_name` and `session_id_prefix`.
- Existing `Codex` / `unknown` rows are either safely repaired with evidence or
  left as historical records with an explicit no-repair reason.
- Start-right tells Codex agents one clear identity path, not separate paths
  for thread rows and collaboration-state writes.
- Any Codex title/statusline integration is documented as convenience only and
  has tests or verified smoke evidence.

## Risks and Unknowns

- Codex host display and hook surfaces may change. Mitigation: verify against
  primary docs during promotion and keep unsupported integrations optional.
- Historical `Codex` / `unknown` entries may be ambiguous. Mitigation: report
  and classify; do not guess.
- Multiple Codex sessions can share the same date and branch. Mitigation: make
  the first six `CODEX_THREAD_ID` characters the session identity prefix and
  require evidence before repair.
- Identity convenience could drift from the PDR-027 state identity. Mitigation:
  one derivation implementation, many consumers.

## Promotion Trigger

Promote to `current/` when any of the following happens:

1. another Codex session writes a new thread identity row or collaboration
   state entry as `Codex` / `unknown` despite `CODEX_THREAD_ID` being present;
2. the owner asks for Codex-wide identity parity rather than write-path-only
   identity safety;
3. a verified Codex session-start, title, statusline, or hook surface is
   available and worth wiring as a thin adapter;
4. the write-safety plan reaches closure and the remaining anonymous Codex
   identity debt is the next highest-friction collaboration issue.
