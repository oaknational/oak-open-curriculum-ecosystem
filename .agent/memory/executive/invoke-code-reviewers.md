# Invoke Specialist Reviewers

After non-trivial changes, invoke `code-reviewer` plus all specialist reviewers
required by the change profile. Until the taxonomy rename lands,
`code-reviewer` remains the current gateway reviewer.

Documentation drift (`docs-adr-reviewer`) applies whenever behaviour or
architecture changes, even if no docs are explicitly edited.

## Layered Triage (First 2 Minutes)

Use this order so the gateway scales with the specialist roster.

### Layer 1 — Change Category

Ask what kind of change this is:

1. Code change
2. Infrastructure or tooling change
3. Documentation or onboarding change
4. Agent or practice change

### Layer 2 — Domain Signal

Then route by domain:

1. Auth, secrets, PII, or OAuth -> `security-reviewer`
2. Clerk middleware, token verification, OAuth proxy, PRM,
   `@clerk/mcp-tools`, or Clerk SDK usage -> `clerk-reviewer`
3. MCP protocol, tool/resource/prompt definitions, MCP Apps Extension
   widgets, transport/session patterns, or MCP Apps migration work ->
   `mcp-reviewer`
4. Sentry SDK usage, OpenTelemetry trace/log correlation, telemetry
   redaction, MCP Insights, or Sentry env/config wiring ->
   `sentry-reviewer`
5. Elasticsearch mappings, queries, analysers, synonyms, ELSER, RRF,
   reranking, ingest, or Elastic Serverless capabilities ->
   `elasticsearch-reviewer`
6. Plans marked decision-complete, 3+ agents, asserted blocking
   relationships, or technology commitments before research ->
   `assumptions-reviewer`
7. Onboarding flows, start-right entrypoints, or ADR discoverability ->
   `onboarding-reviewer`
8. Rendered UI, CSS, design tokens, or React components -> UI/Frontend
   cluster: `accessibility-reviewer`, `design-system-reviewer`,
   `react-component-reviewer`

### Layer 3 — Cross-Cutting Concerns

Always check these regardless of category:

1. Module boundaries, imports, or public APIs -> architecture reviewer(s)
2. Test additions, modifications, or TDD concerns -> `test-reviewer`
3. Type complexity, generics, or schema flow -> `type-reviewer`
4. Tooling configs or quality gates -> `config-reviewer`
5. README, TSDoc, ADR, or docs drift -> `docs-adr-reviewer`

## Review Depth

For each specialist you invoke, state the review depth explicitly:

- `focused` — confirm one bounded concern or change signal
- `deep` — trace behaviour across boundaries, contracts, or interacting systems

Use `deep` when:

- the change crosses package or architectural boundaries
- the same concern could be hiding in multiple files or layers
- the finding needs traceability rather than spot checks

Use `focused` when:

- one concrete file or concern triggered the review
- the question is binary or narrow
- a deep pass would mostly repeat known context

## Delegation Snapshot

Every bounded reviewer or worker lane should receive this minimum snapshot:

- **Goal**
- **Owned surface**
- **Non-goals**
- **Required evidence**
- **Acceptance signal**
- **Reintegration owner**
- **Stop or escalate rule**

This keeps reintegration cheaper and reduces clarification loops. Mailbox
delivery alone is not reintegration; the parent lane must absorb the outcome
back into the authoritative plan or dialogue.

## When to Invoke

Non-trivial changes include:

- Completing a feature or user story
- Fixing a non-trivial bug
- Refactoring (especially structural changes)
- Adding or modifying public APIs
- Changes touching multiple files
- Architectural modifications

Minor changes (single typo/comment-only edits with no behaviour impact) may use lighter review, but still require explicit rationale.

## Timing Tiers

| Tier | When | What to invoke |
|---|---|---|
| Immediately after change | After each non-trivial code change | `code-reviewer` plus all specialists matching the change profile |
| Design-pressure checkpoint | Before implementing high-risk type/boundary changes | Relevant specialist(s) to review intended approach (for example `type-reviewer` before touching external-signal parsing) |
| Before merge | Before the branch merges | Any applicable specialists not yet invoked during implementation |
| Situational trigger | When the specific context arises | On-demand agents (see below) -- not tied to every change |

## Required Reviewer Matrix

Always invoke:

- `code-reviewer` (gateway — also responsible for flagging when specialists are missing, recommending review depth, and checking coverage)

Invoke additional specialists when applicable:

| Change Category | Required Specialist(s) |
|---|---|
| Structural/boundary changes | `architecture-reviewer-barney` and/or `architecture-reviewer-fred` and/or `architecture-reviewer-betty` and/or `architecture-reviewer-wilma` |
| Test changes or TDD concerns | `test-reviewer` |
| Type-system complexity or assertion pressure | `type-reviewer` |
| Tooling/config quality-gate changes | `config-reviewer` |
| Auth/authz, OAuth, secrets, PII, injection, security-sensitive logic | `security-reviewer` |
| README/TSDoc/ADR/docs updates or expected documentation drift | `docs-adr-reviewer` |
| Rendered UI, CSS, design tokens, React components | UI/Frontend cluster: `accessibility-reviewer`, `design-system-reviewer`, `react-component-reviewer` (ADR-149) |

