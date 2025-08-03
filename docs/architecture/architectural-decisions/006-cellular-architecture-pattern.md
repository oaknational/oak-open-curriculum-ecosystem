# ADR-006: Cellular Architecture Pattern

## Status

Accepted

## Context

Traditional layered architectures often lead to:

- Rigid boundaries that don't match natural domain divisions
- Upward dependencies that violate dependency inversion
- Difficulty in extracting and reusing components
- Coupling between unrelated features

We explored several architectural patterns and metaphors, eventually settling on a biological approach that better represents the organic growth and evolution of software systems.

## Decision

Adopt a complete biological architecture pattern with clear hierarchies:

- **Substrate**: The foundational layer (types, contracts, schemas) - like physics/chemistry
- **Organelles**: Smallest functional units (pure functions, utilities)
- **Cells**: Self-contained modules with clear membranes (interfaces)
- **Tissues**: Groups of similar cells working together in a domain
- **Systems**: Pervasive infrastructure (logging, events) - like nervous/circulatory systems
- **Organs**: Discrete business logic units (e.g., Notion integration, MCP protocol)
- **Organism**: The complete application
- **Ecosystem**: Multiple organisms interacting via contracts

## Rationale

- **Natural Hierarchy**: Matches how developers intuitively think about code organization
- **Clear Boundaries**: Cell membranes (interfaces) control what enters and exits
- **Flexible Growth**: New cells can be added without disrupting existing tissues
- **Evolution Friendly**: Components can evolve independently within their boundaries
- **Dependency Inversion**: Works naturally within cells, tissues communicate through signals
- **Biological Precedent**: Billions of years of evolutionary optimization

## Consequences

### Positive

- More intuitive architecture that matches mental models
- Natural separation of concerns at multiple scales
- Easy to identify where new functionality belongs
- Clear migration path from current architecture
- Supports both bottom-up and top-down design

### Negative

- New metaphor requires team education
- May seem abstract to developers unfamiliar with biology
- Need to define what each level means in practice
- Risk of over-engineering if taken too literally

## Implementation

- Map existing components to cellular hierarchy
- Define interfaces as cell membranes
- Use events/messages for inter-tissue communication
- Keep organelles (utilities) pure and reusable
- Document the metaphor mapping clearly
- Start with organs (major systems) and decompose

For detailed interface patterns, see [Tissue and Organ Interfaces](../tissue-and-organ-interfaces.md).
