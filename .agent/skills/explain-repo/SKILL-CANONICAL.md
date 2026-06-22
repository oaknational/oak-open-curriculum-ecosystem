---
name: explain-repo
classification: active
description: >-
  Executive briefing on this repository — a direct, synthesised overview for
  anyone who asks "explain this repo to me", "tell me about this repo", "what
  is this", "give me an overview", or "what's the executive summary". The
  non-interactive counterpart to onboard-me: no setup, no go-ahead gating, no
  conversation tree — just a crisp, structured explanation read live from the
  canonical docs (VISION, README, the headline architectural invariants, the
  newest progress report, and the live roadmap) and synthesised into a
  briefing. Hands off to onboard-me when the reader wants a guided walk or
  machine setup.
---

# Explain Repo

You are giving an **executive briefing** on this repository: a direct,
synthesised answer to "what is this and why does it matter", not an
interactive walk. Produce a structured explanation in one pass, then offer
depth. These rules are structural, not tone advice; they override everything
below them:

1. **Answer directly — do not interrogate.** No journey questions, no
   forced-choice menus, no setup probes, no go-ahead gating. The reader asked
   to be told about the repo; tell them. A single optional steer at the end is
   enough.
2. **Read the live docs at answer time and synthesise.** Everything you state
   is read from the canonical sources below *now*, not recalled from this
   file. The live docs outrank anything remembered here; if this file and a
   live doc disagree, the doc wins. Never invent sections, statistics, or
   claims a source does not carry.
3. **Executive altitude, plain language.** Lead with impact and shape, not
   internal vocabulary. Introduce a load-bearing term (Practice, MCP, SDK,
   gates) with a one-line plain gloss the first time it earns its place. Keep
   it briefing-length — synthesise, never dump whole documents.
4. **Honest about state.** Distinguish what exists from what is planned.
   Resolve the newest progress report live; never present a remembered
   filename as the latest.

## Router Principle

This skill carries the briefing shape and the manners — nothing else. Every
fact is read from the live documents below at answer time. The live docs
outrank anything remembered from this file.

| Source document | What it contributes to the briefing |
| --- | --- |
| `README.md` | What the repo is, the audience-routing block, package topology |
| `VISION.md` (repo root) | Why it matters — the change being made and for whom |
| `.agent/skills/onboard-me/SKILL-CANONICAL.md` §Headline Invariants | The six ADR-backed invariants that make the repo distinctive (each routes to its own doc, which wins) |
| `.agent/reports/README.md` | Resolve the newest `oak-ecosystem-progress-*` report here for current state |
| `.agent/plans/high-level-plan.md` | The live delivery roadmap — where it is going |
| `docs/foundation/agentic-engineering-system.md` | The Practice, when the reader wants the how-we-work dimension |

## The Briefing

Deliver in one message, in this order, each section a few sentences
synthesised from its source — not a transcript of the document:

1. **What it is** — one paragraph from `README.md` and `VISION.md`: the Oak
   Open Curriculum ecosystem in plain terms.
2. **Why it matters** — the impact, from `VISION.md`.
3. **What is distinctive** — the Headline Invariants, condensed to the few
   that land hardest for this reader; name the rest in a line.
4. **Where it is now** — the newest progress report, resolved live.
5. **Where it is going** — the high-level plan.

Then one closing line offering the depth paths: strategy and vision in depth
(route into `VISION.md` and the progress report), or a guided, hands-on walk
and setup (hand off to the `onboard-me` skill).

## Handoff to onboard-me

This skill explains; it does not set up. The moment the reader wants to *do*
something — clone, install, configure, contribute, or be walked through step
by step — hand off to `onboard-me`, the interactive, state-detecting,
go-ahead-gated counterpart. Name it plainly: there is a guided walkthrough
that can also check their machine and set them up.

## Failure Handling

If a source document is missing or unreadable, report the exact path, continue
the briefing from the remaining sources, and note the gap. Never substitute
remembered content for an unreadable document.

## Platform Adapters

Generated thin pointers (do not hand-edit; regenerate via the skills adapter
generator and verify with `pnpm skills:check`):

- `.claude/skills/oak-explain-repo/SKILL.md` — Claude Code adapter
- `.agents/skills/oak-explain-repo/SKILL.md` — cross-tool adapter
