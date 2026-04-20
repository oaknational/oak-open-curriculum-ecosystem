# AGENTS.md, Agent Skills, and plugins: ecosystem direction of travel

> Slice B reconnaissance note for the practice-methodology ecosystem. Sister
> note to [`governance-plane-direction-of-travel.md`](../governance-planes-and-supervision/governance-plane-direction-of-travel.md).
> Lives in `operating-model-and-platforms/` rather than a new lane because
> the material is the cross-platform surface story this lane already owns
> (see [`platform-adapter-formats.md`](../../../reference/platform-adapter-formats.md),
> [`cross-platform-agent-surface-matrix.md`](../../../reference/cross-platform-agent-surface-matrix.md),
> ADR-124, ADR-125).

## Why this note exists

The repo's three-layer artefact-portability model (canonical content in
`.agent/`, thin platform wrappers in `.cursor/` / `.claude/` / `.gemini/`
/ `.agents/`, root entry points) was designed in early 2026 against a
fragmented external surface. The external surface has since consolidated
**fast** around three primitives: **AGENTS.md**, **Agent Skills**, and
**plugin marketplaces**. This note reads where each is going, where it
already touches the repo's three-layer model, and where the convergence
opens or closes specific design choices.

Scope is **direction-of-travel reconnaissance**, not a comparison matrix
and not a doctrine recommendation. Followups for either are flagged at
the end. External-concept descriptions, repo-local mechanism references,
and inferences are kept distinct in every paragraph.

## Method and evidence ladder

This note prefers **specifications, foundation announcements, and
official docs** as primary evidence; falls back to **release notes and
adopter-list snapshots** otherwise; explicitly flags **trajectory weak**
where neither is present. Each section follows a fixed shape: trajectory
paragraph → one to three cited primary-source bullets → a single
repo-local implication. Cross-cutting patterns and routing
recommendations follow at the end.

## A. AGENTS.md

### Trajectory

AGENTS.md's 2026 direction is **standard graduation**: the format moved
from an OpenAI-stewarded convention to **Linux Foundation stewardship
under the Agentic AI Foundation (AAIF)** in December 2025, alongside
co-founders Anthropic and Block and supporters Google, Microsoft, AWS,
Bloomberg, and Cloudflare. Adopter count crossed **60,000 open-source
projects** by the AAIF launch. The format itself stayed deliberately
minimal — no required fields, no schema beyond conventions — and
explicitly **resolves nearest-file-wins for nested AGENTS.md** in
monorepos. [^aaif-launch] [^openai-aaif] [^agents-md-faq]

- The OpenAI launch announcement records that "AGENTS.md has been
  adopted by more than 60,000 open-source projects and agent frameworks
  including Amp, Codex, Cursor, Devin, Factory, Gemini CLI, Github
  Copilot, Jules and VS Code among others — reflecting growing alignment
  around shared, vendor-neutral conventions as agents enter
  production." [^openai-aaif]
- The AAIF launch press release lists AGENTS.md as one of three anchor
  projects (alongside MCP and goose) in the foundation's initial
  charter. [^aaif-launch]
- The official `agents.md` FAQ is explicit that the closest AGENTS.md to
  the edited file wins, that explicit user chat prompts override
  everything, and that the format is "just standard Markdown" with no
  required fields. [^agents-md-faq]

**Repo-local implication.** The repo already has AGENTS.md as a Layer-3
entry point (per ADR-125). The direction signal is convergent — no
adoption work to do — but the **nested-AGENTS.md, nearest-file-wins
contract** is now an external standard the repo can lean on for
monorepo workspaces (currently each app workspace inherits the root
AGENTS.md). Worth reviewing whether per-workspace AGENTS.md files would
help discoverability without violating the canonical-content-in-`.agent/`
rule. **Routing recommendation only**; no doctrine change in this
session.

## B. Agent Skills (the open standard)

### Trajectory

Agent Skills is the **fastest-converging primitive in the ecosystem**.
The standard was **originally developed by Anthropic, released as an
open standard, and now lists 30+ adopting agent products** on the
canonical `agentskills.io` site — including Cursor, Codex, Copilot, VS
Code, Goose, Gemini CLI, OpenHands, OpenCode, Letta, Roo Code, Junie,
Spring AI, Laravel Boost, Kiro, and others. The published specification
is intentionally **narrow**: a single required `SKILL.md` file with two
required frontmatter fields (`name`, `description`), optional
`license` / `compatibility` / `metadata` / `allowed-tools`, and three
canonical optional directories (`scripts/`, `references/`, `assets/`).
Progressive disclosure (metadata at startup, body on activation,
referenced files on demand) is named in the spec. [^skills-spec]
[^skills-overview]

