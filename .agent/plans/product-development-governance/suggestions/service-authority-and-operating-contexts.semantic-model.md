---
plan_id: service-authority-and-operating-contexts-semantic-model
title: "Service Authority and Operating Contexts — Semantic Model"
type: semantic-model
status: proposed
lifecycle: current
thread: strategy-and-plan-estate-holistic-review
last_updated: 2026-06-20
model_scope: service-authority-operating-contexts-agentic-product-development
related:
  - governed-repo-document-graph.semantic-model.md
  - governed-repo-document-graph.plan.md
  - ../vision-strategy-and-plan-estate.plan.md
  - ../../high-level-plan.md
  - ../../../memory/operational/threads/strategy-and-plan-estate-holistic-review.next-session.md
  - ../../../../VISION.md
  - ../../../../docs/strategy/
source_threads:
  - linear-conceptual-model
  - github-branch-review
  - governed-document-graph-discussion
  - service-authority-context-discussion
summary: "Semantic model for the repo as an agentic-first product-development operating substrate, including directional relationships between AI agents, repo context, Linear, GitHub, Sentry, PostHog, SonarQube Cloud, Elastic Cloud Serverless, Figma, and similar services."
---

# Service Authority and Operating Contexts — Semantic Model

## Purpose

This document records the semantic model for the repository as an
**agentic-first product-development operating substrate**. It extends the
repository document graph model by describing how the repo relates to AI agents
and third-party services such as Linear, GitHub, Sentry, PostHog, SonarQube
Cloud, Elastic Cloud Serverless, Figma, and future support systems.

The purpose is not to define implementation details or integrations. It is to
preserve the **authority model, preferred operating contexts, directional
relationships, and service roles** so that future humans and agents do not reduce
the system to an unmanaged mesh of pairwise tool integrations.

## Core thesis

The repository is not just code. It is not just infrastructure definitions. It
is not just product documentation. It is an operating substrate that defines how
to build and evolve digital products **for humans and agents together**.

It contains and organises definitions of:

- what the product and ecosystem are for;
- how strategy turns into plans;
- how plans turn into work;
- how system architecture is understood and changed;
- how code is designed, reviewed, and kept coherent;
- how software engineering discipline is practised;
- how work is reviewed;
- how release readiness is understood;
- how quality is assessed;
- how performance and stability are interpreted;
- how user experience is defined and evaluated;
- how success is measured;
- how evidence from external services is interpreted;
- how AI agents operate safely and usefully with humans;
- how operational data becomes product and engineering learning.

Some definitions live directly in the repo. Some data lives in third-party
services. The repo should define the **semantic model by which those services
support the work**.

This is a new model of software engineering and digital product development:
repo-centred, agentic-first, evidence-aware, multi-altitude, and designed for
human-agent collaboration.

## Why a service authority model is needed

With many systems involved, a naive pairwise integration model creates an
`n^2 - n` relationship tangle. For example, AI agents, Linear, GitHub, Sentry,
PostHog, SonarQube Cloud, Elastic Cloud Serverless, and Figma can all relate to
each other directionally.

The solution is not to treat every pairwise integration as equal. The solution is
to define:

```text
which system owns which truth;
which direction information flows;
which actor operates in which context;
which capabilities are read-only, advisory, or mutating;
which surface should aggregate the result;
which relationships are governed by the repo;
which live state remains owned by the third-party service.
```

A relationship is not merely:

```text
Service A integrates with Service B.
```

It is:

```text
In this operating context, this actor may perform this capability,
moving this kind of information in this direction,
with this authority effect,
surfaced in this preferred place.
```

## Directionality matters

Some relationships are directional and materially different in each direction.

Example:

```text
Claude Code in a local repo terminal reads Sentry data and surfaces runtime
evidence into a repo plan, PR, or human developer workflow.
```

is not the same as:

```text
A Claude agent operating inside Sentry mutates Sentry issue state with access to
repo context.
```

Those two relationships differ in operating context, data direction, authority
effect, audit surface, human supervision expectation, failure mode, and preferred
governance boundary.

The model must therefore describe directional capabilities, not just named
service connections.

## Preferred operating context

The default preference is to surface third-party information into the **repo
working context**, especially when the work is code, docs, product definition,
planning, release readiness, system architecture, engineering quality, or
repo-governance centred.

Preferred default:

```text
A human developer works in a local repo checkout with Claude Code, Codex, or a
similar agent in the terminal. Third-party services provide evidence into that
context. The repo remains the semantic anchor.
```

This is not universal. Some work should happen in a cloud agent context. Some
work should happen in a third-party native tool. The rule is to choose the
operating context from the object of work.

