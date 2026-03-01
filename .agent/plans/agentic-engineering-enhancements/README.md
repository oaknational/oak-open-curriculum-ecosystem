# Agentic Engineering Enhancements

Plans and research for hardening the agentic engineering practice through physical constraints, cross-platform portability, and quality assurance tooling.

**Collection Roadmap**: [roadmap.md](roadmap.md)
**Atomic Execution Plans**: [active/README.md](active/README.md)

## Documents

| File | Type | Description |
|------|------|-------------|
| `roadmap.md` | Roadmap | Strategic phase sequence and dependencies for this collection |
| `active/README.md` | Active Index | Atomic executable plans mapped one-to-one to roadmap phases |
| `documentation-sync-log.md` | Tracking Log | Per-phase record of required ADR/directive/reference-doc and README updates |
| `architectural-enforcement-adoption.plan.md` | Plan | ESLint boundaries (incl. strict completion and max-files-per-dir), dependency-cruiser, knip — physical enforcement |
| `cross-agent-standardisation.plan.md` | Plan | Cross-platform portability (skills, commands, sub-agent wrappers) |
| `mutation-testing-implementation.plan.md` | Plan | Stryker mutation testing across all workspaces |
| `hallucination-and-evidence-guard-adoption.plan.md` | Plan | Prioritised safety adoption: hallucination guards first, evidence-based claims second |
| `evidence-bundle.template.md` | Template | Standard claim/evidence artifact format for non-trivial engineering claims |
| `evidence/README.md` | Reference | Storage and naming convention for collection evidence artefacts |
| `documentation-accuracy-improvements.plan.md` | Plan | Fix documentation inaccuracies and structural issues (prerequisite for enforcement) — **COMPLETE** |
| `harness-concepts-adoption.plan.md` | Plan | Evaluate and adopt concepts from harness-engineering model (docs freshness, entropy cleanup, quality scoring) |
| `2026-02-21-cross-agent-standardisation-landscape.research.md` | Research | Landscape of cross-agent standards (AGENTS.md, Skills, MCP, A2A) |
| `augmented-engineering-practices.research.md` | Research | Industry evidence base for AI-augmented engineering |
| `augmented-engineering-safety.research.md` | Research | Setup-agnostic safety mechanisms (hallucination guards, evidence gating, tool/sandbox controls) |

## Read Order

1. **Roadmap first**: [roadmap.md](roadmap.md)
2. **Atomic execution plans**: [active/README.md](active/README.md)
3. **Strategic source plans**: hallucination/evidence guards -> enforcement -> standardisation -> mutation testing
4. **Research as evidence base**: augmented safety -> augmented practices -> standardisation landscape

## Document Roles (DRY)

- **Roadmap (`roadmap.md`)**: strategic phase sequence, dependencies, and status.
- **Active plans (`active/*.md`)**: authoritative executable tasks and deterministic validation.
- **Strategic source plans (`*.plan.md`)**: policy intent, rationale, success criteria, and phase design; execution is delegated to active plans.
- **Research docs (`*.research.md`)**: evidence base only; not execution instructions.
- **Tracking artefacts** (`documentation-sync-log.md`, `evidence/`): proof of documentation propagation and claim evidence.

If strategy and execution disagree, update the active plan first, then reconcile
the strategic source plan and roadmap.

## Explicit Goal

Maintain a well-structured `.agent/plans/templates/components` ecosystem with
useful reusable templates, and ensure each journey phase in this collection has
an executable atomic plan in `active/`.

Each phase must also include documentation propagation updates (or explicit
no-change rationale) for ADR-119, `.agent/practice-core/practice.md`, and any
additionally impacted ADRs/docs/READMEs. Apply the
[`jc-consolidate-docs` workflow](../../../.cursor/commands/jc-consolidate-docs.md)
before phase closure.

## Dependencies

- `documentation-accuracy-improvements.plan.md` (**COMPLETE**) was a prerequisite for `architectural-enforcement-adoption.plan.md` (boundary definitions are now correct)
- `augmented-engineering-safety.research.md` provides the evidence model for `hallucination-and-evidence-guard-adoption.plan.md`
- `evidence-bundle.template.md` is the shared evidence artifact referenced by hallucination/evidence, enforcement, and mutation plans
- `augmented-engineering-practices.research.md` provides evidence for both the enforcement and mutation testing plans
- `2026-02-21-cross-agent-standardisation-landscape.research.md` provides the analysis behind `cross-agent-standardisation.plan.md`

## Milestone Alignment

- **Milestone 2**: Architectural enforcement + cross-agent standardisation
- **Milestone 2**: Hallucination/evidence guard adoption
- **Milestone 3**: Mutation testing (pre-beta gate)

See [high-level-plan.md](../high-level-plan.md) for the strategic overview.
