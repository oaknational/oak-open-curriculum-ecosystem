---
title: "EEF graph tool completion - impact-led rebuild plan"
status: current
lane: current
type: executable
thread: eef
date: 2026-05-30
owner_scope: >-
  Restructured 2026-05-30 after a full session of owner metacognition and
  correction. The plan's purpose is to CHANGE SHAPES to correct fundamentally
  incorrect earlier decisions, not to minimise edits to what already exists.
  Existence, commitment, or established-doctrine status is zero evidence of
  correctness; the default move on an inherited shape is to replace it with the
  correct shape, not to relax, preserve, or hold it as an open question. The
  teacher value contract is the design root (the why); the doctrine fix and the
  typed corpus foundation are execution-independent of value and sequence first -
  the corpus is a fixed `as const` constant and the external-data validator gate
  is currently red. The operative axis throughout is KNOWN vs UNKNOWN data, not
  external vs internal. Because every datum in this system is either a known
  constant or a value drawn from a known finite vocabulary, there is no Zod
  anywhere in the EEF work EXCEPT the single MCP tool output schema, and no runtime
  parsing of the corpus or any input. ADR-175 (a little-used plan-promotion
  safeguard, mis-implemented as a freshness gate in code) is withdrawn and its code
  removed; the plan also decontaminates the wider estate (ADRs, other plans, code
  comments) of references to the discarded positions. Implementation must preserve
  the corpus's `as const` type information end to end.
todos:
  - id: d0-fixed-data-doctrine
    content: "DOCTRINE + ESTATE DECONTAMINATION (non-code; greens the red repo-validators gate). (1) Generalise ADR-038 in-record to any fully-known compile-time constant annotated `as const`, grounded in the known-vs-unknown first principle, the `unknown-is-type-destruction` rule, and ADR-034; cite the EEF corpus as the worked instance; no plan paths in ADR text; carry a dated amendment note. (2) ADR-153 is the home of the key-narrowing predicate; ADR-028 is corroborating prior-art ONLY (a pragmatic MVP deferral with open reconsideration triggers, not a categorical no-Zod ruling). (3) Correct ADR-157 surgically in-record (Proposed/demoted): replace BOTH EEF Zod clauses (the Typing Discipline row and the Trade-offs sentence) with the `as const` derivation; do NOT mark the whole ADR superseded. (4) Correct ALL THREE ADR-173 Zod-loader locations (amendment summary, First-wave ingestion item, Consequences bullet) to the typed direct-load. (5) ADR-175: TIGHTEN to remove the code-implying ambiguity (it was a plan-promotion safeguard only, never a runtime or code gate), THEN mark it WITHDRAWN; remove its two README index entries and the ADR-157 cross-reference; the freshness CODE removal lands in D5. (6) Do NOT edit ADR-032/003 (correct as written); the vocabulary contrast lives in the ADR-038 amendment. (7) EXPUNGE the `data-export-must-be-unknown` and `no-unknown-data-export` rules ENTIRELY — rule code, the `ExternalDataRule` union members, the module contract docstring, AND the unit tests that exercise them — and add a test proving an `as const` export yields zero violations; keep `logic-export-forbidden` + `missing-provenance-docstring`. (8) Run the estate-decontamination sweep + disposition ledger (see the Estate Decontamination section). Greens the red repo-validators gate."
    status: pending
    depends_on: []
  - id: d1-value-impact-contract
    content: "Explore and owner-ratify the teacher value/impact contract: the Sunday-night cover-lesson use case, the assistant's role, the evidence-preservation obligations, the non-claims, and the smallest round trip that proves value. Exploration deliverable; output is a ratified value statement and testable success criteria."
    status: pending
    depends_on: []
  - id: d2-typed-corpus-foundation
    content: "Build the typed corpus substrate from EEF_TOOLKIT_DATA: derive EefStrand (= (typeof EEF_TOOLKIT_DATA.strands)[number]), EefStrandId, EefKeyStage, EefPriority, EefToolkitData via typeof/indexed-access; derive EefPhase from the strand `by_phase` keys (NOT the wider school_context_schema phase enum, which carries post_16/all_through/special that no strand uses); build the StrandByStrandId keyed lookup, the id-to-node lookup, the related_strand edge collection, and metadata; implement isValidStrandKey backed by the id-to-node lookup, with a named unit test (true for every real corpus id; false for a typo'd id, empty string, and a non-string). From school-context.ts delete ONLY the Zod schemas + drift guard; RETAIN its `as const` vocabulary arrays (EEF_PHASES/EEF_PRIORITIES/EEF_KEY_STAGES) and the type aliases selection.ts/types.ts import (re-home them into this module and update importers, or leave them as the vocabulary home). Delete strand-schema.ts entirely. Relocate and export strandById/StrandByStrandId/Strand/lastUpdated out of the .external-data.ts file into this checked module. Test migration is SPLIT: structural-traversal tests keep synthetic purpose-built fixtures (real corpus ids are unique, so DuplicateStrandId cannot fire through the typed API and pinning corpus literals creates change-detectors); only corpus-grounded tests (key membership, vocabulary) use real members. `pnpm type-check` must be green immediately after D2 lands. Brought forward; depends only on D0 and the corpus."
    status: pending
    depends_on: [d0-fixed-data-doctrine]
  - id: d3-mcp-tool-resource-contract
    content: "Design, verify, and owner-ratify the MCP tools/resources surface from the D1 value contract, expressed in D2's derived types: tool/resource names, descriptions, input shapes, output shapes, tool-vs-resource boundary, assistant interaction order, and when to use/avoid EEF. The output-schema rule: a SINGLE Zod-4 call over a structure derived directly from the fixed EEF data (the same data-backed mapper that builds the payload) - the installed SDK accepts only a Zod schema for outputSchema and runtime-validates structuredContent against it. Inputs are narrowed by constant-derived predicates, NOT Zod. Confirm the installed MCP SDK + curriculum MCP app registration shapes: outputSchema is Zod-only, isError:true bypasses output validation, plus resources/resource templates and structuredContent-only results."
    status: pending
    depends_on: [d1-value-impact-contract, d2-typed-corpus-foundation]
  - id: d4-graph-capability-contract
    content: "Derive the correct graph capability shape from D3, treating the existing graph-core GraphView query contract (7 ops: manifest + 6 fallible; 2 live, 5 NotImplementedYet) as input to be reshaped, NOT a fixed foundation. Define the graph operations the ratified MCP surface consumes; reshape graph-core's query surface to those concrete operations, replacing the premature stubbed polymorphic interface. The reshaped graph-core contract MUST stay domain-generic (parameterised over TNode/TEdgeType; no EEF- or MCP-specific type names) - EEF-specific shapes live in graph-corpus-sdk, never in the substrate. Record the consumer-impact finding as a HARD gate before the interface changes land (verified: graph-ingest/graph-project use only the RDF substrate, the threads adapter is an empty stub - blast radius zero); an architecture reviewer signs it off. Delete the speculative rank/explain/compare corpus ops. Enumerate which graph-view exports (e.g. SubgraphResult) are deleted/renamed/retained so D6 can resolve its imports. Specify subgraph membership, frontier references, request errors, and nested filtering only where D3 requires them."
    status: pending
    depends_on: [d3-mcp-tool-resource-contract]
  - id: d5-graph-construction-methods
    content: "Construct the EEF graph object over D2's substrate and implement the D4-ratified graph operations. Replace loadEefCorpus with the pure infallible typed constructor and remove the loader path entirely. WITHDRAW the freshness apparatus in full: delete freshness.ts, checkFreshness, DEFAULT_THRESHOLD_DAYS, the Freshness* types, freshness.unit.test.ts, the loader.ts binding + freshness tests, the package index re-exports, and every ADR-175 code reference. Delete every NotImplementedYet stub and the list-era response cap (response-budget.ts) unconditionally. Surface source attribution and caveats as additive provenance on the subgraph envelope (teacher value, not a freshness obligation) without flattening per-strand evidence fields; whether last_updated is shown is the D1 value-contract's call. Co-land replacement tests: a pure-constructor test over the real corpus and a provenance-on-envelope test."
    status: pending
    depends_on: [d2-typed-corpus-foundation, d4-graph-capability-contract]
  - id: d6-mcp-factory-eef-surface
    content: "Build the MCP graph factory in the curriculum consumer layer and register the ratified EEF tool/resource surface behind OAK_CURRICULUM_MCP_EEF_ENABLED with structuredContent-only tool results. The tool OUTPUT schema is a SINGLE Zod-4 call over a structure derived directly from the fixed EEF data (the same data-backed mapper that builds the payload) - the only Zod in the system (Decision 2); tool INPUT is narrowed by constant-derived predicates with no Zod; error returns use isError:true so the SDK skips output validation. Update the EEF prompt; replace the superseded list-shaped eef-explore-evidence-for-context implementation (projection.ts, response-budget.ts, dual content, citation revalidation, and the Zod schemas in tool-definition.ts/validation.ts) with the graph surface, and delete citation-shape.ts at evidence-corpus/citation-shape.ts (one level above the tool dir - verify no other tool imports it first). The factory must not import MCP types into substrate packages (ADR-179) - an explicit acceptance check. Preserve flag co-gating of tool, resource, and prompt."
    status: pending
    depends_on: [d4-graph-capability-contract, d5-graph-construction-methods]
  - id: d7-teacher-value-round-trip
    content: "Prove the Sunday-night cover-lesson value path through MCP end to end: an agent uses Oak curriculum tools plus the EEF graph tools/resources to assemble evidence-enhanced lesson material with EEF caveats and provenance preserved, verified against INDEPENDENT ground truth (a known strand's exact corpus values - caveat text, evidence strength, cost, impact - appear verbatim in the payload, not merely that the fields are present); capture telemetry for the EEF graph path; pnpm check green on a settled tree."
    status: pending
    depends_on: [d6-mcp-factory-eef-surface]
