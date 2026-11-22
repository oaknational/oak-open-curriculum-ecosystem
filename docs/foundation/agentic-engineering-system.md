---
title: How the Agentic Engineering System Works
status: active
last_reviewed: 2026-11-22
---

# How the Agentic Engineering System Works

**Audience**: Engineers interested in how the agentic engineering principles of [the Practice](../../.agent/practice-core/README.md) are applied, embodied, and codified in this repository. This is an engineering explanation, not a how-to guide; its pair, [Working with this Repo for Devs](../engineering/working-with-this-repo-for-devs.md), is the how-to.

**What this document is**: This document explains the Practice through an engineering lens for human readers. Canonical doctrine remains in the ADRs, Practice Core, and the permanent `/docs/**` surfaces they link together. The agent-facing blueprint tells agents what to do; this page explains how and why the interacting pieces form a coherent system. [ADR-119](../architecture/architectural-decisions/119-agentic-engineering-practice.md) records the naming and framing decision. [ADR-131](../architecture/architectural-decisions/131-self-reinforcing-improvement-loop.md) documents the interaction map and self-referential property.

For the wider source corpus — reference notes, concept deep dives, research
lanes, evidence surfaces, and formal report lanes — use the
[Agentic Engineering Research Lanes & Hub](../../.agent/research/agentic-engineering/README.md).

## What This System Does

