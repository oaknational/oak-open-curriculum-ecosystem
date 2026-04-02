# Blog Stubs

Seed ideas for blog posts, talks, or articles that emerge from working in this
repository. Each stub captures the core thesis and enough supporting evidence to
write a full piece later.

Blog stubs are **not** documentation. They are outward-facing narrative
frameworks — they explain *why something matters* to an audience that does not
work in this codebase, rather than *how to do it* for someone who does.

Before creating or expanding a stub, read
[`editorial-voice.md`](editorial-voice.md). It defines the voice, register, and
argument shape for public-facing technical writing in this directory.

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

## Current Stubs and Guidance

- `editorial-voice.md` — voice, register, and editorial principles for public
  technical articles from this repo
- `check-driven-development.md` — TDD beyond test files using quality gates as RED signals
- `continuity-is-an-engineering-property.md` — continuity as recoverable
  orientation across interruptions, handoffs, and session boundaries
- `from-surprise-to-doctrine.md` — surprise as the key learning signal in
  agentic practice and the route by which experience becomes doctrine
- `the-practice-as-living-system.md` — Agentic engineering as a self-teaching system
- `the-repo-that-remembers.md` — the repository as shared working memory for humans and agents
- `mcp-vs-cli--not-a-thing.md` — Why "MCP vs CLI" is a category error and what to compare instead
