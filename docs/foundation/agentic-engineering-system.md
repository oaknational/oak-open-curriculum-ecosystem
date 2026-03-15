---
title: How the Agentic Engineering System Works
status: active
last_reviewed: 2026-03-12
---

# How the Agentic Engineering System Works

**Audience**: Engineers interested in how the agentic engineering principles of [the Practice](../../.agent/practice-core/README.md) are applied, embodied, and codified in this repository. This is an engineering explanation, not a how-to guide.

**What this document is**: This is the Practice — the same system documented in [`.agent/practice-core/practice.md`](../../.agent/practice-core/practice.md) — explained through an engineering lens for human readers. The agent-facing blueprint tells agents what to do; this document explains how and why the interacting pieces form a coherent system. [ADR-119](../architecture/architectural-decisions/119-agentic-engineering-practice.md) records the naming and framing decision. [ADR-131](../architecture/architectural-decisions/131-self-reinforcing-improvement-loop.md) documents the interaction map and self-referential property.

## What This System Does

Every line of code, configuration, and documentation in this repository is written by AI agents. Humans provide direction, design guardrails, and corrective feedback. The **Agentic Engineering Practice** — "the Practice" — is the interconnected system that makes this safe, high-quality, and self-improving. It is not a static rulebook; it is a living system with control loops, learning loops, and propagation mechanisms that compound quality over time. See [ADR-119 §Why "Practice" and Not "Framework"](../architecture/architectural-decisions/119-agentic-engineering-practice.md) for the philosophical distinction.

## Where Things Live

Before understanding how the pieces interact, it helps to know where they are.

| Location                                                                                 | What lives there                                                  | Audience                       |
| ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------ |
| [`.agent/directives/`](../../.agent/directives/)                                         | Authoritative rules, testing strategy, schema-first directive     | Agents (operational grounding) |
| [`.agent/rules/`](../../.agent/rules/)                                                   | Individual canonical rules, referenced by platform adapters       | Agents (always-applied)        |
| [`.agent/practice-core/`](../../.agent/practice-core/)                                   | Portable blueprint: the Practice's DNA that travels between repos | Agents + Practice maintainers  |
| [`.agent/plans/`](../../.agent/plans/)                                                   | Executable work plans with lifecycle management                   | Agents (execution context)     |
| [`.agent/memory/`](../../.agent/memory/)                                                 | Session learning: napkin, distilled patterns, code patterns       | Agents (institutional memory)  |
| [`.agent/experience/`](../../.agent/experience/)                                         | Qualitative records of what work was like                         | Both (reflective learning)     |
| [`.agent/sub-agents/`](../../.agent/sub-agents/)                                         | Specialist reviewer definitions                                   | Agents (review infrastructure) |
| [`docs/architecture/architectural-decisions/`](../architecture/architectural-decisions/) | ADRs — the architectural source of truth                          | Both (permanent decisions)     |
| [`docs/governance/`](../governance/)                                                     | Code standards, TypeScript practice, safety policy                | Both (prescriptive standards)  |
| `.claude/`, `.cursor/`, `.gemini/`, `.codex/`                                            | Thin platform adapters pointing to `.agent/` canonical content    | Platform-specific agents       |

The three-layer architecture ([ADR-125](../architecture/architectural-decisions/125-agent-artefact-portability.md)): canonical content in `.agent/`, thin platform adapters in `.claude/`/`.cursor/`/etc., and entry points (`CLAUDE.md`, `AGENTS.md`, `GEMINI.md`) that each platform reads automatically. Edit the canonical version; adapters follow.

## The Three Layers

The Practice operates in three layers, each building on the one below. See [`practice.md` §Three Layers](../../.agent/practice-core/practice.md) for the full treatment.

- **Philosophy** — the principles and learning mechanisms that define _why_ it works. The [First Question](../../.agent/directives/AGENT.md) ("could it be simpler?"), [metacognition](../../.agent/directives/metacognition.md), and the knowledge flow. Architectural enforcement is a core commitment: physical constraints (lint rules, boundary tooling) are preferred over human vigilance.
- **Structure** — the organisational patterns that define _what_ it consists of. [Directives](../../.agent/directives/), [plans](../../.agent/plans/), [ADRs](../architecture/architectural-decisions/), [specialist reviewers](../../.agent/sub-agents/), [quality gates](../../.agent/directives/principles.md), and [institutional memory](../../.agent/memory/).
- **Tooling** — the platform-specific implementations that define _how_ it is used. Canonical content in `.agent/`, platform adapters, entry points. This layer means the same rules and capabilities work whether you're using Claude, Cursor, Codex, or Gemini.

The layers interact: philosophy governs what structures are created (e.g. "if a behaviour must be automatic, it needs a rule, not just a skill"). Structure enables tooling (e.g. canonical rules become platform-specific always-applied triggers). Tooling feeds back into philosophy through the learning loop.

## Control Loops — How Quality Is Maintained

The system prevents entropy through interlocking negative feedback loops.

**Quality gates** are the primary enforcement mechanism. Every change must pass: type-check, lint, build, test, format, markdownlint. The critical design choice: **all gates are always blocking** — there is no "non-blocking warning" category. This is enforced through [always-applied rules](../../.agent/rules/all-quality-gate-issues-are-always-blocking.md) that fire on every agent interaction, pre-commit hooks that run automatically, and the `pnpm qg` command that runs the full suite. Gates catch entropy within seconds.

