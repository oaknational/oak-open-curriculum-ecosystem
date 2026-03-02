# .agent/ — A Note for Human Readers

This directory is **AI agent infrastructure**. It is not intended for human
developers to read or maintain directly.

## What is this?

The `.agent/` directory contains the operational scaffolding for the
agentic engineering practice described in
[ADR-119](../docs/architecture/architectural-decisions/119-agentic-engineering-practice.md).
AI coding agents (in Cursor, Claude, Codex, etc.) use these files to
maintain context across sessions, follow project rules, and execute work
plans.

## Do I need to read any of this?

Almost certainly not. If you are a human developer:

- **Start with the [README](../README.md)** at the repository root
- **Follow the [Quick Start](../docs/foundation/quick-start.md)** for
  setup and development workflows
- **Read [CONTRIBUTING.md](../CONTRIBUTING.md)** for contribution
  guidelines and code standards
- **Browse the [docs/](../docs/)** directory for architecture,
  engineering, and operations documentation

## What if I'm curious?

If you want to understand how the practice works:

- [ADR-119](../docs/architecture/architectural-decisions/119-agentic-engineering-practice.md)
  explains the design and rationale
- [.agent/README.md](README.md) has the directory layout

## Can I safely ignore this directory?

Yes. The quality gates (`pnpm qg`, `pnpm test`, `pnpm type-check`) are
what enforce code quality. The `.agent/` directory helps AI agents follow
the same standards that human developers follow, but the gates themselves
are the enforcement mechanism — not these files.
