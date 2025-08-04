# ESLint Zones for Biological Architecture

This document describes how to configure ESLint to enforce the boundaries of our biological architecture using zones.

## Overview

Our biological architecture has clear boundaries:

- **Chorai** (pervasive fields) flow everywhere but should only be accessed through public APIs
- **Organa** (discrete organs) must never import from other organa
- **Psychon** wires everything together and can import from anywhere

## ESLint Configuration for Biological Architecture

Add the following configuration to `eslint.config.ts` to enforce architectural boundaries:

```typescript
// Add to imports
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';

// Add to the config array
{
  // Settings for import resolver
  settings: {
    'import-x/resolver': createTypeScriptImportResolver({
      project: true,
      alwaysTryTypes: true,
    }),
  },
},
{
  // Enforce biological architecture boundaries
  rules: {
    // 1. No cross-organ imports
    'import-x/no-restricted-paths': [
      'error',
      {
        zones: [
          // Notion organ cannot import from MCP organ
          {
            target: 'src/organa/notion/**',
            from: 'src/organa/mcp/**',
            message: 'Organa must not import from other organa. Use dependency injection via psychon.',
          },
          // MCP organ cannot import from Notion organ
          {
            target: 'src/organa/mcp/**',
            from: 'src/organa/notion/**',
            message: 'Organa must not import from other organa. Use dependency injection via psychon.',
          },
          // Future organs would be added here
        ],
      },
    ],

    // 2. Chorai must be accessed through public APIs only
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          // Block deep imports into aither (logging/events)
          'chora/aither/*/internal/*',
          '!chora/aither/logging',
          '!chora/aither/logging/index',
          '!chora/aither/events',
          '!chora/aither/events/index',

          // Block deep imports into phaneron (config)
          'chora/phaneron/*/internal/*',
          '!chora/phaneron/config',
          '!chora/phaneron/config/index',

          // Block deep imports into stroma (types/contracts)
          // Note: Stroma is compile-time only, so this is more about organization
          'chora/stroma/*/internal/*',
        ],
        message: 'Import chorai through their public APIs only (index.ts)',
      },
    ],

    // 3. Already configured: No upward imports
    'import-x/no-relative-parent-imports': 'error', // Change from warn to error
  },
},
{
  // Psychon can import from anywhere
  files: ['src/psychon.ts'],
  rules: {
    'import-x/no-restricted-paths': 'off',
    'no-restricted-imports': 'off',
  },
},
{
  // Test files can have more relaxed rules
  files: ['**/*.test.ts', '**/*.spec.ts'],
  rules: {
    'import-x/no-restricted-paths': 'off',
    'import-x/no-relative-parent-imports': 'off',
  },
},
```

## Zone Definitions Explained

### 1. Cross-Organ Import Prevention

```typescript
{
  target: 'src/organa/notion/**',
  from: 'src/organa/mcp/**',
  message: 'Organa must not import from other organa. Use dependency injection via psychon.',
}
```

This prevents the Notion organ from importing anything from the MCP organ. The reverse rule prevents MCP from importing from Notion.

### 2. Chorai Public API Enforcement

```typescript
patterns: [
  'chora/aither/*/internal/*', // Block internal imports
  '!chora/aither/logging', // Allow public API
  '!chora/aither/logging/index', // Allow explicit index
];
```

This pattern blocks deep imports into chorai internals while allowing imports from the public API.

### 3. Upward Import Prevention

```typescript
'import-x/no-relative-parent-imports': 'error'
```

This rule (already in place) prevents `../` imports, which helps maintain proper architectural boundaries.

## Adding New Organs

When adding a new organ (e.g., `github`), add these zones:

```typescript
// Prevent GitHub organ from importing other organs
{
  target: 'src/organa/github/**',
  from: ['src/organa/notion/**', 'src/organa/mcp/**'],
  message: 'Organa must not import from other organa.',
},
// Prevent other organs from importing GitHub
{
  target: ['src/organa/notion/**', 'src/organa/mcp/**'],
  from: 'src/organa/github/**',
  message: 'Organa must not import from other organa.',
},
```

## Benefits

1. **Automatic Enforcement**: ESLint will catch architectural violations during development
2. **Clear Error Messages**: Developers get immediate feedback about why an import is forbidden
3. **CI/CD Integration**: Violations will fail the build, preventing architectural decay
4. **Progressive Enhancement**: Start with warnings, move to errors as the team adapts

## Implementation Timeline

1. **Phase 1** (Current): Document the configuration
2. **Phase 2**: After psychon.ts is created and organs are properly wired
3. **Phase 3**: Add the configuration to eslint.config.ts
4. **Phase 4**: Fix any violations that appear
5. **Phase 5**: Change warnings to errors for strict enforcement

## References

- [ESLint Plugin Import-X Documentation](https://github.com/import-js/eslint-plugin-import-x)
- [Biological Architecture Guide](../agent-guidance/architecture.md)
- [Boundary Enforcement with ESLint](.agent/reference/architecture/boundary-enforcement-with-eslint.md)
