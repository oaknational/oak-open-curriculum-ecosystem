---
id: mcp-output-contracts-implementation
node_type: delivery
name: "MCP output contracts — implementation"
overview: >-
  Compose, carry, and enforce source-derived output contracts for every
  live universal tool, modelled on the verified served wire, proven at the
  tools/list wire and on real results.
status: ratified
ratified_by: "Jim Cresswell"
ratified_date: 2026-08-19
ratified_where: >-
  In-session owner word, Director session Ocelot binds Tunnel (c28ad9),
  2026-08-19 — verbatim: "ratify all three -- then commit and push",
  answering the enumerated stamp scope presented at that seat; the
  advertisement ruling folded the same day from the in-session card
  answer ("option 1 then leaning to 2, but let's see what 1 gives us").
serves: mcp-output-contracts
impact_areas:
  - served-surface
  - conformance-and-standards
tickets:
  - MCP-332
depends_on:
  - plan: mcp-served-surface-truth
    kind: blocking
  - plan: lesson-search-freshness-and-error-envelope
    kind: beneficial
owner_gates: []
last_updated: 2026-08-19
---

# MCP output contracts — implementation

Successor to the archived `mcp-output-schemas-response-validation`
delivery node (ratified 2026-07-29; superseded 2026-08-19). Its design
survived adversarial verification in the main; this plan conserves it
and corrects the five points the 2026-08-19 fleet falsified or
sharpened, each noted inline. The `blocking` edge above binds the final
slices (todos 9–13: the refreshed cache, the truthful denominator, and
what builds on them); todos 1–8 are start-safe the moment this
plan is ratified — the parallelism is real and deliberate: of the
truth plan's two todos, only the cache refresh (its todo 1) genuinely
gates this plan's slices 9–13; do not read the blocking edge as
serialising everything. The `beneficial` edge: the error-envelope plan is
independent at the SDK level (`isError` results verified exempt from
output validation at SDK 1.30.0) — landing it first settles
`formatError`'s shape beside `formatToolResponse` so the composer
author sees the finished error side; without it this plan ships
unchanged.

## Goal

Connected assistants can discover a machine-checkable output contract
for every live universal Oak tool, and the server rejects any
successful tool result that violates its declared contract. A dormant
universal tool cannot become live without a contract. The app-local
orientation tool stays honestly free-form.

## Mechanism

**The wire has three envelope shapes, not one** (falsifies the June
record's single-composer doctrine; verified on live production calls
2026-08-19): generated tools serve `{status: number, data: <payload>,
summary}` (the executor pre-wraps at
`packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/executor.ts`);
aggregated tools serve the payload spread at root with `summary` and
optional `status: 'success'`; the app-local tool serves a bespoke
shape. The composition site is `formatToolResponse` in
`packages/sdks/oak-curriculum-sdk/src/mcp/universal-tool-shared.ts`.
So: two envelope composers (generated and aggregated), one bespoke
app-local schema, with `status` typed per provenance — the contract
models served reality; it does not invent a uniform envelope.

**Two wire-correctness defects are fixed before composing over them**
(correct-by-construction, the only sanctioned wire changes; both live
in `formatToolResponse`): the envelope root is data-dependent (an
empty-object payload flips root-spread into `{data: {}}`) — make the
root unconditional; and `summary`/`status` are spread last, silently
clobbering same-named payload keys — reserve or nest so collision is
impossible.

**The carrier is Zod-valued.** Both registration APIs accept a runtime
Zod shape, not JSON Schema (verified at sdk 1.30.0 / ext-apps 1.7.5 —
ext-apps delegates to the same `registerTool`). Codegen emits a
distinctly named `toolMcpOutputSchema` as a Zod value composed over
each descriptor's response Zod; measured, this route is 2.05× smaller
on the wire than serialising the existing `toolOutputJsonSchema`
(58,914 vs 120,935 bytes) — reusing the JSON field is the tempting
shortcut and is wrong twice (wrong type for registration; double the
bytes).

