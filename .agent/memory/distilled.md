---
fitness_ceiling: 200
split_strategy: "Extract settled entries to permanent docs (ADRs, governance, READMEs); this is the specialist refinement layer"
---

# Distilled Learnings

Hard-won rules extracted from napkin sessions. Read this
before every session. Every entry earned its place by
changing behaviour.

**Source**: Distilled from `archive/napkin-2026-02-24.md`
(sessions 2026-02-10 to 2026-02-24),
`archive/napkin-2026-02-28.md` (sessions 2026-02-26 to
2026-02-28), and `archive/napkin-2026-03-02.md` (sessions
2026-02-28 to 2026-03-02), and
`archive/napkin-2026-03-05.md` (sessions 2026-03-02 to
2026-03-05), and `archive/napkin-2026-03-07.md` (sessions
2026-03-05 to 2026-03-07).

**Permanent documentation**: Many entries have graduated to
permanent docs. See TypeScript Practice, Testing Strategy,
CONTRIBUTING.md, Troubleshooting, Development Practice, and
widget-rendering.md for settled patterns. What remains here
is agent-operational, domain-specific, or not yet mature
enough for permanent documentation.

---

## User Preferences

- British spelling, grammar, and date formats
- Plans must be **discoverable** (linked from README,
  roadmap, AND session prompt)
- Plans must be **actionable** (status tracking tables,
  completion checklists, resolved open questions)
- Archive docs are historical records — never update them
- When a plan is blocking a merge, simplify ruthlessly —
  do minimum to unblock CI, capture rest as future work
- Listen to user priorities, not document structure
- Try it before assuming it will not work
- Risk acceptance is a human decision. Agents classify
  severity and describe impact; agents do not accept risks
  or defer items on behalf of the owner
- Onboarding simulations must be discovery-based: start at
  README.md only, no prescribed reading list, no access to
  the onboarding planning documents. Describe personas by
  their motivations ("anxious about looking foolish",
  "sceptical by default"), not by focus areas

## Repo-Specific Rules

- ADR index is the source of truth for ADR count; keep
  README in sync
- From `packages/sdks/oak-curriculum-sdk/`, repo root is
  `../../../` not `../../`
- `@oaknational` is confirmed npm org scope (no token yet)
- `src/bulk/generators/` duplicates `vocab-gen/generators/`
  files — both must be updated in parallel until resolved.
  Post-merge plan: decompose `sdk-codegen` into two workspaces
  (see `.agent/plans/architecture-and-infrastructure/codegen/`)
- Always add new public exports to the barrel file
  (`src/mcp-tools.ts`) — missing barrel exports cause
  `undefined` at runtime for `instanceof` checks
- Generated vocab files at `src/generated/vocab/` need
  `pnpm vocab-gen`, not `pnpm sdk-codegen`
- MCP tool counts: see ADR-123 for the canonical figure.
  Always distinguish generated vs aggregated (ADR-029/030)

## TypeScript (Domain-Specific)

- `TSESLint.FlatConfig.Plugin` from `@typescript-eslint/utils`
  bridges the `Rule.RuleModule` vs `TSESLint.RuleModule`
  gap — eliminates `as unknown as ESLint.Plugin['rules']`
- `@typescript-eslint/no-restricted-imports` `group` patterns
  use minimatch: `*` matches one path segment (not `/`),
  `**` matches zero or more segments. Use `**` for deep
  sub-path coverage
- `isSubject()` then fallback for `AllSubjectSlug` to
  `SearchSubjectSlug` mapping (KS4 variants)
- Zod `.passthrough()` deprecated in Zod v4 — use `.loose()`

## Elasticsearch

- ES client v9: `document` not `body` for `client.index()`
- ES client v9: spread readonly arrays before passing to
  mutable params (`[...synonymSet.synonyms_set]`)
- `extractStatusCode` centralises ES error code extraction
  without assertions
- Classify network errors by `error.name` (e.g.
  `'AbortError'`, `'TypeError'`), not `error.message` —
  `message.includes('abort')` is too broad
- `isPlainObject` type guard satisfies both
  `IndicesIndexSettings` and `MappingTypeMapping`
- EsCurric MCP API key needs `feature_actions.read` Kibana
  privilege (in addition to `feature_agentBuilder.read`) for
  the `platform_core_search` tool to work

## Testing (Domain-Specific)

- `ensurePathsOnSchema` creates a new object (spread) —
  use `toStrictEqual` not `toBe` for structural equality
