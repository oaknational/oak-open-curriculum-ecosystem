## Plan: Curriculum Data vs Guidance Tools, Playbooks, and Commands

### Intent

- Clarify and enforce a clean separation between curriculum data-fetching tools and presentation guidance/instruction tools.
- Provide deterministic, in-repo authored guidance specifications and playbooks (process definitions) that consuming agents execute without any server-side agentic orchestration.
- Introduce a discoverable commands registry mapping slash-style commands to playbooks and supporting templates.
- Improve tool discoverability via richer metadata (category, tags, stability, audience, constraints) and enhance descriptions to set accurate expectations.
- Maintain strict type discipline: all static structures and validators generated from OpenAPI via `pnpm type-gen` per the Cardinal Rule.
- Adhere to TDD, repository testing strategy, and quality gates.

### Grounding

Read and follow:

- `./.agent/directives-and-memory/AGENT.md` and linked references
- `./.agent/directives-and-memory/rules.md`
- `./docs/agent-guidance/testing-strategy.md`

Adjust the todo list if anything changes.

### Structure the Todo List

The following tasks are atomic, actionable, and aligned to the intent. Each `ACTION:` is followed by a `REVIEW:` self-review. Every third task is a `GROUNDING:` reminder. Quality gates are invoked regularly.

#### Phase 0 – Project grounding and scope confirmation

1. ACTION: Re-read `AGENT.md`, `rules.md`, and `testing-strategy.md` to confirm constraints and practices.
2. REVIEW: Confirm understanding: no server-side agentic workflows; caller runs playbooks; all types via type-gen; tests avoid network.
3. GROUNDING: read GO.md and follow all instructions
4. QUALITY-GATE: From repo root run: `pnpm i`, `pnpm type-gen`, `pnpm build`, `pnpm type-check`, `pnpm lint -- --fix`, `pnpm -F @oaknational/oak-curriculum-sdk docs:all`, `pnpm format`, `pnpm markdownlint`, `pnpm test`, `pnpm test:e2e`.

#### Phase 1 – SDK: OpenAPI schemas and type generation ✅ COMPLETED

5. ✅ ACTION: Add OpenAPI module `PresentationGuidance@v1` defining: `PresentationSpec` (requiredHeadings, requiredNotices, templates, linkPolicy, provenancePolicy, accessibilityChecklist), specializations `LessonPresentationSpec` and `SearchResultsPresentationSpec`.
6. ✅ REVIEW: Ensured schema is minimal yet expressive; enumerations and literals preserve type information (use `as const` data in fixtures; no type assertions in code).
7. ✅ GROUNDING: read GO.md and followed all instructions
8. ✅ ACTION: Add OpenAPI module `Playbook@v1` defining: `Playbook` (id, version, inputs, questions), `Step` union (`ask` | `toolCall` | `aggregate` | `format`), light `Condition` language (`missing(x)`, equality), `TemplateRef`, and `Outputs` contract.
9. ✅ REVIEW: Validated schema supports clarification loop and deterministic execution by caller without embedding LLM prompts in code (prompts referenced as templates).
10. ✅ QUALITY-GATE: Full quality gate sequence passed from repo root.

#### Phase 2 – Author guidance specs and templates in-repo

11. ACTION: Author initial guidance fixtures for `lesson` and `searchResults` (JSON) plus markdown templates; store under a dedicated package or within app resources as appropriate, ensuring they are loaded without network access.
12. REVIEW: Check that provenance rules require links to original Oak resources and that accessibility checklist items are actionable.
13. GROUNDING: read GO.md and follow all instructions
14. QUALITY-GATE: Run full quality gate sequence from repo root.

#### Phase 3 – Metadata strategy and tool taxonomy

