---
pdr_kind: pattern
---

# PDR-010: Domain Specialist Capability Pattern — Adding New Expertise to the Agent Ecosystem

**Status**: Accepted
**Date**: 2026-04-18
**Related**:
[PDR-007](PDR-007-promoting-pdrs-and-patterns-to-first-class-core.md)
(new Core contract — this PDR authored under it);
[PDR-009](PDR-009-canonical-first-cross-platform-architecture.md)
(the three-layer canonical/adapter architecture that specialist
artefacts follow — this PDR is specialist-shape governance;
PDR-009 is artefact-location governance).

## Context

A maturing Practice accumulates domain-specific expertise: the MCP
protocol, Elasticsearch, Clerk, Sentry, accessibility, type systems,
configuration tooling, and others. Adding each new expertise involves
the same decisions — what the agent knows, how it is invoked, when
it fires, what its authority is — and the same decisions have been
rederived from scratch per specialist, producing three recurring
problems:

**Inconsistency.** Each specialist defines its authority hierarchy,
invocation pattern, and context model ad hoc. Some cite external
documentation; some do not. Some distinguish active workflow from
read-only review; some conflate them. Some carry must-read context
lists; some do not.

**Incomplete rollout.** Without a checklist, new specialists ship
without situational invocation rules, platform adapters, or
discoverability updates. A specialist exists but cannot be invoked
from every supported platform, or is invoked only when the author
remembers to request it.

**Capability scope drift.** A reviewer accumulates active-workflow
responsibilities that belong in a companion skill; a skill accumulates
assessment responsibilities that belong in a reviewer; the boundary
between "assess completed work" and "support active work" blurs.

A further gap emerged after the initial specialist pattern stabilised:
reviewers can **assess code** against authoritative sources and skills
can **guide implementation**, but neither can **inspect live domain
state**. An agent auditing an Elasticsearch mapping can read the code
but cannot see the deployed mapping; an agent auditing Clerk
configuration can read environment variables but cannot check the
live application's connections. This creates a workflow gap where
agents either ask the operator to check and report back, or make
assumptions from code that may have drifted.

A second gap emerged at the meta-level: the existing specialists
question **how** work is done (correctly per external best practice,
against domain authority). No specialist questions **whether** work
is proportional to the problem, whether blocking relationships are
legitimate, or whether assumptions have evidence. The standard
doctrine hierarchy (external expertise at the top) is the wrong
hierarchy for this meta-level assessment — proportionality and
simplicity must outrank external expertise when the question is
"should we do this at all?".

A third observation: not every agent in the system is a reviewer.
The roster includes **domain experts** that explore, advise, and
review; **process executors** that drive Practice workflows (e.g.
scaffolding new specialists, running the learning loop); and
**narrow specialists** with fixed input/output contracts invoked
agent-to-agent rather than by humans. Treating all three as
"reviewers" conflates their knowledge shapes, their invocation
patterns, and their model policy.

Underlying cause: "domain specialist" is not one shape. It is a
capability pattern with variants (reviewer/skill/rule/tooling
layers), classifications (domain_expert / process_executor /
specialist), operational modes (explore / advise / review), and
optional inversions (standard doctrine hierarchy vs. inverted for
proportionality reviewers). Without codifying the pattern, each new
capability rediscovers it.

## Decision

**The domain specialist capability pattern has four layers, three
classifications, three operational modes, and one inversion. Every
new agent capability added to a Practice network chooses from these
axes explicitly rather than rederiving the shape.**

### The four-layer capability structure

A complete domain capability consists of up to four layers. The first
three are required for a capability-complete specialist; the fourth is
optional and situation-dependent.

| Layer | Purpose | Required? |
|---|---|---|
| **Reviewer** | Read-only specialist assessment against authoritative sources | Yes |
| **Skill** | Active workflow for planning, research, implementation support | Yes |
| **Situational rule** | Trigger conditions that invoke the reviewer at the right moments | Yes |
| **Operational tooling** | Agent-accessible CLI or MCP tools for inspecting/interacting with live domain systems | Optional |

