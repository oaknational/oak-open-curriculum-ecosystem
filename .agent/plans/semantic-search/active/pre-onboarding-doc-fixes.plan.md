# Pre-Onboarding Documentation Fixes

**Status**: Ready -- execute all workstreams
**Parent**: [developer-onboarding-experience.plan.md](developer-onboarding-experience.plan.md)
**Audit report**: [../../research/documentation-audit-report.md](../../research/documentation-audit-report.md)
**Last Updated**: 2026-02-14

---

## Purpose

The WS0 documentation audit found ~80 issues across ~250 non-archived
markdown files. These issues split cleanly into two buckets:

1. **This plan** -- fixes to files that are NOT on the developer
   onboarding path. These are general documentation hygiene: broken
   links, wrong-location content, stale references to removed things,
   and files that should be archived. Fixing these first clears the
   decks so the onboarding workstreams can focus on the journey itself.

2. **The onboarding plan (WS1-WS6)** -- fixes to files that ARE on
   the onboarding path: `docs/development/onboarding.md`,
   `docs/quick-start.md`, `docs/agent-guidance/ai-agent-guide.md`,
   GO.md, `docs/usage/`, `docs/research/README.md`, and all
   credential/command/link issues in onboarding-facing documents.

Every issue from the audit report is assigned to one of these two
places. The assignment table is in the
[Issue Assignment](#issue-assignment-audit-report-to-bucket) section.

---

## Workstream Status

| ID | Workstream | Status |
| --- | --- | --- |
| P1 | [Archival and deletion](#p1-archival-and-deletion) | Pending |
| P2 | [ADR and architecture fixes](#p2-adr-and-architecture-fixes) | Pending |
| P3 | [oak-search-cli fixes](#p3-oak-search-cli-fixes) | Pending |
| P4 | [App and package doc fixes](#p4-app-and-package-doc-fixes) | Pending |
| P5 | [Agent internal doc fixes](#p5-agent-internal-doc-fixes) | Pending |
| P6 | [Cursor, Claude, and tooling config fixes](#p6-cursor-claude-and-tooling-config-fixes) | Pending |
| P7 | [Non-onboarding content accuracy](#p7-non-onboarding-content-accuracy) | Pending |

**Recommended order**: P1 first (reduces file count), then P2-P6
in parallel or any order, P7 last (content changes benefit from
earlier link/archival work being done).

---

## P1: Archival and Deletion

Files that are clearly stale and should be moved to archive or
deleted. No content rewriting -- just move or delete.

### Actions

1. Archive `.agent/research/aila-modular-extraction/` (4 files:
   `README.md`, `teaching-materials.md`, `content-moderation-system.md`,
   `file-inventory.md`) -- all reference non-existent
   `reference/oak-ai-lesson-assistant/` and
   `packages/teaching-materials/`.
2. Archive `.agent/reference-docs/notion-sdk-readme.md` and
   `.agent/reference-docs/notion-api-overview.md` -- Notion
   integration permanently removed.
3. Archive `.agent/analysis/build-and-error-analysis.md` -- references
   deleted `apps/oak-notion-mcp`.
4. Archive `apps/oak-curriculum-mcp-streamable-http/docs/DEPLOYMENT_FIX_SUMMARY.md`
   -- describes superseded deployment; points to `deployment-architecture.md`.
5. Archive `apps/oak-curriculum-mcp-streamable-http/docs/headless-oauth-automation.md`
   -- already marked ARCHIVED in content.
6. Archive `apps/oak-search-cli/docs/SDK-ENDPOINTS.md` -- describes
   retired UI layer and deprecated SDK parity routes.

### Completion checklist

- [ ] 4 aila-modular-extraction files archived
- [ ] 2 Notion reference docs archived
- [ ] build-and-error-analysis.md archived
- [ ] DEPLOYMENT_FIX_SUMMARY.md archived
- [ ] headless-oauth-automation.md archived
- [ ] SDK-ENDPOINTS.md archived

---

## P2: ADR and Architecture Fixes

Mechanical fixes to the ADR index and architecture documentation.
None of these are on the onboarding path.

### Actions

1. **ADR index** (`docs/architecture/architectural-decisions/README.md`):
   - Add ADR-074, ADR-110, ADR-111 to the main index.
   - Fix links for ADR-020, 021, 023 to point to
     `../../archive/architecture/architectural-decisions/`.
   - Update ADR-015 label from "Node.js 22+ Requirement" to
     "Node.js 24.x Requirement".
2. **ADR-015**: Rename `015-node-22-minimum.md` to
   `015-node-24-minimum.md`.
3. **ADR-001**: Update "Node.js 22+" references to 24.x (2 instances).
4. **ADR-020, 021, 023**: Add archive banners at the top of each
   file in `docs/archive/architecture/architectural-decisions/`.
5. **openapi-pipeline.md**: Fix 4 broken ADR links:
   - `029-no-manual-api-data-structures.md` -> `029-no-manual-api-data.md`
   - `030-sdk-as-single-source-of-truth.md` -> `030-sdk-single-source-truth.md`
   - `031-generation-at-build-time.md` -> `031-generation-time-extraction.md`
   - `048-shared-parsing-helpers.md` -> `048-shared-parse-schema-helper.md`
6. **programmatic-tool-generation.md**: Update status from "Proposed"
   to "Accepted"; update date.
7. **architecture/README.md**: Fix duplicate `packages/libs/` bullet.

### Completion checklist

- [ ] ADR index complete and all links resolve
- [ ] ADR-015 renamed and index label updated
- [ ] ADR-001 Node.js version updated
- [ ] Archive banners added to ADR-020, 021, 023
- [ ] openapi-pipeline.md ADR links fixed
- [ ] programmatic-tool-generation.md status updated
- [ ] architecture/README.md duplicate bullet fixed

---

## P3: oak-search-cli Fixes

The search CLI has two categories of issues: wrong-location content
(files that belong to the streamable-http workspace) and broken
internal links.

### Actions

#### Wrong-location content (replace or remove)

1. Replace 6 `operations/` READMEs with correct search CLI content
   or brief placeholder descriptions:
   - `operations/README.md` -- replace with search CLI operations index
   - `operations/ingestion/README.md` -- replace with ingestion ops summary
   - `operations/infrastructure/README.md` -- replace or remove
   - `operations/observability/README.md` -- replace or remove
   - `operations/sandbox/README.md` -- replace or remove
   - `operations/utilities/README.md` -- replace or remove
2. Replace `evaluation/experiments/README.md` -- currently contains
   Clerk OAuth research; should describe search experiments.
3. Replace `src/lib/search-quality/ground-truth-archive/README.md` --
   currently contains MCP testing strategy; should describe the
   ground truth archive.

#### Broken links

4. Fix all `GROUND-TRUTH-PROCESS.md` references (7+ places) to point
   to `GROUND-TRUTH-GUIDE.md` or `docs/ground-truths/ground-truth-protocol.md`.
   Files: `docs/NEW-SUBJECT-GUIDE.md`, `evaluation/analysis/README.md`,
   `evaluation/validation/README.md`, `ground-truths/README.md`,
   `src/lib/search-quality/ground-truth/README.md`.
5. Remove or fix `DIAGNOSTIC-QUERIES.md` references in
   `docs/README.md` and `evaluation/README.md`.
6. Remove `oak-components-theming.md` reference from `docs/README.md`.

#### Scope and accuracy updates

7. Add `threads` to the CLI subcommands table in `README.md`.
8. Update `docs/IR-METRICS.md` scope from "Lessons only" to include
   units, sequences, threads.
9. Update `src/lib/search-quality/ground-truth/GROUND-TRUTH-GUIDE.md`
   scope similarly.
10. Update `docs/ES_SERVERLESS_SETUP.md` app name from
    "Oak Open Curriculum Semantic Search" to "Oak Search CLI".
11. Update `bulk-downloads/README.md` workspace name from
    `oak-open-curriculum-semantic-search` to `oak-search-cli`.
12. Update `docs/README.md` stale quality gate commands.

### Completion checklist

- [ ] All wrong-location content replaced with correct content
- [ ] All GROUND-TRUTH-PROCESS.md references fixed
- [ ] DIAGNOSTIC-QUERIES.md and oak-components-theming.md references removed
- [ ] CLI README updated with threads
- [ ] Scope updates applied to IR-METRICS and GROUND-TRUTH-GUIDE
- [ ] Old workspace/app names updated

---

## P4: App and Package Doc Fixes

Fixes to streamable-http, stdio, and package-level documentation
that are not on the onboarding path.

### Actions

#### streamable-http

1. Update `docs/BUILD_VERIFICATION.md` -- remove or rewrite sections
   that assume `test:e2e:built` still exists.
2. Update `docs/TESTING_GAP_ANALYSIS.md` -- remove `test:e2e:built`
   references.
3. Fix `docs/dev-server-management.md` -- correct OAuth validation
   results link path.
4. Fix `docs/middleware-chain.md` -- update or remove link to archived
   `headless-oauth-automation.md`.
5. Confirm `docs/clerk-oauth-trace-instructions.md` plan link (may
   point to archived plan).
6. Confirm `smoke-tests/OAUTH-VALIDATION-RESULTS.md` plan link.
7. Update `.agent/prompts/learn-about-oak-cta.prompt.md` -- align
   with current CTA implementation.

#### stdio

8. Update `SDK_NOTES.md` -- confirm if ESM changes are done; add
   completion note or archive.

#### packages

9. Update `packages/sdks/oak-curriculum-sdk/docs/docs-pipeline.md` --
   change "Node.js >= 22" to 24.x; remove GO.md reference.
10. Update `packages/libs/logger/README.md` -- rewrite migration
    guide to remove deprecated `createAdaptiveLogger` references.

### Completion checklist

- [ ] streamable-http: test:e2e:built references removed
- [ ] streamable-http: link paths fixed
- [ ] streamable-http: archived plan links confirmed or updated
- [ ] stdio: SDK_NOTES.md updated
- [ ] docs-pipeline.md: Node version and GO.md fixed
- [ ] logger README: migration guide updated

---

## P5: Agent Internal Doc Fixes

Fixes to `.agent/` files that are not on the onboarding path.

### Actions

1. Update `.agent/plans/high-level-plan.md` -- mark Item #4 "Notion
   MCP Workspace Removal" as complete.
2. Fix `.agent/plans/pipeline-enhancements/openapi-to-mcp-framework-extraction-plan.md`
   -- correct broken `../../.agent/directives/testing-strategy.md`
   link to `../../directives/testing-strategy.md`.
3. Fix `.agent/plans/dev-tooling-and-dev-ai-support/contract-testing-schema-evolution-plan.md`
   -- fix directive links (`../directives/` -> `../../directives/`);
   fix testing-strategy.md path.
4. Update `.agent/research/roadmap-feature-parity-alignment.md` --
   fix dead link to archived plan.
5. Update `.agent/research/error_handling/oak-error-handling-survey.md`
   -- remove or update GO.md reference and Notion MCP mention.
6. Update `.agent/reference-docs/README.md` -- remove dead links to
   `claude-configuration-docs.md` and `claude-mcp-docs.md`; review
   Notion section.
7. Update `.agent/directives/AGENT.md` -- correct `pnpm check`
   description to match what it actually runs. (Note: the GO.md
   reference in AGENT.md is deferred to WS1 since it is part of the
   GO.md decision.)

### Completion checklist

- [ ] high-level-plan.md Notion item marked complete
- [ ] Broken directive links fixed in active plans
- [ ] Dead links fixed in research and reference docs
- [ ] AGENT.md pnpm check description corrected

---

## P6: Cursor, Claude, and Tooling Config Fixes

Fixes to AI agent configuration files.

### Actions

1. Update `.cursor/agents/architecture-reviewer.md` -- replace
   `oak-notion-mcp` example with a current workspace
   (e.g. `oak-curriculum-mcp-stdio`).
2. Update `.cursor/commands/jc-gates.md` -- align quality gate list
   with AGENT.md (add missing gates).
3. Update `.cursor/commands/jc-start-right-thorough.md` -- remove
   `pnpm test:e2e:built` from the gate list.
4. Update `.cursor/skills/ground-truth-design/SKILL.md` -- replace
   `test-query-lessons.ts` references with CLI commands
   (`oaksearch search lessons "query" --subject X --key-stage Y`).
5. Update `.cursor/skills/ground-truth-evaluation/SKILL.md` -- same
   as above.
6. Update `.cursor/rules/invoke-code-reviewers.mdc` -- fix example
   from `gemini-flash` to `gemini-pro`.
7. Update `.claude/commands/jc-quality-gates.md` -- use
   `pnpm format:root`, `pnpm type-check`, and the full gate sequence.

### Completion checklist

- [ ] architecture-reviewer.md example updated
- [ ] jc-gates.md aligned with AGENT.md
- [ ] jc-start-right-thorough.md test:e2e:built removed
- [ ] Both GT skills updated to use CLI commands
- [ ] invoke-code-reviewers.mdc example fixed
- [ ] Claude quality gates command updated

---

## P7: Non-Onboarding Content Accuracy

Content fixes to developer-facing docs that are NOT on the primary
onboarding path but are consumed during ongoing work.

### Actions

1. Update `docs/agent-guidance/logging-guidance.md` -- replace all
   `createAdaptiveLogger` references with `UnifiedLogger` + DI
   pattern; remove `as any` from test examples.
2. Update `docs/agent-guidance/sentry-guidance.md` -- verify Sentry
   API usage against current SDK; add version and doc links; archive
   if unused.
3. Update `docs/development/production-debugging-runbook.md` -- remove
   `mcp-transport` reference; verify logger package path.
4. Update `docs/development/build-system.md` -- correct `pnpm check`
   description to match `package.json`.
5. Update `docs/architecture/architectural-decisions/047-canonical-url-generation-at-typegen-time.md`
   -- fix `pnpm format` to `pnpm format:root`.
6. Update `apps/oak-curriculum-mcp-streamable-http/README.md` -- fix
   Node.js 22 reference to 24.x.
7. Update `src/adapters/README.md` in oak-search-cli -- align
   examples with current schema field names.

### Completion checklist

- [ ] logging-guidance.md updated to UnifiedLogger
- [ ] sentry-guidance.md verified or archived
- [ ] production-debugging-runbook.md mcp-transport removed
- [ ] build-system.md pnpm check corrected
- [ ] ADR-047 command fixed
- [ ] streamable-http README Node.js version fixed
- [ ] search CLI adapters README examples aligned

---

## Issue Assignment: Audit Report to Bucket

Every non-"current" file from the audit report is listed below with
its assigned bucket. Files classified as "Current / Keep as-is" in
the audit are omitted.

### Root files

| File | Issue | Bucket |
| --- | --- | --- |
| `GO.md` | Decision: delete or formalise | **Onboarding WS1** |

### docs/ top-level

| File | Issue | Bucket |
| --- | --- | --- |
| `docs/README.md` | Remove GO.md link | **Onboarding WS1** |
| `docs/onboarding.md` | Delete (compatibility pointer) | **Onboarding WS1** |
| `docs/quick-start.md` | Fix commands, quality gates, GO.md | **Onboarding WS2** |

### docs/development/

| File | Issue | Bucket |
| --- | --- | --- |
| `README.md` | Remove GO.md reference | **Onboarding WS1** |
| `onboarding.md` | Full rewrite | **Onboarding WS1** |
| `environment-variables.md` | Fix vercel-environment-config link | **Onboarding WS3** |
| `production-debugging-runbook.md` | Remove mcp-transport refs | **Pre-onboarding P7** |
| `build-system.md` | Correct pnpm check description | **Pre-onboarding P7** |

### docs/architecture/

| File | Issue | Bucket |
| --- | --- | --- |
| `README.md` | Fix duplicate bullet | **Pre-onboarding P2** |
| `openapi-pipeline.md` | Fix 4 broken ADR links | **Pre-onboarding P2** |
| `programmatic-tool-generation.md` | Update status and dates | **Pre-onboarding P2** |

### docs/architecture/architectural-decisions/

| File | Issue | Bucket |
| --- | --- | --- |
| `README.md` | Add 074/110/111; fix 020/021/023 links; ADR-015 label | **Pre-onboarding P2** |
| `001-esm-only-package.md` | Node 22 -> 24.x | **Pre-onboarding P2** |
| `015-node-22-minimum.md` | Rename file; content correct | **Pre-onboarding P2** |
| `020/021/023` (archived) | Add archive banners | **Pre-onboarding P2** |
| `047-canonical-url-generation.md` | pnpm format -> format:root | **Pre-onboarding P7** |

### docs/agent-guidance/

| File | Issue | Bucket |
| --- | --- | --- |
| `README.md` | "Oak Notion MCP", broken link, missing entries | **Onboarding WS2** |
| `ai-agent-guide.md` | Deeply stale; rewrite or delete | **Onboarding WS2** |
| `curriculum-tools-guidance-and-playbooks.md` | Fix quality gate commands | **Onboarding WS2** |
| `development-practice.md` | Fix commands, typo | **Onboarding WS2** |
| `safety-and-security.md` | Generalise Notion examples | **Onboarding WS4** |
| `understanding-agent-references.md` | Rewrite (wrong paths, Notion focus) | **Onboarding WS2** |
| `logging-guidance.md` | Replace createAdaptiveLogger | **Pre-onboarding P7** |
| `sentry-guidance.md` | Verify API or archive | **Pre-onboarding P7** |

### docs/usage/

| File | Issue | Bucket |
| --- | --- | --- |
| `README.md` | Entirely Notion MCP; delete or rewrite | **Onboarding WS1** |
| `api-reference.md` | Entirely Notion MCP; delete or rewrite | **Onboarding WS1** |

### docs/research/

| File | Issue | Bucket |
| --- | --- | --- |
| `README.md` | Stale; references non-existent targets | **Onboarding WS1** |

### apps/oak-search-cli/

| File | Issue | Bucket |
| --- | --- | --- |
| `README.md` | Add threads to CLI table | **Pre-onboarding P3** |
| `docs/README.md` | Broken links, stale commands | **Pre-onboarding P3** |
| `docs/ES_SERVERLESS_SETUP.md` | Old app name | **Pre-onboarding P3** |
| `docs/IR-METRICS.md` | Scope update | **Pre-onboarding P3** |
| `docs/NEW-SUBJECT-GUIDE.md` | Broken GROUND-TRUTH-PROCESS links | **Pre-onboarding P3** |
| `docs/ROLLUP.md` | Verify revalidateTag | **Pre-onboarding P3** |
| `docs/SDK-ENDPOINTS.md` | Archive | **Pre-onboarding P1** |
| `src/adapters/README.md` | Align examples with schema | **Pre-onboarding P7** |
| `src/lib/search-quality/ground-truth/README.md` | Broken protocol links | **Pre-onboarding P3** |
| `src/lib/search-quality/ground-truth/GROUND-TRUTH-GUIDE.md` | Scope update | **Pre-onboarding P3** |
| `src/lib/search-quality/ground-truth-archive/README.md` | Wrong content | **Pre-onboarding P3** |
| 6 `operations/` READMEs | Wrong-workspace content | **Pre-onboarding P3** |
| `evaluation/README.md` | Broken DIAGNOSTIC-QUERIES link | **Pre-onboarding P3** |
| `evaluation/analysis/README.md` | Broken GROUND-TRUTH-PROCESS links | **Pre-onboarding P3** |
| `evaluation/experiments/README.md` | Wrong-workspace content | **Pre-onboarding P3** |
| `evaluation/validation/README.md` | Broken GROUND-TRUTH-PROCESS links | **Pre-onboarding P3** |
| `ground-truths/README.md` | Broken GROUND-TRUTH-PROCESS link | **Pre-onboarding P3** |
| `bulk-downloads/README.md` | Old workspace name | **Pre-onboarding P3** |

### apps/oak-curriculum-mcp-streamable-http/

| File | Issue | Bucket |
| --- | --- | --- |
| `docs/BUILD_VERIFICATION.md` | Remove test:e2e:built refs | **Pre-onboarding P4** |
| `docs/DEPLOYMENT_FIX_SUMMARY.md` | Archive | **Pre-onboarding P1** |
| `docs/dev-server-management.md` | Fix link path | **Pre-onboarding P4** |
| `docs/headless-oauth-automation.md` | Archive | **Pre-onboarding P1** |
| `docs/middleware-chain.md` | Fix archived link | **Pre-onboarding P4** |
| `docs/TESTING_GAP_ANALYSIS.md` | Remove test:e2e:built refs | **Pre-onboarding P4** |
| `docs/clerk-oauth-trace-instructions.md` | Confirm plan link | **Pre-onboarding P4** |
| `smoke-tests/OAUTH-VALIDATION-RESULTS.md` | Confirm plan link | **Pre-onboarding P4** |
| `.agent/prompts/learn-about-oak-cta.prompt.md` | Align with implementation | **Pre-onboarding P4** |
| `README.md` | Node.js 22 -> 24.x | **Pre-onboarding P7** |

### apps/oak-curriculum-mcp-stdio/

| File | Issue | Bucket |
| --- | --- | --- |
| `SDK_NOTES.md` | Confirm if done; update or archive | **Pre-onboarding P4** |

### packages/

| File | Issue | Bucket |
| --- | --- | --- |
| `oak-curriculum-sdk/docs/docs-pipeline.md` | Node 22 -> 24.x; GO.md ref | **Pre-onboarding P4** |
| `libs/logger/README.md` | Migration guide uses deprecated API | **Pre-onboarding P4** |

### .agent/directives/

| File | Issue | Bucket |
| --- | --- | --- |
| `AGENT.md` | pnpm check description | **Pre-onboarding P5** |
| `AGENT.md` | GO.md reference | **Onboarding WS1** (part of GO.md decision) |

### .agent/plans/

| File | Issue | Bucket |
| --- | --- | --- |
| `high-level-plan.md` | Mark Notion removal complete | **Pre-onboarding P5** |
| `openapi-to-mcp-framework-extraction-plan.md` | Broken testing-strategy link | **Pre-onboarding P5** |
| `contract-testing-schema-evolution-plan.md` | Broken directive links | **Pre-onboarding P5** |
| `stryker-integration-plan.md` | GO.md references | **Pre-onboarding P5** |
| `node-sdk-config-and-di-remediation-plan.md` | oak-notion-mcp notes | **Pre-onboarding P5** |
| `global-state-elimination-and-testing-discipline-plan.md` | oak-notion-mcp notes | **Pre-onboarding P5** |

### .agent/research/

| File | Issue | Bucket |
| --- | --- | --- |
| `aila-modular-extraction/` (4 files) | Archive | **Pre-onboarding P1** |
| `roadmap-feature-parity-alignment.md` | Dead link | **Pre-onboarding P5** |
| `error_handling/oak-error-handling-survey.md` | GO.md ref, Notion mention | **Pre-onboarding P5** |

### .agent/reference-docs/

| File | Issue | Bucket |
| --- | --- | --- |
| `README.md` | Dead links; Notion section | **Pre-onboarding P5** |
| `notion-sdk-readme.md` | Archive | **Pre-onboarding P1** |
| `notion-api-overview.md` | Archive | **Pre-onboarding P1** |

### .agent/analysis/

| File | Issue | Bucket |
| --- | --- | --- |
| `build-and-error-analysis.md` | Archive | **Pre-onboarding P1** |

### .cursor/

| File | Issue | Bucket |
| --- | --- | --- |
| `agents/architecture-reviewer.md` | oak-notion-mcp example | **Pre-onboarding P6** |
| `commands/jc-gates.md` | Incomplete gate list | **Pre-onboarding P6** |
| `commands/jc-start-right-thorough.md` | Removed test:e2e:built | **Pre-onboarding P6** |
| `skills/ground-truth-design/SKILL.md` | Deleted test-query scripts | **Pre-onboarding P6** |
| `skills/ground-truth-evaluation/SKILL.md` | Deleted test-query scripts | **Pre-onboarding P6** |
| `rules/invoke-code-reviewers.mdc` | Wrong agent name in example | **Pre-onboarding P6** |

### .claude/

| File | Issue | Bucket |
| --- | --- | --- |
| `commands/jc-quality-gates.md` | Stale commands | **Pre-onboarding P6** |

---

## Quality Gates

After each workstream:

```bash
pnpm format:root
pnpm markdownlint:root
```

After all workstreams:

```bash
pnpm type-check
pnpm lint:fix
pnpm test
```

---

## On Completion

When all workstreams in this plan are complete, return to the parent
plan and begin **WS1: Canonical Onboarding Journey**:

[developer-onboarding-experience.plan.md](developer-onboarding-experience.plan.md)

This plan is a prerequisite for WS1-WS6. It clears all non-onboarding
documentation debt so the onboarding workstreams can focus exclusively
on the developer journey.
