# Development Workflow

**Last Updated**: 2026-04-11  
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
pnpm check # canonical aggregate gate: clean rebuild + verification
```

See [Build System](./build-system.md) for the single source of truth on all command definitions.
For AI agent execution order, directives are normative and require one gate at
a time; `pnpm make` and `pnpm check` are the only aggregate local workflow
commands.

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

Quality is enforced through the hook surfaces, GitHub CI workflow, and the
canonical local aggregate gate `pnpm check`. Each runs a specific set of
checks; see
[ADR-121](../architecture/architectural-decisions/121-quality-gate-surfaces.md)
for the full coverage matrix and rationale, or
[build-system.md](build-system.md#quality-gate-surfaces) for a quick
reference table.

**Key principle**: pre-push and CI run the same check set. A CI-only failure
indicates an environmental or configuration issue, not a missing check. Both
surfaces cover secrets, build, formatting, markdown, sub-agents, portability,
knip (unused code detection), depcruise (circular deps, orphans, layer
violations), workspace-owned repo validators, lint, type-check, unit tests,
E2E, UI, and smoke tests. `pnpm check` adds widget tests, a11y tests, doc-gen,
clean rebuild, and fix-mode commands.

## 8. AI Sub-Agent Review

During development, the AI agent working on the code invokes specialist sub-agent reviewers. These are automated quality checks that run within the AI development workflow.

### What the sub-agents do

| Sub-agent               | Focus                                                     |
| ----------------------- | --------------------------------------------------------- |
| `code-expert`           | Gateway reviewer: code quality, security, maintainability |
| `architecture-expert-*` | Structural boundaries, dependency direction, coupling     |
| `test-expert`           | TDD compliance, test quality, mock simplicity             |
| `type-expert`           | Type safety, generics, schema-to-type flow                |
| `config-expert`         | Tooling config consistency, quality gate alignment        |
| `security-expert`       | Auth, secrets, PII, injection risks                       |
| `docs-adr-expert`       | Documentation completeness, ADR accuracy                  |
| `sentry-expert`         | Sentry SDK usage, OTel observability, MCP Insights        |

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

When a feature branch has diverged significantly from `main` (100+ files
changed on either side, 10+ conflicts in a dry-run merge), follow the
[Pre-Merge Divergence Analysis](./pre-merge-analysis.md) guide before
attempting the merge. Standard conflict resolution misses type-system breaks,
deleted-file cascades, and signature mismatches in auto-merged files.

## 11. Release

Releases are automated via [semantic-release](https://semantic-release.gitbook.io/):

1. PRs merged to `main` trigger the release workflow
2. Version is bumped based on conventional commit types (`feat` → minor, `fix` → patch)
3. A GitHub release is created automatically
4. npm packages are published for public packages

See [Release and Publishing](./release-and-publishing.md) for npm package
publishing, and [Milestone Release Runbook](./milestone-release-runbook.md)
for milestone/service release gates, snagging, and go/no-go controls.

## 12. Workflow Gotchas

Recurring friction patterns that cost cycles when re-discovered. The
common frame: **the literal command that runs is what matters** — not
what a wrapping script appears to forward, not what a generator's CLI
help implies, not what historical local precedent permits.

### Generators Require Populated Source Data

A code-only generator run over sparse or absent local source data can
produce structurally valid but semantically empty output. The generator
exits clean; the file shape is correct; the content is wrong. For any
generator that derives output from input data (ground-truth generators,
fixture builders, schema-from-data tools), run the full
download-then-codegen path when local bulk data is absent, then verify
the expected dataset-size signal (e.g. `Total lessons: 12391`) before
trusting the output. Structural validity is not semantic validity. This
is a CI-shaped failure that often appears local-only because the local
checkout is partial; the proof of generator correctness is in the
verified output, not in the green exit code.

### Use The Test Runner Directly When Script Forwarding Drifts

Package scripts that wrap a test runner sometimes pick up extra suite
selection, parallelism flags, or filter rewrites that broaden the run
beyond what a focused proof needs. When a `pnpm test:unit <file>`
invocation starts running the broader suite or hangs on unrelated
work, drop to the runner directly:
`pnpm --dir <package> exec vitest run <file>`. The literal vitest
invocation is what the proof actually needs; the package script is
optional sugar that has its own drift. Apply the same principle to
typecheck (`pnpm --dir <package> exec tsc --noEmit -p <project>`) and
lint (`pnpm --dir <package> exec eslint <file>`) when their wrapping
scripts misbehave under focused inspection.

### Lettered-Section Edits Must Re-Read The Parent Count

When adding a new `(a)/(b)/(c)/(d)` child to an enumerated section,
re-read the parent sentence — the count is part of the section's
contract. Adding a fourth child without updating "three rules" in the
intro silently turns the intro into a lie. The same applies to
section-count summaries in directive overviews, README tables of
contents, and ADR/PDR-internal enumerations: the count and the children
are co-edited, never independent.

### Growth-Axis Metadata Is Live Doctrine

When a graduation lands a new entry in a long reference or documentation
surface, audit the file's `split_strategy` frontmatter (or equivalent
growth-axis metadata) against the axis the graduation just introduced. The
growth axis is the basis for any future reference-surface restructure; if the
new entry establishes a new axis (a new concern, a new lifecycle stage, a new
failure mode), the split-strategy line must record that before the file grows
further on the wrong axis. Drainable buffers use `drain_strategy` and item
dispositions instead; do not split them to change fitness.

### Shell Loops Over Multi-line Command Output Are Unsafe In Deletion Paths

In deletion or mutation paths, prefer
`while IFS= read -r line; do ... done < <(cmd)` over
`for x in $(cmd)`. Word-splitting in the `for` form silently treats
spaces in filenames or paths as separators, which loses entire lines or
splits one path across two iterations. After any bulk delete or move,
verify the result with a second command (a count, a re-grep, a `git
status` scan) — the shell exit code on its own does not prove the loop
operated on the intended set.

## What Does Good Look Like?

For individual contributors:

- Tests written before code at all levels
- All quality gates pass locally (`pnpm check`) before pushing
- Conventional commit messages that explain _why_, not just _what_
- Documentation updated alongside code changes
- ADRs created for significant architectural decisions
- No disabled checks, no type shortcuts, no skipped tests
