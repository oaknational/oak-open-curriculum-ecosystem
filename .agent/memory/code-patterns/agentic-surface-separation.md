---
name: "Agentic Surface Separation"
use_this_when: "Designing or refactoring agent infrastructure that spans skills, rules, commands, subagents, or platform adapters"
category: architecture
proven_in: "Cross-platform skills review plus local Practice integration (2026-03-20, algo-experiments)"
proven_date: 2026-03-20
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Skill-rule-command conflation, over-eager auto-invocation, adapter drift, hidden side effects"
  stable: true
---

# Agentic Surface Separation

## Principle

Separate always-on policy, on-demand expertise, explicit workflow entrypoints, and isolated
execution roles into distinct agent surfaces. Portability comes from preserving those semantics
across platforms, not from forcing every surface into the same file type.

## Pattern

1. Put persistent project context and policy in entry-point files and directives (always-on or
   near-always-on).
2. Use rules for short operational reinforcements and scoped activation (lightweight, small).
3. Use skills for on-demand expertise and multi-step workflows (discovered from metadata, loaded
   through progressive disclosure).
4. Use commands for explicit user-invoked workflows (clean manual entrypoint for actions the agent
   should not decide to run on its own).
5. Use subagents for isolation, delegation, or role-specialised execution (different tools,
   permissions, or a separate context window).
6. Make destructive or high-consequence workflows opt-in (deploy, commit, migration should be
   explicit commands or skills with implicit invocation disabled).
7. Keep wrappers thin and canonical content centralised in `.agent/`.

## Anti-pattern

- Putting always-on rules or project policy into a skill
- Encoding a destructive operational workflow in an auto-triggering skill
- Modelling reviewer or worker roles as skills when the platform has native subagents
- Duplicating substantive instructions separately for each platform instead of adapting a canonical
  source

## When to Apply

Use this when designing or refactoring agent infrastructure that spans skills, rules, commands,
subagents, or platform adapters.
