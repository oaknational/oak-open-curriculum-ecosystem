# Component: Documentation Propagation

Use this component in any strategic roadmap or executable plan where work may
change the agentic engineering practice, planning standards, or repository
guidance.

## Required Canonical Documents

Plans must include update handling for:

1. `docs/architecture/architectural-decisions/119-agentic-engineering-practice.md`
2. `.agent/practice-core/practice.md`
3. `.agent/reference-docs/prog-frame/agentic-engineering-practice.md`

Also include any additionally impacted ADRs, `/docs/` pages, and README files.

## Required Behaviour

For each phase or major workstream:

- update impacted documents directly, or
- record an explicit no-change rationale

No phase is complete until one of those outcomes is documented.

Also apply the
[`jc-consolidate-docs` workflow](../../../../.cursor/commands/jc-consolidate-docs.md)
before closure to ensure settled documentation is extracted from plans.

## Recommended Tracking Pattern

- Keep a collection-local `documentation-sync-log.md` with one section per
  phase/workstream.
- In each section capture:
  - status
  - update/no-update rationale for each required canonical document
  - additional ADR/docs/README updates

## Merge-Readiness Rule

If documentation propagation is incomplete, the plan is not merge-ready.
