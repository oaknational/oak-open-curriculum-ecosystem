# Agent Tooling Plans

## Scope Boundary — Read This First

This collection is **specifically about the `agent-tools/` workspace** —
the code, CLIs, schemas, and adjacent state/hook substrate that the
workspace owns and ships. It is a *workspace-level* collection at the
*implementation* abstraction layer.

**In scope** (the agent-tools workspace and its direct substrate):

- `agent-tools/` source code, CLIs, validators, codegen, tests
- `.agent/state/collaboration/` (the substrate the CLIs read/write)
- Agent identity derivation (PDR-027) — the actual derivation code in
  `agent-tools/src/core/agent-identity/`
- Platform hooks (`.cursor/hooks/`, `.claude/hooks/`) and their
  three-layer canonical scripts in `.agent/hooks/`
- Intent-to-commit queue, comms/claims state, adapter generation
- Three-layer artefact portability infrastructure (`agent-tools`-side
  validators)

**Out of scope** (handled by [`agentic-engineering-enhancements/`](../agentic-engineering-enhancements/)):

- Anything about *how agents work* in the abstract — collaboration
  doctrine, planning discipline, communication patterns, Practice texts,
  repo structure, governance concepts, learning loops, doctrine
  enforcement, specialist reviewer capabilities, evidence guards,
  hallucination guards, mutation testing.

The two collections operate at **different abstraction levels**:

| Collection | Abstraction | Asks |
|------------|-------------|------|
| `agent-tooling/` | Implementation: a workspace and its substrate | "Does the CLI / schema / state surface work correctly and ergonomically?" |
| `agentic-engineering-enhancements/` | Practice + governance: how agents do anything | "How should agents collaborate, plan, communicate, learn, review, and shape this repo?" |

If a plan's substance is *what code lives in `agent-tools/`* or
*what shape `.agent/state/collaboration/` should take*, it belongs here.
If a plan's substance is *how agents reason, coordinate, learn, or
practice*, it belongs in `agentic-engineering-enhancements/`. When in
doubt, ask: "could this plan exist if `agent-tools/` did not?" If yes,
it is broader than this collection.

**Status**: 🔄 Active + queued execution
**Last Updated**: 2026-05-12

## Current Controlling Plan

[`current/cost-of-collaboration.plan.md`](current/cost-of-collaboration.plan.md)
is the current single source of truth for agent communication and
agent-tooling improvement work. It subsumes
[`current/primary-agent-tooling-enhancements.plan.md`](current/primary-agent-tooling-enhancements.plan.md),
which remains only as a superseded back-pointer for older handoffs, napkin
entries, and comms references.

Use this relationship when routing work:

- implementation changes to `agent-tools/`, `.agent/state/collaboration/`,
  hooks, identity plumbing, commit queue, comms, or collaboration-state
  substrate route through `cost-of-collaboration.plan.md`;
- broader doctrine about how agents collaborate, plan, communicate, learn, or
  govern the Practice remains in
  [`agentic-engineering-enhancements/`](../agentic-engineering-enhancements/).

---

## Why This Collection Exists

Agent tooling work has a different change-cost profile than practice
doctrine, governance, or specialist-expert work:

- **Tooling changes are code** — they move through TDD cycles, type-check,
  lint, tests, and build gates. Doctrine and governance changes are
  documentation.
- **Tooling changes have direct user impact** — a CLI flag rename or an
  identity-derivation change is felt by every agent in their next session,
  whereas doctrine changes propagate through the layered-knowledge-processing
  cycle.
- **Tooling changes have isolated boundaries** — most live in
  `agent-tools/`, `.agent/state/collaboration/`, `.agent/hooks/`, or
  platform-adapter directories. Doctrine and governance changes touch
  directives, practice-core, ADRs, and the broader Practice surface.

Splitting the collection makes both surfaces easier to navigate, plan, and
review.

---

## Lifecycle Structure

| Lane | Purpose | Plan Form |
|------|---------|-----------|
| [`active/`](active/) | NOW — in-progress execution | Executable |
| [`current/`](current/) | NEXT — queued and ready | Executable |
| [`future/`](future/) | LATER — strategic backlog and intent | Strategic |
| [`archive/`](archive/) | Completed or superseded plans | Reference |

---

## Frictions Register

Live frictions and gaps in the agent tooling substrate, captured from
napkin observations, inter-agent comms, and post-session reviews. Each
entry has source citation, observed behaviour, candidate cure, and current
status.

→ [`frictions-register.md`](frictions-register.md)

The frictions register is a **capture surface**, not an execution plan. Items
mature into:

1. A line on a `current/` or `future/` plan when they fit existing scope, OR
2. A new `current/` or `future/` plan when they justify their own work item, OR
3. A direct fix when the cure is small and obvious enough to land in a peer
   plan's commit cycle.

---

## Plan Index

See [`current/README.md`](current/README.md) and
[`future/README.md`](future/README.md) for the per-lane indices.

---

## Related Collections

| Collection | Why It's Separate |
|------------|-------------------|
| [`agentic-engineering-enhancements/`](../agentic-engineering-enhancements/) | Doctrine, practice texts, specialist reviewer capabilities, governance concepts |
| [`developer-experience/`](../developer-experience/) | Engineer-facing dev ergonomics (SDK publishing, generated docs, strictness convergence) |
| [`architecture-and-infrastructure/`](../architecture-and-infrastructure/) | Cross-cutting architecture, system quality, observability infrastructure |

---

## Quality Gates

Tooling changes go through the standard repo gates:

```bash
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm test
pnpm portability:check
pnpm subagents:check
```

See [`docs/engineering/build-system.md`](../../../docs/engineering/build-system.md)
for the canonical command list.