**Specialist reviewers** provide targeted review after non-trivial changes. The [specialist roster](../../.agent/directives/invoke-code-reviewers.md) includes a gateway reviewer (`code-reviewer`) that triages to specialists: architecture reviewers (4, each with a different lens), test-reviewer, type-reviewer, security-reviewer, config-reviewer, docs-adr-reviewer, and domain specialists. Reviewers catch entropy within the session — they assess not just code correctness but architectural alignment with the Practice itself.

**Strict rules** ([`principles.md`](../../.agent/directives/principles.md)) encode non-negotiable constraints: TDD at all levels, no type shortcuts, fail fast with helpful errors, no disabled checks, no compatibility layers. These are not guidelines — they are enforced by lint rules, compiler checks, and reviewer scrutiny. Rules catch entropy at authoring time.

## Learning Loops — How Knowledge Compounds

The system improves over time through the [Knowledge Flow](../../.agent/practice-core/practice.md#the-knowledge-flow) — a progression from raw observation to settled governance.

**Capture** → **Refine** → **Graduate** → **Enforce** → **Work** → repeat.

Each stage serves a broader audience: the napkin serves the current session, distilled learnings serve future agents, permanent docs (ADRs, governance, READMEs) serve everyone. Each transition raises the bar for what passes through. The [`/jc-consolidate-docs`](../../.agent/commands/consolidate-docs.md) command drives graduation and is where the intra-repo loop, inter-repo integration, and fitness regulation all converge ([ADR-131 §Consolidate-Docs](../architecture/architectural-decisions/131-self-reinforcing-improvement-loop.md)).

**Fitness functions** prevent unbounded growth at every stage. The napkin triggers distillation at ~500 lines. Distilled targets <200 lines. Permanent docs carry a `fitness_ceiling` in YAML frontmatter with a `split_strategy` — exceeding the ceiling triggers splitting by responsibility, not compression. Without these governors, the learning loop simply moves accumulation downstream.

The loop is **self-referential**: rules about rule creation, patterns about distillation quality, and insights about consolidation all flow through the same cycle. If any link breaks — if the napkin stops capturing meta-mistakes, or consolidation never graduates insights about consolidation — the loop is degrading. [ADR-131 §The Self-Referential Property](../architecture/architectural-decisions/131-self-reinforcing-improvement-loop.md) provides the diagnostic signals.

## Continuity — How Context Survives Across Sessions

Different mechanisms serve different time horizons:

| Mechanism                                           | Time horizon    | Purpose                                           |
| --------------------------------------------------- | --------------- | ------------------------------------------------- |
| [Napkin](../../.agent/memory/napkin.md)             | Current session | Raw capture of mistakes, discoveries, corrections |
| [Distilled](../../.agent/memory/distilled.md)       | Cross-session   | Curated patterns, read at session start           |
| [Session prompts](../../.agent/prompts/)            | Domain-scoped   | Reusable playbooks carrying operational context   |
| [Execution plans](../../.agent/plans/)              | Weeks to months | Phased work with acceptance criteria and evidence |
| [ADRs](../architecture/architectural-decisions/)    | Permanent       | Architectural decisions and their rationale       |
| [Code patterns](../../.agent/memory/code-patterns/) | Permanent       | Proven abstractions for recurring situations      |

Plans follow a lifecycle (`future/` → `current/` → `active/` → `archive/completed/`) and carry value traceability: every non-trivial plan states the outcome sought, the impact it should create, and the mechanism by which that creates value. Plans with acceptance criteria and deterministic validation commands make completion objective rather than subjective.

## Propagation — How the Practice Travels Between Repos

The Practice is not confined to this repository. The portable part — six files called the **Practice Core** — travels via [plasmid exchange](../architecture/architectural-decisions/124-practice-propagation-model.md). Each repo carries its own Practice instance; there is no hierarchy.

The mechanism: a sending repo copies its Practice Core into a receiving repo's **Practice Box** (`.agent/practice-core/incoming/`). The receiving repo checks provenance chains, compares against its own Practice, applies a three-part bar (validated by real work? prevents recurring mistakes? stable?), and integrates what clears the bar. Different repos stress-test the Practice against different work, surfacing learnings that travel back to the origin.

This makes the knowledge flow **self-replicating**: a receiving repo inherits not just current rules but the mechanism that produces them.

## Failure Modes and Diagnostic Signals

The system degrades when:

- **Gates are bypassed** — entropy enters faster than the loop can correct. The "never disable checks" rule exists specifically to prevent this.
- **The napkin goes silent** — the capture stage has degraded; learning stops.
- **Consolidation is skipped** — distilled knowledge accumulates but never becomes permanent governance. The loop stalls at refinement.
- **Fitness ceilings are ignored** — documents bloat, agents exhaust context windows reading overlapping content, and the self-teaching property breaks down.
- **Reviewers are not invoked** — architectural drift goes undetected until it compounds into structural problems.

[ADR-131](../architecture/architectural-decisions/131-self-reinforcing-improvement-loop.md) provides the full diagnostic checklist.

## Further Reading

- [The Practice — human-friendly introduction](../../.agent/practice-core/README.md)
- [ADR-119 — naming, boundary, and three-layer model](../architecture/architectural-decisions/119-agentic-engineering-practice.md)
- [ADR-131 — the improvement loop and interaction map](../architecture/architectural-decisions/131-self-reinforcing-improvement-loop.md)
- [ADR-124 — how the Practice travels between repos](../architecture/architectural-decisions/124-practice-propagation-model.md)
- [Development Practice — code standards](../governance/development-practice.md)
- [`.agent/HUMANS.md`](../../.agent/HUMANS.md) — contributor context for human developers
