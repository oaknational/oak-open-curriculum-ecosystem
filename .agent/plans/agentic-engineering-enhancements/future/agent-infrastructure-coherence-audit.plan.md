# Agent Infrastructure Coherence Audit — Strategic Plan

**Status**: NOT STARTED
**Domain**: Agentic Engineering Enhancements

## Problem and Intent

The Learning Loop Refinement (2026-04-01) revealed a specific instance
of architectural debt: the distillation SKILL was a passive skill with
exactly one consumer (consolidation command step 6), adding indirection
without reuse. Absorbing it into the consolidation command was the
correct fix.

This pattern — extracting a single command step into a skill without
genuine reuse — likely exists elsewhere in the agent infrastructure. A
systematic audit would identify and resolve similar instances across
the full command/skill/rule/agent/adapter system.

## Scope

### Areas to Audit

1. **Skills with exactly one consumer**: passive skills whose only
   reference is a single command step. These may be inlined steps
   that were extracted without reuse justification.

2. **Platform adapters with substantive content**: adapters that
   violate ADR-125's thin wrapper contract by containing workflow
   logic rather than just metadata + pointer.

3. **Inconsistent command/skill boundary**: commands that inline
   everything vs. commands that delegate to skills, without a
   principled basis for the choice. The test: "does anything else
   consume this protocol?"

4. **Skill classification accuracy**: skills classified `passive`
   that are actually command sub-steps (neither genuine guidance
   nor independently invocable).

5. **Adapter parity gaps**: platform adapters that exist for some
   platforms but not others, or that have drifted from their
   canonical sources.

6. **Rule/trigger hygiene**: cursor `.mdc` triggers that exceed the
   10-line content limit or contain policy that belongs in the
   canonical directive.

7. **Agent/command/skill naming coherence**: ADR-135 renames agents
   but downstream naming for commands and skills that compose with
   those agents may not have been updated.

### Out of Scope

- Changing the three-layer model itself (ADR-125)
- Changing the agent classification taxonomy (ADR-135)
- Practice Core structural changes (require user approval, governed by
  plasmid exchange model)
- Skill/command content quality (this audit is structural, not editorial)

## Governing ADRs

- [ADR-125: Agent Artefact Portability — Three-Layer Model](../../../docs/architecture/architectural-decisions/125-agent-artefact-portability.md)
- [ADR-135: Agent Classification Taxonomy](../../../docs/architecture/architectural-decisions/135-agent-classification-taxonomy.md)

## Success Signals

- Every skill has at least two independent consumers, or is clearly
  justified as standalone guidance (passive skills with genuine
  discovery value)
- Every platform adapter is a thin wrapper (metadata + pointer)
- Command/skill boundaries follow a principled, documented test
- All adapter parity gaps are resolved or explicitly documented as
  intentional

## Relationship to Other Plans

- **Adapter Generation**: the manifest-driven adapter generation plan
  would mechanically prevent adapter drift and parity gaps. If that
  plan executes first, areas 2 and 5 of this audit become moot.
- **Agent Classification Taxonomy**: naming coherence (area 7) is a
  downstream concern of the taxonomy rename.

## Promotion Trigger

This plan promotes to `current/` when:

1. The adapter count reaches a point where manual coherence review is
   demonstrably unsustainable, OR
2. A new skill/command boundary question arises and no principled
   basis exists for the answer, OR
3. The adapter generation plan is about to execute (this audit would
   inform the manifest design)
