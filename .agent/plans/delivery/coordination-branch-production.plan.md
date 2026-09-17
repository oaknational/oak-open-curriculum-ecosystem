---
id: coordination-branch-production
node_type: delivery
name: "Coordination branch names become a mechanical production with join-before-mint"
overview: >-
  One front-door command derives, adopts, or mints the day's coordination
  branch; a validator refuses hand-authored names outside the grammar.
status: ratified
ratified_by: "Jim Cresswell"
ratified_date: 2026-08-07
ratified_where: >-
  In-session owner word "Ratified, land the stamps", 2026-08-07
  (Director seat, Panther rides Midnight 7efb00); the underlying design
  was agreed owner + lead AI 2026-08-06 (recorded on MCP-521 at the
  time, homed here).
serves: coordination-substrate
impact_areas:
  - practice-and-estate
tickets:
  - MCP-521
depends_on: []
owner_gates: []
last_updated: 2026-08-07
---

# Coordination branch names become a mechanical production with join-before-mint

This plan is the repository knowledge home for the design agreed by the
owner and the lead AI on 2026-08-06 (previously recorded only on the
ticket, which now carries schedule state and a pointer here).

## Goal

Exactly one coordination branch exists per day per fleet, every seat on
every machine converges on it without coordination memory, and a
malformed or twin coordination branch cannot be created silently.

**The incident this cures** (2026-08-06 morning): two branches carried
the name `coordination/estate-2026-08-06` — the remote cut, and a second
local cut from main on another machine with no upstream tracking. A
dedicated consolidation ran on the local twin, processed a partial
corpus, and recorded "solo seat, fleet dark" while four seats' napkin
sections sat unseen on the remote. The naming scheme assumed a single
checkout; the fleet runs on two machines.

## Mechanism

1. **Name grammar**: `coordination/<YYYY-MM-DD>-<6 lowercase hex>`
   (e.g. `coordination/2026-08-06-0b2d4f`). The `estate` word is
   dropped — it answered no question the date does not.
2. **Discriminator**: first 6 hex of `hash(machine-id + date)` —
   deterministic, so any session on a machine can re-derive "today's
   name for this machine" statelessly and idempotently. Not author
   email (the actual incident was one author on two machines —
   email-derived hashes collide by construction). Not truncated UUIDv7
   (v7's leading bits are the timestamp — truncation keeps what the
   branch name already carries and discards the entropy in the tail).
3. **Join-before-mint** — the twin-killer, because the incident's root
   cause was minting without fetching: the agent-tools command fetches
   first; if a coordination branch for today exists on the remote it
   **adopts it with upstream tracking** (the common case — one
   day-branch, many seats); it mints a new name only when none exists.
   The discriminator only ever settles the rare simultaneous-mint race.
4. **Enforcement pair** (structure over vigilance): the agent-tools
   command is the only door — a hook/validator rejects any hand-authored
   `coordination/*` name that does not parse to the production grammar.
   Production and verification land together, in one changeset.

This is the third instance of the recurring-coordination-act →
front-door-command generator (comms CLI, handoff CLI, now branch
minting) — the estate's own threshold for building it.

**Interim discipline until built**: `git rev-list --left-right --count
<remote>...HEAD` before believing any solo-seat claim. Evidence the
enforcement pair matters: on 2026-08-07 a branch following the new
grammar (`coordination/2026-08-07-91db0c`) was minted by hand — the
grammar is live as convention before the mechanism exists, which is
exactly the window where a well-formed-looking twin can still appear.

## Acceptance criteria (each with a proof)

- **Derivation is deterministic and stateless** — `repo-safe`: unit
  tests pin same-machine same-day idempotence and cross-machine
  divergence of the discriminator.
- **Join beats mint** — `repo-safe`: integration test against a fixture
  remote proves an existing today-branch is adopted with upstream
  tracking and no new branch is created; a bare remote proves the mint
  path.
- **Hand-authored non-grammar names are refused** — `repo-safe`: the
  validator test names the rejection for a non-parsing
  `coordination/*` ref; the command and validator land in the same
  changeset.
- **The fleet converges in practice** — `owner-held`: the first
  multi-seat day after landing produces exactly one coordination branch
  across machines; the owner confirms on the branch list, recorded on
  the ticket.

## Todos

- [ ] Slice 1 (one PR, code+tests, ≤2 review rounds): the agent-tools
      command — derive, fetch, adopt-or-mint, upstream tracking — with
      the grammar validator and its refusal tests in the same changeset.
- [ ] Slice 2 (one PR, docs): re-true `coordination-branch-24h-lifetime`
      and the coordination-fold skill to name the command as the only
      door; retire the interim check text where it lives.

## Out of scope

- Retiring the 24h-lifetime rule or changing fold cadence — this plan
  changes how the branch is named and joined, not how long it lives.
- Any change to non-coordination branch naming (lane branches, PR
  branches) — different lifecycle, different owners.
- Cross-repository branch conventions — this estate only.
