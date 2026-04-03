# Agentic Engineering Enhancements Roadmap

**Status**: ✅ Phase 0 complete; ES specialist ✅ complete; Sentry specialist 🔄 active; MCP specialist ✅ complete; continuity adoption 🔄 active; reviewer gateway ⏭️ queued; Codex parity ✅ complete; Practice convergence ✅ complete; Phase 1 ready to start
**Last Updated**: 2026-03-31
**Session Entry**: [start-right-quick.md](../../commands/start-right-quick.md)

---

## Purpose

This roadmap is the strategic phase sequence for the
`agentic-engineering-enhancements` collection. Execution detail lives in
`active/` plans with atomic tasks and deterministic validation.

Strategic source plans remain authoritative for intent/rationale; active plans
are authoritative for execution tasks.

Status token definitions are standardised in
[README.md](README.md#status-legend).

Authoritative active execution sources:

1. ~~phase-0-templates-and-components-foundation.md~~ (archived)
2. [phase-1-hallucination-guarding-execution.md](active/phase-1-hallucination-guarding-execution.md)
3. [phase-2-evidence-based-claims-execution.md](active/phase-2-evidence-based-claims-execution.md)
4. [phase-3-architectural-enforcement-execution.md](active/phase-3-architectural-enforcement-execution.md)
5. ~~phase-4-cross-agent-standardisation-execution.md~~ **Superseded** by Agent Artefact Portability plan (ADR-125) (archived)
6. [phase-5-mutation-testing-execution.md](active/phase-5-mutation-testing-execution.md)

Active adjacent execution sources:

1. ~~elasticsearch-specialist-capability.execution.plan.md~~ ✅ Complete (archived in `archive/completed/` for reference)
2. ~~codex-platform-parity.execution.plan.md~~ ✅ Complete (deleted)
3. [phase-0-baseline-metrics.plan.md](active/phase-0-baseline-metrics.plan.md) (HC-0: harness-concepts baseline)
4. Clerk specialist capability — ✅ Complete (no execution plan needed; single-session delivery)
5. [continuity-and-surprise-practice-adoption.plan.md](current/continuity-and-surprise-practice-adoption.plan.md) (CTY: continuity/session-handoff adoption)
6. ~~practice-convergence.plan.md~~ ✅ Complete (deleted; backup trees removed, all workstreams done)

---

## Explicit Goal 0

Create and maintain a well-structured `.agent/plans/templates/components`
ecosystem with useful, reusable templates that reduce plan drift and improve
execution quality.

---

## Documentation Synchronisation Requirement

No phase can be marked complete until documentation updates have been handled
for:

1. `docs/architecture/architectural-decisions/119-agentic-engineering-practice.md`
2. `.agent/practice-core/practice.md`
3. any additionally impacted ADRs, `/docs/` pages, or README files

Each phase must either:

- update impacted documents directly, or
- record an explicit no-change rationale in
  [documentation-sync-log.md](documentation-sync-log.md)

Before phase closure, apply the
[`jc-consolidate-docs` workflow](../../../.cursor/commands/jc-consolidate-docs.md)
to ensure no settled documentation remains trapped in plans/prompts.

---

## Milestone Context

This roadmap aligns to:

- **Milestone 2**: hallucination/evidence guards, architectural enforcement,
  cross-agent standardisation
- **Milestone 3**: mutation testing rollout and optimisation
- **Adjacent capability work**: Elasticsearch specialist (✅), Clerk specialist (✅), Sentry specialist (🔄), continuity adoption (🔄), MCP upgrade (📋), Express specialist (📋), Cyber security specialist (📋), Web/API security specialist (📋), Privacy specialist (📋), Web/API GDPR specialist (📋), Oak Open Curriculum Ecosystem specialist (📋), Planning specialist (📋), TDD specialist (📋), Developer experience specialist (📋), Repair workflow wording hazard detection (📋), Reviewer gateway upgrade (📋), Adapter generation (📋), specialist operational tooling layer (ADR-137, strategic)

See [high-level-plan.md](../high-level-plan.md) for cross-collection context.

---

## Execution Order

```text
Phase 0: Planning system and template hardening      ✅ COMPLETE
Phase 1: Hallucination guarding rollout              📋 PLANNED
Phase 2: Evidence-based claims rollout               📋 PLANNED
Phase 3: Architectural enforcement execution         📋 PLANNED
Phase 4: Cross-agent standardisation execution       ⛔ SUPERSEDED (ADR-125)
Phase 5: Mutation testing execution                  📋 PLANNED

Adjacent:
  ES:   Elasticsearch specialist capability          ✅ COMPLETE
  CLK:  Clerk specialist capability                  ✅ COMPLETE
  CX:   Codex platform parity                       ✅ COMPLETE
  HC-0: Harness concepts baseline metrics            📋 PLANNED
  CTY:  Continuity/session-handoff adoption          🔄 ACTIVE
  PC:   Practice convergence closeout                ✅ COMPLETE
  SNT:  Sentry specialist capability                 🔄 ACTIVE
  MCP+: MCP specialist upgrade (triplet + ext-apps)  ✅ COMPLETE
  EXP:  Express specialist capability                📋 PLANNED
  CYB:  Cyber security specialist capability         📋 PLANNED
  WAS:  Web/API security specialist capability       📋 PLANNED
  PRV:  Privacy specialist capability                📋 PLANNED
  WGD:  Web/API GDPR specialist capability           📋 PLANNED
  OOCE: Oak Open Curriculum Ecosystem specialist     📋 PLANNED
  PLN:  Planning specialist capability               📋 PLANNED
  TDD:  TDD specialist capability                    📋 PLANNED
  DVX:  Developer experience specialist              📋 PLANNED
  RWD:  Repair workflow wording hazard detection     📋 PLANNED
  GW:   Reviewer gateway upgrade                     ⏭️ QUEUED
  AGN:  Manifest-driven adapter generation           📋 PLANNED
  ACT:  Agent classification taxonomy                📋 STRATEGIC
  OPS:  Specialist operational tooling layer         📋 STRATEGIC (ADR-137)
```

---

## Phase Details

### Phase 0 — Planning System and Template Hardening

- Active plan: ~~phase-0-templates-and-components-foundation.md~~ (archived)
- Status: ✅ Complete (2026-02-24)
- Done when:
  - templates/components inventory is intentionally structured and documented
  - useful templates exist for feature, quality-fix, adoption, and roadmap work
  - this collection has roadmap + atomic active plans for all phases
  - documentation synchronisation contract and tracking log are present
- Dependencies: none

### Phase 1 — Hallucination Guarding Rollout

- Active plan:
  [phase-1-hallucination-guarding-execution.md](active/phase-1-hallucination-guarding-execution.md)
- Source strategy:
  [hallucination-and-evidence-guard-adoption.plan.md](current/hallucination-and-evidence-guard-adoption.plan.md)
- Done when:
  - non-trivial claim classes and verification contract are implemented in
    prompts/review workflow
  - pilot baseline is captured with evidence
  - documentation sync log records updates/no-change rationale for Phase 1
- Dependencies: Phase 0 complete

### Phase 2 — Evidence-Based Claims Rollout

- Active plan:
  [phase-2-evidence-based-claims-execution.md](active/phase-2-evidence-based-claims-execution.md)
- Source strategy:
  [hallucination-and-evidence-guard-adoption.plan.md](current/hallucination-and-evidence-guard-adoption.plan.md)
- Done when:
  - evidence bundle usage is standardised across target workflows
  - merge-readiness checks enforce evidence requirements
  - documentation sync log records updates/no-change rationale for Phase 2
- Dependencies: Phase 1 complete

### Phase 3 — Architectural Enforcement Execution

- Active plan:
  [phase-3-architectural-enforcement-execution.md](active/phase-3-architectural-enforcement-execution.md)
- Source strategy:
  [architectural-enforcement-adoption.plan.md](current/architectural-enforcement-adoption.plan.md)
- Convergence update (2026-03-04):
  - Strictness-specific ESLint convergence tasks (`no-console`, shared-config promotion work) are executed in
    [devx-strictness-convergence.plan.md](../developer-experience/active/devx-strictness-convergence.plan.md)
  - Directory-complexity supporting constraints, depcruise/knip/`pnpm check` integration, and staged `max-files-per-dir` activation are executed in
    [directory-complexity-enablement.execution.plan.md](../developer-experience/current/directory-complexity-enablement.execution.plan.md)
- Done when:
  - enforcement phases 0-5 are delivered with deterministic validation
  - evidence-backed claims exist for enforcement outcomes
  - documentation sync log records updates/no-change rationale for Phase 3
- Dependencies:
  - documentation boundary corrections already complete
  - Phase 2 claim/evidence workflow available

### Phase 4 — Cross-Agent Standardisation Execution

> **SUPERSEDED**: All cross-agent standardisation work has been absorbed into [ADR-125 (Agent Artefact Portability)](../../../docs/architecture/architectural-decisions/125-agent-artefact-portability.md).

### Phase 5 — Mutation Testing Execution

- Active plan:
  [phase-5-mutation-testing-execution.md](active/phase-5-mutation-testing-execution.md)
- Source strategy:
  [mutation-testing-implementation.plan.md](current/mutation-testing-implementation.plan.md)
- **Milestone context**: Stryker is already a devDependency with a
  `pnpm mutate` turbo task and config inputs. It was briefly used and now
  needs proper integration. **Blocks public beta (M3), not public alpha
  (M1).** However, it remains a high-impact quality gateway that is not
  yet being used — proper integration is a priority for M3.
  (Source: onboarding simulation R27, owner disposition 2026-02-26.)
- Done when:
  - mutation phases 0-3 delivered (with rollout evidence and CI posture)
  - documentation sync log records updates/no-change rationale for Phase 5
- Dependencies:
  - Phase 2 evidence workflow available
  - Phase 3 enforcement baseline stable

### Adjacent — Elasticsearch Specialist Capability

- Active plan:
  [archive/completed/elasticsearch-specialist-capability.execution.plan.md](archive/completed/elasticsearch-specialist-capability.execution.plan.md)
- Source strategy:
  [elasticsearch-specialist-capability.plan.md](current/elasticsearch-specialist-capability.plan.md)
- Goal:
  - add a canonical Elasticsearch reviewer, skill, and situational rule
  - require live consultation of official Elastic documentation as primary authority
  - treat Elastic Serverless as the default deployment context
- Status: ✅ Complete
- Notes:
  - intentionally outside the numbered phase sequence
  - collection-owned because it extends the agent capability model rather than the product runtime directly

### Adjacent — Codex Platform Parity

- Active plan:
  ~~codex-platform-parity.execution.plan.md~~ (deleted)
- Status: ✅ Complete
- Done when:
  - Codex agent configuration exists with appropriate tool access and constraints
  - AGENTS.md is present and consistent with AGENT.md directives
  - portability validation covers Codex artefacts
- Notes:
  - intentionally outside the numbered phase sequence
  - extends platform coverage to OpenAI Codex alongside Cursor and Claude Code

### Adjacent — Continuity, Session Handoff, and Surprise Pipeline Adoption

- Strategic plan:
  [continuity-and-surprise-practice-adoption.plan.md](current/continuity-and-surprise-practice-adoption.plan.md)
- Goal:
  - treat continuity as a repo engineering property rather than a vague memory
    claim
  - replace `wrap-up` with lightweight `session-handoff`
  - keep `consolidate-docs` as conditional deep convergence
  - revive `GO` as a mid-session cadence
  - use the MCP App lane as the evidence source
- Status: 🔄 Active reference (`current/`)
- Notes:
  - intentionally outside the numbered phase sequence
  - repo-local first, portable by design, no Practice Core mutation in wave 1

### Adjacent — Sentry Specialist Capability

- Strategic plan:
  [sentry-specialist-capability.plan.md](current/sentry-specialist-capability.plan.md)
- Goal:
  - add a canonical Sentry/OpenTelemetry reviewer, skill, and situational rule (ADR-129 triplet)
  - require live consultation of official Sentry and OpenTelemetry documentation as primary authority
  - scope includes Sentry SDK integration, OpenTelemetry instrumentation, distributed tracing, error tracking, MCP Insights, alerting, and performance monitoring
  - treat Vercel (Node.js) + `@sentry/node` as the default deployment context
- Status: 🔄 Active reference (`current/`)
- Notes:
  - third instantiation of the domain specialist triplet pattern (ADR-129)
  - intentionally outside the numbered phase sequence
  - collection-owned because it extends the agent capability model
  - must be created before or as the very first step of the Sentry integration
    ([sentry-otel-integration.execution.plan.md](../architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md))
    — so agents can review Sentry SDK usage as it's being written

### Adjacent — MCP Specialist Upgrade (MCP+)

- Strategic plan:
  [mcp-specialist-upgrade.plan.md](archive/completed/mcp-specialist-upgrade.plan.md)
- Goal:
  - upgrade existing `mcp-reviewer` from a general reviewer to a full ADR-129
    triplet (add skill, situational rule, live-spec-first doctrine)
  - include `@modelcontextprotocol/ext-apps` coverage (App Extensions, widget
    preview, iframe/CSP, host-specific behaviour)
  - require live consultation of the MCP specification and ext-apps docs
  - the MCP spec evolves rapidly — agents need current guidance, not cached knowledge
- Status: ✅ COMPLETE (current/, reference)
- Delivered:
  - `.agent/skills/mcp-expert/SKILL.md` — canonical active workflow skill with doctrine hierarchy, tiered context, capability routing
  - `.cursor/skills/mcp-expert/SKILL.md` and `.agents/skills/mcp-expert/SKILL.md` — platform wrappers
  - MCP quick-triage (#9) and worked example added to `invoke-code-reviewers.md`
  - Full wrapper parity audit across Cursor/Claude/Codex surfaces
  - Validation evidence: `subagents:check`, `portability:check`, `markdownlint:root` all passing
- Notes:
  - unlike ES/Clerk/Sentry, this upgraded an existing reviewer rather than creating from scratch
  - ext-apps remains within MCP specialist scope
  - intentionally outside the numbered phase sequence

### Adjacent — Express Specialist Capability

- Strategic plan:
  [express-specialist-capability.plan.md](future/express-specialist-capability.plan.md)
- Goal:
  - add a canonical Express reviewer, skill, and situational rule (ADR-129 triplet)
  - require live consultation of official Express 5.x documentation
  - Express 5 has breaking changes from v4 — agents frequently apply v4 patterns
  - scope includes middleware patterns, error handling, routing, req/res typing,
    and Vercel deployment specifics
  - treat Express 5.x on Vercel as the default deployment context
- Status: 📋 PLANNED (future/)
- Notes:
  - fourth instantiation of the domain specialist triplet pattern (ADR-129)
  - intentionally outside the numbered phase sequence
  - Vercel deployment context may warrant Vercel-specific subsections in the
    review checklist

### Adjacent — Cyber Security Specialist Capability

- Strategic plan:
  [cyber-security-specialist-capability.plan.md](future/cyber-security-specialist-capability.plan.md)
- Goal:
  - add a canonical cyber security reviewer, skill, and situational rule
    (ADR-129 triplet)
  - broad-remit security capability for threat models, defence in depth,
    supply-chain posture, secret lifecycle, and cross-system security trade-offs
  - explicitly complements rather than replaces the existing
    `security-reviewer`, which remains the practical default security specialist
- Status: 📋 PLANNED (future/)
- Notes:
  - intentionally outside the numbered phase sequence
  - broad-remit vs narrow-remit is a scope distinction, not a review-depth
    distinction
  - complements `security-reviewer` by taking the deeper doctrine and posture
    lens rather than the default exploitability-first pass

### Adjacent — Web/API Security Specialist Capability

- Strategic plan:
  [web-api-security-specialist-capability.plan.md](future/web-api-security-specialist-capability.plan.md)
- Goal:
  - add a canonical web/API security reviewer, skill, and situational rule
    (ADR-129 triplet)
  - narrow-remit security capability for HTTP trust boundaries, endpoint
    security, callbacks, sessions, CORS/CSRF, and API attack surfaces
  - explicitly complements the broad cyber security specialist, the practical
    `security-reviewer`, and framework specialists such as Express, Clerk, and
    MCP
- Status: 📋 PLANNED (future/)
- Notes:
  - intentionally outside the numbered phase sequence
  - narrow-remit does not imply shallow review; this specialist may still need
    deep reasoning and live-docs consultation
  - forms the security-boundary half of the planned security/privacy cluster

### Adjacent — Privacy Specialist Capability

- Strategic plan:
  [privacy-specialist-capability.plan.md](future/privacy-specialist-capability.plan.md)
- Goal:
  - add a canonical privacy reviewer, skill, and situational rule
    (ADR-129 triplet)
  - broad-remit privacy capability for privacy by design, minimisation,
    retention, redaction, and trust posture
  - establish a privacy lens that is distinct from exploitability-focused
    security review
- Status: 📋 PLANNED (future/)
- Notes:
  - intentionally outside the numbered phase sequence
  - broad-remit vs narrow-remit is a scope distinction, not a review-depth
    distinction
  - complements `security-reviewer` by taking privacy-governance correctness as
    the primary lens

### Adjacent — Web/API GDPR Specialist Capability

- Strategic plan:
  [web-api-gdpr-specialist-capability.plan.md](future/web-api-gdpr-specialist-capability.plan.md)
- Goal:
  - add a canonical web/API GDPR reviewer, skill, and situational rule
    (ADR-129 triplet)
  - narrow-remit capability for personal-data obligations at web/API boundaries:
    consent/preference semantics, deletion/export flows, retention signalling,
    and data-rights surfaces
  - complement both the broad privacy specialist and the narrow web/API
    security specialist
- Status: 📋 PLANNED (future/)
- Notes:
  - intentionally outside the numbered phase sequence
  - narrow-remit does not imply shallow review; this specialist may still need
    deep reasoning and live-docs consultation
  - forms the privacy-boundary half of the planned security/privacy cluster

### Adjacent — Oak Open Curriculum Ecosystem Specialist Capability (OOCE)

- Strategic plan:
  [ooce-specialist-capability.plan.md](future/ooce-specialist-capability.plan.md)
- Goal:
  - add a canonical Oak Open Curriculum Ecosystem reviewer, skill, and
    situational rule (ADR-129 triplet) — the avatar of the repo itself
  - specialist in the repo's own internal library contracts, composition
    patterns, and how the workspaces fit together
  - scope includes: `@oaknational/result` (Result<T, E>), `@oaknational/logger`
    (sink architecture, OTel format), `@oaknational/env` and `env-resolution`
    (env contracts), `@oaknational/type-helpers`, `@oaknational/sdk-codegen`
    (generated types, vocab generation), `@oaknational/curriculum-sdk` and
    `@oaknational/oak-search-sdk` (public API surface), and
    `@oaknational/eslint-plugin-standards` (custom lint rules)
  - enforce correct usage patterns: "use Result, not try/catch"; "inject Logger,
    don't construct"; "env contracts resolve at startup, not at call site"
  - authority source is the README and source of each internal package, not
    external documentation
- Status: 📋 PLANNED (future/)
- Notes:
  - the repo's own avatar — knows every internal package, every pattern,
    every gotcha, and how they compose
  - different from architecture reviewers (who care about boundaries and
    dependency direction) — this specialist cares about correct usage of
    internal APIs and patterns
  - intentionally outside the numbered phase sequence
  - the must-read tier will reference each internal package's README
  - scope boundary: "Are you using our libraries correctly?" vs
    architecture reviewers: "Is the dependency direction correct?"

### Adjacent — Planning Specialist Capability

- Strategic plan:
  [planning-specialist-capability.plan.md](future/planning-specialist-capability.plan.md)
- Goal:
  - add a canonical planning reviewer, skill, and situational rule (ADR-129 triplet)
  - specialist in plan architecture, lifecycle, discoverability, and documentation
    sync requirements
  - enforce: correct template usage, required sections, phase gates, cross-reference
    maintenance, plan-vs-docs separation
  - authority source is plan templates, collection READMEs, and practice-core docs
- Status: 📋 PLANNED (future/)
- Notes:
  - intentionally outside the numbered phase sequence
  - complements docs-adr-reviewer (which owns ADR content) — this specialist
    owns plan structure and lifecycle

### Adjacent — TDD Specialist Capability

- Strategic plan:
  [tdd-specialist-capability.plan.md](future/tdd-specialist-capability.plan.md)
- Goal:
  - add a canonical TDD reviewer, skill, and situational rule (ADR-129 triplet)
  - multi-level TDD guidance scaled to task size: unit → integration → E2E →
    UI → smoke → contract
  - refined test level definitions aligned with industry terminology while
    keeping the "if it runs in CI, no IO" rule
  - the skill guides the testing approach at the START of work; the existing
    test-reviewer audits the result AFTER
  - covers the Red-Green-Refactor sequence at every level, anti-patterns
    (vi.mock, vi.stubGlobal, skipped tests), and test-level selection
- Status: 📋 PLANNED (future/)
- Notes:
  - intentionally outside the numbered phase sequence
  - refines and operationalises `.agent/directives/testing-strategy.md`
  - relationship to test-reviewer: TDD specialist guides approach,
    test-reviewer audits compliance
  - includes a **mutation testing sub-specialist** (Stryker JS) — focused on
    surviving mutant triage and remediation through better architecture and
    better tests, NOT through mutation-specific test hacks
  - prerequisite: terminology standardisation audit and remediation must
    complete before the triplet is created

### Adjacent — Developer Experience Specialist Capability (DVX)

- Strategic plan:
  [devx-specialist-capability.plan.md](future/devx-specialist-capability.plan.md)
- Goal:
  - add a canonical developer experience reviewer, skill, and situational rule
    (ADR-129 triplet)
  - four broad areas: working with the code (readability, error messages, naming),
    working with the repo (onboarding friction, script consistency, config
    ergonomics), working with the SDKs (API design, type ergonomics, progressive
    disclosure), working with the CLIs (flags, help text, progress, error output)
  - distinct lens from OOCE: OOCE asks "is it correct?", DevX asks "does it
    feel good to use?"
  - AI agent DX is a first-class concern (clear errors, structured output,
    deterministic behaviour)
- Status: 📋 PLANNED (future/)
- Notes:
  - intentionally outside the numbered phase sequence
  - complements OOCE (correctness) and onboarding-reviewer (first-time
    journey) with an ongoing daily friction lens
  - the repo's users include both humans and AI agents — DX applies to both

### Adjacent — Reviewer Gateway Upgrade (GW)

- Strategic plan:
  [reviewer-gateway-upgrade.plan.md](current/reviewer-gateway-upgrade.plan.md)
- Goal:
  - upgrade `code-reviewer` from a code quality reviewer that also triages
    to a Reviewer Gateway that also does baseline code quality
  - redesign the triage model from a flat checklist to a layered model
    (change category → domain signal → cross-cutting concerns) that scales
    to 20+ specialists
  - integrate review depth selection (deep vs focused per specialist)
  - add review coverage tracking across a session
  - rename directive, rule, and adapters (coordinated with taxonomy plan)
- Status: ⏭️ QUEUED (current/)
- Notes:
  - the gateway's role has outgrown its `code-reviewer` name
  - execution shares rename mechanics with the Agent Classification Taxonomy
    plan — should be coordinated
  - triage model redesign can be drafted independently of the rename

### Adjacent — Manifest-Driven Adapter Generation (AGN)

- Strategic plan:
  [adapter-generation.plan.md](future/adapter-generation.plan.md)
- Goal:
  - replace manual platform adapter maintenance with a manifest-driven
    generation script
  - single `specialist-manifest.yaml` defines each agent's platform-specific
    properties; `pnpm generate:adapters` produces all wrapper files
  - eliminates drift between canonical templates and platform adapters
  - reduces new specialist creation from 4–6 files to 1 manifest entry
  - makes the taxonomy rename (WS3) trivial — update manifest, regenerate
- Status: 📋 PLANNED (future/)
- Notes:
  - prerequisite optimisation for the taxonomy rename
  - at 25 specialists × 4 platforms = 100+ adapter files, manual maintenance
    is unsustainable
  - `portability:check` evolves from existence check to freshness check

### Adjacent — Agent Classification Taxonomy

- Strategic plan:
  [agent-classification-taxonomy.plan.md](future/agent-classification-taxonomy.plan.md)
- ADR: [ADR-135](../../../docs/architecture/architectural-decisions/135-agent-classification-taxonomy.md)
- Goal:
  - introduce `classification` field (`domain_expert`, `process_executor`, `specialist`) to all agents
  - add operational modes (`explore`, `advise`, `review`) as composable components
  - full rename of all agents (drop `-reviewer` suffix)
  - create Practice domain trio (`practice`, `practice-core`, `practice-applied`)
  - update validation, documentation, and platform adapters across all four platforms
  - define review depth dimension (deep/Opus vs focused/Haiku-Sonnet) with explicit selection criteria
  - integrate all specialist improvements into Practice Core documentation
- Status: 📋 Strategic (future/)
- Notes:
  - executes on a dedicated feature branch
  - success criterion: zero stale references to old names anywhere in repo
  - WS6 (review depth) and WS7 (Practice Core integration) added 2026-03-13

### Adjacent — Clerk Specialist Capability

- Status: ✅ Complete (2026-03-13)
- Goal:
  - add a canonical Clerk reviewer, skill, and situational rule (ADR-129 triplet)
  - require live consultation of official Clerk documentation as primary authority
  - treat Vercel (Express) + shared Clerk instance as the default deployment context
- Notes:
  - second instantiation of the domain specialist triplet pattern (ADR-129)
  - intentionally outside the numbered phase sequence
  - collection-owned because it extends the agent capability model

### Adjacent — Specialist Operational Tooling Layer

- ADR: [ADR-137](../../../docs/architecture/architectural-decisions/137-specialist-operational-tooling-layer.md)
- Goal:
  - extend domain specialist triplets with an optional fourth layer: agent-accessible CLI/MCP tools for live system interaction
  - Elasticsearch: extend search CLI with inspect/suggest commands
  - Clerk: adopt official `clerk/cli` or build custom CLI on `@clerk/backend`
- Status: 📋 Strategic (ADR accepted, no execution plan yet)
- Notes:
  - applies to any domain specialist with a live external system
  - design principles: structured JSON output, read-safe by default, reviewer-compatible findings
  - execution plans will be created per-domain when work is scheduled

### Adjacent — Harness Concepts Baseline Metrics (HC-0)

- Active plan:
  [active/phase-0-baseline-metrics.plan.md](active/phase-0-baseline-metrics.plan.md)
- Source strategy:
  [harness-concepts-adoption.plan.md](current/harness-concepts-adoption.plan.md)
- Goal:
  - evaluate harness-engineering concepts (docs freshness, entropy cleanup, quality scoring)
  - capture baseline metrics for adoption candidates
- Status: 📋 PLANNED
- Done when:
  - baseline metrics captured for docs freshness, entropy, and quality scoring
  - adoption/rejection decision recorded for each harness concept
  - documentation sync log records updates/no-change rationale
- Dependencies: Phase 0 complete

---

## Gap Analysis — Tech Stack vs Specialist Coverage (2026-03-14)

Full tech-stack inventory cross-referenced against the specialist roster.
Routing decisions are locked in — concerns are assigned to existing or planned
specialists, not deferred.

### Routed to existing/planned specialists

| Concern | Routed To | Rationale |
|---------|-----------|-----------|
| Zod 4.x patterns (env, OpenAPI, SDK, CLI) | OOCE | Internal validation pattern, not external service |
| Codegen pipeline (OpenAPI → types → Zod → SDK → vocab → MCP) | OOCE | Internal composition pattern |
| TypeDoc API doc generation | OOCE | Generated files concern |
| CI/CD config (GitHub Actions, semantic-release) | config-reviewer | CI config is tooling config |
| Vercel deployment specifics | Express specialist | Already in Express scope |
| Broad security posture and threat modelling | Cyber security specialist | Distinct from exploitability-first security review |
| HTTP/API boundary hardening | Web/API security specialist | Narrow trust-boundary and attack-surface expertise |
| Broad privacy-by-design posture | Privacy specialist | Distinct from exploitability-focused security review |
| Personal-data obligations at API boundaries | Web/API GDPR specialist | Narrow data-rights and retention-semantics expertise |
| Secrets lifecycle/rotation | security-reviewer | Security concern |
| Commander CLI framework | DevX specialist | CLI ergonomics (area 4) |

### No specialist needed

| Concern | Rationale |
|---------|-----------|
| Redis/ioredis caching | Surface area too small (few files in one CLI) |
| Hono framework | Pinned override, not actively used. Monitor. |
| Feature flags | Not used, not planned |
| Database migrations | No persistent DB |
| Message queues | Not used |
| Rate limiting | Not implemented; Express specialist when added |
| Analytics/telemetry | Not in repo scope |
| IaC/Terraform | Managed externally |
| Load/performance testing | No tooling exists yet; assess when introduced |

### Full specialist roster (target state)

**Important modelling note (2026-03-14)**:

- **Remit breadth** (`broad-remit` vs `narrow-remit`) is a different dimension
  from **engagement depth** (`deep` vs `focused`)
- agents are **not** synonymous with reviewers — the future taxonomy also
  supports advisory, research, and process-enabling roles
- the four new security/privacy additions are best understood as additive
  future specialist capabilities, not replacements for `security-reviewer`

**Always-on (invoked for every non-trivial change):**

- Reviewer Gateway (upgraded from code-reviewer)

**Standard roster (invoked when change profile matches):**

- type-reviewer, test-reviewer, docs-adr-reviewer, config-reviewer,
  security-reviewer, architecture reviewers (fred/barney/betty/wilma)

**Domain specialists (ADR-129 triplets, invoked on domain signal):**

- elasticsearch-reviewer ✅, clerk-reviewer ✅, mcp-reviewer ✅ (triplet complete),
  sentry specialist 🔄, express specialist 📋, cyber security specialist 📋,
  web/API security specialist 📋, privacy specialist 📋,
  web/API GDPR specialist 📋, ooce specialist 📋

**Practice/process specialists (invoked on methodology signal):**

- planning specialist 📋, tdd specialist 📋, devx specialist 📋

**Situational (on-demand, not tied to change profile):**

- release-readiness-reviewer, ground-truth-designer, subagent-architect,
  onboarding-reviewer

---

## Deferred Safety Work (Not in current phase sequence)

- Sandboxed execution rollout
- Prompt-injection red-team automation

These remain intentionally deferred until hallucination/evidence controls are
stable across at least two delivery cycles.

---

## Quality Gates

Use the canonical repository gate commands from repo root:

```bash
pnpm check
pnpm fix
```
