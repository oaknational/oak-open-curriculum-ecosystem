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
  correct shape, not to relax, preserve, or hold it as an open question. D0 is
  complete and committed at `ce9745c7`: the external-data validator was deleted
  and the repo-validators gate is green by deletion, not by retyping the corpus
  to `unknown`. The teacher value contract is the design root (the why); the
  doctrine fix and typed raw-corpus foundation are execution-independent of value and
  sequence first. The operative axis throughout is KNOWN vs UNKNOWN data, not
  external vs internal. Because every datum in this system is either a known
  constant or a value drawn from a known finite vocabulary, there is no Zod
  anywhere in the EEF work EXCEPT the MCP tool input and output schemas: each
  tool input schema and output schema MUST be derived by a single Zod call on the
  appropriate subset of the constructed graph-native EEF view, never directly
  from the raw corpus. The graph-native view is always derived from the raw EEF
  data, and must preserve the raw corpus's exact `as const` type information; the
  raw data is definitively not the graph contract. D3/D4 must define and verify a
  graph-native subset that makes the single-Zod-call schema path executable before
  D6 starts; that subset/schema-builder is a deterministic, type-strict projection
  of the graph-native EEF view, and the graph-native view is itself a
  provenance-preserving projection from the raw EEF data. The schema is therefore
  derived from graph form, not raw data directly and not a plan-authored
  vocabulary. Failing that proof means the contract is wrong and must be corrected
  at the owning architectural level. No secondary path is authorised. No stub path
  is authorised either: every exposed EEF tool, resource, prompt, graph operation,
  and handler is implemented with real graph-derived logic and tests, or it is
  absent. No Zod call parses the corpus. No runtime load path preserves the old
  shape while the graph projection is built. ADR-175 (a
  little-used plan-promotion
  safeguard, mis-implemented as a freshness gate in code) is withdrawn (a
  newly-defined ADR lifecycle state) and its record deleted; its code is removed
  in D2 with the load/list/Zod/freshness deletion. The plan also decontaminates EEF
  plans and non-plan documentation of references to the discarded positions, with
  non-EEF plans left to their owning estate plans. Implementation must preserve
  the corpus's `as const` type information end to end.
todos:
  - id: d0-fixed-data-doctrine
    content: "DOCTRINE + VALIDATOR/GATE FIX + ESTATE DECONTAMINATION. D0 is COMPLETE and committed at `ce9745c7`: ADR-038 was generalised in-record to fully-known `as const` constants; ADR-157/173 were corrected away from the EEF Zod loader; ADR-175 was withdrawn and deleted with inbound references removed; the entire `validate-external-data-files` validator was DELETED (not trimmed to two rules); `strandById`/`StrandByStrandId`/`Strand`/`lastUpdated`/`EefToolkitData` were moved out of `.external-data.ts` into the checked foundation module; the EEF estate decontamination ledger was completed; full `pnpm check` was green. The red repo-validators gate was greened by deleting the obsolete validator, never by retyping the corpus to `unknown`. Freshness CODE removal belongs to D2's deletion of the load/list/Zod/freshness path, not to a compatibility-preserving loader phase."
    status: completed
    depends_on: []
  - id: d1-value-impact-contract
    content: "COMPLETE after owner ratification on 2026-05-31: the teacher value/impact contract covers the Sunday-night cover-lesson use case, the assistant's role, evidence-preservation obligations, non-claims, the faithful-evidence-transmission standard, the corpus-derived evidence/provenance contract, and the smallest round trip that proves value. Output is the ratified value statement and testable success criteria in `## Value And Impact`."
    status: completed
    depends_on: []
  - id: d2-typed-raw-corpus-foundation
    content: "Build the typed raw-data ingestion foundation from EEF_TOOLKIT_DATA: canonicalise the raw strand type as EefStrand (= (typeof EEF_TOOLKIT_DATA.strands)[number]), derive EefStrandId, EefStrandById, EefToolkitData, raw related_strand facts, corpus metadata, methodology/caveat/provenance facts, observed graph-filter domains, declared metadata domains, and raw headline metric domains directly from named source paths in the fixed raw object graph via typeof/indexed-access and deterministic raw projection helpers. The EEF data structure is the only source of truth: do not maintain separate lists of keys, values, field names, phases, priorities, key stages, metric values, metric labels, caveat classes, interpretation labels, crosswalks, or known-vocab constants. Any proposed tool input that cannot point directly at fixed known corpus data is an architectural misalignment, not D2 glue work. D2 is raw-foundation work only: it does not author teacher-facing payload fields, MCP input/output schemas, graph-native subsets, ranking/selection behaviour, output parity with the old tool, or the deterministic graph projection. D5 owns ingesting this raw foundation into the graph-native EEF projection, and D6 derives MCP schemas/payloads from named graph-view subsets, not raw data directly. Implement isValidStrandKey(value: unknown): value is EefStrandId backed by the id-to-strand lookup, with a named unit test. Delete every non-source-of-truth raw vocabulary/list/Zod/load/freshness surface outright: school-context tuples/Zod/drift guards, strand-schema, loader/loadEefCorpus, freshness, old-list selection/projection/tool code, old-list MCP registration, and package exports that keep any of them live. There is no compatibility wrapper, no bridge, no side-by-side path, and no obligation to keep the tree green while this fundamental replacement is in flight; the settlement proof comes from the completed D2-D6 chain. Test migration is split only by behaviour: structural graph tests may keep synthetic purpose-built fixtures; corpus-grounded tests use real corpus members and the source-path table. Brought forward; depends only on D0 and the corpus."
    status: pending
    depends_on: [d0-fixed-data-doctrine]
  - id: d3-mcp-tool-resource-contract
    content: "Write and verify the owner-ratified D3 MCP surface from the D1 value contract, expressed through D2's raw-corpus types and the intended graph-native EEF view that D4 ratifies and D5 constructs/adapts. The practical-small surface is one deterministic EEF query/fetch tool with function/options dispatch, one EEF interpretation resource/template for applying the evidence, and one user-facing prompt for starting the teacher workflow. D3 specifies only real surfaces D6 can implement end to end: no stub tools, placeholder resources, fake prompts, migration bridges, or deferred handlers enter the contract. Classify every externally supplied tool field as a strand-key predicate, finite EEF-corpus-vocabulary predicate, or graph-projected raw headline metric predicate before D4 proceeds; every field must trace through `contract field -> graph-native subset -> raw EEF source path -> proof test`. Free-form teacher language and Oak context are interpreted by the invoking agent before the tool call and never cross into the deterministic tool as raw semantics; D6 implements no hidden Oak-signal-category, pedagogical-move, misconception, prerequisite, quiz, text, subject, or topic mapping to EEF strand ids. Subject/topic never become EEF tool inputs. The tool schema rule: the MCP tool INPUT schema and OUTPUT schema are each derived by a SINGLE Zod call on a named subset/schema-builder value typed from the graph-native EEF view — a deterministic, type-strict projection of graph form, with graph form itself derived from the raw EEF data; the schema is not a direct raw-data transform, hand-maintained parallel shape, plan-authored vocabulary, or corpus parser. Use `satisfies` or equivalent compile-time proof tying declarations to `structuredContent`. The schema root must serialise to an object (`type: object`, ruling out a root-level union). Confirm the installed MCP SDK + curriculum MCP app registration shapes in a separate D3 verification record: inputSchema/outputSchema are Zod-compatible, isError:true skips output validation, resources/resource templates and prompts register behind the flag, structuredContent-only results are valid, and the actual universal-tools/registerTool path can carry `outputSchema` directly. D3 is complete when the intended single-Zod-call graph-subset contract is specified, the named subset/schema-builder values are handed to D4, and SDK/app registration feasibility is verified; D4 ratifies the graph-native view and D6 implements the actual Zod calls."
    status: pending
    depends_on: [d1-value-impact-contract, d2-typed-raw-corpus-foundation]
  - id: d4-graph-capability-contract
    content: "RATIFY (non-code) the correct graph capability shape from D3, treating the existing graph-core GraphView query contract (7 ops: manifest + 6 fallible; 2 live, 5 NotImplementedYet) as input to be reshaped, NOT a fixed foundation. Split the target contract into graph-core primitives (domain-generic lookup/subgraph/frontier/result/error surfaces) and EEF/Oak binding operations, so no EEF- or MCP-specific method lands in shared graph-core. Ratify the minimal graph-native EEF view contract before D5: owner package, node id/kind policy, edge/frontier shape, payload/provenance policy, and named schema-subset/schema-builder surfaces for D3/D6. Define the target domain-generic graph-core contract parameterised over TNode, TNodeId extends string, and TEdgeType; public graph-core result and error types must carry TNodeId, so the EEF binding carries EefStrandId through subgraph roots, edge endpoints, frontier refs, strand lookup inputs, and root-not-found errors after boundary narrowing. The actual graph-core reshape and deletion of the speculative rank/explain/compare corpus ops are CODE and land in D5 TDD cycles; no placeholder, future hook, fake implementation, new stub operation, old-list dependency, or Oak-signal-to-strand mapping may be specified. Record the consumer-impact finding as a HARD gate before interface changes land: verified ZERO external-consumer blast radius, with bounded IN-PACKAGE graph-core edits named. The old list tool is already gone from the D2 path and is not consumer-impact evidence to preserve. An architecture reviewer signs off the operation set + consumer-impact record. Enumerate which graph-view exports are deleted/renamed/freshly defined by the new contract; a result type may keep the old name `SubgraphResult` only if D4 freshly ratifies that name and structure from the new graph contract."
    status: pending
    depends_on: [d3-mcp-tool-resource-contract]
  - id: d5-graph-construction-methods
    content: "Ingest D2's typed raw-data foundation into the D4-ratified deterministic graph-native EEF projection and implement the D4-ratified graph operations. The construction/adaptation boundary is explicit and pure: it may materialise a standardised graph-native shape or expose a lazy view, but graph operations, MCP schemas, traversal semantics, and provenance derive from the graph-native view rather than scattered assumptions about the raw corpus. The raw data is definitively not the graph contract, even where a graph-native projection retains raw fields verbatim; the graph-native view must be a typed projection from EefStrand, EefStrandById, EefStrandId, and derived edge facts, preserving exact ids and per-strand payload relationships. Implement graph-core public result/error types with TNodeId so EEF roots, edge endpoints, frontier refs, lookup inputs, and root-not-found errors are EefStrandId, not broad string. Verify the D2-deleted load/list/Zod/freshness path remains absent; do not recreate loadEefCorpus, loader.ts, freshness, list logic, response caps, NotImplementedYet stubs, rank/explain/compare placeholders, wrappers, or fake graph methods. Surface source attribution and caveats as additive provenance on the subgraph envelope without flattening per-strand evidence fields unless the graph-native projection preserves a named type-level link to the raw source strand. Co-land replacement tests: a graph-constructor test over the real corpus, typed-id/result compile-time proof, and a provenance-on-envelope test."
    status: pending
    depends_on: [d2-typed-raw-corpus-foundation, d4-graph-capability-contract]
  - id: d6-mcp-composition-eef-surface
    content: "Build the EEF-specific MCP composition module in the curriculum consumer layer and register the ratified EEF tool/resource/prompt surface behind OAK_CURRICULUM_MCP_EEF_ENABLED with structuredContent-only tool results. Do not extract a generic corpus-tool factory until a real second consumer exists. The tool INPUT schema and OUTPUT schema are each derived by a SINGLE Zod call on a named subset/schema-builder value typed from the graph-native EEF view (a deterministic, type-strict projection of graph form, with graph form itself derived from the raw EEF data; not a direct raw-data transform, hand-maintained parallel shape, or plan-authored vocabulary; root `type: object`); use `satisfies` or equivalent compile-time proof tying declarations to `structuredContent`. These are the only Zod schemas in the EEF graph stack (Decision 2). Error returns use isError:true so the SDK skips output validation. Ensure `outputSchema` reaches the actual `server.registerTool`/`registerAppTool` call by replacing any current universal-tools segment that cannot carry it. Implement the EEF interpretation resource/template and update the user-facing EEF prompt from the ratified D3-D5 graph surface. The superseded list-shaped `eef-explore-evidence-for-context` implementation and its projection/response-budget/dual-content/citation-revalidation/tool-level Zod path were already deleted by D2 and must remain absent; D6 does not recreate them, compare against them, wrap them, or use them as a behaviour target. Delete citation-shape.ts at evidence-corpus/citation-shape.ts if it survived D2 (one level above the tool dir - verify no other tool imports it first). Registration is only for real implemented surfaces: no empty tools, placeholder handlers, fake resources, prompt shells, or deferred implementations may appear behind the flag. The module must not import MCP types into substrate packages (ADR-179) - an explicit acceptance check. Preserve flag co-gating of tool, resource, and prompt. D6 is not complete until the single-Zod-call graph-subset rule is implemented exactly; failure blocks D6 and requires correction of the D3/D4 contract."
    status: pending
    depends_on: [d4-graph-capability-contract, d5-graph-construction-methods]
  - id: d7-teacher-value-round-trip
    content: "Prove the Sunday-night cover-lesson value path through MCP end to end: an agent uses Oak curriculum tools plus the EEF query/fetch tool and interpretation resource/template to assemble evidence-enhanced lesson material with EEF caveats and provenance preserved, with the user-facing EEF prompt available as the workflow starter. Verify against INDEPENDENT ground truth sourced through the typed raw/graph-native chain (a known strand's exact corpus values - caveat text, evidence strength, cost, impact - appear verbatim in the payload, not merely that the fields are present); capture telemetry for the EEF graph path; pnpm check green on a settled tree."
    status: pending
    depends_on: [d6-mcp-composition-eef-surface]
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
  code, now withdrawn and deleted; ADR-032/003 are correct as written);
- the evidence was modelled as an old capped LIST rather than a graph, so a
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
written into surviving ADRs, EEF plans, archived artefacts, and dozens of code
comments (the obsolete list-era gate-label framing - removed sessions ago but never swept
from comments - plus freshness/ADR-175, Zod-over-corpus, and the list-tool).
Until each in-scope live reference is corrected or deleted it keeps dragging
execution back toward the wrong position; this exact effect mis-led the readiness
review itself, where a stale list-era comment in `freshness.ts` was briefly taken
as a live obligation. The plan therefore carries an explicit Estate
Decontamination sweep for EEF plans and non-plan documentation - leaving an
in-scope contaminated reference live is itself the drift the plan exists to stop.

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
correctness - is exactly how fundamentally wrong decisions persist. **The default
move on every inherited shape in this plan is to replace it with the correct
shape.** Existence is zero evidence of correctness. The discipline is to reshape
to the correct shape, not the maximally-demolishing one: graph-core's shared RDF
substrate is genuinely multi-consumer and stays; its stubbed query contract is
premature and is replaced. Scrutiny, not blanket demolition, and never
conservation-by-default.

Two orderings are both true and must not be confused:

```text
design / runtime path:  teacher -> AI host -> MCP tool/resource/prompt surface -> graph methods -> graph-native EEF view -> raw corpus
```

```text
execution path:         D0 doctrine fix + D1 value contract -> D2 typed raw foundation -> D3 MCP contract -> D4 graph contract -> D5 graph-native construction/adaptation -> D6 MCP composition -> D7 teacher value proof
```

