---
fitness_line_target: 200
fitness_line_limit: 275
fitness_char_limit: 16500
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs (ADRs, governance, READMEs); this is the specialist refinement layer"
---

# Distilled Learnings

Hard-won rules extracted from napkin sessions. Read this before every session.
Every entry earned its place by changing behaviour.

**Source**: Distilled from archived napkins
`napkin-2026-02-24.md` through `napkin-2026-04-01.md`
(sessions 2026-02-10 to 2026-04-01).

**Permanent documentation**: Entries graduate to permanent
docs when stable and a natural home exists. Always graduate
useful understanding — fitness management handles the
consequences. What remains here is repo/domain-specific
context with no natural permanent home.

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

## Fitness Management

- **Char limit is the honest volume constraint**: after wrapping
  prose to 100 chars, line count inflates from short lines, headers,
  blank lines. The char limit tracks actual content volume regardless
  of formatting choices. Use it as the primary volume metric.
- **Graduation and fitness are separate concerns**: step 7
  (graduate) asks "stable? natural home?" Step 8 (fitness) asks
  "too full?" Graduate first, then manage fitness consequences.
  Never block graduation because a target is tight.
- **User feedback is the correction signal**: when user feedback
  contradicts a napkin entry, apply the feedback fully. Do not
  negotiate a compromise with the original incorrect framing.

## Architecture (Agent Infrastructure)

- **ADR-125 thin wrapper scope**: the thin wrapper contract applies
  to platform adapters wrapping canonical content, NOT to canonical
  command-to-skill relationships. Commands and skills are sibling
  Layer 1 artifacts. A "thick" orchestrating command is sound per
  ADR-135's process_executor example.
- **ADR-135 naming deviation**: new agents use `-reviewer` suffix
  despite ADR-135 deciding to drop it. Acknowledged tech debt;
  batch rename committed.
- **Provenance is storytelling, not credit**: "Think less boardroom,
  more Dreamtime." Both repos appear in the chain because both are
  part of the knowledge journey.

## Repo-Specific Rules

- Elasticsearch: `oaksearch admin validate-aliases` proves alias **topology**
  only; `admin count` reports true parent docs. Do not equate green alias
  health with bulk freshness — see
  `apps/oak-search-cli/docs/INDEXING.md` (*Operational CLI* section).
- From `packages/sdks/oak-curriculum-sdk/`, repo root is
  `../../../` not `../../`
- `@oaknational` is confirmed npm org scope (no token yet)
- `src/bulk/generators/` duplicates `vocab-gen/generators/`
  files — both must be updated in parallel until resolved.
  **Decomposition**: strategic plan at
  `.agent/plans/architecture-and-infrastructure/codegen/future/`
  `sdk-codegen-workspace-decomposition.md`
  (M1 prerequisite satisfied, awaiting promotion).
  Turbo overrides are temporary — see ADR-065.
- **Zod 4 `.meta({ examples })` opportunity**: in Zod 3, OpenAPI
  `examples` are lost in the pipeline. Zod 4's `.meta()` attaches
  arbitrary metadata that `z.toJSONSchema()` preserves. Could
  eliminate `preserve-schema-examples.ts` when adopted.
- Always add new public exports to the barrel file
  (`src/mcp-tools.ts`) — missing barrel exports cause
  `undefined` at runtime for `instanceof` checks
- Generated vocab files at `src/generated/vocab/` need
  `pnpm vocab-gen`, not `pnpm sdk-codegen`
- MCP tool counts: see ADR-123 for the canonical figure.
  Always distinguish generated vs aggregated (ADR-029/030)

## TypeScript (Domain-Specific)

Graduated to `docs/governance/typescript-practice.md`:
Zod v4 `.loose()`, `TSESLint.FlatConfig.Plugin`,
`no-restricted-imports` minimatch, `localeCompare` divergence,
`vi.fn()` bare mock assignability, `void` return trick.

## Elasticsearch

- ES client v9: `document` not `body` for `client.index()`
- ES client v9: spread readonly arrays before passing to
  mutable params (`[...synonymSet.synonyms_set]`)
- Classify network errors by `error.name` (e.g.
  `'AbortError'`, `'TypeError'`), not `error.message` —
  `message.includes('abort')` is too broad
- EsCurric MCP API key needs `feature_actions.read` Kibana
  privilege (in addition to `feature_agentBuilder.read`) for
  the `platform_core_search` tool to work
- ES Serverless shifts `_primary_term` during normal
  operation; OCC-based updates (lease renewal) must retry
  after fetching fresh `_seq_no`/`_primary_term` on 409
- Lifecycle wrappers (`withLifecycleLease`) must return the
  execution result when execution succeeds, even if the
  side-channel (renewal) failed — leases are defence-in-depth

## Testing (Domain-Specific)

Graduated to `testing-strategy.md`: E2E assertion placement,
RED spec file-naming (`*.e2e.test.ts` not `*.unit.test.ts`).
Graduated to `development-practice.md`: file-move test checks.

- `ensurePathsOnSchema` creates a new object (spread) —
  use `toStrictEqual` not `toBe` for structural equality
- `server.e2e.test.ts` has a hardcoded aggregated tools
  list — must be updated when adding new aggregated tools
- Capturing calls in a typed array (`const calls: T[] = []`)
  beats `vi.fn().mock.calls` which leaks `any`

## Documentation

Graduated to `docs/governance/development-practice.md`:
plan artefact path grepping, external docs research,
session prompt updates, checkpoint/worktree separation,
file-move test recreation, response augmentation best-effort.

Graduated to `docs/operations/troubleshooting.md`:
Codex reviewer resolution.

## Build System (Domain-Specific)

- Turbo dependency model: ADR-065 (items 6–7)
- `pnpm qg` is the canonical read-only gate set, but does
  not include static-analysis sweeps (`pnpm knip`,
  `pnpm depcruise`) unless a plan explicitly requires them
- Empty directories persist after file deletion — always
  rmdir after deleting the last file. The portability
  validator checks for SKILL.md presence, so empty skill
  directories without SKILL.md cause false positives.

## Architecture (Domain-Specific)

Graduated to permanent docs: plans before code, ESLint
progressive re-enablement, response augmentation best-effort
(development-practice.md), security metadata enforcement
(safety-and-security.md).

- Aggregated tools return `Promise<CallToolResult>` directly
  — they do NOT go through `ToolExecutionResult`
- `AggregatedToolName` type derives from
  `keyof typeof AGGREGATED_TOOL_DEFS`
- ADR-108 bans search-sdk → curriculum-sdk dependency.
  Shared data lives in `@oaknational/sdk-codegen/synonyms`
- When removing an entry from `LIB_PACKAGES`, check ALL
  packages that called `createLibBoundaryRules` with that
  name — zone uses `../${otherLib}/**` relative paths
- When splitting a core package with runtime deps: schemas
  stay in core, runtime pipeline moves to libs
- When extracting types from a composition root, the root
  may still need a local `import type` for its own usage

## Troubleshooting

Graduated to `docs/operations/troubleshooting.md`:
StrReplace unicode quotes, reviewer false positives,
CI Turbo cache staleness, pre-commit output/blocking,
ESLint complexity with `??`/`?.`, background reviewer
agents, MCP tool call param types, commitlint rejections,
worktree agent patches, Codex reviewer resolution,
`git merge --abort` staging loss, `pnpm format:root`
after merge, Turbo `--force` reproduce-first.
