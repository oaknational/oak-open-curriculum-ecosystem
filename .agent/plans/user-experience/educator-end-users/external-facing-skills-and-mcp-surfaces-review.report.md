---
title: "External-facing skills, plugins, and MCP skill-like surfaces — review and synthesis seed"
collection: user-experience
audience: educator-end-users
type: report
status: synthesis-seed
last_updated: 2026-06-08
---

# External-facing skills, plugins, and MCP skill-like surfaces — review

> **Synthesis seed.** This is the review/reflection that prompted gathering the
> prior external-facing skills materials into
> [`previous-materials/`](previous-materials/README.md). It is the input to a
> fresh educator-experience synthesis, not itself an executable plan. Grounded
> first-hand (skill files, EEF c4/c5 code, the discovery docs, and current
> official Anthropic/OpenAI documentation).

## Context

Oak's external-facing "skill" capabilities exist in two repos and three shapes:

- **`oaknational/oak-skills`** (separate repo) — 7 Agent Skills + a Claude
  plugin (`oak-curriculum-toolkit`), emitted to many channels from one
  `SKILL.md` source.
- **This repo's MCP server** — skill-*like* surfaces: MCP **prompts** and
  **resources**, including **EEF D6 c5** (`adapt-lesson` prompt) and **c4**
  (`eef://interpretation` resource), plus the prior `education-skills-mcp-surface`
  design.
- The **discovery / taxonomy / distribution** strategy docs that govern how
  these are named, packaged, and published.

The through-line, confirmed against current vendor docs, is **plugins as the
bundling layer**: an installable bundle of *skills + MCP servers/apps* that both
Anthropic (Claude plugins) and OpenAI (Codex plugins) now ship.

## Part 1 — oak-skills (review)

A spec-compliant **"one source, many channels"** library. Seven skills
(`oak-accessibility`, `oak-brand`, `oak-tone-of-voice`,
`oak-curriculum-principles` + an MCP-grounded variant, `oak-lesson-builder`,
`oak-curriculum-mapper`); one `SKILL.md` source each → per-skill zips, the
Claude plugin, ChatGPT Custom GPT, Gemini extension/Gem, and a
`.well-known/agent-skills/index.json` discovery index, with CI failing on drift.
**Verdict: structurally excellent** — it already embodies the
"capability-first, packaging-second" model the distribution report recommends.
**One seam:** it emits every packaging target *except* MCP prompts/resources;
the EEF c4/c5 MCP surfaces are authored separately, in this repo, by hand.

## Part 2 — Plugin-bundle convergence (verified against official docs, 2026-06-08)

| | **Claude (Anthropic)** | **OpenAI (Codex)** |
|---|---|---|
| **Skill format** | `SKILL.md` (Agent Skills open standard; cross-vendor) | Same `SKILL.md` standard (Codex CLI reads it) |
| **Plugin = bundle of** | skills + slash-commands + subagents + hooks + **MCP servers** (`.claude-plugin/plugin.json`) | skills (`skills/`) + app connectors (`.app.json`) + **MCP servers** (`.mcp.json`) + hooks |
| **Distribution** | **marketplace** (`marketplace.json`); `/plugin-dev:create-plugin` toolkit | **Git-backed marketplaces** + Plugin Directory (self-serve "coming soon"); install via Codex App / CLI `/plugins` / IDE |
| **Runtime layer** | **MCP** | **MCP** |
| **Launched** | Established | Codex Plugin Marketplace, **26 Mar 2026** |

**Net:** both vendors converged on the *same* shape — a **plugin = installable
bundle of {skills + MCP}** distributed via a **marketplace**, with **MCP as the
runtime layer** and **`SKILL.md` as the portable skill format** (also read by
Gemini CLI, Copilot, Cursor). The "OpenAI/ChatGPT equivalent" of a Claude plugin
is the **Codex plugin** — *not* custom GPTs or the older ChatGPT apps.

> Scoping note (owner-directed): custom GPTs and the older "apps in ChatGPT" are
> out of focus. The relevant comparison is the plugin/bundle layer.

## Part 3 — Relevance to EEF D6 c5/c4

The EEF surfaces map one-to-one onto skill anatomy:

| Skill anatomy | EEF D6 MCP equivalent |
|---|---|
| `SKILL.md` workflow spine | **c5 `adapt-lesson` prompt** (search Oak → surface signals → choose evidence → present options) |
| `references/` interpretive guidance | **c4 `eef://interpretation` resource** (methodology, caveats, strand index, faithful/unfaithful worked examples) |
| Skill body → its references | The c5 prompt instructs: *"Read `eef://interpretation` when applying the evidence"* — it orchestrates the resource as a skill body points to references |

So **c4 + c5 are a curriculum-assistance capability built in MCP packaging** —
the discovery plan's candidate `oak-lesson-adaptation` + `oak-evidence-framing`,
authored server-side. Both worlds independently land on the **same
teacher-agency invariant** (skills: *"a model, not a mandate… leave the teacher
in charge"*; c5/c4: *"options and trade-offs, never recommendations or
selections — the teacher decides"*, ADR-191) — re-derived in three places (skill
body, prompt message, resource guidance): a latent shared-invariant seam.

**Gap:** oak-skills' MCP-grounded skills enumerate Oak tools but none mention
`get-eef-evidence`, `eef://interpretation`, or `adapt-lesson`; EEF ships
flag-gated OFF. At release, a new server capability appears that the client
skills don't route to, and reciprocal announcement is unmet.

## Part 4 — Emerging synthesis thesis (for the next step, with owner)

Oak holds the two halves a plugin bundles — **skills** (oak-skills) + an **MCP
app** (this repo's server, incl. EEF c4/c5). The natural direction is an **Oak
plugin/bundle** shipping both, emitted from one capability source-of-truth to
**both** the Claude marketplace **and** the Codex marketplace ("capability-first,
packaging-second"). oak-skills already does the Claude-plugin half; the gaps are
(a) MCP-app bundling and (b) a Codex-plugin emit. Distribution constraint to
weigh: cross-vendor reach favours the plugin layer, and MCP is the common
runtime — so one MCP server + one skills source can reach Claude and Codex.

## Part 5 — Metacognition

The surface ask ("review a repo") sat over the real question: Oak is growing the
*same* curriculum-assistance capability in two packagings, two repos, with no
shared source of truth and no reciprocal announcement — the duplication/drift the
discovery doctrine exists to prevent. Retrospective: earlier I manufactured a PII
tension by reading an org instruction *by analogy* against an owner-settled
decision; the lesson (now reinforced by the new `precedence-is-not-approval`
doctrine) is to surface an interpretation, not treat my reading of a directive as
forced.

## How this was grounded

oak-skills `SKILL.md` files; EEF `mcp-prompts.ts` / `mcp-prompt-messages.ts` /
`eef-interpretation-resource.ts` / `register-prompts.ts`; the discovery /
taxonomy / distribution docs (now in `previous-materials/`); and current official
docs — Anthropic Agent Skills + Claude Code skills/plugins, OpenAI Apps SDK +
**Codex plugins** — read first-hand.
