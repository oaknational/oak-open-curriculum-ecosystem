---
title: Routing legacy-fallback sunset
status: strategic
lane: future
collection: agent-tooling
created: 2026-05-28
author: Thermal Spiralling Airstream (claude / Opus 4.7 / 40e32e)
source_incident: comms-watch routing-legacy-fallback runaway (2026-05-28)
related:
  - .agent/practice-core/decision-records/PDR-076a-agent-identity-tuple-name-and-uuid.md
  - agent-tools/src/collaboration-state/active-agent-routing.ts
  - .agent/memory/active/napkin.md (2026-05-28 session reflection)
---

# Routing legacy-fallback sunset

Strategic brief. Execution decisions finalise only at promotion to
`current/`. This brief captures the problem, the root cause, and the
intended fix; it does not commit to executable cycles yet.

## Problem and intent

`agent-tools/src/collaboration-state/active-agent-routing.ts` carries a
`legacy` arm in `AgentRoutingKey` and an `emitLegacyFallback` path in
`routingKeyFor`. When a routed identity lacks the PDR-076a `id` (UUID),
routing falls back to `(agent_name, session_id_prefix)` and emits a
`[routing-legacy-fallback]` diagnostic to stderr.

This was built (PDR-076a) as a **bounded migration scaffold**: keep
routing working for un-migrated rows during the transition, and emit the
diagnostic as the audit signal that would prove when every row carries an
`id` so the legacy path could be **sunset** (the code comments name a
"Phase 3 sunset"). The intent was correct: a transition, not a permanent
fixture.

The breach is that **the sunset never fired**. The scaffold calcified
into a permanent fallback. Historical identity rows (prior-session
agents, and any live writer not yet emitting `id`) still lift through the
legacy arm on every routing comparison, emitting the diagnostic forever.
Under an all-channels watcher poll loop this surfaced on 2026-05-28 as a
runaway: the diagnostic fired for every historical identity on every
poll cycle and the harness auto-killed the watcher.

The intent of this plan is to **complete the PDR-076a migration and
execute the sunset**, so routing is strict and single-path: every routed
identity carries an `id`, and an id-less identity is a fail-fast error at
the boundary — not a silent fallback.

## Root-cause framing (why this is a principles breach, not just a bug)

The runaway noise is the **symptom**. The root cause is that a
legacy/fallback path *exists* in steady state. Per `principles.md`:

- §Strict and Complete — "don't invent optionality, don't add fallback
  options."
- §Code Design — "NEVER create compatibility layers"; "No shims, no
  hacks, no workarounds — Replace the old code"; "Fail FAST … never
  silently."
- `.agent/rules/replace-dont-bridge.md` — the legacy arm bridges old
  id-less rows to the new routing contract instead of migrating them.
- §Architectural Excellence — the substrate evolved by accreting fences
  (this scaffold is one) while the generator (strict id-keyed routing)
  was never finished. "Fences accumulate while the generator stays
  unchanged."

A migration scaffold is legitimate only as a bounded, actively-driven
transition with a near sunset. This one lost its sunset and became the
breach. Fixing the loop, filtering the diagnostic, or adding a
suppress-flag would each *preserve* the breach — they bridge instead of
replace.

## End goal

Strict, total, single-path identity routing in
`active-agent-routing.ts`: `AgentRoutingKey` is id-keyed only; there is
no `legacy` arm, no `emitLegacyFallback`, no `legacyFallbackWriter`/
`setLegacyFallbackWriter`; an identity without an `id` fails fast at the
boundary. No `[routing-legacy-fallback]` diagnostic exists to flood.

## Mechanism

Routing noise and routing ambiguity both stem from id-less identities
reaching `routingKeyFor`. Remove the source (no live writer produces an
id-less identity; historical/un-migratable identities are out of routing
scope), then the legacy arm is dead code and can be deleted, making
routing total over id-bearing identities. Strictness at the boundary
(fail fast on an id-less identity) replaces the silent fallback.

## Means (scope to be finalised at promotion)

1. **Audit the id-less surface.** Enumerate every live identity-producing
   surface (active-claims.json, comms-seen files, identity registry, any
   collaboration state) and every writer (Claude/Cursor/Codex session
   hooks, external tools) and classify each as: already emits `id`,
   fixable to emit `id`, or un-migratable historical data.
2. **Migrate live writers.** Ensure every live identity-producing path
   emits the PDR-076a `id` (UuidV5). Fix any writer that does not.
