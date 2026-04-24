# Agent Classification Taxonomy — Strategic Plan

**Status**: NOT STARTED
**ADR**: [ADR-135](../../../../docs/architecture/architectural-decisions/135-agent-classification-taxonomy.md)
**Domain**: Agentic Engineering Enhancements
**Branch**: Feature branch (to be created)

## Problem and Intent

The agent roster lacks classification metadata, uses `-reviewer` naming that
constrains agents to a single operational mode, and has no support for
specialists (fast, narrow-scope agent-to-agent tasks) or process executors
(workflow-driving agents). ADR-135 defines the taxonomy; this plan executes it.

This plan already separates several dimensions:

- agent classification
- operational modes (`explore`, `advise`, `review`)
- operational tier (gateway / fast / deep specialist)
- review depth (deep / focused)

But one important dimension still remains mostly implicit in surrounding docs:
**remit breadth** (`broad-remit` vs `narrow-remit`). That breadth must not be
conflated with review depth. A narrow-remit specialist may still need a deep
review.

## Coordination With Current Expert-Expansion Plans

This taxonomy work should execute after the current coordination lanes have
settled enough to avoid renaming unstable surfaces:

- [practice-and-process-structural-improvements.plan.md](../current/practice-and-process-structural-improvements.plan.md)
  decides where collaboration, planning discipline, and portability doctrine
  live permanently.
- [planning-specialist-capability.plan.md](../current/planning-specialist-capability.plan.md)
  owns the Planning expert triplet; the taxonomy rename must treat it as an
  existing capability, not recreate it.
- [agent-infrastructure-portability-remediation.plan.md](../current/agent-infrastructure-portability-remediation.plan.md)
  hardens adapter parity and validation before the taxonomy plan rewrites
  names across platforms.
- [adapter-generation.plan.md](adapter-generation.plan.md) remains the preferred
  optimisation before any large rename, because generated adapters turn the
  multi-platform rename into a manifest update plus regeneration.

## Platform Sub-Agent Invocation Capabilities

Critical constraint for the tier model and orchestration design:

| Platform | Primary → Sub-agent | Sub-agent → Sub-agent | Mechanism |
|----------|--------------------|-----------------------|-----------|
| Claude Code | Yes | **Only general-purpose type** (has Agent tool). Reviewer types are leaf nodes. | `Agent` tool |
| Cursor | Yes | Unclear / not documented for sub-agents | `Task` tool with `subagent_type` + `readonly: true` |
| Gemini CLI | Manual dispatch only | No | Commands are user-dispatched, not programmatically invoked |
| Codex | No (skills are knowledge) | No | Primary agent reads skill guidance, executes itself |

**Architectural implication**: The canonical orchestration model MUST route
all specialist invocation through the primary session agent (or a general-
purpose orchestrator sub-agent on Claude Code). Reviewer sub-agents are leaf
nodes on all platforms — they read, analyse, report. They CANNOT invoke other
sub-agents.

**Escalation pattern**: When a sentinel/reviewer identifies a concern outside
its scope, it reports "ESCALATION RECOMMENDED: <specialist-name> — <reason>"
in its output. The primary agent acts on the recommendation.

## Agent Tier Model

The agent roster uses a three-tier model. Tiers describe the agent's default
operational weight, not a rigid hierarchy.

### Tier 1: Gateway

One agent. Always invoked for non-trivial changes. Triages and routes to
other tiers. Runs at focused/fast tier by default (triage is pattern matching).

### Tier 2: Fast Agents

Fast agents are a **generic pattern** — well-defined, narrow-scope agents
with clear DoD, acceptance criteria, and structured reporting templates. They
run at the focused/fast model tier by default.

**Sentinel** is one application of the fast-agent pattern (fast review against
known rules). Other applications include:

| Fast Agent Type | Purpose | Example |
|----------------|---------|---------|
| **Sentinel** | Fast review against known checklists/rules | config-reviewer, type-assertion scan, naming check |
| **Scanner** | Fast codebase scan for a specific pattern | "find all `process.env` direct accesses", "find all `as` assertions" |
| **Validator** | Fast schema/contract validation | "does this plan follow the template?", "are all exports present?" |
| **Formatter** | Fast format/lint compliance check | markdownlint pass, import ordering |

**Common properties of all fast agents:**