- `server.e2e.test.ts` has a hardcoded aggregated tools
  list — must be updated when adding new aggregated tools
- When moving files between workspaces, check whether
  removed tests should be recreated in the destination
- Capturing calls in a typed array (`const calls: T[] = []`)
  beats `vi.fn().mock.calls` which leaks `any`
- Keep E2E assertions on system/transport invariants; prove
  runtime stub semantics in SDK unit/integration tests, not
  by asserting server output against the same stub path

## Documentation (Agent Operational)

- Session prompts in `.agent/prompts/` should be updated
  at end of each session, not just napkin
- `process.env.X = value` with trailing space in backticks
  triggers MD038
- Blank line between two blockquotes triggers MD028

## MCP Apps (Domain-Specific)

- `@modelcontextprotocol/ext-apps` `^1.2.0` with server helpers
  from `@modelcontextprotocol/ext-apps/server` is the canonical
  migration vehicle for C4/C5/C6. See
  `.agent/plans/sdk-and-mcp-enhancements/mcp-apps-support.research.md`
  for host-specific behaviour (ChatGPT, Claude sandbox domains,
  `_meta.ui.domain`).
- `_meta.ui.domain` only needed for direct cross-origin `fetch()`
  from the iframe; omit if data flows through MCP bridge.
- **Four MCP guidance surfaces must agree** when a
  multi-tool workflow changes: tool `description`, workflow
  data (flows to `get-curriculum-model` + resources), doc
  resources, and prompt messages. Tool descriptions are
  highest leverage — per MCP spec, tools are model-controlled
  via `description`.

## Architecture (Domain-Specific)

- **Response augmentation is best-effort**: canonical URL
  decoration must NEVER fail the API call. Wrap `augmentBody()`
  in try-catch. Middleware factory requires `Logger` (DI);
  `BaseApiClient` provides `createNoopLogger()`. Pure
  augmentation functions throw or return errors; the
  middleware boundary logs.
- When a directive review reveals significant work, update
  the plan BEFORE coding
- When a pre-existing eslint override exists in a file you
  touch, fix the root cause (DRY/split)
- Aggregated tools return `Promise<CallToolResult>` directly
  — they do NOT go through `ToolExecutionResult`
- `AggregatedToolName` type derives from
  `keyof typeof AGGREGATED_TOOL_DEFS`
- search-sdk → curriculum-sdk dependency is banned (ADR-108).
  Shared data lives in `@oaknational/sdk-codegen/synonyms`.
  `SearchRetrievalService` in curriculum-sdk is ISP, not
  duplication
- When removing an entry from `LIB_PACKAGES`, check ALL
  packages that called `createLibBoundaryRules` with that
  name — zone uses `../${otherLib}/**` relative paths
- When splitting a core package with runtime deps: schemas
  stay in core, runtime pipeline moves to libs. No
  re-exports, no compatibility layer.
- Progressive ESLint re-enablement: narrow overrides from
  directory-wide to file-specific first
- When extracting types from a composition root, the root
  may still need a local `import type` for its own usage
- For security metadata, enforce invariants at startup/load
  boundaries and fail hard with remediation guidance

## Troubleshooting (Agent-Specific)

| Symptom | Fix |
|---------|-----|
| Grep tool fails with cursorignore errors | Use `rg` in shell with `2>/dev/null` |
| StrReplace fails on plan files | Unicode quotes (U+2019, U+201C/D) block matching |
| Reviewer reports G1 failures that seem wrong | Re-run specific gates to verify — reviewers may read stale output |
| `--testPathPattern` fails in vitest v4 | Use file paths as positional args: `pnpm vitest run path/to/test.ts` |
| Reviewer flags repo name mismatch | False positive — confirmed three times. Always verify against user's disposition |
| Onboarding reviewer claims files do not exist | Always verify with `glob` or `ls` — reviewers produce consistent false positives |
| Background reviewer agents not returned | Lost at end of conversation turn — re-invoke in next session |
| MCP tool call fails with wrong param type | Always read tool descriptors before calling — parameter types are explicit in schema |
| Commitlint rejects commit with uppercase acronym in subject | `subject-case` rule rejects e.g. `ADR-130`. Use lowercase: "complete blue/green lifecycle" not "ADR-130 Phases 3-8d" |
| Pre-commit hook output too large to read | Turbo replays all cached logs. Redirect to file and read the end for the actual error |
