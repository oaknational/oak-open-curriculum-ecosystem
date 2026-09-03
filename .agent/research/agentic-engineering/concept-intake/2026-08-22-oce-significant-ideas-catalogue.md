# OCE significant ideas catalogue

**Status:** discovery catalogue; unprioritised; mixed and unclassified authority

**Catalogue authority:** discovery and indexing only; this document creates no doctrinal or
implementation authority

This document consolidates the materially distinct ideas already developed for OCE. It is a
concept inventory, not an implementation backlog. Entries have mixed relationships to current OCE
authority: some restate existing doctrine or implemented contracts, some extend them, and some are
unratified candidates, questions, experiments or non-goals. This catalogue does not classify those
relationships entry by entry. Inclusion here neither ratifies a candidate nor demotes, supersedes
or reopens established authority. Before consequential use, resolve an entry against the current
authoritative surfaces under repository precedence; those sources govern. Closely related ideas
remain separate where they answer different questions or protect different properties.

## 1. Product shape and operating model

### OCE-IDEA-001 — Close the operational knowledge loop

Connect corpus census, extraction, resolution, validation, immutable generation, diagnostics, query, explanation, update, export and delivery into one usable path. Architectural coverage creates little value until someone can move from a clean checkout to a bounded, sourced answer.

### OCE-IDEA-002 — Prefer complete vertical slices to horizontal completeness

Select one bounded corpus and a handful of consequential questions, then exercise the whole path end to end. A narrow capability with a real consumer is more informative than a broad substrate whose components have never worked together.

### OCE-IDEA-003 — Let consequential questions drive extraction and schema

Start with questions OCE cannot answer cheaply or reliably enough. Add entities, relations, extractors, indexes and projections only when they improve those answers, making completeness relative to a declared question and corpus rather than an imagined universal model.

### OCE-IDEA-004 — Operate as an evidence router

Route each question to the simplest adequate instrument: direct inspection, text search, compiler or language service, search index, relationship model, runtime probe, test execution or legitimate human authority. No representation should become a mandatory gateway merely because it is sophisticated.

### OCE-IDEA-005 — Maintain a persistent project-knowledge view

Amortise repeated repository discovery by maintaining an inspectable, replaceable relationship view that agents and people can reuse across tasks and sessions. Its purpose is faster orientation and multi-hop navigation, not to become architectural truth.

### OCE-IDEA-006 — Put the capability behind a replaceable provider boundary

Define provider-neutral operations such as census, ingest, update, query, path, explain, provenance, invalidate and export. This permits implementation change, graceful degradation and deletion of derived state without changing OCE's authoritative materials.

### OCE-IDEA-007 — Use progressive precision

Move deliberately through census, candidate discovery, identity disambiguation, exact traversal, evidence qualification and continuation. Fuzzy selection helps discovery but must not silently become exact identity or a consequential answer.

### OCE-IDEA-008 — Make bounded completeness a product property

Return a semantically complete result within a declared structural scope, or return a typed refusal. An implementation-imposed node, byte or time cutoff must never be presented as a complete answer.

### OCE-IDEA-009 — Make progressive continuation honest

Large exploratory results may use continuation only when each checkpoint is semantically whole, bound to the same generation and normalised query, and visibly incomplete. Arbitrary pagination must not weaken the meaning of negative, affected-set or completeness claims.

### OCE-IDEA-010 — Make diagnostics a first-class user outcome

Expose corpus coverage, exclusions, failed or empty extraction, ambiguity, unresolved references, unsupported features, projection loss, freshness, access filtering, transport differences and resource ceilings. A trustworthy instrument must know and explain when it cannot answer.

### OCE-IDEA-011 — Treat delivery and activation as part of the knowledge model

Represent proposed, accepted, implemented, packaged, installed, registered, served, exercised, effective, dormant and stale states separately. A file's existence does not prove host activation, successful use does not prove benefit, and documentation does not prove either.

### OCE-IDEA-012 — Add runtime capability introspection

Let extractors, stores, projections, algorithms and transports declare capabilities and prove them through executable probes. Feed those results into planning and answer qualification so unsupported operations are refused rather than guessed.

### OCE-IDEA-013 — Compile task evidence packets

Create small, expiring task packets containing goal, exact current authority, relevant evidence, live state, unknowns, contradictions, evidence budget and next discriminating probes. They should improve restart and handoff while remaining disposable rather than becoming another plan or source of authority.

### OCE-IDEA-014 — Provide semantically equivalent representations

Compile one typed result into visual, keyboard-operable tree, table, ordered outline, concise narrative, structured data, print, offline and assistive forms. Each form must preserve the task-relevant identities, directions, evidence status, omissions and continuation semantics it claims to represent.

### OCE-IDEA-015 — Design payload-aware interfaces

Avoid duplicating large complete results across structured and textual protocol fields. Structured output should be canonical and human-readable text should be a faithful rendering or summary of the same answer, not a second independently authored result.

### OCE-IDEA-016 — Derive service budgets from the live corpus

Generate size distributions, worst cases and response budgets from current data in CI. Root, member, byte, latency and context ceilings should be mechanically enforced rather than left as comments that decay while the corpus grows.

### OCE-IDEA-017 — Compare build, integrate and do-without options

For every substantial capability, compare building it, integrating an existing instrument, composing simpler tools and making no change. Selection should use sourced accuracy, omissions, verification burden, operational cost, replaceability and user value rather than feature breadth. Tiny reversible probes need proportional reasoning, not a ceremonial alternatives dossier.

### OCE-IDEA-018 — Measure full lifecycle cost per correct outcome

Include build and update compute, memory, storage, network, model use, latency, invalidation, human verification, maintenance, governance, errors and rework. Prompt-token savings alone are not an economic or environmental outcome.

### OCE-IDEA-019 — Use a branching, gated portfolio

Treat repository instrumentation, Practice observation, governed learning, source intervention, federation and beneficiary-facing work as distinct branches. Success in an earlier branch does not silently authorise a more consequential branch, and later branches may remain permanent non-goals.

### OCE-IDEA-020 — Require a value heartbeat

Every exploration should produce a first useful, durably recorded concept or answer within a bounded window. If assurance or architecture work consumes the whole window before a value-bearing artefact exists, stop and inspect the method.

## 2. Evidence, authority, identity and representation

### OCE-IDEA-021 — Keep one authority per semantic claim

Every consequential claim should have one legitimate canonical owner. Reports, indexes, generated adapters, tickets and relationship views may expose or support it, but must not become rival sources of truth through convenience or repetition.

### OCE-IDEA-022 — Keep derived state disposable

Graphs, indexes, summaries, confidence scores, reports and task packets should be safely deletable and reconstructable from identified authoritative inputs and versioned transformations. Rebuildability must be demonstrated rather than asserted.

### OCE-IDEA-023 — Separate deterministic fact, agent interpretation and human authority

Deterministic systems should establish identity, selection, ordering, traversal, limits and validation; agents should interpret and propose; legitimate people and governed processes should retain judgement and authority. Repeatability is valuable but does not by itself establish truth or meaning.

