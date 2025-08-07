# ADR-023: Morphai/Organa/Psycha Architecture

Date: 2025-01-07

## Status

Proposed

## Context

Phase 4's successful implementation of the genotype/phenotype model revealed a fundamental architectural tension: oak-mcp-core tries to be three different things simultaneously:

1. **Pure abstractions** (interfaces, types, algorithms) - truly generic, no IO
2. **Runtime capabilities** (env loading, file access) - need IO but are generic  
3. **Development conveniences** (dotenv loading, config helpers) - opinionated shared patterns

This violates the Single Responsibility Principle at the package level. Different kinds of shared code want to live in different places, creating architectural friction that manifests as bundling issues, runtime incompatibilities, and unclear boundaries.

## Decision

We will evolve from the two-tier genotype/phenotype model to a three-tier biological architecture with Greek nomenclature for clarity:

### Three Biological Categories

1. **Morphai (μορφαί) - Pure Forms**
   - Location: `ecosystem/morphai/`  
   - Package: `@oaknational/mcp-morphai`  
   - Nature: Pure genetic information - the Platonic forms that define what things ARE
   - Contents: Abstract interfaces, type definitions, pure algorithms
   - No runtime code, no dependencies, no IO

2. **Organa (ὄργανα) - Transplantable Organs**
   - Location: `ecosystem/organa/`  
   - Packages: Multiple organ packages (`@oaknational/mcp-organ-*`)
   - Nature: Adaptive implementations that can work in different host organisms
   - Key Features: Runtime adaptation, tree-shaking, transplantable between organisms
   - Examples:
     - `@oaknational/mcp-organ-logger` - Adaptive logging
     - `@oaknational/mcp-organ-storage` - Adaptive storage  
     - `@oaknational/mcp-organ-env` - Adaptive environment
     - `@oaknational/mcp-organ-transport` - Transport implementations (stdio, Streamable HTTP)

3. **Psycha (ψυχά) - Living Organisms**
   - Location: `ecosystem/psycha/`  
   - Packages: Complete applications (`@oaknational/*-mcp-server`)
   - Nature: Complete, living applications - the ensouled wholes
   - Composition: Uses morphai forms, incorporates organa, has own business logic

### Transport Architecture

**Local Deployment** (Current):

- stdio transport for subprocess communication
- No network overhead
- Direct process management

**Remote Deployment** (Future):

- Streamable HTTP transport for edge runtimes
- **NOT SSE** (Server-Sent Events) which is deprecated
- Session management for stateful operations
- Support for both stateless and stateful modes

### Runtime Adaptation Patterns

1. **Automatic**: Runtime detection chooses implementation
2. **Explicit**: Import specific runtime (e.g., `/node` or `/edge`)
3. **Bundler**: Configure bundler to force specific runtime

All achieved through conditional exports and dynamic imports for optimal tree-shaking.

## Consequences

### Positive

- **Resolves architectural tension** - Each type of code has its proper place
- **Optimal bundle sizes** - Tree-shaking removes unused runtime code
- **Type safety** - Same interfaces across all environments
- **Clear boundaries** - Package structure enforces separation
- **Future flexibility** - Easy to add new organs, organisms, or runtimes
- **Deployment flexibility** - Same organism can run locally or remotely
- **Philosophically coherent** - Aligns perfectly with biological model

### Negative

- **More packages to manage** - Increased complexity in workspace
- **Learning curve** - Developers need to understand three-tier model
- **Version coordination** - Organs are shared dependencies requiring careful versioning

### Neutral

- **Breaking change** from current architecture
- **Requires migration** of existing oak-mcp-core
- **New naming conventions** to learn (morphai/organa/psycha)

## Implementation Plan

1. Split oak-mcp-core into morphai and organ packages
2. Create transport organ with stdio and Streamable HTTP implementations
3. Reorganize directory structure into ecosystem/morphai, ecosystem/organa, ecosystem/psycha
4. Update all imports and package references
5. Configure conditional exports for tree-shaking
6. Document the new architecture and migration path

## References

- Phase 4 completion insights about architectural tension
- Target Architecture document (`.agent/architecture/target-architecture.md`)
- ADR-021: Genotype/Phenotype with Distributed Chorai
- ADR-022: Conditional Dependencies Pattern
- Complex systems research on early warning signals (Scheffer et al., 2009)
