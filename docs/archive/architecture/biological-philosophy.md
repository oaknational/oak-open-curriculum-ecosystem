# Biological Architecture: Philosophy and Implementation

> 🗺️ **Quick Navigation**: [Architecture Map](../ARCHITECTURE_MAP.md) | [Architecture Overview](../architecture-overview.md) | [High-Level Architecture](high-level-architecture.md)

## Overview

This document provides the philosophical foundation and implementation guidance for our biological architecture. While the [Naming Guide](../naming.md) explains what each term means, this document explains WHY we make the distinctions we do and HOW to apply them in practice.

> **For**: Both humans and AI agents who need to understand the deeper principles behind our architectural choices.

## Core Philosophy

Software architecture has two orthogonal dimensions:

1. **Discrete/Bounded** elements that nest hierarchically
2. **Cross-cutting/Pervasive** fields that flow through everything

This reflects the distinction between:

- **Energeia (ἐνέργεια)** - Activities/actions (what components DO)
- **Dynamis (δύναμις)** - Potentialities/access (what fields PROVIDE)

## Architectural Scales

### Workspace Architecture (Package Organization)

```text
Level               Singular → Plural                   Description
─────────────────────────────────────────────────────────────────────
Moria (Μόρια)       → Moria                            Molecules/Atoms - Pure abstractions
Histoi (Ἱστοί)      → Histoi                           Tissues/Matrices - Connective runtime-adaptive
Psycha (Ψυχά)       → Psycha                           Living Organisms - Complete applications
```

### Psychon Architecture (Within Each Organism)

```text
Level               Singular → Plural                   Description
─────────────────────────────────────────────────────────────────────
Molecule            → Molecules                         Language syntax (not our control)
Organelle           → Organelles                        Pure functions
Kytos (Κύτος)       → Kytia (Κύτια)                    Cell → Cells (modules)
Organon (ὄργανον)   → Organa (ὄργανα)                  Organ → Organs
Psychon (Ψυχόν)     → Psycha (Ψυχά)                    Soul/Living Whole → Complete organisms
```

## Cross-Cutting Chorai (Χῶραι) - Fields/Substrates

Chora (Χώρα) → Chorai (Χῶραι) - The collective of cross-cutting layers

### Currently Relevant Chorai (Within Psychon)

```text
Name                Singular → Plural                   Purpose
─────────────────────────────────────────────────────────────────────
Morphai (Μορφαί)    → Morphai (Μορφαί)                 Forms - Hidden Platonic ideals
Stroma (Στρῶμα)     → Stromata (Στρώματα)              Support/Foundation - Types, contracts
Aither (Αἰθήρ)      → Aitheres (Αἰθέρες)               Air/Essence - Logging, events, flows
Phaneron (Φανερόν)  → Phanera (Φανερά)                 Manifestation - Configuration, environment
```

> **Note on Morphai**: The hidden forms (μορφαί) are the Platonic ideals - abstract patterns that organs aspire to instantiate. Example: `ToolExecutor` pattern that all tools implement.

### Future Chorai (Noted for Completeness)

```text
Name                Singular → Plural                   Purpose
─────────────────────────────────────────────────────────────────────
Krypton (Κρυπτόν)   → Krypta (Κρυπτά)                  Secrets: hidden config, keys
Kanon (Κανών)       → Kanones (Κανόνες)                Tooling config: rules, canonical setup
Kratos (Κράτος)     → Krate (Κράτη)                    Control: auth, permissions
Nomos (Νόμος)       → Nomoi (Νόμοι)                    Rules: governance, policies
```

## Implementation Guidelines

### Filesystem Naming

- Use Latin alphabet only (no Greek characters)
- No accents or special characters
- All lowercase for directories
- Examples: `chora/`, `stroma/`, `aither/`, `organa/`, `psychon.ts`

### Documentation Convention

- Always write: English (Greek in brackets)
- Example: "The psychon (Ψυχόν) represents the ensouled application"
- Use provided singular/plural forms consistently

### Evolution to Moria/Histoi/Psycha Model

The architecture is evolving from genotype/phenotype to a three-tier workspace model:

#### Moria (Pure Abstractions)

```text
ecosystem/moria/@oaknational/mcp-moria/
├── src/
│   ├── interfaces/             # Pure interfaces (Logger, StorageProvider, etc.)
│   ├── types/                  # Pure type definitions
│   └── algorithms/             # Pure algorithms (no dependencies)
```

#### Histoi (Runtime-Adaptive Tissues)

```text
ecosystem/histoi/
├── @oaknational/mcp-histos-logger/     # Adaptive logging tissue
├── @oaknational/mcp-histos-storage/    # Adaptive storage tissue
└── @oaknational/mcp-histos-transport/  # Transport tissue (stdio, HTTP)
```

#### Psycha (Complete Organisms)

```text
ecosystem/psycha/
├── oak-notion-mcp/             # Complete Notion MCP server
│   ├── src/
│   │   ├── index.ts            # Entry point
│   │   ├── psychon/            # The soul - wiring layer
│   │   │   ├── index.ts        # Main orchestration
│   │   │   ├── wiring.ts       # Dependency injection
│   │   │   └── server.ts       # Server setup
│   │   ├── chora/              # Pervasive fields within organism
│   │   │   ├── morphai/        # Abstract patterns (Platonic forms)
│   │   │   ├── stroma/         # Types and contracts
│   │   │   ├── aither/         # Logging and events
│   │   │   └── phaneron/       # Configuration
│   │   └── organa/             # Discrete organs
│   │       ├── notion/         # Notion integration organ
│   │       └── mcp/            # MCP protocol organ
│   └── package.json
└── github-mcp/                 # Future: GitHub MCP server
```

## Key Distinctions

### Actions vs Access

- **Actions** are discrete operations performed by organa
  - Example: Loading configuration files
  - Example: Authenticating a user
  - Example: Processing a request

- **Access** is provided by chorai throughout the system
  - Example: Reading configuration values (phaneron)
  - Example: Checking permissions (future: kratos)
  - Example: Logging messages (aither)

### Philosophical Grounding

- **Chora (Χώρα)**: From Plato's Timaeus - the receptacle, the "third kind" between eternal Forms and physical manifestation. Perfect for cross-cutting concerns that provide the space where computation happens.

- **Aither (Αἰθήρ)**: The fifth element, the divine medium. Appropriate for the flows (logging, events) that animate our static structures.

- **Psychon (Ψυχόν)**: The ensouled, animated whole. More philosophically accurate than "organism" - it emphasizes the emergent consciousness when code becomes alive. In practice, this is the wiring layer (psychon/) that brings all components to life.

## Migration Notes

### From Current to Greek Nomenclature

```text
Current                         New
─────────────────────────────────────────
substrate/                  →   chora/stroma/
systems/                    →   chora/aither/
systems/config/             →   chora/phaneron/config/
organs/                     →   organa/ (already done!)
server*.ts + index.ts       →   psychon/ (wiring layer)
```

### What Doesn't Fit

Some elements don't map cleanly to biological metaphors:

- **Utilities** (scrubbing, helpers) - These are tools, not life
- **Tests** - These observe and verify, they aren't part of the organism
- **Build artifacts** - These are products, not living components

These remain in their current locations with pragmatic names.
