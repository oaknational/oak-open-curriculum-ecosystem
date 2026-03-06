## Session 2026-03-06 — Consolidate Docs

### What Was Done

- Archived 3 completed plans to `agentic-engineering-enhancements/archive/completed/`: `artefact-portability-hardening.plan.md` (all phases 0-9 done), `phase-4-cross-agent-standardisation-execution.md` (superseded by ADR-125), `phase-0-templates-and-components-foundation.md` (completed 2026-02-24).
- Fixed 6 stale cross-references in README, active/README, roadmap, and cross-agent-standardisation plan.
- Updated `search-tool-text-to-query-rename.plan.md` — Phases 3-4 now COMPLETE (reviewer invoked and findings addressed).
- Fitness ceilings: 3 files over (CONTRIBUTING +5, practice-lineage +1, practice-bootstrap +30) — carried from prior sessions.
- Napkin 443 lines, distilled 192/200, practice box empty.

---

## Session 2026-03-06 — Branch Diff Review (text→query rename)

### What Was Done

- Generated full unfiltered diff of `feat/search_qol_fixes` vs `main` (4,785 lines, 106 files, +1019/-599). All changes are uncommitted — no commits ahead of main.
- Wrote diff to `feat-search-qol-fixes-vs-main.diff` at repo root.
- Code reviewer sub-agent reviewed the full diff. Verdict: APPROVED WITH SUGGESTIONS.

### Findings from Review

- 4 private functions in `rrf-query-builders.ts` (lines 187-330) still use `text` as parameter name — missed in Phase 2 corrections
- 3 stale `@param q` TSDoc descriptions in `lessons.ts`, `units.ts`, `sequences.ts` say "with text"
- All other changes are correct — schema-first compliance confirmed, destructuring aliases removed, observability chain fully renamed

### Patterns to Remember

- When generating diffs for review, include ALL files — don't filter based on assumptions about what's "important"
- The `rrf-query-builders.ts` private functions were missed because the plan listed `rrf-query-helpers.ts` (11 functions) but not `rrf-query-builders.ts` (4 functions) — always verify by searching the full codebase, not just the plan inventory

---

## Session 2026-03-06 — Stale Reference Sweep

### What Was Done

- Swept all non-archive markdown files for stale cross-references. Found 39 stale references across ~25 files; 18 were in non-archive files (the rest are in archive directories — historical records, not updated per policy).
- **Category A** (10 files): Updated `semantic-search/active/X` → `semantic-search/archive/completed/X` for plans that had been archived but whose referencing files were never updated. Affected 4 ADRs (092, 096, 100, 111), 2 app docs (IR-METRICS, GROUND-TRUTH-GUIDE), and 4 agent files (experience, research, analysis).
- **Category B** (7 files): Replaced dead links to ephemeral `.cursor/plans/agent_artefact_portability_2c71274b.plan.md` (deleted Cursor plan) with canonical [ADR-125](docs/architecture/architectural-decisions/125-agent-artefact-portability.md). Affected agentic-engineering plans, devx plan, and roadmap.
- Verified remaining `semantic-search/active/` references are all legitimate (2 genuinely active plans, template examples, convention descriptions) or in archive files.

### Patterns to Remember

- Stale reference sweeps should check TWO patterns: (1) `active/` plans that moved to `archive/completed/`, and (2) deleted `.cursor/plans/` ephemeral plans.
- When a Cursor plan is completed and deleted, its references should be updated to the permanent record (usually the ADR it delivered).

---

## Session 2026-03-06 — download-asset Cross-Reference Guidance Fix

### What Was Done

- Diagnosed why agents consistently fail to use `download-asset` when users ask for download links: the `get-lessons-assets` tool description actively steers agents to the Oak website, never mentioning `download-asset`
- Planned and implemented cross-references across all four MCP guidance surfaces:
  1. **Tool description** (`ASSET_DOWNLOAD_NOTE` in `tool-description.ts`): primary action is now `download-asset`, website is stdio fallback
  2. **Workflow** (`lessonPlanning` in `tool-guidance-workflows.ts`): added step 6 for `download-asset`
  3. **Quick Start** (`getGettingStartedMarkdown()` in `documentation-resources.ts`): added step 4
  4. **Prompt** (`getLessonPlanningMessages()` in `mcp-prompt-messages.ts`): added step 7 and updated output bullets
