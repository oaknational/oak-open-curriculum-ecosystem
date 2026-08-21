---
id: mcp-output-schemas-response-validation
node_type: delivery
name: "MCP output schemas and response validation"
overview: "Give every live universal tool a source-derived, object-rooted output contract that the MCP server advertises and enforces."
status: superseded
superseded_by: mcp-output-contracts-implementation
ratified_by: "Jim Cresswell"
ratified_date: 2026-07-29
ratified_where: "Owner morning-card answer 2026-07-29, routed via the Director (comms event 9d32fcfd-bac6-430e-8144-0e16b9d067c9); merge record on PR #619"
serves: first-major-release
impact_areas:
  - served-surface
  - conformance-and-standards
tickets:
  - MCP-332
depends_on: []
owner_gates: []
last_updated: 2026-08-19
---

# MCP output schemas and response validation

> **Superseded 2026-08-19** (owner word) by
> [`mcp-output-contracts-implementation`](../mcp-output-contracts-implementation.plan.md)
> under the `mcp-output-contracts` strategic node. A 14-leg verification
> fleet proved the design's core in the main and falsified five points
> the successor corrects: the wire carries three envelope shapes, not
> one (two composers + one bespoke, `status` typed per provenance); the
> carrier must be Zod-valued (registration does not accept JSON Schema);
> conformance must be proven on the serialised `tools/list` wire (the
> SDK silently drops non-object-rooted schemas while still enforcing
> them); the "gated on MCP-303 live captures" clause below was stale
> prose (the drive is acceptance evidence, never a start gate); and
> acceptance criterion 4's absence-pin test contradicts the owner's
> 2026-08-19 testing ruling and is re-expressed behaviourally. The
> changelog-tool 404 defect and cache refresh moved to
> [`mcp-served-surface-truth`](../mcp-served-surface-truth.plan.md).

On ratification, this delivery node supersedes the executable interpretation
of the
historical June design record (`../../../plans-backlog-2026-07/sdk-and-mcp-enhancements/archive/superseded/output-schemas-for-mcp-tools.plan.md`).
That record and its
[audit](../../../reports/output-schema-mcp-plan-audit-2026-06-02.md) remain
lineage evidence and the owner dispositions its legacy execution contract when
ratification lands. Owner-ratified 2026-07-29 (morning-card answer, routed via
the Director): this node is the governing execution contract for the
output-schema work, which remains gated on the MCP-303 live captures.

## Goal

Connected assistants can discover a machine-checkable output contract for
every live universal Oak tool, and the server rejects any successful tool
result that violates its declared contract. The app-local orientation pointer
remains honestly free-form, and a dormant universal tool cannot become live
without an output schema.

## Mechanism

The MCP SDK already supplies `outputSchema` discovery and successful-result
validation. This plan uses that first-party path rather than building a second
validator.

The universal registry currently contains 42 definitions: 29 generated and 13
hand-built. The served-surface definition makes 39 of them live and keeps
`get-eef-evidence`, `user-search`, and `user-search-query` dormant. The app also
registers `oak-under-the-hood` separately. Its behaviour-only pointer projection
intentionally has no output schema, as recorded by the completed
[tool plan](../../../plans-backlog-2026-07/sdk-and-mcp-enhancements/active/oak-under-the-hood.plan.md)
and ADR-202.

One object-rooted envelope composer models the successful
`formatToolResponse` result: the source-owned payload, `summary`, and
`status` where the executor emits it. Payload
schemas stay beside the generated response descriptor, corpus writer, or
Oak-authored transform that owns the runtime value.

Generated descriptors already inherit the protocol `Tool.outputSchema`, whose
value is serialised JSON Schema. The runtime registration schema is a different
thing. Code generation therefore emits a distinctly named internal field,
`toolMcpOutputSchema`, and the universal registry projects that Zod/Standard
Schema value to registration's `outputSchema`. The generated path composes the
single current successful response status; error responses remain `isError:
true` and are not output-validated.

Producer changes land by source provenance. A bounded internal carrier lets
those single-story changes land without claiming that optionality is the
product contract. The closing served-boundary guard is unconditional: every
live universal tool must have an object-rooted schema before registration.
Dormant rows have no bypass; making one live without a schema fails.

Captured successful results are falsification evidence, not a schema source and
not a prerequisite for carrier or producer authoring. Repository tests exercise
every live universal producer. A credentialed drive adds one bounded,
credential-free successful witness per live universal tool before final
acceptance; it does not claim to enumerate every possible success variant.

Source-poor hand-built producers are the recommended first pickup because they
carry the greatest contract uncertainty. The generated producer remains
independently executable once the shared composer and carrier exist.

## Acceptance criteria (each with a proof)

1. **The inventory is mechanically true.** The registry reports 42 universal
   definitions (29 generated and 13 hand-built); the served definition reports
   39 live universal definitions and three dormant definitions; app-local
   registration contributes the fortieth live tool.
   - Proof (`repo-safe`): a totality test derives these counts from the generated
     registry, aggregated definitions, and served-surface definition.
