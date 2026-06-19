# ADR-196: Graph Substrate Migration — One Replacement Unit per Tool

**Status**: Accepted. Owner-ratified 2026-06-02 as the scope clause of
`graph-estate-consolidation.plan.md`
Judgement call 4; executed and validated in full via Track-G of
`graph-tools-value-redesign.plan.md`
(2026-06-10/11); recorded as an ADR 2026-06-11.
**Date**: 2026-06-11
**Related**:
[ADR-173](173-graph-stack-topology.md) — the graph-stack topology the tools migrate onto
(`graph-corpus-sdk` as the corpus-adapter layer; real-operations-only query contract);
[ADR-195](195-graph-tools-first-class-tool-category.md) — graph-tool category doctrine, accepted in the same consolidation pass as this ADR.

## Context

Three whole-corpus graph MCP tools (`get-misconception-graph`, `get-prior-knowledge-graph`,
`get-thread-progressions`) predated the graph substrate. Each returned its entire generated corpus
with no scoping input, and each rested on a loose generated-data shape: generated JSON plus a
**hand-written** TypeScript interface file (`types.ts`) maintained in parallel to the generated
data. The substrate (ADR-173) landed with the EEF strands corpus as its first consumer, and the
question became how the existing tools move onto it.

Two failure modes were named when migration ownership was settled (owner-ratified 2026-06-02,
Judgement call 4 of the graph-estate consolidation):

- **Scattered, gapped per-tool migration ownership** — an orphaned tool silently breaking the EEF
  value path, which is why a single migration plan owns _all_ the tools and stands as the single
  upstream of the EEF re-validation gate.
- **Partial migrations** — a tool's data re-emitted without its rewrite, or a schema authored
  before the shape it describes exists, leaving hand-maintained parallels and speculative
  contracts in the tree.

## Decision

**Per migrated tool, the migration is one replacement unit.** Three things land together:

1. **Data/type re-emission** — the generated data becomes its own type authority: the generator
   (`vocab-gen`) emits the tool's corpus with types computed from the extracted data at
   generation time (ADR-031), and the tool's hand-written `types.ts` is deleted in the same unit.
   No hand-maintained type parallel to a generated corpus survives the unit.
2. **The tool rewrite onto the graph corpus substrate** — bounded, anchored retrieval over the
   one-graph corpus in `graph-corpus-sdk` (per-view construction, or an ordered corpus projection
   where sequence order is the value), replacing the whole-corpus return.
3. **That tool's projection-derived `outputSchema`** — the schema authority is derived from the
   migrated tool's real projection of the generated data, never hand-authored and never
   speculative.

Two corollaries are part of the decision:

- **A tool's schema arrives when the tool is built or rebuilt, never before.** The delivery
  vehicle for the MCP wire field was refined by the owner on 2026-06-08
  (`output-schemas-for-mcp-tools.plan.md`
  §Resolved Sequencing): no migrated unit ships an MCP `outputSchema` (protocol-valid — the field
  is optional); the wire declaration is composed uniformly for **every** tool by the
  output-schemas plan, explicitly gated on the migration having landed, over each tool's
  post-migration source-derived payload Zod. The refinement changes where the wire field is
  wired, not the invariant: every schema is authored against the real post-rebuild
  `structuredContent`, and nothing schema-shaped precedes its tool.
- **Existing tools are untouched before their migration.** Each tool keeps working exactly as it
  does today until its own unit lands — the EEF value proof ran on the unmigrated tools as-is;
  _scaling_ that value is what the migration owns. During the window between units, a prompt
  clause naming an unmigrated tool keeps instructing the whole-corpus form until that tool's unit
  rewrites it.

As executed, the unit is also **surface-cohesive**: one unit moves the tool's whole surface at
once — the tool and its anchor input schema, the removal of its whole-corpus `curriculum://`
resource (no bounded form exists for a static resource), anchor-threading rewrites of the prompt
steps that name it, its non-tool consumers, and that landing's `eef-revalidation` signal.

## Consequences

**Positive**:

- No orphaned tool and no half-migrated state: at every commit each tool is either fully on its
  old shape or fully on the substrate, and the EEF re-validation gate has exactly one upstream.
- The generated data is the only type authority once a unit lands; the hand-written interface
  files are gone, and `pnpm sdk-codegen && pnpm build` reproduces the tree.
- Schemas are truthful by construction: derived from the real post-migration projection, so the
  later uniform `outputSchema` composition pass has a real shape for every tool.
- Staged per-tool replacement is protocol-safe by construction: the transport is stateless per
  request (ADR-112), so each connection re-discovers the current tool and resource surface.

**Negative / cost accepted**:

- Each unit is a deliberate behaviour break for callers of the old form (zero-argument →
  required anchor; replace-don't-bridge, no aliasing or deprecation step). The mitigation is the
  tool description carrying the anchor contract.
- During the migration window, migrated and unmigrated tools coexist with different retrieval
  contracts. Accepted: the window is bounded by the settled landing order, and the
  untouched-before-migration rule keeps the unmigrated side fully functional.
- Migrated tools run without an MCP wire `outputSchema` until the output-schemas plan's uniform
  composition pass — accepted as protocol-valid and as the price of one mechanism schema-ing all
  tools at once, with no tool as a special case.

## Execution record (Track-G — the validation evidence)

Executed 2026-06-10/11 under `graph-tools-value-redesign.plan.md`, one replacement unit per tool:

- **G1 — prior-knowledge** (named two-PR split-permission, foundation + view): PR #153 — the
  one-graph corpus emission with materialised kind-qualified ids, the `./graph-corpus` subpath,
  the hand-written prior-knowledge `types.ts` deleted, and the ADR-086 amendment in the same
  commit; PR #161 — the anchored `unitSlug[]` + depth tool, `curriculum://prior-knowledge-graph`
  removed, prompts anchor-threaded, `eef-revalidation` signal raised.
- **G2 — misconception**: PR #163 — chain re-projection with the content-hash mint rule, the
  anchored lesson/unit/thread tool, the hand-written misconception `types.ts` deleted,
  `curriculum://misconception-graph` removed, signal raised.
- **G3 — thread-progressions**: PR #164 — the ordered corpus projection as its own real
  operation, the anchored tool, `curriculum://thread-progressions` removed, the whole-corpus
  resource factory deleted with its last consumer, signal raised. Follow-on PR #165 cured a
  falsified within-thread-ordering premise the unit surfaced (year-axis re-chain).
- **G4 — bounded keywords** (the same unit shape applied to a new tool): PR #158 kept and
  disambiguated the generated live-API `get-keywords` (never replaced); PR #173 landed
  `get-keyword-graph` as one unit — keyword emission into the corpus, the bounded
  frequency-ranked view, and the tool together.
- **Validation**: every landing raised its `eef-revalidation` signal; the downstream re-proof
  executed (PR #177) with the verdict that the EEF value path is **intact** on the anchored
  tools. All three pre-existing whole-corpus tools are anchored and bounded on the one-graph
  corpus, with no whole-corpus path remaining.
