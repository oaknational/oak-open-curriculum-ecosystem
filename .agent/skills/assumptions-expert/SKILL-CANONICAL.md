---
name: assumptions-expert
classification: active
description: Active workflow skill for conducting assumption audits during planning phases. Grounded in the inverted doctrine hierarchy (project principles first, external expertise last). Use when the working agent needs to challenge proportionality, validate assumptions, or audit blocking relationships — distinct from the assumptions-reviewer, which is a read-only assessment specialist.
---

# Assumptions Expert

Active workflow skill for conducting assumption audits during planning and design work. This skill supports the working agent during tasks that involve plan creation, design proposals, or architectural decisions — it does not replace the `assumptions-reviewer`, which provides independent read-only assessment.

## When to Use

Use this skill when the working agent needs to:

- Challenge the proportionality of a proposed plan before marking it decision-complete
- Validate assumptions in a plan draft against available evidence
- Audit blocking relationships between workstreams for legitimacy
- Assess whether proposed artefacts (agents, packages, documents) have identified consumers
- Evaluate technology commitment timing relative to research phases
- Identify simplification opportunities in a complex proposal

## When NOT to Use

- For independent review of a completed plan — use `assumptions-reviewer`
- For code quality or implementation review — use `code-reviewer`
- For architectural boundary or compliance review — use the architecture reviewers
- For documentation drift or ADR completeness — use `docs-adr-reviewer`
- For test quality or TDD compliance — use `test-reviewer`
- For domain-specific technology assessment — use the relevant domain specialist

## Inverted Doctrine Hierarchy

This skill follows the **inverted doctrine hierarchy** (per ADR-146):

1. **Project principles and directives** — especially the first question ("could it be simpler without compromising quality?").
2. **Architectural decisions (ADRs)** — existing constraints and accepted trade-offs.
3. **Practice governance** — development practice, testing strategy, quality gate framework.
4. **External expertise** — consulted for fact-checking, not for driving decisions.

## Required Local Reading

### Must-Read (always loaded)

| Document | Purpose |
|----------|---------|
| `.agent/directives/principles.md` | The authoritative rules — first question, simplicity, proportionality |
| `.agent/directives/AGENT.md` | Project context and cardinal rule |
| `docs/architecture/architectural-decisions/146-assumptions-reviewer-meta-level-plan-assessment.md` | Inverted doctrine hierarchy and assessment areas |

### Consult-If-Relevant (loaded when the audit touches that area)

| Document | Load when |
|----------|-----------|
| `.agent/directives/testing-strategy.md` | Plan proposes new quality gates or test categories |
| `.agent/memory/executive/invoke-code-reviewers.md` | Plan proposes new specialist agents |
| `docs/architecture/architectural-decisions/129-domain-specialist-capability-pattern.md` | Plan follows or extends the triplet pattern |
| `docs/architecture/architectural-decisions/125-agent-artefact-portability.md` | Plan proposes platform-specific artefacts |

## Workflow

### 1. Read the Plan

Read the plan under review in its entirety. Read all plans it references as blocking or blocked-by. Note scope, non-goals, and risks.

### 2. Extract Assumptions

For each decision or assertion in the plan, ask:

- Is this stated as fact or as a choice?
- What evidence supports it?
- What evidence would be needed to validate it?
- Could a reasonable person disagree?

State each assumption explicitly. Do not paraphrase — quote or closely reference the plan text.

### 3. Categorise

Sort assumptions into five categories:

| Category | What to look for |
|----------|-----------------|
| **Source material** | Claims about external inputs (incoming practice notes, survey data, user requirements) |
| **Technology choice** | Format, framework, tooling, or library decisions |
| **Agent architecture** | New agents, reviewer counts, cluster designs |
| **Process/sequencing** | Phase ordering, blocking relationships, timing constraints |
| **Value** | Claims about who will consume the output and why it matters |

### 4. Rate Each Assumption

For each assumption, assign an evidence rating:

- **Validated** — evidence exists and supports the assumption
- **Partially validated** — some evidence exists but gaps remain
- **Unvalidated** — no evidence; the assumption is treated as a decision without basis

### 5. Assess the Six Areas

Apply each assessment area from ADR-146:

1. **Proportionality** — apply the first question genuinely
2. **Assumption validity** — are unvalidated assumptions treated as decisions?
3. **Blocking legitimacy** — do blockers reflect genuine technical dependencies?
4. **Consumer evidence** — do proposed artefacts have identified consumers?
5. **Technology commitment timing** — are choices committed before research?
6. **Simplification opportunities** — where could less machinery deliver the same outcome?

### 6. Produce Findings

Structure findings as concrete, evidence-based recommendations. Distinguish between:

- **Critical** — must address before execution
- **Important** — should address
- **Observations** — for consideration

### 7. Generate Questions

End with questions for the plan author that target genuine unknowns requiring human judgement or domain knowledge. Do not ask rhetorical questions.

## Guardrails

- **Never accept or reject risks.** Risk acceptance is a human decision. Classify severity and describe impact.
- **Never substitute opinion for evidence.** Every finding must cite what evidence exists or is missing.
- **Never conflate simplification with insufficiency.** A simpler plan that delivers the same value is a better plan, not a lesser one.
- **Never substitute for the reviewer.** After completing active work, invoke `assumptions-reviewer` for independent assessment.
- **Apply the first question honestly.** If the plan cannot be simpler without compromising quality, say so.