The code in this repository is written by AI agents, directed by Oak's
engineers. Humans provide direction, design guardrails, and corrective
feedback. Agents do the work inside those guardrails, often with nobody
watching
([Unattended Work](#unattended-work--what-an-agent-can-and-cannot-do)).
The **Agentic Engineering Practice** — "the Practice" —
is the interconnected system that makes this safe, high-quality, and
self-improving. It is a reusable plain-text framework for agentic-first
engineering: agents from major vendors can collaborate, learn, adapt, and keep
institutional and operational knowledge in the repo where it is useful. It is
not a static rulebook; it is a living system with control loops, learning
loops, and propagation mechanisms that compound quality over time. See
[ADR-119 §Why "Practice" and Not "Framework"](../architecture/architectural-decisions/119-agentic-engineering-practice.md)
for the philosophical distinction.

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

The three-layer architecture ([ADR-125](../architecture/architectural-decisions/125-agent-artefact-portability.md)): canonical content in `.agent/`, thin platform adapters in `.claude/`/`.cursor/`/etc., and entry points (`CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, `skills.md`) that platforms read or can use (`skills.md` is guidance [Linear coding sessions](https://linear.app/docs/coding-sessions) can use). Edit the canonical version; adapters follow.

## The Three Layers

The Practice operates in three layers, each building on the one below. See [`practice.md` §Three Layers](../../.agent/practice-core/practice.md) for the full treatment.

- **Philosophy** — the principles and learning mechanisms that define _why_ it works. The [First Question](../../.agent/directives/AGENT.md) ("could it be simpler?"), [metacognition](../../.agent/directives/metacognition.md), and the knowledge flow. Architectural enforcement is a core commitment: physical constraints (lint rules, boundary tooling) are preferred over human vigilance.
- **Structure** — the organisational patterns that define _what_ it consists of. [Directives](../../.agent/directives/), [plans](../../.agent/plans/), [ADRs](../architecture/architectural-decisions/), [specialist reviewers](../../.agent/sub-agents/), [quality gates](../../.agent/directives/principles.md), and [institutional memory](../../.agent/memory/).
- **Tooling** — the platform-specific implementations that define _how_ it is used. Canonical content in `.agent/`, platform adapters, entry points. This layer means the same rules and capabilities work whether you're using Claude, Cursor, Codex, Gemini, or a Linear coding session.

The layers interact: philosophy governs what structures are created (e.g. "if a behaviour must be automatic, it needs a rule, not just a skill"). Structure enables tooling (e.g. canonical rules become platform-specific always-applied triggers). Tooling feeds back into philosophy through the learning loop.

## Control Loops — How Quality Is Maintained

The system prevents entropy through interlocking negative feedback loops.

**Quality gates** are the primary enforcement mechanism. One command, `pnpm check`, runs the whole set, and the `check` script in the root [`package.json`](../../package.json) is its definition. In outline:

- a secrets scan;
- format, Markdown and shell lint;
- code generation, then build, type-check, lint, unit and end-to-end tests in every workspace;
- browser, widget and accessibility tests;
- unused-code and dependency-direction checks;
- checks that the agent tooling (skills, sub-agents, platform adapters) is consistent;
- the repository's own validators, which hold documents and records to their rules (links resolve, cited scripts exist, no personal file path or account name is committed).

The critical design choice: **all gates are always blocking** — there is no "non-blocking warning" category inside the gate set. This is enforced through [architectural principles](../../.agent/directives/principles.md) (§Code Quality) that fire on every agent interaction. Informational health checks such as `pnpm practice:fitness:informational` sit outside `pnpm check`; they surface drift without redefining it as a quality gate. Gates catch entropy before a change leaves the machine.

**Specialist reviewers** provide targeted review after non-trivial changes. The [specialist roster](../../.agent/memory/executive/invoke-code-experts.md) includes a gateway reviewer (`code-expert`) that triages to specialists: architecture reviewers (4, each with a different lens), test-expert, type-expert, security-expert, config-expert, docs-adr-expert, and domain specialists. Reviewers catch entropy within the session — they assess not just code correctness but architectural alignment with the Practice itself.

**Strict rules** ([`principles.md`](../../.agent/directives/principles.md)) encode non-negotiable constraints: TDD at all levels, no type shortcuts, fail fast with helpful errors, no disabled checks, no compatibility layers. These are not guidelines — they are enforced by lint rules, compiler checks, and reviewer scrutiny. Rules catch entropy at authoring time.

## Unattended Work — What an Agent Can and Cannot Do

No person was at a keyboard when an agent's commit was made. Its timestamp
records when the agent ran, which can be any hour of any day. The author
field names the person who directed the work, not someone working at that
hour; the committer is the bot. On GitHub an agent that works from an
engineer's machine acts as a bot account, so the platform's own record says
an agent opened, answered and merged a pull request. An agent in a hosted
cloud session uses the credential configured for that session, and never
merges.

A person sets the work going, usually by directing and approving a plan, and
may not look again until it is done. To ask about a pull request, ask the
person named as its commits' author.

What limits the damage an unattended agent can do is a series of gates that
run whether or not anyone is watching. For an agent on an engineer's machine:

- **Before a command runs.** In Claude Code, a guard reads each shell command
  an agent is about to run and refuses the ones that destroy Git history or
  skip a gate: a forced push, an interactive rebase, a commit or push with
  its hooks turned off ([the hook policy](../../.agent/hooks/README.md)). On
  other agent platforms the same limits are rules the agent follows, not a
  guard that stops it.
- **At commit.** A hook refuses a commit on the default branch
  ([the rule](../../.agent/rules/never-commit-to-main.md)). Staged files must
  pass format, Markdown and lint checks, and the commit message its own lint.
- **At push.** The whole of `pnpm check` runs on the machine before anything
  leaves it. A failure stops the push.
- **On the pull request.** CI runs the gates again on clean machines, and adds
  code scanning, static analysis, a dependency review, a secrets scan and a
  preview deployment. The default branch takes changes through pull requests
  only, and its rules name the checks that must pass
  ([CI policy](../engineering/ci-policy.md)).
- **At merge.** An agent merges through one tool, never by hand. The tool
  merges only when every check is green and every review thread is resolved,
  always with a merge commit, and only the exact commit it judged
  ([the merge tool](../engineering/merge-bot.md)). Each act on GitHub uses a
  short-lived token made for that kind of act, for this repository alone,
  with only the permissions that kind of act needs.

An agent in a hosted cloud session has no local hooks to run: by a recorded
ruling it commits and pushes without them, opens a draft pull request at
once, and treats CI's gates on that pull request as the verdict. It checks
the branch, the staged files and the commit message by hand before it
commits, because CI checks none of those, and it does not merge
([the cloud routing](../../.agent/directives/cloud-environment-routing.md)).

**Review on the pull request.** This is separate from the specialist reviewers
above, who read work during a session. A review on the pull request, by a
person or a review bot, is asked for where the change's complexity justifies
one. The merging agent makes that judgement. The merge tool refuses a pull
request with no review unless the agent gives its reason, and it posts that
reason on the pull request before it merges.

**Beyond the gates, rules bind the agent.** Without new, explicit permission
from a person, an agent does not skip a hook, rewrite or delete Git history,
alter a recorded architectural decision, or take a step a plan reserves for a
named person. Where a gate refuses, the agent's job is to fix what the gate
found, never to get past the gate.

**When a bad change gets through anyway**, it is corrected by a new change
through the same gates. History is never rewritten to hide it.

## Learning Loops — How Knowledge Compounds

The system improves over time through the [Knowledge Flow](../../.agent/practice-core/practice.md#the-knowledge-flow) — a progression from raw observation to settled governance.

**Capture** → **Refine** → **Graduate** → **Enforce** → **Work** → repeat.

Each stage serves a broader audience: the napkin serves the current session,
distilled learnings serve future agents, permanent docs (ADRs, governance,
READMEs) serve everyone. Session handoff may conserve a sharp cross-session
lesson directly in `distilled.md`; [`/oak-consolidate-docs`](../../.agent/skills/knowledge/consolidate-docs/SKILL-CANONICAL.md)
remains the deeper graduation pass where the intra-repo loop, inter-repo
integration, and fitness regulation converge
([ADR-131 §Consolidate-Docs](../architecture/architectural-decisions/131-self-reinforcing-improvement-loop.md)).

**Fitness functions** prevent unbounded growth at every stage. The napkin
triggers distillation at its frontmatter threshold. Distilled carries its own
fitness frontmatter because its useful size changes as recent lessons ripen or
graduate. Permanent docs carry YAML frontmatter thresholds (ADR-144):
`fitness_line_target` (soft), `fitness_line_limit` (hard),
`fitness_char_limit` (hard), and `fitness_line_length` (hard), with a
`split_strategy` to describe what happens when a ceiling is exceeded. Without
these governors, the learning loop simply moves accumulation downstream.

The loop is **self-referential**: rules about rule creation, patterns about distillation quality, and insights about consolidation all flow through the same cycle. If any link breaks — if the napkin stops capturing meta-mistakes, or consolidation never graduates insights about consolidation — the loop is degrading. [ADR-131 §The Self-Referential Property](../architecture/architectural-decisions/131-self-reinforcing-improvement-loop.md) provides the diagnostic signals.

## Continuity — How Context Survives Across Sessions

Different mechanisms serve different time horizons:

| Mechanism                                                 | Time horizon    | Purpose                                             |
| --------------------------------------------------------- | --------------- | --------------------------------------------------- |
| [Napkin](../../.agent/memory/active/napkin.md)            | Current session | Raw capture of mistakes, discoveries, corrections   |
| [Distilled](../../.agent/memory/active/distilled.md)      | Cross-session   | Refined lessons, read at session start              |
| [Session prompts](../../.agent/prompts/)                  | Domain-scoped   | Reusable playbooks carrying operational context     |
| [Execution plans](../../.agent/plans/)                    | Weeks to months | Phased work with acceptance criteria and evidence   |
| [ADRs](../architecture/architectural-decisions/)          | Permanent       | Architectural decisions and their rationale         |
| [Patterns](../../.agent/memory/active/patterns/README.md) | Permanent       | Reusable abstractions for recurring design problems |

Plans are of three types ([the planning estate](../../.agent/plans/README.md)): strategic plans hold an outcome and the bet behind it, delivery plans hold one step of the work and are archived when it is done, and runbooks hold a repeatable procedure. A plan governs no work until a person has ratified it. Plans carry value traceability: every non-trivial plan states the outcome sought, the impact it should create, and the mechanism by which that creates value. Plans with acceptance criteria and deterministic validation commands make completion objective rather than subjective.

## Propagation — How the Practice Travels Between Repos

The Practice is not confined to this repository. The portable part — a bounded
package of files called the [**Practice Core**](../../.agent/practice-core/index.md) — travels via
[plasmid exchange](../architecture/architectural-decisions/124-practice-propagation-model.md).
Each repo carries its own Practice instance; there is no hierarchy.

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

- [Working with this Repo for Devs — the practical how-to pair of this page](../engineering/working-with-this-repo-for-devs.md)
- [The Practice — human-friendly introduction](../../.agent/practice-core/README.md)
- [Agentic Engineering Research Lanes & Hub — source lanes and deep dives](../../.agent/research/agentic-engineering/README.md)
- [ADR-119 — naming, boundary, and three-layer model](../architecture/architectural-decisions/119-agentic-engineering-practice.md)
- [ADR-131 — the improvement loop and interaction map](../architecture/architectural-decisions/131-self-reinforcing-improvement-loop.md)
- [ADR-124 — how the Practice travels between repos](../architecture/architectural-decisions/124-practice-propagation-model.md)
- [Development Practice — code standards](../governance/development-practice.md)
- [`.agent/HUMANS.md`](../../.agent/HUMANS.md) — contributor context for human developers