- Well-defined, narrow scope
- Clear Definition of Done and Acceptance Criteria
- Structured reporting template (pass/fail, findings list, escalation recommendations)
- Run at focused/fast model tier by default
- Deterministic output (same input → same findings)
- No live-docs consultation needed
- Can be invoked in parallel with other fast agents
- Are leaf nodes — they report, they do not orchestrate

### Tier 3: Deep Specialists

Deep specialists reason against live documentation, assess trade-offs, and
produce findings with evidence chains. They run at the high-reasoning model
tier by default.

| Deep Specialist Type | Purpose | Examples |
|---------------------|---------|----------|
| **Domain expert** | Reason about correct usage against live official docs | Clerk, ES, Sentry, MCP, Express, cyber security, web/API security, privacy, web/API GDPR |
| **Architecture assessor** | Reason about structural trade-offs | fred, barney, betty, wilma |
| **Security analyst** | Assess exploitability and threat models | security-reviewer |
| **Ecosystem expert** | Reason about internal contract correctness | OOCE |

**Common properties of all deep specialists:**

- Broad or nuanced scope requiring reasoning
- Consult live external documentation (or comprehensive internal docs)
- Produce findings with evidence chains and citations
- Run at high-reasoning model tier by default
- May recommend escalation to other deep specialists
- Are leaf nodes — they report, they do not orchestrate

### Dual-Tier Agents

Some agents operate at either tier depending on what they're asked:

| Agent | Sentinel Mode | Deep Mode |
|-------|--------------|-----------|
| type-reviewer | Find assertions (`as`, `!`, `any`) | Trace type flow from schema to app layer |
| docs-adr-reviewer | Detect documentation drift | Assess ADR accuracy and completeness |
| DevX | Check naming, --help, progress indicators | Assess API surface design quality |
| test-reviewer | Check structure, naming, mock patterns | Assess test strategy and coverage adequacy |
| TDD specialist | Check test-level selection | Design multi-level test strategy |
| planning specialist | Check plan template compliance | Assess plan fitness and scope |

For dual-tier agents, the gateway selects the tier based on WS6 depth
selection guidance.

### Remit Breadth Is a Separate Axis

The taxonomy already models agent type, mode, tier, and review depth. It
should also remain compatible with a separate remit-breadth axis:

| Breadth | Meaning | Example |
|--------|---------|---------|
| **Broad-remit** | Covers a wide domain and its internal trade-offs | cyber security, privacy |
| **Narrow-remit** | Covers a constrained boundary or sub-domain exhaustively | web/API security, web/API GDPR |

This breadth axis is distinct from review depth:

- a **broad-remit** agent may run a focused review
- a **narrow-remit** agent may run a deep review

It is also distinct from mode:

- the same agent family may review, advise, or explore depending on invocation

It is also distinct from ADR-135's use of **broad** and **deep** as
domain-expert sub-types. In ADR-135, that pair describes **knowledge
coverage/concentration**. In this plan, **deep vs focused** describes
**engagement depth / reasoning tier**. Those are different dimensions and
should not be conflated.

## Domain Boundaries

### In scope

1. Add `classification` frontmatter to all agent templates and platform wrappers
2. Full rename of all agents (drop `-reviewer` suffix, align with classification model)
3. Create mode components (`explore.md`, `advise.md`, `review.md`)
4. Create specialist input contract component
5. Create fast-agent reporting template component (structured pass/fail + escalation)
6. Create the Practice domain trio (`practice`, `practice-core`, `practice-applied`)
7. Update validation script (`subagents:check`) for new fields and naming
8. Update all documentation references (ADRs, directives, rules, README files, invoke guidance)
9. Platform adapter updates across all four platforms (Cursor, Claude Code, Gemini CLI, Codex)
10. Update portability check for new naming
11. Define the escalation-recommendation contract (how leaf agents signal "invoke X")

### Non-goals

- Creating specialist agents (the contract is defined; actual specialists are future work)
- Creating additional process executor agents beyond `subagent-architect` reclassification
- Implementing runtime agent-to-agent invocation beyond the leaf-node-with-escalation model
- Changing template content beyond what is needed for classification and rename alignment
- Implementing the operational tooling layer (ADR-137) — that is a separate concern executed per-domain

## Workstreams

### WS1: Foundation — Components and Contracts

Create the new artefacts that the classification model requires.

