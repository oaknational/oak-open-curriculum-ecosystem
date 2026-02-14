# Public Release Readiness

**Status**: Complete (npm publish deferred until token is created)
**Parent**: [../README.md](../README.md) | [../roadmap.md](../roadmap.md)
**Last Updated**: 14 Feb 2026

---

## Instruction

This plan prepares the repository for public visibility on GitHub
and selected SDKs/libraries for publication as public npm packages
under the `@oaknational` scope.

This repository has **multiple co-existing legal constraints** that must be
reflected clearly and consistently across `LICENSE`, `README.md`, workspace
READMEs, and publication artefacts:

- **Code** in this repository is released under the **MIT licence**.
- **Curriculum content** accessed via the Oak Open Curriculum API is made
  available under the **Open Government Licence (OGL) v3.0**, except where
  otherwise stated, and requires **attribution** when reused.
- **Oak branding and trademarks** (including Oak name/logo/brand imagery) are
  **not** granted under MIT. They must not be reused without permission and
  must not be used to promote similar products or imply endorsement.
- **No endorsement / no association**: third parties must not represent
  themselves as being associated with or endorsed by Oak National Academy.

It contains six workstreams and a final quality gate.
**Execute all of them.** Each workstream is self-contained with
a problem statement, concrete file-level instructions, and a
completion checklist. Mark each workstream done as you finish it.

**External contributions are not accepted at this time.** The
documentation must reflect this clearly and politely. Internal
onboarding for Oak team members must be complete and accurate.
Detailed onboarding refinement is tracked in
`active/developer-onboarding-experience.plan.md` to keep this
plan focused on release blockers.

**Scope decision (2026-02-12)**: for the first public npm release,
publish only `@oaknational/curriculum-sdk`. All other workspaces
remain private (`private: true`) for now.

**SDK rename (2026-02-14)**: package renamed from
`@oaknational/oak-curriculum-sdk` to `@oaknational/curriculum-sdk`.
The workspace directory remains `packages/sdks/oak-curriculum-sdk`.

**npm publish status (2026-02-14)**: `npmPublish` is set to `false`
in `.releaserc.mjs` until an `NPM_TOKEN` is created and added to
GitHub Secrets. The `@oaknational` npm organisation scope is confirmed
correct. All other release automation is in place.

**Credential policy (2026-02-12)**: real credentials are allowed only
 in local `.env*` files that are not committed. `.env.example` files
 and all other tracked files must contain placeholders/redacted values.

---

## Alignment With Repository Directives

This plan is a public-release checklist, but it must still follow the repo’s
directives:

- Before making changes, apply the First Question: could it be simpler without
  compromising quality?
- Use British English and British spelling in docs and user-facing text (for
  example: “licence”, “behaviour”).
- Avoid emojis in repository-authored documentation (unless explicitly requested).
- Do not work around quality gates. Fix root causes.
- Respect schema-first generation: do not introduce hand-authored static types or
  validators that should flow from `pnpm type-gen`.

If any instruction in this plan conflicts with `.agent/directives/*`, update the
plan first, then proceed.

---

## Session Cut-Point (Next Session)

The plan can be resumed in a staged fashion. If a future session is secrets-only:

- Execute only `WS1` end-to-end.
- Mark `WS1` complete and stop.
- Leave `WS2` onward, including `QG`, as pending.
- Resume with `WS2` at the start of the next session.

Otherwise (normal progression), resume at the first non-complete workstream in
the status table below.

---

## Workstream Status

