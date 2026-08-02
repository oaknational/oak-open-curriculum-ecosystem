---
name: parallax-audit
description: Use this skill to independently challenge an inquiry, experiment, synthesis, plan, architecture, implementation, product decision, or claimed conclusion before consequential reliance. Invoke when assurance, adversarial review, omitted-scale detection, evidence-dependence analysis, bridge validation, defeater search, calibration review, or a pre-commitment challenge is needed. Do not use it as ordinary proofreading, as a substitute for specialist verification, or to label same-context self-review as independent.
metadata:
  owned: "true"
  version: "0.1.0"
  collection: "parallax"
---

# Parallax Audit

Treat the directory containing this file as the skill root. Produce an audit; do not silently repair
the target unless the user separately authorises changes.

## Load conditionally

- Read [references/audit-protocol.md](references/audit-protocol.md) for the complete audit matrix.
- Read [references/parallax-contract.md](references/parallax-contract.md) when the target uses
  Parallax artifacts, scale/basis terminology, or another Parallax skill.
- Use [assets/audit-report.yaml](assets/audit-report.yaml) when a durable report is appropriate.

Populate the shared artifact envelope with exact audited artifact revisions, producing skill version,
execution mode, independence and shared anchors, permissions, identities, assumptions, uncertainty,
provenance, validity domain, defeaters, and reopen conditions.

## Workflow

1. **Admit and bound the audit.** Identify the target, intended reliance, stakes, requested depth,
   available evidence, and what the audit cannot inspect. Decline ordinary editing requests.
2. **Declare independence honestly.** Record whether the pass is independent, protected-but-
   correlated, or same-context self-review. Never infer independence from agent count alone. An
   audit emulated by an orchestrator is always same-context self-review and cannot satisfy an
   independent-assurance requirement.
3. **Reconstruct missing context.** Identify the question, decision, claim set, frames, basis,
   multidimensional scales, method passes, revisions, and provenance. Mark missing inputs; do not
   invent them.
4. **Challenge routing and depth.** Ask whether the right skills, methods, stakeholders, evidence,
   scales, and operating depth were selected. Check for skills that failed to trigger.
5. **Challenge the inquiry.** Search for excluded frames, construct defects, dependent evidence,
   untested alternatives, unsupported causal claims, hidden values, and conflicts suppressed by
   synthesis.
6. **Audit scale and decomposition.** Require a warranted Bridge Claim for every material move
   between scales and a Crosswalk Claim, or preserved incomparability, for moves between bases.
7. **Attack the strongest conclusion.** Construct realistic defeaters, counterexamples, failure
   mechanisms, and boundary cases. Prefer probes that could change the decision.
8. **Audit action and return.** Check action scale, reversibility, monitoring, attribution limits,
   side constraints, affected groups, stop conditions, and the World-Return Contract.
9. **Challenge the audit itself.** List inaccessible evidence, shared anchors, competence limits,
   possible overreach, and findings that require specialist or empirical validation.
10. **Issue a disposition.** Use `pass`, `qualified`, `reopen`, `block`, or `inconclusive`. For every
    material finding record evidence, consequence, severity, confidence, and the cheapest resolving
    action. Do not turn absence of a finding into proof of correctness.
11. **Hand off and learn.** Identify eligible next capabilities and exact reopening conditions.
    Route durable surprises or recurring failures to the embedding Practice's learning surfaces;
    never retain private memory in the skill directory.

## Completion contract

Do not close until the report states:

- target and intended reliance;
- independence class and correlation risks;
- scope, scales, bases, methods, and evidence inspected;
- findings and their concrete support;
- unresolved uncertainty and inaccessible evidence;
- disposition and required follow-up;
- world-return or reopening implications;
- whether a Practice learning signal was emitted and why.
