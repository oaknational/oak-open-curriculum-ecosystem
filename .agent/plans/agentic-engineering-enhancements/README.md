# Agentic Engineering Enhancements

Plans and research for hardening the agentic engineering practice through physical constraints, cross-platform portability, and quality assurance tooling.

**Collection Roadmap**: [roadmap.md](roadmap.md)
**Active Execution Index**: [active/README.md](active/README.md)
**Queued / Source Plans**: [current/README.md](current/README.md)

## Documents

| File | Type | Description |
|------|------|-------------|
| `roadmap.md` | Roadmap | Strategic phase sequence and dependencies for this collection |
| `current/README.md` | Current Index | Strategic source plans and queued adjacent work |
| `active/README.md` | Active Index | Atomic executable plans for roadmap phases plus adjacent active closeout work |
| ~~`active/practice-convergence.plan.md`~~ | Plan (Completed) | Convergence closeout for Practice Core, local surfaces, and outgoing Context — **COMPLETE** (deleted) |
| `documentation-sync-log.md` | Tracking Log | Per-phase record of required ADR/directive/reference-doc and README updates |
| `current/elasticsearch-specialist-capability.plan.md` | Plan | Strategic source plan for a canonical Elasticsearch reviewer, skill, and situational rule grounded in official Elastic docs and Elastic Serverless applicability |
| `current/architectural-enforcement-adoption.plan.md` | Plan | Physical enforcement strategy; strictness-specific ESLint work is delegated to `developer-experience/active/devx-strictness-convergence.plan.md`, and directory-complexity execution now lives in `developer-experience/current/directory-complexity-enablement.execution.plan.md` |
| `current/mutation-testing-implementation.plan.md` | Plan | Stryker mutation testing across all workspaces |
| `current/hallucination-and-evidence-guard-adoption.plan.md` | Plan | Prioritised safety adoption: hallucination guards first, evidence-based claims second |
| `current/harness-concepts-adoption.plan.md` | Plan | Evaluate and adopt concepts from harness-engineering model (docs freshness, entropy cleanup, quality scoring) |
| `evidence-bundle.template.md` | Template | Standard claim/evidence artifact format for non-trivial engineering claims |
| `evidence/README.md` | Reference | Storage and naming convention for collection evidence artefacts |
| `archive/completed/cross-agent-standardisation.plan.md` | Plan (Superseded) | Historical portability plan superseded by ADR-125 and archived execution work |
| `archive/completed/documentation-accuracy-improvements.plan.md` | Plan (Completed) | Fix documentation inaccuracies and structural issues (prerequisite for enforcement) — **COMPLETE** |
| `2026-02-21-cross-agent-standardisation-landscape.research.md` | Research | Landscape of cross-agent standards (AGENTS.md, Skills, MCP, A2A) |
| `augmented-engineering-practices.research.md` | Research | Industry evidence base for AI-augmented engineering |
| `augmented-engineering-safety.research.md` | Research | Setup-agnostic safety mechanisms (hallucination guards, evidence gating, tool/sandbox controls) |
| `archive/completed/artefact-portability-hardening.plan.md` | Plan (Completed) | Address architectural review findings: trigger content contract, portability validation, rule trigger compliance, naming/documentation gaps |
| `future/hooks-portability.plan.md` | Plan (Future) | Bring hooks into the three-layer model: canonical scripts in `.agent/hooks/`, platform config in `.cursor/`/`.claude/`/`.gemini/` |
| `current/sentry-specialist-capability.plan.md` | Plan | Sentry/OpenTelemetry reviewer, skill, and situational rule (ADR-129 triplet) — covers SDK config, distributed tracing, MCP Insights, alerting |
| `future/mcp-specialist-upgrade.plan.md` | Plan (Future) | Upgrade `mcp-reviewer` to full ADR-129 triplet; add `@modelcontextprotocol/ext-apps` coverage |
| `future/express-specialist-capability.plan.md` | Plan (Future) | Express 5.x reviewer, skill, and situational rule (ADR-129 triplet) — middleware, error handling, Vercel deployment |
| `future/cyber-security-specialist-capability.plan.md` | Plan (Future) | Broad-remit cyber security capability — posture, threat models, defence in depth, and security-architecture doctrine |
| `future/web-api-security-specialist-capability.plan.md` | Plan (Future) | Narrow-remit web/API security capability — HTTP trust boundaries, endpoint security, sessions, callbacks, and API attack surfaces |
| `future/privacy-specialist-capability.plan.md` | Plan (Future) | Broad-remit privacy capability — privacy by design, minimisation, retention, redaction, and trust posture |
| `future/web-api-gdpr-specialist-capability.plan.md` | Plan (Future) | Narrow-remit web/API GDPR capability — personal-data obligations, consent, deletion/export, and retention semantics at API boundaries |
| `future/ooce-specialist-capability.plan.md` | Plan (Future) | Oak Open Curriculum Ecosystem specialist — the repo's own avatar; internal library contracts, composition patterns, workspace usage |
| `future/planning-specialist-capability.plan.md` | Plan (Future) | Planning specialist — plan architecture, lifecycle, discoverability, documentation sync |
| `future/tdd-specialist-capability.plan.md` | Plan (Future) | TDD specialist — multi-level TDD guidance scaled to task size; refined test level definitions |
| `future/devx-specialist-capability.plan.md` | Plan (Future) | Developer experience specialist — code, repo, SDK, and CLI ergonomics and friction |
| `future/reviewer-gateway-upgrade.plan.md` | Plan (Future) | Upgrade code-reviewer gateway to a full Reviewer Gateway with layered triage, depth selection, and coverage tracking |
| `future/adapter-generation.plan.md` | Plan (Future) | Manifest-driven platform adapter generation — replace 100+ manual wrapper files with a single manifest + build script |
| `future/agent-classification-taxonomy.plan.md` | Plan (Future) | Comprehensive agent reclassification, rename, and mode composition (ADR-135) |

