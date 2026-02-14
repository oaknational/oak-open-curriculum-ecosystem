# Public Release Readiness

**Status**: In progress -- execute all workstreams
**Parent**: [../README.md](../README.md) | [../roadmap.md](../roadmap.md)
**Last Updated**: 2026-02-14

---

## Instruction

This plan prepares the repository for public visibility on GitHub
and selected SDKs/libraries for publication as public npm packages
under the `@oaknational` scope.

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
publish only `@oaknational/oak-curriculum-sdk`. All other workspaces
remain private (`private: true`) for now.

**Credential policy (2026-02-12)**: real credentials are allowed only
 in local `.env*` files that are not committed. `.env.example` files
 and all other tracked files must contain placeholders/redacted values.

---

## Session Cut-Point (Next Session)

The plan can be resumed in a staged fashion. If this is a secrets-only session:

- Execute only `WS1` end-to-end.
- Mark `WS1` complete and stop.
- Leave `WS2` onward, including `QG`, as pending.
- Resume with `WS2` at the start of the next session.

---

## Workstream Status

| ID | Workstream | Status |
| --- | --- | --- |
| WS1 | [Secrets audit and remediation](#workstream-1-secrets-audit-and-remediation) | In progress (policy/docs/CI complete; key rotation still pending) |
| WS2 | [Licence and legal](#workstream-2-licence-and-legal) | Pending |
| WS3 | [Package.json standardisation](#workstream-3-packagejson-standardisation) | Pending |
| WS4 | [Documentation overhaul](#workstream-4-documentation-overhaul) | Pending |
| WS5 | [GitHub repository configuration](#workstream-5-github-repository-configuration) | Pending |
| WS6 | [Publication dry run](#workstream-6-publication-dry-run) | Pending |
| QG | [Quality gates](#quality-gates) | Pending |

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

**Remaining**:

- **User action**: rotate any keys that were ever live (assume compromise if ever committed historically).

### 1b: API keys in experience document

**File**: `.agent/experience/the-api-key-revelation.md`

**Status (2026-02-14)**: Completed. This file contains placeholders only.

**Remediation**:

- Keep the document (it is a valuable reflection) but ensure it never contains real credentials.

**User action required**: Rotate any keys that were ever live, even though the repository history has been scrubbed.

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

### 1d: Secret scanning gates (CI and optional pre-commit)

**Status (2026-02-14)**: Completed.

**Implemented**:

- Local gitleaks gate configured via `.gitleaks.toml` (extends defaults; targeted allowlist for `.agent/reference-docs/**` only).
- Root scripts added:
  - `pnpm secrets:scan:all` (branches + tags)
  - `pnpm secrets:scan:all-refs` (forensics: all refs)
- `pnpm check` runs `pnpm secrets:scan:all` first.
- Pre-push hook runs `pnpm secrets:scan:all` and blocks pushes when scans fail.
- CI runs full-history secret scan and fails on findings in each run.

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
- [ ] Exposed keys rotated (user action)
- [x] Pre-commit/pre-push secret scan hook evaluated and decision documented
- [x] Git history scrubbing decision made and documented

---

## Workstream 2: Licence and legal

**Problem**: The root `README.md` (line 161) references
`[LICENSE](LICENSE)` but only `LICENSE.md` exists (not plain
`LICENSE`), so the link is broken. Multiple workspace
`package.json` files declare `"license": "MIT"` without a
corresponding licence file. `CONTRIBUTING.md` has a "Code of
Conduct" section (lines 7-9) but no `CODE_OF_CONDUCT.md` file
exists.

### 2a: Create MIT licence file

**File to create**: `LICENSE` (root)

Use the standard MIT licence text with:

- Year: 2024-present (the repo's first commit year to present)
- Copyright holder: Oak National Academy

This must be a plain-text file, not markdown. Note: a
`LICENSE.md` already exists at root — either rename it to
`LICENSE` (plain text) or update the README link to point to
`LICENSE.md`. The MIT licence is already declared in the root
`package.json` and in most workspace `package.json` files.

### 2b: Create Code of Conduct

**File to create**: `CODE_OF_CONDUCT.md` (root)

Adopt the [Contributor Covenant v2.1](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).
This is the industry standard for open source projects.
`CONTRIBUTING.md` has a "Code of Conduct" section (lines 7-9)
that should link to this file once created.

Set the enforcement contact to the same security contact used
in `SECURITY.md` (or a dedicated email if Oak has one for
community conduct).

### 2c: Curriculum data licence clarification

The root `README.md` already notes that curriculum data uses the
[Open Government Licence v3](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).
Verify this is correct and consider adding a `LICENCE-DATA.md`
or a section in the root `LICENSE` file clarifying the dual
licensing:

- Code: MIT
- Curriculum data: OGL v3
- Oak branding: All rights reserved

### Completion checklist

- [ ] `LICENSE` file created at root with correct MIT text
- [ ] `CODE_OF_CONDUCT.md` created with Contributor Covenant v2.1
- [ ] Dual licensing (code vs data) clearly documented
- [ ] `README.md` licence link verified working

---

## Workstream 3: Package.json standardisation

**Problem**: Across 11 workspace `package.json` files, critical
metadata fields are missing or inconsistent. Before public
release, every package must have correct metadata for both npm
registry presentation and GitHub repository display.

### 3a: Classify packages as public or private

**Decision (recorded)**: initial public npm scope is a single package:
`@oaknational/oak-curriculum-sdk`. All other workspaces remain private.

Current state and recommendation:

| Workspace | Current `private` | Recommendation | Rationale |
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

**Current gaps** (from audit):

| Field | Missing from |
| --- | --- |
| `author` | 8 of 11 workspaces |
| `license` | 4 of 11 (`streamable-http`, `search-cli`, `eslint`, `result`) |
| `repository` | 3 of 11 (`search-cli`, `eslint`, `result`) |
| `homepage` | all 11 |
| `bugs` | all 11 |
| `keywords` | 4 of 11 |
| `description` | 3 of 11 (`streamable-http`, `search-cli`, `eslint`) |
| `publishConfig` | all 11 |

### 3c: Version strategy

Current state: Most packages use `0.0.0-development`. This is
fine for pre-release, but public packages need a real versioning
strategy before first publish.

**Recommendation**: Use `0.1.0` as the first published version
for all public packages (signalling pre-1.0, breaking changes
expected). Let semantic-release handle subsequent versions from
commit messages.

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

- [ ] Public/private classification decided for all workspaces
- [ ] `private: true` added to all non-published packages
- [ ] `author` added to all 11 workspaces
- [ ] `license` added to 4 workspaces missing it
- [ ] `repository` (with `directory`) added to 3 missing workspaces, verified on 8 existing
- [ ] `homepage` added to all 11 workspaces
- [ ] `bugs` added to all 11 workspaces
- [ ] `description` added to 3 workspaces missing it
- [ ] `keywords` reviewed and updated across all workspaces
- [ ] `publishConfig` added to `packages/sdks/oak-curriculum-sdk`
- [ ] Version strategy documented and applied
- [ ] Root keywords updated
- [ ] Node.js version consistent everywhere

---

## Workstream 4: Documentation overhaul

**Scope note**: deep onboarding experience refinement is tracked in
`active/developer-onboarding-experience.plan.md`. WS4 keeps release-
critical documentation updates and cross-links only.

### 4a: Root README.md

**File**: `README.md`

The root README is generally strong. Specific issues to fix:

1. **Stale command references**: Line 91 (and possibly others)
   says `pnpm dev:smoke` but the actual command is
   `pnpm smoke:dev:stub`. Fix all smoke test command references
   in the root README.
2. **Contributing section** (lines 148-161): Currently says
   "We welcome contributions from Oak team members and the
   wider community." This must change to reflect that external
   contributions are not currently accepted. See 4c below.
3. **ADR count**: Lines 47 and 58 reference "107 ADRs" but the
   actual count is 105 (including ADR-109 added during 451
   remediation). Update both references to the correct count.
4. **Support section** (line 165-168): Contains emoji. Remove
   them (repo convention is no emoji unless user requests).
5. **Node.js version**: `.env.example` and `CONTRIBUTING.md`
   and README must all agree on Node.js 24.x.

### 4b: CONTRIBUTING.md overhaul

**File**: `CONTRIBUTING.md`

This file needs significant updates for public readiness:

1. **Contribution status**: Currently says "We welcome internal
   contributions and interest from the wider community." Replace
   with clear language: this project is open-source and public,
   but external contributions (PRs, issues) are not accepted at
   this time. The code is available for reading, forking, and
   learning. Oak team members contribute via internal process.
2. **Node.js version**: Line 15 says "Node.js 22+" -- update
   to `24.x` to match `engines` in root `package.json`.
3. **Error handling section**: Line 219 references "ErrorHandler
   class" which does not exist in the codebase. Replace with
   the actual pattern (Result type from `@oaknational/result`,
   fail-fast with helpful errors).
4. **CONTRIBUTORS.md reference**: Line 326 promises
   "Listed in CONTRIBUTORS.md" but no such file exists. Either
   create it or remove the reference. Given no external
   contributions are accepted, remove the reference.
5. **Quality gate commands**: Lines 128-136 show `pnpm format`,
   `pnpm lint`, etc. The actual commands are `pnpm format:root`,
   `pnpm lint:fix`. Align with the root `package.json` scripts.
6. **E2E test note**: Line 344 says E2E tests "Requires valid
   OAK_API_KEY" -- this is false. E2E tests use mocks and DI
   (per testing strategy). Only smoke tests require real
   credentials.
7. **Section ordering**: Move "Architecture Guidelines" higher.
   External viewers will want to understand the schema-first
   principle before diving into code standards.

### 4c: External contributor messaging

Create a clear, polite boundary in both `README.md` and
`CONTRIBUTING.md`:

**Recommended wording** (adapt as needed):

> This repository is open-source under the MIT licence. You are
> free to read, fork, and learn from the code.
>
> At this time, we are not accepting external contributions
> (pull requests, issues, or feature requests). This may change
> in the future -- watch the repository for updates.
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

**Remediation options** (choose one):

1. **Delete it**: If semantic-release will generate a fresh
   changelog from commit history at first release, delete the
   stale file. The release workflow will create a correct one.
2. **Replace it**: Create a new `CHANGELOG.md` with a single
   "Unreleased" section noting this is the first public release.
3. **Regenerate it**: Use `conventional-changelog` to generate
   from actual git history.

**Recommendation**: Option 2 -- a clean "Unreleased" section.
Semantic-release will manage it from the first tagged release.

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

- [ ] Root README stale commands fixed
- [ ] Root README contributing section updated
- [ ] Root README ADR count verified
- [ ] Root README emoji removed from Support section
- [ ] CONTRIBUTING.md: external contributions closed politely
- [ ] CONTRIBUTING.md: Node.js version fixed
- [ ] CONTRIBUTING.md: ErrorHandler reference removed
- [ ] CONTRIBUTING.md: CONTRIBUTORS.md reference removed
- [ ] CONTRIBUTING.md: quality gate commands fixed
- [ ] CONTRIBUTING.md: E2E test note corrected
- [ ] CONTRIBUTING.md: section ordering improved
- [ ] External contributor messaging consistent across README and CONTRIBUTING
- [ ] Public docs cross-link correctly to the canonical onboarding path (deep onboarding tracked separately)
- [ ] CHANGELOG.md replaced or regenerated
- [ ] `packages/core/oak-eslint/README.md` created
- [ ] `packages/core/openapi-zod-client-adapter/README.md` expanded
- [ ] `packages/libs/env/README.md` expanded

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
4. Consider adding a secret scanning step (see WS1c)

### 5f: Review Copilot instructions

**File**: `.github/copilot-instructions.md`

Currently just says "Read AGENT.md". This is fine but could
include a brief summary for Copilot users who don't want to
read the full agent directives. Low priority.

### Completion checklist

- [ ] Issue template `config.yml` created (directs away from issues)
- [ ] PR template created
- [ ] Dependabot configuration added
- [ ] `sdk-docs-disabled.yml.bak` deleted
- [ ] CI workflow reviewed for secrets and public readiness
- [ ] Copilot instructions reviewed

---

## Workstream 6: Publication dry run

**Problem**: Before publishing to npm, verify that the single
public package (`@oaknational/oak-curriculum-sdk`) has clean
artifacts and that automated releases work end-to-end.

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
6. The LICENSE file is included (npm copies from root if missing
   in workspace)

### 6b: Inspect tarballs

For `packages/sdks/oak-curriculum-sdk`:

```bash
cd <workspace>
pnpm pack --dry-run
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

Verify `@oaknational/oak-curriculum-sdk` installs cleanly:

```bash
mkdir /tmp/test-install && cd /tmp/test-install
npm init -y
npm install <tarball-path>
# Verify: types resolve, exports work, no missing dependencies
```

### 6e: Release automation gate (required)

**Requirement**: a full automated release flow must work for the
SDK-only publication scope. Either semantic-release or changesets is
acceptable, but it must be deterministic and CI-driven.

Verify:

1. Only `@oaknational/oak-curriculum-sdk` is published by automation.
2. Release workflow reads credentials from GitHub Secrets (no inline tokens).
3. Dry-run release works on CI (or equivalent preview mode) and reports the next version.
4. Real release creates the expected git tag/release notes and publishes to npm.
5. The workflow remains safe for public forks (read-only checks still run).

### Completion checklist

- [ ] `pnpm publish:dry` runs without errors
- [ ] SDK tarball inspected (`packages/sdks/oak-curriculum-sdk`)
- [ ] No secrets in SDK tarball
- [ ] SDK `files` field includes only intended publish artifacts
- [ ] README and LICENSE included in SDK tarball
- [ ] `@oaknational` npm scope verified
- [ ] Test install succeeds for SDK tarball
- [ ] Release automation (semantic-release or changesets) validated end-to-end

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

- [ ] No secrets in any tracked file (WS1)
- [ ] MIT licence file exists and is correct (WS2)
- [ ] Code of Conduct exists (WS2)
- [ ] All package.json files have complete metadata (WS3)
- [ ] Public/private classification is explicit (WS3)
- [ ] Root README is accurate and welcoming (WS4)
- [ ] CONTRIBUTING.md reflects current contribution policy (WS4)
- [ ] All workspace READMEs exist and are substantive (WS4)
- [ ] CHANGELOG.md is correct for this repository (WS4)
- [ ] GitHub templates and Dependabot configured (WS5)
- [ ] SDK tarball is clean and correct (WS6)
- [ ] Release automation is working for SDK-only publish scope (WS6)
- [ ] All quality gates pass

---

## Note: `.agent/` directory visibility

The `.agent/` directory contains plans, prompts, experience
records, and memory files used by AI agents working on the repo.
This content is unusual for a public repository but is
deliberately part of Oak's approach to AI-assisted development.

**Decision required**: Decide whether to keep `.agent/` visible
in the public repo (as a transparent example of AI-assisted
development practice) or to add it to `.npmignore` patterns and
consider whether it should be in `.gitignore` for the public
release. The secrets remediation in WS1 is critical regardless
of this decision.

**Recommendation**: Keep it visible. It documents architectural
reasoning, plans, and development methodology. Transparency is
valuable. Just ensure WS1 secrets are fully remediated first.

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
