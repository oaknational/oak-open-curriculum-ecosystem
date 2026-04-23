# Agentic Engineering Enhancements

Plans and research for hardening the agentic engineering practice through physical constraints, cross-platform portability, and quality assurance tooling.

**Collection Roadmap**: [roadmap.md](roadmap.md)
**Active Execution Index**: [active/README.md](active/README.md)
**Current / Source Plans**: [current/README.md](current/README.md)
**Later Plans**: [future/README.md](future/README.md)
**Agentic Corpus Hub**: [../../reference/agentic-engineering/README.md](../../reference/agentic-engineering/README.md)

## Documents

| File | Type | Description |
|------|------|-------------|
| `roadmap.md` | Roadmap | Strategic phase sequence and dependencies for this collection |
| `current/README.md` | Current Index | Strategic source plans and adjacent capability work (queued or in progress) |
| `active/README.md` | Active Index | Atomic executable plans for roadmap phases plus adjacent active closeout work |
| `future/README.md` | Future Index | Deferred strategic backlog and later exploratory capability work |
| `current/agentic-corpus-discoverability-and-deep-dive-hub.plan.md` | Plan | Source strategy for the index-only hub, research/report lanes, docs cross-links, and seed deep dives |
| `archive/completed/agentic-corpus-discoverability-and-deep-dive-hub.execution.plan.md` | Plan (Completed) | Execution plan for the agentic corpus discoverability hub and lane rollout — **COMPLETE** (archived 2026-04-20) |
| ~~`active/practice-convergence.plan.md`~~ | Plan (Completed) | Convergence closeout for Practice Core, local surfaces, and outgoing Context — **COMPLETE** (deleted) |
| `documentation-sync-log.md` | Tracking Log | Per-phase record of required ADR/directive/reference-doc and README updates |
| `current/elasticsearch-specialist-capability.plan.md` | Plan | Strategic source plan for a canonical Elasticsearch reviewer, skill, and situational rule grounded in official Elastic docs and Elastic Serverless applicability |
| `current/architectural-enforcement-adoption.plan.md` | Plan | Physical enforcement strategy; strictness-specific ESLint work is delegated to `developer-experience/active/devx-strictness-convergence.plan.md`, and directory-complexity execution now lives in `developer-experience/current/directory-complexity-enablement.execution.plan.md` |
| `current/mutation-testing-implementation.plan.md` | Plan | Stryker mutation testing across all workspaces |
| `current/hallucination-and-evidence-guard-adoption.plan.md` | Plan | Prioritised safety adoption: hallucination guards first, evidence-based claims second |
| `current/harness-concepts-adoption.plan.md` | Plan | Evaluate and adopt concepts from harness-engineering model (docs freshness, entropy cleanup, quality scoring) |
| `archive/completed/operational-awareness-and-continuity-surface-separation.plan.md` | Active Plan | Repo-local awareness plane: separate canonical continuity contract, workstream resumption briefs, and thread-aware tactical track cards via markdown-first repo-local state surfaces (promoted 2026-04-20) |
| `current/governance-concepts-and-agentic-mechanism-integration.plan.md` | Plan | Source strategy for abstract governance-plane concept extraction, mechanism-gap mapping, and routing into existing plans, deep dives, reports, and doctrine-adjacent surfaces without copying source-specific naming |
| `archive/completed/governance-concepts-and-agentic-mechanism-integration.execution.plan.md` | Plan (Completed) | Execution closeout for governance-concept routing, adjacent-plan reconciliation, and doctrine no-change capture — **COMPLETE** (archived 2026-04-20) |
| `archive/completed/continuity-and-surprise-practice-adoption.plan.md` | Plan (Completed) | Repo-local continuity surfaces, session-handoff rollout, GO alignment, and surprise pipeline adoption completed with an explicit `promote` decision on 3 April 2026 |
| `evidence-bundle.template.md` | Template | Standard claim/evidence artifact format for non-trivial engineering claims |
| `evidence/README.md` | Reference | Storage and naming convention for collection evidence artefacts |
| `archive/completed/cross-agent-standardisation.plan.md` | Plan (Superseded) | Historical portability plan superseded by ADR-125 and archived execution work |
| `archive/completed/documentation-accuracy-improvements.plan.md` | Plan (Completed) | Fix documentation inaccuracies and structural issues (prerequisite for enforcement) — **COMPLETE** |
| `2026-02-21-cross-agent-standardisation-landscape.research.md` | Research | Landscape of cross-agent standards (AGENTS.md, Skills, MCP, A2A) |
| `augmented-engineering-practices.research.md` | Research | Industry evidence base for AI-augmented engineering |
| `augmented-engineering-safety.research.md` | Research | Setup-agnostic safety mechanisms (hallucination guards, evidence gating, tool/sandbox controls) |
| `archive/completed/artefact-portability-hardening.plan.md` | Plan (Completed) | Address architectural review findings: trigger content contract, portability validation, rule trigger compliance, naming/documentation gaps |
| `future/hooks-portability.plan.md` | Plan (Future) | Bring hooks into the three-layer model: canonical scripts in `.agent/hooks/`, platform config in `.cursor/`/`.claude/`/`.gemini/` |
| `future/cross-vendor-session-sidecars.plan.md` | Plan (Future) | Local-first canonical session sidecars for arbitrary structured metadata across hook, wrapper, and importer adapters |
| `current/sentry-specialist-capability.plan.md` | Plan | Sentry/OpenTelemetry reviewer, skill, and situational rule (ADR-129 triplet) — covers SDK config, distributed tracing, MCP Insights, alerting |
| `archive/completed/mcp-specialist-upgrade.plan.md` | Plan (Completed) | Upgrade `mcp-reviewer` to full ADR-129 triplet; add `@modelcontextprotocol/ext-apps` coverage |
| `future/express-specialist-capability.plan.md` | Plan (Future) | Express 5.x reviewer, skill, and situational rule (ADR-129 triplet) — middleware, error handling, Vercel deployment |
| `future/cyber-security-specialist-capability.plan.md` | Plan (Future) | Broad-remit cyber security capability — posture, threat models, defence in depth, and security-architecture doctrine |
| `future/web-api-security-specialist-capability.plan.md` | Plan (Future) | Narrow-remit web/API security capability — HTTP trust boundaries, endpoint security, sessions, callbacks, and API attack surfaces |
| `future/privacy-specialist-capability.plan.md` | Plan (Future) | Broad-remit privacy capability — privacy by design, minimisation, retention, redaction, and trust posture |
| `future/web-api-gdpr-specialist-capability.plan.md` | Plan (Future) | Narrow-remit web/API GDPR capability — personal-data obligations, consent, deletion/export, and retention semantics at API boundaries |
| `future/ooce-specialist-capability.plan.md` | Plan (Future) | Oak Open Curriculum Ecosystem specialist — the repo's own avatar; internal library contracts, composition patterns, workspace usage |
| `current/planning-specialist-capability.plan.md` | Plan | Planning specialist — plan architecture, lifecycle, discoverability, integration routing, and documentation sync (promoted from future/ 2026-04-20) |
| `future/tdd-specialist-capability.plan.md` | Plan (Future) | TDD specialist — multi-level TDD guidance scaled to task size; refined test level definitions |
| `future/devx-specialist-capability.plan.md` | Plan (Future) | Developer experience specialist — code, repo, SDK, and CLI ergonomics and friction |
| `future/repair-workflow-wording-hazard-detection.plan.md` | Plan (Future) | Detect ambiguous wording and missing output contracts in multi-artefact repair workflows before they trigger rewrite or promotion drift |
| `current/reviewer-gateway-upgrade.plan.md` | Plan | Upgrade code-reviewer gateway to a full Reviewer Gateway with layered triage, depth selection, and coverage tracking |
| `current/learning-loop-negative-feedback-tightening.plan.md` | Plan | Tight incremental tranche: install live executive-memory drift detection and make consolidation-time memory-quality review explicit and auditable |
| `archive/completed/agent-collaboration-incoming-practice-context-integration.plan.md` | Plan (Completed) | Completed rollout for incoming `agent-collaboration` Practice Context integration, local doctrine capture, workspace-task honesty repair, and targeted write-back |
| `future/adapter-generation.plan.md` | Plan (Future) | Manifest-driven platform adapter generation — replace 100+ manual wrapper files with a single manifest + build script |
| `future/agent-classification-taxonomy.plan.md` | Plan (Future) | Comprehensive agent reclassification, rename, and mode composition (ADR-135) |
| `future/mcp-governance-deep-dive.plan.md` | Plan (Future) | Deep dive into MCP `2025-11-25` governance, identity (RFC 9728), durable-tasks, SDK tiering, and JSON Schema 2020-12 implications — trigger: MCP server upgrade enters planning surface |
| `future/graphify-and-graph-memory-exploration.plan.md` | Plan (Future) | Explore Graphify-inspired graph memory as an orthogonal, derived memory layer over canonical Practice artefacts without choosing an implementation path yet |

