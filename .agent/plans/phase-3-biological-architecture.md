# Phase 3: Biological Architecture

## Executive Summary

This plan completes the biological architecture implementation by restructuring our codebase from its current state (substrate/systems/organa) to the target state (chora/organa/psychon) using Greek nomenclature for clarity.

## Current State → Target State

### Current Structure

```text
src/
├── substrate/          # Compile-time foundation
├── systems/            # Runtime infrastructure (logging, events, config)
├── organa/             # Business logic organs (notion, mcp)
└── (no organism yet)   # Components not yet unified
```

### Target Structure

```text
src/
├── chora/              # Cross-cutting fields (pervasive infrastructure)
│   ├── stroma/         # Structural matrix (types, contracts, schemas)
│   ├── aither/         # Divine flows (logging, events)
│   └── phaneron/       # Visible config (runtime settings)
├── organa/             # Discrete organs (notion, mcp)
└── psychon.ts          # The ensouled whole (wires everything together)
```

### Key Changes

1. **substrate/** → **chora/stroma/** (compile-time structures)
2. **systems/logging/** → **chora/aither/logging/** (nervous system)
3. **systems/events/** → **chora/aither/events/** (hormonal signaling)
4. **systems/config/** → **chora/phaneron/config/** (environmental sensing)
5. Create **psychon.ts** to wire all components together

## Why This Architecture

### Two Orthogonal Dimensions

1. **Discrete/Bounded** - Hierarchical components that nest (organa)
2. **Cross-cutting/Pervasive** - Fields that flow through everything (chorai)

This resolves the conceptual confusion: config is a chora (pervasive field), while Notion is an organon (bounded tool).

### Already Achieved

- ✅ Dependency injection eliminating cross-organ imports
- ✅ Flattened logging from 5 to 2 levels
- ✅ Separated infrastructure (systems) from business logic (organs)
- ✅ Renamed organs to organa
- ✅ All quality gates passing

## Implementation Phases

### Phase 1: Documentation Foundation (Days 1-2)

**Goal**: Update all architectural documentation with new nomenclature

**Critical Ordering**: Steps 1.1-1.4 and 1.6 must complete before 1.5 (architectural review sub-agent) to ensure the authoritative architectural document exists first.

#### Step 1.1: Update Root Documentation

Update README.md incorporating biological architecture concepts

- Replace biological architecture section with clear explanation of:
  - Chora (cross-cutting fields) vs Organa (discrete organs)
  - Greek nomenclature providing conceptual clarity
  - How substrate→chora/stroma, systems→chora/aither+phaneron
- Update project structure diagram to show chora/organa/psychon structure
- Explain the living system metaphor and its benefits

#### Step 1.2: Update Architecture Overview

Update docs/architecture-overview.md with biological architecture concepts

- Introduce chora vs organa distinction:
  - Chora: pervasive fields that flow through everything (logging, events, config)
  - Organa: discrete, bounded organs with specific functions (notion, mcp)
- Update all terminology:
  - organism → psychon (the ensouled whole)
  - substrate → chora/stroma (structural matrix)
  - systems → chora/aither+phaneron (divine flows + visible config)
- Revise architectural diagrams to illustrate the living system
- Explain why Greek nomenclature resolves conceptual confusion

#### Step 1.3: Consolidate Architecture Documents

Merge and update docs/architecture/

- Review master-architecture.md and high-level-architecture.md for redundancies
- Merge into single consolidated architecture document
  (remove duplicates, keep best explanations from both)
- Update all content with biological architecture terminology
- Archive outdated docs to docs/archive/:
  - tissue-and-organ-interfaces.md (tissues concept simplified out)
  - tissue-organ-example.md (tissues concept simplified out)
  - Any redundant architecture docs after merge

#### Step 1.4: Create New ADR

Create docs/architecture/architectural-decisions/020-biological-architecture.md

- Document the philosophical grounding of biological architecture
- Explain chora vs discrete distinction (cross-cutting vs bounded)
- Explain why Greek nomenclature provides clarity:
  - Avoids overloaded English terms (system, service, component)
  - Each term has precise philosophical meaning
  - Creates cognitive distance that forces clear thinking
- Document the key concepts:
  - Chora (Χώρα): Space/field that pervades and enables
  - Organon (Ὄργανον): Tool/instrument with specific function
  - Psychon (Ψυχόν): The ensouled, animated whole
  - Stroma (Στρῶμα): Supporting matrix/foundation
  - Aither (Αἰθήρ): Divine substance that flows (logs, events)
  - Phaneron (Φανερόν): What appears/is manifest (config)

#### Step 1.5: Create Architectural Review Sub-Agent

Create .claude/agents/architectural-review.md based on code-review-architect.md pattern:

- Model the structure after code-review-architect.md
- Configure to reference docs/agent-guidance/architecture.md as authoritative source
- Core responsibilities:
  - Verify architectural compliance with biological architecture
  - Ensure proper chora/organa/psychon categorization
  - Catch cross-cutting concerns placed in organs
  - Identify organs trying to be pervasive
  - Validate dependency injection patterns
  - Review for conceptual clarity and naming consistency
- Should be invoked for:
  - Major structural changes
  - New module/component creation
  - Refactoring that moves code between layers
  - Any changes that affect architectural boundaries

#### Step 1.6: Update Agent Guidance Documentation

Update all docs/agent-guidance/ files for consistency:

1. **docs/agent-guidance/architecture.md** (new) - **CRITICAL: This will be the authoritative reference**
   - Write as THE definitive architectural guide for AI agents
   - Structure it to be easily referenceable by sub-agents
   - Include:
     - Executive summary of biological architecture
     - Philosophical grounding and rationale
     - Detailed chora/organa/psychon structure explanation
     - Clear categorization rules (what goes where and why)
     - Decision trees and flowcharts for architectural decisions
     - Examples of correct vs incorrect patterns
     - Cross-references to related documents
   - This document will be referenced by future architectural-review sub-agent

2. **docs/agent-guidance/ai-agent-guide.md**
   - Update all references to old structure (substrate/systems/organs)
   - Add section on biological architecture principles
   - Update code organization guidelines

3. **docs/agent-guidance/development-practice.md**
   - Update import guidelines for new structure
   - Add examples of proper chora/organa separation
   - Update best practices for dependency injection

4. **docs/agent-guidance/experimental-architecture-quick-reference.md**
   - Complete rewrite with new nomenclature
   - Add visual diagram of chora/organa/psychon
   - Include quick lookup table for old→new mappings

5. **docs/agent-guidance/README.md**
   - Update overview to mention biological architecture
   - Add link to new architecture.md file

6. **docs/agent-guidance/safety-and-security.md**
   - Ensure security guidelines work with new structure
   - Update any path-specific recommendations

7. **docs/agent-guidance/testing-strategy.md**
   - Update test organization for new structure
   - Add guidelines for testing chorai vs organa

8. **docs/agent-guidance/typescript-practice.md**
   - Update import examples
   - Add section on typing for biological architecture

9. **docs/agent-guidance/understanding-agent-references.md**
   - Add biological architecture to key concepts
   - Update any architectural references

### Phase 2: Identify Non-Conforming Elements (Day 3)

**Goal**: Audit what doesn't fit the nomenclature and why

#### Step 2.1: Document Utilities

These are tools, not life:

- src/utils/ (scrubbing, helpers)
- src/test-helpers/
- src/errors/
  → Document: These remain pragmatically named

#### Step 2.2: Document Build/Config

These are environmental, not organismal:

- scripts/
- e2e-tests/
- Various config files
  → Document: Outside the organism boundary

#### Step 2.3: Create Migration Map

Document what moves where:
substrate/ → chora/stroma/
systems/logging/ → chora/aither/logging/
systems/events/ → chora/aither/events/
systems/config/ → chora/phaneron/config/
organa/ (already renamed from organs/)
Create psychon.ts (new)

### Phase 3: Chora Transformation (Days 4-5)

**Goal**: Restructure cross-cutting concerns into chorai

#### Step 3.1: Create Chora Structure

```bash
mkdir -p src/chora/{stroma,aither,phaneron}
```

#### Step 3.2: Move Stroma (Structural Matrix)

```bash
# Move substrate to chora/stroma
mv src/substrate/* src/chora/stroma/
rmdir src/substrate

# Update all imports:
# substrate/ → chora/stroma/
```

#### Step 3.3: Move Aither (Divine Flows)

```bash
# Move most of systems to chora/aither
mv src/systems/logging src/chora/aither/
mv src/systems/events src/chora/aither/

# Update all imports:
# systems/logging/ → chora/aither/logging/
# systems/events/ → chora/aither/events/
```

#### Step 3.4: Move Phaneron (Visible Config)

```bash
# Move config to its own chora
mkdir -p src/chora/phaneron
mv src/systems/config src/chora/phaneron/
rmdir src/systems

# Update all imports:
# systems/config/ → chora/phaneron/config/
```

### Phase 4: Psychon Integration (Days 6-7)

**Goal**: Create the ensouled whole that wires all components together

#### Step 4.1: Create Psychon

```bash
# Create src/psychon.ts (replacing future organism.ts)
# This wires all chorai and organa together
# The living, breathing application
```

```typescript
// src/psychon.ts
import { createLogger } from './chora/aither/logging/index.js';
import { createEventBus } from './chora/aither/events/index.js';
import { createConfig } from './chora/phaneron/config/index.js';
import { createNotionOperations } from './organa/notion/index.js';
import { createMcpServer } from './organa/mcp/index.js';

export class Psychon {
  private chorai: {
    logger: Logger;
    events: EventBus;
    config: Config;
  };

  private organa: {
    notion: NotionOperations;
    mcp: McpServer;
  };

  constructor() {
    // Create chorai (pervasive fields)
    this.chorai = {
      logger: createLogger(),
      events: createEventBus(),
      config: createConfig(),
    };

    // Create organa with injected dependencies
    this.organa = {
      notion: createNotionOperations(),
      mcp: createMcpServer({
        logger: this.chorai.logger,
        config: this.chorai.config,
        notionOperations: this.organa.notion,
      }),
    };
  }

  async start() {
    this.chorai.logger.info('Psychon awakening...');
    await this.organa.mcp.start();
    this.chorai.logger.info('Psychon fully conscious');
  }
}
```

#### Step 4.2: Update Entry Points

```bash
# Update src/index.ts to use psychon
# Update server.ts and server-setup.ts references
```

#### Step 4.3: Update Package Exports

```bash
# Ensure all exports work with new structure
# Update any external-facing APIs
```

### Phase 5: Validation & Cleanup (Day 8)

**Goal**: Ensure everything works perfectly

#### Step 5.1: Run Quality Gates

```bash
pnpm format:check
pnpm type-check
pnpm lint
pnpm test
pnpm build
```

#### Step 5.2: Fix Import Violations

- Update any missed imports
- Ensure no cross-chora imports (except through contracts)
- Verify organa remain independent

#### Step 5.3: Update Tests

- Fix any test imports
- Ensure all tests pass
- Run e2e tests

#### Step 5.4: Final Documentation

- Update any missed documentation
- Create migration guide for future reference
- Document lessons learned

## Success Metrics

1. **Zero Errors**: All quality gates pass
2. **Clear Separation**: Chorai and organa have distinct roles
3. **Import Discipline**: No cross-chora or cross-organ imports
4. **Architectural Coherence**: Greek nomenclature used consistently
5. **Documentation Complete**: All docs reflect new architecture

## Risk Mitigation

1. **Incremental Changes**: Each step is atomic and reversible
2. **Continuous Testing**: Run tests after each major change
3. **Documentation First**: Update docs before code
4. **Git Commits**: Clear commits at each step for rollback

## Future Considerations

### When Scaling to Multiple Packages

1. **Multiple Psycha**: Each package as independent organism
2. **Shared Chorai**: Common infrastructure across packages
3. **Light-Touch Systemata**: Grouping related organa when needed

### Future Chorai

- **Krypton** (Κρυπτόν) - Secret management
- **Kratos** (Κράτος) - Authorization/permissions
- **Nomos** (Νόμος) - Rules/policies

## Timeline Summary

- **Days 1-2**: Documentation foundation
- **Day 3**: Identify non-conforming elements
- **Days 4-5**: Chora transformation (substrate→stroma, systems→aither/phaneron)
- **Days 6-7**: Psychon integration (create the ensouled whole)
- **Day 8**: Validation & clean-up

Total: 8 days to complete biological architecture implementation
