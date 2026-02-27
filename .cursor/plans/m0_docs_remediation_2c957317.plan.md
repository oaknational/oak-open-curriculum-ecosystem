---
name: M0 docs remediation
overview: Execute the 17 docs-only remediation items (R3–R36) that block M0 (making the repo public), batched into 5 phases by natural grouping and complexity.
todos:
  - id: phase-1-quick-wins
    content: "Phase 1: Quick wins — R3 (CONTRIBUTING path), R4 (status banner), R7 (ADR counts), R18 (CHANGELOG), R33 (LICENSE rename)"
    status: completed
  - id: phase-2-readme-restructure
    content: "Phase 2: Root README restructure — R5+R6+R36 (consolidate), R16 (practice section), R17+R25 (acronyms/jargon), R19 (licence badges)"
    status: completed
  - id: phase-3-new-docs
    content: "Phase 3: New documentation — R8 (.agent/README.md + experience/HUMAN.md), R26 (governance orientation)"
    status: completed
  - id: phase-4-targeted-fixes
    content: "Phase 4: Targeted fixes — R12 (security contact), R21 (CONTRIBUTING MCP env), R22 (ADR contextual framing), R23 (generated-docs note)"
    status: completed
  - id: phase-5-major-restructures
    content: "Phase 5: Major README restructures — R15 (MCP server READMEs progressive disclosure), R35 (SDK README reorder)"
    status: completed
  - id: phase-6-validation
    content: "Phase 6: Final validation — full quality gates, update tracking documents, invoke reviewers"
    status: completed
isProject: false
---

# M0 Documentation Remediation Execution Plan

This plan covers the 17 docs-only items from the onboarding simulations rerun that block M0 (open private alpha / making the repo public). All items have owner dispositions recorded in [onboarding-simulations-public-alpha-readiness.md](.agent/plans/developer-experience/onboarding-simulations-public-alpha-readiness.md). No code changes are involved.

**Source plans**:

- [release-plan-m1.plan.md](.agent/plans/release-plan-m1.plan.md) (Next Steps section)
- [onboarding-simulations-public-alpha-readiness.md](.agent/plans/developer-experience/onboarding-simulations-public-alpha-readiness.md) (Remediation Priority section)

**Quality gate for docs-only work**: `pnpm markdownlint:root && pnpm format:root` after each phase. Full `pnpm qg` at the end.

**Estimated effort**: 1 focused session (as per release plan).

---

## Phase 1: Quick Wins (5 items, ~30 min total)

Mechanical changes with clear specifications. Low editorial risk.

### 1.1 R3 — Fix CONTRIBUTING.md stale code-generation path

- **File**: [CONTRIBUTING.md](CONTRIBUTING.md), line 35
- **Change**: Replace `packages/sdks/oak-curriculum-sdk/code-generation/` with `packages/sdks/oak-sdk-codegen/code-generation/`
- **Acceptance**: `rg 'oak-curriculum-sdk/code-generation' CONTRIBUTING.md` returns 0 matches

### 1.2 R4 — Add status banner to README

- **File**: [README.md](README.md), top of file (before line 1)
- **Change**: Add banner line: `> **Status: Private Alpha** — This repository is under active development. APIs, tools, and documentation may change. See [milestones](.agent/milestones/) for the progression path.`
- **Owner disposition**: Banner should reflect current milestone state ("Private Alpha" at M0 exit). Use a blockquote or badge.

### 1.3 R7 — Replace exact ADR counts with "over 100"

- **Files to update** (active files only; archive files are historical records and must not be modified):
  - [README.md](README.md) — lines 167, 216, 226 (counts: "116", "114", "116")
  - [docs/foundation/VISION.md](docs/foundation/VISION.md) — line 106 ("116")
  - [.agent/reference-docs/prog-frame/agentic-engineering-practice.md](.agent/reference-docs/prog-frame/agentic-engineering-practice.md) — lines 51, 78 ("114", "116")
- **Change**: Replace all exact ADR counts with "over 100" or remove the count entirely, per owner disposition
- **Acceptance**: `rg '\b11[4-9]\s+(ADR|Architectural Decision)' README.md docs/foundation/VISION.md .agent/reference-docs/` returns 0 matches

### 1.4 R18 — Clear CHANGELOG.md

- **File**: [CHANGELOG.md](CHANGELOG.md) (~12 lines)
- **Change**: Replace content with minimal semantic-release placeholder:

