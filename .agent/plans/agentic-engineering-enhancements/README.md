# Agentic Engineering Enhancements

Plans and research for hardening the agentic engineering practice through physical constraints, cross-platform portability, and quality assurance tooling.

**Collection Roadmap**: [roadmap.md](roadmap.md)
**Queued Execution Plans**: [current/README.md](current/README.md)
**Atomic Execution Plans**: [active/README.md](active/README.md)

## Documents

| File | Type | Description |
|------|------|-------------|
| `roadmap.md` | Roadmap | Strategic phase sequence and dependencies for this collection |
| `current/README.md` | Current Index | Queued executable plans ready to start |
| `active/README.md` | Active Index | Atomic executable plans mapped one-to-one to roadmap phases |
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

## Read Order

1. **Roadmap first**: [roadmap.md](roadmap.md)
2. **Queued or active execution**: [current/README.md](current/README.md) then [active/README.md](active/README.md)
3. **Strategic source plans**: hallucination/evidence guards -> enforcement -> mutation testing -> Elasticsearch specialist capability
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