The reviewer observes, analyses, and reports — it does not modify
code. The skill supports the working agent during active tasks — it
provides guidance under the same doctrine but does not replace the
reviewer's independent assessment. The situational rule specifies
when the reviewer must be invoked (e.g. "when changes touch file
pattern X", "when the commit mentions topic Y"). Operational tooling
— when present — provides live-system introspection that code review
alone cannot reach.

### When each layer is needed

- **Reviewer + Skill + Rule (full triplet)**: the domain has
  authoritative external sources that evolve independently of the
  repo; multiple areas of the codebase touch the domain; the review
  and active-workflow responsibilities are distinct enough to warrant
  separation.
- **Rule only**: a coding convention or internal policy that requires
  activation but not specialist assessment. Lives in the canonical
  directives alongside other rules; no triplet overhead.
- **Triplet + operational tooling**: the domain has a live deployed
  system whose state can drift from its declared configuration, and
  agents need to inspect that live state to assess correctness.

Not every domain needs a full triplet. The pattern scales downward:
the minimum viable capability for a new concern is a rule; the next
step up adds a reviewer; the next adds a skill; operational tooling
comes last and only when live-state inspection matters.

### Reviewer doctrine hierarchy (standard)

Every reviewer enforces a consistent authority hierarchy when
assessing work:

1. **Current official external documentation** — fetched live,
   not cached or copied. Documentation changes; caches go stale;
   only the live fetch is authoritative.
2. **Official packages and client sources** — SDKs, clients,
   repositories. These encode the domain's contract.
3. **Repository ADRs, PDRs, and research** — local constraints,
   accepted trade-offs, current architecture as secondary context.
4. **Existing implementation** — evidence of current state, not
   authority for future decisions.

This hierarchy prevents the common failure mode where agents
inherit stale local patterns instead of consulting current
authoritative sources.

### Reviewer doctrine hierarchy (inverted, for proportionality reviewers)

A meta-level reviewer — whose job is to question whether proposed work
is proportional, whether assumptions have evidence, whether blocking
relationships are legitimate — needs an **inverted** doctrine
hierarchy:

1. **Project principles and directives** — especially "could it be
   simpler?", proportionality, and simplicity-first assessment.
2. **Architectural decisions** — existing constraints and accepted
   trade-offs.
3. **Practice governance** — development Practice, testing strategy,
   and quality-gate framework.
4. **External expertise** — domain knowledge relevant to the plan's
   technology choices. Lowest priority: consulted for fact-checking,
   not for driving decisions.

The inversion is deliberate: standard reviewers answer "how should we
do X correctly?"; proportionality reviewers answer "should we do X at
all, or at this scale?". The latter must subordinate external
expertise to local principles or the reviewer will validate every
best-practice-compliant-but-disproportionate plan.

An inverted-hierarchy reviewer is a pattern-variant of the standard
reviewer, not a different artefact type. The frontmatter declares
which hierarchy applies.

### Tiered local context

Reviewers and skills that require significant local context MUST
tier their reading lists:

- **Must-read** (always loaded): the three-to-five most foundational
  documents for the domain. Every invocation loads these.
- **Consult-if-relevant** (loaded when the review touches that area):
  additional documents providing depth on specific sub-topics.
  Loading these on every invocation wastes context window.

Without tiering, either the reviewer loads too little (missing
foundational context) or too much (wasting context on irrelevant
depth). Tiering makes the trade-off explicit.

### Agent classification taxonomy

Orthogonal to the capability layers, every agent in the roster has a
**classification** in its frontmatter, declaring its knowledge shape,
model policy, and invocation pattern:

| Classification | Knowledge shape | Model policy | Primary invoker | Frequency |
|---|---|---|---|---|
| `domain_expert` | Broad or deep domain knowledge | Powerful models recommended | Humans or agents | Moderate |
| `process_executor` | Workflow and process knowledge | Powerful models recommended (infrequent, high-impact) | Practice expert or humans | Low |
| `specialist` | Narrow, well-defined task | Fast models recommended | Agents only (agent-to-agent contract) | High |

**`domain_expert`** holds knowledge about a specific area and can
operate in any mode (explore, advise, review). Exists at two depths:
**broad** (wide coverage, acts as gateway to deeper experts) and
**deep** (concentrated expertise in a subdomain). Both share the
`domain_expert` classification; depth is captured in the description
and must-read tier.

**`process_executor`** drives workflows that produce or maintain
Practice artefacts. Knows how to _do_ something, not just assess it.
Runs infrequently but with outsized impact (e.g. scaffolding new
specialists, driving the learning-loop graduation).

**`specialist`** executes narrow, well-defined tasks with fixed input
contracts. Invoked by other agents rather than by humans.
Fundamentally an agent-to-agent interface; if a human can describe the
task clearly enough for a specialist, the human could do it directly.

### Three operational modes (for domain experts and process executors)

Orthogonal to classification, domain experts and process executors
support three operational modes:

| Mode | Stance | When to use | Output |
|---|---|---|---|
| `explore` | Investigate, map, discover | Understanding a problem space, surveying options | Open-ended findings, maps, questions |
| `advise` | Recommend before action | Deciding between approaches, planning implementation | Options with trade-offs, recommendations |
| `review` | Assess completed work | Evaluating a diff, plan, or decision | Structured verdict with severity-graded findings |

Mode is explicit (preferred) or inferred from context (fallback).
Specialists do not use modes — they have fixed input/output contracts
that supersede mode.

### Specialist input contract

Specialists receive instructions in a fixed format:

```text
Task: [one sentence — what to do]
Input: [specific files, diff, or data to operate on]
Acceptance criteria: [numbered list — what "done" looks like]
Exit criteria: [when to stop — max scope, stop conditions]
Report format: [exact output structure expected]
```

This format is **both** the invocation interface **and** a
decomposition discipline: if the calling agent cannot fill in these
five fields clearly, the task is not specialist-shaped and should be
handled by a domain expert or process executor instead.

### Operational tooling design principles

When the fourth layer (operational tooling) is present, it adheres
to five principles:

1. **Structured output.** Commands produce structured JSON for agent
   consumption, not just human-readable text. Agents cannot
   reliably parse prose; humans can read JSON.
2. **Read-safe by default.** Inspection commands are safe to run
   without confirmation. Mutation commands require explicit
   confirmation or dry-run modes.
3. **Reviewer-compatible output.** Audit commands produce findings
   in a format compatible with the reviewer's output template
   (violations, gaps, opportunities, observations).
4. **Build or adopt.** For each domain, evaluate whether an
   official CLI exists and covers the needed operations before
   building custom tooling. Prefer adoption when coverage is
   sufficient; supplement with custom tooling where gaps exist.
5. **Discoverable.** Operational tooling is referenced from the
   specialist's skill and reviewer so agents know it exists.

### Standard rollout sequence

A new domain specialist follows a standard sequence:

1. **Baseline audit** — confirm no equivalent artefacts exist; freeze
   the authority stack (which external documentation, which packages).
2. **Canonical artefacts** — create the reviewer template, skill, and
   situational rule in the canonical location (per PDR-009 Layer 1).
3. **Coordination updates** — add the specialist to the agent roster,
   reviewer-invocation guidance, and any cross-referencing indexes.
4. **Platform adapters** — create thin wrappers per PDR-009 Layer 2
   on every supported platform.
5. **Discoverability** — update collection indexes, roadmaps, and
   session-entry guidance.
6. **Review and propagation** — specialist review pass of the new
   specialist's own artefacts; documentation propagation to permanent
   surfaces.
7. **Operational tooling** (if applicable) — add CLI or MCP tools;
   reference from skill and reviewer; validate structured-output
   contract.

## Rationale

**Why a triplet, not just a reviewer.** A reviewer assesses completed
work; a skill supports active work. These are different stances: the
reviewer's independence is load-bearing (it must be able to say "no,
this is wrong"); the skill's helpfulness is load-bearing (it must be
able to say "yes, here's how to do it"). A single artefact that tries
to do both either compromises independence or compromises
helpfulness. Separating them preserves both.

