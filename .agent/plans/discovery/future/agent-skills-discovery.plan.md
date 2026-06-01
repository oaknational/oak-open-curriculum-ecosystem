---
name: "Agent Skills Discovery - Oak workflow publication"
collection: discovery
lane: future
status: strategic-tracking
last_updated: 2026-06-01
parent_plan: agentic-mechanisms-discovery.plan.md
---

# Agent Skills Discovery plan

> **Strategic brief (`future/`).** This is not executable yet. It prepares Oak
> to publish a small, trusted Agent Skills Library and a discoverable
> `.well-known/agent-skills/index.json` surface once the catalogue, trust model,
> and external draft stability are ratified. Execution decisions are finalised
> only during promotion to `current/`.

## Purpose

Prepare Oak to publish discoverable, high-quality Agent Skills that help AI
assistants follow Oak-approved curriculum workflows while relying on Oak's live
SDK, MCP, search, and graph surfaces for factual data.

Primary external reference:

- Cloudflare Agent Skills Discovery RFC:
  <https://github.com/cloudflare/agent-skills-discovery-rfc>

Supporting references:

- Agent Skills specification: <https://agentskills.io/specification>
- Research report:
  [agent-skills-discovery-research.report.md](agent-skills-discovery-research.report.md)
- Parent plan:
  [agentic-mechanisms-discovery.plan.md](agentic-mechanisms-discovery.plan.md)

## Problem, End Goal, Mechanism, And Means

- **Problem.** Oak can already expose curriculum data through structured
  technical surfaces, but AI assistants and users still need reusable workflow
  guidance to use those surfaces well. Without a discoverable Oak-authored
  skills layer, teachers, schools, and partners rely on ad hoc prompts,
  vendor-specific instructions, or incomplete third-party summaries of how to
  use Oak curriculum data responsibly.
- **End goal.** A trusted Oak domain publishes a small, discoverable Agent
  Skills Library that agents can find, verify, and load progressively. The
  skills help teachers and builders complete high-value curriculum workflows
  while preserving provenance, teacher judgement, caveats, and live data
  freshness.
- **Mechanism.** Agent Skills package repeatable workflows as `SKILL.md`
  artifacts. The Cloudflare discovery RFC adds a domain-level index at
  `/.well-known/agent-skills/index.json` with artifact URLs and digests. Oak can
  use that index to publish workflow guidance while keeping live facts in MCP,
  SDK, search, and graph surfaces.
- **Means.** Track the discovery RFC and Agent Skills spec (Phase 0), ratify an
  Oak skill catalogue through teacher-value traces (Phase 1), author a small
  first tranche of skills (Phase 2), create and validate the discovery index
  (Phase 3), publish behind the right public domain when ready (Phase 4), and
  document adoption for teachers, schools, and partners (Phase 5).

## Domain Boundaries

This plan owns:

- Oak-authored Agent Skills for curriculum workflows.
- A discoverable skills index shaped by the Cloudflare RFC.
- Trust, provenance, digest, and no-default-script-execution policy for those
  skills.
- The relationship between skills and Oak MCP/SDK/search/graph surfaces.

This plan does not own:

- MCP Server Cards. That is tracked by
  [mcp-server-cards.plan.md](mcp-server-cards.plan.md).
- A2A Agent Cards or a remote Oak agent. Those remain future lanes under the
  parent plan.
- The runtime implementation of Oak MCP tools, resources, prompts, search, or
  graph surfaces.
- A public marketplace for third-party skills.
- Ingestion of arbitrary external skills into Oak's Practice or product
  surfaces.

## Non-Goals

- Do not embed static Oak curriculum data in skills.
- Do not treat skill descriptions as a source of runtime truth.
- Do not execute bundled scripts by default.
- Do not publish archives when a single `SKILL.md` artifact is enough.
- Do not use Agent Skills Discovery as a replacement for MCP, SDK, search,
  graph, OpenAPI, or A2A.
- Do not publish a skill until its teacher/user value has been traced end to
  end against available Oak data.
- Do not promote this plan to executable work until the blocking prerequisites
  below are met.

## Proposed Oak Skill Catalogue

First-tranche candidates, subject to value-trace ratification:

| Candidate Skill | Primary Audience | Value Hypothesis |
| --- | --- | --- |
| `oak-curriculum-search` | Teachers, partners, AI assistants | Find relevant Oak lessons, units, and sequences using Oak search/MCP rather than generic web search |
| `oak-lesson-adaptation` | Teachers | Adapt a lesson while preserving curriculum intent, teacher judgement, and caveats |
| `oak-progression-explorer` | Teachers, curriculum leaders | Explore prior knowledge, progression, threads, and sequence position |
| `oak-resource-comparison` | Teachers, school/trust reviewers | Compare possible Oak resources and surface trade-offs instead of over-selecting |
| `oak-evidence-framing` | Teachers, AI product teams | Use evidence context honestly, including strength, cost, impact, uncertainty, and partial coverage |

Each skill must name the Oak MCP/resource/search/graph surfaces it expects an
agent to use. If a needed surface does not exist, the skill is not ready; route
the gap to the owning product or data plan instead of hiding it in prose.

## Required Skill Constraints

Every Oak-published skill must:

- include valid Agent Skills frontmatter with `name` and `description`;
- keep the description explicit about when to use the skill;
- keep `SKILL.md` small enough for progressive disclosure;
- reference supporting files only when the extra file is necessary;
- avoid static curriculum payloads;
- route live facts through Oak's generated or runtime surfaces;
- preserve teacher agency with options, trade-offs, provenance, and caveats;
- state attribution or evidence-source handling where applicable;
- include compatibility notes for required hosts/tools when needed;
- declare no bundled script unless a later executable plan ratifies script need;
- be digest-verifiable from the discovery index.