- Regenerated tool definitions via `pnpm sdk-codegen`; verified cross-reference appears in all three generated asset tool files
- Quality gates: build, type-check, lint, format, 42 tests in affected modules all pass (40 failures elsewhere from another agent's in-flight `text`-to-`query` rename)
- Three specialist reviews (mcp-reviewer, code-reviewer, docs-adr-reviewer): all APPROVED, one WARNING remediated (added stdio fallback to workflow step note)

### Patterns to Remember

- **Four MCP guidance surfaces**: tool `description`, workflow data (flows to `get-curriculum-model` + `docs://oak/workflows.md`), documentation resources (`docs://oak/getting-started.md`), and prompt messages. All four must agree when a multi-tool workflow changes.
- **Tool descriptions are the highest leverage**: per MCP spec, tools are model-controlled via their `description` field. If a description actively directs the agent away from a companion tool, the model cannot discover the intended workflow — even if the companion tool's own description is perfect.
- **Cross-tool references should be bidirectional**: `download-asset` already pointed back to `get-lessons-assets` ("from a previous get-lessons-assets call"), but the reverse link was missing. Both directions are now connected.
- **`getWorkflowsMarkdown()` omits 2 of 7 workflows** (`exploreTopic`, `discoverCurriculum`): pre-existing gap — the `docs://oak/workflows.md` resource shows fewer workflows than `get-curriculum-model`. Worth a future fix.

### Reviewer Invocations

- mcp-reviewer: WARNING (stdio fallback consistency) — remediated
- code-reviewer: APPROVED
- docs-adr-reviewer: APPROVED with WARNING (same stdio note) — remediated

---

## Session 2026-03-06 — Asset Download Proxy Review & Remediation

### What Was Done

- Thorough adversarial review of asset-download-proxy plan using 7 agents (3 codebase explorers + security, wilma, fred, test-reviewer)
- Implemented all 18 remediations across 6 phases (A: DI fixes, B: security hardening, C: streaming resilience, D: schema compliance, E: test quality, F: options object refactor)
- Key changes: `fetch`/`clock`/`oakApiBaseUrl` injected into `AssetDownloadRouteDeps` (ADR-078), HMAC key separation via `deriveSigningSecret()`, JSON canonical form for HMAC payload, `AbortSignal.timeout(30_000)` + `AbortSignal.any()` for upstream timeout, upstream errors mapped to 502, `X-Content-Type-Options: nosniff`, `HandleToolOptions` interface replacing 8 positional params
- Second round of 6 in-repo specialist reviews (`.claude/agents/`): security (LOW RISK), wilma (COMPLIANT), fred (COMPLIANT), ADR reviewer (gaps fixed), test reviewer (no real duplicate), code reviewer (APPROVED)
- Wrote ADR-126: HMAC-Signed Asset Download Proxy — full security analysis, threat model, boundary design
- Moved `deriveSigningSecret` from app layer to SDK layer (code reviewer finding — crypto primitives belong with HMAC functions in download-token.ts)
- Added 3 Clerk skip path tests for `/assets/download/` bypass
- Fixed stale TSDoc, ADR cross-references, double JSDoc comment block
- All quality gates pass: build 14/14, type-check 24/24, lint 0 errors, 715 tests
- Archived plan to `archive/completed/`

### Patterns to Remember

- `AbortSignal.any()` composes multiple abort signals (client disconnect + upstream timeout) — correct pattern for streaming proxies
- HMAC key separation: derive signing secret via `HMAC-SHA256(apiKey, label)` rather than using API key directly — if upstream logs capture Bearer header, signing secret remains safe
- Crypto primitives (`deriveSigningSecret`, `createDownloadSignature`, `validateDownloadSignature`) belong in the SDK layer alongside each other, not scattered across app and SDK
- `z.string().url()` is deprecated in Zod — use `z.url()` instead
- When multiple review agents flag the same boundary issue (Fred + code-reviewer both flagged `deriveSigningSecret` placement), it's a strong signal — fix it

### Reviewer Invocations

- Round 1 (generic agents): security-reviewer, architecture-reviewer-wilma, architecture-reviewer-fred, test-reviewer, 3 × Explore agents
- Round 2 (in-repo agents): security-reviewer, architecture-reviewer-wilma, architecture-reviewer-fred, code-reviewer, test-reviewer, docs-adr-reviewer

---

## Session 2026-03-06 — Commit and Consolidate Docs

### What Was Done

- Committed all changes from the unified sequenceSlug derivation work (90 files, 2125 insertions, 430 deletions). Pre-commit quality gates all passed.
- Ran full consolidate-docs workflow:
  - Archived completed `sitemap-driven-canonical-urls.plan.md` to `archive/completed/`
  - Updated plan statuses and cross-references (4 plans updated, 2 stale links fixed)
  - Graduated "cross-package function moves" troubleshooting entry from napkin to `docs/operations/troubleshooting.md`
  - Slimmed MCP Apps section in `distilled.md` (195 → 186 lines, freed headroom)
  - Checked practice box (empty), experience files (technical content already in permanent docs), code patterns (no new patterns meet barrier)
  - Napkin at 317 lines (no rotation needed)

### Fitness Ceiling Status

| File | Lines | Ceiling | Status |
|------|-------|---------|--------|
| `CONTRIBUTING.md` | 405 | 400 | OVER (+5) |
| `practice-lineage.md` | 321 | 320 | OVER (+1) |
| `practice-bootstrap.md` | 430 | 400 | OVER (+30) |
| `testing-strategy.md` | 393 | 400 | WARNING |
| `distilled.md` | 186 | 200 | OK (was 195) |

### Patterns to Remember

- When archiving plans, run `rg` sweep for all cross-references immediately — Cursor plan files had stale paths
- Consolidation is most efficient when sub-agents gather inventory (plans, fitness, experience, practice-box) in parallel at the start

---

## Session 2026-03-06 — Unified sequenceSlug Derivation (Phases 4 + 6)

### What Was Done

- **Phase 4**: Moved `deriveSubjectSlugFromSequence` and `derivePhaseSlugFromSequence` from search-cli `slug-derivation.ts` into curriculum-sdk `sequence-slug-derivation.ts`. Updated all callers in search-cli to import from SDK. Fixed 5 inline slug derivation bugs (compound subjects in `hybrid-data-source.ts`, `bulk-ingestion.ts`, `bulk-rollup-builder.ts`, and 2 diagnostic scripts). Deleted local `slug-derivation.ts` and test file.
- **Phase 6**: Removed stale `thread_url` from 6 widget fixture/test locations. Cleaned up duplicate test. Updated widget-rendering.md docs. Ran full quality gate sweep (14/14 build, 24/24 type-check, 27/27 lint, 24/24 test).
- **Additional fixes**: Resolved pre-existing `no-useless-assignment` lint error in `aggregated-fetch.ts`, reduced `extractContextFromResponse` complexity in `response-augmentation.ts` with `shouldExtract` helper, fixed TSDoc escaping.

### Patterns to Remember

- After moving functions between packages, must rebuild the source package (`pnpm --filter <pkg> build`) before downstream tests will see the new exports via the dist output
- `let x: T = defaultValue` followed by `try { x = compute(); } catch { x = defaultValue; }` triggers `no-useless-assignment` — use `let x: T;` without initial assignment instead
- When removing a field from test fixtures, check ALL Pick types that reference it — TypeScript won't error if an optional field is removed from a Pick, but it will leave stale type surface
- Diagnostic scripts in `scripts/` folder are easy to miss during consolidation sweeps — always search them too
- `extractContextFromResponse` has a cyclomatic complexity ceiling of 8 — extracting a `shouldExtract(targetType, contentType)` helper reduces branching

### Reviewer Invocations

- Phase 4: code-reviewer + test-reviewer + architecture-reviewer-barney
- Phase 6: code-reviewer + architecture-reviewer-betty (final)

---

## Session 2026-03-06 — Canonical URL Generation Fixes (Phases 1-5)

### What Was Done

- **Phase 1**: Fixed SDK codegen `urlForSequence` and `urlForUnit` to use `/teachers/curriculum/` instead of `/teachers/programmes/`. Unit context changed from `{ subjectSlug, phaseSlug }` to `{ sequenceSlug }`. New generator test file with null-guard assertions.
- **Phase 2**: Updated response augmentation `extractUnitContext` to derive `sequenceSlug` from `subjectSlug + '-' + phaseSlug`. Updated `UnitContext` type. All 639 curriculum-sdk tests pass.
- **Phase 3**: Consolidated search-CLI onto SDK URL helpers. `canonical-url-generator.ts` now delegates to SDK. Removed broken `UNIT_BASE_URL` from `bulk-rollup-builder.ts`. Made `thread_url` optional in schema. Threads no longer generate dead URLs.
- **Phase 4**: Enhanced sitemap scanner to capture `/curriculum/` URLs. Documented as CI validation tooling, not build dependency.
- **Phase 5**: All quality gates green (build 14/14, type-check 24/24, all tests pass). Architecture and code reviews completed.

### Architecture Review Findings (Betty + Code Reviewer)

- DRY chain `SDK codegen → curriculum-sdk → search-CLI` is correct dependency direction
- search-CLI importing directly from `@oaknational/sdk-codegen/api-schema` is a minor boundary concern (Betty suggests routing through curriculum-sdk facade) — follow-up item
- `sequenceSlug` derivation (`subjectSlug + '-' + phaseSlug`) duplicated in response-augmentation.ts and canonical-url-generator.ts — should be centralised in a shared utility in a follow-up
- `thread_url` soft-deprecation (optional, not removed) is correct for live ES index backwards compatibility
- Pre-existing: bare `catch {}` in `aggregated-fetch.ts:146` silently swallows canonical URL errors — should bind error variable and log

### Patterns to Remember

- TSDoc braces (`{sequenceSlug}`) must be escaped as `\{sequenceSlug\}` in generated output to avoid tsdoc/syntax lint warnings
- When testing code generators, regex-matched assertions MUST have `expect(match).not.toBeNull()` guards to prevent silent passes
- Turborepo cache can be stale after cross-package changes — re-run affected workspace tests directly when the full `pnpm test` shows cached failures
- `as string` assertions violate project rules even when "obviously safe" — use null-guard + throw instead

### Reviewer Invocations

- Phase 2: code-reviewer + test-reviewer
- Phase 3: code-reviewer + test-reviewer
- Phase 5: architecture-reviewer-betty + code-reviewer (final)

### Open Follow-ups

- Route search-CLI SDK imports through curriculum-sdk facade (boundary hygiene)
- Centralise `deriveSequenceSlug(subjectSlug, phaseSlug)` as a shared SDK utility
- Upstream API wishlist: expose `sequenceSlug` directly for exam-board sequences
- Add debug-level logging to `aggregated-fetch.ts` catch block for canonical URL errors
- Run `scan-teacher-sitemaps.mjs` in CI as periodic URL pattern drift check

---

## Session 2026-03-05 — Canonical Rules Migration and Practice Core Platform Agnosticism

### What Was Done

- Created `.agent/rules/` directory with 16 canonical operational rule files — short imperative reinforcements of policy directives.
- Rewrote all 18 `.cursor/rules/*.mdc` files as thin wrappers pointing at `.agent/rules/*.md` or `.agent/skills/*/SKILL.md`.
- Rewrote all 6 `.claude/rules/*.md` files as thin wrappers pointing at canonical rules.
- Updated practice-core trinity to properly encode platform-agnostic artefact model:
  - `practice-bootstrap.md`: Added Artefact Model table, canonical rule format, trigger wrapper formats, removed Cursor-specific content.
  - `practice-lineage.md`: Updated §Always-Applied Rules and §Growing a Practice to be platform-agnostic.
  - `practice.md`: Updated Tooling section to name all four platforms.
- Moved `.agent/directives/lint-after-edit.md` content into `.agent/rules/lint-after-edit.md` (operational, not policy).
- Moved `.agent/directives/semantic-search-architecture.md` to `docs/agent-guidance/` (domain-specific, not a directive). Updated 7 cross-references.
- Updated `artefact-inventory.md` to include `.agent/rules/` as Layer 1 canonical content.
- Updated `validate-portability.mjs` to check triggers reference `.agent/rules/` or `.agent/skills/` (not directives directly).
- Portability check passes: 16 canonical rules, 18 Cursor triggers, 6 Claude rules.

### Patterns to Remember

- **Three-layer rules model**: Directives (policy) → Canonical rules (operational reinforcement) → Platform triggers (thin activation wrappers). No double indirection.
- **Boundary: rules vs skills**: Rules are short imperatives ("do this every time"). Skills are procedural workflows ("here's how"). Wrappers point at one or the other, never both.
- **Write tool cache expiry**: When batch-rewriting files, the Write tool's "file has been read" cache can expire between parallel reads and writes. Use bash `cat > file << 'ENDFILE'` as a reliable alternative for bulk file creation.
- **Directives are policy, not operations**: `.agent/directives/` should contain only authoritative policy documents. Operational guidance (lint-after-edit) belongs in `.agent/rules/`. Domain-specific architecture (semantic-search-architecture) belongs in `docs/agent-guidance/`.

### Mistakes Made

- Attempted to use Write tool on files whose Read cache had expired — failed on 8 files. Switched to bash heredoc approach.
- Initially conflated "Rules" with "Directives" in the Artefact Model table, implying directives = rule policies. User correctly identified that directives are the broader policy category.

---

## Session 2026-03-05 — MCP App Skills and Roadmap Hygiene

### What Was Done

- Created 4 Oak-specific MCP App skill variants in `.agent/skills/`: `mcp-create-app`, `mcp-migrate-oai`, `mcp-add-ui`, `mcp-convert-web`.
- Created Cursor and Codex platform adapters for each (12 new files total). Portability check passes at 16 skills.
- Updated roadmap Non-Goals with item 6 (stdio server explicitly out of scope).
- Updated Domain C "Deployment mode assumption" with explicit app scope note.
- Assessed Practice Core platform agnosticism (see findings below).
- Assessed `mcp-ui` library (see findings below).

### Key Findings

- **Practice Core**: Philosophy/structure layers are properly platform-agnostic. However, `practice-bootstrap.md` leaks Cursor-specific details (`.mdc` frontmatter, `alwaysApply: true`, `@` prefix syntax, Cursor YAML agent definitions) without a "these are examples; adapt to your platform" framing. `practice.md` line 66 also mentions `.mdc` specifically. Fix: add a platform-examples preamble to `practice-bootstrap.md`.
- **`mcp-ui` library** (`MCP-UI-Org/mcp-ui`): pioneered MCP Apps pattern; influenced the official spec. For Oak (server-only): `@mcp-ui/server` (`createUIResource`) is redundant — `ext-apps/server` is the canonical SDK. `@mcp-ui/client` is for host renderers (not Oak's use case). Worth monitoring for C3 widget migration patterns (async `connect()`, `ontoolresult` patterns) but should NOT be added as a dependency.
- **ext-apps skills inventory**: four upstream skills — `create-mcp-app`, `migrate-oai-app`, `add-app-to-server`, `convert-web-app`. All four now have Oak-specific canonical skills.
- **Portability check**: 16 canonical skills (previously 12), 10 commands, 36 command adapters, all passing.

### Open Follow-ups

- `practice-bootstrap.md` platform-agnosticism fix: add preamble "Examples use Cursor syntax; adapt to your platform" before the Cursor-specific sections.
- Fitness signals still above ceiling (non-blocking): `CONTRIBUTING.md` (405/400), `practice-lineage.md` (321/320).

## Session 2026-03-05 — MCP Apps Roadmap Deep Review

### What Was Done

- Reviewed `mcp-apps-standard-migration.plan.md` (active, since promoted to roadmap by other agent).
- Deep-reviewed `roadmap.md` after other agent incorporated initial feedback.
- Read `mcp-apps-support.research.md` — already answers both Domain A validation questions.
- Read `@modelcontextprotocol/ext-apps/server` type declarations — v1.1.2 installed across all
  workspaces. `registerAppTool`/`registerAppResource`/`getUiCapability`/`RESOURCE_MIME_TYPE` are
  the canonical migration vehicle for Domain C items C4/C5/C6.
- Rewrote `roadmap.md` to template compliance: Status, Execution Order, Phase Details,
  Documentation Sync, Gate-to-Domain mapping, Related Documents. Trimmed 20-item exit criteria
  to 6 phase-level conditions. Removed 23-URL source list (superseded by research artefact).

### Key Findings

- Domain A is complete — `chatgpt-mcp-acceptance-validation` and `domain-a-source-refresh` now
  marked done in frontmatter. Domain C items C1/C2/C5 are unblocked.
- `_meta.ui.domain` only required if widget makes direct cross-origin `fetch()` from iframe.
  If all data flows through the MCP bridge, omit it — no host-specific derivation needed.
- `reframing-adr` added as the first concrete pending deliverable (blocks Domain C).
- Archived `auth-safety-correction.plan.md` (call-time deny-by-default) correctly superseded
  by C8 (startup fail-fast invariant). User confirmed archived plan was overkill.

### Open Signals

- `CONTRIBUTING.md` at 405/400 (non-blocking, third session in a row).
- `practice-lineage.md` at 321/320 (non-blocking, carried).
- `distilled.md` ESM bullet graduated to permanent docs; now 195/200.

## Session 2026-03-05 — Distillation Rotation

### What Was Done
- Ran `jc-consolidate-docs` workflow across plans, prompts, memory, and practice-core.
- Rotated napkin at 816 lines to archive: `.agent/memory/archive/napkin-2026-03-05.md`.
- Carried forward new high-signal operational patterns into `.agent/memory/distilled.md`.
- Verified practice-box inbox is clear (`.agent/practice-core/incoming/` contains only `.gitkeep`).

### Patterns to Remember
- After moving or archiving plan files, run repo-wide reference sweeps to remove stale links immediately.
- For fail-fast security work, enforce invariants at startup boundaries and terminate on invalid metadata with actionable remediation.
- Keep E2E assertions focused on system invariants; keep adapter/stub semantic proofs in SDK unit/integration tests.

### Open Follow-ups
- Fitness signals still above ceiling (non-blocking): `CONTRIBUTING.md` (405/400), `practice-lineage.md` (321/320).

## Session 2026-03-05 — Security Alert Triage

### Context
- Reviewed Dependabot (22 open) + CodeQL (52 open) alerts for `oaknational/oak-open-curriculum-ecosystem`.
- WebFetch returns 404 for GitHub security pages (auth required) — use `gh api` instead.
- `pnpm why` returns empty for phantom lockfile entries — always cross-check with `grep` on `pnpm-lock.yaml`.
- `qs` has TWO resolved versions (6.14.0 vulnerable, 6.15.0 patched) — the Dependabot alert is NOT a false positive.
- `hono`/`@hono/node-server` are transitive deps of `@modelcontextprotocol/sdk@1.27.0`, not direct deps in any workspace.
- `axios` override at `pnpm.overrides.axios` in root `package.json`, not a direct dependency.

### Key Finding
- Most CodeQL HIGH alerts are false positives (test regex assertions, codegen escaping, standard auth middleware).
- True positives: unpinned GitHub Actions (supply chain), missing app-level rate limiting (mitigated by Vercel).
- All Dependabot runtime alerts are patchable via overrides or parent bumps.

### Dismissals
- Dismissed 45 CodeQL false positives via `gh api` PATCH with `state: "dismissed"`, `dismissed_reason`, and `dismissed_comment`.
- 7 remain open intentionally: 5 missing-rate-limiting (#4–#8), 2 unpinned-action-tag (#1, #2).
- 48 total dismissed (45 this session + 3 previously dismissed).
- API format: `gh api repos/OWNER/REPO/code-scanning/alerts/NUM -X PATCH --input -` with JSON body.

## Session 2026-03-05 — Batch 1 Security Deps Execution

### Key Discoveries
- MCP SDK 1.27.1 still resolves to `hono@4.11.9` — lockfile keeps existing compatible versions. Need explicit `pnpm.overrides` to force patched transitive deps.
- `pnpm install --no-frozen-lockfile` required when overrides change.
- Security overrides should use `>=` (not `^`) to match existing pattern and avoid major-resolution conflicts.
- `docker manifest inspect` hangs in this environment — use version tag pinning as fallback.
- `release.yml` on `push: [main]` can publish even when CI fails — fixed with `workflow_run` + `if: conclusion == 'success'`.
- `pnpm sdk-codegen` rerun required after any `openapi-typescript` bump per ADR-031 — confirmed no drift here.

### Follow-ups (not blocking)
- Centralise `@elastic/elasticsearch` version policy via root override.
- `@oaknational/curriculum-sdk` exports elasticsearch surface but has it only as devDependency.
- Remove transitive overrides (`rollup`, `qs`, `hono`, `@hono/node-server`) once upstream ships patched versions.

## Session 2026-03-05 — SDK Fixes and Batch 2 Execution

### Key Discoveries
- ESLint 10 drops `@eslint/eslintrc` — removes minimatch@3 + ajv@6 (resolves 13 Dependabot alerts at source).
- New `preserve-caught-error` rule (eslint-plugin-sonarjs@4) — `throw new Error(msg)` in catch blocks must include `{ cause: caughtVar }`. 7 fixes in sdk-codegen codegen/e2e scripts.
- `eslint-plugin-import`, `eslint-plugin-import-x`, `eslint-plugin-react`, `eslint-plugin-react-hooks` all have stale peer dep ranges (declare up to `^9`). Fix: add `pnpm.peerDependencyRules.allowedVersions` entries in root `package.json`.
- openapi-fetch 0.17 wraps response types through `Readable<T>` from openapi-typescript-helpers@0.1.0. `Readable<T>` strips `?:null` properties (because `NonNullable<null>` = `never`, and `never extends $Write<any>` is vacuously true). `canonicalUrl?: null` on `/threads` and `/threads/{threadSlug}/units` responses were stripped — fix: use literal `null` instead of reading from response object.
- openapi-fetch 0.17 adds `pathSerializer: PathSerializer` as required field in `MergedOptions`. Tests constructing `MergedOptions` directly need `defaultPathSerializer`.
- Clerk Core 3 released 2026-03-03. `@clerk/backend` v3, `@clerk/express` v2. Key change for this codebase: `@clerk/types` moved to `@clerk/shared/types` — `PendingSessionOptions` import path updated in 2 files.
- `req.auth` in Core 3 Express is still a callable function (confirmed from @clerk/express v2 source). `getAuth(req)` calls `req.auth(options)` internally. "Object-access removed" means `req.auth.userId` direct access, not the callable pattern.

### Follow-ups (not blocking)
- `extractAuthContext` in `tool-auth-context.ts` is dead code (only used in unit tests, not production). Could be removed or switched to `getAuth(req)` pattern in a future cleanup.
- Four bare `catch {}` blocks in `generate-ai-doc.ts` and `generate-markdown-docs.ts` discard original error without `cause` — `preserve-caught-error` doesn't fire because the variable isn't bound. Future hardening opportunity.
- `generate-ai-doc.ts` has `eslint-disable max-lines` — violates Never Disable Checks. Pre-existing.

## Session 2026-03-06 — Canonical URL Generation Fixes (Completed)

### What Was Done
- Fixed 5 broken canonical URL patterns across 4 locations in the monorepo
- **SDK codegen generator** (`generate-url-helpers.ts`): fixed `urlForSequence` (`/programmes/` → `/curriculum/`) and `urlForUnit` (changed context from `{subjectSlug, phaseSlug}` to `{sequenceSlug}`)
- **Response augmentation** (`response-augmentation.ts`): updated `extractUnitContext` to derive `sequenceSlug = subjectSlug + '-' + phaseSlug` (derivation belongs in augmentation layer, keeping URL helper pure)
- **Search-CLI** (`canonical-url-generator.ts`): delegated all URL generation to SDK helpers; `generateThreadCanonicalUrl` now returns `null` (threads have no OWA page)
- **Search-CLI** (`bulk-rollup-builder.ts`): removed local `UNIT_BASE_URL` constant; `transformBulkUnitToSummary` now accepts explicit `sequenceSlug` parameter and passes it directly to `generateCanonicalUrlWithContext` (not re-derived from `subjectSlug+phaseSlug`)
- **Thread schema** (`field-definitions/curriculum.ts`): changed `thread_url` from `optional: false` to `optional: true`; removed `thread_url` from `thread-document-builder.ts` output
- **Sitemap scanner**: enhanced to capture `/teachers/curriculum/` URLs; added `--validate` mode for CI use
- All quality gates pass: 24/24 workspaces, 971 tests in search-CLI

### Key Patterns
- **sequenceSlug derivation**: Response augmentation layer derives `sequenceSlug` from API fields; URL helper is a pure function that just constructs the URL. Bulk pipeline passes `sequenceSlug` explicitly.
- **Code reviewer caught a bug**: `transformBulkUnitToSummary` was using `sequenceSlug` as a boolean gate but re-deriving the slug from `subjectSlug+phase` internally. Fixed to pass `sequenceSlug` directly to `generateCanonicalUrlWithContext`.
- **Exam-board sequences**: Test added for `science-secondary-aqa` to verify explicit `sequenceSlug` is used, not derived. Derived approach would silently produce wrong URL for these.
- **`void` for unused-but-required params**: Used `void threadSlug` in `generateThreadCanonicalUrl` to consume the parameter for API compatibility without underscore prefix or disabling ESLint.

### Remaining Follow-ups (non-blocking)
- ES re-index of `oak_threads` to clear stale `thread_url` values from existing documents
- API wishlist: upstream API to expose `sequenceSlug` directly on unit responses (removes derivation ambiguity)

## Session 2026-03-05 — Canonical URL Inconsistency Discovery

### Key Finding
Two canonical URL generators in the codebase disagree about threads:
1. `oak-search-cli/src/lib/indexing/canonical-url-generator.ts` constructs `/teachers/curriculum/threads/{threadSlug}` — treats threads as having canonical URLs.
2. `packages/sdks/oak-sdk-codegen/code-generation/typegen/routing/generate-url-helpers.ts` returns `null` for threads — "data concepts without canonical URLs".

The SDK codegen drives the response augmentation middleware, so the enhanced API schema ends up with `canonicalUrl: null` for threads. This is inconsistent with the search indexing layer.

### Architecture Reminder (from user)
- Upstream API does NOT include canonical URLs for everything.
- Where the website has pages, URLs are **constructed** from available data.
- This is why there are TWO copies of the spec: as-served and enhanced (with decorations like canonical URLs).
- "Just because the upstream API returns null does not mean the resource has no URL on the website."

### Resolved Questions (confirmed against OWA source `src/pages/teachers/` and live site)
- **Threads**: No pages at all. Zero thread routes in OWA. Thread highlighting is client-side within `[subjectPhaseSlug]/[...slugs].tsx` catch-all. SDK codegen returning `null` is correct.
- **Lessons**: True canonical page at `/teachers/lessons/[lessonSlug].tsx`. Codegen correct.
- **Sequences**: Have pages at `/teachers/curriculum/{sequenceSlug}/units`. **BUG**: codegen `urlForSequence` generates `/teachers/programmes/{slug}/units` which **404s**. Correct path is `/teachers/curriculum/{slug}/units`. Same bug in search-cli `generateSequenceCanonicalUrl`.
- **Units**: Have pages within the curriculum context at `/teachers/curriculum/{sequenceSlug}/units/{unitSlug}` (handled by OWA catch-all `[subjectPhaseSlug]/[...slugs].tsx`). No standalone `/teachers/units/{unitSlug}`. Codegen currently generates `/teachers/programmes/{subject}-{phase}/units/{unitSlug}` which also **404s** — wrong base path.
- `oak-search-cli/src/lib/indexing/canonical-url-generator.ts` `generateThreadCanonicalUrl` generates dead URLs (`/teachers/curriculum/threads/{threadSlug}` 404, no OWA route). Bug.

### Plan Created
- Wrote executable plan: `.agent/plans/sdk-and-mcp-enhancements/active/sitemap-driven-canonical-urls.plan.md`
- Updated active README to list it
- Plan is self-contained with all investigation context for next-session pickup

### URL Pattern Summary (verified)
| Content Type | Pattern | Status |
|---|---|---|
| Lesson | `/teachers/lessons/{lessonSlug}` | Correct in codegen |
| Sequence | `/teachers/curriculum/{sequenceSlug}/units` | **BUG**: codegen uses `/programmes/` |
| Unit (in curriculum) | `/teachers/curriculum/{sequenceSlug}/units/{unitSlug}` | **BUG**: codegen uses `/programmes/{subject}-{phase}/units/{unitSlug}` |
| Unit (in programme) | `/teachers/programmes/{programmeSlug}/units/{unitSlug}/lessons` | Exists on OWA, not generated |
| Thread | None | Correct (`null` in codegen) |

## Session 2026-03-05 — Search SDK GitHub Release Asset Planning (Engineering End Users)

### What Was Done

- Applied `jc-start-right-quick` grounding and `jc-plan` workflow for this
  planning task.
- Investigated current Search SDK packaging and release automation:
  - `packages/sdks/oak-search-sdk/package.json`
  - `packages/sdks/oak-search-sdk/tsup.config.ts`
  - `.github/workflows/release.yml`
  - `.releaserc.mjs`
- Confirmed current Search SDK build is unbundled and not self-contained for
  external consumers.
- Created executable plan:
  `.agent/plans/user-experience/engineering-end-users/current/search-sdk-github-release-asset-distribution.execution.plan.md`
- Added discoverability links:
  - `.agent/plans/user-experience/engineering-end-users/current/README.md` (new)
  - `.agent/plans/user-experience/engineering-end-users/README.md`
  - `.agent/plans/user-experience/roadmap.md`
  - `.agent/plans/user-experience/README.md`

### Key Findings

- The current `oak-search-sdk` build (`bundle: false`) leaves runtime imports to
  internal workspace packages (`@oaknational/result`,
  `@oaknational/sdk-codegen`, `@oaknational/logger`), so `dist/` cannot be used
  directly in another repo.
- semantic-release is already the canonical release orchestrator; adding release
  assets via `@semantic-release/github` is the idiomatic extension path.
- `@semantic-release/github` supports templated asset names/labels using
  `${nextRelease.gitTag}`, so artefacts can be built with stable local paths and
  uploaded with versioned release names.
- `pnpm pack` on the current package yields an archive but does not solve
  self-containment by itself because internal runtime imports remain.

### Planned Direction

- Keep existing unbundled workspace build for monorepo development.
- Add a release-only bundled lane that emits a self-contained ESM tarball and
  checksum.
- Attach artefacts to semantic-release GitHub releases.
- Provide retrieval-focused import guidance while keeping full surface export;
  enforce operational access with Elasticsearch API-key scopes.
