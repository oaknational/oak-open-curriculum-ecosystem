# Subagents Must Not Modify the Practice Core

**Substantive authority**: [PDR-003 — Sub-Agent Protection of Foundational Practice Docs](../practice-decision-records/PDR-003-sub-agent-protection-of-foundational-practice-docs.md).

Operationalises the PDR-003 doctrine in the host-repo rule layer. Upstream architectural context:
[ADR-119 (Agentic Engineering Practice)](../../docs/architecture/architectural-decisions/119-agentic-engineering-practice.md),
[ADR-124 (Practice Propagation Model)](../../docs/architecture/architectural-decisions/124-practice-propagation-model.md),
[ADR-127 (Documentation as Foundational Infrastructure)](../../docs/architecture/architectural-decisions/127-documentation-as-foundational-infrastructure.md).

## Rule

Sub-agents (background workers, worktree-isolated agents, batch unit agents,
scoped reviewers dispatched for narrow tasks) **MUST NOT** create, edit,
delete, or rename any file in:

- `.agent/practice-core/` — the eight-file plasmid trinity + verification + entry points + changelog + provenance (the Practice memotype)
- `.agent/practice-decision-records/` — Practice Decision Records (portable Practice-governance decisions)
- `.agent/directives/` — foundation documents (principles, testing strategy, schema-first execution, AGENT.md)
- `.agent/rules/` — canonical rules
- `.claude/rules/` — Claude platform adapters
- `.cursor/rules/` — Cursor platform adapters

These paths constitute the **foundational Practice document set** — the
governance layer that shapes all agent behaviour. Sub-agents lack the
cross-session and cross-file context needed to make sound changes to them.

## Why

See [PDR-003](../practice-decision-records/PDR-003-sub-agent-protection-of-foundational-practice-docs.md)
for the substantive rationale (three-component argument: scoped context,
curation-not-optimisation, invisible pedagogical weight). This rule is the
host-repo operationalisation; PDR-003 is the portable doctrine it enforces.

The short form: a sub-agent is scoped by design. A sub-agent dispatched to
"fix the verifyDocCounts helper" sees one slice of the codebase, not the full
practice history. Changes to foundational documents require cross-session
and cross-file context that sub-agents cannot have. See also
[PDR-002 (Pedagogical Reinforcement in Foundational Practice Docs)](../practice-decision-records/PDR-002-pedagogical-reinforcement-in-foundational-practice-docs.md)
for the companion doctrine on why cross-document repetition in foundational
docs is deliberate and MUST NOT be mechanically deduplicated.

## What Sub-agents Should Do Instead

If a sub-agent discovers that a rule is wrong, missing, or needs updating:

1. **Document the finding** in its final report (not in the rule file)
2. **Flag it** with the text: `PRACTICE-CORE-FINDING: <description>`
3. The coordinating agent or human will assess and apply the change with full context

## Scope

This rule applies only to sub-agents — agents spawned via the Agent tool with
`run_in_background: true` or `isolation: "worktree"`, and scoped reviewers
dispatched for narrow tasks. The primary conversation agent (the one the
human is talking to) retains full authority over the foundational Practice
document set, subject to the human's in-loop consent for substantive edits.
