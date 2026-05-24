# Invoke Specialist Experts

After non-trivial changes, invoke `code-expert` plus all specialist experts
required by the change profile. Until the taxonomy rename lands,
`code-expert` remains the current gateway reviewer.

Documentation drift (`docs-adr-expert`) applies whenever behaviour or
architecture changes, even if no docs are explicitly edited.

AGENT.md intentionally points here rather than carrying reviewer rosters or
timing detail. Reviewers can review intentions before code exists, and long or
multi-phase work should re-invoke the relevant specialist at natural phase
boundaries so feedback shapes the work while it is still live.

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

1. Auth, secrets, PII, or OAuth -> `security-expert`
2. Clerk middleware, token verification, OAuth proxy, PRM,
   `@clerk/mcp-tools`, or Clerk SDK usage -> `clerk-expert`
3. MCP protocol, tool/resource/prompt definitions, MCP Apps Extension
   widgets, transport/session patterns, or MCP Apps migration work ->
   `mcp-expert`
4. Sentry SDK usage, OpenTelemetry trace/log correlation, telemetry
   redaction, MCP Insights, or Sentry env/config wiring ->
   `sentry-expert`
5. Elasticsearch mappings, queries, analysers, synonyms, ELSER, RRF,
   reranking, ingest, or Elastic Serverless capabilities ->
   `elasticsearch-expert`
6. Plans marked decision-complete, 3+ agents, asserted blocking
   relationships, or technology commitments before research ->
   `assumptions-expert`
7. Onboarding flows, start-right entrypoints, or ADR discoverability ->
   `onboarding-expert`
8. Rendered UI, CSS, design tokens, or React components -> UI/Frontend
   cluster: `accessibility-expert`, `design-system-expert`,
   `react-component-expert`

### Layer 3 — Cross-Cutting Concerns

Always check these regardless of category:

1. Module boundaries, imports, or public APIs -> architecture expert(s)
2. Test additions, modifications, or TDD concerns -> `test-expert`
3. Type complexity, generics, or schema flow -> `type-expert`
4. Tooling configs or quality gates -> `config-expert`
5. README, TSDoc, ADR, or docs drift -> `docs-adr-expert`

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

## Reviewer Dispatch vs Peer Collaboration

Reviewer dispatch is a fork-blocking-rejoin channel inside one agent's
session. It does not replace peer collaboration state. Agents doing
non-trivial overlapping work still use the shared communication log,
active-claims registry, and WS3A decision threads per
`agent-collaboration.md`; reviewers do not register active claims unless
the owner explicitly gives them implementation ownership.

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
| Immediately after change | After each non-trivial code change | `code-expert` plus all specialists matching the change profile |
| Design-pressure checkpoint | Before implementing high-risk type/boundary changes | Relevant specialist(s) to review intended approach (for example `type-expert` before touching external-signal parsing) |
| Before merge | Before the branch merges | Any applicable specialists not yet invoked during implementation |
| Situational trigger | When the specific context arises | On-demand agents (see below) -- not tied to every change |

## Required Reviewer Matrix

Always invoke:

- `code-expert` (gateway — also responsible for flagging when specialists are missing, recommending review depth, and checking coverage)

Invoke additional specialists when applicable:

| Change Category | Required Specialist(s) |
|---|---|
| Structural/boundary changes | `architecture-expert-barney` and/or `architecture-expert-fred` and/or `architecture-expert-betty` and/or `architecture-expert-wilma` |
| Test changes or TDD concerns | `test-expert` |
| Type-system complexity or assertion pressure | `type-expert` |
| Tooling/config quality-gate changes | `config-expert` |
| Auth/authz, OAuth, secrets, PII, injection, security-sensitive logic | `security-expert` |
| README/TSDoc/ADR/docs updates or expected documentation drift | `docs-adr-expert` |
| Rendered UI, CSS, design tokens, React components | UI/Frontend cluster: `accessibility-expert`, `design-system-expert`, `react-component-expert` (ADR-149) |

Specialist on-demand (not standard roster -- situational trigger only):

- `release-readiness-expert` for release go/no-go checks at release boundaries
- `ground-truth-designer` for semantic-search ground-truth design/review work
- `subagent-architect` for sub-agent definition design/migration work
- `onboarding-expert` for onboarding-path audits (accuracy, efficacy, readability, consistency, stale info, and gap detection)
- `mcp-expert` for MCP protocol compliance, tool/resource/prompt definition validation, or transport/session pattern checks
- `elasticsearch-expert` for Elasticsearch mappings, queries, analysers, synonyms, ELSER, RRF, reranking, ingest, evaluation, or Elastic Serverless capability assessments
- `clerk-expert` for Clerk middleware, token verification, OAuth proxy, PRM, `@clerk/mcp-tools`, or Clerk SDK usage assessments
- `sentry-expert` for Sentry SDK configuration, OpenTelemetry observability integration, trace/log correlation, telemetry redaction, MCP Insights, and release/source-map observability assessments
- `assumptions-expert` for plan-level proportionality, assumption validity, blocking legitimacy, and simplification assessments — invoke when plans are marked decision-complete, propose 3+ agents, or assert blocking relationships