```markdown
  # Changelog

  All notable changes to this project will be documented in this file.
  This changelog is managed by [semantic-release](https://github.com/semantic-release/semantic-release).
  

```

- **Acceptance**: No stale references, no `[Unreleased]` section

### 1.5 R33 — Rename LICENSE to LICENCE

- **Change**: `git mv LICENSE LICENCE`
- **Update references**: `rg 'LICENSE' --type md` to find all markdown references, update to `LICENCE`
- **Acceptance**: File is named `LICENCE`, all markdown references updated, `rg 'LICENSE' --type md -l` returns only `LICENCE-DATA.md` (which references the MIT licence file)

**Phase 1 gate**: `pnpm markdownlint:root && pnpm format:root`

---

## Phase 2: Root README Restructure (4 items, ~60 min)

These items are editorially linked and should be done together in a single pass over `README.md`.

### 2.1 R5 + R6 + R36 — README restructure

- **File**: [README.md](README.md) (~265 lines)
- **Problem**: Structural redundancy — "Repo Contents" (lines 10-32), "What This Is" (lines 171-184), and "What's In The Repo" (lines 205-216) overlap. "Architecture Overview" (lines 218-228) overlaps with "The Architectural Foundation" (lines 186-204). Quick start sections (lines 33-122) compete with surrounding sections.
- **Owner disposition**: Consolidate into one "What's in this repo" section. Remove duplication. Apply progressive disclosure. README is for developers, not CEOs — VISION link is the non-technical entry point.
- **Target structure** (progressive disclosure):
  1. Status banner (from R4)
  2. One-paragraph description (rewritten for developer clarity)
  3. VISION link (prominent, early)
  4. What's in this repo (single consolidated section)
  5. Quick start (one section, not two competing ones; AI agent path as a subsection or callout)
  6. Key commands
  7. Architecture overview (single section, not repeated)
  8. Contributing / Support / Licensing
- **Non-goal**: Do not rewrite VISION.md or create new documentation. This is a restructure of existing content.

### 2.2 R16 — Reframe practice section + internal-only frontmatter

- **File 1**: [README.md](README.md), lines 161-169 ("Agentic Engineering Practice")
- **Change**: Reframe for external audience. Remove internal language like "a single engineer, working with AI". Focus on: the repository uses AI-assisted engineering, with comprehensive quality gates and architectural documentation.
- **File 2**: [.agent/reference-docs/prog-frame/agentic-engineering-practice.md](.agent/reference-docs/prog-frame/agentic-engineering-practice.md) (97 lines, no frontmatter)
- **Change**: Add frontmatter marking it as internal-only:

```yaml
  ---
  visibility: internal
  note: >
    This document is for internal Oak use only. Do not link to it from
    any public-facing file in this repository.
  ---
  

```

- **Acceptance**: README practice section reads naturally for an external developer; frontmatter present on internal doc; no other file links to the internal doc

### 2.3 R17 + R25 — Expand acronyms and replace jargon

- **Files**: Primarily [README.md](README.md), but also scan [CONTRIBUTING.md](CONTRIBUTING.md) and [docs/foundation/quick-start.md](docs/foundation/quick-start.md)
- **Key terms to expand on first use**: MCP (already defined at line 8 — ensure it survives the restructure), ADR, Zod, RRF, ELSER, Turbo/Turborepo
- **R25 specifically**: Line 99-100 `pnpm make` comment is implementation detail (`# install -> build (includes sdk-codegen via Turbo deps) -> ...`). Rephrase as plain-language: "Full pipeline: install, build, check, lint, format" or similar. Detailed Turborepo task graph belongs in [docs/engineering/build-system.md](docs/engineering/build-system.md).
- **Acceptance**: Key acronyms defined on first use in README; `pnpm make` comment is human-readable

### 2.4 R19 — Add licence badges

- **File**: [README.md](README.md), top of file (after status banner)
- **Change**: Add badges clarifying dual-licence status:
  - MIT badge for code (linking to `LICENCE`)
  - OGL badge for data (linking to `LICENCE-DATA.md`)
- **Owner disposition**: Make it clear we have mixed licences (MIT for code, OGL for data)
- **Acceptance**: Badges visible at top of README; both licence files linked

**Phase 2 gate**: `pnpm markdownlint:root && pnpm format:root`

---

## Phase 3: New Documentation (2 items, ~30 min)

Creating new files that explain existing content for external audiences.

