# Phase 3: Import Warning Resolution Plan

## Summary

91 import warnings will be resolved through:

- **73 warnings (80%)**: Automatically resolved by directory restructuring
- **18 warnings (20%)**: Require dependency injection or file consolidation

## Automatic Resolution (73 warnings)

### Category 1: Substrate → Chora/Stroma Transformation (15 warnings)

When `substrate/` becomes `chora/stroma/`, these imports become allowed:

```typescript
// Before (warning):
// organa/mcp/tools/notion-operations/search.ts
import type { NotionOperations } from '../../../../substrate/contracts/notion-operations.js';

// After (allowed - organa can import from chora):
import type { NotionOperations } from '../../../../chora/stroma/contracts/notion-operations.js';
```

**Files affected**:

- 5 files in `organa/mcp/tools/notion-operations/`
- 1 file in `organa/notion/index.ts`
- 9 internal substrate references

### Category 2: Systems → Chora Transformation (25 warnings)

When `systems/` splits into `chora/aither/` and `chora/phaneron/`:

```typescript
// Before (warning - internal parent import):
// systems/logging/formatters/pretty-colors.ts
import type { LogLevel } from '../types/index.js';

// After (allowed - same chora field):
// chora/aither/logging/formatters/pretty-colors.ts
import type { LogLevel } from '../types/index.js';
```

**Files affected**:

- 23 files in `systems/logging/` (formatters, transports)
- 2 files in `systems/events/`

### Category 3: Internal MCP Tool Structure (15 warnings)

Tool definitions importing from core:

```typescript
// Before (warning):
// organa/mcp/tools/definitions/search.ts
import type { ToolDefinition } from '../core/types.js';

// After (still warning, but fixable by flattening structure)
```

**Resolution**: Flatten tool structure or make core exports available at organ level.

### Category 4: Types → Chora/Stroma (8 warnings)

When `types/` content moves to `chora/stroma/types/`:

```typescript
// Before (warning):
// organa/mcp/handlers.ts
import type { McpDependencies } from '../../types/dependencies.js';

// After (allowed):
import type { McpDependencies } from '../../chora/stroma/types/dependencies.js';
```

## Manual Resolution Required (18 warnings)

### Category 5: Utility Dependencies (4 warnings)

**Problem**: Direct imports of `utils/scrubbing.js`

**Files**:

- `organa/mcp/handlers.ts`
- `organa/mcp/resources/handlers/discovery.ts`
- `organa/notion/transformers.ts`
- `systems/logging/logger.ts`

**Solution**: Inject scrubbing utilities through dependency injection

```typescript
// Before:
import { scrubPII } from '../../utils/scrubbing.js';

// After:
export interface Dependencies {
  scrubber: {
    scrubPII: (text: string) => string;
  };
}
```

### Category 6: Cross-Organ References (0 warnings)

**Status**: Already resolved! No cross-organ imports found.

### Category 7: Structural Improvements (14 warnings)

**Within organa/mcp/tools/**:

- Flatten directory structure to eliminate `../core/` imports
- Or create proper public API exports at tool level

**Within organa/notion/formatting/**:

- Move shared transformers to same level as formatters
- Or inject as dependencies

## Implementation Order

### Step 1: Directory Moves (Resolves 73 warnings)

```bash
# 1. Create new structure
mkdir -p src/chora/{stroma,aither,phaneron}

# 2. Move substrate
mv src/substrate/* src/chora/stroma/

# 3. Move systems (split)
mv src/systems/logging src/chora/aither/
mv src/systems/events src/chora/aither/
mv src/systems/config src/chora/phaneron/

# 4. Update imports (automated script)
```

### Step 2: Dependency Injection Setup (Resolves 4 warnings)

```typescript
// src/psychon.ts
import { scrubPII } from './utils/scrubbing.js';

const dependencies = {
  scrubber: { scrubPII },
  // ... other injected dependencies
};

// Pass to organs during creation
const notion = createNotionOperations({ ...dependencies });
const mcp = createMcpServer({ ...dependencies, notionOperations: notion });
```

### Step 3: Structural Flattening (Resolves 14 warnings)

Options:

1. **Flatten tool structure**: Move all tool files to same level
2. **Create barrel exports**: Export core types from tool index
3. **Accept some internal imports**: Within-organ imports are acceptable

## Validation Plan

After each step:

1. Run `pnpm lint` and count warnings
2. Verify reduction matches expectation
3. Run `pnpm test` to ensure no breaks
4. Document any unexpected issues

## Expected Outcome

- **Before**: 91 warnings
- **After Step 1**: ~18 warnings
- **After Step 2**: ~14 warnings
- **After Step 3**: 0-5 warnings (depending on decisions)

## Edge Cases

1. **Circular Dependencies**: None detected, but watch for them during moves
2. **Test Imports**: Test files may need updates but aren't counted in the 91
3. **Build Scripts**: May need path updates after directory changes
