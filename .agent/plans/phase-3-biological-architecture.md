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

#### Step 1.1: Update Root Documentation

```bash
# Update README.md using .agent/plans/biological-architecture-reference.md
- Replace biological architecture section with content from reference
- Update project structure diagram to show chora/organa structure
- Add link to biological architecture reference
```

#### Step 1.2: Update Architecture Overview

```bash
# Update docs/architecture-overview.md using biological-architecture-reference.md
- Introduce chora vs discrete distinction from reference
- Update all terminology (organism → psychon, etc.)
- Revise architectural diagrams to match reference
- Ensure consistency with biological architecture concepts
```

#### Step 1.3: Consolidate Architecture Documents

```bash
# Merge and update docs/architecture/
- Review master-architecture.md and high-level-architecture.md for redundancies
- Merge into single consolidated architecture document
  (remove duplicates, keep best explanations from both)
- Update all content with biological architecture terminology
- Archive outdated docs to docs/archive/:
  - tissue-and-organ-interfaces.md (tissues concept simplified out)
  - tissue-organ-example.md (tissues concept simplified out)
  - Any redundant architecture docs after merge
```

#### Step 1.4: Create New ADR

```bash
# Create docs/architecture/architectural-decisions/020-biological-architecture.md
- Document the philosophical grounding of biological architecture
- Explain chora vs discrete distinction (cross-cutting vs bounded)
- Reference .agent/plans/biological-architecture-reference.md
- Explain why Greek nomenclature provides clarity
```

### Phase 2: Identify Non-Conforming Elements (Day 3)

**Goal**: Audit what doesn't fit the nomenclature and why

#### Step 2.1: Document Utilities

```bash
# These are tools, not life:
- src/utils/ (scrubbing, helpers)
- src/test-helpers/
- src/errors/
→ Document: These remain pragmatically named
```

#### Step 2.2: Document Build/Config

```bash
# These are environmental, not organismal:
- scripts/
- e2e-tests/
- Various config files
→ Document: Outside the organism boundary
```

#### Step 2.3: Create Migration Map

```bash
# Document what moves where:
substrate/ → chora/stroma/
systems/logging/ → chora/aither/logging/
systems/events/ → chora/aither/events/
systems/config/ → chora/phaneron/config/
organa/ (already renamed from organs/)
Create psychon.ts (new)
```

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