---

# EEF graph tool completion - impact-led rebuild plan

## Remediation Context - Read This First

This plan is remediation for compounded mistakes - mistakes built on mistakes. A
small number of incorrect concepts were adopted early and then repeated across
many substrates and levels of the repo, each layer reinforcing the last:

- external-origin data was conflated with unknown-shape data, so a fully-known
  `as const` corpus is treated as untrusted input that must be validated;
- that single conflation is now encoded in the corpus file's expected typing, a
  Zod strand-schema, a Zod freshness loader, the `validate-external-data-files`
  validator rules, and ADRs 157 and 173 (ADR-175 is a separate matter - a
  little-used plan-promotion safeguard, mis-implemented as a freshness *gate* in
  code, now withdrawn; ADR-032/003 are correct as written);
- the evidence was modelled as a ranked, capped LIST rather than a graph, so a
  response-budget cap and projection logic stand in for graph scoping;
- a generic graph query interface was generalised ahead of any second consumer,
  shipping five stubbed operations as if built;
- the node type was re-established as a hand-normalized, Zod-inferred interface,
  discarding the exact per-strand types the constant already proves.

Because the same wrong concepts recur in so many places, the dominant risk is
**drift**: fixing one surface in a way that quietly re-states the mistake
somewhere else, or accommodating an inherited shape because it exists rather than
replacing it. Keep a firm handle on what we are doing and why. The correct
concepts are fixed in the Ratified Decisions below; every inherited shape - file,
schema, validator rule, interface, ADR, tool - is checked against those concepts
and replaced where it embodies the mistake. Existence, commitment, or
established-doctrine status is never evidence of correctness. Do not soften,
preserve, or defer a wrong shape; replace it.

A further consequence drives an explicit scope item. The wrong concepts are
written into surviving ADRs, other plans, archived artefacts, and dozens of code
comments (the `gate-1a`/`gate-1b` framing - removed sessions ago but never swept
from comments - plus freshness/ADR-175, Zod-over-corpus, and the list-tool).
Until each is corrected or deleted it keeps dragging execution back toward the
wrong position; this exact effect mis-led the readiness review itself, where a
stale `gate-1b` comment in `freshness.ts` was briefly taken as a live obligation.
The plan therefore carries an explicit Estate Decontamination sweep - leaving a
contaminated reference live is itself the drift the plan exists to stop.

## Metacognition Verdict

The inherited plan began too close to the existing broken tool and worked
backwards toward value; that is the wrong centre of gravity. The corrected
centre of gravity is the teacher: a teacher under time pressure asks an AI
assistant to assemble useful Oak lesson material, and the assistant enriches its
choices with relevant EEF evidence while preserving the uncertainty, provenance,
and caveats that make the evidence honest.

There is a second, deeper correction this plan must hold against itself. The
prior drafts of this plan repeatedly reached for the smallest edit that
preserved an inherited structure - softening a wrong validator rule instead of
deleting it, preserving a Zod role in a system with no unknown-shape data,
treating the committed `graph-core` query interface as a fixed foundation,
holding a list-era response cap as an open question. That reflex - treating
"it exists / it is committed / it is established doctrine" as evidence of
correctness - is exactly how fundamentally wrong decisions survive. **The default
move on every inherited shape in this plan is to replace it with the correct
shape.** Existence is zero evidence of correctness. The discipline is to reshape
to the correct shape, not the maximally-demolishing one: graph-core's shared RDF
substrate is genuinely multi-consumer and stays; its stubbed query contract is
premature and is replaced. Scrutiny, not blanket demolition, and never
conservation-by-default.

Two orderings are both true and must not be confused:

```text
design / runtime path:  teacher -> AI host -> MCP tools/resources -> graph methods -> typed corpus
```

```text
execution path:         fixed corpus + doctrine fix -> typed foundation -> graph object -> MCP surface -> teacher value
```

The design narrative is value-first: value is the root that justifies the MCP
surface, which justifies the graph methods. The execution order is not forced to
follow it. The doctrine fix and the typed corpus foundation depend only on the
fixed `as const` corpus, so they are brought forward and run in parallel with
value exploration. The validator gate is red now, which makes the doctrine fix
the first thing to land. This eliminates the backward-dependency fault in the
prior structure (where "derive the types" sat after the contracts that consume
the types).

## Ratified Decisions (decision-complete; do not re-open in execution)

These were settled with the owner across the 2026-05-30 session. Execution
applies them; it does not re-litigate them. Genuinely remaining exploration is
isolated to D1, D3, and D4 and is named there as explicit steps.

1. **The axis is known vs unknown, not external vs internal.** "External"
   (origin) and "unknown" (shape not known at authoring time) are orthogonal.
   The EEF corpus is external-origin **and** known-shape. Known-shape data is
   derived from; genuinely-unknown-shape data is narrowed at its boundary. There
   is no contest between these - they are two arms of one principle.

2. **No Zod anywhere in the EEF work, except the single MCP tool OUTPUT schema.**
   Zod's job is parsing unknown *structure*.
   This system has no unknown structure: the corpus is a known constant, and every
   external input is a *value drawn from a known finite vocabulary* (a strand key,
   a key stage, a subject). Narrowing a value into a known set is a membership
   *predicate* (`value is T`, the ADR-153 house pattern; ADR-028 is corroborating
   prior-art only). The repo's validate-unknown doctrine (ADR-032/003) governs
   genuinely-unknown *structure* elsewhere; this system has none. Every Zod schema
   that PARSES or VALIDATES the corpus is removed - `strand-schema.ts`, the
   `school-context.ts` schemas and drift guard, the `loader.ts` `safeParse`, and
   the MCP-side input/citation schemas (`tool-definition.ts`, `validation.ts`,
   `citation-shape.ts`). Tool INPUT is narrowed by constant-derived predicates,
   never Zod. **The sole exception is the MCP tool OUTPUT schema.** The installed
   SDK (`@modelcontextprotocol/sdk` v1.29, Zod 4) accepts only a Zod schema for
   `outputSchema` and runtime-validates the tool's `structuredContent` against it,
   so an output schema MUST be Zod. It is a single Zod-4 call over a structure
   derived DIRECTLY from the fixed EEF data (the same data-backed mapper that
   builds the payload) - a vendor-required *declaration* built from the known
   data, not a parse of unknown structure and not a hand-authored parallel schema.
   This is the one bounded place Zod appears in the system.