## Read Order

1. **Roadmap first**: [roadmap.md](roadmap.md)
2. **Active execution first**: [active/README.md](active/README.md), then
   [current/README.md](current/README.md) for strategic source plans and
   queued adjacent work
3. **Strategic source plans**: hallucination/evidence guards -> enforcement -> mutation testing -> Elasticsearch specialist -> Clerk specialist -> Sentry -> MCP upgrade -> Express -> security/privacy cluster (cyber security -> web/API security -> privacy -> web/API GDPR) -> OOCE -> Planning -> TDD -> DevX -> Reviewer Gateway -> Adapter Generation -> Agent Classification Taxonomy
4. **Research as evidence base**: augmented safety -> augmented practices -> standardisation landscape

## Document Roles (DRY)

- **Roadmap (`roadmap.md`)**: strategic phase sequence, dependencies, status, and queued adjacent work.
- **Current plans (`current/*.md`)**: queued executable tasks ready to start.
- **Active plans (`active/*.md`)**: authoritative executable tasks and deterministic validation.
- **Strategic source plans (`*.plan.md`)**: policy intent, rationale, success criteria, and phase design; execution is delegated to active plans.
- **Research docs (`*.research.md`)**: evidence base only; not execution instructions.
- **Tracking artefacts** (`documentation-sync-log.md`, `evidence/`): proof of documentation propagation and claim evidence.

If strategy and execution disagree, update the active plan first, then reconcile
the strategic source plan and roadmap.

## Explicit Goal

Maintain a well-structured `.agent/plans/templates/components` ecosystem with
useful reusable templates, ensure each journey phase in this collection has an
executable atomic plan in `active/`, and keep queued cross-cutting capability
work discoverable in `current/`.

Each phase must also include documentation propagation updates (or explicit
no-change rationale) for ADR-119, `.agent/practice-core/practice.md`, and any
additionally impacted ADRs/docs/READMEs. Apply the
[`jc-consolidate-docs` workflow](../../../.cursor/commands/jc-consolidate-docs.md)
before phase closure.

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
