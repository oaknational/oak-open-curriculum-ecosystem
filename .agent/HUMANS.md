# .agent/ — A Note for Human Readers

This directory is **AI agent infrastructure**. It is not intended for human
developers to read or maintain directly.

## What is this?

This repository is built through agentic engineering — AI agents write the
code, humans provide direction and design guardrails. The `.agent/` directory
(~20 subdirectories, hundreds of files) is the operational scaffolding that
makes this work: rules, plans, session memory, specialist reviewer
definitions, and a learning loop that improves governance over time. The
formal definition is in
[ADR-119](../docs/architecture/architectural-decisions/119-agentic-engineering-practice.md),
and the root [README](../README.md#engineering-practice) has a plain-language
overview.

## Do I need to read any of this?

Almost certainly not. If you are a human developer:

- **Start with the [README](../README.md)** at the repository root —
  the [Quick Start](../README.md#quick-start) section covers setup and
  the key commands
- **Read [CONTRIBUTING.md](../CONTRIBUTING.md)** for contribution
  guidelines and code standards
- **Browse the [docs/](../docs/)** directory for architecture,
  engineering, and operations documentation

## Why are there also .claude/, .cursor/, .gemini/ directories?

This repo uses a three-layer model
([ADR-125](../docs/architecture/architectural-decisions/125-agent-artefact-portability.md)):

1. **`.agent/`** — canonical content (rules, skills, commands)
2. **`.claude/`, `.cursor/`, `.gemini/`, `.codex/`, `.agents/`** — thin
   platform adapters that point back to `.agent/`
3. **`CLAUDE.md`, `AGENTS.md`, `GEMINI.md`** — entry points that each
   platform reads automatically

The adapters exist so the same rules and capabilities work across different
AI tooling. If you see similar-looking files in `.claude/rules/` and
`.agent/rules/`, the `.claude/` version is a one-line pointer to the
canonical `.agent/` version.

## Can I safely ignore this directory?

Yes. None of these files affect the build, CI, or test execution. The
quality gates (`pnpm check`, `pnpm test`, `pnpm type-check`) are what
enforce code quality. The `.agent/` directory helps AI agents follow the
same standards that human developers follow, but the gates themselves are
the enforcement mechanism — not these files.

## What if I'm curious?

The most readable parts of `.agent/` for humans:

- [memory/patterns/](memory/patterns/README.md) — 77 reusable solutions
  to recurring design problems, with anti-patterns and evidence
- [memory/distilled.md](memory/distilled.md) — hard-won rules from
  accumulated session experience
- [directives/principles.md](directives/principles.md) — the code
  quality and architecture rules that govern all work

If you want to understand how the practice works:

- [How the Agentic Engineering System Works](../docs/foundation/agentic-engineering-system.md)
  — the Practice explained as an integrated engineering system: how rules, quality gates, specialist reviewers,
  learning loops, and propagation mechanisms form a coherent safety
  and quality net (same system, different audience lens)
- [Engineering Practice](../README.md#engineering-practice) in the root
  README — plain-language overview
- [ADR-119](../docs/architecture/architectural-decisions/119-agentic-engineering-practice.md)
  — naming, boundaries, and the three-layer model
- [ADR-131](../docs/architecture/architectural-decisions/131-self-reinforcing-improvement-loop.md)
  — the learning loop that makes the practice self-improving
- [.agent/README.md](README.md) — the directory layout (written for
  agents, but readable)