15. ACTION: Define canonical tool categories and tags: categories = `data.simple | data.complex | guidance.presentation | guidance.ontology | playbook | command` and domain tags (e.g., `curriculum`, `lessons`, `units`, `sequences`, `search`, `presentation`, `provenance`, `accessibility`, `educational-context`, `content-sensitivity`). Draft a metadata interface for tool registration including optional fields (stability, audience, input/output examples, caching, rateLimitPolicy, determinism, requiresNetwork, provenanceRequired, multiCallComplexity, etc.).
16. ACTION: Define criteria for tool categorization: `data.simple` = direct OpenAPI endpoint facades (single API call); `data.complex` = tools requiring multiple API calls to join/aggregate data (e.g., get lesson with assets, get unit with lessons); `guidance.presentation` = in-repo authored presentation specs and templates (no API calls); `guidance.ontology` = schema-derived metadata and documentation (no API calls).
17. REVIEW: Verify metadata fields align with MCP spec and do not introduce runtime logic; ensure descriptions are intention-revealing and concise, clearly indicating whether tools are facades, complex data joiners, or guidance providers.
18. GROUNDING: read GO.md and follow all instructions
19. QUALITY-GATE: Run full quality gate sequence from repo root.

#### Phase 4 – MCP servers: tools, resources, and metadata

20. ACTION: In `apps/oak-curriculum-mcp-stdio` and `apps/oak-curriculum-mcp-streamable-http`, update existing curriculum tools to be exposed as `oak.data.simple.*` or `oak.data.complex.*` as appropriate, add clear descriptions, categories, tags, and optional metadata fields (stability, determinism, pagination, caching, rate limits, errors, multiCallComplexity, etc.). Maintain non-breaking aliases if needed.
21. REVIEW: Confirm no server-side agentic orchestration is introduced; the tools remain stateless data fetchers; verify complex tools are properly categorized with multiCallComplexity metadata.
22. GROUNDING: read GO.md and follow all instructions
23. ACTION: Implement `oak.guidance.presentation.getLessonPresentationSpec` and `oak.guidance.presentation.getSearchResultsPresentationSpec` tools that return the authored, validated guidance objects (no external API).
24. ACTION: Implement `oak.guidance.ontology.getOntology` tool that returns schema-derived ontology metadata (no external API calls beyond SDK schema parsing).
25. REVIEW: Validate guidance tool outputs with generated Zod validators; fail fast with informative errors if invalid; ensure ontology tool includes schema reference metadata.
26. QUALITY-GATE: Run full quality gate sequence from repo root.

#### Phase 5 – Playbooks and commands registry

27. ACTION: Implement `oak.playbooks.get` tool returning `FindLesson@v1` playbook. The playbook defines: clarification questions (audience, keyStage, etc.), steps to call `oak.data.simple.searchLessons`, aggregation, fetching `oak.guidance.presentation.getSearchResultsPresentationSpec`, and a `format` step referencing a markdown template.
28. REVIEW: Ensure deterministic behavior; inputs and outputs are fully typed; no network beyond curriculum data tools when executed by the caller.
29. GROUNDING: read GO.md and follow all instructions
30. ACTION: Add a read-only resource `mcp://oak/commands/index.json` mapping `oak_find_lesson` → `FindLesson@v1` with summary and hints.
31. REVIEW: Confirm resource discoverability and that clients can wire slash commands to playbooks via this index.
32. QUALITY-GATE: Run full quality gate sequence from repo root.

#### Phase 6 – Documentation and examples

33. ACTION: Add a new document under `docs/agent-guidance/` covering categories, tags, how to consume playbooks/guidance, and an example `/oak_find_lesson find me lessons about Vikings` flow; add a link to it from `AGENT.md`.
34. REVIEW: Ensure docs reflect no server-side agentic activity and point to the commands registry.
35. GROUNDING: read GO.md and follow all instructions
36. ACTION: Update app READMEs with grouped tool tables (data.simple vs data.complex vs guidance.presentation vs guidance.ontology vs playbooks vs commands), metadata fields, and example calls showing the distinction between facade tools (single API calls), complex tools (multiple API calls), and guidance tools (no API calls).
37. REVIEW: Cross-check descriptions with tool registration to avoid drift.
38. QUALITY-GATE: Run full quality gate sequence from repo root.

#### Phase 7 – Testing per repository strategy

