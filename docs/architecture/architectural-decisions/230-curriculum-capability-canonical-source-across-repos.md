# ADR-230: One Canonical Source for Curriculum-Assistance Skills, Sub-Agents, and Plugins Across Repositories

**Status**: Proposed. **Amended 2026-10-07 (pending ratification):**
[ADR-231](231-five-repository-topology-product-search-plugins-skills.md),
itself Proposed, would supersede Decision item 4 — the `{skills + MCP}`
plugin bundle's permanent home would be `oaknational/oak-ai-plugins`, a
public repository already created in response to a platform repo-size
constraint, not `oak-open-curriculum-mcp`. The rest of this record's
recommendation (canonical authoring source, generation replacing
hand-copying, sub-agents as a first-class generated type) is unaffected
either way; only its generator's target would change.
**Date**: 2026-09-22
**Related**: [ADR-125](125-agent-artefact-portability.md) (canonical-content-plus-adapter
model this decision extends across a repository boundary; §Skill classes already
names the "User-facing skills" class this ADR concerns, home today
`plugins/oak-open-curriculum/`); [ADR-129](129-domain-specialist-capability-pattern.md)
(sub-agent triplet pattern — its Doctrine Hierarchy and rollout checklist apply to
the curriculum-facing sub-agents this decision covers); [ADR-189](189-audience-led-agent-capability-taxonomy.md)
(audience taxonomy and the repo-internal / distributable / both distribution axis
this decision applies rather than re-invents); [ADR-227](227-oak-product-in-its-own-repository.md)
(the Oak MCP product's extraction to `oaknational/oak-open-curriculum-mcp` — the
concrete instance of "ownership moves to audience-facing squads" this decision's
problem statement names, and the reason a plugin-bundle home decided today may
need a dated amendment once that repository exists);
[PDR-051](../../../.agent/practice-core/decision-records/PDR-051-vendor-agnostic-skills-standardisation.md)
(vendor-agnostic skills standardisation — the doctrine this decision's generation
mechanism follows, scoped here to the curriculum-assistance capability class
rather than repo-working Practice skills).

## Context

Linear MCP-705 asks Oak to agree an approach for skills, agents, and plugins,
stated as: two repositories currently replicate MCP-related skills and plugins,
with divergences, and this is unsustainable as ownership of the layer above the
MCP protocol moves into audience-facing squads. This record grounds that
problem statement first-hand against both repositories as they exist today,
rather than against the ticket's own description of them, and finds the ticket
description materially wrong in two places (§Corrections to the ticket's
premise) before recommending a decision.

### The two repositories, as verified first-hand

**`oaknational/oak-skills`** (private; cloned read-only to a scratch location
for this review, not modified) holds eight teacher-facing Agent Skills
(`oak-accessibility`, `oak-brand`, `oak-curriculum-mapper`,
`oak-curriculum-principles`, `oak-curriculum-principles-mcp-enabled`,
`oak-lesson-builder`, `oak-quality-standards`, `oak-tone-of-voice`), a Claude
plugin (`plugins/oak-curriculum-toolkit/`) bundling nine slash-command
workflow skills, **four sub-agents**
(`coverage-checker.md`, `misconception-miner.md`, `sequencing-auditor.md`,
`standards-reviewer.md` — each a real Claude sub-agent definition with
`name`/`description`/`skills`/`model` frontmatter, not a stub), and the Oak
Curriculum MCP bundled via `.mcp.json`. It additionally builds and validates,
via its own `scripts/build_*.py` pipeline, four further native packagings from
the same eight skills: a Claude Code plugin, a ChatGPT Custom GPT plus a
Codex-format plugin (both filed under one `chatgpt/` directory — the folder
name predates and now conflates two distinct OpenAI mechanisms), a Gemini CLI
extension and a Gemini Gem, and a Microsoft 365 Copilot declarative agent
(`m365/`) — plus a public `.well-known/agent-skills/index.json` discovery
index of per-skill downloadable zips. Its README states the content is
**experimental** and has not been through Oak's editorial or
quality-assurance process; `oak-brand`'s licence is Oak's proprietary "all
rights reserved" brand licence, not MIT/OGL.