**Contracts model the post-transform shape.** Composition happens over
the POST-serialisation payload type (the `serialiseArg` lowering in the
generated execution path maps bigint → string);
`get-curriculum-model`'s contract models the projection produced by
`apps/oak-curriculum-mcp-streamable-http/src/served-surface/filter-guidance-content.ts`
(applied post-tool in `handlers.ts`), and that filter is made total —
it accepts every successful result shape and its unfiltered fallback
branch is removed — so the contract has exactly one shape to model;
`search`'s union collapses to one object schema: a single object root
whose `scope` field remains the required discriminant and whose
mode-specific members are optional (the June record's "one object with
mode-optional fields, never a root union" ruling, adopted) — a union
root would be silently dropped from the `tools/list` wire while still
enforced at call time.

**Proof lives on the wire.** The closing ratchet extends the existing
registration-proof instrument (`createConnectedClient` +
`served-tool-table`, which observe the real composition root's live
`tools/list`) rather than building a second walker; a registration-config
assertion is insufficient because the SDK drops non-object-rooted
schemas from the wire with no error. Denominators derive from the
served-surface definition, never hard-coded counts.

**Landings are staged by provenance** — hand-built producers first
(greatest contract uncertainty), generated producers as one
generated-artefact changeset, the unconditional ratchet last. Every
landed state is correct: a tool either carries a true contract or
carries none yet; no intermediate state declares a false one.

**The advertisement ruling is in** (owner word, 2026-08-19, in-session
card): measure `$defs`-deduplicated emission first — todo 11 — and
surface the real wire figure; the posture leans accept, confirmed at
the measured number before the ratchet lands. The ratchet slice lands
only at that confirmation.

## Acceptance criteria (each with a proof — required)

1. **The inventory is mechanically true.** Proof (`repo-safe`): a
   totality test derives the universal/live/dormant/app-local counts
   from the generated registry, aggregated definitions, and
   served-surface definition — no hard-coded denominators.
2. **Every live universal tool advertises and enforces an object-rooted
   contract.** Proof (`repo-safe`): the registry-total conformance
   instrument drives every live universal producer through its public
   execution boundary, parses every successful `structuredContent`
   against the advertised schema, asserts the serialised `tools/list`
   WIRE carries each schema, proves a deliberately invalid success is
   rejected, and proves `isError: true` results remain exempt. Proof
   (`owner-held`): one bounded credentialed successful witness per live
   universal tool, recorded on MCP-332; credentials and raw payloads
   not retained.
3. **Schema ownership is source-first.** Proof (`repo-safe`): generated
   contracts are emitted by code generation; hand-built payload schemas
   derive from their owning source Zods or carry compile-time
   equivalence ties; drift tests fail when source and transform
   diverge; no generated descriptor is hand-edited.
4. **The app-local exception stays explicit, behaviourally.** Proof
   (`repo-safe`): the served inventory names `oak-under-the-hood` as
   the one app-local free-form tool, and its behaviour (closed empty
   input, pointer result) is proven through its execution boundary — no
   configuration-object property pins, present or absent (owner ruling
   2026-08-19, testing-strategy.md §Rules).
5. **Dormant activation cannot bypass the contract.** Proof
   (`repo-safe`): a served-surface test flips each dormant universal
   fixture to live and observes registration refuse until an
   object-rooted contract is present.
6. **The record is durable and the docs are truthful.** Proof
   (`repo-safe`): the output-contract ADR is minted at the ratchet
   slice (discharging MCP-319's anticipated record); producer TSDoc
   lands with its producer change; plan-corpus, documentation,
   Prettier, and markdownlint validators pass. Proof (`owner-held`):
   specialist dispositions recorded on MCP-332.
7. **The wire cost is honoured.** Proof (`owner-held`): the measured
   tools/list delta at landing is recorded on MCP-332 and matches the
   shape of the owner's advertisement ruling on the strategic node.

## Todos

Each a single-story changeset, default budget ≤2 review rounds
(PDR-132).

1. **Wire-correctness fixes** — code changeset. The two
   `formatToolResponse` defects (unconditional envelope root;
   collision-proof `summary`/`status`) land first, red-first, with
   behaviour proofs — they have standalone value and the composers must
   not be built over a shape about to move.
2. **Envelope composers** — code changeset, after 1. The
   generated-envelope and aggregated-envelope composers plus the
   app-local schema; unit proofs include the array-rooted-payload case
   (19 of the 29 generated response schemas at HEAD `7935f4174` are
   array-rooted — 18 of 27 once the truth plan's refresh lands; the
   envelope supplies object-rootedness either way).
3. **Universal carrier** — code changeset, after 2. The Zod-valued
   `toolMcpOutputSchema` field on generated and hand-built definition
   contracts, projected through the universal list into registration;
   prove both registration branches receive it (cheap regression pin —
   ext-apps delegates) and prove presence on the serialised
   `tools/list` wire via the existing connected-client instrument.
4. **Progression graphs** — code changeset, after 2–3. Source-owned
   contracts + real-result conformance for `get-thread-progressions`,
   `get-prior-knowledge-graph`.
5. **Vocabulary graphs** — code changeset, after 2–3. Same for
   `get-misconception-graph`, `get-keyword-graph`.
6. **Search retrieval** — code changeset, after 2–3. Contracts for
   `search`/`fetch` derived from the generated search response schemas
   (`generated/search/`), union collapsed per the Mechanism section's
   recorded shape (object root, required `scope` discriminant,
   mode-optional members).
7. **Browse and explore** — code changeset, after 2–3. Contracts for
   `browse-curriculum`/`explore-topic` from their owning generated
   projections.
8. **Curriculum orientation** — code changeset, after 2–3. The
   post-filter contract for `get-curriculum-model`; make
   `filter-guidance-content.ts` total (fallback branch removed); prove
   the filter preserves the contract.
9. **Asset download** — code changeset, after 2–3 and the truth plan
   (the `302` documentation arrives with the refreshed cache). Contract
   from the live download execution transform; document the upstream
   `302` the refreshed cache records; preserve ADR-126's
   proof-before-signing, identity and expiry constraints without
   treating that ADR as output-shape authority.
10. **Generated producers** — generated-artefact changeset, after 2–3
    and the truth plan. Codegen emits `toolMcpOutputSchema` for every
    generated descriptor (emitter:
    `code-generation/typegen/mcp-tools/parts/emit-index.ts`):
    envelope-composed over the response Zod, serialisation-lowered,
    Zod-valued (the 2.05× wire measurement — 58,914 vs 120,935 bytes —
    is the recorded rationale against reusing the JSON field).
    Regenerate; prove representative simple and context-bearing
    outputs.
11. **`$defs`-deduplicated emission measurement** — code changeset,
    after 10 (owner-ruled 2026-08-19). Emit the generated contracts
    with shared definitions deduplicated via `$defs`, measure the
    serialised tools/list delta against both the raw (+58,914 B) and
    deduplicated forms, and surface the figure to the owner for the
    confirm-accept ruling. If dedup materially shrinks the wire, it
    becomes the shipped emission form.
12. **Wire conformance instrument** — code changeset, after 4–10;
    sequence after PR #895 lands (it owns
    `registration-proof/connected-client.ts` custody and ADR-226, the
    per-commit served-surface gate this instrument extends). Land the
    registry-total wire conformance instrument and dormant-activation
    proofs (AC 2, 5) GREEN against the state todos 4–10 reached —
    proving the surface before anything is made unconditional.
13. **Ratchet + record** — code changeset, after 11–12, at the
    confirmed advertisement figure. Make contract presence unconditional
    for live universal registration; run the credentialed witness
    drive; mint the output-contract ADR (folding in the advertisement
    ruling so the stance outlives these short-lived plans); record the
    measured wire delta (AC 7).

## Out of scope

- Changing successful `structuredContent` beyond the two named
  wire-correctness defects in todo 1 — contract-simplification rewrites
  of served shapes are not this plan's business.
- Replacing hand-authored input validators or input-schema
  required-alternative limitations (MCP-319's fence stands).
- Activating the dormant EEF or user-search tools.
- Giving `oak-under-the-hood` a placeholder schema or moving it into
  the universal registry.
- Asset signing, identity, expiry, or proxy behaviour changes.
- Token-economy optimisation beyond the $defs measurement the
  advertisement gate may name — the token-economy plan owns that
  surface.
- The v2 SDK migration spike (MCP-506): do not open the port while the
  carrier is mid-landing; it replaces the registration API this plan
  feeds.