39. ACTION: Unit tests for schema validators (guidance and playbooks), plus pure helpers (template interpolation, condition evaluation).
40. REVIEW: Confirm no network and no I/O in unit tests; use pure data fixtures.
41. GROUNDING: read GO.md and follow all instructions
42. ACTION: Integration tests importing server registration code to verify: tool metadata presence (categories, tags), guidance validation, playbook contract, and formatting output contains required headings and provenance links using mocks.
43. REVIEW: Validate that integration tests remain in-process and do not start servers; only simple injected mocks are used; test both simple and complex data tools appropriately.
44. QUALITY-GATE: Run full quality gate sequence from repo root.

#### Phase 8 – Optional metadata and observability polish

45. ACTION: Add strictly standards-compliant, optional metadata fields where useful (stability, audience, expectedLatencyMs, cache, rateLimitPolicy, determinism, pagination, errors taxonomy, licensing, contentNotices, accessibility hints, debugExampleSession, multiCallComplexity).
46. REVIEW: Ensure metadata is consistent across stdio and streamable-http servers and documented in AGENT.md; verify multiCallComplexity is properly indicated for complex tools.
47. GROUNDING: read GO.md and follow all instructions
48. QUALITY-GATE: Run full quality gate sequence from repo root.

#### Phase 9 – Final acceptance

49. ACTION: Verify acceptance criteria (below) and tidy any discrepancies.
50. REVIEW: Self-review against `rules.md`, verify types flow from type-gen, no unsafe type assertions, and tests follow strategy; confirm all tool categories are properly implemented and distinguished.
51. QUALITY-GATE: Run full quality gate sequence from repo root.

#### Phase 10 – Ontology tool and schemas

52. ACTION: Add OpenAPI module `Ontology@v1` defining: `Ontology` (entities[], relationships[]), `Entity` (id, label, definition, keyFields, enums?), `Relationship` (source, target, type, label, cardinality), and `Enumeration` (id, values). Generate validators via `pnpm type-gen`.
53. REVIEW: Ensure ontology schema reflects SDK domain (Subjects, Sequences, Units, Lessons, Threads, Categories, Assets, KeyStages, Phases, Years, Quizzes, Transcripts, SearchResults, ContentGuidance, EducationalMetadata) and enumerations (KeyStageSlug, AssetType, QuestionType, AnswerFormat, SubjectSlug, ContentGuidanceArea, SupervisionLevel).
54. GROUNDING: read GO.md and follow all instructions
55. ACTION: Implement MCP tool `oak.guidance.ontology.getOntology` that returns the authored ontology JSON (validated); tag as `guidance.ontology`, `documentation`, `ontology`.
56. REVIEW: Validate tool output with generated validators; ensure deterministic, versioned (`v1`).
57. QUALITY-GATE: Run full quality gate sequence from repo root.
58. ACTION: Document the new tool in `AGENT.md` and add an optional command mapping `oak_get_ontology` → `getOntology` in the commands registry resource.
59. REVIEW: Confirm discoverability and example usage in docs and READMEs.
60. QUALITY-GATE: Run full quality gate sequence from repo root.

### Acceptance Criteria

- Tool taxonomy: simple data tools as `oak.data.simple.*` (direct API facades); complex data tools as `oak.data.complex.*` (multi-API-call joiners); presentation guidance as `oak.guidance.presentation.*` (in-repo authored specs); ontology guidance as `oak.guidance.ontology.*` (schema-derived metadata); playbook retrieval as `oak.playbooks.get`; commands registry resource present.
- Descriptions and tags: every tool/resource has clear, intention-revealing descriptions and category/domain tags; ontology metadata present on relevant tools.
- Guidance specs: authored in-repo, versioned (v1), validated at runtime using generated validators; include required headings, notices, provenance/link policy, and accessibility checklist.
- Playbook `FindLesson@v1`: includes clarification loop, multiple tool calls, aggregation, and formatting via template; deterministic, typed inputs/outputs.
- Commands registry: `oak_find_lesson` mapped to `FindLesson@v1` with summary; discoverable via MCP resource; `oak_get_ontology` maps to `getOntology@v1`.
- Ontology: OpenAPI `Ontology@v1` exists; MCP tool `oak.guidance.getOntology` returns validated ontology definitions; static MCP resources available; examples included.
- Tool outputs: optional ontology/provenance annotations (`_nodeType`, `_nodeId`, `_provenance`, `_related`, `_schemaRefs`, `_ontologyRefs`) added non-breaking to relevant responses.
- Tests: unit and integration tests pass without network calls; formatting results include required headings and provenance links.
- Documentation: `AGENT.md` and app READMEs updated; examples included; manual vs auto-derived and generic vs Oak-specific separation documented.
- Quality gates: All passes from repo root after each phase and at final acceptance.

