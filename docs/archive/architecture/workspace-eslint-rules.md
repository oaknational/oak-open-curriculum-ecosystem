# Workspace ESLint Rules for Moria/Histoi/Psycha Architecture

## Overview

The Moria/Histoi/Psycha workspace architecture requires specific ESLint rules to enforce proper import relationships between different tiers of the ecosystem.

## Workspace Tiers and Import Rules

### 1. Moria (Pure Molecules/Atoms)

**Location**: `ecosystem/moria/`  
**Package**: `@oaknational/mcp-moria`

**Import Rules**:

- ❌ **CANNOT** import from any other workspace packages
- ❌ **CANNOT** import from node_modules (zero dependencies)
- ✅ **CAN** only import from within itself
- ✅ **CAN** use TypeScript built-in types

```javascript
// ESLint zone configuration for Moria
{
  target: 'ecosystem/moria/**',
  from: ['ecosystem/histoi/**', 'ecosystem/psycha/**', 'node_modules/**'],
  message: 'Moria (pure molecules) cannot have any external dependencies.'
}
```

### 2. Histoi (Tissues/Matrices)

**Location**: `ecosystem/histoi/`  
**Packages**: `@oaknational/mcp-histos-*`

**Import Rules**:

- ✅ **CAN** import from Moria
- ❌ **CANNOT** import from other Histoi packages (tissues are independent)
- ❌ **CANNOT** import from Psycha
- ✅ **CAN** import runtime-specific packages (with conditional exports)
- ✅ **CAN** use workspace protocol for Moria dependency

**Critical IO Rule**:

- ❌ **CANNOT** access Node.js globals directly (`process`, `__dirname`, `__filename`)
- ❌ **CANNOT** directly use IO operations (stdin, stdout, fs, network)
- ✅ **MUST** receive all IO interfaces as injected dependencies
- ✅ **MUST** be transplantable - work in any runtime with proper interfaces

```javascript
// ESLint zone configuration for Histoi
{
  target: 'ecosystem/histoi/mcp-histos-logger/**',
  from: ['ecosystem/histoi/mcp-histos-storage/**', 'ecosystem/psycha/**'],
  message: 'Tissues cannot depend on other tissues or organisms. They can only depend on Moria.'
}

// Prevent direct IO access in Histoi
{
  'no-restricted-globals': [
    'error',
    {
      name: 'process',
      message: 'Histoi tissues must not access process directly. IO interfaces must be injected as dependencies.'
    }
  ]
}
```

### 3. Psycha (Living Organisms)

**Location**: `ecosystem/psycha/`  
**Packages**: `@oaknational/*-mcp-server`

**Import Rules**:

- ✅ **CAN** import from Moria
- ✅ **CAN** import from any Histoi packages
- ❌ **CANNOT** import from other Psycha (organisms are independent)
- ✅ **CAN** import external dependencies as needed

```javascript
// ESLint zone configuration for Psycha
{
  target: 'ecosystem/psycha/notion-mcp-server/**',
  from: ['ecosystem/psycha/github-mcp-server/**'],
  message: 'Organisms cannot import from other organisms. They are independent living entities.'
}
```

## Recommended ESLint Configuration

```typescript
// eslint.config.workspace.ts
export const workspaceArchitectureRules = {
  'import-x/no-restricted-paths': [
    'error',
    {
      zones: [
        // Moria isolation - zero dependencies
        {
          target: 'ecosystem/moria/**',
          from: ['ecosystem/histoi/**', 'ecosystem/psycha/**', 'node_modules/**'],
          message: 'Moria (pure molecules) cannot have any external dependencies.',
        },

        // Histoi isolation - tissues cannot depend on each other
        {
          target: 'ecosystem/histoi/*/**',
          from: ['ecosystem/histoi/!(${target})/**', 'ecosystem/psycha/**'],
          message: 'Tissues cannot depend on other tissues or organisms.',
        },

        // Psycha isolation - organisms are independent
        {
          target: 'ecosystem/psycha/*/**',
          from: ['ecosystem/psycha/!(${target})/**'],
          message: 'Organisms cannot import from other organisms.',
        },
      ],
    },
  ],
};
```

## Import Alias Configuration

To make imports cleaner and enforce boundaries:

```json
// tsconfig.json path mappings
{
  "compilerOptions": {
    "paths": {
      "@moria/*": ["ecosystem/moria/src/*"],
      "@histos/*": ["ecosystem/histoi/*/src"],
      "@psycha/*": ["ecosystem/psycha/*/src"]
    }
  }
}
```

## Psychon Internal Architecture Rules

Within each Psycha organism, we enforce the biological architecture pattern at the cellular level:

### Chora/Organa Separation

```javascript
// Prevent cross-organ imports
{
  'import-x/no-restricted-paths': [
    'error',
    {
      zones: [
        // Organa cannot import from other Organa
        {
          target: 'src/organa/notion/**',
          from: 'src/organa/mcp/**',
          message: 'Organs cannot import from other organs. Use dependency injection via psychon.',
        },
        {
          target: 'src/organa/mcp/**',
          from: 'src/organa/notion/**',
          message: 'Organs cannot import from other organs. Use dependency injection via psychon.',
        },
      ],
    },
  ],
}
```

### Path Alias Enforcement

```javascript
// Force use of path aliases for cross-boundary imports
{
  '@typescript-eslint/no-restricted-imports': [
    'error',
    {
      patterns: [
        {
          group: ['../../*'],
          message: 'Use path aliases for cross-boundary imports (e.g., @organa/mcp instead of ../../mcp).',
        },
        {
          group: ['**/internal/**', '**/internals/**', '**/private/**'],
          message: 'Cannot import from internal/private modules.',
        },
      ],
    },
  ],
}
```

## Enforcement Strategy

1. **Pre-commit hooks**: Run ESLint to catch violations before commit
2. **CI/CD pipeline**: Fail builds on import violations
3. **IDE integration**: Show errors in real-time during development
4. **Custom ESLint plugin**: Consider creating a plugin specifically for the biological architecture

## Benefits of These Rules

1. **Clear Boundaries**: Impossible to accidentally create circular dependencies
2. **Tree-Shaking**: Moria's zero dependencies ensure optimal bundling
3. **Transplantability**: Histoi tissues remain independent and reusable
4. **Organism Independence**: Each Psycha can evolve independently
5. **Architectural Integrity**: The biological model is enforced at build time