**`oak-open-curriculum-ecosystem`** (this repository) holds a Claude-only
plugin, `plugins/oak-open-curriculum/`, registered via
`.claude-plugin/marketplace.json`, containing **three** of the eight skills
(`oak-accessibility`, `oak-curriculum-principles`,
`oak-curriculum-principles-mcp-enabled`), **two** of the nine workflow skills
(`audit-sequence`, `find-misconceptions`), and **two** of the four sub-agents
(`misconception-miner.md`, `sequencing-auditor.md`). There is no `chatgpt/`,
`gemini/`, or `m365/` directory anywhere in this repository: the only
distribution this repo currently ships is the Claude plugin. ChatGPT, Gemini,
and Microsoft 365 Copilot reach Oak today solely through the deployed MCP
server itself (a different architectural layer, governed by ADR-141 and
ADR-217), not through a skills/plugin bundle.

### Corrections to the ticket's premise

1. **"No sub-agents" in the private repo is wrong.** `oak-skills` carries four
   sub-agents in `plugins/oak-curriculum-toolkit/agents/`, and this public
   repo already carries two of them. Sub-agents are not a private-repo-only,
   not-yet-replicated capability; they already show the same
   partial-replication-plus-drift pattern as the skills.
2. **"Plugin set up only for Claude and ChatGPT" (public repo) overstates the
   public side.** This repository's plugin covers Claude alone. What exists
   for the other three platforms today is MCP-protocol reachability, which is
   a materially weaker claim than a packaged skills/plugin bundle for those
   hosts.

### The divergence is real and already measured, not hypothetical

Diffing the two copies of the skills present in both repositories shows
genuine content drift, not merely a smaller subset. The public copy of
`oak-accessibility` and `oak-curriculum-principles` silently drops every
cross-reference to `oak-brand` and `oak-tone-of-voice` (companion skills that
are private-only, so the references would dangle) and independently rewords
supporting prose — different word choices, a different worked example, a
different level of detail on the same principle — plus a frontmatter quoting
style inconsistency (`'0.1.1'` vs `"0.1.1"`) consistent with the two copies
running through different formatters. None of this divergence is declared or
reviewed as a deliberate content rule; it is the residue of independent hand
edits after a one-time copy.

### A worked incident: the public plugin's origin was a hand-copy under deadline

The director-handoff record for 2026-07-28 (the Claude Directory submission
push, tickets MCP-292–306) states plainly: _"THE PLUGIN DOES NOT EXIST — no
`.claude-plugin`, no manifest, no workspace. Its submission is blocked on the
artefact, not paperwork. Source is the PRIVATE `oaknational/oak-skills`
(already carries `.claude-plugin/marketplace.json` naming
`oak-curriculum-toolkit`); copying a subset into THIS public monorepo is what
satisfies 'plugins must link a public GitHub repo'."_ `plugins/oak-open-curriculum/`
is that copy. It was created to meet a submission deadline, not generated from
a shared source, and it has not been reconciled with its origin since.

### An existing, owner-decided direction already exists for part of this question

