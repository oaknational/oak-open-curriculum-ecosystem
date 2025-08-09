# Phase 5 Tissue Implementation - Lessons Learned

**Date**: 2025-01-08
**Context**: Implementation of Moria abstractions and Histoi tissues (Logger, Storage, Environment)

## Key Architectural Insights

### 1. Feature Detection Over Runtime Detection
**Critical Learning**: Never try to detect which runtime you're in (Node.js vs Edge vs Browser). Instead, detect the features you need.

**Bad Pattern** (what we initially tried):
```typescript
// DON'T DO THIS - Runtime detection is fragile
if (process.versions.node) {
  // Node.js specific code
} else if (typeof window !== 'undefined') {
  // Browser code
}
```

**Good Pattern** (what works):
```typescript
// DO THIS - Feature detection is reliable
const g = globalThis as Record<string, unknown>;
if (typeof g.process === 'object' && g.process !== null) {
  const process = g.process as { env?: Record<string, string | undefined> };
  if (typeof process.env === 'object' && process.env !== null) {
    // We have process.env available
  }
}
```

### 2. Unified Implementations Are Better Than Multiple Exports
**Initial Approach**: Separate implementations for each runtime (node.ts, edge.ts, browser.ts) with complex conditional exports.

**Better Approach**: Single unified implementation that adapts based on available features.

Example: The Logger Tissue evolved from separate Node/Edge loggers to a single ConsolaLogger that works everywhere because Consola itself is universally compatible.

### 3. Build Configuration Consistency Is Critical

**Problem Encountered**: Type declarations weren't being generated despite having the right configuration.

**Key Requirements for All Packages**:
1. package.json must include development export: `"development": "./src/index.ts"`
2. tsconfig.json must have `"declaration": true`
3. Build script should be: `"build": "tsup && tsc --emitDeclarationOnly"`
4. tsup.config.ts should have `dts: false` (let tsc handle declarations)

### 4. Don't Create Compatibility Layers
**Temptation**: Create adapters to maintain backward compatibility with existing interfaces.

**Better Approach**: Direct replacement with clear migration paths. The attempt to create a logger adapter was unnecessary complexity - better to use the Moria Logger interface directly.

### 5. Test-Driven Development for Pure Abstractions
Writing tests first for Moria was essential. With 242 tests, we have confidence in the pure abstractions. This TDD approach ensures:
- Complete coverage of edge cases
- Clear documentation of expected behavior
- Protection against regressions

## Technical Patterns That Work

### 1. Tissue Structure Pattern
Each tissue follows this structure:
```
histos-{name}/
├── src/
│   ├── index.ts         # Public exports
│   ├── adaptive.ts      # Feature detection and routing
│   ├── unified-impl.ts  # Main implementation(s)
│   ├── node.ts         # Node-specific re-exports (optional)
│   └── edge.ts         # Edge-specific re-exports (optional)
└── tests/
    ├── adaptive.test.ts
    └── unified.test.ts
```

### 2. Feature Detection Helper Pattern
```typescript
async function createAdaptiveImplementation(options?: Options): Promise<Interface> {
  // Try most capable implementation first
  try {
    await import('node:fs');
    return new NodeImplementation(options);
  } catch {
    // Fall back to less capable
    if (hasAlternativeFeature()) {
      return new AlternativeImplementation(options);
    }
  }
  
  // Fail fast with helpful error
  throw new Error('No suitable implementation available. Expected X or Y.');
}
```

### 3. Workspace Dependency Pattern
For internal dependencies in monorepo:
- Use `workspace:^` for flexibility
- Ensures local development uses source code
- Allows proper versioning when published

## Mistakes to Avoid

1. **Don't disable linting/type checks** - If you need to disable them, you're doing something wrong
2. **Don't use `any` type** - Use proper type assertions or unknown with guards
3. **Don't guess at runtime capabilities** - Test for specific features
4. **Don't create complex build configurations** - Keep it simple and consistent
5. **Don't try to maintain backward compatibility** - Clean breaks with migration guides

## Process Improvements

### Quality Gates Matter
Running `format → type-check → lint → test → build` after each change catches issues early. Never skip these gates or disable checks.

### Grounding in Rules
Regular grounding in GO.md and rules.md prevents drift. The biological architecture provides clear boundaries that prevent scope creep.

### Small, Atomic Commits
Each tissue was developed and committed separately, making it easy to track progress and revert if needed.

## Next Steps Recommendations

1. **Integration First**: Before creating more tissues, integrate existing ones into oak-notion-mcp to validate the architecture
2. **Document Patterns**: Create a tissue template/generator to ensure consistency
3. **Performance Benchmarks**: Establish baseline metrics before adding more complexity
4. **Publishing Strategy**: Consider how tissues will be versioned and published independently

## Summary

The tissue architecture is proving successful. The key is maintaining simplicity through:
- Direct feature detection
- Unified implementations
- Consistent build configuration
- No compatibility layers
- Clear separation of concerns

The biological model (Moria/Histoi/Psycha) provides excellent mental models for architectural boundaries and helps prevent the mixing of concerns that plagued the original oak-mcp-core monolith.