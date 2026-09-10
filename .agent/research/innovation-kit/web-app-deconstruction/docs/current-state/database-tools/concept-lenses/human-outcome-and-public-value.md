# Database, API and OCE through human-outcome and public-value lenses

## Status and method

This record runs fixed portfolio lenses 1-6 from the
[Database, API and OCE concept-lens portfolio](README.md). Local lens numbers are
sequential to satisfy the research validator; the fixed correspondence is
explicit below.

Evidence is pinned to:

- `Database-Tools@3d1eff31`;
- `oak-openapi@2fb1383b`; and
- [`OCE@bd878a3a`](https://github.com/oaknational/oak-open-curriculum-ecosystem/tree/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa).

Every lens follows OCE's pinned
[`concept-exploration`](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/.agent/skills/concept-exploration/SKILL-CANONICAL.md)
workflow. This is architecture research for OCE and the Oak Innovation Kit, not
a remediation plan for the source repositories.

### Evidence notation

- **Observed:** directly encoded at a pinned source revision.
- **Inferred:** interpretation warranted by the observations.
- **Unknown:** important outcome evidence not established by static source.
- **Candidate explanation:** a plausible account retained for discrimination.
- **Proposition:** a falsifiable claim about the current chain or a better basis.

Source can establish intended purpose, encoded fields, transformations, policy
branches, contracts and tests. It cannot establish learning, representative user
experience, public impact, institutional competence or deployed behaviour merely
because code for them exists.

## Perspective map

| Local lens | Fixed lens                            | Primary protected outcome                                                |
| ---------- | ------------------------------------- | ------------------------------------------------------------------------ |
| 1          | 1: teleology and system purpose       | architecture serves the right ends rather than reproducing prior means   |
| 2          | 2: educational validity               | curriculum claims remain warranted, contextual and recognisably Oak      |
| 3          | 3: teacher and editor work            | people can author, judge and use curriculum with truthful feedback       |
| 4          | 4: pupil capability and access        | downstream experiences preserve safety, dignity and equivalent access    |
| 5          | 5: public value and ecosystem reach   | open public goods create equitable value without evading rights or trust |
| 6          | 6: developer progress and maintenance | consumers achieve correct outcomes without repeated archaeology          |

## Lens 1: teleology and system purpose

### Governing question

What ends justify this database-to-API-to-kit chain, and which present mechanisms
are means rather than requirements?

### Movement 1: reflect on raw observations

#### Literal observations

- **Observed:** Database-Tools describes itself as the database platform behind
  Oak's curriculum API, website, Aila and internal tools
  (purpose).
- **Observed:** oak-openapi calls itself a public-alpha API and requires API keys
  for REST access
  (status and access,
  key requirement).
- **Observed:** OCE states three co-equal ends: help teachers find, adapt and use
  high-quality resources; help organisations serving schools build better
  tools; and publish open components, data access and engineering Practice as
  public goods
  ([declared ends](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/README.md#L6-L21),
  [co-equal streams](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/README.md#L49-L63)).
- **Observed:** OCE's diagnosis says Oak's value is curriculum rigour held
  together with reach and pace, while the teacher remains the expert
  ([diagnosis](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/docs/strategy/diagnosis.md#L16-L37)).
- **Observed:** the current chain includes at least PostgreSQL, triggers,
  migrations, schema docs, Hasura, several generated and hand-authored schema
  systems, Redis, Prisma, GCS/Mux, OpenAPI, OCE code generation, MCP, search and
  bulk paths. Each arose at a delivery boundary; none is named as a human end.

#### Inherited assumptions exposed

- **Inferred:** “build an Oak app” can be misread as rebuilding a website or
  copying the existing estate. The declared purpose is instead to make Oak's
  rigour usable by teachers and additional ecosystem consumers.
- **Inferred:** a mechanism deserves to survive only if removing or replacing it
  would violate an independent outcome, obligation or quality property.
- **Inferred:** OCE is deliberately both a product and an enabling kit. A rule
  that waits for a second consumer would contradict the stated ecosystem end.

### Movement 2: define the problem space

**Problem frame:** an excellence-first Oak kit must preserve the curriculum's
educational rigour, provenance, rights and public-service obligations while
making useful capabilities available to teachers and additional builders. It
must not confuse fidelity to those ends with fidelity to today's data stores,
frameworks, routes, schema shapes or workarounds.

The protected unit is a valued capability with evidence: for example, “obtain
the complete released curriculum graph with provenance” or “give a teacher
rights-safe resources and context for professional judgement.” The unit is not
an MV, endpoint or generated package.

Success means architecture can explain why every substantial concept exists,
which outcome it protects, what evidence shows that it works and what could
replace it. Excellence is the governing constraint; reduced innovation and
maintenance burden follows from coherent authority and removal of accidental
complexity rather than from lowering the bar.

### Movement 3: reflect on possible explanations

#### Competing explanations

1. **Candidate explanation:** the present chain is the minimum complexity needed
   to serve distinct authoring, online, binary, search and bulk outcomes.
2. **Candidate explanation:** it contains genuine distinct obligations, but
   several systems exist only because releases, rights and relationships were
   never made first-class.
3. **Candidate explanation:** OCE primarily needs a typed adapter to the current
   API; deeper domain concepts would duplicate upstream ownership.
4. **Candidate explanation:** the API is one useful provider, while OCE's durable
   product is a set of provider-independent curriculum capabilities and
   conformance expectations.

#### Changed assumption

The starting unit “Database-Tools -> oak-openapi -> OCE pipeline” changed.
**Inferred:** the truer unit is an outcome-to-authority-to-evidence chain. Several
technical layers may implement one outcome, and one present layer may serve
several outcomes that should be separated.

### Movement 4: synthesise and propose

#### Synthesis

**Inferred:** the estate is valuable evidence of what Oak must accomplish, not a
template for how OCE must be built. Its strongest enduring signals are published
curriculum identity, complete relationships, rights-safe access, professional
teacher authority, public provenance, stable ecosystem contracts and truthful
operations.

| Warranted investigation or proposal                                                                                                                 | Warrant                                                                                                     | Explicit falsifier                                                                                                                 |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Build an outcome map from teacher, editor, pupil-protective and ecosystem jobs to authorities, evidence and failure before choosing OCE mechanisms. | Current architecture names technical workspaces while OCE strategy names human and public ends.             | An existing current map already connects every material mechanism to an independently validated outcome with no unexplained layer. |
| Run a premise-removal exercise on every major system: remove it conceptually, retain its obligations, and design the smallest coherent replacement. | Several current mechanisms compensate for split release, policy, projection and contract authority.         | Every removal either loses an independent obligation or produces greater semantic/operational complexity under adversarial review. |
| Treat provider adapters, products and the reusable kit as distinct compositions over one capability model.                                          | OCE deliberately serves current products and additional future consumers; their policies need not coincide. | Every foreseeable additional consumer requires exactly the same product workflow, transport and policy as the current MCP app.     |

#### Unresolved evidence

- **Unknown:** representative teacher, editor and ecosystem outcome research for
  this API/kit chain.
- **Unknown:** which present mechanisms have regulatory, contractual or
  institutional obligations outside source.
- **Unknown:** measured causal contribution from each OCE value stream to public
  and educational outcomes.

## Lens 2: educational validity and recognisable Oak meaning

### Governing question

What makes a curriculum claim educationally warranted and recognisably Oak after
database projection, API transformation and downstream composition?

### Movement 1: reflect on raw observations

#### Literal observations

- **Observed:** the public lesson query returns lesson title, curriculum
  placements, keywords, key learning points, misconceptions and responses, pupil
  outcome, teacher tips, content guidance and supervision
  (lesson fields).
- **Observed:** those fields come from a wide materialized projection joining
  authored and derived curriculum data
  (lesson projection).
- **Observed:** oak-openapi collapses rows, reconstructs unit/programme factors
  and takes non-placement fields from one row on the assumption that they are
  consistent across variants
  (reconstruction).
- **Observed:** OCE says teacher-facing content must stay grounded, attributed
  and recognisably Oak, and must inform rather than make the pedagogical decision
  ([strategy](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/docs/strategy/stream-mcp-app.md#L29-L52),
  [teacher authority](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/docs/architecture/architectural-decisions/194-teacher-as-expert-product-boundary.md#L58-L81)).
- **Observed:** schemas establish shapes and some allowed values. No inspected
  database/API conformance test can establish that a misconception is correct, a
  sequence is educationally valid, a tip is appropriate in context or a pupil
  outcome is achieved.

#### Inherited assumptions exposed

- **Inferred:** data validity and educational validity are different claims.
  Non-null, well-typed, current content can still be educationally misleading or
  contextually inappropriate.
- **Inferred:** aggregation can preserve field values while losing the placement,
  release or editorial context needed to interpret them.
- **Inferred:** “generated from Oak data” establishes lineage only when the exact
  source revision and transformations remain reconstructible.

### Movement 2: define the problem space

**Problem frame:** an Oak kit must let a teacher or downstream product distinguish
authored curriculum claims from computed relationships, search rankings, policy
decisions, model interpretations and consumer-added presentation. It must retain
enough release, placement and provenance context for those claims to remain
educationally interpretable, while leaving pedagogical decision authority with
the teacher.

People can be harmed by false confidence: a technically valid but stale or
misplaced learning sequence can be treated as Oak's current judgement; a model
can paraphrase away caveats; a search rank can appear to be a pedagogical
recommendation; a collapsed placement can hide tier or programme context.

Success requires claim-level provenance and appropriate human validation, not
only schema and transport conformance.

### Movement 3: reflect on possible explanations

#### Competing explanations

1. **Candidate explanation:** educational validity is entirely upstream; OCE
   should faithfully transmit content and avoid adding a competing judgement.
2. **Candidate explanation:** OCE acquires new validity obligations when it
   combines, ranks, summarizes or presents content in a new context.
3. **Candidate explanation:** stable slugs and current publication state provide
   sufficient context for most teacher uses.
4. **Candidate explanation:** placement and release identity are load-bearing
   because the same lesson can participate in several educational sequences and
   variants.

#### Changed assumption

The assumption that fidelity means preserving response JSON changed.
**Inferred:** fidelity means preserving claim identity, source, release,
placement, caveat and authority through every transformation, while clearly
labelling new OCE or model-derived meaning.

### Movement 4: synthesise and propose

#### Synthesis

**Inferred:** the chain carries rich educational claims but represents their
shape more strongly than their warrant. OCE should not become curriculum
authority, yet it must make upstream authority and every downstream
transformation inspectable. Generated transport machinery cannot provide this by
itself.

| Warranted investigation or proposal                                                                                                             | Warrant                                                                                            | Explicit falsifier                                                                                                            |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Define claim provenance for authored, derived, ranked, policy-filtered and model-composed curriculum statements, tied to release and placement. | Current responses combine those classes while OCE requires grounding and recognisable Oak meaning. | Users and machines can already distinguish every claim class and reconstruct its exact authority/transformation from outputs. |
| Commission educational-validity cases for representative sequences, variants, misconceptions, prerequisites and generated graph relations.      | Structural tests cannot warrant educational correctness or appropriate interpretation.             | Current independent review evidence already covers the sampled claims, transformations, contexts and material failure modes.  |
| Make teacher-decision authority an executable product constraint for capabilities that rank, adapt or combine content.                          | OCE explicitly prohibits the system from making the teacher's pedagogical decision.                | Adversarial evaluations show no capability can produce directive or authority-confusing output under plausible use.           |

#### Unresolved evidence

- **Unknown:** editorial validation, review and contestability processes behind
  the stored curriculum fields.
- **Unknown:** whether each derived graph/search claim has been independently
  checked for educational meaning.
- **Unknown:** teacher comprehension of provenance and the boundary between Oak
  content, OCE composition and host-model text.

## Lens 3: teacher and editor work

### Governing question

Does the chain help editors create and publish sound curriculum, and help
teachers reach informed action with proportionate effort and truthful feedback?

### Movement 1: reflect on raw observations

#### Literal observations

- **Observed:** Database-Tools describes the mutation API as a business-logic
  boundary for curriculum authoring whose primary client is Create Squad
  (workspace purpose,
  authoring intent).
- **Observed:** the API provides command-shaped, multi-stage lesson and asset
  operations rather than generic CRUD. State and progress are stored partly on
  curriculum/review entities; no durable operation identity or attempt history
  was found.
- **Observed:** the endpoint standard promises that a non-2xx response means no
  mutation occurred
  (promise),
  while several handlers resolve a transaction callback with
  `{ success: false }` after possible earlier writes.
- **Inferred high-impact hypothesis:** under ordinary Drizzle transaction
  semantics, resolving the callback with `{ success: false }` would commit any
  earlier writes. A real-database fault-injection probe is required to establish
  the runtime outcome.
- **Observed:** publication, MV refresh, API cache, OCE cache, search index and
  bulk snapshot have distinct clocks. The mutation response does not establish
  when a teacher or downstream consumer can observe the change.
- **Observed:** OCE chooses to meet teachers in assistants where planning already
  happens, keeping teachers as experts rather than creating another required
  destination
  ([channel and work](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/docs/strategy/stream-mcp-app.md#L17-L43)).

#### Inherited assumptions exposed

- **Inferred:** API command success is not editor task success. The editor needs
  durable intent, review state, publication consequence, recovery and eventual
  visibility.
- **Inferred:** a teacher finding a valid lesson is not necessarily prepared to
  use or adapt it; placement, context, rights, assets and professional judgement
  complete the task.
- **Inferred:** internal implementation states make poor human progress models
  when one entity row stands in for operation, workflow and latest result.

### Movement 2: define the problem space

**Problem frame:** editors and teachers need truthful, recoverable progress
through consequential curriculum work. Editors must know what action was
accepted, committed, reviewed, published and observed, and be able to retry or
remedy without duplication. Teachers need sufficiently complete, contextual and
rights-safe information to exercise professional judgement without reconstructing
the data model.

The relevant failures are wasted or duplicated work, false success/failure,
unexplained absence, stale results, lost context and decisions that cannot be
challenged. HTTP status and database state are supporting signals, not the human
outcome.

Success means representative users can complete high-consequence jobs with
accurate expectation, efficient recovery and no need to understand storage or
projection choreography.

### Movement 3: reflect on possible explanations

#### Competing explanations

1. **Candidate explanation:** Create Squad deliberately owns the human workflow;
   the mutation API should expose narrow persistence commands only.
2. **Candidate explanation:** even a narrow command boundary must provide
   operation identity and truthful commit semantics because its client cannot
   repair ambiguity safely.
3. **Candidate explanation:** teacher work belongs entirely to products; the kit
   should offer only neutral data.
4. **Candidate explanation:** stable intent-level curriculum capabilities belong
   in the kit, while each product owns interaction, prioritisation and local
   workflow.

#### Changed assumption

The assumption that API ergonomics could be judged by endpoint shape changed.
**Inferred:** ergonomics is the gap between a person's intent and a truthful,
recoverable outcome across all asynchronous and institutional boundaries.

### Movement 4: synthesise and propose

#### Synthesis

**Inferred:** current source preserves important authoring commands and teacher
content, but neither repository-local API describes the complete work. The OCE
kit should encode domain capability, operation and evidence semantics that every
consumer needs; it should leave product-specific interaction to products.

| Warranted investigation or proposal                                                                                                                           | Warrant                                                                                                            | Explicit falsifier                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| Observe representative editor journeys from intent through retry, review, publication and public verification, including ambiguous failures.                  | Source shows command stages and clocks but cannot establish how users understand or recover from them.             | Editors complete all sampled journeys accurately with no duplicate work, hidden re-query or unsupported recovery.              |
| Model command, operation, entity revision, review and publication as separate identities before designing OCE authoring capabilities.                         | Current entity/state fields carry several of those meanings and transaction acknowledgement can be misleading.     | A single current identity/state machine formally represents all distinctions and passes duplicate, reorder and recovery cases. |
| Define teacher-facing capabilities around jobs such as orient, find, compare, contextualise and obtain resources, then test them across product compositions. | OCE exists to enable teachers and additional consumers, while endpoint-shaped tools expose provider decomposition. | Endpoint primitives alone let representative products deliver every sampled teacher job with equal clarity and correctness.    |

#### Unresolved evidence

- **Unknown:** Create Squad workflow, user research, retry behaviour and support
  burden.
- **Unknown:** time and failure between editorial commit and observable
  publication in each downstream surface.
- **Unknown:** representative teacher tasks, contexts and failure-recovery needs
  for OCE-hosted and ecosystem products.

## Lens 4: pupil capability, access and safety

### Governing question

Which pupil-related, accessibility and safeguarding obligations must survive
even when OCE's current product is teacher-facing?

### Movement 1: reflect on raw observations

#### Literal observations

- **Observed:** OCE's current MCP-app strategy makes teachers and curriculum
  leaders the primary audience and says nothing in the app is aimed at students
  ([audience boundary](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/docs/strategy/stream-mcp-app.md#L60-L75)).
- **Observed:** the same strategy treats safeguarding/content safety, DPIA,
  independent output evaluation and third-party-content filtering as public
  release blockers rather than inferred completion
  ([readiness](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/docs/strategy/stream-mcp-app.md#L78-L100)).
- **Observed:** the public lesson summary selects pupil outcomes, content guidance
  and supervision level. It filters some copyright-sensitive content and corrects
  downloadable availability outside the database
  (lesson output,
  correction).
- **Observed:** the underlying Database-Tools projection separately carries video
  fields, a null transcript placeholder and a sign-language-video association;
  those are not selected by the cited lesson-summary query
  (representation fields,
  video joins).
- **Observed:** Database-Tools' lesson OpenAPI projection contains a sign-language
  join whose predicate references the ordinary video alias instead of the
  sign-language alias. Static source cannot establish the deployed result, but
  it exposes a plausible loss of an alternate representation.
- **Observed:** OCE explicitly publishes a kit for additional consumers
  ([kit scope](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/README.md#L36-L63)).
- **Inferred:** those consumers can create pupil-facing or mixed-audience products
  even if the present MCP app does not.

#### Inherited assumptions exposed

- **Inferred:** “not learner-facing” narrows current product compliance; it does
  not erase pupil impact from curriculum data or from future kit consumers.
- **Inferred:** presence of a transcript or sign-language field does not prove
  equivalent educational access, correct correspondence or usable delivery.
- **Inferred:** safety metadata is a claim requiring competent authority,
  context, presentation and remedy; it is not merely a nullable response field.

### Movement 2: define the problem space

**Problem frame:** an enabling curriculum kit must preserve the information and
constraints required for products to create safe, dignified and meaningfully
accessible experiences, without pretending that generic infrastructure can
certify each product. It must make audience, intended use, representation
equivalence, content guidance, supervision, rights and provenance explicit
enough for downstream competent decisions.

Potential harm includes inaccessible necessary meaning, mismatched transcripts
or signed media, unsuitable activities without guidance, rights filtering that
removes essential alternatives, and teacher-facing outputs later used directly
with pupils outside their evaluated context.

Success is not universal product policy embedded in the framework. It is a
capability and evidence model that prevents products from unknowingly losing
load-bearing safety/access information and makes their own assurance obligations
visible.

### Movement 3: reflect on possible explanations

#### Competing explanations

1. **Candidate explanation:** pupil and accessibility concerns belong entirely
   to OWA or future consumer products, not a data/SDK kit.
2. **Candidate explanation:** the kit owns preservation and truthful transport
   of source safety/accessibility claims, while products own interaction and
   outcome assurance.
3. **Candidate explanation:** content metadata fields are enough for downstream
   products to make their own decisions.
4. **Candidate explanation:** alternate representations need typed equivalence,
   revision and completeness semantics to be safely composable.

#### Changed assumption

The assumption that current target audience determined the framework boundary
changed. **Inferred:** the kit intentionally enables consumers whose audiences
are not yet known; it must expose constraints and evidence without imposing one
current product's audience policy.

### Movement 4: synthesise and propose

#### Synthesis

**Inferred:** safety, audience and accessible representation are independent
obligations. OCE should preserve them as explicit claims/capabilities and provide
assurance tools, but a consuming product remains responsible for its actual
human journey and competent review.

| Warranted investigation or proposal                                                                                                                             | Warrant                                                                                                            | Explicit falsifier                                                                                                                |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| Define typed representation relationships for transcript, captions, sign language, audio/video and printable alternatives, including source revision and scope. | Current rows and joins expose media presence without proving correspondence or educational equivalence.            | Every alternate is already bound to the exact content revision, completeness scope and reviewed equivalence in a public contract. |
| Make audience and intended-use profiles explicit at product composition, with framework checks that required safety/access evidence is not discarded.           | Current MCP app is teacher-facing while the reusable kit deliberately supports unknown additional consumers.       | All supported consumers have one permanently fixed audience and no requirement changes with intended use.                         |
| Run end-to-end capability audits for content guidance, supervision and alternate media through provider, kit and representative products.                       | Field-level schema tests cannot establish that a person receives necessary meaning, warning or viable alternative. | Representative users complete the protected outcomes equivalently, and current assurance already covers every transformation.     |

#### Unresolved evidence

- **Unknown:** correspondence, completeness and review status of transcripts,
  captions and sign-language assets.
- **Unknown:** accessibility and safeguarding assurance for current API/MCP
  outputs in host products.
- **Unknown:** which future consumer audiences OCE will support and which
  obligations belong to kit conformance versus product certification.

## Lens 5: public value, equity and ecosystem reach

### Governing question

Who can realise value from the open curriculum and kit, who bears burden or
exclusion, and how are openness, rights, neutrality and stewardship reconciled?

### Movement 1: reflect on raw observations

#### Literal observations

- **Observed:** OCE describes open components, open data access and open Practice
  as public goods, and publishes reusable building blocks so other organisations
  need not start from scratch
  ([public-good intent](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/README.md#L10-L15),
  [reusable estate](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/README.md#L54-L63)).
- **Observed:** the engineering-tools strategy says code and data are open by
  default, the repository must not own/gate curriculum, and Oak must not compete
  with the ecosystem it enables
  ([commitments](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/docs/strategy/stream-engineering-tools.md#L31-L58)).
- **Observed:** the teacher strategy supports major assistant platforms
  even-handedly as a public-body obligation, not through an exclusive provider
  choice
  ([platform neutrality](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/docs/strategy/stream-mcp-app.md#L17-L27)).
- **Observed:** oak-openapi requires an API key, stores account usage/rate-limit
  data in Redis and logs user ID, URL and query arguments in Datadog
  (identity and telemetry,
  logging).
- **Observed:** the API's short-term text gate blocks when lesson/unit subject
  cannot be resolved. Asset delivery instead applies lesson, unit and subject
  precedence, while quiz policy checks a lesson block list
  (policy,
  text decisions,
  asset and quiz decisions).
- **Observed:** OCE recognises that third-party-content filtering is not yet
  proven to the bar required for public release
  ([release gate](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/docs/strategy/stream-mcp-app.md#L60-L76)).

#### Inherited assumptions exposed

- **Inferred:** open licensing is necessary but not sufficient for public value.
  Discoverability, usability, completeness, accessibility, neutrality,
  provenance and sustainable stewardship mediate who can benefit.
- **Inferred:** API keys and restrictions are not inherently opposed to openness;
  their purposes, proportionality, remedy and privacy effects must be explicit.
- **Inferred:** a toolkit can externalise hidden integration and assurance burden
  while still being nominally open source.

### Movement 2: define the problem space

**Problem frame:** Oak's public-good infrastructure must let diverse organisations
realise high-quality curriculum value without privileged repository knowledge,
exclusive vendors or silent policy exceptions. It must protect legitimate
rights, privacy, service reliability and attribution through narrow, explainable
controls, and provide contestability when access or content is wrong.

Equity failures include requiring technical sophistication to reconstruct
complete data, excluding low-connectivity/offline uses, rate policy that treats
unequal consumers identically, platform-specific capability, inaccessible
formats, and rights gates whose reasons/remedies are opaque.

Success is demonstrated public benefit and equitable capability, not merely
publication. Excellence includes the stewardship needed for others to trust,
adapt and contribute over time.

### Movement 3: reflect on possible explanations

#### Competing explanations

1. **Candidate explanation:** public API access plus open-source SDK is sufficient;
   consumer product quality is outside Oak's responsibility.
2. **Candidate explanation:** a public body enabling reuse has a duty to make
   contracts, provenance, restrictions and accessibility usable, not just
   legally available.
3. **Candidate explanation:** one uniform API-key/rate policy is neutral and
   operationally necessary.
4. **Candidate explanation:** legitimate use classes may need transparent
   capabilities and quotas without hidden discretionary access.

#### Changed assumption

The assumption that maximum reach is always public value changed.
**Inferred:** reach without rigour, provenance, rights, safety and durable
stewardship can dilute or harm public value. Conversely, narrowly justified
controls can protect the public good if they are legible and contestable.

### Movement 4: synthesise and propose

#### Synthesis

**Inferred:** the public API and OCE kit express a genuine digital-public-good
intent. Current rights, identity and completeness mechanisms make some public
obligations implicit or compensating. The better basis is capability with
explainable policy, verified open-release artefacts and low-cognition reuse, not
unconditional anonymous transport or privileged bespoke integration.

| Warranted investigation or proposal                                                                                                              | Warrant                                                                                                   | Explicit falsifier                                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Define a public-value assurance model spanning licence, attribution, completeness, accessibility, portability, privacy, availability and remedy. | Openness and reach are explicit goals, while current technical gates address these concerns separately.   | Publication and adoption alone reliably predict equitable, rights-safe public benefit across all representative consumers.          |
| Research API-key, quota and capability effects across schools, charities, small edtech, researchers, large platforms and offline consumers.      | Uniform mechanisms can impose unequal burdens or create privileged exceptions despite neutral wording.    | All groups can realise equivalent protected outcomes and understand/control their data under the current policy without exceptions. |
| Make a signed, complete, openly licensed curriculum release the primary public-good artefact, with live capabilities as complementary access.    | Endpoint crawling and current bulk receipts cannot prove one coherent corpus, limiting trustworthy reuse. | Existing live and bulk surfaces already provide equivalent release identity, integrity, completeness and usable offline access.     |

#### Unresolved evidence

- **Unknown:** who currently uses the API/SDK, for which public outcomes, and who
  cannot.
- **Unknown:** API-key issuance criteria, quota decisions, appeals and differential
  effects.
- **Unknown:** rights provenance, attribution completeness, sustainability and
  long-term preservation arrangements for open releases.

## Lens 6: developer progress and maintainable innovation

### Governing question

Can a competent consumer build correct, diagnosable Oak capabilities without
relearning provider internals or inheriting accidental architecture?

### Movement 1: reflect on raw observations

#### Literal observations

- **Observed:** OCE's tools strategy promises schema-first typed contracts so
  consumers build on guarantees rather than guesses, plus reusable search and
  graph capabilities that the ecosystem should not have to rebuild
  ([strategy](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/docs/strategy/stream-engineering-tools.md#L31-L47)).
- **Observed:** the provider chain exposes rich OpenAPI, generated TypeScript and
  Zod, SDK clients, primitive MCP tools and authored aggregate tools. This is
  substantial reusable value.
- **Observed:** oak-openapi's database client manually pins version-named MVs and
  hand-writes GraphQL result interfaces; its source and generated OpenAPI schemas
  can require parallel edits.
- **Observed:** OCE's compiler drops response headers and several parameter
  constructs/constraints, closes upstream-open response objects, and derives URL
  knowledge separately. Generated primitives are supplemented by 13 authored
  intent-level tools.
- **Observed:** OCE search reconstructs complete lesson enumeration through a
  per-unit workaround and still loses placement dimensions. Its bulk validator
  is generated from hand-authored templates rather than the included producer
  JSON Schema.
- **Observed:** static local alignment showed the current oak-openapi and OCE
  cache structurally match, but ordinary builds use the cache while Vercel can
  fetch a mutable live schema.

#### Inherited assumptions exposed

- **Inferred:** generated code reduces repetition only when the compiler is total
  over a declared language and its input is semantically competent.
- **Inferred:** type safety can move archaeology rather than remove it: a consumer
  still needs to know which endpoint is complete, which headers matter, which
  rights patch applies and which generated claim is narrowed.
- **Inferred:** authored high-level capabilities are not a failure of generation.
  They are the stable intent layer that endpoint translation cannot infer.

### Movement 2: define the problem space

**Problem frame:** an OCE consumer should express curriculum intent through
stable concepts, receive truthful types/errors/provenance, and diagnose failure
at the boundary responsible for it. Framework machinery should encode subtle,
shared invariants once and enable additional consumers deliberately. It should
not force each application to understand MVs, Hasura, provider quirks, codegen
loss, pagination workarounds or parallel policy lists.

The quality measure is correct, comprehensible progress under ordinary and
adversarial cases: a new consumer can build a complete curriculum index, retrieve
rights-safe assets, evolve with provider contracts and explain failures without
repository archaeology. Reduced innovation and maintenance burden is a
consequence of that excellence, not a reason to accept a weaker design.

### Movement 3: reflect on possible explanations

#### Competing explanations

1. **Candidate explanation:** the present breadth is inevitable because the
   curriculum domain and external protocols are complex.
2. **Candidate explanation:** domain complexity is real, while a large portion of
   current consumer effort comes from duplicated authority and missing release/
   placement/capability concepts.
3. **Candidate explanation:** OpenAPI endpoint generation should remain the main
   SDK abstraction and authored tools are convenience wrappers.
4. **Candidate explanation:** a lossless transport compiler is infrastructure;
   stable authored capabilities are the kit's primary developer product.

#### Changed assumption

The assumption that more generated surface means a better kit changed.
**Inferred:** the best surface is the smallest coherent capability vocabulary
that preserves necessary domain complexity, backed by generated transport and
conformance machinery that consumers normally do not see.

### Movement 4: synthesise and propose

#### Synthesis

**Inferred:** OCE already contains the seeds of the stronger architecture: a
public provider boundary, cached contract input, generated transport artefacts,
runtime validation, dependency injection and authored aggregate capabilities.
The next basis should clarify those roles, remove silent compiler loss and make
release/placement/policy concepts reusable once for all consumers.

| Warranted investigation or proposal                                                                                                                         | Warrant                                                                                                             | Explicit falsifier                                                                                                                  |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Define a small provider-independent capability API, then implement oak-openapi as one adapter through a lossless contract IR and generic executor.          | Endpoint-derived tools lose semantics while authored aggregate tools better match developer intent.                 | Representative additional consumers require direct access to nearly every provider operation and gain no clarity from capabilities. |
| Create executable “first correct outcome” journeys for complete release ingestion, lesson context, asset delivery, evolution and failure diagnosis.         | Package build/type tests do not show that a consumer can accomplish the intended job without hidden knowledge.      | Independent consumers complete every journey correctly using public docs/contracts alone, including adverse and change cases.       |
| Require generators to declare a supported language and fail on every unrepresented construct; keep consumer projections explicitly separate from originals. | Current MCP and Zod transformations silently narrow or omit provider meaning.                                       | Golden feature fixtures prove total preservation/rejection and no real source construct can bypass the gate.                        |
| Publish architecture and conformance as part of the kit, including provider adapters, extension points and product-policy boundaries.                       | OCE intentionally enables future consumers; tacit knowledge would otherwise be reimplemented or coupled to one app. | Diverse consumers can extend and substitute providers correctly without those explicit contracts or explanatory artefacts.          |

#### Unresolved evidence

- **Unknown:** independent developer onboarding, task completion, error
  comprehension and upgrade evidence.
- **Unknown:** which generated and authored APIs are actually used by current
  consumers.
- **Unknown:** provider-change frequency and the proportion of maintenance caused
  by true domain evolution versus representation drift and compensation.
