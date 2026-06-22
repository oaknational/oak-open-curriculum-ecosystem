# Phase 3: Complete Organism Integration Analysis

## Current State

We have directories sitting outside the biological architecture that are actually integral parts of the organism:

```text
src/
├── errors/          # Error handling system
├── utils/           # PII scrubbing utilities
├── types/           # Dependency interfaces
└── test-helpers/    # Test factories and mocks
```

## Analysis: Where Each Belongs

### 1. errors/ → chora/aither/errors/

**What**: Global error handling system
**Why**: Error handling is the organism's alert/pain system. Like logging and events, errors flow through the entire organism as divine flows (aither).
**Biological Metaphor**: Pain receptors and alert systems that signal problems throughout the organism.

### 2. utils/scrubbing → chora/aither/immunity/

**What**: PII scrubbing utilities
**Why**: Data scrubbing is the organism's immune system, protecting it from exposing sensitive information. It must flow through all layers to protect data.
**Biological Metaphor**: Immune system that identifies and neutralizes threats (PII) before they can harm (expose) the organism.

### 3. types/ → chora/stroma/types/

**What**: Dependency interfaces and environment types
**Why**: These interfaces define the structural contracts for how the organism interacts with its environment. They're compile-time structures, part of stroma.
**Current Contents**:

- `dependencies.ts` - Core dependency interfaces
- `environment.ts` - Environment variable types

### 4. test-helpers/ → Remains External

**What**: Test factories and mocks
**Why**: These are laboratory equipment used to observe and test the organism from outside. They're not part of the living system.
**Biological Metaphor**: Microscopes, petri dishes, and other tools scientists use to study organisms.

## Integration Plan

### Step 1: Create New Chora Subdivisions

```bash
mkdir -p src/chora/aither/errors
mkdir -p src/chora/aither/immunity
```

### Step 2: Move and Integrate

1. `git mv src/errors/* src/chora/aither/errors/`
2. `git mv src/utils/* src/chora/aither/immunity/`
3. Move types content to existing `src/chora/stroma/types/`
   - Merge with existing types
   - Remove duplicate definitions

### Step 3: Update Imports

All imports of:

- `../../errors/` → `../../chora/aither/errors/`
- `../../utils/` → `../../chora/aither/immunity/`
- `../../types/` → `../../chora/stroma/types/`

## Philosophical Justification

The organism must be complete and self-contained. Critical functions like error handling and data protection cannot be "external tools" - they must be integrated systems within the living whole. This completes our biological architecture by ensuring all essential life functions are contained within the organism.

## Expected Outcome

After integration:

- **Chora** will contain all pervasive infrastructure
- **Organa** remain isolated business logic
- **Test helpers** remain external as observation tools
- The organism will be complete with all essential systems
