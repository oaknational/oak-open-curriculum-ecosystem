---
id: mcp-sdk-v2-migration-spike
node_type: delivery
name: 'Spike: size the MCP SDK v2 migration as one debespoking of transport, session, and auth'
overview: 'Investigate and size — never execute — the move from the v1 SDK to the v2 package family, treating the oldest bespoke wiring (transport, session, auth) as one surface to be replaced by now-canonical package functionality; the deliverable is a decision-complete migration plan.'
status: sketch
serves: first-major-release
impact_areas:
  - served-surface
  - auth-and-access
tickets:
  - MCP-506
depends_on: []
owner_gates: []
last_updated: 2026-08-05
---

# Spike: size the MCP SDK v2 migration

## Goal

The migration from the v1 SDK to the v2 package family is sized and
sliced before anyone commits to it: what bespoke code becomes
deletable, what the canonical replacements actually ship, which
protections must be ported, in what order it can safely land — all
recorded as a decision-complete migration plan node. The spike's
deliverable is that plan, never the port itself.

## Problem

The server's core wiring — transport, session handling, and the auth
stack — is the oldest part of the MCP code, written when the protocol
and its ecosystem were young: the OAuth proxying, token verification,
protected-resource-metadata serving, and session plumbing were
hand-rolled because nothing canonical existed. The ecosystem has since
matured past us: the v2 package family is the stable line, released
alongside the current spec revision, and it implements natively what
we carry as bespoke code — including the version-negotiation surface
whose absence produces the (spec-correct, client-recovered) production
rejections recorded on MCP-497. The v1 line we run has a maintenance
horizon of roughly six months from v2's release.

Migrating by porting our workarounds forward would preserve exactly
the code the migration exists to delete. The estate's
replace-don't-bridge discipline demands the opposite: inventory what
is now canonical, delete the bespoke equivalents, and port only the
contracts that carry real protections.

## Mechanism

The spike is an investigation with five numbered questions; every
answer is verified first-hand against the packages and recorded with
retrieval dates (perishable-claim discipline):

1. **Inventory the deletable-bespoke surface.** Enumerate our
   transport wiring (the streamable-HTTP transport pair), session
   handling, and auth stack (OAuth proxying, token verification,
   PRM serving, path layout), and classify each piece: replaced by v2
   / still needed / genuinely ours.
2. **Verify what v2 actually ships.** First-hand inspection of the
   `server`, `node`, and `core` packages: the new transport and
   session API shapes, `server/discover`, the structured
   version-negotiation errors, and the auth surface (bearer handling,
   PRM, resource-server metadata). No capability claims from memory or
   marketing — the packages themselves are the source.
3. **Verify the Clerk-side pairing.** The currency and coverage of
   `@clerk/mcp-tools` against v2, and what remains of our Clerk glue
   when both canonical layers are in place.
4. **Assess `ext-apps`.** The MCP Apps extension package against our
   widget surface, including whether it cures the resource-URI churn
   class.
5. **Name the ported contracts.** The protections that survive in
   whatever shape the Clerk production-promotion guard series lands:
   allowlist key-realm validation, the disable-auth refusal, the
   authorised-parties threading, and canonical-host anchoring with
   production-detection corroboration. The migration plan must show
   each contract's new carrier before any bespoke carrier is deleted.

**Sequencing rule (binding on the output plan):** the spike may run at
any time; the migration itself lands only after the Clerk production
promotion settles, and ports its guard contracts onto the canonical
surface — two refactors of the same auth code must not fly in
formation.

## Acceptance criteria

1. **The inventory exists** — every bespoke transport/session/auth
   piece classified with its v2 disposition. Proof: repo-safe — the
   inventory in the spike report or directly in the output plan node.
2. **The v2 capability findings are first-hand and dated** — package
   versions pinned, API shapes cited from the packages, auth surface
   and `ext-apps` verdicts recorded. Proof: repo-safe — citations in
   the output.
3. **The ported-contracts list is complete against the landed guard
   series** — each contract named with its canonical carrier. Proof:
   repo-safe — the list in the output plan; cross-checked against the
   guard PRs as merged.
4. **A decision-complete migration plan node exists** (born sketch)
   with sized slices, the sequencing gate, and no open design forks.
   Proof: repo-safe — the node in the plan estate; this spike node
   archives when that node exists.

## Out of scope

- Executing any part of the migration — no dependency changes, no
  transport or auth edits ride this spike.
- Touching the in-flight Clerk guard series or its PRs (another
  lane's live work).
- The protocol-rejection analytics event and other observability work
  (owned by the correlation-graph plan).
- Any change to the served tool surface.

## Todos

- [ ] T1: inventory the bespoke surface (mechanism question 1).
- [ ] T2: first-hand v2 package verification (questions 2–4), findings
      dated and cited.
- [ ] T3: ported-contracts list against the landed guard series
      (question 5).
- [ ] T4: author the output migration plan node; archive this spike
      node against criterion 4.

## Relationship to siblings

MCP-497 carries the production evidence and verdict trail that
motivated this spike. The Clerk production promotion (MCP-143 series)
is the sequencing gate and the source of the ported contracts. The
correlation-graph plan (`cross-system-observability-contract`) owns
the observability additions the migration will make easier, and
consumes none of this spike's output.
