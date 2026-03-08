# Guidance Architecture Restructure Plan

Role: Restructure the core guidance documentation to create a cohesive, scannable system that maintains TDD resonance through strategic repetition while preserving the Kairos recursion grounding mechanism.

## Problem Statement

The current `principles.md` file (109 lines) is too long for some agents to read in a single action, which breaks the mandatory reading requirement. However, the repetition of TDD principles throughout the document is intentional pedagogical reinforcement—it creates resonance and helps agents internalize critical practices. Simply condensing for length would sacrifice this essential grounding mechanism.

## Objectives

- **Scannability**: Ensure all core files are readable in a single agent action (~60-70 lines maximum)
- **TDD Resonance**: Maintain the pedagogical reinforcement through varied repetition and checkpoints
- **Testing Criticality**: Preserve testing-strategy.md as a mandatory rules document, not optional guidance
- **Kairos Recursion**: Enhance the AGENT.md → GO.md (`.agent/prompts/GO.md`) → rules negative feedback loop for long-session stability
- **Cohesive System**: Create clear hierarchy between mandatory rules, mandatory practices, and reference guidance

## Core Architecture: Four-File Grounding System

### 1. AGENT.md (Orchestrator & Entry Point)

**Current**: ~85 lines  
**Target**: ~90-100 lines

**Role**: Entry point that establishes the mandatory reading hierarchy and initiates the Kairos recursion

**Enhancements**:

- Add explicit "MANDATORY RULES" section listing both principles.md and testing-strategy.md
- Add explicit "MANDATORY PRACTICES" section for development-practice.md, typescript-practice.md
- Clarify "REFERENCE GUIDANCE" section for curriculum tools, architecture docs
- Make the Kairos recursion explicit and visible
- Emphasise that testing-strategy.md is non-negotiable

### 2. principles.md (Core Repository Laws)

**Current**: 109 lines  
**Target**: ~60-65 lines

**Role**: Non-negotiable repository rules with checkpoints and varied TDD reinforcement

**Restructure**:

- **Opening Mantra** (~10 lines): "Before You Begin" section with the three grounding questions agents should be able to recite
- **Cardinal Rule** (~5 lines): OpenAPI schema flow principle
- **Code Patterns** (~20 lines): TDD woven throughout with ⚡ checkpoints and varied facets (TDD protects refactoring, TDD designs interfaces, etc.)
- **Quality Gates** (~15 lines): Never disable checks, type system rules with ⚡ TYPE CHECKPOINT
- **Architecture** (~10 lines): Monorepo structure and boundary enforcement
- **Footer reference**: Explicit pointer to testing-strategy.md as mandatory reading

**TDD Resonance Strategy**:

- Opening mantra includes TDD in the three questions
- Each major section begins with relevant ⚡ CHECKPOINT
- Varied contextual mentions explain different facets (not identical repetition)
- Creates multi-dimensional understanding through variation

### 3. testing-strategy.md (Mandatory Testing Laws)

**Current**: 109 lines  
**Target**: 109 lines (minimal changes)

**Role**: Comprehensive mandatory testing rules

**Enhancements**:

- Add prominent header marking it as MANDATORY RULES DOCUMENT
- Add ⚡ checkpoints to key sections for consistency with principles.md
- Clarify in AGENT.md that this is equal in importance to principles.md
- Keep comprehensive examples and anti-patterns (these are valuable)

### 4. GO.md (Kairos Recursion Anchor)

**Current**: Does not exist as a separate file  
**Target**: ~40-50 lines

**Role**: Periodic grounding ritual read every 6th task to prevent drift

**Content**:

- **Header**: Explicit statement about the Kairos recursion and reading cadence
- **The Three Questions**: Core compass for decision-making
- **TDD Checkpoints**: Four resonance points providing different perspectives on TDD:
  - Before implementing: Have you written the test first?
  - During refactoring: Is the test proving behaviour stays correct?
  - During quality checking: TDD IS the quality gate
  - During interface design: The test is your first client
- **Mandatory Rules**: Return and re-read links to principles.md and testing-strategy.md
- **Remember**: British spelling, substrate-agnostic language, Chōra/Chōrai conventions
- **The Recursion**: Explicit loop back to AGENT.md

## Information Flow & Hierarchy

