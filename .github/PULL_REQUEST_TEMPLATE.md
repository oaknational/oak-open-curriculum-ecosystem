<!--
PR title: LINEAR-ID: type: concise summary
Optional scope: LINEAR-ID: type(scope): concise summary
Example: LINEAR-ID: feat(search): add programme filters

The Linear ID must be the first text in the title. See CONTRIBUTING.md for
linking, closing, and exception rules. Remove instruction comments as you fill
in the template.
-->

## Linear

<!--
Use `Fixes LINEAR-ID` when merging this PR completes the issue.
Use `References LINEAR-ID` when the issue must remain open after merge.
For intentionally untracked exceptions, write `Not applicable — <reason>`.
-->

References LINEAR-ID

## Summary

<!-- What changed? Describe the coherent outcome, not the file list. -->

## Why

<!-- What problem does this solve, who or what benefits, and why now? -->

## Review focus

<!-- Where should reviewers spend attention? Name important decisions or assumptions. -->

## Scope

<!--
State what is deliberately in and out of this PR. This section is the review contract:
reviewers test findings against it, and a finding whose proposed remedy falls outside it is
dispositioned by pr-lifecycle §Phase 4 (the remedy is discarded; the observation is still
priced on the standard its artefact class carries).
On a prose- or records-class changeset, and on a mixed one whose prose findings PDR-140
governs, also declare the intake: the artefact class, its next verification point, the
worthiness-bar reading that follows, and the settlement-push budget.
Write the budget as a digit after the intake line's dash. The review-cost gate takes the first
line anywhere in the body, comments included, whose "budget" and dash are followed by a digit: a
worded number ("three") is skipped, so a later numeric line or the default of 2 wins. Remove this
comment block.
-->

- In scope:
- Out of scope:
- A finding whose proposed remedy falls outside this scope is dispositioned by `pr-lifecycle` §Phase 4: the remedy is discarded, the observation still priced.
- Intake (prose/records changesets, and the prose findings of mixed ones): class — ; verification point — (a pickup names its verifier: the acceptance criterion or ledger surface that consumes it, PDR-140 clause 3); bar — ; budget —
- Specification and budget (code changesets, and the code findings of mixed ones): the tests and recorded fixtures this PR carries are the specification — a case no tested or recorded input exercises is an observation, not a finding; settlement-push budget — 2 (the default; a digit); once spent, this line is updated to say so and items on code unchanged since the reviewer's last review are observations

## Validation

<!--
Give reproducible evidence for the final diff: commands and results, manual
checks, screenshots, or a reason a validation type is not applicable.
-->

## Risks and rollout

<!--
Describe compatibility, migration, deployment, monitoring, rollback, or
follow-up considerations. Write "None" when there are no relevant risks.
-->

## Checklist

- [ ] The title begins with the primary Linear issue ID and a conventional-commit summary, or this PR explains a documented exception
- [ ] The Linear relationship above is accurate (`Fixes`, `References`, or a justified exception)
- [ ] Validation evidence reflects the final diff and all required quality gates pass (`pnpm check` is the canonical full local gate)
- [ ] Tests cover changed behaviour, or the validation section explains why tests are not applicable
- [ ] Documentation is updated where behaviour, interfaces, or contributor workflows changed
- [ ] An ADR is added or updated for architectural decisions
- [ ] No secrets, credentials, or sensitive data are included
