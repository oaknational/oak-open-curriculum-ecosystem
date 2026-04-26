# Component: Evidence and Claims

Use this component when work includes non-trivial claims that must be
verifiable (for example, "tests pass", "behaviour preserved", "boundary
enforcement complete").

## Required Structure

For each non-trivial claim include:

1. Claim statement
2. Claim class
3. Evidence reference(s)
4. Verification status (`verified`, `partially verified`, `unverified`)

## Claim Classes (recommended baseline)

- `tests-pass`
- `build-type-lint-pass`
- `behaviour-change`
- `api-compat`
- `security-or-migration-safety`
- `lifecycle`
- `coordination`
- `policy`
- `validation`

Use the protocol-oriented classes (`lifecycle`, `coordination`,
`policy`, `validation`) when a claim concerns Practice machinery,
collaboration state, rule activation, template governance, or workflow
validation rather than product behaviour.

## Merge-Readiness Rule

- No evidence for non-trivial claim -> not merge-ready
- No command output evidence -> cannot claim checks/tests passed
- Uncertainty must be explicit and tracked as a follow-up task

## Evidence Bundle

Use a collection-local evidence bundle template where available.

Example:

- `.agent/plans/agentic-engineering-enhancements/evidence-bundle.template.md`
