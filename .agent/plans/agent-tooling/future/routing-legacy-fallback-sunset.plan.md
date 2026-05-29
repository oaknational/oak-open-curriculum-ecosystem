---
title: Routing legacy-fallback sunset
status: complete
landed: 2026-05-29 (commit d9225d5b)
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

Non-goals (explicit — these are the symptom-patches this plan refuses
because they are known-wrong, not because they are unknown):

- Do NOT silence, filter, downgrade, or add a verbosity flag for the
  `[routing-legacy-fallback]` diagnostic. Removing the path removes the
  diagnostic.
- Do NOT keep the legacy arm "just in case" or behind a config gate.
- Do NOT mutate or backfill historical comms events to fake `id`s; they
  are immutable — exclude them from routing scope instead.

## Open problems we don't yet know how to handle

This plan sunsets one calcified scaffold. It does NOT solve the wider
problems the 2026-05-28 incident exposed — and it does NOT exclude them
either. They are real and unsolved. They are surfaced here, named as
unknowns rather than shelved as non-goals, for the plan-collection
consolidation and refinement pass (the cross-link map below is the
starting point for that pass).

- **The collaboration substrate has grown by accretion.** Each incident
  spawned a new rule / PDR / protocol layer (gate-runner election,
  cycle-overlap coordination, coordinator-handoff-two-moments,
  heartbeat-stall diagnostic, this legacy-fallback, …) — fences
  accumulating while the generator stayed unchanged, the exact
  failure-mode shape `principles.md` §Architectural Excellence names. We
  do not yet know the simplified first-principles design that would
  replace the accreted layers.
- **The watcher + heartbeat ceremony is heavier than the operating
  context.** The all-channels watcher and typed-state heartbeat are
  prescribed as "non-negotiable preconditions", yet the owner routes
  around them (minimal-ceremony preference) and the watcher itself
  runaway-failed this session. This is evidence the substrate is built
  for large unattended agent teams rather than the actual
  1–3-agent, owner-present context. We do not yet know the right minimal
  coordination design.
- **The substrate evolved by bridging, not replacing.** This legacy
  fallback is one instance; "bridge a migration with a fallback, then
  never sunset it" may be a recurring pattern. We do not yet have a
  settled discipline for when to replace vs migrate, or for forcing a
  scaffold's sunset to completion, beyond the principle statements.

Whether the wider reground is one new plan or a refactor of the existing
cluster below is itself one of the unknowns. These three open problems now
have a home:
[`collaboration-substrate-coordination-rightsizing.plan.md`](collaboration-substrate-coordination-rightsizing.plan.md),
a first-principles exploration brief whose M4 resolves the "one new plan vs
cluster refactor" question via a concrete supersession list.

## Related plans (cross-links for the consolidation pass)

This plan has NOT been reconciled against the plans below for overlap;
that reconciliation is part of the consolidation and refinement pass.
Scopes are as-named — verify before promoting any.

Routing and identity (upstream of this sunset — the `id` migration it
depends on):

- [codex-session-identity-plumbing.plan.md](codex-session-identity-plumbing.plan.md)
- [collaboration-identity-doctrine-enforcement-remediation.plan.md](../current/collaboration-identity-doctrine-enforcement-remediation.plan.md)
- [team-handoff-routing-and-action-log-exploration.plan.md](../../agentic-engineering-enhancements/future/team-handoff-routing-and-action-log-exploration.plan.md)

Watcher and comms reliability (the surface where the runaway manifested):

- [comms-watch-storage-redesign.plan.md](../current/comms-watch-storage-redesign.plan.md)
- [comms-watch-liveness-floor.plan.md](comms-watch-liveness-floor.plan.md)
- [coordination-watcher-canonicalisation.plan.md](coordination-watcher-canonicalisation.plan.md)
- [collaboration-state-domain-model-and-comms-reliability.plan.md](collaboration-state-domain-model-and-comms-reliability.plan.md)
- [agent-coordination-cli-ergonomics-and-request-correlation.plan.md](agent-coordination-cli-ergonomics-and-request-correlation.plan.md)
- [pdr-080-comms-log-care-phenotype.plan.md](../current/pdr-080-comms-log-care-phenotype.plan.md)

Wider substrate cost and shape (the open problems above):

