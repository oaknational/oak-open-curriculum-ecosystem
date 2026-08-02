---
name: parallax-learn
description: Use this skill when outcomes, completed inquiries, experiment results, incident recurrences, evaluation traces, or several related cases are available and the goal is to learn about object conclusions, methods, skill routing, coordination, or the learning process itself. Invoke for retrospectives, calibration reviews, portfolio learning, proposed skill improvements, and outcome-driven reopening. Do not use it to preserve ordinary session state, to rewrite a skill from one anecdote, or when no outcome or performance evidence exists.
metadata:
  owned: "true"
  version: "0.1.0"
  collection: "parallax"
---

# Parallax Learn

Treat the directory containing this file as the skill root. Use the embedding Practice for durable
memory; this skill analyses and routes learning but owns no private memory store.

## Load conditionally

- Read [references/learning-protocol.md](references/learning-protocol.md) for attribution,
  improvement, and meta-learning.
- Read [references/practice-memory-binding.md](references/practice-memory-binding.md) when the host
  provides a Practice under `.agent/`.
- Use [assets/learning-review.yaml](assets/learning-review.yaml) for a case or portfolio review.
- Use [assets/change-proposal.yaml](assets/change-proposal.yaml) only after the evidence clears the
  proposal threshold.

Populate the shared artifact envelope with exact input revisions, producing skill version,
execution context, permissions, stackable identities, assumptions, uncertainty, provenance,
validity domain, defeaters, and reopen conditions.

## Workflow

1. **Admit the learning task.** Require an observed outcome, evaluation trace, recurring surprise,
   completed inquiry, or explicit portfolio. If only an expectation exists, create or refine a
   World-Return Contract instead of claiming learning.
2. **Declare scope and levels.** Identify inquiry revisions, relevant bases, scales, methods, skill
   and invocation-policy versions, affected domains, time horizon, and available Practice memory.
3. **Reconstruct expectations.** Recover the original claims, predicted observables, decision,
   thresholds, attribution caveats, monitoring plan, and reopen rules. Treat absent preregistered
   expectations as a limitation.
4. **Compare expected and observed.** Preserve measurement scale, population, timeframe, basis, and
   provenance. Do not convert a proxy movement into an outcome without a warranted bridge.
5. **Classify candidate learning.** Distinguish object, frame, measurement, method, routing,
   coordination, execution, environment/data-change, governance, and learning-policy failures.
6. **Attribute cautiously.** Generate live alternatives, contrary evidence, confounding factors,
   selection effects, survivorship, and counterfactual explanations. State attribution uncertainty.
7. **Challenge the lesson.** Ask whether it is validated by real work, likely to prevent a recurring
   mistake, stable enough to retain, and supported beyond a single memorable case.
8. **Choose a disposition.** Use `capture`, `distil`, `pattern-candidate`, `change-proposal`,
   `reopen-inquiry`, `reject`, or `insufficient`. Emit a proposed Practice handoff with its intended
   destination. Persist it only when the user or an explicit host workflow grants write authority;
   otherwise return the proposal as an artifact with `write_authority: not-granted`.
9. **Govern improvement.** For a proposed skill or policy change, define the smallest general change,
   affected skills, trigger consequences, baseline, held-out and regression evals, success criteria,
   monitoring, compatibility, approval authority, required reviewers, and rollback. Do not mark a
   proposal accepted or apply it without the host's recorded governance decision. Do not edit
   generated adapters or self-modify at runtime.
10. **Close the recursive loop.** State how later object-level outcomes will determine whether the
    learning process and its policy change were themselves beneficial.

## Completion contract

Produce a learning review that records evidence, expected-versus-observed differences, scale and
basis identity, candidate causes, attribution uncertainty, affected learning level, disposition,
proposed Practice destination, persistence authority and status, and next evaluation or world-return.
A change proposal without prospective evaluation, approval authority, required reviewers, and
rollback is incomplete.