| ID | Workstream | Status |
| --- | --- | --- |
| WS1 | [Secrets audit and remediation](#workstream-1-secrets-audit-and-remediation) | Complete (including key rotation) |
| WS2 | [Licence and legal](#workstream-2-licence-and-legal) | Complete |
| WS3 | [Package.json standardisation](#workstream-3-packagejson-standardisation) | Complete |
| WS4 | [Documentation overhaul](#workstream-4-documentation-overhaul) | Complete |
| WS5 | [GitHub repository configuration](#workstream-5-github-repository-configuration) | Complete |
| WS6 | [Publication dry run](#workstream-6-publication-dry-run) | Complete |
| QG | [Quality gates](#quality-gates) | Complete |

**Recommended order**: WS1 (blocking) -> WS2 -> WS3 -> WS4 -> WS5 -> WS6 -> QG.

WS1 is critical and must complete first -- secrets in tracked
files will be exposed the instant the repo goes public. WS2
creates the licence file that WS3 references. WS4 depends on
WS3 decisions (which packages are public). WS5 and WS6 are
independent of each other.

---

## Workstream 1: Secrets audit and remediation

**Priority**: CRITICAL -- must complete before any public visibility

**Problem**: secrets previously existed in tracked files and git
history. Before public visibility, we must enforce the credential
location policy and keep a secret scanning gate in place so real
credentials cannot re-enter the repository.

### 1a: Enforce credential location policy

**Policy**:

- Real credentials are allowed only in local, untracked `.env*` files.
- `.env.example` files must contain placeholders only.
- All other tracked files must contain placeholders/redacted values.

**Status (2026-02-14)**: Completed.

**Implemented**:

- `.gitleaks.toml` added with a targeted allowlist for `.agent/reference-docs/**` only (third-party examples).
- `pnpm secrets:scan:all` and `pnpm secrets:scan:all-refs` added (history scans).
- `pnpm check` now runs `pnpm secrets:scan:all` as a quality gate.

- Credential policy added to `README.md`, `CONTRIBUTING.md`, and environment/security guidance docs.
- CI secret scan added with full-history checkout in `.github/workflows/ci.yml`.
- Pre-push gate added in `.husky/pre-push`.
- Docs/ADR updates added for local env policy and line-level exception strategy.

**Status note**: Key rotation was completed as a separate user action on 14 Feb 2026.

### 1b: API keys in experience document

**File**: `.agent/experience/the-api-key-revelation.md`

**Status (2026-02-14)**: Completed. This file contains placeholders only.

**Remediation**:

- Keep the document (it is a valuable reflection) but ensure it never contains real credentials.

**User action required**: Rotate any keys that were ever live, even though the repository history has been scrubbed.
**Status (2026-02-14)**: Completed (user-confirmed rotation).

### 1c: Clerk publishable key and tenant URL across tracked files

**Problem**: the same Clerk test publishable key and tenant URL are
repeated in many tracked files (tests, plans, docs). Even if this is
a test instance, it should not be embedded broadly in public source.

Representative files (not exhaustive):

- `.agent/plans/archive/completed/mcp-oauth-implementation-plan.archive.md`
- `apps/oak-curriculum-mcp-streamable-http/e2e-tests/server.e2e.test.ts`
- `apps/oak-curriculum-mcp-streamable-http/e2e-tests/auth-enforcement.e2e.test.ts`
- `apps/oak-curriculum-mcp-streamable-http/src/auth-routes.integration.test.ts`

**Remediation**:

- Replace tenant-specific values with neutral placeholders in all
  tracked non-`.env*` files:
  `https://REDACTED.clerk.accounts.dev` and `pk_test_REDACTED`.
- For tests, use deterministic non-real stubs (for example
  `pk_test_dummy_for_testing`) rather than tenant-derived values.
- Preserve implementation docs/plans, but redact literal values.

**User action required**: Verify whether the Clerk dev instance
is still active. If so, rotate or decommission it.

### 1d: Secret scanning gates (CI and local)

**Status (2026-02-14)**: Completed.

**Implemented**:

- Local gitleaks gate configured via `.gitleaks.toml` (extends defaults; targeted allowlist for `.agent/reference-docs/**` only).
- Root scripts added:
  - `pnpm secrets:scan:all` (branches + tags)
  - `pnpm secrets:scan:all-refs` (forensics: all refs)
- `pnpm check` runs `pnpm secrets:scan:all` first.
- Pre-push hook runs `pnpm secrets:scan:all` and blocks pushes when scans fail.
- CI runs full-history secret scan and fails on findings in each run.

**Non-goal (to avoid ambiguity)**: Do not add a pre-commit secret scan hook in
this release plan. Enforced gates are CI and pre-push.

### 1e: Known docs examples (no remediation needed)

The following are documentation examples and are not treated as
live secrets:

- `.agent/reference-docs/nextjs-environment-variables.md`
  (`-----BEGIN ... PRIVATE KEY-----` sample block)
- `.agent/reference-docs/clerk-testing.md`
  (`__clerk_testing_token=...` sample token)

These files should remain as documentation unless a separate
documentation policy requires sanitising all token-like examples.

### 1f: Git history scrubbing decision

**Status (2026-02-13)**: Completed.

**Decision**: Scrub git history.

**Execution summary**:

- Repository history was rewritten (all branches + tags) to remove secret values.
- Verified clean with `pnpm secrets:scan:all-refs` (`--all --full-history`) reporting zero leaks.

**Operational note**: All collaborators must re-clone (or hard reset) to the new history. Keep the pre-scrub backup (bundle/mirror) for rollback only.

### Completion checklist

- [x] Credential location policy documented (real keys only in local untracked `.env*`; never in `.env.example` or other tracked files)
- [x] Local secret scanning configured (`.gitleaks.toml`) and wired into `pnpm check` (`pnpm secrets:scan:all`)
- [x] CI secret scan added with targeted allowlist handling
- [x] API keys redacted in `.agent/experience/the-api-key-revelation.md`
- [x] Clerk tenant/publishable values redacted across tracked non-`.env*` files
- [x] Exposed keys rotated (user action; user-confirmed)
- [x] Pre-commit/pre-push secret scan hook evaluated and decision documented
- [x] Git history scrubbing decision made and documented

---

## Workstream 2: Licence and legal

**Problem**: Public repos need a canonical MIT `LICENSE` file, a Code of Conduct,
and explicit documentation of the dual-licensing boundary:

- Code: MIT (this repo)
- Curriculum content retrieved via the Oak Open Curriculum API: OGL v3 (with attribution)
- Oak branding/trademarks: not granted under MIT; no endorsement / no association

Additionally, multiple workspace
`package.json` files declare `"license": "MIT"` without a
corresponding licence file. `CONTRIBUTING.md` has a "Code of
Conduct" section but (previously) no `CODE_OF_CONDUCT.md` file
existed.

**Status (2026-02-14)**:

- `LICENSE` created at root and `LICENSE.md` removed (README licence link now resolves).
- `CODE_OF_CONDUCT.md` created at root with enforcement contact `help@thenational.academy`.

### 2a: Create MIT licence file (code)

**File**: `LICENSE` (root, plain text)

Use the standard MIT licence text with:

- Year: 2024-present (the repo's first commit year to present)
- Copyright holder: Oak National Academy

This must be a plain-text file, not markdown.

**Acceptance criteria**:

- GitHub detects the repository licence as MIT on the default branch.
- `README.md` licence link resolves.
- The published npm package for `@oaknational/curriculum-sdk` includes the
  MIT licence (either via workspace inclusion or by inheriting from root).

### 2b: Create Code of Conduct

**File**: `CODE_OF_CONDUCT.md` (root)

Use Contributor Covenant language (current repo choice: v1.4 wording, based on
`universal-user-agent`'s `CODE_OF_CONDUCT.md`) and set the enforcement contact
to `help@thenational.academy`.

**Acceptance criteria**:

- `CONTRIBUTING.md` links to `CODE_OF_CONDUCT.md` (no broken references).

### 2c: OGL v3 obligations for Oak Open Curriculum API content (data)

**Context**: this repository is open-source code, but it is built to access
lesson content from the Oak Open Curriculum API. Oak’s API terms state that
lesson content provided via the API is made available under OGL v3.0 (except
where otherwise stated) and requires attribution when reused.

**Authoritative sources** (link for readers; do not copy/paste the full text):

- Oak Curriculum API terms: `https://www.thenational.academy/legal/terms-and-conditions-api-version`
- Oak Curriculum API docs terms: `https://open-api.thenational.academy/docs/about-oaks-api/terms`
- OGL v3: `https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/`

**Requirement**: we must document (in-repo) for public users the difference between:

- the MIT licence for this repo’s code, and
- the upstream licence terms for curriculum content retrieved via the API
  (currently OGL v3, set by the API provider, not by us).

**Important**: we do not set or declare the licence for curriculum data — the
upstream API provider does. `LICENCE-DATA.md` is a **notice pointing users to
the upstream licence information**, not a licence declaration by Oak.

**File to create (required)**: `LICENCE-DATA.md` (root)

Include:

- A clear statement that this repository's MIT licence covers the code only,
  not curriculum content.
- A statement that curriculum content accessed via the Oak Open Curriculum API
  is subject to licence terms set by the API provider, which currently makes
  content available under OGL v3.0 (except where otherwise stated).
- Direct the reader to the upstream authoritative sources for the definitive
  terms (Oak API terms, Oak API docs terms, OGL v3).
- Note the upstream attribution requirement and quote the default OGL
  attribution statement for convenience:

  `Contains public sector information licensed under the Open Government Licence v3.0.`
- A warning that some upstream content may include third-party
  rights/trademarks not covered by OGL — consult the upstream terms.

**Acceptance criteria**:

- `README.md` points to `LICENCE-DATA.md` (or an equivalent section) so a
  public user cannot miss it.
- There is no suggestion anywhere in the docs that “MIT covers the data”.
  It does not.

The root `README.md` already notes that curriculum data uses the
[Open Government Licence v3](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).
Verify the README’s OGL mention is correct and add `LICENCE-DATA.md` so that the
dual-licensing boundary cannot be missed.

### 2d: Oak branding, trademarks, and no-endorsement/no-association

**Context**: Oak’s terms and copyright notice make clear that Oak’s branding
and trademarks are owned by (or licensed to) Oak and must not be reused to
promote similar products. Oak’s terms for linking also prohibit claiming
association or endorsement.

**Authoritative sources**:

- Oak site terms: `https://www.thenational.academy/legal/terms-and-conditions`
- Oak copyright notice: `https://www.thenational.academy/legal/copyright-notice`
- Oak legal pages (for readers): `https://www.thenational.academy/legal/terms-and-conditions` and related pages

**Requirement**: the public-facing docs must be explicit that:

- Oak name/logo/brand assets are not licensed under MIT;
- third parties must not represent themselves as being associated with or
  endorsed by Oak National Academy; and
- the code may be forked/modified under MIT, but the fork must not imply
  affiliation or endorsement.

**File to create (required)**: `BRANDING.md` (root)

Include:

- “Oak branding and trademarks are not licensed under MIT.”
- “Do not use Oak branding to suggest endorsement or association.”
- A pointer to Oak’s official legal pages for the definitive guidance.

**Acceptance criteria**:

- `README.md` has a short “Branding and no endorsement” note and links to
  `BRANDING.md`.
- Workspace READMEs that mention Oak brand assets do not contradict this.

### Completion checklist

- [x] `LICENSE` file created at root with correct MIT text (`LICENSE.md` removed)
- [x] `CODE_OF_CONDUCT.md` created (Contributor Covenant language) with enforcement contact
- [x] Dual licensing (code vs data) clearly documented (`LICENCE-DATA.md` points to upstream terms)
- [x] Oak branding/trademark rules and no-endorsement/no-association clearly documented (`BRANDING.md`)
- [x] `README.md` licence link verified working (links to `LICENSE`, `LICENCE-DATA.md`, `BRANDING.md`)

---

## Workstream 3: Package.json standardisation

**Problem**: Across 11 workspace `package.json` files, critical
metadata fields are missing or inconsistent. Before public
release, every package must have correct metadata for both npm
registry presentation and GitHub repository display.

**Workspaces in scope (explicit)**:

- Root: `package.json`
- `apps/oak-curriculum-mcp-stdio/package.json`
- `apps/oak-curriculum-mcp-streamable-http/package.json`
- `apps/oak-search-cli/package.json`
- `packages/core/oak-eslint/package.json`
- `packages/core/openapi-zod-client-adapter/package.json`
- `packages/libs/env/package.json`
- `packages/libs/logger/package.json`
- `packages/libs/result/package.json`
- `packages/sdks/oak-curriculum-sdk/package.json`
- `packages/sdks/oak-search-sdk/package.json`

**Audit command (source of truth)**:

```bash
rg --files -g 'package.json' apps packages | sort
cat package.json
```

### 3a: Classify packages as public or private

**Decision (recorded)**: initial public npm scope is a single package:
`@oaknational/curriculum-sdk`. All other workspaces remain private.

Current state and required target:

| Workspace | Current `private` | Required `private` | Rationale |
| --- | --- | --- | --- |
| Root (`@oaknational/mcp-ecosystem`) | `true` | `true` | Monorepo root, never published |
| `apps/oak-curriculum-mcp-stdio` | missing | `true` | Hold for later release cycle |
| `apps/oak-curriculum-mcp-streamable-http` | `true` | `true` | Deployed service, not an npm package |
| `apps/oak-search-cli` | `true` | `true` | Internal CLI, requires Elasticsearch |
| `packages/core/oak-eslint` | missing | `true` | Internal ESLint config, Oak-specific |
| `packages/core/openapi-zod-client-adapter` | missing | `true` | Hold for later release cycle |
| `packages/libs/env` | missing | `true` | Hold for later release cycle |
| `packages/libs/logger` | missing | `true` | Hold for later release cycle |
| `packages/libs/result` | missing | `true` | Hold for later release cycle |
| `packages/sdks/oak-curriculum-sdk` | missing | **publish** | Core SDK, primary public package |
| `packages/sdks/oak-search-sdk` | missing | `true` | Hold for later release cycle |

**Action**: make `private` explicit on every non-published workspace.
Only `packages/sdks/oak-curriculum-sdk` should be publishable in this
release cycle.

### 3b: Standardise metadata across all workspaces

For every workspace `package.json`, ensure these fields are
present and correct:

**Required for all packages** (public and private):

```json
{
  "author": {
    "name": "Oak National Academy",
    "url": "https://www.thenational.academy"
  },
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/oaknational/oak-mcp-ecosystem.git",
    "directory": "<workspace-relative-path>"
  },
  "bugs": {
    "url": "https://github.com/oaknational/oak-mcp-ecosystem/issues"
  },
  "homepage": "https://github.com/oaknational/oak-mcp-ecosystem/tree/main/<workspace-relative-path>#readme"
}
```

**Additionally required for public (published) packages**:

```json
{
  "publishConfig": {
    "access": "public"
  },
  "keywords": ["<relevant>", "<keywords>"]
}
```

**Important**: Do not rely on historic “missing counts” in this plan. Always
audit the current `package.json` state and then apply the standard template
consistently across all workspaces.

### 3c: Version strategy

Current state: Most packages use `0.0.0-development`. This is
fine for pre-release, but public packages need a real versioning
strategy before first publish.

**Required for this release cycle**:

- Set `packages/sdks/oak-curriculum-sdk/package.json` version to `0.1.0` before the first publish.
- Leave all other workspace versions unchanged (they remain private and are not published).
- Configure semantic-release so subsequent SDK publishes update the version deterministically from conventional commits.

### 3d: Root package.json cleanup

The root `package.json` has:

- `"keywords": ["mcp", "notion", "ai", "llm", "claude"]` --
  "notion" is no longer the focus. Update to reflect the
  current project: `["mcp", "curriculum", "oak", "sdk",
  "education", "ai", "model-context-protocol"]`.
- Missing `author`, `homepage`, `bugs` (add per 3b template).
- `engines.node` says `24.x` but `CONTRIBUTING.md` says
  `22+`. Standardise to `24.x` everywhere. Note: ADR-015
  ("Node.js 22+ Requirement") will also need updating to
  reflect the move to Node.js 24.

### Completion checklist

- [x] Public/private classification decided for all workspaces
- [x] `private: true` added to all non-published packages
- [x] `author` and `contributors` added to all 11 workspaces (Jim Cresswell as author, Oak National Academy as contributor)
- [x] `license` present and correct in every workspace `package.json`
- [x] `repository` (with `directory`) present and correct in every workspace `package.json`
- [x] `homepage` added to all 11 workspaces
- [x] `bugs` added to all 11 workspaces
- [x] `description` present and correct in every workspace `package.json`
- [x] `keywords` present and reviewed across all workspaces (meaningful, not misleading)
- [x] `publishConfig` added to `packages/sdks/oak-curriculum-sdk`
- [x] Version strategy documented and applied (SDK at `0.1.0`)
- [x] Root keywords updated (removed `notion`, added `curriculum`, `oak`, `education`, `model-context-protocol`)
- [x] Node.js version consistent everywhere (`24.x`); ADR-015 updated

---

## Workstream 4: Documentation overhaul

**Scope note**: deep onboarding experience refinement is tracked in
`active/developer-onboarding-experience.plan.md`. WS4 keeps release-
critical documentation updates and cross-links only.

### 4a: Root README.md

**File**: `README.md`

The root README is generally strong. Specific issues to fix:

1. **Stale command references**: The README currently references `pnpm dev:smoke`
   but the actual root scripts are `pnpm smoke:dev:stub`, `pnpm smoke:dev:live`,
   and `pnpm smoke:dev:live:auth`. Fix all smoke command references.

   Audit command:

   ```bash
   rg -n "dev:smoke|pnpm dev:smoke|smoke:dev" README.md
   ```

2. **Contributing section**: Update the README to state that external
   contributions are not accepted at this time (see 4c) and to route security
   reports to `SECURITY.md`.

3. **ADR count**: Verify the ADR count and update the README consistently.

   Audit command (counts ADRs, excluding the ADR index README):

   ```bash
   ls -1 docs/architecture/architectural-decisions/[0-9][0-9][0-9]-*.md | wc -l
   ```

4. **Support & Licensing section**: Remove emojis and ensure it links to:
   `LICENSE`, `LICENCE-DATA.md`, `BRANDING.md`, and `SECURITY.md` as appropriate.

5. **Node.js version**: `.env.example`, `README.md`, and `CONTRIBUTING.md` must all
   agree on Node.js `24.x`.

### 4b: CONTRIBUTING.md overhaul

**File**: `CONTRIBUTING.md`

This file needs significant updates for public readiness:

1. **Contribution status**: Currently says "We welcome internal
   contributions and interest from the wider community." Replace
   with clear language: this project is open-source and public,
   but external contributions (PRs, issues) are not accepted at
   this time. The code is available for reading, forking, and
   learning. Oak team members contribute via internal process.
2. **Node.js version**: CONTRIBUTING currently says "Node.js 22+" -- update
   to `24.x` to match `engines` in root `package.json`.
3. **Error handling section**: CONTRIBUTING references an "ErrorHandler"
   class" which does not exist in the codebase. Replace with
   the actual pattern (Result type from `@oaknational/result`,
   fail-fast with helpful errors).
4. **CONTRIBUTORS.md reference**: CONTRIBUTING promises
   "Listed in CONTRIBUTORS.md" but no such file exists. Either
   create it or remove the reference. Given no external
   contributions are accepted, remove the reference.
5. **Quality gate commands**: CONTRIBUTING shows `pnpm format`,
   `pnpm lint`, etc. The actual commands are `pnpm format:root`,
   `pnpm lint:fix`. Align with the root `package.json` scripts.
6. **E2E test note**: CONTRIBUTING claims E2E tests "Require valid
   OAK_API_KEY" -- this is false. E2E tests use mocks and DI
   (per testing strategy). Only smoke tests require real
   credentials.
7. **Section ordering**: Move "Architecture Guidelines" higher.
   External viewers will want to understand the schema-first
   principle before diving into code standards.

**Audit command**:

```bash
rg -n "Node\\.js 22\\+|Node\\.js 24|dev:smoke|format\\b|lint\\b|CONTRIBUTORS\\.md|ErrorHandler" CONTRIBUTING.md
```

### 4c: External contributor messaging

Create a clear, polite boundary in both `README.md` and
`CONTRIBUTING.md`:

**Required wording** (use exactly in both `README.md` and `CONTRIBUTING.md`):

> This repository is open-source under the MIT licence. You are free to read,
> fork, and learn from the code.
>
> At this time, we are not accepting external contributions (pull requests,
> issues, or feature requests). This may change in the future; watch the
> repository for updates.
>
> If you find a security issue, please follow our
> [security policy](SECURITY.md).

### 4d: Internal onboarding

**Plan**: `active/developer-onboarding-experience.plan.md`

Track deep onboarding improvements in the dedicated plan. In this
release-readiness plan, only ensure public docs link cleanly to the
canonical onboarding path and do not contradict onboarding policy.

### 4e: CHANGELOG.md

**File**: `CHANGELOG.md`

The current file contains entries from the old `oak-notion-mcp`
repository, not from `oak-mcp-ecosystem`. This is confusing and
incorrect.

**Required remediation (no choice)**:

- Replace `CHANGELOG.md` with a single “Unreleased” section noting this is the
  first public release of `oak-mcp-ecosystem`.
- Leave future changelog management to semantic-release once the release workflow
  is corrected for SDK-only publication.

### 4f: Workspace READMEs

Review and improve these workspace READMEs:

| File | Issue | Action |
| --- | --- | --- |
| `packages/core/oak-eslint/README.md` | Does not exist | Create: purpose, usage, rule list |
| `packages/core/openapi-zod-client-adapter/README.md` | 10 lines, minimal | Expand: purpose, why it exists, usage |
| `packages/libs/env/README.md` | 26 lines, no examples | Add: installation, usage examples, API |

The `apps/oak-curriculum-mcp-streamable-http/README.md`
Authentication section now includes a note that Clerk is a
test instance supporting internal users only. All other
workspace READMEs are substantive and public-ready.

### Completion checklist

- [x] Root README stale commands fixed
- [x] Root README contributing section updated
- [x] Root README ADR count verified
- [x] Root README emoji removed from Support section
- [x] CONTRIBUTING.md: external contributions closed politely
- [x] CONTRIBUTING.md: Node.js version fixed
- [x] CONTRIBUTING.md: ErrorHandler reference removed
- [x] CONTRIBUTING.md: CONTRIBUTORS.md reference removed
- [x] CONTRIBUTING.md: quality gate commands fixed
- [x] CONTRIBUTING.md: E2E test note corrected
- [x] CONTRIBUTING.md: section ordering improved
- [x] External contributor messaging consistent across README and CONTRIBUTING
- [x] Public docs cross-link correctly to the canonical onboarding path
- [x] CHANGELOG.md replaced (single “Unreleased” section for this repo)
- [x] `packages/core/oak-eslint/README.md` created
- [x] `packages/core/openapi-zod-client-adapter/README.md` expanded
- [x] `packages/libs/env/README.md` expanded

---

## Workstream 5: GitHub repository configuration

**Problem**: The repository has CI and release workflows but is
missing standard GitHub community health files that users expect
from a public repository.

### 5a: Issue templates

**Directory to create**: `.github/ISSUE_TEMPLATE/`

Since external contributions are not accepted, create a single
`config.yml` that disables blank issues and directs users
appropriately:

```yaml
blank_issues_enabled: false
contact_links:
  - name: Security issues
    url: https://www.thenational.academy/.well-known/security.txt
    about: Report security vulnerabilities via our security policy
  - name: General enquiries
    url: https://www.thenational.academy/contact-us
    about: For questions about Oak National Academy
```

If/when external contributions are opened in future, add
bug report and feature request templates at that time.

### 5b: PR template

**File to create**: `.github/PULL_REQUEST_TEMPLATE.md`

A lightweight template for internal contributors:

```markdown
## What

<!-- Brief description of the change -->

## Why

<!-- Problem being solved or feature being added -->

## How tested

<!-- How you verified the change works -->

## Checklist

- [ ] Quality gates pass (`pnpm qg`)
- [ ] Documentation updated if needed
- [ ] ADR added/updated for architectural changes
```

### 5c: Dependabot configuration

**File to create**: `.github/dependabot.yml`

```yaml
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
    groups:
      all-dependencies:
        patterns:
          - "*"
    open-pull-requests-limit: 5
  - package-ecosystem: github-actions
    directory: /
    schedule:
      interval: weekly
```

### 5d: Clean up stale workflow

**File**: `.github/workflows/sdk-docs-disabled.yml.bak`

Delete this file. `.bak` files should not be tracked in a
public repository.

### 5e: Review CI workflow for public readiness

**File**: `.github/workflows/ci.yml`

Verify:

1. No hardcoded secrets or internal URLs
2. Environment variables use GitHub Secrets, not inline values
3. The workflow would work for a fork (read-only, no secrets)
4. Secret scanning step is present and uses either `pnpm secrets:scan:all` or a
   Docker fallback. Ensure the output does not include emojis and the Docker
   fallback is documented.

### 5f: Review Copilot instructions

**File**: `.github/copilot-instructions.md`

Currently just says "Read AGENT.md". No changes required for public release
readiness.

### Completion checklist

- [x] Issue template `config.yml` created (directs away from issues)
- [x] PR template created
- [x] Dependabot configuration added
- [x] `sdk-docs-disabled.yml.bak` deleted
- [x] CI workflow reviewed for secrets and public readiness
- [x] Copilot instructions reviewed

---

## Workstream 6: Publication dry run

**Problem**: Before publishing to npm, verify that the single
public package (`@oaknational/curriculum-sdk`) has clean
artefacts and that automated releases work end-to-end.

### 6a: Run publish dry run

```bash
pnpm publish:dry
```

Notes:

- `pnpm publish` enforces clean git state by default. Run from a clean
  branch/worktree.
- For local iteration only, use `pnpm -r publish --dry-run --no-git-checks`.

For each package that would be published, verify:

1. The `files` field includes only intended files
2. No `.env`, `.env.local`, or secret files are included
3. No test files, fixture data, or development tooling is included
4. The `dist/` output is present and correct
5. The README.md is included (npm displays it on the registry)
6. The `LICENSE` file is included in the tarball. Do not assume npm will “pick
   it up” from the repo root; verify via the pack file list. If missing, add it
   explicitly (for example: include it via the workspace `files` field).

### 6b: Inspect tarballs

For `packages/sdks/oak-curriculum-sdk`:

```bash
pnpm -C packages/sdks/oak-curriculum-sdk build
pnpm -C packages/sdks/oak-curriculum-sdk pack --dry-run
```

Review the file list. Look for:

- Source files that should not be in the tarball
- Missing `dist/` files
- Unexpectedly large files
- Any file containing credentials

### 6c: Registry namespace verification

Verify that the `@oaknational` scope is available and configured:

1. Check `https://www.npmjs.com/org/oaknational` exists
2. Verify the npm token in GitHub Secrets has publish access
3. Confirm `publishConfig.access: "public"` is set on all
   public packages (scoped packages default to restricted)

### 6d: Verify package install

Verify `@oaknational/curriculum-sdk` installs cleanly:

```bash
mkdir /tmp/test-install && cd /tmp/test-install
npm init -y
npm install <tarball-path>
# Verify: types resolve, exports work, no missing dependencies
```

### 6e: Release automation gate (required)

**Requirement**: a full automated release flow must work for the SDK-only
publication scope. This repo already uses semantic-release; use semantic-release
and make it publish only `@oaknational/curriculum-sdk` for this first public
release.

**Non-ambiguous expectation**:

- Tag format: use `vX.Y.Z` tags while only one package is published. Revisit tag
  strategy when additional packages are made public.

**Implementation steps (required)**:

1. Update `.releaserc.mjs`:
   - Remove stale comments that reference other repositories/packages.
   - Configure `@semantic-release/npm` with:
     - `npmPublish: true`
     - `pkgRoot: "packages/sdks/oak-curriculum-sdk"`
   - Ensure `@semantic-release/changelog` writes to the root `CHANGELOG.md`.
   - Ensure `@semantic-release/git` commits at minimum:
     - `CHANGELOG.md`
     - `packages/sdks/oak-curriculum-sdk/package.json`

2. Update `.github/workflows/release.yml`:
   - Add `NPM_TOKEN` (or `NODE_AUTH_TOKEN`) from GitHub Secrets for npm publishing.
   - Build the SDK before running semantic-release:

   ```yaml
   - name: Build SDK
     run: pnpm -C packages/sdks/oak-curriculum-sdk build
   ```

3. Validate release behaviour:
   - Run `pnpm exec semantic-release --dry-run` and confirm:
     - next version is computed
     - only the SDK is targeted for publish (no other workspace is published)

Verify:

1. Only `@oaknational/curriculum-sdk` is published by automation.
2. Release workflow reads credentials from GitHub Secrets (no inline tokens).
3. Dry-run release works on CI (or equivalent preview mode) and reports the next version.
4. Real release creates the expected git tag/release notes and publishes to npm.
5. The workflow remains safe for public forks (read-only checks still run).

### Completion checklist

- [x] `pnpm publish:dry` runs without errors
- [x] SDK tarball inspected (`packages/sdks/oak-curriculum-sdk`)
- [x] No secrets in SDK tarball
- [x] SDK `files` field includes only intended publish artefacts
- [x] README and LICENSE included in SDK tarball
- [x] `@oaknational` npm scope verified
- [x] Test install succeeds for SDK tarball
- [x] Release automation (semantic-release) validated end-to-end for SDK-only publication

---

## Quality Gates

After all workstreams, run the full gate chain:

```bash
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:ui
pnpm smoke:dev:stub
```

Additionally:

```bash
pnpm publish:dry
```

All must pass. No exceptions.

### Final review checklist

- [x] No secrets in any tracked file (WS1)
- [x] MIT licence file exists and is correct (WS2)
- [x] Code of Conduct exists (WS2)
- [x] All package.json files have complete metadata (WS3)
- [x] Public/private classification is explicit (WS3)
- [x] Root README is accurate and welcoming (WS4)
- [x] CONTRIBUTING.md reflects current contribution policy (WS4)
- [x] All workspace READMEs exist and are substantive (WS4)
- [x] CHANGELOG.md is correct for this repository (WS4)
- [x] GitHub templates and Dependabot configured (WS5)
- [x] SDK tarball is clean and correct (WS6)
- [x] Release automation is working for SDK-only publish scope (WS6)
- [x] All quality gates pass

---

## Note: `.agent/` directory visibility

The `.agent/` directory contains plans, prompts, experience
records, and memory files used by AI agents working on the repo.
This content is unusual for a public repository but is
deliberately part of Oak's approach to AI-assisted development.

**Decision (recorded)**: Keep `.agent/` visible in git.

**Npm publication constraint (SDK-only)**:

- `.agent/` must not be published to npm as part of `@oaknational/curriculum-sdk`.
- This is expected to be satisfied by the SDK workspace `files` field.
- WS6 must verify the tarball contents explicitly and fail the workstream if
  `.agent/` (or any other repo-internal material) appears in the published
  artefacts.

---

## Related Documents

| Document | Relevance |
| --- | --- |
| `.agent/directives/rules.md` | Quality standards that all changes must meet |
| `.agent/directives/testing-strategy.md` | Test classification rules |
| `.agent/directives/schema-first-execution.md` | Cardinal rule for type generation |
| `docs/development/onboarding.md` | Canonical onboarding document (deep refinement in dedicated onboarding plan) |
| `active/developer-onboarding-experience.plan.md` | Dedicated onboarding refinement plan |
| `CONTRIBUTING.md` | External contributor process (WS4b/4c) |
| `SECURITY.md` | Security reporting process |
| `.agent/experience/the-api-key-revelation.md` | Contains secrets to redact (WS1b) |
| `.agent/plans/archive/completed/mcp-oauth-implementation-plan.archive.md` | Contains secrets to redact (WS1c) |
