---
prompt_id: onboarding-claude-teammate
title: "Onboarding: Claude Code Teammate"
type: handover
status: active
last_updated: 2026-05-10
---

# Onboarding: Claude Code Teammate

Session-entry prompt for an Oak teammate joining the Open Curriculum
ecosystem repository whose primary AI coding tool is Claude Code. Run this
prompt with the new teammate alongside, in their freshly-cloned working copy.

## What this prompt is

A guided, interactive walkthrough that gets a new Claude Code teammate from
"clean clone" to "first useful session" by checking what is already in place,
filling the gaps one at a time, and routing them to the durable docs that
will keep working after the walkthrough ends.

This is **not** a substitute for reading the durable docs. It is a routing
and verification layer. The durable content lives in:

- [Root README](../../README.md) — what the repo is, who it is for, Quick Start
- [CONTRIBUTING.md](../../CONTRIBUTING.md) — Oak-team contributor workflow
- [AGENT.md](../directives/AGENT.md) — operational entry point for AI agents
- [start-right-quick](../skills/start-right-quick/shared/start-right.md) —
  per-session grounding workflow used by both humans driving Claude and
  autonomous agents
- [Sibling Repositories](../../docs/engineering/sibling-repos.md) —
  related repos a teammate may need
- [MCP Servers for Contributors](../../docs/engineering/mcp-servers-for-contributors.md) —
  the sanctioned MCP server set
- [Good First Issues](../plans/good-first-issues.md) —
  what to pick as a first task
- [Practice Index](../practice-index.md) — local bridge into the Practice

## How to run the walkthrough

When the new teammate pastes or invokes this prompt:

1. Welcome them by name if known. Confirm the team: **Oak Open Curriculum**.
   In one sentence, name what the team uses Claude for in this repo (schema-
   first SDK and MCP work, semantic search, agentic engineering Practice).

2. Check working environment against the **Setup Checklist** below using
   markdown checkboxes. Lead with what is already in place.

3. Offer to help with each unchecked item, one at a time, in order. Wait for
   their go-ahead before moving on.

4. After setup, route them to the **Get Started** section to choose a first
   task.

5. End by reminding them that future sessions begin with `/start-right-quick`
   (or the platform-equivalent grounding skill).

## Setup Checklist

### Local toolchain

- [ ] Node.js 24.x (`nvm use` or `fnm use` against `.nvmrc`)
- [ ] pnpm via `corepack enable`
- [ ] `pnpm install` clean
- [ ] `pnpm test && pnpm type-check && pnpm lint` green
- [ ] [gitleaks](https://github.com/gitleaks/gitleaks/releases) installed (pre-push secret scan)
- [ ] Optional: `bun`, `lsof`, `sentry` per
  [README prerequisites](../../README.md#prerequisites)

### Repository orientation

- [ ] Read [README](../../README.md) §What This Repo Provides + §Architecture
- [ ] Read [CONTRIBUTING.md](../../CONTRIBUTING.md) §Working with AI Coding Agents
- [ ] Skim the [5 ADRs in 15 Minutes](../../docs/architecture/architectural-decisions/README.md#start-here-5-adrs-in-15-minutes)
- [ ] Skim [HUMANS.md](../HUMANS.md) — what `.agent/` is and is not for humans

### Claude Code environment

- [ ] Sanctioned MCP servers enabled per
  [MCP Servers for Contributors](../../docs/engineering/mcp-servers-for-contributors.md)
- [ ] Aware that **the Vercel CLI is forbidden** — Vercel work goes through
  the project-scoped MCP plugin
- [ ] Skill set explored: `/start-right-quick`, `/commit`, `/finishing-branch`,
  `/gates`, `/review`, `/consolidate-docs`, `/session-handoff`. Canonical
  definitions live under
  [.agent/skills/](../skills/) with platform adapters under
  [.claude/skills/](../../.claude/skills/) (and equivalents for other agents)
- [ ] One trial session opened with `/start-right-quick` and closed with
  `/session-handoff`

### Sibling repositories (optional, only if relevant to your work)

- [ ] Cloned the relevant entries from
  [Sibling Repositories](../../docs/engineering/sibling-repos.md)

## Get Started

Choose a first task from [Good First Issues](../plans/good-first-issues.md).
That document lists the authoritative GitHub label for live tasks plus a
small set of stable area onramps.

If a starter task is contentious, ambiguous, or touches multiple workspaces,
run `/start-right-quick` first and then `/metacognition` to discuss intent
before committing to an approach.

## What this prompt is *not*

- Not a substitute for `/start-right-quick`. That skill grounds every session;
  this prompt grounds the *first* session.
- Not durable team policy. Anything that should outlive a single teammate's
  ramp-up belongs in the docs linked at the top, not here.
- Not a place for personal Claude usage statistics. Those are interesting at
  individual level but drift on contact with reality and would violate the
  [no-moving-targets-in-permanent-docs](../rules/no-moving-targets-in-permanent-docs.md)
  rule if embedded in tracked docs.

## Maintenance

Update this prompt when:

- A new sanctioned MCP server is added to the contributor set
- A widely-used Claude Code skill is added or renamed in
  [.agent/skills/](../skills/)
- The first-task surface (Good First Issues) moves
- The Quick Start sequence in the root README changes shape

Per ADR-117 §3, this prompt is a *session prompt*, distinct from the strategic
plan, executable plan, and roadmap document types.