- [cost-of-collaboration.plan.md](../current/cost-of-collaboration.plan.md)
- [multi-agent-collaboration-protocol.plan.md](../current/multi-agent-collaboration-protocol.plan.md)
- [n-agent-collaboration-experiments.plan.md](../current/n-agent-collaboration-experiments.plan.md)
- [collaboration-state-surface-restructure.plan.md](../../agentic-engineering-enhancements/current/collaboration-state-surface-restructure.plan.md)

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

## Session 1 (2026-05-29, Leafy Regrowing Petal) — partial landing + continuation

Owner directed mid-session: *"get rid of the legacy system that is causing
bugs. Tighten it up… make sure the legacy system is utterly removed."* The
audit (means steps 1–3) is **complete and confirmed**: every live writer emits
`id` (the write schema `collaborationAgentIdWriteSchema` requires it, and
`deriveCollaborationIdentity`/`deriveOverrideCollaborationIdentity` always set
it); closed-claims archive has **0 id-less rows**; the **2,520 of 2,784**
historical comms events that are id-less are immutable and out of routing scope.
So the migration step is a no-op and the deletion is safe.

### Done (committed-ready, green)

- **`agent-tools/src/collaboration-state/active-agent-routing.ts`** — legacy
  **utterly removed**. `AgentRoutingKey` collapsed to a single `{agent_name,
  id}` shape (no discriminated union, no `kind`). Deleted: the `legacy` arm,
  `LegacyFallbackWriter`, `defaultLegacyFallbackWriter`, the module-level
  `legacyFallbackWriter`, `setLegacyFallbackWriter`, `emitLegacyFallback`,
  `sameRoutingKey`. `routingKeyFor` now **fails fast** on an id-less identity;
  `sameAgentRoutingKey` short-circuits to `false` if either side lacks `id`
  (so the historical backlog never reaches `routingKeyFor` — the runaway cure).
- **3 test files migrated green**:
  `tests/collaboration-state/active-agent-routing.unit.test.ts` (full rewrite to
  the strict state; the global-state `setLegacyFallbackWriter` afterEach dance
  is gone), `active-agents.unit.test.ts` (id-keyed fixtures + collision/stale
  semantics), `tui-cli.integration.test.ts` (id-bearing fixture, id-keyed
  assertion).
- **`.agent/rules/use-agent-comms-log.md`** — hardcoded coordinator name
  ("Wooded Spreading Thicket") stripped; coordinator now discovered from the
  live stream, introduction conditional on an active coordinator role.

### RED — BLOCKING PRIORITY for the next session (10 failing tests) — ✅ RESOLVED 2026-05-29 (commit d9225d5b)

> **Resolved.** All ten tests are green, plus a previously-unlisted e2e
> failure (`collaboration-tui.e2e.test.ts`). Full `pnpm check` passes. See
> §Session 2 below for the landing record. The text below is retained as the
> historical RED state Session 2 cleared.

**`pnpm --filter @oaknational/agent-tools test` → 10 failed | 758 passed (3
files).** The full-tree pre-commit hook (`turbo run type-check lint test`) will
block every commit until these are green. The next session's first move is to
clear these — they are the only thing standing between the current tree and a
clean sunset landing. Exact failing tests:

```text
comms-relevant-events-collision.unit.test.ts
  > classifyNarrative — session_id_prefix collision disambiguation
    > routes a directed narrative to the session_id_prefix recipient, not the agent_name
    > routes a group narrative by session_id_prefix membership
comms-relevant-events.unit.test.ts
  > classifyEventForAgent — view classification per the all-channels-matter principle
    > classifies a narrative whose addressed_to names the agent as a directed view
    > classifies a narrative whose audience includes the agent as a group view
    > returns undefined for events authored by the agent (self-exclusion is non-negotiable)
  > drainRelevantEvents — full event stream surfacing with self-exclusion only
    > emits one entry per relevant event covering broadcast, group, directed-narrative, directed-kind, and lifecycle
tui-snapshot.unit.test.ts > buildCollaborationTuiSnapshot
    > keeps closed-only inactive agents visible in the operator surface
    > pluralises needs-attention summaries for human-readable text output
    > projects collaboration state into stable panes for the TUI
    > summarises live operator-value signals without reading raw state
```

All ten fail for one reason: id-less object-literal fixtures now hit either the
`routingKeyFor` fail-fast (via `reportGroup`) or the `sameAgentRoutingKey`
id-less short-circuit. They assert the deleted legacy behaviour. The mechanical
pattern to fix them is uniform: replace id-less object-literal
fixtures with `deriveOverrideCollaborationIdentity({agent_name, platform, model,
session_id_prefix})` (id seeds from `name|prefix`, so distinct pairs → distinct
ids), and update assertions — `formatRoutingKey` renders `name / id:<uuid>` (not
`name / prefix`); `formatAgent` appends a space-separated `id:<uuid>` suffix.