**Why a situational rule, not just discoverability.** A reviewer
that exists but is never invoked provides no value. Situational rules
encode "when this change profile appears, route to this reviewer" —
making invocation systematic rather than vigilance-dependent. Without
the rule, reviewers are used when remembered; with the rule, they are
used when applicable.

**Why operational tooling is optional.** Not every domain has live
state that can drift. A coding-convention specialist has no deployed
system to inspect; adding tooling for it is machinery without payoff.
The optionality reflects that the fourth layer answers a specific
question (what is the current live state?) and should exist only when
that question matters.

**Why the classification taxonomy.** Three distinct agent shapes with
different model policies, invocation patterns, and frequencies produce
different operational costs and quality profiles. Treating them
identically (same model, same invocation style, same frequency
expectation) either over-provisions the cheap ones (expensive models
for narrow specialists) or under-provisions the expensive ones (fast
models for domain experts whose mistakes compound). The classification
makes the cost/quality trade-off explicit.

**Why modes are orthogonal to classification.** A domain expert may be
asked to explore a new area, advise on an approach, or review completed
work — all in the same session. These are different output shapes, not
different agents. Making mode orthogonal (declared per invocation)
rather than baked into the agent's identity avoids needing three
copies of each domain expert.

**Why the inverted hierarchy is a variant, not a new agent type.**
The inversion changes only the doctrine hierarchy; the reviewer's
shape (canonical + adapter + rule) is identical. Declaring the
inversion via frontmatter preserves the pattern while enabling the
variant. Introducing a separate "proportionality reviewer" artefact
type would fragment the capability model for what is a one-flag
change.

