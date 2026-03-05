# Documentation Audit Report

**Date**: 2026-02-14
**Produced by**: WS0 of the
[Developer Onboarding Experience Plan](../plans/semantic-search/active/developer-onboarding-experience.plan.md)

---

## Purpose

This report catalogues every non-archived markdown file in the
repository, classifies each file's status, lists specific issues, and
recommends actions. It does **not** fix anything -- fixes come in
WS1-WS6.

**Exclusions**: `node_modules/`, `dist/`, `.turbo/`, all `archive/`
directories, generated API docs
(`packages/sdks/oak-curriculum-sdk/docs/api-md/`),
`.agent/experience/`.

---

## 1. Root Files

| File | Purpose | Status | Action |
| --- | --- | --- | --- |
| `README.md` | Primary public entry point | Current | Keep as-is |
| `CONTRIBUTING.md` | Contributor policy, Node 24.x, Result pattern | Current | Keep as-is |
| `CHANGELOG.md` | Change record; notes prior oak-notion-mcp entries do not apply | Current | Keep as-is |
| `GO.md` | Legacy grounding document for task planning | Partially stale | Update or delete (see cross-cutting theme 1) |
| `AGENTS.md` | Pointer to AGENT.md | Current | Keep as-is |
| `CLAUDE.md` | Pointer to AGENT.md | Current | Keep as-is |
| `GEMINI.md` | Pointer to AGENT.md | Current | Keep as-is |
| `BRANDING.md` | Trademark and branding notice | Current | Keep as-is |
| `LICENCE-DATA.md` | Upstream data licence notice (OGL) | Current | Keep as-is |
| `LICENCE` | MIT licence (note: no `.md` extension) | Current | Keep as-is |

### Issues