## Worked Examples

**Auth/OAuth/secrets change**: Invoke `code-expert` + `security-expert` immediately. If the change is also structural (new middleware, route reorganisation), add the relevant architecture expert(s).

**Architecture refactor**: Invoke `code-expert` + relevant architecture expert(s) immediately. Add `type-expert` if generics or schema flow are affected. Add `docs-adr-expert` if boundaries or ADRs change.

**Test-only change**: Invoke `code-expert` + `test-expert` immediately.

**Docs/ADR update**: Invoke `code-expert` + `docs-adr-expert` immediately.

**Onboarding docs/path update**: Invoke `code-expert` + `docs-adr-expert` immediately. Add `onboarding-expert` when the change affects onboarding journeys (human and/or AI), `start-right` discoverability, or ADR progressive disclosure.

**Significant documentation or Practice change**: Per
[`invoke-doc-and-onboarding-experts-on-significant-changes`](../../rules/invoke-doc-and-onboarding-experts-on-significant-changes.md),
significant doc/Practice changes always pair `docs-adr-expert` with `onboarding-expert`
(both reviewers, in parallel) — neither alone covers the failure surface the other catches.
"Significant" includes: any new ADR/PDR/governance doc/rule; any rename or restructure
across permanent doctrine surfaces; any change to onboarding entry points
(`README.md`, `CONTRIBUTING.md`, platform memory files, `.agent/practice-index.md`).

**Release go/no-go**: Invoke `release-readiness-expert` (on-demand, situational trigger).

**Elasticsearch/search change**: Invoke `code-expert` + `elasticsearch-expert` immediately. Add `type-expert` if schema or mapping types are affected.

**Clerk/OAuth change**: Invoke `code-expert` + `clerk-expert` immediately. Add `security-expert` if the change has exploitability implications. Add `mcp-expert` if MCP auth spec compliance is in question.

**MCP protocol/tool/Apps change**: Invoke `code-expert` + `mcp-expert` immediately. Add `security-expert` if the MCP auth model is affected. Add `clerk-expert` if Clerk integration with MCP auth is in question. Add the relevant architecture expert(s) if MCP tool layering or transport boundaries change. For active MCP planning or implementation support, use the `mcp-expert` skill.

**Sentry/OTel change**: Invoke `code-expert` + `sentry-expert` immediately. Add `security-expert` if redaction, secrets, or PII boundaries change. Add `mcp-expert` if MCP wrapping or Insights could affect protocol behaviour.

**UI/Frontend change**: Invoke `code-expert` + relevant UI/Frontend cluster specialist(s) immediately. For MCP App views, add `mcp-expert` (owns `_meta.ui*`, resource registration, CSP, host bridge). UI specialists own DOM, accessibility, tokens, and React structure *inside* the view.

**Plan finalisation**: Invoke `assumptions-expert` when a plan is marked decision-complete or ready for execution. Also invoke when a plan proposes 3+ new agents, asserts blocking relationships, or commits to technology choices before research phases complete. For active assumption auditing during planning, use the `assumptions-expert` skill.

## Coverage Tracking

Before marking the work complete, record:

- which required specialists were invoked
- which specialists were not needed and why
- which reviewers ran `focused` versus `deep`
- whether any delegated review result still needs reintegration
- whether each new capability has an observability loop across each
  applicable axis (engineering, product, usability, accessibility,
  security) per [ADR-162](../../../docs/architecture/architectural-decisions/162-observability-first.md).
  Omission is explicit and justified, not incidental.

## Invocation

Invoke each specialist as a read-only sub-agent, giving it specific context about what changed and what to focus on.

### Codex Reviewer Adapter Preflight

When running reviewer workflows in Codex, do not assume the runtime has
automatically loaded the repo-local reviewer adapter. Before each reviewer
invocation:

1. Resolve the reviewer with `pnpm agent-tools:codex-reviewer-resolve <name>`.
2. Open the reported `.codex/agents/*.toml` adapter and every canonical
   `.agent` file it references.
3. Record those source paths in the review report so the review remains
   auditable after session compression.

If resolution fails, treat that as a blocking configuration defect and fix it
before relying on the review.

## Reporting Requirement

- Report which required specialists were invoked.
- For any not invoked, explicitly state `N/A` with justification.
- Do not claim "comprehensive review" if required specialists were skipped without rationale.
- Reviewer findings require explicit disposition. Accepted findings are
  implementation work; rejected findings need written rationale; non-blocking
  deferrals need deferral-honesty evidence and an owner-visible next action.
- Integrate reviewer dispositions before landing the artefact under review
  when the finding is blocking or when the finding affects live doctrine.
  Post-landing amendments need a fresh review loop and leave wrong doctrine
  live in the interim.
- Do not mark the change complete or proceed to merge with unresolved
  blocking findings, hard gate failures, or rule failures. Non-blocking
  findings do not automatically block closure, but they still need a written
  disposition; triage is not silent deferral (`owner-triaged` means resolved,
  explicitly rejected with rationale, or deliberately deferred with
  owner-visible evidence).
