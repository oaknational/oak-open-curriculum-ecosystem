---
plan_id: good-first-issues
title: "Good First Issues"
type: strategic-index
status: active
last_updated: 2026-05-10
related_indices:
  - "high-level-plan.md"
---

# Good First Issues

A curated entry point for picking up first useful work in this repository.
Audience: Oak teammates and AI coding teammates (Claude Code, Cursor, Codex,
Gemini, Copilot, Windsurf) ramping up on the Open Curriculum ecosystem.

External pull requests are not currently accepted (see
[CONTRIBUTING.md](../../CONTRIBUTING.md)). External readers are still welcome
to read, fork, and learn from the code.

## Authoritative live list

The authoritative, drift-free list of starter tasks is the GitHub label:

**[github.com/oaknational/oak-open-curriculum-ecosystem — `good first issue`](https://github.com/oaknational/oak-open-curriculum-ecosystem/labels/good%20first%20issue)**

Use that surface first. The curated entries below complement the issue list
with stable, area-shaped onramps that do not depend on a specific open ticket.

## Stable area onramps

Each entry points at a stable area (an ADR, a workspace, or a directory),
not a transient task description. The entry survives even when individual
tasks in that area come and go. Pick whichever onramp matches the kind of
contribution you want to make first.

### A. Documentation and ADR drift fixes

- **Area**: [`docs/`](../../docs/) and
  [`docs/architecture/architectural-decisions/`](../../docs/architecture/architectural-decisions/)
- **Why this is a good first issue**: Reading and lightly correcting docs is
  the fastest way to internalise the system without committing to deep code
  changes. Pairs naturally with the
  [docs-adr-expert](../../.claude/agents/docs-adr-expert.md) sub-agent.
- **Definition of done**: Drift identified, corrected in place, no parallel
  copies introduced, all cross-links still resolve.

### B. TSDoc / inline-doc additions in a single workspace

- **Area**: any single workspace under
  [`packages/`](../../packages/) or [`apps/`](../../apps/)
- **Why this is a good first issue**: TSDoc is bounded, mechanical to verify,
  and a forced tour of the public API of one workspace.
- **Definition of done**: TSDoc on every exported symbol in the chosen
  workspace, `pnpm doc-gen` clean, no behaviour changes.

### C. Quality-gate fix in one workspace

- **Area**: any single workspace where `pnpm test`, `pnpm type-check`,
  `pnpm lint`, or `pnpm build` is green but a quality signal (knip, depcruise,
  Sonar) shows a finding
- **Why this is a good first issue**: Single-finding, bounded scope, gives
  hands-on experience of the quality-gate stack.
- **Definition of done**: The targeted finding cleared, no rules disabled, no
  gate weakened, all gates remain green.

### D. Schema-first verification of generated artefacts

- **Area**: [`packages/sdks/oak-curriculum-sdk/`](../../packages/sdks/oak-curriculum-sdk/)
  and [`packages/sdks/oak-sdk-codegen/`](../../packages/sdks/oak-sdk-codegen/)
- **Why this is a good first issue**: Forces a tour of the
  [Cardinal Rule](../directives/principles.md#cardinal-rule-of-this-repository)
  of this repository — types flow from the OpenAPI schema. Finding a
  generated artefact that is missing or misaligned is a generator bug worth
  reporting (or, if scoped, fixing).
- **Definition of done**: A specific generated-artefact gap captured as a
  GitHub issue with reproduction steps; or, if scoped to fix, a generator
  change that closes the gap with `pnpm sdk-codegen` regenerating cleanly.

### E. MCP tool snagging on the canonical HTTP MCP server

- **Area**: [`apps/oak-curriculum-mcp-streamable-http/`](../../apps/oak-curriculum-mcp-streamable-http/)
- **Why this is a good first issue**: The canonical MCP server exposes 34
  curriculum tools; any one of them can be exercised end-to-end against the
  live invite-only alpha and surface a small, well-bounded snag.
- **Definition of done**: A reproducible snag captured (issue, with curl /
  client repro) — or, if scoped to fix, a TDD cycle that closes it.

## How to choose

If you are not sure which area to start in:

1. Skim the [`good first issue` label](https://github.com/oaknational/oak-open-curriculum-ecosystem/labels/good%20first%20issue)
   first. A live, well-shaped issue beats a self-defined onramp.
2. If nothing live appeals, pick the area onramp that most overlaps the
   workspace you expect to spend most time in.
3. Run [`/start-right-quick`](../skills/start-right-quick/SKILL-CANONICAL.md)
   before the first edit. For ambiguous scope, follow with
   [`/metacognition`](../skills/metacognition/SKILL-CANONICAL.md).

## Maintenance

- **Owner**: this repository's documentation owners.
- **Review trigger**: when an area onramp's definition-of-done no longer
  matches the area's shape; when a workspace listed in an onramp is renamed,
  retired, or split; when a new onramp area becomes a recurring "this would
  have been a good first task" pattern.
- **Out of scope**: a list of every individual open ticket — that is the
  GitHub label's job. This document is for the area-shaped onramps that
  outlive individual tickets.
