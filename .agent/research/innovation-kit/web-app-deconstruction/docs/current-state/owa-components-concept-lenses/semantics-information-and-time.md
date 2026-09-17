# OWA and Oak Components through semantics, information and time

## Status and method

This is a current-state concept exploration of:

- Oak Web Application (OWA), pinned to
  [`510ac63a62fb37a70183b00ce0f5fb15be4491e5`](https://github.com/oaknational/Oak-Web-Application/tree/510ac63a62fb37a70183b00ce0f5fb15be4491e5); and
- Oak Components, pinned to
  [`8ff8264fa921e4e40fdaf9a99b02fd156c699cc8`](https://github.com/oaknational/oak-components/tree/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8).

It applies OCE's canonical
[`concept-exploration`](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/.agent/skills/concept-exploration/SKILL-CANONICAL.md)
workflow at pinned OCE revision
[`bd878a3a550c8e5e5d21163a6d0962cebdaf43fa`](https://github.com/oaknational/oak-open-curriculum-ecosystem/tree/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa).
Every lens runs the four movements in order:

1. reflect on literal observations and inherited assumptions;
2. define a mechanism-neutral problem space;
3. reopen competing explanations and solution shapes; and
4. synthesise only what the evidence warrants, with falsifiable next
   investigations.

This record does **not** prescribe an OCE target architecture, recommend repairs
to OWA or Oak Components, or treat the current mechanisms as requirements. It
asks what each mechanism reveals about the underlying problem and what evidence
could overturn that interpretation.

### Evidence notation

- **Observed:** directly supported by source at the pinned revisions.
- **Inferred:** an interpretation warranted by the cited observations, but not
  itself declared as a contract.
- **Unknown:** material evidence is outside this static source pass.
- **Candidate explanation:** one plausible account, not a conclusion.
- **Falsifier:** evidence that would defeat or materially narrow a claim or
  proposed investigation.

Static source can establish accepted inputs, transformations, branches, output
shapes and authored tests. It cannot establish production cardinality, data
quality, traffic, latency, user impact, organizational ownership, operational
practice, upstream guarantees, or whether telemetry is complete and acted on.

## Perspective map

The lenses seek orthogonal questions where possible and explicitly retain
recursive deepening where it yields a distinct falsifier. They can examine the
same line of code while asking different questions.

| Lens                                       | Governing question                                                                                                    | Primary seam made visible                        |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Domain ontology and semantic boundaries    | What kinds of things does the system believe exist, and where does each meaning belong?                               | vocabulary versus ownership                      |
| Curriculum graph and referential integrity | What is the identity of a concept, placement and address, and what keeps their relationships valid?                   | entity versus placement versus route             |
| Provenance, lineage and information loss   | Can a user-visible claim be traced through its sources and transformations, including what was discarded?             | authority versus derivation                      |
| Search and information retrieval           | What makes a result relevant, findable, addressable and useful for a particular information need?                     | ranking versus usability                         |
| Content lifecycle                          | What does draft, preview, new, published, legacy, expired, deprecated or retired mean for each projection?            | state versus availability                        |
| State machines and temporal logic          | Which states and transitions are possible, and what must have happened before a temporal claim is true?               | boolean snapshot versus valid history            |
| Distributed consistency and idempotency    | When replicas or concurrent operations disagree, which outcome is authoritative and can a command be repeated safely? | request acceptance versus durable convergence    |
| Control theory and feedback                | What is sensed, what is controlled, what changes the system, and does feedback stabilise the intended outcome?        | telemetry signal versus corrective loop          |
| Data contracts and compatibility           | Which syntactic and semantic contracts cross boundaries, and how do they evolve without misinterpretation?            | shape compatibility versus meaning compatibility |
| Failure, absence and partial knowledge     | How does the system distinguish missing, invalid, duplicated, stale, unauthorized, unavailable and not-yet-known?     | negative result versus epistemic state           |

The lenses do not imply ten services, packages or bounded contexts. They are ten
ways to test whether a current explanation is doing too much work.

## Lens 1: domain ontology and DDD semantic boundaries

### Governing question

What kinds of educational, publication, application and interaction concepts do
OWA and Oak Components believe exist, which meanings are stable, and where is
each decision actually made?

### Movement 1: reflect on the raw observations

#### Literal observations

- **Observed:** the curriculum facade is organised primarily around consumer
  projections and journeys: lesson overview, teacher lesson overview, listings,
  downloads, search facets, redirects, preview pages, sitemaps and navigation
  are peers in one exported object
  ([curriculum facade](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/curriculum-api-2023/index.ts#L114-L161)).
- **Observed:** within that facade, `Phase`, `Subject` and `KS4Option` are three
  names for the same generic `{title, slug, displayOrder?}` shape, while content
  types are separately constrained to unit or lesson
  ([facade vocabulary](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/curriculum-api-2023/index.ts#L46-L85)).
- **Observed:** a teacher lesson operation joins a browse placement, lesson
  content, containing unit data and third-party copyright works from four
  materialized-view projections
  ([teacher lesson operation](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/curriculum-api-2023/queries/teachersLessonOverview/teachersLessonOverview.gql#L1-L90)).
- **Observed:** the resulting page model combines programme and unit identity,
  curriculum vocabulary, downloads, lesson content, media, policy flags,
  adjacency and presentation-oriented values
  ([teacher lesson projection](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/curriculum-api-2023/queries/teachersLessonOverview/teachersLessonOverview.query.ts#L168-L279)).
- **Observed:** Oak Components describes itself as "Shared components for Oak
  applications", and its package root exports components, styles, test helpers
  and hooks
  ([package declaration](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/package.json#L1-L12),
  [root exports](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/index.ts#L1-L4)).
- **Observed:** the same public component barrel exports generic buttons,
  forms, layout, navigation and typography alongside an `owa` family
  ([component exports](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/index.ts#L1-L14)).
  The `owa` family then exports teacher, pupil and lesson-specific components
  such as download cards, lesson information, save counts, media and subject
  controls
  ([OWA component exports](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/index.ts#L1-L42)).
- **Observed:** `OakLessonNavItem` encodes the lesson-section vocabulary
  `intro | starter-quiz | video | exit-quiz`, section-specific question data,
  progress vocabulary, labels, icons, colours and summaries
  ([lesson navigation contract](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/pupil/lesson/OakLessonNavItem/OakLessonNavItem.tsx#L16-L58),
  [semantic presentation mapping](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/pupil/lesson/OakLessonNavItem/OakLessonNavItem.tsx#L258-L373)).

#### Inherited assumptions exposed

- **Inferred:** repository, package, folder and export boundaries are not
  reliable proxies for domain boundaries. One package contains both visual
  primitives and application vocabulary; one OWA page model crosses content,
  placement, policy, navigation and presentation.
- **Inferred:** "lesson" is not one unambiguous entity. In the inspected path it
  can mean authored content, a lesson within a programme/unit placement, a
  public route, a page projection, a pupil run, or a visual interaction state.
- **Inferred:** a component named after a domain concept is not necessarily a
  domain authority. `OakLessonNavItem` owns a presentation mapping for supplied
  state; it does not establish curriculum identity or completion truth.

### Movement 2: define the problem space

**Mechanism-neutral problem frame:** an Oak application must allow multiple
consumers to speak consistently about educational concepts while keeping clear
which context owns identity, placement, publication, policy, user state and
presentation. The gap is not that concepts cross modules; it is that the same
term can carry different invariants without an explicit account of the change
in meaning.

This can harm:

- a learner or teacher when one surface interprets a concept or state
  differently from another;
- a kit consumer when a component name implies stronger domain semantics than
  its props enforce;
- an editor or curriculum publisher when application projections conceal which
  source or lifecycle state a field represents; and
- an engineer when code ownership or change impact is inferred from folders
  rather than from semantic responsibility.

**Constraints established by this pass:** there are shared vocabularies,
audience-specific projections and useful reusable interactions. The evidence
does not warrant collapsing them, nor does it establish the organizational
bounded contexts that should own them.

**Success, stated without a solution:** for any concept used across the kit and
an application, its stable meaning, context-specific projection, authority and
allowed translation can be explained and tested without requiring knowledge of
incidental repository structure.

### Movement 3: reflect on possible explanations

#### Competing explanations

1. **Candidate explanation: deliberate application projections.** Page-oriented
   adapters and domain-named components may intentionally expose exactly the
   concepts their consumers need, making cross-context aggregates a feature.
2. **Candidate explanation: historical extraction boundary.** Oak Components
   may contain OWA semantics because working UI was moved into a shared package
   before a durable kit boundary was understood.
3. **Candidate explanation: an interaction-language context.** The components
   may legitimately own the visible meaning of lesson stages and progress even
   when curriculum and progress authorities live elsewhere.
4. **Candidate explanation: vocabulary duplication is harmless structural
   typing.** Identical shapes under different names can preserve contextual
   intent without requiring runtime distinctions.

The static source does not select among these accounts. Change history,
consumer usage and ownership evidence are required.

#### Assumption changed by reflection

The first framing was "find the right bounded contexts in the current
directories." That is rejected. **Inferred:** semantic boundary, packaging
boundary and runtime boundary are independent dimensions. The investigation
must first identify invariants and translations, then discover whether current
boundaries correspond to them.

### Movement 4: synthesise and propose

#### Synthesis

**Inferred:** OWA and Oak Components contain at least four distinguishable
semantic layers: curriculum concepts, publication/placement projections,
application outcome models, and interaction-language projections. Current
types sometimes distinguish these layers and sometimes reuse strings,
booleans or generic shapes. The important seam is **meaning changing at a
projection boundary**, not "business code versus UI code".

This does not show that current composition is wrong. It shows that a future kit
cannot infer its conceptual model by copying package names or by treating every
domain-labelled component as an aggregate boundary.

#### Warranted investigations

1. **Concept-and-invariant census.** Trace `lesson`, `unit`, `programme`,
   `subject`, `progress`, `available`, `published`, `saved` and `download` from
   sources through OWA to Component props. **Warrant:** these terms already
   cross distinct projections. **Falsifier:** every occurrence resolves to one
   documented meaning and invariant with lossless translations.
2. **Semantic change-coupling study.** Use history to identify which files and
   packages change together when a concept changes. **Warrant:** real change
   coupling is stronger boundary evidence than names. **Falsifier:** changes
   remain consistently isolated along current package/folder lines.
3. **Consumer-language study.** Examine every actual Oak Components consumer
   and record which domain assumptions it must supply. **Warrant:** the package
   explicitly exists for multiple Oak applications. **Falsifier:** all
   domain-named components are consumed through one stable, documented semantic
   contract independent of OWA.

#### Unresolved evidence

- **Unknown:** organizational language, curriculum editorial ownership and the
  intended distinction between curriculum entities and application aggregates.
- **Unknown:** whether non-OWA consumers use the `owa`, `teacher` and `pupil`
  exports and whether their meanings agree.
- **Unknown:** which duplicated vocabularies have already caused defects or
  constrained valuable change.

## Lens 2: curriculum graph, identity and referential integrity

### Governing question

What constitutes the identity of curriculum content, its placement in a
programme, and its public address, and what preserves valid relationships as
any of them change?

### Movement 1: reflect on the raw observations

#### Literal observations

- **Observed:** teacher lesson browse data is selected by the conjunction of
  lesson, unit and programme slugs, while lesson content and copyright works are
  selected by lesson slug; containing unit data is again constrained by all
  three placement dimensions
  ([joined identity predicates](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/curriculum-api-2023/queries/teachersLessonOverview/teachersLessonOverview.gql#L1-L90)).
- **Observed:** adjacency is not taken from a generic lesson relation. OWA sorts
  the containing unit's static lesson list, locates the current slug, and scans
  in both directions for records whose `_state` is `published`
  ([adjacency derivation](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/curriculum-api-2023/queries/teachersLessonOverview/teachersLessonOverview.query.ts#L33-L78)).
- **Observed:** a programme slug is a compound public identifier parsed into
  subject, phase, key stage or year, tier, pathway and exam board tokens. The
  parser documents that known tokens in the wrong position can invalidate a
  multi-part subject, while stating that current data appears not to exhibit
  the problem
  ([programme-slug grammar](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/utils/curriculum/slugs.ts#L16-L115)).
- **Observed:** incomplete KS4 selections can be completed through a hard-coded
  exam-board preference, or the first available option when no preference
  matches
  ([KS4 preference and fallback](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/utils/curriculum/slugs.ts#L183-L251)).
- **Observed:** redirect resolution distinguishes teacher from pupil, lesson
  from unit, and canonical from browse addresses; it delegates destination and
  redirect type to curriculum redirect projections
  ([redirect dispatcher](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages-helpers/shared/lesson-pages/getRedirects.ts#L20-L89)).
- **Observed:** the inspected `OakPupilJourneyListItem` contract receives
  already-resolved navigation identity: a title, index, optional lesson count
  and polymorphic element props such as `href`. It disables navigation by
  rendering a `div` and removing `href` and `onClick`
  ([journey item contract](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/pupil/browse/OakPupilJourneyListItem/OakPupilJourneyListItem.tsx#L12-L25),
  [navigation projection](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/pupil/browse/OakPupilJourneyListItem/OakPupilJourneyListItem.tsx#L105-L196)).

#### Inherited assumptions exposed

- **Inferred:** the curriculum experienced by users is a graph, even when a
  screen renders a tree. A lesson concept can have content identity, one or more
  placements, neighbours relative to a placement, and canonical and contextual
  public addresses.
- **Inferred:** slugs are not merely opaque database keys. Programme slugs
  encode a controlled vocabulary and a default-resolution policy, while route
  slugs participate in long-lived compatibility.
- **Inferred:** Components receive the result of identity resolution, not enough
  information to establish referential integrity themselves. That separation
  can be appropriate; it also means visual continuity cannot prove graph
  validity.

### Movement 2: define the problem space

**Mechanism-neutral problem frame:** educational concepts must remain
referentially coherent when reused, moved, versioned, published, withdrawn or
addressed through historical and contextual URLs. The system needs to
distinguish the identity of a concept from the identity of a placement and the
identity of an address, while preserving the relationships required by
navigation, search, downloads, analytics and external links.

The harm is a wrong concept at a valid-looking URL, a broken or misleading
neighbour relation, search results that cannot resolve, analytics split across
aliases, or a kit consumer that mistakes a display slug for durable identity.

**Success:** a concept, placement and address can change independently where the
domain permits it, and every reference either resolves to the intended current
meaning or has an explicit negative/redirect outcome.

### Movement 3: reflect on possible explanations

#### Competing explanations

1. **Candidate explanation: content-plus-placement graph.** Lesson slug is
   content identity and the programme/unit conjunction is placement identity.
2. **Candidate explanation: slug-addressed materialized views.** The apparent
   graph may be a read-model convenience; stable upstream IDs and constraints
   may preserve integrity outside OWA.
3. **Candidate explanation: routes are the durable identity protocol.** User
   and ecosystem continuity may depend more on redirectable addresses than on
   internal IDs.
4. **Candidate explanation: current slugs are intentionally semantic.** Encoding
   selection factors may make addresses comprehensible and reconstructible,
   despite coupling identity to vocabulary.

#### Assumption changed by reflection

"Curriculum hierarchy" is too narrow. **Inferred:** hierarchy, reuse,
versioning, contextual navigation and address compatibility are overlapping
graphs with different edge semantics. A tree-shaped component is one projection
of those graphs, not the graph model itself.

### Movement 4: synthesise and propose

#### Synthesis

**Inferred:** OWA performs application-level referential work: conjunctive
placement lookup, adjacency filtering, compound-slug parsing, option completion,
route reconstruction and redirect selection. Some underlying integrity may be
guaranteed upstream, but the source shows that user-visible identity cannot be
explained by one slug or one entity table alone. The most consequential seam is
**concept identity -> placement identity -> public address -> interaction
target**.

#### Warranted investigations

1. **Identity and edge census.** Extract every ID, UID and slug for lessons,
   units, programmes, assets, questions, attempts and notes, then classify each
   as concept, version, placement, address or operation identity. **Warrant:**
   current code uses different key conjunctions for related projections.
   **Falsifier:** one canonical immutable identifier is present and preserved at
   every boundary, with slugs used only as locators.
2. **Referential-integrity graph check.** Against a pinned curriculum snapshot,
   test uniqueness, orphaning, multi-placement, adjacency and route resolution
   invariants. **Warrant:** OWA detects some multiplicity and reconstructs some
   relations locally. **Falsifier:** published upstream constraints and a clean
   snapshot prove all relevant invariants before OWA reads the data.
3. **Address-continuity graph.** Follow canonical, browse, pupil, teacher,
   legacy and redirect addresses through multiple publication cohorts and look
   for chains, loops, splits and convergence. **Warrant:** redirect semantics
   are audience- and context-dependent. **Falsifier:** a deployed manifest
   proves every historical address maps directly and uniquely to one intended
   current concept.

#### Unresolved evidence

- **Unknown:** upstream primary keys, uniqueness constraints and guarantees of
  slug stability.
- **Unknown:** intentional cardinalities: whether a lesson may belong to many
  units/programmes and whether the same slug denotes the same authored concept
  across cohorts.
- **Unknown:** external links, bookmarks and integrations that make particular
  address forms compatibility obligations.

## Lens 3: information provenance, lineage and loss

### Governing question

For every user-visible claim, can we identify its authorities,
transformations, defaults and discarded distinctions, and can we tell when the
projection no longer supports that claim?

### Movement 1: reflect on the raw observations

#### Literal observations

- **Observed:** search responses are parsed as a raw transport shape, enriched
  with locally selected title, slug and highlight fields, converted to snake
  case with selected keys excluded, and parsed again as an application result
  shape
  ([search transformation boundary](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/context/Search/search-api/2023/fetchResults.ts#L14-L74)).
- **Observed:** the teacher lesson adapter camel-cases separately fetched browse,
  content and unit records, then creates one page model. Along the way it
  supplies defaults such as empty strings, `false`, `1` and `null`, derives
  boolean availability, and does not carry a source marker per field
  ([page transformation](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/curriculum-api-2023/queries/teachersLessonOverview/teachersLessonOverview.query.ts#L139-L279)).
- **Observed:** malformed optional media is reported and projected as `null`,
  while missing core records become not-found errors and duplicate lesson
  content emits a warning before the first record is used
  ([media degradation](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/curriculum-api-2023/queries/teachersLessonOverview/teachersLessonOverview.query.ts#L178-L196),
  [absence and multiplicity](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/curriculum-api-2023/queries/teachersLessonOverview/teachersLessonOverview.query.ts#L282-L378)).
- **Observed:** the CMS client resolves embedded Sanity and HubSpot references
  before parsing the consumer schema
  ([reference-resolution pipeline](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/cms/sanity-client/cmsMethods.ts#L130-L145)).
- **Observed:** in preview list parsing, invalid items are silently removed and
  draft IDs are normalised to collide with published IDs so the draft wins; in
  non-preview mode the supplied schema parses the complete result directly
  ([preview filtering and draft selection](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/cms/sanity-client/parseResults.ts#L84-L144)).
- **Observed:** a pupil journey item receives resolved strings and booleans,
  then converts `unavailable` into label, styling and navigation removal
  ([journey projection](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/pupil/browse/OakPupilJourneyListItem/OakPupilJourneyListItem.tsx#L111-L192)).
- **Observed:** the teacher-notes Component receives the booleans `error`,
  `progressSaved` and `noteShared`; it renders exactly one message according to
  error-first precedence, without receiving operation IDs, timestamps or source
  metadata
  ([teacher-note feedback contract](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/teacher/OakTeacherNotesModal/OakTeacherNotesModal.tsx#L82-L130)).

#### Inherited assumptions exposed

- **Inferred:** runtime validation proves conformance to the projection's shape,
  not fidelity to every upstream distinction.
- **Inferred:** omission and defaulting are information transforms. An empty
  string, `false`, `null`, missing property and rejected record may have distinct
  origins even if later UI treats them alike.
- **Inferred:** Components are normally downstream of provenance collapse. That
  can be a sound separation, but it makes the application boundary responsible
  for ensuring the simplified prop still warrants the visible claim.

### Movement 2: define the problem space

**Mechanism-neutral problem frame:** an Oak application must project information
for a particular use without either leaking irrelevant source complexity or
losing distinctions required for truth, policy, diagnosis and future reuse. A
claim's lineage includes the authority, source version, joins, validation,
normalisation, defaults, conflict policy, cache state and final presentation.

The harm is not merely "lost metadata". It is inability to answer why a claim is
shown, which source should correct it, whether absence is genuine, whether two
screens disagree for a legitimate reason, and whether a simplified kit contract
can support another consumer's claim.

**Success:** every consequential claim is explainable back to its entitled
authority and transformation policy; intentional loss is explicit and does not
erase distinctions needed by the receiving outcome.

### Movement 3: reflect on possible explanations

#### Competing explanations

1. **Candidate explanation: necessary anti-corruption projections.** Loss is
   deliberate: consumers should not know transport details or upstream
   irregularities.
2. **Candidate explanation: provenance exists in operational telemetry.** Page
   models may remain simple because errors and source versions are observable
   elsewhere.
3. **Candidate explanation: defaults encode stable product policy.** Empty or
   false projections may be the correct user-facing interpretation of partial
   upstream data.
4. **Candidate explanation: silent information debt.** Repeated joins, defaults
   and first-record selection may have accumulated without a complete lineage
   contract.

#### Assumption changed by reflection

"Preserve all source fields" is not the goal. **Inferred:** good provenance and
lossless transport are different. A small, purpose-built projection can be
excellent if its warrant and loss policy are retained at the boundary.

### Movement 4: synthesise and propose

#### Synthesis

**Inferred:** OWA contains meaningful lineage logic, but mostly as executable
adapter code rather than an inspectable claim graph. Source identity becomes
harder to see as data approaches Components. The critical seam is **source
claim -> validated observation -> reconciled application claim -> compressed
interaction prop -> visible assertion**. Each arrow may legitimately lose
information, but each loss changes what can later be known.

#### Warranted investigations

1. **Field-lineage slices.** Trace a small set of high-consequence fields such
   as availability, restriction, publication, lesson title, adjacency and saved
   state from authority to rendered assertion, recording all defaults and
   conflict rules. **Warrant:** the inspected page model derives these from
   several sources. **Falsifier:** existing generated lineage metadata already
   provides field-level traceability through every projection.
2. **Loss and collision corpus.** Feed adapters combinations of absent, null,
   invalid, duplicate and disagreeing values, then record which distinct inputs
   produce the same output. **Warrant:** current code intentionally collapses
   several states. **Falsifier:** schemas and tests demonstrate that collapsed
   states are provably equivalent for every receiving outcome.
3. **Rendered-claim audit.** Select visible messages such as "Unavailable",
   "Completed", "Progress saved" and download availability, and identify the
   exact acknowledged fact behind each. **Warrant:** Components render strong
   assertions from small props. **Falsifier:** every assertion already links to
   a documented authority and acknowledgement stage.

#### Unresolved evidence

- **Unknown:** upstream publication/version metadata available but omitted from
  current operations.
- **Unknown:** whether error telemetry contains enough identifiers and source
  versions to reconstruct a failed projection.
- **Unknown:** which defaults are deliberate product decisions and which are
  tolerance for historical source shapes.

## Lens 4: search and information-retrieval relevance

### Governing question

What makes curriculum information findable and useful for a teacher's actual
need, and where are relevance, interpretation, filtering, addressability and
presentation decided?

### Movement 1: reflect on the raw observations

#### Literal observations

- **Observed:** OWA sends the browser's structured query to an external Search
  API and accepts `_score` on each raw hit, but the inspected client does not
  calculate the ranking. It validates the response and locally derives a common
  title, slug and highlight projection
  ([raw hit contract](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/context/Search/search.schema.ts#L99-L147),
  [search client](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/context/Search/search-api/2023/fetchResults.ts#L14-L74)).
- **Observed:** result usability depends on local reconstruction. OWA maps an
  external key-stage slug to locally supplied facets, reconstructs missing
  programme slugs, falls back from unit to topic fields, creates route props and
  omits lesson hits lacking required route or subject slugs
  ([lesson-result projection](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/search/helpers/index.ts#L236-L374)).
  Unit hits have a parallel omission rule
  ([unit-result projection](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/search/helpers/index.ts#L376-L428)).
- **Observed:** local intent matching recognises subject, key stage, year and
  exam board from a local curriculum vocabulary. If unmatched words make a
  subject result ambiguous, the subject direct match is cleared while other
  parsed factors may remain
  ([direct-match interpretation](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/context/Search/suggestions/findPfMatch.ts#L20-L69)).
- **Observed:** when there is no direct subject and AI intent is enabled, a
  rate-limited model call returns subjects constrained to a local allow-list and
  ordered by model confidence. A successful AI-derived response receives a
  30-day public CDN cache header; a direct subject match bypasses that branch
  ([intent endpoint](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/api/search/intent/index.ts#L22-L101),
  [model-output constraint](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/context/Search/ai/callModel.ts#L11-L44)).
- **Observed:** direct and AI suggestions are merged, deduplicated and sorted in
  a fixed type order: subject, key stage, year, exam board
  ([suggestion projection](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/search/helpers/index.ts#L463-L529)).
- **Observed:** `OakSearchFilterCheckBox` supplies the interaction semantics of
  a filter control, but its contract is a generic checkbox value plus display
  string and optional icon; its documentation says it is intended to become a
  generic checkbox-as-button
  ([filter-control contract](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/form-elements/OakSearchFilterCheckBox/OakSearchFilterCheckBox.tsx#L76-L112)).

#### Inherited assumptions exposed

- **Inferred:** search is not one ranking algorithm. It is a chain joining query
  interpretation, controlled vocabulary, index/corpus, ranking, facets,
  highlights, result-to-route reconstruction, omission, interaction and
  measurement.
- **Inferred:** a highly ranked hit that cannot be mapped to a valid route is not
  a usable result. Addressability is part of effective relevance.
- **Inferred:** search-intent confidence and search-result score are different
  quantities. The former chooses suggestions; the latter is produced by the
  external search system. Neither is evidence of task success by itself.

### Movement 2: define the problem space

**Mechanism-neutral problem frame:** given an information need expressed in a
teacher's language, the system must surface curriculum items that help complete
the intended task, while exposing enough structure to refine, compare and
navigate. Relevance is conditional on audience, task, curriculum availability,
policy, result identity and presentation, not merely text similarity.

Harm includes no result for existing content, plausible but pedagogically wrong
results, relevant results omitted because identity projections drifted,
suggestions that narrow away the need, and metrics that reward clicks while the
teacher fails to complete the task.

**Success:** relevance can be evaluated against representative information
needs and downstream task outcomes, and every stage's contribution or loss can
be observed separately.

### Movement 3: reflect on possible explanations

#### Competing explanations

1. **Candidate explanation: ranking is the dominant determinant.** Most quality
   may reside in the external index and query implementation, with OWA providing
   harmless presentation plumbing.
2. **Candidate explanation: vocabulary and identity drift dominate.** Poor
   outcomes may arise after ranking, when facets, local aliases, cohorts or
   route reconstruction disagree with the index.
3. **Candidate explanation: suggestions solve disambiguation.** Intent
   interpretation may improve tasks even without changing rank.
4. **Candidate explanation: suggestions introduce anchoring.** Fixed ordering,
   long caching and confident labels may steer users toward the system's
   ontology rather than their need.

#### Assumption changed by reflection

"Evaluate search quality" cannot mean inspect result scores or search code in
isolation. **Inferred:** the unit of evaluation is an information need carried
through interpretation, retrieval, usable projection and task outcome.

### Movement 4: synthesise and propose

#### Synthesis

**Inferred:** OWA's search surface federates at least four independently
changing semantic assets: indexed documents/ranking, curriculum facets, local
intent vocabulary, and public route identity. Oak Components supplies reusable
interaction but not relevance policy. The key seam is **information need ->
interpreted constraints -> ranked candidate -> addressable result -> useful
outcome**.

#### Warranted investigations

1. **Task-based relevance judgement set.** Build a versioned set of real teacher
   information needs, including ambiguous and curriculum-specific phrasing, and
   judge retrieval, projection and task completion separately. **Warrant:** no
   inspected source establishes end-to-end relevance. **Falsifier:** an existing
   representative judgement programme already measures these stages and guides
   changes.
2. **Result-loss accounting.** For a pinned query corpus, record candidates
   returned, validation failures, omitted hits, reconstructed identities and
   final rendered positions. **Warrant:** OWA can omit hits after retrieval.
   **Falsifier:** production evidence shows post-retrieval loss is zero or
   intentionally excluded by a complete upstream contract.
3. **Suggestion counterfactual.** Compare tasks with no suggestion, direct
   vocabulary match and model-derived suggestions, stratified by ambiguity and
   cache age. **Warrant:** two different interpretation mechanisms feed one UI.
   **Falsifier:** suggestions are not exposed to meaningful traffic or have no
   measurable effect on chosen filters and outcomes.
4. **Index-to-publication lag trace.** Follow newly published, changed and
   retired concepts through curriculum facets, local vocabulary, index and
   route resolution. **Warrant:** these assets are independently refreshed.
   **Falsifier:** one atomic publication version governs all four projections.

#### Unresolved evidence

- **Unknown:** index mappings, ranking features, analyzers, synonyms and corpus
  construction.
- **Unknown:** query distribution, zero-result rate, abandonment, successful
  resource use and relevance judgements.
- **Unknown:** the publication and invalidation relationship between the search
  index, curriculum views, local intent vocabulary and CDN cache.

## Lens 5: content lifecycle, publication and retirement

### Governing question

What does each lifecycle state mean, which transitions are allowed, and how do
content, addresses, projections and kit APIs remain honest while states change?

### Movement 1: reflect on the raw observations

#### Literal observations

- **Observed:** the teacher lesson query reads materialized views whose names
  include explicit versions and filters browse/unit projections with
  `is_legacy: false`; lesson content also carries release date, deprecated
  fields and restriction flags
  ([versioned published projections](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/curriculum-api-2023/queries/teachersLessonOverview/teachersLessonOverview.gql#L1-L90)).
- **Observed:** adjacency includes only entries whose `_state` equals
  `published`, while the current lesson page projection separately exposes
  `expired`, cohort and release date
  ([published-neighbour policy](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/curriculum-api-2023/queries/teachersLessonOverview/teachersLessonOverview.query.ts#L33-L78),
  [page lifecycle fields](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/curriculum-api-2023/queries/teachersLessonOverview/teachersLessonOverview.query.ts#L226-L275)).
- **Observed:** the facade exposes separate normal and teacher/pupil preview
  operations alongside redirect and published-page operations
  ([preview and publication projections](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/curriculum-api-2023/index.ts#L114-L160)).
- **Observed:** CMS preview mode fetches both draft and non-draft records, then
  prefers a matching draft; non-preview queries explicitly request
  `is_draft: false`
  ([CMS lifecycle selection](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/cms/sanity-client/cmsMethods.ts#L147-L158),
  [draft conflict rule](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/cms/sanity-client/parseResults.ts#L84-L120)).
- **Observed:** teacher subject listing explicitly combines new and legacy
  programmes. It can use a new programme's route and policy while summing unit
  and lesson counts across new and legacy records
  ([cohort combination](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages-helpers/teacher/subject-listing-page/getCombinedSubjects.tsx#L12-L151)).
- **Observed:** Oak Components retains deprecated components in public barrels.
  `OakHoverLink` is marked deprecated in favour of `OakLink`, yet the navigation
  barrel continues to export both
  ([deprecated link](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/navigation/OakHoverLink/OakHoverLink.tsx#L38-L68),
  [navigation exports](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/navigation/index.ts#L1-L10)).

#### Inherited assumptions exposed

- **Inferred:** "published" does not answer every availability question.
  Content may be published, previewable, legacy, expired, future-released,
  restricted, redirected or excluded from a particular derived use.
- **Inferred:** lifecycle is projection-specific. A draft may supersede a
  published CMS item in preview; a new curriculum route may represent counts
  from both new and legacy cohorts; a deprecated component may remain a valid
  public API.
- **Inferred:** migration and retirement are user-facing information problems,
  not only data cleanup. Counts, neighbours, routes and components can each
  carry different compatibility windows.

### Movement 2: define the problem space

**Mechanism-neutral problem frame:** content and public capabilities change over
time. Each audience must receive a projection appropriate to its authorization
and purpose, while historical references remain intelligible and retired
material does not masquerade as current. Lifecycle semantics must be explicit
per concept and projection, including transition authority and compatibility
obligations.

Harm includes premature exposure, disappearance of relied-upon material,
misleading combined counts, navigation into unpublished neighbours, stale
search entries, and kit consumers depending indefinitely on an API that is only
informally deprecated.

**Success:** for every state transition, affected projections and consumers can
determine what becomes visible, addressable, mutable and supported, and for how
long, without treating one status word as universal.

### Movement 3: reflect on possible explanations

#### Competing explanations

1. **Candidate explanation: deliberate staged publication.** Multiple states
   and preview paths express necessary editorial review and cohort transition.
2. **Candidate explanation: overlapping migrations.** Some state vocabulary may
   be temporary compatibility machinery rather than enduring domain meaning.
3. **Candidate explanation: independent lifecycle dimensions.** `legacy`,
   `expired`, `published`, `releaseDate` and `deprecated` may correctly answer
   different questions and should not be collapsed.
4. **Candidate explanation: lifecycle leaks.** Consumers may be inferring policy
   from raw source flags because no authoritative publication decision is
   projected for their outcome.

#### Assumption changed by reflection

A single content state machine would be premature. **Inferred:** authored
content, curriculum placement, public address, downloadable asset, search
document and component API each have a lifecycle. The investigation should map
their correspondence before deciding whether any share states.

### Movement 4: synthesise and propose

#### Synthesis

**Inferred:** current code implements several lifecycle correspondences and
compatibility policies, notably preview draft precedence, published-only
adjacency, new/legacy cohort composition, redirect resolution and deprecated
component retention. The seam is **authority state -> audience projection ->
address availability -> interaction availability -> support obligation**. A
state at one stage cannot be assumed to determine all later stages.

#### Warranted investigations

1. **Lifecycle vocabulary and transition atlas.** For every entity/projection,
   enumerate observed states, transition initiators, guards and downstream
   effects. **Warrant:** the same source path exposes several non-equivalent
   lifecycle markers. **Falsifier:** a canonical publication contract already
   defines them and every consumer derives its state without local policy.
2. **One-content retirement trace.** Follow representative content from draft
   through publication, cohort transition, expiry/withdrawal, redirects, search,
   downloads and analytics. **Warrant:** these projections are independently
   implemented. **Falsifier:** atomic versioning and deployment evidence proves
   they change together.
3. **Component compatibility history.** Measure time from deprecation to export
   removal, actual consumers, migration evidence and semantic-version signals.
   **Warrant:** deprecated symbols remain public. **Falsifier:** published
   compatibility policy and consumer data show the current retention is
   intentional and bounded.

#### Unresolved evidence

- **Unknown:** editorial workflows and authoritative meanings of `_state`,
  `legacy`, `expired`, cohort and release date.
- **Unknown:** support commitments for historical curriculum URLs and component
  package versions.
- **Unknown:** whether search, caches and downloadable assets observe retirement
  atomically or eventually.

## Lens 6: state machines and temporal logic

### Governing question

Which states are reachable, which transitions are valid, and what history must
have occurred before OWA or a Component can truthfully say "started",
"complete", "saved", "shared", "loading" or "unavailable"?

### Movement 1: reflect on the raw observations

#### Literal observations

- **Observed:** pupil lesson progress is represented as an object containing
  optional per-section results plus independent top-level booleans for started,
  complete, read-only, hydrating and content-guidance dismissal
  ([lesson progress state](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/context/PupilLessonProgress/pupilLessonProgressTypes.ts#L3-L74)).
- **Observed:** initialisation resets state when lesson slug changes but
  preserves section results for the same slug; completion and in-progress
  actions both set `lessonStarted` and recompute whole-lesson completion
  ([progress transitions](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/context/PupilLessonProgress/pupilLessonProgressStateActions.ts#L17-L107)).
- **Observed:** whole-lesson completion means every configured review section
  has `isComplete`; a later in-progress update retains completion for video but
  clears it for other section types
  ([completion rules](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/context/PupilLessonProgress/pupilLessonProgressHelpers.ts#L28-L109)).
- **Observed:** quiz state is another object of identity, section, current index,
  question states and counts. `handleNextQuestion` caps the index at
  `numQuestions`, rather than expressing terminal state as a separate variant
  ([quiz state contract](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/context/PupilLessonQuiz/pupilLessonQuizTypes.ts#L8-L41),
  [next transition](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/context/PupilLessonQuiz/pupilLessonQuizStateActions.ts#L73-L84)).
- **Observed:** `OakLessonNavItem` uses a discriminated union for section-specific
  input and a three-value progress state. It separately accepts `disabled` and
  `isLoading`, then projects either to a non-link disabled rendering; only
  loading adds a spinner
  ([navigation state contract](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/pupil/lesson/OakLessonNavItem/OakLessonNavItem.tsx#L16-L58),
  [state projection](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/pupil/lesson/OakLessonNavItem/OakLessonNavItem.tsx#L136-L223)).
- **Observed:** teacher-note feedback is supplied as three booleans. The
  Component chooses `error`, then `progressSaved`, then `noteShared`, so multiple
  true values are representable but one message wins
  ([feedback precedence](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/teacher/OakTeacherNotesModal/OakTeacherNotesModal.tsx#L82-L130)).

#### Inherited assumptions exposed

- **Inferred:** a type containing state-related fields is not necessarily a
  state machine. Independent booleans and partial maps can represent
  combinations that actions may never intentionally create.
- **Inferred:** visible progress is a projection of event history and configured
  section membership, not an intrinsic property of a lesson.
- **Inferred:** `loading`, `disabled`, `unavailable` and `read-only` all restrict
  action, but assert different causes and temporal expectations. Similar visual
  treatment does not make them equivalent states.

### Movement 2: define the problem space

**Mechanism-neutral problem frame:** interactive outcomes unfold through time.
The system must admit valid partial progress, retries, revisits, hydration,
read-only transitions and failures while preventing or correctly interpreting
impossible combinations. User-visible temporal claims must correspond to a
defined event or acknowledged state, not merely a convenient boolean.

Harm includes skipped or repeated transitions, completion lost or asserted too
early, actions enabled during an incompatible state, stale progress overwriting
newer progress, and feedback that names the wrong operation stage.

**Success:** permitted states and transitions can be enumerated, temporal
properties can be tested over sequences, and every visible claim has a precise
predicate over authoritative or intentionally local history.

### Movement 3: reflect on possible explanations

#### Competing explanations

1. **Candidate explanation: boolean state is a sufficient projection.** Actions
   and call sites may enforce all real invariants even if the structural type is
   permissive.
2. **Candidate explanation: independent dimensions are intentional.** Hydration,
   read-only status, lesson completion and guidance dismissal may genuinely
   compose rather than form one exclusive union.
3. **Candidate explanation: invalid states are reachable.** Async hydration,
   identity changes and independent setters may produce combinations not
   covered by happy-path action tests.
4. **Candidate explanation: Components correctly remain presentational.** They
   may need to accept projections rather than own workflow transition rules;
   the risk belongs at their caller boundary.

#### Assumption changed by reflection

The goal is not to replace every boolean with an enum. **Inferred:** state
machine analysis is needed where history, exclusivity, causality or
acknowledgement matters. Independent facts should remain independently
composable when that is their true semantics.

### Movement 4: synthesise and propose

#### Synthesis

**Inferred:** OWA contains real transition policy in actions and helpers, while
Oak Components contains typed visible projections of those transitions. Some
validity is encoded with discriminated unions; other validity relies on caller
discipline and precedence. The key seam is **event history -> application state
-> derived temporal predicate -> interaction state -> user claim**.

#### Warranted investigations

1. **Reachability model.** Generate state sequences for lesson progress, quiz,
   save/unsave and teacher-note workflows, recording invariants and terminal
   conditions. **Warrant:** current state combines partial records and booleans.
   **Falsifier:** exhaustive property tests already prove every structurally
   representable problematic combination unreachable.
2. **Temporal property tests.** Test claims such as "complete remains true only
   under the documented update rules", "a new lesson cannot retain old
   progress", and "success cannot precede durable acknowledgement". **Warrant:**
   current helpers encode time-sensitive rules. **Falsifier:** the relevant
   outcomes are stateless or all claims are explicitly local-only.
3. **Interaction-state correspondence audit.** For each Component prop such as
   `progress`, `isLoading`, `disabled`, `unavailable`, `progressSaved` and
   `noteShared`, identify the caller predicate and transition that sets it.
   **Warrant:** Components compress application state into visible assertions.
   **Falsifier:** all props have one documented, tested predicate shared by all
   consumers.

#### Unresolved evidence

- **Unknown:** real navigation, refresh, multi-tab and hydration sequences.
- **Unknown:** whether completed lesson sections are intentionally reversible
  and why video differs from quiz and intro updates.
- **Unknown:** user expectations for what each success/loading/disabled message
  guarantees over time.

## Lens 7: distributed consistency, concurrency and idempotency

### Governing question

When local state, network requests and remote authorities disagree or overlap,
which result wins, when has the outcome converged, and can the same operation be
repeated without unintended effects?

### Movement 1: reflect on the raw observations

#### Literal observations

- **Observed:** save-unit interaction immediately changes a local unit list,
  toast and global count, then posts to the Educator BFF. A non-OK response calls
  a rollback callback; after the awaited call, the code clears saving state and
  emits `contentSaved` regardless of the returned success boolean
  ([optimistic save transition](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/educator-api/helpers/saveUnits/useSaveUnits.tsx#L78-L111),
  [HTTP acknowledgement helper](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/educator-api/helpers/postEducatorData.ts#L1-L10)).
- **Observed:** the BFF reads an Educator user, creates it if absent, then creates
  list content and returns success after those awaited calls
  ([save-unit BFF](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/api/educator/saveUnit/%5BprogrammeSlug%5D/%5BunitSlug%5D.ts#L17-L67)).
- **Observed:** pupil attempt submission checks for an existing `attempt_id` and
  then separately adds a Firestore document. The stored document receives a
  generated Firestore document ID rather than using `attempt_id` as its document
  key
  ([attempt endpoint](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/api/pupil/lesson-attempt/route.ts#L33-L69),
  [attempt write](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/pupil-api/lesson-attempt/logLessonAttempt.ts#L4-L16)).
- **Observed:** attempt reads query all documents by `attempt_id`, retain the
  first valid attempt per ID in an object, separately report malformed records,
  and return `empty` from the unfiltered snapshot
  ([attempt reconciliation](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/pupil-api/lesson-attempt/getLessonAttempt.ts#L10-L43)).
- **Observed:** the browser pupil client suppresses a consecutive remote attempt
  with the same local hash, but creates a new `nanoid` otherwise. It stores the
  hash and ID before the network promise resolves and clears them if the promise
  rejects
  ([browser deduplication](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/browser-lib/pupil-client/client.ts#L110-L155)).
- **Observed:** teacher notes use a deterministic Firestore document key formed
  from `sid_key` and `note_id`, then call `set` with no version/precondition in
  the inspected wrapper
  ([teacher-note upsert](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/pupil-api/teacher-notes/upsertTeacherNote.ts#L1-L10)).
- **Observed:** the teacher-note Component receives acknowledgement booleans and
  callbacks, not operation identity or concurrency/version information
  ([teacher-note interaction contract](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/teacher/OakTeacherNotesModal/OakTeacherNotesModal.tsx#L82-L105)).

#### Inherited assumptions exposed

- **Inferred:** one "save" spans several states: local projection, request
  completion, remote authority update, later read-back and telemetry. A toast,
  HTTP result and analytics event can therefore refer to different stages.
- **Inferred:** client deduplication, server duplicate detection and storage
  uniqueness are different idempotency mechanisms with different race windows.
- **Inferred:** deterministic document keys make repeated teacher-note writes
  converge on one record, but do not by themselves define concurrent-writer or
  lost-update semantics.

### Movement 2: define the problem space

**Mechanism-neutral problem frame:** distributed user outcomes must remain
correct under retries, duplicated delivery, concurrent tabs, overlapping
commands, partial failure and delayed replicas. Every operation requires a
defined identity, authority, acknowledgement stage, conflict policy and
reconciliation behavior proportionate to its consequence.

Harm includes duplicate attempts, lost notes, saved-state flicker, counts that
drift from membership, success telemetry for failed outcomes, and a retry that
changes a result twice.

**Success:** repeated and concurrent operations have explainable outcomes; the
user claim names the achieved stage; and divergence between local projection and
authority is either reconciled or exposed rather than silently preserved.

### Movement 3: reflect on possible explanations

#### Competing explanations

1. **Candidate explanation: races are bounded by usage.** Single-user browser
   workflows and high-entropy IDs may make conflicting writes sufficiently
   rare.
2. **Candidate explanation: downstream services enforce idempotency.** Educator
   API or Firestore rules not visible here may provide uniqueness and conflict
   guarantees.
3. **Candidate explanation: at-least-once is acceptable.** Lesson attempts may
   be immutable observations for which duplicate records can be reconciled by
   attempt ID.
4. **Candidate explanation: feedback/telemetry semantics are local intent.** A
   `contentSaved` event might deliberately mean the user attempted save rather
   than the authority committed it, despite its name.

#### Assumption changed by reflection

"Make writes idempotent" is too generic. **Inferred:** command identity,
storage uniqueness, effect idempotency, response replay, optimistic projection
and analytic semantics are separate concerns. Each workflow needs only the
guarantees its outcome requires, but those guarantees must be named.

### Movement 4: synthesise and propose

#### Synthesis

**Inferred:** OWA implements several local consistency strategies: optimistic
projection and rollback, lazy user creation, client hash suppression, server
duplicate checks, first-valid-record reconciliation and deterministic upserts.
They do not form one uniform consistency model. Components display caller-
supplied projections after those choices. The seam is **intent -> operation
identity -> local projection -> authority commit -> read reconciliation ->
observed outcome**.

#### Warranted investigations

1. **Operation semantics matrix.** For save/unsave, lesson attempt, note,
   onboarding and Classroom operations, record idempotency key, atomicity,
   ordering, retry, conflict, acknowledgement and read-after-write guarantees.
   **Warrant:** inspected mechanisms differ substantially. **Falsifier:**
   service contracts already define and verify all these guarantees end to end.
2. **Concurrency and retry experiments.** Execute same-ID simultaneous attempt
   writes, save/unsave reordering, multi-tab note edits and response-loss retries
   in an isolated environment. **Warrant:** static check-then-write and
   last-write behavior leave outcomes unresolved. **Falsifier:** datastore/API
   constraints reject or deterministically reconcile every tested interleaving.
3. **Acknowledgement/telemetry correspondence trace.** Correlate operation ID,
   HTTP outcome, authority result, subsequent read, UI message and event.
   **Warrant:** save analytics is emitted after both success and rollback paths.
   **Falsifier:** the event contract explicitly defines intent rather than
   committed save and downstream analysis uses it accordingly.

#### Unresolved evidence

- **Unknown:** Educator API uniqueness, transaction and read-consistency
  guarantees.
- **Unknown:** Firestore indexes/security rules and whether another layer makes
  attempt check-and-add atomic.
- **Unknown:** production frequency and consequence of retries, multiple tabs,
  weak networks and concurrent editing.

## Lens 8: control theory, feedback and stability

### Governing question

What outcomes are controlled, what signals represent them, what mechanisms can
change system behavior, and do feedback loops converge on the intended result
without oscillation, delay-induced error or misleading measurement?

### Movement 1: reflect on the raw observations

#### Literal observations

- **Observed:** the curriculum GraphQL wrapper uses a fixed retry count of three,
  logs retries and reports an error on the final retry
  ([curriculum retry loop](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/curriculum-api-2023/sdk.ts#L24-L57)).
- **Observed:** App Router data caching defaults to 7,200 seconds. The wrapper
  documents cache identity, invalidation tags and the risk that caching a
  transformed result can retain an old shape across a deploy
  ([cache control](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/cache/index.ts#L1-L33)).
- **Observed:** Pages ISR decorates results with an environment-configured
  revalidation interval and can switch initial build behavior based on an ISR
  setting
  ([ISR control](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/isr/index.ts#L7-L50)).
- **Observed:** analytics observations enter a browser queue. Consent/service
  state controls whether the queue is flushed, cleared or retained; a timer
  checks every three seconds by default, while selected events can request an
  immediate flush
  ([analytics queue](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/browser-lib/analytics/withQueue.ts#L13-L123)).
- **Observed:** save-unit code rolls back local state after a failed response but
  still emits a `contentSaved` event because it does not branch on the helper's
  boolean result
  ([save signal path](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/educator-api/helpers/saveUnits/useSaveUnits.tsx#L80-L111),
  [returned response signal](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/educator-api/helpers/postEducatorData.ts#L1-L10)).
- **Observed:** Oak Components' internal button measures hover duration and
  exposes both click and hover callbacks to its consumer; it does not interpret
  those signals as a user outcome
  ([button observation hooks](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/internal-components/InternalButton/InternalButton.tsx#L49-L87)).

#### Inherited assumptions exposed

- **Inferred:** retries, cache TTLs, polling and feedback UI are control
  mechanisms, but not necessarily closed-loop control. A loop exists only when
  observed deviation changes a future action or parameter.
- **Inferred:** analytics and error reports are sensors, not proof of a learning
  system. The inspected source does not show whether humans or automation use
  those signals to alter ranking, publication, cache policy or interaction.
- **Inferred:** stability has several meanings here: bounded request retries,
  eventual cache freshness, local/remote state convergence and product behavior
  improving rather than reacting to noisy proxy metrics.

### Movement 2: define the problem space

**Mechanism-neutral problem frame:** an Oak application must keep material
outcomes within acceptable bounds despite changing content, dependencies,
traffic and user behavior. This requires explicit desired outcomes, observable
error signals, mechanisms capable of correction, delays understood well enough
to avoid overreaction, and evidence that the loop converges.

Harm includes retry amplification, stale content beyond its acceptable window,
telemetry optimising the wrong proxy, corrective changes based on mislabeled
events, and failures that are observed but never connected to action.

**Success:** a claimed control loop can name its outcome/setpoint, sensor,
actuator, delay, disturbance and stability evidence; open-loop policies are
recognised as such and justified by their operating envelope.

### Movement 3: reflect on possible explanations

#### Competing explanations

1. **Candidate explanation: control lives outside the repositories.** Alerts,
   dashboards, editorial operations and product review may close loops that
   static application code only instruments.
2. **Candidate explanation: fixed policies are sufficient.** Stable upstream
   behavior may make three retries and fixed revalidation intervals an
   intentionally simple open-loop response.
3. **Candidate explanation: signals are weak proxies.** Click, hover and named
   analytics events may not distinguish intent, success and impact well enough
   to control product outcomes.
4. **Candidate explanation: user interaction is the controller.** Search
   filters, retries and feedback may let the user correct the projection without
   automatic adaptation.

#### Assumption changed by reflection

"More observability" is not itself the solution. **Inferred:** a high-volume
sensor without an owned decision and valid outcome model can add noise. The
investigation must first establish the controlled variable and correction
authority.

### Movement 4: synthesise and propose

#### Synthesis

**Inferred:** current source contains many control-loop parts but few complete
loops visible within the repositories. Retries react locally to request failure;
cache intervals set intended refresh policy; UI state reacts to commands;
telemetry observes interactions. Whether operational and product loops turn
those signals into stable improvement is unknown. The seam is **desired outcome
-> observable signal -> interpretation -> corrective authority -> changed
behavior -> re-observed outcome**.

#### Warranted investigations

1. **Feedback-loop inventory.** For freshness, availability, search relevance,
   successful saves, accessibility and publication correctness, name the
   setpoint, sensor, actuator, owner, delay and reviewed evidence. **Warrant:**
   the repositories expose mechanisms and signals but not their complete loops.
   **Falsifier:** current operational/product runbooks already provide this
   mapping and demonstrate closure.
2. **Signal-validity trace.** Compare emitted events with authoritative outcomes
   for failure, rollback, cancellation and duplicate paths. **Warrant:** the
   inspected save event does not branch on HTTP success. **Falsifier:** event
   semantics explicitly measure intent and no downstream use treats it as
   successful persistence.
3. **Disturbance and recovery experiment.** Introduce bounded dependency
   latency/failure and publication changes, then observe retries, cache age,
   queue delay, user outcome and recovery. **Warrant:** static parameters alone
   do not establish stable behavior. **Falsifier:** existing production-like
   exercises cover the same disturbances with accepted recovery envelopes.

#### Unresolved evidence

- **Unknown:** alerting, dashboards, SLOs, editorial controls and decision
  cadences outside these repositories.
- **Unknown:** causal validity of analytics events for educational or teacher
  outcomes.
- **Unknown:** dependency capacity and whether retries or synchronized cache
  refreshes amplify incidents.

## Lens 9: data-model contracts, schema correspondence and evolution

### Governing question

How do serialised, generated, runtime-validated and interaction-facing data
models correspond across source, application and kit boundaries, and how can
independently changing producers and consumers preserve meaning?

### Movement 1: reflect on the raw observations

#### Literal observations

- **Observed:** OWA generates TypeScript operation types and an SDK from a
  remote curriculum GraphQL schema plus local operation documents
  ([curriculum code generation](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/curriculum-api-2023/codegen.yml#L1-L13)).
- **Observed:** the generated contract maps JSON, JSONB, timestamps, big integers
  and redirect enums to `any`
  ([generated scalar boundary](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/curriculum-api-2023/generated/sdk.ts#L11-L26)).
- **Observed:** OWA adds runtime Zod schemas. Some import shared curriculum
  vocabularies and define discriminated quiz/media structures, while nullable
  and optional modifiers explicitly admit historical shapes
  ([shared runtime contract](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/curriculum-api-2023/shared.schema.ts#L1-L184),
  [lesson application schema](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/curriculum-api-2023/shared.schema.ts#L186-L253)).
- **Observed:** other runtime contracts retain broad holes: curriculum sequence
  `features`, parent features and actions are `z.any()`, and lifecycle states are
  unconstrained strings
  ([sequence runtime contract](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/curriculum-api-2023/queries/curriculumSequence/curriculumSequence.schema.ts#L3-L93)).
- **Observed:** some Component contracts encode semantic compatibility strongly.
  `OakLessonNavItem` uses a discriminated union so quiz sections require grade
  and question count while intro and video do not
  ([discriminated Component contract](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/pupil/lesson/OakLessonNavItem/OakLessonNavItem.tsx#L16-L58)).

#### Inherited assumptions exposed

- **Inferred:** GraphQL code generation, runtime validation and TypeScript
  Component props protect different boundaries. None alone proves semantic
  compatibility.
- **Inferred:** a structurally assignable Component prop says little about
  whether its value preserves the producer's identity, lifecycle, absence or
  ordering semantics.

### Movement 2: define the problem space

**Mechanism-neutral problem frame:** independently evolving publishers,
services, applications and kit consumers must exchange values whose shape,
meaning, constraints and temporal expectations remain mutually understood.
Compatibility includes syntax, semantic identity, policy, absence, ordering and
failure knowledge.

Harm includes a build that succeeds but interprets a new enum incorrectly, a
runtime parser that accepts semantically impossible data, a cached old
projection consumed by new code, or a Component release whose types remain
assignable while interaction behavior changes.

**Success:** each boundary has an explicit compatibility claim, changes can be
classified by their effect on real consumers, and evidence covers both accepted
shape and intended behavior.

### Movement 3: reflect on possible explanations

#### Competing explanations

1. **Candidate explanation: layered contracts are intentional defence.** Remote
   schema types describe transport; Zod creates application contracts; Component
   props create interaction contracts.
2. **Candidate explanation: duplicate schemas can drift.** Generated, shared and
   query-local schemas may encode different snapshots without a correspondence
   check.
3. **Candidate explanation: `any` is an honest uncertainty boundary.** Opaque
   upstream JSON may genuinely require consumer-specific validation rather than
   a false global type.
4. **Candidate explanation: the Component prop is an intentional terminal
   projection.** A narrow interaction contract may correctly discard upstream
   fields once the application has resolved identity, policy and failure state.

#### Assumption changed by reflection

"One schema" is not automatically better. **Inferred:** different projections
need different contracts. Excellence requires provable correspondence and
intentional compatibility between them, not a single universal representation.

### Movement 4: synthesise and propose

#### Synthesis

**Inferred:** the current systems use a layered contract stack with both strong
and deliberately or historically weak points. The risk surface lies at
correspondence: remote schema to runtime schema, runtime schema to page model,
page model to Component prop. The key seam is **producer payload -> generated
shape -> validated meaning -> consumer projection -> interpreted behaviour ->
evolution evidence**.

#### Warranted investigations

1. **Contract correspondence map.** Link GraphQL selection fields, generated
   types, runtime schemas, adapter outputs and Component props for several
   outcomes; identify unvalidated `any`, duplicate vocabulary and incompatible
   nullability. **Warrant:** current layers overlap but are not mechanically
   identical. **Falsifier:** automated correspondence checks already fail every
   semantic drift before merge.
2. **Historical schema-diff replay.** Replay recorded upstream, runtime-schema
   and interaction-projection changes against preceding and following consumers,
   including cached projections. **Warrant:** versioned views and nullable legacy
   shapes signal compatibility work. **Falsifier:** all changes are atomically
   deployed or governed by verified backward/forward compatibility rules.
3. **Projection compatibility matrix.** For selected outcomes, enumerate the
   producer, generated, runtime-validated, cached, page and Component-prop models,
   including supported historic and future-adjacent shapes. **Warrant:** these
   representations are independently maintained. **Falsifier:** one executable
   contract already derives or verifies every projection and compatibility
   window.
4. **Semantic mutation tests.** Keep shapes valid while changing ordering,
   multiplicity, enum-like strings, stale cache shapes and identity
   relationships. **Warrant:** syntactic validation cannot detect all semantic
   incompatibility. **Falsifier:** receiving outcomes are demonstrably invariant
   under each mutation or reject it explicitly.

#### Unresolved evidence

- **Unknown:** upstream compatibility policy and materialized-view retirement
  windows.
- **Unknown:** data-contract versions actually present in caches and downstream
  projections.
- **Unknown:** whether CI performs schema breaking-change, correspondence or
  producer-consumer contract checks outside inspected source.

## Lens 10: failure semantics, absence and partial knowledge

### Governing question

When the system cannot produce the expected result, what exactly is known: that
the thing does not exist, is invalid, duplicated, stale, unauthorized,
unavailable, temporarily unreachable, or simply not yet observed?

### Movement 1: reflect on the raw observations

#### Literal observations

- **Observed:** teacher lesson construction treats an empty browse result,
  missing content and missing unit data as the same curriculum not-found error.
  Duplicate content produces a uniqueness warning and continues with the first
  record. Malformed optional media is reported and omitted
  ([teacher lesson failure branches](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/curriculum-api-2023/queries/teachersLessonOverview/teachersLessonOverview.query.ts#L282-L378),
  [optional media branch](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/curriculum-api-2023/queries/teachersLessonOverview/teachersLessonOverview.query.ts#L178-L196)).
- **Observed:** a generic curriculum helper returns only the first result or
  `null`; it does not distinguish an empty set from multiplicity
  ([first-result helper](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/curriculum-api-2023/index.ts#L103-L112)).
- **Observed:** search result projection reports an unknown key-stage mapping but
  returns an object with an undefined spread and optional title; separately, a
  hit without required address fields is warned about and omitted from rendered
  results
  ([unknown facet mapping](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/search/helpers/index.ts#L236-L261),
  [unaddressable result omission](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/search/helpers/index.ts#L314-L374)).
- **Observed:** CMS preview array parsing silently removes invalid items so an
  editor can see the remaining valid results, while invalid singleton or
  non-preview data follows the schema's throwing parse behavior
  ([CMS partial-result policy](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/cms/sanity-client/parseResults.ts#L88-L144)).
- **Observed:** the pupil attempt endpoint distinguishes missing request ID,
  datastore absence, invalid payload, duplicate ID and caught write failure,
  although its caught failure constructs JSON containing `status: 500` without
  passing an HTTP status option in that branch
  ([attempt failure protocol](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/api/pupil/lesson-attempt/route.ts#L10-L69)).
- **Observed:** `OakPupilJourneyListItem` has separate `disabled` and
  `unavailable` inputs but combines them to remove interactivity; only
  unavailable receives the literal "Unavailable" label
  ([journey negative-state projection](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/pupil/browse/OakPupilJourneyListItem/OakPupilJourneyListItem.tsx#L12-L25),
  [rendered distinction](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/pupil/browse/OakPupilJourneyListItem/OakPupilJourneyListItem.tsx#L122-L192)).
- **Observed:** `OakTeacherNotesModal` compresses all failures into "An error
  occurred" and all supplied save success into "Progress saved", while the
  application remains responsible for the reason and recovery path
  ([teacher-note message projection](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/teacher/OakTeacherNotesModal/OakTeacherNotesModal.tsx#L94-L130)).

#### Inherited assumptions exposed

- **Inferred:** not-found is sometimes a user outcome projected from several
  different internal knowledge states. It does not prove non-existence at every
  authority.
- **Inferred:** graceful degradation is a policy decision about which partial
  claims remain trustworthy. Filtering malformed media or preview documents may
  preserve useful work while also hiding completeness loss.
- **Inferred:** a generic error presentation is not necessarily poor failure
  semantics. It becomes risky when the caller also lacks structured reason,
  retryability, operation identity or diagnostic context.

### Movement 2: define the problem space

**Mechanism-neutral problem frame:** when information or an operation is
incomplete, the system must preserve enough epistemic distinction to choose a
truthful user response, correct recovery behavior and useful diagnosis. It must
not claim non-existence from temporary ignorance, success from acceptance, or
completeness from a filtered partial projection.

Harm includes misleading 404s, silent curriculum gaps, unrecoverable generic
errors, repeated operations after an ambiguous timeout, and users acting on a
partial result as though it were complete.

**Success:** every negative path is classified by what is known, the responsible
authority, retryability, partial-result policy and user consequence; intentional
compression occurs only after those decisions are made.

### Movement 3: reflect on possible explanations

#### Competing explanations

1. **Candidate explanation: user outcomes intentionally collapse causes.** A
   missing join member may make the complete page unusable regardless of which
   source failed.
2. **Candidate explanation: operational diagnostics preserve the distinction.**
   Error codes, warnings and reports may be sufficient even when the UI is
   simple.
3. **Candidate explanation: upstream guarantees make some states impossible.**
   Multiplicity and missing joins may be defensive branches rather than real
   production states.
4. **Candidate explanation: partial success is valuable.** Preview, search and
   lesson pages may correctly retain usable fragments rather than fail the
   complete outcome.

#### Assumption changed by reflection

The target is not maximal error specificity in the UI. **Inferred:** internal
epistemic precision and user-facing simplicity are compatible. The application
needs enough structured knowledge to make the compression intentionally and to
choose the right recovery.

### Movement 4: synthesise and propose

#### Synthesis

**Inferred:** OWA already differentiates many failure states, but it also
collapses them at page, API and Component boundaries. The policies differ by
outcome: optional media degrades, preview arrays filter, search hits omit, core
lesson joins fail, duplicates sometimes continue, and Components present small
negative-state vocabularies. The seam is **raw anomaly -> knowledge state ->
outcome viability -> recovery policy -> diagnostic record -> user
representation**.

#### Warranted investigations

1. **Failure-semantics catalogue.** Enumerate all negative branches for several
   end-to-end outcomes and classify absence, invalidity, multiplicity,
   authorization, dependency failure, stale knowledge and ambiguous commit.
   **Warrant:** inspected paths use materially different policies. **Falsifier:**
   an existing canonical error model preserves these distinctions through every
   boundary.
2. **Fault-injection projection tests.** Independently remove, corrupt,
   duplicate, delay and deny each authority response, then record status, cache
   behavior, telemetry, rendered message and recovery. **Warrant:** static code
   cannot establish multi-layer runtime behavior. **Falsifier:** production-like
   contract tests already cover the same matrix and assert intended outcomes.
3. **Partial-result completeness study.** Identify whether users and downstream
   consumers can tell that search, preview or page content was filtered or
   degraded, and whether that matters to their decision. **Warrant:** current
   branches can continue after dropping data. **Falsifier:** dropped data is
   proven optional for every affected outcome and completeness is not claimed.

#### Unresolved evidence

- **Unknown:** frequency and user consequence of each negative state in
  production.
- **Unknown:** error-report payloads, alert routing and whether warnings are
  actionable.
- **Unknown:** upstream invariants that make defensive branches unreachable.

## Cross-lens synthesis

### Load-bearing observations

Across all ten passes, the following observations repeatedly changed the frame:

1. **Observed:** one lesson page is assembled from separately selected content,
   placement, unit, copyright, vocabulary and application-policy projections.
2. **Observed:** public curriculum identity is reconstructed from compound
   slugs, placement conjunctions and redirect projections rather than carried
   as one visibly universal identifier.
3. **Observed:** runtime validation, defaulting, omission and conflict selection
   transform what can be known, not just how data is formatted.
4. **Observed:** search relevance depends on local vocabulary and route
   projection after the external service has ranked hits.
5. **Observed:** lifecycle states differ across curriculum data, CMS preview,
   public routes and Component package compatibility.
6. **Observed:** meaningful temporal and consistency policy is distributed
   across stores, actions, clients, BFFs, remote services and Component props.
7. **Observed:** telemetry, retries and cache parameters provide parts of
   feedback loops, but static source does not establish closed-loop governance
   or stability.
8. **Observed:** strong contracts coexist with `any`, unconstrained lifecycle
   strings, broad package exports and semantically compressed props.
9. **Observed:** negative states are sometimes distinguished and sometimes
   deliberately collapsed according to the local outcome.

### Assumptions and inherited shapes that changed

- "A lesson is an entity" became **lesson concept, authored content, placement,
  address, page projection and learner run are different identities or
  contexts**.
- "Search quality is ranking" became **relevance is an end-to-end property from
  information need through usable result and task outcome**.
- "Published is available" became **lifecycle, addressability, policy,
  deliverability and support are separate dimensions**.
- "The type defines the state machine" became **valid history and transition
  guards may be stricter than the structural state representation**.
- "A successful request means success" became **intent, projection, acceptance,
  commit, reconciliation and observation are separate stages**.
- "Telemetry closes the loop" became **a sensor matters only when its semantics,
  corrective authority and stability evidence are known**.
- "One shared schema would remove duplication" became **purpose-specific
  contracts are legitimate; correspondence and evolution evidence are the
  requirement**.
- "A generic error loses necessary detail" became **internal epistemic precision
  can support deliberately simple user presentation**.
- "Component library equals presentation layer" became **Oak Components spans
  primitives, domain interaction language and compressed workflow projections**.

### Newly visible seams

These seams are analytical boundaries, not proposed services:

```text
educational concept -> authored version -> curriculum placement -> public address
source observation -> validated value -> reconciled claim -> visible assertion
information need -> interpreted constraint -> ranked candidate -> usable outcome
authority lifecycle -> audience projection -> addressability -> support obligation
event history -> valid state -> temporal predicate -> interaction feedback
user intent -> operation identity -> authority commit -> reconciled observation
desired outcome -> sensor -> interpretation -> correction -> re-observation
producer shape -> semantic contract -> consumer behavior -> evolution evidence
raw anomaly -> epistemic state -> viability policy -> recovery -> presentation
domain meaning -> application projection -> component interaction vocabulary
```

### Combined problem frame

**Inferred:** the underlying challenge is not to reproduce OWA's mechanisms or
Oak Components' catalogue. It is to enable many Oak applications to turn
evolving educational authorities into truthful, findable, temporally coherent
and accessible outcomes while preserving identity, semantic meaning,
compatibility and evidence across projections.

The present repositories demonstrate substantial impact-bearing knowledge:
curriculum vocabulary, audience projections, lifecycle policy, navigation,
state transitions, defensive validation, compatibility and interaction
semantics. They also demonstrate why those responsibilities cannot be inferred
from framework, package or directory structure alone.

### Highest-leverage combined investigations

These are evidence programmes, not a target architecture sequence.

| Investigation                            | Warrant                                                                                                      | Falsifier                                                                                                     |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| Concept, identity and lifecycle atlas    | The same nouns carry different keys, states and invariants across projections.                               | One canonical model already defines every meaning, identity and transition consumed here.                     |
| Claim-lineage and epistemic-state traces | Defaults, omission, first-record selection and degraded results change what is knowable.                     | Existing lineage and error contracts preserve authority, loss and knowledge state end to end.                 |
| Task-based search relevance programme    | Ranking, vocabulary, identity reconstruction and interaction are independently implemented.                  | Existing representative judgements already connect all stages to successful teacher outcomes.                 |
| Temporal and concurrency model checking  | Local stores, optimistic projection, check-then-write and remote authorities create interleavings.           | Exhaustive existing tests and service guarantees prove all material invariants under retries and concurrency. |
| Publication-to-consumer transition trace | CMS, curriculum, search, routes, assets, caches and package APIs have different lifecycle mechanisms.        | Atomic versioning and compatibility evidence proves coordinated transition for every consumer.                |
| Contract evolution replay                | Generated types, Zod schemas, page projections and Component props overlap without universal correspondence. | Automated producer/consumer compatibility checks already reject every material semantic drift.                |
| Feedback-loop and signal-validity audit  | The source contains sensors and actuators but not complete evidence of outcome control.                      | Operational and product evidence names each loop and demonstrates stable correction using valid signals.      |
| Cross-consumer Component semantics study | Domain-named interactions and generic primitives share one public package.                                   | All consumers use the same documented meanings and compatibility contract without OWA-specific assumptions.   |

### Unresolved evidence that could materially change the synthesis

- upstream curriculum ontology, immutable IDs, cardinality constraints,
  publication state definitions and compatibility guarantees;
- production data snapshots and histories across publication transitions;
- search index construction, ranking, query distributions and task-based
  relevance evidence;
- actual Component consumers, versions, imports and support commitments;
- service-side transaction, idempotency, consistency and authorization
  guarantees;
- operational telemetry schemas, SLOs, dashboards, alerts and decision loops;
- user research establishing what teachers and pupils believe visible states
  such as available, complete, saved and shared mean; and
- incident/change history showing which semantic seams have caused impact or
  resisted valuable innovation.

Until that evidence is gathered, any target architecture derived from these
lenses would be a hypothesis. The durable result of this pass is the set of
questions, distinctions, warrants and falsifiers above, not a preferred system
shape.
