# Naming: Biological Architecture with Greek Nomenclature

This document explains our naming conventions and the complete biological hierarchy used in our architecture, from molecular syntax features to ecosystem-level abstractions.

> **Quick Reference**: See [Architecture Overview](./architecture-overview.md) for how this naming system is implemented in practice.

## Overview

Our architecture follows a biological model with three fundamental categories:

1. **Discrete Hierarchy** - Bounded assemblies that nest hierarchically
2. **Cross-Cutting Chōra** - Pervasive fields that flow through all levels
3. **Parallel Phantom Layer** - Testing infrastructure that mirrors the living system

## Discrete Hierarchy (Bounded Assemblies)

The discrete hierarchy represents bounded, nestable components - from molecular syntax to living organisms:

### Morion (Μόριον) → Moria (Μόρια) [Molecule → Molecules]

**Meaning**: The smallest compositional units - individual syntax features, expressions, or micro-patterns

- **Examples**: A single decorator, a guard clause, a type annotation
- **Current Usage**: Not yet implemented (future consideration for AST-level patterns)

### Organelle → Organelles [Organelle → Organelles]

**Meaning**: Pure functions with no side effects - the cellular machinery

- **Examples**: Data transformers, formatters, validators, calculators
- **Current Implementation**: Pure functions throughout (e.g., `formatPageSummary`, `transformPage`)

### Kytos (Κύτος) → Kytia (Κύτια) [Cell → Cells]

**Meaning**: Self-contained modules - the basic units of life

- **Examples**: Individual TypeScript modules with focused responsibilities
- **Current Implementation**: Each `.ts` file represents a cell

### Histos (Ἱστός) → Histoi (Ἱστοί) [Tissue → Tissues]

**Meaning**: Related cells working together - libraries or directories

- **Examples**: `logging/formatters/`, `notion/transformers/`
- **Current Implementation**: Subdirectories within organs

### Organon (ὄργανον) → Organa (ὄργανα) [Organ → Organs]

**Meaning**: Discrete, bounded services with specific functions

- **Examples**: Notion integration, MCP protocol handling
- **Current Implementation**: `src/organa/notion/`, `src/organa/mcp/`

### Systema (Σύστημα) → Systemata (Συστήματα) [System → Systems]

**Meaning**: Grouped organs working together for complex functions

- **Examples**: Complete MCP server system (multiple organs coordinated)
- **Current Usage**: Not explicitly implemented (organs communicate via DI)

### Psychon (Ψυχόν) → Psycha (Ψυχά) [Organism → Organisms]

**Meaning**: The ensouled whole - complete, living applications

- **Examples**: The oak-notion-mcp server
- **Current Implementation**: `src/psychon.ts` - wires everything together

### Ecosystema (Οἰκοσύστημα) → Ecosystemata (Οἰκοσυστήματα) [Ecosystem → Ecosystems]

**Meaning**: Multiple organisms interacting in shared environments

- **Future**: oak-notion-mcp + oak-github-mcp + oak-jira-mcp in production

### Biosphaera (Βιοσφαῖρα) → Biosphaerae (Βιοσφαῖραι) [Biosphere → Biospheres]

**Meaning**: All ecosystems - the complete living layer

- **Future**: All Oak MCP organisms across all deployments

## Cross-Cutting Chōra (Χώρα) [Fields/Substrates]

Chōra represents pervasive infrastructure that cuts across all hierarchical levels:

### Aither (Αἰθήρ) → Aitheres (Αἰθέρες) [Ether → Ethers]

**Meaning**: Divine flows that move through everything

- **Current Implementation**: `src/chora/aither/`
  - `logging/` - Nervous system carrying signals
  - `events/` - Hormonal messaging between components
  - `errors/` - Pain/alert system warning of problems
  - `immunity/` - Protective system (PII scrubbing)

### Stroma (Στρώμα) → Stromata (Στρώματα) [Layer → Layers]

**Meaning**: Structural matrix - the "physics" of the system

- **Current Implementation**: `src/chora/stroma/`
  - `types/` - Pure type definitions
  - `contracts/` - Interface definitions
  - `schemas/` - Data structure schemas

### Phaneron (Φανερόν) → Phanera (Φανερά) [Visible → Visibles]

**Meaning**: What's visible and manifest at runtime

- **Current Implementation**: `src/chora/phaneron/`
  - `config/` - Runtime configuration

### Krypton (Κρυπτόν) → Krypta (Κρυπτά) [Hidden → Hiddens]

**Meaning**: Secrets, keys, and hidden values

- **Future**: Secure credential management
- **Examples**: API keys, tokens, certificates

### Kanōn (Κανών) → Kanones (Κανόνες) [Rule → Rules]

**Meaning**: Canonical standards and tooling configuration

- **Future**: Linting rules, formatting standards, architectural rules
- **Examples**: ESLint configs, Prettier rules, architectural constraints

### Kratos (Κράτος) → Krate (Κράτη) [Power → Powers]

**Meaning**: Control, authorization, and permissions

- **Future**: Access control, rate limiting, authorization logic
- **Examples**: Permission checks, capability management

### Nomos (Νόμος) → Nomoi (Νόμοι) [Law → Laws]

**Meaning**: Policies and governance rules

- **Future**: Business rules, compliance policies
- **Examples**: Data retention policies, GDPR compliance rules

## Parallel Phantom Layer

### Eidōlon (εἴδωλον) → Eidōla (εἴδωλα) [Phantom → Phantoms]

**Meaning**: Phantoms/simulacra used for testing

- **Current Implementation**: `src/chora/eidola/`
  - Test doubles, mocks, and factories
  - Mirror the living system without being alive themselves

## Relationships and Principles

### 1. Hierarchical Nesting

- Moria compose into Organelles
- Organelles compose into Kytia
- Kytia compose into Histoi
- Histoi compose into Organa
- Organa may group into Systemata
- Systemata compose into Psycha
- Psycha interact in Ecosystemata
- Ecosystemata form the Biosphaera

### 2. Chōra Pervasion

- Chōra fields cut across ALL hierarchical levels
- A Kytos (cell) uses Stroma types and Aither logging
- An Organon uses all Chōra fields simultaneously
- Chōra have no hierarchical relationship to each other

### 3. Eidōla Parallelism

- Eidōla exist parallel to the main hierarchy
- They simulate components at any level (cells, organs, etc.)
- Part of Chōra as they pervade testing throughout

### 4. Architectural Boundaries

- **Within Hierarchy**: Components can import from children, never parents
- **Chōra → Hierarchy**: Chōra can't import from discrete components
- **Hierarchy → Chōra**: All levels can import from any Chōra
- **Between Organa**: No direct imports - use dependency injection

## Implementation Guidelines

1. **Start with Organa**: Most features begin as organs
2. **Extract Organelles**: Pull out pure functions
3. **Group into Histoi**: Related cells form tissues
4. **Identify Chōra**: Extract truly cross-cutting concerns
5. **Create Eidōla**: Build phantoms for testing
6. **Wire via Psychon**: Connect everything in the organism

## Why Greek Nomenclature?

1. **Precision**: Each term has specific philosophical/scientific meaning
2. **Cognitive Distance**: Foreign terms force clear thinking
3. **No Overloading**: Avoids confusion with overloaded terms like "service"
4. **Cultural Heritage**: Connects to the origins of systematic thinking

## Future Evolution

As the codebase grows, we may:

- Introduce Moria for AST-level patterns
- Implement Systemata for multi-organ coordination
- Add Krypton for secret management
- Establish Kanōn for architectural governance
- Build Kratos for authorization
- Define Nomoi for business policies

The architecture is designed to grow organically, like a living system.
