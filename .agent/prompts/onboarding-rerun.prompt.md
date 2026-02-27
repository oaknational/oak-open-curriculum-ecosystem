# Post-Remediation Onboarding Rerun

Run a full onboarding simulation against the current repository state to
validate the M0 documentation remediation.

## Context

All 17 M0-blocking documentation items (R3-R36) have been remediated.
The root README was restructured, MCP server READMEs were split, the SDK
README was reordered, new explanatory files were created, and acronyms
were expanded. This rerun validates the changes and catches regressions.

## Personas

Run the `onboarding-reviewer` sub-agent for each of these 4 personas:

1. **Junior dev** — First-time contributor. Can they clone, build, and
   make a meaningful first contribution following only the documentation?
   Focus: README clarity, quick-start path, prerequisites, environment
   setup, "what do I do first?" experience.

2. **Lead dev** — Evaluating the codebase for team adoption. Can they
   understand the architecture, quality gates, and engineering practice?
   Focus: architecture section, ADR discoverability, progressive
   disclosure from README to workspace docs.

3. **Engineering manager** — Assessing project maturity and risk. Can they
   understand the engineering practice, quality posture, and milestone
   progression from public-facing documentation?
   Focus: governance docs, VISION.md, milestone files, CONTRIBUTING.md.

4. **Product owner** — Understanding product value without technical
   background. Can they understand what this repository delivers, why it
   matters, and what the roadmap looks like?
   Focus: VISION.md, milestone files, README opening paragraphs.

## Inputs per persona

Each simulation should read these files as the persona:

- `README.md`
- `CONTRIBUTING.md`
- `docs/foundation/quick-start.md`
- `docs/foundation/VISION.md`
- `docs/governance/README.md`
- `.agent/README.md`
- Workspace READMEs relevant to the persona's likely entry point

## Output contract

For each persona, capture:

1. Entry-point success or failure in first 5 minutes
2. Time-to-first-success estimate
3. Blocker list (P0/P1/P2/P3)
4. Trust and clarity observations
5. Whether previously flagged issues (R3-R36) are now resolved
6. Any new issues introduced by the restructuring

## After all 4 simulations

1. Consolidate findings into the onboarding plan:
   `.agent/plans/developer-experience/onboarding-simulations-public-alpha-readiness.md`
   (add results under the §Post-Remediation Rerun section)
2. Classify any new findings using the existing P0-P3 severity model
3. If no P0 blockers: update M0 milestone status
4. Run `/jc-consolidate-docs` to capture learnings

## Reference

- Onboarding plan: `.agent/plans/developer-experience/onboarding-simulations-public-alpha-readiness.md`
- Release plan: `.agent/plans/release-plan-m1.plan.md` §Next Steps
- M0 milestone: `.agent/milestones/m0-open-private-alpha.md`
