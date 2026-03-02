# Component: Risk Assessment

Every plan should identify risks and their mitigations.
Use this table structure.

## Risk Table

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| [Description of what could go wrong] | Low/Medium/High | [What happens if it does] | [How we prevent or handle it] |

## System-Level Thinking

Answer these three questions:

1. **Why are we doing this?** (Immediate value)
2. **Why does that matter?** (System-level impact)
3. **What if we don't?** (Risk of inaction)

## Common Risk Categories

- **Cross-workspace regression**: SDK changes break consuming apps.
  Mitigation: full quality gate chain after each change.
- **Type safety erosion**: Ad-hoc types bypass the schema pipeline.
  Mitigation: lint rules, sdk-codegen enforcement.
- **Documentation drift**: Code changes without doc updates.
  Mitigation: consolidation flow after each milestone.
- **Scope creep**: Work expands beyond the plan boundary.
  Mitigation: explicit non-goals section, YAGNI.
