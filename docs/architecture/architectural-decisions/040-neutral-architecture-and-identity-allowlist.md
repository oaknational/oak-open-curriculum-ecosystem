# ADR-040: Transition to Neutral Architecture and Identity Allowlist

Status: Accepted
Date: 2025-09-07

## Context

The repository historically used a Greek-nomenclature biological model (Moria/Histoi/Psycha) across code and docs. This reduced approachability and complicated collaboration. We decided to standardise on a conventional, intent‑revealing structure while preserving historical documents.

## Decision

1. Adopt standard structure in active code/docs:
   - `apps/` – MCP servers
   - `packages/libs/` – lib packages (interfaces, utilities, composition)
   - `packages/libs/` – `@oaknational/mcp-*` libraries (logger, env, storage, transport)
2. Replace runtime auto‑detection with explicit provider injection.
3. Enforce architectural boundaries with central ESLint rules.
4. Implement an identity-check script with a denylist of legacy tokens and a minimal allowlist limited to:
   - `archive/**`
   - `.agent/experience/**`
   - `.agent/plans/**`
   - `.agent/refactor/**`
   - `.agent/roles/**`
   - `.claude/**`
   - `.vscode/**`
   - `docs/architecture/historical/greek-ecosystem-deprecation.md`

## Consequences

- Active code and working docs no longer use legacy terms.
- Historical ADRs and guides remain unchanged (archived/preserved), maintaining an accurate record of past decisions.
- The identity-check provides a deterministic gate to ensure consistency.

## Alternatives Considered

- Full rewrite of historical ADRs (rejected: destroys provenance).
- Partial rename with mixed nomenclature (rejected: inconsistent mental model).

## Links

- Plan: `.agent/plans/standardising-architecture-part2.md`
- High-level: `.agent/plans/standardising-architecture-high-level-plan.md`
- Reference: `docs/architecture/historical/greek-ecosystem-deprecation.md`