### Risks and Mitigations

- Scope creep in schemas → Keep schemas minimal; iterate versions (`v1`) and resist embedding prompt logic in code.
- Metadata drift across servers → Centralize metadata constants where feasible; add integration test to assert tags/categories.
- Template coupling → Reference templates via `TemplateRef` and expose stable resources; add tests for required sections.
- Type safety regressions → Enforce type-gen, no type assertions; validate all external inputs/fixtures via Zod.

### Notes

- No server-side orchestration: playbooks are executed by the caller/agent; servers only provide deterministic tools/resources.
- Tests must not perform network I/O; curriculum SDK/network calls should be mocked in tests.
- Provenance is mandatory in guidance for search/lesson presentation.

### How the ontology supports the plan intent

- Separation of data vs guidance tools
  - Ontology provides clear entity boundaries (Subject, Sequence, Unit, Lesson, Asset, Quiz, Answer, ContentGuidance, EducationalMetadata) used by `oak.data.simple.*` and `oak.data.complex.*` tools, while PresentationSpec lives in `oak.guidance.presentation.*` and ontology metadata in `oak.guidance.ontology.*`. The graph clarifies provenance edges (e.g., Lesson → Asset) that guidance tools must reference but never fetch.
- Deterministic guidance and playbooks
  - Ontology enumerates inputs/outputs and relations used by playbooks (e.g., Sequence → Unit → Lesson → ContentGuidance). Steps are data-graph traversals plus formatting, making the process deterministic and testable. Enhanced with educational context (prior knowledge, curriculum alignment) and content sensitivity classification.
- Commands registry and playbook discoverability
  - Ontology defines the target nodes/edges for each command (e.g., find lessons → traverse Subject/KeyStage/Year → Lessons → ContentGuidance), enabling concise, discoverable playbooks and command descriptions with rich metadata.
- Richer metadata and tool descriptions
  - Category/domain tags map to ontology nodes/edges (e.g., `search`, `lessons`, `provenance`, `presentation`, `content-sensitivity`, `educational-context`), improving agent routing. Coverage edges (Subject ↔ KeyStage/Year) inform filter metadata, with additional search and sensitivity relationships.
- Type discipline and validators
  - Entities and relationships are tied to explicit schema references in the [Curriculum Ontology](docs/architecture/curriculum-ontology.md), generating types/validators at type-gen. Canonicalization rules (e.g., Year, AnswerFormat) ensure consistent internal types without assertions. Enhanced with comprehensive subject enumeration and content guidance classifications.

## Curriculum Ontology Reference

The comprehensive curriculum ontology is maintained as a separate architecture document at `docs/architecture/curriculum-ontology.md`. This document includes:

- **Schema index** mapping all OpenAPI schemas to ontology entities
- **Entity definitions** with key fields, relationships, and schema references
- **Enumerations and constraints** derived from the OpenAPI schema
- **Type canonicalization rules** for consistent data handling
- **Relationship diagrams** showing entity connections
- **Graph extraction opportunities** for advanced use cases
- **Information sources and separation** (manual vs auto-derived, generic vs Oak-specific)

The ontology is automatically derived from the OpenAPI schema via `pnpm type-gen` and provides the foundation for all curriculum tools, ensuring type safety and consistent domain understanding across implementations.

The ontology document also includes concepts not present in the current schema, implementation guidance for surfacing ontology in MCP tools, and details about manual vs auto-derived content. See the [full ontology document](docs/architecture/curriculum-ontology.md) for complete details.
