---
fitness_line_target: 200
fitness_line_limit: 275
fitness_char_limit: 16500
fitness_line_length: 100
split_strategy: "Extract detail to referenced docs; this file is an index/entry point"
---

# AGENT.md

This is the operational entry point for AI agents working with this codebase.
Read all of it first, then follow the links that match the work in front of
you. This file is an index and stance-setter; durable detail lives in the
referenced homes.

## Grounding

Commit to British spelling, grammar, and date formats. Reflect on your current
task; update your task list if needed. Apply the
[user-collaboration directive](./user-collaboration.md): dialogue, scope
discipline, human risk acceptance, direct verification, discovery-based
onboarding, and archive discipline. For agent-to-agent collaboration, also
apply the [agent-collaboration directive](./agent-collaboration.md):
knowledge and communication (not mechanical refusals), peer dialogue,
five communication channels, identity vs liveness, and the bootstrap
fast-path. In a coordinated multi-agent session the two first-class seats —
**Director** (minimum-action awareness carrier and single owner-interface)
and **Implementer** (ephemeral, owns one bounded lane) — are defined by
[PDR-117](../practice-core/decision-records/PDR-117-director-and-implementer-roles.md).

For planning work, read [metacognition.md](./metacognition.md) and follow its
reflection discipline before finalising a plan.

## The Practice

This file is the front door to the **agentic engineering practice**: the
self-reinforcing system of principles, structures, reviewers, and tooling that
governs how work happens in this repository.

Start with:

- [practice-core/index.md](../practice-core/index.md) — portable Practice
  orientation
- [practice-index.md](../practice-index.md) — local bridge into this repo's
  live surfaces
- [practice.md](../practice-core/practice.md) — full Practice map
- [practice-lineage.md](../practice-core/practice-lineage.md) — cross-repo
  propagation and plasmid exchange

All work MUST start with the `start-right-quick`, `start-right-thorough`,
or `start-right-team` skill. If none has been specified then read
[`start-right-quick/SKILL-CANONICAL.md`](../skills/start-right-quick/SKILL-CANONICAL.md)
immediately after reading this file, and apply it.

For the layering contract, authority order, and routing rule, see
[orientation.md](./orientation.md).

ADRs define how the system should work and are the architectural source of
truth. Before substantive work, scan the
[5-ADR starter block][adr-5] and open any ADR that matches your work area from
the [ADR index][adr-index].

[adr-5]: ../../docs/architecture/architectural-decisions/README.md#start-here-5-adrs-in-15-minutes
[adr-index]: ../../docs/architecture/architectural-decisions/README.md

## First Question

**Could it be simpler without compromising quality?**

## First Principle

**Strict, everywhere, all the time.**

## Second Question

**Would this be simpler if the system changed?**

## Decision Lenses