3. **The `data-export-must-be-unknown` validator rule is an error and is
   expunged.** It is not softened into "`: unknown` or `as const`"; it is deleted
   outright, together with its sibling `no-unknown-data-export`. A data file's
   job is to hold data; whether a consumer treats that data as known or narrows
   it is expressed at the consumer boundary, never by mandating the data export's
   type annotation. The `*.external-data.ts` convention exists only to exclude a
   large faithful data literal from Sonar duplication detection and ESLint; the
   two rules that survive - `logic-export-forbidden` (logic in a gate-excluded
   file is genuinely unsafe) and the provenance-docstring rule - are sound and
   retained. There is exactly one `.external-data.ts` file in the repo (the EEF
   corpus), so this deletion has zero blast radius.

4. **The node type is derived from the constant; the union question is closed.**
   `EefStrand = (typeof EEF_TOOLKIT_DATA.strands)[number]` - the precise union of
   the exact per-strand literal shapes. The current `z.infer<EefStrandSchema>`
   normalized interface is the forbidden hand-authored parallel schema and is
   removed. There is no "union vs normalized" choice: the exact structure is
   known, so we use it. A hand-normalized node interface that flattens the exact
   shapes into one lossy shape is forbidden.

5. **The only unknown in the whole system is the key.** A key may arrive as an
   arbitrary external string. `isValidStrandKey(value): value is EefStrandId`
   (ADR-153 house pattern, backed by id-to-node membership) is the single
   narrowing in the system. A known literal key indexes `StrandByStrandId[Id]`
   to its exact single strand; the keyed lookup is total over the fixed key space
   and cannot miss. The union appears only as the residual static type of a
   validated-but-not-yet-pinned key, handed straight back, never widened or
   normalized. One unknown - the key; one narrowing - the key; everything
   downstream of a known key is exact.

6. **The existing `graph-core` query contract is input to be reshaped, not a
   fixed foundation.** Its committed `GraphView<TNode, TEdgeType>` - 7 ops
   (manifest + 6 fallible); 2 live (manifest, subgraph), 5 returning
   `NotImplementedYet`, polymorphic ahead of a second consumer - is premature
   generalization (PDR-058: a shape opened to a second consumer before one
   existed), and is not treated as correct because it exists. The live blast
   radius is zero: graph-ingest and graph-project consume only the RDF substrate,
   and the threads adapter is an empty stub. D4 derives the correct graph query
   shape from the ratified MCP surface and reshapes graph-core to it. graph-core's
   shared RDF substrate (term/dataset/jsonld/canon) is genuinely multi-consumer
   and is not in question; only the stubbed query contract is reshaped, after
   recording the consumer-impact finding.

7. **There is no response cap; graph scope is the bound.** The
   `response-budget.ts` cap (rank everything, cut to 12 strands for a token
   budget) is a remnant of the wrong list approach and is removed unconditionally.
   A graph returns a scoped subgraph; its bound is graph structure (rootIds,
   depth, membership). An oversized result is a scoping bug in the query, fixed by
   correcting the scope, never by capping or truncating output.

8. **ADR-038 is generalised, not duplicated.** ADR-038 (Compilation-Time
   Revolution, Accepted and Implemented) already is the compile-time-construction
   doctrine, scoped to "validation logic extracted from the OpenAPI schema." It is
   amended to cover any fully-known compile-time constant, including
   repository-held fixed corpora annotated `as const`, grounded in the existing
   `unknown-is-type-destruction` rule and ADR-034 (which already forbid replacing
   a known type with `unknown` and name `as const` as the correct narrowing - the
   exact doctrine the expunged validator rule contradicts). No net-new umbrella
   ADR is authored.

9. **No backward dependencies; pure typed infallible ingest; freshness is
   WITHDRAWN.** Types are fixed in the foundation (D2) and flow forward. The ingest
   is a pure typed construction step: the Zod parse, the fallible loader variants,
   and the **entire freshness apparatus** are removed. Freshness was never an
   ADR-175 *code* requirement - ADR-175 was a plan-promotion safeguard with no
   bearing on any code, it is of little use, and it is WITHDRAWN. `freshness.ts`,
   `checkFreshness`, `DEFAULT_THRESHOLD_DAYS`, the `Freshness*` types, the
   `loader.ts` binding, the freshness tests, the package re-exports, and every
   ADR-175 code reference are deleted (D5); ADR-175 is tightened-then-withdrawn
   (D0). Construction is infallible for data-shape purposes; only a genuine
   external request (an unknown key) can fail, at the request boundary. Source
   attribution and caveats travel with the evidence as TEACHER VALUE (D1), not as
   a freshness or governance obligation; whether `last_updated` is surfaced is a
   D1/D3 value-contract choice with no tie to ADR-175.

10. **Contaminated documentation is corrected or deleted, never left live.** The
   wrong concepts are not confined to this plan's targets - they are written into
   surviving ADRs, other plans, archived artefacts, and dozens of code comments
   (the `gate-1a`/`gate-1b` framing, freshness/ADR-175, Zod-over-corpus, the
   list-tool, the normalized node interface). Each live reference drags execution
   back toward the wrong position. Every contaminated reference gets a recorded
   disposition - correct, delete, or covered-by-a-named-deliverable - and the
   acceptance is a clean estate sweep (see the Estate Decontamination section).

## Value And Impact

Teacher-facing value is the root of this plan. The graph and MCP layers are
delivery mechanisms; they are correct only if they make the assistant better at
the cover-lesson job without hiding uncertainty or inventing evidence.

When this plan is complete, an AI assistant in an MCP-capable host (ChatGPT,
Claude Desktop, Gemini, etc.) can help a teacher:

- find or assemble relevant Oak lesson material for a specific subject, key
  stage, and topic;
- ask for relevant EEF evidence when pedagogical choices need grounding;
- receive a scoped EEF subgraph instead of an inert full-corpus dump;
- inspect any returned EEF strand as a full typed evidence node;
- traverse from a returned strand to related evidence when the relationship
  matters;
- preserve EEF attribution, caveats, evidence strength, cost, and impact in the
  material it drafts for the teacher.

The teacher experiences practical help under time pressure: usable cover
material, clearer pedagogical choices, transparent evidence caveats. The teacher
never needs to know a graph exists.

The first concrete scenario is a teacher preparing cover material on Sunday night
for a Monday lesson because another teacher is unexpectedly absent. The teacher
trusts Oak's materials and wants the assistant to adapt or assemble them,
enhanced by EEF evidence, not replaced by generic pedagogical advice.

## Known-vs-Unknown Doctrine (the operative axis)

The whole plan turns on one distinction, and a corollary about this system in
particular.

- **Known data** - shape known at authoring time. The EEF corpus
  (`EEF_TOOLKIT_DATA`, `as const`) and codegen-manufactured constants. The
  constant is its own type authority; the data is the schema. Derive aliases,
  vocabularies, keyed lookups, and output shapes from it with `typeof`, indexed
  access, and mapped types. Never validate, parse, freshness-gate, or retype it
  to `unknown`.
- **Unknown data** - shape not known until runtime; narrowed at its boundary.

The corollary that holds for this system specifically: **every boundary here
narrows a value into a KNOWN FINITE SET** - a strand key, a key stage, a subject,
a priority, all derived from the constant. Narrowing into a known set is a
type-guard predicate (`value is T`, ADR-153), not a schema parse. There is no
datum of genuinely unknown structure anywhere in this system, so there is no Zod
*parsing* anywhere in it - Zod's job, parsing data of unknown structure, has no
instance here. The one exception is not a parse at all: the MCP tool OUTPUT schema
is a single Zod-4 *declaration* the SDK requires to validate the tool's own
`structuredContent` (Decision 2). This is not a stylistic preference; it follows
from the nature of the data.

Schema-first scoping: schema-first derivation (`z.infer` from the OpenAPI schema)
governs the **unknown** upstream API surface elsewhere in the repo. For this
system, the `as const` constant is the schema - "types flow from schema" is
satisfied with the data-as-schema, and runtime narrowing is by predicate.