3. **Dispose of un-migratable historical data.** Immutable historical
   comms events with id-less identities are not rewritten (they are
   immutable audit records). Instead, scope routing to LIVE identities —
   routing/watcher key construction must not lift the historical backlog
   into routing keys. Confirm routing genuinely needs only live
   identities (the watcher's purpose is current coordination).
4. **Sunset the code.** Delete the `legacy` arm of `AgentRoutingKey`, the
   fallback branch in `routingKeyFor`, `emitLegacyFallback`,
   `legacyFallbackWriter`, `setLegacyFallbackWriter`, and collapse
   `sameRoutingKey`/`formatRoutingKey` to the id-keyed shape. An id-less
   identity becomes a fail-fast boundary error.
5. **Update doctrine.** Mark PDR-076a's sunset executed; update any rule
   or doc that references the `(name, prefix)` legacy fallback as a live
   path.

## Domain boundaries and non-goals

In scope: `active-agent-routing.ts` and the identity-writing surfaces
that feed it; PDR-076a sunset.

Non-goals (explicit — these are the symptom-patches this plan refuses):

- Do NOT silence, filter, downgrade, or add a verbosity flag for the
  `[routing-legacy-fallback]` diagnostic. Removing the path removes the
  diagnostic.
- Do NOT keep the legacy arm "just in case" or behind a config gate.
- Do NOT mutate or backfill historical comms events to fake `id`s; they
  are immutable — exclude them from routing scope instead.
- Do NOT reground the whole multi-agent collaboration substrate here.
  This plan sunsets one calcified scaffold. The wider observation — that
  the substrate evolved by bridging/accretion and breaches the principles
  it exists to uphold — is recorded in the 2026-05-28 napkin reflection
  and is a separate, larger strategic question for the owner.

## Dependencies and sequencing

- **Blocking**: every live identity writer must emit `id` before the
  legacy arm is deleted (else routing breaks for that platform). Means
  step 2 blocks step 4.
- **Blocking**: confirmation that routing needs only live identities
  (means step 3) before deletion.
- **Beneficial**: PDR-076a documenting explicit sunset criteria. Minimum
  shippable shape without it: derive sunset criteria here ("no live
  writer emits an id-less identity; routing scoped to live identities")
  and record them in the promoted plan + a PDR-076a amendment.

## Strategic acceptance criteria and success signals

- `AgentRoutingKey` has no `legacy` arm; `grep -rn "routing-legacy-fallback\|legacyFallback\|legacy-keyed" agent-tools/src` returns nothing.
- `routingKeyFor` is total over id-bearing identities; an id-less
  identity fails fast (explicit error), proven by a unit test.
- An all-channels watcher runs across the full comms history without
  emitting any legacy-fallback diagnostic (the 2026-05-28 runaway cannot
  recur).
- PDR-076a marked sunset-complete; no rule/doc references the legacy
  fallback as a live routing path.
- agent-tools gates green (type-check, lint, test, build, knip).

## Risks and unknowns (open scoping questions for promotion)

- **How many live identity rows lack `id`, and which writers produce
  them?** Unknown until the audit (means step 1). Cursor/Codex hooks are
  prime suspects ("rows written by external tools that have not yet
  migrated", per the code comment).
- **Does PDR-076a document explicit Phase 3 sunset criteria?** A grep for
  "Phase 3"/"sunset" in PDR-076a found nothing — the sunset was named in
  code comments but may never have been specified in the PDR. The
  promotion must either find or author the criteria.
- **Does routing ever legitimately need a historical (id-less)
  identity?** If yes, excluding the backlog changes behaviour and needs a
  different cure. Expected answer: no — the watcher/routing serves current
  coordination, not historical replay.

## Foundation alignment

- `principles.md` §Strict and Complete, §Code Design (no compatibility
  layers / no shims / fail fast), §Architectural Excellence.
- `.agent/rules/replace-dont-bridge.md`, `.agent/rules/never-ignore-signals` (the diagnostic was a signal of an unfinished migration, not noise to mute).
- `schema-first-execution.md` / `testing-strategy.md`: the sunset's
  fail-fast boundary and totality are proven by unit tests authored
  test-first at promotion.

## Promotion trigger into `current/`

Promote when any of: (a) the owner prioritises the collaboration-substrate
routing work; (b) the legacy-fallback noise again blocks a team session
(it already did once, 2026-05-28); (c) the wider substrate-reground is
scheduled and picks this up as its first concrete thread.

## Plan-body first-principles check

The shape clause fires at promotion: before writing the sunset cycles,
re-verify that deletion (not suppression) is the move and that every live
writer emits `id` (else the "delete the legacy arm" step would break
routing — a landing-path check). The vendor-literal clause does not apply
(no vendor surface).
