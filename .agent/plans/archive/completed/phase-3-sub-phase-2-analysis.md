# Phase 3 Sub-Phase 2: Non-Conforming Elements Analysis

## Overview

Analyzing the 91 import warnings to understand architectural boundaries and what doesn't fit biological nomenclature.

## Import Warning Patterns

### 1. Cross-Layer Imports (Most Common)

**Organa importing from outside their boundaries:**

- `organa/mcp/` → `utils/scrubbing.js` (2 occurrences)
- `organa/mcp/` → `types/dependencies.js` (8 occurrences)
- `organa/mcp/` → `substrate/contracts/notion-operations.js` (5 occurrences)
- `organa/notion/` → `utils/scrubbing.js` (1 occurrence)
- `organa/notion/` → `substrate/contracts/notion-operations.js` (1 occurrence)

**Systems importing from substrate:**

- `systems/config/` → `substrate/types/logging.js` (1 occurrence)
- `systems/events/` → `substrate/contracts/event-bus.js` (2 occurrences)
- `systems/logging/` → `utils/scrubbing.js` (1 occurrence)

**Substrate internal references:**

- `substrate/contracts/logger.ts` → `substrate/types/logging.js`
- `substrate/types/core.ts` → `substrate/contracts/logger.js`
- `substrate/types/core.ts` → `substrate/contracts/config.js`

### 2. Internal Parent Imports

**Within MCP organ:**

- Tool definitions → `../core/types.js` (10 occurrences)
- Resources → `../uri-parser.js` (1 occurrence)
- Various → `../../types.js` (4 occurrences)

**Within logging system:**

- Formatters → `../types/index.js` (23 occurrences)
- Transports → `../logger-interface.js` (4 occurrences)
- Colors → `../types/levels.js` (2 occurrences)

**Within Notion organ:**

- Formatters → `../transformers.js` (2 occurrences)

## Non-Conforming Elements

### 1. Utilities (Stay Pragmatically Named)

**Location**: `src/utils/`

- `scrubbing.ts` - PII scrubbing utility

**Rationale**: These are tools, not living parts of the organism. They're like surgical instruments - used by the organism but not part of it.

**Import Pattern**: Currently imported by organa and systems. After transformation, these should be injected as dependencies.

### 2. Types (Stay Pragmatically Named)

**Location**: `src/types/`

- `dependencies.ts` - Dependency interfaces
- `environment.ts` - Environment types

**Rationale**: These are transitional types that will be absorbed into chora/stroma during transformation.

### 3. Test Helpers (Stay Outside Organism)

**Location**: `src/test-helpers/`

- Test factories and mocks

**Rationale**: Testing infrastructure exists outside the organism boundary.

### 4. Error Handler (Needs Decision)

**Location**: `src/errors/`

- `error-handler.ts` - Global error handling

**Decision Needed**: Could become part of chora/aither (error flows) or stay pragmatic.

### 5. Build and Config Files (Outside Organism)

**Files**:

- `scripts/` - Build and analysis scripts
- `e2e-tests/` - End-to-end tests
- Config files (`tsconfig.json`, `eslint.config.ts`, etc.)

**Rationale**: Environmental configuration, not part of the living system.

## Migration Map

### Phase 3 Sub-Phase 3: Directory Transformations

```bash
# 1. Substrate → Chora/Stroma (compile-time structure)
src/substrate/ → src/chora/stroma/
  contracts/ → contracts/
  event-schemas/ → event-schemas/
  types/ → types/

# 2. Systems → Chora (pervasive infrastructure)
src/systems/logging/ → src/chora/aither/logging/
src/systems/events/ → src/chora/aither/events/
src/systems/config/ → src/chora/phaneron/config/

# 3. Organa (already correctly named)
src/organa/ (no change in location)

# 4. Create Psychon (new)
(new file) → src/psychon.ts
```

### What Stays Where It Is

```bash
src/utils/          # Pragmatic utilities
src/types/          # Transitional types (will be absorbed)
src/test-helpers/   # Test infrastructure
src/errors/         # Error handling (decision pending)
e2e-tests/          # E2E tests
scripts/            # Build scripts
```

## Import Resolution Strategy

### 1. Cross-Layer Imports (substrate/systems/organa)

**Problem**: 25+ imports crossing architectural boundaries
**Solution**: After moving to chora/, these become natural imports:

- Organa can import from chora (allowed)
- Chora subdivisions can import from each other (allowed)

### 2. Utility Imports

**Problem**: `utils/scrubbing.js` imported by multiple layers
**Solution**: Inject as dependency through psychon.ts

### 3. Type Imports

**Problem**: `types/dependencies.js` imported across layers
**Solution**: Move to `chora/stroma/types/` as part of structural matrix

### 4. Internal Parent Imports

**Problem**: 66 imports using `../` within modules
**Solution**: Most will resolve naturally after directory restructuring

## Key Insights

1. **91 Warnings = 91 Architectural Truths**: Each warning shows where a boundary naturally wants to form.

2. **Three Categories of Non-Conformance**:
   - **Absorbed**: Types and contracts that become part of chora/stroma
   - **Injected**: Utilities that become dependencies
   - **External**: Build tools and tests that stay outside

3. **Natural Resolution**: ~80% of warnings will resolve automatically after directory restructuring because:
   - Substrate → chora/stroma (organa can import)
   - Systems → chora/aither+phaneron (organa can import)
   - Internal `../` imports become same-level after restructuring

4. **Remaining Work**: ~20% require dependency injection pattern (mainly utilities)

## Next Steps

1. Document complete migration plan with specific file movements
2. Plan utility injection through psychon.ts
3. Decide on error handler placement
4. Create import update script for automated transformation
