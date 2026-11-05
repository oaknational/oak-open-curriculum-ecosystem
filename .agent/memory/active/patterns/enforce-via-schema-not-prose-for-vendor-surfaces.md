---
name: "Enforce via Schema, Don't Enumerate in Prose, for Vendor Surfaces"
polarity: pattern
use_this_when: "A document re-lists the fields, enums, or values of a fast-moving external/vendor specification (platform frontmatter, an API's accepted parameters, a config surface) so an agent can author against it — and the spec keeps changing underneath the prose."
category: agent
layer: general
proven_in: "agent-tools/.../frontmatter-schema.ts + validate-subagents (docs-reviewer-split, 2026-06-28)"
proven_date: 2026-06-28
related_pdr: PDR-105
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Prose that enumerates a moving vendor spec drifts silently; agents author against stale field/enum lists and the drift is invisible until a careful read or a downstream failure."
  stable: true
---

> **POLARITY: PATTERN.** A shape to repeat. See
> [`README.md` § Polarity](README.md#polarity-required-every-pattern).

# Enforce via Schema, Don't Enumerate in Prose, for Vendor Surfaces

## Pattern

When prose re-lists the fields/enums/values of a moving external specification
so agents can author against it, that enumeration is the drift surface. Replace
it: make an **enforced, localised schema the single source of truth**, and have
the prose **point at the schema** instead of re-listing values that go stale.

A worked instance: the `subagent-architect` prose enumerated each platform's
wrapper frontmatter and had drifted hard — the official Claude sub-agent spec had
gained nine fields, its colour list named invalid values that were live in
wrappers, and Cursor had no `tools` field at all. The cure was a per-platform Zod
frontmatter schema as the SSOT, wired into `validate-subagents`; the prose now
references it. Currency moves from drift-prone prose into one enforced, localised,
auditable file.

## Why this works

- **The enforced gate beats review by a class, not a margin.** On the same
  surface, the schema validator caught three invalid colours and twenty-two
  non-conformant fields; a careful first-hand currency review of the prose had
  caught one. Build the gate; the gate finds the violations
  (sibling: [`governance-claim-needs-a-scanner.md`](governance-claim-needs-a-scanner.md)).
- **It relocates currency work, it does not remove it.** A local schema that
  mirrors a moving spec needs a reconcile anchor: carry the official-doc URL and
  a `lastVerified` date per source, guarded by a unit test, and re-run the
  currency check on a platform-release signal. Do not fetch-in-CI (brittle); make
  the re-check an explicit, auditable, re-runnable workflow.

## The reflexive case

This is documentation-is-infrastructure (ADR-127 §5) applied to agent
definitions: the same SSOT/DRY discipline that governs code content governs the
prose that describes a controlled surface. It is the constructive twin of
[`fidelity-audit-is-not-currency-audit.md`](fidelity-audit-is-not-currency-audit.md)
— don't audit drift out of prose by hand, design the prose so it cannot drift.

## Related

- [[feedback_documentation_is_infrastructure]] — the governing principle.
- [[feedback_derive_dont_bridge_controlled_surface]] — derive a controlled
  surface from authoritative data rather than re-stating it.
- [`governance-claim-needs-a-scanner.md`](governance-claim-needs-a-scanner.md) —
  back a universal claim with a scanner; this pattern is the SSOT side of the
  same coin.
