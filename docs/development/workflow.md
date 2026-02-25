# Development Workflow

**Last Updated**: 2026-02-25  
**Status**: Active workflow guide

The complete development lifecycle for this repository, from branch creation to release.

## Overview

```text
Branch → TDD → Local Gates → Commit → Push → PR → CI → AI Review → Human Review → Merge → Release
```

## 1. Create a Feature Branch

Use conventional branch naming:

```bash
git checkout -b feat/your-feature-name
git checkout -b fix/bug-description
git checkout -b docs/documentation-update
git checkout -b refactor/area-being-refactored
```

## 2. Develop With TDD

Write tests **before** code, at every level. The cycle is:

1. **Red** — Write a test specifying the desired behaviour. Run it. It must fail.
2. **Green** — Write the minimal code to make the test pass. Run it. It must pass.
3. **Refactor** — Improve the implementation without changing behaviour. Tests must remain green.

When changing system behaviour, update tests at the same level first:

| Change level            | Update first                                |
| ----------------------- | ------------------------------------------- |
| Pure function behaviour | Unit tests (`*.unit.test.ts`)               |
| Integration behaviour   | Integration tests (`*.integration.test.ts`) |
| System behaviour        | E2E tests (`*.e2e.test.ts`)                 |

See [Testing Strategy](../../.agent/directives/testing-strategy.md) for full details.

## 3. Run Local Quality Gates

Two levels of local verification:

**Quick fixes** (during development):

```bash
pnpm fix   # format:root → markdownlint:root → lint:fix
```

**Full pipeline** (before committing):

```bash
pnpm make  # install → build/sdk-codegen → type-check → doc-gen → lint:fix → subagents:check → markdownlint:root → format:root
```

**Full verification** (before pushing):

```bash
pnpm qg    # format-check:root → markdownlint-check:root → subagents:check → type-check → lint → test → test:ui → test:e2e → smoke:dev:stub
```

See [Build System](./build-system.md) for the single source of truth on all command definitions.
For AI agent execution order, directives are normative and require one gate at
a time; `pnpm make` and `pnpm qg` remain convenience aggregate commands for
human local workflows.

## 4. Commit

Use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: add new MCP tool for lesson retrieval"
git commit -m "fix: correct Zod schema for search response"
git commit -m "docs: update onboarding prerequisites"
git commit -m "refactor: extract validation helper from tool executor"
```

Common prefixes: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `ci`.

## 5. Push

The pre-push hook runs `gitleaks detect` to scan for secrets. If gitleaks is not installed, the push will fail — see [Prerequisites](./onboarding.md#prerequisites).

```bash
git push -u origin HEAD
```

## 6. Create a Pull Request

Use the PR template. Include:

- **What**: Summary of changes
- **Why**: Motivation and context
- **How**: Implementation approach
- **Testing**: How the changes were verified

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for PR title format and checklist.

## 7. CI Checks

CI runs automatically on all PRs targeting `main`. It runs a **subset** of the full quality gates:

| Check                    | CI  | Local `pnpm qg`       |
| ------------------------ | --- | --------------------- |
| Secret scan (`gitleaks`) | Yes | No (pre-push hook)    |
| Build (`pnpm build`)     | Yes | Yes (via `pnpm make`) |
| Format check             | Yes | Yes                   |
| Lint                     | Yes | Yes                   |
| Type check               | Yes | Yes                   |
| Unit + integration tests | Yes | Yes                   |
| UI tests (Playwright)    | No  | Yes                   |
| E2E tests                | No  | Yes                   |
| Smoke tests              | No  | Yes                   |
| Markdown lint            | No  | Yes                   |
| Sub-agent validation     | No  | Yes                   |

**Important**: CI is a subset of `pnpm qg`. UI tests, E2E tests, smoke tests, markdown linting, and sub-agent validation run locally only. Ensure `pnpm qg` passes before pushing.

## 8. AI Sub-Agent Review

During development, the AI agent working on the code invokes specialist sub-agent reviewers. These are automated quality checks that run within the AI development workflow.

### What the sub-agents do

| Sub-agent                 | Focus                                                     |
| ------------------------- | --------------------------------------------------------- |
| `code-reviewer`           | Gateway reviewer: code quality, security, maintainability |
| `architecture-reviewer-*` | Structural boundaries, dependency direction, coupling     |
| `test-reviewer`           | TDD compliance, test quality, mock simplicity             |
| `type-reviewer`           | Type safety, generics, schema-to-type flow                |
| `config-reviewer`         | Tooling config consistency, quality gate alignment        |
| `security-reviewer`       | Auth, secrets, PII, injection risks                       |
| `docs-adr-reviewer`       | Documentation completeness, ADR accuracy                  |

### When they run

Sub-agents are invoked by the AI agent **during development**, not in CI. They run after non-trivial changes are made (feature completion, bug fixes, refactoring, API changes). Their findings are captured in the development conversation.

### Are findings blocking?

Sub-agent findings are **advisory** — they inform the AI agent's work and are addressed during development. They do not block CI or merge directly. However, the issues they surface (type safety violations, boundary breaches, test gaps) will typically be caught by the mandatory quality gates if not addressed.

## 9. Human Review

Human review focuses on areas where AI reviewers may miss context:

- **Product intent** — Does the change solve the right problem?
- **User impact** — How does this affect teachers, developers, or AI agents?
- **Domain correctness** — Is the curriculum domain model used correctly?
- **Strategic alignment** — Does this fit the architectural direction?
- **Risk assessment** — Are there edge cases or failure modes not covered?

## 10. Merge Strategy

PRs are merged to `main` after:

1. CI passes
2. At least one human approval
3. No unresolved review comments

## 11. Release

Releases are automated via [semantic-release](https://semantic-release.gitbook.io/):

1. PRs merged to `main` trigger the release workflow
2. Version is bumped based on conventional commit types (`feat` → minor, `fix` → patch)
3. A GitHub release is created automatically
4. npm packages are published for public packages

See [Release and Publishing](./release-and-publishing.md) for the operator runbook and rollback procedures.

## What Does Good Look Like?

For individual contributors:

- Tests written before code at all levels
- All quality gates pass locally (`pnpm qg`) before pushing
- Conventional commit messages that explain _why_, not just _what_
- Documentation updated alongside code changes
- ADRs created for significant architectural decisions
- No disabled checks, no type shortcuts, no skipped tests
