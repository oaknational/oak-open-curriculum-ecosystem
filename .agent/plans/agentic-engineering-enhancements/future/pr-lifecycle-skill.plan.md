# Pull Request Lifecycle Skill — Strategic Plan

**Status**: NOT STARTED
**Domain**: Agentic Engineering Enhancements
**Pattern**: Practice-owned agent-work capability

## Problem and Intent

Agents can create commits and use GitHub tooling, but the full pull-request
lifecycle is still too dependent on memory and ad hoc chat instruction. The
owner explicitly requested a skill that handles PR creation, reviewer
communication, comment harvesting, reviewer wait states, CI/Sonar/tooling
feedback, and quality-gate discipline as one coherent workflow.

The skill should make PR handling reviewer-centred and quality-centred:
descriptions explain why the change matters and how to review it; comments and
tooling findings are pulled into one triage surface; gates become green through
improved quality, not shortcuts, dismissals, or suppressed checks.

## Scope

The future skill should cover:

- creating PRs with meaningful reviewer-facing descriptions, not a simple list
  of changed files;
- collecting unresolved review comments, GitHub checks, CI failures, Sonar
  issues, Bugbot findings, and similar tooling feedback;
- waiting for reviewers or checks without losing the next safe action;
- prioritising feedback by blocking force, risk, and evidence rather than by
  tool order;
- updating PR descriptions when the review story changes;
- closing the loop on each comment or finding with evidence;
- refusing shortcuts such as disabling gates, suppressing warnings, narrowing
  checks to dodge failures, or resolving comments without a real fix.

## Required Doctrine

The skill must enforce these constraints:

1. All required gates are green through quality improvements, not through
   bypasses, blanket exclusions, downgraded warnings, or unsupported
   dismissals.
2. PR descriptions are communication artefacts for reviewers. They should state
   what changed, why it changed, what reviewers should focus on, what was
   deliberately left out, and what evidence supports merge readiness.
3. Review comments, CI, Sonar, and bot findings are blocking until they are
   fixed, owner-dispositioned with evidence, or proven irrelevant at the
   specific site.
4. The workflow must prefer primary evidence: current PR checks over stale
   briefs, current unresolved comment threads over memory, and local
   reproducible gates before remote claims.
5. The skill should compose with the existing commit skill and GitHub plugin
   skills rather than replacing them.

## Candidate Deliverables

1. Canonical skill: `.agent/skills/pr-lifecycle/SKILL.md`
2. Optional command wrapper for repo-local PR closeout if repeated manual steps
   justify one.
3. Documentation updates in the reviewer/commit/finishing-branch surfaces that
   point to the new skill.
4. Test or validation guidance for any repo-local automation added by the
   implementation.

## Promotion Trigger

Promote this plan to `current/` when a branch reaches PR closeout and the owner
asks an agent to create or shepherd the PR, OR when another session repeats the
same feedback pattern around PR comments, CI, Sonar, or reviewer wait states.

## First Execution Slice

Start with a pure documentation skill. Only add automation after the skill has
been used on a real PR and the repeated manual steps are clear.