- **GO.md**: Still referenced in AGENT.md ("Read GO.md every 6th-ish
  task"), `docs/README.md`, `docs/foundation/quick-start.md`,
  `docs/foundation/onboarding.md`, and several `.agent/` files. The
  GO.md grounding pattern is superseded by AGENT.md + directives.
  Decision needed: delete GO.md and remove all references, or keep
  and add a note that it complements AGENT.md.

---

## 2. docs/ Top-Level

| File | Purpose | Status | Action |
| --- | --- | --- | --- |
| `docs/README.md` | Documentation index and navigation | Partially stale | Update -- remove GO.md link |
| `docs/onboarding.md` | Compatibility redirect to `foundation/onboarding.md` | Stale | **Delete** (clean break per plan directive) |
| `docs/foundation/quick-start.md` | Fast-track developer guide | Partially stale | Update -- fix `pnpm format`, add missing quality gates, remove GO.md |

---

## 3. docs/development/

| File | Purpose | Status | Action |
| --- | --- | --- | --- |
| `README.md` | Development docs index | Partially stale | Update -- remove GO.md reference |
| `onboarding.md` | Canonical onboarding path | Stale | **Rewrite** -- references "Oak Notion MCP", GO.md pattern, `mcp-storage`/`mcp-transport` (removed), wrong commands, broken links |
| `environment-variables.md` | Env var reference | Partially stale | Update -- fix broken link to `vercel-environment-config.md` |
| `release-and-publishing.md` | SDK publishing strategy | Current | Keep as-is |
| `troubleshooting.md` | Common issues and fixes | Current | Keep as-is |
| `tooling.md` | Dev tools and versions | Current | Keep as-is |
| `testing-patterns.md` | TDD and DI recipes | Current | Keep as-is |
| `production-debugging-runbook.md` | Production debugging with correlation IDs | Partially stale | Update -- remove mcp-transport references |
| `build-system.md` | Monorepo build system | Partially stale | Update -- correct `pnpm check` description |
| `ci-policy.md` | CI sdk-codegen policy | Current | Keep as-is |

### Key issues

- **`onboarding.md`**: Title says "Oak Notion MCP codebase". Lists
  `@oaknational/mcp-storage`, `@oaknational/mcp-transport` (removed).
  Uses `pnpm format` (should be `pnpm format:root`). Links to
  non-existent `docs/development/onboarding-journey.md`,
  `docs/quick-reference.md`, and `docs/development/understanding-agent-references.md`
  (actual: `docs/governance/understanding-agent-references.md`).
  Architecture layout describes Notion-specific structure. Link to
  `docs/troubleshooting.md` has wrong path (actual:
  `docs/operations/troubleshooting.md`). Requires full rewrite.
- **`environment-variables.md`**: Broken link to
  `docs/vercel-environment-config.md` (actual:
  `apps/oak-curriculum-mcp-streamable-http/docs/vercel-environment-config.md`).

---

## 4. docs/architecture/

| File | Purpose | Status | Action |
| --- | --- | --- | --- |
| `README.md` | Architecture index | Current (minor) | Update -- fix duplicate `packages/libs/` bullet |
| `openapi-pipeline.md` | OpenAPI-first pipeline | Partially stale | Update -- 4 broken ADR links |
| `programmatic-tool-generation.md` | MCP tool generation from SDK | Partially stale | Update -- status "Proposed" should be "Accepted", stale dates, file structure may differ |
| `provider-system.md` | Provider integration and DI | Current | Keep as-is |
| `provider-contracts.md` | Behavioural contracts for providers | Current | Keep as-is |
| `openai-connector-deprecation.md` | OpenAI connector removal record | Current | Keep as-is |
| `greek-ecosystem-deprecation.md` | Greek naming deprecation record | Current | Keep as-is |

### Broken ADR links in openapi-pipeline.md

- `029-no-manual-api-data-structures.md` -- actual: `029-no-manual-api-data.md`
- `030-sdk-as-single-source-of-truth.md` -- actual: `030-sdk-single-source-truth.md`
- `031-generation-at-build-time.md` -- actual: `031-generation-time-extraction.md`
- `048-shared-parsing-helpers.md` -- actual: `048-shared-parse-schema-helper.md`

---

## 5. docs/architecture/architectural-decisions/

### ADR Index (README.md)

**Status**: Partially stale

**Issues**:

1. Broken links for archived ADRs 020, 021, 023 -- index links to
   main directory but files are in
   `docs/archive/architecture/architectural-decisions/`.
2. Missing from index: ADR-074 (Elastic-Native-First), ADR-110
   (Thread Search Architecture), ADR-111 (Secret Scanning Quality
   Gate).
3. ADR-015 label says "Node.js 22+ Requirement"; content says 24.x;
   filename is `015-node-22-minimum.md`.
4. Gaps at 039 and 090 (likely intentional).

### Spot-checked ADRs

| ADR | Status | Issues | Action |
| --- | --- | --- | --- |
| 001-esm-only-package.md | Partially stale | "Node.js 22+" should be 24.x | Update |
| 004-no-direct-notion-sdk-usage.md | Deprecated (correctly marked) | None | Keep as-is |
| 015-node-22-minimum.md | Partially stale | Filename outdated; content correct (24.x) | Rename to `015-node-24-minimum.md`; update index label |
| 020, 021, 023 (archived) | Archived correctly | No archive banner; index links broken | Add archive banners; fix index links |

---

## 6. docs/agent-guidance/

| File | Purpose | Status | Action |
| --- | --- | --- | --- |
| `README.md` | Agent guidance index | Partially stale | Update -- "Oak Notion MCP codebase", broken link to `experimental-architecture-quick-reference.md`, missing entries |
| `ai-agent-guide.md` | Primary AI agent guide | Stale | **Rewrite** -- see detailed issues below |
| `curriculum-tools-guidance-and-playbooks.md` | Data tools vs guidance separation | Partially stale | Update -- fix quality gate commands |
| `development-practice.md` | Quality gates and design principles | Partially stale | Update -- fix `pnpm format`, add markdownlint, fix typo |
| `safety-and-security.md` | Security, API keys, PII | Current (minor) | Optional update -- generalise Notion examples |
| `typescript-practice.md` | TypeScript rules | Current | Keep as-is |
| `understanding-agent-references.md` | How to use agent reference materials | Stale | **Rewrite** -- wrong path (`.agent/reference/` should be `.agent/reference-docs/`), heavy Notion focus |
| `logging-guidance.md` | When and how to log | Partially stale | Update -- replace deprecated `createAdaptiveLogger` with `UnifiedLogger` |
| `sentry-guidance.md` | Sentry integration | Partially stale | Update -- verify Sentry API and usage, or archive |

### ai-agent-guide.md detailed issues

- Line 3: "Oak Notion MCP codebase" (wrong project name)
- Lines 5-12: GO.md grounding pattern (superseded)
- Lines 19-20: `@oaknational/mcp-storage`, `@oaknational/mcp-transport`
  (removed packages)
- Lines 84-89: `pnpm format` (should be `format:root`), `pnpm lint`
  (should be `lint:fix`), missing `markdownlint:root`
- Line 124: Example "archive Notion pages" (Notion removed)
- Lines 138-145: Notion-specific application layout
- Line 149: `docs/troubleshooting.md` (wrong path)
- Line 169: `../development/onboarding-journey.md` (moved to archive)
- Line 170: `../quick-reference.md` (does not exist)
- Throughout: GO.md grounding every third task

**Recommendation**: Delete or rewrite from scratch. If the
canonical agent entry point is `.agent/directives/AGENT.md`, this
file is redundant and misleading.

---

## 7. docs/data/

| File | Purpose | Status | Action |
| --- | --- | --- | --- |
| `README.md` | Curriculum data docs index | Current | Keep as-is |
| `DATA-VARIANCES.md` | Subject/key stage differences, transcripts | Current | Keep as-is |

---

## 8. docs/usage/

| File | Purpose | Status | Action |
| --- | --- | --- | --- |
| `README.md` | Usage docs index | Stale | **Rewrite or delete** -- describes "Oak Notion MCP server" (Notion workspace removed) |
| `api-reference.md` | MCP API reference | Stale | **Rewrite or delete** -- entirely about Notion MCP (notion-search, notion-list-databases, etc.) |

---

## 9. docs/research/

| File | Purpose | Status | Action |
| --- | --- | --- | --- |
| `README.md` | Research docs index | Stale | **Rewrite or delete** -- references "Oak AI Lesson Assistant", lists 4 pending documents that do not exist |

---

## 10. apps/oak-search-cli/

### Main docs

| File | Purpose | Status | Action |
| --- | --- | --- | --- |
| `README.md` | Search CLI entry point | Partially stale | Update -- add `threads` to CLI table |
| `docs/README.md` | Docs index | Partially stale | Update -- broken links to `DIAGNOSTIC-QUERIES.md`, `oak-components-theming.md`; stale quality gate commands |
| `docs/ARCHITECTURE.md` | System overview | Current | Keep as-is |
| `docs/DATA-COMPLETENESS.md` | Field upload policy | Current | Keep as-is |
| `docs/ES_SERVERLESS_SETUP.md` | ES provisioning | Partially stale | Update -- old app name |
| `docs/INDEXING.md` | Indexing playbook | Current | Keep as-is |
| `docs/INGESTION-GUIDE.md` | Ingestion guide | Current | Keep as-is |
| `docs/ingestion-harness.md` | Ingestion workflow | Current | Keep as-is |
| `docs/IR-METRICS.md` | IR metrics reference | Partially stale | Update -- "Lessons only" scope, now includes units/sequences/threads |
| `docs/NEW-SUBJECT-GUIDE.md` | New subject onboarding | Partially stale | Update -- broken links to `GROUND-TRUTH-PROCESS.md` |
| `docs/QUERYING.md` | RRF queries, facets, suggestions | Current | Keep as-is |
| `docs/ROLLUP.md` | Unit snippet generation | Partially stale | Update -- verify revalidateTag usage |
| `docs/SDK-CACHING.md` | Redis SDK caching | Current | Keep as-is |
| `docs/SDK-ENDPOINTS.md` | Deprecated SDK parity routes | Stale | Archive -- describes retired UI layer |
| `docs/SETUP.md` | Environment setup | Current | Keep as-is |
| `docs/SYNONYMS.md` | Synonym expansion | Current | Keep as-is |
| `docs/ground-truths/ground-truth-protocol.md` | GT creation protocol | Current | Keep as-is |
| `docs/ground-truths/queries-redesigned.md` | GT redesign status | Current | Keep as-is |

### Source READMEs

| File | Purpose | Status | Action |
| --- | --- | --- | --- |
| `src/adapters/README.md` | SDK adapter architecture | Partially stale | Update -- align examples with current schema |
| `src/adapters/sdk-cache/README.md` | Redis caching | Current | Keep as-is |
| `src/lib/indexing/README.md` | Indexing module | Current | Keep as-is |
| `src/lib/search-quality/ground-truth/README.md` | GT system | Partially stale | Update -- broken links to protocol |
| `src/lib/search-quality/ground-truth/GROUND-TRUTH-GUIDE.md` | GT design guide | Partially stale | Update -- "Lessons only" scope |
| `src/lib/search-quality/ground-truth-archive/README.md` | Wrong content (MCP testing strategy) | Stale | **Replace** -- content belongs to streamable-http, not search CLI |

### Operations READMEs

| File | Purpose | Status | Action |
| --- | --- | --- | --- |
| `operations/README.md` | Repo-level strategic plan (wrong location) | Stale | Replace with search CLI operations index |
| `operations/ingestion/README.md` | MCP dev server management (wrong location) | Stale | Replace with search CLI ingestion ops |
| `operations/infrastructure/README.md` | Archived OAuth notes (wrong location) | Stale | Replace or remove |
| `operations/observability/README.md` | MCP middleware chain (wrong location) | Stale | Replace or remove |
| `operations/sandbox/README.md` | MCP testing gaps (wrong location) | Stale | Replace or remove |
| `operations/utilities/README.md` | Vercel config (wrong location) | Stale | Replace or remove |

### Evaluation READMEs

| File | Purpose | Status | Action |
| --- | --- | --- | --- |
| `evaluation/README.md` | Evaluation tools index | Partially stale | Update -- broken `DIAGNOSTIC-QUERIES.md` link |
| `evaluation/analysis/README.md` | Analysis reporting | Partially stale | Update -- broken `GROUND-TRUTH-PROCESS.md` links |
| `evaluation/experiments/README.md` | Clerk OAuth research (wrong location) | Stale | Replace with search experiment docs |
| `evaluation/experiments/current/README.md` | Active search experiments | Current | Keep as-is |
| `evaluation/validation/README.md` | GT validation scripts | Partially stale | Update -- broken `GROUND-TRUTH-PROCESS.md` links |

### Other directories

| File | Purpose | Status | Action |
| --- | --- | --- | --- |
| `ground-truths/README.md` | GT type generation | Partially stale | Update -- broken `GROUND-TRUTH-PROCESS.md` link |
| `bulk-downloads/README.md` | Bulk download data | Partially stale | Update -- old workspace name `oak-open-curriculum-semantic-search` |
| `scripts/README.md` | Scripts index | Current | Keep as-is |
| `fixtures/REFERENCE.md` | Fixture reference | Current | Keep as-is |

### Critical broken links in oak-search-cli

- `GROUND-TRUTH-PROCESS.md` referenced in 7+ places -- does not exist.
  Should be `GROUND-TRUTH-GUIDE.md` or `ground-truth-protocol.md`.
- `DIAGNOSTIC-QUERIES.md` referenced in 2 places -- does not exist.
- `oak-components-theming.md` referenced in `docs/README.md` -- does
  not exist.

---

## 11. apps/oak-curriculum-mcp-streamable-http/

| File | Purpose | Status | Action |
| --- | --- | --- | --- |
| `README.md` | Main app entry point | Current | Keep as-is |
| `TESTING.md` | Testing strategy and auth tiers | Current | Keep as-is |
| `Equality-Impact-Assessment.md` | EqIA | Current | Keep as-is |
| `docs/BUILD_VERIFICATION.md` | Build verification system | Partially stale | Update -- still documents removed `test:e2e:built` |
| `docs/clerk-mcp-research-findings.md` | Clerk OAuth research | Current | Keep as-is |
| `docs/clerk-oauth-trace-instructions.md` | OAuth trace capture | Current | Update -- confirm plan link |
| `docs/deployment-architecture.md` | Deployment architecture | Current | Keep as-is |
| `docs/DEPLOYMENT_FIX_SUMMARY.md` | Historical deployment fix | Stale | Archive |
| `docs/dev-server-management.md` | Dev server management | Current | Update -- fix link path |
| `docs/headless-oauth-automation.md` | Archived headless OAuth | Stale | Archive (already marked) |
| `docs/middleware-chain.md` | Middleware chain | Current | Update -- fix archived link |
| `docs/TESTING_GAP_ANALYSIS.md` | Testing gap analysis | Partially stale | Update -- remove `test:e2e:built` refs |
| `docs/vercel-environment-config.md` | Vercel env config | Current | Keep as-is |
| `smoke-tests/OAUTH-VALIDATION-RESULTS.md` | OAuth validation results | Current | Update -- confirm plan link |
| `smoke-tests/README-oauth-inspector.md` | OAuth Inspector workflow | Current | Keep as-is |
| `.agent/prompts/learn-about-oak-cta.prompt.md` | CTA button prompt | Deleted | CTA system removed from widget; context grounding moving to MCP resource |

---

## 12. apps/oak-curriculum-mcp-stdio/

| File | Purpose | Status | Action |
| --- | --- | --- | --- |
| `README.md` | STDIO MCP server entry point | Current | Keep as-is |
| `SDK_NOTES.md` | ESM import extension notes | Partially stale | Update -- confirm if changes are done |

---

## 13. packages/

| File | Purpose | Status | Action |
| --- | --- | --- | --- |
| `packages/sdks/oak-curriculum-sdk/README.md` | Curriculum SDK overview | Current | Keep as-is |
| `packages/sdks/oak-curriculum-sdk/docs/docs-pipeline.md` | Docs pipeline guide | Partially stale | Update -- "Node.js >= 22" should be 24.x; remove GO.md reference |
| `packages/sdks/oak-curriculum-sdk/docs/mcp/README.md` | MCP tools deep-dive | Current | Keep as-is |
| `packages/sdks/oak-search-sdk/README.md` | Search SDK overview | Current | Keep as-is |
| `packages/core/oak-eslint/README.md` | ESLint plugin for Oak standards | Current | Keep as-is |
| `packages/core/openapi-zod-client-adapter/README.md` | Zod v3/v4 adapter | Current | Keep as-is |
| `packages/libs/env/README.md` | Runtime-adaptive env library | Current | Keep as-is |
| `packages/libs/logger/README.md` | MCP logger (UnifiedLogger) | Partially stale | Update -- migration guide still references deprecated `createAdaptiveLogger` |
| `packages/libs/result/README.md` | Result type and helpers | Current | Keep as-is |

---

## 14. .agent/directives/

| File | Purpose | Status | Action |
| --- | --- | --- | --- |
| `AGENT.md` | Core agent directives and entry point | Partially stale | Update -- "Read GO.md every 6th-ish task" (stale pattern); `pnpm check` description understates what it runs |
| `rules.md` | Authoritative rules | Current | Keep as-is |
| `testing-strategy.md` | TDD at all levels | Current | Keep as-is |
| `schema-first-execution.md` | Schema-first MCP execution | Current | Keep as-is |
| `semantic-search-architecture.md` | Moved to `docs/agent-guidance/` | Relocated | Domain-specific, not a directive |
| `metacognition.md` | Reflective prompt | Current | Keep as-is |

---

## 15. .agent/plans/ (active, non-archive)

| File | Purpose | Status | Action |
| --- | --- | --- | --- |
| `high-level-plan.md` | Strategic overview | Stale | Update -- Item #4 "Notion MCP Workspace Removal" should be marked complete |
| `semantic-search/active/developer-onboarding-experience.plan.md` | This plan | Current | Keep as-is |
| `semantic-search/README.md` | Semantic search navigation | Current | Keep as-is |
| `semantic-search/roadmap.md` | Search roadmap | Current | Keep as-is |
| `semantic-search/search-acceptance-criteria.md` | GT categories and criteria | Current | Keep as-is |
| `pipeline-enhancements/openapi-to-mcp-framework-extraction-plan.md` | OpenAPI framework extraction | Partially stale | Update -- broken testing-strategy.md link; GO.md references |
| `dev-tooling-and-dev-ai-support/stryker-integration-plan.md` | Stryker mutation testing | Stale | Update -- GO.md references; notes `oak-notion-mcp` removed |
| `dev-tooling-and-dev-ai-support/contract-testing-schema-evolution-plan.md` | Contract testing | Stale | Update -- broken directive links; GO.md references |
| `quality-and-maintainability/node-sdk-config-and-di-remediation-plan.md` | Node SDK DI | Partially stale | Notes `oak-notion-mcp` removed |
| `quality-and-maintainability/global-state-elimination-and-testing-discipline-plan.md` | Global state elimination | Partially stale | Notes `oak-notion-mcp` removed |

Other active plans were scanned and found current. Full inventory
available in the batch 2 agent output.

---

## 16. .agent/research/ (non-archive)

**~100 files audited.** Nearly all are current research and reference
material. Issues found:

| File | Status | Issues | Action |
| --- | --- | --- | --- |
| `roadmap-feature-parity-alignment.md` | Partially stale | Dead link to archived plan | Update |
| `error_handling/oak-error-handling-survey.md` | Partially stale | GO.md reference; Notion MCP mention | Update |
| `aila-modular-extraction/README.md` | Stale | References non-existent `reference/oak-ai-lesson-assistant/` | Archive |
| `aila-modular-extraction/teaching-materials.md` | Stale | References non-existent `packages/teaching-materials/` | Archive |
| `aila-modular-extraction/content-moderation-system.md` | Stale | Same | Archive |
| `aila-modular-extraction/file-inventory.md` | Stale | Same | Archive |

---

## 17. .agent/reference-docs/

**~35 files audited.** Nearly all are current external reference
material. Issues found:

| File | Status | Issues | Action |
| --- | --- | --- | --- |
| `README.md` | Partially stale | Dead links to `claude-configuration-docs.md`, `claude-mcp-docs.md`; Notion section may be obsolete | Update |
| `notion-sdk-readme.md` | Archive candidate | Notion integration removed | Archive |
| `notion-api-overview.md` | Archive candidate | Same | Archive |

---

## 18. .agent/prompts/ (non-archive)

All 6 non-archived prompt files are current. No issues found.

---

## 19. .agent/proposals/

All proposal files are current. No issues found.

---

## 20. .agent/analysis/

**~25 files audited.** One issue found:

| File | Status | Issues | Action |
| --- | --- | --- | --- |
| `build-and-error-analysis.md` | Stale | References `apps/oak-notion-mcp` (deleted) | Archive |

---

## 21. .agent/memory/

`napkin.md` is actively maintained (latest session 2026-02-12).
Current. Keep as-is.

---

## 22. .cursor/

### Agents (13 files)

| File | Status | Issues | Action |
| --- | --- | --- | --- |
| `architecture-reviewer.md` | Partially stale | Example uses `oak-notion-mcp` (removed) | Update |
| All other agents | Current | None | Keep as-is |

### Commands (10 files)

| File | Status | Issues | Action |
| --- | --- | --- | --- |
| `jc-gates.md` | Partially stale | Omits several quality gates vs AGENT.md | Update |
| `jc-start-right-thorough.md` | Stale | References removed `pnpm test:e2e:built` | Update |
| All other commands | Current | None | Keep as-is |

### Skills (3 files)

| File | Status | Issues | Action |
| --- | --- | --- | --- |
| `ground-truth-design/SKILL.md` | Stale | References deleted `test-query-lessons.ts` | Update -- use CLI commands |
| `ground-truth-evaluation/SKILL.md` | Stale | Same | Update -- use CLI commands |
| `napkin/SKILL.md` | Current | None | Keep as-is |

### Rules (13 .mdc files)

| File | Status | Issues | Action |
| --- | --- | --- | --- |
| `invoke-code-reviewers.mdc` | Partially stale | Example uses `gemini-flash` instead of `gemini-pro` | Update |
| All other rules | Current | None | Keep as-is |

---

## 23. .github/

| File | Purpose | Status | Action |
| --- | --- | --- | --- |
| `PULL_REQUEST_TEMPLATE.md` | PR template | Current | Keep as-is |
| `copilot-instructions.md` | Copilot pointer to AGENT.md | Current | Keep as-is |

---

## 24. .claude/commands/

| File | Status | Issues | Action |
| --- | --- | --- | --- |
| `jc-quality-gates.md` | Stale | Uses `pnpm format`, `pnpm check-types` instead of `pnpm format:root`, `pnpm type-check` | Update |
| Other files | Not fully audited | Quick scan needed | Scan in WS2 |

---

## Cross-Cutting Themes

### Theme 1: GO.md Grounding Pattern (15 non-archive files)

GO.md exists at the repository root and is still referenced in
AGENT.md, `docs/README.md`, `docs/foundation/quick-start.md`,
`docs/foundation/onboarding.md`, `docs/engineering/README.md`,
`docs/governance/ai-agent-guide.md`,
`packages/sdks/oak-curriculum-sdk/docs/docs-pipeline.md`, and
several `.agent/plans/` files.

The current agent entry point is `.agent/directives/AGENT.md` which
links to `rules.md`, `testing-strategy.md`, and
`schema-first-execution.md`. The GO.md grounding pattern (read
every 3rd/6th task) is superseded by the directives-based approach.

**Decision needed**: Delete GO.md and remove all references (clean
break), or formalise its complementary role alongside AGENT.md.

### Theme 2: "Oak Notion MCP" References (9 non-archive files)

The project was originally "Oak Notion MCP" and has evolved into a
curriculum SDK + search + MCP ecosystem. The `apps/oak-notion-mcp/`
workspace was deleted. Files still referencing Notion MCP:

- `docs/governance/ai-agent-guide.md` (throughout)
- `docs/governance/README.md` (line 3)
- `docs/usage/README.md` (throughout)
- `docs/usage/api-reference.md` (throughout)
- `docs/foundation/onboarding.md` (title and content)
- `.agent/plans/high-level-plan.md` (Item #4)
- `.agent/research/error_handling/oak-error-handling-survey.md`
- `.cursor/agents/architecture-reviewer.md` (example)
- `docs/architecture/architectural-decisions/004-no-direct-notion-sdk-usage.md`
  (deprecated ADR -- acceptable)

### Theme 3: Stale Command Names (9 non-archive files)

`pnpm format` should be `pnpm format:root`. Found in:

- `docs/foundation/onboarding.md`
- `docs/governance/development-practice.md`
- `docs/governance/curriculum-tools-guidance-and-playbooks.md`
- `docs/governance/ai-agent-guide.md` (`pnpm format` and
  `pnpm lint` should be `pnpm lint:fix`)
- `docs/architecture/architectural-decisions/047-canonical-url-generation-at-codegen-time.md`
- `docs/engineering/build-system.md` (incorrect `pnpm check`
  description)
- `.claude/commands/jc-quality-gates.md` (`pnpm format`,
  `pnpm check-types`)
- `.cursor/commands/jc-gates.md` (incomplete gate list)
- `.cursor/commands/jc-start-right-thorough.md` (removed
  `test:e2e:built`)

### Theme 4: Node.js Version Drift (5 non-archive files)

Node.js 22 references when the current requirement is 24.x:

- `docs/architecture/architectural-decisions/001-esm-only-package.md`
- `docs/architecture/architectural-decisions/015-node-22-minimum.md`
  (filename and index label)
- `docs/architecture/architectural-decisions/README.md` (ADR-015
  label)
- `packages/sdks/oak-curriculum-sdk/docs/docs-pipeline.md`
- `apps/oak-curriculum-mcp-streamable-http/README.md`

### Theme 5: Broken Links (20+ instances)

Major categories:

- **`GROUND-TRUTH-PROCESS.md`**: Referenced in 7+ places in
  oak-search-cli; file does not exist (should be
  `GROUND-TRUTH-GUIDE.md` or `ground-truth-protocol.md`)
- **`DIAGNOSTIC-QUERIES.md`**: Referenced in 2 places; does not exist
- **`experimental-architecture-quick-reference.md`**: Referenced in
  `docs/governance/README.md`; does not exist
- **`oak-components-theming.md`**: Referenced in
  `apps/oak-search-cli/docs/README.md`; does not exist
- **Archived ADR links**: 020, 021, 023 in ADR index point to main
  directory instead of archive
- **ADR name mismatches**: 029, 030, 031, 048 in
  `openapi-pipeline.md`
- **Wrong-path links**: `docs/vercel-environment-config.md`,
  `docs/troubleshooting.md`, `../development/onboarding-journey.md`,
  `../quick-reference.md`

### Theme 6: Wrong-Location Content in oak-search-cli

Six `operations/` subdirectory READMEs and two `evaluation/`
READMEs contain content from the streamable-http MCP workspace, not
from the search CLI. These appear to be copy errors or misplaced
files. Also, `src/lib/search-quality/ground-truth-archive/README.md`
contains MCP testing strategy content (wrong workspace).

### Theme 7: Removed Packages and Scripts

- `@oaknational/mcp-storage`, `@oaknational/mcp-transport`:
  Referenced in `docs/foundation/onboarding.md`,
  `docs/governance/ai-agent-guide.md`
- `test-query-*.ts` scripts: Referenced in
  `.cursor/skills/ground-truth-design/SKILL.md`,
  `.cursor/skills/ground-truth-evaluation/SKILL.md`
- `createAdaptiveLogger`: Referenced in
  `docs/governance/logging-guidance.md`,
  `packages/libs/logger/README.md`
- `test:e2e:built`: Referenced in
  `.cursor/commands/jc-start-right-thorough.md`,
  `apps/oak-curriculum-mcp-streamable-http/docs/BUILD_VERIFICATION.md`,
  `apps/oak-curriculum-mcp-streamable-http/docs/TESTING_GAP_ANALYSIS.md`

---

## Summary Statistics

| Classification | Count |
| --- | --- |
| Current | ~170 |
| Partially stale | ~45 |
| Stale (needs rewrite/delete/archive) | ~30 |
| Archive candidate | ~5 |

### Files requiring rewrite or deletion (highest impact)

1. `docs/foundation/onboarding.md` -- **Rewrite** (primary
   onboarding path is broken)
2. `docs/governance/ai-agent-guide.md` -- **Delete or rewrite**
   (deeply stale, redundant with AGENT.md)
3. `docs/usage/README.md` -- **Delete or rewrite** (entirely about
   Notion MCP)
4. `docs/usage/api-reference.md` -- **Delete or rewrite** (entirely
   about Notion MCP)
5. `docs/onboarding.md` -- **Delete** (compatibility pointer)
6. `docs/research/README.md` -- **Delete or rewrite** (references
   non-existent research target)
7. `docs/governance/understanding-agent-references.md` --
   **Rewrite** (wrong paths, Notion focus)
8. 6 `apps/oak-search-cli/operations/` READMEs -- **Replace** (wrong
   workspace content)
9. `GO.md` -- **Decision needed**: delete or formalise role

---

## Recommendations for WS1-WS6

### WS1 (Canonical Onboarding Journey)

The audit confirms `docs/onboarding.md` is a compatibility pointer
that must be deleted. The canonical path
`docs/foundation/onboarding.md` requires a full rewrite -- it is
the most broken file in the onboarding path. WS1 should also decide
the fate of GO.md.

### WS2 (Command Truth and Drift Removal)

9 files contain stale `pnpm format` commands. The
`docs/governance/ai-agent-guide.md` file is the worst offender
(multiple wrong commands). WS2 should also address
`.cursor/commands/` and `.claude/commands/` staleness.

### WS3 (Link Integrity and Navigation)

20+ broken link instances across the repository. The
`GROUND-TRUTH-PROCESS.md` pattern (7+ references to a non-existent
file) is the most widespread. 4 ADR name mismatches in
`openapi-pipeline.md`. 3 archived ADR links in the ADR index.
`docs/usage/` and `docs/research/` directories contain stale
content that needs deletion or rewrite.

### WS4 (Credential, Access, and Contribution Messaging)

`docs/governance/safety-and-security.md` still uses Notion-
specific credential examples. `docs/operations/environment-variables.md`
has a broken link to the Vercel config. Node.js 24.x is inconsistently
referenced (5 files say 22).

### WS5 (Release Operator Onboarding)

`docs/engineering/release-and-publishing.md` is current. No audit
issues affect WS5 scope.

### WS6 (First-Day Rehearsal)

The audit reveals that a new developer following the documented
onboarding path would encounter: a compatibility redirect
(`docs/onboarding.md`), an entirely Notion-focused onboarding doc
(`docs/foundation/onboarding.md`), wrong commands, broken links,
and references to removed packages. WS6 rehearsal cannot succeed
until WS1-WS4 are complete.