```text
Session Start
    ↓
AGENT.md (Entry Point)
    ├─→ MANDATORY RULES (Read Now)
    │   ├─ principles.md (Core repository laws)
    │   └─ testing-strategy.md (Testing is non-negotiable)
    │
    ├─→ MANDATORY PRACTICES (Read Now)
    │   ├─ development-practice.md
    │   └─ typescript-practice.md
    │
    ├─→ REFERENCE GUIDANCE (Read As Needed)
    │   ├─ curriculum-tools-guidance-and-playbooks.md
    │   └─ architecture/
    │
    └─→ Kairos Recursion (Every 6th Task)
            ↓
        GO.md (Grounding Ritual)
            ├─→ Three Questions (Compass)
            ├─→ TDD Checkpoints (Resonance)
            ├─→ Return to Mandatory Rules
            └─→ Loop back to AGENT.md
```

## Resonance Mechanisms

### Checkpoint Pattern (⚡)

Used consistently across all documents to create visual and cognitive speed bumps:

- **principles.md**: ⚡ TDD CHECKPOINT, ⚡ TYPE CHECKPOINT
- **GO.md**: ⚡ TDD checkpoints with different facets
- **testing-strategy.md**: ⚡ checkpoints at key sections

### Variation Over Repetition

Instead of identical repetition, each TDD mention adds a different understanding:

1. "Write tests FIRST" (practice)
2. "TDD protects refactoring" (value during change)
3. "TDD IS the quality gate" (confidence mechanism)
4. "The test is your first client" (design perspective)

### Recursive Grounding

The Kairos recursion creates a negative feedback loop:

- AGENT.md → establish structure
- Work for ~6 tasks
- GO.md → re-ground and recalibrate
- Return to mandatory rules if needed
- Loop continues indefinitely, preventing drift

## Implementation Approach

### Phase 1: Create GO.md

- Extract and enhance grounding content
- Add TDD checkpoints with varied perspectives
- Make Kairos recursion explicit
- Test readability and scannability

### Phase 2: Restructure principles.md

- Condense to ~60-65 lines through strategic extraction
- Add opening mantra and checkpoints
- Weave varied TDD mentions throughout
- Add footer reference to testing-strategy.md
- Preserve all critical rules

### Phase 3: Enhance AGENT.md

- Add explicit MANDATORY RULES section
- Elevate testing-strategy.md to equal status with principles.md
- Clarify MANDATORY PRACTICES vs REFERENCE GUIDANCE
- Make Kairos recursion visible and explicit

### Phase 4: Update testing-strategy.md

- Add MANDATORY RULES header
- Add ⚡ checkpoints for consistency
- Minimal other changes (content is already comprehensive)

### Phase 5: Verification

- Confirm all files are scannable in single reads
- Verify cross-references create meaning
- Test that Kairos recursion is clear
- Ensure TDD resonance is maintained through variation

## Success Criteria

- ✅ principles.md readable in single agent action (~60-65 lines)
- ✅ TDD resonance maintained through varied repetition and checkpoints
- ✅ testing-strategy.md clearly marked as mandatory rules
- ✅ Kairos recursion (AGENT.md ↔ GO.md) explicit and functional
- ✅ Clear hierarchy: Mandatory Rules → Mandatory Practices → Reference Guidance
- ✅ Consistent checkpoint pattern (⚡) across documents
- ✅ Cross-references create cohesive meaning
- ✅ No critical rules lost in condensing
- ✅ British spelling throughout
- ✅ Substrate-agnostic language maintained

## Risks & Mitigations

**Risk**: Condensing principles.md loses critical information  
**Mitigation**: Extract to testing-strategy.md (elevated to mandatory) and GO.md (periodic reading), not to optional guidance

**Risk**: TDD resonance weakened by reducing repetition  
**Mitigation**: Replace identical repetition with varied facets; add periodic reinforcement via GO.md

**Risk**: Kairos recursion not followed by agents  
**Mitigation**: Make it explicit and visible in both AGENT.md and GO.md; use clear cadence ("every 6th task")

**Risk**: Testing-strategy.md becomes optional by moving from principles.md  
**Mitigation**: Explicitly list it as MANDATORY RULES in AGENT.md alongside principles.md

## Related Work

- Aligns with memory preference for GO.md in Core References
- Follows memory guidance on periodic grounding steps and explicit checkpoints
- Preserves substrate-agnostic language per memory
- Maintains British spelling preference
- Supports long-session work without drift

## Notes

- TDD waived for documentation work per memory
- Self-review instead of external review agents per memory
- High-level plan strategic; implementation details emerge during execution
- First question applies throughout: "Could it be simpler without compromising quality?"