1. **`comms-relevant-events.unit.test.ts`** — unify the `self`/`peer`/`stranger`
   fixtures to id-bearing (via `deriveOverrideCollaborationIdentity`) and delete
   the now-redundant `selfWrite`/`peerWrite`/`strangerWrite` mirrors (replace
   their usages with `self`/`peer`/`stranger`). The loose-vs-write split existed
   only to test the deleted discriminated-union cross-kind path. ~4 failing
   tests (group, directed-narrative, self-exclusion, drain).
2. **`comms-relevant-events-collision.unit.test.ts`** — **delete** the first
   describe block ("classifyNarrative — session_id_prefix collision
   disambiguation") and the now-unused `aliceSessionOne`/`aliceSessionTwo`
   fixtures: it tested prefix-disambiguation, which the sunset removes
   (disambiguation is by `id`). The second block ("PDR-076a §Falsifiability —
   same name + same prefix + different id") is the correct id-keyed coverage and
   already passes; the migration block is unrelated and passes. Update the file
   header comment (drop the "disambiguate by session_id_prefix" premise).
3. **`tui-snapshot.unit.test.ts`** — make all identity fixtures id-bearing.
   Tests 3 & 4 (`operator_value` counts/summaries) need only that. Tests 1 & 2
   additionally need the id-keyed assertion strings: `routing_key:
   \`<name> / id:${fixture.id}\`` (was `<name> / <prefix>`) and the directed
   `from`/`to` formatAgent strings gain ` / id:${fixture.id}`.

### Remaining to "utterly remove" (doctrine)

- **PDR-076a** — add a sunset-executed note (Phase 3 done 2026-05-29); the PDR
  never documented explicit sunset criteria, so record them.
- **`.agent/rules/register-identity-on-thread-join.md`** §"Identity Routing Uses
  (name, prefix) As A Pair" — reconcile to PDR-076a `(name, id)`, keeping the
  prefix only as the legacy-fallback *coordinate name*, not a live routing path.
- **Verification gate**: `grep -rn "routing-legacy-fallback\|legacyFallback\|legacy-keyed\|setLegacyFallbackWriter\|kind: 'legacy'" agent-tools/src agent-tools/tests`
  must return nothing; then full gates (`pnpm type-check lint test build knip`)
  green. The strategic acceptance criteria at the top of this plan are the
  done-definition.

## Session 2 (2026-05-29, Twilit Orbiting Satellite) — sunset executed and landed

The sunset is **complete and committed** (`d9225d5b`). All strategic acceptance
criteria are met.

### What landed

- **Tests greened (the blocking RED above).** The 10 failing unit tests plus a
  previously-unlisted e2e failure (`collaboration-tui.e2e.test.ts`) are green.
  Fixtures unified to id-bearing identities via
  `deriveOverrideCollaborationIdentity`; the superseded `session_id_prefix`
  disambiguation block deleted; TUI snapshot + e2e fixtures modernised to the
  id-keyed shape; one test added for the id-less-audience short-circuit
  (un-migrated identities are never group members). A test-expert review passed.
- **Doctrine removal finished.** PDR-076a carries a §Sunset-execution note with
  the (previously unrecorded) sunset criteria; `register-identity-on-thread-join.md`
  reconciled from `(name, prefix)` to `(name, id)`; the hardcoded coordinator
  name stripped from `use-agent-comms-log.md` so the coordinator is discovered
  from live state (M1 inventory §4.5 item 3 — "stands regardless of M2"); a
  stale `claim-reports.ts` comment fixed.
- **Verification gate clean.** The legacy-ref grep over `agent-tools/src` +
  `tests` returns nothing. Full `pnpm check` passes (turbo 108/108 + all tail
  gates).

### Disposition

This file is **retained in `future/` in place**, not archived, because it is a
live cross-link hub: the
[`collaboration-substrate-coordination-rightsizing`](collaboration-substrate-coordination-rightsizing.plan.md)
brief names this plan's §Open-problems as its M1 inventory base, and several
cluster plans back-link here. Final archival disposition is deferred to that
brief's **M4 supersession list**, which owns the cluster's lifecycle decisions.
The routing layer's verdict is already settled — **deleted, strict id-keyed,
no fallback** — a worked instance of the replace-vs-migrate discipline M3 will
generalise.
