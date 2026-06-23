# Deep-dive research: Learning Commons Knowledge Graph release notes

**Subject:** Learning Commons Knowledge Graph release notes and surrounding documentation  
**Primary source:** [Learning Commons Knowledge Graph release notes](https://docs.learningcommons.org/knowledge-graph/resources/release-notes)  
**Research date:** 22 June 2026  
**Latest substantive release identified:** Knowledge Graph **v1.10.0**, dated **18 June 2026** in the release notes and GitHub changelog.

---

## Executive summary

Learning Commons’ Knowledge Graph has evolved quickly from a standards-and-learning-components dataset into a broader education-data platform spanning:

- Academic standards from U.S. states and multi-state frameworks.
- Granular Learning Components for Mathematics and, more recently, English Language Arts.
- Standards Crosswalks that map state math standards to Common Core using Learning Component overlap.
- Learning Progressions based on Student Achievement Partners’ Coherence Map.
- Curriculum metadata and alignment data, initially focused on Illustrative Mathematics IM® 360.
- Local graph-native JSONL exports.
- REST API access.
- MCP and Claude-oriented AI integration patterns.

The release history shows three major arcs:

1. **Coverage expansion**  
   The graph has steadily added Learning Component alignments and Common Core crosswalks for more state mathematics standards. In May 2026, it expanded into English Language Arts Learning Components, initially for grades K–2.

2. **Developer distribution maturity**  
   The data distribution moved away from CSV flat files toward newline-delimited JSONL graph exports: `nodes.jsonl` and `relationships.jsonl`.

3. **Application and AI-tooling enablement**  
   API keys, semantic search, standards lookup, Learning Component search, curriculum endpoints, dependency maps, and MCP tooling indicate that Learning Commons is positioning the Knowledge Graph as an infrastructure layer for standards-aware, curriculum-aware, and AI-assisted educational products.

The most recent release, **v1.10.0**, is less about expanding state coverage and more about hardening: adding `hasChildren` to Academic Standards API responses, clarifying learning-progression endpoint direction, improving Illustrative Mathematics data quality, fixing selected standards metadata, and removing duplicated Learning Components that had distorted Jaccard scores in Standards Crosswalks.

---

## Important caveat: the release-note page has versioning inconsistencies

The release-note page is useful as a human-readable narrative, but it is not completely clean as a machine-readable changelog.

Observed inconsistencies:

- The release-note page metadata says **“Release notes for Knowledge Graph v1.9.0”**, but the page body includes **18 June 2026 / Data v1.10.0** as the latest entry.  
  Source: [Release notes](https://docs.learningcommons.org/knowledge-graph/resources/release-notes)

- The docs page labels both **26 February 2026** and **18 March 2026** entries as **Data v1.6.0**.  
  Source: [Release notes](https://docs.learningcommons.org/knowledge-graph/resources/release-notes)

- The GitHub changelog gives a different sequence for the middle releases:
  - **v1.5.0** = 26 February 2026
  - **v1.6.0** = 12 March 2026
  - **v1.7.0** = 26 March 2026
  - **v1.8.0** = 23 April 2026
  - **v1.9.0** = 27 May 2026
  - **v1.10.0** = 18 June 2026  
  Source: [GitHub CHANGELOG.md](https://github.com/learning-commons-org/knowledge-graph/blob/main/CHANGELOG.md)

- The GitHub changelog heading for **v1.8.0** says **2026-04-23**, but the body text immediately underneath says **March 26, 2026**. The docs release-note page uses **23 April 2026**, which is likely the intended release date.  
  Sources: [GitHub CHANGELOG.md](https://github.com/learning-commons-org/knowledge-graph/blob/main/CHANGELOG.md), [Release notes](https://docs.learningcommons.org/knowledge-graph/resources/release-notes)

### Practical recommendation

For implementation work:

- Treat the docs release-note page as the product narrative.
- Treat GitHub tags, versioned CDN export URLs, and the GitHub changelog as stronger signals for exact version pinning.
- Pin local data downloads by explicit versioned URLs, for example:
  - `https://cdn.learningcommons.org/knowledge-graph/v1.10.0/exports/nodes.jsonl`
  - `https://cdn.learningcommons.org/knowledge-graph/v1.10.0/exports/relationships.jsonl`  
  Source: [Local files](https://docs.learningcommons.org/knowledge-graph/using-knowledge-graph/local-files)

---

## What the Knowledge Graph is

Learning Commons describes the Knowledge Graph as a structured collection of enriched educational datasets that connects academic standards, curricula, and learning-science data through a unified schema.  
Source: [Introduction](https://docs.learningcommons.org/knowledge-graph/understanding-knowledge-graph/introduction)

The core model is graph-based:

- **Entities / nodes** represent concepts such as standards, learning components, curriculum lessons, or activities.
- **Relationships / edges** represent directed links between those concepts.
- Every entity and relationship carries a UUID, which functions similarly to a join key in a relational database.
- Some UUIDs come from external systems, especially the CASE Network, supporting interoperability.  
Source: [Core concepts](https://docs.learningcommons.org/knowledge-graph/understanding-knowledge-graph/core-concepts)

Learning Commons currently describes four main dataset categories:

1. **Curriculum**
2. **Academic Standards**
3. **Learning Progressions**
4. **Learning Components**

Source: [Core concepts](https://docs.learningcommons.org/knowledge-graph/understanding-knowledge-graph/core-concepts)

---

## Access methods

The Knowledge Graph can currently be accessed through several paths.

### 1. Local JSONL files

Knowledge Graph data is downloadable as two newline-delimited JSONL files:

- `nodes.jsonl` — graph entities / nodes
- `relationships.jsonl` — graph relationships / edges

Source: [Local files](https://docs.learningcommons.org/knowledge-graph/using-knowledge-graph/local-files)

The current docs show versioned download commands for **v1.10.0**:

```bash
curl -L "https://cdn.learningcommons.org/knowledge-graph/v1.10.0/exports/nodes.jsonl?ref=docs_curl" -o nodes.jsonl

curl -L "https://cdn.learningcommons.org/knowledge-graph/v1.10.0/exports/relationships.jsonl?ref=docs_curl" -o relationships.jsonl
```

Source: [Local files](https://docs.learningcommons.org/knowledge-graph/using-knowledge-graph/local-files)

### 2. REST API

The REST API provides programmatic access to:

- Curriculum scope and sequence.
- Academic standards from all 50 U.S. states.
- Learning Components for Mathematics and English Language Arts.
- Standards hierarchy relationships.
- Prerequisites and builds-towards relationships.
- Crosswalks.
- Learning progressions.

Source: [REST API](https://docs.learningcommons.org/knowledge-graph/using-knowledge-graph/rest-api)

The API reference lists the base URL as:

```text
https://api.learningcommons.org/knowledge-graph/v0
```

All API requests require an API key in the `x-api-key` header.  
Source: [API Reference overview](https://docs.learningcommons.org/api-reference/platform-api/overview)

### 3. MCP server

Learning Commons also provides an MCP server for AI applications. The MCP server exposes tools for:

- Resolving a standard code into an authoritative statement and metadata.
- Fetching Learning Components for a standard.
- Finding learning progressions from a standard.

Server URL:

```text
https://kg.mcp.learningcommons.org/mcp
```

Source: [MCP server](https://docs.learningcommons.org/knowledge-graph/using-knowledge-graph/mcp-server)

The MCP docs frame this as a way for AI models to use structured, authoritative educational data instead of relying on model recall.  
Source: [MCP server](https://docs.learningcommons.org/knowledge-graph/using-knowledge-graph/mcp-server)

### 4. Claude connector

The navigation and quickstart documentation also refer to a Claude connector. This appears to sit alongside local files, REST API, and MCP access as another way to query the graph from an AI environment.  
Source: [Quickstart](https://docs.learningcommons.org/knowledge-graph/getting-started/quickstart)

---

## Data model: key entities and relationships

### Academic Standards

The Academic Standards model includes:

- `StandardsFramework`
- `StandardsFrameworkItem`

A standards framework represents a standards document or framework. A framework item represents a standard, grouping, domain, strand, or other structured element within a framework.

Academic Standards are sourced from CASE Network / 1EdTech-aligned data and normalized so that developers can query across frameworks more consistently.  
Source: [Academic Standards](https://docs.learningcommons.org/knowledge-graph/graph-reference/academic-standards)

Key relationships include:

- `StandardsFramework` → `hasChild` → `StandardsFrameworkItem`
- `StandardsFrameworkItem` → `hasChild` → `StandardsFrameworkItem`

Source: [Academic Standards](https://docs.learningcommons.org/knowledge-graph/graph-reference/academic-standards)

### Learning Components

Learning Components are granular, precise representations of individual skills or concepts. They break broad educational standards into teachable and measurable parts.  
Source: [Learning Components](https://docs.learningcommons.org/knowledge-graph/graph-reference/learning-components)

Learning Commons describes Learning Components as:

- Instructionally actionable.
- Aligned to academic standards.
- Interoperable across curricula, assessments, and platforms.
- Machine-readable and human-interpretable.
- Useful for AI-driven content recommendations and transparent instructional intent.

Source: [Learning Components](https://docs.learningcommons.org/knowledge-graph/graph-reference/learning-components)

The core relationship is:

```text
LearningComponent -[:supports]-> StandardsFrameworkItem
```

Source: [Learning Components](https://docs.learningcommons.org/knowledge-graph/graph-reference/learning-components)

Current Learning Component coverage listed in the docs:

- **Mathematics:** Common Core State Standards for Mathematics plus many state frameworks.
- **English Language Arts:** Common Core State Standards for ELA plus Connecticut, Delaware, Illinois, Maryland, Michigan, Mississippi, Nevada, New Hampshire, Vermont, Washington, Washington D.C., and Wyoming.

Source: [Learning Components](https://docs.learningcommons.org/knowledge-graph/graph-reference/learning-components)

Important limitation:

- ELA Learning Component coverage is currently limited to grades K–2.
- Additional grade bands are expected in future releases.

Source: [Learning Components](https://docs.learningcommons.org/knowledge-graph/graph-reference/learning-components)

### Learning Progressions

Learning Progressions represent conceptual and sequencing relationships between standards. They are based on Student Achievement Partners’ Coherence Map for Common Core State Standards for Mathematics.  
Source: [Learning Progressions](https://docs.learningcommons.org/knowledge-graph/graph-reference/learning-progressions)

Key relationships include:

- `buildsTowards`
- `relatesTo`

Source: [Learning Progressions](https://docs.learningcommons.org/knowledge-graph/graph-reference/learning-progressions)

A critical interpretation point:

- `buildsTowards` indicates that proficiency in one standard supports success in another standard.
- It should not be treated as a strict “must-master-first” prerequisite in every instructional context.

The June 2026 release clarifies API endpoint direction:

- `GET /academic-standards/{caseIdentifierUUID}/prerequisites` returns standards a given standard builds from.
- `GET /academic-standards/{caseIdentifierUUID}/builds-towards` returns standards it builds towards — that is, standards for which the current standard is a prerequisite.

Source: [Release notes](https://docs.learningcommons.org/knowledge-graph/resources/release-notes)

### Standards Crosswalks

Standards Crosswalks map state mathematics standards to Common Core State Standards for Mathematics using Learning Component overlap.  
Source: [Standards Crosswalks](https://docs.learningcommons.org/knowledge-graph/graph-reference/standards-crosswalks)

Crosswalks are:

- Evidence-based: created only when standards share at least one Learning Component.
- Directional: always state standard → Common Core standard.
- Quantitative: each edge includes a Jaccard similarity score.
- Limited in scope: currently math standards in states where Learning Component alignment exists.

Source: [Standards Crosswalks](https://docs.learningcommons.org/knowledge-graph/graph-reference/standards-crosswalks)

The key relationship is:

```text
State StandardsFrameworkItem -[:hasStandardAlignment]-> CCSS StandardsFrameworkItem
```

Source: [Standards Crosswalks](https://docs.learningcommons.org/knowledge-graph/graph-reference/standards-crosswalks)

Crosswalk relationship properties include:

- `jaccard`
- `stateLCCount`
- `ccssLCCount`
- `sharedLCCount`

The Jaccard calculation is:

```text
Jaccard = shared Learning Components / (state Learning Components + CCSS Learning Components - shared Learning Components)
```

Source: [Standards Crosswalks](https://docs.learningcommons.org/knowledge-graph/graph-reference/standards-crosswalks)

This makes the v1.10.0 duplicate-Learning-Component fix important: if duplicate Learning Components had been inflating counts, downstream Jaccard scores and “best match” crosswalk decisions may change.  
Source: [Release notes](https://docs.learningcommons.org/knowledge-graph/resources/release-notes)

### Curriculum

The Curriculum graph reference describes a standardised K–12 curriculum ontology covering:

- `Course`
- `LessonGrouping`
- `Lesson`
- `Activity`
- `Assessment`
- `Material`
- `ClassroomMaterial`
- `GlossaryTerm`
- `InstructionalRoutine`

Source: [Curriculum](https://docs.learningcommons.org/knowledge-graph/graph-reference/curriculum)

Important curriculum relationships include:

- `hasPart`
- `hasEducationalAlignment`
- `usesRoutine`
- `uses`
- `hasDependency`
- `hasReference`
- `references`
- `mutuallyExclusiveWith`

Source: [Curriculum](https://docs.learningcommons.org/knowledge-graph/graph-reference/curriculum)

The curriculum data currently appears centred on Illustrative Mathematics IM® 360. The API overview says curriculum endpoints are currently limited to the IM 360 scope and sequence and do not include the materials of a lesson, activity, or assessment.  
Source: [API Reference overview](https://docs.learningcommons.org/api-reference/platform-api/overview)

The Curriculum reference emphasises that metadata makes instructional dependencies explicit and can be used to analyse how concepts build over time.  
Source: [Curriculum](https://docs.learningcommons.org/knowledge-graph/graph-reference/curriculum)

---

## Release timeline

### Summary timeline

| Date | Version / label | Main changes | Strategic significance |
|---|---:|---|---|
| 30 Oct 2025 | Data v1.1.0 | Added Learning Component alignments for Louisiana, Montana, Pennsylvania, and Washington D.C.; added D.C. academic standards. | Early state-coverage expansion. |
| 8 Dec 2025 | Data v1.2.0 | Added Wisconsin Learning Component alignment; added crosswalk fields; added Learner Variability Navigator data; updated attribution. | Crosswalks became more inspectable; learning-science metadata entered the graph. |
| 28 Jan 2026 | Data v1.3.0 | Introduced graph-native JSONL downloads; deprecated CSV downloads. | Major distribution-format shift. |
| 28 Jan 2026 | Data v1.4.0 | Added Massachusetts alignment; added IM® 360 scope and sequence under CC BY-4.0; documented LVN `relevantToStandard`; documented WIDA ELD standards. | Added curriculum scope-and-sequence and more learning-science/ELL documentation. |
| 12 Feb 2026 / 26 Feb 2026 depending source | Data v1.4.0 or v1.5.0 | Added Florida, Idaho, Mississippi, Ohio, South Dakota, and Utah alignments. | Large state-alignment expansion. |
| 26 Feb 2026 | Data v1.5.0 in GitHub; v1.6.0 in docs | Added North Carolina alignment; introduced curriculum REST endpoints; added standards-to-lessons/activities/assessments endpoints. | Shift from data-only releases toward product/API functionality. |
| 12 Mar / 18 Mar 2026 depending source | Data v1.6.0 | Added Kansas alignment; added API keys; added semantic search for standards; added Learning Component search; fixed Massachusetts alignment inconsistencies; fixed IM `hasDependency` direction. | Major developer/API release. |
| 26 Mar 2026 | Data v1.7.0 | Added Georgia, Iowa, Kentucky, Tennessee, West Virginia; improved Utah, South Dakota, Mississippi, Idaho, Ohio alignments; added `publisherIdentifier` for IM content nodes. | More state coverage plus better source traceability for IM nodes. |
| 23 Apr 2026 | Data v1.8.0 | Added curriculum dependency-map endpoint; added Alabama, Arkansas, Missouri, North Dakota, Oregon, Wyoming; completed Texas grades K–1 alignments, completing Texas. | Dependency-aware curriculum planning becomes more feasible. |
| 27 May 2026 | Data v1.9.0 | Added ELA Learning Components for grades K–2; aligned to CCSS ELA and 12 states/jurisdictions. | First major subject expansion beyond math. |
| 18 Jun 2026 | Data v1.10.0 | Added `hasChildren` flag; clarified learning-progression endpoints; updated ELA row-level license/attribution; improved IM data quality; fixed selected standards metadata; removed duplicate LCs affecting Jaccard scores. | Hardening release: API ergonomics, data quality, and crosswalk accuracy. |

Sources: [Release notes](https://docs.learningcommons.org/knowledge-graph/resources/release-notes), [GitHub CHANGELOG.md](https://github.com/learning-commons-org/knowledge-graph/blob/main/CHANGELOG.md)

---

## Release-by-release analysis

### 30 October 2025 — Data v1.1.0

Changes listed:

- Added Learning Component alignment for:
  - Louisiana
  - Montana
  - Pennsylvania
  - Washington, D.C.
- Added academic standards for Washington, D.C.

Source: [Release notes](https://docs.learningcommons.org/knowledge-graph/resources/release-notes)

Interpretation:

This was an early coverage-expansion release. The emphasis is not on new API capabilities or schema changes, but on expanding the standards and Learning Component alignment footprint.

Implications:

- More jurisdictions could be used for standards alignment.
- D.C. moved from partial or absent coverage to explicit academic standards support.
- Downstream products should treat state coverage as version-dependent.

---

### 8 December 2025 — Data v1.2.0

Changes listed:

- Added Wisconsin Learning Component alignment.
- Added Crosswalk fields for comparing state standards to Common Core.
- Added Learner Variability Navigator data from Digital Promise.
- Updated attribution statement to reflect the name Learning Commons.

Source: [Release notes](https://docs.learningcommons.org/knowledge-graph/resources/release-notes)

Interpretation:

This release is important because it strengthens the crosswalk model. The release notes say four new fields allow comparison between individual state standards and their Common Core alignment. The Standards Crosswalks documentation identifies the relevant fields as:

- `jaccard`
- `stateLCCount`
- `ccssLCCount`
- `sharedLCCount`

Source: [Standards Crosswalks](https://docs.learningcommons.org/knowledge-graph/graph-reference/standards-crosswalks)

Implications:

- Crosswalks became more transparent and explainable.
- Products could start ranking or thresholding alignments rather than treating them as opaque links.
- Attribution handling became a more explicit integration requirement.

---

### 28 January 2026 — Data v1.3.0

Changes listed:

- Knowledge Graph data became available as newline-delimited JSONL with UTF-8 encoding.
- CSV flat-file downloads were deprecated from v1.3.0 onward.

Source: [Release notes](https://docs.learningcommons.org/knowledge-graph/resources/release-notes)

Interpretation:

This is one of the most important technical changes in the release history. The graph is distributed in a graph-native format: separate nodes and relationships files.

Implications:

- Local file ingestion pipelines should parse JSONL, not CSV.
- Existing CSV-based import scripts should be retired or treated as legacy.
- Graph databases, document databases, DuckDB/SQLite pipelines, and streaming processors can ingest the files more naturally.
- Developers should pin against explicit versioned paths.

Current local-file documentation lists:

- `nodes.jsonl`
- `relationships.jsonl`

Source: [Local files](https://docs.learningcommons.org/knowledge-graph/using-knowledge-graph/local-files)

---

### 28 January 2026 — Data v1.4.0

Changes listed:

- Added Massachusetts Learning Component alignments and crosswalks.
- Added IM® 360 scope and sequence under CC BY-4.0.
- Added the Learner Variability Navigator `relevantToStandard` relationship linking a Factor to a `StandardFrameworkItem` for Common Core ELA standards.
- Added documentation reference to WIDA English Language Development Standards for English language learners.

Source: [Release notes](https://docs.learningcommons.org/knowledge-graph/resources/release-notes)

Interpretation:

This release broadened the graph in three directions:

1. More math state alignment.
2. Curriculum scope-and-sequence coverage.
3. Learning-science and English-language-development metadata.

Implications:

- IM® 360 became a major curriculum dataset within the graph.
- ELA-related relationships began to appear in the graph even before the v1.9.0 ELA Learning Components release.
- Developers need to manage multiple content sources and licenses.

---

### February 2026 — Data v1.4.0 / v1.5.0 discrepancy

The docs release notes list **12 February 2026** as **Data v1.5.0**, adding alignments and Common Core crosswalks for:

- Florida
- Idaho
- Mississippi
- Ohio
- South Dakota
- Utah

Source: [Release notes](https://docs.learningcommons.org/knowledge-graph/resources/release-notes)

The GitHub changelog labels a similar entry as **v1.4.0**, dated **12 February 2026**.  
Source: [GitHub CHANGELOG.md](https://github.com/learning-commons-org/knowledge-graph/blob/main/CHANGELOG.md)

Interpretation:

The substantive content is clear: this release added a large batch of state math alignments. The exact version label differs between documentation sources.

Implications:

- Do not infer state coverage solely from semantic version numbers.
- Check the actual dataset version and content if a state matters operationally.
- For reproducibility, store the exact CDN URL and file hash if possible.

---

### 26 February 2026 — Curriculum API expansion

The docs release notes list this as **Data v1.6.0**, while GitHub lists it as **v1.5.0**.  
Sources: [Release notes](https://docs.learningcommons.org/knowledge-graph/resources/release-notes), [GitHub CHANGELOG.md](https://github.com/learning-commons-org/knowledge-graph/blob/main/CHANGELOG.md)

Changes listed:

- Added North Carolina Learning Component alignments and crosswalks.
- Introduced curriculum scope-and-sequence REST API endpoints.
- Added structured access to IM® 360 curriculum metadata:
  - Courses
  - Scope and sequence
  - Lesson groupings
  - Lessons
  - Activities
  - Assessments
- Added the ability to view academic standards aligned to lessons, activities, and assessments.
- Added endpoints to retrieve lessons, activities, and assessments aligned to a specific academic standard by CASE UUID.
- Clarified that instructional materials themselves are not included.

Sources: [Release notes](https://docs.learningcommons.org/knowledge-graph/resources/release-notes), [API Reference overview](https://docs.learningcommons.org/api-reference/platform-api/overview)

Interpretation:

This release moved the Knowledge Graph from a standards graph toward a curriculum-alignment platform. It becomes possible to start with a standard and find associated curriculum structures, or start with curriculum and inspect standards coverage.

Implications:

- Supports standards coverage reporting.
- Supports curriculum planning and sequencing.
- Enables products to build standards-aligned recommendations without distributing the underlying instructional material.
- The explicit exclusion of lesson/activity/assessment content means this is metadata and alignment data, not full curriculum content delivery.

---

### March 2026 — API keys, semantic search, Learning Component search, and dependency correction

The docs list this under **18 March 2026 / Data v1.6.0**. GitHub lists **v1.6.0** on **12 March 2026**.  
Sources: [Release notes](https://docs.learningcommons.org/knowledge-graph/resources/release-notes), [GitHub CHANGELOG.md](https://github.com/learning-commons-org/knowledge-graph/blob/main/CHANGELOG.md)

Changes listed:

- API keys for REST API and MCP server can be created via Learning Commons Platform.
- Academic standards search now supports semantic search.
- Learning Component search endpoint added.
- Added Kansas Learning Component alignments and crosswalks.
- Updated Massachusetts alignments to address inconsistencies.
- Fixed the direction of the `hasDependency` relationship between curriculum components in Illustrative Mathematics content.

Source: [Release notes](https://docs.learningcommons.org/knowledge-graph/resources/release-notes)

Interpretation:

This is a key application-developer release. Before semantic search, integrations likely depended heavily on exact standard codes or graph traversal. After this release, applications can search by concept, learning goal, or description.

Academic Standards search supports two mutually exclusive modes:

- `query` for semantic search against standard descriptions.
- `statementCode` for exact code search.

Exactly one of those parameters must be supplied.  
Source: [Search academic standards](https://docs.learningcommons.org/api-reference/academic-standards/search-academic-standards)

Learning Component search performs free-text semantic search against Learning Component descriptions and returns a relevance score.  
Source: [Search learning components](https://docs.learningcommons.org/api-reference/learning-components/search-learning-components)

Implications:

- Developer onboarding becomes easier: users do not need exact CASE UUIDs or standard codes for every workflow.
- Semantic search enables teacher-facing and AI-facing use cases such as “find standards about fraction equivalence.”
- The `hasDependency` direction fix may be breaking for curriculum-sequencing pipelines that had already ingested earlier IM data.
- Any cached or precomputed IM dependency graph from before this fix should be rebuilt.

---

### 26 March 2026 — Data v1.7.0

Changes listed:

- Added Learning Component alignments and Common Core crosswalks for:
  - Georgia
  - Iowa
  - Kentucky
  - Tennessee
  - West Virginia
- Updated alignments for:
  - Utah
  - South Dakota
  - Mississippi
  - Idaho
  - Ohio
- Added `publisherIdentifier` for Illustrative Mathematics content nodes.

Sources: [Release notes](https://docs.learningcommons.org/knowledge-graph/resources/release-notes), [GitHub CHANGELOG.md](https://github.com/learning-commons-org/knowledge-graph/blob/main/CHANGELOG.md)

Interpretation:

This is mainly a coverage and data-quality release, but `publisherIdentifier` is operationally important because it preserves the ID assigned by the original publisher.

Implications:

- IM content nodes become easier to reconcile with source systems and publisher references.
- State alignment improvements may change crosswalk outputs for affected states.
- Systems should avoid assuming that an alignment, once present, remains stable across versions.

---

### 23 April 2026 — Data v1.8.0 and curriculum dependency map

Changes listed:

- Added a curriculum dependency-map endpoint.
- Added Learning Component alignments and Common Core crosswalks for:
  - Alabama
  - Arkansas
  - Missouri
  - North Dakota
  - Oregon
  - Wyoming
- Completed Texas grades K–1 Learning Component alignments, completing all grades for Texas.

Sources: [Release notes](https://docs.learningcommons.org/knowledge-graph/resources/release-notes), [GitHub CHANGELOG.md](https://github.com/learning-commons-org/knowledge-graph/blob/main/CHANGELOG.md)

The dependency-map endpoint returns prerequisite relationships between lesson groupings. The docs define a dependency from source → target as meaning the target is a prerequisite and should be taught before the source.  
Source: [Dependency map for a curriculum](https://docs.learningcommons.org/api-reference/curriculum/dependency-map-for-a-curriculum)

The only documented `curriculumId` option is:

```text
im360
```

Source: [Dependency map for a curriculum](https://docs.learningcommons.org/api-reference/curriculum/dependency-map-for-a-curriculum)

Interpretation:

This release improves the graph’s ability to support curriculum sequencing and planning. It also continued the steady march toward broader state math coverage.

Implications:

- Products can build dependency-aware course planners.
- Curriculum graph traversal becomes more actionable for teachers and AI copilots.
- Since only IM 360 is documented as an available curriculum ID, this is not yet a general multi-curriculum dependency service.

---

### 27 May 2026 — Data v1.9.0 and ELA Learning Components

Changes listed:

- Added Learning Components for English Language Arts.
- First ELA release covers grades K–2.
- ELA LCs are aligned to Common Core State Standards for ELA and ELA standards from 12 states/jurisdictions:
  - Connecticut
  - Delaware
  - Illinois
  - Maryland
  - Michigan
  - Mississippi
  - Nevada
  - New Hampshire
  - Vermont
  - Washington
  - Washington, D.C.
  - Wyoming

Source: [Release notes](https://docs.learningcommons.org/knowledge-graph/resources/release-notes)

The GitHub changelog adds that the ELA Learning Components were authored by Choice-filled Lives Network.  
Source: [GitHub CHANGELOG.md](https://github.com/learning-commons-org/knowledge-graph/blob/main/CHANGELOG.md)

Interpretation:

This is the first major expansion beyond Mathematics. It changes the Knowledge Graph’s subject profile and positions it for broader literacy-related use cases.

Implications:

- ELA standards-alignment products can begin using Learning Components, but only for K–2 initially.
- Cross-subject product designs become more plausible, but coverage is uneven.
- The roadmap’s continued emphasis on ELA all-state alignment suggests this is an early-stage release, not a complete ELA coverage milestone.

---

### 18 June 2026 — Data v1.10.0

Changes listed:

#### API updates

- Added a `hasChildren` boolean flag to Academic Standards responses.
- Clarified direction of Learning Progressions endpoints:
  - `prerequisites` returns standards a given standard builds from.
  - `builds-towards` returns standards it builds towards.

Source: [Release notes](https://docs.learningcommons.org/knowledge-graph/resources/release-notes)

#### Data updates

English Language Arts:

- License and attribution statement values updated for each individual row.

Illustrative Mathematics data quality:

- Trimmed whitespace from fields.
- Fixed `inLanguage` and `gradeLevel` fields where they did not match enum values.
- Removed duplicate `hasChild` and `hasReference` relationships.
- Updated `mutuallyExclusiveWith` relationship to always be bidirectional.
- Added missing `Material` entities.

Standards fixes:

- Montana Social Studies: fixed standards where `normalizedStatementType` had incorrectly been null.
- New York Math: fixed one standard where `statementType` and `normalizedStatementType` were null and Learning Component alignments were missing.
- Indiana Science: fixed standards where `subject` had incorrectly been set to `Other`.
- Removed duplicate Learning Components that had caused inaccurate Jaccard scores for state Standards Crosswalks.

Source: [Release notes](https://docs.learningcommons.org/knowledge-graph/resources/release-notes)

Interpretation:

This is a quality, consistency, and API ergonomics release. The changes are less about new coverage and more about making the graph safer and easier to consume.

Implications:

- API clients rendering standards trees should use `hasChildren` rather than guessing or issuing unnecessary child lookups.
- Crosswalk caches should be rebuilt because Jaccard scores may change.
- Strict schema validators should see fewer enum violations in IM data.
- Any logic that assumes `mutuallyExclusiveWith` is unidirectional should be revised.
- Systems using ELA row-level attribution should refresh to pick up corrected attribution values.
- Standards search and filtering logic may behave differently for the corrected Montana, New York, and Indiana standards.

---

## API surface: what developers can now build

### Standards search

The Academic Standards search endpoint supports:

- Semantic search via `query`.
- Exact code search via `statementCode`.
- Filtering by:
  - Grade level
  - Academic subject
  - Normalized statement type
  - Jurisdiction
- Relevance scores from 0 to 1.

Source: [Search academic standards](https://docs.learningcommons.org/api-reference/academic-standards/search-academic-standards)

Important details:

- `query` and `statementCode` are mutually exclusive.
- Exactly one must be provided.
- Code search is exact and case-insensitive, not partial.
- Some organizational grouping standards may have null codes and therefore will not appear in code search.

Source: [Search academic standards](https://docs.learningcommons.org/api-reference/academic-standards/search-academic-standards)

Example use cases:

- “Find standards about multi-step word problems.”
- “Find all frameworks containing 3.NF.A.1.”
- “Find grade 4 math standards in California related to multiplication.”
- “Return only instructional standards, excluding grouping nodes.”

### Learning Component search

The Learning Component search endpoint supports semantic search across Learning Component descriptions.

Source: [Search learning components](https://docs.learningcommons.org/api-reference/learning-components/search-learning-components)

Useful scenarios:

- Find granular skills related to a teaching goal.
- Map internal content or assessment items to Learning Components.
- Build a standard-decomposition workflow for teachers.
- Generate intervention targets for a student struggling with a broad standard.

### Learning Components for a standard

The API can fetch Learning Components that support a specific `StandardsFrameworkItem`. This is useful when the user already has a CASE UUID and wants to decompose a standard into teachable parts.  
Source: [Learning components for a standard](https://docs.learningcommons.org/api-reference/learning-components/learning-components-for-a-standard)

### Curriculum coverage

The API overview lists endpoints for:

- Courses in a curriculum.
- Course scope and sequence.
- Lesson groupings.
- Lessons.
- Activities in a lesson.
- Standards for a lesson.
- Standards for an activity.
- Standards for an assessment.
- Assessments in a course.
- Curriculum dependency map.

Source: [API Reference overview](https://docs.learningcommons.org/api-reference/platform-api/overview)

Important limitation:

The API currently says curriculum information is limited to the Illustrative Mathematics IM 360 scope and sequence and does not include the materials of a lesson, activity, or assessment.  
Source: [API Reference overview](https://docs.learningcommons.org/api-reference/platform-api/overview)

### Curriculum dependency map

The dependency-map endpoint supports:

- Visualising dependency graphs.
- Understanding prerequisite relationships between units or sections.
- Building dependency-aware course planners and sequencing tools.

Source: [Dependency map for a curriculum](https://docs.learningcommons.org/api-reference/curriculum/dependency-map-for-a-curriculum)

### MCP workflows

The MCP server exposes three main educational tools:

1. Find standard statement.
2. Find Learning Components from a standard.
3. Find learning progressions from a standard.

Source: [MCP server](https://docs.learningcommons.org/knowledge-graph/using-knowledge-graph/mcp-server)

A likely AI workflow is:

1. User asks about a standard or concept.
2. MCP resolves the official standard statement.
3. MCP retrieves Learning Components.
4. MCP traces prerequisite or follow-on standards.
5. AI produces a grounded explanation, intervention plan, lesson plan, or content recommendation.

---

## Current coverage picture

### Mathematics

The Learning Components documentation lists Mathematics mappings to CCSSM and a broad set of state frameworks, including:

- Alabama
- Arkansas
- California
- Colorado
- Connecticut
- Delaware
- Florida
- Georgia
- Hawaii
- Idaho
- Illinois
- Iowa
- Kansas
- Kentucky
- Louisiana
- Maine
- Maryland
- Massachusetts
- Michigan
- Mississippi
- Missouri
- Montana
- Nevada
- New Hampshire
- New Jersey
- New Mexico
- New York
- North Carolina
- North Dakota
- Ohio
- Oregon
- Pennsylvania
- Rhode Island
- South Dakota
- Tennessee
- Texas
- Utah
- Vermont
- Washington
- Washington, D.C.
- West Virginia
- Wisconsin
- Wyoming

Source: [Learning Components](https://docs.learningcommons.org/knowledge-graph/graph-reference/learning-components)

The roadmap still says Learning Commons is actively aligning Math Learning Components and Math Crosswalks to all 50 states.  
Source: [Roadmap](https://docs.learningcommons.org/knowledge-graph/understanding-knowledge-graph/roadmap)

### English Language Arts

ELA Learning Components currently cover:

- Common Core State Standards for English Language Arts.
- Connecticut
- Delaware
- Illinois
- Maryland
- Michigan
- Mississippi
- Nevada
- New Hampshire
- Vermont
- Washington
- Washington, D.C.
- Wyoming

Source: [Learning Components](https://docs.learningcommons.org/knowledge-graph/graph-reference/learning-components)

The first ELA release covers grades K–2.  
Sources: [Release notes](https://docs.learningcommons.org/knowledge-graph/resources/release-notes), [Learning Components](https://docs.learningcommons.org/knowledge-graph/graph-reference/learning-components)

### Science and Social Studies

The API supports academic standards in subjects including Science and Social Studies.  
Source: [Search academic standards](https://docs.learningcommons.org/api-reference/academic-standards/search-academic-standards)

However, the Learning Component coverage documentation focuses on Mathematics and ELA. Some v1.10.0 standards fixes also mention Montana Social Studies and Indiana Science, indicating those standards exist in the graph even where Learning Component coverage may be less mature.  
Sources: [Release notes](https://docs.learningcommons.org/knowledge-graph/resources/release-notes), [Learning Components](https://docs.learningcommons.org/knowledge-graph/graph-reference/learning-components)

---

## Licensing and attribution

Learning Commons states:

- Knowledge Graph code is licensed under MIT.
- Knowledge Graph data is provided under CC BY 4.0.
- State standards and written permission under CC BY 4.0 were received from 1EdTech.
- Learning Components under CC BY 4.0 were received from Achievement Network.
- Learning Progressions under CC0 were received from Student Achievement Partners.

Source: [License](https://docs.learningcommons.org/knowledge-graph/resources/license)

The API reference also makes attribution operationally important. For example, Academic Standards search responses include an `attributionStatement`, and the docs state that if the standard is displayed or redistributed, the attribution statement must be included to comply with the license terms.  
Source: [Search academic standards](https://docs.learningcommons.org/api-reference/academic-standards/search-academic-standards)

Learning Component search responses similarly include license and attribution data.  
Source: [Search learning components](https://docs.learningcommons.org/api-reference/learning-components/search-learning-components)

Implications:

- Store `license` and `attributionStatement` alongside any cached entity or response.
- Do not strip attribution fields from derived outputs.
- If displaying standards, Learning Components, curriculum metadata, or crosswalks, include the relevant attribution statement.
- Re-ingest v1.10.0 ELA rows if you rely on ELA attribution, because v1.10.0 updated license and attribution values per individual row.

---

## Practical integration architecture

A robust integration might look like this:

### Offline data layer

Use local JSONL files for:

- Bulk graph analysis.
- Building search indexes.
- Building product-specific lookup tables.
- Running reproducibility-sensitive pipelines.
- Auditing coverage and alignment changes across versions.

Source: [Local files](https://docs.learningcommons.org/knowledge-graph/using-knowledge-graph/local-files)

Recommended practices:

- Pin explicit dataset version.
- Save file hashes.
- Preserve source URL.
- Track node and relationship counts after ingest.
- Keep attribution fields.
- Maintain a migration log between versions.

### Online API layer

Use REST API for:

- Real-time standards lookup.
- Semantic search.
- Standards tree browsing.
- Fetching Learning Components for a standard.
- Curriculum dependency lookup.
- Curriculum metadata lookup.

Source: [API Reference overview](https://docs.learningcommons.org/api-reference/platform-api/overview)

Recommended practices:

- Cache judiciously but invalidate on data-version updates.
- Keep CASE UUIDs as stable external identifiers where applicable.
- Use `hasChildren` for standards-tree UI logic.
- Treat semantic relevance scores as ranking aids, not absolute truth.
- Use jurisdiction filters deliberately; defaults may not match user intent.

### AI / agent layer

Use MCP for:

- Teacher copilots.
- Standards-aware chat.
- Content-generation workflows.
- Intervention planning.
- Learning-progression reasoning.

Source: [MCP server](https://docs.learningcommons.org/knowledge-graph/using-knowledge-graph/mcp-server)

Recommended practices:

- Require citations or source display in AI outputs.
- Avoid letting the model infer standards from memory when MCP/API data is available.
- Check licensing and attribution in generated teacher-facing content.
- Include guardrails around standards interpretation, especially where Learning Component coverage is incomplete.

---

## Migration checklist for v1.10.0

For teams already using an earlier release, the most important v1.10.0 actions are:

### 1. Rebuild local graph indexes

Because v1.10.0 removes duplicate relationships, adds missing `Material` entities, and removes duplicate Learning Components affecting Jaccard scores, all downstream graph indexes should be rebuilt from the v1.10.0 JSONL files.

Sources: [Release notes](https://docs.learningcommons.org/knowledge-graph/resources/release-notes), [Local files](https://docs.learningcommons.org/knowledge-graph/using-knowledge-graph/local-files)

### 2. Recompute Standards Crosswalk outputs

Duplicate Learning Components caused inaccurate Jaccard scores for some state Standards Crosswalks. Any cached alignments, best-match tables, or state-to-Common-Core mappings should be recalculated.

Sources: [Release notes](https://docs.learningcommons.org/knowledge-graph/resources/release-notes), [Standards Crosswalks](https://docs.learningcommons.org/knowledge-graph/graph-reference/standards-crosswalks)

### 3. Update standards-tree UI logic

Use `hasChildren` in Academic Standards API responses to decide whether to show expand/collapse controls.

Source: [Release notes](https://docs.learningcommons.org/knowledge-graph/resources/release-notes)

### 4. Audit prerequisite/builds-towards direction

Make sure product copy, graph traversal, and UI labels reflect the clarified endpoint direction:

- Prerequisites = standards the target builds from.
- Builds-towards = standards for which the target is a prerequisite.

Source: [Release notes](https://docs.learningcommons.org/knowledge-graph/resources/release-notes)

### 5. Retest IM dependency logic

Earlier releases fixed the direction of `hasDependency` in IM content. v1.10.0 further cleans IM relationships and ensures `mutuallyExclusiveWith` is bidirectional.

Sources: [Release notes](https://docs.learningcommons.org/knowledge-graph/resources/release-notes), [Curriculum](https://docs.learningcommons.org/knowledge-graph/graph-reference/curriculum)

### 6. Tighten enum validation

v1.10.0 fixed IM `inLanguage` and `gradeLevel` values where they did not match enums. Strict validation should now be safer, but any local normalisation workarounds may need review.

Source: [Release notes](https://docs.learningcommons.org/knowledge-graph/resources/release-notes)

### 7. Refresh ELA attribution

If you store or display ELA Learning Components, refresh v1.10.0 data to pick up row-level license and attribution updates.

Source: [Release notes](https://docs.learningcommons.org/knowledge-graph/resources/release-notes)

---

## Product use cases enabled by the current graph

### 1. Standards-aware content tagging

A product can use semantic standards search and Learning Component search to map existing instructional content or assessments to relevant standards and granular skills.

Relevant sources:

- [Search academic standards](https://docs.learningcommons.org/api-reference/academic-standards/search-academic-standards)
- [Search learning components](https://docs.learningcommons.org/api-reference/learning-components/search-learning-components)
- [Learning components for a standard](https://docs.learningcommons.org/api-reference/learning-components/learning-components-for-a-standard)

### 2. Standards crosswalk and jurisdiction adaptation

A publisher with content aligned to Common Core Math can use Standards Crosswalks to identify related state standards, using Jaccard and Learning Component counts as explainable alignment evidence.

Relevant source: [Standards Crosswalks](https://docs.learningcommons.org/knowledge-graph/graph-reference/standards-crosswalks)

### 3. Teacher-facing instructional planning

A planning assistant could:

1. Resolve a standard.
2. Fetch Learning Components.
3. Identify prerequisite or follow-on standards.
4. Retrieve relevant curriculum scope-and-sequence metadata.
5. Suggest instructional focus areas.

Relevant sources:

- [MCP server](https://docs.learningcommons.org/knowledge-graph/using-knowledge-graph/mcp-server)
- [Learning Progressions](https://docs.learningcommons.org/knowledge-graph/graph-reference/learning-progressions)
- [API Reference overview](https://docs.learningcommons.org/api-reference/platform-api/overview)

### 4. Curriculum dependency visualisation

A tool can use the dependency-map endpoint to visualise prerequisite relationships between IM 360 lesson groupings.

Relevant source: [Dependency map for a curriculum](https://docs.learningcommons.org/api-reference/curriculum/dependency-map-for-a-curriculum)

### 5. Assessment and intervention design

Learning Components make broad standards actionable at the level of a lesson, activity, assessment item, or intervention target.

Relevant source: [Learning Components](https://docs.learningcommons.org/knowledge-graph/graph-reference/learning-components)

### 6. AI grounding and retrieval

The MCP server allows an AI assistant to ground responses in authoritative standards, Learning Components, and progressions rather than relying on general model memory.

Relevant source: [MCP server](https://docs.learningcommons.org/knowledge-graph/using-knowledge-graph/mcp-server)

---

## Known limitations and risks

### 1. Coverage is uneven

Math coverage is much more mature than ELA coverage. ELA Learning Components were introduced only in May 2026 and currently cover K–2.

Sources: [Release notes](https://docs.learningcommons.org/knowledge-graph/resources/release-notes), [Learning Components](https://docs.learningcommons.org/knowledge-graph/graph-reference/learning-components)

### 2. Crosswalks are not state-to-state

Standards Crosswalks are state → Common Core, not state → state.

Source: [Standards Crosswalks](https://docs.learningcommons.org/knowledge-graph/graph-reference/standards-crosswalks)

A state-to-state mapping would need to be inferred via Common Core or another intermediary, and that inference should be labelled as such.

### 3. Jaccard is useful but not sufficient

Jaccard similarity over Learning Component overlap is explainable and scalable, but it does not capture every nuance of standard language, assessment expectations, grade-level framing, or pedagogy.

Source for Jaccard design: [Standards Crosswalks](https://docs.learningcommons.org/knowledge-graph/graph-reference/standards-crosswalks)

### 4. Curriculum content is limited

The API exposes IM 360 scope-and-sequence metadata and alignments, but not lesson/activity/assessment instructional materials themselves.

Source: [API Reference overview](https://docs.learningcommons.org/api-reference/platform-api/overview)

### 5. API and data versioning differ

The API path is `/knowledge-graph/v0`, while data packages use semantic versions such as `v1.10.0`.

Sources: [API Reference overview](https://docs.learningcommons.org/api-reference/platform-api/overview), [Local files](https://docs.learningcommons.org/knowledge-graph/using-knowledge-graph/local-files)

Do not assume API version and data version are the same thing.

### 6. Release-note metadata inconsistencies

As noted above, the release notes and GitHub changelog have several version/date inconsistencies. This increases the importance of explicit version pinning, file hashes, and migration records.

Sources: [Release notes](https://docs.learningcommons.org/knowledge-graph/resources/release-notes), [GitHub CHANGELOG.md](https://github.com/learning-commons-org/knowledge-graph/blob/main/CHANGELOG.md)

---

## Roadmap signals

The roadmap lists current work as:

- Improving and adding API endpoints for more datasets.
- Adding tools to the MCP server and Claude connector.
- Aligning Math Learning Components to states for all 50 states.
- Aligning Math Crosswalks to states for all 50 states.
- Aligning ELA Learning Components to states for all 50 states.
- Updating standards frameworks to the latest versions across all subjects.

Source: [Roadmap](https://docs.learningcommons.org/knowledge-graph/understanding-knowledge-graph/roadmap)

Next items include:

- Supporting integration with coding agents.
- Improving integration with downloadable JSONL files.
- Adding EL Education Curriculum and OpenSciEd Curriculum to the Knowledge Graph.

Source: [Roadmap](https://docs.learningcommons.org/knowledge-graph/understanding-knowledge-graph/roadmap)

Later items include:

- Supporting agentic uses of the Knowledge Graph.
- Adding Math Misconceptions.
- Adding Durable Skill Frameworks.

Source: [Roadmap](https://docs.learningcommons.org/knowledge-graph/understanding-knowledge-graph/roadmap)

Interpretation:

Learning Commons appears to be moving from a dataset/library model toward an AI infrastructure model for education. The roadmap’s references to MCP, Claude connector, coding agents, and agentic uses suggest that the Knowledge Graph is intended to be used by both traditional applications and AI agents.

---

## Recommendations for teams evaluating or adopting the Knowledge Graph

### 1. Treat Learning Components as the core abstraction

The most powerful part of the model is not simply that it stores standards. It decomposes standards into Learning Components, which can then power:

- Crosswalks.
- Content tagging.
- Assessment alignment.
- Intervention design.
- AI planning.
- Standards comparison.

### 2. Keep exact standard text and granular skill data separate

A common implementation mistake would be to collapse standards and Learning Components into a single tag. Standards are formal jurisdictional statements; Learning Components are granular skill/concept abstractions. They serve different purposes.

### 3. Build with graph direction explicitly

Do not rely on relationship names alone. Store and test directionality for:

- `supports`
- `hasStandardAlignment`
- `buildsTowards`
- `hasDependency`
- `hasChild`

Direction matters for sequencing, explainability, and UI language.

### 4. Use Jaccard as an explainability feature

For crosswalks, expose not just the matched standard but also:

- Shared Learning Components.
- `sharedLCCount`
- `stateLCCount`
- `ccssLCCount`
- `jaccard`

This makes alignments more transparent and defensible.

### 5. Separate data ingestion from API usage

Use JSONL for reproducible offline processing and APIs for real-time lookups. Store explicit version metadata for both.

### 6. Preserve attribution

Every product display or redistribution path should preserve `license` and `attributionStatement`.

### 7. Expect coverage changes

State coverage, ELA grade-band coverage, and standards framework versions are actively changing. Design your product to show coverage gaps clearly rather than hiding them.

### 8. Re-run QA on every version update

At minimum:

- Count nodes by label.
- Count relationships by type.
- Check nulls in required fields.
- Check enum compliance.
- Diff standards alignments by jurisdiction.
- Diff crosswalk Jaccard scores.
- Diff Learning Component counts by subject and grade.

---

## Suggested QA queries for local JSONL ingestion

After ingesting `nodes.jsonl` and `relationships.jsonl`, run checks such as:

### Entity counts

```text
Count nodes by label:
- StandardsFramework
- StandardsFrameworkItem
- LearningComponent
- Course
- LessonGrouping
- Lesson
- Activity
- Assessment
- Material
```

### Relationship counts

```text
Count relationships by label:
- hasChild
- supports
- hasStandardAlignment
- buildsTowards
- relatesTo
- hasEducationalAlignment
- hasPart
- hasDependency
- mutuallyExclusiveWith
```

### Coverage checks

```text
For each jurisdiction:
- Number of StandardsFrameworkItems
- Number of LearningComponents supporting standards
- Number of hasStandardAlignment crosswalks to CCSSM
```

### Crosswalk sanity checks

```text
For each hasStandardAlignment:
- jaccard > 0
- sharedLCCount > 0
- jaccard = sharedLCCount / (stateLCCount + ccssLCCount - sharedLCCount)
```

### Directionality checks

```text
Verify:
- LearningComponent supports StandardsFrameworkItem
- State standard hasStandardAlignment CCSS standard
- Dependency source hasDependency target means target should come before source
```

### Attribution checks

```text
For redistributable/displayed entities:
- license is present
- attributionStatement is present
```

---

## Suggested implementation roadmap

### Phase 1: Discovery

- Read the release notes and graph reference.
- Download v1.10.0 JSONL files.
- Inspect node and relationship labels.
- Confirm target jurisdictions and subjects are covered.

Sources:

- [Release notes](https://docs.learningcommons.org/knowledge-graph/resources/release-notes)
- [Local files](https://docs.learningcommons.org/knowledge-graph/using-knowledge-graph/local-files)
- [Core concepts](https://docs.learningcommons.org/knowledge-graph/understanding-knowledge-graph/core-concepts)

### Phase 2: Prototype

- Build a local index of standards, Learning Components, and crosswalks.
- Use API semantic search for exploratory lookup.
- Build a simple standards → Learning Components → crosswalk flow.
- Validate attribution display.

Sources:

- [Search academic standards](https://docs.learningcommons.org/api-reference/academic-standards/search-academic-standards)
- [Search learning components](https://docs.learningcommons.org/api-reference/learning-components/search-learning-components)
- [Standards Crosswalks](https://docs.learningcommons.org/knowledge-graph/graph-reference/standards-crosswalks)

### Phase 3: Product integration

- Add standards-tree navigation using `hasChildren`.
- Add Learning Component decomposition.
- Add crosswalk explainability.
- Add curriculum lookup if IM 360 is relevant.
- Add MCP integration for AI workflows.

Sources:

- [Release notes](https://docs.learningcommons.org/knowledge-graph/resources/release-notes)
- [API Reference overview](https://docs.learningcommons.org/api-reference/platform-api/overview)
- [MCP server](https://docs.learningcommons.org/knowledge-graph/using-knowledge-graph/mcp-server)

### Phase 4: Operationalisation

- Pin data versions.
- Store hashes.
- Automate QA diffing.
- Monitor release notes and GitHub changelog.
- Rebuild indexes on every data release.
- Track coverage gaps by subject, state, and grade.

Sources:

- [Release notes](https://docs.learningcommons.org/knowledge-graph/resources/release-notes)
- [GitHub CHANGELOG.md](https://github.com/learning-commons-org/knowledge-graph/blob/main/CHANGELOG.md)
- [Roadmap](https://docs.learningcommons.org/knowledge-graph/understanding-knowledge-graph/roadmap)

---

## Open questions for Learning Commons

These would be worth clarifying before a production dependency:

1. **Checksums:** Will versioned JSONL exports publish checksums?
2. **Machine-readable changelog:** Will there be a structured release manifest with node/edge counts and breaking-change flags?
3. **Data/API compatibility:** Which data version backs the live API at any point in time?
4. **Release cadence:** Is there a predictable release schedule?
5. **Coverage reporting:** Will Learning Commons publish per-subject, per-grade, per-jurisdiction coverage matrices?
6. **Crosswalk confidence:** Are there recommended Jaccard thresholds for product use?
7. **State-to-state mapping:** Is a direct state-to-state crosswalk planned, or should products continue to infer via CCSS?
8. **ELA expansion:** What is the expected timeline for ELA beyond grades K–2?
9. **Additional curricula:** What is the expected access model for EL Education and OpenSciEd?
10. **MCP stability:** What stability guarantees, if any, apply to MCP tool names, schemas, and responses?

---

## Source list

Primary Learning Commons sources:

- [Release notes](https://docs.learningcommons.org/knowledge-graph/resources/release-notes)
- [Introduction](https://docs.learningcommons.org/knowledge-graph/understanding-knowledge-graph/introduction)
- [Core concepts](https://docs.learningcommons.org/knowledge-graph/understanding-knowledge-graph/core-concepts)
- [Roadmap](https://docs.learningcommons.org/knowledge-graph/understanding-knowledge-graph/roadmap)
- [Quickstart](https://docs.learningcommons.org/knowledge-graph/getting-started/quickstart)
- [Local files](https://docs.learningcommons.org/knowledge-graph/using-knowledge-graph/local-files)
- [REST API](https://docs.learningcommons.org/knowledge-graph/using-knowledge-graph/rest-api)
- [MCP server](https://docs.learningcommons.org/knowledge-graph/using-knowledge-graph/mcp-server)
- [Academic Standards](https://docs.learningcommons.org/knowledge-graph/graph-reference/academic-standards)
- [Learning Components](https://docs.learningcommons.org/knowledge-graph/graph-reference/learning-components)
- [Learning Progressions](https://docs.learningcommons.org/knowledge-graph/graph-reference/learning-progressions)
- [Standards Crosswalks](https://docs.learningcommons.org/knowledge-graph/graph-reference/standards-crosswalks)
- [Curriculum](https://docs.learningcommons.org/knowledge-graph/graph-reference/curriculum)
- [License](https://docs.learningcommons.org/knowledge-graph/resources/license)

API reference sources:

- [API Reference overview](https://docs.learningcommons.org/api-reference/platform-api/overview)
- [Search academic standards](https://docs.learningcommons.org/api-reference/academic-standards/search-academic-standards)
- [Learning components for a standard](https://docs.learningcommons.org/api-reference/learning-components/learning-components-for-a-standard)
- [Search learning components](https://docs.learningcommons.org/api-reference/learning-components/search-learning-components)
- [Dependency map for a curriculum](https://docs.learningcommons.org/api-reference/curriculum/dependency-map-for-a-curriculum)
- [Standards for a lesson](https://docs.learningcommons.org/api-reference/curriculum/standards-for-a-lesson)

GitHub sources:

- [Learning Commons Knowledge Graph repository](https://github.com/learning-commons-org/knowledge-graph)
- [GitHub CHANGELOG.md](https://github.com/learning-commons-org/knowledge-graph/blob/main/CHANGELOG.md)
- [GitHub releases](https://github.com/learning-commons-org/knowledge-graph/releases)

Related standards/source organisations:

- [1EdTech CASE Network](https://casenetwork.1edtech.org/)
- [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/)
- [Creative Commons CC0](https://creativecommons.org/publicdomain/zero/1.0/)
- [MIT License](https://opensource.org/license/mit)
- [Model Context Protocol](https://modelcontextprotocol.io/)