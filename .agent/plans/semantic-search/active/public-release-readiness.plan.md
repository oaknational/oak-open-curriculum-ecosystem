# Public Release Readiness

**Status**: Ready -- execute all workstreams
**Parent**: [../README.md](../README.md) | [../roadmap.md](../roadmap.md)
**Last Updated**: 2026-02-12

---

## Instruction

This plan prepares the repository for public visibility on GitHub
and the SDKs/libraries for publication as public npm packages
under the `@oaknational` scope.

It contains six workstreams and a final quality gate.
**Execute all of them.** Each workstream is self-contained with
a problem statement, concrete file-level instructions, and a
completion checklist. Mark each workstream done as you finish it.

**External contributions are not accepted at this time.** The
documentation must reflect this clearly and politely. Internal
onboarding for Oak team members must be complete and accurate.

---

## Workstream Status

| ID | Workstream | Status |
| --- | --- | --- |
| WS1 | [Secrets audit and remediation](#workstream-1-secrets-audit-and-remediation) | Pending |
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

**Problem**: Two tracked files contain real credentials that would
be exposed if the repo became public.

### 1a: API keys in experience document

**File**: `.agent/experience/the-api-key-revelation.md`

Lines 11-13 contain real, functional API keys:

- `NOTION_API_KEY=ntn_42785167710...`
- `OAK_API_KEY=fbf5ab4c-f31d-...`

**Remediation**:

- Replace the actual keys with redacted placeholders:
  `NOTION_API_KEY=ntn_REDACTED` and `OAK_API_KEY=REDACTED-UUID`.
  The document's narrative value is in the lesson learned, not
  the specific key values.
- The document itself is a valuable reflection on trust and
  secrets handling. It should remain, with redacted keys.

**User action required**: Rotate both keys after redaction. The
keys have been in git history and cannot be un-committed. Even
after the file is cleaned, the old values persist in git history.
Consider using `git filter-repo` or BFG Repo-Cleaner to scrub
history before making the repo public, or accept that the keys
will be rotated and the old values are dead.

### 1b: Clerk credentials in archived plan

**File**: `.agent/plans/archive/completed/mcp-oauth-implementation-plan.archive.md`

Contains:

- Clerk Frontend API URL (`REDACTED.clerk.accounts.dev`)
- Clerk publishable key (`pk_test_bmF0aXZl...`)

**Remediation**:

- Replace with redacted placeholders:
  `https://REDACTED.clerk.accounts.dev` and
  `pk_test_REDACTED`.
- The surrounding OAuth implementation documentation remains
  valuable and should be preserved.

**User action required**: Verify whether the Clerk dev instance
is still active. If so, rotate or decommission it.

### 1c: Pre-commit secret scanning

**Remediation**:

- Add a `secretlint` or `gitleaks` configuration to catch
  secrets before they reach git history.
- Evaluate whether to add this as a husky pre-commit hook
  (already using husky for commitlint) or as a CI step, or both.
- At minimum, add a CI step in `.github/workflows/ci.yml` that
  runs secret scanning on every PR.

### 1d: Git history scrubbing decision

**Decision required**: Before making the repo public, decide
whether to scrub git history of the exposed secrets using
`git filter-repo` or BFG Repo-Cleaner. This is destructive and
rewrites all commit hashes. The alternative is to rotate all
exposed credentials (making the historical values harmless) and
accept the history as-is.

**Recommendation**: Rotate credentials and accept history as-is.
History rewriting is disruptive to all contributors and the
secrets are low-sensitivity (dev API keys, test Clerk instance).

### Completion checklist

- [ ] API keys redacted in `.agent/experience/the-api-key-revelation.md`
- [ ] Clerk credentials redacted in archived OAuth plan
- [ ] Exposed keys rotated (user action)
- [ ] Secret scanning added to CI
- [ ] Pre-commit hook evaluated and decision documented
- [ ] Git history scrubbing decision made and documented

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

**Decision required**: Which packages will be published to npm
as public packages, and which are private (internal-only)?

Current state and recommendation:

| Workspace | Current `private` | Recommendation | Rationale |
| --- | --- | --- | --- |
| Root (`@oaknational/mcp-ecosystem`) | `true` | `true` | Monorepo root, never published |
| `apps/oak-curriculum-mcp-stdio` | missing | **publish** | Installable MCP server for Claude/Cursor |
| `apps/oak-curriculum-mcp-streamable-http` | `true` | `true` | Deployed service, not an npm package |
| `apps/oak-search-cli` | `true` | `true` | Internal CLI, requires Elasticsearch |
| `packages/core/oak-eslint` | missing | `true` | Internal ESLint config, Oak-specific |
| `packages/core/openapi-zod-client-adapter` | missing | evaluate | Potentially useful to others |
| `packages/libs/env` | missing | evaluate | Potentially useful to others |
| `packages/libs/logger` | missing | evaluate | Potentially useful to others |
| `packages/libs/result` | missing | evaluate | Potentially useful to others |
| `packages/sdks/oak-curriculum-sdk` | missing | **publish** | Core SDK, primary public package |
| `packages/sdks/oak-search-sdk` | missing | evaluate | Useful if search is offered as a service |

**Action**: Get a definitive decision from the team on each
"evaluate" row before proceeding. For the initial public release,
a conservative approach is to mark everything except the SDK and
stdio server as `private: true`, then selectively open packages
in later releases.

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
| `license` | 5 of 11 (`streamable-http`, `search-cli`, `eslint`, `result`, root has it) |
| `repository` | 3 of 11 (`search-cli`, `eslint`, `result`) |
| `homepage` | all 11 |
| `bugs` | all 11 |
| `keywords` | 5 of 11 |
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
- [ ] `license` added to 5 workspaces missing it
- [ ] `repository` (with `directory`) added to 3 missing workspaces, verified on 8 existing
- [ ] `homepage` added to all 11 workspaces
- [ ] `bugs` added to all 11 workspaces
- [ ] `description` added to 3 workspaces missing it
- [ ] `keywords` reviewed and updated across all workspaces
- [ ] `publishConfig` added to all public packages
- [ ] Version strategy documented and applied
- [ ] Root keywords updated
- [ ] Node.js version consistent everywhere

---

## Workstream 4: Documentation overhaul

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

**File**: `docs/development/onboarding.md`

Review for accuracy and completeness. Verify:

1. All referenced files and paths still exist
2. Commands are correct and match root `package.json`
3. The onboarding flow works for a new Oak team member
4. No references to tools or processes that are internal-only
   and would confuse a public viewer

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
- [ ] `docs/development/onboarding.md` reviewed and verified
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

**Problem**: Before publishing any package to npm, verify that
the published artifacts are correct, complete, and contain no
secrets or unnecessary files.

### 6a: Run publish dry run

```bash
pnpm publish:dry
```

For each package that would be published, verify:

1. The `files` field includes only intended files
2. No `.env`, `.env.local`, or secret files are included
3. No test files, fixture data, or development tooling is included
4. The `dist/` output is present and correct
5. The README.md is included (npm displays it on the registry)
6. The LICENSE file is included (npm copies from root if missing
   in workspace)

### 6b: Inspect tarballs

For each public package:

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

For each public package, verify it installs cleanly:

```bash
mkdir /tmp/test-install && cd /tmp/test-install
npm init -y
npm install <tarball-path>
# Verify: types resolve, exports work, no missing dependencies
```

### Completion checklist

- [ ] `pnpm publish:dry` runs without errors
- [ ] Each public package tarball inspected
- [ ] No secrets in any tarball
- [ ] All public packages have correct `files` field
- [ ] README and LICENSE included in each tarball
- [ ] `@oaknational` npm scope verified
- [ ] Test install succeeds for each public package

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
- [ ] Published tarballs are clean and correct (WS6)
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
| `docs/development/onboarding.md` | Internal onboarding (WS4d) |
| `CONTRIBUTING.md` | External contributor process (WS4b/4c) |
| `SECURITY.md` | Security reporting process |
| `.agent/experience/the-api-key-revelation.md` | Contains secrets to redact (WS1a) |
| `.agent/plans/archive/completed/mcp-oauth-implementation-plan.archive.md` | Contains secrets to redact (WS1b) |
