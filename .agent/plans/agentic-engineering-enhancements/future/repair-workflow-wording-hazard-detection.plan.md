# Repair Workflow Wording Hazard Detection — Strategic Plan

**Status**: NOT STARTED
**Domain**: Agentic Engineering Enhancements

## Problem and Intent

The April 2026 report-repair sessions exposed a recurring workflow risk:
multi-artefact repair tasks can drift into rewrite or premature promotion when
their instructions use ambiguous verbs such as `normalise`, `canonical`,
`clean up`, or `promote` without also naming source precedence, non-goals, and
the output contract.

The immediate doctrine fix is to sharpen the affected skill and patterns. The
next step is a detection layer that can flag wording and structure hazards in
skills, commands, prompts, and plans before those instructions are executed.

## Scope

### Hazards to Detect

1. **Missing source precedence**: multiple artefacts are named, but no primary
   source for structure/content is declared.
2. **Missing non-goals**: the workflow says `normalise`, `clean`, or
   `canonicalise` without stating "not rewrite / not summary / not synthesis".
3. **Missing output contract**: the workflow does not say whether the result
   should overwrite the raw source, become a sibling clean copy, or promote
   into a tracked destination.
4. **Validation mismatch**: the workflow assumes generic validation (for
   example markdownlint) without checking whether the target estate uses it.
5. **Overloaded destination language**: `canonical` or `final` is used without
   clarifying whether it means local reading surface or tracked permanent home.

### Candidate Surfaces

1. Skills in `.agent/skills/`
2. Commands in `.agent/commands/`
3. Session prompts in `.agent/prompts/`
4. High-value active/current plans that define document workflows

## Deliverables

1. A lightweight wording-hazard checklist that reviewers or agents can apply
   before running a workflow.
2. A repository search spec or lintable rule set for the five hazard classes
   above.
3. A decision on the long-term home for enforcement:
   - reviewer checklist only
   - doc-lint/static-analysis rule
   - portability/practice validation extension

## Out of Scope

- Building the detector in this plan
- Rewriting every existing workflow proactively
- Changing ADR-125 or the broader artefact model
- Treating all uses of `normalise` or `canonical` as wrong; the problem is
  ambiguity, not the words alone

## Success Signals

- New or updated repair workflows consistently declare source precedence,
  non-goals, output contract, and applicable validation.
- Reviewers can identify wording hazards quickly from a short checklist.
- At least one future automation surface is specified clearly enough to build
  without rediscovering the problem.

## Relationship to Other Plans

- Complements the developer-experience specialist capability plan by focusing
  on workflow wording and doc-shape hazards rather than general repo ergonomics.
- May eventually feed the planning specialist capability and practice-fitness
  validators if the detection rules prove stable.

## Promotion Trigger

Promote this plan when either:

1. another multi-artefact workflow shows the same ambiguity pattern, or
2. the repo next adds or extends a doc-lint / practice-validation surface that
   could host wording-hazard checks.
