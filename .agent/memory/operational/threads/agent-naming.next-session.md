# Next-Session Record — `agent-naming`

Thread identity: **`agent-naming`** — the PDR-027 agent display-name derivation
(`agent-tools/src/core/agent-identity/`): its versioned schema registry, the
session-hook identity surfaces, and the wordlist eras. Distinct from
`agentic-engineering-enhancements` (Practice curation) and the comms-corpus
research lane, which only *consume* identity. Governing decision record:
[PDR-027](../../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md);
substrate ADR:
[ADR-198](../../../../docs/architecture/architectural-decisions/198-naming-schema-versioning-digest-pinned-registry.md).

## Current Continuation

- **Branch**: none yet for the next arc. The v2 arc's branch
  `feat/better_agent_naming` is **merged and closed** (PR #189, `289b3e036`).
  The next executor opens a fresh branch off `main`.
- **Invocation pointer**: continue `agent-naming` from this record.
- **Controlling plan**:
  [`agent-naming-schema-v3.plan.md`](../../../plans/agent-tooling/current/agent-naming-schema-v3.plan.md)
  (`current/`, DECISION-COMPLETE / QUEUED). One plan, three phases:
  era-pinning cure (P1) → C wordlist curation → v3 registry entry + activation.
- **Next safe step**: execute **Phase 1 (WS1, era-pinning cure)** — the P1
  correctness fix. It ships independently of v3 and is the owner-ordered
  prerequisite for v3 activation (Director ruling `10cb3a10` condition 3). Start
  at WS1 cycle 1.1 (CLI core). Re-grep the `OAK_AGENT_IDENTITY_OVERRIDE`
  consumer set first (plan-body first-principles check, shape clause).
- **Completed prerequisites**: v2 versioned-schema registry, v1/v2 eras,
  `naming_schema_version` provenance field, ADR-198 — all merged (PR #189). v3
  **shape decided** (C — noun + agentive, owner 2026-06-12). P1 **diagnosis
  accepted** (comms `75696ec5`).
- **Recent relevant commits**: `289b3e036` (PR #189 — v2 + registry merged);
  `9a74eefd1` (PR #194 — v2 plan archived).
- **Team expectation**: unknown until live grounding. Single-owner lane by
  default; coordinate only with the statusline lane if both touch
  `statusline-identity` concurrently.
- **Acceptance bar**: per the plan's Proof Contract. Phase 1 is complete at
  AC-1…AC-5 (single-valued identity + true provenance, live-proven); the full
  plan at AC-1…AC-9.

## Standing decisions this thread carries forward

1. **Era-pinning, not name-caching.** Hooks pin the schema *era*
   (`OAK_AGENT_NAMING_SCHEMA_ID`); the name is re-derived from seed + era at
   every consumer. The rendered name is never cached, because seed + era
   reproduce it. `OAK_AGENT_IDENTITY_OVERRIDE` means *only* operator-assigned
   names.
2. **The v3 shape is fixed: C — noun + agentive**, two title-cased columns,
   flat single group, 540-noun first-word union reused from v2 + curated ~120
   agentives. The other sample sheets (A/B/D) are decided against.
3. **Wordlist material freezes at registration** (ADR-198 digest pin). Any word
   change is a *new era*, never an edit. Owner taste review precedes
   registration (the BLOCKING WS2 checkpoint), exactly as v2's did.
4. **The UUID v5 id and its namespace constant are untouched** (PDR-076a). Only
   the display-name projection and its provenance change.
5. **The era-pin is the v3-activation safety prerequisite, reconciled with the
   substrate direction.** `OAK_AGENT_NAMING_SCHEMA_ID` adds a second identity
   env var; it is justified at t=0 (the statusline derives before any session
   record exists) and aligns with how the spawn flow sets
   `PRACTICE_AGENT_SESSION_ID`. Known reconciliation-debt against the 2026-06-28
   [`knowledge-distribution-substrate`](../../../plans/agent-tooling/future/knowledge-distribution-substrate.plan.md)
   direction: the substrate-native cure stamps identity once in an append-only
   session-identity event and *renders* the name (the substrate's `render`
   verb) rather than re-deriving from a pinned env era — v3's derive-don't-cache
   is a local instance of that verb, and agent-identity is the identity row in
   the substrate's "Flows that re-home" table. Ship the env cure now (the
   substrate is not build-authorised); the plan's §"Connection to the
   Knowledge-Distribution Substrate" carries the full reasoning.

## Session shape and grounding order for this thread

1. [`repo-continuity.md`](../repo-continuity.md) §Active Threads, §Current
   State (AGENT NAMING entry), §Next Safe Steps.
2. This record.
3. The controlling plan (above) — authoritative for scope, cycles, acceptance.
4. The live code named in the plan's WS1 (the source of truth over any sketch):
   `schema-registry.ts`, `derive.ts`, the two hook planners,
   `agent-identity-cli.ts`, `collaboration-state/identity.ts`,
   `statusline-identity.ts`.
5. Foundation directives: `principles.md`, `testing-strategy.md`,
   `schema-first-execution.md`, `metacognition.md`, `orientation.md`.

## Participating Agent Identities

Additive per [PDR-027](../../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md);
joining adds a row, never replaces. Earlier seats touched the work before this
thread record existed (their trail is in the handoff record and PR #189
history); captured here so the lineage is discoverable.

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| `Squall hunts Troposphere` | `claude` | `Opus 4.8` | `6bbbd2` | thread-open + v3 plan author (decision-complete) | 2026-06-13 | 2026-06-13 |
| `Moss weaves Blossom` | `claude` | `Fable 5` | `10438c` | v2 landing + close (PR #189); P1 diagnosis | 2026-06-12 | 2026-06-12 |
| `Swift Gliding Zephyr` | `claude` | `Fable 5` | `aba87a` | v2 registry/derivation build; mid-cycle handoff author | 2026-06-11 | 2026-06-11 |
| `Tuna stirs Fathom` | `claude` | `Opus 4.8 (1M)` | `9767ba` | plan deep-dive + substrate-connection cross-link (no source touched) | 2026-06-30 | 2026-06-30 |
