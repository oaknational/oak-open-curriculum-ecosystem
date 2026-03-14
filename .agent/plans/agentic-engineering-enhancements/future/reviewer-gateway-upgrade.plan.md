# Reviewer Gateway Upgrade — Strategic Plan

**Status**: NOT STARTED
**Domain**: Agentic Engineering Enhancements

## Problem and Intent

`code-reviewer` currently serves as the gateway agent — it triages which
specialist reviewers to invoke. But with the growing specialist roster (now
17+ reviewers across code quality, architecture, type safety, testing, security,
docs, config, onboarding, Elasticsearch, Clerk, and planned Sentry, MCP, Express,
OOCE, Planning, TDD, DevX specialists), the gateway's role has outgrown its name
and its current scope.

The gateway should be a **Reviewer Gateway** — its primary job is triage and
orchestration, not code quality review. Code quality assessment is one of its
capabilities, but it is no longer the defining one.

## What Changes

### Identity

- **Current**: `code-reviewer` — a code quality reviewer that also triages
- **Proposed**: Reviewer Gateway agent — a triage and orchestration agent that
  also does baseline code quality assessment

The exact name will be decided as part of the Agent Classification Taxonomy
work (ADR-135). Candidates: `review-gateway`, `gateway`, `triage`.

### Scope Expansion

The gateway currently:

1. Performs code quality review
2. Triages which specialists to invoke (via the Quick Triage checklist)
3. Flags when specialists are missing

The gateway should additionally:

4. **Select review depth** — for each specialist it recommends, indicate whether
   a deep or focused review is appropriate (per WS6 of the taxonomy plan)
5. **Recommend review timing** — immediate, design-pressure checkpoint,
   before-merge, or situational (the timing tiers already exist but are
   under-utilised)
6. **Track review coverage** — maintain awareness of which specialists have
   been invoked during a session and flag gaps before merge
7. **Handle the expanded specialist roster** — the triage checklist needs to
   scale beyond 8 questions to cover 20+ specialists without becoming unwieldy

### Tier-Aware Orchestration

The gateway is the orchestrator for the three-tier agent model (see taxonomy
plan). It must:

1. **Route to the right tier**: sentinels for known-rule checks, deep
   specialists for reasoning tasks
2. **Invoke fast agents in parallel**: sentinels and scanners are cheap and
   independent — run them concurrently
3. **Act on escalation recommendations**: when a sentinel reports "ESCALATION
   RECOMMENDED: security-reviewer", the gateway invokes the deep specialist
4. **Select depth for dual-tier agents**: type-reviewer as sentinel (find
   assertions) vs deep (trace type flow) — the gateway decides based on WS6
   depth selection guidance

### Cluster Model

Clusters are an **organisational grouping**, not an invocation unit. They help
the gateway think in categories rather than a flat list of 25 agents. But the
invocation granularity differs by cluster type:

**Sweep clusters** — invoke the full cluster by default. Members are cheap
(sentinel tier), independent, and collectively provide baseline coverage.
Running all is cheaper than deciding which to skip.

| Cluster | Members | Invocation | Rationale |
|---------|---------|-----------|-----------|
| **Quality sweep** | type, test, config | All, in parallel, sentinel tier | Fast, cheap, independent — the cost of running all three is less than the cost of the gateway reasoning about which to skip |

