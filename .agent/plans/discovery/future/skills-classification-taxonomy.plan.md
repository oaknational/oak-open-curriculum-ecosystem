---
name: "Skills Classification Taxonomy - audience-led capability vocabulary"
collection: discovery
lane: future
status: strategic
last_updated: 2026-06-03
---

# Skills Classification Taxonomy

> **Strategic brief (`future/`).** This defines the audience and governance
> split to preserve during later implementation, packaging, or plugin work; it
> is not an executable adapter-generation or platform-integration plan. Homed
> in the discovery collection by owner direction, beside its companion
> distribution-channels report: the taxonomy governs the audience-led naming
> of the capabilities that the discovery collection publishes and distributes.

## Problem And Intent

The repo uses **skills** as a Practice workflow term, but adjacent work now
needs vocabulary for two different audiences: developers using Oak technical
services, and educators or teachers using Oak curriculum support. Platform
packaging also uses `SKILL.md`, which can make the host mechanism look like
the concept.

The intent is to keep those axes separate:

- **Repo-working skills** are Practice-governed workflows for agents working in
  this repo.
- **Oak developer capabilities** help agents or developers use Oak APIs, MCP,
  SDKs, search, graph, and data services correctly.
- **Curriculum assistance capabilities** help agents serve teachers and
  educators through curriculum discovery, lesson planning, guidance,
  playbooks, evidence, or pedagogical explanation.

The taxonomy exists to prevent Practice-governance vocabulary leaking into
external developer or teacher-facing contexts, while still allowing any of the
three categories to be packaged as platform skills later.

The audience axis is not the whole taxonomy. A second, orthogonal
**distribution axis** (ADR-189) records deployment locus: **repo-internal**
(under `.agent/` with generated platform adapters), **distributable**
(published to external systems — skills libraries, discovery indexes, MCP
apps, plugin marketplaces), or **both** — the same capability, or versions of
it, may be dual-homed. Audience names the category, distribution names the
locus, packaging stays mechanism.

## Mechanism And Means

The durable vocabulary home is
[`agent-capability-vocabulary.md`](../../../memory/executive/agent-capability-vocabulary.md).
It is executive memory because agents look it up when deciding where a new
agent-readable knowledge surface belongs. The taxonomy itself is ratified by
[ADR-189][adr-189] (2026-06-03).

A companion report,
[`skills-distribution-channels-suggestions.report.md`](skills-distribution-channels-suggestions.report.md),
records the 2026-06-03 ecosystem survey (Agent Skills format, MCP, plugin
bundles) and suggested future directions: capability manifests, developer and
curriculum-assistance capability packs, and packaging adapters. Its
recommendations are promotion-time shaping input, and the decisions it names
remain the owner's; its ecosystem claims need verification against official
platform documentation at promotion time.

Future execution should:

1. Audit existing uses of "skill", "capability", "developer", "teacher",
   "educator", "MCP", "search", and "curriculum" across live docs and plans.
   The audit's output artefact is an inventory table — artefact × current
   path × audience × distribution locus (repo-internal / distributable /
   both) × governance owner × packaging × status — so ambiguous cases
   surface early (report §14 Phase 2 shape, extended with the ADR-189
   distribution axis).
2. Apply the executive vocabulary to ambiguous docs by replacing mechanism-led
   wording with audience-led wording, applying the noun discipline from the
   companion report §11: unqualified "skill" only for platform packages and
   repo-working Practice workflows; "capability" for durable audience-facing
   categories; "plugin"/"bundle" for installable compositions; teacher-facing
   copy never uses skill/`SKILL.md`/adapter/Practice/repo-workflow vocabulary.
3. Cross-reference related doctrine rather than duplicating it:
   [ADR-189][adr-189] for the ratified taxonomy, [PDR-051][pdr-051] for
   platform skills, [PDR-010][pdr-010] for specialist capabilities, and
   [ADR-125][adr-125] for canonical/adapter mechanics.
4. Preserve the boundary between this taxonomy and Antigravity or other host
   integration work. Host support can constrain packaging, not the category
   names.

The companion report's larger structural suggestions — canonical capability
manifests, developer and curriculum-assistance capability packs, and
capability-pack adapter generation — are candidate future lanes that require
owner direction before any brief is authored; the likely owning collections
are `discovery/` (publication and adoption) and `sdk-and-mcp-enhancements/`
(runtime surfaces). They are not scope of this plan.

## Live Application Target: The Oak Skills Library