The design narrative is value-first: value is the root that justifies the MCP
surface, which justifies the graph methods. The execution order is not forced to
follow it. The doctrine fix and the typed raw-corpus foundation depend only on
the fixed `as const` corpus, so they are brought forward and run in parallel with
value exploration. The graph-native construction/adaptation boundary is later,
because it must answer to the value-shaped MCP surface and D4 operation contract.
The validator gate is red now, which makes the doctrine fix the first thing to
land. This eliminates the backward-dependency fault in the prior structure
(where "derive the types" sat after the contracts that consume the types).

## Ratified Decisions (decision-complete; do not re-open in execution)

These were settled with the owner across the 2026-05-30 session. Execution
applies them; it does not re-litigate them. Genuinely remaining exploration is
isolated to D1, D3, and D4 and is named there as explicit steps.

1. **The axis is known vs unknown, not external vs internal.** "External"
   (origin) and "unknown" (shape not known at authoring time) are orthogonal.
   The EEF corpus is external-origin **and** known-shape. Known-shape data is
   derived from; genuinely-unknown-shape data is narrowed at its boundary. There
   is no contest between these - they are two arms of one principle.

2. **No Zod anywhere in the EEF work, except MCP tool input and output schemas.**
   Zod's job is parsing unknown *structure*. The corpus is a known constant, and
   every semantic input is a *value drawn from a known finite vocabulary* (a strand
   key, a key stage / phase, an EEF priority). Narrowing a value into a known set
   is a membership *predicate* (`value is T`, the ADR-153 house pattern; ADR-028
   is corroborating prior-art only). The repo's validate-unknown doctrine
   (ADR-032/003) governs
   genuinely-unknown *structure* elsewhere. Every Zod schema that PARSES or
   VALIDATES the corpus is removed - `strand-schema.ts`, the `school-context.ts`
   schemas and drift guard, the `loader.ts` `safeParse`, and the old hand-authored
   MCP-side input/citation schemas (`tool-definition.ts`, `validation.ts`,
   `citation-shape.ts`). **The bounded exception is the MCP protocol boundary:**
   the installed SDK (`@modelcontextprotocol/sdk` v1.29, Zod 4) accepts Zod schemas
   for `inputSchema` and `outputSchema`, and runtime-validates the tool's
   `structuredContent` against `outputSchema`. Therefore each MCP tool has an
   input schema and an output schema, and each is derived by a **single Zod call on
   the appropriate subset of the graph-native EEF view**. This is the CONTROLLING
   definition of the tool-schema rule the rest of the plan refers to: one Zod call
   per schema, over a named graph-native subset or schema-builder value whose
   TypeScript type is derived from the graph-native view, with `satisfies` or an
   equivalent compile-time proof tying the declared schema to the corresponding
   `structuredContent` type. A hand-authored `z.object(...)` that merely resembles
   the graph output is a parallel shape and is forbidden. The schema root must
   serialise to an object (`type: object`, ruling out a root-level union).
   D3/D4/D5 must prove the single-Zod-call graph-subset rule before D6; failure is
   a contract defect to correct, not a choice point. These are
   vendor-required *declarations* over graph-native-derived structures, not corpus
   parsers and not hand-authored parallel schemas.

3. **The `validate-external-data-files` validator was deleted.** The
   `data-export-must-be-unknown` rule was not softened into "`: unknown` or
   `as const`"; the entire validator was removed in D0, together with its tests,
   bin, and script wiring. A data file's job is to hold data; whether a consumer
   treats that data as known or narrows it is expressed at the consumer boundary,
   never by mandating the data export's type annotation. The `*.external-data.ts`
   convention remains only as a Sonar/ESLint duplication-exclusion marker for a
   large faithful data literal; the single current EEF corpus file stays
   logic-free by inspection, not by an AST validator. There is exactly one
   `.external-data.ts` file in the repo, so this deletion has zero blast radius.

4. **The raw corpus type is derived from the constant; the raw corpus is not the
   graph contract.** `EefStrand = (typeof EEF_TOOLKIT_DATA.strands)[number]` - the
   precise union of the exact per-strand literal shapes - is the raw-corpus source
   type. The current `z.infer<EefStrandSchema>` normalized interface is the
   forbidden hand-authored parallel schema and is removed. There is no
   "union vs normalized" choice for the raw corpus: the exact structure is known,
   so we use it. Separately and non-optionally, D5 owns an explicit
   construction/adaptation boundary from that raw foundation into the graph-native
   EEF view. The graph is absolutely derived from the raw EEF data, and its types
   must preserve the exact raw relationships: a known `EefStrandId` still indexes
   the corresponding `EefStrandById[Id]`, edge endpoints remain derived literal
   ids, and any graph-native payload/reference policy keeps a named type-level link
   to the raw source strand or a named derived projection of it. The graph-native
   view may wrap, project, index, or otherwise standardise the raw data if doing so
   serves the graph operations, MCP schema derivation, provenance, or traversal
   semantics. It may also be lazy rather than fully materialised. What is
   forbidden is an unowned, hand-maintained parallel raw schema, broad `string`
   graph ids, generic JSON-like graph payloads that recover EEF specificity later,
   or an executor shortcut that treats "raw corpus plus scattered graph functions"
   as the graph contract.

5. **The only unknown in the whole system is the key.** A key may arrive as an
   arbitrary external value. `isValidStrandKey(value: unknown): value is
   EefStrandId` (ADR-153 house pattern, backed by raw id-to-strand membership) is
   the single narrowing in the system: non-strings return false, real corpus ids
   narrow, and all other strings fail membership. A known literal key indexes
   `EefStrandById[Id]` to its exact single strand; the keyed lookup is total over
   the fixed key space and cannot miss. The union appears only as the residual
   static type of a validated-but-not-yet-pinned key, handed straight back, never
   widened or normalized. One unknown - the key; one narrowing - the key;
   everything downstream of a known key is exact.

6. **The existing `graph-core` query contract is input to be reshaped, not a
   fixed foundation; build real logic or nothing.** Its committed
   `GraphView<TNode, TEdgeType>` - 7 ops
   (manifest + 6 fallible); 2 live (manifest, subgraph), 5 returning
   `NotImplementedYet`, polymorphic ahead of a second consumer - is premature
   generalization (PDR-058: a shape opened to a second consumer before one
   existed), and is not treated as correct because it exists. The live blast
   radius is zero: graph-ingest and graph-project consume only the RDF substrate,
   and the threads adapter is an empty stub. D4 derives the correct graph query
   shape from the ratified MCP surface and reshapes graph-core to it. graph-core's
   shared RDF substrate (term/dataset/jsonld/canon) is genuinely multi-consumer
   and is not in question; only the stubbed query contract is reshaped, after
   recording the consumer-impact finding. This is also the global EEF graph-tool
   rule: no stub tools, placeholder handlers, fake registrations,
   `NotImplementedYet` fallbacks, empty registered tools/resources/prompts, or
   exported operations that are not implemented end to end. A capability is either
   implemented with real graph-derived logic and tests, or it is absent. Existing
   non-EEF empty stubs are consumer-impact evidence only; they do not authorise
   preserving current EEF stubs or building new ones.

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

9. **No backward dependencies; explicit pure graph construction; freshness is
   WITHDRAWN.** Raw-corpus types are fixed in the foundation (D2) and flow forward.
   D5 then constructs/adapts the graph-native EEF view from that raw foundation.
   This boundary is pure and infallible for data-shape purposes; it is not a
   validation layer, and it is not optional ceremony. It may produce a materialised
   graph-native structure or a lazy view, but the boundary must be explicit so graph
   operations and MCP schemas derive from graph-native semantics. The raw EEF data
   is definitively not the EEF graph contract; even when a graph-native projection
   carries raw fields verbatim, the graph view remains an explicit typed projection
   from the raw foundation and preserves its exact id, payload, and edge facts. The
   Zod parse, the fallible loader
   variants, and the **entire freshness apparatus** are removed. Freshness was never
   an ADR-175 *code* requirement - ADR-175 was a plan-promotion safeguard with no
   bearing on any code, it is of little use, and it is WITHDRAWN and DELETED.
   `freshness.ts`, `checkFreshness`, `DEFAULT_THRESHOLD_DAYS`, the `Freshness*`
   types, the `loader.ts` binding, the freshness tests, the package re-exports, and
   every ADR-175 code reference are deleted (D5); WITHDRAWN is added to the ADR
   lifecycle vocabulary and ADR-175 is marked WITHDRAWN then its record deleted
   with all inbound references removed (D0). Construction is infallible for
   data-shape purposes; only a genuine external request (an unknown key) can fail,
   at the request boundary. Source
   attribution and caveats travel with the evidence as TEACHER VALUE (D1), not as
   a freshness or governance obligation; whether `last_updated` is surfaced is a
   D1/D3 value-contract choice with no tie to ADR-175.

10. **Contaminated documentation is corrected or deleted, never left live.** The
   wrong concepts are not confined to this plan's targets - they are written into
   surviving ADRs, EEF plans, archived artefacts, and dozens of code comments (the
   obsolete list-era gate-label framing, freshness/ADR-175, Zod-over-corpus, the list-tool,
   the normalized node interface). Each in-scope live reference drags execution
   back toward the wrong position. Every contaminated reference gets a recorded
   disposition - correct, delete, or covered-by-a-named-deliverable - and the
   acceptance is a clean sweep of EEF plans plus non-plan documentation (see the
   Estate Decontamination section).

## Value And Impact

Teacher-facing value is the root of this plan. The graph and MCP layers are
delivery mechanisms; they are correct only if they make the assistant better at
the cover-lesson job without hiding uncertainty or inventing evidence.

This section is the canonical D1 value-contract surface. D1 updates this section
with stable subheadings for the ratified scenario, teacher job/value claim,
assistant role, corpus-derived evidence/provenance contract, non-claims/use
limits, smallest success criteria, and the D1 handoff boundary to D3/D4. The value
contract may be extracted from the plan into documentation later; for D1 it lives
here. Do not create an ADR for the D1 scenario or value artefact itself unless the
owner ratifies a reusable evidence-use policy beyond this EEF surface.

**D1 ratification status (2026-05-31): COMPLETE.** The owner ratified the value
claim, assistant role, use/avoid conditions, teacher-replacing-language
non-claims, proactive-vs-explicit invocation rule, V1 teacher-facing evidence
field set, V2 internal-only `last_updated`/`data_version` decision,
faithful-evidence-transmission standard, corpus-derived evidence/provenance
contract, schema-derivation chain, and D7 value-proof obligations below. The
value-trace findings are folded directly into this section; the working
value-trace brief/report are archived as historical scratch artefacts, not live
sources.

### What EEF is, and how relevance works

The EEF Teaching and Learning Toolkit is **evidence about teaching strategies and
school decisions** — its strands are pedagogical approaches (feedback,
metacognition, oral language, reading comprehension, mastery, collaborative
learning, and similar) and school-level interventions, each carrying impact
(months of progress), cost, evidence strength, key findings, and caveats. EEF
answers *how to teach, and what the evidence says about a teaching decision*; Oak
answers *what to teach*.

EEF relevance is a function of the **pedagogical move**, expressed through EEF's
own axes: the approach itself (a strand), the EEF priority (e.g. closing the
disadvantage gap, improving reading), the key stage / phase, and the
impact/cost/evidence-strength leverage lens that answers the cover-lesson
teacher's real question — *what is high-impact for low effort here.* Every one of
these axes is a finite value drawn from the fixed EEF data, so each input the EEF
tool accepts is a known key from the corpus.

**Where the value intersects Oak's tools (the workflow).** The value surfaces
while the assistant is adapting an Oak lesson, at the moment Oak's *own* tools
raise a pedagogical signal:

- Oak's misconception graph surfaces a misconception → EEF evidence carried by the
  `eef-tl-feedback` and `eef-tl-metacognition-and-self-regulation` strands;
- Oak's prior-knowledge graph surfaces a weak prerequisite → EEF evidence carried
  by `eef-tl-mastery-learning` and `eef-tl-oral-language-interventions`;
- the lesson carries a quiz → EEF evidence carried by `eef-tl-feedback` and
  `eef-tl-metacognition-and-self-regulation`; a dense text →
  `eef-tl-reading-comprehension-strategies` and `eef-tl-oral-language-interventions`.

The move names a teacher uses ("explicit instruction", "retrieval practice") are
the agent's pedagogical vocabulary, not EEF inputs. Every example move must
resolve to a strand that exists in the corpus — the EEF tool's keys are real
strand ids, priorities, and phases. The corpus has no "explicit instruction" or
"retrieval practice" strand; their evidence is carried by the strands named above.

The assistant reads the Oak signal, names the pedagogical move, then queries EEF
for the evidence on that move. The composition happens at the **workflow level**:
the user-facing prompt orchestrates Oak's tools and the EEF tool, each EEF tool
call carrying the finite fixed-data keys for the move. EEF's native axes being
finite is what keeps the deterministic boundary clean.

**Scope boundary for this plan.** This plan's teacher-facing surface covers the
classroom-pedagogy strands a teacher acts on when adapting a lesson. The
school-policy / school-leadership strands (reducing class size, teaching
assistants, setting and streaming, performance pay, summer schools, extending
school time, and similar) serve a *school-leader* user and a different decision;
they are owned by a separate follow-on plan led by clear school-leader value,
[`../future/eef-school-leadership-evidence.plan.md`](../future/eef-school-leadership-evidence.plan.md).
Classroom strands whose evidence is `Insufficient`, null, or debunked — notably
`eef-tl-learning-styles` and `eef-tl-aspiration-interventions` — stay in this
teacher-facing set: their "don't waste effort" finding is high cover-lesson value
and is not school policy. The corpus stays whole.

When this plan is complete, an AI assistant in an MCP-capable host (ChatGPT,
Claude Desktop, Gemini, etc.) can help a teacher:

- find or assemble relevant Oak lesson material for a specific subject, key
  stage, and topic;
- ask for relevant EEF evidence when pedagogical choices need grounding;
- receive EEF evidence scoped to the pedagogical move and the Oak-surfaced signal,
  as a focused subgraph rather than the whole corpus;
- inspect the returned evidence with its caveats, attribution, and relevant
  relationships intact;
- follow related evidence only when the relationship helps the teacher's
  decision;
- preserve EEF attribution, caveats, evidence strength, cost, and impact in the
  material it drafts for the teacher.

The teacher experiences practical help under time pressure: usable cover
material, clearer pedagogical choices, transparent evidence caveats. The teacher
never needs to know a graph exists.

The first concrete scenario is a teacher preparing cover material on Sunday night
for a Monday lesson because another teacher is unexpectedly absent. The teacher
trusts Oak's materials and wants the assistant to adapt or assemble them,
enhanced by EEF evidence, not replaced by generic pedagogical advice.

The ratified value claim: **EEF turns curriculum retrieval into
evidence-calibrated lesson adaptation, while preserving professional judgement
and uncertainty.** Oak API tools fetch curriculum data; Oak search tools find
relevant content; EEF adds pedagogical judgement context that helps the assistant
adapt Oak material with evidence strength, cost, impact, caveats, uncertainty,
and partial-coverage honesty.

