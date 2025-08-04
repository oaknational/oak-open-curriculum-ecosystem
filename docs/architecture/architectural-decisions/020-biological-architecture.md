# ADR-020: Biological Architecture with Greek Nomenclature

## Status

Accepted

## Context

Our codebase has evolved from traditional layered architecture to a biological model. The import warnings (103 relative imports) revealed natural boundaries that align with how biological systems organize themselves. However, English terminology like "system", "service", and "component" carry too much semantic baggage and create confusion.

We need precise language that:

1. Distinguishes between cross-cutting concerns and discrete components
2. Avoids overloaded technical terms
3. Creates cognitive distance for clearer thinking
4. Reflects the living nature of software systems

## Decision

We adopt Greek nomenclature for our biological architecture:

### Core Concepts

**Chora (Χώρα)** - "Space/Place"

- Cross-cutting fields that pervade the entire system
- Infrastructure that flows everywhere
- Cannot be contained or bounded

**Organon (Ὄργανον)** - "Tool/Instrument" (plural: Organa)

- Discrete, bounded components with specific functions
- Business logic with clear interfaces
- Self-contained with defined boundaries

**Psychon (Ψυχόν)** - "The Ensouled"

- The living whole that emerges from all parts
- The application brought to life
- More than the sum of its components

### Chora Subdivisions

**Stroma (Στρῶμα)** - "Foundation/Matrix"

- Structural support (types, contracts, schemas)
- The compile-time foundation
- Current: `substrate/`

**Aither (Αἰθήρ)** - "Divine Substance"

- That which flows throughout (logging, events)
- Runtime infrastructure that moves
- Current: `systems/logging/`, `systems/events/`

**Phaneron (Φανερόν)** - "That Which Appears"

- What becomes visible/manifest (configuration)
- Runtime settings and state
- Current: `systems/config/`

### Implementation Structure

```
src/
├── chora/              # Cross-cutting fields
│   ├── stroma/         # Types, contracts, schemas
│   ├── aither/         # Logging, events
│   └── phaneron/       # Configuration
├── organa/             # Discrete organs
│   ├── notion/         # Notion integration
│   └── mcp/            # MCP protocol
└── psychon.ts          # The living whole
```

## Consequences

### Positive

1. **Conceptual Clarity** - Greek terms have no technical baggage
2. **Philosophical Grounding** - Each term has precise meaning from Greek philosophy
3. **Cognitive Distance** - Foreign terms force deliberate thinking
4. **Natural Organization** - Reflects the pervasive vs discrete distinction
5. **Living System Metaphor** - Software as organism, not machine

### Negative

1. **Learning Curve** - Developers must learn new terminology
2. **Documentation Burden** - Must explain Greek terms
3. **Searchability** - Greek terms less discoverable

### Neutral

1. **Cultural Shift** - From mechanical to biological thinking
2. **Unique Identity** - Distinctive architectural style
3. **Academic Roots** - Connects to philosophical traditions

## Implementation Plan

### Phase 1: Documentation (Current)

- Update all architectural documents
- Create reference guides with Greek terms
- Add pronunciation guides

### Phase 2: Code Structure (Next)

- Rename directories: substrate → chora/stroma
- Move systems → chora/aither + chora/phaneron
- Create psychon.ts entry point

### Phase 3: Enforcement

- ESLint rules for import boundaries
- Zones to prevent cross-organ imports
- Ensure chorai remain pervasive

## References

- Complex Systems Theory (Meena et al., 2023)
- Greek Philosophical Terms
- Biological Organization Principles
- [Phase 3 Implementation Plan](.agent/plans/phase-3-biological-architecture.md)