### Local repo terminal context

Best when the agent is:

- modifying code or docs;
- tracing from strategy → plan → implementation;
- inspecting system architecture or code design;
- preparing or reviewing a PR;
- using Sentry, PostHog, SonarQube, Elastic, or Figma as evidence;
- writing repo records;
- working directly with a human developer.

### Cloud repo agent context

Best when the agent is:

- reviewing a PR;
- making bounded repo changes in isolation;
- running cloud checks;
- operating where local credentials should not be present;
- performing constrained implementation with repo-only authority.

### Third-party native context

Best when the object of work belongs to the third-party service:

- triaging an incident inside Sentry;
- exploring product analytics inside PostHog;
- investigating quality findings inside SonarQube Cloud;
- inspecting query/index behaviour inside Elastic Cloud Serverless;
- reviewing or annotating design/source-of-design material inside Figma;
- acting on tool-native objects where that tool owns operational state.

Third-party-native work should usually produce evidence, recommendations,
annotations, or linked work. It should not silently redefine repo intent.

## GitHub PRs as readiness aggregation hub

GitHub is a clear exception to the default rule because PRs are the natural hub
for **quality, merge readiness, review, and proposed change state**.

GitHub PRs do not own durable strategy or execution priority, but they should
aggregate readiness signals for a proposed change:

- human review;
- Copilot review;
- Claude or other AI review;
- SonarQube Cloud quality gate and findings;
- Sentry regression or issue links where relevant;
- PostHog usage or experiment evidence where relevant;
- Elastic search/index evidence where relevant;
- Figma design review or design-source links where relevant;
- deployment preview and smoke-test status where relevant;
- repo plan / strategy / decision links;
- Linear issue/project links.

Distinction:

```text
Repo documents define durable intent.
Linear coordinates execution.
GitHub PRs aggregate review and readiness for proposed changes.
```

## Service authority table

| System | Authority | Does not own |
| --- | --- | --- |
| Repo documents | Durable intent, strategy, semantic model, decisions, plans, evidence records. | Live execution state, external service live state. |
| AI agents | Governed reading, synthesis, proposal, editing, review, and scoped operation. | Independent authority or ownership of decisions. |
| Linear | Execution coordination, assignment, cycles, issue/project state. | Strategy, durable scope, evidence truth. |
| GitHub | Code/docs change proposals, commits, diffs, PR review, merge-readiness aggregation. | Product priority, delivery planning, strategy. |
| Sentry | Runtime errors, exceptions, traces, performance signals, incident evidence. | Product intent or prioritisation by itself. |
| PostHog | Product analytics, usage behaviour, funnels, adoption/friction signals. | Strategic interpretation by itself. |
| SonarQube Cloud | Static quality, code smells, vulnerabilities, coverage/quality-gate evidence. | Product value or release decision by itself. |
| Elastic Cloud Serverless | Search/index/query/retrieval infrastructure state and evidence. | Product interpretation or strategy by itself. |
| Figma | Design source, UX flows, interaction intent, design-system artefacts, review comments. | Implemented behaviour, runtime truth, or repo strategy by itself. |
| Deployment/hosting services | Preview deployments, environment state, deployment status, smoke-test context. | Product intent or strategy. |

## AI agents as governed actors

AI agents are not a single service class. They differ by operating context and
capability.

| Agent/context | Typical role |
| --- | --- |
| Claude Code in local terminal | Paired repo/code/docs work with human developer. |
| Codex in local or cloud repo context | Repo implementation, review, and bounded changes. |
| PR review agent | Review proposed changes and surface findings in GitHub. |
| Tool-native agent | Operate inside a third-party service where that service owns the object. |
| Background automation agent | Scheduled or event-triggered checks with narrow authority. |

The semantic rule is:

```text
Agents may traverse and synthesise authorised surfaces, but they do not become
decision owners. They propose, evidence, edit within permission, and surface
trade-offs. Humans and repo-governed documents hold authority.
```

## Relationship dimensions

Every service relationship should be describable with:

```yaml
actor: who_or_what_operates
operating_context: local_repo | cloud_repo | github_pr | linear | sentry | posthog | sonar | elastic | figma | other
source_system: where_information_or_trigger_comes_from
target_system: where_information_or_action_goes
capability_mode: read | summarise | annotate | create | mutate | review | trigger | project | report
data_direction: source_to_target
authority_effect: evidence_only | advisory | execution_state_change | repo_change | third_party_state_change
preferred_surface: repo | github_pr | linear | third_party_tool | report | plan | human_terminal
human_supervision: implicit_pairing | explicit_approval | async_review | automated_with_guardrails
repo_representation: none | link | frontmatter | report | plan | pr_comment | decision_record
```

