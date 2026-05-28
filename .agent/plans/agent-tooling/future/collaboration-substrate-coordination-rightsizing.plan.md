---
name: "Collaboration Substrate Coordination Right-Sizing (First-Principles Re-Ground)"
overview: "Re-derive the minimal coordination substrate the real operating context needs — 1-3 agents, owner present, advisory not mechanical — and produce the supersession/deletion list for the accreted layers that exceed it. An exploration brief: its deliverable is a ratified design and a cull list, not new coordination machinery. This is the home for the wider re-ground that routing-legacy-fallback-sunset surfaced and deliberately parked."
status: future-strategic-exploration
todos:
  - id: m1-characterise-context-and-inventory
    content: "M1: Characterise the actual operating context (concurrency, owner-presence, failure modes seen) and inventory every accreted coordination layer with the incident that spawned it."
    status: pending
  - id: m2-derive-minimal-substrate
    content: "M2: Derive the minimal coordination substrate from first principles against that context; measure each existing layer against 'does the real context need this?'."
    status: pending
  - id: m3-replace-vs-migrate-discipline
    content: "M3: Produce the replace-vs-migrate decision discipline and the scaffold-sunset-forcing mechanism (so the next bridge does not calcify)."
    status: pending
  - id: m4-supersession-list
    content: "M4: Output the per-plan / per-layer supersession-and-deletion list, resolving the routing plan's parked 'one new plan vs cluster refactor' question."
    status: pending
---

# Collaboration Substrate Coordination Right-Sizing (First-Principles Re-Ground)

**Last Updated**: 2026-05-28
**Status**: 🔵 FUTURE — strategic **exploration** brief. Its deliverable is a
ratified design and a cull list. It is **not** a build plan; it adds no
coordination machinery. Build, refactor, and deletion plans are authored only
after M2 ratifies the target design.
**Activation trigger**: owner prioritises the substrate re-ground, OR a third
accretion incident lands (a new coordination layer spawned by a new failure),
OR [`routing-legacy-fallback-sunset`](routing-legacy-fallback-sunset.plan.md)
reaches promotion (it shares this re-ground gate and names this brief as the home
for its open problems).
**Scope**: The three unsolved problems
[`routing-legacy-fallback-sunset`](routing-legacy-fallback-sunset.plan.md)
§"Open problems we don't yet know how to handle" surfaced and explicitly handed
to "the plan-collection consolidation and refinement pass." That pass had no
owning vessel; this brief is it.

---

## Problem and Intent

The collaboration substrate grew by accretion. Each incident spawned a new layer
— gate-runner election, cycle-overlap coordination, coordinator-handoff-two-moments,
heartbeat-stall diagnostic, the PDR-076a routing-legacy fallback, and most
recently the claim-liveness gap. These are fences accumulating while the
generator stays unchanged — the exact failure mode `principles.md`
§Architectural Excellence names. Three facts make this a single thread:

1. **No simplified first-principles design exists.** We have layers, not a model
   the layers are derived from. New incidents add layers because there is nothing
   to derive a smaller answer from.
2. **The ceremony is heavier than the operating context.** The all-channels
   watcher and typed-state heartbeat are prescribed as "non-negotiable
   preconditions", yet the owner routes around them (standing minimal-ceremony
   preference) and the watcher itself runaway-failed on 2026-05-28. The substrate
   is built for large unattended agent teams; the real context is 1-3 agents with
   the owner present. When the canonical mechanism is routinely overridden, the
   mechanism is wrong, not the override.
3. **The substrate evolves by bridging, not replacing.** The routing-legacy
   fallback is one instance of "bridge a migration, then never sunset it." There
   is no settled discipline for when to replace vs migrate, nor for forcing a
   scaffold's sunset to completion.

**Intent**: stop adding fences. Re-derive the minimal coordination substrate the
real context needs, and cull what exceeds it. The owner's minimal-ceremony
preference is not a workaround to be tolerated — it is evidence of the target
design, and the substrate should match it by construction so no override is
needed.

## End Goal, Mechanism, Means

**End goal**: a ratified minimal-coordination design for the actual operating
context, plus a concrete supersession/deletion list for the layers that exceed
it. Success is a *smaller* substrate that the owner does not have to route
around — not more coordination features.

**Mechanism**: layers were added bottom-up from incidents with no top-down model,
so each looks locally justified while the aggregate is over-built. Deriving the
model top-down from the real context gives the yardstick every existing layer is
measured against; "does the real context need this?" is answerable only once that
model exists. The replace-vs-migrate discipline then prevents the next bridge
from calcifying — a structural cure, not another fence.

**Means (strategic moves — exploration, not build cycles)**:

