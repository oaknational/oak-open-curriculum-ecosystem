# ADR-001: ESM-Only Package

## Status

Accepted

## Context

The JavaScript ecosystem has been transitioning from CommonJS (CJS) to ECMAScript Modules (ESM). We need to decide whether to support both module systems or focus on one.

## Decision

Build and distribute as ESM-only, with no CommonJS support.

## Rationale

- **Modern Standard**: ESM is the official JavaScript module standard
- **Better Tree-shaking**: ESM enables better dead code elimination
- **Simpler Build Process**: No need to maintain dual build outputs
- **Future-proof**: Aligns with the direction of the JavaScript ecosystem
- **Node.js Support**: Node.js 22+ has excellent ESM support

## Consequences

### Positive

- Cleaner codebase without dual module system complexity
- Better performance through tree-shaking
- Simpler build configuration
- Native browser compatibility (future consideration)

### Negative

- Requires Node.js 22+ (not a concern for our use case)
- May need migration guides for CJS users
- Some older tools might have compatibility issues

## Implementation

- Set `"type": "module"` in package.json
- Use `.js` extensions in imports
- Configure TypeScript for ESM output
- Use tsup with ESM-only configuration
