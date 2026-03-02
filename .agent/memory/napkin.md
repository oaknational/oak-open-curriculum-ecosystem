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
