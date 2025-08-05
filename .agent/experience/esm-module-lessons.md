# ESM Module System Lessons

## Date: 2025-01-05

## Context
This repository is ESM-only (`"type": "module"` in package.json). This brings modern benefits but also specific requirements.

## Critical ESM Requirements

### 1. File Extensions are Mandatory
```typescript
// ❌ WRONG - Will fail at runtime
import { isFullPage } from '@notionhq/client/build/src/helpers';

// ✅ CORRECT - Must include .js extension
import { isFullPage } from '@notionhq/client/build/src/helpers.js';
```

**Why**: Node.js ESM resolver doesn't automatically add extensions
**When**: Always for imports from node_modules that aren't package exports

### 2. Directory Imports Need index.js
```typescript
// ❌ WRONG - Can't import directory
import { something } from './utils';

// ✅ CORRECT - Must specify file
import { something } from './utils/index.js';
```

### 3. No __dirname or __filename
```typescript
// ❌ WRONG - Not available in ESM
const configPath = path.join(__dirname, 'config.json');

// ✅ CORRECT - Use import.meta
const configPath = path.join(import.meta.dirname, 'config.json');
```

**Alternative for older Node versions**:
```typescript
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```

### 4. No require() or module.exports
```typescript
// ❌ WRONG - CommonJS syntax
const config = require('./config');
module.exports = { config };

// ✅ CORRECT - ESM syntax
import config from './config.js';
export { config };
```

## TypeScript with ESM

### tsconfig.json Settings
```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "target": "ES2022",
    "lib": ["ES2022"],
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

### Import Extensions in TypeScript
TypeScript requires `.js` extensions even though files are `.ts`:
```typescript
// In a .ts file, importing another .ts file
import { helper } from './helper.js'; // Note: .js not .ts!
```

**Why**: TypeScript doesn't rewrite imports, and the runtime will see .js files

## Common ESM Pitfalls and Solutions

### 1. Circular Dependencies
**Problem**: ESM is stricter about circular dependencies
**Solution**: 
- Use dynamic imports: `const { thing } = await import('./thing.js')`
- Restructure to avoid circles
- Create an index.js that exports in correct order

### 2. JSON Imports
```typescript
// ❌ WRONG in older Node versions
import data from './data.json';

// ✅ CORRECT - Use assert (Node 17.5+)
import data from './data.json' assert { type: 'json' };

// ✅ ALTERNATIVE - Read and parse
import { readFileSync } from 'fs';
const data = JSON.parse(readFileSync('./data.json', 'utf8'));
```

### 3. Testing with Vitest
Vitest handles ESM well, but remember:
- Mock paths need `.js` extensions
- Use `vi.mock('./module.js')` not `vi.mock('./module')`
- Dynamic imports in tests: `const { fn } = await import('./module.js')`

### 4. Build Tools
**tsup configuration for ESM**:
```typescript
export default {
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  target: 'node22',
  platform: 'node',
  splitting: false,
}
```

## Benefits We've Gained from ESM

1. **Tree shaking**: Dead code elimination works properly
2. **Top-level await**: Can use await at module level
3. **Better alignment**: Same module system in Node and browsers
4. **Cleaner imports**: No more default export ambiguity
5. **Smaller bundles**: From 708KB to 25.8KB for core package

## Debugging ESM Issues

### Common Error Messages and Solutions

1. **"Cannot find module"**
   - Check: Missing .js extension?
   - Check: Trying to import a directory?

2. **"ERR_MODULE_NOT_FOUND"**
   - Check: Is the path correct with .js extension?
   - Check: Is node_modules package ESM-compatible?

3. **"__dirname is not defined"**
   - Use: `import.meta.dirname` or workaround above

4. **"Cannot use import statement outside a module"**
   - Check: Is `"type": "module"` in package.json?
   - Check: Are you using .mjs extension?

## Tools That Work Well with ESM

- ✅ Vitest (native ESM support)
- ✅ tsup (handles ESM builds well)
- ✅ pnpm (workspace support with ESM)
- ✅ Turborepo (agnostic to module system)
- ✅ tsx (Node.js enhancement for TypeScript execution)

## Tools That Need Care

- ⚠️ Jest (needs configuration for ESM)
- ⚠️ Some older ESLint plugins
- ⚠️ Tools expecting CommonJS config files

## Migration Checklist for New Files

When creating new files in this ESM project:

- [ ] Use `.js` extensions in all imports
- [ ] Use `import` and `export`, never `require` or `module.exports`
- [ ] Use `import.meta.dirname` instead of `__dirname`
- [ ] Ensure tsconfig has correct module settings
- [ ] Test imports work at runtime, not just compile time
- [ ] Update any build configs to handle ESM

---

*Consult this document when:*
- Getting module resolution errors
- Adding new dependencies
- Setting up build configurations
- Debugging import/export issues
- Migrating CommonJS code to ESM