The First Principle and the two questions above are lenses #2–#4 of the canonical
[Decision Lenses — Order of Resolution](./principles.md#decision-lenses--order-of-resolution)
in `principles.md`. Lens #1 — **choose long-term architectural excellence at
every decision point** — governs them all, and lens #5 is **optimise for user
value**. Apply them in that order; the first that decisively resolves the
question wins. `principles.md` is canonical for the full ordering.

## Oak Open Curriculum Cardinal Rule

ALL static data structures, types, type guards, Zod schemas, Zod validators,
and other type-related information MUST flow from the Open Curriculum OpenAPI
schema in the SDK and be generated at codegen time. If the upstream OpenAPI
schema changes, then `pnpm sdk-codegen` followed by `pnpm build` MUST be
sufficient to bring all workspaces into alignment.

Use [schema-first-execution.md](./schema-first-execution.md) for the
non-negotiable runtime and generator contract.

## Orientation Requests

When someone asks you to **explain, introduce, or get started with this
repository** — "tell me about this repo", "what is this", "give me an overview",
"how does X work", "I want to understand the search architecture", "onboard me",
"where do I start", "set me up", "help me contribute" — route to the orientation
lens rather than improvising. The human-facing teaching surface is a family
across a portability seam (PDR-112; this host's instantiation is recorded in
ADR-202): a portable lead-in primer plus **one** repo-bound lens that reads the
live docs at answer time.

- *"I'm new to working with AI agents", "teach me to work with agentic AI",
  "what does working with an agent even mean"* → the
  **`working-with-agentic-ai`** primer: a portable, host-free footing primer
  that ends at a single hand-off edge into this repo's own guidance. From its
  edge, continue into the orientation lens. Offer it only as a
  one-step-declinable prelude — an experienced agentic-AI user skips straight to
  the lens.
- *Every other orientation intent* — "explain this repo", "give me an overview",
  "how does X work", "I want to understand area Y", "onboard me", "where do I
  start", "set me up", "help me contribute" → the **`explain`** lens: it
  discerns interest, angle, and delivery mode — a pinpoint specific answer, a
  synthesised area overview, or a paced guided tour that can lead into
  go-ahead-gated machine setup — through at most a few conversational questions,
  never a menu, then delivers. Delivery mode is a discerned variable, not a
  separate skill: discern it internally, never guess it from phrasing and route
  to a fixed behaviour.

A fresh *"I'm new to agentic AI"* enters the primer first, then forwards into the
lens via the named edge; every other orientation intent lands on the lens
directly, with no primer detour.

On a loader platform invoke the skill (`/oak-working-with-agentic-ai`,
`/oak-explain`); on a non-loader platform read and follow the canonical
`.agent/skills/working-with-agentic-ai/SKILL-CANONICAL.md` or
`.agent/skills/explain/SKILL-CANONICAL.md`.

## Project Context

This repository contains libraries, SDKs, MCP servers, search services, and
agent tooling for the Oak Open Curriculum API. Use `pnpm` only. For setup,
package topology, and capabilities, see the [root README](../../README.md) and
[architecture overview](../../docs/architecture/README.md).

## Rules

Read [principles.md](./principles.md); reflect on it, apply it, and follow it
at all times.

The always-applied rule tier lives in [`.agent/rules/`](../rules/). Rules
operationalise principles, ADRs, and PDRs. The canonical, platform-independent
enumeration is [`RULES_INDEX.md`](../../RULES_INDEX.md) at the repo root —
single source of truth for which files belong to the always-applied tier.
Claude and Cursor load their adapter tiers automatically; Codex, Gemini, and
any other non-loader platform MUST read every canonical `.agent/rules/*.md`
file listed in `RULES_INDEX.md` at session open.

## Reviewers And Tools

Apply your own critical thinking, then use reviewers when the platform and
owner direction allow it. Reviewer routing, timing, roster, depth, and reporting
requirements live in
[invoke-code-experts.md](../memory/executive/invoke-code-experts.md).

Agent workflow CLIs live in [agent-tools](../../agent-tools/README.md). Use
root scripts such as `pnpm agent-tools:claude-agent-ops health` from the repo
root.

Agent artefacts follow ADR-125's three-layer model: canonical content in
`.agent/`, thin platform adapters, and platform entrypoints. See
[artefact-inventory.md](../memory/executive/artefact-inventory.md) and
[docs/engineering/extending.md](../../docs/engineering/extending.md) before
adding rules, skills, commands, sub-agents, adapters, or ADRs.

Use the [commit skill canonical](../skills/commit/SKILL-CANONICAL.md) for
commits. It enumerates live commitlint constraints and validates the drafted
message via `pnpm agent-tools:check-commit-message` before `git commit`.

## Memory And Continuity

Institutional memory lives in `.agent/memory/`:

- distilled.md — refined cross-session
  lessons conserved between capture and graduation
- napkin.md — current session observations
- [patterns/](../memory/active/patterns/README.md) — reusable solutions and
  failure modes
- [threads/](../memory/operational/threads/README.md) — thread convention,
  identity discipline, and next-session records

Before inventing a new approach for code, architecture, process, testing, or
agent infrastructure, check the repo-grounded patterns in
[`patterns/`](../memory/active/patterns/README.md). If the problem is a
portable Practice-governance shape, also check PDRs with `pdr_kind: pattern`
in [`.agent/practice-core/decision-records/`](../practice-core/decision-records/README.md).

Before joining an active thread, read the thread record and follow the
additive identity rule.

## Essential Links

Use these links by trigger:

- Core practice: [Development Practice][development],
  [User Collaboration Practice](./user-collaboration.md),
  [Agent Collaboration Practice](./agent-collaboration.md),
  [Testing Strategy](testing-strategy.md),
  [Validation Strategy](validation-strategy.md),
  [Definition of Delivery](./definition-of-delivery.md),
  [TypeScript Practice][typescript], [Safety and Security][security]
- Architecture and schema: [Architecture][architecture], [ADR index][adr-index],
  [ADR-029][adr-029], [ADR-030][adr-030], [ADR-031][adr-031],
  [Schema-First MCP Execution](./schema-first-execution.md),
  [Semantic Search Architecture][semantic-search]
- UI and design: [Accessibility Practice][accessibility],
  [Design Token Practice][design-tokens], [MCP App Styling][mcp-app-styling]
- Build and operations: [Build System][build-system],
  [Troubleshooting][troubleshooting]
- Vision and domain: [Vision][vision], [Curriculum Guidance][curriculum],
  [Experience Recording](../experience/README.md)
- Authoring outward copy: [Editorial Tone](./editorial-tone.md) — apply when
  writing the vision, strategy, or the public-facing parts of the README; never
  to plans or developer-facing docs

[development]: ../../docs/governance/development-practice.md
[typescript]: ../../docs/governance/typescript-practice.md
[security]: ../../docs/governance/safety-and-security.md
[architecture]: ../../docs/architecture/README.md
[adr-029]: ../../docs/architecture/architectural-decisions/029-no-manual-api-data.md
[adr-030]: ../../docs/architecture/architectural-decisions/030-sdk-single-source-truth.md
[adr-031]: ../../docs/architecture/architectural-decisions/031-generation-time-extraction.md
[semantic-search]: ../../docs/agent-guidance/semantic-search-architecture.md
[accessibility]: ../../docs/governance/accessibility-practice.md
[design-tokens]: ../../docs/governance/design-token-practice.md
[mcp-app-styling]: ../../docs/governance/mcp-app-styling.md
[build-system]: ../../docs/engineering/build-system.md
[troubleshooting]: ../../docs/operations/troubleshooting.md
[vision]: ../../VISION.md
[curriculum]: ../../docs/governance/curriculum-tools-guidance-and-playbooks.md

## Commands

From the repo root. Run gates one at a time while iterating; use `pnpm check`
for canonical aggregate verification. The command source of truth is
[Build System](../../docs/engineering/build-system.md) plus root
`package.json`.

When collecting evidence, keep independent command outputs attributable. Run
independent checks separately or through the parallel tool wrapper; use shell
chaining only when the dependency between commands is the behaviour being
tested.

Common entrypoints:

```bash
pnpm install
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm practice:fitness:informational
pnpm practice:vocabulary
pnpm check
```
