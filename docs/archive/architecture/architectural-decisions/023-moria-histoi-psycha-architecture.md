# ADR-023: Moria/Histoi/Psycha Architecture

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

We will evolve from the two-tier genotype/phenotype model to a three-tier workspace architecture, while maintaining a separate internal psychon architecture. This resolves naming conflicts and clarifies different architectural concerns.

### Two Complementary Architectural Models

#### Workspace Architecture (Package Organization)

How packages relate to each other in the workspace:

1. **Moria (Μόρια) - Molecules/Atoms**
   - Location: `ecosystem/moria/`
   - Package: `@oaknational/mcp-moria`
   - Nature: The smallest units - pure interfaces, types, algorithms
   - Contents: Abstract patterns with zero dependencies, no IO
   - Metaphor: Like molecules that form the basic building blocks

2. **Histoi (Ἱστοί) - Tissues/Matrices**
   - Location: `ecosystem/histoi/`
   - Packages: Multiple tissue packages (`@oaknational/mcp-histos-*`)
   - Nature: Connective tissues/matrices that bind and connect organisms
   - Key Features: Runtime adaptation, tree-shaking, transplantable across organisms
   - Examples:
     - `@oaknational/mcp-histos-logger` - Adaptive logging tissue
     - `@oaknational/mcp-histos-storage` - Adaptive storage tissue
     - `@oaknational/mcp-histos-env` - Environment adaptation tissue
     - `@oaknational/mcp-histos-transport` - Transport tissue (stdio, Streamable HTTP)

3. **Psycha (ψυχά) - Living Organisms**
   - Location: `ecosystem/psycha/`
   - Packages: Complete applications (`@oaknational/*-mcp-server`)
   - Nature: Complete, living applications - the ensouled wholes
   - Composition: Built on moria foundation, connected by histoi tissues

#### Psychon Architecture (Within Each Organism)

Each psychon contains:

- **Linear Hierarchy**: Organelles → Cells (Kytia) → Organs (Organa)
- **Cross-Cutting Chorai**: Morphai, Stroma, Aither, Phaneron (pervasive infrastructure)

This dual model avoids naming conflicts - 'organa' remains as organs within psychon, while 'histoi' are the transplantable tissue packages

### Biological Metaphor Alignment

- **Moria = Molecules/Atoms**: The smallest building blocks - pure patterns with no implementation
- **Histoi = Connective Tissues/Matrices**: Like tissues that form the connective matrix between organisms - transplantable, adaptive, binding
- **Psycha = Complete Organisms**: Living, breathing applications composed of molecules and connected by tissues
- **Chorai (within psychon) = Pervasive Infrastructure**: The four types (morphai, stroma, aither, phaneron) that flow through all levels

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

## Key Principles

### Runtime Adaptation, Not Degradation

Edge runtimes aren't "limited" - they have different capabilities:

- **Node.js**: `fs`, `process.env`, `AsyncLocalStorage`, `EventEmitter`
- **Edge**: `KV Store`, `env context`, `AsyncLocalStorage`, `EventTarget`

Organs adapt to use the available capabilities, not degrade to lowest common denominator.

### Consumer Responsibility for IO

The organism (psychon) is responsible for choosing its environment and wiring IO, while organs provide the capabilities.

### Phenotypic Plasticity

The adaptive tissues (histoi) demonstrate phenotypic plasticity - the same interface expressing differently based on environment (runtime). This is distinct from the morphai chorai within each psychon, which are abstract forms.

## Consequences

### Positive

**Technical Benefits**:

- **Optimal bundle sizes** - Tree-shaking removes unused runtime code
- **Zero configuration** in most cases (automatic runtime detection)
- **Full control** when needed (explicit imports)
- **Type safety** - Same interfaces across all environments
- **Clean dependency graph** - No circular dependencies possible

**Organizational Benefits**:

- **Clear ownership** - Each package has single responsibility
- **Independent deployment** - Organs can be versioned separately
- **Parallel development** - Teams can work on different organs
- **Easy testing** - Each organ is self-contained

**Philosophical Coherence**:

- **Aligns with biological model** perfectly
- **Follows Greek nomenclature** consistently
- **Resolves architectural tensions** completely
- **Enables future evolution** naturally

### Negative

- **More packages to manage** - Increased complexity in workspace
- **Learning curve** - Developers need to understand three-tier model
- **Version coordination** - Organs are shared dependencies requiring careful versioning

### Neutral

- **Breaking change** from current architecture
- **Requires migration** of existing oak-mcp-core
- **New naming conventions** to learn (moria/histoi/psycha)

## Implementation Plan

1. Split oak-mcp-core into moria and histoi packages
2. Create transport tissue (histos) with stdio and Streamable HTTP implementations
3. Reorganize directory structure into ecosystem/moria, ecosystem/histoi, ecosystem/psycha
4. Update all imports and package references
5. Configure conditional exports for tree-shaking
6. Document the two-model architecture and migration path

## References

- Phase 4 completion insights about architectural tension
- Phase 5 Implementation Plan (`.agent/plans/phase-5-moria-histoi-psycha-evolution.md`)
- ADR-021: Genotype/Phenotype with Distributed Chorai
- ADR-022: Conditional Dependencies Pattern
- Complex systems research on early warning signals (Scheffer et al., 2009)
