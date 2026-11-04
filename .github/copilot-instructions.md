# Copilot Instructions

Read [AGENT.md](../.agent/directives/AGENT.md)

## Code review

Review against the pull request description's `## Scope` section. A finding whose remedy
falls outside the declared scope is reported as an out-of-scope observation with no
proposed change; do not propose additions the scope does not ask for. On a prose- or
records-class changeset, and on the prose findings of a mixed one, grade against the
declared intake (artefact class, verification point, bar) rather than against
completeness. On code, the specification is the tests and recorded fixtures the pull
request carries: a defect that a tested or recorded input exercises is a finding; a case no
such input exercises is an observation. Report an observation in whatever shape your output
allows — an inline comment that opens with "Observation:", or one list under one heading —
never as a blocking finding. Documentation, naming and wording items go in one such
observation, not one comment each. Once the description records that the settlement budget
is spent, items on code unchanged since your last review are observations, not findings.
