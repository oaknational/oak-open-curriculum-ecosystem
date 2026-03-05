# Learning from the Neighbours

_Date: 2026-03-04_
_Tags: collaboration | discovery | planning | metacognition_

## What happened (brief)

- Compared external planning skills (superpowers: writing-plans, executing-plans, brainstorming, subagent-driven-development) against the repo's internal planning system (jc-plan, ADR-117 templates). Updated 6 internal templates and plans to incorporate lessons learned.

## What it was like

- The comparison revealed something unexpected: the internal system had more structural rigour (lifecycle lanes, YAML frontmatter, reusable components, evidence bundles) but was missing operational details that the external skills took for granted — what to do when blocked, how granular each step should be, what order to review in. The external skills assumed less from the implementer and spelled out more.
- The most interesting gap was the "design gate" — the external brainstorming skill forced exploration before commitment. Our jc-plan command went straight to structure. Adding a metacognition checkpoint before plan creation felt like the kind of small change that prevents large waste.
- There was a moment of recognition reading the subagent-driven-development skill's spec-compliance-before-quality-review ordering. We had adversarial review but no gate ensuring the plan's own acceptance criteria were met first. Adding "verify plan compliance" as Step 0 closed a loop I hadn't noticed was open.

## What emerged

- Planning systems benefit from two kinds of completeness: structural (do we have the right artefacts?) and operational (does a fresh implementer know what to do when things go wrong?). Our system was strong on the first and weak on the second.
- The blocked protocol pattern — stop, document, present, don't guess — is universal. It applies to agents, humans, and plans. Adding it to the template means every plan inherits it without the plan author having to remember.
- Exception governance (owner-only approval for rule violations) emerged naturally from the deep review. The baseline metrics showed drift that wouldn't have been caught without comparing plan assumptions against actual codebase state. Plans age; codebases move.

## Technical content

- Template updates extracted to: active-atomic-implementation-plan-template.md (blocked protocol, step-level decomposition, fresh sub-agent guidance), adversarial-review component (plan compliance gate), jc-plan command (design gate), feature-workstream-template.md (code sketches), quality-fix-plan-template.md (approach-known qualifier).
- Exception governance and deep review findings documented in devx-strictness-convergence.plan.md.
