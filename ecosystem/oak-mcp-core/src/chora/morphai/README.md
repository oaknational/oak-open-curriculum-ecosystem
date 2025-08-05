# Morphai (μορφαί) - The Hidden Forms

## Philosophy

Morphai are the Platonic ideals - the perfect, abstract forms that exist in the realm of pure thought. In our biological architecture, they are the genetic patterns encoded in the MCP genotype that all organs aspire to instantiate.

## The Cave Allegory

In Plato's cave allegory, prisoners see only shadows on the wall, not the true forms that cast them. Similarly:

- **Morphai** are the true forms (the abstract patterns)
- **Organa** are the shadows (the concrete implementations)
- **Phenotypes** are the cave walls (the specific environments where shadows appear)

## What Morphai Contain

Morphai define the **essence** of patterns, not their implementation:

### Tool Morphai

The perfect form of what it means to be a tool:

- `ToolExecutor` - The essence of execution
- `ToolDefinition` - The nature of definition
- `ToolRegistry` - The pattern of collection

### Handler Morphai

The ideal patterns of handling:

- `RequestHandler` - The form of request processing
- `ResourceHandler` - The pattern of resource management
- `Middleware` - The shape of flow transformation

### Error Morphai

The forms that errors take:

- `ErrorHandler` - The pattern of error transformation
- `CircuitBreaker` - The form of resilience
- `RetryStrategy` - The shape of persistence

### Registry Morphai

The patterns of organization:

- `Registry` - The essence of collection
- `HierarchicalRegistry` - The form of nested organization
- `ObservableRegistry` - The pattern of reactive collections

## Usage

Morphai are inherited by phenotypes and instantiated by organs:

```typescript
// In the genotype (oak-mcp-core)
import type { ToolExecutor } from '@oaknational/mcp-core/morphai';

// In the phenotype (oak-notion-mcp)
class NotionSearchTool implements ToolExecutor<SearchInput, SearchOutput> {
  // The organ instantiates the morphe
  async execute(input: SearchInput): Promise<SearchOutput> {
    // Concrete implementation
  }
}
```

## The Principle

**Morphai define potential, organs express actuality.**

Morphai are pure types and interfaces with no implementation. They exist in the genotype as the DNA of patterns. When a phenotype expresses these genes in its environment, organs emerge as the living manifestation of these abstract forms.

## Architectural Implications

1. **Separation of Essence and Existence**: Morphai (essence) live in the genotype, implementations (existence) live in phenotypes
2. **Universal Patterns**: All MCP servers share the same morphai, ensuring consistency
3. **Evolution Through Inheritance**: New patterns can be added to morphai, automatically available to all phenotypes
4. **Type Safety as Genetic Constraint**: TypeScript ensures organs properly instantiate their morphai

## Future Considerations

As the ecosystem evolves, new morphai may emerge:

- **Stream morphai** - Patterns for data streaming
- **Cache morphai** - Forms of temporal storage
- **Transform morphai** - Patterns of data transformation
- **Compose morphai** - Forms of pattern composition

Remember: Morphai are discovered, not invented. They are the eternal forms that we gradually perceive as we understand the true nature of MCP servers.
