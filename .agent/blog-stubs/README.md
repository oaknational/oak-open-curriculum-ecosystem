# Blog Stubs

Seed ideas for blog posts, talks, or articles that emerge from working in this
repository. Each stub captures the core thesis and enough supporting evidence to
write a full piece later.

Blog stubs are **not** documentation. They are outward-facing narrative
frameworks — they explain *why something matters* to an audience that does not
work in this codebase, rather than *how to do it* for someone who does.

## Format

Each stub is a standalone markdown file with YAML frontmatter:

```yaml
---
title: "The title of the piece"
thesis: "One-sentence core argument"
status: stub | draft | published
tags: [practice, tdd, architecture]
---
```

## When to Create a Stub

When work in this repo produces an insight that:

1. Would be valuable to engineers outside this project
2. Challenges a common assumption or names a pattern that lacks a name
3. Has been validated by real implementation, not just theory

## Current Stubs

- `check-driven-development.md` — TDD beyond test files using quality gates as RED signals
- `the-practice-as-living-system.md` — Agentic engineering as a self-teaching system
- `mcp-vs-cli--not-a-thing.md` — Why "MCP vs CLI" is a category error and what to compare instead