**Signal-routed clusters** — the gateway selects specific members based on
change signals. Running the full cluster would be wasteful (deep tier) or
nonsensical (a Clerk change doesn't need ES review).

| Cluster | Members | Invocation | Selection signal |
|---------|---------|-----------|-----------------|
| **Architecture** | fred, barney, betty, wilma | Gateway picks 1–2 based on concern | Boundary change → barney; ADR compliance → fred; coupling risk → betty; resilience → wilma |
| **Domain** | Clerk, ES, Sentry, MCP, Express | Gateway picks by technology signal | Auth/OAuth → Clerk; search/mappings → ES; transport/protocol → MCP; etc. |
| **Practice** | planning, TDD, DevX, onboarding, docs-adr | Gateway picks by change type | Agent artefacts → planning; test changes → TDD; CLI/SDK → DevX; onboarding paths → onboarding; ADR/docs → docs-adr |

**The decision is always the gateway's.** Clusters don't have coordinators —
they're a mental model that makes the gateway's triage checklist manageable.
The gateway reads the change profile, identifies the cluster, then selects
the specific members within it.

For architecture specifically, the existing pattern works well: code-reviewer
(soon: gateway) already recommends specific architecture reviewers based on
whether the concern is boundaries, ADR compliance, coupling, or resilience.
That pattern generalises to all signal-routed clusters.

### Triage Scalability

With 20+ specialists, a flat list of "Does this touch X? -> specialist-Y"
questions becomes unwieldy. The gateway should use a layered triage:

**Layer 1 — Change Category** (what kind of change is this?):

- Code change (logic, types, tests)
- Infrastructure change (config, CI, deployment)
- Documentation change (docs, ADRs, onboarding)
- Agent/practice change (templates, rules, plans)

**Layer 2 — Domain Signal** (within the category, what domain is affected?):

- Auth/OAuth/Clerk → clerk specialist, security specialist
- Elasticsearch/search → elasticsearch specialist
- MCP protocol/transport → mcp specialist
- Express/HTTP/middleware → express specialist (when created)
- Internal packages/composition → ooce specialist (when created)
- etc.

**Layer 3 — Cross-Cutting Concerns** (always check regardless of category):

- Type safety pressure → type specialist (sentinel or deep depending on signal)
- Architecture boundary changes → architecture cluster
- Documentation drift → docs-adr specialist
- Test coverage/TDD → test specialist + TDD specialist

**Layer 4 — Escalation** (post-review):

- Process escalation recommendations from sentinel reports
- Invoke deep specialists where sentinels flagged concerns beyond their scope

### Platform Invocation Constraint

All orchestration goes through the primary session agent (or a general-purpose
sub-agent on Claude Code). Reviewer sub-agents are leaf nodes on ALL platforms:

| Platform | How gateway invokes specialists |
|----------|-------------------------------|
| Claude Code | `Agent` tool with `subagent_type` |
| Cursor | `Task` tool with `subagent_type` + `readonly: true` |
| Gemini CLI | User dispatches commands sequentially |
| Codex | Primary agent reads skill guidance, executes itself |

This means: sentinels that want to escalate CANNOT invoke deep specialists
directly. They report "ESCALATION RECOMMENDED: <name> — <reason>" and the
gateway acts on it. This is a hard architectural constraint, not a design
choice.

### Directive Updates

`.agent/directives/invoke-code-reviewers.md` should be renamed and restructured
to reflect the gateway's broader role. The current content is good but needs:

1. Rename to `invoke-reviewers.md` (or equivalent — decided during taxonomy work)
2. Replace the flat triage list with the layered triage model
3. Add depth selection guidance (deep vs focused per specialist)
4. Add review coverage tracking expectations
5. Scale the worked examples section for the full specialist roster

### Rule Updates

`.agent/rules/invoke-code-reviewers.md` and its platform adapters
(`.claude/rules/invoke-code-reviewers.md`, `.cursor/rules/invoke-code-reviewers.mdc`)
should be renamed to match the directive rename.

## Relationship to Other Plans

- **Agent Classification Taxonomy (ADR-135)**: The gateway rename is part of
  the broader rename in WS2. This plan provides the *design intent* for the
  gateway's expanded role; the taxonomy plan provides the *execution mechanics*
  of the rename itself. The taxonomy plan now includes the three-tier model
  and fast-agent generalization that this gateway consumes.
- **Review Depth Dimension (WS6)**: The gateway is the primary consumer of
  depth selection guidance — it decides which tier each specialist review
  should run at.
- **Practice Core Integration (WS7)**: The gateway's triage model must be
  reflected in Practice Core documentation.
- **Adapter Generation**: If adapters are generated from a manifest, the
  gateway's cluster definitions could inform the manifest structure (clusters
  as a manifest-level grouping).

## Deliverables

This plan does NOT create new files from scratch — it upgrades existing ones:

1. Redesign the triage model in `.agent/directives/invoke-code-reviewers.md`
   (layered triage, depth selection, coverage tracking)
2. Expand the worked examples for the full specialist roster
3. Update the gateway agent template (currently `code-reviewer`) to reflect
   the broader triage and orchestration role
4. Rename directive, rule, and platform adapters (coordinated with taxonomy
   plan WS2/WS5)
5. Validation: all quality gates pass, no stale references

## Sequencing

- This plan should execute **after or alongside** the Agent Classification
  Taxonomy plan — they share the rename mechanics
- The triage model redesign can be drafted independently and merged during
  the taxonomy rename
- The depth selection integration depends on WS6 (review depth dimension)
  being designed first

## Promotion Trigger

This plan promotes to `current/` when:

1. The Agent Classification Taxonomy plan is promoted to `current/` (they
   share execution mechanics)
2. OR: the specialist roster reaches a size where the current flat triage
   model is demonstrably insufficient (arguably already the case)