Forbidden everywhere in this system: `unknown` at the fixed-data boundary; Zod
parsing or validation of corpus data (the SOLE permitted Zod is the single
output-schema declaration of Decision 2); any freshness gate over the corpus
(ADR-175 withdrawn); type assertions that "recover" a shape the constant already
has; hand-authored or Zod-inferred parallel/normalized schemas; response caps or
rank-and-cut over graph results.

## Estate Decontamination (cross-cutting)

The discarded positions are written across the estate, not just this plan's
targets. Until each reference is corrected or deleted it keeps dragging execution
back (Ratified Decision 10) - the readiness review itself was briefly mis-led by a
stale `gate-1b` comment. This is a sweep + disposition ledger, not a guess: every
hit for the contaminated concepts gets a recorded disposition (correct / delete /
covered-by-a-named-deliverable).

**Core defect - the `data-export-must-be-unknown` rule.** It, and its twin
`no-unknown-data-export`, mandates that the `as const` corpus be typed `unknown` -
the exact thing `unknown-is-type-destruction` / ADR-034 forbid, and the red gate
currently pressuring the wrong shape. It is the root artefact; **every** reference
is deleted or corrected:

- `agent-tools/src/external-data/external-data-contract.ts` - the two
  `ExternalDataRule` union members (l.47-48), the emit sites (l.173, 216-218), the
  module docstring asserting "MUST export ... typed `unknown`" (l.26), and the
  `: unknown` comments (l.147). DELETE the two rules; KEEP `logic-export-forbidden`
  and `missing-provenance-docstring`. [D0]
- `agent-tools/src/external-data/external-data-contract.unit.test.ts` - the rule
  tests (l.83, 91, 97, 186, 218, 222) and the "`: unknown` data export" framing
  (l.16, 29). DELETE/UPDATE; add an `as const`-passes-clean test. [D0]
- `docs/governance/sonar-disposition-policy.md` (l.355) - "file MUST export its
  data typed `unknown` (validated at a loader boundary)". CORRECT: the
  `*.external-data.ts` convention survives for Sonar/ESLint duplication-exclusion
  and the no-logic + provenance rules; the `unknown`-typing and loader-validation
  requirement is deleted. [D0]

**Sweep tokens** (the discarded concepts; `rg` each, disposition every live hit):

- `data-export-must-be-unknown`, `no-unknown-data-export`, "must export ... unknown"
- `gate-1a`, `gate-1b` - ~14 stale comments in the EEF SDK code + the
  prompt-messages file (removed/corrected when D5/D6 rewrite those files). The
  estate-wide gate-1a/1b framing in the graph plans is owned by
  graph-estate-consolidation.plan.md, not this plan.
- `freshness`, `checkFreshness`, `DEFAULT_THRESHOLD_DAYS`, `ADR-175`, `180-day` -
  freshness apparatus + ADR-175 (code deleted in D5; ADR/doc refs in D0)
- `EefStrandSchema`, `EefToolkitSchema`, `z.infer<...Strand`, `strand-schema` -
  Zod-over-corpus (deleted in D2)
- `response-budget`, `capForBudget`, `projectExploreNode` - list-era cap (D5/D6)
- the speculative `EvidenceCorpus` `rank`/`explain`/`compare` ops (D4)
- stale STRUCTURAL references to the quarantined design docs - their deliverable
  numbers ("rebuild D2/D6"), principle numbers ("foundation principle N"), and the
  "rebuild" / "rebuild foundation" framing. These use clean vocabulary but point at
  dead structure and mis-navigate agents (e.g. "removed in rebuild D2" sends an
  agent to the live plan's D2 - the typed-corpus foundation - not the op removal in
  D4). A concept-token sweep alone misses these; adjacent plans need a content read.

**Surface -> owning deliverable.** Code in files slated for deletion is covered by
its deliverable (D2 strand-schema/school-context Zod; D5 freshness/loader/cap; D6
list-tool/citation-shape; D4 EvidenceCorpus ops). Surviving code with contaminated
comments is corrected by the deliverable that owns the file. Non-code surfaces are
corrected directly in D0: the ADRs; `docs/governance/sonar-disposition-policy.md`;
`sector-engagement/roadmap.md`; and the EEF thread record's CURRENT-TRUTH banner.
The two old design docs (the rebuild plan and its foundation) are **quarantined**
in `archive/` with every live link severed (2026-05-30) - they are symptoms of the
superseded broken concept, not artefacts to correct, and nothing live points at them.

**Scope: the EEF stack only.** This decontamination owns the EEF graph stack - the
EEF SDK code (including its own `gate-1a`/`gate-1b` comments, removed when D5/D6
rewrite those files), the EEF plan/docs/README, the validator, and references to
the quarantined EEF design docs. The wider graph estate - `gate-1a`/`gate-1b` across
the graph plans, and the disposition of the structurally-gate-based, fully-
contaminated coordination plans (`graph-mvp-arc`, `graph-portfolio-index`,
`graph-combinatorial-arc`) - is owned by **`graph-estate-consolidation.plan.md`**,
the nominated master plan for all graph-related consolidation, decontamination, and
rewriting. The EEF work and the graph work are one body of work in spirit; these are
two plans with distinct, non-overlapping scopes so nothing falls through.

**Knowledge preservation.** Superseded *history* (the thread record's marked
superseded sections, archived plans, the napkin and comms log) is NOT rewritten -
it is preserved as the record of what was wrong and why (`knowledge-preservation`
rule). Only LIVE guidance - anything an agent reads as a current instruction - is
corrected or deleted. The ledger records each history reference as
`history-retained`.

**Acceptance.** The disposition ledger is complete (every hit recorded), and a
final sweep returns zero LIVE references to the discarded concepts (history and
changelog excluded). The ledger is the proof nothing was silently dropped.

## Deliverables

Deliverables are ordered for execution, with `depends_on` capturing true
dependencies. D0, D1 have no prerequisites and may run in parallel; D2 (the
brought-forward foundation) depends only on D0. Product-code deliverables are
TDD landings - test and product code co-land in one commit. Contract
deliverables (D1, D3, D4) are exploration-and-ratify work with `non-code` proof.

### D0 - Fixed-data doctrine + validator expunge + estate decontamination (tree-green-first)

**Purpose:** correct the known-vs-unknown doctrine across the ADR estate, expunge
the erroneous external-data validator rules, and decontaminate the wider estate of
references that embody the discarded positions. Sequenced first because
`pnpm repo-validators:check` is red on the committed branch and because the
contaminated docs otherwise drag every later deliverable back.

**Do - ADR doctrine:**

- Amend **ADR-038** in-record to generalise compile-time construction from "the
  OpenAPI schema" to any fully-known compile-time constant, including
  repository-held fixed corpora annotated `as const`. Ground it in the known-vs-
  unknown first principle, the **`unknown-is-type-destruction`** rule, and
  **ADR-034** - which already forbid replacing a known type with `unknown` and
  name `as const` as the correct narrowing. Cite the EEF corpus as the worked
  instance (a type expression, no plan path). Carry a dated amendment note. House
  the ADR-032/003 vocabulary contrast here (external != unknown), cross-referencing
  ADR-032/003 as governing the genuinely-unknown case.
- Back-reference **ADR-153** as the home of the key-narrowing predicate pattern.
  Cite **ADR-028** as corroborating prior-art ONLY - it is a pragmatic MVP Zod
  deferral with open reconsideration triggers, not the governing authority; the
  governing authority is the known-vs-unknown first principle.
