# SDK Changes Needed

The following changes are needed in the oak-curriculum-sdk package:

## 1. Add .js extensions to all relative imports

For ESM compatibility, all relative imports need to have .js extensions.

### Files to update:

- `src/index.ts` - all relative imports need .js extension
- `src/client/index.ts` - all relative imports need .js extension
- All other TypeScript files with relative imports

### Example change needed:

```typescript
// Before
import { createOakClient } from './client/index';

// After
import { createOakClient } from './client/index.js';
```

This is required for the MCP server to work correctly in ESM mode.