- **M1 — Characterise and inventory.** State the real operating context
  precisely (typical and worst-case concurrency; owner-presence assumption;
  the actual failure modes observed). Inventory every coordination layer with the
  incident that spawned it and the doctrine that records it
  (PDR-056, PDR-080, PDR-082, `agent-collaboration.md`, the watcher/heartbeat
  preconditions, claims TTL/heartbeat, routing).
- **M2 — Derive the minimal substrate.** From the M1 context, derive the smallest
  coordination model that meets it, holding the ratified invariants as inputs
  (advisory-not-mechanical, text-first-not-binary, portable-not-platform-native,
  owner-is-final — these are *constraints on the answer*, not subjects of
  re-litigation). Measure each inventoried layer against the model: keep, fold,
  or delete.
- **M3 — Replace-vs-migrate discipline.** Produce the decision rule for replace
  vs migrate and the mechanism that forces a scaffold's sunset to completion
  (composing with the [`replace-dont-bridge`](../../../rules/replace-dont-bridge.md)
  rule), so the bridging anti-pattern stops recurring.
- **M4 — Supersession list.** Resolve the routing plan's parked question — *one
  new plan vs refactor the cluster* — with a concrete per-layer/per-plan verdict:
  which cluster plans are superseded, folded, or deleted once the target design
  is ratified.

## Domain Boundaries and Non-Goals

- **Not a build plan.** No coordination code, schema, or CLI is written under this
  brief. M2's ratified design gates any subsequent build/refactor/deletion plan.
- **Not adding coordination ceremony.** A re-ground that produces more machinery
  has failed. The expected direction of the answer is *less*.
- **Not re-litigating the ratified invariants.** Advisory-not-mechanical
  (`agent-collaboration.md` + PDR-056), text-first, portable-first, owner-final
  are inputs to the derivation, not open questions.
- **Not the routing-legacy-fallback sunset itself.** That proceeds independently
  on its own trigger; this brief owns the wider problems it surfaced, not its
  concrete deletion work.
- **Not the claim-liveness / crash-reconciliation work.** That is a scoped
  primitive owned by
  [`claim-liveness-crash-reconciliation-and-session-forensics.plan.md`](claim-liveness-crash-reconciliation-and-session-forensics.plan.md);
  this brief may supersede or absorb it at M4, but does not block it.

## Dependencies and Sequencing

| Dependency | Classification | Note |
| --- | --- | --- |
| [`routing-legacy-fallback-sunset`](routing-legacy-fallback-sunset.plan.md) §Open problems + cross-link map | beneficial | The starting inventory for M1; this brief is the home that section names. Shippable without it by rebuilding the inventory from the doctrine set. |
| PDR-056 / PDR-080 / PDR-082 / `agent-collaboration.md` | beneficial | The current doctrine M1 inventories and M2 measures; their invariants are inputs, not subjects. |
| The wider cluster (liveness-floor, domain-model, coordination-watcher-canonicalisation, write-safety, comms-watch-storage, multi-agent-protocol, sidebar-escalation, joint-decision) | beneficial | M4's supersession targets. None blocks the derivation. |

## Strategic Acceptance Criteria and Success Signals

- A ratified minimal-coordination model exists, derived from a stated operating
  context, with the four ratified invariants explicit as inputs.
- Every inventoried layer has a recorded verdict: keep / fold / delete, with the
  reason tied to the model.
- The replace-vs-migrate + sunset-forcing discipline is recorded as a rule or PDR.
- **Primary signal**: the resulting substrate is one the owner does not route
  around — minimal-ceremony is satisfied by construction, not by override.
- **Secondary signal**: the supersession list is concrete enough that the next
  incident adds *no* new layer because the model already covers it (or the model
  is amended deliberately, not accreted).

## Risks and Unknowns

- **The re-ground becomes its own ceremony.** A heavyweight redesign of a
  too-heavy substrate is self-defeating. Keep M1/M2 lean; bias to deletion.
- **The honest answer may be "delete most of it."** That must be an acceptable
  outcome, not a failure — a smaller substrate is the goal.
- **Concurrent substrate work churns the target.** Live agents (and the
  claim-liveness plan) are editing the same surfaces; M4's supersession list must
  be re-derived against the tree at promotion, not frozen now.
- **Invariant drift.** The four invariants are held as inputs; if M2 finds one
  genuinely conflicts with the minimal design, that is an owner-facing escalation,
  not a quiet re-litigation.

## Promotion

This is an exploration brief; M1-M4 are investigation moves, and their execution
shape (single re-ground session, peer-pair design sidebar, or a sequence) is
finalised at promotion to `current/`. Promote on the activation trigger; record
the trigger evidence and the readiness verdict. The first executable output is
the ratified design document (M2), from which build, refactor, and deletion plans
are authored — never the reverse.
