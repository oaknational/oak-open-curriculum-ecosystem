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
pnpm make  # install → build → type-check → doc-gen → lint:fix → subagents:check → portability:check → practice:fitness:informational → markdownlint:root → format:root
```

**Full verification** (before pushing):

```bash
pnpm qg    # format-check:root → markdownlint-check:root → subagents:check → portability:check → test:root-scripts → type-check → lint → test → test:ui → test:e2e → smoke:dev:stub
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

The pre-push hook runs `gitleaks detect` to scan for secrets. If gitleaks is not installed, the push will fail — install from [gitleaks releases](https://github.com/gitleaks/gitleaks/releases).

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

## 7. Quality Gate Surfaces

Quality is enforced through five surfaces: pre-commit hook, pre-push hook,
GitHub CI workflow, `pnpm qg`, and `pnpm check`. Each runs a specific set
of checks; see
[ADR-121](../architecture/architectural-decisions/121-quality-gate-surfaces.md)
for the full coverage matrix and rationale, or
[build-system.md](build-system.md#quality-gate-surfaces) for a quick
reference table.

**Key principle**: no check runs only in CI. Every CI check is reproducible
locally. CI covers secrets, build, formatting, markdown,
sub-agents, lint, type-check, and unit tests. E2E, UI, and smoke tests run
locally only (pre-push, `pnpm qg`).

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

See [Release and Publishing](./release-and-publishing.md) for npm package
publishing, and [Milestone Release Runbook](./milestone-release-runbook.md)
for milestone/service release gates, snagging, and go/no-go controls.

## What Does Good Look Like?

For individual contributors:

- Tests written before code at all levels
- All quality gates pass locally (`pnpm qg`) before pushing
- Conventional commit messages that explain _why_, not just _what_
- Documentation updated alongside code changes
- ADRs created for significant architectural decisions
- No disabled checks, no type shortcuts, no skipped tests