- Correct **ADR-157** surgically in-record (it is Proposed/demoted): replace BOTH
  EEF Zod clauses - the Typing Discipline row ("Typed interfaces with Zod
  validation at load time") and the Trade-offs sentence ("Zod validation at load
  time mitigates this for static data (EEF)") - with the `as const` typed-
  derivation direction pointing at the generalised ADR-038. Do not mark the whole
  ADR superseded (ADR-038 does not cover its ontology/URI content). Remove its
  cross-reference to ADR-175 (withdrawn).
- Correct **ADR-173** (graph-stack-topology) in ALL THREE places the Zod-loader
  designation appears - the amendment-summary header, the First-wave ingestion
  scope item, and the Consequences positive bullet - to the typed direct-load
  (no Zod, no separate schema file), keeping the "corpus-local / no graph-ingest
  participation" structural facts intact.
- **ADR-175** was a plan-promotion safeguard with no bearing on any code, and of
  little use. First TIGHTEN it to remove the code-implying ambiguity (state
  plainly it gates plan promotion only, never runtime or code), THEN mark it
  **WITHDRAWN**. Remove its two README index entries (`docs/architecture/README.md`
  and the ADR index) and the ADR-157 cross-reference. The freshness CODE removal
  lands in D5.
- Do NOT edit **ADR-032/003** - they are correct as written (they validate
  genuinely-unknown *structure*); their only gap was a vocabulary note, now housed
  in the ADR-038 amendment, not inside those repo-wide ADRs.

**Do - validator expunge:**

- **Expunge** the `data-export-must-be-unknown` and `no-unknown-data-export`
  rules from `agent-tools/src/external-data/` ENTIRELY: the emit sites, the two
  members of the `ExternalDataRule` union, AND the module contract docstring that
  states data "MUST export ... typed `unknown`" (it asserts the exact obligation
  `unknown-is-type-destruction` forbids). Keep `logic-export-forbidden` and
  `missing-provenance-docstring`.
- Co-land the test changes (atomic landing): delete the three unit tests that
  describe the expunged rules (`external-data-contract.unit.test.ts` ~lines 80-98),
  update the multiply-non-compliant test (~lines 181-192) to expect only
  `logic-export-forbidden` + `missing-provenance-docstring`, and ADD a test
  proving an `as const` data export yields zero violations.

**Do - estate decontamination:**

- Run the **Estate Decontamination** sweep + disposition ledger (see that
  section). D0 owns the non-code surface (ADRs, other plans, the thread record,
  the foundation doc, README indexes) and the validator; contaminated CODE comments
  in surviving files are given a disposition here and corrected by the deliverable
  that owns each file (D2/D5/D6); files slated for deletion are recorded as
  covered-by-Dn.

**Done when (acceptance):**

- `pnpm repo-validators:check` is green; an `as const` data export is not reported
  at all on type grounds.
- ADR-038 covers fixed `as const` constants and cites `unknown-is-type-destruction`
  / ADR-034; ADR-157's two EEF Zod clauses are corrected in-record; ADR-173 no
  longer designates an EEF Zod loader in any of its three locations; **ADR-175 is
  tightened then WITHDRAWN** with its README entries and ADR-157 cross-ref removed;
  ADR-032/003 are unchanged; the ADR-028 citation is corroborating-only.
- The `data-export-must-be-unknown` and `no-unknown-data-export` rules - code,
  union members, and contract docstring - no longer exist; `logic-export-forbidden`
  and `missing-provenance-docstring` still fire and an `as const` export passes
  clean (proven by the updated validator unit tests).
- The Estate Decontamination ledger is complete: every contaminated reference has
  a recorded disposition.

**Proof:** `non-code` for ADR/doc edits; `unit` for the validator change
(`pnpm --filter @oaknational/agent-tools test`); gate observation
(`pnpm repo-validators:check` exit 0); ledger artefact for the decontamination
dispositions.

### D1 - Teacher value & impact contract (exploration; owner-ratified)

**Purpose:** make the teacher value explicit before any tool or graph shape is
chosen. Independent of D0/D2; may run in parallel.

**Do:**

- Explore the Sunday-night cover-lesson scenario end to end.
- Define the teacher-facing job, assistant role, and value claim.
- Define what EEF evidence must add to Oak material.
- Define evidence-preservation obligations: caveats, attribution, evidence
  strength, cost, impact, uncertainty.
- Define what the assistant must not infer or promise from EEF data.
- Define the smallest successful round trip that proves user value.

**Done when (acceptance):**

- The first value scenario is written clearly enough to test.
- Expected assistant behaviour is described from the teacher's point of view.
- Evidence caveats and explicit non-claims are recorded.
- The owner ratifies the value statement and success criteria, written back into
  this plan or a cited artefact before D3 proceeds.

**Proof:** `non-code` (owner ratification recorded in-plan or cited).

### D2 - Typed corpus foundation (brought forward)

**Purpose:** build the typed corpus substrate - everything derivable from the
`as const` constant alone. Depends only on D0 and the corpus.

**Do (TDD cycles; each cycle test+code co-land):**

- Derive `EefStrand = (typeof EEF_TOOLKIT_DATA.strands)[number]`, `EefStrandId`,
  `EefKeyStage`, `EefPriority`, `EefToolkitData` via `typeof`/indexed access. Derive
  `EefPhase` from the strand `by_phase` keys, NOT the wider `school_context_schema`
  phase enum (which carries `post_16`/`all_through`/`special` that no strand uses).
- Build the `StrandByStrandId` keyed lookup type and the runtime id-to-node
  lookup (built once; the single runtime id surface).
- Implement `isValidStrandKey(value): value is EefStrandId` backed by id-to-node
  membership (ADR-153 pattern).
- Build the typed `related_strand` edge collection and metadata derived from
  `EEF_TOOLKIT_DATA.meta`.
- Delete `strand-schema.ts` entirely. From `school-context.ts` delete ONLY the Zod
  schemas and drift guard; RETAIN its `as const` vocabulary arrays
  (`EEF_PHASES`/`EEF_PRIORITIES`/`EEF_KEY_STAGES`) and the type aliases that
  `selection.ts` and `types.ts` import - re-home them into this checked module and
  update the importers, or keep `school-context.ts` as the vocabulary home. The
  vocabularies stay derived/checked against the constant, so there is no parallel
  vocabulary and the drift guard is obviated.
- Relocate `strandById`, `StrandByStrandId`, `Strand`, and `lastUpdated` out of
  `eef-toolkit.external-data.ts` into this checked module; the `.external-data.ts`
  file returns to pure data.
- Test migration is SPLIT, not blanket: structural-traversal tests
  (`graph-view.unit.test.ts` BFS / depth / cycle / sparse-root / error-path) KEEP
  their synthetic purpose-built fixtures - real corpus ids are unique, so
  `DuplicateStrandId` cannot fire through the typed API, and pinning corpus literals
  creates change-detectors. ONLY corpus-grounded tests (key membership, vocabulary
  derivation, subgraph of a known real strand) operate on real members. The
  fabrication helper `makeStrand` returns `EefStrand`; once `EefStrand` is the
  precise union its return annotation and fabricated ids must move to the widened
  `buildGraphIndex` boundary or be reworked - design this before the cycle, not
  mid-cycle.

**Done when (acceptance):**

- `EefStrand`, `EefPhase`, and all EEF vocabularies derive from `EEF_TOOLKIT_DATA`;
  no `z.infer`-normalized node type and no Zod schema remain in the foundation.
- `strandById('<literal>')` type-checks to the exact single strand;
  `isValidStrandKey` narrows an arbitrary string to `EefStrandId`, proven by a unit
  test (true for every real corpus id; false for a typo'd id, empty string, and a
  non-string input).
- No logic remains in `eef-toolkit.external-data.ts`; the foundation module is
  under standard quality gates; `selection.ts`/`types.ts` resolve their vocabulary
  imports against the retained/re-homed `as const` arrays.
- `pnpm type-check` is green immediately after D2 lands (no broken imports).
- Construction from the real corpus is proven by unit test; consumers type-check
  against the derived types.

**Proof:** `unit` (substrate + predicate + keyed-lookup over the real corpus) +
type-check. Command: `pnpm --filter @oaknational/graph-corpus-sdk test` +
`pnpm type-check`.

### D3 - MCP tool/resource contract (exploration; owner + mcp-expert ratified)

**Purpose:** design the surface the AI host uses, from the D1 value contract,
expressed in D2's derived types, before any graph operation is finalised.

**Do:**

- Decide the MCP tool suite and any resources/resource templates. Starting
  hypotheses (not permission to hard-code): a lesson-context evidence tool, a
  strand-by-id inspection (tool or resource), a subgraph-around-strands tool; a
  corpus-metadata resource carrying attribution/caveats/version/last-updated.
- Define names, model-facing descriptions, input shapes, output shapes, and the
  output-schema rule: the output schema is a **single Zod-4 call** over a structure
  derived directly from the fixed EEF data (the same data-backed mapper that builds
  the payload) - no hand-maintained parallel schema. The installed SDK accepts only
  a Zod schema for `outputSchema` and runtime-validates `structuredContent` against
  it, so this one output schema is the SOLE Zod in the system (Decision 2). Input
  shapes are narrowed by constant-derived predicates, never Zod.
- Define the assistant interaction order for the cover-lesson scenario and when
  to use vs avoid EEF.
- Decide which inspection surfaces are tools and which are resources.
- Verify the installed MCP SDK and curriculum MCP app registration shapes:
  `outputSchema` is Zod-only (`AnySchema = z3.ZodTypeAny | z4.$ZodType`),
  `isError: true` bypasses output-schema validation, plus resources/resource
  templates and empty-`content` `structuredContent` results.

**Done when (acceptance):**

- The MCP surface is owner-ratified, written back into this plan or a cited ADR
  before D4 proceeds.
- Each tool/resource has a model-facing purpose tied to D1; payload shapes are
  selected before graph operations are finalised; output schemas are specified as
  derivations of the data-backed output structures.
- Current MCP SDK/app registration shapes are checked and cited.

**Proof:** `non-code` (owner + `mcp-expert` ratification, SDK shapes cited).

### D4 - Graph capability shape (exploration; derived from D3; reshapes graph-core)

**Purpose:** derive the correct graph operations from the ratified MCP surface
and reshape graph-core's query contract to them. The existing `GraphView` is
input to be corrected, not a foundation to build against.

**Do:**

- Define the graph operations D3 consumes. Non-contractual examples (names
  settled here, not before): a lesson-context evidence query, a total
  strand-by-id lookup (the only fallible step is `isValidStrandKey` at the
  request boundary - not a `NodeNotFound` lookup), a bounded subgraph-around-
  strands traversal.
- Reshape graph-core's query surface to those concrete operations, replacing the
  7-op stubbed polymorphic `GraphView` (2 live, 5 `NotImplementedYet`). No
  `NotImplementedYet` op survives. The reshaped graph-core contract MUST stay
  domain-generic (parameterised over `TNode`/`TEdgeType`; no EEF- or MCP-specific
  type names) - EEF-specific shapes live in `graph-corpus-sdk`, never in the
  substrate. Reintroduce broader generality only when a real second consumer exists
  (PDR-058: the contract was opened to a second consumer before one existed).
- **Verify consumer impact first (hard gate):** confirm what graph-core's other
  consumers actually use. Verified state: graph-ingest and graph-project consume
  only the RDF substrate (term/dataset/jsonld/data-factory), and the threads adapter
  is an empty export-nothing stub - the reshape's live blast radius is ZERO. The
  shared RDF substrate stays; only the query contract is reshaped. Record the
  consumer-impact finding as a named artefact and have an architecture reviewer sign
  it off before the interface change lands.
- Delete the speculative `EvidenceCorpus` `rank`/`explain`/`compare` ops and
  their `NotImplementedYet`.
- Specify subgraph membership (complete member nodes + all member edges),
  frontier references (related nodes outside members), request errors (at the
  external boundary), and nested filtering only where D3 requires it. No response
  cap (decision 7).
- Enumerate which `graph-view` exports are deleted, renamed, or retained (e.g.
  `SubgraphResult`, imported by the soon-deleted list tool) so D6 resolves its
  imports without re-deriving the reshape scope.
- Name the layer split: shared graph-core substrate; EEF fixed-corpus adapter;
  Oak lesson-context-to-EEF mapping; MCP consumer factory (separate from
  substrate packages; substrate never imports MCP types).

**Done when (acceptance):**

- The reshaped contract serves every D3 tool/resource and exposes no unbuilt or
  unused operation; no `NotImplementedYet` remains in the query contract.
- The consumer-impact finding for graph-ingest/graph-project/threads is recorded,
  and the reshape respects what they genuinely use.
- `rank`/`explain`/`compare` are deleted.
- Owner ratifies the value -> MCP -> graph derivation.

**Proof:** `non-code` (owner + `type-expert` + architecture-reviewer ratification
of the operation set, the domain-generic no-stub contract, and the consumer-impact
finding).

### D5 - Graph construction + operation implementation + loader removal

**Purpose:** construct the EEF graph object over D2's substrate, implement the
D4 operations, and remove the validation-layer ingest and the list-era remnants.

**Do (TDD cycles):**

- Construct the EEF graph object from the D2 substrate (corpus reference, typed
  node collection in corpus order, id-to-node lookup, typed edges, metadata).
  Construction is infallible for data-shape purposes.
- Implement the D4-ratified graph operations.
- Move lesson-context membership logic out of the MCP tool body into the EEF
  graph layer.
- Build the EEF evidence subgraph envelope: complete full-node members, all
  member edges, frontier references for related strands outside the members.
- Attach corpus-level caveats and attribution once per envelope as **additive**
  provenance (teacher value, not a freshness obligation); full strand nodes retain
  their own typed evidence fields. Whether `data_version`/`last_updated` are
  surfaced is the D1 value-contract's call - they carry no governance or freshness
  semantics here.
- Remove the loader path entirely and WITHDRAW the freshness apparatus in full:
  delete `freshness.ts`, `checkFreshness`, `DEFAULT_THRESHOLD_DAYS`, the
  `Freshness*` types, `freshness.unit.test.ts`, the `loader.ts`
  `safeParse`/fallible variants and its freshness binding + tests, the
  `graph-corpus-sdk` index re-exports, and every ADR-175 code reference. Replace
  `loadEefCorpus` with the pure infallible typed constructor.
- Delete every `NotImplementedYet`, the `rank`/`explain`/`compare` ops, and the
  `response-budget.ts` cap.

**Done when (acceptance):**

- The interface contains no unbuilt operation and no `NotImplementedYet`.
- Worked contexts return complete full-node members and all member edges, pinned
  as literal id sets from the committed corpus.
- Frontier references are present when related strands sit outside the members.
- The freshness apparatus is gone: no `freshness.ts`, `checkFreshness`,
  `DEFAULT_THRESHOLD_DAYS`, `Freshness*` type, loader binding, or freshness test
  remains, and the package re-exports are removed.
- No corpus `safeParse`, `EefToolkitSchema`, fixed-corpus `unknown` path, response
  cap, or rank-and-cut code remains; no type assertion recovers corpus shape.
- A pure-constructor unit test over the real corpus and a provenance-on-envelope
  test co-land with the construction code.

**Proof:** `unit` + `integration` over the real corpus. Command:
`pnpm --filter @oaknational/graph-corpus-sdk test` +
`pnpm --filter @oaknational/oak-curriculum-sdk test`.

### D6 - MCP factory + EEF surface

**Purpose:** expose the EEF graph as the ratified MCP tools/resources.

**Do (TDD cycles):**

- Add a factory in the curriculum MCP consumer layer accepting graph operations
  plus per-tool/per-resource config; it produces tool/resource definitions,
  handlers, descriptions, input shapes (narrowed by constant-derived predicates, no
  Zod), the single Zod-4 output schema (one call over the EEF-data-derived output
  structure - the only Zod in the system), `isError: true` on error returns so the
  SDK skips output validation, structuredContent-only tool formatting, resource
  formatting, and telemetry wiring. The factory does not validate the fixed corpus
  and does not require substrate packages to import MCP types (ADR-179 - an explicit
  acceptance check). Confirm the registry path (direct `server.registerTool` vs the
  universal-tools `AggregatedToolDefShape`, which has no `outputSchema` field).
- Register the ratified EEF surface behind `OAK_CURRICULUM_MCP_EEF_ENABLED`
  alongside the Oak curriculum tools; co-gate tool, resource, and prompt
  (`eef-surface.ts`, `handlers.ts`, `register-prompts.ts`).
- Update the EEF prompt/tool descriptions for cover-lesson preparation: evidence
  use, caveat preservation, and when not to use EEF.
- Replace the superseded list-shaped `eef-explore-evidence-for-context`
  implementation with the graph surface: remove `projection.ts`,
  `response-budget.ts`, dual content output, citation revalidation, and the Zod
  schemas in `tool-definition.ts`/`validation.ts`. Delete `citation-shape.ts` at
  `evidence-corpus/citation-shape.ts` (one level ABOVE the tool dir - verify no
  other evidence-corpus tool imports it first). Re-express any genuine
  citation-envelope invariant (non-empty caveats, valid `eef_url`) as a TypeScript
  tuple type (`readonly [T, ...T[]]`), not Zod.

**Done when (acceptance):**

- Flag on: the ratified tools/resources register and execute through the MCP app;
  each tool's output schema is the single Zod-4 call over the EEF-data-derived
  structure and the SDK validates `structuredContent` against it; tools return
  `structuredContent` only with `content: []`; error returns use `isError: true`.
- Flag off: no EEF tool, resource, or prompt appears in registration or the
  landing page.
- Resource payloads match the ratified contract; descriptions explain evidence
  use, caveat preservation, and when not to use EEF.
- The only Zod on the MCP side is the output-schema declaration; tool input is
  predicate-narrowed; no Zod parses the corpus or any input.
- Substrate packages import no MCP types (ADR-179), checked explicitly.
- Tests prove registration includes the configured output schemas and resources,
  flag-on and flag-off both co-landed in the integration test commit.

**Proof:** `integration` (registration + flag co-gating + structuredContent).
Command: `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test`.

### D7 - Teacher value round trip

**Purpose:** prove the system delivers the intended teacher value.

**Do (TDD cycles):**

- Add an MCP-client e2e flow (StreamableHTTP transport: MCP client SDK +
  `StreamableHTTPClientTransport`, in
  `apps/oak-curriculum-mcp-streamable-http/e2e-tests/`, `*.e2e.test.ts`):
  initialise the server; call existing Oak curriculum tools for a lesson context;
  call the ratified EEF context tool; inspect or expand a returned strand through
  the ratified surface; assert all EEF graph payloads arrive through
  `structuredContent`.
- Add a scenario-level assertion for the Sunday-night cover-lesson use case,
  measured against an INDEPENDENT ground truth: a known real strand's exact corpus
  values (its caveat text, evidence strength, cost, impact) appear VERBATIM in the
  assistant-facing payload - not merely that the fields are present, which the
  system could satisfy tautologically.
- Capture telemetry for the EEF graph tool/resource path.

**Done when (acceptance):**

- The e2e round trip proves graph retrieval, node/resource lookup, and subgraph
  expansion through MCP.
- The scenario proof shows Oak material and EEF evidence used together; the final
  assistant-facing payload contains the known strand's VERBATIM corpus attribution,
  caveats, evidence strength, impact, and cost (the independent-ground-truth check),
  not a reformulation.
- At least one telemetry span is recorded for the EEF graph path.
- `pnpm check` is green on a settled tree.

**Proof:** `e2e` + `value-proxy`. Command: the workspace e2e suite +
`pnpm check`.

## Carried Context From The 2026-05-30 Session

Artefacts already in the tree, so the next session does not rediscover them:

- `strandById`, `Strand`, `StrandByStrandId`, and the `lastUpdated` accessor
  exist in `eef-toolkit.external-data.ts` (lines ~1984-2067). D2 relocates them
  into the checked foundation module (the validator's logic-forbidden rule is
  correct - logic must not live in a gate-excluded data file).
- Direction notes in the headers of `eef-toolkit.external-data.ts`, `loader.ts`,
  and `strand-schema.ts` mark the Zod/freshness path as redundant and under
  removal. They describe current behaviour honestly and point to this plan.
- The old runtime `strands` Set was removed; no runtime id surface currently
  exists. D2's id-to-node lookup is the single one and backs `isValidStrandKey`.
- The `validate-external-data-files` repo-validator fails on
  `eef-toolkit.external-data.ts` with 3 violations: 1x `logic-export-forbidden`
  (`strandById` - correct; fix by relocation in D2) and 2x `data-export-must-be-unknown`
  (`EEF_TOOLKIT_DATA`, `lastUpdated` - the CORE-DEFECT rule; D0 deletes the rule and
  every reference to it, never satisfies it by retyping the corpus to `unknown`).
- `graph-core` exists at `packages/core/graph-core/` with the polymorphic
  `GraphView<TNode, TEdgeType>` (7 ops: `manifest` + 6 fallible; `manifest`/`subgraph`
  live, 5 `NotImplementedYet`). Its RDF substrate is used by `graph-ingest` and
  `graph-project`; the `threads` adapter is an empty stub - so the query-contract
  reshape (D4) has zero live blast radius. The speculative `EvidenceCorpus`
  `rank`/`explain`/`compare` ops live (type-only) in
  `graph-corpus-sdk/src/eef-strands/types.ts`.
- The current EEF MCP tool is the list-shaped `eef-explore-evidence-for-context`
  in `oak-curriculum-sdk/src/mcp/evidence-corpus/tools/`, registered by
  `apps/oak-curriculum-mcp-streamable-http` behind `OAK_CURRICULUM_MCP_EEF_ENABLED`,
  with `projection.ts`, `response-budget.ts`, and Zod schemas
  (`tool-definition.ts`/`validation.ts`) as the superseded shape. `citation-shape.ts`
  lives one level up at `evidence-corpus/citation-shape.ts` (D6 deletes it after
  verifying no other importer).

## Fully Specified End State

### User Value

- The Sunday-night cover-lesson scenario is ratified as the first value proof.
- The assistant combines Oak material with EEF graph evidence so the teacher's
  answer is more useful than Oak retrieval alone.
- Scenario output includes EEF attribution and caveats and does not flatten
  uncertainty into a recommendation list.
- The teacher-facing answer requires no knowledge of the graph or layers.

### MCP Surface

- Ratified tool/resource boundaries; descriptions explain the cover-lesson value
  path and evidence-preservation obligations.
- Each tool has a predicate-narrowed (no-Zod) input boundary and a single Zod-4
  output schema generated from the same EEF-data-derived structure as its payload.
- Each resource/template has a defined URI, payload shape, and model-facing
  purpose.
- Graph tools return `structuredContent` only with `content: []`; error returns
  use `isError: true`.
- The only Zod on the MCP side is that one output-schema declaration; nothing
  parses the corpus or any input.
- With the flag off, no EEF tool, resource, or prompt appears.

### Graph Layer

- graph-core's query contract is reshaped to the concrete operations the MCP
  surface consumes; no stubbed polymorphic ops and no `NotImplementedYet` remain.
- Operations are tested on the real corpus.
- Returned subgraphs contain full nodes, member edges, and frontier references,
  bounded by graph scope, never by a cap.
- The shared RDF substrate is preserved for its other consumers.

### Data And Types

- `EEF_TOOLKIT_DATA` remains the only fixed corpus source, typed `as const`.
- `EefToolkitData`, `EefStrand` (= `(typeof EEF_TOOLKIT_DATA.strands)[number]`),
  `EefStrandId`, `EefKeyStage`, `EefPriority` derive from the constant.
- No consumer accepts the corpus as `unknown`; no Zod parses or validates the
  corpus or any input (the sole Zod is the single output-schema declaration); no
  freshness apparatus exists (ADR-175 withdrawn); no type assertion re-establishes
  the corpus shape; no hand-authored/normalized parallel node interface exists.
- Compile-time literal key access yields the exact single strand; runtime
  boundary access narrows the key via `isValidStrandKey`, then resolves through
  the keyed lookup.

## Plan Definition Of Done

The plan is done when D0-D7 are complete and:

- the red `repo-validators` gate is green via D0 deleting the erroneous rules,
  never by retyping the corpus to `unknown`;
- the only Zod in the EEF graph stack is the single output-schema declaration;
  nothing parses the corpus or any input;
- teacher value (D1) is ratified before the MCP and graph contracts are locked;
- the MCP surface (D3) is designed as the user-facing surface before graph
  internals are implemented;
- graph-core's query contract is reshaped to only the operations the ratified MCP
  surface consumes, with consumer impact on graph-ingest/graph-project/threads
  recorded;
- the corpus's `as const` type information flows into graph and MCP outputs
  without being thrown away and re-established;
- the ingest is a pure infallible typed construction step, not a validation layer;
  the freshness apparatus is fully removed (ADR-175 withdrawn); no response cap or
  rank-and-cut survives;
- ADR-038 covers fixed `as const` constants (grounded in `unknown-is-type-destruction`
  / ADR-034); ADR-157's two EEF Zod clauses are corrected in-record; ADR-173 no
  longer designates an EEF Zod loader in any of its three locations; ADR-175 is
  tightened then WITHDRAWN; ADR-032/003 are unchanged and the ADR-028 citation is
  corroborating-only;
- the estate-decontamination ledger is complete and a final sweep finds zero LIVE
  references to the discarded concepts (`data-export-must-be-unknown`,
  `gate-1a`/`gate-1b`, freshness/ADR-175, Zod-over-corpus, the response cap);
- a Sunday-night cover-lesson scenario proves the teacher value path;
- all tests and gates for the touched workspaces pass (`pnpm check` green).

## Non-Goals

- Minimising changes to an inherited shape that is wrong. The default is to
  replace it with the correct shape; existence is not evidence of correctness.
- Keeping any Zod that parses the corpus or input, any runtime schema parse, or
  any freshness gate / ADR-175 in this system (the sole permitted Zod is the single
  output-schema declaration the MCP SDK requires).
- Keeping a response cap, rank-and-cut, or field-mask-for-budget on graph
  results.
- Treating the existing `graph-core` `GraphView` query contract as fixed, or
  conversely demolishing graph-core's shared RDF substrate that other consumers
  depend on.
- Treating tests of construction, subgraph completeness, schema derivation,
  metadata propagation, resources, or MCP behaviour as forbidden - those remain
  required.
- Reintroducing `unknown` or type assertions at the fixed-data boundary.
- Building ranking, recommendation, or compare tools beyond the graph access this
  use case needs, unless D3 ratifies them.
- Building a UI widget.
- Flipping `OAK_CURRICULUM_MCP_EEF_ENABLED` in any deployed environment.
- Building the next graph corpus before this first surface proves the pattern.
- Leaving any contaminated reference live because it is "out of scope" - the
  Estate Decontamination sweep is mandatory, not optional.

## Risk Assessment

- **Conservation reflex re-entering during execution.** The prior failure was
  reaching for the minimal edit that preserved a wrong shape. Mitigation: each
  inherited element (validator rule, Zod schema, graph-core op, list-era cap) has
  an explicit replace/delete decision above; execution that finds itself
  softening rather than replacing should stop and re-read the Ratified Decisions.
- **Reshaping graph-core's query contract.** graph-core is multi-consumer for its
  RDF substrate. Mitigation: D4 records the consumer-impact finding (verified:
  graph-ingest/graph-project use only the RDF substrate; the threads adapter is an
  empty stub - live blast radius zero); the shared RDF substrate is out of scope
  for the reshape; an `architecture` reviewer and `type-expert` sign off before the
  interface change lands.
- **Union node type ergonomics.** `(typeof EEF_TOOLKIT_DATA.strands)[number]` is a
  large union. The doctrine is fixed: the union IS the type; no normalized parallel
  shape, and no "common iteration shape" is introduced as a response to ergonomic
  friction (that framing is exactly how a normalized interface previously crept
  back). Iterating a union is ordinary TypeScript. If a concrete, named
  compile-time cost actually arises it is a fresh `type-expert` decision at that
  point - not a pre-authorised hatch in this plan.
- **Carrying a red gate through D1/D3 exploration.** Mitigation: D0 is sequenced
  first and greens the gate before contract exploration consumes time; if D0
  cannot land first, surface the persisting red gate to the owner.
- **ADR amendment + decontamination scope.** Mitigation: D0 is a batched
  disposition sized to the unique substance (amend ADR-038, correct 157/173,
  WITHDRAW 175, leave 032/003) plus the Estate Decontamination ledger, not one
  cycle per ADR or per reference.
- **Decontamination misses a live reference.** Mitigation: the Estate
  Decontamination acceptance is a clean `rg` sweep (history and changelog excluded)
  and the ledger records every hit, so a missed live reference fails the sweep.

## Foundation Alignment

- `principles.md` - long-term architectural correctness over expediency;
  known-data-is-its-own-authority; no parallel schemas; replace wrong shapes
  rather than preserve them.
- `testing-strategy.md` / `tdd-as-design.md` - every product cycle is a co-landed
  test+code pair; tests describe system states over the real corpus.
- `schema-first-execution.md` - schema-first governs the unknown OpenAPI surface
  elsewhere; this system's `as const` constant is its own schema and narrows by
  predicate; the sole Zod is the MCP SDK-required output-schema declaration
  (ADR-153 predicate pattern; ADR-028 corroborating).
- `unknown-is-type-destruction` rule + ADR-034 - the existing doctrine the expunged
  validator rule violated (`as const` tightens types; `unknown` over known data is
  forbidden).
- ADR-038 (compile-time construction, generalised), ADR-153 (constant-type
  predicate), ADR-028 (Zod deferral, corroborating), ADR-041 (graph-core boundary),
  ADR-179 (transport-agnostic substrate), PDR-058 (premature-generalisation /
  optionality), ADR-117 (plan architecture). ADR-175 is WITHDRAWN by this plan.

## Plan-Body First-Principles Check

Per `.agent/rules/plan-body-first-principles-check.md`, before executing
plan-prescribed work:

- **Shape clause** - every inherited shape named here (validator rules, Zod
  schemas, the `GraphView` query contract, the response cap) is to be replaced
  with the correct shape, not relaxed or preserved; D3/D4 examples are
  hypotheses, re-derived from the ratified contracts at execution time.
- **Landing-path clause** - D0 must green `repo-validators:check`;
  D2/D5/D6/D7 product cycles co-land test+code and end with all tests passing.
- **Vendor-literal clause** - D3 must verify the installed MCP SDK and curriculum
  app registration shapes before encoding protocol details; do not trust this
  plan's protocol claims over the live SDK - in particular the verified-here shapes:
  `outputSchema` is Zod-only and `isError: true` bypasses output validation.
- **Optionality-surface clause** - no deliverable embeds optionality where a closed
  answer exists, and no escape hatch (deferral, menu, soften-the-rule,
  common-shape-under-friction) remains: the ADR-157 "or" is resolved to the
  surgical in-record correction, the union-ergonomics hatch is removed, and ADR-175
  is decided (withdrawn), not held open.

## Readiness Reviewers

A full readiness review (`assumptions-expert`, `type-expert`, `mcp-expert`,
`architecture-expert-betty`/`-fred`, `test-expert`, `docs-adr-expert`, plus drift
and starting-statement passes) was run on 2026-05-30 against the plan frame; its
findings are folded in above. The reviewers below still fire at execution time
against the *ratified D3/D4 outputs*, which did not exist at review time:

- `assumptions-expert` - the value -> MCP -> graph bridge is sound and the
  deliverables are proportional.
- `mcp-expert` - the D3 tool/resource boundary, the single Zod-4 output schema and
  `isError` path, resources, and structuredContent-only design against the live SDK.
- `type-expert` - the constant-derived-types contract, the single output-schema
  Zod, the key-narrowing predicate, and the reshaped domain-generic graph-core
  query contract.
- An architecture reviewer - the graph-core query-contract reshape, its
  zero-blast-radius consumer-impact record, and ADR-179 compliance at the D6
  factory boundary.

These review the plan frame. Code-gateway reviewers (`code-expert` and the
specialists it flags) run in the normal loop after product edits.

## Learning Loop & Lifecycle Triggers

- On completion, milestone closure, or archival, run `oak-consolidate-docs`:
  mine permanent documentation (generalised ADR-038, the ADR-175 withdrawal, the
  ADR-153/028 uptake, the completed decontamination ledger), update the EEF thread
  record, and archive this plan per ADR-117.
- Lifecycle touch points per
  `.agent/plans/templates/components/lifecycle-triggers.md`: D0 ADR + decontamination
  edits invoke the docs/ADR reviewer; D4 graph-core reshape invokes architecture
  review; D6 MCP-surface change invokes doc/onboarding review; D7 completion runs
  the consolidation workflow.
