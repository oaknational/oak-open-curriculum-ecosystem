# Napkin

## Session 2026-03-02g — Consolidation

### Distillation performed
Archived `napkin-2026-03-02.md` (943 lines, sessions 2026-02-28 through
2026-03-02). Extracted 10 new entries to distilled.md:
- Barrel export requirement (runtime `undefined` from missing exports)
- `pnpm vocab-gen` vs `pnpm sdk-codegen` distinction
- 23 generated vs 7 aggregated MCP tools (always distinguish)
- Zod `.passthrough()` → `.loose()` deprecation
- Typed call arrays beat `vi.fn().mock.calls`
- SDK should not own logging (app layer observability)
- Simplify ruthlessly when blocking a merge
- Read MCP tool descriptors before calling

distilled.md: 158 → ~175 lines (ceiling 200).

### Fitness function status
| Document | Lines | Ceiling | Status |
|---|---|---|---|
| AGENT.md | 165 | 200 | OK (83%) |
| rules.md | 134 | 200 | OK (67%) |
| testing-strategy.md | 393 | 400 | Near (98%) |
| schema-first-execution.md | 39 | 100 | OK (39%) |
| typescript-practice.md | 113 | 150 | OK (75%) |
| development-practice.md | 108 | 150 | OK (72%) |
| troubleshooting.md | 162 | 200 | OK (81%) |
| CONTRIBUTING.md | 401 | 400 | Over (100%) |
| distilled.md | ~175 | 200 | OK (88%) |
| practice.md | 216 | 250 | OK (86%) |
| practice-lineage.md | 321 | 320 | Over (100%) |
| practice-bootstrap.md | 391 | 400 | Near (98%) |

Persistent ceilings: CONTRIBUTING.md (401/400, 1 over) and
practice-lineage.md (321/320, 1 over). Both noted in prior sessions.
practice-bootstrap.md grew with the practice-index template addition.

## Session 2026-03-02h — Post-dedup consolidation

### What happened
Updated codegen architecture plans (README, analysis, decomposition,
reviewer findings) to reflect the M1 graph data dedup work. Updated
release plan current state and top priorities — ESLint OOM is done,
remaining gates are next. Updated session-continuation prompt title and
content. Deleted three completed cursor plans (onboarding fixes, MCP
prompts cleanup, graph dedup OOM) after verifying no documentation
needed extraction — all permanent docs were created during
implementation.

### Plan deletion assessment
All three plans were pure execution instructions. The onboarding plan's
eslint-disable audit (P2-9) is a point-in-time snapshot, not permanent
docs. The MCP prompts plan already created ADR-123 and updated READMEs
in Phase 4. The graph dedup plan's architecture is captured in the
codegen architecture plans.

### Fitness function status (unchanged)
Same as session 2026-03-02g. CONTRIBUTING.md (401/400) and
practice-lineage.md (321/320) remain 1 over ceiling. distilled.md at
176/200.
