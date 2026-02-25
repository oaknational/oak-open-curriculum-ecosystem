# Deep Review Report (25 February 2026)

## Scope and current-state confirmation

This execution regenerated all evidence from the current repository state before analysis.

- Primary scope: 33 non-archive, non-ADR docs under `docs/`.
- Related scope: 35 linked non-`docs/` files.
- Missing local links: 9.

Compared with the previous snapshot, related linked file count changed from 36 to 35, confirming documentation/link state has shifted.

## Boundary-by-boundary audit

### B0-Foundation

Reviewed:

- `docs/README.md`
- `docs/VISION.md`
- `docs/quick-start.md`

Findings:

- Root index has a broken domain truth-source link (DF-001).
- Root index contains stale ADR count metadata (DF-004).
- Quick-start has domain summary drift and term drift against domain docs (DF-007, DF-008).

### B1-Governance

Reviewed:

- `docs/agent-guidance/*` and linked normative directives under `.agent/directives/*`.

Findings:

- Schema-first and `sdk-codegen` governance language is broadly aligned.
- Quality-gate execution guidance in developer docs can diverge from directive precedence for agent execution (DF-009).

### B2-Architecture

Reviewed:

- `docs/architecture/*` (excluding ADR directory).

Findings:

- Provider pages are explicitly stale but still presented as active architecture entrypoints (DF-005).
- Programmatic tool generation doc includes non-existent "current" file paths (DF-006).
- Two architecture docs link to missing provenance plans (DF-003).

### B3-Domain-Data

Reviewed:

- `docs/data/*`
- `docs/curriculum-guide.md`
- linked code truth path `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts`

Findings:

- Multiple broken links to moved SDK/generated artefacts (DF-002).
- Domain terminology conflict (`pathway` vs `ks4Options`) across domain and foundation docs (DF-008).
- Missing MFL plan links should be de-risked via stable index references (DF-003, DF-012).

### B4-Engineering-Operations

Reviewed:

- `docs/development/*`

Findings:

- High-centrality docs lack consistent freshness markers (DF-011).
- Workflow/onboarding aggregate command guidance needs explicit precedence note for directive-ordered agent execution (DF-009).

### B5-Historical-Provenance

Reviewed as provenance-only:

- linked `.agent/plans/archive/*`, `.agent/plans/icebox/*`, `.agent/plans/external/*`, `.agent/analysis/*`, `.agent/memory/*`, `.agent/experience/*`.

Findings:

- Active docs link directly to volatile provenance leaf files more than is desirable (DF-012).

## Cross-boundary consistency outcome

Topic matrix: `output/cross-boundary-claims-matrix.md`

- Onboarding path: aligned, with boundary ownership clarity opportunity.
- Quality gates and TDD policy: partially conflicting presentation layer.
- Schema-first contract: aligned.
- Provider architecture status: conflicting/stale.
- Data variances and source-truth references: conflicting and partially broken.
- Release/publishing boundaries: aligned with current package privacy scan.

## Reorganisation proposal status

Boundary-led move map is fully specified in `output/move-proposals.tsv`.

- Total proposals: 26 (including one explicit retain row for `docs/README.md`).
- Split of `docs/development/*` into engineering vs operations is explicit.
- Foundation relocation of onboarding is explicit.

## Implementation readiness

- Findings register: complete (`output/doc-findings.tsv` and `.md`).
- Backlog with execution packets and validation commands: complete (`output/remediation-backlog.md`).
- Acceptance checks: complete (`output/acceptance-checks.md`).

This package is decision-complete for a follow-on implementation pass.
