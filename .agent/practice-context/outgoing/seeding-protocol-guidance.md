# Practice Seeding Protocol: Source-Side Guidance

> **Origin**: oak-mcp-ecosystem, 2026-03-19
> **Source evidence**: pine-scripts integration
> **Status**: Reference for oak as a seeding source

## Purpose

Guidance for using oak as a source substrate when seeding the Practice into a
new repo. The Practice Core files define *what* travels; this document
addresses *how* to transfer it well.

## The Canonical Seeding Bundle

A seeding transfer is not a pile of markdown. The bundle, in priority order:

1. **Practice Core** (the six files) — always
2. **Operational directives, rules, commands, prompts** — the working layer
3. **Sub-agent templates and thin platform adapters** — the review system
4. **Outgoing support pack** (this directory) — context for the receiver
5. **Distilled memory and code patterns** — prevents predictable mistakes

Items 4–5 are optional amplifiers that become important once the receiving repo
is mature enough to benefit from them.

## Activation Checks

The strongest lesson from pine-scripts: a seeded Practice can be structurally
complete but operationally inert. After transferring files, verify:

- [ ] Metacognition directive has genuine depth (not a stub or placeholder)
- [ ] Operational directives carry intent and reasoning, not just mechanics
- [ ] Platform adapters are genuinely thin (no duplicated content from
  canonical sources)
- [ ] The receiving repo treats Practice files as infrastructure (engineering
  discipline applies)

These checks are now also encoded in `practice-bootstrap.md` item 13.

## Canonical-First During Transfer

The canonical-first model is correct but not self-enforcing during seeding:

- Receivers can edit adapters directly without touching canonical sources
- Wrappers drift if there is no parity check
- Missing platform parity can survive unnoticed

Transfer guidance should include explicit parity checks and thin-adapter
validation. Eventually, generation support may reduce this risk further.

## The Bidirectional Model

Oak is not just a source — it is a source substrate inside a feedback loop.
Incoming notes from seeded repos are not ad-hoc commentary; they are field
evidence about portability, activation, and maturity. The incoming → review →
integrate cycle is how the Practice evolves across the ecosystem.

## When to Consult This Document

- Before seeding the Practice into a new repo
- When reviewing whether a seeded Practice has genuinely activated
- When assessing oak's readiness as a seeding source for a new transfer