Illustrative example only: for a Sunday-night cover lesson, the assistant can
find Oak material for the teacher's curriculum need, then use EEF evidence to
shape how that material is adapted. The assistant might surface relevant
evidence-informed considerations, explain why they matter, preserve strength,
cost, impact, attribution, and caveats, and state what the evidence cannot prove.
This example demonstrates the value contract; it is one of many use cases, and the
product spans every lesson a teacher might bring.

The scenario is concrete in teacher situation and value proof, not in a single
subject slice. Because EEF relevance is by pedagogical move, the surface works for
any lesson the teacher brings, across every subject, key stage, and phase. D1
examples illustrate the contract; the contract spans the full estate.

When EEF evidence is weak, partial, or absent for the teacher's context, the
assistant must make that explicit in teacher-facing output. The teacher is the
expert; the assistant provides options, evidence context, and honest limits so
the teacher can decide what to adopt or change. It must never do the teacher's
professional judgement for them.

Teacher-facing EEF output must avoid teacher-replacing selection language. The
assistant presents evidence-informed options, trade-offs, and limits for the
teacher to weigh; it must not name a preferred action, imply a single chosen
action, or tell the teacher what to adopt or change.

The evidence standard is **faithful evidence transmission**, not local efficacy
proof. The assistant must preserve EEF evidence as evidence: source, meaning,
strength, impact, cost, caveats, uncertainty, limits, and non-claims travel with
the pedagogical option they inform. The success claim is not "this adaptation will
improve this class"; it is "this is the population-level EEF finding, here is what
it does and does not justify, and here is how it may inform the teacher's choice."
EEF evidence can support evidence-calibrated options and trade-offs, but it never
proves individual-pupil, class-specific, or guaranteed local learning gain.

There is no separate teacher-facing evidence vocabulary to justify from the data.
The EEF data, methodology, and provenance fields are the vocabulary. Every
concept or phrase the assistant surfaces as EEF evidence must be traceable to the
fixed corpus or its corpus-level metadata. The schema derivation chain is:

```text
raw EEF data -> typed raw foundation -> graph-native EEF view -> named graph-view subset/schema-builder -> single Zod call -> MCP schema
```

Schemas are therefore deterministic, type-strict projections of the graph-native
EEF view, not direct raw-data transforms; the graph-native view is the
provenance-preserving projection from the raw data. If a concept cannot point
back through that chain to the EEF corpus, methodology, or provenance surfaces, it
is not an EEF evidence concept.

EEF invocation is both explicit and proactive. The assistant should use EEF when
the teacher asks for evidence context, and it should also bring EEF in when the
assistant is already adapting, combining, or framing Oak material pedagogically.
Whenever EEF is invoked, the assistant should briefly say what prompted it, using
a terse calling-agent pattern such as "EEF because: [pedagogical choice]." The
calling agent may vary the wording as needed, but the reason must stay short and
clear.
It should not bring EEF in for curriculum retrieval alone.

`data_version` and `last_updated` are internal metadata for debugging and
logging. They are not teacher-facing evidence context and do not create a
freshness obligation in the value contract.

The D1 value criteria are implementation-independent. They are not satisfied by
old capped-list behaviour, preservation of the old list output, or output parity
with the old tool. Any overlap with old output is
acceptable only as an incidental result independently re-derived from ratified
D1 value, D3 MCP surface, and D4/D5 graph structure.

### Teacher-facing evidence field set (V1)

The teacher-facing payload surfaces, per strand, the value the corpus already
holds: `headline` (impact months, cost rating/label, evidence-strength
rating/label, headline summary), `definition`, `key_findings`,
`effectiveness.{summary, mechanisms}`, `behind_the_average` — including
`behind_the_average_by_phase` and `applications` where present, so the evidence
answers *at which key stage* (for example `eef-tl-feedback` primary 7 / secondary
5; oral 7 / written 5) — `implementation.{key_considerations, common_pitfalls}`,
the relevant `school_context_relevance`, `related_strands`, the strand's
`related_guidance_reports` (surfaced per the D4 disposition), and the applicable
`meta.caveats`. Honest insufficiency is first-class value: a strand with
`impact_months: null` / `evidence_strength_label: 'Insufficient'` (for example
`eef-tl-aspiration-interventions`, `eef-tl-learning-styles`) surfaces that finding
so the teacher does not waste effort. This is the canonical V1 answer; the D3/D6
output schema is the typed subset of the graph-native view over exactly this set.
The owner ratified this set on 2026-05-31.

The impact/cost/evidence leverage lens ("high-impact for low effort") surfaces
these as comparable **facts and options**, never as a ranked recommendation or a
chosen action — the no-teacher-replacing-selection rule above governs it.

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

The corollary that holds for this system specifically: **every semantic boundary
here narrows a value into a KNOWN FINITE SET** - a strand key, an EEF priority, a
key stage / phase value, or a raw headline metric value/label present in the fixed
EEF data (`impact_months`, `cost_rating`, `cost_label`,
`evidence_strength_rating`, `evidence_strength_label`). Subject and topic are Oak
workflow context, not EEF tool inputs. Narrowing into a known set is a type-guard
predicate (`value is T`, ADR-153), not a schema parse. The MCP protocol still
receives an unknown argument envelope, so each MCP tool input schema and output
schema is derived by a single Zod call on the appropriate subset of the
graph-native EEF view (Decision 2's controlling definition), and the SDK validates
the tool's `structuredContent` against the output schema. No Zod schema parses the
corpus, and no hand-authored parallel schema describes it.

Schema-first scoping: schema-first derivation (`z.infer` from the OpenAPI schema)
governs the **unknown** upstream API surface elsewhere in the repo. For this
system, the `as const` constant is the schema - "types flow from schema" is
satisfied with the data-as-schema, and runtime narrowing is by predicate.

Forbidden everywhere in this system: `unknown` at the fixed-data boundary; Zod
parsing or validation of corpus data (the SOLE permitted Zod calls are the MCP
tool input and output declarations of Decision 2, each derived from the
graph-native EEF view); any freshness gate over the corpus (ADR-175 withdrawn and
deleted); type
assertions that "recover" a shape the constant already has; hand-authored or
Zod-inferred parallel/normalized schemas; response caps or rank-and-cut over graph
results.

## Estate Decontamination (cross-cutting)

The discarded positions are written across the estate, not just this plan's
targets. Until each reference is corrected or deleted it keeps dragging execution
back (Ratified Decision 10) - the readiness review itself was briefly mis-led by a
stale list-era comment. This is a sweep + disposition ledger, not a guess: every
hit for the contaminated concepts gets a recorded disposition (correct / delete /
covered-by-a-named-deliverable).

**Core defect - the obsolete `validate-external-data-files` validator.** D0
deleted the entire validator, not only the `data-export-must-be-unknown` and
`no-unknown-data-export` rules. Those rules mandated that the `as const` corpus be
typed `unknown` - the exact thing `unknown-is-type-destruction` / ADR-034 forbid -
but the wider validator was also the wrong tool for one known corpus file. The
surviving mechanism is the `.external-data.ts` suffix plus Sonar/ESLint
duplication exclusion; the file stays logic-free by inspection. Every live
reference to the deleted validator and its `unknown` typing contract was corrected
or recorded in the D0 ledger.

**Sweep tokens** (the discarded concepts; `rg` each, disposition every live hit):

- `data-export-must-be-unknown`, `no-unknown-data-export`, "must export ... unknown"
- Obsolete list-era gate-label literals - ~72 occurrences across ~19 EEF SDK
  files (verified count 2026-05-30; re-run the D0 ledger query at execution as
  the source of truth - there is no separate prompt-messages file). Most sit in
  files D2/D5/D6 delete; the remainder are corrected when those deliverables
  rewrite the surviving files. The estate-wide gate-label framing in the graph
  plans is owned by
  graph-estate-consolidation.plan.md, not this plan.
- `freshness`, `checkFreshness`, `DEFAULT_THRESHOLD_DAYS`, `ADR-175`, `180-day` -
  freshness apparatus + ADR-175 (code deleted in D2 with the load/list/Zod path;
  ADR/doc refs completed in D0)
- `EefStrandSchema`, `EefToolkitSchema`, `z.infer<...Strand`, `strand-schema` -
  Zod-over-corpus (D2 deletes every non-source-of-truth raw vocabulary, school-context
  Zod consumer, `strand-schema.ts`, loader, freshness, and old-list surface while
  re-homing the raw type; D5 consumes the D2 raw foundation and verifies the deleted
  path stays absent)
- `response-budget`, `capForBudget`, `projectExploreNode` - list-era cap (D5/D6)
- the speculative `EvidenceCorpus` `rank`/`explain`/`compare` ops (D4)
- stale STRUCTURAL references to the quarantined design docs - their deliverable
  numbers ("rebuild D2/D6"), principle numbers ("foundation principle N"), and the
  "rebuild" / "rebuild foundation" framing. These use clean vocabulary but point at
  dead structure and mis-navigate agents (e.g. "removed in rebuild D2" sends an
  agent to the live plan's D2 - the typed raw-corpus foundation - not the op removal in
  D4). A concept-token sweep alone misses these; adjacent plans need a content read.

**Surface -> owning deliverable.** Code in files slated for deletion is covered by
its deliverable (D2 school-context Zod, strand-schema, loader, freshness, old-list
tool, list-era cap, citation-shape where it has no non-list consumer, and every
required consumer repoint/removal; D4 EvidenceCorpus ops; D5 graph projection and
operation implementation; D6 graph MCP composition). Surviving code with contaminated
comments is corrected by the deliverable that owns the file. D0 has already
corrected the non-code surfaces it owned: the ADRs;
`docs/governance/sonar-disposition-policy.md`; `sector-engagement/roadmap.md`;
and the EEF thread record's CURRENT-TRUTH banner. The two old design docs (the
rebuild plan and its foundation) are **quarantined** in `archive/` with every live
link severed (2026-05-30) - they are symptoms of the superseded broken concept,
not artefacts to correct, and nothing live points at them.

**Scope: EEF plans and non-plan documentation.** This decontamination owns the EEF
graph stack's current guidance surfaces: EEF plans, EEF docs/README/thread
surfaces, non-plan documentation elsewhere in the repo (for example ADRs and
governance docs), the validator, and references to the quarantined EEF design
docs. The sweep explicitly excludes non-EEF plan files: the wider graph estate -
obsolete list-era gate-label framing across the graph plans, and the disposition of the
structurally-gate-based coordination plans (`graph-mvp-arc`,
`graph-portfolio-index`, `graph-combinatorial-arc`) - is owned by
**`graph-estate-consolidation.plan.md`**, the nominated master plan for graph
consolidation and rewriting. EEF code comments with contaminated guidance are
recorded in the ledger and corrected by the deliverable that owns each file.

**Knowledge preservation.** Superseded *history* (the thread record's marked
superseded sections, archived plans, the napkin and comms log) is NOT rewritten -
it is preserved as the record of what was wrong and why (`knowledge-preservation`
rule). Only LIVE guidance - anything an agent reads as a current instruction - is
corrected or deleted. The ledger records each history reference as
`history-retained`.

**Acceptance.** The disposition ledger is complete (every hit recorded), and a
final sweep over EEF plans plus all non-plan documentation returns zero LIVE
references to the discarded concepts (history, changelog, and non-EEF plan files
excluded). The ledger is the proof nothing was silently dropped.

## Deliverables

Deliverables are ordered for execution, with `depends_on` capturing true
dependencies. D0, D1 have no prerequisites and may run in parallel; D2 (the
brought-forward foundation) depends only on D0. Product-code deliverables are
TDD landings - test and product code co-land in one commit. Contract
deliverables (D1, D3, D4) are exploration-and-ratify work with `non-code` proof.

### D0 - Fixed-data doctrine + validator expunge + estate decontamination (tree-green-first)

> **EXECUTION STATUS (2026-05-30 PM, Opalescent Transiting Prism) — RESHAPE +
> PROGRESS.** The validator work is RESHAPED by owner direction: the ENTIRE
> `validate-external-data-files` validator is **DELETED**, not "expunge two rules,
> keep two". The right tool to keep one external-data file logic-free is
> inspection, not an AST validator + test suite — so the "keep
> `logic-export-forbidden` + `missing-provenance-docstring`" framing was itself
> the conservation reflex and is **superseded wherever it appears in this plan**:
> the frontmatter step (7), Ratified Decision 3 (below), the "Do — validator
> expunge" / "Do — data-file cleanup" steps, and the "Done when" acceptance
> criterion + Proof line that reference the now-deleted validator unit tests.
> Every such "keep two rules" / "validator unit tests" reference reads as
> **validator DELETED ENTIRELY**; the surviving mechanism is the `.external-data.ts`
> suffix + Sonar/ESLint exclusion, kept logic-free by inspection.
> **Commit 1 (code) is DONE:** the
> validator (5 `agent-tools/src/external-data/` files + the bin) and both
> `package.json` wirings are deleted; the `.external-data.ts` suffix + Sonar
> cpd-exclusion + ESLint ignore are KEPT (the real duplication-gate mechanism);
> `strandById`/`Strand`/`StrandByStrandId`/`lastUpdated`/`EefToolkitData` are
> relocated from the corpus file into a new checked module
> `packages/sdks/graph-corpus-sdk/src/eef-strands/strand-lookup.ts`
> (barrel-exported); `.external-data.ts` is now pure data. `repo-validators:check`
> exit 0; graph-corpus-sdk + agent-tools type-check + tests green; knip/lint/format
> clean. **Commit 2 (ADR doctrine items 1–6 + estate decontamination) is DONE:**
> ADR-038 generalised (dated
> Amendment Log — all `as const`-known constants; external≠unknown vocabulary;
> cites the `unknown-is-type-destruction` RULE as linchpin, with ADR-034 noted as
> the ADR it operationalises since ADR-034 does NOT itself state that wording —
> verified this session — plus ADR-153/ADR-028); ADR-157 corrected (Typing
> Discipline + Trade-offs to `as const` derivation; both ADR-175 refs removed; NOT
> marked superseded); ADR-173 corrected in **four** Zod-loader locations (the
> §First-wave intro instance was un-enumerated in the plan and caught by
> recomputing the estate); ADR-175 inbound refs removed (3 README entries) +
> **`Withdrawn`** added to the lifecycle vocabulary; `sonar-disposition-policy.md`
> l.357/450 corrected; `eef/README.md` frame rewritten (one live plan; all
> dangling links + withdrawn-freshness framing removed); `conservation-map.md`
> marked historical + preserved; `repo-continuity.md` stale "two rules" framing
> corrected; decontamination ledger written at `eef-d0-decontamination-ledger.md`.
> Verified: zero ADR-175 markdown links; no EEF-corpus-Zod current-truth;
> markdownlint + prettier clean repo-wide.
>
> **D0 is COMPLETE (owner-confirmed 2026-05-31) and intent-vs-letter audited.** A
> 4-dimension adversarial audit (letter / intent / conservation-reflex /
> cross-session coherence) confirmed the intent is met — the gate was greened by
> DELETION (not by retyping the corpus to `unknown`), the corpus is typed by
> derivation, and the doctrine is coherent across the ADR estate — and surfaced
> one root-cause residue (the validator-deletion reshape recorded only here, not
> propagated), now closed: the shipped-code stale list-era line in
> `eef-toolkit.external-data.ts` corrected; the stale "keep two rules" framing in
> Ratified Decision 3 / the frontmatter step (7) / the "Do — validator expunge"
> step / the "Done when" + Proof lines superseded-in-place; the ledger's
> `roadmap.md` + corpus-file + list-era code-comment dispositions added. The one
> remaining landing action has now landed: full `pnpm check` was green and the
> whole D0 bundle was committed at `ce9745c7` (2026-05-31; not pushed at the time
> of the closeout record). Full record: the `eef` thread record EXECUTION UPDATE
> banner + `eef-d0-decontamination-ledger.md`.