### 3.1 R8 — Create `.agent/README.md` and `.agent/experience/HUMAN.md`

- **File 1**: [.agent/README.md](.agent/README.md) (new file)
- **Content**: Explain that `.agent/` contains the agentic engineering practice infrastructure. Experience files are non-technical logs capturing the history of the repo in an orthogonal dimension to git history. There is no human team to remember how the repo was built — these insights are preserved for later analysis and knowledge mining. Link to the practice overview.
- **File 2**: [.agent/experience/HUMAN.md](.agent/experience/HUMAN.md) (new file)
- **Content**: Brief explanation of intent — these files create an archive enabling future agent continuity between sessions and between agents. Link back to `.agent/README.md`.
- **Acceptance**: Both files exist, are concise (under 50 lines each), and provide context for someone encountering the directory for the first time

### 3.2 R26 — Enhance governance orientation document

- **File**: [docs/governance/README.md](docs/governance/README.md) (exists, 42 lines)
- **Current state**: Index page with contents listing, purpose, key principles, starting point
- **Change**: Add a brief orientation paragraph explaining why the governance volume exists and providing a 5-minute reading path. Per owner disposition: "This is a new type of repository — there will not always be a human team working on it, so the repo contains more than the code, it contains the project context."
- **Acceptance**: Governance README includes orientation framing; reading path is clear for newcomers; under 80 lines

**Phase 3 gate**: `pnpm markdownlint:root && pnpm format:root`

---

## Phase 4: Targeted Fixes (4 items, ~30 min)

Specific fixes in individual files.

### 4.1 R12 — Fix security contact placeholder

- **File**: [docs/governance/safety-and-security.md](docs/governance/safety-and-security.md), line 179
- **Change**: Replace `[security contact to be added]` with reference to [SECURITY.md](SECURITY.md) and the canonical Oak security.txt URL (`www.thenational.academy/.well-known/security.txt`)
- **Acceptance**: No placeholder text remains; security reporting path is clear and links to canonical source

### 4.2 R21 — Clarify CONTRIBUTING.md MCP env requirements

- **File**: [CONTRIBUTING.md](CONTRIBUTING.md), lines 138-157 (Level 2 section)
- **Change**: Line 140 claims "Requires: `OAK_API_KEY` only" but running MCP servers with search functionality requires Elasticsearch credentials. Clarify that `OAK_API_KEY` enables core curriculum tools; search functionality additionally requires ES credentials.
- **Acceptance**: Level 2 requirements are accurate; no misleading "only" claim

### 4.3 R22 — Contextual framing for repeated ADR references

- **Scope**: The 6 onboarding-path files where ADR-029/030/031 are referenced identically:
  - [README.md](README.md) (line ~200)
  - [CONTRIBUTING.md](CONTRIBUTING.md) (lines 23-25)
  - [docs/foundation/quick-start.md](docs/foundation/quick-start.md) (lines 17-19)
  - [docs/architecture/README.md](docs/architecture/README.md) (lines 23-25)
  - [docs/README.md](docs/README.md) (lines 27-29)
  - [packages/sdks/oak-curriculum-sdk/README.md](packages/sdks/oak-curriculum-sdk/README.md) (lines 16-18)
- **Change**: At each reference point, add 1 sentence of contextual framing explaining why these ADRs matter in that specific document's context (e.g., in CONTRIBUTING.md: "These ADRs define the constraints you must follow when contributing"; in quick-start.md: "Understanding these decisions helps you navigate the codebase").
- **Non-goal**: Do not change ADR cross-references within other ADRs or archive files.
- **Acceptance**: Each reference has brief contextual framing; no identical boilerplate across documents

### 4.4 R23 — Generated-docs note in quick-start

- **File**: [docs/foundation/quick-start.md](docs/foundation/quick-start.md), around line 314
- **Change**: Add note: "This file is generated by `pnpm doc-gen`. If it does not exist, run that command first."
- **Acceptance**: Note present near the generated docs path reference

**Phase 4 gate**: `pnpm markdownlint:root && pnpm format:root`

---

## Phase 5: Major README Restructures (2 items, ~60 min)

The two largest items. Each involves moving significant content from a README to workspace `/docs/` directories.

### 5.1 R15 — MCP server README progressive disclosure