This structure prevents vague integration language.

## Directional examples

### Sentry to local repo agent

```yaml
source: sentry
target: ai_agent_local_repo_context
relationship: surfaces_runtime_evidence
mode: read_only
authority: sentry_evidences_repo_interprets
preferred_surface: local_repo_terminal_or_pr_comment
```

### Local repo agent to Sentry

```yaml
source: ai_agent_local_repo_context
target: sentry
relationship: annotates_or_links_runtime_issue
mode: write_or_mutate
authority: operational_state_change
preferred_surface: sentry_only_when_needed
guard: explicit_human_approval
```

### SonarQube Cloud to GitHub PR

```yaml
source: sonarqube_cloud
target: github_pr
relationship: reports_static_quality_gate
mode: automated_review_signal
authority: sonar_evidences_github_aggregates_repo_policy_interprets
preferred_surface: github_pr_check_or_comment
```

### PostHog to repo strategy/report

```yaml
source: posthog
target: repo_report_or_strategy_measure
relationship: evidences_product_usage
mode: read_and_summarise
authority: posthog_observes_repo_interprets
preferred_surface: repo_report_or_strategy_measure
```

### Elastic to repo plan/report

```yaml
source: elastic_cloud_serverless
target: repo_plan_or_report
relationship: evidences_search_or_index_state
mode: read_and_summarise
authority: elastic_observes_repo_interprets
preferred_surface: repo_report_pr_or_local_terminal
```

### Figma to local repo agent

```yaml
source: figma
target: ai_agent_local_repo_context
relationship: surfaces_design_intent
mode: read_and_summarise
authority: figma_evidences_design_repo_interprets_and_implements
preferred_surface: local_repo_terminal_or_pr_context
```

### Local repo agent to Figma

```yaml
source: ai_agent_local_repo_context
target: figma
relationship: annotates_design_or_requests_clarification
mode: annotate_or_comment
authority: design_collaboration_state_change
preferred_surface: figma_only_when_design_object_is_the_work_item
guard: explicit_human_approval_for_mutation
```

### Linear to GitHub PR

```yaml
source: linear
target: github_pr
relationship: coordinates_execution_for_change
mode: link_reference
authority: linear_tracks_execution_github_tracks_change
preferred_surface: github_pr_linked_issue
```

### GitHub PR to Linear

```yaml
source: github_pr
target: linear
relationship: reports_change_progress
mode: status_reference
authority: github_tracks_change_linear_tracks_execution
preferred_surface: linear_linked_pr_status
```

These two Linear/GitHub directions are related but not the same relationship.

## Altitudes and granularities

The repo must support many altitudes of definition and evidence. The service
model should avoid forcing all signals into one level.

| Altitude | Repo-owned definition | Supporting services |
| --- | --- | --- |
| Vision | Intended change and why. | Evidence may later support impact, but vision remains repo-owned. |
| Strategy | Choices, non-goals, measures, theory of change. | PostHog, Sentry, Elastic, Linear, reports may provide evidence. |
| Product | Product surfaces and value propositions. | Figma, PostHog, user research, GitHub, Linear. |
| Product increment | Release/value gates. | GitHub PRs, Linear, Sonar, Sentry, PostHog, deployment previews. |
| System architecture | System boundaries, contracts, component responsibilities, data/control flow, integration topology, and architectural constraints. | ADRs, GitHub diffs, dependency analysis, Elastic/Sentry evidence, architecture reports. |
| Code design | Module boundaries, APIs, abstractions, naming, dependency direction, test seams, and maintainability expectations. | GitHub PRs, code review agents, SonarQube Cloud, local repo agents, ADRs. |
| Software engineering discipline | Engineering rules of practice: type safety, testing, accessibility, security, observability, review, documentation, change control, and agent collaboration. | Repo doctrine, ADRs/PDRs, GitHub checks, SonarQube Cloud, agent-tools, human review. |
| Plan | Durable work intent and acceptance. | Linear, GitHub, Sentry, PostHog, Figma, Elastic as evidence or execution links. |
| PR | Proposed change and readiness. | GitHub, Sonar, Sentry, deployment previews, reviewers, linked evidence. |
| Runtime | Stability, performance, errors. | Sentry, deployment services, logs, Elastic where relevant. |
| Product usage | Adoption, friction, behaviour. | PostHog and qualitative reports. |
| Search/retrieval quality | Query behaviour, index health, relevance. | Elastic, evaluation reports, GitHub changes. |
| Design/UX | Interaction intent, flows, design system, visual/UX decisions. | Figma plus repo implementation and accessibility checks. |
| Code quality | Static quality, maintainability, duplication, complexity, coverage, vulnerabilities, and review findings. | SonarQube Cloud, GitHub checks, code review, tests, local agent analysis. |
| Release readiness | Aggregate readiness to expose, merge, deploy, or promote a product increment. | GitHub PRs, Linear, SonarQube Cloud, Sentry, PostHog, Figma, deployment previews, reports. |
| Agentic practice | How humans and agents build safely. | Repo doctrine, agent-tools, GitHub PR review, service evidence. |

