---
title: "The Practice: A Self-Teaching System for Engineering Excellence"
thesis: "An agentic engineering practice is not a style guide — it is a living system that teaches itself through use, evolves within repos, and propagates between them."
status: stub
tags: [practice, agentic-engineering, knowledge-management]
---

# The Practice: A Self-Teaching System for Engineering Excellence

## Core Argument

Most engineering teams have style guides, linting rules, and onboarding docs.
These are static artefacts that drift from reality the moment they are written.
The Practice is different: it is a self-reinforcing system of principles,
structures, specialist reviewers, and tooling that *teaches itself through use*.

The key insight is that the Practice is not a document — it is a **mechanism**.
When an agent follows the Practice, the Practice improves. When a reviewer flags
a violation, the rule that was violated becomes more precise. When a pattern
emerges from real work, it gets extracted into the Practice's memory. The system
has a metabolism.

## Within-Repo Evolution

- **Three-layer rule system**: Foundation directives define principles.
  Individual rules make them concrete. Platform adapters wire them into the tools
  engineers actually use (Claude, Cursor, Codex). Changes propagate downward
  automatically.
- **Specialist reviewers**: Not just linting — domain-aware agents that
  understand architectural boundaries, MCP protocol compliance, type safety
  invariants, and test quality. They catch violations that no static tool can.
- **Memory and experience**: The Practice remembers what worked, what didn't, and
  why. Feedback loops are explicit: corrections AND confirmations are recorded.
  The system learns from success, not just failure.

## Between-Repo Propagation

The Practice is portable. `practice-core/` contains the universal kernel — the
principles, structures, and meta-rules that apply to any TypeScript monorepo.
When a new repo is created, it receives the Practice via the "plasmid exchange"
mechanism: a copy of practice-core lands in an incoming box, gets reviewed
against the new repo's specific context, and integrates what applies.

This is not copy-paste. It is selective horizontal gene transfer. Each repo
adapts the Practice to its own domain while contributing refinements back to the
shared kernel.

## Evidence

- Oak MCP Ecosystem: 17 specialist agents, 3-layer rule system, portability
  validation (`pnpm portability:check`), practice fitness functions
- Cross-repo propagation via `practice-core/incoming/` and `practice-lineage.md`
- Real-world example: the "never disable checks" rule emerged from a specific
  incident, was codified as a canonical rule, adapted to 3 platforms, and now
  prevents the same class of mistake across all future work

## Open Questions

- How does the Practice handle genuinely novel domains where existing rules don't
  apply?
- What is the right granularity for practice-core? Too much and it becomes
  prescriptive; too little and each repo reinvents.
- Can the plasmid exchange mechanism work across organisations, not just repos?
