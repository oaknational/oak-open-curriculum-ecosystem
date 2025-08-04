# Organa (Ὄργανα) - Discrete Organs

**Etymology**: From Greek ὄργανον (órganon) meaning "instrument", "tool", or "organ"

**Biological Heritage**: In biology, organs are collections of tissues that work together for a specific function - discrete, bounded units with clear purposes (heart, liver, lungs).

## Why Organa?

We chose Organa for our business logic components because they are:

- **Discrete and Bounded**: Each has clear boundaries and responsibilities
- **Specialized Functions**: Like biological organs, each serves a specific purpose
- **Independent Units**: Can be understood and potentially transplanted
- **Collaborative**: Work together through defined interfaces, not direct coupling

## What Functions Here

The specialized organs of our organism:

- **notion/** - The organ that interfaces with Notion's external systems
- **mcp/** - The organ that speaks the Model Context Protocol

## Architectural Principles

1. **Single Responsibility**: Each organ has ONE primary function
2. **Clear Boundaries**: Organs are discrete - no fuzzy edges
3. **Interface-Driven**: Organs connect through contracts, not direct imports
4. **Dependency Injection**: Organs receive their chora through injection
5. **No Cross-Organ Imports**: Organs cannot import from each other

## The Organ Nature

Like biological organs:

- Each organ is built from tissues (histoi) of related cells (kytia)
- Organs use the pervasive chora (blood/lymph = aither flows)
- They're structured by the stroma (connective tissue)
- They manifest their state through phaneron (observable symptoms)
- They're tested using eidola (phantom organs in the lab)

The beauty of the organ model is that just as a heart can be transplanted between compatible organisms, our organs can potentially be moved between compatible systems - as long as the chora interfaces match.

## Inter-Organ Communication

Organs never import from each other directly. Instead:

- They communicate through events (hormones)
- They share data through injected interfaces
- They coordinate through the psychon (nervous system)

This maintains the biological principle: organs are connected by systems (circulatory, nervous), not by direct tissue fusion.