- The official Agent Skills specification fixes the validation rules:
  `name` 1–64 chars `a-z0-9-`, `description` 1–1024 chars, `compatibility`
  ≤500 chars, `allowed-tools` is a space-separated string and **explicitly
  marked Experimental**. The spec recommends `SKILL.md` ≤500 lines and
  body ≤5,000 tokens. [^skills-spec]
- The `agentskills.io` overview page records the project's open-development
  status: "developed by Anthropic, released as an open standard, and has
  been adopted by a growing number of agent products"; community lives in
  `github.com/agentskills/agentskills` and a Discord channel; reference
  validator is `skills-ref`. [^skills-overview]
- Anthropic's own Claude Code skills documentation states that **custom
  commands have been merged into skills** — `.claude/commands/deploy.md`
  and `.claude/skills/deploy/SKILL.md` "both create `/deploy` and work the
  same way." Existing commands keep working; skills add directories,
  invocation control, and load-on-demand semantics. [^claude-skills]

### Direction signal: implementation extensions outside the spec

Each adopter is **extending Agent Skills with implementation-specific
features that are not in the open spec**. The pattern is uniform: the
core spec (frontmatter + body + optional dirs) stays narrow; adopters
add capability fields above it.

- **Claude Code** adds `disable-model-invocation`, `user-invocable`,
  `paths` (glob-scoped activation), `model`, `effort`, `context: fork`,
  `agent`, `hooks`, `argument-hint`, `shell`, `when_to_use`, plus shell
  pre-execution (`` !` ``) and `${CLAUDE_*}` substitutions. Skills
  participate in **auto-compaction with a 25,000-token re-attach budget
  prioritising most recent invocation**. [^claude-skills]
- **Cursor** adds `disable-model-invocation` and reads skills from any of
  `.agents/skills/`, `.cursor/skills/`, `.claude/skills/`, `.codex/skills/`
  (plus `~/...` user-level variants). Cursor 2.4 ships a built-in
  `/migrate-to-skills` skill that converts dynamic rules and slash
  commands to skills. [^cursor-skills]

**Repo-local implication.** This is the single highest-impact external
direction signal for the repo's three-layer model. The repo's
`.agent/skills/<id>/SKILL.md` canonical layout is **already
spec-compliant** with Agent Skills (frontmatter + body + optional
folders). The two practical questions the convergence opens are: (1)
whether `.agent/skills/` deserves a top-level `metadata` block declaring
`compatibility` for each canonical skill (so they could be shared
upstream); (2) whether the cross-platform-implementation extensions
(`paths`, `context: fork`, `disable-model-invocation`, `allowed-tools`)
should be **first-class fields on canonical skills** rather than
expressed only via thin platform wrappers — pushing more capability into
Layer 1. Both are **routing recommendations only**.

## C. Plugin marketplaces

### Trajectory

Both Cursor and Claude Code have shipped **first-class plugin
marketplace systems** that bundle multiple Agent Skills artefact types
into versioned, distributable packages. The two implementations are
**structurally near-identical** at the package surface; they diverge on
distribution model.

- **Claude Code plugins** (`.claude-plugin/plugin.json`) bundle skills,
  agents, hooks (`hooks/hooks.json`), MCP server configs (`.mcp.json`),
  LSP server configs (`.lsp.json`), background monitors
  (`monitors/monitors.json`), executables (`bin/` added to `PATH` while
  enabled), and `settings.json` defaults (currently `agent` and
  `subagentStatusLine` keys only). Plugin skills are **always namespaced**:
  `/plugin-name:skill-name`. Distribution is via team-managed marketplaces
  or the official Anthropic submission. [^claude-plugins]
- **Cursor plugins** (`.cursor-plugin/plugin.json`) bundle rules, skills,
  agents, commands, MCP servers, and hooks. Distribution is via the
  official **Cursor Marketplace** (every plugin manually reviewed; all
  must be open-source) plus a community directory at `cursor.directory`.
  **Team marketplaces** are an Enterprise feature with **SCIM-controlled
  distribution groups** and **required vs optional plugins** per group.
  Local-test path is `~/.cursor/plugins/local/`. [^cursor-plugins]

### Direction signal: plugins as the unit of practice exchange

Both adopters frame plugins as the unit of **shareable, versioned
practice** — the contrast Claude's docs draw is explicit: "Use
standalone configuration when you're customizing for a single project…
Use plugins when you want to share functionality with your team or
community… need version control… distribute through a marketplace." The
side-by-side layout (manifest + bundled artefacts at plugin root) is the
same on both platforms. Cursor's required-vs-optional team-marketplace
model is the most policy-rich variant in the wild. [^claude-plugins]
[^cursor-plugins]

**Repo-local implication.** The repo's Practice five-file package
(ADR-124) is **conceptually a plugin**: a versioned bundle of
canonical artefacts (commands, skills, rules, sub-agent templates,
plus an entry-point chain) designed to propagate between repos. The
direction signal here matters: the ecosystem is converging on plugin
manifests + marketplaces as the **primary distribution surface** for
artefact bundles. Two open questions for the repo: (1) whether the
Practice should ship with a `.claude-plugin/plugin.json` and a
`.cursor-plugin/plugin.json` so it can also propagate via plugin
install, not only via the bootstrap script; (2) whether the
`.agent/practice-core/` package format should formally adopt the
**namespacing convention** (`practice:command-name`) the plugin
ecosystems use. **Routing recommendations only**.

## D. Cross-tool path normalisation

### Trajectory

Cursor's skills documentation explicitly records that it loads skills
from **`.agents/`, `.cursor/`, `.claude/`, and `.codex/`** directories
interchangeably (project- and user-level). This is direct evidence that
**the path-naming question is being treated as solved at the consumer
side**: tools tolerate any of the four paths. The remaining naming
divergence (singular `.agent/` vs plural `.agents/`) appears stable; no
adopter is forcing one over the other. [^cursor-skills]

- Cursor's docs: "For compatibility, Cursor also loads skills from Claude
  and Codex directories: `.claude/skills/`, `.codex/skills/`,
  `~/.claude/skills/`, and `~/.codex/skills/`." [^cursor-skills]

**Repo-local implication.** The repo's choice (singular `.agent/` for
canonical content, plural `.agents/` only for the Codex adapter) is
**convergent with the ecosystem direction**: tools have absorbed the
divergence rather than forced a winner. ADR-125's note that "Codex uses
`.agents/skills/` (plural) for discovery, while our canonical path is
`.agent/skills/` (singular)" remains correct and the trade-off is no
worse than it was. **No action recommended.**

## E. AAIF as the new neutral steward

### Trajectory

The **Agentic AI Foundation** is now the neutral home for the three
anchor projects this slice covers (AGENTS.md), references heavily
(MCP), or treats as adjacent (goose). AAIF is a **directed fund under
the Linux Foundation**, founding platinum members include AWS,
Anthropic, Block, Bloomberg, Cloudflare, Google, Microsoft, OpenAI. The
foundation is running MCP Dev Summits (NA April 2026; Europe September
2026) and publishes maintainer roundtables and project deep dives.
[^aaif-launch] [^aaif-home]

- The AAIF site lists "Model Context Protocol", "goose", and "AGENTS.md"
  as the three named projects under the foundation; the project-proposal
  process is open via `github.com/aaif/project-proposals`. [^aaif-home]
- The AAIF blog records MCP-NA 2026 maintainer roundtable themes:
  "Control, Security, And Quality" — directly resonant with the safety,
  governance, and quality-gate concerns this repo's reviewer-systems and
  governance lanes already track. [^aaif-roundtable]

**Repo-local implication.** Two of the three projects this repo most
heavily depends on (MCP, AGENTS.md) are now **co-stewarded under a
single neutral foundation**, with quarterly summits surfacing
maintainer-direction signals. Worth tracking the AAIF blog and event
recordings as a **higher-signal source for direction-of-travel reads**
than individual project release notes. **Watchlist candidate.**

## Cross-cutting trajectory patterns

Three patterns hold across A–E with strong-enough evidence to be worth
naming:

1. **The skills-as-unit-of-capability convergence is real and fast.** Cursor
   merged its dynamic-rules-and-commands surface into skills; Claude Code
   merged custom commands into skills; both expose `/skill-name` as the
   universal invocation syntax. The Agent Skills spec is narrow enough
   that 30+ products co-exist on it. Implementation-specific extensions
   (`paths`, `context: fork`, `disable-model-invocation`, `hooks`) are
   spreading the **same set of ideas** across multiple adopters in
   parallel, not diverging. [^skills-spec] [^claude-skills]
   [^cursor-skills]

2. **Plugin marketplaces are the new distribution layer for artefact
   bundles.** Both Claude Code and Cursor independently arrived at:
   manifest at root, namespaced skills, bundle of (skills + agents +
   commands + hooks + MCP servers + LSP / monitors / settings),
   marketplace with manual review, team-controlled subset. The five-file
   Practice package this repo ships sits in a category one of these
   marketplace formats could carry. [^claude-plugins] [^cursor-plugins]

3. **Governance is moving to a single neutral steward.** Three primitives
   (AGENTS.md, MCP, goose) all sit under AAIF as of late 2025 / early
   2026. Co-stewardship by Anthropic + OpenAI + Block + Linux Foundation
   means **direction-of-travel signals for these three primitives can
   now be read off one foundation's calendar and roadmap stream** rather
   than six independent project release tracks. [^aaif-launch]
   [^aaif-home]

## Repo-local implications and routing

These are recommendations for follow-up routing **only**; no doctrine
edits are made in this session.

- **ADR-125's three-layer model is in good shape against the
  convergence.** The canonical-`.agent/` plus thin-wrappers-per-platform
  shape is broadly aligned with where Agent Skills is going. The
  open-question delta is whether the implementation-specific extensions
  (`paths`, `context: fork`, `disable-model-invocation`, `allowed-tools`,
  `hooks`) should be first-class on canonical Layer 1 skills, or stay in
  Layer 2 wrappers. Worth a Slice C reviewer-systems entry and a
  follow-up ADR amendment if the answer is "promote to Layer 1".

- **ADR-124's Practice propagation model has a plausible plugin route.**
  The five-file Practice package is conceptually a plugin. Worth a
  spike (separate plan) to test whether shipping Practice as a
  `.claude-plugin/plugin.json` + `.cursor-plugin/plugin.json` overlay
  improves propagation reliability or just adds duplication.

- **AAIF and `agentskills.io` belong on the watchlist.** The MCP-Dev-Summit
  recordings and the agentskills.io spec changelog are higher-signal
  direction-of-travel sources than individual project release notes for
  the three primitives in scope.

- **No new lane needed.** This material fits cleanly inside
  `operating-model-and-platforms/`. The original Slice B plan suggested
  a `practice-methodology-ecosystem/` lane; reconnaissance showed the
  evidence does not justify a stable new lane (per the assumptions
  reviewer's "no new lane until evidence proves it stable, non-overlapping,
  and beneficial for discovery" fence).

- **Slice B's `.agent/` adoption survey is unanswered.** This note did not
  measure how widespread the `.agent/` (singular) canonical-content
  convention is **outside** the four-platform tooling consumer side. The
  Cursor docs prove tools tolerate it; they don't prove other repos use
  it. A follow-on note (or a Slice C entry) could survey public repos for
  `.agent/` adoption against the alternative shapes (per-tool only,
  flat top-level files, AGENTS.md-only). Out of scope for this session.

Promotion of any of the above into doctrine (ADRs, Practice Core, deep
dives) is **out of scope for this session** and is recorded here as a
routing recommendation only.

[^aaif-launch]: Agentic AI Foundation, "The Linux Foundation Announces the Formation of the Agentic AI Foundation (AAIF), Anchored by New Project Contributions Including Model Context Protocol (MCP), Goose, and AGENTS.md", launch press release, <https://aaif.io/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation-aaif-anchored-by-new-project-contributions-including-model-context-protocol-mcp-goose-and-agents-md> (fetched 2026-04-20).
[^openai-aaif]: OpenAI, "OpenAI co-founds the Agentic AI Foundation under the Linux Foundation" (2025-12-09), <https://openai.com/index/agentic-ai-foundation/>.
[^agents-md-faq]: AGENTS.md project, FAQ section ("How do I use AGENTS.md?", "What if instructions conflict?", "Are there required fields?"), <https://agents.md/> (fetched 2026-04-20).
[^skills-spec]: Agent Skills specification, "The complete format specification for Agent Skills", <https://agentskills.io/specification> (fetched 2026-04-20).
[^skills-overview]: Agent Skills overview, "A simple, open format for giving agents new capabilities and expertise", <https://agentskills.io/> (fetched 2026-04-20; lists 30+ adopting products).
[^claude-skills]: Anthropic, "Extend Claude with skills" (Claude Code documentation), <https://docs.claude.com/en/docs/claude-code/skills> (fetched 2026-04-20).
[^cursor-skills]: Cursor, "Agent Skills" documentation, <https://cursor.com/docs/context/skills> (fetched 2026-04-20).
[^claude-plugins]: Anthropic, "Create plugins" (Claude Code documentation), <https://docs.claude.com/en/docs/claude-code/plugins> (fetched 2026-04-20).
[^cursor-plugins]: Cursor, "Plugins" documentation, <https://cursor.com/docs/plugins> (fetched 2026-04-20).
[^aaif-home]: Agentic AI Foundation home page (lists MCP, goose, AGENTS.md as anchor projects; founding platinum members; project-proposal process), <https://aaif.io/> (fetched 2026-04-20).
[^aaif-roundtable]: Agentic AI Foundation, "MCP Maintainer Roundtable: Control, Security, And Quality" (2026-04-14 blog post), <https://aaif.io/blog/mcp-maintainer-roundtable-control-security-and-quality/>.
