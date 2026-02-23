# Agentic Engineering Enhancements

Plans and research for hardening the agentic engineering practice through physical constraints, cross-platform portability, and quality assurance tooling.

## Documents

| File | Type | Description |
|------|------|-------------|
| `architectural-enforcement-adoption.plan.md` | Plan | ESLint boundaries (incl. strict completion and max-files-per-dir), dependency-cruiser, knip — physical enforcement |
| `cross-agent-standardisation.plan.md` | Plan | Cross-platform portability (skills, commands, sub-agent wrappers) |
| `mutation-testing-implementation.plan.md` | Plan | Stryker mutation testing across all workspaces |
| `documentation-accuracy-improvements.plan.md` | Plan | Fix documentation inaccuracies and structural issues (prerequisite for enforcement) — **COMPLETE** |
| `2026-02-21-cross-agent-standardisation-landscape.research.md` | Research | Landscape of cross-agent standards (AGENTS.md, Skills, MCP, A2A) |
| `augmented-engineering-practices.research.md` | Research | Industry evidence base for AI-augmented engineering |

## Read Order

1. **Plans first** (implementation): enforcement → standardisation → mutation testing
2. **Research as evidence base**: augmented practices → standardisation landscape

## Dependencies

- `documentation-accuracy-improvements.plan.md` (**COMPLETE**) was a prerequisite for `architectural-enforcement-adoption.plan.md` (boundary definitions are now correct)
- `augmented-engineering-practices.research.md` provides evidence for both the enforcement and mutation testing plans
- `2026-02-21-cross-agent-standardisation-landscape.research.md` provides the analysis behind `cross-agent-standardisation.plan.md`

## Milestone Alignment

- **Milestone 2**: Architectural enforcement + cross-agent standardisation
- **Milestone 3**: Mutation testing (pre-beta gate)

See [high-level-plan.md](../high-level-plan.md) for the strategic overview.