## Discovery Index Shape To Track

Expected draft shape:

```json
{
  "$schema": "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
  "skills": [
    {
      "name": "oak-curriculum-search",
      "type": "skill-md",
      "description": "Find Oak curriculum lessons, units, and sequences using Oak's trusted data surfaces.",
      "url": "/.well-known/agent-skills/oak-curriculum-search/SKILL.md",
      "digest": "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    }
  ]
}
```

Execution-time implementation must re-read the live RFC before using this shape.

## Comparison With MCP Server Cards

The existing [MCP Server Cards plan](mcp-server-cards.plan.md) prepares Oak to
publish a pre-connection metadata card for public remote MCP servers once that
specification stabilises. This plan prepares Oak to publish workflow artifacts.

They compose as follows:

- Server Cards answer: "where is the Oak MCP server and how do I connect?"
- Skills Discovery answers: "which Oak-authored workflows can I load?"
- MCP runtime answers: "which tools/resources/prompts are currently available
  and what do they return?"

The plans must not duplicate each other. A server card should not list Oak
workflow instructions. A skill should not become a server card or a runtime
capability manifest.

## Dependencies And Sequencing

Blocking prerequisites:

- **`blocking`** - Oak ratifies the first skill catalogue by teacher/user value,
  not by technical convenience.
- **`blocking`** - Each candidate skill has a live Oak data/tool route that can
  support the promised value.
- **`blocking`** - The trust model is agreed: trusted domains, digest
  verification, provenance recording, and no default script execution.
- **`blocking`** - The external Agent Skills Discovery draft is stable enough
  for a low-risk implementation, or Oak explicitly accepts draft-tracking
  publication as experimental.
- **`blocking`** - Product/brand/legal review confirms the public domain,
  naming, attribution, and user-facing claims are suitable.

Beneficial prerequisites:

- **`beneficial`** - A resolvable official discovery JSON Schema is available.
  *Without it:* validate against the normative fields in the live RFC and pin
  the draft `$schema` URI in examples only.
- **`beneficial`** - Oak MCP Server Card publication has landed. *Without it:*
  skills can still reference public docs and existing MCP connection guidance,
  but the user journey is less self-discovering.
- **`beneficial`** - A partner-facing agent readiness page exists. *Without it:*
  document the skills in the relevant MCP or developer README at first.

## Strategic Acceptance Criteria And Success Signals

This strategic plan is successful when:

- It gives a future executor a clear promotion trigger and no ambiguity about
  the layer boundary between skills, MCP, and A2A.
- The first-tranche skill candidates have value hypotheses tied to teachers,
  schools, partners, or Oak product teams.
- Every proposed skill has an identified live data/tool route or an explicit
  gap routed out of this plan.
- The discovery index can be validated for required fields and artifact digests.
- The publication decision includes trust, provenance, script-execution, and
  archive-safety controls.

Success after implementation would mean:

- A compatible client can fetch Oak's skills index from a public Oak domain.
- Each listed artifact verifies against its digest.
- Each skill loads progressively and routes factual work to Oak's live data
  surfaces.
- Teacher-facing workflows preserve provenance, caveats, and teacher judgement.
- Partner docs explain when to use skills, MCP, SDK, search, graph, or A2A.

## Risks And Unknowns

| Risk / Unknown | Impact | Mitigation |
| --- | --- | --- |
| Discovery RFC changes | Implementation churn or incompatible index shape | Keep plan in `future/`; re-read RFC at promotion |
| Skill over-promises available data | Teacher trust loss and bad outputs | Mandatory value trace and live data/tool route per skill |
| Prompt injection through third-party skills | Security risk if clients generalise from Oak's work | Publish trusted-origin guidance and no automatic third-party ingestion |
| Skills become stale documentation | Drift from live Open Curriculum data | Skills route to generated/runtime surfaces; validation checks for static data payloads |
| Archive complexity | Extra safety burden | Prefer `skill-md` until supporting files are genuinely necessary |
| Confusion with MCP Server Cards | Duplicated or contradictory discovery surfaces | Parent plan owns layer map and cross-plan comparison |

## Promotion Trigger To `current/`

Promote this plan to `current/` when all of the following are true:

- The owner confirms the first-tranche skill catalogue and publication intent.
- The Cloudflare discovery RFC or successor shape is stable enough for Oak's
  intended publication posture.
- A public Oak domain/path owner is identified.
- Each first-tranche skill has a confirmed live data/tool route.
- The trust and validation policy is accepted.

Promotion should produce an executable plan with TDD cycles for:

- skill validation;
- digest generation;
- discovery index generation or static publication;
- endpoint/content-type/cache checks;
- safety checks for scripts, archives, private URLs, and static curriculum
  payloads;
- README or partner-doc updates.

## Open Questions

- Which Oak domain should publish the skills index?
- Should the first tranche be public alpha, partner-preview, or internal-only
  before public publication?
- Which clients should be used for compatibility smoke testing?
- Should any first-tranche skill use supporting `references/`, or should all
  start as `skill-md`?
- What is the exact source of truth for each skill's public description?
- How should skill digests be generated and reviewed during release?
- Which owner signs off teacher-facing workflow language?
- Which evidence and attribution wording belongs in `oak-evidence-framing`?

## Recommended Default Until Promotion

Prepare the catalogue and trust policy, but do not publish. Keep the initial
shape small:

```text
five or fewer skill-md artifacts + one discoverable index + no bundled scripts
```

Let MCP, SDK, search, and graph surfaces remain the source of truth for facts.