- [ ] Create `.agent/sub-agents/components/modes/explore.md`
- [ ] Create `.agent/sub-agents/components/modes/advise.md`
- [ ] Create `.agent/sub-agents/components/modes/review.md`
- [ ] Create `.agent/sub-agents/components/contracts/specialist-input.md`
- [ ] Update `.agent/sub-agents/README.md` to document modes and contracts

### WS2: Classification and Rename — Canonical Layer

Add classification metadata and rename all canonical templates.

- [ ] Add `classification` field to all existing templates in `.agent/sub-agents/templates/` (including `clerk-reviewer.md` added 2026-03-13, and `sentry-reviewer.md` when created)
- [ ] Rename template files (e.g. `code-reviewer.md` → `code-quality.md`, `architecture-reviewer.md` → `architecture.md`, `clerk-reviewer.md` → `clerk.md`, `sentry-reviewer.md` → `sentry.md`)
- [ ] Update template cross-references (delegation triggers, boundary sections, "when to recommend other reviews" tables)
- [ ] Update persona components to reference new template names
- [ ] Create `practice.md` template (broad, gateway)
- [ ] Create `practice-core.md` template (deep, Practice Core lifecycle)
- [ ] Create `practice-applied.md` template (deep, this repo's operationalisation)

### WS3: Platform Adapters — All Four Platforms

Rename and reclassify wrappers across Cursor, Claude Code, Gemini CLI, and Codex.

- [ ] Cursor: rename `.cursor/agents/*.md` wrappers, add `classification` to frontmatter
- [ ] Claude Code: rename `.claude/agents/*.md` wrappers, add `classification` to frontmatter, update `model` per policy
- [ ] Gemini CLI: rename `.gemini/commands/review-*.toml` wrappers
- [ ] Codex: rename `.agents/skills/*/SKILL.md` wrappers
- [ ] Create platform adapters for three new Practice agents on all platforms
- [ ] Design platform-specific mode invocation patterns per adapter layer

### WS4: Validation and Quality Gates

Update automated checks to enforce the new model.

- [ ] Update `scripts/validate-subagents.mjs` to require `classification` field
- [ ] Add validation: specialist agents must reference specialist input contract
- [ ] Add validation: no `-reviewer` suffix in agent names
- [ ] Update `scripts/validate-portability.mjs` for new names
- [ ] Run `pnpm subagents:check` and `pnpm portability:check` — all green

### WS5: Documentation Propagation

Update all references to old agent names across the entire repo.

- [ ] Update `.agent/directives/AGENT.md` — agent roster, sub-agent section
- [ ] Update `.agent/memory/executive/invoke-code-reviewers.md` — rename to `invoke-agents.md` or equivalent, update all agent references
- [ ] Update all `.agent/rules/*.md` that reference agent names (e.g. `invoke-code-reviewers.md`, `invoke-elasticsearch-reviewer.md`, `invoke-clerk-reviewer.md`, `invoke-sentry-reviewer.md`)
- [ ] Update all `.claude/rules/*.md` and `.cursor/rules/*.mdc` that reference agent names
- [ ] Update ADRs that reference agent names by old names (ADR-114, ADR-119, ADR-125, ADR-129, ADR-131, ADR-137)
- [ ] Update `.agent/sub-agents/components/architecture/reviewer-team.md`
- [ ] Update `.agent/practice-core/` files if they reference agent names
- [ ] Update `docs/governance/development-practice.md` if it references agent names
- [ ] Update any plan files that reference agent names
- [ ] Grep for all remaining `-reviewer` references and update

### WS6: Review Depth Dimension

Define and enforce two review depth tiers across all specialists.

**Deep reviews** (high-reasoning tier — e.g. Opus on Claude Code, o3/o4-mini-high on Codex, Gemini 2.5 Pro on Gemini CLI):

- Fetch and reason against live official documentation
- Assess nuanced architectural trade-offs
- Produce findings with evidence chains and citations
- Use when: first integration of a technology, architectural decisions, cross-boundary changes, unfamiliar patterns, security-sensitive flows, anything where "is this correct?" requires reasoning beyond pattern matching

**Focused reviews** (fast-pattern tier — e.g. Haiku/Sonnet on Claude Code, o4-mini on Codex, Gemini 2.5 Flash on Gemini CLI):

- Apply known checklists and pass/fail rules
- Pattern-match against established conventions
- Fast turnaround, narrow scope, deterministic output
- Use when: routine changes within established patterns, naming/formatting compliance, dependency direction checks, "does this follow the rule we already know?"

Note: Platform adapters select the concrete model per tier. The canonical template specifies the **tier** (`deep` or `focused`), not the model. Each platform adapter maps tiers to its available models. Cursor has cross-vendor model selection — its adapter should document which models map to which tier.

**Explicit selection guidance** (must be documented in Practice Core and every reviewer template):

| Signal | Depth | Rationale |
|--------|-------|-----------|
| First use of a technology in this repo | Deep | No established patterns to match against |
| Change touches auth, OAuth, token handling | Deep | Security-sensitive, needs reasoning |
| Routine file following established pattern | Focused | Pattern is known, checklist suffices |
| Architecture boundary or dependency direction | Deep | Trade-off reasoning required |
| Lint-level or naming convention check | Focused | Deterministic pass/fail |
| Live docs may have changed since last check | Deep | Stale knowledge risk |
| Reviewer is being invoked by another reviewer | Focused (default) | Avoid cascading expensive calls |

- [ ] Add `review_depth` field to agent template frontmatter (`deep` | `focused` | `both`)
- [ ] Document depth selection criteria in each reviewer template's "When Invoked" section
- [ ] Add depth selection guidance to `.agent/sub-agents/README.md`
- [ ] Update `scripts/validate-subagents.mjs` to require `review_depth` field
- [ ] Add depth-tier examples to Practice Core documentation

### WS7: Practice Core Integration

All specialist improvements from this taxonomy plan and the broader domain specialist roster must be integrated into Practice Core documentation. This is not optional follow-up — it is a mandatory workstream.

- [ ] Update `.agent/practice-core/practice.md` with review depth dimension (deep vs focused)
- [ ] Update `.agent/practice-core/practice.md` with updated agent classification model
- [ ] Add specialist invocation guidance to Practice Core (when to invoke which specialist, at what depth)
- [ ] Ensure every new specialist triplet (created via sibling plans) includes a Practice Core propagation step
- [ ] Update Practice Core's "knowledge flow" section to reflect the full specialist roster
- [ ] Add a "Specialist Roster" reference section to Practice Core listing all domain specialists, their scope boundaries, and review depth default

## Dependencies and Sequencing

- **Adapter Generation plan should execute BEFORE this plan** — if adapters are
  manifest-driven, WS3 reduces from "manually rename 100 files" to "update
  manifest, regenerate". Strongly recommended prerequisite.
- WS1 (components) must complete before WS2 (templates reference new components)
- WS2 (canonical) must complete before WS3 (adapters reference canonical templates)
- WS3 (adapters) — if adapter generation plan is complete, this becomes
  "update manifest + regenerate" rather than manual file creation
- WS4 (validation) can run in parallel with WS3 but must validate after WS3 completes
- WS6 (review depth) can run in parallel with WS2–WS4 — it adds a new dimension, not rename-dependent
- WS7 (Practice Core) runs after WS2 and WS6 — needs final agent names and depth model
- WS5 (documentation) runs last — it sweeps all remaining references including WS6/WS7 additions

## Success Signals

1. `pnpm subagents:check` passes with classification validation enabled
2. `pnpm portability:check` passes with new names
3. Zero grep hits for `-reviewer` in agent-related files (templates, wrappers, components, rules, directives)
4. All four platform adapter directories have complete coverage for all agents including the three new Practice agents
5. All documentation references use new names — no stale references to old names anywhere in the repo
6. ADR-135 is referenced from the ADR index
7. Every reviewer template includes `review_depth` field and depth selection criteria in "When Invoked"
8. Practice Core documentation reflects the full specialist roster, review depth model, and invocation guidance

## Risks and Unknowns

| Risk | Mitigation |
|---|---|
| Large coordinated rename may introduce broken references | WS5 includes systematic grep sweep; validation scripts catch structural issues |
| Mode components are new and untested | Start minimal (output expectations only), iterate based on real usage |
| Practice trio agents need substantial template content | Design templates during promotion to `current/`; use existing practice-core files as must-read tier |
| Platform-specific mode invocation may vary significantly | Design patterns per platform during WS3; accept platform-specific differences per ADR-125 |
| Rename may conflict with in-progress work on other branches | Execute on a dedicated feature branch; coordinate merge timing |

## Promotion Trigger

This plan promotes to `current/` when:

1. ADR-135 is accepted (done)
2. No conflicting work is in progress on the agent artefact layer
3. The feature branch for the current work (`feat/es_index_update`) is merged or the work can be coordinated