- **File 1**: [apps/oak-curriculum-mcp-stdio/README.md](apps/oak-curriculum-mcp-stdio/README.md) (733 lines)
  - **Keep in README** (~120 lines): Title, quick start, architecture overview, tool surface, installation, configuration, testing, development
  - **Move to `apps/oak-curriculum-mcp-stdio/docs/`**: Request tracing (lines 122-161), tool execution timing (lines 163-233), error debugging (lines 241-346), log file management (lines 354-534), operational debugging workflows (lines 535-732) — approximately 600 lines
  - **New file**: `apps/oak-curriculum-mcp-stdio/docs/operational-debugging.md`
  - Add a "Detailed operational documentation" link in the README pointing to the new file
- **File 2**: [apps/oak-curriculum-mcp-streamable-http/README.md](apps/oak-curriculum-mcp-streamable-http/README.md) (1,330 lines)
  - **Keep in README** (~300 lines): Title, status, quick start, Vercel deployment, Cursor configuration, authentication, troubleshooting, search tools, testing, deployment preconditions
  - **Move to `apps/oak-curriculum-mcp-streamable-http/docs/`**: Request tracing (lines 85-133), request timing (lines 134-206), runtime bootstrap diagnostics (lines 208-241), error debugging (lines 243-334), production logging (lines 335-598), production diagnostics (lines 600-931), widget rendering sections (lines 1000-1186), historical context (lines 1233-1317) — approximately 900 lines
  - **New files**: `docs/operational-debugging.md`, `docs/widget-rendering.md` (within the workspace)
  - Add "Detailed operational documentation" and "Widget rendering" links in the README
- **Acceptance**: Both READMEs under 350 lines; operational content preserved in workspace `/docs/`; no broken internal links

### 5.2 R35 — Reorder SDK README for appropriate audiences

- **File**: [packages/sdks/oak-curriculum-sdk/README.md](packages/sdks/oak-curriculum-sdk/README.md) (303 lines)
- **Problem**: Architecture internals start at line 22, before any usage/installation section
- **Target structure**:
  1. Title and one-line description
  2. Installation / getting started
  3. Usage examples (basic API calls)
  4. Configuration
  5. Architecture overview (brief, with link to detailed docs)
  6. ADR references
  7. Development / contributing
- **Move detailed architecture** to `packages/sdks/oak-curriculum-sdk/docs/architecture.md` if the content is substantial enough to warrant it
- **Acceptance**: SDK README leads with user-facing content (install, use); architecture is later in the document or in workspace `/docs/`

**Phase 5 gate**: `pnpm markdownlint:root && pnpm format:root`

---

## Phase 6: Final Validation

### 6.1 Full quality gate

```bash
pnpm markdownlint:root   # Markdown lint
pnpm format:root          # Format check
pnpm subagents:check      # Sub-agent definition integrity
```

No code changes were made, so `pnpm build`, `pnpm type-check`, `pnpm lint`, `pnpm test`, and `pnpm test:e2e` should be unaffected. Run `pnpm qg` as a final safety net.

### 6.2 Update tracking documents

- Mark all 17 R-items as complete in [onboarding-simulations-public-alpha-readiness.md](.agent/plans/developer-experience/onboarding-simulations-public-alpha-readiness.md)
- Update the release plan [release-plan-m1.plan.md](.agent/plans/release-plan-m1.plan.md) Next Steps section
- Update the M0 milestone [m0-open-private-alpha.md](.agent/milestones/m0-open-private-alpha.md) progression gates

### 6.3 Invoke reviewers

- `docs-adr-reviewer`: Review all documentation changes for completeness and drift
- `onboarding-reviewer`: Spot-check that the remediated documents now pass the onboarding criteria
- `code-reviewer`: Gateway review (no code changes, but confirms overall quality)

---

## Risk Assessment

- **Low risk**: All changes are docs-only. No code, no tests, no type system changes.
- **Editorial risk**: README restructure (R5+R6+R36) and MCP README splits (R15) require editorial judgement. Mitigated by: owner dispositions already recorded, reviewer validation in Phase 6.
- **Link breakage risk**: Moving content between files may break internal links. Mitigated by: `rg` link validation after each move, markdownlint catches some broken links.
- **Archive contamination**: R7 must NOT update archive files (historical records). Mitigated by: explicit exclusion in task description.

## Non-Goals

- No code changes
- No new ADRs (these are editorial fixes, not architectural decisions)
- No changes to the M1 engineering/ops gates (Clerk, Sentry, rate limiting)
- No changes to B1-B6 governance items (require leadership input)
- No changes to archive files