## Managed in repo vs managed externally

### Managed in repo

The repo should define:

- service authority boundaries;
- operating-context preferences;
- relationship vocabulary;
- which service owns which truth;
- which identifiers or links are recorded in repo documents;
- what evidence can support which claims;
- which services may trigger repo or Linear work;
- which relationships are canonical, derived, mirrored, or advisory;
- when a service-native context is appropriate;
- how PR readiness signals aggregate.

### Managed externally

The repo should not attempt to own every live object in third-party services:

- every Sentry issue lifecycle;
- every PostHog event lifecycle;
- every Linear issue status change;
- every SonarQube finding lifecycle;
- every Elastic index/query operational detail;
- every Figma comment or design edit;
- every GitHub PR state transition;
- every agent action log.

Those systems own their live state. The repo owns the model by which their state
is interpreted and connected to durable intent.

## Failure modes this model prevents

- A Sentry error becomes a priority without strategy or product context.
- A PostHog metric becomes a success claim without a defined measure.
- A Linear issue becomes scope authority because it is assigned.
- A GitHub PR changes strategy without declaring a strategy review lane.
- A SonarQube finding is treated as a release blocker without a policy boundary.
- Elastic relevance evidence is treated as product success without user context.
- A Figma design is treated as implemented truth rather than design intent.
- A code-quality score becomes an architectural decision without engineering interpretation.
- A performance signal becomes a product priority without strategy context.
- An AI agent treats a correlation across tools as a decision.
- A third-party service becomes the hidden centre of gravity for repo work.
- The repo mirrors every tool state and becomes a stale second dashboard.

## Design and Figma-specific notes

Figma should be treated as the design-source and collaboration surface for UX and
design-system artefacts, not as implementation truth.

Figma can authoritatively express:

- visual design intent;
- interaction flows;
- component variants;
- layout and responsive behaviour expectations;
- design-system decisions;
- review comments and design collaboration state.

The repo owns:

- implemented components;
- accessibility checks;
- code-level design-system tokens and contracts where implemented;
- product and strategy context;
- acceptance criteria;
- release readiness.

Useful directional relationships:

```text
Figma design intent → repo implementation plan
Figma component spec → design-system implementation
Repo accessibility/technical constraint → Figma design clarification
PR preview → Figma/design review evidence
```

Default preference: surface Figma design context into local repo agent work when
implementing code. Operate in Figma when the object of work is a design comment,
annotation, or design artefact.

## Architecture and engineering-specific notes

System architecture, code design, code quality, and software engineering
discipline are not merely implementation detail. In an agentic-first repo they
are part of the operating model.

The repo owns the durable definitions:

- architectural boundaries and constraints;
- accepted integration patterns;
- module and package responsibility boundaries;
- dependency direction and layering rules;
- code-design expectations;
- quality bars and review norms;
- testing, accessibility, security, and observability disciplines;
- how agent-authored code is reviewed and held to the same standards;
- how architecture decisions are recorded and changed.

Supporting services provide evidence:

- GitHub shows proposed changes and review discussion;
- SonarQube Cloud reports static quality and vulnerabilities;
- Sentry reports runtime failures and performance symptoms;
- Elastic reports search/index/retrieval behaviour where relevant;
- PostHog reports user behaviour where relevant;
- Figma reports design intent and UX collaboration state.

Those services do not own the architecture. They evidence and stress-test it.
The repo interprets and records durable engineering intent.

## Closing principle

Do not build an unmanaged service mesh around the repo.

Build a governed operating model:

```text
Repo documents define durable intent and interpretation.
Agents operate in explicit contexts with scoped capabilities.
GitHub PRs aggregate readiness for proposed changes.
Linear coordinates execution.
Sentry, PostHog, SonarQube Cloud, Elastic Cloud Serverless, Figma, and similar
services provide evidence, state, and collaboration surfaces within their own
authority boundaries.
```

The repo is the semantic anchor for agentic-first engineering and digital product
development. The services support that model; they do not replace it.
