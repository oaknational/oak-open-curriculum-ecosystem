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
