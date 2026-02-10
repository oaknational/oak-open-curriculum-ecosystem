# Plan Templates

This directory contains templates for creating high-quality, foundation-aligned plans for architectural work, refactoring, and quality improvements.

## Available Templates

### `quality-fix-plan-template.md`

A comprehensive template for quality improvement work, derived from the excellent `e2e-test-isolation-via-di.md` plan.

**Use this template for:**

- E2E test fixes and improvements
- Refactoring for better architecture
- Eliminating technical debt
- Improving code quality and maintainability
- Any multi-phase work requiring careful validation

**Key features:**

- Foundation document commitment at each phase
- Deterministic validation commands with expected outputs
- Clear acceptance criteria for each task
- System-level impact analysis
- Quality gates after every change
- Compliance checklist for foundation documents

## How to Use a Template

### 1. Copy the Template

```bash
cp .agent/plans/templates/quality-fix-plan-template.md \
   .agent/plans/your-plan-name.md
```

### 2. Fill in All Bracketed Sections

Search for `[` in your new plan and replace all bracketed placeholders:

- `[Plan Title]` → Actual descriptive title
- `[YYYY-MM-DD]` → Current date
- `[Estimated Time]` → Realistic time estimate
- `[Issue Name]` → Specific issue descriptions
- All other bracketed sections

### 3. Customize to Your Context

**Keep:**

- Foundation document commitment structure
- Deterministic validation pattern
- Acceptance criteria approach
- Quality gate strategy
- System-level impact analysis

**Adapt:**

- Number of phases (add/remove as needed)
- Number of tasks per phase
- Specific validation commands
- Testing strategy details
- Dependencies and references

### 4. Before Starting Implementation

**Read all three foundation documents:**

1. `.agent/directives/rules.md`
2. `.agent/directives/testing-strategy.md`
3. `.agent/directives/schema-first-execution.md`

**Ask the first question:**

> "Could it be simpler without compromising quality?"

**Verify your plan:**

- No compatibility layers
- No type shortcuts
- Uses existing capabilities where possible
- Delivers system-level value
- Includes quality gates after each change

### 5. During Implementation

**At the start of each phase:**

- Re-read relevant sections from foundation documents
- Review the "Foundation Check-In" for that phase
- Verify the "Key Principle" guides your work

**After each task:**

- Run deterministic validation commands
- Check all acceptance criteria
- Only proceed when ALL criteria met

**After each phase:**

- Run full quality gate sequence
- Verify no regressions introduced

## Template Philosophy

### Deterministic Validation

Every task includes **shell commands with expected outputs**:

```bash
# Good example
grep "pattern" file.ts
# Expected: NO MATCHES (exit code 1)
```

This makes validation:

- Reproducible
- Unambiguous
- Automatable
- Self-documenting

### Foundation Alignment

Every plan must align with:

- **rules.md**: Core principles (simplicity, no type shortcuts, quality gates)
- **testing-strategy.md**: Testing philosophy (behavior not implementation, TDD)
- **schema-first-execution.md**: Type generation flow (generator is source of truth)

### System-Level Thinking

Every plan must answer:

1. **Why are we doing this?** (Immediate value)
2. **Why does that matter?** (System-level impact)
3. **What if we don't?** (Risk analysis)

## Quality Checklist

Before considering a plan complete, verify:

- [ ] All bracketed placeholders replaced with actual content
- [ ] Foundation document commitment present at each phase
- [ ] Every task has acceptance criteria
- [ ] Every task has deterministic validation commands
- [ ] Quality gate strategy defined
- [ ] System-level impact analysis included
- [ ] Foundation document compliance checklist included
- [ ] "Why This Matters" section completed
- [ ] All three foundation documents read and understood
- [ ] First question asked: "Could it be simpler?"

## Examples

### Excellent Example

See `.agent/plans/e2e-test-isolation-via-di.md` for a real-world example that:

- Uses existing DI capabilities (no new abstractions)
- Has clear deterministic validation at each step
- Includes system-level impact analysis
- Demonstrates foundation document alignment
- Shows courage (deletes boundary-violating tests)
- Investigates meta-level issues (Task 3.4: why didn't TypeScript catch this?)

### What Makes a Plan Excellent

1. **Uses existing capabilities** - No new abstractions unless truly needed
2. **Root cause over symptom** - Fixes underlying issues, not just symptoms
3. **Deterministic validation** - Clear pass/fail criteria
4. **System-level impact** - Explains value beyond immediate fix
5. **Foundation alignment** - Explicitly references and follows principles
6. **Quality gates** - Runs full gates after each change
7. **Minimal risk** - Incremental, reversible changes
8. **Clear completion** - Unambiguous "done" criteria

## Contributing

When you create a plan that proves particularly effective, consider:

1. **Documenting what worked** - Add notes about successful patterns
2. **Updating templates** - Incorporate learnings into templates
3. **Creating new templates** - If your plan solves a new category of problem

## Questions?

If uncertain about how to use a template or structure a plan:

1. Read the foundation documents (rules.md, testing-strategy.md, schema-first-execution.md)
2. Review `e2e-test-isolation-via-di.md` as a reference example
3. Ask: "Could this be simpler?"
4. Focus on system-level value, not just immediate fixes