**Purpose:** correct the known-vs-unknown doctrine across the ADR estate, expunge
the obsolete external-data validator, and decontaminate EEF plans plus non-plan
documentation of references that embody the discarded positions. It was sequenced
first because the repo-validators gate was red on the pre-D0 branch and because
the contaminated docs otherwise dragged every later deliverable back.

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
  EEF Zod clauses - the Typing Discipline row (BOTH sentences: "Typed interfaces
  with Zod validation at load time" AND "Zod validation catches schema drift
  between the file and the declared types") and the Trade-offs sentence ("Zod
  validation at load time mitigates this for static data (EEF)") - with the
  `as const` typed-derivation direction pointing at the generalised ADR-038. Do
  not mark the whole ADR superseded (ADR-038 does not cover its ontology/URI
  content). Remove BOTH its ADR-175 references - the Related-section link AND the
  Status Amendment Note body paragraph asserting ADR-175's freshness decision is
  "binding" (ADR-175 is being deleted).
- Correct **ADR-173** (graph-stack-topology) in ALL FOUR places the Zod-loader
  designation appears - the amendment-summary header, the First-wave ingestion
  scope item, the Consequences positive bullet, and the lateral cross-reference to
  ADR-157 §Typing Discipline - to the typed direct-load (no Zod, no separate schema
  file), keeping the "corpus-local / no graph-ingest participation" structural
  facts intact; carry a dated 2026-05-30 amendment note.
- **ADR-175** was a plan-promotion safeguard with no bearing on any code, and of
  little use. First add **WITHDRAWN** to the ADR lifecycle vocabulary (the
  `architectural-decisions/README.md` Lifecycle section, alongside
  Proposed/Accepted/Superseded/Deprecated), then mark ADR-175 **WITHDRAWN** and
  **DELETE the record entirely**. Remove ALL inbound references: all **three**
  README index entries (`docs/architecture/README.md`, the
  `architectural-decisions/README.md` Index block, AND its "Key Architectural
  Decisions" entry still labelled "Accepted") and **both** ADR-157 references (the
  Related link AND the Status Amendment Note paragraph). The freshness CODE removal
  lands in D5.
- Do NOT edit **ADR-032/003** - they are correct as written (they validate
  genuinely-unknown *structure*); their only gap was a vocabulary note, now housed
  in the ADR-038 amendment, not inside those repo-wide ADRs.

**Do - validator expunge:**

The ENTIRE `validate-external-data-files` validator was DELETED in D0 (all rules,
the bin, the tests, both `package.json` wirings, and the `repo-validators:check`
segment). It was not trimmed to two rules. The `.external-data.ts` file is kept
logic-free thereafter by inspection.

**Do - data-file cleanup:**

- Move `strandById`, `StrandByStrandId`, `Strand`, `lastUpdated`, and
  `EefToolkitData` out of `eef-toolkit.external-data.ts` into the checked
  foundation module. This is complete in D0; the `.external-data.ts` file is now
  pure data.

**Do - estate decontamination:**

- Run the **Estate Decontamination** sweep + disposition ledger (see that
  section). D0 owns EEF plans and non-plan documentation surfaces (ADRs, the
  thread record, the foundation doc, README indexes, governance docs) and the
  validator; contaminated CODE comments in surviving files are given a disposition
  here and corrected by the deliverable that owns each file (D2/D5/D6); files
  slated for deletion are recorded as covered-by-Dn. Non-EEF plans are recorded as
  out of scope and owned by `graph-estate-consolidation.plan.md`.

**Done when (acceptance):**

- `pnpm repo-validators:check` is green; an `as const` data export is not reported
  at all on type grounds.
- ADR-038 covers fixed `as const` constants and cites `unknown-is-type-destruction`
  / ADR-034; ADR-157's two EEF Zod clauses are corrected in-record; ADR-173 no
  longer designates an EEF Zod loader in any of its four locations; **WITHDRAWN is
  defined in the ADR lifecycle and ADR-175 is marked WITHDRAWN then its record
  deleted**, with all three README entries and both ADR-157 references removed;
  ADR-032/003 are unchanged; the ADR-028 citation is corroborating-only.
- The `data-export-must-be-unknown` and `no-unknown-data-export` rules - code,
  union members, and contract docstring - no longer exist. **[SUPERSEDED
  2026-05-30: the ENTIRE validator was deleted, so no rule remains and there are
  no validator unit tests; see the EXECUTION STATUS block.]** `pnpm
  repo-validators:check` exits 0 because the erroneous rules are gone, and the
  one `.external-data.ts` file is kept logic-free by inspection.
- No logic remains in `eef-toolkit.external-data.ts`; `strandById`,
  `StrandByStrandId`, `Strand`, and `lastUpdated` live in the checked foundation
  module.
- The Estate Decontamination ledger is complete: every contaminated reference has
  a recorded disposition, and the final acceptance sweep covers EEF plans plus all
  other non-plan documentation while excluding non-EEF plan files.

**Proof:** ADR/doc diff + ledger for documentation changes; `pnpm --filter
@oaknational/graph-corpus-sdk test` + `type-check` for the relocated
`strand-lookup.ts` foundation; gate observation (`pnpm repo-validators:check`
exit 0 — the validator and its tests are **deleted, not updated**); ledger
artefact for the decontamination dispositions; full `pnpm check` green before
commit `ce9745c7`.

### D1 - Teacher value & impact contract (exploration; owner-ratified)

**Purpose:** make the teacher value explicit before any tool or graph shape is
chosen. Independent of D0/D2; may run in parallel. D1 may name value-driven
questions for D3/D4, but it must express success in teacher, assistant, and
evidence terms only. It must not ratify MCP tool/resource names, schemas,
graph-native structure, graph-core operations, node policies, resource URI
shapes, or old-list behaviour.

**Folded detail:** D1 answers the V1 teacher-facing field set, V2
`last_updated`/`data_version` surfacing, and V4 verbatim-preservation questions
directly in `## Value And Impact`; the old list tool's `projection.ts` field set
is cap-sized, not a neutral baseline.

**Do:**

- Explore the Sunday-night cover-lesson scenario end to end.
- Write the ratified value contract into the canonical `## Value And Impact`
  section. Later documentation extraction may lift it out of the plan, but D1's
  canonical working home is this section.
- Shape the scenario as a concrete value oracle: teacher context, the pedagogical
  move(s) the lesson raises and the Oak signals that surface them (misconceptions,
  prior knowledge, quiz, text), the Oak-material role, the EEF-added value,
  observable assistant behaviour, and the D7 value-proxy obligations.
- Define the teacher-facing job, assistant role, and value claim.
- Define what EEF evidence must add to Oak material.
- Preserve the owner-ratified value claim and illustrative Sunday-night example
  in `## Value And Impact`, making clear that the example demonstrates the value
  contract and does not narrow the future use-case estate.
- Define the corpus-derived evidence/provenance contract: every concept, phrase,
  payload field, and resource field surfaced as EEF evidence is traceable to the
  fixed EEF data, methodology, or provenance surfaces. Schema fields are one step
  downstream: they are deterministic, type-strict projections of the graph-native
  EEF view, while the graph-native EEF view is itself the provenance-preserving
  projection from raw data. Do not author or justify a separate teacher-facing
  evidence vocabulary beside the data. For each surfaced concept, make the source
  field or source surface visible enough that the teacher-facing meaning,
  caveat/non-claim, and D7 verbatim/provenance obligation are traceable back to the
  corpus. Record `data_version` and `last_updated` as internal debugging/logging
  metadata, not teacher-facing evidence context or freshness governance.
- Record the evidence standard as faithful evidence transmission rather than
  local efficacy proof: D1/D7 prove that the assistant preserves the EEF finding's
  source, meaning, strength, limits, caveats, uncertainty, and non-claims through
  the teacher-facing workflow. They do not prove, imply, or ask downstream tests to
  prove that a chosen adaptation improves a specific class or pupil.
- Define use and avoid conditions for EEF at the value layer. EEF supports
  evidence-informed decision support through options and trade-offs, not
  preferred actions; it is used when pedagogical choices need evidence context
  whether the teacher explicitly asks for evidence or the assistant is already
  adapting, combining, or framing Oak material pedagogically. It is avoided for
  curriculum retrieval alone, guaranteed outcomes, individual-pupil or
  class-specific causal claims, policy decisions, teacher-replacing wording,
  single-answer selection, contexts where relevance and caveats cannot be
  preserved, or invocations where the assistant cannot briefly name, via a
  flexible calling-agent pattern, what prompted EEF.
- Define what the assistant must not infer or promise from EEF data, including
  no guarantee of learning gain, no replacement of teacher professional
  judgement, no teacher-replacing selection language, no implied chosen option, and no
  automated selection of one approach for the teacher.
- Define the smallest successful round trip that proves user value.
- Name the corpus-derived values D7 must preserve verbatim through the typed
  raw/graph-native/MCP chain without choosing graph representation: at minimum a
  known strand's caveat text, attribution, evidence strength, cost, and impact.
- Record the D1 handoff boundary: D3 owns MCP names, schemas, resource/template
  URIs, prompt arguments, SDK/app registration verification, and host feasibility;
  D4 owns the graph-native view, node/edge policy, graph-core operation contract,
  and consumer-impact record. Neither D3 nor D4 may alter D1's teacher-value
  claims, evidence-preservation obligations, or non-claims without returning to
  owner ratification.

**Done when (acceptance):**

- The canonical D1 value-contract surface is written in `## Value And Impact` or
  later extracted documentation that links back to this plan; for D1, its content
  is not scattered across D1, D7, and downstream sections.
- The first value scenario is written as a concrete value oracle: given a teacher
  context and the pedagogical move(s) a lesson raises, success means the assistant
  output uses Oak material plus EEF evidence for those moves, preserves named
  evidence fields and caveats, states limits, and gives D7 a specific value-proxy
  to test.
- Expected assistant behaviour is described from the teacher's point of view.
- Evidence caveats, corpus-derived concept/provenance rules, verbatim-value
  obligations, use/avoid limits, and explicit non-claims are recorded.
- The evidence standard is recorded as faithful transmission of population-level
  EEF evidence and its limits, not a local efficacy proof for a specific class,
  pupil, or chosen adaptation.
- D1 records that no separate teacher-facing evidence vocabulary or schema shape is
  authorised beside the EEF data: every surfaced concept and every downstream
  schema field must be traceable through the chain raw EEF data -> typed raw
  foundation -> graph-native EEF view -> named graph-view subset/schema-builder ->
  single Zod call. The MCP schemas project graph form; graph form projects raw
  data with provenance preserved.
- D1 explicitly records that it does not ratify MCP tool/resource names, schemas,
  graph-native structure, graph-core operations, node policies, resource URI
  shapes, old list-era behaviour, or output parity with the old tool.
- The owner ratifies the value statement and success criteria before D3 proceeds.

**Proof:** `non-code` (owner ratification recorded in the canonical D1 value
contract surface).

### D2 - Typed raw-data ingestion foundation (brought forward)

**Purpose:** build the typed raw-data ingestion foundation - everything derivable
from the in-memory `as const` constant alone. Depends only on D0 and the corpus.
This is the source snapshot and type source, not the final graph-native contract;
D5 owns the construction/adaptation boundary that ingests this raw foundation into
the deterministic graph-native EEF projection. There is no runtime corpus load,
parse, freshness check, compatibility wrapper, or old-list bridge.

**Folded detail:** the typed-raw-foundation finding grounds the `as const`
derivation, and the `EefPhase` wrong-source hazard is resolved by the
owner-corrected rule here: the fixed EEF data structure is the authority and the
correct answer is whatever that structure contains. D2 derives vocabulary values
by projecting from `EEF_TOOLKIT_DATA` itself, never from hand-authored tuples,
maintained key lists, or a glue layer between a proposed input and the data.
D2's projections are raw-foundation projections only. Teacher-facing payloads,
MCP schemas, graph-native subsets, and graph-operation semantics depend on the
graph-native EEF view ratified and built in D3-D6; D2 supplies exact raw facts to
that chain and does not skip it. D2 is also the deletion point for the old
load/list/Zod/freshness path: a wrong source-of-truth surface is removed, not
kept alive until the graph projection is ready.

**Do (TDD cycles; each cycle test+code co-land):**

- Derive `EefStrand = (typeof EEF_TOOLKIT_DATA.strands)[number]`, `EefStrandId`,
  `EefStrandById`, and `EefToolkitData` via `typeof`/indexed access. Canonicalise
  the raw strand type name as `EefStrand`; the D0 `Strand` name is absorbed or
  renamed so the raw strand has one name everywhere. Derive named raw domains from
  explicit source paths in `EEF_TOOLKIT_DATA`, not from maintained tuples:
  - D3 graph-filter input domains come from observed strand applicability facts:
    `school_context_relevance.most_relevant_phases`,
    `school_context_relevance.most_relevant_key_stages`,
    `school_context_relevance.most_relevant_priorities`, and any
    graph-ratified `behind_the_average.by_phase` keys;
  - declared `school_context_schema` enums are typed raw metadata only, not D3
    filter domains. Both the observed applicability facts and the declared enums
    come from their own named corpus source paths; neither is hand-authored, and
    they are one corpus read from two fields, not two vocabularies to reconcile.
    D2 computes the divergence between each declared enum and the values strands
    actually carry, and records any declared value with no backing strand as a
    corpus fact for D3/D4. A declared enum becomes a D3 filter input only if D3
    ratifies it and that D2 divergence record shows it yields no empty-but-valid
    filter result;
  - raw headline metric domains come from strand `headline` fields:
    `impact_months` (including `null` in the raw domain), `cost_rating`,
    `cost_label`, `evidence_strength_rating`, and `evidence_strength_label`;
  - interpretation-resource raw facts include `EEF_TOOLKIT_DATA.methodology`,
    `meta.caveats`, `meta.source`, `meta.licence`, `meta.coverage`, and any other
    corpus-level provenance or methodology field D3 names.
  The implementation may add derived projection helpers over the raw object graph,
  but it must not author or retain separate arrays of keys, values, field names,
  metric thresholds, metric labels, vocabulary constants, caveat classes,
  interpretation labels, or crosswalks. If a proposed tool input needs a value
  space that cannot be derived directly from a named `EEF_TOOLKIT_DATA` source
  path, stop for the owning D1/D3 contract correction.
- Build the `EefStrandById` keyed lookup type and the runtime raw id-to-strand
  lookup (built once; the single runtime raw-id surface). Remove the old
  `StrandByStrandId` naming or turn it into the renamed canonical type, never a
  parallel alias.
- Implement `isValidStrandKey(value: unknown): value is EefStrandId` backed by
  raw id-to-strand membership (ADR-153 pattern); non-string inputs return false.
- Build the typed `related_strand` raw edge facts from each strand's
  `related_strands`; derive corpus metadata, caveats, methodology, source,
  licence, and coverage facts from `EEF_TOOLKIT_DATA.meta` and
  `EEF_TOOLKIT_DATA.methodology`. D5 decides how those raw facts become
  graph-native nodes, edges, indexes, and envelopes.
- Re-home `EefStrand` to this checked foundation and repoint every importer. D2
  deletes every non-source-of-truth raw vocabulary/list/Zod/load/freshness surface
  outright. The definite D2 landing state is:
  `school-context.ts`, `school-context.unit.test.ts`, `strand-schema.ts`,
  `strand-schema.unit.test.ts`, `loader.ts`, `freshness.ts`, the loader/freshness
  tests, and the list-shaped `eef-explore-evidence-for-context` implementation are
  deleted; `index.ts` re-exports only the raw foundation surfaces; no `loadEefCorpus`
  API, compatibility wrapper, old-list MCP registration, Zod parser, freshness
  gate, or old-list product path remains. Predicates consume raw foundation
  values/types derived from `EEF_TOOLKIT_DATA`; MCP schema declarations later
  consume named graph-view subsets. If a proposed input cannot map directly to
  fixed known corpus data, that is a D1/D3 architectural misalignment, not a D2
  adapter concern.
- The old list implementation (`selection.ts`, `projection.ts`, and the
  `eef-explore-evidence-for-context` path) is deleted as part of D2 because it is
  the consuming old idea, not a product surface to keep alive during replacement.
  D6 later registers the graph-derived EEF MCP surface from the D3-D5 contract;
  no old-list output parity, fallback, wrapper, or side-by-side registration is
  authorised in the interim.
- Build on D0's relocated `strandById`, `StrandByStrandId`, `Strand`, and
  `lastUpdated` foundation by canonicalising that surface to the D2 names
  (`strandById`, `EefStrandById`, `EefStrand`, `EefStrandId`, raw metadata, and
  raw related-strand facts). D2 extends it into the full typed raw foundation that
  D5 consumes.
- Test migration is SPLIT, not blanket: structural-traversal tests
  (`graph-view.unit.test.ts` BFS / depth / cycle / sparse-root / error-path) KEEP
  their synthetic purpose-built fixtures - real corpus ids are unique, so
  `DuplicateStrandId` cannot fire through the typed API, and pinning corpus literals
  creates change-detectors. ONLY corpus-grounded tests (key membership, vocabulary
  derivation, raw lookup of a known real strand) operate on real members. The
  fabrication helper `makeStrand` returns `EefStrand`; once `EefStrand` is the
  precise union its return annotation and fabricated ids must move to the widened
  `buildGraphIndex` boundary or be reworked - design this before the cycle, not
  mid-cycle.

**Done when (acceptance):**

- `EefStrand`, observed graph-filter domains, declared metadata domains, all raw
  headline metric domains, methodology/caveat facts, provenance facts, and raw
  related-strand facts derive from named `EEF_TOOLKIT_DATA` source paths. D2
  derives these exhaustively from what the corpus structurally holds, not from a
  ratified D3 consumption set. D2 runs before D3, so it exposes every raw fact
  the corpus supports and keys the source-path table by raw source path. D3
  selects its subset from that table later. No `z.infer`-normalized node type,
  no Zod schema, no maintained key/value list, no maintained metric list, no
  glue vocabulary, no caveat class list, no interpretation ontology, and no
  hand-authored crosswalk remain in the foundation.
- `strandById('<literal>')` type-checks to the exact single strand;
  `isValidStrandKey` narrows an arbitrary value to `EefStrandId`, proven by a
  unit test (true for every real corpus id; false for a typo'd id, empty string,
  and a non-string input).
- `eef-toolkit.external-data.ts` still contains no logic after D2 extends the D0
  foundation; the foundation module is under standard quality gates; live
  consumers of the new typed foundation resolve vocabulary, observed-domain,
  methodology/caveat, provenance, and metric-domain imports against deterministic
  raw projection helpers derived from `EEF_TOOLKIT_DATA`. No teacher-facing
  payload, MCP schema, graph-native subset, ranking/selection behaviour, or
  output-parity target is introduced in D2. No `loader.ts`, `loadEefCorpus`,
  `freshness.ts`, old list tool, old list projection, or old list selection path
  remains.
- D2 records any broken-import/type-check fallout from deleting the wrong path as
  named in-flight D3-D6 replacement work; it does not add a wrapper, alias, old-path
  barrel, or compatibility module to make the old imports compile.
- Raw-foundation construction from the real corpus is proven by unit test,
  including key membership, observed-vocabulary derivation, declared-metadata
  domain derivation, the declared-vs-observed divergence record, headline
  metric-domain derivation, methodology/caveat and provenance derivation, raw
  lookup, raw related-strand facts, and metadata;
  consumers type-check against the derived types. D2 records a source-path table
  keyed by raw source path, one row per finite domain and corpus-level field
  the constant structurally holds:
  `raw source path -> raw projection helper -> proof test`. Each row may note a
  candidate D3 field, but that note is provisional at D2 time because D3 is not
  yet ratified: a row with no current D3 consumer is retained, not dropped, and
  D3 later selects its subset from this table rather than the table being
  trimmed to a guessed D3 surface. The executor verifies removal by reading the
  touched files/imports during the change and running the normal gates; D2 does
  not add a permanent negative-audit checker for the deleted mistakes.

**Proof:** `unit` (raw substrate, predicate, keyed lookup, observed and declared
domain derivation, the declared-vs-observed divergence record, headline
metric-domain derivation, methodology/caveat and
provenance derivation, raw related-strand facts, and metadata over the real
corpus) + source-path table + file/import inspection during the edit. Command:
`pnpm --filter @oaknational/graph-corpus-sdk test`. Full type-check proof belongs
to the settled D2-D6 replacement chain, not to D2 compatibility preservation.

### D3 - MCP tool/resource contract (exploration; owner-ratified, mcp-expert verification pending)

**Purpose:** design the surface the AI host uses, from the D1 value contract,
expressed through D2's raw-derived types and the D4-ratified graph-native EEF
view that D5 constructs/adapts, before any graph operation is finalised. D3 now
has two remaining products: a written MCP contract from the owner-ratified
decisions below, and a verification record proving that the installed SDK/app
registration path can carry that contract.

**Folded detail:** the settled three-primitive surface, deterministic input
boundary, field classification, output-schema subset, and SDK/app verification
record are carried here directly: the registration config at `handlers.ts:185-196`
carries no `outputSchema`, and both `registerTool` and `registerAppTool` paths
plus the `listUniversalTools` projection must be extended; the target is
structuredContent-only, not dual-content output.

**Do:**

- Build the practical-small surface: evidence for a pedagogical move, strand
  inspection, and corpus metadata. A graph-forward collection is a follow-on plan.
  Keep two surfaces distinct: the agent-facing MCP surface and the underlying
  graph tools it composes. The MCP surface composes graph tools as it needs.
- The EEF tool's inputs are the finite keys of the fixed EEF data: an
  `EefStrandId` selected by the invoking agent, an observed graph-projectable EEF
  priority, an observed graph-projectable key-stage / phase value, and exact-value
  filters over graph-projected raw headline metric domains (`impact_months`,
  `cost_rating`, `cost_label`, `evidence_strength_rating`,
  `evidence_strength_label`). Every input is a known value from the corpus or a
  graph-derived subset of those raw metric domains, narrowed by predicate at the
  boundary and cited in the D3 source-path table. D3 does not invent labels such as
  "high-impact" or "low-effort", metric buckets, threshold cut-offs, ranking
  weights, or comparator semantics as tool inputs. The calling agent may reason in
  those words, but the deterministic tool receives only exact corpus values or
  graph-ratified exact subsets. Subject and topic stay in the Oak workflow before
  the EEF call; they are not EEF inputs.
- Build one EEF MCP tool with a function/options shape, like a multitool CLI
  (`name -> function -> options`), not separate top-level MCP tools. D3 verifies
  the installed SDK/app registration and host discoverability as proof that this
  shape is executable, not as permission to preserve a second tool layout.
- Specify only real surfaces that D6 can implement end to end. D3 must not record
  placeholder tools, stub resources, fake prompts, migration bridges, or deferred
  handlers. If a proposed capability lacks a D1 value path, graph-derived
  behaviour, and an implementation/test route, it stays absent from the contract.
- Settled D3 MCP surface shape (2026-05-31 owner answer): expose three
  complementary surfaces by intention:
  - a deterministic EEF tool that queries/fetches the appropriate fixed EEF data;
  - an EEF interpretation resource/resource-template for "how to interpret and
    apply this data", including corpus methodology, caveats, source,
    attribution/provenance, and graph-structural field/edge names only;
  - a user-facing prompt that a teacher/user can invoke to start the
    evidence-grounded adaptation workflow.
- Use this as the default calling-agent workflow, while allowing D3 to specify
  additional workflows where useful:
  1. Understand the teacher's task.
  2. Use Oak API/search tools to identify the curriculum material, and Oak's
     misconception and prior-knowledge graphs (plus the lesson's quiz and text) to
     surface the pedagogical signals in it.
  3. Name the pedagogical move the signal raises, then select real corpus keys by
     inspecting corpus-derived strand names, definitions, key findings, tags,
     applicability facts, and graph relations through the Oak/EEF workflow. No
     server-side or plan-authored mapping from Oak signal category to
     `EefStrandId` is part of this plan. Terms such as "explicit instruction" and
     "retrieval practice" are agent-side move vocabulary, not EEF keys; only strand
     ids, observed priorities/phases/key stages, and graph-projected raw headline
     metric domains cross into the deterministic tool.
  4. Inspect a strand only when more detail, caveats, or evidence-shape
     explanation is needed.
  5. Produce teacher-facing output with Oak material, EEF options and
     trade-offs, uncertainty/caveats, and the short EEF rationale.
- Target MCP primitives by intention, per the official MCP server/client
  concepts and specification docs:
  - **Tool:** model-controlled executable surface for the one deterministic,
    function-dispatched EEF query/fetch call. Use it for corpus-derived evidence
    options and strand inspection because the calling agent must decide when to
    invoke evidence and must pass only finite EEF values/strand ids.
  - **Resource/resource template:** application-driven read context for corpus
    metadata, attribution shape, stable caveat vocabulary, and other context the
    host may browse, attach, or inject without the model choosing an action.
    Define the EEF interpretation resource/template here, deriving it first from
    the corpus methodology/caveats where the dataset already explains impact,
    cost, evidence strength, and conversion notes. Supplement only with
    graph-structural names ratified by D4/D5, such as field names, edge types,
    provenance-envelope fields, and schema-subset names. These structural names
    are not evidence categories, caveat classes, or adaptation concepts.
  - **Prompt:** user-controlled workflow template for teacher-invoked flows,
    such as evidence-grounded lesson adaptation or the cover-lesson example,
    that orchestrate Oak API/search plus the EEF tool. Prompts may help the
    invoking agent work from free-form teacher language by giving the agent a
    workflow to follow, but they must instruct the agent to convert that language
    into fixed EEF tool inputs before calling the deterministic tool.
  - **Elicitation:** not part of the default surface; consider it only when a
    supported host should ask the teacher for missing structured context inside
    an MCP workflow, and never for sensitive information.
  - **Sampling:** not part of the default surface because the calling agent/host
    LLM already composes Oak and EEF outputs; add server-initiated sampling only
    after a separate owner-ratified design.
  - **Annotations:** use resource/tool annotations deliberately for intended
    audience, priority, and read-only/risk hints where the installed SDK exposes
    them; do not treat annotations as substitutes for schema or value-contract
    decisions.
- Write the D3 MCP contract surface explicitly before D4 starts. The contract
  names the one EEF tool, its function/options dispatch shape, the interpretation
  resource/template URI and payload shape, the user-facing prompt name/arguments,
  model-facing descriptions, use/avoid conditions, and teacher-value obligations.
  Input and output schemas are each derived by a **single Zod call on the
  appropriate subset of the graph-native EEF view**. The schema root must
  serialise to an object (`type: object`). These two declarations are the only Zod
  in the system (Decision 2). D3 is complete when this intended
  single-Zod-call graph-subset contract is specified, the named subset/schema-builder
  values are handed to D4, and the installed SDK/app registration path is verified
  capable of carrying the schema declarations. D4 ratifies the graph-native view;
  D6 implements the actual Zod calls.
- Classify every externally supplied field before it crosses into graph code:
  strand-key predicates, observed finite EEF-corpus-vocabulary predicates, or
  graph-projected raw headline metric predicates. If a value originates from Oak
  context, such as a key stage, D3 must name the deterministic projection into the
  observed EEF corpus domain the graph can operate on before the tool boundary.
  The invoking agent may semantically analyse free-form user input, but the MCP
  tool does not: by the time data reaches the tool it must be converted into fixed
  inputs from the finite allowed sets ultimately specified by fixed EEF data.
  Subject/topic context is consumed by Oak retrieval and agent workflow reasoning,
  not by the EEF tool.
  "Only unknown is the key" is not sufficient unless the D3 surface really has no
  other externally supplied values.
- Keep routine tool results compact. The tool output is context for an invoking
  agent, not teacher-facing prose and not a carrier for repeated interpretive
  boilerplate. It may return deterministic graph facts, selected fixed inputs,
  graph edge/field names, citations, caveats, and compact context needed for
  synthesis. Reusable interpretation guidance belongs in the EEF interpretation
  resource/template that the agent fetches only when needed. D3 projects EEF
  corpus methodology and caveats; it does not invent interpretation ontology.
- Record the default calling-agent workflow and any additional D3 workflows as
  contract, not as open questions. Each workflow names which primitive it uses:
  the deterministic EEF tool for query/fetch, the interpretation
  resource/template for applying the evidence, the user-facing prompt for teacher
  invocation, and explicit non-use of elicitation/sampling unless a future
  owner-ratified design adds them.
- Verify the installed MCP SDK and curriculum MCP app registration shapes as a
  separate D3 verification record:
  `inputSchema`/`outputSchema` are Zod-compatible, `isError: true` skips
  output-schema validation, plus resources/resource templates and empty-`content`
  `structuredContent` results. This verification must follow the actual
  registration path used by D6 (`server.registerTool`/`registerAppTool` or any
  universal-tools adapter); if that path drops `outputSchema`, D3/D6 must replace
  that segment rather than merely declaring schemas locally.

**Done when (acceptance):**

- The MCP surface is owner-ratified, written back into this plan or a cited
  contract artefact before D4 proceeds. Use an ADR only when D3 creates a durable
  architectural WHAT/WHY decision; do not put runbook-level MCP surface details
  into an ADR merely because they are useful to execution.
- The D3 contract artefact names the tool, resource/template, and prompt; gives
  each a D1-tied purpose, model-/user-facing description, payload shape, boundary
  rule, and use/avoid condition; and records the verification outcome for the
  function-dispatched tool. No second tool layout, migration bridge, or parallel
  route is recorded.
- The D3 contract contains a source-path table for every finite input and output
  field:
  `contract field -> graph-native subset -> raw EEF source path -> proof test`.
  The `graph-native subset` column is a named but unbound forward reference.
  D3 names the subset value each field needs and proves the field traces to a
  real raw EEF source path. D4 binds the named subset to the ratified
  graph-native view, and D6/D7 prove the binding closes. D3 is complete when
  every field names its subset and traces to a raw source path, not when the
  subset is concretely bound. A field that cannot name a subset, or cannot
  reach a real raw source path, means D3 is not complete.
- The D3 workflow contains no plan-authored or server-side Oak-signal-category to
  `EefStrandId` crosswalk. The invoking agent selects real corpus ids from
  corpus-derived evidence; D6 implements no hidden semantic mapping from
  misconception/prerequisite/quiz/text categories to strand ids.
- The contract contains no stub tool, placeholder resource/template, fake prompt,
  deferred handler, or other surface whose real graph-derived behaviour is left
  for a later plan.
- Input and output schemas are specified as the intended single-Zod-call shape:
  D3 NAMES the graph-native EEF view subset/schema-builder values each schema is
  derived from and the compile-time tie to the corresponding payload type (root
  `type: object`). Because the graph-native view is ratified in D4 and constructed
  in D5, D3 cannot bind those names to a concrete view yet; D4 ratifies the named
  subset values and D6 implements the actual single Zod call. D3 is complete when
  the intended shape and the named values are specified, not when the Zod call
  exists.
- Every externally supplied field is explicitly classified as a strand key,
  observed finite EEF-corpus vocabulary value, or graph-projected raw headline
  metric value and narrowed at the boundary before it reaches graph code. Metric
  inputs are exact corpus values or graph-ratified exact subsets only; no bucket
  label, threshold cut-off, ranking weight, or comparator semantics is introduced
  in D3.
- No free-form teacher or pedagogical context crosses into the EEF MCP tool; any
  natural-language interpretation is done by the invoking agent before the tool
  call, and the tool receives only finite fixed inputs.
- Tool outputs stay compact and deterministic; any reusable explanation
  scaffolding is represented by corpus methodology/caveat/provenance fields,
  graph-structural edge/field names, and the EEF interpretation resource/template,
  not boilerplate appended to every response and not invented ontology. The
  user-facing prompt starts the workflow; it is not the default interpretation
  carrier for routine tool calls.
- The user-facing prompt is specified as an invocation surface for teachers/users
  to start the evidence-grounded workflow; it is not treated as a model-controlled
  or agent-invoked tool.
- The default calling-agent workflow and any additional D3 workflows are written
  back with a primitive-by-primitive targeting rationale grounded in the official
  MCP docs.
- The D3 verification record checks and cites current MCP SDK/app registration
  shapes, including proof that the configured `outputSchema` reaches the actual
  SDK registration path, resources/templates and prompts register behind the same
  flag, and structuredContent-only results remain valid.

**Proof:** `non-code` (owner-ratified decisions, written MCP contract artefact,
SDK/app verification record, and `mcp-expert` sign-off).

### D4 - Graph capability shape (exploration; derived from D3; reshapes graph-core)

**Purpose:** derive the correct graph operations from the ratified MCP surface
and reshape graph-core's query contract to them. The existing `GraphView` is
input to be corrected, not a foundation to build against.

**Folded detail:** D4 carries the minimal operation set, `TNodeId` threading,
guidance-report disposition, edge types, graph-native view choice, and
consumer-impact proof directly. The zero-external-blast-radius finding is still
ratified here before D5 changes the interface.

The graph foundation is built deliberately. It is the substrate for working with
multiple open-education data sources — EEF now, the misconception and
prerequisite-knowledge data next, and the Oak ontology later. Building the data
ingest, the graph foundation, and the graph tools now is the medium-term
investment that opens those sources up; EEF is the first consumer and pathfinder.
The discipline is to keep the contract domain-generic and to ship only operations
a consumer uses (no stubs), not to skip the foundation. EEF's own operations are
modest — fetch a strand by id, filter strands by EEF-native axis (priority, key
stage / phase, and graph-projected headline metric domains), and follow
`related_strands` one hop — and D4 specifies exactly those against the shared
primitives.

**Do:**

- Define the graph operations D3 consumes, split into two layers. The shared
  graph-core contract contains only domain-generic primitives. The EEF/Oak
  binding names the corpus-derived evidence query, the EEF-specific lookups, and
  any EEF-specific view/schema-builder values. Non-contractual examples (names
  settled here, not before): an evidence query over D3-ratified finite EEF values
  in the binding layer, a total strand-by-id lookup after boundary narrowing, and
  a bounded subgraph-around-strands traversal over graph-core primitives.
- SPECIFY (this is a non-code ratification deliverable; D5 executes the reshape as
  TDD cycles) the reshaped graph-core query surface: the concrete operations
  replacing the 7-op stubbed polymorphic `GraphView` (2 live, 5 `NotImplementedYet`),
  with no `NotImplementedYet` op surviving. The reshaped contract MUST stay
  domain-generic (parameterised over `TNode`, an associated `TNodeId extends
  string`, and `TEdgeType`; no EEF- or MCP-specific type names) - EEF-specific
  shapes live in `graph-corpus-sdk`, never in the substrate. The EEF binding uses
  `TNodeId = EefStrandId`; subgraph roots, edge source/target, frontier refs, and
  strand lookup inputs carry `EefStrandId` after boundary narrowing, not broad
  `string`. Public graph-core result/error types must carry `TNodeId` all the way
  out; broad string result/error ids are not the generic contract. Reintroduce
  broader generality only when a real second consumer exists (PDR-058: the
  contract was opened to a second consumer before one existed). No operation may
  be specified as a placeholder, future hook, fake implementation, or
  `NotImplementedYet` branch; graph-core exposes real primitives or exposes
  nothing.
- Ratify the minimal graph-native EEF view contract before D5: owner package,
  node id/kind policy, edge/frontier shape, payload/reference policy, provenance
  envelope policy, and the named schema-subset/schema-builder values D3/D6 consume.
- Model `related_guidance_reports` as a `guidance_report` node kind with a typed
  strand→report edge (for example `has_guidance_report`), node payload
  `{ title, url }`, node id derived from the report url. Guidance reports are a
  shared second entity — the same report is referenced by
  `eef-tl-one-to-one-tuition` and `eef-tl-teaching-assistant-interventions` — so a
  node with an edge from each strand models the many-to-one relationship and
  deduplicates it. This gives the teacher a navigable per-strand route to EEF's
  deeper guidance and is the heterogeneous node-kind + typed-edge pattern the
  multi-source graph foundation carries. D4 ratifies the `guidance_report` node
  kind and its edge type as part of the node/edge policy.
- **Verify consumer impact first (hard gate):** confirm what consumes graph-core's
  query contract. Verified state: graph-ingest and graph-project consume only the
  RDF substrate (term/dataset/jsonld/data-factory), and the threads adapter is an
  empty export-nothing stub - so EXTERNAL-consumer blast radius is ZERO. But the
  reshape requires bounded IN-PACKAGE edits the record MUST name: graph-core's own
  `src/index.ts` barrel re-exports the query types and
  `graph-view/index.unit.test.ts` hard-encodes the 7-op contract +
  `NotImplementedYet`. The shared RDF substrate stays; only the query contract is
  reshaped (in D5). The existing non-EEF empty stub is consumer-impact evidence
  only; it is not a model for the EEF graph-tool surface and does not authorise
  any new stub. A type may be named `SubgraphResult` only if D4 freshly defines
  that name and structure from the new graph contract. The old list implementation
  has been deleted by D2 and is never preserved, repaired, wrapped, consulted, or
  used as a behaviour target. Record the consumer-impact finding as a named
  artefact and have an architecture reviewer sign it off before the interface
  change lands in D5.
- Specify the deletion of the speculative `EvidenceCorpus` `rank`/`explain`/
  `compare` ops and their `NotImplementedYet` (D5 executes; the `graph-corpus-sdk`
  barrel re-exports these types and is pruned in the same landing).
- Specify subgraph membership (complete member nodes + all member edges),
  frontier references (related nodes outside members), request errors (at the
  external boundary), and nested filtering only where D3 requires it. No response
  cap (decision 7).
- Enumerate which `graph-view` exports are deleted, renamed, or freshly defined by
  the new contract. A surviving export with an old name must be justified from the
  new D4 contract alone, not inherited from the old list tool.
- Name the layer split: shared graph-core substrate; EEF raw-data foundation;
  explicit deterministic graph projection boundary; EEF/Oak binding operations;
  invoking-agent workflow that selects real corpus ids before the tool call; and
  EEF-specific MCP composition module (separate from substrate packages; substrate
  never imports MCP types). There is no server-side or plan-authored
  pedagogical-move-to-EEF-query mapping in this plan.

**Done when (acceptance):**

- The target operation set serves every D3 tool/resource and specifies no unbuilt,
  unused, placeholder, stubbed, or future-hook operation (the no-`NotImplementedYet`
  end state is executed in D5).
- The consumer-impact finding is recorded and names BOTH the zero external blast
  radius AND the in-package edits (graph-core barrel + the 7-op contract test).
  The old list-shaped EEF tool is already absent from the D2 path and is not a
  consumer to preserve.
- Graph-core primitives and EEF/Oak binding operations are separated; the minimal
  graph-native EEF view contract is ratified before D5 starts.
- `related_guidance_reports` are modelled as a `guidance_report` node kind with a
  typed strand→report edge, deduplicated across strands (the same report, e.g.
  *Making Best Use of Teaching Assistants*, is shared by
  `eef-tl-one-to-one-tuition` and `eef-tl-teaching-assistant-interventions`), and
  surfaced in the teacher-facing payload (V1).
- Graph-core public result/error types preserve `TNodeId`, proven by the D5
  compile-time tests for `EefStrandId`.
- The deletion of `rank`/`explain`/`compare` is specified for D5.
- Owner ratifies the value -> MCP -> graph derivation.

**Proof:** `non-code` (owner + `type-expert` + architecture-reviewer ratification
of the operation set, the domain-generic no-stub contract, and the consumer-impact
finding).

### D5 - Deterministic graph projection + operation implementation

**Purpose:** ingest D2's typed raw-data foundation into the graph-native EEF
projection and implement the D4 operations. D2 has already deleted the
validation-layer load/list/Zod/freshness path; D5 does not preserve or replace it
with another runtime load path.

**Folded detail:** D5 carries the chosen view form's proof needs, the two
type-erasure seams to re-key on `EefStrandId`, and the runtime proof over the
real corpus with the typed id/payload relationship asserted.

**Do (TDD cycles):**

- Ingest the D4-ratified graph-native EEF view from the D2 raw-data foundation.
  The boundary must be explicit and pure: it may materialise a
  standardised graph structure or expose a lazy view, but graph operations,
  traversal semantics, provenance envelopes, and MCP schema derivation must depend
  on this graph-native view rather than on scattered assumptions about raw
  `EEF_TOOLKIT_DATA` entries. Construction is infallible for data-shape purposes.
  The raw EEF data is definitively not the EEF graph contract; the graph is
  absolutely derived from the raw data and must preserve its exact type
  relationships.
- Implement the ratified graph-native shape: node ids and kinds, edge types, node
  payload/reference policy, indexes, metadata, provenance envelope shape, and which
  raw literal values are retained verbatim for teacher evidence. Any graph-native
  wrap/project/index must be typed as a direct projection over `EefStrand`,
  `EefStrandById`, `EefStrandId`, and derived edge facts. Full-node payloads
  preserve either `EefStrandById[Id]` or a named derived projection of it; edge
  endpoints remain derived literal ids; graph-core public result/error types carry
  `TNodeId`; broad `string` ids, generic graph-node payloads, JSON-like records,
  and later EEF re-narrowing are forbidden.
- Implement the D4-ratified graph operations.
- Expose EEF-native graph operations in the EEF binding layer. No operation maps an
  Oak signal category or agent-side pedagogical move to EEF queries. The semantic
  mapping from a teacher's situation to a pedagogical move is the calling agent's
  workflow, and the EEF tool receives only finite corpus keys selected before the
  call.
- Build the EEF evidence subgraph envelope: complete full-node members, all
  member edges, frontier references for related strands outside the members.
- Attach corpus-level caveats and attribution once per envelope as **additive**
  provenance (teacher value, not a freshness obligation); full strand nodes retain
  their own typed evidence fields. Whether `data_version`/`last_updated` are
  surfaced is the D1 value-contract's call - they carry no governance or freshness
  semantics here.
- Verify the D2-deleted load/list/Zod/freshness path remains absent:
  no `loader.ts`, `loadEefCorpus`, `freshness.ts`, `checkFreshness`,
  `DEFAULT_THRESHOLD_DAYS`, `Freshness*` types, loader/freshness tests,
  list-shaped EEF tool, package re-export, or ADR-175 code reference is
  reintroduced. The graph constructor/adaptor is the only ingest path from the D2
  raw foundation to the D4 graph projection.
- Delete every `NotImplementedYet`, the `rank`/`explain`/`compare` ops, and any
  remaining response-cap artefact. Do not keep, repair, wrap, or consult
  list-based logic. Do not replace deleted stubs with new placeholders, shims,
  fake graph methods, or exported operations whose behaviour is deferred; implement
  the D4-ratified operation with tests or leave it unexported.

**Done when (acceptance):**

- The interface contains no unbuilt operation, placeholder, shim, stub branch,
  fake graph method, or `NotImplementedYet`.
- Worked contexts return complete full-node members and all member edges, pinned
  as literal id sets from the committed corpus.
- Frontier references are present when related strands sit outside the members.
- The freshness apparatus is gone: no `freshness.ts`, `checkFreshness`,
  `DEFAULT_THRESHOLD_DAYS`, `Freshness*` type, loader binding, or freshness test
  remains, and the package re-exports are removed.
- No corpus `safeParse`, `EefToolkitSchema`, `strand-schema.ts`, fixed-corpus
  `unknown` path, response cap, or rank-and-cut code remains; no type assertion
  recovers corpus shape.
- A graph-constructor unit test over the real corpus proves the graph-native
  construction/adaptation boundary and a provenance-on-envelope test co-lands with
  the construction code. The test must include the typed id/payload relationship
  and derived literal edge endpoints, not only runtime shape presence.
- Compile-time proof covers graph-core public result/error types preserving
  `TNodeId` and the EEF binding instantiating them with `EefStrandId`.
- The old list tool remains absent; no shim preserves, repairs, wraps, or consults
  list logic.
- No replacement surface is registered or exported unless it is backed by real
  graph-derived behaviour and tests in the same landing.

**Proof:** `unit` + `integration` over the real corpus. Command:
`pnpm --filter @oaknational/graph-corpus-sdk test` +
`pnpm --filter @oaknational/oak-curriculum-sdk test` + `pnpm type-check`.
If D5/D6 co-land, also run
`pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test`.

### D6 - EEF MCP composition module + surface

**Purpose:** expose the EEF graph as the ratified MCP tool/resource/prompt surface.

**Folded detail:** D6 carries the dual-content `universal-tool-shared.ts` path,
the `outputSchema` registration gap this deliverable must replace/extend, the
`related_guidance_reports` value that must not vanish when `citation-shape.ts` is
deleted, and the ADR-179 boundary that keeps MCP types out of substrate packages.

**Do (TDD cycles):**

- Add an EEF-specific MCP composition module in the curriculum MCP consumer layer
  accepting the D4/D5 EEF graph operations plus per-surface config. It produces
  the deterministic EEF tool definition/handler, the interpretation
  resource/template definition/handler, the user-facing prompt definition,
  descriptions, input shapes narrowed by constant-derived predicates, one
  Zod-call-derived object input schema over the appropriate graph-native EEF view
  subset, one Zod-call-derived object output schema over the appropriate
  graph-native EEF view subset (each root `type: object`), `isError: true` on
  error returns so the SDK skips output validation, structuredContent-only tool
  formatting, resource formatting, prompt formatting, and telemetry wiring. The
  graph-native subset/schema-builder value consumed by each Zod call must itself
  be typed from the graph-native view, with `satisfies` or an equivalent
  compile-time proof tying the declared schema to the corresponding
  `structuredContent` type. These two declarations are the only Zod in the
  system. The composition module does not validate the fixed corpus and does not
  require substrate packages to import MCP types (ADR-179 - an explicit
  acceptance check). Do not extract a generic factory until a real second consumer
  exists. Confirm the registry path (direct `server.registerTool`/`registerAppTool`
  vs the universal-tools `AggregatedToolDefShape`, which may not carry
  `outputSchema`). If the active registry path drops `outputSchema`, replace that
  segment so the SDK receives the configured schema. D6 is not complete until the
  single-Zod-call graph-subset rule is implemented exactly; failure means the
  D3/D4 contract is wrong and must be corrected.
- Register the ratified EEF surface behind `OAK_CURRICULUM_MCP_EEF_ENABLED`
  alongside the Oak curriculum tools; co-gate tool, resource, and prompt
  (`eef-surface.ts`, `handlers.ts`, `register-prompts.ts`). Registration is only
  for implemented surfaces: no empty tools, placeholder handlers, fake resources,
  prompt shells, or "coming later" entries may appear behind the flag.
- Update the EEF prompt, interpretation resource/template, and tool descriptions
  for cover-lesson preparation: evidence use, caveat preservation, and when not
  to use EEF.
- Verify the superseded list-shaped `eef-explore-evidence-for-context`
  implementation deleted in D2 remains absent while implementing the graph surface
  from the ratified D3-D5 structure. `projection.ts`, `response-budget.ts`, dual
  content output, citation revalidation, tool-level Zod validation, and
  `evidence-corpus/citation-shape.ts` do not return. Re-express any genuine
  citation-envelope invariant (non-empty caveats, valid `eef_url`) as a TypeScript
  tuple type (`readonly [T, ...T[]]`), not Zod. The old list implementation is
  never preserved, repaired, wrapped, consulted, or used as a behaviour target.

**Done when (acceptance):**

- Flag on: the ratified tool/resource/prompt surface registers through the MCP
  app; the tool executes through the app; each tool's input and output schemas
  are derived by a single Zod call on the named graph-native EEF view
  subset/schema-builder value, the schema declaration is compile-time tied to the
  corresponding `structuredContent` type, and the configured `outputSchema`
  reaches the actual `server.registerTool`/
  `registerAppTool` path so the SDK validates `structuredContent` against it;
  tools return `structuredContent` only with `content: []`; error returns use
  `isError: true`; every registered tool/resource/prompt has real graph-derived
  behaviour and tests, with no placeholder handler, stub response, fake
  registration, or deferred implementation.
- Flag off: no EEF tool, resource, or prompt appears in registration or the
  landing page.
- Resource payloads match the ratified contract; descriptions explain evidence
  use, caveat preservation, and when not to use EEF.
- The only Zod on the MCP side is the input/output schema declarations; tool input
  semantics are still predicate-narrowed from the fixed data; no Zod parses the
  corpus.
- Substrate packages import no MCP types (ADR-179), checked explicitly.
- Tests prove registration includes the configured output schemas and resources,
  flag-on and flag-off both co-landed in the integration test commit. Runtime
  tests prove malformed non-error `structuredContent` is rejected by the output
  schema and `isError: true` error payloads skip output validation. Boundary
  tests cover non-object envelopes, unknown properties, invalid ids, invalid
  finite-vocabulary values, and error responses.
- The old list-shaped tool implementation and its projection, validation, cap,
  citation-revalidation, and dual-content logic are gone. Any identical output
  produced by the new surface is acceptable only when it follows from the ratified
  D3-D5 structure and tests, not from preserving the old implementation.

**Proof:** `integration` (registration + flag co-gating + structuredContent).
Command: `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test`.

### D7 - Teacher value round trip

**Purpose:** prove the system delivers the intended teacher value.

**Folded detail:** D7 carries the verbatim-preservation set and the
independent-ground-truth requirement directly: expected values are sourced through
the typed raw/graph-native chain, not duplicated fixture text.

**Do (TDD cycles):**

- Add an MCP-client e2e flow (StreamableHTTP transport: MCP client SDK +
  `StreamableHTTPClientTransport`, in
  `apps/oak-curriculum-mcp-streamable-http/e2e-tests/`, `*.e2e.test.ts`):
  initialise the server; call existing Oak curriculum tools (including a
  pedagogical signal such as the misconception or prior-knowledge graph) for a
  lesson; query the ratified EEF tool for the evidence on the pedagogical move that
  signal raises; inspect or expand a returned strand through the ratified surface;
  assert all EEF graph payloads arrive through `structuredContent`.
- Add a scenario-level assertion for the Sunday-night cover-lesson use case,
  measured against an INDEPENDENT ground truth: a known real strand's exact corpus
  values (its caveat text, evidence strength, cost, impact) appear VERBATIM in the
  assistant-facing payload - not merely that the fields are present, which the
  system could satisfy tautologically. Pin a literal strand id, source the expected
  values through the typed raw foundation or graph-native typed accessor, then
  compare the MCP `structuredContent` payload; the proof demonstrates raw literal
  -> graph-native view -> MCP payload, not duplicated fixture text.
- Capture telemetry for the EEF graph tool/resource path.

**Done when (acceptance):**

- The e2e round trip proves graph retrieval, node/resource lookup, and subgraph
  expansion through MCP.
- The scenario proof shows Oak material and EEF evidence used together; the final
  assistant-facing payload contains the known strand's VERBATIM corpus attribution,
  caveats, evidence strength, impact, and cost (the independent-ground-truth check),
  not a reformulation. The expected values are sourced through the typed raw or
  graph-native chain, so the test also proves type-flow preservation.
- The proof also exercises an `Insufficient`/null-impact strand (for example
  `eef-tl-aspiration-interventions` or `eef-tl-learning-styles`): its honest
  "insufficient evidence / little-to-no impact" finding reaches the teacher
  verbatim, and the assistant-facing output is asserted to contain no
  teacher-replacing or single-answer selection language (the V3 non-claim).
- The proof asserts the evidence standard: the output frames EEF as
  population-level evidence that may inform teacher judgement, and does not claim
  or imply guaranteed local efficacy for the specific class, pupil, or adaptation.
- At least one telemetry span is recorded for the EEF graph path. If this span
  moves a cell in
  [`plans/observability/what-the-system-emits-today.md`](../../../observability/what-the-system-emits-today.md)
  from empty to populated, that artefact is updated in the same commit
  (start-right observability rule).
- `pnpm check` is green on a settled tree.

**Proof:** `e2e` + `value-proxy`. Command: the workspace e2e suite +
`pnpm check`.

## Carried Context From The 2026-05-30 Session

Artefacts already in the tree, so the next session does not rediscover them:

- The archived pre-decision research and reviewer briefs were working artefacts,
  not live sources. Their useful substance is folded into the deliverables above:
  the two type-erasure seams, the `outputSchema` registration gap at
  `handlers.ts:185-196`, the dual-content path, the `related_guidance_reports`
  modelling gap, the `EefPhase` wrong-source note, the graph-native view proof
  needs, the layer split, and the risk register. Execution reads this plan as the
  live contract.
- D0 relocated `strandById`, `Strand`, `StrandByStrandId`, `lastUpdated`, and
  `EefToolkitData` into
  `packages/sdks/graph-corpus-sdk/src/eef-strands/strand-lookup.ts`. The corpus
  file `eef-toolkit.external-data.ts` is pure data. D2 canonicalises the raw type
  names from that starting point to `EefStrand` / `EefStrandById` / `EefStrandId`.
- Pre-D2 direction notes in the headers of `eef-toolkit.external-data.ts`,
  `loader.ts`, and `strand-schema.ts` mark the Zod/freshness path as redundant.
  D2 replaces those notes by deleting `loader.ts` and `strand-schema.ts` and
  keeping `eef-toolkit.external-data.ts` pure data.
- The old runtime `strands` Set was removed. D2's raw id-to-strand lookup is the
  single runtime raw-id surface and backs `isValidStrandKey`.
- The `validate-external-data-files` repo-validator no longer exists and
  `repo-validators:check` is green by deletion. Do not reintroduce the validator
  or satisfy its old rule by retyping the corpus to `unknown`.
- `graph-core` exists at `packages/core/graph-core/` with the polymorphic
  `GraphView<TNode, TEdgeType>` (7 ops: `manifest` + 6 fallible; `manifest`/`subgraph`
  live, 5 `NotImplementedYet`). Its RDF substrate is used by `graph-ingest` and
  `graph-project`; the `threads` adapter is an empty stub - so the query-contract
  reshape (D4 specifies, D5 executes) has zero EXTERNAL-consumer blast radius, with
  bounded in-package edits remaining (graph-core's own barrel and the `graph-view`
  contract test). Old list imports of `SubgraphResult`, `loadEefCorpus`,
  `LoadEefCorpusError`, `selectEefSeedIds`, `capForBudget`, projection,
  validation, and citations are D2 deletion evidence, not graph-core consumer
  evidence. The speculative `EvidenceCorpus`
  `rank`/`explain`/`compare` ops live (type-only) in
  `graph-corpus-sdk/src/eef-strands/types.ts`.
- The current EEF MCP tool is the list-shaped `eef-explore-evidence-for-context`
  in `oak-curriculum-sdk/src/mcp/evidence-corpus/tools/`, registered by
  `apps/oak-curriculum-mcp-streamable-http` behind `OAK_CURRICULUM_MCP_EEF_ENABLED`,
  with `projection.ts`, `response-budget.ts`, and Zod schemas
  (`tool-definition.ts`/`validation.ts`) as the superseded shape deleted by D2.
  `citation-shape.ts` lives one level up at `evidence-corpus/citation-shape.ts`;
  D2 deletes it when it has no non-list importer, otherwise D6 deletes the
  remaining citation-only residue while registering the graph surface.

## Fully Specified End State

### User Value

- The Sunday-night cover-lesson scenario is ratified as the first value proof.
- The assistant combines Oak material with EEF graph evidence so the teacher's
  answer is more useful than Oak retrieval alone.
- Scenario output includes EEF attribution and caveats and does not flatten
  uncertainty into a teacher-replacing answer list.
- The teacher-facing answer requires no knowledge of the graph or layers.

### MCP Surface

- Ratified practical-small tool/resource boundary: one function-dispatched EEF MCP
  tool for corpus-derived evidence options and strand inspection, plus corpus
  metadata. A graph-forward MCP collection is a follow-on plan, not this D3-D6
  target.
- The MCP surface includes a default workflow: understand the teacher task, use
  Oak API/search for the curriculum material, let the invoking agent interpret
  teacher/Oak context outside the deterministic tool, select finite EEF values or
  strand ids that trace through the D3 source-path table, inspect strands only when
  extra caveat/detail is needed, then return teacher-facing options, trade-offs,
  caveats, and a short EEF rationale.
- D3 may specify multiple workflows, but each workflow must target MCP
  primitives by intention: model-controlled tools for EEF action, application-
  driven resources/templates for corpus context, user-controlled prompts for
  teacher-invoked workflow templates, and no elicitation or sampling unless
  separately justified and host-supported.
- The practical-small MCP surface consists of: one deterministic EEF query/fetch
  tool; one EEF interpretation resource/template for applying the evidence; and
  one user-facing prompt for starting the evidence-grounded teacher workflow.
- Free-form teacher language remains outside the deterministic EEF tool
  boundary. The invoking agent may interpret it, including while following a
  prompt-specified workflow, but every EEF tool call receives only finite, fixed
  inputs derived from Oak/EEF data.
- Tool outputs provide compact structured context for the invoking agent. They do
  not attach repeated explanation boilerplate to every result. D3/D5 expose fixed
  corpus methodology/caveats/source/provenance and graph-structural field/edge
  names derived from the D4/D5 graph contract; they do not invent a parallel
  interpretation ontology, caveat taxonomy, adaptation taxonomy, or tool-specific
  evidence vocabulary.
- Descriptions explain the cover-lesson value path and evidence-preservation
  obligations.
- Each tool has semantic input narrowing backed by fixed-data predicates, plus a
  single Zod call deriving its input schema from a named graph-native EEF view
  subset/schema-builder value with a compile-time tie to the corresponding input
  type; each output schema is likewise derived by a single Zod call over the
  appropriate graph-native view subset and tied to the `structuredContent` type
  (root `type: object`).
- Each resource/template has a defined URI, payload shape, and model-facing
  purpose.
- Graph tools return `structuredContent` only with `content: []` (a SETTLED Oak
  decision, not to be reopened); error returns use `isError: true`.
- The only Zod on the MCP side is the input/output schema declarations; nothing
  parses the corpus.
- With the flag off, no EEF tool, resource, or prompt appears.
- With the flag on, every registered EEF tool, resource/template, and prompt is
  implemented end to end; no placeholder, stub response, fake registration, or
  deferred handler appears anywhere in the MCP surface.
- Every externally supplied field is narrowed by its classified boundary rule
  before graph code sees it.
- The configured `outputSchema` reaches the actual MCP registration path; tests
  prove non-error malformed `structuredContent` is rejected and `isError: true`
  error payloads skip output validation.

### Graph Layer

- graph-core's query contract is reshaped to the concrete operations the MCP
  surface consumes; no stubbed polymorphic ops, placeholder operations, future
  hooks, fake implementations, or `NotImplementedYet` remain.
- Graph-core public result/error types carry the associated `TNodeId`, and the EEF
  binding instantiates that id as `EefStrandId`.
- The raw EEF corpus is not the graph contract. D5 owns an explicit graph-native
  construction/adaptation boundary from the D2 raw foundation; the result may be
  materialised or lazy, but graph operations and MCP schemas consume that
  graph-native view. The graph is derived from the raw data and preserves exact
  `EefStrandId`/`EefStrandById[Id]`/edge endpoint relationships; it is never
  recovered later from broad strings or generic JSON-like payloads.
- Shared graph-core primitives, the EEF/Oak binding, and the EEF-specific MCP
  composition module remain separate layers; no separate pedagogical-move-to-EEF
  mapping is introduced.
- Operations are tested on the real corpus.
- Returned subgraphs contain full nodes, member edges, and frontier references,
  bounded by graph scope, never by a cap.
- The shared RDF substrate is preserved for its other consumers.
- The old list-shaped EEF MCP implementation and its projection, validation,
  response-budget, citation-revalidation, and dual-content logic are removed.

### Data And Types

- `EEF_TOOLKIT_DATA` remains the only fixed corpus source, typed `as const`.
- `EefToolkitData`, `EefStrand` (= `(typeof EEF_TOOLKIT_DATA.strands)[number]`),
  `EefStrandId`, `EefStrandById`, `EefKeyStage`, and `EefPriority` derive from the
  constant as the raw corpus foundation.
- No consumer accepts the corpus as `unknown`; no Zod parses or validates the
  corpus (the sole Zod calls are the MCP input/output declarations); no freshness
  apparatus exists (ADR-175 withdrawn and deleted); no type assertion
  re-establishes the corpus shape; no hand-authored/normalized parallel raw-corpus
  node interface exists.
- Compile-time literal key access yields the exact single strand; runtime
  boundary access narrows the key via `isValidStrandKey`, then resolves through
  the keyed lookup.

## Plan Definition Of Done

The plan is done when D0-D7 are complete and:

- the red `repo-validators` gate is green via D0 deleting the erroneous rules,
  never by retyping the corpus to `unknown`;
- the only Zod in the EEF graph stack is the MCP input/output schema declarations,
  each derived by a single Zod call on a named graph-native EEF view subset with a
  compile-time tie to the corresponding input or `structuredContent` type (root
  `type: object`), and the configured `outputSchema` reaches the actual MCP
  registration path; nothing parses the corpus; the deliverable is incomplete
  until this proof is green;
- teacher value (D1) is ratified before the MCP and graph contracts are locked;
- the MCP surface (D3) is designed as the user-facing surface before graph
  internals are implemented, and every externally supplied field is classified and
  narrowed at the boundary;
- graph-core's query contract is reshaped to only the operations the ratified MCP
  surface consumes, graph-core public result/error types preserve `TNodeId`, and
  consumer impact on graph-ingest/graph-project/threads is recorded; D2 separately
  records the old list tool's import surface as deletion evidence;
- the corpus's `as const` type information flows into the graph-native EEF view
  and MCP outputs without being thrown away and re-established;
- the graph construction/adaptation boundary is explicit, pure, and infallible for
  data-shape purposes; it is not a validation layer; the raw EEF data is not the
  graph contract, but the graph is derived from it and preserves exact raw id,
  payload, and edge relationships; the freshness apparatus is fully removed
  (ADR-175 withdrawn and deleted); no response cap or rank-and-cut remains;
- in the EEF graph-tool stack, no stub tool/resource/prompt, placeholder handler,
  fake registration, future hook, shimmed graph method, or `NotImplementedYet`
  remains or is newly built; a capability is implemented with real graph-derived
  logic and same-landing tests, or it is absent. Existing non-EEF stub-mode
  surfaces elsewhere in the repo are outside this plan's ownership and do not
  authorise EEF stubs;
- D2 removes the old list-shaped EEF tool and its load/list/Zod/freshness path
  outright; D5/D6 verify that deleted path remains absent while implementing the
  graph projection and MCP surface. List-based logic is never preserved, repaired,
  wrapped, consulted, or used as the source of expected behaviour. Any overlap with
  old outputs is acceptable only as an incidental result independently derived from
  the ratified D1 value contract, D3 MCP surface, and D4/D5 graph structure;
- ADR-038 covers fixed `as const` constants, grounded in the
  `unknown-is-type-destruction` rule and operationalising ADR-034's
  system-boundary doctrine for known in-repo constants; ADR-157's two EEF Zod
  clauses are corrected in-record; ADR-173 no longer designates an EEF Zod loader
  in any of its four locations; WITHDRAWN is
  defined in the ADR lifecycle and ADR-175 is marked WITHDRAWN then deleted (all
  three README entries + both ADR-157 references removed); ADR-032/003 are unchanged
  and the ADR-028 citation is corroborating-only;
- the estate-decontamination ledger is complete and a final sweep of EEF plans and
  non-plan documentation finds zero LIVE references to the discarded concepts
  (`data-export-must-be-unknown`, obsolete list-era gate-label framing, freshness/ADR-175,
  Zod-over-corpus, the response cap);
- a Sunday-night cover-lesson scenario proves the teacher value path;
- all tests and gates for the touched workspaces pass (`pnpm check` green).

## Non-Goals

- Minimising changes to an inherited shape that is wrong. The default is to
  replace it with the correct shape; existence is not evidence of correctness.
- Keeping any Zod that parses the corpus, any runtime corpus schema parse, or any
  freshness gate / ADR-175 in this system (the sole permitted Zod calls are the
  MCP input/output declarations the SDK consumes, each derived by a single Zod call
  on the appropriate subset of the graph-native EEF view).
- Treating raw `EEF_TOOLKIT_DATA` plus scattered graph action functions as the
  graph contract. The graph-native construction/adaptation boundary must be
  explicit: the graph is derived from the raw data and preserves exact typing, but
  raw data is definitively not the graph contract.
- Keeping a response cap, rank-and-cut, or field-mask-for-budget on graph
  results.
- Keeping, repairing, wrapping, or deriving expected behaviour from the old
  list-based EEF tool logic after D2 deletes it.
- Treating the existing `graph-core` `GraphView` query contract as fixed, or
  conversely demolishing graph-core's shared RDF substrate that other consumers
  depend on.
- Treating tests of construction, subgraph completeness, schema derivation,
  metadata propagation, resources, or MCP behaviour as forbidden - those remain
  required.
- Reintroducing `unknown` or type assertions at the fixed-data boundary.
- Building teacher-replacing selection or comparison tools beyond the graph
  access this use case needs. Any future behaviour in that space would require a
  separate owner decision after this graph surface proves value; it is not a
  D1-D6 design target.
- Building a UI widget.
- Flipping `OAK_CURRICULUM_MCP_EEF_ENABLED` in any deployed environment.
- Building the next graph corpus before this first surface proves the pattern.
- Surfacing EEF-only workflows that deliver value in the MCP app without
  intersecting Oak's tools (for example standalone "what does the evidence say
  about this approach" or impact/cost decision-support flows). These are valid and
  worth doing, but they are owned by a separate follow-on plan,
  [`../future/eef-standalone-evidence-workflows.plan.md`](../future/eef-standalone-evidence-workflows.plan.md);
  this plan's value proof is the Oak-lesson-adaptation workflow.
- Leaving any contaminated reference live in EEF plans or non-plan documentation
  because it is "out of scope" - the Estate Decontamination sweep is mandatory
  there. Non-EEF plan files are explicitly owned by the graph-estate plan.

## Risk Assessment

- **Conservation reflex re-entering during execution.** The prior failure was
  reaching for the minimal edit that preserved a wrong shape. Mitigation: each
  inherited element (validator rule, Zod schema, graph-core op, old list tool,
  list-era cap) has an explicit replace/delete decision above; execution that
  finds itself softening rather than replacing should stop and re-read the
  Ratified Decisions.
- **Reshaping graph-core's query contract.** graph-core is multi-consumer for its
  RDF substrate. Mitigation: D4 records the consumer-impact finding (verified:
  graph-ingest/graph-project use only the RDF substrate; the threads adapter is an
  empty stub - ZERO external-consumer blast radius); bounded IN-PACKAGE edits
  remain (graph-core's own `src/index.ts` barrel and the `graph-view` 7-op contract
  test), enumerated in D4 and executed in D5; the old list tool's import surface is
  deletion evidence already owned by D2, not a compatibility target. A
  `SubgraphResult` name is kept only if freshly ratified from the new
  graph contract, not as a holdover; the shared RDF substrate is out
  of scope for the reshape; an `architecture` reviewer and `type-expert` sign off
  before the interface change lands.
- **Union node type ergonomics.** `(typeof EEF_TOOLKIT_DATA.strands)[number]` is a
  large union. The doctrine is fixed: the union IS the type; no normalized parallel
  raw-corpus shape, and no "common iteration shape" is introduced as a response to
  ergonomic friction in the raw foundation (that framing is exactly how a
  normalized interface previously crept back). A graph-native view may standardise
  the data only through the explicit D5 construction/adaptation boundary and only
  where it serves graph operations, traversal semantics, MCP schema derivation, or
  provenance; that standardisation still preserves a named type-level link to the
  raw source strand or a named derived projection, never broad `string` ids or
  generic JSON-like payloads. One concrete compile-time cost is already KNOWN, not
  hypothetical: exact-union membership predicates can collapse `.includes()`
  parameters. The cure belongs at the new raw-foundation or graph-native boundary,
  not in the old `selection.ts`/`projection.ts` list implementation and never by
  reintroducing a normalized node. Any further concrete, named compile-time cost is
  a fresh `type-expert` decision at that point, still never a normalized-shape
  hatch.
- **Intentional in-flight red-tree window.** Deleting the old
  load/list/Zod/freshness path before the graph projection and MCP surface are
  fully rebuilt may leave compile errors while D2-D6 are in flight. That is
  acceptable because preserving a wrapper or compatibility surface would keep the
  wrong idea alive. Mitigation: D2 deletes the wrong path outright; D5 ingests the
  D2 raw foundation into the deterministic graph projection; D6 registers the new
  graph-derived MCP surface. The tree is validated once the replacement chain is
  complete, not by carrying old contracts through the middle.
- **MCP schema declaration not reaching runtime validation.** The universal-tools
  registration path may not carry `outputSchema` to the SDK even when local
  declarations exist. Mitigation: D3 verifies the live SDK/app path, D6 proves the
  configured schema reaches `server.registerTool`/`registerAppTool`, and runtime
  tests prove malformed non-error `structuredContent` is rejected while
  `isError: true` skips output validation.
- **Under-classified external input.** A surface with more than a strand key can
  accidentally pass broad strings into typed graph code. Mitigation: D3 classifies
  every externally supplied field, and D6 boundary tests cover non-object
  envelopes, unknown properties, invalid ids, and invalid finite-vocabulary values.
- **Carrying a red gate through D1/D3 exploration.** Mitigation: D0 is sequenced
  first and greens the gate before contract exploration consumes time; if D0
  cannot land first, surface the persisting red gate to the owner.
- **ADR amendment + decontamination scope.** Mitigation: D0 is a batched
  disposition sized to the unique substance (amend ADR-038, correct 157/173, add
  the WITHDRAWN lifecycle state then WITHDRAW-and-delete 175, leave 032/003) plus
  the Estate Decontamination ledger, not one cycle per ADR or per reference.
- **Decontamination misses a live reference.** Mitigation: the Estate
  Decontamination acceptance is a clean `rg` sweep over EEF plans and non-plan
  documentation (history, changelog, and non-EEF plan files excluded), and the
  ledger records every hit, so a missed live reference fails the sweep.

## Foundation Alignment

- `principles.md` - long-term architectural correctness over expediency;
  known-data-is-its-own-authority; no parallel schemas; replace wrong shapes
  rather than preserve them.
- `testing-strategy.md` / `tdd-as-design.md` - every product cycle is a co-landed
  test+code pair; tests describe system states over the real corpus.
- `schema-first-execution.md` - schema-first governs the unknown OpenAPI surface
  elsewhere; this system's `as const` constant is its own schema and narrows by
  predicate; the sole Zod calls are the MCP SDK-consumed input/output declarations,
  each one a single Zod call on a named subset/schema-builder value typed from the
  graph-native EEF view and compile-time tied to the corresponding payload type
  (ADR-153 predicate pattern; ADR-028 corroborating). The implementation must
  prove that path; failure is a contract defect, not a licence to choose another
  shape.
- `unknown-is-type-destruction` rule + ADR-034 - the existing doctrine the expunged
  validator rule violated; the rule operationalises ADR-034's system-boundary
  doctrine for known in-repo constants (`as const` tightens types; `unknown` over
  known data is forbidden).
- ADR-038 (compile-time construction, generalised), ADR-153 (constant-type
  predicate), ADR-028 (Zod deferral, corroborating), ADR-041 (workspace/import
  direction), ADR-173 (graph topology), ADR-179 (transport-agnostic substrate),
  PDR-058 (premature-generalisation / optionality), ADR-117 (plan architecture).
  ADR-175 is WITHDRAWN (a newly-defined lifecycle state) and deleted by this plan.

## Plan-Body First-Principles Check

Per `.agent/rules/plan-body-first-principles-check.md`, before executing
plan-prescribed work:

- **Shape clause** - every inherited shape named here (validator rules, Zod
  schemas, the `GraphView` query contract, the old list-shaped EEF tool, the
  response cap) is to be replaced with the correct shape, not relaxed or
  preserved; D3/D4 examples are
  hypotheses, re-derived from the ratified contracts at execution time.
- **Landing-path clause** - D0 must green `repo-validators:check`;
  D2/D5/D6/D7 product cycles co-land test+code and end with all tests passing.
- **Vendor-literal clause** - D3 must verify the installed MCP SDK and curriculum
  app registration shapes before encoding protocol details; do not trust this
  plan's protocol claims over the live SDK - in particular the verified-here shapes:
  `inputSchema`/`outputSchema` are Zod-compatible and `isError: true` skips
  output validation, and the actual registration path must carry `outputSchema` to
  the SDK. If that verification shows the single-Zod-call graph-subset schema rule
  is impossible, the next step is an owner conversation, not an executor-chosen
  workaround.
- **Optionality-surface clause** - no deliverable embeds optionality where a closed
  answer exists, and no escape hatch (deferral, menu, soften-the-rule,
  common-shape-under-friction) remains: the ADR-157 "or" is resolved to the
  surgical in-record correction, the union-ergonomics hatch is removed (known
  exact-union costs are handled in the new typed path), the old list tool is
  removed rather than held open, and ADR-175 is decided (withdrawn and
  deleted), not held open.

## Readiness Reviewers

A full readiness review (`assumptions-expert`, `type-expert`, `mcp-expert`,
`architecture-expert-betty`/`-fred`, `test-expert`, `docs-adr-expert`, plus drift
and starting-statement passes) was run on 2026-05-30 against the plan frame; its
findings are folded in above. A post-repair reviewer pass against the tightened
raw-data -> graph-native-boundary and single-Zod-call wording was run on
2026-05-31 from now-archived reviewer briefs; its findings are folded in above. A
four-architecture-reviewer pass was also run on 2026-05-31; its findings,
including the D2 old-list/load/Zod/freshness deletion requirement and the D3
source-path/no-crosswalk requirement, are folded in above.
Implementation may proceed only from this folded-in plan body. The reviewers below
still fire at execution time against the *ratified D3/D4 outputs*, which did not
exist at review time:

- `assumptions-expert` - the value -> MCP -> graph bridge is sound and the
  deliverables are proportional.
- `mcp-expert` - the D3 tool/resource boundary, single-Zod-call input/output
  schema declarations over named graph-native EEF view subsets with compile-time
  payload ties, the `isError` path, and resources against the live SDK. The
  structuredContent-only result shape with `content: []` is a SETTLED Oak decision
  and is explicitly OUT OF SCOPE for re-review - it is not to be reopened.
- `type-expert` - the constant-derived-types contract, single-Zod-call
  input/output declarations over named graph-native EEF view subsets with
  compile-time payload ties, the key-narrowing predicate, and the reshaped
  domain-generic graph-core query contract.
- An architecture reviewer - the graph-core query-contract reshape, its
  zero-blast-radius consumer-impact record, and ADR-179 compliance at the D6
  EEF MCP composition boundary.

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