A plan corpus dated 2026-06-08 — `external-facing-capability-distribution.plan.md`
and its siblings (`oak-skills-ingest-and-resurfacing.plan.md`,
`plugin-package-creation.plan.md`, `app-submission-standards.plan.md`) —
already records owner decisions on this exact seam: pursue **both**
distribution directions (this repo ingests `SKILL.md` sources and re-surfaces
them as generated MCP resources/prompts/tools; `oak-skills` becomes a public,
CLI-installable skills source), and package a cross-vendor **plugin bundle**
of `{skills + MCP}` shipping to **both the Claude and the Codex marketplaces**
— Codex, OpenAI's coding agent, being where an OpenAI plugin-marketplace
mechanism actually exists, not ChatGPT's consumer surface. This corpus was
conserved byte-identical into `.agent/plans-backlog-2026-07/` at the 2026-07-21
release-pivot pause (owner's word: "we lose nothing"), pending resumption
after the first major release; nothing in it has been superseded, and no
equivalent plan exists yet in the live `.agent/plans/` estate. Its own
`sourceType` generator design (t1) is silent on sub-agents entirely — it was
scoped before the sub-agent gap was known. This ADR must be consistent with
that corpus's decided items or say explicitly where it amends them; it is not
free to re-decide them from nothing.

### Why this now connects to ownership moving to audience-facing squads

ADR-227 is the concrete instance the ticket's problem statement gestures at:
the Oak MCP product (the HTTP MCP server and its search instance) is being
extracted to its own repository, `oaknational/oak-open-curriculum-mcp`, built
for a product squad and "every aspect of it is aimed at" less experienced
developers (the owner's words, quoted in full in ADR-227). This repository
keeps the toolkit, Oak's packs, the Practice, and all agent tooling. A teacher
installing "the Oak plugin" wants the skills bundled with the _live_ MCP
server in one step — exactly the assembled, audience-facing artefact
ADR-227 created a home for. Once `oak-open-curriculum-mcp` exists,
`plugins/oak-open-curriculum/` in this repository is a transitional location
for that bundle, not a permanent one.

### The repo question is downstream of a product-surface and lifecycle question

Owner review of this record's first draft surfaced that the canonical-repo
question above is not the first-order decision — it depends on two prior
questions this record did not yet ask: what counts as one product surface,
and who signs off at each stage of a skill's life from idea to production.

**Product surface.** If the MCP server's only job is to serve tools, skills,
and plugins, the server and the capability content it serves are one product
surface, not two — a framing that folds this ADR's "canonical authoring
source" question into a question about MCP itself, rather than treating it as
a boundary problem between two otherwise-separate products. This record does
not yet resolve which framing holds.

**Stakeholder split by lifecycle stage, not by artefact type.** Owner
discussion names three stakeholder groups, not two, each owning a distinct
kind of correctness:

- **Pedagogy/curriculum** own whether a skill or guidance document is right —
  curriculum-correct, age-appropriate, aligned to how Oak teaches. Not a
  software-engineering judgement.
- **AI engineering** own eval — measuring whether a skill or tool actually
  performs. This repository already runs this function, just not yet named
  as a lifecycle owner for skills: the known-answer ground-truth/benchmark
  discipline (MRR, NDCG, precision/recall) documented in
  `apps/oak-search-cli/docs/ground-truths/ground-truth-protocol.md` is the
  same kind of work, currently scoped to search rather than skills. This is a
  first-class seat, not a subset of pedagogy or of software engineering.
- **Software engineering** own whether a skill or tool is correctly wired
  into the protocol — schema validity, tool-shape correctness, safety at the
  trust boundary. SRE/cloud-ops are a hosting concern raised by this split,
  not a first-class stakeholder in it.

**Named open dependencies this ADR's repo recommendation rests on, not yet
resolved:**

1. Whether Decision item 6 below (and the referenced principle that this
   repository's own tool descriptions stay minimal and non-pedagogical —
   _when to use, when not to use, tool shapes, what data is returned_) is
   already being crossed today, not just a future risk: this repository's
   live MCP resources already include guidance documents (covering finding
   lessons, exploring the curriculum, and learning progression) that read as
   pedagogical framing, not bare tool-shape description. That minimal-prompting
   principle is not written down anywhere in this ADR or its cited ADRs
   (125, 189) — Decision item 6 currently depends on it without stating it.
2. Whether a "skill" (the `oak-skills` artefact type this ADR concerns) and
   an "MCP resource" (a served guidance document) are the same kind of
   artefact wearing two distribution hats, needing one lifecycle/ownership
   model, or are different enough in kind to need two. This ADR currently
   treats them as different architectural layers (§References, final
   citation) without testing whether that boundary survives the stakeholder
   split above.
3. Whether AI engineering's eval function needs the skill content and the
   tool/protocol code co-located to score real behaviour (running a skill
   against live tool responses), or can evaluate an exported, decoupled
   skill artefact regardless of where it is authored. This determines
   whether a repository split of the kind Decision items 1–2 recommend can
   survive contact with eval at all, or whether eval's needs pull authoring
   back toward one place.

Until these resolve, the canonical-source recommendation below is this
record's best default under today's understanding, not a closed decision —
see §Recommendations and next steps for how ratification stays conditioned
on them.

## Decision

**Recommended option (provisional — see the three named dependencies above):
one canonical authoring source per capability, chosen by the ADR-189
audience/distribution axes, with generation replacing hand-copying across the
repository boundary.** Concretely:

1. **`oak-skills` remains the canonical authoring source** for the
   curriculum-assistance capability corpus — the eight skills, the nine
   workflow skills, and the four sub-agents. It already runs the only mature,
   working, per-vendor build-and-validate pipeline Oak has for this content,
   and its private status gives Oak's editorial and quality-assurance process
   somewhere to run before teacher-facing content, including proprietary
   brand assets, reaches any public surface. This is a continuation of
   Direction B in the existing 2026-06-08 corpus, not a new decision.
2. **This repository stops hand-copying and becomes a generated consumer**,
   completing Direction A of that same corpus: extend `skills-adapter-generate`'s
   already-designed but unused `sourceType` discriminator to resolve an
   `oak-skills` source and emit the MCP-native surfaces (resources, prompts,
   tools) and the Claude plugin bundle from it, with a drift gate
   (`pnpm skills:check`'s own pattern, applied to this new source) replacing
   manual reconciliation.
3. **Sub-agents become a first-class artefact type in the shared source**,
   generated per vendor exactly as skills are, closing the two-of-four gap by
   generation rather than a further manual copy, and closing the gap in the
   2026-06-08 corpus's own `sourceType` design, which did not name them.
4. **The `{skills + MCP}` plugin bundle's permanent home is
   `oak-open-curriculum-mcp` once that repository exists**, consistent with
   ADR-227's "boundary is published packages" principle: the bundle becomes
   another consumer of registry packages and the generated adapter output,
   not a second hand-maintained tree. Until that repository exists,
   `plugins/oak-open-curriculum/` stays here as the generated (not
   hand-copied) interim location. This is a dated-amendment trigger for this
   ADR at cut-over, in the same style ADR-227 itself uses for its own
   downstream record changes.
5. **AI agent platforms in scope**: the four platforms this repository's own
   ratified strategy already names as the required minimum — ChatGPT, Claude,
   Microsoft 365 Copilot, and Gemini
   (`docs/strategy/stream-mcp-app.md`) — each receiving its native packaging
   shape (Custom GPT / Codex plugin, Claude plugin, Gemini extension + Gem,
   M365 declarative agent) generated from the one canonical source, plus
   Codex specifically for the `{skills + MCP}` plugin-bundle mechanism per
   the existing decided packaging plan. This is six generation targets from
   one source, not the two-surface contract ADR-125 uses for repo-internal
   Practice skills (`.agents/skills/`, `.claude/skills/`) — a materially
   larger generator, sized accordingly.
6. **Divergence between distribution contexts is an explicit, reviewed
   generator rule, never a silent hand-edit.** Where a skill legitimately
   differs between a private draft and a public-safe generated copy (for
   example, dropping a reference to `oak-brand` or `oak-tone-of-voice` from a
   copy that will not ship those companion skills), that drop is a declared
   exclusion or substitution rule in the generator, reviewed like any other
   product code, not an artefact of one engineer's edit under deadline
   pressure going unreconciled.

## Alternatives considered

**(a) Consolidate everything into the public side (this repo, or the future
product repo).** Matches the owner's stated default that all Oak work is
public and open (ADR-227 ruling 2), and removes a second packaging pipeline
entirely. Rejected as the sole answer: `oak-skills`'s private status is not
incidental — its own README states the content is experimental and has not
passed Oak's editorial process, and `oak-brand` carries Oak's proprietary
brand licence rather than MIT/OGL. Moving straight to a public source removes
the pre-publication review gate and forces every draft and every brand-asset
change through public commit history. The generation _direction_ this option
gets right — capability flows toward the public, installable artefact — is
retained in the recommendation; the authoring location is not.

**(b) Consolidate into the private side (`oak-skills` becomes canonical for
public engineering content too).** Least new tooling, since `oak-skills`
already runs the multi-vendor pipeline. Rejected: it runs against the same
public-by-default ruling as (a) in the other direction, and it would move
content this repository already ships publicly (two workflow skills, two
sub-agents) behind a private wall — a regression for a public body. It also
does not answer the ticket's own framing: a squad building the product on a
public repository cannot depend on a private upstream for the very capability
layer its users install.

**(c) A deliberate split by principle.** This is the recommended option,
refined above rather than adopted wholesale: the principle is not
"engineering vs teacher-facing" in the abstract, but the ADR-189
audience/distribution axes already ratified here — audience decides which
content the curriculum-assistance category covers (already settled: it is
all of it, per ADR-189's third category), and the distribution axis
(repo-internal / distributable / both) decides that this content is
"distributable," generated from one canonical source into every target
rather than authored once per target.

**(d) Keep both repositories with an explicit sync mechanism.** Preserves
today's authoring boundary with least structural change. Rejected as
insufficient on its own: a scheduled sync or diff job is a weaker version of
generation without the single-source guarantee, and it does not resolve the
drift already found — the two current copies of `oak-accessibility` and
`oak-curriculum-principles` diverged despite both repositories being under
active, competent maintenance; a periodic copy would still require a human to
reconcile the diff by hand at some point, which is the exact failure mode
recorded in the 2026-07-28 incident. The one part of (d) worth keeping is
folded into the recommendation as its enforcement mechanism: a CI drift gate
between the canonical source and each generated target, on the same pattern
ADR-125's own `pnpm skills:check` already uses for repo-internal skills.

**(e) A third, purpose-built repository for plugin/connector content,
separate from both `oak-skills` and this repository.** Raised in review of
this record's first draft. Rejected for now: a third repository sits between
two existing repositories that already show measured drift (§The divergence
is real), and nothing about a third boundary removes the mechanism that
produced that drift — it relocates the same discontinuity risk to a new seam
(`oak-skills` ↔ new repo) instead of resolving it. It would only be worth
re-opening if the stakeholder-lifecycle work above concludes that
plugin/connector content is a genuinely distinct product surface from both
the skills corpus and the MCP server, which this record does not yet know.

## Rationale

ADR-125 extended a proven canonical-content-plus-thin-adapter model from
sub-agents to skills, commands, and rules within this repository, on the
stated basis that "the same forces (duplication, drift, maintenance cost)
apply." Those forces are visible again here, one repository boundary up: two
copies of the same capability, one drifting silently from the other, and one
incident where the missing generation mechanism was covered by a manual copy
under deadline pressure. Extending the same forces-and-fix reasoning across
the repository boundary is not inventing a new architecture; it is applying
the one this repository has already committed to at the next scale it
appears, which is also why the recommendation completes rather than replaces
the 2026-06-08 plan corpus.

## Trade-offs and limitations

- **Not free.** The cross-repository generator (Direction A's design spike and
  four build workstreams) is scoped but has not started; nothing in this
  decision is validated by a built consumer yet, in the same sense ADR-227
  records for its own extraction.
- **Depends on a repository that does not exist yet.** Recommending
  `oak-open-curriculum-mcp` as the plugin bundle's eventual home carries the
  same "decided is not validated" caveat ADR-227 itself states about its own
  ruling; item 4 above is explicitly a dated-amendment trigger, not a
  claim that the move has happened.
- **The authoring source stays private.** External reviewers of the public
  repository still cannot see the canonical curriculum content directly. This
  ADR does not resolve whether `oak-skills` itself should become public once
  past its experimental gate, consistent with the public-by-default ruling —
  that is named as an open question for the owner in §Recommendations, not
  answered here.
- **Six generation targets is a larger commitment than the two-surface
  contract this repository already runs.** Estimating this work by analogy to
  PDR-051's internal generator would understate it; each of ChatGPT, Claude,
  Gemini, and Microsoft 365 Copilot has its own native packaging shape with
  its own validation rules (`oak-skills`'s own `scripts/validate_*.py` already
  reflects this), and the plugin-bundle mechanism is a further, seventh
  emission for Claude and Codex specifically.
- **Sub-agent portability is uneven across the four platforms and cannot be
  made uniform by this decision.** Codex sub-agents are `.codex/agents/*.toml`
  roster entries; Gemini has no native sub-agent spawning today (only the
  transitional `review-*.toml` command adapters ADR-125 already records);
  ChatGPT and Microsoft 365 Copilot have no sub-agent-equivalent primitive at
  all. The generator's sub-agent emitter is Claude- and Codex-only until or
  unless the other platforms grow an equivalent mechanism; for the platforms
  that lack one, the sub-agent's instructions fold into the main skill or
  knowledge content instead, which is a real behavioural difference between
  hosts, not a packaging detail to smooth over.

## Recommendations and next steps

1. **Ratification is the owner's decision, not this record's.** This ADR
   stays Proposed until MG accepts, amends, or rejects it. That decision is
   explicitly conditioned on the three named dependencies in §The repo
   question is downstream of a product-surface and lifecycle question — the
   owner may ratify the recommendation as-is, ratify it with the dependencies
   named as residual risk, or hold ratification until they resolve.
2. **The stakeholder-lifecycle model itself (pedagogy / AI engineering-eval /
   software engineering) has no documented home yet and should get one.**
   Neither this ADR nor its cited ADRs (125, 189) name AI engineering/eval as
   a stakeholder class or define a skill's idea-to-production lifecycle; this
   record's recommendation implicitly assumes today's informal version of
   that split. Recommend a dedicated decision record for the lifecycle model
   once it firms up, which this ADR would then cite rather than restate.
3. **On acceptance, re-scope the 2026-06-08 corpus against this ADR** rather
   than starting new planning: add sub-agents explicitly to Direction A's
   `sourceType` union design (t1), and update `plugin-package-creation.plan.md`'s
   design-spike workstream to record `oak-open-curriculum-mcp` as the
   plugin bundle's target repository once it exists, superseding its current
   assumption that the bundle ships from here.
4. **Stop further hand-copying now.** Any future directory-submission
   deadline that tempts a repeat of the 2026-07-28 workaround should be
   tracked explicitly as a stopgap against the Direction A generator, with
   its own ticket, rather than treated as the plugin being finished.
5. **Correct MCP-705's own description** to record that `oak-skills` has four
   sub-agents (not zero) and that this repository's plugin covers Claude
   alone (not Claude and ChatGPT), so downstream planning does not inherit
   the ticket's inaccurate premise.
6. **Open question for the owner, not resolved here**: whether `oak-skills`'s
   authoring content should move to public once it clears its experimental
   gate, consistent with the public-by-default ruling in ADR-227.
7. **Write down the minimal, non-pedagogical tool-prompting principle named
   in the dependency list above**, and test it against this repository's
   existing MCP guidance resources (finding lessons, exploring the
   curriculum, learning progression) before relying on it as a clean split —
   either the principle already holds and should be stated once, or those
   resources are the blur it is meant to prevent and the principle needs
   revising.
8. **Amend this record by dated amendment**, in the convention this
   repository already uses, when `oak-open-curriculum-mcp` is created and the
   plugin bundle's home is confirmed or changed.

## Consequences

### Positive

- Replaces a hand-copy origin story and measured content drift with one
  authoring source and generated, drift-checked targets — the same
  duplication-and-drift cure ADR-125 already proved inside this repository,
  applied at the repository boundary.
- Sub-agents stop being an accidental, partially-copied artefact and become a
  first-class generated type, closing today's two-of-four gap without a
  further manual copy.
- Names a concrete, ADR-227-consistent endpoint for the plugin bundle instead
  of leaving `plugins/oak-open-curriculum/` looking like a permanent home for
  what is, by its own origin story, a stopgap.
- Platform scope is stated against this repository's own ratified strategy
  (the four canonical target platforms) rather than against whatever the two
  repositories happen to have built so far.

### Negative / residual risk

- Until the generator is built, the two repositories remain in today's
  hand-copy relationship, and the drift already measured continues to widen.
- The recommendation's endpoint for the plugin bundle depends on a
  repository that does not exist yet; if `oak-open-curriculum-mcp` is delayed
  or its scope changes, this record needs the dated amendment named in
  §Recommendations rather than being read as already achieved.

## References

- `oaknational/oak-skills` (private; read-only clone for this review) —
  `skills/`, `plugins/oak-curriculum-toolkit/`, `chatgpt/`, `gemini/`, `m365/`,
  `.well-known/agent-skills/index.json`, `scripts/build_*.py`
- `plugins/oak-open-curriculum/` — this repository's Claude plugin
- `.agent/memory/operational/director-handoff.md` (2026-07-28 entry) — the
  Claude Directory submission incident that produced the current hand-copy
- `.agent/plans-backlog-2026-07/user-experience/educator-end-users/current/external-facing-capability-distribution.plan.md`
  and its siblings (`oak-skills-ingest-and-resurfacing.plan.md`,
  `plugin-package-creation.plan.md`) — the 2026-06-08 owner-decided corpus
  this ADR completes
- `.agent/plans-backlog-2026-07/BACKLOG.md` — records the corpus above as
  conserved byte-identical at the 2026-07-21 release-pivot pause, pending
  resumption, not superseded
- `docs/strategy/stream-mcp-app.md` — the four canonical target platforms
  (ChatGPT, Claude, Copilot, Gemini)
- `docs/architecture/architectural-decisions/141-mcp-apps-standard-primary.md`,
  `docs/architecture/architectural-decisions/217-server-rendered-html-in-the-mcp-app.md`
  — the MCP-protocol layer these platforms also reach Oak through,
  independent of the skills/plugin layer this ADR concerns