## Read Order

1. **Roadmap first**: [roadmap.md](roadmap.md)
2. **Active execution first**: [active/README.md](active/README.md), then
   [current/README.md](current/README.md) for strategic source plans and
   adjacent capability work (queued or in progress)
3. **Corpus hub for concept routing**:
   [../../reference/agentic-engineering/README.md](../../reference/agentic-engineering/README.md)
4. **Later backlog**: [future/README.md](future/README.md) for deferred
   strategic work and exploratory capability plans
5. **Strategic source plans**: hallucination/evidence guards -> enforcement ->
   mutation testing -> continuity/surprise adoption (archived reference) ->
   operational-awareness surface separation -> governance-concept integration
   -> Reviewer Gateway -> learning-loop negative-feedback tightening ->
   Elasticsearch specialist -> Clerk specialist -> Sentry -> MCP upgrade -> Express -> security/privacy cluster (cyber
   security -> web/API security -> privacy -> web/API GDPR) -> OOCE -> Graph
   memory exploration -> Planning -> TDD -> DevX -> Repair Workflow Wording
   Hazard Detection -> Adapter Generation -> Agent Classification Taxonomy
6. **Research as evidence base**: augmented safety -> augmented practices ->
   standardisation landscape

## Document Roles (DRY)

- **Roadmap (`roadmap.md`)**: strategic phase sequence, dependencies, status, and queued adjacent work.
- **Current plans (`current/*.md`)**: strategic source plans and adjacent
  capability plans that are either queued or in progress prior to active execution.
