---
id: mcp-output-contracts
node_type: strategic
name: "MCP output contracts"
overview: >-
  Every successful result on the served MCP surface conforms to a
  machine-checkable, source-derived contract that the server enforces —
  with the wire-advertisement cost measured and owner-ruled, not assumed.
status: ratified
ratified_by: "Jim Cresswell"
ratified_date: 2026-08-19
ratified_where: >-
  In-session owner word, Director session Ocelot binds Tunnel (c28ad9),
  2026-08-19 — verbatim: "ratify all three -- then commit and push",
  answering the enumerated stamp scope presented at that seat; the
  advertisement ruling folded the same day from the in-session card
  answer ("option 1 then leaning to 2, but let's see what 1 gives us").
serves: APP-1
impact_areas:
  - served-surface
  - conformance-and-standards
gate_expiry_default: P3D
depends_on: []
owner_gates: []
tickets: []
last_updated: 2026-08-19
---

# MCP output contracts

## Outcome

Connected assistants can discover a machine-checkable output contract
for every live universal Oak tool, and the server rejects any successful
tool result that violates its declared contract. The served surface
tells the truth first: the schema cache matches the live upstream, and
no tool is advertised live whose upstream endpoint has been removed.

This node is deliberately short-lived (owner word 2026-08-19): it exists
to own the output-contract outcome to completion, and it archives when
its delivery plans complete — it is not standing programme structure.
(The plan-node schema describes strategic nodes as long-lived; the
owner's word creates this outcome-scoped exception deliberately, and
the schema-side reconciliation is a recorded follow-up, not this
node's concern.)

## The bet

Three commitments, each grounded in first-hand evidence gathered
2026-08-19 (fleet verification at HEAD `7935f4174`, vendor semantics
pinned to the installed SDK 1.30.0 / ext-apps 1.7.5):

1. **SDK-native, no second validator.** The MCP SDK already supplies
   `outputSchema` discovery and successful-result validation
   (`isError: true` results verified exempt at the installed version).
   We use that path rather than building bespoke validation.
2. **Contracts model the served wire, not internal shapes.** The live
   wire carries three distinct result envelopes (generated, aggregated,
   app-local) — verified on real production calls. Contracts are
   composed mechanically over source-owned payload schemas per the
   schema-first directive's §Output Contracts, and conformance is
   proven on the `tools/list` wire and real results, never on a
   registration config object (the SDK silently drops non-object-rooted
   schemas from the wire while still enforcing them at call time).
3. **Enforcement and advertisement are priced separately.**
   Server-side enforcement benefits every client equally and costs the
   wire nothing. Advertisement benefits only structuredContent-consuming
   clients while costing every client bytes on every connection — the
   SDK couples the two, so the cost ruling was this node's one owner
   gate, resolved same-day. Two measured anchors put the decision in the owner's
   court: the advertised tools/list payload alone (134,010 bytes) would
   exceed the estate's ratified 25K-token p95 response-size bar; and the
   most recent comparable ruling (ADR-058's dated update, 2026-07-29,
   MCP-366) removed a ~45-token-PER-RESPONSE hint on cost grounds —
   the new cost is per-CONNECTION, so the two equalise only in sessions
   of hundreds of tool calls, and the honest statement is per-session:
   every connection pays the full schema payload once, before any tool
   is called. RULED (owner word, 2026-08-19, in-session card): measure
   $defs-deduplicated emission first and surface the real number;
   posture leans accept, confirmed at the measured figure — the
   implementation plan carries the measurement slice.

What we are deliberately not doing: hand-authoring per-tool output
shapes; changing successful `structuredContent` beyond the two named
wire-correctness defects (data-dependent envelope root; reserved-key
collision) recorded in the implementation plan; porting to the v2 SDK
mid-landing.

## Success looks like

- The wire-level conformance instrument (extending the existing
  registration-proof machinery) is green across the whole live
  universal surface: every live tool's schema is on the `tools/list`
  wire, every real successful result conforms, a deliberately invalid
  success is rejected, and dormant activation without a schema fails.
- The served surface carries no tool whose upstream endpoint is gone,
  and the schema cache matches the live spec at landing.
- The advertisement ruling (measure-then-confirm, 2026-08-19) is
  honoured: the dedup measurement lands before the ratchet and the
  confirmed figure is recorded durably.
- This node and its delivery plans are archived, with the output-contract
  ADR minted as the durable record.

What this node does not claim: that output contracts make the surface
strictly typed for content-only clients (they read serialised text, not
`structuredContent`), or that any current client is observed consuming
`outputSchema` for validation today — the enforced server-side contract
is the warranted value; client-side value accrues as hosts adopt it.

## Delivery

Delivery plans serving this node declare `serves: mcp-output-contracts`
— enumerate them by search, never by a hand-kept list. Sequencing lives
on their `depends_on` edges: the served-surface truth plan is
independently shippable and unblocks the implementation plan's final
slices.