Specialist on-demand (not standard roster -- situational trigger only):

- `release-readiness-reviewer` for release go/no-go checks at release boundaries
- `ground-truth-designer` for semantic-search ground-truth design/review work
- `subagent-architect` for sub-agent definition design/migration work
- `onboarding-reviewer` for onboarding-path audits (accuracy, efficacy, readability, consistency, stale info, and gap detection)
- `mcp-reviewer` for MCP protocol compliance, tool/resource/prompt definition validation, or transport/session pattern checks
- `elasticsearch-reviewer` for Elasticsearch mappings, queries, analysers, synonyms, ELSER, RRF, reranking, ingest, evaluation, or Elastic Serverless capability assessments
- `clerk-reviewer` for Clerk middleware, token verification, OAuth proxy, PRM, `@clerk/mcp-tools`, or Clerk SDK usage assessments
- `sentry-reviewer` for Sentry SDK configuration, OpenTelemetry observability integration, trace/log correlation, telemetry redaction, MCP Insights, and release/source-map observability assessments
- `assumptions-reviewer` for plan-level proportionality, assumption validity, blocking legitimacy, and simplification assessments — invoke when plans are marked decision-complete, propose 3+ agents, or assert blocking relationships

## Worked Examples

**Auth/OAuth/secrets change**: Invoke `code-reviewer` + `security-reviewer` immediately. If the change is also structural (new middleware, route reorganisation), add the relevant architecture reviewer(s).

**Architecture refactor**: Invoke `code-reviewer` + relevant architecture reviewer(s) immediately. Add `type-reviewer` if generics or schema flow are affected. Add `docs-adr-reviewer` if boundaries or ADRs change.

**Test-only change**: Invoke `code-reviewer` + `test-reviewer` immediately.

**Docs/ADR update**: Invoke `code-reviewer` + `docs-adr-reviewer` immediately.

**Onboarding docs/path update**: Invoke `code-reviewer` + `docs-adr-reviewer` immediately. Add `onboarding-reviewer` when the change affects onboarding journeys (human and/or AI), `start-right` discoverability, or ADR progressive disclosure.

**Release go/no-go**: Invoke `release-readiness-reviewer` (on-demand, situational trigger).

**Elasticsearch/search change**: Invoke `code-reviewer` + `elasticsearch-reviewer` immediately. Add `type-reviewer` if schema or mapping types are affected.

**Clerk/OAuth change**: Invoke `code-reviewer` + `clerk-reviewer` immediately. Add `security-reviewer` if the change has exploitability implications. Add `mcp-reviewer` if MCP auth spec compliance is in question.

**MCP protocol/tool/Apps change**: Invoke `code-reviewer` + `mcp-reviewer` immediately. Add `security-reviewer` if the MCP auth model is affected. Add `clerk-reviewer` if Clerk integration with MCP auth is in question. Add the relevant architecture reviewer(s) if MCP tool layering or transport boundaries change. For active MCP planning or implementation support, use the `mcp-expert` skill.

**Sentry/OTel change**: Invoke `code-reviewer` + `sentry-reviewer` immediately. Add `security-reviewer` if redaction, secrets, or PII boundaries change. Add `mcp-reviewer` if MCP wrapping or Insights could affect protocol behaviour.

**UI/Frontend change**: Invoke `code-reviewer` + relevant UI/Frontend cluster specialist(s) immediately. For MCP App views, add `mcp-reviewer` (owns `_meta.ui*`, resource registration, CSP, host bridge). UI specialists own DOM, accessibility, tokens, and React structure *inside* the view.

**Plan finalisation**: Invoke `assumptions-reviewer` when a plan is marked decision-complete or ready for execution. Also invoke when a plan proposes 3+ new agents, asserts blocking relationships, or commits to technology choices before research phases complete. For active assumption auditing during planning, use the `assumptions-expert` skill.

## Coverage Tracking

Before marking the work complete, record:

- which required specialists were invoked
- which specialists were not needed and why
- which reviewers ran `focused` versus `deep`
- whether any delegated review result still needs reintegration
- whether each new capability has an observability loop across each
  applicable axis (engineering, product, usability, accessibility,
  security) per [ADR-162](../../docs/architecture/architectural-decisions/162-observability-first.md).
  Omission is explicit and justified, not incidental.

## Invocation

Invoke each specialist as a read-only sub-agent, giving it specific context about what changed and what to focus on.

## Reporting Requirement

- Report which required specialists were invoked.
- For any not invoked, explicitly state `N/A` with justification.
- Do not claim "comprehensive review" if required specialists were skipped without rationale.
- Reviewer findings are implementation work by default: implement all findings unless explicitly rejected as incorrect, with rationale recorded in the session output.
- Integrate reviewer dispositions before landing the artefact under review; post-landing amendments need a fresh review loop and leave wrong doctrine live in the interim.
- Do not mark the change complete or proceed to merge until every finding is either implemented or explicitly rejected as incorrect with written rationale; triage is not deferral (`owner-triaged` means resolved or explicitly rejected with rationale, never backlog-only deferral).
