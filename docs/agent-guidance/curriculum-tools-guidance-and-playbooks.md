# Curriculum Tools, Guidance and Playbooks

## Purpose

- Clarify a clean separation between data-fetching tools and presentation guidance/playbooks.
- Provide deterministic, in-repo authored guidance specs and playbooks that clients execute (no server-side agentic orchestration).
- Offer a discoverable commands registry mapping slash-style commands to playbooks.

## Taxonomy

- **Categories**: `data` | `guidance` | `playbook` | `command`
- **Domain tags**: `curriculum`, `subjects`, `sequences`, `units`, `lessons`, `search`, `presentation`, `provenance`, `accessibility`, `ontology`.

## Cardinal Rule (Types and Validation)

- All constants, types, type guards, and Zod validators MUST flow from the Open Curriculum OpenAPI schema in the SDK and be generated at compile time via `pnpm type-gen`.
- No compatibility layers. No `as`/`any`/`!`/broad `Record<string, unknown>` shortcuts. Prefer literal-preserving data with `as const` only for data literals.
- Validate external inputs and authored fixtures at runtime with the generated Zod validators. Fail fast with helpful, contextual error messages.

## Deterministic Guidance

- Guidance specifications (e.g. `PresentationSpec@v1`) are JSON resources authored in-repo and versioned.
- Templates are Markdown resources referenced by guidance specs via `TemplateRef`.
- Guidance tools (e.g. `oak.guidance.getLessonPresentationSpec`) return validated guidance objects, without network access.

## Playbooks

- Playbooks (e.g. `FindLesson@v1`) define a deterministic sequence of steps: clarification questions → tool calls → aggregation → formatting.
- Steps are declarative; the client executes them. Servers do not perform agentic orchestration.
- Inputs/outputs are fully typed from schema-generated types; formatting references templates.

## Commands Registry

- Expose a read-only resource, e.g. `mcp://oak/commands/index.json`, mapping commands to playbooks:
  - `oak_find_lesson` → `FindLesson@v1`
- Enables client-side slash commands and discovery.

## Metadata on Tools (Descriptive only)

- Add intention-revealing descriptions, categories, tags, and optional metadata (stability, audience, determinism, pagination, caching, rate limits, errors taxonomy, examples, provenance requirements).
- Keep metadata strictly descriptive; do not add runtime logic here.

## Testing Strategy (Brief)

- TDD. Prefer pure functions and unit tests. No IO in unit/integration tests. Simple injected fakes only.
- Validate guidance/playbooks with generated Zod. Integration tests import server registration code to assert metadata presence and formatting outcomes (required headings, provenance links).

## Example Flow

1. User triggers `/oak_find_lesson find me lessons about Vikings`.
2. Client resolves `oak_find_lesson` via commands registry → `FindLesson@v1`.
3. Client executes playbook:
   - Ask clarification questions (audience, key stage, year).
   - Call `oak.data.searchLessons` with clarified parameters.
   - Aggregate results and fetch `oak.guidance.getSearchResultsPresentationSpec`.
   - Render Markdown using referenced template, including provenance and accessibility sections.

## Quality Gates

- After relevant changes, run from repo root: `pnpm i`, `pnpm type-gen`, `pnpm build`, `pnpm type-check`, `pnpm lint -- --fix`, `pnpm -F @oaknational/curriculum-sdk docs:all`, `pnpm format`, `pnpm markdownlint`, `pnpm test`, `pnpm test:e2e` (when appropriate).