### OCE-IDEA-024 — Preserve a plural graph estate

Curriculum, repository, Practice, operational, search, evidence and outcome domains have different ontologies, authority, identity and lifecycle. Share only proven common mechanisms such as envelopes, generations and query contracts; do not flatten domain meaning into one universal ontology.

### OCE-IDEA-025 — Separate observation, assertion, projection and presentation

Record what a producer encountered, what was admitted as a governed claim, how it was transformed for a task, and how it was rendered as four distinct layers. This prevents raw extraction, interpretation, algorithmic convenience and prose from collapsing into one apparent truth.

### OCE-IDEA-026 — Preserve observations before aggregation

Record every source occurrence before set semantics, deduplication or consolidation. Equal statements may represent repeated evidence, duplication, independent contexts or separately correctable claims and must not overwrite one another.

### OCE-IDEA-027 — State evidence precision honestly

Classify evidence location as exact, container-level, document-level or unavailable with a reason. Coarse evidence is still useful when represented honestly; invented line-level precision is not.

### OCE-IDEA-028 — Keep identity layers distinct

Separate enduring entity identity, statement-content identity, observation occurrence, governed assertion, relationship or reifier, relation definition, projected edge, producer, corpus and generation. There should be no generic identifier whose meaning changes as data moves through the system.

### OCE-IDEA-029 — Make enduring identity independent of paths and labels

Represent moves, renames and aliases as new location observations over stable identity. Normalised paths, display labels and content hashes are useful evidence but are insufficient durable identities by themselves.

### OCE-IDEA-030 — Give consequential relationships first-class identity

Model a relationship as an addressable record or entity when it carries evidence, time, correction, access, parallel occurrences, participant roles or relationships of its own. Bare edges remain suitable for trivial task projections, not for governance-bearing semantics.

### OCE-IDEA-031 — Represent n-ary relations through role-bearing participants

Model decisions, experiments, activities and transformations as relation or event entities with labelled participant roles and ordering where relevant. Reducing them to untyped binary edges or detached metadata discards essential meaning.

### OCE-IDEA-032 — Define relation semantics explicitly

Give each relation a versioned definition covering endpoint classes, direction, inverse, symmetry, transitivity, temporal meaning, evidence requirements, authority, lifecycle, aggregation, traversal and validation. Attractive display labels must not substitute for semantic contracts.

### OCE-IDEA-033 — Use honest relation names

Name a relation for what its evidence actually establishes. Projected adjacency, lexical association and authored prerequisite are materially different even if a user interface could draw each as an arrow.

### OCE-IDEA-034 — Repair curriculum relationship semantics at the placement boundary

Derive prerequisite relationships only from supported emitted sequences after applying identical placement deduplication. Keep enduring unit identity separate from thread, year and placement occurrence; name lexical or projected adjacency honestly; retain supporting-thread evidence; and fail generation on unsupported or unintended self-loops and silently conflicting metadata.

### OCE-IDEA-035 — Preserve support for every derived relationship

Carry contributing observations, contexts, counts, authority and resolution state with each consequential assertion. Endpoint presence alone is not enough to explain, challenge or correct a relationship.

### OCE-IDEA-036 — Keep inference visibly distinct from assertion

Authored claims, deterministic derivations, probabilistic inference, heuristics, ambiguity, hypotheses and counterfactuals should remain distinguishable through serialisation and re-ingestion. Inference must never silently enter the asserted core or gain lifecycle authority.

### OCE-IDEA-037 — Treat evidence-method labels as categories, not probabilities

Labels such as observed, resolved, inferred and ambiguous can guide verification behaviour. Unless calibrated against a relevant task population, their scores must not be described as probabilities of correctness.

### OCE-IDEA-038 — Keep confidence separate from commitment

Recurrence, centrality, extraction confidence, model confidence, recency and apparent usefulness may influence inquiry. They cannot ratify a concept, approve a plan, confer authority or make an item current.

### OCE-IDEA-039 — Preserve direct evidence reachability

Every consequential derived answer should link to the exact authoritative material or observation supporting it, subject to access rules. The derived layer should reduce verification cost without becoming the only route to inspect the evidence.

### OCE-IDEA-040 — Make ignorance first-class

Record the population considered, exclusions, skipped and failed inputs, unresolved references, unsupported relation families, projection losses, query bounds and known blind spots. The system should be able to return “unknown within this method” as a successful answer.

### OCE-IDEA-041 — Preserve contradiction and protected dissent

Allow competing observations, claims, models, scope differences and challenges to coexist until a legitimate process resolves them. Visibility is neither rejection nor ratification, and low frequency must not erase important counterevidence.

### OCE-IDEA-042 — Make projection loss machine-readable

Every transformation that is not proven lossless should return typed loss entries covering unsupported representation, deliberate exclusion, lowering, ambiguity, aggregation, resource limits, access filtering, rejection and epoch incompatibility. Strict mode should fail unless the caller explicitly accepts named losses.

### OCE-IDEA-043 — Treat loss as part of transformation identity

Transformation profiles, accepted loss classes and authority-bearing metadata should participate in generation and cache identity. A status, scope, sensitivity or validity change must invalidate derived output even when the body bytes are unchanged.

### OCE-IDEA-044 — Make transformations composable and auditable

Define typed operations for census, parse, observe, resolve, assert, map, join, mount, aggregate, deduplicate, project, materialise and diff. Every non-trivial transformation should emit a versioned record naming inputs, configuration, operator sequence, relation rules, input-to-output mappings, ambiguity, validation, loss and whether an inverse exists for the declared subset.

### OCE-IDEA-045 — Align identities without destructive merge

Cross-domain or cross-repository alignment should preserve both native identities, the proposed relationship, match strength, evidence, asserting authority, time, scope and disagreement. Unknown or contested equivalence is a normal result.

### OCE-IDEA-046 — Make federation an explicit contract

Federated views should name mounted homes, generations, relation compatibility, access policy, alignment rules and loss. Federation is a task-specific query over preserved domains, not prefixing identifiers and unioning everything into one truth.

### OCE-IDEA-047 — Let algorithms generate questions, not verdicts

Centrality, communities, cycles, anomalies, cohesion, recurrence and similarity can prioritise inquiry. Return them with scope, parameters, comparator, sensitivity, artefact risks, evidence to inspect and a falsifying probe; never let them decide importance, authority, deletion or remediation.

## 3. Generation, query and interoperable substrate

### OCE-IDEA-048 — Define a corpus contract before extraction

Pin purpose, revisions, inclusion and exclusion rules, source classes, expected denominator, limits, sensitivity and failure policy. Without a corpus contract, “none found,” coverage, completeness and cost claims have no stable meaning.

### OCE-IDEA-049 — Use adapter-based heterogeneous extraction

Give each parser or provider a common observation envelope while requiring it to declare coverage, precision, feature support, determinism, incremental unit and failure behaviour. Breadth should come from adapters, not from flattening every input into one generic edge vocabulary.