- **Active plans (`active/*.md`)**: authoritative executable tasks and deterministic validation.
- **Future plans (`future/*.md`)**: deferred strategic backlog and exploratory
  capability work (LATER), not yet executable.
- **Strategic source plans (`*.plan.md`)**: policy intent, rationale, success criteria, and phase design; execution is delegated to active plans.
- **Research docs (`*.research.md`)**: evidence base only; not execution instructions.
- **Tracking artefacts** (`documentation-sync-log.md`, `evidence/`): proof of documentation propagation and claim evidence.
- **Agentic corpus hub** (`../../reference/agentic-engineering/README.md`): concept-routing surface only; routes back to canon, research, evidence, reports, and docs entry points.

If strategy and execution disagree, update the active plan first, then reconcile
the strategic source plan and roadmap.

## Status Legend

Use these canonical status tokens across this collection:

- `ACTIVE` — currently executing and session-anchor relevant
- `IN PROGRESS` — partially delivered, with remaining scoped work
- `QUEUED` — prioritised next, not yet executing
- `PLANNED` — identified future work, not yet queued
- `PENDING` — todo-level item not yet started
- `COMPLETED` / `COMPLETE` — finished and verified
- `SUPERSEDED` — replaced by a newer authoritative plan/path
- `STRATEGIC` — long-horizon planning item, not immediate execution
- `REFERENCE` — context/source artefact, not an active execution task

## Explicit Goal

Maintain a well-structured `.agent/plans/templates/components` ecosystem with
useful reusable templates, ensure each journey phase in this collection has an
executable atomic plan in `active/`, and keep cross-cutting capability work
discoverable in `current/` (queued or in progress).

Each phase must also include documentation propagation updates (or explicit
no-change rationale) for ADR-119, `.agent/practice-core/practice.md`, and any
additionally impacted ADRs/docs/READMEs. Apply the
[`jc-consolidate-docs` workflow](../../../.cursor/commands/jc-consolidate-docs.md)
before phase closure.

## Direction-of-Travel Integration (2026-04-20)

The practice-aligned direction-of-travel research produced an analysis
baseline with 8 high-impact uplift candidates. A plan-surface integration
session routed each candidate to its correct disposition. The durable
record is the **integration routing register** in:

- [practice-aligned-direction-and-gap-baseline.md](../../analysis/practice-aligned-direction-and-gap-baseline.md) §Integration routing register

Future direction-of-travel candidates should be routed through the same
register rather than creating new plans. The companion baselines and
research notes provide context:

- [governance-concepts-and-mechanism-gap-baseline.md](../../analysis/governance-concepts-and-mechanism-gap-baseline.md) — abstract governance vocabulary
- [cross-lane-direction-survey.md](../../research/agentic-engineering/cross-lane-direction-survey.md) — per-lane routing recommendations

## Dependencies

- `archive/completed/documentation-accuracy-improvements.plan.md` (**COMPLETE**) was a prerequisite for `current/architectural-enforcement-adoption.plan.md` (boundary definitions are now correct)
- `augmented-engineering-safety.research.md` provides the evidence model for `current/hallucination-and-evidence-guard-adoption.plan.md`
- `evidence-bundle.template.md` is the shared evidence artifact referenced by hallucination/evidence, enforcement, and mutation plans
- `augmented-engineering-practices.research.md` provides evidence for both the enforcement and mutation testing plans
- `2026-02-21-cross-agent-standardisation-landscape.research.md` provides the analysis behind `archive/completed/cross-agent-standardisation.plan.md`

## Milestone Alignment

- **Milestone 2**: Architectural enforcement + cross-agent standardisation
- **Milestone 2**: Hallucination/evidence guard adoption
- **Milestone 3**: Mutation testing (pre-beta gate)

See [high-level-plan.md](../high-level-plan.md) for the strategic overview.