2. **Every live universal tool advertises and enforces an object-rooted output
   schema.**
   - Proof (`repo-safe`): a registry-total conformance test invokes all 39 live
     universal producers through their public execution boundary, parses every
     successful `structuredContent`, proves `tools/list` advertises each schema,
     proves a deliberately invalid successful result is rejected, and proves
     `isError: true` remains exempt.
   - Proof (`owner-held`): the Oak product owner verifies one credentialed
     successful witness for each of the 39 live universal tools and records the
     bounded result on MCP-332; credentials, signed URLs, and unrestricted raw
     payloads are not retained.
3. **Schema ownership is source-first.**
   - Proof (`repo-safe`): generated schemas are emitted by code generation;
     hand-built result types infer from their source Zods or carry compile-time
     equivalence assertions; no generated descriptor is hand-edited; focused
     drift tests fail when a source and transform diverge.
4. **The free-form app-local exception stays explicit.**
   - Proof (`repo-safe`): the existing `oak-under-the-hood` integration test
     continues to prove a closed empty input schema, no `outputSchema`, and the
     behaviour-only pointer result; the served inventory expects exactly this
     named app-local exception.
5. **Dormant activation cannot bypass the contract.**
   - Proof (`repo-safe`): a served-surface test changes each dormant universal
     fixture to live and proves registration fails until an object-rooted output
     schema is present.
6. **The plan and product documentation stay truthful.**
   - Proof (`repo-safe`): each producer change updates its owning TSDoc in the
     same changeset; the plan-corpus validator, documentation validator,
     Prettier, and markdownlint pass.
   - Proof (`owner-held`): before ratification, the Oak product owner verifies
     that the assumptions, MCP, and docs/ADR specialist dispositions are
     recorded on MCP-332.

## Todos

Each item is a single-story changeset with a default budget of at most two
review rounds.

1. **Envelope composer** — code changeset. Add the object-rooted output-envelope
   composer with unit proofs for summary, status, context-hint inclusion, and
   rejection of a non-object payload.
2. **Universal carrier** — code changeset, after item 1. Add the distinctly
   named internal runtime-schema field to generated and hand-built definition
   contracts, project it through the universal list, and prove both
   `registerTool` and `registerAppTool` receive the same present schema. Do not
   overload the inherited protocol JSON-Schema field.
3. **Progression graphs** — code changeset, after items 1–2. Add source-owned
   output schemas and real-result conformance for `get-thread-progressions` and
   `get-prior-knowledge-graph`.
4. **Vocabulary graphs** — code changeset, after items 1–2. Add source-owned
   output schemas and real-result conformance for `get-misconception-graph` and
   `get-keyword-graph`.
5. **Search retrieval** — code changeset, after items 1–2. Derive and attach the
   transformed output schemas for `search` and `fetch` from the generated search
   response schemas.
6. **Browse and explore** — code changeset, after items 1–2. Derive and attach
   the output schemas for `browse-curriculum` and `explore-topic` from their
   owning generated API projections.
7. **Curriculum orientation** — code changeset, after items 1–2. Attach the
   fixed-data output schema for `get-curriculum-model` and prove the
   served-boundary guidance filter preserves it.
8. **Asset download** — code changeset, after items 1–2. Attach the output schema
   derived from the live download execution transform. Preserve ADR-126's
   proof-before-signing, identity, and expiry constraints without treating that
   ADR as output-shape authority.
9. **Generated producers** — generated-artefact changeset, after items 1–2.
   Teach code generation to emit `toolMcpOutputSchema` for all 29 descriptors
   from each descriptor's successful response Zod, regenerate the descriptors,
   and prove representative simple and context-bearing outputs. Generated
   artefacts are exempt from the size warning under the small-PR design rule;
   the two-round budget still binds.
10. **Served-boundary ratchet** — code changeset, after items 3–9. Make schema
    presence unconditional for live universal registration, add the registry-
    total 39-tool conformance instrument and dormant-activation proofs, and run
    the credentialed acceptance drive. Documentation lands with the producer or
    ratchet change it describes rather than as a separate story.

## First-principles checks

- **Shape:** one source-owned payload schema, one envelope composer, one
  universal projection, and one strict served-boundary guard; no placeholder
  schema or parallel validator.
- **Landing path:** provenance-sized changesets converge independently, while
  the final ratchet makes the product invariant unconditional.
- **Vendor path:** use the MCP SDK's native `outputSchema` discovery and
  successful-result validation; bespoke validation is out of scope.

## Out of scope

- Changing successful `structuredContent` merely to simplify its schema.
- Replacing hand-authored input validators or resolving input-schema
  required-alternative limitations.
- Activating the dormant EEF or user-search tools.
- Giving `oak-under-the-hood` a broad placeholder schema or moving it into the
  universal registry.
- Changing asset signing, identity, expiry, or proxy behaviour.
- Performing or scheduling an external directory submission.