A first-party Oak skills library exists at
[`oaknational/oak-skills`](https://github.com/oaknational/oak-skills)
(private at the time of writing, 2026-06-03; initial library under review in
its PR #1): six user-facing Agent Skills — `oak-brand`, `oak-tone-of-voice`,
`oak-curriculum-principles` (self-contained), an MCP-grounded principles
variant, `oak-lesson-builder`, and `oak-curriculum-mapper` — packaged as a
Claude plugin bundle with spec validation and per-skill evals.

The owner's assessment (2026-06-03): the two skill sets are complementary and
serve slightly different purposes — this repo owns repo-working skills and
Oak developer capabilities; the library owns user-facing brand and curriculum
capabilities — and eventual integration of the user-facing set into this repo
is likely. Integration is a named owner decision, not committed scope here.

For this plan the library is:

- **Promotion-trigger evidence**: a concrete agent-facing package that needs
  the taxonomy applied (its packaging vocabulary is "skills" throughout,
  correct under ADR-189 packaging usage; its user-facing copy is where the
  audience-led layer applies).
- **A named ambiguous case for the audit inventory**: `oak-brand` and
  `oak-tone-of-voice` are literal branding capabilities — visual identity and
  writing voice — that span audiences and fit none of the three categories
  cleanly; the audit must classify them rather than inherit "skills" by
  default. Do not conflate them with Oak's defined standards of pedagogical
  and factual rigour (evidence use, provenance, caveats, teacher judgement,
  factual grounding): rigour standards are constraints that travel inside
  curriculum-assistance and developer capabilities, owned by
  curriculum/evidence governance — they are not a branding concern and not a
  category candidate.

[adr-189]: ../../../../docs/architecture/architectural-decisions/189-audience-led-agent-capability-taxonomy.md
[pdr-051]: ../../../practice-core/decision-records/PDR-051-vendor-agnostic-skills-standardisation.md
[pdr-010]: ../../../practice-core/decision-records/PDR-010-domain-specialist-capability-pattern.md
[adr-125]: ../../../../docs/architecture/architectural-decisions/125-agent-artefact-portability.md

## Dependencies And Non-Goals

**Blocking prerequisite (met 2026-06-03):** owner acceptance of the
three-category vocabulary, ratified as [ADR-189][adr-189].

**Beneficial prerequisite:** a later platform-integration pass may discover
host-specific naming constraints. The minimum shippable taxonomy still stands
without that pass: platform constraints are recorded as packaging notes only.

**Non-goals:**

- No changes to MCP tool schemas, SDK types, runtime behaviour, or package
  exports.
- No Antigravity, Claude, Codex, Cursor, or Gemini adapter implementation.
- No rename of existing repo-working skills.
- No merge into the sub-agent classification taxonomy; that plan classifies
  agents, while this one classifies audience-facing knowledge and workflow
  categories.

## Open Consideration: A Rights/Licensing Axis

ADR-189 ratifies two axes (audience, distribution locus) with packaging as
mechanism. The oak-skills library's licensing split — MIT scaffolding, © Oak
brand assets, curriculum content shared in a pedagogical spirit — maps onto
neither axis cleanly: when Oak distributes capabilities externally, what may be
copied, what must be attributed, and what stays Oak's are questions the current
taxonomy cannot record. Whether rights/licensing is a third axis, a
per-capability metadata field, or out of taxonomy scope (owned by LICENSE
surfaces) becomes decidable at the first external capability publication or the
oak-skills integration decision — the same trigger as this plan's promotion.
Resolve it then via an [ADR-189][adr-189] amendment plus inventory columns in the
audit step above; until then it is one observation, not a category.

## Acceptance Criteria

- Existing docs can describe a new agent-readable surface without using
  unqualified "skills" outside repo-working Practice workflows.
- Developer-facing Oak service guidance is nameable without implying it is part
  of repo Practice governance.
- Teacher or educator-facing curriculum assistance is nameable without exposing
  repo, platform, or Practice implementation mechanics.
- Platform `SKILL.md` support is treated as packaging unless it reveals a real
  audience or governance constraint.
- Generated or published platform descriptions (skill descriptions, MCP
  prompt/resource descriptions, app copy) are reviewed for audience fit before
  release.
- The noun discipline (skill / capability / plugin usage rules) holds across
  live docs after the audit pass.
- The [`discovery/future/README.md`](README.md) table row for this plan names
  it as the owner of the taxonomy lane.

## Promotion Trigger

Promote this plan to `current/` when a concrete doc, plugin, MCP guidance, or
agent-facing package needs the taxonomy applied across multiple files, or when
owner direction asks for a repo-wide terminology pass.