Alternatives rejected:

- **Per-domain shape (no pattern).** Rejected for the inconsistency and
  incomplete-rollout costs already observed.
- **Reviewer-only (no skill, no rule, no tooling).** Rejected:
  reviewers without skills blur into active-workflow support; without
  rules they are under-invoked; without tooling they cannot see live
  state.
- **Monolithic specialist (one artefact combining reviewer and skill).**
  Rejected: blurs independence vs. helpfulness; no clean separation
  between "assess" and "support".

## Consequences

### Required

- Every new domain specialist added to a Practice-bearing repo follows
  the four-layer pattern (minimum triplet; operational tooling if
  live-state inspection is in scope).
- Every agent in the roster carries an explicit `classification` in
  frontmatter: `domain_expert`, `process_executor`, or `specialist`.
- Every domain expert and process executor supports the three modes;
  every specialist has a fixed input contract.
- Every reviewer declares its doctrine hierarchy (standard or
  inverted) in frontmatter.
- Reviewers and skills with significant local context tier their
  reading lists into must-read and consult-if-relevant.
- Operational tooling, when present, produces structured JSON,
  defaults to read-safe behaviour, and is discoverable from the
  skill and reviewer.
- The standard rollout sequence is followed for every new
  specialist; partial rollouts (adapter missing on one platform,
  rule not added, discoverability not updated) are contract
  violations.

### Forbidden

- Monolithic specialists that combine reviewer and skill
  responsibilities.
- Reviewers without situational rules (relying on vigilance for
  invocation).
- Untiered must-read context in specialists that have significant
  local material (forces every invocation to load everything).
- Specialists invoked by humans where the five-field input contract
  cannot be filled clearly (a signal the task is not
  specialist-shaped).
- Undeclared classification — every agent carries one.
- Inverted hierarchy applied silently; the variant must be declared.

### Accepted cost

- More artefacts per capability than "just a reviewer" would imply.
  Trade-off: consistent shape, systematic invocation, clear
  independence boundary. Worth it.
- Frontmatter complexity grows (classification, mode support,
  hierarchy declaration). Discoverable via validation; not left to
  institutional knowledge.
- The rollout sequence is recurring checklist work. No shortcut
  available without reintroducing the inconsistency costs the
  pattern solves.

## Notes

### Relationship to PDR-009

PDR-009 establishes that all agent artefacts live canonically with
thin platform adapters. PDR-010 fills in **what** artefacts a domain
specialist consists of (the four layers) and **how** they classify
(the taxonomy). The two compose: a specialist's canonical artefacts
(Layer 1 per PDR-009) follow the triplet-plus-optional-tooling shape
(per PDR-010) and are wrapped into platform adapters (Layer 2 per
PDR-009).

### `pdr_kind: pattern`

This PDR carries `pdr_kind: pattern` in frontmatter — it is a
reusable pattern for adding new capabilities, not a one-off
governance decision. The template body still follows the PDR shape
(Context / Decision / Rationale / Consequences) because the pattern
is substantive enough to warrant decision-style justification.

### Graduation intent

Like PDR-009, this PDR's substance is a candidate for eventual
graduation into `practice-bootstrap.md` as a "How to add new domain
expertise" section, or into `practice-lineage.md` as a Learned
Principle about capability growth. Graduation marks the PDR
`Superseded by <Core section>` and retains it as provenance.

### Host-local context (this repo only, not part of the decision)

At the time of authoring, the repo where this PDR was written
carries:

- Reviewers following the standard hierarchy: code-reviewer,
  architecture reviewers (multiple), test-reviewer, type-reviewer,
  config-reviewer, security-reviewer, docs-adr-reviewer,
  mcp-reviewer, elasticsearch-reviewer, clerk-reviewer,
  sentry-reviewer, design-system-reviewer,
  react-component-reviewer, accessibility-reviewer.
- Reviewer following the inverted hierarchy:
  assumptions-reviewer.
- Process executors: subagent-architect; Practice executors (run
  infrequently).
- Specialists: narrow agents for specific automation tasks.
- Operational tooling present: the search CLI's admin commands
  for Elasticsearch; upstream Clerk CLI under evaluation for the
  Clerk specialist.

Specific reviewer counts, agent names, and operational-tooling
command lists live in the host ADR record this PDR's substance
extracts from.