### OCE-IDEA-050 — Preserve distinct extraction failure states

Differentiate legitimate empty input, unsupported syntax, unreadable input, parser failure, partial output, zero-output contradiction and successful extraction. Failed or partial work must not yield an apparently complete current generation.

### OCE-IDEA-051 — Make resolution separate, inspectable and reversible

Preserve the original reference, candidate identities, exclusions, ambiguity, selected target, resolver identity and validity domain. Unrecorded fuzzy rewriting or first-match selection must not become identity.

### OCE-IDEA-052 — Deny ambient document resolution by default

Structured-document processing should use an explicit no-network resolution policy. Any permitted context or dependency resolution should map exact identifiers to pinned local bytes, record content identity, apply recursion and size limits, and remain reproducible.

### OCE-IDEA-053 — Preserve named context and anonymous-identifier scope

Scope anonymous identifiers to their parsing or source domain and retain named-context membership. Mount, strip, union and rescope operations should be explicit transformations with declared loss rather than incidental consequences of loading.

### OCE-IDEA-054 — Preserve directional language values end to end

Language direction should survive construction, normalisation, statement identity, serialisation and canonicalisation. A format unable to carry it should reject the value or perform an explicitly authorised, loss-recorded lowering.

**Standards basis and local adaptation:** Directional language-tagged strings come from [RDF 1.2 Concepts and Abstract Data Model §3.4 (7 April 2026 Candidate Recommendation Snapshot)](https://www.w3.org/TR/2026/CR-rdf12-concepts-20260407/#section-Graph-Literal). OCE extends that data-model distinction across construction, normalisation, statement identity, serialisation and canonicalisation, requiring typed refusal or an explicitly authorised, recorded lowering wherever the selected profile cannot preserve it; [ADR-173](../../../../docs/architecture/architectural-decisions/173-graph-stack-topology.md#standards-evolution-and-tripwires) governs the evolving RDF 1.2-internal/RDF 1.1-wire boundary.

### OCE-IDEA-055 — Define a complete triple-term and reifier contract

Specify accepted triple-term grammar, nesting limits, assertion semantics, multiple reifiers and stage-by-stage preservation or refusal. A triple term is not asserted unless its corresponding triple is separately asserted, and a reifier must remain distinct from both the triple term and any projected edge.

**Standards provenance and local variation:** Adapted from W3C [RDF 1.2 Concepts §1.5](https://www.w3.org/TR/2026/CR-rdf12-concepts-20260407/#section-triple-terms-reification), a 7 April 2026 Candidate Recommendation Snapshot: a triple term need not be asserted, `rdf:reifies` links it to a distinct reifier, and that relationship may be many-to-many. The proposed local form takes the document's [Full RDF 1.2 profile](https://www.w3.org/TR/2026/CR-rdf12-concepts-20260407/#conformance)—not its Basic profile or an older RDF-star quoted-triple vocabulary—as the semantic reference. It retains ADR-173's RDF 1.2-internal/RDF 1.1–JSON-LD 1.1-wire split and adds bounded accepted grammar, nesting and resource use, separate triple-term/reifier/projected-edge identity, and stage-by-stage round-trip or typed refusal/loss. Those bounds and projection rules are local rather than W3C semantics; RDF/JS shape and full RDF 1.2 wire support remain tripwire-gated.

### OCE-IDEA-056 — Support several graph capability profiles

Use RDF dataset, property graph, directed multigraph and n-ary or hypergraph profiles for different tasks. Each should state what it preserves and loses; none should become the universal canonical representation.

### OCE-IDEA-057 — Validate projected edge identity

Give projected edges generation-scoped identities and validate duplicate handling, dangling endpoints, properties, parallel relations, context, multiplicity collapse and reconciled loss counts. A projected identifier must never become cross-generation authority.

### OCE-IDEA-058 — Keep standards boundaries exact and honest

Separate richer internal models from precisely conformant adapters. Test adapters against the upstream contract and real consumers so similar-looking types do not claim interfaces or behaviour they do not implement.

### OCE-IDEA-059 — Use versioned codec profiles

Every parser and serializer should name its media type, feature profile, source-scope policy, resolver policy, limits, evidence precision and loss behaviour. Stub directories and theoretical support are not capabilities.

### OCE-IDEA-060 — Profile and bound canonicalisation

Name the exact canonicalisation algorithm and feature domain, preflight unsupported constructs, apply resource budgets, domain-separate hashes and return no partial canonical result. Canonical bytes are meaningful only inside their declared profile.

### OCE-IDEA-061 — Apply layered validation

Validate corpus selection, raw shape, observations, identity, assertions, semantic constraints, time, authority, entitlement, generation, projections, queries, activation and outcomes separately. Different failures need different owners and remedies; one `valid` boolean cannot represent them safely.

### OCE-IDEA-062 — Classify findings and permissible repairs

Distinguish blocking, review-required and informational findings. Repairs should be classified as deterministic, manual with provenance, or forbidden so a validator cannot silently choose identity, authority, deletion or ratification.

### OCE-IDEA-063 — Add standards-shaped semantic validation

Validate graph semantics against pinned shapes, ontology, implementation, inference regime and budgets. Preserve a standard report and a reconciled typed summary; validator crashes, timeouts and unsupported features are operational failures rather than conforming results.

### OCE-IDEA-064 — Define an immutable generation manifest

Bind corpus, exact revisions, parsers, resolvers, profiles, configuration, evidence, coverage, loss, validation, projections, indexes and security purpose into one semantic identity. Mutable serving and activation timestamps should remain outside that identity core.

### OCE-IDEA-065 — Publish complete generations atomically

Stage and verify immutable bundles, activate them through a small atomic pointer and retain the previous known-good generation. Dataset, evidence, validation, indexes and projections must never become current in mixed epochs.

### OCE-IDEA-066 — Bind readers to one generation

Resolve the active generation once and keep every operation inside it, even if a newer generation activates concurrently. This provides internally consistent answers and reproducible continuation.

### OCE-IDEA-067 — Treat cold generation as the semantic oracle

Use a complete build from pinned authoritative material as the reference result. Incremental generation is an optimisation and remains disabled whenever add, modify, delete, rename, parser change, correction or dependency invalidation produces unexplained divergence.

### OCE-IDEA-068 — Treat indexes as replaceable projections

Record index schema, input generation, counts and checksums, and compare indexed results with a simple reference implementation. Add indexes only when representative queries and measured budgets justify them.

### OCE-IDEA-069 — Provide an exact query algebra

Support exact lookup, statement matching, typed incoming and outgoing relations, reachability, paths, induced subgraphs, frontiers, unresolved evidence, authority, temporal snapshots, semantic diff, explanation and impact. Keep the algebra transport-neutral and explicitly versioned.

### OCE-IDEA-070 — Compile queries into explicit plans

Every consequential query should name generation, anchors, identity resolution, relation definitions, direction, graph scope, authority filters, temporal interpretation, result shape, semantic bounds, operational budget, access context and continuation behaviour.

### OCE-IDEA-071 — Make result shape explicit

Distinguish traversal tree, induced subgraph, exact path set, edge cut, frontier and candidate set. The returned structure is part of the answer's semantics, not merely a rendering choice.

### OCE-IDEA-072 — Return witnesses and re-anchorable frontiers

Explain how every reached node was reached and identify the exact structural boundary at which exploration can continue. A frontier must never contain items omitted simply because runtime work ran out.

### OCE-IDEA-073 — Enforce transport parity

CLI, MCP, HTTP and in-process interfaces should compile to the same query plan and canonical structured result. Transport handlers should parse, dispatch and render, not implement independent traversal or reasoning.

### OCE-IDEA-074 — Use typed refusal rather than silent truncation

Operational budget exhaustion should return no purported complete answer. A separately requested progressive mode may return a qualified checkpoint, but an exact query must never degrade into incomplete success.

### OCE-IDEA-075 — Validate cross-projection consistency

Outputs claiming a common corpus, ordering or semantic basis should apply the same normalisation and support rules. Deterministic disagreement between public projections is still a defect even when each file validates alone.

### OCE-IDEA-076 — Secure corpus processing as untrusted-input handling

Use no source execution, bounded parsing, path containment, symlink and archive protection, secret minimisation, explicit network policy, hostile-content separation and entitlement-aware export. Read access does not authorise publication or external action.

### OCE-IDEA-077 — Compose fuzzy search with exact relations

Use search to retrieve candidates and typed relationships to explain connections, binding both to explicit epochs and exposing version mismatches. Search and graph projections must not duplicate truth without invalidation contracts.

### OCE-IDEA-078 — Keep substrate, domain and transport boundaries clean

Pure substrate packages should own identities and transformation mechanics; domain SDKs should own relation meaning; orchestration packages should own extraction and publication; applications should own transport and rendering. A small core does not remove complete-suite responsibilities.

### OCE-IDEA-079 — Activate one real repository-analysis path

Compose existing capture, classification, analysis, validation and publication into one supported command and one bounded consumer. Do not add more analysis modes before a real runtime can answer a useful question reproducibly.

### OCE-IDEA-080 — Keep command-line output automatable

Use machine-readable standard output, diagnostics on standard error, stable exit codes, explicit refs and generations, and no hidden writes. The CLI should be the reproducibility and automation surface, not a human-only wrapper.

### OCE-IDEA-081 — Provide generation-aware semantic diff

Distinguish changes in authoritative material, observations, identity resolution, assertions, evidence, authority and projections. Users should be able to tell whether an answer changed because the world changed or because the instrument changed.

### OCE-IDEA-082 — Provide evidence-qualified affected analysis

Traverse explicit reverse or policy-specific relations with generation, evidence per hop, missing-edge risk and relation policy visible. “Not reached” must never mean “safe” when coverage is incomplete.

## 4. Repository observatory and governed intervention

### OCE-IDEA-083 — Build a layered repository observatory

Expose joinable file, package, symbol, build, generation, runtime, test, decision, ownership, change, activation and outcome layers. Task-specific views should combine only the layers needed rather than relying on one opaque repository-intelligence model.

### OCE-IDEA-084 — Build a live capability observatory

Generate capability state from manifests and executable probes: what is claimed, present, installed, registered, served, exercised and last known working. Historical probes are evidence; the current ledger is a short-lived projection.

### OCE-IDEA-085 — Trace decisions into reality

Connect authority and decision through plan, behavioural contract, implementation, generated adapter, registration, conformance test, runtime probe and outcome. This reveals accepted intent that never activated and mechanisms that lack a governing decision.

### OCE-IDEA-086 — Provide reverse rationale lookup

Starting from a validator, hook, command, generated file or package, explain which decision and capability justify its existence and what would be affected by retirement. Historical linkage should inform review without proving the mechanism remains appropriate.

### OCE-IDEA-087 — Provide current-authority lookup

Answer what governs a question now, for which purpose and scope, why, and what it superseded or corrected. Search prominence, recent edits and graph centrality must not decide authority.

### OCE-IDEA-088 — Expose contradiction and projection consistency

Compare documentation with code, schemas with generated artefacts, declarations with served interfaces, and authoritative material with derived views. Contradictions should become inspectable evidence, not be automatically repaired by choosing one side.

### OCE-IDEA-089 — Provide temporal archaeology

Trace when a concept, capability, relationship or authority appeared, moved, changed, propagated, lost standing or left descendants. Path history and commit chronology are evidence, not enduring identity or present authority.

### OCE-IDEA-090 — Add an active inquiry engine

Maintain competing hypotheses and recommend the cheapest observation that most reduces decision-relevant uncertainty. Initially it should remain advisory and operate under explicit cost, privacy and authority limits.

### OCE-IDEA-091 — Support bounded counterfactual reasoning

Explore what might change if a provider, type, decision, package or capability changes, with assumptions, corpus, direction and missing-edge risk exposed. Counterfactual results are candidates for inquiry rather than observations.

### OCE-IDEA-092 — Use evidence-backed coordination

Attach work claims to exact generations, likely overlaps at files, symbols, generators and runtime owners, unresolved boundaries and previous collision outcomes. The model should route attention while peers and legitimate owners retain decision authority.

### OCE-IDEA-093 — Start with activation debt

Use known gaps between accepted decisions, present mechanisms and live behaviour as the first observatory corpus. These cases have legitimate owners, real descendants and falsifiable expected states, making them stronger than synthetic demonstrations.

### OCE-IDEA-094 — Prove a thin estate-knowledge slice

Begin with a small set of decisions, capabilities, implementation surfaces, statuses, evidence paths and one bounded query. Prove deterministic reconstruction, public/private separation, visible loss and safe deletion before expanding to conserved history or outside systems.

### OCE-IDEA-095 — Use multi-layer structural code analysis

Combine source text, concrete syntax, AST, symbols, types, control flow, data flow, effects, modules, builds, tests, history, ownership and decisions. This distinguishes meaningful abstraction opportunities from superficial repetition.

### OCE-IDEA-096 — Require concrete-syntax fidelity

Before automated editing, prove a no-op round trip preserves bytes or declared formatter equivalence, comments, directives, source maps, generated boundaries, diagnostics and public exports. A plain AST is rarely sufficient for faithful intervention.

### OCE-IDEA-097 — Evaluate abstraction fitness

For each candidate, consider semantic equivalence, variation axes, coupling, ownership, local reasoning, tests, public contracts, history, performance, blast radius and rollback. Repeated shape is evidence for inquiry, not proof that consolidation is beneficial.

### OCE-IDEA-098 — Include negative controls for intentional duplication

Evaluate generated code, fixtures, boundary adapters, compatibility surfaces, performance variants and deliberately separated implementations. A useful analyser must be able to refuse harmful abstraction, not merely find many candidates.

### OCE-IDEA-099 — Govern source intervention as a reversible experiment

Require an explicit change hypothesis, affected set, legitimate approval, isolated worktree, minimal patch, multidimensional verification, rollback and delayed outcome review. Broad autonomous refactoring should remain out of scope until read-only analysis beats simpler baselines.

### OCE-IDEA-100 — Explore tiered differential verification for proposed changes

Treat existing behaviour plus repository tests as a bounded behavioural specification and return distinct outcomes such as equivalent within profile, distinguishable with counterexample, possibly equivalent, unsupported or abstain. Behavioural equivalence is not correctness relative to intent, and intended feature changes may properly be distinguishable. Evaluate decisive coverage, false-equivalence, false-difference and abstention before using it as assurance.

### OCE-IDEA-101 — Preserve generator authority

When repeated output is generated, direct changes to the generator and governing contract rather than editing generated files. Generated artefacts are evidence of activated behaviour, not the place to author enduring intent.

### OCE-IDEA-102 — Give `agent-tools` an explicit capability architecture

Classify each capability by operational role, input state, output authority, Practice contract, runtime mode, owner, migration and failure posture. Package size is not itself an architectural boundary.

### OCE-IDEA-103 — Keep stable operational tools on stable execution paths

Frequently used identity, coordination, claims and continuity commands should run declared, tested built artefacts. Research and development commands may remain source-mode when explicitly classified rather than silently sharing the hot operational path.

### OCE-IDEA-104 — Decompose tools by independent change pressure

Split or consolidate only when state ownership, runtime guarantees, lifecycle or genuine reuse demands it. Visual similarity and file count are poor substitutes for an architectural seam.

### OCE-IDEA-105 — Apply the observatory to the Practice itself

Surface contradictory live doctrine, inactive decisions, orphaned projections, stale catalogues, unclosed intentions, undigested memory and governance added to manage governance. Produce source-grounded review candidates, never automatic doctrine deletion.

## 5. Practice, memory, learning and portability

### OCE-IDEA-106 — Treat repository models as projections, not institutional memory

A rebuildable AST, dependency view, capability census, index or task model represents a current perspective. Durable memory should instead preserve what was observed, how, under which revision, what was unknown, which decision used it, what happened and how later correction changed its standing.

### OCE-IDEA-107 — Keep memory separate from learning

Retention and retrieval do not establish learning. Learning requires a validated change in later behaviour, capability or decision quality, with selection, evidence, outcome measurement, correction and authority withdrawal all functioning.

### OCE-IDEA-108 — Classify memory on orthogonal axes

Classify retained claims and transitions independently by semantic role, epistemic provenance, authored lifecycle, materialisation, influence, scope, purpose, sensitivity and time. Do not force observation, commitment, operational state and projection into one ladder or one physical store.

### OCE-IDEA-109 — Separate memory functions from memory kinds

Evidence, claims and models, operational policy, intention, identity or constitutional continuity, and working context are jobs performed by retained material. The same observation or commitment may participate in several functions without changing its authority or provenance.

### OCE-IDEA-110 — Use logical responsibility planes rather than one memory substrate

Keep authoritative carriers, observations and evidence, operational state, experiential candidates and disposable projections distinct in responsibility while allowing existing fit-for-purpose physical stores. Treat learning and federation as governed processes connecting those planes, not as another universal database.

### OCE-IDEA-111 — Interoperate through a small envelope with specialised payloads

Use a versioned query and exchange envelope for identity, provenance, lifecycle, scope, evidence, time, authority, access and declared loss while leaving type-specific payloads in suitable carriers. Preserve unknown extensions, forbid silent downgrade and require a demonstrated second consumer before adding mandatory common fields.

### OCE-IDEA-112 — Model many speeds rather than “fast” and “slow” stores

Separate capture latency, stabilisation cadence, retrieval latency, revalidation, ratification, withdrawal, propagation and retention horizon. A slowly authored constitutional rule may need immediate withdrawal, while a short-lived operational observation may need instant retrieval.

### OCE-IDEA-113 — Give consequential records multiple clocks

Represent event, observation, validity, transaction, grounding, review, status transition, activation, expiry, projection epoch, correction, withdrawal and propagation-complete times where relevant. “Current” without a declared clock and generation is unsafe for consequential queries.

### OCE-IDEA-114 — Separate historical truth from current applicability

An observation may remain historically accurate after its present-tense applicability ends. Closing validity, withdrawing action eligibility and preserving evidence are distinct operations.

### OCE-IDEA-115 — Append corrections rather than rewriting history

False observations gain linked corrections; true-then-changed states gain later observations; interpretations are revised separately; commitments follow authorised supersession or retirement. Physical erasure remains a separate workflow for cases where continued existence is illegitimate.

### OCE-IDEA-116 — Use typed episodic memory

Retain tasks, incidents, reviews and tool runs with stable episode identity, exact revision, purpose-minimised ancestry, evidence and outcome links. Episodes are observations and may be corrected; they do not become lessons or doctrine merely by being stored.

### OCE-IDEA-117 — Treat working memory as an expiring projection

Working packets should remain small, source-linked and aggressively disposable. Only selected observations, decisions and reusable lessons should graduate; whole prompts, transcripts and temporary reasoning should not become institutional memory by default.

### OCE-IDEA-118 — Give prospective memory terminal semantics

Future-directed commitments should end as fulfilled, cancelled, abandoned, replanned or breached. Passing a due date should expose an unresolved obligation rather than leaving it indefinitely active or automatically falsifying the underlying hypothesis.

### OCE-IDEA-119 — Separate obligations from forecasts

Obligations use fulfilment and cancellation states; predictions use supported, falsified, inconclusive or revised states. Conflating them makes both plans and learning difficult to close honestly.

### OCE-IDEA-120 — Build outcome and causal memory

Link prediction, intervention, baseline, assignment, activation, exposure, immediate and delayed observations, confounders, regressions, harms, non-use and final disposition. “Mechanism X caused outcome Y” remains an interpretation requiring evidence, not a field inferred from temporal adjacency.

### OCE-IDEA-121 — Preserve failure duals and denominators

Record eligible populations, non-use, abandonment, missing outcomes, delayed rework, false positives, false negatives and harm as deliberately as visible success. Otherwise the learning loop will select for completion and self-reported usefulness.

### OCE-IDEA-122 — Maintain calibration by task family

Retain task- and corpus-specific precision, recall, abstention and reliability for extractors, queries, reviewers and mechanisms by version. Calibration should route tool choice without becoming a global confidence or self-certification score.

### OCE-IDEA-123 — Preserve influence lineage

Connect observations to interpretations, interpretations to decisions, and decisions to rules, adapters, actions and task packets. A correction should identify known descendants and their reconciliation state while leaving authority with each carrier's legitimate owner.

### OCE-IDEA-124 — Treat forgetting as a family of operations

Distinguish discard, expiry, invalidation, correction, supersession, deprecation, retirement, de-indexing, suppression, quarantine, archive and physical erasure. One decay score or delete API cannot safely represent all of them.

### OCE-IDEA-125 — Track influence dimensions separately

Represent discoverability, ordinary retrieval, epistemic weight, action eligibility, activation, behavioural efficacy, transmissibility, persistence, recoverability and physical existence independently. Historical availability must not imply permission to act.

### OCE-IDEA-126 — Add anti-memory and anti-resurrection state

For material that must remain historically discoverable but operationally terminal, retain the minimum marker needed to state the legitimate transition, scope and reactivation conditions. Avoid tombstones that reproduce sensitive or rejected payloads so extensively that they recreate the problem.

### OCE-IDEA-127 — Distinguish rederivation from restoration

Restoring an old conclusion and independently reaching a similar conclusion with new evidence are epistemically different. Preserve new evidence, environment and ancestry so genuine recurrence can be assessed without inheriting historical authority.

### OCE-IDEA-128 — Remember schema and category history

Record why a classification exists, which revision introduced or changed it, alternatives considered and which downstream observations depend on it. This makes reclassification effects visible without freezing categories forever.

### OCE-IDEA-129 — Remember affordances and recovery paths

Retain substitutes, degraded host paths, manual fallbacks, equivalent behavioural contracts, reconstruction routes and recovery cost. Dependency knowledge says what is connected; affordance knowledge says what can be substituted, relearned or rebuilt.

### OCE-IDEA-130 — Preserve memory of silence and non-observation

Record when a population was never measured, a runtime was not probed, an affected party was not consulted or material was unavailable. Silence differs from a negative observation and from forgetting; preserving the boundary prevents missing evidence becoming consensus.

### OCE-IDEA-131 — Carry purpose, consent and standing with relevant memory

Where observations concern people, private work or consequential decisions, retain the legitimate purpose, standing, allowed uses, visibility, retention and change conditions. These constraints should travel with derivatives rather than remaining only at the initial boundary.

### OCE-IDEA-132 — Make deliberate non-observation a governed privacy and power boundary

Decide which facts and relationships should never be collected rather than relying only on later access control or erasure. Preserve a usable service after legitimate refusal, and prohibit non-participation itself from becoming a harmful signal.

### OCE-IDEA-133 — Include material and attention cost in memory

Record compute, storage, review, context, maintenance and governance burden alongside mechanism outcomes. This prevents elaborate epistemic machinery from appearing successful while displacing product work or creating cognitive debt.

### OCE-IDEA-134 — Make recurrence independence-aware

Retain only enough scoped or pseudonymous ancestry to distinguish independent evidence from repeated queries, shared model ancestry or copied mechanisms. Durable personal identity is neither required nor justified merely to assess corroboration.

### OCE-IDEA-135 — Observe retrieval and attention effects

Track which evidence classes and task packets were actually used, where retrieval caused confusion and where context budgets were wasted. Use the result to calibrate routing, never to rank doctrine by popularity.

### OCE-IDEA-136 — Keep quarantine cross-cutting

Poisoning suspicion, sensitivity, access, purpose and anti-reingestion policy should apply across every memory and projection class. Quarantine is a control over use and existence, not another semantic memory type.

### OCE-IDEA-137 — Use event representations only where they fit

Append-only events and deterministic renderers may suit transition histories and operational narratives. Prove them with a falsifiable specimen rather than turning an event graph into the universal memory substrate.

### OCE-IDEA-138 — Separate portable behaviour from host phenotype

The Practice should own behavioural contracts and invariants; each repository should own its language, files, schemas, tools, hooks, state and enforcement mechanism. Portability means semantic capability, not implementation imitation.

### OCE-IDEA-139 — Evaluate semantic conformance across hosts

Test observable behaviours such as identity continuity, collision handling, handoff, supersession, recovery, public/private boundaries and rebuildability. Paths, commands, schemas and programming language should remain free to differ.

### OCE-IDEA-140 — Maintain a cross-host phenotype census

Compare implemented capabilities, purposeful divergence, omissions, equivalent mechanisms, host constraints, failures and outcomes. Distinguish missing capability, inapplicable capability, productive alternative and genuine conformance failure.

### OCE-IDEA-141 — Keep capability exchange bidirectional

Any Practice instance should be able to propose a lesson, concept, alternative mechanism, falsifier or improvement with constraints and local evidence. Every receiving instance should independently adopt, adapt, reject or defer it.

### OCE-IDEA-142 — Separate distribution from learning

Distribute immutable Practice releases while local experience remains repository-owned and enters a distinct exchange and disposition loop. A package manager should not become the learning system, and consumers should never edit dependency contents to record experience.

### OCE-IDEA-143 — Use package-neutral Practice releases

Define a content-addressable release containing Core, manifest, schemas, conformance fixtures, lineage and optional capabilities. Ecosystem-specific packages may install or mirror it, but no one package manager should become a prerequisite for unrelated stacks.

### OCE-IDEA-144 — Materialise Practice content visibly

Make the applicable agent-readable content inspectable in the repository with origin, version and ownership metadata. Hiding doctrine entirely inside an installation directory impairs review, search and comprehension.

### OCE-IDEA-145 — Make upgrades semantically reviewable

Show meaningful changes between Practice releases, preserve unresolved local adaptations and never overwrite repository-owned learning silently. An upgrade should be an explicit local adoption decision.

### OCE-IDEA-146 — Put a cost gate on the portable core

Every proposed Core addition should justify why all Practice-bearing repositories need it, what effect it predicts, whether an existing concept can absorb it and what can be retired or remain optional. Easier packaging does not make unnecessary complexity cheap to understand.

### OCE-IDEA-147 — Compile capabilities into host-native expressions

Combine stable capability identity, behavioural contract, authority and safety constraints, host feature model and conformance fixtures to generate or verify host-native mechanisms and degraded fallbacks. Generation does not decide authority, and presence does not prove activation.

### OCE-IDEA-148 — Make mechanism maturation observable

Track idea, local specimen, repeated mechanism, behavioural contract, conformance fixture, second phenotype, portable commitment and outcome review as distinct states. Repetition is not yet portability, and portability is not yet effectiveness.

### OCE-IDEA-149 — Build a Practice effectiveness lab

Compare mechanisms on repository recall, change impact, interrupted-task recovery, stale-authority avoidance, coordination, context cost, verification burden, delayed rework and harm. Preserve negative results and compare with direct inspection and simple instructions.

### OCE-IDEA-150 — Require outcome evidence outside the machinery

Each substantial graph, agent-tool or Practice capability should name an externalised effect such as better decisions, safer changes, faster recovery, fewer stale claims or improved human auditability. Internal conformance and mechanism use are not outcomes.

### OCE-IDEA-151 — Prove correction before increasing capture

Demonstrate that obsolete influence can be withdrawn, descendants reconciled and historical evidence preserved before adding more retention or observability. New capture should stop when correction and disposition debt grows faster than it can be resolved.

### OCE-IDEA-152 — Prove local correction before federation

Do not export or federate learning that cannot be corrected reliably at home. Cross-repository dissemination multiplies stale-authority and anti-resurrection risk.

### OCE-IDEA-153 — Require outcomes before infrastructure generalisation

A useful specimen does not automatically justify a platform. Generalise only when repeated decision value, genuine second consumers and manageable lifecycle cost establish the seam.

## 6. Positive-impact opportunity portfolio

### OCE-IDEA-154 — Co-design modality-specific access

Evaluate visual, textual, keyboard, assistive, print, small-screen and low-power experiences with users of those modes. Use the shared semantic contract as a parity baseline while permitting modality-specific interaction structures; test task accuracy, source reachability, navigation, error recovery and cognitive burden.

### OCE-IDEA-155 — Teacher-governed curriculum adaptation preview

Let a teacher propose a bounded addition, removal or substitution and inspect potentially affected prerequisites, progression, learning points, misconceptions, resources, restrictions, alternatives and unknowns. The teacher remains the decision-maker, and incomplete evidence must never be labelled safe.

### OCE-IDEA-156 — Claim challenge, adjudication and remedy trace

Trace a claim through evidence, scope, authority, publication, challenge, legitimate adjudication, correction, withdrawal and every declared derivative. Technical traceability should support safe human contact, standing, reasoned decisions, appeal and remedy rather than substitute for them.

### OCE-IDEA-157 — Correction-aware offline knowledge packs

Publish signed, bounded, accessible local packs with currentness, expiry, delta updates, correction tombstones and local query support. Be explicit that disconnected uncontrolled copies cannot be remotely corrected, recalled or erased.

### OCE-IDEA-158 — Equity and ignorance observatory

Relate content and access coverage, available formats, localisation, device and connectivity requirements, and explicit unknowns. Begin with non-personal inventories and affected-group governance; do not infer protected characteristics or turn missing outcome data into zero.

### OCE-IDEA-159 — Public algorithm and AI transparency bundles

Generate versioned, source-linked views of purpose, governing authority, code, model, prompts, configuration, data rights, tests, limitations, incidents, outcomes and correction routes for different audiences. Generated disclosure cannot itself satisfy assurance, legal or safeguarding obligations.

### OCE-IDEA-160 — Resource-per-correct-outcome routing

Measure CPU, energy where reliable, bytes, memory, model calls, latency, network, storage, invalidation and human verification for competing answer paths. Route to the least costly method that still satisfies a risk-specific evidence contract.

### OCE-IDEA-161 — Humane automation and capability preservation

Study interruption loops, repeated archaeology, recovery burden and automation-induced skill erosion. Offer optional evidence-path and teach-back modes that reduce burden while preserving human understanding; prohibit productivity scoring and raw manager access to worker-level evidence.

### OCE-IDEA-162 — Epistemic and representational justice review

Use participatory, contestable rubrics and evidence inventories to surface possible omissions, marginalisation and misleading relationships. Automated topology may propose items for inspection but must not treat frequency or centrality as educational or cultural worth.

### OCE-IDEA-163 — Continuous assurance and safety-case views

Link claims, hazards, affected populations, controls, requirements, code, tests, runtime evidence, incidents, owners, challenges and review dates. Use the view to detect stale or unsupported links; it must not certify control effectiveness or make release decisions.

### OCE-IDEA-164 — Public-service resilience and affordance models

Connect providers, packages, data authorities, licences, controls, roles, fallbacks, rehearsals and user consequences for bounded scenario testing. Keep sensitive topology access-controlled and compare against ordinary runbooks to avoid false digital-twin confidence.

### OCE-IDEA-165 — Cooperative public-interest capability commons

Exchange behavioural contracts, conformance tests, host constraints, failures and outcome evidence across public-interest projects while preserving local implementation and authority. Governance must include maintenance, attribution, reciprocal benefit, forkability and exit.

### OCE-IDEA-166 — Reproducible repository-intelligence benchmark commons

Publish pinned corpora, question taxonomies, plural ground truth, raw outputs, projection manifests, baselines and failure cases. Include held-out, adversarial, unanswerable and disagreement cases so tidy fixtures do not become misleading proof of real-world utility.

### OCE-IDEA-167 — Mission-to-outcome hypothesis and evidence maps

Relate intervention, release, exposure, use and non-use, benefit, burden, harm, challenge and remedy with explicit causal status. Evaluation design, privacy, participant legitimacy and independent outcome ownership come first; a graph cannot establish causality.

### OCE-IDEA-168 — Reciprocal organisational legibility

Help people understand agent actions while helping agents understand responsibility, authority, dependency, challenge and correction paths. Design for coordination and mutual intelligibility rather than one-sided managerial surveillance.

## 7. Concept development and implementation discipline

### OCE-IDEA-169 — Separate problem, impact, capability, mechanism, architecture and expression

Keep these design layers explicit and descend through them using OCE's own context and constraints. A capability name should not smuggle in a package decomposition, interface, workflow or implementation.

### OCE-IDEA-170 — Allow discovery to reveal latent opportunity

Record and explore concepts that expose a genuinely new possibility even when no prior backlog item names the need. Require an OCE-specific warrant and falsifiable impact hypothesis only before consequential promotion, not before the idea may exist.

### OCE-IDEA-171 — Put local warrant at the implementation gate

Before committing to build, establish the affected party, current difficulty, consequences, existing partial solutions, relevant authority and predicted change. Do not make demonstrated local need a prerequisite for curiosity, free play or idea capture.

### OCE-IDEA-172 — Do not demand artificial novelty in common primitives

Parsers, typed schemas, event logs, databases, queues, Git, standard algorithms and established protocols may be selected when they best fit the constraints. Novelty should arise where OCE's purpose, authority, identity, time, correction or composition genuinely requires it.

### OCE-IDEA-173 — Author OCE-native requirements and interfaces

Write requirements, architecture, schemas, fixtures, tests, prose and user surfaces from OCE's chosen design. No inherited package structure, command surface or user journey should become the target without independent justification.

### OCE-IDEA-174 — Use impact-based acceptance

Define success through changed OCE outcomes and safe behaviour under stale, incomplete, contradictory or discarded derived state. Similarity to another tool, feature matrix or architectural picture is irrelevant to acceptance.

### OCE-IDEA-175 — Preserve useful design chronology

Retain dated questions, alternatives, decisions, rejected mechanisms, expected effects and review outcomes so later workers can understand how a design arose and why it changed. Chronology should aid learning, not become an exhaustive barrier to action.

### OCE-IDEA-176 — Use targeted specialist escalation

Escalate only when a mechanism is unusually specific, consequential, irreversible, rights-sensitive, commercially material or plausibly constrained by law or safety. Broad conceptual exploration should not carry implementation-grade legal or assurance ceremony.

### OCE-IDEA-177 — Apply progressive assurance

Use cheap capture and exploration first, stronger review at proposal, and deep provenance, security, rights and implementation controls at consequential promotion. Rigor should intensify at the boundary where the protected property becomes vulnerable.

### OCE-IDEA-178 — Generalise at a real second consumer

Create shared abstractions when another actual consumer needs the same semantics and lifecycle, not because two mechanisms look similar. Visual or terminological resemblance does not establish a common domain abstraction.

### OCE-IDEA-179 — Implement real operations before reserved placeholders

Expose stable entrypoints only when a concrete operation, tested semantics and consumer exist. Declared-but-unimplemented paths should remain visibly absent rather than presenting speculative completeness.

### OCE-IDEA-180 — Use failure archaeology as design input

Treat stale-state bugs, response overflows, build drift, projection loss, ambiguity and retrieval noise as evidence of the real engineering frontier. A fixed bug should strengthen an invariant and regression test, not automatically justify permanent process accretion.

## 8. Resolving experiment ideas

### OCE-IDEA-181 — Gold repository-question trial

Evaluate a versioned set of consequential, ambiguous and deliberately unanswerable questions against direct inspection, text search, language services, existing tools and derived relationship views. Continue only when sourced accuracy, verification cost or uniquely valuable multi-hop answers improve.

### OCE-IDEA-182 — Pilot-corpus closure spike

Compare candidate corpora for the smallest end-to-end census-to-answer slice. Stop when closure depends on manual repair, silent partial extraction or infrastructure disproportionate to the questions.

### OCE-IDEA-183 — Identity and projection conformance corpus

Exercise repeated occurrences, parallel relations, named contexts, relationship properties, the triple-term and reifier cases defined by OCE-IDEA-055, and role-bearing n-ary relations. Reject any design in which consequential collapse remains silent.

### OCE-IDEA-184 — Direction and transport-parity trial

Run incoming, outgoing, bidirectional, exact path and affected queries through every public transport. Any difference in normalised plan or reachable set is a defect rather than a presentation variation.

### OCE-IDEA-185 — Incremental-versus-cold differential trial

Exercise add, change, delete, rename, parser failure, correction and configuration changes. Disable incremental mode on any unexplained semantic divergence from a clean rebuild.

### OCE-IDEA-186 — Historical affected-set replay

Replay known changes and downstream failures to determine whether typed impact analysis improves recall at an acceptable false-positive and verification cost. Missing-edge risk must remain visible.

### OCE-IDEA-187 — Decision-to-reality specimen

Trace a small number of accepted capabilities through implementation, registration, serving and executable probes. Continue only if the view finds real activation gaps that lead to useful action without heavy manual curation.

### OCE-IDEA-188 — Correction-withdrawal replay

Correct or retire one governed item across authoritative material, generated corpora, search, tools, task packets, memory and offline derivatives. Continue only if current influence disappears within the declared boundary while history remains inspectable.

### OCE-IDEA-189 — Task-packet comparison

Compare interrupted-task restart and new-task orientation with and without a bounded evidence packet. Stop when packets go stale, confuse authority, duplicate canonical material or cost more than direct inspection.

### OCE-IDEA-190 — Structural-inquiry yield trial

Blindly compare questions suggested by structural analytics with degree, random, file-level and expert baselines. Continue only when actionable, source-verifiable inquiry improves and remains stable across reasonable projections.

### OCE-IDEA-191 — Read-only code-candidate study

Evaluate structural simplification candidates, intentional-duplication controls and no-op syntax fidelity against direct review. Stop when semantic fidelity fails, coupling grows or candidate precision does not beat simpler methods.

### OCE-IDEA-192 — Governed outcome-feedback trial

Bind exact evidence and exposure to later outcomes, corrections and non-use, then test whether reviewed orientation improves future tasks. Stop when feedback is sparse, popularity dominates or authority drifts.

### OCE-IDEA-193 — Cross-host capability exchange trial

Move one behavioural capability to a genuinely different host while preserving local implementation and authority. Stop when transfer requires stack imitation, a central ontology or semantic loss.

### OCE-IDEA-194 — Modality-equivalence trial

Compare task accuracy, source reachability, navigation, error recovery and burden across visual, structured text and relevant assistive modes with users of those modes. Stop on consequential semantic drift or disproportionate burden.

### OCE-IDEA-195 — Resource-per-correct-answer trial

Measure full lifecycle cost for competing answer paths under fixed workloads and risk-specific correctness floors. Stop when differences fall inside measurement noise or routing selects weaker evidence.

### OCE-IDEA-196 — Privacy, power and hostile-input red team

Test path disclosure, private overlays, re-identification, hostile instructions, malicious labels, purpose limitation, retention and non-interference. Block sensitive branches on leakage, instruction capture or illegitimate people-data use.

### OCE-IDEA-197 — Beneficiary-facing pilot

Test one authorised teacher or user decision with a comparator, burden and harm measures, privacy stop and correction route. Stop when only internal usage, activation, developer speed or tool convenience improves.

## 9. Deliberate refusals and negative learning

The following are significant design decisions in their own right:

- No universal graph, ontology, digital twin or derived authority.
- No simple graph as the sole evidence store for multiplicity, provenance, time or correction.
- No labels, paths or content hashes as sufficient enduring identity.
- No scalar score standing in for evidence, truth, authority, applicability, currentness and completeness.
- No undirected association described as dependency, effect or causal path.
- No centrality as importance, community as module, density as quality or recurrence as authority.
- No query result presented as an answer without corpus, generation, bounds, omissions and direct evidence.
- No best-effort partial update presented as current.
- No stale derived view blocking direct inspection of authoritative material.
- No usefulness vote, query recurrence or agent agreement treated as independent corroboration.
- No cross-domain or cross-repository federation by label merge or unqualified union.
- No graph-first mandatory hooks before freshness, recall and fallback behaviour are proved.
- No advanced query standards, distributed storage or subscriptions before a real consumer and measured need.
- No automatic authority promotion, popularity decay, age decay or semantic repair.
- No broad autonomous refactoring before fidelity, negative controls and delayed outcomes are established.
- No individual productivity, wellbeing or coordination scoring.
- No public universal internal topology that exposes sensitive relationships or attack paths.
- No public-benefit or causal claim from repository metrics, developer speed, activation or tool use.
- No universal people or outcome graph; prefer purpose-bound studies, aggregate records and explicit non-observation.
- No claim of physical erasure when material has only been archived, hidden or de-indexed.
- No package-manager monopoly over the Practice.
- No feature-parity definition of cross-host conformance.
- No hidden doctrine inside installation directories.
- No generated artefact treated as the place to author semantic intent.
- No permanent retention of rebuildable projections without a justified audit need.
- No new capture mechanism while unresolved correction and disposition burden is growing faster than it can be resolved.
- No exhaustive annotation, coverage quota or corpus relocation merely to make a model tidy.
- No additional schema, register or governance layer unless it changes the quality, speed, safety or auditability of real work.

## 10. Catalogue use

This catalogue is intentionally broader than an immediate plan. For any item, first resolve its
relationship to current authority: whether it restates, extends, conflicts with or is not yet
represented by that authority. A restatement remains governed by its canonical source and needs no
promotion here. An unratified item may then be recorded only, merged with an existing OCE concept,
investigated, tested through a bounded experiment, proposed through the normal planning or decision
path, or explicitly rejected. Preserve the full catalogue so ideas not selected now remain
discoverable without remaining operationally active.
