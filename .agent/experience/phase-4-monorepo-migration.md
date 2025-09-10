# Phase 4 Monorepo Migration Experience

## Date: 2025-01-05

## Summary

Successfully migrated from a single package structure to a monorepo with separate genotype (oak-mcp-core) and phenotype (oak-notion-mcp) packages.

## Key Achievements

### 1. Monorepo Structure

- Created pnpm workspace with two packages:
  - `ecosystem/oak-mcp-core`: Core MCP infrastructure (genotype)
  - `ecosystem/oak-notion-mcp`: Notion-specific implementation (phenotype)
- Used Turborepo for orchestrating builds and tests across packages
- Maintained ESM-only configuration throughout

### 2. Architectural Improvements

- **Morphai Layer**: Added new abstract pattern layer for pure types and interfaces
- **Clean Separation**: Successfully separated generic MCP patterns from Notion-specific code
- **Bundle Size**: Reduced core bundle from 708KB to 25.8KB by removing test utilities from production exports
- **KISS Principle**: Simplified `scrubSensitiveData` implementation, removing unnecessary complexity

## Critical Issues Encountered and Solutions

### 1. ESLint Configuration for Monorepo

**Problem**: ESLint couldn't properly lint TypeScript config files in workspace packages
**Root Cause**: Type-aware linting requires proper `parserOptions` configuration
**Solution**:

- Added proper `tsconfigRootDir` using `import.meta.dirname` (ESM replacement for `__dirname`)
- Created separate lint configurations for each workspace package
- Ensured config files are included in `tsconfig.lint.json`

### 2. Test Mock Failures

**Problem**: Integration tests failed with "undefined is not a string" errors
**Root Cause**: Mock formatters weren't returning values
**Solution**: Updated all mock formatters to return appropriate string values:

```typescript
formatters: {
  formatSearchResults: vi.fn().mockReturnValue('Found 2 results\nTest Page\nTest Database'),
  // ... etc
}
```

### 3. MCP Server Configuration

**Problem**: MCP server failed to start after migration
**Root Cause**: `.mcp.json` still pointed to old `src/index.ts` location
**Solution**: Updated path to `ecosystem/oak-notion-mcp/src/index.ts`
**Lesson**: External configurations need updating during structural refactoring

### 4. Lint-staged Issues

**Problem**: lint-staged caused complex issues with monorepo structure
**Solution**: Removed lint-staged entirely - pre-commit hooks can run quality gates directly
**Lesson**: Not all tools work well with monorepo structures; sometimes simpler is better

## Important Patterns Established

### 1. Import Paths

- All cross-package imports use package names: `import { Logger } from '@oaknational/mcp-core'`
- Internal imports use relative paths with `.js` extensions (ESM requirement)
- Notion helper imports require `.js` extension: `'@notionhq/client/build/src/helpers.js'`

### 2. Environment Variables

- E2E tests need explicit env configuration in `turbo.json`:

```json
"test:e2e": {
  "env": ["NOTION_API_KEY", "RUN_E2E"]
}
```

- Tests look for `.env` in root directory: `config({ path: join(process.cwd(), '../../.env') })`

### 3. Quality Gates

Always run in order after changes:

1. `pnpm format`
2. `pnpm lint`
3. `pnpm type-check`
4. `pnpm test`
5. `pnpm test:e2e`
6. `pnpm build`

## Gotchas to Remember

1. **Never commit `.turbo` cache files** - Always check git status before committing
2. **ESM requires .js extensions** even for TypeScript imports from node_modules
3. **Test utilities must not be in main exports** - They bloat the bundle and cause runtime errors
4. **Always update external configs** when moving files (`.mcp.json`, CI configs, etc.)
5. **Mock operations must return values** in integration tests, not just be `vi.fn()`

## Testing Strategy

### Unit Tests

- 57 tests in oak-mcp-core (infrastructure)
- 115 tests in oak-notion-mcp (implementation)
- All mocks should return realistic values

### E2E Tests

- Require real Notion API credentials in root `.env`
- Use `RUN_E2E=true` to enable
- Must configure environment variables in `turbo.json`

## Commands for Future Reference

```bash
# Run all quality gates
pnpm format && pnpm lint && pnpm type-check && pnpm test && pnpm build

# Run specific package commands
pnpm --filter @oaknational/mcp-core test
pnpm --filter @oaknational/oak-notion-mcp test

# Check what turbo will run
pnpm turbo run test --dry-run

# Clear turbo cache if needed
rm -rf .turbo
```

## Recommendations for Future Work

1. **Phase 4 Sub-phase 2**: Continue extracting more abstractions to morphai layer
2. **Consider nx**: If monorepo grows, consider nx for better dependency graph visualization
3. **Add changesets**: For managing versioning and changelogs in monorepo
4. **Document public APIs**: Clearly mark what's public vs internal in oak-mcp-core
5. **Integration test coverage**: Add more tests for cross-package boundaries

## Files Most Affected

Key files that required updates during migration:

- All import statements (adding `.js` extensions)
- `turbo.json` (new file for task orchestration)
- `pnpm-workspace.yaml` (workspace configuration)
- `.mcp.json` (MCP server configuration)
- Test mocks (needed return values)
- Package exports (removing test utilities)

## Success Metrics

- ✅ 0 TypeScript errors
- ✅ 0 ESLint errors
- ✅ 172 tests passing (57 core + 115 Notion)
- ✅ Bundle size reduced by 96% for core package
- ✅ Clean architectural separation achieved
- ✅ MCP server fully functional

---

_This experience document should be consulted when:_

- Setting up new workspace packages
- Debugging ESLint configuration issues
- Writing integration tests with mocks
- Troubleshooting MCP server startup
- Planning further architectural improvements
